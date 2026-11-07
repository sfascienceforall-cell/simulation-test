/* Chapitre 8 : analyse combinatoire et binôme de Newton */
function fact(n){ var r=1; for(var i=2;i<=n;i++) r*=i; return r; }
function Aar(n,k){ var r=1; for(var i=0;i<k;i++) r*=(n-i); return r; }
function Cbin(n,k){ if(k<0||k>n) return 0; k=Math.min(k,n-k); var r=1; for(var i=1;i<=k;i++) r=r*(n-k+i)/i; return Math.round(r); }
var big=function(S,x){ return M6.int(x); };

SFA.sim({
  id:"m6-c08-arbre", ch:"c08", tag:"Classique",
  titre:"L'arbre des choix : compter les chemins",
  resume:"Choisis n objets et k places : l'arbre se déploie et le nombre de feuilles est le nombre de cas.",
  but:"Choisis n, k, avec ou sans répétition. Chaque chemin de l'arbre est une façon de choisir : clique sur une feuille pour le mettre en gras. Si l'ordre ne compte pas, les chemins qui utilisent les mêmes lettres ont la même couleur.",
  aRetenir:"Principe multiplicatif : si on fait des choix successifs, on multiplie les nombres de possibilités. Sans répétition : A(n ; k) = n·(n−1)·…·(n−k+1) arrangements. Si l'ordre ne compte pas, chaque groupe de k lettres est compté k! fois : C(n ; k) = A(n ; k) / k!. Avec répétition : n<sup>k</sup>.",
  piege:"On additionne seulement des cas qui s'excluent (« ou »). Pour des choix qui se suivent (« et »), on multiplie. Et 0! = 1, pas 0.",
  build:function(k,S){
    var c=M6.canvas(k,.95,400), P=S.draw.palette;
    var n=k.slider("Nombre d'objets n",2,5,1,4,"",null), kk=k.slider("Nombre de choix k",1,3,1,2,"",null);
    var rep=k.toggle("Avec répétition (on peut reprendre le même objet)",false);
    var ordre=k.seg("L'ordre compte-t-il ?",[["o","Oui (arrangement)"],["n","Non (combinaison)"]],"o");
    var idx=k.slider("Chemin n° (en gras)",1,60,1,1,"",null);
    var ro=k.readouts(["Nombre de chemins","Calcul","Groupes (ordre ignoré)","Chemin en gras"]);
    var nt=k.note("","ok"), geo=null;
    function paths(N,K,R){ var out=[]; (function rec(cur){ if(cur.length===K){ out.push(cur.slice()); return; } for(var i=0;i<N;i++){ if(!R&&cur.indexOf(i)>=0) continue; cur.push(i); rec(cur); cur.pop(); } })([]); return out; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, N=n.value, K=kk.value, R=rep.value;
      if(!R&&K>N){ K=N; kk.set(N); }
      var ps=paths(N,K,R), cnt=ps.length;
      idx.el.max=cnt; if(idx.value>cnt) idx.set(cnt);
      var letters="ABCDE", sel=Math.max(1,Math.min(cnt,idx.value))-1;
      var W=c.W,H=c.H, L=22, Rm=Math.min(70,W*0.18), T=34, B=44, dx=(W-L-Rm)/K, dy=(H-T-B)/Math.max(1,cnt-1), fs=M6.fs(c,12);
      var colorOf={}, ng=0;
      function key(p){ return R?p.join(","):p.slice().sort().join(","); }
      ps.forEach(function(p){ var q=key(p); if(!(q in colorOf)){ colorOf[q]=ng++; } });
      var useGroups=(ordre.value==="n"&&!R);
      function col(p){ if(!useGroups) return P.mat; var h=Math.round(colorOf[key(p)]*360/Math.max(1,ng)); return "hsl("+h+",62%,42%)"; }
      var drawn={}, ys=[];
      ps.forEach(function(p,j){ var y=T+(cnt>1?j*dy:(H-T-B)/2); ys.push(y);
        for(var lv=1;lv<=K;lv++){ var pref=p.slice(0,lv).join("-"); if(!drawn[pref]) drawn[pref]={ys:[]}; drawn[pref].ys.push(y); } });
      function ny(pref){ var d=drawn[pref]; return d.ys.reduce(function(a,b){return a+b;},0)/d.ys.length; }
      var mid=T+(H-T-B)/2;
      ctx.save(); ctx.lineWidth=1.3; ctx.strokeStyle="#cfd6e4";
      Object.keys(drawn).forEach(function(pref){ var arr=pref.split("-").map(Number), lv=arr.length, y1=ny(pref), x1=L+lv*dx, x0=L+(lv-1)*dx, y0=lv===1?mid:ny(arr.slice(0,lv-1).join("-")); ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); });
      ctx.restore();
      var rd=cnt>40?2.5:(cnt>20?3.8:5.5);
      ps.forEach(function(p,j){ var y=ys[j]; S.draw.dot(c,L+K*dx,y,rd,col(p)); if(cnt<=24) S.draw.text(c,p.map(function(i){return letters[i];}).join(""),L+K*dx+11,y,{size:fs+(cnt<=12?1:0),align:"left",color:col(p)}); });
      var sp=ps[sel], pts=[[L,mid]]; for(var lv=1;lv<=K;lv++){ pts.push([L+lv*dx,ny(sp.slice(0,lv).join("-"))]); }
      ctx.save(); ctx.strokeStyle=P.red; ctx.lineWidth=3.6; ctx.lineJoin="round"; ctx.beginPath(); pts.forEach(function(q,i){ if(i===0) ctx.moveTo(q[0],q[1]); else ctx.lineTo(q[0],q[1]); }); ctx.stroke(); ctx.restore();
      pts.forEach(function(q,i){ if(i>0){ ctx.fillStyle="#fff"; ctx.strokeStyle=P.red; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(q[0],q[1],10,0,6.2832); ctx.fill(); ctx.stroke(); S.draw.text(c,letters[sp[i-1]],q[0],q[1]+0.5,{size:12.5,color:P.red}); } });
      S.draw.dot(c,L,mid,6,P.ink); S.draw.text(c,"départ",L+4,mid-16,{size:fs,align:"left",color:P.grey});
      for(lv=1;lv<=K;lv++) S.draw.text(c,(dx>150?"choix n° "+lv+" : "+(R?N:N-lv+1)+" possibilité"+((R?N:N-lv+1)>1?"s":""):"choix "+lv+" : "+(R?N:N-lv+1)),L+lv*dx-dx/2,H-B+22,{size:fs,color:P.grey});
      var calc=[]; for(var i=0;i<K;i++) calc.push(R?N:(N-i)); var total=R?Math.pow(N,K):Aar(N,K);
      ro.set(0,big(S,cnt)); ro.set(1,calc.join(" × ")+" = "+big(S,total));
      var word=sp.map(function(i){return letters[i];}).join("");
      ro.set(3,word);
      M6.tag(S,c,cnt+" chemins",10,18,P.mat,{size:M6.fs(c,12.5)});
      geo={ys:ys,x:L+K*dx,L:L,dx:dx,T:T,B:B};
      if(R){ ro.set(2,"—"); nt.set(ordre.value==="n"?"Les combinaisons avec répétition ne sont pas traitées ici : l'arbre montre les listes ordonnées, n<sup>k</sup> = "+big(S,total)+".":"Avec répétition, à chaque étape il reste n choix : n<sup>k</sup> = "+N+"<sup>"+K+"</sup> = "+big(S,total)+".","ok"); }
      else { ro.set(2,useGroups?(big(S,Cbin(N,K))+" = "+big(S,total)+" / "+K+"!"):"—");
        nt.set(useGroups?"Même couleur = mêmes lettres dans un autre ordre. Chaque groupe est vu k! = "+fact(K)+" fois : "+big(S,total)+" / "+fact(K)+" = "+big(S,Cbin(N,K))+" combinaisons C("+N+" ; "+K+").":"Sans répétition, le nombre de choix diminue de 1 à chaque étape : A("+N+" ; "+K+") = "+big(S,total)+".","ok"); }
    });
    c.pointer(function(type,p){ if(!geo) return; if(type==="move"){ c.cv.style.cursor=p.x>geo.x-20?"pointer":"default"; return; }
      if((type==="down"||type==="drag")&&p.x>geo.x-24){ var best=0,bd=1e9; geo.ys.forEach(function(y,i){ var d=Math.abs(y-p.y); if(d<bd){bd=d;best=i;} }); idx.set(best+1); k.redraw(); } });
  }
});

SFA.sim({
  id:"m6-c08-pascal", ch:"c08", tag:"Classique",
  titre:"Le triangle de Pascal et le binôme de Newton",
  resume:"Clique sur une case : elle est la somme des deux cases au-dessus, et ses voisines donnent (a + b)ⁿ.",
  but:"Clique sur une case du triangle (ligne n, colonne k). Les deux cases du dessus s'allument et la ligne n donne les coefficients du développement de (a + b)ⁿ.",
  aRetenir:"C(n ; k) = C(n−1 ; k−1) + C(n−1 ; k). Les valeurs C(n ; k) = n! / (k!·(n−k)!) sont les coefficients de (a + b)<sup>n</sup> = Σ C(n ; k)·a<sup>n−k</sup>·b<sup>k</sup>. La somme de la ligne n vaut 2<sup>n</sup> et le triangle est symétrique : C(n ; k) = C(n ; n−k).",
  piege:"La première ligne est la ligne n = 0 (et la première colonne k = 0) : C(4 ; 2) = 6 est dans la 5e ligne si on compte à partir de 1. Et (a + b)² ≠ a² + b² : il y a le terme 2ab.",
  build:function(k,S){
    var c=M6.canvas(k,.86,360), P=S.draw.palette;
    var nrow=k.slider("Ligne n du binôme",0,9,1,4,"",null);
    var par=k.toggle("Colorer les nombres pairs et impairs",false);
    var ro=k.readouts(["Case choisie","Valeur","Somme de la ligne n","(a + b)ⁿ développé"]);
    var sel={n:4,k:2}, geo=null;
    k.draw(function(){
      c.clear(); var ctx=c.ctx, rows=10, W=c.W, H=c.H, cw=Math.min(56,(W-64)/rows), rh=(H-34)/rows, fs=M6.fs(c,cw<34?12:14);
      var X=function(n,kk){ return W/2+8+(kk-n/2)*cw; }, Y=function(n){ return 22+n*rh; };
      geo={X:X,Y:Y,cw:cw,rh:rh,rows:rows};
      for(var n=0;n<rows;n++){ S.draw.text(c,"n="+n,6,Y(n),{size:11,align:"left",color:n===nrow.value?P.mat:P.grey,weight:n===nrow.value?800:600});
        for(var kk=0;kk<=n;kk++){
          var v=Cbin(n,kk), inRow=(n===nrow.value), isSel=(n===sel.n&&kk===sel.k), isPar=(n===sel.n-1&&(kk===sel.k||kk===sel.k-1)), bw=cw-4, bh=rh-4;
          var heat=Math.log(v)/Math.log(126), fill=isSel?P.mat:isPar?P.yellow:inRow?"#dbe5fb":(par.value?(v%2?S.draw.tint(P.mat,0.16):"#f4f6fa"):S.draw.tint(P.mat,0.04+0.14*heat));
          ctx.fillStyle=fill; S.draw.rrect(c,X(n,kk)-bw/2,Y(n)-bh/2,bw,bh,5); ctx.fill();
          if(isSel||isPar){ ctx.strokeStyle=isSel?"#13233a":"#c9a21f"; ctx.lineWidth=1.6; ctx.stroke(); }
          S.draw.text(c,String(v),X(n,kk),Y(n),{size:fs,color:isSel?"#ffffff":P.ink,mono:true,weight:600}); } }
      if(sel.n>0&&sel.k>0&&sel.k<sel.n){ [sel.k-1,sel.k].forEach(function(pk){ S.draw.arrow(c,X(sel.n-1,pk)+(pk===sel.k?-3:3),Y(sel.n-1)+rh*0.32,X(sel.n,sel.k)+(pk===sel.k?3:-3),Y(sel.n)-rh*0.34,P.amber,1.8); }); }
      var N=nrow.value, terms=[];
      for(var j=0;j<=N;j++){ var co=Cbin(N,j), a=N-j, b=j, t=(co===1?"":co)+(a>0?"a"+(a>1?"<sup>"+a+"</sup>":""):"")+(b>0?"b"+(b>1?"<sup>"+b+"</sup>":""):""); if(t==="") t="1"; terms.push(t); }
      ro.set(0,"n = "+sel.n+", k = "+sel.k); ro.set(1,"C("+sel.n+" ; "+sel.k+") = "+Cbin(sel.n,sel.k)+(sel.n>0&&sel.k>0&&sel.k<sel.n?" = "+Cbin(sel.n-1,sel.k-1)+" + "+Cbin(sel.n-1,sel.k):""));
      ro.set(2,"2<sup>"+N+"</sup> = "+Math.pow(2,N)); ro.set(3,"(a + b)<sup>"+N+"</sup> = "+terms.join(" + "));
    });
    c.pointer(function(type,p){ if(!geo) return; var best=null,bd=1e9; for(var n=0;n<geo.rows;n++) for(var kk=0;kk<=n;kk++){ var d=Math.hypot(geo.X(n,kk)-p.x,geo.Y(n)-p.y); if(d<bd){bd=d;best={n:n,k:kk};} }
      if(type==="move"){ c.cv.style.cursor=best&&bd<geo.cw?"pointer":"default"; return; }
      if((type==="down"||type==="drag")&&best&&bd<geo.cw){ sel=best; nrow.set(best.n); k.redraw(); } });
  }
});

SFA.sim({
  id:"m6-c08-arrangement-combinaison", ch:"c08", tag:"Arrangement ou combinaison ?",
  titre:"Podium ou comité : l'ordre change tout",
  resume:"Compare A(n ; k) et C(n ; k) : le rapport est exactement k!.",
  but:"Choisis n personnes et k places. En mode « podium » l'ordre compte (arrangement), en mode « comité » il ne compte pas (combinaison). Tire un groupe au hasard, puis permute-le : au podium chaque ordre est un cas différent. Le graphique montre C(n ; k) pour tous les k.",
  aRetenir:"A(n ; k) = n! / (n−k)! quand l'ordre compte ; C(n ; k) = n! / (k!·(n−k)!) quand il ne compte pas ; A(n ; k) = k!·C(n ; k). Les permutations de n objets : n! = A(n ; n). La valeur maximale de C(n ; k) se trouve au milieu (k ≈ n/2).",
  piege:"Pour savoir si l'ordre compte, imagine d'échanger deux choisis : si la situation change (1er et 2e d'un podium), c'est un arrangement ; si elle reste la même (membres d'un comité), c'est une combinaison.",
  build:function(k,S){
    var c=M6.canvas(k,.9,390), P=S.draw.palette;
    var n=k.slider("n (personnes)",1,12,1,10,"",null), kk=k.slider("k (places)",0,12,1,3,"",null);
    var mode=k.seg("Situation",[["p","Podium (ordre)"],["c","Comité (sans ordre)"]],"p");
    var pick=[], rng=M6.rng(11), perm=0;
    function draw1(){ var N=n.value, K=Math.min(kk.value,N), pool=[]; for(var i=0;i<N;i++) pool.push(i); pick=[]; for(i=0;i<K;i++){ pick.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); } perm++; }
    function shuffle(){ for(var i=pick.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=pick[i]; pick[i]=pick[j]; pick[j]=t; } perm++; }
    k.button("Tirer un groupe au hasard",function(){ draw1(); },true);
    k.button("Permuter le groupe",function(){ shuffle(); });
    var ro=k.readouts(["Réponse","A(n ; k)","C(n ; k)","k! = A / C"]);
    var nt=k.note("","warn");
    var names="ABCDEFGHIJKL";
    k.draw(function(){
      c.clear(); var ctx=c.ctx, N=n.value, K=kk.value, W=c.W, H=c.H, fs=M6.fs(c,12);
      if(K>N){ kk.set(N); K=N; }
      if(pick.length!==K||pick.some(function(p){ return p>=N; })){ pick=[]; var pool=[]; for(var i0=0;i0<N;i0++) pool.push(i0); for(i0=0;i0<K;i0++) pick.push(pool.splice(Math.floor(rng()*pool.length),1)[0]); }
      /* personnes : rangée du haut ; podium ou comité : au milieu */
      var rows=N>7?2:1, per=Math.ceil(N/rows), pr=Math.min(17,(W-24)/per/2.1), top=34;
      for(var i=0;i<N;i++){ var r=Math.floor(i/per), q=i%per, x=W/2+(q-(per-1)/2)*pr*2.3, y=top+r*pr*2.7, chosen=pick.indexOf(i)>=0;
        ctx.fillStyle=chosen?P.mat:"#e3e8f1"; ctx.beginPath(); ctx.arc(x,y,pr,0,6.2832); ctx.fill();
        S.draw.text(c,names[i],x,y+0.5,{size:Math.max(11,pr*0.85),color:chosen?"#fff":"#5f6b7a",weight:800}); }
      S.draw.text(c,N+" personnes",12,16,{size:fs,align:"left",color:P.grey,weight:700});
      var zy=top+rows*pr*2.7+14, zh=Math.min(110,H*0.27);
      if(K>0){
        if(mode.value==="p"){
          var bw=Math.min(54,(W-30)/Math.max(K,3)), tot=K*bw, x0=(W-tot)/2;
          for(var p=0;p<K;p++){ var h=zh*(K>1?(1-0.55*p/(K-1)):1)*0.78, bx=x0+p*bw; ctx.fillStyle=p===0?"#f1c40f":(p===1?"#c0c7d1":(p===2?"#cd8b52":"#dfe4ec")); ctx.fillRect(bx+2,zy+zh-h,bw-4,h);
            S.draw.text(c,String(p+1),bx+bw/2,zy+zh-h/2,{size:fs+3,color:"#fff",weight:800}); var who=pick[p]; ctx.fillStyle=P.mat; ctx.beginPath(); ctx.arc(bx+bw/2,zy+zh-h-14,10,0,6.2832); ctx.fill(); S.draw.text(c,names[who],bx+bw/2,zy+zh-h-13.5,{size:11.5,color:"#fff",weight:800}); }
          S.draw.text(c,"podium : "+pick.map(function(i){return names[i];}).join(" › ")+(perm>0?" (permutation n° "+perm+")":""),W/2,zy+zh+12,{size:fs,color:P.ink});
        } else {
          var cx=W/2, cy=zy+zh/2, R=Math.min(zh/2,70); ctx.strokeStyle=S.draw.tint(P.green,0.6); ctx.fillStyle=S.draw.tint(P.green,0.1); ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.ellipse(cx,cy,Math.max(60,K*16),R*0.8,0,0,6.2832); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
          var sorted=pick.slice().sort(function(a,b){return a-b;}); sorted.forEach(function(who,i){ var ang=i/Math.max(1,K)*6.2832-1.5708, rx=Math.max(60,K*16)-18, ry=R*0.8-14, x=cx+Math.cos(ang)*rx*(K>1?1:0), y=cy+Math.sin(ang)*ry*(K>1?1:0); ctx.fillStyle=P.green; ctx.beginPath(); ctx.arc(x,y,11,0,6.2832); ctx.fill(); S.draw.text(c,names[who],x,y+0.5,{size:11.5,color:"#fff",weight:800}); });
          S.draw.text(c,"comité : {"+sorted.map(function(i){return names[i];}).join(", ")+"} : l'ordre ne change rien",W/2,zy+zh+12,{size:fs,color:P.ink});
        }
      }
      /* diagramme en barres de C(n ; k) */
      var vals=[]; for(var j=0;j<=N;j++) vals.push(Cbin(N,j)); var mx=Math.max.apply(null,vals);
      var by0=zy+zh+40, L=36,Rm=12,B=26, bwid=(W-L-Rm)/(N+1), hh=H-by0-B;
      S.draw.text(c,"C("+N+" ; k) pour k = 0 … "+N,L,by0-4,{size:fs,align:"left",color:P.grey,weight:700});
      ctx.strokeStyle="#a3adba"; ctx.beginPath(); ctx.moveTo(L,by0+4); ctx.lineTo(L,by0+hh); ctx.lineTo(W-Rm,by0+hh); ctx.stroke();
      vals.forEach(function(v,i){ var h=(hh-8)*v/mx, x=L+i*bwid; ctx.fillStyle=(i===K)?P.red:"#9fb4e3"; ctx.fillRect(x+2,by0+hh-h,bwid-4,h); S.draw.text(c,String(i),x+bwid/2,by0+hh+12,{size:fs}); if(bwid>34||i===K) S.draw.text(c,big(S,v),x+bwid/2,by0+hh-h-8,{size:Math.max(10,fs-1),color:i===K?P.red:P.grey,weight:700}); });
      var a=Aar(N,K), cc=Cbin(N,K);
      ro.set(0,mode.value==="p"?big(S,a)+" podiums":big(S,cc)+" comités"); ro.set(1,big(S,a)); ro.set(2,big(S,cc)); ro.set(3,String(fact(K))+" = "+big(S,a)+" / "+big(S,cc));
      if(K===N) nt.set("k = n : A(n ; n) = n! est le nombre de permutations ; il n'y a qu'un seul comité (tout le monde).","warn");
      else if(K===0) nt.set("k = 0 : une seule façon de ne rien choisir (A = C = 1), car 0! = 1.","warn");
      else nt.set(mode.value==="p"?"Podium : "+(function(){ var f=[]; for(var i=0;i<K;i++) f.push(N-i); return f.length>4?f.slice(0,3).join(" × ")+" × … × "+f[f.length-1]:f.join(" × "); })()+" = "+big(S,a)+". Si on ignore l'ordre, chaque groupe est compté "+fact(K)+" fois.":"Comité : on divise les arrangements par k! = "+fact(K)+" : "+big(S,a)+" / "+fact(K)+" = "+big(S,cc)+".","ok");
    });
  }
});

SFA.sim({
  id:"m6-c08-galton", ch:"c08", tag:"Animation · Pascal",
  titre:"La planche de Galton : le triangle de Pascal fait tomber des billes",
  resume:"Chaque bille choisit gauche ou droite à chaque clou : les compartiments suivent les coefficients du binôme.",
  but:"Lâche des billes (ou active la chute continue). À chaque clou, une bille part à droite avec la probabilité p. Compare les compartiments obtenus (billes empilées) à la prévision C(8 ; j)·p<sup>j</sup>·(1−p)<sup>8−j</sup> (points violets).",
  aRetenir:"Pour arriver au compartiment j (j déplacements à droite sur 8), il y a C(8 ; j) chemins : ce sont les nombres du triangle de Pascal. Avec p = 1/2, la proportion théorique vaut C(8 ; j) / 2<sup>8</sup>. Plus on lâche de billes, plus les barres épousent la prévision (loi des grands nombres) et dessinent une cloche.",
  piege:"Avec peu de billes, le hasard fait ce qu'il veut : les barres ne suivent pas la prévision. Elles ne la suivent que sur un grand nombre d'essais, et jamais exactement.",
  build:function(k,S){
    var c=M6.canvas(k,1.0,420), P=S.draw.palette;
    var ROWS=8, p=k.slider("Probabilité d'aller à droite, p",0.1,0.9,0.05,0.5,"",null);
    var counts=[0,0,0,0,0,0,0,0,0], total=0, balls=[], queue=0, t0=0, auto=false, rng=Math.random;
    function spawn(){ var path=[],j=0; for(var i=0;i<ROWS;i++){ var r=rng()<p.value?1:0; path.push(r); j+=r; } balls.push({path:path,j:j,age:0}); }
    /* départ : une centaine de billes déjà tombées (reproductible), pour que la planche ne soit pas vide */
    (function(){ var r=M6.rng(2026); for(var b=0;b<90;b++){ var j=0; for(var i=0;i<ROWS;i++) if(r()<0.5) j++; counts[j]++; total++; } })();
    var loop=k.loop(function(dt){
      if(auto&&queue<6) queue+=dt*7;
      var rate=Math.max(2.5,Math.min(60,queue*0.8)); t0+=dt*rate;
      while(t0>=1&&queue>=1){ spawn(); queue--; t0-=1; }
      var sp=queue>40?3.2:(queue>10?2.2:1.7);
      balls.forEach(function(b){ b.age+=dt*sp; });
      balls=balls.filter(function(b){ if(b.age>=ROWS+0.55){ counts[b.j]++; total++; return false; } return true; });
      k.redraw(); if(!auto&&queue<1&&balls.length===0) loop.pause();
    });
    function add(m){ queue+=m; loop.play(); }
    k.button("Lâcher 1 bille",function(){ add(1); },true);
    k.button("Lâcher 20 billes",function(){ add(20); });
    k.button("Lâcher 200 billes",function(){ add(200); });
    k.toggle("Chute continue",false,function(on){ auto=on; if(on) loop.play(); });
    k.button("Vider la planche",function(){ counts=[0,0,0,0,0,0,0,0,0]; total=0; balls=[]; queue=0; });
    var ro=k.readouts(["Billes tombées","Compartiment le plus rempli","Proportion observée","Proportion prévue"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, W=c.W,H=c.H, top=26, pegH=(H*0.46)/ROWS, cw=Math.min(46,(W-24)/9.2), fs=M6.fs(c,12);
      var X=function(row,pos){ return W/2+(pos-row/2)*cw; }, Y=function(row){ return top+row*pegH; };
      /* entonnoir */
      ctx.fillStyle="#e9edf4"; ctx.beginPath(); ctx.moveTo(W/2-26,6); ctx.lineTo(W/2+26,6); ctx.lineTo(W/2+6,top-4); ctx.lineTo(W/2-6,top-4); ctx.closePath(); ctx.fill();
      for(var r=0;r<ROWS;r++) for(var q=0;q<=r;q++){ S.draw.dot(c,X(r,q),Y(r)+pegH*0.2,3.4,"#94a0b0"); }
      var binY=Y(ROWS)+pegH*0.55, binH=H-binY-26;
      var th=[]; for(var j=0;j<=ROWS;j++) th.push(Cbin(ROWS,j)*Math.pow(p.value,j)*Math.pow(1-p.value,ROWS-j));
      var mc=Math.max(1,Math.max.apply(null,counts)), mt=Math.max.apply(null,th)*Math.max(1,total);
      var scale=binH/Math.max(mc,mt,1)*0.92, ballR=Math.max(2.2,Math.min(cw*0.36,scale*0.5)), stacked=scale>=ballR*1.9;
      var curve=[];
      for(j=0;j<=ROWS;j++){ var x=X(ROWS,j), h=counts[j]*scale;
        ctx.strokeStyle="#cfd6e1"; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(x-cw/2+2,binY); ctx.lineTo(x-cw/2+2,binY+binH); ctx.lineTo(x+cw/2-2,binY+binH); ctx.lineTo(x+cw/2-2,binY); ctx.stroke();
        if(stacked){ var per=Math.max(1,Math.floor((cw-6)/(ballR*2))), cnt=counts[j]; for(var b=0;b<cnt;b++){ var lv=Math.floor(b/per), po=b%per, bx=x-(per-1)*ballR+po*ballR*2, by=binY+binH-ballR-1-lv*ballR*1.8; if(by<binY-8) break; ctx.fillStyle=P.mat; ctx.beginPath(); ctx.arc(bx,by,ballR*0.92,0,6.2832); ctx.fill(); } }
        else { ctx.fillStyle=S.draw.tint(P.mat,0.7); ctx.fillRect(x-cw/2+3,binY+binH-h,cw-6,h); }
        S.draw.text(c,String(j),x,H-12,{size:fs,color:P.ink}); if(total>0) S.draw.text(c,String(counts[j]),x,binY+binH-(stacked?Math.min(binH,Math.ceil(counts[j]/Math.max(1,Math.floor((cw-6)/(ballR*2))))*ballR*1.8):h)-9,{size:Math.max(10,fs-1),color:P.mat,weight:800});
        var ty=binY+binH-th[j]*Math.max(1,total)*scale; curve.push([x,ty]); }
      if(total>0){ ctx.save(); ctx.strokeStyle=S.draw.tint(P.violet,0.55); ctx.lineWidth=2; ctx.setLineDash([5,4]); ctx.beginPath(); curve.forEach(function(q2,i){ i?ctx.lineTo(q2[0],q2[1]):ctx.moveTo(q2[0],q2[1]); }); ctx.stroke(); ctx.restore(); curve.forEach(function(q2){ S.draw.dot(c,q2[0],q2[1],5,P.violet); }); }
      balls.forEach(function(b){ var ri=Math.floor(Math.min(b.age,ROWS-1e-9)), fr=Math.min(b.age,ROWS)-ri, pos0=0; for(var i=0;i<ri;i++) pos0+=b.path[i]; var pos1=pos0+b.path[Math.min(ri,ROWS-1)];
        var x0=X(ri,pos0), y0=Y(ri)+pegH*0.2, x1=X(ri+1,pos1), y1=ri+1===ROWS?binY:Y(ri+1)+pegH*0.2, e=fr<1?fr:1;
        var yy=y0+(y1-y0)*e*e+(-Math.sin(Math.PI*e)*pegH*0.28), xx=x0+(x1-x0)*(e);
        if(b.age>ROWS){ xx=X(ROWS,b.j); yy=binY+(b.age-ROWS)*10; }
        S.draw.dot(c,xx,yy,Math.max(4,ballR*0.95),P.amber); });
      var best=0; for(j=1;j<=ROWS;j++) if(counts[j]>counts[best]) best=j;
      S.draw.legend(c,[[P.mat,"billes tombées"],[P.violet,"prévision C(8;j)p^j(1−p)^(8−j)"]],W-8,10,{align:"right"});
      ro.set(0,String(total)); ro.set(1,total?("n° "+best+" ("+counts[best]+")"):"—"); ro.set(2,total?S.fmt(counts[best]/total,3):"—"); ro.set(3,S.fmt(th[total?best:Math.round(ROWS*p.value)],3));
    });
  }
});
