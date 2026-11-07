(function(){
var P = SFA.draw.palette, F = SFA.fmt;
/*@@H:m5-c06-cloture*/
function clPosts(c, S, x1, y1, x2, y2, n, col){
  var d = Math.hypot(x2 - x1, y2 - y1), m = Math.max(1, Math.round(d / 14));
  S.draw.line(c, x1, y1, x2, y2, col, 2.4);
  for (var i = 0; i <= m; i++){ var t = i / m; S.draw.dot(c, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 2.6, "#7a5230"); }
}
/*@@E:m5-c06-cloture*/
/*@@H:m5-c06-boite*/
function bxProj(c, cx, cy, sc, yaw, pit, dist){
  /* z vers le haut ; perspective légère ; renvoie une fonction p([x,y,z]) -> [sx, sy, profondeur] */
  var cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
  return function(p){
    var x1 = p[0] * cyw - p[1] * syw, y1 = p[0] * syw + p[1] * cyw, y2 = y1 * cp - p[2] * sp, z2 = y1 * sp + p[2] * cp, f = 1 / (1 + y2 / dist);
    return [cx + x1 * sc * f, cy - z2 * sc * f, y2];
  };
}
function bxPoly(c, S, pts, fill, stroke){
  var ctx = c.ctx; ctx.save(); ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.lineJoin = "round"; ctx.lineWidth = 1.5; ctx.strokeStyle = stroke; ctx.stroke(); ctx.restore();
}
/*@@E:m5-c06-boite*/
function line(c, ax, x0, y0, m, col, dash, w){ SFA.draw.line(c, ax.X(ax.x0), ax.Y(y0 + m * (ax.x0 - x0)), ax.X(ax.x1), ax.Y(y0 + m * (ax.x1 - x0)), col, w || 2, dash); }
function clipped(c, ax, fn){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); fn(); ctx.restore(); }
function rect(c, x, y, w, h, fill, stroke){ var ctx = c.ctx; if (fill){ ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h); } }

/* 1. Boîte sans couvercle */
SFA.sim({
  id:"m5-c06-boite", ch:"c06", tag:"Classique",
  titre:"La boîte au plus grand volume",
  resume:"Découpe des carrés dans les coins d'une feuille et plie : V(x) = x(a − 2x)².",
  but:"Glisse le coin rouge sur la feuille (ou le point sur la courbe) pour changer la découpe x, puis plie la feuille pour voir la boîte. Cherche le volume maximal, puis compare avec le calcul : V′(x) = 0.",
  aRetenir:"V(x) = x(a − 2x)² pour 0 < x < a/2. V′(x) = (a − 2x)(a − 6x) s'annule en x = a/6 (l'autre racine a/2 est une borne). V′ > 0 avant, < 0 après : maximum en x = a/6, de valeur 2a³/27.",
  piege:"Le domaine compte : x ne peut pas dépasser a/2. Et V′ = 0 ne suffit pas : on vérifie le changement de signe (ou on compare les valeurs aux bornes, où V = 0).",
  build:function(k, S){
    var c = k.canvas(560);
    var a = k.slider("Côté a de la feuille", 10, 40, 2, 24, "cm");
    var x = k.slider("Côté x des carrés découpés", 0, 20, 0.1, 4, "cm");
    var fold = 1, dir = 0, anim = k.loop(function(dt){ fold += dir * dt / 1.1; if (fold >= 1){ fold = 1; anim.pause(); } if (fold <= 0){ fold = 0; anim.pause(); } k.redraw(); });
    k.button("▶ Plier / déplier la feuille", function(){ dir = fold > 0.5 ? -1 : 1; anim.play(); }, true);
    var ro = k.readouts(["Base (a − 2x)", "Volume V(x)", "V′(x)", "Volume max (calcul)"]);
    var nt = k.note("", "ok");
    var net = null, ax = null, mode = "";
    c.pointer(function(type, p){
      if (type === "down") mode = (ax && p.y > ax.T - 8) ? "g" : (net && p.x < net.x + net.s + 14 && p.y < 230 ? "n" : "");
      if ((type === "down" || type === "drag") && mode){
        var A = a.value, v = mode === "g" ? ax.ix(p.x) : (p.x - net.x) / net.sc;
        x.set(Math.round(Math.max(0, Math.min(A / 2, v)) * 10) / 10); k.redraw();
      }
      if (type === "up") mode = "";
    });
    k.draw(function(){
      c.clear(); var A = a.value, X = Math.min(x.value, A / 2), V = function(t){ return t * (A - 2*t) * (A - 2*t); };
      var topH = 262, ns = Math.min(196, c.W * 0.42), sc = ns / A, nx = 14, ny = 14;
      net = {x:nx, y:ny, s:ns, sc:sc};
      /* feuille à plat avec les 4 carrés */
      S.draw.panel(c, 4, 4, c.W - 8, topH - 4, {fill:"#fafbfd", stroke:"#e3e7ed", radius:12, shadow:false});
      var xs = X * sc, ctx = c.ctx;
      c.ctx.fillStyle = S.draw.tint(P.acc, 0.18); c.ctx.fillRect(nx, ny, ns, ns); c.ctx.strokeStyle = P.acc; c.ctx.lineWidth = 1.6; c.ctx.strokeRect(nx, ny, ns, ns);
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(function(q){
        var rx = nx + q[0] * (ns - xs), ry = ny + q[1] * (ns - xs);
        ctx.fillStyle = S.draw.tint(P.red, 0.22); ctx.fillRect(rx, ry, xs, xs); ctx.setLineDash([4, 3]); ctx.strokeStyle = P.red; ctx.lineWidth = 1.5; ctx.strokeRect(rx, ry, xs, xs); ctx.setLineDash([]);
      });
      S.draw.dot(c, nx + xs, ny + xs, 7, P.red); S.draw.glow(c, nx + xs, ny + xs, 16, P.red, 0.4);
      S.draw.label(c, "x = " + F(X, 1), nx + xs / 2 + 6, ny + xs + 14, {color:P.red, size:11});
      S.draw.text(c, "feuille " + F(A, 0) + " × " + F(A, 0) + " cm", nx + ns / 2, ny + ns + 16, {size:12, color:P.grey});
      S.draw.text(c, "↔ glisse le coin", nx + ns / 2, ny + ns + 32, {size:11, color:P.red});
      /* boîte en 3D (la feuille se plie) */
      var th = fold * Math.PI / 2, s = A - 2 * X, bx0 = net.x + ns + 24, cw = c.W - bx0 - 8, cx = bx0 + cw / 2, cyy = topH * 0.6;
      var pr = bxProj(c, cx, cyy, Math.min(cw, 250) / (A * 1.25), 0.62, 0.55, A * 3.2), h = s / 2;
      var faces = [];
      faces.push({p:[[-h, -h, 0], [h, -h, 0], [h, h, 0], [-h, h, 0]], col:P.acc, a:0.34});
      var E = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      E.forEach(function(e){
        /* charnière le long du bord ; le rabat tourne vers le haut */
        var nxv = e[0], nyv = e[1], tx = -nyv, ty = nxv, pts = [];
        [[-h, 0], [h, 0], [h, X], [-h, X]].forEach(function(q){ var u = q[0], v = q[1];
          pts.push([nxv * (h + v * Math.cos(th)) + tx * u, nyv * (h + v * Math.cos(th)) + ty * u, v * Math.sin(th)]); });
        faces.push({p:pts, col:P.teal, a:0.5});
      });
      faces.forEach(function(f){ f.q = f.p.map(pr); f.d = f.q.reduce(function(m, p){ return m + p[2]; }, 0) / f.q.length; });
      faces.sort(function(m, n){ return n.d - m.d; });
      faces.forEach(function(f){ bxPoly(c, S, f.q, S.draw.tint(f.col, f.a), f.col); });
      S.draw.text(c, fold > 0.95 ? "boîte pliée : base " + F(s, 1) + " × " + F(s, 1) + ", hauteur " + F(X, 1) : "feuille en cours de pliage…", cx, topH - 14, {size:12, color:P.ink});
      /* courbe V(x) */
      ax = S.draw.axes(c, {x0:0, x1:A / 2, y0:0, y1:2 * A * A * A / 27 * 1.15, l:58, xl:"x (cm)", yl:"V (cm³)", t:topH + 20, b:30});
      S.draw.fn(c, ax, V, P.acc, 2.8);
      S.draw.line(c, ax.X(A / 6), ax.B, ax.X(A / 6), ax.Y(V(A / 6)), P.green, 1.3, [4, 4]);
      S.draw.label(c, "max en a/6 = " + F(A / 6, 2), ax.X(A / 6) + 8, ax.B - 14, {color:P.green, align:"left", size:11});
      S.draw.line(c, ax.X(X), ax.Y(V(X)), ax.X(X), ax.B, P.red, 1.2, [3, 3]);
      S.draw.glow(c, ax.X(X), ax.Y(V(X)), 18, P.red, 0.4); S.draw.dot(c, ax.X(X), ax.Y(V(X)), 7.5, P.red);
      var dv = (A - 2*X) * (A - 6*X);
      ro.set(0, F(A - 2*X, 1) + " cm"); ro.set(1, F(V(X), 1) + " cm³"); ro.set(2, F(dv, 1)); ro.set(3, F(V(A / 6), 1) + " cm³");
      var near = Math.abs(X - A / 6) < 0.15 + 1e-9;
      nt.set((near ? "<b>Bravo : tu es au maximum.</b> " : "") + "V′(x) = (a − 2x)(a − 6x) = " + F(dv, 1) + " : " + (dv > 1e-9 ? "V croît encore, découpe davantage." : dv < -1e-9 ? "V décroît, découpe moins." : "tangente horizontale.") + " Optimum calculé : x = a/6 = " + F(A / 6, 2) + " cm, V = " + F(V(A / 6), 1) + " cm³." + (x.value > A / 2 ? " (x est limité à a/2 : plus de base.)" : ""), near ? "ok" : "");
    });
  }
});

/* 2. Tangente qui tourne */
var TG = {
  a:{n:"f(x) = x³ − 3x", f:function(x){ return x*x*x - 3*x; }, d:function(x){ return 3*x*x - 3; }, cr:[[-1, "max"], [1, "min"]], w:[-5, 5], wd:[-4, 12]},
  b:{n:"f(x) = x³ (piège)", f:function(x){ return x*x*x; }, d:function(x){ return 3*x*x; }, cr:[[0, "aucun"]], w:[-12, 12], wd:[-2, 16]},
  c:{n:"f(x) = x⁴ − 4x²", f:function(x){ return Math.pow(x, 4) - 4*x*x; }, d:function(x){ return 4*x*x*x - 8*x; }, cr:[[-Math.SQRT2, "min"], [0, "max"], [Math.SQRT2, "min"]], w:[-5, 6], wd:[-26, 26]}
};
SFA.sim({
  id:"m5-c06-tangente-tourne", ch:"c06", tag:"Classique",
  titre:"La tangente qui tourne : signe de f′ et variations",
  resume:"Fais glisser x : pente de la tangente, signe de f′, tableau de variations.",
  but:"Glisse x. Repère les endroits où la tangente est horizontale. En x³, f′ s'annule en 0 : y a-t-il un extremum ?",
  aRetenir:"f′ > 0 : f croît ; f′ < 0 : f décroît. Un extremum local apparaît quand f′ s'annule <b>en changeant de signe</b> : + puis − (maximum), − puis + (minimum).",
  piege:"f′(a) = 0 n'implique pas un extremum : pour f(x) = x³, f′(0) = 0 mais f est croissante partout (point d'inflexion à tangente horizontale).",
  build:function(k, S){
    var c1 = k.canvas(250), c2 = k.canvas(210);
    var sel = k.select("Fonction", Object.keys(TG).map(function(q){ return [q, TG[q].n]; }), "a", function(){ x.set(-1.5); found = {}; });
    var x = k.slider("x", -2.2, 2.2, 0.05, -1.5, "");
    var ro = k.readouts(["f(x)", "f′(x)", "Signe de f′", "f est"]);
    var nt = k.note("", "ok"), ax1, ax2, found = {};
    function drag(type, p){ if (type === "down" || type === "drag"){ x.set(Math.max(-2.2, Math.min(2.2, Math.round(ax1.ix(p.x) / 0.05) * 0.05))); k.redraw(); } }
    c1.pointer(drag); c2.pointer(function(t, p){ drag(t, p); });
    k.draw(function(){
      var d = TG[sel.value], X = x.value; c1.clear(); c2.clear();
      ax1 = S.draw.axes(c1, {x0:-2.5, x1:2.5, y0:d.w[0], y1:d.w[1], xl:"x", yl:"f", stepX:0.5, b:26});
      ax2 = S.draw.axes(c2, {x0:-2.5, x1:2.5, y0:d.wd[0], y1:d.wd[1], xl:"x", yl:"f′", stepX:0.5, b:26});
      S.draw.fn(c1, ax1, d.f, P.acc, 2.6);
      var yy = d.f(X), m = d.d(X);
      S.draw.fn(c2, ax2, d.d, "rgba(180,35,24,.4)", 2.2);
      clipped(c1, ax1, function(){ line(c1, ax1, X, yy, m, P.green, null, 2); });
      d.cr.forEach(function(q){ if (q[1] !== "aucun") S.draw.dot(c1, ax1.X(q[0]), ax1.Y(d.f(q[0])), 4, q[1] === "max" ? P.red : P.violet); });
      S.draw.dot(c1, ax1.X(X), ax1.Y(yy), 7, P.acc); S.draw.dot(c2, ax2.X(X), ax2.Y(m), 6, P.red);
      S.draw.line(c2, ax2.X(X), ax2.Y(0), ax2.X(X), ax2.Y(m), P.red, 1.5);
      d.cr.forEach(function(q, qi){ if (q[1] !== "aucun" && Math.abs(X - q[0]) < 0.06) found[sel.value + qi] = 1; });
      var nTot = d.cr.filter(function(q){ return q[1] !== "aucun"; }).length, nFound = Object.keys(found).length;
      S.draw.label(c1, "extrema trouvés : " + nFound + " / " + nTot, ax1.R - 8, ax1.T + 12, {color:nFound >= nTot ? P.green : P.grey, align:"right", size:11.5});
      var tol = 0.02, sgn = m > tol ? "+" : m < -tol ? "−" : "0";
      ro.set(0, F(yy, 3)); ro.set(1, F(m, 3)); ro.set(2, sgn); ro.set(3, sgn === "+" ? "croissante ↗" : sgn === "−" ? "décroissante ↘" : "tangente horizontale");
      var iv = 0, pts = d.cr.map(function(q){ return q[0]; }), i;
      for (i = 0; i < pts.length; i++) if (X > pts[i] + 1e-9) iv = i + 1;
      var mids = []; for (i = 0; i <= pts.length; i++){ var lo = i ? pts[i - 1] : -10, hi = i < pts.length ? pts[i] : 10; mids.push((lo + hi) / 2); }
      var row = "", arr = "";
      mids.forEach(function(mx, j){ var s = d.d(mx) > 0 ? "+" : "−", on = j === iv; row += "<td style='border:1px solid #ccd;padding:4px;" + (on ? "background:#fff3d6;font-weight:800" : "") + "'>" + s + "</td>"; arr += "<td style='border:1px solid #ccd;padding:4px;" + (on ? "background:#fff3d6;font-weight:800" : "") + "'>" + (s === "+" ? "↗" : "↘") + "</td>"; });
      var txt = "<b>Tableau de variations</b> (intervalle actuel en jaune) : f′ vaut " + mids.map(function(mx, j){ return (d.d(mx) > 0 ? "+" : "−"); }).join(" puis ") + ", points critiques en x = " + pts.map(function(p){ return F(p, 2); }).join(" ; ") + ".<br>";
      var kinds = d.cr.map(function(q){ return F(q[0], 2) + " : " + (q[1] === "max" ? "maximum local" : q[1] === "min" ? "minimum local" : "pas d'extremum (f′ ne change pas de signe)"); }).join(" · ");
      nt.set((nFound >= nTot && nTot > 0 ? "<b>Bravo : tu as repéré tous les extrema (tangente horizontale).</b><br>" : "Défi : fais rouler la tangente jusqu'à ce qu'elle soit horizontale, partout où elle peut l'être.<br>") + txt + kinds + "<br><table style='border-collapse:collapse;margin-top:4px;font-size:13px'><tr><td style='padding:4px'>f′</td>" + row + "</tr><tr><td style='padding:4px'>f</td>" + arr + "</tr></table>", "ok");
    });
    sel.el.dispatchEvent(new Event("change"));
  }
});

/* 3. Clôture */
SFA.sim({
  id:"m5-c06-cloture", ch:"c06", tag:"Classique",
  titre:"L'enclos de plus grande aire",
  resume:"Avec L mètres de grillage : le long d'une rivière ou en rectangle libre ?",
  but:"Choisis la longueur L de grillage et le mode. Tire le bord de l'enclos (ou le point de la courbe) pour régler la largeur x et maximiser l'aire. Compare les deux modes.",
  aRetenir:"Le long d'une rivière (3 côtés) : A(x) = x(L − 2x), maximum en x = L/4, aire L²/8. Rectangle fermé (4 côtés) : A(x) = x(L/2 − x), maximum en x = L/4 aussi, c'est un carré, aire L²/16 : la rivière double l'aire.",
  piege:"Il faut exprimer l'aire avec une seule variable, en utilisant la contrainte (la longueur de grillage). Et indiquer le domaine : 0 < x < L/2 dans les deux modes (au-delà, l\'autre côté deviendrait nul ou négatif).",
  build:function(k, S){
    var c = k.canvas(540);
    var mode = k.seg("Mode", [["R", "Le long d'une rivière"], ["F", "Rectangle fermé"]], "R");
    var Lg = k.slider("Grillage L", 40, 200, 10, 100, "m");
    var x = k.slider("Largeur x", 0, 100, 0.5, 10, "m");
    var ro = k.readouts(["Autre côté", "Aire A(x)", "A′(x)", "Aire max"]);
    var nt = k.note("", "ok");
    var geo = null, ax = null, m = "";
    c.pointer(function(type, p){
      if (type === "down") m = (ax && p.y > ax.T - 8) ? "g" : (geo && p.y < geo.bot + 28 ? "f" : "");
      if ((type === "down" || type === "drag") && m){
        var L = Lg.value, v = m === "g" ? ax.ix(p.x) : (p.y - geo.oy) / geo.sc;
        x.set(Math.round(Math.max(0, Math.min(L / 2, v)) * 2) / 2); k.redraw();
      }
      if (type === "up") m = "";
    });
    k.draw(function(){
      c.clear(); var L = Lg.value, R = mode.value === "R", ctx = c.ctx;
      var xmax = L / 2, X = Math.min(x.value, xmax), topH = 286;
      var oth = function(t){ return R ? L - 2*t : L/2 - t; }, A = function(t){ return t * oth(t); };
      var maxA = R ? L*L/8 : L*L/16, dA = R ? L - 4*X : L/2 - 2*X;
      /* scène */
      S.draw.panel(c, 4, 4, c.W - 8, topH - 4, {fill:"#f4f8ef", stroke:"#dfe8d4", radius:12, shadow:false});
      var ox = 22, oy = R ? 46 : 30, wmax = R ? L : L / 2, sc = Math.min((c.W - ox - 30) / wmax, (topH - oy - 76) / (L / 2));
      if (R){
        var g = ctx.createLinearGradient(0, 8, 0, 38); g.addColorStop(0, "#9fd0e6"); g.addColorStop(1, "#6fb4d3");
        ctx.save(); S.draw.rrect(c, 8, 8, c.W - 16, 30, 8); ctx.fillStyle = g; ctx.fill(); ctx.clip();
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1.6;
        for (var wx = -20; wx < c.W; wx += 34){ ctx.beginPath(); ctx.moveTo(wx, 26); ctx.quadraticCurveTo(wx + 8, 18, wx + 17, 26); ctx.quadraticCurveTo(wx + 25, 34, wx + 34, 26); ctx.stroke(); }
        ctx.restore(); S.draw.text(c, "rivière (pas de grillage)", c.W - 18, 23, {size:12, color:"#0e5c78", align:"right"});
      }
      var pw = oth(X) * sc, ph = X * sc, top = oy;
      ctx.fillStyle = "#cfe5b4"; ctx.fillRect(ox, top, pw, ph);
      ctx.fillStyle = "rgba(255,255,255,.18)"; for (var gi = 0; gi < ph; gi += 10) ctx.fillRect(ox, top + gi, pw, 5);
      var wood = "#8c5a2b";
      if (R){ clPosts(c, S, ox, top, ox, top + ph, 0, wood); clPosts(c, S, ox + pw, top, ox + pw, top + ph, 0, wood); clPosts(c, S, ox, top + ph, ox + pw, top + ph, 0, wood); }
      else { clPosts(c, S, ox, top, ox + pw, top, 0, wood); clPosts(c, S, ox, top + ph, ox + pw, top + ph, 0, wood); clPosts(c, S, ox, top, ox, top + ph, 0, wood); clPosts(c, S, ox + pw, top, ox + pw, top + ph, 0, wood); }
      geo = {sc:sc, oy:top, bot:top + ph};
      S.draw.arrow(c, ox + pw + 12, top, ox + pw + 12, top + ph, P.ink, 1.4); S.draw.arrow(c, ox + pw + 12, top + ph, ox + pw + 12, top, P.ink, 1.4);
      S.draw.text(c, "x = " + F(X, 1) + " m", Math.min(ox + pw + 20, c.W - 70), top + ph / 2, {align:"left", size:12, halo:"#f4f8ef"});
      S.draw.text(c, "autre côté = " + F(oth(X), 1) + " m   ·   A = " + F(A(X), 0) + " m²", 16, topH - 34, {size:12.5, color:P.green, align:"left"});
      if (ph > 44 && pw > 120) S.draw.text(c, "A = " + F(A(X), 0) + " m²", ox + pw / 2, top + ph / 2, {size:15, color:P.green, weight:800});
      S.draw.glow(c, ox + pw * 0.2, top + ph, 16, P.red, 0.45); S.draw.dot(c, ox + pw * 0.2, top + ph, 7, P.red);
      S.draw.text(c, "↕ tire le bord", Math.min(ox + pw * 0.2 + 12, c.W - 100), top + ph + 14, {align:"left", size:11.5, color:P.red});
      /* barre de grillage */
      S.draw.text(c, "grillage utilisé : " + (R ? "x + x + autre côté" : "2x + 2 × autre côté") + " = " + F(L, 0) + " m", 16, topH - 14, {align:"left", size:12, color:P.ink});
      ax = S.draw.axes(c, {x0:0, x1:xmax, y0:0, y1:maxA * 1.12, l:60, xl:"x (m)", yl:"A (m²)", t:topH + 18, b:30});
      S.draw.fn(c, ax, A, P.acc, 2.8);
      S.draw.line(c, ax.X(L / 4), ax.B, ax.X(L / 4), ax.Y(maxA), P.green, 1.3, [4, 4]);
      S.draw.label(c, "max en L/4 = " + F(L / 4, 1), ax.X(L / 4) + 8, ax.B - 14, {color:P.green, align:"left", size:11});
      S.draw.line(c, ax.X(X), ax.Y(A(X)), ax.X(X), ax.B, P.red, 1.2, [3, 3]);
      S.draw.glow(c, ax.X(X), ax.Y(A(X)), 18, P.red, 0.4); S.draw.dot(c, ax.X(X), ax.Y(A(X)), 7.5, P.red);
      ro.set(0, F(oth(X), 1) + " m"); ro.set(1, F(A(X), 1) + " m²"); ro.set(2, F(dA, 1)); ro.set(3, F(maxA, 1) + " m²");
      var near = Math.abs(X - L / 4) < 0.5 + 1e-9;
      nt.set((near ? "<b>Maximum atteint (à 0,5 m près).</b> " : "") + (R ? "A(x) = x(L − 2x), A′(x) = L − 4x = " + F(dA, 1) + "." : "A(x) = x(L/2 − x), A′(x) = L/2 − 2x = " + F(dA, 1) + ".") + " Optimum en x = L/4 = " + F(L / 4, 1) + " m, aire " + F(maxA, 1) + " m²." + (x.value > xmax ? " (x limité à " + F(xmax, 0) + " m : l'autre côté devient nul.)" : ""), near ? "ok" : "");
    });
  }
});

/* 4. Sauveteur (Fermat) */
SFA.sim({
  id:"m5-c06-sauveteur", ch:"c06", tag:"Niche utile",
  titre:"Le sauveteur : courir ou nager ?",
  resume:"Où entrer dans l'eau pour arriver le plus vite ? (principe de Fermat)",
  but:"Déplace le point d'entrée P sur la rive. Le temps total T(x) a un minimum : trouve-le, puis change les vitesses.",
  aRetenir:"T(x) = √(30² + x²)/v₁ + √(20² + (100 − x)²)/v₂. Le minimum est où T′(x) = 0, ce qui revient à sin θ₁ / v₁ = sin θ₂ / v₂ (loi de Snell-Descartes pour la lumière). Le chemin le plus court n'est pas le plus rapide.",
  piege:"La ligne droite A–B est le chemin le plus court, pas le plus rapide : le sauveteur gagne du temps en courant un peu plus longtemps sur le sable.",
  build:function(k, S){
    var c1 = k.canvas(260), c2 = k.canvas(220);
    var v1 = k.slider("Vitesse sur le sable v₁", 3, 8, 0.5, 5, "m/s");
    var v2 = k.slider("Vitesse dans l'eau v₂", 0.5, 2.5, 0.1, 2, "m/s");
    var x = k.slider("Point d'entrée x", 0, 100, 1, 50, "m");
    var ro = k.readouts(["Temps T(x)", "Temps minimal", "x optimal", "sinθ₁/v₁ − sinθ₂/v₂"]);
    var nt = k.note("", "ok");
    var sc1 = 1, axg = null;
    c1.pointer(function(t, p){ if (t === "down" || t === "drag"){ x.set(Math.round(Math.max(0, Math.min(100, (p.x - 20) / sc1)))); k.redraw(); } });
    c2.pointer(function(t, p){ if ((t === "down" || t === "drag") && axg){ x.set(Math.round(Math.max(0, Math.min(100, axg.ix(p.x))))); k.redraw(); } });
    k.draw(function(){
      c1.clear(); c2.clear(); var V1 = v1.value, V2 = v2.value, X = x.value, dA = 30, dB = 20, D = 100;
      var T = function(t){ return Math.sqrt(dA*dA + t*t)/V1 + Math.sqrt(dB*dB + (D - t)*(D - t))/V2; };
      var lo = 0, hi = D, i; for (i = 0; i < 80; i++){ var m1 = lo + (hi - lo)/3, m2 = hi - (hi - lo)/3; if (T(m1) < T(m2)) hi = m2; else lo = m1; }
      var xo = (lo + hi) / 2, To = T(xo);
      var sc = Math.min((c1.W - 40) / D, (c1.H - 50) / (dA + dB)), ox = 20, shore = 20 + dA * sc, yA = shore - dA * sc, yB = shore + dB * sc;
      rect(c1, 0, 0, c1.W, shore, "rgba(244,197,66,.28)"); rect(c1, 0, shore, c1.W, c1.H - shore, "rgba(14,116,144,.25)");
      var Px = ox + X * sc, Ax = ox, sc1 = sc, Bx = ox + D * sc, Ox = ox + xo * sc;
      S.draw.line(c1, Ax, yA, Ox, shore, P.light, 1.5, [4, 4]); S.draw.line(c1, Ox, shore, Bx, yB, P.light, 1.5, [4, 4]);
      S.draw.line(c1, Ax, yA, Px, shore, P.amber, 2.5); S.draw.line(c1, Px, shore, Bx, yB, P.teal, 2.5);
      S.draw.dot(c1, Ax, yA, 7, P.red); S.draw.dot(c1, Bx, yB, 7, P.acc); S.draw.glow(c1, Px, shore, 16, P.ink, 0.35); S.draw.dot(c1, Px, shore, 7.5, P.ink); S.draw.label(c1, "↔ glisse le point d'entrée", Math.min(c1.W - 8, Px + 12), shore - 14, {color:P.ink, align:Px > c1.W - 150 ? "right" : "left", size:11});
      S.draw.text(c1, "A (sauveteur)", Ax + 10, yA - 12, {align:"left", size:12}); S.draw.text(c1, "B (nageur)", Bx - 10, yB + 14, {align:"right", size:12});
      var ax = S.draw.axes(c2, {x0:0, x1:D, y0:Math.floor(To * 0.9 / 5) * 5, y1:Math.max(T(0), T(D)) * 1.05, l:52, xl:"x (m)", yl:"T (s)"});
      axg = ax; S.draw.fn(c2, ax, T, P.acc, 2.6); S.draw.dot(c2, ax.X(xo), ax.Y(To), 5, P.green); S.draw.dot(c2, ax.X(X), ax.Y(T(X)), 7, P.red);
      var s1 = X / Math.sqrt(dA*dA + X*X), s2 = (D - X) / Math.sqrt(dB*dB + (D - X)*(D - X));
      ro.set(0, F(T(X), 1) + " s"); ro.set(1, F(To, 1) + " s"); ro.set(2, F(xo, 1) + " m"); ro.set(3, F(s1 / V1 - s2 / V2, 4));
      var near = Math.abs(T(X) - To) < 0.05;
      nt.set((near ? "<b>Tu es au minimum.</b> " : "") + "Ligne droite A–B (x = " + F(D * dA / (dA + dB), 1) + " m) : T = " + F(T(D * dA / (dA + dB)), 1) + " s, mais le minimum est " + F(To, 1) + " s en x = " + F(xo, 1) + " m. À l'optimum, sinθ₁/v₁ = sinθ₂/v₂ ; ici la différence vaut " + F(s1 / V1 - s2 / V2, 4) + " (0 à l'optimum).", near ? "ok" : "");
    });
  }
});
})();
