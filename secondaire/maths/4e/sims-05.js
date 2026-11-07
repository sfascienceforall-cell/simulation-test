(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function term(v,sym,first){
  if(Math.abs(v)<1e-12) return "";
  var a=Math.abs(v), s = first ? (v<0?"−":"") : (v<0?" − ":" + ");
  var num = (a===1 && sym) ? "" : F(a,3);
  return s+num+sym;
}
function eq(a,b,c){ var s=term(a,"x²",true); s+=term(b,"x",s===""); s+=term(c,"",s===""); return s||"0"; }
/* tableau de signes : d = racines distinctes triées ; rows = [{label, sg:[signes des m+1 intervalles], at:[signes aux m racines]}] ; signe = 1, -1, 0, ou "|" (valeur interdite) */
function table(c, y0, h, d, rows, S){
  var ctx=c.ctx, W=c.W, L=Math.min(66,W*.2), m=d.length, cw=(W-L-8)/(m+1), rh=h/(rows.length+1);
  ctx.save();
  S.draw.line(c,4,y0,W-4,y0,P.ink,1.5);
  S.draw.text(c,"x",L/2,y0+rh/2,{size:13,color:P.grey});
  for(var i=0;i<m;i++){ S.draw.text(c,F(d[i],2),L+cw*(i+1),y0+rh/2,{size:13}); }
  rows.forEach(function(r,ri){
    var y=y0+rh*(ri+1);
    S.draw.line(c,4,y,W-4,y,P.light,1);
    S.draw.text(c,r.label,L/2,y+rh/2,{size:12,color:P.ink});
    for(var j=0;j<=m;j++){ var s=r.sg[j]; S.draw.text(c,s>0?"+":"−",L+cw*(j+.5),y+rh/2,{size:18,color:s>0?P.green:P.red}); }
    for(var i=0;i<m;i++){ var a=r.at[i]; var t=(a==="|")?"||":(a===0?"0":(a>0?"+":"−")); S.draw.text(c,t,L+cw*(i+1),y+rh/2,{size:14,color:a==="|"?P.red:P.ink}); }
  });
  S.draw.line(c,L,y0,L,y0+h,P.ink,1.5);
  ctx.restore();
}
function sg(v){ return v>1e-12?1:(v<-1e-12?-1:0); }

SFA.sim({
  id:"m4-c05-parabole-signe", ch:"c05", tag:"Classique",
  titre:"Le signe d'un trinôme se lit sur la parabole",
  resume:"Fais varier a, b, c : les zones où ax² + bx + c est positif ou négatif se colorent et le tableau de signes se construit.",
  but:"Observe la parabole : la partie au-dessus de l'axe x est « positive » (vert), celle en dessous « négative » (rouge). Compare avec le tableau de signes en dessous.",
  aRetenir:"Un trinôme a le signe de a à l'extérieur des racines et le signe contraire de a entre les racines. Sans racine (Δ < 0), il garde partout le signe de a. Avec une racine double, il garde le signe de a, sauf en cette racine où il vaut 0.",
  piege:"Ce n'est pas « positif entre les racines » : c'est entre les racines que le signe est opposé à celui de a. Si a > 0, le trinôme est négatif entre les racines.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:1});
    var a=k.slider("a",-3,3,0.5,1,"");
    var b=k.slider("b",-6,6,1,-1,"");
    var cc=k.slider("c",-8,8,1,-6,"");
    var ro=k.readouts(["Trinôme","Racines","f(x) > 0 sur","f(x) < 0 sur"]);
    k.draw(function(){
      var A=a.value,B=b.value,C=cc.value, f=function(x){return A*x*x+B*x+C;};
      c.clear();
      var H=c.H, ax=S.draw.axes(c,{x0:-8,x1:8,y0:-10,y1:10,xl:"x",yl:"y",stepX:2,stepY:5,b:H*.4});
      /* racines */
      var d=[];
      if(A!==0){ var D=B*B-4*A*C; if(D>0){ var r=Math.sqrt(D); d=[(-B-r)/(2*A),(-B+r)/(2*A)].sort(function(p,q){return p-q;}); } else if(D===0) d=[-B/(2*A)]; }
      else if(B!==0) d=[-C/B];
      /* zones sur l'axe x */
      var cuts=[-1e9].concat(d).concat([1e9]), ctx=c.ctx;
      var pos=[],neg=[];
      for(var j=0;j<cuts.length-1;j++){
        var lo=cuts[j],hi=cuts[j+1], mid=(lo<-1e8)?(hi>1e8?0:hi-1):(hi>1e8?lo+1:(lo+hi)/2), s=sg(f(mid));
        var x1=Math.max(lo,ax.x0),x2=Math.min(hi,ax.x1);
        if(s!==0 && x2>x1){ ctx.fillStyle=s>0?"rgba(46,107,85,.28)":"rgba(180,35,24,.2)"; ctx.fillRect(ax.X(x1),ax.Y(0)-5,ax.X(x2)-ax.X(x1),10); }
        var iv=(lo<-1e8?"]−∞":"]"+F(lo,2))+" ; "+(hi>1e8?"+∞[":F(hi,2)+"[");
        if(s>0) pos.push(iv); else if(s<0) neg.push(iv);
      }
      S.draw.fn(c,ax,f,P.acc,3);
      d.forEach(function(x){ if(Math.abs(x)<=8) S.draw.dot(c,ax.X(x),ax.Y(0),6,P.ink); });
      ro.set(0,eq(A,B,C)); ro.set(1,d.length?d.map(function(x){return F(x,2);}).join(" ; "):"aucune");
      ro.set(2,pos.length?pos.join(" ∪ "):"∅"); ro.set(3,neg.length?neg.join(" ∪ "):"∅");
      /* tableau */
      var rowSg=[],rowAt=[];
      for(var j=0;j<cuts.length-1;j++){ var lo=cuts[j],hi=cuts[j+1], mid=(lo<-1e8)?(hi>1e8?0:hi-1):(hi>1e8?lo+1:(lo+hi)/2); rowSg.push(sg(f(mid))); }
      d.forEach(function(){ rowAt.push(0); });
      table(c,H*.62,H*.36,d,[{label:"f(x)",sg:rowSg,at:rowAt}],S);
      if(d.length===0){ var s0=sg(f(0)); S.draw.text(c,s0===0?"f(x) = 0 partout":"aucune racine : signe constant",c.W/2,H*.62+H*.36*.78,{size:12,color:P.grey}); }
    });
  }
});

/* ---------- tableau de signes d'un produit ---------- */
SFA.sim({
  id:"m4-c05-tableau-produit", ch:"c05", tag:"Méthode",
  titre:"Construire le tableau de signes d'un produit",
  resume:"Trois facteurs (x − r) : le tableau se remplit et l'inéquation est résolue.",
  but:"Choisis les racines r₁, r₂, r₃ et le sens de l'inéquation. Chaque facteur change de signe en r. Le signe du produit est celui de la « règle des signes » sur chaque ligne.",
  aRetenir:"Pour résoudre P(x) > 0 (ou ≥, <, ≤) : on cherche les valeurs qui annulent chaque facteur, on place un tableau, on multiplie les signes colonne par colonne, puis on lit les intervalles (crochets fermés pour ≥ et ≤ aux racines).",
  piege:"Une racine double ne change pas le signe du produit (le facteur se répète). Et pour ≥ 0 ou ≤ 0, les racines elles-mêmes sont des solutions : crochets fermés.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var r1=k.slider("r₁ dans (x − r₁)",-4,4,1,-2,"");
    var r2=k.slider("r₂ dans (x − r₂)",-4,4,1,1,"");
    var r3=k.slider("r₃ dans (x − r₃)",-4,4,1,3,"");
    var op=k.seg("Inéquation",[[">","> 0"],["≥","≥ 0"],["<","< 0"],["≤","≤ 0"]],">");
    var ro=k.readouts(["Produit","Solution"]);
    k.draw(function(){
      var R=[r1.value,r2.value,r3.value], O=op.value;
      var d=Array.from(new Set(R)).sort(function(p,q){return p-q;}), m=d.length;
      c.clear();
      var rows=[], prodSg=[], prodAt=[];
      var cuts=[-1e9].concat(d).concat([1e9]);
      var mids=[]; for(var j=0;j<=m;j++){ var lo=cuts[j],hi=cuts[j+1]; mids.push(lo<-1e8?(hi>1e8?0:hi-1):(hi>1e8?lo+1:(lo+hi)/2)); }
      R.forEach(function(r,i){
        rows.push({label:"x "+(r<0?"+ "+F(-r):(r>0?"− "+F(r):"")), sg:mids.map(function(x){return sg(x-r);}), at:d.map(function(x){return sg(x-r);})});
      });
      prodSg=mids.map(function(x,j){ var p=1; R.forEach(function(r){p*=sg(x-r);}); return p; });
      prodAt=d.map(function(){return 0;});
      rows.push({label:"produit",sg:prodSg,at:prodAt});
      table(c,6,c.H-12,d,rows,S);
      var segs=[]; /* alternance intervalle (pair) / racine (impair) */
      for(var j=0;j<=m;j++){ segs.push(j); if(j<m) segs.push("r"+j); }
      var inc=[]; for(var j=0;j<=m;j++){ var v=prodSg[j]; inc.push(O===">"||O==="≥"?v>0:v<0); if(j<m) inc.push(O==="≥"||O==="≤"); }
      var groups=[], i=0, n=inc.length;
      while(i<n){ if(!inc[i]){i++;continue;} var s=i; while(i+1<n&&inc[i+1]) i++; groups.push([s,i]); i++; }
      var txt=groups.map(function(g){
        var s=g[0],e=g[1];
        if(s===e && s%2===1) return "{"+F(d[(s-1)/2],2)+"}";
        var L = s%2===1 ? "["+F(d[(s-1)/2],2) : (s===0?"]−∞":"]"+F(d[s/2-1],2));
        var Rr = e%2===1 ? F(d[(e-1)/2],2)+"]" : (e===n-1?"+∞[":F(d[e/2],2)+"[");
        return L+" ; "+Rr;
      }).join(" ∪ ");
      var fac=R.map(function(r){ return r===0?"x":(r>0?"(x − "+F(r)+")":"(x + "+F(-r)+")"); }).join("");
      ro.set(0,fac+" "+O+" 0"); ro.set(1,txt||"aucune solution (∅)");
    });
  }
});

/* ---------- valeurs interdites ---------- */
SFA.sim({
  id:"m4-c05-valeur-interdite", ch:"c05", tag:"Manipuler",
  titre:"Approcher une valeur interdite",
  resume:"f(x) = (x − p)/(x − q) : fais glisser x vers q et regarde le quotient exploser, avec changement de signe.",
  but:"Fais varier x pour t'approcher de q par la gauche puis par la droite. Que devient f(x) ? Que se passe-t-il pour x = q ?",
  aRetenir:"On ne divise jamais par 0 : x = q est une valeur interdite, il faut l'exclure du domaine. Près de q, |f(x)| devient immense et le signe change de part et d'autre (ici, de signe opposé). Le quotient s'annule en x = p.",
  piege:"Le quotient n'est pas défini en x = q : le crochet doit rester OUVERT sur q, même pour une inéquation ≥ 0. Et on ne multiplie pas « en croix » sans connaître le signe du dénominateur.",
  build:function(k,S){
    var M=window.M4, c=k.canvas(0,{ratio:.78}), geo={};
    var p=k.slider("p (numérateur x − p)",-4,4,1,1,"");
    var q=k.slider("q (dénominateur x − q)",-4,4,1,-2,"");
    var x=k.slider("x",-6,6,0.05,0,"");
    var ro=k.readouts(["x","x − p","x − q","f(x)"]);
    var nt=k.note("","");
    M.grab(c,function(){ return geo.ax?[{id:"x",x:geo.ax.X(x.value),y:geo.ax.Y(0),r:9999}]:[]; },
      function(id,px){ x.set(M.clamp(Math.round(geo.ax.ix(px)*20)/20,-6,6)); k.redraw(); });
    k.draw(function(){
      var Pp=p.value,Q=q.value,X=Math.round(x.value*100)/100, ctx=c.ctx;
      c.clear();
      var ax=geo.ax=S.draw.axes(c,{x0:-6,x1:6,y0:-8,y1:8,xl:"x",yl:"y",stepX:2,stepY:4});
      var f=function(t){ return Math.abs(t-Q)<1e-9?NaN:(t-Pp)/(t-Q); };
      /* bandes de signe sur l'axe x */
      var lo=Math.min(Pp,Q), hi=Math.max(Pp,Q), yy=ax.Y(0);
      function band(x1,x2,col){ var a1=Math.max(x1,-6), a2=Math.min(x2,6); if(a2>a1){ ctx.fillStyle=S.draw.tint(col,.22); ctx.fillRect(ax.X(a1),yy-5,ax.X(a2)-ax.X(a1),10); } }
      if(Pp===Q){ band(-6,6,P.green); } else { band(-6,lo,P.green); band(lo,hi,P.red); band(hi,6,P.green); }
      /* zone interdite */
      ctx.save(); ctx.fillStyle=S.draw.tint(P.red,.12); ctx.fillRect(ax.X(Q)-5,ax.T,10,ax.B-ax.T); ctx.restore();
      S.draw.line(c,ax.X(Q),ax.T,ax.X(Q),ax.B,P.red,1.8,[5,4]);
      M.lab(c,"x = "+F(Q,0)+" interdit",ax.X(Q)+(Q>2?-56:56),ax.T+14,P.red,{size:10.5});
      S.draw.fn(c,ax,function(t){ return Math.abs(t-Q)<0.03?NaN:(t-Pp)/(t-Q); },P.acc,3.2);
      /* zéro du numérateur */
      if(Pp!==Q){ S.draw.dot(c,ax.X(Pp),ax.Y(0),5.5,P.ink); M.lab(c,"f = 0",ax.X(Pp),ax.Y(0)+(Pp<Q?-16:16),P.ink,{size:10}); }
      else { ctx.save(); ctx.beginPath(); ctx.arc(ax.X(Q),ax.Y(1),5,0,7); ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle=P.acc; ctx.lineWidth=2; ctx.stroke(); ctx.restore(); }
      var den=X-Q, forb=Math.abs(den)<1e-9;
      ro.set(0,F(X,2)); ro.set(1,F(X-Pp,2)); ro.set(2,F(den,2));
      var shown;
      if(forb){ shown="ERREUR"; ro.set(3,"non défini"); nt.set("x = "+F(Q)+" : le dénominateur vaut 0. Division par zéro impossible : valeur interdite.","warn");
        M.handle(c,ax.X(X),ax.Y(0),P.red,7); }
      else {
        var y=f(X); shown=Math.abs(y)>=1000?F(y,0):F(y,2); ro.set(3,Math.abs(y)>=1000?F(y,0):F(y,3));
        var col=y>=0?P.green:P.red, py=Math.max(ax.T+6,Math.min(ax.B-6,ax.Y(y)));
        S.draw.line(c,ax.X(X),ax.Y(0),ax.X(X),py,col,1.6,[4,3]);
        M.handle(c,ax.X(X),py,col,7); S.draw.dot(c,ax.X(X),ax.Y(0),3.5,P.grey);
        var txt;
        if(Pp===Q) txt="Ici p = q : f(x) = 1 pour tout x ≠ "+F(Q)+" (la valeur q reste interdite : trou en ("+F(Q)+" ; 1)).";
        else { txt = Math.abs(den)<0.3 ? "Tu es tout près de la valeur interdite : |f(x)| devient très grand, et le signe change de côté." : "f(x) > 0 sur ]−∞ ; "+F(lo)+"[ ∪ ]"+F(hi)+" ; +∞[ ; f(x) < 0 entre "+F(lo)+" et "+F(hi)+" ; f(x) = 0 en x = "+F(Pp)+" ; x = "+F(Q)+" est exclu."; }
        nt.set(txt,"");
      }
      S.draw.display(c,shown,ax.R-60,ax.B-36,{w:110,h:50,caption:"f(x)",color:forb?"#b3261e":"#13233a",size:forb?14:20});
    });
  }
});

/* ---------- domaine avec racine ---------- */
SFA.sim({
  id:"m4-c05-domaine-racine", ch:"c05", tag:"Domaine",
  titre:"Domaine de √(ax² + bx + c) et de 1/√(ax² + bx + c)",
  resume:"Choisis le trinôme : le domaine apparaît en vert sur l'axe x.",
  but:"Fais varier a, b, c. La racine carrée exige un contenu ≥ 0 ; avec 1/√ le contenu doit être > 0. Compare les deux domaines.",
  aRetenir:"√A existe si A ≥ 0. 1/√A existe si A > 0 (on exclut aussi les zéros car ils annulent le dénominateur). Le domaine se lit avec le signe du trinôme.",
  piege:"Pour 1/√A, les racines du trinôme sont exclues (crochets ouverts) ; pour √A, elles sont incluses (crochets fermés). Si Δ < 0 et a < 0, le domaine est vide.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var a=k.seg("a",[[1,"1"],[-1,"−1"],[2,"2"],[-2,"−2"]],1);
    var b=k.slider("b",-8,8,1,-2,"");
    var cc=k.slider("c",-12,12,1,-3,"");
    var ty=k.seg("Expression",[["r","√(trinôme)"],["i","1/√(trinôme)"]],"r");
    var ro=k.readouts(["Trinôme","Domaine"]);
    k.draw(function(){
      var A=Number(a.value),B=b.value,C=cc.value,strict=ty.value==="i";
      c.clear();
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-10,y1:10,xl:"x",yl:"y",stepX:2,stepY:5});
      var f=function(x){return A*x*x+B*x+C;};
      S.draw.fn(c,ax,f,P.grey,1.8,[5,4]);
      S.draw.fn(c,ax,function(x){ var v=f(x); if(v<0||(strict&&v===0)) return NaN; return strict?1/Math.sqrt(v):Math.sqrt(v); },P.acc,3);
      var D=B*B-4*A*C, dom, ctx=c.ctx;
      function band(x1,x2){ var u=Math.max(x1,ax.x0),v=Math.min(x2,ax.x1); if(v>=u){ ctx.fillStyle="rgba(46,107,85,.35)"; ctx.fillRect(ax.X(u),ax.Y(0)-5,Math.max(3,ax.X(v)-ax.X(u)),10);} }
      if(D>0){ var r=Math.sqrt(D), x1=Math.min((-B-r)/(2*A),(-B+r)/(2*A)), x2=Math.max((-B-r)/(2*A),(-B+r)/(2*A));
        if(Math.abs(x1)<=8) S.draw.dot(c,ax.X(x1),ax.Y(0),5,P.ink); if(Math.abs(x2)<=8) S.draw.dot(c,ax.X(x2),ax.Y(0),5,P.ink);
        if(A>0){ band(-1e9,x1); band(x2,1e9); dom=strict?"]−∞ ; "+F(x1,2)+"[ ∪ ]"+F(x2,2)+" ; +∞[":"]−∞ ; "+F(x1,2)+"] ∪ ["+F(x2,2)+" ; +∞["; }
        else { band(x1,x2); dom=strict?"]"+F(x1,2)+" ; "+F(x2,2)+"["  :"["+F(x1,2)+" ; "+F(x2,2)+"]"; } }
      else if(D===0){ var x0=-B/(2*A); if(Math.abs(x0)<=8) S.draw.dot(c,ax.X(x0),ax.Y(0),5,P.ink);
        if(A>0){ band(-1e9,1e9); dom=strict?"ℝ \\ {"+F(x0,2)+"}":"ℝ"; if(strict){ctx.clearRect(ax.X(x0)-4,ax.Y(0)-6,8,12);} }
        else { if(!strict){ band(x0,x0); } dom=strict?"∅ (le trinôme n'est jamais > 0)":"{"+F(x0,2)+"}"; } }
      else { if(A>0){ band(-1e9,1e9); dom="ℝ"; } else dom="∅ (le trinôme est toujours < 0)"; }
      ro.set(0,eq(A,B,C)); ro.set(1,dom);
    });
  }
});

/* ---------- sécurité routière ---------- */
SFA.sim({
  id:"m4-c05-distance-arret", ch:"c05", tag:"Niche",
  titre:"Distance d'arrêt et vitesse maximale",
  resume:"Une inéquation du 2e degré pour la route : à quelle vitesse peut-on s'arrêter avant l'obstacle ?",
  but:"Fixe la distance visible D, le temps de réaction et l'état de la route. Cherche la vitesse maximale pour laquelle d(v) ≤ D, puis teste ta vitesse avec le curseur.",
  aRetenir:"Distance d'arrêt (modèle simplifié) : d(v) = v·t/3,6 + v²/(25,92·a), avec v en km/h, t le temps de réaction en s et a la décélération en m/s². C'est un trinôme du 2e degré en v : d(v) ≤ D est une inéquation du 2e degré.",
  piege:"Modèle simplifié : freinage constant, route plane, réaction constante. La distance ne double pas quand la vitesse double : elle est multipliée par plus de 2, à cause du terme en v².",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var D=k.slider("Distance visible D",10,120,1,40,"m");
    var tr=k.slider("Temps de réaction t",0.5,2,0.1,1,"s");
    var rt=k.seg("Route",[[7,"sèche"],[4,"mouillée"],[2,"verglas"]],7);
    var v=k.slider("Ta vitesse v",0,150,1,50,"km/h");
    var ro=k.readouts(["d(v) à ta vitesse","Vitesse maximale","Distance de réaction","Distance de freinage"]);
    var nt=k.note("","");
    k.draw(function(){
      var Dv=D.value,T=tr.value,A=Number(rt.value),V=v.value;
      var q=1/(25.92*A), l=T/3.6, dist=function(x){return l*x+q*x*x;};
      var vm=(-l+Math.sqrt(l*l+4*q*Dv))/(2*q);
      c.clear();
      var ax=S.draw.axes(c,{x0:0,x1:150,y0:0,y1:200,xl:"v (km/h)",yl:"d (m)",stepX:25,stepY:50});
      S.draw.fn(c,ax,dist,P.acc,3);
      S.draw.line(c,ax.L,ax.Y(Dv),ax.R,ax.Y(Dv),P.red,2,[6,4]);
      S.draw.text(c,"D = "+F(Dv,0)+" m",ax.R-4,ax.Y(Dv)-10,{size:12,color:P.red,align:"right"});
      if(vm<=150){ S.draw.line(c,ax.X(vm),ax.Y(Dv),ax.X(vm),ax.Y(0),P.green,2,[4,3]); S.draw.dot(c,ax.X(vm),ax.Y(Dv),6,P.green); }
      var dv=dist(V), ok=dv<=Dv+1e-9;
      S.draw.dot(c,ax.X(V),ax.Y(Math.min(200,dv)),7,ok?P.green:P.red);
      ro.set(0,F(dv,1)+" m"); ro.set(1,F(vm,1)+" km/h"); ro.set(2,F(l*V,1)+" m"); ro.set(3,F(q*V*V,1)+" m");
      nt.set(ok?"À "+F(V,0)+" km/h, tu t'arrêtes avant l'obstacle (d ≤ D).":"À "+F(V,0)+" km/h, tu percutes l'obstacle : d(v) > D. Ralentis sous "+F(vm,1)+" km/h.",ok?"ok":"warn");
    });
  }
});
})();
