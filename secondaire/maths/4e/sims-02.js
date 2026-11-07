(function(){
var P = SFA.draw.palette;
function sgn(v,first){ var a=Math.abs(v); if(first) return (v<0?"−":""); return v<0?" − ":" + "; }
/* écrit un polynôme à partir de coefficients du plus haut degré au plus bas */
function poly(co){
  var n=co.length-1, s="", first=true;
  for(var i=0;i<=n;i++){
    var v=co[i], d=n-i; if(Math.abs(v)<1e-12) continue;
    var a=Math.abs(v), t;
    if(d===0) t=SFA.fmt(a);
    else { t=(a===1?"":SFA.fmt(a)) + "x" + (d===1?"":(d===2?"²":"³")); }
    s += sgn(v,first) + t; first=false;
  }
  return s||"0";
}
function sup(v){ return v; }

SFA.sim({
  id:"m4-c02-ruffini", ch:"c02", tag:"Classique",
  titre:"Le schéma de Horner (Ruffini) pas à pas",
  resume:"Choisis un polynôme du 3e degré et une racine candidate : le tableau se remplit, avec quotient et reste.",
  but:"Règle les coefficients et le nombre r. Avance étape par étape (ou clique sur « Animer ») : on recopie, on multiplie par r, on additionne. Le dernier nombre est le reste P(r).",
  aRetenir:"Diviser P(x) par x − r : le reste vaut P(r). Si le reste est 0, x − r est un facteur de P et r est une racine. Les nombres de la ligne du bas, sauf le dernier, sont les coefficients du quotient.",
  piege:"Pour diviser par x + 2, il faut prendre r = −2. Et n'oublie jamais un coefficient nul : x³ + 1 s'écrit 1 ; 0 ; 0 ; 1.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var a3=k.slider("coefficient de x³",1,3,1,1,"");
    var a2=k.slider("coefficient de x²",-6,6,1,-2,"");
    var a1=k.slider("coefficient de x",-6,6,1,-5,"");
    var a0=k.slider("terme constant",-9,9,1,6,"");
    var r=k.slider("r (division par x − r)",-4,4,1,1,"");
    var st=k.slider("étape",0,4,1,4,"");
    var tm=k.loop(function(dt,t){ var v=Math.min(4,Math.floor(t/0.9)); if(v!==st.value){ st.set(v); k.redraw(); } if(t>4*0.9+1) tm.pause(); });
    k.button("Animer",function(){ tm.reset(); st.set(0); tm.play(); },true);
    var ro=k.readouts(["P(x)","Quotient Q(x)","Reste = P(r)"]);
    var nt=k.note("","");
    k.draw(function(){
      var co=[a3.value,a2.value,a1.value,a0.value], R=r.value, step=st.value;
      var sums=[co[0]], prods=[null];
      for(var j=1;j<4;j++){ prods[j]=R*sums[j-1]; sums[j]=co[j]+prods[j]; }
      c.clear();
      var W=c.W,H=c.H, x0=Math.min(90,W*.2), cw=(W-x0-10)/4, y1=H*.28, y2=H*.5, y3=H*.78;
      var ctx=c.ctx;
      var heads=["x³","x²","x","1"];
      for(var j=0;j<4;j++) S.draw.text(c,heads[j],x0+cw*(j+.5),H*.08,{color:P.grey,size:13});
      S.draw.line(c,x0,H*.16,x0,H*.9,P.ink,2);
      S.draw.line(c,6,y2-H*.11+4,W-6,y2-H*.11+4,P.ink,2);
      S.draw.line(c,x0+cw*3,H*.16,x0+cw*3,H*.9,P.light,1.5);
      S.draw.text(c,"r = "+S.fmt(R),x0/2,(y1+y2)/2-10,{color:P.red,size:15});
      for(var j=0;j<4;j++){
        S.draw.text(c,S.fmt(co[j]),x0+cw*(j+.5),y1,{size:17,color:P.ink});
        if(j>=1 && j<=step) S.draw.text(c,(R<0?"×("+S.fmt(R)+")":"×"+S.fmt(R))+" = "+S.fmt(prods[j]),x0+cw*(j+.5),y2,{size:13,color:P.amber});
        if(j===0 && step>=0) S.draw.text(c,S.fmt(sums[0]),x0+cw*.5,y3,{size:17,color:P.acc});
        if(j>=1 && j<=step) S.draw.text(c,S.fmt(sums[j]),x0+cw*(j+.5),y3,{size:17,color:j===3?(sums[3]===0?P.green:P.red):P.acc});
      }
      if(step>=1) for(var j=1;j<=step&&j<4;j++) S.draw.arrow(c,x0+cw*(j-.5)+6,y3-14,x0+cw*(j+.5)-30,y2+12,P.amber,1.3);
      ro.set(0,poly(co));
      var Q=[sums[0],sums[1],sums[2]];
      ro.set(1, step>=3 ? poly(Q) : "…");
      ro.set(2, step>=3 ? S.fmt(sums[3]) : "…");
      if(step>=3){
        if(sums[3]===0) nt.set("Reste 0 : x "+(R<0?"+ "+S.fmt(-R):(R>0?"− "+S.fmt(R):""))+" divise P. On a P(x) = (x "+(R<0?"+ "+S.fmt(-R):(R>0?"− "+S.fmt(R):"+ 0"))+")·("+poly(Q)+").","ok");
        else nt.set("Reste "+S.fmt(sums[3])+" ≠ 0 : "+S.fmt(R)+" n'est pas une racine (P("+S.fmt(R)+") = "+S.fmt(sums[3])+").","warn");
      } else nt.set("Continue : avance de curseur « étape ».","");
    });
  }
});

/* ---------- racine carrée et aire ---------- */
function simp(n){ var out=1,rest=n; for(var f=2;f*f<=rest;f++){ while(rest%(f*f)===0){ rest/=f*f; out*=f; } } return [out,rest]; }
SFA.sim({
  id:"m4-c02-racine-aire", ch:"c02", tag:"Manipuler",
  titre:"Racine carrée = côté d'un carré",
  resume:"L'aire d'un carré grandit : son côté √A, sa forme simplifiée et la meilleure fraction pour l'approcher.",
  but:"Choisis l'aire A (curseur, ou tire le coin du carré). Observe le côté √A, sa forme simplifiée a√b, puis cherche une fraction p/q proche de √A en augmentant q : la règle du bas zoome entre deux entiers.",
  aRetenir:"√A est le côté d'un carré d'aire A. On simplifie en sortant les carrés parfaits : √72 = √(36×2) = 6√2. Si A n'est pas un carré parfait, √A est irrationnel : aucune fraction n'a un carré égal à A.",
  piege:"√(a + b) n'est pas √a + √b : √(9 + 16) = 5, alors que √9 + √16 = 7.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.85});
    var A=k.slider("Aire A du carré",1,100,1,72,"u²");
    var q=k.slider("Dénominateur q de la fraction p/q",1,30,1,7,"");
    var ro=k.readouts(["Côté √A","Forme simplifiée","Meilleure fraction p/q","(p/q)² comparé à A"]);
    var nt=k.note("","");
    var geo={};
    M.grab(c,function(){ return geo.u?[{id:"k",x:geo.ox+geo.s*geo.u,y:geo.oy+(10-geo.s)*geo.u,r:28}]:[]; },
      function(id,px,py){ var s=Math.max((px-geo.ox)/geo.u,(geo.oy+10*geo.u-py)/geo.u); A.set(M.clamp(Math.round(s*s),1,100)); k.redraw(); });
    k.draw(function(){
      M.adapt(c,1.02,.85,520);
      var a=A.value, s=Math.sqrt(a), sp=simp(a), Q=q.value, p=Math.round(s*Q), W=c.W,H=c.H, ctx=c.ctx; c.clear();
      var stripH=104, u=Math.min((W-24)/10,(H-stripH-20)/10), ox=(W-u*10)/2, oy=12;
      geo={u:u,ox:ox,oy:oy,s:s};
      /* grille 10 × 10 */
      for(var i=0;i<=10;i++){ S.draw.line(c,ox+i*u,oy,ox+i*u,oy+10*u,P.grid,1); S.draw.line(c,ox,oy+i*u,ox+10*u,oy+i*u,P.grid,1); }
      var perfect=sp[0]*sp[0]===a;
      /* carré : cases entières colorées + bordure */
      var n=Math.floor(s+1e-9);
      ctx.fillStyle=S.draw.tint(P.acc,.14); ctx.fillRect(ox,oy+(10-s)*u,s*u,s*u);
      ctx.fillStyle=S.draw.tint(P.acc,.10); for(var a1=0;a1<n;a1++) for(var b1=0;b1<n;b1++) if((a1+b1)%2===0) ctx.fillRect(ox+a1*u,oy+(10-n)*u+b1*u,u,u);
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.strokeRect(ox,oy+(10-s)*u,s*u,s*u);
      S.draw.text(c,"aire = "+a,ox+s*u/2,oy+(10-s)*u+s*u/2,{color:P.ink,size:Math.max(13,Math.min(20,s*u/5))});
      M.lab(c,"côté √"+a+" ≈ "+F(s,3),ox+s*u/2,oy+(10-s)*u-14,P.acc,{size:12});
      M.handle(c,ox+s*u,oy+(10-s)*u,P.acc,7);
      /* règle : zoom entre deux entiers */
      var lo=perfect?s-1:Math.floor(s), hi=lo+1, ry=H-42, x0=20, x1=W-20, X=function(v){return x0+(v-lo)/(hi-lo)*(x1-x0);};
      S.draw.panel(c,6,H-stripH+4,W-12,stripH-10,{shadow:false});
      S.draw.text(c,"Zoom entre "+F(lo,0)+" et "+F(hi,0)+" : on partage en "+Q+" parts égales",14,H-stripH+18,{size:11,color:P.grey,align:"left"});
      S.draw.line(c,x0,ry,x1,ry,P.ink,2);
      for(var t=0;t<=Q;t++){ var tx=X(lo+t/Q); S.draw.line(c,tx,ry-(t%Q===0?8:5),tx,ry+(t%Q===0?8:5),t%Q===0?P.ink:P.axis,t%Q===0?1.6:1); }
      S.draw.text(c,F(lo,0),x0,ry+14,{size:11.5,color:P.grey}); S.draw.text(c,F(hi,0),x1,ry+14,{size:11.5,color:P.grey});
      var ap=p/Q; S.draw.dot(c,X(M.clamp(ap,lo,hi)),ry,6,P.green); S.draw.dot(c,X(s),ry,5,P.red);
      M.lab(c,"p/q = "+p+"/"+Q,X(M.clamp(ap,lo,hi)),ry-24,P.green,{size:11}); M.lab(c,"√A",X(s),ry+22,P.red,{size:11});
      ro.set(0,F(s,4)+(perfect?"":"…"));
      ro.set(1, perfect ? "√"+a+" = "+sp[0] : (sp[0]===1 ? "√"+a+" (déjà simplifié)" : "√"+a+" = "+sp[0]+"√"+sp[1]));
      ro.set(2, p+"/"+Q+" = "+F(p/Q,4));
      var sq=p*p/(Q*Q);
      ro.set(3, F(sq,4)+" (écart "+F(sq-a,4)+")");
      if(perfect) nt.set(a+" est un carré parfait : √"+a+" = "+sp[0]+" est un entier.","ok");
      else nt.set("Même avec q = 30, (p/q)² reste différent de "+a+" : √"+a+" est irrationnel (développement décimal infini non périodique).","warn");
    });
  }
});

/* ---------- polynôme et graphe ---------- */
SFA.sim({
  id:"m4-c02-polynome-graphe", ch:"c02", tag:"Graphique",
  titre:"Racines, graphe et factorisation d'un polynôme",
  resume:"Déplace trois racines : le graphe, la forme factorisée et la forme développée se mettent à jour.",
  but:"Fais glisser les racines r₁, r₂, r₃ (même deux fois la même !). Regarde comment la courbe touche l'axe des x et comment les coefficients se calculent.",
  aRetenir:"P(x) = a(x − r₁)(x − r₂)(x − r₃) : les racines sont les abscisses où la courbe coupe l'axe. Une racine double fait seulement « toucher » l'axe sans le traverser.",
  piege:"Un facteur x − r a pour racine +r : (x + 2) correspond à la racine −2.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.75});
    var a=k.slider("coefficient dominant a",-2,2,1,1,"");
    var r1=k.slider("racine r₁",-4,4,1,-2,"");
    var r2=k.slider("racine r₂",-4,4,1,1,"");
    var r3=k.slider("racine r₃",-4,4,1,3,"");
    var ro=k.readouts(["Forme factorisée","Forme développée","P(0)"]);
    var nt=k.note("","");
    function fac(r){ return r===0?"x":(r>0?"(x − "+SFA.fmt(r)+")":"(x + "+SFA.fmt(-r)+")"); }
    k.draw(function(){
      var A=a.value||1, R=[r1.value,r2.value,r3.value];
      if(a.value===0){ A=1; }
      var s1=R[0]+R[1]+R[2], s2=R[0]*R[1]+R[0]*R[2]+R[1]*R[2], s3=R[0]*R[1]*R[2];
      var f=function(x){return A*(x-R[0])*(x-R[1])*(x-R[2]);};
      var mx=0; for(var x=-5;x<=5;x+=.1) mx=Math.max(mx,Math.abs(f(x)));
      var ym=Math.max(6,Math.ceil(mx*1.1/5)*5);
      c.clear();
      var ax=S.draw.axes(c,{x0:-5,x1:5,y0:-ym,y1:ym,xl:"x",yl:"y",stepX:1});
      S.draw.fn(c,ax,f,P.acc,3);
      R.forEach(function(r){ S.draw.dot(c,ax.X(r),ax.Y(0),6,P.red); });
      var fs=(A===1?"":(A===-1?"−":SFA.fmt(A)))+R.map(fac).join("");
      ro.set(0,"P(x) = "+fs);
      ro.set(1,"P(x) = "+poly([A,-A*s1,A*s2,-A*s3]));
      ro.set(2,S.fmt(-A*s3));
      var d=(R[0]===R[1])+(R[0]===R[2])+(R[1]===R[2]);
      nt.set(a.value===0?"Le coefficient dominant doit être non nul : on prend a = 1.":(d===3?"Racine triple : la courbe traverse l'axe en l'aplatissant (type x³).":(d>=1?"Racine double : la courbe touche l'axe sans le traverser.":"Trois racines distinctes : la courbe traverse l'axe trois fois.")),a.value===0?"warn":"");
    });
  }
});

/* ---------- coefficients indéterminés ---------- */
var TG = {
  t1:{n:"x³ + 2x² − 5x − 6", c:[2,-5,-6]},
  t2:{n:"x³ − 2x² + 2x + 5", c:[-2,2,5]},
  t3:{n:"x³ + 3x − 4", c:[0,3,-4]}
};
SFA.sim({
  id:"m4-c02-identification", ch:"c02", tag:"Défi",
  titre:"Coefficients indéterminés : (x + m)(x² + px + q)",
  resume:"Trouve m, p, q pour que le produit soit égal au polynôme cible : le tableau d'aires et les jauges te guident.",
  but:"Choisis un polynôme cible. Règle m, p et q : le tableau d'aires développe le produit case par case, et les trois jauges (x², x, constante) passent au vert quand le coefficient obtenu égale celui de la cible. Trouve toutes les factorisations possibles !",
  aRetenir:"Deux polynômes sont égaux si et seulement si leurs coefficients de même degré sont égaux. (x + m)(x² + px + q) = x³ + (p + m)x² + (q + mp)x + mq.",
  piege:"Plusieurs triplets peuvent convenir : chaque racine entière de la cible donne une factorisation différente.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.78});
    var sel=k.select("Polynôme cible",Object.keys(TG).map(function(i){return [i,TG[i].n];}),"t1",function(){ found={}; });
    var m=k.slider("m",-6,6,1,0,"");
    var p=k.slider("p",-6,6,1,0,"");
    var q=k.slider("q",-9,9,1,0,"");
    var found={};
    k.button("Recommencer",function(){ m.set(0); p.set(0); q.set(0); found={}; });
    var nt=k.note("","");
    function sg(v,first){ return (v<0?(first?"−":" − "):(first?"":" + "))+(Math.abs(v)===1?"":F(Math.abs(v),0)); }
    /* nombre de factorisations entières possibles avec |m| ≤ 6 */
    function sols(T){ var out=[]; for(var mm=-6;mm<=6;mm++){ var pp=T[0]-mm, qq=T[1]-mm*pp; if(mm*qq===T[2]&&Math.abs(pp)<=6&&Math.abs(qq)<=9) out.push(mm); } return out; }
    k.draw(function(){
      M.adapt(c,1.02,.78,520);
      var T=TG[sel.value].c, Mm=m.value,Pp=p.value,Q=q.value, W=c.W,H=c.H, ctx=c.ctx; c.clear();
      var got=[Pp+Mm, Q+Mm*Pp, Mm*Q], all=true;
      var DEG=["x²","x","constante"], DC=[P.red,P.teal,P.amber];
      /* tableau d'aires */
      var lw=Math.min(74,W*.2), cw=(W-lw-16)/3, y0=12, ch=Math.min(44,H*.12);
      var hdTxt=["x²",Pp===0?"0":(Pp<0?"−":"")+(Math.abs(Pp)===1?"":F(Math.abs(Pp),0))+"x",F(Q,0)];
      for(var j=0;j<3;j++){ S.draw.text(c,hdTxt[j],lw+8+cw*(j+.5),y0+9,{size:13,color:P.ink,math:true}); }
      var rows=[["x","x"],["m",F(Mm,0)]];
      var cells=[[["x³",0,P.grey],["p·x²",1,DC[0]],["q·x",2,DC[1]]],[["m·x²",1,DC[0]],["m·p·x",2,DC[1]],["m·q",3,DC[2]]]];
      var vals=[[ "x³", sg(Pp,true)+"x²", sg(Q,true)+"x" ],[ sg(Mm,true)+"x²", sg(Mm*Pp,true)+"x", F(Mm*Q,0) ]];
      for(var r=0;r<2;r++){
        var yy=y0+22+r*ch;
        S.draw.text(c,rows[r][0]==="x"?"× x":"× ("+F(Mm,0)+")",lw/2+4,yy+ch/2,{size:13,color:P.ink,math:true});
        for(var j2=0;j2<3;j2++){ var cc=cells[r][j2], x=lw+8+cw*j2; ctx.save(); S.draw.rrect(c,x+2,yy+2,cw-4,ch-4,7); ctx.fillStyle=S.draw.tint(cc[2],cc[1]===0?.12:.16); ctx.fill(); ctx.restore();
          var txt=vals[r][j2]; if(r===0&&j2===1&&Pp===0) txt="0"; if(r===1&&j2===0&&Mm===0) txt="0";
          S.draw.text(c,txt,x+cw/2,yy+ch/2-7,{size:14,color:cc[2],math:true}); S.draw.text(c,cc[0],x+cw/2,yy+ch/2+11,{size:10.5,color:P.grey,math:true}); }
      }
      /* jauges */
      var gy=y0+22+2*ch+14, gh=Math.max(46,(H-gy-46)/3);
      var lab=["x² : p + m","x : q + m·p","constante : m·q"];
      for(var i=0;i<3;i++){
        var ok=got[i]===T[i]; if(!ok) all=false;
        var y=gy+i*gh, col=ok?P.green:P.red;
        ctx.save(); S.draw.rrect(c,8,y,W-16,gh-6,9); ctx.fillStyle=S.draw.tint(col,.08); ctx.fill(); ctx.restore();
        S.draw.text(c,lab[i]+" = "+F(got[i],0),16,y+13,{size:12.5,color:col,align:"left",math:true});
        S.draw.text(c,(ok?"✓ égal à ":"cible : ")+F(T[i],0),W-16,y+13,{size:12.5,color:ok?P.green:P.grey,align:"right"});
        var lo=-12,hi=12, x0=26,x1=W-26,gyy=y+gh-17, X=function(v){return x0+(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*(x1-x0);};
        S.draw.line(c,x0,gyy,x1,gyy,P.light,5); S.draw.line(c,X(0),gyy-6,X(0),gyy+6,P.axis,1.2);
        S.draw.line(c,X(Math.min(0,got[i])),gyy,X(Math.max(0,got[i])),gyy,S.draw.tint(col,.55),5);
        /* cible : losange */
        var tx=X(T[i]); ctx.save(); ctx.fillStyle=P.amber; ctx.beginPath(); ctx.moveTo(tx,gyy-8); ctx.lineTo(tx+7,gyy); ctx.lineTo(tx,gyy+8); ctx.lineTo(tx-7,gyy); ctx.closePath(); ctx.fill(); ctx.restore();
        S.draw.dot(c,X(got[i]),gyy,6,col);
      }
      /* solution trouvée */
      var s=sols(T); if(all){ found[Mm]=1; }
      var nf=Object.keys(found).length;
      nt.set(all ? "Identification réussie : "+TG[sel.value].n+" = (x "+(Mm<0?"− "+F(-Mm,0):"+ "+F(Mm,0))+")(x² "+(Pp<0?"− "+F(-Pp,0):"+ "+F(Pp,0))+"x "+(Q<0?"− "+F(-Q,0):"+ "+F(Q,0))+"). Ici x = "+F(-Mm,0)+" est une racine. Factorisations trouvées : "+nf+" / "+s.length+"."+(nf<s.length?" Cherche une autre racine !":" Toutes trouvées !") : "Fais passer les trois jauges au vert (le point rond doit rejoindre le losange). Astuce : p + m est le coefficient de x² de la cible. Factorisations trouvées : "+nf+" / "+s.length+".",all?"ok":"");
    });
  }
});
})();
