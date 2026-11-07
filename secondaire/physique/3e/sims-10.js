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
SIM("p3-c10-bateau", function(k,S){
  var c = mkc(k,0.9,1.0);
  var L = k.slider("Côté de la base L",2,12,0.5,6,"cm");
  var Hh = k.slider("Hauteur des bords H",0,6,0.5,3,"cm");
  var ch = k.slider("Cargaison",0,200,10,0,"g");
  var lq = k.seg("Liquide",[["1.00","Eau douce"],["1.03","Eau de mer"]],"1.00");
  var ro = k.readouts(["Masse totale à porter","Poussée maximale (coque pleine d'air)","Tirant d'eau","Franc-bord (bord – eau)"]);
  var nt = k.note("","");
  var ph=0, sink=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down"||ty==="drag"){ if(p.y>c.H*0.3) Hh.set(Math.round(clamp(Hh.value+(c.H*0.62-p.y)*0.0,0,6)*2)/2); } });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, rl=+lq.value, M=100+ch.value;
    var Pmax=rl*L.value*L.value*Hh.value, d=M/(rl*L.value*L.value), floats=Hh.value>0&&d<=Hh.value+1e-9, fb=Hh.value-d, e=62.5/(L.value*L.value+4*L.value*Hh.value)*10;
    var sc=Math.min(24,(W*0.74)/12.5), wl=H*0.52, tw=W-16, cx=W/2, bot=H-26;
    waterBody(c,8,wl,tw,bot-wl,rl,ph,1.8); ln(c,[8,bot],[W-8,bot],P.ink,3); ln(c,[8,wl-4],[8,bot],P.ink,3); ln(c,[W-8,wl-4],[W-8,bot],P.ink,3);
    var hw=L.value*sc, hh=Hh.value*sc, dd=floats?d*sc:Hh.value*sc, bob=floats?Math.sin(ph*1.6)*1.5:0;
    var yb=floats?wl+dd+bob:bot-2;
    if(Hh.value===0){ var r=Math.cbrt(62.5*3/(4*Math.PI))*sc; circ(c,cx,bot-r-2,r,"#c9854a","#8c5a22",2.4); chip(c,"boule de pâte : elle coule",cx,wl-30,P.red,{size:f}); }
    else {
      var wt=Math.max(2,e*sc/10*1.5);
      if(!floats){ g.save(); g.beginPath(); g.rect(8,wl,tw,bot-wl); g.clip(); g.fillStyle=liqRGBA(rl,.5); g.fillRect(cx-hw/2,yb-hh,hw,hh); g.restore(); }
      g.save(); g.fillStyle="#c9854a"; g.strokeStyle="#8c5a22"; g.lineWidth=2; g.beginPath(); g.rect(cx-hw/2,yb-wt,hw,wt); g.rect(cx-hw/2,yb-hh,wt,hh); g.rect(cx+hw/2-wt,yb-hh,wt,hh); g.fill(); g.stroke(); g.restore();
      if(ch.value>0){ var cw=Math.min(hw*0.6,26+ch.value*0.12), chh=Math.min(hh*0.85,8+ch.value/18); rect(c,cx-cw/2,yb-wt-chh,cw,chh,"#6d7a8c","#26364d",1.8,3); lab(c,ch.value+" g",cx,yb-wt-chh/2,"#fff",{size:f-2.5,bg:false}); }
      if(floats){ ln(c,[cx+hw/2+8,wl],[cx+hw/2+8,wl+dd],P.red,2); chip(c,"tirant d'eau "+F(d,2)+" cm",cx+hw/2+12,wl+dd/2+14,P.red,{size:f-2,align:"left"}); if(fb>0) chip(c,"franc-bord "+F(fb,2)+" cm",cx-hw/2-8,yb-hh-14,P.green,{size:f-2,align:"right"}); }
      else chip(c,"coule : l'eau entre dans la coque",cx,wl-30,P.red,{size:f});
    }
    ln(c,[8,wl],[W-8,wl],"rgba(31,75,158,.5)",1.6,[6,4]);
    chip(c,"M = "+F(M,0)+" g · Π max = "+F(Pmax*G/1000,2)+" N",W/2,16,P.ink,{size:f-1.5});
    ro.set(0,F(M,0)+" g ("+F(M*G/1000,2)+" N)"); ro.set(1,F(Pmax/1000*G,2)+" N"); ro.set(2,Hh.value>0?F(d,2)+" cm":"—"); ro.set(3,Hh.value>0?(fb>=0?F(fb,2)+" cm":"< 0 : l'eau entre"):"—");
    var msg;
    if(Hh.value===0) msg="Sans bords, la pâte ne déplace que son propre volume : 62,5 cm³ d'eau soit 62,5 g &lt; 100 g. <b>Elle coule.</b> Relève les bords !";
    else if(!floats) msg="<b>Naufrage.</b> Pour flotter, il faudrait déplacer "+F(M/rl,0)+" cm³ de liquide, mais la coque ne peut en déplacer que "+F(L.value*L.value*Hh.value,0)+" cm³ au maximum (L²·H). Agrandis la coque ou retire de la cargaison.";
    else msg="<b>Elle flotte.</b> Elle déplace M/ρ = "+F(M/rl,0)+" cm³, soit un tirant d'eau de "+F(d,2)+" cm. Marge : encore "+F(rl*L.value*L.value*Hh.value-M,0)+" g de cargaison possibles. Épaisseur des parois ≈ "+F(e,1)+" mm (modèle simplifié).";
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
