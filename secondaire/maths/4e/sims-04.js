(function(){
var P = SFA.draw.palette;
function d3(x){ return Math.abs(x*1000-Math.round(x*1000))<1e-9; }
function pv(v,d){ return v<0 ? "("+SFA.fmt(v,d===undefined?3:d)+")" : SFA.fmt(v,d===undefined?3:d); }
function term(v,sym,first){
  if(Math.abs(v)<1e-12) return "";
  var a=Math.abs(v), s = first ? (v<0?"−":"") : (v<0?" − ":" + ");
  var num = (a===1 && sym) ? "" : SFA.fmt(a,3);
  return s+num+sym;
}
function eq(a,b,c){ var s=term(a,"x²",true); s+=term(b,"x",s===""); s+=term(c,"",s===""); return (s||"0")+" = 0"; }

SFA.sim({
  id:"m4-c04-delta", ch:"c04", tag:"Classique",
  titre:"Δ, le nombre de solutions et la parabole",
  resume:"Fais monter ou descendre la parabole : Δ change de signe en même temps que le nombre de points sur l'axe x.",
  but:"Fais varier c (et essaie a, b). Observe Δ = b² − 4ac, le nombre de solutions et les points d'intersection avec l'axe x. Défi : règle c pour obtenir Δ = 0.",
  aRetenir:"Δ > 0 : deux solutions (la parabole coupe l'axe x deux fois). Δ = 0 : une solution double (le sommet est sur l'axe x). Δ < 0 : aucune solution réelle (la parabole ne touche pas l'axe).",
  piege:"Dans Δ = b² − 4ac, b² est toujours positif : (−3)² = 9, et non −9. Fais attention au signe de c et de a dans le produit 4ac.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var a=k.slider("a",-3,3,0.5,1,"");
    var b=k.slider("b",-6,6,1,-2,"");
    var cc=k.slider("c",-8,8,0.5,-3,"");
    var ro=k.readouts(["Équation","Δ = b² − 4ac","Nombre de solutions","Solutions"]);
    var nt=k.note("","");
    var M=window.M4, geo={};
    M.grab(c,function(){ return geo.ax?[{id:"c",x:geo.ax.X(0),y:geo.ax.Y(cc.value),r:30}]:[]; },
      function(id,px,py){ cc.set(M.clamp(Math.round(geo.ax.iy(py)*2)/2,-8,8)); k.redraw(); });
    k.draw(function(){
      var A=a.value,B=b.value,C=cc.value;
      c.clear();
      var ax=geo.ax=S.draw.axes(c,{x0:-8,x1:8,y0:-8,y1:8,xl:"x",yl:"y",stepX:2,stepY:2});
      var f=function(x){return A*x*x+B*x+C;};
      S.draw.fn(c,ax,f,P.acc,3); M.handle(c,ax.X(0),ax.Y(C),P.amber,6); M.lab(c,"c = "+S.fmt(C,1),ax.X(0)+34,ax.Y(C)+(A>0?-16:16),P.amber,{size:10.5});
      ro.set(0,"y = "+eq(A,B,C).replace(" = 0",""));
      if(A===0){ ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"a = 0 : équation du 1er degré"); nt.set("Pour a = 0, on n'a plus une équation du 2e degré : bx + c = 0.","warn"); return; }
      var D=B*B-4*A*C;
      ro.set(1,S.fmt(D,2));
      if(D>0){ var r=Math.sqrt(D), x1=(-B-r)/(2*A), x2=(-B+r)/(2*A); [x1,x2].forEach(function(x){ if(Math.abs(x)<=8){ S.draw.dot(c,ax.X(x),ax.Y(0),7,P.green); M.lab(c,S.fmt(x,2),ax.X(x),ax.Y(0)+(A>0?17:-17),P.green,{size:10.5}); } });
        ro.set(2,"2 (Δ > 0)"); ro.set(3,S.fmt(Math.min(x1,x2),3)+" et "+S.fmt(Math.max(x1,x2),3)); nt.set("Δ > 0 : la parabole coupe l'axe x en deux points."+(Math.abs(x1)>8||Math.abs(x2)>8?" (Un des points est hors du cadre du graphique.)":""),"ok"); }
      else if(D===0){ var x0=-B/(2*A); if(Math.abs(x0)<=8){ S.draw.dot(c,ax.X(x0),ax.Y(0),8,P.amber); M.lab(c,"Δ = 0 : "+S.fmt(x0,2),ax.X(x0),ax.Y(0)+(A>0?-18:18),P.amber,{size:10.5}); } ro.set(2,"1 (solution double)"); ro.set(3,"x = "+S.fmt(x0,3)); nt.set("Δ = 0 : la parabole touche l'axe x en son sommet.","warn"); }
      else { ro.set(2,"0 (Δ < 0)"); ro.set(3,"aucune dans ℝ"); nt.set("Δ < 0 : la parabole ne rencontre pas l'axe x.","warn"); }
    });
  }
});

/* ---------- balayage de formule ---------- */
SFA.sim({
  id:"m4-c04-formule", ch:"c04", tag:"Méthode",
  titre:"La formule pas à pas, avec tes valeurs",
  resume:"Change a, b, c : chaque étape (Δ, √Δ, x₁, x₂, vérification) se recalcule.",
  but:"Choisis a, b et c. Lis les étapes de résolution : elles montrent où se glissent les erreurs de signe. Vérifie que les solutions annulent bien le trinôme.",
  aRetenir:"x = (−b ± √Δ) / (2a) avec Δ = b² − 4ac. On calcule Δ d'abord, puis √Δ, puis les deux solutions. On vérifie toujours en remplaçant dans l'équation.",
  piege:"Le dénominateur est 2a pour TOUT le numérateur, pas seulement pour √Δ. Et −b change le signe de b : si b = −3, alors −b = 3.",
  build:function(k,S){
    var M=window.M4, c=k.canvas(0,{ratio:.62}), geo={};
    var a=k.slider("a",-4,4,1,2,"");
    var b=k.slider("b",-9,9,1,-3,"");
    var cc=k.slider("c",-9,9,1,-5,"");
    var nt=k.note("","");
    M.grab(c,function(){ return geo.ax?[{id:"c",x:geo.ax.X(0),y:geo.ax.Y(cc.value),r:30}]:[]; },
      function(id,px,py){ cc.set(M.clamp(Math.round(geo.ax.iy(py)),-9,9)); k.redraw(); });
    k.draw(function(){
      var A=a.value,B=b.value,C=cc.value;
      c.clear();
      var ax=geo.ax=S.draw.axes(c,{x0:-6,x1:6,y0:-10,y1:10,xl:"x",yl:"y",stepX:2,stepY:5});
      if(A===0){ nt.set("a = 0 n'est pas permis pour une équation du 2e degré. Choisis a ≠ 0.","warn"); S.draw.fn(c,ax,function(x){return B*x+C;},P.acc,3); return; }
      S.draw.fn(c,ax,function(x){return A*x*x+B*x+C;},P.acc,3.2);
      M.handle(c,ax.X(0),ax.Y(C),P.amber,6); M.lab(c,"c = "+S.fmt(C,0),ax.X(0)+36,ax.Y(C)+(A>0?-16:16),P.amber,{size:10.5});
      S.draw.legend(c,[[P.green,"solutions x₁, x₂"],[P.amber,"c : glisse ce point"]],ax.R-8,ax.T+6,{align:"right"});
      var D=B*B-4*A*C, h="<b>Équation : "+eq(A,B,C)+"</b><br>";
      h+="<b>1.</b> Δ = b² − 4ac = "+pv(B)+"² − 4×"+pv(A)+"×"+pv(C)+" = "+S.fmt(B*B)+" − ("+S.fmt(4*A*C)+") = <b>"+S.fmt(D)+"</b><br>";
      var kind="ok";
      if(D<0){ h+="<b>2.</b> Δ < 0 : pas de racine carrée dans ℝ, donc <b>aucune solution réelle</b>."; kind="warn"; }
      else {
        var r=Math.sqrt(D), exact=Number.isInteger(r), x1=(-B-r)/(2*A), x2=(-B+r)/(2*A);
        h+="<b>2.</b> √Δ "+(exact?"= ":"≈ ")+S.fmt(r,3)+"<br>";
        if(D===0){ h+="<b>3.</b> Δ = 0 : x = −b/(2a) = "+S.fmt(-B)+"/"+S.fmt(2*A)+" = <b>"+S.fmt(x1,3)+"</b> (solution double)."; kind="warn"; if(Math.abs(x1)<=6) S.draw.dot(c,ax.X(x1),ax.Y(0),7,P.amber); }
        else {
          h+="<b>3.</b> x₁ = (−b − √Δ)/(2a) = ("+S.fmt(-B)+" − "+S.fmt(r,3)+")/"+S.fmt(2*A)+" "+(exact?"= ":"≈ ")+"<b>"+S.fmt(x1,3)+"</b><br>";
          h+="<b>4.</b> x₂ = (−b + √Δ)/(2a) = ("+S.fmt(-B)+" + "+S.fmt(r,3)+")/"+S.fmt(2*A)+" "+(exact?"= ":"≈ ")+"<b>"+S.fmt(x2,3)+"</b><br>";
          var v1=A*x1*x1+B*x1+C, v2=A*x2*x2+B*x2+C;
          h+="Vérification : a·x₁² + b·x₁ + c ≈ "+S.fmt(Math.abs(v1)<1e-9?0:v1,3)+" et a·x₂² + b·x₂ + c ≈ "+S.fmt(Math.abs(v2)<1e-9?0:v2,3)+".";
          [x1,x2].forEach(function(x,i){ if(Math.abs(x)<=6){ S.draw.dot(c,ax.X(x),ax.Y(0),7,P.green); M.lab(c,"x"+(i?"₂":"₁")+" = "+S.fmt(x,2),ax.X(x),ax.Y(0)+(A>0?18:-18),P.green,{size:10.5}); } });
          if(Math.abs(x1)>6||Math.abs(x2)>6) h+="<br><i>(Une solution est hors du cadre du graphique.)</i>";
        }
      }
      nt.set(h,kind);
    });
  }
});

/* ---------- somme et produit ---------- */
SFA.sim({
  id:"m4-c04-somme-produit", ch:"c04", tag:"Manipuler",
  titre:"Somme et produit des racines",
  resume:"Place deux racines sur l'axe : la somme S, le produit P et l'équation x² − Sx + P = 0 en découlent.",
  but:"Déplace les racines r₁ et r₂ (curseurs ou en touchant l'axe). Vérifie que S = r₁ + r₂ = −b/a et P = r₁·r₂ = c/a. Défi : trouve deux nombres de somme 5 et de produit 6.",
  aRetenir:"Si r₁ et r₂ sont les racines de ax² + bx + c = 0 : r₁ + r₂ = −b/a et r₁ · r₂ = c/a. Inversement, x² − Sx + P = 0 admet les racines de somme S et de produit P.",
  piege:"La somme vaut −b/a (avec le signe moins) : pour x² − 7x + 10 = 0, S = +7 et P = +10, pas −7.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var r1=k.slider("racine r₁",-6,6,0.5,-1,"");
    var r2=k.slider("racine r₂",-6,6,0.5,4,"");
    var am=k.seg("Coefficient a",[[1,"1"],[2,"2"],[-1,"−1"],[3,"3"]],1);
    var ro=k.readouts(["Somme S","Produit P","Équation (a)(x² − Sx + P) = 0"]);
    var nt=k.note("","");
    var ax=null, sel=0;
    c.pointer(function(t,p){ if(!ax)return; var x=Math.max(-6,Math.min(6,Math.round(ax.ix(p.x)*2)/2));
      if(t==="down"){ sel = Math.abs(x-r1.value)<=Math.abs(x-r2.value)?0:1; }
      if(t==="down"||t==="drag"){ (sel===0?r1:r2).set(x); k.redraw(); } });
    k.draw(function(){
      var R1=r1.value,R2=r2.value,A=Number(am.value), Ss=R1+R2, Pp=R1*R2;
      c.clear();
      ax=S.draw.axes(c,{x0:-8,x1:8,y0:-10,y1:20,xl:"x",yl:"y",stepX:2,stepY:5});
      S.draw.fn(c,ax,function(x){return A*(x-R1)*(x-R2);},P.acc,3);
      S.draw.dot(c,ax.X(R1),ax.Y(0),8,P.red); S.draw.dot(c,ax.X(R2),ax.Y(0),8,P.green);
      window.M4.lab(c,"r₁ = "+S.fmt(R1,1),ax.X(R1)-(R1<=R2?20:-20),ax.Y(0)+(A>0?18:-18),P.red,{size:11}); window.M4.lab(c,"r₂ = "+S.fmt(R2,1),ax.X(R2)+(R1<=R2?20:-20),ax.Y(0)+(A>0?18:-18),P.green,{size:11});
      ro.set(0,S.fmt(Ss,2)+" = −b/a = "+S.fmt(-(-A*Ss)/A,2)); ro.set(1,S.fmt(Pp,2)+" = c/a = "+S.fmt(A*Pp/A,2));
      ro.set(2,eq(A,-A*Ss,A*Pp));
      nt.set(Ss===5&&Pp===6?"Défi réussi : S = 5 et P = 6 donnent x² − 5x + 6 = 0, de racines 2 et 3.":"Défi : trouve deux nombres de somme 5 et de produit 6.",Ss===5&&Pp===6?"ok":"");
    });
  }
});

/* ---------- bicarrée ---------- */
SFA.sim({
  id:"m4-c04-bicarree", ch:"c04", tag:"Original",
  titre:"Équation bicarrée : x⁴ + bx² + c = 0",
  resume:"On pose X = x² : une équation du 2e degré en X, puis on revient à x. 0, 2 ou 4 solutions !",
  but:"Fais varier b et c. Lis les valeurs de X, élimine celles qui sont négatives (un carré ne peut pas être négatif), puis compte les solutions x sur le graphe de y = x⁴ + bx² + c.",
  aRetenir:"Substitution X = x² (X ≥ 0). On résout X² + bX + c = 0 ; chaque X > 0 donne deux solutions x = ±√X, X = 0 donne x = 0, et X < 0 est rejeté.",
  piege:"Ne t'arrête pas aux valeurs de X : il faut revenir à x, et rejeter X < 0. Une équation bicarrée peut avoir 0, 1, 2, 3 ou 4 solutions.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.75});
    var b=k.slider("b",-10,10,1,-5,"");
    var cc=k.slider("c",-12,12,1,-6,"");
    var ro=k.readouts(["Équation en X","Δ","Valeurs de X","Solutions x"]);
    var nt=k.note("","");
    k.draw(function(){
      var B=b.value,C=cc.value, D=B*B-4*C;
      c.clear();
      var ax=S.draw.axes(c,{x0:-5,x1:5,y0:-14,y1:24,xl:"x",yl:"y",stepX:1,stepY:10});
      S.draw.fn(c,ax,function(x){return Math.pow(x,4)+B*x*x+C;},P.acc,3);
      ro.set(0,"X² "+(B<0?"− "+S.fmt(-B):(B>0?"+ "+S.fmt(B):"+ 0"))+"X "+(C<0?"− "+S.fmt(-C):"+ "+S.fmt(C))+" = 0 (X = x²)");
      ro.set(1,S.fmt(D));
      var Xs=[], xs=[];
      if(D>0){ Xs=[(-B-Math.sqrt(D))/2,(-B+Math.sqrt(D))/2]; } else if(D===0){ Xs=[-B/2]; }
      var txt=Xs.map(function(X){ return S.fmt(X,3)+(X<0?" (rejeté)":""); }).join(" ; ");
      Xs.forEach(function(X){ if(X>1e-12){ xs.push(-Math.sqrt(X),Math.sqrt(X)); } else if(Math.abs(X)<=1e-12) xs.push(0); });
      xs.sort(function(p,q){return p-q;});
      xs.forEach(function(x){ S.draw.dot(c,ax.X(x),ax.Y(0),7,P.green); });
      ro.set(2, Xs.length?txt:"aucune (Δ < 0)");
      ro.set(3, xs.length ? xs.map(function(x){return S.fmt(x,3);}).join(" ; ") : "aucune");
      nt.set(xs.length===0?"Aucune solution réelle : la courbe ne touche pas l'axe x.":(xs.length+" solution"+(xs.length>1?"s":"")+" réelle"+(xs.length>1?"s":"")+" : la courbe coupe l'axe x en "+xs.length+" point"+(xs.length>1?"s":"")+"."),xs.length===0?"warn":"ok");
    });
  }
});

/* ---------- rectangle d'or ---------- */
SFA.sim({
  id:"m4-c04-nombre-or", ch:"c04", tag:"Manipuler",
  titre:"Le rectangle d'or et une équation du 2e degré",
  resume:"Retire un carré d'un rectangle : à quel rapport a/b le petit rectangle restant est-il semblable au grand ?",
  but:"Règle le rapport r = a/b (curseur, ou tire le bord droit du rectangle, ou le repère de la règle). On retire un carré de côté b : il reste un rectangle de rapport 1/(r − 1). Cherche r pour que ce rapport soit égal à r (rectangle d'or).",
  aRetenir:"Le rectangle restant est semblable au premier si r = 1/(r − 1), soit r² − r − 1 = 0. Δ = 5 et r = (1 + √5)/2 ≈ 1,618 (nombre d'or φ). L'autre solution (1 − √5)/2 ≈ −0,618 est négative : rejetée pour un rapport de longueurs.",
  piege:"Une équation du 2e degré peut avoir une solution sans signification géométrique : un rapport de longueurs est positif, donc on rejette (1 − √5)/2.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt;
    var c=k.canvas(0,{ratio:.7});
    var r=k.slider("Rapport r = a/b",1.2,2.2,0.001,1.4,"");
    var ro=k.readouts(["Rapport du petit rectangle","r² − r − 1","Écart"]);
    var nt=k.note("","");
    var PHI=(1+Math.sqrt(5))/2, geo={};
    M.grab(c,function(){ return geo.h?[{id:"e",x:geo.x+geo.w,y:geo.y+geo.h/2,r:30},{id:"g",x:geo.G(r.value),y:geo.gy,r:26}]:[]; },
      function(id,px,py){ var v=id==="e"?(px-geo.x)/geo.h:geo.iG(px); r.set(M.clamp(Math.round(v*1000)/1000,1.2,2.2)); k.redraw(); });
    k.draw(function(){
      M.adapt(c,.9,.7,520);
      var R=r.value, W=c.W,H=c.H, ctx=c.ctx; c.clear();
      var stripH=80, h=Math.min((H-stripH-30)*.98,(W-40)/2.2), w=h*R, x=(W-w)/2-0, y=14+((H-stripH-30)-h)/2;
      var ok=Math.abs(R-PHI)<0.0015, rp=1/(R-1), g=R*R-R-1;
      geo.h=h; geo.w=w; geo.x=x; geo.y=y;
      /* carrés retirés successivement */
      var cols=[P.acc,P.amber,P.green,P.violet], X=x,Y=y,Wd=w,Ht=h;
      for(var i=0;i<6;i++){
        var s=Math.min(Wd,Ht); if(s<5) break; var sx,sy,k4=i%4;
        if(k4===0){ sx=X; sy=Y; X+=s; Wd-=s; } else if(k4===1){ sx=X; sy=Y; Y+=s; Ht-=s; } else if(k4===2){ sx=X+Wd-s; sy=Y; Wd-=s; } else { sx=X; sy=Y+Ht-s; Ht-=s; }
        ctx.fillStyle=S.draw.tint(cols[k4],i===0?.20:.22); ctx.fillRect(sx,sy,s,s); ctx.strokeStyle=P.ink; ctx.lineWidth=1.1; ctx.strokeRect(sx,sy,s,s);
        if(i===0) S.draw.text(c,"carré b × b",sx+s/2,sy+s/2,{size:Math.max(11,Math.min(15,s/8)),color:P.ink,weight:700});
      }
      /* petit rectangle restant (pointillés) */
      ctx.save(); ctx.strokeStyle=ok?P.green:P.red; ctx.lineWidth=3; ctx.setLineDash([7,5]); ctx.strokeRect(x+h,y,w-h,h); ctx.restore();
      ctx.strokeStyle=P.ink; ctx.lineWidth=2.2; ctx.strokeRect(x,y,w,h);
      M.lab(c,"a = "+F(R,3)+" b",x+w/2,y-12,P.ink,{size:11.5}); M.lab(c,"b",x-14,y+h/2,P.ink,{size:11.5});
      M.lab(c,"b × (a − b)",x+h+(w-h)/2,y+h+14,ok?P.green:P.red,{size:11});
      M.handle(c,x+w,y+h/2,P.acc,7);
      if(ok) S.draw.glow(c,x+w/2,y+h/2,Math.max(w,h)*.7,P.yellow,.28);
      /* règle du rapport */
      var gx0=26,gx1=W-26,gy=H-26, G=function(v){return gx0+(v-1.2)/1.0*(gx1-gx0);}; geo.G=G; geo.gy=gy; geo.iG=function(px){return 1.2+(px-gx0)/(gx1-gx0)*1.0;};
      S.draw.panel(c,6,H-stripH+6,W-12,stripH-10,{shadow:false});
      S.draw.text(c,"r (rapport a/b)  —  rapport du petit rectangle = "+F(rp,3),14,H-stripH+19,{size:11,color:P.grey,align:"left"});
      S.draw.line(c,gx0,gy,gx1,gy,P.axis,2);
      for(var v=1.2;v<=2.2001;v+=0.2){ S.draw.line(c,G(v),gy-4,G(v),gy+4,P.axis,1); S.draw.text(c,F(v,1),G(v),gy+15,{size:10.5,color:P.grey}); }
      ctx.save(); ctx.fillStyle=P.amber; ctx.beginPath(); ctx.moveTo(G(PHI),gy-9); ctx.lineTo(G(PHI)+7,gy); ctx.lineTo(G(PHI),gy+9); ctx.lineTo(G(PHI)-7,gy); ctx.closePath(); ctx.fill(); ctx.restore();
      S.draw.text(c,"φ",G(PHI),gy-19,{size:12,color:P.amber,math:true});
      M.handle(c,G(R),gy,ok?P.green:P.red,6.5);
      ro.set(0,F(rp,3)+" (grand : "+F(R,3)+")"); ro.set(1,F(g,4)); ro.set(2,F(Math.abs(R-PHI),4));
      nt.set(ok ? "Rectangle d'or : r ≈ 1,618 ! Le petit rectangle (pointillés) est semblable au grand, et le motif se répète à l'infini." : (R<PHI?"r trop petit : le petit rectangle est trop allongé (son rapport dépasse r).":"r trop grand : le petit rectangle est trop trapu (son rapport est inférieur à r)."), ok?"ok":"");
    });
  }
});
})();
