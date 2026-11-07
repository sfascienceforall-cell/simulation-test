/* Physique · 5e secondaire (sciences générales) : page SFA + petites aides communes */
window.P5 = {
  g: 9.81,
  /* flèche avec étiquette au bout */
  vec: function(c, x1, y1, x2, y2, color, label, opt){
    var S = window.SFA; opt = opt || {};
    var len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 2) return;
    S.draw.arrow(c, x1, y1, x2, y2, color, opt.w || 2.6);
    if (label){
      var ux = (x2 - x1) / len, uy = (y2 - y1) / len;
      S.draw.text(c, label, x2 + ux * 14 + (opt.dx || 0), y2 + uy * 14 + (opt.dy || 0), {color: color, size: opt.size || 13, bg: opt.bg});
    }
  },
  /* repère orthonormé (même échelle en x et en y), quadrillage de pas 1 ; r = {x0,x1,y0,y1} en unités */
  frame: function(c, r, o){
    var S = window.SFA; o = o || {};
    var pad = 14, u = Math.min((c.W - 2 * pad) / (r.x1 - r.x0), (c.H - 2 * pad) / (r.y1 - r.y0));
    var ox = (c.W - u * (r.x1 - r.x0)) / 2, oy = (c.H - u * (r.y1 - r.y0)) / 2;
    var f = {u: u,
      X: function(x){ return ox + (x - r.x0) * u; },
      Y: function(y){ return c.H - oy - (y - r.y0) * u; },
      ix: function(px){ return r.x0 + (px - ox) / u; },
      iy: function(py){ return r.y0 + (c.H - oy - py) / u; }};
    var ctx = c.ctx; ctx.save();
    if (o.grid !== false){
      ctx.strokeStyle = "#edf0f4"; ctx.lineWidth = 1;
      for (var gx = Math.ceil(r.x0); gx <= r.x1; gx++){ ctx.beginPath(); ctx.moveTo(f.X(gx), f.Y(r.y0)); ctx.lineTo(f.X(gx), f.Y(r.y1)); ctx.stroke(); }
      for (var gy = Math.ceil(r.y0); gy <= r.y1; gy++){ ctx.beginPath(); ctx.moveTo(f.X(r.x0), f.Y(gy)); ctx.lineTo(f.X(r.x1), f.Y(gy)); ctx.stroke(); }
    }
    if (o.axes){
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.moveTo(f.X(r.x0), f.Y(0)); ctx.lineTo(f.X(r.x1), f.Y(0)); ctx.moveTo(f.X(0), f.Y(r.y0)); ctx.lineTo(f.X(0), f.Y(r.y1)); ctx.stroke();
    }
    ctx.restore();
    return f;
  },
  /* borne une valeur */
  clamp: function(x, a, b){ return Math.max(a, Math.min(b, x)); }
};
SFA.page({
  matiere: "physique",
  titre: "Physique · 5e secondaire (sciences générales)",
  kicker: "Secondaire · FWB · 5e année",
  intro: "40 simulations à manipuler et plus de 100 exercices et QCM corrigés pas à pas, du ★ au ★★★★★ : forces et vecteurs, lois de Newton, mouvements, gravitation, champ électrique, condensateur et circuits. Valeurs utilisées : g = 9,81 m/s², G = 6,67·10⁻¹¹ N·m²/kg², k = 9,0·10⁹ N·m²/C², e = 1,6·10⁻¹⁹ C.",
  base: "../../",
  chapitres: [
    {id:"c01", num:1, titre:"Vecteurs, composition et décomposition des forces",
     resume:"Une force est un vecteur : on ne peut pas additionner ses valeurs comme des nombres. Tu apprends à composer plusieurs forces en une résultante et à décomposer une force selon deux directions choisies.",
     attendus:"représenter une force par un vecteur ; additionner des forces (graphiquement puis par composantes) ; décomposer une force (plan incliné, câbles) ; choisir un repère adapté."},
    {id:"c02", num:2, titre:"Équilibre statique et première loi de Newton",
     resume:"Un corps sur lequel la résultante des forces est nulle est au repos ou en mouvement rectiligne uniforme : il n'a pas besoin de force pour continuer. Pour qu'un solide ne tourne pas, il faut aussi que les moments s'annulent.",
     attendus:"énoncer le principe d'inertie ; appliquer ΣF = 0 ; calculer un moment de force et appliquer l'équilibre de rotation ; reconnaître un référentiel galiléen."},
    {id:"c03", num:3, titre:"Deuxième loi de Newton",
     resume:"La résultante des forces sur un corps vaut sa masse fois son accélération : ΣF = m·a. On construit un diagramme des forces, on projette, puis on résout, sur une droite.",
     attendus:"appliquer ΣF = m·a à une dimension ; distinguer masse et poids ; faire un diagramme des forces isolées ; interpréter le poids apparent."},
    {id:"c04", num:4, titre:"Troisième loi de Newton et quantité de mouvement",
     resume:"Quand A pousse B, B pousse A avec la même force, mais ces deux forces agissent sur deux corps différents. Dans un système isolé, la quantité de mouvement totale p = m·v se conserve, pas forcément l'énergie cinétique.",
     attendus:"identifier les paires action-réaction ; calculer p = m·v et une impulsion ; appliquer la conservation de p dans des chocs ; distinguer choc élastique et choc mou."},
    {id:"c05", num:5, titre:"Frottements, plan incliné et projectiles",
     resume:"Le frottement s'oppose au glissement, avec un seuil de démarrage (statique) puis une valeur plus faible en glissant (dynamique). Sans frottement, un projectile est la superposition d'un mouvement uniforme (horizontal) et d'un mouvement uniformément accéléré (vertical).",
     attendus:"intégrer le frottement f = μ·N au bilan des forces ; étudier un plan incliné ; décrire un lancer oblique (portée, flèche, durée) ; connaître l'effet de la résistance de l'air."},
    {id:"c06", num:6, titre:"Mouvement circulaire uniforme",
     resume:"Même à vitesse constante, un mouvement circulaire est accéléré : le vecteur vitesse change de direction. L'accélération pointe vers le centre et la résultante des forces aussi (force centripète).",
     attendus:"utiliser T, f, ω et v = ωR ; calculer a = v²/R et la force centripète ; analyser un virage (relevé ou non) ; ne pas confondre force centripète et « force centrifuge »."},
    {id:"c07", num:7, titre:"Gravitation universelle et mouvement des astres",
     resume:"Deux masses s'attirent avec la même force en 1/r². Le poids est cette force pour la Terre, et un satellite est un corps en chute libre qui « rate » le sol. Les planètes obéissent aux lois de Kepler.",
     attendus:"appliquer F = G·m₁·m₂/r² ; calculer g à une altitude ; trouver la vitesse et la période d'un satellite ; énoncer et utiliser les lois de Kepler."},
    {id:"c08", num:8, titre:"Champ et force électriques",
     resume:"Une charge modifie l'espace autour d'elle : le champ électrique E = F/q. La force sur une charge d'essai se lit alors F = q·E. Entre deux plaques, le champ est uniforme : E = U/d.",
     attendus:"appliquer la loi de Coulomb ; représenter et lire des lignes de champ ; additionner des champs (vecteurs) ; décrire le condensateur plan et le mouvement d'une charge dans E."},
    {id:"c09", num:9, titre:"Potentiel, énergie électrique et condensateur",
     resume:"La tension est une différence de potentiel : elle mesure l'énergie par coulomb. Une charge accélérée par une tension U gagne q·U. Un condensateur stocke l'énergie ½·C·U² dans son champ, et se charge ou se décharge en une durée de l'ordre de R·C.",
     attendus:"définir potentiel et tension ; relier travail électrique W = q·U et énergie cinétique ; calculer la charge et l'énergie d'un condensateur (Q = C·U) ; décrire charge et décharge."},
    {id:"c10", num:10, titre:"Électrocinétique : lois de Kirchhoff et générateurs",
     resume:"Les lois des nœuds et des mailles permettent de résoudre n'importe quel circuit de résistances. Une pile réelle a une résistance interne : sa tension baisse quand elle débite.",
     attendus:"appliquer la loi des nœuds et la loi des mailles (avec les signes) ; résoudre un circuit à deux mailles ; modéliser un générateur réel (f.é.m. E, résistance interne r) ; utiliser un diviseur de tension."}
  ]
});
