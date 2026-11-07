/* Chapitre 1 : calcul numérique et expressions algébriques
   Ce fichier est chargé avant les autres chapitres : il contient aussi les aides de dessin communes M3.* */
window.M3 = window.M3 || {};
(function(){
var S = window.SFA, M3 = window.M3;
var SERIF = "'STIX Two Text','Cambria Math',serif";
M3.serif = SERIF;
/* taille de texte adaptée à la largeur du canevas (lisible sur téléphone) */
M3.sz = function(c, n){ return Math.max(12, Math.min(n, c.W / 26)); };
/* ratio du canevas : bas sur grand écran (vignettes, colonne large), plus haut sur téléphone */
M3.fit = function(c, desk, mob){
  var orig = c.resize;
  c.resize = function(){ var w = c.cv.parentNode ? c.cv.parentNode.clientWidth : 600; c.ratio = w >= 440 ? desk : mob; orig(); };
  c.resize();
};
/* arrondi au pas, borné */
M3.snap = function(v, step, lo, hi){ var r = Math.round(v / step) * step; r = Math.round(r * 1e6) / 1e6; return Math.max(lo, Math.min(hi, r)); };
/* nombre entre parenthèses s'il est négatif */
M3.par = function(v, d){ var t = S.fmt(v, d === undefined ? 0 : d); return v < 0 ? "(" + t + ")" : t; };
/* poignée à saisir : anneau coloré avec une prise */
M3.handle = function(c, x, y, col, on, r){
  var ctx = c.ctx; r = r || 11; if (!isFinite(x) || !isFinite(y)) return;
  ctx.save(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(x, y, r + (on ? 7 : 5), 0, 7); ctx.fillStyle = S.draw.tint(col, on ? 0.28 : 0.16); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r * 0.38, 0, 7); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
};
/* glisser-déposer : getHandles() → [{id,x,y,r}] ; onDrag(id, p) doit appeler k.redraw() */
M3.drag = function(c, getHandles, onDrag, onUp){
  var sel = null;
  function hit(p){ var best = null, bd = 1e9; (getHandles() || []).forEach(function(h){ var d = Math.hypot(p.x - h.x, p.y - h.y); if (d < (h.r || 26) && d < bd){ bd = d; best = h; } }); return best; }
  c.pointer(function(t, p){
    if (t === "down"){ sel = hit(p); if (sel) c.cv.style.cursor = "grabbing"; }
    if ((t === "down" || t === "drag") && sel) onDrag(sel.id, p, sel);
    if (t === "move") c.cv.style.cursor = hit(p) ? "grab" : "default";
    if (t === "up"){ var was = sel; sel = null; c.cv.style.cursor = "default"; if (was && onUp) onUp(was.id, p); }
  });
  return function(){ return sel && sel.id; };
};
/* hachures diagonales dans un rectangle */
M3.hatch = function(c, x, y, w, h, col){
  var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.55; ctx.beginPath();
  for (var i = -h; i < w + h; i += 9){ ctx.moveTo(x + i, y + h); ctx.lineTo(x + i + h, y); }
  ctx.stroke(); ctx.restore();
};
/* cote : trait avec deux petits repères et une étiquette (horizontale ou verticale) */
M3.dim = function(c, x1, y1, x2, y2, label, col, side){
  var ctx = c.ctx, P = S.draw.palette; col = col || P.grey;
  var vert = Math.abs(x1 - x2) < Math.abs(y1 - y2);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  if (vert){ ctx.moveTo(x1 - 4, y1); ctx.lineTo(x1 + 4, y1); ctx.moveTo(x2 - 4, y2); ctx.lineTo(x2 + 4, y2); }
  else { ctx.moveTo(x1, y1 - 4); ctx.lineTo(x1, y1 + 4); ctx.moveTo(x2, y2 - 4); ctx.lineTo(x2, y2 + 4); }
  ctx.stroke(); ctx.restore();
  if (label !== "" && label != null) S.draw.label(c, label, (x1 + x2) / 2 + (vert ? (side || -1) * 0 : 0), (y1 + y2) / 2, {color:col, size:M3.sz(c, 12.5), math:true});
};
/* texte « riche » : les parties entre « » sont surlignées ; centré en cx */
M3.rich = function(c, s, cx, y, size, col, hl){
  var ctx = c.ctx, parts = String(s).split(/(«[^»]*»)/).filter(function(p){ return p !== ""; });
  ctx.save(); ctx.font = "700 " + size + "px " + SERIF; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  var ws = parts.map(function(p){ var h = p.charAt(0) === "«"; var t = h ? p.slice(1, -1) : p; return {t:t, h:h, w:ctx.measureText(t).width + (h ? 12 : 0)}; });
  var tot = ws.reduce(function(a, p){ return a + p.w; }, 0), x = cx - tot / 2;
  ws.forEach(function(p){
    if (p.h){ S.draw.rrect(c, x, y - size * 0.78, p.w, size * 1.56, 7); ctx.fillStyle = S.draw.tint(hl || S.draw.palette.amber, 0.22); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = hl || S.draw.palette.amber; ctx.stroke(); }
    ctx.fillStyle = col || S.draw.palette.ink; ctx.fillText(p.t, x + (p.h ? 6 : 0), y + 1); x += p.w;
  });
  ctx.restore(); return tot;
};
/* droite numérique : o = {x0,x1,y,step,dec,from,to,fo,too,color,mark,markColor,marks:[{v,ok}],L,R,thick}
   from/to = ±Infinity possibles ; renvoie la fonction X(v) */
M3.nline = function(c, S2, o){
  var ctx = c.ctx, P = S.draw.palette, L = o.L == null ? 26 : o.L, R = o.R == null ? c.W - 26 : o.R, y = o.y, col = o.color || P.green, fs = M3.sz(c, 12.5);
  function X(v){ return L + (v - o.x0) / (o.x1 - o.x0) * (R - L); }
  ctx.save();
  /* rail */
  S.draw.rrect(c, L - 12, y - 4, R - L + 24, 8, 4); ctx.fillStyle = "#e9edf3"; ctx.fill();
  ctx.strokeStyle = P.axis; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(R + 12, y); ctx.lineTo(R + 4, y - 5); ctx.moveTo(R + 12, y); ctx.lineTo(R + 4, y + 5); ctx.stroke();
  var st = o.step || 1, i;
  ctx.font = "700 " + (fs - 1) + "px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.strokeStyle = P.axis; ctx.lineWidth = 1.5;
  var ntick = Math.round((o.x1 - o.x0) / st), skip = Math.max(1, Math.ceil(ntick / Math.max(4, Math.floor((R - L) / 34))));
  for (i = 0; i <= ntick; i++){ var v = Math.round((Math.ceil(o.x0 / st - 1e-9) + i) * st * 1e9) / 1e9; if (v > o.x1 + 1e-9) break;
    ctx.beginPath(); ctx.moveTo(X(v), y - 6); ctx.lineTo(X(v), y + 6); ctx.stroke();
    if (i % skip === 0) ctx.fillText(S.fmt(v, o.dec === undefined ? 2 : o.dec), X(v), y + 12); }
  /* zone solution */
  if (o.from !== undefined){
    var a = Math.max(o.x0, Math.min(o.x1, o.from)), b = Math.max(o.x0, Math.min(o.x1, o.to));
    if (b >= a && !(o.to < o.x0) && !(o.from > o.x1)){
      var th = o.thick || 9; S.draw.rrect(c, X(a), y - th / 2, Math.max(2, X(b) - X(a)), th, th / 2); ctx.fillStyle = col; ctx.fill();
      ctx.fillStyle = col;
      if (!isFinite(o.to) || o.to > o.x1){ ctx.beginPath(); ctx.moveTo(R + 14, y); ctx.lineTo(R + 4, y - 9); ctx.lineTo(R + 4, y + 9); ctx.closePath(); ctx.fill(); }
      if (!isFinite(o.from) || o.from < o.x0){ ctx.beginPath(); ctx.moveTo(L - 14, y); ctx.lineTo(L - 4, y - 9); ctx.lineTo(L - 4, y + 9); ctx.closePath(); ctx.fill(); }
    }
    [[o.from, o.fo], [o.to, o.too]].forEach(function(p){ if (isFinite(p[0]) && p[0] >= o.x0 - 1e-9 && p[0] <= o.x1 + 1e-9){
      ctx.beginPath(); ctx.arc(X(p[0]), y, 8, 0, 7); ctx.fillStyle = p[1] ? "#fff" : col; ctx.fill(); ctx.lineWidth = 3.2; ctx.strokeStyle = col; ctx.stroke(); } });
  }
  (o.marks || []).forEach(function(m){ var cc = m.ok ? P.green : P.red; ctx.beginPath(); ctx.arc(X(m.v), y - 17, 4.2, 0, 7); ctx.fillStyle = S.draw.tint(cc, 0.85); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = "#fff"; ctx.stroke(); });
  if (o.mark !== undefined){
    var mc = o.markColor || P.red, mx = X(o.mark);
    S.draw.dot(c, mx, y, 7.5, mc);
    if (o.markLabel !== false) S.draw.label(c, o.markText || S.fmt(o.mark, o.dec === undefined ? 2 : o.dec), mx, y - 27, {color:mc, size:fs});
  }
  ctx.restore(); return X;
};
/* « x + 3 », « 2x − 1 »… pour a x + b */
M3.side = function(a, b, d){
  d = d === undefined ? 2 : d; var s = "";
  if (a !== 0) s += (a === 1 ? "" : a === -1 ? "−" : S.fmt(a, d)) + "x";
  if (b !== 0 || a === 0){ if (s === "") s = S.fmt(b, d); else s += (b > 0 ? " + " : " − ") + S.fmt(Math.abs(b), d); }
  return s;
};
})();

/* ---------- Chapitre 1 ---------- */
SFA.sim({
  id:"m3-c01-carre", ch:"c01", tag:"Géométrie", titre:"Le carré de côté a + b",
  resume:"Découpe un carré en quatre morceaux et vois pourquoi (a + b)² contient 2ab.",
  but:"Fais glisser les poignées (ou les curseurs) pour changer a et b, écarte les morceaux, puis relève un défi. Active « Montrer l'erreur » pour voir ce qui manque quand on écrit a² + b².",
  aRetenir:"(a + b)² = a² + 2ab + b² : le grand carré contient un carré a², un carré b² et deux rectangles a × b.",
  piege:"(a + b)² ≠ a² + b². Il manque toujours les deux rectangles 2ab (sauf si a ou b vaut 0).",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.0}), P=S.draw.palette, T=S.draw.tint;
    var a=k.slider("a",1,8,0.5,3,"cm"), b=k.slider("b",1,8,0.5,2,"cm");
    var sp=k.slider("Écarter les morceaux",0,1,0.05,0,"");
    var err=k.toggle("Montrer l'erreur a² + b²",false);
    var df=k.seg("Défi",[[0,"Libre"],[1,"Aire 49 cm²"],[2,"2ab = 24"],[3,"Il manque 16"]],0);
    var nt=k.note("");
    var ro=k.readouts(["(a + b)²","a² + b²","2ab","Différence"]);
    var geo={x0:0,u:1,h:[]};
    M3.drag(c,function(){ return sp.value>0.02?[]:geo.h; },function(id,p){
      if(id==="a") a.set(M3.snap((p.x-geo.x0)/geo.u,0.5,1,8)); else b.set(M3.snap((p.x-geo.x0)/geo.u-a.value,0.5,1,8)); k.redraw(); });
    window.M3.fit(c,0.74,1.0);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=a.value, B=b.value, s=A+B, fs=M3.sz(c,15);
      var M=Math.max(8,s), u=Math.min((c.W-56)/(M+0.6),(c.H-100)/(M+0.6)), g=sp.value*0.4*u;
      var x0=(c.W-s*u)/2+8, y0=Math.max(40,(c.H-30-s*u)/2+14); geo.x0=x0; geo.u=u;
      /* quadrillage de fond très discret */
      ctx.strokeStyle="#f1f4f8"; ctx.lineWidth=1; ctx.beginPath(); for(var i=0;i<=s*2;i++){ var q=i*0.5*u; ctx.moveTo(x0+q,y0); ctx.lineTo(x0+q,y0+s*u); ctx.moveTo(x0,y0+q); ctx.lineTo(x0+s*u,y0+q); } ctx.stroke();
      function R(x,y,w,h,col,t,dx,dy,area){
        var X=x0+x*u+dx, Y=y0+y*u+dy; S.draw.rrect(c,X,Y,w*u,h*u,5); ctx.fillStyle=col; ctx.fill(); ctx.lineWidth=2.5; ctx.strokeStyle="#fff"; ctx.stroke();
        S.draw.text(c,t,X+w*u/2,Y+h*u/2-(h*u>52&&w*u>60?8:0),{size:Math.min(fs+3,Math.max(12,Math.min(w*u,h*u)/3)),color:"#fff",math:true,italic:true});
        if(h*u>52&&w*u>60) S.draw.text(c,S.fmt(area,2)+" cm²",X+w*u/2,Y+h*u/2+12,{size:Math.max(11,fs-3),color:"rgba(255,255,255,.92)",weight:700}); }
      R(0,0,A,A,P.acc,"a²",-g,-g,A*A); R(A,0,B,A,P.amber,"ab",g,-g,A*B); R(0,A,A,B,P.amber,"ab",-g,g,A*B); R(A,A,B,B,P.green,"b²",g,g,B*B);
      if(err.value){
        M3.hatch(c,x0+A*u+g,y0-g,B*u,A*u,P.red); M3.hatch(c,x0-g,y0+A*u+g,A*u,B*u,P.red);
        ctx.save(); ctx.strokeStyle=P.red; ctx.lineWidth=3; ctx.setLineDash([7,5]); ctx.strokeRect(x0-g,y0-g,A*u,A*u); ctx.strokeRect(x0+A*u+g,y0+A*u+g,B*u,B*u); ctx.restore();
        S.draw.label(c,"2ab manquent dans a² + b²",x0+s*u/2,Math.min(c.H-56,y0+s*u+g+24),{color:P.red,size:fs-1}); }
      /* cotes */
      M3.dim(c,x0-g,y0-g-14,x0+A*u-g,y0-g-14,"a",P.acc); M3.dim(c,x0+A*u+g,y0-g-14,x0+s*u+g,y0-g-14,"b",P.green);
      M3.dim(c,x0-g-16,y0-g,x0-g-16,y0+A*u-g,"a",P.acc); M3.dim(c,x0-g-16,y0+A*u+g,x0-g-16,y0+s*u+g,"b",P.green);
      /* poignées */
      geo.h=[{id:"a",x:x0+A*u,y:y0-g-14,r:26},{id:"b",x:x0+s*u,y:y0+s*u,r:26}];
      if(sp.value<=0.02){ M3.handle(c,geo.h[0].x,geo.h[0].y,P.acc,false,8); M3.handle(c,geo.h[1].x,geo.h[1].y,P.green,false,9); }
      /* ligne de calcul */
      var ly=c.H-24;
      S.draw.text(c,"("+S.fmt(A,1)+" + "+S.fmt(B,1)+")² = "+S.fmt(A*A,2)+" + "+S.fmt(2*A*B,2)+" + "+S.fmt(B*B,2)+" = "+S.fmt(s*s,2),c.W/2,ly,{size:fs,color:P.ink,math:true});
      ro.set(0,S.fmt(s*s,2)); ro.set(1,S.fmt(A*A+B*B,2)); ro.set(2,S.fmt(2*A*B,2)); ro.set(3,S.fmt(s*s-A*A-B*B,2));
      var d=+df.value, tot=s*s;
      if(d===0) nt.set("Libre : glisse la poignée bleue (a) ou la poignée verte (b), ou utilise les curseurs.","");
      else if(d===1) nt.set(tot===49?"Bravo : a + b = 7, donc (a + b)² = 49. Plusieurs couples conviennent.":"Il faut a + b = 7. Pour l'instant a + b = "+S.fmt(s,1)+" et (a + b)² = "+S.fmt(tot,2)+".",tot===49?"ok":"warn");
      else if(d===2) nt.set(2*A*B===24&&A*A+B*B===25?"Gagné : a = "+S.fmt(A,0)+" et b = "+S.fmt(B,0)+" donnent 2ab = 24 et a² + b² = 25, donc (a + b)² = 49.":"Trouve a et b tels que 2ab = 24 et a² + b² = 25. Ici 2ab = "+S.fmt(2*A*B,2)+" et a² + b² = "+S.fmt(A*A+B*B,2)+".",2*A*B===24&&A*A+B*B===25?"ok":"warn");
      else nt.set(2*A*B===16?"Oui : 2ab = 16 (par exemple a = 2 et b = 4). La différence entre (a + b)² et a² + b² est toujours 2ab.":"Il faut que la différence (a + b)² − (a² + b²) = 2ab vaille 16, donc ab = 8. Ici 2ab = "+S.fmt(2*A*B,2)+".",2*A*B===16?"ok":"warn");
    });
  }
});
SFA.sim({
  id:"m3-c01-tuiles", ch:"c01", tag:"Factorisation", titre:"Tuiles algébriques : un trinôme devient un rectangle",
  resume:"Construis le rectangle (x + m)(x + n) et lis le trinôme développé.",
  but:"Choisis m et n (curseurs ou poignées), puis relève le défi : trouve les deux nombres pour fabriquer le trinôme demandé.",
  aRetenir:"x² + (m + n)x + mn = (x + m)(x + n). Pour factoriser, cherche deux nombres de somme (m + n) et de produit mn.",
  piege:"Chercher deux nombres de bon produit mais de mauvaise somme : x² + 5x + 6 = (x + 2)(x + 3), pas (x + 1)(x + 6).",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.95}), P=S.draw.palette;
    var m=k.slider("m",1,6,1,2,""), n=k.slider("n",1,6,1,3,""), x=k.slider("x (longueur de la tuile)",2,6,0.5,4,"");
    var tg=k.seg("Défi",[[0,"Libre"],[1,"x²+5x+6"],[2,"x²+7x+12"],[3,"x²+6x+8"],[4,"x²+8x+15"]],0);
    var nt=k.note("Mode libre : change m, n et x.");
    var ro=k.readouts(["Forme développée","Forme factorisée","Aire pour ce x"]);
    var T={1:[5,6],2:[7,12],3:[6,8],4:[8,15]}, geo={h:[],x0:0,y0:0,u:1};
    M3.drag(c,function(){return geo.h;},function(id,p){
      if(id==="n") n.set(M3.snap((p.x-geo.x0)/geo.u-x.value,1,1,6)); else m.set(M3.snap((p.y-geo.y0)/geo.u-x.value,1,1,6)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, M=m.value, N=n.value, X=x.value, W=X+N, H=X+M, fs=M3.sz(c,14);
      var u=Math.min((c.W-90)/(X+6),(c.H-110)/(X+6)), x0=(c.W-W*u)/2+14, y0=46; geo.x0=x0; geo.y0=y0; geo.u=u;
      function tile(xx,yy,w,h,col,t,labelSize){ ctx.fillStyle=col; ctx.fillRect(x0+xx*u,y0+yy*u,w*u,h*u); ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.strokeRect(x0+xx*u,y0+yy*u,w*u,h*u);
        if(t) S.draw.text(c,t,x0+(xx+w/2)*u,y0+(yy+h/2)*u,{size:labelSize||fs,color:"#fff",math:true,italic:true}); }
      tile(0,0,X,X,P.acc,"x²",fs+4);
      for(var i=0;i<N;i++) tile(X+i,0,1,X,P.amber,"x",Math.max(12,Math.min(fs,u*0.7)));   /* N tuiles « x » debout */
      for(var j=0;j<M;j++) tile(0,X+j,X,1,P.amber,"x",Math.max(12,Math.min(fs,u*0.7)));   /* M tuiles « x » couchées */
      for(i=0;i<N;i++) for(j=0;j<M;j++) tile(X+i,X+j,1,1,P.green,"1",Math.max(11,Math.min(fs,u*0.6)));
      M3.dim(c,x0,y0-16,x0+X*u,y0-16,"x",P.acc); M3.dim(c,x0+X*u,y0-16,x0+W*u,y0-16,"n = "+N,P.amber);
      M3.dim(c,x0-18,y0,x0-18,y0+X*u,"x",P.acc); M3.dim(c,x0-18,y0+X*u,x0-18,y0+H*u,"m = "+M,P.amber);
      geo.h=[{id:"n",x:x0+W*u,y:y0+X*u/2,r:28},{id:"m",x:x0+X*u/2,y:y0+H*u,r:28}];
      M3.handle(c,geo.h[0].x,geo.h[0].y,P.amber,false,8); M3.handle(c,geo.h[1].x,geo.h[1].y,P.amber,false,8);
      S.draw.text(c,"(x + "+M+")(x + "+N+") = x² + "+(M+N)+"x + "+(M*N),c.W/2,Math.min(c.H-18,y0+H*u+34),{size:fs,color:P.ink,math:true});
      ro.set(0,"x² + "+(M+N)+"x + "+(M*N)); ro.set(1,"(x + "+M+")(x + "+N+")"); ro.set(2,S.fmt(W*H,2));
      var d=+tg.value; if(!d){nt.set("Mode libre : change m, n et x. Compte les tuiles : 1 carré x², "+(M+N)+" tuiles x, "+(M*N)+" petits carrés.","");}
      else{ var t=T[d]; if(M+N===t[0]&&M*N===t[1]) nt.set("Bravo : "+M+" + "+N+" = "+t[0]+" et "+M+" × "+N+" = "+t[1]+".","ok");
        else nt.set("Il faut m + n = "+t[0]+" et m × n = "+t[1]+". Pour l'instant : "+(M+N)+" et "+(M*N)+".","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c01-mental", ch:"c01", tag:"Calcul mental", titre:"Calcul mental avec les produits remarquables",
  resume:"47 × 53, 98², 101 × 99 : calcule de tête en choisissant une bonne base.",
  but:"Choisis une base c, un écart d et le type de produit, puis fais glisser « Transformer » : le dessin montre pourquoi le calcul astucieux marche. Relève ensuite un défi chronométré par toi-même.",
  aRetenir:"(c − d)(c + d) = c² − d² ; (c + d)² = c² + 2cd + d² ; (c − d)² = c² − 2cd + d².",
  piege:"Dans (c − d)², le terme du milieu est −2cd, et d² est toujours positif.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.08}), P=S.draw.palette, T=S.draw.tint;
    var md=k.seg("Produit",[["diff","(c−d)(c+d)"],["plus","(c+d)²"],["moins","(c−d)²"]],"diff");
    var cc=k.slider("Base c",10,100,10,50,""), d=k.slider("Écart d",1,9,1,3,"");
    var tr=k.slider("Transformer le dessin",0,1,0.02,0,"");
    var lp=k.loop(function(dt){ var v=tr.value+dt*0.5; if(v>=1){ v=1; lp.pause(); } tr.set(v); k.redraw(); });
    k.button("Animer",function(){ if(tr.value>=1) tr.set(0); lp.play(); },true);
    var chal=null, solved=false;
    k.button("Défi : calcule de tête",function(){
      var ts=["diff","plus","moins"], t=ts[Math.floor(Math.random()*3)], C=10*(1+Math.floor(Math.random()*9)), D=1+Math.floor(Math.random()*5);
      md.set(t); cc.set(C); d.set(D); chal={t:t,C:C,D:D}; solved=false; ans.set(""); ans.el.focus(); });
    var ans=k.input("Ta réponse au défi",""), nt=k.note("Mode exploration. Appuie sur « Défi » pour t'entraîner.");
    var ro=k.readouts(["Calcul de tête","Résultat","Calcul direct","Vérification"]);
    function calc(t,C,D){ if(t==="diff") return {l1:(C-D)+" × "+(C+D),txt:C+"² − "+D+"²",res:C*C-D*D,dir:(C-D)*(C+D),l2:S.fmt(C*C,0)+" − "+D*D};
      if(t==="plus") return {l1:(C+D)+"²",txt:C+"² + 2×"+C+"×"+D+" + "+D+"²",res:C*C+2*C*D+D*D,dir:(C+D)*(C+D),l2:S.fmt(C*C,0)+" + "+2*C*D+" + "+D*D};
      return {l1:(C-D)+"²",txt:C+"² − 2×"+C+"×"+D+" + "+D+"²",res:C*C-2*C*D+D*D,dir:(C-D)*(C-D),l2:S.fmt(C*C,0)+" − "+2*C*D+" + "+D*D}; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, C=cc.value, D=d.value, t=md.value, r=calc(t,C,D), fs=M3.sz(c,15), hide=chal&&!solved;
      if(chal&&!solved&&+String(ans.value).replace(",",".").replace(/\s/g,"")===r.res&&ans.value!==""){ solved=true; hide=false; }
      /* dessin non proportionnel : c = 6,4 unités, d = 0,8 à 2,3 unités */
      var cv=6.4, dv=0.8+(D-1)/8*1.5, u=Math.min((c.W-70)/(cv+dv+0.4),(c.H-250)/(cv+dv)), tt=tr.value;
      var x0=(c.W-(cv+dv)*u)/2, y0=70;
      S.draw.text(c,r.l1,c.W/2,26,{size:Math.min(30,c.W/12),color:P.ink,math:true});
      function RR(x,y,w,h,col,lab,sz){ var X=x0+x*u,Y=y0+y*u; S.draw.rrect(c,X,Y,w*u,h*u,4); ctx.fillStyle=col; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle="#fff"; ctx.stroke(); if(lab) S.draw.text(c,lab,X+w*u/2,Y+h*u/2,{size:sz||fs,color:"#fff",math:true,italic:true}); }
      var Cn=C, Dn=D;
      if(t==="diff"){
        /* carré c×c privé du coin d×d = rectangle (c−d)(c+d) : la bande du bas pivote et se place à droite */
        RR(0,0,cv,cv-dv,P.acc,"c × (c − d)");
        var pw=cv-dv, ph=dv, pcx0=x0+(pw/2)*u, pcy0=y0+(cv-dv+ph/2)*u, pcx1=x0+(cv+dv/2)*u, pcy1=y0+((cv-dv)/2)*u, ang=tt*Math.PI/2;
        ctx.save(); ctx.translate(pcx0+(pcx1-pcx0)*tt,pcy0+(pcy1-pcy0)*tt); ctx.rotate(ang);
        S.draw.rrect(c,-pw*u/2,-ph*u/2,pw*u,ph*u,4); ctx.fillStyle=P.amber; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle="#fff"; ctx.stroke();
        ctx.restore();
        if(tt<0.5) S.draw.text(c,"(c − d) × d",x0+pw/2*u,pcy0,{size:fs-2,color:"#fff",math:true}); else if(tt>0.95) S.draw.text(c,"d × (c − d)",pcx1,pcy1,{size:fs-3,color:"#fff",math:true});
        ctx.save(); ctx.strokeStyle=P.red; ctx.lineWidth=2.5; ctx.setLineDash([6,4]); ctx.strokeRect(x0+(cv-dv)*u,y0+(cv-dv)*u,dv*u,dv*u); ctx.restore();
        S.draw.text(c,"d²",x0+(cv-dv/2)*u,y0+(cv-dv/2)*u,{size:fs-2,color:P.red,math:true,italic:true});
        S.draw.label(c,tt<0.5?"carré c² moins le coin d²":"rectangle (c − d) × (c + d)",c.W/2,y0+cv*u+26,{color:P.acc,size:fs-2});
      } else if(t==="plus"){
        var gp=tt*0.5*u;
        function PR(x,y,w,h,dx,dy,col,lab){ var X=x0+x*u+dx,Y=y0+y*u+dy; S.draw.rrect(c,X,Y,w*u,h*u,4); ctx.fillStyle=col; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle="#fff"; ctx.stroke(); S.draw.text(c,lab,X+w*u/2,Y+h*u/2,{size:fs-1,color:"#fff",math:true,italic:true}); }
        PR(0,0,cv,cv,-gp,-gp,P.acc,"c²"); PR(cv,0,dv,cv,gp,-gp,P.amber,"c × d"); PR(0,cv,cv,dv,-gp,gp,P.amber,"d × c"); PR(cv,cv,dv,dv,gp,gp,P.green,"d²");
        S.draw.label(c,"c² + cd + dc + d²",c.W/2,y0+(cv+dv)*u+gp+26,{color:P.acc,size:fs-2});
      } else {
        var gm=tt*0.5*u;
        function MR(x,y,w,h,dx,dy,col,lab,hat){ var X=x0+x*u+dx,Y=y0+y*u+dy; S.draw.rrect(c,X,Y,w*u,h*u,4); ctx.fillStyle=col; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle="#fff"; ctx.stroke(); S.draw.text(c,lab,X+w*u/2,Y+h*u/2,{size:fs-2,color:"#fff",math:true,italic:true}); }
        MR(0,0,cv-dv,cv-dv,-gm,-gm,P.green,"(c − d)²");
        MR(cv-dv,0,dv,cv-dv,gm,-gm,P.red,"d(c−d)"); MR(0,cv-dv,cv-dv,dv,-gm,gm,P.red,"d(c − d)");
        MR(cv-dv,cv-dv,dv,dv,gm,gm,P.amber,"d²");
        S.draw.label(c,"c² − 2cd + d² : on retire deux bandes cd, mais d² a été retiré deux fois",c.W/2,y0+cv*u+gm+26,{color:P.acc,size:fs-3});
      }
      S.draw.text(c,"Schéma non proportionnel",c.W-8,c.H-8,{size:10.5,color:P.grey,align:"right",weight:600});
      var yy=c.H-98;
      if(hide){ S.draw.text(c,"= ?",c.W/2,yy+40,{size:fs+8,color:P.amber,math:true}); S.draw.text(c,"Écris ta réponse dans la case « Ta réponse au défi »",c.W/2,yy+72,{size:fs-2,color:P.grey}); }
      else { S.draw.text(c,"= "+r.txt,c.W/2,yy,{size:fs+1,color:P.acc,math:true}); S.draw.text(c,"= "+r.l2,c.W/2,yy+30,{size:fs+1,color:P.amber,math:true}); S.draw.text(c,"= "+S.fmt(r.res,0),c.W/2,yy+64,{size:fs+8,color:P.green,math:true}); }
      ro.set(0,hide?"?":r.txt); ro.set(1,hide?"?":S.fmt(r.res,0)); ro.set(2,S.fmt(r.dir,0)); ro.set(3,r.res===r.dir?"identique ✓":"différent ✗");
      if(chal){ nt.set(solved?"Juste ! "+r.l1+" = "+S.fmt(r.res,0)+". Relance un défi.":"Défi : calcule "+r.l1+" de tête en utilisant "+(t==="diff"?"c² − d²":t==="plus"?"c² + 2cd + d²":"c² − 2cd + d²")+" avec c = "+C+" et d = "+D+".",solved?"ok":""); }
    });
  }
});
SFA.sim({
  id:"m3-c01-priorites", ch:"c01", tag:"Signes", titre:"Priorités et signes : −x² contre (−x)²",
  resume:"Une calculatrice-test qui montre l'ordre des opérations et l'erreur classique.",
  but:"Choisis une expression et une valeur de x, puis avance étape par étape : la partie surlignée est celle qu'on calcule en premier. Compare ensuite avec la réponse « piège ».",
  aRetenir:"Les puissances se calculent avant le signe moins devant ; les parenthèses d'abord ; puis × et ÷ ; enfin + et −. Un « − » devant une parenthèse change tous les signes à l'intérieur.",
  piege:"−3² = −9 (et non 9). Pour obtenir 9, il faut écrire (−3)².",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.42}), P=S.draw.palette, T=S.draw.tint;
    var f=function(v){return S.fmt(v,0);}, pr=function(v){return M3.par(v,0);};
    var E=[
      {n:"−x²",f:function(x){return -x*x},bad:function(x){return x*x},m:"On a calculé (−x)² : le signe − est entré dans la puissance.",
        st:function(x){var X=pr(x); return ["−«"+X+"²»","−"+f(x*x)];}},
      {n:"(−x)²",f:function(x){return x*x},bad:function(x){return -x*x},m:"On a oublié que la parenthèse entière est élevée au carré.",
        st:function(x){var X=pr(x); return ["(«−"+X+"»)²","«("+f(-x)+")²»",f(x*x)];}},
      {n:"2 + 3x",f:function(x){return 2+3*x},bad:function(x){return 5*x},m:"On a additionné avant de multiplier : (2 + 3)x.",
        st:function(x){var X=pr(x); return ["2 + «3 × "+X+"»","«2 + "+f(3*x)+"»",f(2+3*x)];}},
      {n:"5 − (2x − 3)",f:function(x){return 5-(2*x-3)},bad:function(x){return 5-2*x-3},m:"Le signe − n'a pas été distribué sur le −3.",
        st:function(x){var X=pr(x); return ["5 − («2 × "+X+"» − 3)","5 − («"+f(2*x)+" − 3»)","«5 − "+pr(2*x-3)+"»",f(5-(2*x-3))];}},
      {n:"10 − 4x²",f:function(x){return 10-4*x*x},bad:function(x){return Math.pow(10-4*x,2)},m:"On a calculé (10 − 4x)² au lieu de 10 − 4x².",
        st:function(x){var X=pr(x); return ["10 − 4 × «"+X+"²»","10 − «4 × "+f(x*x)+"»","«10 − "+f(4*x*x)+"»",f(10-4*x*x)];}}
    ];
    var e=k.select("Expression",E.map(function(o,i){return [i,o.n];}),0,function(){ stp.set(0); }), x=k.slider("x",-5,5,1,-3,"");
    var stp=k.slider("Étape",0,3,1,0,"");
    k.button("Étape suivante ▶",function(){ var n=E[+e.value].st(x.value).length; stp.set(stp.value>=n-1 ? 0 : stp.value+1); },true);
    var tg=k.toggle("Montrer la réponse piège",false);
    var ro=k.readouts(["Expression","Valeur correcte","Réponse piège"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, o=E[+e.value], X=x.value, ST=o.st(X), fs=Math.max(15,Math.min(24,c.W/19)), nSt=ST.length;
      var s=Math.min(stp.value,nSt-1);
      var res=o.f(X);
      /* en-tête : l'expression avec la valeur de x */
      S.draw.panel(c,14,14,c.W-28,62,{shadow:false,fill:T(P.acc,0.06),stroke:T(P.acc,0.25)});
      S.draw.text(c,"x = "+f(X),28,30,{size:M3.sz(c,13),color:P.grey,align:"left"});
      S.draw.text(c,o.n,c.W/2,48,{size:fs+8,color:P.acc,math:true});
      /* lignes de calcul */
      var y=112, lh=Math.min(56,(c.H-250)/Math.max(2,nSt)+8);
      ST.forEach(function(line,i){
        if(i>s){ ctx.save(); ctx.setLineDash([5,5]); ctx.strokeStyle=P.light; ctx.lineWidth=2; S.draw.rrect(c,60,y-17,c.W-100,34,9); ctx.stroke(); ctx.restore(); S.draw.dot(c,34,y,10,P.light); S.draw.text(c,String(i+1),34,y+0.5,{size:11,color:P.grey}); y+=lh; return; }
        var cur=(i===s);
        ctx.save(); ctx.globalAlpha=cur?1:0.55;
        S.draw.dot(c,34,y,12,cur?P.amber:P.grey); S.draw.text(c,String(i+1),34,y+0.5,{size:12,color:"#fff"});
        ctx.restore();
        ctx.save(); ctx.globalAlpha=(i<s)?0.6:1;
        M3.rich(c,line.replace(/«|»/g,function(m){return (i<s)?"":m;}),c.W/2+10,y,fs,i===nSt-1?P.green:P.ink,P.amber);
        ctx.restore();
        if(i<s){ ctx.save(); ctx.strokeStyle=P.light; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(34,y+14); ctx.lineTo(34,y+lh-14); ctx.stroke(); ctx.restore(); }
        y+=lh; });
      var done=s>=nSt-1;
      if(done){ S.draw.panel(c,14,y+2,c.W-28,52,{shadow:false,fill:T(P.green,0.1),stroke:T(P.green,0.4)}); S.draw.text(c,"Résultat : "+f(res),c.W/2,y+28,{size:fs+4,color:P.green,math:true}); }
      else { S.draw.panel(c,14,y+2,c.W-28,52,{shadow:false,fill:"#fafbfc",stroke:P.light}); S.draw.text(c,"Résultat : ?   (étape suivante ▶)",c.W/2,y+28,{size:M3.sz(c,14),color:P.grey}); }
      if(tg.value){ var py=c.H-66; S.draw.panel(c,14,py,c.W-28,54,{shadow:false,fill:T(P.red,0.08),stroke:T(P.red,0.4)});
        S.draw.text(c,"Piège : "+f(o.bad(X))+(o.bad(X)===res?"  (ici le piège tombe juste par hasard !)":""),c.W/2,py+17,{size:M3.sz(c,14),color:P.red});
        S.draw.text(c,o.m,c.W/2,py+38,{size:M3.sz(c,11.5),color:P.red,weight:600}); }
      ro.set(0,o.n); ro.set(1,f(res)); ro.set(2,tg.value?f(o.bad(X)):"masquée");
    });
  }
});
