/* Chimie · 5e secondaire (sciences générales) : page SFA + aides communes */
window.C5 = {
  R: 8.31,           /* J/(mol·K), arrondi */
  cEau: 4.18,        /* J/(g·K), arrondi */
  /* électronégativités de Pauling (valeurs arrondies à 0,1) */
  EN: {H:2.2, Li:1.0, Be:1.6, B:2.0, C:2.6, N:3.0, O:3.4, F:4.0, Na:0.9, Mg:1.3, Al:1.6, Si:1.9, P:2.2, S:2.6, Cl:3.2, K:0.8, Ca:1.0, Br:3.0, I:2.7},
  /* disque d'atome avec étiquette */
  atom: function(c, x, y, r, col, label, tcol){
    var S = window.SFA, ctx = c.ctx;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.lineWidth = 1.2; ctx.stroke();
    if (label) S.draw.text(c, label, x, y, {size: r > 14 ? 13 : 12, color: tcol || "#0f1b2d"});
  },
  /* résout un équilibre homogène : espèces [{nu, c0, n}] (nu < 0 réactif) ; renvoie l'avancement x tel que Q(x) = K.
     mode "conc" : Q = Π (c_i + nu_i x)^nu_i  */
  solveX: function(sp, K){
    var lo = -1e9, hi = 1e9, i, s;
    for (i = 0; i < sp.length; i++){ s = sp[i];
      if (s.nu > 0) lo = Math.max(lo, -s.c0 / s.nu); else hi = Math.min(hi, s.c0 / -s.nu); }
    function lq(x){ var t = 0; for (var j = 0; j < sp.length; j++){ var v = sp[j].c0 + sp[j].nu * x; if (v <= 0) v = 1e-300; t += sp[j].nu * Math.log(v); } return t; }
    var lk = Math.log(K), a = lo + 1e-12 * (hi - lo), b = hi - 1e-12 * (hi - lo);
    for (i = 0; i < 200; i++){ var m = (a + b) / 2; if (lq(m) < lk) a = m; else b = m; }
    return (a + b) / 2;
  },
  /* écriture avec exposants Unicode pour les canvas */
  sup: function(n){ var m = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"}; return String(n).split("").map(function(ch){ return m[ch] || ch; }).join(""); },
  sub: function(n){ var m = {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉"}; return String(n).split("").map(function(ch){ return m[ch] || ch; }).join(""); }
};

SFA.page({
  matiere: "chimie",
  titre: "Chimie · 5e secondaire (sciences générales)",
  kicker: "Secondaire · FWB",
  intro: "Dix chapitres pour comprendre comment les atomes se lient, comment l'énergie circule dans une réaction, à quelle vitesse tout cela se passe et pourquoi certaines réactions s'arrêtent à mi-chemin. Chaque chapitre propose quatre simulations à manipuler et une dizaine d'exercices corrigés du ★ au ★★★★★. Les valeurs de référence (masses molaires, constantes) sont arrondies au niveau du secondaire ; les arrondis sont annoncés.",
  base: "../../",
  chapitres: [
    {id:"c01", num:1, titre:"Structure électronique et schéma de Lewis",
     resume:"Les électrons occupent des couches et des sous-couches dans un ordre précis. Les électrons de la dernière couche (électrons de valence) décident de tout le reste : on les représente par le schéma de Lewis.",
     attendus:"écrire la configuration électronique d'un atome (Z ≤ 36) ; relier les raies d'un spectre aux niveaux d'énergie ; dessiner le schéma de Lewis d'un atome et d'un ion ; appliquer la règle de l'octet."},
    {id:"c02", num:2, titre:"Liaisons covalente, ionique et métallique",
     resume:"Une liaison naît quand des atomes abaissent leur énergie en se rapprochant. L'électronégativité permet de prévoir si les électrons sont partagés, transférés ou mis en commun. Le modèle de Lewis a des limites.",
     attendus:"prévoir le type de liaison par la différence d'électronégativité ; décrire liaisons simple, double et triple ; connaître des exceptions à l'octet ; décrire la liaison métallique et ses conséquences."},
    {id:"c03", num:3, titre:"Géométrie des molécules et solides cristallins",
     resume:"Les doublets d'électrons se repoussent et se placent le plus loin possible les uns des autres : c'est ce qui donne sa forme à une molécule. La forme décide de la polarité, et la structure d'un solide décide de ses propriétés.",
     attendus:"prévoir la géométrie par la méthode VSEPR ; déterminer la polarité globale d'une molécule ; relier la structure d'un solide (ionique, covalent, métallique, moléculaire) à ses propriétés."},
    {id:"c04", num:4, titre:"Eau, polarité, liaison hydrogène et solubilité",
     resume:"L'eau est une molécule polaire qui s'accroche à ses voisines par des liaisons hydrogène. Ces forces entre molécules expliquent son point d'ébullition élevé, sa tension superficielle et ce qui se dissout ou non dans l'eau.",
     attendus:"expliquer le caractère polaire de l'eau ; distinguer liaison intramoléculaire et intermoléculaire ; prévoir la solubilité (« qui se ressemble s'assemble »)."},
    {id:"c05", num:5, titre:"Chaleur, température et effet thermique",
     resume:"La température mesure l'agitation moyenne des particules ; la chaleur est de l'énergie échangée. Q = m·c·ΔT relie les deux, et le signe de ΔH dit si une transformation libère ou absorbe de l'énergie.",
     attendus:"distinguer chaleur et température ; utiliser Q = m·c·ΔT ; classer réactions exothermiques, endothermiques ; lire un diagramme énergétique."},
    {id:"c06", num:6, titre:"Calorimétrie et pouvoir calorifique",
     resume:"Un calorimètre permet de mesurer l'énergie échangée par une réaction. On en déduit l'enthalpie molaire de réaction, on compare des combustibles, et la loi de Hess permet de calculer des enthalpies qu'on ne peut pas mesurer directement.",
     attendus:"mesurer un effet thermique au calorimètre ; calculer une enthalpie molaire ; comparer des combustibles par leur pouvoir calorifique ; appliquer la loi de Hess."},
    {id:"c07", num:7, titre:"Vitesse d'une réaction et catalyse",
     resume:"Une réaction a lieu quand des particules se rencontrent avec assez d'énergie. Concentration, température, surface de contact et catalyseur changent le nombre de chocs efficaces, donc la vitesse, mais pas le bilan final.",
     attendus:"définir la vitesse d'une réaction ; expliquer l'effet de la concentration, de la température, de la surface de contact et d'un catalyseur par la théorie des collisions ; lire un profil énergétique."},
    {id:"c08", num:8, titre:"Équilibres chimiques et constante K",
     resume:"Beaucoup de réactions ne sont pas complètes : réactifs et produits coexistent. À l'équilibre, la réaction directe et la réaction inverse continuent à même vitesse. Le quotient Q, comparé à K, indique le sens d'évolution.",
     attendus:"distinguer réaction complète et équilibre dynamique ; écrire l'expression de K ; calculer K et des concentrations à l'équilibre ; comparer Q et K."},
    {id:"c09", num:9, titre:"Déplacement d'un équilibre : principe de Le Chatelier",
     resume:"Quand on perturbe un équilibre (concentration, température, pression), le système évolue pour s'opposer à la perturbation. Seule la température modifie K. On en déduit les conditions du procédé industriel de synthèse de l'ammoniac.",
     attendus:"prévoir l'effet d'une variation de concentration, de température ou de pression ; savoir qu'un catalyseur ne déplace pas l'équilibre ; justifier un compromis industriel."},
    {id:"c10", num:10, titre:"Introduction à la chimie organique : alcanes et combustion",
     resume:"La chimie organique est la chimie des composés du carbone. Les alcanes en sont la famille la plus simple : on les nomme, on les dessine, on compare leurs propriétés et on étudie leur combustion, complète ou non.",
     attendus:"nommer et dessiner des alcanes ; reconnaître des isomères de chaîne ; relier longueur de chaîne et point d'ébullition ; écrire la combustion complète et incomplète et l'énergie libérée."}
  ]
});
