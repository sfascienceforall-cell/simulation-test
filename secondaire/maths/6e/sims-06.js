/* Chapitre 6 : systèmes linéaires 3×3 */
function rank6(M){ var m=M.map(function(r){return r.slice();}), r=0, cols=m[0].length;
  for(var c=0;c<cols&&r<m.length;c++){ var p=-1; for(var i=r;i<m.length;i++){ if(Math.abs(m[i][c])>1e-9&&(p<0||Math.abs(m[i][c])>Math.abs(m[p][c]))) p=i; }
    if(p<0) continue; var t=m[p]; m[p]=m[r]; m[r]=t;
    for(i=r+1;i<m.length;i++){ var f=m[i][c]/m[r][c]; for(var j=c;j<cols;j++) m[i][j]-=f*m[r][j]; } r++; }
  return r; }
function wrapText(ctx,text,maxW){ var words=String(text).split(" "), lines=[], cur=""; words.forEach(function(w){ var t=cur?cur+" "+w:w; if(ctx.measureText(t).width>maxW&&cur){ lines.push(cur); cur=w; } else cur=t; }); if(cur) lines.push(cur); return lines; }

SFA.sim({
  id:"m6-c06-trois-plans", ch:"c06", tag:"Classique · 3D",
  titre:"Trois plans : point, droite, plan ou rien",
  resume:"Règle le 3e plan : le système a une solution, une infinité ou aucune.",
  but:"Choisis les deux premiers plans, puis modifie a, b, c, d du 3e plan (ax + by + cz = d) avec les curseurs ou en tirant le point vert. La simulation donne le rang, le type de solution et dessine l'ensemble des solutions. Tourne la vue en glissant.",
  aRetenir:"Un système 3×3 est la recherche de l'intersection de trois plans. Trois plans peuvent se couper en un point (solution unique), suivant une droite (indéterminé, une inconnue libre), être confondus (deux inconnues libres) ou n'avoir aucun point commun (impossible). Le système est impossible si le rang de la matrice augmentée dépasse celui de la matrice des coefficients.",
  piege:"Trois équations ne donnent pas toujours une seule solution : si une équation est combinaison des deux autres, il y a une droite de solutions ; et « pas de solution » peut venir de trois plans qui se coupent deux à deux sans point commun (prisme).",
  build:function(k,S){
    var c=M6.canvas(k,.9,390), P=S.draw.palette, v=M6.cam3(c,S,{L:5});
    var pre=k.select("Plans 1 et 2",[["0","x + y + z = 3  et  2x − y + z = 2"],["1","x − y = 0  et  y − z = 0"],["2","x + y + z = 3  et  2x + 2y + 2z = 6"]],"0");
    var PR=[[[[1,1,1],3],[[2,-1,1],2]],[[[1,-1,0],0],[[0,1,-1],0]],[[[1,1,1],3],[[2,2,2],6]]];
    var a=k.slider("a₃",-3,3,1,1,"",null), b=k.slider("b₃",-3,3,1,-1,"",null), cc=k.slider("c₃",-3,3,1,1,"",null), d=k.slider("d₃",-6,6,1,1,"",null);
    var ro=k.readouts(["Rang (coefficients)","Rang (augmentée)","Nature","Solution"]);
    var nt=k.note("","ok");
    v.attach(k,function(){ return [{p:[a.value,b.value,cc.value],fix:2,set:function(g){ a.set(M6.clamp(Math.round(g[0]),-3,3)); b.set(M6.clamp(Math.round(g[1]),-3,3)); }}]; });
    k.draw(function(){
      c.clear(); var pl=PR[+pre.value].slice(); pl.push([[a.value,b.value,cc.value],d.value]);
      var cols=[P.mat,P.red,P.green];
      v.box();
      pl.forEach(function(p,i){ if(Math.hypot(p[0][0],p[0][1],p[0][2])>0) v.plane(p[0],p[1],cols[i],{alpha:0.16}); });
      var hp=v.P([a.value,b.value,cc.value]); M6.handle(S,c,hp.x,hp.y,P.green,v.active===0,7);
      S.draw.legend(c,[[P.mat,"plan 1"],[P.red,"plan 2"],[P.green,"plan 3"]],10,10);
      v.hint("Glisse pour tourner · tire le point vert pour incliner le plan 3");
      var A=pl.map(function(p){return p[0];}), Ag=pl.map(function(p){return p[0].concat([p[1]]);});
      var rA=rank6(A), rG=rank6(Ag);
      ro.set(0,String(rA)); ro.set(1,String(rG));
      var f=function(z){return S.fmt(z,2);};
      if(rA<rG){ ro.set(2,"impossible"); ro.set(3,"aucune"); nt.set("Le rang de la matrice augmentée ("+rG+") dépasse celui des coefficients ("+rA+") : les équations se contredisent, aucun point commun aux trois plans.","warn"); return; }
      if(rA===3){
        var n1=A[0],n2=A[1],n3=A[2], det=M6.dot(n1,M6.cross(n2,n3)), c23=M6.cross(n2,n3), c31=M6.cross(n3,n1), c12=M6.cross(n1,n2);
        var X=[0,1,2].map(function(i){return (pl[0][1]*c23[i]+pl[1][1]*c31[i]+pl[2][1]*c12[i])/det;});
        if(v.inBox(X)){ var q=v.dot(X,8,"#13233a"); S.draw.label(c,"solution",q.x+12,q.y+16,{color:P.ink,align:"left",size:M6.fs(c,12)}); v.coords(X,"#13233a"); }
        ro.set(2,"solution unique"); ro.set(3,M6.v3(S,X,2));
        nt.set("Déterminant des coefficients = "+S.fmt(det,0)+" ≠ 0 : les trois plans se coupent en un seul point."+(v.inBox(X)?"":" <b>Ce point est hors du cube dessiné</b> : ses coordonnées restent exactes."),v.inBox(X)?"ok":"warn"); return;
      }
      if(rA===2){
        var pairs=[[0,1],[0,2],[1,2]], q2=null; for(var i=0;i<3;i++){ var w=M6.cross(A[pairs[i][0]],A[pairs[i][1]]); if(Math.hypot(w[0],w[1],w[2])>0){ q2=[pairs[i][0],pairs[i][1],w]; break; } }
        var w2=q2[2], ww=M6.dot(w2,w2), n1b=A[q2[0]], n2b=A[q2[1]], c1=M6.cross(n2b,w2), c2=M6.cross(n1b,w2), d1=pl[q2[0]][1], d2=pl[q2[1]][1];
        var Y=[0,1,2].map(function(i){return (d1*c1[i]-d2*c2[i])/ww;});
        v.seg(Y,w2,"#13233a",4.2); if(v.inBox(Y)) v.dot(Y,5,P.violet);
        ro.set(2,"indéterminé : une droite"); ro.set(3,"point "+M6.v3(S,Y,2)+" + t·"+M6.v3(S,w2));
        nt.set("Rang 2 sur 3 inconnues : une inconnue reste libre, les solutions forment une droite.","ok"); return;
      }
      ro.set(2,"indéterminé : un plan"); ro.set(3,"tous les points du plan"); nt.set("Rang 1 : les trois équations décrivent le même plan, deux inconnues sont libres.","ok");
    });
  }
});

/* --- élimination de Gauss avec fractions --- */
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a||1; }
function Fr(n,d){ if(d===undefined) d=1; if(d<0){ n=-n; d=-d; } var g=gcd(n,d); return {n:n/g,d:d/g}; }
function fsub(a,b){ return Fr(a.n*b.d-b.n*a.d,a.d*b.d); }
function fmul(a,b){ return Fr(a.n*b.n,a.d*b.d); }
function fdiv(a,b){ return Fr(a.n*b.d,a.d*b.n); }
function fz(a){ return a.n===0; }
function fs(a){ var m=a.n<0?"−":""; return m+(a.d===1?String(Math.abs(a.n)):Math.abs(a.n)+"/"+a.d); }

SFA.sim({
  id:"m6-c06-gauss", ch:"c06", tag:"Classique · Méthode",
  titre:"L'élimination de Gauss, étape par étape",
  resume:"Avance dans les opérations sur les lignes : le système devient triangulaire puis se lit.",
  but:"Choisis un système puis un mode. En « Démonstration », fais avancer les étapes. En « À toi de jouer », choisis toi-même l'opération sur les lignes qui élimine l'inconnue : la matrice se met à jour si tu as raison.",
  aRetenir:"On élimine x des lignes 2 et 3, puis y de la ligne 3 : le système devient triangulaire et se résout de bas en haut. Une ligne (0 0 0 | 0) signale un système indéterminé ; une ligne (0 0 0 | c) avec c ≠ 0 signale un système impossible. Les opérations « Lᵢ ← Lᵢ − f·Lⱼ » et « Lᵢ ↔ Lⱼ » donnent un système équivalent.",
  piege:"Quand tu modifies une ligne, recopie bien <i>tous</i> les termes, second membre compris. Si le pivot est nul, on échange deux lignes : cela ne change pas les solutions.",
  build:function(k,S){
    var c=M6.canvas(k,0.66,330), P=S.draw.palette;
    var SYS={
      a:{n:"Solution unique",M:[[1,1,1,6],[2,-1,1,3],[1,2,-1,2]]},
      b:{n:"Pivot nul : échange de lignes",M:[[0,1,1,5],[1,1,1,6],[2,1,-1,3]]},
      c:{n:"Indéterminé",M:[[1,1,1,6],[2,-1,1,3],[3,0,2,9]]},
      d:{n:"Impossible",M:[[1,1,1,6],[2,-1,1,3],[3,0,2,10]]}
    };
    var sel=k.select("Système",[["a","Solution unique"],["b","Pivot nul : échange de lignes"],["c","Indéterminé"],["d","Impossible"]],"a",function(){ us=0; fb=""; });
    var mode=k.seg("Mode",[["d","Démonstration"],["u","À toi de jouer"]],"d",function(){ us=0; fb=""; });
    var st=k.slider("Étape (démonstration)",0,6,1,0,"",null);
    var us=0, fb="", fbOk=true, flash=0;
    var opt=[0,1,2,3].map(function(i){ return k.button("…",function(){ choose(i); }); });
    var nt=k.note("","ok");
    function build(M0){
      var M=M0.map(function(r){return r.map(function(x){return Fr(x);});}), steps=[{d:"Système de départ",M:M.map(function(r){return r.slice();}),hi:[],op:null}], r=0;
      for(var cc=0;cc<3&&r<3;cc++){
        var p=-1; for(var i=r;i<3;i++){ if(!fz(M[i][cc])){ p=i; break; } }
        if(p<0) continue;
        if(p!==r){ var t=M[p]; M[p]=M[r]; M[r]=t; steps.push({d:"L"+(r+1)+" ↔ L"+(p+1)+" (le pivot était nul)",M:M.map(function(q){return q.slice();}),hi:[r,p],op:{swap:[r,p]}}); }
        for(i=r+1;i<3;i++){ if(fz(M[i][cc])) continue; var f=fdiv(M[i][cc],M[r][cc]), before=M.map(function(q){return q.slice();});
          for(var j=0;j<4;j++) M[i][j]=fsub(M[i][j],fmul(f,M[r][j]));
          var af=Fr(Math.abs(f.n),f.d), coef=(af.n===1&&af.d===1)?"":"("+fs(af)+")·";
          steps.push({d:"L"+(i+1)+" ← L"+(i+1)+(f.n<0?" + ":" − ")+coef+"L"+(r+1),M:M.map(function(q){return q.slice();}),hi:[i],op:{row:i,piv:r,col:cc,f:f,before:before}}); }
        r++; }
      return steps;
    }
    function reading(M){
      var rows=M.map(function(r){return r.slice();}), bad=false, zero=0;
      rows.forEach(function(r){ if(fz(r[0])&&fz(r[1])&&fz(r[2])){ if(!fz(r[3])) bad=true; else zero++; } });
      if(bad) return "Lecture : une ligne (0 0 0 | c) avec c ≠ 0 dit 0 = c, ce qui est faux : système IMPOSSIBLE, aucune solution.";
      if(zero===0){
        var z=fdiv(M[2][3],M[2][2]), y=fdiv(fsub(M[1][3],fmul(M[1][2],z)),M[1][1]), x=fdiv(fsub(fsub(M[0][3],fmul(M[0][2],z)),fmul(M[0][1],y)),M[0][0]);
        return "Lecture, de bas en haut : z = "+fs(z)+", puis y = "+fs(y)+", puis x = "+fs(x)+". Solution unique (x ; y ; z) = ("+fs(x)+" ; "+fs(y)+" ; "+fs(z)+").";
      }
      var b=M[1][1], yc=fdiv(M[1][3],b), yt=fdiv(fsub(Fr(0),M[1][2]),b);
      var xc=fdiv(fsub(M[0][3],fmul(M[0][1],yc)),M[0][0]), xt=fdiv(fsub(fsub(Fr(0),M[0][2]),fmul(M[0][1],yt)),M[0][0]);
      function ex(c0,t0){ var s=fs(c0); if(fz(t0)) return s; var tt=(t0.n<0?" − ":" + ")+(Math.abs(t0.n)===1&&t0.d===1?"":(t0.d===1?String(Math.abs(t0.n)):Math.abs(t0.n)+"/"+t0.d)+"·")+"t"; return (fz(c0)?(t0.n<0?"−":"")+tt.replace(/^ [+−] /,""):s+tt); }
      return "Lecture : la ligne nulle (0 0 0 | 0) est inutile : 2 équations pour 3 inconnues, système INDÉTERMINÉ. Avec z = t : y = "+ex(yc,yt)+" et x = "+ex(xc,xt)+".";
    }
    function options(step){
      /* quatre propositions, une seule juste */
      var o=step.op, out=[];
      if(o.swap){ var a=o.swap[0]+1, b=o.swap[1]+1; out=[["Échanger L"+a+" et L"+b,true],["Diviser L"+a+" par son pivot (0)",false],["Supprimer L"+a,false],["Ajouter L"+b+" à L"+b,false]]; return {q:"Le pivot de L"+a+" est nul : que faire ?",o:out}; }
      var f=o.f, i=o.row+1, j=o.piv+1, fm=function(x){ var af=Fr(Math.abs(x.n),x.d); return (af.n===1&&af.d===1)?"":"("+fs(af)+")·"; };
      function lab(x,sg){ return "L"+i+" ← L"+i+(sg>0?" − ":" + ")+fm(x)+"L"+j; }
      var good=lab(f,f.n<0?-1:1)+"";
      var wrongSign=lab(f,f.n<0?1:-1), bigger=lab(Fr(f.n*2,f.d),f.n<0?-1:1), other=lab(Fr(f.n+f.d,f.d),f.n+f.d<0?-1:1), recip=f.n!==0?lab(Fr(f.d,f.n),f.n<0?-1:1):"L"+i+" ← L"+i+" − L"+j;
      var all=[[good,true]]; [wrongSign,bigger,other,recip].forEach(function(t){ if(t!==good&&!all.some(function(z){return z[0]===t;})&&all.length<4) all.push([t,false]); });
      var ii=0; while(all.length<4) all.push(["L"+i+" ← L"+i+" − "+(ii+3)+"·L"+j,false]), ii++;
      return {q:"Quelle opération annule la case de la colonne "+["x","y","z"][o.col]+" de L"+i+" (pivot : L"+j+") ?",o:all};
    }
    var steps=null, cur=null;
    function choose(i){
      if(!cur||!cur.opts) return; var ok=cur.opts.o[cur.perm[i]][1];
      if(ok){ us++; fb="Juste ! "+cur.step.d; fbOk=true; flash=1; } else { fb="Pas tout à fait : "+cur.opts.o[cur.perm[i]][0]+" ne fait pas apparaître un 0 à cet endroit. Revois le facteur."; fbOk=false; }
    }
    var lp=k.loop(function(dt){ flash=Math.max(0,flash-dt*1.8); k.redraw(); if(flash<=0) lp.pause(); });
    var oldChoose=choose; choose=function(i){ oldChoose(i); flash=Math.max(flash,0.001); if(fbOk) lp.play(); k.redraw(); };
    k.draw(function(){
      c.clear(); var ctx=c.ctx, W=c.W, H=c.H, fsz=M6.fs(c,13), sy=SYS[sel.value];
      steps=build(sy.M); var nmax=steps.length-1; if(st.value>nmax) st.set(nmax); st.el.max=nmax;
      var user=mode.value==="u", s=user?Math.min(us,nmax):Math.min(st.value,nmax), curM=steps[s];
      st.el.parentNode.style.display=user?"none":""; opt.forEach(function(b){ b.style.display=user&&s<nmax?"":"none"; });
      if(user&&s<nmax){ var oo=options(steps[s+1]); var perm=[0,1,2,3]; var rng=M6.rng(7*s+3+sel.value.charCodeAt(0)); perm.sort(function(){ return rng()-0.5; }); cur={opts:oo,perm:perm,step:steps[s+1]}; opt.forEach(function(b,i){ b.textContent=oo.o[perm[i]][0]; }); } else cur=null;
      /* en-tête */
      S.draw.label(c,sy.n,12,20,{align:"left",size:fsz,color:P.mat});
      S.draw.text(c,user?"à toi de jouer : étape "+s+" sur "+nmax:"étape "+s+" sur "+nmax,W-12,20,{align:"right",size:M6.fs(c,12),color:P.grey});
      /* matrice augmentée */
      var cw=Math.min(74,(W-90)/4), rh=Math.min(48,H*0.115), ox=(W-cw*4)/2+8, oy=62;
      var names=["x","y","z",""]; names.forEach(function(nm,j){ if(nm) S.draw.text(c,nm,ox+cw*j+cw/2,oy-16,{size:fsz+1,color:P.grey,math:true,italic:true}); }); S.draw.text(c,"second membre",ox+cw*3.5,oy-16,{size:11,color:P.grey});
      for(var i=0;i<3;i++){
        var y=oy+i*rh, hi=curM.hi.indexOf(i)>=0;
        if(hi){ ctx.fillStyle=S.draw.tint(P.yellow,0.25+0.5*flash); S.draw.rrect(c,ox-30,y,cw*4+38,rh-4,9); ctx.fill(); }
        S.draw.text(c,"L"+(i+1),ox-14,y+rh/2-2,{size:fsz,color:P.grey,align:"center"});
        for(var j=0;j<4;j++){ var v=curM.M[i][j], z0=fz(v), tri=(j<i&&z0&&s===nmax); ctx.font="600 "+(fsz+4)+"px 'JetBrains Mono', ui-monospace, monospace"; S.draw.text(c,fs(v),ox+cw*j+cw/2,y+rh/2-2,{size:fsz+4,mono:true,color:tri?P.green:(z0?"#b8c0cc":P.ink),weight:600}); }
      }
      S.draw.line(c,ox+cw*3,oy-2,ox+cw*3,oy+rh*3-6,P.ink,2.2);
      ctx.strokeStyle=P.ink; ctx.lineWidth=2; [[ox-30,1],[ox+cw*4+8,-1]].forEach(function(br){ ctx.beginPath(); ctx.moveTo(br[0]+br[1]*7,oy-2); ctx.lineTo(br[0],oy-2); ctx.lineTo(br[0],oy+rh*3-6); ctx.lineTo(br[0]+br[1]*7,oy+rh*3-6); ctx.stroke(); });
      /* pivots */
      if(s===nmax&&!(user&&false)){ [0,1,2].forEach(function(i2){ for(var j2=0;j2<3;j2++){ if(!fz(curM.M[i2][j2])){ if(j2>=i2){ ctx.strokeStyle=S.draw.tint(P.red,0.6); ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(ox+cw*j2+cw/2,oy+i2*rh+rh/2-2,15,0,6.2832); ctx.stroke(); } break; } } }); }
      var ty=oy+rh*3+14, tw=W-24;
      ctx.font="700 "+fsz+"px Mulish, sans-serif";
      var opLabel=user?(cur?"Prochaine étape : "+cur.opts.q:(s===nmax?"Le système est triangulaire : lis la solution.":"")):(s===0?"Système de départ : appuie sur l'étape suivante.":"Opération effectuée : "+curM.d);
      var ls=wrapText(ctx,opLabel,tw); ls.forEach(function(l,i3){ S.draw.text(c,l,12,ty+i3*(fsz+6),{size:fsz,align:"left",color:P.ink}); });
      var ty2=ty+ls.length*(fsz+6)+6;
      if(user&&fb){ ctx.font="600 "+(fsz-1)+"px Mulish, sans-serif"; var fl=wrapText(ctx,fb,tw); fl.forEach(function(l,i4){ S.draw.text(c,l,12,ty2+i4*(fsz+4),{size:fsz-1,align:"left",color:fbOk?P.green:P.red}); }); ty2+=fl.length*(fsz+4)+6; }
      if(s===nmax){ ctx.font="600 "+(fsz-0.5)+"px Mulish, sans-serif"; var rd=wrapText(ctx,reading(curM.M),tw-12); var bh=rd.length*(fsz+4)+14; S.draw.panel(c,8,Math.min(ty2,H-bh-8),W-16,bh,{fill:"#eef6f1",stroke:"#bfdccd",shadow:false}); rd.forEach(function(l,i5){ S.draw.text(c,l,16,Math.min(ty2,H-bh-8)+13+i5*(fsz+4),{size:fsz-0.5,align:"left",color:"#1c4d3b"}); }); }
      if(user&&s===nmax) nt.set("Bravo : tu as triangularisé le système en "+nmax+" opérations. Change de système pour recommencer.","ok");
      else if(user) nt.set("Choisis l'opération (boutons du panneau de commandes) : une bonne réponse fait avancer la matrice.","warn");
      else nt.set("Fais avancer le curseur « Étape » : chaque étape applique une opération sur les lignes.","ok");
    });
  }
});

SFA.sim({
  id:"m6-c06-parametre", ch:"c06", tag:"Paramètre · 6 h",
  titre:"Un paramètre m : quand le système change de nature",
  resume:"Fais glisser m : déterminant, solution unique, droite de solutions ou système impossible, avec les trois plans dans l'espace.",
  but:"Système : x + y + z = 1 ; x + m·y + z = 2 ; x + y + m²·z = 1. Fais glisser m (curseur, ou point sur la courbe de D(m)) et repère les valeurs critiques où le déterminant s'annule : les trois plans changent de position.",
  aRetenir:"Le déterminant des coefficients vaut D(m) = (m − 1)²(m + 1). Si D(m) ≠ 0 : une seule solution, ici ((m − 2)/(m − 1) ; 1/(m − 1) ; 0). Aux valeurs critiques m = 1 et m = −1, il faut <i>étudier</i> le système : pour m = 1 il est impossible, pour m = −1 il est indéterminé (une droite de solutions). Discussion à paramètre : extension 6 h.",
  piege:"D(m) = 0 ne veut pas dire « pas de solution » : cela veut dire « pas de solution <i>unique</i> ». Il faut vérifier chaque valeur critique séparément, avec le second membre.",
  build:function(k,S){
    var c=M6.canvas(k,1.1,440), P=S.draw.palette;
    var top={ctx:c.ctx,get W(){return c.W;},get H(){return Math.round(c.H*0.62);}}, v=M6.cam3(top,S,{L:4,yaw:-0.7,pitch:0.4,dist:8});
    var m=k.slider("Paramètre m",-3,3,0.25,0,"",null);
    var ro=k.readouts(["Déterminant D","Nature","Solution (x ; y ; z)"]);
    var nt=k.note("","ok"), g=null;
    function D(x){return (x-1)*(x-1)*(x+1);}
    k.draw(function(){
      c.clear(); var M=m.value, ctx=c.ctx, W=c.W, H=c.H, fs=M6.fs(c,12), h1=top.H;
      v.box({ticks:false});
      var cols=[P.mat,P.red,P.green], eqs=[[[1,1,1],1],[[1,M,1],2],[[1,1,M*M],1]];
      eqs.forEach(function(e,i){ v.plane(e[0],e[1],cols[i],{alpha:0.16,lw:1.6}); });
      if(Math.abs(M-1)<1e-9) { /* P1 et P3 confondus, P2 parallèle */ }
      if(Math.abs(M+1)<1e-9){ v.seg([1.5,-0.5,0],[-1,0,1],"#13233a",4.2); }
      else if(Math.abs(M-1)>1e-9){ var y=1/(M-1), x=(M-2)/(M-1), X=[x,y,0]; if(v.inBox(X)){ var q=v.dot(X,8,"#13233a"); S.draw.label(c,"solution",q.x+12,q.y+16,{color:P.ink,align:"left",size:fs}); } }
      S.draw.legend(c,[[P.mat,"x + y + z = 1"],[P.red,"x + m·y + z = 2"],[P.green,"x + y + m²·z = 1"]],8,8);
      v.hint("Glisse pour tourner");
      ctx.save(); ctx.translate(0,h1+4); var sub={W:W,H:H-h1-4,ctx:ctx,clear:c.clear};
      var ax=S.draw.axes(sub,{x0:-3,x1:3,y0:-35,y1:20,xl:"m",yl:"D(m)",stepX:1,stepY:10,b:26});
      S.draw.fn(sub,ax,D,P.mat,3);
      [-1,1].forEach(function(r){ S.draw.dot(sub,ax.X(r),ax.Y(0),5.5,P.amber); S.draw.label(sub,"m = "+S.fmt(r,0),ax.X(r),ax.Y(0)+(r<0?-16:18),{size:fs,color:P.amber}); });
      S.draw.line(sub,ax.X(M),ax.Y(0),ax.X(M),ax.Y(D(M)),P.red,1.4,[4,4]); M6.handle(S,sub,ax.X(M),ax.Y(D(M)),P.red,false,8);
      ctx.restore(); g={ax:ax,y0:h1+4};
      ro.set(0,S.fmt(D(M),3));
      if(Math.abs(M-1)<1e-9){ ro.set(1,"impossible"); ro.set(2,"aucune"); nt.set("m = 1 : les trois plans sont parallèles (même normale) : x + y + z = 1 (deux fois) et x + y + z = 2. Contradiction, aucun point commun.","warn"); }
      else if(Math.abs(M+1)<1e-9){ ro.set(1,"indéterminé (droite)"); ro.set(2,"(3/2 − t ; −1/2 ; t)"); nt.set("m = −1 : les plans 1 et 3 sont confondus (x + y + z = 1) ; avec le 2e on trouve y = −1/2 et x + z = 3/2 : les trois plans se coupent suivant une droite.","ok"); }
      else { var y2=1/(M-1), x2=(M-2)/(M-1); ro.set(1,"solution unique"); ro.set(2,"("+S.fmt(x2,3)+" ; "+S.fmt(y2,3)+" ; 0)"); nt.set("D(m) ≠ 0 : une seule solution, point d'intersection des trois plans. Vérifie avec la 2e équation : x + m·y + z = "+S.fmt(x2+M*y2,3)+"."+(v.inBox([x2,y2,0])?"":" Le point est hors du cube dessiné."),"ok"); }
    });
    var last=null, mdrag=false;
    c.pointer(function(type,p){
      if(!g) return;
      if(type==="down"){ mdrag=p.y>top.H; last=p; }
      if((type==="down"||type==="drag")&&mdrag){ var mv=M6.clamp(g.ax.ix(p.x),-3,3), sn=Math.round(mv*4)/4; if(Math.abs(mv-sn)<0.07) mv=sn; else mv=Math.round(mv*20)/20; m.set(mv); k.redraw(); }
      else if(type==="drag"&&last){ v.yaw+=(p.x-last.x)*0.011; v.pitch=M6.clamp(v.pitch+(p.y-last.y)*0.011,-1.2,1.45); last=p; k.redraw(); }
      if(type==="up") last=null;
    });
  }
});

SFA.sim({
  id:"m6-c06-melange", ch:"c06", tag:"Modélisation · Niche utile",
  titre:"Fabriquer un alliage avec trois fournisseurs",
  resume:"Place ton alliage cible dans le triangle : les quantités à mélanger sont les coordonnées barycentriques.",
  but:"Un alliage contient du cuivre, du zinc et de l'étain. Trois alliages sources A, B, C sont disponibles. Place le point cible dans le triangle (souris ou curseurs) : le système 3×3 donne les kilogrammes de A, B et C à mélanger.",
  aRetenir:"Mettre en équation : une équation par métal (cuivre, zinc, étain) et trois inconnues (kg de A, de B, de C). La solution doit être positive pour être réalisable : on ne peut pas « retirer » du A. Graphiquement, c'est possible seulement si la cible est à l'intérieur du triangle ABC.",
  piege:"Une solution mathématique n'est pas toujours une solution physique : si une inconnue est négative, le système est résolu mais le problème est impossible.",
  build:function(k,S){
    var c=M6.canvas(k,1.0,420), P=S.draw.palette;
    var cu=k.slider("Cuivre dans la cible",5,90,1,35,"%",null), zn=k.slider("Zinc dans la cible",5,90,1,30,"%",null);
    var mass=k.slider("Masse à fabriquer",50,200,10,100,"kg",null);
    var ro=k.readouts(["Étain (calculé)","Alliage A","Alliage B","Alliage C"]);
    var nt=k.note("","ok");
    var Al=[[0.6,0.3,0.1],[0.2,0.5,0.3],[0.1,0.2,0.7]], nm=["A","B","C"];
    var geo=null;
    function pt(g,f){ return {x:f[0]*g.vc.x+f[1]*g.vz.x+f[2]*g.vs.x, y:f[0]*g.vc.y+f[1]*g.vz.y+f[2]*g.vs.y}; }
    function geom(){ var W=c.W,H=c.H, gh=Math.round(H*0.72); return {vc:{x:W/2,y:36},vz:{x:46,y:gh-30},vs:{x:W-46,y:gh-30},gh:gh}; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, g=geom(), W=c.W, H=c.H, fs=M6.fs(c,12); geo=g;
      var cuf=cu.value/100, znf=zn.value/100, snf=1-cuf-znf;
      ctx.save(); ctx.strokeStyle="#dfe5f0"; ctx.lineWidth=1;
      for(var i=1;i<5;i++){ var f=i/5; [[0,1,2],[1,2,0],[2,0,1]].forEach(function(p){ var a=[0,0,0],b=[0,0,0]; a[p[0]]=f; a[p[1]]=1-f; b[p[0]]=f; b[p[2]]=1-f; var A=pt(g,a),B=pt(g,b); ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke(); }); }
      ctx.fillStyle="#f8fafd"; ctx.beginPath(); ctx.moveTo(g.vc.x,g.vc.y); ctx.lineTo(g.vz.x,g.vz.y); ctx.lineTo(g.vs.x,g.vs.y); ctx.closePath(); ctx.globalCompositeOperation="destination-over"; ctx.fill(); ctx.globalCompositeOperation="source-over";
      ctx.strokeStyle="#13233a"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(g.vc.x,g.vc.y); ctx.lineTo(g.vz.x,g.vz.y); ctx.lineTo(g.vs.x,g.vs.y); ctx.closePath(); ctx.stroke(); ctx.restore();
      S.draw.text(c,"100 % cuivre",g.vc.x,g.vc.y-16,{size:fs}); S.draw.text(c,"100 % zinc",g.vz.x+14,g.vz.y+18,{size:fs}); S.draw.text(c,"100 % étain",g.vs.x-14,g.vs.y+18,{size:fs});
      var pa=Al.map(function(f){return pt(g,f);});
      ctx.save(); ctx.beginPath(); ctx.moveTo(pa[0].x,pa[0].y); ctx.lineTo(pa[1].x,pa[1].y); ctx.lineTo(pa[2].x,pa[2].y); ctx.closePath(); ctx.fillStyle=S.draw.tint(P.green,0.16); ctx.fill(); ctx.strokeStyle=P.green; ctx.lineWidth=1.8; ctx.stroke(); ctx.restore();
      pa.forEach(function(p,i){ S.draw.dot(c,p.x,p.y,6,P.green); S.draw.label(c,nm[i],p.x+(i===1?-14:(i===2?14:0)),p.y+(i===0?-16:14),{color:P.green,size:fs+1}); });
      var ok=snf>=-1e-9, T=ok?pt(g,[cuf,znf,snf]):null;
      var M=[[Al[0][0],Al[1][0],Al[2][0]],[Al[0][1],Al[1][1],Al[2][1]],[Al[0][2],Al[1][2],Al[2][2]]], t=[cuf*mass.value,znf*mass.value,snf*mass.value];
      function det3(m){ return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]); }
      var D=det3(M), x=[0,1,2].map(function(j){ var Mj=M.map(function(r,i){ var rr=r.slice(); rr[j]=t[i]; return rr; }); return det3(Mj)/D; });
      ro.set(0,S.fmt(snf*100,0)+" %");
      /* barres : kilogrammes à prendre de chaque alliage */
      var by=g.gh+8, bh=Math.max(14,Math.round((H-by-10)/3)-6), lx=34, rx=W-14, cols=[P.green,P.green,P.green];
      for(i=0;i<3;i++){ var y=by+i*(bh+6), v=ok?x[i]:0, w=(rx-lx)*Math.max(0,v)/Math.max(mass.value,1);
        S.draw.text(c,nm[i],lx-12,y+bh/2,{size:fs+1,color:P.green,weight:800});
        ctx.fillStyle="#eef1f5"; ctx.fillRect(lx,y,rx-lx,bh); ctx.fillStyle=v<-1e-9?P.red:P.green; ctx.fillRect(lx,y,Math.max(0,Math.min(rx-lx,w)),bh);
        if(ok) S.draw.text(c,S.fmt(v,1)+" kg",lx+8,y+bh/2,{size:fs,align:"left",color:w>60?"#fff":P.ink}); }
      if(!ok){ ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("Cuivre + zinc dépassent 100 % : l'étain serait négatif. Diminue l'un des deux.","warn"); S.draw.text(c,"cible impossible (étain négatif)",W/2,g.gh/2,{size:fs+1,color:P.red}); return; }
      M6.handle(S,c,T.x,T.y,P.red,false,9); S.draw.label(c,"cible",T.x+16,T.y-14,{size:fs,color:P.red,align:"left"});
      for(i=0;i<3;i++) ro.set(i+1,"<span style='color:"+(x[i]<-1e-9?"#b42318":"inherit")+"'>"+S.fmt(x[i],1)+" kg</span>");
      var neg=x.some(function(z){return z<-1e-9;});
      if(neg) nt.set("Une quantité est négative : la cible est en dehors du triangle ABC, ce mélange est impossible avec ces trois alliages.","warn");
      else nt.set("Réalisable : A + B + C = "+S.fmt(x[0]+x[1]+x[2],1)+" kg. Vérifie le cuivre : "+S.fmt(0.6*x[0]+0.2*x[1]+0.1*x[2],1)+" kg = "+S.fmt(t[0],1)+" kg ✓","ok");
    });
    c.pointer(function(type,p){ if((type==="down"||type==="drag")&&geo){ var g=geo, den=(g.vz.y-g.vs.y)*(g.vc.x-g.vs.x)+(g.vs.x-g.vz.x)*(g.vc.y-g.vs.y);
      var a=((g.vz.y-g.vs.y)*(p.x-g.vs.x)+(g.vs.x-g.vz.x)*(p.y-g.vs.y))/den, b=((g.vs.y-g.vc.y)*(p.x-g.vs.x)+(g.vc.x-g.vs.x)*(p.y-g.vs.y))/den;
      a=Math.max(0.05,Math.min(0.9,a)); b=Math.max(0.05,Math.min(0.9,b)); if(a+b>0.95){ var s=0.95/(a+b); a*=s; b*=s; }
      cu.set(Math.round(a*100)); zn.set(Math.round(b*100)); k.redraw(); } if(type==="move") c.cv.style.cursor="crosshair"; });
  }
});
