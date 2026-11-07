/* Chapitre 9 · Dissociation ionique et conductibilité des solutions */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function water(c,x,y,a,r){ var g=c.ctx; r=r||6; var hx1=x+Math.cos(a+Math.PI-0.9)*r*1.05, hy1=y+Math.sin(a+Math.PI-0.9)*r*1.05, hx2=x+Math.cos(a+Math.PI+0.9)*r*1.05, hy2=y+Math.sin(a+Math.PI+0.9)*r*1.05;
  g.save(); g.strokeStyle="#98a6b8"; g.lineWidth=1; g.beginPath(); g.moveTo(x,y); g.lineTo(hx1,hy1); g.moveTo(x,y); g.lineTo(hx2,hy2); g.stroke(); g.restore();
  circ(c,hx1,hy1,r*0.5,"#fff","#98a6b8",1); circ(c,hx2,hy2,r*0.5,"#fff","#98a6b8",1); circ(c,x,y,r*0.85,"#f2a79c","#c97b70",1); }

/* ---------- 1 · Conductimètre ---------- */
var CS = {
  nacl:{n:"Chlorure de sodium NaCl", k:2.0, eq:"NaCl → Na⁺ + Cl⁻", ions:[["+",1],["−",1]], el:true},
  kno3:{n:"Nitrate de potassium KNO₃", k:1.25, eq:"KNO₃ → K⁺ + NO₃⁻", ions:[["+",1],["−",1]], el:true},
  cacl2:{n:"Chlorure de calcium CaCl₂", k:2.2, eq:"CaCl₂ → Ca²⁺ + 2 Cl⁻", ions:[["+",1],["−",2]], el:true},
  naoh:{n:"Hydroxyde de sodium NaOH", k:6.2, eq:"NaOH → Na⁺ + OH⁻", ions:[["+",1],["−",1]], el:true},
  suc:{n:"Sucre (saccharose) C₁₂H₂₂O₁₁", k:0, eq:"C₁₂H₂₂O₁₁ (dissolution : les molécules restent entières)", ions:[], el:false},
  eth:{n:"Éthanol C₂H₅OH", k:0, eq:"C₂H₅OH (dissolution : les molécules restent entières)", ions:[], el:false}
};
function sigma(key,c){ var s=CS[key]; return 0.002+s.k*c*(1-0.0135*c); }
SFA.sim({
  id:"c3-c09-conductimetre", ch:"c09", tag:"Classique",
  titre:"Conductimètre : quels solutés rendent l'eau conductrice ?",
  resume:"Dissous différentes substances et mesure la conductibilité : seuls les ions libres font passer le courant.",
  but:"Choisis un soluté et sa concentration. Regarde les ions se déplacer vers les électrodes, la luminosité de la lampe et la conductibilité mesurée. Compare un composé ionique et un composé moléculaire.",
  aRetenir:"Un courant électrique dans une solution est un déplacement d'ions : les cations vont vers l'électrode négative, les anions vers l'électrode positive. Une solution conduit s'il y a des ions libres : composés ioniques dissous (NaCl, KNO₃…). Le sucre et l'éthanol, formés de molécules, se dissolvent sans former d'ions : la solution ne conduit pas. Plus il y a d'ions (concentration), plus la conductibilité est grande.",
  piege:"« L'eau conduit le courant » est faux pour l'eau pure : c'est l'eau salée qui conduit (ions dissous). Et l'eau du robinet conduit parce qu'elle contient des ions. Valeurs en mS/cm : ordres de grandeur pour des solutions diluées à 25 °C (proportionnelles à la concentration jusqu'à 10 g/L environ, avec un léger tassement).",
  build:function(k,S){
    var c = k.canvas(360);
    var so = k.select("Soluté", Object.keys(CS).map(function(i){return [i,CS[i].n];}), "nacl");
    var cc = k.slider("Concentration", 0, 10, 0.5, 4, "g/L");
    var ro = k.readouts(["Conductibilité","Ions libres ?","Équation de dissolution"]);
    var nt = k.note("","");
    var R=rng(17), ps=[]; for(var i=0;i<80;i++) ps.push({x:R(),y:R(),vx:(R()-0.5),vy:(R()-0.5),t:i%2});
    var lp = k.loop(function(dt){ var s=CS[so.value], g=cc.value; ps.forEach(function(p){ var drift=s.el?0.13:0; p.vx+=(R()-0.5)*dt*3; p.vy+=(R()-0.5)*dt*3; p.vx=Math.max(-0.12,Math.min(0.12,p.vx)); p.vy=Math.max(-0.12,Math.min(0.12,p.vy));
      var dir = p.t===0?1:-1; /* t=0 : cation → vers la droite (électrode négative) */
      p.x+=(p.vx*0.5+dir*drift*(s.el?1:0)*0.45)*dt; p.y+=p.vy*0.5*dt; if(p.x>1) p.x-=1; if(p.x<0) p.x+=1; if(p.y<0){p.y=0;p.vy=Math.abs(p.vy);} if(p.y>1){p.y=1;p.vy=-Math.abs(p.vy);} }); k.redraw(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, s=CS[so.value], conc=cc.value, sg=sigma(so.value,conc); CH.bg(c);
      var bx=W*0.1, bw=W*0.8, by=100, bh=H-150, lvl=by+bh*0.14;
      var br=Math.max(0,Math.min(1,(sg-0.02)/6));
      var ex1=bx+bw*0.2, ex2=bx+bw*0.8;
      D.line(c,ex1,by-18,ex1,by+10,"#5b6677",3); D.line(c,ex2,by-18,ex2,by+10,"#5b6677",3); D.line(c,ex1,by-18,W/2-24,by-18,"#5b6677",3); D.line(c,ex2,by-18,W/2+24,by-18,"#5b6677",3);
      if(br>0.05){ var ph=(Date.now()/500)%1; for(var q=0;q<4;q++){ var u=(ph+q/4)%1; if(u<.5) CH.circ(c,ex1+(W/2-24-ex1)*u*2,by-18,2.6,P.amber); else CH.circ(c,ex2-(ex2-(W/2+24))*(u-.5)*2,by-18,2.6,P.amber); } }
      D.glow(c,W/2,by-34,56,"#ffe678",0.9*br);
      CH.ball(c,W/2,by-34,19,br>0.05?"#ffe064":"#dfe5ee","",{lw:2,stroke:"#5b6677"});
      D.text(c,"+",ex1-13,by-8,{size:16,color:P.red}); D.text(c,"−",ex2+13,by-8,{size:16,color:P.acc});
      D.label(c,"lampe "+(br>0.05?"allumée":"éteinte"),W/2,12,{size:10.5,color:br>0.05?P.amber:P.grey});
      CH.glass(c,bx,by,bw,bh,0.86,"rgba(130,180,230,0.55)",{round:10});
      CH.rr(c,ex1-4,by-12,8,bh*0.74,"#c3cbd6","#6b7686",1.5,3); CH.rr(c,ex2-4,by-12,8,bh*0.74,"#8b95a5","#6b7686",1.5,3);
      var n=Math.min(70,Math.round(conc*7));
      var x0=bx+bw*0.24, x1=bx+bw*0.76, y0=lvl+10, y1=by+bh-12;
      for(var i=0;i<n;i++){ var p=ps[i], px=x0+p.x*(x1-x0), py=y0+p.y*(y1-y0);
        if(s.el){ var cat=p.t===0; CH.ball(c,px,py,cat?5:6.6,cat?P.acc:P.green,cat?"+":"−",{size:10,lw:.8}); }
        else { CH.rr(c,px-4,py-4,8,8,"#d8c08e","#b99a5a",1,3); } }
      D.display(c,F(sg,3)+" mS/cm",W/2,H-24,{w:Math.min(190,W*0.55),h:40,caption:"conductibilité σ",size:15});
      ro.set(0,F(sg,3)+" mS/cm"); ro.set(1,s.el?"oui : cations + anions":"non : molécules entières"); ro.set(2,s.eq);
      nt.set(s.el?(conc===0?"Eau pure : presque pas d'ions, la lampe reste éteinte.":"Les cations (bleu) se dirigent vers l'électrode négative, les anions (vert) vers la positive : c'est le courant dans la solution. Concentration × 2 → conductibilité ≈ × 2."):"Pas d'ions libres : les molécules (carrés) restent neutres, aucun courant ne passe. La conductibilité reste celle de l'eau pure (≈ 0,002 mS/cm).", s.el?"ok":"warn");
    });
    lp.play();
  }
});

/* ---------- 2 · Dissolution à l'échelle ionique ---------- */
var DS = {
  nacl:{n:"Chlorure de sodium NaCl", eq:"NaCl(s) → Na⁺(aq) + Cl⁻(aq)"},
  cacl2:{n:"Chlorure de calcium CaCl₂", eq:"CaCl₂(s) → Ca²⁺(aq) + 2 Cl⁻(aq)"},
  suc:{n:"Sucre (saccharose)", eq:"C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)  (molécules entières, pas d'ions)"}
};
SFA.sim({
  id:"c3-c09-dissociation", ch:"c09", tag:"Animation",
  titre:"La dissociation à l'échelle des particules",
  resume:"Un cristal plongé dans l'eau : les molécules d'eau arrachent les ions un à un et les entourent.",
  but:"Choisis un soluté et plonge le cristal. Observe comment les molécules d'eau s'orientent autour des ions (O vers un cation, H vers un anion) et comparer avec le sucre.",
  aRetenir:"La molécule d'eau est polaire : son oxygène est légèrement négatif et ses hydrogènes légèrement positifs. Elle s'oriente autour des ions (l'O vers un cation, les H vers un anion), les arrache au cristal (dissociation) et les entoure (ions hydratés). Les ions libres conduisent le courant. Le sucre, lui, se disperse en molécules entières : pas d'ions.",
  piege:"L'eau ne « fond » pas le sel : le sel ne fond qu'à 801 °C. Il se dissocie. Le cristal ne disparaît pas non plus : ses ions sont dispersés. Les tailles et les distances sont schématiques ; les ions Na⁺ et Cl⁻ sont à peu près de la même taille sur le dessin, alors que Cl⁻ est en réalité nettement plus gros.",
  build:function(k,S){
    var c = k.canvas(340);
    var so = k.select("Soluté", Object.keys(DS).map(function(i){return [i,DS[i].n];}), "nacl", function(){ init(); go=false; });
    var tp = k.slider("Température de l'eau", 5, 60, 5, 20, "°C");
    var ro = k.readouts(["Ions / molécules libres","Charges de la solution"]);
    var nt = k.note("","");
    var R=rng(3), parts, waters, t=0, go=false;
    function init(){
      var key=so.value, W=c.W, H=c.H, cx=W/2, cy=H/2, sp=22; parts=[]; t=0;
      var cols=key==="cacl2"?6:(key==="suc"?3:5), rows=key==="cacl2"?4:(key==="suc"?3:5);
      for(var j=0;j<rows;j++) for(var i=0;i<cols;i++){
        var type, x=cx+(i-(cols-1)/2)*sp*(key==="suc"?1.5:1), y=cy+(j-(rows-1)/2)*sp*(key==="suc"?1.5:1);
        if(key==="nacl") type=(i+j)%2===0?"na":"cl"; else if(key==="cacl2") type=(i%3===1)?"ca":"cl"; else type="su";
        var d=Math.min(i,j,cols-1-i,rows-1-j); parts.push({type:type,x:x,y:y,x0:x,y0:y,free:false,t:1+d*1.4+R()*1.2,vx:R()-0.5,vy:R()-0.5}); }
      waters=[]; for(var w=0;w<24;w++) waters.push({x:R()*W,y:R()*H,a:R()*6.28,vx:R()-0.5,vy:R()-0.5});
    }
    var lp = k.loop(function(dt){ if(go) t+=dt*(0.5+tp.value/30); var W=c.W,H=c.H, sp2=20+tp.value*1.2;
      parts.forEach(function(p){ if(!p.free&&t>p.t) p.free=true; if(p.free){ p.vx+=(R()-0.5)*dt*6; p.vy+=(R()-0.5)*dt*6; var m=Math.hypot(p.vx,p.vy)||1; var s=Math.min(m,1); p.vx=p.vx/m*s; p.vy=p.vy/m*s; p.x+=p.vx*sp2*dt; p.y+=p.vy*sp2*dt; if(p.x<14){p.x=14;p.vx=Math.abs(p.vx);} if(p.x>W-14){p.x=W-14;p.vx=-Math.abs(p.vx);} if(p.y<14){p.y=14;p.vy=Math.abs(p.vy);} if(p.y>H-30){p.y=H-30;p.vy=-Math.abs(p.vy);} } });
      waters.forEach(function(w){ w.vx+=(R()-0.5)*dt*8; w.vy+=(R()-0.5)*dt*8; var m=Math.hypot(w.vx,w.vy)||1; w.vx/=m; w.vy/=m; w.x+=w.vx*sp2*1.3*dt; w.y+=w.vy*sp2*1.3*dt; w.a+=(R()-0.5)*dt*4; if(w.x<8){w.x=8;w.vx=Math.abs(w.vx);} if(w.x>W-8){w.x=W-8;w.vx=-Math.abs(w.vx);} if(w.y<8){w.y=8;w.vy=Math.abs(w.vy);} if(w.y>H-24){w.y=H-24;w.vy=-Math.abs(w.vy);}
        var bb=null; for(var i=0;i<parts.length;i++){ var p=parts[i]; if(!p.free&&Math.abs(w.x-p.x0)<14&&Math.abs(w.y-p.y0)<14){ bb=p; break; } } if(bb){ var ang=Math.atan2(w.y-bb.y0,w.x-bb.x0); w.x+=Math.cos(ang)*60*dt; w.y+=Math.sin(ang)*60*dt; } });
      k.redraw(); });
    k.button("Plonger le cristal", function(){ init(); go=true; }, true);
    k.draw(function(){
      if(!parts){ init(); }
      c.clear(); var W=c.W,H=c.H,g=c.ctx, key=so.value;
      g.fillStyle="rgba(130,180,230,0.15)"; g.fillRect(0,0,W,H-18);
      waters.forEach(function(w){ water(c,w.x,w.y,w.a,6); });
      var nfree=0, tot=parts.length;
      parts.forEach(function(p){
        if(p.free){ nfree++;
          if(p.type==="na"||p.type==="ca"||p.type==="cl"){ var cat=p.type!=="cl"; for(var q=0;q<4;q++){ var a=q*1.57+0.5+p.x*0.01, rx=p.x+Math.cos(a)*(cat?20:21), ry=p.y+Math.sin(a)*(cat?20:21); water(c,rx,ry,cat?a+Math.PI:a,5.5); } }
          else { /* sucre : pas d'orientation particulière */ for(q=0;q<3;q++){ var a2=q*2.1+p.x*0.02; water(c,p.x+Math.cos(a2)*26,p.y+Math.sin(a2)*26,a2*3,5); } } }
        var rad=p.type==="cl"?9.5:(p.type==="ca"?8.5:7.5);
        if(p.type==="su"){ rr(c,p.x-13,p.y-9,26,18,"#f1d9a8","#b99a5a",1.5,6); T(c,"C₁₂…",p.x,p.y,{size:11,color:"#6b5420"}); }
        else { circ(c,p.x,p.y,rad,p.type==="cl"?"#6fcf9a":"#7ea6e6","#fff",1.2); T(c,p.type==="cl"?"−":(p.type==="ca"?"2+":"+"),p.x,p.y,{size:p.type==="ca"?10:12,color:"#fff"}); } });
      T(c,DS[key].eq,W/2,H-8,{size:12,color:P.ink});
      ro.set(0,nfree+" / "+tot+(key==="suc"?" molécules":" ions")); ro.set(1,key==="suc"?"molécules neutres : charge nulle":"cations + et anions − : solution neutre au total");
      nt.set(key==="suc"?"Le sucre se dissout en molécules entières entourées d'eau : aucun ion, donc la solution ne conduit pas.":(nfree===0?"Appuie sur « Plonger le cristal » et regarde les molécules d'eau s'orienter : l'O (rose) vers les cations, les H (blancs) vers les anions.":"Chaque ion libéré est entouré de molécules d'eau (ion hydraté) : O du côté des cations (+), H du côté des anions (−)."),"");
    });
    lp.play();
  }
});

/* ---------- 3 · Étalonnage : concentration et conductibilité ---------- */
SFA.sim({
  id:"c3-c09-etalonnage", ch:"c09", tag:"Défi",
  titre:"Conductibilité et concentration : retrouver la concentration d'une solution",
  resume:"Lis la conductibilité sur la courbe d'étalonnage de l'eau salée pour trouver la concentration inconnue.",
  but:"Observe la courbe σ = f(c) de l'eau salée. En mode défi, un échantillon inconnu a une conductibilité mesurée : déplace le curseur de concentration jusqu'à ce que la courbe passe par cette valeur.",
  aRetenir:"Pour des solutions diluées, la conductibilité est proportionnelle à la concentration en ions : si on double la concentration, on double σ (dilution ÷ 2 → σ ÷ 2). Une courbe d'étalonnage permet de retrouver la concentration d'une solution inconnue à partir de sa conductibilité.",
  piege:"La proportionnalité n'est valable que pour des solutions diluées : à forte concentration, la courbe se tasse (les ions se gênent). Lis toujours sur la courbe expérimentale, pas sur la droite théorique. Les valeurs sont celles d'un modèle d'eau salée à 25 °C (ordre de grandeur).",
  build:function(k,S){
    var c = k.canvas(310);
    var md = k.seg("Mode", [["libre","Libre"],["defi","Échantillon inconnu"]], "libre", function(){ if(md.value==="defi") newSample(); });
    var cc = k.slider("Concentration en NaCl", 0, 10, 0.25, 4, "g/L");
    var rd = k.toggle("Montrer la droite de proportionnalité", false);
    var ro = k.readouts(["σ à cette concentration","σ de l'échantillon","Écart"]);
    var nt = k.note("","");
    var truth=5;
    function newSample(){ truth=Math.round((1.5+Math.random()*7)*4)/4; if(Math.abs(truth-cc.value)<0.5) truth+=1; }
    k.button("Nouvel échantillon", function(){ md.set("defi"); newSample(); }, true);
    function sg(x){ return sigma("nacl",x); }
    var axr=null; c.pointer(function(type,pt){ if(type==="up"||!axr) return; cc.set(Math.round(axr.ix(pt.x)*4)/4); k.redraw(); });
    k.draw(function(){
      c.clear(); var conc=cc.value, defi=md.value==="defi", sx=sg(truth);
      var ax=D.axes(c,{x0:0,x1:10,y0:0,y1:20,xl:"c (g/L)",yl:"σ (mS/cm)",stepX:2,stepY:5,l:50});
      axr=ax; if(rd.value) D.fn(c,ax,function(x){ return 0.002+2.0*x; },P.grey,1.6,[5,4]);
      D.fn(c,ax,sg,P.acc,3);
      for(var s0=0;s0<=10;s0+=2){ D.dot(c,ax.X(s0),ax.Y(sg(s0)),4,P.acc); }
      var v=sg(conc);
      if(defi){ D.line(c,ax.L,ax.Y(sx),ax.R,ax.Y(sx),P.amber,2,[6,4]); T(c,"σ échantillon = "+F(sx,2),ax.R-6,ax.Y(sx)-10,{size:12,color:P.amber,align:"right"}); }
      D.line(c,ax.X(conc),ax.Y(0),ax.X(conc),ax.Y(v),P.red,1.5,[4,3]); D.dot(c,ax.X(conc),ax.Y(v),8,P.red); D.label(c,F(conc,2)+" g/L, "+F(v,1)+" mS/cm",Math.min(ax.R-70,ax.X(conc)+56),ax.B-36,{size:11,color:P.red}); D.label(c,"glisse le point",ax.R-56,ax.B-14,{size:10.5,color:P.grey});
      ro.set(0,F(v,2)+" mS/cm"); ro.set(1,defi?F(sx,2)+" mS/cm":"—"); ro.set(2,defi?F(v-sx,2)+" mS/cm":"—");
      if(defi){ var ok=Math.abs(conc-truth)<=0.3; nt.set(ok?"✓ Trouvé : la concentration de l'échantillon est d'environ <b>"+F(truth,2)+" g/L</b> (σ = "+F(sx,2)+" mS/cm). Vérifie : "+F(truth,2)+" g/L × 2,0 mS/cm par g/L ≈ "+F(2*truth,1)+" mS/cm, un peu moins à cause du tassement.":"Fais glisser la concentration jusqu'à ce que le point rouge atteigne la ligne orange.", ok?"ok":"warn"); }
      else nt.set("σ ≈ 2,0 mS/cm par g/L : "+F(conc,2)+" g/L → "+F(v,2)+" mS/cm. À "+F(conc/2,2)+" g/L (solution diluée 2 fois) : σ = "+F(sg(conc/2),2)+" mS/cm, presque la moitié.","");
    });
  }
});

/* ---------- 4 · Eaux du quotidien, échelle logarithmique ---------- */
var EAUX = [
  {n:"Eau déminéralisée", s:0.002, ions:"presque aucun ion", col:"#9fb4c9"},
  {n:"Eau de pluie", s:0.02, ions:"très peu d'ions (CO₂ dissous, traces)", col:"#9fb4c9"},
  {n:"Eau minérale peu minéralisée", s:0.05, ions:"quelques ions Ca²⁺, HCO₃⁻, Na⁺…", col:"#7ea6e6"},
  {n:"Eau du robinet (ordre de grandeur)", s:0.5, ions:"Ca²⁺, Mg²⁺, HCO₃⁻, Cl⁻, SO₄²⁻, Na⁺…", col:"#7ea6e6"},
  {n:"Eau minérale très minéralisée", s:2, ions:"beaucoup de Ca²⁺, Mg²⁺, SO₄²⁻, HCO₃⁻", col:"#5b8fe0"},
  {n:"Eau salée à 10 g/L", s:17, ions:"Na⁺ et Cl⁻ en grande quantité", col:"#3b6fd0"},
  {n:"Eau de mer (≈ 35 g/L de sels)", s:50, ions:"Na⁺, Cl⁻, Mg²⁺, SO₄²⁻, Ca²⁺, K⁺…", col:"#1e3f8f"}
];
SFA.sim({
  id:"c3-c09-eaux", ch:"c09", tag:"Échelle log",
  titre:"Des eaux très différentes : la conductibilité sur une échelle logarithmique",
  resume:"De l'eau déminéralisée à l'eau de mer : 25 000 fois plus de conductibilité. Où se place l'eau de mer diluée ?",
  but:"Compare les conductibilités de plusieurs eaux sur un axe logarithmique. Dilue ensuite l'eau de mer pour voir à partir de quel facteur elle devient comparable à l'eau du robinet.",
  aRetenir:"La conductibilité mesure la quantité d'ions dissous : eau déminéralisée ≈ 0,002 mS/cm, eau du robinet ≈ 0,5 mS/cm, eau de mer ≈ 50 mS/cm. Sur un axe logarithmique, chaque graduation multiplie par 10. Diluer de 100 fois divise σ par environ 100 (modèle proportionnel ; pour une eau aussi concentrée que l'eau de mer, la vraie baisse est un peu moindre) : l'eau de mer diluée 100 fois a une conductibilité proche de celle de l'eau du robinet.",
  piege:"Sur une échelle logarithmique, des barres de longueurs voisines peuvent représenter des valeurs très différentes (×10 par graduation). Ces valeurs sont des ordres de grandeur : elles varient selon la région et la marque. Une eau « pure » à boire n'existe pas : une eau sans ions n'est pas une eau potable.",
  build:function(k,S){
    var c = k.canvas(330);
    var dl = k.slider("Dilution de l'eau de mer (facteur 10^x)", 0, 4, 0.1, 0, "");
    var sa = k.select("Comparer avec", EAUX.map(function(e,i){return [i,e.n];}), 3);
    var ro = k.readouts(["Eau de mer diluée","Facteur de dilution","Comparée à l'eau choisie"]);
    var nt = k.note("","");
    var geo=null; c.pointer(function(type,pt){ if(type==="up"||!geo) return; var rowi=Math.floor((pt.y-geo.top)/geo.rowH); if(type==="down"&&rowi>=0&&rowi<EAUX.length&&pt.x<geo.R&&Math.abs(pt.x-geo.xd)>14){ sa.set(rowi); k.redraw(); return; } var lg=geo.lo+(pt.x-geo.L)/(geo.R-geo.L)*(geo.hi-geo.lo); dl.set(Math.max(0,Math.min(4,Math.round((Math.log10(50)-lg)*10)/10))); k.redraw(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, fac=Math.pow(10,dl.value), sd=50/fac;
      var L=10, R=W-14, top=34, rowH=(H-90)/EAUX.length, lo=-3, hi=2, X=function(s){ return L+(Math.log10(s)-lo)/(hi-lo)*(R-L); };
      for(var e=lo;e<=hi;e++){ D.line(c,X(Math.pow(10,e)),top-8,X(Math.pow(10,e)),H-52,"#e3e7ed",1); T(c,e>=0?String(Math.pow(10,e)):("0,"+"0".repeat(-e-1)+"1"),X(Math.pow(10,e)),H-38,{size:11,color:P.grey}); }
      T(c,"σ (mS/cm), axe logarithmique",W/2,H-16,{size:12,color:P.ink});
      var ref=EAUX[+sa.value]; geo={top:top,rowH:rowH,R:R,L:L,lo:lo,hi:hi,xd:X(Math.max(sd,0.0012))};
      EAUX.forEach(function(w,i){ var y=top+i*rowH, x1=X(w.s); rr(c,L,y+2,Math.max(2,x1-L),rowH-6,w.col,i===+sa.value?P.red:null,2,3); var nm=w.n.split(" (")[0]; g.save(); g.font="700 12px Mulish, system-ui"; var tw=g.measureText(nm).width; g.restore(); var inside=(x1+8+tw>W-4); T(c,nm,inside?L+8:x1+6,y+rowH/2-1,{size:12,color:inside?"#fff":P.ink,align:"left",halo:inside?false:true}); });
      // marqueur
      var xd=X(Math.max(sd,0.0012)); D.line(c,xd,top-10,xd,H-52,P.red,2.5); D.label(c,"eau de mer diluée",xd,top-22,{size:11.5,color:P.red,align:xd>W*0.5?"right":"left"});
      D.dot(c,xd,top-10,5,P.red);
      var rat=sd/ref.s;
      ro.set(0,F(sd,sd<0.1?4:2)+" mS/cm"); ro.set(1,"÷ "+F(fac,fac>=100?0:1)); ro.set(2,rat>=1?"× "+F(rat,rat>=10?0:1)+" plus conductrice":"÷ "+F(1/rat,1/rat>=10?0:1)+" (moins conductrice)");
      nt.set("<b>"+ref.n+"</b> : "+ref.ions+". "+(Math.abs(Math.log10(rat))<0.15?"Eau de mer diluée ≈ cette eau : même quantité d'ions.":"")+" Chaque unité de l'axe correspond à un facteur 10 : de l'eau déminéralisée à l'eau de mer, 0,002 → 50 mS/cm, soit ×25 000.","");
    });
  }
});
})();
