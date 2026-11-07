/* Biologie BA1 · chapitre 5 : énergie et enzymes */

SFA.sim({
  id:"ub-c05-michaelis-menten", ch:"c05", tag:"Cinétique · classique",
  titre:"Michaelis-Menten : v, Vmax, Km et double inverse de Lineweaver-Burk",
  resume:"v = Vmax·[S] / (Km + [S]) : fais varier l'enzyme, kcat, Km et estime Km à partir de « mesures » bruitées.",
  but:"Déplace [S], modifie [E], kcat et Km. Bascule en double inverse (1/v en fonction de 1/[S]) et affiche des mesures simulées avec 5 % de bruit.",
  aRetenir:"v = Vmax·[S]/(Km + [S]) avec Vmax = kcat·[E]. Quand [S] = Km, v = Vmax/2. Doubler [E] double Vmax mais ne change pas Km. Lineweaver-Burk : 1/v = (Km/Vmax)·(1/[S]) + 1/Vmax : droite d'ordonnée à l'origine 1/Vmax et d'abscisse à l'origine −1/Km. Efficacité catalytique : kcat/Km. Pont : chimie ch. 11 (cinétique).",
  piege:"Km n'est pas la vitesse maximale ni une mesure de « force » de l'enzyme : c'est la concentration de substrat pour laquelle v = Vmax/2. Dans le double inverse, les mesures à faible [S] (grand 1/[S]) pèsent trop sur l'ajustement : les erreurs sont déformées.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var E=k.slider("Concentration d'enzyme [E]",1,100,1,10,"nmol/L");
    var kc=k.slider("kcat",10,1000,10,100,"s⁻¹");
    var Km=k.slider("Km",1,100,1,20,"µmol/L");
    var s=k.slider("Concentration de substrat [S]",0,200,1,20,"µmol/L");
    var lb=k.toggle("Double inverse (Lineweaver-Burk)",false);
    var dt=k.toggle("Mesures simulées (bruit 5 %)",false);
    var ro=k.readouts(["Vmax = kcat·[E]","v à cette [S]","v / Vmax","kcat / Km","Estimation par double inverse"]);
    var SS=[5,10,20,40,80,160], NO=[1.04,0.97,1.03,0.96,1.05,0.98];
    k.draw(function(){
      c.clear();
      var V=kc.value*E.value/1000, K=Km.value, v=function(x){return V*x/(K+x);};
      var pts=SS.map(function(x,i){return [x,v(x)*NO[i]];});
      if(!lb.value){
        var ax=S.draw.axes(c,{t:28,x0:0,x1:200,y0:0,y1:V*1.15,stepX:25,xl:"[S] (µmol/L)",yl:"v (µmol/L/s)"});
        S.draw.line(c,ax.L,ax.Y(V),ax.R,ax.Y(V),P.green,1.2,[5,4]); S.draw.text(c,"Vmax",ax.R-4,ax.Y(V)-8,{size:10,color:P.green,align:"right"});
        S.draw.line(c,ax.L,ax.Y(V/2),ax.X(K),ax.Y(V/2),P.amber,1.2,[4,4]); S.draw.line(c,ax.X(K),ax.Y(V/2),ax.X(K),ax.B,P.amber,1.2,[4,4]); S.draw.text(c,"Km",ax.X(K),ax.B-10,{size:10,color:P.amber});
        S.draw.fn(c,ax,v,P.acc,2.8);
        if(dt.value) pts.forEach(function(p){ S.draw.dot(c,ax.X(p[0]),ax.Y(p[1]),4.5,P.violet); });
        S.draw.dot(c,ax.X(s.value),ax.Y(v(s.value)),7,P.red);
      } else {
        var xm1=Math.max(4/K,0.22), ax2=S.draw.axes(c,{t:28,x0:-1.5/K,x1:xm1,y0:-0.3/V,y1:1.12*((K*xm1+1)/V),xl:"1/[S] (L/µmol)",yl:"1/v (s·L/µmol)"});
        S.draw.fn(c,ax2,function(x){return (K/V)*x+1/V;},P.acc,2.6);
        S.draw.dot(c,ax2.X(0),ax2.Y(1/V),5,P.green); S.draw.text(c,"1/Vmax",ax2.X(0)+8,ax2.Y(1/V)-8,{size:10,color:P.green,align:"left"});
        S.draw.dot(c,ax2.X(-1/K),ax2.Y(0),5,P.amber); S.draw.text(c,"−1/Km",ax2.X(-1/K),ax2.Y(0)-12,{size:10,color:P.amber});
        if(dt.value) pts.forEach(function(p){ S.draw.dot(c,ax2.X(1/p[0]),ax2.Y(1/p[1]),4.5,P.violet); });
        if(s.value>0&&1/s.value<=xm1) S.draw.dot(c,ax2.X(1/s.value),ax2.Y(1/v(s.value)),7,P.red);
      }
      ro.set(0,S.fmt(V,3)+" µmol/L/s"); ro.set(1,S.fmt(v(s.value),3)+" µmol/L/s"); ro.set(2,S.fmt(v(s.value)/V*100,0)+" %");
      ro.set(3,S.sci(kc.value/(K*1e-6),2)+" L/mol/s");
      var n=pts.length, sx=0,sy=0,sxx=0,sxy=0; pts.forEach(function(p){ var x=1/p[0],y=1/p[1]; sx+=x;sy+=y;sxx+=x*x;sxy+=x*y; });
      var sl=(n*sxy-sx*sy)/(n*sxx-sx*sx), ic=(sy-sl*sx)/n;
      ro.set(4,dt.value?("Km ≈ "+S.fmt(sl/ic,1)+" µmol/L ; Vmax ≈ "+S.fmt(1/ic,3)):"active les mesures simulées");
    });
  }
});

SFA.sim({
  id:"ub-c05-inhibition-enzymatique", ch:"c05", tag:"Inhibition · lecture des graphiques",
  titre:"Inhibition enzymatique : Km et Vmax apparents, double inverse",
  resume:"Compétitive, non compétitive, incompétitive : compare Km et Vmax apparents et reconnais la signature sur le double inverse.",
  but:"Choisis le type d'inhibiteur, sa concentration et son Ki. Alterne entre v(S) et 1/v en fonction de 1/S.",
  aRetenir:"Avec α = 1 + [I]/Ki : compétitive : Vmax inchangé, Km apparent = α·Km (droites qui se croisent sur l'axe des 1/v). Non compétitive pure : Vmax apparent = Vmax/α, Km inchangé (droites qui se croisent sur l'axe des 1/[S]). Incompétitive : Vmax/α et Km/α (droites parallèles). Un compétiteur peut être surmonté en augmentant [S] ; pas un non compétitif.",
  piege:"Dans le double inverse, « droites parallèles » = incompétitive ; « même ordonnée à l'origine » = compétitive ; « même abscisse à l'origine » = non compétitive. Ne pas confondre Ki (affinité de l'inhibiteur) et Km (affinité du substrat).",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var ty=k.seg("Type d'inhibition",[["comp","Compétitive"],["nonc","Non compétitive"],["inc","Incompétitive"]],"comp");
    var I=k.slider("[I]",0,100,1,20,"µmol/L");
    var Ki=k.slider("Ki",2,50,1,10,"µmol/L");
    var Km=k.slider("Km (sans inhibiteur)",1,100,1,20,"µmol/L");
    var s=k.slider("Concentration de substrat [S]",1,200,1,40,"µmol/L");
    var lb=k.toggle("Double inverse (Lineweaver-Burk)",false);
    var ro=k.readouts(["α = 1 + [I]/Ki","Vmax apparent","Km apparent","v sans / avec inhibiteur","Inhibition à cette [S]"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var V=1, a=1+I.value/Ki.value, K=Km.value, t=ty.value;
      var Va=(t==="comp")?V:V/a, Ka=(t==="comp")?K*a:(t==="nonc")?K:K/a;
      var v0=function(x){return V*x/(K+x);}, v1=function(x){return Va*x/(Ka+x);};
      if(!lb.value){
        var ax=S.draw.axes(c,{t:28,x0:0,x1:200,y0:0,y1:1.15,stepX:25,stepY:0.25,xl:"[S] (µmol/L)",yl:"v (µmol/L/s)"});
        S.draw.fn(c,ax,v0,P.acc,2.4); S.draw.fn(c,ax,v1,P.red,2.8);
        S.draw.dot(c,ax.X(s.value),ax.Y(v0(s.value)),5,P.acc); S.draw.dot(c,ax.X(s.value),ax.Y(v1(s.value)),6,P.red);
        S.draw.text(c,"bleu : sans inhibiteur · rouge : avec",ax.R-4,ax.T+10,{size:10,color:P.grey,align:"right"});
      } else {
        var m0=Math.min(K,Ka), xm=Math.max(4/m0,1.1/s.value), yc=(K/V)*xm+1/V, yi=(Ka/Va)*xm+1/Va;
        var ax2=S.draw.axes(c,{t:28,x0:-1.5/m0,x1:xm,y0:-0.3,y1:Math.min(1.1*Math.max(yc,yi),Math.max(14,1.15*Math.max(1/v0(s.value),1/v1(s.value)))),xl:"1/[S] (L/µmol)",yl:"1/v"});
        S.draw.fn(c,ax2,function(x){return (K/V)*x+1/V;},P.acc,2.4);
        S.draw.fn(c,ax2,function(x){return (Ka/Va)*x+1/Va;},P.red,2.8);
        S.draw.dot(c,ax2.X(1/s.value),ax2.Y(1/v0(s.value)),5,P.acc); S.draw.dot(c,ax2.X(1/s.value),ax2.Y(1/v1(s.value)),6,P.red);
        S.draw.text(c,"bleu : sans inhibiteur · rouge : avec",ax2.R-4,ax2.T+10,{size:10,color:P.grey,align:"right"});
      }
      ro.set(0,S.fmt(a,2)); ro.set(1,S.fmt(Va,3)+(Va<V?" (↓)":" (=)")); ro.set(2,S.fmt(Ka,1)+" µmol/L"+(Ka>K?" (↑)":Ka<K?" (↓)":" (=)"));
      ro.set(3,S.fmt(v0(s.value),3)+" / "+S.fmt(v1(s.value),3)); ro.set(4,S.fmt((1-v1(s.value)/v0(s.value))*100,0)+" %");
      nt.set(t==="comp"?"Compétitive : l'inhibiteur occupe le site actif ; à [S] très grande, l'inhibition disparaît (Vmax atteint).":t==="nonc"?"Non compétitive : l'inhibiteur se lie ailleurs (E ou ES) ; Vmax baisse quelle que soit [S] ; Km inchangé.":"Incompétitive : l'inhibiteur ne se lie qu'au complexe ES ; Vmax et Km baissent dans le même rapport (droites parallèles).","ok");
    });
  }
});

SFA.sim({
  id:"ub-c05-ph-temperature", ch:"c05", tag:"Conditions d'activité",
  titre:"Activité enzymatique : pH optimal, température et dénaturation",
  resume:"Pepsine, trypsine, amylase, ADN polymérase thermostable : chaque enzyme a son pH et sa température.",
  but:"Choisis une enzyme, fais varier pH et température et lis l'activité relative. La courbe en T monte puis s'effondre.",
  aRetenir:"Le pH modifie l'ionisation des groupes du site actif et la structure : courbe en cloche autour d'un pH optimal (pepsine ≈ 2, amylase salivaire ≈ 7, trypsine ≈ 8). La vitesse augmente avec T (Arrhenius), puis chute brusquement quand l'enzyme se dénature : un optimum de température apparent. Une enzyme thermostable (Taq) reste active vers 72 °C : base de la PCR.",
  piege:"La dénaturation thermique est généralement irréversible : refroidir ne restaure pas l'activité. Au contraire, un froid intense ralentit mais ne détruit pas l'enzyme.",
  build:function(k,S){
    var P=S.draw.palette, c1=k.canvas(160), c2=k.canvas(170);
    var EZ={pep:["Pepsine (estomac)",2.0,0.9,55],tryp:["Trypsine (intestin)",8.0,1.0,55],amy:["Amylase salivaire",6.8,0.9,52],taq:["ADN polymérase thermostable (Taq)",8.5,1.0,98]};
    var en=k.select("Enzyme",Object.keys(EZ).map(function(x){return [x,EZ[x][0]];}),"pep");
    var ph=k.slider("pH",0,12,0.1,2,"");
    var tp=k.slider("Température",0,100,1,37,"°C");
    var ro=k.readouts(["Activité due au pH","Activité due à la température","Activité relative combinée"]);
    function fpH(e,p){ var x=(p-e[1])/e[2]; return Math.exp(-x*x/2); }
    function raw(e,T){ var Tk=T+273.15, Ea=50000, R=8.314; return Math.exp(-Ea/R*(1/Tk-1/310.15))/(1+Math.exp((T-e[3])/2.5)); }
    function gT(e,T){ var mx=0; for(var t=0;t<=100;t+=0.5){ var r=raw(e,t); if(r>mx)mx=r; } return raw(e,T)/mx; }
    k.draw(function(){
      var e=EZ[en.value], ax;
      c1.clear(); ax=S.draw.axes(c1,{x0:0,x1:12,y0:0,y1:1.1,stepX:1,stepY:0.5,xl:"pH",yl:"activité"});
      S.draw.fn(c1,ax,function(x){return fpH(e,x);},P.teal,2.6); S.draw.dot(c1,ax.X(ph.value),ax.Y(fpH(e,ph.value)),6,P.red);
      c2.clear(); ax=S.draw.axes(c2,{x0:0,x1:100,y0:0,y1:1.1,stepX:10,stepY:0.5,xl:"T (°C)",yl:"activité"});
      S.draw.fn(c2,ax,function(x){return gT(e,x);},P.amber,2.6); S.draw.dot(c2,ax.X(tp.value),ax.Y(gT(e,tp.value)),6,P.red);
      var a=fpH(e,ph.value), b=gT(e,tp.value);
      ro.set(0,S.fmt(a*100,0)+" %"); ro.set(1,S.fmt(b*100,0)+" %"); ro.set(2,S.fmt(a*b*100,0)+" %");
    });
    k.note("Courbes illustratives : cloche gaussienne en pH ; en température, loi d'Arrhenius (Ea = 50 kJ/mol) multipliée par la fraction native (sigmoïde, point de dénaturation 52-55 °C pour les enzymes humaines, 98 °C pour la polymérase thermostable). Les valeurs exactes varient selon l'enzyme et les conditions.","warn");
  }
});

SFA.sim({
  id:"ub-c05-couplage-atp", ch:"c05", tag:"Énergétique · ΔG",
  titre:"ATP et couplage : ΔG réel de l'hydrolyse et réactions défavorables",
  resume:"ΔG = ΔG°′ + RT·ln Q : l'ATP libère bien plus que −30,5 kJ/mol dans la cellule et permet de « pousser » une réaction défavorable.",
  but:"Règle [ATP], [ADP] et [Pi] et le ΔG°′ d'une réaction défavorable R → P. Compare le rapport [P]/[R] à l'équilibre avec et sans couplage à l'hydrolyse de l'ATP.",
  aRetenir:"ΔG = ΔG°′ + RT·ln([ADP][Pi]/[ATP]) (concentrations en mol/L, 37 °C : RT = 2,58 kJ/mol). Dans la cellule, [ATP] ≫ [ADP] : ΔG ≈ −50 à −60 kJ/mol. Une réaction défavorable (ΔG°′ > 0) couplée à l'hydrolyse atteint [P]/[R] = exp[−(ΔG°′ + ΔG<sub>ATP</sub>)/RT], bien supérieur à exp(−ΔG°′/RT). Pont : chimie ch. 9 (ΔG, K).",
  piege:"ΔG°′ (conditions standard) ≠ ΔG (conditions cellulaires). Une réaction est spontanée si ΔG < 0, pas si ΔG°′ < 0. L'ATP ne « contient » pas d'énergie dans une liaison : l'énergie vient du déplacement de l'équilibre.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(210), c2=k.canvas(120);
    var at=k.slider("[ATP]",0.5,10,0.1,5,"mmol/L");
    var ad=k.slider("[ADP]",0.01,5,0.01,0.5,"mmol/L");
    var pi=k.slider("[Pi]",1,10,0.5,5,"mmol/L");
    var g0=k.slider("ΔG°′ de la réaction défavorable R → P",0,40,0.5,20,"kJ/mol");
    var ro=k.readouts(["ΔG de l'hydrolyse de l'ATP","ATP / ADP","log₁₀([P]/[R]) sans couplage","log₁₀([P]/[R]) couplé"]);
    var RT=8.314*310.15/1000, G0=-30.5, LN=Math.LN10*RT;
    function dg(a,d,p){ return G0+RT*Math.log(d*1e-3*p*1e-3/(a*1e-3)); }
    k.draw(function(){
      c.clear(); var ax=S.draw.axes(c,{t:28,x0:-1,x1:3,y0:-70,y1:-20,stepX:1,stepY:10,xl:"log₁₀([ATP]/[ADP])",yl:"ΔG (kJ/mol)"});
      S.draw.fn(c,ax,function(x){return dg(Math.pow(10,x),1,pi.value);},P.acc,2.6);
      S.draw.line(c,ax.L,ax.Y(G0),ax.R,ax.Y(G0),P.grey,1.2,[5,4]); S.draw.text(c,"ΔG°′ = −30,5",ax.L+6,ax.Y(G0)-8,{size:10,color:P.grey,align:"left"});
      var g=dg(at.value,ad.value,pi.value), lx=Math.log10(at.value/ad.value);
      S.draw.dot(c,ax.X(Math.max(-1,Math.min(3,lx))),ax.Y(Math.max(-70,Math.min(-20,g))),7,P.red);
      S.draw.text(c,"courbe tracée à [Pi] = "+S.fmt(pi.value,1)+" mmol/L et [ADP] = 1 mmol/L (ATP/ADP varie)",ax.R-4,ax.T+10,{size:10,color:P.grey,align:"right"});
      var u=-g0.value/LN, cp=-(g0.value+g)/LN;
      c2.clear(); var x0=110, half=(c2.W-x0-30)/2, xz=x0+half; S.draw.line(c2,xz,10,xz,c2.H-26,"#8a95a3",1);
      [[u,"sans couplage",P.grey,34],[cp,"couplé à l'ATP",P.green,78]].forEach(function(b){ var w=Math.max(-half,Math.min(half,b[0]*half/12)); c2.ctx.fillStyle=b[2]; c2.ctx.fillRect(Math.min(xz,xz+w),b[3]-12,Math.abs(w),24); S.draw.text(c2,S.fmt(b[0],1),xz+w+(w>=0?18:-18),b[3],{size:11,color:P.ink}); S.draw.text(c2,b[1],4,b[3],{size:11,color:b[2],align:"left"}); });
      S.draw.text(c2,"log₁₀([P]/[R]) à l'équilibre : à droite de 0, produit favorisé",c2.W/2,c2.H-10,{size:10,color:P.grey});
      ro.set(0,S.fmt(g,1)+" kJ/mol"); ro.set(1,S.fmt(at.value/ad.value,1)); ro.set(2,S.fmt(u,2)); ro.set(3,S.fmt(cp,2));
    });
    k.note("Modèle : R + ATP + H₂O → P + ADP + Pi ; le ΔG°′ de 30,5 kJ/mol correspond à pH 7 et Mg²⁺ ; seul l'équilibre thermodynamique est calculé (rien sur la vitesse).","warn");
  }
});

SFA.sim({
  id:"ub-c05-allosterie", ch:"c05", tag:"Régulation · sigmoïde",
  titre:"Allostérie : sigmoïde de Hill, effecteurs et rétro-inhibition",
  resume:"Hémoglobine et enzymes allostériques : n et K₀,₅ règlent la sensibilité ; un effecteur décale la courbe.",
  but:"Choisis hémoglobine, enzyme allostérique ou michaélien. Fais varier n (coopérativité) et K₀,₅ et décale la courbe avec un effecteur (activateur ou inhibiteur).",
  aRetenir:"Hill : Y = [S]ⁿ / (K₀,₅ⁿ + [S]ⁿ). n > 1 : coopérativité positive, courbe sigmoïde ; le passage de 10 % à 90 % de saturation demande un rapport [S]₉₀/[S]₁₀ = 81^(1/n) (81 pour n = 1, ≈ 5 pour n = 2,7). Hémoglobine : n ≈ 2,7 et P₅₀ ≈ 26 mmHg ; augmenter le P₅₀ (H⁺, CO₂, BPG : effet Bohr) libère plus d'O₂ aux tissus. Rétro-inhibition : le produit final se lie à l'enzyme de tête de voie et augmente son K₀,₅.",
  piege:"La coopérativité ne rend pas l'enzyme « plus rapide » : elle la rend plus SENSIBLE à de petites variations de substrat autour de K₀,₅. Un effecteur allostérique ne se fixe pas au site actif.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(300);
    var pr=k.seg("Système",[["hb","Hémoglobine / O₂"],["enz","Enzyme allostérique"],["mic","Michaélien (n = 1)"]],"hb");
    var n=k.slider("Coefficient de Hill n",1,4,0.1,2.7,"");
    var K=k.slider("K₀,₅ (P₅₀ pour l'hémoglobine)",1,50,0.5,26,"");
    var f=k.slider("Effecteur : facteur sur K₀,₅ (< 1 activateur, > 1 inhibiteur)",0.25,4,0.05,1,"×");
    var ro=k.readouts(["K₀,₅ effectif","Saturation / activité à 40 (Hb) ou à K₀,₅/2 (enz.)","[S]₉₀ / [S]₁₀ = 81^(1/n)","Libération d'O₂ 100 → 40 mmHg"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var m=pr.value, nn=m==="mic"?1:n.value, Ke=K.value*f.value, hb=m==="hb", xmax=hb?Math.max(120,Math.ceil(Ke*1.3/20)*20):Math.max(100,Ke*3);
      var Y=function(x){return Math.pow(x,nn)/(Math.pow(Ke,nn)+Math.pow(x,nn));};
      var ax=S.draw.axes(c,{t:28,x0:0,x1:xmax,y0:0,y1:1.05,stepX:hb?20:xmax/5,stepY:0.25,xl:hb?"pO₂ (mmHg)":"[S] (unités arbitraires)",yl:hb?"saturation Y":"v / Vmax"});
      S.draw.fn(c,ax,function(x){return Math.pow(x,nn)/(Math.pow(K.value,nn)+Math.pow(x,nn));},P.grey,1.6,[5,4]);
      S.draw.fn(c,ax,Y,P.acc,2.8);
      S.draw.line(c,ax.L,ax.Y(0.5),ax.X(Ke),ax.Y(0.5),P.amber,1.2,[4,4]); S.draw.line(c,ax.X(Ke),ax.Y(0.5),ax.X(Ke),ax.B,P.amber,1.2,[4,4]);
      if(hb){ [[40,"tissus"],[100,"poumons"]].forEach(function(t){ S.draw.line(c,ax.X(t[0]),ax.B,ax.X(t[0]),ax.Y(Y(t[0])),P.green,1.4,[3,3]); S.draw.dot(c,ax.X(t[0]),ax.Y(Y(t[0])),5,P.green); S.draw.text(c,t[1]+" "+S.fmt(Y(t[0])*100,0)+" %",ax.X(t[0]),ax.Y(Y(t[0]))-12,{size:10,color:P.green}); }); }
      S.draw.text(c,"tirets gris : sans effecteur",ax.R-4,ax.B-12,{size:10,color:P.grey,align:"right"});
      ro.set(0,S.fmt(Ke,1)); ro.set(1,hb?S.fmt(Y(40)*100,0)+" %":S.fmt(Y(Ke/2)*100,0)+" %"); ro.set(2,S.fmt(Math.pow(81,1/nn),1)); ro.set(3,hb?S.fmt((Y(100)-Y(40))*100,0)+" points de saturation":"—");
      nt.set(hb?"Hémoglobine : le décalage vers la droite (effet Bohr, BPG) fait libérer plus d'O₂ aux tissus à pO₂ égale. n = 1 (myoglobine) donnerait une hyperbole.":"Enzyme allostérique : un activateur (facteur < 1) rapproche K₀,₅ de 0 ; un inhibiteur final (facteur > 1) étire la sigmoïde vers la droite : à faible [S] la voie s'éteint.","ok");
    });
  }
});
