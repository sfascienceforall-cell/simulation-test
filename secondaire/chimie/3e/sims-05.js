/* Chapitre 5 · Ions et molécules */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
var SUBD = "₀₁₂₃₄₅₆₇₈₉";
function sub(n){ return String(n).split("").map(function(d){ return SUBD[+d]; }).join(""); }
function gcd(a,b){ return b?gcd(b,a%b):a; }

/* ---------- 1 · Atome → ion ---------- */
var AT = {
  li:["Li","lithium",3,1], be:["Be","béryllium",4,2], n:["N","azote",7,-3], o:["O","oxygène",8,-2], f:["F","fluor",9,-1], na:["Na","sodium",11,1], mg:["Mg","magnésium",12,2], al:["Al","aluminium",13,3], p:["P","phosphore",15,-3], s:["S","soufre",16,-2], cl:["Cl","chlore",17,-1], k:["K","potassium",19,1], ca:["Ca","calcium",20,2]
};
var GN = {2:"hélium",10:"néon",18:"argon"};
SFA.sim({
  id:"c3-c05-ion", ch:"c05", tag:"Classique",
  titre:"De l'atome à l'ion : gagner ou perdre des électrons",
  resume:"Retire ou ajoute des électrons à un atome : la charge change, les protons jamais.",
  but:"Choisis un élément puis fais varier le nombre d'électrons gagnés ou perdus (curseur, boutons − / + ou clic sur un électron pour l'arracher). Observe la couche externe, la charge et le symbole de l'ion. Trouve l'ion que l'élément forme naturellement.",
  aRetenir:"Un ion est un atome (ou un groupe d'atomes) qui a gagné ou perdu des électrons. Perte d'électrons : cation (charge +). Gain : anion (charge −). Le nombre de protons ne change pas : l'élément reste le même. Les ions courants ont une couche externe pleine (2 ou 8 électrons), comme un gaz noble.",
  piege:"Un ion Na⁺ n'a pas « gagné un proton » : il a perdu un électron. Les métaux donnent des cations, les non-métaux des anions. Les électrons ne se retirent pas au hasard : on cherche la configuration d'un gaz noble.",
  build:function(k,S){
    var c = k.canvas(400);
    var el = k.select("Élément", Object.keys(AT).map(function(i){return [i,AT[i][1]+" ("+AT[i][0]+", Z = "+AT[i][2]+")"];}), "na", function(){ gain.set(0); });
    var gain = k.slider("Électrons gagnés (+) ou perdus (−)", -3, 3, 1, 0, "");
    k.button("Ion naturel", function(){ gain.set(-AT[el.value][3]); }, true);
    var ro = k.readouts(["Protons","Électrons","Charge","Particule"]);
    var nt = k.note("","");
    var chips=[], epos=[], flash=0;
    var lp = k.loop(function(dt){ flash=Math.max(0,flash-dt); k.redraw(); });
    c.pointer(function(type,pt){ if(type!=="down") return;
      for(var i=0;i<chips.length;i++) if(CH.hit(chips[i],pt)){ gain.set(gain.value+chips[i].d); flash=.6; k.redraw(); return; }
      for(var j=epos.length-1;j>=0;j--){ if(Math.hypot(pt.x-epos[j][0],pt.y-epos[j][1])<12){ gain.set(gain.value-1); flash=.6; k.redraw(); return; } } });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx,a=AT[el.value],Z=a[2],E=Z+gain.value, cx=W/2, cy=H/2-26, R=Math.min(W,H-110)/2-6, q=Z-E, t=Date.now()/1000, small=W<420;
      CH.bg(c);
      var shells=[2,8,8,2], rem=Math.max(E,0), ring=[]; shells.forEach(function(cap){ var m=Math.min(cap,rem); ring.push(m); rem-=m; });
      var rad=[0.3,0.55,0.78,0.98].map(function(f){return R*f;});
      var outer=ring[3]>0?ring[3]:(ring[2]>0?ring[2]:(ring[1]>0?ring[1]:ring[0])), li=ring[3]>0?3:(ring[2]>0?2:(ring[1]>0?1:0));
      var full=(li===0&&outer===2)||(li===1&&outer===8)||(li===2&&outer===8);
      ring.forEach(function(m,j){ if(m>0||j===0){ g.save(); g.setLineDash([3,5]); var on=(j===li&&full&&E>0); CH.circ(c,cx,cy,rad[j],null,on?P.green:"#b8c3d3",on?2.4:1.3); g.restore(); } });
      D.glow(c,cx,cy,rad[0]*1.3,q>0?P.red:(q<0?P.acc:P.amber),.35);
      CH.ball(c,cx,cy,rad[0]*0.62,P.red,"+"+Z,{size:15});
      epos=[];
      ring.forEach(function(m,j){ for(var i=0;i<m;i++){ var ang=-1.57+i*6.2832/m+j*0.35+t*0.25*(j%2?-1:1)/(1+j), x=cx+rad[j]*Math.cos(ang), y=cy+rad[j]*Math.sin(ang); epos.push([x,y]); CH.ball(c,x,y,6,P.acc,"",{lw:1}); } });
      var sym=a[0]+(q===0?"":(Math.abs(q)>1?Math.abs(q):"")+(q>0?"+":"−")), sh=q===0?"":(Math.abs(q)>1?Math.abs(q):"")+(q>0?"+":"−");
      /* carte symbole */
      D.panel(c,8,8,small?78:92,small?58:66,{shadow:false});
      D.text(c,a[0],8+(small?32:38),8+(small?32:36),{size:small?30:36,color:P.mat,math:true});
      if(sh) D.text(c,sh,8+(small?64:76),8+14,{size:13,color:q>0?P.red:P.acc});
      D.label(c,q===0?"atome neutre":(q>0?"cation":"anion"),8+(small?39:46),(small?66:74)+10,{size:11,color:q===0?P.green:(q>0?P.red:P.acc)});
      D.legend(c,[[P.red,"proton (+)"],[P.acc,"électron (−)"]],W-8,8,{align:"right"});
      D.label(c,"charge totale : "+Z+" − "+E+" = "+(q>0?"+"+q:(q<0?"−"+Math.abs(q):"0")),W-8,60,{align:"right",size:11,color:q>0?P.red:(q<0?P.acc:P.green)});
      if(full&&GN[E]) D.label(c,"= comme le "+GN[E]+" (couche pleine)",cx,H-66,{size:12,color:P.green});
      /* boutons */
      chips=[]; var bw=Math.min(120,(W-30)/2);
      [[-1,"− 1 électron",P.red],[1,"+ 1 électron",P.acc]].forEach(function(b,i){ var x=W/2+(i?6:-bw-6); CH.rr(c,x,H-48,bw,36,"#fff",b[2],1.8,12); D.text(c,b[1],x+bw/2,H-30,{size:13,color:b[2]}); chips.push({x:x,y:H-48,w:bw,h:36,d:b[0]}); });
      ro.set(0,String(Z)); ro.set(1,String(E)); ro.set(2,q===0?"0":(q>0?"+"+q:"−"+Math.abs(q))); ro.set(3,a[0]+(sh?"<sup>"+sh+"</sup>":"")+(q===0?" (atome)":(q>0?" (cation)":" (anion)")));
      var msg;
      if(E===0) msg="Il ne reste aucun électron : c'est un noyau nu, pas un ion usuel de la chimie. Reviens à un nombre d'électrons plus raisonnable.";
      else if(full&&GN[E]) msg="Couche externe pleine : même nombre d'électrons que le <b>"+GN[E]+"</b> ("+E+" électrons). Configuration stable, c'est l'ion que "+a[1]+" forme naturellement"+(q===-a[3]?".":" (même si d'autres ions existent).");
      else msg="Couche externe : "+outer+" électron"+(outer>1?"s":"")+" (incomplète). Cet ion n'est pas courant : "+a[1]+" forme plutôt l'ion "+a[0]+"<sup>"+(Math.abs(a[3])>1?Math.abs(a[3]):"")+(a[3]>0?"+":"−")+"</sup>.";
      if(q===0) msg="Atome neutre : "+Z+" protons (charges +) et "+E+" électrons (charges −). "+(full?"":"Couche externe incomplète : l'atome peut gagner ou perdre des électrons.");
      nt.set(msg, (full&&q!==0)?"ok":"");
    });
    lp.play();
  }
});

/* ---------- 2 · Formation d'un composé ionique ---------- */
var METAL = {na:["Na","sodium","de sodium",1], li:["Li","lithium","de lithium",1], k:["K","potassium","de potassium",1], mg:["Mg","magnésium","de magnésium",2], ca:["Ca","calcium","de calcium",2], al:["Al","aluminium","d'aluminium",3]};
var NONM = {cl:["Cl","chlore","chlorure",1], f:["F","fluor","fluorure",1], o:["O","oxygène","oxyde",2], s:["S","soufre","sulfure",2]};
SFA.sim({
  id:"c3-c05-transfert", ch:"c05", tag:"Animation",
  titre:"Formation d'un composé ionique : le transfert d'électrons",
  resume:"Un métal donne ses électrons de valence à un non-métal : les ions de charges opposées s'attirent.",
  but:"Choisis un métal et un non-métal, puis fais avancer le transfert d'électrons avec le curseur (ou le bouton). Compte les atomes nécessaires pour que le composé soit neutre.",
  aRetenir:"Le métal perd ses électrons de valence (cation), le non-métal gagne les électrons qui lui manquent pour avoir 8 électrons de valence (anion). Les ions de charges opposées s'attirent et forment un cristal. La charge totale est nulle : formule = autant de charges + que de charges −.",
  piege:"Dans NaCl ou MgCl₂, il n'y a pas de molécules NaCl : la formule donne seulement le rapport entre les ions du cristal. Les électrons transférés ne disparaissent pas : leur nombre perdu égale leur nombre gagné.",
  build:function(k,S){
    var c = k.canvas(330);
    var me = k.select("Métal", Object.keys(METAL).map(function(i){return [i,METAL[i][1]+" ("+METAL[i][0]+", "+METAL[i][3]+" é de valence)"];}), "mg");
    var nm = k.select("Non-métal", Object.keys(NONM).map(function(i){return [i,NONM[i][1]+" ("+NONM[i][0]+", il lui manque "+NONM[i][3]+" é)"];}), "cl");
    var pr = k.slider("Avancement du transfert", 0, 100, 1, 0, "%");
    var ro = k.readouts(["Atomes de métal","Atomes de non-métal","Électrons transférés","Formule"]);
    var nt = k.note("","");
    var lp = k.loop(function(dt){ var v=pr.value+dt*40; if(v>=100){ v=100; lp.pause(); } pr.set(v); k.redraw(); });
    k.button("Animer", function(){ pr.set(0); lp.play(); }, true);
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, M=METAL[me.value], X=NONM[nm.value], v=M[3], w=X[3], gg=gcd(v,w), nM=w/gg, nX=v/gg, tot=nM*v, p=pr.value/100;
      var colX=[W*0.25,W*0.75];
      function ys(n){ var r=[],gap=Math.min(86,(H-60)/n); for(var i=0;i<n;i++) r.push(H/2+(i-(n-1)/2)*gap); return r; }
      var yM=ys(nM), yX=ys(nX), rM=Math.min(30,(H-60)/Math.max(nM,nX)/2.6), rX=rM*1.12;
      function slot(cx,cy,r,i,n,out){ var ang=-1.57+i*6.2832/n; return [cx+(r+0)*Math.cos(ang),cy+(r)*Math.sin(ang)]; }
      var done=p>=0.999;
      CH.bg(c);
      yM.forEach(function(y){ if(done) D.glow(c,colX[0],y,rM*2,P.acc,.35); g.save(); g.setLineDash([3,4]); CH.circ(c,colX[0],y,rM+8,null,"#b8c3d3",1.2); g.restore(); CH.ball(c,colX[0],y,rM,done?P.acc:"#7d93b8",M[0]+(done?["","","²","³"][v]+"⁺":""),{size:15}); });
      yX.forEach(function(y){ if(done) D.glow(c,colX[1],y,rX*2,P.green,.35); g.save(); g.setLineDash([3,4]); CH.circ(c,colX[1],y,rX+8,null,"#b8c3d3",1.2); g.restore(); CH.ball(c,colX[1],y,rX,done?P.green:"#7fae98",X[0]+(done?["","","²","³"][w]+"⁻":""),{size:15}); });
      // électrons
      var e=0;
      for(var im=0;im<nM;im++){ for(var j=0;j<v;j++){ var src=slot(colX[0],yM[im],rM+8,j,v), ix=Math.floor(e/w), jx=e%w, dst=slot(colX[1],yX[ix],rX+8,jx,w), t=Math.max(0,Math.min(1,p*1.25-0.25*(e/Math.max(1,tot-1))));
          var xx=src[0]+(dst[0]-src[0])*t, yy=src[1]+(dst[1]-src[1])*t; CH.ball(c,xx,yy,5.5,P.amber,"",{lw:1.2}); e++; } }
      // cases vides côté non-métal
      for(var ix2=0;ix2<nX;ix2++) for(var jx2=0;jx2<w;jx2++){ var d=slot(colX[1],yX[ix2],rX+8,jx2,w); if(p<0.02){ g.save(); g.strokeStyle=P.grey; g.setLineDash([2,2]); g.beginPath(); g.arc(d[0],d[1],5,0,6.28); g.stroke(); g.restore(); } }
      if(done){ D.label(c,"attraction",W/2,H/2,{size:12,color:P.red}); D.arrow(c,colX[0]+rM+10,H/2-14,colX[1]-rX-10,H/2-14,P.red,1.5); D.arrow(c,colX[1]-rX-10,H/2+14,colX[0]+rM+10,H/2+14,P.red,1.5); }
      D.label(c,"métal : donne",colX[0],16,{size:12,color:P.acc}); D.label(c,"non-métal : reçoit",colX[1],16,{size:12,color:P.green});
      var formula=M[0]+(nM>1?sub(nM):"")+X[0]+(nX>1?sub(nX):"");
      ro.set(0,nM+" "+M[0]); ro.set(1,nX+" "+X[0]); ro.set(2,tot+" é"); ro.set(3,formula);
      nt.set("<b>"+formula+"</b> : "+X[2]+" "+M[2]+". Charges : "+nM+" × (+"+v+") + "+nX+" × (−"+w+") = "+(nM*v)+" − "+(nX*w)+" = <b>0</b>."+(done?" Les ions s'attirent : ils s'organisent en cristal.":""),done?"ok":"");
    });
  }
});

/* ---------- 3 · Constructeur de molécules ---------- */
var VE = {H:1,C:4,N:5,O:6,Cl:7};
var MOL = {
 "H2":{n:"dihydrogène",a:[["H",-0.5,0],["H",0.5,0]],b:[[0,1,1]]},
 "O2":{n:"dioxygène",a:[["O",-0.6,0],["O",0.6,0]],b:[[0,1,2]]},
 "N2":{n:"diazote",a:[["N",-0.55,0],["N",0.55,0]],b:[[0,1,3]]},
 "Cl2":{n:"dichlore",a:[["Cl",-0.7,0],["Cl",0.7,0]],b:[[0,1,1]]},
 "HCl":{n:"chlorure d'hydrogène",a:[["H",-0.8,0],["Cl",0.8,0]],b:[[0,1,1]]},
 "H2O":{n:"eau",a:[["O",0,-0.2],["H",-0.85,0.55],["H",0.85,0.55]],b:[[0,1,1],[0,2,1]]},
 "H2O2":{n:"peroxyde d'hydrogène (eau oxygénée)",a:[["O",-0.7,0],["O",0.7,0],["H",-1.3,0.8],["H",1.3,0.8]],b:[[0,1,1],[0,2,1],[1,3,1]]},
 "CO2":{n:"dioxyde de carbone",a:[["O",-1.4,0],["C",0,0],["O",1.4,0]],b:[[0,1,2],[1,2,2]]},
 "CO":{n:"monoxyde de carbone",a:[["C",-0.6,0],["O",0.6,0]],b:[[0,1,3]]},
 "HCN":{n:"cyanure d'hydrogène",a:[["H",-1.3,0],["C",0,0],["N",1.3,0]],b:[[0,1,1],[1,2,3]]},
 "NH3":{n:"ammoniac",a:[["N",0,-0.1],["H",0,-1.1],["H",-0.95,0.65],["H",0.95,0.65]],b:[[0,1,1],[0,2,1],[0,3,1]]},
 "CH4":{n:"méthane",a:[["C",0,0],["H",-1,-1],["H",1,-1],["H",-1,1],["H",1,1]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
 "CH2O":{n:"méthanal (formaldéhyde)",a:[["C",0,0],["O",1.3,0],["H",-0.65,-1],["H",-0.65,1]],b:[[0,1,2],[0,2,1],[0,3,1]]},
 "CH4O":{n:"méthanol",a:[["C",-0.8,0],["O",0.8,0],["H",-0.8,-1],["H",-0.8,1],["H",-1.8,0],["H",1.5,0.85]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1]]},
 "C2H2":{n:"éthyne (acétylène)",a:[["H",-2,0],["C",-0.65,0],["C",0.65,0],["H",2,0]],b:[[0,1,1],[1,2,3],[2,3,1]]},
 "C2H4":{n:"éthène (éthylène)",a:[["C",-0.65,0],["C",0.65,0],["H",-1.25,-1],["H",-1.25,1],["H",1.25,-1],["H",1.25,1]],b:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]]},
 "C2H6":{n:"éthane",a:[["C",-0.75,0],["C",0.75,0],["H",-0.75,-1],["H",-0.75,1],["H",-1.8,0],["H",0.75,-1],["H",0.75,1],["H",1.8,0]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1],[1,6,1],[1,7,1]]},
 "C2H6O":{n:"éthanol",a:[["C",-1.5,0],["C",0,0],["O",1.4,0],["H",-1.5,-1],["H",-1.5,1],["H",-2.5,0],["H",0,-1],["H",0,1],["H",2.0,0.85]],b:[[0,1,1],[1,2,1],[0,3,1],[0,4,1],[0,5,1],[1,6,1],[1,7,1],[2,8,1]]}
};
function keyOf(cnt){ var s=""; if(cnt.C) s+="C"+(cnt.C>1?cnt.C:""); if(cnt.H) s+="H"+(cnt.H>1?cnt.H:""); if(cnt.N) s+="N"+(cnt.N>1?cnt.N:""); if(cnt.O) s+="O"+(cnt.O>1?cnt.O:""); if(cnt.Cl) s+="Cl"+(cnt.Cl>1?cnt.Cl:""); return s; }
function mkey(cnt){ /* clé de dictionnaire : C, H, N, O, Cl, selon la convention de MOL */
  var order=["C","H","N","O","Cl"], s=""; order.forEach(function(e){ if(cnt[e]) s+=e+(cnt[e]>1?cnt[e]:""); });
  var alt={"HCl":"HCl","H2O":"H2O","NH3":"NH3","HN":"x"}; return s;
}
function lookup(cnt){ var k=mkey(cnt); if(MOL[k]) return k;
  /* variantes d'ordre : H2O (H avant O), NH3 (N avant H) etc. */
  var cands=Object.keys(MOL); for(var i=0;i<cands.length;i++){ var m=cands[i], t={C:0,H:0,N:0,O:0,Cl:0}, re=/([A-Z][a-z]?)(\d*)/g, r; while((r=re.exec(m))) t[r[1]]+=r[2]?+r[2]:1; if(t.C===(cnt.C||0)&&t.H===(cnt.H||0)&&t.N===(cnt.N||0)&&t.O===(cnt.O||0)&&t.Cl===(cnt.Cl||0)) return m; }
  return null; }
function fmtF(m){ return m.replace(/(\d+)/g,function(d){ return sub(d); }); }
SFA.sim({
  id:"c3-c05-molecule", ch:"c05", tag:"Classique",
  titre:"Constructeur de molécules : H, C, N, O, Cl",
  resume:"Choisis le nombre d'atomes de chaque sorte : le simulateur dessine la molécule (liaisons, doublets non liants) si elle existe.",
  but:"Règle le nombre d'atomes de C, H, N, O et Cl, ou charge une molécule d'exemple. Vérifie que chaque atome a le bon nombre de liaisons : H 1, Cl 1, O 2, N 3, C 4.",
  aRetenir:"Dans une molécule, les atomes sont liés par des paires d'électrons partagées (liaisons covalentes). Chaque atome cherche à avoir 8 électrons autour de lui (2 pour H) : H forme 1 liaison, O 2, N 3, C 4, Cl 1. Les doublets non liants restent sur l'atome.",
  piege:"La formule brute (C₂H₆O) ne dit pas comment les atomes sont liés : il peut exister plusieurs molécules pour la même formule. Ici on ne montre qu'une molécule par formule. Et un schéma de Lewis est plat : la vraie molécule est en 3D.",
  build:function(k,S){
    var c = k.canvas(350);
    var ex = k.select("Charger une molécule", [["","— choisir —"]].concat(Object.keys(MOL).map(function(m){ return [m,fmtF(m)+" · "+MOL[m].n]; })), "", function(v){ if(!v) return; var t={C:0,H:0,N:0,O:0,Cl:0}, re=/([A-Z][a-z]?)(\d*)/g, r; while((r=re.exec(v))) t[r[1]]+=r[2]?+r[2]:1; nC.set(t.C); nH.set(t.H); nN.set(t.N); nO.set(t.O); nCl.set(t.Cl); });
    var nC = k.slider("Carbone (C)", 0, 2, 1, 1, "");
    var nH = k.slider("Hydrogène (H)", 0, 8, 1, 4, "");
    var nN = k.slider("Azote (N)", 0, 2, 1, 0, "");
    var nO = k.slider("Oxygène (O)", 0, 2, 1, 0, "");
    var nCl = k.slider("Chlore (Cl)", 0, 2, 1, 0, "");
    var ro = k.readouts(["Formule brute","Nom","Atomes","Liaisons attendues"]);
    var nt = k.note("","");
    function lone(atoms,bonds,i,nl){ var angs=[]; bonds.forEach(function(b){ var o=b[0]===i?b[1]:(b[1]===i?b[0]:-1); if(o>=0) angs.push(Math.atan2(atoms[o][2]-atoms[i][2],atoms[o][1]-atoms[i][1])); });
      var res=[]; for(var q=0;q<nl;q++){ var best=0,bs=-1; for(var a=0;a<360;a+=10){ var th=a*Math.PI/180, m=9; angs.concat(res).forEach(function(b){ var d=Math.abs(Math.atan2(Math.sin(th-b),Math.cos(th-b))); if(d<m) m=d; }); if(m>bs){ bs=m; best=th; } } res.push(best); } return res; }
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, cnt={C:nC.value,H:nH.value,N:nN.value,O:nO.value,Cl:nCl.value};
      CH.bg(c);
      var CPK={H:"#c9d3e0",C:"#4a5260",N:"#3b6fd6",O:"#d6402e",Cl:"#2f9e6b"}, VL={H:1,C:4,N:3,O:2,Cl:1};
      /* palette d'atomes avec valence */
      (function(){ var ks=["H","C","N","O","Cl"], w=Math.min(64,(W-16)/5); ks.forEach(function(e,i){ var x=W/2+(i-2)*w; CH.ball(c,x,H-30,e==="H"?9:11,CPK[e],e,{size:e==="Cl"?10:11,tc:e==="H"?"#0f1b2d":"#fff"}); D.text(c,VL[e]+" liaison"+(VL[e]>1?"s":""),x,H-10,{size:9.5,color:P.grey,weight:700}); }); })();
      var tot=cnt.C+cnt.H+cnt.N+cnt.O+cnt.Cl, val=cnt.C*4+cnt.H+cnt.N*3+cnt.O*2+cnt.Cl, nb=val/2;
      var key=tot?lookup(cnt):null, form=keyOf(cnt);
      ro.set(0,tot?fmtF(key||form):"—"); ro.set(1,key?MOL[key].n:(tot?"molécule inconnue":"—")); ro.set(2,String(tot)); ro.set(3,val%2===0?String(nb):"impossible (impair)");
      if(!key){
        D.label(c,tot?"Aucune molécule simple connue avec ces atomes":"Ajoute des atomes avec les curseurs",W/2,H/2-20,{size:13,color:P.grey});
        var all=[]; ["C","H","N","O","Cl"].forEach(function(e){ for(var q=0;q<cnt[e];q++) all.push(e); });
        all.forEach(function(e,i){ var cx2=W/2+(i-(all.length-1)/2)*Math.min(34,(W-40)/Math.max(1,all.length)), wob=Math.sin(Date.now()/500+i)*3; CH.ball(c,cx2,H/2+22+wob,e==="H"?10:13,CPK[e],e,{size:11,tc:e==="H"?"#0f1b2d":"#fff"}); });
        nt.set(!tot?"Choisis les atomes ou charge une molécule d'exemple.":(tot===1?"Un atome isolé ne forme pas de molécule.":(val%2?"La somme des valences ("+val+") est impaire : les atomes ne peuvent pas tous être complétés par des paires d'électrons partagées.":"La somme des valences est "+val+" (soit "+nb+" liaisons attendues), mais aucune structure simple connue n'a cette composition. Essaie de modifier les nombres d'atomes.")),"warn");
        return; }
      var m=MOL[key], xs=m.a.map(function(a){return a[1];}), ys=m.a.map(function(a){return a[2];});
      var minx=Math.min.apply(null,xs), maxx=Math.max.apply(null,xs), miny=Math.min.apply(null,ys), maxy=Math.max.apply(null,ys);
      var sc=Math.min((W-90)/Math.max(0.01,maxx-minx), (H-150)/Math.max(0.01,maxy-miny), 74), ox=W/2-(minx+maxx)/2*sc, oy=(H-40)/2-(miny+maxy)/2*sc;
      function X(i){ return ox+m.a[i][1]*sc; } function Y(i){ return oy+m.a[i][2]*sc; }
      var COLS={H:"#dfe6f0",C:"#9aa3b0",N:"#a9c1f0",O:"#f2b5ad",Cl:"#a9dcc4"};
      m.b.forEach(function(b){ var x1=X(b[0]),y1=Y(b[0]),x2=X(b[1]),y2=Y(b[1]), ang=Math.atan2(y2-y1,x2-x1), nx=-Math.sin(ang), ny=Math.cos(ang), n=b[2];
        for(var i=0;i<n;i++){ var off=(i-(n-1)/2)*7; D.line(c,x1+nx*off,y1+ny*off,x2+nx*off,y2+ny*off,"#5b6677",3.2); } });
      m.a.forEach(function(a,i){ var bonds=0; m.b.forEach(function(b){ if(b[0]===i||b[1]===i) bonds+=b[2]; });
        var ve=VE[a[0]], nl=a[0]==="H"?0:Math.floor((ve-bonds)/2); if(key==="CO") nl=1;
        CH.ball(c,X(i),Y(i),a[0]==="H"?13:17,CPK[a[0]],a[0],{size:a[0]==="Cl"?12:13,tc:a[0]==="H"?"#0f1b2d":"#fff"});
        lone(m.a,m.b,i,nl).forEach(function(th){ var cx=X(i)+Math.cos(th)*29, cy=Y(i)+Math.sin(th)*29, px=-Math.sin(th)*4, py=Math.cos(th)*4; circ(c,cx+px,cy+py,2.8,P.acc); circ(c,cx-px,cy-py,2.8,P.acc); }); });
      D.label(c,"•• doublet non liant · trait = liaison (paire partagée)",W/2,H-52,{size:11,color:P.grey});
      var tip="<b>"+fmtF(key)+"</b> : "+m.n+". "+nb+" liaison"+(nb>1?"s":"")+" (en comptant une double liaison pour 2, une triple pour 3). Vérifie : H 1, Cl 1, O 2, N 3, C 4."+(key==="CO"?" (Le monoxyde de carbone est un cas particulier : son schéma de Lewis exige des charges formelles, hors programme.)":"");
      nt.set(tip,"ok");
    });
  }
});

/* ---------- 4 · Sel ou sucre : pourquoi des fusions si différentes ---------- */
var MSUB = {
  eau:{n:"Glace (H₂O)", tm:0, tb:100, lab:"molécules d'eau"},
  i2:{n:"Diiode (I₂)", tm:114, tb:184, lab:"molécules I₂"},
  suc:{n:"Sucre (saccharose)", tm:186, tb:null, lab:"grosses molécules"}
};
SFA.sim({
  id:"c3-c05-fusion", ch:"c05", tag:"Comparaison",
  titre:"Pourquoi le sel fond à 801 °C et le sucre vers 186 °C",
  resume:"Chauffe un cristal ionique et un solide moléculaire côte à côte : les forces entre particules expliquent les températures de fusion.",
  but:"Fais monter la température et compare un cristal de sel (ions) avec un solide moléculaire de ton choix. Repère la température à laquelle chacun fond.",
  aRetenir:"Dans un cristal ionique, chaque ion est attiré par tous ses voisins de charge opposée : il faut beaucoup d'énergie pour les séparer (NaCl : 801 °C). Dans un solide moléculaire, ce sont des forces faibles entre molécules qui sont vaincues : la fusion est facile (glace 0 °C, diiode 114 °C), et les molécules restent intactes.",
  piege:"Quand un solide moléculaire fond, les molécules ne sont pas détruites : seules les forces entre molécules sont vaincues. Le sucre ne fond pas proprement : il se décompose (caramélise) vers 186 °C. Les dessins ne sont pas à l'échelle.",
  build:function(k,S){
    var c = k.canvas(300);
    var ms = k.select("Substance moléculaire", Object.keys(MSUB).map(function(i){return [i,MSUB[i].n+" · fusion ≈ "+MSUB[i].tm+" °C"];}), "suc");
    var tp = k.slider("Température", -20, 900, 1, 20, "°C");
    var ro = k.readouts(["NaCl (sel)","État du sel","Substance moléculaire","État"]);
    var nt = k.note("","");
    var N=5, ph=[], R=rng(21), i;
    for(i=0;i<N*N;i++) ph.push({p:R()*6.28,q:R()*6.28,a:R()*6.28,wx:0,wy:0});
    var lp = k.loop(function(dt,t){ ph.forEach(function(o){ o.wx+=(R()-0.5)*dt*60; o.wy+=(R()-0.5)*dt*60; o.wx*=0.97; o.wy*=0.97; }); k.redraw(); });
    function stateOf(tm,tb,t){ if(t<tm) return "s"; if(tb!==null&&t>=tb) return "g"; return "l"; }
    function panel(x0,w,kind,Tc,tm,tb,st,t){
      var g=c.ctx, y0=36, h=c.H-76; rr(c,x0,y0,w,h,"#fbfcfe","#b8c2d0",1.5,8);
      var sp=Math.min(w/(N+0.5),(h)/(N+0.5),38);
      var Tk=Tc+273.15, A=st==="s"?(0.8+3.2*Math.min(1,Tk/(tm+273.15))):(st==="l"?9:16);
      ph.forEach(function(o,idx){ var gx=idx%N, gy=Math.floor(idx/N), cx=x0+w/2+(gx-(N-1)/2)*sp, cy=y0+h/2+(gy-(N-1)/2)*sp+(st==="g"?0:(st==="l"?h*0.12:0));
        if(st!=="s"){ cx+=o.wx*(st==="g"?3:1.2); cy+=o.wy*(st==="g"?3:1.2); cx=Math.max(x0+10,Math.min(x0+w-10,cx)); cy=Math.max(y0+10,Math.min(y0+h-10,cy)); }
        cx+=A*Math.sin(t*7+o.p)*(st==="s"?1:0.6); cy+=A*Math.cos(t*6+o.q)*(st==="s"?1:0.6);
        if(kind==="ion"){ var pos=(gx+gy)%2===0; circ(c,cx,cy,pos?sp*0.27:sp*0.37,pos?"#7ea6e6":"#6fcf9a","#fff",1); T(c,pos?"+":"−",cx,cy,{size:12,color:"#fff"}); }
        else { var d=sp*0.2, ca=Math.cos(o.a+(st==="s"?0:t*1.4)), sa=Math.sin(o.a+(st==="s"?0:t*1.4)); D.line(c,cx-ca*d,cy-sa*d,cx+ca*d,cy+sa*d,"#555",2); circ(c,cx-ca*d,cy-sa*d,sp*0.18,"#e6a75a","#fff",1); circ(c,cx+ca*d,cy+sa*d,sp*0.18,"#e6a75a","#fff",1); } });
    }
    k.draw(function(){
      c.clear(); var W=c.W, t=Date.now()/1000, Tc=tp.value, m=MSUB[ms.value], half=(W-30)/2;
      var s1=stateOf(801,1413,Tc), s2=stateOf(m.tm,m.tb,Tc);
      D.label(c,"Sel NaCl : ions",10+half/2,16,{size:12,color:P.acc}); D.label(c,m.lab,20+half+half/2,16,{size:12,color:P.amber}); var STC={s:P.acc,l:P.teal,g:P.red}, STN={s:"solide",l:"liquide",g:"gaz"}; D.label(c,STN[s1]+" · "+F(Tc,0)+" °C",10+half/2,c.H-30,{size:11,color:STC[s1]}); D.label(c,STN[s2]+" · "+F(Tc,0)+" °C",20+half+half/2,c.H-30,{size:11,color:STC[s2]});
      panel(10,half,"ion",Tc,801,1413,s1,t); panel(20+half,half,"mol",Tc,m.tm,m.tb,s2,t);
      T(c,"forces fortes (+ et −)",10+half/2,c.H-10,{size:11.5,color:P.grey}); T(c,"forces faibles",20+half+half/2,c.H-10,{size:11.5,color:P.grey});
      var nm={s:"solide",l:"liquide",g:"gaz"};
      ro.set(0,"fusion à 801 °C"); ro.set(1,nm[s1]); ro.set(2,"fusion à "+(ms.value==="suc"?"≈ 186 °C (décomposition)":m.tm+" °C")); ro.set(3,ms.value==="suc"&&s2==="l"?"liquide brun (caramel)":nm[s2]);
      var msg;
      if(Tc<m.tm) msg="Les deux sont solides : les particules vibrent sur place. Plus T monte, plus la vibration est grande.";
      else if(s1==="s") msg="Le solide moléculaire a fondu à "+(ms.value==="suc"?"≈ 186":m.tm)+" °C, mais le sel est toujours solide : il faut beaucoup plus d'énergie pour séparer des ions fortement attirés. Continue jusqu'à 801 °C.";
      else msg="À partir de 801 °C, le réseau d'ions s'effondre : le sel est liquide.";
      nt.set(msg,"");
    });
    lp.play();
  }
});
})();
