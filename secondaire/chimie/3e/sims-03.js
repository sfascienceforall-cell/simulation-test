/* Chapitre 3 · Isotopes et masse atomique */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
var EL = [null,["H","hydrogène"],["He","hélium"],["Li","lithium"],["Be","béryllium"],["B","bore"],["C","carbone"],["N","azote"],["O","oxygène"],["F","fluor"],["Ne","néon"],["Na","sodium"],["Mg","magnésium"],["Al","aluminium"],["Si","silicium"],["P","phosphore"],["S","soufre"],["Cl","chlore"],["Ar","argon"],["K","potassium"],["Ca","calcium"]];
var STAB = [null,[1,2],[3,4],[6,7],[9],[10,11],[12,13],[14,15],[16,17,18],[19],[20,21,22],[23],[24,25,26],[27],[28,29,30],[31],[32,33,34,36],[35,37],[36,38,40],[39,41],[40,42,43,44,46]];
function nota(A,Z){ return "<sup>"+A+"</sup><sub>"+Z+"</sub>"+EL[Z][0]; }

/* ---------- 1 · Carte des nucléides ---------- */
SFA.sim({
  id:"c3-c03-carte", ch:"c03", tag:"Classique",
  titre:"Carte des noyaux : où sont les isotopes stables ?",
  resume:"Clique sur la carte (protons en ordonnée, neutrons en abscisse) : seuls certains noyaux sont stables.",
  but:"Clique sur une case (ou règle les curseurs). Repère la notation du noyau, les isotopes du même élément (même ligne) et la zone de stabilité.",
  aRetenir:"Des isotopes ont le même nombre de protons Z (même ligne) mais un nombre de neutrons différent. Ils ont les mêmes propriétés chimiques. Pour les petits noyaux, les noyaux stables ont à peu près autant de neutrons que de protons (N ≈ Z) ; une case non stable correspond à un noyau radioactif ou qui n'existe pas.",
  piege:"Z identifie l'élément, A ne l'identifie pas : le carbone 12 et le carbone 14 sont le même élément. Ne confonds pas Z (protons) et A (nombre de masse = protons + neutrons).",
  build:function(k,S){
    var c = k.canvas(370);
    var zs = k.slider("Protons Z", 1, 20, 1, 6, "");
    var ns = k.slider("Neutrons N", 0, 24, 1, 6, "");
    var ro = k.readouts(["Noyau","Élément","Protons / neutrons","Statut"]);
    var nt = k.note("","");
    var L=34, B=30, Tt=20, Rr=8;
    function geom(){ var cs=Math.min((c.W-L-Rr-18)/25,(c.H-B-Tt)/20); return {cs:cs}; }
    c.pointer(function(type,pt){ if(type==="up"||type==="move") return; var g=geom(); var n=Math.floor((pt.x-L)/g.cs), z=20-Math.floor((pt.y-Tt)/g.cs); if(n>=0&&n<=24&&z>=1&&z<=20){ ns.set(n); zs.set(z); k.redraw(); } });
    k.draw(function(){
      c.clear(); var g=geom(), cs=g.cs, ctx=c.ctx, Z=zs.value, N=ns.value;
      for(var z=1;z<=20;z++){ for(var n=0;n<=24;n++){ var st=STAB[z].indexOf(z+n)>=0, x=L+n*cs, y=Tt+(20-z)*cs;
        ctx.fillStyle=st?"#2e6b55":"#eef1f5"; ctx.fillRect(x+0.5,y+0.5,cs-1,cs-1); } }
      // ligne N = Z
      D.line(c,L+cs,Tt+20*cs,L+20.5*cs,Tt+0.5*cs,P.amber,1.5,[4,3]);
      ctx.font="600 11px Mulish, system-ui"; ctx.fillStyle="#5f6b7a"; ctx.textAlign="center"; ctx.textBaseline="top";
      for(n=0;n<=24;n+=4) ctx.fillText(String(n),L+(n+0.5)*cs,Tt+20*cs+4);
      ctx.textAlign="right"; ctx.textBaseline="middle"; for(z=2;z<=20;z+=2) ctx.fillText(String(z),L-4,Tt+(20-z+0.5)*cs);
      T(c,"neutrons N →",L+12.5*cs,Tt+20*cs+20,{size:12,color:P.ink});
      T(c,"Z",L-12,Tt-9,{size:12,color:P.ink});
      D.label(c,"N = Z",L+14*cs,Tt+5.5*cs,{size:10.5,color:P.amber});
      ctx.fillStyle="rgba(194,106,12,.13)"; ctx.fillRect(L,Tt+(20-Z)*cs,25*cs,cs);
      for(var zz=1;zz<=20;zz+=1){ if(zz%2===1&&zz!==Z) continue; ctx.font=(zz===Z?"800 ":"600 ")+"10px Mulish, system-ui"; ctx.fillStyle=zz===Z?P.amber:"#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="middle"; if(zz===Z||zz%2===0) ctx.fillText(EL[zz][0],L+25*cs+3,Tt+(20-zz+0.5)*cs); }
      ctx.strokeStyle=P.red; ctx.lineWidth=2.5; ctx.strokeRect(L+N*cs,Tt+(20-Z)*cs,cs,cs);
      var A=Z+N, stable=STAB[Z].indexOf(A)>=0;
      ro.set(0,nota(A,Z)); ro.set(1,EL[Z][1]); ro.set(2,Z+" p / "+N+" n"); ro.set(3,stable?"stable":"instable ou inexistant");
      nt.set("<b>"+EL[Z][1].charAt(0).toUpperCase()+EL[Z][1].slice(1)+"-"+A+"</b> : "+(stable?"isotope stable. ":"pas d'isotope stable naturel avec ce nombre de neutrons. ")+"Isotopes stables de cet élément : "+STAB[Z].map(function(a){return EL[Z][0]+"-"+a;}).join(", ")+". (Vert = noyau stable ; pointillé = N = Z.)", stable?"ok":"warn");
    });
  }
});

/* ---------- 2 · Masse atomique moyenne : la balance ---------- */
var ISO = {
  cl:{n:"Chlore", s:"Cl", m:[35,37], a:75.8, tab:35.45},
  cu:{n:"Cuivre", s:"Cu", m:[63,65], a:69.2, tab:63.55},
  br:{n:"Brome", s:"Br", m:[79,81], a:50.7, tab:79.90},
  b:{n:"Bore", s:"B", m:[10,11], a:19.9, tab:10.81},
  li:{n:"Lithium", s:"Li", m:[6,7], a:7.6, tab:6.94}
};
SFA.sim({
  id:"c3-c03-balance", ch:"c03", tag:"Défi",
  titre:"La masse atomique, c'est une moyenne : la balance isotopique",
  resume:"Règle l'abondance de chaque isotope : le point d'équilibre est la masse atomique moyenne.",
  but:"Choisis un élément et déplace le curseur d'abondance. Le point d'équilibre de la balance donne la masse atomique moyenne. Relève le défi : atteins la valeur du tableau périodique.",
  aRetenir:"Masse atomique moyenne = (abondance₁ × m₁) + (abondance₂ × m₂) avec des abondances exprimées en fractions de 1. Elle est comprise entre les masses des isotopes et n'est en général pas un nombre entier : elle penche vers l'isotope le plus abondant.",
  piege:"Le chlore ne contient pas d'atome de masse 35,5 : aucun atome n'a cette masse. C'est une moyenne sur un grand nombre d'atomes. Ici on utilise les nombres de masse (35 et 37) comme masses des isotopes : l'écart avec la valeur du tableau est inférieur à 0,1 u.",
  build:function(k,S){
    var c = k.canvas(300);
    var el = k.select("Élément", Object.keys(ISO).map(function(i){return [i,ISO[i].n+" ("+ISO[i].m[0]+" et "+ISO[i].m[1]+")"];}), "cl", function(){ sl.set(ISO[el.value].a); });
    var sl = k.slider("Abondance de l'isotope léger", 0, 100, 1, 76, "%");
    k.button("Valeur naturelle", function(){ sl.set(ISO[el.value].a); }, true);
    var ro = k.readouts(["Masse moyenne","Valeur du tableau","Écart","Isotope dominant"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, e=ISO[el.value], m1=e.m[0], m2=e.m[1], a=sl.value/100, mean=a*m1+(1-a)*m2;
      var x0=34, x1=W-34, lo=m1-1, hi=m2+1, X=function(m){ return x0+(m-lo)/(hi-lo)*(x1-x0); }, yb=H*0.52;
      // barre de la balance
      D.line(c,x0,yb,x1,yb,"#6b7686",5);
      for(var m=m1;m<=m2;m++){ D.line(c,X(m),yb,X(m),yb+8,P.grey,1.5); T(c,String(m),X(m),yb+22,{size:12,color:P.grey}); }
      T(c,"masse (u)",x1+8,yb+42,{size:12,color:P.grey,align:"right"});
      // masses : aire ∝ abondance
      var rmax=Math.min(52,(x1-x0)/(m2-m1)*0.38);
      [[m1,a,"#2058d6"],[m2,1-a,"#d33a2c"]].forEach(function(q){ var r=Math.max(3,rmax*Math.sqrt(q[1])); circ(c,X(q[0]),yb-3-r,r,q[2],"#fff",2); T(c,F(q[1]*100,0)+" %",X(q[0]),yb-3-r,{size:12,color:"#fff"}); T(c,e.s+"-"+q[0],X(q[0]),yb-3-2*r-12,{size:12,color:q[2]}); });
      // pivot
      g.save(); g.fillStyle=P.amber; g.beginPath(); g.moveTo(X(mean),yb+4); g.lineTo(X(mean)-12,yb+38); g.lineTo(X(mean)+12,yb+38); g.closePath(); g.fill(); g.restore();
      T(c,F(mean,2)+" u",X(mean),yb+54,{size:14,color:P.amber});
      T(c,"point d'équilibre = masse atomique moyenne",W/2,H-12,{size:12,color:P.grey});
      var target=Math.round((ISO[el.value].m[0]*ISO[el.value].a/100+ISO[el.value].m[1]*(1-ISO[el.value].a/100))*10)/10;
      ro.set(0,F(mean,2)+" u"); ro.set(1,F(e.tab,2)+" u"); ro.set(2,F(mean-e.tab,2)+" u");       ro.set(3, a>0.5? e.s+"-"+m1+" domine":(a<0.5? e.s+"-"+m2+" domine":"égalité"));
      var ok=Math.abs(mean-target)<=0.055;
      nt.set("<b>Défi :</b> règle l'abondance pour obtenir <b>"+F(target,1)+" u</b> (moyenne calculée avec les abondances naturelles et les nombres de masse ; elle est proche de la valeur du tableau, "+F(e.tab,2)+" u, pour "+e.n.toLowerCase()+")."+(ok?" ✓ Réussi : tu retrouves l'abondance naturelle (≈ "+F(ISO[el.value].a,0)+" %) !":" Actuellement : "+F(mean,2)+" u."), ok?"ok":"warn");
    });
  }
});

/* ---------- 3 · Spectromètre de masse ---------- */
var SM = {
  cl:{n:"Chlore", s:"Cl", iso:[[35,75.8],[37,24.2]]},
  br:{n:"Brome", s:"Br", iso:[[79,50.7],[81,49.3]]},
  cu:{n:"Cuivre", s:"Cu", iso:[[63,69.2],[65,30.8]]},
  ne:{n:"Néon", s:"Ne", iso:[[20,90.5],[21,0.3],[22,9.2]]},
  mg:{n:"Magnésium", s:"Mg", iso:[[24,79.0],[25,10.0],[26,11.0]]}
};
SFA.sim({
  id:"c3-c03-spectro", ch:"c03", tag:"Original",
  titre:"Spectromètre de masse : mesurer les isotopes",
  resume:"Des ions sont déviés par un champ magnétique : fais varier le champ pour amener chaque isotope sur le détecteur.",
  but:"Fais varier le champ magnétique (ou lance le balayage). Chaque isotope arrive sur le détecteur pour une valeur précise du champ : la hauteur du pic donne l'abondance.",
  aRetenir:"Plus un ion est lourd, moins il est dévié et plus il atterrit loin. Le spectre de masse a un pic par isotope ; la hauteur du pic mesure l'abondance. On en déduit la masse atomique moyenne, comme dans la balance.",
  piege:"Le spectromètre mesure des ions, pas des atomes neutres (ils sont ionisés avant). Ici le détecteur est fixe et c'est le champ qui varie ; les hauteurs sont des abondances relatives, pas des masses. Modèle simplifié : la relation masse–champ est de la forme m ∝ B², et l'écart entre trajectoires est amplifié sur le schéma.",
  build:function(k,S){
    var c = k.canvas(380);
    var el = k.select("Élément analysé", Object.keys(SM).map(function(i){return [i,SM[i].n];}), "cl", function(){ setup(); });
    var bs = k.slider("Champ magnétique B (unités relatives)", 0.9, 1.1, 0.0005, 1, "");
    var ro = k.readouts(["Masse qui arrive au détecteur","Signal","Isotope détecté","Masse atomique moyenne"]);
    var nt = k.note("","");
    var seen={}, mc=36, bmin=0.9, bmax=1.1;
    function setup(){ var e=SM[el.value], ms=e.iso.map(function(p){return p[0];}), mn=Math.min.apply(null,ms), mx=Math.max.apply(null,ms);
      mc=Math.round((mn+mx)/2); bmin=Math.sqrt((mn-2)/mc); bmax=Math.sqrt((mx+2)/mc);
      var r=bs.el; r.min=bmin; r.max=bmax; r.step=0.0005; bs.set((bmin+bmax)/2); seen={}; }
    function sig(m){ var s=0; SM[el.value].iso.forEach(function(p){ s+=p[1]*Math.exp(-0.5*Math.pow((m-p[0])/0.28,2)); }); return s; }
    setup();
    var bf=0, sweeping=false;
    var lp = k.loop(function(dt){ bf+=(bmax-bmin)*dt/7; if(bf>=bmax){ bf=bmax; sweeping=false; lp.pause(); } bs.set(bf); k.redraw(); });
    k.button("Balayage automatique", function(){ seen={}; bf=bmin; bs.set(bmin); sweeping=true; lp.play(); }, true);
    k.button("Effacer le spectre", function(){ seen={}; });
    bs.el.addEventListener("input", function(){ sweeping=false; lp.pause(); });
    var ICOL=[P.acc,P.red,P.green,P.amber], ions=[];
    var lp2 = k.loop(function(dt,t){ if(Math.random()<dt*9) ions.push({i:Math.floor(Math.random()*1e6),u:0}); ions.forEach(function(q){ q.u+=dt*0.9; }); ions=ions.filter(function(q){ return q.u<1; }); k.redraw(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, e=SM[el.value], B=bs.value, md=mc*B*B;
      CH.bg(c);
      var yTop=H*0.5, xs=44, K=4, fmax=Math.sqrt(Math.max.apply(null,e.iso.map(function(p){return p[0];}))/mc)/bmin, rref=(W-90)/2/(1+K*(fmax-1)), xd=xs+2*rref;
      seen[Math.round(B*4000)]=[md,sig(md)];
      /* champ magnétique : croix sur la zone */
      g.save(); g.fillStyle="rgba(31,75,158,.10)"; g.beginPath(); g.rect(xs-8,24,W-xs-8,yTop-24); g.fill(); g.restore();
      for(var gx=xs+6;gx<W-18;gx+=22) for(var gy=34;gy<yTop-8;gy+=22) D.text(c,"×",gx,gy,{size:11,color:"rgba(31,75,158,.28)"});
      D.label(c,"champ B (entrant)",W-8,14,{align:"right",size:10.5,color:P.acc});
      g.save(); g.lineCap="round"; D.line(c,xs-30,yTop,W-8,yTop,"#5b6677",3.5); g.restore();
      CH.rr(c,6,yTop-12,34,24,"#5b6677",null,0,5); D.text(c,"source",23,yTop+20,{size:10.5,color:P.grey}); D.glow(c,40,yTop,14,P.yellow,.6);
      var hit=-1, arcs=[];
      e.iso.forEach(function(p,i){ var r=rref*(1+K*(Math.sqrt(p[0]/mc)/B-1)), land=xs+2*r, dm=Math.abs(md-p[0]), onD=dm<0.35; if(onD) hit=i;
        arcs.push({r:r,land:land,col:ICOL[i%4],on:onD,m:p[0]});
        g.save(); g.strokeStyle=onD?ICOL[i%4]:"rgba(138,149,163,.55)"; g.lineWidth=onD?3.2:1.6; g.setLineDash(onD?[]:[5,5]); g.beginPath(); g.arc(xs+r,yTop,r,Math.PI,0); g.stroke(); g.restore();
        D.label(c,String(p[0]),land,yTop-12,{size:11,color:onD?ICOL[i%4]:P.grey}); });
      /* ions en vol */
      ions.forEach(function(q){ var ar=arcs[q.i%arcs.length], a=Math.PI+q.u*Math.PI; CH.ball(c,xs+ar.r+ar.r*Math.cos(a),yTop+ar.r*Math.sin(a),4,ar.col,"",{lw:.6}); });
      CH.rr(c,xd-9,yTop-5,18,10,hit>=0?ICOL[hit%4]:P.red,"#fff",1.5,3); if(hit>=0) D.glow(c,xd,yTop,26,ICOL[hit%4],.6); D.text(c,"détecteur",xd,yTop+20,{size:11,color:P.red});
      /* spectre */
      var gx0=44,gx1=W-14,gy0=H-30,gy1=yTop+50, ms=e.iso.map(function(p){return p[0];}), lo=Math.min.apply(null,ms)-2, hi=Math.max.apply(null,ms)+2, ymax=100;
      var X=function(m){ return gx0+(m-lo)/(hi-lo)*(gx1-gx0); }, Y=function(s){ return gy0-(s/ymax)*(gy0-gy1); };
      D.line(c,gx0,gy0,gx1,gy0,"#8a95a3",1.4); D.line(c,gx0,gy0,gx0,gy1,"#8a95a3",1.4);
      for(var m=Math.ceil(lo);m<=hi;m++){ D.line(c,X(m),gy0,X(m),gy0+4,P.grey,1); if((hi-lo)<10||m%2===0) T(c,String(m),X(m),gy0+14,{size:11,color:P.grey}); }
      T(c,"masse (u) →",gx1,H-5,{size:11.5,color:P.ink,align:"right"}); T(c,"signal (%)",gx0+4,gy1-10,{size:11.5,color:P.ink,align:"left"});
      var keys=Object.keys(seen).map(Number).sort(function(a,b){return a-b;});
      g.save(); g.strokeStyle=P.acc; g.lineWidth=2.2; g.lineJoin="round"; g.beginPath(); keys.forEach(function(kk,i){ var q=seen[kk]; if(i&&kk-keys[i-1]<=8) g.lineTo(X(q[0]),Y(q[1])); else g.moveTo(X(q[0]),Y(q[1])); }); g.stroke();
      g.lineTo(X(seen[keys[keys.length-1]][0]),gy0); g.lineTo(X(seen[keys[0]][0]),gy0); g.fillStyle="rgba(31,75,158,.14)"; g.fill(); g.restore();
      D.dot(c,X(md),Y(sig(md)),6,hit>=0?ICOL[hit%4]:P.red);
      var mean=0; e.iso.forEach(function(p){ mean+=p[0]*p[1]/100; });
      ro.set(0,F(md,2)+" u"); ro.set(1,F(sig(md),0)+" %"); ro.set(2,hit>=0?e.s+"-"+e.iso[hit][0]:"aucun"); ro.set(3,F(mean,2)+" u");
      var nseen=keys.length;
      nt.set(hit>=0?"Un pic ! L'isotope de masse "+e.iso[hit][0]+" arrive au détecteur ; sa hauteur est proportionnelle à son abondance (≈ "+F(e.iso[hit][1],1)+" %).":(nseen<6?"Fais varier B ou lance le balayage pour construire le spectre.":"Entre deux pics, aucun ion n'arrive : le signal retombe à zéro."), hit>=0?"ok":"");
    });
    lp2.play(); seen={}; bf=bmin; bs.set(bmin); sweeping=true; lp.play();
  }
});

/* ---------- 4 · Désintégrations : demi-vie ---------- */
var RAD = {
  c14:{n:"Carbone 14", u:"ans", T:5730, ex:"datation des restes organiques"},
  cs137:{n:"Césium 137", u:"ans", T:30, ex:"déchets nucléaires"},
  i131:{n:"Iode 131", u:"jours", T:8, ex:"médecine nucléaire"},
  u238:{n:"Uranium 238", u:"milliards d'années", T:4.47, ex:"âge de la Terre"}
};
SFA.sim({
  id:"c3-c03-demivie", ch:"c03", tag:"Aperçu",
  titre:"Demi-vie : des atomes qui se désintègrent au hasard",
  resume:"200 noyaux radioactifs se désintègrent au hasard : la courbe moyenne s'écrase d'un facteur 2 à chaque demi-vie.",
  but:"Lance la simulation. Aucun atome ne sait « quand » il se désintégrera, mais le groupe suit une loi : toutes les demi-vies, il en reste la moitié. Compare la courbe simulée à la courbe théorique.",
  aRetenir:"La demi-vie T est la durée au bout de laquelle la moitié des noyaux radioactifs d'un échantillon s'est désintégrée. Il en reste 1/2 après 1 T, 1/4 après 2 T, 1/8 après 3 T. On peut dater un objet en mesurant la fraction restante.",
  piege:"La demi-vie n'est pas une horloge : à chaque instant, chaque atome a la même probabilité de se désintégrer, quel que soit son âge. Après 2 demi-vies, il reste 1/4 (pas 0) de l'échantillon. Avec peu d'atomes, la courbe fluctue autour de la théorie.",
  build:function(k,S){
    var c = k.canvas(380);
    var el = k.select("Noyau radioactif", Object.keys(RAD).map(function(i){return [i,RAD[i].n+" (T = "+F(RAD[i].T,RAD[i].T%1===0?0:2)+" "+RAD[i].u+")"];}), "c14", function(){ init(); });
    var sp = k.slider("Vitesse", 0.2, 2, 0.1, 0.6, "demi-vies/s");
    var ro = k.readouts(["Temps écoulé","Noyaux restants","Fraction restante","Âge d'après la fraction"]);
    var nt = k.note("","");
    var N0=200, R=rng(5), alive, t, hist, tmax=8, dead={};
    function init(){ dead={}; alive=[]; for(var i=0;i<N0;i++) alive.push(true); t=0; hist=[[0,N0]]; }
    init();
    var lp = k.loop(function(dt){
      if(t>=tmax){ lp.pause(); return; }
      var dh=dt*sp.value; t+=dh; var p=1-Math.pow(2,-dh);
      for(var i=0;i<N0;i++) if(alive[i]&&R()<p){ alive[i]=false; dead[i]=t; }
      var cnt=0; alive.forEach(function(a){ if(a) cnt++; }); hist.push([t,cnt]); k.redraw();
    });
    k.button("Lancer / pause", function(){ if(t>=tmax) init(); if(lp.running) lp.pause(); else lp.play(); }, true);
    k.button("Recommencer", function(){ init(); lp.play(); });
    lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, r=RAD[el.value];
      var cols=20, rows=10, gs=Math.min((W-20)/cols,16), gx=(W-gs*cols)/2, gy=8;
      for(var i=0;i<N0;i++){ var cx=gx+(i%cols+0.5)*gs, cy=gy+(Math.floor(i/cols)+0.5)*gs, ag=t-(dead[i]||-9); if(alive[i]) CH.ball(c,cx,cy,gs*0.4,P.acc,"",{lw:.5}); else { if(ag<0.4) D.glow(c,cx,cy,gs*(1.1-ag*.5),P.amber,.4*(1-ag/0.4)); circ(c,cx,cy,gs*0.3,"#e4e9f0","#cfd7e2",1); } }
      var cnt=alive.filter(function(a){return a;}).length;
      var ax=D.axes(c,{x0:0,x1:tmax,y0:0,y1:100,xl:"temps (en demi-vies)",yl:"% restant",stepX:1,stepY:25,l:46,t:gy+rows*gs+10,b:30});
      D.fn(c,ax,function(x){ return 100*Math.pow(2,-x); },P.amber,2.2,[6,4]);
      g.save(); g.strokeStyle=P.acc; g.lineWidth=2.2; g.beginPath(); hist.forEach(function(h,i){ var x=ax.X(h[0]), y=ax.Y(h[1]/N0*100); if(i) g.lineTo(x,y); else g.moveTo(x,y); }); g.stroke(); g.restore();
      T(c,"théorie",ax.X(1.6),ax.Y(100*Math.pow(2,-1.6))-12,{size:12,color:P.amber,align:"left"});
      var frac=cnt/N0;
      ro.set(0,F(t,2)+" T = "+F(t*r.T,r.T>100?0:2)+" "+(r.u==="milliards d'années"?"Ga":r.u)); ro.set(1,cnt+" / "+N0); ro.set(2,F(frac*100,1)+" %");
      ro.set(3,cnt>0&&t>0?F(Math.log(N0/cnt)/Math.LN2*r.T,r.T>100?0:2)+" "+(r.u==="milliards d'années"?"Ga":r.u):"—");
      nt.set(t>=tmax?"Fin : après 8 demi-vies, il reste en théorie 100 ÷ 256 ≈ 0,4 % des noyaux. Utilisation : "+r.ex+".":"Laisse tourner et regarde : à t = 1 la courbe passe près de 50 %, à t = 2 près de 25 %.","");
    });
  }
});
})();
