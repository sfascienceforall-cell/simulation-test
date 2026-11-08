/* Biologie BA1 · chapitre 3 : membranes et transports */

SFA.sim({
  id:"ub-c03-diffusion-fick", ch:"c03", tag:"Diffusion · classique",
  titre:"Diffusion à travers la membrane : P = D·K/ε et temps d'équilibration",
  resume:"Perméabilité, flux et temps caractéristique d'une cellule selon la solubilité dans les lipides.",
  but:"Fais varier le coefficient de partage K (solubilité lipidique), l'épaisseur ε et le rayon de la cellule. Lis P, le flux par unité de surface et la courbe de remplissage.",
  aRetenir:"Loi de Fick : J = P·ΔC avec P = D·K/ε. Une molécule liposoluble (K élevé : O₂, CO₂, éthanol) traverse vite ; un ion ou un sucre (K très faible) traverse très lentement sans transporteur. Temps caractéristique d'une cellule sphérique : τ = r/(3P) : il croît avec r (S/V = 3/r). Pont : chimie, diffusion et concentrations.",
  piege:"J est un flux par unité de surface (mol·m⁻²·s⁻¹) ; le flux total vaut J × surface. La diffusion simple ne se sature jamais et va toujours du plus concentré vers le moins concentré.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(430);
    var Dm=k.slider("D dans la membrane",0.1,10,0.1,1,"·10⁻¹² m²/s");
    var lk=k.slider("log₁₀ du coefficient de partage K",-6,1,0.5,0,"");
    var ep=k.slider("Épaisseur ε de la membrane",2,100,1,5,"nm");
    var r=k.slider("Rayon de la cellule",1,30,1,10,"µm");
    var dc=k.slider("ΔC (extérieur − intérieur)",0.1,20,0.1,5,"mmol/L");
    var ro=k.readouts(["K","P (cm/s)","Flux J (mol·m⁻²·s⁻¹)","Flux total entrant","τ = r / 3P"]);
    var nt=k.note("",""), B=S.bio, tt=0, ins=[], outs=[], cross=[], rr=Math.random;
    for(var q=0;q<44;q++) outs.push({x:rr(),y:rr(),vx:rr()-.5,vy:rr()-.5});
    function model(){ var K=Math.pow(10,lk.value), p=Dm.value*1e-12*K/(ep.value*1e-9), tau=(r.value*1e-6)/(3*p), J=p*dc.value, A=4*Math.PI*Math.pow(r.value*1e-6,2); return {K:K,p:p,tau:tau,J:J,Phi:J*A}; }
    var N=40;
    function frame(dt){
      var ctx=c.ctx, W=c.W, H=c.H, m=model(); c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var T=5, speed=T/7; tt+=dt*speed; if(tt>T+1){ tt=0; ins=[]; cross=[]; }
      var f=1-Math.exp(-Math.min(tt,T)), want=Math.round(f*N);
      var zh=H*.52, mx=W/2, mt=Math.max(10,Math.min(40,ep.value*.5+8));
      /* compartiments */
      ctx.fillStyle="rgba(168,210,240,.28)"; ctx.fillRect(10,10,mx-mt/2-10,zh-10); ctx.fillStyle="rgba(190,230,205,.35)"; ctx.fillRect(mx+mt/2,10,W-10-mx-mt/2,zh-10);
      S.draw.text(c,"extérieur · Ce",10+(mx-mt/2-10)/2,24,{size:11.5,color:P.acc}); S.draw.text(c,"intérieur · Ci",mx+mt/2+(W-10-mx-mt/2)/2,24,{size:11.5,color:P.green});
      /* membrane (lipides) */
      ctx.fillStyle="#f2e3b8"; ctx.fillRect(mx-mt/2,10,mt,zh-10); for(var yy=18;yy<zh;yy+=13){ B.ball(c,mx-mt/2+1,yy,4.4,"#e8b94a"); B.ball(c,mx+mt/2-1,yy,4.4,"#e8b94a"); }
      S.draw.text(c,"membrane "+S.fmt(ep.value,0)+" nm",mx,zh+10,{size:10,color:P.grey});
      /* particules dehors */
      outs.forEach(function(p){ p.x+=p.vx*dt*.25; p.y+=p.vy*dt*.25; if(p.x<0||p.x>1) p.vx*=-1; if(p.y<0||p.y>1) p.vy*=-1; p.x=Math.max(0,Math.min(1,p.x)); p.y=Math.max(0,Math.min(1,p.y)); p.vx+=(rr()-.5)*dt*3; p.vy+=(rr()-.5)*dt*3; });
      var vis=Math.max(6,Math.round(Math.min(1,dc.value/20*.9+.1)*N));
      for(var i=0;i<vis;i++){ var p=outs[i]; B.ball(c,16+p.x*(mx-mt/2-30),30+p.y*(zh-50),4.6,P.acc); }
      /* entrée */
      while(ins.length+cross.length<want){ cross.push({t:0,y:.1+rr()*.8,x:rr(),vx:rr()-.5,vy:rr()-.5}); }
      cross.forEach(function(q){ q.t+=dt*2.2; var u=Math.min(1,q.t), x=mx-mt/2-14+u*(mt+28), y=30+q.y*(zh-50); B.ball(c,x,y,4.6,P.acc); });
      cross.filter(function(q){ return q.t>=1; }).forEach(function(q){ ins.push({x:0.05,y:q.y,vx:rr()-.2,vy:rr()-.5}); });
      cross=cross.filter(function(q){ return q.t<1; });
      ins.forEach(function(p){ p.x+=p.vx*dt*.25; p.y+=p.vy*dt*.25; if(p.x<0||p.x>1) p.vx*=-1; if(p.y<0||p.y>1) p.vy*=-1; p.x=Math.max(0,Math.min(1,p.x)); p.y=Math.max(0,Math.min(1,p.y)); p.vx+=(rr()-.5)*dt*3; p.vy+=(rr()-.5)*dt*3; B.ball(c,mx+mt/2+10+p.x*(W/2-mt/2-30),30+p.y*(zh-50),4.6,P.acc); });
      /* courbe */
      var gx0=44, gy0=zh+34, gw=W-gx0-18, gh=H-gy0-34; S.draw.panel(c,gx0-30,gy0-12,gw+44,gh+52,{shadow:false});
      function X(x){ return gx0+x/5*gw; } function Y(y){ return gy0+gh-y*gh; }
      ctx.strokeStyle="#eef1f5"; ctx.lineWidth=1; ctx.beginPath(); for(var gx=0;gx<=5;gx++){ ctx.moveTo(X(gx),gy0); ctx.lineTo(X(gx),gy0+gh);} for(var gy=0;gy<=1;gy+=.25){ ctx.moveTo(gx0,Y(gy)); ctx.lineTo(gx0+gw,Y(gy)); } ctx.stroke();
      ctx.strokeStyle="#a3adba"; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(gx0,gy0); ctx.lineTo(gx0,gy0+gh); ctx.lineTo(gx0+gw,gy0+gh); ctx.stroke();
      for(gx=0;gx<=5;gx++) S.draw.text(c,gx,X(gx),gy0+gh+11,{size:10,color:P.grey}); [0,.5,1].forEach(function(v){ S.draw.text(c,S.fmt(v,1),gx0-9,Y(v),{size:10,color:P.grey}); });
      S.draw.text(c,"temps (en unités de τ)",gx0+gw/2,gy0+gh+25,{size:10.5,color:P.ink}); S.draw.text(c,"Ci / Ce",gx0+2,gy0-2,{size:10.5,color:P.ink,align:"left"});
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.beginPath(); for(var x=0;x<=Math.min(tt,T);x+=.05){ var y=1-Math.exp(-x); x===0?ctx.moveTo(X(x),Y(y)):ctx.lineTo(X(x),Y(y)); } ctx.stroke();
      ctx.save(); ctx.setLineDash([4,4]); ctx.strokeStyle="#c8d1de"; ctx.beginPath(); ctx.moveTo(X(1),Y(0)); ctx.lineTo(X(1),Y(.632)); ctx.moveTo(gx0,Y(.632)); ctx.lineTo(X(1),Y(.632)); ctx.stroke(); ctx.restore();
      S.draw.label(c,"t = τ : 63 %",X(1)+8,Y(.45),{color:P.red,align:"left",size:10.5});
      S.draw.dot(c,X(Math.min(tt,T)),Y(f),5.5,P.red);
      ro.set(0,S.sci(m.K,2)); ro.set(1,S.sci(m.p*100,2)); ro.set(2,S.sci(m.J,2)); ro.set(3,S.sci(m.Phi*1e15,2)+" fmol/s");
      var tau=m.tau; ro.set(4,tau<1?(tau<1e-3?S.sci(tau*1000,2)+" ms":S.fmt(tau*1000,2)+" ms"):(tau<3600?S.fmt(tau,1)+" s":S.fmt(tau/3600,1)+" h"));
      nt.set("Courbe : Ci(t) = Ce·(1 − e<sup>−t/τ</sup>) si la cellule démarre à 0 (Ce fixe) ; l'animation rejoue 5τ. Ordre de grandeur : "+(tau<0.1?"équilibre quasi instantané (gaz, éthanol).":tau<60?"équilibre en secondes à minutes.":"très lent : un transporteur ou un canal est indispensable."),tau<60?"ok":"warn");
    }
    k.button("O₂ / éthanol",function(){ lk.set(0.5); },true);
    k.button("Glucose",function(){ lk.set(-4.5); });
    k.button("Ion Na⁺",function(){ lk.set(-6); });
    k.button("↺ Rejouer",function(){ tt=0; ins=[]; cross=[]; });
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
    k.note("Modèle simplifié : membrane homogène, D constant, pas de couche d'eau non agitée, concentration extérieure maintenue constante.","warn");
  }
});

SFA.sim({
  id:"ub-c03-osmose-gr", ch:"c03", tag:"Osmose · tonicité",
  titre:"Globule rouge : osmolarité contre tonicité",
  resume:"NaCl, glucose, urée : un soluté qui traverse la membrane change l'osmolarité mais pas la tonicité.",
  but:"Compose une solution et lis le volume relatif du globule rouge, d'abord juste après l'immersion, puis à l'équilibre.",
  aRetenir:"L'eau suit l'osmolarité des solutés NON pénétrants : la tonicité efficace = 2·[NaCl] + [glucose] (solutés qui ne traversent pas). Un soluté qui traverse (urée) compte dans l'osmolarité totale, pas dans la tonicité. Volume à l'équilibre : V/V₀ = 300 / tonicité (mOsm/L). Pont : chimie, propriétés colligatives (Π = i·c·R·T).",
  piege:"Une solution d'urée à 300 mmol/L est isoosmotique mais HYPOtonique : l'urée entre, l'eau la suit, la cellule gonfle et éclate. Isoosmotique ≠ isotonique.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(450);
    var na=k.slider("NaCl",0,300,1,154,"mmol/L");
    var gl=k.slider("Glucose (supposé non pénétrant ici)",0,400,1,0,"mmol/L");
    var ur=k.slider("Urée (traverse librement)",0,400,1,0,"mmol/L");
    var tm=k.seg("Moment",[["imm","Juste après l'immersion"],["eq","À l'équilibre"]],"eq");
    var ro=k.readouts(["Osmolarité extérieure (mOsm/L)","Tonicité efficace (mOsm/L)","V / V₀","Verdict"]);
    var nt=k.note("",""), B=S.bio, Vc=1, parts=[], rnd=(function(){var s=7;return function(){s=(s*16807)%2147483647;return s/2147483647;};})(), swirl=0;
    for(var q=0;q<90;q++) parts.push({x:rnd(),y:rnd(),ph:rnd()*6.28,k:rnd()});
    function model(){ var osm=2*na.value+gl.value+ur.value, ton=2*na.value+gl.value; var V=tm.value==="imm"?(osm>0?300/osm:9):(ton>0?300/ton:9); return {osm:osm,ton:ton,V:Math.min(V,9)}; }
    function frame(dt){
      var ctx=c.ctx, W=c.W, H=c.H, m=model(), ver=m.V>1.5?"lyse":m.V<0.8?"rétraction (hypertonique)":m.V>1.1?"gonflement (hypotonique)":"isotonique";
      Vc+=(Math.min(m.V,1.7)-Vc)*Math.min(1,dt*2.2); swirl+=dt;
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var tx=10, ty=10, tw=W-20, th=H*.6;
      var dens=Math.min(1,(na.value+gl.value+ur.value)/500);
      ctx.save(); S.draw.rrect(c,tx,ty,tw,th,16); var g=ctx.createLinearGradient(0,ty,0,ty+th); g.addColorStop(0,"rgba(168,210,240,"+(.25+.2*dens)+")"); g.addColorStop(1,"rgba(96,160,214,"+(.35+.25*dens)+")"); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle="#9ab8d6"; ctx.lineWidth=2; ctx.stroke(); ctx.clip();
      /* solutés */
      var nNa=Math.round(na.value/300*34), nGl=Math.round(gl.value/400*22), nUr=Math.round(ur.value/400*22), idx=0;
      function put(n,col,rad,txt){ for(var i=0;i<n;i++,idx++){ var p=parts[idx%parts.length], x=tx+14+((p.x+.04*Math.sin(swirl*.8+p.ph))%1)*(tw-28), y=ty+14+((p.y+.04*Math.cos(swirl*.7+p.ph*1.3))%1)*(th-28); if(Math.hypot(x-W/2,(y-ty-th/2)*1.1)<62) continue; B.ball(c,x,y,rad,col,{text:txt,size:8}); } }
      put(nNa,P.acc,5.5,"Na"); put(nGl,P.amber,6,""); put(nUr,P.violet,4.5,"");
      /* globule */
      var cx=W/2, cy=ty+th/2, r=42*Math.pow(Math.max(.3,Vc),1/3);
      var mode=Vc>1.45?"lyse":Vc<.82?"crenele":Vc>1.12?"turgescent":"disque";
      var dir=Vc-1;
      if(mode!=="lyse"){ var na2=Math.min(8,Math.round(Math.abs(dir)*14)+(Math.abs(dir)>.04?2:0)); for(var j=0;j<na2;j++){ var a=j*6.2832/na2+swirl*.4, ph=((swirl*.9+j/na2)%1), rr=dir>0?r+34-ph*30:r+4+ph*30; var wx=cx+rr*Math.cos(a), wy=cy+rr*Math.sin(a); ctx.save(); ctx.globalAlpha=1-Math.abs(ph-.5)*1.2; B.ball(c,wx,wy,3.6,"#5ab4ea"); ctx.restore(); } }
      B.rbc(c,cx,cy,r,{mode:mode});
      if(mode==="lyse"){ for(var h=0;h<16;h++){ var aa=h*2.4+swirl*.3, rd=14+((h*37)%44); B.ball(c,cx+rd*Math.cos(aa),cy+rd*Math.sin(aa),3,"#e07a7a"); } }
      ctx.restore();
      S.draw.label(c,mode==="lyse"?"hémolyse : la membrane éclate":mode==="crenele"?"crénelé : l'eau sort (V = "+S.fmt(Vc,2)+" V₀)":mode==="turgescent"?"gonflé : l'eau entre (V = "+S.fmt(Vc,2)+" V₀)":"disque biconcave (V = "+S.fmt(Vc,2)+" V₀)",cx,ty+th-14,{color:mode==="disque"?P.green:P.red,size:11.5});
      (function(){ var it=[[P.acc,"Na⁺ / Cl⁻"],[P.amber,"glucose"],[P.violet,"urée"],["#5ab4ea","eau"]], x=tx+14; it.forEach(function(q){ B.ball(c,x,ty+16,4.5,q[0]); S.draw.text(c,q[1],x+8,ty+16,{size:10.5,color:P.ink,align:"left"}); x+=q[1].length*6.2+30; }); })();
      /* barres horizontales */
      var by=ty+th+22, bx=96, bw=W-bx-40, sc=bw/600;
      [["Osmolarité",m.osm,P.acc],["Tonicité",m.ton,P.green]].forEach(function(b,i){ var yy=by+i*38; S.draw.text(c,b[0],bx-8,yy+11,{size:11,color:P.ink,align:"right"});
        ctx.fillStyle="#e9eef4"; ctx.fillRect(bx,yy,bw,22); ctx.fillStyle=b[2]; ctx.fillRect(bx,yy,Math.min(b[1],600)*sc,22); S.draw.text(c,S.fmt(b[1],0),bx+Math.min(b[1],600)*sc+(b[1]>520?-6:6),yy+11,{size:11,color:b[1]>520?"#fff":P.ink,align:b[1]>520?"right":"left"}); });
      S.draw.line(c,bx+300*sc,by-8,bx+300*sc,by+72,P.red,1.6,[5,4]); S.draw.text(c,"300 : intérieur",bx+300*sc,by+84,{size:10,color:P.red});
      ro.set(0,S.fmt(m.osm,0)); ro.set(1,S.fmt(m.ton,0)); ro.set(2,m.V>=9?"∞":S.fmt(m.V,2)); ro.set(3,ver);
      nt.set(ur.value>0&&tm.value==="imm"?"Juste après l'immersion l'urée n'est pas encore entrée : l'eau suit l'osmolarité TOTALE. Passe à « À l'équilibre » pour voir l'effet de l'entrée d'urée.":"Ligne rouge : intérieur du globule rouge, ≈ 300 mOsm/L de solutés non pénétrants (modèle de l'osmomètre idéal : V = 300/tonicité ; lyse indicative à V > 1,5 V₀).",ver==="isotonique"?"ok":"warn");
    }
    function preset(a,b,d){ na.set(a); gl.set(b); ur.set(d); }
    k.button("Sérum physiologique",function(){ preset(154,0,0); },true);
    k.button("Eau pure",function(){ preset(0,0,0); });
    k.button("NaCl concentré",function(){ preset(300,0,0); });
    k.button("Urée 300 (piège)",function(){ preset(0,0,300); });
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
    k.note("Modèle d'osmomètre idéal : NaCl dissocié (i = 2), pas de coefficient osmotique, pas de volume non osmotique. Le glucose est supposé non pénétrant par simplification (il est en réalité transporté par GLUT1 puis métabolisé).","warn");
  }
});

SFA.sim({
  id:"ub-c03-transporteur-saturation", ch:"c03", tag:"Transports",
  titre:"Diffusion simple contre transporteur : saturation et compétition",
  resume:"Des transporteurs qui basculent un par un : quand ils sont tous occupés, le flux plafonne à Jmax ; un compétiteur leur vole la place.",
  but:"Augmente la concentration extérieure (curseur ou point du graphique) : les transporteurs se remplissent jusqu'à la saturation, tandis que la diffusion simple à travers les lipides reste proportionnelle. Ajoute un compétiteur (rouge) et observe Km apparent.",
  aRetenir:"Diffusion simple : J = k·C (droite, jamais saturée). Transport facilité (uniport, symport) : J = Jmax·C / (Km + C), saturable et spécifique ; Jmax = nombre de transporteurs × vitesse de cycle. Un compétiteur augmente Km apparent (Km·(1 + I/Ki)) sans changer Jmax. Un canal ou un transporteur facilité va dans le sens du gradient ; seul le transport actif (pompe) travaille CONTRE le gradient, au prix d'ATP (Na⁺/K⁺ : 3 Na⁺ sortent, 2 K⁺ entrent par ATP).",
  piege:"Le transport facilité est PASSIF : il n'utilise pas d'ATP et s'arrête à l'équilibre. Saturé ne veut pas dire actif.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(590);
    var jm=k.slider("Jmax (nombre de transporteurs × vitesse)",20,200,5,100,"µmol/min");
    var km=k.slider("Km du transporteur",0.5,10,0.5,2,"mmol/L");
    var kd=k.slider("Constante de diffusion simple k",0,10,0.1,2,"µmol/min par mmol/L");
    var I=k.slider("Concentration du compétiteur I",0,20,0.5,0,"mmol/L");
    var Ki=k.slider("Ki du compétiteur",0.5,10,0.5,2,"mmol/L");
    var C=k.slider("Concentration extérieure C",0,20,0.5,5,"mmol/L");
    var ro=k.readouts(["Km apparent","Flux facilité","Flux diffusion simple","Transporteurs occupés par le substrat"]);
    var nt=k.note("","");
    var t=0, ax=null, drag=false, rnd=B.rng(9), car=[], out=[], inside=[], cross=[], cnt={f:0,d:0,t0:0,F:0,Dd:0};
    for(var q=0;q<70;q++) out.push({x:rnd(),y:rnd(),ph:rnd()*6.28});
    for(var n=0;n<6;n++) car.push({s:0,st:"vide",tm:rnd()*0.8,load:null});
    function M(){ var kma=km.value*(1+I.value/Ki.value), cv=C.value; return {kma:kma,jf:jm.value*cv/(kma+cv),jd:kd.value*cv,ths:(cv/km.value)/(1+cv/km.value+I.value/Ki.value),thi:(I.value/Ki.value)/(1+C.value/km.value+I.value/Ki.value)}; }
    var df=B.defi(k,function(n){ var id=n%3;
        if(id===0){ var ii=4+Math.floor(rnd()*7); I.set(ii); var F=Math.round(jm.value*(.35+.3*rnd())); return {id:0,F:F,txt:"compétiteur à "+ii+" mmol/L : règle C pour un flux facilité de "+F+" µmol/min (± 3 %)"}; }
        if(id===1) return {id:1,txt:"trouve la concentration C où diffusion simple et transporteur donnent le même flux (± 3 %)"};
        return {id:2,txt:"place C au demi-flux maximal (Jmax/2) : tu lis alors Km apparent (± 2 %)"}; },
      function(d){ var m=M(); if(d.id===0) return {ok:Math.abs(m.jf-d.F)<=0.03*d.F};
        if(d.id===1) return {ok:C.value>0&&m.jd>0&&Math.abs(m.jd-m.jf)<=0.03*m.jf};
        return {ok:Math.abs(m.jf-jm.value/2)<=0.02*jm.value/2}; });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8);
      if((tp==="down"||tp==="drag")&&drag){ C.set(Math.round(Math.max(0,Math.min(20,ax.ix(p.x)))*2)/2); k.redraw(); } if(tp==="up") drag=false; });
    function carrier(x,y,s,w,h,load){
      var ctx=c.ctx, gt=8*(1-s)+2, gb=2+8*s;
      [-1,1].forEach(function(sg){ ctx.save(); ctx.beginPath(); ctx.moveTo(x+sg*gt/2,y-h/2); ctx.lineTo(x+sg*w/2,y-h/2+6); ctx.lineTo(x+sg*w/2,y+h/2-6); ctx.lineTo(x+sg*gb/2,y+h/2); ctx.closePath();
        var g=ctx.createLinearGradient(x-w/2,0,x+w/2,0); g.addColorStop(0,"#8f7bd8"); g.addColorStop(1,"#5b43b0"); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle="#3f2d86"; ctx.lineWidth=1.2; ctx.stroke(); ctx.restore(); });
      if(load) B.ball(c,x,y-h*.28+s*h*.56,5.5,load==="s"?P.green:P.red);
    }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, m=M();
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+40, my=top+(D.h-40)*.5, mx0=D.x+8, mx1=D.x+D.w-8, ep=30;
      ctx.fillStyle="rgba(168,210,240,.25)"; ctx.fillRect(mx0,top,mx1-mx0,my-ep/2-top); ctx.fillStyle="rgba(190,230,205,.28)"; ctx.fillRect(mx0,my+ep/2,mx1-mx0,D.y+D.h-8-my-ep/2);
      S.draw.text(c,"extérieur",mx0+6,top+10,{size:10.5,color:P.acc,align:"left"}); S.draw.text(c,"cytoplasme",mx0+6,D.y+D.h-18,{size:10.5,color:P.green,align:"left"});
      var nC=car.length, gap=(mx1-mx0)/nC, cw=24, skips=car.map(function(_,i){ var x=mx0+gap*(i+.5); return [x-cw/2-2,x+cw/2+2]; });
      B.membrane(c,mx0,mx1,my,{ep:ep,step:12,skip:skips});
      /* transporteurs : cycle lier → basculer → libérer → revenir (durée visuelle ∝ 1/Jmax) */
      var cyc=Math.max(.35,1.6*100/jm.value);
      car.forEach(function(r,i){ var x=mx0+gap*(i+.5); r.tm+=dt;
        if(r.st==="vide"&&r.tm>cyc*.25){ r.tm=0; var u=rnd(); if(u<m.ths){ r.st="aller"; r.load="s"; } else if(u<m.ths+m.thi){ r.st="bloque"; r.load="i"; } }
        else if(r.st==="aller"){ r.s=Math.min(1,r.tm/(cyc*.35)); if(r.s>=1){ inside.push({x:x,y:my+ep/2+6,vy:12+rnd()*10,vx:(rnd()-.5)*14,a:1}); cnt.f++; r.load=null; r.st="retour"; r.tm=0; } }
        else if(r.st==="retour"){ r.s=Math.max(0,1-r.tm/(cyc*.35)); if(r.s<=0){ r.st="vide"; r.tm=0; } }
        else if(r.st==="bloque"&&r.tm>cyc*.9){ r.st="vide"; r.load=null; r.tm=0; }
        carrier(x,my,r.s,cw,ep+12,r.load); });
      /* diffusion simple à travers la bicouche */
      if(rnd()<dt*kd.value*C.value/8) cross.push({x:mx0+rnd()*(mx1-mx0),u:0});
      cross.forEach(function(q){ q.u+=dt*.7; B.ball(c,q.x,my-ep/2-8+q.u*(ep+16),3.6,"#6fbf8f"); if(q.u>=1){ inside.push({x:q.x,y:my+ep/2+8,vy:10,vx:(rnd()-.5)*10,a:1}); cnt.d++; } });
      cross=cross.filter(function(q){ return q.u<1; });
      inside.forEach(function(q){ q.x+=q.vx*dt; q.y+=q.vy*dt; q.a-=dt*.35; }); inside=inside.filter(function(q){ return q.a>0&&q.y<D.y+D.h-10; });
      inside.forEach(function(q){ ctx.save(); ctx.globalAlpha=Math.max(0,q.a); B.ball(c,q.x,q.y,4,P.green); ctx.restore(); });
      /* molécules extérieures : substrat (vert) et compétiteur (rouge) */
      var nS=Math.round(C.value/20*34), nI=Math.round(I.value/20*24);
      for(var j=0;j<nS+nI&&j<out.length;j++){ var o=out[j], x=mx0+8+((o.x+.02*Math.sin(t+o.ph))%1+1)%1*(mx1-mx0-16), y=top+22+((o.y+.03*Math.cos(t*.8+o.ph))%1+1)%1*(my-ep/2-top-34);
        B.ball(c,x,y,j<nS?4.6:4.2,j<nS?P.green:P.red); }
      if(t-cnt.t0>5){ cnt.F=cnt.f/(t-cnt.t0)*60; cnt.Dd=cnt.d/(t-cnt.t0)*60; cnt.f=0; cnt.d=0; cnt.t0=t; }
      S.draw.label(c,"occupés : "+S.fmt(m.ths*100,0)+" % (substrat) · "+S.fmt(m.thi*100,0)+" % (compétiteur)",mx0+(mx1-mx0)/2,my-ep/2-12,{color:P.violet,size:10});
      /* graphique J(C) */
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:42,x0:0,x1:20,y0:0,y1:210,stepX:5,stepY:50,xl:"C extérieure (mmol/L)",yl:"flux (µmol/min)"});
      S.draw.fn(c,ax,function(x){ return kd.value*x; },"#6fbf8f",2,[5,4]);
      S.draw.fn(c,ax,function(x){ return jm.value*x/(km.value+x); },P.violet,I.value>0?1.4:2.6,I.value>0?[3,3]:null);
      if(I.value>0) S.draw.fn(c,ax,function(x){ return jm.value*x/(m.kma+x); },P.red,2.6);
      S.draw.line(c,ax.L,ax.Y(jm.value),ax.R,ax.Y(jm.value),P.ink,1,[3,4]); S.draw.text(c,"Jmax",ax.R-4,ax.Y(jm.value)-8,{size:10,color:P.ink,align:"right",halo:true});
      S.draw.line(c,ax.X(m.kma),ax.B,ax.X(m.kma),ax.Y(jm.value/2),P.amber,1.2,[4,3]); S.draw.text(c,"Km'",ax.X(m.kma),ax.B-8,{size:9.5,color:P.amber,halo:true});
      S.draw.dot(c,ax.X(C.value),ax.Y(m.jd),5,"#3f9d6a"); S.draw.dot(c,ax.X(C.value),ax.Y(m.jf),8,I.value>0?P.red:P.violet);
      S.draw.legend(c,[[P.violet,"transporteur"],[P.red,"avec compétiteur"],["#6fbf8f","diffusion simple",1]],ax.R-4,ax.T+18,{align:"right"});
      var d=df.banner(c,13);
      ro.set(0,S.fmt(m.kma,2)+" mmol/L"); ro.set(1,S.fmt(m.jf,1)+" µmol/min"); ro.set(2,S.fmt(m.jd,1)+" µmol/min"); ro.set(3,S.fmt(m.ths*100,0)+" %");
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+"Chaque transporteur bascule une molécule à la fois : quand presque tous sont occupés, ajouter du substrat n'accélère plus rien. Le compétiteur (rouge) occupe des transporteurs sans être transporté. Animation : vitesses de cycle ralenties ; occupations exactes (C/Km)/(1 + C/Km + I/Ki).",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c03-nernst", ch:"c03", tag:"Potentiel d'équilibre",
  titre:"Équation de Nernst : le potentiel d'équilibre de K⁺, Na⁺, Cl⁻, Ca²⁺",
  resume:"Ouvre des canaux sélectifs : les ions fuient selon leur gradient, des charges s'accumulent sur la membrane et le voltmètre se fige à E = (RT/zF)·ln([X]ₒ/[X]ᵢ).",
  but:"Choisis l'ion et ses concentrations (curseurs ou point du graphique). En mode « libre », regarde le flux net charger la membrane jusqu'à l'équilibre ; en mode « Vm imposé », règle Vm et compare les flux sortant et entrant.",
  aRetenir:"À 37 °C : E = (61,5 mV / z)·log₁₀([X]ₒ/[X]ᵢ). Valeurs usuelles (neurone) : E(K⁺) ≈ −89 mV, E(Na⁺) ≈ +67 mV, E(Cl⁻) ≈ −64 mV, E(Ca²⁺) ≈ +132 mV. À l'équilibre, la force chimique (gradient) et la force électrique (Vm) se compensent. Un ion circule si Vm ≠ E : le flux net est sortant si z(Vm − E) > 0, entrant si z(Vm − E) < 0. Pont : chimie ch. 14, pile de concentration (Nernst).",
  piege:"Le signe de E dépend de z : pour un anion, il faut inverser le rapport (ou changer le signe). À l'équilibre électrochimique (Vm = E), il y a des flux, mais ils sont égaux et opposés (flux net nul). Les concentrations ne changent pratiquement pas : il suffit d'un tout petit nombre d'ions pour charger la membrane.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(600);
    var ION={K:["K⁺",1,140,5,"#c26a0c"],Na:["Na⁺",1,12,145,"#2f7fd1"],Cl:["Cl⁻",-1,10,110,"#24775a"],Ca:["Ca²⁺",2,1e-4,2,"#6236c4"]};
    var ion=k.seg("Ion",[["K","K⁺"],["Na","Na⁺"],["Cl","Cl⁻"],["Ca","Ca²⁺"]],"K",function(){ V=0; });
    var md=k.seg("Potentiel de membrane",[["free","Libre (seul cet ion passe)"],["clamp","Vm imposé"]],"free",function(){ if(md.value==="free") V=0; });
    var fo=k.slider("Facteur sur [X] extérieur",0.1,10,0.1,1,"×",function(){ if(md.value==="free") V=0; });
    var fi=k.slider("Facteur sur [X] intérieur",0.1,10,0.1,1,"×",function(){ if(md.value==="free") V=0; });
    var T=k.slider("Température",20,42,1,37,"°C");
    var vm=k.slider("Vm imposé (mode « Vm imposé »)",-100,60,1,-70,"mV");
    var ro=k.readouts(["[X] intérieur / extérieur (mmol/L)","E (mV)","Vm − E (mV)","Flux net"]);
    var nt=k.note("","");
    var V=0, t=0, ax=null, drag=false, rnd=B.rng(13), ions=[], fly=[], acc={o:0,i:0};
    for(var q=0;q<60;q++) ions.push({x:rnd(),y:rnd(),ph:rnd()*6.28});
    function st(){ var d=ION[ion.value], z=d[1], Ci=d[2]*fi.value, Co=d[3]*fo.value, Tk=T.value+273.15, RTF=8.314*Tk/96485*1000; return {d:d,z:z,Ci:Ci,Co:Co,RTF:RTF,E:RTF/z*Math.log(Co/Ci)}; }
    var df=B.defi(k,function(n){ var id=n%3;
        if(id===0){ var s=st(), tg=Math.round(s.RTF/s.z*Math.log(s.d[3]*(0.25+rnd()*3.5)/s.Ci)/5)*5; if(Math.abs(tg-s.E)<6) tg+=(s.z>0?10:-10); return {id:0,E:tg,ion:ion.value,txt:"règle la concentration de "+s.d[0]+" pour que E("+s.d[0]+") = "+(tg>0?"+":"")+S.fmt(tg,0)+" mV (± 2 mV)"}; }
        if(id===1) return {id:1,txt:"Vm imposé : trouve le potentiel où le flux net de Na⁺ s'annule (± 1 mV)"};
        return {id:2,txt:"Vm imposé : fais ENTRER le K⁺ (flux net entrant) avec les concentrations normales"}; },
      function(d){ var s=st(), cl=md.value==="clamp";
        if(d.id===0) return {ok:ion.value===d.ion&&Math.abs(s.E-d.E)<=2};
        if(d.id===1) return {ok:cl&&ion.value==="Na"&&Math.abs(vm.value-s.E)<=1};
        return {ok:cl&&ion.value==="K"&&fo.value===1&&fi.value===1&&vm.value<s.E-0.5}; });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8);
      if((tp==="down"||tp==="drag")&&drag){ var x=Math.max(-1,Math.min(1,ax.ix(p.x))); fo.set(Math.max(0.1,Math.min(10,Math.round(Math.pow(10,x)*10)/10))); if(md.value==="free") V=0; k.redraw(); } if(tp==="up") drag=false; });
    function channel(x,y,h,col,open){ var ctx=c.ctx; [-1,1].forEach(function(sg){ ctx.save(); S.draw.rrect(c,x+sg*(open?7:4)-(sg<0?12:0),y-h/2,12,h,5); var g=ctx.createLinearGradient(x-14,0,x+14,0); g.addColorStop(0,B.mix(col,.25)); g.addColorStop(1,B.mix(col,-.25)); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle=B.mix(col,-.45); ctx.lineWidth=1.1; ctx.stroke(); ctx.restore(); }); }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.55), D=L.d, s=st(), z=s.z, col=s.d[4];
      if(md.value==="clamp") V=vm.value; else V+=(s.E-V)*Math.min(1,dt/0.9);
      var u=V/s.RTF, rO=s.Ci*Math.exp(z*u/2), rI=s.Co*Math.exp(-z*u/2), sc=3.2/Math.max(rO,rI);
      if(rnd()<dt*rO*sc) fly.push({u:0,dir:1,x:rnd()<.5?0:1}); if(rnd()<dt*rI*sc) fly.push({u:0,dir:-1,x:rnd()<.5?0:1});
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+44, my=top+(D.h-44)*.48, mx0=D.x+8, mx1=D.x+D.w-(L.wide?110:8), ep=26, mw=mx1-mx0;
      ctx.fillStyle="rgba(168,210,240,.25)"; ctx.fillRect(mx0,top,mw,my-ep/2-top); ctx.fillStyle="rgba(240,220,190,.3)"; ctx.fillRect(mx0,my+ep/2,mw,D.y+D.h-6-my-ep/2);
      S.draw.text(c,"extérieur · "+S.fmt(s.Co,s.Co<1?4:1)+" mmol/L",mx0+6,top+10,{size:10.5,color:P.acc,align:"left"});
      S.draw.text(c,"intérieur · "+(s.Ci<0.01?S.bio.sci(s.Ci,1):S.fmt(s.Ci,1))+" mmol/L",mx0+6,D.y+D.h-16,{size:10.5,color:"#a2650c",align:"left"});
      var chx=[mx0+mw*.3,mx0+mw*.62]; B.membrane(c,mx0,mx1,my,{ep:ep,step:12,skip:chx.map(function(x){ return [x-22,x+22]; })});
      chx.forEach(function(x){ channel(x,my,ep+14,col,true); });
      /* charges accumulées de part et d'autre (∝ |Vm|) */
      var nq=Math.min(14,Math.round(Math.abs(V)/9)); for(var j=0;j<nq;j++){ var xx=mx0+12+(j+.5)*(mw-24)/nq; if(chx.some(function(x){ return Math.abs(x-xx)<26; })) continue;
        S.draw.text(c,V<0?"+":"−",xx,my-ep/2-8,{size:13,color:V<0?P.red:P.acc}); S.draw.text(c,V<0?"−":"+",xx,my+ep/2+9,{size:13,color:V<0?P.acc:P.red}); }
      /* ions libres : nombre ∝ concentration (le plus concentré = 24) */
      var mxC=Math.max(s.Ci,s.Co), nO=Math.max(1,Math.round(24*s.Co/mxC)), nI=Math.round(24*s.Ci/mxC), r=z===2?6.6:6;
      for(var i=0;i<nO+nI&&i<ions.length;i++){ var o=ions[i], outside=i<nO, x=mx0+10+((o.x+.025*Math.sin(t*.9+o.ph))%1+1)%1*(mw-20), y0=outside?top+24:my+ep/2+22, hh=outside?my-ep/2-top-40:D.y+D.h-6-my-ep/2-44;
        B.ion(c,x,y0+((o.y+.03*Math.cos(t*.7+o.ph))%1+1)%1*hh,r,col,s.d[0]); }
      if(nI===0) S.draw.text(c,"(presque aucun "+s.d[0]+" libre à l'intérieur)",mx0+mw/2,my+ep/2+34,{size:10,color:P.grey});
      fly.forEach(function(f){ f.u+=dt*1.3; var x=chx[f.x], y=f.dir>0?my+ep/2+18-f.u*(ep+36):my-ep/2-18+f.u*(ep+36); B.ion(c,x,y,r,col,s.d[0]); if(f.u>=1){ if(f.dir>0) acc.o++; else acc.i++; } });
      fly=fly.filter(function(f){ return f.u<1; });
      /* forces sur l'ion au niveau du canal */
      var ax0=chx[1]+34, sl=function(mv){ return Math.max(-46,Math.min(46,mv*.35)); };
      if(ax0<mx1-30){ var aC=sl(Math.log(s.Ci/s.Co)*14/.35), aE=sl(z*V/s.RTF*14/.35);
        S.draw.arrow(c,ax0,my,ax0,my-aC,P.teal,2.6); S.draw.arrow(c,ax0+20,my,ax0+20,my-aE,P.red,2.6);
        S.draw.text(c,"chim.",ax0,my-aC+(aC>=0?-9:9),{size:8.5,color:P.teal,halo:true}); S.draw.text(c,"élec.",ax0+20,my-aE+(aE>=0?-9:9),{size:8.5,color:P.red,halo:true}); }
      /* voltmètre */
      var vx=L.wide?D.x+D.w-58:mx1-58, vy=top+52;
      B.dial(c,vx,vy,34,V,-120,140,{unit:"mV",ticks:[-100,0,100],label:"Vm (int. − ext.)",fmt:function(v){ return (v>0?"+":"")+S.fmt(v,0); }});
      /* graphique : E en fonction de [X] extérieur (échelle log) */
      var base=s.d[3];
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:42,x0:-1,x1:1,y0:-200,y1:200,stepX:.5,stepY:50,xl:"[X] extérieur (mmol/L, échelle log)",yl:"E (mV)",fx:function(v){ var x=base*Math.pow(10,v); return x<0.1?S.fmt(x,2):x<10?S.fmt(x,1):S.fmt(x,0); }});
      S.draw.line(c,ax.L,ax.Y(0),ax.R,ax.Y(0),"#c8d1de",1);
      S.draw.fn(c,ax,function(x){ return s.RTF/z*Math.log(base*Math.pow(10,x)/s.Ci); },col,2.6);
      S.draw.line(c,ax.L,ax.cy(V),ax.R,ax.cy(V),P.red,1.4,[6,4]); S.draw.text(c,"Vm",ax.L+6,ax.cy(V)-8,{size:10,color:P.red,align:"left",halo:true});
      var lx=Math.log10(fo.value); S.draw.dot(c,ax.X(lx),ax.cy(s.E),8,col); S.draw.label(c,"E = "+(s.E>0?"+":"")+S.fmt(s.E,1)+" mV",Math.min(ax.R-60,ax.X(lx)+10),Math.max(ax.T+10,Math.min(ax.B-10,ax.cy(s.E)-14)),{color:col,align:"left",size:10.5});
      var fm=V-s.E, dir=Math.abs(fm)<0.5?"nul (équilibre)":(z*fm>0?"sortant":"entrant");
      var d=df.banner(c,13);
      ro.set(0,(s.Ci<0.01?S.bio.sci(s.Ci,1):S.fmt(s.Ci,1))+" / "+S.fmt(s.Co,s.Co<1?3:1)); ro.set(1,(s.E>0?"+":"")+S.fmt(s.E,1)+" mV"); ro.set(2,(fm>0?"+":"")+S.fmt(fm,1)+" mV"); ro.set(3,s.d[0]+" : "+dir);
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+"Flèches à droite du canal : force chimique (gradient, bleu-vert) et force électrique (Vm, rouge) sur l'ion ; à l'équilibre elles s'annulent. Rapport flux sortant / flux entrant = exp[zF(Vm − E)/RT] = "+S.fmt(Math.exp(z*(V-s.E)/s.RTF),Math.abs(V-s.E)<50?2:0)+". Concentrations de départ typiques (mmol/L, int./ext.) : K⁺ 140/5 ; Na⁺ 12/145 ; Cl⁻ 10/110 ; Ca²⁺ libre 0,0001/2.",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c03-goldman", ch:"c03", tag:"Potentiel de repos",
  titre:"Goldman : le potentiel de repos selon les perméabilités ioniques",
  resume:"Un tir à la corde entre E(K⁺), E(Na⁺) et E(Cl⁻) : Vm se place là où les courants ioniques s'annulent. Hyperkaliémie et pic du potentiel d'action.",
  but:"Ouvre plus ou moins les canaux Na⁺ et Cl⁻ (perméabilités relatives à K⁺) et change [K⁺] extérieur (curseur ou point du graphique). Les ions traversent la membrane : au potentiel de repos, la sortie de K⁺ compense exactement l'entrée de Na⁺.",
  aRetenir:"GHK à 37 °C : Vm = 61,5·log₁₀[(pK·Kₒ + pNa·Naₒ + pCl·Clᵢ) / (pK·Kᵢ + pNa·Naᵢ + pCl·Clₒ)]. Au repos pK ≫ pNa : Vm ≈ −69 mV, proche de E(K⁺) = −89 mV mais plus positif. Quand pNa/pK passe à ≈ 20 (canaux Na⁺ ouverts), Vm vire vers E(Na⁺) (≈ +67 mV) : phase ascendante du potentiel d'action. Hyperkaliémie : Kₒ augmente, E(K⁺) devient moins négatif : la cellule se dépolarise.",
  piege:"Vm au repos n'est PAS égal à E(K⁺) : un peu de Na⁺ entre en permanence (pNa/pK ≈ 0,04), compensé par la pompe Na⁺/K⁺. Le potentiel de repos n'est pas un équilibre, c'est un état stationnaire : courant net nul, mais flux de K⁺ et de Na⁺ non nuls.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(610);
    var pn=k.slider("log₁₀(pNa/pK) : ouverture des canaux Na⁺",-2,1.5,0.05,-1.4,"");
    var pcl=k.slider("pCl/pK",0,1,0.05,0,"");
    var ko=k.slider("[K⁺] extérieur",1,40,0.5,5,"mmol/L");
    var ro=k.readouts(["pNa/pK","Vm (mV)","E(K⁺) / E(Na⁺) (mV)","Vm − E(K⁺)"]);
    var nt=k.note("","");
    var Ki=140,Nai=12,Nao=145,Cli=10,Clo=110, U=61.54, RTF=U/Math.LN10, t=0, ax=null, drag=false, rnd=B.rng(17), fly=[], Vd=-70;
    var CK="#c26a0c", CN="#2f7fd1", CC="#24775a";
    function vmf(K,pNa,pCl){ return U*Math.log10((K+pNa*Nao+pCl*Cli)/(Ki+pNa*Nai+pCl*Clo)); }
    function ghk(p,z,ci,co,V){ var u=z*V/RTF; if(Math.abs(u)<1e-6) return p*z*(ci-co); return p*z*u*(ci-co*Math.exp(-u))/(1-Math.exp(-u)); }
    var df=B.defi(k,function(n){ return [{id:0,txt:"hyperkaliémie : quelle [K⁺] extérieure dépolarise la cellule à −55 mV (seuil) ? (± 0,7 mV)"},
        {id:1,txt:"pic du potentiel d'action : règle pNa/pK pour atteindre Vm = +30 mV (± 2 mV)"},
        {id:2,txt:"retrouve le repos : Vm = −70 mV (± 1) avec [K⁺]ₒ = 5 mmol/L et sans Cl⁻"}][n%3]; },
      function(d){ var V=vmf(ko.value,Math.pow(10,pn.value),pcl.value);
        if(d.id===0) return {ok:Math.abs(V+55)<=0.7}; if(d.id===1) return {ok:Math.abs(V-30)<=2};
        return {ok:ko.value===5&&pcl.value===0&&Math.abs(V+70)<=1}; });
    k.button("Repos",function(){ pn.set(-1.4); pcl.set(0); ko.set(5); });
    k.button("Pic du PA",function(){ pn.set(1.3); });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,8);
      if((tp==="down"||tp==="drag")&&drag){ ko.set(Math.round(Math.max(1,Math.min(40,ax.ix(p.x)))*2)/2); k.redraw(); } if(tp==="up") drag=false; });
    function channel(x,y,h,col,open,lab){ var ctx=c.ctx, g=3+open*9; [-1,1].forEach(function(sg){ ctx.save(); S.draw.rrect(c,sg<0?x-g/2-11:x+g/2-1,y-h/2,12,h,5); var gr=ctx.createLinearGradient(x-14,0,x+14,0); gr.addColorStop(0,B.mix(col,.3)); gr.addColorStop(1,B.mix(col,-.25)); ctx.fillStyle=gr; ctx.fill(); ctx.strokeStyle=B.mix(col,-.45); ctx.lineWidth=1; ctx.stroke(); ctx.restore(); });
      S.draw.text(c,lab,x,y+h/2+9,{size:9,color:col,halo:true}); }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.55), D=L.d, pN=Math.pow(10,pn.value), pC=pcl.value, V=vmf(ko.value,pN,pC);
      Vd+=(V-Vd)*Math.min(1,dt*3+(dt===0?1:0));
      var EK=U*Math.log10(ko.value/Ki), ENa=U*Math.log10(Nao/Nai), ECl=-U*Math.log10(Clo/Cli);
      var iK=ghk(1,1,Ki,ko.value,V), iN=ghk(pN,1,Nai,Nao,V), iC=ghk(pC,-1,Cli,Clo,V), mx=Math.max(Math.abs(iK),Math.abs(iN),Math.abs(iC),1e-9);
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+44, my=top+(D.h-44)*.46, sw=L.wide?D.w*.66:Math.max(200,W-122), mx0=D.x+8, mx1=mx0+sw, ep=26, mw=sw;
      ctx.fillStyle="rgba(168,210,240,.25)"; ctx.fillRect(mx0,top,mw,my-ep/2-top); ctx.fillStyle="rgba(240,220,190,.3)"; ctx.fillRect(mx0,my+ep/2,mw,D.y+D.h-8-my-ep/2);
      S.draw.text(c,"extérieur : Na⁺ 145 · Cl⁻ 110 · K⁺ "+S.fmt(ko.value,1),mx0+6,top+10,{size:10,color:P.acc,align:"left"});
      S.draw.text(c,"intérieur : K⁺ 140 · Na⁺ 12 · Cl⁻ 10",mx0+6,D.y+D.h-18,{size:10,color:"#a2650c",align:"left"});
      var ch=[[mx0+mw*.18,CK,"K⁺",1,iK],[mx0+mw*.43,CN,"Na⁺",pN,iN],[mx0+mw*.66,CC,"Cl⁻",pC,iC]], pumpX=mx0+mw*.88;
      B.membrane(c,mx0,mx1,my,{ep:ep,step:12,skip:ch.map(function(o){ return [o[0]-22,o[0]+22]; }).concat([[pumpX-20,pumpX+20]])});
      ch.forEach(function(o){ var open=Math.max(0,Math.min(1,(Math.log10(Math.max(o[3],1e-3))+2)/3.5)); channel(o[0],my,ep+14,o[1],o[3]>0?open:0,o[2]);
        /* flux : courant de charge > 0 = sortie de charges + ; pour Cl⁻ le sens des ions est inversé */
        var ionOut=o[4]*(o[2]==="Cl⁻"?-1:1), rate=Math.abs(o[4])/mx*3.5; if(o[3]>0&&rnd()<dt*rate) fly.push({x:o[0],c:o[1],l:o[2],dir:ionOut>0?1:-1,u:0}); });
      /* pompe Na⁺/K⁺ (3 Na⁺ dehors, 2 K⁺ dedans) */
      ctx.save(); S.draw.rrect(c,pumpX-17,my-ep/2-9,34,ep+18,9); var gp=ctx.createLinearGradient(0,my-20,0,my+20); gp.addColorStop(0,"#b9a6ef"); gp.addColorStop(1,"#6a4fc4"); ctx.fillStyle=gp; ctx.fill(); ctx.strokeStyle="#3f2d86"; ctx.stroke(); ctx.restore();
      S.draw.text(c,"pompe",pumpX,my,{size:8.5,color:"#fff"}); var pu=(t*.6)%1; B.ion(c,pumpX-7,my+ep/2+14-pu*(ep+30),4,CN,""); B.ion(c,pumpX+7,my-ep/2-14+pu*(ep+30),4,CK,"");
      fly.forEach(function(f){ f.u+=dt*1.2; var y=f.dir>0?my+ep/2+20-f.u*(ep+40):my-ep/2-20+f.u*(ep+40); B.ion(c,f.x,y,6,f.c,f.l); });
      fly=fly.filter(function(f){ return f.u<1; });
      var nq=Math.min(10,Math.round(Math.abs(Vd)/10)); for(var j=0;j<nq;j++){ var xx=mx0+10+(j+.5)*(mw-20)/nq; if(ch.some(function(o){ return Math.abs(o[0]-xx)<24; })||Math.abs(pumpX-xx)<22) continue;
        S.draw.text(c,Vd<0?"+":"−",xx,my-ep/2-7,{size:12,color:Vd<0?P.red:P.acc}); S.draw.text(c,Vd<0?"−":"+",xx,my+ep/2+8,{size:12,color:Vd<0?P.acc:P.red}); }
      /* tir à la corde : échelle des potentiels */
      var sx=mx1+(L.wide?60:58), y0=top+10, y1=D.y+D.h-28, Yv=function(v){ return y0+(80-v)/200*(y1-y0); };
      S.draw.line(c,sx,y0,sx,y1,"#9aa6b6",3);
      [[ENa,CN,"E(Na⁺)",pN],[EK,CK,"E(K⁺)",1],[ECl,CC,"E(Cl⁻)",pC]].forEach(function(o,i){ var y=Yv(Math.max(-120,Math.min(80,o[0]))), w=Math.max(.6,Math.min(7,2.4*Math.log10(1+o[3]*20)));
        if(o[3]>0) S.draw.line(c,sx,Yv(Vd),sx-20-i*6,y,o[1],w);
        S.draw.line(c,sx-6,y,sx+6,y,o[1],2.5); S.draw.text(c,o[2],sx+9,y,{size:9.5,color:o[1],align:"left",halo:true}); });
      S.draw.dot(c,sx,Yv(Vd),8,P.red); S.draw.label(c,"Vm "+S.fmt(Vd,0),sx+(W-sx>70?36:-40),Yv(Vd)+(Math.abs(Vd-EK)<12?14:0),{color:P.red,size:10});
      S.draw.text(c,"+80",sx-10,y0,{size:8.5,color:P.grey,align:"right"}); S.draw.text(c,"−120 mV",sx-10,y1,{size:8.5,color:P.grey,align:"right"});
      /* graphique : Vm en fonction de [K⁺] extérieur */
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:44,x0:1,x1:40,y0:-140,y1:80,stepX:5,stepY:20,xl:"[K⁺] extérieur (mmol/L)",yl:"potentiel (mV)"});
      S.draw.fn(c,ax,function(x){ return U*Math.log10(x/Ki); },CK,1.6,[5,4]);
      S.draw.line(c,ax.L,ax.Y(ENa),ax.R,ax.Y(ENa),CN,1.2,[5,4]); S.draw.text(c,"E(Na⁺)",ax.R-4,ax.Y(ENa)-8,{size:9.5,color:CN,align:"right",halo:true});
      S.draw.line(c,ax.L,ax.Y(-55),ax.R,ax.Y(-55),"rgba(192,50,29,.45)",1,[2,4]); S.draw.text(c,"seuil ≈ −55",ax.L+6,ax.Y(-55)-8,{size:9,color:P.red,align:"left",halo:true});
      S.draw.fn(c,ax,function(x){ return vmf(x,pN,pC); },P.ink,2.8);
      S.draw.text(c,"E(K⁺)",ax.X(32),ax.Y(U*Math.log10(32/Ki))+12,{size:9.5,color:CK,halo:true});
      S.draw.dot(c,ax.X(ko.value),ax.Y(V),8,P.red); S.draw.label(c,S.fmt(V,1)+" mV",Math.min(ax.R-40,ax.X(ko.value)+12),ax.Y(V)-14,{color:P.red,align:"left",size:10.5});
      var d=df.banner(c,13);
      ro.set(0,pN<0.1?S.fmt(pN,3):S.fmt(pN,2)); ro.set(1,S.fmt(V,1)); ro.set(2,S.fmt(EK,1)+" / +"+S.fmt(ENa,1)); ro.set(3,(V-EK>0?"+":"")+S.fmt(V-EK,1)+" mV");
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+"Cordes : plus un ion est perméant, plus sa corde est épaisse et plus il tire Vm vers son potentiel d'équilibre. Ions animés : flux GHK de chaque ion à Vm (le courant total est nul). Concentrations fixes (mmol/L) : K⁺ᵢ 140 ; Na⁺ 12/145 ; Cl⁻ 10/110 ; 61,54 mV = 2,303·RT/F à 37 °C.",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* BIO3D-BEGIN:s_c03_membrane.js */
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
  id:"ub-c03-3d-membrane-pompe-canal", ch:"c03", tag:"Membrane · 3D",
  titre:"La membrane plasmique en 3D : bicouche, canal K⁺ et pompe Na⁺/K⁺",
  resume:"Une bicouche fluide, un canal qui s'ouvre, une pompe qui change de conformation : 3 Na⁺ dehors, 2 K⁺ dedans, 1 ATP.",
  but:"Fais pivoter la membrane. Chauffe-la pour la rendre plus fluide, ouvre le canal K⁺ et suis le cycle de la pompe pas à pas (ou en automatique).",
  aRetenir:"La bicouche est fluide : les phospholipides diffusent latéralement (plus vite à chaud). Le canal K⁺ est un transport passif selon le gradient : K⁺ sort (plus concentré dedans). La pompe Na⁺/K⁺-ATPase est un transport actif primaire : par cycle, 1 ATP hydrolysé, 3 Na⁺ expulsés et 2 K⁺ importés, contre leurs gradients ; elle est électrogène (+1 charge exportée par cycle).",
  piege:"Sans ATP, la pompe se bloque (elle n'est pas un canal qui fuit) ; et le canal, lui, ne consomme pas d'ATP mais ne peut que dissiper un gradient. Le canal laisse sortir K⁺ parce que K⁺ est plus concentré dedans, pas parce qu'il serait « attiré » dehors. Les tailles sont schématiques (une vraie bicouche fait ≈ 5 nm d'épaisseur, une pompe est bien plus grosse qu'un lipide).",
  build:function(k,S){
    var c = k.canvas(400), pal = P(S), v = V3(c, S, {yaw:0.15, pit:0.3, D:12, sc:40});
    var temp = k.slider("Température (fluidité)", 0, 100, 1, 40, "%");
    var opn = k.slider("Ouverture du canal K⁺", 0, 100, 5, 60, "%");
    var atp = k.toggle("ATP disponible", true);
    var auto = k.toggle("Pompe en automatique", true);
    var ro = k.readouts(["Étape de la pompe", "ATP consommés", "Na⁺ expulsés", "K⁺ importés"]);
    var info = k.note("", "ok");
    var tt = 0, seed = 7;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var lip = [], i, j;
    var PUMP = [1.45, -0.2], CHAN = [-1.4, 0.3];
    for (i = 0; i < 11; i++) for (j = 0; j < 8; j++){
      var x = -2.75 + i * 0.55, z = -1.9 + j * 0.55;
      var dp = Math.hypot(x - PUMP[0], z - PUMP[1]), dc = Math.hypot(x - CHAN[0], z - CHAN[1]);
      if (dp < 0.85 || dc < 0.55) continue;
      lip.push({x:x, z:z, ph:rnd() * 6.28, ph2:rnd() * 6.28, f:0.6 + rnd()});
    }
    var ions = [];
    function mk(kind, side, n){ for (var q = 0; q < n; q++) ions.push({k:kind, s:side, x:-2.8 + rnd() * 5.6, y:(side > 0 ? 1 : -1) * (1.0 + rnd() * 1.6), z:-1.9 + rnd() * 3.8}); }
    mk("Na", 1, 12); mk("Na", -1, 3); mk("K", -1, 12); mk("K", 1, 3);
    var cross = [];               /* ions qui traversent le canal */
    var ph = 0, pt = 0, conf = 0, nATP = 0, nNa = 0, nK = 0, kflux = 0, accum = 0;
    var NAMES = ["E1 : ouverte côté cytosol, fixe 3 Na⁺ (et l'ATP)", "Phosphorylation : ATP → ADP + P, changement de conformation", "E2 : ouverte côté extérieur, libère 3 Na⁺, fixe 2 K⁺", "Déphosphorylation (P libéré) : retour à E1", "E1 : libère 2 K⁺ dans le cytosol"];
    var DUR = [1.6, 1.4, 2.0, 1.4, 1.2];
    function release(kind, side){
      var idx = -1;
      for (var q = 0; q < ions.length; q++) if (ions[q].k === kind && ions[q].s === -side){ idx = q; break; }
      if (idx >= 0) ions.splice(idx, 1);
      ions.push({k:kind, s:side, x:PUMP[0] + (rnd() - 0.5) * 0.4, y:side * 1.1, z:PUMP[1] + (rnd() - 0.5) * 0.4});
    }
    function next(){
      if (ph === 0 && !atp.value) return;
      if (ph === 1 && pt < 0.01) nATP++;
      if (ph === 2){ nNa += 3; for (var q = 0; q < 3; q++) release("Na", 1); }
      if (ph === 4){ nK += 2; for (q = 0; q < 2; q++) release("K", -1); }
      ph = (ph + 1) % 5; pt = 0;
    }
    function stepPump(dt){
      if (ph === 0 && !atp.value){ info.set("Sans ATP, la pompe reste bloquée en E1 : elle n'expulse plus le Na⁺ (c'est ce que fait la ouabaïne ou un manque d'énergie).", "warn"); return; }
      info.set("<b>" + NAMES[ph] + "</b>", "ok");
      if (auto.value){ pt += dt / DUR[ph]; if (pt >= 1) { next(); } }
    }
    function pumpDraw(){
      var cx = PUMP[0], cz = PUMP[1];
      /* conformation : 0 = E1 (ouverte dedans), 1 = E2 (ouverte dehors) */
      var target = ph === 2 ? 1 : ph === 3 ? 0.6 : ph === 1 ? 0.5 : 0;
      if (ph === 1) target = 0.5 + 0.5 * Math.min(1, pt * 1.2);
      if (ph === 3) target = 1 - Math.min(1, pt * 1.2);
      if (ph === 4) target = 0;
      conf += (target - conf) * 0.12;
      var col = ph === 1 ? "#d97706" : "#B45309";
      for (var m = 0; m < 10; m++){
        var a = m / 10 * 6.2832;
        var rb = 0.5 - 0.14 * Math.max(0, 1 - conf * 2) * 0, rt = 0.5;
        /* partie basse : se ferme quand conf > 0,4 ; partie haute : s'ouvre quand conf > 0,5 */
        var openB = Math.max(0.12, 0.42 * (1 - conf * 1.1)), openT = Math.max(0.12, 0.12 + 0.34 * Math.max(0, conf * 2 - 0.8));
        v.ball(cx + 0.55 * Math.cos(a), -0.42, cz + 0.55 * Math.sin(a), 0.2, col);
        v.ball(cx + 0.55 * Math.cos(a), 0.42, cz + 0.55 * Math.sin(a), 0.2, col);
        v.ball(cx + (0.12 + 0.38 * (1 - 0)) * Math.cos(a) * 1.05, 0, cz + 0.52 * Math.sin(a), 0.22, "#92400e");
        v.ball(cx + (0.2 + openB) * 0.9 * Math.cos(a + 0.3), -0.26, cz + (0.2 + openB) * 0.9 * Math.sin(a + 0.3), 0.14, "#d97706");
        v.ball(cx + (0.2 + openT) * 0.9 * Math.cos(a + 0.3), 0.26, cz + (0.2 + openT) * 0.9 * Math.sin(a + 0.3), 0.14, "#d97706");
      }
      /* ions liés */
      var sodium = function(y, al, n){ for (var q = 0; q < n; q++){ var aa = q / n * 6.28 + 0.5; v.ball(cx + 0.2 * Math.cos(aa), y, cz + 0.2 * Math.sin(aa), 0.11, "#2563eb", al); } };
      var potas = function(y, al, n){ for (var q = 0; q < n; q++){ var aa = q / n * 6.28 + 1.5; v.ball(cx + 0.18 * Math.cos(aa), y, cz + 0.18 * Math.sin(aa), 0.11, "#ea580c", al); } };
      if (ph === 0) sodium(-0.5 + 0.45 * pt, 1, 3);
      if (ph === 1) sodium(-0.05, 1, 3);
      if (ph === 2){ if (pt < 0.55) sodium(0.1 + 0.9 * pt, 1 - pt, 3); if (pt > 0.4) potas(1.1 - 0.7 * Math.min(1, (pt - 0.4) / 0.6), Math.min(1, (pt - 0.4) * 2), 2); }
      if (ph === 3) potas(0.4 - 0.4 * pt, 1, 2);
      if (ph === 4) potas(-0.0 - 0.5 * pt, 1 - pt * 0.6, 2);
      if (ph === 1 || ph === 2) v.label("P", cx + 0.55, 0.5, cz + 0.55, "#b42318", 13);
    }
    function chanDraw(){
      var cx = CHAN[0], cz = CHAN[1], o = opn.value / 100;
      for (var m = 0; m < 8; m++){
        var a = m / 8 * 6.2832;
        v.ball(cx + 0.38 * Math.cos(a), -0.42, cz + 0.38 * Math.sin(a), 0.17, "#0e7490");
        v.ball(cx + 0.38 * Math.cos(a), 0.42, cz + 0.38 * Math.sin(a), 0.17, "#0e7490");
        v.ball(cx + 0.38 * Math.cos(a), 0, cz + 0.38 * Math.sin(a), 0.17, "#0e7490");
        /* porte : se resserre quand le canal est fermé */
        var g = 0.07 + 0.31 * o; v.ball(cx + g * Math.cos(a), -0.3, cz + g * Math.sin(a), 0.11, "#134e5e");
      }
    }
    function R(){
      c.clear();
      v.sc = Math.min(60, c.W / 10.5);
      /* repères de milieux */
      var A = v.P(-3.1, 1.6, 0), B = v.P(-3.1, -1.6, 0);
      S.draw.text(c, "Extracellulaire", 6, 14, {size:11, color:pal.grey, align:"left"});
      S.draw.text(c, "Cytosol", 6, c.H - 12, {size:11, color:pal.grey, align:"left"});
      var amp = temp.value / 100 * 0.12;
      lip.forEach(function(l){
        var dx = amp * Math.sin(tt * l.f * 2 + l.ph), dz = amp * Math.cos(tt * l.f * 1.7 + l.ph2), ty = 0.05 * temp.value / 100;
        for (var s = -1; s <= 1; s += 2){
          var hx2 = l.x + dx * (s > 0 ? 1 : -1), hz = l.z + dz;
          var top = [hx2, s * 0.58, hz];
          var sway = amp * 0.7 * Math.sin(tt * 3 * l.f + l.ph);
          v.seg(top, [hx2 + 0.06 + sway, s * 0.08, hz + 0.05], 0.04, "#cfc7a6", 0.95);
          v.seg(top, [hx2 - 0.06 - sway, s * 0.08, hz - 0.05], 0.04, "#cfc7a6", 0.95);
          v.ball(hx2, s * 0.62, hz, 0.13, "#e3b13a");
        }
      });
      chanDraw(); pumpDraw();
      /* ions du milieu */
      ions.forEach(function(q){
        q.x += (rnd() - 0.5) * 0.06; q.z += (rnd() - 0.5) * 0.06; q.y += (rnd() - 0.5) * 0.06;
        if (q.x < -2.9 || q.x > 2.9) q.x = Math.max(-2.9, Math.min(2.9, q.x));
        if (q.z < -2 || q.z > 2) q.z = Math.max(-2, Math.min(2, q.z));
        var lo = q.s > 0 ? 0.95 : -2.7, hi = q.s > 0 ? 2.7 : -0.95;
        if (q.y < lo) q.y = lo + (lo - q.y); if (q.y > hi) q.y = hi - (q.y - hi);
        v.ball(q.x, q.y, q.z, 0.1, q.k === "Na" ? "#2563eb" : "#ea580c");
      });
      /* ions traversant le canal : K+ sort selon le gradient */
      cross.forEach(function(q){ v.ball(CHAN[0] + 0.03 * Math.sin(q.t * 9), -1.2 + q.t * 2.6, CHAN[1], 0.1, "#ea580c"); });
      v.flush();
      /* légende */
      var ly = c.H - 30;
      c.ctx.fillStyle = "#2563eb"; c.ctx.beginPath(); c.ctx.arc(c.W - 98, 14, 5, 0, 6.3); c.ctx.fill();
      S.draw.text(c, "Na⁺", c.W - 88, 14, {size:11, align:"left", color:pal.ink});
      c.ctx.fillStyle = "#ea580c"; c.ctx.beginPath(); c.ctx.arc(c.W - 52, 14, 5, 0, 6.3); c.ctx.fill();
      S.draw.text(c, "K⁺", c.W - 42, 14, {size:11, align:"left", color:pal.ink});
      ro.set(0, (ph + 1) + " / 5"); ro.set(1, nATP); ro.set(2, nNa); ro.set(3, nK);
    }
    k.button("Étape suivante (pompe)", function(){ if (ph === 0 && !atp.value) return; pt = 0; next(); auto.set(false); conf = conf; }, true);
    k.button("Remettre à zéro", function(){ ph = 0; pt = 0; nATP = nNa = nK = 0; conf = 0; });
    k.draw(R);
    var lp = k.loop(function(dt){
      tt += dt; v.spin(dt * 0.7); stepPump(dt);
      /* canal K+ : taux ∝ ouverture ; flux net vers l'extérieur */
      accum += dt * opn.value / 100 * 2.2;
      while (accum > 1){ accum -= 1; cross.push({t:0}); kflux++; }
      cross.forEach(function(q){ q.t += dt * 0.7; });
      cross = cross.filter(function(q){ return q.t < 1; });
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c03_membrane.js */
