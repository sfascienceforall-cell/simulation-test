/* Chimie BA1 · compléments · chapitre 6 : équilibre, précipitation et solubilité */
(function(){
var P = function(){ return SFA.draw.palette; };

/* ---------- 1. Précipitation : Q contre Ks ---------- */
var SALTS = {
  AgCl:{a:1,b:1,Ks:1.8e-10,M:143.32,cat:"Ag⁺",an:"Cl⁻"},
  BaSO4:{a:1,b:1,Ks:1.1e-10,M:233.39,cat:"Ba²⁺",an:"SO₄²⁻"},
  CaF2:{a:1,b:2,Ks:3.9e-11,M:78.08,cat:"Ca²⁺",an:"F⁻"},
  PbI2:{a:1,b:2,Ks:9.8e-9,M:461.0,cat:"Pb²⁺",an:"I⁻"},
  MgOH2:{a:1,b:2,Ks:5.6e-12,M:58.32,cat:"Mg²⁺",an:"OH⁻"}
};
SFA.sim({
  id:"uc-c06-precipitation", ch:"c06", tag:"Précipitation",
  titre:"Mélanger deux solutions : Q contre Ks",
  resume:"Deux solutions, un solide possible : Q dépasse-t-il Ks ? Combien de solide se forme ?",
  but:"Choisis un sel peu soluble, les concentrations et les volumes des deux solutions. Après mélange (dilution !), compare Q à Ks et lis la masse de solide formée.",
  aRetenir:"Après mélange, chaque concentration est divisée par le volume total. Précipité si Q = [M]<sup>a</sup>[X]<sup>b</sup> &gt; Ks ; à l’équilibre, Q retombe exactement à Ks.",
  piege:"Erreur classique : comparer Q à Ks avec les concentrations AVANT mélange (il faut tenir compte de la dilution). Ne pas oublier non plus que, pour CaF₂, PbI₂ ou Mg(OH)₂, la concentration de l'anion est élevée au carré.",
  build:function(k,S){
    var c = k.canvas(0, {ratio:1.08});
    var sel = k.select("Sel peu soluble",[["AgCl","AgCl"],["BaSO4","BaSO₄"],["CaF2","CaF₂"],["PbI2","PbI₂"],["MgOH2","Mg(OH)₂"]],"BaSO4");
    var p1 = k.slider("log₁₀ c(cation) avant mélange",-5,-1,0.1,-3,"");
    var p2 = k.slider("log₁₀ c(anion) avant mélange",-5,-1,0.1,-3,"");
    var v1 = k.slider("Volume solution du cation",10,200,5,50,"mL");
    var v2 = k.slider("Volume solution de l’anion",10,200,5,50,"mL");
    var ro = k.readouts(["[cation] après mélange","[anion] après mélange","Q","Ks","Solide formé"]);
    var nt = k.note("","");
    k.button("Mélanger", function(){ st.t = 0; lp.play(); }, true);
    var st = {t:1, key:""};
    var lp = k.loop(function(dt){ if (st.t < 1){ st.t = Math.min(1, st.t + dt / 2.4); k.redraw(); } }); lp.play();
    function solve(){
      var s = SALTS[sel.value], V = v1.value+v2.value;
      var cM = Math.pow(10,p1.value)*v1.value/V, cX = Math.pow(10,p2.value)*v2.value/V;
      var Q = Math.pow(cM,s.a)*Math.pow(cX,s.b), x = 0;
      if (Q > s.Ks){
        var lo = 0, hi = Math.min(cM/s.a, cX/s.b)*(1-1e-12);
        for (var i=0;i<200;i++){ var m=(lo+hi)/2; var f=Math.pow(cM-s.a*m,s.a)*Math.pow(cX-s.b*m,s.b)-s.Ks; if (f>0) lo=m; else hi=m; }
        x = (lo+hi)/2;
      }
      return {s:s,V:V,cM:cM,cX:cX,Q:Q,x:x,mol:x*V/1000,mg:x*V/1000*s.M*1000};
    }
    function beaker(c, x, y, w, h, frac, col, alpha){
      var ctx = c.ctx; ctx.save();
      if (frac > 0){ var g = ctx.createLinearGradient(0, y + h * (1 - frac), 0, y + h); g.addColorStop(0, S.draw.tint(col, alpha * 0.7)); g.addColorStop(1, S.draw.tint(col, alpha)); ctx.fillStyle = g; ctx.fillRect(x + 1.5, y + h * (1 - frac), w - 3, h * frac - 1.5); }
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x - 4, y - 2); ctx.lineTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y); ctx.lineTo(x + w + 4, y - 2); ctx.stroke(); ctx.restore();
    }
    k.draw(function(){
      var r = solve(), ctx = c.ctx, W = c.W, H = c.H, P = S.draw.palette, t = st.t;
      var key = sel.value + p1.value + p2.value + v1.value + v2.value; if (key !== st.key){ st.key = key; st.t = 0; t = 0; lp.play(); }
      UC.bg(c, "#f8fafd", "#ffffff");
      var bh = Math.round(H * 0.38), by = 46, bw = Math.round(W * 0.2), mw = Math.round(W * 0.28);
      var bx1 = Math.round(W * 0.07), bx2 = Math.round(W * 0.07) + bw + 28, mx = W - mw - Math.round(W * 0.07);
      var pour = Math.min(1, t / 0.4), f1 = (v1.value / 200) * (1 - pour * 0.85) + 0.05, f2 = (v2.value / 200) * (1 - pour * 0.85) + 0.05, fm = Math.min(0.95, (r.V / 400) * 1.3 + 0.05) * pour;
      beaker(c, bx1, by, bw, bh, f1, P.blue, 0.4); beaker(c, bx2, by, bw, bh, f2, P.orange, 0.4); beaker(c, mx, by, mw, bh, fm, "#8a95a3", 0.22);
      S.draw.text(c, r.s.cat, bx1 + bw / 2, by - 20, {size:12, color:P.blue, math:true}); S.draw.text(c, r.s.an, bx2 + bw / 2, by - 20, {size:12, color:P.orange, math:true});
      S.draw.text(c, S.fmt(v1.value, 0) + " mL", bx1 + bw / 2, by + bh + 12, {size:10, color:P.grey}); S.draw.text(c, S.fmt(v2.value, 0) + " mL", bx2 + bw / 2, by + bh + 12, {size:10, color:P.grey});
      S.draw.text(c, "mélange : " + S.fmt(r.V, 0) + " mL", mx + mw / 2, by + bh + 12, {size:10, color:P.grey});
      S.draw.text(c, S.sci(Math.pow(10, p1.value), 1), bx1 + bw / 2, by + bh - 12, {size:9.5, color:P.blue});
      S.draw.text(c, S.sci(Math.pow(10, p2.value), 1), bx2 + bw / 2, by + bh - 12, {size:9.5, color:P.orange});
      /* filets versés */
      if (t < 0.4){ ctx.save(); ctx.strokeStyle = S.draw.tint(P.blue, 0.7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx1 + bw + 4, by - 2); ctx.quadraticCurveTo(mx - 20, by - 26, mx + mw * 0.3, by + bh * 0.5); ctx.stroke(); ctx.strokeStyle = S.draw.tint(P.orange, 0.7); ctx.beginPath(); ctx.moveTo(bx2 + bw + 4, by - 2); ctx.quadraticCurveTo(mx - 6, by - 36, mx + mw * 0.55, by + bh * 0.5); ctx.stroke(); ctx.restore(); }
      S.draw.text(c, "+", bx1 + bw + 14, by + bh / 2, {size:18, color:P.grey});
      /* précipité : grains qui tombent puis se déposent */
      if (r.x > 0 && t > 0.35){
        var n = Math.min(70, Math.round(8 + 14 * Math.log10(1 + r.mg * 10))), u = Math.min(1, (t - 0.35) / 0.65), ytop = by + bh * (1 - fm) + 6, ybot = by + bh - 4;
        ctx.save(); ctx.beginPath(); ctx.rect(mx + 2, by, mw - 4, bh); ctx.clip();
        for (var i = 0; i < n; i++){
          var rx = ((i * 37 + 11) % 89) / 89, ry = ((i * 71 + 31) % 97) / 97, gx = mx + 6 + rx * (mw - 12), land = ybot - ry * Math.min(26, 5 + n * 0.35) * (1 - Math.abs(rx - 0.5));
          var y = ytop + (land - ytop) * Math.min(1, u * (0.7 + 0.5 * ry)), op = 0.5 + 0.5 * u;
          ctx.fillStyle = "rgba(235,228,205," + op + ")"; ctx.strokeStyle = "rgba(160,150,110,.8)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(gx, y, 2.2 + (i % 3) * 0.5, 0, 7); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }
      S.draw.label(c, r.x > 0 && t > 0.6 ? "précipité !" : r.x > 0 ? "…" : "solution limpide", mx + mw / 2, by - 20, {color:r.x > 0 ? P.red : P.green, size:11.5});
      /* jauge logarithmique Q / Ks */
      var gy = H - 54, L = 22, R = W - 22;
      function X(lg){ return L + (lg + 16) / 16 * (R - L); }
      S.draw.text(c, "log₁₀ du produit ionique", W / 2, gy - 44, {size:11, color:P.grey});
      var lk = Math.log10(r.s.Ks), lq = Math.log10(Math.max(r.Q, 1e-16));
      S.draw.rrect(c, L, gy - 8, X(lk) - L, 16, 8); ctx.fillStyle = S.draw.tint(P.green, 0.18); ctx.fill();
      S.draw.rrect(c, X(lk), gy - 8, R - X(lk), 16, 8); ctx.fillStyle = S.draw.tint(P.red, 0.16); ctx.fill();
      S.draw.text(c, "limpide", (L + X(lk)) / 2, gy, {size:10, color:P.green}); S.draw.text(c, "précipité", (X(lk) + R) / 2, gy, {size:10, color:P.red});
      for (var g = -16; g <= 0; g += 4){ S.draw.line(c, X(g), gy + 10, X(g), gy + 15, P.grey, 1); S.draw.text(c, String(g).replace("-", "−"), X(g), gy + 26, {size:10, color:P.grey}); }
      S.draw.line(c, X(lk), gy - 20, X(lk), gy + 10, P.green, 2.4);
      S.draw.text(c, "Ks", X(lk), gy - 28, {size:11.5, color:P.green});
      S.draw.dot(c, Math.max(L + 2, Math.min(R - 2, X(lq))), gy, 7, r.Q > r.s.Ks ? P.red : P.acc);
      S.draw.label(c, "Q", Math.max(L + 10, Math.min(R - 10, X(lq))), gy - 26, {color:r.Q > r.s.Ks ? P.red : P.acc, size:11.5});
      ro.set(0,S.sci(r.cM,2)+" mol/L"); ro.set(1,S.sci(r.cX,2)+" mol/L");
      ro.set(2,S.sci(r.Q,2)); ro.set(3,S.sci(r.s.Ks,2));
      ro.set(4,r.x>0?(r.mg<0.1?S.sci(r.mg*1000,2)+" µg":S.fmt(r.mg,r.mg<10?2:1)+" mg"):"aucun");
      if (r.x>0) nt.set("Q &gt; Ks : précipitation. À l’équilibre il reste [cation] = "+S.sci(r.cM-r.s.a*r.x,2)+" mol/L et [anion] = "+S.sci(r.cX-r.s.b*r.x,2)+" mol/L (leur produit vaut de nouveau Ks).","warn");
      else if (r.Q > 0.5*r.s.Ks) nt.set("Q &lt; Ks mais proche : solution limpide, presque saturée.","ok");
      else nt.set("Q &lt; Ks : la solution reste limpide, rien ne précipite.","ok");
    });
  }
});

/* ---------- 2. Tableau ICE : Kc, Kp, approximation ---------- */
SFA.sim({
  id:"uc-c06-ice-kc-kp", ch:"c06", tag:"Calcul d’équilibre",
  titre:"Tableau ICE : résolution exacte ou approximation ?",
  resume:"Compare x exact et x approché, teste la règle des 5 %, et passe de Kc à Kp.",
  but:"Choisis le type d’équilibre, la concentration initiale et la constante. La courbe Q(x) coupe la droite K à l’abscisse x d’équilibre ; l’approximation est-elle encore acceptable ?",
  aRetenir:"On néglige x devant c₀ seulement si x/c₀ &lt; 5 %. Kp = Kc·(RT)<sup>Δn</sup> avec R = 0,0821 L·atm/(mol·K) quand Kc est en mol/L et Kp en atm.",
  piege:"Approximer quand K est grande ou c₀ petite : l’erreur devient énorme (x ne peut pas dépasser c₀). Oublier le facteur 2 de « 2x » dans K = (2x)²/(c₀ − x).",
  build:function(k,S){
    var c = k.canvas(320);
    var ty = k.seg("Équilibre",[["A2B","A ⇌ 2 B"],["ABC","A ⇌ B + C"]],"A2B");
    var lc = k.slider("log₁₀ c₀ (mol/L)",-4,0.5,0.1,-1,"");
    var lk = k.slider("log₁₀ K",-8,1,0.1,-3,"");
    var T = k.slider("Température (pour Kp)",250,600,5,298,"K");
    var ro = k.readouts(["x exact (mol/L)","x approché","Erreur","x / c₀","Kp (atm)"]);
    var nt = k.note("","");
    function calc(){
      var c0=Math.pow(10,lc.value), K=Math.pow(10,lk.value), A2=ty.value==="A2B", x, xa, dn=1;
      if (A2){ x=(-K+Math.sqrt(K*K+16*K*c0))/8; xa=0.5*Math.sqrt(K*c0); dn=1; }
      else { x=(-K+Math.sqrt(K*K+4*K*c0))/2; xa=Math.sqrt(K*c0); dn=1; }
      return {c0:c0,K:K,x:x,xa:xa,A2:A2,dn:dn,Kp:K*Math.pow(0.0821*T.value,dn)};
    }
    k.draw(function(){
      var r=calc(); c.clear();
      var u=function(x){ return (r.A2 ? 4*x*x/(r.c0-x) : x*x/(r.c0-x))/r.K; };
      var ax = S.draw.axes(c,{x0:0,x1:1,y0:0,y1:3,xl:"x / c₀",yl:"Q / K",l:50,stepX:0.25,stepY:0.5});
      S.draw.fn(c,ax,function(t){ return t>=1?NaN:u(t*r.c0); },P().acc,2.6);
      S.draw.line(c,ax.L,ax.Y(1),ax.R,ax.Y(1),P().red,2,[6,4]);
      S.draw.text(c,"Q = K",ax.L+30,ax.Y(1)-9,{color:P().red,size:12});
      var te=r.x/r.c0, ta=r.xa/r.c0;
      S.draw.line(c,ax.X(te),ax.B,ax.X(te),ax.Y(1),P().green,2);
      S.draw.dot(c,ax.X(te),ax.Y(1),6,P().green);
      S.draw.text(c,"x exact",ax.X(te),ax.B-12,{color:P().green,size:11,bg:"#fff"});
      if (ta<=1){ S.draw.line(c,ax.X(ta),ax.B,ax.X(ta),ax.T,P().amber,1.8,[3,4]); S.draw.text(c,"x approché",ax.X(ta),ax.T+8,{color:P().amber,size:11,bg:"#fff"}); }
      var err=(r.xa-r.x)/r.x*100, frac=r.x/r.c0;
      ro.set(0,S.sci(r.x,3)); ro.set(1,S.sci(r.xa,3)); ro.set(2,(err>=0?"+":"")+S.fmt(err,err<10?1:0)+" %"); ro.set(3,S.fmt(frac*100,frac<0.1?2:1)+" %"); ro.set(4,S.sci(r.Kp,2));
      if (frac<0.05) nt.set("x/c₀ &lt; 5 % : l’approximation c₀ − x ≈ c₀ est valable ("+(r.A2?"x ≈ ½√(K·c₀)":"x ≈ √(K·c₀)")+").","ok");
      else nt.set("x/c₀ ≥ 5 % : l’approximation n’est plus valable, résous l’équation du second degré. "+(frac>0.9?"La réaction est quasi totale.":""),"warn");
    });
  }
});

/* ---------- 3. Solubilité et pH ---------- */
var SPH = {
  MgOH2:{nom:"Mg(OH)₂", M:58.32, f:function(h){ var oh=1e-14/h; return 5.6e-12/(oh*oh); }, txt:"s = [Mg²⁺] = Ks/[OH⁻]²"},
  CaCO3:{nom:"CaCO₃", M:100.09, f:function(h){ var K1=4.5e-7,K2=4.7e-11, a=K1*K2/(h*h+K1*h+K1*K2); return Math.sqrt(4.5e-9/a); }, txt:"s² = Ks·(1 + [H⁺]/Ka2 + [H⁺]²/(Ka1·Ka2))"},
  CaC2O4:{nom:"CaC₂O₄ (oxalate de calcium)", M:128.10, f:function(h){ var K1=5.6e-2,K2=5.4e-5, a=K1*K2/(h*h+K1*h+K1*K2); return Math.sqrt(2.3e-9/a); }, txt:"s² = Ks / α(C₂O₄²⁻)"},
  AgCl:{nom:"AgCl (témoin)", M:143.32, f:function(h){ return Math.sqrt(1.8e-10); }, txt:"s = √Ks : sans lien avec le pH"}
};
SFA.sim({
  id:"uc-c06-solubilite-ph", ch:"c06", tag:"Solubilité",
  titre:"Solubilité d’un sel et pH",
  resume:"Hydroxyde, carbonate, oxalate : à quel pH se dissolvent-ils ? (os, calculs rénaux)",
  but:"Fais varier le pH imposé (solution tamponnée) : la courbe log s(pH) montre quels sels deviennent solubles en milieu acide. L’AgCl sert de témoin.",
  aRetenir:"Si l’anion est une base (OH⁻, CO₃²⁻, C₂O₄²⁻…), un acide le consomme et déplace l’équilibre de dissolution : la solubilité augmente quand le pH diminue.",
  piege:"Modèle simplifié : pH imposé, solution diluée, activités égales aux concentrations, pas de complexes ; pour CaCO₃ le CO₂ dissous n’est pas supposé s’échapper.",
  build:function(k,S){
    var c = k.canvas(320);
    var sel = k.select("Sel",[["MgOH2","Mg(OH)₂"],["CaCO3","CaCO₃"],["CaC2O4","CaC₂O₄"],["AgCl","AgCl (témoin)"]],"CaC2O4");
    var ph = k.slider("pH imposé",0,14,0.1,7,"");
    var ro = k.readouts(["Solubilité s","en g/L","gain par rapport à pH 7"]);
    k.draw(function(){
      var d=SPH[sel.value]; c.clear();
      var lg=function(x){ return Math.log10(d.f(Math.pow(10,-x))); };
      var lo=-10, hi=2;
      var ax=S.draw.axes(c,{x0:0,x1:14,y0:-10,y1:2,xl:"pH",yl:"log₁₀ s (mol/L)",stepX:2,stepY:2,l:52});
      S.draw.fn(c,ax,function(x){ return Math.max(lo,Math.min(hi,lg(x))); },P().acc,2.8);
      var v=lg(ph.value);
      S.draw.line(c,ax.X(ph.value),ax.B,ax.X(ph.value),ax.Y(Math.max(lo,Math.min(hi,v))),P().red,1.6,[4,4]);
      S.draw.dot(c,ax.X(ph.value),ax.Y(Math.max(lo,Math.min(hi,v))),6,P().red);
      S.draw.text(c,d.txt,c.W/2,c.H-8,{size:11,color:P().grey,math:true,base:"bottom"});
      var s=Math.pow(10,v);
      ro.set(0,S.sci(s,2)+" mol/L"); ro.set(1,S.sci(s*d.M,2)+" g/L"); ro.set(2,"× "+S.sci(s/d.f(1e-7),2));
    });
    k.note("Constantes (25 °C) : Ks(Mg(OH)₂) = 5,6·10⁻¹² ; Ks(CaCO₃) = 4,5·10⁻⁹ ; Ks(CaC₂O₄) = 2,3·10⁻⁹ ; Ks(AgCl) = 1,8·10⁻¹⁰ ; H₂CO₃ : Ka1 = 4,5·10⁻⁷, Ka2 = 4,7·10⁻¹¹ ; H₂C₂O₄ : Ka1 = 5,6·10⁻², Ka2 = 5,4·10⁻⁵. La courbe est limitée à 10⁻¹⁰–10² mol/L pour la lisibilité (au-delà, le modèle idéal n’a plus de sens).","");
  }
});

/* ---------- 4. K(T) : Van ’t Hoff ---------- */
SFA.sim({
  id:"uc-c06-vant-hoff", ch:"c06", tag:"Température",
  titre:"K en fonction de T : relation de Van ’t Hoff",
  resume:"ln K contre 1/T est une droite de pente −ΔH°/R : lis le signe de ΔH° et prédis K à une autre température.",
  but:"Règle ΔH° et ΔS° (supposés constants) et la température. Observe comment K évolue : endothermique, K augmente avec T ; exothermique, K diminue.",
  aRetenir:"ln K = −ΔH°/(RT) + ΔS°/R, soit ln(K₂/K₁) = −(ΔH°/R)(1/T₂ − 1/T₁). ΔG° = −RT ln K. Chauffer favorise le sens endothermique (Le Chatelier).",
  piege:"ΔH° est en kJ/mol, R en J/(mol·K) : convertir. Utiliser des kelvins. Changer T ne modifie pas Q au premier instant : c'est K qui change, puis le système évolue jusqu'à ce que Q rejoigne la nouvelle valeur de K (contrairement à un ajout de réactif, qui change Q sans changer K).",
  build:function(k,S){
    var c = k.canvas(320);
    var dh = k.slider("ΔH° (kJ/mol)",-200,200,5,-90,"kJ/mol");
    var ds = k.slider("ΔS° (J/(mol·K))",-300,300,5,-150,"J/(mol·K)");
    var T = k.slider("Température T",250,1000,5,298,"K");
    var ro = k.readouts(["K à cette T","ΔG°","K à 298 K"]);
    var nt = k.note("","");
    var R=8.314;
    function lnK(t){ return -dh.value*1000/(R*t)+ds.value/R; }
    k.draw(function(){
      c.clear();
      var ax=S.draw.axes(c,{x0:1,x1:4,y0:-30,y1:30,xl:"1000/T (K⁻¹)",yl:"ln K",stepX:0.5,stepY:10,l:50});
      S.draw.fn(c,ax,function(u){ return Math.max(-30,Math.min(30,lnK(1000/u))); },P().acc,2.6);
      S.draw.line(c,ax.L,ax.Y(0),ax.R,ax.Y(0),P().grey,1,[3,4]);
      var u=1000/T.value, y=Math.max(-30,Math.min(30,lnK(T.value)));
      S.draw.dot(c,ax.X(u),ax.Y(y),7,P().red);
      S.draw.dot(c,ax.X(1000/298),ax.Y(Math.max(-30,Math.min(30,lnK(298)))),5,P().green);
      S.draw.text(c,"298 K",ax.X(1000/298),ax.Y(Math.max(-30,Math.min(30,lnK(298))))-14,{size:11,color:P().green});
      S.draw.text(c,"pente = −ΔH°/R = "+S.fmt(-dh.value*1000/R/1000,2)+" ·10³ K",ax.R-10,ax.T+14,{align:"right",size:12,color:P().acc});
      var K=Math.exp(lnK(T.value));
      ro.set(0,S.sci(K,2)); ro.set(1,S.fmt(dh.value-T.value*ds.value/1000,1)+" kJ/mol"); ro.set(2,S.sci(Math.exp(lnK(298)),2));
      nt.set(dh.value>0?"ΔH° &gt; 0 (endothermique) : K augmente quand T augmente.":dh.value<0?"ΔH° &lt; 0 (exothermique) : K diminue quand T augmente.":"ΔH° = 0 : K ne dépend pas de T.","");
    });
  }
});

/* ---------- 5. Complexation et solubilité ---------- */
var HAL = {AgCl:{Ks:1.8e-10,M:143.32,n:"AgCl"},AgBr:{Ks:5.0e-13,M:187.77,n:"AgBr"},AgI:{Ks:8.5e-17,M:234.77,n:"AgI"}};
SFA.sim({
  id:"uc-c06-complexation", ch:"c06", tag:"Complexation",
  titre:"AgCl, AgBr, AgI dans l’ammoniac",
  resume:"Un ligand dissout un halogénure d’argent : constante de formation et solubilité.",
  but:"Augmente la concentration d’ammoniac et lis la solubilité de l’halogénure d’argent. Pourquoi AgCl se dissout facilement mais pas AgI ?",
  aRetenir:"AgX(s) + 2 NH₃ ⇌ [Ag(NH₃)₂]⁺ + X⁻ a pour constante K = Ks·Kf. Plus Ks est petit, plus il faut de ligand (ou de ligand plus fort).",
  piege:"La solubilité totale est [Ag⁺] + [Ag(NH₃)₂]⁺, pas seulement [Ag⁺]. L’ammoniac libre est inférieur à la concentration introduite (2 NH₃ par complexe).",
  build:function(k,S){
    var c = k.canvas(300);
    var sel = k.seg("Sel",[["AgCl","AgCl"],["AgBr","AgBr"],["AgI","AgI"]],"AgCl");
    var C = k.slider("c(NH₃) introduit",0,6,0.1,1,"mol/L");
    var ro = k.readouts(["Solubilité s","dont [Ag⁺] libre","dont complexe","gain vs eau pure"]);
    var Kf=1.7e7;
    function sol(h,C){
      var Ks=h.Ks, lo=Math.sqrt(Ks), hi=Math.sqrt(Ks)+C/2+1e-12;
      if (C<=0) return {s:lo,ag:lo,cx:0};
      for (var i=0;i<200;i++){
        var s=(lo+hi)/2, ag=Ks/s, cxm=s-ag, nh=Math.max(0,C-2*cxm), cxe=Kf*ag*nh*nh;
        if (cxe>cxm) lo=s; else hi=s;
      }
      s=(lo+hi)/2; ag=Ks/s; return {s:s,ag:ag,cx:s-ag};
    }
    k.draw(function(){
      var h=HAL[sel.value]; c.clear();
      var ax=S.draw.axes(c,{x0:0,x1:6,y0:-9,y1:1,xl:"c(NH₃) (mol/L)",yl:"log₁₀ s",stepX:1,stepY:2,l:50});
      ["AgCl","AgBr","AgI"].forEach(function(n,i){
        var col=[P().acc,P().amber,P().violet][i];
        S.draw.fn(c,ax,function(x){ var r=sol(HAL[n],x); return Math.log10(r.s); },col,n===sel.value?3:1.4);
        S.draw.text(c,n,ax.R-16,ax.Y(Math.log10(sol(HAL[n],6).s))+(i-1)*0+(i===0?-10:i===1?-2:10),{size:11,color:col,align:"right"});
      });
      var r=sol(h,C.value);
      S.draw.dot(c,ax.X(C.value),ax.Y(Math.log10(r.s)),6,P().red);
      ro.set(0,S.sci(r.s,2)+" mol/L"); ro.set(1,S.sci(r.ag,2)); ro.set(2,S.sci(r.cx,2)); ro.set(3,"× "+S.sci(r.s/Math.sqrt(h.Ks),2));
    });
    k.note("Constantes (25 °C) : Ks(AgCl) = 1,8·10⁻¹⁰ ; Ks(AgBr) = 5,0·10⁻¹³ ; Ks(AgI) = 8,5·10⁻¹⁷ ; Kf([Ag(NH₃)₂]⁺) = 1,7·10⁷. Modèle simplifié : seul le complexe [Ag(NH₃)₂]⁺ est pris en compte, activités ignorées.","");
  }
});
})();
