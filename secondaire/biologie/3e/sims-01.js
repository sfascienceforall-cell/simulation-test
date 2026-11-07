(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }

/*B3H-KIT*/
window.B3H = (function(){
  var INK = "#2a3340";
  function ell(g,x,y,rx,ry,fill,st,rot){ g.beginPath(); g.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(st){g.strokeStyle=st;g.lineWidth=1.2;g.stroke();} }
  function eye(g,x,y,r){ ell(g,x,y,r,r,"#fff",INK); ell(g,x+r*.2,y,r*.5,r*.5,INK); }
  var A = {};
  /* chaque fonction : (c, x, y, s, dir) ; (x,y) = centre, s = largeur approximative, dir = 1 (regarde à droite) ou -1 */
  A.herbe = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y+s*.3); g.lineCap="round";
    [[-.36,-.55,"#3a8f4f"],[-.2,-.8,"#2f7a43"],[0,-1,"#47a55c"],[.2,-.78,"#2f7a43"],[.36,-.52,"#3a8f4f"],[-.08,-.7,"#6bbf6f"],[.1,-.62,"#6bbf6f"]].forEach(function(b){
      g.strokeStyle=b[2]; g.lineWidth=Math.max(2,s*.07); g.beginPath(); g.moveTo(b[0]*s*.5,0); g.quadraticCurveTo(b[0]*s*.6,b[1]*s*.5,b[0]*s*1.2,b[1]*s*.75); g.stroke(); });
    g.restore(); };
  A.sauterelle = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60); g.lineCap="round"; g.lineJoin="round";
    g.strokeStyle="#4a6a2a"; g.lineWidth=3; g.beginPath(); g.moveTo(-6,4); g.lineTo(-22,-14); g.lineTo(-34,12); g.stroke(); g.beginPath(); g.moveTo(4,6); g.lineTo(0,18); g.stroke(); g.beginPath(); g.moveTo(12,6); g.lineTo(14,18); g.stroke();
    ell(g,-2,0,26,9,"#8cc152",INK,-.05); ell(g,-6,-4,20,5,"#a6d46a"); ell(g,26,-3,9,7,"#7aae44",INK); eye(g,29,-5,3);
    g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(32,-8); g.quadraticCurveTo(44,-26,56,-24); g.stroke(); g.restore(); };
  A.grenouille = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60); g.lineCap="round";
    ell(g,-18,10,18,8,"#3f9a5a",INK,-.3); ell(g,0,2,26,15,"#52b36e",INK); ell(g,4,9,16,8,"#d9efc4"); ell(g,22,-6,13,10,"#52b36e",INK);
    ell(g,22,-15,5,5,"#52b36e",INK); ell(g,28,-14,5,5,"#52b36e",INK); eye(g,22,-16,3); eye(g,28,-15,3);
    g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(28,-4); g.quadraticCurveTo(33,-2,36,-5); g.stroke();
    ell(g,18,16,10,4,"#3f9a5a",INK); g.restore(); };
  A.souris = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60); g.lineCap="round";
    g.strokeStyle="#c58a8a"; g.lineWidth=2.5; g.beginPath(); g.moveTo(-24,6); g.bezierCurveTo(-40,6,-40,-14,-52,-8); g.stroke();
    ell(g,-2,4,24,15,"#b59a82",INK); ell(g,18,0,14,11,"#c4ab93",INK,.2); ell(g,12,-12,7,7,"#e8b9b9",INK); ell(g,28,3,3,2.6,"#d77");
    eye(g,22,-3,2.6); g.strokeStyle="#7a6552"; g.lineWidth=1; for (var i=-1;i<=1;i++){ g.beginPath(); g.moveTo(28,3); g.lineTo(40,3+i*4); g.stroke(); }
    ell(g,-4,18,8,3,"#9c8068",INK); g.restore(); };
  A.couleuvre = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/80,s/80); g.lineCap="round"; g.lineJoin="round";
    g.strokeStyle=INK; g.lineWidth=13; g.beginPath(); g.moveTo(-38,8); g.bezierCurveTo(-24,-18,-10,24,6,2); g.bezierCurveTo(18,-12,28,-2,34,-8); g.stroke();
    g.strokeStyle="#7cae5a"; g.lineWidth=10.5; g.stroke();
    g.strokeStyle="#4e7f35"; g.lineWidth=2.5; g.setLineDash([2,7]); g.stroke(); g.setLineDash([]);
    ell(g,37,-9,9,6.5,"#7cae5a",INK,-.4); eye(g,39,-11,2.4); g.strokeStyle="#c0321d"; g.lineWidth=1.3; g.beginPath(); g.moveTo(45,-8); g.lineTo(52,-6); g.lineTo(55,-9); g.moveTo(52,-6); g.lineTo(55,-3); g.stroke(); g.restore(); };
  A.buse = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/90,s/90); g.lineJoin="round";
    g.fillStyle="#8a6a4a"; g.strokeStyle=INK; g.lineWidth=1.2;
    g.beginPath(); g.moveTo(-6,-4); g.bezierCurveTo(-20,-30,-52,-30,-70,-16); g.lineTo(-58,-10); g.lineTo(-64,-2); g.lineTo(-48,0); g.lineTo(-44,6); g.lineTo(-18,6); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(6,-4); g.bezierCurveTo(20,-30,52,-30,70,-16); g.lineTo(58,-10); g.lineTo(64,-2); g.lineTo(48,0); g.lineTo(44,6); g.lineTo(18,6); g.closePath(); g.fill(); g.stroke();
    ell(g,0,4,13,20,"#a98462",INK); ell(g,0,10,8,12,"#efe3d0"); ell(g,0,-17,8,8,"#a98462",INK); eye(g,-3.5,-18,2.4); eye(g,3.5,-18,2.4);
    g.fillStyle="#f4c542"; g.beginPath(); g.moveTo(-3,-14); g.lineTo(0,-8); g.lineTo(3,-14); g.closePath(); g.fill(); g.stroke();
    g.fillStyle="#6d5238"; g.beginPath(); g.moveTo(-7,22); g.lineTo(0,34); g.lineTo(7,22); g.closePath(); g.fill(); g.stroke(); g.restore(); };
  A.champignon = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y); g.scale(s/60,s/60);
    g.fillStyle="#f3e8d6"; g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(-6,18); g.quadraticCurveTo(-4,0,-5,-4); g.lineTo(5,-4); g.quadraticCurveTo(4,0,6,18); g.closePath(); g.fill(); g.stroke();
    g.fillStyle="#c9785a"; g.beginPath(); g.moveTo(-26,-3); g.bezierCurveTo(-26,-30,26,-30,26,-3); g.quadraticCurveTo(0,4,-26,-3); g.fill(); g.stroke();
    ell(g,-10,-14,3.2,2.4,"#f6e7d4"); ell(g,6,-19,3,2.2,"#f6e7d4"); ell(g,14,-10,2.6,2,"#f6e7d4"); g.restore(); };
  A.ver = function(c,x,y,s,d){ var g=c.ctx; g.save(); g.translate(x,y); g.scale((d||1)*s/60,s/60); g.lineCap="round";
    g.strokeStyle="#9c5b52"; g.lineWidth=7; g.beginPath(); g.moveTo(-26,4); g.bezierCurveTo(-14,-10,-4,14,8,0); g.bezierCurveTo(16,-8,22,-2,26,-6); g.stroke();
    g.strokeStyle="#d69a8e"; g.lineWidth=4.5; g.stroke(); g.restore(); };
  A.arbre = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y); g.scale(s/80,s/80);
    g.fillStyle="#7a5a3a"; g.beginPath(); g.moveTo(-6,40); g.lineTo(-4,6); g.lineTo(4,6); g.lineTo(6,40); g.fill();
    [[0,-14,26,"#2f7a43"],[-18,0,18,"#3a8f4f"],[18,0,18,"#3a8f4f"],[0,-2,20,"#47a55c"]].forEach(function(b){ ell(g,b[0],b[1],b[2],b[2]*.9,b[3]); }); g.restore(); };
  A.poisson = function(c,x,y,s,d,col){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60);
    g.fillStyle=col||"#e07a1f"; g.strokeStyle=INK; g.lineWidth=1.2;
    g.beginPath(); g.moveTo(-30,0); g.lineTo(-44,-12); g.lineTo(-44,12); g.closePath(); g.fill(); g.stroke();
    ell(g,-4,0,30,15,col||"#e07a1f",INK); ell(g,2,5,20,6,"rgba(255,255,255,.35)"); eye(g,16,-3,3.2); g.restore(); };
  A.humain = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y); g.scale(s/60,s/60); g.lineCap="round";
    ell(g,0,-22,9,9,"#f2c9a0",INK); g.fillStyle="#4a7fc1"; g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(-12,-10); g.lineTo(12,-10); g.lineTo(10,16); g.lineTo(-10,16); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle="#3b4a63"; g.lineWidth=6; g.beginPath(); g.moveTo(-5,16); g.lineTo(-5,34); g.moveTo(5,16); g.lineTo(5,34); g.stroke(); g.restore(); };
  /* ciel + prairie */
  A.prairie = function(c,hor){ var g=c.ctx, W=c.W, H=c.H; hor = hor==null ? .62 : hor;
    var s=g.createLinearGradient(0,0,0,H*hor); s.addColorStop(0,"#d6ecfb"); s.addColorStop(1,"#f4fbf2"); g.fillStyle=s; g.fillRect(0,0,W,H*hor+1);
    var p=g.createLinearGradient(0,H*hor,0,H); p.addColorStop(0,"#bfe3a8"); p.addColorStop(1,"#8fcb7e"); g.fillStyle=p; g.fillRect(0,H*hor,W,H*(1-hor)); };
  /* pastille ronde avec l'illustration : badge(c, nom, x, y, r, bord) */
  A.badge = function(c,name,x,y,r,ring){ var g=c.ctx; g.save(); g.shadowColor="rgba(15,27,45,.18)"; g.shadowBlur=6; g.shadowOffsetY=1.5; g.beginPath(); g.arc(x,y,r,0,6.3); g.fillStyle="#fffdf6"; g.fill(); g.restore();
    g.save(); g.beginPath(); g.arc(x,y,r-1,0,6.3); g.clip();
    if (name==="plancton"){ [[-.3,-.2,.14,"#4fae6b"],[.25,-.25,.12,"#6bc37e"],[-.05,.25,.16,"#3f9a5a"],[.3,.2,.1,"#7fd08f"]].forEach(function(q){ ell(g,x+q[0]*r*1.4,y+q[1]*r*1.4,q[2]*r*1.6,q[2]*r*1.6,q[3],INK); }); } else A.draw(name,c,x,y+(name==="herbe"?r*.12:0),r*1.5,1);
    g.restore(); g.beginPath(); g.arc(x,y,r,0,6.3); g.strokeStyle=ring||"#9aa8ba"; g.lineWidth=2.2; g.stroke(); };
  A.draw = function(name,c,x,y,s,d,col){ if (A[name]) A[name](c,x,y,s,d,col); };
  return A;
})();
/*B3H-END*/

/* ===== 1 · Construis ton réseau ===== */
SFA.sim({
  id:"b3-c01-reseau", ch:"c01", tag:"Classique · tombe souvent",
  titre:"Construis ton réseau alimentaire",
  resume:"Glisse d'un être vivant vers celui qui le mange : la flèche suit la matière. Le programme vérifie le sens.",
  but:"Relie les êtres vivants de la prairie : glisse le doigt (ou la souris) de l'être mangé vers celui qui le mange. Vise les 7 flèches essentielles, sans erreur, puis ferme la boucle avec les décomposeurs.",
  aRetenir:"La flèche indique le transfert de matière et d'énergie : elle part de l'être mangé et pointe vers le mangeur (herbe → sauterelle). Les décomposeurs reçoivent la matière morte de tous les êtres vivants et rendent les sels minéraux aux producteurs.",
  piege:"La flèche ne veut pas dire « mange » : écrire sauterelle → herbe est faux. Un animal appartient souvent à plusieurs chaînes, et les décomposeurs ne sont jamais « inutiles ».",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1.12});
    var N = [
      {id:"buse", nom:"Buse", fx:.5, fy:.095, role:"c", ic:"buse"},
      {id:"couleuvre", nom:"Couleuvre", fx:.5, fy:.32, role:"c", ic:"couleuvre"},
      {id:"grenouille", nom:"Grenouille", fx:.17, fy:.52, role:"c", ic:"grenouille"},
      {id:"souris", nom:"Souris", fx:.83, fy:.52, role:"c", ic:"souris"},
      {id:"sauterelle", nom:"Sauterelle", fx:.17, fy:.72, role:"c", ic:"sauterelle"},
      {id:"herbe", nom:"Herbe", fx:.5, fy:.72, role:"p", ic:"herbe"},
      {id:"decomp", nom:"Décomposeurs", fx:.83, fy:.87, role:"d", ic:"champignon"}
    ];
    var REQ = ["herbe>sauterelle","herbe>souris","sauterelle>grenouille","grenouille>couleuvre","souris>buse","couleuvre>buse","souris>couleuvre"];
    var OPT = ["grenouille>buse"];
    var byId = {}; N.forEach(function(n){ byId[n.id]=n; });
    var edges = [], sel = null, drag = null, flash = null;
    function isDecomp(a,b){ return b==="decomp" && a!=="decomp"; }
    function kind(e){
      var key = e[0]+">"+e[1], rev = e[1]+">"+e[0];
      if (REQ.indexOf(key)>=0 || OPT.indexOf(key)>=0) return "ok";
      if (isDecomp(e[0],e[1]) || (e[0]==="decomp" && e[1]==="herbe")) return "ok";
      if (REQ.indexOf(rev)>=0 || OPT.indexOf(rev)>=0 || isDecomp(e[1],e[0])) return "rev";
      return "bad";
    }
    function R(){ return Math.max(24, Math.min(34, c.W*.082)); }
    function pos(n){ var r=R(); return {x:Math.max(r+6,Math.min(c.W-r-6,n.fx*c.W)), y:n.fy*c.H, r:r}; }
    function hit(p){ for (var i=0;i<N.length;i++){ var q=pos(N[i]); if (Math.hypot(p.x-q.x,p.y-q.y)<=q.r+8) return N[i]; } return null; }
    function toggle(a,b){
      var i=-1; edges.forEach(function(e,j){ if (e[0]===a && e[1]===b) i=j; });
      if (i>=0) edges.splice(i,1); else { edges.push([a,b]); flash={e:[a,b],t:0}; }
    }
    var ro = k.readouts(["Flèches posées","Essentielles justes","À retourner","Plus longue chaîne"]);
    var nt = k.note("", "");
    c.pointer(function(type,p){
      if (type==="down"){ var n = hit(p); if (!n){ sel=null; drag=null; k.redraw(); return; }
        if (sel && sel!==n.id){ toggle(sel,n.id); sel=null; drag=null; k.redraw(); return; }
        drag={from:n.id,x:p.x,y:p.y,moved:false}; k.redraw(); }
      else if (type==="drag" && drag){ drag.x=p.x; drag.y=p.y; if (Math.hypot(p.x-pos(byId[drag.from]).x,p.y-pos(byId[drag.from]).y)>14) drag.moved=true; k.redraw(); }
      else if (type==="up" && drag){ var m = hit(p);
        if (drag.moved && m && m.id!==drag.from) { toggle(drag.from,m.id); sel=null; }
        else if (!drag.moved) sel = (sel===drag.from) ? null : drag.from;
        drag=null; k.redraw(); }
    });
    k.button("Retourner les flèches inversées", function(){ edges = edges.map(function(e){ return kind(e)==="rev" ? [e[1],e[0]] : e; }); }, true);
    k.button("Montrer le réseau complet", function(){ edges = REQ.concat(OPT).map(function(s){ return s.split(">"); }); edges.push(["herbe","decomp"],["souris","decomp"],["decomp","herbe"]); });
    k.button("Tout effacer", function(){ edges = []; sel = null; });
    function edgePt(a,b,off){ var A=pos(a),B=pos(b),dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1, nx=-dy/d*off, ny=dx/d*off;
      return [A.x+dx/d*(A.r+4)+nx, A.y+dy/d*(A.r+4)+ny]; }
    var lp = k.loop(function(dt){ if (flash){ flash.t+=dt; if (flash.t>.6) flash=null; } k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var g = c.ctx, W=c.W, H=c.H, tt = Date.now()/1000;
      B3H.prairie(c,.58);
      /* bandeaux de niveaux */
      [["Niveau 3",.1],["Niveau 2",.35],["Niveau 1",.77]].forEach(function(b){});
      
      edges.forEach(function(e){
        var a = byId[e[0]], b = byId[e[1]], kd = kind(e);
        var p1 = edgePt(a,b,0), p2 = edgePt(b,a,0);
        var col = kd==="ok" ? "#1d7a46" : kd==="rev" ? P.red : P.amber;
        var dsh = e[0]==="decomp" || e[1]==="decomp";
        if (dsh){ g.save(); g.setLineDash([6,5]); g.strokeStyle="#8a5a2b"; g.lineWidth=2; g.beginPath(); g.moveTo(p1[0],p1[1]); g.lineTo(p2[0],p2[1]); g.stroke(); g.restore(); D.arrow(c,p2[0]-(p2[0]-p1[0])*.02,p2[1]-(p2[1]-p1[1])*.02,p2[0],p2[1],"#8a5a2b",2); }
        else D.arrow(c,p1[0],p1[1],p2[0],p2[1],col,kd==="ok"?3:2.6);
        if (kd==="ok"){ for (var j=0;j<3;j++){ var u=((tt*.45+j/3)%1); D.dot(c,p1[0]+(p2[0]-p1[0])*u,p1[1]+(p2[1]-p1[1])*u,2.6,dsh?"#c9a27a":"#7ddf9f"); } }
        else { var mx=(p1[0]+p2[0])/2, my=(p1[1]+p2[1])/2; D.label(c,kd==="rev"?"sens ?":"✕",mx,my,{color:col,size:11}); }
      });
      if (drag && drag.moved){ var q0=pos(byId[drag.from]); g.save(); g.setLineDash([5,5]); g.strokeStyle=P.violet; g.lineWidth=2.5; g.beginPath(); g.moveTo(q0.x,q0.y); g.lineTo(drag.x,drag.y); g.stroke(); g.restore(); var h=hit({x:drag.x,y:drag.y}); if(h&&h.id!==drag.from){ var qh=pos(h); g.strokeStyle=P.violet; g.lineWidth=3; g.beginPath(); g.arc(qh.x,qh.y,qh.r+5,0,6.3); g.stroke(); } }
      N.forEach(function(n){
        var q = pos(n), ring = n.role==="p" ? "#2d8a4f" : n.role==="d" ? "#8a5a2b" : P.acc, active = (sel===n.id)||(drag&&drag.from===n.id);
        if (active) D.glow(c,q.x,q.y,q.r*2,P.violet,.5);
        g.save(); g.shadowColor="rgba(15,27,45,.18)"; g.shadowBlur=8; g.shadowOffsetY=2; g.beginPath(); g.arc(q.x,q.y,q.r,0,6.3); g.fillStyle="#fffdf6"; g.fill(); g.restore();
        g.save(); g.beginPath(); g.arc(q.x,q.y,q.r-1,0,6.3); g.clip(); B3H.draw(n.ic,c,q.x,q.y+(n.ic==="herbe"?4:1),q.r*1.5,1); g.restore();
        g.beginPath(); g.arc(q.x,q.y,q.r,0,6.3); g.strokeStyle=active?P.violet:ring; g.lineWidth=active?4:2.6; g.stroke();
        D.label(c,n.nom,q.x,q.y+q.r+11,{size:11.5,color:P.ink,fill:"rgba(255,255,255,.88)"});
      });
      D.legend(c,[["#2d8a4f","Producteur"],[P.acc,"Consommateur"],["#8a5a2b","Décomposeur"]],6,6,{});
      var good=0, rev=0;
      edges.forEach(function(e){ if (kind(e)==="rev") rev++; });
      REQ.forEach(function(s){ var a=s.split(">"); edges.forEach(function(e){ if (e[0]===a[0]&&e[1]===a[1]) good++; }); });
      var bw=Math.min(W*.5,200); D.rrect(c,10,H-16,bw,8,4); g.fillStyle="rgba(255,255,255,.7)"; g.fill(); D.rrect(c,10,H-16,Math.max(8,bw*good/REQ.length),8,4); g.fillStyle=good===REQ.length?"#1d7a46":P.acc; g.fill();
      var adj = {}; edges.forEach(function(e){ if (kind(e)==="ok" && e[0]!=="decomp" && e[1]!=="decomp"){ (adj[e[0]]=adj[e[0]]||[]).push(e[1]); } });
      function depth(id,seen){ var m=1; (adj[id]||[]).forEach(function(x){ if (seen.indexOf(x)<0) m=Math.max(m,1+depth(x,seen.concat([x]))); }); return m; }
      var L = 0; if (Object.keys(adj).length) N.forEach(function(n){ L=Math.max(L,depth(n.id,[n.id])); });
      ro.set(0,edges.length+""); ro.set(1,good+" / "+REQ.length); ro.set(2,rev+""); ro.set(3,L? L+" maillons":"—");
      var firstRev = null, firstBad = null; edges.forEach(function(e){ var kd=kind(e); if (kd==="rev"&&!firstRev) firstRev=e; if (kd==="bad"&&!firstBad) firstBad=e; });
      if (firstRev) nt.set("Flèche <b>"+byId[firstRev[0]].nom+" → "+byId[firstRev[1]].nom+"</b> : sens inversé. La matière va de l'être mangé vers le mangeur.", "bad");
      else if (firstBad) nt.set("<b>"+byId[firstBad[0]].nom+" → "+byId[firstBad[1]].nom+"</b> : ces deux espèces n'ont pas de relation alimentaire dans ce milieu.", "warn");
      else if (good===REQ.length) nt.set("Bravo : les "+REQ.length+" flèches essentielles sont posées dans le bon sens ("+L+" maillons au plus). Ajoute les décomposeurs pour fermer la boucle.", "ok");
      else nt.set("Glisse d'un <b>être mangé</b> vers <b>celui qui le mange</b> (ou touche les deux l'un après l'autre). Il manque encore "+(REQ.length-good)+" flèche(s) essentielle(s).", "");
    });
  }
});

/* ===== 2 · Retire une espèce ===== */
SFA.sim({
  id:"b3-c01-retire-espece", ch:"c01", tag:"Modèle chiffré",
  titre:"Retire une espèce : que deviennent les autres ?",
  resume:"Au bout de 10 ans, retire une espèce du réseau et suis les populations des quatre autres.",
  but:"Choisis une espèce et la part qui disparaît, puis fais défiler les années : la taille de chaque être vivant dans le réseau suit sa population (en % de sa valeur d'équilibre). Les courbes résument les 60 ans.",
  aRetenir:"Dans un réseau, tout est relié. Sans producteurs, tout s'effondre. Sans le prédateur de tête, ses proies augmentent d'abord, puis épuisent leurs ressources. Une perte partielle est souvent encaissée : les populations reviennent vers l'équilibre.",
  piege:"« Supprimer le prédateur, c'est bon pour les proies » est faux à long terme. Les effets sont indirects et décalés dans le temps. (Modèle simplifié à 5 espèces, unités arbitraires.)",
  build:function(k,S){
    var cn = k.canvas(0,{ratio:.98});
    var c = k.canvas(250);
    var NM = ["Herbe","Sauterelles","Souris","Grenouilles","Buses"], COL = [P.green,P.amber,P.grey,P.teal,P.violet];
    var which = k.seg("Espèce touchée", [[-1,"Aucune"],[0,"Herbe"],[1,"Sauterelles"],[2,"Souris"],[3,"Grenouilles"],[4,"Buses"]], -1);
    var frac = k.slider("Part qui disparaît", 10, 100, 10, 100, "%");
    var yr = k.slider("Année affichée", 0, 60, 1, 8, "ans");
    var play=false;
    k.button("Lancer le film (60 ans)", function(){ if (yr.value>=60) yr.set(0); play=true; lp.play(); }, true);
    var lp = k.loop(function(dt){ if (play){ var ny=yr.value+dt*6; if (ny>=60){ ny=60; play=false; } yr.set(ny); k.redraw(); } else lp.pause(); });
    var ro = k.readouts(NM.map(function(n){ return n+" à 60 ans"; }));
    var nt = k.note("","");
    /* modèle : herbe logistique, deux herbivores, deux prédateurs intermédiaires, un prédateur de tête */
    var Kg=10, r=1, cS=.1, cM=.15, cF=.15, cB1=.3, cB2=.2, e=.6, eB=.5, dS=.09, dM=.24, dF=.03, dB=.35, sS=.03, sM=.03, sF=.05, sB=.1;
    function der(x){ var G=x[0],Sa=x[1],M=x[2],Fr=x[3],B=x[4];
      return [G*(r*(1-G/Kg)-cS*Sa-cM*M), Sa*(e*cS*G-cF*Fr-dS-sS*Sa), M*(e*cM*G-cB1*B-dM-sM*M), Fr*(e*cF*Sa-cB2*B-dF-sF*Fr), B*(eB*(cB1*M+cB2*Fr)-dB-sB*B)]; }
    function add(x,d,h){ return x.map(function(v,i){ return v+d[i]*h; }); }
    function run(){
      var x=[5,2,2,1,.5], x0=x.slice(), dt=.05, out=[], t;
      for (var s=0; s<=1200; s++){
        t = s*dt;
        if (s===200 && which.value>=0) x[which.value] *= 1 - frac.value/100;
        if (s%4===0) out.push([t].concat(x.map(function(v,i){ return 100*v/x0[i]; })));
        var k1=der(x), k2=der(add(x,k1,dt/2)), k3=der(add(x,k2,dt/2)), k4=der(add(x,k3,dt));
        x = x.map(function(v,i){ return Math.max(0, v+dt*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6); });
      }
      return out;
    }
    var NP=[[.5,.1,"buse"],[.2,.5,"grenouille"],[.8,.5,"souris"],[.2,.84,"sauterelle"],[.5,.84,"herbe"]], NE=[[4,3],[4,2],[3,1],[2,0],[1,0]];  /* herbe>sauterelle... (indices dans NM) */
    var ORD=[4,3,2,1,0];   /* index NM -> nœud */
    function web(out){
      var g=cn.ctx, W=cn.W, H=cn.H; cn.clear(); var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#f2f8ee"); bgc.addColorStop(1,"#e4efdc"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      var yi=Math.min(out.length-1,Math.round(yr.value/.2)), row=out[yi];
      var POS={0:[.5,.8],1:[.18,.8],2:[.82,.5],3:[.18,.5],4:[.5,.14]}, ICN=["herbe","sauterelle","souris","grenouille","buse"];
      function rad(i){ return Math.max(6,Math.min(34,24*Math.sqrt(row[i+1]/100))); }
      [[0,1],[0,2],[1,3],[3,4],[2,4]].forEach(function(e){ var a=POS[e[0]], b=POS[e[1]], x1=a[0]*W,y1=a[1]*H,x2=b[0]*W,y2=b[1]*H, d=Math.hypot(x2-x1,y2-y1), ux=(x2-x1)/d, uy=(y2-y1)/d; var ra=rad(e[0])+3,rb=rad(e[1])+3; D.arrow(cn,x1+ux*ra,y1+uy*ra,x2-ux*rb,y2-uy*rb,"#7b8aa0",2.2); });
      for (var i=0;i<5;i++){ var p=POS[i], pc=row[i+1], r=Math.max(6,Math.min(34,24*Math.sqrt(pc/100))), x=p[0]*W, y=p[1]*H, dead=pc<1;
        g.save(); g.shadowColor="rgba(15,27,45,.2)"; g.shadowBlur=7; g.beginPath(); g.arc(x,y,r,0,6.3); g.fillStyle=dead?"#eee":"#fffdf6"; g.fill(); g.restore();
        g.save(); g.beginPath(); g.arc(x,y,r-1,0,6.3); g.clip(); if (!dead) B3H.draw(ICN[i],cn,x,y+(i===0?3:0),r*1.5,1); g.restore();
        g.beginPath(); g.arc(x,y,r,0,6.3); g.strokeStyle=which.value===i?P.red:COL[i]; g.lineWidth=which.value===i?4:2.5; g.stroke();
        if (which.value===i && yr.value>=10){ g.strokeStyle=P.red; g.lineWidth=2; g.beginPath(); g.moveTo(x-r*.5,y-r*.5); g.lineTo(x+r*.5,y+r*.5); g.moveTo(x+r*.5,y-r*.5); g.lineTo(x-r*.5,y+r*.5); g.stroke(); }
        D.label(cn,NM[i]+" "+(dead?"0":S.fmt(pc,0))+" %",x,y+r+12,{size:11.5,color:pc>115?P.green:pc<85?P.red:P.ink}); }
      D.label(cn,"année "+Math.round(yr.value)+(yr.value<10?" · avant le changement":""),8,13,{size:11.5,color:P.ink,align:"left"});
      D.text(cn,"flèche : de l'être mangé vers le mangeur",W/2,H-6,{size:10.5,color:P.grey});
    }
    k.draw(function(){
      c.clear(); var out = run(), ym = 120;
      out.forEach(function(r){ for (var i=1;i<6;i++) ym = Math.max(ym, r[i]); });
      ym = Math.min(600, Math.ceil(ym/50)*50);
      web(out);
      var ax = D.axes(c,{x0:0,x1:60,y0:0,y1:ym,xl:"temps (années)",yl:"% de l'équilibre",stepX:10,l:50,t:50});
      var g = c.ctx; g.save(); g.setLineDash([5,4]); g.strokeStyle=P.grey; g.beginPath(); g.moveTo(ax.X(10),ax.T); g.lineTo(ax.X(10),ax.B); g.stroke(); g.restore();
      T(c,"changement",ax.X(10)+4,ax.B-34,{size:12,color:P.grey,align:"left"}); D.line(c,ax.X(yr.value),ax.B,ax.X(yr.value),ax.T,P.violet,1.5,[4,4]);
      for (var i=0;i<5;i++){
        (function(i){ D.fn(c,ax,function(x){ var j=Math.min(out.length-1,Math.max(0,Math.round(x/.2))); return out[j][i+1]; },COL[i],which.value===i?4:2.4,which.value===i?[6,4]:null); })(i);
      }
      var last = out[out.length-1], gone = [];
      for (i=0;i<5;i++){ ro.set(i, last[i+1]<1 ? "disparue" : S.fmt(last[i+1],0)+" %"); if (last[i+1]<15 && i!==which.value) gone.push(NM[i]); }
      var lx = 8; NM.forEach(function(n,i){ var row = i<3?0:1, col = i<3?i:i-3, w = c.W/3; rect(c,6+col*w,8+row*18,10,10,COL[i]); T(c,n,20+col*w,13+row*18,{size:12,align:"left",color:P.ink}); });
      if (which.value<0) nt.set("Rien ne change : l'écosystème est à l'équilibre (les cinq courbes restent à 100 %).","ok");
      else if (gone.length) nt.set("Effet en cascade : <b>"+gone.join(", ")+"</b> disparaî"+(gone.length>1?"ssent":"t")+" aussi (ou "+(gone.length>1?"sont":"est")+" au bord de la disparition), faute de nourriture.","bad");
      else if (frac.value<100 && Math.abs(last[which.value+1]-100)<15) nt.set("L'écosystème a <b>encaissé</b> la perte : l'espèce touchée est revenue près de son équilibre.","ok");
      else nt.set("Les autres espèces se réorganisent : certaines augmentent, d'autres diminuent. Compare les courbes à 100 %.","warn");
    });
  }
});

/* ===== 3 · Régimes alimentaires ===== */
SFA.sim({
  id:"b3-c01-regimes", ch:"c01", tag:"Classique · manipulation directe",
  titre:"Régime alimentaire et niveau trophique",
  resume:"Compose une assiette en faisant glisser ses deux poignées : herbivore, omnivore ou carnivore ? Lis le niveau trophique.",
  but:"Fais glisser les poignées sur le bord de l'assiette (ou utilise les curseurs) pour régler la part de végétaux, d'animaux herbivores et d'animaux carnivores. Lis le niveau trophique et l'énergie des producteurs qui arrive jusqu'à l'espèce.",
  aRetenir:"Niveau trophique = 1 + niveau moyen des aliments (végétal : 1, herbivore : 2, carnivore : 3). Un herbivore strict est consommateur de 1er ordre (niveau 2) ; plus on mange haut, moins il reste d'énergie des producteurs.",
  piege:"Omnivore ne veut pas dire « niveau 3 » : l'humain omnivore se situe entre les niveaux 2 et 3, selon la part de viande dans son assiette. Les valeurs des animaux sont des ordres de grandeur.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1.2});
    var pre = k.select("Espèce type", [["x","— à toi de jouer —"],["vache","Vache"],["loup","Loup"],["ours","Ours brun"],["vege","Humain végétarien"],["omni","Humain omnivore"],["inuit","Inuit traditionnel"]], "omni", function(v){
      var T0 = {vache:[100,0], loup:[0,95], ours:[70,25], vege:[100,0], omni:[55,40], inuit:[0,40]};
      if (T0[v]){ pv.set(T0[v][0]); ph.set(T0[v][1]); }
    });
    var pv = k.slider("Végétaux", 0, 100, 1, 55, "%");
    var ph = k.slider("Animaux herbivores (bœuf, lapin, poulet…)", 0, 100, 1, 40, "%");
    var ro = k.readouts(["Part de carnivores mangés","Niveau trophique","Type de régime","Énergie des producteurs qui arrive"]);
    var nt = k.note("","");
    var drag = 0, GEO = {};
    function ang(p){ return -Math.PI/2 + p/100*2*Math.PI; }
    c.pointer(function(type,p){
      if (type==="down"){ var d1=Math.hypot(p.x-GEO.h1[0],p.y-GEO.h1[1]), d2=Math.hypot(p.x-GEO.h2[0],p.y-GEO.h2[1]); drag = Math.min(d1,d2)<26 ? (d1<=d2?1:2) : 0; }
      if (type==="up"){ drag=0; return; }
      if (!drag) return;
      var a = Math.atan2(p.y-GEO.cy,p.x-GEO.cx)+Math.PI/2; if (a<0) a+=2*Math.PI; var pc = Math.round(a/(2*Math.PI)*100);
      var v = pv.value, h = Math.min(ph.value,100-v), cc = 100-v-h;
      if (drag===1){ var nv = Math.min(pc>=95&&v<50?0:pc,100-cc); if (v>85 && pc<15) nv=100-cc; pv.set(nv); ph.set(100-cc-nv); }
      else { var tot = pc; if (v+h>85 && pc<15) tot=100; if (v+h<15 && pc>85) tot=0; tot=Math.max(v,Math.min(100,tot)); ph.set(tot-v); }
      pre.set("x"); k.redraw();
    });
    k.draw(function(){
      var v = pv.value, h = Math.min(ph.value, 100 - v), cc = 100 - v - h;
      if (h !== ph.value) ph.set(h);
      c.clear(); var g=c.ctx, W=c.W, H=c.H;
      var L = 1 + (v*1 + h*2 + cc*3)/100;
      var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#f6faf4"); bgc.addColorStop(1,"#eaf1f7"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      var cx=W/2, cy=H*.3, r=Math.min(W*.26,H*.2);
      GEO.cx=cx; GEO.cy=cy;
      /* assiette */
      g.save(); g.shadowColor="rgba(15,27,45,.22)"; g.shadowBlur=14; g.shadowOffsetY=4; g.beginPath(); g.arc(cx,cy,r+11,0,6.3); g.fillStyle="#fff"; g.fill(); g.restore();
      g.beginPath(); g.arc(cx,cy,r+11,0,6.3); g.strokeStyle="#d5dce6"; g.lineWidth=1.5; g.stroke();
      var parts=[[v,"#a9d9b6","#2d8a4f","herbe"],[h,"#f6cd8c","#c26a0c","souris"],[cc,"#eaa090","#c0321d","couleuvre"]], a0=0;
      parts.forEach(function(s){ if (s[0]<=0) return; var a1=a0+s[0];
        g.beginPath(); g.moveTo(cx,cy); g.arc(cx,cy,r,ang(a0),ang(a1)); g.closePath(); g.fillStyle=s[1]; g.fill(); g.strokeStyle="#fff"; g.lineWidth=2; g.stroke();
        if (s[0]>=14){ var am=ang((a0+a1)/2), ir=r*.58; g.save(); g.beginPath(); g.arc(cx,cy,r,0,6.3); g.clip(); B3H.draw(s[3],c,cx+Math.cos(am)*ir,cy+Math.sin(am)*ir,Math.min(r*.55,s[0]*1.1+14),1); g.restore(); }
        if (s[0]>=7){ var am2=ang((a0+a1)/2); D.label(c,Math.round(s[0])+" %",cx+Math.cos(am2)*r*.9,cy+Math.sin(am2)*r*.9,{size:11,color:s[2]}); }
        a0=a1; });
      /* poignées */
      var p1=ang(v), p2=ang(v+h); GEO.h1=[cx+Math.cos(p1)*(r+11),cy+Math.sin(p1)*(r+11)]; GEO.h2=[cx+Math.cos(p2)*(r+11),cy+Math.sin(p2)*(r+11)];
      [GEO.h1,GEO.h2].forEach(function(q,i){ D.glow(c,q[0],q[1],20,P.violet,.28); g.beginPath(); g.arc(q[0],q[1],10,0,6.3); g.fillStyle="#fff"; g.fill(); g.lineWidth=3; g.strokeStyle=P.violet; g.stroke(); g.fillStyle=P.violet; g.beginPath(); g.arc(q[0],q[1],3.2,0,6.3); g.fill(); });
      /* étiquettes de parts */
      var lx=[[v,"Végétaux","#2d8a4f"],[h,"Herbivores","#c26a0c"],[cc,"Carnivores","#c0321d"]]; var ys=H*.03;
      
      /* échelle des niveaux */
      var bx=Math.max(34,W*.1), bw=W-2*bx, ay=H*.8;
      D.text(c,"Niveau trophique du mangeur",W/2,H*.6,{size:12.5,color:P.ink});
      var X=function(l){ return bx+(l-1)/3*bw; };
      var gr=g.createLinearGradient(bx,0,bx+bw,0); gr.addColorStop(0,"#7fcf97"); gr.addColorStop(.33,"#f2c36b"); gr.addColorStop(.66,"#e88c78"); gr.addColorStop(1,"#c0699a");
      D.rrect(c,bx,ay-6,bw,12,6); g.fillStyle=gr; g.fill();
      [["herbe","1 · prod."],["souris","2 · cons. I"],["couleuvre","3 · cons. II"],["buse","4 · cons. III"]].forEach(function(s,i){
        var xx=X(i+1); g.beginPath(); g.arc(xx,ay,15,0,6.3); g.fillStyle="#fff"; g.fill(); g.strokeStyle="#c9d2de"; g.lineWidth=1.5; g.stroke();
        g.save(); g.beginPath(); g.arc(xx,ay,14,0,6.3); g.clip(); B3H.draw(s[0],c,xx,ay+(s[0]==="herbe"?3:0),24,1); g.restore();
        D.text(c,s[1],Math.max(34,Math.min(W-34,xx)),ay+30,{size:11,color:P.grey}); });
      var mx=X(L); D.arrow(c,mx,ay-58,mx,ay-19,P.violet,3.4); D.label(c,S.fmt(L,2),mx,ay-68,{size:14,color:P.violet});
      D.text(c,"aliments : végétal 1 · herbivore 2 · carnivore 3",W/2,H*.96,{size:11,color:P.grey});
      var kind = (v>=95) ? "Herbivore" : (v<=5) ? "Carnivore" : "Omnivore";
      var cons = L<=2.05 ? "consommateur I" : L<2.95 ? "entre C I et C II" : L<=3.05 ? "consommateur II" : L<3.95 ? "entre C II et C III" : "consommateur III";
      ro.set(0,cc+" %"); ro.set(1,S.fmt(L,2)+" ("+cons+")"); ro.set(2,kind); ro.set(3,S.fmt(100*Math.pow(.1,L-1),2)+" %");
      nt.set(kind==="Omnivore" ? "Régime omnivore : le niveau trophique tombe <b>entre</b> deux niveaux entiers." : kind==="Herbivore" ? "Herbivore : il est au 2<sup>e</sup> niveau, juste au-dessus des producteurs." : "Carnivore : il se nourrit d'animaux, donc plus haut dans la chaîne.", "ok");
    });
  }
});

/* ===== 4 · Décomposeurs ===== */
SFA.sim({
  id:"b3-c01-decomposeurs", ch:"c01", tag:"Animation · cycle de la matière",
  titre:"Les décomposeurs au travail",
  resume:"Une feuille morte, un cadavre ou une branche : regarde la matière disparaître, le CO₂ s'échapper et les sels minéraux nourrir la plante.",
  but:"Choisis la matière, la température et l'humidité. Lance le temps (ou glisse le curseur « Jour ») et observe la masse restante, le CO₂ rejeté et la croissance de la plante. Puis retire les décomposeurs.",
  aRetenir:"Les décomposeurs (bactéries, champignons, vers) transforment la matière morte en CO₂, eau et sels minéraux, réutilisables par les producteurs. Ils vont plus vite quand il fait chaud et humide. Sans eux, la matière morte s'accumulerait et les sols s'appauvriraient.",
  piege:"Le froid et la sécheresse ralentissent les décomposeurs, mais ne les rendent pas inutiles. Trop d'eau (sol saturé, marais) les ralentit aussi, faute de dioxygène. (Modèle simplifié, valeurs indicatives.)",
  build:function(k,S){
    var c = k.canvas(0,{ratio:.74});
    var gc = k.canvas(170);
    var mat = k.select("Matière morte", [["f","Feuilles de hêtre"],["s","Cadavre de souris"],["b","Branche de chêne"]], "f");
    var tt = k.slider("Température", 0, 35, 1, 15, "°C");
    var hh = k.slider("Humidité du milieu", 0, 100, 5, 60, "%");
    var dd = k.toggle("Décomposeurs présents", true);
    var day = k.slider("Jour", 0, 365, 1, 90, "j");
    var ro = k.readouts(["Masse restante","Matière rendue au milieu","Temps pour perdre la moitié"]);
    var nt = k.note("","");
    var K20 = {f:.0033, s:.05, b:.0004};
    var playing = false, parts = [], seed = 3;
    function rnd(){ seed = (seed*16807)%2147483647; return seed/2147483647; }
    function kk(){
      var f = Math.pow(2,(tt.value-20)/10), w = hh.value, hf = w<=60 ? w/60 : 1 - .5*(w-60)/40;
      return dd.value ? K20[mat.value]*f*hf : 0;
    }
    k.button("Lancer / arrêter le temps", function(){ playing = !playing; if (playing){ if (day.value>=365) day.set(0); lp.play(); } }, true);
    var lp = k.loop(function(dt,t){
      if (playing){ var sp = mat.value==="b" ? 40 : mat.value==="s" ? 10 : 28; var nd = day.value + dt*sp; if (nd>=365){ nd=365; playing=false; } day.set(nd); }
      var kv = kk(), act = Math.min(1, kv/K20[mat.value]/2.8), m = Math.exp(-kv*day.value);
      var rate = act*(mat.value==="s"?7:4)*(m>.03?1:0);
      if (rnd() < rate*dt*3) parts.push({t:"co2", x:.2+rnd()*.2, y:.34, a:0});
      if (rnd() < rate*dt*2.2) parts.push({t:"min", x:.28+rnd()*.12, y:.5, a:0});
      parts.forEach(function(p){ p.a += dt; if (p.t==="co2"){ p.y -= dt*.12; p.x += Math.sin(p.a*3+p.x*9)*.0015; } else { p.x += dt*.07; p.y += (.66-p.y)*dt*.4; } });
      parts = parts.filter(function(p){ return p.a<4 && p.x<.78; });
      k.redraw();
      if (!playing && !parts.length) lp.pause();
    });
    lp.play();
    function item(g,mm,t){
      var x = c.W*.3, y = c.H*.345, s = c.W*.3, q = Math.max(.12, mm);
      g.save(); g.globalAlpha = Math.max(.25, Math.min(1, .3+mm));
      if (mat.value==="f"){ var cols=["#c98a2e","#b4561f","#d9a441","#a3481d","#cf7f26"]; var n=Math.ceil(14*mm); for (var i=0;i<n;i++){ var a=i*2.4, rx=(i%5-2)*s*.17, ry=-Math.floor(i/5)*s*.07; g.save(); g.translate(x+rx,y+ry-4); g.rotate(a); g.fillStyle=cols[i%5]; g.beginPath(); g.ellipse(0,0,s*.13,s*.06,0,0,6.3); g.fill(); g.strokeStyle="#6b3a12"; g.lineWidth=.8; g.beginPath(); g.moveTo(-s*.13,0); g.lineTo(s*.13,0); g.stroke(); g.restore(); } }
      else if (mat.value==="s"){ B3H.souris(c,x,y-s*.14*q,s*(.6+.4*q),1); if (mm<.5){ g.strokeStyle="#efe6d6"; g.lineWidth=2; g.beginPath(); g.moveTo(x-s*.25,y-4); g.lineTo(x+s*.25,y-4); g.stroke(); } }
      else { g.fillStyle="#7a5232"; g.strokeStyle="#4b2f19"; g.lineWidth=1.3; var h=s*.2*q+3; D.rrect(c,x-s*.45,y-h-2,s*.9,h,3); g.fill(); g.stroke(); g.strokeStyle="#9b6e45"; g.beginPath(); g.moveTo(x-s*.3,y-h*.6-2); g.lineTo(x+s*.3,y-h*.6-2); g.stroke(); }
      g.restore();
    }
    k.draw(function(){
      var kv = kk(), m = Math.exp(-kv*day.value), act = Math.min(1, kv/K20[mat.value]/2.8), W=c.W, H=c.H, g=c.ctx, t=Date.now()/1000;
      c.clear();
      var sky=g.createLinearGradient(0,0,0,H*.4); sky.addColorStop(0,"#cfe7f7"); sky.addColorStop(1,"#eef8ee"); g.fillStyle=sky; g.fillRect(0,0,W,H*.4);
      var soil=g.createLinearGradient(0,H*.4,0,H); soil.addColorStop(0,"#8a6340"); soil.addColorStop(.5,"#6d4a2e"); soil.addColorStop(1,"#4a3220"); g.fillStyle=soil; g.fillRect(0,H*.4,W,H*.6);
      g.fillStyle="#5a9a4a"; g.fillRect(0,H*.385,W,H*.02);
      g.fillStyle="rgba(255,255,255,.07)"; for (var i=0;i<26;i++){ var rx=(i*53%97)/97, ry=.45+((i*37)%53)/53*.5; g.beginPath(); g.arc(rx*W,ry*H,2+(i%3),0,6.3); g.fill(); }
      /* plante à droite */
      var rel = (100 - m*100)/100, ph = H*(.12+.2*rel), px = W*.8, py = H*.39;
      g.strokeStyle="#c9a27a"; g.lineWidth=1.5; for (i=0;i<6;i++){ g.beginPath(); g.moveTo(px,py); g.quadraticCurveTo(px-W*.05*(i-2.5)*.4,py+H*.1,px-W*(.28-i*.045),py+H*(.22+.04*(i%3))); g.stroke(); }
      g.strokeStyle="#3f8f4a"; g.lineWidth=4; g.lineCap="round"; g.beginPath(); g.moveTo(px,py); g.lineTo(px,py-ph); g.stroke();
      for (i=0;i<2+Math.round(rel*5);i++){ var yy=py-ph*(i+1)/(3+rel*5), sd=i%2?1:-1; g.fillStyle=i%2?"#4ea65b":"#3a8f4f"; g.beginPath(); g.ellipse(px+sd*14,yy,13,5,sd*-.5,0,6.3); g.fill(); }
      /* matière */
      item(g,m,t);
      /* décomposeurs */
      if (dd.value){ var nF = Math.round(1+act*4); for (i=0;i<nF;i++) B3H.champignon(c,W*.12+i*W*.07,H*.385-2,W*.1*(.8+.2*Math.sin(i)));
        var nV = Math.round(1+act*3); for (i=0;i<nV;i++){ var wx=W*(.2+.07*i)+Math.sin(t*(.8+i*.3)+i)*8; B3H.ver(c,wx,H*(.53+.07*(i%3)),W*.08,i%2?1:-1); }
        g.fillStyle="rgba(255,240,200,.85)"; for (i=0;i<Math.round(6+act*26);i++){ var bx=W*(.14+.3*((i*0.618)%1))+Math.sin(t*2+i)*2, by=H*(.42+.3*((i*0.37)%1)); g.beginPath(); g.arc(bx,by,1.6,0,6.3); g.fill(); } }
      parts.forEach(function(p){ if (p.t==="co2"){ g.globalAlpha=Math.max(0,1-p.a/4); D.label(c,"CO₂",p.x*W,p.y*H,{size:10.5,color:"#5a6675",fill:"rgba(255,255,255,.75)"}); g.globalAlpha=1; } else { D.dot(c,p.x*W,p.y*H,3.3,"#e8c34a"); } });
      D.label(c,"sels minéraux",W*.55,H*.72,{size:10.5,color:"#7a5b00",fill:"rgba(255,246,200,.9)"});
      D.label(c,"CO₂ + eau",W*.3,H*.12,{size:10.5,color:"#5a6675"});
      D.label(c,"Jour "+Math.round(day.value),W-8,12,{size:11.5,color:P.ink,align:"right"});
      if (!dd.value) D.label(c,"aucun décomposeur : rien ne se passe",W*.45,H*.9,{size:11.5,color:P.red});
      /* graphique */
      gc.clear();
      var ax = D.axes(gc,{x0:0,x1:365,y0:0,y1:100,xl:"jour",yl:"masse restante (%)",stepX:50,stepY:25,l:50,t:34});
      D.fn(gc,ax,function(x){ return 100*Math.exp(-kv*x); },P.green,3.2);
      var mm = m*100;
      D.line(gc,ax.X(day.value),ax.B,ax.X(day.value),ax.Y(mm),P.grey,1.5,[4,4]); D.line(gc,ax.L,ax.Y(mm),ax.X(day.value),ax.Y(mm),P.grey,1.5,[4,4]);
      D.dot(gc,ax.X(day.value),ax.Y(mm),6,P.violet);
      ro.set(0,S.fmt(mm,1)+" %"); ro.set(1,S.fmt(100-mm,1)+" %");
      var half = kv>0 ? Math.log(2)/kv : Infinity;
      ro.set(2, kv>0 ? (half<2 ? S.fmt(half*24,0)+" h" : half<1000 ? S.fmt(half,0)+" jours" : "plusieurs années") : "jamais");
      if (!dd.value) nt.set("Sans décomposeurs, rien ne se décompose : la matière s'accumule et ses sels minéraux restent bloqués. Les producteurs finiraient par manquer de minéraux.","bad");
      else if (tt.value<=3 || hh.value<=10) nt.set("Trop froid ou trop sec : les décomposeurs sont presque à l'arrêt. C'est pourquoi on conserve des aliments au frigo ou séchés.","warn");
      else if (hh.value>=95) nt.set("Sol saturé d'eau : peu de dioxygène, décomposition lente (tourbières).","warn");
      else nt.set("La matière restituée ("+S.fmt(100-mm,0)+" %) repart en CO₂, eau et sels minéraux : la plante grandit, le cycle est bouclé.","ok");
    });
  }
});

})();
