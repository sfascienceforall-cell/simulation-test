/* Chapitre 2 : dérivation de exp et ln, croissances comparées, étude de fonctions */
SFA.sim({
  id:"m6-c02-exp-derivee", ch:"c02", tag:"Classique",
  titre:"Pourquoi e^x est égale à sa dérivée",
  resume:"Déplace un point sur a^x : la pente de la tangente est-elle égale à la hauteur ?",
  but:"Choisis une base a et glisse le point sur la courbe. Compare la pente de la tangente à la hauteur du point : le rapport pente/hauteur est constant et vaut ln a.",
  aRetenir:"(a<sup>x</sup>)' = ln a · a<sup>x</sup>. Le rapport pente / hauteur vaut ln a en tout point. Il vaut 1 pour a = e : c'est pour cela que (e<sup>x</sup>)' = e<sup>x</sup>. Avec une fonction composée : (e<sup>u(x)</sup>)' = u'(x)·e<sup>u(x)</sup>.",
  piege:"(e<sup>x</sup>)' ≠ x·e<sup>x−1</sup> : la règle des puissances (x<sup>n</sup>)' = n·x<sup>n−1</sup> concerne la variable en bas, pas en exposant.",
  build:function(k,S){
    var c=M6.canvas(k,.78,330), P=S.draw.palette;
    var base=k.seg("Base a",[["2","a = 2"],["e","a = e"],["3","a = 3"],["0.5","a = 1/2"]],"e");
    var t=k.slider("Abscisse x du point",-2,2.4,0.05,1,"",null);
    var ro=k.readouts(["Hauteur f(x)","Pente f'(x)","Pente / hauteur","ln a"]);
    var nt=k.note("","ok"), ax=null;
    function B(){return base.value==="e"?Math.E:parseFloat(base.value);}
    k.draw(function(){
      c.clear(); var a=B(), x0=t.value, y0=Math.pow(a,x0), m=Math.log(a)*y0, fs=M6.fs(c,12), la=Math.log(a);
      ax=S.draw.axes(c,{x0:-2.5,x1:3.5,y0:-2,y1:16,xl:"x",yl:"y",stepX:1,stepY:2});
      S.draw.fn(c,ax,function(x){return Math.pow(a,x);},P.mat,3.2);
      S.draw.fn(c,ax,function(x){return y0+m*(x-x0);},P.red,2);
      /* hauteur (vert) et pente (rouge) : segment vertical et triangle de pente sur une unité */
      S.draw.line(c,ax.X(x0),ax.Y(0),ax.X(x0),ax.Y(y0),P.green,3);
      S.draw.line(c,ax.X(x0),ax.Y(y0),ax.X(x0+1),ax.Y(y0),P.red,1.2,[3,3]); S.draw.line(c,ax.X(x0+1),ax.Y(y0),ax.X(x0+1),ax.Y(y0+m),P.red,3);
      S.draw.label(c,"hauteur "+S.fmt(y0,2),ax.X(x0)-6,ax.Y(Math.max(y0/2,0.9)),{size:fs,color:P.green,align:"right"});
      S.draw.label(c,"pente "+S.fmt(m,2),ax.X(x0+1)+6,ax.Y(y0+m/2),{size:fs,color:P.red,align:"left"});
      M6.handle(S,c,ax.X(x0),ax.Y(y0),P.mat,false,8);
      /* jauges : hauteur contre pente (la plus grande occupe toute la largeur) */
      var bx=ax.L+14, by=ax.T+14, bw=Math.min(130,c.W*0.3), sc=bw/Math.max(y0,Math.abs(m),1e-9);
      S.draw.panel(c,bx-8,by-8,bw+16,64,{shadow:false});
      c.ctx.fillStyle=P.green; c.ctx.fillRect(bx,by,y0*sc,20); c.ctx.fillStyle=P.red; c.ctx.fillRect(bx,by+28,Math.abs(m)*sc,20);
      S.draw.text(c,"hauteur",bx+4,by+10,{size:11,align:"left",color:"#fff"}); S.draw.text(c,"pente",bx+4,by+38,{size:11,align:"left",color:"#fff"});
      ro.set(0,S.fmt(y0,3)); ro.set(1,S.fmt(m,3)); ro.set(2,S.fmt(m/y0,3)); ro.set(3,S.fmt(la,3));
      nt.set(Math.abs(la-1)<1e-9?"Pour a = e, les deux barres sont toujours égales : pente = hauteur, quel que soit x.":"Pour a = "+(base.value==="e"?"e":S.fmt(a,2))+", la pente vaut ln a = "+S.fmt(la,3)+" fois la hauteur : "+(la>0?"les barres ne sont jamais égales sauf si ln a = 1.":"elle est négative (la courbe descend)."),Math.abs(la-1)<1e-9?"ok":"warn");
    });
    M6.drag(c,function(){ return ax?[{x:ax.X(t.value),y:ax.Y(Math.pow(B(),t.value))}]:[]; },function(i,p){ t.set(M6.clamp(Math.round(ax.ix(p.x)*20)/20,-2,2.4)); k.redraw(); },{r:30,miss:function(p,ph){ if(ph==="up"||!ax) return; t.set(M6.clamp(Math.round(ax.ix(p.x)*20)/20,-2,2.4)); k.redraw(); }});
  }
});

SFA.sim({
  id:"m6-c02-croissance", ch:"c02", tag:"Modèle · Niche utile",
  titre:"y' = k·y : croissance exponentielle, puis logistique",
  resume:"Ajuste k pour coller à des données, puis découvre la courbe en S et son point d'inflexion à K/2.",
  but:"Mode exponentiel : tire les deux poignées de la courbe (y₀ à gauche, la valeur en t = 6 à droite) pour qu'elle passe près des 7 points mesurés. Mode logistique : règle k, y₀ et la capacité K et repère le point d'inflexion.",
  aRetenir:"Si la vitesse y' est proportionnelle à y, alors y(t) = y₀·e<sup>kt</sup>. Dans le modèle logistique y' = k·y·(1 − y/K) (modèle simplifié), la population tend vers K et la croissance est la plus rapide quand y = K/2 : c'est le point d'inflexion de la courbe en S.",
  piege:"Une croissance « exponentielle » ne dure jamais indéfiniment dans la réalité : les ressources sont limitées. Le modèle logistique est simplifié lui aussi (K constante, pas de variations aléatoires).",
  build:function(k,S){
    var c=M6.canvas(k,.72,320), P=S.draw.palette;
    var mod=k.seg("Modèle",[["exp","Exponentiel"],["log","Logistique"]],"exp");
    var kk=k.slider("Taux k",-0.5,1,0.01,0.2,"",null);
    var y0=k.slider("Valeur initiale y₀",1,10,0.1,2,"",null);
    var K=k.slider("Capacité K (logistique)",20,100,5,60,"",null);
    var res=k.toggle("Montrer les écarts aux mesures",true);
    var ro=k.readouts(["Somme des carrés d'écart","y(6)","Vitesse y'(6)","Inflexion"]);
    var nt=k.note("","warn"), ax=null;
    var noise=[0.03,-0.04,0.02,-0.02,0.04,-0.03,0.01], data=[];
    for(var i=0;i<=6;i++) data.push(3*Math.exp(0.4*i)*(1+noise[i]));
    function f(t){ var m=mod.value, r=kk.value, Y0=y0.value, KK=K.value; return m==="exp" ? Y0*Math.exp(r*t) : KK/(1+((KK-Y0)/Y0)*Math.exp(-r*t)); }
    function hand(){ if(!ax) return []; var m=mod.value; if(m==="exp") return [{x:ax.X(0),y:ax.Y(y0.value),id:"y0"},{x:ax.X(6),y:ax.Y(f(6)),id:"k"}]; return [{x:ax.X(0),y:ax.Y(y0.value),id:"y0"},{x:ax.X(19),y:ax.Y(K.value),id:"K"}]; }
    k.draw(function(){
      c.clear(); var m=mod.value, r=kk.value, Y0=y0.value, KK=K.value, fs=M6.fs(c,12);
      function fp(t){ return m==="exp" ? r*f(t) : r*f(t)*(1-f(t)/KK); }
      var T1=m==="exp"?6.5:20, Ytop=m==="exp"?40:KK*1.15;
      ax=S.draw.axes(c,{x0:0,x1:T1,y0:0,y1:Ytop,xl:"t",yl:"y"});
      S.draw.area(c,ax,f,0,T1,P.mat,0.06);
      S.draw.fn(c,ax,f,P.mat,3.2);
      if(m==="exp"){
        var sce=0; data.forEach(function(d,i){ var e=d-f(i); sce+=e*e; if(res.value) S.draw.line(c,ax.X(i),ax.Y(d),ax.X(i),ax.Y(f(i)),P.amber,2); S.draw.dot(c,ax.X(i),ax.Y(d),5,P.red); });
        ro.set(0,S.fmt(sce,2)); ro.set(3,"—");
        S.draw.label(c,"mesures (rouge)",ax.R-8,ax.T+12,{align:"right",color:P.red,size:fs});
        if(sce<2) nt.set("Bravo : la courbe colle aux données (somme des carrés "+S.fmt(sce,2)+"). Les mesures viennent de y = 3·e<sup>0,4t</sup>, avec un peu de bruit.","ok");
        else nt.set("Tire les poignées pour rapprocher la courbe des points rouges (objectif : somme des carrés &lt; 2, ici "+S.fmt(sce,1)+"). Indice : le 1er point donne y₀ ; entre deux points voisins, y est multiplié par e<sup>k</sup>.","warn");
        hand().forEach(function(h){ M6.handle(S,c,h.x,h.y,P.violet,false,8); });
        S.draw.label(c,"y₀",ax.X(0)+14,ax.Y(Y0)-12,{color:P.violet,size:fs,align:"left"}); S.draw.label(c,"k = "+S.fmt(r,2),ax.X(6)-12,ax.Y(f(6))-14,{color:P.violet,size:fs,align:"right"});
      } else {
        ro.set(0,"—");
        S.draw.line(c,ax.X(0),ax.Y(KK),ax.X(T1),ax.Y(KK),P.grey,1.2,[5,4]);
        S.draw.label(c,"K = "+S.fmt(KK,0),ax.X(T1)-30,ax.Y(KK)-14,{size:fs,align:"right",color:P.grey});
        if(Y0<KK/2 && r>0){
          var ts=Math.log((KK-Y0)/Y0)/r;
          S.draw.line(c,ax.X(0),ax.Y(KK/2),ax.X(Math.min(ts,T1)),ax.Y(KK/2),P.red,1.4,[4,4]);
          S.draw.line(c,ax.X(KK>0?Math.min(ts,T1):0),ax.Y(KK/2),ax.X(Math.min(ts,T1)),ax.Y(0),P.red,1.2,[4,4]);
          if(ts<=T1){ S.draw.dot(c,ax.X(ts),ax.Y(KK/2),7,P.red); S.draw.label(c,"inflexion (t = "+S.fmt(ts,1)+" ; y = K/2)",ax.X(ts)+10,ax.Y(KK/2)+22,{size:fs,align:"left",color:P.red}); }
          ro.set(3,"t = "+S.fmt(ts,2)+", y = "+S.fmt(KK/2,1));
          nt.set("Au point d'inflexion, y = K/2 et la vitesse y' = kK/4 = "+S.fmt(r*KK/4,2)+" est maximale.","ok");
        } else { ro.set(3,"hors du graphique"); nt.set(r<=0?"Avec k ≤ 0 la population ne croît pas.":"Ici y₀ ≥ K/2 : on est déjà après l'inflexion, la courbe est concave dès le départ.","warn"); }
        hand().forEach(function(h){ M6.handle(S,c,h.x,h.y,P.violet,false,8); });
      }
      ro.set(1,S.fmt(f(6),2)); ro.set(2,S.fmt(fp(6),2));
    });
    M6.drag(c,hand,function(i,p){ var h=hand()[i], v=ax.iy(p.y);
      if(h.id==="y0") y0.set(M6.clamp(Math.round(v*10)/10,1,10));
      else if(h.id==="k"){ var yy=Math.max(0.5,v); kk.set(M6.clamp(Math.round(Math.log(yy/y0.value)/6*100)/100,-0.5,1)); }
      else if(h.id==="K") K.set(M6.clamp(Math.round(v/5)*5,20,100));
      k.redraw(); },{r:28});
  }
});

SFA.sim({
  id:"m6-c02-comparees", ch:"c02", tag:"Croissances comparées",
  titre:"Qui gagne à l'infini : e^x, x^n ou ln x ?",
  resume:"Fais grandir x : une course entre ln x, x^n et e^x, et le quotient qui s'effondre vers 0.",
  but:"Choisis le quotient puis fais grandir x (curseur ou glisse sur le graphique). En haut, la courbe du quotient ; en bas, la course des trois fonctions (barres en échelle logarithmique). Même pour n = 5, l'exponentielle finit toujours par écraser la puissance.",
  aRetenir:"lim x<sup>n</sup>/e<sup>x</sup> = 0 quand x → +∞ (pour tout n) ; lim ln x / x<sup>n</sup> = 0 ; lim x<sup>n</sup>·e<sup>−x</sup> = 0. Ordre de croissance : ln x ≪ x<sup>n</sup> ≪ e<sup>x</sup>. Mais pour x petit, une puissance peut très bien être plus grande que e<sup>x</sup>.",
  piege:"Le quotient peut d'abord monter très haut avant de redescendre (pour n = 5 il vaut déjà 21 en x = 5). Dire « elle finit par gagner » ne veut pas dire « elle gagne tout de suite ».",
  build:function(k,S){
    var c=M6.canvas(k,.95,380), P=S.draw.palette;
    var q=k.seg("Quotient",[["pe","x^n / e^x"],["lx","ln x / x^n"]],"pe");
    var n=k.slider("Exposant n",1,5,1,3,"",null);
    var x=k.slider("x",1,40,0.5,10,"",null);
    var ro=k.readouts(["Numérateur","Dénominateur","Quotient","x où le quotient est maximal"]);
    var nt=k.note("","ok"), ax=null;
    k.draw(function(){
      c.clear(); var N=n.value, X=x.value, mode=q.value, ctx=c.ctx, W=c.W, H=c.H, fs=M6.fs(c,12);
      function num(v){return mode==="pe"?Math.pow(v,N):Math.log(v);} function den(v){return mode==="pe"?Math.exp(v):Math.pow(v,N);}
      function r(v){return num(v)/den(v);}
      var xmaxPt = mode==="pe"?N:Math.exp(1/N);
      var xe=Math.max(10,Math.ceil(Math.max(X*1.25,mode==="pe"?N*3.2:xmaxPt*4)/5)*5);
      var ymax = (mode==="pe"?r(N):r(xmaxPt))*1.2;
      var gh=Math.round(H*0.62), sub={W:W,H:gh,ctx:ctx,clear:c.clear};
      ax=S.draw.axes(sub,{x0:0,x1:xe,y0:0,y1:ymax,xl:"x",yl:"quotient",b:28});
      S.draw.area(sub,ax,function(v){return v>0?r(v):0;},0,xe,P.mat,0.08);
      S.draw.fn(sub,ax,function(v){return v>0?r(v):NaN;},P.mat,3);
      var yq=Math.max(0,r(X));
      S.draw.line(c,ax.X(X),ax.Y(0),ax.X(X),ax.Y(Math.min(yq,ymax)),P.red,1.4,[4,4]);
      M6.handle(S,c,ax.X(X),ax.Y(Math.min(yq,ymax)),P.red,false,8);
      S.draw.dot(c,ax.X(xmaxPt),ax.Y(r(xmaxPt)),4.5,P.green); S.draw.label(c,"maximum",ax.X(xmaxPt)+10,ax.Y(r(xmaxPt))-12,{size:fs,color:P.green,align:"left"});
      /* la course : trois barres en échelle logarithmique (longueur = log10 de la valeur, à partir de 1) */
      var oy=gh+16, bh=Math.max(16,Math.round((H-gh-34)/3)-4), lx=64, rx=W-14, items=[["ln x",Math.log(X),P.green],["x"+(N>1?M6.sup(N):""),Math.pow(X,N),P.amber],["e^x",Math.exp(X),P.mat]];
      var lmax=Math.max(1,Math.ceil(Math.log10(Math.max(Math.exp(Math.min(X,300)),10))));
      S.draw.text(c,"La course en x = "+S.fmt(X,1)+" (échelle log : chaque graduation = ×10)",12,oy-2,{size:11,align:"left",color:P.grey,weight:700});
      items.forEach(function(it,i){ var y=oy+10+i*(bh+4), v=Math.max(it[1],1e-9), L10=Math.max(0,Math.log10(v)), w=(rx-lx)*Math.min(1,L10/lmax);
        S.draw.text(c,it[0],lx-8,y+bh/2,{size:fs,align:"right",color:it[2],math:true});
        ctx.fillStyle="#f1f3f7"; ctx.fillRect(lx,y,rx-lx,bh); ctx.fillStyle=it[2]; ctx.fillRect(lx,y,Math.max(2,w),bh);
        S.draw.text(c,M6.sci(S,it[1]),w>(rx-lx)*0.6?lx+w-8:lx+Math.max(2,w)+6,y+bh/2,{size:12,align:w>(rx-lx)*0.6?"right":"left",color:w>(rx-lx)*0.6?"#fff":it[2]}); });
      ro.set(0,S.sci(num(X))); ro.set(1,S.sci(den(X))); ro.set(2,S.sci(r(X),3)); ro.set(3,S.fmt(xmaxPt,2));
      nt.set(mode==="pe"?"x = "+S.fmt(X,1)+" : "+(r(X)>1?"x^"+N+" est encore plus grand que e^x (quotient &gt; 1).":"e^x a pris le dessus (quotient &lt; 1) et l'écart se creuse : le quotient tend vers 0."):"ln x / x^"+N+" vaut "+S.sci(r(X),3)+" : la puissance écrase le logarithme.", "ok");
    });
    M6.drag(c,function(){ if(!ax) return []; var X=x.value, mode=q.value, N=n.value; var yq=mode==="pe"?Math.pow(X,N)/Math.exp(X):Math.log(X)/Math.pow(X,N); return [{x:ax.X(X),y:ax.Y(Math.min(Math.max(0,yq),ax.y1))}]; },function(i,p){ x.set(M6.clamp(Math.round(ax.ix(p.x)*2)/2,1,40)); k.redraw(); },{r:34,miss:function(p,ph){ if(ph==="up"||!ax||p.y>ax.B) return; x.set(M6.clamp(Math.round(ax.ix(p.x)*2)/2,1,40)); k.redraw(); }});
  }
});

SFA.sim({
  id:"m6-c02-etude", ch:"c02", tag:"Étude guidée",
  titre:"Étude complète d'une fonction, étape par étape",
  resume:"Domaine, asymptotes, signe de f', extremum, inflexion : la courbe et le tableau de variations se construisent à chaque étape.",
  but:"Choisis une fonction puis fais avancer les étapes. À chaque étape, la liste dit ce qu'il faut calculer, le graphique et le tableau de variations montrent le résultat.",
  aRetenir:"Checklist : 1) domaine ; 2) limites aux bornes et asymptotes ; 3) f' et son signe ; 4) tableau de variation et extremum ; 5) f'' (6 h : concavité et inflexion) ; 6) courbe. On n'oublie jamais de vérifier le domaine avant de dériver un logarithme.",
  piege:"Une asymptote horizontale n'empêche pas la courbe de la couper. Et ln x / x tend vers 0 en +∞ : l'axe des x est asymptote, mais la courbe reste positive après x = 1.",
  build:function(k,S){
    var c=M6.canvas(k,1.02,400), P=S.draw.palette, E=Math.E;
    var F={
      A:{n:"f(x) = x·e^(−x)",f:function(x){return x*Math.exp(-x);},x0:-1.5,x1:7,y0:-1,y1:1,dom:"D = ℝ",
         lim:"lim(+∞) = 0 (croissances comparées) : asymptote y = 0. lim(−∞) = −∞ : pas d'asymptote.",
         der:"f'(x) = (1 − x)·e^(−x). Signe de 1 − x : f' &gt; 0 si x &lt; 1, f' &lt; 0 si x &gt; 1.",
         ext:"Maximum en x = 1 : f(1) = 1/e ≈ 0,368.",
         inf:"f''(x) = (x − 2)·e^(−x) : inflexion en x = 2, f(2) = 2/e² ≈ 0,271.",
         asv:null,ash:0,extx:1,infx:2,cols:["−∞","1","+∞"],sg:["+","−"],vr:[["−∞"],["1/e"],["0"]],arr:["up","down"]},
      B:{n:"f(x) = ln(x) / x",f:function(x){return x>0?Math.log(x)/x:NaN;},x0:-0.5,x1:10,y0:-2,y1:0.6,dom:"D = ]0 ; +∞[",
         lim:"lim(0⁺) = −∞ : asymptote verticale x = 0. lim(+∞) = 0 : asymptote horizontale y = 0.",
         der:"f'(x) = (1 − ln x) / x². f' &gt; 0 si ln x &lt; 1, c'est-à-dire x &lt; e ; f' &lt; 0 si x &gt; e.",
         ext:"Maximum en x = e ≈ 2,718 : f(e) = 1/e ≈ 0,368.",
         inf:"f''(x) = (2 ln x − 3) / x³ : inflexion en x = e<sup>1,5</sup> ≈ 4,482, f ≈ 0,335.",
         asv:0,ash:0,extx:E,infx:Math.exp(1.5),cols:["0","e","+∞"],sg:["+","−"],vr:[["−∞"],["1/e"],["0"]],arr:["up","down"]},
      C:{n:"f(x) = x − ln(x)",f:function(x){return x>0?x-Math.log(x):NaN;},x0:-0.5,x1:6,y0:-0.5,y1:6,dom:"D = ]0 ; +∞[",
         lim:"lim(0⁺) = +∞ : asymptote verticale x = 0. En +∞, f(x) − x = −ln x → −∞ : pas d'asymptote oblique y = x ; f(x)/x → 1 mais la courbe s'éloigne de la droite.",
         der:"f'(x) = 1 − 1/x = (x − 1)/x. f' &lt; 0 si x &lt; 1 ; f' &gt; 0 si x &gt; 1.",
         ext:"Minimum en x = 1 : f(1) = 1.",
         inf:"f''(x) = 1/x² &gt; 0 : la courbe est convexe partout, pas d'inflexion.",
         asv:0,ash:null,extx:1,infx:null,cols:["0","1","+∞"],sg:["−","+"],vr:[["+∞"],["1"],["+∞"]],arr:["down","up"]},
      D:{n:"f(x) = e^x / x",f:function(x){return x!==0?Math.exp(x)/x:NaN;},x0:-4,x1:4,y0:-2,y1:12,dom:"D = ℝ \\ {0}",
         lim:"lim(0⁻) = −∞ ; lim(0⁺) = +∞ : asymptote verticale x = 0. lim(−∞) = 0⁻ : asymptote y = 0. lim(+∞) = +∞.",
         der:"f'(x) = e^x (x − 1) / x². Signe de x − 1 : f' &lt; 0 si x &lt; 1 (x ≠ 0), f' &gt; 0 si x &gt; 1.",
         ext:"Minimum local en x = 1 : f(1) = e ≈ 2,718.",
         inf:"f''(x) = e^x (x² − 2x + 2) / x³ : le trinôme est toujours positif, donc f'' a le signe de x : pas d'inflexion (x = 0 est hors du domaine).",
         asv:0,ash:0,extx:1,infx:null,cols:["−∞","0","1","+∞"],sg:["−","−","+"],vr:[["0"],["−∞","+∞"],["e"],["+∞"]],arr:["down","down","up"],gap:1}
    };
    var sel=k.select("Fonction",[["A","x·e^(−x)"],["B","ln(x) / x"],["C","x − ln(x)"],["D","e^x / x"]],"A");
    var st=k.slider("Étape (1 à 6)",1,6,1,1,"",null);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var d=F[sel.value], s=st.value, ctx=c.ctx, W=c.W, H=c.H, fs=M6.fs(c,12);
      var gh=Math.round(H*0.66), sub={W:W,H:gh,ctx:ctx,clear:c.clear};
      var ax=S.draw.axes(sub,{x0:d.x0,x1:d.x1,y0:d.y0,y1:d.y1,xl:"x",yl:"y",b:28});
      S.draw.fn(sub,ax,d.f,s>=3?"#9aa5b5":P.mat,3);
      if(s>=3){
        ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip();
        var seg=function(a,b,color){ ctx.strokeStyle=color; ctx.lineWidth=4.5; ctx.lineCap="round"; ctx.beginPath(); var on=false; for(var i=0;i<=300;i++){var x=a+(b-a)*i/300,y=d.f(x); if(!isFinite(y)||Math.abs(ax.Y(y))>1e5){on=false;continue;} if(!on){ctx.moveTo(ax.X(x),ax.Y(y));on=true;}else ctx.lineTo(ax.X(x),ax.Y(y));} ctx.stroke(); };
        var sw=d.extx, G=P.green, R=P.red;
        if(sel.value==="A"){ seg(d.x0,sw,G); seg(sw,d.x1,R); } else if(sel.value==="B"){ seg(0.0001,sw,G); seg(sw,d.x1,R); }
        else if(sel.value==="C"){ seg(0.0001,sw,R); seg(sw,d.x1,G); } else { seg(d.x0,-1e-6,R); seg(1e-6,sw,R); seg(sw,d.x1,G); }
        ctx.restore();
      }
      if(s>=2){ if(d.asv!==null) S.draw.line(c,ax.X(d.asv),ax.T,ax.X(d.asv),ax.B,P.amber,1.6,[6,4]); if(d.ash!==null) S.draw.line(c,ax.L,ax.Y(d.ash),ax.R,ax.Y(d.ash),P.amber,1.6,[6,4]); if(d.asv!==null) S.draw.label(c,"x = 0",ax.X(d.asv)+6,ax.T+26,{size:fs,color:P.amber,align:"left"}); if(d.ash!==null) S.draw.label(c,"y = 0",ax.R-6,ax.Y(d.ash)-14,{size:fs,color:P.amber,align:"right"}); }
      if(s>=4){ var ey=d.f(d.extx); S.draw.dot(c,ax.X(d.extx),ax.Y(ey),7,P.violet); S.draw.label(c,sel.value==="C"||sel.value==="D"?"minimum":"maximum",ax.X(d.extx)+10,ax.Y(ey)+(sel.value==="C"||sel.value==="D"?18:-14),{size:fs,color:P.violet,align:"left"}); }
      if(s>=5 && d.infx!==null){ var iy=d.f(d.infx); S.draw.dot(c,ax.X(d.infx),ax.Y(iy),7,P.teal); S.draw.label(c,"inflexion",ax.X(d.infx)+10,ax.Y(iy)-14,{size:fs,color:P.teal,align:"left"}); }
      S.draw.label(c,d.n,ax.R-6,ax.T+12,{size:M6.fs(c,13),align:"right",color:P.ink,math:true});
      /* tableau de variations (dessiné à partir de l'étape 3) */
      var ty=gh+6, th=H-gh-12, nC=d.cols.length, x0=54, x1=W-16, rowH=th/3;
      S.draw.panel(c,8,ty,W-16,th,{shadow:false});
      var cx=function(i){ return x0+(x1-x0)*i/(nC-1); };
      ctx.save(); ctx.strokeStyle="#d3d9e2"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(8,ty+rowH); ctx.lineTo(W-8,ty+rowH); ctx.moveTo(8,ty+2*rowH); ctx.lineTo(W-8,ty+2*rowH); ctx.moveTo(x0-14,ty); ctx.lineTo(x0-14,ty+th); ctx.stroke(); ctx.restore();
      S.draw.text(c,"x",31,ty+rowH/2,{size:fs,math:true,color:P.ink}); S.draw.text(c,"f ′(x)",31,ty+rowH*1.5,{size:fs,math:true,color:P.ink}); S.draw.text(c,"f(x)",31,ty+rowH*2.5,{size:fs,math:true,color:P.ink});
      d.cols.forEach(function(t,i){ S.draw.text(c,t,cx(i),ty+rowH/2,{size:fs,color:P.ink,align:i===0?"left":(i===nC-1?"right":"center")}); });
      if(s>=3){ d.sg.forEach(function(g,i){ var mx=(cx(i)+cx(i+1))/2; S.draw.text(c,g,mx,ty+rowH*1.5,{size:16,color:g==="+"?P.green:P.red,weight:800}); });
        for(var i=1;i<nC-1;i++){ S.draw.line(c,cx(i),ty+rowH,cx(i),ty+th,"#9aa5b5",1.2); S.draw.text(c,(d.gap&&i===d.gap)?"||":"0",cx(i),ty+rowH*1.5,{size:fs,color:P.ink,bg:"#fff"}); } }
      if(s>=4){ var arrX=function(i){ return (cx(i)+cx(i+1))/2; };
        d.arr.forEach(function(a,i){ var xa=cx(i)+16, xb=cx(i+1)-16, ya=a==="up"?ty+rowH*2.78:ty+rowH*2.22, yb=a==="up"?ty+rowH*2.22:ty+rowH*2.78;
          if(d.gap&&i>=d.gap) { xa=cx(i)+22; } if(d.gap&&i<d.gap){ xb=cx(i+1)-22; }
          S.draw.arrow(c,xa,ya,xb,yb,a==="up"?P.green:P.red,2); });
        var vi=0; d.cols.forEach(function(t,i){ var vv=d.vr[i]; if(!vv) return; vv.forEach(function(txt,j){ var hi=(i===0?"l":(i===nC-1?"r":"c")); S.draw.text(c,txt,cx(i)+(vv.length>1?(j?10:-10):0),ty+rowH*(vv.length>1?(j?2.25:2.75):(d.arr[Math.min(i,d.arr.length-1)]==="up"&&i<nC-1?2.82:(i===nC-1?(d.arr[d.arr.length-1]==="up"?2.2:2.8):(d.arr[Math.max(0,i-1)]==="up"?2.18:2.82)))),{size:fs,color:P.ink,align:i===0?"left":(i===nC-1?"right":"center")}); }); }); }
      var steps=["<b>1. Domaine.</b> "+d.dom+".","<b>2. Limites et asymptotes.</b> "+d.lim,"<b>3. Dérivée et signe.</b> "+d.der+" Vert = croissante, rouge = décroissante.","<b>4. Extremum.</b> "+d.ext,"<b>5. Dérivée seconde (6 h).</b> "+d.inf,"<b>6. Courbe complète.</b> Tu peux maintenant la tracer sans calculatrice : domaine, asymptotes, variations, extremum"+(d.infx!==null?", inflexion":"")+"."];
      var txt=""; for(var i2=0;i2<s;i2++) txt+=(i2?"<br>":"")+steps[i2];
      nt.set(txt,"ok");
    });
  }
});
