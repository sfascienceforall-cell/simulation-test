(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function actT(t){ return t<=37 ? Math.pow(2,(t-37)/10) : Math.max(0,1-Math.pow((t-37)/18,2)); }
function actPH(ph,opt,sd){ return Math.exp(-Math.pow((ph-opt)/sd,2)/2); }

/* ===== 1 · Voyage d'un repas ===== */
SFA.sim({
  id:"b3-c03-voyage-repas", ch:"c03", tag:"Classique · tombe souvent",
  titre:"Le voyage d'un repas dans le tube digestif",
  resume:"Suis un aliment de la bouche au gros intestin : durée, pH, enzymes et part déjà digérée.",
  but:"Choisis un aliment et fais avancer le curseur (ou lance la lecture). Observe l'organe traversé, son pH, les enzymes actives et le pourcentage digéré.",
  aRetenir:"La digestion mécanique (mastication, brassage de l'estomac) fragmente l'aliment ; la digestion chimique découpe ses molécules (amidon, protéines, lipides) en nutriments plus petits, grâce à des enzymes. Chaque enzyme travaille à un endroit précis, à un pH précis. La plus grande partie de la digestion se termine dans l'intestin grêle.",
  piege:"L'estomac ne digère que les protéines (début) : ce n'est pas lui qui absorbe l'essentiel des nutriments. Digestion ≠ élimination : les selles sont les restes non digérés, l'urine est une autre voie. (Durées et pH : valeurs indicatives.)",
  build:function(k,S){
    var c = k.canvas(400);
    var food = k.seg("Aliment", [["pain","Pain (amidon)"],["viande","Œuf, viande (protéines)"],["beurre","Beurre (lipides)"],["pomme","Pomme (sucres, fibres)"]], "pain");
    var pr = k.slider("Avancement dans le tube", 0, 100, 1, 20, "%");
    var lp = k.loop(function(dt){ var v = pr.value + dt*9; if (v >= 100){ v = 100; lp.pause(); } pr.set(v); k.redraw(); });
    k.button("▶ Lecture / pause", function(){ if (lp.running) lp.pause(); else { if (pr.value >= 100) pr.set(0); lp.play(); } }, true);
    var ro = k.readouts(["Organe","pH","Temps écoulé","Digéré (nutriments prêts)"]);
    var nt = k.note("","");
    var PATH = [
      {n:"Bouche",   a:0,  b:8,  pH:6.8, p:[[.5,.04],[.5,.10]], lab:[.5,.04,"left"], w:16},
      {n:"Œsophage", a:8,  b:14, pH:6.8, p:[[.5,.10],[.5,.22]], lab:[.5,.16,"left"], w:9},
      {n:"Estomac",  a:14, b:40, pH:2.0, p:[[.5,.22],[.40,.28],[.44,.36],[.58,.37],[.66,.33]], lab:[.36,.30,"right"], w:24},
      {n:"Intestin grêle", a:40, b:70, pH:8.0, p:[[.66,.33],[.70,.49],[.30,.54],[.70,.60],[.30,.66],[.70,.72],[.62,.80]], lab:[.5,.57,"mid"], w:10},
      {n:"Gros intestin", a:70, b:100, pH:6.5, p:[[.62,.80],[.88,.82],[.88,.42],[.12,.42],[.12,.88],[.5,.95]], lab:[.90,.62,"gi"], w:17}
    ];
    var TIME = [[0,0],[8,1],[14,1.5],[40,180],[70,420],[100,1440]];   /* % d'avancement → minutes */
    var DIG = {
      pain:[[0,0],[8,5],[40,6],[70,100],[100,100]],
      viande:[[0,0],[14,0],[40,30],[70,100],[100,100]],
      beurre:[[0,0],[14,0],[40,8],[70,100],[100,100]],
      pomme:[[0,0],[40,0],[70,90],[100,90]]
    };
    var TXT = {
      pain:["Mastication (digestion mécanique) et amylase salivaire : début de découpe de l'amidon.","Transport par ondes de contraction (péristaltisme) : aucune digestion.","Brassage ; l'acide arrête l'amylase de la salive : presque plus de digestion de l'amidon.","Amylase du pancréas puis enzymes de l'intestin : amidon → glucose. Le glucose est absorbé.","Il reste surtout des fibres : absorption d'eau, action des bactéries."],
      viande:["Mastication seulement : aucune enzyme de la bouche ne digère les protéines.","Transport par péristaltisme.","Acide (pH ≈ 2) et pepsine : les protéines sont coupées en morceaux (peptides).","Enzymes du pancréas (trypsine) et de l'intestin : peptides → acides aminés, absorbés.","Peu de nutriments restants : absorption d'eau, formation des selles."],
      beurre:["Le beurre fond à 37 °C, mais aucune digestion chimique ici.","Transport par péristaltisme.","Brassage ; très peu de digestion (lipase gastrique faible).","La bile émulsionne la graisse (gouttelettes), puis la lipase du pancréas : lipides → acides gras + glycérol, absorbés.","Peu de nutriments restants : absorption d'eau."],
      pomme:["Mastication : les cellules de la pomme sont broyées, glucose et fructose libérés.","Transport par péristaltisme.","Brassage ; les sucres simples n'ont pas besoin d'être digérés.","Glucose et fructose, déjà petits, sont absorbés directement. Les fibres ne sont pas digérées.","Les fibres nourrissent les bactéries du microbiote ; l'eau est absorbée."]
    };
    function interp(tab,x){ for (var i=1;i<tab.length;i++) if (x<=tab[i][0]) return tab[i-1][1] + (tab[i][1]-tab[i-1][1])*(x-tab[i-1][0])/(tab[i][0]-tab[i-1][0] || 1); return tab[tab.length-1][1]; }
    function along(pts,u){ var L=[0],i; for (i=1;i<pts.length;i++) L.push(L[i-1]+Math.hypot((pts[i][0]-pts[i-1][0])*c.W,(pts[i][1]-pts[i-1][1])*c.H)); var d=u*L[L.length-1]; for (i=1;i<pts.length;i++) if (d<=L[i]){ var t=(d-L[i-1])/((L[i]-L[i-1])||1); return [(pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t)*c.W,(pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t)*c.H]; } var q=pts[pts.length-1]; return [q[0]*c.W,q[1]*c.H]; }
    function fmtT(m){ return m<2 ? S.fmt(m*60,0)+" s" : m<120 ? S.fmt(m,0)+" min" : S.fmt(m/60,1)+" h"; }
    k.draw(function(){
      c.clear(); var g = c.ctx, p = pr.value, idx = 0, i;
      for (i=0;i<PATH.length;i++) if (p>=PATH[i].a) idx = i;
      for (i=PATH.length-1;i>=0;i--){
        var o = PATH[i], act = i===idx;
        g.save(); g.lineCap="round"; g.lineJoin="round"; g.strokeStyle = act ? (o.pH<4 ? "#e9a99c" : "#f2c99a") : "#ecdcd6"; g.lineWidth = o.w+(act?5:0);
        g.beginPath(); o.p.forEach(function(q,j){ if (j) g.lineTo(q[0]*c.W,q[1]*c.H); else g.moveTo(q[0]*c.W,q[1]*c.H); }); g.stroke();
        g.strokeStyle = act ? "#b56a50" : "#c9b2aa"; g.lineWidth = 1.5; g.stroke(); g.restore();
      }
      PATH.forEach(function(o,i){ var q = o.lab, x = q[0]*c.W, al = q[2]==="right" ? "right" : "left"; if (q[2]==="mid"){ x = c.W*.5; al="center"; } if (q[2]==="gi"){ x = c.W-6; al="right"; }
        if (q[2]==="left") x += 14; if (q[2]==="right") x -= 16;
        T(c,i===4?"Gros intestin":o.n,x,q[1]*c.H,{size:12,align:al,color:i===idx?P.violet:P.grey,bg:q[2]==="mid"?"rgba(255,255,255,.85)":null}); });
      var o = PATH[idx], u = (p-o.a)/(o.b-o.a), pos = along(o.p,Math.max(0,Math.min(1,u)));
      var col = {pain:"#d9a441",viande:"#c0392b",beurre:"#f4d03f",pomme:"#c0392b"}[food.value];
      D.dot(c,pos[0],pos[1],8,col); circ(c,pos[0],pos[1],8,null,P.ink,1.5);
      var dg = interp(DIG[food.value],p);
      rect(c,12,c.H-24,c.W-24,10,"#eee",P.grey,1,5); rect(c,12,c.H-24,(c.W-24)*dg/100,10,P.green,null,0,5);
      ro.set(0,o.n); ro.set(1,S.fmt(o.pH,1)); ro.set(2,fmtT(interp(TIME,p))); ro.set(3,S.fmt(dg,0)+" %");
      nt.set("<b>"+o.n+".</b> "+TXT[food.value][idx], "ok");
    });
  }
});

/* ===== 2 · Activité de l'amylase ===== */
SFA.sim({
  id:"b3-c03-amylase", ch:"c03", tag:"Modèle chiffré",
  titre:"L'amylase : température, pH et vitesse de digestion",
  resume:"Règle la température et le pH d'un tube d'amidon avec de l'amylase : à quelle vitesse l'amidon disparaît-il ?",
  but:"Fais varier la température et le pH, puis lance le film : regarde l'amylase couper les longues chaînes d'amidon en petits sucres (le tube vire du bleu-noir au brun avec l'iode). Les graphes donnent l'activité de l'enzyme et l'amidon restant.",
  aRetenir:"Une enzyme a un optimum de température et de pH (amylase salivaire : environ 37 °C et pH 7). Le froid la ralentit sans la détruire ; la chaleur excessive la détruit pour de bon (dénaturation). Un pH trop acide ou trop basique la rend inefficace.",
  piege:"Une enzyme n'est pas un être vivant et ne « meurt » pas au froid : à 4 °C elle est seulement très lente, et redevient active si on réchauffe. À 60 °C elle est dénaturée : même refroidie, elle ne refonctionne plus. (Courbes simplifiées.)",
  build:function(k,S){
    var cm = k.canvas(0,{ratio:.62}), c1 = k.canvas(170), c2 = k.canvas(170);
    var tt = k.slider("Température", 0, 70, 1, 37, "°C");
    var ph = k.slider("pH du tube", 1, 11, .2, 7, "");
    var vue = k.seg("Courbe du haut", [["T","Selon la température"],["pH","Selon le pH"]], "T");
    k.button("Conditions optimales", function(){ tt.set(37); ph.set(7); });
    var tm = k.slider("Temps du film", 0, 30, .5, 0, "min");
    var play=false, seed=8, EZ=[], BOND=[];
    function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
    for (var qi=0; qi<14*9; qi++) BOND.push(rnd());
    for (qi=0; qi<6; qi++) EZ.push({x:rnd(),y:rnd(),vx:(rnd()-.5)*.1,vy:(rnd()-.5)*.1});
    k.button("Lancer le film", function(){ if (tm.value>=30) tm.set(0); play=true; lp.play(); }, true);
    var lp = k.loop(function(dt){ if (play){ var nt2=tm.value+dt*3; if (nt2>=30){ nt2=30; play=false; } tm.set(nt2); } EZ.forEach(function(e){ e.vx+=(rnd()-.5)*dt*.6; e.vy+=(rnd()-.5)*dt*.6; e.x+=e.vx*dt; e.y+=e.vy*dt; if(e.x<.05||e.x>.95)e.vx*=-1; if(e.y<.08||e.y>.9)e.vy*=-1; }); k.redraw(); }); lp.play();
    var ro = k.readouts(["Activité de l'enzyme","Temps pour que l'iode ne bleuisse plus","État de l'enzyme"]);
    var nt = k.note("","");
    var K0 = .35;                                 /* 1/min à l'optimum : demi-temps ≈ 2 min */
    function kk(){ return K0*actT(tt.value)*actPH(ph.value,7,1.4); }
    function tube(A,kv,den,part){
      var g=cm.ctx, W=cm.W, H=cm.H, rem=Math.exp(-kv*tm.value); cm.clear();
      var tx=W*.06, ty=H*.06, tw=W*.88, th=H*.88; g.save(); D.rrect(cm,tx,ty,tw,th,16); g.clip();
      var col=rem>.66?"#3b3a78":rem>.2?"#7a6a8a":rem>.05?"#b99a6a":"#d9ad5a"; g.fillStyle=col; g.globalAlpha=.28; g.fillRect(tx,ty,tw,th); g.globalAlpha=1;
      /* chaînes d'amidon */
      for (var r=0;r<14;r++){ var cy=ty+th*(.08+.84*(r+.5)/14), x0=tx+tw*(.08+((r*37)%7)/7*.12);
        for (var j=0;j<9;j++){ var bx=x0+j*tw*.095, by=cy+Math.sin(j*.9+r)*3, cut=BOND[r*9+j]>rem; if (j>0 && !cut){ g.strokeStyle="#b8860b"; g.lineWidth=2.5; g.beginPath(); g.moveTo(bx-tw*.095,cy+Math.sin((j-1)*.9+r)*3); g.lineTo(bx,by); g.stroke(); }
          var off = cut?(rnd()>2?0:0):0; g.beginPath(); g.arc(bx+(cut?((BOND[r*9+j]*13)%1-.5)*14*(1-rem):0),by+(cut?((BOND[r*9+j]*7)%1-.5)*10*(1-rem):0),5,0,6.3); g.fillStyle=cut?"#f6c453":"#e0a526"; g.fill(); g.strokeStyle="#8a5f08"; g.lineWidth=1; g.stroke(); } }
      /* enzymes */
      EZ.forEach(function(e,i){ var ex=tx+e.x*tw, ey=ty+e.y*th, rr=H*.055; g.save(); g.translate(ex,ey); g.fillStyle=den?"#8a8f99":A<.05?"#a9a2c4":"#6236c4"; g.strokeStyle="#2e1a66"; g.lineWidth=1.4; g.beginPath();
        if (den){ for (var q=0;q<10;q++){ var an=q/10*6.283, rv=rr*(q%2?.55:1.15); g.lineTo(Math.cos(an)*rv,Math.sin(an)*rv); } } else { g.arc(0,0,rr,.5,6.283-.5); g.lineTo(0,0); }
        g.closePath(); g.fill(); g.stroke(); g.restore(); });
      g.restore(); D.rrect(cm,tx,ty,tw,th,16); g.strokeStyle="#9fb0c4"; g.lineWidth=3; g.stroke();
      D.label(cm,"amidon : "+S.fmt(rem*100,0)+" %  ·  temps "+S.fmt(tm.value,1)+" min",tx+10,ty+16,{size:11.5,color:P.ink,align:"left",fill:"rgba(255,255,255,.85)"});
      D.label(cm,"iode : "+(rem>.66?"bleu-noir":rem>.2?"bleu-violet":rem>.05?"brun-jaune":"brun-jaune (plus d'amidon)"),tx+10,ty+th-14,{size:11,color:"#3b3a78",align:"left",fill:"rgba(255,255,255,.85)"});
      D.label(cm,den?"enzyme dénaturée":A<.05?"enzyme inactive":"amylase active",tx+tw-10,ty+16,{size:11,color:den?P.red:P.violet,align:"right"});
    }
    k.draw(function(){
      var A = actT(tt.value)*actPH(ph.value,7,1.4);
      var kv0 = K0*actT(tt.value)*actPH(ph.value,7,1.4); tube(A,kv0,tt.value>=55,tt.value>=45&&tt.value<55);
      c1.clear(); var byT = vue.value==="T";
      var ax = D.axes(c1,{x0:byT?0:1,x1:byT?70:11,y0:0,y1:1.1,xl:byT?"température (°C)":"pH",yl:"activité relative",stepY:.25,stepX:byT?10:1,l:50});
      D.fn(c1,ax,function(x){ return byT ? actT(x)*actPH(ph.value,7,1.4) : actT(tt.value)*actPH(x,7,1.4); },P.acc,3);
      D.dot(c1,ax.X(byT?tt.value:ph.value),ax.Y(A),6,P.violet);
      c2.clear(); var kv = kk();
      var bx = D.axes(c2,{x0:0,x1:30,y0:0,y1:100,xl:"temps (min)",yl:"amidon restant (%)",stepX:5,stepY:25,l:50});
      D.fn(c2,bx,function(x){ return 100*Math.exp(-kv*x); },P.amber,3);
      D.dot(c2,bx.X(tm.value),bx.Y(100*Math.exp(-kv*tm.value)),6,P.violet);
      D.line(c2,bx.L,bx.Y(5),bx.R,bx.Y(5),P.grey,1.2,[5,4]); T(c2,"5 % : l'iode ne bleuit plus",bx.R-4,bx.Y(30),{size:12,align:"right",color:P.grey});
      var tdis = kv>0 ? Math.log(20)/kv : Infinity;
      ro.set(0,S.fmt(A*100,0)+" %"); ro.set(1, tdis<1 ? S.fmt(tdis*60,0)+" s" : tdis<=120 ? S.fmt(tdis,1)+" min" : "pratiquement jamais");
      var den = tt.value>=55, part = tt.value>=45 && !den, et = den ? "dénaturée (irréversible)" : part ? "en cours de dénaturation" : A<.05 ? "inactive" : tt.value<15 ? "ralentie (réversible)" : "active";
      ro.set(2, et);
      nt.set(den ? "À partir d'environ 55 °C, l'amylase est <b>dénaturée</b> : sa forme est détruite, même refroidie elle ne refonctionnera plus." : part ? "Entre 45 et 55 °C, l'enzyme se <b>dénature</b> peu à peu : son activité chute, et ce qui est détruit ne revient pas en refroidissant." : tt.value<15 ? "Au froid, l'enzyme est seulement <b>ralentie</b> : elle redeviendra active à 37 °C." : ph.value<4||ph.value>9.5 ? "pH trop éloigné de 7 : l'amylase salivaire ne marche presque plus (comme dans l'estomac, pH ≈ 2)." : Math.abs(tt.value-37)<=2&&Math.abs(ph.value-7)<=.6 ? "Conditions optimales : l'amidon disparaît le plus vite." : "Activité partielle : rapproche-toi de 37 °C et de pH 7.", den||part||ph.value<4||ph.value>9.5 ? "warn" : "ok");
    });
  }
});

/* ===== 3 · Digestion en tube ===== */
SFA.sim({
  id:"b3-c03-tube", ch:"c03", tag:"Expérience virtuelle",
  titre:"Digestion en tube : qui digère quoi ? (iode et liqueur de Fehling)",
  resume:"Mélange un substrat et une enzyme dans des conditions choisies, puis teste avec l'iode et la liqueur de Fehling.",
  but:"Choisis le substrat, l'enzyme, les conditions et le temps. Compare les tubes « avant » et « après » avec les deux tests.",
  aRetenir:"Une enzyme est spécifique : l'amylase ne digère que l'amidon. L'iode devient bleu-noir en présence d'amidon ; la liqueur de Fehling (chauffée) devient rouge brique en présence de sucres simples comme le maltose ou le glucose. Quand l'amidon est digéré, l'iode ne bleuit plus et le Fehling devient positif.",
  piege:"Un test négatif ne prouve pas qu'il ne s'est rien passé : l'iode et le Fehling ne détectent ni les protéines ni les lipides. Un tube sans enzyme (témoin) doit toujours rester inchangé. Le saccharose (sucre de table) est un sucre qui ne réagit pas à la liqueur de Fehling.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:.8});
    var sub = k.select("Substrat", [["a","Empois d'amidon"],["m","Maltose (sucre simple)"],["p","Blanc d'œuf cuit (protéines)"],["l","Huile (lipides)"]], "a");
    var en = k.select("Enzyme ajoutée", [["am","Amylase"],["pe","Pepsine"],["li","Lipase"],["no","Eau (tube témoin)"]], "am");
    var cd = k.select("Conditions", [["opt","Température et pH adaptés à l'enzyme (37 °C)"],["cold","4 °C (bain de glace)"],["boil","Enzyme bouillie, puis remise à 37 °C"],["ph","37 °C mais mauvais pH"]], "opt");
    var te = k.seg("Test", [["i","Iode"],["f","Fehling (chauffé)"]], "i");
    var tm = k.slider("Temps", 0, 30, 1, 15, "min");
    var ro = k.readouts(["Amidon restant","Sucre simple formé","Résultat du test"]);
    var nt = k.note("","");
    var F_ = {opt:1, cold:Math.pow(2,-3.3), boil:0, ph:.003};
    function state(t){
      var st = 1, su = 0;
      if (sub.value==="a"){ var kv = en.value==="am" ? .35*F_[cd.value] : 0; st = Math.exp(-kv*t); su = 1-st; }
      else if (sub.value==="m"){ st = 0; su = 1; }
      else { st = 0; su = 0; }
      return {st:st, su:su};
    }
    function tube(x,y,w,h,col,lab,val){
      var g = c.ctx; g.save();
      var gl=g.createLinearGradient(x,0,x+w,0); gl.addColorStop(0,"rgba(255,255,255,.9)"); gl.addColorStop(1,"rgba(225,235,245,.9)");
      g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+h-w/2); g.arc(x+w/2,y+h-w/2,w/2,Math.PI,0,true); g.lineTo(x+w,y); g.closePath(); g.fillStyle=gl; g.fill();
      g.save(); g.clip(); var ly=y+h*.26; g.fillStyle=col; g.fillRect(x,ly,w,h); g.fillStyle="rgba(255,255,255,.35)"; g.fillRect(x+3,ly,w*.18,h); g.fillStyle="rgba(255,255,255,.4)"; g.beginPath(); g.ellipse(x+w/2,ly,w/2,3,0,0,6.3); g.fill(); g.restore();
      g.strokeStyle="#7f93aa"; g.lineWidth=2.4; g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+h-w/2); g.arc(x+w/2,y+h-w/2,w/2,Math.PI,0,true); g.lineTo(x+w,y); g.stroke();
      g.lineWidth=3.4; g.beginPath(); g.moveTo(x-3,y); g.lineTo(x+w+3,y); g.stroke(); g.restore();
      T(c,lab,x+w/2,y-14,{size:12,color:P.ink}); T(c,val,x+w/2,y+h+14,{size:12,color:P.grey});
    }
    function colI(st){ return mix([196,125,40],[22,18,70],st); }
    function colF(su){ return mix([40,110,205],[176,52,30],su); }
    k.draw(function(){
      c.clear(); var s0 = state(0), s1 = state(tm.value), isI = te.value==="i";
      var h = c.H*.5, w = Math.min(60,c.W*.16), y = c.H*.12, cx = c.W/2;
      tube(cx-w-34,y,w,h,isI?colI(s0.st):colF(s0.su),"Avant (0 min)","");
      tube(cx+34,y,w,h,isI?colI(s1.st):colF(s1.su),"Après "+tm.value+" min","");
      D.arrow(c,cx-26,y+h*.55,cx+26,y+h*.55,P.grey,2.5);
      /* bain */
      var g2=c.ctx, by=y+h*.62, bh=h*.5, bc=cd.value==="cold"?"#bfe3f5":cd.value==="boil"?"#f6c27a":"#cfe6c8", bl=cd.value==="cold"?"bain de glace · 4 °C":cd.value==="boil"?"enzyme bouillie, puis 37 °C":"bain-marie · 37 °C";
      g2.save(); g2.globalAlpha=.55; g2.fillStyle=bc; D.rrect(c,c.W*.08,by,c.W*.84,bh,10); g2.fill(); g2.restore(); g2.strokeStyle="#8fa3b8"; g2.lineWidth=1.5; D.rrect(c,c.W*.08,by,c.W*.84,bh,10); g2.stroke();
      T(c,bl,c.W/2,by+bh+14,{size:11.5,color:P.grey});
      if (!isI){ D.label(c,"puis chauffé à la flamme (Fehling)",c.W/2,by+bh+34,{size:11,color:"#b4560c"}); for (var fi=0;fi<3;fi++){ var fx=cx+34+w/2+(fi-1)*10, fy=by+bh+2; g2.fillStyle="rgba(240,130,40,.85)"; g2.beginPath(); g2.moveTo(fx-4,fy+10); g2.quadraticCurveTo(fx-5,fy-2,fx,fy-8-(Date.now()/90+fi*5)%4); g2.quadraticCurveTo(fx+5,fy-2,fx+4,fy+10); g2.fill(); } }
      var res = isI ? (s1.st>.5?"bleu-noir : amidon présent":s1.st>.12?"bleu-violet : un peu d'amidon":"brun-orangé : pas d'amidon") : (s1.su>.5?"rouge brique : sucres simples":s1.su>.12?"orangé : un peu de sucre":"bleu : pas de sucre simple");
      ro.set(0,S.fmt(s1.st*100,0)+" %"); ro.set(1,S.fmt(s1.su*100,0)+" %"); ro.set(2,res);
      var msg, kd = "ok";
      if (sub.value==="p"||sub.value==="l"){ msg = "L'iode et le Fehling ne détectent ni les protéines ni les lipides : les deux tests restent négatifs, <b>même si une enzyme les digérait</b>. Pour ce substrat, il faudrait un autre test."; kd = "warn"; }
      else if (sub.value==="m") msg = "Le maltose est déjà un sucre simple : Fehling positif et iode négatif dès le départ, avec ou sans enzyme.";
      else if (en.value!=="am") msg = "Cette enzyme n'agit pas sur l'amidon (spécificité) : le tube reste comme le témoin.";
      else if (cd.value==="boil") msg = "Enzyme bouillie : <b>dénaturée</b>, donc inactive, même remise à 37 °C.";
      else if (cd.value==="ph") msg = "Mauvais pH : l'amylase est presque inactive.";
      else if (cd.value==="cold") msg = "À 4 °C, l'amylase est très ralentie, pas détruite : il faudrait attendre bien plus longtemps.";
      else msg = "Amylase, 37 °C, bon pH : l'amidon est transformé en sucres simples. Compare l'iode (qui s'éclaircit) et le Fehling (qui rougit).";
      nt.set(msg,kd);
    });
  }
});

/* ===== 4 · Mastication et bile : surface de contact ===== */
SFA.sim({
  id:"b3-c03-surface-contact", ch:"c03", tag:"Animation · course de digestion",
  titre:"Mâcher, émulsionner : agrandir la surface pour les enzymes",
  resume:"Découper un aliment ou une goutte de graisse en morceaux multiplie la surface de contact avec les enzymes : la digestion gagne la course.",
  but:"Coupe un cube d'aliment (ou divise une goutte d'huile) en morceaux de plus en plus petits. Écarte les morceaux pour les voir, puis lance la course : les enzymes attaquent la surface, le gros morceau est très en retard.",
  aRetenir:"Les enzymes n'agissent qu'à la surface des aliments. Si l'on divise l'arête d'un cube par k, le volume total ne change pas mais la surface totale est multipliée par k. La mastication (aliments solides) et la bile (graisses, émulsion) augmentent donc fortement la vitesse de la digestion chimique.",
  piege:"Mâcher ne digère pas chimiquement : c'est de la digestion mécanique, qui prépare la digestion chimique. Et la bile n'est pas une enzyme : elle émulsionne les graisses, ce sont les lipases qui les digèrent.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1.0});
    var obj = k.seg("Aliment", [["c","Cube de pain (mastication)"],["h","Goutte d'huile (bile)"]], "c");
    var kc = k.slider("Division de l'arête (ou du diamètre) par", 1, 50, 1, 1, "");
    var sp = k.toggle("Écarter les morceaux", true);
    var ro = k.readouts(["Nombre de morceaux","Surface totale","Vitesse d'action des enzymes","Temps relatif de digestion"]);
    var nt = k.note("","");
    var t = 0, run = false, en = [], seed = 2;
    function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
    k.button("Lancer la course de digestion", function(){ t=0; run=true; lp.play(); }, true);
    var lp = k.loop(function(dt){ if (run){ t+=dt; if (t>8){ t=8; run=false; } }
      if (rnd()<dt*30) en.push({x:rnd(),y:rnd(),a:0});
      en.forEach(function(e){ e.a+=dt; }); en=en.filter(function(e){ return e.a<.9; }); k.redraw(); }); lp.play();
    function face(g,pts,fill,line,m,lw){ g.beginPath(); pts.forEach(function(q,i){ i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); }); g.closePath(); g.fillStyle=fill; g.fill(); g.strokeStyle=line; g.lineWidth=lw||1; g.stroke();
      if (m>1){ g.save(); g.strokeStyle="rgba(90,60,10,.5)"; g.lineWidth=.6; for (var i=1;i<m;i++){ var u=i/m; g.beginPath(); g.moveTo(pts[0][0]+(pts[1][0]-pts[0][0])*u,pts[0][1]+(pts[1][1]-pts[0][1])*u); g.lineTo(pts[3][0]+(pts[2][0]-pts[3][0])*u,pts[3][1]+(pts[2][1]-pts[3][1])*u); g.moveTo(pts[0][0]+(pts[3][0]-pts[0][0])*u,pts[0][1]+(pts[3][1]-pts[0][1])*u); g.lineTo(pts[1][0]+(pts[2][0]-pts[1][0])*u,pts[1][1]+(pts[2][1]-pts[1][1])*u); g.stroke(); } g.restore(); } }
    /* cube en perspective cavalière : origine (U,V,Z) en px, arête e, quadrillage m */
    function cube(g,cx,cy,U,V,Z,e,m,lw){ var X=function(u,v){ return cx+(u-v)*.866; }, Y=function(u,v,w){ return cy+(u+v)*.5-w; };
      var T=[[U,V,Z+e],[U+e,V,Z+e],[U+e,V+e,Z+e],[U,V+e,Z+e]].map(function(q){ return [X(q[0],q[1]),Y(q[0],q[1],q[2])]; });
      var Rf=[[U+e,V,Z+e],[U+e,V+e,Z+e],[U+e,V+e,Z],[U+e,V,Z]].map(function(q){ return [X(q[0],q[1]),Y(q[0],q[1],q[2])]; });
      var Lf=[[U,V+e,Z+e],[U+e,V+e,Z+e],[U+e,V+e,Z],[U,V+e,Z]].map(function(q){ return [X(q[0],q[1]),Y(q[0],q[1],q[2])]; });
      face(g,T,"#f8e7bd","#7a5a1f",m,lw); face(g,Lf,"#e2c88a","#7a5a1f",m,lw); face(g,Rf,"#cfae6c","#7a5a1f",m,lw); }
    k.draw(function(){
      var n = kc.value, pieces = n*n*n, s0 = obj.value==="c" ? 6 : Math.PI, st = s0*n, g=c.ctx, W=c.W, H=c.H;
      c.clear(); var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#fbf6ea"); bgc.addColorStop(1,"#f3ead6"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      var cx=W/2, S0=Math.min(W*.26,H*.19), cy=H*.27, sz=S0*1.3;
      if (obj.value==="c"){
        if (n<=4 && sp.value && n>1){ var gp=.45, cs=S0/(n+(n-1)*gp), st2=cs*(1+gp);
          for (var l=0;l<n;l++) for (var ssum=0;ssum<=2*(n-1);ssum++) for (var i=0;i<n;i++){ var j=ssum-i; if (j<0||j>=n) continue; cube(g,cx,cy,i*st2,j*st2,l*st2,cs,1,1); } }
        else cube(g,cx,cy,0,0,0,S0,n>1?Math.min(n,30):1,1.4);
      } else {
        var mm2=Math.min(n,10), dr=S0*2/mm2;
        for (var a=0;a<mm2;a++) for (var b=0;b<mm2;b++){ var px=cx-S0+dr*(a+.5), py=cy-S0+dr*(b+.5)+S0*.2; var gr=g.createRadialGradient(px-dr*.15,py-dr*.15,1,px,py,dr/2); gr.addColorStop(0,"#fff3a0"); gr.addColorStop(1,"#e4b723"); g.beginPath(); g.arc(px,py,Math.max(1.5,dr/2-(sp.value&&mm2>1?1.5:0)),0,6.3); g.fillStyle=gr; g.fill(); g.strokeStyle="#a47a10"; g.lineWidth=.8; g.stroke(); }
      }
      /* enzymes (petites pastilles) autour */
      en.forEach(function(e){ var ex=cx+(e.x-.5)*S0*3, ey=cy+(e.y-.5)*S0*2.2; g.globalAlpha=Math.max(0,1-e.a/.9); g.fillStyle=P.violet; g.beginPath(); g.arc(ex,ey,2.8,0,6.3); g.fill(); g.globalAlpha=1; });
      D.text(c,n===1?"1 morceau":(pieces>=1e5?S.sci(pieces,2):pieces)+" morceaux",cx,H*.5,{size:12.5,color:P.ink});
      D.text(c,obj.value==="c"?"cube de 1 cm d'arête, vu en perspective":(n>10?"(dessin limité à 10 × 10 gouttes)":"gouttes de diamètre 1 cm ÷ "+n),cx,H*.5+16,{size:11,color:P.grey});
      /* course */
      var ry=H*.64, bw=W-170, x0=114, sp1=.2/8*0+.2, d1=Math.min(1,t*.1), dn=Math.min(1,t*.1*n);
      D.text(c,"Course de digestion  "+S.fmt(t,1)+" s",12,ry-12,{size:12,align:"left",color:P.ink});
      [["1 morceau",d1,"#8a95a3"],[n+" fois plus petits",dn,P.green]].forEach(function(q,i){ var yy=ry+14+i*34; D.text(c,q[0],12,yy,{size:11,align:"left",color:P.ink}); D.rrect(c,x0,yy-8,bw,16,8); g.fillStyle="#e3e8ef"; g.fill(); if (q[1]>0){ D.rrect(c,x0,yy-8,Math.max(8,bw*q[1]),16,8); g.fillStyle=q[2]; g.fill(); } D.text(c,S.fmt(q[1]*100,0)+" %",x0+bw+8,yy,{size:11,align:"left",color:P.ink}); });
      D.text(c,"surface totale : "+S.fmt(st,1)+" cm²  (×"+n+")",W/2,H*.95,{size:12,color:P.acc});
      ro.set(0,pieces>=1e5 ? S.sci(pieces,2) : String(pieces)); ro.set(1,S.fmt(st,1)+" cm²"); ro.set(2,"× "+n); ro.set(3,S.fmt(1/n,3));
      nt.set(n===1 ? "Un seul morceau : surface minimale. Les enzymes ont peu de prise." : n>=30 ? "Morceaux de moins de 0,4 mm : impossible à obtenir en mâchant. Pour les graisses, c'est le rôle de la bile (émulsion)." : "Même volume au total, mais la surface est "+n+" fois plus grande : la digestion est "+n+" fois plus rapide dans ce modèle.","ok");
    });
  }
});

})();
