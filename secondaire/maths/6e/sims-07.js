/* Chapitre 7 : statistique à deux variables */
function reg(x,y){
  var n=x.length, mx=0,my=0,i; for(i=0;i<n;i++){mx+=x[i];my+=y[i];} mx/=n; my/=n;
  var sxx=0,sxy=0,syy=0; for(i=0;i<n;i++){ sxx+=(x[i]-mx)*(x[i]-mx); sxy+=(x[i]-mx)*(y[i]-my); syy+=(y[i]-my)*(y[i]-my); }
  var a=sxx>1e-12?sxy/sxx:NaN, b=isNaN(a)?NaN:my-a*mx, r=(sxx>1e-12&&syy>1e-12)?sxy/Math.sqrt(sxx*syy):NaN;
  return {n:n,mx:mx,my:my,sxx:sxx,sxy:sxy,syy:syy,a:a,b:b,r:r};
}
function words(r){ if(isNaN(r)) return "non défini"; var a=Math.abs(r), s=a>=0.9?"très forte":a>=0.7?"forte":a>=0.4?"moyenne":a>=0.2?"faible":"quasi nulle"; return s+(a>=0.2?(r>0?" positive":" négative"):""); }
/* jauge de corrélation de −1 à 1 dessinée sur le canevas */
function rGauge(S,c,r,x,y,w){
  var P=S.draw.palette, ctx=c.ctx; S.draw.panel(c,x-8,y-8,w+16,44,{shadow:false});
  var g=ctx.createLinearGradient(x,0,x+w,0); g.addColorStop(0,"#c0321d"); g.addColorStop(0.5,"#e3e7ed"); g.addColorStop(1,"#1f4b9e");
  ctx.fillStyle=g; S.draw.rrect(c,x,y+12,w,8,4); ctx.fill();
  [-1,0,1].forEach(function(t){ var tx=x+(t+1)/2*w; S.draw.text(c,S.fmt(t,0),tx,y+31,{size:10,color:P.grey,weight:700}); });
  S.draw.text(c,"r",x,y+2,{size:11,align:"left",color:P.grey,weight:800,math:true,italic:true});
  if(!isNaN(r)){ var px=x+(r+1)/2*w; S.draw.dot(c,px,y+16,6,"#13233a"); S.draw.text(c,S.fmt(r,2),M6.clamp(px,x+14,x+w-14),y+2,{size:12,color:P.ink,weight:800}); }
}

SFA.sim({
  id:"m6-c07-nuage-droite", ch:"c07", tag:"Classique",
  titre:"Nuage de points, droite de régression et coefficient r",
  resume:"Déplace les points à la souris : la droite des moindres carrés et r se recalculent en direct.",
  but:"Glisse un point du nuage, ou clique dans une zone vide pour en ajouter un. Observe le point moyen G, la droite de régression de y en x et le coefficient de corrélation r. Essaie aussi les nuages prêts à l'emploi, dont la parabole.",
  aRetenir:"La droite de régression de y en x passe par le point moyen G(x̄ ; ȳ) et a pour pente a = s<sub>xy</sub> / s<sub>xx</sub>. Le coefficient de corrélation r est toujours compris entre −1 et 1 : proche de ±1, les points sont presque alignés ; proche de 0, il n'y a pas de relation <i>linéaire</i>. Le signe de r est celui de la pente.",
  piege:"r ≈ 0 ne veut pas dire « aucun lien » : le nuage en parabole a r = 0 alors que y dépend parfaitement de x. Et r n'est pas la pente de la droite.",
  build:function(k,S){
    var c=M6.canvas(k,.8,350), P=S.draw.palette;
    var PRE={
      f:{x:[1,2,3,4,5,6,7,8,9],y:[1.8,1.99,3.1,3.9,5.5,5.7,7.1,7.7,8.7]},
      n:{x:[1,2,3,4,5,6,7,8,9],y:[5,2,7,3,6,4,7,2,5]},
      p:{x:[1,2,3,4,5,6,7,8,9],y:[1.8,4.95,7.2,8.55,9,8.55,7.2,4.95,1.8]},
      d:{x:[1,2,3,4,5,6,7,8,9],y:[8.9,8.5,7.6,7.7,6.2,5.5,4.8,3.8,2.9]}
    };
    var X=PRE.f.x.slice(), Y=PRE.f.y.slice(), ax=null, drag=-1;
    function load(key){ X=PRE[key].x.slice(); Y=PRE[key].y.slice(); }
    k.button("Corrélation forte +",function(){load("f");});
    k.button("Corrélation négative",function(){load("d");});
    k.button("Pas de lien",function(){load("n");});
    k.button("Parabole (y dépend de x !)",function(){load("p");});
    k.button("Retirer un point",function(){ if(X.length>3){ X.pop(); Y.pop(); } });
    var show=k.toggle("Montrer la droite et le point moyen G",true);
    var res=k.toggle("Montrer les écarts verticaux",false);
    var ro=k.readouts(["Droite y = ax + b","r","Intensité du lien","Point moyen G"]);
    k.draw(function(){
      c.clear(); var R=reg(X,Y), fs=M6.fs(c,12);
      ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:10,xl:"x",yl:"y",stepX:1,stepY:1});
      if(show.value&&!isNaN(R.a)){
        if(res.value) X.forEach(function(x,i){ S.draw.line(c,ax.X(x),ax.Y(Y[i]),ax.X(x),ax.Y(R.a*x+R.b),P.amber,1.8); });
        S.draw.fn(c,ax,function(x){return R.a*x+R.b;},P.red,2.8);
        S.draw.dot(c,ax.X(R.mx),ax.Y(R.my),7,P.violet); S.draw.label(c,"G",ax.X(R.mx)+16,ax.Y(R.my)+16,{color:P.violet,size:fs+1}); }
      X.forEach(function(x,i){ M6.handle(S,c,ax.X(x),ax.Y(Y[i]),P.mat,drag===i,6.5); });
      rGauge(S,c,R.r,ax.R-Math.min(150,c.W*0.38)-8,ax.B-64,Math.min(150,c.W*0.38));
      ro.set(0,isNaN(R.a)?"—":"y = "+S.fmt(R.a,2)+"·x "+(R.b<0?"− ":"+ ")+S.fmt(Math.abs(R.b),2)); ro.set(1,S.fmt(R.r,3)); ro.set(2,words(R.r)); ro.set(3,"("+S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)+")");
    });
    c.pointer(function(type,p){
      if(!ax) return;
      if(type==="down"){ var best=-1,bd=1e9; X.forEach(function(x,i){ var d=Math.hypot(ax.X(x)-p.x,ax.Y(Y[i])-p.y); if(d<bd){bd=d;best=i;} }); drag=bd<26?best:-1;
        if(drag<0&&X.length<14&&p.x>ax.L&&p.x<ax.R&&p.y>ax.T&&p.y<ax.B){ X.push(M6.clamp(Math.round(ax.ix(p.x)*10)/10,0,10)); Y.push(M6.clamp(Math.round(ax.iy(p.y)*10)/10,0,10)); drag=X.length-1; k.redraw(); } }
      if((type==="down"||type==="drag")&&drag>=0){ X[drag]=M6.clamp(Math.round(ax.ix(p.x)*10)/10,0,10); Y[drag]=M6.clamp(Math.round(ax.iy(p.y)*10)/10,0,10); k.redraw(); }
      if(type==="up"){ drag=-1; k.redraw(); }
      if(type==="move"){ var near=X.some(function(x,i){ return Math.hypot(ax.X(x)-p.x,ax.Y(Y[i])-p.y)<24; }); c.cv.style.cursor=near?"grab":"crosshair"; }
    });
  }
});

SFA.sim({
  id:"m6-c07-residus", ch:"c07", tag:"Moindres carrés",
  titre:"Règle toi-même la droite : somme des carrés des écarts",
  resume:"Ajuste pente et ordonnée : la somme des carrés est minimale pour la droite de régression.",
  but:"Pour 8 points fixes, tire les deux poignées de la droite (ou règle la pente m et l'ordonnée p). Chaque carré a pour côté l'écart vertical entre un point et ta droite. Défi : fais descendre la somme des carrés à moins de 105 % de son minimum.",
  aRetenir:"L'écart (résidu) d'un point est e<sub>i</sub> = y<sub>i</sub> − (m·x<sub>i</sub> + p). La droite de régression est celle qui <i>minimise</i> la somme des carrés Σe<sub>i</sub>². Elle passe par le point moyen. Toute autre droite donne une somme plus grande. (6 h : démonstration par le calcul du minimum.)",
  piege:"Avec ton œil, tu minimises plutôt les distances perpendiculaires. La droite de régression minimise les écarts <i>verticaux</i> : régresser y en x et x en y donne deux droites différentes.",
  build:function(k,S){
    var c=M6.canvas(k,.82,350), P=S.draw.palette;
    var X=[1,2,3,4,5,6,7,8], Y=[2.1,2.9,4.4,4.8,6.5,6.9,8.4,8.7], R=reg(X,Y);
    var m=k.slider("Pente m",-1,3,0.05,0.5,"",null), p=k.slider("Ordonnée p",-3,6,0.1,3,"",null);
    var sq=k.toggle("Montrer les carrés des écarts",true);
    k.button("Placer la droite des moindres carrés",function(){ m.set(Math.round(R.a*20)/20); p.set(Math.round(R.b*10)/10); },true);
    var ro=k.readouts(["Σ des carrés S(m ; p)","Minimum S<sub>min</sub>","S / S<sub>min</sub>","Droite de régression"]);
    var nt=k.note("","warn"), ax=null, XH=[1.5,8.5];
    var Smin=0; X.forEach(function(x,i){ var e=Y[i]-(R.a*x+R.b); Smin+=e*e; });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, M=m.value, Pp=p.value, fs=M6.fs(c,12);
      ax=S.draw.axes(c,{x0:0,x1:10,y0:-1,y1:10,xl:"x",yl:"y",stepX:1,stepY:1});
      var Ssum=0;
      X.forEach(function(x,i){ var e=Y[i]-(M*x+Pp); Ssum+=e*e;
        if(sq.value){ var side=Math.abs(ax.Y(e)-ax.Y(0)), yy=ax.Y(M*x+Pp), yp=ax.Y(Y[i]), xx=e>=0?ax.X(x)-side:ax.X(x); ctx.fillStyle=S.draw.tint(P.red,0.14+Math.min(0.2,Math.abs(e)*0.05)); ctx.strokeStyle=S.draw.tint(P.red,0.75); ctx.lineWidth=1; ctx.fillRect(xx,Math.min(yy,yp),side,side); ctx.strokeRect(xx,Math.min(yy,yp),side,side); }
        S.draw.line(c,ax.X(x),ax.Y(Y[i]),ax.X(x),ax.Y(M*x+Pp),P.red,1.6);
      });
      S.draw.fn(c,ax,function(x){return M*x+Pp;},P.mat,3.2);
      X.forEach(function(x,i){ S.draw.dot(c,ax.X(x),ax.Y(Y[i]),5.5,P.ink); });
      XH.forEach(function(x){ M6.handle(S,c,ax.X(x),ax.Y(M*x+Pp),P.mat,false,8); });
      var ratio=Ssum/Smin, w=Math.min(170,c.W*0.42), gx=ax.R-w-10, gy=ax.B-66;
      S.draw.panel(c,gx-8,gy-8,w+16,52,{shadow:false}); var fr=Math.min(1,Math.log(Math.max(1,ratio))/Math.log(6));
      ctx.fillStyle="#eef1f5"; ctx.fillRect(gx,gy+14,w,9); ctx.fillStyle=ratio<1.05?P.green:(ratio<1.5?P.amber:P.red); ctx.fillRect(gx,gy+14,Math.max(3,w*fr),9);
      S.draw.text(c,"S / S min = "+S.fmt(ratio,2),gx,gy+3,{size:11.5,align:"left",weight:800,color:ratio<1.05?P.green:P.ink}); S.draw.text(c,"objectif < 1,05",gx+w,gy+36,{size:10.5,align:"right",color:P.grey,weight:700});
      S.draw.line(c,gx+w*Math.log(1.05)/Math.log(6),gy+10,gx+w*Math.log(1.05)/Math.log(6),gy+27,P.green,2);
      ro.set(0,S.fmt(Ssum,3)); ro.set(1,S.fmt(Smin,3)); ro.set(2,S.fmt(ratio,3)); ro.set(3,"y = "+S.fmt(R.a,3)+"·x + "+S.fmt(R.b,3));
      if(ratio<1.05) nt.set("Bravo : ta droite est à moins de 5 % du minimum. Compare avec y = "+S.fmt(R.a,2)+"x + "+S.fmt(R.b,2)+" : elle passe par G("+S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)+").","ok");
      else nt.set("S est "+S.fmt(ratio,2)+" fois le minimum. Fais passer ta droite près du point moyen G("+S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)+") et ajuste la pente.","warn");
    });
    M6.drag(c,function(){ return ax?XH.map(function(x){ return {x:ax.X(x),y:ax.Y(m.value*x+p.value)}; }):[]; },function(i,pt){
      var o=1-i, y1=ax.iy(pt.y), y2=m.value*XH[o]+p.value, x1=XH[i], x2=XH[o], mm=(y1-y2)/(x1-x2), pp=y2-mm*x2;
      m.set(M6.clamp(Math.round(mm*20)/20,-1,3)); p.set(M6.clamp(Math.round(pp*10)/10,-3,6)); k.redraw(); },{r:30});
  }
});

SFA.sim({
  id:"m6-c07-anscombe", ch:"c07", tag:"Quatuor d'Anscombe",
  titre:"Mêmes statistiques, quatre nuages très différents",
  resume:"Quatre jeux de données ont la même droite et le même r. Regarde-les avant de te fier au chiffre.",
  but:"Passe d'un jeu de données à l'autre, ou affiche les quatre côte à côte. Les moyennes, la droite de régression et r sont presque identiques, mais les nuages n'ont rien à voir.",
  aRetenir:"Un coefficient r ne remplace jamais le graphique. Ici les quatre jeux ont r ≈ 0,816 et la droite y ≈ 0,5x + 3. Pourtant : (I) lien linéaire correct ; (II) courbe, la droite est inadaptée ; (III) alignement parfait gâché par un point aberrant ; (IV) un seul point éloigné crée toute la corrélation. Toujours dessiner le nuage.",
  piege:"Un r élevé ne prouve pas que la relation est linéaire, ni que la droite est un bon modèle. Un seul point peut fabriquer ou détruire la corrélation.",
  build:function(k,S){
    var c=M6.canvas(k,.8,350), P=S.draw.palette;
    var X123=[10,8,13,9,11,14,6,4,12,7,5];
    var D={
      I:{x:X123,y:[8.04,6.95,7.58,8.81,8.33,9.96,7.24,4.26,10.84,4.82,5.68],t:"Jeu I : nuage presque linéaire"},
      II:{x:X123,y:[9.14,8.14,8.74,8.77,9.26,8.10,6.13,3.10,9.13,7.26,4.74],t:"Jeu II : relation en courbe"},
      III:{x:X123,y:[7.46,6.77,12.74,7.11,7.81,8.84,6.08,5.39,8.15,6.42,5.73],t:"Jeu III : un point aberrant"},
      IV:{x:[8,8,8,8,8,8,8,19,8,8,8],y:[6.58,5.76,7.71,8.84,8.47,7.04,5.25,12.5,5.56,7.91,6.89],t:"Jeu IV : tout dépend d'un seul point"}
    };
    var sel=k.seg("Jeu de données",[["I","I"],["II","II"],["III","III"],["IV","IV"]],"I");
    var all=k.toggle("Voir les quatre jeux côte à côte",false);
    var res=k.toggle("Montrer les écarts à la droite",false);
    var ro=k.readouts(["x̄ ; ȳ","Droite y = ax + b","r","Σ des carrés des écarts"]);
    function panel(sub,d,big,key){
      var R=reg(d.x,d.y), ax=S.draw.axes(sub,{x0:2,x1:20,y0:2,y1:14,xl:big?"x":"",yl:big?"y":"",stepX:big?2:4,stepY:big?2:4,l:big?46:32,b:big?34:24,t:big?16:10,r:12});
      S.draw.fn(sub,ax,function(x){return R.a*x+R.b;},P.red,big?2.8:2.2);
      var S2=0; d.x.forEach(function(x,i){ var e=d.y[i]-(R.a*x+R.b); S2+=e*e; if(res.value) S.draw.line(sub,ax.X(x),ax.Y(d.y[i]),ax.X(x),ax.Y(R.a*x+R.b),P.amber,1.6); });
      var out=(key==="III"||key==="IV");
      d.x.forEach(function(x,i){ var o=(key==="III"&&d.y[i]>12)||(key==="IV"&&x>15); S.draw.dot(sub,ax.X(x),ax.Y(d.y[i]),o?(big?7.5:5.5):(big?6:4),o?P.violet:P.mat); });
      return {R:R,S2:S2,ax:ax};
    }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, W=c.W, H=c.H, fs=M6.fs(c,12), last;
      if(all.value){
        var keys=["I","II","III","IV"], pw=W/2, ph=H/2;
        keys.forEach(function(key,i){ ctx.save(); ctx.translate((i%2)*pw,Math.floor(i/2)*ph); var sub={W:pw,H:ph,ctx:ctx,clear:c.clear}; var r=panel(sub,D[key],false,key);
          S.draw.label(sub,D[key].t.split(":")[0],r.ax.L+6,r.ax.T+10,{size:fs,color:key===sel.value?P.red:P.ink,align:"left"}); ctx.restore(); if(key===sel.value) last=r; });
        ctx.strokeStyle="#e3e7ed"; ctx.beginPath(); ctx.moveTo(W/2,6); ctx.lineTo(W/2,H-6); ctx.moveTo(6,H/2); ctx.lineTo(W-6,H/2); ctx.stroke();
      } else {
        var d=D[sel.value]; last=panel(c,d,true,sel.value); S.draw.label(c,d.t,last.ax.R-6,last.ax.T+12,{size:M6.fs(c,12.5),align:"right",color:P.ink});
      }
      var R=last.R; ro.set(0,S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)); ro.set(1,"y = "+S.fmt(R.a,2)+"x + "+S.fmt(R.b,2)); ro.set(2,S.fmt(R.r,3)); ro.set(3,S.fmt(last.S2,2));
    });
  }
});

SFA.sim({
  id:"m6-c07-variable-cachee", ch:"c07", tag:"Corrélation ≠ causalité · Niche utile",
  titre:"Glaces et noyades : la variable cachée",
  resume:"Les ventes de glaces et les noyades sont corrélées. Retire l'effet de la température : la corrélation disparaît.",
  but:"Chaque point est un mois (données fictives). Les couleurs montrent la température. Active « Retirer l'effet de la température » : les points glissent et la relation entre glaces et noyades disparaît.",
  aRetenir:"Une forte corrélation entre deux variables ne prouve pas que l'une cause l'autre : une troisième variable (ici la température) peut agir sur les deux. Quand on neutralise cette variable cachée (on regarde les écarts à la droite de régression sur T), la corrélation entre glaces et noyades devient ≈ 0.",
  piege:"« Les glaces provoquent des noyades » est une conclusion fausse tirée d'une vraie corrélation. Pour prouver une causalité, il faut une expérience contrôlée ou une explication par un mécanisme, pas seulement un r élevé. (Données fictives, construites pour l'exemple.)",
  build:function(k,S){
    var c=M6.canvas(k,.8,350), P=S.draw.palette;
    var T=[3,4,8,12,16,20,23,22,18,13,7,4], eG=[0.4,-0.6,0.5,-0.3,0.7,-0.5,0.2,0.6,-0.4,-0.2,0.3,-0.7], eN=[0.35,-0.5,-0.2,0.5,0.1,0.2,-0.3,0.4,0.5,0.3,-0.6,-0.4];
    var mois=["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
    var G=T.map(function(t,i){return 2+0.9*t+eG[i];}), N=T.map(function(t,i){return 1+0.35*t+eN[i];});
    var s=0, tgt=0, lp=k.loop(function(dt){ var d=tgt-s; s+=Math.sign(d)*Math.min(Math.abs(d),dt*1.4); if(Math.abs(tgt-s)<1e-4){ s=tgt; lp.pause(); } k.redraw(); });
    var corr=k.toggle("Retirer l'effet de la température",false,function(on){ tgt=on?1:0; lp.play(); });
    var ro=k.readouts(["r (glaces, noyades)","Pente a","r avec température (glaces)","r avec température (noyades)"]);
    var nt=k.note("","ok");
    function tcol(t){ var u=(t-3)/20; return "rgb("+Math.round(30+200*u)+","+Math.round(63-20*u)+","+Math.round(143-110*u)+")"; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, fs=M6.fs(c,12);
      var rg=reg(T,G), rn=reg(T,N);
      var cx=G.map(function(g,i){return g-(rg.a*T[i]+rg.b);}), cy=N.map(function(n,i){return n-(rn.a*T[i]+rn.b);});
      /* repère interpolé entre « données brutes » et « écarts » */
      var ex=M6.ease(s), x0=-2*ex, x1=25*(1-ex)+2*ex, y0=-2*ex, y1=10*(1-ex)+2*ex;
      var ax=S.draw.axes(c,{x0:x0,x1:x1,y0:y0,y1:y1,xl:s>0.5?"écart glaces":"glaces",yl:s>0.5?"écart noyades":"noyades"});
      var xs=G.map(function(g,i){ return g*(1-ex)+cx[i]*ex; }), ys=N.map(function(n,i){ return n*(1-ex)+cy[i]*ex; });
      var R=reg(xs,ys);
      S.draw.fn(c,ax,function(x){return R.a*x+R.b;},P.red,2.8);
      xs.forEach(function(x,i){ S.draw.dot(c,ax.X(x),ax.Y(ys[i]),7,tcol(T[i])); });
      xs.forEach(function(x,i){ if(T[i]>=20||T[i]<=3) S.draw.text(c,mois[i],ax.X(x),ax.Y(ys[i])-13,{size:10.5,color:"#5f6b7a",weight:700}); });
      /* échelle de couleur */
      var bw=Math.min(120,c.W*0.3), bx=ax.R-bw-6, by=ax.B-30, g2=ctx.createLinearGradient(bx,0,bx+bw,0); g2.addColorStop(0,tcol(3)); g2.addColorStop(1,tcol(23));
      S.draw.panel(c,bx-8,by-20,bw+16,46,{shadow:false}); ctx.fillStyle=g2; S.draw.rrect(c,bx,by,bw,8,4); ctx.fill();
      S.draw.text(c,"température",bx+bw/2,by-9,{size:10.5,color:"#5f6b7a",weight:700}); S.draw.text(c,"3 °C",bx,by+18,{size:10.5,align:"left",color:"#5f6b7a"}); S.draw.text(c,"23 °C",bx+bw,by+18,{size:10.5,align:"right",color:"#5f6b7a"});
      S.draw.label(c,"r = "+S.fmt(R.r,2),ax.R-8,ax.T+14,{size:M6.fs(c,13),align:"right",color:Math.abs(R.r)>0.5?P.red:P.green});
      var on=corr.value;
      ro.set(0,S.fmt(R.r,3)); ro.set(1,S.fmt(R.a,3)); ro.set(2,S.fmt(reg(T,G).r,3)); ro.set(3,S.fmt(reg(T,N).r,3));
      if(on&&s>0.99) nt.set("Une fois la température neutralisée, r ≈ "+S.fmt(R.r,2)+" : glaces et noyades n'ont plus de lien. La température expliquait tout.","ok");
      else if(!on&&s<0.01) nt.set("r = "+S.fmt(R.r,2)+" : très forte corrélation, mais ce sont les mois chauds (rouge) qui concentrent glaces ET noyades.","warn");
      else nt.set("Les points glissent vers leurs écarts à la droite « température → glaces » et « température → noyades »…","ok");
    });
  }
});
