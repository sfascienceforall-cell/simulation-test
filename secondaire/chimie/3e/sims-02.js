/* Chapitre 2 · Du modèle particulaire aux modèles de l'atome */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

/* ---------- 1 · États de la matière ---------- */
var SUBS = {
  eau:{n:"Eau", tm:0, tb:100}, eth:{n:"Éthanol", tm:-114, tb:78}, n2:{n:"Diazote", tm:-210, tb:-196}, hg:{n:"Mercure", tm:-39, tb:357}
};
SFA.sim({
  id:"c3-c02-etats", ch:"c02", tag:"Classique",
  titre:"Solide, liquide, gaz : le modèle particulaire en mouvement",
  resume:"Fais varier la température et observe l'agitation, l'ordre et l'écart entre les particules.",
  but:"Choisis une substance et fais varier sa température. Observe comment les particules s'ordonnent, bougent et s'écartent aux trois états.",
  aRetenir:"Solide : particules serrées, rangées, qui vibrent sur place. Liquide : serrées mais désordonnées, elles glissent les unes sur les autres. Gaz : très écartées, libres et rapides. Quand la température monte, l'agitation augmente ; entre les particules, il n'y a que du vide.",
  piege:"Les particules ne grossissent pas quand on chauffe : c'est l'agitation qui augmente (et la distance moyenne dans un gaz). Les particules sont dessinées comme des disques pour simplifier ; une vraie particule n'est pas un point coloré.",
build:function(k,S){
    var c = k.canvas(330);
    var sb = k.select("Substance", Object.keys(SUBS).map(function(i){return [i,SUBS[i].n+" (fusion "+SUBS[i].tm+" °C, ébullition "+SUBS[i].tb+" °C)"];}), "eau");
    var tp = k.slider("Température", -250, 400, 1, 20, "°C");
    var ro = k.readouts(["État","Température absolue","Agitation relative","Entre les particules"]);
    var nt = k.note("","");
    var DEF=[["eau","l","Amène l'eau à l'état liquide."],["eth","g","Fais bouillir l'éthanol (état gazeux)."],["hg","l","Le mercure est-il liquide à 20 °C ? Mets-le à l'état liquide."],["n2","l","Liquéfie le diazote (entre −210 et −196 °C)."],["eau","s","Solidifie l'eau (glace)."],["hg","g","Vaporise le mercure : jusqu'où faut-il chauffer ?"]];
    var di=0, dn=k.note("<b>Défi :</b> "+DEF[0][2],"warn");
    k.button("Défi suivant", function(){ di=(di+1)%DEF.length; sb.set(DEF[di][0]); }, true);
    var N=48, ps=[], i, R=CH.rng(7), SP=18, RD=8;
    for(i=0;i<N;i++){ ps.push({x:0,y:0,vx:0,vy:0,ph:R()*6.28,gx:i%8,gy:Math.floor(i/8)}); }
    var topB=0, last="", TMIN=-250, TMAX=400, tpix=null;
    function getBox(){ var w=Math.max(160,Math.min(c.W-136,320)); return {x:12,y:30,w:w,h:c.H-48}; }
    function state(){ var s=SUBS[sb.value], t=tp.value; return t<s.tm?"s":(t<s.tb?"l":"g"); }
    function reinit(box,mode){ ps.forEach(function(p){ if(mode==="s"){ p.x=box.x+box.w/2+(p.gx-3.5)*SP; p.y=box.y+box.h-16-(5-p.gy)*SP; } else { p.x=box.x+12+R()*(box.w-24); p.y=box.y+box.h*0.5+R()*box.h*0.45; } var a=R()*6.28; p.vx=Math.cos(a); p.vy=Math.sin(a); }); }
    var lp = k.loop(function(dt,tt){
      var box=getBox(), s=state(), Tk=tp.value+273.15;
      if(s!==last){ if(last===""||last==="s"||s==="s") reinit(box,s); last=s; }
      var sp=5.5*Math.sqrt(Math.max(Tk,5))*(s==="g"?1:0.32);
      var targetTop=s==="g"?box.y:box.y+box.h-SP*6.2; topB+=(targetTop-topB)*Math.min(1,dt*4);
      ps.forEach(function(p){
        if(s==="s"){ var Tm=SUBS[sb.value].tm+273.15, A=0.6+3.2*Math.min(1,Tk/Tm); var hx=box.x+box.w/2+(p.gx-3.5)*SP, hy=box.y+box.h-16-(5-p.gy)*SP; p.x+=((hx+A*Math.sin(tt*9+p.ph))-p.x)*Math.min(1,dt*10); p.y+=((hy+A*Math.cos(tt*8+p.ph*1.3))-p.y)*Math.min(1,dt*10); }
        else { p.vx+=(R()-0.5)*dt*8; p.vy+=(R()-0.5)*dt*8; var m=Math.hypot(p.vx,p.vy)||1; p.vx/=m; p.vy/=m; p.x+=p.vx*sp*dt; p.y+=p.vy*sp*dt;
          var top=topB+RD; if(p.x<box.x+RD){p.x=box.x+RD;p.vx=Math.abs(p.vx);} if(p.x>box.x+box.w-RD){p.x=box.x+box.w-RD;p.vx=-Math.abs(p.vx);} if(p.y<top){p.y=top;p.vy=Math.abs(p.vy);} if(p.y>box.y+box.h-RD){p.y=box.y+box.h-RD;p.vy=-Math.abs(p.vy);} } });
      if(s==="l"){ for(var a=0;a<N;a++)for(var b=a+1;b<N;b++){ var dx=ps[b].x-ps[a].x, dy=ps[b].y-ps[a].y, d=Math.hypot(dx,dy), md=RD*2; if(d<md&&d>0.01){ var f=(md-d)/2/d; ps[a].x-=dx*f; ps[a].y-=dy*f; ps[b].x+=dx*f; ps[b].y+=dy*f; } } }
      k.redraw();
    });
    function Ty(box,t){ return box.y+box.h-(t-TMIN)/(TMAX-TMIN)*box.h; }
    c.pointer(function(type,pt){ if(type==="up"||type==="move"||!tpix) return; if(pt.x>tpix-26){ var box=getBox(); tp.set(Math.round(TMIN+(box.y+box.h-pt.y)/box.h*(TMAX-TMIN))); k.redraw(); } });
    k.draw(function(){
      c.clear(); CH.bg(c); var W=c.W, box=getBox(), s=state(), sub=SUBS[sb.value], t=tp.value, g=c.ctx;
      var col=s==="s"?P.acc:(s==="l"?P.teal:P.red), name=s==="s"?"solide":(s==="l"?"liquide":"gaz");
      CH.title(c,sub.n+" · "+name,col);
      CH.rr(c,box.x,box.y,box.w,box.h,"#fbfcfe","#8996a8",2.4,10);
      if(s==="l"){ g.save(); g.beginPath(); g.rect(box.x+1.2,topB,box.w-2.4,box.y+box.h-topB-1.2); g.fillStyle=D.tint(col,.12); g.fill(); g.restore(); }
      if(s==="s"){ g.save(); CH.rr(c,box.x+box.w/2-4*SP-4,box.y+box.h-16-5*SP-RD-3,8*SP+8,6*SP+6,D.tint(col,.1),null,0,6); g.restore(); }
      ps.forEach(function(p){ CH.ball(c,p.x||box.x+30,p.y||box.y+30,RD,col,"",{lw:1}); });
      if(s==="g"){ var spd=Math.min(14,Math.sqrt(t+273.15)*0.55); for(var q=0;q<8;q++){ var p=ps[q*5]; D.arrow(c,p.x,p.y,p.x+p.vx*spd,p.y+p.vy*spd,"rgba(15,27,45,.5)",1.3); } }
      // thermomètre : zones d'état, curseur déplaçable
      var tx=box.x+box.w+30; tpix=tx; var tw=16, y0=Ty(box,TMAX), y1=Ty(box,TMIN), ym=Ty(box,Math.max(TMIN,Math.min(TMAX,sub.tm))), yb=Ty(box,Math.max(TMIN,Math.min(TMAX,sub.tb)));
      CH.rr(c,tx-tw/2,y0,tw,y1-y0,"#eef2f7","#8996a8",1.6,8);
      g.save(); g.beginPath(); g.rect(tx-tw/2+2,y0+1,tw-4,y1-y0-2); g.clip();
      g.fillStyle=D.tint(P.red,.25); g.fillRect(tx-tw/2,y0,tw,yb-y0); g.fillStyle=D.tint(P.teal,.28); g.fillRect(tx-tw/2,yb,tw,ym-yb); g.fillStyle=D.tint(P.acc,.28); g.fillRect(tx-tw/2,ym,tw,y1-ym);
      g.fillStyle=P.red; g.fillRect(tx-2.5,Ty(box,t),5,y1-Ty(box,t)); g.restore();
      CH.circ(c,tx,Ty(box,t),8,"#fff",col,3);
      [[sub.tm,"fusion"],[sub.tb,"ébullition"]].forEach(function(m){ if(m[0]>=TMIN&&m[0]<=TMAX){ var yy=Ty(box,m[0]); D.line(c,tx-tw/2-6,yy,tx+tw/2+6,yy,P.ink,1.4); D.label(c,m[1]+" "+m[0]+" °C",tx+tw/2+9,yy+(m[1]==="fusion"?8:-8),{size:10,color:"#4b586a",align:"left"}); } });
      D.label(c,F(t,0)+" °C",tx,y0-12,{size:12,color:col});
      D.text(c,"glisse",tx,y1+9,{size:10.5,color:P.grey});
      var edge=(Math.abs(t-sub.tm)<0.5)?" (fusion)":(Math.abs(t-sub.tb)<0.5?" (ébullition)":"");
      ro.set(0,name+edge); ro.set(1,F(t+273.15,0)+" K"); ro.set(2,F(Math.sqrt((t+273.15)/293.15)*100,0)+" %"); ro.set(3,"du vide");
      nt.set(s==="s"?"Solide : chaque particule vibre autour d'une position fixe ; plus T monte, plus la vibration est ample.":s==="l"?"Liquide : particules au contact mais désordonnées, qui glissent : le liquide prend la forme du récipient.":"Gaz : particules très éloignées, rapides (flèches = vitesse), qui occupent tout le volume disponible.", "ok");
      var ok=DEF[di][0]===sb.value&&s===DEF[di][1]; dn.set("<b>Défi :</b> "+DEF[di][2]+(ok?" ✓ Réussi !":""), ok?"ok":"warn");
    });
    lp.play();
  }
});

/* ---------- 2 · Expérience de Rutherford ---------- */
var CIBLES = {al:{n:"Aluminium (Z = 13)", z:13}, cu:{n:"Cuivre (Z = 29)", z:29}, ag:{n:"Argent (Z = 47)", z:47}, au:{n:"Or (Z = 79)", z:79}};
SFA.sim({
  id:"c3-c02-rutherford", ch:"c02", tag:"Expérience",
  titre:"L'expérience de Rutherford : tirer sur une feuille d'or",
  resume:"Envoie des particules α sur un atome : avec un noyau minuscule, quelques-unes sont fortement déviées.",
  but:"Compare le modèle de Thomson (charge répartie) et celui de Rutherford (noyau). Tire des particules α sur la cible et compte celles qui sont déviées.",
  aRetenir:"Presque toutes les particules α traversent la feuille sans être déviées : l'atome est surtout du vide. Quelques-unes sont fortement déviées, certaines rebroussent chemin : il existe un noyau minuscule, très dense, chargé positivement. Plus Z est grand, plus les déviations sont fréquentes.",
  piege:"Le noyau est dessiné beaucoup trop gros pour qu'on le voie, et les proportions de particules déviées sont volontairement exagérées (dans l'expérience réelle, environ 1 sur 8 000 rebondit). Les trajectoires sont des hyperboles ; on les a simplifiées en deux segments.",
build:function(k,S){
    var c = k.canvas(350);
    var md = k.seg("Modèle de l'atome", [["th","Thomson"],["ru","Rutherford"]], "ru");
    var cb = k.select("Cible", Object.keys(CIBLES).map(function(i){return [i,CIBLES[i].n];}), "au");
    var ro = k.readouts(["Particules tirées","Quasi tout droit (< 5°)","Déviées (5° à 90°)","Rebroussent chemin (> 90°)"]);
    var nt = k.note("<b>Vise</b> : touche ou glisse dans la scène pour orienter le canon et tirer une particule α. Plus tu vises près du noyau, plus elle est déviée.","");
    var R=CH.rng(11), tally, flies, flashes, aim=0.55, Bm=150;
    function reset(){ tally={n:0,s:0,m:0,b:0}; flies=[]; flashes=[]; }
    reset();
    function geom(){ var W=c.W,H=c.H; return {xn:W*0.46, yc:H*0.52, rs:Math.min(H*0.42,W*0.4), ym:Math.min(H*0.36,130)}; }
    function shot(b, u, anim){
      var th=md.value==="th", z=CIBLES[cb.value].z, ang;
      if(th) ang=(R()-0.5)*0.02; else { var a=0.025*z; ang=2*Math.atan(a/Math.max(Math.abs(b),1e-6)); if(b<0) ang=-ang; }
      var deg=Math.abs(ang)*180/Math.PI; tally.n++; if(deg<5) tally.s++; else if(deg<=90) tally.m++; else tally.b++;
      var gm=geom(), sgn=b>=0?1:-1, y0=gm.yc+sgn*Math.abs(u)*gm.ym, aa=Math.abs(ang), dir=[Math.cos(aa),sgn*Math.sin(aa)];
      var pts=[[24,y0]], s0=30, i, A=[gm.xn-s0,y0], C=[gm.xn,y0], E=[C[0]+dir[0]*s0,C[1]+dir[1]*s0];
      if(th) { pts.push([gm.xn+gm.rs*Math.cos(0),y0+0]); }
      else { for(i=0;i<=10;i++){ var q=i/10; pts.push([(1-q)*(1-q)*A[0]+2*q*(1-q)*C[0]+q*q*E[0],(1-q)*(1-q)*A[1]+2*q*(1-q)*C[1]+q*q*E[1]]); }
        var dx=dir[0], dy=dir[1], px=C[0]-gm.xn, py=C[1]-gm.yc, bq=px*dx+py*dy, cq=px*px+py*py-gm.rs*gm.rs, t2=-bq+Math.sqrt(Math.max(0,bq*bq-cq)); pts.push([C[0]+dx*t2,C[1]+dy*t2]); }
      var end=pts[pts.length-1], ex=th?gm.xn+Math.sqrt(Math.max(0,gm.rs*gm.rs-(y0-gm.yc)*(y0-gm.yc))):end[0]; if(th) end=[ex,y0];
      pts[pts.length-1]=end; var fl={x:end[0],y:end[1],deg:deg};
      if(anim) flies.push({pts:pts,d:0,fl:fl,deg:deg}); else flashes.push({x:fl.x,y:fl.y,a:1,deg:deg});
      if(flashes.length>500) flashes.shift();
    }
    function randShot(){ var u=(R()*2-1), b=u*u*Bm*(u<0?-1:1)*(u<0?1:1); b=Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1); shot(b,u,false); }
    function fire(n){ for(var i=0;i<n;i++) randShot(); }
    k.button("Tirer 1 (visé)", function(){ var u=aim*2-1; shot(Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1),u,true); });
    k.button("Tirer 20", function(){ for(var i=0;i<20;i++) setTimeout(randShotAnim,i*45); }, true);
    k.button("Tirer 500", function(){ fire(500); });
    k.button("Effacer", function(){ reset(); });
    function randShotAnim(){ var u=(R()*2-1); shot(Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1),u,true); k.redraw(); }
    c.pointer(function(type,pt){ if(type==="move"||type==="up") return; var gm=geom(); var u=Math.max(-1,Math.min(1,(pt.y-gm.yc)/gm.ym)); aim=(u+1)/2; if(type==="down"){ shot(Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1),u,true); } k.redraw(); });
    var lp = k.loop(function(dt){ var any=false; flies.forEach(function(f){ f.d+=dt*520; any=true; });
      flies=flies.filter(function(f){ var L=0,i; for(i=1;i<f.pts.length;i++) L+=Math.hypot(f.pts[i][0]-f.pts[i-1][0],f.pts[i][1]-f.pts[i-1][1]); if(f.d>=L){ flashes.push({x:f.fl.x,y:f.fl.y,a:1,deg:f.deg}); return false; } return true; });
      flashes.forEach(function(f){ if(f.a>0.35) f.a-=dt*0.9; }); if(any||flashes.some(function(f){return f.a>0.36;})) k.redraw(); });
    lp.play();
    function at(f){ var d=f.d,i,p=f.pts; for(i=1;i<p.length;i++){ var l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]); if(d<=l){ var q=l?d/l:0; return [p[i-1][0]+(p[i][0]-p[i-1][0])*q,p[i-1][1]+(p[i][1]-p[i-1][1])*q,i]; } d-=l; } return [p[p.length-1][0],p[p.length-1][1],p.length-1]; }
    k.draw(function(){
      c.clear(); CH.bg(c); var W=c.W,H=c.H,g=c.ctx, gm=geom(), xn=gm.xn, yc=gm.yc;
      CH.title(c,md.value==="th"?"Modèle de Thomson : charge + répartie":"Modèle de Rutherford : noyau minuscule",md.value==="th"?P.amber:P.red);
      // écran circulaire
      g.save(); g.beginPath(); g.arc(xn,yc,gm.rs,0,6.2832); g.strokeStyle="rgba(46,160,120,.35)"; g.lineWidth=7; g.stroke(); g.restore();
      D.text(c,"écran fluorescent (ZnS)",xn,yc-gm.rs-10,{size:11,color:"#4b586a"});
      // atome
      var ra=Math.min(gm.ym*0.95,70);
      if(md.value==="th"){ CH.circ(c,xn,yc,ra,"rgba(214,87,70,.22)","#c77",1.5); for(var i=0;i<12;i++){ var a=i*2.4, r=ra*.78*Math.sqrt((i+.5)/12); D.text(c,"−",xn+r*Math.cos(a),yc+r*Math.sin(a),{size:17,color:P.acc}); } }
      else { g.save(); g.setLineDash([4,4]); CH.circ(c,xn,yc,ra,null,"#aab4c4",1.4); g.restore(); D.glow(c,xn,yc,26,P.red,.5); CH.ball(c,xn,yc,6,P.red,""); D.text(c,"noyau (+)",xn+10,yc+ra*.45+8,{size:11,color:P.red,align:"left"}); }
      // faisceau visé
      var yaim=yc+(aim*2-1)*gm.ym; D.line(c,40,yaim,xn-ra,yaim,"rgba(31,75,158,.25)",1.2,[3,5]);
      CH.rr(c,6,yaim-9,36,18,"#5b6677",null,0,5); CH.rr(c,38,yaim-4,10,8,"#3c4656",null,0,2); D.text(c,"α",24,yaim+1,{size:12,color:"#fff"});
      flashes.forEach(function(f){ var col=f.deg<5?"46,107,85":f.deg<=90?"180,83,9":"180,35,24"; g.fillStyle="rgba("+col+","+f.a.toFixed(2)+")"; g.beginPath(); g.arc(f.x,f.y,f.a>.9?4:2.4,0,6.3); g.fill(); });
      flies.forEach(function(f){ var p=at(f), col=f.deg<5?"#2e6b55":f.deg<=90?"#b45309":"#b42318"; g.strokeStyle=col; g.lineWidth=1.6; g.globalAlpha=.6; g.beginPath(); g.moveTo(f.pts[0][0],f.pts[0][1]); for(var i=1;i<p[2];i++) g.lineTo(f.pts[i][0],f.pts[i][1]); g.lineTo(p[0],p[1]); g.stroke(); g.globalAlpha=1; CH.circ(c,p[0],p[1],3.8,col,"#fff",1); });
      D.label(c,"vert : < 5°   orange : 5–90°   rouge : > 90°",W-8,H-14,{align:"right",size:10.5,color:"#4b586a"});
      ro.set(0,String(tally.n)); var n=Math.max(1,tally.n);
      ro.set(1,tally.s+" ("+F(100*tally.s/n,0)+" %)"); ro.set(2,tally.m+" ("+F(100*tally.m/n,0)+" %)"); ro.set(3,tally.b+" ("+F(100*tally.b/n,1)+" %)");
    });
  }
});

/* ---------- 3 · Constructeur d'atomes ---------- */
var EL = [null,["H","hydrogène"],["He","hélium"],["Li","lithium"],["Be","béryllium"],["B","bore"],["C","carbone"],["N","azote"],["O","oxygène"],["F","fluor"],["Ne","néon"],["Na","sodium"],["Mg","magnésium"],["Al","aluminium"],["Si","silicium"],["P","phosphore"],["S","soufre"],["Cl","chlore"],["Ar","argon"],["K","potassium"],["Ca","calcium"]];
var STAB = [null,[1,2],[3,4],[6,7],[9],[10,11],[12,13],[14,15],[16,17,18],[19],[20,21,22],[23],[24,25,26],[27],[28,29,30],[31],[32,33,34,36],[35,37],[36,38,40],[39,41],[40,42,43,44,46]];
var DEFIS = [
  {t:"Construis l'ion sodium Na⁺.", f:function(p,n,e){ return p===11&&e===10; }},
  {t:"Construis l'ion chlorure Cl⁻.", f:function(p,n,e){ return p===17&&e===18; }},
  {t:"Construis l'atome neutre de carbone 14 (radioactif, utilisé pour la datation).", f:function(p,n,e){ return p===6&&n===8&&e===6; }},
  {t:"Construis l'ion aluminium Al³⁺.", f:function(p,n,e){ return p===13&&e===10; }},
  {t:"Construis l'ion oxyde O²⁻.", f:function(p,n,e){ return p===8&&e===10; }},
  {t:"Construis l'atome neutre de lithium 7.", f:function(p,n,e){ return p===3&&n===4&&e===3; }},
  {t:"Construis l'atome neutre de néon 20.", f:function(p,n,e){ return p===10&&n===10&&e===10; }}
];
SFA.sim({
  id:"c3-c02-atome", ch:"c02", tag:"Classique",
  titre:"Constructeur d'atomes et d'ions",
  resume:"Ajoute des protons, des neutrons et des électrons : l'élément, la charge et la stabilité se mettent à jour.",
  but:"Règle le nombre de protons, de neutrons et d'électrons (curseurs ou boutons sur le dessin). Regarde quel élément tu obtiens, sa charge, et réalise les défis.",
  aRetenir:"Le nombre de protons Z définit l'élément. Le nombre de masse est A = Z + N. Un atome est neutre quand e⁻ = Z. Si e⁻ ≠ Z, on a un ion : changer le nombre d'électrons ne change jamais l'élément.",
  piege:"Pour fabriquer un ion, on ajoute ou on retire des électrons, jamais des protons (ce serait un autre élément). Le « noyau stable connu » concerne les isotopes naturels des 20 premiers éléments.",
  build:function(k,S){
    var c = k.canvas(400);
    var p = k.slider("Protons (Z)", 1, 20, 1, 6, "");
    var n = k.slider("Neutrons (N)", 0, 24, 1, 6, "");
    var e = k.slider("Électrons", 0, 20, 1, 6, "");
    var ro = k.readouts(["Élément","Noyau","Charge","Nombre de masse A"]);
    var nt = k.note("","");
    var di = 0, dn = k.note("<b>Défi :</b> "+DEFIS[0].t,"warn");
    k.button("Défi suivant", function(){ di=(di+1)%DEFIS.length; }, true);
    var chips = [], won = 0;
    var lp = k.loop(function(){ k.redraw(); });
    c.pointer(function(type,pt){ if(type!=="down") return; chips.forEach(function(h){ if(CH.hit(h,pt)){ var s=h.s; s.set(s.value+h.d); k.redraw(); } }); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, Z=p.value, N=n.value, E=e.value, small=W<420;
      CH.bg(c);
      var cx=W/2, cy=H/2-18, R=Math.min(W,H-96)/2-6, t=Date.now()/1000;
      var shells=[2,8,8,2], rem=E, ring=[];
      shells.forEach(function(cap){ var m=Math.min(cap,rem); ring.push(m); rem-=m; });
      var rad=[0.3,0.52,0.74,0.95].map(function(f){ return R*f; });
      ring.forEach(function(m,i){ if(m>0||i===0){ g.save(); g.setLineDash([3,5]); CH.circ(c,cx,cy,rad[i],null,"#b8c3d3",1.3); g.restore(); } });
      var tot=Z+N, ra=Math.max(3,Math.min(6.4,34/Math.sqrt(Math.max(tot,1))));
      D.glow(c,cx,cy,ra*7,P.red,.22);
      for(var i=0;i<tot;i++){ var r=ra*1.9*Math.sqrt(i+0.5)*0.88, a=i*2.39996; var isP=((i*7)%tot)<Z; CH.ball(c,cx+r*Math.cos(a),cy+r*Math.sin(a),ra,isP?P.red:"#8e98a6","",{lw:.6}); }
      ring.forEach(function(m,j){ for(var q=0;q<m;q++){ var a=-1.57+q*6.2832/m+j*0.5+t*(0.5-0.1*j); CH.ball(c,cx+rad[j]*Math.cos(a),cy+rad[j]*Math.sin(a),5.6,P.acc,"",{lw:1}); } });
      var el=EL[Z], A=Z+N, q=Z-E, stable=STAB[Z].indexOf(A)>=0;
      var qs=q===0?"":(Math.abs(q)===1?"":Math.abs(q))+(q>0?"+":"−");
      /* carte d'identité */
      var bx=8, by=8, bw=small?92:112, bh=small?72:84;
      D.panel(c,bx,by,bw,bh,{shadow:false});
      D.text(c,el[0],bx+bw/2+6,by+bh/2+4,{size:small?36:44,color:P.mat,math:true,weight:700});
      D.text(c,A,bx+14,by+16,{size:13,color:P.grey}); D.text(c,Z,bx+14,by+bh-14,{size:13,color:P.red});
      if(qs) D.text(c,qs,bx+bw-12,by+16,{size:13,color:q>0?P.red:P.acc});
      D.text(c,el[1],bx+bw/2,by+bh+10,{size:12,color:"#4b586a"});
      /* légende */
      D.legend(c,[[P.red,"proton (+)"],[ "#8e98a6","neutron (0)"],[P.acc,"électron (−)"]],W-8,8,{align:"right"});
      var conf=ring.filter(function(m){return m>0;}).join(" · ")||"0";
      D.label(c,"couches : "+conf,W-8,small?86:84,{align:"right",size:11,color:P.mat});
      var tag=q===0?"atome neutre":(q>0?"cation":"anion");
      D.label(c,tag+(stable?" · noyau stable":" · noyau instable"),cx,H-74,{size:11.5,color:q===0?P.green:P.amber});
      /* boutons sur le dessin */
      chips=[]; var items=[["p",p,P.red],["n",n,"#6b7686"],["e⁻",e,P.acc]], cw=(W-24)/3;
      items.forEach(function(it,i){ var x0=8+i*(cw+4)-0, w2=cw-2;
        D.text(c,it[0]+" = "+it[1].value,x0+w2/2,H-52,{size:12,color:it[2]});
        [-1,1].forEach(function(d,j){ var rx=x0+(j?w2/2+3:0), rw=w2/2-3; CH.rr(c,rx,H-40,rw,32,"#fff",it[2],1.6,10); D.text(c,d<0?"−":"+",rx+rw/2,H-24,{size:18,color:it[2]}); chips.push({x:rx,y:H-40,w:rw,h:32,s:it[1],d:d}); });
      });
      ro.set(0,el[1]+" ("+el[0]+")"); ro.set(1,"<sup>"+A+"</sup><sub>"+Z+"</sub>"+el[0]+(qs?"<sup>"+qs+"</sup>":"")); ro.set(2,q===0?"0 (neutre)":(q>0?"+"+q:"−"+Math.abs(q))); ro.set(3,String(A));
      var outer=ring[3]>0?ring[3]:(ring[2]>0?ring[2]:(ring[1]>0?ring[1]:ring[0]));
      nt.set((stable?"Ce noyau existe naturellement et est <b>stable</b>. ":"Ce noyau est <b>instable (radioactif)</b> ou n'existe pas dans la nature. ")+"Couche externe : "+outer+" électron"+(outer>1?"s":"")+". "+(q!==0?"Ce n'est pas un atome neutre : c'est un ion (les protons n'ont pas bougé).":"Atome neutre : autant de charges + que de charges −."), stable?"ok":"warn");
      var ok=DEFIS[di].f(Z,N,E);
      dn.set("<b>Défi :</b> "+DEFIS[di].t+(ok?" ✓ Réussi ! Passe au défi suivant.":""), ok?"ok":"warn");
    });
    lp.play();
  }
});

/* ---------- 4 · Évolution des modèles ---------- */
var MOD = {
  dalton:{y:"1803", n:"Dalton", e:"Lois de conservation de la masse et des proportions en chimie.", ok:"Explique pourquoi les masses se conservent : les atomes sont indestructibles et se réarrangent.", lim:"Ne dit rien des charges électriques : il n'explique pas l'électricité statique ni les éclairs."},
  thomson:{y:"1897-1904", n:"Thomson", e:"Rayons cathodiques : découverte de l'électron, particule négative très légère.", ok:"Explique que la matière contient des électrons et que l'atome est neutre.", lim:"Prévoit que les particules α traversent l'atome en étant à peine déviées : faux pour quelques-unes."},
  ruth:{y:"1911", n:"Rutherford", e:"Feuille d'or bombardée de particules α : quelques-unes rebondissent.", ok:"Explique les fortes déviations : noyau minuscule, dense, positif ; atome surtout vide.", lim:"Ne dit pas pourquoi les électrons ne tombent pas sur le noyau ni pourquoi les atomes émettent des couleurs précises."},
  bohr:{y:"1913", n:"Bohr", e:"Spectres de raies : un atome n'émet que certaines couleurs.", ok:"Explique les couches (niveaux d'énergie) et les couleurs émises.", lim:"Ne marche bien que pour l'hydrogène : l'électron n'a pas de trajectoire circulaire précise."},
  nuage:{y:"1926 →", n:"Modèle du nuage électronique", e:"Mécanique quantique : on ne peut que calculer la probabilité de trouver l'électron.", ok:"Modèle actuel : noyau + nuage de probabilité ; électrons répartis en couches.", lim:"Plus abstrait : c'est un modèle mathématique, lui-même susceptible d'évoluer."}
};
SFA.sim({
  id:"c3-c02-modeles", ch:"c02", tag:"Histoire",
  titre:"Cinq modèles de l'atome, cinq expériences",
  resume:"Parcours Dalton, Thomson, Rutherford, Bohr et le nuage électronique, avec l'expérience qui motive chaque modèle.",
  but:"Choisis un modèle (frise du bas ou boutons), change le nombre d'électrons, tire des particules α sur Thomson et Rutherford, et lis quelle observation chaque modèle explique… et laquelle il ne sait pas expliquer.",
  aRetenir:"Un modèle n'est pas une photo de la réalité : c'est une représentation qui explique des observations. Quand une expérience le contredit (Rutherford contre Thomson), on le remplace. Le noyau est environ 100 000 fois plus petit que l'atome : si l'atome mesurait 100 m, le noyau ferait 1 mm.",
  piege:"Les modèles anciens ne sont pas « faux et inutiles » : celui de Dalton suffit pour comprendre la conservation de la masse. Chaque modèle est valable dans son domaine. Les échelles ne sont pas respectées dans les dessins.",
  build:function(k,S){
    var c = k.canvas(400);
    var KEYS=["dalton","thomson","ruth","bohr","nuage"], dots=[];
    var md = k.seg("Modèle", [["dalton","Dalton"],["thomson","Thomson"],["ruth","Rutherford"],["bohr","Bohr"],["nuage","Nuage"]], "ruth");
    var ne = k.slider("Électrons", 1, 11, 1, 3, "");
    var shoot = k.toggle("Tirer des particules α (Thomson, Rutherford)", true);
    var nt = k.note("","");
    var R=rng(3), pts=[], al=[], tal={n:0,big:0,last:0};
    for(var i=0;i<400;i++){ pts.push([R(),R()*6.28]); }
    c.pointer(function(type,pt){ if(type!=="down") return; dots.forEach(function(d){ if(Math.abs(pt.x-d.x)<d.w/2&&pt.y>d.y-18&&pt.y<d.y+18){ md.set(d.k); tal.n=0; tal.big=0; al=[]; k.redraw(); } }); });
    var lp = k.loop(function(dt,t){
      var m=md.value; if(tal.m!==m){ tal.m=m; tal.n=0; tal.big=0; al=[]; }
      if(shoot.value&&(m==="thomson"||m==="ruth")&&t-tal.last>0.35){ tal.last=t; var b=(Math.random()*2-1)*1; al.push({b:b,u:0}); }
      al.forEach(function(a){ a.u+=dt*0.55; }); al=al.filter(function(a){ return a.u<1.2; });
      k.redraw();
    });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx,cx=W/2,cy=H/2-6,Ra=Math.min(W*0.3,(H-130)*0.5), t=Date.now()/1000, E=ne.value, m=md.value;
      CH.bg(c);
      /* modèle */
      if(m==="dalton"){ CH.ball(c,cx,cy,Ra*0.8,"#8d99ab",""); D.text(c,"sphère pleine,",cx,cy-6,{size:13,color:"#fff"}); D.text(c,"indivisible",cx,cy+10,{size:13,color:"#fff"}); }
      else if(m==="thomson"){ D.glow(c,cx,cy,Ra*1.25,P.red,.3); CH.circ(c,cx,cy,Ra,"rgba(214,87,70,0.2)","#c98a80",2);
        for(var i=0;i<E;i++){ var a=i*2.4, r=Ra*0.72*Math.sqrt((i+0.5)/E); CH.ball(c,cx+r*Math.cos(a),cy+r*Math.sin(a),6,P.acc,"−",{size:11}); }
        D.label(c,"charge + répartie (pudding), électrons − (raisins)",cx,cy+Ra+18,{size:11,color:P.red}); }
      else if(m==="ruth"){ D.glow(c,cx,cy,22,P.red,.55); CH.ball(c,cx,cy,5,P.red,"");
        for(var j=0;j<E;j++){ var rj=Ra*(0.4+0.55*((j*7)%E)/E), aj=t*(1.5/(0.5+rj/Ra))+j*2.1; g.save(); g.setLineDash([2,4]); CH.circ(c,cx,cy,rj,null,"#cdd5e2",1); g.restore(); CH.ball(c,cx+rj*Math.cos(aj),cy+rj*Math.sin(aj),4.6,P.acc,""); }
        D.label(c,"noyau minuscule et dense, beaucoup de vide",cx,cy+Ra+18,{size:11,color:P.red}); }
      else if(m==="bohr"){ var sh=[2,8,8,8], rem=E; D.glow(c,cx,cy,18,P.red,.5); CH.ball(c,cx,cy,7,P.red,"");
        sh.forEach(function(cap,jj){ var q=Math.min(cap,rem); rem-=q; var rj=Ra*(0.3+0.23*jj); if(q>0||jj===0){ g.save(); g.setLineDash([3,4]); CH.circ(c,cx,cy,rj,null,"#b8c3d3",1.3); g.restore(); D.text(c,"n="+(jj+1),cx+rj*0.71+10,cy-rj*0.71-4,{size:10,color:P.grey}); } for(var u=0;u<q;u++){ var aj=t*(0.9-0.15*jj)+u*6.2832/q; CH.ball(c,cx+rj*Math.cos(aj),cy+rj*Math.sin(aj),4.8,P.acc,""); } });
        D.label(c,"niveaux d'énergie (couches) : 2, 8, 8…",cx,cy+Ra+18,{size:11,color:P.acc}); }
      else { var sh2=[2,8,8], rem2=E, cum=[]; sh2.forEach(function(cap){ var q=Math.min(cap,rem2); rem2-=q; cum.push(q); });
        for(var ii=0;ii<pts.length;ii++){ var pt=pts[ii]; var which=ii%Math.max(1,E); var shell=which<cum[0]?0:(which<cum[0]+cum[1]?1:2); var mu=Ra*(0.3+0.25*shell), r=Math.abs(mu+(pt[0]-0.5)*Ra*0.3*(1+shell*0.3)); var a=pt[1]+t*0.25*(ii%3-1); g.fillStyle="rgba(30,63,143,0.32)"; g.fillRect(cx+r*Math.cos(a)-1.3,cy+r*Math.sin(a)-1.3,2.6,2.6); }
        D.glow(c,cx,cy,14,P.red,.5); CH.ball(c,cx,cy,4,P.red,""); D.label(c,"nuage de probabilité (pas de trajectoire)",cx,cy+Ra+18,{size:11,color:P.acc}); }
      /* particules alpha */
      if(m==="thomson"||m==="ruth"){
        D.text(c,"α",14,cy,{size:14,color:P.amber});
        al.forEach(function(a){ var x0=26, b=a.b*Ra*0.95, y0=cy+b, sgn=b>=0?1:-1;
          var ang=m==="ruth"?2*Math.atan(Ra*0.045/Math.max(0.5,Math.abs(b)))*sgn:0.03*(1-Math.abs(a.b))*sgn, xin=m==="ruth"?cx-8:cx, L1=xin-x0, TOT=L1+W*0.6, u=a.u*TOT;
          function pos(v){ return v<L1?[x0+v,y0]:[xin+(v-L1)*Math.cos(ang),y0+(v-L1)*Math.sin(ang)]; }
          var big=Math.abs(ang)>1.5708, col=big?"#b42318":(Math.abs(ang)>0.09?"#b45309":"#2e6b55"), pp=pos(u), v0=Math.max(0,u-90), q0=pos(v0);
          g.save(); g.strokeStyle=col; g.globalAlpha=.45; g.lineWidth=1.8; g.lineCap="round"; g.beginPath(); g.moveTo(q0[0],q0[1]); if(v0<L1&&u>L1) g.lineTo(xin,y0); g.lineTo(pp[0],pp[1]); g.stroke(); g.restore();
          if(pp[0]>0&&pp[0]<W&&pp[1]>0&&pp[1]<H) CH.ball(c,pp[0],pp[1],3.8,col,"");
          if(!a.done&&a.u>0.98){ a.done=1; tal.n++; if(big) tal.big++; } });
        D.label(c,"α tirées : "+tal.n+" · rebond > 90° : "+tal.big,W-8,14,{align:"right",size:11,color:tal.big?P.red:P.green});
      }
      D.label(c,MOD[m].n+" · "+MOD[m].y,10,14,{align:"left",size:13,color:P.mat});
      /* frise chronologique cliquable */
      var y=H-26; dots=[]; D.line(c,24,y,W-24,y,"#b8c3d3",2);
      KEYS.forEach(function(kk,i){ var x=24+(W-48)*i/4, on=kk===m; CH.circ(c,x,y,on?8:5.5,on?P.mat:"#fff",on?"#fff":"#8a95a3",2); D.text(c,MOD[kk].n.split(" ")[0]===("Modèle")?"Nuage":MOD[kk].n,x,y-18,{size:W<420?10:11,color:on?P.mat:"#6b7686"}); D.text(c,MOD[kk].y.split("-")[0].replace(" →",""),x,y+16,{size:10,color:"#8a95a3"}); dots.push({k:kk,x:x,y:y-4,w:(W-48)/4}); });
      nt.set("<b>Expérience / observation :</b> "+MOD[m].e+"<br><b>Ce que le modèle explique :</b> "+MOD[m].ok+"<br><b>Sa limite :</b> "+MOD[m].lim,"");
    });
    lp.play();
  }
});
})();
