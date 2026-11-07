/* Physique 4e · chapitre 10 · Lentilles, œil et couleurs */
(function(){
SFA.sim({
  id:"p4-c10-banc-optique", ch:"c10", tag:"Classique",
  titre:"Banc d'optique : l'image par une lentille convergente",
  resume:"Déplace l'objet et change la focale : image réelle ou virtuelle, renversée ou droite, agrandie ou réduite.",
  but:"Glisse l'objet (flèche rouge) le long de l'axe, ou utilise les curseurs. Les trois rayons particuliers construisent l'image. Essaie de cacher la moitié de la lentille. (Échelle verticale agrandie 4,5 fois.)",
  aRetenir:"Trois rayons particuliers : parallèle à l'axe → passe par le foyer image F′ ; passant par le centre → non dévié ; passant par le foyer objet F → ressort parallèle. Relation de conjugaison : 1/f = 1/p + 1/q ; grandissement γ = −q/p. Objet au-delà de F : image réelle renversée ; entre F et la lentille : image virtuelle, droite, agrandie (loupe).",
  piege:"L'image ne se forme pas « sur la lentille » mais à la distance q. Cacher la moitié de la lentille ne coupe pas la moitié de l'image : l'image reste entière, mais moins lumineuse. Et si on retire l'écran, l'image réelle existe toujours dans l'air (on ne la voit que si on la reçoit sur un écran ou dans l'œil).",
  build:function(k,S){
    var c = PX.canvas(k, 0.62, 0.85), st = {drag:false, hint:true};
    var f = k.slider("Distance focale f", 5, 30, 1, 12, "cm");
    var p = k.slider("Distance objet – lentille p", 3, 85, 1, 30, "cm");
    var h = k.slider("Hauteur de l'objet", 1, 6, 1, 3, "cm");
    var mk = k.toggle("Cacher la moitié haute de la lentille", false);
    var ro = k.readouts(["Distance image q", "Grandissement γ", "Nature de l'image", "Vergence C = 1/f", "Luminosité de l'image"]);
    var nt = k.note("", "");
    var XR = 90, sx, sy, X, Y, cy;
    function setup(){ sx = (c.W - 20) / (2 * XR); sy = sx * 4.5; cy = c.H / 2; X = function(x){ return c.W / 2 + x * sx; }; Y = function(y){ return cy - y * sy; }; }
    c.pointer(function(type, pt){ setup(); if (type === "down"){ st.drag = Math.abs(pt.x - X(-p.value)) < 40; } if ((type === "down" || type === "drag") && st.drag){ st.hint = false; var v = Math.round(-(pt.x - c.W / 2) / sx); v = Math.max(3, Math.min(85, v)); p.set(v); k.redraw(); } if (type === "up") st.drag = false; });
    k.draw(function(){
      setup(); var P = SFA.draw.palette, F = f.value, Pp = p.value, H = h.value, ctx = c.ctx, masked = mk.value;
      var none = Math.abs(Pp - F) < 1e-9, q = none ? Infinity : F * Pp / (Pp - F), gam = none ? NaN : -q / Pp, Hi = gam * H, real = q > 0;
      var Hl = (c.H / 2 - 8) / sy;
      c.clear(); PX.bg(c, "#f4f7fb", "#e2e9f3"); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, c.W, c.H); ctx.clip();
      S.draw.line(c, 0, cy, c.W, cy, "#c9d1dc", 1.5);
      for (var t = -80; t <= 80; t += 20){ S.draw.line(c, X(t), cy - 4, X(t), cy + 4, "#8a95a3", 1); if (t) P4.label(c, String(t), X(t), cy + 14, "#8a95a3"); }
      [-F, F].forEach(function(xf, i){ S.draw.dot(c, X(xf), cy, 4, P.violet); P4.label(c, i ? "F′" : "F", X(xf), cy - 12, P.violet); });
      ctx.fillStyle = "rgba(120,170,230,.28)"; ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(Hl)); ctx.quadraticCurveTo(X(0) + 13, cy, X(0), Y(-Hl)); ctx.quadraticCurveTo(X(0) - 13, cy, X(0), Y(Hl)); ctx.closePath(); ctx.fill(); ctx.stroke();
      SFA.draw.arrow(c, X(0), Y(Hl - 2), X(0), Y(Hl), "#13233a", 3); SFA.draw.arrow(c, X(0), Y(-Hl + 2), X(0), Y(-Hl), "#13233a", 3);
      if (masked){ ctx.fillStyle = "rgba(95,107,122,.35)"; ctx.fillRect(X(0) - 6, Y(Hl), 12, cy - Y(Hl)); }
      var T = [-Pp, H], rayCol = ["rgba(180,83,9,.95)", "rgba(46,107,85,.95)", "rgba(30,63,143,.95)"];
      function seg(x1, y1, x2, y2, col, dash, w){ S.draw.line(c, X(x1), Y(y1), X(x2), Y(y2), col, w || 2, dash); }
      function ext(x1, y1, x2, y2, L){ var dx = x2 - x1, dy = y2 - y1; return [x2 + dx * L, y2 + dy * L]; }
      function lensRay(yl, col, w){
        /* rayon issu du sommet de l'objet qui traverse la lentille à la hauteur yl */
        seg(T[0], T[1], 0, yl, col, null, w);
        if (none){ var s2 = (yl - T[1]) / (0 - T[0]); seg(0, yl, XR, yl + s2 * XR, col, null, w); }
        else if (real){ var far = Math.max(1, (XR + 5) / q); seg(0, yl, q * far, yl + (Hi - yl) * far, col, null, w); }
        else { var dx = 0 - q, dy = yl - Hi; seg(0, yl, dx * 4, yl + dy * 4, col, null, w); seg(0, yl, q, Hi, col, [4, 4], 1.2); }
      }
      if (!masked){
        /* rayon 1 : parallèle puis par F' ; rayon 2 : par le centre ; rayon 3 : par F puis parallèle */
        seg(T[0], T[1], 0, H, rayCol[0]); seg(0, H, XR, H - H * XR / F, rayCol[0]);
        if (!real && !none) seg(0, H, q, Hi, rayCol[0], [4, 4], 1.2);
        var sl2 = H / (-Pp); seg(T[0], T[1], XR, sl2 * XR, rayCol[1]);
        if (!real && !none) seg(0, 0, q, Hi, rayCol[1], [4, 4], 1.2);
        if (!none){ var y3 = -H * F / (Pp - F); if (Math.abs(y3) < Hl){ seg(T[0], T[1], 0, y3, rayCol[2]); seg(0, y3, XR, y3, rayCol[2]); if (!real) seg(0, y3, q, Hi, rayCol[2], [4, 4], 1.2); } }
      } else {
        [-0.9, -0.65, -0.4, -0.15].forEach(function(r){ lensRay(r * Math.min(Hl, 14), "rgba(30,63,143,.9)", 1.8); });
        seg(T[0], T[1], 0, 0, "rgba(46,107,85,.95)");
        if (!none) seg(0, 0, real ? q * Math.max(1, (XR + 5) / q) : q * -4, real ? Hi * Math.max(1, (XR + 5) / q) : Hi * -4, "rgba(46,107,85,.95)", null);
      }
      if (!none && real && Math.abs(q) <= XR){ ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.2; ctx.fillRect(X(q) - 3, Y(Hl * 0.9), 6, 2 * Hl * 0.9 * sy); ctx.strokeRect(X(q) - 3, Y(Hl * 0.9), 6, 2 * Hl * 0.9 * sy); P4.label(c, "écran", X(q), Y(Hl * 0.9) - 10, "#5f6b7a"); }
      SFA.draw.arrow(c, X(-Pp), Y(0), X(-Pp), Y(H), P.red, 4); PX.grip(c, X(-Pp), Y(H), P.red, st.hint ? "glisse l'objet" : null, 6);
      if (!none && Math.abs(q) <= XR){ if (real) SFA.draw.arrow(c, X(q), Y(0), X(q), Y(Hi), P.acc, 4); else { ctx.save(); ctx.setLineDash([5, 4]); SFA.draw.arrow(c, X(q), Y(0), X(q), Y(Hi), "rgba(30,63,143,.6)", 3); ctx.restore(); } }
      ctx.restore();
      ro.set(0, none ? "à l'infini" : (real ? S.fmt(q, 1) + " cm" : S.fmt(q, 1) + " cm (côté objet)")); ro.set(1, none ? "—" : S.fmt(gam, 2)); ro.set(3, S.fmt(100 / F, 1) + " δ");
      ro.set(2, none ? "pas d'image (rayons parallèles)" : (real ? "réelle, renversée" : "virtuelle, droite") + (Math.abs(gam) > 1.005 ? ", agrandie" : Math.abs(gam) < 0.995 ? ", réduite" : ", même taille"));
      ro.set(4, masked ? "50 %" : "100 %");
      nt.set(none ? "p = f : l'objet est au foyer, les rayons ressortent parallèles : l'image est « à l'infini »." : Math.abs(q) > XR ? "L'image est trop loin pour tenir dans le schéma (q = " + S.fmt(q, 0) + " cm)." : masked ? "Moitié de la lentille cachée : l'image est TOUJOURS complète, mais deux fois moins lumineuse (moins de rayons)." : "1/f = 1/p + 1/q : 1/" + F + " = 1/" + Pp + " + 1/" + S.fmt(q, 1) + (real ? "." : " (q négatif : image virtuelle, située du même côté que l'objet)."), "");
    });
  }
});

var EYE = {normal:{d:20.0, n:"Œil normal"}, myope:{d:21.5, n:"Œil myope (trop long)"}, hyper:{d:18.5, n:"Œil hypermétrope (trop court)"}};
SFA.sim({
  id:"p4-c10-oeil-lunettes", ch:"c10", tag:"Santé",
  titre:"L'œil et ses lunettes : myopie et hypermétropie",
  resume:"Le cristallin accommode, mais un œil trop long ou trop court ne forme pas l'image sur la rétine sans lunettes.",
  but:"Choisis un type d'œil, la distance de l'objet et la vergence des lunettes (en dioptries) : glisse aussi les lunettes vers le haut ou le bas. L'image doit se former exactement sur la rétine pour être nette : regarde le point de convergence et la lettre vue par la personne. (Échelle verticale agrandie.)",
  aRetenir:"L'œil est une lentille convergente (cristallin) qui forme l'image sur la rétine ; il accommode en augmentant sa vergence pour voir de près. Myopie : image en avant de la rétine, corrigée par une lentille DIVERGENTE (vergence négative). Hypermétropie : image en arrière, corrigée par une lentille CONVERGENTE. Vergence C = 1/f (en dioptries δ).",
  piege:"Une lentille divergente rend le faisceau plus divergent : elle recule l'image, utile pour le myope (image trop avant). Les lunettes ne « grossissent » pas l'œil : elles changent la vergence totale. (Modèle d'œil réduit simplifié : lentille unique de 50 δ au repos et rétine à 20 mm (l'œil réel fait ≈ 60 δ pour ≈ 17 mm), pupille de 6 mm.)",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.55, 0.85), st = {hint:true}, geo = {};
    var EYE = {normal:{d:20.0, n:"Œil normal"}, myope:{d:21.5, n:"Œil myope (trop long)"}, hyper:{d:18.5, n:"Œil hypermétrope (trop court)"}};
    var ty = k.seg("Œil", [["normal","Normal"],["myope","Myope"],["hyper","Hypermétrope"]], "myope");
    var ac = k.seg("Accommodation", [[8,"Jeune (8 δ)"],[1,"Presbyte (1 δ)"]], 8);
    var inf = k.toggle("Objet très lointain (∞)", true);
    var dp = k.slider("Distance de l'objet (si non lointain)", 0.1, 5, 0.05, 1, "m");
    var cc = k.slider("Lunettes : vergence C", -6, 6, 0.25, 0, "δ", function(){ st.hint = false; });
    var ro = k.readouts(["Image sur la rétine ?", "Accommodation utilisée", "Verre pour voir net à l'infini", "Plage de vision nette"]);
    var nt = k.note("", "");
    PX.drag(k, c, function(){ return geo.gx == null ? [] : [{x:geo.gx, y:geo.gy, r:16, set:function(px, py){ st.hint = false; cc.set(Math.max(-6, Math.min(6, Math.round((geo.cy - py) / 38 * 6 * 4) / 4))); }}]; });
    function blurLetter(g, ch, x, y, size, blur, col){
      var ctx = g.ctx, n = blur < 0.4 ? 1 : 12, i;
      ctx.save(); ctx.font = "800 " + size + "px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = col; ctx.globalAlpha = n === 1 ? 1 : 1 / Math.sqrt(n) * 0.75;
      for (i = 0; i < n; i++){ var an = i / n * 6.2832; ctx.fillText(ch, x + Math.cos(an) * blur, y + Math.sin(an) * blur); if (n > 1 && i % 3 === 0) ctx.fillText(ch, x + Math.cos(an) * blur * 0.5, y + Math.sin(an) * blur * 0.5); }
      ctx.restore();
    }
    k.draw(function(){
      var ctx = c.ctx, E = EYE[ty.value], d = E.d / 1000, Am = +ac.value, C0 = 50, Cc = cc.value, invP = inf.value ? 0 : 1 / dp.value, ph = PX.phone(c);
      var need = invP + 1 / d - C0 - Cc, a = Math.max(0, Math.min(Am, need)), Ceff = C0 + a + Cc, V = Ceff - invP;
      var sharp = Math.abs(a - need) <= 0.25, qmm = V > 1e-3 ? 1000 / V : Infinity;
      /* géométrie : x en mm depuis le cristallin, échelle sc px/mm ; échelle verticale sv exagérée */
      var sc = Math.min((c.W * (ph ? 0.5 : 0.46)) / 26, (c.H - 40) / 26), sv = Math.min(sc * 1.7, (c.H / 2 - 16) / (11.5 * 0.82)), xL = c.W - (E.d + 4.5) * sc - 16, cy = c.H / 2 + 4;
      var X = function(mm){ return xL + mm * sc; }, retX = X(E.d), pup = 3 * sv;
      geo.cy = cy;
      c.clear(); PX.bg(c, "#eef3fa", "#dfe7f2");
      /* globe oculaire */
      var ex = X((E.d - 4.5) / 2), rx = (E.d + 4.5) / 2 * sc + 2, ry = 11.5 * sv * 0.82;
      var gr = ctx.createRadialGradient(ex, cy, 4, ex, cy, rx); gr.addColorStop(0, "#fffdf5"); gr.addColorStop(1, "#f1e3d1");
      ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(ex, cy, rx, ry, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "#8a7e72"; ctx.lineWidth = 2; ctx.stroke();
      /* rétine */
      ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(ex, cy, rx - 2, ry - 2, 0, -1.0, 1.0); ctx.stroke();
      S.draw.label(c, "rétine", retX + 4, cy + ry * 0.78 + 8, {color:P.red, size:PX.fs(c, 11.5), align:"center"});
      /* cornée + pupille / iris */
      ctx.fillStyle = "rgba(180,220,255,.55)"; ctx.beginPath(); ctx.ellipse(X(-3.8), cy, 5 * sc * 0.55, ry * 0.62, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(60,90,130,.6)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = "#6a8a5a"; ctx.fillRect(xL - 2, cy - ry * 0.72, 4, ry * 0.72 - pup); ctx.fillRect(xL - 2, cy + pup, 4, ry * 0.72 - pup);
      /* cristallin : s'épaissit avec l'accommodation */
      var lw = (1.6 + a * 0.22) * sc;
      ctx.fillStyle = "rgba(255,214,120,.85)"; ctx.strokeStyle = "#a9741a"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(xL, cy, Math.max(3, lw), pup * 1.02, 0, 0, 6.2832); ctx.fill(); ctx.stroke();
      S.draw.label(c, "cristallin", xL, cy - ry - 8, {color:"#a9741a", size:PX.fs(c, 11.5)});
      /* lunettes */
      var xg = Math.max(34, xL - (ph ? 70 : 96)), gy = cy - 50;
      geo.gx = xg; geo.gy = gy;
      if (Math.abs(Cc) > 0.01){
        var th = 2 + Math.abs(Cc) * 1.5, hh = 38;
        ctx.fillStyle = "rgba(14,127,150,.22)"; ctx.strokeStyle = P.teal; ctx.lineWidth = 2; ctx.beginPath();
        if (Cc > 0){ ctx.moveTo(xg, cy - hh); ctx.quadraticCurveTo(xg + th * 2, cy, xg, cy + hh); ctx.quadraticCurveTo(xg - th * 2, cy, xg, cy - hh); }
        else { ctx.moveTo(xg - th, cy - hh); ctx.lineTo(xg + th, cy - hh); ctx.quadraticCurveTo(xg - th * 0.2, cy, xg + th, cy + hh); ctx.lineTo(xg - th, cy + hh); ctx.quadraticCurveTo(xg + th * 0.2, cy, xg - th, cy - hh); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        S.draw.label(c, "lunettes " + S.fmt(Cc, 2) + " δ", xg, cy + hh + 14, {color:P.teal, size:PX.fs(c, 11.5)});
      } else S.draw.line(c, xg, cy - 38, xg, cy + 38, "rgba(14,127,150,.35)", 2, [3, 4]);
      PX.grip(c, xg, gy, P.teal, st.hint ? "glisse les lunettes" : null, 7);
      /* rayons */
      var x0 = 8, Lobj = xg - x0;
      [-1, 1].forEach(function(sg){
        var hObj = inf.value ? pup : pup * (1 + Lobj / Math.max(1, Math.min(dp.value * 1000 * sc, 1e5)) * 0.0), yStart = inf.value ? sg * pup : sg * pup * (0.25 + 0.75 * Math.min(1, 0.4 / dp.value));
        S.draw.line(c, x0, cy + yStart, xL, cy + sg * pup, P.amber, 2);
        var xEnd = isFinite(qmm) ? Math.min(c.W - 4, retX + 26, xL + qmm * sc) : retX + 20;
        var yAt = function(x){ return cy + sg * pup * (1 - (x - xL) / (isFinite(qmm) ? qmm * sc : 1e9)); };
        S.draw.line(c, xL, cy + sg * pup, xEnd, yAt(xEnd), sharp ? P.green : P.red, 2);
      });
      var fx = isFinite(qmm) ? xL + qmm * sc : null;
      if (fx != null && fx < c.W - 6) S.draw.dot(c, fx, cy, 4.5, sharp ? P.green : P.red);
      var blur = Math.min(40, Math.abs(a - need) * 6);
      if (!sharp){ ctx.fillStyle = "rgba(192,50,29,.35)"; ctx.beginPath(); ctx.ellipse(retX, cy, 3 + blur * 0.3, 3 + blur, 0, 0, 6.2832); ctx.fill(); }
      else S.draw.glow(c, retX, cy, 16, P.green, 0.8);
      S.draw.label(c, inf.value ? "objet à l'infini : rayons parallèles" : "objet à " + S.fmt(dp.value, 2) + " m : rayons divergents", x0 + 4, 14, {color:P.amber, align:"left", size:PX.fs(c, 11.5)});
      /* vue du patient */
      var bw = ph ? 62 : 74, bx = x0 + 4, by = c.H - bw - 8;
      S.draw.panel(c, bx, by, bw, bw, {fill:"#fff", stroke:sharp ? P.green : P.red, shadow:false});
      blurLetter(c, "E", bx + bw / 2, by + bw / 2 - 2, bw * 0.62, sharp ? 0 : Math.min(9, Math.abs(a - need) * 1.7 + 1), "#0f1b2d");
      S.draw.label(c, sharp ? "net" : "flou", bx + bw / 2, by - 10, {color:sharp ? P.green : P.red, size:11});
      var cinf = 1 / d - C0, far = C0 + Cc - 1 / d, near = Am + C0 + Cc - 1 / d;
      var farTxt = far > 1e-9 ? S.fmt(100 / far, 0) + " cm" : "∞", nearTxt = near > 1e-9 ? S.fmt(100 / near, 0) + " cm" : "∞";
      ro.set(0, sharp ? "NETTE" : (need < 0 ? "floue : image devant la rétine" : "floue : image derrière la rétine")); ro.set(1, S.fmt(a, 2) + " δ (max " + Am + ")"); ro.set(2, S.fmt(cinf, 2) + " δ"); ro.set(3, near < -1e-9 ? "aucune (même à l'infini, image derrière la rétine)" : near < 1e-9 ? "à l'infini seulement" : "de " + nearTxt + " à " + farTxt);
      nt.set(E.n + ". " + (sharp ? "L'image se forme sur la rétine : vision nette." : need < 0 ? "Le cristallin ne peut pas se « relâcher » davantage : trop convergent pour cet œil. Essaie une lentille divergente (C < 0)." : "Le cristallin ne peut pas accommoder assez : manque de convergence. Essaie une lentille convergente (C > 0)."), sharp ? "" : "warn");
    });
  }
});

var OBJ = [["rouge",[1,0,0]],["vert",[0,1,0]],["bleu",[0,0,1]],["jaune",[1,1,0]],["cyan",[0,1,1]],["magenta",[1,0,1]],["blanc",[1,1,1]]];
SFA.sim({
  id:"p4-c10-couleurs", ch:"c10", tag:"Couleurs",
  titre:"Mélanger les couleurs : lumières, pigments et objets éclairés",
  resume:"Synthèse additive (lumières), soustractive (pigments, filtres) et couleur d'un objet sous une lumière colorée.",
  but:"Choisis le mode. Additif : règle les intensités R, V, B. Soustractif : règle C, M, J. Objet éclairé : choisis la couleur de l'objet et la lumière. Essaie les défis.",
  aRetenir:"Lumières (additif) : rouge + vert = jaune, vert + bleu = cyan, rouge + bleu = magenta, R + V + B = blanc. Pigments et filtres (soustractif) : cyan + jaune = vert, magenta + jaune = rouge, cyan + magenta = bleu, C + M + J ≈ noir. Un objet n'a la couleur que de la lumière qu'il renvoie.",
  piege:"Ne mélange pas les deux synthèses : le jaune est « rouge + vert » en lumière mais c'est une couleur primaire en peinture. Un objet rouge n'est pas « rouge » sous une lumière verte : il paraît noir, car il n'a aucune lumière rouge à renvoyer. (Pigments idéaux.)",
  build:function(k,S){
    var c = k.canvas(260);
    var md = k.seg("Mode", [["add","Lumières (additif)"],["sub","Pigments (soustractif)"],["obj","Objet éclairé"]], "add");
    var a = k.slider("Rouge (R) / Cyan (C)", 0, 100, 5, 100, "%");
    var b = k.slider("Vert (V) / Magenta (M)", 0, 100, 5, 100, "%");
    var d = k.slider("Bleu (B) / Jaune (J)", 0, 100, 5, 0, "%");
    var ob = k.select("Couleur de l'objet (mode « Objet éclairé »)", OBJ.map(function(o){ return [o[0], o[0]]; }), "rouge");
    var defi = k.select("Défi", [["0","Aucun"],["j","Obtenir du JAUNE en lumières"],["w","Obtenir du BLANC en lumières"],["v","Obtenir du VERT avec des pigments"],["k","Obtenir du NOIR avec des pigments"],["n","Faire paraître un objet rouge NOIR (mode objet)"]], "0");
    var ro = k.readouts(["Résultat au centre"]);
    var nt = k.note("", "");
    function rgb(v){ return "rgb(" + v.map(function(x){ return Math.round(255 * Math.max(0, Math.min(1, x))); }).join(",") + ")"; }
    k.draw(function(){
      var P = SFA.draw.palette, ctx = c.ctx, A = a.value / 100, B = b.value / 100, D = d.value / 100, m = md.value, cx = c.W / 2, cy = c.H / 2 + 14, R = Math.min(c.W, c.H) * 0.25, off = R * 0.62, res, i;
      c.clear();
      var pos = [[cx, cy - off * 0.9], [cx - off, cy + off * 0.6], [cx + off, cy + off * 0.6]];
      if (m === "add"){
        ctx.fillStyle = "#000"; ctx.fillRect(0, 0, c.W, c.H); ctx.globalCompositeOperation = "lighter";
        [[A, 0, 0], [0, B, 0], [0, 0, D]].forEach(function(v, j){ ctx.fillStyle = rgb(v); ctx.beginPath(); ctx.arc(pos[j][0], pos[j][1], R, 0, 6.2832); ctx.fill(); });
        ctx.globalCompositeOperation = "source-over"; res = [A, B, D];
        SFA.draw.text(c, "R", pos[0][0], pos[0][1] - R - 10, {size:13, color:"#fff"}); SFA.draw.text(c, "V", pos[1][0] - R - 8, pos[1][1], {size:13, color:"#fff"}); SFA.draw.text(c, "B", pos[2][0] + R + 8, pos[2][1], {size:13, color:"#fff"});
      } else if (m === "sub"){
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.W, c.H); ctx.globalCompositeOperation = "multiply";
        [[1 - A, 1, 1], [1, 1 - B, 1], [1, 1, 1 - D]].forEach(function(v, j){ ctx.fillStyle = rgb(v); ctx.beginPath(); ctx.arc(pos[j][0], pos[j][1], R, 0, 6.2832); ctx.fill(); });
        ctx.globalCompositeOperation = "source-over"; res = [(1 - A), (1 - B), (1 - D)];
        SFA.draw.text(c, "C", pos[0][0], pos[0][1] - R - 10, {size:13, color:"#13233a"}); SFA.draw.text(c, "M", pos[1][0] - R - 8, pos[1][1], {size:13, color:"#13233a"}); SFA.draw.text(c, "J", pos[2][0] + R + 8, pos[2][1], {size:13, color:"#13233a"});
      } else {
        var o = OBJ.filter(function(q){ return q[0] === ob.value; })[0][1], L = [A, B, D];
        res = [L[0] * o[0], L[1] * o[1], L[2] * o[2]];
        ctx.fillStyle = "#1a1f2b"; ctx.fillRect(0, 0, c.W, c.H);
        ctx.fillStyle = rgb(L); ctx.beginPath(); ctx.arc(cx - R * 1.4, cy - R * 0.3, R * 0.55, 0, 6.2832); ctx.fill(); SFA.draw.text(c, "lumière reçue", cx - R * 1.4, cy + R * 0.5, {size:12, color:"#fff"});
        ctx.fillStyle = rgb(o); ctx.fillRect(cx - R * 0.1, cy - R * 0.8, R * 0.9, R * 1.0); SFA.draw.text(c, "objet (" + ob.value + " en lumière blanche)", cx + R * 0.35, cy + R * 0.45, {size:12, color:"#fff"});
        ctx.fillStyle = rgb(res); ctx.beginPath(); ctx.arc(cx + R * 1.35, cy - R * 0.3, R * 0.55, 0, 6.2832); ctx.fill(); SFA.draw.text(c, "ce qu'on voit", cx + R * 1.35, cy + R * 0.5, {size:12, color:"#fff"});
        SFA.draw.arrow(c, cx - R * 0.8, cy - R * 0.3, cx - R * 0.15, cy - R * 0.3, "#fff", 2); SFA.draw.arrow(c, cx + R * 0.85, cy - R * 0.3, cx + R * 0.75, cy - R * 0.3, "#fff", 2);
      }
      ro.set(0, '<span style="display:inline-block;width:18px;height:18px;vertical-align:middle;border:1px solid #8a95a3;background:' + rgb(res) + '"></span> ' + res.map(function(x){ return Math.round(x * 100); }).join(" / ") + " %");
      var df = defi.value, msg = "", ok = false;
      if (df === "j"){ ok = m === "add" && A > 0.95 && B > 0.95 && D < 0.05; msg = "Défi jaune (lumières) : il faut R et V à fond, B à 0. " + (ok ? "Réussi !" : "Pas encore. Passe en mode additif."); }
      else if (df === "w"){ ok = m === "add" && A > 0.95 && B > 0.95 && D > 0.95; msg = "Défi blanc (lumières) : R + V + B à fond. " + (ok ? "Réussi !" : "Pas encore."); }
      else if (df === "v"){ ok = m === "sub" && A > 0.95 && B < 0.05 && D > 0.95; msg = "Défi vert (pigments) : cyan + jaune, sans magenta. " + (ok ? "Réussi !" : "Pas encore. Passe en mode soustractif."); }
      else if (df === "k"){ ok = m === "sub" && A > 0.95 && B > 0.95 && D > 0.95; msg = "Défi noir (pigments) : C + M + J à fond. " + (ok ? "Réussi ! (en vrai on obtient plutôt un brun foncé : les pigments ne sont pas idéaux)" : "Pas encore."); }
      else if (df === "n"){ ok = m === "obj" && ob.value === "rouge" && A < 0.05 && (B > 0.5 || D > 0.5); msg = "Défi : objet rouge qui paraît noir : éclaire-le sans lumière rouge (R = 0), avec du vert ou du bleu. " + (ok ? "Réussi !" : "Pas encore."); }
      else msg = m === "add" ? "Lumières : plus on ajoute de lumière, plus c'est clair. Les trois à fond donnent du blanc." : m === "sub" ? "Pigments : chaque couche absorbe une partie de la lumière. Plus on en ajoute, plus c'est sombre." : "Un objet renvoie seulement les couleurs qu'il contient : lumière reçue × couleur de l'objet.";
      nt.set(msg, df !== "0" && !ok ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c10-sthenope-lentille", ch:"c10", tag:"Comparaison",
  titre:"Sténopé ou lentille : netteté et lumière",
  resume:"Un trou d'épingle est net mais sombre ; une lentille est lumineuse mais n'est nette qu'à la bonne distance.",
  but:"Règle le diamètre du sténopé, l'ouverture de la lentille (f = 50 mm) et la distance de mise au point, puis déplace l'objet (curseur ou clic sur le graphique). Compare les deux images obtenues sur le capteur.",
  aRetenir:"Sténopé : un point de l'objet donne une tache de diamètre ≈ celui du trou, à toute distance (netteté partout, mais très peu de lumière). Lentille : un point donne un point sur le capteur, mais seulement pour la distance de mise au point ; ailleurs, tache de flou. Plus l'ouverture est grande, plus il y a de lumière et moins la profondeur de champ est grande.",
  piege:"Un grand trou de sténopé donne une image floue, pas plus lumineuse « utilement ». Et une lentille grande ouverte n'est nette que dans une plage étroite de distances (faible profondeur de champ). (Optique géométrique : la diffraction est négligée.)",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.5, 0.72), g1 = PX.canvas(k, 0.48, 0.66), f = 50, A0 = {};
    var A = k.slider("Ouverture de la lentille", 2, 25, 1, 12, "mm");
    var a = k.slider("Diamètre du sténopé", 0.1, 3, 0.1, 1, "mm");
    var p0 = k.slider("Mise au point de la lentille", 0.5, 10, 0.5, 2, "m");
    var po = k.slider("Distance de l'objet", 0.3, 10, 0.1, 5, "m");
    var ro = k.readouts(["Flou du sténopé", "Flou de la lentille", "Lumière lentille / sténopé", "Lentille nette (< 0,15 mm) de… à…"]);
    var nt = k.note("", "");
    g1.pointer(function(type, p){ if (type === "up" || type === "move" || !A0.ax) return; po.set(Math.max(0.3, Math.min(10, Math.round(A0.ax.ix(p.x) * 10) / 10))); k.redraw(); });
    var hasF = (function(){ try { return "filter" in document.createElement("canvas").getContext("2d"); } catch (e){ return false; } })();
    var off = document.createElement("canvas");
    function pattern(w, h){
      off.width = w; off.height = h; var o = off.getContext("2d");
      o.fillStyle = "#101826"; o.fillRect(0, 0, w, h);
      o.fillStyle = "#ffe9a8"; o.font = "800 " + Math.round(h * 0.42) + "px Mulish, Arial, sans-serif"; o.textAlign = "center"; o.textBaseline = "middle"; o.fillText("SFA", w / 2, h * 0.38);
      o.fillStyle = "#e0562f"; o.fillRect(w * 0.12, h * 0.68, w * 0.18, h * 0.08); o.fillStyle = "#3ec28f"; o.fillRect(w * 0.41, h * 0.68, w * 0.18, h * 0.08); o.fillStyle = "#5aa0ff"; o.fillRect(w * 0.70, h * 0.68, w * 0.18, h * 0.08);
      o.strokeStyle = "#cfd8e6"; o.lineWidth = 1.5; for (var i = 0; i < 9; i++){ o.beginPath(); o.moveTo(w * (0.12 + i * 0.095), h * 0.84); o.lineTo(w * (0.12 + i * 0.095), h * (i % 2 ? 0.9 : 0.94)); o.stroke(); }
    }
    function blurImg(x, y, w, h, sigma, bright){
      var ctx = c.ctx; ctx.save(); ctx.beginPath(); PX.rr(ctx, x, y, w, h, 8); ctx.clip();
      ctx.fillStyle = "#0b111c"; ctx.fillRect(x, y, w, h);
      pattern(Math.round(w), Math.round(h)); ctx.globalAlpha = bright;
      if (hasF){ ctx.filter = "blur(" + sigma.toFixed(2) + "px)"; ctx.drawImage(off, x, y, w, h); ctx.filter = "none"; }
      else { var n = sigma < 0.6 ? 1 : 12; for (var i = 0; i < n; i++){ var an = i / n * 6.2832; ctx.globalAlpha = bright / (n > 1 ? n / 2.2 : 1); ctx.drawImage(off, x + Math.cos(an) * sigma * 1.5, y + Math.sin(an) * sigma * 1.5, w, h); } }
      ctx.restore(); ctx.save(); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 3; PX.rr(ctx, x, y, w, h, 8); ctx.stroke(); ctx.restore();
    }
    k.draw(function(){
      var d = 1 / (1 / f - 1 / (p0.value * 1000)), Ap = A.value, ap = a.value;
      var lens = function(pm){ var q = 1 / (1 / f - 1 / (pm * 1000)); return Ap * Math.abs(d - q) / q; };
      var pin = function(pm){ return ap * (1 + d / (pm * 1000)); };
      var bp = pin(po.value), bl = lens(po.value), ph = PX.phone(c), pw = (c.W - 36) / 2, phh = Math.min(c.H - 66, pw * 0.72), pxmm = pw / 9;
      c.clear(); PX.bg(c, "#f4f6fa", "#e6ebf3");
      var rel = Math.pow(ap / Ap, 2), brP = Math.min(1, 0.2 + 0.8 * Math.pow(Math.min(1, rel), 0.3));
      [[12, "Sténopé", bp, brP, P.red, "lumière : × " + S.fmt(Math.min(1, rel), 3).replace(/0+$/, "")], [24 + pw, "Lentille", bl, 1, P.acc, "lumière : × 1"]].forEach(function(q, j){
        var x = j ? 24 + pw : 12;
        blurImg(x, 28, pw, phh, q[2] * pxmm / 2.4, q[3]);
        S.draw.label(c, q[1], x + pw / 2, 14, {color:q[4], size:PX.fs(c, 12.5)});
        var sharp = q[2] <= 0.15;
        S.draw.label(c, "tache " + S.fmt(q[2], 2) + " mm : " + (sharp ? "net" : q[2] < 0.5 ? "un peu flou" : "flou"), x + pw / 2, 28 + phh + 16, {color:sharp ? P.green : P.red, size:PX.fs(c, 11)});
        S.draw.label(c, q[5], x + pw / 2, 28 + phh + 36, {color:q[4], size:PX.fs(c, 11)});
      });
      var ymax = Math.max(1.6 * ap, 1);
      g1.clear(); var ax = S.draw.axes(g1, {x0:0.3, x1:10, y0:0, y1:ymax, xl:"distance de l'objet (m)", yl:"flou (mm)", stepX:1}); A0.ax = ax;
      S.draw.fn(g1, ax, pin, P.red, 3); S.draw.fn(g1, ax, lens, P.acc, 3);
      S.draw.line(g1, ax.L, ax.Y(0.15), ax.R, ax.Y(0.15), P.green, 1.5, [5, 4]); S.draw.label(g1, "0,15 mm : net", ax.X(3.4), ax.Y(0.15) - 12, {color:P.green, align:"left", size:11});
      S.draw.label(g1, "sténopé", ax.X(9.8), ax.Y(pin(9.8)) - 12, {color:P.red, align:"right", size:11.5}); S.draw.label(g1, "lentille", ax.X(0.9), ax.Y(Math.min(ymax * 0.9, lens(0.9))) + 14, {color:P.acc, align:"left", size:11.5});
      S.draw.line(g1, ax.X(po.value), ax.B, ax.X(po.value), ax.T, "#b8c0cc", 1.2, [3, 3]); S.draw.dot(g1, ax.X(po.value), ax.Y(Math.min(ymax, bp)), 5.5, P.red); S.draw.dot(g1, ax.X(po.value), ax.Y(Math.min(ymax, bl)), 5.5, P.acc);
      S.draw.line(g1, ax.X(p0.value), ax.B, ax.X(p0.value), ax.B - 12, P.acc, 3); S.draw.label(g1, "mise au point", ax.X(p0.value), ax.B - 24, {color:P.acc, size:10.5});
      var lo = null, hi = null; for (var pm = 0.3; pm <= 10.001; pm += 0.05){ if (lens(pm) <= 0.15){ if (lo === null) lo = pm; hi = pm; } }
      ro.set(0, S.fmt(bp, 2) + " mm"); ro.set(1, S.fmt(bl, 2) + " mm"); ro.set(2, "× " + S.fmt(Math.pow(Ap / ap, 2), 0)); ro.set(3, lo === null ? "nulle part" : S.fmt(lo, 1) + " m à " + (hi >= 9.95 ? "∞" : S.fmt(hi, 1) + " m"));
      nt.set("Objet à " + S.fmt(po.value, 1) + " m : sténopé → tache de " + S.fmt(bp, 2) + " mm ; lentille → tache de " + S.fmt(bl, 2) + " mm. La lentille capte " + S.fmt(Math.pow(Ap / ap, 2), 0) + " fois plus de lumière que ce sténopé." + (rel < 0.5 ? " (Image du sténopé éclaircie sur l'écran pour rester visible.)" : ""), "");
    });
  }
});
})();
