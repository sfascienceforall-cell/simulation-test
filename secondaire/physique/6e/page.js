SFA.page({
  matiere: "physique",
  titre: "Physique · 6e secondaire (sciences générales)",
  kicker: "Secondaire · FWB · Sciences générales",
  intro: "Magnétisme, induction, courant alternatif, oscillations, ondes, son, lumière, atome et noyau, santé et climat : des simulations à manipuler et des exercices corrigés pas à pas, du ★ au ★★★★★. Les modèles simplifiés sont annoncés comme tels.",
  base: "../../",
  chapitres: [
    {id:"c01", num:1, titre:"Magnétisme et champ magnétique",
     resume:"Un aimant, un fil ou une bobine créent autour d'eux un champ magnétique. On apprend à le représenter, à le calculer pour un fil et un solénoïde, et à comprendre pourquoi une boussole s'oriente sur la Terre.",
     attendus:"Décrire un aimant et ses pôles ; représenter les lignes de champ d'un aimant, d'un fil, d'une bobine ; calculer B pour un fil rectiligne et un solénoïde ; expliquer le champ magnétique terrestre."},
    {id:"c02", num:2, titre:"Force de Lorentz et force de Laplace",
     resume:"Un champ magnétique agit sur les charges en mouvement et sur les courants : la force est perpendiculaire à la vitesse (ou au fil) et au champ. C'est le principe du moteur électrique et du spectromètre de masse.",
     attendus:"Prévoir direction, sens et valeur de F = q·v·B·sin θ et de F = B·I·L·sin θ ; décrire le mouvement circulaire d'une charge dans un champ uniforme ; expliquer le moteur à courant continu."},
    {id:"c03", num:3, titre:"Induction électromagnétique",
     resume:"Quand le flux magnétique à travers un circuit varie, une force électromotrice apparaît : c'est l'induction. Le sens du courant induit s'oppose à la cause qui lui donne naissance (loi de Lenz).",
     attendus:"Définir le flux magnétique ; interpréter qualitativement et quantitativement la loi de Faraday ; appliquer la loi de Lenz ; décrire l'alternateur et les courants de Foucault."},
    {id:"c04", num:4, titre:"Courant alternatif, transformateur et réseau",
     resume:"Le réseau électrique fournit une tension sinusoïdale de 50 Hz. On lit une tension sur un oscilloscope, on fait travailler un transformateur et on comprend pourquoi l'énergie voyage sous très haute tension.",
     attendus:"Décrire une tension sinusoïdale (amplitude, période, fréquence, valeur efficace) ; utiliser le rapport de transformation ; expliquer les pertes par effet Joule dans les lignes ; décrire un redressement."},
    {id:"c05", num:5, titre:"Oscillations et vibrations",
     resume:"Un système écarté de sa position d'équilibre et soumis à une force de rappel oscille. On étudie le ressort et le pendule, l'amortissement et la résonance.",
     attendus:"Décrire un oscillateur (amplitude, période, fréquence) ; utiliser T = 2π√(m/k) et T = 2π√(L/g) ; décrire l'amortissement ; expliquer la résonance."},
    {id:"c06", num:6, titre:"Ondes mécaniques : propagation et propriétés",
     resume:"Une onde transporte de l'énergie et de l'information sans transporter de matière. On relie vitesse, longueur d'onde et fréquence, puis on étudie diffraction, interférences et ondes stationnaires.",
     attendus:"Distinguer onde transversale et longitudinale ; utiliser v = λ·f ; décrire réflexion, diffraction et interférences ; interpréter une onde stationnaire."},
    {id:"c07", num:7, titre:"Le son : hauteur, intensité, effet Doppler",
     resume:"Le son est une onde mécanique longitudinale. Sa fréquence donne la hauteur, son amplitude l'intensité. On manipule les décibels, l'effet Doppler et les tuyaux sonores.",
     attendus:"Relier hauteur et fréquence, intensité et amplitude ; calculer un niveau sonore en dB ; expliquer l'effet Doppler ; déterminer les fréquences d'un tuyau ; évaluer les risques du bruit."},
    {id:"c08", num:8, titre:"Ondes électromagnétiques, interférences et spectres",
     resume:"La lumière est une onde électromagnétique parmi d'autres. Elle interfère, se diffracte et se polarise ; les spectres de raies identifient les éléments chimiques jusque dans les étoiles.",
     attendus:"Situer les ondes électromagnétiques sur le spectre et utiliser c = λ·f ; interpréter les interférences des fentes d'Young et du réseau ; interpréter un spectre d'émission ou d'absorption ; décrire la polarisation."},
    {id:"c09", num:9, titre:"Atome, noyau et radioactivité",
     resume:"Les niveaux d'énergie de l'atome expliquent les raies spectrales. Le noyau instable se désintègre au hasard mais selon une loi exponentielle : on en déduit la demi-vie et la datation.",
     attendus:"Utiliser le modèle de Bohr pour l'hydrogène ; décrire les rayonnements α, β, γ et la protection ; utiliser la loi de décroissance et la demi-vie ; situer fission et fusion."},
    {id:"c10", num:10, titre:"Physique et santé ; climat et énergie",
     resume:"Ultrasons, rayons X et rayonnements ionisants servent à soigner et à diagnostiquer, avec des risques à maîtriser. L'effet de serre règle la température de la Terre et son renforcement la modifie.",
     attendus:"Expliquer échographie et radiographie ; comparer des doses de rayonnement ; expliquer l'effet de serre naturel et renforcé ; analyser des données énergétiques."}
  ]
});

/* aides communes aux simulations de cette page */
window.P6 = {
  /* longueur d'onde (nm) → couleur CSS approchée */
  rgb: function(nm){
    var r = 0, g = 0, b = 0, w = nm;
    if (w >= 380 && w < 440){ r = -(w - 440) / 60; b = 1; }
    else if (w < 490){ g = (w - 440) / 50; b = 1; }
    else if (w < 510){ g = 1; b = -(w - 510) / 20; }
    else if (w < 580){ r = (w - 510) / 70; g = 1; }
    else if (w < 645){ r = 1; g = -(w - 645) / 65; }
    else if (w <= 780){ r = 1; }
    var f = (w < 420) ? 0.3 + 0.7 * (w - 380) / 40 : (w > 700 ? 0.3 + 0.7 * (780 - w) / 80 : 1);
    if (w < 380 || w > 780) f = 0.25;
    function c(x){ return Math.round(255 * Math.pow(Math.max(0, x * f), 0.8)); }
    return "rgb(" + c(r) + "," + c(g) + "," + c(b) + ")";
  },
  clamp: function(x, a, b){ return Math.max(a, Math.min(b, x)); }
};
