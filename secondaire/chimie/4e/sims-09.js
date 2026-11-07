/* Chimie 4e · chapitre 9 · pH, acides et bases */
SFA.sim({
  id:"c4-c09-titrage", ch:"c09", tag:"Classique",
  titre:"Titrer un acide fort par la soude",
  resume:"Verse de la soude (0,100 mol/L) dans un acide : le pH saute au point d'équivalence et l'indicateur vire.",
  but:"Règle l'acide, choisis un indicateur coloré et verse la soude. Repère le saut de pH, note V_eq et calcule la concentration de l'acide.",
  aRetenir:"À l'équivalence, n(OH⁻ versés) = n(H₃O⁺ initiaux) : c_a · V_a = c_b · V_eq. Pour un acide fort et une base forte, pH = 7 à l'équivalence ; l'indicateur doit virer près de ce saut.",
  piege:"Le virage de l'indicateur n'est pas le point d'équivalence exact, mais il doit se produire dans le saut de pH (ici très raide). Un mauvais indicateur donne un V_eq décalé.",
  build:function(k, S){
    var c = k.canvas(330), cb = 0.1, KW = 1e-14;
    var ca = k.slider("c_a de l'acide (HCl)", 0.05, 0.20, 0.005, 0.1, "mol/L");
    var va = k.slider("Volume d'acide V_a", 10, 25, 1, 20, "mL");
    var IND = {bbt:["bleu de bromothymol", 6.0, 7.6, [240,200,40], [40,90,200]], php:["phénolphtaléine", 8.2, 10, [255,255,255], [225,40,140]], hel:["hélianthine", 3.1, 4.4, [225,50,50], [245,205,40]]};
    var ind = k.select("Indicateur", Object.keys(IND).map(function(x){ return [x, IND[x][0]]; }), "bbt");
    var vb = k.slider("Volume de soude versé V_b", 0, 60, 0.1, 0, "mL");
    var ro = k.readouts(["pH", "V_eq (théorique)", "c_a trouvée"]);
    var nt = k.note("", "");
    var st = {veq:null};
    k.button("Noter V_eq = V_b", function(){ st.veq = vb.value; }, true); k.button("Effacer", function(){ st.veq = null; });
    function pH(Vb){ var d = (ca.value * va.value - cb * Vb) / (va.value + Vb); var h = (d + Math.sqrt(d * d + 4 * KW)) / 2; return -Math.log10(h); }
    k.draw(function(){
      var veq = ca.value * va.value / cb, p = pH(vb.value), I = IND[ind.value];
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx;
      var ax = S.draw.axes(c, {x0:0, x1:60, y0:0, y1:14, xl:"V_b (mL)", yl:"pH", stepX:10, stepY:2, l:40});
      ctx.fillStyle = "rgba(244,197,66,.28)"; ctx.fillRect(ax.L, ax.Y(I[2]), ax.R - ax.L, ax.Y(I[1]) - ax.Y(I[2])); C4.tag(c, "zone de virage", ax.R - 6, ax.Y((I[1] + I[2]) / 2), "#7a5d00", 12, "right");
      ctx.strokeStyle = "#1f4b9e"; ctx.lineWidth = 3; ctx.beginPath(); for (var i = 0; i <= 600; i++){ var x = i / 10, y = pH(x); if (i) ctx.lineTo(ax.X(x), ax.Y(y)); else ctx.moveTo(ax.X(x), ax.Y(y)); } ctx.stroke();
      S.draw.dot(c, ax.X(vb.value), ax.Y(p), 7, "#c0321d");
      if (st.veq !== null){ S.draw.line(c, ax.X(st.veq), ax.B, ax.X(st.veq), ax.T, "#24775a", 2, [5, 4]); C4.tag(c, "V_eq noté : " + S.fmt(st.veq, 1) + " mL", ax.X(st.veq) + 4, ax.T + 14, "#24775a", 12, "left"); }
      /* bécher */
      var t = Math.max(0, Math.min(1, (p - I[1]) / (I[2] - I[1]))), col = "rgb(" + I[3].map(function(a, j){ return Math.round(a + (I[4][j] - a) * t); }).join(",") + ")";
      ctx.fillStyle = col; ctx.globalAlpha = 0.7; ctx.fillRect(ax.L + 60, 22, 54, 40); ctx.globalAlpha = 1; ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.strokeRect(ax.L + 60, 12, 54, 52); C4.label(c, "bécher", ax.L + 87, 76, "#5f6b7a", 11);
      ro.set(0, S.fmt(p, 2)); ro.set(1, S.fmt(veq, 1) + " mL"); ro.set(2, st.veq === null ? "—" : S.fmt(cb * st.veq / va.value, 3) + " mol/L");
      var okc = st.veq !== null && Math.abs(cb * st.veq / va.value - ca.value) / ca.value < 0.03;
      nt.set(st.veq === null ? "Verse la soude jusqu'au virage de couleur puis note V_eq. " + (vb.value < veq - 0.1 ? "Il reste de l'acide (pH < 7)." : vb.value > veq + 0.1 ? "Excès de soude (pH > 7)." : "On est à l'équivalence : pH ≈ 7.") : "c_a = c_b · V_eq / V_a = " + S.fmt(cb, 3) + " × " + S.fmt(st.veq, 1) + " / " + S.fmt(va.value, 0) + " = " + S.fmt(cb * st.veq / va.value, 3) + " mol/L (valeur réelle : " + S.fmt(ca.value, 3) + ").", okc ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"c4-c09-dilution-infinie", ch:"c09", tag:"Original",
  titre:"Diluer indéfiniment un acide : le pH ne dépasse jamais 7",
  resume:"Un acide très dilué tend vers pH 7 ; une base très diluée tend aussi vers pH 7 (par le haut).",
  but:"Fais varier la concentration sur plusieurs ordres de grandeur. Compare la formule naïve pH = −log c avec le pH réel.",
  aRetenir:"pH = −log [H₃O⁺]. Pour un acide fort, pH ≈ −log c tant que c ≫ 10⁻⁷ mol/L. Mais l'eau fournit elle-même 10⁻⁷ mol/L d'ions H₃O⁺ à 25 °C : en diluant à l'infini, le pH tend vers 7 sans jamais le dépasser.",
  piege:"Dire qu'une solution de HCl à 10⁻⁸ mol/L a pH = 8 est impossible : un acide, même dilué, ne devient jamais basique. Le pH réel vaut environ 6,98.",
  build:function(k, S){
    var c = k.canvas(300), KW = 1e-14;
    var md = k.seg("Soluté", [["a","Acide fort (HCl)"],["b","Base forte (NaOH)"]], "a");
    var pc = k.slider("pc = −log c", 0, 9, 0.1, 2, "");
    var ro = k.readouts(["c", "pH naïf", "pH réel", "[H₃O⁺] réelle"]);
    var nt = k.note("", "");
    function real(pcv, acid){ var cc = Math.pow(10, -pcv), h = acid ? (cc + Math.sqrt(cc * cc + 4 * KW)) / 2 : 2 * KW / (cc + Math.sqrt(cc * cc + 4 * KW)); return -Math.log10(h); }
    k.draw(function(){
      var ac = md.value === "a", pr = real(pc.value, ac), pn = ac ? pc.value : 14 - pc.value;
      c.clear(); C4.bg(c);
      var ax = S.draw.axes(c, {x0:0, x1:9, y0:0, y1:14, xl:"pc = −log c", yl:"pH", stepX:1, stepY:2, l:40});
      S.draw.fn(c, ax, function(x){ return ac ? x : 14 - x; }, "#b8c0cc", 2, [6, 4]);
      S.draw.fn(c, ax, function(x){ return real(x, ac); }, "#1f4b9e", 3);
      S.draw.line(c, ax.L, ax.Y(7), ax.R, ax.Y(7), "#24775a", 1.5, [4, 4]); C4.tag(c, "pH 7 (eau pure)", ax.R - 4, ax.Y(7) + (ac ? -10 : 12), "#24775a", 12, "right");
      C4.tag(c, "gris : pH naïf", ax.X(0.3), ax.Y(ac ? 12 : 2), "#5f6b7a", 12, "left"); C4.tag(c, "bleu : pH réel", ax.X(0.3), ax.Y(ac ? 11 : 3), "#1f4b9e", 12, "left");
      S.draw.dot(c, ax.X(pc.value), ax.Y(pr), 7, "#c0321d"); S.draw.dot(c, ax.X(pc.value), ax.Y(pn), 5, "#8a95a3");
      ro.set(0, S.sci(Math.pow(10, -pc.value), 2) + " mol/L"); ro.set(1, S.fmt(pn, 2)); ro.set(2, S.fmt(pr, 2)); ro.set(3, S.sci(Math.pow(10, -pr), 2) + " mol/L");
      nt.set(Math.abs(pr - pn) > 0.1 ? "Le pH naïf (" + S.fmt(pn, 1) + ") est faux" + ((ac ? pn > 7 : pn < 7) ? " : il passe de l'autre côté de 7, ce qui est impossible." : " : il s'écarte du pH réel.") + " Le pH réel reste du bon côté de 7 (" + S.fmt(pr, 2) + ")." : "À cette concentration, la formule simple est très bonne (écart < 0,1).", Math.abs(pr - pn) > 0.1 ? "warn" : "");
    });
    k.note("Hypothèses : 25 °C (K<sub>w</sub> = 10<sup>−14</sup>), acide ou base forts, solution aqueuse.", "");
  }
});

SFA.sim({
  id:"c4-c09-echelle", ch:"c09", tag:"Échelle",
  titre:"L'échelle logarithmique du pH",
  resume:"Chaque unité de pH correspond à un facteur 10 sur la concentration en ions H₃O⁺.",
  but:"Clique sur l'échelle ou glisse le curseur pour choisir deux pH, et compare combien de fois l'une est plus acide que l'autre.",
  aRetenir:"[H₃O⁺] = 10⁻ᵖᴴ mol/L. Passer de pH 3 à pH 2 multiplie [H₃O⁺] par 10 ; de pH 3 à pH 1, par 100. À 25 °C : [H₃O⁺]·[OH⁻] = 10⁻¹⁴, donc pH + pOH = 14.",
  piege:"pH 3 n'est pas « un peu plus acide » que pH 4 : c'est 10 fois plus de H₃O⁺. Et le pH n'est pas limité à 0–14 : un acide concentré peut avoir un pH négatif.",
  build:function(k, S){
    var c = k.canvas(260);
    var pa = k.slider("pH de A", -1, 15, 0.1, 2.5, ""), pb = k.slider("pH de B", -1, 15, 0.1, 7, "");
    var ro = k.readouts(["[H₃O⁺] de A", "[OH⁻] de A", "[H₃O⁺] de B", "A / B"]);
    var nt = k.note("", "ok");
    var ex = [[2, "citron ≈ 2"], [5, "café ≈ 5"], [7, "eau pure = 7"], [8, "eau de mer ≈ 8"], [10, "savon ≈ 10"], [12.5, "Javel ≈ 12,5"]];
    var cs = c;
    var curs = "a";
    c.pointer(function(type, p){ if (type === "up") return; var L = 20, R = c.W - 20, v = Math.round(((p.x - L) / (R - L) * 16 - 1) * 10) / 10; v = Math.max(-1, Math.min(15, v)); (p.y < 130 ? pa : pb).set(v); k.redraw(); });
    k.draw(function(){
      var A = pa.value, B = pb.value;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, L = 20, R = W - 20, X = function(v){ return L + (v + 1) / 16 * (R - L); };
      var gr = ctx.createLinearGradient(L, 0, R, 0); gr.addColorStop(0, "#e5484d"); gr.addColorStop(0.35, "#f4a640"); gr.addColorStop(0.5, "#46a758"); gr.addColorStop(0.75, "#3e9bd5"); gr.addColorStop(1, "#6236c4");
      ctx.fillStyle = gr; ctx.fillRect(L, 100, R - L, 24);
      for (var v = -1; v <= 15; v++){ S.draw.line(c, X(v), 124, X(v), 130, "#5f6b7a", 1); if (v % 2 === 1 || v === 0 || v === 14) C4.label(c, String(v).replace("-", "−"), X(v), 142, "#2c3a4e", 12); }
      C4.label(c, "acide ←", L + 24, 158, "#c0321d", 12); C4.label(c, "→ basique", R - 28, 158, "#6236c4", 12);
      ex.forEach(function(e, i){ var y = 90 - (i % 3) * 22; S.draw.line(c, X(e[0]), 100, X(e[0]), y + 8, "#8a95a3", 1); C4.tag(c, e[1], X(e[0]), y, "#2c3a4e", 12, "center"); });
      [[A, "A", "#c0321d", 30], [B, "B", "#1f4b9e", 190]].forEach(function(q){ S.draw.dot(c, X(q[0]), q[3] === 30 ? 112 : 112, 8, q[2]); C4.label(c, q[1] + " " + S.fmt(q[0], 1), X(q[0]), q[3] === 30 ? 178 : 198, q[2], 13); });
      var ratio = Math.pow(10, B - A);
      C4.label(c, A < B ? "A est " + C4.sciU(ratio, 2) + " fois plus acide que B" : A > B ? "B est " + C4.sciU(1 / ratio, 2) + " fois plus acide que A" : "A et B ont le même pH", W / 2, 232, "#1f4b9e", 13);
      ro.set(0, S.sci(Math.pow(10, -A), 2) + " mol/L"); ro.set(1, S.sci(Math.pow(10, A - 14), 2) + " mol/L"); ro.set(2, S.sci(Math.pow(10, -B), 2) + " mol/L"); ro.set(3, S.sci(Math.pow(10, B - A), 2));
      nt.set(A < 0 || A > 14 ? "pH hors de 0–14 : possible pour un acide ou une base concentrés (≥ 1 mol/L)." : A < 7 ? "A est acide (pH < 7) : [H₃O⁺] > [OH⁻]." : A > 7 ? "A est basique (pH > 7) : [OH⁻] > [H₃O⁺]." : "A est neutre : [H₃O⁺] = [OH⁻] = 10⁻⁷ mol/L. Neutre ne veut pas dire « sans ions ».", A < 0 || A > 14 ? "warn" : "ok");
    });
    k.note("Valeurs usuelles arrondies (≈), à 25 °C. Clique dans la moitié haute de l'échelle pour déplacer A, dans la moitié basse pour B (ou utilise les curseurs).", "");
  }
});

SFA.sim({
  id:"c4-c09-fort-faible", ch:"c09", tag:"Comparaison",
  titre:"Acide fort ou acide faible : même concentration, pH différent",
  resume:"HCl est entièrement ionisé ; l'acide éthanoïque ne l'est que très partiellement.",
  but:"Choisis une concentration. Compare les deux béchers : nombre d'ions, pH et conductivité (proportionnelle au nombre d'ions).",
  aRetenir:"Acide fort : toutes les molécules réagissent avec l'eau, [H₃O⁺] = c. Acide faible : seule une petite fraction réagit, [H₃O⁺] ≪ c. À même concentration, un acide faible a un pH plus élevé.",
  piege:"« Acide fort » ne veut pas dire « acide concentré ». Fort/faible concerne l'ionisation, concentré/dilué concerne la quantité dissoute. Un acide faible se dissocie davantage quand on le dilue.",
  build:function(k, S){
    var c = k.canvas(300), KA = 1.8e-5;
    var lg = k.slider("log₁₀ c (c = 10 puissance …)", -3, 0, 0.1, -1, "");
    var ro = k.readouts(["c", "pH de HCl", "pH de CH₃COOH", "[H₃O⁺] fort / faible"]);
    var nt = k.note("", "");
    k.draw(function(){
      var cc = Math.pow(10, lg.value), hS = cc, hW = (-KA + Math.sqrt(KA * KA + 4 * KA * cc)) / 2, al = hW / cc;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, bw = (W - 40) / 2, cell = Math.min(15, (bw - 10) / 10);
      [[10, "HCl (fort)", 1, hS], [20 + bw, "CH₃COOH (faible)", al, hW]].forEach(function(b, bi){
        var x0 = b[0], n = Math.round(b[2] * 100);
        ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.strokeRect(x0, 30, bw, cell * 10 + 12);
        for (var i = 0; i < 100; i++){ var cx = x0 + 8 + (i % 10) * cell + cell / 2, cy = 36 + Math.floor(i / 10) * cell + cell / 2;
          if (i < n){ S.draw.dot(c, cx - 3, cy, cell * 0.2, "#c0321d"); S.draw.dot(c, cx + 3, cy, cell * 0.2, "#24775a"); } else { S.draw.dot(c, cx, cy, cell * 0.3, "#8a95a3"); } }
        C4.label(c, b[1], x0 + bw / 2, 20, "#0f1b2d", 13);
        C4.label(c, S.fmt(-Math.log10(b[3]), 2), x0 + bw / 2, 30 + cell * 10 + 34, "#1f4b9e", 22); C4.label(c, "pH", x0 + bw / 2, 30 + cell * 10 + 56, "#5f6b7a", 12);
        C4.bar(c, x0, 30 + cell * 10 + 72, bw, 10, b[3] / cc * (bi ? 1 : 1) * Math.min(1, 1), bi ? "#8a95a3" : "#24775a");
        C4.label(c, "ions : " + S.fmt(b[3] * 1000, b[3] * 1000 < 1 ? 3 : 1) + " mmol/L", x0 + bw / 2, 30 + cell * 10 + 96, "#2c3a4e", 12);
      });
      C4.label(c, "gris : HA · rouge : H₃O⁺ · vert : anion", W / 2, 290, "#5f6b7a", 11);
      ro.set(0, S.sci(cc, 2) + " mol/L"); ro.set(1, S.fmt(-Math.log10(hS), 2)); ro.set(2, S.fmt(-Math.log10(hW), 2)); ro.set(3, S.fmt(hS / hW, 0) + " ×");
      nt.set("Acide éthanoïque : " + S.fmt(al * 100, al < 0.1 ? 1 : 0) + " % des molécules sont ionisées. HCl : 100 %. L'acide faible est d'autant plus ionisé qu'il est dilué.", "");
    });
    k.note("Pour calculer le pH de l'acide éthanoïque, on utilise la constante K<sub>a</sub> = 1,8·10<sup>−5</sup> (donnée hors programme, juste pour le calcul de la simulation).", "");
  }
});
