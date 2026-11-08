/* Biologie BA1 · chapitre 5 : énergie et enzymes */

SFA.sim({
  id:"ub-c05-michaelis-menten", ch:"c05", tag:"Cinétique · classique",
  titre:"Michaelis-Menten : v, Vmax, Km et double inverse de Lineweaver-Burk",
  resume:"Des enzymes qui captent le substrat, le transforment et le relâchent : quand toutes sont occupées, v plafonne à Vmax. Mesure Km d'une enzyme mystère.",
  but:"Glisse le point rouge sur la courbe (ou règle [S]) : dans le tube, la fraction d'enzymes occupées vaut [S]/(Km + [S]) et les produits (hexagones) sortent au rythme v. Modifie [E], kcat et Km, bascule en double inverse et relève le défi de l'enzyme mystère.",
  aRetenir:"v = Vmax·[S]/(Km + [S]) avec Vmax = kcat·[E]. Quand [S] = Km, v = Vmax/2 : la moitié des enzymes sont occupées. Doubler [E] double Vmax mais ne change pas Km. Lineweaver-Burk : 1/v = (Km/Vmax)·(1/[S]) + 1/Vmax : droite d'ordonnée à l'origine 1/Vmax et d'abscisse à l'origine −1/Km. Efficacité catalytique : kcat/Km. Pont : chimie ch. 11 (cinétique).",
  piege:"Km n'est pas la vitesse maximale ni une mesure de « force » de l'enzyme : c'est la concentration de substrat pour laquelle v = Vmax/2. Dans le double inverse, les mesures à faible [S] (grand 1/[S]) pèsent trop sur l'ajustement : les erreurs sont déformées.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(600);
    var E=k.slider("Concentration d'enzyme [E]",1,100,1,10,"nmol/L");
    var kc=k.slider("kcat",10,1000,10,100,"s⁻¹");
    var Km=k.slider("Km",1,100,1,20,"µmol/L");
    var s=k.slider("Concentration de substrat [S]",0,200,1,20,"µmol/L");
    var lb=k.toggle("Double inverse (Lineweaver-Burk)",false);
    var dt0=k.toggle("Mesures simulées (bruit 5 %)",false);
    var ro=k.readouts(["Vmax = kcat·[E]","v à cette [S]","Enzymes occupées v / Vmax","kcat / Km"]);
    var nt=k.note("","");
    var SS=[5,10,20,40,80,160], NO=[1.04,0.97,1.03,0.96,1.05,0.98], t=0, ax=null, drag=false, rnd=B.rng(61), enz=[], subs=[], prods=[], mystK=null;
    for(var q=0;q<50;q++) subs.push({x:rnd(),y:rnd(),ph:rnd()*6.28});
    function K(){ return mystK!=null?mystK:Km.value; }
    var df=B.defi(k,function(n){ if(n%2===0){ mystK=[8,14,27,35,46,62][Math.floor(rnd()*6)]; return {id:0,txt:"enzyme mystère (Km caché) : place [S] où v = Vmax/2 (± 4 %) pour trouver Km"}; }
        mystK=null; var tg=[0.5,1,1.5][Math.floor(rnd()*3)]; return {id:1,v:tg,txt:"à [S] = 40 µmol/L, obtiens v = "+S.fmt(tg,1)+" µmol/L/s (± 3 %) en ne réglant que [E]"}; },
      function(d){ var V=kc.value*E.value/1000, v=V*s.value/(K()+s.value);
        if(d.id===0) return {ok:Math.abs(v/V-0.5)<=0.02};
        return {ok:s.value===40&&Math.abs(v-d.v)<=0.03*d.v}; });
    k.button("Révéler / retirer le mystère",function(){ if(mystK!=null){ Km.set(mystK); mystK=null; } });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8);
      if((tp==="down"||tp==="drag")&&drag){ var x=lb.value?ax.ix(p.x):ax.ix(p.x); var sv=lb.value?(x>0?1/x:200):x; s.set(Math.round(Math.max(0,Math.min(200,sv)))); k.redraw(); } if(tp==="up") drag=false; });
    function enzyme(x,y,r,occ,cat){ var ctx=c.ctx, mo=occ?.18:.55; ctx.save(); var g=ctx.createRadialGradient(x-r*.3,y-r*.3,2,x,y,r); g.addColorStop(0,"#9fc3f0"); g.addColorStop(1,"#2f62b8"); ctx.fillStyle=g;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.arc(x,y,r,mo,6.2832-mo); ctx.closePath(); ctx.fill(); ctx.strokeStyle="#1f427f"; ctx.lineWidth=1.2; ctx.stroke(); ctx.restore();
      if(occ) B.ball(c,x+r*.45,y,r*.32,cat?P.amber:P.green); }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, Kv=K(), V=kc.value*E.value/1000, sv=s.value, th=sv/(Kv+sv), v=V*th;
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+42, bx0=D.x+12, bx1=D.x+D.w-12, by0=top+4, by1=D.y+D.h-12;
      /* « tube » réactionnel */
      ctx.save(); S.draw.rrect(c,bx0,by0,bx1-bx0,by1-by0,14); ctx.fillStyle="rgba(214,232,248,.55)"; ctx.fill(); ctx.strokeStyle="#9ab8d6"; ctx.lineWidth=1.6; ctx.stroke(); ctx.restore();
      var nE=Math.max(4,Math.min(14,Math.round(E.value/100*10)+4));
      while(enz.length<nE) enz.push({x:.1+.8*rnd(),y:.15+.7*rnd(),occ:false,tm:0,ph:rnd()*6}); enz.length=nE;
      /* chaque enzyme : liaison (taux tel que l'occupation moyenne vaille θ) puis catalyse (taux ∝ kcat) */
      var kcv=.6+1.6*Math.log10(kc.value)/3, kon=th<1?kcv*th/Math.max(1e-6,1-th):99;
      enz.forEach(function(e){ var ex=bx0+20+e.x*(bx1-bx0-40)+4*Math.sin(t*.7+e.ph), ey=by0+18+e.y*(by1-by0-36)+4*Math.cos(t*.6+e.ph);
        if(!e.occ){ if(rnd()<dt*kon){ e.occ=true; e.tm=0; } } else { e.tm+=dt; if(rnd()<dt*kcv){ e.occ=false; prods.push({x:ex+10,y:ey,vx:30+rnd()*20,vy:(rnd()-.5)*30,a:1}); } }
        enzyme(ex,ey,15,e.occ,e.occ&&e.tm>.25); });
      /* substrat libre (∝ [S]) */
      var nS=Math.round(46*Math.sqrt(sv/200)); for(var i=0;i<nS;i++){ var o=subs[i]; B.ball(c,bx0+10+((o.x+.03*Math.sin(t+o.ph))%1+1)%1*(bx1-bx0-20),by0+10+((o.y+.04*Math.cos(t*.8+o.ph))%1+1)%1*(by1-by0-20),3.6,P.green); }
      prods.forEach(function(p){ p.x+=p.vx*dt; p.y+=p.vy*dt; p.a-=dt*.5; ctx.save(); ctx.globalAlpha=Math.max(0,p.a); ctx.fillStyle=P.amber; ctx.beginPath(); for(var j=0;j<6;j++){ var a=j*Math.PI/3; ctx.lineTo(p.x+4.5*Math.cos(a),p.y+4.5*Math.sin(a)); } ctx.closePath(); ctx.fill(); ctx.restore(); });
      prods=prods.filter(function(p){ return p.a>0&&p.x<bx1; });
      var occN=enz.filter(function(e){ return e.occ; }).length;
      S.draw.label(c,"enzymes occupées : "+occN+" / "+nE+" (attendu "+S.fmt(th*100,0)+" %)",(bx0+bx1)/2,by1-12,{color:P.acc,size:10});
      [[P.acc,"enzyme E"],[P.green,"substrat S"],[P.amber,"produit P"]].forEach(function(o,i){ B.ball(c,bx0+14+i*80,by0+14,4.5,o[0]); S.draw.text(c,o[1],bx0+22+i*80,by0+14,{size:9.5,color:P.ink,align:"left",halo:true}); });
      /* graphique */
      var pts=SS.map(function(x,i){ return [x,V*x/(Kv+x)*NO[i]]; });
      if(!lb.value){
        ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:48,x0:0,x1:200,y0:0,y1:V*1.15,stepX:25,stepY:V*1.15/4.6,xl:"[S] (µmol/L)",yl:"v (µmol/L/s)",fy:function(y){ return S.fmt(y,V<1?3:2); }});
        S.draw.line(c,ax.L,ax.Y(V),ax.R,ax.Y(V),P.green,1.2,[5,4]); S.draw.text(c,"Vmax",ax.R-4,ax.Y(V)-8,{size:10,color:P.green,align:"right",halo:true});
        if(mystK==null){ S.draw.line(c,ax.L,ax.Y(V/2),ax.X(Kv),ax.Y(V/2),P.amber,1.2,[4,4]); S.draw.line(c,ax.X(Kv),ax.Y(V/2),ax.X(Kv),ax.B,P.amber,1.2,[4,4]); S.draw.text(c,"Km",ax.X(Kv),ax.B-9,{size:10,color:P.amber,halo:true}); }
        else S.draw.line(c,ax.L,ax.Y(V/2),ax.R,ax.Y(V/2),P.amber,1.2,[4,4]);
        S.draw.fn(c,ax,function(x){ return V*x/(Kv+x); },P.acc,2.8);
        if(dt0.value) pts.forEach(function(p){ S.draw.dot(c,ax.X(p[0]),ax.Y(p[1]),4.5,P.violet); });
        S.draw.dot(c,ax.X(sv),ax.Y(v),8,P.red);
      } else {
        var xm1=Math.max(4/Kv,0.22);
        ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:48,x0:-1.5/Kv,x1:xm1,y0:-0.3/V,y1:1.12*((Kv*xm1+1)/V),xl:"1/[S] (L/µmol)",yl:"1/v (s·L/µmol)",fx:function(x){ return S.fmt(x,2); },fy:function(y){ return S.fmt(y,y<10?1:0); }});
        S.draw.line(c,ax.X(0),ax.T,ax.X(0),ax.B,"#a3adba",1); S.draw.line(c,ax.L,ax.Y(0),ax.R,ax.Y(0),"#a3adba",1);
        S.draw.fn(c,ax,function(x){ return (Kv/V)*x+1/V; },P.acc,2.6);
        S.draw.dot(c,ax.X(0),ax.Y(1/V),5,P.green); S.draw.text(c,"1/Vmax",ax.X(0)+8,ax.Y(1/V)-9,{size:10,color:P.green,align:"left",halo:true});
        if(mystK==null){ S.draw.dot(c,ax.X(-1/Kv),ax.Y(0),5,P.amber); S.draw.text(c,"−1/Km",ax.X(-1/Kv),ax.Y(0)-12,{size:10,color:P.amber,halo:true}); }
        if(dt0.value) pts.forEach(function(p){ S.draw.dot(c,ax.X(1/p[0]),ax.Y(1/p[1]),4.5,P.violet); });
        if(sv>0&&1/sv<=xm1) S.draw.dot(c,ax.X(1/sv),ax.Y(1/v),8,P.red);
      }
      var d=df.banner(c,13);
      ro.set(0,S.fmt(V,3)+" µmol/L/s"); ro.set(1,S.fmt(v,3)+" µmol/L/s"); ro.set(2,S.fmt(th*100,0)+" %"); ro.set(3,mystK!=null?"? (mystère)":B.sci(kc.value/(Kv*1e-6),2)+" L/mol/s");
      var n=pts.length, sx=0,sy=0,sxx=0,sxy=0; pts.forEach(function(p){ var x=1/p[0],y=1/p[1]; sx+=x;sy+=y;sxx+=x*x;sxy+=x*y; }); var sl=(n*sxy-sx*sy)/(n*sxx-sx*sx), ic=(sy-sl*sx)/n;
      nt.set((d&&d.ok?"<b>Défi réussi.</b> "+(mystK!=null?"Km = "+mystK+" µmol/L. ":""):"")+(mystK!=null?"Mode mystère : le curseur Km est ignoré. ":"")+(dt0.value?"Ajustement du double inverse sur les 6 mesures : Km ≈ "+S.fmt(sl/ic,1)+" µmol/L, Vmax ≈ "+S.fmt(1/ic,3)+" µmol/L/s. ":"")+"Animation : chaque enzyme se lie au substrat avec une probabilité telle que la fraction occupée moyenne vaille [S]/(Km + [S]) ; vitesses de cycle ralenties.",d&&d.ok?"ok":mystK!=null?"warn":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c05-inhibition-enzymatique", ch:"c05", tag:"Inhibition · lecture des graphiques",
  titre:"Inhibition enzymatique : Km et Vmax apparents, double inverse",
  resume:"Douze enzymes, un substrat (vert) et un inhibiteur (rouge) qui se fixe au site actif, ailleurs, ou seulement sur le complexe ES : reconnais chaque signature, puis démasque un inhibiteur mystère.",
  but:"Choisis le type d'inhibition, [I], Ki et [S] (curseur ou point du graphique). Le dessin montre la répartition des enzymes entre E, ES, EI et ESI ; seules les ES (contour vert) fabriquent du produit. Alterne entre v([S]) et le double inverse.",
  aRetenir:"Avec α = 1 + [I]/Ki : compétitive : Vmax inchangé, Km apparent = α·Km (droites qui se croisent sur l'axe des 1/v). Non compétitive pure : Vmax apparent = Vmax/α, Km inchangé (droites qui se croisent sur l'axe des 1/[S]). Incompétitive : Vmax/α et Km/α (droites parallèles). Un compétiteur peut être surmonté en augmentant [S] ; pas un non compétitif.",
  piege:"Dans le double inverse, « droites parallèles » = incompétitive ; « même ordonnée à l'origine » = compétitive ; « même abscisse à l'origine » = non compétitive. Ne pas confondre Ki (affinité de l'inhibiteur) et Km (affinité du substrat).",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(600);
    var ty=k.seg("Type d'inhibition (ton hypothèse en mode mystère)",[["comp","Compétitive"],["nonc","Non compétitive"],["inc","Incompétitive"]],"comp");
    var I=k.slider("[I]",0,100,1,20,"µmol/L");
    var Ki=k.slider("Ki",2,50,1,10,"µmol/L");
    var Km=k.slider("Km (sans inhibiteur)",1,100,1,20,"µmol/L");
    var s=k.slider("Concentration de substrat [S]",1,200,1,40,"µmol/L");
    var lb=k.toggle("Double inverse (Lineweaver-Burk)",false);
    var ro=k.readouts(["α = 1 + [I]/Ki","Vmax apparent (Vmax = 1)","Km apparent","Inhibition à cette [S]"]);
    var nt=k.note("","");
    var t=0, ax=null, drag=false, rnd=B.rng(71), enz=[], prods=[], myst=null;
    for(var q=0;q<12;q++) enz.push({st:"E",tm:rnd()*2,ph:rnd()*6});
    function app(tp){ var a=1+I.value/Ki.value, K=Km.value; return {a:a,Va:tp==="comp"?1:1/a,Ka:tp==="comp"?K*a:tp==="nonc"?K:K/a}; }
    function fracs(tp,sv){ var x=sv/Km.value, i=I.value/Ki.value, w={E:1,ES:x,EI:tp==="inc"?0:i,ESI:tp==="comp"?0:x*i}, z=w.E+w.ES+w.EI+w.ESI; return {E:w.E/z,ES:w.ES/z,EI:w.EI/z,ESI:w.ESI/z}; }
    var df=B.defi(k,function(n){ if(n%2===0){ var opts=["comp","nonc","inc"].filter(function(x){ return x!==ty.value; }); myst=opts[Math.floor(rnd()*2)]; if(I.value<10) I.set(30); return {id:0,txt:"inhibiteur mystère : choisis le type qui superpose ta courbe (tirets) aux mesures (points)"}; }
        myst=null; return {id:1,txt:"compétitive, [I] = Ki = 50 µmol/L, Km = 20 : quelle [S] minimale ramène l'inhibition sous 10 % ?"}; },
      function(d){ if(d.id===0) return {ok:myst!=null&&ty.value===myst&&I.value>0};
        var A=app("comp"), v0=s.value/(Km.value+s.value), v1=A.Va*s.value/(A.Ka+s.value), inh=1-v1/v0, sp=s.value-1, inh2=1-(sp/(A.Ka+sp))/(sp/(Km.value+sp));
        return {ok:ty.value==="comp"&&I.value===50&&Ki.value===50&&Km.value===20&&inh<0.1&&inh2>=0.1}; });
    k.button("Révéler le mystère",function(){ if(myst){ ty.set(myst); myst=null; } });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8);
      if((tp==="down"||tp==="drag")&&drag){ var x=ax.ix(p.x), sv=lb.value?(x>0?1/x:200):x; s.set(Math.round(Math.max(1,Math.min(200,sv)))); k.redraw(); } if(tp==="up") drag=false; });
    function enzyme(x,y,r,st,tp){ var ctx=c.ctx, occS=st==="ES"||st==="ESI", occI=st==="EI"||st==="ESI", mo=occS||(occI&&tp==="comp")?.2:.55;
      ctx.save(); var g=ctx.createRadialGradient(x-r*.3,y-r*.3,2,x,y,r); g.addColorStop(0,st==="ES"?"#a9e0c0":"#c5d3e8"); g.addColorStop(1,st==="ES"?"#2f8a62":"#5b6f8f"); ctx.fillStyle=g;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.arc(x,y,r,mo,6.2832-mo); ctx.closePath(); ctx.fill(); ctx.strokeStyle=st==="ES"?P.green:"#3d4c66"; ctx.lineWidth=st==="ES"?2.2:1.1; ctx.stroke();
      /* site allostérique (en bas) */
      ctx.fillStyle="#ffffff"; ctx.beginPath(); ctx.arc(x-r*.2,y+r*.95,r*.22,0,6.2832); ctx.fill(); ctx.restore();
      if(occS) B.ball(c,x+r*.45,y,r*.3,P.green);
      if(occI){ if(tp==="comp") B.ball(c,x+r*.45,y,r*.3,P.red); else B.ball(c,x-r*.2,y+r*.95,r*.24,P.red); } }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, real=myst||ty.value, A0=app(real), F=fracs(real,s.value);
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+42, cols=Math.min(6,Math.max(4,Math.floor(D.w/70))), rows=Math.ceil(12/cols), gx=(D.w-30)/cols, gy=Math.min(64,(D.h-90)/rows);
      /* tirage des états selon les fractions d'équilibre (renouvelé ≈ toutes les secondes) */
      enz.forEach(function(e,i){ e.tm-=dt; if(e.tm<=0||dt===0&&!e.ok){ var u=rnd(), st=u<F.E?"E":u<F.E+F.ES?"ES":u<F.E+F.ES+F.EI?"EI":"ESI"; e.st=st; e.tm=.6+rnd()*.9; e.ok=1; }
        var x=D.x+15+gx*(i%cols+.5), y=top+20+gy*(Math.floor(i/cols)+.5); enzyme(x,y,Math.min(18,gy*.32),e.st,real);
        if(e.st==="ES"&&rnd()<dt*1.4) prods.push({x:x+14,y:y,a:1}); });
      prods.forEach(function(p){ p.x+=dt*40; p.y-=dt*12; p.a-=dt*.8; ctx.save(); ctx.globalAlpha=Math.max(0,p.a); B.ball(c,p.x,p.y,3.4,P.amber); ctx.restore(); }); prods=prods.filter(function(p){ return p.a>0; });
      var yb=D.y+D.h-30, bw=D.w-30, xb=D.x+15, acc=0;
      [["E",F.E,"#9aa6b6"],["ES",F.ES,P.green],["EI",F.EI,P.red],["ESI",F.ESI,"#b0413e"]].forEach(function(o){ if(o[1]<=0) return; var w=o[1]*bw; ctx.fillStyle=o[2]; ctx.fillRect(xb+acc,yb,w,14); if(w>26) S.draw.text(c,o[0]+" "+S.fmt(o[1]*100,0)+" %",xb+acc+w/2,yb+7,{size:9,color:"#fff"}); acc+=w; });
      S.draw.text(c,"répartition des enzymes (seules les ES produisent)",xb+bw/2,yb-8,{size:9.5,color:P.ink,halo:true});
      if(myst) S.draw.label(c,"inhibiteur mystère : mode d'action caché",D.x+D.w/2,top+4,{color:P.violet,size:10});
      /* graphique */
      var Au=app(ty.value), v0=function(x){ return x/(Km.value+x); }, vr=function(x){ return A0.Va*x/(A0.Ka+x); }, vg=function(x){ return Au.Va*x/(Au.Ka+x); }, sv=s.value, SS=[5,10,20,40,80,160];
      if(!lb.value){
        ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:42,x0:0,x1:200,y0:0,y1:1.15,stepX:25,stepY:.25,xl:"[S] (µmol/L)",yl:"v / Vmax"});
        S.draw.fn(c,ax,v0,P.acc,2.4);
        if(myst){ SS.forEach(function(x){ S.draw.dot(c,ax.X(x),ax.Y(vr(x)),5,P.red); }); S.draw.fn(c,ax,vg,P.red,1.8,[6,4]); }
        else S.draw.fn(c,ax,vr,P.red,2.8);
        S.draw.dot(c,ax.X(sv),ax.Y(v0(sv)),5,P.acc); S.draw.dot(c,ax.X(sv),ax.Y(vr(sv)),8,P.red);
      } else {
        var m0=Math.min(Km.value,A0.Ka,Au.Ka), xm=Math.max(4/m0,1.1/sv,0.25), yc=Math.max((Km.value)*xm+1,(A0.Ka/A0.Va)*xm+1/A0.Va,(Au.Ka/Au.Va)*xm+1/Au.Va);
        ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:42,x0:-1.5/m0,x1:xm,y0:-0.5,y1:Math.min(yc*1.08,60),xl:"1/[S] (L/µmol)",yl:"Vmax / v",fx:function(x){ return S.fmt(x,2); }});
        S.draw.line(c,ax.X(0),ax.T,ax.X(0),ax.B,"#a3adba",1); S.draw.line(c,ax.L,ax.Y(0),ax.R,ax.Y(0),"#a3adba",1);
        S.draw.fn(c,ax,function(x){ return Km.value*x+1; },P.acc,2.4);
        if(myst){ SS.forEach(function(x){ S.draw.dot(c,ax.X(1/x),ax.Y(1/vr(x)),5,P.red); }); S.draw.fn(c,ax,function(x){ return (Au.Ka/Au.Va)*x+1/Au.Va; },P.red,1.8,[6,4]); }
        else S.draw.fn(c,ax,function(x){ return (A0.Ka/A0.Va)*x+1/A0.Va; },P.red,2.8);
        S.draw.dot(c,ax.X(1/sv),ax.Y(1/v0(sv)),5,P.acc); S.draw.dot(c,ax.X(1/sv),ax.Y(1/vr(sv)),8,P.red);
      }
      S.draw.legend(c,[[P.acc,"sans inhibiteur"],[P.red,myst?"points : mesures ; tirets : ton hypothèse":"avec inhibiteur"]],ax.R-4,ax.T+(lb.value?4:40),{align:"right"});
      var d=df.banner(c,13), A=myst?null:A0;
      ro.set(0,S.fmt(A0.a,2)); ro.set(1,A?S.fmt(A.Va,3)+(A.Va<1?" (↓)":" (=)"):"?"); ro.set(2,A?S.fmt(A.Ka,1)+" µmol/L"+(A.Ka>Km.value?" (↑)":A.Ka<Km.value?" (↓)":" (=)"):"?");
      ro.set(3,S.fmt((1-vr(sv)/v0(sv))*100,0)+" %");
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+(myst?"Compare la courbe rouge en tirets (ton hypothèse) aux points mesurés, de préférence en double inverse. ":real==="comp"?"Compétitive : l'inhibiteur occupe le site actif (EI) ; à [S] très grande, ES l'emporte et l'inhibition disparaît. ":real==="nonc"?"Non compétitive : l'inhibiteur se lie au site allostérique de E comme de ES (EI, ESI) ; Vmax baisse quelle que soit [S] ; Km inchangé. ":"Incompétitive : l'inhibiteur ne se lie qu'au complexe ES (ESI) ; Vmax et Km baissent dans le même rapport (droites parallèles). ")+"États tirés au hasard selon les fractions d'équilibre (Ki identique sur E et ES pour le non compétitif pur).",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c05-ph-temperature", ch:"c05", tag:"Conditions d'activité",
  titre:"Activité enzymatique : pH optimal, température et dénaturation",
  resume:"Pepsine, trypsine, amylase, polymérase thermostable : règle le pH et la température sur le dessin, vois les charges du site actif changer et la protéine se dérouler… pour de bon.",
  but:"Glisse le curseur de la bande de pH et le thermomètre (ou les curseurs). Le site actif n'est efficace que si ses deux résidus ont la bonne charge ; au-delà de sa température de dénaturation, l'enzyme se déroule et ne se replie pas en refroidissant (bouton « Enzyme neuve »).",
  aRetenir:"Le pH modifie l'ionisation des groupes du site actif et la structure : courbe en cloche autour d'un pH optimal (pepsine ≈ 2, amylase salivaire ≈ 7, trypsine ≈ 8). La vitesse augmente avec T (Arrhenius), puis chute brusquement quand l'enzyme se dénature : un optimum de température apparent, qui dépend de la durée de l'essai. Une enzyme thermostable (Taq) reste active vers 72 °C : base de la PCR.",
  piege:"La dénaturation thermique est généralement irréversible : refroidir ne restaure pas l'activité. Au contraire, un froid intense ralentit mais ne détruit pas l'enzyme.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(620);
    var EZ={pep:["Pepsine (estomac)",2.0,55],tryp:["Trypsine (intestin)",8.0,55],amy:["Amylase salivaire",6.8,52],taq:["ADN polymérase thermostable (Taq)",8.5,98]};
    var en=k.select("Enzyme",Object.keys(EZ).map(function(x){ return [x,EZ[x][0]]; }),"pep",function(){ N=1; });
    var ph=k.slider("pH",0,12,0.1,7,"");
    var tp=k.slider("Température",0,100,1,37,"°C");
    var ro=k.readouts(["Activité due au pH","Effet de la température (essai de 30 s)","Enzyme encore native","Activité actuelle"]);
    var nt=k.note("","");
    var N=1, t=0, mode=null, geo={}, rnd=B.rng(81), subs=[], prods=[], fold=[];
    for(var q=0;q<26;q++){ var a=q/26*6.2832; fold.push([Math.cos(a)*(1+.28*Math.sin(5*a))+.15*Math.sin(3*a),Math.sin(a)*(.8+.25*Math.cos(4*a))]); }
    function pk(e){ return [e[1]-1.2,e[1]+1.2]; }
    function fpH(e,p){ var k2=pk(e), f=function(x){ return 1/(1+Math.pow(10,k2[0]-x))/(1+Math.pow(10,x-k2[1])); }; return f(p)/f(e[1]); }
    function kd(e,T){ return 0.5*Math.exp((T-e[2])/2); }
    function arr(T){ return Math.exp(-50000/8.314*(1/(T+273.15)-1/310.15)); }
    function gT(e,T){ return arr(T)*Math.exp(-kd(e,T)*30); }
    function gmax(e){ var m=0,b=0; for(var T=0;T<=100;T+=0.5){ var v=gT(e,T); if(v>m){ m=v; b=T; } } return [m,b]; }
    var df=B.defi(k,function(n){ var id=n%3, e=EZ[en.value]; return [{id:0,txt:"trouve le pH optimal de l'enzyme choisie (± 0,2)"},{id:1,txt:"trouve la température optimale (essai de 30 s) de l'enzyme choisie (± 2 °C)"},{id:2,txt:"dénature l'enzyme (plus de 80 % déroulée), puis refroidis à 37 °C : l'activité revient-elle ?"}][id]; },
      function(d){ var e=EZ[en.value]; if(d.id===0) return {ok:Math.abs(ph.value-e[1])<=0.2}; if(d.id===1) return {ok:Math.abs(tp.value-gmax(e)[1])<=2}; return {ok:N<0.2&&tp.value===37}; });
    k.button("Enzyme neuve",function(){ N=1; });
    c.pointer(function(t2,p){
      if(t2==="down") mode=(geo.th&&Math.abs(p.x-geo.th.x)<24&&p.y>geo.th.y0-12&&p.y<geo.th.y1+14)?"T":(geo.ph&&p.y>geo.ph.y-16&&p.y<geo.ph.y+22&&p.x>geo.ph.x0-8&&p.x<geo.ph.x1+8)?"pH":null;
      if((t2==="down"||t2==="drag")&&mode==="T"){ tp.set(Math.round(Math.max(0,Math.min(100,(geo.th.y1-p.y)/(geo.th.y1-geo.th.y0)*100)))); k.redraw(); }
      if((t2==="down"||t2==="drag")&&mode==="pH"){ ph.set(Math.round(Math.max(0,Math.min(12,(p.x-geo.ph.x0)/(geo.ph.x1-geo.ph.x0)*12))*10)/10); k.redraw(); }
      if(t2==="up") mode=null; });
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, e=EZ[en.value], T=tp.value, pH=ph.value, k2=pk(e);
      N*=Math.exp(-kd(e,T)*dt); var gm=gmax(e), aph=fpH(e,pH), aT=gT(e,T)/gm[0], act=aph*arr(T)/arr(gm[1])*N;
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+42, cx=D.x+(D.w-60)*.5, cy=top+(D.h-100)*.5+6, R=Math.min(70,(D.w-60)*.28,(D.h-110)*.45), un=1-N;
      /* chaîne : repliée (forme compacte) → déroulée (zigzag) selon la fraction dénaturée */
      ctx.save(); ctx.lineWidth=7; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle=B.mix("#6a8fd0",-un*.3); ctx.beginPath();
      fold.forEach(function(f,i){ var ex=-1.6+i/25*3.2, ey=(i%2?.18:-.18)+.25*Math.sin(i*1.3+t*un*2), x=cx+R*(f[0]*(1-un)+ex*un), y=cy+R*(f[1]*(1-un)+ey*un); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke(); ctx.restore();
      /* site actif : deux résidus dont la charge dépend du pH */
      var sx=cx+R*.95*(1-un)+un*R*1.4, sy=cy-R*.1, aDep=pH>k2[0], bPro=pH<k2[1];
      if(un<.6){ ctx.save(); ctx.globalAlpha=1-un; ctx.fillStyle="rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(sx,sy,15,0,6.2832); ctx.fill();
        B.ball(c,sx-8,sy-9,7,aDep?P.red:"#b9c3cf",{text:aDep?"−":"",size:11}); B.ball(c,sx-8,sy+9,7,bPro?P.blue:"#b9c3cf",{text:bPro?"+":"",size:11}); ctx.restore();
        S.draw.text(c,"site actif",sx+8,sy-22,{size:9.5,color:P.ink,align:"left",halo:true});
        S.draw.text(c,(aDep?"COO⁻":"COOH")+" · "+(bPro?"NH⁺":"N"),sx+8,sy+24,{size:9,color:P.grey,align:"left",halo:true}); }
      /* substrats convertis au rythme de l'activité */
      if(rnd()<dt*(.4+4*act)) subs.push({u:0,a:rnd()*6.28,ok:rnd()<act/(.1+act)});
      subs.forEach(function(s){ s.u+=dt*1.1; var r=(1-Math.min(1,s.u))*70+18, x=sx+r*Math.cos(s.a), y=sy+r*Math.sin(s.a); if(s.u<1) B.ball(c,x,y,4.5,P.green); else if(s.ok){ prods.push({x:sx,y:sy,a:s.a,u:0}); s.done=1; } else s.done=1; });
      subs=subs.filter(function(s){ return !s.done; });
      prods.forEach(function(p){ p.u+=dt*.9; var x=p.x+Math.cos(p.a)*p.u*80, y=p.y+Math.sin(p.a)*p.u*80; ctx.save(); ctx.globalAlpha=Math.max(0,1-p.u); B.ball(c,x-3,y,3.6,P.amber); B.ball(c,x+4,y+2,3.6,P.amber); ctx.restore(); });
      prods=prods.filter(function(p){ return p.u<1; });
      S.draw.label(c,N>0.98?"enzyme native":N>0.2?"en cours de dénaturation : "+S.fmt(un*100,0)+" % déroulée":"dénaturée (irréversible)",cx,cy+R+18,{color:N>0.98?P.green:P.red,size:10});
      /* thermomètre glissable */
      var thx=D.x+D.w-30, ty0=top+4, ty1=D.y+D.h-64; geo.th={x:thx,y0:ty0,y1:ty1}; var Ty=function(v){ return ty1-(v/100)*(ty1-ty0); };
      ctx.save(); S.draw.rrect(c,thx-6,ty0-4,12,ty1-ty0+8,6); ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle="#9aa6b6"; ctx.stroke(); ctx.fillStyle=P.red; ctx.fillRect(thx-3,Ty(T),6,ty1-Ty(T)+4); ctx.beginPath(); ctx.arc(thx,ty1+8,8,0,6.2832); ctx.fill(); ctx.restore();
      S.draw.line(c,thx-12,Ty(e[2]),thx+12,Ty(e[2]),P.amber,2); S.draw.label(c,S.fmt(T,0)+" °C",thx-4,Math.max(top,Ty(T)-12),{color:P.red,size:10});
      /* bande de pH glissable */
      var px0=D.x+20, px1=D.x+D.w-60, py=D.y+D.h-30; geo.ph={x0:px0,x1:px1,y:py};
      for(var i=0;i<60;i++){ ctx.fillStyle=B.phColor(i/60*12); ctx.fillRect(px0+i*(px1-px0)/60,py,(px1-px0)/60+1,12); }
      [0,2,4,6,8,10,12].forEach(function(v){ S.draw.text(c,String(v),px0+v/12*(px1-px0),py+20,{size:9,color:P.grey}); });
      var pxx=px0+pH/12*(px1-px0); ctx.fillStyle=P.ink; ctx.beginPath(); ctx.moveTo(pxx,py-1); ctx.lineTo(pxx-6,py-10); ctx.lineTo(pxx+6,py-10); ctx.closePath(); ctx.fill();
      S.draw.text(c,"pH "+S.fmt(pH,1),pxx,py-17,{size:10,color:P.ink,halo:true});
      /* deux graphiques empilés */
      var G=L.g, h1=Math.round(G.h/2), A1=B.axes(c,{x:G.x,y:G.y,w:G.w,h:h1},{frame:true,t:22,b:32,l:40,x0:0,x1:12,y0:0,y1:1.1,stepX:1,stepY:.5,xl:"pH",yl:"activité (pH)"});
      S.draw.fn(c,A1,function(x){ return fpH(e,x); },P.teal,2.6); S.draw.dot(c,A1.X(pH),A1.Y(aph),7,P.red);
      var A2=B.axes(c,{x:G.x,y:G.y+h1,w:G.w,h:G.h-h1},{frame:true,t:22,b:32,l:40,x0:0,x1:100,y0:0,y1:1.1,stepX:10,stepY:.5,xl:"T (°C)",yl:"activité (essai de 30 s)"});
      S.draw.fn(c,A2,function(x){ return gT(e,x)/gm[0]; },P.amber,2.6); S.draw.dot(c,A2.X(T),A2.Y(aT),7,P.red);
      var d=df.banner(c,13);
      ro.set(0,S.fmt(aph*100,0)+" %"); ro.set(1,S.fmt(aT*100,0)+" %"); ro.set(2,S.fmt(N*100,0)+" %"); ro.set(3,S.fmt(Math.min(1,act)*100,0)+" % du maximum");
      nt.set((d&&d.ok?"<b>Défi réussi.</b> "+(N<0.2?"L'activité ne revient pas : la dénaturation est irréversible. ":""):"")+"Modèle illustratif : cloche de pH due à deux résidus du site actif (pKa = pH optimal ∓ 1,2) ; Arrhenius (Ea = 50 kJ/mol) ; dénaturation irréversible au rythme 0,5·e<sup>(T − Td)/2</sup> s⁻¹ (Td ≈ 52-55 °C pour les enzymes humaines, 98 °C pour la Taq).",d&&d.ok?"ok":N<0.5?"warn":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c05-couplage-atp", ch:"c05", tag:"Énergétique · ΔG",
  titre:"ATP et couplage : ΔG réel de l'hydrolyse et réactions défavorables",
  resume:"ΔG = ΔG°′ + RT·ln Q : une bille qui doit monter une pente. Seule, la réaction défavorable retombe ; couplée à l'hydrolyse de l'ATP (bien plus que −30,5 kJ/mol dans la cellule), elle passe.",
  but:"Règle [ATP], [ADP] et [Pi] (ou glisse le point du graphique) et le ΔG°′ de la réaction R → P. Sur le profil d'énergie, la bille du chemin couplé franchit l'obstacle si le ΔG total est négatif ; compare avec la réaction seule.",
  aRetenir:"ΔG = ΔG°′ + RT·ln([ADP][Pi]/[ATP]) (concentrations en mol/L, 37 °C : RT = 2,58 kJ/mol). Dans la cellule, [ATP] ≫ [ADP] : ΔG ≈ −50 à −60 kJ/mol. Une réaction défavorable (ΔG°′ > 0) couplée à l'hydrolyse atteint [P]/[R] = exp[−(ΔG°′ + ΔG<sub>ATP</sub>)/RT], bien supérieur à exp(−ΔG°′/RT). Pont : chimie ch. 9 (ΔG, K).",
  piege:"ΔG°′ (conditions standard) ≠ ΔG (conditions cellulaires). Une réaction est spontanée si ΔG < 0, pas si ΔG°′ < 0. L'ATP ne « contient » pas d'énergie dans une liaison : l'énergie vient du déplacement de l'équilibre.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(600);
    var at=k.slider("[ATP]",0.5,10,0.1,5,"mmol/L");
    var ad=k.slider("[ADP]",0.01,5,0.01,0.5,"mmol/L");
    var pi=k.slider("[Pi]",1,10,0.5,5,"mmol/L");
    var g0=k.slider("ΔG°′ de la réaction défavorable R → P",0,60,0.5,20,"kJ/mol");
    var ro=k.readouts(["ΔG de l'hydrolyse de l'ATP","ATP / ADP","ΔG couplé ([P]/[R] = 1)","log₁₀([P]/[R]) à l'équilibre : seul / couplé"]);
    var nt=k.note("","");
    var RT=8.314*310.15/1000, G0=-30.5, LN=Math.LN10*RT, t=0, ax=null, drag=false, ballC=0, ballU=0;
    function dg(a,d,p){ return G0+RT*Math.log(d*1e-3*p*1e-3/(a*1e-3)); }
    var df=B.defi(k,function(n){ if(n%2===0){ var X=[45,48,52,55][Math.floor(Math.random()*4)]; g0.set(X); return {id:0,X:X,txt:"ΔG°′ = +"+X+" kJ/mol : trouve le rapport ATP/ADP minimal qui rend le couplage spontané (ΔG entre −1 et 0)"}; }
        g0.set(20); return {id:1,txt:"ΔG°′ = +20 kJ/mol : obtiens [P]/[R] ≥ 10⁶ à l'équilibre grâce au couplage"}; },
      function(d){ var g=dg(at.value,ad.value,pi.value), tot=g0.value+g;
        if(d.id===0) return {ok:g0.value===d.X&&tot<=0&&tot>=-1}; return {ok:g0.value===20&&-tot/LN>=6}; });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8);
      if((tp==="down"||tp==="drag")&&drag){ var x=Math.max(-1,Math.min(3,ax.ix(p.x))), a=ad.value*Math.pow(10,x); if(a>10){ a=10; } if(a<0.5){ a=0.5; } at.set(Math.round(a*10)/10); if(ad.value*Math.pow(10,x)>10){ ad.set(Math.max(0.01,Math.round(10/Math.pow(10,x)*100)/100)); } k.redraw(); } if(tp==="up") drag=false; });
    function atp(c2,x,y,n,s){ var ctx=c.ctx; B.ball(c,x,y,6*s,"#3c6fc4",{text:"A",size:7*s}); for(var i=0;i<n;i++) B.ball(c,x+(10+i*8)*s,y,4*s,P.amber); }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.52), D=L.d, g=dg(at.value,ad.value,pi.value), tot=g0.value+g, u=-g0.value/LN, cp=-tot/LN;
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+44;
      /* réservoir cellulaire : ATP, ADP, Pi */
      var pw=Math.min(150,D.w*.32), px=D.x+10, py=top, ph=D.h-60;
      S.draw.panel(c,px,py,pw,ph,{title:"cytosol"});
      var nA=Math.max(1,Math.round(at.value/10*12)), nD=Math.max(0,Math.round(ad.value/5*8)), nP=Math.round(pi.value/10*8), row=0, s=Math.min(1,pw/150);
      for(var i=0;i<nA;i++){ atp(c,px+12+(i%2)*(pw/2),py+30+Math.floor(i/2)*15,3,s*.9); } row=Math.ceil(nA/2);
      for(var j=0;j<nD;j++){ atp(c,px+12+(j%2)*(pw/2),py+34+(row+Math.floor(j/2))*15,2,s*.9); } row+=Math.ceil(nD/2);
      for(var q=0;q<nP;q++) B.ball(c,px+14+q*(pw-24)/Math.max(1,nP),py+40+row*15,4*s,"#e0a24a",{text:"P",size:5});
      S.draw.text(c,"ATP/ADP = "+S.fmt(at.value/ad.value,at.value/ad.value<10?1:0),px+pw/2,py+ph-12,{size:10.5,color:P.ink});
      /* profils d'énergie */
      var ex0=px+pw+24, ex1=D.x+D.w-14, ey0=top+10, ey1=D.y+D.h-30, Gmin=-70, Gmax=70, Y=function(v){ return ey0+(Gmax-v)/(Gmax-Gmin)*(ey1-ey0); };
      S.draw.line(c,ex0-6,ey0,ex0-6,ey1,"#a3adba",1.2); S.draw.text(c,"G (kJ/mol)",ex0-2,ey0-8,{size:9.5,color:P.grey,align:"left"});
      [-60,-30,0,30,60].forEach(function(v){ S.draw.text(c,(v>0?"+":"")+v,ex0-10,Y(v),{size:8.5,color:P.grey,align:"right"}); S.draw.line(c,ex0-6,Y(v),ex1,Y(v),"#eef1f5",1); });
      function path(dG,col,dash){ var pts=[], n=40; for(var i=0;i<=n;i++){ var u2=i/n, base=dG*(u2<.3?0:u2>.7?1:(u2-.3)/.4), bump=12*Math.exp(-Math.pow((u2-.5)/.12,2)); pts.push([ex0+u2*(ex1-ex0),Y(Math.max(Gmin,Math.min(Gmax,base+bump)))]); }
        ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=3; ctx.setLineDash(dash||[]); ctx.beginPath(); pts.forEach(function(p,i){ i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }); ctx.stroke(); ctx.restore(); return pts; }
      var p1=path(g0.value,"#9aa6b6",[6,4]), p2=path(tot,tot<0?P.green:P.red);
      /* billes : avancent si le ΔG du chemin est négatif, retombent sinon */
      function roll(pts,dG,ph){ var cyc=(t*.35+ph)%1, uu=dG<0?cyc:(cyc<.5?cyc*1.1:(1-cyc)*1.1), i=Math.min(pts.length-1,Math.round(uu*(pts.length-1))); return pts[i]; }
      var b1=roll(p1,g0.value,0), b2=roll(p2,tot,.4); B.ball(c,b1[0],b1[1]-7,6.5,"#9aa6b6"); B.ball(c,b2[0],b2[1]-7,7,tot<0?P.green:P.red);
      S.draw.text(c,"R",ex0+8,Y(0)+12,{size:10,color:P.ink}); S.draw.text(c,"P seul",ex1-4,Y(Math.min(Gmax,g0.value))-10,{size:9.5,color:P.grey,align:"right",halo:true});
      S.draw.text(c,"P + ADP + Pi",ex1-4,Y(Math.max(Gmin,Math.min(Gmax,tot)))+(tot<0?12:-10),{size:9.5,color:tot<0?P.green:P.red,align:"right",halo:true});
      S.draw.label(c,"seule : ΔG = +"+S.fmt(g0.value,1),ex0+(ex1-ex0)*.5,ey1+12,{color:P.grey,size:9.5});
      S.draw.label(c,"couplée : ΔG = "+(tot>0?"+":"")+S.fmt(tot,1),ex0+(ex1-ex0)*.5,ey0+4,{color:tot<0?P.green:P.red,size:10});
      /* ΔG de l'hydrolyse en fonction de log(ATP/ADP) */
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:44,x0:-1,x1:3,y0:-75,y1:-20,stepX:1,stepY:10,xl:"log₁₀([ATP]/[ADP])",yl:"ΔG hydrolyse (kJ/mol)"});
      S.draw.fn(c,ax,function(x){ return G0+RT*Math.log(pi.value*1e-3/Math.pow(10,x)); },P.acc,2.6);
      S.draw.line(c,ax.L,ax.Y(G0),ax.R,ax.Y(G0),P.grey,1.2,[5,4]); S.draw.text(c,"ΔG°′ = −30,5",ax.L+6,ax.Y(G0)-8,{size:9.5,color:P.grey,align:"left",halo:true});
      if(-g0.value>=-75&&-g0.value<=-20){ S.draw.line(c,ax.L,ax.Y(-g0.value),ax.R,ax.Y(-g0.value),P.red,1.2,[3,3]); S.draw.text(c,"− ΔG°′(R→P) : seuil du couplage",ax.R-4,ax.Y(-g0.value)+10,{size:9.5,color:P.red,align:"right",halo:true}); }
      var lx=Math.log10(at.value/ad.value); S.draw.dot(c,ax.cx(lx),ax.cy(g),8,P.red);
      var d=df.banner(c,13);
      ro.set(0,S.fmt(g,1)+" kJ/mol"); ro.set(1,S.fmt(at.value/ad.value,1)); ro.set(2,(tot>0?"+":"")+S.fmt(tot,1)+" kJ/mol"); ro.set(3,S.fmt(u,2)+" / "+S.fmt(cp,2));
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+"Point du graphique : ΔG réel de l'hydrolyse à [Pi] = "+S.fmt(pi.value,1)+" mmol/L ; le couplage est spontané (à [P]/[R] = 1) quand il passe sous la ligne rouge. Modèle : R + ATP + H₂O → P + ADP + Pi ; ΔG°′ = −30,5 kJ/mol à pH 7 avec Mg²⁺ ; seul l'équilibre thermodynamique est calculé (rien sur la vitesse).",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c05-allosterie", ch:"c05", tag:"Régulation · sigmoïde",
  titre:"Allostérie : sigmoïde de Hill, effecteurs et rétro-inhibition",
  resume:"Des globules rouges chargés d'O₂ dans les poumons le déchargent dans les tissus : la coopérativité (n) et les effecteurs (effet Bohr, BPG) décident de la quantité livrée.",
  but:"Choisis le système, règle n, K₀,₅ et l'effecteur, puis glisse le repère du graphique (pO₂ des tissus ou [S]). Les tétramères dessinés montrent la coopérativité : avec n élevé, ils sont pleins ou vides, rarement à moitié.",
  aRetenir:"Hill : Y = [S]ⁿ / (K₀,₅ⁿ + [S]ⁿ). n > 1 : coopérativité positive, courbe sigmoïde ; le passage de 10 % à 90 % de saturation demande un rapport [S]₉₀/[S]₁₀ = 81^(1/n) (81 pour n = 1, ≈ 5 pour n = 2,7). Hémoglobine : n ≈ 2,7 et P₅₀ ≈ 26 mmHg ; augmenter le P₅₀ (H⁺, CO₂, BPG : effet Bohr) libère plus d'O₂ aux tissus. Rétro-inhibition : le produit final se lie à l'enzyme de tête de voie et augmente son K₀,₅.",
  piege:"La coopérativité ne rend pas l'enzyme « plus rapide » : elle la rend plus SENSIBLE à de petites variations de substrat autour de K₀,₅. Un effecteur allostérique ne se fixe pas au site actif.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(610);
    var pr=k.seg("Système",[["hb","Hémoglobine / O₂"],["enz","Enzyme allostérique"],["mic","Michaélien (n = 1)"]],"hb");
    var n=k.slider("Coefficient de Hill n",1,4,0.1,2.7,"");
    var K=k.slider("K₀,₅ (P₅₀ pour l'hémoglobine)",1,50,0.5,26,"");
    var f=k.slider("Effecteur : facteur sur K₀,₅ (< 1 activateur, > 1 inhibiteur)",0.25,4,0.05,1,"×");
    var tis=k.slider("Repère : pO₂ des tissus (Hb) ou [S]",1,100,1,40,"");
    var ro=k.readouts(["K₀,₅ effectif","Saturation / activité au repère","[S]₉₀ / [S]₁₀ = 81^(1/n)","O₂ livré poumons (100) → repère"]);
    var nt=k.note("","");
    var t=0, ax=null, drag=false, rbc=[], o2=[], rnd=B.rng(91); for(var q=0;q<7;q++) rbc.push({u:q/7});
    function Yf(x,nn,Ke){ return Math.pow(x,nn)/(Math.pow(Ke,nn)+Math.pow(x,nn)); }
    var df=B.defi(k,function(i){ var id=i%3; if(id===0){ var X=[30,35,40][Math.floor(rnd()*3)]; return {id:0,X:X,txt:"effort musculaire : livre au moins "+X+" points de saturation entre 100 et 40 mmHg en réglant l'effecteur (effet Bohr)"}; }
        if(id===1) return {id:1,txt:"trouve n pour que passer de 10 % à 90 % de saturation demande un facteur 9 sur [S] (± 0,5)"};
        return {id:2,txt:"rétro-inhibition (enzyme allostérique) : règle l'inhibiteur pour diviser par 4 l'activité au K₀,₅ de départ (± 3 %)"}; },
      function(d){ var nn=pr.value==="mic"?1:n.value, Ke=K.value*f.value;
        if(d.id===0) return {ok:pr.value==="hb"&&tis.value===40&&(Yf(100,nn,Ke)-Yf(40,nn,Ke))*100>=d.X};
        if(d.id===1) return {ok:pr.value!=="mic"&&Math.abs(Math.pow(81,1/nn)-9)<=0.5};
        return {ok:pr.value==="enz"&&Math.abs(Yf(K.value,nn,Ke)/0.5-0.25)<=0.03}; });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8); if((tp==="down"||tp==="drag")&&drag){ tis.set(Math.round(Math.max(1,Math.min(100,ax.ix(p.x))))); k.redraw(); } if(tp==="up") drag=false; });
    function tetra(x,y,s,nb,coop){ var ctx=c.ctx, R=coop&&nb>=3; /* état R (relâché) quand ≥ 3 sites occupés */
      for(var i=0;i<4;i++){ var dx=(i%2?1:-1)*s*.55, dy=(i<2?-1:1)*s*.55, full=i<nb; ctx.save(); ctx.fillStyle=full?"#d94a52":"#8a6fbf"; ctx.strokeStyle=full?"#8e1f28":"#4b3585"; ctx.lineWidth=1;
        if(R||!coop){ ctx.beginPath(); ctx.arc(x+dx,y+dy,s*.5,0,6.2832); } else S.draw.rrect(c,x+dx-s*.45,y+dy-s*.45,s*.9,s*.9,s*.12); ctx.fill(); ctx.stroke(); ctx.restore();
        if(full) B.ball(c,x+dx,y+dy,s*.18,"#ffb3b3"); } }
    function fill(Y,nn,N){ /* répartition des sites liés : coopérative (tout ou rien) ou au hasard */
      var tot=Math.round(Y*N*4), w=Math.max(0,Math.min(1,(nn-1)/2)), full=Math.floor(tot*w/4), rest=tot-full*4, out=[]; for(var i=0;i<N;i++) out.push(i<full?4:0);
      for(var j=0;j<rest;j++){ var idx=full+(j%Math.max(1,N-full)); if(idx<N&&out[idx]<4) out[idx]++; } return out; }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, m=pr.value, hb=m==="hb", nn=m==="mic"?1:n.value, Ke=K.value*f.value, xs=tis.value, Yt=Yf(xs,nn,Ke), Y100=Yf(100,nn,Ke);
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+44;
      if(hb){ /* capillaire poumon → tissu */
        var cy=top+38, x0=D.x+14, x1=D.x+D.w-14;
        ctx.save(); var gl=ctx.createLinearGradient(x0,0,x1,0); gl.addColorStop(0,"#f6b3bb"); gl.addColorStop(1,"#c7a3d6"); ctx.fillStyle=gl; S.draw.rrect(c,x0,cy-22,x1-x0,44,22); ctx.fill(); ctx.strokeStyle="#b56d84"; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();
        S.draw.text(c,"poumons · pO₂ 100 mmHg",x0+6,cy-32,{size:10,color:"#b85462",align:"left"}); S.draw.text(c,"tissus · pO₂ "+xs+" mmHg",x1-6,cy-32,{size:10,color:P.violet,align:"right"});
        rbc.forEach(function(r){ r.u=(r.u+dt*.09)%1; var x=x0+18+r.u*(x1-x0-36), po=100+(xs-100)*Math.min(1,r.u*1.6), Y=Yf(po,nn,Ke); B.rbc(c,x,cy,15,{col:B.mix("#d94a52",-.35+.5*(Y-.3))}); tetra(x,cy,7,Math.round(Y*4),nn>1.3);
          if(r.u>.35&&r.u<.62&&rnd()<dt*(Y100-Yt)*6) o2.push({x:x,y:cy+18,vy:20+rnd()*15,vx:(rnd()-.5)*10,a:1}); });
        o2.forEach(function(o){ o.x+=o.vx*dt; o.y+=o.vy*dt; o.a-=dt*.6; ctx.save(); ctx.globalAlpha=Math.max(0,o.a); B.ball(c,o.x,o.y,3.4,P.blue); ctx.restore(); }); o2=o2.filter(function(o){ return o.a>0; });
        S.draw.text(c,"O₂ cédé aux tissus",x0+(x1-x0)*.48,cy+44,{size:9.5,color:P.blue,halo:true});
      } else S.draw.text(c,m==="enz"?"enzyme allostérique tétramérique (ex. aspartate transcarbamylase, PFK-1)":"enzyme michaélienne : 4 sites indépendants",D.x+D.w/2,top+8,{size:10.5,color:P.ink});
      /* population de tétramères au repère */
      var NT=8, occ=fill(Yt,nn,NT), gy=hb?top+108:top+52, sp=Math.min(56,(D.w-30)/NT), s=Math.min(16,sp*.3);
      occ.forEach(function(o,i){ tetra(D.x+(D.w-NT*sp)/2+sp*(i+.5),gy+s*1.2,s,o,nn>1.3); });
      S.draw.text(c,"au repère : "+S.fmt(Yt*100,0)+" % des sites occupés · "+(nn>1.3?"carrés = état T (tendu), ronds = état R (relâché)":"sites indépendants"),D.x+D.w/2,gy+s*2.9,{size:9.5,color:P.ink,halo:true});
      if(Math.abs(f.value-1)>0.02){ var ex=D.x+D.w/2, ey=D.y+D.h-20; B.ball(c,ex-60,ey,6,f.value>1?P.red:P.green); S.draw.text(c,(f.value>1?(hb?"H⁺, CO₂, BPG : P₅₀ ×":"inhibiteur : K₀,₅ ×"):"activateur : K₀,₅ ×")+S.fmt(f.value,2),ex-50,ey,{size:10,color:f.value>1?P.red:P.green,align:"left"}); }
      /* graphique */
      var xmax=hb?120:100;
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:44,x0:0,x1:xmax,y0:0,y1:1.05,stepX:20,stepY:.25,xl:hb?"pO₂ (mmHg)":"[S] (unités arbitraires)",yl:hb?"saturation Y":"v / Vmax"});
      S.draw.fn(c,ax,function(x){ return Yf(x,nn,K.value); },P.grey,1.6,[5,4]); S.draw.fn(c,ax,function(x){ return Yf(x,nn,Ke); },P.acc,2.8);
      if(Ke<=xmax){ S.draw.line(c,ax.L,ax.Y(.5),ax.X(Ke),ax.Y(.5),P.amber,1.2,[4,4]); S.draw.line(c,ax.X(Ke),ax.Y(.5),ax.X(Ke),ax.B,P.amber,1.2,[4,4]); S.draw.text(c,"K₀,₅",ax.X(Ke),ax.B-9,{size:9.5,color:P.amber,halo:true}); }
      if(hb){ S.draw.dot(c,ax.X(100),ax.Y(Y100),6,"#b85462"); S.draw.line(c,ax.X(100),ax.Y(Y100),ax.X(xs),ax.Y(Y100),P.blue,1.2,[3,3]); S.draw.arrow(c,ax.X(xs)-6,ax.Y(Y100),ax.X(xs)-6,ax.Y(Yt),P.blue,2); }
      S.draw.line(c,ax.X(xs),ax.T,ax.X(xs),ax.B,P.violet,1.2,[2,3]); S.draw.dot(c,ax.X(xs),ax.Y(Yt),8,P.red); if(!drag) S.draw.text(c,"glisse le repère",ax.X(xs)+8,ax.Y(Yt)+14,{size:9,color:P.grey,align:"left",halo:true});
      S.draw.text(c,"tirets gris : sans effecteur",ax.R-4,ax.B-12,{size:9.5,color:P.grey,align:"right",halo:true});
      var d=df.banner(c,13);
      ro.set(0,S.fmt(Ke,1)); ro.set(1,S.fmt(Yt*100,0)+" %"); ro.set(2,S.fmt(Math.pow(81,1/nn),1)); ro.set(3,hb?S.fmt((Y100-Yt)*100,0)+" points de saturation":"—");
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+(hb?"Hémoglobine : le décalage vers la droite (effet Bohr, BPG) fait libérer plus d'O₂ aux tissus à pO₂ égale. n = 1 (myoglobine) donnerait une hyperbole.":"Enzyme allostérique : un activateur (facteur < 1) rapproche K₀,₅ de 0 ; un inhibiteur final (facteur > 1) étire la sigmoïde vers la droite : à faible [S] la voie s'éteint.")+" Le dessin des tétramères est schématique (répartition tout ou rien d'autant plus marquée que n est grand).",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});
