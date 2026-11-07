/* Chapitre 4 · Tableau périodique : métaux et non-métaux */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

/* Z : symbole, nom, masse, électronégativité, rayon (pm), état à 20 °C, catégorie, période, groupe */
var E = [null,
 ["H","hydrogène",1.01,2.20,25,"g","nm",1,1],["He","hélium",4.00,null,31,"g","nob",1,18],
 ["Li","lithium",6.94,0.98,145,"s","alc",2,1],["Be","béryllium",9.01,1.57,105,"s","ate",2,2],["B","bore",10.81,2.04,85,"s","meta",2,13],["C","carbone",12.01,2.55,70,"s","nm",2,14],["N","azote",14.01,3.04,65,"g","nm",2,15],["O","oxygène",16.00,3.44,60,"g","nm",2,16],["F","fluor",19.00,3.98,50,"g","hal",2,17],["Ne","néon",20.18,null,38,"g","nob",2,18],
 ["Na","sodium",22.99,0.93,180,"s","alc",3,1],["Mg","magnésium",24.31,1.31,150,"s","ate",3,2],["Al","aluminium",26.98,1.61,125,"s","mp",3,13],["Si","silicium",28.09,1.90,110,"s","meta",3,14],["P","phosphore",30.97,2.19,100,"s","nm",3,15],["S","soufre",32.06,2.58,100,"s","nm",3,16],["Cl","chlore",35.45,3.16,100,"g","hal",3,17],["Ar","argon",39.95,null,71,"g","nob",3,18],
 ["K","potassium",39.10,0.82,220,"s","alc",4,1],["Ca","calcium",40.08,1.00,180,"s","ate",4,2],
 ["Sc","scandium",44.96,1.36,160,"s","tra",4,3],["Ti","titane",47.87,1.54,140,"s","tra",4,4],["V","vanadium",50.94,1.63,135,"s","tra",4,5],["Cr","chrome",52.00,1.66,140,"s","tra",4,6],["Mn","manganèse",54.94,1.55,140,"s","tra",4,7],["Fe","fer",55.85,1.83,140,"s","tra",4,8],["Co","cobalt",58.93,1.88,135,"s","tra",4,9],["Ni","nickel",58.69,1.91,135,"s","tra",4,10],["Cu","cuivre",63.55,1.90,135,"s","tra",4,11],["Zn","zinc",65.38,1.65,135,"s","tra",4,12],
 ["Ga","gallium",69.72,1.81,130,"s","mp",4,13],["Ge","germanium",72.63,2.01,125,"s","meta",4,14],["As","arsenic",74.92,2.18,115,"s","meta",4,15],["Se","sélénium",78.97,2.55,115,"s","nm",4,16],["Br","brome",79.90,2.96,115,"l","hal",4,17],["Kr","krypton",83.80,null,88,"g","nob",4,18]
];
var CAT = {alc:["Alcalins","#e76f51"], ate:["Alcalino-terreux","#f4a261"], tra:["Métaux de transition","#a3c4bc"], mp:["Autres métaux","#8ab6d6"], meta:["Métalloïdes","#d4a5c9"], nm:["Autres non-métaux","#e9d985"], hal:["Halogènes","#2a9d8f"], nob:["Gaz nobles","#9d8cd6"]};
var MET = {alc:1,ate:1,tra:1,mp:1};
var STATE = {s:["Solide","#b8c4d4"], l:["Liquide","#2a9d8f"], g:["Gaz","#f4a261"]};
function valence(z){ var e=E[z], g=e[8]; if(g>=3&&g<=12) return null; if(z===2) return 2; return g<=2?g:g-10; }
function metalType(z){ var c=E[z][6]; return MET[c]?"Métal":(c==="meta"?"Métalloïde":"Non-métal"); }
function lerp(a,b,t){ return Math.round(a+(b-a)*t); }
function seqColor(t){ t=Math.max(0,Math.min(1,t)); var c0=[238,243,251], c1=[30,63,143]; return "rgb("+lerp(c0[0],c1[0],t)+","+lerp(c0[1],c1[1],t)+","+lerp(c0[2],c1[2],t)+")"; }

/* ---------- 1 · Tableau interactif ---------- */
var PROP = {
  cat:"Famille chimique", met:"Métal / non-métal", etat:"État à 20 °C", val:"Électrons de valence", en:"Électronégativité", ray:"Rayon atomique (pm)", mas:"Masse atomique (u)"
};
var TREND = {
  cat:"Les familles forment des colonnes (alcalins : groupe 1 ; halogènes : groupe 17 ; gaz nobles : groupe 18) : elles ont des propriétés voisines.",
  met:"Les métaux sont à gauche et au centre, les non-métaux à droite et en haut ; les métalloïdes (B, Si, Ge, As) forment un « escalier » entre les deux.",
  etat:"À 20 °C : presque tous les métaux sont solides ; les gaz sont des non-métaux ; le brome est le seul non-métal liquide (et le mercure, plus loin, le seul métal liquide).",
  val:"Le nombre d'électrons de valence est égal au numéro du groupe pour les groupes 1 et 2, puis au numéro du groupe moins 10 pour les groupes 13 à 18 (He : 2). Pour les métaux de transition, il n'y a pas de règle simple à ce niveau.",
  en:"L'électronégativité augmente de gauche à droite dans une période et de bas en haut dans un groupe : le fluor est le plus électronégatif. Les gaz nobles n'ont pas de valeur (grisés).",
  ray:"Le rayon atomique diminue de gauche à droite dans une période et augmente de haut en bas dans un groupe (valeurs approximatives, méthodes de mesure différentes pour les gaz nobles).",
  mas:"La masse atomique augmente avec Z (tableau classé par numéro atomique, pas par masse : le tableau complet a de rares inversions, comme Ar et K)."
};
SFA.sim({
  id:"c3-c04-tableau", ch:"c04", tag:"Classique",
  titre:"Tableau périodique interactif : colorie par propriété",
  resume:"Colorie les 36 premiers éléments selon la famille, l'état, l'électronégativité, le rayon… et repère les tendances.",
  but:"Choisis une propriété à colorier, puis clique sur un élément (ou utilise le curseur). Repère les tendances le long d'une période et dans un groupe.",
  aRetenir:"Le tableau classe les éléments par numéro atomique Z croissant. Les colonnes (groupes) rassemblent des éléments de propriétés voisines et de même nombre d'électrons de valence ; les lignes (périodes) correspondent au remplissage des couches. Les métaux sont à gauche, les non-métaux à droite.",
  piege:"Le tableau n'est pas un classement par masse (c'est par Z). Ne confonds pas période (ligne) et groupe (colonne). Seuls les 36 premiers éléments sont représentés ici.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:0.62});
    var pr = k.select("Colorier selon", Object.keys(PROP).map(function(i){return [i,PROP[i]];}), "cat");
    var zs = k.slider("Élément choisi (Z)", 1, 36, 1, 11, "");
    var ro = k.readouts(["Élément","Période · groupe","Famille","Type","Valence","État (20 °C)"]);
    var nt = k.note("","");
    function geom(){ var W=c.W, cs=Math.min((W-12)/18,46); return {cs:cs, x0:(W-18*cs)/2, y0:8}; }
    c.pointer(function(type,pt){ if(type==="up"||type==="move") return; var g=geom(), col=Math.floor((pt.x-g.x0)/g.cs)+1, row=Math.floor((pt.y-g.y0)/g.cs)+1;
      for(var z=1;z<=36;z++){ if(E[z][8]===col&&E[z][7]===row){ zs.set(z); k.redraw(); } } });
    k.draw(function(){
      c.clear(); var g=geom(), cs=g.cs, W=c.W, p=pr.value, Z=zs.value, ctx=c.ctx;
      function range(idx){ var mn=1e9,mx=-1e9; for(var z=1;z<=36;z++){ var v=E[z][idx]; if(v!==null){ mn=Math.min(mn,v); mx=Math.max(mx,v);} } return [mn,mx]; }
      var rg = p==="en"?range(3):(p==="ray"?range(4):(p==="mas"?range(2):[1,8]));
      for(var z=1;z<=36;z++){ var e=E[z], x=g.x0+(e[8]-1)*cs, y=g.y0+(e[7]-1)*cs, fill, dark=false;
        if(p==="cat") fill=CAT[e[6]][1];
        else if(p==="met"){ var mt=metalType(z); fill=mt==="Métal"?"#8ab6d6":(mt==="Métalloïde"?"#d4a5c9":"#e9d985"); }
        else if(p==="etat") fill=STATE[e[5]][1];
        else { var v = p==="val"?valence(z):(p==="en"?e[3]:(p==="ray"?e[4]:e[2]));
          if(v===null||v===undefined) fill="#e6e9ee"; else { var t=(v-rg[0])/(rg[1]-rg[0]); fill=seqColor(t); dark=t>0.55; } }
        ctx.fillStyle=fill; ctx.fillRect(x+1,y+1,cs-2,cs-2);
        T(c,e[0],x+cs/2,y+cs/2,{size:Math.min(15,cs*0.5),color:dark?"#fff":"#0f1b2d"});
        if(z===Z){ ctx.strokeStyle=P.red; ctx.lineWidth=2.5; ctx.strokeRect(x+1.5,y+1.5,cs-3,cs-3); } }
      /* fiche de l'élément choisi, dans le vide du tableau */
      var eZ=E[Z], kx=g.x0+2.2*cs, kw=9.6*cs, ky=g.y0+0.1*cs, kh=3*cs-4, big=Math.min(kh*0.62,40);
      D.panel(c,kx,ky,kw,kh,{shadow:false,fill:"#fff",stroke:CAT[eZ[6]][1]});
      ctx.fillStyle=CAT[eZ[6]][1]; ctx.fillRect(kx+1,ky+10,4,kh-20);
      T(c,eZ[0],kx+kw*0.22,ky+kh*0.5,{size:big,color:P.mat,math:true});
      T(c,String(Z),kx+10,ky+11,{size:11,color:P.grey,align:"left"});
      T(c,eZ[1],kx+kw*0.42,ky+kh*0.3,{size:Math.max(11,Math.min(16,cs*0.5)),color:P.ink,align:"left"});
      T(c,F(eZ[2],2)+" u",kx+kw*0.42,ky+kh*0.56,{size:Math.max(11,cs*0.45),color:P.grey,align:"left"});
      T(c,(cs<26?"P":"période ")+eZ[7]+" · "+(cs<26?"G":"groupe ")+eZ[8],kx+kw*0.42,ky+kh*0.8,{size:Math.max(10,Math.min(13,cs*0.42)),color:P.grey,align:"left"});
      // légende
      var ly=g.y0+4*cs+14;
      if(p==="cat"||p==="met"||p==="etat"){ var items = p==="cat"?Object.keys(CAT).map(function(i){return CAT[i];}):(p==="met"?[["Métal","#8ab6d6"],["Métalloïde","#d4a5c9"],["Non-métal","#e9d985"]]:Object.keys(STATE).map(function(i){return STATE[i];}));
        var lx=g.x0, yy=ly; ctx.font="600 12px Mulish, system-ui"; ctx.textAlign="left"; ctx.textBaseline="middle";
        items.forEach(function(it){ var w=ctx.measureText(it[0]).width+26; if(lx+w>W-6){lx=g.x0;yy+=20;} ctx.fillStyle=it[1]; ctx.fillRect(lx,yy-6,12,12); ctx.fillStyle="#0f1b2d"; ctx.fillText(it[0],lx+17,yy); lx+=w+8; }); }
      else { var bw=Math.min(260,W-40); for(var i=0;i<bw;i++){ ctx.fillStyle=seqColor(i/bw); ctx.fillRect(g.x0+i,ly-6,1,12); }
        var lo=rg[0], hi=rg[1]; T(c,F(lo,p==="en"?2:(p==="mas"?0:0)),g.x0,ly+16,{size:12,color:P.grey,align:"left"}); T(c,F(hi,p==="en"?2:0),g.x0+bw,ly+16,{size:12,color:P.grey,align:"right"}); T(c,"gris : pas de valeur",g.x0+bw/2,ly+16,{size:12,color:P.grey}); }
      var e=E[Z];
      ro.set(0,e[0]+" · "+e[1]+" (Z = "+Z+")"); ro.set(1,"période "+e[7]+" · groupe "+e[8]); ro.set(2,CAT[e[6]][0]); ro.set(3,metalType(Z));
      var v=valence(Z); ro.set(4,v===null?"variable":String(v)); ro.set(5,STATE[e[5]][0]);
      nt.set("<b>Tendance :</b> "+TREND[p]+(p==="en"?"  <b>"+e[1]+"</b> : "+(e[3]===null?"pas de valeur (gaz noble)":F(e[3],2))+".":"")+(p==="ray"?"  <b>"+e[1]+"</b> : ≈ "+e[4]+" pm.":"")+(p==="mas"?"  <b>"+e[1]+"</b> : "+F(e[2],2)+" u.":""),"");
    });
  }
});

/* ---------- 2 · Les alcalins dans l'eau ---------- */
var ALC = {
  li:{n:"Lithium", s:"Li", r:145, en:0.98, rho:0.53, rate:1, per:2, txt:"Bulles régulières de dihydrogène ; le morceau flotte et réagit calmement sans fondre."},
  na:{n:"Sodium", s:"Na", r:180, en:0.93, rho:0.97, rate:2, per:3, txt:"Le morceau fond en une boule qui court à la surface en sifflant, avec un fort dégagement de dihydrogène."},
  k:{n:"Potassium", s:"K", r:220, en:0.82, rho:0.86, rate:3, per:4, txt:"Réaction très vive : le dihydrogène s'enflamme spontanément avec une flamme lilas."},
  rb:{n:"Rubidium", s:"Rb", r:235, en:0.82, rho:1.53, rate:4, per:5, txt:"Réaction violente, quasi explosive ; le morceau s'enflamme immédiatement."},
  cs:{n:"Césium", s:"Cs", r:260, en:0.79, rho:1.93, rate:5, per:6, txt:"Réaction explosive : elle peut briser le récipient. Démonstration impossible en classe."}
};
SFA.sim({
  id:"c3-c04-alcalins", ch:"c04", tag:"Famille",
  titre:"Les alcalins dans l'eau : plus on descend, plus c'est vif",
  resume:"Lithium, sodium, potassium, rubidium, césium : même famille, mêmes réactions, mais intensité croissante.",
  but:"Choisis un alcalin, règle la taille du morceau et lance la réaction (au ralenti, en simulation). Compare l'intensité, le rayon et l'électronégativité le long de la colonne.",
  aRetenir:"Les alcalins (groupe 1) ont 1 électron de valence et réagissent tous avec l'eau selon 2 M + 2 H₂O → 2 MOH + H₂ : ils forment du dihydrogène et une solution basique (la phénolphtaléine rose le montre). Plus on descend dans la colonne, plus le rayon augmente, plus l'électron de valence est facile à perdre et plus la réaction est violente.",
  piege:"Même famille ne veut pas dire même intensité. Et ne reproduis jamais cette expérience : elle est réservée à l'enseignant, en petites quantités, avec protections (lunettes, écran). Sur ce graphe, l'« intensité » est une échelle qualitative de 1 à 5.",
  build:function(k,S){
    var c = k.canvas(300);
    var el = k.select("Alcalin", Object.keys(ALC).map(function(i){return [i,ALC[i].n];}), "na", function(){ restart(); });
    var sz = k.slider("Taille du morceau", 0.3, 1, 0.1, 0.6, "(relative)", function(){ restart(); });
    var ph = k.toggle("Ajouter de la phénolphtaléine", true);
    var ro = k.readouts(["Électrons de valence","Rayon atomique","Électronégativité","Intensité (1 à 5)"]);
    var nt = k.note("","");
    var R=rng(9), t=0, parts=[];
    function restart(){ t=0; parts=[]; if(!lp.running) lp.play(); }
    var lp = k.loop(function(dt){ var a=ALC[el.value]; t+=dt; var dur=Math.max(2.5,5*sz.value*(6-a.rate)/3);
      if(t<dur){ var n=Math.ceil(a.rate*0.5); for(var i=0;i<n;i++) parts.push({x:R(),y:0,v:20+R()*40,life:1}); }
      parts.forEach(function(p){ p.y+=p.v*dt; p.life-=dt*1.5; }); parts=parts.filter(function(p){ return p.life>0; });
      if(t>dur+3){ lp.pause(); } k.redraw(); });
    k.button("Relancer la réaction", function(){ restart(); }, true);
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx,a=ALC[el.value], dur=Math.max(2.5,5*sz.value*(6-a.rate)/3), prog=Math.min(1,t/dur);
      var bx=W*0.15, bw=W*0.7, by=H*0.28, bh=H*0.62;
      var pink=ph.value?Math.min(1,t/dur):0;
      CH.bg(c,H-18);
      var wcol=ph.value?"rgb("+Math.round(111+(230-111)*pink)+","+Math.round(177+(70-177)*pink)+","+Math.round(230+(150-230)*pink)+")":"#6fb1e6";
      CH.glass(c,bx,by,bw,bh,0.8,wcol,{ticks:0,round:10});
      var surf=by+bh*0.2, r0=10+22*sz.value, r=r0*Math.pow(1-prog,1/3);
      var px=bx+bw/2+(a.rate>=2?Math.sin(t*3.1+el.value.length)*bw*0.22*Math.min(1,t):0), py=a.rho<1?surf-r*0.5:surf+bh*0.3+ (a.rho>1?Math.min(1,t*2)*bh*0.3:0);
      if(prog<1) CH.ball(c,px,py,Math.max(r,1),a.rho<1?"#b9c3d1":"#9aa6b6","",{lw:1.2,stroke:"#7b8592"});
      parts.forEach(function(p){ var x=px+(p.x-0.5)*(30+r*2), y=py-4-p.y*0.8; if(y>by-60&&x>bx&&x<bx+bw){ circ(c,x,y,2.6,"rgba(255,255,255,"+p.life.toFixed(2)+")","#5f8fbf",1); } });
      if(a.rate>=3&&prog<1){ var fl=a.rate>=4?36:20, sc=(a.rate-2); g.save(); g.fillStyle=a.rate>=4?"rgba(255,190,60,0.85)":"rgba(160,110,220,0.8)"; g.beginPath(); g.moveTo(px-10-sc*3,surf-r*0.4); g.quadraticCurveTo(px,surf-fl*(1+0.4*Math.sin(t*25)),px+10+sc*3,surf-r*0.4); g.closePath(); g.fill(); g.restore(); }
      if(a.rate===5&&t>0.2&&t<0.6) T(c,"EXPLOSION (simulée)",W/2,H*0.12,{size:15,color:P.red});
      D.label(c,a.s+" dans l'eau"+(ph.value?" + phénolphtaléine":""),W/2,16,{size:12,color:P.mat});
      D.label(c,"intensité : "+"●".repeat(a.rate)+"○".repeat(5-a.rate),W/2,H-6,{size:11,color:a.rate>=4?P.red:P.amber,base:"bottom"});
      ro.set(0,"1"); ro.set(1,a.r+" pm"); ro.set(2,F(a.en,2)); ro.set(3,String(a.rate)+" / 5");
      nt.set("<b>"+a.n+"</b> (période "+a.per+") : "+a.txt+" Équation : 2 "+a.s+" + 2 H₂O → 2 "+a.s+"OH + H₂."+(ph.value?" La solution rosit : elle devient basique.":""),"");
    });
    lp.play();
  }
});

/* ---------- 3 · Mendeleïev prédit un élément ---------- */
var MEN = {
  ge:{n:"Case vide sous le silicium (éka-silicium)", up:["Si",28.09,2.33,"SiO₂"], dn:["Sn",118.71,7.31,"SnO₂"], real:["Ge",72.63,5.32,"GeO₂"], pm:72, pd:5.5, grp:"groupe 14", ox:"XO₂"},
  ga:{n:"Case vide sous l'aluminium (éka-aluminium)", up:["Al",26.98,2.70,"Al₂O₃"], dn:["In",114.82,7.31,"In₂O₃"], real:["Ga",69.72,5.91,"Ga₂O₃"], pm:68, pd:5.9, grp:"groupe 13", ox:"X₂O₃"}
};
SFA.sim({
  id:"c3-c04-mendeleiev", ch:"c04", tag:"Histoire",
  titre:"Mendeleïev prédit un élément encore inconnu",
  resume:"Un trou dans la colonne : estime sa masse et sa densité à partir de ses voisins, puis compare avec l'élément découvert.",
  but:"Choisis un trou du tableau de 1869. Déplace la masse atomique supposée : la densité prévue par interpolation s'affiche. Révèle ensuite l'élément réel.",
  aRetenir:"Mendeleïev a classé les éléments par masse croissante en plaçant dans la même colonne ceux de propriétés voisines, quitte à laisser des trous. En comparant les voisins, il a prédit la masse, la densité et la formule de l'oxyde d'éléments inconnus : ils ont été découverts ensuite (gallium en 1875, germanium en 1886).",
  piege:"L'interpolation linéaire ne donne qu'un ordre de grandeur : la densité réelle diffère de 10 à 20 % (environ 10 % pour le germanium, 16 % pour le gallium). Mendeleïev utilisait aussi les voisins de la même ligne. La formule de l'oxyde, elle, est exacte parce que la colonne partage le nombre d'électrons de valence.",
  build:function(k,S){
    var c = k.canvas(330);
    var cs = k.select("Trou à combler", Object.keys(MEN).map(function(i){return [i,MEN[i].n];}), "ge", function(){ ms.set(Math.round((MEN[cs.value].up[1]+MEN[cs.value].dn[1])/2)); });
    var ms = k.slider("Masse atomique supposée", 30, 115, 1, 73, "u");
    var rv = k.toggle("Révéler l'élément réel", false);
    var ro = k.readouts(["Masse supposée","Densité interpolée","Formule de l'oxyde prévue","Densité réelle"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var m=MEN[cs.value], up=m.up, dn=m.dn, M=ms.value;
      var ax=D.axes(c,{x0:0,x1:130,y0:0,y1:9,xl:"masse atomique (u)",yl:"densité (g/cm³)",stepX:20,stepY:2,l:46});
      D.line(c,ax.X(up[1]),ax.Y(up[2]),ax.X(dn[1]),ax.Y(dn[2]),P.grey,2,[6,4]);
      [up,dn].forEach(function(e){ D.dot(c,ax.X(e[1]),ax.Y(e[2]),6,P.acc); T(c,e[0],ax.X(e[1]),ax.Y(e[2])-14,{size:13,color:P.acc}); });
      var cardx=ax.L+14, cardy=ax.T+6, cw=Math.min(118,c.W*0.3);
      D.panel(c,cardx,cardy,cw,86,{shadow:false});
      [[up[0]+" · "+F(up[1],1)+" u",P.acc],["? · "+F(M,0)+" u",P.red],[dn[0]+" · "+F(dn[1],1)+" u",P.acc]].forEach(function(r,i){ D.rrect(c,cardx+8,cardy+6+i*26,cw-16,22,5); c.ctx.fillStyle=D.tint(r[1],0.13); c.ctx.fill(); T(c,r[0],cardx+cw/2,cardy+17+i*26,{size:11.5,color:r[1]}); });
      var inM=Math.max(up[1],Math.min(dn[1],M)), rho=up[2]+(inM-up[1])/(dn[1]-up[1])*(dn[2]-up[2]);
      D.dot(c,ax.X(inM),ax.Y(rho),7,P.red); T(c,"?",ax.X(inM),ax.Y(rho)-16,{size:15,color:P.red});
      if(rv.value){ D.dot(c,ax.X(m.real[1]),ax.Y(m.real[2]),7,P.green); T(c,m.real[0],ax.X(m.real[1]),ax.Y(m.real[2])+16,{size:13,color:P.green}); }
      ro.set(0,F(M,0)+" u"); ro.set(1,F(rho,2)+" g/cm³"); ro.set(2,m.grp+" : "+up[3]+" et "+dn[3]+" → "+m.ox); ro.set(3,rv.value?F(m.real[2],2)+" g/cm³ ("+m.real[0]+")":"cachée");
      var out = M<up[1]||M>dn[1];
      nt.set((out?"La masse supposée est en dehors de l'intervalle des voisins ("+up[0]+" : "+F(up[1],1)+" u ; "+dn[0]+" : "+F(dn[1],1)+" u) : la valeur est limitée aux voisins. ":"")+(rv.value?"<b>"+m.real[0]+"</b> : masse "+F(m.real[1],2)+" u, densité "+F(m.real[2],2)+" g/cm³ ; prédiction de Mendeleïev : ≈ "+m.pm+" u et ≈ "+F(m.pd,1)+" g/cm³. Ton interpolation à "+F(M,0)+" u donne "+F(rho,2)+" g/cm³ (écart "+F((rho-m.real[2])/m.real[2]*100,0)+" %). L'oxyde "+m.real[3]+" suit bien la formule prévue.":"Les voisins verticaux ont des propriétés semblables : sois prudent, estime la masse au milieu des deux voisins (≈ "+F((up[1]+dn[1])/2,0)+" u) puis révèle l'élément."),"");
    });
  }
});

/* ---------- 4 · Élément mystère ---------- */
var MYS = [
  {z:11, cl:["À 20 °C, c'est un solide mou qu'on coupe au couteau et qu'on conserve dans l'huile.","Fraîchement coupé, il brille puis ternit très vite à l'air.","Plongé dans l'eau, il réagit vivement : dihydrogène et solution basique.","Il a 1 électron de valence.","Il se trouve en 3e période."]},
  {z:17, cl:["Gaz jaune-vert à 20 °C, d'odeur piquante et toxique.","Il sert à désinfecter l'eau des piscines.","C'est un non-métal de la famille des halogènes.","Il a 7 électrons de valence.","Il se trouve en 3e période."]},
  {z:26, cl:["Métal gris, solide à 20 °C, attiré par un aimant.","Il rouille à l'air humide.","Il se trouve au centre du tableau, parmi les métaux de transition.","Sa masse atomique est voisine de 56 u.","Il se trouve en 4e période."]},
  {z:10, cl:["Gaz incolore à 20 °C.","Il ne forme pratiquement aucun composé chimique.","Il remplit les enseignes lumineuses rouge-orangé.","Il a 8 électrons de valence.","Il se trouve en 2e période."]},
  {z:13, cl:["Solide gris argenté, très léger (densité 2,7), non attiré par un aimant.","Bon conducteur, utilisé pour les canettes et les feuilles de cuisine.","C'est un métal, ni alcalin ni de transition.","Il a 3 électrons de valence.","Il se trouve en 3e période."]},
  {z:35, cl:["C'est le seul non-métal liquide à 20 °C : liquide rouge-brun.","Il dégage des vapeurs rouges toxiques et irritantes.","Il appartient à la famille des halogènes.","Il a 7 électrons de valence.","Il se trouve en 4e période."]},
  {z:20, cl:["Métal gris argenté, solide, un peu plus dur que le sodium.","Il réagit avec l'eau en dégageant du dihydrogène, moins vivement que le sodium.","Il est présent dans les os, les dents et le calcaire.","Il a 2 électrons de valence.","Il se trouve en 4e période."]},
  {z:14, cl:["Solide gris bleuté, brillant mais cassant.","C'est un métalloïde : il conduit mal l'électricité sans être un isolant parfait.","Il sert à fabriquer les puces électroniques.","Il a 4 électrons de valence.","Il se trouve en 3e période."]}
];
SFA.sim({
  id:"c3-c04-mystere", ch:"c04", tag:"Jeu",
  titre:"Élément mystère : trouve-le avec le moins d'indices",
  resume:"Chaque indice rapproche du but : propriétés physiques, famille, électrons de valence, période. Clique sur le tableau pour répondre.",
  but:"Révèle les indices un par un, puis clique sur l'élément que tu penses être le bon. Moins tu utilises d'indices et d'essais, plus ton score est élevé.",
  aRetenir:"La position dans le tableau résume les propriétés : la colonne (groupe) donne la famille et le nombre d'électrons de valence, la ligne (période) donne le nombre de couches. Un élément se trouve en croisant des indices physiques et la position.",
  piege:"Un seul indice ne suffit presque jamais : « solide gris » convient à des dizaines de métaux. Le score diminue avec chaque indice et chaque erreur : réfléchis avant de cliquer.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:0.36});
    var ro = k.readouts(["Indices utilisés","Essais ratés","Score"]);
    var cl = k.note("","");
    var nt = k.note("","");
    var cur=-1, shown=1, miss=0, solved=false, last={}, tried=[];
    function newGame(){ var n; do{ n=Math.floor(Math.random()*MYS.length); } while(n===cur&&MYS.length>1); cur=n; shown=1; miss=0; solved=false; tried=[]; nt.set("Clique sur le tableau pour proposer un élément.",""); }
    k.button("Indice suivant", function(){ if(!solved&&shown<5) shown++; }, true);
    k.button("Nouveau mystère", function(){ newGame(); });
    k.button("Abandonner (révéler)", function(){ solved=true; shown=5; nt.set("C'était <b>"+E[MYS[cur].z][1]+"</b> ("+E[MYS[cur].z][0]+", Z = "+MYS[cur].z+").","warn"); });
    function geom(){ var W=c.W, cs=Math.min((W-12)/18,40); return {cs:cs,x0:(W-18*cs)/2,y0:8}; }
    c.pointer(function(type,pt){ if(type!=="down"||solved) return; var g=geom(), col=Math.floor((pt.x-g.x0)/g.cs)+1, row=Math.floor((pt.y-g.y0)/g.cs)+1;
      for(var z=1;z<=36;z++){ if(E[z][8]===col&&E[z][7]===row){
        if(tried.indexOf(z)>=0) return; tried.push(z);
        var m=MYS[cur].z; if(z===m){ solved=true; var pts=Math.max(0,100-15*(shown-1)-10*miss); nt.set("<b>Bravo !</b> C'est bien le "+E[m][1]+" ("+E[m][0]+"). Score : "+pts+" / 100.","ok"); }
        else { miss++; var hint=[]; if(E[z][7]===E[m][7]) hint.push("même période"); if(E[z][8]===E[m][8]) hint.push("même groupe"); if(E[z][6]===E[m][6]) hint.push("même famille");
          nt.set("Ce n'est pas le "+E[z][1]+"."+(hint.length?" Mais ils sont dans le/la "+hint.join(" et ")+".":" Relis les indices."),"warn"); }
        k.redraw(); } } });
    newGame();
    k.draw(function(){
      c.clear(); var g=geom(), cs=g.cs, ctx=c.ctx, m=MYS[cur];
      for(var z=1;z<=36;z++){ var e=E[z], x=g.x0+(e[8]-1)*cs, y=g.y0+(e[7]-1)*cs, bad=tried.indexOf(z)>=0&&z!==m.z, good=solved&&z===m.z;
        ctx.fillStyle=good?"#2e6b55":(bad?"#f1c9c5":D.tint(CAT[e[6]][1],0.22)); ctx.beginPath(); D.rrect(c,x+1,y+1,cs-2,cs-2,4); ctx.fill();
        T(c,e[0],x+cs/2,y+cs/2,{size:Math.min(15,cs*0.5),color:good?"#fff":"#0f1b2d"}); }
      T(c,"Clique sur l'élément que tu proposes",c.W/2,g.y0+4*cs+22,{size:13,color:P.grey});
      cl.set("<b>Indices :</b><ol style='margin:4px 0 0 18px;padding:0'>"+m.cl.slice(0,shown).map(function(x){return "<li>"+x+"</li>";}).join("")+"</ol>","");
      ro.set(0,shown+" / 5"); ro.set(1,String(miss)); ro.set(2,solved&&tried.indexOf(m.z)>=0?Math.max(0,100-15*(shown-1)-10*miss)+" / 100":"—");
    });
  }
});
})();
