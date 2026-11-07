/* Chapitre 2 : fonctions, graphiques, tableaux, formules */
SFA.sim({
  id:"m3-c02-machine", ch:"c02", tag:"Image et antécédent", titre:"La machine à fonctions",
  resume:"Entre x, lis f(x). Puis fais l'inverse : cherche les antécédents d'une valeur.",
  but:"Choisis une fonction, déplace x et regarde le point. Active la recherche d'antécédents et déplace la droite horizontale.",
  aRetenir:"L'image de x est f(x) : on part de x et on lit y. Un antécédent de y est un x qui donne cette valeur y : il peut y en avoir 0, 1, 2 ou plus.",
  piege:"Le point (3 ; −1) signifie f(3) = −1 : 3 est l'abscisse (antécédent), −1 est l'ordonnée (image). Ne les inverse pas.",
  build:function(k,S){
    var c=k.canvas(380), P=S.draw.palette;
    var F=[
      {n:"f(x) = 2x − 1",f:function(x){return 2*x-1},ant:function(y){return [(y+1)/2]}},
      {n:"f(x) = x² − 4",f:function(x){return x*x-4},ant:function(y){return y+4<0?[]:(y+4===0?[0]:[-Math.sqrt(y+4),Math.sqrt(y+4)])}},
      {n:"f(x) = 6 / x",f:function(x){return x===0?NaN:6/x},ant:function(y){return y===0?[]:[6/y]}}
    ];
    var fs=k.select("Fonction",F.map(function(o,i){return [i,o.n];}),0);
    var x=k.slider("x",-6,6,0.5,2,"");
    var tg=k.toggle("Chercher les antécédents d'une valeur y",false);
    var y=k.slider("y cherché",-8,8,0.5,3,"");
    var tb=k.toggle("Montrer le tableau",false);
    var ro=k.readouts(["x","Image f(x)","Antécédents de y"]);
    var nt=k.note("");
    var M3=window.M3, geo={h:[]};
    M3.drag(c,function(){return geo.h;},function(id,p){ if(id==="x") x.set(M3.snap(geo.ax.ix(p.x),0.5,-6,6)); else y.set(M3.snap(geo.ax.iy(p.y),0.5,-8,8)); k.redraw(); });
    k.draw(function(){
      c.clear(); var o=F[+fs.value], X=x.value, Y=o.f(X), ctx=c.ctx; geo.h=[];
      var top=tb.value?58:16;
      var ax=S.draw.axes(c,{x0:-6,x1:6,y0:-8,y1:8,xl:"x",yl:"y",stepX:1,stepY:2,t:top});
      geo.ax=ax; S.draw.fn(c,ax,o.f,P.acc,2.6);
      if(isFinite(Y)){
        S.draw.line(c,ax.X(X),ax.Y(0),ax.X(X),ax.Y(Y),P.amber,1.5,[4,4]);
        S.draw.line(c,ax.X(0),ax.Y(Y),ax.X(X),ax.Y(Y),P.amber,1.5,[4,4]);
        S.draw.label(c,"f("+S.fmt(X,1)+") = "+S.fmt(Y,2),ax.X(X)+(X>2?-10:10),ax.Y(Y)+(Y>0?-24:24),{color:P.red,size:12.5,align:X>2?"right":"left"});
        M3.handle(c,ax.X(X),ax.Y(Y),P.red,false,8); geo.h.push({id:"x",x:ax.X(X),y:ax.Y(Y),r:28});
      }
      var A=o.ant(y.value), as="—";
      if(tg.value){
        S.draw.line(c,ax.L,ax.Y(y.value),ax.R,ax.Y(y.value),P.green,1.5,[6,4]);
        A.forEach(function(a){ if(a>=-6&&a<=6){ S.draw.dot(c,ax.X(a),ax.Y(y.value),6,P.green); S.draw.line(c,ax.X(a),ax.Y(y.value),ax.X(a),ax.Y(0),P.green,1.5,[3,3]); } });
        M3.handle(c,ax.R-14,ax.Y(y.value),P.green,false,7); geo.h.push({id:"y",x:ax.R-14,y:ax.Y(y.value),r:24});
        as=A.length?A.map(function(a){return S.fmt(a,2);}).join(" ; "):"aucun";
      }
      if(tb.value){
        var w=(c.W-20)/7;
        for(var i=0;i<7;i++){ var xv=i-3, yv=o.f(xv), cx=10+w*i+w/2;
          ctx.strokeStyle=P.light; ctx.strokeRect(10+w*i,8,w,22); ctx.strokeRect(10+w*i,30,w,22);
          S.draw.text(c,S.fmt(xv,0),cx,19,{size:12,color:P.grey}); S.draw.text(c,isFinite(yv)?S.fmt(yv,1):"—",cx,41,{size:12,color:P.ink}); }
      }
      ro.set(0,S.fmt(X,1)); ro.set(1,isFinite(Y)?S.fmt(Y,2):"n'existe pas"); ro.set(2,as);
      if(!isFinite(Y)) nt.set("x = 0 est interdit pour 6/x : on ne divise pas par zéro. Le nombre 0 n'a donc pas d'image.","warn");
      else if(tg.value&&!A.length) nt.set("Aucun antécédent pour y = "+S.fmt(y.value,1)+" : la droite verte ne touche pas la courbe.","warn");
      else if(tg.value) nt.set(A.length+" antécédent(s) pour y = "+S.fmt(y.value,1)+" : tous les x où la droite verte coupe la courbe.","ok");
      else nt.set("Le point rouge a pour coordonnées ("+S.fmt(X,1)+" ; "+S.fmt(Y,2)+").","");
    });
  }
});
SFA.sim({
  id:"m3-c02-vase", ch:"c02", tag:"Histoire-graphe", titre:"Le vase qui se remplit",
  resume:"Un robinet à débit constant remplit des vases différents : quel graphique hauteur–temps ?",
  but:"Choisis la forme du vase, lance le robinet et regarde la courbe se tracer en même temps que l'eau monte. Active la tangente pour lire la vitesse de montée, puis relève le défi : arrêter l'eau pile sur le trait doré. (Modèle simplifié : vase vu de face, de profondeur constante ; la largeur dessinée est proportionnelle à la section.)",
  aRetenir:"Le niveau monte vite là où le vase est étroit, lentement là où il est large. La pente de la courbe hauteur–temps lit cette vitesse.",
  piege:"Le graphique n'est pas une photo du vase : c'est la hauteur de l'eau en fonction du temps, pas la forme du récipient.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.95}), P=S.draw.palette, T0=S.draw.tint;
    var W={cyl:function(h){return 0.6;},evase:function(h){return 0.25+0.75*h;},effile:function(h){return 1-0.75*h;},sab:function(h){return 0.9-1.4*Math.min(h,1-h);}};
    var N=400, cum={};
    Object.keys(W).forEach(function(n){ var a=[0]; for(var i=1;i<=N;i++){ a.push(a[i-1]+(W[n]((i-.5)/N))/N); } cum[n]=a; });
    function level(n,t){ var a=cum[n], tgt=a[N]*t/10, lo=0; for(var i=0;i<=N;i++){ if(a[i]>=tgt){ lo=i; break; } lo=i; }
      if(lo===0) return 0; var f=(tgt-a[lo-1])/(a[lo]-a[lo-1]); return (lo-1+f)/N; }
    var sh=k.seg("Forme du vase",[["cyl","Cylindre"],["evase","Large en haut"],["effile","Étroit en haut"],["sab","Sablier"]],"cyl");
    var df=k.seg("Défi",[[0,"Libre"],[1,"Niveau h = 0,5"],[2,"Niveau h = 0,8"]],0);
    var tg=k.toggle("Montrer la tangente (vitesse de montée)",false);
    var t=k.slider("Temps t",0,10,0.1,0,"s");
    var lp=k.loop(function(dt){ var v=t.value+dt*1.5; if(v>=10){ v=10; lp.pause(); } t.set(v); k.redraw(); });
    k.button("Lancer / pause",function(){ if(t.value>=10) t.set(0); if(lp.running) lp.pause(); else lp.play(); k.redraw(); },true);
    k.button("Remettre à zéro",function(){ lp.pause(); t.set(0); k.redraw(); });
    var ro=k.readouts(["Hauteur h (sur 1)","Largeur à ce niveau","Vitesse de montée"]);
    var nt=k.note("Lance le robinet : l'eau monte, la courbe se trace.");
    window.M3.fit(c,0.66,.95);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, n=sh.value, T=t.value, h=level(n,T), fs=M3.sz(c,12), mob=c.W<430;
      var vw=Math.min(c.W*0.36,150), vx=12+vw/2+4, vb=c.H-34, vh=c.H-96, vt=vb-vh;
      /* robinet */
      ctx.fillStyle="#9aa6b6"; S.draw.rrect(c,vx-6,6,12,22,3); ctx.fill(); S.draw.rrect(c,vx-22,2,44,9,4); ctx.fill();
      if(lp.running&&h<0.999){ ctx.strokeStyle=T0(P.blue,.8); ctx.lineWidth=4; ctx.setLineDash([6,4]); ctx.lineDashOffset=-(Date.now()/40)%10; ctx.beginPath(); ctx.moveTo(vx,28); ctx.lineTo(vx,vb-h*vh-2); ctx.stroke(); ctx.setLineDash([]); }
      function path(){ ctx.beginPath(); for(var i=0;i<=60;i++){ ctx.lineTo(vx-W[n](i/60)*vw/2, vb-i/60*vh); } for(i=60;i>=0;i--){ ctx.lineTo(vx+W[n](i/60)*vw/2, vb-i/60*vh); } ctx.closePath(); }
      path(); ctx.fillStyle="#f4f8fd"; ctx.fill();
      ctx.save(); path(); ctx.clip();
      var g=ctx.createLinearGradient(0,vb-h*vh,0,vb); g.addColorStop(0,"rgba(47,127,209,.72)"); g.addColorStop(1,"rgba(30,63,143,.85)");
      ctx.fillStyle=g; ctx.beginPath(); var wy=vb-h*vh, ph=Date.now()/260;
      ctx.moveTo(0,vb+4); for(var xx=0;xx<=c.W;xx+=4) ctx.lineTo(xx, wy+(h>0&&h<1?Math.sin(xx/9+ph)*(lp.running?1.6:0.6):0)); ctx.lineTo(c.W,vb+4); ctx.closePath(); ctx.fill();
      ctx.restore();
      path(); ctx.strokeStyle=P.ink; ctx.lineWidth=2.6; ctx.lineJoin="round"; ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,.55)"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(vx-W[n](.05)*vw/2+5,vb-vh*.06); for(i=3;i<=50;i+=3) ctx.lineTo(vx-W[n](i/60)*vw/2+5,vb-i/60*vh); ctx.stroke();
      /* graduation de hauteur et cible */
      var tgt=+df.value===1?0.5:+df.value===2?0.8:null;
      if(tgt!==null){ var ty=vb-tgt*vh; ctx.strokeStyle=P.amber; ctx.lineWidth=2.4; ctx.setLineDash([7,4]); ctx.beginPath(); ctx.moveTo(vx-vw/2-12,ty); ctx.lineTo(vx+vw/2+12,ty); ctx.stroke(); ctx.setLineDash([]); S.draw.label(c,"h = "+S.fmt(tgt,1),vx-vw/2-14,ty-12,{color:P.amber,size:fs-1,align:"left"}); }
      /* graphique */
      var L=vx+vw/2+(mob?46:58), ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:1,xl:"t (s)",yl:"h",stepX:2,stepY:0.5,l:L,t:40,b:34,r:12});
      if(tgt!==null){ S.draw.line(c,ax.L,ax.Y(tgt),ax.R,ax.Y(tgt),P.amber,1.8,[7,4]); }
      /* trait de niveau relie vase et graphique */
      S.draw.line(c,vx+W[n](h)*vw/2+2,vb-h*vh,ax.X(T),ax.Y(h),T0(P.blue,.6),1.4,[3,4]);
      S.draw.fn(c,ax,function(tt){return level(n,tt);},"#d3dbea",2.2);
      ctx.save(); ctx.strokeStyle=P.acc; ctx.lineWidth=3.4; ctx.lineCap="round"; ctx.beginPath(); for(var s=0;s<=T+1e-9;s+=0.1){ var px=ax.X(s),py=ax.Y(level(n,s)); if(s===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); } ctx.stroke(); ctx.restore();
      var slope=(cum[n][N]/10)/Math.max(0.05,W[n](h));
      if(tg.value&&h<0.999){ var dx=2, y1=h-slope*dx*0.5, y2=h+slope*dx*0.5; S.draw.line(c,ax.X(T-dx*.5),ax.Y(y1),ax.X(T+dx*.5),ax.Y(y2),P.red,2.2); }
      S.draw.dot(c,ax.X(T),ax.Y(h),6.5,P.red);
      S.draw.label(c,"h = "+S.fmt(h,2),ax.X(T)-9,Math.max(ax.T+12,ax.Y(h)+(T>6?16:-16)),{color:P.red,size:fs-1,align:"right"});
      var w=W[n](h); ro.set(0,S.fmt(h,2)); ro.set(1,S.fmt(w,2)+" (max 1)"); ro.set(2,"×"+S.fmt(0.6/w,2)+" ("+(w<0.6?"plus rapide":w>0.6?"plus lent":"référence")+")");
      if(tgt!==null){
        var tt0=0;for(var q=0;q<=10;q+=0.01){ if(level(n,q)>=tgt){ tt0=q; break; } }
        var err=Math.abs(h-tgt);
        if(err<0.02) nt.set("Pile sur le trait ! Pour cette forme, h = "+S.fmt(tgt,1)+" est atteint après "+S.fmt(tt0,1)+" s.","ok");
        else nt.set("Arrête l'eau sur le trait doré (h = "+S.fmt(tgt,1)+"). Pour l'instant h = "+S.fmt(h,2)+(h<tgt?" : encore trop bas.":" : tu as dépassé."),"warn");
      } else if(w<0.6-.01) nt.set("Vase étroit ici : l'eau monte plus vite, la courbe est plus raide.",""); else if(w>0.6+.01) nt.set("Vase large ici : l'eau monte plus lentement, la courbe s'aplatit.",""); else nt.set("Cylindre : même largeur partout, la courbe est une droite.","");
    });
  }
});
SFA.sim({
  id:"m3-c02-verticale", ch:"c02", tag:"Est-ce une fonction ?", titre:"Le test de la droite verticale",
  resume:"Fais glisser une droite verticale sur une courbe et compte les points d'intersection.",
  but:"Choisis une courbe, déplace la droite verticale (glisse-la à la souris ou balaye-la) et note combien de points elle touche. Puis donne ton verdict avec les deux boutons : le score compte tes bonnes réponses.",
  aRetenir:"Une courbe est le graphique d'une fonction si chaque droite verticale la coupe en 0 ou 1 point : un x a au plus une image.",
  piege:"Une droite verticale qui ne touche pas la courbe ne contredit rien : le nombre x n'est simplement pas dans le domaine (comme 0 pour 4/x).",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.95}), P=S.draw.palette, T=S.draw.tint;
    function sq(v){ return v<0?[]:(v===0?[0]:[-Math.sqrt(v),Math.sqrt(v)]); }
    var C=[
      {n:"y = x²/2 − 2",fn:true,ys:function(x){return [x*x/2-2];}},
      {n:"Cercle x² + y² = 9",fn:false,ys:function(x){return sq(9-x*x);}},
      {n:"Parabole couchée x = y²/2 − 2",fn:false,ys:function(x){return sq(2*(x+2));}},
      {n:"y = |x| − 1",fn:true,ys:function(x){return [Math.abs(x)-1];}},
      {n:"y = 4 / x",fn:true,ys:function(x){return x===0?[]:[4/x];}},
      {n:"y = 2 sin x",fn:true,ys:function(x){return [2*Math.sin(x)];}},
      {n:"|y| = x/2 + 1 (V couché)",fn:false,ys:function(x){ var v=x/2+1; return v<0?[]:(v===0?[0]:[-v,v]); }}
    ];
    var cs=k.select("Courbe",C.map(function(o,i){return [i,o.n];}),0,function(){ done=false; });
    var x0=k.slider("Droite verticale x =",-5,5,0.1,0,"");
    var dir=1, lp=k.loop(function(dt){ var v=x0.value+dt*1.3*dir; if(v>=5){v=5;dir=-1;} if(v<=-5){v=-5;dir=1;} x0.set(v); k.redraw(); });
    k.button("Balayer / pause",function(){ if(lp.running) lp.pause(); else lp.play(); },true);
    var score=0, tried=0, done=false;
    function answer(says){ var o=C[+cs.value]; tried++; if(says===o.fn){ score++; fb={ok:true,txt:"Bien vu : "+(o.fn?"chaque verticale touche la courbe au plus une fois, c'est une fonction.":"on trouve des x qui ont deux images, ce n'est pas une fonction.")}; } else fb={ok:false,txt:o.fn?"Non : c'est bien une fonction. Aucune verticale ne touche deux points (certaines ne touchent rien, ce qui est permis).":"Non : ce n'est pas une fonction. Cherche un x pour lequel la droite verticale coupe en deux points (ici x = "+(+cs.value===1?"1":+cs.value===2?"2":"2")+" convient)."}; k.redraw(); }
    var fb=null;
    k.button("C'est une fonction",function(){ answer(true); });
    k.button("Ce n'est pas une fonction",function(){ answer(false); });
    var ro=k.readouts(["Valeur de x","Points d'intersection","Score"]);
    var nt=k.note("");
    var geo={};
    M3.drag(c,function(){return geo.ax?[{id:"v",x:geo.ax.X(x0.value),y:geo.ax.T+30,r:34}]:[];},function(id,p){ lp.pause(); x0.set(M3.snap(geo.ax.ix(p.x),0.1,-5,5)); fb=null; k.redraw(); });
    window.M3.fit(c,0.66,.95);
    k.draw(function(){
      c.clear(); var o=C[+cs.value], X=x0.value, fs=M3.sz(c,12.5);
      var ax=S.draw.axes(c,{x0:-5,x1:5,y0:-5,y1:5,xl:"x",yl:"y",stepX:1,stepY:1,equal:true}), ctx=c.ctx;
      var i=+cs.value; function cv(f){ S.draw.fn(c,ax,f,P.acc,3); }
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip();
      ctx.strokeStyle=P.acc; ctx.lineWidth=3; ctx.lineCap="round";
      if(i===0) cv(function(x){return x*x/2-2;});
      if(i===1){ ctx.beginPath(); ctx.ellipse(ax.X(0),ax.Y(0),ax.X(3)-ax.X(0),ax.Y(0)-ax.Y(3),0,0,7); ctx.stroke(); }
      if(i===2){ ctx.beginPath(); for(var y=-5;y<=5.001;y+=0.05){ var px=ax.X(y*y/2-2),py=ax.Y(y); if(y===-5) ctx.moveTo(px,py); else ctx.lineTo(px,py);} ctx.stroke(); }
      if(i===3) cv(function(x){return Math.abs(x)-1;});
      if(i===4) cv(function(x){return x===0?NaN:4/x;});
      if(i===5) cv(function(x){return 2*Math.sin(x);});
      if(i===6){ ctx.beginPath(); ctx.moveTo(ax.X(-2),ax.Y(0)); ctx.lineTo(ax.X(5),ax.Y(3.5)); ctx.moveTo(ax.X(-2),ax.Y(0)); ctx.lineTo(ax.X(5),ax.Y(-3.5)); ctx.stroke(); }
      ctx.restore();
      geo.ax=ax;
      /* verticale */
      var Y=o.ys(X), inside=Y.filter(function(y){return y>=-5&&y<=5;});
      var col=Y.length>=2?P.red:Y.length===1?P.green:P.grey;
      ctx.save(); ctx.strokeStyle=T(col,.22); ctx.lineWidth=14; ctx.beginPath(); ctx.moveTo(ax.X(X),ax.T); ctx.lineTo(ax.X(X),ax.B); ctx.stroke(); ctx.restore();
      S.draw.line(c,ax.X(X),ax.T,ax.X(X),ax.B,col,2.4,[7,4]);
      M3.handle(c,ax.X(X),ax.T+30,col,false,9);
      Y.forEach(function(y,j){ if(y>=-5&&y<=5){ S.draw.dot(c,ax.X(X),ax.Y(y),7,col); S.draw.label(c,"y = "+S.fmt(y,2),ax.X(X)+(X>2.5?-12:12),ax.Y(y)+(j%2?18:-14),{color:col,size:fs-1.5,align:X>2.5?"right":"left"}); } });
      S.draw.label(c,Y.length+(Y.length===1?" point":" points"),ax.X(X),ax.B-14,{color:col,size:fs});
      ro.set(0,S.fmt(X,1)); ro.set(1,Y.length+(Y.length&&inside.length<Y.length?" (certains hors du cadre)":"")); ro.set(2,score+" / "+tried);
      if(fb) nt.set(fb.txt,fb.ok?"ok":"bad");
      else if(Y.length>=2) nt.set("Pour x = "+S.fmt(X,1)+" il y a "+Y.length+" valeurs de y : un même x aurait deux images. Ce n'est pas une fonction.","bad");
      else if(Y.length===0) nt.set("Aucun point : "+S.fmt(X,1)+" n'a pas d'image (hors du domaine). Cela n'empêche pas d'être une fonction.","warn");
      else nt.set("Un seul point : pour l'instant, rien n'empêche que ce soit une fonction. Essaie d'autres x.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c02-parking", ch:"c02", tag:"Fonction en escalier", titre:"Tarif de parking : une fonction qui saute",
  resume:"Gratuit 30 minutes, puis 1,50 € par heure entamée, plafonné à 9 €. Où la courbe saute-t-elle ?",
  but:"Fais varier la durée. Cherche la plus longue durée pour payer exactement 4,50 €.",
  aRetenir:"Une heure entamée est due en entier : le prix est constant sur chaque palier puis saute. Sur le graphique, un rond plein marque la valeur prise, un rond vide la valeur non prise.",
  piege:"On ne relie pas les paliers par des segments obliques : il n'y a pas de prix intermédiaire entre 1,50 € et 3 €.",
  build:function(k,S){
    var c=k.canvas(330), P=S.draw.palette;
    function prix(d){ var D=Math.round(d*10), e=D-5; if(e<=0) return 0; return Math.min(9, 1.5*Math.ceil(e/10)); }
    var d=k.slider("Durée de stationnement",0,10,0.1,1,"h");
    var ro=k.readouts(["Durée","Prix à payer","Prix 6 min plus tard"]);
    var nt=k.note("Défi : trouve la durée maximale pour payer 4,50 €.");
    k.draw(function(){
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:10,xl:"durée (h)",yl:"prix (€)",stepX:1,stepY:1}), D=d.value, pr=prix(D);
      for(var j=0;j<=7;j++){
        var xa=j===0?0:0.5+j-1, xb=0.5+j, v=j===0?0:Math.min(9,1.5*j);
        if(j===7){ xa=6.5; xb=10; v=9; }
        S.draw.line(c,ax.X(xa),ax.Y(v),ax.X(xb),ax.Y(v),P.acc,3);
        if(j>0&&j<7){ var ctx=c.ctx; ctx.beginPath(); ctx.arc(ax.X(xa),ax.Y(v),4,0,7); ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle=P.acc; ctx.lineWidth=2; ctx.stroke(); }
        if(j<7) S.draw.dot(c,ax.X(xb),ax.Y(v),4,P.acc);
      }
      S.draw.dot(c,ax.X(D),ax.Y(pr),7,P.red);
      ro.set(0,S.fmt(D,1)+" h"); ro.set(1,S.fmt(pr,2)+" €"); ro.set(2,S.fmt(prix(D+0.1),2)+" €");
      if(pr===4.5&&prix(D+0.1)>4.5) nt.set("Exactement : "+S.fmt(D,1)+" h (3 h 30) est la durée maximale pour 4,50 €. Six minutes de plus et le prix saute à 6 €.","ok");
      else if(pr===4.5) nt.set("Tu paies 4,50 €, mais tu peux encore rester un peu plus sans payer davantage.","warn");
      else nt.set("Défi : trouve la durée maximale pour payer 4,50 €.","");
    });
  }
});
