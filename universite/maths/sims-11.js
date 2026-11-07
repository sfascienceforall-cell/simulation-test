/* Mathématiques BA1 · chapitre 11 : grandes expériences mathématiques (20 simulations célèbres) */
(function(){
var S = SFA, P = S.draw.palette, F = S.fmt, TAU = 2 * Math.PI, PI = Math.PI;
var COL = {blue:"#1e3f8f", sky:"#3b82f6", red:"#b42318", green:"#2e6b55", violet:"#5B21B6", amber:"#B45309", teal:"#0e7490", ink:"#0f1b2d", grey:"#8a95a3", light:"#e3e7ed", gold:"#f4c542", orange:"#ea7a1a", rose:"#d6336c"};
var SUP = ["", "", "", "10³", "10⁴", "10⁵", "10⁶", "10⁷", "10⁸", "10⁹"];
function pct(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; }
function circ(ctx, x, y, r, fillc, strokec, lw){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); if (fillc){ ctx.fillStyle = fillc; ctx.fill(); } if (strokec){ ctx.strokeStyle = strokec; ctx.lineWidth = lw || 1; ctx.stroke(); } }
function rrect(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); }
function txt(c, s, x, y, o){ S.draw.text(c, s, x, y, o); }
function bgfill(c, col){ c.ctx.fillStyle = col; c.ctx.fillRect(0, 0, c.W, c.H); }
function bgrad(c, c1, c2){ var g = c.ctx.createLinearGradient(0, 0, 0, c.H); g.addColorStop(0, c1); g.addColorStop(1, c2); c.ctx.fillStyle = g; c.ctx.fillRect(0, 0, c.W, c.H); }
function hsl(h, s, l, a){ return "hsla(" + Math.round(h) + "," + s + "%," + l + "%," + (a === undefined ? 1 : a) + ")"; }
function rnd(n){ return Math.floor(Math.random() * n); }
function gauss(){ var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
function lchoose(n, k){ var s = 0; for (var i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i); return s; }
function binom(n, k, p){ if (k < 0 || k > n) return 0; return Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)); }
/* graphe de convergence en abscisse logarithmique : hist = [[n, estimation], ...] */
function convPlot(c, hist, o){
  var ctx = c.ctx, L = 52, R = 14, T = 14, B = 28, W = c.W, H = c.H;
  c.clear();
  var last = hist.length ? hist[hist.length - 1][0] : 1;
  var e = Math.max(3, Math.ceil(Math.log10(Math.max(last, 1)) - 1e-9)), lx = e;
  function X(n){ return L + Math.log10(Math.max(n, 1)) / lx * (W - L - R); }
  function Y(v){ return T + (o.yhi - v) / (o.yhi - o.ylo) * (H - T - B); }
  ctx.save(); ctx.font = "600 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1;
  var st = o.step || 0.5;
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (var v = Math.ceil(o.ylo / st) * st; v <= o.yhi + 1e-9; v += st){ ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillText(F(v, 2), L - 6, Y(v)); }
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (var q = 0; q <= e; q++){ var xx = L + q / lx * (W - L - R); ctx.beginPath(); ctx.moveTo(xx, T); ctx.lineTo(xx, H - B); ctx.stroke(); ctx.fillText(q === 0 ? "1" : q === 1 ? "10" : q === 2 ? "100" : SUP[q], xx, H - B + 5); }
  ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xl || "nombre d'essais n", W - R, H - B - 5);
  ctx.restore();
  if (o.band){
    ctx.beginPath();
    var i, n;
    for (i = 0; i <= 120; i++){ n = Math.pow(10, lx * i / 120); ctx.lineTo(X(n), Y(Math.min(o.yhi, o.target + o.band(n)))); }
    for (i = 120; i >= 0; i--){ n = Math.pow(10, lx * i / 120); ctx.lineTo(X(n), Y(Math.max(o.ylo, o.target - o.band(n)))); }
    ctx.closePath(); ctx.fillStyle = "rgba(30,63,143,.10)"; ctx.fill();
  }
  ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = COL.green; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(L, Y(o.target)); ctx.lineTo(W - R, Y(o.target)); ctx.stroke(); ctx.restore();
  txt(c, o.tl || "", L + 6, Y(o.target) - 9, {align:"left", color:COL.green, size:12});
  if (hist.length){
    ctx.save(); ctx.beginPath(); ctx.rect(L, T, W - L - R, H - T - B); ctx.clip();
    ctx.strokeStyle = o.color || COL.red; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.beginPath();
    hist.forEach(function(p, i){ var y = Math.max(o.ylo - 1, Math.min(o.yhi + 1, p[1])); i ? ctx.lineTo(X(p[0]), Y(y)) : ctx.moveTo(X(p[0]), Y(y)); });
    ctx.stroke(); ctx.restore();
  }
}
function pushHist(h, st, n, est){ if (n >= st.next || n === 1){ h.push([n, est]); st.next = Math.max(n + 1, Math.ceil(n * 1.035)); } }

/* 1 ---------------------------------------------------------------- Buffon */
SFA.sim({
  id: "um-c11-buffon", ch: "c11", tag: "Probabilités géométriques",
  titre: "L'aiguille de Buffon : π tombe du ciel",
  resume: "Lance des milliers d'aiguilles sur un parquet : la fréquence de celles qui touchent une rainure donne π.",
  but: "Choisis la longueur de l'aiguille puis lance : la proportion d'aiguilles qui coupent une ligne converge vers 2ℓ/(πd), et 2ℓn/(d·touchées) vers π.",
  aRetenir: "Une aiguille de longueur ℓ lancée sur un parquet de rainures espacées de d (ℓ ≤ d) coupe une rainure avec la probabilité 2ℓ/(πd). On en déduit π ≈ 2ℓ·n / (d·nombre d'aiguilles qui coupent). Le π vient de l'angle aléatoire : la projection verticale de l'aiguille vaut ℓ|sin θ| et la valeur moyenne de |sin θ| sur [0 ; π] est 2/π. Histoire : Georges-Louis Leclerc, comte de Buffon, pose le problème en 1733 et le publie en 1777 : c'est le premier problème de probabilité géométrique et l'ancêtre des méthodes de Monte-Carlo.",
  piege: "L'estimation converge lentement (erreur ≈ 1/√n) : il faut des centaines de milliers de lancers pour trois décimales. Les 3408 lancers de Lazzarini (1901) qui donnent 3,1415929 sont trop beaux pour être honnêtes.",
  build: function(k, S){
    var c = k.canvas(290), g = k.canvas(170);
    var st = {n: 0, hit: 0, nd: [], hist: [], rec: {next: 1}};
    function reset(){ st.n = 0; st.hit = 0; st.nd = []; st.hist = []; st.rec = {next: 1}; }
    var ratio = k.slider("Longueur de l'aiguille ℓ / écart d des rainures", 0.2, 1, 0.05, 0.8, "", reset);
    var speed = k.seg("Cadence", [[1, "1 par image"], [10, "10"], [100, "100"], [1000, "1000"]], 10);
    var D = 50;
    function throwOne(){
      var yu = Math.random() * 5, th = Math.random() * PI, xu = Math.random();
      var fr = yu - Math.floor(yu), dist = Math.min(fr, 1 - fr);
      var hit = dist <= ratio.value / 2 * Math.abs(Math.sin(th));
      st.n++; if (hit) st.hit++;
      st.nd.push({x: xu, y: yu, th: th, hit: hit}); if (st.nd.length > 400) st.nd.shift();
      if (st.hit > 0) pushHist(st.hist, st.rec, st.n, 2 * ratio.value * st.n / st.hit);
    }
    var lp = k.loop(function(){ for (var i = 0; i < speed.value; i++) throwOne(); k.redraw(); });
    k.button("▶ / ⏸ Lancer", function(){ lp.running ? lp.pause() : lp.play(); }, true);
    k.button("Un lancer", function(){ lp.pause(); throwOne(); });
    k.button("Recommencer", reset);
    var ro = k.readouts(["Aiguilles lancées", "Aiguilles qui coupent", "Fréquence observée", "Probabilité 2ℓ/(πd)", "Estimation de π", "Écart à π"]);
    k.note("Les aiguilles <b style='color:#b42318'>rouges</b> coupent une rainure, les grises non. Seules les 400 dernières sont dessinées ; les compteurs, eux, comptent tout.", "");
    lp.play();
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgfill(c, "#f7f1e3");
      for (var j = 0; j < 6; j++){ var y = 25 + D * j; ctx.fillStyle = "#c9b48a"; ctx.fillRect(0, y - 1.5, c.W, 3); }
      ctx.lineCap = "round"; var Lp = ratio.value * D;
      st.nd.forEach(function(a, i){
        var x = 20 + a.x * (c.W - 40), y = 25 + D * a.y, dx = Math.cos(a.th) * Lp / 2, dy = Math.sin(a.th) * Lp / 2;
        var recent = i > st.nd.length - 6;
        ctx.strokeStyle = a.hit ? (recent ? "#e11d1d" : "rgba(180,35,24,.78)") : (recent ? "#1f2937" : "rgba(60,70,90,.45)"); ctx.lineWidth = recent ? 3.4 : 2.2;
        ctx.beginPath(); ctx.moveTo(x - dx, y - dy); ctx.lineTo(x + dx, y + dy); ctx.stroke();
      });
      txt(c, "ℓ/d = " + F(ratio.value, 2), c.W - 12, 12, {align:"right", color:COL.ink, size:13, bg:"rgba(255,255,255,.8)"});
      var pe = st.hit ? 2 * ratio.value * st.n / st.hit : NaN;
      convPlot(g, st.hist, {target: PI, ylo: 2, yhi: 4.5, step: 0.5, tl: "π", band: function(n){ var p = 2 * ratio.value / PI; return 1.96 * (2 * ratio.value / (p * p)) * Math.sqrt(p * (1 - p) / n); }});
      ro.set(0, F(st.n, 0)); ro.set(1, F(st.hit, 0));
      ro.set(2, st.n ? pct(st.hit / st.n, 2) : "—"); ro.set(3, pct(2 * ratio.value / PI, 2));
      ro.set(4, st.hit ? F(pe, 4) : "—"); ro.set(5, st.hit ? F(Math.abs(pe - PI), 4) : "—");
    });
  }
});

/* 2 ---------------------------------------------------------------- π Monte-Carlo */
SFA.sim({
  id: "um-c11-pi-monte-carlo", ch: "c11", tag: "Monte-Carlo",
  titre: "π par Monte-Carlo : des points au hasard dans un carré",
  resume: "Des points tirés au hasard dans un carré unité : 4 × (part dans le quart de disque) tend vers π.",
  but: "Lance des milliers de points : la fraction qui tombe dans le quart de disque tend vers π/4. Observe la bande d'erreur en 1/√n.",
  aRetenir: "Le quart de disque de rayon 1 a pour aire π/4 et le carré 1 : un point uniforme tombe dedans avec la probabilité π/4. Donc π ≈ 4 × (points dedans)/n. L'erreur typique vaut 4√(p(1−p)/n) ≈ 1,64/√n : pour gagner une décimale, il faut 100 fois plus de points. Histoire : la méthode « Monte-Carlo » est baptisée en 1946-1947 par Ulam, von Neumann et Metropolis, à Los Alamos, d'après le casino de Monaco.",
  piege: "Plus de points ne rend pas la méthode « exacte » : l'erreur reste aléatoire et décroît seulement en 1/√n. Un tirage chanceux avec peu de points peut être très proche de π sans que cela prouve quoi que ce soit.",
  build: function(k, S){
    var c = k.canvas(330), g = k.canvas(170);
    var BW = 300, buf = document.createElement("canvas"); buf.width = buf.height = BW; var bctx = buf.getContext("2d");
    var img = bctx.createImageData(BW, BW);
    var st = {n: 0, in_: 0, hist: [], rec: {next: 1}};
    function reset(){ st.n = 0; st.in_ = 0; st.hist = []; st.rec = {next: 1}; img = bctx.createImageData(BW, BW); bctx.putImageData(img, 0, 0); }
    var speed = k.seg("Cadence", [[1, "1 par image"], [20, "20"], [500, "500"], [5000, "5000"]], 20);
    function add(){
      var x = Math.random(), y = Math.random(), inside = x * x + y * y <= 1;
      st.n++; if (inside) st.in_++;
      var px = Math.floor(x * (BW - 1)), py = Math.floor((1 - y) * (BW - 1)), r = inside ? 30 : 234, gg = inside ? 150 : 122, b = inside ? 120 : 26;
      for (var dx = 0; dx < 2; dx++) for (var dy = 0; dy < 2; dy++){ var i = ((py + dy) * BW + px + dx) * 4; if (px + dx < BW && py + dy < BW){ img.data[i] = r; img.data[i + 1] = gg; img.data[i + 2] = b; img.data[i + 3] = 255; } }
      if (st.in_ > 0) pushHist(st.hist, st.rec, st.n, 4 * st.in_ / st.n);
    }
    var dirty = false;
    var lp = k.loop(function(){ for (var i = 0; i < speed.value; i++) add(); bctx.putImageData(img, 0, 0); k.redraw(); });
    k.button("▶ / ⏸ Lancer", function(){ lp.running ? lp.pause() : lp.play(); }, true);
    k.button("Recommencer", reset);
    var ro = k.readouts(["Points tirés", "Dans le quart de disque", "Estimation de π", "Erreur observée", "Erreur typique 1,64/√n"]);
    lp.play();
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgfill(c, "#fbfaf6");
      var s = Math.min(c.H - 24, c.W * 0.5), x0 = 18, y0 = 12;
      ctx.imageSmoothingEnabled = false; ctx.drawImage(buf, x0, y0, s, s); ctx.imageSmoothingEnabled = true;
      ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.6; ctx.strokeRect(x0, y0, s, s);
      ctx.strokeStyle = COL.blue; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x0, y0 + s, s, -PI / 2, 0); ctx.stroke();
      txt(c, "1", x0 + s + 8, y0 + s, {size: 12, color: COL.grey}); txt(c, "1", x0, y0 - 1, {size: 12, color: COL.grey, base: "bottom"});
      var tx = x0 + s + 28;
      txt(c, "Aire du quart de disque = π/4", tx, 40, {align: "left", color: COL.blue, size: 14});
      txt(c, "Aire du carré = 1", tx, 64, {align: "left", color: COL.ink, size: 14});
      txt(c, "dedans / total ≈ π/4", tx, 98, {align: "left", color: COL.green, size: 14});
      var est = st.n ? 4 * st.in_ / st.n : NaN;
      txt(c, st.n ? "π ≈ 4 × " + st.in_ + " / " + st.n : "π ≈ 4 × dedans / total", tx, 140, {align: "left", color: COL.ink, size: 15});
      txt(c, st.n ? "= " + F(est, 4) : "", tx, 172, {align: "left", color: COL.red, size: 26, math: true});
      convPlot(g, st.hist, {target: PI, ylo: 2.4, yhi: 3.9, step: 0.25, tl: "π", band: function(n){ return 1.96 * 1.6422 / Math.sqrt(n); }});
      ro.set(0, F(st.n, 0)); ro.set(1, F(st.in_, 0)); ro.set(2, st.n ? F(est, 5) : "—");
      ro.set(3, st.n ? F(Math.abs(est - PI), 5) : "—"); ro.set(4, st.n ? F(1.6422 / Math.sqrt(st.n), 4) : "—");
    });
  }
});

/* 3 ---------------------------------------------------------------- Archimède */
SFA.sim({
  id: "um-c11-archimede", ch: "c11", tag: "Géométrie",
  titre: "Archimède encadre π avec des polygones",
  resume: "Hexagone, 12, 24, 48, 96 côtés : un polygone inscrit et un circonscrit pincent le cercle, donc π.",
  but: "Double le nombre de côtés : le périmètre du polygone inscrit (par en dessous) et du circonscrit (par au-dessus) encadrent de plus en plus serré 2π.",
  aRetenir: "Pour un cercle de diamètre 1, le polygone régulier de n côtés a pour demi-périmètre n·sin(π/n) à l'intérieur et n·tan(π/n) à l'extérieur : n sin(π/n) < π < n tan(π/n). En doublant n, la moyenne harmonique puis la moyenne géométrique suffisent : P₂ₙ = 2pₙPₙ/(pₙ+Pₙ), p₂ₙ = √(pₙP₂ₙ). Archimède de Syracuse (≈ 250 av. J.-C.) arrive à 96 côtés : 3 + 10/71 < π < 3 + 1/7. Pendant près de 1700 ans, c'est la meilleure méthode connue.",
  piege: "Ce n'est pas une valeur de π que l'on « mesure » : on prouve un encadrement. Chaque doublement n'apporte qu'environ 0,6 chiffre exact (l'erreur est divisée par 4 pour 2 fois plus de côtés).",
  build: function(k, S){
    var c = k.canvas(340);
    var sel = k.seg("Nombre de côtés", [[6, "6"], [12, "12"], [24, "24"], [48, "48"], [96, "96"], [192, "192"], [384, "384"], [768, "768"]], 6);
    var ro = k.readouts(["Côtés n", "Inscrit n·sin(π/n)", "π", "Circonscrit n·tan(π/n)", "Largeur de l'encadrement"]);
    var tb = k.note("", "");
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgfill(c, "#fbfaf6");
      var n = +sel.value, cx = c.W * 0.5, cy = c.H * 0.5, R = Math.min(c.W * 0.34, c.H * 0.4);
      ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = COL.amber;
      ctx.beginPath(); for (var i = 0; i < n; i++){ var a = i / n * TAU - PI / 2, rr = R / Math.cos(PI / n); i ? ctx.lineTo(cx + rr * Math.cos(a + PI / n), cy + rr * Math.sin(a + PI / n)) : ctx.moveTo(cx + rr * Math.cos(a + PI / n), cy + rr * Math.sin(a + PI / n)); }
      ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = COL.amber; ctx.lineWidth = 2.2; ctx.beginPath(); for (i = 0; i < n; i++){ a = i / n * TAU - PI / 2; rr = R / Math.cos(PI / n); var px = cx + rr * Math.cos(a + PI / n), py = cy + rr * Math.sin(a + PI / n); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.stroke();
      ctx.fillStyle = "rgba(30,63,143,.22)"; ctx.strokeStyle = COL.blue; ctx.lineWidth = 2.2;
      ctx.beginPath(); for (i = 0; i < n; i++){ a = i / n * TAU - PI / 2; px = cx + R * Math.cos(a); py = cy + R * Math.sin(a); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.fill(); ctx.stroke();
      circ(ctx, cx, cy, R, null, COL.ink, 2);
      txt(c, "polygone circonscrit", c.W - 10, 14, {align: "right", color: COL.amber, size: 13});
      txt(c, "polygone inscrit", 10, c.H - 14, {align: "left", color: COL.blue, size: 13});
      txt(c, "cercle de diamètre 1", cx, cy, {color: COL.ink, size: 13, bg: "rgba(251,250,246,.85)"});
      var lo = n * Math.sin(PI / n), hi = n * Math.tan(PI / n);
      ro.set(0, n); ro.set(1, F(lo, 6)); ro.set(2, F(PI, 6)); ro.set(3, F(hi, 6)); ro.set(4, F(hi - lo, 6));
      var rows = "<table style='width:100%;border-collapse:collapse;font-size:13px'><tr><th align=left>n</th><th align=right>inscrit</th><th align=right>circonscrit</th></tr>", p = 3, Pp = 2 * Math.sqrt(3);
      for (var m = 6; m <= n; m *= 2){ rows += "<tr" + (m === n ? " style='font-weight:800;color:#1e3f8f'" : "") + "><td>" + m + "</td><td align=right>" + F(p, 6) + "</td><td align=right>" + F(Pp, 6) + "</td></tr>"; var P2 = 2 * p * Pp / (p + Pp); p = Math.sqrt(p * P2); Pp = P2; }
      tb.set("Récurrence d'Archimède (sans trigonométrie) :" + rows + "</table>" + (n >= 96 ? "À 96 côtés : <b>" + F(lo, 5) + " &lt; π &lt; " + F(hi, 5) + "</b>, comme Archimède (3,1408 &lt; π &lt; 3,1429)." : ""), "");
    });
  }
});

/* 4 ---------------------------------------------------------------- Monty Hall */
SFA.sim({
  id: "um-c11-monty-hall", ch: "c11", tag: "Probabilités conditionnelles",
  titre: "Le problème de Monty Hall",
  resume: "Trois portes, une voiture : faut-il changer de porte après que le présentateur en a ouvert une ? Essaie, puis simule.",
  but: "Joue quelques parties à la main, puis lance 1000 parties simulées pour chaque stratégie. Passe à 100 portes pour comprendre.",
  aRetenir: "Ta porte de départ cache la voiture avec la probabilité 1/3 et l'animateur, qui sait où elle est, ne change pas cette probabilité en ouvrant une porte perdante : « garder » gagne 1/3, « changer » gagne 2/3. Avec N portes, changer gagne (N−1)/N. Le problème est popularisé par Marilyn vos Savant dans Parade (1990) d'après le jeu télévisé « Let's Make a Deal » de Monty Hall ; de nombreux mathématiciens ont d'abord protesté, y compris Paul Erdős.",
  piege: "Il ne reste pas « deux portes donc une chance sur deux » : les deux portes n'ont pas la même histoire. L'animateur connaît la voiture et ouvre toujours une chèvre ; s'il ouvrait une porte au hasard, le résultat serait différent.",
  build: function(k, S){
    var c = k.canvas(300);
    var st = {N: 3, phase: 0, car: 0, pick: -1, keep: -1, final: -1, win: null, sw: [0, 0], stay: [0, 0], aw: [0, 0], as: [0, 0]};
    var nsel = k.seg("Nombre de portes", [[3, "3"], [10, "10"], [100, "100"]], 3, function(v){ st.N = +v; st.sw = [0, 0]; st.stay = [0, 0]; st.aw = [0, 0]; st.as = [0, 0]; newGame(); });
    function newGame(){ st.phase = 0; st.car = rnd(st.N); st.pick = -1; st.keep = -1; st.final = -1; st.win = null; }
    function choose(d){
      st.pick = d;
      if (st.car === d){ do { st.keep = rnd(st.N); } while (st.keep === d); } else st.keep = st.car;
      st.phase = 1;
    }
    function decide(sw){
      if (st.phase !== 1) return;
      st.final = sw ? st.keep : st.pick; st.win = st.final === st.car;
      var t = sw ? st.sw : st.stay; t[1]++; if (st.win) t[0]++; st.phase = 2;
    }
    k.button("Changer de porte", function(){ decide(true); }, true);
    k.button("Garder ma porte", function(){ decide(false); });
    k.button("Nouvelle partie", newGame);
    k.button("Simuler 1000 parties", function(){
      for (var i = 0; i < 1000; i++){ var car = rnd(st.N), pk = rnd(st.N); st.as[1]++; st.aw[1]++; if (pk === car) st.as[0]++; else st.aw[0]++; }
    });
    var ro = k.readouts(["Tes parties : changer", "Tes parties : garder", "1000 simulées : changer", "1000 simulées : garder"]);
    var msg = k.note("Choisis une porte.", "");
    newGame();
    var rects = [];
    c.pointer(function(type, p){
      if (type !== "down") return;
      for (var i = 0; i < rects.length; i++){ var r = rects[i]; if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h){
        if (st.phase === 0) choose(r.i); else if (st.phase === 1){ if (r.i === st.keep) decide(true); else if (r.i === st.pick) decide(false); }
        k.redraw(); return; } }
    });
    function goat(ctx, x, y, s){
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.fillStyle = "#e5e7eb"; ctx.strokeStyle = "#374151"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(0, 6, 17, 10, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-16, -8, 8, 7, -0.3, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-20, -14); ctx.quadraticCurveTo(-24, -26, -16, -26); ctx.moveTo(-14, -14); ctx.quadraticCurveTo(-12, -26, -6, -24); ctx.stroke();
      [[-9, 14], [-3, 14], [8, 14], [14, 14]].forEach(function(l){ ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[0], l[1] + 9); ctx.stroke(); });
      circ(ctx, -19, -9, 1.4, "#111827"); ctx.restore();
    }
    function carD(ctx, x, y, s){
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.fillStyle = "#dc2626"; rrect(ctx, -26, -2, 52, 14, 5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-15, -2); ctx.lineTo(-9, -13); ctx.lineTo(9, -13); ctx.lineTo(16, -2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#bfdbfe"; ctx.beginPath(); ctx.moveTo(-11, -3); ctx.lineTo(-7, -11); ctx.lineTo(-1, -11); ctx.lineTo(-1, -3); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(2, -3); ctx.lineTo(2, -11); ctx.lineTo(8, -11); ctx.lineTo(12, -3); ctx.closePath(); ctx.fill();
      circ(ctx, -14, 13, 5, "#111827"); circ(ctx, 14, 13, 5, "#111827"); ctx.restore();
    }
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgrad(c, "#eaf1fb", "#f8fafc"); rects = [];
      var N = st.N, cols = N === 3 ? 3 : N === 10 ? 5 : 20, rows = Math.ceil(N / cols);
      var cw = c.W / cols, ch = (c.H - 40) / rows, dw = Math.min(cw * 0.78, N === 3 ? 120 : 90), dh = Math.min(ch * 0.9, N === 3 ? 210 : 140);
      if (N === 100){ dw = cw * 0.8; dh = ch * 0.78; }
      for (var d = 0; d < N; d++){
        var col = d % cols, row = Math.floor(d / cols), x = col * cw + (cw - dw) / 2, y = 8 + row * ch + (ch - dh) / 2;
        rects.push({x: x, y: y, w: dw, h: dh, i: d});
        var opened = st.phase >= 1 && d !== st.pick && d !== st.keep, reveal = st.phase === 2 && (d === st.pick || d === st.keep);
        var isCar = d === st.car;
        if (opened || reveal){
          ctx.fillStyle = "#1f2937"; ctx.fillRect(x, y, dw, dh);
          ctx.fillStyle = "#334155"; ctx.fillRect(x + 3, y + 3, dw - 6, dh - 6);
          if (N < 100){ (isCar ? carD : goat)(ctx, x + dw / 2, y + dh * 0.58, Math.min(dw / 60, dh / 80)); }
          else { ctx.fillStyle = isCar ? "#dc2626" : "#9ca3af"; ctx.fillRect(x + dw * 0.2, y + dh * 0.3, dw * 0.6, dh * 0.4); }
        } else {
          var gr = ctx.createLinearGradient(x, y, x + dw, y); gr.addColorStop(0, "#a16207"); gr.addColorStop(1, "#78350f"); ctx.fillStyle = gr; ctx.fillRect(x, y, dw, dh);
          ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; ctx.strokeRect(x + dw * 0.12, y + dh * 0.1, dw * 0.76, dh * 0.8);
          if (N < 100) circ(ctx, x + dw * 0.82, y + dh * 0.52, Math.max(2, dw * 0.04), "#fde68a");
        }
        var mark = null, mc = null;
        if (st.phase >= 1 && d === st.pick){ mark = "ta porte"; mc = COL.blue; }
        else if (st.phase >= 1 && d === st.keep){ mark = "l'autre"; mc = COL.green; }
        if (mark){ ctx.strokeStyle = mc; ctx.lineWidth = 4; ctx.strokeRect(x - 2, y - 2, dw + 4, dh + 4); if (N < 100) txt(c, mark, x + dw / 2, y + dh + 12, {color: mc, size: 12}); else txt(c, mark, x + dw / 2, y + dh + 10, {color: mc, size: 11}); }
        if (st.phase === 2 && d === st.final){ txt(c, st.win ? "GAGNÉ" : "PERDU", x + dw / 2, y - 1, {color: st.win ? COL.green : COL.red, size: 12, base: "bottom"}); }
        if (N < 100 && !(opened || reveal)) txt(c, String(d + 1), x + dw / 2, y + dh * 0.25, {color: "#fde68a", size: N === 3 ? 26 : 16, math: true});
      }
      var t = function(a){ return a[1] ? a[0] + " / " + a[1] + " (" + F(a[0] / a[1] * 100, 0) + " %)" : "—"; };
      ro.set(0, t(st.sw)); ro.set(1, t(st.stay)); ro.set(2, t(st.aw)); ro.set(3, t(st.as));
      var th = "Théorie : changer = " + F((N - 1) / N * 100, 1) + " %, garder = " + F(100 / N, 1) + " %.";
      if (st.phase === 0) msg.set("Choisis une porte en cliquant dessus. " + th);
      else if (st.phase === 1) msg.set("L'animateur, qui sait où est la voiture, a ouvert " + (N - 2) + " porte" + (N > 3 ? "s" : "") + " perdante" + (N > 3 ? "s" : "") + ". Garder la tienne (bleu) ou changer pour la verte ? " + th, "warn");
      else msg.set((st.win ? "Gagné !" : "Perdu.") + " La voiture était derrière la porte " + (st.car + 1) + ". " + th, st.win ? "ok" : "bad");
    });
  }
});

/* 5 ---------------------------------------------------------------- anniversaires */
function pBirth(n){ var q = 1; for (var i = 0; i < n; i++) q *= (365 - i) / 365; return 1 - q; }
SFA.sim({
  id: "um-c11-anniversaires", ch: "c11", tag: "Dénombrement",
  titre: "Le paradoxe des anniversaires",
  resume: "À partir de 23 personnes, il y a plus d'une chance sur deux que deux d'entre elles fêtent leur anniversaire le même jour.",
  but: "Choisis la taille du groupe, tire des salles au hasard et compare la fréquence observée à la probabilité exacte.",
  aRetenir: "La probabilité qu'aucun anniversaire ne coïncide vaut (365/365)(364/365)…((365−n+1)/365) ; l'événement contraire est « au moins deux se ressemblent » : 50,7 % pour n = 23 et 99,0 % pour n = 57. Le groupe de 23 contient 23×22/2 = 253 paires : voilà pourquoi le résultat n'est pas si surprenant. Problème attribué à Richard von Mises (1939).",
  piege: "La question n'est pas « quelqu'un a-t-il le même anniversaire que MOI ? » : pour cela il faut 253 personnes pour dépasser 50 %. Ici on cherche n'importe quelle paire, ce qui est bien plus probable.",
  build: function(k, S){
    var c1 = k.canvas(200), c2 = k.canvas(180);
    var room = [], emp = [0, 0];
    var nn = k.slider("Nombre de personnes n", 2, 100, 1, 23, "", function(){ room = []; emp = [0, 0]; });
    function sample(){ var a = []; for (var i = 0; i < nn.value; i++) a.push(rnd(365)); return a; }
    function coll(a){ var s = {}; for (var i = 0; i < a.length; i++){ if (s[a[i]]) return true; s[a[i]] = 1; } return false; }
    k.button("Tirer une salle", function(){ room = sample(); emp[1]++; if (coll(room)) emp[0]++; }, true);
    k.button("Simuler 2000 salles", function(){ for (var j = 0; j < 2000; j++){ emp[1]++; if (coll(sample())) emp[0]++; } });
    k.button("Remettre à zéro", function(){ room = []; emp = [0, 0]; });
    var ro = k.readouts(["Paires possibles n(n−1)/2", "P(au moins une coïncidence)", "Fréquence observée", "Salles testées"]);
    k.draw(function(){
      var ctx = c1.ctx; c1.clear(); var ax = S.draw.axes(c1, {x0: 0, x1: 100, y0: 0, y1: 1, xl: "n", yl: "probabilité", stepX: 10, stepY: 0.25});
      var pts = []; for (var m = 0; m <= 100; m++) pts.push(pBirth(m));
      S.draw.fn(c1, ax, function(x){ var i = Math.max(0, Math.min(99, Math.floor(x))); return pts[i] + (pts[i + 1] - pts[i]) * (x - i); }, COL.blue, 3);
      S.draw.line(c1, ax.X(0), ax.Y(0.5), ax.X(100), ax.Y(0.5), COL.grey, 1.2, [5, 4]);
      var n = nn.value, p = pBirth(n);
      S.draw.line(c1, ax.X(n), ax.Y(0), ax.X(n), ax.Y(p), COL.red, 1.6, [4, 3]); S.draw.line(c1, ax.X(0), ax.Y(p), ax.X(n), ax.Y(p), COL.red, 1.6, [4, 3]);
      S.draw.dot(c1, ax.X(n), ax.Y(p), 6, COL.red);
      S.draw.dot(c1, ax.X(23), ax.Y(pBirth(23)), 4, COL.amber); txt(c1, "23 : 50,7 %", ax.X(23) + 8, ax.Y(pBirth(23)) + 14, {align: "left", color: COL.amber, size: 12});
      txt(c1, F(p * 100, 1) + " %", ax.X(n) + (n > 70 ? -8 : 8), ax.Y(p) - 12, {align: n > 70 ? "right" : "left", color: COL.red, size: 13});
      ctx = c2.ctx; c2.clear(); bgfill(c2, "#fbfaf6");
      var cnt = new Array(365).fill(0); room.forEach(function(d){ cnt[d]++; });
      var cols = 30, rows = 13, cs = Math.min((c2.W - 16) / cols, (c2.H - 26) / rows);
      var ox = (c2.W - cols * cs) / 2, oy = 8;
      for (var d = 0; d < 365; d++){
        var x = ox + (d % cols) * cs, y = oy + Math.floor(d / cols) * cs;
        ctx.fillStyle = cnt[d] >= 2 ? COL.red : cnt[d] === 1 ? COL.sky : "#e5e9ef";
        ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
        if (cnt[d] >= 2) txt(c2, String(cnt[d]), x + cs / 2, y + cs / 2, {color: "#fff", size: Math.min(12, cs * 0.6)});
      }
      txt(c2, room.length ? "Les 365 jours de l'année : " + room.length + " personnes tirées, " + (coll(room) ? "coïncidence (rouge)" : "aucune coïncidence") : "Clique sur « Tirer une salle » : chaque case est un jour de l'année", c2.W / 2, c2.H - 8, {color: COL.ink, size: 12});
      ro.set(0, F(n * (n - 1) / 2, 0)); ro.set(1, F(p * 100, 2) + " %"); ro.set(2, emp[1] ? F(emp[0] / emp[1] * 100, 1) + " %" : "—"); ro.set(3, emp[1]);
    });
  }
});

/* 6 ---------------------------------------------------------------- Galton */
SFA.sim({
  id: "um-c11-galton", ch: "c11", tag: "Loi binomiale · théorème central limite",
  titre: "La planche de Galton : la cloche naît du hasard",
  resume: "Des billes tombent à travers des clous : à chaque clou, gauche ou droite. Le tas final dessine la loi binomiale, puis la cloche.",
  but: "Choisis le nombre de rangées et la probabilité d'aller à droite, puis regarde le tas se construire et rejoindre la courbe binomiale.",
  aRetenir: "Une bille qui tombe sur n rangées de clous fait n choix indépendants gauche/droite : le nombre de « droites » suit la loi binomiale B(n ; p), de moyenne np et d'écart-type √(np(1−p)). Pour n grand, l'histogramme épouse la courbe en cloche de la loi normale : c'est le théorème central limite (de Moivre 1733, Laplace, puis Galton qui construit la planche en 1873-1889).",
  piege: "Chaque bille est imprévisible, mais le tas ne l'est pas : la forme n'apparaît que sur beaucoup de billes. Et si p ≠ 0,5, la cloche est déplacée et asymétrique pour un petit nombre de rangées.",
  build: function(k, S){
    var c = k.canvas(430), balls = [], counts = [], N = 0, acc = 0;
    var rows = k.slider("Rangées de clous n", 3, 16, 1, 10, "", function(){ reset(); });
    var pr = k.slider("Probabilité d'aller à droite p", 0.1, 0.9, 0.05, 0.5, "", function(){ reset(); });
    var rate = k.seg("Débit", [[4, "4 billes/s"], [15, "15/s"], [50, "50/s"]], 15);
    var cur = k.toggle("Montrer la cloche normale (théorème central limite)", true);
    function reset(){ balls = []; counts = new Array(rows.value + 1).fill(0); N = 0; }
    function spawn(){ var n = rows.value, path = [], r = 0; for (var i = 0; i < n; i++){ var d = Math.random() < pr.value ? 1 : 0; r += d; path.push(r); } balls.push({age: 0, path: path, bin: r}); }
    var lp = k.loop(function(dt){
      acc += rate.value * dt; while (acc >= 1){ acc -= 1; spawn(); }
      var n = rows.value, speed = 9;
      for (var i = balls.length - 1; i >= 0; i--){ balls[i].age += dt; if (balls[i].age * speed >= n + 1.3){ counts[balls[i].bin]++; N++; balls.splice(i, 1); } }
      k.redraw();
    });
    k.button("▶ / ⏸", function(){ lp.running ? lp.pause() : lp.play(); }, true);
    k.button("+ 500 billes d'un coup", function(){ for (var j = 0; j < 500; j++){ var r = 0; for (var i = 0; i < rows.value; i++) if (Math.random() < pr.value) r++; counts[r]++; N++; } });
    k.button("Vider", reset);
    var ro = k.readouts(["Billes tombées", "Moyenne observée", "Moyenne np", "Écart-type observé", "Écart-type √(np(1−p))"]);
    reset();
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgrad(c, "#f4f7fb", "#e8eef7");
      var n = rows.value, p = pr.value, cx = c.W / 2, y0 = 40, dx = Math.min((c.W - 40) / (n + 2), 40), binTop = c.H - 150, dy = (binTop - y0 - 14) / n, binH = 118;
      // alvéoles
      var M = 1; for (var j = 0; j <= n; j++) M = Math.max(M, counts[j], N * binom(n, j, p));
      M *= 1.08;
      for (j = 0; j <= n; j++){
        var bx = cx + (j - n / 2) * dx - dx / 2, h = counts[j] / M * binH;
        ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(bx, binTop + 12, dx, binH);
        var g = ctx.createLinearGradient(0, binTop + 12 + binH - h, 0, binTop + 12 + binH); g.addColorStop(0, "#3b82f6"); g.addColorStop(1, COL.blue);
        ctx.fillStyle = g; ctx.fillRect(bx + 1, binTop + 12 + binH - h, dx - 2, h);
        ctx.strokeStyle = "#98a6bd"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, binTop + 12); ctx.lineTo(bx, binTop + 12 + binH); ctx.stroke();
        if (dx > 20) txt(c, String(j), bx + dx / 2, binTop + 12 + binH + 11, {size: 11, color: COL.grey});
      }
      ctx.beginPath(); ctx.moveTo(cx - (n / 2 + 0.5) * dx, binTop + 12); ctx.lineTo(cx - (n / 2 + 0.5) * dx, binTop + 12 + binH); ctx.lineTo(cx + (n / 2 + 0.5) * dx, binTop + 12 + binH); ctx.lineTo(cx + (n / 2 + 0.5) * dx, binTop + 12); ctx.strokeStyle = "#98a6bd"; ctx.stroke();
      // courbe binomiale attendue
      ctx.strokeStyle = COL.red; ctx.lineWidth = 2.2; ctx.beginPath();
      for (j = 0; j <= n; j++){ var xx = cx + (j - n / 2) * dx, yy = binTop + 12 + binH - N * binom(n, j, p) / M * binH; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
      for (j = 0; j <= n; j++) circ(ctx, cx + (j - n / 2) * dx, binTop + 12 + binH - N * binom(n, j, p) / M * binH, 3, COL.red);
      if (cur.value && N > 0){
        var mu = n * p, sg = Math.sqrt(n * p * (1 - p)); ctx.strokeStyle = COL.green; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath();
        for (var t = 0; t <= 100; t++){ var q = -0.5 + (n + 1) * t / 100, f = Math.exp(-0.5 * Math.pow((q - mu) / sg, 2)) / (sg * Math.sqrt(TAU)); var X = cx + (q - n / 2) * dx, Y = binTop + 12 + binH - N * f / M * binH; t ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      // clous
      for (var i = 0; i < n; i++) for (j = 0; j <= i; j++) circ(ctx, cx + (j - i / 2) * dx, y0 + i * dy, 3.4, "#5b6b84");
      // billes
      balls.forEach(function(b){
        var tau = Math.min(n + 1.3, b.age * 9), i0 = Math.floor(tau), f = tau - i0;
        var r0 = i0 === 0 ? 0 : b.path[i0 - 1], r1 = i0 < n ? b.path[i0] : r0;
        var xa = cx + (r0 - i0 / 2) * dx, xb = i0 < n ? cx + (r1 - (i0 + 1) / 2) * dx : xa;
        var ff = f * f * (3 - 2 * f);
        var x = xa + (xb - xa) * (i0 < n ? ff : 0), y = tau <= n ? y0 - 16 + tau * dy : y0 - 16 + n * dy + (tau - n) * (binTop - y0 + 4 - n * dy + 18) / 1.3;
        circ(ctx, x, y, 4.4, "#f59e0b", "#b45309", 1.4);
      });
      txt(c, "p = " + F(p, 2) + "  ·  n = " + n + " rangées", 12, 14, {align: "left", color: COL.ink, size: 13});
      txt(c, "courbe rouge : effectif attendu (loi binomiale)", c.W - 12, 14, {align: "right", color: COL.red, size: 12});
      var mean = 0, sq = 0; for (j = 0; j <= n; j++){ mean += j * counts[j]; sq += j * j * counts[j]; }
      if (N) { mean /= N; sq = Math.sqrt(Math.max(0, sq / N - mean * mean)); }
      ro.set(0, N); ro.set(1, N ? F(mean, 2) : "—"); ro.set(2, F(n * p, 2)); ro.set(3, N ? F(sq, 2) : "—"); ro.set(4, F(Math.sqrt(n * p * (1 - p)), 2));
    });
    lp.play();
  }
});

/* 7 ---------------------------------------------------------------- épicycles */
function epiShape(name){
  var pts = [], i, t;
  if (name === "coeur"){ for (i = 0; i < 3000; i++){ t = i / 3000 * TAU; pts.push([16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); } }
  else if (name === "etoile"){ var v = []; for (i = 0; i < 10; i++){ var a = i / 10 * TAU - PI / 2, r = i % 2 ? 0.42 : 1; v.push([r * Math.cos(a), r * Math.sin(a)]); } v.push(v[0]); for (i = 0; i < 10; i++) for (var s = 0; s < 300; s++) pts.push([v[i][0] + (v[i + 1][0] - v[i][0]) * s / 300, v[i][1] + (v[i + 1][1] - v[i][1]) * s / 300]); }
  else if (name === "rose"){ for (i = 0; i < 3000; i++){ t = i / 3000 * PI; pts.push([Math.cos(3 * t) * Math.cos(t), -Math.cos(3 * t) * Math.sin(t)]); } }
  else if (name === "lemniscate"){ for (i = 0; i < 3000; i++){ t = i / 3000 * TAU; pts.push([Math.cos(t) / (1 + Math.sin(t) * Math.sin(t)), Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t))]); } }
  return pts;
}
function epiPrep(pts, N){
  // rééchantillonnage à pas d'arc constant, centrage, normalisation
  var d = [0], i, L = 0; for (i = 1; i < pts.length; i++){ L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(L); }
  var out = [], j = 0; for (i = 0; i < N; i++){ var target = L * i / N; while (j < d.length - 2 && d[j + 1] < target) j++; var u = (target - d[j]) / Math.max(1e-12, d[j + 1] - d[j]); out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u]); }
  var mx = 0, my = 0; out.forEach(function(p){ mx += p[0]; my += p[1]; }); mx /= N; my /= N;
  var R = 0; out.forEach(function(p){ p[0] -= mx; p[1] -= my; R = Math.max(R, Math.hypot(p[0], p[1])); }); out.forEach(function(p){ p[0] /= R; p[1] /= R; });
  return out;
}
function epiDFT(z){
  var N = z.length, cs = [];
  for (var kk = -N / 2; kk < N / 2; kk++){ var re = 0, im = 0; for (var j = 0; j < N; j++){ var a = -TAU * kk * j / N, co = Math.cos(a), si = Math.sin(a); re += z[j][0] * co - z[j][1] * si; im += z[j][0] * si + z[j][1] * co; } cs.push({k: kk, re: re / N, im: im / N, a: Math.hypot(re, im) / N}); }
  cs.sort(function(a, b){ return b.a - a.a; });
  return cs;
}
SFA.sim({
  id: "um-c11-epicycles", ch: "c11", tag: "Séries de Fourier",
  titre: "Les épicycles de Fourier : des cercles qui dessinent un cœur",
  resume: "Une chaîne de cercles qui tournent à des vitesses entières trace n'importe quelle courbe fermée. Dessine la tienne !",
  but: "Choisis une figure (ou dessine-la à main levée), puis augmente le nombre de cercles : la courbe tracée par le dernier cercle se rapproche de la figure.",
  aRetenir: "Une courbe fermée z(t), vue comme un nombre complexe, se décompose en somme de rotations : z(t) ≈ Σ cₖ·e^{2πikt}, où cₖ est le k-ième coefficient de Fourier (calculé ici par transformée de Fourier discrète sur 256 points). Chaque terme est un cercle de rayon |cₖ| qui tourne à la vitesse k. On garde les plus grands rayons en premier ; l'erreur quadratique restante vaut √(Σ des |cₖ|² omis) (égalité de Parseval). Historique : Fourier (1822) ; l'idée d'épicycles remonte à Ptolémée et à l'astronomie grecque.",
  piege: "Les cercles ne sont pas « choisis pour la forme » : ils sont imposés par la formule. Les angles vifs (pointes de l'étoile) exigent beaucoup de cercles (phénomène de Gibbs).",
  build: function(k, S){
    var c = k.canvas(400), N = 256;
    var shape = "coeur", z = epiPrep(epiShape("coeur"), N), cs = epiDFT(z), phase = 0, raw = null;
    var sel = k.select("Figure", [["coeur", "Cœur"], ["etoile", "Étoile à 5 branches"], ["rose", "Rosace à 3 pétales"], ["lemniscate", "Lemniscate de Bernoulli"], ["free", "À main levée (dessine sur la zone)"]], "coeur", function(v){
      shape = v; if (v !== "free"){ z = epiPrep(epiShape(v), N); cs = epiDFT(z); phase = 0; }
    });
    var K = k.slider("Nombre de cercles", 1, 120, 1, 14, "");
    var sp = k.seg("Vitesse", [[0.05, "lente"], [0.12, "normale"], [0.3, "rapide"]], 0.12);
    var showC = k.toggle("Afficher les cercles", true);
    var lp = k.loop(function(dt){ phase += dt * sp.value; if (phase > 1.02) phase = 0; k.redraw(); });
    k.button("▶ / ⏸", function(){ lp.running ? lp.pause() : lp.play(); }, true);
    var ro = k.readouts(["Cercles utilisés", "Rayon du plus grand", "Rayon du dernier cercle", "Erreur quadratique restante"]);
    var sc = 1, ox = 0, oy = 0;
    c.pointer(function(type, p){
      if (shape !== "free") return;
      if (type === "down"){ raw = [[(p.x - ox) / sc, (p.y - oy) / sc]]; }
      else if (type === "drag" && raw){ raw.push([(p.x - ox) / sc, (p.y - oy) / sc]); k.redraw(); }
      else if (type === "up" && raw){ if (raw.length > 12){ raw.push(raw[0]); z = epiPrep(raw, N); cs = epiDFT(z); phase = 0; } raw = null; k.redraw(); }
    });
    function pos(kk, nU, ph){ var x = 0, y = 0; for (var i = 0; i < nU; i++){ var a = TAU * cs[i].k * ph, co = Math.cos(a), si = Math.sin(a); x += cs[i].re * co - cs[i].im * si; y += cs[i].re * si + cs[i].im * co; } return [x, y]; }
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgrad(c, "#0f1b2d", "#16264a");
      sc = Math.min(c.W, c.H) * 0.4; ox = c.W / 2; oy = c.H / 2;
      var nU = Math.min(K.value, cs.length);
      // figure cible
      ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]); ctx.beginPath();
      z.forEach(function(p, i){ var X = ox + p[0] * sc, Y = oy + p[1] * sc; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      if (raw){ ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 2.5; ctx.beginPath(); raw.forEach(function(p, i){ var X = ox + p[0] * sc, Y = oy + p[1] * sc; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); }
      // courbe tracée jusqu'à la phase courante
      var steps = Math.max(2, Math.round(Math.min(phase, 1) * 500)), grad = ctx.createLinearGradient(ox - sc, oy, ox + sc, oy); grad.addColorStop(0, "#f472b6"); grad.addColorStop(1, "#fbbf24");
      ctx.strokeStyle = grad; ctx.lineWidth = 3.2; ctx.lineJoin = "round"; ctx.beginPath();
      for (var i = 0; i <= steps; i++){ var q = pos(0, nU, i / 500); var X = ox + q[0] * sc, Y = oy + q[1] * sc; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.stroke();
      // cercles
      var x = 0, y = 0, ph = Math.min(phase, 1);
      for (i = 0; i < nU; i++){
        var a = TAU * cs[i].k * ph, co = Math.cos(a), si = Math.sin(a), dx = cs[i].re * co - cs[i].im * si, dy = cs[i].re * si + cs[i].im * co, r = cs[i].a * sc;
        if (showC.value && r > 0.6){ ctx.strokeStyle = "rgba(125,211,252," + (i < 3 ? 0.55 : 0.32) + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ox + x * sc, oy + y * sc, r, 0, TAU); ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.beginPath(); ctx.moveTo(ox + x * sc, oy + y * sc); ctx.lineTo(ox + (x + dx) * sc, oy + (y + dy) * sc); ctx.stroke(); }
        x += dx; y += dy;
      }
      circ(ctx, ox + x * sc, oy + y * sc, 4.5, "#fbbf24");
      if (shape === "free" && z.length && !raw && !c._drawn) {}
      var om = 0; for (i = nU; i < cs.length; i++) om += cs[i].a * cs[i].a;
      ro.set(0, nU); ro.set(1, F(cs[0].a, 3)); ro.set(2, F(cs[nU - 1].a, 4)); ro.set(3, F(Math.sqrt(om) * 100, 2) + " % du rayon");
    });
    lp.play();
  }
});

/* 8 ---------------------------------------------------------------- logistique */
function logiSim(r, x0, n){ var a = [x0]; for (var i = 0; i < n; i++) a.push(r * a[i] * (1 - a[i])); return a; }
function logiRegime(r){
  var x = 0.3, i; for (i = 0; i < 4000; i++) x = r * x * (1 - x);
  var x0 = x; for (var p = 1; p <= 64; p++){ x = r * x * (1 - x); if (Math.abs(x - x0) < 1e-7) return p; }
  return 0;
}
SFA.sim({
  id: "um-c11-logistique", ch: "c11", tag: "Chaos",
  titre: "L'application logistique : de l'ordre au chaos",
  resume: "xₙ₊₁ = r·xₙ(1−xₙ) : une formule d'une ligne qui produit un point fixe, des cycles de plus en plus longs, puis le chaos.",
  but: "Fais varier r (ou clique sur le diagramme de bifurcation) : observe la toile d'araignée, la suite et la sensibilité aux conditions initiales.",
  aRetenir: "Pour 0 < r < 3 la suite converge vers le point fixe 1 − 1/r. À r = 3 il devient instable et un cycle de période 2 apparaît, puis période 4 (r ≈ 3,449), 8 (3,544)… de plus en plus vite : le rapport des écarts tend vers la constante de Feigenbaum δ ≈ 4,669. Au-delà de r∞ ≈ 3,5699 le comportement est chaotique (exposant de Lyapunov > 0) avec des fenêtres de stabilité (période 3 vers r ≈ 3,83). Histoire : modèle de population de Verhulst (1838) ; Robert May l'étudie dans Nature en 1976 ; Feigenbaum découvre l'universalité en 1975-78.",
  piege: "Chaos ne veut pas dire « au hasard » : la règle est parfaitement déterministe. Mais deux départs très proches s'écartent exponentiellement, donc la prédiction à long terme est impossible.",
  build: function(k, S){
    var c1 = k.canvas(210), c2 = k.canvas(300), c3 = k.canvas(130);
    var r = k.slider("Paramètre r", 2.4, 4, 0.001, 3.2, "");
    var x0 = k.slider("Départ x₀", 0.02, 0.98, 0.01, 0.2, "");
    var nst = k.slider("Itérations tracées", 0, 80, 1, 25, "");
    var two = k.toggle("Comparer avec x₀ + 0,0001 (sensibilité)", true);
    k.button("Animer la toile", function(){ nst.set(0); anim = true; }, true);
    var pre = [["2,8 point fixe", 2.8], ["3,2 cycle 2", 3.2], ["3,5 cycle 4", 3.5], ["3,5699 limite", 3.5699], ["3,7 chaos", 3.7], ["3,83 période 3", 3.83], ["4 plein chaos", 4]];
    pre.forEach(function(p){ k.button(p[0], function(){ r.set(p[1]); }); });
    var anim = false, tick = 0;
    var lp = k.loop(function(dt){ if (anim){ tick += dt; if (tick > 0.12){ tick = 0; if (nst.value < 60) nst.set(nst.value + 1); else anim = false; } k.redraw(); } });
    lp.play();
    var ro = k.readouts(["r", "Régime", "Point fixe 1 − 1/r", "Exposant de Lyapunov"]);
    var bif = null, bkey = "";
    c1.pointer(function(type, p){ if (type === "down" || type === "drag"){ var L = 40, Rr = 12; r.set(2.4 + (p.x - L) / (c1.W - L - Rr) * 1.6); k.redraw(); } });
    function bifBuild(){
      var key = c1.W + "x" + c1.H; if (key === bkey) return; bkey = key;
      var L = 40, Rr = 12, T = 10, B = 24, w = c1.W - L - Rr, h = c1.H - T - B;
      bif = document.createElement("canvas"); bif.width = Math.round(c1.W); bif.height = Math.round(c1.H); var b = bif.getContext("2d");
      var cnt = new Float32Array(w * h);
      for (var i = 0; i < w; i++){ var rr = 2.4 + 1.6 * i / (w - 1), x = 0.31; for (var j = 0; j < 400; j++) x = rr * x * (1 - x); for (j = 0; j < 260; j++){ x = rr * x * (1 - x); var yy = Math.floor((1 - x) * (h - 1)); if (yy >= 0 && yy < h) cnt[yy * w + i]++; } }
      var im = b.createImageData(w, h);
      for (i = 0; i < w * h; i++){ var v = cnt[i]; if (v > 0){ var a = Math.min(1, 0.35 + v / 8); im.data[i * 4] = 30; im.data[i * 4 + 1] = 63; im.data[i * 4 + 2] = 143; im.data[i * 4 + 3] = Math.round(255 * a); } }
      b.putImageData(im, L, T);
    }
    k.draw(function(){
      var ctx = c1.ctx; c1.clear(); bifBuild(); ctx.drawImage(bif, 0, 0, c1.W, c1.H);
      var L = 40, Rr = 12, T = 10, B = 24; function RX(v){ return L + (v - 2.4) / 1.6 * (c1.W - L - Rr); }
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.strokeRect(L, T, c1.W - L - Rr, c1.H - T - B);
      ctx.fillStyle = "#5f6b7a"; ctx.font = "600 11px Mulish, system-ui"; ctx.textAlign = "center";
      [2.5, 3, 3.5, 4].forEach(function(v){ ctx.fillText(F(v, 1), RX(v), c1.H - 10); });
      ctx.textAlign = "right"; ctx.fillText("1", L - 5, T + 6); ctx.fillText("0", L - 5, c1.H - B);
      txt(c1, "r →", c1.W - Rr, c1.H - 10, {align: "right", color: COL.ink, size: 12});
      [[3, "3"], [3.449, ""], [3.5699, "r∞ ≈ 3,57"], [3.83, "3,83"]].forEach(function(m){ S.draw.line(c1, RX(m[0]), T, RX(m[0]), c1.H - B, "rgba(180,35,24,.25)", 1, [3, 3]); if (m[1]) txt(c1, m[1], RX(m[0]) + 3, T + 8, {align: "left", color: COL.red, size: 10}); });
      S.draw.line(c1, RX(r.value), T, RX(r.value), c1.H - B, COL.red, 2.2);
      txt(c1, "clique ou glisse pour choisir r", L + 6, c1.H - B - 10, {align: "left", color: COL.grey, size: 11});
      // toile d'araignée
      ctx = c2.ctx; c2.clear(); var ax = S.draw.axes(c2, {x0: 0, x1: 1, y0: 0, y1: 1, xl: "x", yl: "f(x)", stepX: 0.25, stepY: 0.25, equal: true});
      S.draw.fn(c2, ax, function(x){ return r.value * x * (1 - x); }, COL.blue, 2.8);
      S.draw.line(c2, ax.X(0), ax.Y(0), ax.X(1), ax.Y(1), COL.grey, 1.8);
      var xs = logiSim(r.value, x0.value, Math.max(0, nst.value));
      ctx = c2.ctx; ctx.save(); ctx.strokeStyle = COL.red; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ax.X(xs[0]), ax.Y(0));
      for (var i = 0; i < xs.length - 1; i++){ ctx.lineTo(ax.X(xs[i]), ax.Y(xs[i + 1])); ctx.lineTo(ax.X(xs[i + 1]), ax.Y(xs[i + 1])); }
      ctx.stroke(); ctx.restore(); S.draw.dot(c2, ax.X(xs[0]), ax.Y(0), 4.5, COL.green);
      if (r.value > 1) S.draw.dot(c2, ax.X(1 - 1 / r.value), ax.Y(1 - 1 / r.value), 4, COL.amber);
      // suite
      ctx = c3.ctx; c3.clear(); var ax3 = S.draw.axes(c3, {x0: 0, x1: 60, y0: 0, y1: 1, stepX: 10, stepY: 0.5, l: 34, t: 8, b: 22});
      var A = logiSim(r.value, x0.value, 60), Bq = logiSim(r.value, x0.value + 1e-4, 60);
      function line(a, col, w){ ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); a.forEach(function(v, i){ i ? ctx.lineTo(ax3.X(i), ax3.Y(v)) : ctx.moveTo(ax3.X(i), ax3.Y(v)); }); ctx.stroke(); a.forEach(function(v, i){ S.draw.dot(c3, ax3.X(i), ax3.Y(v), 2.4, col); }); }
      if (two.value) line(Bq, COL.red, 1.4); line(A, COL.blue, 1.8);
      txt(c3, "xₙ en fonction de n" + (two.value ? " (bleu : x₀ ; rouge : x₀ + 0,0001)" : ""), c3.W - 8, 10, {align: "right", color: COL.ink, size: 11});
      var pp = logiRegime(r.value), x = 0.3, ly = 0; for (i = 0; i < 1000; i++) x = r.value * x * (1 - x); for (i = 0; i < 6000; i++){ x = r.value * x * (1 - x); ly += Math.log(Math.abs(r.value * (1 - 2 * x)) + 1e-300); } ly /= 6000;
      ro.set(0, F(r.value, 4)); ro.set(1, pp === 1 ? "point fixe" : pp ? "cycle de période " + pp : (ly > 0 ? "chaos" : "période > 64")); ro.set(2, r.value > 1 ? F(1 - 1 / r.value, 4) : "0"); ro.set(3, F(ly, 3) + (ly > 0.005 ? " > 0" : ""));
    });
  }
});

/* 9 ---------------------------------------------------------------- Collatz */
function collatz(n){ var a = [n], g = 0; while (n !== 1 && g < 5000){ n = n % 2 ? 3 * n + 1 : n / 2; a.push(n); g++; } return a; }
var CZ = null;
function czTable(N){ if (CZ && CZ.length > N) return CZ; var memo = new Int32Array(N + 1); memo[1] = 0; CZ = memo;
  for (var m = 2; m <= N; m++){ var n = m, s = 0; while (n >= m){ n = n % 2 ? 3 * n + 1 : n / 2; s++; } memo[m] = s + memo[n]; }
  return memo; }
SFA.sim({
  id: "um-c11-collatz", ch: "c11", tag: "Suites · problème ouvert",
  titre: "La conjecture de Collatz : la suite des grêlons",
  resume: "Si n est pair, divise par 2 ; s'il est impair, prends 3n + 1. Atteint-on toujours 1 ? Personne ne sait le démontrer.",
  but: "Entre un entier de départ : regarde la montagne russe (rouge : 3n + 1, bleu : n/2), puis le nuage des temps de vol de tous les entiers jusqu'à N.",
  aRetenir: "La suite de Collatz de 27 monte jusqu'à 9232 avant de retomber en 111 étapes. On l'a vérifiée pour tous les entiers jusqu'à environ 2,95·10²⁰ sans contre-exemple, mais personne ne sait prouver qu'elle atteint 1 pour tout n. Le motif en nuage des temps de vol ressemble à un hasard organisé. Proposée par Lothar Collatz en 1937 ; Paul Erdős aurait dit « les mathématiques ne sont pas encore prêtes pour de tels problèmes ».",
  piege: "Vérifier un milliard de cas ne démontre rien : une conjecture reste une conjecture tant qu'elle n'est pas prouvée pour tous les entiers.",
  build: function(k, S){
    var c1 = k.canvas(280), c2 = k.canvas(220);
    var inp = k.input("Départ n (entier de 1 à 10⁹)", 27, null, "number");
    var logy = k.toggle("Échelle logarithmique en ordonnée", false);
    var NN = k.slider("Nuage des temps de vol : entiers jusqu'à N", 200, 30000, 100, 5000, "");
    [27, 97, 871, 6171, 77031, 837799].forEach(function(v){ k.button(String(v), function(){ inp.set(v); }); });
    var ro = k.readouts(["Étapes jusqu'à 1", "Altitude maximale", "Étapes en 3n + 1", "Plus long vol jusqu'à N"]);
    function nval(){ var v = Math.floor(parseFloat(inp.value)); if (!(v >= 1)) v = 1; if (v > 1e9) v = 1e9; return v; }
    k.draw(function(){
      var n = nval(), a = collatz(n), mx = Math.max.apply(null, a), odd = 0;
      for (var i = 0; i < a.length - 1; i++) if (a[i] % 2) odd++;
      var ctx = c1.ctx; c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: Math.max(8, a.length - 1), y0: logy.value ? 0 : 0, y1: logy.value ? Math.log10(mx) * 1.08 + 0.1 : mx * 1.08, xl: "étape", l: 54, stepY: logy.value ? 1 : undefined});
      // axe y log : on redessine les graduations
      if (logy.value){ ctx.save(); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 52, c1.H - 30); ctx.fillStyle = "#5f6b7a"; ctx.font = "600 11px Mulish"; ctx.textAlign = "right"; for (var e = 0; e <= Math.log10(mx) + 0.01; e++){ ctx.fillText(e === 0 ? "1" : e === 1 ? "10" : "10" + String(e).split("").map(function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; }).join(""), 48, ax.Y(e)); } ctx.restore(); }
      function Y(v){ return ax.Y(logy.value ? Math.log10(v) : v); }
      ctx.save(); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.2; ctx.beginPath(); a.forEach(function(v, i){ i ? ctx.lineTo(ax.X(i), Y(v)) : ctx.moveTo(ax.X(i), Y(v)); }); ctx.stroke(); ctx.restore();
      var rad = Math.max(1.6, Math.min(4, 400 / a.length));
      a.forEach(function(v, i){ if (i < a.length - 1) S.draw.dot(c1, ax.X(i), Y(v), rad, v % 2 ? COL.red : COL.sky); else S.draw.dot(c1, ax.X(i), Y(v), rad + 2, COL.green); });
      var imx = a.indexOf(mx); txt(c1, "max " + F(mx, 0), ax.X(imx), Y(mx) - 10, {color: COL.amber, size: 12});
      // nuage
      ctx = c2.ctx; c2.clear(); var N = NN.value, T = czTable(30000), best = 0, bm = 1;
      for (var m = 1; m <= N; m++) if (T[m] > best){ best = T[m]; bm = m; }
      var ax2 = S.draw.axes(c2, {x0: 0, x1: N, y0: 0, y1: Math.ceil(best * 1.1 / 50) * 50, xl: "m", yl: "étapes", l: 50});
      var step = Math.max(1, Math.floor(N / 3000)); ctx.fillStyle = "rgba(30,63,143,.55)";
      for (m = 1; m <= N; m += step) ctx.fillRect(ax2.X(m) - 0.8, ax2.Y(T[m]) - 0.8, 1.8, 1.8);
      if (n <= N) S.draw.dot(c2, ax2.X(n), ax2.Y(T[n]), 5, COL.red);
      ro.set(0, F(a.length - 1, 0)); ro.set(1, F(mx, 0)); ro.set(2, F(odd, 0)); ro.set(3, F(best, 0) + " (pour " + F(bm, 0) + ")");
    });
  }
});

/* 10 ---------------------------------------------------------------- jeu du chaos */
SFA.sim({
  id: "um-c11-jeu-du-chaos", ch: "c11", tag: "Fractales",
  titre: "Le jeu du chaos : l'ordre naît du hasard",
  resume: "Un point saute à chaque fois à mi-chemin d'un sommet tiré au hasard : le triangle de Sierpiński apparaît.",
  but: "Choisis le nombre de sommets et la fraction du saut. Le point rouge est le point courant ; la carte de densité se construit avec les milliers de points.",
  aRetenir: "Chaque saut est une similitude de rapport s = 1 − f (f = fraction parcourue vers le sommet). La figure limite est invariante : n copies d'elle-même réduites du rapport s. Si les copies se touchent à peine, sa dimension fractale vaut ln n / ln(1/s) : pour le triangle de Sierpiński (n = 3, s = 1/2) c'est ln 3/ln 2 ≈ 1,585. Wacław Sierpiński décrit ce triangle en 1915 ; Michael Barnsley popularise le « jeu du chaos » (1988).",
  piege: "Avec un carré (n = 4) et f = 1/2, on ne voit rien de spécial : les quatre copies recouvrent tout le carré (dimension 2). Le motif exige que les copies ne se chevauchent presque pas, ou une règle (ne pas répéter le même sommet).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.95}), BW = 520, buf = document.createElement("canvas"); buf.width = buf.height = BW; var bctx = buf.getContext("2d");
    var img = bctx.createImageData(BW, BW), cnt = new Uint16Array(BW * BW);
    var st = {x: 0, y: 0, last: -1, prev: -1, n: 0, vx: -1};
    var nv = k.seg("Sommets", [[3, "3"], [4, "4"], [5, "5"], [6, "6"]], 3, function(){ reset(); });
    var fr = k.slider("Fraction du saut f (vers le sommet)", 0.3, 0.8, 0.01, 0.5, "", function(){ reset(); });
    var rule = k.toggle("Interdire de choisir 2 fois de suite le même sommet", false, function(){ reset(); });
    var sp = k.seg("Cadence", [[1, "1"], [20, "20"], [400, "400"], [6000, "6000"]], 400);
    function verts(){ var n = +nv.value, v = []; for (var i = 0; i < n; i++){ var a = -PI / 2 + i * TAU / n; v.push([BW / 2 + 0.47 * BW * Math.cos(a), BW / 2 + 0.47 * BW * Math.sin(a) + (n === 3 ? 0.07 * BW : 0)]); } return v; }
    function reset(){ cnt = new Uint16Array(BW * BW); img = bctx.createImageData(BW, BW); bctx.clearRect(0, 0, BW, BW); st.n = 0; var v = verts(); st.x = v[0][0] * 0.5 + v[1][0] * 0.5; st.y = v[0][1] * 0.5 + v[1][1] * 0.5; st.last = -1; }
    function step(){
      var v = verts(), i; do { i = rnd(v.length); } while (rule.value && i === st.last);
      st.x += (v[i][0] - st.x) * fr.value; st.y += (v[i][1] - st.y) * fr.value; st.last = i; st.n++;
      if (st.n > 12){ var px = Math.floor(st.x), py = Math.floor(st.y); if (px >= 0 && px < BW && py >= 0 && py < BW){ var idx = py * BW + px; if (cnt[idx] < 65000) cnt[idx]++; var q = Math.min(1, Math.log(1 + cnt[idx]) / Math.log(30)); var o = idx * 4;
        img.data[o] = 40 + 215 * q; img.data[o + 1] = 80 + 160 * q * q; img.data[o + 2] = 200 - 140 * q; img.data[o + 3] = 255; } }
    }
    var lp = k.loop(function(){ for (var i = 0; i < sp.value; i++) step(); bctx.putImageData(img, 0, 0); k.redraw(); });
    k.button("▶ / ⏸", function(){ lp.running ? lp.pause() : lp.play(); }, true);
    k.button("Sierpiński", function(){ nv.set(3); fr.set(0.5); rule.set(false); reset(); });
    k.button("Pentagone d'or", function(){ nv.set(5); fr.set(0.62); rule.set(false); reset(); });
    k.button("Hexagone (flocon)", function(){ nv.set(6); fr.set(0.67); rule.set(false); reset(); });
    k.button("Carré sans répétition", function(){ nv.set(4); fr.set(0.5); rule.set(true); reset(); });
    k.button("Recommencer", reset);
    var ro = k.readouts(["Points placés", "Rapport s = 1 − f", "Dimension ln n / ln(1/s)"]);
    reset();
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgfill(c, "#0b1220");
      var s = Math.min(c.W, c.H), ox = (c.W - s) / 2, oy = (c.H - s) / 2, q = s / BW;
      ctx.drawImage(buf, ox, oy, s, s);
      var v = verts(); v.forEach(function(p, i){ circ(ctx, ox + p[0] * q, oy + p[1] * q, 5, "#fbbf24"); txt(c, String(i + 1), ox + p[0] * q, oy + p[1] * q - 14, {color: "#fde68a", size: 12}); });
      if (st.last >= 0){ var tv = v[st.last]; ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox + st.x * q, oy + st.y * q); ctx.lineTo(ox + tv[0] * q, oy + tv[1] * q); ctx.stroke(); ctx.setLineDash([]); }
      circ(ctx, ox + st.x * q, oy + st.y * q, 4, "#f43f5e", "#fff", 1.4);
      var n = +nv.value, sc = 1 - fr.value, d = Math.min(2, Math.log(n) / Math.log(1 / sc));
      ro.set(0, F(st.n, 0)); ro.set(1, F(sc, 3)); var sj = 0; for (var j = 1; j <= Math.floor(n / 4); j++) sj += Math.cos(TAU * j / n); var st0 = 1 / (2 * (1 + sj));
      ro.set(2, sc > st0 + 1e-9 ? "2 (les copies se recouvrent)" : F(d, 3));
    });
    lp.play();
  }
});

/* 11 ---------------------------------------------------------------- Mandelbrot */
SFA.sim({
  id: "um-c11-mandelbrot", ch: "c11", tag: "Fractales · nombres complexes",
  titre: "L'ensemble de Mandelbrot : zoom à l'infini",
  resume: "On itère z → z² + c : l'ensemble des c dont l'orbite reste bornée dessine la figure fractale la plus célèbre.",
  but: "Zoome (molette ou clic), déplace-toi en glissant, et survole un point c : en bas, l'ensemble de Julia associé à ce c et la trajectoire de 0.",
  aRetenir: "Pour chaque nombre complexe c, on itère z₀ = 0, zₙ₊₁ = zₙ² + c. L'ensemble de Mandelbrot M est l'ensemble des c pour lesquels |zₙ| reste borné (noir). Les couleurs mesurent la vitesse d'évasion des autres points. M est connexe (Douady et Hubbard, 1982), son bord est de dimension 2 (Shishikura, 1998) et son aire vaut environ 1,5066. Le point c est dans M si et seulement si l'ensemble de Julia de c est connexe. Benoît Mandelbrot en obtient la première image en 1980 chez IBM.",
  piege: "Aucun ordinateur ne « voit » la vraie frontière : plus on zoome, plus il faut d'itérations. Un point qui paraît noir peut en réalité s'échapper après des milliers d'itérations.",
  build: function(k, S){
    var c1 = k.canvas(0, {ratio: 0.62}), c2 = k.canvas(0, {ratio: 0.3});
    var V = {cx: -0.5, cy: 0, w: 3.4}, ver = 0, hover = null, buf = null, jbuf = null, jc = [-0.7269, 0.1889];
    var it = k.slider("Itérations maximales", 40, 1500, 10, 250, "", function(){ renderM(); });
    var lut = []; for (var i = 0; i < 1024; i++){ var t = i / 1024 * TAU; lut.push([Math.round(255 * (0.5 + 0.5 * Math.cos(t + 4.0))), Math.round(255 * (0.5 + 0.5 * Math.cos(t + 4.7))), Math.round(255 * (0.5 + 0.5 * Math.cos(t + 5.6)))]); }
    function pix(x, y, c0x, c0y, julia, maxI){
      var zx, zy, cx, cy, n = 0, r2 = 0;
      if (julia){ zx = x; zy = y; cx = c0x; cy = c0y; } else {
        zx = 0; zy = 0; cx = x; cy = y;
        var q = (x - 0.25) * (x - 0.25) + y * y; if (q * (q + (x - 0.25)) < 0.25 * y * y || (x + 1) * (x + 1) + y * y < 0.0625) return -1;
      }
      var xx = zx * zx, yy = zy * zy;
      while (n < maxI && xx + yy < 65536){ zy = 2 * zx * zy + cy; zx = xx - yy + cx; xx = zx * zx; yy = zy * zy; n++; }
      if (n >= maxI) return -1;
      return n + 1 - Math.log(Math.log(Math.sqrt(xx + yy))) / Math.LN2;
    }
    function paint(cv, W, H, cxx, cyy, w, julia, cj, maxI, res){
      var pw = Math.max(8, Math.round(W * res)), ph = Math.max(8, Math.round(H * res)), b = document.createElement("canvas"); b.width = pw; b.height = ph;
      var g = b.getContext("2d"), im = g.createImageData(pw, ph), h = w * H / W;
      for (var j = 0; j < ph; j++) for (var i = 0; i < pw; i++){
        var x = cxx - w / 2 + (i + 0.5) / pw * w, y = cyy + h / 2 - (j + 0.5) / ph * h, m = pix(x, y, cj ? cj[0] : 0, cj ? cj[1] : 0, julia, maxI), o = (j * pw + i) * 4;
        if (m < 0){ im.data[o] = 6; im.data[o + 1] = 8; im.data[o + 2] = 24; } else { var col = lut[Math.floor(m * 12) & 1023]; im.data[o] = col[0]; im.data[o + 1] = col[1]; im.data[o + 2] = col[2]; }
        im.data[o + 3] = 255;
      }
      g.putImageData(im, 0, 0); return b;
    }
    function renderM(){
      var my = ++ver, resList = [0.2, 0.5, 1];
      (function go(i){ if (my !== ver || i >= resList.length) return; buf = paint(c1.cv, c1.W, c1.H, V.cx, V.cy, V.w, false, null, it.value, resList[i]); k.redraw(); setTimeout(function(){ go(i + 1); }, 10); })(0);
    }
    function renderJ(){ jbuf = paint(c2.cv, c2.W, c2.H, 0, 0, 3.6, true, jc, 220, 0.5); }
    function toC(p){ var h = V.w * c1.H / c1.W; return [V.cx - V.w / 2 + p.x / c1.W * V.w, V.cy + h / 2 - p.y / c1.H * h]; }
    var down = null, moved = false;
    c1.pointer(function(type, p){
      if (type === "down"){ down = {x: p.x, y: p.y, cx: V.cx, cy: V.cy}; moved = false; }
      else if (type === "drag" && down){ var dx = p.x - down.x, dy = p.y - down.y; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true; if (moved){ V.cx = down.cx - dx / c1.W * V.w; V.cy = down.cy + dy / c1.W * V.w; k.redraw(); } }
      else if (type === "up" && down){ if (moved) renderM(); else { var cc = toC(p); V.cx = cc[0]; V.cy = cc[1]; V.w /= 2; renderM(); } down = null; }
      else if (type === "move"){ hover = toC(p); jc = hover; renderJ(); k.redraw(); }
    });
    c1.cv.addEventListener("wheel", function(e){ e.preventDefault(); var r = c1.cv.getBoundingClientRect(), cc = toC({x: e.clientX - r.left, y: e.clientY - r.top}), f = e.deltaY < 0 ? 0.7 : 1 / 0.7;
      V.cx = cc[0] + (V.cx - cc[0]) * f; V.cy = cc[1] + (V.cy - cc[1]) * f; V.w = Math.min(4, V.w * f); renderM(); }, {passive: false});
    function go(cx, cy, w){ V.cx = cx; V.cy = cy; V.w = w; renderM(); }
    k.button("Zoom ×2", function(){ V.w /= 2; renderM(); }, true); k.button("Zoom ÷2", function(){ V.w = Math.min(4, V.w * 2); renderM(); }); k.button("Vue d'ensemble", function(){ go(-0.5, 0, 3.4); });
    k.button("Vallée des hippocampes", function(){ go(-0.7436, 0.1318, 0.02); }); k.button("Spirale", function(){ go(-0.7453, 0.1127, 0.0035); }); k.button("Éléphants", function(){ go(0.28, 0.007, 0.05); }); k.button("Mini-Mandelbrot", function(){ go(-1.7549, 0, 0.03); });
    var ro = k.readouts(["Centre", "Facteur de zoom", "c survolé", "Itérations avant fuite"]);
    renderJ(); renderM();
    k.draw(function(){
      var ctx = c1.ctx; c1.clear(); if (buf) ctx.drawImage(buf, 0, 0, c1.W, c1.H);
      if (hover){
        var zx = 0, zy = 0, pts = [[0, 0]], n = 0; for (n = 0; n < 40; n++){ var t = zx * zx - zy * zy + hover[0]; zy = 2 * zx * zy + hover[1]; zx = t; pts.push([zx, zy]); if (zx * zx + zy * zy > 100) break; }
        var h = V.w * c1.H / c1.W; ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.2; ctx.beginPath();
        pts.forEach(function(p, i){ var X = (p[0] - (V.cx - V.w / 2)) / V.w * c1.W, Y = (V.cy + h / 2 - p[1]) / h * c1.H; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
        circ(ctx, (hover[0] - (V.cx - V.w / 2)) / V.w * c1.W, (V.cy + h / 2 - hover[1]) / h * c1.H, 4, "#f43f5e", "#fff", 1.2);
      }
      ctx = c2.ctx; c2.clear(); if (jbuf) ctx.drawImage(jbuf, 0, 0, c2.W, c2.H);
      txt(c2, "Ensemble de Julia de c = " + F(jc[0], 4) + " " + (jc[1] < 0 ? "−" : "+") + " " + F(Math.abs(jc[1]), 4) + " i", 8, 12, {align: "left", color: "#fff", size: 12, bg: "rgba(0,0,0,.45)"});
      var m = hover ? pix(hover[0], hover[1], 0, 0, false, 5000) : null;
      ro.set(0, F(V.cx, 6) + (V.cy < 0 ? " − " : " + ") + F(Math.abs(V.cy), 6) + " i"); ro.set(1, "× " + F(3.4 / V.w, 1)); ro.set(2, hover ? F(hover[0], 5) + (hover[1] < 0 ? " − " : " + ") + F(Math.abs(hover[1]), 5) + " i" : "—");
      ro.set(3, hover ? (m < 0 ? "jamais (dans M)" : F(Math.floor(m), 0)) : "—");
    });
  }
});

/* 12 ---------------------------------------------------------------- Ulam */
function sieve(N){ var s = new Uint8Array(N + 1); s[0] = 1; s[1] = 1; for (var i = 2; i * i <= N; i++) if (!s[i]) for (var j = i * i; j <= N; j += i) s[j] = 1; return s; }
SFA.sim({
  id: "um-c11-ulam", ch: "c11", tag: "Nombres premiers",
  titre: "La spirale d'Ulam : les premiers s'alignent",
  resume: "On écrit les entiers en spirale carrée : les nombres premiers dessinent des diagonales inattendues.",
  but: "Choisis la taille et le nombre de départ : les nombres premiers (bleu) se regroupent sur des diagonales. Mets en évidence le polynôme d'Euler n² + n + 41.",
  aRetenir: "En 1963, pendant une réunion ennuyeuse, Stanisław Ulam griffonne les entiers en spirale et remarque que les premiers s'alignent sur des diagonales : ce sont les valeurs de polynômes du second degré (par exemple n² + n + 41 d'Euler, premier pour n de 0 à 39). La densité des premiers autour de N vaut environ 1/ln N (théorème des nombres premiers). Les diagonales ne sont pas expliquées par une formule générale : c'est un phénomène encore partiellement mystérieux (conjecture de Hardy-Littlewood).",
  piege: "Que des diagonales apparaissent ne signifie pas qu'on sait prédire les nombres premiers : sur une diagonale donnée, les premiers restent irréguliers et finissent par s'espacer.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.8}), shown = 1e9;
    var side = k.slider("Côté du carré", 5, 201, 2, 101, "", function(){ shown = 1e9; });
    var start = k.seg("Nombre au centre", [[1, "1"], [41, "41"]], 1, function(){ shown = 1e9; });
    var hi = k.seg("Surligner", [["none", "rien"], ["euler", "n² + n + 41"], ["diag", "diagonale du centre"]], "none");
    var lp = k.loop(function(){ shown += Math.max(3, Math.floor(side.value * side.value / 140)); if (shown >= side.value * side.value + 1) { shown = 1e9; lp.pause(); } k.redraw(); });
    k.button("▶ Dérouler la spirale", function(){ shown = 1; lp.play(); }, true);
    var ro = k.readouts(["Nombres affichés", "Nombres premiers", "Densité observée", "Densité 1/ln N"]);
    var SV = sieve(60000);
    var cache = {key: "", pos: []};
    function spiral(n){
      var key = n; if (cache.key === key) return cache.pos; var pos = [[0, 0]], x = 0, y = 0, len = 1, dir = 0, dx = [1, 0, -1, 0], dy = [0, -1, 0, 1];
      while (pos.length < n * n){ for (var rep = 0; rep < 2 && pos.length < n * n; rep++){ for (var s = 0; s < len && pos.length < n * n; s++){ x += dx[dir]; y += dy[dir]; pos.push([x, y]); } dir = (dir + 1) % 4; } len++; }
      cache.key = key; cache.pos = pos; return pos;
    }
    var euler = {}; for (var e = 0; e < 40; e++) euler[e * e + e + 41] = 1;
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgfill(c, "#f8fafc");
      var n = side.value, tot = n * n, pos = spiral(n), st = +start.value, cs = Math.min(c.W, c.H) / n, ox = (c.W - n * cs) / 2, oy = (c.H - n * cs) / 2, half = (n - 1) / 2;
      var lim = Math.min(tot, shown), np = 0;
      ctx.fillStyle = "#eef1f5"; ctx.fillRect(ox, oy, n * cs, n * cs);
      for (var i = 0; i < lim; i++){
        var v = st + i, prime = !SV[v], X = ox + (pos[i][0] + half) * cs, Y = oy + (pos[i][1] + half) * cs;
        if (prime) np++;
        var isE = hi.value === "euler" && euler[v], isD = hi.value === "diag" && Math.abs(pos[i][0]) === Math.abs(pos[i][1]);
        if (prime){ ctx.fillStyle = isE ? "#f59e0b" : isD ? "#dc2626" : COL.blue; ctx.fillRect(X, Y, cs, cs); if (cs >= 3 && (isE || isD)){ ctx.strokeStyle = "#fff"; ctx.strokeRect(X + 0.5, Y + 0.5, cs - 1, cs - 1); } }
        else if (isE || isD){ ctx.fillStyle = "rgba(245,158,11,.5)"; ctx.fillRect(X, Y, cs, cs); }
        if (cs >= 24){ ctx.fillStyle = prime ? "#fff" : "#6b7280"; ctx.font = "700 " + Math.floor(cs * 0.4) + "px Mulish"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(v, X + cs / 2, Y + cs / 2); }
      }
      var N = st + lim - 1;
      ro.set(0, F(lim, 0)); ro.set(1, F(np, 0)); ro.set(2, lim ? pct(np / lim, 1) : "—"); ro.set(3, N > 2 ? pct(1 / Math.log(N), 1) : "—");
    });
  }
});

/* 13 ---------------------------------------------------------------- phyllotaxie */
function phylloSpirals(alphaDeg, N){
  var a = alphaDeg / 360, R = 1, best = 1, rec = [], bestq = null;
  for (var q = 1; q <= 233; q++){ var d = q * a, dl = Math.abs(d - Math.round(d)); if (dl < best - 1e-9){ best = dl; var L = Math.hypot(R * q / (2 * N), TAU * R * dl); rec.push({q: q, L: L, dl: dl}); if (dl < 1e-6) break; } }
  rec.sort(function(x, y){ return x.L - y.L; });
  if (rec[0].dl < 1e-6) return [rec[0].q];
  return [rec[0].q, rec[1].q].sort(function(x, y){ return x - y; });
}
SFA.sim({
  id: "um-c11-phyllotaxie", ch: "c11", tag: "Nombre d'or · botanique",
  titre: "Le tournesol et l'angle d'or",
  resume: "Chaque graine est placée à 137,5° de la précédente : une variation de 0,1° suffit à détruire l'agencement parfait.",
  but: "Fais varier l'angle de divergence. À 137,51° les graines se tassent sans trou ; ailleurs, des rayons et des vides apparaissent. Colore selon n mod q pour voir les spirales.",
  aRetenir: "Dans le modèle de Vogel (1979), la graine n est placée à l'angle n·α et à la distance c√n du centre. L'angle d'or α = 360°·(1 − 1/φ) = 137,5077…° (φ = (1 + √5)/2) est le plus « irrationnel » des angles : c'est lui qui répartit le mieux les graines. Les spirales visibles se comptent en nombres de Fibonacci consécutifs (13 et 21, 21 et 34, 34 et 55…), car ce sont les dénominateurs des meilleures approximations rationnelles de α/360°.",
  piege: "Avec un angle rationnel (90°, 120°, 144°…) les graines s'alignent sur quelques rayons et il reste des vides : la nature n'est pas « magique », c'est un problème d'empilement.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.85}), shown = 0;
    var ang = k.slider("Angle de divergence α", 90, 180, 0.01, 137.51, "°", function(){ shown = Nn.value; });
    var Nn = k.slider("Nombre de graines", 50, 1500, 10, 600, "", function(){ shown = Nn.value; });
    var col = k.seg("Colorier selon n mod q", [[0, "dégradé"], [13, "q = 13"], [21, "q = 21"], [34, "q = 34"], [55, "q = 55"]], 0);
    [["Angle d'or 137,508°", 137.5077640], ["137,3°", 137.3], ["137,7°", 137.7], ["90°", 90], ["120°", 120], ["144°", 144], ["150°", 150]].forEach(function(p){ k.button(p[0], function(){ ang.set(p[1]); shown = Nn.value; }); });
    k.button("▶ Faire pousser", function(){ shown = 1; lp.play(); }, true);
    var lp = k.loop(function(){ shown += Math.max(2, Nn.value / 160); if (shown >= Nn.value){ shown = Nn.value; lp.pause(); } k.redraw(); });
    shown = Nn.value;
    var ro = k.readouts(["Angle α", "Écart à l'angle d'or", "Spirales dominantes (estimation)", "Graines"]);
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgrad(c, "#14301f", "#0b1a12");
      var N = Nn.value, a = ang.value * PI / 180, R = Math.min(c.W, c.H) * 0.47, cc = R / Math.sqrt(N), cx = c.W / 2, cy = c.H / 2, m = Math.min(N, Math.floor(shown));
      for (var n = 0; n < m; n++){
        var r = cc * Math.sqrt(n + 0.5), th = n * a, x = cx + r * Math.cos(th), y = cy + r * Math.sin(th), rad = Math.max(1.5, cc * 0.72);
        var cl = col.value > 0 ? hsl(((n % col.value) / col.value) * 340, 85, 58) : hsl(52 - 44 * n / N, 92, 62 - 10 * n / N);
        circ(ctx, x, y, rad, cl, "rgba(0,0,0,.25)", 0.8);
      }
      var sp = phylloSpirals(ang.value, N);
      ro.set(0, F(ang.value, 2) + "°"); ro.set(1, (ang.value - 137.507764 >= 0 ? "+" : "−") + F(Math.abs(ang.value - 137.507764), 2) + "°");
      ro.set(2, sp.length === 1 ? sp[0] + " bras (angle rationnel)" : sp[0] + " et " + sp[1]); ro.set(3, m + " / " + N);
    });
  }
});

/* 14 ---------------------------------------------------------------- Fibonacci */
SFA.sim({
  id: "um-c11-fibonacci", ch: "c11", tag: "Suites · nombre d'or",
  titre: "Fibonacci : des lapins au nombre d'or",
  resume: "Chaque terme est la somme des deux précédents ; le rapport de deux termes consécutifs se rapproche de φ = 1,6180339…",
  but: "Ajoute des carrés de côtés 1, 1, 2, 3, 5, 8… (la spirale d'or apparaît) et observe la convergence des rapports, même avec d'autres valeurs de départ.",
  aRetenir: "Fₙ₊₂ = Fₙ₊₁ + Fₙ (1, 1, 2, 3, 5, 8, 13, 21…). Le rapport Fₙ₊₁/Fₙ oscille de part et d'autre de φ = (1 + √5)/2 ≈ 1,618034 et converge vers lui, quelles que soient les valeurs de départ positives : φ est la racine positive de x² = x + 1. Formule de Binet : Fₙ = (φⁿ − (−1/φ)ⁿ)/√5. Leonardo de Pise (Fibonacci) pose le problème des lapins dans le Liber Abaci (1202).",
  piege: "Les rapports ne s'approchent pas de manière monotone : ils alternent au-dessus et en dessous de φ. Et la spirale de quarts de cercle n'est qu'une approximation de la vraie spirale logarithmique d'or.",
  build: function(k, S){
    var c1 = k.canvas(0, {ratio: 0.62}), c2 = k.canvas(190);
    var nn = k.slider("Nombre de carrés n", 1, 14, 1, 9, "");
    var a0 = k.slider("Premier terme u₁ (graphique du bas)", 1, 20, 1, 1, "");
    var b0 = k.slider("Deuxième terme u₂", 1, 20, 1, 1, "");
    var ro = k.readouts(["Fₙ (n carrés)", "Fₙ₊₁ / Fₙ", "φ", "Écart à φ"]);
    var Fb = [0, 1, 1]; for (var i = 3; i < 40; i++) Fb.push(Fb[i - 1] + Fb[i - 2]);
    var phi = (1 + Math.sqrt(5)) / 2;
    k.draw(function(){
      var ctx = c1.ctx; c1.clear(); bgfill(c1, "#fbfaf6");
      var n = nn.value, sq = [], x0 = 0, y0 = 0, x1 = 1, y1 = 1; sq.push([0, 0, 1, 1, 1]);
      for (var i = 2; i <= n; i++){ var s = Fb[i], d = (i - 2) % 4, r;
        if (i === 2) r = [1, 0, 2, 1]; else if (d === 1) r = [x0, y1, x1, y1 + s]; else if (d === 2) r = [x0 - s, y0, x0, y1]; else if (d === 3) r = [x0, y0 - s, x1, y0]; else r = [x1, y0, x1 + s, y1];
        sq.push([r[0], r[1], r[2], r[3], s]); x0 = Math.min(x0, r[0]); y0 = Math.min(y0, r[1]); x1 = Math.max(x1, r[2]); y1 = Math.max(y1, r[3]);
      }
      var w = x1 - x0, h = y1 - y0, u = Math.min((c1.W - 30) / w, (c1.H - 24) / h), ox = (c1.W - w * u) / 2 - x0 * u, oy = (c1.H - h * u) / 2 - y0 * u;
      sq.forEach(function(q, i){
        ctx.fillStyle = hsl(210 - i * 17, 70, 90); ctx.fillRect(ox + q[0] * u, oy + q[1] * u, (q[2] - q[0]) * u, (q[3] - q[1]) * u);
        ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.3; ctx.strokeRect(ox + q[0] * u, oy + q[1] * u, (q[2] - q[0]) * u, (q[3] - q[1]) * u);
        if (q[4] * u > 14) txt(c1, String(q[4]), ox + (q[0] + q[2]) / 2 * u, oy + (q[1] + q[3]) / 2 * u, {color: "#334155", size: Math.min(26, 10 + q[4] * u / 8)});
      });
      var ex = 0, ey = 1, a = PI; ctx.strokeStyle = COL.red; ctx.lineWidth = 2.8; ctx.beginPath();
      for (i = 0; i < n; i++){ var sI = Fb[i + 1], cxs = ex - sI * Math.cos(a), cys = ey - sI * Math.sin(a);
        ctx.arc(ox + cxs * u, oy + cys * u, sI * u, a, a + PI / 2); ex = cxs + sI * Math.cos(a + PI / 2); ey = cys + sI * Math.sin(a + PI / 2); a += PI / 2; }
      ctx.stroke();
      // rapports
      ctx = c2.ctx; c2.clear(); var M = 14, ax = S.draw.axes(c2, {x0: 0, x1: M, y0: 0.8, y1: 2.2, xl: "n", yl: "uₙ₊₁ / uₙ", stepX: 2, stepY: 0.2, l: 54});
      var u1 = a0.value, u2 = b0.value, rs = []; for (i = 1; i <= M; i++){ rs.push(u2 / u1); var t = u1 + u2; u1 = u2; u2 = t; }
      S.draw.line(c2, ax.X(0), ax.Y(phi), ax.X(M), ax.Y(phi), COL.green, 1.8, [6, 4]); txt(c2, "φ ≈ 1,618034", ax.X(M) - 6, ax.Y(phi) - 10, {align: "right", color: COL.green, size: 12});
      ctx.strokeStyle = COL.blue; ctx.lineWidth = 1.6; ctx.beginPath(); rs.forEach(function(v, i){ i ? ctx.lineTo(ax.X(i + 1), ax.Y(v)) : ctx.moveTo(ax.X(i + 1), ax.Y(v)); }); ctx.stroke();
      rs.forEach(function(v, i){ S.draw.dot(c2, ax.X(i + 1), ax.Y(v), 4, COL.blue); });
      var nr = Math.min(M, n); ro.set(0, Fb[n] === undefined ? "—" : Fb[n]); ro.set(1, F(Fb[n + 1] / Fb[n], 6)); ro.set(2, F(phi, 6)); ro.set(3, F(Math.abs(Fb[n + 1] / Fb[n] - phi), 6));
    });
  }
});

/* 15 ---------------------------------------------------------------- e */
function capital(r, n){ return Math.exp(n * Math.log1p(r / n)); }
SFA.sim({
  id: "um-c11-e-interets", ch: "c11", tag: "Limites · analyse",
  titre: "Le nombre e : des intérêts composés au nombre d'Euler",
  resume: "Un capital de 1 € à 100 % par an : capitalise toutes les années, tous les mois, toutes les secondes. Il ne dépasse jamais 2,71828…",
  but: "Choisis la fréquence de capitalisation n et le taux : (1 + r/n)ⁿ monte, mais se bloque contre e^r.",
  aRetenir: "Si l'on partage l'année en n périodes, le capital final de 1 € vaut (1 + r/n)ⁿ. Quand n tend vers l'infini, il tend vers e^r (e = 2,718281828459…) : limite (1 + 1/n)ⁿ → e. La capitalisation continue donne C(t) = C₀·e^{rt}, solution de C′ = rC. Jacques Bernoulli rencontre cette limite en 1683 en étudiant les intérêts composés ; Euler lui donne la lettre e vers 1727-1736.",
  piege: "Capitaliser plus souvent rapporte plus, mais de moins en moins : de « tous les jours » à « chaque seconde », le gain est de quelques centimes par millier d'euros.",
  build: function(k, S){
    var c1 = k.canvas(180), c2 = k.canvas(240);
    var rr = k.slider("Taux annuel r", 0.1, 1, 0.05, 1, ""); 
    var nn = k.seg("Capitalisation", [[1, "annuelle"], [2, "semestrielle"], [4, "trimestrielle"], [12, "mensuelle"], [365, "journalière"], [8760, "horaire"], [31536000, "à la seconde"]], 12);
    var ro = k.readouts(["Capital de 1 000 € après 1 an", "e^r × 1 000 €", "Écart", "(1 + r/n)ⁿ"]);
    k.draw(function(){
      var r = rr.value, n = +nn.value, lo = 1 + r, hi = Math.exp(r), pad = (hi - lo) * 0.18;
      var hist = []; for (var i = 0; i <= 140; i++){ var m = Math.pow(10, 7 * i / 140); hist.push([m, capital(r, m)]); }
      convPlot(c1, hist, {target: hi, ylo: lo - pad, yhi: hi + pad, step: r >= 0.5 ? 0.25 : 0.05, tl: "e^r = " + F(hi, 5), color: COL.blue, xl: "nombre de capitalisations par an n"});
      var L = 52, Rr = 14, T = 14, B = 28, X = L + Math.log10(Math.max(1, n)) / 7 * (c1.W - L - Rr), Y = T + ((hi + pad) - capital(r, n)) / ((hi + pad) - (lo - pad)) * (c1.H - T - B);
      S.draw.dot(c1, X, Y, 6, COL.red);
      var ctx = c2.ctx; c2.clear(); var ax = S.draw.axes(c2, {x0: 0, x1: 5, y0: 1, y1: Math.exp(5 * r) * 1.04, xl: "années", yl: "capital (×1 €)", l: 54});
      S.draw.fn(c2, ax, function(t){ return Math.exp(r * t); }, COL.green, 2.4, [6, 4]);
      ctx.strokeStyle = COL.red; ctx.lineWidth = 2.4; ctx.beginPath();
      var pts = n <= 52 ? 5 * n : 400;
      if (n <= 52){ var pv = 1; ctx.moveTo(ax.X(0), ax.Y(1)); for (i = 1; i <= pts; i++){ var t0 = (i - 1) / n, t1 = i / n; ctx.lineTo(ax.X(t1), ax.Y(pv)); pv = Math.pow(1 + r / n, i); ctx.lineTo(ax.X(t1), ax.Y(pv)); } }
      else for (i = 0; i <= 400; i++){ var t = 5 * i / 400, v = Math.exp(n * t * Math.log1p(r / n)); i ? ctx.lineTo(ax.X(t), ax.Y(v)) : ctx.moveTo(ax.X(t), ax.Y(v)); }
      ctx.stroke();
      txt(c2, "vert : e^(rt), capitalisation continue", c2.W - 10, 14, {align: "right", color: COL.green, size: 12}); txt(c2, "rouge : (1 + r/n)^(n·t)", c2.W - 10, 32, {align: "right", color: COL.red, size: 12});
      var cap = capital(r, n) * 1000;
      ro.set(0, F(cap, 2) + " €"); ro.set(1, F(hi * 1000, 2) + " €"); ro.set(2, F(hi * 1000 - cap, 2) + " €"); ro.set(3, F(capital(r, n), 7));
    });
  }
});

/* 16 ---------------------------------------------------------------- brachistochrone */
function bcCurves(xb, yb){
  var R = (xb * xb + yb * yb) / (2 * xb), aB = Math.atan2(yb, xb - R);
  var lo = 1e-6, hi = TAU - 1e-6, ratio = xb / yb, th;
  for (var i = 0; i < 80; i++){ th = (lo + hi) / 2; var f = (th - Math.sin(th)) / (1 - Math.cos(th)); if (f < ratio) lo = th; else hi = th; }
  var thB = th, a = yb / (1 - Math.cos(thB));
  return {
    line: {nom: "droite", col: "#64748b", f: function(s){ return [xb * s, yb * s]; }},
    circle: {nom: "arc de cercle", col: "#0e7490", f: function(s){ var al = PI + (aB - PI) * s; return [R + R * Math.cos(al), R * Math.sin(al)]; }},
    parab: {nom: "parabole", col: "#5B21B6", f: function(s){ return [xb * s * s, yb * s]; }},
    cyc: {nom: "cycloïde", col: "#dc2626", f: function(s){ var t = thB * s; return [a * (t - Math.sin(t)), a * (1 - Math.cos(t))]; }},
    thB: thB, a: a
  };
}
function bcTable(cv, g){
  var M = 5000, pts = [], cum = [0], i, u;
  for (i = 0; i <= M; i++){ u = i / M; pts.push(cv.f(u * u)); }
  for (i = 1; i <= M; i++){ var ym = (pts[i][1] + pts[i - 1][1]) / 2, ds = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(cum[i - 1] + ds / Math.sqrt(2 * g * ym)); }
  return {pts: pts, cum: cum, T: cum[M]};
}
SFA.sim({
  id: "um-c11-brachistochrone", ch: "c11", tag: "Calcul des variations",
  titre: "La brachistochrone : la course des billes",
  resume: "Quelle courbe relie deux points en le moins de temps pour une bille qui glisse sans frottement ? Pas la droite : la cycloïde.",
  but: "Déplace le point d'arrivée B avec les curseurs et lâche quatre billes en même temps : droite, arc de cercle, parabole, cycloïde. Les temps affichés sont calculés par intégration.",
  aRetenir: "La bille descend en v = √(2gy) (conservation de l'énergie) ; le temps de parcours vaut T = ∫ ds / v. La droite est la plus courte mais pas la plus rapide : mieux vaut plonger vite pour prendre de la vitesse. La courbe optimale (brachistochrone) est un arc de cycloïde, tracé par un point d'un cercle qui roule : x = a(θ − sin θ), y = a(1 − cos θ), et T = θ_B √(a/g). Johann Bernoulli lance le défi en 1696 (« brachistos » = le plus court, « chronos » = le temps) ; Newton, Leibniz, l'Hospital et Jacques Bernoulli le résolvent : c'est la naissance du calcul des variations.",
  piege: "La cycloïde peut passer plus bas que B (quand x_B/y_B > π/2) avant de remonter : ce détour est justement ce qui la rend plus rapide.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.5}), g = 9.81;
    var xb = k.slider("Position horizontale de B", 0.5, 4, 0.05, 1.6, "m", function(){ rebuild(); });
    var yb = k.slider("Profondeur de B", 0.3, 2.5, 0.05, 1, "m", function(){ rebuild(); });
    var spd = k.seg("Vitesse de la vidéo", [[0.25, "ralenti ×4"], [0.5, "ralenti ×2"], [1, "temps réel"]], 0.5);
    var cur = null, tm = 0, order = [];
    function rebuild(){ var cs = bcCurves(xb.value, yb.value); cur = {}; ["line", "circle", "parab", "cyc"].forEach(function(n){ cur[n] = {c: cs[n], t: bcTable(cs[n], g)}; }); cur.thB = cs.thB; cur.a = cs.a; tm = 0; order = []; }
    var lp = k.loop(function(dt){ tm += dt * spd.value; var mx = Math.max(cur.line.t.T, cur.circle.t.T, cur.parab.t.T, cur.cyc.t.T); if (tm > mx + 1.2 / spd.value * spd.value) { tm = 0; } k.redraw(); });
    k.button("↺ Lâcher les billes", function(){ tm = 0; lp.play(); }, true);
    k.button("⏸", function(){ lp.running ? lp.pause() : lp.play(); });
    var ro = k.readouts(["Droite", "Arc de cercle", "Parabole", "Cycloïde", "Gain de la cycloïde sur la droite"]);
    rebuild();
    function at(t, T){ // position à l'instant t
      var cum = T.cum, lo = 0, hi = cum.length - 1; if (t >= T.T) return T.pts[hi];
      while (hi - lo > 1){ var m = (lo + hi) >> 1; if (cum[m] <= t) lo = m; else hi = m; }
      var u = (t - cum[lo]) / Math.max(1e-12, cum[hi] - cum[lo]); return [T.pts[lo][0] + (T.pts[hi][0] - T.pts[lo][0]) * u, T.pts[lo][1] + (T.pts[hi][1] - T.pts[lo][1]) * u];
    }
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgrad(c, "#f4f7fb", "#e9eef6");
      var names = ["line", "circle", "parab", "cyc"], X1 = xb.value, Y1 = yb.value, ymax = Y1, xmax = X1;
      names.forEach(function(n){ cur[n].t.pts.forEach(function(p, i){ if (i % 25 === 0){ ymax = Math.max(ymax, p[1]); xmax = Math.max(xmax, p[0]); } }); });
      var m = 38, u = Math.min((c.W - 2 * m) / xmax, (c.H - 2 * m) / ymax), ox = m + Math.max(0, (c.W - 2 * m - xmax * u) / 2), oy = m;
      function P(p){ return [ox + p[0] * u, oy + p[1] * u]; }
      // repère léger
      ctx.strokeStyle = "#d4dbe6"; ctx.lineWidth = 1; for (var gx = 0; gx <= xmax + 1e-9; gx += 0.5){ ctx.beginPath(); ctx.moveTo(ox + gx * u, oy); ctx.lineTo(ox + gx * u, oy + ymax * u); ctx.stroke(); } for (var gy = 0; gy <= ymax + 1e-9; gy += 0.5){ ctx.beginPath(); ctx.moveTo(ox, oy + gy * u); ctx.lineTo(ox + xmax * u, oy + gy * u); ctx.stroke(); }
      names.forEach(function(n){ var cv = cur[n].c; ctx.strokeStyle = cv.col; ctx.lineWidth = 2; ctx.globalAlpha = 0.55; ctx.beginPath(); for (var i = 0; i <= 200; i++){ var p = P(cv.f(i / 200)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.globalAlpha = 1; });
      var A = P([0, 0]), B = P([X1, Y1]); circ(ctx, A[0], A[1], 6, COL.ink); circ(ctx, B[0], B[1], 6, COL.ink); txt(c, "A", A[0] - 12, A[1] - 8, {color: COL.ink, size: 14}); txt(c, "B", B[0] + 12, B[1] - 8, {color: COL.ink, size: 14});
      names.forEach(function(n){ var T = cur[n].t, p = P(at(tm, T)), done = tm >= T.T;
        // traînée
        ctx.strokeStyle = cur[n].c.col; ctx.lineWidth = 3.4; ctx.beginPath(); var steps = 40; for (var i = 0; i <= steps; i++){ var q = P(at(Math.max(0, tm - 0.25 * (1 - i / steps)), T)); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
        circ(ctx, p[0], p[1], 8, cur[n].c.col, "#fff", 2);
        if (done){ txt(c, F(T.T, 3) + " s", p[0], p[1] - 16 - names.indexOf(n) * 15, {color: cur[n].c.col, size: 13, bg: "rgba(255,255,255,.85)"}); }
      });
      names.forEach(function(n, i){ ctx.fillStyle = cur[n].c.col; ctx.fillRect(c.W - 150, 12 + i * 20, 22, 4); txt(c, cur[n].c.nom, c.W - 122, 14 + i * 20, {align: "left", color: COL.ink, size: 12}); });
      ro.set(0, F(cur.line.t.T, 3) + " s"); ro.set(1, F(cur.circle.t.T, 3) + " s"); ro.set(2, F(cur.parab.t.T, 3) + " s"); ro.set(3, F(cur.cyc.t.T, 3) + " s");
      ro.set(4, F((1 - cur.cyc.t.T / cur.line.t.T) * 100, 1) + " %");
    });
    lp.play();
  }
});

/* 17 ---------------------------------------------------------------- Königsberg */
var KB = {
  nodes: {A: [0.40, 0.50, "A (île)"], B: [0.45, 0.12, "B (rive nord)"], C: [0.45, 0.88, "C (rive sud)"], D: [0.86, 0.5, "D (rive est)"]},
  variants: {
    orig: {nom: "Les 7 ponts de 1736", e: [["A", "B", -1], ["A", "B", 1], ["A", "C", -1], ["A", "C", 1], ["A", "D", 0], ["B", "D", 0], ["C", "D", 0]]},
    moins: {nom: "On détruit un pont A–B", e: [["A", "B", 0], ["A", "C", -1], ["A", "C", 1], ["A", "D", 0], ["B", "D", 0], ["C", "D", 0]]},
    plus: {nom: "On construit un pont B–C", e: [["A", "B", -1], ["A", "B", 1], ["A", "C", -1], ["A", "C", 1], ["A", "D", 0], ["B", "D", 0], ["C", "D", 0], ["B", "C", 9]]},
    plus2: {nom: "On construit B–C et un 2e pont A–D", e: [["A", "B", -1], ["A", "B", 1], ["A", "C", -1], ["A", "C", 1], ["A", "D", -1], ["A", "D", 1], ["B", "D", 0], ["C", "D", 0], ["B", "C", 9]]}
  }
};
function kbEuler(edges){
  var deg = {}, odd = []; edges.forEach(function(e){ deg[e[0]] = (deg[e[0]] || 0) + 1; deg[e[1]] = (deg[e[1]] || 0) + 1; });
  Object.keys(deg).forEach(function(v){ if (deg[v] % 2) odd.push(v); });
  if (odd.length !== 0 && odd.length !== 2) return null;
  var used = new Array(edges.length).fill(false), stack = [[odd.length ? odd[0] : "A", -1]], out = [];
  while (stack.length){ var top = stack[stack.length - 1], v = top[0], found = -1;
    for (var i = 0; i < edges.length; i++) if (!used[i] && (edges[i][0] === v || edges[i][1] === v)){ found = i; break; }
    if (found >= 0){ used[found] = true; stack.push([edges[found][0] === v ? edges[found][1] : edges[found][0], found]); } else { stack.pop(); if (top[1] >= 0) out.push(top[1]); } }
  out.reverse(); return out.length === edges.length ? {list: out, start: odd.length ? odd[0] : "A"} : null;
}
SFA.sim({
  id: "um-c11-konigsberg", ch: "c11", tag: "Théorie des graphes",
  titre: "Les sept ponts de Königsberg",
  resume: "Peut-on traverser chacun des sept ponts exactement une fois ? Euler (1736) démontre que non, et invente la théorie des graphes.",
  but: "Essaie de franchir chaque pont une seule fois en cliquant sur les ponts. Puis change la carte (détruis ou construis un pont) et regarde quand c'est possible.",
  aRetenir: "On résume la carte par un graphe : sommets = terres, arêtes = ponts. Un chemin qui emprunte chaque arête exactement une fois (chemin eulérien) existe si et seulement si le graphe est connexe et a 0 ou 2 sommets de degré impair. À Königsberg les quatre terres ont pour degrés 5, 3, 3, 3 : quatre sommets impairs, donc c'est impossible. Euler publie ce résultat en 1736 : acte de naissance de la théorie des graphes et de la topologie.",
  piege: "L'impossibilité ne dépend pas de ta persévérance ni de la longueur des ponts : seule la parité des degrés compte. Et avec 2 sommets impairs, il faut commencer sur l'un d'eux (et finir sur l'autre).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.72}), vkey = "orig", E = [], path = [], cur = null, msg, sol = null, solI = 0, tick = 0;
    var vs = k.select("Carte", [["orig", KB.variants.orig.nom], ["moins", KB.variants.moins.nom], ["plus", KB.variants.plus.nom], ["plus2", KB.variants.plus2.nom]], "orig", function(v){ vkey = v; reset(); });
    function reset(){ E = KB.variants[vkey].e; path = []; cur = null; sol = null; msg.set("Clique sur un pont pour commencer (le départ est la terre la plus proche de ton clic).", ""); }
    var lp = k.loop(function(dt){ if (sol){ tick += dt; if (tick > 0.7){ tick = 0; if (solI < sol.list.length){ var ei = sol.list[solI++]; var e = E[ei]; cur = cur === null ? sol.start : cur; path.push({i: ei, from: cur}); cur = e[0] === cur ? e[1] : e[0]; if (solI >= sol.list.length){ sol = null; status(); } k.redraw(); } } } });
    k.button("Annuler le dernier pont", function(){ if (path.length){ var l = path.pop(); cur = l.from; if (!path.length) cur = null; status(); } }, true);
    k.button("Tout recommencer", reset);
    k.button("Montrer une solution", function(){ reset(); var s = kbEuler(E.map(function(e){ return [e[0], e[1]]; })); if (!s){ msg.set("Aucune solution : il y a trop de terres de degré impair.", "bad"); return; } sol = s; solI = 0; tick = 0.7; lp.play(); });
    var ro = k.readouts(["Ponts franchis", "Ponts restants", "Terres de degré impair", "Chemin eulérien possible ?"]);
    msg = k.note("", "");
    function geom(e){ // bézier quadratique
      var a = KB.nodes[e[0]], b = KB.nodes[e[1]], ax = a[0] * c.W, ay = a[1] * c.H, bx = b[0] * c.W, by = b[1] * c.H, mx = (ax + bx) / 2, my = (ay + by) / 2, nx = -(by - ay), ny = bx - ax, nl = Math.hypot(nx, ny), off = e[2];
      if (off === 9){ return {ax: ax, ay: ay, bx: bx, by: by, cx: c.W * 0.06, cy: c.H * 0.5}; }
      var o = off * 0.07 * c.W; if (off === 0 && ((e[0] === "B" && e[1] === "D") || (e[0] === "C" && e[1] === "D"))) o = (e[0] === "B" ? 1 : -1) * 0.02 * c.W * 0 ;
      return {ax: ax, ay: ay, bx: bx, by: by, cx: mx + nx / nl * o * 1.6, cy: my + ny / nl * o * 1.6};
    }
    function bez(g, t){ var u = 1 - t; return [u * u * g.ax + 2 * u * t * g.cx + t * t * g.bx, u * u * g.ay + 2 * u * t * g.cy + t * t * g.by]; }
    function degs(){ var d = {A: 0, B: 0, C: 0, D: 0}; E.forEach(function(e){ d[e[0]]++; d[e[1]]++; }); return d; }
    function status(){
      var d = degs(), odd = Object.keys(d).filter(function(v){ return d[v] % 2; });
      var left = E.length - path.length;
      if (!left) msg.set("Bravo : tu as franchi chaque pont exactement une fois !", "ok");
      else if (cur !== null && !E.some(function(e, i){ return !path.some(function(p){ return p.i === i; }) && (e[0] === cur || e[1] === cur); })) msg.set("Bloqué en " + KB.nodes[cur][2] + " : il reste " + left + " pont" + (left > 1 ? "s" : "") + " mais plus aucun ne part d'ici. Annule ou recommence.", "bad");
      else msg.set(cur === null ? "Clique sur un pont pour commencer." : "Tu es en " + KB.nodes[cur][2] + ". Choisis un pont non encore franchi qui y arrive.", "");
    }
    c.pointer(function(type, p){
      if (type !== "down" || sol) return;
      var best = -1, bd = 22, bt = 0;
      E.forEach(function(e, i){ var g = geom(e); for (var t = 0; t <= 1; t += 0.02){ var q = bez(g, t), d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd){ bd = d; best = i; bt = t; } } });
      if (best < 0) return;
      if (path.some(function(q){ return q.i === best; })){ msg.set("Ce pont est déjà franchi.", "warn"); return; }
      var e = E[best];
      if (cur === null){ cur = bt < 0.5 ? e[0] : e[1]; }
      if (e[0] !== cur && e[1] !== cur){ msg.set("Ce pont n'arrive pas là où tu es (" + KB.nodes[cur][2] + ").", "warn"); k.redraw(); return; }
      path.push({i: best, from: cur}); cur = e[0] === cur ? e[1] : e[0]; status(); k.redraw();
    });
    reset();
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgfill(c, "#bfe0f2");
      // rivière (vagues)
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1.5; for (var y = 12; y < c.H; y += 22){ ctx.beginPath(); for (var x = 0; x <= c.W; x += 6){ var yy = y + Math.sin(x / 18 + y) * 2.2; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
      function land(n, rx, ry, col){ var a = KB.nodes[n]; ctx.fillStyle = col; ctx.strokeStyle = "#8a7a4e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(a[0] * c.W, a[1] * c.H, rx, ry, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
      land("A", c.W * 0.1, c.H * 0.14, "#d9cda3"); land("B", c.W * 0.4, c.H * 0.09, "#cfd8a8"); land("C", c.W * 0.4, c.H * 0.09, "#cfd8a8"); land("D", c.W * 0.12, c.H * 0.24, "#d3c6b0");
      var d = degs(), used = {}; path.forEach(function(p, j){ used[p.i] = j + 1; });
      E.forEach(function(e, i){
        var g = geom(e); ctx.lineCap = "round";
        ctx.strokeStyle = used[i] ? "#16a34a" : "#6b4f2a"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(g.ax, g.ay); ctx.quadraticCurveTo(g.cx, g.cy, g.bx, g.by); ctx.stroke();
        ctx.strokeStyle = used[i] ? "#86efac" : "#b08850"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(g.ax, g.ay); ctx.quadraticCurveTo(g.cx, g.cy, g.bx, g.by); ctx.stroke();
        if (used[i]){ var m = bez(g, 0.5); circ(ctx, m[0], m[1], 11, "#16a34a", "#fff", 2); txt(c, String(used[i]), m[0], m[1], {color: "#fff", size: 13}); }
      });
      Object.keys(KB.nodes).forEach(function(n){ var a = KB.nodes[n], x = a[0] * c.W, y = a[1] * c.H, odd = d[n] % 2;
        circ(ctx, x, y, 16, odd ? "#fee2e2" : "#dcfce7", odd ? COL.red : COL.green, 2.5); txt(c, String(d[n]), x, y, {color: odd ? COL.red : COL.green, size: 16});
        txt(c, n, x, y + 30, {color: COL.ink, size: 14}); });
      if (cur !== null){ var a = KB.nodes[cur]; circ(ctx, a[0] * c.W, a[1] * c.H - 28, 7, "#2563eb", "#fff", 2); }
      txt(c, "le nombre dans chaque terre = nombre de ponts qui y arrivent (degré) ; rouge = impair", c.W / 2, c.H - 8, {color: COL.ink, size: 12});
      var odds = Object.keys(d).filter(function(v){ return d[v] % 2; });
      ro.set(0, path.length); ro.set(1, E.length - path.length); ro.set(2, odds.length + (odds.length ? " (" + odds.join(", ") + ")" : "")); ro.set(3, odds.length === 0 ? "oui, et on revient au départ" : odds.length === 2 ? "oui, de " + odds[0] + " à " + odds[1] : "non");
    });
  }
});

/* 18 ---------------------------------------------------------------- Möbius */
SFA.sim({
  id: "um-c11-mobius", ch: "c11", tag: "Topologie · 3D",
  titre: "Le ruban de Möbius : une seule face, un seul bord",
  resume: "Une bande de papier recollée après un demi-tour n'a plus qu'une face et un bord : une fourmi la parcourt sans jamais traverser le papier.",
  but: "Fais tourner le ruban avec la souris. Change le nombre de demi-tours, lâche la fourmi, puis coupe le ruban au milieu et regarde ce qui arrive.",
  aRetenir: "Avec un nombre impair de demi-tours, le ruban n'a qu'une face et qu'un bord : il est non orientable. Avec un nombre pair, c'est un anneau ordinaire : deux faces, deux bords. Découpé en suivant la ligne médiane, un Möbius reste d'un seul morceau (un ruban deux fois plus long avec deux tours complets) ; un anneau pair donne deux morceaux séparés. Paramétrisation du ruban : x = (1 + v·cos(u/2))·cos u, y = (1 + v·cos(u/2))·sin u, z = v·sin(u/2). August Möbius et Johann Listing le décrivent indépendamment en 1858.",
  piege: "Dans le ruban, la fourmi est toujours « sur le dessus » : c'est la même et unique face qui revient en face d'elle-même après un tour. Un tour de ruban remet la fourmi à la même place mais de l'autre côté du papier.",
  build: function(k, S){
    var c = k.canvas(430), az = 0.6, el = 0.95, drag = null, uAnt = 0, laps = 0, trail = [];
    var kt = k.seg("Demi-tours du ruban", [[0, "0 (anneau)"], [1, "1 (Möbius)"], [2, "2 (tour complet)"], [3, "3"]], 1, function(){ uAnt = 0; laps = 0; trail = []; });
    var cut = k.toggle("Couper le long de la ligne médiane", false);
    var rot = k.toggle("Rotation automatique", true);
    var ant = k.toggle("Fourmi", true);
    c.pointer(function(type, p){ if (type === "down") drag = {x: p.x, y: p.y, az: az, el: el}; else if (type === "drag" && drag){ az = drag.az + (p.x - drag.x) * 0.01; el = Math.max(0.05, Math.min(1.5, drag.el + (p.y - drag.y) * 0.008)); k.redraw(); } else if (type === "up") drag = null; });
    var lp = k.loop(function(dt){ if (rot.value && !drag) az += dt * 0.35; uAnt += dt * 0.9; if (uAnt >= TAU){ uAnt -= TAU; laps++; } trail.push(uAnt + laps * TAU); if (trail.length > 28) trail.shift(); k.redraw(); });
    var ro = k.readouts(["Faces", "Bords", "Fourmi : tours effectués", "Après la découpe"]);
    function P(kk, u, v){ var a = kk * u / 2; return [(1 + v * Math.cos(a)) * Math.cos(u), (1 + v * Math.cos(a)) * Math.sin(u), v * Math.sin(a)]; }
    function N3(kk, u, v){ var e = 1e-4, p0 = P(kk, u, v), pu = P(kk, u + e, v), pv = P(kk, u, v + e), a = [pu[0] - p0[0], pu[1] - p0[1], pu[2] - p0[2]], b = [pv[0] - p0[0], pv[1] - p0[1], pv[2] - p0[2]], n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], l = Math.hypot(n[0], n[1], n[2]) || 1; return [n[0] / l, n[1] / l, n[2] / l]; }
    function cam(p){ var ca = Math.cos(az), sa = Math.sin(az), x = p[0] * ca - p[1] * sa, y = p[0] * sa + p[1] * ca, z = p[2], ce = Math.cos(el), se = Math.sin(el); return [x, y * ce - z * se, y * se + z * ce]; }
    k.draw(function(){
      var ctx = c.ctx; c.clear(); bgrad(c, "#0f1b2d", "#1b2b4a");
      var kk = +kt.value, odd = kk % 2 === 1, W = 0.45, g = 0.045, du = odd && cut.value ? 2 : 1, nu = 150 * du, nv = 6, quads = [], sc = Math.min(c.W, c.H) * 0.33, cx = c.W / 2, cy = c.H / 2;
      var bands = cut.value ? (odd ? [[g, W]] : [[g, W], [-W, -g]]) : [[-W, W]];
      bands.forEach(function(bd, bi){
        for (var i = 0; i < nu; i++) for (var j = 0; j < nv; j++){
          var u0 = i / nu * TAU * du, u1 = (i + 1) / nu * TAU * du, v0 = bd[0] + (bd[1] - bd[0]) * j / nv, v1 = bd[0] + (bd[1] - bd[0]) * (j + 1) / nv;
          var ps = [P(kk, u0, v0), P(kk, u1, v0), P(kk, u1, v1), P(kk, u0, v1)].map(cam);
          var um = (u0 + u1) / 2, vm = (v0 + v1) / 2, n = N3(kk, um, vm), nc = cam([n[0], n[1], n[2]]), nco = cam([0, 0, 0]);
          var nn = [nc[0] - nco[0], nc[1] - nco[1], nc[2] - nco[2]], dep = (ps[0][1] + ps[1][1] + ps[2][1] + ps[3][1]) / 4;
          quads.push({ps: ps, dep: dep, nn: nn, u: um, band: bi, st: i});
        }
      });
      var items = quads.map(function(q){ return {d: q.dep, q: q}; });
      var antItem = null;
      if (ant.value){ var ua = uAnt, ps0 = P(kk, ua, 0), nA = N3(kk, ua, 0), pa = cam([ps0[0] + nA[0] * 0.07, ps0[1] + nA[1] * 0.07, ps0[2] + nA[2] * 0.07]); antItem = {d: pa[1] - 0.01, a: pa}; items.push(antItem); }
      items.sort(function(a, b){ return b.d - a.d; });
      items.forEach(function(it){
        if (it.a){ var vis = true; circ(ctx, cx + it.a[0] * sc, cy - it.a[2] * sc, 7, "#ef4444", "#fff", 2); circ(ctx, cx + it.a[0] * sc + 3, cy - it.a[2] * sc - 2, 1.6, "#fff"); return; }
        var q = it.q, front = q.nn[1] < 0, lum = 0.4 + 0.5 * Math.abs(q.nn[1] * 0.7 + q.nn[2] * 0.5 + q.nn[0] * 0.2), stripe = (q.st >> 2) % 2 ? 0.92 : 1;
        var h = cut.value && !odd ? (q.band ? 190 : 20) : (front ? 30 : 195);
        ctx.fillStyle = hsl(h, 78, Math.min(72, lum * 62 * stripe + 8)); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 0.9;
        ctx.beginPath(); q.ps.forEach(function(p, i){ var X = cx + p[0] * sc, Y = cy - p[2] * sc; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); ctx.fill(); ctx.stroke();
      });
      // bords (en blanc)
      if (!cut.value) { [-W, W].forEach(function(vv){ ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.4; ctx.beginPath(); for (var i = 0; i <= 200; i++){ var u = i / 200 * TAU * (odd ? 2 : 1), p = cam(P(kk, u, vv)); i ? ctx.lineTo(cx + p[0] * sc, cy - p[2] * sc) : ctx.moveTo(cx + p[0] * sc, cy - p[2] * sc); } ctx.stroke(); }); }
      txt(c, "glisse la souris pour tourner", c.W / 2, c.H - 12, {color: "rgba(255,255,255,.65)", size: 12});
      ro.set(0, odd ? "1 seule" : "2"); ro.set(1, odd ? "1 seul" : "2"); ro.set(2, laps + " (" + (odd ? (laps % 2 ? "de l'autre côté du papier" : "côté d'origine") : "toujours du même côté") + ")");
      ro.set(3, cut.value ? (odd ? "1 morceau, 2 fois plus long" : "2 anneaux séparés") : "—");
    });
    lp.play();
  }
});

/* 19 ---------------------------------------------------------------- marche aléatoire */
SFA.sim({
  id: "um-c11-marche-aleatoire", ch: "c11", tag: "Probabilités · processus",
  titre: "La marche aléatoire : l'ivrogne et le √n",
  resume: "À chaque pas on part à gauche ou à droite au hasard : on s'éloigne en moyenne comme √n, et la foule dessine une cloche.",
  but: "Lance des centaines de marcheurs : suis les trajectoires, la bande ±√n et l'histogramme des positions. Passe en 2 dimensions pour voir l'étalement et le retour à l'origine.",
  aRetenir: "Après n pas de ±1 équiprobables, la position a pour moyenne 0 et pour variance n : l'écart typique est √n (et non n). L'histogramme est une loi binomiale qui tend vers la loi normale N(0 ; n). En 2 dimensions, ⟨r²⟩ = n exactement. Pólya (1921) : en dimension 1 et 2, on revient à l'origine avec probabilité 1 (« tous les chemins mènent à Rome »), en dimension 3 seulement avec la probabilité ≈ 0,34. Le nom « marche aléatoire » vient de Karl Pearson (1905) ; le lien avec le mouvement brownien est établi par Einstein (1905).",
  piege: "Une marche équilibrée n'est pas « ramenée » vers 0 : elle ne retourne vers l'origine que par hasard. La distance typique grandit, mais plus lentement que le nombre de pas (√n).",
  build: function(k, S){
    var c1 = k.canvas(260), c2 = k.canvas(190), NW = 1200, KEEP = 40, TMAX = 400;
    var mode = k.seg("Espace", [["1", "1 dimension"], ["2", "2 dimensions"]], "1", function(){ reset(); });
    var q = k.slider("Probabilité d'un pas vers la droite (1 dimension)", 0.3, 0.7, 0.01, 0.5, "", function(){ reset(); });
    var sp = k.seg("Cadence", [[4, "lente"], [15, "normale"], [60, "rapide"]], 15);
    var X, Y, hx, hy, t, back, ret, acc = 0, r2h;
    function reset(){ X = new Float32Array(NW); Y = new Float32Array(NW); hx = []; hy = []; for (var i = 0; i < KEEP; i++){ hx.push([0]); hy.push([0]); } t = 0; ret = new Uint8Array(NW); r2h = [0]; }
    function stepAll(){
      var two = mode.value === "2";
      for (var i = 0; i < NW; i++){
        if (two){ var r = rnd(4); if (r === 0) X[i]++; else if (r === 1) X[i]--; else if (r === 2) Y[i]++; else Y[i]--; if (X[i] === 0 && Y[i] === 0) ret[i] = 1; }
        else { X[i] += Math.random() < q.value ? 1 : -1; if (X[i] === 0) ret[i] = 1; }
        if (i < KEEP){ hx[i].push(X[i]); hy[i].push(Y[i]); }
      }
      t++; var s = 0; for (i = 0; i < NW; i++) s += X[i] * X[i] + (two ? Y[i] * Y[i] : 0); r2h.push(s / NW);
    }
    var lp = k.loop(function(dt){ acc += dt * sp.value; while (acc >= 1){ acc -= 1; if (t < TMAX) stepAll(); } k.redraw(); });
    k.button("▶ / ⏸", function(){ lp.running ? lp.pause() : lp.play(); }, true); k.button("Recommencer", reset);
    k.button("+ 50 pas", function(){ for (var i = 0; i < 50 && t < TMAX; i++) stepAll(); });
    var ro = k.readouts(["Pas n", "Moyenne observée", "Écart-type observé", "Théorie", "Ont déjà revisité l'origine"]);
    reset();
    k.draw(function(){
      var two = mode.value === "2", ctx = c1.ctx; c1.clear(); var tv = Math.max(60, t * 1.05), sg = two ? 1 : 2 * Math.sqrt(q.value * (1 - q.value));
      if (!two){
        var yR = Math.max(12, 3.2 * Math.sqrt(tv) * sg + Math.abs(2 * q.value - 1) * tv * 1.05);
        var ax = S.draw.axes(c1, {x0: 0, x1: tv, y0: -yR, y1: yR, xl: "n (pas)", yl: "position"});
        ctx.fillStyle = "rgba(30,63,143,.09)"; ctx.beginPath(); for (var i = 0; i <= 120; i++){ var tt = tv * i / 120; ctx.lineTo(ax.X(tt), ax.Y((2 * q.value - 1) * tt + sg * Math.sqrt(tt))); } for (i = 120; i >= 0; i--){ tt = tv * i / 120; ctx.lineTo(ax.X(tt), ax.Y((2 * q.value - 1) * tt - sg * Math.sqrt(tt))); } ctx.closePath(); ctx.fill();
        for (var w = KEEP - 1; w >= 0; w--){ ctx.strokeStyle = w === 0 ? COL.red : hsl(210 + w * 3, 55, 55, 0.35); ctx.lineWidth = w === 0 ? 2.4 : 1.1; ctx.beginPath(); hx[w].forEach(function(v, j){ j ? ctx.lineTo(ax.X(j), ax.Y(v)) : ctx.moveTo(ax.X(j), ax.Y(v)); }); ctx.stroke(); }
        S.draw.line(c1, ax.X(0), ax.Y(0), ax.X(tv), ax.Y((2 * q.value - 1) * tv), COL.green, 1.4, [5, 4]);
        txt(c1, "bande bleue : moyenne ± √(variance)", c1.W - 8, 12, {align: "right", color: COL.blue, size: 12});
      } else {
        var Rv = Math.max(8, 2.6 * Math.sqrt(Math.max(t, 1))), s = Math.min(c1.W, c1.H) / 2 / Rv * 0.95, cx = c1.W / 2, cy = c1.H / 2;
        ctx.strokeStyle = "#e3e7ed"; ctx.lineWidth = 1; [Rv / 2.6, Rv / 1.3, Rv].forEach(function(rr){ ctx.beginPath(); ctx.arc(cx, cy, rr * s, 0, TAU); ctx.stroke(); });
        for (i = KEEP; i < 400; i++) circ(ctx, cx + X[i] * s, cy + Y[i] * s, 1.8, "rgba(30,63,143,.45)");
        for (w = 1; w < 6; w++){ ctx.strokeStyle = hsl(200 + w * 30, 60, 50, 0.6); ctx.lineWidth = 1.2; ctx.beginPath(); hx[w].forEach(function(v, j){ j ? ctx.lineTo(cx + v * s, cy + hy[w][j] * s) : ctx.moveTo(cx + v * s, cy + hy[w][j] * s); }); ctx.stroke(); }
        ctx.strokeStyle = COL.red; ctx.lineWidth = 2.2; ctx.beginPath(); hx[0].forEach(function(v, j){ j ? ctx.lineTo(cx + v * s, cy + hy[0][j] * s) : ctx.moveTo(cx + v * s, cy + hy[0][j] * s); }); ctx.stroke();
        circ(ctx, cx + X[0] * s, cy + Y[0] * s, 5, COL.red, "#fff", 1.5); circ(ctx, cx, cy, 4, COL.ink);
        ctx.strokeStyle = COL.green; ctx.setLineDash([6, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, Math.sqrt(t) * s, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        txt(c1, "cercle vert : distance √n", c1.W - 8, 12, {align: "right", color: COL.green, size: 12});
      }
      ctx = c2.ctx; c2.clear();
      if (!two){
        var mu = (2 * q.value - 1) * t, va = 4 * q.value * (1 - q.value) * t, lo = Math.floor(mu - 4.2 * Math.sqrt(Math.max(va, 4)) - 3), hi = Math.ceil(mu + 4.2 * Math.sqrt(Math.max(va, 4)) + 3);
        var cnt = {}, mx = 1; for (i = 0; i < NW; i++){ cnt[X[i]] = (cnt[X[i]] || 0) + 1; mx = Math.max(mx, cnt[X[i]]); }
        var span = Math.max(20, hi - lo), ax2 = S.draw.axes(c2, {x0: -span / 2 + mu, x1: span / 2 + mu, y0: 0, y1: Math.max(mx, NW * 2 / Math.sqrt(TAU * Math.max(va, 1))) * 1.15, xl: "position", yl: "marcheurs", l: 50});
        for (var x in cnt){ var xv = +x; ctx.fillStyle = "rgba(30,63,143,.65)"; ctx.fillRect(ax2.X(xv - 1) + 0.5, ax2.Y(cnt[x]), Math.max(1, ax2.X(xv + 1) - ax2.X(xv - 1) - 1), ax2.Y(0) - ax2.Y(cnt[x])); }
        if (t > 0){ ctx.strokeStyle = COL.red; ctx.lineWidth = 2.2; ctx.beginPath(); for (i = 0; i <= 200; i++){ var xx = ax2.x0 + (ax2.x1 - ax2.x0) * i / 200, f = NW * 2 * Math.exp(-0.5 * Math.pow((xx - mu) / Math.sqrt(va), 2)) / Math.sqrt(TAU * va); i ? ctx.lineTo(ax2.X(xx), ax2.Y(f)) : ctx.moveTo(ax2.X(xx), ax2.Y(f)); } ctx.stroke(); }
        txt(c2, "rouge : loi normale N(" + F(mu, 1) + " ; " + F(va, 1) + ")", c2.W - 8, 12, {align: "right", color: COL.red, size: 12});
      } else {
        var ax3 = S.draw.axes(c2, {x0: 0, x1: TMAX, y0: 0, y1: TMAX * 1.05, xl: "n", yl: "⟨r²⟩", stepX: 50, stepY: 100, l: 50});
        S.draw.line(c2, ax3.X(0), ax3.Y(0), ax3.X(TMAX), ax3.Y(TMAX), COL.green, 1.8, [6, 4]); txt(c2, "théorie : ⟨r²⟩ = n", ax3.X(TMAX) - 6, ax3.Y(TMAX) + 16, {align: "right", color: COL.green, size: 12});
        ctx.strokeStyle = COL.red; ctx.lineWidth = 2.2; ctx.beginPath(); r2h.forEach(function(v, j){ j ? ctx.lineTo(ax3.X(j), ax3.Y(v)) : ctx.moveTo(ax3.X(j), ax3.Y(v)); }); ctx.stroke();
      }
      var m = 0, sq = 0, rc = 0; for (i = 0; i < NW; i++){ m += X[i]; sq += X[i] * X[i] + (two ? Y[i] * Y[i] : 0); rc += ret[i]; } m /= NW;
      ro.set(0, t); ro.set(1, two ? "(0 ; 0)" : F(m, 2)); ro.set(2, two ? "√⟨r²⟩ = " + F(Math.sqrt(sq / NW), 2) : F(Math.sqrt(Math.max(0, sq / NW - m * m)), 2)); ro.set(3, two ? "√n = " + F(Math.sqrt(t), 2) : "moy. " + F((2 * q.value - 1) * t, 2) + " ; σ " + F(Math.sqrt(4 * q.value * (1 - q.value) * t), 2)); ro.set(4, pct(rc / NW, 0));
    });
    lp.play();
  }
});

/* 20 ---------------------------------------------------------------- Taylor */
var TF = {
  sin: {nom: "sin x", f: Math.sin, coef: function(kk, a){ return Math.sin(a + kk * PI / 2); }, ok: true},
  cos: {nom: "cos x", f: Math.cos, coef: function(kk, a){ return Math.cos(a + kk * PI / 2); }, ok: true},
  exp: {nom: "eˣ", f: Math.exp, coef: function(kk, a){ return Math.exp(a); }, ok: true},
  ln: {nom: "ln(1 + x)", f: function(x){ return x > -1 ? Math.log(1 + x) : NaN; }, c0: function(kk){ return kk === 0 ? 0 : (kk % 2 ? 1 : -1) / kk; }, ok: false},
  rat: {nom: "1/(1 + x²)", f: function(x){ return 1 / (1 + x * x); }, c0: function(kk){ return kk % 2 ? 0 : (kk / 2 % 2 ? -1 : 1); }, ok: false}
};
function fact(n){ var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }
function taylorVal(fn, a, N, x){
  var s = 0, t = TF[fn], d = x - a, i;
  if (t.ok){ for (i = 0; i <= N; i++) s += t.coef(i, a) * Math.pow(d, i) / fact(i); }
  else { for (i = 0; i <= N; i++) s += t.c0(i) * Math.pow(x, i); }
  return s;
}
SFA.sim({
  id: "um-c11-taylor", ch: "c11", tag: "Analyse · approximation",
  titre: "Les polynômes de Taylor épousent la courbe de sin x",
  resume: "Un polynôme de degré N construit à partir des dérivées en un point colle de mieux en mieux à la fonction autour de ce point.",
  but: "Augmente le degré N : le polynôme (orange) colle à la courbe (bleu) sur un intervalle de plus en plus large. Change de fonction et de centre a, et teste la borne d'erreur.",
  aRetenir: "T_N(x) = Σ f⁽ᵏ⁾(a)(x − a)ᵏ/k! pour k de 0 à N. Pour sin en a = 0 : x − x³/6 + x⁵/120 − x⁷/5040 + … L'erreur vérifie |f(x) − T_N(x)| ≤ M·|x − a|^(N+1)/(N+1)! où M majore |f^(N+1)| (reste de Lagrange) : pour sin, cos et e^x, elle tend vers 0 pour tout x. Mais pour ln(1 + x) et 1/(1 + x²) la série diverge pour |x| > 1 : le rayon de convergence est 1, même si la fonction 1/(1 + x²) est parfaitement lisse sur ℝ. Brook Taylor (1715) ; Colin Maclaurin pour le cas a = 0.",
  piege: "Un polynôme de Taylor n'est bon que près du centre a, et sa qualité dépend de la fonction : augmenter le degré n'élargit pas toujours l'intervalle où l'approximation est bonne (rayon de convergence).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.55});
    var fn = k.select("Fonction", [["sin", "sin x"], ["cos", "cos x"], ["exp", "eˣ"], ["ln", "ln(1 + x)  (centre 0)"], ["rat", "1/(1 + x²)  (centre 0)"]], "sin");
    var N = k.slider("Degré N du polynôme", 0, 25, 1, 5, "");
    var a = k.slider("Centre a (sin, cos, exp)", -3.14, 3.14, 0.01, 0, "");
    var x0 = k.slider("Point d'essai x", -6, 6, 0.01, 2, "");
    var ro = k.readouts(["f(x)", "T_N(x)", "Erreur |f − T_N|", "Borne de Lagrange"]);
    var msg = k.note("", "");
    k.draw(function(){
      var ctx = c.ctx; c.clear(); var f = fn.value, T = TF[f], A = T.ok ? a.value : 0, n = N.value;
      var xr = f === "exp" ? [-6, 4] : f === "ln" ? [-1.5, 3] : f === "rat" ? [-3.5, 3.5] : [-7, 7];
      var yr = f === "exp" ? [-2, 25] : f === "ln" ? [-4, 3] : f === "rat" ? [-1.2, 1.6] : [-3, 3];
      var ax = S.draw.axes(c, {x0: xr[0], x1: xr[1], y0: yr[0], y1: yr[1], xl: "x", yl: "y"});
      // bande d'erreur
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.fillStyle = "rgba(180,35,24,.10)"; ctx.beginPath(); var first = true, i, xx;
      for (i = 0; i <= 300; i++){ xx = xr[0] + (xr[1] - xr[0]) * i / 300; var ff = T.f(xx), tt = taylorVal(f, A, n, xx); if (!isFinite(ff)) continue; first ? ctx.moveTo(ax.X(xx), ax.Y(ff)) : ctx.lineTo(ax.X(xx), ax.Y(ff)); first = false; }
      for (i = 300; i >= 0; i--){ xx = xr[0] + (xr[1] - xr[0]) * i / 300; ff = T.f(xx); tt = taylorVal(f, A, n, xx); if (!isFinite(ff)) continue; ctx.lineTo(ax.X(xx), ax.Y(tt)); }
      ctx.fill(); ctx.restore();
      S.draw.fn(c, ax, T.f, COL.blue, 3);
      S.draw.fn(c, ax, function(x){ return taylorVal(f, A, n, x); }, COL.orange, 2.6);
      if (T.ok) S.draw.dot(c, ax.X(A), ax.Y(T.f(A)), 6, COL.green);
      var xv = x0.value; if (f === "ln" && xv <= -1) xv = -0.99; var fv = T.f(xv), tv = taylorVal(f, A, n, xv);
      if (isFinite(fv)){ S.draw.line(c, ax.X(xv), ax.Y(fv), ax.X(xv), ax.Y(tv), COL.red, 2.2); S.draw.dot(c, ax.X(xv), ax.Y(fv), 5, COL.blue); S.draw.dot(c, ax.X(xv), ax.Y(tv), 5, COL.orange); }
      txt(c, "bleu : " + T.nom + "     orange : polynôme de degré " + n, ax.L + 8, ax.T + 10, {align: "left", color: COL.ink, size: 13, bg: "rgba(255,255,255,.8)"});
      var err = Math.abs(fv - tv), bound = null;
      if (f === "sin" || f === "cos") bound = Math.pow(Math.abs(xv - A), n + 1) / fact(n + 1);
      else if (f === "exp") bound = Math.exp(Math.max(A, xv)) * Math.pow(Math.abs(xv - A), n + 1) / fact(n + 1);
      ro.set(0, F(fv, 6)); ro.set(1, F(tv, 6)); ro.set(2, F(err, 8)); ro.set(3, bound === null ? "—" : F(bound, 8));
      if (f === "ln" || f === "rat") msg.set(Math.abs(xv) > 1 ? "Ici |x| > 1 : en dehors du rayon de convergence, plus N est grand, PIRE est l'approximation (la série diverge)." : "|x| < 1 : dans le rayon de convergence, l'erreur diminue quand N augmente.", Math.abs(xv) > 1 ? "bad" : "ok");
      else msg.set(bound !== null && err <= bound + 1e-12 ? "L'erreur réelle est bien inférieure à la borne de Lagrange." : "", "ok");
    });
  }
});

})();
