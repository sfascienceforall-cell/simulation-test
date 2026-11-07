# Relecture du professeur de physique : pages Physique 3e à 6e (nuit du 3 au 4 novembre 2026)

Pages relues : `physique/3e`, `physique/4e`, `physique/5e`, `physique/6e` (160 simulations, 401 exercices dont 130 QCM).
Méthode : extraction de tous les exercices avec node (vm), relecture de chaque énoncé, choix, `pourquoi` et corrigé ; calculs refaits en Python (chaque ★★★ à ★★★★★ et la plupart des ★/★★) ; relecture de tous les « À retenir » et « Piège » ; code relu en détail pour les simulations signalées comme incertaines par les constructeurs.
Contrôle final : `check.py` sur les 4 `index.html` → **0 erreur** (bad = [], pageErrors = []). `node --check` passe sur tous les fichiers .js modifiés.

## 1. Tableau des éléments

| n° | Page · id / exercice | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 1 | 3e · c02 « Le fil en trop » (★★★★) | corrigé | (2,9/0,27)² vaut 115 et non « ≈ 114 » ; la réponse annonçait « × 110 environ » | Corrigé : « ≈ 10,74² ≈ 115 » ; réponse « × 115 environ » |
| 2 | 3e · c07 « Un astronaute sur la Lune » (QCM) | corrigé | Les distracteurs « 131 N » et « 784 N » ne valaient pas 80 × 1,62 = 129,6 ≈ 130 N et 80 × 9,81 = 784,8 ≈ 785 N (incohérent avec le corrigé, qui écrit 130 N et 785 N) | Choix et `pourquoi` : 130 N et 785 N, calculs indiqués |
| 3 | 4e · c03 « Interpréter les mesures d'un parachutiste » | corrigé | L'énoncé parlait de « chute stabilisée », alors que les données montrent une vitesse qui augmente et que la question porte justement sur l'approche de la vitesse limite | « en chute dans l'air (avant l'ouverture du parachute) » |
| 4 | 5e · c10 « Deux piles en opposition » (QCM) | corrigé | Distracteur « 0,67 A » sans erreur typique derrière (le `pourquoi` disait « tu as mal combiné les valeurs ») | Remplacé par « 0 A », l'erreur classique « les piles opposées s'annulent », avec son explication (10 − 4 = 6 V) |
| 5 | 5e · c07 « L'orbite géostationnaire » | corrigé | Le corrigé trouvait r = 42 178 km (avec GM = 3,99·10¹⁴) puis utilisait 42 164 km (valeur tabulée) ; v annoncée 3,07 puis 3,08 km/s | Valeurs harmonisées : 42 178 km, 4,218·10⁷ m, v = 3,08·10³ m/s ; h ≈ 35 800 km inchangé |
| 6 | 5e · p5-c09-equipotentielles (Piège) | corrigé | « Entre deux charges opposées, au milieu, V = 0 mais E est maximal » : faux sur le segment qui joint les charges (E y est minimal au milieu) | « V = 0 mais E ≠ 0 : il y vaut 8·k·q/d², dirigé de + vers − » |
| 7 | 3e · p3-c03-pile-citron | corrigé | Avec 2 citrons Cu/Zn en série (1,90 V), la note disait « tension suffisante, lueur faible » mais le voyant affichait « éteinte » (seuil 50 µA) ; incohérent aussi avec l'exercice c03 « Combien de citrons ? » (2 citrons = juste suffisant) | Seuil « à peine lumineuse » abaissé à 20 µA : 2 citrons → à peine lumineuse, 3 citrons → allumée. Valeurs Cu/Zn ≈ 0,95 V, Cu/Mg ≈ 1,6 V, r ≈ 1 kΩ : plausibles, annoncées comme ordres de grandeur |
| 8 | 4e · p4-c10-oeil-lunettes | corrigé | (a) Hypermétrope presbyte sans lunettes : la plage affichée était « de ∞ à ∞ » alors que rien n'est net. (b) Œil réduit « cristallin de 50 δ » : cohérent dans le code (rétine à 20 mm ; myope 21,5 mm → −3,49 δ ; hypermétrope 18,5 mm → +4,05 δ), mais présenté sans comparaison avec l'œil réel | (a) Affiche « aucune (même à l'infini, image derrière la rétine) ». (b) Piège : « lentille unique de 50 δ et rétine à 20 mm (l'œil réel fait ≈ 60 δ pour ≈ 17 mm) » |
| 9 | 6e · p6-c09-rayonnements | corrigé | Portée β dans l'air fixée à 3 m, alors que la note donne 0,54 g/cm² ÷ ρ (soit ≈ 4,5 m dans l'air) ; la décroissance linéaire de la transmission β n'était pas annoncée | Portée β 450 cm dans le code, piège « ≈ 4,5 m (0,54 g/cm² ÷ 1,2 mg/cm³) ; décroissance β schématisée comme linéaire ». Les μ/ρ à 1 MeV (Pb 0,0710 ; Al 0,0615 ; béton et papier ≈ 0,064 cm²/g) sont justes : épaisseur de demi-atténuation du plomb 8,6 mm ✓ |
| 10 | 3e · c01 « Le filet d'eau dévié » | corrigé (étoiles) | ★★★★★ pour un QCM de cours | ★★★ |
| 11 | 3e · c02 « Court-circuit de la pile » | corrigé (étoiles) | ★★★★★ pour un QCM direct | ★★★ |
| 12 | 3e · c04 « La thermistance » | corrigé (étoiles) | ★★★★★ ; I = U/R qualitatif | ★★★ |
| 13 | 3e · c09 « Boire avec une paille » | corrigé (étoiles) | ★★★★★ ; QCM de cours | ★★★ |
| 14 | 3e · c06 « Le différentiel » | corrigé (étoiles) | ★★★★★ ; piège classique plutôt que synthèse | ★★★★ |
| 15 | 3e · c07 « Tir à la corde » | corrigé (étoiles) | ★★★★★ ; piège action-réaction | ★★★★ |
| 16 | 4e · c01 « Contrôle de vitesse sur tronçon » | corrigé (étoiles) | ★★★★★ ; conversion + raisonnement sur la moyenne | ★★★★ |
| 17 | 4e · c08 « Papier et miroir » | corrigé (étoiles) | ★★★★★ ; QCM de connaissances | ★★★★ |
| 18 | 4e · c09 « Indice, vitesse et couleur » | corrigé (étoiles) | ★★★★★ ; QCM conceptuel | ★★★★ |
| 19 | 5e · c02 « La règle équilibrée » | corrigé (étoiles) | ★★★★★ ; un seul équilibre de moments | ★★★★ |
| 20 | 5e · c08 « Déviation d'un électron » | corrigé (étoiles) | ★★★★★ ; proportionnalité | ★★★★ |
| 21 | 5e · c09 « Électron entre les plaques » | corrigé (étoiles) | ★★★★★ ; v ∝ √x | ★★★★ |
| 22 | 5e · c10 « Deux piles en parallèle » | corrigé (étoiles) | ★★★★★ ; QCM de cours | ★★★★ |
| 23 | 6e · p6-c08-spectres (table des raies) | validé | — | H 410,2/434,0/486,1/656,3 ; He 447,1/471,3/492,2/501,6/587,6/667,8 ; Na 568,8/589,0/589,6/615,4 ; Hg 404,7/435,8/546,1/577,0/579,1 ; Ne 585,2 à 650,7 nm : conformes aux tables (longueurs d'onde dans l'air) |
| 24 | 6e · p6-c10-radiographie (μ/ρ) | validé | — | Eau 30→100 keV (0,3756 ; 0,2683 ; 0,2269 ; 0,2059 ; 0,1837 ; 0,1707 cm²/g) et os cortical (1,331 → 0,1855), ρ os 1,92 : conformes à NIST/ICRU. Exercices c10 « Atténuation des rayons X » et « Énergie et contraste » recalculés ✓ |
| 25 | 6e · p6-c10-echographie (impédances) | validé | — | Z tissus 1,63 ; graisse 1,38 ; muscle 1,70 ; os 7,8 ; air 0,0004 MRayl ; R os ≈ 43 % ✓ ; atténuation 0,5 dB/cm/MHz par sens = f·d aller-retour ✓ ; exercice « Échographie profonde » ✓ |
| 26 | 6e · c09 « Blindage d'une source γ » | validé | — | Demi-atténuation Pb 0,86 cm et béton 4,7 cm à 1 MeV : justes (faisceau étroit, sans facteur d'accumulation) |
| 27 | 4e · p4-c08-deux-miroirs | validé | — | Algorithme testé : 180° → 1, 90° → 3, 60° → 5, 45° → 7, 36° → 9, 30° → 11 images, quelle que soit la position. Seuls des angles avec 360°/θ pair sont proposés : la formule N = 360°/θ − 1 est exacte. Exercice c08 « Deux miroirs à 60° » ✓ |
| 28 | 5e · p5-c05-golf (traînée) | validé | — | F = ½ρC<sub>d</sub>Av², C<sub>d</sub> = 0,25, balle de 45,9 g et 42,7 mm : refait en Python, angle optimal 39° à 65 m/s et 56 % de portée perdue → « angle < 45° » et « 40 à 60 % » corrects. Modèle annoncé comme simplifié |
| 29 | 4e · p4-c03-parachute, p4-c03-tube-vide | validé | — | v<sub>lim</sub> = √(2mg/(ρS)) (C<sub>d</sub> = 1 intégré dans « S efficace ») : annoncé comme modèle simplifié |
| 30 | 4e · p4-c09-prisme | validé | — | Loi de Cauchy n = A + B/λ² : crown A = 1,5046 et B = 0,0042 µm² (BK7) ✓ ; le verre à dispersion exagérée est annoncé comme tel |
| 31 | 6e · p6-c10-effet-serre | validé | — | Modèle à une couche : σT<sub>s</sub>⁴ = 238/(1 − ε/2), T<sub>couche</sub> = T<sub>s</sub>/2<sup>1/4</sup>, ΔF = 5,35·ln(C/C₀) ✓ ; exercice c10 « Effet de serre » ✓ (255 K = −18,6 °C) |
| 32 | 6e · p6-c07-doppler | validé | — | f′ = f₀·v/(v ∓ v<sub>s</sub>), cas M ≥ 1 traité (« pas de son avant le passage »), sin α = 1/M ✓ |
| 33 | 5e · p5-c02-nappe | validé | — | D = μ₁gd(1 + μ₁/μ₂)/(A − μ₁g) redémontrée ✓ |
| 34 | g = 9,81 / 9,8 / 10 | signalé | La 4e (simulations et exercices) utilise partout g = 9,8 ; 3e, 5e et 6e utilisent 9,81. Aucune page n'utilise 10. Chaque page est cohérente | Pas de modification. À harmoniser plus tard si l'équipe préfère une seule valeur |
| 35 | Tous les autres QCM (130) | validé | Après relecture : l'index `bonne` désigne la bonne réponse, aucun distracteur n'est juste par arrondi ou par convention, les `pourquoi` correspondent aux bons choix | — |
| 36 | Tous les exercices ★★★ à ★★★★★ (≈ 240) | validé, sauf n° 1, 3 et 5 | Calculs refaits (Python) : unités, chiffres significatifs et résultats conformes. Exemples recalculés : puits (40,7 m), prisme (D 38,9° / 39,8°), fusée (37,3 m/s exact), pendule balistique (345 m/s), Millikan (n = 4), spectromètre Cl (Δ ≈ 12,4 mm), tsunami, Mach 2 (20,4 s), flûte (+30 cents), C-14, I-131, contraste RX | — |
| 37 | Exercices ★ et ★★ | validé | Tous lus, la plupart recalculés | — |
| 38 | Tous les « À retenir » et « Piège » (160 simulations) | validé, sauf n° 6, 8 et 9 | Relus un par un : justes ; les modèles simplifiés sont annoncés | — |

### Contenu qui dépasse le programme (signalé, non supprimé)
| n° | Élément | Remarque |
|---|---|---|
| S1 | 3e · p3-c10-aile + exercice c10 « La portance » | Portance ∝ v² et décrochage : hors référentiel de 3e (enrichissement). À garder en ★★★★★ / « pour aller plus loin » |
| S2 | 4e · c07 éclairement (lux, candela, E = I/d²) | Photométrie peu présente dans le référentiel FWB de 4e : à présenter comme enrichissement |
| S3 | 4e · c09 « Fibre optique » (angle d'acceptation √(n₁² − n₂²)) | Approfondissement au-delà des attendus de 4e |
| S4 | 5e · c09 charge RC exponentielle, relativité qualitative (« Quand la formule classique échoue ») ; 5e · c10 Kirchhoff à deux mailles, pont de Wheatstone, adaptation de puissance | À confirmer avec le référentiel « sciences générales » : plutôt approfondissement (souvent vu en 6e ou en option) |
| S5 | 6e · c04 lissage par condensateur ; c05 facteur Q, amortissement exponentiel ; c07 cents ; c10 forçage radiatif 5,35·ln(C/C₀) | Approfondissements, utiles pour la préparation au BA1 ; à étiqueter comme tels |

## 2. Bilan chiffré
- Éléments vérifiés : **401 exercices** (dont 130 QCM, tous ; environ 240 exercices ★★★ à ★★★★★ recalculés ; ★/★★ tous lus et la plupart recalculés) + **160 simulations** (« À retenir », « Piège » et titres relus pour toutes ; code relu en détail pour 13 d'entre elles : spectres, radiographie, échographie, rayonnements, deux miroirs, pile citron, œil, golf, parachute, prisme, effet de serre, Doppler, nappe).
- Éléments corrigés : **22** (5 exercices sur le fond, 4 simulations, 13 réétiquetages d'étoiles).
- Éléments signalés : **6** (g 9,8/9,81 et 5 dépassements de programme).
- Aucune réponse de QCM fausse trouvée. Aucune valeur de table fausse parmi celles qui étaient signalées comme incertaines.
- Contrôle `check.py` : 0 erreur sur 3e, 4e, 5e et 6e. `node --check` OK sur les 80 fichiers sims et exos.

## 3. Non vérifié faute de temps
- Code JavaScript ligne par ligne des ~147 autres simulations : seuls leurs textes (À retenir, Piège, notes) et les readouts principaux ont été relus. Le comportement aux bornes de chaque curseur n'a pas été testé à la main (check.py vérifie seulement l'absence d'erreur JS).
- En particulier, à relire en priorité : 3e c06 joule (modèle thermique), 4e c02 profil/dragsters, 4e c07 éclipses/phases (géométrie), 5e c04 chocs (coefficient de restitution), 5e c07 Kepler/canon de Newton (intégrateur), 5e c08 lignes de champ, 6e c01 boussole-terre, 6e c03 aimant-bobine (modèle dipôle), 6e c05 résonance, 6e c06 cuve à ondes (Huygens).
- Les fichiers `page.js` (résumés et « attendus » des chapitres) n'ont pas été comparés ligne à ligne au référentiel FWB.
- Les enjeux de licence (« contenu 100 % original ») n'ont pas été vérifiés.
