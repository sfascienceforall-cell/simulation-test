/* Chapitre 7 · La réaction chimique : transformation et conservation de la masse */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
var SUBD = "₀₁₂₃₄₅₆₇₈₉";
function sub(n){ return String(n).split("").map(function(d){ return SUBD[+d]; }).join(""); }
function gcd(a,b){ return b?gcd(b,a%b):a; }

/* ---------- 1 · Vase clos / vase ouvert ---------- */
SFA.sim({
  id:"c3-c07-lavoisier", ch:"c07", tag:"Expérience",
  titre:"Lavoisier : la masse mesurée, flacon fermé ou ouvert",
  resume:"Bicarbonate + vinaigre : le gaz formé s'échappe ou reste dans un ballon, et la balance le montre.",
  but:"Choisis la masse de bicarbonate, ferme (ballon) ou ouvre le flacon, puis lance la réaction. Lis la balance avant et après.",
  aRetenir:"Dans une transformation chimique, la masse totale se conserve : masse des réactifs consommés = masse des produits formés. Si la balance baisse, c'est qu'un produit gazeux s'est échappé : sa masse est la perte observée. Réaction : NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂.",
  piege:"« La masse a diminué, donc elle n'est pas conservée » est faux : le gaz est parti dans l'air. Les atomes ne sont ni créés ni détruits, ils sont réarrangés. (Dans la simulation, on néglige la poussée d'Archimède du ballon, et le vinaigre est en excès : 100 g de vinaigre à 5 % suffisent jusqu'à 7 g de bicarbonate. Masses molaires arrondies : Na 23, H 1, C 12, O 16.)",
  build:function(k,S){
    var c = k.canvas(360);
    var ms = k.slider("Masse de bicarbonate", 1, 7, 0.5, 4, "g");
    var md = k.seg("Flacon", [["clos","Fermé (ballon)"],["ouvert","Ouvert"]], "clos");
    var ro = k.readouts(["Balance avant","Balance maintenant","CO₂ formé","Avant − après"]);
    var nt = k.note("","");
    var p=0, R=rng(2), bub=[];
    var lp = k.loop(function(dt){ p=Math.min(1,p+dt/5); if(Math.random()<0.7) bub.push({x:R(),y:0,v:25+R()*40,life:1}); bub.forEach(function(b){ b.y+=b.v*dt; b.life-=dt*1.1; }); bub=bub.filter(function(b){return b.life>0;}); if(p>=1){ bub=[]; lp.pause(); } k.redraw(); });
    k.button("Lancer la réaction", function(){ p=0; lp.play(); }, true);
    k.button("Remettre à zéro", function(){ p=0; lp.pause(); bub=[]; });
    ms.el.addEventListener("input", function(){ p=0; });
    md.set && 0;
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, m=ms.value, base=180, M0=base+m, co2=m*44/84, open=md.value==="ouvert", small=W<420;
      CH.bg(c);
      var bal = open ? M0 - co2*p : M0;
      var fw=Math.min(W*0.42,170), fx=Math.max(10,W*0.06), fh=Math.min(H-150,190), fy=H-64-fh;
      CH.scale(c,fx-10,H-58,fw+20,F(bal,2)+" g",open&&p>0?"#ffb15c":"#7cf0a5");
      CH.flask(c,fx,fy,fw,fh,0.34+0.0*p,"rgba(240,226,150,.75)");
      /* bulles */
      bub.forEach(function(b){ var bx=fx+fw*0.2+b.x*fw*0.6, by=fy+fh*0.92-b.y*1.5; if(by>fy+fh*0.62) CH.ball(c,bx,by,2.8+b.x*2,"rgba(255,255,255,"+b.life.toFixed(2)+")","",{lw:.6,stroke:"#8aa0bf"}); });
      /* ballon ou gaz qui s'échappe */
      var vol=co2/44*24*p, r=5+Math.pow(Math.max(vol,0)/2,1/3)*Math.min(38,fw*0.3), nx=fx+fw/2;
      if(!open){ D.line(c,nx,fy+4,nx,fy-4,"#a33",5); D.glow(c,nx,fy-6-r,r*1.3,P.red,.25); CH.ball(c,nx,fy-6-r,r,"#e07b7b","",{lw:2,stroke:"#a33"}); if(r>16) D.text(c,F(vol,1)+" L",nx,fy-6-r,{size:12,color:"#fff"}); }
      else if(p>0&&p<1){ for(var i=0;i<5;i++){ var ph=((Date.now()/900)+i/5)%1, yy=fy-6-ph*70, xx=nx+Math.sin(i*2+Date.now()/400)*12; g.save(); g.globalAlpha=1-ph; D.text(c,"CO₂",xx,yy,{size:11.5,color:P.grey}); g.restore(); } D.label(c,"gaz qui s'échappe",nx,fy-82,{size:11,color:P.red}); }
      /* bilan */
      var tx=W*0.52, tw=W-tx-8, rows=[["NaHCO₃ consommé",m,P.acc],["CH₃COOH consommé",m*60/84,P.acc],["CH₃COONa formé",m*82/84,P.green],["H₂O formée",m*18/84,P.green],["CO₂ formé",co2,P.green]];
      D.panel(c,tx-6,8,tw+6,small?188:196,{shadow:false,title:"Bilan (masses en g)"});
      rows.forEach(function(r2,i){ var yy=44+i*21+(i>1?10:0); D.text(c,r2[0],tx+4,yy,{size:small?11:12,color:r2[2],align:"left"}); D.text(c,F(r2[1]*p,2),W-14,yy,{size:small?11:12,color:r2[2],align:"right",mono:true}); });
      D.line(c,tx+4,152,W-14,152,"#d7dee8",1);
      D.text(c,"Réactifs : "+F((m+m*60/84)*p,2)+" g",tx+4,168,{size:small?11:12,color:P.ink,align:"left",weight:800}); D.text(c,"Produits : "+F((m*82/84+m*18/84+co2)*p,2)+" g",tx+4,186,{size:small?11:12,color:P.ink,align:"left",weight:800});
      D.label(c,"= masse conservée",tx+tw/2,H-24>210?210:206,{size:11,color:P.green});
      ro.set(0,F(M0,2)+" g"); ro.set(1,F(bal,2)+" g"); ro.set(2,F(co2*p,2)+" g"); ro.set(3,F(M0-bal,2)+" g");
      nt.set(open?(p>=1?"Flacon ouvert : le CO₂ est parti dans l'air, la balance a perdu "+F(co2,2)+" g, exactement la masse du gaz formé. La masse totale (flacon + gaz échappé) est conservée.":"Flacon ouvert : le gaz s'échappe, la balance baisse."):"Flacon fermé : le CO₂ reste dans le ballon, la balance indique toujours "+F(M0,2)+" g. Rien n'est perdu.", open&&p>0?"warn":"ok");
    });
  }
});

/* ---------- 2 · Équilibrage ---------- */
var RX = [
 {n:"Synthèse de l'eau", sp:[["H₂",{H:2}],["O₂",{O:2}],["H₂O",{H:2,O:1}]], nr:2, sol:[2,1,2]},
 {n:"Synthèse de l'ammoniac", sp:[["N₂",{N:2}],["H₂",{H:2}],["NH₃",{N:1,H:3}]], nr:2, sol:[1,3,2]},
 {n:"Combustion du méthane", sp:[["CH₄",{C:1,H:4}],["O₂",{O:2}],["CO₂",{C:1,O:2}],["H₂O",{H:2,O:1}]], nr:2, sol:[1,2,1,2]},
 {n:"Combustion du propane", sp:[["C₃H₈",{C:3,H:8}],["O₂",{O:2}],["CO₂",{C:1,O:2}],["H₂O",{H:2,O:1}]], nr:2, sol:[1,5,3,4]},
 {n:"Rouille du fer", sp:[["Fe",{Fe:1}],["O₂",{O:2}],["Fe₂O₃",{Fe:2,O:3}]], nr:2, sol:[4,3,2]},
 {n:"Oxydation de l'aluminium", sp:[["Al",{Al:1}],["O₂",{O:2}],["Al₂O₃",{Al:2,O:3}]], nr:2, sol:[4,3,2]},
 {n:"Combustion du magnésium", sp:[["Mg",{Mg:1}],["O₂",{O:2}],["MgO",{Mg:1,O:1}]], nr:2, sol:[2,1,2]},
 {n:"Décomposition du chlorate de potassium", sp:[["KClO₃",{K:1,Cl:1,O:3}],["KCl",{K:1,Cl:1}],["O₂",{O:2}]], nr:1, sol:[2,2,3]},
 {n:"Sodium dans l'eau", sp:[["Na",{Na:1}],["H₂O",{H:2,O:1}],["NaOH",{Na:1,O:1,H:1}],["H₂",{H:2}]], nr:2, sol:[2,2,2,1]},
 {n:"Aluminium dans l'acide chlorhydrique", sp:[["Al",{Al:1}],["HCl",{H:1,Cl:1}],["AlCl₃",{Al:1,Cl:3}],["H₂",{H:2}]], nr:2, sol:[2,6,2,3]},
 {n:"Calcaire et acide chlorhydrique", sp:[["CaCO₃",{Ca:1,C:1,O:3}],["HCl",{H:1,Cl:1}],["CaCl₂",{Ca:1,Cl:2}],["H₂O",{H:2,O:1}],["CO₂",{C:1,O:2}]], nr:2, sol:[1,2,1,1,1]}
];
var ELC = {H:"#b6c4d8",O:"#f19a8f",N:"#8fb0f2",C:"#7f8794",Fe:"#c97b4f",Al:"#a9b4c1",Mg:"#b7d8a0",Na:"#a9a0e6",K:"#d6a0e6",Cl:"#7ed1a8",Ca:"#e6d28a"};
SFA.sim({
  id:"c3-c07-equilibrage", ch:"c07", tag:"Classique",
  titre:"Équilibrer une équation : compter les atomes de chaque côté",
  resume:"Ajuste les coefficients : le nombre d'atomes de chaque élément doit être le même avant et après la flèche.",
  but:"Choisis une réaction et règle les coefficients (touche ▲ ▼ sur l'équation dessinée, ou curseurs). Les rangées de billes comptent les atomes à gauche et à droite : équilibre-les avec les plus petits coefficients entiers.",
  aRetenir:"Une équation est équilibrée quand chaque élément a le même nombre d'atomes à gauche et à droite : les atomes se conservent. On ajuste uniquement les <b>coefficients</b> placés devant les formules, avec les plus petits nombres entiers possibles.",
  piege:"On ne change jamais les <b>indices</b> d'une formule : H₂O est de l'eau, H₂O₂ est un autre corps. Un coefficient multiplie toute la formule : 3 H₂O contient 6 atomes H et 3 atomes O. Une équation équilibrée avec des coefficients ayant un diviseur commun (4, 2, 4) n'est pas minimale.",
  build:function(k,S){
    var c = k.canvas(400);
    var rx = k.select("Réaction", RX.map(function(r,i){return [i,r.n];}), 0, function(){ setup(); });
    var sl=[]; for(var i=0;i<5;i++) sl.push(k.slider("Coefficient "+(i+1),1,8,1,1,""));
    var ro = k.readouts(["Équation","Bilan"]);
    var nt = k.note("","");
    var chips=[], pulse=0;
    function setup(){ var r=RX[+rx.value]; sl.forEach(function(s,i){ var d=s.el.parentNode; d.style.display=i<r.sp.length?"":"none"; var lab=d.querySelector("label span"); if(lab) lab.textContent="Coefficient devant "+(r.sp[i]?r.sp[i][0]:""); s.set(1); }); }
    setup();
    var BC={H:"#c9d3e0",O:"#d6402e",N:"#3b6fd6",C:"#4a5260",Fe:"#b0643a",Al:"#8b97a6",Mg:"#6fa05a",Na:"#7a4fd1",K:"#a64fb8",Cl:"#2f9e6b",Ca:"#c9ad3a"};
    function mol(cx,cy,comp,s){
      var at=[]; Object.keys(comp).forEach(function(e){ for(var q=0;q<comp[e];q++) at.push(e); }); if(comp.C>=2) s*=0.72;
      var pos=[], n=at.length, rad=function(e){ return s*(e==="H"?0.3:0.44); };
      if(n===1) pos=[[0,0]];
      else if(n===2) pos=[[-0.5,0],[0.5,0]];
      else { var ci=-1; at.forEach(function(e,i){ if(ci<0&&comp[e]===1&&e!=="H"&&Object.keys(comp).length>1&&!(n===3&&e==="O"&&false)) ci=i; });
        if(n===3&&ci>=0){ var o=at.map(function(e,i){return i;}).filter(function(i){return i!==ci;}); if(at[ci]==="C") pos[ci]=[0,0], pos[o[0]]=[-1.05,0], pos[o[1]]=[1.05,0]; else pos[ci]=[0,-0.3], pos[o[0]]=[-0.85,0.4], pos[o[1]]=[0.85,0.4]; }
        else if(ci>=0){ var oo=at.map(function(e,i){return i;}).filter(function(i){return i!==ci;}); pos[ci]=[0,0]; oo.forEach(function(i,j){ var a=-1.57+j*6.2832/oo.length; pos[i]=[Math.cos(a)*1.0,Math.sin(a)*1.0]; }); }
        else if(comp.C>=2||(comp.C&&n>6)){ var nc=comp.C, ci2=0, hi2=0; at.forEach(function(e,i){ if(e==="C"){ pos[i]=[(ci2-(nc-1)/2)*1.05,0]; ci2++; } }); at.forEach(function(e,i){ if(e!=="C"){ var col=Math.min(nc-1,Math.floor(hi2/2)), up=hi2%2?1:-1; if(hi2>=2*nc) { pos[i]=[hi2%2?(-(nc-1)/2*1.05-1.0):((nc-1)/2*1.05+1.0),0]; } else pos[i]=[(col-(nc-1)/2)*1.05,up*0.95]; hi2++; } }); }
        else at.forEach(function(e,i){ var a=-1.57+i*6.2832/n; pos[i]=[Math.cos(a)*0.62*Math.max(1,n/3.2),Math.sin(a)*0.62*Math.max(1,n/3.2)]; }); }
      var order=at.map(function(e,i){return i;}).sort(function(a,b){ return rad(at[b])-rad(at[a]); });
      order.forEach(function(i){ CH.ball(c,cx+pos[i][0]*s*0.85,cy+pos[i][1]*s*0.85,rad(at[i]),BC[at[i]]||"#888","",{lw:.8}); });
    }
    c.pointer(function(type,pt){ if(type!=="down") return; chips.forEach(function(h){ if(CH.hit(h,pt)){ var s=sl[h.i]; s.set(s.value+h.d); pulse=.5; k.redraw(); } }); });
    var lp=k.loop(function(dt){ pulse=Math.max(0,pulse-dt); if(pulse>0||true) k.redraw(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, r=RX[+rx.value], co=r.sp.map(function(s,i){ return sl[i].value; });
      CH.bg(c);
      var els=[]; r.sp.forEach(function(s){ Object.keys(s[1]).forEach(function(e){ if(els.indexOf(e)<0) els.push(e); }); });
      var L={},Rr={}; els.forEach(function(e){ L[e]=0; Rr[e]=0; });
      r.sp.forEach(function(s,i){ Object.keys(s[1]).forEach(function(e){ if(i<r.nr) L[e]+=co[i]*s[1][e]; else Rr[e]+=co[i]*s[1][e]; }); });
      var ok=els.every(function(e){ return L[e]===Rr[e]; });
      /* équation dessinée */
      var n=r.sp.length, small=W<420, cw=(W-16-(small?26:40))/n, ms=Math.min(small?17:22,cw*0.32), ey=72; chips=[];
      var x=8; 
      r.sp.forEach(function(sp,i){
        if(i===r.nr){ D.arrow(c,x,ey,x+(small?22:34),ey,P.grey,2.4); x+=small?26:40; }
        else if(i>0){ D.text(c,"+",x-2,ey,{size:18,color:P.grey}); }
        var w=cw; 
        [[-1,"▼",ey+58],[1,"▲",ey-44]].forEach(function(b){ var bx=x+w/2-14, by=b[2]-12; CH.rr(c,bx,by,28,24,"#fff","#9aa7ba",1.4,8); D.text(c,b[1],bx+14,by+12.5,{size:11,color:P.mat}); chips.push({x:bx-3,y:by-3,w:34,h:30,i:i,d:b[0]}); });
        D.text(c,co[i]===1?"1":String(co[i]),x+w*0.2,ey,{size:small?20:24,color:co[i]===1?"#a3adba":P.mat,weight:800});
        mol(x+w*0.64,ey-2,sp[1],ms);
        D.text(c,sp[0],x+w*0.5,ey+32,{size:small?11:12.5,color:P.ink,math:true});
        x+=w;
      });
      /* tableau d'atomes */
      var ty=ey+100, rowH=Math.min(40,(H-ty-52)/els.length), x0=36, gap=44, bw=(W-x0-gap-12)/2;
      D.label(c,"avant : atomes",x0+bw/2,ty-8,{size:11,color:P.acc}); D.label(c,"après : atomes",x0+bw+gap+bw/2,ty-8,{size:11,color:P.green});
      var mx=1; els.forEach(function(e){ mx=Math.max(mx,L[e],Rr[e]); });
      var br=Math.max(3,Math.min(8.5,bw/(mx*2.15)));
      els.forEach(function(e,j){ var y=ty+10+j*rowH+rowH/2, eq=L[e]===Rr[e];
        CH.ball(c,18,y,10,BC[e]||"#888",e,{size:e.length>1?9:11,tc:e==="H"?"#0f1b2d":"#fff"});
        for(var u=0;u<L[e];u++) CH.ball(c,x0+br+u*br*2.15,y,br,BC[e]||"#888","",{lw:.6});
        for(u=0;u<Rr[e];u++) CH.ball(c,x0+bw+gap+br+u*br*2.15,y,br,BC[e]||"#888","",{lw:.6});
        D.label(c,L[e]+(eq?" = ":" ≠ ")+Rr[e],x0+bw+gap/2,y,{size:10.5,color:eq?P.green:P.red,fill:eq?"rgba(36,119,90,.12)":"rgba(192,50,29,.12)"}); });
      var g0=co.reduce(function(a,b){return gcd(a,b);},0), min=g0===1;
      var cs=function(i){ return (co[i]===1?"":co[i]+" ")+r.sp[i][0]; };
      var eqn=r.sp.slice(0,r.nr).map(function(s,i){return cs(i);}).join(" + ")+" → "+r.sp.slice(r.nr).map(function(s,i){return cs(i+r.nr);}).join(" + ");
      D.label(c,ok?(min?"Équation équilibrée !":"Équilibrée, mais divise par "+g0):"Pas équilibrée",W/2,H-16,{size:13,color:ok&&min?P.green:(ok?P.amber:P.red)});
      ro.set(0,eqn); ro.set(1,ok?(min?"équilibrée ✓":"équilibrée, mais pas minimale (÷ "+g0+")"):"pas équilibrée");
      nt.set(ok?(min?"<b>Équation équilibrée</b> avec les plus petits coefficients entiers. Les atomes se conservent : rien ne se perd, rien ne se crée.":"Les atomes sont conservés, mais les coefficients ont un diviseur commun ("+g0+") : divise-les pour obtenir l'équation minimale."):"Compare les rangées : "+els.filter(function(e){return L[e]!==Rr[e];}).map(function(e){return "<b>"+e+"</b> ("+L[e]+" ≠ "+Rr[e]+")";}).join(", ")+". Change un coefficient (pas un indice !).", ok&&min?"ok":"warn");
    });
  }
});

/* ---------- 3 · Combustion du magnésium ---------- */
SFA.sim({
  id:"c3-c07-magnesium", ch:"c07", tag:"Expérience",
  titre:"Combustion du magnésium : pourquoi la poudre blanche est plus lourde",
  resume:"Le magnésium brûle dans l'air : la masse du creuset augmente car il fixe du dioxygène.",
  but:"Règle la masse de magnésium, choisis un creuset ouvert ou une enceinte fermée contenant un volume d'air donné, puis fais avancer la combustion. Suis les masses de Mg, de O₂ et de MgO.",
  aRetenir:"2 Mg + O₂ → 2 MgO. Les masses se conservent : 3 g de magnésium fixent 2 g de dioxygène et donnent 5 g d'oxyde de magnésium. Dans un creuset ouvert, la masse mesurée augmente (le dioxygène venait de l'air). Dans une enceinte fermée, la masse totale est constante, et la combustion s'arrête quand le dioxygène est épuisé.",
  piege:"« La masse augmente, donc de la matière a été créée » est faux : le dioxygène de l'air est entré dans la matière solide. Modèle simplifié (M(Mg) = 24 g/mol, M(O) = 16 g/mol : rapport 3 : 2 : 5) ; l'air contient environ 0,28 g de dioxygène par litre à 20 °C.",
  build:function(k,S){
    var c = k.canvas(340);
    var ms = k.slider("Masse de magnésium", 0.5, 6, 0.5, 3, "g");
    var md = k.seg("Dispositif", [["ouvert","Creuset ouvert"],["clos","Enceinte fermée"]], "ouvert");
    var vs = k.slider("Volume d'air dans l'enceinte (si fermée)", 0.5, 5, 0.5, 2, "L");
    var av = k.slider("Avancement de la combustion", 0, 100, 1, 0, "%");
    var ro = k.readouts(["Mg qui brûle","O₂ consommé","MgO formé","Mg restant"]);
    var nt = k.note("","");
    var lp = k.loop(function(dt){ var v=av.value+dt*30; if(v>=100){ v=100; lp.pause(); } av.set(v); k.redraw(); });
    k.button("Enflammer", function(){ av.set(0); lp.play(); }, true);
    k.draw(function(){
      c.clear(); CH.bg(c); var W=c.W,H=c.H,g=c.ctx, m=ms.value, open=md.value==="ouvert", o2av=0.28*vs.value, mb=open?m:Math.min(m,1.5*o2av), p=av.value/100;
      var mgNow=m-mb*p, o2c=2/3*mb*p, mgo=5/3*mb*p, left=m-mb;
      // barres
      var bx=40, by=H-60, bh=H-110, mxv=Math.max(m*5/3,m+o2c,1)*1.05, sc=bh/mxv, bw=Math.min(40,(W*0.5)/3-10);
      D.line(c,bx-8,by,W-10,by,"#8a95a3",1.4);
      var bars=[["Mg",mgNow,"#9aa7ba"],["O₂ pris à l'air",o2c,"#f19a8f"],["MgO",mgo,"#e8e8e8"]];
      bars.forEach(function(b,i){ var x=bx+6+i*(bw+16); rr(c,x,by-b[1]*sc,bw,b[1]*sc,b[2],"#6b7686",1.5,3); T(c,F(b[1],2)+" g",x+bw/2,by-b[1]*sc-10,{size:12,color:P.ink}); T(c,b[0].replace(" pris à l'air",""),x+bw/2,by+14,{size:12,color:P.grey}); });
      // creuset / enceinte
      var cx=W*0.74, cy=H*0.56, burning=p>0.03&&p<0.97&&mb>0, bwid=Math.min(W*0.4,150);
      if(open){ g.save(); g.fillStyle="#d9d2c4"; g.strokeStyle="#6b7a90"; g.lineWidth=2.4; g.beginPath(); g.moveTo(cx-bwid*0.4,cy-30); g.lineTo(cx-bwid*0.28,cy+14); g.lineTo(cx+bwid*0.28,cy+14); g.lineTo(cx+bwid*0.4,cy-30); g.closePath(); g.fill(); g.stroke(); g.restore(); D.line(c,cx-bwid*0.55,cy+22,cx+bwid*0.55,cy+22,"#6b7a90",3); }
      else { g.save(); CH.rr(c,cx-bwid/2,cy-86,bwid,100,"rgba(150,190,230,.14)","#6b7a90",2.4,12); g.restore(); D.text(c,"air",cx+bwid/2-18,cy-72,{size:10.5,color:"rgba(31,75,158,.5)"}); CH.rr(c,cx-bwid*0.3,cy+10,bwid*0.6,8,"#8a97a9",null,0,3); }
      D.label(c,open?"creuset (air libre)":"enceinte "+F(vs.value,1)+" L d'air",cx,cy+38,{size:11,color:P.grey});
      if(burning){ D.glow(c,cx,cy-26,bwid*0.7,"#fff7d6",0.95); D.glow(c,cx,cy-26,bwid*0.45,P.yellow,.6); CH.ball(c,cx,cy-26,6+Math.min(10,mgNow*2),"#ffffff","",{lw:0}); for(var fi=0;fi<6;fi++){ var fa=Date.now()/90+fi*1.7; D.line(c,cx,cy-26,cx+Math.cos(fa)*bwid*0.32,cy-26+Math.sin(fa)*bwid*0.32,"rgba(255,255,255,.7)",1.5); } }
      else { CH.ball(c,cx,cy-12,7+Math.min(15,(m*(1-p)+mgo*p)*1.6),p>0.5?"#ececec":"#9aa7ba","",{lw:1.2,stroke:"#7b8592"}); }
      var reading = open ? m+o2c : m+o2av;  /* ouvert : creuset ; fermé : total enceinte (solide + air) */
      D.label(c,(open?"Masse du creuset : ":"Masse totale de l'enceinte : ")+F(open?m+o2c:m+o2av,2)+" g",W/2,16,{size:12.5,color:P.mat});
      ro.set(0,F(mb*p,2)+" g"); ro.set(1,F(o2c,2)+" g"); ro.set(2,F(mgo,2)+" g"); ro.set(3,F(mgNow,2)+" g");
      nt.set(open?"Creuset ouvert : "+F(m,2)+" g de Mg + "+F(o2c,2)+" g de O₂ = <b>"+F(m+o2c,2)+" g</b> dans le creuset. La masse a augmenté de "+F(o2c,2)+" g : c'est le dioxygène de l'air.":"Enceinte fermée : l'air contient "+F(o2av,2)+" g de O₂, ce qui permet de brûler au plus "+F(1.5*o2av,2)+" g de Mg. "+(left>0.001?"Il reste "+F(left,2)+" g de Mg : le dioxygène est épuisé, la combustion s'arrête. ":"Tout le Mg brûle. ")+"La masse totale reste <b>"+F(m+o2av,2)+" g</b>.", open?"ok":(left>0.001?"warn":"ok"));
    });
  }
});

/* ---------- 4 · Chimie en cuisine : le ballon ---------- */
var CIBLES = [0.5,1,1.5,2,3];
SFA.sim({
  id:"c3-c07-ballon", ch:"c07", tag:"Défi",
  titre:"Chimie en cuisine : gonfler un ballon avec du bicarbonate et du vinaigre",
  resume:"La quantité de gaz formé dépend du réactif qui s'épuise en premier.",
  but:"Règle la masse de bicarbonate et le volume de vinaigre. Observe le volume de CO₂ formé, le réactif qui s'épuise et celui qui reste. Relève le défi : gonfler le ballon au volume demandé.",
  aRetenir:"Les réactifs sont consommés dans des proportions fixes (NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂). Quand l'un des deux est épuisé, la réaction s'arrête : c'est le réactif limitant ; l'autre reste en excès. Le volume de gaz dépend du réactif limitant, pas du réactif en excès.",
  piege:"Mettre plus de vinaigre ne donne pas plus de gaz si le bicarbonate est épuisé (et réciproquement). Hypothèses : vinaigre à 5 % (masse d'acide = 5 % de la masse de vinaigre, 1 mL ≈ 1 g), gaz à 20 °C et 1 atm (24 L par mole), masses molaires arrondies (NaHCO₃ : 84 ; acide éthanoïque : 60 g/mol).",
  build:function(k,S){
    var c = k.canvas(340);
    var mb = k.slider("Masse de bicarbonate", 0, 20, 0.25, 3.5, "g");
    var vv = k.slider("Volume de vinaigre (5 %)", 50, 500, 10, 100, "mL");
    var ro = k.readouts(["CO₂ formé","Volume de gaz","Réactif limitant","Reste"]);
    var nt = k.note("","");
    var ci=0, dn = k.note("","warn");
    k.button("Défi suivant", function(){ ci=(ci+1)%CIBLES.length; }, true);
    var lp3 = k.loop(function(){ k.redraw(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, nb=mb.value/84, na=0.05*vv.value/60, n=Math.min(nb,na), V=24*n, mco2=44*n;
      var lim = Math.abs(nb-na)<1e-9?"les deux":(nb<na?"bicarbonate":"vinaigre (acide)");
      var rest = nb<na ? "acide : "+F((na-nb)*60,1)+" g" : (nb>na ? "bicarbonate : "+F((nb-na)*84,1)+" g" : "rien");
      CH.bg(c,H-14);
      var fw=Math.min(W*0.3,130), fx=W*0.07, fh=Math.min(H*0.5,150), fy=H-20-fh;
      CH.flask(c,fx,fy,fw,fh,0.1+0.35*Math.min(1,vv.value/500),"rgba(240,226,150,.8)");
      var bxc=fx+fw/2+Math.min(W*0.1,40), rcap=Math.min(W*0.17,H*0.3), ppd=rcap/1.11, rdm=Math.pow(3*V/(4*Math.PI),1/3), rpx=Math.max(rdm*ppd,4);
      var bcy=fy-14-rpx*0.8+Math.sin(Date.now()/700)*1.5;
      D.line(c,fx+fw/2,fy+2,bxc,bcy+rpx*0.9,"#a33",4);
      var tg=CIBLES[ci], ok=Math.abs(V-tg)<=0.04, tr=Math.max(Math.pow(3*tg/(4*Math.PI),1/3)*ppd,4);
      g.save(); g.setLineDash([5,4]); g.strokeStyle=P.green; g.lineWidth=2.2; g.beginPath(); g.arc(bxc,bcy,tr,0,6.28); g.stroke(); g.restore();
      D.glow(c,bxc,bcy,rpx*1.3,P.red,.22); CH.ball(c,bxc,bcy,rpx,"#e07b7b","",{lw:2,stroke:ok?P.green:"#a33"});
      D.text(c,F(V,2)+" L",bxc,bcy,{size:rpx>18?13:11,color:rpx>14?"#fff":P.ink});
      D.label(c,"cible "+F(tg,1)+" L",W-8,16,{align:"right",size:12,color:ok?P.green:P.amber,fill:ok?"rgba(36,119,90,.14)":null});
      // barres de quantités
      var bx=W*0.62, bwid=W*0.34, bh=16, mx=Math.max(nb,na,0.01)*1.1;
      D.label(c,"quantités de matière",bx+bwid/2,H*0.34,{size:11,color:P.grey});
      rr(c,bx,H*0.44,bwid,bh,"#eef1f5",null,0,5); rr(c,bx,H*0.44,Math.max(2,bwid*nb/mx),bh,P.acc,null,0,5); T(c,"NaHCO₃ "+F(nb*1000,0)+" mmol",bx,H*0.44-9,{size:11.5,color:P.acc,align:"left"});
      rr(c,bx,H*0.62,bwid,bh,"#eef1f5",null,0,5); rr(c,bx,H*0.62,Math.max(2,bwid*na/mx),bh,P.amber,null,0,5); T(c,"CH₃COOH "+F(na*1000,0)+" mmol",bx,H*0.62-9,{size:11.5,color:P.amber,align:"left"});
      if(mb.value>0) D.label(c,"limitant : "+lim,bx+bwid/2,H*0.8,{size:11.5,color:P.red});
      ro.set(0,F(mco2,2)+" g"); ro.set(1,F(V,2)+" L"); ro.set(2,mb.value===0?"—":lim); ro.set(3,mb.value===0?"—":rest);
      nt.set(mb.value===0?"Ajoute du bicarbonate.":"n(bicarbonate) = "+F(mb.value,2)+" ÷ 84 = "+F(nb,4)+" mol ; n(acide) = 0,05 × "+vv.value+" ÷ 60 = "+F(na,4)+" mol. Le plus petit est limitant : "+F(n,4)+" mol de CO₂ × 24 L/mol = <b>"+F(V,2)+" L</b>.","");
      dn.set("<b>Défi :</b> gonfle le ballon à <b>"+F(tg,1)+" L</b> (±0,04 L)."+(ok?" ✓ Réussi !"+(Math.abs(nb-na)/Math.max(nb,na)>0.15?" (Mais il reste beaucoup de réactif inutile : essaie de limiter le gaspillage.)":""):""), ok?"ok":"warn");
    });
    lp3.play();
  }
});
})();
