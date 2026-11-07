/* Biostatistique BA1 · aides communes (préfixe us_) + chapitre 1 : statistique descriptive · théorie animée et devantures */
function us_n(v,d){return (+v).toFixed(d==null?1:d).replace('.',',').replace('-','−');}
function us_f(x0,x1,y0,y1,l,t,r,b){l=l==null?40:l;t=t==null?36:t;r=r==null?18:r;b=b==null?34:b;var R=W-r,B=H-b;
 return {x0:x0,x1:x1,y0:y0,y1:y1,L:l,T:t,R:R,B:B,X:function(v){return l+(v-x0)/(x1-x0)*(R-l);},Y:function(v){return B-(v-y0)/(y1-y0)*(B-t);}};}
function us_ax(f,xt,yt,xl,yl){LN(f.L,f.B,f.R+4,f.B,AX,1.7);if(yt!==false)LN(f.L,f.B,f.L,f.T-4,AX,1.7);
 (xt||[]).forEach(function(v){var a=v instanceof Array?v:[v,us_n(v,v%1?1:0)],x=f.X(a[0]);LN(x,f.B,x,f.B+4,GREY,1);TB(a[1],x,f.B+17,GREY,13);});
 (yt||[]).forEach(function(v){var a=v instanceof Array?v:[v,us_n(v,v%1?1:0)],y=f.Y(a[0]);LN(f.L-4,y,f.L,y,GREY,1);TB(a[1],f.L-7,y+4,GREY,13,'right');});
 if(xl)TB(xl,f.R,f.B+32,GREY,12,'right');if(yl)TB(yl,f.L+4,f.T-8,GREY,12,'left');}
function us_pdf(x,m,s){var z=(x-m)/s;return Math.exp(-z*z/2)/(s*2.5066283);}
function us_cdf(z){var t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),q=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-q:q;}
function us_lg(x){var c=[76.18009173,-86.50532033,24.01409822,-1.231739516,.00120858003,-.00000536382],y=x,t=x+5.5,s=1.000000000190015;t-=(x+.5)*Math.log(t);for(var j=0;j<6;j++){y+=1;s+=c[j]/y;}return -t+Math.log(2.5066282746310005*s/x);}
function us_bin(k,n,p){if(k<0||k>n)return 0;return Math.exp(us_lg(n+1)-us_lg(k+1)-us_lg(n-k+1)+k*Math.log(p)+(n-k)*Math.log(1-p));}
function us_poi(k,m){if(k<0)return 0;return Math.exp(-m+k*Math.log(m)-us_lg(k+1));}
function us_tpdf(x,v){return Math.exp(us_lg((v+1)/2)-us_lg(v/2))/Math.sqrt(v*PI)*Math.pow(1+x*x/v,-(v+1)/2);}
function us_ttl(s){TB(s,W/2,24,BLUE_D,16);}
function us_fn(f,fn,a,b,c,w,n){n=n||120;ctx.strokeStyle=c;ctx.lineWidth=w||2.4;ctx.lineJoin='round';ctx.beginPath();for(var i=0;i<=n;i++){var x=a+(b-a)*i/n,y=f.Y(fn(x));i?ctx.lineTo(f.X(x),y):ctx.moveTo(f.X(x),y);}ctx.stroke();}
function us_fill(f,fn,a,b,c,al,n){n=n||100;ctx.save();ctx.globalAlpha=al==null?.35:al;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(f.X(a),f.Y(0));for(var i=0;i<=n;i++){var x=a+(b-a)*i/n;ctx.lineTo(f.X(x),f.Y(fn(x)));}ctx.lineTo(f.X(b),f.Y(0));ctx.closePath();ctx.fill();ctx.restore();}
function us_vl(f,x,c,lab,dash,w,ly){LN(f.X(x),f.B,f.X(x),f.T,c,w||2,dash===false?null:(dash||[5,4]));if(lab)tag(lab,f.X(x),ly==null?f.T+8:ly,c,15);}
function us_bars(f,vals,x0,w,c,al,lab){vals.forEach(function(v,i){var a=Array.isArray(c)?c[i]:c;ctx.save();ctx.globalAlpha=al==null?.85:al;ctx.fillStyle=a;ctx.fillRect(f.X(x0+i*w)+1,f.Y(v),f.X(x0+(i+1)*w)-f.X(x0+i*w)-2,f.B-f.Y(v));ctx.restore();});}
function us_al(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function us_tab(x,y,cw,ch,rows,hdr,col){ /* tableau : rows = lignes de textes ; hdr = nb lignes d'en-tête */
 rows.forEach(function(r,i){r.forEach(function(s,j){var X=x+j*cw,Y=y+i*ch,h=i<(hdr||0)||j===0;var cc=(s&&s.c)||null,tx=s&&s.t!=null?s.t:s;
  ctx.fillStyle=cc?cc.b:(h?'#f1f4f8':'#fff');ctx.fillRect(X,Y,cw,ch);ctx.strokeStyle=AX;ctx.lineWidth=1.2;ctx.strokeRect(X,Y,cw,ch);
  TB(String(tx),X+cw/2,Y+ch/2+5,cc?cc.f:(h?BLUE_D:INK),13);});});}
function us_dots(f,vals,y,r,c){vals.forEach(function(v){DOT(f.X(v),y,r,c);});}
function us_tri(x,y,c,up){ctx.fillStyle=c;ctx.beginPath();if(up){ctx.moveTo(x,y);ctx.lineTo(x-8,y+13);ctx.lineTo(x+8,y+13);}else{ctx.moveTo(x,y);ctx.lineTo(x-8,y-13);ctx.lineTo(x+8,y-13);}ctx.closePath();ctx.fill();}
function us_box(f,y,h,mn,q1,md,q3,mx,c){LN(f.X(mn),y,f.X(q1),y,c,2.2);LN(f.X(q3),y,f.X(mx),y,c,2.2);LN(f.X(mn),y-h/3,f.X(mn),y+h/3,c,2.2);LN(f.X(mx),y-h/3,f.X(mx),y+h/3,c,2.2);
 ctx.fillStyle=c+'33';ctx.fillRect(f.X(q1),y-h/2,f.X(q3)-f.X(q1),h);ctx.strokeStyle=c;ctx.lineWidth=2.4;ctx.strokeRect(f.X(q1),y-h/2,f.X(q3)-f.X(q1),h);LN(f.X(md),y-h/2,f.X(md),y+h/2,c,3.4);}
function us_ci(f,y,a,b,m,c,w){LN(f.X(a),y,f.X(b),y,c,w||3);LN(f.X(a),y-6,f.X(a),y+6,c,w||3);LN(f.X(b),y-6,f.X(b),y+6,c,w||3);DOT(f.X(m),y,4.5,c);}

SFA.theo("c01", {
  icon: function () { TB('x̄ · médiane · s', W*.5, H*.45, BLUE_D, 32); TB('décrire sans déformer', W*.5, H*.66, ORANGE, 18); },
  anim: function (t) {
    var f = us_f(0, 95, 0, 1, 40, 40, 30, 70), x = 9 + 81 * (.5 - .5 * Math.cos(t * .018)), v = [4, 5, 5, 6, 7, 8, x];
    var mean = (35 + x) / 7, y = f.B - 22;
    TB('Une seule valeur extrême : la moyenne la suit, la médiane reste', W / 2, 26, BLUE_D, 15);
    us_ax(f, [0, 20, 40, 60, 80], false, 'valeur');
    LN(f.L, y + 12, f.R, y + 12, '#e4e7ea', 1);
    v.forEach(function (a, i) { DOT(f.X(a), y, i === 6 ? 10 : 8, i === 6 ? RED : BLUE); });
    LN(f.X(6), y - 22, f.X(6), y - 86, GREEN, 2.5); TB('médiane = 6', f.X(6) + 8, y - 70, DGREEN, 14, 'left');
    LN(f.X(mean), y - 22, f.X(mean), y - 110, ORANGE, 2.5); us_tri(f.X(mean), y - 22, ORANGE, true);
    TB('moyenne = ' + us_n(mean, 1), f.X(mean) + (mean > 55 ? -8 : 8), y - 118, ORANGE, 14, mean > 55 ? 'right' : 'left');
    TB('valeur variable = ' + us_n(x, 0), f.R, f.T + 4, RED, 13, 'right');
    TB('Médiane et quartiles : résistants. Moyenne et écart-type : sensibles.', W / 2, H - 6, GREY, 13);
  },
  th: '<div class="tcard"><b class="h">1. Types de variables : avant de calculer, on classe</b>' +
   '<p><b>Qualitative</b> : nominale (groupe sanguin, pas d\'ordre) ou ordinale (stade I à IV, ordre mais écarts non mesurables). <b>Quantitative</b> : discrète (nombre de crises, valeurs isolées) ou continue (glycémie, taille, sur un intervalle). Le type impose le résumé : effectifs et fréquences pour une qualitative, moyenne et écart-type (ou médiane et quartiles) pour une quantitative. On ne calcule pas de moyenne de stades.</p></div>' +
   '<div class="tcard"><b class="h">2. Résumer la position</b>' +
   '<p>Moyenne : <code>x̄ = Σxᵢ / n</code>. Médiane : valeur qui coupe la série triée en deux moitiés égales (n impair : valeur centrale ; n pair : moyenne des deux valeurs centrales). Mode : valeur la plus fréquente. Moyenne de groupes : moyenne <b>pondérée</b> par les effectifs, <code>x̄ = (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂)</code>.</p>' +
   '<div class="tip"><b>Transformations.</b> Ajouter c à toutes les valeurs : moyenne et médiane + c, écart-type inchangé. Multiplier par c : moyenne, médiane et écart-type sont multipliés par c (par |c| pour l\'écart-type).</div></div>' +
   '<div class="tcard"><b class="h">3. Résumer la dispersion</b>' +
   '<p>Variance d\'échantillon : <code>s² = Σ(xᵢ − x̄)² / (n − 1)</code> ; écart-type <code>s = √s²</code> (même unité que les données). Quartiles Q1 et Q3 (médiane de chaque moitié), écart interquartile <code>EIQ = Q3 − Q1</code>. Barrières de Tukey : <code>Q1 − 1,5·EIQ</code> et <code>Q3 + 1,5·EIQ</code> ; une valeur au-delà est dite atypique et se dessine à part sur la boîte à moustaches.</p></div>' +
   '<div class="tcard"><b class="h">4. Représenter : histogramme et asymétrie</b>' +
   '<p>Dans un histogramme, c\'est l\'<b>aire</b> des barres qui représente la fréquence : <code>hauteur = fréquence relative ÷ largeur de la classe</code> (classes inégales). Une distribution asymétrique à droite (CRP, délais, concentrations) a une moyenne supérieure à la médiane ; on la résume par médiane [Q1 ; Q3]. Signal d\'alarme : <code>moyenne − s &lt; 0</code> pour une grandeur qui ne peut pas être négative.</p></div>' +
   '<div class="tcard"><b class="h">5. Écart-type ou erreur standard ? Exemple chiffré</b>' +
   '<p>Le <b>écart-type s</b> décrit la dispersion des individus ; l\'<b>erreur standard</b> <code>ES = s/√n</code> décrit la précision de la moyenne (elle diminue quand n augmente, pas s). Exemple : durées de séjour 4,2 ; 5,1 ; 3,8 ; 4,9 ; 5,6 j. x̄ = 23,6/5 = 4,72 ; Σ(x − x̄)² = 2,068 ; s² = 2,068/4 = 0,517 ; s = 0,72 j ; ES = 0,72/√5 = 0,32 j.</p>' +
   '<div class="warn"><b>Piège.</b> Une barre d\'erreur « ± ES » n\'est pas la plage où se trouvent les individus : pour n = 36 et ES = 3, on a s = 3 × 6 = 18.</div></div>'
});

SFA.figs("c01", [
 function (p) { us_ttl('Stade tumoral : I < II < III < IV'); var w = W * .15, g = W * .05, x0 = (W - (4 * w + 3 * g)) / 2, yb = H * .74;
  ['I', 'II', 'III', 'IV'].forEach(function (s, i) { var h = H * (.16 + .1 * i), x = x0 + i * (w + g); ctx.fillStyle = ['#e6f1fb', '#cfe3f7', '#a9cdf0', '#7fb3e6'][i]; ctx.fillRect(x, yb - h, w, h); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.strokeRect(x, yb - h, w, h); TB(s, x + w / 2, yb - h / 2 + 7, BLUE_D, 20); });
  arrow(x0, yb + 20, W - 2 * x0 - 8, 0, GREY, '', 2); TB('ordre naturel, écarts non mesurables', W / 2, yb + 44, GREY, 15);
  if (p > 0) { ctx.globalAlpha = p; tag('qualitative ordinale', W / 2, H * .2 + 14, DGREEN, 18); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Tension systolique (mmHg)'); var f = us_f(114, 134, 0, 1, 30, 40, 30, 70), v = [118, 124, 131, 122, 127, 130], y = f.B - 30; us_ax(f, [115, 120, 125, 130], false);
  us_dots(f, v, y, 9, BLUE); if (p > 0) { ctx.globalAlpha = p; us_vl(f, 752 / 6, ORANGE, 'moyenne = 125,3', false, 2.6); us_tri(f.X(752 / 6), f.B - 4, ORANGE, true); ctx.globalAlpha = 1; } else TB('Σ = ? ; Σ/6 = ?', W / 2, H * .3, GREY, 17); },
 function (p) { us_ttl('HbA1c (%), 8 valeurs triées'); var f = us_f(6.3, 8.3, 0, 1, 30, 40, 30, 70), v = [6.5, 6.8, 6.9, 7.0, 7.2, 7.4, 7.9, 8.1], y = f.B - 30; us_ax(f, [6.5, 7, 7.5, 8], false);
  v.forEach(function (a, i) { var mid = i === 3 || i === 4; DOT(f.X(a), y, 9, mid && p > 0 ? GREEN : BLUE); TB(i + 1, f.X(a), y - 18, GREY, 12); });
  if (p > 0) { ctx.globalAlpha = p; us_vl(f, 7.1, DGREEN, 'médiane = 7,1', false, 2.6); ctx.globalAlpha = 1; } else TB('n pair : moyenne des 4e et 5e', W / 2, H * .3, GREY, 16); },
 function (p) { us_ttl('Durées de séjour (jours)'); var f = us_f(3.4, 6, 0, 1, 30, 40, 30, 70), v = [4.2, 5.1, 3.8, 4.9, 5.6], y = f.B - 30, m = 4.72; us_ax(f, [4, 4.5, 5, 5.5], false);
  if (p > 0) { v.forEach(function (a) { arrow(f.X(m), y - 22 - 6 * (v.indexOf(a)), (f.X(a) - f.X(m)) * p, 0, RED, '', 2.2); }); us_vl(f, m, ORANGE, 'x̄ = 4,72', false, 2.4); TB('s ≈ 0,72 j', W / 2, H * .3, RED, 19); }
  us_dots(f, v, y, 9, BLUE); if (p <= 0) TB('écarts à la moyenne → s', W / 2, H * .3, GREY, 17); },
 function (p) { us_ttl('Âge au diagnostic : classes inégales'); var f = us_f(0, 80, 0, 38, 44, 40, 20, 56), cl = [[0, 10, 12], [10, 20, 30], [20, 40, 36], [40, 80, 22]];
  us_ax(f, [0, 10, 20, 40, 80], false, 'âge (ans)');
  cl.forEach(function (c, i) { var eff = c[2], dens = c[2] / (c[1] - c[0]) * 10 / 3.2 * 3.2 / 1; var hE = c[2], hD = c[2] / (c[1] - c[0]) * 10; var h = hE + (hD - hE) * p; /* densité × 10 pour l'échelle */
   var best = i === 1; ctx.fillStyle = (p > 0 && best) ? GREEN : BLUE; ctx.globalAlpha = .75; ctx.fillRect(f.X(c[0]) + 1, f.Y(h), f.X(c[1]) - f.X(c[0]) - 2, f.B - f.Y(h)); ctx.globalAlpha = 1; });
  TB(p < .5 ? 'hauteur = effectif (trompeur)' : 'hauteur = densité (aire = fréquence)', W / 2, H - 6, p < .5 ? RED : DGREEN, 16); if (p > .6) { ctx.globalAlpha = p; tag('3,0 % par an', f.X(15), f.Y(30) - 12, DGREEN, 16); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Tensiomètre décalé de +10 mmHg'); var f = us_f(100, 150, 0, .05, 30, 44, 30, 40), g = function (x) { return us_pdf(x, 120, 8); }; us_ax(f, [100, 110, 120, 130, 140, 150], false);
  us_fn(f, g, 100, 150, GREY, 2, 100); var d = 10 * p; us_fn(f, function (x) { return us_pdf(x - d, 120, 8); }, 100, 150, BLUE, 3, 100);
  us_vl(f, 120, GREY, '', [3, 4], 1.4); us_vl(f, 120 + d, ORANGE, '', false, 2); if (p > 0) { arrow(f.X(120), f.Y(.046), f.X(120 + d) - f.X(120) - 4, 0, ORANGE, '', 2.4); TB('moyenne et médiane : +10', f.X(120) + (f.X(130) - f.X(120)) / 2, f.Y(.046) - 10, ORANGE, 15); TB('écart-type inchangé', W / 2, H * .5, DGREEN, 17); } },
 function (p) { us_ttl('Délais de récupération (jours)'); var f = us_f(0, 44, 0, 1, 20, 40, 20, 70), y = f.B - 52; us_ax(f, [0, 10, 20, 30, 40]);
  us_box(f, y, 40, 3, 6.5, 10, 13.5, 15, BLUE); DOT(f.X(40), y, 7, RED, false);
  if (p > 0) { ctx.globalAlpha = p; us_vl(f, 24, RED, 'barrière 24', [5, 4], 2, f.T + 4); tag('atypique', f.X(40), y - 26, DRED, 16); ctx.globalAlpha = 1; } else TB('Q1 = ?  Q3 = ?', W / 2, H * .3, GREY, 17); },
 function (p) { us_ttl('Moyenne pondérée de deux groupes'); var f = us_f(5.0, 6.2, 0, 1, 30, 40, 30, 70), by = f.B - 60; us_ax(f, [5.2, 5.6, 6.0], false);
  var m = 5.68, ang = p * 0; LN(f.X(5.0), by, f.X(6.2), by, INK, 4); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(f.X(m), by + 3); ctx.lineTo(f.X(m) - 14, by + 30); ctx.lineTo(f.X(m) + 14, by + 30); ctx.fill();
  ctx.globalAlpha = 1; ctx.fillStyle = '#cfe3f7'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.fillRect(f.X(5.2) - 18, by - 38, 36, 36); ctx.strokeRect(f.X(5.2) - 18, by - 38, 36, 36); TB('40', f.X(5.2), by - 14, BLUE_D, 17);
  ctx.fillStyle = '#fbe0d4'; ctx.strokeStyle = ORA2; ctx.fillRect(f.X(6.0) - 24, by - 54, 48, 52); ctx.strokeRect(f.X(6.0) - 24, by - 54, 48, 52); TB('60', f.X(6.0), by - 22, DRED, 19);
  TB('traités 5,2', f.X(5.2), by - 66, BLUE_D, 15); TB('non traités 6,0', f.X(6.0), by - 84, DRED, 15);
  if (p > 0) { ctx.globalAlpha = p; us_vl(f, m, GREEN, '5,68 (pas 5,6)', false, 2.4, f.T + 10); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Erreur de saisie : 9 devient 90'); var f = us_f(0, 100, 0, 1, 24, 40, 24, 70), v = [4, 5, 5, 6, 7, 8], y = f.B - 28, x = 9 + 81 * p, mean = (35 + x) / 7; us_ax(f, [0, 20, 40, 60, 80, 100]);
  us_dots(f, v, y, 8, BLUE); DOT(f.X(x), y, 9, RED); LN(f.X(6), y - 16, f.X(6), y - 82, GREEN, 2.4); TB('médiane 6', f.X(6) + 6, y - 66, DGREEN, 16, 'left');
  LN(f.X(mean), y - 16, f.X(mean), y - 100, ORANGE, 2.4); us_tri(f.X(mean), y - 16, ORANGE, true); TB('moyenne ' + us_n(mean, 1), f.X(mean) + 8, y - 108, ORANGE, 16, 'left'); },
 function (p) { us_ttl('CRP (mg/L) : distribution asymétrique'); var f = us_f(-4, 24, 0, 1, 24, 40, 24, 64), v = [1.2, 1.5, 1.8, 2.1, 2.6, 3.4, 4.8, 9.7, 21.5], y = f.B - 22; us_ax(f, [0, 5, 10, 15, 20]);
  if (p > 0) { ctx.save(); ctx.globalAlpha = .18 * p; ctx.fillStyle = RED; ctx.fillRect(f.X(-4), f.T + 20, f.X(0) - f.X(-4), f.B - f.T - 20); ctx.restore(); }
  us_dots(f, v, y, 8, BLUE); LN(f.X(0), f.B, f.X(0), f.T + 20, GREY, 1.4, [3, 3]);
  LN(f.X(2.6), y - 16, f.X(2.6), y - 88, GREEN, 2.4); TB('médiane 2,6', f.X(2.6) - 6, y - 92, DGREEN, 16, 'right'); LN(f.X(5.4), y - 16, f.X(5.4), y - 60, ORANGE, 2.4); us_tri(f.X(5.4), y - 16, ORANGE, true); TB('moyenne 5,4', f.X(5.4) + 8, y - 64, ORANGE, 16, 'left');
  if (p > 0) { ctx.globalAlpha = p; tag('x̄ − s = −1,2 : impossible', f.X(5), f.T + 14, DRED, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Pression artérielle : n = 36, moyenne 120'); var f = us_f(70, 170, 0, .025, 24, 40, 24, 40); us_ax(f, [80, 100, 120, 140, 160], false, 'mmHg');
  us_fill(f, function (x) { return us_pdf(x, 120, 18); }, 84, 156, BLUE, .18 * p); us_fn(f, function (x) { return us_pdf(x, 120, 18); }, 70, 170, BLUE, 2.6);
  var yb = f.Y(.0188); LN(f.X(117), yb, f.X(123), yb, ORANGE, 4); LN(f.X(117), yb - 7, f.X(117), yb + 7, ORANGE, 3); LN(f.X(123), yb - 7, f.X(123), yb + 7, ORANGE, 3); DOT(f.X(120), yb, 5, ORANGE);
  TB('± ES = 3', f.X(120), yb - 14, ORANGE, 15);
  if (p > 0) { ctx.globalAlpha = p; var y2 = f.Y(.0035); arrow(f.X(120), y2, f.X(156) - f.X(120) - 6, 0, DGREEN, '', 2.4); arrow(f.X(120), y2, f.X(84) - f.X(120) + 6, 0, DGREEN, '', 2.4); tag('s = 18 : individus 84 à 156', f.X(120), y2 - 22, DGREEN, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Poids de 100 adultes (kg)'); var f = us_f(40, 100, 0, 34, 40, 40, 20, 40), c = [6, 14, 30, 28, 16, 6]; us_ax(f, [40, 50, 60, 70, 80, 90, 100]);
  us_bars(f, c, 40, 10, c.map(function (v, i) { return i < 2 && p > 0 ? ORANGE : BLUE; }), .8); c.forEach(function (v, i) { TB(v, f.X(45 + 10 * i), f.Y(v) - 6, INK, 15); });
  if (p > 0) { ctx.globalAlpha = p; us_vl(f, 70, DGREEN, 'médiane 70', false, 2.6, f.T + 8); tag('20 % < 60 kg', f.X(53), f.Y(30), ORANGE, 16); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Cholestérolémie (mmol/L) : traités et non traités'); var f = us_f(2, 9, 0, .5, 30, 40, 24, 40); us_ax(f, [3, 4, 5, 6, 7, 8]);
  var g1 = function (x) { return us_pdf(x, 5.1, .9); }, g2 = function (x) { return us_pdf(x, 5.9, 1.1) * 1.0; };
  us_fn(f, g1, 2, 9, BLUE, 2.6); us_fn(f, g2, 2, 9, ORA2, 2.6); TB('traités', f.X(4.1), f.Y(.4) - 4, BLUE_D, 16, 'right'); TB('non traités', f.X(6.9), f.Y(.34), DRED, 16, 'left');
  us_vl(f, 7, GREY, '> 7,0', [4, 4], 1.6);
  if (p > 0) { ctx.globalAlpha = p; us_fill(f, g1, 7, 9, BLUE, .6); us_fill(f, g2, 7, 9, ORA2, .6); tag('5 %', f.X(7.9), f.Y(.07) - 22, BLUE_D, 16); tag('15 %', f.X(7.9), f.Y(.07) - 2, DRED, 16); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Dosage asymétrique : moyenne 8, médiane 5'); var f = us_f(-14, 44, 0, .15, 24, 40, 20, 40), g = function (x) { return x <= 0 ? 0 : Math.exp(-Math.pow(Math.log(x) - 1.609, 2) / 1.88) / (x * .97 * 2.5066); }; us_ax(f, [-10, 0, 10, 20, 30, 40]);
  us_fill(f, g, 0, 44, BLUE, .2); us_fn(f, g, 0, 44, BLUE, 2.6, 160); us_vl(f, 5, GREEN, 'médiane 5', false, 2.4, f.T + 4); us_vl(f, 8, ORANGE, 'moyenne 8', false, 2.4, f.T + 28);
  if (p > 0) { ctx.save(); ctx.globalAlpha = .2 * p; ctx.fillStyle = RED; ctx.fillRect(f.X(-14), f.T + 40, f.X(0) - f.X(-14), f.B - f.T - 40); ctx.restore(); ctx.globalAlpha = p; arrow(f.X(8), f.Y(.03), f.X(-10) - f.X(8), 0, DRED, '', 2.2); tag('x̄ − 2s = −10 < 0', f.X(-2), f.Y(.05), DRED, 15); ctx.globalAlpha = 1; } }
]);
