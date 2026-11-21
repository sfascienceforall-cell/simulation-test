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
/* refonte 21/11/2026 : montage en 3D (source, feuille, écran sphérique) qu'on fait tourner + agrandissement de la feuille */
var CIBLES = {al:{n:"Aluminium (Z = 13)", z:13, nom:"d'aluminium", col:"#c9cfd6"}, cu:{n:"Cuivre (Z = 29)", z:29, nom:"de cuivre", col:"#d0824f"}, ag:{n:"Argent (Z = 47)", z:47, nom:"d'argent", col:"#d9dde2"}, au:{n:"Or (Z = 79)", z:79, nom:"d'or", col:"#e8b93c"}};
function shadeR(hex,f){ var m=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); if(!m) return hex; var v=[1,2,3].map(function(i){ var x=parseInt(m[i],16); x=f<0?x*(1+f):x+(255-x)*f; return Math.max(0,Math.min(255,Math.round(x))); }); return "rgb("+v.join(",")+")"; }
function ballR(g,x,y,r,hex,al){ if(!(r>0)||!isFinite(x)||!isFinite(y)) return; g.save(); if(al!=null) g.globalAlpha=al; var gr=g.createRadialGradient(x-r*.38,y-r*.42,r*.05,x,y,r*1.05); gr.addColorStop(0,shadeR(hex,.75)); gr.addColorStop(.45,hex); gr.addColorStop(1,shadeR(hex,-.45)); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,6.2832); g.fill(); g.restore(); }
function rot3R(p,a,b){ var x=p[0]*Math.cos(a)+p[2]*Math.sin(a), z=-p[0]*Math.sin(a)+p[2]*Math.cos(a), y=p[1]; return [x,y*Math.cos(b)-z*Math.sin(b),y*Math.sin(b)+z*Math.cos(b)]; }
function proj3R(p,st,sc,cx,cy){ var r=rot3R(p,st.a,st.b), s=1/(1-r[2]*0.11); return {x:cx+r[0]*sc*s, y:cy-r[1]*sc*s, z:r[2], s:s}; }
SFA.sim({
  id:"c3-c02-rutherford", ch:"c02", tag:"Expérience",
  titre:"L'expérience de Rutherford : tirer sur une feuille d'or",
  resume:"Des particules α sur une feuille d'or : presque toutes traversent, quelques-unes rebondissent. Montage en 3D et vue au cœur de la feuille.",
  but:"Compare le modèle de Thomson (charge répartie) et celui de Rutherford (noyau). En haut, le montage en 3D : glisse pour le faire tourner, les éclairs apparaissent là où les particules frappent l'écran. En bas, au cœur de la feuille : touche pour viser et tirer une particule α.",
  aRetenir:"Presque toutes les particules α traversent la feuille sans être déviées : l'atome est surtout du vide. Quelques-unes sont fortement déviées, certaines rebroussent chemin : il existe un noyau minuscule, très dense, chargé positivement. Plus Z est grand, plus les déviations sont fréquentes.",
  piege:"Le noyau est dessiné beaucoup trop gros pour qu'on le voie, et les proportions de particules déviées sont volontairement exagérées (dans l'expérience réelle, environ 1 sur 8 000 rebondit). Les trajectoires sont des hyperboles ; on les a simplifiées. L'écran est dessiné comme une sphère complète : dans le vrai montage, un petit écran fluorescent et un microscope tournaient autour de la feuille.",
build:function(k,S){
    var c = k.canvas(0,{ratio:.74});
    Object.defineProperty(c,"ratio",{get:function(){ var w=c.cv.parentNode?c.cv.parentNode.clientWidth:600; return w<460?1:.74; }, configurable:true}); c.resize();
    var z = k.canvas(0,{ratio:.42});
    Object.defineProperty(z,"ratio",{get:function(){ var w=z.cv.parentNode?z.cv.parentNode.clientWidth:600; return w<460?.62:.42; }, configurable:true}); z.resize();
    var md = k.seg("Modèle de l'atome", [["th","Thomson"],["ru","Rutherford"]], "ru");
    var cb = k.select("Cible", Object.keys(CIBLES).map(function(i){return [i,CIBLES[i].n];}), "au");
    var cont = k.toggle("Source ouverte (tir continu)", true);
    var ro = k.readouts(["Particules tirées","Quasi tout droit (< 5°)","Déviées (5° à 90°)","Rebroussent chemin (> 90°)"]);
    var nt = k.note("<b>Vise</b> : touche ou glisse dans l'agrandissement (en bas) pour tirer une particule α. Plus tu vises près du noyau, plus elle est déviée. Glisse sur le montage (en haut) pour le faire tourner.","");
    var R=CH.rng(11), tally, flies, flashes, hist, aim=0.62, Bm=150, view={a:-0.75, b:0.34, user:false, drag:false}, tt=0, acc=0, RS=1.3;
    function reset(){ tally={n:0,s:0,m:0,b:0}; flies=[]; flashes=[]; hist=[]; }
    reset();
    function cat(deg){ return deg<5?0:deg<=90?1:2; }
    var CAT = ["#3fbf86","#f0a030","#ff5a4a"];
    /* chemin dans l'agrandissement (coordonnées 0..1 de la largeur / hauteur), même modèle qu'avant */
    function zPath(u, ang, th){
      var xn=0.5, yc=0.5, ym=0.36, y0=yc+u*ym, pts=[[0,y0]];
      if(th){ pts.push([1.02, y0+ang*0.3]); return pts; }
      var aa=Math.abs(ang), sg=u>=0?1:-1, dir=[Math.cos(aa), sg*Math.sin(aa)], s0=0.07, A=[xn-s0,y0], C=[xn,y0], E=[C[0]+dir[0]*s0, C[1]+dir[1]*s0*1.6], i;
      pts.push(A); for(i=1;i<=10;i++){ var q=i/10; pts.push([(1-q)*(1-q)*A[0]+2*q*(1-q)*C[0]+q*q*E[0], (1-q)*(1-q)*A[1]+2*q*(1-q)*C[1]+q*q*E[1]]); }
      pts.push([E[0]+dir[0]*1.2, E[1]+dir[1]*1.2*1.6]); return pts;
    }
    function shot(b, u, anim){
      var th=md.value==="th", zz=CIBLES[cb.value].z, ang;
      if(th) ang=(R()-0.5)*0.02; else { var a=0.025*zz; ang=2*Math.atan(a/Math.max(Math.abs(b),1e-6)); if(b<0) ang=-ang; }
      var deg=Math.abs(ang)*180/Math.PI; tally.n++; var ct=cat(deg); if(ct===0) tally.s++; else if(ct===1) tally.m++; else tally.b++;
      /* en 3D : déviation d'angle |ang| dans un plan d'azimut phi (côté du tir) */
      var phi=(u>=0?Math.PI/2:-Math.PI/2)+(R()-0.5)*Math.PI, aa=Math.abs(ang), by=(R()-0.5)*0.08, bz=(R()-0.5)*0.08;
      var d=[Math.cos(aa), Math.sin(aa)*Math.sin(phi), Math.sin(aa)*Math.cos(phi)], hit=[d[0]*RS, d[1]*RS, d[2]*RS];
      var f={p0:[-1.62,by,bz], pf:[0,by,bz], hit:hit, q:0, deg:deg, ct:ct, zp:zPath(u, th?ang:ang, th)};
      if(anim){ flies.push(f); } else flashes.push({p:hit, a:0.6, ct:ct});
      if(flashes.length>600) flashes.shift();
    }
    function bOf(u){ return Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1); }
    function randShot(anim){ /* impacts répartis uniformément sur la surface du faisceau : |u| = √r, donc la plupart des particules passent loin du noyau */ var u=Math.sqrt(R())*(R()<0.5?-1:1); shot(bOf(u),u,anim); }
    k.button("Tirer 1 (visé)", function(){ var u=aim*2-1; shot(bOf(u),u,true); });
    k.button("Tirer 20", function(){ for(var i=0;i<20;i++) setTimeout(function(){ randShot(true); },i*45); }, true);
    k.button("Tirer 500", function(){ for(var i=0;i<500;i++) randShot(false); });
    k.button("Effacer", function(){ reset(); });
    c.pointer(function(type,p){ if(type==="down"){ view.drag=true; view.user=true; view.lx=p.x; view.ly=p.y; } else if(type==="drag"&&view.drag){ view.a+=(p.x-view.lx)*0.012; view.b=Math.max(-1.2,Math.min(1.3,view.b+(p.y-view.ly)*0.012)); view.lx=p.x; view.ly=p.y; } else if(type==="up") view.drag=false; });
    z.pointer(function(type,p){ if(type==="move"||type==="up") return; var u=Math.max(-1,Math.min(1,(p.y/z.H-0.5)/0.36)); aim=(u+1)/2; if(type==="down") shot(bOf(u),u,true); k.redraw(); });
    var lp = k.loop(function(dt){
      tt+=dt;
      if(cont.value){ acc+=dt*5; while(acc>=1){ acc--; randShot(true); } }
      if(!view.user) view.a=-0.75+0.32*Math.sin(tt*0.22);
      flies.forEach(function(f){ f.q+=dt*0.95; });
      flies=flies.filter(function(f){ if(f.q>=1){ flashes.push({p:f.hit, a:1, ct:f.ct}); hist.push({zp:f.zp, ct:f.ct}); if(hist.length>8) hist.shift(); return false; } return true; });
      flashes.forEach(function(f){ if(f.a>0.45) f.a-=dt*0.7; });
      k.redraw();
    });
    lp.play();
    function lerp3(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; }
    function pos3(f, q){ return q<0.5 ? lerp3(f.p0, f.pf, q/0.5) : lerp3(f.pf, f.hit, (q-0.5)/0.5); }
    function zAt(pts, q){ var L=0,i,seg=[]; for(i=1;i<pts.length;i++){ var l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(l); L+=l; } var d=q*L; for(i=1;i<pts.length;i++){ if(d<=seg[i-1]){ var t=seg[i-1]?d/seg[i-1]:0; return [pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t, i]; } d-=seg[i-1]; } var e=pts[pts.length-1]; return [e[0],e[1],pts.length-1]; }
    k.draw(function(){
      var W=c.W, H=c.H, g=c.ctx, ph1=W<460, cib=CIBLES[cb.value], th=md.value==="th", i, j;
      c.clear();
      /* intérieur de la chambre à vide */
      var bg=g.createRadialGradient(W*0.5,H*0.45,10,W*0.5,H*0.5,Math.max(W,H)*0.75); bg.addColorStop(0,"#26344a"); bg.addColorStop(1,"#0c1320"); g.fillStyle=bg; g.fillRect(0,0,W,H);
      var sc=Math.min(W*(ph1?0.25:0.3),H*0.36), cx=W*(ph1?0.58:0.53), cy=H*0.5, P3=function(p){ return proj3R(p,view,sc,cx,cy); };
      /* socle métallique */
      g.save(); g.beginPath(); for(i=0;i<=40;i++){ var an=i/40*6.2832, q=P3([Math.cos(an)*1.55,-1.42,Math.sin(an)*1.55]); i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y); } g.closePath(); var gb=g.createLinearGradient(0,cy,0,H); gb.addColorStop(0,"#5d6b7f"); gb.addColorStop(1,"#2e3846"); g.fillStyle=gb; g.fill(); g.strokeStyle="rgba(255,255,255,.18)"; g.stroke(); g.restore();
      /* écran fluorescent (sphère en fil) : moitié arrière puis moitié avant */
      function sphere(front){
        g.save(); g.strokeStyle=front?"rgba(90,230,170,.3)":"rgba(90,230,170,.12)"; g.lineWidth=1; g.beginPath();
        var seg=function(p1,p2){ var a1=P3(p1), a2=P3(p2); if((a1.z+a2.z>0)===front){ g.moveTo(a1.x,a1.y); g.lineTo(a2.x,a2.y); } };
        for(j=0;j<8;j++){ var lo=j/8*Math.PI; for(i=0;i<32;i++){ var u1=i/32*6.2832, u2=(i+1)/32*6.2832; seg([RS*Math.cos(u1)*Math.cos(lo),RS*Math.sin(u1),RS*Math.cos(u1)*Math.sin(lo)],[RS*Math.cos(u2)*Math.cos(lo),RS*Math.sin(u2),RS*Math.cos(u2)*Math.sin(lo)]); } }
        [-0.75,-0.4,0,0.4,0.75].forEach(function(la){ var r=RS*Math.cos(la), y=RS*Math.sin(la); for(i=0;i<32;i++){ var u1=i/32*6.2832, u2=(i+1)/32*6.2832; seg([r*Math.cos(u1),y,r*Math.sin(u1)],[r*Math.cos(u2),y,r*Math.sin(u2)]); } });
        g.stroke(); g.restore();
      }
      sphere(false);
      /* éclairs à l'arrière */
      function flashesDraw(front){ flashes.forEach(function(f){ var q=P3(f.p); if((q.z>0)!==front) return; var al=f.a*(front?1:0.55); if(f.a>0.5) D.glow(c,q.x,q.y,10*q.s,CAT[f.ct],0.7*(f.a-0.45)); g.fillStyle=CAT[f.ct]; g.globalAlpha=Math.min(1,al+0.15); g.beginPath(); g.arc(q.x,q.y,(f.a>0.9?3.2:1.9)*q.s,0,6.2832); g.fill(); g.globalAlpha=1; }); }
      flashesDraw(false);
      /* tige support de la feuille */
      var t1=P3([0,-1.42,0]), t2=P3([0,-0.32,0]); D.line(c,t1.x,t1.y,t2.x,t2.y,"#7b8798",4);
      /* source dans son bloc de plomb (boîte 3D) */
      var bx0=-2.05, bx1=-1.62, bh=0.2, V=[[bx0,-bh,-bh],[bx1,-bh,-bh],[bx1,bh,-bh],[bx0,bh,-bh],[bx0,-bh,bh],[bx1,-bh,bh],[bx1,bh,bh],[bx0,bh,bh]].map(P3);
      var faces=[[0,1,2,3,[0,0,-1]],[4,5,6,7,[0,0,1]],[0,1,5,4,[0,-1,0]],[3,2,6,7,[0,1,0]],[0,3,7,4,[-1,0,0]],[1,2,6,5,[1,0,0]]];
      faces.map(function(f){ var n=rot3R(f[4],view.a,view.b); return {f:f, z:(V[f[0]].z+V[f[1]].z+V[f[2]].z+V[f[3]].z)/4, nz:n[2], ny:n[1]}; }).sort(function(p,q){ return p.z-q.z; }).forEach(function(o){ if(o.nz<-0.02) return; var l=0.35+0.4*Math.max(0,o.nz)+0.2*Math.max(0,o.ny); g.beginPath(); o.f.slice(0,4).forEach(function(ix,m){ m?g.lineTo(V[ix].x,V[ix].y):g.moveTo(V[ix].x,V[ix].y); }); g.closePath(); g.fillStyle="rgb("+Math.round(70+90*l)+","+Math.round(76+92*l)+","+Math.round(86+96*l)+")"; g.fill(); g.strokeStyle="rgba(0,0,0,.35)"; g.lineWidth=1; g.stroke();
        if(o.f[4][0]===1){ var hc=P3([bx1+0.001,0,0]); g.fillStyle="#120c08"; g.beginPath(); g.arc(hc.x,hc.y,4*hc.s,0,6.2832); g.fill(); D.glow(c,hc.x,hc.y,10*hc.s,"#ff6a3d",0.5); } });
      var lb=P3([(bx0+bx1)/2,bh+0.12,0]); D.label(c,"source α (plomb)",lb.x,lb.y,{size:10,color:"#ffd9c9",fill:"rgba(40,22,16,.75)"});
      /* faisceau */
      var s1=P3([bx1,0,0]), s2=P3([0,0,0]); g.save(); g.strokeStyle="rgba(255,110,70,.35)"; g.lineWidth=5; g.beginPath(); g.moveTo(s1.x,s1.y); g.lineTo(s2.x,s2.y); g.stroke(); g.strokeStyle="rgba(255,170,130,.6)"; g.lineWidth=1.2; g.stroke(); g.restore();
      /* feuille métallique dans son cadre */
      var fw=0.34, Fq=[[0,-fw,-fw],[0,fw,-fw],[0,fw,fw],[0,-fw,fw]].map(P3), Fo=[[0,-fw-0.05,-fw-0.05],[0,fw+0.05,-fw-0.05],[0,fw+0.05,fw+0.05],[0,-fw-0.05,fw+0.05]].map(P3);
      g.save(); g.beginPath(); Fo.forEach(function(q,m){ m?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y); }); g.closePath(); g.fillStyle="#6a5a44"; g.fill();
      g.beginPath(); Fq.forEach(function(q,m){ m?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y); }); g.closePath(); var gf=g.createLinearGradient(Fq[0].x,Fq[0].y,Fq[2].x,Fq[2].y), sh=(tt*0.25)%1.4-0.2; gf.addColorStop(0,shadeR(cib.col,-0.25)); gf.addColorStop(Math.max(0,Math.min(1,sh)),shadeR(cib.col,0.55)); gf.addColorStop(1,shadeR(cib.col,-0.1)); g.globalAlpha=0.88; g.fillStyle=gf; g.fill(); g.restore();
      var fl=P3([0,-fw-0.18,0]); D.label(c,"feuille "+cib.nom+" (< 1 µm)",fl.x,fl.y+8,{size:10.5,color:"#ffe9a8",fill:"rgba(60,45,10,.7)"});
      /* particules en vol */
      flies.forEach(function(f){ var p=pos3(f,f.q), q=P3(p), q0=P3(pos3(f,Math.max(0,f.q-0.07))); g.save(); g.strokeStyle=CAT[f.ct]; g.globalAlpha=0.55; g.lineWidth=2; g.beginPath(); g.moveTo(q0.x,q0.y); if(f.q>0.5&&f.q-0.07<0.5){ var qm=P3(f.pf); g.lineTo(qm.x,qm.y); } g.lineTo(q.x,q.y); g.stroke(); g.restore(); D.glow(c,q.x,q.y,7*q.s,"#ff7a50",0.6); ballR(g,q.x,q.y,2.8*q.s,"#ff6a3d"); });
      sphere(true); flashesDraw(true);
      D.label(c, th?"Modèle de Thomson : charge + répartie":"Modèle de Rutherford : noyau minuscule", 10, 15, {align:"left", size:11.5, color:th?"#ffcf8a":"#ffb4a8", fill:"rgba(0,0,0,.35)"});
      D.label(c, "écran fluorescent (ZnS)", ph1?10:W-10, ph1?37:15, {align:ph1?"left":"right", size:10.5, color:"#9ff0cc", fill:"rgba(0,0,0,.35)"});
      T(c, "↻ glisse pour tourner le montage", W/2, H-12, {size:10.5, color:"rgba(220,230,245,.75)", weight:600});
      /* ----- agrandissement : au cœur de la feuille ----- */
      var Z=z.ctx, ZW=z.W, ZH=z.H;
      z.clear(); var zb=Z.createLinearGradient(0,0,0,ZH); zb.addColorStop(0,th?"#2a1f28":"#1d2433"); zb.addColorStop(1,th?"#1a1218":"#121826"); Z.fillStyle=zb; Z.fillRect(0,0,ZW,ZH);
      var ra=Math.min(ZH*0.24, ZW*0.14), dy=ZH*0.52;
      /* une couche d'atomes de la feuille, vue de profil */
      var fb=Z.createLinearGradient(ZW*0.5-ra*1.2,0,ZW*0.5+ra*1.2,0); fb.addColorStop(0,"rgba(232,185,60,0)"); fb.addColorStop(0.5,th?"rgba(213,109,109,.10)":"rgba(232,185,60,.12)"); fb.addColorStop(1,"rgba(232,185,60,0)"); Z.fillStyle=fb; Z.fillRect(ZW*0.5-ra*1.2,0,ra*2.4,ZH);
      for(j=-1;j<=1;j++) for(i=0;i<=0;i++){ var ax=ZW*0.5, ay=ZH*0.5+j*dy;
        if(th){ ballR(Z,ax,ay,ra*0.95,"#d56d6d",0.42); for(var e=0;e<5;e++){ var ea=e*1.26+i+j, er=ra*0.55*Math.sqrt((e+0.5)/5); T(z,"−",ax+er*Math.cos(ea),ay+er*Math.sin(ea),{size:11,color:"#9fc3ff"}); } }
        else { ballR(Z,ax,ay,ra*0.95,cib.col,0.16); Z.save(); Z.setLineDash([3,4]); Z.strokeStyle="rgba(255,230,160,.25)"; Z.beginPath(); Z.arc(ax,ay,ra*0.95,0,6.2832); Z.stroke(); Z.restore(); D.glow(z,ax,ay,ra*0.32,"#ff5a4a",0.55); ballR(Z,ax,ay,Math.max(2.2,ra*0.07),"#ff4a3a"); } }
      var ZP=function(p){ return [p[0]*ZW, p[1]*ZH]; };
      hist.forEach(function(h,ix){ Z.save(); Z.strokeStyle=CAT[h.ct]; Z.globalAlpha=0.08+0.22*ix/hist.length; Z.lineWidth=1.4; Z.beginPath(); h.zp.forEach(function(p,m){ var q=ZP(p); m?Z.lineTo(q[0],q[1]):Z.moveTo(q[0],q[1]); }); Z.stroke(); Z.restore(); });
      flies.forEach(function(f){ var p=zAt(f.zp,f.q), q=ZP(p); Z.save(); Z.strokeStyle=CAT[f.ct]; Z.lineWidth=2; Z.globalAlpha=0.8; Z.beginPath(); var s0=ZP(f.zp[0]); Z.moveTo(s0[0],s0[1]); for(var m=1;m<p[2];m++){ var w2=ZP(f.zp[m]); Z.lineTo(w2[0],w2[1]); } Z.lineTo(q[0],q[1]); Z.stroke(); Z.restore(); D.glow(z,q[0],q[1],8,"#ff7a50",0.7); ballR(Z,q[0],q[1],3.4,"#ff6a3d"); });
      var ya=(0.5+(aim*2-1)*0.36)*ZH; D.line(z,26,ya,ZW*0.5-ra*1.1,ya,"rgba(255,170,130,.45)",1.2,[3,5]);
      Z.save(); Z.fillStyle="#7b8798"; Z.beginPath(); Z.moveTo(4,ya-8); Z.lineTo(22,ya-5); Z.lineTo(22,ya+5); Z.lineTo(4,ya+8); Z.closePath(); Z.fill(); Z.restore(); T(z,"α",12,ya,{size:10,color:"#fff"});
      D.label(z,"Au cœur de la feuille (énorme agrandissement, pas à l'échelle)",8,13,{align:"left",size:ph1?9.5:10.5,color:"#e8edf5",fill:"rgba(0,0,0,.35)"});
      T(z,th?"atomes de Thomson : charge + étalée, électrons dedans":"noyau + minuscule au centre d'un atome presque vide",ZW/2,ZH-11,{size:ph1?9.5:10.5,color:"rgba(230,236,245,.8)",weight:600});
      if(!ph1) D.label(z,"vert < 5° · orange 5–90° · rouge > 90°",ZW-8,13,{align:"right",size:ph1?9:10,color:"#dfe7f2",fill:"rgba(0,0,0,.35)"});
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
