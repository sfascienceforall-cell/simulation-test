/* Chapitre 4 : intégrale définie, aires et volumes */
SFA.sim({
  id:"m6-c04-riemann", ch:"c04", tag:"Classique",
  titre:"Sommes de Riemann : des rectangles vers l'aire exacte",
  resume:"Augmente le nombre de rectangles : la somme se rapproche de l'intégrale calculée avec une primitive.",
  but:"Choisis une fonction, une méthode (gauche, milieu, droite, inférieure, supérieure) et le nombre n de rectangles, ou lance l'animation. Les zones colorées au-dessus ou en dessous de la courbe sont l'erreur. En bas, la somme se rapproche de la valeur exacte.",
  aRetenir:"∫<sub>a</sub><sup>b</sup> f(x) dx est la limite des sommes de rectangles quand n → +∞. Elle se calcule par F(b) − F(a) avec F une primitive de f. Pour une fonction croissante, la somme à gauche sous-estime et celle de droite surestime.",
  piege:"« À gauche » ne veut pas dire « trop petit » en général : cela dépend de la monotonie de f (pour une fonction décroissante, c'est l'inverse).",
  build:function(k,S){
    var c=M6.canvas(k,1.0,400), P=S.draw.palette;
    var D={
      a:{f:function(x){return x*x;},F:function(x){return x*x*x/3;},a:0,b:3,y1:10},
      b:{f:function(x){return Math.exp(x);},F:function(x){return Math.exp(x);},a:0,b:2,y1:8},
      c:{f:function(x){return Math.sin(x);},F:function(x){return -Math.cos(x);},a:0,b:Math.PI,y1:1.3},
      d:{f:function(x){return 1/x;},F:function(x){return Math.log(x);},a:1,b:4,y1:1.3}
    };
    var sel=k.select("Fonction",[["a","x² sur [0 ; 3]"],["b","eˣ sur [0 ; 2]"],["c","sin x sur [0 ; π]"],["d","1/x sur [1 ; 4]"]],"a");
    var met=k.seg("Hauteur des rectangles",[["g","gauche"],["m","milieu"],["d","droite"],["i","inférieure"],["s","supérieure"]],"g");
    var n=k.slider("Nombre de rectangles n",1,100,1,4,"",null);
    var prog=0, lp=k.loop(function(dt){ prog+=dt/6; if(prog>=1){ prog=1; lp.pause(); } n.set(Math.max(1,Math.round(1+99*prog*prog))); k.redraw(); });
    k.button("Animer n : 1 → 100",function(){ prog=0; lp.play(); },true);
    k.note("<b>Zone verte</b> : la courbe passe au-dessus du rectangle (il manque de l'aire). <b>Zone rouge</b> : le rectangle dépasse la courbe (trop d'aire).","ok");
    var ro=k.readouts(["Somme de Riemann","Intégrale exacte (par primitive)","Erreur","Largeur Δx"]);
    function heights(d,N,m,i){ var dx=(d.b-d.a)/N, xl=d.a+i*dx, xr=xl+dx;
      if(m==="g") return d.f(xl); if(m==="d") return d.f(xr); if(m==="m") return d.f((xl+xr)/2);
      var lo=1e9, hi=-1e9; for(var j=0;j<=12;j++){ var y=d.f(xl+dx*j/12); if(y<lo) lo=y; if(y>hi) hi=y; } return m==="i"?lo:hi; }
    function total(d,N,m){ var s=0,dx=(d.b-d.a)/N; for(var i=0;i<N;i++) s+=heights(d,N,m,i)*dx; return s; }
    k.draw(function(){
      c.clear(); var d=D[sel.value], N=n.value, dx=(d.b-d.a)/N, ctx=c.ctx, W=c.W, H=c.H, fs=M6.fs(c,12), m=met.value;
      var gh=Math.round(H*0.7), sub={W:W,H:gh,ctx:ctx,clear:c.clear};
      var ax=S.draw.axes(sub,{x0:Math.min(0,d.a-0.3),x1:d.b+0.3,y0:0,y1:d.y1,xl:"x",yl:"y",b:28});
      var sum=0, ex=d.F(d.b)-d.F(d.a);
      for(var i=0;i<N;i++){
        var xl=d.a+i*dx, xr=xl+dx, h=heights(d,N,m,i); sum+=h*dx;
        ctx.fillStyle=S.draw.tint(P.mat,0.2); ctx.fillRect(ax.X(xl),ax.Y(h),ax.X(xr)-ax.X(xl),ax.Y(0)-ax.Y(h));
        var mid=d.f((xl+xr)/2); if(N<=60) S.draw.area(sub,ax,d.f,xl,xr,mid>h?P.teal:P.red,0.38,h);
        ctx.strokeStyle=P.mat; ctx.lineWidth=N>40?0.6:1.3; ctx.strokeRect(ax.X(xl),ax.Y(h),ax.X(xr)-ax.X(xl),ax.Y(0)-ax.Y(h));
      }
      S.draw.fn(sub,ax,d.f,P.red,2.8);
      /* convergence : la somme pour n = 1 … 100 */
      var iy=gh+6, ih=H-gh-10, il=46, ir=W-14, it=iy+10, ib=iy+ih-22;
      S.draw.panel(c,6,iy,W-12,ih,{shadow:false});
      var vals=[]; for(var q=1;q<=100;q++) vals.push(total(d,q,m));
      var mn=Math.min.apply(null,vals.concat([ex])), mx=Math.max.apply(null,vals.concat([ex])), pad=(mx-mn)*0.12+1e-9; mn-=pad; mx+=pad;
      var X2=function(q){ return il+(ir-il)*(q-1)/99; }, Y2=function(v){ return ib-(v-mn)/(mx-mn)*(ib-it); };
      S.draw.line(c,il,Y2(ex),ir,Y2(ex),P.green,1.6,[5,4]);
      ctx.save(); ctx.strokeStyle=P.mat; ctx.lineWidth=2; ctx.beginPath(); vals.forEach(function(v,i2){ i2?ctx.lineTo(X2(i2+1),Y2(v)):ctx.moveTo(X2(1),Y2(v)); }); ctx.stroke(); ctx.restore();
      S.draw.dot(c,X2(N),Y2(sum),5,P.red);
      S.draw.text(c,"somme selon n",il,iy+8,{size:11,align:"left",color:P.grey,weight:700}); S.draw.text(c,"valeur exacte "+S.fmt(ex,3),ir,Y2(ex)-9,{size:11,align:"right",color:P.green,weight:700});
      S.draw.text(c,"n",ir,ib+12,{size:11,align:"right",color:P.grey}); S.draw.text(c,"1",il,ib+12,{size:11,color:P.grey}); S.draw.text(c,"100",ir-18,ib+12,{size:11,color:P.grey});
      ro.set(0,S.fmt(sum,4)); ro.set(1,S.fmt(ex,4)); ro.set(2,S.fmt(sum-ex,4)); ro.set(3,S.fmt(dx,3));
    });
  }
});

SFA.sim({
  id:"m6-c04-aire-entre-courbes", ch:"c04", tag:"Classique",
  titre:"Aire entre deux courbes",
  resume:"Déplace la parabole g : trouve les intersections, la courbe du dessus et l'aire.",
  but:"La courbe f(x) = 4 − x² est fixe. Règle g(x) = x² + p·x + q avec les curseurs ou en tirant les deux poignées rouges : l'aire colorée est calculée avec une primitive de f − g entre les abscisses d'intersection.",
  aRetenir:"Aire = ∫<sub>a</sub><sup>b</sup> (courbe du dessus − courbe du dessous) dx, où a et b sont les abscisses d'intersection. On trouve a et b en résolvant f(x) = g(x). Pour p = −2 et q = 0, les courbes se coupent en x = −1 et x = 2 et l'aire vaut 9.",
  piege:"Si tu inverses les courbes (dessous − dessus), tu obtiens un résultat négatif : une aire géométrique n'est jamais négative. Et on n'intègre pas f seule moins g seule sans regarder laquelle est au-dessus.",
  build:function(k,S){
    var c=M6.canvas(k,.78,340), P=S.draw.palette;
    var p=k.slider("p (g(x) = x² + p·x + q)",-3,3,0.1,-2,"",null);
    var q=k.slider("q",-4,2,0.1,0,"",null);
    var ro=k.readouts(["Abscisses d'intersection","∫ (f − g)","∫ (g − f)","Aire géométrique"]);
    var ax=null;
    k.draw(function(){
      c.clear(); var pp=p.value, qq=q.value, fs=M6.fs(c,12);
      var disc=pp*pp-8*(qq-4); var sq=Math.sqrt(disc), r1=(-pp-sq)/4, r2=(-pp+sq)/4;
      var f=function(x){return 4-x*x;}, g=function(x){return x*x+pp*x+qq;};
      ax=S.draw.axes(c,{x0:-3.5,x1:3.5,y0:-6,y1:6,xl:"x",yl:"y",stepX:1,stepY:2});
      S.draw.area(c,ax,f,r1,r2,P.green,0.3,g);
      S.draw.fn(c,ax,f,P.mat,3); S.draw.fn(c,ax,g,P.red,3);
      [r1,r2].forEach(function(r){ S.draw.line(c,ax.X(r),ax.Y(f(r)),ax.X(r),ax.Y(0),P.violet,1.2,[3,3]); S.draw.dot(c,ax.X(r),ax.Y(f(r)),6,P.violet); S.draw.label(c,S.fmt(r,2),ax.X(r),ax.Y(0)+(f(r)>0?16:-16),{color:P.violet,size:fs}); });
      S.draw.legend(c,[[P.mat,"f(x) = 4 − x²"],[P.red,"g(x) = x² + p·x + q"]],ax.R-8,ax.T+4,{align:"right"});
      var H=function(x){return -2*x*x*x/3-pp*x*x/2+(4-qq)*x;};
      var I=H(r2)-H(r1);
      var mx=(r1+r2)/2, my=(f(mx)+g(mx))/2; S.draw.label(c,"aire "+S.fmt(Math.abs(I),2),ax.X(mx),ax.Y(my),{color:P.green,size:M6.fs(c,13)});
      M6.handle(S,c,ax.X(0),ax.Y(g(0)),P.red,false,8); M6.handle(S,c,ax.X(2),ax.Y(g(2)),P.red,false,8);
      ro.set(0,S.fmt(r1,3)+" et "+S.fmt(r2,3)); ro.set(1,S.fmt(I,3)); ro.set(2,S.fmt(-I,3)); ro.set(3,S.fmt(Math.abs(I),3));
    });
    M6.drag(c,function(){ return ax?[{x:ax.X(0),y:ax.Y(q.value)},{x:ax.X(2),y:ax.Y(4+2*p.value+q.value)}]:[]; },function(i,pt){ var v=ax.iy(pt.y);
      if(i===0) q.set(M6.clamp(Math.round(v*10)/10,-4,2)); else p.set(M6.clamp(Math.round((v-4-q.value)/2*10)/10,-3,3)); k.redraw(); },{r:30});
  }
});

SFA.sim({
  id:"m6-c04-aire-algebrique", ch:"c04", tag:"Aire algébrique",
  titre:"L'intégrale compte les aires sous l'axe en négatif",
  resume:"Fais glisser la borne b : l'intégrale et l'aire géométrique ne sont pas la même chose.",
  but:"Fais glisser b (curseur, ou directement sur le graphique). En haut, l'aire algébrique de 0 à b (vert au-dessus de l'axe, rouge en dessous). En bas, la fonction A(b) = ∫₀ᵇ f : sa pente en b est f(b).",
  aRetenir:"∫<sub>a</sub><sup>b</sup> f est une aire <i>algébrique</i> : positive au-dessus de l'axe, négative en dessous. Pour l'aire géométrique, on découpe aux zéros de f et on prend les valeurs absolues. De plus A(b) = ∫₀ᵇ f est une primitive de f : A'(b) = f(b) (théorème fondamental, démontré en 6 h).",
  piege:"Une intégrale nulle ne veut pas dire que l'aire est nulle : pour f(x) = x(x − 2)(x − 4), ∫<sub>0</sub><sup>4</sup> f = 0 car les deux bosses se compensent, mais l'aire géométrique vaut 8.",
  build:function(k,S){
    var c=M6.canvas(k,1.0,400), P=S.draw.palette;
    var sel=k.seg("Fonction",[["p","f(x) = x(x − 2)(x − 4)"],["s","f(x) = sin x"]],"p");
    var b=k.slider("Borne b",0,4,0.05,2.5,"",null);
    var ro=k.readouts(["∫₀ᵇ f","Aire géométrique","f(b)","Pente de A en b"]);
    var ax=null, ax2=null, h1=0;
    function f(x){return sel.value==="p"?x*(x-2)*(x-4):Math.sin(x);}
    function A(x){return sel.value==="p"?x*x*x*x/4-2*x*x*x+4*x*x:1-Math.cos(x);}
    function geo(x){ var n=Math.max(1,Math.round(x/0.002)), h=x/n, s=0; for(var i=0;i<n;i++){ s+=Math.abs(f((i+0.5)*h))*h; } return s; }
    k.draw(function(){
      c.clear(); var B=b.value, ctx=c.ctx, W=c.W, H=c.H, fs=M6.fs(c,12); h1=Math.round(H*0.55);
      var ymax=sel.value==="p"?3.5:1.3, s1={W:W,H:h1,ctx:ctx,clear:c.clear};
      ax=S.draw.axes(s1,{x0:-0.2,x1:4.3,y0:-ymax,y1:ymax,xl:"x",yl:"f(x)",stepX:1,stepY:sel.value==="p"?1:0.5,b:26});
      var N=Math.max(2,Math.round(B/0.02));
      [[1,P.green,0.32],[-1,P.red,0.3]].forEach(function(qq){ ctx.save(); ctx.beginPath(); if(qq[0]>0) ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.Y(0)-ax.T); else ctx.rect(ax.L,ax.Y(0),ax.R-ax.L,ax.B-ax.Y(0)); ctx.clip();
        ctx.beginPath(); ctx.moveTo(ax.X(0),ax.Y(0)); for(var i=0;i<=N;i++){ var xx=B*i/N; ctx.lineTo(ax.X(xx),ax.Y(f(xx))); } ctx.lineTo(ax.X(B),ax.Y(0)); ctx.closePath(); ctx.fillStyle=S.draw.tint(qq[1],qq[2]); ctx.fill(); ctx.restore(); });
      S.draw.fn(s1,ax,f,P.mat,3); S.draw.line(c,ax.X(B),ax.Y(0),ax.X(B),ax.Y(f(B)),P.ink,1.5); M6.handle(S,c,ax.X(B),ax.Y(f(B)),P.ink,false,8);
      S.draw.label(c,"b = "+S.fmt(B,2),ax.X(B),ax.Y(0)+(f(B)>=0?18:-18),{size:fs,color:P.ink});
      ctx.save(); ctx.translate(0,h1+8); var s2={W:W,H:H-h1-8,ctx:ctx,clear:c.clear};
      ax2=S.draw.axes(s2,{x0:-0.2,x1:4.3,y0:sel.value==="p"?-1:-0.3,y1:sel.value==="p"?5:2.3,xl:"b",yl:"A(b)",stepX:1,stepY:sel.value==="p"?1:0.5,b:26});
      S.draw.fn(s2,ax2,function(x){return x>=0?A(x):NaN;},P.violet,3);
      var m=f(B); S.draw.line(s2,ax2.X(B-0.5),ax2.Y(A(B)-0.5*m),ax2.X(B+0.5),ax2.Y(A(B)+0.5*m),P.red,2);
      S.draw.line(s2,ax2.X(B),ax2.Y(0),ax2.X(B),ax2.Y(A(B)),P.grey,1,[3,3]);
      M6.handle(S,s2,ax2.X(B),ax2.Y(A(B)),P.red,false,8); S.draw.label(s2,"tangente de pente f(b) = "+S.fmt(m,2),ax2.R-6,ax2.T+12,{size:fs,color:P.red,align:"right"});
      ctx.restore();
      ro.set(0,S.fmt(A(B),3)); ro.set(1,S.fmt(geo(B),3)); ro.set(2,S.fmt(m,3)); ro.set(3,S.fmt(m,3));
    });
    c.pointer(function(type,p){ if(!ax) return; if(type==="down"||type==="drag"){ var X=(p.y<h1?ax:ax2).ix(p.x); b.set(M6.clamp(Math.round(X*20)/20,0,4)); k.redraw(); } if(type==="move") c.cv.style.cursor="ew-resize"; });
  }
});

SFA.sim({
  id:"m6-c04-revolution", ch:"c04", tag:"Volumes · 3D",
  titre:"Solide de révolution : des disques empilés",
  resume:"Fais tourner une courbe autour de l'axe des x : le volume est une somme de disques, à tourner dans l'espace.",
  but:"Choisis une courbe, la borne b et le nombre de disques n. Glisse sur le dessin pour tourner le solide. La somme des volumes des disques s'approche de V = π∫ f(x)² dx.",
  aRetenir:"Le volume engendré par la rotation de y = f(x) autour de l'axe des x, de a à b, vaut V = π ∫<sub>a</sub><sup>b</sup> [f(x)]² dx : on empile des disques de rayon f(x) et d'épaisseur dx. Contrôle : pour f(x) = x/2 et b = 4, on retrouve le cône de rayon 2 et de hauteur 4 : V = ⅓π·2²·4 = 16π/3 ≈ 16,76.",
  piege:"Le rayon est f(x), mais on intègre π·f(x)² : le carré est sur f, pas sur l'intégrale. Le carré de l'intégrale (∫f)² est autre chose.",
  build:function(k,S){
    var c=M6.canvas(k,.8,340), P=S.draw.palette;
    var v=M6.cam3(c,S,{L:4.6,yaw:-0.6,pitch:0.3,dist:8,zoom:1.85});
    var D={
      a:{f:function(x){return x/2;},V:function(b){return Math.PI*b*b*b/12;},n:"cône : f(x) = x/2",ym:3},
      b:{f:function(x){return Math.sqrt(x);},V:function(b){return Math.PI*b*b/2;},n:"f(x) = √x",ym:2.4},
      c:{f:function(x){return Math.sin(x);},V:function(b){return Math.PI*(b/2-Math.sin(2*b)/4);},n:"f(x) = sin x",ym:1.4},
      d:{f:function(x){return x*x/4;},V:function(b){return Math.PI*Math.pow(b,5)/80;},n:"f(x) = x²/4",ym:4.2}
    };
    var sel=k.select("Courbe",[["a","cône : f(x) = x/2"],["b","f(x) = √x"],["c","f(x) = sin x"],["d","f(x) = x²/4"]],"a");
    var b=k.slider("Borne b",0.5,4,0.1,3,"",null);
    var n=k.slider("Nombre de disques n",1,40,1,6,"",null);
    k.button("Vue de profil (coupe)",function(){ v.yaw=0; v.pitch=0; },false);
    k.button("Vue en perspective",function(){ v.yaw=-0.75; v.pitch=0.32; });
    v.attach(k);
    var ro=k.readouts(["Somme des disques","Volume exact V","Erreur","Rayon en b"]);
    var SEG=40, LIGHT=(function(){ var l=[-0.45,0.6,-0.66], m=Math.hypot(l[0],l[1],l[2]); return [l[0]/m,l[1]/m,l[2]/m]; })();
    function shade(nv,bo){ var d=Math.max(0,nv[0]*LIGHT[0]+nv[1]*LIGHT[1]+nv[2]*LIGHT[2]), t=0.18+0.82*d; t=t+(1-t)*(bo||0); return "rgb("+Math.round(28+t*108)+","+Math.round(58+t*118)+","+Math.round(140+t*100)+")"; }
    k.draw(function(){
      c.clear(); var d=D[sel.value], B=b.value, N=n.value, dx=B/N, ctx=c.ctx, fs=M6.fs(c,12), OFF=2.0;
      var Q=function(x,y,z){ return [x-OFF,y,z]; };
      /* repère : axe des x gradué, plan de référence léger */
      v.line(Q(-0.3,0,0),Q(4.9,0,0),"#8a95a3",1.4); S.draw.arrow(c,v.P(Q(4.6,0,0)).x,v.P(Q(4.6,0,0)).y,v.P(Q(5.1,0,0)).x,v.P(Q(5.1,0,0)).y,"#8a95a3",1.4);
      for(var t=0;t<=4;t++) v.text(Q(t,0,0),String(t),{dy:12,dx:0,size:10.5,color:"#7b8694"});
      v.text(Q(5.3,0,0),"x",{size:14,color:"#5f6b7a",math:true,italic:true});
      /* caméra dans le repère du solide (pour l'ordre de dessin et l'élimination des faces cachées) */
      var cy=Math.cos(v.yaw), sy=Math.sin(v.yaw), cp=Math.cos(v.pitch), sp=Math.sin(v.pitch), yy=-v.dist*cp, camW=[yy*sy+OFF,yy*cy,v.dist*sp];
      var sum=0, slabs=[]; for(var i=0;i<N;i++){ var xm=(i+0.5)*dx, r=d.f(xm); sum+=Math.PI*r*r*dx; slabs.push({x0:i*dx,x1:(i+1)*dx,r:r}); }
      var cxw=camW[0]; var order=slabs.slice().sort(function(a,b2){ var ca=(a.x0+a.x1)/2, cb=(b2.x0+b2.x1)/2; return Math.abs(cb-cxw)-Math.abs(ca-cxw); });
      order.forEach(function(sl){
        var quads=[];
        for(var j=0;j<SEG;j++){ var a0=j/SEG*6.2832, a1=(j+1)/SEG*6.2832, am=(a0+a1)/2, ny=Math.cos(am), nz=Math.sin(am);
          var cen=[(sl.x0+sl.x1)/2,sl.r*ny,sl.r*nz], toC=[camW[0]-(cen[0]-OFF+OFF),camW[1]-cen[1],camW[2]-cen[2]];
          if(toC[1]*ny+toC[2]*nz<=0) continue;   /* face cachée */
          var nv=v.tr([0,ny,nz]), col=shade(nv);
          ctx.beginPath(); [[sl.x0,a0],[sl.x1,a0],[sl.x1,a1],[sl.x0,a1]].forEach(function(q2,ii){ var pp=v.P(Q(q2[0],sl.r*Math.cos(q2[1]),sl.r*Math.sin(q2[1]))); ii?ctx.lineTo(pp.x,pp.y):ctx.moveTo(pp.x,pp.y); }); ctx.closePath();
          ctx.fillStyle=col; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=0.7; ctx.stroke(); }
        [[sl.x1,1],[sl.x0,-1]].forEach(function(cap){ if((cxw-(cap[0]))*cap[1]<=0) return; ctx.beginPath(); for(var j2=0;j2<=SEG;j2++){ var aa=j2/SEG*6.2832, pp=v.P(Q(cap[0],sl.r*Math.cos(aa),sl.r*Math.sin(aa))); j2?ctx.lineTo(pp.x,pp.y):ctx.moveTo(pp.x,pp.y); } ctx.closePath();
          ctx.fillStyle=shade(v.tr([cap[1],0,0]),0.45); ctx.fill(); ctx.strokeStyle="rgba(255,255,255,.55)"; ctx.lineWidth=N>25?0.6:1.1; ctx.stroke(); });
      });
      /* courbe génératrice (rouge) et son symétrique */
      ctx.save(); ctx.lineWidth=2.8; ctx.lineJoin="round"; [1,-1].forEach(function(sg){ ctx.strokeStyle=sg>0?P.red:S.draw.tint(P.red,0.7); ctx.setLineDash(sg>0?[]:[5,4]); ctx.beginPath(); for(var i2=0;i2<=60;i2++){ var xx=B*i2/60, pp=v.P(Q(xx,sg*d.f(xx),0)); i2?ctx.lineTo(pp.x,pp.y):ctx.moveTo(pp.x,pp.y); } ctx.stroke(); }); ctx.restore();
      var rb=d.f(B); ctx.save(); ctx.strokeStyle=P.violet; ctx.lineWidth=2; ctx.beginPath(); for(var j3=0;j3<=SEG;j3++){ var a3=j3/SEG*6.2832, pq=v.P(Q(B,rb*Math.cos(a3),rb*Math.sin(a3))); j3?ctx.lineTo(pq.x,pq.y):ctx.moveTo(pq.x,pq.y); } ctx.stroke(); ctx.restore();
      v.line(Q(B,0,0),Q(B,rb,0),P.violet,1.6,[3,3]); v.text(Q(B,rb/2,0),"r = "+S.fmt(rb,2),{dx:22,size:fs,color:P.violet});
      v.hint("Glisse pour tourner le solide");
      M6.tag(S,c,d.n+" · "+N+" disque"+(N>1?"s":""),10,18,P.ink,{size:M6.fs(c,12.5)});
      var V=d.V(B);
      ro.set(0,S.fmt(sum,3)); ro.set(1,S.fmt(V,3)); ro.set(2,S.fmt(sum-V,3)); ro.set(3,S.fmt(d.f(B),3));
    });
  }
});
