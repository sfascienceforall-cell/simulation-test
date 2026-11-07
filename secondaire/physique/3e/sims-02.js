/* Chapitre 2 · Circuit électrique et courant */
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

var META={};
META["p3-c02-atelier"]={
  id:"p3-c02-atelier", ch:"c02", tag:"Classique",
  titre:"Atelier de montage : la lampe s'allume-t-elle ?",
  resume:"Place pile, lampe, interrupteur, fil ou isolant sur les 4 côtés d'un circuit et observe.",
  but:"Choisis ce qui se trouve sur chacun des quatre côtés. Observe la lampe, le sens conventionnel du courant (flèches noires) et le sens de déplacement des électrons (points bleus).",
  aRetenir:"Pour qu'une lampe s'allume il faut une boucle fermée, sans coupure, contenant un générateur. Le sens conventionnel va de la borne + vers la borne − à l'extérieur de la pile ; les électrons circulent en sens inverse.",
  piege:"Deux piles montées en opposition s'annulent. Et une pile reliée à une lampe par un seul fil ne suffit pas : il faut une boucle complète.",};
META["p3-c02-materiaux"]={
  id:"p3-c02-materiaux", ch:"c02", tag:"Expérience",
  titre:"Testeur de conducteurs et d'isolants",
  resume:"Mets un objet dans le circuit du testeur : conduit-il, et grâce à quoi ?",
  but:"Choisis un matériau, fais un pronostic, puis regarde si la lampe s'allume.",
  aRetenir:"Un matériau conduit s'il possède des charges mobiles : des électrons libres dans les métaux et le graphite, des ions dans l'eau salée. Un isolant n'en possède (presque) pas.",
  piege:"« L'eau conduit » est incomplet : l'eau très pure conduit à peine, c'est le sel dissous (les ions) qui fait conduire. Et ce ne sont pas des électrons qui traversent l'eau salée.",};
META["p3-c02-microscope"]={
  id:"p3-c02-microscope", ch:"c02", tag:"Originale",
  titre:"Dans le fil : la dérive lente des électrons",
  resume:"Ferme l'interrupteur : tous les électrons partent en même temps, mais avancent très lentement.",
  but:"Observe les électrons d'un fil de cuivre : agitation désordonnée + lente dérive d'ensemble quand le circuit est fermé. Change l'intensité et la section.",
  aRetenir:"Le courant est un mouvement d'ensemble : tous les électrons du fil démarrent presque en même temps (la lampe s'allume tout de suite), mais chacun avance à une vitesse de dérive de l'ordre du dixième de millimètre par seconde.",
  piege:"Les électrons ne « courent » pas de la pile à la lampe en un instant : ceux qui allument la lampe étaient déjà dans le filament. Sur le dessin, la dérive est volontairement très exagérée.",};
META["p3-c02-court-circuit"]={
  id:"p3-c02-court-circuit", ch:"c02", tag:"Danger",
  titre:"Le court-circuit : un fil en dérivation sur la lampe",
  resume:"Branche un fil aux bornes de la lampe : elle s'éteint, mais la pile débite énormément.",
  but:"Ajoute un fil en parallèle de la lampe et change sa résistance. Observe qui reçoit le courant.",
  aRetenir:"Un court-circuit offre au courant un chemin presque sans résistance : la lampe n'est plus parcourue par du courant, mais l'intensité dans la pile devient très grande et la pile (ou le fil) chauffe fortement.",
  piege:"Lampe éteinte ne veut pas dire « pas de courant » : en court-circuit, le courant dans le circuit est maximal. Cause fréquente d'incendies.",};
/* ---------- outils du chapitre : composants tournés, courant le long d'un circuit ---------- */
var OPT=[["fil","Fil"],["p1","Pile 1,5 V (sens ↻)"],["p2","Pile 1,5 V (sens ↺)"],["l","Lampe 3 V – 0,3 A"],["so","Interrupteur ouvert"],["sf","Interrupteur fermé"],["is","Morceau de plastique"]];
var OPTN={fil:"fil",p1:"pile ↻",p2:"pile ↺",l:"lampe",so:"interr. ouvert",sf:"interr. fermé",is:"plastique"};
function elem(c,type,x,y,ang,b,burnt){
  var g=c.ctx;
  at(c,x,y,ang,function(){
    if (type==="fil") return;
    rect(c,-26,-24,52,48,BG);
    if (type==="p1"||type==="p2"){ g.save(); if(type==="p2") g.rotate(Math.PI); pile(c,0,0,0,false); g.restore(); }
    else if (type==="l"){ ln(c,[-26,0],[-16,0]); ln(c,[16,0],[26,0]); }
    else if (type==="so"){ sw(c,0,0,false,52); }
    else if (type==="sf"){ sw(c,0,0,true,52); }
    else if (type==="is"){ ln(c,[-26,0],[-13,0]); ln(c,[13,0],[26,0]); rect(c,-13,-13,26,26,"#e1e6ee","#8a96a8",1.6,4); g.strokeStyle="#aab4c3"; g.lineWidth=1.3; g.beginPath(); for(var i=-1;i<=1;i++){ g.moveTo(-10,i*7+8); g.lineTo(10,i*7-8); } g.stroke(); }
  });
  if (type==="l") lamp(c,x,y,16,b,burnt);
  if (type==="p1"||type==="p2"){ var s=type==="p1"?1:-1, ca=Math.cos(ang), sa=Math.sin(ang), lx=s*14, ly=-16; T(c,"+",x+ca*lx-sa*ly,y+sa*lx+ca*ly,{size:14,color:P.red}); }
}

/* ---------- 1 · Atelier de montage ---------- */
SIM("p3-c02-atelier", function(k,S){
  var c = mkc(k,0.68,0.95);
  var s0=k.select("Côté du haut",OPT,"p1"), s1=k.select("Côté de droite",OPT,"l"), s2=k.select("Côté du bas",OPT,"sf"), s3=k.select("Côté de gauche",OPT,"fil");
  var sel=[s0,s1,s2,s3];
  var ro=k.readouts(["Tension du générateur","Intensité","Éclat de la lampe"]);
  var nt=k.note("","");
  var ph=0, mids=[], lp=k.loop(function(dt){ ph=(ph+dt*0.3)%1; k.redraw(); });
  c.pointer(function(t,p){ if(t!=="down") return; mids.forEach(function(m,i){ if(Math.hypot(p.x-m[0],p.y-m[1])<38){ var ids=OPT.map(function(o){return o[0];}), j=ids.indexOf(sel[i].value); sel[i].set(ids[(j+1)%ids.length]); k.redraw(); } }); });
  function ana(){
    var el=sel.map(function(s){return s.value;}), E=0, nl=0, np=0, open=false;
    el.forEach(function(e){ if(e==="p1"){E+=1.5;np++;} else if(e==="p2"){E-=1.5;np++;} else if(e==="l") nl++; else if(e==="so"||e==="is") open=true; });
    var o={el:el,E:E,nl:nl,np:np,open:open,I:0,b:0,msg:"",kind:"warn"};
    if (np===0){ o.msg="Aucun générateur dans le circuit : rien ne met les charges en mouvement."; return o; }
    if (open){ o.msg="Le circuit est <b>ouvert</b> : une coupure (interrupteur ouvert ou isolant) empêche tout courant."; return o; }
    if (E===0){ o.msg="Les deux piles sont montées en opposition : leurs effets s'annulent, aucun courant."; return o; }
    if (nl===0){ o.I=99; o.sc=true; o.msg="<b>Court-circuit !</b> La pile est reliée par des fils sans aucun récepteur : très grand courant, la pile chauffe. À ne jamais faire."; return o; }
    o.I=Math.abs(E)/(10*nl); o.b=Math.pow(o.I/0.3,2);
    if (o.I>0.4){ o.burnt=true; o.msg="Tension trop élevée pour la lampe : <b>elle grille</b> (I = "+F(o.I,2)+" A pour une lampe prévue pour 0,3 A)."; }
    else if (o.b>0.8){ o.msg="Circuit fermé : la lampe brille normalement. Le courant (sens conventionnel) sort de la borne +."; o.kind="ok"; }
    else { o.msg="Circuit fermé, mais la tension est trop faible pour "+(nl>1?"ces lampes":"la lampe")+" : elle brille <b>peu</b>."; o.kind="ok"; }
    return o;
  }
  lp.play();
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), a=ana();
    var x0=W*0.15,x1=W*0.85,y0=H*0.22,y1=H*0.76,cxm=(x0+x1)/2,cym=(y0+y1)/2;
    var path=rectPath(x0,y0,x1,y1);
    wire(c,path,WC,3.4);
    mids=[[cxm,y0],[x1,cym],[cxm,y1],[x0,cym]];
    var angs=[0,Math.PI/2,Math.PI,-Math.PI/2];
    a.el.forEach(function(e,i){ elem(c,e,mids[i][0],mids[i][1],angs[i],a.b,a.burnt); });
    if (a.I>0){
      var sg=a.E>0?1:-1, L=plen(path);
      for (var j=0;j<6;j++){ var u=((sg*(ph+j/6))%1+1)%1, p=ppos(path,u*L); arrowAt(c,p[0],p[1],p[2]+(sg<0?Math.PI:0),P.ink,8); }
      if (!a.sc) for (j=0;j<18;j++){ var u2=((-sg*(ph*2+j/18))%1+1)%1, q=ppos(path,u2*L); circ(c,q[0],q[1],3.4,"#3d78e0","#fff",1); }
    }
    a.el.forEach(function(e,i){ var m=mids[i], X=i===1?x1-52:i===3?x0+52:m[0], Y=i===0?m[1]-36:i===2?m[1]+38:cym-50; chip(c,OPTN[e],X,Y,P.grey,{size:f-1}); });
    if (a.I>0){ chip(c,"▶ sens conventionnel",cxm,cym-9,P.ink); chip(c,"● électrons (sens inverse)",cxm,cym+14,"#3d78e0"); }
    else chip(c,"clique sur un côté pour changer l'élément",cxm,cym,P.grey,{size:f-1});
    ro.set(0,F(Math.abs(a.E),1)+" V"); ro.set(1,a.sc?"très grande":F(a.I,2)+" A"); ro.set(2,a.burnt?"grillée":a.b>0.02?F(Math.min(a.b,1)*100,0)+" %":"éteinte");
    nt.set(a.msg,a.kind);
  });
});

/* ---------- 2 · Testeur de conducteurs et d'isolants ---------- */
var MAT=[
 ["cuivre","Cuivre (fil)",1,"c","des électrons libres","Cuivre","#d99a5b"],["alu","Aluminium (papier alu)",1,"c","des électrons libres","Alu","#cfd5dc"],["fer","Fer (clou)",0.95,"c","des électrons libres","Fer","#8e98a6"],
 ["graph","Graphite (mine de crayon)",0.8,"c","des électrons libres","Graphite","#4a4f58"],["sel","Eau salée",0.35,"c","des ions (Na⁺ et Cl⁻) qui se déplacent","Eau salée","#9ec9ef"],["robi","Eau du robinet",0.04,"c","quelques ions dissous seulement","Robinet","#c3dff5"],
 ["dist","Eau distillée (très pure)",0,"i","presque aucune charge mobile","Eau pure","#e3f0fa"],["plast","Plastique (règle)",0,"i","aucune charge mobile","Plastique","#e8b6c8"],["verre","Verre",0,"i","aucune charge mobile","Verre","#d5ecee"],
 ["bois","Bois sec",0,"i","aucune charge mobile","Bois","#c9a273"],["rub","Caoutchouc",0,"i","aucune charge mobile","Gomme","#5b5f66"],["air","Air sec",0,"i","aucune charge mobile","Air","#f3f6fa"]];
SIM("p3-c02-materiaux", function(k,S){
  var c = mkc(k,0.62,1.08);
  var sel = k.select("Objet testé", MAT.map(function(m){ return [m[0],m[1]]; }), "cuivre");
  var pr = k.seg("Ton pronostic", [["c","Conducteur"],["i","Isolant"]], "c");
  var ro = k.readouts(["Lampe","Charges mobiles","Pronostics justes"]);
  var nt = k.note("","");
  var tot=0, ok=0, tiles=[], ph=0, seen={};
  var lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  function test(id){ var m=MAT.filter(function(x){return x[0]===id;})[0]; sel.set(id); if(!seen[id]){ seen[id]=1; tot++; if(pr.value===m[3]) ok++; } }
  c.pointer(function(t,p){ if(t!=="down") return; tiles.forEach(function(r){ if(p.x>=r[0]&&p.x<=r[0]+r[2]&&p.y>=r[1]&&p.y<=r[1]+r[3]) test(r[4]); }); k.redraw(); });
  k.button("Recommencer le décompte", function(){ tot=0; ok=0; seen={}; });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), m=MAT.filter(function(x){return x[0]===sel.value;})[0];
    var ha=W<430?150:215, x0=W*0.07,x1=W*0.6,y0=ha*0.2,y1=ha*0.72;
    var path=[[x0,y1],[x0,y0],[x1,y0],[x1,y1]];
    wire(c,[[x0,y1],[x0,y0],[x1,y0],[x1,y1],[(x0+x1)/2+hw,y1]],WC,3.4); wire(c,[[(x0+x1)/2-hw,y1],[x0,y1]],WC,3.4);
    pile(c,x0,(y0+y1)/2,-Math.PI/2,true);
    var tx=(x0+x1)/2, hw=Math.min(54,(x1-x0)*0.3), br=m[2]>0?Math.pow(m[2],1.5):0;
    lamp(c,tx,y0,15,br,false); chip(c,"lampe",tx,y0-26,P.grey,{size:f-1});
    /* pinces crocodile et échantillon */
    [-hw,hw].forEach(function(dx){ rect(c,tx+dx-8,y1-8,16,16,"#cfd6e0","#6c7a90",1.6,3); circ(c,tx+dx,y1,3,"#6c7a90"); });
    rect(c,tx-hw+10,y1-11,2*hw-20,22,m[6],"#6c7a90",2,m[3]==="c"&&m[2]<0.5?11:4);
    if (m[0]==="air") for (var i=0;i<6;i++) circ(c,tx-36+i*14,y1+Math.sin(ph*2+i)*3,1.6,"#bcc7d6");
    chip(c,m[1].split(' (')[0],tx,y1+26,P.ink,{size:f-0.5});
    if (br>0.05) flow(c,[[x0,y1],[x0,y0],[x1,y0],[x1,y1]],-ph*0.2*(0.4+m[2]),Math.round(6+br*8),"#3d78e0",3);
    /* zoom sur le matériau */
    var zr=Math.min(ha*0.36,W*0.15), zx=W*0.82, zy=ha*0.46;
    var g=c.ctx; g.save(); g.beginPath(); g.arc(zx,zy,zr,0,PI2); g.clip(); g.fillStyle=m[3]==="c"?"#f2e6d6":"#ecebe6"; g.fillRect(zx-zr,zy-zr,2*zr,2*zr);
    for (var gx=-2;gx<=2;gx++) for (var gy=-2;gy<=2;gy++){ var X=zx+gx*zr*0.45, Y=zy+gy*zr*0.45; if(Math.hypot(X-zx,Y-zy)<zr+8) T(c,m[3]==="c"&&m[2]>0.5?"+":"•",X,Y,{size:m[3]==="c"&&m[2]>0.5?15:11,color:m[3]==="c"&&m[2]>0.5?"#d2685c":"#9aa3b0",weight:800}); }
    var nbl=m[2]>0.5?16:m[2]>0.02?8:0;
    for (i=0;i<nbl;i++){ var bx=zx+(((i*37)%17)/17-0.5)*zr*1.6, by=zy+(((i*53)%19)/19-0.5)*zr*1.6; var vx=(m[2]>0.5?-1:0)*((ph*40*m[2]+i*20)%(zr*1.8)); var ex=bx+(m[2]>0.5?-1:1)*0; ex=zx-zr*0.9+((((bx-zx+zr*0.9)+(m[2]>0.5?-1:1)*ph*38)%(zr*1.8))+zr*1.8)%(zr*1.8); circ(c,ex+Math.sin(ph*4+i),by+Math.cos(ph*3+i),3.2,m[2]>0.5?"#2f6bdc":(i%2?"#d2685c":"#2f6bdc"),"#fff",1); }
    g.restore(); circ(c,zx,zy,zr,null,"#6c7a90",2.4);
    chip(c,m[3]==="c"?(m[2]>0.5?"zoom : électrons libres":"zoom : ions mobiles"):"zoom : pas de charges mobiles",zx,zy+zr+17,P.grey,{size:f-1});
    /* étagère d'objets cliquables */
    var cols=W<430?3:6, tw=(W-20)/cols-6, th=W<430?36:40, sx=13, sy=ha+34; tiles=[];
    MAT.forEach(function(q,i){ var r=Math.floor(i/cols), cc=i%cols, X=sx+cc*(tw+6), Y=sy+r*(th+7), on=q[0]===sel.value;
      rect(c,X,Y,tw,th,on?"#fff":"#fbfcfe",on?P.acc:"#cfd6e0",on?2.6:1.2,9); rect(c,X+6,Y+th/2-6,12,12,q[6],"#6c7a90",1,q[3]==="c"?6:2); T(c,q[5],X+22,Y+th/2+1,{size:f-1.5,color:P.ink,align:"left"}); tiles.push([X,Y,tw,th,q[0]]); });
    chip(c,"Clique sur un objet pour le placer dans le circuit",W/2,ha+14,P.grey,{size:f-1});
    ro.set(0, m[2]>0.9?"brille fort":m[2]>0.6?"brille":m[2]>0.15?"brille faiblement":m[2]>0.01?"à peine visible":"éteinte");
    ro.set(1, m[4]); ro.set(2, ok+" / "+tot);
    var good = pr.value===m[3];
    nt.set((good?"<b>Bien vu.</b> ":"<b>Pas tout à fait.</b> ")+(m[3]==="c"?"Ce matériau est un <b>conducteur</b> : il contient "+m[4]+".":"Ce matériau est un <b>isolant</b> : il ne contient "+m[4]+".")+(m[0]==="sel"||m[0]==="robi"?" Lampe moins brillante car le courant est plus faible : la solution gêne davantage le passage des charges.":""), good?"ok":"warn");
  });
});

/* ---------- 3 · Dans le fil : la dérive lente ---------- */
SIM("p3-c02-microscope", function(k,S){
  var c = mkc(k,0.62,0.85);
  var I = k.slider("Intensité du courant", 0.1, 5, 0.1, 1, "A");
  var Sx = k.slider("Section du fil de cuivre", 0.5, 4, 0.5, 1, "mm²");
  var sw2 = k.seg("Interrupteur", [["0","Ouvert"],["1","Fermé"]], "0");
  var ro = k.readouts(["Vitesse de dérive","Temps pour 1 m de fil","Signal électrique"]);
  var nt = k.note("","");
  var N=80, el=[], i, trail=[], sig=-1, ph=0;
  for (i=0;i<N;i++) el.push({x:Math.random(),y:Math.random()});
  var geo={};
  c.pointer(function(t,p){ if(t==="down"&&geo.sx&&Math.hypot(p.x-geo.sx,p.y-geo.sy)<44){ sw2.set(sw2.value==="1"?"0":"1"); sig=sw2.value==="1"?0:-1; k.redraw(); } });
  var lp = k.loop(function(dt){
    ph+=dt; var on = sw2.value==="1", dr = on ? (0.05+0.035*Math.sqrt(I.value/Sx.value)) : 0;
    el.forEach(function(e,j){ e.x += dr*dt + (Math.random()-0.5)*0.012; e.y += (Math.random()-0.5)*0.03; if(e.x>1)e.x-=1; if(e.x<0)e.x+=1; if(e.y<0.06)e.y=0.06; if(e.y>0.94)e.y=0.94; if(j===0){ trail.push([e.x,e.y]); if(trail.length>40) trail.shift(); } });
    if (on && sig>=0){ sig+=dt*1.4; if(sig>1.2) sig=1.2; }
    k.redraw();
  });
  lp.play();
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), on=sw2.value==="1";
    var n=8.5e28, e=1.602e-19, v=on?I.value/(n*e*Sx.value*1e-6):0;
    var wy=H*0.1, wh=H*0.52, wx=12, ww=W-24;
    var g=c.ctx, gr=g.createLinearGradient(0,wy,0,wy+wh); gr.addColorStop(0,"#f6dcb8"); gr.addColorStop(0.5,"#f1c898"); gr.addColorStop(1,"#d9a56c");
    rect(c,wx,wy,ww,wh,gr,"#b07a44",2.4,16);
    for (var gx=0;gx<9;gx++) for (var gy=0;gy<3;gy++){ var X=wx+22+gx*(ww-44)/8, Y=wy+wh*(0.22+gy*0.28); circ(c,X,Y,10,"#f3b7ae","#c9776c",1.4); T(c,"+",X,Y+1,{size:13,color:"#8a2a1a",weight:800}); }
    el.forEach(function(q,j){ if(j===0) return; circ(c,wx+q.x*ww,wy+q.y*wh,3.6,"#2f56c4","#fff",1); });
    /* électron suivi : trajectoire */
    if (trail.length>2){ g.save(); g.strokeStyle="rgba(232,120,20,.75)"; g.lineWidth=2; g.beginPath(); trail.forEach(function(p,j){ var X=wx+p[0]*ww, Y=wy+p[1]*wh; if(j&&Math.abs(trail[j][0]-trail[j-1][0])<0.5) g.lineTo(X,Y); else g.moveTo(X,Y); }); g.stroke(); g.restore(); var q0=el[0]; circ(c,wx+q0.x*ww,wy+q0.y*wh,6,"#ff9a1f","#fff",2); chip(c,"un électron suivi",clamp(wx+q0.x*ww,60,W-60),wy+q0.y*wh-18,"#c26a0c",{size:f-1}); }
    chip(c,"fil de cuivre : ions + fixes · électrons libres −",W/2,wy+wh+18,P.grey,{size:f-1});
    /* circuit schématique du dessous : pile, interrupteur, lampe, avec l'onde de signal */
    var by=H*0.86, bx0=W*0.1, bx1=W*0.9;
    wire(c,[[bx0,by],[bx1,by]],WC,3.2);
    pile(c,bx0+34,by,0,true);
    geo.sx=W*0.5; geo.sy=by; sw(c,geo.sx,by,on,50); chip(c,on?"fermé (clique)":"ouvert (clique)",geo.sx,by-24,P.grey,{size:f-1});
    lamp(c,bx1-24,by,15,on&&sig>=1?1:0,false);
    if (on && sig>=0){ var sx=bx0+34+Math.min(1,sig)*(bx1-24-bx0-34); D.glow(c,sx,by,26,"#ffc933",0.6); chip(c,"signal ≈ 2·10⁸ m/s",Math.max(70,Math.min(W-70,sx)),by+26,P.amber,{size:f-1}); }
    if (on && sig>=1) chip(c,"lampe allumée tout de suite",bx1-80,by-30,P.amber,{size:f-1});
    ro.set(0, on? S.sci(v*1e3,2)+" mm/s" : "0 mm/s"); ro.set(1, v>0? (1/v>=3600? F(1/v/3600,1)+" h" : F(1/v/60,0)+" min") : "—"); ro.set(2,on?"≈ 2·10<sup>8</sup> m/s":"aucun");
    nt.set(on?"Courant établi : <b>chaque électron</b> avance lentement ("+S.sci(v*1e3,2)+" mm/s) tout en s'agitant, mais comme tous partent ensemble, l'effet est immédiat. Pour un même courant, une section plus grande donne une dérive plus faible. (Sur le dessin, la dérive est très exagérée.)":"Interrupteur ouvert : les électrons s'agitent dans tous les sens, sans mouvement d'ensemble : aucun courant.","ok");
  });
});

/* ---------- 4 · Court-circuit ---------- */
SIM("p3-c02-court-circuit", function(k,S){
  var c = mkc(k,0.72,0.95);
  var on = k.toggle("Ajouter le fil de court-circuit", false);
  var Rf = k.slider("Résistance du fil", 0.05, 20, 0.05, 0.1, "Ω");
  var ro = k.readouts(["Intensité dans la pile","Intensité dans la lampe","Intensité dans le fil","Chaleur dans la pile"]);
  var nt = k.note("","");
  var E=4.5, r=1.5, Rl=15, ph=0, hit=null;
  c.pointer(function(t,p){ if(t==="down"&&hit&&Math.hypot(p.x-hit[0],p.y-hit[1])<40){ on.set(!on.value); k.redraw(); } });
  var lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), o=on.value;
    var Rp = o ? Rl*Rf.value/(Rl+Rf.value) : Rl, I=E/(r+Rp), U=I*Rp, Il=U/Rl, If=o?U/Rf.value:0, Pj=r*I*I;
    var x0=W*0.12,x1=W*0.88,y0=H*0.2,y1=H*0.64, lx=x0+(x1-x0)*0.62, yb=(y0+y1)/2+8, xa=lx-46, xb=lx+46;
    var hot=Math.min(1,Pj/12);
    wire(c,rectPath(x0,y0,x1,y1),WC,3.4);
    if (hot>0.05) D.glow(c,x0,(y0+y1)/2,70,"#ff5b3a",0.15+0.5*hot);
    pile(c,x0,(y0+y1)/2,-Math.PI/2,true);
    chip(c,"pile 4,5 V",x0+4,y1+26,P.grey,{size:f-1});
    rect(c,lx-26,y0-16,52,32,BG); ln(c,[lx-34,y0],[lx-17,y0]); ln(c,[lx+17,y0],[lx+34,y0]); lamp(c,lx,y0,16,Math.pow(Il/0.3,2)*0.9,false);
    /* fil de court-circuit en dérivation avec interrupteur */
    var shCol=o?(If>2?"#d6361f":"#e07a1f"):"#c9d1dc", shW=o?3.4+Math.min(4,If*0.9):2.4;
    wire(c,[[xa,y0],[xa,yb],[xb,yb],[xb,y0]],shCol,shW);
    hit=[lx,yb]; sw(c,lx,yb,o,40); resis(c,lx,yb+34,46,F(Rf.value,2)+" Ω",o?"#c0321d":"#9aa6b8");
    chip(c,o?"fil de court-circuit":"fil ouvert (clique)",lx,yb-24,o?P.red:P.grey,{size:f-1});
    /* courants : points mobiles dans chaque branche */
    var nI=Math.round(clamp(I*5,2,26)), nl=Math.round(clamp(Il*30,0,10)), nf=Math.round(clamp(If*5,0,14)), spd=0.12+Math.min(0.35,I*0.12);
        flow(c,[[x0,y0],[xa,y0]],-ph*spd,Math.max(2,Math.round(nI/3)),"#3d78e0",3.2);
    flow(c,[[xb,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]],-ph*spd,nI,"#3d78e0",3.2);
    if (nl>0) flow(c,[[xa,y0],[xb,y0]],-ph*spd,Math.max(1,Math.round(nl/3)),"#3d78e0",3);
    if (o&&nf>0) flow(c,[[xb,y0],[xb,yb],[xa,yb],[xa,y0]],ph*spd,nf,"#3d78e0",3.2);
    /* barres des intensités */
    var by=H*0.8, bw=Math.min(W*0.7,380), bx=W/2-bw/2;
    lab(c,"Intensités (échelle 0 → 3 A)",W/2,by-16,P.grey,{weight:700,size:f-0.5});
    [["pile",I,P.acc],["lampe",Il,P.amber],["fil",If,P.red]].forEach(function(q,i){ var y=by+i*20; lab(c,q[0],bx-8,y,P.ink,{align:"right",size:f-1}); bar(c,bx,y-5,bw,10,q[1]/3,q[2]); lab(c,F(q[1],2)+" A",bx+bw+8,y,q[2],{align:"left",size:f-1}); });
    ro.set(0,F(I,2)+" A"); ro.set(1,F(Il*1000,0)+" mA"); ro.set(2,F(If,2)+" A"); ro.set(3,F(Pj,1)+" W");
    if (!o) nt.set("Sans le fil : la lampe est parcourue par "+F(Il*1000,0)+" mA et brille. (Pile 4,5 V avec une petite résistance interne de 1,5 Ω, lampe de 15 Ω : modèle simplifié.)","ok");
    else if (Pj>5) nt.set("<b>Court-circuit :</b> la lampe est éteinte (seulement "+F(Il*1000,0)+" mA) mais la pile débite "+F(I,1)+" A et dégage "+F(Pj,0)+" W de chaleur dans sa propre résistance : elle s'échauffe dangereusement.","warn");
    else nt.set("Le fil a une résistance assez grande ("+F(Rf.value,2)+" Ω) : le courant se partage entre la lampe et le fil. Diminue la résistance du fil pour voir le court-circuit.","warn");
  });
});

})();
