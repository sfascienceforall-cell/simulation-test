/* SFA · Biologie 6e secondaire (sciences générales) : page et petite boîte à outils partagée (B6) */
SFA.page({
  matiere: "biologie",
  titre: "Biologie · 6e secondaire (sciences générales)",
  kicker: "Secondaire · FWB · Sciences générales",
  intro: "Hérédité, génétique humaine, biotechnologies, évolution, écologie et grands enjeux de l'environnement : des modèles quantitatifs que tu pilotes (croisements, PCR, sélection, populations, climat…) et des exercices corrigés pas à pas, du ★ au ★★★★★. Les modèles simplifiés sont annoncés comme tels.",
  base: "../../",
  chapitres: [
    {id:"c01", num:1, titre:"Hérédité monohybride : gènes et allèles",
     resume:"Un caractère est contrôlé par un gène présent en deux exemplaires, parfois sous plusieurs formes (allèles). On apprend à prévoir les résultats d'un croisement avec l'échiquier, à distinguer dominance complète, dominance incomplète et codominance, et à comprendre pourquoi les proportions ne sont respectées que sur de grands effectifs.",
     attendus:"Distinguer gène, allèle, génotype, phénotype, homozygote, hétérozygote ; construire un échiquier de croisement ; interpréter un test-cross ; traiter la dominance incomplète, la codominance et les allèles multiples (groupes ABO)."},
    {id:"c02", num:2, titre:"Dihybridisme et indépendance des gènes",
     resume:"Deux caractères portés par des gènes sur des chromosomes différents se transmettent indépendamment : un croisement AaBb × AaBb donne 9 : 3 : 3 : 1. On passe de l'échiquier 4 × 4 à la règle du produit, puis on teste un résultat expérimental avec le khi-deux.",
     attendus:"Écrire les gamètes d'un dihybride ; prévoir les proportions d'un croisement dihybride ; utiliser la règle du produit ; confronter des effectifs observés à des proportions attendues ; reconnaître un écart qui signale des gènes liés."},
    {id:"c03", num:3, titre:"Hérédité liée au sexe et gènes liés",
     resume:"Certains gènes sont portés par le chromosome X, d'autres sont sur le même chromosome et ne se séparent pas toujours. On analyse le daltonisme, on déduit un mode de transmission à partir d'un arbre généalogique, on mesure une distance génétique par la fréquence de recombinants et on explique la mosaïque des chats écaille de tortue.",
     attendus:"Prévoir la transmission d'un caractère lié à X ; analyser un arbre généalogique ; expliquer liaison génétique et crossing-over ; calculer une fréquence de recombinants ; décrire l'inactivation d'un chromosome X."},
    {id:"c04", num:4, titre:"Génétique humaine, mutations et maladies génétiques",
     resume:"Une mutation modifie la séquence d'ADN, parfois la protéine, parfois le phénotype. On calcule des risques (mucoviscidose), on suit l'effet d'une mutation de la séquence à la protéine, on lit un caryotype et on comprend ce que valent réellement un dépistage et un test positif.",
     attendus:"Relier mutation, allèle, protéine et maladie ; calculer un risque génétique ; distinguer mutation ponctuelle (silencieuse, faux-sens, non-sens, décalage du cadre de lecture) et anomalie chromosomique ; lire un caryotype ; interpréter un dépistage avec nuance."},
    {id:"c05", num:5, titre:"Génie génétique et biotechnologies",
     resume:"On sait aujourd'hui copier, couper, trier et transférer de l'ADN. On suit l'amplification exponentielle de la PCR, on lit un gel d'électrophorèse, on sélectionne des bactéries transformées et on évalue ce que vaut un profil ADN comme preuve.",
     attendus:"Décrire la PCR, l'électrophorèse, l'action des enzymes de restriction, la transformation bactérienne et la sélection des clones ; analyser applications et limites (OGM, thérapie génique, CRISPR-Cas9, empreinte génétique) ; discuter des enjeux éthiques."},
    {id:"c06", num:6, titre:"Évolution : sélection naturelle et adaptation",
     resume:"Variation héréditaire + survie ou reproduction différentielle = évolution des populations. On fait évoluer des phalènes, on suit l'apparition d'une résistance aux antibiotiques, on mesure le rôle du hasard (dérive) et on prévoit la réponse d'une population à une sélection.",
     attendus:"Expliquer sélection naturelle, adaptation et dérive génétique ; opposer Lamarck et Darwin ; analyser des exemples (phalènes, résistance aux antibiotiques) ; distinguer sélection naturelle et artificielle ; éviter les raisonnements finalistes."},
    {id:"c07", num:7, titre:"Spéciation, preuves de l'évolution et phylogénie",
     resume:"De nouvelles espèces apparaissent quand des populations isolées divergent. Les parentés se lisent dans les caractères partagés et dans les séquences moléculaires ; les roches datent les fossiles. On manipule un arbre, une horloge moléculaire et une désintégration radioactive.",
     attendus:"Expliquer la spéciation (isolement géographique et reproductif) ; lire et construire un arbre phylogénétique ; distinguer homologie et analogie ; interpréter des comparaisons de séquences ; utiliser la datation radiométrique et la stratigraphie."},
    {id:"c08", num:8, titre:"Origine de la vie, classification et diversité",
     resume:"La vie est apparue progressivement sur une Terre jeune. On teste des conditions de synthèse prébiotique, on identifie un domaine du vivant à partir des caractéristiques d'une cellule, on situe l'histoire de la Terre sur une échelle de temps et on analyse l'évolution du cerveau dans la lignée humaine.",
     attendus:"Présenter des hypothèses sur l'origine de la vie (expérience de Miller, monde à ARN) ; situer procaryotes, eucaryotes et les trois domaines ; classer selon la parenté ; situer les grandes étapes de l'histoire de la vie ; replacer l'espèce humaine dans le buisson des hominidés."},
    {id:"c09", num:9, titre:"Écologie : populations, niches et interactions",
     resume:"Une population ne croît pas sans limite : le milieu impose une capacité d'accueil. On modélise la croissance logistique, la compétition entre deux espèces, les oscillations proie–prédateur et le chevauchement des niches.",
     attendus:"Décrire la croissance d'une population et ses facteurs limitants ; distinguer habitat et niche écologique ; analyser compétition, prédation, mutualisme, parasitisme ; interpréter des courbes d'effectifs."},
    {id:"c10", num:10, titre:"Écosystèmes, cycles biogéochimiques et enjeux globaux",
     resume:"L'énergie traverse l'écosystème en s'amenuisant, la matière circule en cycles que l'humain perturbe (azote, carbone). On suit une chaîne alimentaire, l'eutrophisation par les engrais, le réchauffement dû aux émissions de CO₂ et l'effet des perturbations sur la biodiversité.",
     attendus:"Décrire flux d'énergie et cycles de la matière (C, N, P, eau) ; analyser pollution, eutrophisation, bioaccumulation, effet de serre ; relier perturbation, succession et biodiversité ; proposer des mesures de gestion argumentées."}
  ]
});

/* Boîte à outils partagée par les simulations de cette page */
window.B6 = (function(){
  var B = {};
  /* générateur pseudo-aléatoire reproductible (mulberry32) */
  B.rng = function(seed){
    var s = seed >>> 0;
    return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  B.binom = function(n, p, r){ var k = 0; for (var i = 0; i < n; i++) if (r() < p) k++; return k; };
  B.erfc = function(x){
    var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var ans = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? ans : 2 - ans;
  };
  B.phi = function(z){ return Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI); };
  B.Phi = function(z){ return 0.5 * B.erfc(-z / Math.SQRT2); };
  B.gcd = function(a, b){ a = Math.abs(a); b = Math.abs(b); while (b){ var t = a % b; a = b; b = t; } return a; };
  /* histogramme à barres : items = [{l:"étiquette", v:valeur, c:couleur, e:valeur attendue (facultatif)}] */
  B.bars = function(c, S, items, x, y, w, h, vmax, fmtv){
    var ctx = c.ctx, n = items.length, bw = Math.min(54, w / n * 0.62), P = S.draw.palette;
    ctx.save(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
    items.forEach(function(it, i){
      var cx = x + w * (i + 0.5) / n, bh = h * Math.max(0, Math.min(1, it.v / vmax));
      ctx.fillStyle = it.c || P.acc; ctx.fillRect(cx - bw / 2, y + h - bh, bw, bh);
      if (it.e !== undefined){ var eh = h * Math.min(1, it.e / vmax); ctx.strokeStyle = P.ink; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - bw / 2 - 4, y + h - eh); ctx.lineTo(cx + bw / 2 + 4, y + h - eh); ctx.stroke(); ctx.setLineDash([]); }
      S.draw.text(c, fmtv ? fmtv(it.v) : S.fmt(it.v, 1), cx, Math.max(y + 8, y + h - bh - 9), {size: 12});
      S.draw.text(c, it.l, cx, y + h + 13, {size: 12, weight: 600});
    });
    ctx.restore();
  };
  return B;
})();
