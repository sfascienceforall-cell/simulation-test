/* Mathématiques BA1 · chapitre 12 : fondements (ensembles, preuves, nombres réels) · théorie animée et devantures (préfixe m12_) */
(function(){
var PI = Math.PI;
function m12_cl(u, a, b){ return Math.max(0, Math.min(1, (u - a) / (b - a))); }
function m12_es(u){ u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }
function m12_fx(v, d){ return v.toFixed(d).replace('.', ',').replace('-', '−'); }
function m12_hex(c){ c = c.replace('#', ''); return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; }
function m12_mix(c, f){ var a = m12_hex(c), k = f < 0 ? 0 : 255, t = Math.min(1, Math.abs(f)); return 'rgb(' + a.map(function(v){ return Math.round(v + (k - v) * t); }).join(',') + ')'; }
function m12_rgba(c, al){ var a = m12_hex(c); return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + al + ')'; }
function m12_bg(c1, c2){ var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2 || c1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function m12_rr(x, y, w, h, r){ ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function m12_card(x, y, w, h, fill, stroke, r){ ctx.save(); ctx.shadowColor = 'rgba(20,40,80,.16)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4; ctx.fillStyle = fill || '#fff'; m12_rr(x, y, w, h, r || 12); ctx.fill(); ctx.restore(); if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.8; m12_rr(x, y, w, h, r || 12); ctx.stroke(); } }
function m12_sph(x, y, r, col){ ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.22)'; ctx.shadowBlur = r * .9; ctx.shadowOffsetY = r * .35; var g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .08, x, y, r); g.addColorStop(0, '#fff'); g.addColorStop(.3, m12_mix(col, .2)); g.addColorStop(1, m12_mix(col, -.38)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.fill(); ctx.restore(); }
function m12_hole(x, y, r, col){ ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.stroke(); }
function m12_lab(s, x, y, col, sz, al){ ctx.save(); ctx.font = '600 ' + (sz || 13) + 'px system-ui'; ctx.textAlign = al || 'center'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.strokeText(s, x, y); ctx.fillStyle = col || INK; ctx.fillText(s, x, y); ctx.restore(); }
/* taille de police qui fait tenir s dans maxw (jamais sous 11 px) */
function m12_fit(s, maxw, sz){ ctx.font = '600 ' + sz + 'px system-ui'; while (sz > 11 && ctx.measureText(s).width > maxw){ sz -= 1; ctx.font = '600 ' + sz + 'px system-ui'; } return sz; }
function m12_say(s, x, y, col, sz, al, maxw){ TB(s, x, y, col, m12_fit(s, maxw || W - 16, sz), al); }
/* droite numérique, crochets, intervalles */
function m12_line(x0, x1, y, v0, v1){ var X = function(v){ return x0 + (v - v0) / (v1 - v0) * (x1 - x0); }; LN(x0, y, x1, y, '#8a95a3', 1.6); ctx.fillStyle = '#8a95a3'; ctx.beginPath(); ctx.moveTo(x1 + 8, y); ctx.lineTo(x1, y - 4.5); ctx.lineTo(x1, y + 4.5); ctx.closePath(); ctx.fill(); return X; }
function m12_tick(X, y, v, lab, col){ LN(X(v), y - 5, X(v), y + 5, '#8a95a3', 1.4); if (lab) TB(lab, X(v), y + 21, col || GREY, 13); }
function m12_brk(x, y, dir, col, h){ h = h || 11; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + dir * 6, y - h); ctx.lineTo(x, y - h); ctx.lineTo(x, y + h); ctx.lineTo(x + dir * 6, y + h); ctx.stroke(); }
function m12_iv(X, y, a, b, ca, cb, col){ ctx.save(); ctx.globalAlpha = .85; LN(X(a), y, X(b), y, col, 7); ctx.restore(); m12_brk(X(a), y, ca ? 1 : -1, col); m12_brk(X(b), y, cb ? -1 : 1, col); }
/* repère simple */
function m12_axes(x0, x1, y0, y1, L, R, T, B, sx, sy, fmt){
  var o = {L: L, R: W - R, T: T, B: H - B}; o.X = function(x){ return L + (x - x0) / (x1 - x0) * (o.R - L); }; o.Y = function(y){ return o.B - (y - y0) / (y1 - y0) * (o.B - T); };
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = '#e8ebf0'; ctx.font = '12px system-ui'; ctx.fillStyle = GREY; var g;
  for (g = Math.ceil(x0 / sx) * sx; g <= x1 + 1e-9; g += sx){ ctx.beginPath(); ctx.moveTo(o.X(g), T); ctx.lineTo(o.X(g), o.B); ctx.stroke(); }
  for (g = Math.ceil(y0 / sy) * sy; g <= y1 + 1e-9; g += sy){ ctx.beginPath(); ctx.moveTo(L, o.Y(g)); ctx.lineTo(o.R, o.Y(g)); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(fmt ? fmt(g) : m12_fx(g, 0), L - 5, o.Y(g) + 4); }
  ctx.restore(); var yy = (y0 <= 0 && y1 >= 0) ? o.Y(0) : o.B, xx = (x0 <= 0 && x1 >= 0) ? o.X(0) : L;
  LN(L, yy, o.R, yy, '#8a95a3', 1.4); LN(xx, T, xx, o.B, '#8a95a3', 1.4); return o; }
/* plafond en volume (plaque horizontale) */
function m12_slab(x0, x1, y, col, th){ th = th || 9; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.22)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4; var g = ctx.createLinearGradient(0, y - th - 6, 0, y); g.addColorStop(0, m12_mix(col, .45)); g.addColorStop(1, m12_mix(col, -.15)); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1 + 10, y - th); ctx.lineTo(x0 + 10, y - th); ctx.closePath(); ctx.fill(); ctx.restore(); LN(x0, y, x1, y, m12_mix(col, -.35), 2.6); }

/* ================= onglet 1 : ensembles, De Morgan ================= */
function m12_compl(ex, ey, ew, eh, cy, r, cs, col, al){ if (al <= 0.003) return; ctx.save(); m12_rr(ex, ey, ew, eh, 14); ctx.clip();
  cs.forEach(function(c){ ctx.beginPath(); ctx.rect(ex - 4, ey - 4, ew + 8, eh + 8); ctx.moveTo(c + r, cy); ctx.arc(c, cy, r, 0, 2 * PI); ctx.clip('evenodd'); });
  ctx.globalAlpha = al; ctx.fillStyle = col; ctx.fillRect(ex, ey, ew, eh); ctx.restore(); }
function m12_disk(x, y, r, col){ ctx.save(); var g = ctx.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(1, m12_rgba(col, .16)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.fill(); ctx.shadowColor = m12_rgba(col, .4); ctx.shadowBlur = 6; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
function m12_animSets(t){
  m12_bg('#f6f8fc', '#e9eef7');
  var wide = W >= 560, ex, ey, ew, eh;
  if (wide){ ex = 16; ey = 40; ew = Math.min(W * .56, (H - 54) * 1.9); eh = H - ey - 14; } else { ex = 10; ey = 36; ew = W - 20; eh = Math.max(120, H * .55); }
  var r = Math.min(ew * .23, eh * .40), cy = ey + eh * .53, ax = ex + ew * .5 - r * .6, bx = ex + ew * .5 + r * .6;
  var P = 230, ph = Math.floor(t / P) % 4, u = (t % P) / P, al = m12_es(u * 3);
  m12_card(ex, ey, ew, eh, '#fff', null, 14);
  if (ph === 0) m12_compl(ex, ey, ew, eh, cy, r, [ax, bx], VIOLET, .5 * al);
  if (ph === 1) m12_compl(ex, ey, ew, eh, cy, r, [ax], BLUE, .32 * al);
  if (ph === 2){ m12_compl(ex, ey, ew, eh, cy, r, [ax], BLUE, .32); m12_compl(ex, ey, ew, eh, cy, r, [bx], ORANGE, .32 * al); }
  if (ph === 3){ m12_compl(ex, ey, ew, eh, cy, r, [ax], BLUE, .32 * (1 - al)); m12_compl(ex, ey, ew, eh, cy, r, [bx], ORANGE, .32 * (1 - al)); m12_compl(ex, ey, ew, eh, cy, r, [ax, bx], VIOLET, .5 * al); }
  m12_disk(ax, cy, r, BLUE); m12_disk(bx, cy, r, ORANGE);
  TB('A', ax - r * .45, cy - r * .5, BLUE_D, 19); TB('B', bx + r * .45, cy - r * .5, ORANGE, 19); TB('E', ex + 14, ey + 24, GREY, 16, 'left');
  var px = ex + ew * (.5 + .43 * Math.sin(t / 83)), py = ey + eh * (.52 + .38 * Math.sin(t / 51 + 1.3));
  var inA = Math.hypot(px - ax, py - cy) < r, inB = Math.hypot(px - bx, py - cy) < r, out = !inA && !inB;
  m12_sph(px, py, 7.5, out ? VIOLET : INK); m12_lab('x', px + 11, py - 8, INK, 14, 'left');
  var caps = wide ? ['(A ∪ B)ᶜ : les points qui ne sont ni dans A, ni dans B', 'Aᶜ : tout ce qui est hors de A', 'Aᶜ (bleu) puis Bᶜ (orange) : la zone colorée deux fois est Aᶜ ∩ Bᶜ', 'C\'est la même zone : (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ'] : ['(A ∪ B)ᶜ : ni dans A, ni dans B', 'Aᶜ : hors de A', 'Aᶜ et Bᶜ : la zone colorée deux fois', 'Même zone : (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ'];
  var cc = [VIOLET, BLUE_D, ORANGE, DGREEN][ph];
  m12_say(caps[ph], wide ? 16 : W / 2, 25, cc, 15, wide ? 'left' : 'center', W - 24);
  var sA = 'x ∈ A : ' + (inA ? 'oui' : 'non'), sB = 'x ∈ B : ' + (inB ? 'oui' : 'non'), sC = 'x ∉ A et x ∉ B : ' + (out ? 'vrai' : 'faux'), sD = 'donc x ∈ (A ∪ B)ᶜ : ' + (out ? 'vrai' : 'faux');
  if (wide){
    var qx = ex + ew + 24, qw = W - qx - 14, y0 = ey + 6;
    m12_card(qx - 10, y0, qw + 6, H - y0 - 14, '#fff');
    TB('Lois de De Morgan', qx, y0 + 26, INK, m12_fit('Lois de De Morgan', qw - 10, 15), 'left');
    TB('(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ', qx, y0 + 52, VIOLET, m12_fit('(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ', qw - 10, 17), 'left');
    TB('(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ', qx, y0 + 76, GREY, m12_fit('(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ', qw - 10, 15), 'left');
    var ly = y0 + 108, st = Math.min(26, (H - ly - 30) / 4);
    [[sA, BLUE_D], [sB, ORANGE], [sC, out ? VIOLET : GREY], [sD, out ? VIOLET : GREY]].forEach(function(l, i){ TB(l[0], qx, ly + i * st, l[1], m12_fit(l[0], qw - 10, 14), 'left'); });
    TB('la preuve suit x, pas le dessin', qx, H - 26, GREY, m12_fit('la preuve suit x, pas le dessin', qw - 10, 12), 'left');
  } else {
    var by = ey + eh + 22, hw = (W - 20) / 2;
    TB(sA, 12, by, BLUE_D, m12_fit(sA, hw - 6, 14), 'left'); TB(sB, 12 + hw, by, ORANGE, m12_fit(sB, hw - 6, 14), 'left');
    var s2 = 'x ∉ A et x ∉ B ⟺ x ∈ (A ∪ B)ᶜ : ' + (out ? 'vrai' : 'faux');
    m12_say(s2, 12, by + 22, out ? VIOLET : GREY, 14, 'left', W - 24);
    if (by + 44 < H - 4) m12_say('De Morgan : (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ', 12, by + 44, INK, 14, 'left', W - 24);
  }
}

/* ================= onglet 2 : quantificateurs ================= */
var m12_R = [[0, 1, 0, 0, 1], [1, 0, 0, 1, 0], [0, 1, 1, 0, 0], [0, 0, 1, 0, 1], [1, 0, 0, 1, 0]];
var m12_stA = (function(){ var s = []; for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++){ s.push([r, c]); if (m12_R[r][c]) break; } return s; })();
var m12_stB = (function(){ var s = []; for (var c = 0; c < 5; c++) for (var r = 0; r < 5; r++){ s.push([r, c]); if (!m12_R[r][c]) break; } return s; })();
function m12_kid(x, y, s, col){ ctx.save(); var g = ctx.createLinearGradient(x - s, y, x + s, y + s); g.addColorStop(0, m12_mix(col, .35)); g.addColorStop(1, m12_mix(col, -.25)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y + s * .95, s * .62, s * .5, 0, PI, 2 * PI); ctx.fill(); ctx.restore(); m12_sph(x, y + s * .05, s * .38, '#e8b48a'); }
function m12_chair(x, y, s){ ctx.save(); ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = Math.max(2, s * .12); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s * .35, y - s * .55); ctx.lineTo(x - s * .35, y + s * .5); ctx.moveTo(x + s * .3, y + s * .05); ctx.lineTo(x + s * .3, y + s * .5); ctx.stroke(); var g = ctx.createLinearGradient(0, y - s * .1, 0, y + s * .1); g.addColorStop(0, '#d9a066'); g.addColorStop(1, '#9c6630'); ctx.fillStyle = g; ctx.fillRect(x - s * .42, y - s * .02, s * .82, s * .14); ctx.fillRect(x - s * .42, y - s * .6, s * .14, s * .62); ctx.restore(); }
function m12_animQuant(t){
  m12_bg('#f7f8fb', '#eceff6');
  var wide = W >= 560, SP = 22, dA = m12_stA.length * SP + 120, dB = m12_stB.length * SP + 170, f = t % (dA + dB), isA = f < dA, g = isA ? f : f - dA, st = isA ? m12_stA : m12_stB, k = Math.floor(g / SP), done = k >= st.length, kk = Math.min(k, st.length - 1);
  var cs, gx, gy;
  if (wide){ cs = Math.min((H - 64) / 5.9, W * .5 / 7.4); gx = 18 + cs * 1.2; gy = 30 + cs * 1.05; }
  else { cs = Math.min((W - 30) / 7.6, H * .64 / 6.1); gx = (W - cs * 7.4) / 2 + cs * 1.2; gy = 28 + cs * 1.05; }
  var r, c;
  /* bandeau de la ligne ou de la colonne examinée */
  var cur = st[kk];
  ctx.fillStyle = 'rgba(186,117,23,.12)';
  if (isA) ctx.fillRect(gx - cs * 1.15, gy + cur[0] * cs, cs * 6.2, cs); else ctx.fillRect(gx + cur[1] * cs, gy - cs * 1.0, cs, cs * 6.15);
  for (r = 0; r < 5; r++){ m12_kid(gx - cs * .42, gy + r * cs + cs * .2, cs * .36, [BLUE, VIOLET, GREEN, ORA2, BLUE_D][r]); TB('x' + '₁₂₃₄₅'[r], gx - cs * 1.15, gy + r * cs + cs * .62, GREY, Math.max(11, cs * .3), 'left'); }
  for (c = 0; c < 5; c++){ m12_chair(gx + c * cs + cs * .5, gy - cs * .64, cs * .5); TB('y' + '₁₂₃₄₅'[c], gx + c * cs + cs * .5, gy - cs * .06, GREY, Math.max(11, cs * .28)); }
  for (r = 0; r < 5; r++) for (c = 0; c < 5; c++){
    var x = gx + c * cs + 3, y = gy + r * cs + 3, w = cs - 6, on = m12_R[r][c];
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.16)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2; var gr = ctx.createLinearGradient(x, y, x, y + w); gr.addColorStop(0, on ? '#5cc79f' : '#f4f5f8'); gr.addColorStop(1, on ? '#13805f' : '#dfe3ea'); ctx.fillStyle = gr; m12_rr(x, y, w, w, 6); ctx.fill(); ctx.restore();
    if (on) TB('✓', x + w / 2, y + w * .68, '#fff', w * .5);
  }
  /* curseur */
  var cx0 = gx + cur[1] * cs + 1, cy0 = gy + cur[0] * cs + 1; ctx.save(); ctx.shadowColor = 'rgba(186,117,23,.7)'; ctx.shadowBlur = 10; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3.4; m12_rr(cx0, cy0, cs - 2, cs - 2, 7); ctx.stroke(); ctx.restore();
  /* marques */
  var i, fz = Math.max(12, cs * .32);
  for (i = 0; i < Math.min(k + 1, st.length); i++){ var s = st[i]; if (i === k && !done) continue;
    if (isA && m12_R[s[0]][s[1]]) TB('✓ y' + '₁₂₃₄₅'[s[1]], gx + 5 * cs + 8, gy + s[0] * cs + cs * .63, DGREEN, fz, 'left');
    if (!isA && !m12_R[s[0]][s[1]]) TB('✗ x' + '₁₂₃₄₅'[s[0]], gx + s[1] * cs + cs * .5, gy + 5 * cs + fz + 4, DRED, fz); }
  /* texte */
  var head = isA ? '∀x ∃y R(x ; y)' : '∃y ∀x R(x ; y)', sub = isA ? 'chaque élève cherche SA chaise' : 'une même chaise pour tous les élèves';
  var res = isA ? 'VRAI : le y peut changer avec le x' : 'FAUX : chaque chaise est refusée par quelqu\'un', rc = isA ? DGREEN : DRED;
  if (wide){
    var qx = gx + 5 * cs + cs * 1.55, qw = W - qx - 12;
    TB('R(x ; y) : l\'élève x accepte la chaise y', qx, 32, GREY, m12_fit('R(x ; y) : l\'élève x accepte la chaise y', qw, 13), 'left');
    TB(head, qx, 72, isA ? BLUE_D : VIOLET, m12_fit(head, qw, 26), 'left'); TB(sub, qx, 100, INK, m12_fit(sub, qw, 15), 'left');
    if (done){ ctx.globalAlpha = m12_cl(g - st.length * SP, 0, 25); TB(res, qx, 136, rc, m12_fit(res, qw, 16), 'left');
      if (!isA){ TB('Négation : ∀y ∃x non R(x ; y)', qx, 166, INK, m12_fit('Négation : ∀y ∃x non R(x ; y)', qw, 15), 'left'); }
      else TB('ex. : x₁ → y₂, x₂ → y₁, x₄ → y₃', qx, 166, GREY, m12_fit('ex. : x₁ → y₂, x₂ → y₁, x₄ → y₃', qw, 14), 'left'); ctx.globalAlpha = 1; }
    TB('(∃y ∀x R) ⇒ (∀x ∃y R), pas l\'inverse en général', qx, H - 18, GREY, m12_fit('(∃y ∀x R) ⇒ (∀x ∃y R), pas l\'inverse en général', qw, 13), 'left');
  } else {
    var ty = gy + 5 * cs + fz + 26;
    m12_say(head + ' : ' + sub, W / 2, ty, isA ? BLUE_D : VIOLET, 15, 'center', W - 20);
    if (done){ ctx.globalAlpha = m12_cl(g - st.length * SP, 0, 25); m12_say(res, W / 2, ty + 22, rc, 15, 'center', W - 20); if (!isA && ty + 44 < H - 2) m12_say('Négation : ∀y ∃x non R(x ; y)', W / 2, ty + 44, INK, 14, 'center', W - 20); ctx.globalAlpha = 1; }
  }
}

/* ================= onglet 3 : récurrence, dominos en 3D ================= */
var m12_DOM = {N: 10, d: .62, e: .16, h: 1, w: .5};
function m12_dot3(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function m12_hull(P){ P = P.slice().sort(function(a, b){ return a.x - b.x || a.y - b.y; }); var cr = function(o, a, b){ return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }, lo = [], up = [], i;
  for (i = 0; i < P.length; i++){ while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], P[i]) <= 0) lo.pop(); lo.push(P[i]); }
  for (i = P.length - 1; i >= 0; i--){ while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], P[i]) <= 0) up.pop(); up.push(P[i]); }
  up.pop(); lo.pop(); return lo.concat(up); }
function m12_poly(pts, fill, stroke, lw){ ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
function m12_domXs(sc){ var D = m12_DOM, xs = [], x = 0; for (var i = 0; i < D.N; i++){ xs.push(x); x += (sc === 2 && i === 5) ? D.h + .38 : D.d; } return xs; }
/* angles de chute : chaque domino part quand le précédent le touche (angle de contact asin((d − e)/h) ≈ 27°) */
function m12_domAngles(sc, f){
  var D = m12_DOM, N = D.N, th = [], i, thc = Math.asin((D.d - D.e) / D.h), Tf = 26, t0 = 40, s = t0;
  for (i = 0; i < N; i++) th.push(0);
  if (sc === 1) return th;
  for (i = 0; i < N; i++){
    var flat = (i === N - 1) || (sc === 2 && i === 5), thf = flat ? PI / 2 : 1.25, T = Tf * Math.sqrt(thf / 1.25), tau = f - s;
    th[i] = tau <= 0 ? 0 : (tau >= T ? thf : thf * (tau / T) * (tau / T));
    if (sc === 2 && i === 5) break;
    s += T * Math.sqrt(thc / thf);
  }
  return th;
}
function m12_animDom(t){
  m12_bg('#f3f1ec', '#e4ded2');
  var D = m12_DOM, CYC = 380, sc = Math.floor(t / CYC) % 3, f = t % CYC, xs = m12_domXs(sc), th = m12_domAngles(sc, f), N = D.N;
  var x0 = -1.0, x1 = xs[N - 1] + D.e + D.h + .3, yw = .62, pz = -.14;
  /* cadrage : boîte englobante de la scène fixe */
  var probe = [[x0, -yw, pz], [x1, -yw, pz], [x0, yw, pz], [x1, yw, pz], [x0, -yw, 1.35], [x1, yw, 1.35], [x0, yw, 1.35], [x1, -yw, 1.35]], bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
  probe.forEach(function(q){ var P = P3(q[0], q[1], q[2], 0, 0, 1); bx0 = Math.min(bx0, P.x); bx1 = Math.max(bx1, P.x); by0 = Math.min(by0, P.y); by1 = Math.max(by1, P.y); });
  var top = 40, bot = W < 560 ? 52 : 40, s = Math.min((W - 24) / (bx1 - bx0), (H - top - bot) / (by1 - by0)), cx = W / 2 - s * (bx0 + bx1) / 2, cy = top + (H - top - bot) / 2 - s * (by0 + by1) / 2;
  function pj(x, y, z){ return P3(x, y, z, cx, cy, s); }
  var ca = Math.cos(ORB.a), sa = Math.sin(ORB.a), cb = Math.cos(ORB.b), sb = Math.sin(ORB.b), Dv = [-sa * cb, -ca * cb, sb], Lt = [-.35, -.55, .76];
  /* planche en bois */
  var pc = [[x0, -yw, 0], [x1, -yw, 0], [x1, yw, 0], [x0, yw, 0]];
  [[[x0, -yw, 0], [x1, -yw, 0], [x1, -yw, pz], [x0, -yw, pz], [0, -1, 0]], [[x1, -yw, 0], [x1, yw, 0], [x1, yw, pz], [x1, -yw, pz], [1, 0, 0]], [[x0, yw, 0], [x1, yw, 0], [x1, yw, pz], [x0, yw, pz], [0, 1, 0]], [[x0, -yw, 0], [x0, yw, 0], [x0, yw, pz], [x0, -yw, pz], [-1, 0, 0]]].forEach(function(F){ if (m12_dot3(F[4], Dv) > 0) m12_poly(F.slice(0, 4).map(function(q){ return pj(q[0], q[1], q[2]); }), '#8b5e34', '#6d4626', 1); });
  var p0 = pj(x0, -yw, 0), p1 = pj(x1, yw, 0), gw = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y); gw.addColorStop(0, '#d8b07c'); gw.addColorStop(1, '#b9875a');
  m12_poly(pc.map(function(q){ return pj(q[0], q[1], q[2]); }), gw, '#8b5e34', 1.2);
  ctx.save(); ctx.globalAlpha = .18; ctx.strokeStyle = '#7a5530'; ctx.lineWidth = 1; for (var lg = -yw + .2; lg < yw; lg += .3){ var a1 = pj(x0, lg, 0), a2 = pj(x1, lg, 0); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke(); } ctx.restore();
  /* sommets d'un domino */
  function corners(i){ var px = xs[i] + D.e, c = Math.cos(th[i]), si = Math.sin(th[i]), out = [];
    for (var ix = 0; ix < 2; ix++) for (var iy = 0; iy < 2; iy++) for (var iz = 0; iz < 2; iz++){ var lx = ix ? 0 : -D.e, lz = iz ? D.h : 0; out.push([px + lx * c + lz * si, iy ? D.w / 2 : -D.w / 2, -lx * si + lz * c]); }
    return out; }
  var CI = function(ix, iy, iz){ return ix * 4 + iy * 2 + iz; };
  /* ombres portées */
  ctx.fillStyle = 'rgba(60,35,10,.2)';
  for (var i = 0; i < N; i++){ var sh = corners(i).map(function(q){ return pj(q[0] + q[2] * .42, q[1] + q[2] * .32, 0); }); m12_poly(m12_hull(sh), 'rgba(60,35,10,.2)'); }
  /* ordre de dessin : du plus loin au plus proche */
  var ord = []; for (i = 0; i < N; i++) ord.push(i); ord.sort(function(a, b){ return m12_dot3([xs[a], 0, .5], Dv) - m12_dot3([xs[b], 0, .5], Dv); });
  var thc = Math.asin((D.d - D.e) / D.h), fallen = 0; for (i = 0; i < N; i++) if (th[i] > thc * .98) fallen++;
  ord.forEach(function(i){
    var C = corners(i), c = Math.cos(th[i]), si = Math.sin(th[i]), down = th[i] > thc * .98, base = down ? '#bfe8d3' : '#fbf7ee';
    var faces = [[[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1], [-c, 0, si], 'x'], [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1], [c, 0, -si], 'x'], [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1], [si, 0, c], 'z'], [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [-si, 0, -c], 'z'], [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0, -1, 0], 'y'], [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1], [0, 1, 0], 'y']];
    faces.forEach(function(F){ var n = F[4]; if (m12_dot3(n, Dv) <= 0) return; var lum = m12_dot3(n, Lt), col = m12_mix(base, lum > 0 ? lum * .25 : lum * .45);
      var pts = F.slice(0, 4).map(function(b){ var q = C[CI(b[0], b[1], b[2])]; return pj(q[0], q[1], q[2]); }); m12_poly(pts, col, '#5b5348', 1.1);
      if (F[5] === 'x'){ /* trait central et deux points noirs : un vrai domino */ var ix = F[0][0], q0 = C[CI(ix, 0, 0)], q1 = C[CI(ix, 1, 0)], q2 = C[CI(ix, 1, 1)], q3 = C[CI(ix, 0, 1)];
        var mid = function(a, b, u){ return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }, m0 = mid(q0, q3, .5), m1 = mid(q1, q2, .5), A0 = pj(m0[0], m0[1], m0[2]), A1 = pj(m1[0], m1[1], m1[2]);
        LN(A0.x, A0.y, A1.x, A1.y, '#3b352d', 1.4);
        [.25, .75].forEach(function(v){ var l = mid(q0, q3, v), rr = mid(q1, q2, v), cpt = mid(l, rr, .5), P = pj(cpt[0], cpt[1], cpt[2]); DOT(P.x, P.y, Math.max(1.6, s * .035), '#2e2a25'); }); }
    });
    var lp = pj(xs[i] + D.e / 2, 0, D.h + .22); m12_lab(String(i + 1), lp.x, lp.y, down ? DGREEN : GREY, 13);
  });
  /* poussée initiale */
  if (sc !== 1 && f < 60){ var u = m12_es(f / 40), hx = -.95 + .78 * u, h0 = pj(hx - .45, 0, .78), h1 = pj(hx, 0, .78); A(h0.x, h0.y, h1.x - h0.x, h1.y - h0.y, ORA2, null, 4); m12_lab('on pousse : P(1)', h0.x, h0.y - 12, ORA2, 13, 'left'); }
  if (sc === 1){ var q = pj(xs[0] + D.e / 2, 0, 1.38); LN(q.x, 58, q.x, q.y - 4, RED, 1.4, [4, 3]); m12_lab('✗ personne ne pousse le domino 1', Math.max(14, q.x - 20), 50, DRED, 14, 'left'); }
  if (sc === 2 && f > 160){ var g1 = pj(xs[5] + D.e + .62, 0, 0); LN(g1.x, 58, g1.x, g1.y, RED, 1.4, [4, 3]); m12_lab('trou : P(6) ⇏ P(7)', Math.min(W - 80, Math.max(80, g1.x)), 50, DRED, 14); }
  var caps = ['Initialisation + hérédité : toute la rangée tombe', 'Sans initialisation : rien ne tombe, rien n\'est prouvé', 'Hérédité cassée après le rang 6 : la chute s\'arrête'];
  m12_say(caps[sc], 14, 24, [DGREEN, DRED, ORA2][sc], 16, 'left', W - 28);
  var lw = W - 28, msg = 'P(1) vraie  et  ∀n ≥ 1 : P(n) ⇒ P(n + 1)   ⟹   P(n) vraie pour tout n ≥ 1';
  if (W < 560){ m12_say('P(1) et (P(n) ⇒ P(n + 1)) ⟹ ∀n, P(n)', 14, H - 30, INK, 14, 'left', lw); m12_say('tombés : ' + fallen + ' / ' + N + '   ·   glisse pour tourner', 14, H - 11, GREY, 12, 'left', lw); }
  else { m12_say(msg, 14, H - 14, INK, 14, 'left', lw - 150); TB('tombés : ' + fallen + ' / ' + N, W - 14, H - 32, fallen === N ? DGREEN : GREY, 14, 'right'); TB('glisse pour tourner la vue', W - 14, H - 14, GREY, 12, 'right'); }
}

/* ================= onglet 4 : bornes, le plafond qui descend ================= */
function m12_animSup(t){
  m12_bg('#f6f8fc', '#e8eef8');
  var wide = W >= 560, gw = wide ? W * .6 : W, gh = wide ? H : H * .64;
  var a = (function(){ var L = 46, R = W - gw + 18, T = 34, B = H - gh + 26; return m12_axes(0, 31, .8, 2.6, L, R, T, B, 5, .5, function(v){ return m12_fx(v, 1); }); })();
  TB('n', a.R - 4, a.B - 6, GREY, 13, 'right');
  var f = t % 700, M, eps = 0, ph;
  if (f < 170){ ph = 0; M = 2.45 - .45 * m12_es(f / 150); }
  else if (f < 250){ ph = 1; M = Math.round(200 - 10 * m12_es((f - 170) / 60)) / 100; }
  else if (f < 300){ ph = 2; M = 1.9 + .1 * m12_es((f - 250) / 40); }
  else { ph = 3; M = 2; eps = [.5, .2, .1, .05][Math.min(3, Math.floor((f - 300) / 100))]; }
  var kM = Math.round((2 - M) * 100), maj = M >= 2 - 1e-9, nCut = maj ? 0 : Math.floor(100 / kM + 1e-9) + 1, nE = eps ? Math.floor(1 / eps + 1e-9) + 1 : 0;
  /* demi-droite des majorants sur l'axe */
  if (ph >= 2 || (ph === 0 && f > 150)){ ctx.save(); ctx.globalAlpha = .85; LN(a.L, a.Y(2), a.L, a.T, GREEN, 6); ctx.restore(); }
  /* bande ε */
  if (eps){ var ea = m12_cl((f - 300) % 100, 0, 18); ctx.fillStyle = 'rgba(186,117,23,' + (.2 * ea) + ')'; ctx.fillRect(a.L, a.Y(2), a.R - a.L, a.Y(2 - eps) - a.Y(2)); LN(a.L, a.Y(2 - eps), a.R, a.Y(2 - eps), ORANGE, 1.4, [5, 4]); m12_lab('2 − ε', a.R - 4, a.Y(2 - eps) + 15, ORANGE, 13, 'right'); }
  LN(a.L, a.Y(2), a.R, a.Y(2), '#aab2bd', 1, [3, 4]);
  for (var n = 1; n <= 30; n++){ var v = 2 - 1 / n, x = a.X(n), y = a.Y(v), above = v > M + 1e-12, hit = eps && n === nE;
    LN(x, a.B, x, y, above ? 'rgba(226,75,74,.35)' : 'rgba(24,95,165,.16)', 1.2);
    m12_sph(x, y, hit ? 7 : 5, above ? RED : (eps && v > 2 - eps ? ORANGE : BLUE)); if (hit){ ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, 11, 0, 2 * PI); ctx.stroke(); } }
  m12_slab(a.L, a.R, a.Y(M), maj ? GREEN : RED, 9);
  m12_lab('plafond M = ' + m12_fx(M, 2), a.L + 8, a.Y(M) - 14, maj ? DGREEN : DRED, 14, 'left');
  /* textes */
  var L1 = 'A = {2 − 1/n : n ≥ 1}', L2, L3, c2 = INK;
  if (ph === 0){ L2 = 'Aucun point au-dessus : M majore A'; c2 = DGREEN; L3 = 'on descend le plafond…'; }
  else if (ph === 1){ L2 = maj ? 'Le plafond se bloque à 2' : 'M < 2 : percé dès n = ' + nCut; c2 = maj ? DGREEN : DRED; L3 = maj ? 'plus bas, un point dépasse' : '2 − 1/' + nCut + ' ≈ ' + m12_fx(2 - 1 / nCut, 4) + ' > ' + m12_fx(M, 2); }
  else if (ph === 2){ L2 = 'Plus petit majorant : sup A = 2'; c2 = DGREEN; L3 = 'majorants : [2 ; +∞['; }
  else { L2 = 'ε = ' + m12_fx(eps, 2).replace(/0$/, '') + ' : n = ' + nE + ' convient'; c2 = ORANGE; L3 = '2 − 1/' + nE + ' ≈ ' + m12_fx(2 - 1 / nE, 3) + ' > ' + m12_fx(2 - eps, 2).replace(/0$/, ''); }
  var L4 = 'sup A = 2 ∉ A : pas de maximum', L5 = 'min A = 1 (n = 1)';
  if (wide){ var qx = gw + 14, qw = W - qx - 14;
    m12_card(qx - 10, 30, qw + 10, H - 44, '#fff');
    [[L1, BLUE_D, 16], [L2, c2, 15], [L3, GREY, 14], [L4, INK, 14], [L5, GREY, 14]].forEach(function(l, i){ TB(l[0], qx, 60 + i * Math.min(34, (H - 90) / 5), l[1], m12_fit(l[0], qw - 8, l[2]), 'left'); });
    m12_say('s = sup A ⟺ s majore A et ∀ε > 0 ∃x ∈ A : x > s − ε', 14, 20, INK, 13, 'left', gw - 20);
  } else {
    var ty = gh + 16; m12_say(L1 + '  ·  sup A = 2 ∉ A', W / 2, ty, BLUE_D, 14, 'center', W - 16); m12_say(L2, W / 2, ty + 21, c2, 14, 'center', W - 16); if (ty + 42 < H) m12_say(L3, W / 2, ty + 42, GREY, 13, 'center', W - 16);
    m12_say('s = sup A ⟺ s majore A et ∀ε > 0 ∃x ∈ A : x > s − ε', 10, 18, INK, 13, 'left', W - 20);
  }
}

var m12_SIM = function(id, txt){ return '<p class="m12-sim" style="margin:.5em 0 0;font-size:.95em">▶ Simulation : <a href="' + id + '/">' + txt + '</a></p>'; };

SFA.theo("c12", {
  icon: function(){
    m12_bg('#f4f7fd', '#e4ecf8');
    TB('∀ε ∃x', W * .27, H * .36, BLUE_D, 40); TB('sup A', W * .73, H * .36, ORANGE, 40);
    TB('P(n) ⇒ P(n + 1)', W * .27, H * .55, DGREEN, 18); TB('ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ', W * .73, H * .55, VIOLET, 18);
    var y = H * .8, X = m12_line(W * .08, W * .9, y, .8, 2.3);
    for (var n = 1; n <= 40; n++) m12_sph(X(2 - 1 / n), y, n < 6 ? 5.5 : 4, BLUE);
    ctx.save(); ctx.shadowColor = 'rgba(15,110,86,.35)'; ctx.shadowBlur = 6; LN(X(2), y - 30, X(2), y + 14, GREEN, 5); ctx.restore(); m12_hole(X(2), y, 5.5, DGREEN); TB('2', X(2), y + 30, DGREEN, 15); TB('plafond', X(2) + 8, y - 18, DGREEN, 13, 'left');
  },
  sub: [
    {t: "Ensembles, opérations, relations",
     anim: m12_animSets,
     th: "<div class='tcard'><b class='h'>Appartenir, être inclus, être égal</b><p><b>x ∈ A</b> relie un élément à un ensemble ; <b>B ⊂ A</b> relie deux ensembles : tout élément de B est dans A. On prouve <b>A = B</b> par double inclusion (A ⊂ B et B ⊂ A). Attention aux accolades : {1} ⊂ {1, 2} est vrai, {1} ∈ {1, 2} est faux.</p><p>On décrit un ensemble <b>en extension</b> (la liste : {2, 4, 6}) ou <b>en compréhension</b> (un domaine et une condition : {n ∈ ℕ : n pair et 1 ≤ n ≤ 6}) ; l'ordre et les répétitions ne comptent pas. L'ensemble vide ∅ est inclus dans tout ensemble. Les parties de E forment l'ensemble 𝒫(E) : si E a n éléments, il a <b>2ⁿ parties</b> (chaque élément est pris ou laissé) ; {1, 2, 3} en a 8.</p></div>" +
         "<div class='tcard'><b class='h'>Opérations, De Morgan, dénombrement</b><p>A ∪ B : dans A <b>ou</b> dans B (ou inclusif) ; A ∩ B : dans les deux ; A \\ B : dans A mais pas dans B ; Aᶜ = E \\ A. <b>Lois de De Morgan</b> : (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ et (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ. On les prouve avec un x quelconque : x ∉ A ∪ B ⟺ non(x ∈ A ou x ∈ B) ⟺ (x ∉ A et x ∉ B). Le dessin illustre, il ne prouve pas.</p><p><b>Inclusion-exclusion</b> : |A ∪ B| = |A| + |B| − |A ∩ B| (avec |A| = 12, |B| = 9 et |A ∩ B| = 4 : 12 + 9 − 4 = 17). <b>Produit cartésien</b> A × B = {(a ; b) : a ∈ A, b ∈ B}, couples <b>ordonnés</b>, |A × B| = |A|·|B|.</p><p>Nombres : <b>ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</b> ; chaque extension répare une opération (soustraction, division, puis les « trous » comme √2). Intervalle : crochet tourné vers l'intérieur = borne incluse, [0 ; 1[ contient 0 mais pas 1 ; ±∞ n'est jamais inclus.</p></div>" +
         "<div class='tcard'><b class='h'>Relations : ordre et équivalence</b><p>Une relation binaire sur A est une partie de A × A. Elle peut être <b>réflexive</b> (x R x), <b>symétrique</b> (x R y ⇒ y R x), <b>antisymétrique</b> (x R y et y R x ⇒ x = y), <b>transitive</b> (x R y et y R z ⇒ x R z).</p><p><b>Ordre</b> = réflexive + antisymétrique + transitive. Il est <b>total</b> si deux éléments sont toujours comparables (≤ sur ℝ), <b>partiel</b> sinon : pour la divisibilité, 4 et 6 sont incomparables ; pour la dominance de paniers (x₁ ≤ x₂ et y₁ ≤ y₂), (3 ; 1) et (1 ; 3) aussi.</p><p><b>Équivalence</b> = réflexive + symétrique + transitive. Ses classes sont disjointes et recouvrent A : elles forment une <b>partition</b>. Exemple : « même reste dans la division par 3 » découpe ℤ en 3 classes (restes 0, 1, 2).</p></div>"},
    {t: "Logique et quantificateurs",
     anim: m12_animQuant,
     th: "<div class='tcard'><b class='h'>Propositions et implication</b><p>Une proposition est vraie ou fausse. « P ou Q » est vraie dès qu'une des deux l'est (ou <b>inclusif</b>). <b>P ⇒ Q</b> n'est fausse que si P est vraie et Q fausse : une hypothèse fausse rend l'implication vraie.</p><p><b>Contraposée</b> : (non Q) ⇒ (non P), elle dit exactement la même chose que P ⇒ Q. <b>Réciproque</b> : Q ⇒ P, c'est un autre énoncé, qui peut être faux. Dans P ⇒ Q, P est une <b>condition suffisante</b> de Q et Q une <b>condition nécessaire</b> de P : être multiple de 4 suffit pour être pair, être pair est nécessaire pour être multiple de 4. P ⟺ Q : les deux sens à la fois (« si et seulement si »).</p></div>" +
         "<div class='tcard'><b class='h'>L'ordre de ∀ et ∃ change tout</b><p><b>∀x ∃y : y > x</b> est vrai : à chaque x on associe son y (y = x + 1), le y <b>dépend</b> du x. <b>∃y ∀x : y > x</b> est faux : un même y devrait dépasser tous les réels, et x = y suffit à le contredire.</p><p>On a toujours (∃y ∀x R) ⇒ (∀x ∃y R), jamais la réciproque en général. C'est pour cela que, dans une définition de limite « ∀ε > 0 ∃δ > 0 … », le δ a le droit de dépendre de ε.</p>" + m12_SIM('ma-quantificateurs-ordre', '∀∃ ou ∃∀ : l\'ordre qui change tout') + "</div>" +
         "<div class='tcard'><b class='h'>Nier un énoncé</b><p>Règles : non(∀x, P(x)) ⟺ ∃x, non P(x) ; non(∃x, P(x)) ⟺ ∀x, non P(x) ; non(P et Q) ⟺ (non P) ou (non Q) ; non(P ou Q) ⟺ (non P) et (non Q) ; <b>non(P ⇒ Q) ⟺ P et non Q</b> (la négation d'une implication n'est pas une implication).</p><p>Recette : tu gardes l'ordre des variables et leurs domaines (ε > 0 reste ε > 0), tu changes chaque ∀ en ∃ et chaque ∃ en ∀, puis tu nies la dernière propriété. « uₙ → ℓ » s'écrit ∀ε > 0 ∃N ∀n ≥ N : |uₙ − ℓ| < ε ; sa négation est <b>∃ε > 0 ∀N ∃n ≥ N : |uₙ − ℓ| ≥ ε</b>.</p><p><b>Piège</b> : la négation de « tous » est « au moins un ne… pas », pas « aucun ». Un seul contre-exemple réfute un énoncé « pour tout » ; trois exemples qui marchent ne prouvent rien.</p></div>"},
    {t: "Démontrer : directe, contraposée, absurde, récurrence",
     anim: m12_animDom,
     th: "<div class='tcard'><b class='h'>Les quatre modes de preuve</b><p><b>Directe</b> : on part de l'hypothèse et on enchaîne. n impair ⇒ n = 2k + 1 ⇒ n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1 : n² est impair.</p><p><b>Contraposée</b> : pour « n² pair ⇒ n pair », on prouve « n impair ⇒ n² impair », c'est fait juste au-dessus. Utile quand la négation de la thèse se traduit mieux.</p><p><b>Absurde</b> : on suppose le contraire et on aboutit à une contradiction. √2 = p/q irréductible ⇒ p² = 2q² ⇒ p pair, p = 2r ⇒ q² = 2r² ⇒ q pair : p et q sont pairs, la fraction n'était pas irréductible. Donc √2 ∉ ℚ. Mode naturel pour une impossibilité ou une unicité.</p><p><b>Récurrence</b> : pour un énoncé P(n) indexé par un entier. <b>Contre-exemple</b> : « n² − n + 11 est premier pour tout n ≥ 1 » marche de n = 1 à 10, et tombe à n = 11 : 121 = 11².</p></div>" +
         "<div class='tcard'><b class='h'>La récurrence : deux gestes, pas un</b><p>(1) <b>Initialisation</b> : on vérifie P(n₀) par le calcul. (2) <b>Hérédité</b> : on prend un n ≥ n₀ quelconque, on suppose P(n) (hypothèse de récurrence) et on démontre P(n + 1). Conclusion : P(n) est vraie pour tout n ≥ n₀, comme une rangée de dominos dont on pousse le premier et où chacun fait tomber le suivant.</p><p><i>Exemple</i> : 1 + 2 + … + n = n(n + 1)/2. Rang 1 : 1 = 1·2/2. Hérédité : n(n + 1)/2 + (n + 1) = (n + 1)(n/2 + 1) = (n + 1)(n + 2)/2, c'est la formule au rang n + 1. Pour n = 100 : 5 050.</p><p><b>Piège</b> : une formule peut avoir une hérédité juste et être fausse pour tout n ; sans initialisation, rien n'est prouvé.</p>" + m12_SIM('ma-recurrence-dominos', 'La récurrence : une rangée de dominos') + "</div>" +
         "<div class='tcard'><b class='h'>Rédiger une démonstration</b><p>1. Écris séparément l'hypothèse et la thèse. 2. Choisis le mode (un entier n : récurrence ; une impossibilité : absurde ; une thèse négative : contraposée). 3. Traduis chaque hypothèse en égalité utilisable : « n est pair » devient n = 2k avec k ∈ ℤ. 4. Justifie chaque ligne (définition, théorème, calcul). 5. Conclus en recopiant la thèse.</p><p><b>Erreurs qui coûtent des points</b> : partir de ce qu'on veut démontrer ; confondre réciproque et contraposée ; prendre des exemples ou un dessin pour une preuve ; oublier l'initialisation.</p></div>"},
    {t: "Bornes et borne supérieure",
     anim: m12_animSup,
     th: "<div class='tcard'><b class='h'>Majorant, maximum</b><p>M est un <b>majorant</b> de A ⊂ ℝ si x ≤ M pour tout x ∈ A ; m est un minorant si m ≤ x pour tout x ∈ A. Les majorants forment une demi-droite : dès que M majore, tout réel plus grand aussi. A est <b>bornée</b> si elle est majorée et minorée, c'est-à-dire s'il existe M ≥ 0 tel que |x| ≤ M pour tout x ∈ A. « Non bornée » signifie non majorée <b>ou</b> non minorée.</p><p>Le <b>maximum</b> est un majorant qui <b>appartient</b> à A. S'il existe, il est unique (si a et b sont deux maximums, b ≤ a et a ≤ b, donc a = b). Un ensemble fini non vide a toujours un maximum et un minimum ; [0 ; 1[ est borné et n'a pas de maximum.</p></div>" +
         "<div class='tcard'><b class='h'>Borne supérieure et caractérisation par ε</b><p><b>sup A</b> est le plus petit des majorants de A (inf A : le plus grand des minorants). <b>Caractérisation</b> : s = sup A ⟺ (1) x ≤ s pour tout x ∈ A, et (2) pour tout ε > 0, il existe x ∈ A avec x > s − ε. Si sup A ∈ A, c'est le maximum ; si le maximum existe, sup A = max A.</p><p><i>Exemple chiffré</i> : A = {2 − 1/n : n ≥ 1}. Tout élément est < 2. Pour ε > 0, il suffit de n > 1/ε : avec ε = 0,1, n = 11 donne 2 − 1/11 ≈ 1,909 > 1,9. Donc sup A = 2, non atteint (pas de maximum), et min A = 1.</p><p><b>Méthode</b> : A non vide ; un candidat s ; prouver que s majore ; pour ε > 0, exhiber x ∈ A avec x > s − ε ; conclure sur le maximum (s ∈ A ou non).</p>" + m12_SIM('ma-sup-plafond', 'Le supremum, c\'est le plus bas des plafonds') + "</div>" +
         "<div class='tcard'><b class='h'>La propriété de la borne supérieure</b><p><b>Axiome</b> : toute partie de ℝ <b>non vide et majorée</b> admet une borne supérieure dans ℝ. Ce n'est pas un théorème : c'est la propriété qui distingue ℝ de ℚ.</p><p>ℚ ne l'a pas : B = {x ∈ ℚ : x > 0 et x² < 2} est non vide (1 ∈ B) et majoré par 2, mais aucun rationnel n'est son plus petit majorant, car ce serait √2, qui n'est pas rationnel.</p><p><b>Conséquences</b> : toute partie non vide et minorée a un infimum (on passe aux opposés) ; <b>propriété d'Archimède</b> : ℕ n'est pas majoré (sinon, avec s = sup ℕ, il existe n > s − 1, et n + 1 > s) ; toute suite croissante et majorée converge vers le sup de ses termes (chapitre « Suites et séries »).</p></div>" +
         "<div class='tcard'><b class='h'>ℚ est dense dans ℝ</b><p>Entre deux réels a < b, il y a toujours un rationnel (donc une infinité). <b>Preuve</b> : par Archimède, il existe n ≥ 1 avec 1/n < b − a ; on pose m = ⌊n·a⌋ + 1, le premier multiple de 1/n après a. Alors m − 1 ≤ na < m, donc a < m/n ≤ a + 1/n < b.</p><p><i>Exemple</i> : entre π et 3,15, b − a ≈ 0,0084 : n = 119 convient (1/119 ≈ 0,0084034 < 0,0084073), m = ⌊119π⌋ + 1 = 374 et 374/119 = 22/7 ≈ 3,142857.</p><p><b>Dense n'est pas complet</b> : ℚ est partout sur la droite, et pourtant il a des trous (√2, π…). La borne supérieure, elle, bouche tous les trous de ℝ.</p></div>"}
  ]
});

/* ================= devantures des 18 exercices (ordre de exos-12.js) ================= */
function m12_dom2(x, gy, w, h, ang, col){ ctx.save(); ctx.translate(x + w, gy); ctx.rotate(ang); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 6; ctx.shadowOffsetX = 3; var g = ctx.createLinearGradient(-w, 0, 0, 0); g.addColorStop(0, m12_mix(col, .3)); g.addColorStop(1, m12_mix(col, -.12)); ctx.fillStyle = g; m12_rr(-w, -h, w, h, 3); ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(x + w, gy); ctx.rotate(ang); ctx.strokeStyle = '#5b5348'; ctx.lineWidth = 1.4; m12_rr(-w, -h, w, h, 3); ctx.stroke(); LN(-w + 2, -h / 2, -2, -h / 2, '#5b5348', 1.4); DOT(-w / 2, -h * .75, 2.6, '#2e2a25'); DOT(-w / 2, -h * .25, 2.6, '#2e2a25'); ctx.restore(); }
function m12_chip(s, x, y, col, sz, fill){ ctx.font = '600 ' + sz + 'px system-ui'; var w = ctx.measureText(s).width + 16, h = sz + 12; m12_card(x, y - h / 2, w, h, fill || m12_mix(col, .86), col, 8); TB(s, x + w / 2, y + sz * .36, m12_mix(col, -.25), sz); return w; }

SFA.figs("c12", [
  /* 1 élément ou partie */
  function(p){
    m12_bg('#fbf8f2', '#f2ecdf'); TB('A = {1, 2, {3}}', W * .4, H * .13, INK, 21);
    var ex = W * .4, ey = H * .58, rx = W * .31, ry = H * .34;
    ctx.save(); ctx.shadowColor = 'rgba(60,40,10,.22)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; var g = ctx.createRadialGradient(ex - rx * .3, ey - ry * .4, 10, ex, ey, rx); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d6e4f7'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, -.08, 0, 2 * PI); ctx.fill(); ctx.restore();
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, -.08, 0, 2 * PI); ctx.stroke(); TB('A', ex - rx * .88, ey - ry * .78, BLUE_D, 20);
    m12_sph(ex - rx * .55, ey - ry * .12, 18, BLUE); TB('1', ex - rx * .55, ey - ry * .12 + 6, '#fff', 17);
    m12_sph(ex - rx * .2, ey + ry * .45, 18, BLUE); TB('2', ex - rx * .2, ey + ry * .45 + 6, '#fff', 17);
    var bw = W * .17, bh = H * .3, bx = ex + rx * .12, by = ey - bh * .62; m12_card(bx, by, bw, bh, '#fff2dc', ORANGE, 10); m12_sph(bx + bw / 2, by + bh / 2, 15, ORANGE); TB('3', bx + bw / 2, by + bh / 2 + 6, '#fff', 16); TB('{3}', bx + bw / 2, by - 8, ORANGE, 15);
    var qx = W * .76; ctx.globalAlpha = m12_cl(p, 0, .4);
    TB('{3} ∈ A', qx, H * .36, DGREEN, 18, 'left'); TB('3 ∉ A', qx, H * .53, DRED, 17, 'left'); TB('{1} ⊂ A', qx, H * .7, BLUE_D, 17, 'left'); TB('{3} ⊄ A', qx, H * .87, DRED, 17, 'left'); ctx.globalAlpha = 1;
    if (p <= 0){ TB('élément', qx + 6, H * .45, GREY, 15, 'left'); TB('ou partie ?', qx + 6, H * .55, GREY, 15, 'left'); }
  },
  /* 2 inclusion-exclusion */
  function(p){
    m12_bg('#f6f8fc', '#e9eff8'); var ex = 12, ey = 10, ew = W - 24, eh = H - 22, r = eh * .33, cy = ey + eh * .6, ax = W * .5 - r * .62, bx = W * .5 + r * .62;
    m12_card(ex, ey, ew, eh, '#fff', null, 14); if (p > 0) m12_compl(ex, ey, ew, eh, cy, r, [ax, bx], GREY, .14 * p);
    m12_disk(ax, cy, r, BLUE); m12_disk(bx, cy, r, ORANGE);
    TB('250 étudiants', ex + 12, ey + 24, INK, 15, 'left'); TB('maths : 160', ax - r * .55, cy - r - 8, BLUE_D, 14); TB('chimie : 110', bx + r * .55, cy - r - 8, ORANGE, 14);
    TB('70', W * .5, cy + 7, VIOLET, 20); TB('les deux', W * .5, cy + 26, GREY, 13);
    var rv = p > 0; TB(rv ? '90' : '?', ax - r * .45, cy + 7, BLUE_D, 20); TB(rv ? '40' : '?', bx + r * .45, cy + 7, ORANGE, 20);
    TB('aucune : ' + (rv ? '50' : '?'), ex + 12, ey + eh - 12, rv ? DRED : GREY, 15, 'left');
    if (rv){ ctx.globalAlpha = m12_cl(p, 0, .4); m12_lab('au moins une : 200', ex + ew - 12, ey + 24, DGREEN, 16, 'right'); ctx.globalAlpha = 1; }
  },
  /* 3 arbre des parties */
  function(p){
    m12_bg('#f6faf5', '#e9f2e7'); var L = 30, R = W - 118, T = 46, B = H - 14, k, j;
    TB('5 fiches : prise ou laissée ?', W * .5 - 50, 22, INK, 15);
    function X(k){ return L + (R - L) * k / 5; } function Y(k, j){ return T + (B - T) * (j + .5) / Math.pow(2, k); }
    for (k = 0; k < 5; k++){ TB(String(k + 1), (X(k) + X(k + 1)) / 2, T - 6, GREY, 13); for (j = 0; j < Math.pow(2, k); j++){
      var lit = p > 0 && j === 0; LN(X(k), Y(k, j), X(k + 1), Y(k + 1, 2 * j), lit ? DGREEN : 'rgba(29,158,117,.65)', 1.6); LN(X(k), Y(k, j), X(k + 1), Y(k + 1, 2 * j + 1), '#b5bcc6', 1.3); } }
    for (j = 0; j < 32; j++) DOT(X(5), Y(5, j), 2.8, p > 0 ? m12_mix(GREEN, -.2) : '#7f8a98');
    m12_sph(X(0), Y(0, 0), 7, INK);
    TB('prise', W - 108, H * .32, DGREEN, 14, 'left'); TB('laissée', W - 108, H * .42, GREY, 14, 'left');
    ctx.globalAlpha = m12_cl(p, 0, .4); TB('2⁵ = 32', W - 108, H * .62, DRED, 24, 'left'); TB('parties', W - 108, H * .74, DRED, 15, 'left'); ctx.globalAlpha = 1;
  },
  /* 4 négation de « tous » */
  function(p){
    m12_bg('#eef1f6', '#dfe4ec'); var rows = 3, cols = 5, i, j, miss = [1, 3];
    TB('« Tous ont leur calculatrice. »', W * .5, 22, INK, 16);
    for (i = 0; i < rows; i++){ var gy = H * (.38 + i * .22), sc = .78 + i * .1, dw = W * .86 * sc, dx = (W - dw) / 2;
      for (j = 0; j < cols; j++){ var x = dx + dw * (j + .5) / cols, s = 19 * sc, col = [BLUE, VIOLET, GREEN, ORA2, BLUE_D][(i + j) % 5]; m12_kid(x, gy - s * 2.4, s, col);
        if (!(i === miss[0] && j === miss[1])){ ctx.fillStyle = '#3d4450'; m12_rr(x - s * .55, gy - s * .95, s * 1.1, s * .8, 2); ctx.fill(); ctx.fillStyle = '#a9e0c9'; ctx.fillRect(x - s * .4, gy - s * .85, s * .8, s * .25); }
        else if (p > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, gy - s * 1.6, s * 1.6, 0, 2 * PI); ctx.stroke(); } }
      var g = ctx.createLinearGradient(0, gy - 4, 0, gy + 12); g.addColorStop(0, '#c99b68'); g.addColorStop(1, '#8b5e34'); ctx.fillStyle = g; m12_rr(dx - 6, gy - 4, dw + 12, 14, 3); ctx.fill(); }
    ctx.globalAlpha = m12_cl(p, 0, .4); m12_lab('∃ un étudiant sans calculatrice', W * .5, H - 10, DRED, 16); ctx.globalAlpha = 1;
  },
  /* 5 ∀y ∃x : x³ = y */
  function(p){
    m12_bg('#fff'); var a = m12_axes(-3, 3, -12, 12, 34, 12, 34, 22, 1, 4);
    ctx.save(); ctx.beginPath(); ctx.rect(a.L, a.T, a.R - a.L, a.B - a.T); ctx.clip(); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3.2; ctx.beginPath(); for (var i = 0; i <= 200; i++){ var x = -3 + 6 * i / 200; if (i) ctx.lineTo(a.X(x), a.Y(x * x * x)); else ctx.moveTo(a.X(x), a.Y(x * x * x)); } ctx.stroke(); ctx.restore();
    TB('y = x³', a.X(-2.8), a.Y(9), BLUE_D, 16, 'left'); TB('∀y ∃x : x³ = y ?', W * .5, 22, INK, 16);
    LN(a.L, a.Y(-8), a.R, a.Y(-8), ORANGE, 1.8, [6, 4]); m12_lab('y = −8', a.R - 4, a.Y(-8) - 8, ORANGE, 14, 'right');
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); LN(a.X(-2), a.Y(-8), a.X(-2), a.Y(0), RED, 1.6, [4, 3]); m12_sph(a.X(-2), a.Y(-8), 7, RED); m12_lab('x = ∛(−8) = −2', a.X(-2) + 12, a.Y(-8) + 24, DRED, 15, 'left'); ctx.globalAlpha = 1; }
  },
  /* 6 nier une définition */
  function(p){
    m12_bg('#f6f7fb', '#e9ecf4'); TB('« uₙ tend vers 3 » et sa négation', W * .5, 24, INK, 15);
    var y1 = H * .36, y2 = H * .74, sz = 15, tok1 = [['∀ε > 0', BLUE], ['∃N', ORANGE], ['∀n ≥ N', BLUE], ['|uₙ − 3| < ε', DGREEN]], tok2 = [['∃ε > 0', ORANGE], ['∀N', BLUE], ['∃n ≥ N', ORANGE], ['|uₙ − 3| ≥ ε', DRED]];
    ctx.font = '600 ' + sz + 'px system-ui'; var tot = 0; tok1.forEach(function(q){ tot += ctx.measureText(q[0]).width + 16 + 8; }); var x = (W - tot + 8) / 2, xs = [];
    tok1.forEach(function(q){ xs.push(x); x += m12_chip(q[0], x, y1, q[1], sz) + 8; });
    ctx.globalAlpha = .35 + .65 * m12_cl(p, 0, .4);
    tok2.forEach(function(q, i){ var w0 = m12_chip(p > 0 ? q[0] : '?', xs[i], y2, p > 0 ? q[1] : GREY, sz); A(xs[i] + w0 / 2, y1 + 18, 0, y2 - y1 - 40, '#9aa3b0', null, 2); });
    ctx.globalAlpha = 1; m12_lab('∀ ↔ ∃, ordre gardé, fin niée', W * .5, (y1 + y2) / 2 + 5, VIOLET, 14);
  },
  /* 7 contraposée : diagramme d'Euler */
  function(p){
    m12_bg('#f7f9fc', '#eaeff7'); TB('si n est multiple de 6, alors n est pair', W * .5, 22, INK, 15);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.15)'; ctx.shadowBlur = 10; ctx.fillStyle = '#e4eefb'; ctx.beginPath(); ctx.ellipse(W * .42, H * .57, W * .3, H * .35, 0, 0, 2 * PI); ctx.fill(); ctx.restore(); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(W * .42, H * .57, W * .3, H * .35, 0, 0, 2 * PI); ctx.stroke();
    ctx.fillStyle = '#d5f0e4'; ctx.beginPath(); ctx.ellipse(W * .48, H * .6, W * .13, H * .17, 0, 0, 2 * PI); ctx.fill(); ctx.strokeStyle = DGREEN; ctx.stroke();
    TB('pairs', W * .3, H * .36, BLUE_D, 15); TB('multiples', W * .48, H * .55, DGREEN, 13); TB('de 6', W * .48, H * .55 + 15, DGREEN, 13);
    m12_sph(W * .48, H * .7, 13, GREEN); TB('12', W * .48, H * .7 + 5, '#fff', 13); m12_sph(W * .25, H * .64, 13, BLUE); TB('4', W * .25, H * .64 + 5, '#fff', 14); m12_sph(W * .86, H * .4, 13, GREY); TB('7', W * .86, H * .4 + 5, '#fff', 14); TB('impairs', W * .86, H * .58, GREY, 14);
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); A(W * .86, H * .66, -W * .2, H * .08, DRED, null, 2.4); m12_lab('impair ⇒ pas multiple de 6', W * .97, H * .86, DRED, 14, 'right'); m12_lab('4 : réciproque fausse', W * .2, H * .64 + 30, ORANGE, 13); ctx.globalAlpha = 1; }
  },
  /* 8 classes modulo 4 */
  function(p){
    m12_bg('#f6f7fb', '#e7eaf2'); TB('a ∼ b ⟺ 4 divise a − b', W * .5, 22, INK, 15);
    var bw = (W - 40) / 4, by = H * .44, bh = H * .5, i, j, nums = [[-4, 0, 4, 8], [-3, 1, 5, 9], [-2, 2, 6, 10], [-1, 3, 7, 11]], cols = [BLUE, GREEN, ORANGE, VIOLET];
    for (i = 0; i < 4; i++){ var x = 12 + i * (bw + 5.3), c = cols[i];
      ctx.fillStyle = m12_mix(c, .55); ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + 10, by - 9); ctx.lineTo(x + bw + 10, by - 9); ctx.lineTo(x + bw, by); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; var g = ctx.createLinearGradient(x, 0, x + bw, 0); g.addColorStop(0, m12_mix(c, .78)); g.addColorStop(1, m12_mix(c, .6)); ctx.fillStyle = g; ctx.fillRect(x, by, bw, bh); ctx.restore(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, by, bw, bh);
      TB('reste ' + i, x + bw / 2, by + bh - 10, m12_mix(c, -.3), 14);
      for (j = 0; j < 4; j++) TB(String(nums[i][j]).replace('-', '−'), x + bw * (j % 2 ? .72 : .28), by + 26 + Math.floor(j / 2) * 24, INK, 15); }
    var u = m12_es(m12_cl(p, 0, .6));
    var c26 = [W * .3, H * .22], t26 = [12 + 2 * (bw + 5.3) + bw / 2, by + 86], c7 = [W * .7, H * .22], t7 = [12 + 1 * (bw + 5.3) + bw / 2, by + 86];
    function chipAt(s, a0, a1, col){ var x = a0[0] + (a1[0] - a0[0]) * u, y = a0[1] + (a1[1] - a0[1]) * u; ctx.font = '600 15px system-ui'; var w = ctx.measureText(s).width + 16; m12_chip(s, x - w / 2, y, col, 15, '#fff'); }
    chipAt('2026', c26, t26, ORANGE); chipAt('−7', c7, t7, GREEN);
    if (p <= 0){ TB('?', W * .3 + 34, H * .22 + 6, GREY, 18, 'left'); TB('?', W * .7 + 26, H * .22 + 6, GREY, 18, 'left'); }
  },
  /* 9 carré modulo 3 */
  function(p){
    m12_bg('#f7f8fc', '#eceff6'); TB('reste de n² dans la division par 3', W * .5, 22, INK, 15);
    var rows = [['n = 3k', 'n² = 3(3k²)', '0', BLUE], ['n = 3k + 1', 'n² = 3(3k² + 2k) + 1', '1', ORANGE], ['n = 3k + 2', 'n² = 3(3k² + 4k + 1) + 1', '1', ORANGE]];
    rows.forEach(function(r, i){ var y = H * (.33 + i * .22), show = i === 0 || p > 0;
      m12_chip(r[0], 14, y, r[3], 14); A(W * .33, y, W * .07, 0, '#9aa3b0', null, 2); TB('²', W * .365, y - 6, GREY, 14);
      ctx.globalAlpha = show ? 1 : .5; m12_chip(show ? r[1] : 'n² = ?', W * .44, y, show ? r[3] : GREY, 13, '#fff'); ctx.globalAlpha = 1;
      if (show) TB('reste ' + r[2], W - 12, y + 5, r[2] === '0' ? BLUE_D : DRED, 14, 'right'); });
    ctx.globalAlpha = m12_cl(p, 0, .4); m12_lab('n pas multiple de 3 ⇒ n² pas multiple de 3', W * .5, H - 12, DGREEN, 14); ctx.globalAlpha = 1;
  },
  /* 10 somme k(k + 1) */
  function(p){
    m12_bg('#fff'); TB('1·2 + 2·3 + … + n(n + 1)', W * .5, 22, INK, 16);
    var L = 30, R = W - 14, B = H - 30, T = 52, n, run = 0, bw = (R - L) / 10;
    for (n = 1; n <= 10; n++){ var v = n * (n + 1), x = L + (n - 1) * bw + 4, h = (B - T) * v / 110 * (p > 0 ? .78 : 1), w = bw - 10; run += v;
      ctx.fillStyle = m12_mix(BLUE, -.3); ctx.beginPath(); ctx.moveTo(x + w, B); ctx.lineTo(x + w + 5, B - 5); ctx.lineTo(x + w + 5, B - h - 5); ctx.lineTo(x + w, B - h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = m12_mix(BLUE, .45); ctx.beginPath(); ctx.moveTo(x, B - h); ctx.lineTo(x + 5, B - h - 5); ctx.lineTo(x + w + 5, B - h - 5); ctx.lineTo(x + w, B - h); ctx.closePath(); ctx.fill();
      var g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, m12_mix(BLUE, .25)); g.addColorStop(1, BLUE); ctx.fillStyle = g; ctx.fillRect(x, B - h, w, h);
      TB(String(n), x + w / 2, B + 17, GREY, 13); TB(String(v), x + w / 2, B - h - 9, BLUE_D, 13);
      if (p > 0){ ctx.globalAlpha = m12_cl(p, (n - 1) / 14, (n - 1) / 14 + .2); TB(String(run), x + w / 2, B - h - 28, DRED, 13); ctx.globalAlpha = 1; } }
    if (p > 0){ ctx.globalAlpha = m12_cl(p, .6, .9); m12_lab('n = 10 : 440 = 10·11·12/3', L + 4, T + 10, DRED, 16, 'left'); ctx.globalAlpha = 1; }
  },
  /* 11 hérédité sans initialisation */
  function(p){
    m12_bg('#f6f3ec', '#e9e2d4'); TB('P(n) : 1 + … + n = n(n + 1)/2 + 5', W * .5, 22, INK, 15);
    var gy = H * .8, g = ctx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#caa071'); g.addColorStop(1, '#8b5e34'); ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy);
    var dw = 20, dh = H * .4, x0 = W * .16, sp = (W * .78) / 7;
    for (var i = 0; i < 7; i++){ m12_dom2(x0 + i * sp, gy, dw, dh, 0, i === 0 && p > 0 ? '#f3c7c6' : '#fbf7ee'); TB(String(i + 1), x0 + i * sp + dw / 2, gy - dh - 10, GREY, 14); if (i < 6) TB('⇒', x0 + i * sp + dw + (sp - dw) / 2, gy - dh * .45, DGREEN, 17); }
    TB('hérédité juste : P(n) ⇒ P(n + 1)', W * .58, gy + 26, '#fff', 14);
    if (p <= 0) TB('P(1) ?', x0 - 14, gy - dh * .42, ORANGE, 16, 'right');
    else { ctx.globalAlpha = m12_cl(p, 0, .4); TB('✗', x0 - 16, gy - dh * .38, DRED, 30, 'right'); TB('P(1) : 1 = 6', 10, gy + 26, '#ffe3e1', 14, 'left'); TB('rien ne tombe : P(n) fausse partout', W * .5, 48, DRED, 15); ctx.globalAlpha = 1; }
  },
  /* 12 trois parties */
  function(p){
    m12_bg('#f7f9fc', '#eaeff7'); var X, ys = [H * .22, H * .52, H * .82], i;
    for (i = 0; i < 3; i++){ X = m12_line(46, W - 22, ys[i], -3, 8); for (var v = -2; v <= 7; v++) LN(X(v), ys[i] - 4, X(v), ys[i] + 4, '#b5bcc6', 1); TB(['A', 'B', 'C'][i], 20, ys[i] + 6, INK, 18); }
    X = function(v){ return 46 + (v + 3) / 11 * (W - 68); };
    m12_iv(X, ys[0], -1, 3, false, true, BLUE); TB('−1', X(-1), ys[0] + 26, GREY, 13); TB('3', X(3), ys[0] + 26, GREY, 13);
    m12_iv(X, ys[1], 2, 5, true, false, ORANGE); m12_sph(X(7), ys[1], 6, ORANGE); TB('2', X(2), ys[1] + 26, GREY, 13); TB('5', X(5), ys[1] + 26, GREY, 13); TB('7', X(7), ys[1] + 26, GREY, 13);
    var r5 = Math.sqrt(5); m12_iv(X, ys[2], -r5, r5, false, false, VIOLET); TB('C : x² < 5', X(5.2), ys[2] + 26, VIOLET, 14, 'left');
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); m12_lab('sup = max = 3', X(3) + 12, ys[0] - 14, DGREEN, 14, 'left'); m12_lab('sup = max = 7', X(7) - 6, ys[1] - 16, DGREEN, 14, 'right'); m12_lab('sup = √5 ≈ 2,24, pas de max', X(r5) - 30, ys[2] - 16, DRED, 14, 'left');
      [[3, ys[0]], [7, ys[1]], [r5, ys[2]]].forEach(function(q){ ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(X(q[0]), q[1] - 6); ctx.lineTo(X(q[0]) - 5, q[1] - 14); ctx.lineTo(X(q[0]) + 5, q[1] - 14); ctx.closePath(); ctx.fill(); }); ctx.globalAlpha = 1; }
  },
  /* 13 suite (2n − 1)/(n + 2) */
  function(p){
    m12_bg('#f6f8fc', '#e8eef8'); var a = m12_axes(0, 41, 0, 2.4, 38, 14, 40, 24, 10, .5, function(v){ return m12_fx(v, 1); });
    TB('uₙ = (2n − 1)/(n + 2)', W * .5, 22, INK, 16);
    for (var n = 1; n <= 40; n++){ var v = 2 - 5 / (n + 2); m12_sph(a.X(n), a.Y(v), n === 1 && p > 0 ? 6.5 : 4.5, BLUE); }
    m12_slab(a.L, a.R, a.Y(2), GREEN, 8); m12_lab('2 majore A', a.R - 4, a.Y(2) - 16, DGREEN, 14, 'right');
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); m12_lab('min = u₁ = 1/3', a.X(1) + 12, a.Y(1 / 3) + 4, DRED, 14, 'left'); m12_lab('sup = 2, jamais atteint', a.X(14), a.Y(1.25), DGREEN, 15, 'left'); m12_lab('n ≥ 499 : uₙ > 1,99', a.X(14), a.Y(.9), ORANGE, 15, 'left'); ctx.globalAlpha = 1; }
  },
  /* 14 suite alternée */
  function(p){
    m12_bg('#f7f8fb', '#eaedf4'); TB('A = {(−1)ⁿ (1 − 1/n) : n ≥ 1}', W * .5, 24, INK, 16);
    var y = H * .58, X = m12_line(30, W - 26, y, -1.25, 1.25); m12_tick(X, y, -1, '−1'); m12_tick(X, y, 0, '0'); m12_tick(X, y, 1, '1'); m12_tick(X, y, .5, ''); m12_tick(X, y, -.5, '');
    for (var n = 1; n <= 40; n++){ var v = (n % 2 ? -1 : 1) * (1 - 1 / n), dy = n % 2 ? 16 : -16; m12_sph(X(v), y + dy, n < 8 ? 5.5 : 3.6, n % 2 ? ORA2 : BLUE); if (n >= 2 && n <= 4) m12_lab(['0', '1/2', '−2/3', '3/4'][n - 1], X(v), y + dy * 2.4 + (dy > 0 ? 6 : 0), GREY, 13); }
    m12_hole(X(1), y, 6, DGREEN); m12_hole(X(-1), y, 6, DRED);
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); m12_lab('sup A = 1 ∉ A', X(1), y - 52, DGREEN, 15, 'right'); m12_lab('pas de maximum', X(1), y - 34 - 36, DGREEN, 13, 'right'); m12_lab('inf A = −1 ∉ A', X(-1), y + 74, DRED, 15, 'left'); ctx.globalAlpha = 1; }
    else TB('max A ?', W * .5, H * .9, GREY, 16);
  },
  /* 15 densité : zoom */
  function(p){
    m12_bg('#fbfaf6', '#eef0e8'); var y1 = H * .2, y2 = H * .66, a = Math.SQRT2, b = 1.415;
    var X1 = m12_line(20, W - 26, y1, 1.40, 1.43); m12_tick(X1, y1, 1.40, '1,40'); m12_tick(X1, y1, 1.43, '1,43'); ctx.fillStyle = 'rgba(186,117,23,.35)'; ctx.fillRect(X1(a), y1 - 6, X1(b) - X1(a), 12);
    var v0 = 1.4138, v1 = 1.4154, X2 = m12_line(20, W - 26, y2, v0, v1);
    ctx.fillStyle = 'rgba(120,130,150,.12)'; ctx.beginPath(); ctx.moveTo(X1(a), y1 + 6); ctx.lineTo(X1(b), y1 + 6); ctx.lineTo(X2(b), y2 - 14); ctx.lineTo(X2(a), y2 - 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(186,117,23,.2)'; ctx.fillRect(X2(a), y2 - 10, X2(b) - X2(a), 20);
    m12_hole(X2(a), y2, 6, DRED); m12_hole(X2(b), y2, 6, DRED); m12_lab('√2 ≈ 1,414214', X2(a), y2 + 30, DRED, 14); m12_lab('1,415', X2(b), y2 + 30, DRED, 14);
    [1799, 1800].forEach(function(m){ var v = m / 1272; LN(X2(v), y2 - 16, X2(v), y2 + 16, '#7f8a98', 1.6, [3, 3]); });
    m12_lab('pas 1/1272 ≈ 0,000786', W * .5, y2 - 26, GREY, 13);
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); m12_sph(X2(1799 / 1272), y2, 8, GREEN); m12_lab('1799/1272 ≈ 1,414308', X2(1799 / 1272), H - 10, DGREEN, 16); ctx.globalAlpha = 1; }
    else m12_lab('un rationnel dans ]a ; b[ ?', W * .5, H - 10, GREY, 15);
  },
  /* 16 ℚ troué */
  function(p){
    m12_bg('#f7f6fb', '#ebe8f4'); TB('A = {x ∈ ℚ : x > 0, x² < 3}', W * .5, 24, INK, 16);
    var r3 = Math.sqrt(3), y = H * .55, cx = W * .52;
    function X(v){ var d = v - r3, s = d < 0 ? -1 : 1; return cx + s * (W * .42) * Math.log(1 + Math.abs(d) * 4000) / Math.log(1 + .4 * 4000); }
    LN(18, y, W - 18, y, '#8a95a3', 1.6);
    [[1.4, '1,4'], [1.7, '1,7'], [1.73, '1,73'], [1.732, '1,732']].forEach(function(q, i){ m12_sph(X(q[0]), y, 6, BLUE); m12_lab(q[1], X(q[0]), y + (i % 2 ? 40 : 26), BLUE_D, 13); });
    [[2, '2'], [1.74, '1,74'], [1.733, '1,733'], [1.7321, '1,7321']].forEach(function(q, i){ LN(X(q[0]), y - 16, X(q[0]), y + 6, GREEN, 3); m12_lab(q[1], X(q[0]), y - (i % 2 ? 40 : 24), DGREEN, 13); });
    ctx.setLineDash([3, 3]); m12_hole(X(r3), y, 7, VIOLET); ctx.setLineDash([]);
    TB('éléments', 22, H * .9, BLUE_D, 14, 'left'); TB('majorants rationnels', W - 22, H * .9, DGREEN, 14, 'right');
    ctx.globalAlpha = m12_cl(p, 0, .4); m12_lab('√3 ∉ ℚ : pas de plus petit majorant rationnel', W * .5, H * .18 + 14, VIOLET, 14); ctx.globalAlpha = 1;
  },
  /* 17 Archimède */
  function(p){
    m12_bg('#f6f8fc', '#e8eef8'); TB('Si ℕ était majoré : s = sup ℕ', W * .5, 24, INK, 16);
    var y = H * .6, X = m12_line(20, W - 26, y, -.5, 10.5), s = 7.4;
    ctx.fillStyle = 'rgba(186,117,23,.16)'; ctx.fillRect(X(s - 1), y - 46, X(s) - X(s - 1), 70); m12_lab('s − 1', X(s - 1), y - 52, ORANGE, 13);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.2)'; ctx.shadowBlur = 8; var g = ctx.createLinearGradient(X(s) - 4, 0, X(s) + 8, 0); g.addColorStop(0, '#f3b0ae'); g.addColorStop(1, '#c43f3e'); ctx.fillStyle = g; ctx.fillRect(X(s) - 3, y - 60, 9, 90); ctx.restore(); m12_lab('s', X(s) + 4, y - 66, DRED, 15);
    for (var n = 0; n <= 10; n++){ var hl = n === 7, beyond = n > s; m12_sph(X(n), y, hl ? 7.5 : 5.5, beyond ? (p > 0 && n === 8 ? RED : '#aab2bd') : (hl ? ORANGE : BLUE)); TB(String(n), X(n), y + 26, GREY, 13); }
    m12_lab('n > s − 1', X(7), y + 48, ORANGE, 14);
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); ctx.strokeStyle = RED; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(X(7), y - 12); ctx.quadraticCurveTo((X(7) + X(8)) / 2, y - 40, X(8), y - 12); ctx.stroke(); m12_lab('+1', X(8) + 8, y - 26, DRED, 15, 'left'); m12_lab('n + 1 > s : contradiction', W * .5, H - 10, DRED, 16); ctx.globalAlpha = 1; }
  },
  /* 18 sup(A + B) */
  function(p){
    m12_bg('#f7f9fc', '#eaeff7'); var ys = [H * .2, H * .5, H * .8], X, i, n;
    for (i = 0; i < 3; i++){ X = m12_line(64, W - 22, ys[i], -.2, 3.5); [0, 1, 2, 3].forEach(function(v){ m12_tick(X, ys[i], v, String(v)); }); TB(['A', 'B', 'A + B'][i], 12, ys[i] + 6, INK, 16, 'left'); }
    m12_iv(X, ys[0], 0, 2, true, false, BLUE);
    for (n = 1; n <= 30; n++) m12_sph(X(1 - 1 / n), ys[1], n < 5 ? 5.5 : 3.5, ORANGE); m12_hole(X(1), ys[1], 5, ORANGE);
    if (p > 0){ ctx.globalAlpha = m12_cl(p, 0, .4); m12_iv(X, ys[2], 0, 3, true, false, VIOLET); m12_lab('sup = 2', X(2) + 10, ys[0] - 14, BLUE_D, 14, 'left'); m12_lab('sup = 1', X(1) + 10, ys[1] - 14, ORANGE, 14, 'left'); m12_lab('sup = 2 + 1 = 3, non atteint', X(3), ys[2] - 16, DRED, 14, 'right'); ctx.globalAlpha = 1; }
    else TB('sup (A + B) = ?', X(1.5), ys[2] - 14, GREY, 15);
  }
]);
})();
