/* Chapitre 1 · Structure électronique et schéma de Lewis */
/* ---- aides graphiques communes à tout le cours (chargées avec le chapitre 1 sur chaque page) ---- */
C5.shade = function(col, k){   /* k > 0 : éclaircit ; k < 0 : fonce */
  var m = /^#([0-9a-f]{6})$/i.exec(col), r, g, b, t = k > 0 ? 255 : 0, a = Math.abs(k);
  if (m){ r = parseInt(m[1].slice(0, 2), 16); g = parseInt(m[1].slice(2, 4), 16); b = parseInt(m[1].slice(4, 6), 16); }
  else if ((m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(col))){ r = +m[1]; g = +m[2]; b = +m[3]; }
  else return col;
  return "rgb(" + Math.round(r + (t - r) * a) + "," + Math.round(g + (t - g) * a) + "," + Math.round(b + (t - b) * a) + ")";
};
C5.CPK = {H: "#f4f6fa", C: "#59636f", N: "#4f7be0", O: "#e8594a", F: "#86d06f", Cl: "#3fb878", S: "#e8c63a", P: "#f09a3a", B: "#eba98a", Be: "#a8d86a", X: "#f3c987", A: "#bfe0cf", Na: "#9b7be6", Xe: "#8fd3e0", Br: "#b5523b", I: "#8a5cc4"};
/* sphère ombrée avec étiquette facultative */
C5.atom = function(c, x, y, r, col, label, tcol){
  var S = window.SFA, ctx = c.ctx;
  if (!(r > 0) || !isFinite(x) || !isFinite(y)) return;
  ctx.save();
  var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.08, x, y, r);
  g.addColorStop(0, C5.shade(col, 0.6)); g.addColorStop(0.55, col); g.addColorStop(1, C5.shade(col, -0.2));
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = "rgba(15,27,45,.38)"; ctx.lineWidth = r > 5 ? 1.1 : 0.7; ctx.stroke();
  ctx.restore();
  if (label) S.draw.text(c, label, x, y, {size: r > 14 ? 14 : 12, color: tcol || "#0f1b2d"});
};
C5.rng = function(seed){ var s = seed; return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
C5.rot = function(v, yaw, pitch){
  var x1 = v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw), z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw);
  var y2 = v[1] * Math.cos(pitch) - z1 * Math.sin(pitch), z2 = v[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  return [x1, y2, z2];
};
C5.drag3d = function(c, st){   /* le pointeur fait tourner la molécule ; st = {yaw, pitch} */
  var last = null;
  c.pointer(function(type, p){
    if (type === "down"){ last = p; st.dragging = true; }
    else if (type === "drag" && last){ st.yaw += (p.x - last.x) * 0.012; st.pitch = Math.max(-1.4, Math.min(1.4, st.pitch + (p.y - last.y) * 0.012)); last = p; st.dirty = true; }
    else if (type === "up"){ last = null; st.dragging = false; }
  });
};
/* projection perspective : renvoie [x, y, échelle] */
C5.proj = function(v, cx, cy, R, persp){ var s = 1 / (1 - (persp == null ? 0.12 : persp) * v[2]); return [cx + R * v[0] * s, cy - R * v[1] * s, s]; };
/* fond de scène doux (paillasse) : dégradé léger */
C5.bench = function(c, y){
  var ctx = c.ctx, g = ctx.createLinearGradient(0, y, 0, c.H); g.addColorStop(0, "#e9edf3"); g.addColorStop(1, "#f6f8fb");
  ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, y, c.W, c.H - y); ctx.fillStyle = "#d3dae4"; ctx.fillRect(0, y, c.W, 2); ctx.restore();
};
/* bécher : contour de verre + liquide (niveau 0..1) ; renvoie {x, y, w, h, top} */
C5.beaker = function(c, x, y, w, h, fill, level, opt){
  opt = opt || {}; var ctx = c.ctx, S = window.SFA, top = y + h * (1 - level);
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (opt.taper || 0), y + h); ctx.lineTo(x + w - (opt.taper || 0), y + h); ctx.lineTo(x + w, y); ctx.closePath();
  ctx.fillStyle = "rgba(230,240,250,.35)"; ctx.fill(); ctx.clip();
  if (level > 0){ var g = ctx.createLinearGradient(0, top, 0, y + h); g.addColorStop(0, C5.shade(fill, 0.25)); g.addColorStop(1, fill); ctx.fillStyle = g; ctx.fillRect(x - 2, top, w + 4, y + h - top + 2);
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(x - 2, top, w + 4, 2); }
  ctx.restore();
  ctx.save(); ctx.strokeStyle = "#51627a"; ctx.lineWidth = 2.4; ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x, y); ctx.lineTo(x + (opt.taper || 0), y + h); ctx.lineTo(x + w - (opt.taper || 0), y + h); ctx.lineTo(x + w, y); ctx.lineTo(x + w + 3, y); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 7, y + 8); ctx.lineTo(x + 7 + (opt.taper || 0) * 0.9, y + h - 10); ctx.stroke();
  ctx.restore();
  return {x: x, y: y, w: w, h: h, top: top};
};
/* flamme (goutte) : trace le chemin, à remplir ensuite */
C5.flame = function(ctx, cx, base, h, w, wob){
  ctx.beginPath(); ctx.moveTo(cx - w, base);
  ctx.bezierCurveTo(cx - w * 1.15, base - h * 0.4, cx - w * 0.45 + wob * 0.5, base - h * 0.78, cx + wob, base - h);
  ctx.bezierCurveTo(cx + w * 0.45 + wob * 0.5, base - h * 0.78, cx + w * 1.15, base - h * 0.4, cx + w, base); ctx.closePath();
};
/* thermomètre vertical : bulbe en bas, colonne rouge jusqu'à T (échelle Tmin..Tmax) */
C5.thermo = function(c, x, y, h, T, Tmin, Tmax, label){
  var ctx = c.ctx, f = Math.max(0, Math.min(1, (T - Tmin) / (Tmax - Tmin)));
  ctx.save(); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.strokeStyle = "#51627a"; ctx.lineWidth = 1.6;
  window.SFA.draw.rrect(c, x - 5, y, 10, h, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#d8402e"; ctx.fillRect(x - 2, y + h - 4 - f * (h - 12), 4, f * (h - 12) + 6);
  ctx.beginPath(); ctx.arc(x, y + h + 4, 8, 0, 2 * Math.PI); ctx.fillStyle = "#d8402e"; ctx.fill(); ctx.strokeStyle = "#51627a"; ctx.stroke();
  ctx.restore();
  if (label) window.SFA.draw.label(c, label, x + 14, y + h - f * (h - 12) - 2, {color: "#c0321d", size: 12, align: "left"});
};
/* enceinte de gaz : espèces [{n, mol:[[dx,dy,r,couleur],…], r}] ; les particules gardent leur identité quand n varie */
C5.gasbox = function(c, x, y, w, h, spec, t, opt){
  var ctx = c.ctx, S = window.SFA; opt = opt || {};
  ctx.save(); S.draw.rrect(c, x, y, w, h, 10); ctx.fillStyle = opt.fill || "#f6f9fc"; ctx.fill(); ctx.clip();
  spec.forEach(function(sp, si){
    var n = Math.round(sp.n), i;
    for (i = 0; i < n; i++){
      var r1 = (i * 0.6180339 + si * 0.37) % 1, r2 = (i * 0.7548776 + si * 0.21 + 0.3) % 1, ph = i * 1.7 + si * 2.3, a = t * (0.5 + (i % 3) * 0.2) + ph;
      var px = x + 14 + ((r1 + Math.sin(t * 0.6 + ph) * 0.05 + 1) % 1) * (w - 28), py = y + 14 + ((r2 + Math.cos(t * 0.5 + ph) * 0.05 + 1) % 1) * (h - 28), cs = Math.cos(a), sn = Math.sin(a);
      if (sp.mol) sp.mol.forEach(function(m){ C5.atom(c, px + m[0] * cs - m[1] * sn, py + m[0] * sn + m[1] * cs, m[2], m[3], ""); });
      else C5.atom(c, px, py, sp.r || 6, sp.col, "");
    }
  });
  ctx.restore(); ctx.save(); S.draw.rrect(c, x, y, w, h, 10); ctx.strokeStyle = "#51627a"; ctx.lineWidth = 2.4; ctx.stroke(); ctx.restore();
};
C5.rgb = function(nm){   /* longueur d'onde (nm) → couleur approximative */
  var r = 0, g = 0, b = 0, f;
  if (nm >= 380 && nm < 440){ r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490){ g = (nm - 440) / 50; b = 1; }
  else if (nm < 510){ g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580){ r = (nm - 510) / 70; g = 1; }
  else if (nm < 645){ r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780){ r = 1; }
  else return null;
  f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (780 - nm) / 80 : 1;
  return "rgb(" + Math.round(255 * r * f) + "," + Math.round(255 * g * f) + "," + Math.round(255 * b * f) + ")";
};
C5.SYM = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"];
C5.NOM = ["hydrogène","hélium","lithium","béryllium","bore","carbone","azote","oxygène","fluor","néon","sodium","magnésium","aluminium","silicium","phosphore","soufre","chlore","argon","potassium","calcium","scandium","titane","vanadium","chrome","manganèse","fer","cobalt","nickel","cuivre","zinc","gallium","germanium","arsenic","sélénium","brome","krypton"];

SFA.sim({
  id: "c5-c01-remplissage", ch: "c01", tag: "Classique",
  titre: "Remplir les sous-couches, électron par électron",
  resume: "Choisis Z de 1 à 36 : les cases se remplissent et la configuration s'écrit.",
  but: "Déplace Z et regarde dans quel ordre les électrons occupent les sous-couches. Relève ensuite les électrons de valence, puis relève le défi.",
  aRetenir: "Ordre de remplissage : 1s 2s 2p 3s 3p 4s 3d 4p. Une sous-couche s accueille 2 électrons, p 6, d 10. Les électrons de valence sont ceux de la couche de plus grand n ; la période est ce plus grand n.",
  piege: "La sous-couche 4s se remplit AVANT la 3d (elle est plus basse en énergie dans l'atome neutre). Le chrome (Z = 24) et le cuivre (Z = 29) sont des exceptions : 4s¹ 3d⁵ et 4s¹ 3d¹⁰.",
  build: function(k, S){
    var ORDER = [[1,0],[2,0],[2,1],[3,0],[3,1],[4,0],[3,2],[4,1]], LET = "spd";
    var pal = S.draw.palette;
    var c = k.canvas(360);
    var zs = k.slider("Numéro atomique Z", 1, 36, 1, 8, "");
    var ro = k.readouts(["Élément", "Configuration électronique", "Période", "Électrons de valence"]);
    var nt = k.note("", "");
    var defis = [
      {t: "Trouve l'élément de la période 3 qui a 5 électrons de valence.", ok: function(z){ return z === 15; }},
      {t: "Trouve le gaz noble de la période 2.", ok: function(z){ return z === 10; }},
      {t: "Trouve l'élément de la période 3 qui a 2 électrons de valence.", ok: function(z){ return z === 12; }},
      {t: "Trouve l'élément dont la configuration se termine par 4s¹ 3d¹⁰.", ok: function(z){ return z === 29; }}
    ], di = -1, defiOn = false;
    var dn = k.note("", "");
    k.button("Défi suivant", function(){ defiOn = true; di = (di + 1) % defis.length; }, true);
    function config(Z){
      var left = Z, out = [];
      ORDER.forEach(function(o){ var cap = 2 * (2 * o[1] + 1), e = Math.min(left, cap); left -= e; out.push({n: o[0], l: o[1], e: e}); });
      if (Z === 24){ out[5].e = 1; out[6].e = 5; }
      if (Z === 29){ out[5].e = 1; out[6].e = 10; }
      return out.filter(function(s){ return s.e > 0; });
    }
    k.draw(function(){
      var Z = zs.value, cf = config(Z), ctx = c.ctx; c.clear();
      var nmax = 0; cf.forEach(function(s){ nmax = Math.max(nmax, s.n); });
      var val = 0; cf.forEach(function(s){ if (s.n === nmax) val += s.e; });
      var rows = ORDER.length, rh = (c.H - 24) / rows, bx = 30;
      S.draw.text(c, "énergie ↑", 8, 10, {size: 12, align: "left", color: pal.grey});
      for (var i = 0; i < rows; i++){
        var o = ORDER[i], y = c.H - 14 - (i + 0.5) * rh, nb = 2 * o[1] + 1;
        var s = cf.filter(function(q){ return q.n === o[0] && q.l === o[1]; })[0], e = s ? s.e : 0;
        S.draw.text(c, o[0] + LET[o[1]], 6, y, {size: 13, align: "left", color: o[0] === nmax ? pal.red : pal.ink});
        for (var j = 0; j < nb; j++){
          var x = 50 + j * (bx + 4), up = e > j, dn2 = e > nb + j;
          if (e > j){ ctx.fillStyle = o[0] === nmax ? "rgba(192,50,29,.10)" : "rgba(31,75,158,.08)"; ctx.fillRect(x, y - 13, bx, 26); }
          ctx.strokeStyle = o[0] === nmax && e > 0 ? pal.red : pal.grey; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 13, bx, 26);
          if (up) S.draw.text(c, "↑", x + bx / 2 - 6, y, {size: 18, color: pal.acc});
          if (dn2) S.draw.text(c, "↓", x + bx / 2 + 6, y, {size: 18, color: pal.acc});
        }
        if (e > 0) S.draw.text(c, e + " e⁻", 50 + nb * (bx + 4) + 6, y, {size: 12, align: "left", color: pal.grey});
      }
      var str = cf.map(function(q){ return q.n + LET[q.l] + "<sup>" + q.e + "</sup>"; }).join(" ");
      S.draw.display(c, "Z = " + Z, c.W - 74, 34, {w: 120, h: 50, caption: C5.SYM[Z - 1] + " · " + C5.NOM[Z - 1], size: 17});
      ro.set(0, C5.SYM[Z - 1] + " · " + C5.NOM[Z - 1]); ro.set(1, str); ro.set(2, nmax); ro.set(3, val);
      if (Z === 24 || Z === 29) nt.set("<b>Exception.</b> Une sous-couche d à moitié pleine (d⁵) ou pleine (d¹⁰) est particulièrement stable : un électron passe de 4s vers 3d.", "warn");
      else if (Z === 2 || Z === 10 || Z === 18 || Z === 36) nt.set("Gaz noble : la sous-couche p de la dernière couche est pleine (ou 1s² pour l'hélium). Très peu réactif.", "ok");
      else nt.set("La couche externe (rouge) porte les électrons de valence.", "");
      if (defiOn){ var d = defis[di]; var good = d.ok(Z); dn.set("<b>Défi.</b> " + d.t + (good ? " ✔ Bravo : Z = " + Z + ", c'est " + C5.NOM[Z - 1] + "." : ""), good ? "ok" : ""); }
      else dn.set("Appuie sur « Défi suivant » pour une mission.", "");
    });
  }
});

SFA.sim({
  id: "c5-c01-spectre", ch: "c01", tag: "Graphe",
  titre: "Spectre d'émission de l'hydrogène",
  resume: "Un électron redescend d'un niveau n à un niveau plus bas : un photon, une raie.",
  but: "Choisis le niveau d'arrivée (série) puis le niveau de départ nᵢ (curseur, ou touche un niveau sur le schéma). Lis l'énergie du photon et sa longueur d'onde.",
  aRetenir: "E(n) = −13,6 eV / n². Le photon émis a l'énergie ΔE = E(départ) − E(arrivée) et la longueur d'onde λ = 1240 / ΔE (λ en nm, ΔE en eV). Les raies de la série de Balmer (arrivée n = 2) sont dans le visible.",
  piege: "Il y a des raies et pas un arc-en-ciel continu : seules certaines différences d'énergie existent, parce que les niveaux sont quantifiés. Et l'électron doit descendre : il faut nᵢ > n_f pour émettre.",
  build: function(k, S){
    var pal = S.draw.palette, c = k.canvas(270), sp = k.canvas(120);
    var nf = k.seg("Niveau d'arrivée n_f", [[1, "1 (UV)"], [2, "2 (visible)"], [3, "3 (IR)"]], 2);
    var ni = k.slider("Niveau de départ nᵢ", 2, 7, 1, 3, "");
    var ro = k.readouts(["Énergie du photon ΔE", "Longueur d'onde λ", "Domaine", "Série"]);
    var nt = k.note("", "");
    var E = function(n){ return -13.6 / (n * n); };
    var X0 = 60, lastLevels = [];
    c.pointer(function(type, p){ if (type !== "down" && type !== "drag") return;
      var best = 7, bd = 1e9; lastLevels.forEach(function(l){ var d = Math.abs(l.y - p.y); if (d < bd){ bd = d; best = l.n; } });
      if (best >= 2) ni.set(best); k.redraw(); });
    function lam(a, b){ return 1240 / (13.6 * (1 / (b * b) - 1 / (a * a))); }
    k.draw(function(){
      var f = parseInt(nf.value, 10), i = ni.value; c.clear(); sp.clear();
      var yTop = 26, yBot = c.H - 22; lastLevels = [];
      function Y(n){ return n === 0 ? yTop : yBot - (n - 1) / 7 * (yBot - yTop); }   /* schéma : niveaux régulièrement espacés (pas à l'échelle) */
      for (var n = 1; n <= 7; n++){
        var y = Y(n); lastLevels.push({n: n, y: y});
        S.draw.line(c, X0, y, c.W - 90, y, n === f ? pal.green : pal.grey, n === f || n === i ? 3 : 2);
        S.draw.text(c, "n = " + n, X0 - 8, y, {align: "right", size: 12});
        S.draw.text(c, S.fmt(E(n), 2) + " eV", c.W - 86, y, {align: "left", size: 12, color: pal.grey});
      }
      S.draw.line(c, X0, Y(0), c.W - 90, Y(0), pal.light, 1.5, [4, 4]); S.draw.text(c, "n → ∞ : 0 eV", X0 + 6, Y(0) - 10, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c, "(niveaux non à l'échelle)", c.W - 6, 10, {align: "right", size: 12, color: pal.grey});
      var ok = i > f;
      if (ok){
        S.draw.arrow(c, X0 + 90, Y(i), X0 + 90, Y(f) - 2, pal.red, 3);
        var nm = lam(i, f), col = C5.rgb(nm);
        S.draw.text(c, S.fmt(nm, 0) + " nm", X0 + 104, (Y(i) + Y(f)) / 2, {align: "left", size: 13, color: col || pal.red, bg: "#ffffff"});
      }
      /* spectre */
      var x0 = 14, x1 = sp.W - 14, L0 = 90, L1 = 2000, lx = function(l){ return x0 + (Math.log(l) - Math.log(L0)) / (Math.log(L1) - Math.log(L0)) * (x1 - x0); };
      var ctx = sp.ctx; ctx.fillStyle = "#111"; ctx.fillRect(x0, 34, x1 - x0, 44);
      for (var l = 380; l <= 780; l += 4){ ctx.fillStyle = C5.rgb(l); ctx.globalAlpha = 0.22; ctx.fillRect(lx(l), 34, Math.max(1, lx(l + 4) - lx(l)), 44); ctx.globalAlpha = 1; }
      S.draw.text(sp, "visible", (lx(380) + lx(780)) / 2, 24, {size: 12, color: pal.grey});
      [100, 200, 400, 700, 1000, 2000].forEach(function(t){ S.draw.line(sp, lx(t), 78, lx(t), 84, pal.grey, 1); S.draw.text(sp, t + "", lx(t), 97, {size: 12, color: pal.grey}); });
      S.draw.text(sp, "λ (nm, échelle logarithmique)", sp.W / 2, 113, {size: 12, color: pal.grey});
      for (var m = f + 1; m <= 7; m++){
        var w = lam(m, f), col2 = C5.rgb(w) || "#ffffff";
        ctx.strokeStyle = m === i ? "#ffffff" : col2; ctx.lineWidth = m === i ? 3.5 : 2; ctx.beginPath(); ctx.moveTo(lx(w), 34); ctx.lineTo(lx(w), 78); ctx.stroke();
      }
      if (ok){
        var dE = 13.6 * (1 / (f * f) - 1 / (i * i)), w2 = lam(i, f);
        ro.set(0, S.fmt(dE, 2) + " eV"); ro.set(1, S.fmt(w2, 0) + " nm");
        ro.set(2, w2 < 380 ? "ultraviolet" : w2 > 780 ? "infrarouge" : "visible");
        ro.set(3, f === 1 ? "Lyman" : f === 2 ? "Balmer" : "Paschen");
        nt.set("Une seule transition = une seule raie. Les autres raies de la série sont les autres valeurs de nᵢ (traits colorés).", "");
      } else { ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); nt.set("Pas d'émission : nᵢ doit être plus grand que n_f (l'électron redescend).", "warn"); }
    });
  }
});

SFA.sim({
  id: "c5-c01-lewis", ch: "c01", tag: "Classique",
  titre: "Le schéma de Lewis d'un atome et d'un ion",
  resume: "Choisis un élément (H à Ar) et une charge : les électrons de valence se placent en points.",
  but: "Choisis un élément, puis fais varier la charge de l'ion. Compte les électrons de valence, les électrons célibataires et les doublets.",
  aRetenir: "Nombre d'électrons de valence = numéro de la colonne (groupe 1, 2, 13 à 18 : 1, 2, 3 … 8). On met d'abord un point par côté, puis on apparie. Les électrons célibataires indiquent le nombre de liaisons covalentes que l'atome peut former : 8 − valence pour les groupes 14 à 17 (2 − valence pour H). Les métaux des groupes 1, 2 et 13 forment surtout des cations en perdant leurs électrons de valence.",
  piege: "Un cation a PERDU des électrons : Na⁺ n'a plus d'électron de valence « propre », sa couche externe est celle du néon (8 e⁻). On écrit habituellement [Na]⁺ sans points ; la simulation dessine en plus cette couche complète (8 points) pour montrer la configuration de gaz noble. Un anion en a GAGNÉ : Cl⁻ a 8 points.",
  build: function(k, S){
    var pal = S.draw.palette, c = k.canvas(260);
    var opts = []; for (var z = 1; z <= 18; z++) opts.push([z, z + " · " + C5.SYM[z - 1] + " " + C5.NOM[z - 1]]);
    var el = k.select("Élément", opts, 8);
    var q = k.slider("Charge de l'ion", -3, 3, 1, 0, "");
    var ro = k.readouts(["Électrons au total", "Électrons de valence", "Célibataires", "Doublets"]);
    var nt = k.note("", "");
    function valence(Z){ return Z <= 2 ? Z : Z <= 10 ? Z - 2 : Z - 10; }
    k.draw(function(){
      var Z = parseInt(el.value, 10), ch = q.value, v = valence(Z), per = Z <= 2 ? 1 : Z <= 10 ? 2 : 3;
      var tot = Z - ch, vi = v - ch, duet = per === 1, bad = false, shown = vi, cat = false;
      c.clear();
      if (tot < 0){ bad = true; }
      if (vi <= 0){ cat = true; shown = per === 2 ? 2 : per === 3 ? 8 : 0; }
      if (vi < 0) bad = true;   /* il faudrait entamer la couche inférieure : pas d'ion réaliste */
      if (!duet && !cat && vi > 8) bad = true;
      if (duet && !cat && vi > 2) bad = true;
      var cx = c.W / 2, cy = c.H / 2, sy = C5.SYM[Z - 1];
      S.draw.panel(c, 10, 10, 78, 88, {fill: S.draw.tint(C5.CPK[sy] || "#cfe4d8", 0.35), shadow: false});
      S.draw.text(c, String(Z), 20, 24, {size: 12, align: "left", color: pal.grey}); S.draw.text(c, sy, 49, 52, {size: 28, math: true}); S.draw.text(c, C5.NOM[Z - 1], 49, 84, {size: 11, color: pal.grey});
      var capMax = (duet || (cat && per === 2)) ? 2 : 8;
      if (bad || tot <= 0){
        S.draw.text(c, sy + (ch ? (Math.abs(ch) > 1 ? C5.sup(Math.abs(ch)) : "") + (ch > 0 ? "⁺" : "⁻") : ""), cx, cy, {size: 44, math: true});
        ro.set(0, tot > 0 ? tot : "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—");
        nt.set("Cet ion n'existe pas dans la pratique : on ne peut pas retirer ou ajouter autant d'électrons à la couche de valence.", "warn"); return;
      }
      /* points : un par côté, puis on apparie */
      var sides = [[0, -1], [1, 0], [0, 1], [-1, 0]], cnt = [0, 0, 0, 0], m = shown, i;
      if (capMax === 2){ cnt[0] = m; }
      else { for (i = 0; i < m; i++) cnt[i % 4]++; }
      var d = 38;
      sides.forEach(function(sd, idx){
        for (var j = 0; j < cnt[idx]; j++){
          var off = cnt[idx] === 2 ? (j === 0 ? -7 : 7) : 0;
          var px = cx + sd[0] * d + (sd[0] === 0 ? off : 0), py = cy + sd[1] * d + (sd[1] === 0 ? off : 0);
          S.draw.dot(c, px, py, 5, pal.red);
        }
      });
      var brack = ch !== 0;
      S.draw.text(c, sy, cx, cy, {size: 44, math: true});
      if (brack){
        var ctx = c.ctx; ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5;
        var bw = 78, bh = 78;
        ctx.beginPath(); ctx.moveTo(cx - bw + 10, cy - bh); ctx.lineTo(cx - bw, cy - bh); ctx.lineTo(cx - bw, cy + bh); ctx.lineTo(cx - bw + 10, cy + bh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + bw - 10, cy - bh); ctx.lineTo(cx + bw, cy - bh); ctx.lineTo(cx + bw, cy + bh); ctx.lineTo(cx + bw - 10, cy + bh); ctx.stroke();
        S.draw.text(c, (Math.abs(ch) > 1 ? Math.abs(ch) : "") + (ch > 0 ? "+" : "−"), cx + bw + 14, cy - bh + 6, {size: 18, color: pal.red});
      }
      var unp, pairs;
      if (capMax === 2){ unp = shown === 1 ? 1 : 0; pairs = shown === 2 ? 1 : 0; }
      else { pairs = Math.max(0, shown - 4); unp = shown - 2 * pairs; }
      ro.set(0, tot); ro.set(1, cat ? shown + " (couche inférieure)" : shown); ro.set(2, unp); ro.set(3, pairs);
      var iso = tot === 2 ? "He" : tot === 10 ? "Ne" : tot === 18 ? "Ar" : "";
      if (ch === 0){
        if (Z === 2 || Z === 10 || Z === 18) nt.set("Gaz noble : couche externe complète, aucune liaison à former.", "ok");
        else if (v <= 3 && Z > 2 && Z !== 1) nt.set("Atome neutre d'un métal (ou presque) : il a " + unp + " électron(s) célibataire(s), mais il atteint plus facilement la configuration d'un gaz noble en PERDANT ses " + v + " électron(s) de valence (cation).", "");
        else nt.set("Atome neutre. Il peut former " + unp + " liaison(s) covalente(s) pour compléter sa couche (" + (capMax === 2 ? "duet" : "octet") + ").", "");
      }
      else nt.set("Ion " + (ch > 0 ? "positif" : "négatif") + " : " + tot + " électrons." + (iso ? " Même configuration que le gaz noble " + iso + " (très stable)." : " Cette configuration n'est pas celle d'un gaz noble : l'ion est peu probable."), iso ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id: "c5-c01-flamme", ch: "c01", tag: "Niche utile",
  titre: "Test de flamme : quel métal brûle de cette couleur ?",
  resume: "Chaque métal colore la flamme : le lien avec les niveaux d'énergie, et un sel mystère à identifier.",
  but: "Passe un sel dans la flamme. Lis la longueur d'onde dominante et l'énergie du photon. Puis passe en mode « Mystère » et identifie le métal à sa couleur.",
  aRetenir: "Dans la flamme, les électrons du métal sont excités puis retombent en émettant des photons dont l'énergie ΔE = 1240 / λ est propre à chaque élément. La couleur est une signature du métal, pas du chlorure.",
  piege: "Modèle simplifié : on affiche une seule longueur d'onde « dominante », arrondie, alors qu'une flamme est un mélange de raies (le jaune du sodium masque facilement les autres couleurs). Pour Li et Na, c'est bien la raie atomique principale ; pour Ca, Ba et Cu, la couleur vient surtout de bandes de petites molécules formées dans la flamme (CaOH, BaOH, CuCl) ; pour K, la raie la plus intense (766 nm) est à la limite du visible, d'où une flamme lilas pâle, souvent observée à travers un verre bleu de cobalt. Et c'est bien le métal, pas l'anion, qui colore.",
  build: function(k, S){
    var pal = S.draw.palette;
    var M = {
      Li: {n: "lithium (LiCl)", l: 671, d: "rouge carmin", col: "#e0214a"},
      Na: {n: "sodium (NaCl)", l: 589, d: "jaune-orangé", col: "#ffb81c"},
      K: {n: "potassium (KCl)", l: 766, d: "violet / lilas (rouge 766 nm à peine visible + faible raie violette 404 nm)", col: "#b07ae6"},
      Ca: {n: "calcium (CaCl₂)", l: 622, d: "orange-rouge brique", col: "#e8541e"},
      Ba: {n: "baryum (BaCl₂)", l: 524, d: "vert pomme", col: "#8fd24a"},
      Cu: {n: "cuivre (CuCl₂)", l: 520, d: "vert-bleu", col: "#2fc7a0"}
    };
    var keys = Object.keys(M), seg2 = keys.map(function(x){ return [x, x]; });
    var c = k.canvas(390);
    var mode = k.seg("Mode", [["obs", "Observer"], ["mys", "Mystère"]], "obs");
    var sel = k.seg("Métal du sel (glisse la spatule dans la flamme)", seg2, "Na");
    var amount = k.slider("Quantité de sel sur la spatule", 0.2, 1, 0.1, 0.7, "");
    var guess = k.seg("Ma réponse (mode Mystère)", seg2, "Li");
    var mys = "Ca", verdict = "", score = 0, tries = 0;
    var sp = {x: 0, y: 0, hold: true, drag: false, inten: 0, init: false};
    k.toggle("Spatule maintenue dans la flamme", true, function(v){ sp.hold = v; });
    k.button("Nouveau sel mystère", function(){ mys = keys[Math.floor(Math.random() * keys.length)]; verdict = ""; mode.set("mys"); }, false);
    k.button("Vérifier ma réponse", function(){ if (mode.value !== "mys") return; tries++; verdict = guess.value === mys ? "ok" : "warn"; if (verdict === "ok") score++; }, true);
    var ro = k.readouts(["Raie principale", "Énergie du photon ΔE", "Couleur"]);
    var nt = k.note("", "");
    var wide = function(){ return c.W >= 440; };
    function geo(){ var cx = wide() ? c.W * 0.3 : c.W / 2, base = c.H - 108; return {cx: cx, base: base, tx: cx + 4, ty: base - 108}; }
    c.pointer(function(type, p){
      var g = geo();
      if (type === "down"){ sp.drag = true; sp.x = p.x; sp.y = p.y; }
      else if (type === "drag" && sp.drag){ sp.x = p.x; sp.y = p.y; }
      else if (type === "up"){ sp.drag = false; sp.hold = Math.hypot(p.x - g.tx, p.y - g.ty) < 80; }
    });
    var T = 0;
    var lp = k.loop(function(dt, t){
      T = t; var g = geo();
      if (!sp.init){ sp.x = g.cx + 90; sp.y = g.base - 20; sp.init = true; }
      if (!sp.drag){ var tx = sp.hold ? g.tx : g.cx + 110, ty = sp.hold ? g.ty : g.base - 40; sp.x += (tx - sp.x) * Math.min(1, dt * 6); sp.y += (ty - sp.y) * Math.min(1, dt * 6); }
      var near = Math.max(0, 1 - Math.hypot(sp.x - g.tx, sp.y - g.ty) / 85);
      sp.inten += (near * amount.value - sp.inten) * Math.min(1, dt * 3.5);
      k.redraw();
    });
    lp.play();
    var flame = C5.flame;
    k.draw(function(){
      var m = mode.value === "mys" ? mys : sel.value, d = M[m], ctx = c.ctx, g = geo(), I = sp.inten;
      c.clear(); C5.bench(c, g.base + 46);
      var cx = g.cx, base = g.base, wob = Math.sin(T * 7) * 3 + Math.sin(T * 13 + 1) * 1.5, H = 170 + Math.sin(T * 9) * 5;
      /* lueur de la flamme sur la paillasse */
      S.draw.glow(c, cx, base - 60, 150, I > 0.05 ? d.col : "#6b8cff", 0.12 + 0.28 * I);
      /* bec Bunsen */
      var gr = ctx.createLinearGradient(cx - 12, 0, cx + 12, 0); gr.addColorStop(0, "#8e9aab"); gr.addColorStop(0.45, "#e1e7ef"); gr.addColorStop(1, "#7b8798");
      ctx.fillStyle = gr; ctx.fillRect(cx - 11, base, 22, 56);
      ctx.fillStyle = "#4a5568"; ctx.fillRect(cx - 14, base + 22, 28, 12); ctx.fillStyle = "#1f2937"; ctx.fillRect(cx - 5, base + 25, 10, 6);
      S.draw.rrect(c, cx - 30, base + 52, 60, 10, 4); ctx.fillStyle = "#3a4558"; ctx.fill();
      /* flamme : bleue au départ, teintée par le métal */
      var oc = I > 0.04 ? d.col : "#7b9bff";
      var go = ctx.createLinearGradient(0, base, 0, base - H);
      go.addColorStop(0, "rgba(90,120,255,.55)"); go.addColorStop(0.35, S.draw.tint(oc, 0.25 + 0.55 * I)); go.addColorStop(1, S.draw.tint(oc, 0.05 + 0.5 * I));
      ctx.save(); ctx.fillStyle = go; flame(ctx, cx, base, H, 24, wob); ctx.fill();
      ctx.fillStyle = S.draw.tint(oc, 0.2 + 0.45 * I); flame(ctx, cx, base, H * 0.7, 15, wob * 0.7); ctx.fill();
      ctx.fillStyle = "rgba(60,90,255,.75)"; flame(ctx, cx, base, H * 0.3, 7, wob * 0.3); ctx.fill(); ctx.restore();
      /* étincelles colorées */
      var rnd = C5.rng(7);
      for (var i = 0; i < 16 && I > 0.1; i++){
        var ph = (T * (0.35 + rnd() * 0.4) + rnd() * 3) % 1, sx = cx + (rnd() - 0.5) * 30 + Math.sin(T * 3 + i) * 8 * ph, sy = base - 20 - ph * (H + 20);
        S.draw.glow(c, sx, sy, 7, d.col, (1 - ph) * 0.9 * I);
      }
      /* spatule : tige + coupelle de sel */
      ctx.save(); ctx.strokeStyle = "#6b7686"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sp.x + 92, sp.y + 43); ctx.lineTo(sp.x + 6, sp.y + 4); ctx.stroke();
      ctx.fillStyle = "#c8d0db"; ctx.beginPath(); ctx.ellipse(sp.x, sp.y, 11, 6, -0.3, 0, 2 * Math.PI); ctx.fill(); ctx.strokeStyle = "#7b8798"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.ellipse(sp.x - 1, sp.y - 2, 7 * (0.5 + amount.value * 0.5), 3, -0.3, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
      S.draw.text(c, sp.drag ? "relâche dans la flamme" : sp.hold ? "" : "glisse la spatule dans la flamme", sp.x + 20, sp.y + 24, {size: 12, color: pal.grey, align: "left"});
      S.draw.text(c, mode.value === "mys" ? "Sel mystère" : d.n, 12, 16, {size: 14, align: "left"});
      if (mode.value === "mys") S.draw.text(c, "score : " + score + " / " + tries, c.W - 12, 16, {size: 12, align: "right", color: pal.grey});
      /* diagramme d'énergie : excitation puis retour avec photon */
      var hidden = mode.value === "mys" && !verdict, dE = 1240 / d.l;
      if (wide()){
        var X0 = c.W * 0.6, X1 = c.W - 22, yE = 60, yG = g.base - 20, midx = (X0 + X1) / 2;
        S.draw.panel(c, X0 - 18, 34, X1 - X0 + 36, yG - 34 + 56, {title: "Dans la flamme", shadow: false});
        S.draw.line(c, X0, yG, X1, yG, pal.ink, 3); S.draw.line(c, X0, yE + 22, X1, yE + 22, pal.ink, 3);
        S.draw.text(c, "état excité", X1, yE + 8, {size: 12, align: "right", color: pal.grey}); S.draw.text(c, "état de base", X1, yG + 14, {size: 12, align: "right", color: pal.grey});
        S.draw.arrow(c, X0 + 24, yG - 4, X0 + 24, yE + 28, pal.grey, 2.5); S.draw.text(c, "chaleur", X0 + 24, (yG + yE) / 2, {size: 12, color: pal.grey, align: "left", bg: "rgba(255,255,255,.9)", base: "middle"});
        var px = X0 + 62; S.draw.dot(c, px, yE + 22 + (I > 0.1 ? 0 : 0), 6, d.col);
        var ctx2 = c.ctx, ph = (T * 1.4) % 1;
        ctx2.save(); ctx2.strokeStyle = hidden ? pal.grey : d.col; ctx2.lineWidth = 3.2; ctx2.lineCap = "round"; ctx2.beginPath();
        for (var s = 0; s <= 60; s++){ var u = s / 60, yy = yE + 28 + u * (yG - yE - 34), xx = px + Math.sin(u * 22 - T * 12) * 7 * (0.35 + 0.65 * Math.min(1, u * 3)); s ? ctx2.lineTo(xx, yy) : ctx2.moveTo(xx, yy); }
        ctx2.stroke(); ctx2.restore();
        S.draw.arrow(c, px + 30, yE + 40, px + 30, yG - 6, hidden ? pal.grey : d.col, 2);
        S.draw.label(c, hidden ? "ΔE = ?   λ = ?" : "ΔE = " + S.fmt(dE, 2) + " eV · λ = " + d.l + " nm", midx, yG + 34, {color: hidden ? pal.grey : pal.ink, size: 11});
      }
      /* spectre visible + repère */
      var sx0 = 16, sx1 = c.W - 16, sy = c.H - 34, X = function(l){ return sx0 + (l - 380) / 400 * (sx1 - sx0); };
      for (var l = 380; l < 780; l += 4){ ctx.fillStyle = C5.rgb(l); ctx.fillRect(X(l), sy, X(l + 4) - X(l) + 1, 16); }
      ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.strokeRect(sx0, sy, sx1 - sx0, 16);
      [400, 500, 600, 700].forEach(function(v){ S.draw.text(c, v + "", X(v), sy + 27, {size: 11, color: pal.grey}); });
      S.draw.text(c, "nm", sx1, sy - 10, {size: 11, color: pal.grey, align: "right"});
      if (!hidden){ var mx = X(Math.min(d.l, 780)); ctx.fillStyle = pal.ink; ctx.beginPath(); ctx.moveTo(mx, sy - 2); ctx.lineTo(mx - 6, sy - 12); ctx.lineTo(mx + 6, sy - 12); ctx.closePath(); ctx.fill(); }
      if (hidden){ ro.set(0, "?"); ro.set(1, "?"); ro.set(2, d.d.split(" (")[0]); nt.set("Plonge la spatule, observe la flamme, choisis le métal puis « Vérifier ma réponse ». Indice : compare avec la couleur de chaque sel en mode Observer.", ""); }
      else {
        ro.set(0, d.l + " nm"); ro.set(1, S.fmt(dE, 2) + " eV"); ro.set(2, d.d);
        if (mode.value === "mys") nt.set(verdict === "ok" ? "Bravo : c'est " + M[mys].n + ", λ = " + M[mys].l + " nm." : "Ce n'est pas " + M[guess.value].n + ". Compare avec la couleur de sa fiche en mode « Observer ».", verdict);
        else if (I < 0.15) nt.set("La flamme du bec est bleue. Glisse la spatule dans la flamme pour y chauffer le sel.", "");
        else if (m === "K") nt.set("Potassium : la raie principale (766 nm, " + S.fmt(dE, 2) + " eV) est dans le rouge extrême, que l'œil voit mal ; la teinte lilas vient du mélange avec la faible raie violette à 404 nm (3,07 eV). On l'observe à travers un verre de cobalt pour masquer le jaune du sodium.", "warn");
        else nt.set("Plus l'énergie du photon est grande, plus on va vers le violet : " + S.fmt(dE, 2) + " eV ↔ " + d.l + " nm." + (m === "Ca" || m === "Ba" || m === "Cu" ? " (Ici, longueur d'onde d'une bande moléculaire dans la flamme, pas d'une raie de l'atome seul.)" : ""), "");
      }
    });
  }
});
