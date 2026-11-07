/* Physique 4e · chapitre 7 · Lumière : sources, ombres et éclipses */
(function(){
var D2R = Math.PI / 180;

SFA.sim({
  id:"p4-c07-ombre", ch:"c07", tag:"Géométrie",
  titre:"Ombre et pénombre : source ponctuelle ou étendue",
  resume:"Une source qui a une taille donne une ombre nette au centre et une pénombre floue autour.",
  but:"Glisse l'objet (noir) et l'écran (gris) à la souris ou au doigt, règle la taille de la source (0 = ponctuelle) et celle de l'objet. La bande à droite de l'écran montre la lumière reçue. (Les échelles horizontale et verticale sont différentes.)",
  aRetenir:"La lumière se propage en ligne droite dans un milieu homogène. Source ponctuelle : ombre nette de largeur h·D/d₁. Source étendue : ombre (aucune lumière) entourée d'une pénombre (une partie de la source est visible). Largeur de l'ombre : (h·D − s·d₂)/d₁.",
  piege:"Plus l'écran est loin de l'objet, plus la pénombre devient large et floue. Si la source est plus grande que l'objet, l'ombre nette rétrécit quand l'écran s'éloigne et peut même disparaître (cas des éclipses annulaires) ; si la source est plus petite que l'objet, l'ombre grandit.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.7, 0.95), st = {hint:true}, geo = {};
    var d1 = k.slider("Distance source – objet d₁", 40, 150, 10, 80, "cm", function(){ st.hint = false; });
    var d2 = k.slider("Distance objet – écran d₂", 20, 150, 10, 80, "cm", function(){ st.hint = false; });
    var h = k.slider("Taille de l'objet h", 5, 40, 5, 20, "cm");
    var s = k.slider("Taille de la source s (0 = ponctuelle)", 0, 40, 5, 10, "cm");
    var ro = k.readouts(["Largeur de l'ombre", "Largeur ombre + pénombre", "Rapport D/d₁"]);
    var nt = k.note("", "");
    var snap = function(v){ return Math.round(v / 10) * 10; };
    PX.drag(k, c, function(){ return geo.xo == null ? [] : [
      {x:geo.xo, y:geo.cy, r:16, set:function(px){ st.hint = false; d1.set(Math.max(40, Math.min(150, snap((px - geo.X0) / geo.sx)))); }},
      {x:geo.xs, y:geo.cy, r:16, set:function(px){ st.hint = false; d2.set(Math.max(20, Math.min(150, snap((px - geo.X0) / geo.sx - d1.value)))); }}]; });
    k.draw(function(){
      var D1 = d1.value, D2 = d2.value, H = h.value, Sz = s.value, D = D1 + D2, ph = PX.phone(c), ctx = c.ctx;
      var pen = (H * D + Sz * D2) / D1, umb = (H * D - Sz * D2) / D1, ymax = Math.max(pen / 2, Sz / 2, H / 2) * 1.15;
      var X0 = ph ? 26 : 34, sx = (c.W - X0 - (ph ? 44 : 56)) / 300, cy = c.H / 2 + 6, sy = (c.H / 2 - 24) / ymax, X = function(x){ return X0 + x * sx; }, Y = function(y){ return cy - y * sy; };
      geo.X0 = X0; geo.sx = sx; geo.cy = cy; geo.xo = X(D1); geo.xs = X(D);
      c.clear(); PX.bg(c, "#1a2036", "#262d4a");
      var Ph = pen / 2, U = umb / 2, xstar = Sz > H ? Sz * D1 / (Sz - H) : Infinity;
      /* cône de lumière (pénombre) et d'ombre */
      ctx.fillStyle = "rgba(255,225,130,.10)"; ctx.beginPath(); ctx.moveTo(X(0), Y(Sz / 2)); ctx.lineTo(X(D), Y(Ph)); ctx.lineTo(X(D), Y(-Ph)); ctx.lineTo(X(0), Y(-Sz / 2)); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.30)"; ctx.beginPath(); ctx.moveTo(X(D1), Y(H / 2)); ctx.lineTo(X(D), Y(Ph)); ctx.lineTo(X(D), Y(-Ph)); ctx.lineTo(X(D1), Y(-H / 2)); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.beginPath(); ctx.moveTo(X(D1), Y(H / 2));
      if (U > 0){ ctx.lineTo(X(D), Y(U)); ctx.lineTo(X(D), Y(-U)); } else { var xe = Math.min(D, xstar); ctx.lineTo(X(xe), Y(0)); }
      ctx.lineTo(X(D1), Y(-H / 2)); ctx.closePath(); ctx.fill();
      /* rayons limites */
      var srcs = Sz === 0 ? [0] : [Sz / 2, -Sz / 2];
      srcs.forEach(function(ys){ [H / 2, -H / 2].forEach(function(yo){ S.draw.line(c, X(0), Y(ys), X(D), Y(ys + (yo - ys) * D / D1), "rgba(255,214,102,.85)", 1.2); }); });
      /* source */
      S.draw.glow(c, X(0), Y(0), Math.max(40, Sz * sy * 0.9), "#ffd24a", 0.6);
      if (Sz === 0) PX.ball(c, X(0), Y(0), 6, "#fff3b0"); else { ctx.fillStyle = "#fff3b0"; PX.rr(ctx, X(0) - 5, Y(Sz / 2), 10, Math.max(4, Sz * sy), 4); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.stroke(); }
      /* objet */
      ctx.fillStyle = PX.lin(c, X(D1) - 5, 0, X(D1) + 5, 0, [[0, "#3a4666"], [1, "#0b1020"]]); PX.rr(ctx, X(D1) - 5, Y(H / 2), 10, Math.max(4, H * sy), 4); ctx.fill();
      /* écran + bande de lumière reçue : fraction de source visible en chaque point */
      var xs = X(D), W = 14, N = Math.max(40, Math.round(2 * ymax * sy)), j;
      ctx.fillStyle = "#59647c"; ctx.fillRect(xs - 2, Y(ymax), 4, 2 * ymax * sy);
      for (j = 0; j < N; j++){
        var y = ymax - (j + 0.5) * 2 * ymax / N, vis;
        var tp = y + (H / 2 - y) * D / D1, bt = y + (-H / 2 - y) * D / D1;
        if (Sz === 0) vis = (0 > bt && 0 < tp) ? 0 : 1;
        else { var ov = Math.max(0, Math.min(tp, Sz / 2) - Math.max(bt, -Sz / 2)); vis = 1 - ov / Sz; }
        var v = Math.round(30 + 200 * vis); ctx.fillStyle = "rgb(" + v + "," + Math.round(v * 0.95) + "," + Math.round(v * 0.72) + ")"; ctx.fillRect(xs + 3, Y(ymax) + j * 2 * ymax * sy / N, W, 2 * ymax * sy / N + 1);
      }
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1; ctx.strokeRect(xs + 3, Y(ymax), W, 2 * ymax * sy);
      /* cotes */
      if (U > 0) PX.dim(c, xs + W + 10, Y(U), xs + W + 10, Y(-U), null, "#ffffff");
      PX.dim(c, xs - 12, Y(Ph), xs - 12, Y(-Ph), null, P.amber);
      S.draw.label(c, "source", X(0) + (ph ? 14 : 22), 13, {color:"#ffd24a", fill:"rgba(255,255,255,.1)", size:11});
      S.draw.label(c, "objet", X(D1), 13, {color:"#d6deeb", fill:"rgba(255,255,255,.1)", size:11});
      S.draw.label(c, "écran", Math.min(c.W - 24, xs + 3), 13, {color:"#d6deeb", fill:"rgba(255,255,255,.1)", size:11});
      S.draw.legend(c, [["#ffffff", ph ? "ombre" : "ombre (sans lumière)"], [P.amber, ph ? "ombre + pénombre" : "ombre + pénombre"]], 6, c.H - 46, {});
      PX.grip(c, X(D1), cy, "#ffffff", st.hint ? "glisse" : null, 6); PX.grip(c, X(D), cy, "#ffffff", null, 6);
      ro.set(0, U > 0 ? S.fmt(umb, 1) + " cm" : "aucune ombre totale"); ro.set(1, S.fmt(pen, 1) + " cm"); ro.set(2, S.fmt(D / D1, 2));
      nt.set(Sz === 0 ? "Source ponctuelle : pas de pénombre, ombre de " + S.fmt(pen, 1) + " cm = " + H + " × " + S.fmt(D / D1, 2) + "." : U > 0 ? "Pénombre de " + S.fmt((pen - umb) / 2, 1) + " cm de chaque côté de l'ombre (s·d₂/d₁)." : "L'écran est trop loin : l'ombre se referme avant l'écran (à " + S.fmt(xstar, 0) + " cm de la source). Il ne reste qu'une pénombre : comme dans une éclipse annulaire.", U > 0 || Sz === 0 ? "" : "warn");
    });
  }
});

SFA.sim({
  id:"p4-c07-eclairement", ch:"c07", tag:"Loi en 1/d²",
  titre:"Éclairement : pourquoi 1/d² ?",
  resume:"Éloigne la lampe : la lumière se répartit sur une surface qui grandit avec le carré de la distance.",
  but:"Choisis l'intensité de la source et déplace le luxmètre (glisse-le à la souris ou au doigt). Compare l'éclairement à d, 2d et 3d : la même lumière se répartit sur 1, 4, 9 carreaux.",
  aRetenir:"L'éclairement E (en lux) d'une petite source d'intensité I à la distance d est E = I/d² (surface perpendiculaire aux rayons). Distance × 2 : surface × 4, éclairement ÷ 4. Distance × 3 : éclairement ÷ 9.",
  piege:"L'éclairement ne diminue pas proportionnellement à la distance (1/d) mais au carré (1/d²). Ce modèle vaut pour une source quasi ponctuelle et une surface perpendiculaire aux rayons.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.82, 1.15), g1 = PX.canvas(k, 0.42, 0.6), st = {hint:true}, geo = {}, A = {};
    var I = k.slider("Intensité de la source", 10, 300, 10, 100, "cd");
    var d = k.slider("Distance du luxmètre", 0.5, 4, 0.1, 1, "m", function(){ st.hint = false; });
    var ro = k.readouts(["Éclairement à d", "Éclairement à 2d", "Rapport E(d)/E(2d)"]);
    var nt = k.note("Repères : pleine lune ≈ 0,3 lx ; rue éclairée ≈ 10 lx ; lecture confortable ≈ 500 lx ; plein soleil ≈ 100 000 lx.", "");
    PX.drag(k, c, function(){ return [{x:geo.mx, y:geo.my, r:22, set:function(px){ st.hint = false; d.set(Math.max(0.5, Math.min(4, Math.round((px - geo.x0) / geo.sx * 10) / 10))); }}]; });
    g1.pointer(function(type, p){ if (type === "up" || type === "move" || !A.ax) return; st.hint = false; d.set(Math.max(0.5, Math.min(4, Math.round(A.ax.ix(p.x) * 10) / 10))); k.redraw(); });
    k.draw(function(){
      var Ii = I.value, dd = d.value, E = Ii / (dd * dd), E2 = Ii / (4 * dd * dd), ph = PX.phone(c);
      c.clear(); var ctx = c.ctx, x0 = 36, cy = c.H * 0.3, sx = (c.W - x0 - 22) / 4, half = Math.tan(14 * D2R), stripY = c.H * 0.56;
      geo.x0 = x0; geo.sx = sx;
      PX.bg(c, "#2a2f45", "#161a2b");
      /* faisceau */
      var xe = c.W - 10, g = ctx.createLinearGradient(x0, 0, xe, 0); g.addColorStop(0, "rgba(255,220,120,.55)"); g.addColorStop(1, "rgba(255,220,120,.06)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(xe, cy - (xe - x0) * half); ctx.lineTo(xe, cy + (xe - x0) * half); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,230,150,.35)"; ctx.lineWidth = 1; [-1, -0.5, 0, 0.5, 1].forEach(function(q){ ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(xe, cy + q * (xe - x0) * half); ctx.stroke(); });
      /* règle en mètres */
      ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.fillStyle = "rgba(255,255,255,.65)"; ctx.font = "700 10px Mulish, sans-serif"; ctx.textAlign = "center";
      for (var m = 0; m <= 4; m++){ ctx.beginPath(); ctx.moveTo(x0 + m * sx, stripY - 14); ctx.lineTo(x0 + m * sx, stripY - 8); ctx.stroke(); ctx.fillText(m + " m", x0 + m * sx, stripY - 1 + 0); }
      /* écrans à d, 2d, 3d */
      [1, 2, 3].forEach(function(q){
        var xp = x0 + q * dd * sx; if (xp > c.W - 12) return; var side = (xp - x0) * half, on = q === 1;
        ctx.fillStyle = on ? "rgba(244,197,66,.95)" : "rgba(214,222,235," + (0.75 - 0.15 * q) + ")"; PX.rr(ctx, xp - 3, cy - side, 6, 2 * side, 3); ctx.fill();
        S.draw.label(c, q === 1 ? "d" : q + "d", xp, cy - side - 12, {color:on ? P.yellow : "#d6deeb", fill:"rgba(255,255,255,.1)", size:11.5});
      });
      /* lampe */
      S.draw.glow(c, x0, cy, 46, "#ffd24a", 0.7); PX.ball(c, x0, cy, 8, "#fff3b0");
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(x0 - 12, cy - 4, 6, 8);
      /* luxmètre */
      var mx = x0 + dd * sx, my = cy + Math.min((mx - x0) * half, c.H * 0.2) + 20 + (ph ? 4 : 0); geo.mx = mx; geo.my = cy;
      S.draw.display(c, S.fmt(E, E < 10 ? 1 : 0) + " lx", mx, cy + (mx - x0) * half + 38 > stripY - 30 ? cy - 0 : cy + (mx - x0) * half + 34, {w:ph ? 84 : 96, h:ph ? 36 : 42, caption:"LUXMÈTRE", size:ph ? 14 : 17});
      PX.grip(c, mx, cy, P.yellow, st.hint ? "glisse" : null, 7);
      /* vue de face : la même lumière sur 1, 4, 9 carreaux */
      var u = Math.min(ph ? 22 : 30, (c.H - stripY - 44) / 3.1), xs = [0.2, 0.5, 0.8].map(function(f){ return c.W * f; });
      [1, 2, 3].forEach(function(q, j){
        var side = q * u, x = xs[j] - side / 2, y = stripY + 8, a = 0.95 / (q * q);
        ctx.fillStyle = "rgba(255,226,120," + a + ")"; ctx.fillRect(x, y, side, side);
        ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; for (var i = 0; i <= q; i++){ ctx.beginPath(); ctx.moveTo(x + i * u, y); ctx.lineTo(x + i * u, y + side); ctx.moveTo(x, y + i * u); ctx.lineTo(x + side, y + i * u); ctx.stroke(); }
        S.draw.label(c, q * q + (q === 1 ? " carreau" : " carreaux"), xs[j], y + 3 * u + 14, {color:"#d6deeb", fill:"rgba(255,255,255,.1)", size:PX.fs(c, 11)});
        S.draw.label(c, "E = " + S.fmt(Ii / (q * dd * q * dd), 1) + " lx", xs[j], y + 3 * u + 34, {color:P.yellow, fill:"rgba(255,255,255,.1)", size:PX.fs(c, 11)});
      });
      g1.clear(); var ymax = Ii / 0.25 * 1.05, ax = S.draw.axes(g1, {x0:0.5, x1:4, y0:0, y1:ymax, xl:"d (m)", yl:"E (lx)", stepX:0.5}); A.ax = ax;
      S.draw.area(g1, ax, function(x){ return Ii / (x * x); }, 0.5, 4, P.acc, 0.08);
      S.draw.fn(g1, ax, function(x){ return Ii / (x * x); }, P.acc, 3);
      if (500 < ymax){ S.draw.line(g1, ax.L, ax.Y(500), ax.R, ax.Y(500), P.green, 1.5, [5, 4]); S.draw.label(g1, "500 lx : lecture", ax.R - 4, ax.Y(500) - 12, {color:P.green, align:"right", size:11}); }
      S.draw.dot(g1, ax.X(dd), ax.Y(E), 6, P.red); if (2 * dd <= 4) S.draw.dot(g1, ax.X(2 * dd), ax.Y(E2), 6, "#5f6b7a");
      ro.set(0, S.fmt(E, E < 10 ? 1 : 0) + " lx"); ro.set(1, 2 * dd <= 4 ? S.fmt(E2, E2 < 10 ? 1 : 0) + " lx" : S.fmt(E2, 1) + " lx (hors graphique)"); ro.set(2, "4");
    });
  }
});

SFA.sim({
  id:"p4-c07-eclipses", ch:"c07", tag:"Astronomie",
  titre:"Éclipses : pourquoi pas tous les mois ?",
  resume:"Une éclipse exige un alignement presque parfait : la Lune doit être près du plan de l'orbite terrestre.",
  but:"Glisse la Lune vers le haut ou le bas (ou règle sa hauteur) et regarde si les ombres atteignent la cible. En bas, les 24 alignements d'une année : clique sur un point pour le voir en grand et compte les vraies éclipses. Schéma non à l'échelle.",
  aRetenir:"Éclipse de Soleil : Lune entre Soleil et Terre (nouvelle lune). Éclipse de Lune : Terre entre Soleil et Lune (pleine lune). L'orbite de la Lune est inclinée d'environ 5° sur l'orbite de la Terre : la plupart du temps, la Lune passe trop haut ou trop bas, donc pas d'éclipse chaque mois.",
  piege:"Toutes les nouvelles lunes ne donnent pas d'éclipse de Soleil, et toutes les pleines lunes ne donnent pas d'éclipse de Lune. Les ombres sont aussi bien plus petites que la Terre (ombre de la Lune ≈ quelques centaines de km de large sur la Terre).",
  build:function(k,S){
    var P = S.draw.palette, D2R = Math.PI / 180, c = PX.canvas(k, 0.64, 0.95), g1 = PX.canvas(k, 0.36, 0.55), st = {sel:-1, hint:true}, geo = {}, ZM = 5.4, TH = 1.55;
    var typ = k.seg("Phase", [["pl","Pleine lune"],["nl","Nouvelle lune"]], "pl", function(){ st.sel = -1; });
    var z = k.slider("Hauteur de la Lune au-dessus du plan", -6, 6, 0.1, 0.3, "R<sub>T</sub>", function(){ st.sel = -1; st.hint = false; });
    var u0 = k.slider("Orientation de l'orbite lunaire au 1er janvier", 0, 350, 10, 40, "°");
    k.button("Orbite sans inclinaison (z = 0)", function(){ st.sel = -1; z.set(0); });
    var ro = k.readouts(["Latitude de la Lune", "Résultat", "Alignements avec éclipse (sur 24)"]);
    var nt = k.note("Repère : avec l'inclinaison réelle de 5°, z varie entre −5,4 et +5,4 R<sub>T</sub> au cours d'un mois (1 R<sub>T</sub> = rayon de la Terre).", "");
    function zAt(i){ return ZM * Math.sin((u0.value + 360 * (i * 14.765) / 27.2122) * D2R); }
    PX.drag(k, c, function(){ return geo.mx == null ? [] : [{x:geo.mx, y:geo.my, r:14, set:function(px, py){ st.sel = -1; st.hint = false; z.set(Math.round(Math.max(-6, Math.min(6, (geo.cy - py) / geo.RE)) * 10) / 10); }}]; });
    g1.pointer(function(type, p){
      if (type !== "down" || !geo.gx) return; var best = -1, bd = 24;
      for (var i = 0; i < 24; i++){ var d = Math.abs(geo.gx(i) - p.x); if (d < bd){ bd = d; best = i; } }
      if (best >= 0){ st.sel = best; st.hint = false; typ.set(best % 2 ? "pl" : "nl"); z.set(Math.round(zAt(best) * 10) / 10); k.redraw(); }
    });
    k.draw(function(){
      var Z = z.value, T = typ.value, a = Math.abs(Z), ph = PX.phone(c), ctx, res, kind;
      var RE = Math.min(24, (c.H / 2 - 26) / 6.3), cx = c.W * 0.5, cy = c.H / 2, md = Math.min(170, c.W * 0.34), rm = Math.max(5, RE * 0.28);
      geo.RE = RE; geo.cy = cy;
      c.clear(); ctx = c.ctx; PX.bg(c, "#0e1428", "#1b2342");
      for (var s = 0; s < 40; s++){ ctx.fillStyle = "rgba(255,255,255," + (0.25 + 0.5 * ((s * 37) % 10) / 10) + ")"; ctx.fillRect((s * 97) % c.W, (s * 53) % c.H, 1.3, 1.3); }
      var sx = ph ? 24 : 34; S.draw.glow(c, sx, cy, 64, P.yellow, 0.5); PX.ball(c, sx, cy, ph ? 15 : 20, "#ffd24a");
      S.draw.label(c, "Soleil", sx, cy - (ph ? 28 : 34), {color:"#ffd24a", fill:"rgba(255,255,255,.1)", size:11.5});
      /* lumière du Soleil */
      ctx.fillStyle = "rgba(255,226,130,.07)"; ctx.fillRect(sx + 10, cy - 6.3 * RE, c.W, 12.6 * RE);
      S.draw.line(c, sx + 22, cy, c.W - 6, cy, "rgba(200,210,235,.25)", 1, [3, 4]);
      var rx, ry, ex;
      if (T === "pl"){
        var xm = cx + md, ym = cy - Z * RE; geo.mx = xm; geo.my = ym; ex = xm;
        var g = ctx.createLinearGradient(cx, 0, xm, 0); g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,.2)");
        ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.moveTo(cx, cy - RE); ctx.lineTo(xm, cy - RE * 1.28); ctx.lineTo(xm, cy + RE * 1.28); ctx.lineTo(cx, cy + RE); ctx.closePath(); ctx.fill();
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, cy - RE); ctx.lineTo(xm, cy - RE * 0.72); ctx.lineTo(xm, cy + RE * 0.72); ctx.lineTo(cx, cy + RE); ctx.closePath(); ctx.fill();
        S.draw.label(c, "ombre", (cx + xm) / 2, cy + RE * 0.9 + 4, {color:"#c9d3df", fill:"rgba(255,255,255,.1)", size:11});
        PX.ball(c, cx, cy, RE, "#2f7fd1"); S.draw.label(c, "Terre", cx, cy + RE + 14, {color:"#9cc3ee", fill:"rgba(255,255,255,.1)", size:11.5});
        res = a + 0.2725 <= 0.72 ? "Éclipse TOTALE de Lune" : a < 0.72 + 0.2725 ? "Éclipse PARTIELLE de Lune" : a < 1.28 + 0.2725 ? "Éclipse de Lune par la pénombre (peu visible)" : "Pas d'éclipse de Lune";
        PX.ball(c, xm, ym, rm, "#cfd3da"); kind = "L";
      } else {
        var xl = cx - md, yl = cy - Z * RE; geo.mx = xl; geo.my = yl; ex = xl;
        ctx.fillStyle = "rgba(0,0,0,.30)"; ctx.beginPath(); ctx.moveTo(xl, yl - rm); ctx.lineTo(cx, yl - RE * 0.55); ctx.lineTo(cx, yl + RE * 0.55); ctx.lineTo(xl, yl + rm); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,.65)"; ctx.beginPath(); ctx.moveTo(xl, yl - rm); ctx.lineTo(cx, yl); ctx.lineTo(xl, yl + rm); ctx.closePath(); ctx.fill();
        PX.ball(c, cx, cy, RE, "#2f7fd1"); S.draw.label(c, "Terre", cx, cy + RE + 14, {color:"#9cc3ee", fill:"rgba(255,255,255,.1)", size:11.5});
        PX.ball(c, xl, yl, rm, "#8a95a3");
        res = a <= 1.0 ? "Éclipse CENTRALE de Soleil (totale ou annulaire)" : a < TH ? "Éclipse PARTIELLE de Soleil" : "Pas d'éclipse de Soleil"; kind = "S";
      }
      S.draw.label(c, "Lune", geo.mx, geo.my - rm - 12, {color:"#e6e9ef", fill:"rgba(255,255,255,.12)", size:11.5});
      PX.grip(c, geo.mx, geo.my, a < TH ? P.green : P.red, st.hint ? "glisse la Lune" : null, 6);
      S.draw.label(c, "z = " + S.fmt(Z, 1) + " R" + "T", geo.mx + (T === "pl" ? 0 : 0), c.H - 12, {color:"#e6e9ef", fill:"rgba(255,255,255,.12)", size:11});
      /* vignette : vue depuis la Terre */
      var R = ph ? 20 : 26, ix = c.W - R - 14, iy = R + 18, hit = a < TH;
      S.draw.panel(c, ix - R - 8, iy - R - 14, 2 * R + 16, 2 * R + 28, {fill:"rgba(10,16,34,.8)", stroke:"rgba(255,255,255,.18)", shadow:false});
      ctx.save(); ctx.beginPath(); ctx.arc(ix, iy, R, 0, 6.2832); ctx.clip();
      if (kind === "L"){
        ctx.fillStyle = "#e9e4d2"; ctx.fillRect(ix - R, iy - R, 2 * R, 2 * R);
        var off = Z / 0.2725 * R * 0.55, ur = 0.72 / 0.2725 * R; ctx.fillStyle = "rgba(120,40,20,.82)"; ctx.beginPath(); ctx.arc(ix, iy + off, ur, 0, 6.2832); ctx.fill();
      } else {
        S.draw.glow(c, ix, iy, R * 1.6, "#ffd24a", .9); ctx.fillStyle = "#ffd96b"; ctx.fillRect(ix - R, iy - R, 2 * R, 2 * R);
        var off2 = a <= 1 ? 0 : Math.min(3, (a - 1) / 0.55 * 2) * R; ctx.fillStyle = "#14192b"; ctx.beginPath(); ctx.arc(ix, iy + off2 * (Z < 0 ? 1 : -1), R * 1.02, 0, 6.2832); ctx.fill();
      }
      ctx.restore(); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ix, iy, R, 0, 6.2832); ctx.stroke();
      S.draw.text(c, "vu de la Terre", ix, iy + R + 8, {size:9.5, color:"#c9d3df", weight:700});
      S.draw.label(c, res, c.W / 2, 16, {color:hit ? P.green : P.red, size:ph ? 11 : 12.5, fill:"rgba(255,255,255,.92)"});
      /* frise des 24 alignements de l'année */
      g1.clear(); var gc = g1.ctx, L = 34, Rr = g1.W - 12, T0 = 18, B = g1.H - 22, i, n = 0;
      var gx = function(j){ return L + (j + 0.5) * (Rr - L) / 24; }, gy = function(v){ return (T0 + B) / 2 - v / 6.2 * (B - T0) / 2; }; geo.gx = gx;
      gc.fillStyle = "rgba(36,119,90,.14)"; gc.fillRect(L, gy(TH), Rr - L, gy(-TH) - gy(TH));
      S.draw.line(g1, L, gy(0), Rr, gy(0), "#a3adba", 1);
      S.draw.text(g1, "z (R" + "T)", 18, 8, {size:10, color:"#5f6b7a"}); S.draw.text(g1, "zone d'éclipse", Rr - 44, gy(TH) - 7, {size:10, color:P.green});
      [-5, 0, 5].forEach(function(v){ S.draw.text(g1, String(v), L - 12, gy(v), {size:10, color:"#8a95a3"}); });
      var mo = ["J","F","M","A","M","J","J","A","S","O","N","D"];
      for (i = 0; i < 24; i++){
        var zi = zAt(i), ok = Math.abs(zi) < TH; if (ok) n++;
        if (i % 2 === 0) S.draw.text(g1, mo[i / 2], gx(i) + (Rr - L) / 48, B + 12, {size:10, color:"#8a95a3"});
        gc.fillStyle = ok ? P.green : "#b6bfcb"; gc.strokeStyle = i === st.sel ? P.ink : (i % 2 ? "#7a8594" : "#5f6b7a"); gc.lineWidth = i === st.sel ? 3 : 1.4;
        gc.beginPath(); gc.arc(gx(i), gy(zi), ok ? 6 : 4.5, 0, 6.2832); gc.fill(); gc.stroke();
        if (i % 2 === 0){ gc.fillStyle = "#0f1b2d"; gc.beginPath(); gc.arc(gx(i), gy(zi), 1.8, 0, 6.2832); gc.fill(); }
      }
      S.draw.text(g1, "● nouvelle lune   ○ pleine lune", (L + Rr) / 2, 8, {size:10, color:"#5f6b7a"});
      var lat = Math.asin(Math.max(-1, Math.min(1, Z / 60.3))) / D2R;
      ro.set(0, S.fmt(lat, 1) + " °"); ro.set(1, res); ro.set(2, n + " éclipses");
      nt.set(hit ? "Alignement suffisant : l'ombre ou la pénombre atteint la cible." : "La Lune passe trop haut ou trop bas : son ombre (ou la Terre) la manque. C'est la situation de la plupart des mois. Sur l'année : " + n + " alignements sur 24 donnent une éclipse.", hit ? "" : "warn");
    });
  }
});

SFA.sim({
  id:"p4-c07-phases", ch:"c07", tag:"Astronomie",
  titre:"Les phases de la Lune",
  resume:"La Lune est toujours à moitié éclairée par le Soleil ; selon sa position, on en voit plus ou moins.",
  but:"Glisse la Lune sur son orbite (ou lance le mois en accéléré) : en haut la vue d'en haut, en bas ce qu'on voit depuis la Terre. Clique sur une phase de la frise pour y aller. Défi : place la Lune pour obtenir la phase demandée.",
  aRetenir:"Le Soleil éclaire toujours une moitié de la Lune. Les phases dépendent de l'angle Soleil–Terre–Lune : on voit de face la face éclairée à la pleine lune, de dos à la nouvelle lune. Le cycle dure environ 29,5 jours.",
  piege:"Les phases ne sont PAS dues à l'ombre de la Terre ! Cette ombre n'intervient que lors d'une éclipse de Lune. Sur ce schéma vu d'en haut, la Lune pleine semble tomber dans l'ombre, mais c'est un effet de la vue : l'orbite de la Lune est inclinée de 5° et, la plupart des mois, elle passe au-dessus ou en dessous de l'ombre (voir la simulation « Éclipses »).",
  build:function(k,S){
    var P = S.draw.palette, D2R = Math.PI / 180, c = PX.canvas(k, 0.62, 0.9), m = PX.canvas(k, 0.5, 0.78), st = {a:60, hint:true}, geo = {}, mgeo = {};
    var al = k.slider("Angle Soleil – Terre – Lune", 0, 360, 5, 60, "°", function(v){ st.a = v; st.hint = false; });
    var sh = k.toggle("Montrer l'ombre de la Terre (vue d'en haut, non à l'échelle, inclinaison de 5° invisible)", false);
    var CH = [["","Aucun défi"],[90,"Défi : premier quartier"],[180,"Défi : pleine lune"],[270,"Défi : dernier quartier"],[45,"Défi : premier croissant"],[225,"Défi : gibbeuse décroissante"]];
    var ch = k.select("Défi", CH, "");
    var ro = k.readouts(["Âge de la Lune (jours)", "Partie éclairée visible", "Phase"]);
    var lp = k.loop(function(dt){ st.a = (st.a + dt * 40) % 360; al.set(st.a); k.redraw(); });
    k.button("▶ / ❚❚ Un mois en accéléré", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var nt = k.note("", "");
    var PH = [[0,"Nouvelle"],[45,"1er croissant"],[90,"1er quartier"],[135,"Gibbeuse +"],[180,"Pleine"],[225,"Gibbeuse −"],[270,"Dernier quart."],[315,"Dernier crois."]];
    function nom(a){ return a < 10 || a > 350 ? "Nouvelle lune" : a < 80 ? "Premier croissant" : a <= 100 ? "Premier quartier" : a < 170 ? "Gibbeuse croissante" : a <= 190 ? "Pleine lune" : a < 260 ? "Gibbeuse décroissante" : a <= 280 ? "Dernier quartier" : "Dernier croissant"; }
    var MARIA = [[-0.3,-0.35,0.28],[0.25,-0.2,0.22],[0.1,0.25,0.3],[-0.35,0.2,0.16],[0.45,0.3,0.12],[-0.05,-0.62,0.14]];
    /* disque lunaire vu de la Terre : a = angle S-T-L, hémisphère nord */
    function moonDisc(g, x, y, R, a){
      var ctx = g.ctx, ar = a * D2R, wax = a <= 180, aa = wax ? ar : (360 - a) * D2R, ck = Math.cos(aa), sgn = wax ? 1 : -1, n = 48, j, yy, xr;
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, 6.2832); ctx.clip();
      ctx.fillStyle = "#2a3550"; ctx.fillRect(x - R, y - R, 2 * R, 2 * R);
      ctx.fillStyle = "rgba(120,150,200,.10)"; ctx.fillRect(x - R, y - R, 2 * R, 2 * R);
      ctx.beginPath();
      for (j = 0; j <= n; j++){ yy = -R + 2 * R * j / n; xr = Math.sqrt(Math.max(0, R * R - yy * yy)); ctx[j ? "lineTo" : "moveTo"](x + sgn * xr, y + yy); }
      for (j = n; j >= 0; j--){ yy = -R + 2 * R * j / n; xr = Math.sqrt(Math.max(0, R * R - yy * yy)); ctx.lineTo(x + sgn * ck * xr, y + yy); }
      ctx.closePath(); ctx.fillStyle = "#f3efe0"; ctx.fill(); ctx.clip();
      ctx.fillStyle = "rgba(150,145,130,.38)"; MARIA.forEach(function(q){ ctx.beginPath(); ctx.arc(x + q[0] * R, y + q[1] * R, q[2] * R, 0, 6.2832); ctx.fill(); });
      ctx.restore(); ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, R, 0, 6.2832); ctx.stroke();
    }
    PX.drag(k, c, function(){ return geo.mx == null ? [] : [{x:geo.mx, y:geo.my, r:16, set:function(px, py){ st.hint = false; var q = Math.atan2(py - geo.cy, geo.cx - px) / D2R; q = ((Math.round(q / 5) * 5) % 360 + 360) % 360; st.a = q; al.set(q); }}]; });
    m.pointer(function(type, p){ if (type !== "down") return; (mgeo.strip || []).forEach(function(s){ if (Math.hypot(p.x - s.x, p.y - s.y) < s.r + 8){ st.a = s.a; al.set(s.a); st.hint = false; k.redraw(); } }); });
    k.draw(function(){
      var a = st.a, ar = a * D2R, ph = PX.phone(c), cx = c.W * 0.56, cy = c.H / 2, Ro = Math.min(c.W * 0.36, c.H / 2 - 24), Rm = ph ? 11 : 14, ctx;
      c.clear(); ctx = c.ctx; PX.bg(c, "#0e1428", "#1b2342");
      for (var s = 0; s < 40; s++){ ctx.fillStyle = "rgba(255,255,255," + (0.2 + 0.5 * ((s * 37) % 10) / 10) + ")"; ctx.fillRect((s * 97) % c.W, (s * 53) % c.H, 1.3, 1.3); }
      S.draw.glow(c, -6, cy, 90, P.yellow, 0.6); PX.ball(c, 4, cy, ph ? 20 : 26, "#ffd24a");
      for (var i = -3; i <= 3; i++){ if (!i) S.draw.line(c, 36, cy, cx - 24, cy, "rgba(255,226,130,.45)", 1.4, [6, 5]); else S.draw.line(c, 36, cy + i * 0.28 * Ro, cx - Ro - 20 > 60 ? cx - Ro - 14 : 70, cy + i * 0.28 * Ro, "rgba(255,226,130,.35)", 1.4); }
      S.draw.label(c, "lumière du Soleil", 62, 14, {color:"#ffd24a", fill:"rgba(255,255,255,.1)", size:11, align:"left"});
      if (sh.value){ ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(cx, cy - 20, c.W - cx, 40); S.draw.label(c, "ombre de la Terre", c.W - 62, cy - 32, {color:"#c9d3df", fill:"rgba(255,255,255,.1)", size:11}); }
      ctx.strokeStyle = "rgba(200,210,235,.35)"; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.arc(cx, cy, Ro, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
      PX.ball(c, cx, cy, ph ? 18 : 22, "#2f7fd1"); S.draw.label(c, "Terre", cx, cy + 36, {color:"#9cc3ee", fill:"rgba(255,255,255,.1)", size:11.5});
      var mx = cx - Ro * Math.cos(ar), my = cy + Ro * Math.sin(ar); geo.mx = mx; geo.my = my; geo.cx = cx; geo.cy = cy;
      /* angle S-T-L */
      ctx.strokeStyle = "rgba(244,197,66,.7)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 34, Math.PI, Math.PI - ar, true); ctx.stroke();
      S.draw.line(c, cx, cy, mx, my, "rgba(200,210,235,.3)", 1);
      /* Lune : moitié tournée vers le Soleil éclairée */
      ctx.fillStyle = "#2a3550"; ctx.beginPath(); ctx.arc(mx, my, Rm, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#f3efe0"; ctx.beginPath(); ctx.arc(mx, my, Rm, Math.PI / 2, 3 * Math.PI / 2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mx, my, Rm, 0, 6.2832); ctx.stroke();
      PX.grip(c, mx, my, P.yellow, st.hint ? "glisse la Lune" : null, 5);
      S.draw.label(c, S.fmt(a, 0) + " °", cx - 52 * Math.cos(ar / 2), cy + 52 * Math.sin(ar / 2) * 0.6 + (ar < 0.6 ? -14 : 0), {color:"#ffd24a", fill:"rgba(255,255,255,.1)", size:11});
      /* vue depuis la Terre + frise */
      m.clear(); var g = m.ctx; PX.bg(m, "#0e1428", "#1b2342");
      var big = Math.min(m.H * 0.3, 62), sr = Math.min(15, m.W / 20), sy = m.H - sr - 22, bx = m.W / 2, by = 14 + big;
      moonDisc(m, bx, by, big, a);
      S.draw.label(m, (ph ? "Vue de la Terre · " : "Vue depuis la Terre (hémisphère nord) · ") + nom(a), m.W / 2, 11, {color:"#ffd24a", fill:"rgba(255,255,255,.1)", size:ph ? 11 : 12});
      mgeo.strip = [];
      PH.forEach(function(q, j){
        var x = (j + 0.5) * m.W / 8, cur = Math.abs(((a - q[0] + 540) % 360) - 180) < 22.5;
        moonDisc(m, x, sy, sr, q[0]); mgeo.strip.push({x:x, y:sy, r:sr, a:q[0]});
        if (cur){ g.strokeStyle = P.yellow; g.lineWidth = 2.4; g.beginPath(); g.arc(x, sy, sr + 4, 0, 6.2832); g.stroke(); }
        S.draw.text(m, ph ? ["N","PC","PQ","G+","P","G−","DQ","DC"][j] : q[1], x, sy + sr + 12, {size:ph ? 10 : 9.5, color:cur ? "#ffd24a" : "#9aa7bb", weight:700});
      });
      var frac = (1 - Math.cos(ar)) / 2;
      ro.set(0, S.fmt(a / 360 * 29.53, 1) + " j"); ro.set(1, S.fmt(frac * 100, 0) + " %"); ro.set(2, nom(a));
      var tg = ch.value === "" ? null : +ch.value;
      if (tg == null) nt.set("Moitié éclairée toujours tournée vers le Soleil : depuis la Terre, on en voit " + S.fmt(frac * 100, 0) + " %.", "");
      else { var ok = Math.abs(((a - tg + 540) % 360) - 180) <= 12; nt.set(ok ? "Réussi : angle Soleil–Terre–Lune de " + S.fmt(a, 0) + " °, c'est bien « " + nom(a).toLowerCase() + " »." : "Place la Lune pour obtenir la phase demandée. Indice : à la pleine lune, la Terre est entre le Soleil et la Lune.", ok ? "" : "warn"); }
    });
  }
});
})();
