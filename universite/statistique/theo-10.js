/* Biostatistique BA1 · chapitre 10 : corrélation et régression · théorie animée et devantures */
function us10_pts(n,r,seed){var s=seed||7,i,x=[],e=[];function rnd(){s=(s*16807)%2147483647;return s/2147483647;}
 function gau(){return Math.sqrt(-2*Math.log(rnd()+1e-9))*Math.cos(2*Math.PI*rnd());}
 for(i=0;i<n;i++){x.push(gau());e.push(gau());}
 function std(a){var m=0,v=0;a.forEach(function(q){m+=q;});m/=a.length;a.forEach(function(q,k){a[k]=q-m;});a.forEach(function(q){v+=q*q;});v=Math.sqrt(v/a.length);a.forEach(function(q,k){a[k]=q/v;});}
 std(x);var d=0;for(i=0;i<n;i++)d+=e[i]*x[i];d/=n;for(i=0;i<n;i++)e[i]-=d*x[i];std(e);
 return x.map(function(q,k){return [q,r*q+Math.sqrt(1-r*r)*e[k]];});}
function us10_cloud(f,pts,col,rad){pts.forEach(function(q){DOT(f.X(q[0]),f.Y(q[1]),rad||4.5,col||BLUE);});}
function us10_L(f,a,b,x0,x1,c,w,d){LN(f.X(x0),f.Y(a*x0+b),f.X(x1),f.Y(a*x1+b),c,w||2.6,d);}
SFA.theo("c10", {
  icon: function () { TB('r = s_xy / (s_x · s_y)', W * .5, H * .4, BLUE_D, 28); TB('ŷ = a·x + b', W * .5, H * .62, ORANGE, 24); TB('corrélation · régression', W * .5, H * .84, GREY, 15); },
  anim: function (t) {
    var r = Math.sin(t * .011) * .98, pts = us10_pts(28, r, 11), f = us_f(-2.8, 2.8, -2.8, 2.8, 30, 30, W * .42, 26);
    us_ax(f, [], []); us10_cloud(f, pts, Math.abs(r) > .7 ? BLUE : '#7fb0e3', 5);
    us10_L(f, r, 0, -2.7, 2.7, RED, 3);
    var x0 = W * .64;
    TB('r = ' + us_n(r, 2), x0, H * .2, r >= 0 ? BLUE_D : DRED, 26, 'left');
    TB('r² = ' + us_n(r * r, 2), x0, H * .36, ORANGE, 20, 'left');
    TB('(part de variance expliquée)', x0, H * .46, GREY, 13, 'left');
    TB(Math.abs(r) > .7 ? 'corrélation forte' : Math.abs(r) > .3 ? 'corrélation modérée' : 'corrélation faible', x0, H * .62, DGREEN, 17, 'left');
    TB(r > 0 ? 'pente positive' : 'pente négative', x0, H * .76, GREY, 15, 'left');
    TB('r mesure la liaison linéaire', x0, H * .9, GREY, 13, 'left');
  },
  th: '<div class="tcard"><b class="h">1. Le coefficient de corrélation r</b>' +
   '<p><code>r = s<sub>xy</sub> / (s<sub>x</sub>·s<sub>y</sub>)</code>, toujours entre −1 et +1, <b>sans unité</b>. Le signe donne le sens, |r| la force de la liaison <b>linéaire</b>. <code>r²</code> est la part de la variance de y expliquée par x (r = −0,7 donne r² = 0,49 : 49 %). Exemple : s<sub>xy</sub> = 12, s<sub>x</sub> = 3, s<sub>y</sub> = 5 donne r = 0,80 et r² = 0,64.</p>' +
   '<div class="warn"><b>Piège.</b> r ≈ 0 ne veut pas dire « pas de relation » : une parabole parfaite peut donner r ≈ 0. Toujours regarder le nuage de points.</div></div>' +
   '<div class="tcard"><b class="h">2. La droite des moindres carrés</b>' +
   '<p><code>ŷ = a·x + b</code> avec <code>a = Σ(x − x̄)(y − ȳ)/Σ(x − x̄)² = r·s<sub>y</sub>/s<sub>x</sub></code> et <code>b = ȳ − a·x̄</code> : elle passe par le point moyen (x̄ ; ȳ) et minimise la somme des carrés des résidus <code>e = y − ŷ</code>. Exemple : x̄ = 10, ȳ = 50, s<sub>x</sub> = 4, s<sub>y</sub> = 10, r = 0,6 donne a = 1,5 ; ŷ = 1,5·x + 35 ; ŷ(12) = 53. Interprétation : la pente est la variation moyenne de y pour une unité de x.</p>' +
   '<p><b>Extrapolation</b> : prédire hors de l\'étendue des données est risqué (la relation peut s\'aplatir ou s\'inverser).</p></div>' +
   '<div class="tcard"><b class="h">3. Tests et intervalles</b>' +
   '<p>Test de ρ = 0 : <code>t = r·√(n − 2) / √(1 − r²)</code> avec n − 2 ddl. Exemple : n = 27, r = 0,45 donne t = 2,52 &gt; 2,060 : significatif à 5 %. Pente : <code>t = a / ES(a)</code> ; IC 95 % : <code>a ± t<sub>0,975</sub>·ES</code> (a = 0,65, ES = 0,20, 20 ddl : t = 3,25 ; IC [0,23 ; 1,07]). IC de ρ par la transformation de Fisher : z = argth(r), ES = 1/√(n − 3), puis tanh (r = 0,60, n = 30 : [0,31 ; 0,79]). Significatif ne veut pas dire fort : tout dépend de n.</p></div>' +
   '<div class="tcard"><b class="h">4. Corrélation n\'est pas causalité</b>' +
   '<p>Une corrélation peut venir d\'une <b>variable de confusion</b> : r(glaces, noyades) = 0,80 mais, la température fixée, la corrélation partielle <code>r<sub>xy·z</sub> = (r<sub>xy</sub> − r<sub>xz</sub>r<sub>yz</sub>)/√((1 − r<sub>xz</sub>²)(1 − r<sub>yz</sub>²))</code> tombe à 0,15. Autres pièges : points influents, quatre jeux de données de mêmes statistiques mais de nuages très différents (Anscombe), paradoxe de Simpson (deux groupes de pente −0,60 et pente globale positive). Seul un essai randomisé établit la causalité.</p></div>' +
   '<div class="tcard"><b class="h">5. Vers la régression logistique</b>' +
   '<p>Quand y est binaire (complication oui/non), on modélise le <b>logit</b> : <code>ln(p/(1 − p)) = b₀ + b₁·x</code>, donc <code>p = 1/(1 + e<sup>−(b₀ + b₁x)</sup>)</code>. <code>OR = e<sup>b₁</sup></code> par unité de x. Exemple : logit = −4,2 + 0,35·x : p(10) = 0,33 ; p(15) = 0,74 ; OR(+1) = 1,42 ; OR(+5) = e<sup>1,75</sup> = 5,75 ; p = 50 % pour x = 12. Le rapport des probabilités (2,23) n\'est pas l\'OR.</p></div>'
});
SFA.figs("c10", [
 /* 0 : calcul de r */
 function (p) { us_ttl('sxy = 12 · sx = 3 · sy = 5'); var f = us_f(-2.8, 2.8, -2.8, 2.8, 40, 40, W * .45, 20); us_ax(f, [], []); us10_cloud(f, us10_pts(24, .8, 5), BLUE, 5);
  TB('r = ?', W * .72, H * .4, GREY, 24);
  if (p > 0) { ctx.globalAlpha = p; us10_L(f, .8, 0, -2.6, 2.6, RED, 3); ctx.clearRect(W * .5, H * .25, W * .5, H * .3); ctx.fillStyle = '#fff'; ctx.fillRect(W * .5, H * .25, W * .5, H * .3); TB('r = 12/(3 × 5) = 0,80', W * .74, H * .4, DGREEN, 17); TB('r² = 0,64', W * .74, H * .56, DRED, 22); ctx.globalAlpha = 1; } },
 /* 1 : droite de régression */
 function (p) { us_ttl('x̄ = 10 · ȳ = 50 · r = 0,6'); var f = us_f(0, 20, 30, 75, 40, 40, 20, 38); us_ax(f, [0, 5, 10, 15, 20], [30, 45, 60, 75]); DOT(f.X(10), f.Y(50), 7, ORANGE); tag('(10 ; 50)', f.X(10) - 6, f.Y(50) + 22, ORANGE, 14);
  if (p > 0) { ctx.globalAlpha = p; us10_L(f, 1.5, 35, 0, 20, RED, 3.4); LN(f.X(12), f.B, f.X(12), f.Y(53), GREY, 1.5, [5, 4]); LN(f.L, f.Y(53), f.X(12), f.Y(53), GREY, 1.5, [5, 4]); DOT(f.X(12), f.Y(53), 6, RED); tag('ŷ(12) = 53', f.X(12) + 52, f.Y(53) + 24, DRED, 15); tag('ŷ = 1,5·x + 35', f.X(4), f.Y(37) - 24, DRED, 16); ctx.globalAlpha = 1; } else TB('a = r·sy/sx = ?', W * .62, H * .3, GREY, 18); },
 /* 2 : r = 0 */
 function (p) { us_ttl('r = 0,02 mais un nuage en parabole'); var f = us_f(-3, 3, -.5, 9.5, 30, 40, 20, 28); us_ax(f, [], []); var xs = [-2.8, -2.4, -2, -1.6, -1.2, -.8, -.4, 0, .4, .8, 1.2, 1.6, 2, 2.4, 2.8]; xs.forEach(function (x) { DOT(f.X(x), f.Y(x * x + (x * 13 % 3 - 1) * .25), 5, BLUE); });
  LN(f.X(-3), f.Y(3.1), f.X(3), f.Y(3.1), ORANGE, 2.5, [7, 5]); tag('droite : plate, r ≈ 0', f.X(1.6), f.Y(2.2), ORANGE, 15);
  if (p > 0) { ctx.globalAlpha = p; us_fn(f, function (x) { return x * x; }, -3, 3, RED, 3); tag('relation nette, mais non linéaire', W / 2, H - 10, DRED, 15); ctx.globalAlpha = 1; } },
 /* 3 : prédiction et résidu */
 function (p) { us_ttl('ŷ = 2,4 + 0,65·x  (doses de 5 à 40 mg)'); var f = us_f(0, 45, 0, 36, 40, 40, 20, 38); ctx.fillStyle = 'rgba(55,138,221,.10)'; ctx.fillRect(f.X(5), f.T, f.X(40) - f.X(5), f.B - f.T); us_ax(f, [0, 10, 20, 30, 40], [0, 10, 20, 30], 'dose (mg)'); us10_L(f, .65, 2.4, 0, 45, BLUE, 3);
  DOT(f.X(20), f.Y(17), 7, GREEN); tag('observé 17', f.X(20) + 52, f.Y(17) - 14, DGREEN, 14);
  if (p > 0) { ctx.globalAlpha = p; DOT(f.X(20), f.Y(15.4), 6, BLUE); LN(f.X(20), f.Y(17), f.X(20), f.Y(15.4), RED, 4); tag('ŷ(20) = 15,4', f.X(20) + 54, f.Y(15.4) + 22, BLUE_D, 14); tag('résidu = 17 − 15,4 = 1,6', f.X(34), f.Y(6), DRED, 16); ctx.globalAlpha = 1; } },
 /* 4 : test de la corrélation */
 function (p) { us_ttl('n = 27, r = 0,45 : t sur 25 ddl'); var f = us_f(-4, 4, 0, .42, 24, 44, 24, 40); us_ax(f, [-4, -2, 0, 2, 4]); us_fn(f, function (x) { return us_tpdf(x, 25); }, -4, 4, BLUE, 3);
  us_fill(f, function (x) { return us_tpdf(x, 25); }, 2.06, 4, RED, .5); us_fill(f, function (x) { return us_tpdf(x, 25); }, -4, -2.06, RED, .5); tag('± 2,060', f.X(2.9), f.Y(.2), DRED, 14);
  if (p > 0) { ctx.globalAlpha = p; us_vl(f, 2.519, GREEN, 't = 2,52', [6, 4], 2.6, f.T + 4); tag('2,52 > 2,060 : on rejette H₀', W / 2, H - 6, DGREEN, 15); ctx.globalAlpha = 1; } else TB('t = r√(n−2)/√(1−r²) = ?', W / 2, H - 8, GREY, 15); },
 /* 5 : r² */
 function (p) { us_ttl('durée d\'exercice et fréquence cardiaque : r = −0,7'); var f = us_f(-2.8, 2.8, -2.8, 2.8, 24, 40, W * .5, 20); us_ax(f, [], []); us10_cloud(f, us10_pts(24, -.7, 9), BLUE, 4.5); us10_L(f, -.7, 0, -2.6, 2.6, RED, 3);
  var bx = W * .56, bw = 48, by = 56, bh = H - 100; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh); ctx.fillStyle = '#e3e8ee'; ctx.fillRect(bx, by, bw, bh); TB('variance de y', bx + bw / 2, by - 8, GREY, 13);
  if (p > 0) { ctx.fillStyle = RED; ctx.globalAlpha = .75; ctx.fillRect(bx, by + bh * (1 - .49 * p), bw, bh * .49 * p); ctx.globalAlpha = 1; TB('r² = 0,49', bx + bw + 10, by + bh * .75, DRED, 17, 'left'); TB('49 % expliquée', bx + bw + 10, by + bh * .75 + 20, DRED, 14, 'left'); TB('pente négative', W * .56, H - 12, DGREEN, 15, 'left'); } },
 /* 6 : régression complète */
 function (p) { us_ttl('6 patients : dose x (mg), réponse y'); var f = us_f(0, 70, 0, 70, 40, 40, 20, 36); us_ax(f, [0, 20, 40, 60], [0, 20, 40, 60]); [[10, 12], [20, 19], [30, 33], [40, 38], [50, 52], [60, 55]].forEach(function (q) { DOT(f.X(q[0]), f.Y(q[1]), 6, BLUE); });
  if (p > 0) { ctx.globalAlpha = p; us10_L(f, .9114, 2.933, 0, 70, RED, 3); DOT(f.X(35), f.Y(34.83), 7, ORANGE); tag('(35 ; 34,83)', f.X(35) + 12, f.Y(34.83) + 28, ORANGE, 14); tag('ŷ = 0,911·x + 2,93', f.X(18), f.Y(52), DRED, 16); tag('r = 0,989', f.X(55), f.Y(16), DGREEN, 16); ctx.globalAlpha = 1; } },
 /* 7 : IC de la pente */
 function (p) { us_ttl('pente a = 0,65 · ES = 0,20 · 20 ddl'); var f = us_f(-.4, 1.4, 0, 1, 30, 44, 24, 60); us_ax(f, [[0, '0'], [.4, '0,4'], [.8, '0,8'], [1.2, '1,2']], false, 'pente (mmHg/mg)'); LN(f.X(0), f.B, f.X(0), f.T + 8, RED, 2.5, [6, 5]); tag('H₀ : pente = 0', f.X(0) + 6, f.T + 4, DRED, 14); DOT(f.X(.65), f.Y(.45), 7, BLUE); TB('0,65', f.X(.65), f.Y(.45) - 14, BLUE_D, 15);
  if (p > 0) { ctx.globalAlpha = p; us_ci(f, f.Y(.45), .233, 1.067, .65, BLUE, 4); tag('0,23', f.X(.233), f.Y(.45) + 26, DGREEN, 14); tag('1,07', f.X(1.067), f.Y(.45) + 26, DGREEN, 14); tag('t = 3,25 > 2,086 · IC sans 0', W / 2, H - 8, DGREEN, 15); ctx.globalAlpha = 1; } },
 /* 8 : extrapolation */
 function (p) { us_ttl('ajustée sur 2 à 16 mg · ŷ = 1,07·x + 0,81'); var f = us_f(0, 45, 0, 50, 40, 40, 20, 38); ctx.fillStyle = 'rgba(55,138,221,.12)'; ctx.fillRect(f.X(2), f.T, f.X(16) - f.X(2), f.B - f.T); us_ax(f, [0, 10, 20, 30, 40], [0, 10, 20, 30, 40], 'dose (mg)'); TB('données', f.X(9), f.T + 12, BLUE_D, 13);
  [2, 4, 6, 8, 10, 12, 14, 16].forEach(function (x, i) { DOT(f.X(x), f.Y(1.07 * x + .81 + (i % 3 - 1) * .8), 5, BLUE); }); us10_L(f, 1.07, .81, 0, 16, RED, 3);
  if (p > 0) { ctx.globalAlpha = p; us10_L(f, 1.07, .81, 16, 40, RED, 2.5, [7, 5]); DOT(f.X(40), f.Y(43.6), 6, RED); tag('ŷ(40) ≈ 43,6 ?', f.X(36), f.Y(43.6) - 16, DRED, 14); us_fn(f, function (x) { return 24 * (1 - Math.exp(-x / 13)); }, 0, 45, ORANGE, 2.6); tag('réalité possible : plateau', f.X(32), f.Y(18), '#8a5a10', 14); ctx.globalAlpha = 1; } },
 /* 9 : variable cachée */
 function (p) { us_ttl('glaces, noyades et température'); var T = [W * .5, H * .26], G = [W * .2, H * .78], N = [W * .8, H * .78];
  [[T, 'température', BLUE], [G, 'glaces', GREEN], [N, 'noyades', RED]].forEach(function (n) { DOT(n[0][0], n[0][1], 36, n[2] + '22'); ctx.strokeStyle = n[2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(n[0][0], n[0][1], 36, 0, 7); ctx.stroke(); TB(n[1], n[0][0], n[0][1] + 5, dk(n[2]), 13); });
  A(T[0] - 12, T[1] + 26, G[0] - T[0] + 30, G[1] - T[1] - 56, BLUE, '', 2.6); A(T[0] + 12, T[1] + 26, N[0] - T[0] - 30, N[1] - T[1] - 56, BLUE, '', 2.6); tag('0,90', (T[0] + G[0]) / 2 - 14, (T[1] + G[1]) / 2, BLUE_D, 15); tag('0,85', (T[0] + N[0]) / 2 + 14, (T[1] + N[1]) / 2, BLUE_D, 15);
  LN(G[0] + 30, G[1], N[0] - 30, G[1], p > 0 ? GREY : ORANGE, 3, [7, 5]); tag(p > 0 ? 'r partiel ≈ 0,15' : 'r = 0,80', W / 2, G[1] - 14, p > 0 ? DGREEN : ORANGE, 17);
  if (p > 0) { ctx.globalAlpha = p; tag('(0,80 − 0,90 × 0,85)/0,2296 = 0,15', W / 2, H - 8, DGREEN, 14); ctx.globalAlpha = 1; } },
 /* 10 : affirmations */
 function (p) { us_ttl('Quelles affirmations sont correctes ?'); var items = [['I. mg → g ne change pas r', 1], ['II. r = −0,8 : pente négative', 1], ['III. r = 0,3 significatif quel que soit n', 0], ['IV. r² = 0,64 : 64 % des sujets bien classés', 0]], y = 50;
  items.forEach(function (it, i) { var yy = y + i * 52; ctx.fillStyle = p > 0 ? (it[1] ? '#e3f4ec' : '#fbe3e2') : '#eef3f9'; ctx.beginPath(); ctx.roundRect(W * .05, yy, W * .9, 42, 8); ctx.fill(); ctx.strokeStyle = p > 0 ? (it[1] ? GREEN : RED) : AX; ctx.lineWidth = 2; ctx.stroke(); TB(it[0], W * .08, yy + 27, INK, Math.min(15, W * .033), 'left');
   if (p > 0) { ctx.globalAlpha = p; TB(it[1] ? '✓' : '✗', W * .9, yy + 29, it[1] ? DGREEN : DRED, 24, 'right'); ctx.globalAlpha = 1; } }); },
 /* 11 : logistique */
 function (p) { us_ttl('logit = −4,2 + 0,35·x'); var f = us_f(0, 25, 0, 1, 44, 44, 20, 36); us_ax(f, [0, 5, 10, 15, 20, 25], [[0, '0'], [.5, '0,5'], [1, '1']], 'biomarqueur x', 'p'); us_fn(f, function (x) { return 1 / (1 + Math.exp(-(-4.2 + .35 * x))); }, 0, 25, BLUE, 3.4);
  LN(f.L, f.Y(.5), f.R, f.Y(.5), GREY, 1.4, [5, 4]);
  if (p > 0) { ctx.globalAlpha = p; [[10, .332], [15, .741]].forEach(function (q) { LN(f.X(q[0]), f.B, f.X(q[0]), f.Y(q[1]), ORANGE, 1.6, [5, 4]); DOT(f.X(q[0]), f.Y(q[1]), 6, RED); tag('p = ' + us_n(q[1], 2), f.X(q[0]) + (q[0] < 12 ? -50 : 48), f.Y(q[1]) + (q[0] < 12 ? -8 : 24), DRED, 14); }); DOT(f.X(12), f.Y(.5), 6, GREEN); tag('x = 12 : p = 0,5', f.X(12) - 68, f.Y(.5) - 20, DGREEN, 14); tag('OR(+1) = 1,42 · OR(+5) = 5,75', W * .62, f.Y(.16), '#8a5a10', 14); ctx.globalAlpha = 1; } },
 /* 12 : deux groupes, deux pentes */
 function (p) { us_ttl('pression selon l\'âge : deux groupes'); var f = us_f(10, 60, 30, 80, 40, 40, 20, 44); us_ax(f, [20, 30, 40, 50, 60], [40, 50, 60, 70, 80]); var A1 = [[16, 43], [19, 41], [22, 41], [25, 37]], B1 = [[46, 73], [49, 72], [52, 69], [55, 68]];
  A1.forEach(function (q) { DOT(f.X(q[0]), f.Y(q[1]), 6, BLUE); }); B1.forEach(function (q) { DOT(f.X(q[0]), f.Y(q[1]), 6, GREEN); });
  us10_L(f, -.6, 40.5 + .6 * 20.5, 13, 28, BLUE, 3); us10_L(f, -.6, 70.5 + .6 * 50.5, 43, 58, GREEN, 3); tag('groupe A', f.X(20), f.Y(48), BLUE_D, 14); tag('groupe B', f.X(50), f.Y(77), DGREEN, 14);
  if (p > 0) { ctx.globalAlpha = p; us10_L(f, .92, 55.5 - .92 * 35.5, 12, 58, RED, 2.8, [8, 5]); tag('tous ensemble : pente +0,92', f.X(40), f.Y(46), DRED, 15); tag('pente −0,60 dans chaque groupe', W / 2, H - 6, DGREEN, 14); ctx.globalAlpha = 1; } },
 /* 13 : IC de rho */
 function (p) { us_ttl('n = 30 · r = 0,60 · transformation de Fisher'); var f = us_f(-.2, 1.1, 0, 1, 30, 44, 24, 70); us_ax(f, [[0, '0'], [.25, '0,25'], [.5, '0,5'], [.75, '0,75'], [1, '1']], false, 'ρ'); LN(f.X(0), f.B, f.X(0), f.T + 6, RED, 2.2, [6, 5]); DOT(f.X(.6), f.Y(.42), 7, BLUE); TB('r = 0,60', f.X(.6), f.Y(.42) - 14, BLUE_D, 15);
  if (p > 0) { ctx.globalAlpha = p; us_ci(f, f.Y(.42), .306, .79, .6, BLUE, 4); tag('0,31', f.X(.306), f.Y(.42) + 26, DGREEN, 14); tag('0,79', f.X(.79), f.Y(.42) + 26, DGREEN, 14); tag('ES(z) = 1/√27 = 0,192 · IC de z = [0,316 ; 1,070]', W / 2, H - 28, GREY, 13); tag('IC de ρ ≈ [0,31 ; 0,79] (asymétrique)', W / 2, H - 8, DGREEN, 15); ctx.globalAlpha = 1; } else TB('IC = ?', W / 2, H - 20, GREY, 17); }
]);
