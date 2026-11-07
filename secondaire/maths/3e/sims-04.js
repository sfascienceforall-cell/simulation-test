/* Chapitre 4 : équations du premier degré */
SFA.sim({
  id:"m3-c04-balance", ch:"c04", tag:"Balance", titre:"La balance : fais la même chose des deux côtés",
  resume:"Applique des opérations à l'équation. Si tu n'en fais qu'à gauche, la balance penche !",
  but:"Chaque bloc « x » pèse la même chose inconnue, chaque rond vaut 1. Choisis une opération et où l'appliquer, puis isole x pour que l'équation devienne x = … Essaie « Gauche seulement » pour voir la balance basculer.",
  aRetenir:"Une équation est une balance en équilibre : ajouter, retrancher, multiplier ou diviser par un nombre non nul des deux côtés conserve la solution.",
  piege:"« Changer de côté en changeant de signe » veut dire : on a ajouté ou retiré la même chose des deux côtés. Ne multiplie jamais un seul membre.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.82}), P=S.draw.palette, T=S.draw.tint;
    var PRE=[[3,5,1,11],[2,-4,5,8],[4,1,2,-7],[5,-2,2,10]];
    var e, xs, hist=[], ang=0, tgt=0;
    function sol(p){ return (p[3]-p[1])/(p[0]-p[2]); }
    function side(a,b){ return M3.side(a,b,2); }
    function fmtEq(p){ return side(p[0],p[1])+" = "+side(p[2],p[3]); }
    var ps=k.select("Équation de départ",PRE.map(function(p,i){return [i,fmtEq(p)];}),0,function(){ reset(); });
    var op=k.seg("Opération",[["cst","+ k"],["x","+ k·x"],["mul","× k"],["div","÷ k"]],"cst");
    var kk=k.slider("k",-10,10,1,-5,"");
    var tg=k.seg("Appliquer à",[["both","Les deux membres"],["L","Gauche seulement"],["R","Droite seulement"]],"both");
    k.button("Appliquer",function(){ apply(); },true);
    k.button("Recommencer",function(){ reset(); });
    var ro=k.readouts(["Équation actuelle","Solution de départ"]);
    var nt=k.note("");
    var tl=k.loop(function(dt){ ang+=(tgt-ang)*Math.min(1,dt*7); if(Math.abs(tgt-ang)<0.002){ ang=tgt; tl.pause(); } k.redraw(); });
    function reset(){ e=PRE[+ps.value].slice(); xs=sol(e); hist=[]; nt.set("Isole x : le but est d'obtenir « x = "+S.fmt(xs,0)+" ».",""); k.redraw(); }
    function opName(o,K,t){ var kk2=K<0?"("+S.fmt(K,0)+")":S.fmt(K,0), w=o==="cst"?"+ "+kk2:o==="x"?"+ "+kk2+"x":o==="mul"?"× "+kk2:"÷ "+kk2; return w+(t==="both"?"":t==="L"?" à gauche":" à droite"); }
    function apply(){
      var K=kk.value, o=op.value, t=tg.value, L=t!=="R", R=t!=="L";
      if((o==="mul"||o==="div")&&K===0){ nt.set("On ne multiplie ni ne divise jamais par 0 : choisis un autre k.","warn"); return; }
      if(o==="div"){ var all=e.every(function(v){return Number.isInteger(v/K);}); if(!all&&t==="both"){ nt.set("Cette division ne tombe pas juste sur tous les coefficients : choisis un autre k.","warn"); return; } }
      var before=fmtEq(e);
      if(o==="cst"){ if(L) e[1]+=K; if(R) e[3]+=K; }
      if(o==="x"){ if(L) e[0]+=K; if(R) e[2]+=K; }
      if(o==="mul"){ if(L){e[0]*=K;e[1]*=K;} if(R){e[2]*=K;e[3]*=K;} }
      if(o==="div"){ if(L){e[0]/=K;e[1]/=K;} if(R){e[2]/=K;e[3]/=K;} }
      hist.push(opName(o,K,t)); if(hist.length>3) hist.shift();
      var d=(e[0]*xs+e[1])-(e[2]*xs+e[3]);
      if(Math.abs(d)>1e-9) nt.set("La balance penche : tu n'as pas traité les deux membres de la même façon, l'équation n'a plus la même solution.","bad");
      else if(e[0]===1&&e[1]===0&&e[2]===0) nt.set("Gagné ! x = "+S.fmt(e[3],2)+". Vérifie en remplaçant dans l'équation de départ.","ok");
      else nt.set("Balance en équilibre : l'équation est équivalente à la précédente.","ok");
    }
    /* un plateau : blocs x (carrés bleus) et unités (ronds), négatifs en pointillés rouges */
    function pan(cx,cy,pw,a,b,name,col){
      var ctx=c.ctx; ctx.save();
      /* plateau */
      S.draw.rrect(c,cx-pw/2,cy,pw,9,4.5); ctx.fillStyle="#cdd6e2"; ctx.fill();
      var bs=Math.min(30,pw/5), us=Math.min(21,pw/7), cap=Math.floor((pw-8)/(bs+4)), y=cy-3;
      var nx=Math.abs(a), nu=Math.abs(b), neg1=a<0, neg2=b<0, shown=Math.min(nx,cap*2), i, row=0;
      for(i=0;i<shown;i++){ var rx=i%cap, ry=Math.floor(i/cap), x=cx-(Math.min(cap,shown-ry*cap))*(bs+4)/2+rx*(bs+4)+2, yy=y-bs-ry*(bs+3);
        S.draw.rrect(c,x,yy,bs,bs,6); ctx.fillStyle=neg1?"#fff":P.acc; ctx.fill(); ctx.lineWidth=2.4; ctx.strokeStyle=neg1?P.red:"#fff"; if(neg1) ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]);
        S.draw.text(c,(neg1?"−":"")+"x",x+bs/2,yy+bs/2,{size:Math.max(12,bs*0.5),color:neg1?P.red:"#fff",math:true,italic:true}); }
      if(nx>shown){ S.draw.label(c,(neg1?"−":"")+nx+" blocs x",cx,y-bs*2-14,{color:P.acc,size:11.5}); }
      var rowsX=nx?Math.min(2,Math.ceil(shown/cap)):0, baseY=y-rowsX*(bs+3)-4, capU=Math.floor((pw-8)/(us+3)), shownU=Math.min(nu,capU);
      for(i=0;i<shownU;i++){ var ux=i%capU, uy=Math.floor(i/capU), x2=cx-(Math.min(capU,shownU-uy*capU))*(us+3)/2+ux*(us+3)+1.5, y2=baseY-us-uy*(us+3);
        ctx.beginPath(); ctx.arc(x2+us/2,y2+us/2,us/2,0,7); ctx.fillStyle=neg2?"#fff":P.amber; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle=neg2?P.red:"#fff"; if(neg2) ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]); }
      if(nu>shownU){ S.draw.label(c,(neg2?"−":"")+nu+" unités",cx,baseY-us*2-16,{color:P.amber,size:11.5}); }
      ctx.restore();
      S.draw.label(c,name,cx,cy+28,{color:col,size:M3.sz(c,14),math:true});
    }
    k.draw(function(){
      if(!e){ e=PRE[0].slice(); xs=sol(e); }
      c.clear(); var ctx=c.ctx, d=(e[0]*xs+e[1])-(e[2]*xs+e[3]), den=Math.abs(e[0]*xs+e[1])+Math.abs(e[2]*xs+e[3])+1;
      tgt=Math.max(-0.26,Math.min(0.26,d/den*0.75)); if(Math.abs(tgt-ang)>0.002) tl.play();
      var bal=Math.abs(d)<1e-9, cx=c.W/2, py=c.H*0.3, hw=Math.min(c.W*0.29,170), pw=Math.min(c.W*0.34,150);
      var lx=cx-hw*Math.cos(ang), ly=py+hw*Math.sin(ang), rx=cx+hw*Math.cos(ang), ry=py-hw*Math.sin(ang), drop=c.H*0.27;
      /* pied */
      ctx.fillStyle="#b9c3d1"; ctx.beginPath(); ctx.moveTo(cx,py); ctx.lineTo(cx-20,c.H-24); ctx.lineTo(cx+20,c.H-24); ctx.closePath(); ctx.fill();
      S.draw.rrect(c,cx-52,c.H-26,104,10,5); ctx.fillStyle="#9aa7b8"; ctx.fill();
      /* fils et plateaux */
      [[lx,ly,-1],[rx,ry,1]].forEach(function(q){ S.draw.line(c,q[0],q[1],q[0]-pw*0.42,q[1]+drop,"#9aa7b8",1.6); S.draw.line(c,q[0],q[1],q[0]+pw*0.42,q[1]+drop,"#9aa7b8",1.6); });
      S.draw.line(c,lx,ly,rx,ry,P.ink,7); S.draw.dot(c,cx,py,8,P.ink);
      pan(lx,ly+drop,pw,e[0],e[1],side(e[0],e[1]),P.acc);
      pan(rx,ry+drop,pw,e[2],e[3],side(e[2],e[3]),P.green);
      S.draw.label(c,bal?"Équilibre":"Déséquilibre",cx,24,{color:bal?P.green:P.red,size:M3.sz(c,15)});
      if(hist.length){ S.draw.text(c,"Étapes : "+hist.join("  ›  "),cx,c.H-8,{size:11.5,color:P.grey,weight:600}); }
      ro.set(0,fmtEq(e)); ro.set(1,"x = "+S.fmt(xs,0));
    });
    reset();
  }
});
SFA.sim({
  id:"m3-c04-graphe", ch:"c04", tag:"Lien avec les droites", titre:"Résoudre ax + b = cx + d avec deux droites",
  resume:"La solution d'une équation est l'abscisse du point où deux droites se croisent.",
  but:"Règle a, b, c et d. Observe le croisement, puis fabrique une équation impossible et une équation toujours vraie.",
  aRetenir:"Résoudre ax + b = cx + d, c'est chercher le x où y = ax + b et y = cx + d ont la même valeur : le point d'intersection. Même pente et ordonnées différentes : pas de solution. Droites confondues : tous les x.",
  piege:"« Pas de solution » ne se note pas x = 0 : c'est l'ensemble vide, il n'y a aucun x qui convienne.",
  build:function(k,S){
    var c=k.canvas(360), P=S.draw.palette;
    var a=k.slider("a",-4,4,1,2,""), b=k.slider("b",-6,6,1,1,""), cc=k.slider("c",-4,4,1,-1,""), d=k.slider("d",-6,6,1,7,"");
    var ro=k.readouts(["Équation","Solution"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var A=a.value,B=b.value,C=cc.value,D=d.value;
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-12,y1:12,xl:"x",yl:"y",stepX:2,stepY:4});
      S.draw.fn(c,ax,function(x){return A*x+B;},P.acc,3); S.draw.fn(c,ax,function(x){return C*x+D;},P.red,3);
      function s(a2,b2){ return window.M3.side(a2,b2,0); }
      function cl(y){ return Math.max(ax.T+12,Math.min(ax.B-12,y)); }
      S.draw.label(c,"y = "+s(A,B),ax.R-6,cl(ax.Y(A*7.4+B)+(A>C?-16:16)),{color:P.acc,size:12,align:"right"});
      S.draw.label(c,"y = "+s(C,D),ax.R-6,cl(ax.Y(C*7.4+D)+(C>A?-16:16)),{color:P.red,size:12,align:"right"});
      ro.set(0,s(A,B)+" = "+s(C,D));
      if(A===C&&B===D){ ro.set(1,"tous les x"); nt.set("Les deux droites sont confondues : l'équation est vraie pour tout x.","ok"); }
      else if(A===C){ ro.set(1,"aucune"); nt.set("Droites parallèles : "+S.fmt(B,0)+" = "+S.fmt(D,0)+" est faux, aucune solution (ensemble vide).","warn"); }
      else { var x=(D-B)/(A-C); ro.set(1,"x = "+S.fmt(x,2));
        if(Math.abs(x)<=8&&Math.abs(A*x+B)<=12){ S.draw.dot(c,ax.X(x),ax.Y(A*x+B),7,P.green); S.draw.line(c,ax.X(x),ax.Y(A*x+B),ax.X(x),ax.Y(0),P.green,1.5,[4,3]); }
        if(Math.abs(x)<=8&&Math.abs(A*x+B)<=12) nt.set("Au croisement, y = "+S.fmt(A*x+B,2)+" pour les deux droites : x = "+S.fmt(x,2)+" est la solution.","ok");
        else nt.set("Le croisement existe (x = "+S.fmt(x,2)+", y = "+S.fmt(A*x+B,2)+") mais il sort du cadre : la solution est bien x = "+S.fmt(x,2)+".","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c04-magie", ch:"c04", tag:"Tour de magie", titre:"« Pense à un nombre » : pourquoi ça marche",
  resume:"Un nombre de départ, quatre opérations… et le résultat ne dépend pas du nombre. Pourquoi ?",
  but:"Change le nombre de départ n et avance étape par étape : les barres bleues sont n, les barres orange sont k. Active ou coupe la dernière étape et regarde si le résultat dépend de n.",
  aRetenir:"(2n + 2k) ÷ 2 − n = k : n s'annule, on obtient une identité. Sans la dernière étape, on obtient n + k, qui dépend de n : trouver n pour un résultat donné est une équation.",
  piege:"Tester avec un seul nombre ne prouve rien : il faut une lettre (n) pour montrer que ça marche pour tous les nombres.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.95}), P=S.draw.palette, T=S.draw.tint;
    var n=k.slider("Nombre de départ n",0,20,1,7,""), kk=k.slider("Nombre magique k",1,10,1,5,"");
    var stp=k.slider("Étapes montrées",1,5,1,5,"");
    var last=k.toggle("Retirer à la fin le nombre de départ",true);
    var tg=k.slider("Résultat voulu (si la dernière étape est coupée)",0,30,1,12,"");
    var lp=k.loop(function(dt,t){ if(t>0.9){ if(stp.value>=5) lp.pause(); else { stp.set(stp.value+1); lp.reset(); } } k.redraw(); });
    k.button("Animer les étapes",function(){ stp.set(1); lp.reset(); lp.play(); },true);
    var ro=k.readouts(["Résultat","Dépend de n ?","n pour le résultat voulu"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, N=n.value, K=kk.value, L=last.value, fs=M3.sz(c,14);
      var nS=L?5:4, show=Math.min(stp.value,nS);
      var u=(c.W-44)/(2*20+2*10+2), rowH=Math.min(58,(c.H-150)/5);
      var s1=2*N, s2=s1+2*K, s3=s2/2, s4=L?s3-N:s3;
      var rows=[
        {t:"Pense à un nombre n = "+S.fmt(N,0),bars:["n"],v:N,alg:"n"},
        {t:"Multiplie par 2",bars:["n","n"],v:s1,alg:"2n"},
        {t:"Ajoute "+2*K+" (2k)",bars:["n","n","k","k"],v:s2,alg:"2n + "+2*K},
        {t:"Divise par 2",bars:["n","k"],v:s3,alg:"n + "+K}];
      if(L) rows.push({t:"Retire le nombre de départ",bars:["k"],v:s4,alg:""+K});
      var y=14, x0=22;
      rows.forEach(function(r,i){
        var cur=(i===show-1), on=(i<show);
        ctx.save(); ctx.globalAlpha=on?(cur?1:0.85):0.25;
        S.draw.text(c,(i+1)+".  "+r.t,x0,y+10,{size:fs,color:cur?P.ink:P.grey,align:"left"});
        var x=x0, by=y+22, bh=Math.min(24,rowH-30);
        r.bars.forEach(function(b){ var w=(b==="n"?N:K)*u; if(b==="n"&&N===0) w=3;
          S.draw.rrect(c,x,by,w,bh,5); ctx.fillStyle=b==="n"?P.acc:P.amber; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle="#fff"; ctx.stroke();
          if(w>16) S.draw.text(c,b,x+w/2,by+bh/2,{size:12,color:"#fff",math:true,italic:true}); x+=w+3; });
        S.draw.text(c,r.alg,c.W-16,y+10,{size:fs+1,color:cur?P.acc:P.grey,align:"right",math:true});
        S.draw.text(c,"= "+S.fmt(r.v,0),c.W-16,by+bh/2,{size:fs+1,color:cur&&i===rows.length-1?P.green:P.ink,align:"right",weight:800});
        ctx.restore();
        y+=rowH; });
      /* verdict */
      var done=show>=nS;
      S.draw.panel(c,14,y+2,c.W-28,44,{shadow:false,fill:T(done?(L?P.green:P.amber):P.grey,0.1),stroke:T(done?(L?P.green:P.amber):P.grey,0.4)});
      S.draw.text(c,done?(L?"Résultat : "+S.fmt(s4,0)+" pour tout n":"Résultat : "+S.fmt(s4,0)+" : il change quand n change"):"Continue : étape "+(show+1)+" sur "+nS,c.W/2,y+24,{size:fs+1,color:done?(L?P.green:P.amber):P.grey});
      /* essais avec d'autres nombres */
      var ty=y+66; S.draw.text(c,"D'autres nombres de départ donnent :",16,ty,{size:fs-1,color:P.grey,align:"left"});
      var tests=[1,4,13,20,-6], cw=(c.W-32)/tests.length;
      tests.forEach(function(q,i){ var r=L?K:q+K; S.draw.panel(c,16+i*cw,ty+14,cw-6,40,{shadow:false,stroke:P.light});
        S.draw.text(c,"n = "+S.fmt(q,0),16+i*cw+(cw-6)/2,ty+28,{size:11.5,color:P.grey,weight:600});
        S.draw.text(c,S.fmt(r,0),16+i*cw+(cw-6)/2,ty+46,{size:fs+1,color:L?P.green:P.amber,weight:800}); });
      ro.set(0,S.fmt(s4,0)); ro.set(1,L?"non : toujours "+K:"oui : n + "+K); ro.set(2,L?"tous les n (si résultat = "+K+")":S.fmt(tg.value-K,0));
    });
  }
});
SFA.sim({
  id:"m3-c04-levier", ch:"c04", tag:"Physique et équations", titre:"Le levier : une équation du 1er degré",
  resume:"Deux masses sur une barre : l'équilibre donne m₁·d₁ = m₂·d₂.",
  but:"Règle les masses (curseurs) et fais glisser les deux poids le long de la barre jusqu'à l'équilibre. Vérifie avec l'équation.",
  aRetenir:"À l'équilibre, m₁ × d₁ = m₂ × d₂. Si on connaît m₁, d₁ et m₂, on trouve d₂ = m₁ × d₁ ÷ m₂ : c'est une équation du 1er degré.",
  piege:"Une masse plus lourde se place plus près du pivot, pas plus loin : le produit masse × distance doit être égal des deux côtés.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.62}), P=S.draw.palette, T=S.draw.tint;
    var m1=k.slider("Masse m₁",1,10,1,3,"kg"), d1=k.slider("Distance d₁",1,5,0.5,4,"m"), m2=k.slider("Masse m₂",1,10,1,2,"kg"), d2=k.slider("Distance d₂",0.5,6,0.5,3,"m");
    var ro=k.readouts(["m₁ × d₁","m₂ × d₂","d₂ pour l'équilibre"]); var nt=k.note("");
    var geo={h:[]};
    M3.drag(c,function(){return geo.h;},function(id,p){ var dd=Math.abs(p.x-c.W/2)/geo.u; if(id==="1") d1.set(M3.snap(dd,0.5,1,5)); else d2.set(M3.snap(dd,0.5,0.5,6)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, M1=m1.value,D1=d1.value,M2=m2.value,D2=d2.value, t1=M1*D1, t2=M2*D2, fs=M3.sz(c,12.5);
      var ang=Math.max(-0.2,Math.min(0.2,(t2-t1)/(t1+t2)*0.5)), cx=c.W/2, py=c.H*0.4, u=(c.W/2-26)/6.4; geo.u=u*Math.cos(ang);
      function Q(dist,side){ return {x:cx+side*dist*u*Math.cos(ang), y:py+side*dist*u*Math.sin(ang)}; }
      ctx.fillStyle="#b9c3d1"; ctx.beginPath(); ctx.moveTo(cx,py); ctx.lineTo(cx-20,c.H-14); ctx.lineTo(cx+20,c.H-14); ctx.closePath(); ctx.fill();
      var a=Q(6.4,-1), b=Q(6.4,1); S.draw.line(c,a.x,a.y,b.x,b.y,"#8a6a43",11);
      S.draw.line(c,a.x,a.y,b.x,b.y,"#b48a55",7);
      ctx.save(); ctx.font="700 "+(fs-1)+"px Mulish,system-ui"; ctx.fillStyle="#fff"; ctx.textAlign="center"; ctx.textBaseline="middle";
      for(var i=1;i<=6;i++){ [-1,1].forEach(function(sd){ var q=Q(i,sd); S.draw.line(c,q.x,q.y-5,q.x,q.y+5,"#6e5230",1.6); ctx.save(); ctx.translate(q.x,q.y); ctx.rotate(ang); ctx.fillText(i,0,0); ctx.restore(); }); }
      ctx.restore();
      S.draw.dot(c,cx,py,8,P.ink);
      var p1=Q(D1,-1), p2=Q(D2,1);
      function weight(p,m,col,name){ var w=22+m*3.4, h=18+m*3, top=p.y+30; S.draw.line(c,p.x,p.y,p.x,top,"#6a7686",1.6);
        S.draw.rrect(c,p.x-w/2,top,w,h,6); ctx.fillStyle=col; ctx.fill(); ctx.lineWidth=2.5; ctx.strokeStyle="#fff"; ctx.stroke();
        S.draw.text(c,m+" kg",p.x,top+h/2,{size:fs,color:"#fff"}); S.draw.text(c,name,p.x,top+h+14,{size:fs,color:col,math:true,italic:true}); }
      weight(p1,M1,P.acc,"m₁"); weight(p2,M2,P.red,"m₂");
      geo.h=[{id:"1",x:p1.x,y:p1.y,r:30},{id:"2",x:p2.x,y:p2.y,r:30}];
      M3.handle(c,p1.x,p1.y,P.acc,false,7); M3.handle(c,p2.x,p2.y,P.red,false,7);
      var need=t1/M2, bal=Math.abs(t1-t2)<1e-9;
      S.draw.label(c,bal?"Équilibre":"Ça penche "+(t1>t2?"à gauche":"à droite"),cx,22,{color:bal?P.green:P.amber,size:M3.sz(c,15)});
      ro.set(0,S.fmt(t1,1)); ro.set(1,S.fmt(t2,1)); ro.set(2,S.fmt(need,2)+" m");
      if(bal) nt.set("Équilibre : "+S.fmt(M1,0)+" × "+S.fmt(D1,1)+" = "+S.fmt(M2,0)+" × "+S.fmt(D2,1)+" = "+S.fmt(t1,1)+".","ok");
      else nt.set((t1>t2?"Ça penche à gauche : ":"Ça penche à droite : ")+S.fmt(t1,1)+" ≠ "+S.fmt(t2,1)+". Équation à résoudre : "+S.fmt(M1,0)+" × "+S.fmt(D1,1)+" = "+S.fmt(M2,0)+" × d, donc d = "+S.fmt(need,2)+(need>6?" (hors de la barre : essaie une autre masse).":(need<0.5?" (trop près du pivot : essaie une autre masse).":"."))+"","warn");
    });
  }
});
