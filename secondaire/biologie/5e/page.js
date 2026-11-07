/* Biologie · 5e secondaire (sciences générales) : aides communes puis description de la page */
window.B5 = (function(){
  var B = {};
  B.cl = function(x, a, b){ return Math.max(a, Math.min(b, x)); };
  B.interp = function(t, x){            /* interpolation linéaire dans [[x,y],…] (x croissant) */
    if (x <= t[0][0]) return t[0][1];
    for (var i = 1; i < t.length; i++){ if (x <= t[i][0]){ var a = t[i-1], b = t[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } }
    return t[t.length - 1][1];
  };
  B.g = function(x, mu, s){ return Math.exp(-0.5 * Math.pow((x - mu) / s, 2)); };
  B.rng = function(seed){ var s = seed >>> 0 || 1; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  B.poly = function(c, ax, pts, col, w, dash){
    var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); ctx.clip();
    ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; if (dash) ctx.setLineDash(dash); ctx.beginPath();
    pts.forEach(function(p, i){ var X = ax.X(p[0]), Y = ax.Y(p[1]); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
    ctx.stroke(); ctx.restore();
  };
  B.bar = function(c, x, y, w, h, frac, col, bg){
    var ctx = c.ctx; ctx.fillStyle = bg || "#e3e7ed"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = col; ctx.fillRect(x, y, w * B.cl(frac, 0, 1), h);
  };
  B.leg = function(c, items, x, y){
    var ctx = c.ctx, px = x, py = y;
    ctx.save(); ctx.font = "700 12px Mulish, system-ui, sans-serif";
    items.forEach(function(it){
      var wd = 28 + ctx.measureText(it[0]).width;
      if (px + wd > c.W - 6 && px > x){ px = x; py += 16; }
      ctx.fillStyle = it[1]; ctx.fillRect(px, py - 5, 14, 4);
      ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(it[0], px + 19, py - 3); px += wd;
    });
    ctx.restore();
  };
  B.rect = function(c, x, y, w, h, fill, stroke, lw){
    var ctx = c.ctx; if (fill){ ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
    if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.strokeRect(x, y, w, h); }
  };
  B.circ = function(c, x, y, r, fill, stroke, lw){
    var ctx = c.ctx; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); }
  };
  B.sci = function(x, d){                                /* notation scientifique en texte brut (canvas) */
    if (!isFinite(x) || x === 0) return String(x);
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e), sup = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"};
    if (e >= -2 && e <= 3) return SFA.fmt(x, d === undefined ? 0 : d);
    return SFA.fmt(m, d === undefined ? 1 : d) + "×10" + String(e).split("").map(function(ch){ return sup[ch]; }).join("");
  };
  B.wrap = function(c, text, x, y, maxW, lh, opt){      /* texte sur plusieurs lignes dans un canvas */
    var ctx = c.ctx; opt = opt || {}; ctx.save(); ctx.font = (opt.weight || 700) + " " + (opt.size || 12) + "px Mulish, system-ui, sans-serif"; ctx.fillStyle = opt.color || "#0f1b2d"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    var words = text.split(" "), line = "", yy = y;
    words.forEach(function(w){ var t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line){ ctx.fillText(line, x, yy); yy += lh; line = w; } else line = t; });
    if (line) ctx.fillText(line, x, yy); ctx.restore(); return yy;
  };
  return B;
})();

/* Les textes de canvas s'adaptent à la largeur disponible (téléphone) : réduction à 12 px puis retour à la ligne. */
(function(){
  var orig = SFA.draw.text;
  SFA.draw.text = function(c, s, x, y, opt){
    opt = opt || {}; var ctx = c.ctx, size = opt.size || 13, al = opt.align || "center";
    function setf(sz){ ctx.font = (opt.weight || 700) + " " + sz + "px " + (opt.math ? "'STIX Two Text', serif" : "Mulish, system-ui, sans-serif"); }
    var avail = opt.maxW || (al === "left" ? c.W - x - 6 : al === "right" ? x - 6 : 2 * Math.min(x, c.W - x) - 8);
    avail = Math.max(avail, 60);
    ctx.save(); setf(size); var w = ctx.measureText(s).width;
    if (w <= avail || opt.bg){ ctx.restore(); return orig.call(this, c, s, x, y, opt); }
    var o2 = {}, k; for (k in opt) o2[k] = opt[k]; o2.size = Math.min(size, 12); setf(12);
    if (ctx.measureText(s).width <= avail){ ctx.restore(); return orig.call(this, c, s, x, y, o2); }
    var words = String(s).split(" "), lines = [], line = "";
    words.forEach(function(wd){ var t = line ? line + " " + wd : wd; if (ctx.measureText(t).width > avail && line){ lines.push(line); line = wd; } else line = t; });
    if (line) lines.push(line); ctx.restore();
    var lh = 15, y0 = (o2.base === "top" ? y : y - (lines.length - 1) * lh / 2);
    lines.forEach(function(ln, i){ orig.call(this, c, ln, x, y0 + i * lh, o2); }, this);
  };
})();

SFA.page({
  matiere: "biologie",
  titre: "Biologie · 5e secondaire (sciences générales)",
  kicker: "Secondaire · FWB · sciences générales",
  intro: "Dix chapitres sur la régulation, les défenses, l'excrétion et la reproduction : 40 simulations quantitatives à piloter (courbes, modèles, animations, défis) et des exercices corrigés pas à pas, du ★ au ★★★★★. Les modèles sont volontairement simplifiés et annoncés comme tels.",
  base: "../../",
  chapitres: [
    {id:"c01", num:1, titre:"Neurone, influx nerveux et système nerveux",
     resume:"Le neurone ne transporte pas un courant dans un fil : il propage un potentiel d'action, tout ou rien, grâce à des canaux ioniques. La myéline accélère l'influx de plus de dix fois.",
     attendus:"Structure d'un neurone ; potentiel de repos et potentiel d'action (aperçu) ; loi du tout-ou-rien, seuil, période réfractaire ; conduction continue et saltatoire ; système nerveux central et périphérique."},
    {id:"c02", num:2, titre:"Synapse, réflexe et intégration nerveuse",
     resume:"Les neurones ne se touchent pas : un neurotransmetteur traverse la fente synaptique. Le neurone postsynaptique additionne les messages excitateurs et inhibiteurs avant de décider. Le réflexe est plus rapide que l'acte volontaire car il court-circuite l'encéphale.",
     attendus:"Transmission synaptique chimique ; sommation spatiale et temporelle ; arc réflexe ; distinction réflexe / acte volontaire ; action de substances (drogues, médicaments) sur la synapse."},
    {id:"c03", num:3, titre:"Hormones, rétrocontrôle et glycémie",
     resume:"Une hormone est un message chimique envoyé par le sang à des cellules cibles. La glycémie reste proche de 1 g/L grâce à un rétrocontrôle négatif entre insuline (qui la fait baisser) et glucagon (qui la fait monter).",
     attendus:"Commandes nerveuse et hormonale ; glande endocrine, cellule cible ; rétrocontrôle négatif ; régulation de la glycémie ; diabètes de type 1 et 2."},
    {id:"c04", num:4, titre:"Homéostasie et thermorégulation",
     resume:"Le milieu intérieur est maintenu quasi constant malgré les variations extérieures. La température du corps (≈ 37 °C) résulte d'un bilan entre chaleur produite et chaleur perdue, piloté par l'hypothalamus.",
     attendus:"Milieu intérieur et homéostasie ; thermorégulation (vasomotricité, sudation, frissons) ; endothermes et ectothermes ; fièvre."},
    {id:"c05", num:5, titre:"Défenses de l'organisme et immunité",
     resume:"Barrières, phagocytose et inflammation répondent tout de suite ; les lymphocytes B et T répondent plus tard mais gardent la mémoire. Le vaccin entraîne cette mémoire ; le sérum prête des anticorps pour une protection brève.",
     attendus:"Réponse immunitaire innée et adaptative ; antigène, anticorps, lymphocytes B et T, mémoire ; vaccination et sérothérapie ; VIH (aperçu) ; immunité collective."},
    {id:"c06", num:6, titre:"Excrétion : reins et bilan hydrique",
     resume:"Chaque jour, le rein filtre environ 180 litres de plasma et en réabsorbe plus de 99 % pour fabriquer 1 à 2 litres d'urine. L'hormone antidiurétique (ADH) règle la concentration de l'urine pour équilibrer le bilan hydrique.",
     attendus:"Néphron : filtration glomérulaire, réabsorption, sécrétion ; urine et analyse d'urine ; bilan hydrique et ADH ; dialyse (aperçu)."},
    {id:"c07", num:7, titre:"Reproduction asexuée, sexuée et méiose",
     resume:"La reproduction asexuée copie un individu ; la reproduction sexuée mélange deux génomes grâce à la méiose, qui divise le nombre de chromosomes par deux et brasse les allèles (brassage inter- et intrachromosomique).",
     attendus:"Reproduction asexuée (clones) et sexuée ; cellules haploïdes et diploïdes ; méiose I et II ; brassage interchromosomique (2ⁿ) et intrachromosomique (crossing-over) ; anomalies chromosomiques."},
    {id:"c08", num:8, titre:"Appareils reproducteurs et gamétogenèse",
     resume:"Les testicules produisent des millions de spermatozoïdes chaque jour à partir de la puberté ; les ovaires contiennent un stock d'ovocytes constitué avant la naissance. Une spermatogenèse donne 4 gamètes, une ovogenèse en donne 1.",
     attendus:"Appareils reproducteurs masculin et féminin ; spermatogenèse et ovogenèse ; puberté et hormones sexuelles ; caractères sexuels secondaires ; causes d'infertilité."},
    {id:"c09", num:9, titre:"Cycle menstruel, fécondation et contraception",
     resume:"Le cycle est piloté par FSH, LH, œstrogènes et progestérone. L'ovulation a lieu environ 14 jours avant les règles suivantes, pas forcément le 14e jour. La fécondation n'est possible que dans une fenêtre de quelques jours.",
     attendus:"Contrôle hormonal du cycle ; fécondation et nidation ; test de grossesse (hCG) ; contraception hormonale et autres méthodes ; procréation médicalement assistée."},
    {id:"c10", num:10, titre:"Embryogenèse, développement et grossesse",
     resume:"Du zygote au nouveau-né en 40 semaines d'aménorrhée : division, différenciation, organogenèse puis croissance. Le placenta échange gaz, nutriments et déchets sans mélanger les sangs ; certaines substances (tératogènes) perturbent le développement à des moments précis.",
     attendus:"Grandes étapes du développement (embryon, fœtus) ; placenta et échanges mère-fœtus ; périodes critiques et tératogènes ; jumeaux monozygotes et dizygotes."}
  ]
});
