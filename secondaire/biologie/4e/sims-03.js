/* Biologie 4e · chapitre 3 · Membrane cellulaire, diffusion et osmose */
SFA.sim({
  id:"b4-c03-diffusion", ch:"c03", tag:"Classique · particules",
  titre:"Diffusion : les particules s'égalisent toutes seules",
  resume:"Des particules agitées traversent des pores : la concentration s'égalise sans aucune énergie fournie.",
  but:"Règle le nombre de particules de chaque côté, la température et la surface de membrane perméable, puis lance. Observe la courbe et le temps pour atteindre l'égalité.",
  aRetenir:"La diffusion est le déplacement net des particules du milieu où elles sont les plus concentrées vers celui où elles le sont le moins, à cause de l'agitation moléculaire. Elle ne demande pas d'énergie, s'arrête quand les concentrations sont égales (les particules continuent pourtant à bouger) et est plus rapide quand la température monte.",
  piege:"À l'équilibre les particules ne s'arrêtent pas : il en passe autant dans un sens que dans l'autre. Les particules ne « veulent » pas s'égaliser : c'est un effet du hasard sur un grand nombre.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var st = {p:[], t:0, acc:0, hist:[], eq:null, N:0};
    var nl = k.slider("Particules à gauche", 0, 200, 10, 120, "", function(){ init(); });
    var nr = k.slider("Particules à droite", 0, 200, 10, 20, "", function(){ init(); });
    var T = k.slider("Température", 0, 80, 1, 37, "°C");
    var gap = k.slider("Surface de membrane perméable", 0, 100, 5, 40, "%");
    var ro = k.readouts(["À gauche", "À droite", "Écart", "Égalité (±10 %) atteinte à"]);
    var nt = k.note("", "");
    function init(){
      st.p = []; st.t = 0; st.acc = 0; st.hist = []; st.eq = null; st.N = nl.value + nr.value;
      for (var i = 0; i < nl.value; i++) st.p.push({x:Math.random() * 0.5, y:Math.random(), a:Math.random() * 6.283, o:0});
      for (i = 0; i < nr.value; i++) st.p.push({x:0.5 + Math.random() * 0.5, y:Math.random(), a:Math.random() * 6.283, o:1});
      st.hist.push([0, st.N ? nl.value / st.N * 100 : 50]);
    }
    init();
    var lp = k.loop(function(dt){
      var v = 0.35 * Math.sqrt((T.value + 273.15) / 310.15), g = gap.value / 100, lo = 0.5 - g / 2, hi = 0.5 + g / 2;
      for (var s = 0; s < 2; s++){
        var h = dt / 2;
        st.p.forEach(function(q){
          q.a += (Math.random() - 0.5) * 1.6;
          var px = q.x, nx = q.x + Math.cos(q.a) * v * h, ny = q.y + Math.sin(q.a) * v * h;
          if (ny < 0){ ny = -ny; q.a = -q.a; } if (ny > 1){ ny = 2 - ny; q.a = -q.a; }
          if (nx < 0){ nx = -nx; q.a = Math.PI - q.a; } if (nx > 1){ nx = 2 - nx; q.a = Math.PI - q.a; }
          if ((px - 0.5) * (nx - 0.5) < 0 && !(ny >= lo && ny <= hi)){ nx = px; q.a = Math.PI - q.a; }
          q.x = nx; q.y = ny;
        });
      }
      st.t += dt; st.acc += dt;
      var L = st.p.filter(function(q){ return q.x < 0.5; }).length;
      if (st.acc >= 0.25){ st.acc = 0; st.hist.push([st.t, st.N ? L / st.N * 100 : 50]); if (st.hist.length > 900) st.hist.shift(); }
      if (st.eq === null && st.N > 0 && Math.abs(nl.value - nr.value) > 0.1 * st.N && Math.abs(2 * L - st.N) <= 0.1 * st.N) st.eq = st.t;
      k.redraw();
    });
    lp.play();
    k.button("❚❚ Pause / ▶ Reprendre", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Recommencer", function(){ init(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, bh = H * 0.52, bx = 8, bw = W - 16;
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(bx, 8, bw, bh); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.strokeRect(bx, 8, bw, bh);
      var g = gap.value / 100, mx = bx + bw / 2, y0 = 8, y1 = 8 + bh, lo = y0 + (0.5 - g / 2) * bh, hi = y0 + (0.5 + g / 2) * bh;
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, lo); ctx.moveTo(mx, hi); ctx.lineTo(mx, y1); ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, lo); ctx.lineTo(mx, hi); ctx.stroke(); ctx.setLineDash([]);
      var L = 0;
      st.p.forEach(function(q){ if (q.x < 0.5) L++; S.draw.dot(c, bx + q.x * bw, y0 + q.y * bh, 3.6, q.o ? "#B45309" : "#1e3f8f"); });
      var R = st.N - L;
      B4.txt(c, "Gauche : " + L, bx + bw * 0.25, y1 + 14, "#1e3f8f", 13); B4.txt(c, "Droite : " + R, bx + bw * 0.75, y1 + 14, "#B45309", 13);
      var gy0 = y1 + 36, ax = S.draw.axes(c, {x0:0, x1:Math.max(60, st.t), y0:0, y1:100, xl:"t (s)", yl:"% des particules à gauche", stepY:25, t:gy0, l:40});
      S.draw.line(c, ax.L, ax.Y(50), ax.R, ax.Y(50), "#2e6b55", 1.5, [5, 4]);
      var ctx2 = c.ctx; ctx2.save(); ctx2.beginPath(); ctx2.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx2.clip(); ctx2.strokeStyle = B4.pal.acc; ctx2.lineWidth = 2.4; ctx2.beginPath();
      st.hist.forEach(function(h, i){ var x = ax.X(h[0]), y = ax.Y(h[1]); if (i === 0) ctx2.moveTo(x, y); else ctx2.lineTo(x, y); }); ctx2.stroke(); ctx2.restore();
      ro.set(0, L); ro.set(1, R); ro.set(2, Math.abs(L - R)); ro.set(3, st.eq !== null ? S.fmt(st.eq, 0) + " s" : (st.N === 0 ? "—" : "pas encore"));
      if (st.N === 0) nt.set("Ajoute des particules pour observer la diffusion.", "warn");
      else if (gap.value === 0) nt.set("Membrane totalement imperméable : aucune particule ne passe, l'écart reste constant.", "warn");
      else nt.set("Le sens du déplacement net va du côté le plus concentré vers le moins concentré : " + (L > R ? "gauche → droite" : L < R ? "droite → gauche" : "aucun (concentrations égales)") + ". Les particules continuent de traverser dans les deux sens.", "");
    });
  }
});

SFA.sim({
  id:"b4-c03-osmose", ch:"c03", tag:"Classique · modèle",
  titre:"Osmose : l'eau va vers le plus concentré",
  resume:"Deux compartiments séparés par une membrane perméable à l'eau seulement : suis le niveau de chaque côté.",
  but:"Choisis la concentration en saccharose de chaque côté et lance. Compare le niveau final à la valeur prévue, puis rends la membrane perméable au sucre.",
  aRetenir:"L'osmose est le passage de l'eau, à travers une membrane perméable à l'eau mais pas au soluté, du compartiment le moins concentré (hypotonique) vers le plus concentré (hypertonique). Elle s'arrête quand les concentrations sont égales (isotoniques).",
  piege:"L'eau n'est pas « attirée par le sel » et elle ne va pas du plus concentré vers le moins concentré en soluté : c'est l'inverse. Modèle simplifié : pression hydrostatique négligée, volume limité entre 10 et 190 mL par compartiment.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.8});
    var st = {VL:100, nL:0, nR:0, t:0, seed:7};
    var cl = k.slider("Concentration à gauche", 0, 1, 0.05, 0.6, "mol/L", function(){ rst(); });
    var cr = k.slider("Concentration à droite", 0, 1, 0.05, 0.2, "mol/L", function(){ rst(); });
    var sol = k.toggle("Membrane perméable aussi au sucre (diffusion)", false, function(){ rst(); });
    var ro = k.readouts(["Volume gauche", "Volume droite", "Conc. gauche", "Conc. droite"]);
    var nt = k.note("", "");
    function rst(){ st.VL = 100; st.nL = cl.value * 100; st.nR = cr.value * 100; st.cL = cl.value; st.cR = cr.value; st.t = 0; lp.pause(); }
    var lp = k.loop(function(dt){
      for (var s = 0; s < 5; s++){
        var h = dt / 5;
        if (sol.value){ var d = st.cL - st.cR; st.cL -= 0.5 * d * h; st.cR += 0.5 * d * h; }
        else {
          var VR = 200 - st.VL, cL = st.nL / st.VL, cR = st.nR / VR, flux = 40 * (cL - cR) * h;
          var nv = Math.max(10, Math.min(190, st.VL + flux)); st.VL = nv;
        }
      }
      st.t += dt; k.redraw();
    });
    rst();
    k.button("▶ Lancer", function(){ lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Remettre à zéro", function(){ rst(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, VR = 200 - st.VL;
      var cL = sol.value ? st.cL : (st.nL / st.VL), cR = sol.value ? st.cR : (st.nR / VR);
      var vL = sol.value ? 100 : st.VL, vR = sol.value ? 100 : VR;
      var top = 20, bot = H - 36, hh = bot - top, wi = (W - 60) / 2, xL = 20, xR = 40 + wi;
      function hgt(v){ return v / 200 * hh * 1.0; }
      function dots(x0, vol, conc, seed){
        var r = B4.rng(seed), n = Math.round(conc * vol * 0.5), hw = hgt(vol), y0 = bot - hw;
        for (var i = 0; i < n; i++) S.draw.dot(c, x0 + 6 + r() * (wi - 12), y0 + 6 + r() * Math.max(1, hw - 12), 3, "#B45309");
      }
      [[xL, vL, cL, 3], [xR, vR, cR, 5]].forEach(function(a){
        ctx.fillStyle = "rgba(147,197,253,.5)"; ctx.fillRect(a[0], bot - hgt(a[1]), wi, hgt(a[1]));
        dots(a[0], a[1], a[2], a[3]);
        ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(a[0], top); ctx.lineTo(a[0], bot); ctx.lineTo(a[0] + wi, bot); ctx.lineTo(a[0] + wi, top); ctx.stroke();
      });
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = "#2e6b55"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W / 2, top); ctx.lineTo(W / 2, bot); ctx.stroke(); ctx.restore();
      B4.txt(c, "membrane", W / 2, top - 8, "#2e6b55", 12);
      B4.txt(c, S.fmt(vL, 0) + " mL", xL + wi / 2, bot - hgt(vL) - 10, B4.pal.ink, 13); B4.txt(c, S.fmt(vR, 0) + " mL", xR + wi / 2, bot - hgt(vR) - 10, B4.pal.ink, 13);
      /* niveau final prévu */
      var tot = cl.value + cr.value, eq = sol.value ? 100 : (tot === 0 ? 100 : Math.max(10, Math.min(190, 200 * cl.value / tot)));
      S.draw.line(c, xL - 6, bot - hgt(eq), xL + 16, bot - hgt(eq), B4.pal.red, 2, [4, 3]); S.draw.line(c, xR + wi - 16, bot - hgt(200 - eq), xR + wi + 6, bot - hgt(200 - eq), B4.pal.red, 2, [4, 3]);
      B4.txt(c, "tirets rouges : niveau final prévu", W / 2, H - 12, B4.pal.red, 12);
      if (!sol.value && Math.abs(cL - cR) > 0.01 && st.t > 0.1) { var dir = cL > cR ? 1 : -1; S.draw.arrow(c, W / 2 - dir * 22, (top + bot) / 2, W / 2 + dir * 22, (top + bot) / 2, B4.pal.acc, 4); B4.txt(c, "eau", W / 2, (top + bot) / 2 - 14, B4.pal.acc, 12); }
      ro.set(0, S.fmt(vL, 0) + " mL"); ro.set(1, S.fmt(vR, 0) + " mL"); ro.set(2, S.fmt(cL, 2) + " mol/L"); ro.set(3, S.fmt(cR, 2) + " mol/L");
      var eqp = Math.abs(cL - cR) < 0.01;
      if (cl.value === cr.value && !sol.value) nt.set("Concentrations égales : milieux isotoniques, aucun mouvement net d'eau.", "ok");
      else if (sol.value) nt.set("Si le sucre peut passer, il diffuse du côté concentré vers le côté dilué jusqu'à égaliser les concentrations : le volume d'eau de chaque côté ne change pas (pas d'osmose).", "");
      else if (cl.value === 0 && cr.value > 0 || cr.value === 0 && cl.value > 0) nt.set("Un côté sans soluté : l'eau passe vers le côté sucré jusqu'à la limite du dispositif (10 mL).", "warn");
      else nt.set((cl.value > cr.value ? "Gauche hypertonique, droite hypotonique" : "Droite hypertonique, gauche hypotonique") + " : l'eau passe du côté le moins concentré vers le plus concentré. Niveau final prévu à gauche : " + S.fmt(eq, 0) + " mL (volume total 200 mL, concentrations égales). " + (eqp ? "Équilibre atteint." : ""), "");
    });
  }
});

SFA.sim({
  id:"b4-c03-bain", ch:"c03", tag:"Classique · graphe",
  titre:"Une cellule dans un bain : gonfler, éclater, plasmolyser",
  resume:"Fais varier la concentration en sel du bain et observe un globule rouge puis une cellule végétale.",
  but:"Choisis le type de cellule et déplace la concentration du bain (en % de NaCl). Lis le volume relatif et le comportement de la cellule.",
  aRetenir:"Cellule animale : milieu hypotonique → elle gonfle et peut éclater (hémolyse) ; isotonique (≈ 0,9 % de NaCl, sérum physiologique) → volume stable ; hypertonique → elle se déshydrate et se ratatine. Cellule végétale : la paroi empêche l'éclatement (turgescence) ; en milieu hypertonique, la membrane se décolle de la paroi (plasmolyse).",
  piege:"Modèle simplifié (cellule à concentration interne 0,9 %, volume non osmotique de 25 %). Éclater dans l'eau pure ne vaut que pour les cellules sans paroi : une cellule végétale ne « explose » pas, elle devient turgescente.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var typ = k.seg("Cellule", [["a","Animale (globule rouge)"],["v","Végétale"]], "a");
    var cb = k.slider("Concentration du bain (NaCl)", 0, 3, 0.05, 0.9, "%");
    var ro = k.readouts(["Bain par rapport à la cellule", "Volume relatif V/V₀", "Sens net de l'eau", "État"]);
    var nt = k.note("", "");
    k.button("Eau distillée", function(){ cb.set(0); });
    k.button("Sérum physiologique", function(){ cb.set(0.9); });
    k.button("Eau de mer (≈ 3 %)", function(){ cb.set(3); });
    var CI = 0.9, B = 0.25, LY = 1.6;
    function vol(cc, animal){
      if (cc < 0.02) cc = 0.02;
      var v = B + (1 - B) * CI / cc;
      return animal ? v : Math.min(v, 1.1);
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, animal = typ.value === "a", cc = cb.value, v = vol(cc, animal);
      var gh = H * 0.5;
      var cx = W / 2, cy = gh / 2 + 6, r0 = Math.min(W * 0.2, gh * 0.34);
      ctx.fillStyle = cc < CI - 0.04 ? "rgba(186,230,253,.45)" : cc > CI + 0.04 ? "rgba(253,230,138,.5)" : "rgba(220,252,231,.6)"; ctx.fillRect(6, 6, W - 12, gh);
      ctx.strokeStyle = "#cbd5e1"; ctx.strokeRect(6, 6, W - 12, gh);
      var lyse = animal && v >= LY, r = r0 * Math.sqrt(Math.min(v, LY));
      if (animal){
        if (lyse){ for (var i = 0; i < 12; i++){ var an = i * 0.52; B4.ell(c, cx + Math.cos(an) * r * 1.15, cy + Math.sin(an) * r * 1.15, 5, 3, "rgba(180,40,40,.6)", null, 0, an); } B4.txt(c, "éclatée !", cx, cy, B4.pal.red, 14); }
        else if (v < 0.85){
          ctx.beginPath(); for (i = 0; i <= 48; i++){ var a2 = i / 48 * 6.283, rr = r * (1 + 0.13 * Math.sin(a2 * 10)); var px = cx + Math.cos(a2) * rr, py = cy + Math.sin(a2) * rr; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
          ctx.closePath(); ctx.fillStyle = "rgba(190,40,40,.5)"; ctx.fill(); ctx.strokeStyle = B4.pal.red; ctx.lineWidth = 2; ctx.stroke();
        } else { B4.ell(c, cx, cy, r, r, "rgba(190,40,40,.5)", B4.pal.red, 2.5); if (v < 1.2) B4.ell(c, cx, cy, r * 0.4, r * 0.4, "rgba(255,255,255,.45)"); }
      } else {
        var wR = r0 * 1.12; B4.rr(c, cx - wR, cy - wR, wR * 2, wR * 2, 8, null, "#2e6b55", 5);
        var rin = r0 * Math.sqrt(v / 1.1) * 1.05; if (v >= 1) rin = wR - 3;
        B4.rr(c, cx - rin, cy - rin, rin * 2, rin * 2, 10, "rgba(167,243,208,.6)", B4.pal.teal, 2.5);
        B4.txt(c, v < 0.995 ? "plasmolyse" : v > 1.005 ? "turgescente" : "à l'équilibre", cx, cy, B4.pal.ink, 12);
      }
      var dirw = cc < CI - 0.04 ? "entre" : cc > CI + 0.04 ? "sort" : null;
      if (dirw){ for (i = 0; i < 3; i++){ var ay = cy - 24 + i * 24; if (dirw === "entre") S.draw.arrow(c, cx - r0 * 1.9, ay, cx - r * 1.25, ay, B4.pal.acc, 2.5); else S.draw.arrow(c, cx - r * 1.25, ay, cx - r0 * 1.9, ay, B4.pal.acc, 2.5); } B4.txt(c, "eau", cx - r0 * 1.7, cy + 50, B4.pal.acc, 12); }
      var ax = S.draw.axes(c, {x0:0, x1:3, y0:0, y1:2, xl:"bain (% NaCl)", yl:"V/V₀", stepX:0.5, stepY:0.5, t:gh + 24, l:40});
      S.draw.fn(c, ax, function(x){ return Math.min(2, vol(x, true)); }, B4.pal.red, 2.4);
      S.draw.fn(c, ax, function(x){ return vol(x, false); }, B4.pal.green, 2.4, [6, 4]);
      S.draw.line(c, ax.X(0), ax.Y(LY), ax.X(3), ax.Y(LY), "#8a95a3", 1.2, [3, 3]); B4.txt(c, "éclatement (animale) V/V₀ = 1,6", ax.X(1.9), ax.Y(LY) - 8, "#5f6b7a", 11);
      B4.txt(c, "animale", ax.X(2.5), ax.Y(0.85), B4.pal.red, 12); B4.txt(c, "végétale (tirets)", ax.X(2.2), ax.Y(1.18), B4.pal.green, 12);
      S.draw.dot(c, ax.X(cc), ax.Y(Math.min(2, v)), 7, "#13233a");
      var rel = cc < CI - 0.04 ? "hypotonique" : cc > CI + 0.04 ? "hypertonique" : "isotonique";
      var etat = animal ? (lyse ? "éclatée (hémolyse)" : v > 1.2 ? "gonflée" : v >= 0.85 ? "normale" : "ratatinée") : (v > 1.005 ? "turgescente" : v >= 0.995 ? "équilibre (flasque)" : "plasmolysée");
      ro.set(0, rel); ro.set(1, S.fmt(Math.min(v, 9.99), 2)); ro.set(2, dirw === "entre" ? "vers l'intérieur" : dirw === "sort" ? "vers l'extérieur" : "nul"); ro.set(3, etat);
      nt.set(rel === "isotonique" ? "Concentrations égales : pas de mouvement net d'eau, volume inchangé." : rel === "hypotonique" ? "Bain moins concentré que la cellule : l'eau entre (vers le plus concentré)." + (animal && lyse ? " Sans paroi, la membrane cède : hémolyse." : !animal ? " La paroi résiste : la cellule devient turgescente mais n'éclate pas." : "") : "Bain plus concentré que la cellule : l'eau sort." + (animal ? " La cellule se ratatine." : " La membrane se décolle de la paroi : plasmolyse."), lyse ? "bad" : rel === "isotonique" ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c03-pompe", ch:"c03", tag:"Transport actif · animation",
  titre:"Pompe Na⁺/K⁺ : l'ATP maintient le gradient",
  resume:"Coupe l'ATP d'une cellule et regarde le sodium envahir l'intérieur par les canaux, puis rends-lui l'énergie.",
  but:"Règle l'ATP disponible et la fuite passive, puis lance : observe chaque ion traverser (canal = diffusion, pompe = transport actif) et suis [Na⁺] et [K⁺] à l'intérieur.",
  aRetenir:"Les ions fuient en permanence par diffusion, selon leurs gradients. La pompe Na⁺/K⁺ utilise l'ATP pour renvoyer 3 Na⁺ vers l'extérieur et faire entrer 2 K⁺ : c'est un transport actif, contre le gradient. Sans ATP (cyanure, manque d'oxygène) le gradient s'effondre.",
  piege:"Modèle très simplifié (concentrations en mmol/L, temps en minutes, cinétique de saturation). Ne retiens pas les valeurs exactes, mais le principe : fuite passive vs pompage actif.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:1.12});
    var atp = k.slider("ATP disponible", 0, 100, 5, 100, "%");
    var leak = k.slider("Fuite passive (canaux)", 0.5, 3, 0.1, 1, "×");
    var ro = k.readouts(["[Na⁺] intérieur", "[K⁺] intérieur", "Na⁺ pompés", "Équilibre visé [Na⁺]"]);
    var nt = k.note("", "");
    var NAO = 145, KO = 5, LK = 0.1, LKK = 0.0659, KM = 15, PM = 30, UNIT = 6;
    var st = {na:12, k:140, t:0, h:[[0, 12, 140]], acc:0, tt:0, ev:[], fl:0, car:{na:0, k:0, pn:0, pk:0}}, rr = B4.rng(11), seeds = [];
    for (var i = 0; i < 90; i++) seeds.push([rr(), rr(), rr() * 6.28, 0.6 + rr()]);
    function pumpRate(na){ return PM * atp.value / 100 * na / (na + KM); }
    function steady(){
      var lo = 0, hi = NAO, f = function(n){ return LK * leak.value * (NAO - n) - pumpRate(n); };
      for (var i = 0; i < 60; i++){ var m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; } return (lo + hi) / 2;
    }
    var lp = k.loop(function(dt){
      var min = dt * 2;
      for (var s = 0; s < 10; s++){
        var h = min / 10, p = pumpRate(st.na);
        st.na += (LK * leak.value * (NAO - st.na) - p) * h;
        st.k += (p * 2 / 3 - LKK * leak.value * (st.k - KO)) * h;
        st.na = Math.max(0, Math.min(NAO, st.na)); st.k = Math.max(KO, st.k);
      }
      /* événements visibles : flux (mmol/L/min) × 2 min/s ÷ UNIT = ions par seconde réelle */
      var pr = pumpRate(st.na), fl = [LK * leak.value * (NAO - st.na), LKK * leak.value * (st.k - KO), pr, pr * 2 / 3], keys = ["na", "k", "pn", "pk"];
      keys.forEach(function(kk, q){ st.car[kk] += fl[q] * 2 / UNIT * dt; while (st.car[kk] >= 1){ st.car[kk] -= 1; st.ev.push({k:kk, t:0, dur:kk[0] === "p" ? 1.4 : 1.1, x:rr()}); if (kk === "pn") st.fl = 1; } });
      st.ev.forEach(function(e){ e.t += dt; }); st.ev = st.ev.filter(function(e){ return e.t < e.dur; }); st.fl = Math.max(0, st.fl - dt * 2.5); st.tt += dt;
      st.t += min; st.acc += min; if (st.acc >= 1){ st.acc = 0; st.h.push([st.t, st.na, st.k]); if (st.h.length > 400) st.h.shift(); }
      if (st.t >= 120) lp.pause(); k.redraw();
    });
    k.button("▶ Lancer", function(){ if (st.t >= 120){ st.na = 12; st.k = 140; st.t = 0; st.h = [[0, 12, 140]]; st.ev = []; } lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Cellule saine", function(){ lp.pause(); st.na = 12; st.k = 140; st.t = 0; st.h = [[0, 12, 140]]; st.ev = []; });
    function ion(x, y, col, txt, r){ var ctx = c.ctx; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); var g = ctx.createRadialGradient(x - r * .3, y - r * .35, 1, x, y, r); g.addColorStop(0, "#fff"); g.addColorStop(0.35, col); g.addColorStop(1, col); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.stroke(); if (txt) S.draw.text(c, txt, x, y, {size:r * 0.95, color:"#fff", weight:800}); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, hs = H * 0.5, my0 = hs * 0.4, my1 = hs * 0.6, p = pumpRate(st.na), t = st.tt;
      ctx.fillStyle = "#fdf3d8"; ctx.fillRect(0, 0, W, my0); ctx.fillStyle = "#dff3e6"; ctx.fillRect(0, my1, W, hs - my1);
      var xc = W * 0.28, xp = W * 0.7;
      /* membrane : bicouche */
      for (var x = 4; x < W; x += 11){ var gap = Math.abs(x - xc) < 15 || Math.abs(x - xp) < 24; if (gap) continue;
        for (var side = 0; side < 2; side++){ var yh = side ? my1 - 5 : my0 + 5, yt = side ? my1 - 18 : my0 + 18; ctx.strokeStyle = "#c9a45c"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 2, yh); ctx.lineTo(x - 2, (yh + yt) / 2 + (side ? 2 : -2)); ctx.moveTo(x + 2, yh); ctx.lineTo(x + 2, (yh + yt) / 2 + (side ? 2 : -2)); ctx.stroke(); S.draw.dot(c, x, yh + (side ? 1 : -1), 4, "#e8b04a"); } }
      /* canal */
      S.draw.rrect(c, xc - 14, my0, 9, my1 - my0, 3); ctx.fillStyle = "#b8c3d8"; ctx.fill(); S.draw.rrect(c, xc + 5, my0, 9, my1 - my0, 3); ctx.fill(); S.draw.text(c, "canal", xc, my0 - 8, {size:10, color:"#5f6b7a"});
      /* pompe */
      var open = Math.sin(t * Math.max(0.5, p * 0.5)) > 0 && p > 0.05; ctx.save(); var pg = ctx.createLinearGradient(xp - 24, 0, xp + 24, 0); pg.addColorStop(0, "#8d62d9"); pg.addColorStop(1, "#5b2fb3");
      ctx.beginPath(); ctx.moveTo(xp - 24, my0 - 4); ctx.lineTo(xp + 24, my0 - 4); ctx.lineTo(xp + (open ? 18 : 6), (my0 + my1) / 2); ctx.lineTo(xp + 24, my1 + 4); ctx.lineTo(xp - 24, my1 + 4); ctx.lineTo(xp - (open ? 6 : 18), (my0 + my1) / 2); ctx.closePath(); ctx.fillStyle = pg; ctx.fill(); ctx.strokeStyle = "#3f1f87"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      S.draw.text(c, "pompe", xp, (my0 + my1) / 2, {size:10, color:"#fff"});
      if (st.fl > 0){ S.draw.glow(c, xp, my1 + 14, 22, P.yellow, 0.9 * st.fl); S.draw.text(c, "ATP → ADP + Pi", xp, hs + 4, {size:10, color:P.amber, weight:800}); }
      /* ions en solution (agitation) */
      function bro(sd, y0, y1){ return [sd[0] * (W - 20) + 10 + Math.sin(t * sd[3] + sd[2]) * 6, y0 + sd[1] * (y1 - y0) + Math.cos(t * sd[3] * 0.8 + sd[2]) * 4]; }
      var nOutNa = Math.round(NAO / UNIT), nInNa = Math.round(st.na / UNIT), nInK = Math.round(st.k / UNIT), nOutK = Math.max(1, Math.round(KO / UNIT)), q, pp;
      for (q = 0; q < nOutNa; q++){ pp = bro(seeds[q], 6, my0 - 16); ion(pp[0], pp[1], "#e8a317", "", 5.2); }
      for (q = 0; q < nInNa; q++){ pp = bro(seeds[q + 30], my1 + 14, hs - 14); ion(pp[0], pp[1], "#e8a317", "", 5.2); }
      for (q = 0; q < nInK; q++){ pp = bro(seeds[q + 50 > 89 ? q : q + 50], my1 + 14, hs - 14); ion(pp[0], pp[1], "#2fa36b", "", 5.2); }
      for (q = 0; q < nOutK; q++){ pp = bro(seeds[80 + q % 9], 6, my0 - 16); ion(pp[0], pp[1], "#2fa36b", "", 5.2); }
      /* ions en transit */
      st.ev.forEach(function(e){
        var u = e.t / e.dur, ease = u * u * (3 - 2 * u), xx, y0 = 10, y1 = hs - 12, col = e.k === "na" || e.k === "pn" ? "#e8a317" : "#2fa36b";
        var inn = e.k === "na" || e.k === "pk";   /* vers l'intérieur : de haut en bas */
        var xs = e.k[0] === "p" ? xp - 10 + e.x * 20 : xc - 2 + (e.x - 0.5) * 6; var yy = inn ? y0 + (y1 - y0) * ease : y1 - (y1 - y0) * ease;
        if (e.k[0] !== "p") xx = xc + (e.x - .5) * 6; else xx = xp + (e.x - 0.5) * 18;
        ion(xx, yy, col, "", 5.8);
      });
      S.draw.label(c, "Extérieur : Na⁺ 145 · K⁺ 5 mmol/L", 8, 12, {color:"#8a5a05", align:"left", size:10.5}); S.draw.label(c, "Intérieur : Na⁺ " + S.fmt(st.na, 0) + " · K⁺ " + S.fmt(st.k, 0), 8, hs - 12, {color:"#1f6b43", align:"left", size:10.5});
      ion(W - 80, hs - 12, "#e8a317", "", 4.5); S.draw.text(c, "Na⁺", W - 72, hs - 12, {size:10, color:"#5f6b7a", align:"left"}); ion(W - 40, hs - 12, "#2fa36b", "", 4.5); S.draw.text(c, "K⁺", W - 32, hs - 12, {size:10, color:"#5f6b7a", align:"left"});
      S.draw.text(c, "1 ion dessiné ≈ " + UNIT + " mmol/L", W - 8, 12, {size:9, color:"#5f6b7a", align:"right"});
      /* graphe */
      var ax = S.draw.axes(c, {x0:0, x1:120, y0:0, y1:160, xl:"t (min)", yl:"mmol/L (intérieur)", stepX:20, stepY:40, t:hs + 22, l:40});
      var series = [[1, P.amber, "[Na⁺]"], [2, P.green, "[K⁺]"]];
      series.forEach(function(s){ ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = s[1]; ctx.lineWidth = 2.6; ctx.beginPath(); st.h.forEach(function(h, i){ var x = ax.X(h[0]), y = ax.Y(h[s[0]]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore(); });
      S.draw.label(c, "[Na⁺]", ax.R - 34, ax.Y(st.na) - 12, {color:P.amber, size:10}); S.draw.label(c, "[K⁺]", ax.R - 34, ax.Y(st.k) - 12, {color:P.green, size:10});
      var sNa = steady();
      ro.set(0, S.fmt(st.na, 0) + " mmol/L"); ro.set(1, S.fmt(st.k, 0) + " mmol/L"); ro.set(2, S.fmt(p, 1) + " mmol/L/min"); ro.set(3, S.fmt(sNa, 0) + " mmol/L");
      nt.set(atp.value === 0 ? "Sans ATP : plus de pompage. Le Na⁺ entre par fuite jusqu'à égaliser avec l'extérieur (≈ 145) et le K⁺ s'échappe : le gradient disparaît." : st.na > 40 ? "Le gradient s'effondre : la pompe n'arrive plus à compenser la fuite." : "La pompe compense la fuite : le gradient se maintient (équilibre dynamique, avec dépense d'ATP).", atp.value === 0 || st.na > 40 ? "bad" : "ok");
    });
  }
});

/*B3D-LIB*/
window.B3D = window.B3D || (function(){
  var B = {}, BG = [244,246,251];
  B.hex = function(h){ h = h.replace("#",""); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; };
  B.mix = function(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; };
  B.css = function(a,al){ return "rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+(al===undefined?1:al)+")"; };
  B.cam = function(yaw,pitch,dist){ return {yaw:yaw, pitch:pitch, dist:dist||7, auto:true, hold:false}; };
  B.rot = function(cam,x,y,z){
    var cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    var x1=cy*x+sy*z, z1=-sy*x+cy*z, y1=cp*y+sp*z1, z2=-sp*y+cp*z1; return [x1,y1,z2];
  };
  /* glisser = tourner (souris et doigt) */
  B.drag = function(c, cam, redraw){
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    var lx=0, ly=0, dn=false;
    c.pointer(function(t,p){
      if (t==="down"){ dn=true; lx=p.x; ly=p.y; cam.hold=true; c.cv.style.cursor="grabbing"; }
      else if (t==="drag" && dn){ cam.yaw -= (p.x-lx)*0.012; cam.pitch += (p.y-ly)*0.01; cam.pitch = Math.max(-1.45, Math.min(1.45, cam.pitch)); lx=p.x; ly=p.y; if (redraw) redraw(); }
      else if (t==="up"){ dn=false; cam.hold=false; c.cv.style.cursor="grab"; }
    });
  };
  B.spin = function(cam, dt, speed){ if (cam.auto && !cam.hold) cam.yaw += dt*(speed||0.35); };
  B.background = function(c){
    var ctx=c.ctx, g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#fbfcff"); g.addColorStop(1,"#e9eef7");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
  };
  B.hint = function(c, txt){
    var ctx=c.ctx; ctx.save(); ctx.font="600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle="#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.fillText(txt || "Glisse pour tourner la vue en 3D", 10, c.H-10); ctx.restore();
  };
  B.scene = function(c, cam, scale, fogD){
    var items=[], labels=[], ctx=c.ctx, fd=fogD||4;
    var S = {};
    S.P = function(p){ var r=B.rot(cam,p[0],p[1],p[2]); var k=cam.dist/(cam.dist+r[2]); return {x:c.W/2+r[0]*k*scale, y:c.H/2-r[1]*k*scale, z:r[2], k:k}; };
    function fog(z){ return Math.max(0, Math.min(1, (z+fd)/(2*fd)))*0.5; }
    S.sphere = function(p, r, col, al, ring){
      var q=S.P(p), rr=r*q.k*scale; if (rr<0.4) return;
      items.push({z:q.z, f:function(){
        var base=B.mix(col, BG, fog(q.z));
        var g=ctx.createRadialGradient(q.x-.35*rr,q.y-.4*rr,rr*.08,q.x,q.y,rr);
        g.addColorStop(0,B.css(B.mix(base,[255,255,255],.6))); g.addColorStop(.5,B.css(base)); g.addColorStop(1,B.css(B.mix(base,[0,0,20],.42)));
        ctx.globalAlpha = al===undefined?1:al; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,rr,0,6.2832); ctx.fill();
        if (ring){ ctx.strokeStyle=ring; ctx.lineWidth=Math.max(1,rr*.12); ctx.stroke(); }
        ctx.globalAlpha=1; }});
      return q;
    };
    S.line = function(a, b, w, col, al, dash){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=w*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round"; ctx.strokeStyle=B.css(B.mix(col,BG,fog(z)));
        if (dash) ctx.setLineDash(dash);
        ctx.lineWidth=Math.max(.6,wd); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }});
    };
    /* cylindre ombré entre a et b (rayon r) */
    S.tube = function(a, b, r, col, al){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=2*r*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round";
        var ws=[1,.7,.4,.18], cs=[B.mix(base,[0,0,20],.4), B.mix(base,[0,0,20],.12), base, B.mix(base,[255,255,255],.5)];
        var dx=(q.x-p.x), dy=(q.y-p.y), L=Math.sqrt(dx*dx+dy*dy)||1, nx=-dy/L, ny=dx/L;
        for (var i=0;i<4;i++){ var off=(i>=2? -0.18:0)*wd/2; ctx.strokeStyle=B.css(cs[i]); ctx.lineWidth=Math.max(.6,wd*ws[i]);
          ctx.beginPath(); ctx.moveTo(p.x+nx*off,p.y+ny*off); ctx.lineTo(q.x+nx*off,q.y+ny*off); ctx.stroke(); }
        ctx.globalAlpha=1; }});
    };
    /* face plane (liste de points 3D), normale n (3D), ombrage de Lambert */
    S.poly = function(pts, col, n, al, stroke, back){
      var ps=pts.map(S.P), z=0; ps.forEach(function(p){ z+=p.z; }); z/=ps.length; if (back) z=99;
      var sh=0.75;
      if (n){ var r=B.rot(cam,n[0],n[1],n[2]), L=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2])||1; var d=(-0.35*r[0]+0.55*r[1]-0.75*r[2])/L; sh=0.55+0.45*Math.abs(d); }
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); base=B.mix([0,0,20],base,Math.min(1,sh)); if (sh>1) base=B.mix(base,[255,255,255],sh-1);
        ctx.globalAlpha=al===undefined?1:al; ctx.fillStyle=B.css(base); ctx.beginPath(); ctx.moveTo(ps[0].x,ps[0].y);
        for (var i=1;i<ps.length;i++) ctx.lineTo(ps[i].x,ps[i].y); ctx.closePath(); ctx.fill();
        if (stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=.8; ctx.stroke(); } ctx.globalAlpha=1; }});
    };
    S.label = function(p, txt, col, size, dx, dy, align){ labels.push({q:S.P(p), t:txt, c:col||"#0f1b2d", s:size||12, dx:dx||0, dy:dy||0, a:align||"center"}); };
    S.flush = function(){
      items.sort(function(a,b){ return b.z-a.z; });
      for (var i=0;i<items.length;i++) items[i].f();
      ctx.save(); ctx.textBaseline="middle";
      labels.forEach(function(l){ ctx.font="700 "+l.s+"px Mulish,system-ui,sans-serif"; ctx.textAlign=l.a;
        var w=ctx.measureText(l.t).width, x=l.q.x+l.dx, y=l.q.y+l.dy;
        ctx.fillStyle="rgba(255,255,255,.82)"; var bx = l.a==="center"? x-w/2 : (l.a==="left"? x : x-w); ctx.fillRect(bx-3,y-l.s*.62,w+6,l.s*1.25);
        ctx.fillStyle=l.c; ctx.fillText(l.t,x,y); });
      ctx.restore();
    };
    return S;
  };
  return B;
})();
/*B3D-LIB-END*/

/*B3D-ADD:b4-3d-membrane*/
SFA.sim({
  id:"b4-3d-membrane", ch:"c03", tag:"3D · membrane",
  titre:"Membrane plasmique en 3D : qui passe où ?",
  resume:"Une bicouche de phospholipides, des canaux et un transporteur : regarde O₂, eau, Na⁺ et glucose chercher leur passage.",
  but:"Choisis une substance et glisse pour tourner la membrane. Observe par où elle traverse (entre les lipides, par un canal, par un transporteur) et compare les entrées et les sorties. Retire les protéines pour voir ce qui se bloque.",
  aRetenir:"La membrane est une bicouche de phospholipides (têtes hydrophiles vers l'eau, queues hydrophobes au centre) parsemée de protéines (modèle de la mosaïque fluide). Les petites molécules non chargées (O₂, CO₂) traversent les lipides ; l'eau passe lentement, vite par les aquaporines ; les ions et le glucose ont besoin de protéines (canal, transporteur). La diffusion va toujours du plus concentré vers le moins concentré, sans énergie. À l'équilibre, les particules continuent de traverser dans les deux sens, en nombre égal.",
  piege:"Une membrane perméable à tout ne serait pas une membrane : elle est sélective. Et à l'équilibre, le passage ne s'arrête pas : il y a autant d'entrées que de sorties (équilibre dynamique). Le transporteur de glucose se sature : au-delà d'un débit maximal, ajouter du glucose ne va pas plus vite.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(440), cam = B.cam(0.6, 0.22, 8.5);
    var sub = k.select("Substance", [["o2","Dioxygène O₂ (petite, apolaire)"],["h2o","Eau H₂O"],["na","Ion Na⁺ (chargé)"],["glu","Glucose (grosse, polaire)"]], "o2", function(){ reset(); });
    var out0 = k.slider("Part de particules dehors au départ", 50, 100, 5, 90, "%", function(){ reset(); });
    var prot = k.toggle("Protéines membranaires présentes", true, function(){ reset(); });
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    var ro = k.readouts(["Dehors", "Dedans", "Entrées (cumul)", "Sorties (cumul)"]);
    var nt = k.note("", "");
    k.button("Relancer", function(){ reset(); }, true);
    cam.auto = false;
    var SP = 0.52, NG = 7, HH = 0.28;
    var TYPES = {o2:{c:B.hex("#e11d48"), r:0.09, n:"O₂"}, h2o:{c:B.hex("#38bdf8"), r:0.08, n:"H₂O"}, na:{c:B.hex("#8b5cf6"), r:0.1, n:"Na⁺"}, glu:{c:B.hex("#f59e0b"), r:0.13, n:"glucose"}};
    function cell(i){ return (i - (NG - 1) / 2) * SP; }
    var PROT = [ {t:"na", x:cell(1), z:cell(1)}, {t:"na", x:cell(5), z:cell(3)}, {t:"aq", x:cell(5), z:cell(5)}, {t:"aq", x:cell(2), z:cell(4)}, {t:"car", x:cell(5), z:cell(1)}, {t:"car", x:cell(1), z:cell(5)} ];
    PROT.forEach(function(p){ p.busy = 0; });
    var P = [], N = 44, ent = 0, sor = 0, T = 0, BOX = 1.75;
    function rnd(){ return (Math.random() + Math.random() + Math.random() - 1.5) * 1.15; }
    function reset(){
      P = []; ent = 0; sor = 0;
      var nOut = Math.round(N * out0.value / 100);
      for (var i = 0; i < N; i++){ var up = i < nOut; P.push({x:(Math.random() * 2 - 1) * BOX, z:(Math.random() * 2 - 1) * BOX, y:(up ? 1 : -1) * (0.3 + Math.random() * 1.4), vx:rnd(), vy:rnd(), vz:rnd()}); }
      PROT.forEach(function(p){ p.busy = 0; });
    }
    function passes(p, x, z){
      var t = sub.value, hit = null;
      if (prot.value) PROT.forEach(function(q){ var d = Math.hypot(q.x - x, q.z - z); if (d < 0.32) hit = q; });
      if (t === "o2") return Math.random() < 0.9;
      if (t === "h2o"){ if (hit && hit.t === "aq") return Math.random() < 0.9; return Math.random() < 0.1; }
      if (t === "na"){ if (hit && hit.t === "na") return Math.random() < 0.7; return false; }
      if (t === "glu"){ if (hit && hit.t === "car" && hit.busy <= 0){ if (Math.random() < 0.5){ hit.busy = 0.7; return true; } } return false; }
      return false;
    }
    function step(dt){
      T += dt;
      PROT.forEach(function(q){ q.busy = Math.max(0, q.busy - dt); });
      var tt = TYPES[sub.value], sp = sub.value === "glu" ? 0.7 : 1;
      P.forEach(function(p){
        p.vx = 0.93 * p.vx + 0.35 * rnd(); p.vy = 0.93 * p.vy + 0.35 * rnd(); p.vz = 0.93 * p.vz + 0.35 * rnd();
        var oy = p.y; p.x += p.vx * dt * sp; p.y += p.vy * dt * sp; p.z += p.vz * dt * sp;
        if (Math.abs(p.x) > BOX){ p.x = Math.sign(p.x) * BOX; p.vx *= -1; }
        if (Math.abs(p.z) > BOX){ p.z = Math.sign(p.z) * BOX; p.vz *= -1; }
        if (Math.abs(p.y) > 1.9){ p.y = Math.sign(p.y) * 1.9; p.vy *= -1; }
        if (oy * p.y < 0){
          if (passes(p, p.x, p.z)){ if (p.y < 0) ent++; else sor++; }
          else { p.y = oy; p.vy *= -1; }
        }
      });
    }
    B.drag(c, cam, function(){ render(); });
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, Math.min(c.W, c.H) / 5.3, 4), tt = TYPES[sub.value];
      var HEAD = B.hex("#f2d98a"), TAIL = B.hex("#d9a441");
      for (var i = 0; i < NG; i++) for (var j = 0; j < NG; j++){
        var x = cell(i), z = cell(j), near = false;
        PROT.forEach(function(q){ if (prot.value && Math.hypot(q.x - x, q.z - z) < 0.4) near = true; });
        if (near) continue;
        [1, -1].forEach(function(s){
          sc.line([x - 0.05, s * 0.03, z], [x - 0.05, s * HH, z], 0.045, TAIL);
          sc.line([x + 0.05, s * 0.03, z], [x + 0.05, s * HH, z], 0.045, TAIL);
          sc.sphere([x, s * (HH + 0.06), z], 0.13, HEAD);
        });
      }
      if (prot.value) PROT.forEach(function(q){
        if (q.t === "car"){
          var col = q.busy > 0 ? B.hex("#b45309") : B.hex("#f97316");
          sc.sphere([q.x, 0.32, q.z], 0.26, col); sc.sphere([q.x, 0, q.z], 0.3, col); sc.sphere([q.x, -0.32, q.z], 0.26, col);
        } else {
          var col2 = q.t === "na" ? B.hex("#7c3aed") : B.hex("#0d9488");
          for (var a = 0; a < 6; a++){ var an = a * 1.047, rx = q.x + 0.2 * Math.cos(an), rz = q.z + 0.2 * Math.sin(an);
            sc.tube([rx, -0.38, rz], [rx, 0.38, rz], 0.075, col2); }
        }
      });
      P.forEach(function(p){ sc.sphere([p.x, p.y, p.z], tt.r, tt.c); });
      sc.label([0, 2.1, 0], "Milieu extracellulaire", "#0f1b2d", 11, 0, 0);
      sc.label([0, -2.1, 0], "Cytoplasme", "#0f1b2d", 11, 0, 0);
      sc.flush(); B.hint(c);
      var o = 0, d = 0; P.forEach(function(p){ if (p.y > 0) o++; else d++; });
      ro.set(0, o); ro.set(1, d); ro.set(2, ent); ro.set(3, sor);
      var t = sub.value, msg, kind = "";
      if (!prot.value && (t === "na" || t === "glu")){ msg = "Sans protéine, " + tt.n + " ne peut pas traverser la bicouche : aucune entrée possible, même avec un gradient."; kind = "warn"; }
      else if (t === "o2") msg = "O₂ glisse entre les phospholipides : diffusion simple, partout sur la membrane, jusqu'à égaliser les concentrations.";
      else if (t === "h2o") msg = "L'eau traverse un peu les lipides (lent) mais surtout par les aquaporines (vert-bleu) : diffusion facilitée.";
      else if (t === "na") msg = "Les ions chargés ne passent que par leurs canaux protéiques (violet). Compte les entrées : elles ne se font qu'à ces endroits.";
      else msg = "Le glucose passe par un transporteur (orange) qui se « repose » après chaque passage (couleur foncée) : le débit plafonne, c'est la saturation.";
      if (Math.abs(o - d) <= 4 && T > 4 && (prot.value || t === "o2")) msg += " L'équilibre est atteint : entrées et sorties continuent, en nombre à peu près égal.";
      nt.set(msg, kind);
    }
    k.draw(render);
    reset();
    var L = k.loop(function(dt){ B.spin(cam, dt, 0.25); step(dt); render(); });
    L.play();
  }
});
/*B3D-ADD-END:b4-3d-membrane*/
