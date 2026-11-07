/* Chapitre 8 · Piles et potentiels standards */
(function(){
function gcd(a, b){ return b ? gcd(b, a % b) : a; }
var MET = [
  {s: "Mg", ion: "Mg²⁺", E: -2.37, n: 2, M: 24},
  {s: "Al", ion: "Al³⁺", E: -1.66, n: 3, M: 27},
  {s: "Zn", ion: "Zn²⁺", E: -0.76, n: 2, M: 65},
  {s: "Fe", ion: "Fe²⁺", E: -0.44, n: 2, M: 56},
  {s: "Pb", ion: "Pb²⁺", E: -0.13, n: 2, M: 207},
  {s: "Cu", ion: "Cu²⁺", E: 0.34, n: 2, M: 63.5},
  {s: "Ag", ion: "Ag⁺", E: 0.80, n: 1, M: 108}
];
SFA.sim({
  id: "c6-c08-pile", ch: "c08", tag: "Classique",
  titre: "Une pile : deux demi-piles, un pont salin, un voltmètre",
  resume: "Associe deux métaux : lis la f.é.m., le sens des électrons et des ions, et vois les électrodes s'user ou grossir.",
  but: "Choisis deux couples métal/ion. Le métal le moins noble est l'anode (−). Enlève le pont salin pour voir le circuit s'arrêter. Fais avancer la pile avec le curseur.",
  aRetenir: "Anode (−) : oxydation, le métal au plus petit E° perd des électrons. Cathode (+) : réduction, le cation du couple au plus grand E° capte des électrons. f.é.m. = E°(cathode) − E°(anode). Les électrons circulent dans le fil de l'anode vers la cathode ; dans le pont salin, les ions circulent (anions vers l'anode, cations vers la cathode) et ferment le circuit.",
  piege: "Les électrons ne traversent pas la solution ni le pont salin : ce sont les ions qui y passent. Et la f.é.m. ne dépend pas de la taille des électrodes ni de la quantité de solution (conditions standards), mais la durée de fonctionnement, oui.",
  build: function(k, S){
    var c = k.canvas(350), P = S.draw.palette, t = 0;
    var a = k.select("Couple 1", MET.map(function(m, i){ return [i, m.ion + "/" + m.s + " (" + S.fmt(m.E, 2) + " V)"]; }), 2);
    var b = k.select("Couple 2", MET.map(function(m, i){ return [i, m.ion + "/" + m.s + " (" + S.fmt(m.E, 2) + " V)"]; }), 5);
    var pont = k.toggle("Pont salin en place", true);
    var ne = k.slider("Électrons échangés (durée de fonctionnement)", 0, 20, 1, 5, "mmol");
    var ro = k.readouts(["f.é.m.", "Notation de la pile", "Δm de l'anode (−)", "Δm de la cathode (+)"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    function beaker(x, y, w, h, col, lab, metal, sign){
      var ctx = c.ctx;
      ctx.fillStyle = col; ctx.fillRect(x, y + 30, w, h - 30); ctx.strokeStyle = P.ink; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y); ctx.stroke();
      ctx.fillStyle = "#9aa5b1"; ctx.fillRect(x + w / 2 - 8, y - 22, 16, h - 6); ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x + w / 2 - 8, y - 22, 16, h - 6);
      S.draw.text(c, lab, x + w / 2, y + h + 16, {size: 13, color: P.ink});
      S.draw.text(c, metal + " (" + sign + ")", x + w / 2, y + 60, {size: 13, color: P.ink, bg: "rgba(255,255,255,.8)"});
    }
    k.draw(function(){
      c.clear();
      var A = MET[a.value], B = MET[b.value], ctx = c.ctx;
      if (A === B){ S.draw.text(c, "Choisis deux couples différents.", c.W / 2, c.H / 2, {size: 15, color: P.red}); nt.set("Une pile a besoin de deux couples différents.", "warn"); ro.set(0, "0"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); return; }
      var lo = A.E < B.E ? A : B, hi = A.E < B.E ? B : A, fem = hi.E - lo.E;
      var L = lo.n * hi.n / gcd(lo.n, hi.n), nlo = L / lo.n, nhi = L / hi.n;
      var bw = Math.min(150, (c.W - 90) / 2.2), by = 132, bh = 150, xl = 24, xr = c.W - 24 - bw;
      beaker(xl, by, bw, bh, "rgba(120,170,230,.22)", "solution de " + lo.ion, lo.s, "−", "");
      beaker(xr, by, bw, bh, "rgba(120,170,230,.22)", "solution de " + hi.ion, hi.s, "+", "");
      /* fil */
      var yw = 76, x1 = xl + bw / 2, x2 = xr + bw / 2;
      S.draw.line(c, x1, by - 22, x1, yw, P.ink, 2); S.draw.line(c, x1, yw, x2, yw, P.ink, 2); S.draw.line(c, x2, yw, x2, by - 22, P.ink, 2);
      var vx = c.W / 2, vy = yw;
      ctx.fillStyle = "#fff"; ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(vx, vy, 20, 0, 7); ctx.fill(); ctx.stroke();
      S.draw.text(c, pont.value ? "V" : "0", vx, vy, {size: 15, color: P.ink});
      S.draw.text(c, pont.value ? S.fmt(fem, 2) + " V" : "0 V (ouvert)", vx, vy - 34, {size: 14, color: pont.value ? P.green : P.red});
      /* électrons */
      if (pont.value){
        var path = [[x1, by - 22], [x1, yw], [vx - 20, yw], [vx + 20, yw], [x2, yw], [x2, by - 22]], tot = 0, segs = [], i;
        for (i = 0; i < path.length - 1; i++){ var d = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); segs.push(d); tot += d; }
        for (var j = 0; j < 9; j++){
          var s = ((t * 60 + j * tot / 9) % tot), q = 0;
          for (i = 0; i < segs.length; i++){ if (s <= q + segs[i]){ var f = (s - q) / segs[i]; if (!(i === 2)) S.draw.dot(c, path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f, 3.6, P.acc); break; } q += segs[i]; }
        }
        S.draw.text(c, "e⁻ →", x1 + 40, yw - 12, {size: 12, color: P.acc});
      }
      /* pont salin */
      var py = by + 8;
      ctx.save(); ctx.strokeStyle = pont.value ? P.amber : P.light; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(xl + bw - 24, by + 40); ctx.lineTo(xl + bw - 24, py); ctx.lineTo(xr + 24, py); ctx.lineTo(xr + 24, by + 40); ctx.stroke(); ctx.restore();
      if (pont.value){ S.draw.text(c, "pont salin", c.W / 2, py - 14, {size: 12, color: P.amber}); S.draw.text(c, "← anions", c.W / 2 - 18, py + 18, {size: 12, color: P.red}); S.draw.text(c, "cations →", c.W / 2 + 22, py + 36, {size: 12, color: P.acc}); }
      S.draw.text(c, "ANODE (−)", xl + bw / 2, 12, {size: 12, color: P.red}); S.draw.text(c, "CATHODE (+)", xr + bw / 2, 12, {size: 12, color: P.green});
      var dlo = pont.value ? -ne.value * (1 / lo.n) * lo.M : 0, dhi = pont.value ? ne.value * (1 / hi.n) * hi.M : 0;
      ro.set(0, pont.value ? S.fmt(fem, 2) + " V" : "0 V (ouvert)"); ro.set(1, "(−) " + lo.s + " | " + lo.ion + " ‖ " + hi.ion + " | " + hi.s + " (+)");
      ro.set(2, S.fmt(dlo, 0) + " mg"); ro.set(3, (dhi >= 0 ? "+" : "") + S.fmt(dhi, 0) + " mg");
      nt.set(pont.value ? (nlo > 1 ? nlo + " " : "") + lo.s + " + " + (nhi > 1 ? nhi + " " : "") + hi.ion + " → " + (nlo > 1 ? nlo + " " : "") + lo.ion + " + " + (nhi > 1 ? nhi + " " : "") + hi.s + " (" + L + " e⁻ échangés ; f.é.m. = " + S.fmt(hi.E, 2) + " − (" + S.fmt(lo.E, 2) + ") = " + S.fmt(fem, 2) + " V)" : "Sans pont salin, les ions ne peuvent plus circuler : le circuit est ouvert, aucun courant, aucune usure.", pont.value ? "ok" : "warn");
    });
  }
});

var CPL = [
  {s: "Li⁺/Li", E: -3.04}, {s: "Mg²⁺/Mg", E: -2.37}, {s: "Al³⁺/Al", E: -1.66}, {s: "Zn²⁺/Zn", E: -0.76}, {s: "Fe²⁺/Fe", E: -0.44}, {s: "Ni²⁺/Ni", E: -0.26},
  {s: "Pb²⁺/Pb", E: -0.13}, {s: "H⁺/H₂", E: 0.00}, {s: "Cu²⁺/Cu", E: 0.34}, {s: "Ag⁺/Ag", E: 0.80}, {s: "Au³⁺/Au", E: 1.50}
];
SFA.sim({
  id: "c6-c08-echelle", ch: "c08", tag: "Défi",
  titre: "L'échelle des potentiels : construis la pile qu'on te demande",
  resume: "Clique sur deux couples de l'échelle : la f.é.m. est la différence. Atteins la valeur cible.",
  but: "Clique sur deux points de l'échelle (ou utilise les listes). Le plus bas est l'anode, le plus haut la cathode. Choisis une f.é.m. cible et trouve la bonne paire.",
  aRetenir: "Plus l'écart entre deux couples est grand, plus la pile est puissante : f.é.m. = E°(haut) − E°(bas). Sur l'échelle, un oxydant réagit spontanément avec tout réducteur situé plus bas (règle du « gamma »). L'électrode standard à hydrogène (H⁺/H₂) est la référence, à 0,00 V.",
  piege: "Ne dis pas « E° plus petit = pile plus faible » : seule la différence compte. Et deux couples proches (Zn²⁺/Zn et Fe²⁺/Fe : 0,32 V) donnent une pile très faible, même s'ils sont tous deux négatifs. Valeurs de E° arrondies à 0,01 V (25 °C, conditions standards).",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette;
    var sa = k.select("Couple A", CPL.map(function(p, i){ return [i, p.s + " (" + S.fmt(p.E, 2) + " V)"]; }), 3);
    var sb = k.select("Couple B", CPL.map(function(p, i){ return [i, p.s + " (" + S.fmt(p.E, 2) + " V)"]; }), 8);
    var tg = k.select("Défi : f.é.m. visée", [["", "— libre —"], ["1.10", "≈ 1,10 V"], ["1.56", "≈ 1,56 V"], ["0.78", "≈ 0,78 V"], ["0.63", "≈ 0,63 V"], ["0.94", "≈ 0,94 V"]], "");
    var ro = k.readouts(["f.é.m.", "Anode (−)", "Cathode (+)", "Réaction spontanée"]);
    var nt = k.note("", "ok");
    var turn = 0, ax0 = null;
    c.pointer(function(t, p){
      if (t !== "down" || !ax0) return;
      var best = -1, bd = 1e9; CPL.forEach(function(q, i){ var d = Math.abs(ax0.Y(q.E) - p.y); if (d < bd){ bd = d; best = i; } });
      if (bd > 18) return;
      if (turn % 2 === 0) sa.set(best); else sb.set(best);
      turn++; k.redraw();
    });
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 1, y0: -3.4, y1: 1.8, stepX: 10, stepY: 0.5, yl: "E° (V)", grid: true, l: 52}); ax0 = ax;
      var A = CPL[sa.value], B = CPL[sb.value];
      CPL.forEach(function(q, i){
        var sel = (i === +sa.value || i === +sb.value), xe = i % 2 === 0 ? 0.30 : 0.58;
        S.draw.line(c, ax.X(0.08), ax.Y(q.E), ax.X(xe), ax.Y(q.E), sel ? P.green : P.grey, sel ? 3 : 1.6);
        S.draw.dot(c, ax.X(xe), ax.Y(q.E), sel ? 7 : 4, sel ? P.green : P.grey);
        S.draw.text(c, q.s.split("/")[1] + " " + S.fmt(q.E, 2), ax.X(xe) + 8, ax.Y(q.E), {size: 12, align: "left", color: sel ? P.green : P.ink});
      });
      if (A !== B){
        var hi = A.E > B.E ? A : B, lo = A.E > B.E ? B : A, fem = hi.E - lo.E;
        S.draw.arrow(c, ax.X(0.97), ax.Y(lo.E), ax.X(0.97), ax.Y(hi.E) + 6, P.red, 2.4);
        S.draw.text(c, "f.é.m. = " + S.fmt(fem, 2) + " V", c.W / 2, 14, {size: 13, color: P.red});
        ro.set(0, S.fmt(fem, 2) + " V"); ro.set(1, lo.s.split("/")[1]); ro.set(2, hi.s.split("/")[1] + " (cation " + hi.s.split("/")[0] + " réduit)"); ro.set(3, "oxydant " + hi.s.split("/")[0] + " + réducteur " + lo.s.split("/")[1]);
        if (tg.value){ var ok = Math.abs(fem - parseFloat(tg.value)) <= 0.02; nt.set(ok ? "Gagné : " + S.fmt(fem, 2) + " V avec " + lo.s + " et " + hi.s + "." : "Pas encore : tu as " + S.fmt(fem, 2) + " V, il faut ≈ " + S.fmt(parseFloat(tg.value), 2) + " V. Essaie une autre paire.", ok ? "ok" : "warn"); }
        else nt.set("Clique sur deux points de l'échelle : le plus haut est cathode, le plus bas est anode.", "ok");
      } else { ro.set(0, "0 V"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); nt.set("Même couple : pas de pile.", "warn"); }
    });
  }
});

var CNC = 0.0592 / 2;   /* RT ln10 / nF à 25 °C pour n = 2, en V (valeur arrondie) */
SFA.sim({
  id: "c6-c08-nernst", ch: "c08", tag: "Graphes",
  titre: "Une pile s'use : la tension dépend des concentrations",
  resume: "Fais débiter la pile : les concentrations changent et la tension baisse. Pile de concentration ou pile Daniell.",
  but: "Choisis le type de pile et les concentrations, puis fais avancer la décharge. Observe la tension : elle tombe à 0 pour la pile de concentration.",
  aRetenir: "Quand la pile débite, les concentrations évoluent et la tension diminue. Pour une pile de concentration (même métal des deux côtés), E = 0,030·log(c<sub>élevée</sub>/c<sub>faible</sub>) pour Cu²⁺ (0,0592/2 à 25 °C) : la pile s'arrête quand les concentrations s'égalisent. Pour la pile Daniell : E = 1,10 − 0,030·log([Zn²⁺]/[Cu²⁺]) : E reste proche de 1,0 V jusqu'à l'épuisement de Cu²⁺.",
  piege: "Pour une pile Daniell, la f.é.m. standard (1,10 V) n'est valable que pour des concentrations de 1 mol/L. La pile est « à plat » quand E = 0 (équilibre), c'est-à-dire pour Q = K ≈ 10³⁷, quasi jamais atteint avant épuisement de Cu²⁺. Équation de Nernst (hors programme strict), coefficient 0,0592 V à 25 °C arrondi.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var md = k.seg("Pile", [["c", "De concentration (Cu | Cu²⁺)"], ["d", "Daniell (Zn | Cu)"]], "c");
    var pa = k.slider("Compartiment 1 : pc (c = 10^−pc)", 0, 3, 0.1, 0, "");
    var pb = k.slider("Compartiment 2 : pc (c = 10^−pc)", 0, 3, 0.1, 2, "");
    var av = k.slider("Avancement de la décharge", 0, 100, 1, 0, "%");
    var ro = k.readouts(["Concentrations", "Tension E", "Q"]);
    var nt = k.note("", "ok");
    function Eof(mode, c1, c2, f){
      if (mode === "c"){ var hiC = Math.max(c1, c2), loC = Math.min(c1, c2), xi = (hiC - loC) / 2 * f; return {E: CNC * Math.log10((hiC - xi) / (loC + xi)), a: hiC - xi, b: loC + xi}; }
      /* Daniell : c1 = [Zn²⁺], c2 = [Cu²⁺] ; f (0..1) part de Cu²⁺ consommée */
      var xz = c2 * f, zn = c1 + xz, cu = c2 - xz; return {E: 1.10 - CNC * Math.log10(zn / cu), a: zn, b: cu};
    }
    k.draw(function(){
      c.clear();
      var mode = md.value, c1 = Math.pow(10, -pa.value), c2 = Math.pow(10, -pb.value);
      var fmap = function(s){ return mode === "c" ? s / 100 : 1 - Math.pow(10, -s / 25); };
      var ax = S.draw.axes(c, {x0: 0, x1: 100, y0: mode === "c" ? 0 : 0.8, y1: mode === "c" ? Math.max(0.1, CNC * Math.abs(Math.log10(c1 / c2)) * 1.15 + 0.01) : 1.2, stepX: 20, xl: "avancement / %", yl: "E (V)"});
      S.draw.fn(c, ax, function(s){ if (mode === "c" && c1 === c2) return 0; var r = Eof(mode, c1, c2, fmap(s)); return r.E; }, P.green, 3);
      var r = Eof(mode, c1, c2, fmap(av.value));
      S.draw.dot(c, ax.X(av.value), ax.Y(r.E), 6, P.red);
      if (mode === "c"){
        ro.set(0, S.sci(r.a, 2) + " et " + S.sci(r.b, 2) + " mol/L"); ro.set(1, S.fmt(r.E, 3) + " V"); ro.set(2, S.fmt(r.a / r.b, 2));
        nt.set(c1 === c2 ? "Concentrations égales au départ : tension nulle, la pile ne débite pas." : av.value === 100 ? "Concentrations égalisées : E = 0, la pile est usée." : "Le compartiment concentré perd du cuivre en solution (cathode), le dilué en gagne : la tension baisse.", "ok");
      } else {
        ro.set(0, "[Zn²⁺] = " + S.sci(r.a, 2) + " · [Cu²⁺] = " + S.sci(r.b, 2)); ro.set(1, S.fmt(r.E, 3) + " V"); ro.set(2, S.sci(r.a / r.b, 2));
        nt.set("Compartiment 1 = Zn²⁺, compartiment 2 = Cu²⁺. Part de Cu²⁺ consommée : " + S.fmt(fmap(av.value) * 100, 3) + " %. E reste proche de 1,0 V ; elle ne chute que quand Cu²⁺ est presque épuisé.", "ok");
      }
    });
  }
});

var LED = [["1.8", "Rouge (≈ 1,8 V)"], ["2.1", "Verte (≈ 2,1 V)"], ["3.0", "Bleue (≈ 3,0 V)"]];
SFA.sim({
  id: "c6-c08-citron", ch: "c08", tag: "Dans la vraie vie",
  titre: "La pile au citron : combien de citrons pour allumer une LED ?",
  resume: "Tension et intensité ne sont pas la même chose : compare des citrons en série et en parallèle.",
  but: "Règle le nombre de citrons, le montage (série ou parallèle), la taille des électrodes et la couleur de la LED. Clique sur un citron pour en ajouter. Le graphe montre l'intensité en fonction du nombre de citrons.",
  aRetenir: "En série, les f.é.m. s'additionnent (n × E), mais les résistances internes aussi. En parallèle, la tension reste celle d'un seul citron, mais l'intensité fournie augmente. Une LED ne s'allume que si la tension dépasse son seuil (rouge ≈ 1,8 V) ET si l'intensité est suffisante (quelques dixièmes de mA au moins).",
  piege: "Beaucoup de tension ne suffit pas : un citron produit une très faible intensité (forte résistance interne). Modèle simplifié, valeurs typiques d'ordre de grandeur : f.é.m. d'un citron Zn–Cu ≈ 0,9 V (inférieure aux 1,10 V standards), résistance interne ≈ 1,5 kΩ (petites électrodes) ou 300 Ω (grandes).",
  build: function(k, S){
    var c = k.canvas(490), P = S.draw.palette, H = window.C6, tt = 0;
    var n = k.slider("Nombre de citrons", 1, 8, 1, 3, "");
    var mon = k.seg("Montage", [["s", "En série"], ["p", "En parallèle"]], "s");
    var el = k.seg("Électrodes", [["0.9", "Zn–Cu"], ["0.5", "Fe–Cu"]], "0.9");
    var tl = k.seg("Taille", [["1500", "Petites"], ["300", "Grandes"]], "1500");
    var le = k.select("LED", LED, "1.8");
    var ro = k.readouts(["f.é.m. du montage", "Résistance interne", "Intensité", "LED"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    c.pointer(function(type, p){ if (type === "down" && p.y > 95 && p.y < 175){ n.set(n.value >= 8 ? 1 : n.value + 1); k.redraw(); } });
    function I(nn, m){ var E = parseFloat(el.value), r = parseFloat(tl.value), Vf = parseFloat(le.value), Rd = 20;
      var Et = m === "s" ? nn * E : E, rt = m === "s" ? nn * r : r / nn; return Et > Vf ? (Et - Vf) / (rt + Rd) * 1000 : 0; }
    var LEDC = {"1.8": [255, 70, 50], "2.1": [60, 220, 90], "3.0": [70, 130, 255]};
    function wire(pts, col, w){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col || "#2c3a4e"; ctx.lineWidth = w || 2.4; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore(); }
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eef2f7"});
      var N = n.value, E = parseFloat(el.value), r = parseFloat(tl.value), Vf = parseFloat(le.value), ctx = c.ctx, i, ser = mon.value === "s";
      var Et = ser ? N * E : E, rt = ser ? N * r : r / N, Iv = I(N, mon.value), on = Iv > 0.15;
      var xL = c.W - 34, w = Math.min(52, (c.W - 96) / N), x0 = 18 + w / 2, yc = 134, topR = 56, botR = 212, stubT = 98, stubB = 172, X = function(j){ return x0 + j * w * 1.02; };
      /* fils (sous les citrons) */
      var xs = []; for (i = 0; i < N; i++) xs.push(X(i));
      if (ser){
        for (i = 0; i < N - 1; i++){ var gx = (xs[i] + xs[i + 1]) / 2 + w * 0.02; wire([[xs[i] + 9, stubT], [xs[i] + 9, 86], [gx, 86], [gx, 190], [xs[i + 1] - 9, 190], [xs[i + 1] - 9, stubB]]); }
        wire([[xs[N - 1] + 9, stubT], [xs[N - 1] + 9, topR], [xL, topR], [xL, yc - 18]]); wire([[xs[0] - 9, stubB], [xs[0] - 9, botR], [xL, botR], [xL, yc + 18]]);
      } else {
        wire([[xs[0] + 9, topR], [xL, topR], [xL, yc - 18]]); wire([[xs[0] - 9, botR], [xL, botR], [xL, yc + 18]]);
        for (i = 0; i < N; i++){ wire([[xs[i] + 9, stubT], [xs[i] + 9, topR]]); wire([[xs[i] - 9, stubB], [xs[i] - 9, botR]]); }
      }
      /* citrons + électrodes */
      for (i = 0; i < N; i++){
        var lx = xs[i], gl = ctx.createRadialGradient(lx - w * 0.15, yc - 12, 4, lx, yc, w * 0.6); gl.addColorStop(0, "#fbf07a"); gl.addColorStop(1, "#e2c21c");
        ctx.save(); ctx.shadowColor = "rgba(15,27,45,.22)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; ctx.fillStyle = gl; ctx.beginPath(); ctx.ellipse(lx, yc, w / 2, 30, 0, 0, 7); ctx.fill(); ctx.restore();
        ctx.strokeStyle = "#b8a000"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(lx, yc, w / 2, 30, 0, 0, 7); ctx.stroke();
        S.draw.rrect(c, lx + 5, stubT - 4, 8, 44, 3); ctx.fillStyle = "#c46a3c"; ctx.fill(); S.draw.rrect(c, lx - 13, yc - 6, 8, 46, 3); ctx.fillStyle = el.value === "0.9" ? "#9aa5b1" : "#7c6a5c"; ctx.fill();
      }
      S.draw.legend(c, [["#c46a3c", "électrode de cuivre (+)"], [el.value === "0.9" ? "#9aa5b1" : "#7c6a5c", el.value === "0.9" ? "électrode de zinc (−)" : "électrode de fer (−)"]], 14, 224, {});
      /* LED */
      var lc = LEDC[le.value], glow = Math.min(1, Iv / 2);
      if (on) S.draw.glow(c, xL, yc, 22 + 40 * glow, "rgb(" + lc.join(",") + ")", 0.35 + 0.6 * glow);
      ctx.save(); ctx.beginPath(); ctx.arc(xL, yc, 13, 0, 7); ctx.fillStyle = on ? "rgb(" + lc.map(function(v){ return Math.round(v + (255 - v) * glow * 0.6); }).join(",") + ")" : "rgba(" + lc.join(",") + ",.28)"; ctx.fill(); ctx.strokeStyle = "#2c3a4e"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      S.draw.text(c, "LED", xL, yc + 32, {size: 11, color: P.grey, weight: 800});
      /* courant */
      if (on) for (i = 0; i < 6; i++){ var u = (tt * 0.45 * Math.min(1.5, 0.4 + Iv) + i / 6) % 1, span = xL - (xs[N - 1] + 9); S.draw.dot(c, xs[N - 1] + 9 + u * span, topR, 3, "#f4c542"); }
      S.draw.text(c, N + " citron" + (N > 1 ? "s" : "") + " " + (ser ? "en série" : "en parallèle") + " · " + S.fmt(Et, 2) + " V", 14, 20, {size: 13, color: P.ink, align: "left", weight: 800});
      S.draw.text(c, on ? "LED allumée" : Et <= Vf ? "tension trop faible" : "courant trop faible", c.W - 14, 20, {size: 12, color: on ? P.green : P.red, align: "right", weight: 800});
      /* graphe I(n) */
      var ax = S.draw.axes(c, {x0: 0.5, x1: 8.5, y0: 0, y1: 3, stepX: 1, stepY: 0.5, xl: "nombre de citrons", yl: "I (mA)", t: 276, b: 36});
      S.draw.fn(c, ax, function(x){ return I(Math.max(1, Math.round(x)), "s"); }, P.acc, 2.4);
      S.draw.fn(c, ax, function(x){ return I(Math.max(1, Math.round(x)), "p"); }, P.amber, 2.4, [6, 4]);
      S.draw.legend(c, [[P.acc, "série"], [P.amber, "parallèle", true]], ax.R - 6, ax.T + 4, {align: "right"});
      S.draw.line(c, ax.L, ax.Y(0.3), ax.R, ax.Y(0.3), P.light, 1.3, [4, 3]); S.draw.text(c, "seuil visible ≈ 0,3 mA", ax.L + 6, ax.Y(0.3) - 8, {size: 12, color: P.grey, align: "left"});
      S.draw.dot(c, ax.X(N), ax.Y(Math.min(3, Iv)), 6, P.red);
      ro.set(0, S.fmt(Et, 2) + " V"); ro.set(1, S.fmt(rt, 0) + " Ω"); ro.set(2, S.fmt(Iv, 2) + " mA"); ro.set(3, Et <= Vf ? "éteinte (tension < seuil)" : Iv < 0.3 ? "à peine visible" : Iv < 1.5 ? "faible" : "bien allumée");
      nt.set(Et <= Vf ? "La tension totale (" + S.fmt(Et, 2) + " V) est inférieure au seuil de la LED (" + S.fmt(Vf, 1) + " V) : aucun courant." : "Intensité : I = (" + S.fmt(Et, 2) + " − " + S.fmt(Vf, 1) + ") / (" + S.fmt(rt, 0) + " + 20) = " + S.fmt(Iv, 2) + " mA.", "ok");
    });
  }
});
})();
