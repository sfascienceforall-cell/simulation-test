/* Chapitre 5 : droites et plans dans l'espace (caméra à perspective commune : M6.cam3) */
function inCube(X){ return Math.abs(X[0])<=5+1e-9&&Math.abs(X[1])<=5+1e-9&&Math.abs(X[2])<=5+1e-9; }
var PL=[[[1,1,1],3,"x + y + z = 3"],[[2,-1,1],2,"2x − y + z = 2"],[[1,2,-1],2,"x + 2y − z = 2"]];

SFA.sim({
  id:"m6-c05-plan-normal", ch:"c05", tag:"Classique · 3D",
  titre:"Un plan, son équation et son vecteur normal",
  resume:"Règle a, b, c, d : le plan tourne, le vecteur normal (a ; b ; c) reste perpendiculaire.",
  but:"Fais varier les coefficients du plan ax + by + cz = d (curseurs, ou glisse le point violet au bout du vecteur n). Glisse ailleurs sur le dessin pour tourner la vue. Le vecteur normal n = (a ; b ; c) est toujours perpendiculaire au plan.",
  aRetenir:"Le plan d'équation ax + by + cz = d a pour vecteur normal n = (a ; b ; c) : n est perpendiculaire à tous les vecteurs du plan. Changer d translate le plan sans le tourner. 6 h : la distance de l'origine au plan vaut |d| / ‖n‖, c'est le rayon de la sphère centrée en O tangente au plan.",
  piege:"Le vecteur normal n'est pas un vecteur directeur du plan, c'est le contraire : il est perpendiculaire au plan. Et ax + by = c, sans z, est un plan (parallèle à l'axe z) et non une droite dans l'espace.",
  build:function(k,S){
    var c=M6.canvas(k,.9,380), P=S.draw.palette, v=M6.cam3(c,S,{L:5});
    var a=k.slider("a",-3,3,1,1,"",null), b=k.slider("b",-3,3,1,2,"",null), cc=k.slider("c",-3,3,1,1,"",null), d=k.slider("d",-6,6,1,3,"",null);
    var sp=k.toggle("Montrer la sphère tangente centrée en O (6 h)",false);
    var ro=k.readouts(["Équation","Vecteur normal","Distance de O au plan (6 h)","Pied H de la perpendiculaire"]);
    var nt=k.note("Glisse sur le dessin pour tourner la vue.","ok");
    v.attach(k,function(){ return [{p:[a.value,b.value,cc.value],fix:2,set:function(g){ a.set(M6.clamp(Math.round(g[0]),-3,3)); b.set(M6.clamp(Math.round(g[1]),-3,3)); }}]; });
    k.draw(function(){
      c.clear(); var n=[a.value,b.value,cc.value], D=d.value, nn=Math.hypot(n[0],n[1],n[2]), ctx=c.ctx;
      v.box();
      var N=[n[0],n[1],n[2]];
      if(nn===0){ nt.set(D===0?"a = b = c = 0 et d = 0 : 0 = 0 est vrai pour tout point, ce n'est pas un plan.":"a = b = c = 0 : l'équation 0 = d n'a aucune solution, ce n'est pas un plan.","warn"); ro.set(0,"—"); ro.set(1,"(0 ; 0 ; 0)"); ro.set(2,"—"); ro.set(3,"—"); return; }
      var H=[D*n[0]/(nn*nn),D*n[1]/(nn*nn),D*n[2]/(nn*nn)], dist=Math.abs(D)/nn;
      if(sp.value&&dist>0){ var o=v.P([0,0,0]), r=dist*v.u()*0.98; ctx.save(); var g=ctx.createRadialGradient(o.x-r*0.3,o.y-r*0.3,r*0.1,o.x,o.y,r); g.addColorStop(0,"rgba(14,127,150,.22)"); g.addColorStop(1,"rgba(14,127,150,.06)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(o.x,o.y,r,0,6.2832); ctx.fill(); ctx.strokeStyle=P.teal; ctx.lineWidth=1.6; ctx.setLineDash([5,4]); ctx.stroke(); ctx.restore(); }
      v.plane(n,D,P.mat);
      v.dot([0,0,0],4,P.ink); v.text([0,0,0],"O",{dx:-10,dy:12,size:12});
      v.line([0,0,0],H,P.violet,1.6,[4,3]); v.dot(H,5,P.violet);
      var s=2.4/nn, tip=[H[0]+n[0]*s,H[1]+n[1]*s,H[2]+n[2]*s];
      v.arrow(H,tip,P.red,3); v.text(tip,"n",{dx:12,dy:-8,size:15,color:P.red,math:true,italic:true});
      /* le vecteur (a ; b ; c) depuis O : poignée à déplacer */
      v.line([0,0,0],n,S.draw.tint(P.violet,0.55),1.4,[2,3]); var hp=v.P(n); M6.handle(S,c,hp.x,hp.y,P.violet,v.active===0,7);
      S.draw.label(c,"("+S.fmt(n[0],0)+" ; "+S.fmt(n[1],0)+" ; "+S.fmt(n[2],0)+")",hp.x+12,hp.y-16,{color:P.violet,align:"left",size:M6.fs(c,11.5)});
      v.hint("Glisse pour tourner · tire le point violet pour changer (a ; b)");
      M6.tag(S,c,M6.eq3(S,n[0],n[1],n[2],D),10,18,P.mat,{math:true,size:M6.fs(c,13)});
      ro.set(0,M6.eq3(S,n[0],n[1],n[2],D)); ro.set(1,M6.v3(S,n));
      ro.set(2,S.fmt(dist,3)+" = "+S.fmt(Math.abs(D),0)+" / "+S.fmt(nn,3)); ro.set(3,M6.v3(S,H,2));
      if(n[0]===0||n[1]===0||n[2]===0) nt.set("Un coefficient nul : le plan est parallèle à l'axe correspondant.","warn");
      else nt.set("Pour vérifier un point (x ; y ; z) : remplace-le dans "+M6.eq3(S,n[0],n[1],n[2],D)+".","ok");
      if(Math.abs(D)>0&&dist>5) nt.set("Le plan est hors du cube dessiné (|d|/‖n‖ &gt; 5) : on ne le voit plus.","warn");
    });
  }
});

SFA.sim({
  id:"m6-c05-droite-deux-points", ch:"c05", tag:"Classique · 3D",
  titre:"La droite AB : équations paramétriques et cartésiennes",
  resume:"Déplace A et B : le vecteur directeur AB et les équations de la droite se mettent à jour.",
  but:"Glisse les points A et B sur leur plan horizontal (ils se calent sur des valeurs entières), règle leur hauteur z avec les curseurs, puis glisse t pour déplacer le point M(t). Tourne la vue en glissant ailleurs.",
  aRetenir:"La droite AB a pour vecteur directeur AB = (x<sub>B</sub> − x<sub>A</sub> ; y<sub>B</sub> − y<sub>A</sub> ; z<sub>B</sub> − z<sub>A</sub>) et pour équations paramétriques x = x<sub>A</sub> + t·d<sub>x</sub>, y = y<sub>A</sub> + t·d<sub>y</sub>, z = z<sub>A</sub> + t·d<sub>z</sub>. Pour t = 0 on est en A, pour t = 1 en B. Dans l'espace, une droite a besoin de <i>deux</i> équations cartésiennes (intersection de deux plans).",
  piege:"Une droite de l'espace n'a pas d'équation du type y = mx + p. Si une coordonnée du vecteur directeur est nulle, on ne peut pas écrire le quotient correspondant : cette coordonnée reste constante.",
  build:function(k,S){
    var c=M6.canvas(k,.85,380), P=S.draw.palette, v=M6.cam3(c,S,{L:5});
    var xa=k.slider("x de A",-4,4,1,-2,"",null), ya=k.slider("y de A",-4,4,1,-1,"",null), za=k.slider("z de A",-4,4,1,0,"",null);
    var xb=k.slider("x de B",-4,4,1,2,"",null), yb=k.slider("y de B",-4,4,1,2,"",null), zb=k.slider("z de B",-4,4,1,3,"",null);
    var t=k.slider("Paramètre t du point M",-1,2,0.1,0.5,"",null);
    var ro=k.readouts(["Vecteur directeur AB","M(t)","Paramétriques","Cartésiennes"]);
    var nt=k.note("","warn");
    function put(sx,sy,g){ sx.set(M6.clamp(Math.round(g[0]),-4,4)); sy.set(M6.clamp(Math.round(g[1]),-4,4)); }
    v.attach(k,function(){ return [{p:[xa.value,ya.value,za.value],fix:2,set:function(g){ put(xa,ya,g); }},{p:[xb.value,yb.value,zb.value],fix:2,set:function(g){ put(xb,yb,g); }}]; });
    k.draw(function(){
      c.clear(); var A=[xa.value,ya.value,za.value], B=[xb.value,yb.value,zb.value], u=[B[0]-A[0],B[1]-A[1],B[2]-A[2]];
      v.box();
      if(u[0]===0&&u[1]===0&&u[2]===0){ v.dot(A,6,P.red); ro.set(0,"(0 ; 0 ; 0)"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("A et B sont confondus : il n'y a pas de droite AB. Déplace B.","warn"); return; }
      v.coords(A,S.draw.tint(P.mat,0.6)); v.coords(B,S.draw.tint(P.mat,0.6));
      v.seg(A,u,P.grey,1.6,[6,4]); v.line(A,B,P.mat,3.4);
      var pa=v.P(A), pb=v.P(B);
      M6.handle(S,c,pa.x,pa.y,P.mat,v.active===0,8); M6.handle(S,c,pb.x,pb.y,P.mat,v.active===1,8);
      S.draw.label(c,"A"+M6.v3(S,A),pa.x-12,pa.y-18,{color:P.mat,align:"right",size:M6.fs(c,11.5)}); S.draw.label(c,"B"+M6.v3(S,B),pb.x+12,pb.y-18,{color:P.mat,align:"left",size:M6.fs(c,11.5)});
      var tt=t.value, M=[A[0]+tt*u[0],A[1]+tt*u[1],A[2]+tt*u[2]];
      v.arrow(A,B,P.red,2.2);
      var pm=v.dot(M,6,P.red); S.draw.label(c,"M",pm.x+12,pm.y+14,{color:P.red,size:M6.fs(c,12)});
      v.hint("Glisse pour tourner · tire A et B");
      ro.set(0,M6.v3(S,u)); ro.set(1,M6.v3(S,M,2));
      ro.set(2,"x = "+M6.lin3(S,A[0],u[0])+" ; y = "+M6.lin3(S,A[1],u[1])+" ; z = "+M6.lin3(S,A[2],u[2]));
      var parts=[], fixed=[], nm=["x","y","z"];
      for(var i=0;i<3;i++){ if(u[i]===0) fixed.push(nm[i]+" = "+S.fmt(A[i],0)); else parts.push("("+nm[i]+(A[i]===0?"":(A[i]<0?" + ":" − ")+S.fmt(Math.abs(A[i]),0))+") / "+(u[i]<0?"("+S.fmt(u[i],0)+")":S.fmt(u[i],0))); }
      ro.set(3,parts.join(" = ")+(fixed.length?(parts.length?" ; ":"")+fixed.join(" ; "):""));
      var z0=u[0]===0||u[1]===0||u[2]===0;
      nt.set(z0?"Une coordonnée de AB est nulle : cette coordonnée est constante sur toute la droite (le plan correspondant la contient).":"Vérifie : pour t = 1 on obtient bien B = "+M6.v3(S,B)+".",z0?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"m6-c05-droite-plan", ch:"c05", tag:"Intersection",
  titre:"Droite et plan : un point, aucun point, ou toute la droite",
  resume:"Oriente la droite et décale-la : tu obtiens les trois positions relatives possibles.",
  but:"Le plan est choisi dans la liste. La droite passe par Q + s·n (Q est dans le plan) avec la direction u que tu règles (curseurs ou point violet). Défi : obtiens une droite parallèle au plan sans y être contenue, puis une droite contenue dans le plan.",
  aRetenir:"On remplace x, y, z de la droite dans l'équation du plan : on obtient (n·u)·t = d − n·P₀. Si n·u ≠ 0 : un seul point. Si n·u = 0 : la droite est parallèle au plan, et elle y est contenue si et seulement si d − n·P₀ = 0, sinon il n'y a aucun point commun.",
  piege:"Une droite parallèle au plan n'a aucune intersection... sauf si elle est <i>dans</i> le plan : alors toute la droite est commune. Il faut tester le point de départ avant de conclure.",
  build:function(k,S){
    var c=M6.canvas(k,.9,380), P=S.draw.palette, v=M6.cam3(c,S,{L:5});
    var pl=k.select("Plan",[["0","x + y + z = 3"],["1","2x − y + z = 2"],["2","x + 2y − z = 2"]],"0");
    var Q=[1,1,1], PAR=[[1,-1,0],[1,2,0],[2,-1,0]];
    var ux=k.slider("u : x",-3,3,1,1,"",null), uy=k.slider("u : y",-3,3,1,-2,"",null), uz=k.slider("u : z",-3,3,1,1,"",null);
    var s=k.slider("Décalage s de la droite (le long de n)",-1.5,1.5,0.5,0.5,"",null);
    k.button("Droite parallèle (sans contact)",function(){ var u=PAR[+pl.value]; ux.set(u[0]); uy.set(u[1]); uz.set(u[2]); s.set(1); });
    k.button("Droite contenue dans le plan",function(){ var u=PAR[+pl.value]; ux.set(u[0]); uy.set(u[1]); uz.set(u[2]); s.set(0); });
    var ro=k.readouts(["Produit scalaire normale · direction","Équation en t","Position relative","Point d'intersection"]);
    var nt=k.note("","warn");
    function P0(){ var n=PL[+pl.value][0]; return [Q[0]+s.value*n[0],Q[1]+s.value*n[1],Q[2]+s.value*n[2]]; }
    v.attach(k,function(){ var p0=P0(); return [{p:[p0[0]+ux.value,p0[1]+uy.value,p0[2]+uz.value],fix:2,set:function(g){ var p=P0(); ux.set(M6.clamp(Math.round(g[0]-p[0]),-3,3)); uy.set(M6.clamp(Math.round(g[1]-p[1]),-3,3)); }}]; });
    k.draw(function(){
      c.clear(); var i=+pl.value, n=PL[i][0], d=PL[i][1], u=[ux.value,uy.value,uz.value], ss=s.value;
      v.box(); v.plane(n,d,P.mat);
      var P0v=P0();
      if(u[0]===0&&u[1]===0&&u[2]===0){ v.dot(P0v,6,P.red); ro.set(0,"0"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("u = (0 ; 0 ; 0) n'est pas un vecteur directeur : choisis une direction non nulle.","warn"); return; }
      v.seg(P0v,u,P.red,3.2);
      var tip=[P0v[0]+u[0],P0v[1]+u[1],P0v[2]+u[2]], pt=v.P(tip); v.arrow(P0v,tip,P.violet,2.2); M6.handle(S,c,pt.x,pt.y,P.violet,v.active===0,7);
      S.draw.label(c,"u",pt.x+10,pt.y-14,{color:P.violet,size:M6.fs(c,13),math:true});
      v.dot(P0v,4.5,P.red);
      var nu=M6.dot(n,u), rhs=d-M6.dot(n,P0v);
      ro.set(0,S.fmt(nu,0)); ro.set(1,S.fmt(nu,0)+"·t = "+S.fmt(rhs,2));
      if(nu!==0){ var tt=rhs/nu, X=[P0v[0]+tt*u[0],P0v[1]+tt*u[1],P0v[2]+tt*u[2]], hors=!inCube(X); if(!hors){ var q=v.dot(X,7,"#13233a"); S.draw.label(c,"point commun",q.x+12,q.y+16,{color:P.ink,align:"left",size:M6.fs(c,11.5)}); }
        ro.set(2,"sécante"); ro.set(3,M6.v3(S,X,2)+" pour t = "+S.fmt(tt,2));
        nt.set("n·u ≠ 0 : la droite perce le plan en un seul point."+(hors?" <b>Ce point est hors du cube dessiné</b> (il existe quand même : voir ses coordonnées)."  : "")+" Pour la rendre parallèle, cherche u tel que n·u = 0 (u ⊥ n).",hors?"warn":"ok"); }
      else if(Math.abs(rhs)<1e-9){ ro.set(2,"contenue dans le plan"); ro.set(3,"toute la droite"); nt.set("n·u = 0 et d − n·P₀ = 0 : la droite est dans le plan, tous ses points sont communs.","ok"); }
      else { ro.set(2,"strictement parallèle"); ro.set(3,"aucun"); nt.set("n·u = 0 et d − n·P₀ ≠ 0 : l'équation 0·t = "+S.fmt(rhs,2)+" est impossible, aucun point commun.","warn"); }
      v.hint("Glisse pour tourner · tire le point violet pour orienter la droite");
      M6.tag(S,c,PL[i][2],10,18,P.mat,{math:true,size:M6.fs(c,13)});
    });
  }
});

SFA.sim({
  id:"m6-c05-plans-secants", ch:"c05", tag:"Intersection",
  titre:"Deux plans : la droite d'intersection",
  resume:"Change le deuxième plan : la droite commune a pour direction n₁ × n₂, ou les plans sont parallèles.",
  but:"Choisis le premier plan, puis règle le deuxième (a, b, c, d, ou tire le point rouge au bout de n₂). La droite noire est leur intersection. Fais apparaître les cas parallèles et confondus.",
  aRetenir:"Deux plans non parallèles se coupent suivant une droite dont un vecteur directeur est perpendiculaire aux deux normales : n₁ × n₂ (produit vectoriel, vu comme outil ; on peut aussi résoudre le système de deux équations). Les plans sont parallèles si leurs normales sont proportionnelles ; confondus si en plus d est dans la même proportion.",
  piege:"Deux équations de plans dont les normales sont proportionnelles ne sont pas forcément équivalentes : x + y + z = 3 et 2x + 2y + 2z = 5 sont parallèles <i>distincts</i>.",
  build:function(k,S){
    var c=M6.canvas(k,.9,380), P=S.draw.palette, v=M6.cam3(c,S,{L:5});
    var p1=k.select("Plan 1",[["0","x + y + z = 3"],["1","2x − y + z = 2"],["2","x + 2y − z = 2"]],"0");
    var a=k.slider("a₂",-3,3,1,2,"",null), b=k.slider("b₂",-3,3,1,-1,"",null), cc=k.slider("c₂",-3,3,1,3,"",null), d=k.slider("d₂",-6,6,1,5,"",null);
    var ro=k.readouts(["Plan 2","n₁ × n₂","Position relative","Un point commun / direction"]);
    var nt=k.note("","ok");
    v.attach(k,function(){ return [{p:[a.value,b.value,cc.value],fix:2,set:function(g){ a.set(M6.clamp(Math.round(g[0]),-3,3)); b.set(M6.clamp(Math.round(g[1]),-3,3)); }}]; });
    k.draw(function(){
      c.clear(); var i=+p1.value, n1=PL[i][0], d1=PL[i][1], n2=[a.value,b.value,cc.value], d2=d.value;
      v.box(); v.plane(n1,d1,P.mat);
      var z2=n2[0]===0&&n2[1]===0&&n2[2]===0;
      if(z2){ ro.set(0,"pas un plan"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("(a₂ ; b₂ ; c₂) = (0 ; 0 ; 0) : ce n'est pas un plan. Change un coefficient.","warn"); return; }
      v.plane(n2,d2,P.red);
      var hp=v.P(n2); M6.handle(S,c,hp.x,hp.y,P.red,v.active===0,7); v.line([0,0,0],n2,S.draw.tint(P.red,0.5),1.3,[2,3]);
      var w=M6.cross(n1,n2), ww=M6.dot(w,w);
      ro.set(0,M6.eq3(S,n2[0],n2[1],n2[2],d2)); ro.set(1,M6.v3(S,w));
      if(ww===0){
        var lam=Math.abs(n1[0])>0?n2[0]/n1[0]:(Math.abs(n1[1])>0?n2[1]/n1[1]:n2[2]/n1[2]);
        if(Math.abs(d2-lam*d1)<1e-9){ ro.set(2,"confondus"); ro.set(3,"tous les points"); nt.set("Les normales sont proportionnelles (facteur "+S.fmt(lam,2)+") et d₂ = "+S.fmt(lam,2)+"×d₁ : c'est le même plan.","ok"); }
        else { ro.set(2,"parallèles distincts"); ro.set(3,"aucun"); nt.set("Les normales sont proportionnelles mais pas les seconds membres : aucun point commun.","warn"); }
        return;
      }
      var c1=M6.cross(n2,w), c2=M6.cross(n1,w), X=[(d1*c1[0]-d2*c2[0])/ww,(d1*c1[1]-d2*c2[1])/ww,(d1*c1[2]-d2*c2[2])/ww];
      var sg=v.seg(X,w,"#13233a",4); if(M6.dot(X,X)>=0&&v.inBox(X)) v.dot(X,5,P.violet);
      v.hint("Glisse pour tourner · tire le point rouge pour incliner le plan 2");
      M6.tag(S,c,"bleu : plan 1 · rouge : plan 2 · noir : leur droite commune",10,18,P.ink,{size:M6.fs(c,11.5)});
      ro.set(2,"sécants suivant une droite"); ro.set(3,M6.v3(S,X,2)+" ; d = "+M6.v3(S,w));
      nt.set("Vérification : n₁·X = "+S.fmt(M6.dot(n1,X),2)+" (= d₁ = "+S.fmt(d1,0)+") et n₂·X = "+S.fmt(M6.dot(n2,X),2)+" (= d₂ = "+S.fmt(d2,0)+").","ok");
    });
  }
});
