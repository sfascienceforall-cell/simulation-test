/* Réponses chiffrées des exercices de physique, corrigées automatiquement par kit/sfa-progress.js — novembre 2026.
   Clé = titre exact de l'exercice. Chaque partie : q (ce qu'on demande), v (valeur attendue), u (unité imposée),
   tol (marge relative, 0,02 par défaut), p (pièges : valeur fausse typique → type d'erreur, voir SFAPROG.ERR).
   Valeurs recalculées à partir des énoncés de la page (chapitre « Circuits électriques (R, C, L) »). */
window.SFA_NUM = Object.assign(window.SFA_NUM || {}, {
  "Loi d’Ohm et puissance": [
    { q: "Courant I", v: 22.7, u: "mA", p: { 0.0227: "unites", 1100: "formule" } },
    { q: "Puissance P", v: 0.114, u: "W", p: { 114: "unites", 5500: "formule" } }
  ],
  "Série et parallèle": [
    { q: "(a) R_éq en série", v: 790, u: "Ω" },
    { q: "(b) R₁ ∥ R₂", v: 68.75, u: "Ω", p: { 320: "formule", 0.01455: "formule" } }
  ],
  "Diviseur de tension": [
    { q: "Courant I", v: 3, u: "mA", p: { 0.003: "unites", 12: "formule" } },
    { q: "Tension U₂", v: 9, u: "V", p: { 3: "formule" } }
  ],
  "Loi des mailles : deux sources": [
    { q: "Piles en opposition : I", v: 20, u: "mA", p: { 60: "signe", 0.02: "unites" } },
    { q: "Piles dans le même sens : I", v: 60, u: "mA", p: { 20: "signe", 0.06: "unites" } }
  ],
  "Charge et énergie d’un condensateur": [
    { q: "Charge Q", v: 1200, u: "μC", p: { 1.2: "unites", 0.0012: "unites" } },
    { q: "Énergie W", v: 7.2, u: "mJ", p: { 14.4: "formule", 0.0072: "unites" } }
  ],
  "Condensateurs en série et en parallèle": [
    { q: "(a) C_éq en série", v: 3, u: "μF", p: { 16: "formule" } },
    { q: "(b) C_éq en parallèle", v: 16, u: "μF", p: { 3: "formule" } }
  ],
  "Circuit RC : constante de temps": [
    { q: "(a) τ", v: 0.47, u: "s", p: { 470: "unites" } },
    { q: "(b) U après 1 s", v: 10.6, u: "V", tol: 0.015 },
    { q: "(c) temps pour 90 %", v: 1.08, u: "s" }
  ],
  "Bobine : f.e.m. induite et énergie": [
    { q: "(a) |ℰ|", v: 100, u: "V", p: { 0.0025: "formule" } },
    { q: "(b) Énergie W", v: 2.25, u: "J", p: { 4.5: "formule", 0.75: "formule" } }
  ],
  "Circuit RL à la fermeture": [
    { q: "(a) τ", v: 4, u: "ms", p: { 250: "formule", 0.004: "unites" } },
    { q: "(a) courant final I₀", v: 0.2, u: "A" },
    { q: "(b) I après τ", v: 0.126, u: "A", p: { 0.074: "formule", 0.2: "concept" } }
  ],
  "LC, RLC et résonance (examen)": [
    { q: "(a) ω₀", v: 1e7, u: "rad/s", p: { 1.59e6: "formule" } },
    { q: "(a) f₀", v: 1.59, u: "MHz", p: { 1590000: "unites", 10000000: "formule" } },
    { q: "(b) Z à la résonance", v: 10, u: "Ω", p: { 0: "concept", 50: "concept" } }
  ]
});

/* Chapitres « MRU / MRUA » et « MCU / MCUA » (valeurs recalculées le 13/11/2026) */
Object.assign(window.SFA_NUM, {
  "Train en MRU": [
    { q: "Vitesse", v: 30, u: "m/s", p: { 108: "unites", 388.8: "unites" } },
    { q: "Distance en 2 min", v: 3600, u: "m", p: { 60: "unites", 216: "unites", 3.6: "unites" } }
  ],
  "Voiture : 0 à 100 km/h": [
    { q: "Accélération a", v: 3.47, u: "m/s²", p: { 12.5: "unites" } },
    { q: "Distance parcourue", v: 111, u: "m", p: { 222: "formule", 400: "unites" } }
  ],
  "Distance de freinage": [
    { q: "Distance d'arrêt", v: 62.5, u: "m", p: { 125: "formule", 31.25: "formule" } },
    { q: "Durée d'arrêt", v: 5, u: "s", p: { 0.2: "formule" } }
  ],
  "Poursuite entre deux mobiles": [
    { q: "Instant de la rencontre (depuis le départ de A)", v: 25, u: "s", p: { 20: "concept" } },
    { q: "Position de la rencontre", v: 500, u: "m" }
  ],
  "Chute libre depuis un pont": [
    { q: "Hauteur du pont", v: 30.7, u: "m", p: { 61.3: "formule", 24.5: "concept" } },
    { q: "Vitesse d'impact", v: 24.5, u: "m/s", p: { 12.3: "formule" } }
  ],
  "Tir vertical (examen)": [
    { q: "(a) Hauteur maximale", v: 20.4, u: "m", p: { 40.8: "formule" } },
    { q: "(b) Temps de vol total", v: 4.08, u: "s", p: { 2.04: "concept" } },
    { q: "(c) Vitesse au retour (positive vers le haut)", v: -20, u: "m/s", p: { 20: "signe", 0: "concept" } }
  ],
  "L’aiguille des minutes": [
    { q: "Vitesse angulaire ω", v: 1.745e-3, u: "rad/s", p: { 0.1047: "unites", 6.283: "unites" } },
    { q: "Vitesse du bout de l'aiguille", v: 2.62e-4, u: "m/s", p: { 0.0262: "unites", 0.0157: "unites" } }
  ],
  "Disque en rotation": [
    { q: "Fréquence f", v: 2, u: "Hz", p: { 0.5: "formule" } },
    { q: "Vitesse angulaire ω", v: 12.57, u: "rad/s", p: { 2: "formule", 3.14: "formule" } }
  ],
  "Le manège": [
    { q: "Vitesse v", v: 4.71, u: "m/s", p: { 1.5: "formule", 0.75: "formule" } },
    { q: "Accélération centripète aₙ", v: 7.40, u: "m/s²", p: { 1.57: "formule" } }
  ],
  "Vitesse et accélération centripète": [
    { q: "Vitesse v", v: 4, u: "m/s", p: { 6.25: "formule" } },
    { q: "Accélération centripète aₙ", v: 20, u: "m/s²", p: { 4: "formule", 5: "formule" } }
  ],
  "Essorage de la machine à laver": [
    { q: "Vitesse angulaire ω", v: 125.7, u: "rad/s", p: { 20: "unites", 1200: "unites", 7540: "unites" } },
    { q: "Vitesse du linge", v: 27.6, u: "m/s", p: { 2760: "unites" } },
    { q: "Accélération centripète", v: 3474, u: "m/s²", p: { 27.6: "formule" } },
    { q: "En nombre de « g »", v: 354, u: "g", tol: 0.03 }
  ],
  "Roue en MCUA": [
    { q: "Accélération angulaire α", v: 5, u: "rad/s²", p: { 180: "formule" } },
    { q: "Nombre de tours", v: 14.3, u: "tours", p: { 90: "unites", 28.6: "formule" } }
  ],
  "La roue de vélo qui accélère": [
    { q: "Accélération tangentielle aₜ", v: 1.75, u: "m/s²", p: { 5: "formule" } },
    { q: "Accélération centripète aₙ", v: 140, u: "m/s²", p: { 7: "formule" } }
  ],
  "Le disque dur qui démarre": [
    { q: "Accélération angulaire α", v: 251.3, u: "rad/s²", p: { 2400: "unites", 40: "unites" } },
    { q: "Nombre de tours", v: 180, u: "tours", p: { 1131: "unites", 360: "formule" } }
  ],
  "Accélération totale (les deux à la fois)": [
    { q: "aₙ", v: 18, u: "m/s²", p: { 6: "formule" } },
    { q: "aₜ", v: 4, u: "m/s²" },
    { q: "Norme de a", v: 18.44, u: "m/s²", p: { 22: "formule" } },
    { q: "Angle avec le rayon", v: 12.53, u: "°", p: { 77.47: "trigo", 0.2187: "unites" } }
  ],
  "Satellite en orbite (examen)": [
    { q: "(a) Vitesse orbitale", v: 7675, u: "m/s", p: { 7.675: "unites", 5.9e7: "formule" } },
    { q: "(b) Période", v: 92.4, u: "min", p: { 5543: "unites" } }
  ]
});

/* Chapitres « Somme des forces », « Quantité de mouvement et impulsion », « Conservation de l'énergie » (13/11/2026) */
Object.assign(window.SFA_NUM, {
  "Caisse tirée avec frottement": [ { q: "Accélération a", v: 3, u: "m/s²", p: { 5: "formule", 7: "signe" } } ],
  "Deux caisses poussées ensemble": [
    { q: "Accélération a", v: 4, u: "m/s²", p: { 6.67: "formule", 10: "formule" } },
    { q: "Force de m₁ sur m₂", v: 8, u: "N", p: { 20: "concept", 12: "formule" } }
  ],
  "Plan incliné lisse": [ { q: "Accélération a", v: 4.9, u: "m/s²", p: { 8.5: "trigo", 9.81: "concept" } } ],
  "Angle limite de glissement": [ { q: "Angle limite θ", v: 21.8, u: "°", p: { 23.6: "trigo", 66.4: "trigo", 0.381: "unites" } } ],
  "Balance dans un ascenseur": [ { q: "Indication de la balance N", v: 827, u: "N", p: { 547: "signe", 687: "concept", 140: "concept" } } ],
  "Freinage d’urgence": [
    { q: "Décélération (valeur positive)", v: 8, u: "m/s²", p: { 0.8: "formule" } },
    { q: "Distance d'arrêt", v: 25, u: "m", p: { 50: "formule", 324: "unites" } },
    { q: "Durée du freinage", v: 2.5, u: "s", p: { 9: "unites" } }
  ],
  "Table + poulie": [
    { q: "Accélération a", v: 2.75, u: "m/s²", p: { 3.92: "formule", 6.54: "formule" } },
    { q: "Tension T", v: 14.1, u: "N", p: { 19.62: "concept", 8.24: "formule" } }
  ],
  "Pendule conique (examen)": [
    { q: "(a) Tension", v: 13.6, u: "N", p: { 10.19: "trigo", 23.5: "trigo", 11.77: "concept" } },
    { q: "(b) Vitesse v", v: 1.06, u: "m/s" },
    { q: "(c) Période de rotation", v: 1.18, u: "s" }
  ],
  "Les patineurs qui se repoussent": [ { q: "Vitesse de Tom (positive vers la droite)", v: -2, u: "m/s", p: { 2: "signe", "-4.5": "formule", 4.5: "formule" } } ],
  "Le coup de pied : l’aire sous F(t)": [
    { q: "Impulsion J", v: 4, u: "N·s", p: { 8: "formule", 4000: "unites" } },
    { q: "Force moyenne", v: 400, u: "N", p: { 800: "concept" } },
    { q: "Vitesse du ballon", v: 10, u: "m/s", p: { 20: "formule" } }
  ],
  "La balle qui rebondit sur un mur": [
    { q: "Δp (axe + vers le mur)", v: -7.2, u: "kg·m/s", p: { "-0.8": "signe", 0.8: "signe", 7.2: "signe" } },
    { q: "Force moyenne du mur (axe + vers le mur)", v: -360, u: "N", p: { 360: "signe", "-40": "signe", 40: "signe" } }
  ],
  "Le casque : allonger la durée du choc": [
    { q: "Force moyenne sans casque", v: 15000, u: "N", p: { 15: "unites" } },
    { q: "Force moyenne avec casque", v: 2500, u: "N", p: { 2.5: "unites" } },
    { q: "Décélération sans casque", v: 300, u: "g", p: { 3000: "unites" } },
    { q: "Décélération avec casque", v: 50, u: "g", p: { 500: "unites" } }
  ],
  "Le recul du canon": [
    { q: "(a) Vitesse de recul (positive dans le sens de l'obus)", v: -3, u: "m/s", p: { 3: "signe", "-300": "concept" } },
    { q: "(b) Force moyenne du frein", v: 9000, u: "N", p: { 4500: "formule", 2250: "formule" } },
    { q: "(c) Rapport K(obus) / K(canon)", v: 100, u: "", p: { 1: "concept", 0.01: "formule" } }
  ],
  "Le choc mou de deux wagons": [
    { q: "(a) Vitesse commune", v: 2, u: "m/s", p: { 1.5: "formule", 3: "concept" } },
    { q: "(b) Énergie cinétique perdue", v: 30, u: "kJ", p: { 90: "concept", 60: "concept", 30000: "unites" } }
  ],
  "Le choc élastique de deux billes": [
    { q: "Vitesse de la bille de 1 kg", v: -2, u: "m/s", p: { 2: "signe" } },
    { q: "Vitesse de la bille de 2 kg", v: 4, u: "m/s", p: { 2: "formule", 3: "formule" } }
  ],
  "Le pendule balistique (examen)": [
    { q: "Vitesse de la balle", v: 200, u: "m/s", p: { 1: "concept", 2: "concept" } },
    { q: "Énergie cinétique perdue dans le choc", v: 99.5, u: "%", tol: 0.005, p: { 0.5: "concept", 50: "concept" } }
  ],
  "Vitesse en bas d’une chute": [ { q: "Vitesse en bas", v: 19.8, u: "m/s", p: { 392: "formule", 14: "formule", 196: "formule" } } ],
  "Pendule lâché": [ { q: "Vitesse au point bas", v: 3.13, u: "m/s", p: { 9.81: "formule", 2.21: "formule" } } ],
  "Ressort qui propulse": [ { q: "Vitesse de sortie", v: 2, u: "m/s", p: { 4: "formule", 20: "unites", 0.2: "formule" } } ],
  "Toboggan avec frottement": [ { q: "Énergie dissipée", v: 852, u: "J", tol: 0.01, p: { 1600: "concept", 2452: "concept", 4052: "signe" } } ],
  "Hauteur minimale d’un looping": [ { q: "Rapport h / R", v: 2.5, u: "", p: { 2: "concept", 3: "calcul" } } ]
});
