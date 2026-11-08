/* Biologie BA1 · chapitre 8 : cycle cellulaire, division et embryologie */
(function(){
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function axIn(S, c, r, o){ o = o || {}; o.l = r.x + (o.pl == null ? 44 : o.pl); o.r = Math.max(4, c.W - r.x - r.w + (o.pr == null ? 10 : o.pr)); o.t = r.y + (o.pt == null ? 16 : o.pt); o.b = Math.max(4, c.H - r.y - r.h + (o.pb == null ? 32 : o.pb)); return S.draw.axes(c, o); }
function glyph(c, x, y, chromatids, col){
  var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round";
  if (chromatids === 2){ ctx.beginPath(); ctx.moveTo(x - 5, y - 11); ctx.lineTo(x + 5, y + 11); ctx.moveTo(x + 5, y - 11); ctx.lineTo(x - 5, y + 11); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 11); ctx.lineTo(x, y + 11); ctx.stroke(); }
  ctx.restore();
}

/* 1. Mitose contre méiose */
SFA.sim({
  id:"ub-c08-mitose-meiose", ch:"c08", tag:"Piège classique",
  titre:"Mitose contre méiose : chromosomes, chromatides, ADN",
  resume:"À chaque étape : combien de chromosomes, de chromatides, de cellules, quelle quantité d'ADN ?",
  but:"Choisis le type de division et le nombre 2n, avance dans le processus (curseur ou bouton) et regarde les chromosomes se déplacer et lis les quatre nombres à chaque étape.",
  aRetenir:"On compte les chromosomes par les centromères. Mitose : 2n → 2n ; l'anaphase double momentanément le nombre de chromosomes (4n) car les chromatides sœurs deviennent des chromosomes. Méiose : l'anaphase I sépare les homologues (le nombre de chromosomes passe de 2n à n par cellule, chaque chromosome garde 2 chromatides), l'anaphase II sépare les chromatides. Quantité d'ADN (c = ADN d'un gamète) : G1 2c ; après S 4c ; après méiose I 2c par cellule ; gamète 1c.",
  piege:"« Une cellule en métaphase II a n chromosomes à 2 chromatides, donc 2c ». À l'anaphase II elle a 2n chromosomes (chromatides séparées), mais toujours 2c d'ADN. Ne confonds pas le nombre de chromosomes (centromères) avec le nombre de chromatides.",
  build:function(k,S){
    var c = k.canvas(380), pal = S.draw.palette, B = S.bio, an = 0;
    var mode = k.seg("Division", [["mi","Mitose"],["me","Méiose"]], "mi");
    var dn = k.select("Nombre de chromosomes 2n", [["4","4 (modèle)"],["6","6"],["8","8"],["46","46 (humain)"]], "4");
    var av = k.slider("Avancement", 0, 100, 1, 10, "%");
    var ro = k.readouts(["Étape","Chromosomes / cellule","Chromatides / cellule","ADN / cellule","Cellules"]);
    var note = k.note("", "ok");
    var MI = [["G1",2,2,"2c",1,1],["Fin de S / G2",2,4,"4c",1,2],["Prophase – métaphase",2,4,"4c",1,2],["Anaphase",4,4,"4c",1,1],["Télophase et cytocinèse (par cellule fille)",2,2,"2c",2,1]];
    var ME = [["G1",2,2,"2c",1,1],["Prophase I (bivalents, crossing-over)",2,4,"4c",1,2],["Métaphase I",2,4,"4c",1,2],["Anaphase I",2,4,"4c",1,2],["Fin de la méiose I (par cellule)",1,2,"2c",2,2],["Métaphase II (par cellule)",1,2,"2c",2,2],["Anaphase II (par cellule)",2,2,"2c",2,1],["Gamètes (par cellule)",1,1,"1c",4,1]];

    function seeded(i){ var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
    /* chromosome : dbl = deux chromatides ; pos en px */
    function chr(x, y, L, col, dbl, ang, swap){ B.chrom(c, x, y, L, col, {dbl:dbl, angle:ang || 0, w:Math.max(3, L * .17)}); if (swap){ var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.rotate(ang || 0); ctx.strokeStyle = swap; ctx.lineWidth = Math.max(3, L * .17); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-L * .08, -L * .45); ctx.lineTo(-L * .1, -L * .2); ctx.stroke(); ctx.restore(); } }
    function cellShape(cx, cy, rx, ry, nuc, hot){
      var ctx = c.ctx, g = ctx.createRadialGradient(cx - rx * .3, cy - ry * .3, 4, cx, cy, Math.max(rx, ry)); g.addColorStop(0, "#fffaf0"); g.addColorStop(1, "#f3e6cc");
      ctx.fillStyle = g; ctx.strokeStyle = "#c7a96b"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.fill(); ctx.stroke();
      if (nuc){ ctx.fillStyle = "rgba(210,225,248,.75)"; ctx.strokeStyle = "#7a9ad6"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(cx, cy, rx * .62, ry * .62, 0, 0, 7); ctx.fill(); ctx.stroke(); }
    }
    function spindle(cx, cy, rx, ry, ori){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = "rgba(90,110,140,.45)"; ctx.lineWidth = 1.2;
      var p = ori === "h" ? [[-rx * .82, 0], [rx * .82, 0]] : [[0, -ry * .82], [0, ry * .82]];
      for (var q = -3; q <= 3; q++){ [0, 1].forEach(function(s){ ctx.beginPath(); ctx.moveTo(cx + p[s][0], cy + p[s][1]); var mx = ori === "h" ? 0 : q * rx * .16, my = ori === "h" ? q * ry * .16 : 0; ctx.quadraticCurveTo(cx + mx * 1.6, cy + my * 1.6, cx + (ori === "h" ? 0 : q * 4), cy + (ori === "h" ? q * 4 : 0)); ctx.stroke(); }); }
      ctx.restore(); p.forEach(function(pp){ B.ball(c, cx + pp[0], cy + pp[1], 4, pal.amber); }); }
    /* un état de cellule : kind décrit la disposition */
    function drawCell(cx, cy, rx, ry, kind, np, L, ori, dbl, pairs){
      var ctx = c.ctx, j, ang, col = [pal.red, pal.acc];
      var nuc = kind === "interphase" || kind === "telo";
      cellShape(cx, cy, rx, ry, nuc);
      var n = np;
      if (kind === "interphase"){ for (j = 0; j < n * (pairs ? 2 : 1); j++){ chr(cx + (seeded(j * 3 + 1) - .5) * rx * .8, cy + (seeded(j * 3 + 2) - .5) * ry * .8, L * .55, col[j % 2], dbl, (seeded(j) - .5) * 2); } return; }
      if (kind === "prophaseI"){ for (j = 0; j < n; j++){ var px = cx + (seeded(j + 5) - .5) * rx * 1.0, py = cy + (seeded(j + 9) - .5) * ry * 1.0; chr(px - L * .13, py, L * .8, col[0], true, 0, col[1]); chr(px + L * .13, py, L * .8, col[1], true, 0, col[0]); } return; }
      if (kind !== "telo" && kind !== "haploid") spindle(cx, cy, rx, ry, ori);
      var along = function(t){ return ori === "h" ? [cx + t, 0] : [0, cy + t]; };
      if (kind === "metaI"){ for (j = 0; j < n; j++){ var off = (j - (n - 1) / 2) * L * .9, sx = ori === "h" ? cx : cx + off, sy = ori === "h" ? cy + off : cy; chr(ori === "h" ? sx - L * .15 : sx, ori === "h" ? sy : sy - L * .15, L * .8, col[0], true, ori === "h" ? 1.57 : 0, col[1]); chr(ori === "h" ? sx + L * .15 : sx, ori === "h" ? sy : sy + L * .15, L * .8, col[1], true, ori === "h" ? 1.57 : 0, col[0]); } return; }
      if (kind === "meta"){ for (j = 0; j < n; j++){ var off2 = (j - (n - 1) / 2) * L * .62; chr(ori === "h" ? cx : cx + off2, ori === "h" ? cy + off2 : cy, L * .8, col[j % 2], true, ori === "h" ? 1.57 : 0); } return; }
      if (kind === "anaI"){ for (j = 0; j < n; j++){ var off3 = (j - (n - 1) / 2) * L * .6, d = rx * .55; chr(ori === "h" ? cx - d : cx + off3, ori === "h" ? cy + off3 : cy - ry * .55, L * .8, col[0], true, ori === "h" ? 1.57 : 0); chr(ori === "h" ? cx + d : cx + off3, ori === "h" ? cy + off3 : cy + ry * .55, L * .8, col[1], true, ori === "h" ? 1.57 : 0); } return; }
      if (kind === "ana"){ for (j = 0; j < n; j++){ var off4 = (j - (n - 1) / 2) * L * .6, d2 = (ori === "h" ? rx : ry) * .5, cc = col[j % 2]; if (ori === "h"){ chr(cx - d2, cy + off4, L * .6, cc, false, 1.57); chr(cx + d2, cy + off4, L * .6, cc, false, 1.57); } else { chr(cx + off4, cy - d2, L * .6, cc, false, 1.57); chr(cx + off4, cy + d2, L * .6, cc, false, 1.57); } } return; }
      if (kind === "telo" || kind === "haploid"){ for (j = 0; j < n; j++){ chr(cx + (seeded(j * 3 + 11) - .5) * rx * .7, cy + (seeded(j * 3 + 12) - .5) * ry * .7, L * .55, col[(kind === "haploid" ? 0 : j) % 2] === col[0] ? col[j % 2] : col[0], dbl, (seeded(j + 20) - .5) * 2); } }
    }
    var VIS = {};
    function plan(isMi, i, np){   /* renvoie [{kind, ori, dbl, pairs, n}, ...] cellules */
      if (isMi){
        if (i === 0) return [{kind:"interphase", dbl:false, n:np, pairs:true}];
        if (i === 1) return [{kind:"interphase", dbl:true, n:np, pairs:true}];
        if (i === 2) return [{kind:"meta", ori:"h", n:2 * np}];
        if (i === 3) return [{kind:"ana", ori:"h", n:2 * np, wide:true}];
        return [{kind:"telo", dbl:false, n:2 * np}, {kind:"telo", dbl:false, n:2 * np}];
      }
      if (i === 0) return [{kind:"interphase", dbl:false, n:np, pairs:true}];
      if (i === 1) return [{kind:"prophaseI", n:np}];
      if (i === 2) return [{kind:"metaI", ori:"h", n:np}];
      if (i === 3) return [{kind:"anaI", ori:"h", n:np, wide:true}];
      if (i === 4) return [{kind:"telo", dbl:true, n:np}, {kind:"telo", dbl:true, n:np}];
      if (i === 5) return [{kind:"meta", ori:"v", n:np}, {kind:"meta", ori:"v", n:np}];
      if (i === 6) return [{kind:"ana", ori:"v", n:np}, {kind:"ana", ori:"v", n:np}];
      return [0, 1, 2, 3].map(function(){ return {kind:"haploid", dbl:false, n:np}; });
    }
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear(); B.bg(c, "#fbfdff", "#eef3f9");
      var isMi = mode.value === "mi", L0 = isMi ? MI : ME, i = Math.min(L0.length - 1, Math.floor(av.value / 100 * L0.length)), st = L0[i], n2 = parseInt(dn.value, 10), nn = n2 / 2;
      var chrs = st[1] * nn, chrt = st[2] * nn, cells = st[4];
      var np = Math.min(nn, 5), pl = plan(isMi, i, np), p0n = np;
      S.draw.text(c, st[0], W / 2, 18, {size:14, color:pal.ink});
      var cnt = pl.length, rx, ry, pos = [];
      var topY = 40, areaH = H - topY - 40;
      if (cnt === 1){ rx = Math.min(W * (pl[0].wide ? .44 : .34), 190); ry = Math.min(areaH / 2, rx * .95); pos = [[W / 2, topY + areaH / 2]]; if (pl[0].wide) ry *= .85; }
      else if (cnt === 2){ rx = Math.min(W * .22, 130); ry = Math.min(areaH / 2 - 6, rx * 1.1); pos = [[W * .27, topY + areaH / 2], [W * .73, topY + areaH / 2]]; }
      else { rx = Math.min(W * .21, 110); ry = Math.min(areaH / 4 - 4, rx); pos = [[W * .3, topY + areaH * .25], [W * .7, topY + areaH * .25], [W * .3, topY + areaH * .75], [W * .7, topY + areaH * .75]]; }
      var L = Math.max(14, Math.min(66, Math.min(rx, ry) * (cnt > 2 ? .6 : .55) * (p0n > 4 ? .75 : 1)));
      pl.forEach(function(p, q){
        var ang = 0;
        drawCell(pos[q][0], pos[q][1], rx, ry, p.kind, p.n, L, p.ori || "h", p.dbl, p.pairs);
      });
      if (nn > np) S.draw.text(c, np + " paires dessinées sur " + nn + " (schéma simplifié)", W - 12, H - 14, {size:10, color:pal.grey, align:"right"});
      S.draw.legend(c, [[pal.red, "origine maternelle"], [pal.acc, "origine paternelle"]], 12, H - 40, {box:false});
      ro.set(0, i + 1 + "/" + L0.length); ro.set(1, chrs); ro.set(2, chrt); ro.set(3, st[3]); ro.set(4, cells);
      note.set(isMi ? "Mitose : deux cellules filles génétiquement identiques, 2n chromosomes chacune." : "Méiose : une cellule 2n donne 4 cellules haploïdes (n) génétiquement différentes (crossing-over : petits segments échangés en prophase I).", "ok");
    }
    k.button("▶ Animer la division", function(){ av.set(0); (function go(v){ if (!k._alive) return; if (v <= 100){ av.set(v); k.redraw(); setTimeout(function(){ go(v + 1.5); }, 55); } })(0); }, true);
    k.draw(function(){ frame(0); });
  }
});

/* 2. Cycle cellulaire et points de contrôle */
SFA.sim({
  id:"ub-c08-cycle-controle", ch:"c08", tag:"Cancer",
  titre:"Cycle cellulaire, p53 et accumulation de mutations",
  resume:"Des cellules tournent sur l'anneau du cycle ; au point de contrôle G1/S, p53 arrête les cellules lésées (réparation ou apoptose). Sans p53, les lésions passent et s'accumulent.",
  but:"Règle la durée des phases et la fréquence des lésions de l'ADN, active ou non p53, et regarde ce qui arrive aux cellules lésées (éclair) au point de contrôle G1/S. Glisse le temps sur le graphique. Défi : sans p53, trouve le plus petit δ pour qu'après 10 jours plus de la moitié des cellules portent une lésion non éliminée.",
  aRetenir:"Cycle = G1 + S + G2 + M. Les points de contrôle (G1/S, G2/M, métaphase-anaphase) arrêtent le cycle tant que l'ADN est lésé ou incomplet : p53 active p21, inhibiteur des CDK, puis réparation ou apoptose. Si p53 est inactivée (mutée dans environ la moitié des cancers), les cellules lésées prolifèrent : les mutations s'accumulent. Fraction de lignées touchées après k cycles : 1 − (1 − δ(1 − a))<sup>k</sup>.",
  piege:"Population : N = N₀·2<sup>t/T</sup> sans perte ; l'apoptose réduit le facteur de 2 à 2(1 − δ·a) par cycle. Les phases n'ont pas la même durée : G1 est la plus variable (la phase M ne dure que ≈ 1 h). Modèle très simplifié : δ constant, a = 90 % des lésions éliminées si p53 est fonctionnelle (hypothèse pédagogique) ; l'anneau montre quelques cellules, les nombres viennent du modèle.",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(600), rs = rng(17), cells = [], kids = [], tD = 0, playing = true, geo = null, drag = false, bPlay;
    c.cv.style.touchAction = "none";
    var g1 = k.slider("G1", 2, 16, 1, 10, "h");
    var s = k.slider("S", 4, 12, 1, 8, "h");
    var g2 = k.slider("G2", 1, 6, 1, 4, "h");
    var m = k.slider("M", 0.5, 2, 0.5, 1, "h");
    var dl = k.slider("Cellules lésées à chaque cycle (δ)", 0, 30, 1, 10, "%");
    var p53 = k.toggle("p53 fonctionnelle", true);
    bPlay = k.button("⏸ Pause", function(){ if (tD >= 10) tD = 0; playing = !playing; }, true);
    k.button("↺ Jour 0", function(){ tD = 0; });
    var ro = k.readouts(["Durée du cycle T", "Cycles en 10 j", "Population après 10 j", "Lésions non éliminées", "Éliminées par cycle"]);
    var note = k.note("", "");
    for (var i = 0; i < 16; i++) cells.push({th:i / 16 + rs() * 0.03, les:0, hold:0, die:-1, ro:(rs() - 0.5) * 16});
    function T(){ return g1.value + s.value + g2.value + m.value; }
    function mutf(days, d, a){ return 1 - Math.pow(1 - d * (1 - a), days * 24 / T()); }
    c.pointer(function(t, p){
      if (!geo) return;
      if (t === "down") drag = p.y > geo.ax.T - 6 && p.y < geo.ax.B + 20;
      if ((t === "down" || t === "drag") && drag){ tD = Math.max(0, Math.min(10, geo.ax.ix(p.x))); playing = false; k.redraw(); }
      if (t === "up") drag = false;
      if (t === "down" && !drag && p.y < geo.top) playing = !playing;
    });
    function cellG(x, y, r, st, al, dividing){
      var ctx = c.ctx; ctx.save(); ctx.globalAlpha = al;
      var body = st === 3 ? "#f3c9c3" : st === 2 ? "#f8dfb7" : "#dcebd8", nuc = st === 3 ? pal.red : st === 2 ? pal.amber : "#4e8a6a";
      if (dividing){ ctx.fillStyle = body; ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.lineWidth = 1; [-1, 1].forEach(function(sg){ ctx.beginPath(); ctx.arc(x + sg * r * 0.55, y, r * 0.75, 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.fillStyle = nuc; ctx.beginPath(); ctx.arc(x + sg * r * 0.55, y, r * 0.3, 0, 6.2832); ctx.fill(); ctx.fillStyle = body; }); }
      else { ctx.fillStyle = body; ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.fillStyle = nuc; ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, 6.2832); ctx.fill(); }
      if (st === 1){ ctx.fillStyle = "#f4c542"; ctx.strokeStyle = "#8a6d1c"; ctx.beginPath(); ctx.moveTo(x + 2, y - r - 6); ctx.lineTo(x - 3, y - r + 1); ctx.lineTo(x + 1, y - r + 1); ctx.lineTo(x - 2, y - r + 7); ctx.lineTo(x + 4, y - r - 1); ctx.lineTo(x, y - r - 1); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      ctx.restore();
    }
    function step(dt){
      var Tv = T(), hps = 12, b1 = g1.value / Tv, d = dl.value / 100;
      cells.forEach(function(z){
        if (z.die >= 0){ z.die += dt; if (z.die > 0.9){ z.die = -1; z.th = rs() * 0.05; z.les = rs() < d ? 1 : 0; } return; }
        if (z.hold > 0){ z.hold -= dt; if (z.hold <= 0){ if (rs() < 0.9){ z.die = 0; } else { z.les = 2; z.th = b1 + 0.001; } } return; }
        var old = z.th; z.th += dt * hps / Tv;
        if (old < b1 && z.th >= b1 && z.les === 1){ if (p53.value){ z.th = b1 - 0.0005; z.hold = 0.9; } else z.les = 3; }
        if (z.th >= 1){ z.th -= 1; kids.push({th:0, st:z.les >= 2 ? z.les : 0, t:0}); if (z.les < 2) z.les = rs() < d ? 1 : 0; }
      });
      kids.forEach(function(q){ q.t += dt; }); kids = kids.filter(function(q){ return q.t < 0.9; });
    }
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, Tv = T(), d = dl.value / 100, a = p53.value ? 0.9 : 0, i;
      if (dt) step(dt);
      c.clear();
      var top = 316, R = Math.max(68, Math.min(98, W * 0.24)), cx = R + 30, cy = 26 + R + 10;
      S.draw.text(c, "Cycle cellulaire · " + S.fmt(Tv, 1) + " h", 6, 12, {size:11.5, align:"left", color:pal.ink});
      var ph = [["G1", g1.value, "#6d93d6"], ["S", s.value, "#e0a01b"], ["G2", g2.value, "#4ea37f"], ["M", m.value, "#c0321d"]], ang = -Math.PI / 2;
      ph.forEach(function(p){ var da = p[1] / Tv * 6.2832; ctx.strokeStyle = p[2]; ctx.lineWidth = 16; ctx.lineCap = "butt"; ctx.beginPath(); ctx.arc(cx, cy, R, ang, ang + da); ctx.stroke();
        var mid = ang + da / 2; S.draw.text(c, p[0], cx + Math.cos(mid) * (R - 24), cy + Math.sin(mid) * (R - 24), {size:11, color:p[2]}); ang += da; });
      /* point de contrôle G1/S */
      var aG = -Math.PI / 2 + g1.value / Tv * 6.2832, gx = cx + Math.cos(aG) * R, gy = cy + Math.sin(aG) * R;
      ctx.save(); ctx.translate(gx, gy); ctx.rotate(aG); ctx.fillStyle = p53.value ? "#1f4b9e" : "#b8c0cc"; ctx.fillRect(-14, -3, 28, 6); ctx.restore();
      var sx = cx + Math.cos(aG) * (R + 26), sy = cy + Math.sin(aG) * (R + 26);
      ctx.fillStyle = p53.value ? "#1f4b9e" : "#b8c0cc"; ctx.beginPath(); ctx.moveTo(sx, sy - 11); ctx.lineTo(sx + 10, sy - 6); ctx.lineTo(sx + 8, sy + 6); ctx.lineTo(sx, sy + 12); ctx.lineTo(sx - 8, sy + 6); ctx.lineTo(sx - 10, sy - 6); ctx.closePath(); ctx.fill();
      S.draw.text(c, "p53", sx, sy, {size:8.5, color:"#fff"});
      S.draw.text(c, p53.value ? "contrôle G1/S actif" : "p53 inactivée", sx, sy + 22, {size:9.5, color:p53.value ? pal.acc : pal.grey, halo:"#fff"});
      /* cellules */
      cells.forEach(function(z){ var an = -Math.PI / 2 + z.th * 6.2832, rr = R + z.ro * 0.4, x = cx + Math.cos(an) * rr, y = cy + Math.sin(an) * rr;
        if (z.die >= 0){ var f = z.die / 0.9; for (var q = 0; q < 5; q++){ var aa = q * 1.256 + z.ro; cellG(x + Math.cos(aa) * f * 12, y + Math.sin(aa) * f * 12, 3.2, 1, 1 - f, false); } return; }
        cellG(x, y, 7, z.les, 1, z.th > 1 - m.value / Tv * 0.6);
        if (z.hold > 0) S.draw.glow(c, x, y, 16, "#1f4b9e", 0.35); });
      /* population (dessin lié au modèle) */
      var px = cx + R + 40, pw = W - px - 8, ncyc = tD * 24 / Tv, N = Math.pow(2 * (1 - d * a), ncyc), mf = mutf(tD, d, a);
      if (pw > 90){
        S.draw.panel(c, px, 26, pw, 2 * R + 20, {shadow:false, title:"Jour " + S.fmt(tD, 1)});
        var cols = 10, cw = Math.min((pw - 16) / cols, 15), nred = Math.round(mf * 100);
        for (i = 0; i < 100; i++){ var xx = px + 8 + cw * (i % cols + 0.5), yy = 52 + cw * (Math.floor(i / cols) + 0.5); cellG(xx, yy, cw * 0.38, i < nred ? (p53.value ? 2 : 3) : 0, 1, false); }
        S.draw.text(c, "N ≈ " + (N < 1e5 ? S.fmt(N, 0) : S.bio && S.bio.sci ? S.bio.sci(N, 2) : S.fmt(N, 0)) + " cellules", px + pw / 2, 52 + cw * 10 + 14, {size:10.5, color:pal.ink});
        S.draw.text(c, nred + " % à lésion non éliminée", px + pw / 2, 52 + cw * 10 + 30, {size:10, color:p53.value ? "#a8740c" : pal.red});
        kids.forEach(function(q){ var an = -Math.PI / 2, x0 = cx + Math.cos(an) * R, y0 = cy + Math.sin(an) * R, e = q.t / 0.9; cellG(x0 + (px + pw / 2 - x0) * e, y0 + (40 + R - y0) * e - Math.sin(e * 3.14) * 18, 4, q.st, 1 - e * 0.6, false); });
      }
      /* légende */
      var ly = cy + R + 64; cellG(16, ly, 5, 1, 1, false); S.draw.text(c, "lésée", 25, ly, {size:10, align:"left"}); cellG(70, ly, 5, 2, 1, false); S.draw.text(c, "lésion passée", 79, ly, {size:10, align:"left"}); cellG(160, ly, 5, 3, 1, false); S.draw.text(c, "mutée (sans p53)", 169, ly, {size:10, align:"left"});
      /* graphique */
      var ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:10, y0:0, y1:100, xl:"jours", yl:"% de cellules à lésion non éliminée", stepX:1, stepY:25, pt:20});
      geo = {ax:ax, top:top};
      S.draw.fn(c, ax, function(x){ return 100 * mutf(x, d, 0.9); }, pal.green, p53.value ? 3 : 1.6, p53.value ? null : [5, 4]);
      S.draw.fn(c, ax, function(x){ return 100 * mutf(x, d, 0); }, pal.red, p53.value ? 1.6 : 3, p53.value ? [5, 4] : null);
      S.draw.legend(c, [[pal.green, "p53 fonctionnelle"], [pal.red, "p53 inactivée"]], ax.R - 4, ax.T + 20, {align:"right"});
      S.draw.line(c, ax.L, ax.Y(50), ax.R, ax.Y(50), pal.grey, 1, [2, 4]);
      S.draw.line(c, ax.X(tD), ax.T, ax.X(tD), ax.B, pal.ink, 1.2, [4, 3]);
      S.draw.dot(c, ax.X(tD), ax.Y(100 * mf), 6, p53.value ? pal.green : pal.red);
      var m10 = mutf(10, d, a);
      ro.set(0, S.fmt(Tv, 1) + " h"); ro.set(1, S.fmt(240 / Tv, 1)); ro.set(2, S.sci(Math.pow(2 * (1 - d * a), 240 / Tv), 2)); ro.set(3, S.fmt(mf * 100, 1) + " % (j " + S.fmt(tD, 1) + ")"); ro.set(4, S.fmt(d * a * 100, 1) + " %");
      bPlay.textContent = playing ? "⏸ Pause" : "▶ Lancer";
      var ok = !p53.value && m10 > 0.5 && mutf(10, Math.max(0, d - 0.01), 0) <= 0.5;
      note.set(ok ? "✓ <b>Défi réussi</b> : avec δ = " + dl.value + " % par cycle et sans p53, " + S.fmt(m10 * 100, 0) + " % des cellules portent une lésion après 10 jours (" + S.fmt(240 / Tv, 1) + " cycles). Avec p53 fonctionnelle, ce serait " + S.fmt(mutf(10, d, 0.9) * 100, 0) + " %."
        : "◎ <b>Défi</b> : désactive p53 et trouve le plus petit δ (en %) pour qu'après 10 jours plus de la moitié des cellules portent une lésion non éliminée (courbe rouge au-dessus de 50 % au jour 10). Actuellement : " + S.fmt(m10 * 100, 1) + " %.", ok ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ if (playing){ tD += dt * 0.5; if (tD >= 10){ tD = 10; playing = false; } } render(dt); }); lp.play();
  }
});

/* 3. Brassage génétique */
SFA.sim({
  id:"ub-c08-brassage", ch:"c08", tag:"Combinatoire",
  titre:"Brassage génétique : combien de gamètes différents ?",
  resume:"En métaphase I, chaque paire d'homologues s'oriente au hasard : touche les bivalents pour les faire basculer, forme les gamètes et remplis la galerie des 2ⁿ combinaisons.",
  but:"Touche un bivalent pour choisir quel homologue (maternel en rouge, paternel en bleu) part vers le pôle du gamète, puis « Former ce gamète ». « Méiose au hasard » tire toutes les orientations. Défi : obtiens tous les gamètes différents possibles (galerie complète).",
  aRetenir:"Brassage interchromosomique : n paires → 2<sup>n</sup> gamètes ; humain (n = 23) : 2²³ = 8 388 608. Chaque paire avec un crossing-over entre deux locus hétérozygotes fournit 4 types de chromatides au lieu de 2 : gamètes = 2<sup>n+c</sup>. Fécondation : (2<sup>n+c</sup>)² zygotes possibles, soit (2²³)² ≈ 7·10¹³ sans crossing-over.",
  piege:"« 2ⁿ » suppose que chaque paire est hétérozygote pour au moins un gène : le nombre réel de gamètes différents dépend de l'hétérozygotie. Le crossing-over n'a d'effet de brassage que s'il se produit entre deux locus hétérozygotes. Deux frères ont une probabilité (1/2)ⁿ de recevoir le même gamète d'un parent. Le dessin montre au plus 6 paires.",
  build:function(k,S){
    var pal = S.draw.palette, c = k.canvas(620), RED = "#c0392b", BLU = "#2563c9", rs = rng(3), st = [], found = {}, anim = -1, first = true, auto = false, key = "", geo = null, last = null;
    c.cv.style.touchAction = "manipulation";
    var n = k.slider("Paires de chromosomes n", 1, 23, 1, 3, "");
    var cc = k.slider("Paires avec un crossing-over informatif c", 0, 23, 1, 0, "");
    k.button("Méiose au hasard", function(){ if (anim < 0){ randomize(); anim = 0; } }, true);
    k.button("Former ce gamète", function(){ if (anim < 0) anim = 0; });
    var bA = k.button("▶ En continu", function(){ auto = !auto; if (auto && anim < 0){ randomize(); anim = 0; } });
    k.button("Vider la galerie", function(){ found = {}; last = null; });
    var ro = k.readouts(["Gamètes différents 2<sup>n+c</sup>", "Zygotes possibles", "P(gamète « tout maternel »)", "Galerie"]);
    var note = k.note("", "");
    function dims(){ var nd = Math.min(n.value, 6), cd = Math.min(cc.value, n.value, nd); return {nd:nd, cd:cd}; }
    function reset(){ var D = dims(); st = []; for (var i = 0; i < D.nd; i++) st.push({o:0, r:0}); found = {}; last = null; }
    function randomize(){ st.forEach(function(z, i){ z.o = rs() < 0.5 ? 0 : 1; z.r = i < dims().cd && rs() < 0.5 ? 1 : 0; }); }
    function code(){ var D = dims(); return st.map(function(z, i){ return z.o + (i < D.cd ? "" + z.r : ""); }).join(""); }
    c.pointer(function(t, p){
      if (t !== "down" || !geo || anim >= 0) return;
      for (var i = 0; i < geo.ys.length; i++){ if (Math.abs(p.y - geo.ys[i]) < geo.sp / 2 && Math.abs(p.x - geo.cx) < geo.rx * 0.7){ var z = st[i]; if (i < dims().cd){ var v = z.o * 2 + z.r + 1; z.o = (v >> 1) & 1; z.r = v & 1; } else z.o = 1 - z.o; k.redraw(); return; } }
    });
    function chromX(x, y, L, colA, colB, tipA, tipB){
      var ctx = c.ctx, w = Math.max(3, L * 0.2); ctx.save(); ctx.lineCap = "round";
      [[-1, colA, tipA], [1, colB, tipB]].forEach(function(q){ var sg = q[0]; ctx.strokeStyle = q[1]; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x + sg * L * 0.17, y - L / 2); ctx.quadraticCurveTo(x, y, x + sg * L * 0.17, y + L / 2); ctx.stroke();
        if (q[2]){ ctx.strokeStyle = q[2]; ctx.beginPath(); ctx.moveTo(x + sg * L * 0.17, y - L / 2); ctx.quadraticCurveTo(x + sg * L * 0.1, y - L * 0.3, x + sg * L * 0.06, y - L * 0.22); ctx.stroke(); } });
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.arc(x, y, w * 0.6, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    function mini(x, y, cd, nd, codeS, r){ /* gamète miniature */
      var ctx = c.ctx; ctx.save(); ctx.fillStyle = "#fffaf0"; ctx.strokeStyle = "#c7a96b"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.stroke();
      var j = 0, bw = Math.min(4, r * 1.4 / nd), sx = x - (nd - 1) * bw * 0.75;
      for (var i = 0; i < nd; i++){ var o = +codeS[j++], rr = i < cd ? +codeS[j++] : 0, col = o ? BLU : RED, xx = sx + i * bw * 1.5;
        ctx.strokeStyle = col; ctx.lineWidth = bw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(xx, y - r * 0.5); ctx.lineTo(xx, y + r * 0.5); ctx.stroke();
        if (rr){ ctx.strokeStyle = o ? RED : BLU; ctx.beginPath(); ctx.moveTo(xx, y - r * 0.5); ctx.lineTo(xx, y - r * 0.15); ctx.stroke(); } }
      ctx.restore();
    }
    function render(dt){
      var ctx = c.ctx, W = c.W, H = c.H, D = dims(), i;
      var kk = n.value + "|" + cc.value; if (kk !== key){ key = kk; reset(); if (first){ first = false; randomize(); anim = 0; } }
      if (anim >= 0){ anim += (dt || 0) / 1.6; if (anim >= 1){ var cd0 = code(); found[cd0] = 1; last = cd0; anim = -1; if (auto){ randomize(); anim = 0; } } }
      c.clear();
      /* ---- cellule en métaphase I / anaphase I ---- */
      var cx = W / 2, cy = 122, rx = Math.min(W * 0.46, 210), ry = 100, e = anim < 0 ? 0 : Math.min(1, anim / 0.6);
      var gr = ctx.createRadialGradient(cx - rx * .3, cy - ry * .3, 4, cx, cy, rx); gr.addColorStop(0, "#fffaf0"); gr.addColorStop(1, "#f3e6cc");
      ctx.fillStyle = gr; ctx.strokeStyle = "#c7a96b"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.fill(); ctx.stroke();
      S.draw.text(c, anim < 0 ? "Métaphase I : touche un bivalent pour le faire basculer" : "Anaphase I : les homologues migrent vers les pôles", W / 2, 10, {size:W < 420 ? 10 : 11.5, color:pal.ink});
      var pL = cx - rx * 0.86, pR = cx + rx * 0.86;
      S.draw.dot(c, pL, cy, 5, pal.amber); S.draw.dot(c, pR, cy, 5, pal.amber);
      S.draw.text(c, "pôle du gamète", pL + 4, cy + ry * 0.62, {size:9.5, color:"#8a6d1c", align:"left"});
      S.draw.line(c, cx, cy - ry * 0.85, cx, cy + ry * 0.85, "rgba(120,120,120,.35)", 1, [3, 4]);
      var sp = Math.min(48, ry * 1.6 / D.nd), L = Math.min(40, sp * 0.92), ys = [];
      for (i = 0; i < D.nd; i++){
        var y = cy - (D.nd - 1) * sp / 2 + i * sp, z = st[i], co = i < D.cd, dx = L * 0.42 + e * (rx * 0.55);
        ys.push(y);
        var leftCol = z.o ? BLU : RED, rightCol = z.o ? RED : BLU;
        ctx.save(); ctx.strokeStyle = "rgba(90,110,140,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pL, cy); ctx.lineTo(cx - dx, y); ctx.moveTo(pR, cy); ctx.lineTo(cx + dx, y); ctx.stroke(); ctx.restore();
        /* chromatide recombinante : pointe échangée ; z.r = 1 : la recombinante part dans le gamète */
        chromX(cx - dx, y, L, leftCol, leftCol, co && z.r ? rightCol : null, co && !z.r ? rightCol : null);
        chromX(cx + dx, y, L, rightCol, rightCol, co ? leftCol : null, null);
        if (co && e === 0) S.draw.text(c, "CO", cx, y - L * 0.55, {size:8.5, color:pal.violet});
      }
      geo = {ys:ys, sp:sp, cx:cx, rx:rx};
      if (n.value > D.nd) S.draw.text(c, D.nd + " paires dessinées sur " + n.value, cx + rx - 6, cy + ry - 8, {size:9.5, align:"right", color:pal.grey});
      /* gamète formé */
      if (anim > 0.6){ var u = (anim - 0.6) / 0.4; ctx.save(); ctx.globalAlpha = 0.6 * (1 - u); ctx.strokeStyle = pal.green; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx - L * 0.42 - rx * 0.55, cy, L, ry * 0.8, 0, 0, 6.2832); ctx.stroke(); ctx.restore(); }
      /* ---- galerie ---- */
      var tot = Math.pow(2, D.nd + D.cd), gy = 238, nf = Object.keys(found).length;
      S.draw.text(c, "Galerie des gamètes obtenus (" + nf + (tot <= 64 ? " / " + tot : "") + ")", 6, gy, {size:11, align:"left", color:pal.ink});
      var slotR = tot > 16 ? 10 : 13, cols = Math.max(1, Math.floor((W - 12) / (2 * slotR + 6))), gTop = gy + 22, rows = 0;
      if (tot <= 64){
        for (i = 0; i < tot; i++){ var bits = "", v = i; for (var q = 0; q < D.nd + D.cd; q++){ bits = (v & 1) + bits; v >>= 1; }
          var sx = 6 + slotR + (i % cols) * (2 * slotR + 6), sy = gTop + slotR + Math.floor(i / cols) * (2 * slotR + 6); rows = Math.floor(i / cols) + 1;
          if (found[bits]){ mini(sx, sy, D.cd, D.nd, bits, slotR); if (bits === last){ ctx.strokeStyle = pal.green; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, slotR + 3, 0, 6.2832); ctx.stroke(); } }
          else { ctx.strokeStyle = "#cfd6e0"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sx, sy, slotR, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]); }
        }
      } else { rows = 1; S.draw.text(c, "Trop de combinaisons pour une galerie (" + (tot < 1e6 ? tot.toLocaleString("fr-BE") : S.fmt(tot, 0)) + ") : " + nf + " gamètes différents obtenus.", 6, gTop + 12, {size:10.5, align:"left", color:pal.grey}); }
      /* ---- courbe ---- */
      var top = gTop + rows * (2 * slotR + 6) + 12, nn = n.value, ct = Math.min(cc.value, nn);
      var ax = axIn(S, c, {x:0, y:top, w:W, h:H - top}, {x0:0, x1:23, y0:0, y1:15, xl:"n (paires)", yl:"log₁₀(gamètes)", stepX:5, stepY:3, pt:16});
      S.draw.fn(c, ax, function(x){ return x * Math.log10(2); }, pal.acc, 2.4);
      S.draw.fn(c, ax, function(x){ return 2 * x * Math.log10(2); }, pal.violet, 2, [5, 4]);
      S.draw.text(c, "c = 0 : 2ⁿ", ax.X(18), ax.Y(18 * 0.301) + 14, {size:10.5, color:pal.acc, halo:"#fff"});
      S.draw.text(c, "c = n : 4ⁿ", ax.X(9), ax.Y(18 * 0.301) - 10, {size:10.5, color:pal.violet, halo:"#fff"});
      S.draw.dot(c, ax.X(nn), ax.Y((nn + ct) * Math.log10(2)), 6.5, pal.ink);
      var g = Math.pow(2, nn + ct);
      ro.set(0, g < 1e6 ? Math.round(g).toLocaleString("fr-BE") : S.sci(g, 2)); ro.set(1, S.sci(g * g, 2)); ro.set(2, "1/" + (Math.pow(2, nn) < 1e6 ? Math.pow(2, nn).toLocaleString("fr-BE") : S.sci(Math.pow(2, nn), 2)) + (ct ? " (1/" + (g < 1e6 ? Math.round(g).toLocaleString("fr-BE") : S.sci(g, 2)) + " avec CO)" : "")); ro.set(3, nf + (tot <= 64 ? " / " + tot : ""));
      bA.textContent = auto ? "⏸ Arrêter" : "▶ En continu";
      var ok = tot <= 64 && nf === tot && n.value === D.nd;
      note.set(ok ? "✓ <b>Galerie complète</b> : les " + tot + " gamètes possibles = 2<sup>" + (D.nd + D.cd) + "</sup>. Chaque paire double le nombre de combinaisons ; avec 23 paires, on dépasse 8 millions." + (cc.value > n.value ? " (c ramené à n)" : "")
        : n.value > 6 ? "◎ <b>Défi</b> : avec n = " + n.value + ", la galerie n'est plus dessinable. Ramène n à 3 ou 4 (et c à 0 ou 1) pour remplir la galerie complète." : "◎ <b>Défi</b> : obtiens les " + tot + " gamètes différents. Fais basculer les bivalents puis « Former ce gamète » : c'est plus rapide que le hasard ! " + (D.cd ? "Bivalent avec crossing-over : 4 états (chromatide parentale ou recombinante)." : ""), ok ? "ok" : "");
    }
    k.draw(function(){ render(0); });
    var lp = k.loop(function(dt){ render(dt); }); lp.play();
  }
});

/* 4. Non-disjonction et caryotype */
SFA.sim({
  id:"ub-c08-caryotype", ch:"c08", tag:"Anomalies",
  titre:"Non-disjonction : trisomie 21, syndromes de Turner et de Klinefelter",
  resume:"Quels gamètes, quels caryotypes selon la méiose touchée et le parent ?",
  but:"Choisis la paire concernée, le parent, la division où la non-disjonction se produit, clique un gamète pour voir le zygote obtenu avec un gamète normal.",
  aRetenir:"Non-disjonction en méiose I : les 4 gamètes sont anormaux (2 avec n+1, 2 avec n−1). En méiose II : 2 gamètes normaux, 1 n+1, 1 n−1. Après fécondation par un gamète normal : trisomie (2n+1) ou monosomie (2n−1). Monosomie autosomique : non viable ; syndrome de Turner 45,X ; Klinefelter 47,XXY ; trisomie 21 : 47,+21.",
  piege:"Le gamète n+1 d'une non-disjonction en méiose I contient les deux homologues (parfois différents : mère-père) ; en méiose II il contient deux chromatides sœurs identiques. Une monosomie 45,Y (sans X) n'est pas viable : le X porte des gènes essentiels.",
  build:function(k,S){
    var c = k.canvas(400), pal = S.draw.palette, B = S.bio, sel = 0, hit = [];
    var pr = k.seg("Paire", [["a","Chromosome 21"],["g","Paire sexuelle"]], "a");
    var pa = k.seg("Parent qui subit l'erreur", [["m","Mère (XX)"],["p","Père (XY)"]], "m");
    var dv = k.seg("Division", [["1","Méiose I"],["2","Méiose II"]], "1");
    var xy = k.seg("Père, méiose II : cellule II portant", [["X","X"],["Y","Y"]], "X");
    var ro = k.readouts(["Gamètes anormaux sur 4","Syndrome(s) viable(s)"]);
    var note = k.note("", "ok");
    c.pointer(function(t, p){ if (t === "down") hit.forEach(function(h){ if (Math.hypot(p.x - h.x, p.y - h.y) < h.r){ sel = h.i; k.redraw(); } }); });
    function glyphs(list, cx, cy, sc){ /* list : [{t:"21"|"X"|"Y", col}] */
      var n = list.length, w = 20 * sc;
      list.forEach(function(g, q){ var x = cx + (q - (n - 1) / 2) * w, L = (g.t === "Y" ? 18 : g.t === "X" ? 30 : 22) * sc; B.chrom(c, x, cy, L, g.col, {dbl:false, w:Math.max(3.5, 5.5 * sc)});
        S.draw.text(c, g.t, x, cy + L / 2 + 8 * sc, {size:Math.max(8, 9.5 * sc), color:g.col, weight:800}); }); }
    function frame(){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear(); B.bg(c, "#fbfdff", "#eef3f9");
      var g;
      /* gamètes du parent : [libellé, nombre sur 4, nature (n normal, + excès, - manque), composition] */
      if (pr.value === "a") g = dv.value === "1" ? [["21 + 21",2,"+","21"],["aucun 21",2,"-",""]] : [["21 + 21 (chromatides sœurs)",1,"+","21"],["aucun 21",1,"-",""],["21 (normal)",2,"n","21"]];
      else if (pa.value === "m") g = dv.value === "1" ? [["XX",2,"+","XX"],["O (sans X)",2,"-",""]] : [["XX (sœurs)",1,"+","XX"],["O",1,"-",""],["X (normal)",2,"n","X"]];
      else if (dv.value === "1") g = [["XY",2,"+","XY"],["O",2,"-",""]];
      else g = xy.value === "X" ? [["XX (sœurs)",1,"+","XX"],["O",1,"-",""],["Y (normal)",2,"n","Y"]] : [["YY (sœurs)",1,"+","YY"],["O",1,"-",""],["X (normal)",2,"n","X"]];
      var partners = pr.value === "a" ? [["21",1]] : pa.value === "m" ? [["X",.5],["Y",.5]] : [["X",1]];
      var partners = pr.value === "a" ? [["21",1]] : pa.value === "m" ? [["X",.5],["Y",.5]] : [["X",1]];
      var viab = {}, gam = [];
      g.forEach(function(gm){ for (var q = 0; q < gm[1]; q++) gam.push(gm); });
      if (sel >= gam.length) sel = 0;
      var colA = pal.red, colB = pal.acc;
      function content(gm){ var out = [];
        if (pr.value === "a"){ if (gm[2] === "n") out = [{t:"21", col:colA}]; else if (gm[2] === "+") out = dv.value === "1" ? [{t:"21", col:colA}, {t:"21", col:colB}] : [{t:"21", col:colA}, {t:"21", col:colA}]; }
        else { gm[3].split("").forEach(function(ch, q){ out.push({t:ch, col:ch === "Y" ? pal.teal : (q ? colB : pal.pink)}); }); }
        return out; }
      S.draw.text(c, "Les 4 gamètes du parent touché (clique pour en choisir un)", W / 2, 18, {size:11.5, color:pal.ink});
      var gw = W / 4, gy = 80, gr = Math.min(gw * .42, 46); hit = [];
      gam.forEach(function(gm, q){ var gx = gw * (q + .5), bad = gm[2] !== "n";
        ctx.fillStyle = bad ? "rgba(224,122,122,.16)" : "rgba(168,210,240,.3)"; ctx.strokeStyle = q === sel ? pal.ink : (bad ? pal.red : pal.acc); ctx.lineWidth = q === sel ? 3 : 1.8; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, 7); ctx.fill(); ctx.stroke();
        if (!content(gm).length) S.draw.text(c, "aucun " + (pr.value === "a" ? "21" : "X/Y"), gx, gy, {size:10, color:pal.grey}); glyphs(content(gm), gx, gy - 4, Math.min(1.2, gr / 40)); S.draw.text(c, gm[2] === "n" ? "n" : gm[2] === "+" ? "n + 1" : "n − 1", gx, gy + gr + 14, {size:11, color:bad ? pal.red : pal.green}); hit.push({x:gx, y:gy, r:gr, i:q}); });
      /* flèche et zygote */
      var gm0 = gam[sel], zy = H * .66, ny = gw * (sel + .5);
      S.draw.arrow(c, ny, gy + gr + 26, W / 2, zy - 52, pal.grey, 2);
      S.draw.text(c, "+ gamète normal de l'autre parent", W * .62, (gy + gr + 26 + zy - 52) / 2 + 2, {size:10.5, color:pal.grey, bg:"rgba(255,255,255,.85)"});
      var rows = [];
      partners.forEach(function(pt){
        var res, col;
        if (pr.value === "a"){ if (gm0[2] === "n"){ res = "46 normal"; col = pal.green; } else if (gm0[2] === "+"){ res = "47,+21 : trisomie 21"; viab[res] = 1; col = pal.amber; } else { res = "45,−21 : monosomie 21 (non viable)"; col = pal.red; } }
        else { var comb = (gm0[3] + pt[0]).split("").sort().join(""); var tbl = {"XX":"46,XX normal","XY":"46,XY normal","XXX":"47,XXX (triple X)","XXY":"47,XXY : Klinefelter","XYY":"47,XYY","X":"45,X : Turner","Y":"45,Y (non viable)"}; res = tbl[comb] || comb; if (/Turner|Klinefelter|triple|XYY/.test(res)){ viab[res] = 1; col = pal.amber; } else col = /normal/.test(res) ? pal.green : pal.red; }
        rows.push([pt, res, col]);
      });
      var nz = rows.length, zr = 44;
      rows.forEach(function(r, q){ var zx = W / 2 + (q - (nz - 1) / 2) * Math.min(W * .4, 190);
        var zc = content(gm0).concat(r[0][0] === "21" ? [{t:"21", col:pal.violet}] : [{t:r[0][0], col:r[0][0] === "Y" ? pal.teal : pal.pink}]);
        if (pr.value === "a") { } else { zc = content(gm0).concat([{t:r[0][0], col:r[0][0] === "Y" ? pal.teal : "#d99ab8"}]); }
        ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.strokeStyle = r[2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(zx, zy, zr, 0, 7); ctx.fill(); ctx.stroke();
        glyphs(zc, zx, zy - 4, Math.min(1, 1.5 / Math.max(1, zc.length - 1) + .15)); S.draw.label(c, r[1], zx, zy + zr + 24, {color:r[2], size:11}); if (nz > 1) S.draw.text(c, "gamète " + r[0][0] + (nz > 1 ? " (" + r[0][1] * 100 + " %)" : ""), zx, zy - zr - 10, {size:10, color:pal.grey}); });
      S.draw.text(c, W < 520 ? "Seule la paire étudiée est représentée" : "Zygote : la paire étudiée est représentée seule (les 22 autres paires sont normales)", W / 2, H - 12, {size:10, color:pal.grey});
      var bad = gam.filter(function(q){ return q[2] !== "n"; }).length, v = Object.keys(viab);
      ro.set(0, bad + " / 4"); ro.set(1, v.length ? v.join(" ; ") : "aucun (monosomie ou normal)");
      note.set(dv.value === "1" ? "Non-disjonction en méiose I : les deux homologues vont ensemble dans la même cellule fille : 4 gamètes anormaux." : "Non-disjonction en méiose II : les deux chromatides sœurs ne se séparent pas : 2 gamètes normaux, 1 n+1, 1 n−1.", "ok");
    }
    k.draw(frame);
  }
});

/* 5. Gamétogenèse et développement précoce */
SFA.sim({
  id:"ub-c08-gametogenese-embryon", ch:"c08", tag:"Embryologie",
  titre:"Gamétogenèse et premiers jours du développement",
  resume:"Spermatogenèse, ovogenèse (blocages) et chronologie de la fécondation à la gastrulation.",
  but:"Choisis une filière et fais avancer le curseur : ploïdie, quantité d'ADN, nombre de cellules et événements.",
  aRetenir:"Spermatogenèse : 1 spermatocyte I → 4 spermatozoïdes. Ovogenèse : 1 ovocyte I → 1 ovule + 2 ou 3 globules polaires (selon que le 1<sup>er</sup> se divise ou non) ; l'ovocyte I est bloqué en prophase I jusqu'à l'ovulation, puis l'ovocyte II en métaphase II jusqu'à la fécondation. Segmentation : divisions rapides sans croissance (blastomères de plus en plus petits), morula vers J4, blastocyste vers J5, implantation vers J6–7, gastrulation en 3<sup>e</sup> semaine : ectoderme, mésoderme, endoderme.",
  piege:"L'ovule « achève » sa méiose II seulement à la fécondation : l'ovocyte II ovulé n'est pas un gamète mûr. Les jours donnés sont des ordres de grandeur (J0 = fécondation, développement humain) et le nombre de cellules après J5 n'est pas une puissance de 2 exacte.",
  build:function(k,S){
    var c = k.canvas(340), pal = S.draw.palette, P = pal;
    var mode = k.seg("Filière", [["sp","Spermatogenèse"],["ov","Ovogenèse"],["em","Embryon précoce"]], "sp");
    var av = k.slider("Avancement", 0, 100, 1, 0, "%");
    var ro = k.readouts(["Stade","Ploïdie","ADN","Cellules"]);
    var note = k.note("", "ok");
    var SP = [["Spermatogonie (puberté : mitoses)","2n","2c",1,"Réserve de cellules souches, divisions mitotiques."],["Spermatocyte I (après S)","2n","4c",1,"Prophase I : bivalents, crossing-over."],["Spermatocytes II (fin méiose I)","n","2c",2,"Chaque cellule a n chromosomes à 2 chromatides."],["Spermatides (fin méiose II)","n","1c",4,"Quatre cellules haploïdes, ensuite spermiogenèse."],["Spermatozoïdes","n","1c",4,"Cellules mobiles, flagelle, acrosome."]];
    var OV = [["Ovogonie (vie fœtale : mitoses)","2n","2c",1,"Multiplication avant la naissance."],["Ovocyte I (bloqué en prophase I)","2n","4c",1,"Bloqué depuis la vie fœtale jusqu'à la puberté."],["Ovocyte II + 1<sup>er</sup> globule polaire (ovulation)","n","2c",2,"Méiose I achevée à l'ovulation ; blocage en métaphase II."],["Fécondation : ovule + 2<sup>e</sup> globule polaire","n","1c",2,"La méiose II s'achève sous l'effet de la fécondation (+ éventuel 1<sup>er</sup> globule divisé)."],["Zygote (J0)","2n","2c",1,"Rencontre des pronoyaux n + n."]];
    var EM = [["J0 · Zygote","2n","2c",1,"Fécondation dans l'ampoule de la trompe."],["J1 · 2 blastomères","2n","2c",2,"Segmentation : cellules plus petites, sans croissance."],["J2 · 4 blastomères","2n","2c",4,""],["J3 · 8 à 16 cellules","2n","2c",8,"Compaction vers 8 cellules."],["J4 · Morula (≈ 16–32)","2n","2c",16,"Boule pleine de cellules."],["J5 · Blastocyste (≈ 100)","2n","2c",64,"Bouton embryonnaire et trophoblaste."],["J6–7 · Implantation","2n","2c",64,"Nidation dans l'endomètre."],["Semaine 2 · Disque bilaminaire","2n","2c",64,"Épiblaste et hypoblaste."],["Semaine 3 · Gastrulation","2n","2c",64,"Ectoderme, mésoderme, endoderme."]];
    var B = S.bio, tt = 0, sc0 = 1;
    function gcell(x, y, r, kind, alpha){
      var ctx = c.ctx; ctx.save(); if (alpha != null) ctx.globalAlpha = alpha;
      if (kind === "spz"){ /* spermatozoïde */
        ctx.strokeStyle = "#7a8aa5"; ctx.lineWidth = Math.max(2, r * .12); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - r * .6, y); for (var q = 1; q <= 10; q++) ctx.lineTo(x - r * .6 - q * r * .2, y + Math.sin(q * .9 + tt * 6) * r * .2 * (q / 10)); ctx.stroke();
        B.ball(c, x, y, r * .55, P.acc); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.ellipse(x + r * .38, y, r * .22, r * .36, 0, 0, 7); ctx.fill(); }
      else if (kind === "pb"){ B.ball(c, x, y, r * .5, "#aab5c5"); }
      else { var col = kind === "ovule" ? "#fdeedb" : kind === "ovo" ? "#fff3e0" : "#e4edfb";
        var g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, "#ffffff"); g.addColorStop(1, col);
        ctx.fillStyle = g; ctx.strokeStyle = kind === "ovule" || kind === "ovo" ? "#d9a45a" : "#7a9ad6"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
        B.ball(c, x, y, r * .45, kind === "ovule" || kind === "ovo" ? "#e8b94a" : P.acc); }
      ctx.restore(); }
    function frame(dt){
      var ctx = c.ctx, W = c.W, H = c.H; c.clear(); B.bg(c, "#fbfdff", "#eef3f9"); tt += dt;
      var L = mode.value === "sp" ? SP : mode.value === "ov" ? OV : EM, i = Math.min(L.length - 1, Math.floor(av.value / 100 * L.length)), st = L[i];
      var N = st[3], cx = W / 2, cy = H * .46, md = mode.value;
      S.draw.text(c, st[0].replace(/<[^>]+>/g, ""), cx, 20, {size:13.5, color:P.ink});
      /* barre de progression de la filière */
      var px0 = 30, pw = W - 60; ctx.strokeStyle = "#c8d1de"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px0, H - 44); ctx.lineTo(px0 + pw, H - 44); ctx.stroke();
      for (var q = 0; q < L.length; q++){ var xx = px0 + pw * q / (L.length - 1); B.ball(c, xx, H - 44, q === i ? 7 : 4.5, q <= i ? P.acc : "#c8d1de"); }
      if (md === "sp"){
        var kind = i >= L.length - 1 ? "spz" : "sp", n = N, rr = Math.min(34, W / (n * 2.6 + 1));
        for (q = 0; q < n; q++) gcell(cx + (q - (n - 1) / 2) * Math.min(W * .22, 100), cy, kind === "spz" ? 26 : (n === 1 ? 40 : rr + 12), kind, 1);
      } else if (md === "ov"){
        var big = i >= 3 ? "ovule" : "ovo"; gcell(cx - (N > 1 ? 40 : 0), cy, i >= 3 ? 52 : 46, big);
        for (q = 1; q < N; q++) gcell(cx + 30 + q * 26, cy - 24 + (q % 2) * 40, 22, "pb");
        if (N > 1) S.draw.text(c, "globules polaires", cx + 62, cy + 62, {size:10, color:P.grey});
      } else {
        var cnt = Math.min(N, 64), R = Math.min(H * .3, W * .26) + (i >= 5 ? 14 : 0), g0 = ctx.createRadialGradient(cx, cy, R * .5, cx, cy, R + 14);
        ctx.strokeStyle = "rgba(200,170,110,.7)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R + 12, 0, 7); ctx.stroke(); ctx.fillStyle = "rgba(253,240,215,.5)"; ctx.fill();
        var sz = Math.max(5, Math.min(26, R * 1.5 / Math.sqrt(cnt)));
        if (i >= 5){ /* blastocyste : trophoblaste en anneau + bouton embryonnaire */
          ctx.fillStyle = "rgba(200,225,250,.55)"; ctx.beginPath(); ctx.arc(cx, cy, R - 6, 0, 7); ctx.fill();
          for (var j = 0; j < 36; j++){ var an = j * 6.2832 / 36; B.ball(c, cx + (R - 6) * Math.cos(an), cy + (R - 6) * Math.sin(an), 6, "#6fb0e2"); }
          for (j = 0; j < 9; j++) B.ball(c, cx - R * .45 + (j % 3) * 11 + (j > 5 ? 5 : 0), cy - R * .15 + Math.floor(j / 3) * 11, 6.5, i >= 8 ? ["#e8908a", "#78c4a0", P.acc][j % 3] : "#c3a8f0");
          S.draw.label(c, "trophoblaste", cx + R * .55, cy + R * .78, {size:10, color:"#2c6fa8"}); S.draw.label(c, "bouton embryonnaire", cx - R * .5, cy - R * .62, {size:10, color:P.violet});
        } else for (j = 0; j < cnt; j++){ var ang = j * 2.399963, rad = cnt === 1 ? 0 : Math.sqrt((j + .5) / cnt) * (R - sz / 2); B.ball(c, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, cnt === 1 ? R * .85 : sz, i >= 8 ? ["#e8908a", "#78c4a0", P.acc][j % 3] : "#9bb8e8"); }
      }
      S.draw.text(c, st[4].replace(/<[^>]+>/g, ""), cx, H - 20, {size:11, color:P.grey});
      ro.set(0, st[0].replace(/<[^>]+>/g, "").split("(")[0]); ro.set(1, st[1]); ro.set(2, st[2]); ro.set(3, md === "em" && i >= 5 ? "≈ 100 et plus" : N);
      note.set(md === "ov" ? "Un seul gamète fonctionnel : le cytoplasme est conservé dans l'ovule, les globules polaires dégénèrent." : md === "sp" ? "Quatre gamètes par cellule initiale, production continue après la puberté." : "Le nombre de cellules double à chaque division, mais l'embryon ne grossit pas avant l'implantation.", "ok");
    }
    k.button("▶ Faire défiler", function(){ av.set(0); (function go(v){ if (!k._alive) return; if (v <= 100){ av.set(v); k.redraw(); setTimeout(function(){ go(v + 2); }, 90); } })(0); }, true);
    k.draw(function(){ frame(0); });
    var lp = k.loop(function(dt){ if (mode.value === "sp") frame(dt); }); lp.play();
  }
});
})();

/* BIO3D-BEGIN:s_c08_mitose.js */
(function(){
var P = function(S){ return S.draw.palette; };
/* --- moteur 3D maison (projection perspective, tri en profondeur, rotation à la souris) --- */
function hx(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function sh(h, f, a){ var q = hx(h); return "rgba(" + q.map(function(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }).join(",") + "," + (a === undefined ? 1 : a) + ")"; }
function V3(c, S, o){
  o = o || {};
  var v = {yaw:o.yaw === undefined ? 0.5 : o.yaw, pit:o.pit === undefined ? 0.3 : o.pit, D:o.D || 8, sc:o.sc || 60, ox:0, oy:0, auto:o.auto !== false, q:[], moved:false}, last = null, d0 = null;
  c.pointer(function(t, p){
    if (t === "down"){ last = p; d0 = p; v.auto = false; v.moved = false; }
    else if (t === "drag" && last){ if (Math.abs(p.x - d0.x) + Math.abs(p.y - d0.y) > 5) v.moved = true; v.yaw += (p.x - last.x) * 0.01; v.pit = Math.max(-1.45, Math.min(1.45, v.pit + (p.y - last.y) * 0.01)); last = p; }
    else if (t === "up"){ last = null; if (!v.moved && v.onclick) v.onclick(p); }
  });
  v.P = function(x, y, z){
    var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pit), sp = Math.sin(v.pit);
    var X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var f = v.D / (v.D - Z);
    return {x:c.W / 2 + v.ox + X * f * v.sc, y:c.H / 2 + v.oy - Y * f * v.sc, z:Z, f:f};
  };
  v.add = function(z, fn){ v.q.push([z, fn]); };
  v.flush = function(){ v.q.sort(function(a, b){ return a[0] - b[0]; }); for (var i = 0; i < v.q.length; i++) v.q[i][1](); v.q = []; };
  v.ball = function(x, y, z, r, col, al){
    var p = v.P(x, y, z), R = Math.max(1, r * p.f * v.sc);
    v.add(p.z, function(){
      var g = c.ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      g.addColorStop(0, sh(col, 0.55, al)); g.addColorStop(0.55, sh(col, 0, al)); g.addColorStop(1, sh(col, -0.4, al));
      c.ctx.fillStyle = g; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R, 0, 6.2832); c.ctx.fill();
    });
    p.R = R; return p;
  };
  v.seg = function(a, b, w, col, al, dash){
    var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]);
    v.add((p.z + q.z) / 2 - 0.001, function(){
      var x = c.ctx; x.lineCap = "round"; x.strokeStyle = sh(col, 0, al); x.lineWidth = Math.max(1, w * (p.f + q.f) / 2 * v.sc);
      if (dash) x.setLineDash(dash);
      x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
      if (!dash && w * v.sc > 6){ x.strokeStyle = sh(col, 0.5, al); x.lineWidth = x.lineWidth * 0.35; x.beginPath(); x.moveTo(p.x - 1, p.y - 1); x.lineTo(q.x - 1, q.y - 1); x.stroke(); }
      if (dash) x.setLineDash([]);
    });
  };
  v.label = function(txt, x, y, z, col, size, bg){
    var p = v.P(x, y, z);
    v.add(p.z + 50, function(){ S.draw.text(c, txt, p.x, p.y, {size:size || 11, color:col || "#0f1b2d", weight:700, bg:bg}); });
  };
  v.spin = function(dt){ if (v.auto) v.yaw += dt * 0.35; };
  return v;
}

SFA.sim({
  id:"ub-c08-3d-mitose-fuseau", ch:"c08", tag:"Mitose · 3D",
  titre:"La mitose en 3D : chromosomes, fuseau et cytocinèse",
  resume:"Une cellule 2n = 6 qui se divise, avec son fuseau, ses kinétochores et la séparation des chromatides : joue la division, bloque-la, fais-la rater.",
  but:"Fais défiler la division avec le curseur (ou en lecture), tourne la cellule, puis teste le nocodazole (poison du fuseau) ou une non-disjonction : compte les chromosomes de chaque cellule fille.",
  aRetenir:"Prophase : condensation, rupture de l'enveloppe nucléaire (en fin de prophase), centrosomes aux pôles. Prométaphase : les microtubules du fuseau s'attachent aux kinétochores. Métaphase : alignement sur la plaque. Anaphase : la séparase coupe la cohésine, les chromatides sœurs migrent vers les pôles. Télophase : décondensation, enveloppes nucléaires, cytocinèse. Quantité d'ADN : 4c de la fin de S à l'anaphase (2n = 6 chromosomes à 2 chromatides), 2c dans chaque cellule fille (6 chromosomes à 1 chromatide).",
  piege:"Le nombre de chromosomes ne double pas en anaphase « en réalité » : on compte un chromosome par centromère, donc il passe de 6 à 12 chromosomes dans la cellule entière, alors que la quantité d'ADN reste 4c jusqu'à la cytocinèse. Les chromatides sœurs sont identiques (sauf mutation) : ce n'est pas le brassage de la méiose. Le point de contrôle du fuseau empêche l'anaphase tant que tous les kinétochores ne sont pas attachés. Taille des chromosomes et durée très schématiques.",
  build:function(k,S){
    var c = k.canvas(420), pal = P(S), v = V3(c, S, {yaw:0.35, pit:0.3, D:11, sc:50});
    var prog = k.slider("Progression de la division", 0, 100, 0.5, 4, "%");
    var cond = k.seg("Condition", [["n","Normale"],["m","Nocodazole"],["d","Non-disjonction"]], "n");
    var fib = k.toggle("Montrer le fuseau", true);
    var spd = k.slider("Vitesse de lecture", 0.2, 3, 0.1, 1, "×");
    var ro = k.readouts(["Phase", "Chromosomes", "Chromatides", "ADN par cellule"]);
    var info = k.note("", "ok");
    var playing = true, tt = 0, seed = 21;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function ss(a, b, u){ var x = Math.max(0, Math.min(1, (u - a) / (b - a))); return x * x * (3 - 2 * x); }
    var SZ = [1.0, 1.0, 0.8, 0.8, 0.55, 0.55], COL = ["#2563eb", "#dc2626", "#2563eb", "#dc2626", "#2563eb", "#dc2626"];
    var chr = [];
    for (var i = 0; i < 6; i++){
      var a = rnd() * 6.28, b = Math.acos(2 * rnd() - 1), rr = 0.35 + rnd() * 0.4;
      var a2 = rnd() * 6.28, b2 = Math.acos(2 * rnd() - 1), r2 = 0.5 + rnd() * 1.1, ea = rnd() * 6.28, eb = Math.acos(2 * rnd() - 1);
      var ph = i / 6 * 6.2832, rp = (i % 2) ? 0.95 : 0.5;
      chr.push({S:[rr * Math.sin(b) * Math.cos(a) * 0.9, rr * Math.cos(b), rr * Math.sin(b) * Math.sin(a)], W:[r2 * Math.sin(b2) * Math.cos(a2) * 1.3, r2 * Math.cos(b2), r2 * Math.sin(b2) * Math.sin(a2)],
        M:[0, rp * Math.cos(ph), rp * Math.sin(ph)], E0:[Math.sin(eb) * Math.cos(ea), Math.cos(eb), Math.sin(eb) * Math.sin(ea)], R:[0, Math.cos(ph), Math.sin(ph)], ph:rnd() * 6.28});
    }
    function norm(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
    function phase(u){
      return u < 0.1 ? "Interphase (G2)" : u < 0.27 ? "Prophase" : u < 0.42 ? "Prométaphase" : u < 0.56 ? "Métaphase" : u < 0.7 ? "Anaphase" : u < 0.82 ? "Télophase" : "Cytocinèse";
    }
    function R(){
      c.clear(); v.sc = Math.min(56, c.W / 8.2);
      var cd = cond.value, u0 = prog.value / 100, u = cd === "m" ? Math.min(u0, 0.40) : u0;
      var cnd = ss(0.08, 0.28, u) * (1 - 0.8 * ss(0.74, 0.92, u));
      var A = ss(0.57, 0.67, u), Bv = ss(0.62, 0.76, u), Tel = ss(0.76, 0.95, u), Pinch = ss(0.74, 0.97, u);
      var Px = 0.35 + 1.65 * ss(0.06, 0.4, u) + 0.7 * Bv, aC = 2.9 + 0.9 * Bv;
      /* cellule : maillage ellipsoïdal pincé au milieu */
      var rad = function(x){ var q = 1 - (x / aC) * (x / aC); if (q <= 0) return 0; return 2.05 * Math.sqrt(q) * (1 - 0.85 * Pinch * Math.exp(-(x * x) / 0.35)); };
      var NX = 14, th, j;
      for (var ix = 1; ix < NX; ix++){ var x = -aC + 2 * aC * ix / NX, r = rad(x); for (j = 0; j < 20; j++){ var t1 = j / 20 * 6.2832, t2 = (j + 1) / 20 * 6.2832; v.seg([x, r * Math.cos(t1), r * Math.sin(t1)], [x, r * Math.cos(t2), r * Math.sin(t2)], 0.02, "#16a34a", 0.3); } }
      for (j = 0; j < 8; j++){ th = j / 8 * 6.2832; for (ix = 0; ix < 20; ix++){ var xa = -aC + 2 * aC * (ix + 0.02) / 20, xb = -aC + 2 * aC * (ix + 0.98) / 20, ra = rad(xa), rb = rad(xb); v.seg([xa, ra * Math.cos(th), ra * Math.sin(th)], [xb, rb * Math.cos(th), rb * Math.sin(th)], 0.02, "#16a34a", 0.3); } }
      /* enveloppes nucléaires */
      function env(cx, rr, al, col){ if (al < 0.03) return; for (var q = 0; q < 3; q++){ for (var m = 0; m < 22; m++){ var t1 = m / 22 * 6.2832, t2 = (m + 1) / 22 * 6.2832, yy = (q - 1) * rr * 0.6, r3 = Math.sqrt(rr * rr - yy * yy);
        v.seg([cx + r3 * Math.cos(t1), yy, r3 * Math.sin(t1)], [cx + r3 * Math.cos(t2), yy, r3 * Math.sin(t2)], 0.03, col, al);
        v.seg([cx + yy, r3 * Math.cos(t1), r3 * Math.sin(t1)], [cx + yy, r3 * Math.cos(t2), r3 * Math.sin(t2)], 0.02, col, al * 0.6); } } }
      env(0, 1.15, 1 - ss(0.18, 0.30, u), "#3b5fc0");
      env(-1.9 - 0.4 * Bv, 0.95, Tel, "#3b5fc0"); env(1.9 + 0.4 * Bv, 0.95, Tel, "#3b5fc0");
      /* centrosomes + asters */
      [-1, 1].forEach(function(sg){
        var px = sg * Px; v.ball(px, 0, 0, 0.16, "#7c3aed");
        if (u > 0.2) for (var q = 0; q < 7; q++){ var aa = q / 7 * 6.2832, bb = 0.8 + q * 0.4; v.seg([px, 0, 0], [px + sg * 0.35, 0.35 * Math.cos(aa), 0.35 * Math.sin(aa)], 0.015, "#a78bfa", 0.6); }
      });
      var fiberOn = fib.value && cd !== "m" && u > 0.27 && u < 0.78;
      var attach = ss(0.28, 0.46, u), nd = 0, left = 0, right = 0;
      /* chromosomes */
      chr.forEach(function(ch, i){
        var sz = SZ[i], base, e, sep = 0;
        var go = ss(0.28, 0.52, u), bump = Math.sin(Math.PI * go);
        if (cd === "m") go = ss(0.28, 0.42, u) * 0.12 + 0;
        base = [ch.S[0] * (1 - go) + ch.M[0] * go + ch.W[0] * bump * 0.5, ch.S[1] * (1 - go) + ch.M[1] * go + ch.W[1] * bump * 0.5, ch.S[2] * (1 - go) + ch.M[2] * go + ch.W[2] * bump * 0.5];
        if (cd === "m" && u > 0.28){ var f0 = ss(0.28, 0.4, u); base = [ch.S[0] * (1 - f0) + ch.W[0] * f0 * 1.1, ch.S[1] * (1 - f0) + ch.W[1] * f0 * 1.1, ch.S[2] * (1 - f0) + ch.W[2] * f0 * 1.1]; }
        var pg = ss(0.34, 0.5, u); e = norm([ch.E0[0] * (1 - pg) + ch.R[0] * pg, ch.E0[1] * (1 - pg) + ch.R[1] * pg, ch.E0[2] * (1 - pg) + ch.R[2] * pg]);
        var L = 1.45 * sz, nondisj = (cd === "d" && i === 2);
        var sc = 1 - 0.35 * A - 0.2 * Tel;
        for (var s2 = -1; s2 <= 1; s2 += 2){
          var pole = nondisj ? 1 : s2;
          var Kx = base[0] + (A > 0 ? pole * (0.14 + 1.25 * A + 0.35 * Bv + 0.3 * Tel) : 0), off = (A > 0 && !nondisj) ? 0 : s2 * 0.07 * (u > 0.1 ? 1 : 0.5);
          if (nondisj && A > 0) off = s2 * 0.09;
          var K = [Kx + off, base[1] * (A > 0 ? sc : 1), base[2] * (A > 0 ? sc : 1)], V = A * 0.85 * (1 - 0.5 * Tel);
          var prev = null, w = 0.04 + 0.09 * cnd, wob = (1 - cnd) * 0.3;
          for (var q = 0; q <= 6; q++){
            var t = -0.35 * L + q / 6 * L, at = Math.abs(t);
            var P0 = [K[0] + (-pole) * at * V + (A > 0 ? 0 : s2 * 0.1 * at / L * cnd) + wob * Math.sin(t * 6 + ch.ph + tt * 1.3) * 0.5, K[1] + e[1] * t * (1 - V) + wob * Math.sin(t * 5 + ch.ph * 2 + tt) * 0.5, K[2] + e[2] * t * (1 - V) + wob * Math.cos(t * 4 + ch.ph + tt * 1.1) * 0.5];
            if (prev) v.seg(prev, P0, w, COL[i], 0.95);
            prev = P0;
          }
          v.ball(K[0], K[1], K[2], 0.1, "#f59e0b");
          if (fiberOn && attach > i * 0.14 + 0.05 && !(cd === "m")) v.seg([pole * Px, 0, 0], K, 0.022, "#7c3aed", 0.6);
          if (A > 0.6) { if (K[0] > 0) right++; else left++; }
        }
      });
      v.flush();
      /* lecture des résultats */
      var ph = phase(u), nChr = u < 0.57 ? 6 : 12, nChd = u < 0.57 ? 12 : 12, dna = u < 0.85 ? "4c" : "2c (par fille)";
      var msg = "";
      if (u >= 0.85){
        if (cd === "d") { nChr = "7 et 5"; nChd = "7 et 5"; dna = "≈ 2,3c et 1,7c"; msg = "Non-disjonction : les deux chromatides du chromosome 3 sont parties vers le même pôle : une fille a 7 chromosomes (trisomie), l'autre 5 (monosomie) : aneuploïdie."; }
        else { nChr = "6 + 6"; nChd = "6 + 6"; msg = "Deux cellules filles identiques à la cellule mère : 2n = 6 chromosomes, 2c d'ADN chacune."; }
      }
      if (cd === "m" && u0 > 0.4) { ph = "Prométaphase (bloquée)"; nChr = 6; nChd = 12; dna = "4c"; msg = "Nocodazole : le fuseau ne se forme pas, les kinétochores ne s'attachent pas, le point de contrôle du fuseau bloque la cellule avant l'anaphase (c'est le principe de certaines chimiothérapies)."; }
      if (!msg) msg = u < 0.1 ? "Les chromosomes sont répliqués (2 chromatides sœurs chacun) mais décondensés : on ne les voit pas distinctement. Les centrosomes sont dupliqués." : u < 0.27 ? "Les chromosomes se condensent ; les deux centrosomes migrent vers les pôles ; l'enveloppe nucléaire se désagrège." : u < 0.42 ? "Les microtubules du fuseau capturent les kinétochores (un par chromatide), chaque chromosome est attaché aux deux pôles." : u < 0.56 ? "Tous les chromosomes sont alignés sur la plaque équatoriale, sous tension : le point de contrôle est satisfait." : u < 0.7 ? "La séparase clive la cohésine : les chromatides sœurs deviennent des chromosomes fils et sont tirées vers les pôles (anaphase A) ; les pôles s'écartent (anaphase B)." : "Décondensation, nouvelles enveloppes nucléaires, l'anneau d'actine-myosine pince la cellule (cytocinèse).";
      ro.set(0, ph); ro.set(1, nChr); ro.set(2, nChd); ro.set(3, dna);
      info.set(msg, cd === "m" && u0 > 0.4 ? "warn" : cd === "d" && u >= 0.85 ? "bad" : "ok");
    }
    k.button("Lecture / pause", function(){ playing = !playing; }, true);
    k.button("Recommencer", function(){ prog.set(4); playing = true; });
    k.draw(R);
    var lp = k.loop(function(dt){
      tt += dt; if (v.auto) v.yaw = 0.35 + 0.55 * Math.sin(tt * 0.35);
      if (playing){ var cur = prog.value + dt * 5.5 * spd.value; if (cur >= 100) { cur = 100; playing = false; } prog.set(cur); }
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c08_mitose.js */
