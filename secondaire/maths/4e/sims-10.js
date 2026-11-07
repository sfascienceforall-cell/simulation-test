(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function sorted(a){ return a.slice().sort(function(x,y){return x-y;}); }
function med(a){ var n=a.length; if(!n) return NaN; return n%2 ? a[(n-1)/2] : (a[n/2-1]+a[n/2])/2; }
function quart(a){ var n=a.length; if(n<2) return [a[0],a[0]]; return [med(a.slice(0,Math.floor(n/2))), med(a.slice(Math.ceil(n/2)))]; }
function mean(a){ var s=0; a.forEach(function(v){s+=v;}); return s/a.length; }
function sd(a){ var m=mean(a),s=0; a.forEach(function(v){s+=(v-m)*(v-m);}); return Math.sqrt(s/a.length); }
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; var t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

/* ---------- histogramme interactif ---------- */
var PRE = {
  sym:[0,1,2,4,6,8,6,4,2,1,0],
  droite:[0,6,9,8,6,4,2,1,1,0,0],
  deux:[0,3,6,8,5,2,2,5,8,6,3],
  haut:[0,0,0,1,2,3,5,8,10,8,4]
};
SFA.sim({
  id:"m4-c10-histogramme", ch:"c10", tag:"Classique",
  titre:"Construire une série et lire ses paramètres",
  resume:"Dessine un diagramme en barres de notes sur 10 : moyenne, médiane, quartiles et écart-type se recalculent.",
  but:"Touche ou fais glisser sur le graphique pour fixer l'effectif de chaque note (de 0 à 10). Observe la moyenne (trait rouge), la médiane (trait vert) et l'écart-type. Essaie de faire une moyenne égale à la médiane, puis très différente.",
  aRetenir:"Moyenne = somme des valeurs / effectif. Médiane : valeur du milieu de la série ordonnée. Quartiles Q₁ et Q₃ : médianes des deux moitiés. Écart interquartile = Q₃ − Q₁. Écart-type σ = √(moyenne des carrés des écarts à la moyenne) : il mesure la dispersion.",
  piege:"L'écart-type n'est pas la moyenne des écarts : on élève les écarts au carré avant de faire la moyenne, puis on prend la racine. Et pour la médiane, on ordonne d'abord la série.",
  build:function(k,S){
    var M=window.M4, c=k.canvas(0,{ratio:.78});
    var cnt=PRE.sym.slice(), ax=null;
    k.button("Symétrique",function(){ cnt=PRE.sym.slice(); });
    k.button("Étalée à droite",function(){ cnt=PRE.droite.slice(); });
    k.button("Deux bosses",function(){ cnt=PRE.deux.slice(); });
    k.button("Beaucoup de bonnes notes",function(){ cnt=PRE.haut.slice(); });
    k.button("Tout effacer",function(){ cnt=cnt.map(function(){return 0;}); });
    var ro=k.readouts(["Effectif n","Moyenne","Médiane","Mode","Q₁ ; Q₃","Étendue","Écart interquartile","Écart-type σ"]);
    var nt=k.note("Touche ou glisse sur le graphique pour fixer l'effectif de chaque note (0 à 12). Quartiles : médiane des deux moitiés (médiane exclue si n est impair).","");
    c.pointer(function(t,p){ if(!ax||t==="move")return; var i=Math.round(ax.ix(p.x)); if(i<0||i>10)return; cnt[i]=Math.max(0,Math.min(12,Math.round(ax.iy(p.y)))); k.redraw(); });
    k.draw(function(){
      c.clear(); ax=S.draw.axes(c,{x0:-0.6,x1:10.6,y0:0,y1:15.5,xl:"note",yl:"effectif",stepX:1,stepY:3,l:40});
      var ctx=c.ctx, bw=ax.X(0.42)-ax.X(0);
      cnt.forEach(function(n,i){
        ctx.fillStyle="rgba(30,63,143,.05)"; ctx.fillRect(ax.X(i)-bw,ax.Y(12),2*bw,ax.Y(0)-ax.Y(12));
        if(n>0){ var g=ctx.createLinearGradient(0,ax.Y(n),0,ax.Y(0)); g.addColorStop(0,S.draw.tint(P.acc,.85)); g.addColorStop(1,S.draw.tint(P.acc,.45)); ctx.fillStyle=g; ctx.fillRect(ax.X(i)-bw,ax.Y(n),2*bw,ax.Y(0)-ax.Y(n)); ctx.strokeStyle=P.acc; ctx.lineWidth=1.5; ctx.strokeRect(ax.X(i)-bw,ax.Y(n),2*bw,ax.Y(0)-ax.Y(n));
          S.draw.text(c,String(n),ax.X(i),ax.Y(n)-9,{size:10.5,weight:800,color:P.acc}); } });
      var vals=[]; cnt.forEach(function(n,i){ for(var j=0;j<n;j++) vals.push(i); });
      var n=vals.length;
      if(!n){ ["—","—","—","—","—","—","—","—"].forEach(function(s,i){ ro.set(i,s); }); ro.set(0,"0"); M.hint(c,"Touche le graphique pour construire ta série."); return; }
      var m=mean(vals), md=med(vals), q=quart(vals), s=sd(vals), mx=Math.max.apply(null,cnt), modes=[]; cnt.forEach(function(v,i){ if(v===mx) modes.push(i); });
      S.draw.line(c,ax.X(m),ax.Y(12.6),ax.X(m),ax.B,P.red,2.5); S.draw.line(c,ax.X(md),ax.Y(12.6),ax.X(md),ax.B,P.green,2.5,[6,4]);
      var tri=function(x,col){ ctx.save(); ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(x,ax.B-1); ctx.lineTo(x-6,ax.B-12); ctx.lineTo(x+6,ax.B-12); ctx.closePath(); ctx.fill(); ctx.restore(); };
      tri(ax.X(m),P.red); tri(ax.X(md),P.green);
      /* boîte à moustaches en haut */
      var by=ax.Y(14.4), mn=vals[0], mxv=vals[n-1];
      S.draw.line(c,ax.X(mn),by,ax.X(mxv),by,P.ink,2);
      S.draw.line(c,ax.X(mn),by-7,ax.X(mn),by+7,P.ink,2); S.draw.line(c,ax.X(mxv),by-7,ax.X(mxv),by+7,P.ink,2);
      ctx.save(); ctx.fillStyle=S.draw.tint(P.violet,.25); ctx.strokeStyle=P.violet; ctx.lineWidth=2; ctx.fillRect(ax.X(q[0]),by-9,ax.X(q[1])-ax.X(q[0]),18); ctx.strokeRect(ax.X(q[0]),by-9,ax.X(q[1])-ax.X(q[0]),18); ctx.restore();
      S.draw.line(c,ax.X(md),by-9,ax.X(md),by+9,P.green,3);
      S.draw.legend(c,[[P.red,"moyenne "+F(m,2)],[P.green,"médiane "+F(md,1),true],[P.violet,"boîte Q₁–Q₃"]],ax.R-8,ax.Y(12.2),{align:"right"});
      ro.set(0,String(n)); ro.set(1,F(m,2)); ro.set(2,F(md,1)); ro.set(3,modes.length>3?"plusieurs":modes.join(" ; ")); ro.set(4,F(q[0],1)+" ; "+F(q[1],1));
      ro.set(5,F(vals[n-1]-vals[0],0)); ro.set(6,F(q[1]-q[0],1)); ro.set(7,F(s,2));
    });
  }
});

/* ---------- valeur extrême ---------- */
var BASE=[1.8,2.0,2.1,2.2,2.3,2.4,2.6,2.8,3.0];
SFA.sim({
  id:"m4-c10-extreme", ch:"c10", tag:"Manipuler",
  titre:"Une valeur extrême : qui bouge, moyenne ou médiane ?",
  resume:"Neuf salaires mensuels (en milliers d'euros) et un dixième qui s'envole : compare moyenne et médiane.",
  but:"Fais glisser le 10e salaire (le point orange, ou le curseur). Observe comment la moyenne (rouge) se laisse entraîner alors que la médiane (verte) bouge à peine. Que deviennent l'étendue et l'écart-type ?",
  aRetenir:"La moyenne est sensible aux valeurs extrêmes ; la médiane est « robuste ». Pour une série avec une valeur aberrante, la médiane décrit mieux la valeur typique. L'écart-type et l'étendue, eux, explosent.",
  piege:"Une moyenne n'est pas un « individu typique » : avec un 10e salaire de 30 k€, la moyenne (5,12 k€) dépasse 9 des 10 salaires. Compare toujours moyenne et médiane avant de conclure.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.56});
    var xv=k.slider("Valeur du 10e salaire (k€)",1.5,30,0.5,3.5,"k€");
    var ad=k.toggle("Inclure ce 10e salaire",true);
    var ro=k.readouts(["Moyenne","Médiane","Étendue","Écart-type σ"]);
    var nt=k.note("","");
    var geo={};
    k.button("Un patron à 30 k€",function(){ xv.set(30); ad.set&&ad.set(true); });
    k.button("Un salaire comme les autres",function(){ xv.set(2.5); });
    M.grab(c,function(){ return geo.X&&ad.value?[{id:"x",x:geo.X(xv.value),y:geo.y0-22,r:9999}]:[]; },
      function(id,px){ xv.set(M.clamp(Math.round(((px-geo.L)/(geo.W-geo.L-geo.R)*32)*2)/2,1.5,30)); k.redraw(); });
    k.draw(function(){
      M.adapt(c,.8,.56,520);
      c.clear(); var W=c.W,H=c.H,L=26,R=16, X=function(v){return L+v/32*(W-L-R);}, y0=H*0.7, ctx=c.ctx;
      geo={X:X,y0:y0,L:L,R:R,W:W};
      var data=BASE.slice(); if(ad.value) data.push(xv.value);
      var s=sorted(data), m=mean(s), md=med(s), m0=mean(BASE), md0=med(sorted(BASE));
      var gg=ctx.createLinearGradient(0,0,0,H); gg.addColorStop(0,"#ffffff"); gg.addColorStop(1,"#f3f6fb"); ctx.fillStyle=gg; ctx.fillRect(0,0,W,H);
      /* planche (balance) */
      ctx.save(); ctx.fillStyle="#e7ecf4"; ctx.fillRect(L-6,y0,W-L-R+12,7); ctx.strokeStyle="#c8d1de"; ctx.strokeRect(L-6,y0,W-L-R+12,7); ctx.restore();
      for(var v=0;v<=30;v+=5){ S.draw.line(c,X(v),y0+7,X(v),y0+13,P.ink,1.4); S.draw.text(c,String(v),X(v),y0+26,{size:11.5,color:P.grey,weight:700}); }
      S.draw.text(c,"salaire mensuel (k€)",W-R,y0+44,{size:11,color:P.grey,align:"right"});
      /* points empilés */
      var placed=[]; data.forEach(function(v,i){ var isNew=ad.value&&i===data.length-1, lvl=0;
        if(!isNew){ var near=placed.filter(function(q){ return Math.abs(X(q.v)-X(v))<15; }).length; lvl=near; placed.push({v:v}); }
        if(isNew){ S.draw.glow(c,X(v),y0-12,22,P.amber,.5); S.draw.dot(c,X(v),y0-12,8,P.amber); M.lab(c,"10e",X(v),y0-34,P.amber,{size:10.5}); }
        else S.draw.dot(c,X(v),y0-8-lvl*15,6.5,P.acc); });
      /* repères d'origine (sans le 10e) en creux */
      var ghost=function(x,col){ ctx.save(); ctx.strokeStyle=col; ctx.setLineDash([2,3]); ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(x,y0-86); ctx.lineTo(x,y0); ctx.stroke(); ctx.restore(); };
      if(ad.value){ ghost(X(m0),P.red); }
      /* fulcre = moyenne ; drapeau = médiane */
      var fx=X(m); ctx.save(); ctx.fillStyle=P.red; ctx.beginPath(); ctx.moveTo(fx,y0+8); ctx.lineTo(fx-13,y0+36); ctx.lineTo(fx+13,y0+36); ctx.closePath(); ctx.fill(); ctx.restore();
      S.draw.line(c,fx,y0-86,fx,y0,P.red,2.6);
      S.draw.line(c,X(md),y0-112,X(md),y0,P.green,2.6,[6,4]);
      var top=H*.08, medL=X(md)<=X(m);
      M.lab(c,"médiane "+F(md,2)+" k€",Math.max(70,Math.min(W-70,X(md)+(medL?-8:8))),top+4,P.green,{size:11.5});
      M.lab(c,"moyenne "+F(m,2)+" k€ (point d'équilibre)",Math.max(100,Math.min(W-100,X(m))),top+30,P.red,{size:11.5});
      if(ad.value&&Math.abs(X(m)-X(m0))>40){ var yb=y0-70; S.draw.arrow(c,X(m0),yb,X(m),yb,P.red,2); M.lab(c,"+"+F(m-m0,2)+" k€",Math.max(40,Math.min(W-40,(X(m0)+X(m))/2)),yb-14,P.red,{size:10.5}); }
      ro.set(0,F(m,2)+" k€"); ro.set(1,F(md,2)+" k€"); ro.set(2,F(s[s.length-1]-s[0],2)+" k€"); ro.set(3,F(sd(s),2)+" k€");
      nt.set(ad.value?"Sans le 10e salaire : moyenne "+F(m0,2)+" et médiane "+F(md0,2)+". Avec lui : la moyenne varie de "+F(m-m0,2)+" k€, la médiane de "+F(md-md0,2)+" k€.":"Série de 9 salaires : moyenne "+F(m0,2)+" et médiane "+F(md0,2)+" (proches).","");
    });
  }
});


/* ---------- boîtes à moustaches : comparer deux séries ---------- */
var Z=[-2,-1.5,-1.2,-0.8,-0.5,-0.3,-0.1,0,0.1,0.3,0.5,0.8,1.2,1.5,2];
SFA.sim({
  id:"m4-c10-boites", ch:"c10", tag:"Comparer",
  titre:"Comparer deux séries avec des boîtes à moustaches",
  resume:"La série A est fixe (moyenne 10, écart-type ≈ 2,15). Règle la moyenne et la dispersion de B et compare.",
  but:"Change la moyenne de B puis sa dispersion. Défi 1 : même moyenne mais dispersion différente. Défi 2 : même dispersion mais moyenne différente. Que lis-tu sur les boîtes ?",
  aRetenir:"Une boîte à moustaches résume la série par min, Q₁, médiane, Q₃, max. La largeur de la boîte est l'écart interquartile (50 % des données). Deux séries de même moyenne peuvent être très différentes : il faut comparer aussi la dispersion.",
  piege:"La longueur de la boîte ne dit rien sur la moyenne : elle mesure la dispersion centrale. Et comparer deux moyennes sans regarder l'écart-type peut tromper.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var mb=k.slider("Moyenne de B",6,14,0.5,10,"");
    var sb=k.slider("Dispersion de B (échelle)",0.5,4,0.25,3,"");
    var ro=k.readouts(["A : moyenne ; σ","B : moyenne ; σ","A : Q₁ ; méd. ; Q₃","B : Q₁ ; méd. ; Q₃"]);
    var nt=k.note("","");
    k.draw(function(){
      var A=Z.map(function(z){return 10+2*z;}), B=Z.map(function(z){return mb.value+sb.value*z;});
      c.clear(); var W=c.W,H=c.H,L=30,R=14, X=function(v){return L+(v+4)/28*(W-L-R);};
      var ctx=c.ctx;
      for(var v=-4;v<=24;v+=2){ S.draw.line(c,X(v),10,X(v),H-26,"#edf0f4",1); S.draw.text(c,String(v),X(v),H-14,{size:12,color:P.grey}); }
      function box(arr,y,col,name){ var s=sorted(arr), q=quart(s), md=med(s), m=mean(s), h=H*0.17;
        S.draw.line(c,X(s[0]),y,X(q[0]),y,col,2.5); S.draw.line(c,X(q[1]),y,X(s[s.length-1]),y,col,2.5);
        S.draw.line(c,X(s[0]),y-h/3,X(s[0]),y+h/3,col,2.5); S.draw.line(c,X(s[s.length-1]),y-h/3,X(s[s.length-1]),y+h/3,col,2.5);
        ctx.save(); ctx.globalAlpha=.2; ctx.fillStyle=col; ctx.fillRect(X(q[0]),y-h/2,X(q[1])-X(q[0]),h); ctx.restore(); ctx.strokeStyle=col; ctx.lineWidth=2.5; ctx.strokeRect(X(q[0]),y-h/2,X(q[1])-X(q[0]),h);
        S.draw.line(c,X(md),y-h/2,X(md),y+h/2,col,4);
        ctx.save(); ctx.translate(X(m),y); ctx.rotate(Math.PI/4); ctx.fillStyle="#fff"; ctx.strokeStyle=col; ctx.lineWidth=2; ctx.fillRect(-5,-5,10,10); ctx.strokeRect(-5,-5,10,10); ctx.restore();
        S.draw.text(c,name,12,y-h/2-10,{size:13,color:col,align:"left"});
        return {m:m,s:sd(s),q:q,md:md,min:s[0],max:s[s.length-1]}; }
      var ra=box(A,H*0.28,P.acc,"A"), rb=box(B,H*0.62,P.red,"B");
      S.draw.text(c,"◇ = moyenne ; trait épais = médiane",W-R,10,{size:11,color:P.grey,align:"right"});
      ro.set(0,F(ra.m,2)+" ; "+F(ra.s,2)); ro.set(1,F(rb.m,2)+" ; "+F(rb.s,2)); ro.set(2,F(ra.q[0],1)+" ; "+F(ra.md,1)+" ; "+F(ra.q[1],1)); ro.set(3,F(rb.q[0],1)+" ; "+F(rb.md,1)+" ; "+F(rb.q[1],1));
      var sm=Math.abs(rb.m-ra.m)<1e-9, ss=Math.abs(rb.s-ra.s)<0.01;
      nt.set(sm&&ss?"Séries identiques en moyenne et en dispersion : les boîtes se superposent.":(sm?"Même moyenne ("+F(ra.m,1)+") mais B est "+(rb.s>ra.s?"plus dispersée":"plus resserrée")+" que A : l'écart-type et l'écart interquartile le montrent.":(ss?"Même dispersion, mais B est décalée de "+F(rb.m-ra.m,1)+" : même forme de boîte, translatée.":"Moyennes et dispersions différentes : compare les deux paramètres.")),sm||ss?"ok":"");
    });
  }
});

/* ---------- classes de largeurs ---------- */
var DUR=(function(){ var r=rng(20261104), a=[]; for(var i=0;i<80;i++){ var u=Math.max(1e-6,r()); a.push(Math.min(99.5,Math.round((4+(-Math.log(u))*17)*10)/10)); } return a; })();
SFA.sim({
  id:"m4-c10-classes", ch:"c10", tag:"Piège",
  titre:"Largeur des classes : un histogramme peut mentir",
  resume:"80 durées de trajet vers l'école : change les classes et regarde l'histogramme changer de visage.",
  but:"Choisis une largeur de classe égale, puis passe aux classes inégales. Dans ce cas, compare la hauteur « naïve » (effectif) et la hauteur correcte (effectif ÷ largeur) : laquelle donne une aire proportionnelle à l'effectif ?",
  aRetenir:"Dans un histogramme, c'est l'AIRE d'une barre qui est proportionnelle à l'effectif. Avec des classes de largeurs inégales, la hauteur vaut effectif ÷ largeur (densité). La moyenne calculée avec les centres de classes n'est qu'une estimation de la moyenne exacte.",
  piege:"Une classe large paraît « plus haute » si on utilise l'effectif comme hauteur : c'est trompeur. Il faut corriger par la largeur. Et regrouper en classes fait perdre de l'information.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.68});
    var mode=k.seg("Classes",[["eg","Largeurs égales"],["ineg","Largeurs inégales"]],"eg");
    var w=k.seg("Largeur (si égales)",[[2,"2 min"],[5,"5 min"],[10,"10 min"],[20,"20 min"]],10);
    var dens=k.toggle("Hauteur correcte (effectif ÷ largeur) pour classes inégales",true);
    var ro=k.readouts(["Nombre de classes","Classe modale (la plus dense)","Moyenne exacte","Moyenne estimée (centres)"]);
    var nt=k.note("","");
    k.draw(function(){
      var edges=[]; if(mode.value==="eg"){ var ww=Number(w.value); for(var e=0;e<=100;e+=ww) edges.push(e); } else edges=[0,10,20,30,50,100];
      var cls=[]; for(var i=0;i<edges.length-1;i++){ var n=0; DUR.forEach(function(v){ if(v>=edges[i]&&v<edges[i+1]) n++; }); cls.push({a:edges[i],b:edges[i+1],n:n}); }
      var useDens = mode.value==="eg" ? false : dens.value;
      /* hauteur : égales -> effectif ; inégales -> effectif par 10 min si densité, sinon effectif */
      var hts=cls.map(function(q){ return useDens ? q.n/(q.b-q.a)*10 : q.n; });
      var ymax=Math.max.apply(null,hts); ymax=Math.max(4,Math.ceil(ymax*1.15/2)*2);
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:100,y0:0,y1:ymax,xl:"min",yl:useDens?"eff. par 10 min":"effectif",stepX:10,stepY:ymax>20?10:(ymax>8?4:2),l:46}), ctx=c.ctx;
      cls.forEach(function(q,i){ ctx.fillStyle="rgba(30,63,143,.5)"; ctx.fillRect(ax.X(q.a),ax.Y(hts[i]),ax.X(q.b)-ax.X(q.a),ax.Y(0)-ax.Y(hts[i])); ctx.strokeStyle=P.acc; ctx.lineWidth=1.5; ctx.strokeRect(ax.X(q.a),ax.Y(hts[i]),ax.X(q.b)-ax.X(q.a),ax.Y(0)-ax.Y(hts[i])); if(ax.X(q.b)-ax.X(q.a)>26&&q.n>0) S.draw.text(c,String(q.n),(ax.X(q.a)+ax.X(q.b))/2,ax.Y(hts[i])-9,{size:12,color:P.ink}); });
      var best=0; cls.forEach(function(q,i){ var d=q.n/(q.b-q.a); if(d>cls[best].n/(cls[best].b-cls[best].a)) best=i; });
      var est=0; cls.forEach(function(q){ est+=q.n*(q.a+q.b)/2; }); est/=DUR.length;
      ro.set(0,String(cls.length)); ro.set(1,"["+cls[best].a+" ; "+cls[best].b+"["); ro.set(2,F(mean(DUR),2)+" min"); ro.set(3,F(est,2)+" min");
      var naiveBest=0; cls.forEach(function(q,i){ if(q.n>cls[naiveBest].n) naiveBest=i; });
      nt.set(mode.value==="eg"?"Largeurs égales : la hauteur est proportionnelle à l'effectif. Avec des classes trop larges, on perd la forme ; trop étroites, le graphe devient irrégulier. (Les nombres au-dessus des barres sont les effectifs.)":(dens.value?"Hauteur = effectif ÷ largeur × 10 : l'aire de chaque barre est proportionnelle à l'effectif. La classe modale (la plus dense) est "+"["+cls[best].a+" ; "+cls[best].b+"[.":"Hauteur = effectif : les larges classes paraissent trop importantes. La classe [50 ; 100[ contient seulement "+cls[4].n+" trajets mais « s'étale » sur 50 min."),(mode.value==="ineg"&&!dens.value)?"warn":"");
    });
  }
});

/* ---------- graphiques trompeurs et Simpson ---------- */
SFA.sim({
  id:"m4-c10-trompeur", ch:"c10", tag:"Esprit critique",
  titre:"Graphiques trompeurs : axe tronqué et paradoxe de Simpson",
  resume:"Deux façons de faire dire n'importe quoi à des données justes.",
  but:"Mode « axe tronqué » : monte le début de l'axe vertical et regarde l'écart paraître énorme. Mode « Simpson » : change la part d'exercices difficiles tentés avec la méthode X et observe le classement s'inverser.",
  aRetenir:"Un axe vertical qui ne commence pas à 0 exagère les écarts entre barres. Le paradoxe de Simpson : une méthode peut être meilleure dans chaque sous-groupe et pourtant moins bonne au total, quand les groupes n'ont pas la même composition.",
  piege:"Avant de comparer deux pourcentages globaux, regarde la composition des groupes (types d'exercices, âges…). Une moyenne globale cache la structure.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var mode=k.seg("Mode",[["axe","Axe tronqué"],["simp","Simpson"]],"axe");
    var y0=k.slider("Début de l'axe vertical (mode axe)",0,95,5,0,"");
    var hd=k.slider("Exercices difficiles tentés par X sur 100 (mode Simpson)",20,80,20,80,"");
    var ro=k.readouts(["Donnée 1","Donnée 2"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, ctx=c.ctx;
      if(mode.value==="axe"){
        var a=102,b=108, y00=y0.value, ax=S.draw.axes(c,{x0:0,x1:4,y0:y00,y1:112,xl:"",yl:"abonnés",stepX:10,stepY:y00>=50?10:20,grid:true,l:46}), bw=ax.X(0.7)-ax.X(0);
        [[1,a,"2025",P.acc],[3,b,"2026",P.red]].forEach(function(q){ var top=ax.Y(q[1]), bot=ax.Y(y00); ctx.fillStyle=q[3]; ctx.globalAlpha=.7; ctx.fillRect(ax.X(q[0])-bw/2,top,bw,bot-top); ctx.globalAlpha=1; S.draw.text(c,String(q[1]),ax.X(q[0]),top-10,{size:13}); S.draw.text(c,q[2],ax.X(q[0]),ax.B+14,{size:12,color:P.grey}); });
        var ha=a-y00, hb=b-y00;
        ro.set(0,"Hausse réelle : +"+F((b/a-1)*100,1)+" %"); ro.set(1,"Barre 2026 / barre 2025 : ×"+F(hb/ha,2));
        nt.set(y00===0?"Axe à partir de 0 : la différence visuelle correspond à la réalité (+5,9 %).":"Axe tronqué à "+y00+" : la barre de 2026 paraît "+F(hb/ha,2)+" fois plus haute alors que la hausse réelle n'est que de 5,9 %.",y00===0?"ok":"warn");
      } else {
        var h=hd.value, e=100-h, xe=0.95, xh=0.45, ye=0.9, yh=0.4, xs=xe*e+xh*h, ys=ye*80+yh*20;
        var groups=[["Faciles",xe*100,ye*100],["Difficiles",xh*100,yh*100],["Total",xs,ys]];
        var ax2=S.draw.axes(c,{x0:0,x1:3,y0:0,y1:105,yl:"% de réussite",stepX:10,stepY:25,grid:true,l:46}), gw=ax2.X(0.28)-ax2.X(0);
        groups.forEach(function(g,i){ var cx=ax2.X(i+0.5); [[-0.3,g[1],P.acc],[0.3,g[2],P.amber]].forEach(function(bb){ var X=cx+bb[0]*(ax2.X(1)-ax2.X(0)), top=ax2.Y(bb[1]); ctx.globalAlpha=.75; ctx.fillStyle=bb[2]; ctx.fillRect(X-gw/2,top,gw,ax2.Y(0)-top); ctx.globalAlpha=1; S.draw.text(c,F(bb[1],0)+" %",X,top-9,{size:12}); }); S.draw.text(c,g[0],cx,ax2.B+14,{size:12,color:P.grey}); });
        S.draw.text(c,"X",ax2.X(0.5)-0.3*(ax2.X(1)-ax2.X(0)),ax2.B-8,{size:12,color:"#fff"}); S.draw.text(c,"Y",ax2.X(0.5)+0.3*(ax2.X(1)-ax2.X(0)),ax2.B-8,{size:12,color:"#fff"});
        ro.set(0,"X (bleu) : "+F(e,0)+" faciles et "+F(h,0)+" difficiles"); ro.set(1,"Y (orange) : 80 faciles et 20 difficiles");
        var inv = xs<ys;
        nt.set("X réussit mieux que Y chez les faciles (95 % contre 90 %) ET chez les difficiles (45 % contre 40 %). Pourtant au total : X "+F(xs,1)+" % contre Y "+F(ys,0)+" %"+(inv?" : Y paraît meilleur ! C'est le paradoxe de Simpson (X a tenté plus d'exercices difficiles).":" : X reste meilleur, car sa part d'exercices difficiles est faible.") ,inv?"warn":"ok");
      }
    });
  }
});
})();
