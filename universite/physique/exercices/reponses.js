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
