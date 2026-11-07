(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI=Math.PI, D2R=PI/180;
function comp(x,y){ return "("+F(x,2)+" ; "+F(y,2)+")"; }
function snap(v,lo,hi){ return Math.max(lo,Math.min(hi,Math.round(v))); }

SFA.sim({
  id:"m4-c08-somme", ch:"c08", tag:"Manipuler",
  titre:"Somme de deux vecteurs",
  resume:"Déplace les pointes de u et v : la somme se construit en bout à bout ou par le parallélogramme.",
  but:"Fais glisser la pointe de u (rouge) ou de v (vert). Observe la somme u + v, ses composantes (les composantes s'additionnent) et compare les normes ‖u + v‖ et ‖u‖ + ‖v‖ : les barres du bas se rejoignent quand u et v vont dans le même sens.",
  aRetenir:"Si u(a ; b) et v(c ; d), alors u + v a pour composantes (a + c ; b + d). En bout à bout : on place l'origine de v à la pointe de u ; la somme va de l'origine de u à la pointe de v.",
  piege:"Les normes ne s'additionnent pas : ‖u + v‖ ≤ ‖u‖ + ‖v‖, avec égalité seulement si u et v ont la même direction et le même sens.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.92});
    var u={x:3,y:1}, v={x:1,y:3}, ax=null;
    var mode=k.seg("Construction",[["par","Parallélogramme"],["bab","Bout à bout"]],"par");
    var cp=k.toggle("Montrer les composantes de la somme",true);
    k.button("Même sens (défi)",function(){ u={x:2,y:1}; v={x:4,y:2}; });
    k.button("Remettre",function(){ u={x:3,y:1}; v={x:1,y:3}; });
    var ro=k.readouts(["u","v","u + v","‖u‖ ; ‖v‖","‖u + v‖","‖u‖ + ‖v‖"]);
    var nt=k.note("","");
    M.grab(c,function(){ return ax?[{id:"u",x:ax.X(u.x),y:ax.Y(u.y)},{id:"v",x:ax.X(v.x),y:ax.Y(v.y)}]:[]; },
      function(id,px,py){ var q=id==="u"?u:v; q.x=M.snap(ax.ix(px),-5,5); q.y=M.snap(ax.iy(py),-5,5); k.redraw(); });
    k.draw(function(){
      var sx=u.x+v.x, sy=u.y+v.y;
      c.clear();
      ax=M.plane(c,6,{b:66,t:10,fit:[[sx,sy],[u.x,u.y],[v.x,v.y]],pad:1.6});
      var X=ax.X,Y=ax.Y,O=[X(0),Y(0)],U=[X(u.x),Y(u.y)],V=[X(v.x),Y(v.y)],W=[X(sx),Y(sy)];
      /* aire du parallélogramme */
      if(mode.value==="par") M.poly(c,[O,U,W,V],S.draw.tint(P.acc,.08));
      if(cp.value){ S.draw.line(c,O[0],O[1],W[0],O[1],P.blue,1.6,[2,4]); S.draw.line(c,W[0],O[1],W[0],W[1],P.blue,1.6,[2,4]);
        if(sx!==0) M.lab(c,"a + c = "+F(sx,0),(O[0]+W[0])/2,O[1]+(sy>=0?15:-15),P.blue,{size:11});
        if(sy!==0) M.lab(c,"b + d = "+F(sy,0),W[0]+(sx>=0?34:-34),(O[1]+W[1])/2,P.blue,{size:11}); }
      if(mode.value==="par"){ S.draw.line(c,U[0],U[1],W[0],W[1],P.green,1.6,[5,4]); S.draw.line(c,V[0],V[1],W[0],W[1],P.red,1.6,[5,4]); }
      else S.draw.arrow(c,U[0],U[1],W[0],W[1],P.green,2.6);
      if(u.x||u.y) S.draw.arrow(c,O[0],O[1],U[0],U[1],P.red,3.2);
      if(v.x||v.y) S.draw.arrow(c,O[0],O[1],V[0],V[1],P.green,3.2);
      if(sx||sy) S.draw.arrow(c,O[0],O[1],W[0],W[1],P.acc,4.4);
      function tip(q,txt,col,dx,dy){ M.lab(c,txt,q[0]+dx,q[1]+dy,col,{math:false}); }
      tip(U,"u ("+F(u.x,0)+" ; "+F(u.y,0)+")",P.red,0,u.y>=sy?-20:20);
      tip(V,"v ("+F(v.x,0)+" ; "+F(v.y,0)+")",P.green,0,v.y>=sy?-20:20);
      if(sx||sy) tip(W,"u + v ("+F(sx,0)+" ; "+F(sy,0)+")",P.acc,0,sy>=0?-20:20);
      M.handle(c,U[0],U[1],P.red,7); M.handle(c,V[0],V[1],P.green,7);
      S.draw.dot(c,O[0],O[1],4,P.ink);
      /* barres : ‖u + v‖ ≤ ‖u‖ + ‖v‖ */
      var nu=Math.hypot(u.x,u.y), nv=Math.hypot(v.x,v.y), ns=Math.hypot(sx,sy), tot=nu+nv;
      var y1=c.H-48, y2=c.H-24, x0=112, sc=(c.W-x0-12)/14.2;
      S.draw.panel(c,6,c.H-62,c.W-12,56,{shadow:false});
      S.draw.text(c,"‖u‖ + ‖v‖",14,y1,{size:11.5,color:P.amber,align:"left"}); S.draw.text(c,"‖u + v‖",14,y2,{size:11.5,color:P.acc,align:"left"});
      var ctx=c.ctx;
      S.draw.rrect(c,x0,y1-7,Math.max(2,tot*sc),14,4); ctx.fillStyle=P.amber; ctx.fill();
      S.draw.rrect(c,x0,y2-7,Math.max(2,ns*sc),14,4); ctx.fillStyle=P.acc; ctx.fill();
      S.draw.text(c,F(tot,2),x0+tot*sc+6,y1,{size:11,color:P.ink,align:"left"}); S.draw.text(c,F(ns,2),x0+ns*sc+6,y2,{size:11,color:P.ink,align:"left"});
      ro.set(0,M.comp(u.x,u.y)); ro.set(1,M.comp(v.x,v.y)); ro.set(2,M.comp(sx,sy)); ro.set(3,F(nu,2)+" ; "+F(nv,2)); ro.set(4,F(ns,2)); ro.set(5,F(tot,2));
      var same=nu>0&&nv>0&&Math.abs(tot-ns)<1e-9;
      nt.set(same?"Égalité ‖u + v‖ = ‖u‖ + ‖v‖ : u et v ont la même direction et le même sens.":(nu===0||nv===0?"Un des vecteurs est nul : l'égalité est triviale.":"‖u + v‖ < ‖u‖ + ‖v‖ : u et v ne sont pas alignés dans le même sens. Défi : aligne-les pour que les barres se rejoignent."),same?"ok":"");
    });
  }
});

/* ---------- translation ---------- */
SFA.sim({
  id:"m4-c08-translation", ch:"c08", tag:"Défi",
  titre:"Translation de vecteur t",
  resume:"Un triangle glisse : chaque point est déplacé du même vecteur. Amène-le sur la cible.",
  but:"Fais glisser le triangle vert (ou règle p et q) : c'est le triangle ABC translaté par t. Défi : amène A'B'C' exactement sur la cible en pointillés, puis lis les composantes de t.",
  aRetenir:"La translation de vecteur t(p ; q) envoie M(x ; y) sur M'(x + p ; y + q), c'est-à-dire MM' = t. Elle conserve les longueurs, les angles et le parallélisme : l'image est un triangle identique.",
  piege:"Ne confonds pas le vecteur MM' = (xM' − xM ; yM' − yM) avec (xM − xM' ; …) : la pointe moins l'origine (arrivée − départ).",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.9});
    var p=k.slider("p (déplacement horizontal)",-6,6,1,2,"");
    var q=k.slider("q (déplacement vertical)",-6,6,1,1,"");
    var T=[["A",-5,-2],["B",-2,1],["C",-4,-4]];
    var targets=[[5,3],[-1,5],[6,-2],[3,-3],[7,2],[1,6]], ti=0, won=0, ax=null;
    k.button("Nouvelle cible",function(){ ti=(ti+1)%targets.length; });
    k.button("Remettre t = 0",function(){ p.set(0); q.set(0); });
    var ro=k.readouts(["Vecteur t","A → A'","B → B'","C → C'","Longueur ‖t‖","Écart à la cible"]);
    var nt=k.note("","");
    M.grab(c,function(){ if(!ax) return []; return T.map(function(m,i){ return {id:i,x:ax.X(m[1]+p.value),y:ax.Y(m[2]+q.value),r:26}; }); },
      function(id,px,py){ p.set(M.snap(ax.ix(px)-T[id][1],-6,6)); q.set(M.snap(ax.iy(py)-T[id][2],-6,6)); k.redraw(); });
    k.draw(function(){
      var tp=p.value,tq=q.value, tg=targets[ti]; c.clear();
      ax=M.plane(c,8,{b:12,fit:[[tp-5,tq-4],[tp+1,tq+1],[tg[0]-5,tg[1]-4],[tg[0]-2,tg[1]+1]],pad:1.5});
      var I=T.map(function(m){return [ax.X(m[1]+tp),ax.Y(m[2]+tq)];}), A0=T.map(function(m){return [ax.X(m[1]),ax.Y(m[2])];});
      var G=T.map(function(m){return [ax.X(m[1]+tg[0]),ax.Y(m[2]+tg[1])];});
      var hit=(tp===tg[0]&&tq===tg[1]);
      /* cible */
      M.poly(c,G,hit?S.draw.tint(P.green,.22):"rgba(138,149,163,.10)",hit?P.green:P.grey,2); 
      c.ctx.save(); c.ctx.setLineDash([6,5]); M.poly(c,G,null,hit?P.green:P.grey,2); c.ctx.restore();
      if(!hit) S.draw.text(c,"cible",(G[0][0]+G[1][0]+G[2][0])/3,(G[0][1]+G[1][1]+G[2][1])/3,{size:12,color:P.grey});
      M.poly(c,A0,S.draw.tint(P.acc,.14),P.acc,2.6);
      M.poly(c,I,S.draw.tint(P.green,.18),P.green,2.6);
      T.forEach(function(m,i){ if(tp||tq) S.draw.arrow(c,A0[i][0],A0[i][1],I[i][0],I[i][1],P.amber,1.8);
        S.draw.dot(c,A0[i][0],A0[i][1],5,P.acc); M.handle(c,I[i][0],I[i][1],P.green,6);
        var gx=(A0[0][0]+A0[1][0]+A0[2][0])/3, gy=(A0[0][1]+A0[1][1]+A0[2][1])/3, hx=(I[0][0]+I[1][0]+I[2][0])/3, hy=(I[0][1]+I[1][1]+I[2][1])/3;
        function away(P0,cx,cy,d){ var dx=P0[0]-cx,dy=P0[1]-cy,l=Math.hypot(dx,dy)||1; return [P0[0]+dx/l*d,P0[1]+dy/l*d]; }
        var a=away(A0[i],gx,gy,15), b=away(I[i],hx,hy,15);
        S.draw.text(c,m[0],a[0],a[1],{size:13,color:P.acc}); S.draw.text(c,m[0]+"'",b[0],b[1],{size:13,color:P.green}); });
      ro.set(0,M.comp(tp,tq));
      for(var i=0;i<3;i++) ro.set(i+1,"("+F(T[i][1],0)+" ; "+F(T[i][2],0)+") → ("+F(T[i][1]+tp,0)+" ; "+F(T[i][2]+tq,0)+")");
      ro.set(4,F(Math.hypot(tp,tq),2)); ro.set(5,hit?"0 : atteinte !":"encore ("+F(tg[0]-tp,0)+" ; "+F(tg[1]-tq,0)+")");
      if(hit){ nt.set("Cible atteinte : t = ("+F(tp,0)+" ; "+F(tq,0)+"). Chaque sommet a été déplacé de "+F(tp,0)+" en x et de "+F(tq,0)+" en y.","ok"); }
      else nt.set("Chaque sommet se déplace du même vecteur. Il manque ("+F(tg[0]-tp,0)+" ; "+F(tg[1]-tq,0)+") pour atteindre la cible.","");
    });
  }
});

/* ---------- Chasles ---------- */
SFA.sim({
  id:"m4-c08-chasles", ch:"c08", tag:"Manipuler",
  titre:"La relation de Chasles : AB + BC + CD = AD",
  resume:"Quatre points mobiles : la chaîne de vecteurs aboutit toujours au vecteur direct AD.",
  but:"Déplace A, B, C, D. Le trajet A → B → C → D donne la même somme que le saut direct A → D, quelle que soit la forme du chemin. Lance le parcours, et teste aussi le mode « piège » : AB + CB n'est pas AC.",
  aRetenir:"Relation de Chasles : AB + BC = AC, et plus généralement AB + BC + CD = AD. Les composantes de AB sont (xB − xA ; yB − yA) : arrivée moins départ. BA = −AB.",
  piege:"Les points « intermédiaires » doivent s'enchaîner : la fin d'un vecteur est le début du suivant. AB + CB n'est pas égal à AC : il faut écrire AB + BC.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.92});
    var init=function(){ return [{x:-5,y:-2},{x:-1,y:4},{x:3,y:2},{x:5,y:-4}]; };
    var pts=init(), ax=null, nm=["A","B","C","D"], prog=1;
    var mode=k.seg("Chaîne",[["3","AB + BC + CD"],["2","AB + BC"],["trap","Piège AB + CB"]],"3");
    var lp=k.loop(function(dt){ prog+=dt*0.4; if(prog>=1){ prog=1; lp.pause(); } k.redraw(); });
    k.button("Parcourir le chemin",function(){ prog=0; lp.play(); },true);
    k.button("Remettre",function(){ pts=init(); });
    var ro=k.readouts(["1er vecteur","2e vecteur","3e vecteur","Somme des composantes","Vecteur direct","Verdict"]);
    var nt=k.note("","");
    M.grab(c,function(){ return ax?pts.map(function(q,i){ return {id:i,x:ax.X(q.x),y:ax.Y(q.y)}; }):[]; },
      function(i,px,py){ pts[i].x=M.snap(ax.ix(px),-8,8); pts[i].y=M.snap(ax.iy(py),-8,8); prog=1; k.redraw(); });
    function V(a,b){ return [b.x-a.x,b.y-a.y]; }
    k.draw(function(){
      var m=mode.value, A=pts[0],B=pts[1],C=pts[2],D=pts[3]; c.clear();
      var ab=V(A,B), bc=V(B,C), cd=V(C,D), cb=V(C,B), ac=V(A,C), ad=V(A,D);
      var tail=m==="trap"?[B.x+cb[0],B.y+cb[1]]:null;
      ax=M.plane(c,7,{b:10,fit:pts.map(function(q){return [q.x,q.y];}).concat(tail?[tail]:[]),pad:1.6});
      var X=ax.X,Y=ax.Y;
      function arr(a,b,col,w){ if(a[0]!==b[0]||a[1]!==b[1]) S.draw.arrow(c,X(a[0]),Y(a[1]),X(b[0]),Y(b[1]),col,w); }
      var pa=[A.x,A.y],pb=[B.x,B.y],pc=[C.x,C.y],pd=[D.x,D.y];
      var sum,direct,ok,verdict;
      if(m==="3"){ arr(pa,pb,P.red,3); arr(pb,pc,P.green,3); arr(pc,pd,P.amber,3); arr(pa,pd,P.violet,4.4); sum=[ab[0]+bc[0]+cd[0],ab[1]+bc[1]+cd[1]]; direct=ad; }
      else if(m==="2"){ arr(pa,pb,P.red,3); arr(pb,pc,P.green,3); arr(pa,pc,P.violet,4.4); sum=[ab[0]+bc[0],ab[1]+bc[1]]; direct=ac; }
      else { arr(pa,pb,P.red,3); arr(pb,tail,P.green,3); arr(pa,pc,P.violet,4.4); S.draw.line(c,X(B.x),Y(B.y),X(C.x),Y(C.y),P.grey,1.4,[4,4]); sum=[ab[0]+cb[0],ab[1]+cb[1]]; direct=ac; }
      ok=sum[0]===direct[0]&&sum[1]===direct[1];
      /* jeton qui suit le chemin */
      if(prog<1&&m!=="trap"){ var segs=m==="3"?[[pa,pb],[pb,pc],[pc,pd]]:[[pa,pb],[pb,pc]], n=segs.length, f=prog*n, i=Math.min(n-1,Math.floor(f)), g=f-i, s=segs[i];
        S.draw.dot(c,X(s[0][0]+(s[1][0]-s[0][0])*g),Y(s[0][1]+(s[1][1]-s[0][1])*g),8,P.ink); }
      pts.forEach(function(q,i){ M.handle(c,X(q.x),Y(q.y),P.ink,6); S.draw.text(c,nm[i],X(q.x)+11,Y(q.y)-13,{size:14,color:P.ink,halo:true}); });
      if(m==="trap"&&tail){ S.draw.dot(c,X(tail[0]),Y(tail[1]),4.5,P.green); M.lab(c,"AB + CB",X(tail[0]),Y(tail[1])+(tail[1]>=B.y?-17:17),P.green,{size:11}); }
      M.lab(c,m==="3"?"AD":"AC",(X(pa[0])+X(m==="3"?pd[0]:pc[0]))/2,(Y(pa[1])+Y(m==="3"?pd[1]:pc[1]))/2-14,P.violet,{size:11.5});
      ro.set(0,"AB "+M.comp(ab[0],ab[1])); ro.set(1,m==="trap"?"CB "+M.comp(cb[0],cb[1]):"BC "+M.comp(bc[0],bc[1])); ro.set(2,m==="3"?"CD "+M.comp(cd[0],cd[1]):"—");
      ro.set(3,M.comp(sum[0],sum[1])); ro.set(4,(m==="3"?"AD ":"AC ")+M.comp(direct[0],direct[1])); ro.set(5,ok?"égaux ✓":"différents ✗");
      if(m==="trap") nt.set(ok?"Ici AB + CB = AC seulement parce que B et C coïncident. Déplace un point : en général, ils diffèrent.":"AB + CB ≠ AC : la fin de AB (le point B) n'est pas le début de CB (le point C). Il faut écrire AB + BC.",ok?"warn":"bad");
      else nt.set("Chasles : "+(m==="3"?"AB + BC + CD = AD":"AB + BC = AC")+". Les composantes de la somme et du vecteur direct sont identiques, quels que soient les points.","ok");
    });
  }
});

/* ---------- colinéarité ---------- */
SFA.sim({
  id:"m4-c08-colinearite", ch:"c08", tag:"Défi",
  titre:"Vecteurs colinéaires : le déterminant s'annule",
  resume:"Deux vecteurs sont colinéaires quand a·d − b·c = 0 : le parallélogramme devient plat.",
  but:"Fais glisser les pointes de u (rouge) et de v (vert). Observe l'aire du parallélogramme construit sur u et v. Défi : trouve 3 vecteurs v colinéaires à u, tous différents, sans que v soit égal à u.",
  aRetenir:"u(a ; b) et v(c ; d) sont colinéaires ⇔ a·d − b·c = 0 ⇔ v = k·u (ou u = 0). L'aire du parallélogramme vaut |a·d − b·c| : elle est nulle quand les vecteurs sont sur la même droite.",
  piege:"Colinéaires ne veut pas dire égaux : v = 2u ou v = −u sont colinéaires à u mais différents. Le sens peut même être opposé (k < 0).",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.92});
    var a=k.slider("a (composante x de u)",-5,5,1,2,"");
    var b=k.slider("b (composante y de u)",-5,5,1,1,"");
    var cx=k.slider("c (composante x de v)",-5,5,1,-1,"");
    var d=k.slider("d (composante y de v)",-5,5,1,3,"");
    var found={}, nfound=0, ax=null;
    k.button("Recommencer le défi",function(){ found={}; nfound=0; });
    var ro=k.readouts(["u","v","Déterminant a·d − b·c","Colinéaires ?"]);
    var nt=k.note("","");
    M.grab(c,function(){ return ax?[{id:"u",x:ax.X(a.value),y:ax.Y(b.value)},{id:"v",x:ax.X(cx.value),y:ax.Y(d.value)}]:[]; },
      function(id,px,py){ var X=M.snap(ax.ix(px),-5,5), Y=M.snap(ax.iy(py),-5,5); if(id==="u"){ a.set(X); b.set(Y); } else { cx.set(X); d.set(Y); } k.redraw(); });
    function br(n){ return n<0?"("+F(n,0)+")":F(n,0); }
    k.draw(function(){
      var A=a.value,B=b.value,C=cx.value,D=d.value, det=A*D-B*C; c.clear();
      ax=M.plane(c,6,{b:10,fit:[[A+C,B+D]],pad:1.4});
      var X=ax.X,Y=ax.Y,O=[X(0),Y(0)],U=[X(A),Y(B)],V=[X(C),Y(D)],W=[X(A+C),Y(B+D)];
      var uz=(A===0&&B===0), vz=(C===0&&D===0);
      /* droite portée par u */
      if(!uz){ var L=40; S.draw.line(c,O[0]-(U[0]-O[0])*L,O[1]-(U[1]-O[1])*L,O[0]+(U[0]-O[0])*L,O[1]+(U[1]-O[1])*L,S.draw.tint(P.red,.28),1.5,[6,5]); }
      var colour=det===0?P.red:P.acc;
      M.poly(c,[O,U,W,V],S.draw.tint(colour,det===0?.25:.12),det===0?P.red:null,det===0?1.2:0);
      if(!uz) S.draw.arrow(c,O[0],O[1],U[0],U[1],P.red,3.4);
      if(!vz) S.draw.arrow(c,O[0],O[1],V[0],V[1],P.green,3.4);
      S.draw.dot(c,O[0],O[1],4,P.ink);
      if(det!==0){ var mx=(O[0]+U[0]+V[0]+W[0])/4, my=(O[1]+U[1]+V[1]+W[1])/4; M.lab(c,"aire = "+F(Math.abs(det),0),mx,my,P.acc,{size:12}); }
      else if(!uz&&!vz) M.lab(c,"aire = 0 : parallélogramme plat",O[0]+(U[0]-O[0])*.5,O[1]+(U[1]-O[1])*.5+(U[1]<O[1]?22:-22),P.red,{size:11});
      M.lab(c,"u",U[0]+(A>=0?15:-15),U[1]+(B>=0?-14:14),P.red,{size:12}); M.lab(c,"v",V[0]+(C>=0?15:-15),V[1]+(D>=0?-14:14),P.green,{size:12});
      M.handle(c,U[0],U[1],P.red,7); M.handle(c,V[0],V[1],P.green,7);
      ro.set(0,M.comp(A,B)); ro.set(1,M.comp(C,D)); ro.set(2,F(A,0)+"×"+br(D)+" − "+br(B)+"×"+br(C)+" = "+F(det,0)); ro.set(3,det===0?"oui":"non");
      var msg,kind="";
      if(det===0){
        if(uz||vz) msg="Le vecteur nul est colinéaire à tout vecteur (mais il ne compte pas pour le défi).";
        else { var kk=A!==0?C/A:D/B;
          if(kk===1){ msg="Colinéaires : v = 1·u. Ils sont égaux : essaie un autre v !"; kind="warn"; }
          else { if(!found[F(kk,3)]){ found[F(kk,3)]=1; nfound++; } msg="Colinéaires : v = "+F(kk,2)+"·u"+(kk<0?" (sens opposé)":"")+". Défi : "+Math.min(nfound,3)+" / 3 valeurs de k trouvées"+(nfound>=3?" — réussi !":"."); kind="ok"; } }
      } else msg="Déterminant ≠ 0 : u et v ne sont pas colinéaires, le parallélogramme a une aire de "+F(Math.abs(det),0)+". Défi : "+Math.min(nfound,3)+" / 3.";
      nt.set(msg,kind);
    });
  }
});

/* ---------- navigation ---------- */
SFA.sim({
  id:"m4-c08-navigation", ch:"c08", tag:"Défi",
  titre:"Bateau et courant : vitesse propre + courant = vitesse sol",
  resume:"Règle le cap, la vitesse et le courant : la route réelle est la somme de deux vecteurs.",
  but:"Un bateau avance à vitesse propre vₚ dans la direction de son cap. Le courant le pousse. Défi : avec un courant vers l'est, règle le cap (glisse la pointe rouge) pour que la route réelle soit plein nord malgré la dérive, puis lance la traversée.",
  aRetenir:"Vitesse par rapport au sol = vitesse propre + vitesse du courant (somme de vecteurs). Pour un cap θ mesuré depuis le nord vers l'est : composantes (v·sin θ ; v·cos θ). La route est la direction de la vitesse sol ; la dérive est l'écart entre route et cap.",
  piege:"Le bateau ne va pas dans la direction où il pointe : le courant le déporte. On ne soustrait ni n'additionne les normes : on additionne les composantes.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, D2R=Math.PI/180;
    var c=k.canvas(0,{ratio:.95});
    var vp=k.slider("Vitesse propre vₚ",4,12,1,8,"km/h");
    var cap=k.slider("Cap (depuis le nord, sens horaire)",0,359,1,40,"°");
    var vc=k.slider("Vitesse du courant",0,8,1,3,"km/h");
    var dc=k.slider("Direction du courant (vers…)",0,355,5,90,"°");
    var prog=0, geo={};
    var lp=k.loop(function(dt){ prog+=dt*0.45; if(prog>=1.15){ prog=1.15; lp.pause(); } k.redraw(); });
    k.button("Lancer la traversée",function(){ prog=0; lp.play(); },true);
    var ro=k.readouts(["Vitesse propre","Courant","Vitesse sol","Route (depuis le nord)","Dérive"]);
    var nt=k.note("","");
    function vec(n,a){ return [n*Math.sin(a*D2R), n*Math.cos(a*D2R)]; }
    M.grab(c,function(){ if(!geo.X) return []; var V=vec(vp.value,cap.value), C=vec(vc.value,dc.value);
        return [{id:"v",x:geo.X(V[0]),y:geo.Y(V[1])},{id:"c",x:geo.X(V[0]+C[0]),y:geo.Y(V[1]+C[1])}]; },
      function(id,px,py){ var x=geo.ix(px), y=geo.iy(py);
        if(id==="v"){ var n=Math.hypot(x,y); vp.set(M.clamp(Math.round(n),4,12)); if(n>0.5) cap.set(Math.round(((Math.atan2(x,y)/D2R)+360)%360)%360); }
        else { var V=vec(vp.value,cap.value), cx=x-V[0], cy=y-V[1], n2=Math.hypot(cx,cy); vc.set(M.clamp(Math.round(n2),0,8)); if(n2>0.8) dc.set(Math.round(((Math.atan2(cx,cy)/D2R)+360)%360/5)*5%360); }
        prog=0; k.redraw(); });
    k.draw(function(){
      var V=vec(vp.value,cap.value), Cc=vec(vc.value,dc.value), G=[V[0]+Cc[0],V[1]+Cc[1]], ng=Math.hypot(G[0],G[1]);
      c.clear(); var W=c.W,H=c.H,ctx=c.ctx;
      var R=Math.max(12,Math.ceil((Math.max(Math.hypot(V[0],V[1]),Math.hypot(G[0],G[1]),Math.abs(V[0]+Cc[0]),Math.abs(V[1]+Cc[1]))+3)/2)*2);
      var sc=(Math.min(W,H)/2-16)/R, ox=W/2, oy=H/2+6;
      geo.X=function(x){return ox+x*sc;}; geo.Y=function(y){return oy-y*sc;}; geo.ix=function(px){return (px-ox)/sc;}; geo.iy=function(py){return (oy-py)/sc;};
      var X=geo.X,Y=geo.Y;
      /* mer */
      var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,"#e6f3fa"); g.addColorStop(1,"#cfe6f3"); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      /* cercles de portée */
      ctx.save(); ctx.strokeStyle="rgba(30,63,143,.14)"; ctx.lineWidth=1; for(var r=4;r<=R;r+=4){ ctx.beginPath(); ctx.arc(ox,oy,r*sc,0,2*Math.PI); ctx.stroke(); } 
      ctx.beginPath(); ctx.moveTo(ox,oy-R*sc); ctx.lineTo(ox,oy+R*sc); ctx.moveTo(ox-R*sc,oy); ctx.lineTo(ox+R*sc,oy); ctx.stroke(); ctx.restore();
      /* stries du courant */
      if(vc.value>0){ ctx.save(); ctx.strokeStyle="rgba(14,127,150,.30)"; ctx.lineWidth=2; ctx.lineCap="round";
        var ux=Cc[0]/vc.value, uy=Cc[1]/vc.value, off=(prog>0&&lp.running?prog*18:0);
        for(var i=-6;i<=6;i++) for(var j=-3;j<=3;j++){ var bx=ox+(i*58+((j%2)*29)), by=oy-(j*66)-30; var tx=bx+ux*((off+j*7)%28), ty=by-uy*((off+j*7)%28); ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+ux*14,ty-uy*14); ctx.stroke(); }
        ctx.restore(); }
      /* route voulue : plein nord + phare */
      S.draw.line(c,ox,oy,ox,oy-R*sc,"rgba(36,119,90,.55)",1.6,[6,5]);
      var route0=ng<0.01?NaN:((Math.atan2(G[0],G[1])/D2R)+360)%360, north=!isNaN(route0)&&(route0<1.5||route0>358.5);
      var lx=ox,ly=oy-R*sc+12; ctx.save(); S.draw.glow(c,lx,ly,22,north?P.yellow:"#ffffff",north?.9:.45);
      ctx.fillStyle="#fff"; ctx.strokeStyle=P.ink; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(lx-5,ly+9); ctx.lineTo(lx-3,ly-6); ctx.lineTo(lx+3,ly-6); ctx.lineTo(lx+5,ly+9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle=P.red; ctx.fillRect(lx-3,ly-9,6,4); ctx.restore();
      S.draw.text(c,"N",ox+12,oy-R*sc+4,{size:12,color:P.green,align:"left"}); S.draw.text(c,"E",ox+R*sc-8,oy-10,{size:12,color:P.grey});
      /* vecteurs */
      S.draw.arrow(c,X(0),Y(0),X(V[0]),Y(V[1]),P.red,3.2);
      if(vc.value>0) S.draw.arrow(c,X(V[0]),Y(V[1]),X(G[0]),Y(G[1]),P.teal,3.2);
      if(ng>0.01) S.draw.arrow(c,X(0),Y(0),X(G[0]),Y(G[1]),P.acc,4.6);
      /* trace + bateau */
      var f=Math.min(1,prog), bp=[G[0]*f,G[1]*f];
      if(prog>0){ S.draw.line(c,X(0),Y(0),X(bp[0]),Y(bp[1]),"rgba(255,255,255,.95)",5); S.draw.line(c,X(0),Y(0),X(bp[0]),Y(bp[1]),P.acc,1.6,[2,4]); }
      var bx=X(bp[0]), by=Y(bp[1]), a=cap.value*D2R; ctx.save(); ctx.translate(bx,by); ctx.rotate(a); ctx.fillStyle="#fff"; ctx.strokeStyle=P.ink; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(0,-14); ctx.quadraticCurveTo(8,-4,6,11); ctx.lineTo(-6,11); ctx.quadraticCurveTo(-8,-4,0,-14); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle=P.red; ctx.fillRect(-1,-4,2,9); ctx.restore();
      M.lab(c,"vₚ = "+F(vp.value,0),X(V[0]/2)-(V[0]>=0?30:-30),Y(V[1]/2),P.red,{size:11});
      if(vc.value>0) M.lab(c,"courant "+F(vc.value,0),X(V[0]+Cc[0]/2)+(Cc[0]>=0?36:-36),Y(V[1]+Cc[1]/2)-10,P.teal,{size:11});
      M.handle(c,X(V[0]),Y(V[1]),P.red,6.5); if(vc.value>0||true) M.handle(c,X(G[0]),Y(G[1]),P.teal,6.5);
      /* lectures */
      var route=ng<0.01?NaN:((Math.atan2(G[0],G[1])/D2R)+360)%360, der=isNaN(route)?NaN:(((route-cap.value+540)%360)-180);
      ro.set(0,F(vp.value,0)+" km/h, cap "+F(cap.value,0)+"°"); ro.set(1,F(vc.value,0)+" km/h vers "+F(dc.value,0)+"°");
      ro.set(2,F(ng,2)+" km/h"); ro.set(3,isNaN(route)?"—":F(route,1)+"°"); ro.set(4,isNaN(der)?"—":F(der,1)+"°");
      var ok=!isNaN(route)&&(route<1.5||route>358.5);
      nt.set(isNaN(route)?"Vitesse sol nulle : le bateau fait du sur-place.":(ok?(vc.value===0?"Pas de courant : la route est égale au cap, plein nord.":"Route plein nord ! Le cap compense le courant : la composante vers l'est de la vitesse sol est nulle ("+F(G[0],2)+" km/h). Lance la traversée."):"Pour aller plein nord, la composante vers l'est de la vitesse sol doit être nulle : vₚ·sin θ + (courant vers l'est) = 0."+(vc.value>vp.value&&(dc.value===90||dc.value===270)?" Ici le courant est plus fort que la vitesse propre : aucun cap ne permet d'aller plein nord.":"")),ok?"ok":"");
    });
  }
});
})();
