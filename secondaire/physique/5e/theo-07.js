/* Physique 5e · chapitre 7 : gravitation universelle et mouvement des astres */
function ph7_earth(x, y, r) { var g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#8ec5f2'); g.addColorStop(1, '#2f7fc6'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(60,160,90,.75)'; ctx.beginPath(); ctx.arc(x - r * .3, y - r * .15, r * .28, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(x + r * .35, y + r * .3, r * .2, 0, 7); ctx.fill(); }
function ph7_sat(x, y, s, col) { ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = col || BLUE_D; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 5 * s, y - 4 * s, 10 * s, 8 * s, 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#9fc2ea'; ctx.fillRect(x - 17 * s, y - 2 * s, 11 * s, 4 * s); ctx.fillRect(x + 6 * s, y - 2 * s, 11 * s, 4 * s); }

SFA.theo("c07", {
  icon: function () {
    TB('F = G·m₁m₂/r²', W * .5, H * .4, BLUE_D, 30); TB('Kepler · satellites', W * .5, H * .6, ORANGE, 17);
    ph7_earth(W * .12, H * .82, 22); ctx.strokeStyle = GREY; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(W * .12, H * .82, 40, 0, 7); ctx.stroke(); ctx.setLineDash([]); ph7_sat(W * .12 + 40, H * .82, .7);
  },
  sub: [
   { t: "Gravitation et satellites",
     anim: function (t) {
       var cx = W * .3, cy = H * .54, RE = Math.min(H * .2, 50), f = 1.1 + .9 * (.5 + .5 * Math.sin(t * .006)), r = RE * (1.4 + 1.6 * (f - 1.1) / .9);
       var rk = 6371 * r / RE, v = Math.sqrt(3.99e14 / (rk * 1000)) / 1000, T = 2 * PI * rk * 1000 / (v * 1000) / 60;
       ph7_earth(cx, cy, RE); ctx.strokeStyle = '#d6d9dd'; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
       var a = t * .6 / Math.sqrt(r / RE) * .02 * 3, P = {x: cx + r * Math.cos(a), y: cy - r * Math.sin(a)};
       ph7_sat(P.x, P.y, .8);
       A(P.x, P.y, (cx - P.x) / r * 40, (cy - P.y) / r * 40, RED, '', 3.4); A(P.x, P.y, -Math.sin(a) * 46 * 1, -Math.cos(a) * 46 * 1, GREEN, '', 3.4);
       TB('F', P.x + (cx - P.x) / r * 56, P.y + (cy - P.y) / r * 56 - 2, DRED, 14); TB('v', P.x - Math.sin(a) * 62, P.y - Math.cos(a) * 62, DGREEN, 14);
       TB('Un satellite est en chute libre : la gravité fournit la force centripète', W * .5, 24, BLUE_D, 14);
       var px = W * .6; TB('r = ' + Math.round(rk).toLocaleString('fr-FR').replace(/ /g, ' ') + ' km', px, H * .32, INK, 14, 'left'); TB('v = ' + v.toFixed(2).replace('.', ',') + ' km/s', px, H * .46, DGREEN, 16, 'left'); TB('T = ' + Math.round(T) + ' min', px, H * .6, ORANGE, 16, 'left');
       TB('v = √(GM/r) ne dépend pas de m', px, H * .78, GREY, 12, 'left'); TB('plus r est grand, plus v est petite', px, H * .88, GREY, 12, 'left');
     },
     th: '<div class="tcard"><b class="h">Loi de la gravitation universelle</b><p>Deux masses m<sub>1</sub> et m<sub>2</sub>, à la distance r (centre à centre), s’attirent avec des forces de même norme (3<sup>e</sup> loi) : <b>F = G·m<sub>1</sub>·m<sub>2</sub>/r²</b>, avec G = 6,67·10<sup>−11</sup> N·m²/kg². Deux élèves de 60 kg à 1,0 m : F ≈ 2,4·10<sup>−7</sup> N, imperceptible car G est minuscule : il faut une masse d’astre pour sentir la gravité. Double la distance : force divisée par 4.</p></div>' +
     '<div class="tcard"><b class="h">Pesanteur et altitude</b><p>À la surface d’un astre de masse M et de rayon R : <b>g = G·M/R²</b>. À l’altitude h : <b>g(h) = G·M/(R + h)²</b>. Lune : g = 6,67·10<sup>−11</sup> × 7,35·10<sup>22</sup>/(1,74·10<sup>6</sup>)² ≈ 1,62 m/s². À 400 km, g ≈ 8,7 m/s² (89 % de la valeur au sol) : les astronautes « flottent » parce que station et passagers sont en chute libre ensemble, pas parce que la gravité y est nulle.</p></div>' +
     '<div class="tcard"><b class="h">Satellite en orbite circulaire</b><p>La seule force est la gravité, qui joue le rôle de force centripète : G·M·m/r² = m·v²/r. On en déduit <b>v = √(G·M/r)</b> (indépendante de la masse du satellite) et <b>T = 2π·r/v = 2π·√(r³/(G·M))</b>, avec r = R<sub>T</sub> + h. Station à 400 km (r = 6 771 km) : v ≈ 7,7 km/s, T ≈ 92 min, soit ≈ 15,6 tours par jour. Orbite géostationnaire : T = 86 164 s, r ≈ 42 200 km, h ≈ 35 800 km, v ≈ 3,1 km/s. La vitesse d’évasion vaut v<sub>e</sub> = √2·v = √(2GM/r) (≈ 11,2 km/s au sol).</p></div>' +
     '<div class="tcard"><b class="h">Pièges</b><ul><li>r est la distance au <i>centre</i> de la Terre, pas l’altitude : ajoute le rayon terrestre.</li><li>Deux satellites de masses différentes sur la même orbite ont la même vitesse ; la force de gravitation est proportionnelle à m, mais l’accélération est la même.</li><li>Unités : r en mètres dans les formules (G·M = 3,99·10<sup>14</sup> m³/s²).</li></ul></div>' },
   { t: "Lois de Kepler",
     anim: function (t) {
       var e = .62, a = Math.min(W * .3, 150), b = a * Math.sqrt(1 - e * e), cx = W * .36, cy = H * .64, fx = cx + a * e;   /* Soleil au foyer droit */
       ctx.strokeStyle = '#c8ccd0'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, 7); ctx.stroke();
       function pos(M) { var E = M; for (var i = 0; i < 12; i++) E = M + e * Math.sin(E); return {x: cx + a * Math.cos(E), y: cy - b * Math.sin(E), E: E}; }
       function sect(M0, M1, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(fx, cy); for (var i = 0; i <= 14; i++) { var Q = pos(M0 + (M1 - M0) * i / 14); ctx.lineTo(Q.x, Q.y); } ctx.closePath(); ctx.fill(); }
       var M = ((t * .012) % (2 * PI)), P = pos(M);
       /* deux secteurs d'aires égales (même durée) : près du périhélie (E=0 à droite) et loin */
       sect(-.45, .45, 'rgba(55,138,221,.35)'); sect(PI - .45, PI + .45, 'rgba(216,90,48,.35)');
       DOT(fx, cy, 9, '#f0b400'); TB('Soleil', fx + 4, cy + 24, INK, 12);
       BALL(P.x, P.y, 8); var vv = 1 / (1 - e * Math.cos(P.E)), dx = -a * Math.sin(P.E), dy = -b * Math.cos(P.E), dl = Math.hypot(dx, dy);
       A(P.x, P.y, dx / dl * 34 * vv * .6, dy / dl * 34 * vv * .6, GREEN, '', 3);
       TB('1  trajectoire elliptique, Soleil à un foyer', W * .98, 30, BLUE_D, 13, 'right'); TB('2  aires égales en durées égales : plus vite au périhélie', W * .98, 52, ORANGE, 13, 'right'); TB('3  T²/a³ = constante (T en ans, a en UA : 1)', W * .98, 74, DGREEN, 13, 'right');
       TB('périhélie', cx + a, cy - 12, GREY, 11); TB('aphélie', cx - a, cy - 12, GREY, 11);
     },
     th: '<div class="tcard"><b class="h">Les trois lois de Kepler</b><ol><li><b>Orbites elliptiques</b> : chaque planète décrit une ellipse dont le Soleil occupe un des foyers.</li><li><b>Loi des aires</b> : le segment Soleil-planète balaie des aires égales pendant des durées égales. La planète va <i>plus vite</i> près du Soleil (périhélie) que loin (aphélie).</li><li><b>Périodes</b> : le rapport <b>T²/a³</b> est le même pour tous les corps qui tournent autour du même astre (a = demi-grand axe). Pour le Soleil, avec T en années et a en UA : T²/a³ = 1.</li></ol></div>' +
     '<div class="tcard"><b class="h">Utiliser T² = a³</b><p>Mars : a = 1,524 UA, donc T = √(1,524³) ≈ 1,88 an. Jupiter : T = 11,86 ans, donc a = T<sup>2/3</sup> ≈ 5,20 UA. Comète de Halley : T = 76 ans, donc a = 76<sup>2/3</sup> ≈ 17,9 UA ; avec le périhélie à 0,586 UA, l’aphélie est à 2a − 0,586 ≈ 35,3 UA (le grand axe vaut la somme des distances extrêmes).</p></div>' +
     '<div class="tcard"><b class="h">Lien avec la gravitation</b><p>Pour une orbite circulaire, T² = 4π²·r³/(G·M) : on retrouve la 3<sup>e</sup> loi de Kepler, avec une constante qui dépend de la masse centrale seulement (4π²/(G·M)). Newton a vérifié que la Lune « tombe » comme la pomme : son accélération vaut a = G·M/r² ≈ 2,70·10<sup>−3</sup> m/s² à r = 3,844·10<sup>8</sup> m, soit g·(R<sub>T</sub>/r)² ≈ 9,82/3 640, et v²/r donne 2,72·10<sup>−3</sup> m/s² avec sa période de 27,32 jours.</p></div>' }
  ]
});

SFA.figs("c07", [
 /* 1 deux élèves */
 function (p) {
  var gy = H * .72; pers(W * .24, gy, 80, BLUE, 1, '', 'center'); pers(W * .76, gy, 80, ORANGE, -1, '', 'center'); ph_ground(gy + 6, W * .04, W * .96);
  TB('60 kg', W * .24, gy + 24, BLUE_D, 13); TB('60 kg', W * .76, gy + 24, DRED, 13);
  LN(W * .26, H * .2, W * .74, H * .2, GREY, 1.4); LN(W * .26, H * .2 - 5, W * .26, H * .2 + 5, GREY, 1.4); LN(W * .74, H * .2 - 5, W * .74, H * .2 + 5, GREY, 1.4); TB('1,0 m', W * .5, H * .2 - 8, INK, 13);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; A(W * .34, gy - 40, 20, 0, RED, '', 3); A(W * .66, gy - 40, -20, 0, RED, '', 3); tag('F = G·m₁·m₂/r² ≈ 2,4·10⁻⁷ N', W * .5, H * .4, DRED, 15); TB('beaucoup trop petite pour être sentie', W * .5, H * .93, GREY, 13); ctx.globalAlpha = 1; }
  else TB('F = ?', W * .5, H * .4, GREY, 18);
 },
 /* 2 Lune */
 function (p) {
  var cx = W * .5, cy = H * 1.0, R = H * .64; var g = ctx.createRadialGradient(cx - R * .3, cy - R * .6, R * .1, cx, cy, R); g.addColorStop(0, '#f1f2f4'); g.addColorStop(1, '#aeb3ba'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(120,125,135,.35)'; [[-.3, -.85, 20], [.25, -.8, 14], [.55, -.62, 10]].forEach(function (c) { ctx.beginPath(); ctx.arc(cx + c[0] * R, cy + c[1] * R, c[2], 0, 7); ctx.fill(); });
  var gy = cy - R; pers(cx - 12, gy + 4, 56, VIOLET, 1); TB('80 kg', cx - 48, gy - 24, VIO_D, 13, 'right');
  TB('M = 7,35·10²² kg   R = 1,74·10⁶ m', W * .5, H * .1, GREY, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(cx + 24, gy - 30, 0, 36 * q, RED, '', 3.4); if (q > .95) { tag('g = GM/R² ≈ 1,62 m/s²', W * .78, H * .28, DRED, 15); tag('P = 80 × 1,62 ≈ 130 N', W * .78, H * .42, DGREEN, 15); } }
 },
 /* 3 g à 400 km */
 function (p) {
  var cx = W * .26, cy = H * 1.16, R = H * .9, h = R * 400 / 6371 * 3.2;
  ph7_earth(cx, cy, R); ctx.strokeStyle = '#d6d9dd'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(cx, cy, R + h, 0, 7); ctx.stroke(); ctx.setLineDash([]);
  var sx = cx, sy = cy - R - h; ph7_sat(sx, sy, .8);
  LN(sx + 34, cy - R, sx + 34, sy, GREY, 1.4); TB('400 km', sx + 40, (cy - R + sy) / 2 + 4, INK, 12, 'left');
  A(sx, cy - R + 2, 0, 0, RED); A(sx - 60, cy - R - 2, 0, 46, RED, '', 3.4); TB('9,82', sx - 80, cy - R + 40, DRED, 13, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(sx - 4, sy + 14, 0, 41 * q, ORANGE, '', 3.4); if (q > .95) { tag('g(h) = GM/(R+h)² ≈ 8,7 m/s²', W * .76, H * .2, DRED, 14); tag('≈ 89 % de g au sol', W * .76, H * .36, DGREEN, 14); } }
 },
 /* 4 vitesse et période de la station */
 function (p) {
  var cx = W * .3, cy = H * .52, RE = H * .3, r = H * .42; ph7_earth(cx, cy, RE); ctx.strokeStyle = '#c8ccd0'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
  var a = .5, P = {x: cx + r * Math.cos(a), y: cy - r * Math.sin(a)}; ph7_sat(P.x, P.y, .7); A(P.x, P.y, -Math.sin(a) * 50, -Math.cos(a) * 50, GREEN, '', 3.4);
  TB('h = 400 km', W * .98, H * .1, GREY, 13, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; A(P.x, P.y, (cx - P.x) * .22, (cy - P.y) * .22, RED, '', 3.2); TB('v = √(GM/r) ≈ 7,7 km/s', W * .98, H * .3, DGREEN, 14, 'right'); TB('T = 2πr/v ≈ 92 min', W * .98, H * .44, ORANGE, 14, 'right'); TB('≈ 15,6 tours par jour', W * .98, H * .58, DRED, 14, 'right'); ctx.globalAlpha = 1; }
 },
 /* 5 QCM : pourquoi flottent-ils */
 function (p) {
  var cx = W * .42, cy = H * .46; ctx.fillStyle = '#f4f8fc'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.roundRect(cx - 120, cy - 70, 240, 140, 18); ctx.fill(); ctx.stroke();
  pers(cx, cy + 34 - 8 * Math.sin(tGlob * .03), 66, VIOLET, 1); TB('astronaute', cx, cy - 48, VIO_D, 12); TB('station', cx + 80, cy - 52, BLUE_D, 12);
  A(cx - 90, cy - 20, 0, 40, RED, '', 3); A(cx + 90, cy - 20, 0, 40, RED, '', 3); TB('g', cx - 98, cy + 30, DRED, 13, 'right'); TB('g', cx + 98, cy + 30, DRED, 13, 'left');
  TB('même accélération g', W * .5, H * .1, GREY, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('chute libre commune : N = 0', W * .5, H * .88, DGREEN, 15); ctx.globalAlpha = 1; }
 },
 /* 6 Kepler 3 : Halley */
 function (p) {
  var a = W * .4, e = (35.3 - .586) / (35.3 + .586), b = a * Math.sqrt(1 - e * e), cx = W * .5, cy = H * .5, fx = cx + a * e; ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, 7); ctx.stroke();
  DOT(fx, cy, 7, '#f0b400'); TB('Soleil', fx, cy + 20, INK, 12); BALL(cx - a, cy, 6); TB('Halley, T = 76 ans', cx - a + 10, cy + 24, BLUE_D, 13, 'left');
  TB('T²/a³ = 1  (ans, UA)', W * .5, H * .12, INK, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; LN(cx - a, cy + 40, cx + a, cy + 40, ORANGE, 1.6); TB('2a = 0,586 + 35,3 ≈ 35,9 UA', cx, cy + 58, ORANGE, 13); TB('périhélie 0,586 UA', fx + 4, cy - 16, DGREEN, 12, 'right'); tag('aphélie ≈ 35,3 UA', cx - a + 70, cy - 30, DRED, 13);
   TB('Mars 1,88 an   Jupiter 5,20 UA', W * .5, H * .93, DGREEN, 13); ctx.globalAlpha = 1; }
 },
 /* 7 géostationnaire */
 function (p) {
  var cx = W * .32, cy = H * .52, RE = H * .2, r = RE * 42200 / 6371 * .62; ph7_earth(cx, cy, RE); ctx.strokeStyle = '#c8ccd0'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
  var a = -.5 + (p > 0 ? tGlob * .004 : 0); var P = {x: cx + r * Math.cos(a), y: cy + r * Math.sin(a)}; ph7_sat(P.x, P.y, .6);
  var Q = {x: cx + RE * Math.cos(a), y: cy + RE * Math.sin(a)}; DOT(Q.x, Q.y, 3, RED); LN(Q.x, Q.y, P.x, P.y, RED, 1.2, [3, 4]);
  TB('T = 86 164 s', W * .98, H * .1, GREY, 13, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; TB('r = ∛(GM·T²/4π²) ≈ 42 200 km', W * .98, H * .28, DGREEN, 13, 'right'); TB('h = r − R_T ≈ 35 800 km', W * .98, H * .42, DRED, 13, 'right'); TB('v ≈ 3,1 km/s', W * .98, H * .56, ORANGE, 14, 'right'); ctx.globalAlpha = 1; }
 },
 /* 8 QCM deux satellites */
 function (p) {
  var cx = W * .3, cy = H * .54, RE = H * .22, r = H * .4; ph7_earth(cx, cy, RE); ctx.strokeStyle = '#c8ccd0'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
  [[.3, .55, '100 kg'], [PI + .3, 1.0, '1 000 kg']].forEach(function (s) { var P = {x: cx + r * Math.cos(s[0]), y: cy - r * Math.sin(s[0])}; ph7_sat(P.x, P.y, s[1]); A(P.x, P.y, -Math.sin(s[0]) * 40, -Math.cos(s[0]) * 40, GREEN, '', 3); TB(s[2], P.x, P.y + 30, BLUE_D, 12); });
  TB('même orbite', W * .72, H * .2, GREY, 14, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('même vitesse v = √(GM/r)', W * .76, H * .42, DGREEN, 14); tag('force : F  et  10 F', W * .76, H * .58, DRED, 14); TB('(même accélération)', W * .76, H * .74, GREY, 13); ctx.globalAlpha = 1; }
 },
 /* 9 test de Newton : pomme et Lune */
 function (p) {
  var ex = W * .12, ey = H * .6, RE = H * .2; ph7_earth(ex, ey, RE); var mx = W * .84, my = H * .34; DOT(mx, my, 10, '#c9ccd2'); TB('Lune', mx, my + 28, GREY, 12);
  ctx.strokeStyle = '#d6d9dd'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(ex + RE, ey); ctx.lineTo(mx - 12, my); ctx.stroke(); ctx.setLineDash([]); TB('3,844·10⁸ m', W * .5, H * .38, INK, 12);
  DOT(ex + RE + 12, ey - 24, 6, RED); A(ex + RE + 12, ey - 24, 0, 26, RED, '', 3); TB('9,82 m/s²', ex + RE + 24, ey - 34, DRED, 12, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; A(mx, my, -22, 20, ORANGE, '', 3); tag('(a) GM/r² ≈ 2,70·10⁻³ m/s²', W * .6, H * .62, DGREEN, 13); tag('(b) v²/r ≈ 2,72·10⁻³ m/s²', W * .6, H * .76, DRED, 13); tag('(d) g·(R_T/r)² ≈ 2,70·10⁻³', W * .6, H * .9, ORANGE, 13); ctx.globalAlpha = 1; }
  else TB('la Lune tombe-t-elle comme la pomme ?', W * .6, H * .8, GREY, 14);
 },
 /* 10 vitesse d'évasion en altitude */
 function (p) {
  var x0 = W * .06, base = H * .86, bw = W * .2; var Y = function (v) { return base - v / 12 * H * .7; };
  LN(x0, base, W * .96, base, AX, 1.5);
  [[W * .1, 11.2, '11,2', 'au sol', BLUE], [W * .4, 10.86, '10,9', 'à 400 km', ORANGE], [W * .7, 7.67, '7,7', 'orbitale', GREEN]].forEach(function (b, i) { var q = i === 0 ? 1 : (p > 0 ? ph_ease(p, i * .15, .6 + i * .1) : (i === 2 ? 1 : 0)); if (i === 1 && p <= 0) { TB('?', b[0] + bw / 2, base - 40, GREY, 30); TB('v_e à 400 km', b[0] + bw / 2, base + 20, INK, 12); return; }
   ctx.fillStyle = b[4] + '55'; ctx.strokeStyle = b[4]; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(b[0], Y(b[1] * q), bw, base - Y(b[1] * q)); ctx.fill(); ctx.stroke(); TB(b[2] + ' km/s', b[0] + bw / 2, Y(b[1] * q) - 8, b[4] === ORANGE ? ORA2 : dk(b[4]), 13); TB(i === 0 ? 'v_e au sol' : i === 1 ? 'v_e à 400 km' : 'v orbitale 400 km', b[0] + bw / 2, base + 18, INK, 12); });
  if (p > 0) tag('v_e = √2 · v_orb  ;  plus petite en altitude', W * .5, H * .08, DGREEN, 13);
 }
]);
