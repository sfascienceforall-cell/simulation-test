(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }

/* ===== 1 · Eutrophisation ===== */
SFA.sim({
  id:"b3-c10-eutrophisation", ch:"c10", tag:"Modèle chiffré · tombe souvent",
  titre:"Eutrophisation d'un étang : engrais, algues, manque d'oxygène",
  resume:"Plus de phosphore = plus d'algues = moins de O₂ la nuit. Quand les poissons étouffent-ils ?",
  but:"Règle le phosphore (engrais, lessives) et la température de l'eau. Fais glisser l'heure et suis le dioxygène dissous. Lis quelles espèces survivent.",
  aRetenir:"Les engrais et rejets riches en phosphore et azote nourrissent les algues : elles prolifèrent. De jour, elles produisent du O₂ ; la nuit, elles respirent, et en mourant elles sont décomposées par des bactéries qui consomment beaucoup de O₂. Le O₂ dissous chute (surtout au petit matin), jusqu'à étouffer poissons et invertébrés sensibles. La capacité de l'eau à dissoudre O₂ diminue quand l'eau se réchauffe.",
  piege:"L'eau verte et riche en algues semble « vivante » : c'est un signe de déséquilibre. Et le danger n'est pas en plein jour mais la nuit et à l'aube, quand les algues respirent sans produire de O₂. (Relations simplifiées, valeurs indicatives.)",
  build:function(k,S){
    var c1 = k.canvas(190), c2 = k.canvas(190);
    var ph = k.slider("Phosphore dans l'eau", 5, 200, 5, 20, "µg/L");
    var tp = k.slider("Température de l'eau", 5, 28, 1, 18, "°C");
    var hr = k.slider("Heure du jour", 0, 23, 1, 6, "h");
    var ro = k.readouts(["Algues (chlorophylle)","O₂ à cette heure","O₂ minimal de la nuit","Poissons"]);
    var nt = k.note("","");
    function st(){ var B = .28*Math.pow(ph.value,.96), sat = 14.6-.39*tp.value+.0057*tp.value*tp.value, A = .12*B, mean = sat-.1*B;
      return {B:B, sat:sat, A:A, mean:mean, f:function(t){ return Math.max(0,Math.min(1.4*sat,mean+A*Math.sin(2*Math.PI*(t-9)/24))); }}; }
    k.draw(function(){
      var s = st(), cur = s.f(hr.value), mn = 99, tmin = 0, h;
      for (h=0;h<=24;h+=.25){ var v = s.f(h); if (v<mn){ mn = v; tmin = h; } }
      /* étang */
      c1.clear(); var g = c1.ctx, G = Math.min(1,s.B/40), W = c1.W;
      g.fillStyle = mix([190,225,245],[70,140,60],G); g.fillRect(10,30,W-20,110); g.strokeStyle = P.ink; g.lineWidth = 2; g.strokeRect(10,30,W-20,110);
      for (var i=0;i<Math.round(6+G*30);i++){ var rr = rng(i+4); circ(c1,16+rr()*(W-32),34+rr()*20,2+rr()*3,"rgba(40,110,40,"+(0.35+G*.4)+")"); }
      var FISH = [["truite",6,"#e0884a"],["gardon",4,"#a9b8c9"],["carpe",2,"#d6b25a"]];
      FISH.forEach(function(f,j){ var alive = mn >= f[1], x = 40+j*(W-80)/2.4, y = 95+((j*13)%20);
        g.save(); g.globalAlpha = alive ? 1 : .35; g.fillStyle = alive ? f[2] : "#999"; g.beginPath(); g.ellipse(x,y,16,7,alive?0:Math.PI,0,6.2832); g.fill(); g.beginPath(); g.moveTo(x-14,y); g.lineTo(x-24,y-6); g.lineTo(x-24,y+6); g.closePath(); g.fill(); g.restore();
        T(c1,f[0]+(alive?"":" ✗"),x,y+20,{size:12,color:alive?P.ink:P.red}); });
      T(c1,"nuit (3 h) : O₂ minimal "+S.fmt(mn,1)+" mg/L",W/2,16,{size:12,color:P.ink});
      /* courbe */
      c2.clear(); var ax = D.axes(c2,{x0:0,x1:24,y0:0,y1:Math.max(14,Math.ceil(s.sat*1.5)),xl:"heure",yl:"O₂ dissous (mg/L)",stepX:6,l:50});
      FISH.forEach(function(f){ c2.ctx.save(); c2.ctx.setLineDash([4,4]); c2.ctx.strokeStyle = f[2]; c2.ctx.beginPath(); c2.ctx.moveTo(ax.L,ax.Y(f[1])); c2.ctx.lineTo(ax.R,ax.Y(f[1])); c2.ctx.stroke(); c2.ctx.restore(); T(c2,f[0]+" ≥ "+f[1],ax.R-2,ax.Y(f[1])-8,{size:12,align:"right",color:f[2]}); });
      D.fn(c2,ax,function(x){ return s.f(x); },P.acc,3); D.dot(c2,ax.X(hr.value),ax.Y(cur),6,P.violet);
      var alive = FISH.filter(function(f){ return mn>=f[1]; }).map(function(f){ return f[0]; });
      ro.set(0,S.fmt(s.B,0)+" µg/L"); ro.set(1,S.fmt(cur,1)+" mg/L"); ro.set(2,S.fmt(mn,1)+" mg/L à "+S.fmt(tmin,0)+" h"); ro.set(3, alive.length ? alive.join(", ") : "aucun");
      nt.set(alive.length===0 ? "Mort massive de poissons : le O₂ tombe presque à zéro la nuit. C'est l'aboutissement de l'eutrophisation." : alive.length<3 ? "Les espèces les plus exigeantes en O₂ ont disparu ("+FISH.filter(function(f){ return mn<f[1]; }).map(function(f){ return f[0]; }).join(", ")+") : l'écosystème s'appauvrit." : "Eau bien oxygénée, même la nuit : toutes les espèces survivent. Augmente le phosphore pour voir la bascule.", alive.length<3 ? "warn" : "ok");
    });
  }
});

/* ===== 2 · Pêche durable ===== */
SFA.sim({
  id:"b3-c10-peche-durable", ch:"c10", tag:"Modèle chiffré · défi",
  titre:"Pêche durable : jusqu'où peut-on prélever ?",
  resume:"Un stock de poissons se reproduit, la pêche prélève. Où est la limite avant l'effondrement ?",
  but:"Choisis un mode de gestion (quota fixe ou part prélevée), règle-le et regarde le bateau pêcher pendant 50 ans : les poissons nagent dans l'eau, la pêche les prélève. Teste le choc d'une mauvaise année.",
  aRetenir:"Un stock se renouvelle au maximum quand il vaut environ la moitié de sa capacité : c'est le rendement maximal durable (ici r × K / 4). Pêcher davantage ne donne pas plus de poissons : on vide le stock. Avec un quota fixe voisin du maximum, un seul choc (mauvaise année) peut provoquer l'effondrement.",
  piege:"« Plus de bateaux = plus de poissons » est faux au-delà d'un seuil. Un quota fixe est plus dangereux qu'une part fixe du stock : si le stock baisse, le quota ne s'ajuste pas. (Modèle logistique de Schaefer, simplifié ; stock en tonnes.)",
  build:function(k,S){
    var cs = k.canvas(0,{ratio:.5}), c1 = k.canvas(190), c2 = k.canvas(190);
    var md = k.seg("Gestion", [["q","Quota fixe (t/an)"],["f","Part du stock prélevée (%)"]], "q");
    var r = k.slider("Renouvellement naturel du stock (r)", .2, .8, .05, .4, "/an");
    var q = k.slider("Quota annuel", 0, 200, 10, 80, "t/an");
    var f = k.slider("Part du stock prélevée", 0, 80, 5, 20, "%");
    var sh = k.toggle("Mauvaise année à l'an 15 (stock − 25 %)", false);
    var yr = k.slider("Année affichée", 0, 50, 1, 50, "ans");
    var ro = k.readouts(["Rendement maximal durable","Stock après 50 ans","Prise la dernière année","Issue"]);
    var nt = k.note("","");
    var K = 1000, fish=[], play=false, seed=4, spl=[];
    function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
    for (var qi=0;qi<70;qi++) fish.push({x:rnd(),y:.3+rnd()*.62,v:(rnd()-.5)*.06,ph:rnd()*6});
    k.button("Lancer le film (50 ans)", function(){ if (yr.value>=50) yr.set(0); play=true; lp.play(); }, true);
    var lp = k.loop(function(dt){ if (play){ var ny=yr.value+dt*4; if (ny>=50){ ny=50; play=false; } yr.set(ny); }
      fish.forEach(function(f2){ f2.x+=f2.v*dt*2+Math.sin(f2.ph+Date.now()/1500)*.0004; if (f2.x<0||f2.x>1){ f2.v*=-1; f2.x=Math.max(0,Math.min(1,f2.x)); } }); k.redraw(); }); lp.play();
    function sea(N,h2){
      var g=cs.ctx, W=cs.W, H=cs.H, tt=Date.now()/1000; cs.clear();
      var sk=g.createLinearGradient(0,0,0,H*.28); sk.addColorStop(0,"#d8ebf8"); sk.addColorStop(1,"#f1f8fc"); g.fillStyle=sk; g.fillRect(0,0,W,H*.28);
      var sw=g.createLinearGradient(0,H*.26,0,H); sw.addColorStop(0,"#79c3e6"); sw.addColorStop(1,"#1f6fa0"); g.fillStyle=sw; g.fillRect(0,H*.26,W,H*.74);
      g.strokeStyle="rgba(255,255,255,.5)"; g.lineWidth=2; g.beginPath(); for (var x=0;x<=W;x+=8){ var yy=H*.26+Math.sin(x/18+tt*2)*2; x?g.lineTo(x,yy):g.moveTo(x,yy); } g.stroke();
      /* bateau */
      var bx=W*.5+Math.sin(tt*.8)*8, by=H*.2+Math.sin(tt*1.6)*2;
      g.fillStyle="#b3402e"; g.beginPath(); g.moveTo(bx-46,by); g.lineTo(bx+46,by); g.lineTo(bx+32,by+17); g.lineTo(bx-32,by+17); g.closePath(); g.fill(); g.fillStyle="#f3efe6"; g.fillRect(bx-10,by-18,22,18); g.strokeStyle="#4a3a2a"; g.lineWidth=2; g.beginPath(); g.moveTo(bx+22,by-30); g.lineTo(bx+22,by); g.stroke();
      g.strokeStyle="#e8e2d2"; g.lineWidth=1.3; g.beginPath(); g.moveTo(bx-36,by-4); g.lineTo(bx-36,by+(H*.5)); g.stroke(); g.beginPath(); g.moveTo(bx-36,by+H*.5); g.lineTo(bx-70,by+H*.5-20); g.lineTo(bx-2,by+H*.5-20); g.closePath(); g.fillStyle="rgba(255,255,255,.18)"; g.fill();
      /* poissons */
      var nf=Math.round(Math.min(70,N/K*70+(N>1?1:0)));
      for (var i=0;i<nf;i++){ var f2=fish[i]; B3H.poisson(cs,f2.x*W,f2.y*H,Math.max(15,W*.045),f2.v>=0?1:-1,i%5?"#f2a33c":"#f0c24a"); }
      D.display(cs,S.fmt(N,0)+" t",W-62,H*.16,{w:104,h:46,caption:"stock",color:N<K*.3?"#a8321d":"#13233a"});
      D.label(cs,"prise : "+S.fmt(h2,0)+" t/an",8,H*.07,{size:11.5,color:"#fff",fill:"rgba(15,60,90,.7)",align:"left"});
      D.label(cs,"an "+Math.round(yr.value),8,H*.19,{size:11.5,color:"#fff",fill:"rgba(15,60,90,.7)",align:"left"});
      if (N<1) D.label(cs,"stock effondré",W/2,H*.62,{size:13,color:P.red});
    }
    function run(){
      var N = K, dt = .05, out = [], i, dead = null;
      for (i=0;i<=1000;i++){
        var t = i*dt; if (i%10===0) out.push([t,N,md.value==="q" ? (N>0?Math.min(q.value,N/dt):0) : f.value/100*N]);
        if (sh.value && i===300) N *= .75;
        var h = md.value==="q" ? Math.min(q.value,N/dt) : f.value/100*N;
        N = N + dt*(r.value*N*(1-N/K) - h);
        if (N <= 1e-6){ N = 0; if (dead===null) dead = t; }
      }
      return {out:out, dead:dead, N:N};
    }
    k.draw(function(){
      var o = run().out, res = run(), msy = r.value*K/4;
      var yi=Math.min(o.length-1,Math.round(yr.value*2)); sea(o[yi][1],o[yi][2]);
      c1.clear(); var ax = D.axes(c1,{x0:0,x1:50,y0:0,y1:K,xl:"année",yl:"stock (t)",stepX:10,stepY:250,l:50});
      D.fn(c1,ax,function(x){ return o[Math.min(o.length-1,Math.round(x*2))][1]; },P.teal,3);
      D.line(c1,ax.X(yr.value),ax.B,ax.X(yr.value),ax.T,P.grey,1.5,[4,4]);
      c1.ctx.save(); c1.ctx.setLineDash([5,4]); c1.ctx.strokeStyle = P.grey; c1.ctx.beginPath(); c1.ctx.moveTo(ax.L,ax.Y(K/2)); c1.ctx.lineTo(ax.R,ax.Y(K/2)); c1.ctx.stroke(); c1.ctx.restore(); T(c1,"stock de rendement maximal (K/2)",ax.R-4,ax.Y(K/2)-9,{size:12,align:"right",color:P.grey});
      /* diagramme production / prélèvement */
      c2.clear(); var bx = D.axes(c2,{x0:0,x1:K,y0:0,y1:Math.max(120,Math.ceil(Math.max(msy,md.value==="q"?q.value:0)/20)*20+40),xl:"stock N (t)",yl:"t/an",stepX:250,l:50,t:32});
      D.fn(c2,bx,function(x){ return r.value*x*(1-x/K); },P.green,3);
      if (md.value==="q"){ D.line(c2,bx.L,bx.Y(q.value),bx.R,bx.Y(q.value),P.red,2.5); T(c2,"quota",bx.R-4,bx.Y(q.value)-9,{size:12,align:"right",color:P.red}); }
      else { var fe = f.value/100, xe = fe>0 ? Math.min(K, bx.y1/fe) : K; D.line(c2,bx.X(0),bx.Y(0),bx.X(xe),bx.Y(fe*xe),P.red,2.5); T(c2,"prélèvement",bx.X(xe*.62),bx.Y(fe*xe*.62)-10,{size:12,align:"left",color:P.red}); }
      T(c2,"vert : renouvellement naturel du stock",c2.W/2,10,{size:12,color:P.green});
      var last = o[o.length-1], catchLast = last[2];
      ro.set(0,S.fmt(msy,0)+" t/an"); ro.set(1,S.fmt(res.N,0)+" t"); ro.set(2,S.fmt(catchLast,0)+" t"); 
      var coll = res.N < 1;
      ro.set(3, coll ? "effondrement" : (res.N < K*.3 ? "stock fragile" : "durable"));
      var over = md.value==="q" ? q.value>msy : f.value/100>=r.value;
      nt.set(coll ? (over ? "Prélèvement supérieur au renouvellement maximal : le stock s'effondre tôt ou tard." : "Le choc de la mauvaise année a fait passer le stock sous le point de non-retour : malgré un quota inférieur au maximum, il s'effondre.") : res.N<K*.3 ? "Le stock survit mais reste très bas : la moindre perturbation peut le faire disparaître." : "Gestion durable : le stock se stabilise et la pêche peut continuer chaque année.", coll ? "warn" : "ok");
    });
  }
});

/* ===== 3 · Espèce invasive ===== */
SFA.sim({
  id:"b3-c10-invasive", ch:"c10", tag:"Modèle chiffré",
  titre:"Espèce invasive : exclusion, coexistence ou échec ?",
  resume:"Une espèce introduite partage les ressources d'une espèce locale. Qui gagne ?",
  but:"Choisis un scénario (ou règle toi-même les effets de chaque espèce sur l'autre) et le nombre d'individus introduits. Lance le film : regarde les deux populations se partager (ou non) le milieu pendant 100 ans.",
  aRetenir:"Une espèce introduite peut exclure une espèce locale si elle exploite mieux les ressources (peu de prédateurs ou de maladies dans son nouveau milieu). Parfois il y a coexistence ; parfois l'envahisseur échoue. La rapidité de reproduction et le nombre d'individus introduits comptent.",
  piege:"Toutes les espèces introduites ne deviennent pas invasives : beaucoup disparaissent. Mais celles qui s'installent peuvent être très difficiles à éliminer. Et la disparition d'une espèce locale n'est pas sans effet sur le réseau : d'autres espèces en dépendent. (Modèle de compétition de Lotka-Volterra, simplifié ; capacité de 100 pour chaque espèce.)",
  build:function(k,S){
    var ca = k.canvas(0,{ratio:.62});
    var c = k.canvas(230);
    var sc = k.select("Scénario", [["x","À moi de régler"],["d","Envahisseur dominant"],["c","Coexistence"],["r","Espèce locale résistante"],["u","Duel incertain"]], "d", function(v){
      var T0 = {d:[1.5,.5],c:[.6,.6],r:[.5,1.5],u:[1.4,1.4]}; if (T0[v]){ al.set(T0[v][0]); be.set(T0[v][1]); }
    });
    var al = k.slider("Effet de l'envahisseur sur l'espèce locale", .2, 2, .1, 1.5, "×");
    var be = k.slider("Effet de l'espèce locale sur l'envahisseur", .2, 2, .1, .5, "×");
    var r2 = k.slider("Reproduction de l'envahisseur", .2, 1.2, .1, .8, "/an");
    var n0 = k.slider("Individus introduits", 1, 60, 1, 5, "");
    var yr = k.slider("Année affichée", 0, 100, 1, 100, "ans");
    var ro = k.readouts(["Espèce locale après 100 ans","Envahisseur après 100 ans","Issue"]);
    var nt = k.note("","");
    var agents = {a:[],b:[]}, play=false, seed=21, OUT=[];
    function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
    function mk(){ return {x:rnd(),y:rnd(),vx:(rnd()-.5)*.12,vy:(rnd()-.5)*.12}; }
    for (var q=0;q<44;q++){ agents.a.push(mk()); agents.b.push(mk()); }
    k.button("Lancer le film (100 ans)", function(){ if (yr.value>=100) yr.set(0); play=true; lp.play(); }, true);
    var lp = k.loop(function(dt){ if (play){ var ny=yr.value+dt*12; if (ny>=100){ ny=100; play=false; } yr.set(ny); }
      ["a","b"].forEach(function(n){ agents[n].forEach(function(p){ p.vx+=(rnd()-.5)*.08*dt*20; p.vy+=(rnd()-.5)*.08*dt*20; p.vx*=.97; p.vy*=.97; p.x+=p.vx*dt*2; p.y+=p.vy*dt*2; if (p.x<.03||p.x>.97) p.vx*=-1; if (p.y<.05||p.y>.95) p.vy*=-1; p.x=Math.max(.02,Math.min(.98,p.x)); p.y=Math.max(.04,Math.min(.96,p.y)); }); }); k.redraw(); }); lp.play();
    function arena(n1,n2){
      var g=ca.ctx, W=ca.W, H=ca.H; ca.clear(); var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#d9ecc9"); bgc.addColorStop(1,"#bcdca6"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      g.fillStyle="rgba(255,255,255,.25)"; for (var i=0;i<30;i++){ g.beginPath(); g.arc(((i*.137)%1)*W,((i*.291)%1)*H,3,0,6.3); g.fill(); }
      function bug(p,col,dk){ var x=p.x*W,y=p.y*H,ang=Math.atan2(p.vy,p.vx); g.save(); g.translate(x,y); g.rotate(ang); g.fillStyle=col; g.strokeStyle=dk; g.lineWidth=1.2; g.beginPath(); g.ellipse(0,0,8,5,0,0,6.3); g.fill(); g.stroke(); g.fillStyle="#fff"; g.beginPath(); g.arc(5,-2,1.8,0,6.3); g.arc(5,2,1.8,0,6.3); g.fill(); g.restore(); }
      var ka=Math.round(Math.min(44,n1/100*44+(n1>.5?1:0))), kb=Math.round(Math.min(44,n2/100*44+(n2>.5?1:0)));
      for (i=0;i<ka;i++) bug(agents.a[i],"#52b36e","#1d5a33"); for (i=0;i<kb;i++) bug(agents.b[i],"#e2523c","#8a2316");
      D.legend(ca,[["#52b36e","Espèce locale : "+S.fmt(n1,0)],["#e2523c","Envahisseur : "+S.fmt(n2,0)]],6,6,{});
      D.label(ca,"année "+Math.round(yr.value),W-8,14,{size:11.5,color:P.ink,align:"right"});
    }
    k.draw(function(){
      var N1 = 100, N2 = n0.value, r1 = .5, dt = .02, out = [], i, a = al.value, b = be.value;
      for (i=0;i<=5000;i++){
        if (i%25===0) out.push([i*dt,N1,N2]);
        var d1 = function(x,y){ return r1*x*(1-(x+a*y)/100); }, d2 = function(x,y){ return r2.value*y*(1-(y+b*x)/100); };
        var k1a = d1(N1,N2), k1b = d2(N1,N2), k2a = d1(N1+dt/2*k1a,N2+dt/2*k1b), k2b = d2(N1+dt/2*k1a,N2+dt/2*k1b), k3a = d1(N1+dt/2*k2a,N2+dt/2*k2b), k3b = d2(N1+dt/2*k2a,N2+dt/2*k2b), k4a = d1(N1+dt*k3a,N2+dt*k3b), k4b = d2(N1+dt*k3a,N2+dt*k3b);
        N1 = Math.max(0,N1+dt*(k1a+2*k2a+2*k3a+k4a)/6); N2 = Math.max(0,N2+dt*(k1b+2*k2b+2*k3b+k4b)/6);
      }
      OUT=out; var ci=Math.min(out.length-1,Math.round(yr.value/.5)); arena(out[ci][1],out[ci][2]);
      c.clear(); var ax = D.axes(c,{x0:0,x1:100,y0:0,y1:110,xl:"temps (années)",yl:"effectif",stepX:20,stepY:25,l:46});
      D.fn(c,ax,function(x){ return out[Math.min(out.length-1,Math.round(x/.5))][1]; },P.green,3);
      D.fn(c,ax,function(x){ return out[Math.min(out.length-1,Math.round(x/.5))][2]; },P.red,3);
      D.line(c,ax.X(yr.value),ax.B,ax.X(yr.value),ax.T,P.grey,1.5,[4,4]);
      T(c,"espèce locale",ax.X(22),ax.T+8,{size:12,align:"left",color:P.green}); T(c,"envahisseur",ax.X(58),ax.T+8,{size:12,align:"left",color:P.red});
      var p1 = out[out.length-21][1], p2 = out[out.length-21][2], g1 = N1<1 || (N1<10 && N1<p1*.9), g2 = N2<1 || (N2<10 && N2<p2*.9);
      ro.set(0,N1<1 ? "disparue" : g1 ? S.fmt(N1,0)+" (en voie de disparition)" : S.fmt(N1,0)); ro.set(1,N2<1 ? "disparu" : g2 ? S.fmt(N2,0)+" (en voie de disparition)" : S.fmt(N2,0));
      var iss = g1 ? "exclusion de l'espèce locale" : g2 ? "échec de l'invasion" : "coexistence";
      ro.set(2,iss);
      nt.set(g1 ? "L'espèce locale est éliminée (ou condamnée) : l'envahisseur utilise mieux les ressources. Seule une intervention humaine précoce pourrait l'éviter." : g2 ? "L'envahisseur n'arrive pas à s'installer : l'espèce locale, bien établie, résiste." : "Les deux espèces coexistent, avec des effectifs réduits pour l'espèce locale (< 100).", g1 ? "warn" : "ok");
    });
  }
});

/* ===== 4 · Bioindicateur ===== */
SFA.sim({
  id:"b3-c10-bioindicateur", ch:"c10", tag:"Original · niche",
  titre:"Bioindicateurs : lire la qualité d'une rivière dans le filet",
  resume:"Les larves d'insectes et autres invertébrés d'un ruisseau disent si l'eau est polluée : sensibles ou tolérants.",
  but:"Fais varier la pollution organique et vois quels invertébrés subsistent. Puis relève un échantillon mystère et estime sa pollution.",
  aRetenir:"Certains invertébrés (larves de perles, d'éphémères, de trichoptères) exigent une eau propre et bien oxygénée : leur présence indique une bonne qualité. D'autres (aselles, vers de vase rouges, tubifex) supportent une eau très polluée. L'indice biotique combine la sensibilité du taxon le plus exigeant et la diversité.",
  piege:"L'absence d'un taxon sensible ne prouve pas à elle seule une pollution (courant, substrat, saison jouent aussi). Et ces indicateurs réagissent surtout aux pollutions organiques (manque d'oxygène). Ils ne remplacent pas des analyses chimiques. (Indice SFA simplifié, inspiré de l'indice biotique belge ; seuils indicatifs.)",
  build:function(k,S){
    var c = k.canvas(330);
    var mod = k.seg("Mode", [["e","Exploration"],["m","Relevé mystère"]], "e");
    var po = k.slider("Pollution organique de l'eau (exploration) / ton estimation (mystère)", 0, 100, 5, 20, "%");
    k.button("Nouveau relevé mystère", function(){ seed++; hidden = Math.round(rng(seed*31+7)()*20)*5; checked = false; mod.set("m"); }, false);
    k.button("Vérifier mon estimation", function(){ checked = true; });
    var ro = k.readouts(["Taxa présents","Groupe le plus sensible","Indice biotique (/10)","Qualité"]);
    var nt = k.note("","");
    var seed = 3, hidden = 40, checked = false;
    var TX = [["Plécoptères",5,15,"#2e6b55"],["Éphémères",4,25,"#3a8d6a"],["Trichoptères",4,30,"#58a27d"],["Gammares",3,45,"#c9a227"],["Aselles",2,65,"#d4822a"],["Sangsues",2,70,"#c25b2a"],["Chironomes rouges",1,90,"#a3322a"],["Tubifex",1,101,"#7a1f1f"]];
    function body(x,y,col,on,lab,i){
      var g = c.ctx; g.save(); g.globalAlpha = on ? 1 : .22; g.fillStyle = on ? col : "#9aa5b1"; g.strokeStyle = P.ink; g.lineWidth = 1.2;
      g.beginPath(); g.ellipse(x,y,18,8,0,0,6.2832); g.fill(); g.stroke(); circ(c,x+16,y,5,on?col:"#9aa5b1",P.ink,1);
      for (var j=-1;j<=1;j++){ g.beginPath(); g.moveTo(x+j*7,y+6); g.lineTo(x+j*7-3,y+13); g.stroke(); }
      if (i<3){ g.beginPath(); g.moveTo(x-18,y); g.lineTo(x-28,y-4); g.moveTo(x-18,y); g.lineTo(x-28,y+4); g.stroke(); }
      g.restore(); T(c,lab,x,y+26,{size:12,color:on?P.ink:P.grey});
    }
    k.draw(function(){
      c.clear(); var g = c.ctx, p = mod.value==="e" ? po.value : hidden, W = c.W, cols = W>420 ? 4 : 2;
      g.fillStyle = mix([200,230,245],[150,130,80],p/100); g.fillRect(8,8,W-16,TX.length/cols*58+36); 
      var pres = [], i;
      TX.forEach(function(q,j){ var on = p < q[2]; if (on) pres.push(q); var col = j%cols, row = Math.floor(j/cols), x = 8+ (W-16)*(col+.5)/cols - 8, y = 40+row*58; body(x,y,q[3],on,q[0],j); });
      var gm = pres.length ? Math.max.apply(null,pres.map(function(q){ return q[1]; })) : 0, ib = Math.min(10,Math.round(1.5*gm+.5*Math.min(pres.length,5)));
      var qual = ib>=9 ? "très bonne" : ib>=7 ? "bonne" : ib>=5 ? "moyenne" : ib>=3 ? "médiocre" : "mauvaise";
      T(c,"pollution organique (exploration)"+(mod.value==="m"?" : cachée":" : "+p+" %"),W/2,c.H-14,{size:12,color:P.grey});
      ro.set(0,pres.length+" / 8"); ro.set(1, gm ? (pres.filter(function(q){ return q[1]===gm; })[0][0]) : "—"); ro.set(2,ib+" / 10"); ro.set(3,qual);
      if (mod.value==="m"){
        if (!checked) nt.set("Relevé mystère : d'après les animaux présents, estime la pollution avec le curseur, puis clique sur « Vérifier ».","");
        else { var err = Math.abs(po.value-hidden); nt.set("Pollution réelle : "+hidden+" %. Ton estimation : "+po.value+" % (écart de "+err+" points). "+(err<=10?"Bien lu !":"Repère les taxa sensibles : plus ils manquent, plus la pollution est forte."), err<=10 ? "ok" : "warn"); }
        /* en mode mystère, la faune montre le relevé caché : l'indice affiché suit le relevé */
      } else nt.set(gm>=4 ? "Des taxa sensibles sont présents : eau propre et bien oxygénée." : ib>=5 ? "Les taxa sensibles ont disparu : pollution modérée." : "Seuls des organismes très tolérants subsistent : forte pollution organique, peu de O₂.", gm>=4 ? "ok" : "warn");
    });
  }
});
})();
