/* Chapitre 10 · Acides, bases et neutralisation */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function hex(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function ramp(stops,x){ /* stops : [[x,"#rrggbb"],...] triés */
  if(x<=stops[0][0]) return stops[0][1]; if(x>=stops[stops.length-1][0]) return stops[stops.length-1][1];
  for(var i=1;i<stops.length;i++){ if(x<=stops[i][0]){ var a=hex(stops[i-1][1]), b=hex(stops[i][1]), t=(x-stops[i-1][0])/(stops[i][0]-stops[i-1][0]); return "rgb("+Math.round(a[0]+(b[0]-a[0])*t)+","+Math.round(a[1]+(b[1]-a[1])*t)+","+Math.round(a[2]+(b[2]-a[2])*t)+")"; } } }
var IND = {
  papier:{n:"Papier pH universel", stops:[[0,"#e3262e"],[2,"#ec4a2b"],[3,"#f2762c"],[4,"#f4a42b"],[5,"#f4d12e"],[6,"#c9d835"],[7,"#58b35a"],[8,"#35a58a"],[9,"#2e86b8"],[10,"#3a63b5"],[11,"#4d47a8"],[12,"#69409b"],[14,"#7e2f8e"]]},
  bbt:{n:"Bleu de bromothymol", stops:[[0,"#f2d544"],[6,"#f2d544"],[6.8,"#7fc15a"],[7.6,"#3b6fd0"],[14,"#3b6fd0"]], zone:"jaune < 6,0 ; vert vers 7 ; bleu > 7,6"},
  phph:{n:"Phénolphtaléine", stops:[[0,"#f4f6fa"],[8.2,"#f4f6fa"],[10,"#e0368c"],[14,"#e0368c"]], zone:"incolore < 8,2 ; rose violacé > 10"},
  helia:{n:"Hélianthine (méthylorange)", stops:[[0,"#e5412d"],[3.1,"#e5412d"],[4.4,"#f4c430"],[14,"#f4c430"]], zone:"rouge < 3,1 ; jaune > 4,4"}
};
var SUBS = [
 ["Détartrant WC (HCl)",1.0],["Jus de citron",2.2],["Cola",2.5],["Vinaigre",2.9],["Jus d'orange",3.5],["Café",5.0],["Pluie (non polluée)",5.6],["Lait",6.5],["Eau pure",7.0],["Sang humain",7.4],["Eau de mer",8.1],["Bicarbonate (solution)",8.3],["Savon",10.0],["Ammoniaque ménagère",11.5],["Eau de Javel",12.5],["Déboucheur (soude)",13.5]
];

/* ---------- 1 · Échelle de pH ---------- */
SFA.sim({
  id:"c3-c10-echelle", ch:"c10", tag:"Classique",
  titre:"Échelle de pH : substances, indicateurs et ions",
  resume:"Choisis une substance (ou règle le pH) et un indicateur coloré : la couleur, la nature (acide, neutre, basique) et le bilan H⁺ / OH⁻ s'affichent.",
  but:"Sélectionne une substance du quotidien ou fais glisser le pH de 0 à 14. Change d'indicateur pour voir lequel est utile dans quelle zone.",
  aRetenir:"pH < 7 : solution acide (excès d'ions H⁺). pH = 7 : neutre (autant de H⁺ que de OH⁻, ex. eau pure). pH > 7 : solution basique (excès d'ions OH⁻). Un indicateur coloré change de couleur dans une zone de pH précise : le papier pH universel couvre toute l'échelle, les autres seulement autour de leur virage.",
  piege:"Une unité de pH n'est pas un petit pas : passer de pH 4 à pH 3 multiplie par 10 la quantité d'ions H⁺ (aperçu). Acide ne veut pas dire dangereux (le vinaigre, le citron) ni basique inoffensif (la soude). Le schéma des ions est qualitatif ; les pH sont des valeurs approchées.",
  build:function(k,S){
    var c = k.canvas(350);
    var sc=null, lpE=k.loop(function(){ k.redraw(); });
    c.pointer(function(type,pt){ if(type==="up"||!sc) return; if(pt.y<sc.y-14||pt.y>sc.y+sc.h+22) return; ph.set(Math.round(Math.max(0,Math.min(14,(pt.x-sc.x)/sc.w*14))*10)/10); su.el.value=""; k.redraw(); });
    var su = k.select("Substance", [["","— pH libre —"]].concat(SUBS.map(function(s,i){return [i,s[0]+" (pH ≈ "+F(s[1],1)+")"];})), 3, function(v){ if(v!=="") ph.set(SUBS[+v][1]); });
    var ph = k.slider("pH", 0, 14, 0.1, 2.9, "");
    var ind = k.select("Indicateur", Object.keys(IND).map(function(i){return [i,IND[i].n];}), "papier");
    var ro = k.readouts(["pH","Nature","Couleur de l'indicateur","[H⁺] (aperçu)"]);
    var nt = k.note("","");
    ph.el.addEventListener("input", function(){ su.el.value=""; });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, v=ph.value, I=IND[ind.value], t0=Date.now()/1000; CH.bg(c);
      var sx=16, sw=W-32, sy=34, sh=24; sc={x:sx,w:sw,y:sy,h:sh};
      g.save(); CH.rr(c,sx-2,sy-2,sw+4,sh+4,"#fff","#d7dee8",1,8); g.restore();
      for(var i=0;i<sw;i++){ g.fillStyle=ramp(IND.papier.stops,(i/sw)*14); g.fillRect(sx+i,sy,2,sh); }
      for(var t=0;t<=14;t+=2){ D.line(c,sx+t/14*sw,sy+sh+3,sx+t/14*sw,sy+sh+8,P.grey,1); T(c,String(t),sx+t/14*sw,sy+sh+19,{size:12,color:P.grey}); }
      D.label(c,"acide",sx+sw*0.17,14,{size:11,color:P.red}); D.label(c,"neutre",sx+sw*0.5,14,{size:11,color:P.green}); D.label(c,"basique",sx+sw*0.83,14,{size:11,color:P.acc});
      var mx=sx+v/14*sw; g.save(); g.fillStyle=P.ink; g.strokeStyle="#fff"; g.lineWidth=2; g.beginPath(); g.moveTo(mx,sy+sh+2); g.lineTo(mx-8,sy+sh+14); g.lineTo(mx+8,sy+sh+14); g.closePath(); g.stroke(); g.fill(); g.restore();
      /* bécher */
      var bx=W*0.07, bw=Math.min(W*0.4,170), by=H*0.34, bh=H*0.46, col=ramp(I.stops,v);
      CH.glass(c,bx,by,bw,bh,0.8,col,{round:10});
      var nh=v<7?Math.round(3+(7-v)*4.5):2, no=v>7?Math.round(3+(v-7)*4.5):2;
      for(var q=0;q<nh;q++){ var px=bx+10+((q*47)%(bw-20))+Math.sin(t0*1.5+q)*3, py=by+bh*0.26+((q*31)%(bh*0.62))+Math.cos(t0*1.2+q*1.7)*3; CH.ball(c,px,py,4.2,P.red,"",{lw:.5}); }
      for(q=0;q<no;q++){ var px2=bx+14+((q*53)%(bw-28))+Math.sin(t0*1.4+q*2)*3, py2=by+bh*0.3+((q*29)%(bh*0.58))+Math.cos(t0*1.1+q)*3; CH.ball(c,px2,py2,4.2,P.acc,"",{lw:.5}); }
      D.label(c,I.n,bx+bw/2,by-12,{size:11.5,color:P.mat});
      D.legend(c,[[P.red,"H⁺ (acide)"],[P.acc,"OH⁻ (base)"]],bx+bw/2-46,by+bh+8,{box:false});
      /* pH-mètre */
      var bx2=W*0.58, bw2=W*0.36, dx=bx2+bw2/2;
      D.display(c,F(v,1),dx,by+30,{w:Math.min(bw2,120),h:56,caption:"pH",size:26});
      D.label(c,v<6.95?"ACIDE":(v>7.05?"BASIQUE":"NEUTRE"),dx,by+78,{size:12.5,color:v<6.95?P.red:(v>7.05?P.acc:P.green)});
      D.text(c,"H⁺ : "+nh+"  OH⁻ : "+no,dx,by+104,{size:11,color:P.grey});
      D.text(c,"(schéma qualitatif)",dx,by+120,{size:10,color:P.grey,weight:600});
      D.text(c,"glisse sur l'échelle !",dx,by+bh-4,{size:10.5,color:P.mat});
      var cls = Math.abs(v-7)<0.05?"neutre":(v<7?"acide":"basique"), H0=Math.pow(10,-v);
      ro.set(0,F(v,1)); ro.set(1,cls); ro.set(2,Math.abs(v-7)<0.05&&ind.value==="bbt"?"vert":"voir le bécher"); ro.set(3,"10^−"+F(v,1)+" mol/L");
      var zone=I.zone?(" Zone de virage : "+I.zone+"."):" Chaque couleur correspond à un pH : jaune à 5-6, vert à 7, bleu à 9.";
      lpE.play(); nt.set("<b>pH "+F(v,1)+" : "+cls+".</b> "+(v<7?"Excès d'ions H⁺ par rapport à OH⁻.":(v>7?"Excès d'ions OH⁻ par rapport à H⁺.":"Autant de H⁺ que de OH⁻."))+zone+((ind.value!=="papier"&&I.zone&&((ind.value==="bbt"&&(v<6||v>7.6))||(ind.value==="phph"&&(v<8.2||v>10))||(ind.value==="helia"&&(v<3.1||v>4.4))))?" Ici l'indicateur est hors de sa zone de virage : sa couleur ne varie plus, il ne donne qu'une indication (acide ou basique, pas le pH exact).":""),"");
    });
  }
});

/* ---------- 2 · Neutralisation : titrage ---------- */
function phStrong(na,nb,V){ var C=(na-nb)/V, Kw=1e-14; var h=(C+Math.sqrt(C*C+4*Kw))/2; return -Math.log10(h); }
function phWeak(Ct,Na,Ka){ /* concentrations en mol/L, bissection sur log h */ var Kw=1e-14, lo=-14, hi=0; for(var i=0;i<80;i++){ var mid=(lo+hi)/2, h=Math.pow(10,mid), f=Na+h-Ct*Ka/(Ka+h)-Kw/h; if(f>0) hi=mid; else lo=mid; } return -(lo+hi)/2; }
SFA.sim({
  id:"c3-c10-titrage", ch:"c10", tag:"Expérience",
  titre:"Neutralisation : ajouter une base goutte à goutte dans un acide",
  resume:"Verse de la soude dans 20 mL d'acide et suis le pH, la couleur de l'indicateur et le sort des ions.",
  but:"Choisis un acide (chlorhydrique ou éthanoïque), la concentration de la soude, puis augmente le volume versé. Repère le virage de l'indicateur et le pH à l'équivalence.",
  aRetenir:"Acide + base → sel + eau. En solution, H⁺ + OH⁻ → H₂O : les ions H⁺ de l'acide sont neutralisés par les ions OH⁻ de la base ; les autres ions (Na⁺, Cl⁻) sont spectateurs et forment le sel. À l'équivalence, tout l'acide a été neutralisé. Le pH varie très peu au début, puis brusquement autour de l'équivalence.",
  piege:"La neutralisation ne donne pas toujours pH = 7 ! Avec un acide fort et une base forte, oui (HCl + NaOH). Avec un acide faible comme le vinaigre (acide éthanoïque), le pH à l'équivalence est supérieur à 7 (≈ 8,7 ici). Modèle : 20 mL d'acide à 0,10 mol/L ; NaOH versée goutte à goutte ; calcul des pH par l'équilibre des charges.",
  build:function(k,S){
    var c = k.canvas(460);
    var ac = k.seg("Acide (20 mL, 0,10 mol/L)", [["fort","HCl (acide fort)"],["faible","CH₃COOH (acide faible)"]], "fort");
    var cb = k.seg("Concentration de la soude", [[0.05,"0,05 mol/L"],[0.10,"0,10 mol/L"],[0.20,"0,20 mol/L"]], 0.1);
    var vb = k.slider("Volume de soude versé", 0, 40, 0.5, 5, "mL");
    var id = k.select("Indicateur", [["bbt","Bleu de bromothymol"],["phph","Phénolphtaléine"],["helia","Hélianthine"],["papier","Papier pH universel"]], "bbt");
    var ro = k.readouts(["pH","Volume à l'équivalence","Étape","pH à l'équivalence"]);
    var nt = k.note("","");
    var Va=20, Ca=0.10, Ka=1.8e-5, lastMove=0, gax=null;
    vb.el.addEventListener("input", function(){ lastMove=Date.now(); });
    var lpT=k.loop(function(){ if(Date.now()-lastMove<800) k.redraw(); });
    c.pointer(function(type,pt){ if(type==="up"||!gax) return; if(pt.y<gax.T-4) return; vb.set(Math.round(Math.max(0,Math.min(40,gax.ix(pt.x)))*2)/2); lastMove=Date.now(); k.redraw(); });
    function ph(V,cbv,kind){ var na=Ca*Va, nbv=cbv*V, Vt=Va+V; if(kind==="fort") return phStrong(na,nbv,Vt); return phWeak(na/Vt,nbv/Vt,Ka); }
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, kind=ac.value, cbv=+cb.value, V=vb.value, Veq=Ca*Va/cbv, p=ph(V,cbv,kind), Vt=Va+V;
      CH.bg(c);
      var bx=W*0.06, bw=W*0.3, by=46, bh=92, bux=bx+bw*0.5;
      /* burette */
      var bt=4, bb=by-6, lvB=(40-V)/40; CH.rr(c,bux-6,bt,12,bb-bt,"rgba(255,255,255,.85)","#6b7a90",1.8,3); CH.rr(c,bux-4.5,bt+2+(bb-bt-4)*(1-lvB),9,Math.max(0,(bb-bt-4)*lvB),"rgba(90,130,210,.55)",null,0,2);
      for(var gi=0;gi<=4;gi++) D.line(c,bux-6,bt+2+(bb-bt-4)*gi/4,bux-1,bt+2+(bb-bt-4)*gi/4,"#8a95a3",1);
      D.line(c,bux-9,bb+2,bux+9,bb+2,P.mat,3); D.label(c,"soude",bux+34,bt+10,{size:10,color:P.acc});
      if(Date.now()-lastMove<700){ var dph=((Date.now()/160)%1); CH.ball(c,bux,bb+8+dph*(by+bh*0.25-bb-8),3,P.acc,"",{lw:.4}); }
      CH.glass(c,bx,by,bw,bh,0.72,ramp(IND[id.value].stops,p),{round:10});
      D.label(c,"pH "+F(p,2),bx+bw/2,by+bh+16,{size:12,color:P.mat});
      // barres d'espèces (mmol)
      var na=Ca*Va, nbv=cbv*V, h=Math.pow(10,-p), oh=1e-14/h, hm=h*Vt, om=oh*Vt, bars;
      if(kind==="fort") bars=[["Cl⁻ (spectateur)",na,P.green],["Na⁺ (spectateur)",nbv,P.green],["H⁺ restant",hm,P.red],["OH⁻ en excès",om,P.acc]];
      else { var A=(na/Vt)*Ka/(Ka+h)*Vt; bars=[["CH₃COOH restant",na-A,P.amber],["CH₃COO⁻ formé",A,P.green],["Na⁺ (spectateur)",nbv,P.green],["H⁺ libre",hm,P.red],["OH⁻ en excès",om,P.acc]]; }
      var mx=Math.max(2.2, nbv*1.05), rx=W*0.44, rw=W*0.5, rh=17; T(c,"quantités d'ions (mmol)",rx+rw/2,10,{size:12,color:P.grey});
      bars.forEach(function(b,i){ var y=22+i*22; rr(c,rx,y,rw,rh,"#eef1f5",null,0,3); g.save(); g.globalAlpha=0.55; rr(c,rx,y,Math.max(1.5,rw*Math.min(1,b[1]/mx)),rh,b[2],null,0,3); g.restore(); T(c,b[0]+" : "+(b[1]<0.01?"≈ 0":F(b[1],2)),rx+4,y+rh/2,{size:12,color:"#0f1b2d",align:"left"}); });
      // courbe
      var ax=D.axes(c,{x0:0,x1:40,y0:0,y1:14,xl:"V soude (mL)",yl:"pH",stepX:10,stepY:2,l:44,t:178,b:34}); gax=ax;
      D.fn(c,ax,function(x){ return ph(x,cbv,kind); },P.acc,2.8);
      D.line(c,ax.X(Veq),ax.Y(0),ax.X(Veq),ax.Y(14),P.amber,1.5,[5,4]); D.label(c,"équivalence",ax.X(Veq),ax.T+8,{size:11,color:P.amber,align:Veq>28?"right":"left"});
      D.line(c,ax.L,ax.Y(7),ax.R,ax.Y(7),P.grey,1,[2,4]);
      D.dot(c,ax.X(V),ax.Y(p),8,P.red); D.label(c,"glisse sur la courbe",ax.R-68,ax.B-14,{size:10,color:P.grey});
      var peq=ph(Veq,cbv,kind), stage=Math.abs(V-Veq)<1e-9?"équivalence":(V<Veq?"avant l'équivalence (acide en excès)":"après l'équivalence (base en excès)");
      lpT.play(); ro.set(0,F(p,2)); ro.set(1,F(Veq,1)+" mL"); ro.set(2,stage); ro.set(3,F(peq,1));
      nt.set((stage==="équivalence"?"<b>Équivalence :</b> les quantités d'acide et de base sont exactement dans les proportions de la réaction : H⁺ + OH⁻ → H₂O (ou CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O). ":"")+"Réaction : "+(kind==="fort"?"HCl + NaOH → NaCl + H₂O":"CH₃COOH + NaOH → CH₃COONa + H₂O")+". "+(kind==="faible"?"Acide faible : à l'équivalence la solution contient l'ion éthanoate CH₃COO⁻, qui est basique : pH ≈ "+F(peq,1)+" > 7. ":"Acide fort + base forte : à l'équivalence, pH = 7 (solution de NaCl). ")+(V>Veq?"Il y a maintenant un excès de OH⁻ : le pH monte au-dessus de l'équivalence.":""), stage==="équivalence"?"ok":"");
    });
  }
});

/* ---------- 3 · Acide + métal ---------- */
var MET = {
  mg:{n:"Magnésium", M:24, nu:1, k:0.30, eq:"Mg + 2 HCl → MgCl₂ + H₂", note:"réaction très vive"},
  al:{n:"Aluminium", M:27, nu:1.5, k:0.06, eq:"2 Al + 6 HCl → 2 AlCl₃ + 3 H₂", note:"démarre lentement (couche d'oxyde protectrice) puis s'accélère"},
  zn:{n:"Zinc", M:65, nu:1, k:0.04, eq:"Zn + 2 HCl → ZnCl₂ + H₂", note:"réaction régulière"},
  fe:{n:"Fer", M:56, nu:1, k:0.012, eq:"Fe + 2 HCl → FeCl₂ + H₂", note:"réaction lente"},
  cu:{n:"Cuivre", M:64, nu:0, k:0, eq:"Cu + HCl → pas de réaction", note:"aucune réaction avec un acide dilué"},
  ag:{n:"Argent", M:108, nu:0, k:0, eq:"Ag + HCl → pas de réaction", note:"aucune réaction avec un acide dilué"}
};
SFA.sim({
  id:"c3-c10-metal", ch:"c10", tag:"Expérience",
  titre:"Acide chlorhydrique + métal : du dihydrogène !",
  resume:"Certains métaux réagissent avec un acide en dégageant du dihydrogène, d'autres pas : mesure le volume de gaz et teste-le.",
  but:"Choisis un métal, sa masse et la concentration de l'acide. Suis le volume de gaz recueilli au cours du temps, puis approche une allumette du gaz recueilli.",
  aRetenir:"Un acide attaque certains métaux (Mg, Al, Zn, Fe) en formant un sel et du dihydrogène : métal + acide → sel + H₂. Le gaz s'identifie par la détonation qu'il produit en présence d'une flamme (« pop »). La quantité de gaz dépend de la masse de métal (si l'acide est en excès) ; la vitesse dépend du métal et de la concentration de l'acide.",
  piege:"Tous les métaux ne réagissent pas avec les acides : le cuivre et l'argent sont sans effet. Une plus grande concentration d'acide accélère la réaction mais ne change pas le volume de gaz final si le métal est limitant. Masses molaires arrondies (Mg 24, Al 27, Fe 56, Zn 65 g/mol) ; gaz à 20 °C (24 L/mol) ; acide en excès.",
  build:function(k,S){
    var c = k.canvas(340);
    var me = k.select("Métal", Object.keys(MET).map(function(i){return [i,MET[i].n];}), "mg", function(){ t=0; });
    var ms = k.slider("Masse de métal", 0.05, 0.5, 0.05, 0.2, "g", function(){ t=0; });
    var cn = k.seg("Acide chlorhydrique", [[1,"dilué"],[2,"2 fois plus concentré"]], 1, function(){ t=0; });
    var sp = k.slider("Vitesse de la simulation", 1, 20, 1, 6, "×");
    var ro = k.readouts(["Gaz recueilli","Volume final prévu","Test à l'allumette"]);
    var nt = k.note("","");
    var t=0, tested=false;
    function vmax(){ var m=MET[me.value]; return m.nu*ms.value/m.M*24*1000; }
    function kk(){ return MET[me.value].k*(+cn.value); }
    function vol(tt){ var m=MET[me.value]; if(m.k===0) return 0; var v=vmax()*(1-Math.exp(-kk()*tt)); if(me.value==="al") v=vmax()*(1-Math.exp(-kk()*Math.max(0,tt-8*(1/ (+cn.value))))); return v; }
    var lp = k.loop(function(dt){ t+=dt*sp.value; k.redraw(); });
    k.button("Relancer", function(){ t=0; tested=false; }, true);
    k.button("Approcher une allumette du gaz", function(){ tested=true; });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, m=MET[me.value], v=vol(t), vm=vmax(), tmax=m.k>0?Math.max(20,Math.min(900,6/kk()+(me.value==="al"?10:0))):60;
      var tw=W*0.15, tx=W*0.04, ty=34, th=H*0.55, ew=W*0.09, ex=tx+tw+W*0.07, ey=44, eh=H*0.5;
      CH.bg(c,H-12);
      CH.glass(c,tx,ty,tw,th,0.7,"rgba(170,225,190,.6)",{round:tw/2});
      var full=5+ms.value*14, sz=m.k===0?full:Math.max(0,(1-v/Math.max(vm,1e-9)))*full;
      CH.ball(c,tx+tw/2,ty+th-7,Math.max(0.6,sz*0.5),"#98a4b3","",{lw:.8,stroke:"#6b7686"});
      if(m.k>0&&v<vm*0.995){ var nb=Math.min(12,3+Math.round(m.k*(+cn.value)*10)); for(var i=0;i<nb;i++){ var bxp=tx+5+((i*37+Math.floor(t*3)*13)%Math.max(4,tw-10)), byp=ty+th*0.9-((i*53+t*40)%(th*0.6)); circ(c,bxp,byp,2.4,"rgba(255,255,255,0.9)","#7aa0c2",1); } }
      T(c,"HCl + "+m.n.toLowerCase(),4,ty+th+30,{size:12,color:P.ink,align:"left"});
      // tuyau et éprouvette graduée
      D.line(c,tx+tw,ty+4,ex+ew/2,ty+4,"#7aa0c2",2); D.line(c,ex+ew/2,ty+4,ex+ew/2,ey+eh-10,"#7aa0c2",2);
      var f=vm>0?Math.min(1,v/Math.max(vm*1.2,50)):0; CH.glass(c,ex,ey,ew,eh,1-f,"rgba(255,255,255,0)",{round:4,ticks:9}); g.save(); g.fillStyle="rgba(255,255,255,.95)"; g.fillRect(ex+1.5,ey+1,ew-3,Math.max(0,eh*f-1)); g.restore(); g.save(); g.fillStyle="rgba(150,200,255,.55)"; g.fillRect(ex+1.5,ey+eh*f,ew-3,Math.max(0,eh*(1-f)-1)); g.restore(); CH.glass(c,ex,ey,ew,eh,0,"#fff",{round:4,ticks:9});
      T(c,F(v,0)+" mL",ex+ew/2,ey+eh+14,{size:13,color:P.acc});
      // courbe V(t)
      var gx0=ex+ew+W*0.14;
      var ymax=Math.max(100,Math.ceil(vm*1.15/100)*100);
      var ax=D.axes(c,{x0:0,x1:tmax,y0:0,y1:ymax,xl:"t (s)",yl:"V (mL)",l:gx0,t:12,b:30,r:10});
      D.fn(c,ax,function(x){ return vol(x); },P.acc,2.6); if(vm>0) D.line(c,ax.L,ax.Y(vm),ax.R,ax.Y(vm),P.amber,1.2,[5,4]);
      D.dot(c,ax.X(Math.min(t,tmax)),ax.Y(Math.min(v,ymax)),6,P.red);
      if(tested){ if(v>1){ D.glow(c,ex+ew/2,ey-8,40,P.yellow,.8); } D.label(c,v>1?"POP !":"rien",ex+ew/2,ey-14,{size:14,color:v>1?P.red:P.grey}); }
      ro.set(0,F(v,0)+" mL"); ro.set(1,m.nu>0?F(vm,0)+" mL":"0 mL (pas de réaction)"); ro.set(2,tested?(v>1?"petite détonation : H₂":"aucun gaz à tester"):"pas encore testé");
      nt.set("<b>"+m.n+"</b> : "+m.note+". Équation : "+m.eq+"."+(m.nu>0?" Avec "+F(ms.value,2)+" g de métal : "+F(vm,0)+" mL de H₂ (acide en excès).":" Le métal ne réagit pas avec les ions H⁺ de l'acide : pas de gaz."), m.nu>0?"ok":"warn");
    });
    lp.play();
  }
});

/* ---------- 4 · Jus de chou rouge ---------- */
var CHOU = [[0,"#d63a52"],[2,"#d63a52"],[4,"#c2437f"],[6,"#8c4aa6"],[7,"#6e52b8"],[8,"#4a64d0"],[9,"#3a8fc4"],[10,"#38b0a0"],[11,"#4ab868"],[12,"#a8c548"],[13,"#e1c63a"],[14,"#e1c63a"]];
var CSUB = [["Jus de citron",2.2],["Cola",2.5],["Vinaigre",2.9],["Eau gazeuse",4.5],["Lait",6.5],["Eau pure",7.0],["Bicarbonate (solution)",8.3],["Savon",10.0],["Ammoniaque ménagère",11.5],["Déboucheur (soude)",13.0]];
SFA.sim({
  id:"c3-c10-chou", ch:"c10", tag:"Original",
  titre:"Le jus de chou rouge : un indicateur universel maison",
  resume:"Le chou rouge change de couleur sur toute l'échelle de pH : de rouge à jaune. Devine le pH d'un échantillon mystère d'après sa couleur.",
  but:"Compare la couleur obtenue avec différentes solutions et avec la couleur de référence correspondant à ton pH estimé. Relève le défi de l'échantillon mystère : trouve son pH à ±1.",
  aRetenir:"Le jus de chou rouge contient un pigment qui change de couleur avec le pH : rouge-rose en milieu très acide, violet vers la neutralité, bleu puis vert en milieu basique, jaune en milieu très basique. C'est un indicateur coloré universel : l'échelle de couleurs permet d'estimer le pH d'une solution.",
  piege:"La couleur donne une estimation du pH, pas une valeur exacte : deux solutions de pH 1 et 2 ont presque la même couleur (rouge), tout comme pH 12 et 13 (jaune-vert). Les couleurs réelles varient selon le chou et la concentration du jus. À la maison : manipule sans te mettre en danger, évite la soude et l'eau de Javel (qui détruit la couleur).",
  build:function(k,S){
    var c = k.canvas(340);
    var sm = k.select("Échantillon", [["m","Échantillon mystère"]].concat(CSUB.map(function(s,i){return [i,s[0]+" (pH ≈ "+F(s[1],1)+")"];})), "m", function(){ if(sm.value==="m") newM(); });
    var pe = k.slider("pH estimé (ta référence)", 0, 14, 0.5, 7, "");
    var ro = k.readouts(["Échantillon","pH estimé","Écart"]);
    var nt = k.note("","");
    var truth=9;
    function newM(){ truth=[2,3,4,5,6,7,8,9,10,11,12,13][Math.floor(Math.random()*12)]; }
    k.button("Nouveau mystère", function(){ sm.el.value="m"; newM(); }, true);
    newM();
    function tube(x,y,w,h,col,label){ CH.glass(c,x,y,w,h,0.72,col,{round:w/2,taper:0}); D.label(c,label,x+w/2,y+h+16,{size:11.5,color:P.ink}); }
    var scc=null; c.pointer(function(type,pt){ if(type==="up"||!scc) return; if(pt.y<scc.y-14||pt.y>scc.y+scc.h+22) return; pe.set(Math.round(Math.max(0,Math.min(14,(pt.x-scc.x)/scc.w*14))*2)/2); k.redraw(); });
    k.draw(function(){
      c.clear(); CH.bg(c); var W=c.W,H=c.H,g=c.ctx, mys=sm.value==="m", tv=mys?truth:CSUB[+sm.value][1], est=pe.value;
      // échelle
      var sx=16, sw=W-32, sy=30, sh=26; scc={x:sx,w:sw,y:sy,h:sh}; for(var i=0;i<sw;i++){ g.fillStyle=ramp(CHOU,(i/sw)*14); g.fillRect(sx+i,sy,2,sh); }
      for(var t=0;t<=14;t+=2){ D.line(c,sx+t/14*sw,sy+sh,sx+t/14*sw,sy+sh+5,P.grey,1); T(c,String(t),sx+t/14*sw,sy+sh+16,{size:12,color:P.grey}); }
      D.label(c,"échelle du chou rouge : glisse ton pH estimé",W/2,12,{size:11,color:P.mat});
      var mx=sx+est/14*sw; g.save(); g.fillStyle=P.ink; g.beginPath(); g.moveTo(mx,sy+sh+1); g.lineTo(mx-6,sy+sh+10); g.lineTo(mx+6,sy+sh+10); g.closePath(); g.fill(); g.restore();
      var tw=Math.min(70,W*0.18), ty=sy+sh+36, th=H-ty-34;
      tube(W*0.25-tw/2,ty,tw,th,ramp(CHOU,tv),mys?"mystère":CSUB[+sm.value][0].split(" (")[0]); tube(W*0.75-tw/2,ty,tw,th,ramp(CHOU,est),"référence pH "+F(est,1));
      T(c,"≟",W/2,ty+th*0.5,{size:30,color:P.grey});
      var diff=est-tv, ok=Math.abs(diff)<=1;
      ro.set(0,mys?"mystère (pH caché)":CSUB[+sm.value][0].split(" (")[0]); ro.set(1,F(est,1)); ro.set(2,mys?(ok?"≤ 1 : trouvé":"> 1"):F(est-tv,1));
      if(mys) nt.set(ok?"✓ Bravo : ton pH estimé ("+F(est,1)+") est à moins de 1 unité du pH réel (<b>"+F(tv,0)+"</b>). C'est "+(tv<7?"une solution acide":(tv>7?"une solution basique":"une solution neutre"))+" : "+(tv<3?"comme le citron ou le vinaigre.":(tv<6?"comme une eau gazeuse ou un café.":(tv<8?"proche de l'eau pure ou du lait.":(tv<11?"comme le bicarbonate ou le savon.":"comme l'ammoniaque ou la soude."))))+" ":"Compare les deux tubes : fais glisser le curseur jusqu'à obtenir la même couleur que le mystère. Rouge-rose : acide ; violet : neutre ; bleu : un peu basique ; vert-jaune : très basique.", ok?"ok":"warn");
      else nt.set("<b>"+CSUB[+sm.value][0]+"</b> (pH ≈ "+F(tv,1)+") donne la couleur du tube de gauche : "+(tv<4?"rouge-rose (acide).":(tv<6.5?"rose-violet (légèrement acide).":(tv<7.5?"violet-bleu (neutre).":(tv<9.5?"bleu (basique).":"vert à jaune (très basique)."))))+" Compare avec ta référence.","");
    });
  }
});
})();
