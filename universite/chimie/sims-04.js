/* Chimie BA1 · c04 · Liquides, solides et forces intermoléculaires — contenu SFA original */
(function(){
var R = 8.314, NA = 6.022e23, G = 9.81;
function rot(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}

/* ---------- 1. Forces intermoléculaires et températures d'ébullition ---------- */
var HYD = {
  "14":{nom:"Groupe 14 (CH₄ … SnH₄)", mol:["CH₄","SiH₄","GeH₄","SnH₄"], t:[-161.5,-111.9,-88.5,-52], hb:false},
  "15":{nom:"Groupe 15 (NH₃ … SbH₃)", mol:["NH₃","PH₃","AsH₃","SbH₃"], t:[-33.3,-87.7,-62.5,-17], hb:true},
  "16":{nom:"Groupe 16 (H₂O … H₂Te)", mol:["H₂O","H₂S","H₂Se","H₂Te"], t:[100,-60.3,-41.3,-2], hb:true},
  "17":{nom:"Groupe 17 (HF … HI)", mol:["HF","HCl","HBr","HI"], t:[19.5,-85,-66.4,-35.4], hb:true}
};
var BARS = {
  chaines:{titre:"Alcanes linéaires CₙH₂ₙ₊₂ : London ↑ avec la taille", items:[["CH₄",-161.5],["C₂H₆",-88.6],["C₃H₈",-42.1],["C₄H₁₀",-0.5],["C₅H₁₂",36.1],["C₆H₁₄",68.7],["C₇H₁₆",98.4],["C₈H₁₈",125.7]], note:"Chaque CH₂ ajoute de la surface de contact : les forces de London augmentent et T<sub>éb</sub> monte (de ≈ 70 K entre CH₄ et C₂H₆ à ≈ 27 K entre C₇ et C₈ : l'effet relatif de chaque CH₂ diminue)."},
  isomeres:{titre:"Isomères de C₅H₁₂ et C₆H₁₄ : forme et surface de contact", items:[["pentane",36.1],["2-méthylbutane",27.8],["2,2-diméthylpropane",9.5],["hexane",68.7],["3-méthylpentane",63.3],["2-méthylpentane",60.3],["2,3-diméthylbutane",58.0],["2,2-diméthylbutane",49.7]], note:"Même formule, même masse : la ramification rend la molécule plus compacte, la surface de contact diminue, les forces de London baissent et T<sub>éb</sub> chute."},
  memeM:{titre:"Masses voisines (≈ 58–60 g/mol), forces différentes", items:[["butane (London)",-0.5],["propanone (dipôle–dipôle)",56],["propan-1-ol (liaison H)",97],["acide éthanoïque (liaisons H, dimère)",118]], note:"À masse comparable, l'ordre est fixé par la nature des forces : London &lt; dipôle–dipôle &lt; liaison hydrogène (un acide carboxylique forme des dimères stables)."}
};
SFA.sim({
  id:"uc-c04-forces-ebullition", ch:"c04", tag:"Forces",
  titre:"Forces intermoléculaires et température d'ébullition",
  resume:"Hydrures du groupe 14 à 17, chaînes alcanes, isomères, masses voisines : la température d'ébullition révèle la force des interactions.",
  but:"Choisis une série. Pour les hydrures, observe l'écart entre le premier hydrure et la tendance linéaire des suivants : il mesure l'effet de la liaison hydrogène (NH₃, H₂O, HF).",
  aRetenir:"London (toutes les molécules, croît avec la taille et la surface de contact) &lt; dipôle–dipôle &lt; liaison hydrogène (X–H···Y avec X, Y = F, O, N). Dans un groupe sans liaison hydrogène, T<sub>éb</sub> croît avec M ; NH₃, H₂O et HF sortent de la série à cause des liaisons H.",
  piege:"H₂O bout à 100 °C alors que la tendance des hydrures suivants prévoit ≈ −90 °C, mais HF (19,5 °C) est plus bas que H₂O bien que sa liaison H soit plus forte : il n'a que 2 liaisons H par molécule (contre 4 pour H₂O, 2 donneurs et 2 accepteurs). Le nombre de liaisons H compte autant que leur force.",
  build:function(k, S){
    var c = k.canvas(360);
    var md = k.seg("Série", [["hyd","Hydrures"],["chaines","Chaînes"],["isomeres","Isomères"],["memeM","Même M"]], "hyd");
    var gp = k.seg("Groupe (hydrures)", [["14","14"],["15","15"],["16","16"],["17","17"]], "16");
    var ex = k.toggle("Tendance extrapolée sans liaison H (périodes 3–5)", true);
    var ro = k.readouts(["T<sub>éb</sub> du 1<sup>er</sup> hydrure", "Tendance extrapolée", "Excès (liaisons H)"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H;
      c.clear();
      if (md.value === "hyd"){
        var ax = S.draw.axes(c, {x0:1.6, x1:5.4, y0:-180, y1:120, xl:"période", yl:"T éb (°C)", stepX:1, stepY:50, t:30, l:50});
        var cols = {"14":P.green, "15":P.acc, "16":P.red, "17":P.amber};
        Object.keys(HYD).forEach(function(g){
          var h = HYD[g], on = g === gp.value;
          ctx.save(); ctx.strokeStyle = cols[g]; ctx.globalAlpha = on ? 1 : 0.28; ctx.lineWidth = on ? 3 : 1.5; ctx.beginPath();
          h.t.forEach(function(t, i){ var x = ax.X(2 + i), y = ax.Y(t); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
          h.t.forEach(function(t, i){ ctx.globalAlpha = on ? 1 : 0.3; S.draw.dot(c, ax.X(2 + i), ax.Y(t), on ? 6 : 3.5, cols[g]); ctx.globalAlpha = 1; if (on) S.draw.label(c, h.mol[i], ax.X(2 + i) + (i === 0 ? 24 : 0), ax.Y(t) + (i === 0 ? 4 : (i === 3 ? 18 : -15)), {size:11.5, color:cols[g], math:true}); });
        });
        var h = HYD[gp.value], x = [3, 4, 5], y = h.t.slice(1), mx = 4, my = (y[0] + y[1] + y[2]) / 3;
        var sl = ((x[0] - mx) * (y[0] - my) + (x[1] - mx) * (y[1] - my) + (x[2] - mx) * (y[2] - my)) / 2, ex2 = my + sl * (2 - mx);
        if (ex.value){ S.draw.line(c, ax.X(2), ax.Y(ex2), ax.X(5), ax.Y(my + sl * 1), P.grey, 1.8, [6,4]); S.draw.dot(c, ax.X(2), ax.Y(ex2), 5, "#fff"); c.ctx.strokeStyle = P.grey; c.ctx.beginPath(); c.ctx.arc(ax.X(2), ax.Y(ex2), 5, 0, 7); c.ctx.stroke(); }
        ro.set(0, S.fmt(h.t[0], 1) + " °C"); ro.set(1, S.fmt(ex2, 0) + " °C"); ro.set(2, S.fmt(h.t[0] - ex2, 0) + " K");
        nt.set(h.hb ? ("Le premier hydrure bout " + S.fmt(h.t[0] - ex2, 0) + " K au-dessus de la tendance des suivants : liaison hydrogène entre molécules. " + (gp.value === "15" ? "NH₃ : une seule paire libre, un seul doublet pour 3 H : peu de liaisons H par molécule." : gp.value === "17" ? "HF : forte liaison H mais chaînes de molécules seulement." : "H₂O : 2 donneurs et 2 accepteurs, réseau tridimensionnel, excès maximal.")) : "CH₄ n'a pas de liaison H : la tendance extrapolée prédit correctement sa T<sub>éb</sub> (écart " + S.fmt(Math.abs(h.t[0] - ex2), 0) + " K).", h.hb ? "warn" : "ok");
      } else {
        var B = BARS[md.value], n = B.items.length, left = Math.min(200, W * 0.38), top = 30, bh = Math.min(26, (H - top - 10) / n - 6), tmin = -180, tmax = 140;
        S.draw.text(c, B.titre, W / 2, 14, {size:12, color:P.ink});
        var mn = 1e9, mx2 = -1e9;
        B.items.forEach(function(it, i){
          var y = top + i * (bh + 6) + bh / 2, w = (it[1] - tmin) / (tmax - tmin) * (W - left - 70);
          S.draw.text(c, it[0], left - 8, y, {size:11, align:"right"});
          ctx.fillStyle = it[1] < 0 ? "#9fb0c8" : "#e9a3a3"; ctx.fillRect(left, y - bh / 2, Math.max(2, w), bh);
          S.draw.text(c, S.fmt(it[1], 1) + " °C", left + Math.max(2, w) + 6, y, {size:11, align:"left", color:P.ink});
          mn = Math.min(mn, it[1]); mx2 = Math.max(mx2, it[1]);
        });
        ro.set(0, "—"); ro.set(1, "—"); ro.set(2, S.fmt(mx2 - mn, 0) + " K entre extrêmes");
        nt.set(B.note, "ok");
      }
    });
  }
});

/* ---------- 2. Mailles cristallines ---------- */
var MAILLE = {
  cs:{nom:"cubique simple", Z:1, N:6, comp:Math.PI / 6, a:function(r){ return 2 * r; }, pts:[[0,0,0]]},
  cc:{nom:"cubique centrée", Z:2, N:8, comp:Math.PI * Math.sqrt(3) / 8, a:function(r){ return 4 * r / Math.sqrt(3); }, pts:[[0,0,0],[.5,.5,.5]]},
  cfc:{nom:"cubique à faces centrées", Z:4, N:12, comp:Math.PI * Math.sqrt(2) / 6, a:function(r){ return 2 * Math.sqrt(2) * r; }, pts:[[0,0,0],[.5,.5,0],[.5,0,.5],[0,.5,.5]]}
};
var MET = [["Po","polonium (cs)","cs",168,209],["Na","sodium (cc)","cc",186,22.99],["Fe","fer α (cc)","cc",124,55.845],["Al","aluminium (cfc)","cfc",143,26.98],["Cu","cuivre (cfc)","cfc",128,63.546],["Au","or (cfc)","cfc",144,196.97]];
SFA.sim({
  id:"uc-c04-mailles-cubiques", ch:"c04", tag:"Solides",
  titre:"Mailles cubiques : atomes par maille, compacité et masse volumique",
  resume:"Cubique simple, centrée ou à faces centrées : compte les atomes par maille, calcule la compacité et la masse volumique à partir du rayon.",
  but:"Choisis une maille (ou un métal) et ajuste le rayon atomique et la masse molaire. Glisse pour tourner la maille, réduis les atomes pour voir le réseau, et repère la ligne rouge où les atomes se touchent : elle donne la relation entre a et r.",
  aRetenir:"Z = 1 (cs), 2 (cc), 4 (cfc). Contacts selon : arête (cs, a = 2r), grande diagonale (cc, a = 4r/√3), diagonale de face (cfc, a = 2√2·r). Compacité = Z·(4/3)πr³/a³ : 52,4 % (cs), 68,0 % (cc), 74,0 % (cfc). ρ = Z·M/(N<sub>A</sub>·a³).",
  piege:"Un atome de sommet appartient à 8 mailles (1/8), un atome de face à 2 (1/2). Convertis les pm en cm avant de calculer ρ : 1 pm = 10⁻¹⁰ cm. Le modèle des sphères dures donne des rayons « effectifs » : le calcul de ρ à partir du rayon peut s'écarter de quelques % de la valeur mesurée.",
  build:function(k, S){
    var c = k.canvas(430);
    var st = {a:0.6, b:0.4};
    var tp = k.seg("Maille", [["cs","simple"],["cc","centrée"],["cfc","faces centrées"]], "cfc");
    var rr, mm;
    var ps = k.select("Préréglage métal", MET.map(function(m){ return [m[0], m[0] + " — " + m[1]]; }), "Cu", function(v){
      var m = MET.filter(function(x){ return x[0] === v; })[0]; tp.set(m[2]); rr.set(m[3]); mm.set(m[4]);
    });
    rr = k.slider("Rayon atomique r", 100, 250, 1, 128, "pm");
    mm = k.slider("Masse molaire M", 6, 210, 0.5, 63.5, "g/mol");
    var fz = k.slider("Taille des atomes affichés", 0.25, 1, 0.05, 0.55, "× r");
    var tc = k.toggle("Montrer la ligne de contact (a en fonction de r)", true);
    var ro = k.readouts(["Atomes par maille Z", "Coordinence", "Arête a", "Compacité", "Masse volumique"]);
    var nt = k.note("", "ok");
    UC.view(k, c, st, true);
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, M = MAILLE[tp.value], r = rr.value, a = M.a(r), ph = W < 420;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var sc = Math.min(W * 0.4, H * 0.36), cx = W / 2, cy = H * 0.5 - 6;
      UC.floor(c, cx, cy + sc * 0.95, sc * 0.9, sc * 0.16);
      var corners = []; for (var i = 0; i < 8; i++) corners.push([(i & 1) - 0.5, ((i >> 1) & 1) - 0.5, ((i >> 2) & 1) - 0.5]);
      var edges = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
      var cp = corners.map(function(q){ return UC.proj(q, st, sc, cx, cy); });
      /* arêtes de la maille : celles du fond plus pâles */
      edges.forEach(function(e){ var z = (cp[e[0]].z + cp[e[1]].z) / 2; ctx.save(); ctx.globalAlpha = z < 0 ? 0.4 : 0.9; S.draw.line(c, cp[e[0]].x, cp[e[0]].y, cp[e[1]].x, cp[e[1]].y, "#64748b", z < 0 ? 1.3 : 2); ctx.restore(); });
      var atoms = [];
      corners.forEach(function(q){ atoms.push({p:q, col:UC.COL.A, k:"s"}); });
      if (tp.value === "cc") atoms.push({p:[0,0,0], col:"#d6392f", k:"c"});
      if (tp.value === "cfc") [[0,0,.5],[0,0,-.5],[0,.5,0],[0,-.5,0],[.5,0,0],[-.5,0,0]].forEach(function(q){ atoms.push({p:q, col:"#e08a2a", k:"f"}); });
      atoms.forEach(function(at){ at.pp = UC.proj(at.p, st, sc, cx, cy); });
      var rad = (r / a) * sc * fz.value;
      /* ligne de contact (derrière ou devant selon la profondeur : tracée avant les atomes du devant) */
      var contact = null;
      if (tc.value){
        var A0 = corners[0], A1 = tp.value === "cs" ? corners[1] : tp.value === "cc" ? corners[7] : corners[3];
        contact = {p:UC.proj(A0, st, sc, cx, cy), q:UC.proj(A1, st, sc, cx, cy), lab:tp.value === "cs" ? "a = 2r" : tp.value === "cc" ? "a√3 = 4r" : "a√2 = 4r"};
      }
      atoms.sort(function(p, q){ return p.pp.z - q.pp.z; });
      var cDone = false;
      atoms.forEach(function(at){
        if (contact && !cDone && at.pp.z > 0){ cDone = true; ctx.save(); ctx.globalAlpha = 0.95; S.draw.line(c, contact.p.x, contact.p.y, contact.q.x, contact.q.y, P.red, 3.4); ctx.restore(); }
        UC.ball(ctx, at.pp.x, at.pp.y, rad * at.pp.s, at.col, fz.value < 0.9 ? 1 : 0.88);
      });
      if (contact){ if (!cDone) S.draw.line(c, contact.p.x, contact.p.y, contact.q.x, contact.q.y, P.red, 3.4);
        S.draw.label(c, contact.lab, (contact.p.x + contact.q.x) / 2, (contact.p.y + contact.q.y) / 2 - 14, {color:P.red, size:12, fill:"#fff"}); }
      /* légende : comptage */
      var rows = tp.value === "cs" ? [["#1f4b9e", "8 sommets × 1/8 = 1"]] : tp.value === "cc" ? [["#1f4b9e", "8 sommets × 1/8 = 1"], ["#d6392f", "1 centre × 1 = 1"]] : [["#1f4b9e", "8 sommets × 1/8 = 1"], ["#e08a2a", "6 faces × 1/2 = 3"]];
      var lh = 19, bw = ph ? 168 : 190, bh = rows.length * lh + 34;
      S.draw.panel(c, 10, 10, bw, bh, {title:"Atomes par maille", shadow:false});
      rows.forEach(function(rw, i){ UC.ball(ctx, 24, 36 + i * lh, 6, rw[0]); S.draw.text(c, rw[1], 36, 36 + i * lh, {size:11.5, align:"left", weight:600, color:P.ink}); });
      S.draw.text(c, "Z = " + M.Z, 24, 36 + rows.length * lh - 2, {size:12.5, align:"left", color:P.mat, weight:800});
      S.draw.text(c, "glisse pour tourner", W - 10, H - 12, {size:10.5, color:P.grey, align:"right", weight:600});
      var rho = M.Z * mm.value / (NA * Math.pow(a * 1e-10, 3));
      ro.set(0, String(M.Z)); ro.set(1, String(M.N)); ro.set(2, S.fmt(a, 1) + " pm"); ro.set(3, S.fmt(M.comp * 100, 1) + " %"); ro.set(4, S.fmt(rho, 2) + " g/cm³");
      nt.set("a = " + S.fmt(a, 1) + " pm = " + S.sci(a * 1e-10, 3) + " cm ; ρ = Z·M/(N<sub>A</sub>·a³) = " + M.Z + " × " + S.fmt(mm.value, 1) + " / (6,022·10²³ × (" + S.sci(a * 1e-10, 3) + ")³) = " + S.fmt(rho, 2) + " g/cm³. Compacité indépendante de r : " + S.fmt(M.comp * 100, 1) + " %.", "ok");
    });
  }
});

/* ---------- 3. Pression de vapeur : Clausius–Clapeyron ---------- */
var LIQ = [["h2o","eau",40.65,373.15],["etoh","éthanol",38.6,351.45],["meoh","méthanol",35.2,337.7],["ace","propanone",29.1,329.2],["eth","éther diéthylique",26.5,307.7],["benz","benzène",30.8,353.2]];
SFA.sim({
  id:"uc-c04-clausius-clapeyron", ch:"c04", tag:"Liquides",
  titre:"Pression de vapeur, ébullition et équation de Clausius–Clapeyron",
  resume:"ln P = −ΔH<sub>vap</sub>/(RT) + C : trouve la température d'ébullition à n'importe quelle pression (altitude, autocuiseur).",
  but:"Choisis un liquide, une température et une pression extérieure. Compare la pression de vapeur à la pression extérieure : le liquide bout quand elles sont égales. Passe en représentation ln P en fonction de 1/T pour voir une droite de pente −ΔH<sub>vap</sub>/R.",
  aRetenir:"ln(P₂/P₁) = −(ΔH<sub>vap</sub>/R)(1/T₂ − 1/T₁). Un liquide bout quand P<sub>vap</sub> = P<sub>ext</sub> : à pression réduite il bout plus bas (en altitude), à pression élevée plus haut (autocuiseur, autoclave). Plus ΔH<sub>vap</sub> est grand, plus la pente de ln P(1/T) est forte.",
  piege:"T en kelvins dans la formule. ΔH<sub>vap</sub> est supposée constante, valeur donnée à la température d'ébullition normale : loin de ce point, l'écart peut atteindre 10–20 % (par exemple l'eau à 25 °C : 3,8 kPa calculés contre 3,17 kPa mesurés).",
  build:function(k, S){
    var c = k.canvas(360);
    var ls = k.select("Liquide", LIQ.map(function(l){ return [l[0], l[1] + " (ΔH = " + S.fmt(l[2], 1) + " kJ/mol, T<sub>éb</sub> = " + S.fmt(l[3] - 273.15, 1) + " °C)"]; }), "h2o");
    var md = k.seg("Représentation", [["pt","P(T)"],["ln","ln P (1/T)"]], "pt");
    var tt = k.slider("Température T", 0, 150, 1, 60, "°C");
    var pp = k.slider("Pression extérieure", 10, 400, 1, 101, "kPa");
    var ro = k.readouts(["P<sub>vap</sub> à T", "T d'ébullition à P<sub>ext</sub>", "État à T", "Pente −ΔH/R"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, L = LIQ.filter(function(x){ return x[0] === ls.value; })[0], dH = L[2] * 1000, T0 = L[3];
      function Pv(T){ return 101.325 * Math.exp(-dH / R * (1 / T - 1 / T0)); }
      var T = tt.value + 273.15, Pe = pp.value, pv = Pv(T), Tb = 1 / (1 / T0 - R * Math.log(Pe / 101.325) / dH);
      c.clear();
      if (md.value === "pt"){
        var ax = S.draw.axes(c, {x0:0, x1:150, y0:0, y1:400, xl:"T (°C)", yl:"P (kPa)", stepX:25, stepY:100});
        S.draw.fn(c, ax, function(x){ return Pv(x + 273.15); }, P.acc, 2.8);
        S.draw.line(c, ax.L, ax.Y(Pe), ax.R, ax.Y(Pe), P.red, 1.5, [5,4]);
        S.draw.text(c, "P ext", ax.R - 6, ax.Y(Pe) - 10, {size:11, color:P.red, align:"right"});
        S.draw.dot(c, ax.X(tt.value), ax.Y(Math.min(pv, 400)), 6, P.acc);
        if (Tb - 273.15 >= 0 && Tb - 273.15 <= 150){ S.draw.dot(c, ax.X(Tb - 273.15), ax.Y(Pe), 7, P.red); S.draw.text(c, S.fmt(Tb - 273.15, 1) + " °C", ax.X(Tb - 273.15), ax.Y(Pe) - 16, {size:12, color:P.red}); }
      } else {
        var xs0 = 1 / 423.15, xs1 = 1 / 273.15, ax2 = S.draw.axes(c, {x0:xs0 * 1000, x1:xs1 * 1000, y0:-1, y1:6, xl:"1000/T (K⁻¹)", yl:"ln(P / kPa)", stepX:0.25, stepY:1});
        S.draw.fn(c, ax2, function(x){ return Math.log(Pv(1000 / x)); }, P.acc, 2.8);
        S.draw.dot(c, ax2.X(1000 / T), ax2.Y(Math.log(Math.max(pv, 1e-6))), 6, P.acc);
        S.draw.line(c, ax2.L, ax2.Y(Math.log(Pe)), ax2.R, ax2.Y(Math.log(Pe)), P.red, 1.5, [5,4]);
        S.draw.text(c, "pente = −ΔH/R = −" + S.fmt(dH / R, 0) + " K (soit −" + S.fmt(dH / R / 1000, 3) + " par unité de 1000/T)", ax2.R - 4, ax2.T + 14, {size:11, color:P.grey, align:"right"});
      }
      var gas = pv >= Pe;
      ro.set(0, S.fmt(pv, pv < 10 ? 2 : 1) + " kPa"); ro.set(1, S.fmt(Tb - 273.15, 1) + " °C"); ro.set(2, gas ? "ébullition (vapeur)" : "liquide"); ro.set(3, S.fmt(-dH / R, 0) + " K");
      nt.set("À " + tt.value + " °C : P<sub>vap</sub> = 101,325·exp[−(" + S.fmt(L[2], 1) + "·10³/8,314)(1/" + S.fmt(T, 1) + " − 1/" + S.fmt(T0, 1) + ")] = " + S.fmt(pv, 2) + " kPa. " + (gas ? "P<sub>vap</sub> ≥ P<sub>ext</sub> : le liquide bout à cette température." : "P<sub>vap</sub> &lt; P<sub>ext</sub> : le liquide ne bout pas ; il s'évapore seulement en surface.") + (Math.abs(T - T0) > 50 ? " Loin de T<sub>éb</sub>, ΔH<sub>vap</sub> varie : résultat approché." : ""), Math.abs(T - T0) > 50 ? "warn" : "ok");
    });
  }
});

/* ---------- 4. Tension superficielle : Jurin et Laplace ---------- */
var SURF = [["eau","eau (25 °C)",0.0720,997,0],["etoh","éthanol",0.0223,789,0],["hg","mercure",0.485,13534,140],["surf","eau + surfactant",0.025,998,0]];
SFA.sim({
  id:"uc-c04-tension-superficielle", ch:"c04", tag:"Liquides",
  titre:"Tension superficielle : capillarité et alvéole pulmonaire",
  resume:"Un liquide monte dans un tube fin (loi de Jurin) ; dans les poumons, ΔP = 2γ/r explique pourquoi le surfactant évite l'effondrement des petits alvéoles.",
  but:"Mode capillarité : change le liquide et le rayon du tube, la colonne monte ou descend. Mode alvéole : règle γ et les rayons de deux alvéoles reliés, puis laisse-les échanger de l'air.",
  aRetenir:"Loi de Jurin : h = 2γ·cos θ/(ρ·g·r) : plus le tube est fin, plus le liquide monte ; si θ > 90° (mercure), il descend. Laplace pour une bulle à une surface (alvéole) : ΔP = 2γ/r : le plus petit alvéole est à la plus haute pression et se vide dans le grand, sauf si le surfactant abaisse γ.",
  piege:"Ne confonds pas tension superficielle (N/m = J/m²) et pression : ΔP = 2γ/r ne vaut que pour une interface. Une bulle de savon a deux faces : ΔP = 4γ/r. La loi de Jurin suppose un tube étroit (r ≪ longueur capillaire).",
  build:function(k, S){
    var c = k.canvas(440);
    var md = k.seg("Mode", [["cap","Capillarité"],["alv","Alvéole"]], "cap");
    var ls = k.select("Liquide (capillarité)", SURF.map(function(s){ return [s[0], s[1] + " (γ = " + S.fmt(s[2] * 1000, 1) + " mN/m)"]; }), "eau");
    var rr = k.slider("Rayon du tube", 0.05, 3, 0.05, 0.5, "mm");
    var ra = k.slider("Rayon de l'alvéole", 20, 300, 5, 100, "µm");
    var ga = k.slider("Tension superficielle γ de l'alvéole", 5, 72, 1, 50, "mN/m");
    var rb = k.slider("Rayon d'un 2ᵉ alvéole relié", 20, 300, 5, 150, "µm");
    var fl = k.toggle("Laisser les alvéoles échanger de l'air", false);
    var ro = k.readouts(["Résultat 1", "Résultat 2", "Résultat 3"]);
    var nt = k.note("", "ok");
    var anim = {h:null}, dots = [], tt = 0;
    var capCtl = [ls, rr], alvCtl = [ra, ga, rb, fl];
    var lp = k.loop(function(dt, t){
      tt = t;
      if (md.value === "alv" && fl.value){
        var A = ra.value, B = rb.value, Pa = 1 / A, Pb = 1 / B;
        if (Math.abs(A - B) > 0.5){
          var V1 = A * A * A, V2 = B * B * B, dV = (Pa - Pb) * 2.2e6 * dt, n1 = Math.max(20, Math.min(300, Math.cbrt(Math.max(V1 - dV, 1)))), n2 = Math.max(20, Math.min(300, Math.cbrt(Math.max(V2 + dV, 1))));
          ra.set(n1); rb.set(n2);
        }
      }
      var tg = anim.tg; if (tg != null && anim.h != null) anim.h += (tg - anim.h) * Math.min(1, dt * 5);
      k.redraw();
    }); lp.play();
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, ph = W < 420;
      capCtl.forEach(function(q){ q.el.parentNode.style.display = md.value === "cap" ? "" : "none"; });
      alvCtl.forEach(function(q){ var e = q.el || null; if (e) e.parentNode.style.display = md.value === "alv" ? "" : "none"; });
      UC.bg(c, "#f6f9fc", "#ffffff");
      if (md.value === "cap"){
        var s = SURF.filter(function(x){ return x[0] === ls.value; })[0], r = rr.value / 1000, cs = Math.cos(s[4] * Math.PI / 180);
        var h = 2 * s[2] * cs / (s[3] * G * r), hmm = h * 1000;
        anim.tg = hmm; if (anim.h == null) anim.h = hmm;
        var ha = anim.h, base = H - 70, topLim = 52, avail = base - topLim - 10;
        /* échelle verticale adaptée à la colonne (règle graduée sur le côté) */
        var maxv = Math.max(10, Math.abs(ha), Math.abs(hmm)), ppm = Math.min(9, avail / (maxv * 1.05)), ppmNeg = ppm;
        var bx = ph ? 14 : 40, bw = W - bx * 2, tcx = W / 2, tw = Math.max(7, rr.value * 26), liqCol = ls.value === "hg" ? "#aab7c4" : ls.value === "etoh" ? "#e8d9a8" : "#a8d0f0", liqEdge = ls.value === "hg" ? "#6b7b8c" : "#4a90d6";
        /* récipient */
        ctx.save(); ctx.fillStyle = "rgba(255,255,255,.0)"; ctx.fillStyle = liqCol; ctx.globalAlpha = 0.75; S.draw.rrect(c, bx, base, bw, 62, 10); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; S.draw.rrect(c, bx, base - 40, bw, 102, 10); ctx.stroke(); ctx.restore();
        S.draw.line(c, bx + 2, base, bx + bw - 2, base, liqEdge, 2.4);
        S.draw.text(c, "niveau libre", bx + 12, base - 10, {size:11, color:P.grey, align:"left", weight:700});
        /* règle */
        var rx = ph ? W - 40 : W - 70, step = maxv > 120 ? 50 : maxv > 40 ? 20 : maxv > 15 ? 10 : 5;
        S.draw.line(c, rx, base - maxv * ppm * 1.05, rx, base + (ha < 0 ? Math.abs(ha) * ppm + 6 : 0), "#b6c0cc", 1.2);
        for (var m = (ha < 0 ? -Math.ceil(Math.abs(hmm) / step) * step : 0); m <= maxv * 1.05; m += step){ if (m > maxv * 1.04) break; var yy = base - m * ppm; S.draw.line(c, rx - 6, yy, rx, yy, "#b6c0cc", 1.2); S.draw.text(c, m + " mm", rx + 5, yy, {size:9.5, color:P.grey, align:"left"}); }
        /* tube */
        var yTop = base - Math.max(ha, 0) * ppm, yBot = base + 44, tubeTop = Math.min(yTop - 34, base - maxv * ppm - 8);
        ctx.save();
        /* liquide dans le tube + ménisque */
        var depth = Math.min(tw * 0.5, 16) * (1 - Math.min(1, Math.abs(cs))) + Math.min(tw * 0.4, 12) * Math.abs(cs), sgn = cs >= 0 ? 1 : -1, yM = base - ha * ppm;
        ctx.beginPath(); ctx.moveTo(tcx - tw / 2, yBot); ctx.lineTo(tcx - tw / 2, yM - sgn * depth * 0.0 - (sgn > 0 ? depth * 0.0 : 0));
        var yEdge = yM - (sgn > 0 ? 0 : depth * 0.0);
        ctx.moveTo(tcx - tw / 2, yBot); ctx.lineTo(tcx - tw / 2, yM);
        ctx.quadraticCurveTo(tcx, yM + sgn * depth * 1.6, tcx + tw / 2, yM); ctx.lineTo(tcx + tw / 2, yBot); ctx.closePath();
        ctx.fillStyle = liqCol; ctx.fill(); ctx.strokeStyle = liqEdge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tcx - tw / 2, yM); ctx.quadraticCurveTo(tcx, yM + sgn * depth * 1.6, tcx + tw / 2, yM); ctx.stroke();
        /* parois de verre */
        ctx.strokeStyle = "#5b6b7e"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(tcx - tw / 2, tubeTop); ctx.lineTo(tcx - tw / 2, yBot); ctx.moveTo(tcx + tw / 2, tubeTop); ctx.lineTo(tcx + tw / 2, yBot); ctx.stroke();
        ctx.restore();
        /* cote h */
        S.draw.line(c, tcx + tw / 2 + 14, base, tcx + tw / 2 + 14, yM, P.red, 1.8, [4, 3]);
        S.draw.dot(c, tcx + tw / 2 + 14, base, 3, P.red); S.draw.dot(c, tcx + tw / 2 + 14, yM, 3, P.red);
        S.draw.label(c, "h = " + S.fmt(ha, 1) + " mm", tcx + tw / 2 + 22, (base + yM) / 2, {color:P.red, align:"left", size:12.5});
        /* forces au ménisque */
        var fa = Math.abs(cs) * 38 + 8;
        if (Math.abs(h) > 0.0003){
          var up = cs >= 0 ? -1 : 1;
          S.draw.arrow(c, tcx - tw / 2 - 3, yM, tcx - tw / 2 - 3, yM + up * fa, P.green, 3); S.draw.arrow(c, tcx + tw / 2 + 3, yM, tcx + tw / 2 + 3, yM + up * fa, P.green, 3);
          S.draw.label(c, "γ cos θ", tcx - tw / 2 - 10, yM + up * fa * 0.5 - (up < 0 ? 0 : 0), {color:P.green, align:"right", size:11});
          S.draw.arrow(c, tcx, yM + (yBot - yM) * 0.4, tcx, yM + (yBot - yM) * 0.4 + (cs >= 0 ? 34 : -34), P.violet, 3);
        }
        /* légende */
        S.draw.panel(c, 10, 8, ph ? W - 20 : 330, 24, {shadow:false});
        S.draw.text(c, "▲ vert : tension superficielle   ▼ violet : poids de la colonne", 18, 20, {size:10.5, align:"left", color:P.ink, weight:700});
        ro.set(0, S.fmt(hmm, 1) + " mm"); ro.set(1, "θ = " + s[4] + "°"); ro.set(2, S.fmt(s[2] * 1000, 1) + " mN/m");
        nt.set("h = 2 × " + S.fmt(s[2], 4) + " × cos " + s[4] + "° / (" + S.fmt(s[3], 0) + " × 9,81 × " + S.sci(r, 2) + ") = " + S.fmt(hmm, 1) + " mm. " + (h < 0 ? "Angle de contact &gt; 90° : le liquide ne mouille pas le verre, le niveau descend (ménisque bombé)." : "Le liquide mouille le verre et monte (ménisque creux) : plus le tube est fin, plus il monte.") + (rr.value > 2 ? " Pour un tube large, la gravité l'emporte sur la capillarité (modèle valable pour r petit devant la longueur capillaire ≈ 2,7 mm pour l'eau)." : ""), rr.value > 2 ? "warn" : "ok");
      } else {
        var Pa = 2 * ga.value / 1000 / (ra.value * 1e-6), Pb = 2 * ga.value / 1000 / (rb.value * 1e-6), cm = 98.07;
        var y = H * 0.46, R = Math.min(W * 0.2, H * 0.3), xa = W * 0.26, xb = W * 0.74, rA = ra.value / 300 * R, rB = rb.value / 300 * R;
        /* tuyau entre les deux alvéoles */
        ctx.save(); ctx.fillStyle = "#e9eef5"; ctx.strokeStyle = "#a5b1c0"; ctx.lineWidth = 2; ctx.fillRect(xa + rA * 0.9, y - 9, xb - rB * 0.9 - xa - rA * 0.9, 18); ctx.strokeRect(xa + rA * 0.9, y - 9, xb - rB * 0.9 - xa - rA * 0.9, 18); ctx.restore();
        [[rA, xa, P.red, Pa, ra.value], [rB, xb, P.acc, Pb, rb.value]].forEach(function(al){
          var g2 = ctx.createRadialGradient(al[1] - al[0] * 0.3, y - al[0] * 0.35, al[0] * 0.1, al[1], y, al[0]);
          g2.addColorStop(0, "rgba(255,255,255,.9)"); g2.addColorStop(1, UC.rgba(al[2], 0.22 + 0.3 * (al[3] / Math.max(Pa, Pb))));
          ctx.beginPath(); ctx.arc(al[1], y, al[0], 0, 7); ctx.fillStyle = g2; ctx.fill(); ctx.lineWidth = 3.4; ctx.strokeStyle = al[2]; ctx.stroke();
          S.draw.text(c, "r = " + S.fmt(al[4], 0) + " µm", al[1], y, {size:12, color:al[2]});
          S.draw.label(c, "ΔP = " + S.fmt(al[3], 0) + " Pa", al[1], y + R + 26, {color:al[2], size:12.5});
        });
        S.draw.text(c, "alvéole 1", xa, y - R - 14, {size:11, color:P.grey, weight:700}); S.draw.text(c, "alvéole 2", xb, y - R - 14, {size:11, color:P.grey, weight:700});
        /* flux d'air */
        var x1 = xa + rA * 0.9, x2 = xb - rB * 0.9, dir = Pa > Pb + 1e-6 ? 1 : Pa < Pb - 1e-6 ? -1 : 0, spd = Math.min(1, Math.abs(Pa - Pb) / 3000);
        if (dir){ for (var i = 0; i < 8; i++){ var u = ((i / 8) + tt * (0.25 + spd * 0.5)) % 1, px = dir > 0 ? x1 + (x2 - x1) * u : x2 - (x2 - x1) * u; S.draw.dot(c, px, y, 2.8, P.amber); }
          S.draw.arrow(c, W / 2 - dir * 26, y - 22, W / 2 + dir * 26, y - 22, P.amber, 3.4); }
        S.draw.label(c, dir === 0 ? "pressions égales : pas de flux" : "l'air va de la haute vers la basse pression : du plus petit vers le plus grand", W / 2, 20, {color:P.ink, size:ph ? 10.5 : 12});
        ro.set(0, S.fmt(Pa, 0) + " Pa"); ro.set(1, S.fmt(Pa / cm, 1) + " cmH₂O"); ro.set(2, S.fmt(Pb, 0) + " Pa");
        nt.set("ΔP = 2γ/r = 2 × " + S.fmt(ga.value / 1000, 3) + " / " + S.sci(ra.value * 1e-6, 2) + " = " + S.fmt(Pa, 0) + " Pa = " + S.fmt(Pa / cm, 1) + " cmH₂O. " + (Pa > Pb ? "Le petit alvéole (1) est à plus haute pression : il tend à se vider dans le grand (instabilité, atélectasie)." : Pa < Pb ? "Ici le premier alvéole est le plus grand (pression plus basse) : le second se vide dans lui." : "") + " Diminuer γ (surfactant) diminue toutes les pressions dans le même rapport." + (fl.value ? " Active/désactive l'échange pour voir le petit alvéole se vider." : ""), "ok");
      }
    });
  }
});

/* ---------- 5. Types de solides : le détective ---------- */
var SOL = [
  ["NaCl (sel de cuisine)","ionique","801 °C","non","oui","dur, cassant","très soluble"],
  ["MgO","ionique","2 852 °C","non","oui (fondu)","très dur, cassant","quasi insoluble"],
  ["Diamant","covalent","≈ 3 550 °C (sublime)","non","—","le plus dur","insoluble"],
  ["Quartz SiO₂","covalent","1 713 °C","non","non (liquide visqueux)","dur","insoluble"],
  ["Fer","métallique","1 538 °C","oui","oui","dur, malléable et ductile","insoluble"],
  ["Cuivre","métallique","1 085 °C","oui","oui","malléable, ductile","insoluble"],
  ["Sodium","métallique","98 °C","oui","oui","très mou (coupe au couteau)","réagit avec l'eau"],
  ["Glace H₂O","moléculaire","0 °C","non (très faible)","non","mou, fragile","—"],
  ["Diiode I₂","moléculaire","114 °C (sublime facilement)","non","non","mou","peu soluble dans l'eau"],
  ["Naphtalène","moléculaire","80 °C","non","non","mou","insoluble dans l'eau"],
  ["Saccharose","moléculaire","186 °C (se décompose)","non","non (solution non conductrice)","modérément dur","très soluble"]
];
var TYPES = [["ionique","ionique"],["covalent","covalent (réseau)"],["métallique","métallique"],["moléculaire","moléculaire"]];
var EXPL = {ionique:"réseau d'ions, attraction électrostatique forte : T<sub>f</sub> élevée, cassant, isolant solide mais conducteur fondu ou dissous.", covalent:"réseau de liaisons covalentes sur tout le cristal : T<sub>f</sub> très élevée, très dur, isolant (sauf cas particuliers).", métallique:"cations dans une mer d'électrons : conducteur à l'état solide, malléable, T<sub>f</sub> très variable.", moléculaire:"molécules liées par forces de London, dipôle–dipôle ou liaisons H : T<sub>f</sub> basse, mou, isolant."};
SFA.sim({
  id:"uc-c04-types-solides", ch:"c04", tag:"Solides",
  titre:"Le détective des solides : ionique, covalent, métallique ou moléculaire ?",
  resume:"À partir de la température de fusion, de la conductivité et de la dureté, identifie le type de solide. Un score te dit où tu en es.",
  but:"Un solide mystère apparaît avec ses propriétés. Clique sur l'image du réseau qui lui correspond (ou utilise les boutons), puis passe au suivant. Les indices sont ceux d'un vrai tableau de propriétés.",
  aRetenir:"Ionique : fond à haute T, conduit fondu/dissous mais pas solide. Réseau covalent : T<sub>f</sub> très haute, très dur, isolant. Métallique : conduit solide, malléable. Moléculaire : T<sub>f</sub> basse, mou, isolant (le sucre se dissout sans conduire).",
  piege:"Une solution qui conduit ne prouve pas un solide ionique à elle seule (il faut aussi qu'il ne conduise pas à l'état solide) ; le graphite, covalent, conduit ; un solide moléculaire polaire peut se dissoudre dans l'eau sans la rendre conductrice (sucre).",
  build:function(k, S){
    var phone = (window.innerWidth || 800) < 700;
    var c = k.canvas(phone ? 500 : 420);
    var order = []; for (var i = 0; i < SOL.length; i++) order.push((i * 5 + 3) % SOL.length);
    var HARD = [3.5, 4, 5, 4, 3, 2, 0.8, 1, 0.8, 0.8, 2.2];
    var st = {i:0, score:0, tried:0, answered:false, last:""}, tiles = [], tt = 0;
    function answer(v){
      if (st.answered) return;
      var it = SOL[order[st.i]]; st.answered = true; st.tried++; st.last = v; tp.set(v);
      if (v === it[1]) st.score++;
      k.redraw();
    }
    var tp = k.seg("Ton choix", TYPES, "ionique", function(v){ if (!st.answered){ st.answered = false; answer(v); } });
    k.button("Solide suivant", function(){ st.i = (st.i + 1) % SOL.length; st.answered = false; st.last = ""; }, true);
    var ro = k.readouts(["Score", "Fusion", "Conduit solide / fondu", "Dureté"]);
    var nt = k.note("", "ok");
    c.pointer(function(type, p){
      if (type !== "down") return;
      tiles.forEach(function(t){ if (p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h) answer(t.v); });
    });
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    function bulb(x, y, on, col){
      var ctx = c.ctx;
      if (on === 1) S.draw.glow(c, x, y, 20, "#f4c542", 0.75);
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fillStyle = on === 1 ? "#ffd84d" : on === 0 ? "#e3e7ed" : "#f4f6f9"; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = on === 1 ? "#c98a00" : "#8a95a3"; ctx.stroke();
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(x - 4, y + 8, 8, 5); ctx.restore();
    }
    function lattice(type, x, y, w, h){
      var ctx = c.ctx, P = S.draw.palette, cols = 5, rows = 3, dx = w / (cols + 0.2), dy = h / (rows + 0.2), i2, j, px, py;
      function pos(i, j){ return [x + dx * (i + 0.6), y + dy * (j + 0.6)]; }
      if (type === "ionique"){
        for (j = 0; j < rows; j++) for (i2 = 0; i2 < cols; i2++){ if (i2 < cols - 1) S.draw.line(c, pos(i2, j)[0], pos(i2, j)[1], pos(i2 + 1, j)[0], pos(i2 + 1, j)[1], "#cfd6df", 1.2); if (j < rows - 1) S.draw.line(c, pos(i2, j)[0], pos(i2, j)[1], pos(i2, j + 1)[0], pos(i2, j + 1)[1], "#cfd6df", 1.2); }
        for (j = 0; j < rows; j++) for (i2 = 0; i2 < cols; i2++){ var pl = (i2 + j) % 2 === 0; px = pos(i2, j); UC.ball(ctx, px[0], px[1], pl ? 6 : 8, pl ? "#2f7fd1" : "#2a9d6f"); }
      } else if (type === "covalent"){
        for (j = 0; j < rows; j++) for (i2 = 0; i2 < cols; i2++){ px = pos(i2, j); if (i2 < cols - 1) UC.stick(ctx, px[0], px[1], pos(i2 + 1, j)[0], pos(i2 + 1, j)[1], 3.2, "#6b7280"); if (j < rows - 1) UC.stick(ctx, px[0], px[1], pos(i2, j + 1)[0], pos(i2, j + 1)[1], 3.2, "#6b7280"); if (i2 < cols - 1 && j < rows - 1 && (i2 + j) % 2 === 0) UC.stick(ctx, px[0], px[1], pos(i2 + 1, j + 1)[0], pos(i2 + 1, j + 1)[1], 3.2, "#6b7280"); }
        for (j = 0; j < rows; j++) for (i2 = 0; i2 < cols; i2++){ px = pos(i2, j); UC.ball(ctx, px[0], px[1], 6.2, "#4b5563"); }
      } else if (type === "métallique"){
        for (j = 0; j < rows; j++) for (i2 = 0; i2 < cols; i2++){ px = pos(i2, j); UC.ball(ctx, px[0], px[1], 8, "#e08a2a"); S.draw.text(c, "+", px[0], px[1] + 0.5, {size:10, color:"#fff", weight:800}); }
        for (var e = 0; e < 16; e++){ var u = (e * 0.137 + tt * 0.22 * (0.7 + (e % 3) * 0.2)) % 1, v = (e * 0.311) % 1, ex = x + 4 + u * (w - 8), ey = y + dy * 0.3 + ((v + Math.sin(tt * 2 + e) * 0.04) % 1) * (h - dy * 0.6); S.draw.dot(c, ex, ey, 2.3, "#2f7fd1"); }
      } else {
        for (j = 0; j < 2; j++) for (i2 = 0; i2 < 3; i2++){ var mx = x + dx * (i2 * 1.65 + 0.9), my = y + dy * (j * 1.35 + 0.9), a = (i2 + j * 2) * 0.9; var ux = Math.cos(a) * 8, uy = Math.sin(a) * 8; UC.stick(ctx, mx - ux, my - uy, mx + ux, my + uy, 3, "#9aa5b4"); UC.ball(ctx, mx - ux, my - uy, 6, "#d6392f"); UC.ball(ctx, mx + ux, my + uy, 6, "#e6ebf2");
          if (i2 < 2){ ctx.save(); ctx.setLineDash([2, 3]); ctx.strokeStyle = "#94a3b8"; ctx.beginPath(); ctx.moveTo(mx + 14, my); ctx.lineTo(mx + dx * 1.65 - 14, my); ctx.stroke(); ctx.restore(); } }
      }
    }
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, it = SOL[order[st.i]];
      UC.bg(c, "#f6f9fc", "#ffffff");
      if (!st.answered) S.draw.label(c, "Solide mystère n° " + (st.i + 1) + " / " + SOL.length, W / 2, 18, {color:P.mat, size:13});
      var fus = parseFloat(String(it[2]).replace(/[\s  ]/g, "").replace(/[^0-9.]/g, "").slice(0, 5)) || 0, hard = HARD[SOL.indexOf(it)];
      var rows = [["Température de fusion", it[2], "fus"], ["Conduit à l'état solide ?", it[3], "cs"], ["Conduit fondu ou dissous ?", it[4], "cf"], ["Dureté", it[5], "hard"], ["Comportement dans l'eau", it[6], "eau"]];
      var rh = 38, y0 = 40, bw = Math.min(150, W * 0.3);
      rows.forEach(function(r, i){
        var y = y0 + i * rh;
        ctx.fillStyle = i % 2 ? "#f3f6fa" : "#ffffff"; ctx.fillRect(14, y, W - 28, rh - 2);
        S.draw.text(c, r[0], 24, y + 11, {size:10.5, align:"left", color:P.grey, weight:700});
        var tx = 24, ty = y + 27;
        if (r[2] === "cs" || r[2] === "cf"){ var on = /^oui/.test(r[1]) ? 1 : /^non/.test(r[1]) ? 0 : -1; bulb(32, ty - 1, on); tx = 50; }
        S.draw.text(c, r[1], tx, ty, {size:12.5, align:"left", color:P.ink, weight:700});
        if (r[2] === "fus"){ var bx = W - 24 - bw; ctx.fillStyle = "#e3e7ed"; S.draw.rrect(c, bx, y + 14, bw, 9, 4.5); ctx.fill(); var g = ctx.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, "#2f7fd1"); g.addColorStop(1, "#d6392f"); ctx.fillStyle = g; S.draw.rrect(c, bx, y + 14, Math.max(8, bw * Math.min(1, fus / 3600)), 9, 4.5); ctx.fill(); S.draw.text(c, "0", bx, y + 31, {size:9, color:P.grey, align:"left"}); S.draw.text(c, "3 600 °C", bx + bw, y + 31, {size:9, color:P.grey, align:"right"}); }
        if (r[2] === "hard"){ var bx2 = W - 24 - bw; for (var q = 0; q < 5; q++){ ctx.fillStyle = q < Math.round(hard) ? "#7b5cb8" : "#e3e7ed"; S.draw.rrect(c, bx2 + q * (bw / 5), y + 14, bw / 5 - 3, 9, 3); ctx.fill(); } S.draw.text(c, "mou", bx2, y + 31, {size:9, color:P.grey, align:"left"}); S.draw.text(c, "très dur", bx2 + bw, y + 31, {size:9, color:P.grey, align:"right"}); }
      });
      /* tuiles : le réseau de chaque type de solide (clique pour répondre) */
      var ty0 = y0 + rows.length * rh + 12, th = (phone ? (H - ty0 - 18) / 2 : H - ty0 - 12), cols2 = phone ? 2 : 4, tw = (W - 28 - (cols2 - 1) * 8) / cols2;
      tiles = [];
      TYPES.forEach(function(t, i){
        var cx2 = 14 + (i % cols2) * (tw + 8), cy2 = ty0 + Math.floor(i / cols2) * (th + 8);
        var good = st.answered && t[0] === it[1], bad = st.answered && st.last === t[0] && t[0] !== it[1];
        ctx.save(); ctx.fillStyle = good ? "rgba(36,119,90,.10)" : bad ? "rgba(192,50,29,.08)" : "#ffffff"; ctx.strokeStyle = good ? P.green : bad ? P.red : "#d3dae3"; ctx.lineWidth = good || bad ? 2.4 : 1.4; S.draw.rrect(c, cx2, cy2, tw, th, 10); ctx.fill(); ctx.stroke(); ctx.restore();
        lattice(t[0], cx2 + 8, cy2 + 8, tw - 16, th - 34);
        S.draw.text(c, t[1].replace(" (réseau)", ""), cx2 + tw / 2, cy2 + th - 13, {size:tw < 90 ? 10.5 : 11.5, color:good ? P.green : bad ? P.red : P.ink, weight:800});
        tiles.push({x:cx2, y:cy2, w:tw, h:th, v:t[0]});
      });
      if (st.answered){ var ok = st.last === it[1]; S.draw.label(c, ok ? "Correct : " + it[0] + " est " + it[1] : "Pas tout à fait : " + it[0] + " est " + it[1], W / 2, 18 + 0, {color:ok ? P.green : P.red, size:12.5}); }
      ro.set(0, st.score + " / " + st.tried); ro.set(1, it[2]); ro.set(2, it[3] + " / " + it[4]); ro.set(3, it[5]);
      nt.set(st.answered ? (it[0] + " : " + EXPL[it[1]]) : "Lis les propriétés, puis clique sur le réseau qui correspond (un seul essai par solide). Le nom du solide apparaîtra après ta réponse.", st.answered ? (st.last === it[1] ? "ok" : "warn") : "ok");
    });
  }
});
})();
