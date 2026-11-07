/* Physique 5e · chapitre 1 : vecteurs, composition et décomposition des forces.
   Ce fichier (chargé en premier) définit aussi les petites aides ph_* communes aux theo-NN du cours. */
function ph_arr(x1,y1,x2,y2,c,lab,w,dash){arrow(x1,y1,x2-x1,y2-y1,c,lab,w,dash);}
function ph_ease(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function ph_ground(y,x0,x1){floor(x0,x1,y);}
function ph_dash(x1,y1,x2,y2,c){LN(x1,y1,x2,y2,c||GREY,1.3,[4,4]);}
function ph_box(x,y,w,h,c,lab){ctx.fillStyle='#eef4fb';ctx.strokeStyle=c||BLUE;ctx.lineWidth=2.3;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,5);ctx.fill();ctx.stroke();if(lab)TB(lab,x,y+4,dk(c||BLUE),Math.min(14,h*.5));}
function ph_axes(ox,oy,wx,hy,lx,ly){LN(ox,oy,ox+wx,oy,GREY,1.6);LN(ox,oy,ox,oy-hy,GREY,1.6);
 ctx.fillStyle=GREY;ctx.beginPath();ctx.moveTo(ox+wx+7,oy);ctx.lineTo(ox+wx-1,oy-4);ctx.lineTo(ox+wx-1,oy+4);ctx.fill();
 ctx.beginPath();ctx.moveTo(ox,oy-hy-7);ctx.lineTo(ox-4,oy-hy+1);ctx.lineTo(ox+4,oy-hy+1);ctx.fill();
 if(lx)TB(lx,ox+wx,oy+16,GREY,12,'right');if(ly)TB(ly,ox+8,oy-hy-4,GREY,12,'left');}
function ph_rr(x,y,w,h,fill,stroke,lw){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,6);ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1.5;ctx.stroke();}}
/* flèche partielle de (x1,y1) vers (x2,y2) à l'avancement q (0..1) */
function ph_arrp(x1,y1,x2,y2,q,c,lab,w){if(q<=0)return;arrow(x1,y1,(x2-x1)*q,(y2-y1)*q,c,q>.95?lab:'',w);}

/* plan incliné : renvoie le point de contact B (fraction f de la pente), u (montée), n (normale sortante) */
function ph_incl(th,x0,gy,Lx,f,bw){var ys=gy-Lx*Math.tan(th);ctx.fillStyle='#f1f3f5';ctx.beginPath();ctx.moveTo(x0,gy);ctx.lineTo(x0+Lx,gy);ctx.lineTo(x0+Lx,ys);ctx.closePath();ctx.fill();
 LN(x0,gy,x0+Lx,ys,INK,2.6);LN(x0-8,gy,x0+Lx+14,gy,AX,1.6);arcA({x:x0,y:gy},46,0,-th,'',GREY);
 var u={x:Math.cos(th),y:-Math.sin(th)},n={x:-Math.sin(th),y:-Math.cos(th)},B={x:x0+Lx*f,y:gy-Lx*f*Math.tan(th)};
 ctx.save();ctx.translate(B.x,B.y);ctx.rotate(-th);ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE_D;ctx.lineWidth=2.2;ctx.beginPath();ctx.roundRect(-bw/2,-bw,bw,bw,5);ctx.fill();ctx.stroke();ctx.restore();
 return {u:u,n:n,C:{x:B.x+n.x*bw/2,y:B.y+n.y*bw/2}};}
SFA.theo("c01", {
  icon: function () {
    var cx = W * .1, cy = H * .78, k = H * .0105;
    ph_dash(cx + 55 * k, cy, cx + 55 * k, cy - 45 * k); ph_dash(cx, cy - 45 * k, cx + 55 * k, cy - 45 * k);
    ph_arr(cx, cy, cx + 55 * k, cy, BLUE, '', 4); ph_arr(cx, cy, cx, cy - 45 * k, GREEN, '', 4);
    ph_arr(cx, cy, cx + 55 * k, cy - 45 * k, ORANGE, '', 5);
    TB('F = F\u2093 + F\u1D67', W * .7, H * .4, BLUE_D, 28); TB('composer \u00B7 décomposer', W * .7, H * .6, ORANGE, 17);
  },
  anim: function (t) {
    var ox = W * .2, oy = H * .86, k = Math.min(W / 520, H / 250) * 1.1;
    var a = 30 * D2R, th = (75 - 75 * Math.cos(t * .011)) * D2R, b = a + th;
    var F1 = 100 * k, F2 = 75 * k;
    var x1 = ox + F1 * Math.cos(a), y1 = oy - F1 * Math.sin(a);
    var x2 = x1 + F2 * Math.cos(b), y2 = y1 - F2 * Math.sin(b);
    var x3 = ox + F2 * Math.cos(b), y3 = oy - F2 * Math.sin(b);
    ph_dash(x3, y3, x2, y2); ph_dash(ox, oy, x3, y3, '#d6d9dd'); ph_arr(ox, oy, x3, y3, '#b9a7ee', '', 1.8);
    ph_arr(ox, oy, x1, y1, BLUE, '', 3.4); ph_arr(x1, y1, x2, y2, VIOLET, '', 3.4); ph_arr(ox, oy, x2, y2, ORANGE, '', 4.6);
    TB('F\u2081', (ox + x1) / 2 + 4, (oy + y1) / 2 + 20, BLUE_D, 14); TB('F\u2082', (x1 + x2) / 2 + 14, (y1 + y2) / 2 - 8, VIO_D, 14); TB('R', (ox + x2) / 2 - 16, (oy + y2) / 2 - 8, DRED, 16);
    DOT(ox, oy, 5, INK);
    var R = Math.hypot(F1 * Math.cos(a) + F2 * Math.cos(b), F1 * Math.sin(a) + F2 * Math.sin(b)) / k;
    var px = W * .58;
    TB('Les forces s\u2019additionnent comme des vecteurs', W * .5, 24, BLUE_D, 15);
    TB('F\u2081 = 100 N   F\u2082 = 75 N', px, H * .3, GREY, 13, 'left');
    TB('angle entre les forces : ' + Math.round(th / D2R) + '\u00B0', px, H * .42, VIO_D, 14, 'left');
    TB('R = ' + R.toFixed(0) + ' N', px, H * .58, ORANGE, 26, 'left');
    TB('R varie ici de 51 N à 175 N', px, H * .72, GREY, 12, 'left');
  },
  th: '<div class="tcard"><b class="h">Une force est un vecteur</b><p>Une force est caractérisée par quatre éléments : son <b>point d’application</b>, sa <b>direction</b>, son <b>sens</b> et sa <b>norme</b> (en newtons, N). On la dessine par une flèche dont la longueur est proportionnelle à la norme. Deux forces de 6 N et de 8 N n’ont pas pour effet 14 N, sauf si elles ont même direction et même sens.</p></div>' +
  '<div class="tcard"><b class="h">Composer : la résultante</b><p>La <b>résultante</b> R = F<sub>1</sub> + F<sub>2</sub> + … est la force unique qui a le même effet que toutes les autres. Graphiquement : règle du <b>parallélogramme</b>, ou mise <b>bout à bout</b> des flèches. Par calcul : on additionne les <b>composantes</b> : R<sub>x</sub> = ΣF<sub>x</sub>, R<sub>y</sub> = ΣF<sub>y</sub>, puis ‖R‖ = √(R<sub>x</sub>² + R<sub>y</sub>²) et tan θ = R<sub>y</sub>/R<sub>x</sub>.</p><p>Encadrement : |F<sub>1</sub> − F<sub>2</sub>| ≤ ‖R‖ ≤ F<sub>1</sub> + F<sub>2</sub>. Forces perpendiculaires : Pythagore.</p></div>' +
  '<div class="tcard"><b class="h">Décomposer selon deux axes</b><p>Une force F faisant un angle α avec l’axe x a pour composantes <b>F<sub>x</sub> = F·cos α</b> et <b>F<sub>y</sub> = F·sin α</b> (α mesuré depuis l’axe x). Sur un plan incliné d’angle α, on choisit les axes <i>parallèle</i> et <i>perpendiculaire</i> au plan : <b>P<sub>∥</sub> = P·sin α</b> (fait glisser) et <b>P<sub>⊥</sub> = P·cos α</b> (appuie sur le plan).</p></div>' +
  '<div class="tcard"><b class="h">Méthode et pièges</b><ul><li>Choisis un repère adapté (souvent un axe le long du mouvement ou du plan).</li><li>Vérifie l’angle : cos pour la composante <i>le long</i> de l’angle, sin pour l’autre. Contrôle : √(F<sub>x</sub>² + F<sub>y</sub>²) doit redonner F.</li><li>Mets les signes : une composante vers la gauche ou vers le bas est négative.</li><li>Câble presque horizontal : 2·T·sin α = m·g, donc T devient énorme quand α → 0.</li></ul></div>' +
  '<div class="tcard"><b class="h">Exemple chiffré</b><p>F<sub>1</sub> = (12 ; 5) N et F<sub>2</sub> = (−4 ; 7) N. R<sub>x</sub> = 12 − 4 = 8 N, R<sub>y</sub> = 5 + 7 = 12 N, ‖R‖ = √208 ≈ 14,4 N, θ = arctan(12/8) ≈ 56,3°. Bloc de 8 kg sur 25° : P = 78,5 N, P<sub>∥</sub> = 78,5·sin 25° ≈ 33,2 N, P<sub>⊥</sub> ≈ 71,1 N.</p></div>'
});

SFA.figs("c01", [
 /* 1 composantes 20 N, 30° */
 function (p) {
  var ox = W * .14, oy = H * .78, k = Math.min(W * .62, H * .9) / 20 * 1.0, a = 30 * D2R;
  ph_axes(ox, oy, W * .78, H * .66, 'x', 'y');
  var ex = ox + 20 * k * Math.cos(a), ey = oy - 20 * k * Math.sin(a);
  ph_dash(ex, ey, ex, oy); ph_dash(ex, ey, ox, ey);
  ph_arr(ox, oy, ex, ey, ORANGE, 'F = 20 N', 4.6);
  arcA({x: ox, y: oy}, 44, 0, -a, '30°', GREY);
  if (p > 0) { var q = ph_ease(p, 0, .6);
   ph_arrp(ox, oy + 12, ox + (ex - ox), oy + 12, q, BLUE, '', 3.4); ph_arrp(ox - 12, oy, ox - 12, ey, q, GREEN, '', 3.4);
   if (q > .9) { TB('Fx = 17,3 N', (ox + ex) / 2, oy + 36, BLUE_D, 15); TB('Fy = 10,0 N', ox - 20, (oy + ey) / 2, DGREEN, 14, 'right'); } }
 },
 /* 2 perpendiculaires 6 E + 8 N */
 function (p) {
  var ox = W * .2, oy = H * .84, k = Math.min(W * .55 / 6, H * .66 / 8);
  var ex = ox + 6 * k, ny = oy - 8 * k;
  ph_dash(ex, oy, ex, ny); ph_dash(ox, ny, ex, ny);
  ph_arr(ox, oy, ex, oy, BLUE, '6 N', 4); ph_arr(ox, oy, ox, ny, VIOLET, '8 N', 4);
  rmark({x: ox, y: oy}, {x: 1, y: 0}, {x: 0, y: -1}, 12);
  TB('E', ex + 34, oy + 5, GREY, 13); TB('N', ox, ny - 30, GREY, 13);
  if (p > 0) { var q = ph_ease(p, 0, .6); ph_arrp(ox, oy, ex, ny, q, ORANGE, '', 5);
   if (q > .95) { tag('R = √(6² + 8²) = 10 N', ox + (ex - ox) * .62 + 36, oy - (oy - ny) * .45 + 30, DRED, 14); } }
 },
 /* 3 somme par composantes sur grille */
 function (p) {
  var k = Math.min(W * .9 / 14, H * .86 / 13), O = {x: W * .2, y: H * .9};
  ctx.strokeStyle = '#eceef1'; ctx.lineWidth = 1;
  for (var i = -5; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(O.x + i * k, O.y + 2); ctx.lineTo(O.x + i * k, O.y - 13 * k); ctx.stroke(); }
  for (var j = 0; j <= 13; j++) { ctx.beginPath(); ctx.moveTo(O.x - 5 * k, O.y - j * k); ctx.lineTo(O.x + 10 * k, O.y - j * k); ctx.stroke(); }
  LN(O.x - 5 * k, O.y, O.x + 10.5 * k, O.y, AX, 1.5); LN(O.x, O.y + 4, O.x, O.y - 13.2 * k, AX, 1.5);
  ph_arr(O.x, O.y, O.x + 12 * k, O.y - 5 * k, BLUE, '', 3.2);
  ph_arr(O.x + 12 * k, O.y - 5 * k, O.x + 8 * k, O.y - 12 * k, VIOLET, '', 3.2); TB('F₂', O.x + 10.6 * k + 14, O.y - 8.5 * k - 2, VIO_D, 14, 'left'); TB('F₁', O.x + 6 * k, O.y - 1.6 * k - 8, BLUE_D, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); ph_arr(O.x, O.y, O.x + 8 * k * q, O.y - 12 * k * q, ORANGE, '', 4.6);
   if (q > .95) { tag('R = (8 ; 12) N', O.x + 4 * k - 14, O.y - 6 * k, DRED, 14); tag('14,4 N ; 56,3°', O.x + 4 * k - 14, O.y - 6 * k + 24, DRED, 13); } }
 },
 /* 4 bloc 8 kg sur plan 25° */
 function (p) {
  var th = 25 * D2R, gy = H * .86, x0 = W * .06, Lx = W * .8, kP = H * .0046;
  var g = ph_incl(th, x0, gy, Lx, .6, 48), C = g.C, u = g.u, n = g.n;
  TB('25°', x0 + 66, gy - 6, GREY, 13); TB('8 kg', C.x, C.y + 5, BLUE_D, 13);
  arrow(C.x, C.y, 0, 78.5 * kP, RED, '', 3.4); TB('P = 78,5 N', C.x + 6, C.y + 78.5 * kP + 20, DRED, 14, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6);
   var ax = -u.x * 33.2 * kP * q, ay = -u.y * 33.2 * kP * q, bx = -n.x * 71.1 * kP * q, by = -n.y * 71.1 * kP * q;
   arrow(C.x, C.y, ax, ay, GREEN, '', 3.2); arrow(C.x, C.y, bx, by, VIOLET, '', 3.2);
   if (q > .95) { TB('P∥ ≈ 33,2 N (le long de la pente)', W * .05, H * .1, DGREEN, 14, 'left'); TB('P⊥ ≈ 71,1 N (contre le plan)', W * .05, H * .2, VIO_D, 14, 'left'); } }
 },
 /* 5 QCM 30 et 40 N : valeurs possibles */
 function (p) {
  var x0 = W * .08, x1 = W * .92, y = H * .62, X = function (v) { return x0 + v / 90 * (x1 - x0); };
  A(X(0), H * .16, X(30) - X(0), 0, BLUE, '', 3.6); TB('30 N', X(15), H * .16 - 12, BLUE_D, 14);
  A(X(30), H * .32, X(70) - X(30), 0, VIOLET, '', 3.6); TB('40 N', X(50), H * .32 - 12, VIO_D, 14);
  TB('même sens : 70 N', W * .5, H * .43, GREY, 12);
  LN(x0, y, x1, y, GREY, 2);
  [0, 10, 30, 50, 70, 80].forEach(function (v) { LN(X(v), y - 5, X(v), y + 5, GREY, 1.5); TB(v + ' N', X(v), y + 24, INK, 13); });
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.fillStyle = 'rgba(29,158,117,.28)'; ctx.fillRect(X(10), y - 12, (X(70) - X(10)) * q, 24);
   if (q > .9) { LN(X(10), y - 12, X(10), y + 12, DGREEN, 3); LN(X(70), y - 12, X(70), y + 12, DGREEN, 3); TB('R possible : de 10 N à 70 N', X(40), y - 22, DGREEN, 14);
    var r = 11; LN(X(80) - r, y - r, X(80) + r, y + r, RED, 4); LN(X(80) - r, y + r, X(80) + r, y - r, RED, 4); TB('80 N impossible', X(80) - 4, y + 54, DRED, 13); } }
 },
 /* 6 traîneau, deux câbles */
 function (p) {
  var ox = W * .26, oy = H * .52, k = H * .0033;
  var a1 = 20 * D2R, a2 = 35 * D2R;
  ctx.setLineDash([6, 6]); LN(ox, oy, ox + W * .66, oy, AX, 1.4); ctx.setLineDash([]);
  ph_box(ox, oy, 54, 30, BLUE, '');
  var F1 = 120 * k * 1.15, F2 = 150 * k * 1.15;
  ph_arr(ox + 27, oy, ox + 27 + F1 * Math.cos(a1), oy - F1 * Math.sin(a1), BLUE, '120 N', 3.4);
  ph_arr(ox + 27, oy, ox + 27 + F2 * Math.cos(a2), oy + F2 * Math.sin(a2), VIOLET, '150 N', 3.4);
  arcA({x: ox + 27, y: oy}, 54, 0, -a1, '20°', GREY); arcA({x: ox + 27, y: oy}, 66, 0, a2, '35°', GREY);
  TB('côté gauche', W * .04, H * .1, GREY, 12, 'left'); TB('côté droit', W * .04, H * .94, GREY, 12, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6), Rx = 235.6, Ry = 45;
   ph_arrp(ox + 27, oy, ox + 27 + Rx * k * 1.15, oy + Ry * k * 1.15, q, ORANGE, '', 5);
   if (q > .95) tag('R ≈ 240 N, 10,8° à droite', ox + 27 + Rx * k * 1.15 - 40, oy + Ry * k * 1.15 + 36, DRED, 14); }
 },
 /* 7 enseigne suspendue, deux câbles */
 function (p) {
  var cx = W * .5, yy = H * .16, sx = W * .06, ex = W * .94, a = 30 * D2R;
  wall(sx, yy - 20, yy + 60, 1); wall(ex, yy - 20, yy + 60, -1);
  var m = {x: cx, y: yy + (cx - sx) * Math.tan(a) * .62}, ang = Math.atan2(m.y - yy, cx - sx);
  LN(sx, yy, m.x, m.y, INK, 2.4); LN(ex, yy, m.x, m.y, INK, 2.4);
  ph_dash(sx, yy, cx, yy);
  arcA({x: sx, y: yy}, 60, 0, ang, '', GREY); TB('α', sx + 72, yy + 22, GREY, 14);
  LN(m.x, m.y, m.x, m.y + 14, INK, 2); ph_box(m.x, m.y + 38, 78, 48, BLUE, '20 kg');
  arrow(m.x + 44, m.y + 38, 0, 40, RED, '', 3.2); TB('P = 196 N', m.x + 54, m.y + 74, DRED, 13, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6), L = W * .13;
   ph_arrp(m.x, m.y, m.x - L * Math.cos(ang), m.y - L * Math.sin(ang), q, ORANGE, '', 3.6); ph_arrp(m.x, m.y, m.x + L * Math.cos(ang), m.y - L * Math.sin(ang), q, ORANGE, '', 3.6);
   if (q > .95) { tag('2·T·sin α = m·g', W * .5, H * .78, INK, 13); tag('α = 30° : T = 196 N', W * .27, H * .93, DGREEN, 13); tag('α = 10° : T ≈ 565 N', W * .73, H * .93, DRED, 13); } }
 },
 /* 8 QCM plan à 60° */
 function (p) {
  var th = 60 * D2R, gy = H * .88, x0 = W * .1, hgt = H * .74, Lx = hgt / Math.tan(th), kP = H * .4;
  var g = ph_incl(th, x0, gy, Lx, .7, 44), C = g.C, u = g.u, n = g.n;
  TB('60°', x0 + 38, gy - 8, GREY, 13);
  arrow(C.x, C.y, 0, kP, RED, '', 3.4); TB('P', C.x + 12, C.y + kP + 6, DRED, 14, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6);
   var ax = -u.x * kP * .866 * q, ay = -u.y * kP * .866 * q, bx = -n.x * kP * .5 * q, by = -n.y * kP * .5 * q;
   arrow(C.x, C.y, ax, ay, GREEN, '', 3.2); arrow(C.x, C.y, bx, by, VIOLET, '', 3.2);
   TB('P∥ = P·sin 60° = 0,87·P', W * .93, H * .3, DGREEN, 15, 'right'); TB('P⊥ = P·cos 60° = 0,50·P', W * .93, H * .45, VIO_D, 15, 'right'); }
 },
 /* 9 remorqueurs */
 function (p) {
  var ox = W * .28, oy = H * .5, th = 41.4 * D2R, k = W * .0042;
  ctx.fillStyle = '#e9f1fa'; ctx.fillRect(0, 0, W, H);
  ctx.setLineDash([6, 6]); LN(ox, oy, W * .95, oy, AX, 1.4); ctx.setLineDash([]);
  ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(ox - 56, oy - 18); ctx.lineTo(ox + 14, oy - 18); ctx.lineTo(ox + 36, oy); ctx.lineTo(ox + 14, oy + 18); ctx.lineTo(ox - 56, oy + 18); ctx.closePath(); ctx.fill(); ctx.stroke();
  var L = 80 * k, sx = ox + 36, ex = sx + L * Math.cos(th), ey = oy - L * Math.sin(th);
  [-1, 1].forEach(function (s) { var yy = oy + s * (oy - ey); ctx.fillStyle = '#d0e3f7'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(ex + 18, yy - 9, 34, 18, 7); ctx.fill(); ctx.stroke(); ph_arr(sx, oy, ex + 18, yy, BLUE, '', 3.2); });
  TB('80 kN', ex + 36, ey - 14, BLUE_D, 13); TB('80 kN', ex + 36, oy * 2 - ey + 24, BLUE_D, 13);
  arcA({x: sx, y: oy}, 56, 0, -th, '', GREY); TB('θ', sx + 66, oy - 12, GREY, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); ph_arrp(sx, oy, sx + 120 * k, oy, q, ORANGE, '', 5);
   if (q > .95) { tag('R = 2·80·cos θ = 120 kN', sx + 120 * k * .5, oy + 28, DRED, 14); tag('θ ≈ 41,4° (82,8° entre câbles)', W * .56, H * .94, DGREEN, 13); } }
 },
 /* 10 guirlande */
 function (p) {
  var xl = W * .08, xr = W * .92, y0 = H * .22, sag = H * .13, xm = W * .5;
  wall(xl, y0 - 50, y0 + 110, 1); wall(xr, y0 - 50, y0 + 110, -1);
  ctx.setLineDash([5, 5]); LN(xl, y0, xr, y0, AX, 1.4); ctx.setLineDash([]);
  LN(xl, y0, xm, y0 + sag, INK, 2.4); LN(xr, y0, xm, y0 + sag, INK, 2.4);
  DOT(xm, y0 + sag + 22, 14, '#fff6d6'); ctx.strokeStyle = YEL; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(xm, y0 + sag + 22, 14, 0, 7); ctx.stroke(); LN(xm, y0 + sag, xm, y0 + sag + 8, INK, 1.6);
  TB('100 kg', xm - 24, y0 + sag + 28, BLUE_D, 13, 'right');
  TB('20 m', xm, y0 - 14, GREY, 13); TB('0,5 m', xm + 38, y0 + sag * .55, GREY, 12, 'left'); LN(xm + 30, y0, xm + 30, y0 + sag, GREY, 1.2);
  if (p > 0) { var q = ph_ease(p, 0, .6), L = W * .2; var ux = (xm - xl), uy = -sag, n = Math.hypot(ux, uy); ux /= n; uy /= n;
   ph_arrp(xm, y0 + sag, xm - ux * L, y0 + sag + uy * L, q, ORANGE, '', 4); ph_arrp(xm, y0 + sag, xm + ux * L, y0 + sag + uy * L, q, ORANGE, '', 4);
   ph_arrp(xm, y0 + sag + 40, xm, y0 + sag + 80, q, RED, '', 3.4);
   if (q > .95) { tag('tan α = 0,5/10 → α ≈ 2,9°', W * .5, H * .84, INK, 13); tag('T ≈ 9,8 kN (10 × le poids)', W * .5, H * .95, DRED, 13); } }
 }
]);
