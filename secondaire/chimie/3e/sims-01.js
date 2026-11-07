/* Chapitre 1 · Mélanges, corps purs et techniques de séparation */
/* ---------- aides graphiques partagées du cours de chimie 3e (chargées avec le chapitre 1) ---------- */
(function(){
var D = SFA.draw, P = D.palette;
var CH = window.CH = {};
CH.lite = function(col,t){ var m=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col); if(!m) return col; var v=[1,2,3].map(function(i){ var x=parseInt(m[i],16); return Math.round(x+(255-x)*t); }); return "rgb("+v.join(",")+")"; };
CH.rng = function(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; };
CH.rr = function(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r==null?8:r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); };
CH.circ = function(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} };
/* fond de scène : dégradé doux + plan de paillasse optionnel */
CH.bg = function(c, bench){ var g=c.ctx, gr=g.createLinearGradient(0,0,0,c.H); gr.addColorStop(0,"#f7f9fd"); gr.addColorStop(1,"#eaf0f8"); g.fillStyle=gr; g.fillRect(0,0,c.W,c.H);
  if(bench){ var y=bench; g.fillStyle="#d9e0ea"; g.fillRect(0,y,c.W,c.H-y); g.fillStyle="#c5cedb"; g.fillRect(0,y,c.W,2); } };
/* sphère ombrée (atome, ion, molécule) */
CH.ball = function(c,x,y,r,col,txt,o){ o=o||{}; var g=c.ctx; g.save(); var gr=g.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r); gr.addColorStop(0,CH.lite(col,.5)); gr.addColorStop(1,col);
  g.beginPath(); g.arc(x,y,r,0,6.2832); g.fillStyle=gr; g.fill(); g.lineWidth=o.lw||1.2; g.strokeStyle=o.stroke||"rgba(255,255,255,.9)"; g.stroke(); g.restore();
  if(txt!=null&&txt!=="") D.text(c,txt,x,y+.5,{size:o.size||Math.max(11,Math.min(16,r*.9)),color:o.tc||"#fff",math:o.math,halo:o.halo}); };
/* bécher / éprouvette : liquide à niveau lvl (0-1), graduations */
CH.glass = function(c,x,y,w,h,lvl,col,o){ o=o||{}; var g=c.ctx, tw=o.taper||0; g.save();
  function path(){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+tw,y+h-(o.round||6)); g.quadraticCurveTo(x+tw,y+h,x+tw+(o.round||6),y+h); g.lineTo(x+w-tw-(o.round||6),y+h); g.quadraticCurveTo(x+w-tw,y+h,x+w-tw,y+h-(o.round||6)); g.lineTo(x+w,y); }
  if(lvl>0){ g.save(); path(); g.lineTo(x,y); g.closePath(); g.clip(); var ly=y+h*(1-lvl); var gr=g.createLinearGradient(0,ly,0,y+h); gr.addColorStop(0,col); gr.addColorStop(1,CH.lite(col,.45)); g.fillStyle=gr; g.fillRect(x-2,ly,w+4,h); g.fillStyle="rgba(255,255,255,.35)"; g.fillRect(x-2,ly,w+4,2); g.restore(); }
  path(); g.strokeStyle="#6b7a90"; g.lineWidth=2.4; g.lineCap="round"; g.lineJoin="round"; g.stroke();
  g.beginPath(); g.moveTo(x+5+tw,y+8); g.lineTo(x+5+tw,y+h*.7); g.strokeStyle="rgba(255,255,255,.7)"; g.lineWidth=3; g.stroke();
  if(o.ticks){ for(var i=1;i<=o.ticks;i++){ var ty=y+h-h*i/(o.ticks+1)*.92; D.line(c,x+w-(i%2?10:16),ty,x+w,ty,"#8a95a3",1.2); } }
  g.restore(); };
/* erlenmeyer : x,y = coin haut-gauche de l'encombrement ; lvl = fraction de la hauteur totale remplie de liquide */
CH.flask = function(c,x,y,w,h,lvl,col,o){ o=o||{}; var g=c.ctx, nw=w*.26, nx=x+(w-nw)/2, sy=y+h*.42;
  function path(){ g.beginPath(); g.moveTo(nx-3,y); g.lineTo(nx,y+4); g.lineTo(nx,sy); g.lineTo(x+4,y+h-8); g.quadraticCurveTo(x,y+h,x+12,y+h); g.lineTo(x+w-12,y+h); g.quadraticCurveTo(x+w,y+h,x+w-4,y+h-8); g.lineTo(nx+nw,sy); g.lineTo(nx+nw,y+4); g.lineTo(nx+nw+3,y); }
  g.save();
  if(lvl>0){ g.save(); path(); g.closePath(); g.clip(); var ly=y+h*(1-lvl); var gr=g.createLinearGradient(0,ly,0,y+h); gr.addColorStop(0,col); gr.addColorStop(1,CH.lite(col,.4)); g.fillStyle=gr; g.fillRect(x-2,ly,w+4,h); g.fillStyle="rgba(255,255,255,.4)"; g.fillRect(x-2,ly,w+4,2); g.restore(); }
  path(); g.strokeStyle="#6b7a90"; g.lineWidth=2.4; g.lineJoin="round"; g.lineCap="round"; g.stroke();
  g.beginPath(); g.moveTo(x+w*.2,y+h*.7); g.lineTo(x+w*.3,y+h*.52); g.strokeStyle="rgba(255,255,255,.75)"; g.lineWidth=3; g.stroke(); g.restore(); };
/* balance à plateau avec afficheur : x,y = coin haut-gauche ; renvoie la hauteur du plateau (y du dessus) */
CH.scale = function(c,x,y,w,txt,col){ var g=c.ctx; CH.rr(c,x,y,w,38,"#d3dae4","#6b7a90",2,10); D.line(c,x+w*.08,y,x+w*.92,y,"#8a97a9",5);
  CH.rr(c,x+w*.2,y+8,w*.6,22,"#16212f",null,0,5); D.text(c,txt,x+w/2,y+19.5,{size:14,color:col||"#7cf0a5",mono:true}); return y; };
/* pastille texte avec titre de scène */
CH.title = function(c,s,col){ D.label(c,s,10,14,{align:"left",color:col||P.mat,size:12}); };
/* légende sous la scène */
CH.cap = function(c,s,x,y,col){ D.text(c,s,x==null?c.W/2:x,y==null?c.H-10:y,{size:12,color:col||"#5f6b7a",weight:700}); };
/* bouton dessiné sur le canvas (zone cliquable) : renvoie le rectangle */
CH.chip = function(c,s,x,y,col,on,w){ var g=c.ctx; g.save(); g.font="800 12px Mulish, system-ui"; var ww=w||g.measureText(s).width+22; g.restore();
  CH.rr(c,x,y,ww,28,on?col:"#fff",col,1.6,14); D.text(c,s,x+ww/2,y+14.5,{size:12,color:on?"#fff":col}); return {x:x,y:y,w:ww,h:28}; };
CH.hit = function(r,p){ return p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h; };
/* taille de police adaptée à la largeur (téléphone) */
CH.fs = function(c,a,b){ return c.W<420?a:b; };
})();
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }

/* ---------- 1 · Atelier de séparation ---------- */
var COL = {sable:"#c9a45c", sel:"#9fb4c9", "sel (dissous)":"#9fb4c9", eau:"#6fb1e6", huile:"#e0b832", "éthanol":"#b19cd9", fer:"#555d68"};
function C(n,kind,id,bp){ return {n:n, kind:kind, id:id||"", bp:bp||0}; }
var MIX = {
  a:{t:"Sable + sel de cuisine dissous dans l'eau", make:function(){ return [C("sable","solid"), C("sel (dissous)","diss"), C("eau","liq","aq",100)]; }, hint:"Idée : le sable ne passe pas dans un filtre, le sel dissous oui. Comment récupérer ensuite le sel ?"},
  b:{t:"Huile + eau salée", make:function(){ return [C("huile","liq","org",300), C("eau","liq","aq",100), C("sel (dissous)","diss")]; }, hint:"Idée : l'huile et l'eau ne se mélangent pas. Quelle technique exploite cela ?"},
  c:{t:"Eau + éthanol", make:function(){ return [C("eau","liq","aq",100), C("éthanol","liq","aq",78)]; }, hint:"Idée : les deux liquides se mélangent parfaitement, mais bouillent à des températures différentes."},
  d:{t:"Limaille de fer + sable + sel (poudres sèches)", make:function(){ return [C("fer","mag"), C("sable","solid"), C("sel","sol")]; }, hint:"Idée : un seul des solides est attiré par un aimant, un seul se dissout dans l'eau."}
};
SFA.sim({
  id:"c3-c01-atelier", ch:"c01", tag:"Classique",
  titre:"Atelier de séparation : enchaîne les bonnes techniques",
  resume:"Choisis un mélange puis applique tes techniques dans le bon ordre jusqu'à isoler chaque constituant.",
  but:"Choisis un mélange et clique sur les techniques une à une. Chaque technique ne sépare que ce pour quoi elle est faite : à toi de trouver l'ordre qui isole tous les constituants.",
  aRetenir:"Une technique de séparation exploite une différence de propriété : l'aimant (magnétisme), la filtration (taille des grains / solubilité), la décantation (liquides non miscibles), l'évaporation (un solide dissous reste), la distillation (températures d'ébullition différentes).",
  piege:"Filtrer ne sépare pas un solide dissous de l'eau : le sel dissous traverse le filtre. Et l'évaporation fait perdre le liquide ; seule la distillation le récupère.",
  build:function(k,S){
    var c = k.canvas(330);
    var sel = k.select("Mélange", [["a",MIX.a.t],["b",MIX.b.t],["c",MIX.c.t],["d",MIX.d.t]], "a", function(){ reset(); });
    var st, log, lost;
    var nt = k.note("", "");
    var lg = k.note("", "");
    function reset(){ var m = MIX[sel.value]; st = {cur:m.make(), fr:[]}; log=[]; lost=[]; nt.set(m.hint,""); lg.set("Journal : aucune technique appliquée.",""); }
    function has(arr,f){ return arr.some(f); }
    function act(name){
      var cur = st.cur, out = [];
      var liq = cur.filter(function(x){return x.kind==="liq";});
      var msg = "";
      if (name==="aimant"){ out = cur.filter(function(x){return x.kind==="mag";});
        if(!out.length) msg="L'aimant n'attire rien ici."; else { st.cur = cur.filter(function(x){return x.kind!=="mag";}); st.fr.push({l:"À l'aimant",a:out}); msg="Le fer est attiré et récupéré."; } }
      else if (name==="eau"){
        var sol = cur.filter(function(x){return x.kind==="sol";});
        if(!sol.length) msg="Il n'y a rien à dissoudre.";
        else { sol.forEach(function(x){ x.kind="diss"; x.n="sel (dissous)"; }); if(!has(cur,function(x){return x.n==="eau";})) cur.push(C("eau","liq","aq",100)); msg="Le sel se dissout : il devient invisible mais il est toujours là."; } }
      else if (name==="filtre"){
        if(!liq.length) msg="La filtration a besoin d'un liquide : ajoute d'abord de l'eau.";
        else { out = cur.filter(function(x){return x.kind==="solid";});
          if(!out.length) msg="Le filtre ne retient rien : le sel dissous est passé avec l'eau (filtrat inchangé)."; else { st.cur = cur.filter(function(x){return x.kind!=="solid";}); st.fr.push({l:"Sur le filtre",a:out}); msg="Les solides non dissous restent sur le filtre."; } } }
      else if (name==="decante"){
        var ids = {}; liq.forEach(function(x){ids[x.id]=1;});
        if(Object.keys(ids).length<2) msg="Il n'y a pas deux liquides non miscibles : la décantation ne sépare rien.";
        else { out = cur.filter(function(x){return x.kind==="liq"&&x.id==="org";}); st.cur = cur.filter(function(x){return !(x.kind==="liq"&&x.id==="org");}); st.fr.push({l:"Décanté (dessus)",a:out}); msg="Le liquide le moins dense surnage et est soutiré par le robinet de l'ampoule."; } }
      else if (name==="evap"){
        if(!liq.length) msg="Il n'y a plus de liquide à évaporer.";
        else { liq.forEach(function(x){ lost.push(x.n); }); st.cur = cur.filter(function(x){return x.kind!=="liq";});
          st.cur.forEach(function(x){ if(x.kind==="diss"){ x.kind="sol"; x.n="sel"; } });
          msg="Le liquide part dans l'air (il est perdu) ; les solides dissous cristallisent."; } }
      else if (name==="dist"){
        if(!liq.length) msg="Il n'y a pas de liquide à distiller.";
        else { liq.sort(function(a,b){return a.bp-b.bp;});
          liq.forEach(function(x,i){ st.fr.push({l:"Distillat n°"+(i+1)+" (éb. "+x.bp+" °C)",a:[x]}); });
          st.cur = cur.filter(function(x){return x.kind!=="liq";});
          st.cur.forEach(function(x){ if(x.kind==="diss"){ x.kind="sol"; x.n="sel"; } });
          msg="Les liquides sont recueillis dans l'ordre de leurs températures d'ébullition ; les solides restent dans le ballon."; } }
      pulse=1; log.push(msg); lg.set("<b>Journal.</b> "+log.map(function(x,i){return (i+1)+". "+x;}).join("<br>"), "");
      check();
    }
    function check(){
      var groups = [st.cur].concat(st.fr.map(function(f){return f.a;})), ok = true;
      groups.forEach(function(g){ if(g.length>1) ok=false; });
      var precious = lost.filter(function(n){ return n!=="eau"; });
      if (!st.cur.length && !st.fr.length){
        nt.set("Il ne reste plus rien : tout est parti dans l'air ("+lost.join(", ")+"). Recommence et récupère les constituants avant d'évaporer.","warn");
      } else if (ok && log.length && !precious.length){
        nt.set("<b>Bravo !</b> Chaque constituant est isolé"+(lost.length?" (l'eau évaporée est perdue dans l'air, c'est acceptable ici)":"")+". Essaie un autre mélange.","ok");
      } else if (ok && log.length){
        nt.set("Les constituants restants sont séparés, mais tu as évaporé <i>"+precious.join(", ")+"</i> : il est perdu. Recommence et utilise une technique qui le récupère (décantation, distillation).","warn");
      } else nt.set("Un groupe contient encore plusieurs constituants : continue.","warn");
    }
    [["Aimant","aimant"],["Ajouter de l'eau","eau"],["Filtration","filtre"],["Décantation","decante"],["Évaporation","evap"],["Distillation","dist"]].forEach(function(p){ k.button(p[0], function(){ act(p[1]); }); });
    var pulse=0, nfr=0;
    var lp = k.loop(function(dt){ if(pulse>0){ pulse=Math.max(0,pulse-dt*1.4); k.redraw(); } });
    lp.play();
    k.button("Recommencer", function(){ reset(); pulse=0; }, true);
    var KC = {sable:"#c9a45c", fer:"#3b424d", sel:"#f4f6fa", "sel (dissous)":"#dfe7f2"};
    function grains(g,x,y,w,h,items,seed){ var R=CH.rng(seed); items.forEach(function(it,ii){ var col=KC[it.n]; if(!col||it.kind==="liq"||it.kind==="diss") return; var n=Math.round(w*h/(it.kind==="mag"?60:34)); for(var i=0;i<n;i++){ var gx=x+R()*w, gy=y+h-R()*h*(1-Math.pow(R(),0.7)); g.fillStyle=col; g.globalAlpha=.95; g.beginPath(); g.arc(gx,gy,it.kind==="mag"?1.6:2,0,6.3); g.fill(); if(it.n==="sel"){ g.strokeStyle="#b8c2d0"; g.lineWidth=.6; g.stroke(); } } g.globalAlpha=1; }); }
    function vessel(x,y,w,h,items,seed,label,hi){
      var g=c.ctx, liq=items.filter(function(i){return i.kind==="liq";}), diss=items.filter(function(i){return i.kind==="diss";});
      var lvl=liq.length||diss.length?0.6:0, lc="rgba(111,177,230,.55)";
      var hasOil=liq.some(function(i){return i.id==="org";}), hasAq=liq.some(function(i){return i.id==="aq";}), hasEth=liq.some(function(i){return i.n==="éthanol";}), hasW=liq.some(function(i){return i.n==="eau";});
      if(hasEth&&hasW) lc="rgba(160,150,230,.5)"; else if(hasEth) lc="rgba(177,156,217,.5)"; else if(hasOil&&!hasAq) lc="rgba(224,184,50,.65)"; else if(!liq.length&&diss.length) lc="rgba(111,177,230,.55)";
      if(hi){ D.glow(c,x+w/2,y+h/2,w*.9,P.green,.5); }
      CH.glass(c,x,y,w,h,lvl,lc,{taper:w>90?6:3});
      if(hasOil&&hasAq){ g.save(); g.beginPath(); g.rect(x+3,y+h*(1-lvl),w-6,h*lvl*.36); g.fillStyle="rgba(232,190,40,.8)"; g.fill(); g.restore(); }
      g.save(); g.beginPath(); g.rect(x+2,y+2,w-4,h-4); g.clip(); grains(g,x+4,y+h-h*.22,w-8,h*.2,items,seed);
      if(diss.length&&lvl){ var R=CH.rng(seed+3); g.fillStyle="rgba(255,255,255,.8)"; for(var i=0;i<26;i++){ g.beginPath(); g.arc(x+6+R()*(w-12),y+h*(1-lvl)+8+R()*h*lvl*.7,1.3,0,6.3); g.fill(); } } g.restore();
      D.text(c,label,x+w/2,y+h+11,{size:c.W<420?10.5:11.5,color:hi?P.green:"#4b586a",weight:800});
    }
    reset();
    k.draw(function(){
      c.clear(); CH.bg(c,c.H-8); var W=c.W,H=c.H,g=c.ctx;
      var bw=Math.min(150,W*0.34), bh=H*0.5, bx=14, by=H*0.2;
      CH.title(c,"Paillasse · "+MIX[sel.value].t.split(" (")[0]);
      vessel(bx,by,bw,bh,st.cur,7,"Bécher de départ",false);
      // légende des constituants
      var ly=by+bh+30; st.cur.forEach(function(it,i){ var col=COL[it.n]||"#999"; CH.circ(c,bx+6,ly+i*17,5,col); D.text(c,it.n,bx+16,ly+i*17,{size:11.5,align:"left",color:"#2c3a4e",weight:700}); });
      // fractions
      var fx=bx+bw+22, fw=W-fx-8, cw=Math.min(66,fw/Math.max(2,Math.min(3,st.fr.length||1))-8), per=Math.max(1,Math.floor(fw/(cw+8)));
      if(!st.fr.length){ D.text(c,"Les fractions",fx+fw/2,H*0.4,{size:12.5,color:"#7b8798"}); D.text(c,"séparées arriveront ici",fx+fw/2,H*0.4+17,{size:12.5,color:"#7b8798"}); }
      st.fr.forEach(function(f,i){ var col=i%per, row=Math.floor(i/per), x=fx+col*(cw+8), y=by-6+row*(bh*0.62+26), isN=i===st.fr.length-1; var l=f.l.replace("Distillat n°","Distillat ").replace(" (dessus)","").replace("Sur le filtre","Filtre"); var items=f.a.map(function(a){ return {n:a.n,kind:a.kind,id:a.id}; });
        vessel(x,y,cw,bh*0.62,items,20+i,l.length>16?l.slice(0,15)+"…":l,isN&&pulse>0); });
      if(lost.length){ D.label(c,"Perdu dans l'air : "+lost.join(", "),W-8,H-24,{align:"right",color:P.red,size:11.5}); }
      var ok=log.length>0; if(ok){ D.text(c,"Étape "+log.length,W-10,16,{size:11.5,align:"right",color:P.grey}); }
    });
  }
});

/* ---------- 2 · Courbe de chauffe ---------- */
var SUBS = {
  eau:{n:"Eau pure (glace à −20 °C)", pure:true, segs:function(m){ return [[m*2.1*20,-20,0,"solide"],[m*334,0,0,"fusion"],[m*4.18*100,0,100,"liquide"],[m*2260,100,100,"ébullition"],[m*2.0*40,100,140,"gaz"]]; }},
  eth:{n:"Éthanol pur (liquide à 20 °C)", pure:true, segs:function(m){ return [[m*2.44*58,20,78,"liquide"],[m*850,78,78,"ébullition"],[m*1.7*30,78,108,"gaz"]]; }},
  mel:{n:"Mélange eau + éthanol 50/50 (liquide à 20 °C)", pure:false, segs:function(m){ return [[m*3.3*59,20,79,"liquide"],[m*1550,79,97,"ébullition"]]; }},
  sal:{n:"Eau salée à 10 % (liquide à 20 °C)", pure:false, segs:function(m){ return [[m*3.8*81,20,101,"liquide"],[m*0.9*2260,101,108,"ébullition"]]; }}
};
SFA.sim({
  id:"c3-c01-courbe-chauffe", ch:"c01", tag:"Classique",
  titre:"Courbe de chauffe : palier ou pas palier ?",
  resume:"Chauffe un corps pur ou un mélange à puissance constante : seul le corps pur garde sa température pendant le changement d'état.",
  but:"Choisis une substance, une masse et une puissance de chauffe, puis déplace le curseur du temps. Repère les paliers de température.",
  aRetenir:"Un corps pur change d'état à température constante (palier) : cette température est une constante physique qui permet de l'identifier (eau : 0 °C et 100 °C ; éthanol : 78 °C à l'ébullition). Un mélange n'a pas de palier net : sa température continue de monter pendant le changement d'état.",
  piege:"Pendant un palier, on continue à fournir de l'énergie : elle sert à changer l'état (écarter les particules), pas à augmenter la température. Les valeurs d'énergie sont des données de référence arrondies ; l'allure des mélanges est simplifiée.",
  build:function(k,S){
    var c = k.canvas(330);
    var sb = k.select("Substance", Object.keys(SUBS).map(function(i){return [i,SUBS[i].n];}), "eau");
    var m = k.slider("Masse", 50, 200, 10, 100, "g");
    var p = k.slider("Puissance de chauffe", 100, 1000, 50, 500, "W");
    var tc = k.slider("Moment observé", 0, 100, 1, 40, "% de la courbe");
    var ro = k.readouts(["Temps","Température","État","Énergie reçue"]);
    var nt = k.note("","");
    function build(){
      var s = SUBS[sb.value], segs = s.segs(m.value), Q=0, arr=[];
      segs.forEach(function(g){ arr.push({q0:Q,q1:Q+g[0],T0:g[1],T1:g[2],ph:g[3]}); Q+=g[0]; });
      return {segs:arr, Qt:Q, pure:s.pure};
    }
    function TofQ(M,q){ for(var i=0;i<M.segs.length;i++){ var s=M.segs[i]; if(q<=s.q1+1e-9){ var f=s.q1>s.q0?(q-s.q0)/(s.q1-s.q0):1; return {T:s.T0+(s.T1-s.T0)*f, ph:s.ph, plateau:s.T0===s.T1}; } } var l=M.segs[M.segs.length-1]; return {T:l.T1,ph:l.ph,plateau:false}; }
    k.draw(function(){
      c.clear(); var M=build(), tEnd=M.Qt/p.value;
      var ax = D.axes(c,{x0:0,x1:tEnd*1.04,y0:-30,y1:150,xl:"t (s)",yl:"T (°C)",stepY:30});
      var pts=[],n=300; for(var i=0;i<=n;i++){ var q=M.Qt*i/n; pts.push([q/p.value, TofQ(M,q).T]); }
      var g=c.ctx; g.save(); g.strokeStyle=P.acc; g.lineWidth=2.6; g.beginPath(); pts.forEach(function(a,i){ if(i) g.lineTo(ax.X(a[0]),ax.Y(a[1])); else g.moveTo(ax.X(a[0]),ax.Y(a[1])); }); g.stroke(); g.restore();
      var q=M.Qt*tc.value/100, r=TofQ(M,q), t=q/p.value;
      D.line(c,ax.X(t),ax.Y(-30),ax.X(t),ax.Y(r.T),P.red,1.5,[5,4]); D.line(c,ax.L,ax.Y(r.T),ax.X(t),ax.Y(r.T),P.red,1.5,[5,4]); D.dot(c,ax.X(t),ax.Y(r.T),6,P.red);
      var ph = r.ph; if(!M.pure && /ébullition/.test(ph)) ph="ébullition (T qui monte)";
      if (M.pure && r.plateau && tc.value>0) ph = ph==="fusion"?"fusion (palier)":ph==="ébullition"?"ébullition (palier)":ph;
      ro.set(0,F(t,0)+" s"); ro.set(1,F(r.T,1)+" °C"); ro.set(2,ph); ro.set(3,F(q/1000,1)+" kJ");
      nt.set(M.pure ? "Corps pur : cherche les paliers horizontaux — leur température est une constante physique." : "Mélange : la température monte sans palier net pendant l'ébullition. Compare avec l'éthanol pur.", M.pure?"ok":"warn");
    });
  }
});

/* ---------- 3 · Chromatographie ---------- */
var RFD = {
  eau:{n:"Eau", rf:{jaune:0.80, rouge:0.55, bleu:0.25}},
  mix:{n:"Eau + éthanol (1 : 1)", rf:{jaune:0.90, rouge:0.70, bleu:0.45}},
  eth:{n:"Éthanol", rf:{jaune:0.95, rouge:0.85, bleu:0.65}}
};
var ENC = [
  {id:"vert", n:"Feutre vert", comp:["jaune","bleu"]},
  {id:"violet", n:"Feutre violet", comp:["rouge","bleu"]},
  {id:"noir", n:"Feutre noir", comp:["jaune","rouge","bleu"]},
  {id:"orange", n:"Feutre orange", comp:["jaune","rouge"]},
  {id:"inc", n:"Encre inconnue", comp:["jaune","rouge"]}
];
var CC = {jaune:"#e8c20a", rouge:"#d33a2c", bleu:"#2058d6"};
SFA.sim({
  id:"c3-c01-chromato", ch:"c01", tag:"Mesure",
  titre:"Chromatographie : fais monter le solvant et mesure Rf",
  resume:"Un solvant monte dans le papier et entraîne les colorants plus ou moins vite : mesure le rapport frontal.",
  but:"Fais monter le front du solvant. Mesure la distance parcourue par une tache et par le solvant, calcule Rf, puis identifie l'encre inconnue en la comparant aux autres.",
  aRetenir:"Rf = distance parcourue par la tache ÷ distance parcourue par le solvant (depuis la ligne de dépôt). Rf ne dépend pas de la hauteur atteinte par le front, mais du colorant, du solvant et du papier : c'est une carte d'identité.",
  piege:"Les distances se mesurent à partir de la ligne de dépôt, pas du bas du papier. Et deux taches de même couleur ne sont pas forcément le même colorant : compare les Rf avec le même solvant.",
  build:function(k,S){
    var c = k.canvas(340);
    var sv = k.select("Solvant", Object.keys(RFD).map(function(i){return [i,RFD[i].n];}), "eau");
    var fr = k.slider("Distance parcourue par le solvant", 0, 8, 0.5, 6, "cm");
    var en = k.select("Encre à mesurer", ENC.map(function(e){return [e.id,e.n];}), "noir");
    var col = k.select("Tache à mesurer", [["jaune","jaune"],["rouge","rouge"],["bleu","bleu"]], "rouge");
    var ro = k.readouts(["Distance du solvant","Distance de la tache","Rf"]);
    var rv = k.toggle("Révéler la composition de l'inconnue", false);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W, H=c.H, g=c.ctx, rf=RFD[sv.value].rf;
      var top=26, bot=H-40, cm=(bot-top)/10, y0=bot-1.5*cm, left=44, sw=(W-left-10)/ENC.length;
      rr(c,left-4,top,W-left-6,bot-top,"#fbf7ec","#d8cfb8",1.5,4);
      // règle
      for(var i=0;i<=10;i++){ var yy=bot-i*cm; D.line(c,left-10,yy,left-4,yy,P.grey,1); if(i%2===0) T(c,String(i),left-18,yy,{size:12,color:P.grey}); }
      T(c,"cm",14,top-10,{size:12,color:P.grey});
      D.line(c,left-4,y0,W-6,y0,P.grey,1.2,[4,3]); T(c,"dépôt",left+14,y0+10,{size:12,color:P.grey});
      var yf=y0-fr.value*cm; D.line(c,left-4,yf,W-6,yf,P.acc,2); T(c,"front",W-24,yf-9,{size:12,color:P.acc});
      var cur=ENC.filter(function(e){return e.id===en.value;})[0];
      ENC.forEach(function(e,j){
        var cx=left+sw*(j+0.5);
        if (e.id==="inc"&&false) return;
        g.save(); g.fillStyle="#2f3b4d"; g.beginPath(); g.arc(cx,y0,3,0,6.3); g.fill(); g.restore();
        e.comp.forEach(function(cl){
          var d=rf[cl]*fr.value, y=y0-d*cm;
          g.save(); g.fillStyle=CC[cl]; g.globalAlpha=0.85; g.beginPath(); g.ellipse(cx,y,Math.min(15,sw*0.28),5+fr.value*0.4,0,0,6.3); g.fill(); g.restore();
        });
        T(c,e.id==="inc"?"?":e.n.replace("Feutre ",""),cx,bot+14,{size:12,color:e.id==="inc"?P.red:P.ink});
      });
      // repère de la tache mesurée
      var dm=rf[col.value]*fr.value, ym=y0-dm*cm;
      if (cur.comp.indexOf(col.value)>=0){ var j=ENC.indexOf(cur), cx=left+sw*(j+0.5);
        g.save(); g.strokeStyle=P.ink; g.lineWidth=1.5; g.setLineDash([3,3]); g.beginPath(); g.moveTo(left-4,ym); g.lineTo(cx-12,ym); g.stroke(); g.restore(); }
      T(c,"Solvant : "+RFD[sv.value].n,left+4,H-8,{size:12,color:P.grey,align:"left"});
      var has=cur.comp.indexOf(col.value)>=0;
      ro.set(0,F(fr.value,1)+" cm");
      ro.set(1,has?F(dm,2)+" cm":"pas de tache");
      ro.set(2,has&&fr.value>0?F(dm/fr.value,2):"—");
      if (!has) nt.set("Cette encre ne contient pas de colorant "+col.value+" : choisis une autre tache.","warn");
      else if (fr.value===0) nt.set("Le solvant n'a pas encore bougé : fais-le monter.","warn");
      else nt.set("Rf = "+F(dm,2)+" ÷ "+F(fr.value,1)+" = <b>"+F(dm/fr.value,2)+"</b>. Change la distance du solvant : Rf ne bouge pas. Change de solvant : il change.","ok");
      if (rv.value){ nt.set(nt.el.innerHTML+"<br><b>Composition de l'inconnue :</b> "+ENC[4].comp.join(" + ")+" → elle est identique au feutre orange.","ok"); }
    });
  }
});

/* ---------- 4 · Distillation fractionnée ---------- */
SFA.sim({
  id:"c3-c01-distillation", ch:"c01", tag:"Original",
  titre:"Distillation fractionnée eau – éthanol",
  resume:"Chauffe un mélange eau-éthanol et recueille cinq fractions : la première est la plus riche en éthanol.",
  but:"Choisis la teneur en éthanol du mélange puis lance le chauffage. Regarde la température en tête de colonne et la composition de chaque tube recueilli.",
  aRetenir:"Le liquide qui bout le plus facilement (éthanol, 78 °C) passe en premier, mais jamais de façon parfaitement pure : on recueille des fractions successives de plus en plus riches en eau. La température en tête monte pendant que le mélange s'appauvrit en éthanol.",
  piege:"Une distillation simple ne donne pas de l'éthanol pur : il reste de l'eau dans la première fraction (limite vers 96 % en réalité). Modèle simplifié : proportions en volume, valeurs qualitatives mais de bon ordre de grandeur.",
  build:function(k,S){
    var c = k.canvas(370);
    var ph0 = k.slider("Éthanol dans le mélange de départ", 10, 70, 5, 30, "%");
    var sp = k.slider("Vitesse de la simulation", 1, 4, 1, 2, "×");
    var ro = k.readouts(["Température en tête","Dans le ballon","Distillat recueilli","Éthanol du tube 1"]);
    var nt = k.note("Lance le chauffage, puis compare la couleur et le pourcentage des tubes.","");
    var V0=200, alpha=7, st;
    function H0(){ return c.H-4; }
    function yOf(x){ return Math.min(0.96, alpha*x/(1+(alpha-1)*x)); }
    function bp(x){ return 100-22*(1-Math.pow(1-x,3)); }
    function init(){ var e=V0*ph0.value/100; st={E:e, V:V0, col:0, tubes:[0,0,0,0,0], vol:[0,0,0,0,0], done:false, head:bp(ph0.value/100)}; }
    init();
    function step(dv){ var x=st.E/st.V, y=yOf(x); if(dv>st.V-5) dv=st.V-5; if(dv<=0){st.done=true;return;}
      var ti=Math.min(4,Math.floor(st.col/20)); st.tubes[ti]+=y*dv; st.vol[ti]+=dv; st.E-=y*dv; st.V-=dv; st.col+=dv; st.head=bp(x); }
    var lp = k.loop(function(dt){ if(st.done){ lp.pause(); return; }
      var tot=4*dt*sp.value, n=Math.ceil(tot/0.25); for(var i=0;i<n;i++){ step(tot/n); if(st.col>=100){ st.done=true; break; } }
      k.redraw(); if(st.done) lp.pause(); });
    k.button("Chauffer / pause", function(){ if(st.done) return; if(lp.running) lp.pause(); else lp.play(); }, true);
    k.button("Recommencer", function(){ lp.pause(); init(); });
    ph0.el.addEventListener("input", function(){ lp.pause(); init(); k.redraw(); });
    k.draw(function(){
      c.clear(); CH.bg(c,H0()); var W=c.W,H=c.H,g=c.ctx, tt=Date.now()/1000;
      var x=st.V>0?st.E/st.V:0, run=lp.running&&!st.done;
      var br=Math.min(44,W*0.11), bx=W*0.15, by=H*0.66, ny=H*0.2, top=ny-4;
      CH.title(c,"Distillation fractionnée · eau + éthanol");
      // plaque chauffante + flamme
      CH.rr(c,bx-br-8,by+br+4,2*br+16,14,"#5b6677",null,0,5);
      if(run){ for(var f=0;f<5;f++){ var fx=bx-br*.6+f*br*.3, fh=7+4*Math.sin(tt*14+f*2); g.fillStyle="rgba(244,160,40,.9)"; g.beginPath(); g.moveTo(fx-4,by+br+4); g.quadraticCurveTo(fx,by+br+4-fh*1.6,fx+4,by+br+4); g.fill(); } D.glow(c,bx,by+br,br*1.3,P.orange,.4); }
      // ballon à fond rond
      g.save(); g.beginPath(); g.arc(bx,by,br,0,6.2832); g.moveTo(bx-br*.28,by-br*.95); g.lineTo(bx-br*.28,top); g.moveTo(bx+br*.28,by-br*.95); g.lineTo(bx+br*.28,top);
      g.strokeStyle="#6b7a90"; g.lineWidth=2.4; g.stroke(); g.restore();
      var lvl=st.V/V0; g.save(); g.beginPath(); g.arc(bx,by,br-1.5,0,6.2832); g.clip(); var gr=g.createLinearGradient(0,by-br,0,by+br); gr.addColorStop(0,"rgba(150,125,225,"+(0.3+0.4*x).toFixed(2)+")"); gr.addColorStop(1,"rgba(110,90,200,"+(0.45+0.4*x).toFixed(2)+")"); g.fillStyle=gr; g.fillRect(bx-br,by+br-2*br*lvl*.9,2*br,2*br); 
      if(run){ for(var q=0;q<7;q++){ var ph=(tt*1.4+q*.37)%1; CH.circ(c,bx+Math.sin(q*5.1)*br*.6,by+br*.8-ph*br*1.4*lvl,1.8+q%3,"rgba(255,255,255,.7)"); } } g.restore();
      D.text(c,"ballon : "+F(st.V,0)+" mL",bx,by+br+30,{size:11.5,color:"#4b586a"});
      // thermomètre dans le col
      var tx=bx+br*.05; var th=Math.max(0,Math.min(1,(st.head-70)/35)); CH.rr(c,tx-3,top-16,6,50,"#fff","#8a95a3",1.2,3); CH.rr(c,tx-1.6,top+34-th*46,3.2,th*46,P.red,null,0,2);
      D.label(c,F(st.head,1)+" °C",tx,top-28,{color:P.red,size:12.5});
      // tuyau + condenseur de Liebig
      var cx0=bx+br*.28, cx1=W*0.62, cy1=H*0.4; D.line(c,cx0,ny,W*.3,ny,"#6b7a90",3);
      var ux=W*.3, uy=ny, dx=cx1-ux, dy=cy1-uy; g.save(); g.translate(ux,uy); g.rotate(Math.atan2(dy,dx)); var L=Math.hypot(dx,dy);
      CH.rr(c,0,-9,L,18,"rgba(120,190,240,.45)","#6b7a90",2,6); D.line(c,0,0,L,0,"#6b7a90",2.4);
      for(var w=0;w<6;w++){ var wx=((tt*40+w*L/6)%L); if(run) D.arrow(c,wx,5.5,wx+8,5.5,"rgba(255,255,255,.9)",1.4); }
      g.restore(); D.label(c,"condenseur (eau froide)",(ux+cx1)/2+30,(uy+cy1)/2-34,{size:10.5,color:"#4b586a"});
      if(run){ for(var v=0;v<L*.9;v+=L*.2){ var pv=((tt*0.5+v/L)%1); } }
      // tubes à essai
      var tx0=W*.34, avail=W-tx0-8, tw=Math.min(40,avail/5-6), gap=(avail-5*tw)/4, tyy=H*.5, th2=H*.36, ti=Math.min(4,Math.floor(st.col/20));
      for(var i=0;i<5;i++){ var xx=tx0+i*(tw+gap), v=st.vol[i], e=v>0?st.tubes[i]/v:0, hh=th2*Math.min(1,v/20);
        CH.glass(c,xx,tyy,tw,th2,0,"#fff",{taper:2,round:tw/2-2});
        if(v>0){ g.save(); CH.rr(c,xx+2,tyy+th2-hh-1,tw-4,hh,"rgba("+Math.round(150-60*e)+","+Math.round(130-50*e)+",230,"+(0.25+0.65*e).toFixed(2)+")",null,0,4); g.restore(); }
        D.text(c,v>0?Math.round(e*100)+" %":"—",xx+tw/2,tyy+th2+12,{size:12,color:v>0?P.violet:P.grey,weight:800});
        D.text(c,String(i+1),xx+tw/2,tyy-9,{size:11.5,color:i===ti&&run?P.mat:P.grey}); }
      // gouttes
      if(run&&st.col<100){ var dxp=tx0+ti*(tw+gap)+tw/2, ph2=(tt*2.2)%1, sy=cy1+4+ph2*(tyy+10-cy1-4); D.line(c,cx1,cy1+9,dxp,cy1+16,"#6b7a90",2.4); CH.circ(c,dxp,cy1+16+ph2*(tyy-cy1-12),2.8,"rgba(150,125,225,.95)"); }
      CH.cap(c,"tubes de 20 mL (violet = éthanol)",W*.66,H-8);
      ro.set(0,F(st.head,1)+" °C"); ro.set(1,F(st.V,0)+" mL ("+F(x*100,0)+" % éth.)"); ro.set(2,F(st.col,0)+" mL");
      ro.set(3,st.vol[0]>0?F(st.tubes[0]/st.vol[0]*100,0)+" %":"—");
      if (st.done) nt.set("Terminé : le tube 1 contient "+F(st.tubes[0]/st.vol[0]*100,0)+" % d'éthanol, le tube 5 seulement "+F(st.tubes[4]/Math.max(st.vol[4],1e-9)*100,0)+" %. La température en tête est montée jusqu'à "+F(st.head,0)+" °C.","ok");
    });
  }
});
})();
