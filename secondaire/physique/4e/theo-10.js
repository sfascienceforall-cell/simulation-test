/* Physique 4e · chapitre 10 : lentilles, œil et couleurs (utilise les aides q_* de theo-01.js) */
(function () {
  function fr(v, d) { return v.toFixed(d === undefined ? 1 : d).replace('.', ','); }
  function fit(fn, dw, dh) { return function (a) { var w0 = W, h0 = H, u = Math.min(w0 / dw, h0 / dh); ctx.save(); ctx.translate((w0 - dw * u) / 2, (h0 - dh * u) / 2); ctx.scale(u, u); W = dw; H = dh; try { fn(a); } finally { W = w0; H = h0; ctx.restore(); } }; }
  function fig(fn) { return fit(fn, 460, 280); }
  function an(fn) { return fit(fn, 700, 300); }
  function ic(fn) { return fit(fn, 460, 260); }
  var RAY = '#e0a418';
  function ray(x1, y1, x2, y2, col, w, dash) { LN(x1, y1, x2, y2, col || RAY, w || 2.4, dash); }
  function lens(x, cy, hh, conv) {
    ctx.fillStyle = 'rgba(120,180,235,.25)'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath();
    if (conv) { ctx.moveTo(x, cy - hh); ctx.quadraticCurveTo(x + 14, cy, x, cy + hh); ctx.quadraticCurveTo(x - 14, cy, x, cy - hh); }
    else { ctx.moveTo(x - 12, cy - hh); ctx.quadraticCurveTo(x + 2, cy, x - 12, cy + hh); ctx.lineTo(x + 12, cy + hh); ctx.quadraticCurveTo(x - 2, cy, x + 12, cy - hh); ctx.closePath(); }
    ctx.fill(); ctx.stroke();
    var s = conv ? 1 : -1; LN(x, cy - hh, x, cy + hh, BLUE_D, 1, [3, 3]);
  }
  function arrowObj(x, cy, hgt, col, lab, dashed) { ctx.save(); if (dashed) ctx.setLineDash([5, 4]); var up = hgt < 0 ? -1 : 1; A(x, cy, 0, -hgt, col, '', 3.2); ctx.restore(); if (lab) TB(lab, x - 14, cy - hgt / 2 + 5, dk(col), 13, 'right'); }
  function axis(x1, x2, cy) { LN(x1, cy, x2, cy, AX, 1.6); }
  function foc(cx, cy, f, sc) { [-1, 1].forEach(function (s) { DOT(cx + s * f * sc, cy, 3.5, GREY); }); TB('F', cx - f * sc, cy + 17, GREY, 12); TB("F'", cx + f * sc, cy + 17, GREY, 12); }
  /* scène à lentille convergente : f, p, q en cm ; h hauteur de l'objet en px */
  function scene(cx, cy, sc, f, p, h, opt) {
    opt = opt || {}; var q = 1 / (1 / f - 1 / p), gam = -q / p;
    axis(cx - 260, cx + 260, cy); lens(cx, cy, 78, true); foc(cx, cy, f, sc);
    var ox = cx - p * sc; arrowObj(ox, cy, h, ORA2);
    var tx = ox, ty = cy - h, a = opt.a === undefined ? 1 : opt.a;
    if (a > 0) {
      var ix = cx + q * sc, iy = cy - gam * h;
      ctx.globalAlpha = a;
      ray(tx, ty, cx, ty); ray(tx, ty, cx, cy);
      if (q > 0) { ray(cx, ty, ix, iy); ray(cx, cy, ix, iy); arrowObj(ix, cy, gam * h, GREEN); }
      else { var dx = 250, k = (cy - ty) / (f * sc); ray(cx, ty, cx + dx, ty + k * dx); var m = (cy - ty) / (cx - tx); ray(cx, cy, cx + dx, cy + m * dx); ray(cx, ty, ix, iy, RAY, 1.5, [5, 4]); ray(cx, cy, ix, iy, RAY, 1.5, [5, 4]); ctx.save(); ctx.setLineDash([5, 4]); A(ix, cy, 0, -gam * h, GREEN, '', 3); ctx.restore(); }
      ctx.globalAlpha = 1;
    }
    return { q: q, gam: gam };
  }

  SFA.theo("c10", {
    icon: ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      var cy = 120; axis(20, 440, cy); lens(190, cy, 70, true); DOT(120, cy, 3, GREY); DOT(260, cy, 3, GREY);
      A(60, cy, 0, -34, ORA2, '', 3); ray(60, cy - 34, 190, cy - 34); ray(190, cy - 34, 340, cy + 56); ray(60, cy - 34, 340, cy + 56, RAY, 1.6); A(330, cy, 0, 38, GREEN, '', 3);
      TB('1/f = 1/p + 1/q', 230, 228, BLUE_D, 22); TB('lentilles · œil · couleurs', 230, 250, GREY, 13);
      DOT(375, 40, 11, 'rgba(226,75,74,.9)'); DOT(395, 40, 11, 'rgba(29,158,117,.9)'); DOT(385, 56, 11, 'rgba(55,138,221,.9)');
    }),
    sub: [
      {
        t: "Lentilles et images",
        anim: an(function (t) {
          var ph = (t % 900) / 900, f = 10, sc = 5, cx = 250, cy = 150, p, h = 20, loupe = ph >= .55;
          if (!loupe) p = 35 - 21 * (.5 - .5 * Math.cos(ph / .55 * PI)); else { var u = (ph - .55) / .45; p = 8 - 4 * (.5 - .5 * Math.cos(u * PI)); h = 9; }
          var r = scene(cx, cy, sc, f, p, h);
          var tx = 500; TB('f = 10 cm', tx, 38, GREY, 15, 'left'); TB('p = ' + fr(p, 1) + ' cm', tx, 68, ORA2, 20, 'left'); TB('q = ' + fr(r.q, 1) + ' cm', tx, 98, DGREEN, 20, 'left');
          TB('γ = −q/p = ' + (r.gam > 0 ? '+' : '−') + fr(Math.abs(r.gam), 2), tx, 130, INK, 17, 'left');
          q_box_(tx + 90, 182, 180, 44, loupe ? DRED : DGREEN, loupe ? '#fdeaea' : '#e9f6f0', loupe ? 'virtuelle, droite' : 'réelle, renversée', 15);
          TB(loupe ? 'p < f : effet loupe' : 'p > f : image sur un écran', tx, 232, GREY, 14, 'left');
        }),
        th:
          '<div class="tcard"><b class="h">Lentille convergente : foyer et vergence</b><p>Une lentille à bords minces fait converger un faisceau parallèle à son axe en un point, le <b>foyer image F\'</b>. La distance du centre optique au foyer est la <b>distance focale f</b>. La <b>vergence</b> mesure le pouvoir de convergence : <b>C = 1/f</b>, en <b>dioptries</b> (δ) avec f en <b>mètres</b>. Une lentille divergente (bords épais) a f &lt; 0 et C &lt; 0.</p><p><b>Exemples :</b> f = 25 cm = 0,25 m donne C = <b>+4 δ</b> ; f = −50 cm donne C = <b>−2 δ</b>.</p><p>Trois <b>rayons remarquables</b> : parallèle à l\'axe → ressort en passant par F\' ; passant par le centre → non dévié ; passant par F → ressort parallèle à l\'axe. L\'image est à leur croisement.</p></div>' +
          '<div class="tcard"><b class="h">Relation de conjugaison et grandissement</b><p><b>1/f = 1/p + 1/q</b> et <b>γ = −q/p = h<sub>image</sub> / h<sub>objet</sub></b> (p : distance objet–lentille ; q : distance lentille–image ; mêmes unités).</p><ul><li><b>p &gt; f</b> : q &gt; 0, image <b>réelle</b> (visible sur un écran), <b>renversée</b> (γ &lt; 0).</li><li><b>p &lt; f</b> : q &lt; 0, image <b>virtuelle</b> (du même côté que l\'objet), <b>droite</b> et agrandie (γ &gt; 0) : c\'est la <b>loupe</b>.</li></ul><p><b>Exemple 1 :</b> f = 10 cm, p = 30 cm, objet de 4 cm : 1/q = 1/10 − 1/30 = 1/15, donc q = <b>15 cm</b>, γ = −0,5, image de <b>2 cm</b>, réelle et renversée.</p><p><b>Exemple 2 (loupe) :</b> f = 5 cm, p = 4 cm : q = <b>−20 cm</b>, γ = <b>+5</b> : image virtuelle, droite, 5 fois plus grande.</p></div>' +
          '<div class="tcard"><b class="h">Applications</b><ul><li><b>Appareil photo</b> (f = 50 mm) : objet loin (p ≫ f), donc q ≈ f. Personne de 1,80 m à 5,0 m : q = 50,5 mm, image de 1,8 × 50,5 / 5 000 ≈ <b>18 mm</b> sur le capteur. À 2,0 m : ≈ 46 mm, trop grand pour le capteur.</li><li><b>Projecteur</b> : la diapositive est placée juste après le foyer (10,3 cm pour f = 10 cm), γ = −29 : elle se place <b>à l\'envers</b> pour une image droite sur l\'écran.</li><li><b>Cacher la moitié de la lentille :</b> l\'image reste <b>complète</b>, mais moins lumineuse.</li></ul></div>'
      },
      {
        t: "L'œil et ses défauts",
        anim: an(function (t) {
          var ph = (t % 840) / 840, gl = ph >= .5, cy = 150, lx = 270, ret = 470, xf = gl ? ret : 395;
          ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(365, cy, 120, 88, 0, 0, 7); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(365, cy, 120, 88, 0, -1.0, 1.0); ctx.stroke(); TB('rétine', ret + 8, cy - 100, DRED, 13, 'left');
          lens(lx, cy, 36, true); TB('cristallin', lx, cy + 62, GREY, 12);
          [[-34, 1], [34, 1]].forEach(function (r) {
            var y0 = cy + r[0], yl = gl ? cy + r[0] * 1.06 : y0;
            if (gl) { ray(40, y0, 160, cy + r[0] * 1.3); ray(160, cy + r[0] * 1.3, lx, yl + 0); ray(lx, yl, xf, cy); }
            else { ray(40, y0, lx, y0); ray(lx, y0, xf, cy); ray(xf, cy, ret, cy - r[0] * (ret - xf) / (xf - lx) * 1); }
            if (!gl) { }
          });
          if (gl) { lens(160, cy, 52, false); TB('divergente', 160, cy + 76, BLUE_D, 12); [-1, 1].forEach(function (s) { }); }
          DOT(xf, cy, 5, gl ? GREEN : RED);
          var tx = 585; TB(gl ? 'avec lunettes' : 'œil myope', tx, 70, gl ? DGREEN : DRED, 18, 'left');
          TB(gl ? 'image sur la rétine' : 'image avant la rétine', tx, 100, gl ? DGREEN : DRED, 14, 'left'); TB(gl ? 'vision nette' : 'vision floue de loin', tx, 122, GREY, 14, 'left');
          if (gl) q_box_(tx + 50, 190, 100, 40, BLUE_D, '#eef4fb', 'C < 0', 20); else TB('p. remotum : 50 cm', tx, 190, GREY, 13, 'left');
        }),
        th:
          '<div class="tcard"><b class="h">L\'œil, un système optique</b><p>L\'œil est un système <b>convergent</b> : la cornée et le <b>cristallin</b> (lentille de vergence variable) donnent d\'un objet une <b>image réelle et renversée</b> sur la <b>rétine</b> ; le cerveau la remet à l\'endroit. La <b>pupille</b> règle la quantité de lumière. Pour voir net à différentes distances, le cristallin se déforme : c\'est l\'<b>accommodation</b>. Un œil normal voit net de ≈ 25 cm (punctum proximum) jusqu\'à l\'infini (punctum remotum).</p></div>' +
          '<div class="tcard"><b class="h">Myopie et hypermétropie</b><ul><li><b>Myopie :</b> œil trop convergent (ou trop long) : l\'image d\'un objet lointain se forme <b>avant</b> la rétine ; on voit flou de loin. Correction : lentille <b>divergente</b> (C &lt; 0).</li><li><b>Hypermétropie :</b> œil pas assez convergent : l\'image se formerait <b>après</b> la rétine ; on voit mal de près. Correction : lentille <b>convergente</b> (C &gt; 0).</li></ul><p><b>Calcul :</b> un myope voit net jusqu\'à 50 cm. Les lunettes doivent donner d\'un objet à l\'infini une image <b>virtuelle à 50 cm</b> : f = −0,50 m, donc C = 1/f = <b>−2,0 δ</b>. Des lunettes de −3 δ (f ≈ −33 cm) forment de même une image virtuelle à 33 cm environ, que l\'œil non accommodé voit nette.</p></div>'
      },
      {
        t: "Les couleurs",
        anim: an(function (t) {
          var ph = (t % 600) / 600, u = q_r(.5 - .5 * Math.cos(ph * 2 * PI), 0, 1), r = 48, d = 34 * (1 - u) + 28 * u * 0 + 0;
          var d1 = 62 * (1 - u) + 24 * u; function circ(x, y, col, op) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
          ctx.fillStyle = '#111'; ctx.fillRect(30, 30, 300, 250); ctx.globalCompositeOperation = 'lighter';
          var cx = 180, cy = 150;
          circ(cx - d1 * .9, cy - d1 * .55 + 10, '#ff0000'); circ(cx + d1 * .9, cy - d1 * .55 + 10, '#00ff00'); circ(cx, cy + d1 * .95 + 4, '#0000ff'); ctx.globalCompositeOperation = 'source-over';
          TB('synthèse additive (lumières)', 180, 22, INK, 14);
          ctx.fillStyle = '#fff'; ctx.strokeStyle = AX; ctx.lineWidth = 1.5; ctx.fillRect(370, 30, 300, 250); ctx.strokeRect(370, 30, 300, 250); ctx.globalCompositeOperation = 'multiply';
          var c2 = 520; circ(c2 - d1 * .9, cy - d1 * .55 + 10, '#00ffff'); circ(c2 + d1 * .9, cy - d1 * .55 + 10, '#ffff00'); circ(c2, cy + d1 * .95 + 4, '#ff00ff'); ctx.globalCompositeOperation = 'source-over';
          TB('synthèse soustractive (pigments)', 520, 22, INK, 14);
          if (u > .85) { ctx.globalAlpha = q_r(u, .85, 1); TB('blanc', 180, cy + 6, '#111', 15); TB('noir', 520, cy + 6, '#fff', 15); ctx.globalAlpha = 1; }
          TB('R + V + B = blanc', 180, 296, DGREEN, 13); TB('C + M + J = noir', 520, 296, DGREEN, 13);
        }),
        th:
          '<div class="tcard"><b class="h">Synthèse additive : mélanger des lumières</b><p>Trois lumières primaires, <b>rouge, verte et bleue</b> (R, V, B), suffisent à recréer toutes les couleurs, en les <b>additionnant</b> (écrans, projecteurs).</p><ul><li>rouge + vert = <b>jaune</b> ; vert + bleu = <b>cyan</b> ; rouge + bleu = <b>magenta</b> ;</li><li>rouge + vert + bleu = <b>blanc</b>.</li></ul></div>' +
          '<div class="tcard"><b class="h">Synthèse soustractive : filtres, peintures, objets</b><p>Un pigment ou un filtre <b>absorbe</b> certaines couleurs et en laisse (ou renvoie) d\'autres : les couleurs <b>se retranchent</b>. Primaires : <b>cyan, magenta, jaune</b>.</p><ul><li>cyan + jaune = <b>vert</b> ; cyan + magenta = <b>bleu</b> ; magenta + jaune = <b>rouge</b> ;</li><li>cyan + magenta + jaune = <b>noir</b> (tout est absorbé).</li></ul><p>Un objet n\'a pas de couleur « propre » : un <b>pull rouge</b> diffuse le rouge et absorbe les autres couleurs. Éclairé en <b>lumière verte</b> pure, il n\'a rien à renvoyer : on le voit <b>noir</b>.</p><p><b>Piège :</b> mélanger des lumières (on ajoute) n\'est pas mélanger des peintures (on retranche) : jaune + bleu en peinture donne du vert, pas en lumière.</p></div>'
      }
    ]
  });

  function q_box_(x, y, w, h, col, fill, lab, ls) { ctx.fillStyle = fill; ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 6); ctx.fill(); ctx.stroke(); TB(lab, x, y + ls * .35, dk(col), ls); }

  SFA.figs("c10", [
    /* 1 Vergence */
    fig(function (p) {
      var g = q_r(p, 0, .6), cy = 120;
      [[115, true, 'f = 25 cm', '+4 δ'], [345, false, 'f = −50 cm', '−2 δ']].forEach(function (L) {
        var x = L[0]; axis(x - 100, x + 100, cy); lens(x, cy, 60, L[1]);
        [-30, 30].forEach(function (y) { if (L[1]) { ray(x - 100, cy + y, x, cy + y); ray(x, cy + y, x + 75 * 1.3, cy + y * (1 - 75 * 1.3 / 75 * 1)); } else { ray(x - 100, cy + y, x, cy + y); ray(x, cy + y, x + 90, cy + y * 2.8); ray(x, cy + y, x - 50, cy, RAY, 1.4, [4, 3]); } });
        TB(L[2], x, 215, INK, 15);
        if (g > 0) { ctx.globalAlpha = g; TB('C = ' + L[3], x, 250, L[1] ? DGREEN : DRED, 20); ctx.globalAlpha = 1; }
      });
      TB('convergente', 115, 30, BLUE_D, 14); TB('divergente', 345, 30, BLUE_D, 14);
      if (g <= 0) { TB('C ?', 115, 250, GREY, 18); TB('C ?', 345, 250, GREY, 18); }
    }),
    /* 2 Mélanger les couleurs */
    fig(function (p) {
      var g = q_r(p, 0, .6), r = 52, cx = 150, cy = 120;
      ctx.fillStyle = '#111'; ctx.fillRect(20, 30, 260, 220); ctx.globalCompositeOperation = 'lighter';
      [[cx - 38, cy - 20, '#ff0000'], [cx + 38, cy - 20, '#00ff00'], [cx, cy + 40, '#0000ff']].forEach(function (c) { ctx.fillStyle = c[2]; ctx.beginPath(); ctx.arc(c[0] + 10, c[1] + 25, r, 0, 7); ctx.fill(); });
      ctx.globalCompositeOperation = 'source-over';
      TB('R', 120, 112, '#fff', 14); TB('V', 208, 112, '#fff', 14); TB('B', 160, 200, '#fff', 14);
      if (g > 0) { ctx.globalAlpha = g; TB('R + V = jaune', 300, 78, ORANGE, 15, 'left'); TB('V + B = cyan', 300, 108, '#0a8a96', 15, 'left'); TB('R + V + B = blanc', 300, 138, INK, 15, 'left'); TB('peinture :', 300, 184, INK, 14, 'left'); TB('cyan + jaune', 300, 204, INK, 14, 'left'); TB('= vert', 300, 228, DGREEN, 18, 'left'); ctx.globalAlpha = 1; } else TB('?', 360, 140, GREY, 40);
    }),
    /* 3 Image par une lentille convergente */
    fig(function (p) {
      var g = q_r(p, 0, .7), sc = 6.5, cx = 230, cy = 140;
      var r = scene(cx, cy, sc, 10, 30, 40, { a: g });
      TB('p = 30 cm', cx - 97, cy + 62, ORA2, 13); TB('f = 10 cm', cx, 24, GREY, 13);
      if (g > .85) { ctx.globalAlpha = q_r(p, .7, 1); TB('q = 15 cm', cx + 97, cy - 46, DGREEN, 15); TB('image : 2 cm, réelle, renversée (γ = −0,5)', 230, 262, DGREEN, 14); ctx.globalAlpha = 1; } else TB('image ?', 230, 262, GREY, 15);
    }),
    /* 4 La loupe */
    fig(function (p) {
      var g = q_r(p, 0, .7), sc = 9, cx = 270, cy = 150;
      scene(cx, cy, sc, 5, 4, 14, { a: g });
      TB('timbre', cx - 36 - 6, cy + 24, ORA2, 13, 'center'); TB('f = 5 cm', cx + 50, 28, GREY, 13);
      if (g > .85) { ctx.globalAlpha = q_r(p, .7, 1); TB('q = −20 cm', cx - 180, cy + 30, DGREEN, 14); TB('virtuelle, droite, × 5', 230, 262, DGREEN, 15); ctx.globalAlpha = 1; } else TB('image ?', 230, 262, GREY, 15);
    }),
    /* 5 Cacher une partie de la lentille */
    fig(function (p) {
      var g = q_r(p, 0, .6), cx = 230, cy = 140, ox = cx - 130, ty = cy - 40, ix = cx + 130, iy = cy + 40;
      axis(30, 440, cy); lens(cx, cy, 78, true); arrowObj(ox, cy, 40, ORA2);
      ray(ox, ty, cx - 9, cy - 30, RAY, 1.6, [4, 4]); ray(ox, ty, cx - 9, cy - 60, RAY, 1.6, [4, 4]);
      ctx.fillStyle = '#555'; ctx.fillRect(cx - 9, cy - 82, 18, 82); TB('carton', cx, 34, INK, 13);
      ray(ox, ty, cx, cy + 30); ray(cx, cy + 30, ix, iy); ray(ox, ty, cx, cy + 56); ray(cx, cy + 56, ix, iy);
      arrowObj(ix, cy, -40, GREEN);
      if (g > 0) { ctx.globalAlpha = g; TB('image complète', ix - 6, cy - 24, DGREEN, 14, 'center'); TB('mais moins lumineuse', 230, 262, DRED, 15); ctx.globalAlpha = 1; } else TB('que voit-on sur l\'écran ?', 230, 262, GREY, 15);
    }),
    /* 6 Pull rouge sous lumière verte */
    fig(function (p) {
      var g = q_r(p, 0, .6);
      DOT(60, 60, 22, '#cdeccd'); ctx.strokeStyle = DGREEN; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(60, 60, 22, 0, 7); ctx.stroke(); TB('lumière verte', 60, 105, DGREEN, 13);
      ctx.fillStyle = 'rgba(29,158,117,.25)'; ctx.beginPath(); ctx.moveTo(82, 52); ctx.lineTo(250, 85); ctx.lineTo(250, 215); ctx.lineTo(82, 68); ctx.closePath(); ctx.fill();
      var col = g > 0 ? 'rgb(' + Math.round(210 * (1 - g) + 25 * g) + ',' + Math.round(40 * (1 - g) + 25 * g) + ',' + Math.round(40 * (1 - g) + 25 * g) + ')' : '#d22';
      ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(255, 90); ctx.lineTo(300, 80); ctx.quadraticCurveTo(325, 100, 350, 80); ctx.lineTo(395, 90); ctx.lineTo(425, 140); ctx.lineTo(395, 152); ctx.lineTo(375, 125); ctx.lineTo(375, 220); ctx.lineTo(275, 220); ctx.lineTo(275, 125); ctx.lineTo(255, 152); ctx.lineTo(225, 140); ctx.closePath(); ctx.fill(); ctx.stroke();
      TB('pull rouge', 325, 255, INK, 14);
      if (g > 0) { ctx.globalAlpha = g; q_box_(110, 215, 150, 42, DRED, '#fdeaea', 'il paraît noir', 16); ctx.globalAlpha = 1; } else TB('couleur ?', 110, 220, GREY, 18);
    }),
    /* 7 Lunettes d'un myope */
    fig(function (p) {
      var g = q_r(p, 0, .6), cy = 130, lx = 130;
      axis(20, 440, cy); lens(lx, cy, 60, false); DOT(lx - 100 * 0 + 0, cy, 0.1, GREY);
      [-25, 25].forEach(function (y) { ray(20, cy + y, lx, cy + y); ray(lx, cy + y, lx + 100, cy + y * 2); ray(lx, cy + y, lx - 100, cy, RAY, 1.4, [4, 3]); });
      DOT(lx - 100, cy, 4, RED); TB('image virtuelle', lx - 70, cy + 26, DRED, 13, 'left'); TB('50 cm', lx - 50, cy - 8, GREY, 12);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(330, cy, 56, 40, 0, 0, 7); ctx.fill(); ctx.stroke(); DOT(325, cy, 14, '#6ab0e0'); TB('œil', 330, cy + 62, INK, 13); TB('objet à l\'infini →', 70, 40, INK, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('f = −0,50 m  →  C = 1/f = −2,0 δ', 230, 242, DRED, 16); TB('lentille divergente', 230, 264, BLUE_D, 14); ctx.globalAlpha = 1; } else TB('C ?', 230, 250, GREY, 18);
    }),
    /* 8 Photographier une personne */
    fig(function (p) {
      var g = q_r(p, 0, .6), k = 1.15, x0 = 60, y0 = 40;
      ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.fillRect(x0, y0, 24 * 2 * 1.9, 36 * 2 * 1.9 * .0 + 140); ctx.strokeRect(x0, y0, 24 * 2 * 1.9, 140);
      TB('capteur 24 × 36 mm', x0 + 45, y0 + 160, BLUE_D, 13);
      var sy = 140 / 36, cxs = x0 + 45, cys = y0 + 70;
      /* image de la personne : hauteur 18 mm (5 m) */
      pers(cxs, cys + 9 * sy, 18 * sy, ORA2, 1, '', 'center'); TB('5,0 m : 18 mm', cxs, y0 - 10, DGREEN, 13);
      if (g > 0) { ctx.globalAlpha = g; var h2 = 46 * sy * 1.0; ctx.strokeStyle = DRED; ctx.lineWidth = 2.2; ctx.setLineDash([6, 4]); ctx.strokeRect(300 - 45, y0 + 70 - h2 / 2, 90, h2); ctx.setLineDash([]); pers(300, y0 + 70 + h2 / 2, h2, RED, 1, '', 'center'); TB('2,0 m : ≈ 46 mm', 300, 24, DRED, 13); TB('trop grand pour le capteur', 300, 266, DRED, 13); TB('q = 50,5 mm', 200, 150, DGREEN, 14); ctx.globalAlpha = 1; } else TB('2,0 m : ?', 300, 160, GREY, 17);
    }),
    /* 9 Projecteur de diapositives */
    fig(function (p) {
      var g = q_r(p, 0, .6), cy = 130, lx = 185;
      axis(20, 440, cy); lens(lx, cy, 60, true);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.fillRect(110, cy - 24, 20, 48); ctx.strokeRect(110, cy - 24, 20, 48);
      ctx.save(); ctx.translate(120, cy); ctx.scale(1, -1); TB('F', 0, 6, ORA2, 18); ctx.restore(); TB('diapositive', 120, cy + 46, INK, 12);
      ctx.fillStyle = '#f6f6f6'; ctx.fillRect(395, cy - 90, 14, 180); ctx.strokeRect(395, cy - 90, 14, 180); TB('écran', 402, cy + 110, INK, 13);
      ray(130, cy - 24, lx, cy - 24); ray(lx, cy - 24, 395, cy + 90); ray(130, cy - 24, 395, cy + 90, RAY, 1.4);
      TB('F', 402, cy + 6, GREEN, 40); TB('p ≈ 10,3 cm', 150, cy - 62, ORA2, 13); TB('q = 3,0 m', 300, cy - 18, GREY, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('γ = −29 ; image de 58 cm', 230, 232, DGREEN, 15); TB('diapositive à l\'envers dans le projecteur', 230, 256, DRED, 14); ctx.globalAlpha = 1; } else TB('p ? γ ?', 230, 245, GREY, 17);
    }),
    /* 10 Lunettes de −3 δ */
    fig(function (p) {
      var g = q_r(p, 0, .6), cy = 120, lx = 190;
      axis(20, 440, cy); lens(lx, cy, 60, false); DOT(lx - 110, cy, 4, RED);
      [-22, 22].forEach(function (y) { ray(20, cy + y, lx, cy + y); ray(lx, cy + y, lx + 110, cy + y * 2.0); ray(lx, cy + y, lx - 110, cy, RAY, 1.4, [4, 3]); });
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(395, cy, 40, 32, 0, 0, 7); ctx.fill(); ctx.stroke(); DOT(390, cy, 10, '#6ab0e0');
      TB('f = −33 cm', lx, 40, BLUE_D, 14); TB('image virtuelle à 33 cm', lx - 110, cy + 26, DRED, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('l\'œil non accommodé la voit nette', 230, 236, DGREEN, 15); TB('(objet à l\'infini → image à 33 cm)', 230, 258, GREY, 13); ctx.globalAlpha = 1; } else TB('quelle affirmation ?', 230, 250, GREY, 16);
    })
  ]);
})();
