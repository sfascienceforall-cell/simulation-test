/* Chapitre 10 · Poussée d'Archimède, flottaison, fluides en mouvement */
(function(){
/* aides de dessin communes à ce chapitre (nov. 2026) : palette SFA, fond, composants de circuit, tracés animés */
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt, PI2 = 6.2832, G = 9.81;
var BG = "#f6f8fc", WC = "#34445c";
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,PI2); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||WC,w||3,dash); }
/* canvas à hauteur proportionnelle : rd (grand écran), rm (téléphone) */
function mkc(k,rd,rm){ var c=k.canvas(300), b=c.resize; c.resize=function(){ c.ratio=(c.cv.parentNode&&c.cv.parentNode.clientWidth<500)?(rm||rd):rd; b(); }; c.resize(); return c; }
function paper(c,top,bot){ var g=c.ctx; if(top){ var gr=g.createLinearGradient(0,0,0,c.H); gr.addColorStop(0,top); gr.addColorStop(1,bot||top); g.fillStyle=gr; } else g.fillStyle=BG; g.fillRect(0,0,c.W,c.H); }
function fs(c){ return c.W<430?11.5:12.5; }
function lab(c,s,x,y,col,o){ o=o||{}; o.color=col||P.ink; o.size=o.size||fs(c); T(c,s,x,y,o); }
function chip(c,s,x,y,col,o){ o=o||{}; o.color=col||P.ink; o.size=o.size||fs(c); D.label(c,s,x,y,o); }
/* fil (polyligne) et déplacement le long d'un chemin */
function wire(c,pts,col,w){ var g=c.ctx; g.save(); g.strokeStyle=col||WC; g.lineWidth=w||3; g.lineJoin="round"; g.lineCap="round"; g.beginPath(); pts.forEach(function(p,i){ if(i) g.lineTo(p[0],p[1]); else g.moveTo(p[0],p[1]); }); g.stroke(); g.restore(); }
function plen(pts){ var s=0; for(var i=1;i<pts.length;i++) s+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); return s; }
function ppos(pts,s){ for(var i=1;i<pts.length;i++){ var dx=pts[i][0]-pts[i-1][0],dy=pts[i][1]-pts[i-1][1],l=Math.hypot(dx,dy)||1e-6; if(s<=l||i===pts.length-1){ var u=Math.min(1,s/l); return [pts[i-1][0]+dx*u,pts[i-1][1]+dy*u,Math.atan2(dy,dx)]; } s-=l; } return [pts[0][0],pts[0][1],0]; }
function flow(c,pts,ph,n,col,r){ var L=plen(pts); for(var i=0;i<n;i++){ var u=(((i/n+ph)%1)+1)%1, p=ppos(pts,u*L); circ(c,p[0],p[1],r||3,col); } }
/* lampe (symbole normalisé) : b = éclat 0..1,3 */
function lamp(c,x,y,r,b,burn){ b=Math.max(0,Math.min(b||0,1.4)); var g=c.ctx, a=Math.min(1,b);
  if(b>0.03) D.glow(c,x,y,r*(2+b*1.6),"#ffc933",Math.min(0.9,0.2+0.5*b));
  var gr=g.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r); gr.addColorStop(0,"rgb(255,"+Math.round(255-4*a)+","+Math.round(255-95*a)+")"); gr.addColorStop(1,"rgb("+Math.round(236+19*a)+","+Math.round(240-34*a)+","+Math.round(246-150*a)+")");
  circ(c,x,y,r,gr,burn?P.red:"#26364d",2.2);
  g.save(); g.strokeStyle=burn?P.red:"#26364d"; g.lineWidth=1.8; g.lineCap="round"; var d=r*0.68; g.beginPath(); g.moveTo(x-d,y-d); g.lineTo(x+d,y+d); g.moveTo(x+d,y-d); g.lineTo(x-d,y+d); g.stroke(); g.restore(); }
/* pile : le trait long (+) est du côté de l'angle 0 ; ang tourne le symbole */
function pile(c,x,y,ang,show){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang||0); rect(c,-16,-22,32,44,BG);
  g.strokeStyle=WC; g.lineCap="round"; g.lineWidth=2.6; g.beginPath(); g.moveTo(5,-16); g.lineTo(5,16); g.stroke();
  g.lineWidth=6; g.beginPath(); g.moveTo(-5,-9); g.lineTo(-5,9); g.stroke(); g.lineWidth=3; g.beginPath(); g.moveTo(-26,0); g.lineTo(-5,0); g.moveTo(5,0); g.lineTo(26,0); g.stroke(); g.restore();
  var ca=Math.cos(ang||0), sa=Math.sin(ang||0); if(show!==false) T(c,"+",x+ca*14+sa*14,y+sa*14-ca*14,{size:14,color:P.red}); }
function meter(c,x,y,sym,col,r){ circ(c,x,y,r||16,"#fff",col||P.ink,2.6); T(c,sym,x,y+1,{size:(r||16)*0.95,color:col||P.ink}); }
/* interrupteur horizontal centré en (x,y) */
function sw(c,x,y,closed,w){ w=w||44; rect(c,x-w/2,y-12,w,24,BG); ln(c,[x-w/2,y],[x-w*0.3,y]); ln(c,[x+w*0.3,y],[x+w/2,y]);
  if(closed) ln(c,[x-w*0.3,y],[x+w*0.3,y]); else ln(c,[x-w*0.3,y],[x+w*0.22,y-w*0.3]); circ(c,x-w*0.3,y,3.4,"#fff",WC,2); circ(c,x+w*0.3,y,3.4,"#fff",WC,2); }
function resis(c,x,y,w,txt,col){ rect(c,x-w/2,y-9,w,18,"#fff",col||WC,2.4,3); if(txt) T(c,txt,x,y+1,{size:11.5,color:col||WC}); }
/* appareil de mesure rectangulaire (afficheur) */
function lcd(c,s,x,y,w,h,col,cap){ D.display(c,s,x,y,{w:w,h:h,color:col||"#13233a",caption:cap}); }
function bar(c,x,y,w,h,u,col,bg){ rect(c,x,y,w,h,bg||"#e4e9f1",null,0,h/2); if(u>0) rect(c,x,y,Math.max(h,w*Math.min(1,u)),h,col||P.acc,null,0,h/2); }
function at(c,x,y,ang,fn){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); fn(); g.restore(); }
function rectPath(x0,y0,x1,y1){ return [[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]; }
function arrowAt(c,x,y,ang,col,sz){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); g.fillStyle=col||P.ink; g.beginPath(); g.moveTo(sz||9,0); g.lineTo(-(sz||9)*0.6,-(sz||9)*0.62); g.lineTo(-(sz||9)*0.6,(sz||9)*0.62); g.closePath(); g.fill(); g.restore(); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function SIM(id,fn){ var m=META[id]; if(!m) throw new Error("meta "+id); m.build=fn; SFA.sim(m); }
/* flèche de force : de (x,y) vers (x2,y2), avec étiquette */
function fArrow(c,x,y,x2,y2,col,txt,o){ o=o||{}; if(Math.hypot(x2-x,y2-y)<3) return; D.arrow(c,x,y,x2,y2,col,o.w||3.4); if(txt){ var a=Math.atan2(y2-y,x2-x); chip(c,txt,x2+Math.cos(a)*(o.dx==null?16:o.dx),y2+Math.sin(a)*(o.dy==null?12:o.dy),col,{size:o.size}); } }
function grad(c,x,y,w,h,a,b){ var g=c.ctx, gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,a); gr.addColorStop(1,b); g.fillStyle=gr; g.fillRect(x,y,w,h); }
function spring(c,x,y0,y1,n,amp,col,lw){ var g=c.ctx; g.save(); g.strokeStyle=col||"#5d6b82"; g.lineWidth=lw||2.4; g.lineJoin="round"; g.lineCap="round"; g.beginPath(); g.moveTo(x,y0); var s=y1-y0; g.lineTo(x,y0+s*0.08);
  for(var i=0;i<n*2;i++){ var t=0.08+0.84*(i+0.5)/(n*2); g.lineTo(x+(i%2?-amp:amp),y0+s*t); } g.lineTo(x,y0+s*0.92); g.lineTo(x,y1); g.stroke(); g.restore(); }

var META={};
META["p3-c10-plongee"]={
  id:"p3-c10-plongee", ch:"c10", tag:"Classique",
  titre:"Plonger un objet : poids, poussée, dynamomètre",
  resume:"Accroche un objet à un dynamomètre et plonge-le : la lecture diminue de la valeur de la poussée.",
  but:"Choisis la masse, le volume de l'objet et le liquide. Descends l'objet dans le liquide et lis le dynamomètre.",
  aRetenir:"Un corps plongé dans un fluide reçoit une poussée verticale, vers le haut, égale au poids du fluide déplacé : Π = ρ<sub>liquide</sub>·V<sub>immergé</sub>·g. Lecture du dynamomètre = P − Π. L'objet flotte si sa masse volumique est inférieure à celle du liquide.",
  piege:"La poussée ne dépend pas du poids de l'objet, mais du volume immergé et du liquide : un gros objet léger flotte, une petite bille de plomb coule. Flotter ne dépend pas de la masse seule, mais du rapport masse / volume."};
META["p3-c10-bateau"]={
  id:"p3-c10-bateau", ch:"c10", tag:"Défi",
  titre:"100 g de pâte à modeler : boule ou bateau ?",
  resume:"La même pâte, deux formes : la boule coule, la coque flotte. Combien peut-elle porter ?",
  but:"La pâte (masse volumique 1,6 g/cm³) est modelée en une coque carrée de côté L et de hauteur H. Cherche une coque qui flotte, puis ajoute une cargaison jusqu'au naufrage.",
  aRetenir:"Un objet flotte si la poussée qu'il peut recevoir, ρ·g·V<sub>immergé</sub>, équilibre son poids. Une coque creuse déplace beaucoup d'eau pour peu de matière : sa masse volumique moyenne (matière + air) devient inférieure à celle de l'eau. L'eau salée porte davantage que l'eau douce.",
  piege:"Ce n'est pas la matière qui change, mais le volume d'eau déplacé. Une boule de 100 g de pâte ne déplace que 62,5 cm³ d'eau, soit 62,5 g : elle coule. Modèle : coque en forme de pavé à parois fines, sans chavirage."};
META["p3-c10-ludion"]={
  id:"p3-c10-ludion", ch:"c10", tag:"Animation",
  titre:"Le ludion : presser la bouteille, plonger le plongeur",
  resume:"En pressant la bouteille, la bulle d'air du ludion se comprime : la poussée diminue, il descend.",
  but:"Appuie sur la bouteille (pression supplémentaire) et regarde le volume d'air, la poussée, le poids et le mouvement du ludion.",
  aRetenir:"Le ludion est une petite pipette qui contient de l'air et un peu d'eau. En pressant la bouteille, on augmente la pression dans l'eau, qui comprime la bulle d'air : de l'eau entre dans la pipette : le ludion (eau comprise) devient plus lourd alors que son volume extérieur, donc la poussée (constante ici, 13,7 mN), ne change pas : il coule. On relâche : la bulle se détend, il remonte. C'est le principe du sous-marin et de la vessie natatoire des poissons.",
  piege:"La poussée d'Archimède ne vient pas de l'air de la bouteille, mais du volume d'eau déplacé par la pipette (verre + bulle). Une fois descendu un peu, le ludion s'enfonce de plus en plus vite : plus la pression est grande en profondeur, plus la bulle rétrécit. (Modèle simplifié, air = gaz parfait à température constante.)"};
META["p3-c10-aile"]={
  id:"p3-c10-aile", ch:"c10", tag:"Fluides en mouvement",
  titre:"Une aile d'avion : angle d'attaque, vitesse, décrochage",
  resume:"Incline l'aile et change la vitesse de l'air : la portance équilibre le poids, ou l'aile décroche.",
  but:"Règle l'angle d'attaque et la vitesse. Compare la portance au poids de l'avion (1 000 kg). Augmente l'angle jusqu'au décrochage.",
  aRetenir:"Un fluide en mouvement exerce des forces. Autour d'une aile inclinée, l'air est dévié vers le bas et accéléré au-dessus : où l'air va plus vite, la pression est plus basse. La différence de pression crée une force vers le haut, la portance, qui augmente avec la vitesse (≈ v²) et avec l'angle d'attaque, jusqu'au décrochage.",
  piege:"Un angle plus grand n'est pas toujours mieux : au-delà d'environ 14°, l'écoulement se détache de l'aile (turbulences) et la portance chute : c'est le décrochage. L'explication « l'air doit faire le même temps dessus et dessous » est fausse. (Modèle simplifié, allure des valeurs.)"};
var LQ=[["0.92","Huile (0,92 g/cm³)"],["1.00","Eau douce (1,00 g/cm³)"],["1.03","Eau de mer (1,03 g/cm³)"],["1.24","Mer Morte (≈ 1,24 g/cm³)"],["13.6","Mercure (13,6 g/cm³)"]];
function liqCols(r){ return r>5?["#d5dae2","#a3adbb"]:r>1.1?["#a2c0ee","#4d7fc6"]:r<0.95?["#f7e790","#e3c64c"]:["#b6d8f9","#5496dc"]; }
function liqRGBA(r,a){ return r>5?"rgba(150,160,175,"+a+")":r>1.1?"rgba(70,120,200,"+a+")":r<0.95?"rgba(235,200,60,"+a+")":"rgba(90,160,240,"+a+")"; }
function waterBody(c,x,y,w,h,r,ph,amp){ var g=c.ctx, cl=liqCols(r), gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,cl[0]); gr.addColorStop(1,cl[1]);
  g.save(); g.fillStyle=gr; g.beginPath(); g.moveTo(x,y+h); g.lineTo(x,y); for(var i=0;i<=w;i+=4) g.lineTo(x+i,y+Math.sin(i*0.07+ph*2)*(amp||1.4)); g.lineTo(x+w,y+h); g.closePath(); g.fill(); g.restore(); }

/* ---------- 1 · Plongée d'un objet ---------- */
SIM("p3-c10-plongee", function(k,S){
  var c = mkc(k,1.0,1.25);
  var m = k.slider("Masse de l'objet",50,1000,50,200,"g");
  var v = k.slider("Volume de l'objet",20,500,10,150,"cm³");
  var lq = k.select("Liquide",LQ,"1.00");
  var im = k.slider("Immersion de l'objet",0,100,5,0,"%");
  var ro = k.readouts(["Masse volumique de l'objet","Poussée Π","Lecture du dynamomètre","Verdict"]);
  var nt = k.note("","");
  var geo={}, drag=false, ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down") drag=Math.abs(p.x-geo.cx)<geo.hs/2+30&&p.y>geo.top; if((ty==="down"||ty==="drag")&&drag){ im.set(Math.round(clamp((p.y-geo.hs/2-(geo.by-geo.hs))/geo.hs,0,1)*20)*5); k.redraw(); } if(ty==="up") drag=false; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, rl=+lq.value, rho=m.value/v.value, Pw=m.value/1000*G, fr=im.value/100;
    var Pi=rl*v.value*fr*G/1000, Tn=Pw-Pi, floats=rho<rl-1e-9, neutral=Math.abs(rho-rl)<=1e-9;
    var cx=W*0.36, top=22, by=H*0.46, bw=W*0.56, hs=Math.max(40,Math.min(84,18+Math.cbrt(v.value)*8)), ytop=by-hs*(1-fr)-(fr===0?6:0); geo={cx:cx,hs:hs,by:by,top:top};
    /* bécher */
    waterBody(c,cx-bw/2,by,bw,H-by-24,rl,ph,1.2); ln(c,[cx-bw/2,by-30],[cx-bw/2,H-24],P.ink,3); ln(c,[cx+bw/2,by-30],[cx+bw/2,H-24],P.ink,3); ln(c,[cx-bw/2,H-24],[cx+bw/2,H-24],P.ink,3);
    /* dynamomètre */
    rect(c,cx-14,top-8,28,44,"#fff",P.ink,2.4,6); ln(c,[cx-14,top+6],[cx+14,top+6],P.grey,1.5); ln(c,[cx-14,top+16],[cx+14,top+16],P.grey,1.5); ln(c,[cx-14,top+26],[cx+14,top+26],P.grey,1.5); rect(c,cx-14,top+6+clamp(Tn/Pw,0,1)*20-2,28,4,P.red);
    var ys=Math.max(top+54,ytop-8); spring(c,cx,top+36,ys,6,8,"#5d6b82",2.2); ln(c,[cx,ys],[cx,ytop],P.ink,2.2);
    /* objet */
    var oc=rho>rl?"#8d96a5":"#d9b98a"; rect(c,cx-hs/2,ytop,hs,hs,oc,"#26364d",2.4,6); lab(c,F(m.value,0)+" g",cx,ytop+hs/2,"#fff",{size:f,bg:"rgba(30,40,60,.55)"});
    g.save(); g.beginPath(); g.rect(cx-bw/2+2,by,bw-4,H-by-26); g.clip(); g.fillStyle=liqRGBA(rl,0.28); g.fillRect(cx-hs/2,Math.max(by,ytop),hs,hs); g.restore();
    ln(c,[cx-bw/2-6,by],[cx-bw/2+8,by],P.acc,2); chip(c,"surface",cx-bw/2-4,by-12,P.acc,{size:f-3,align:"left"});
    /* forces */
    var s=Math.min(14,70/Math.max(Pw,Pi,0.1)); var ax=cx+hs/2+22, oy=ytop+hs/2;
    fArrow(c,ax,oy,ax,oy+Pw*s,P.red,"P",{dx:12,dy:0});
    if(Pi>0.005) fArrow(c,ax+30,oy,ax+30,oy-Pi*s,P.green,"Π",{dx:12,dy:0});
    /* barre P = Π + lecture */
    var bx=W*0.66, bwid=W-bx-8, by2=H*0.12; D.display(c,F(Math.max(Tn,0),2)+" N",bx+bwid/2,by2,{w:Math.min(110,bwid),h:40,caption:"LECTURE"});
    var tot=Math.max(Pw,0.01), pw=bwid-6; rect(c,bx,by2+38,pw,12,"#e2e7ef",null,0,6); rect(c,bx,by2+38,pw*clamp(Math.max(Tn,0)/tot,0,1),12,P.red,null,0,6); rect(c,bx+pw*clamp(Math.max(Tn,0)/tot,0,1),by2+38,pw*clamp(Pi/tot,0,1),12,P.green,null,0,6);
    chip(c,"P = "+F(Pw,2)+" N",bx,by2+62,P.red,{size:f-2.5,align:"left"}); chip(c,"Π = "+F(Pi,2)+" N",bx,by2+80,P.green,{size:f-2.5,align:"left"});
    chip(c,"tire l'objet dans le liquide ↕",W/2,H-8,P.grey,{size:f-2.5});
    ro.set(0,F(rho,2)+" g/cm³"); ro.set(1,F(Pi,2)+" N"); ro.set(2,Tn>0.005?F(Tn,2)+" N":"0 N"); ro.set(3,neutral?"entre deux eaux":floats?"flotte":"coule");
    nt.set(neutral?"ρ objet = ρ liquide = "+F(rl,2)+" g/cm³ : la poussée équilibre le poids quand l'objet est entièrement immergé. Il reste <b>entre deux eaux</b>.":floats?"ρ objet = "+F(rho,2)+" &lt; ρ liquide = "+F(rl,2)+" : l'objet <b>flotte</b>. Immergé en totalité il recevrait "+F(rl*v.value*G/1000,2)+" N &gt; P = "+F(Pw,2)+" N. Lecture = P − Π = "+F(Math.max(Tn,0),2)+" N.":"ρ objet = "+F(rho,2)+" &gt; ρ liquide = "+F(rl,2)+" : l'objet <b>coule</b>. Même entièrement immergé, Π = "+F(rl*v.value*G/1000,2)+" N &lt; P = "+F(Pw,2)+" N. Lecture = P − Π = "+F(Math.max(Tn,0),2)+" N.","ok");
  });
});

/* ---------- 2 · Bateau en pâte à modeler ---------- */
/* Modèle : 100 g de pâte (1,6 g/cm³ → 62,5 cm³). Coque = pavé à base carrée L×L, bords de hauteur H, parois fines.
   Elle flotte si le tirant d'eau d = M/(ρ·L²) ne dépasse pas H. Décor : cuve à débordement + éprouvette graduée. */
function poly(g,pts){ g.beginPath(); pts.forEach(function(p,i){ if(i) g.lineTo(p[0],p[1]); else g.moveTo(p[0],p[1]); }); g.closePath(); }
function pateGrad(g,x0,y0,x1,y1){ var gr=g.createLinearGradient(x0,y0,x1,y1); gr.addColorStop(0,"#f2b47a"); gr.addColorStop(0.55,"#dc8c48"); gr.addColorStop(1,"#b3672c"); return gr; }
function pateBall(c,x,y,r,sq){ var g=c.ctx; sq=sq||1; g.save(); g.translate(x,y); g.scale(1/sq,sq);
  var gr=g.createRadialGradient(-r*0.35,-r*0.4,r*0.1,0,0,r*1.05); gr.addColorStop(0,"#fbd2a6"); gr.addColorStop(0.35,"#e3954f"); gr.addColorStop(1,"#a65a22");
  g.fillStyle=gr; g.beginPath(); g.arc(0,0,r,0,PI2); g.fill(); g.strokeStyle="#8a4a1a"; g.lineWidth=1.4; g.stroke();
  g.strokeStyle="rgba(120,58,18,.28)"; g.lineWidth=1.1; [[0.2,-0.1,0.45,2.2,3.4],[-0.25,0.3,0.3,4.6,5.9],[0.3,0.35,0.22,0.4,1.9]].forEach(function(q){ for(var j=0;j<3;j++){ g.beginPath(); g.arc(q[0]*r,q[1]*r,q[2]*r*(0.55+0.22*j),q[3],q[4]); g.stroke(); } });
  g.restore(); }
/* coque en coupe (paroi avant enlevée) : xc, yb = milieu et bas de la face avant ; (ox, oy) = profondeur oblique */
function pateHull(c,xc,yb,Lp,Hp,wt,ox,oy,cargo,wet){
  var g=c.ctx, xl=xc-Lp/2, xr=xc+Lp/2, yt=yb-Hp, il=xl+wt, ir=xr-wt, ib=yb-wt, q=Math.min(0.4,wt/Math.max(1,Lp)), bx=ox*(1-q), by=oy*(1-q);
  g.save(); g.lineJoin="round"; g.lineWidth=1.2; g.strokeStyle="#7d4316";
  poly(g,[[il+bx,ib+by],[ir+bx,ib+by],[ir+bx,yt+by],[il+bx,yt+by]]); g.fillStyle=wet?"#9c6236":"#c47a3c"; g.fill();                       /* paroi du fond (intérieur) */
  poly(g,[[il,ib],[ir,ib],[ir+bx,ib+by],[il+bx,ib+by]]); g.fillStyle=wet?"#b77a48":"#eaa86a"; g.fill();                                  /* plancher */
  poly(g,[[il,ib],[il+bx,ib+by],[il+bx,yt+by],[il,yt]]); g.fillStyle=wet?"#ad6f3e":"#dd975a"; g.fill();                                  /* paroi gauche (intérieur) */
  if(cargo>0){ var n=Math.round(cargo/10), per=5, cols=Math.ceil(n/per), dw=Math.min(18,(ir-il-6)/Math.max(cols,1)-3), dh=Math.max(3,Math.min(6.5,(Hp-wt)*0.8/per));
    for(var a=0;a<cols;a++){ var cx0=il+bx*0.5+(ir-il)/2+(a-(cols-1)/2)*(dw+3), cy0=ib+by*0.5;
      for(var b=0;b<Math.min(per,n-a*per);b++){ var yy=cy0-b*dh; g.fillStyle="#b88a2a"; g.beginPath(); g.ellipse(cx0,yy,dw/2,dh*0.45,0,0,PI2); g.fill(); g.fillStyle="#e0b84a"; g.fillRect(cx0-dw/2,yy-dh,dw,dh); g.beginPath(); g.ellipse(cx0,yy-dh,dw/2,dh*0.45,0,0,PI2); g.fillStyle="#f4d77a"; g.fill(); g.strokeStyle="#8a6416"; g.lineWidth=0.8; g.stroke(); } } }
  poly(g,[[xr,yb],[xr+ox,yb+oy],[xr+ox,yt+oy],[xr,yt]]); g.fillStyle=pateGrad(g,xr,0,xr+ox,0); g.fill(); g.fillStyle="rgba(90,40,10,.28)"; g.fill(); g.strokeStyle="#7d4316"; g.lineWidth=1.2; g.stroke();   /* flanc droit extérieur */
  g.fillStyle="#f3b981";
  poly(g,[[xl,yt],[il,yt],[il+ox,yt+oy],[xl+ox,yt+oy]]); g.fill(); g.stroke();                                                         /* rebords */
  poly(g,[[ir,yt],[xr,yt],[xr+ox,yt+oy],[ir+ox,yt+oy]]); g.fill(); g.stroke();
  poly(g,[[il+bx,yt+by],[ir+bx,yt+by],[ir+ox,yt+oy],[il+ox,yt+oy]]); g.fill(); g.stroke();
  poly(g,[[xl,yt],[il,yt],[il,ib],[ir,ib],[ir,yt],[xr,yt],[xr,yb],[xl,yb]]); g.fillStyle=pateGrad(g,0,yt,0,yb); g.fill(); g.strokeStyle="#7d4316"; g.lineWidth=1.6; g.stroke();   /* coupe en U */
  g.strokeStyle="rgba(255,235,210,.35)"; g.lineWidth=1; for(var s=yt+5;s<yb-2;s+=7){ g.beginPath(); g.moveTo(xl+2,s); g.lineTo(il-2,s+2); g.moveTo(ir+2,s); g.lineTo(xr-2,s+2); g.stroke(); }
  g.restore();
  return {xl:xl,xr:xr,yt:yt,il:il,ir:ir,ib:ib,bx:bx,by:by}; }

SIM("p3-c10-bateau", function(k,S){
  var c = mkc(k,0.92,1.25);
  var st = {demo:0, y:-3, vd:0, pour:0, flash:0, wasFl:false, hint:true, bub:[], rip:[], prevY:-3};
  function stop(){ if(st.demo>=0) st.y=Math.max(st.y,0); st.demo=-1; }
  var L = k.slider("Côté de la base L",2,12,0.5,6,"cm",stop);
  var Hh = k.slider("Hauteur des bords H",0,6,0.5,3,"cm",stop);
  var ch = k.slider("Cargaison",0,200,10,0,"g",stop);
  var lq = k.seg("Liquide",[["1.00","Eau douce"],["1.03","Eau de mer"]],"1.00",stop);
  k.button("▶ Rejouer : boule, puis bateau",function(){ st.demo=0; st.vd=0; st.flash=0; st.wasFl=false; st.bub=[]; },true);
  var ro = k.readouts(["Masse totale à porter","Poussée maximale (coque pleine d'air)","Tirant d'eau","Franc-bord (bord – eau)"]);
  var nt = k.note("","");
  var geo = {sc:20, B:7}, ph = 0, drag = null, RB = Math.cbrt(62.5*3/(4*Math.PI));   /* rayon de la boule : 2,46 cm */
  function ease(u){ u=clamp(u,0,1); return u*u*(3-2*u); }
  /* état « au repos » pour les réglages actuels */
  function target(){ var rl=+lq.value, M=100+ch.value, Lv=L.value, Hv=Hh.value;
    if(Hv===0) return {ball:true, y:geo.B, fl:false, vd:62.5, M:M};
    var d=M/(rl*Lv*Lv), fl=d<=Hv+1e-9;
    return {ball:false, L:Lv, H:Hv, y:fl?d:geo.B, fl:fl, vd:fl?M/rl:62.5+ch.value/8.4, d:d, M:M}; }
  /* scénario du Reel : la boule tombe et coule, puis la même pâte est étirée en coque jusqu'à flotter */
  var T1=0.6, T2=2.5, T3=3.7, T4=4.5, T5=5.1, T6=9.3;
  function demoState(t){ var rl=+lq.value, M=100+ch.value, y0=-(2*RB+1.2), B=geo.B, Lv=L.value, Hv=Hh.value;
    if(t<T1) return {ball:true, y:y0, fl:false, vd:0, cap:0, M:M};
    if(t<T2){ var tau=t-T1, t1=0.34, a=2*(-y0)/(t1*t1), y;
      if(tau<t1) y=y0+0.5*a*tau*tau; else { var v1=a*t1, vt=B/1.35, tc=0.18, u=tau-t1; y=vt*u+(v1-vt)*tc*(1-Math.exp(-u/tc)); }
      y=Math.min(B,y); return {ball:true, y:y, fl:false, vd:y>-RB?62.5:0, cap:1, M:M}; }
    if(t<T3) return {ball:true, y:B, fl:false, vd:62.5, cap:2, M:M};
    if(Hv===0) return {end:true, ball:true, y:B, fl:false, vd:62.5, M:M};
    if(t<T4){ var yy=B+(y0-B)*ease((t-T3)/(T4-T3)); return {ball:true, y:yy, fl:false, vd:yy>-RB?62.5:0, cap:3, M:M}; }
    if(t<T5) return {ball:true, y:y0, sq:1+1.3*ease((t-T4)/(T5-T4)), fl:false, vd:0, cap:3, M:M};
    if(t>=T6) return {end:true};
    var s=(t-T5)/(T6-T5-0.6), Lc=3+(Lv-3)*ease(s*1.6), Hc=0.3+(Hv-0.3)*ease(s), dC=M/(rl*Lc*Lc), fl=Hc>=dC-1e-9;
    return {ball:false, L:Lc, H:Hc, y:fl?dC:Hc, fl:fl, pre:!fl, vd:fl?M/rl:Lc*Lc*Hc, d:dC, cap:4, M:M}; }
  function cur(){ if(st.demo>=0){ var d=demoState(st.demo); if(!d.end) return d; } var tg=target(); tg.y=st.y; return tg; }
  var lp = k.loop(function(dt){
    ph+=dt; dt=Math.min(dt,0.05); var s, prev=st.y;
    if(st.demo>=0){ st.demo+=dt; s=demoState(st.demo); if(s.end){ st.demo=-1; } else st.y=s.y; }
    if(st.demo<0){ s=target(); if(s.y>st.y+1e-3) st.y=Math.min(s.y, st.y+dt*(st.y<0?14:4.5)); else st.y+=(s.y-st.y)*Math.min(1,dt*5); }
    s=cur();
    /* entrée dans l'eau : éclaboussure */
    if(prev<0&&st.y>=0&&s.ball){ st.rip.push({x:geo.xc,t:0}); for(var i=0;i<10;i++) st.bub.push({x:geo.xc+(Math.random()-0.5)*geo.sc*3,y:geo.wl+geo.sc*(1+Math.random()*2),r:1.5+Math.random()*3,v:40+Math.random()*40}); }
    /* objet qui descend dans l'eau : bulles */
    if(st.y>prev+1e-4&&st.y>0&&Math.random()<dt*24) st.bub.push({x:geo.xc+(Math.random()-0.5)*geo.sc*(s.ball?3:(s.L||4)),y:geo.wl+st.y*geo.sc-geo.sc*(Math.random()*2),r:1.5+Math.random()*2.8,v:45+Math.random()*35});
    if(Math.random()<dt*1.2) st.bub.push({x:geo.tx0+Math.random()*(geo.tx1-geo.tx0),y:geo.yBot-4,r:1.2+Math.random()*1.5,v:22+Math.random()*12});
    st.bub.forEach(function(b){ b.y-=b.v*dt; b.x+=Math.sin(ph*4+b.r*3)*dt*8; }); st.bub=st.bub.filter(function(b){ return b.y>geo.wl+2; }).slice(-60);
    st.rip.forEach(function(r){ r.t+=dt; }); st.rip=st.rip.filter(function(r){ return r.t<1.4; });
    /* éprouvette : l'eau déplacée déborde par le bec verseur */
    var vt=s.y<-0.05&&s.ball?0:s.vd; if(!s.ball&&st.demo<0&&!s.fl&&st.y<s.y-0.05) vt=st.vd;
    if(vt>st.vd+0.05){ st.vd=Math.min(vt,st.vd+dt*Math.max(60,(vt-st.vd)*3)); st.pour=0.35; } else { if(vt<st.vd-0.05) st.vd=vt; st.pour=Math.max(0,st.pour-dt); }
    /* l'instant exact où la coque flotte */
    var fl=!s.ball&&s.fl&&Math.abs(st.y-s.y)<0.3; if(fl&&!st.wasFl){ st.flash=2.2; st.fH=s.H; st.fd=s.d; st.rip.push({x:geo.xc,t:0}); } st.wasFl=fl;
    st.flash=Math.max(0,st.flash-dt);
    k.redraw();
  });
  lp.play();
  c.pointer(function(ty,p){
    if(ty==="down"){ drag=null;
      if(geo.gH&&Math.hypot(p.x-geo.gH[0],p.y-geo.gH[1])<30) drag="H"; else if(geo.gL&&Math.hypot(p.x-geo.gL[0],p.y-geo.gL[1])<30) drag="L";
      else if(geo.box&&p.x>geo.box[0]-10&&p.x<geo.box[2]+10&&p.y>geo.box[1]-14&&p.y<geo.box[3]+10) drag="H";
      if(drag){ stop(); st.hint=false; geo.yb0=geo.yb; geo.xc0=geo.xc; } }
    else if(ty==="drag"&&drag==="H"){ Hh.set(Math.round(clamp((geo.yb0-p.y)/geo.sc,0,6)*2)/2); k.redraw(); }
    else if(ty==="drag"&&drag==="L"){ L.set(Math.round(clamp(2*Math.abs(p.x-geo.xc0)/geo.sc,2,12)*2)/2); k.redraw(); }
    else if(ty==="up") drag=null;
  });
  k.draw(function(){
    var W=c.W,H=c.H,f=fs(c), g=c.ctx, rl=+lq.value, ph2=W<430, s=cur(), M=s.M||100+ch.value;
    /* ---- géométrie ---- */
    var yT=H*0.885, tx0=W*0.025, tx1=W*(ph2?0.70:0.74), yTop=H*0.24, yBot=yT-3, wl=H*0.42, odx=W*0.03, ody=-H*0.03;
    var sc=Math.min((tx1-tx0)*0.93/(12*1.16),(wl-12)/6.6,(yBot-6-wl)/6.4), B=(yBot-6-wl)/sc, xc=(tx0+tx1)/2-W*0.025;
    geo.sc=sc; geo.B=B; geo.xc=xc; geo.wl=wl; geo.tx0=tx0; geo.tx1=tx1; geo.yBot=yBot;
    /* ---- mur carrelé et paillasse ---- */
    paper(c,"#eef3f8","#dde5ee");
    g.save(); g.strokeStyle="rgba(150,166,188,.22)"; g.lineWidth=1; for(var gx=0;gx<W;gx+=34){ g.beginPath(); g.moveTo(gx,0); g.lineTo(gx,yT); g.stroke(); } for(var gy=0;gy<yT;gy+=34){ g.beginPath(); g.moveTo(0,gy); g.lineTo(W,gy); g.stroke(); } g.restore();
    grad(c,0,yT,W,H-yT,"#4a5568","#2d3646"); rect(c,0,yT,W,4,"#6b778a"); rect(c,0,yT-2,W,3,"rgba(0,0,0,.12)");
    /* ---- cuve : vitre arrière, eau (dessus, flanc, face) ---- */
    var wy=function(x){ return wl+Math.sin(x*0.05+ph*2.2)*1.3; }, cl=liqCols(rl);
    rect(c,tx0+odx,yTop+ody,tx1-tx0,yBot-yTop,"rgba(215,230,246,.55)","rgba(120,145,175,.5)",1.2);
    poly(g,[[tx1,wl],[tx1+odx,wl+ody],[tx1+odx,yBot+ody],[tx1,yBot]]); g.fillStyle=cl[1]; g.globalAlpha=0.55; g.fill(); g.globalAlpha=1;
    poly(g,[[tx0,wl],[tx1,wl],[tx1+odx,wl+ody],[tx0+odx,wl+ody]]); g.fillStyle="rgba(205,228,250,.95)"; g.fill();
    waterBody(c,tx0,wl,tx1-tx0,yBot-wl,rl,ph,1.3);
    g.save(); g.beginPath(); g.rect(tx0,wl,tx1-tx0,yBot-wl); g.clip(); g.globalAlpha=0.14; g.fillStyle="#fff";
    for(var i=0;i<4;i++){ var x0=tx0+((i*0.29+ph*0.03)%1)*(tx1-tx0+80)-40; poly(g,[[x0,wl],[x0+18,wl],[x0-30,yBot],[x0-58,yBot]]); g.fill(); } g.restore();
    rect(c,tx0+2,yBot-6,tx1-tx0-4,6,"rgba(70,90,120,.25)");
    /* ---- objet ---- */
    var hv=null, yb=wl+st.y*sc+(s.fl&&!s.pre?Math.sin(ph*1.7)*1.2:0), M2=M;
    if(s.ball){ var r=RB*sc, cy=yb-r*(s.sq?1/s.sq:1);
      g.save(); g.fillStyle="rgba(20,40,70,.22)"; g.beginPath(); g.ellipse(xc+3,yBot-4,r*0.9,r*0.18,0,0,PI2); if(st.y>B-0.4) g.fill(); g.restore();
      pateBall(c,xc,cy,r,s.sq); geo.box=[xc-r,cy-r,xc+r,cy+r]; geo.yb=yBot-6; geo.gH=[xc,cy-r-14]; geo.gL=null; }
    else { var Lp=s.L*sc, Hp=s.H*sc, e=62.5/(s.L*s.L+4*s.L*s.H), wt=clamp(e*sc,3,Math.min(Hp*0.45,Lp*0.2)), ox=Lp*0.16, oy=-Lp*0.11, wet=!s.fl&&!s.pre;
      hv=pateHull(c,xc,yb,Lp,Hp,wt,ox,oy,st.demo>=0?0:ch.value,wet); hv.wt=wt; hv.ox=ox; hv.oy=oy; hv.wet=wet;
      geo.box=[hv.xl,hv.yt,hv.xr,yb]; geo.yb=yb; geo.gH=[xc+ox*0.5,hv.yt+oy*0.5-12]; geo.gL=[hv.xr+ox*0.5+12,yb-Hp/2+oy*0.5]; }
    /* bulles */
    st.bub.forEach(function(b){ circ(c,b.x,b.y,b.r,"rgba(255,255,255,.55)","rgba(255,255,255,.9)",1); });
    /* ---- eau devant l'objet (translucide), l'air de la coque reste sec ---- */
    g.save(); g.beginPath(); g.moveTo(tx0,yBot); for(var xx=tx0;xx<=tx1;xx+=4) g.lineTo(xx,wy(xx)); g.lineTo(tx1,yBot); g.closePath();
    if(hv&&!hv.wet){ g.moveTo(hv.il,hv.ib); g.lineTo(hv.il,hv.yt); g.lineTo(hv.il+hv.bx,hv.yt+hv.by); g.lineTo(hv.ir+hv.bx,hv.yt+hv.by); g.lineTo(hv.ir,hv.yt); g.lineTo(hv.ir,hv.ib); g.closePath(); }
    g.fillStyle=liqRGBA(rl,0.22); g.fill("evenodd"); g.restore();
    if(hv){ var ybb=hv.yt+(yb-hv.yt); poly(g,[[hv.xr,Math.max(wl,hv.yt)],[hv.xr+hv.ox,Math.max(wl+hv.oy,hv.yt+hv.oy)],[hv.xr+hv.ox,ybb+hv.oy],[hv.xr,ybb]]); g.fillStyle=liqRGBA(rl,0.2); g.fill(); }
    g.save(); g.strokeStyle="rgba(255,255,255,.85)"; g.lineWidth=1.6; g.beginPath(); for(xx=tx0;xx<=tx1;xx+=4){ if(xx===tx0) g.moveTo(xx,wy(xx)); else g.lineTo(xx,wy(xx)); } g.stroke(); g.restore();
    st.rip.forEach(function(rp){ var a=1-rp.t/1.4; g.save(); g.strokeStyle="rgba(255,255,255,"+(0.8*a)+")"; g.lineWidth=2; g.beginPath(); g.ellipse(rp.x,wl+ody*0.4,20+rp.t*90,5+rp.t*12,0,0,PI2); g.stroke(); g.restore(); });
    /* l'eau passe par-dessus les bords (coque pas encore assez haute) */
    if(hv&&s.pre){ [hv.xl+hv.wt/2,hv.xr-hv.wt/2].forEach(function(x,j){ for(var q=0;q<3;q++){ var u=(ph*1.6+q/3)%1; circ(c,x+(j?-1:1)*(4+u*10),wl+2+u*u*18,2.2,"rgba(70,140,230,.8)"); } }); }
    /* volume d'eau déplacée (contour) */
    if(hv&&s.fl&&!s.pre){ var a2=st.flash>0?0.6+0.4*Math.sin(ph*12):0.8; g.save(); g.setLineDash([6,4]); g.strokeStyle="rgba(20,90,200,"+a2+")"; g.lineWidth=2.2; g.strokeRect(hv.xl-2,wl,hv.xr-hv.xl+4,yb-wl+2); g.restore();
      chip(c,"eau déplacée = "+F(s.L*s.L*s.d,0)+" cm³",xc,yb+14,"#1b5fc4",{size:f-2.5}); }
    /* ---- vitre avant et armature de la cuve ---- */
    rect(c,tx0,yTop,tx1-tx0,yBot-yTop,null,"rgba(90,110,140,.65)",2);
    ln(c,[tx0,yTop],[tx0+odx,yTop+ody],"rgba(90,110,140,.65)",1.5); ln(c,[tx1,yTop],[tx1+odx,yTop+ody],"rgba(90,110,140,.65)",1.5); ln(c,[tx0+odx,yTop+ody],[tx1+odx,yTop+ody],"rgba(90,110,140,.5)",1.5);
    rect(c,tx0-3,yTop-3,6,yBot-yTop+6,"#7b8799",null,0,2); rect(c,tx1-3,yTop-3,6,yBot-yTop+6,"#7b8799",null,0,2); rect(c,tx0-4,yBot-2,tx1-tx0+8,6,"#5d6878",null,0,2);
    g.save(); g.fillStyle="rgba(255,255,255,.35)"; poly(g,[[tx0+14,yTop+6],[tx0+24,yTop+6],[tx0+12,yBot-10],[tx0+6,yBot-10]]); g.fill(); g.restore();
    /* ---- bec verseur et éprouvette graduée ---- */
    var cw=clamp(W*0.075,28,42), ccx=Math.min(W-cw/2-30,tx1+odx+(W-tx1-odx)/2+6), cTop=wl+30, cBot=yT-8, vmax=Math.max(150,Math.ceil((M2/rl)*1.3/50)*50), Yv=function(v){ return cBot-4-(cBot-4-cTop-10)*v/vmax; };
    g.save(); g.strokeStyle="#7b8799"; g.lineWidth=6; g.lineCap="round"; g.beginPath(); g.moveTo(tx1+1,wl+5); g.lineTo(ccx-4,wl+12); g.stroke(); g.strokeStyle=cl[0]; g.lineWidth=2.5; g.beginPath(); g.moveTo(tx1+2,wl+5); g.lineTo(ccx-5,wl+12); g.stroke(); g.restore();
    if(st.pour>0){ g.save(); g.strokeStyle=liqRGBA(rl,0.85); g.lineWidth=3; g.beginPath(); g.moveTo(ccx-4,wl+13); g.quadraticCurveTo(ccx-1,wl+20,ccx-1,Yv(st.vd)); g.stroke(); g.restore(); circ(c,ccx-1,Yv(st.vd)-2,3,"rgba(255,255,255,.8)"); }
    g.save(); g.fillStyle="rgba(20,40,70,.18)"; g.beginPath(); g.ellipse(ccx,cBot+4,cw*0.9,4,0,0,PI2); g.fill(); g.restore();
    rect(c,ccx-cw*0.85,cBot-2,cw*1.7,8,"#8c97a8",null,0,3);
    var yl=Yv(st.vd); rect(c,ccx-cw/2+2,yl,cw-4,cBot-4-yl,liqRGBA(rl,0.6),null,0,0); g.save(); g.strokeStyle="rgba(255,255,255,.9)"; g.lineWidth=1.6; g.beginPath(); g.moveTo(ccx-cw/2+2,yl+2); g.quadraticCurveTo(ccx,yl-2,ccx+cw/2-2,yl+2); g.stroke(); g.restore();
    rect(c,ccx-cw/2,cTop,cw,cBot-cTop,"rgba(230,240,250,.25)","rgba(90,110,140,.8)",1.8,4); rect(c,ccx-cw/2+4,cTop+6,4,cBot-cTop-14,"rgba(255,255,255,.55)",null,0,2);
    for(var v=0;v<=vmax+1e-9;v+=10){ var yy=Yv(v), big=v%50===0; ln(c,[ccx+cw/2-(big?11:6),yy],[ccx+cw/2,yy],"#3d4a5e",big?1.5:1); if(big&&v>0) T(c,F(v,0),ccx+cw/2+5,yy,{size:9.5,color:"#3d4a5e",align:"left",weight:700}); }
    T(c,"cm³",ccx+cw/2+5,cTop-2,{size:9.5,color:"#3d4a5e",align:"left"});
    var need=M2/rl, yn=Yv(need); ln(c,[ccx-cw/2-8,yn],[ccx+cw/2+2,yn],P.green,2,[4,3]);
    chip(c,"pour flotter",ccx-cw/2-6,yn-12,P.green,{size:f-3.5,align:"right"});
    chip(c,"eau déplacée",ccx,cTop-36,"#1b5fc4",{size:f-3}); chip(c,F(st.vd,1)+" cm³ = "+F(st.vd*rl,1)+" g",ccx,cTop-17,st.vd>=need-0.5?P.green:"#1b5fc4",{size:f-3});
    /* ---- étiquettes ---- */
    chip(c,"pâte : 100 g (62,5 cm³)"+(ch.value>0&&st.demo<0?" + "+ch.value+" g":""),tx0+6,14,P.ink,{size:f-2,align:"left"});
    if(hv&&!s.pre&&st.demo<0&&!hv.wet){ var dx=hv.xr+hv.ox+10, roomR=tx1-dx>112, fb=s.H-s.d, fx=hv.xl-8, roomL=fx-tx0>118;
      if(yb-wl>8){ ln(c,[dx,wl],[dx,yb],P.red,2); if(roomR) chip(c,"tirant d'eau "+F(s.d,2)+" cm",dx+5,(wl+yb)/2,P.red,{size:f-3,align:"left"}); else chip(c,"tirant d'eau "+F(s.d,2)+" cm",tx1-4,yb+34,P.red,{size:f-3,align:"right"}); }
      if(fb>0.02){ ln(c,[fx,hv.yt],[fx,wl],P.green,2); if(roomL) chip(c,"franc-bord "+F(fb,2)+" cm",fx-4,(hv.yt+wl)/2,P.green,{size:f-3,align:"right"}); else chip(c,"franc-bord "+F(fb,2)+" cm",tx0+4,yb+34,P.green,{size:f-3,align:"left"}); } }
    if(st.demo<0&&!drag){ if(geo.gH){ circ(c,geo.gH[0],geo.gH[1],8,"#fff",P.amber,2.4); T(c,"↕",geo.gH[0],geo.gH[1]+1,{size:11,color:P.amber}); }
      if(geo.gL){ circ(c,geo.gL[0],geo.gL[1],8,"#fff",P.amber,2.4); T(c,"↔",geo.gL[0],geo.gL[1]+1,{size:11,color:P.amber}); }
      if(st.hint&&geo.gH) chip(c,s.ball?"tire la pâte vers le haut":"étire la coque (↕ H, ↔ L)",geo.gH[0],geo.gH[1]-20,P.amber,{size:f-3}); }
    var cap=st.demo>=0?s.cap:-1, msgY=yTop-22;
    if(cap===0) chip(c,"100 g de pâte à modeler en boule…",(tx0+tx1)/2,msgY,P.ink,{size:f});
    else if(cap===1||cap===2) chip(c,cap===1?"on la lâche dans l'eau…":"elle coule : 62,5 cm³ d'eau déplacée = 62,5 g < 100 g",(tx0+tx1)/2,msgY,P.red,{size:f-(ph2?1.5:0)});
    else if(cap===3) chip(c,"la même pâte, étirée en coque…",(tx0+tx1)/2,msgY,P.ink,{size:f});
    else if(cap===4&&s.pre) chip(c,"H = "+F(s.H,1)+" cm : pas encore assez d'eau déplacée",(tx0+tx1)/2,msgY,P.amber,{size:f-(ph2?1.5:0)});
    else if(hv===null&&st.demo<0) chip(c,"boule de pâte : elle coule",(tx0+tx1)/2,msgY,P.red,{size:f});
    else if(hv&&hv.wet&&st.demo<0) chip(c,"coule : l'eau entre dans la coque",(tx0+tx1)/2,msgY,P.red,{size:f});
    if(st.flash>0){ var al=Math.min(1,st.flash*2); D.glow(c,xc,wl,sc*6,"#3fbf7f",0.35*al); g.save(); g.globalAlpha=al;
      chip(c,"ELLE FLOTTE !",(tx0+tx1)/2,msgY,P.green,{size:f+5}); chip(c,"dès H = "+F(st.fd,2)+" cm : elle déplace "+F(M2/rl,0)+" cm³ = "+F(M2,0)+" g",(tx0+tx1)/2,msgY+24,P.green,{size:f-2.5}); g.restore(); }
    else if(st.demo<0&&hv&&s.fl) chip(c,"elle flotte",(tx0+tx1)/2,msgY,P.green,{size:f});
    /* ---- valeurs (réglages actuels) ---- */
    var Lv=L.value, Hv=Hh.value, Mv=100+ch.value, Pmax=rl*Lv*Lv*Hv, d=Mv/(rl*Lv*Lv), floats=Hv>0&&d<=Hv+1e-9, fb2=Hv-d, ee=62.5/(Lv*Lv+4*Lv*Hv)*10;
    ro.set(0,F(Mv,0)+" g ("+F(Mv*G/1000,2)+" N)"); ro.set(1,F(Pmax/1000*G,2)+" N"); ro.set(2,Hv>0?F(d,2)+" cm":"—"); ro.set(3,Hv>0?(fb2>=0?F(fb2,2)+" cm":"< 0 : l'eau entre"):"—");
    var msg;
    if(Hv===0) msg="Sans bords, la pâte ne déplace que son propre volume : 62,5 cm³ d'eau soit "+F(62.5*rl,1)+" g &lt; 100 g. <b>Elle coule.</b> Relève les bords !";
    else if(!floats) msg="<b>Naufrage.</b> Pour flotter, il faudrait déplacer "+F(Mv/rl,0)+" cm³ de liquide, mais la coque ne peut en déplacer que "+F(Lv*Lv*Hv,0)+" cm³ au maximum (L²·H). Il faudrait H ≥ "+F(d,2)+" cm : agrandis la coque ou retire de la cargaison.";
    else msg="<b>Elle flotte.</b> Elle déplace M/ρ = "+F(Mv/rl,0)+" cm³, soit un tirant d'eau de "+F(d,2)+" cm (elle flotte dès H = "+F(d,2)+" cm). Marge : encore "+F(rl*Lv*Lv*Hv-Mv,0)+" g de cargaison possibles. Épaisseur des parois ≈ "+F(ee,1)+" mm (modèle simplifié).";
    nt.set(msg,floats?"ok":"warn");
  });
});
/* ---------- 3 · Ludion ---------- */
SIM("p3-c10-ludion", function(k,S){
  var c = mkc(k,1.0,1.25);
  var dp = k.slider("Pression de la main (en plus)",0,60,2,0,"kPa");
  var ro = k.readouts(["Volume d'air dans la pipette","Poids du ludion","Poussée d'Archimède","Bilan"]);
  var nt = k.note("","");
  var Vg=0.40, mg=0.90, Vc=1.00, Va0=0.62, p0=101.3, y=0, rho=1, ph=0, geo={};
  k.button("Replacer le ludion en haut",function(){ y=0; });
  function calc(){ var pk=p0+dp.value+9.81*y; var Va=Va0*p0/pk; if(Va>Vc) Va=Vc; var Vw=Vc-Va; var Pw=(mg+rho*Vw)*G, Pi=rho*(Vg+Vc)*G; return {Va:Va,Pw:Pw,Pi:Pi,net:Pi-Pw}; }
  var lp=k.loop(function(dt){ ph+=dt; var r=calc(), v=clamp(-r.net*0.1,-0.12,0.12); y+=v*dt; if(y<0) y=0; if(y>0.20) y=0.20; k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down"&&p.x>geo.bx-30&&p.x<geo.bx+geo.bw+30){ dp.set(50); k.redraw(); } if(ty==="up"){ dp.set(0); k.redraw(); } });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, r=calc();
    var bw=W*0.3, bx=W*0.16, top=30, bh=H-70, sc=bh*0.8/0.24; geo={bx:bx,bw:bw};
    var sq=clamp(dp.value/60,0,1)*7;
    /* bouteille (se déforme quand on presse) */
    g.save(); g.beginPath(); g.moveTo(bx+bw*0.3,top-14); g.lineTo(bx+bw*0.3,top+8); g.quadraticCurveTo(bx,top+16,bx+sq,top+60); g.lineTo(bx+sq,top+bh-16); g.quadraticCurveTo(bx+sq,top+bh,bx+bw*0.25,top+bh); g.lineTo(bx+bw*0.75,top+bh); g.quadraticCurveTo(bx+bw-sq,top+bh,bx+bw-sq,top+bh-16); g.lineTo(bx+bw-sq,top+60); g.quadraticCurveTo(bx+bw,top+16,bx+bw*0.7,top+8); g.lineTo(bx+bw*0.7,top-14); g.closePath();
    var gr=g.createLinearGradient(bx,0,bx+bw,0); gr.addColorStop(0,"rgba(120,180,245,.5)"); gr.addColorStop(0.5,"rgba(170,210,250,.35)"); gr.addColorStop(1,"rgba(110,170,240,.55)"); g.fillStyle=gr; g.fill(); g.strokeStyle=P.ink; g.lineWidth=2.6; g.stroke(); g.clip();
    rect(c,bx,top-14,bw,22,"#fff",null,0,0); g.restore(); rect(c,bx+bw*0.28,top-20,bw*0.44,10,"#e24a3a","#7a2016",1.8,3);
    ln(c,[bx+bw*0.3,top+22],[bx+bw*0.7,top+22],P.acc,1.5,[5,4]); chip(c,"air",bx+bw*0.5,top+34,P.grey,{size:f-3});
    /* mains */
    if(dp.value>0){ var al=dp.value/60; D.arrow(c,bx-40,top+bh*0.5,bx-4+sq,top+bh*0.5,P.red,2+al*3); D.arrow(c,bx+bw+40,top+bh*0.5,bx+bw+4-sq,top+bh*0.5,P.red,2+al*3); chip(c,F(dp.value,0)+" kPa",bx+bw/2,top+bh+16,P.red,{size:f-1}); }
    else chip(c,"appuie sur la bouteille",bx+bw/2,top+bh+16,P.grey,{size:f-2});
    /* ludion */
    var lx=bx+bw/2, ly=top+44+y*sc, ph2=44; rect(c,lx-9,ly,18,ph2,"rgba(255,255,255,.8)",P.ink,2,8);
    var ah=ph2*(r.Va/Vc); rect(c,lx-7,ly+3,14,Math.max(2,ah-3),"#f2f8ff",null,0,5); rect(c,lx-7,ly+ah,14,Math.max(0,ph2-ah-3),"rgba(80,150,235,.75)",null,0,4);
    circ(c,lx,ly-6,8,"#e24a3a","#7a2016",1.8); ln(c,[lx-12,ly+ph2+2],[lx-12,ly+ph2-6],P.ink,2);
    for(var i=0;i<4;i++){ var t=((ph*0.25+i/4)%1); circ(c,bx+bw*(0.2+0.6*((i*37)%10)/10),top+bh-t*bh*0.8,2,"rgba(255,255,255,.7)"); }
    lab(c,"air",lx+34,ly+ah*0.45,P.grey,{size:f-2.5,align:"left",bg:false}); lab(c,"eau",lx+34,ly+ah+(ph2-ah)*0.5+2,P.acc,{size:f-2.5,align:"left",bg:false});
    /* diagramme des forces */
    var gx=W*0.66, gy=H*0.5; D.panel(c,W*0.54,8,W*0.44,H-16,{shadow:false,title:"Forces (mN)"});
    var s=Math.min(4.2,(H*0.34)/Math.max(r.Pw,r.Pi)); fArrow(c,gx-6,gy,gx-6,gy+r.Pw*s,P.red,"",{}); fArrow(c,gx+34,gy,gx+34,gy-r.Pi*s,P.green,"",{});
    chip(c,"P "+F(r.Pw,2),gx-6,gy+r.Pw*s+16,P.red,{size:f-2}); chip(c,"Π "+F(r.Pi,2),gx+34,gy-r.Pi*s-14,P.green,{size:f-2});
    chip(c,r.net>0.005?"monte":r.net<-0.005?"descend":"équilibre",W*0.76,H-24,r.net>0.005?P.green:r.net<-0.005?P.red:P.grey,{size:f});
    ro.set(0,F(r.Va,3)+" cm³"); ro.set(1,F(r.Pw,2)+" mN"); ro.set(2,F(r.Pi,2)+" mN"); ro.set(3,r.net>0.005?"monte":r.net<-0.005?"descend":"équilibre");
    nt.set(Math.abs(r.net)<=0.005?"Poussée et poids s'équilibrent ("+F(r.Pi,2)+" mN) : le ludion reste immobile (équilibre instable : la moindre variation de pression le fait monter ou descendre).":r.net>0?"Poussée "+F(r.Pi,2)+" mN &gt; poids "+F(r.Pw,2)+" mN : le ludion <b>monte</b>. Relâche la pression : la bulle se détend et le ludion remonte.":"Poids "+F(r.Pw,2)+" mN &gt; poussée "+F(r.Pi,2)+" mN : le ludion <b>descend</b>. La bulle s'est comprimée ("+F(r.Va,3)+" cm³), de l'eau est entrée dans la pipette : il est plus lourd, alors que la poussée n'a pas changé.","ok");
  });
});

/* ---------- 4 · Aile ---------- */
function CL(a){ return a<=14 ? 0.1*(a+2) : Math.max(0.5,1.6-0.12*(a-14)); }
SIM("p3-c10-aile", function(k,S){
  var c = mkc(k,0.95,1.2);
  var al = k.slider("Angle d'attaque",-4,25,1,6,"°");
  var vv = k.slider("Vitesse de l'air",20,90,2,50,"m/s");
  var ro = k.readouts(["Coefficient de portance","Portance","Poids de l'avion","Vitesse de décrochage"]);
  var nt = k.note("","");
  var ph=0, dots=[]; for(var i=0;i<46;i++) dots.push([(i*0.137)%1,(i*0.391)%1]);
  var drag=false, lp=k.loop(function(dt){ ph+=dt*vv.value/90*0.6; k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down") drag=true; if((ty==="down"||ty==="drag")&&drag){ al.set(Math.round(clamp(-4+(c.H*0.6-p.y)/(c.H*0.5)*29+10,-4,25))); k.redraw(); } if(ty==="up") drag=false; });
  k.draw(function(){
    paper(c,"#f5f9ff","#e8f0fb"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, a=al.value, v=vv.value, cl=CL(a), Wt=1000*G, Lift=0.5*1.225*v*v*16*cl, stall=a>14;
    var cx=W*0.5, cy=H*0.42, ch=Math.min(W*0.5,170), ar=-a*Math.PI/180;
    function stream(j,x){ var u=(x-cx)/(ch*0.55), up=j<0, bump=Math.exp(-u*u)*(up?(30-Math.abs(j)*3)*(0.6+0.05*(a+4)):9); var yy=cy+j*16+(up?-bump:bump*0.6); if(stall&&up&&u>0.2) yy+=Math.sin(x*0.15+ph*8+j)*5*Math.min(1,u); return yy; }
    g.save(); g.strokeStyle=stall?"#c4cee2":"#9db8e0"; g.lineWidth=1.4;
    for(var j=-5;j<=5;j++){ if(j===0) continue; g.beginPath(); for(var x=8;x<=W-8;x+=6){ var yy=stream(j,x); x===8?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke(); } g.restore();
    /* zones de pression */
    D.glow(c,cx,cy-30,ch*0.5,"#2f7fd1",0.28); D.glow(c,cx,cy+26,ch*0.4,"#e0523c",0.2);
    /* profil d'aile cambré */
    g.save(); g.translate(cx,cy); g.rotate(ar); g.fillStyle="#cdd6e5"; g.strokeStyle="#26364d"; g.lineWidth=2.6; g.beginPath(); g.moveTo(-ch/2,0); g.bezierCurveTo(-ch/2,-18,-ch*0.15,-20,ch*0.1,-14); g.bezierCurveTo(ch*0.3,-9,ch*0.42,-3,ch/2,0); g.bezierCurveTo(ch*0.3,4,0,6,-ch*0.2,6); g.bezierCurveTo(-ch*0.42,5,-ch/2,3,-ch/2,0); g.closePath(); g.fill(); g.stroke(); g.restore();
    for(var q=0;q<dots.length;q++){ var px=((dots[q][0]+ph*(q%3===0?1.25:1))%1)*(W-20)+10, row=Math.floor(dots[q][1]*10)-5; if(row===0) row=5; var pyy=stream(row,px); circ(c,px,pyy,2.2,row<0&&Math.abs(px-cx)<ch*0.55&&!stall?P.red:"#4a74d9"); }
    var ll=Math.min(H*0.3,Lift/Wt*50); if(Lift>50) fArrow(c,cx,cy,cx,cy-ll,P.green,"",{}); chip(c,"portance "+F(Lift/1000,1)+" kN",cx+12,cy-ll-14,P.green,{size:f-1,align:"left"});
    fArrow(c,cx+ch*0.3,cy,cx+ch*0.3,cy+50,P.red,"",{}); chip(c,"poids "+F(Wt/1000,1)+" kN",cx+ch*0.3+8,cy+66,P.red,{size:f-2,align:"center"});
    chip(c,"pression basse",cx,cy-ch*0.32-18,"#2f7fd1",{size:f-2.5}); chip(c,"pression plus haute",cx,cy+46,"#c0321d",{size:f-2.5});
    chip(c,"vent relatif → "+F(v,0)+" m/s",12,16,P.acc,{size:f-1.5,align:"left"});
    /* courbe CL(α) */
    var gw=Math.min(W*0.5,170), gh=H*0.22, gx=8, gy=H-gh-18; D.panel(c,gx,gy,gw,gh+14,{shadow:false});
    function X(aa){ return gx+10+(gw-20)*(aa+4)/29; } function Y(cc){ return gy+gh-(gh-10)*cc/1.8; }
    g.save(); g.strokeStyle=P.acc; g.lineWidth=2.4; g.beginPath(); for(var aa=-4;aa<=25;aa+=0.5){ aa===-4?g.moveTo(X(aa),Y(CL(aa))):g.lineTo(X(aa),Y(CL(aa))); } g.stroke(); g.restore();
    circ(c,X(a),Y(cl),5.5,stall?P.red:"#fff",stall?"#fff":P.acc,2.6); lab(c,"CL = "+F(cl,2),gx+gw/2,gy+8,P.ink,{size:f-2.5,bg:false}); lab(c,"α",gx+gw-6,gy+gh+4,P.grey,{size:f-2.5,bg:false});
    chip(c,"tire verticalement : α = "+F(a,0)+"°",W-8,H-10,P.grey,{size:f-2.5,align:"right"});
    var vs=Math.sqrt(2*Wt/(1.225*16*1.6));
    ro.set(0,F(cl,2)+(stall?" (décroché)":"")); ro.set(1,F(Lift/1000,1)+" kN"); ro.set(2,F(Wt/1000,1)+" kN"); ro.set(3,F(vs*3.6,0)+" km/h");
    var msg=stall?"<b>Décrochage :</b> au-delà de 14° l'écoulement se détache au-dessus de l'aile, la portance s'effondre (CL = "+F(cl,2)+").":Lift>Wt*1.02?"Portance ("+F(Lift/1000,1)+" kN) &gt; poids ("+F(Wt/1000,1)+" kN) : l'avion monte.":Lift<Wt*0.98?"Portance ("+F(Lift/1000,1)+" kN) &lt; poids ("+F(Wt/1000,1)+" kN) : l'avion descend. Augmente la vitesse ou l'angle (sans dépasser 14°).":"Portance ≈ poids : vol en palier.";
    nt.set(msg+" (Modèle simplifié, allure des valeurs.)",stall||Lift<Wt*0.98?"warn":"ok");
  });
});

})();
