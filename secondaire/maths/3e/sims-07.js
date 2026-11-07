/* Chapitre 7 : angles et isométrie */
window.M3 = window.M3 || {};
M3.wedge = function(c,cx,cy,startDeg,sweepDeg,r,fill,stroke){
  var ctx=c.ctx, a0=-startDeg*Math.PI/180, a1=-(startDeg+sweepDeg)*Math.PI/180;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,a0,a1,true); ctx.closePath();
  if(fill){ ctx.fillStyle=fill; ctx.fill(); } if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=1.5; ctx.stroke(); }
};
SFA.sim({
  id:"m3-c07-paralleles", ch:"c07", tag:"Parallèles et sécante", titre:"Deux parallèles et une sécante : quels angles sont égaux ?",
  resume:"Huit angles, mais seulement deux valeurs : θ et 180° − θ. Sauf si les droites ne sont pas parallèles !",
  but:"Choisis un type de paire d'angles et incline la sécante. Puis incline la 2e droite pour voir ce qui se perd quand elle n'est plus parallèle.",
  aRetenir:"Avec deux parallèles : les angles opposés par le sommet, correspondants, alternes-internes et alternes-externes sont égaux ; les angles co-internes sont supplémentaires (somme 180°).",
  piege:"Les égalités entre correspondants et alternes-internes ne sont vraies que si les droites sont parallèles. Seuls les angles opposés par le sommet sont toujours égaux.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.8}), P=S.draw.palette;
    var tp=k.seg("Paire d'angles",[["opp","Opposés par le sommet"],["corr","Correspondants"],["ai","Alternes-internes"],["ae","Alternes-externes"],["ci","Co-internes"]],"corr");
    var th=k.slider("Inclinaison θ de la sécante",40,140,1,65,"°"), ep=k.slider("Inclinaison de la 2e droite",-20,20,1,0,"°");
    var ro=k.readouts(["Angle 1","Angle 2","Relation"]);
    var nt=k.note("");
    var PAIRS={opp:[[1,"NE"],[1,"SW"]],corr:[[1,"NE"],[2,"NE"]],ai:[[1,"SW"],[2,"NE"]],ae:[[1,"NW"],[2,"SE"]],ci:[[1,"SE"],[2,"NE"]]};
    function sector(sec,lam,T){ var v=T-lam; return {NE:[lam,v],NW:[T,180-v],SW:[lam+180,v],SE:[T+180,180-v]}[sec]; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, T=th.value, E=ep.value, W=c.W, H=c.H, y1=H*0.32, y2=H*0.68, Dl=y2-y1, tr=T*Math.PI/180;
      var s=Dl/Math.sin(tr), x1=W/2+s*Math.cos(tr)/2, x2=x1-s*Math.cos(tr);
      var L=W*0.46, er=E*Math.PI/180;
      S.draw.line(c,x1-L,y1,x1+L,y1,P.ink,2.5); S.draw.line(c,x2-L*Math.cos(er),y2+L*Math.sin(er),x2+L*Math.cos(er),y2-L*Math.sin(er),P.ink,2.5);
      var dx=Math.cos(tr), dy=-Math.sin(tr), ext=H*0.5/Math.sin(tr);
      S.draw.line(c,x1+dx*(Dl*0.5/Math.sin(tr)+0)*0+dx*(-ext*0.45)*-1,y1+dy*(-ext*0.45)*-1,x2-dx*ext*0.45,y2-dy*ext*0.45,P.grey,2.5);
      var pts={1:[x1,y1,0],2:[x2,y2,E]}, pr=PAIRS[tp.value], cols=[P.red,P.acc], vals=[];
      [1,2].forEach(function(id){ ["NE","NW","SW","SE"].forEach(function(sec){ var sc=sector(sec,pts[id][2],T); M3.wedge(c,pts[id][0],pts[id][1],sc[0],sc[1],26,"rgba(138,149,163,.18)"); }); });
      pr.forEach(function(p,i){ var q=pts[p[0]], sc=sector(p[1],q[2],T); vals.push(sc[1]);
        M3.wedge(c,q[0],q[1],sc[0],sc[1],36,i?"rgba(30,63,143,.45)":"rgba(180,35,24,.45)",cols[i]);
        var mid=(sc[0]+sc[1]/2)*Math.PI/180; S.draw.text(c,S.fmt(sc[1],0)+"°",q[0]+Math.cos(mid)*54,q[1]-Math.sin(mid)*54,{size:13,color:cols[i],bg:"rgba(255,255,255,.85)"}); });
      var v1=vals[0],v2=vals[1], rel=Math.abs(v1-v2)<0.01?"égaux":Math.abs(v1+v2-180)<0.01?"supplémentaires":"ni égaux ni supplémentaires";
      ro.set(0,S.fmt(v1,0)+"°"); ro.set(1,S.fmt(v2,0)+"°"); ro.set(2,rel);
      if(tp.value==="opp") nt.set("Opposés par le sommet : toujours égaux, même si les droites ne sont pas parallèles.","ok");
      else if(E!==0) nt.set("Les droites ne sont plus parallèles : la propriété "+(tp.value==="ci"?"« somme 180° » ":"d'égalité ")+"est perdue ("+rel+").","warn");
      else nt.set(tp.value==="ci"?"Droites parallèles : les angles co-internes valent θ et 180° − θ, leur somme fait 180°.":"Droites parallèles : ces deux angles sont égaux.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c07-somme", ch:"c07", tag:"À la souris", titre:"La somme des angles d'un triangle : arrache les coins",
  resume:"Déforme le triangle, puis réaligne ses trois coins sur une droite : ils forment un angle plat.",
  but:"Glisse les sommets du triangle. Puis fais glisser le curseur pour déplacer les trois angles sur la droite du bas.",
  aRetenir:"Dans tout triangle, la somme des angles vaut 180°. Les trois coins mis côte à côte forment un angle plat.",
  piege:"Ne mesure pas à l'œil : une figure dessinée n'est jamais une preuve. C'est la propriété qui donne 180°, pas le dessin.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:1.0}), P=S.draw.palette;
    var V=[[0.14,0.5],[0.86,0.42],[0.42,0.06]], sel=-1;
    var tt=k.slider("Réaligner les coins",0,1,0.01,0,"");
    var lp=k.loop(function(dt){ var v=tt.value+dt*0.5; if(v>=1){ v=1; lp.pause(); } tt.set(v); k.redraw(); });
    k.button("Arracher les coins (animation)",function(){ if(tt.value>=1) tt.set(0); lp.play(); },true);
    k.button("Triangle quelconque",function(){ V[0]=[0.14,0.5];V[1]=[0.86,0.42];V[2]=[0.42,0.06]; lp.pause(); tt.set(0); });
    k.button("Triangle obtus",function(){ V[0]=[0.1,0.46];V[1]=[0.9,0.46];V[2]=[0.2,0.06]; lp.pause(); tt.set(0); });
    var ro=k.readouts(["Angle A","Angle B","Angle C","Somme"]); var nt=k.note("");
    function pos(){ var W=c.W,H=c.H; return V.map(function(v){ return [v[0]*W, 34+v[1]*H*0.9]; }); }
    c.pointer(function(t,p){
      var ps=pos();
      if(t==="down"){ var best=-1,bd=34; ps.forEach(function(q,i){ var d=Math.hypot(p.x-q[0],p.y-q[1]); if(d<bd){bd=d;best=i;} }); sel=best; }
      if((t==="down"||t==="drag")&&sel>=0){ V[sel]=[Math.max(0.03,Math.min(0.97,p.x/c.W)),Math.max(0,Math.min(0.55,(p.y-34)/(c.H*0.9)))]; k.redraw(); }
      if(t==="up") sel=-1;
    });
    function angleAt(ps,i){ var A=ps[i],B=ps[(i+1)%3],C=ps[(i+2)%3];
      var dB=Math.atan2(-(B[1]-A[1]),B[0]-A[0])*180/Math.PI, dC=Math.atan2(-(C[1]-A[1]),C[0]-A[0])*180/Math.PI;
      var df=((dC-dB)%360+360)%360, st,sw; if(df<=180){st=dB;sw=df;}else{st=dC;sw=360-df;} return {start:st,sweep:sw}; }
    window.M3.fit(c,0.72,1.0);
    k.draw(function(){
      c.clear(); var ps=pos(), t=tt.value, ctx=c.ctx, cols=[P.red,P.acc,P.green], names=["A","B","C"];
      ctx.beginPath(); ctx.moveTo(ps[0][0],ps[0][1]); ctx.lineTo(ps[1][0],ps[1][1]); ctx.lineTo(ps[2][0],ps[2][1]); ctx.closePath(); ctx.fillStyle="rgba(30,63,143,.07)"; ctx.fill(); ctx.strokeStyle=P.ink; ctx.lineWidth=2.4; ctx.stroke();
      var yb=c.H*0.88, qx=c.W/2; S.draw.line(c,qx-c.W*0.44,yb,qx+c.W*0.44,yb,P.grey,2.4); if(t>0.02) S.draw.text(c,"droite",qx+c.W*0.44-4,yb+14,{size:11,color:P.grey,align:"right"});
      var cum=0, tot=0, ang=[];
      for(var i=0;i<3;i++){ var a=angleAt(ps,i); ang.push(a); tot+=a.sweep; }
      for(i=0;i<3;i++){ var a2=ang[i], r=Math.min(46,c.W*0.14), tgtStart=cum;
        var d=(((tgtStart-a2.start)%360)+540)%360-180, st=a2.start+d*t;
        var cx=ps[i][0]+(qx-ps[i][0])*t, cy=ps[i][1]+(yb-ps[i][1])*t;
        M3.wedge(c,cx,cy,st,a2.sweep,r,cols[i],"#fff");
        var mid=(st+a2.sweep/2)*Math.PI/180; S.draw.text(c,names[i]+" "+S.fmt(a2.sweep,0)+"°",cx+Math.cos(mid)*(r+17),cy-Math.sin(mid)*(r+17),{size:M3.sz(c,12.5),color:cols[i],bg:"rgba(255,255,255,.85)"});
        cum+=a2.sweep; }
      ps.forEach(function(q,i){ if(t<0.02) window.M3.handle(c,q[0],q[1],cols[i],false,8); else S.draw.dot(c,q[0],q[1],4,P.ink); });
      if(t<0.01) S.draw.text(c,"Glisse les sommets du triangle",c.W/2,16,{size:12,color:P.grey});
      if(t>0.97){ ctx.save(); ctx.strokeStyle=P.ink; ctx.lineWidth=2; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.arc(qx,yb,Math.min(46,c.W*0.14)+34,Math.PI,2*Math.PI); ctx.stroke(); ctx.restore(); S.draw.label(c,"angle plat : "+S.fmt(tot,0)+"°",qx,yb-Math.min(46,c.W*0.14)-52,{color:P.ink,size:M3.sz(c,14)}); }
      var flat=false; for(i=0;i<3;i++){ var q1=ps[i], q2=ps[(i+1)%3]; if(Math.hypot(q1[0]-q2[0],q1[1]-q2[1])<4) flat=true; }
      var area2=Math.abs((ps[1][0]-ps[0][0])*(ps[2][1]-ps[0][1])-(ps[2][0]-ps[0][0])*(ps[1][1]-ps[0][1])); if(area2<6) flat=true;
      if(flat){ for(i=0;i<3;i++) ro.set(i,"—"); ro.set(3,"—"); nt.set("Triangle aplati (sommets confondus ou alignés) : les angles ne sont pas définis. Écarte les sommets.","warn"); return; }
      for(i=0;i<3;i++) ro.set(i,S.fmt(ang[i].sweep,1)+"°");
      ro.set(3,S.fmt(tot,1)+"°");
      nt.set(t>0.95?"Les trois coins forment ensemble un angle plat : 180°.":"Déforme le triangle : la somme reste 180° (au dixième de degré près).","ok");
    });
  }
});
SFA.sim({
  id:"m3-c07-construction", ch:"c07", tag:"Isométrie", titre:"Constructeur de triangles : combien de triangles possibles ?",
  resume:"CCC, CAC, ACA : un seul triangle. AAA et CCA (côté, côté, angle non compris) : pas toujours !",
  but:"Choisis un cas, règle les données (les données utilisées sont affichées sur la figure) et regarde combien de triangles existent. En CCA, le cercle de rayon u autour de B coupe le rayon en 0, 1 ou 2 points.",
  aRetenir:"Deux triangles sont isométriques (superposables) si CCC, CAC ou ACA. Trois angles (AAA) ne suffisent pas : on obtient des triangles semblables de tailles différentes.",
  piege:"Deux côtés et un angle NON compris entre eux (CCA) peuvent donner 0, 1 ou 2 triangles : ce n'est pas un cas d'isométrie.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.8}), P=S.draw.palette, T=S.draw.tint;
    var md=k.seg("Cas",[["ccc","CCC"],["cac","CAC"],["aca","ACA"],["aaa","AAA"],["ssa","CCA"]],"ccc");
    var u=k.slider("Longueur u",1,10,0.5,6,""), v=k.slider("Longueur v",1,10,0.5,5,""), w=k.slider("Longueur w",1,10,0.5,4,"");
    var al=k.slider("Angle α",20,150,1,50,"°"), be=k.slider("Angle β",20,150,1,60,"°");
    var ro=k.readouts(["Données utilisées","Triangles possibles"]); var nt=k.note("");
    var HELP={ccc:"u, v, w : les trois côtés.",cac:"u et v : deux côtés ; α : l'angle compris entre eux.",aca:"α et β : deux angles ; u : le côté entre eux.",aaa:"α et β : deux angles (le 3e se déduit) ; u : taille choisie.",ssa:"u : côté opposé à α ; v : côté adjacent à α ; α : angle non compris entre u et v."};
    function build(){
      var m=md.value, U=u.value, V=v.value, W=w.value, A=al.value*Math.PI/180, B=be.value*Math.PI/180, g={tris:[],arcs:[],ext:[[0,0]],rays:[]};
      if(m==="ccc"){ /* AB = w, AC = v, BC = u */
        if(U+V>W&&U+W>V&&V+W>U){ var x=(V*V+W*W-U*U)/(2*W), y=Math.sqrt(Math.max(0,V*V-x*x)); g.tris.push([[0,0],[W,0],[x,y]]);
          var a1=Math.atan2(y,x), a2=Math.atan2(y,x-W); g.arcs.push({cx:0,cy:0,r:V,a0:a1-0.45,a1:a1+0.45,col:P.acc}); g.arcs.push({cx:W,cy:0,r:U,a0:a2-0.45,a1:a2+0.45,col:P.amber}); }
        else { g.ext.push([W,0]); g.arcs.push({cx:0,cy:0,r:V,a0:0,a1:Math.PI/2,col:P.acc}); g.arcs.push({cx:W,cy:0,r:U,a0:Math.PI/2,a1:Math.PI,col:P.amber}); } }
      if(m==="cac"){ g.tris.push([[0,0],[V,0],[U*Math.cos(A),U*Math.sin(A)]]); }
      if(m==="aca"){ if(al.value+be.value<180){ var ab=U*Math.sin(B)/Math.sin(A+B); g.tris.push([[0,0],[U,0],[ab*Math.cos(A),ab*Math.sin(A)]]); } else { g.ext.push([U,0]); g.rays.push([0,0,A,U*1.3]); g.rays.push([U,0,Math.PI-B,U*1.3]); } }
      if(m==="aaa"){ if(al.value+be.value<180){ [U,U*1.6].forEach(function(sc){ var ab=sc*Math.sin(B)/Math.sin(A+B); g.tris.push([[0,0],[sc,0],[ab*Math.cos(A),ab*Math.sin(A)]]); }); } }
      if(m==="ssa"){ /* AB = v, angle α en A, BC = u */
        var h=V*Math.sin(A), disc=U*U-h*h, ts=[];
        if(Math.abs(disc)<1e-9){ ts=[V*Math.cos(A)]; } else if(disc>0){ ts=[V*Math.cos(A)+Math.sqrt(disc),V*Math.cos(A)-Math.sqrt(disc)]; }
        ts.forEach(function(t){ if(t>1e-9) g.tris.push([[0,0],[V,0],[t*Math.cos(A),t*Math.sin(A)]]); });
        g.arcs.push({cx:V,cy:0,r:U,a0:0,a1:Math.PI,col:P.amber}); g.ext.push([V,0]); g.rays.push([0,0,A,Math.max(V,U,V*Math.cos(A)+Math.sqrt(Math.max(0,disc)))*1.12]); g.h=h; g.V=V; g.A=A; }
      return g;
    }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, g=build(), m=md.value, fs=M3.sz(c,14), names=["A","B","C"];
      /* cadre de la figure : tous les points utiles */
      var pts=g.ext.slice(); g.tris.forEach(function(t){ t.forEach(function(q){pts.push(q);}); });
      g.arcs.forEach(function(a){ [a.a0,a.a1,(a.a0+a.a1)/2].forEach(function(an){ pts.push([a.cx+a.r*Math.cos(an),a.cy+a.r*Math.sin(an)]); }); });
      g.rays.forEach(function(r){ pts.push([r[0]+r[3]*Math.cos(r[2]),r[1]+r[3]*Math.sin(r[2])]); });
      var xs=pts.map(function(q){return q[0];}), ys=pts.map(function(q){return q[1];});
      var mnx=Math.min.apply(null,xs), mxx=Math.max.apply(null,xs), mny=Math.min.apply(null,ys.concat([0])), mxy=Math.max.apply(null,ys.concat([1]));
      var sc=Math.min((c.W-70)/Math.max(0.5,mxx-mnx),(c.H-120)/Math.max(0.5,mxy-mny)), ox=(c.W-(mxx-mnx)*sc)/2-mnx*sc, oy=c.H-52+mny*sc;
      function X(p){ return ox+p[0]*sc; } function Y(p){ return oy-p[1]*sc; }
      /* sol */
      S.draw.line(c,18,oy,c.W-18,oy,"#e3e7ed",1.5);
      /* arcs de compas et rayons */
      g.arcs.forEach(function(a){ ctx.save(); ctx.strokeStyle=T(a.col,0.7); ctx.lineWidth=2; ctx.setLineDash([6,5]); ctx.beginPath(); ctx.arc(ox+a.cx*sc,oy-a.cy*sc,a.r*sc,-a.a1,-a.a0); ctx.stroke(); ctx.restore(); });
      g.rays.forEach(function(r){ S.draw.line(c,ox+r[0]*sc,oy-r[1]*sc,ox+(r[0]+r[3]*Math.cos(r[2]))*sc,oy-(r[1]+r[3]*Math.sin(r[2]))*sc,T(P.grey,0.9),1.8,[3,4]); });
      /* hauteur en CCA */
      if(m==="ssa"){ var A0=g.A, fx=g.V*Math.cos(A0)*Math.cos(A0)*0, hx=(g.V*Math.cos(A0)), hy=(g.V*Math.sin(A0)*0);
        var fpx=g.V*Math.cos(A0)*Math.cos(A0), fpy=g.V*Math.cos(A0)*Math.sin(A0);   /* pied de la perpendiculaire issue de B */
        S.draw.line(c,X([g.V,0]),Y([0,0]),X([fpx,fpy]),Y([fpx,fpy]),T(P.green,0.8),2,[2,4]);
        S.draw.label(c,"h = "+S.fmt(g.h,2),(X([g.V,0])+X([fpx,fpy]))/2+14,(Y([0,0])+Y([fpx,fpy]))/2,{color:P.green,size:fs-2}); }
      /* triangles */
      g.tris.forEach(function(t,i){
        ctx.beginPath(); t.forEach(function(p,j){ j?ctx.lineTo(X(p),Y(p)):ctx.moveTo(X(p),Y(p)); }); ctx.closePath();
        var col=(m==="aaa"||i===1)?P.red:P.acc; ctx.fillStyle=T(col,i===1&&m!=="aaa"?0.12:0.16); ctx.fill();
        ctx.save(); ctx.lineWidth=2.8; ctx.strokeStyle=col; ctx.lineJoin="round"; if(i===1) ctx.setLineDash([8,5]); ctx.stroke(); ctx.restore();
        t.forEach(function(p,j){ S.draw.dot(c,X(p),Y(p),4.5,col); });
        if(i===0||m==="aaa"&&i===1){ t.forEach(function(p,j){ if(i===1&&m==="aaa"&&j!==2) return; var dx=j===0?-14:j===1?14:0, dy=j===2?-16:16; S.draw.text(c,j===2&&g.tris.length===2&&m==="ssa"?"C₁":names[j],X(p)+dx,Y(p)+dy,{size:fs,color:col,math:true}); }); }
        if(i===1&&m==="ssa") S.draw.text(c,"C₂",X(t[2])+(t[2][0]<g.tris[0][2][0]?-16:16),Y(t[2])-12,{size:fs,color:col,math:true});
      });
      /* données affichées sur la figure */
      var t0=g.tris[0];
      function sideLab(p,q,txt,col,off){ var mx=(X(p)+X(q))/2, my=(Y(p)+Y(q))/2, dx=Y(q)-Y(p), dy=-(X(q)-X(p)), L=Math.hypot(dx,dy)||1; S.draw.label(c,txt,mx+dx/L*off,my+dy/L*off,{color:col,size:fs-2}); }
      function angLab(p,a0,a1,txt,col){ var r=Math.min(34,0.2*sc*3); ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=2.4; ctx.beginPath(); ctx.arc(X(p),Y(p),r,-a1,-a0); ctx.stroke(); ctx.restore();
        var mid=(a0+a1)/2; S.draw.text(c,txt,X(p)+Math.cos(mid)*(r+17),Y(p)-Math.sin(mid)*(r+17),{size:fs-2,color:col}); }
      if(t0&&m!=="aaa"){
        var Aa=al.value*Math.PI/180;
        if(m==="ccc"){ sideLab(t0[0],t0[1],"w = "+S.fmt(w.value,1),P.ink,-18); sideLab(t0[0],t0[2],"v = "+S.fmt(v.value,1),P.acc,18); sideLab(t0[1],t0[2],"u = "+S.fmt(u.value,1),P.amber,-18); }
        if(m==="cac"){ sideLab(t0[0],t0[1],"v = "+S.fmt(v.value,1),P.ink,-18); sideLab(t0[0],t0[2],"u = "+S.fmt(u.value,1),P.amber,18); angLab(t0[0],0,Aa,"α = "+S.fmt(al.value,0)+"°",P.red); }
        if(m==="aca"){ sideLab(t0[0],t0[1],"u = "+S.fmt(u.value,1),P.ink,-18); angLab(t0[0],0,Aa,"α = "+S.fmt(al.value,0)+"°",P.red); angLab(t0[1],Math.PI-be.value*Math.PI/180,Math.PI,"β = "+S.fmt(be.value,0)+"°",P.acc); }
        if(m==="ssa"){ sideLab(t0[0],t0[1],"v = "+S.fmt(v.value,1),P.ink,-18); angLab(t0[0],0,Aa,"α = "+S.fmt(al.value,0)+"°",P.red); S.draw.line(c,X(t0[1]),Y(t0[1]),X(t0[2]),Y(t0[2]),P.amber,3); sideLab(t0[1],t0[2],"u = "+S.fmt(u.value,1),P.amber,18); }
      } else if(m==="ssa"){ S.draw.line(c,X([0,0]),Y([0,0]),X([g.V,0]),Y([0,0]),P.ink,3); angLab([0,0],0,g.A,"α = "+S.fmt(al.value,0)+"°",P.red); S.draw.text(c,"A",X([0,0])-14,Y([0,0])+16,{size:fs,math:true}); S.draw.text(c,"B",X([g.V,0])+14,Y([0,0])+16,{size:fs,math:true}); }
      else if(m==="ccc"){ S.draw.line(c,X([0,0]),Y([0,0]),X([w.value,0]),Y([0,0]),P.ink,3); S.draw.text(c,"A",X([0,0])-14,Y([0,0])+16,{size:fs,math:true}); S.draw.text(c,"B",X([w.value,0])+14,Y([0,0])+16,{size:fs,math:true}); }
      else if(m==="aca"){ S.draw.line(c,X([0,0]),Y([0,0]),X([u.value,0]),Y([0,0]),P.ink,3); }
      if(m==="aaa"&&g.tris.length){ angLab(g.tris[0][0],0,al.value*Math.PI/180,"α",P.red); angLab(g.tris[0][1],Math.PI-be.value*Math.PI/180,Math.PI,"β",P.acc);
        S.draw.label(c,"2 tailles, mêmes angles",c.W/2,18,{color:P.red,size:fs-1}); }
      var n=g.tris.length, txt, col;
      if(m==="aaa") txt=al.value+be.value<180?"une infinité (tailles différentes)":"aucun (α + β ≥ 180°)";
      else txt=n===0?"aucun":n===1?"un seul":"deux";
      col=m==="aaa"?P.red:(n===1?P.green:n===2?P.amber:P.red);
      if(m!=="aaa") S.draw.label(c,n===0?"Aucun triangle":n===1?"1 triangle":"2 triangles",c.W/2,18,{color:col,size:fs+2});
      ro.set(0,HELP[m]); ro.set(1,txt);
      var nn=g.tris.length;
      if(m==="ccc") nt.set(nn?"Un seul triangle (à isométrie près) : les deux arcs de compas se coupent en C.":"Impossible : les deux arcs ne se coupent pas. Chaque côté doit être plus petit que la somme des deux autres.",nn?"ok":"warn");
      else if(m==="cac") nt.set("Toujours un seul triangle : l'angle est compris entre les deux côtés.","ok");
      else if(m==="aca") nt.set(nn?"Un seul triangle : le côté est compris entre les deux angles.":"Impossible : α + β doit être inférieur à 180°, les deux rayons ne se rejoignent pas.",nn?"ok":"warn");
      else if(m==="aaa") nt.set(al.value+be.value<180?"Les deux triangles ont les mêmes angles mais pas les mêmes côtés : ils sont semblables, pas isométriques.":"Impossible : α + β doit être inférieur à 180°.","warn");
      else if(al.value>=90) nt.set("α est droit ou obtus : il y a un triangle seulement si u > v ("+S.fmt(u.value,1)+(u.value>v.value?" > ":" ≤ ")+S.fmt(v.value,1)+" : "+(nn?"un seul triangle":"aucun triangle")+"). Pour α aigu, on peut en avoir deux : CCA n'est donc pas un cas d'isométrie.","warn");
      else nt.set("Hauteur issue de B : h = v sin α = "+S.fmt(v.value*Math.sin(al.value*Math.PI/180),2)+". Si u < h : aucun triangle ; u = h : un seul (rectangle) ; h < u < v : deux triangles ; u ≥ v : un seul. CCA n'est donc pas un cas d'isométrie.",nn===2?"warn":"ok");
    });
  }
});
SFA.sim({
  id:"m3-c07-pavage", ch:"c07", tag:"Pavage", titre:"Quels polygones recouvrent le plan ?",
  resume:"Autour d'un sommet, il faut que les angles des polygones totalisent 360°.",
  but:"Choisis un polygone régulier (nombre de côtés n) et le nombre de copies autour d'un sommet : la jauge du bas doit atteindre exactement 360°. Passe ensuite en « Pavage complet » pour voir ce que donne le polygone sur tout le plan.",
  aRetenir:"L'angle intérieur d'un polygone régulier à n côtés vaut 180° × (n − 2) ÷ n. Il pave le plan à lui seul seulement si un nombre entier de copies fait exactement 360° : triangle, carré, hexagone.",
  piege:"Trois pentagones laissent un trou de 36° ; quatre se chevauchent. Un pentagone régulier ne pave pas le plan.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.92}), P=S.draw.palette, T=S.draw.tint;
    var n=k.slider("Nombre de côtés n",3,12,1,6,""), q=k.slider("Copies autour du sommet",1,8,1,3,"");
    var md=k.seg("Vue",[["som","Autour d'un sommet"],["pav","Pavage complet"]],"som");
    var df=k.seg("Défi",[[0,"Libre"],[1,"Trouve les 3 polygones qui pavent"]],0);
    var ro=k.readouts(["Angle intérieur","Total autour du sommet","Écart avec 360°"]); var nt=k.note("");
    var found={};
    var cols=[P.acc,P.green,P.amber,P.violet,P.teal,P.red,P.grey,P.yellow];
    function poly(ctx,cx,cy,R,ph,N){ ctx.beginPath(); for(var j=0;j<N;j++){ var a=ph+j*2*Math.PI/N; var x=cx+R*Math.cos(a), y=cy-R*Math.sin(a); j?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.closePath(); }
    window.M3.fit(c,0.66,.92);
    k.draw(function(){
      c.clear(); var N=n.value, K=q.value, ctx=c.ctx, al=180*(N-2)/N, ex=360/N, fs=M3.sz(c,13);
      var gaugeY=c.H-26, areaH=c.H-70;
      var s=0.9*0.5*Math.min(c.W,areaH)*Math.sin(Math.PI/N); s=Math.max(14,s);
      var cx=c.W/2, cy=areaH/2+8;
      var tot=K*al, gap=360-tot, perfect=Math.abs(gap)<0.01;
      if(md.value==="som"){
        for(var i=0;i<K;i++){ var th=i*al, X=cx, Y=cy, mx=0, my=0; ctx.beginPath(); ctx.moveTo(X,Y);
          for(var j=0;j<N;j++){ var r=(th+j*ex)*Math.PI/180; X+=s*Math.cos(r); Y-=s*Math.sin(r); ctx.lineTo(X,Y); }
          ctx.closePath(); var g=ctx.createLinearGradient(cx-s,cy-s,cx+s,cy+s); g.addColorStop(0,T(cols[i%8],.55)); g.addColorStop(1,T(cols[i%8],.8));
          ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=2.6; ctx.lineJoin="round"; ctx.stroke();
          var mid=(th+al/2)*Math.PI/180, rr=s*0.42; S.draw.text(c,S.fmt(al,al%1?1:0)+"°",cx+Math.cos(mid)*rr*1.1,cy-Math.sin(mid)*rr*1.1,{size:fs-1,color:"#fff",weight:800,halo:"rgba(15,27,45,.45)"}); }
        if(gap>0.01){ M3.wedge(c,cx,cy,K*al,gap,s*0.7,"rgba(192,50,29,.14)"); ctx.save(); ctx.setLineDash([5,4]); ctx.strokeStyle=P.red; ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,s*0.7,-(K*al)*Math.PI/180,-360*Math.PI/180,true); ctx.closePath(); ctx.stroke(); ctx.restore();
          var mg=(K*al+gap/2)*Math.PI/180; S.draw.label(c,"trou "+S.fmt(gap,1)+"°",cx+Math.cos(mg)*s*0.95,cy-Math.sin(mg)*s*0.95,{color:P.red,size:fs-1}); }
        if(gap<-0.01){ S.draw.label(c,"chevauchement "+S.fmt(-gap,1)+"°",cx,cy-s*1.0-10,{color:P.red,size:fs-1}); }
        if(perfect){ ctx.save(); ctx.strokeStyle=P.green; ctx.lineWidth=3; ctx.setLineDash([2,5]); ctx.lineCap="round"; ctx.beginPath(); ctx.arc(cx,cy,s*0.3,0,7); ctx.stroke(); ctx.restore(); }
      } else {
        /* pavage : on étend de proche en proche par symétrie centrale par rapport au milieu de chaque côté */
        var Ra=0.115*Math.min(c.W,areaH)*(N===3?1.15:1), ap=Ra*Math.cos(Math.PI/N), ph0=Math.PI/2+Math.PI/N+(N%2?0:0);
        var seen={}, q0=[{x:cx,y:areaH/2+8,ph:ph0}], out=[], depth=0, key=function(x,y){ return Math.round(x/3)+","+Math.round(y/3); };
        seen[key(q0[0].x,q0[0].y)]=1; out.push(q0[0]);
        var front=q0, maxD=N===3?9:N===4?9:6;
        if(!(N===3||N===4||N===6)) maxD=2;
        for(depth=0;depth<maxD;depth++){ var nf=[]; front.forEach(function(p){ for(var e=0;e<N;e++){ var an=p.ph+Math.PI/N+e*2*Math.PI/N; var mxx=p.x+ap*Math.cos(an), myy=p.y-ap*Math.sin(an); var nx=2*mxx-p.x, ny=2*myy-p.y, kk=key(nx,ny);
            if(!seen[kk]){ seen[kk]=1; var np={x:nx,y:ny,ph:p.ph+Math.PI}; nf.push(np); out.push(np); } } }); front=nf; }
        ctx.save(); ctx.beginPath(); ctx.rect(6,6,c.W-12,areaH-4); ctx.clip();
        var ok=(N===3||N===4||N===6);
        out.forEach(function(p,i){ poly(ctx,p.x,p.y,Ra,p.ph,N); ctx.fillStyle=ok?T(cols[(i*7+ (Math.round(p.x/ap)+Math.round(p.y/ap))*3)%3===0?0:1],.6):T(P.acc,.28); if(ok){ var cc=(Math.abs(Math.round(p.x/(ap*.9)))+Math.abs(Math.round(p.y/(ap*.9))))%3; ctx.fillStyle=T(cols[cc],.62); } ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.stroke(); });
        ctx.restore();
        if(!ok){ S.draw.label(c,"n = "+N+" : "+(N===5?"des trous apparaissent":"ça ne se raccorde pas")+" au 2e anneau",c.W/2,16,{color:P.red,size:fs-1}); }
      }
      /* jauge des 360° */
      var gx=18, gw=c.W-36, gh=14; S.draw.rrect(c,gx,gaugeY-gh/2,gw,gh,7); ctx.fillStyle="#eef1f6"; ctx.fill();
      ctx.save(); S.draw.rrect(c,gx,gaugeY-gh/2,gw,gh,7); ctx.clip();
      for(var z=0;z<K;z++){ var a0=gx+gw*Math.min(1,z*al/360), a1=gx+gw*Math.min(1,(z+1)*al/360); if(a1>a0){ ctx.fillStyle=T(cols[z%8],.85); ctx.fillRect(a0,gaugeY-gh/2,a1-a0-1.5,gh); } }
      ctx.restore();
      ctx.strokeStyle=P.ink; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(gx+gw,gaugeY-gh/2-5); ctx.lineTo(gx+gw,gaugeY+gh/2+5); ctx.stroke();
      S.draw.text(c,"360°",gx+gw,gaugeY-gh/2-12,{size:fs-2,color:P.ink,align:"right"});
      if(tot>360) S.draw.label(c,"+"+S.fmt(tot-360,1)+"°",gx+gw-4,gaugeY+gh/2+12,{color:P.red,size:fs-3,align:"right"});
      S.draw.text(c,K+" × "+S.fmt(al,al%1?1:0)+"° = "+S.fmt(tot,tot%1?1:0)+"°",gx,gaugeY-gh/2-12,{size:fs-1,color:perfect?P.green:P.ink,align:"left",math:true});
      ro.set(0,S.fmt(al,2)+"°"); ro.set(1,S.fmt(tot,2)+"°"); ro.set(2,perfect?"0° : parfait":gap>0?"trou de "+S.fmt(gap,2)+"°":"recouvrement de "+S.fmt(-gap,2)+"°");
      if(perfect&&Math.round(K)===K){ found[N]=1; }
      var nf=Object.keys(found).filter(function(x){return +x<=6;}).length;
      if(+df.value===1){ nt.set("Défi : "+nf+"/3 polygones qui pavent trouvés ("+Object.keys(found).sort(function(a,b){return a-b;}).map(function(x){return x+" côtés";}).join(", ")+"). "+(nf===3?"Bravo : triangle, carré, hexagone, et personne d'autre !":"Cherche n et le nombre de copies qui donnent 360°."),nf===3?"ok":"");
      } else if(perfect) nt.set(K+" copies × "+S.fmt(al,2)+"° = 360° : ces polygones se raccordent sans trou ni chevauchement autour du sommet.","ok");
      else if(gap>0) nt.set("Il reste un trou de "+S.fmt(gap,2)+"° : essaie une copie de plus (ou un autre polygone).","warn");
      else nt.set("Les polygones se chevauchent de "+S.fmt(-gap,2)+"° : il y en a trop.","warn");
    });
  }
});
