# Audit du code des simulations · Physique 5e et 6e secondaire

Périmètre : `physique/5e/sims-01…10.js` et `physique/6e/sims-01…10.js` (40 + 40 = 80 simulations, toutes lues dans le code).
Méthode : lecture ligne à ligne ; formules et conversions redémontrées à la main (ou en Python) ; géométrie des dessins (sens des flèches, échelles, axes) recoupée avec les valeurs ; « À retenir », « Piège », notes et défis comparés au comportement réel ; cas limites testés par un script Playwright (`/home/claude/audit/stress.py` : 40 à 60 combinaisons de curseurs par simulation, dont toutes les bornes, tous les boutons, tous les menus ; il cherche NaN, Infinity, undefined, null, « [object » dans les lecteurs et les notes, et tout argument non fini passé au canvas). Résultat final du script : aucun NaN/Infinity/undefined, aucun argument non fini au canvas ; les seuls « — » et « ∞ » restants sont des affichages voulus (grandeur sans objet, évasion).
Contrôle final : `check.py` sur `physique/5e/index.html` et `physique/6e/index.html` : **0 erreur** (bad = [], pageErrors = []). `node --check` OK sur les 20 fichiers sims.
Les éléments déjà notés « validé » dans `RELECTURE-PROF-physique.md` (nappe, golf, Doppler, spectres, radiographie, échographie, rayonnements, effet de serre, équipotentielles) n'ont pas été refaits sur le fond ; leur code a seulement été relu pour les cas limites.

Bilan : 80 simulations auditées · 26 corrigées (dont 8 corrections mineures ou de texte) · 54 sans défaut · 3 points signalés sans modification (dont 1 simulation notée « ok (signalé) ») · 0 non auditée.

## 5e secondaire

| id | statut | problème | correction |
|---|---|---|---|
| p5-c01-somme | ok | — (valeurs, signes, angle et notes justes ; « — » pour l'angle quand R = 0 est voulu) | — |
| p5-c01-incline | ok | — (P∥, P⊥, flèches, défis à 30°/60°/45° atteignables au pas de 1°) | — |
| p5-c01-remorqueurs | ok | — (R = 2F·cos θ cohérent ; la tolérance de 2 kN pour « tout droit » n'est pas annoncée mais sans conséquence) | — |
| p5-c01-cables | corrigé | Le dessin ne respectait pas l'angle α : la flèche verticale était plafonnée (sag ≤ H − 80), donc au-delà de ≈ 35° les câbles restaient à ≈ 35° alors que les flèches T et la valeur de α changeaient. De plus la charge et son poids sortaient du cadre (250 px) aux grands angles et chevauchaient le message « RUPTURE ». | Demi-portée adaptée (`hs = min(demi-largeur, sagMax / tan α)`) : l'angle dessiné est toujours α (à 90° les câbles sont verticaux). Hauteur maximale réduite (H − 130) pour que charge, poids et message restent visibles ; repère « α » recalculé. |
| p5-c02-palet | corrigé | Le « frottement » et ΣF restaient affichés (−0,5 N…) après l'arrêt du palet alors que v = 0 (plus aucune force de frottement). | Force de frottement affichée = 0 une fois le palet arrêté (ΣF l'était déjà). |
| p5-c02-poutre | ok | — (moments, sens horaire, réaction du pivot justes) | — |
| p5-c02-train | ok | — (tan θ = a/g, T = m√(g²+a²), sens de la déviation, défis 8°/18°/25° atteignables) | — |
| p5-c02-nappe | corrigé | Après une expérience, changer A ou μ₁ laissait à l'écran l'ancienne animation et l'ancien résultat (« tombe » / « reste ») à côté de la prévision du nouveau réglage : deux messages contradictoires. Formule D et logique validées (non refaites). | L'animation est invalidée dès qu'un réglage change (retour à l'état « Appuie sur Tirer la nappe »). |
| p5-c03-chariot | ok | — (a, T = M(a + μg), cas « ne démarre pas » T = m·g) | — |
| p5-c03-forces | corrigé | (1) Quand les forces appliquées étaient plus faibles que le frottement maximal mais que le bloc avait de la vitesse, l'animation le faisait s'arrêter puis repartir en arrière (v changeait de signe) : contraire au Piège de la page (« le frottement ne peut pas retourner le bloc »). (2) Le défi « a = 0 sans forces nulles » n'exigeait pas de force non nulle. | (1) Si v change de signe alors que |ΣF appliquées| ≤ f max, v est ramenée à 0 (arrêt, puis statique). (2) Le défi n°4 exige maintenant F₁ + F₂ > 0. |
| p5-c03-fusee | corrigé | Si F était inférieure au poids initial mais supérieure au poids à vide (ex. F = 300 N, m₀ = 20 kg, carburant 30 kg), la simulation affichait « reste au sol » et « a au départ = −4,8 m/s² » alors que le carburant brûle sur le pas de tir et la fusée décolle au bout de ≈ 9,7 s ; la ligne « a avant l'extinction » (positive) contredisait le message. De plus, « a au départ » négatif n'a pas de sens physique (le sol compense). | Simulation corrigée (la fusée reste posée tant que F ≤ m·g, le carburant brûle, décollage différé ; message dédié avec l'instant du décollage) ; « a au départ » et « a avant l'extinction » affichent « 0 (reste au sol) » quand F ≤ m·g ; message « jamais » seulement si F ≤ m₀·g ; « À retenir » précisé (m = masse à cet instant). |
| p5-c03-ascenseur | ok | — (N = m(g + a) borné à 0, cas a ≈ −g et a < −g signalés) | — |
| p5-c04-chocs | corrigé | Avec des vitesses élevées, après le choc un chariot sortait de l'écran (centaines d'unités) et l'animation continuait jusqu'à 9 s sur un cadre vide. Formules (u₁, u₂, e) justes. | L'animation s'arrête quand un chariot va quitter la zone visible. |
| p5-c04-patineurs | ok | — (vA = F·Δt/m, p total = 0, ratio vA/vB = mB/mA) | — |
| p5-c04-canon | corrigé | Aucun avertissement pour des réglages absurdes (M = 50 kg, m = 20 kg, v = 800 m/s : recul de 320 m/s). Les formules sont justes. | Avertissement affiché quand V > 20 m/s (recul irréaliste, modèle toujours valable). |
| p5-c04-airbag | corrigé | L'axe vertical était calé sur la valeur à 10 ms alors que le curseur descend à 5 ms : le point et son étiquette sortaient du cadre (force ×2). L'échelle fixe écrasait la courbe aux réglages usuels. La couleur du point (rouge si > 50 % de l'axe) ne correspondait pas aux seuils annoncés dans le message (15 g, 40 g). | Axe adapté au point choisi (`ymax` = 1,4 × F, min. 20 kN) ; couleur du point alignée sur les seuils du message (vert < 15 g < orange < 40 g < rouge). |
| p5-c05-incline-frott | ok | — (N, f statique/cinétique, angle limite, a ; μc > μs ramené à μs et signalé) | — |
| p5-c05-tir | corrigé | Le graphe des vitesses ne contenait pas la vitesse verticale finale quand la hauteur de départ est grande (v₀ = 5 m/s, H = 20 m : v_y final ≈ −20 m/s pour un axe borné à ±10,5) : la droite sortait du cadre. | Axe vertical ajusté sur max(v₀, |v_y final|). |
| p5-c05-blocs | corrigé (mineur) | Accélération affichée sans unité dans le lecteur « t = … s (a = …) ». | Unité m/s² ajoutée. |
| p5-c05-golf | ok | — (validé par le prof ; borne de portée et boucle de recherche de l'angle optimal sans NaN) | — |
| p5-c06-pierre | ok | — | — |
| p5-c06-rupture | ok | — (cible hors du cercle, tangente, meilleure position de coupe correctes) | — |
| p5-c06-virage | corrigé | Avec μ = 0, la plage « sans dérapage » se réduit à un point : à 1 km/h de la vitesse idéale (pas du curseur), le message annonçait « Trop vite/Trop lentement » et le point était rouge, et le message « vitesse idéale » n'apparaissait jamais. Équations (N, f, vmin, vmax) redémontrées : justes. | Tolérance = demi-pas du curseur (0,14 m/s) pour l'appartenance à la plage, le message « trop vite » et la couleur du point. |
| p5-c06-rotor | ok | — | — |
| p5-c07-terre-lune | corrigé | Aux grandes distances (d > 550 · 10³ km) la Lune sortait du cadre (rayon d'orbite jusqu'à 190 px pour un canvas de 130 px de demi-hauteur). | Échelle plafonnée à 105 px ; valeurs de la note (1,98·10²⁰ N, 27,3 j) vérifiées. |
| p5-c07-satellite | ok (signalé) | Valeurs justes (g(400 km) = 8,69 m/s², T géostationnaire OK, le bouton 35 786 km est ramené à 35 800 km par le pas du curseur et reste « géostationnaire »). Le lecteur « g / g au sol » prend 9,82 m/s² (valeur GM/R⊕² du modèle) alors que la page utilise 9,81 ailleurs : l'écart n'est que dans le 3e chiffre. | Signalé, non modifié. |
| p5-c07-newton | corrigé | (1) Altitude min/max calculées par intégration numérique tronquée (arrêt à 6r₀ + 3·10⁷ m) : fausses pour les ellipses très allongées (apogée jamais atteinte). (2) Pour V légèrement inférieure à v_c au niveau du sol (7,90 km/s), l'étiquette disait « orbite quasi circulaire » alors que le périgée est à 15 km sous terre (impact). (3) Pour v < v_c avec périgée au-dessus du sol (tir depuis 1 500 km), le message parlait de « entre v_c et √2·v_c ». | Périgée/apogée calculés exactement (conservation de l'énergie et du moment cinétique) ; test d'impact analytique ; l'impact est testé avant l'étiquette « quasi circulaire » ; message dédié pour v < v_c sans impact (le point de tir est l'apogée). |
| p5-c07-kepler | ok | — (position par équation de Kepler, vis-viva avec 29,78 km/s, T² = a³/M) | — |
| p5-c08-deux-charges | ok | — (F = k|q₁q₂|/d², sens des forces, arrêt des lignes de champ) | — |
| p5-c08-charge-essai | corrigé (mineur) | L'échelle « 70 px = X kN/C » s'affichait « 0 kN/C » quand le champ est inférieur à 500 N/C. | Affichage en N/C sous 1 000 N/C, kN/C avec une décimale au-dessus. |
| p5-c08-condensateur | corrigé | Quand la particule passe à peine entre les plaques (d = 5 cm), le point d'impact sur l'écran (placé à 3,5 cm des plaques, hauteur 8 cm) sortait de l'écran, voire du canvas. Formules (E = U/d, y = ½at², sens e⁻/p⁺ selon la polarité) justes. | Écran ramené à ± 3,2 cm ; si l'impact dépasse l'écran, la trajectoire est arrêtée à son bord et le message « elle passe au-dessus/au-dessous de l'écran » s'affiche. |
| p5-c08-millikan | ok | — (U d'équilibre de chaque gouttelette entre 563 et 693 V, dans la plage 0–800 V ; Stokes correct) | — |
| p5-c09-equipotentielles | corrigé (mineur) | Point A ou B posé sur une charge : V et E tronqués à r = 3 cm sans avertissement. | Avertissement quand un point est à moins de 5 cm d'une charge. |
| p5-c09-accelerateur | ok | — (γ = 1 + qU/mc², seuils 10 % de c et 1 % vérifiés) | — |
| p5-c09-rc | corrigé | (1) Changer R, C ou E pendant ou après une expérience laissait l'ancien historique tracé avec la nouvelle échelle de temps τ (courbes fausses). (2) Le courant initial tracé était 0 au lieu de E/R au premier point. (3) Si E diminuait après une charge, U_C dépassait l'axe. | Historique réinitialisé à chaque changement de R, C ou E ; premier point du courant = (E − U_C)/R ; axes adaptés à max(E, U_C) et au courant maximal. |
| p5-c09-flash | ok | — | — |
| p5-c10-deux-mailles | ok | — (I₁, I₂, I₃ redémontrés ; sens des flèches cohérents avec les piles) | — |
| p5-c10-pile | ok | — | — |
| p5-c10-diviseur | ok | — | — |
| p5-c10-wheatstone | corrigé | Avec R₂ = 10 000 Ω et R_x = 1 200, 220 ou 3 300 Ω, l'équilibre exigerait R_v = 12 000, 2 200… Ω, hors de la plage du curseur (1–5 000 Ω) : l'élève cherchait un équilibre inatteignable sans le moindre signal. | Avertissement quand R_v nécessaire est hors plage (sans révéler R_x). |

## 6e secondaire

| id | statut | problème | correction |
|---|---|---|---|
| p6-c01-aimant-boussoles | corrigé (mineur) | Boussole d'essai placée exactement au centre de l'aimant : division par 0 (angle et B relatif « — »). | Garde sur r < 1 px. |
| p6-c01-fil-boussoles | corrigé | Le lecteur « B / B terrestre » divisait par 48 µT (champ total) alors que la page (et la déviation tan δ = B/B_H) utilise la composante horizontale de 19 µT : valeur 2,5 fois trop petite, incohérente avec l'angle affiché. | Ratio avec B_H = 19 µT, libellé « B du fil / B terrestre horizontal ». |
| p6-c01-solenoide | ok | — (B = μ₀NI/L, noyau μr ≈ 300 saturé à 1,6 T, face Nord vue anti-horaire) | — |
| p6-c01-boussole-terre | ok | — (tan I = 2 tan φ ; B_r = −2B₀ sin φ, B_n = B₀ cos φ ; sens de l'aiguille) | — |
| p6-c02-particule-champ | ok | — (sens de rotation vérifié pour les 3 particules et les 2 sens de B) | — |
| p6-c02-rail-laplace | ok | — (sens de la force vérifié ; l'étiquette « 1 m » est approximative, annoncé « animation ralentie ») | — |
| p6-c02-moteur-cc | ok | — (couple moyen 2/π, sens des forces avec commutateur) | — |
| p6-c02-spectrometre | corrigé (texte) | Le Piège disait « ce n'est pas la tension U qui sépare les isotopes mais le champ B », formulation ambiguë (r dépend des deux). | Reformulé : U donne la même énergie cinétique, le tri vient de la déviation dans B (plus grande quantité de mouvement, plus grand rayon). |
| p6-c03-aimant-bobine | ok | — (dΦ/dz et valeur du pic redémontrés) | — |
| p6-c03-alternateur | ok | — (Φ, e = NBAω sin ωt, phase des points) | — |
| p6-c03-lenz | ok | — (face induite, sens du courant, force sur l'aimant : 4 cas vérifiés) | — |
| p6-c03-aimant-tube | ok | — (v lim = mg/k, chute avec frein exponentiel) | — |
| p6-c04-oscilloscope | ok | — | — |
| p6-c04-transformateur | corrigé (mineur) | Aucun avertissement avec N₂/N₁ = 40 et R = 5 Ω (plusieurs kW dans un « transformateur de laboratoire »). | Message d'alerte au-delà de 10 kW ; le calcul idéal reste affiché. |
| p6-c04-ligne-ht | ok | — | — |
| p6-c04-redressement | ok | — (moyennes U_max/π et 2U_max/π ; lissage RC) | — |
| p6-c05-masse-ressort | ok | — | — |
| p6-c05-pendule | ok | — (période exacte par AGM ; écart de 7 % à 60° juste) | — |
| p6-c05-amortissement | corrigé | « Temps pour amplitude ÷ 2 » valait ln 2/γ dans tous les régimes ; faux pour le régime critique et apériodique (pas d'enveloppe e^(−γt)). | Calculé à partir de x(t) = x₀/2 quand il n'y a pas d'oscillation. |
| p6-c05-resonance | ok | — | — |
| p6-c06-corde-onde | ok | — | — |
| p6-c06-cuve-ondes | corrigé | En mode deux fentes, la largeur réellement tracée est limitée à d − 0,5 cm, mais « 1er minimum (1 fente) » et la note utilisaient la valeur du curseur a : lecteur incohérent avec le dessin. | Le lecteur et le message utilisent la largeur réellement dessinée. |
| p6-c06-stationnaire | ok | — | — |
| p6-c06-ola | corrigé | Avec un retard de 0,04 s et 1,5 s debout, « 37,5 personnes debout » alors que la rangée n'en compte que 30 (et bosse de 18,8 m pour une rangée de 14,5 m). | Valeurs plafonnées à la rangée avec mention explicite. |
| p6-c07-generateur | ok | — (notation française : la₃ = 440 Hz, do₃ ≈ 262 Hz) | — |
| p6-c07-doppler | corrigé | À source immobile (v_s = 0), les fronts d'onde s'accumulaient sans fin (un nouveau toutes les 0,22 s, jamais supprimé) : ralentissement progressif de l'animation. Formules validées. | Les fronts dont le rayon dépasse 1,5 × la largeur sont retirés. |
| p6-c07-decibels | ok | — | — |
| p6-c07-tuyau | ok | — | — |
| p6-c08-spectre-em | ok | — | — |
| p6-c08-young-reseau | ok | — (i = λD/a, N fentes, ordres du réseau) | — |
| p6-c08-spectres | ok | — | — |
| p6-c08-polariseurs | ok | — (12,5 % avec trois polariseurs, naturelle ½) | — |
| p6-c09-bohr | ok | — | — |
| p6-c09-decroissance | ok | — | — |
| p6-c09-carbone14 | ok | — | — |
| p6-c09-rayonnements | ok | — | — |
| p6-c10-echographie | ok | — (validé par le prof ; t = 2d/v et −f·d dB contrôlés) | — |
| p6-c10-radiographie | ok | — | — |
| p6-c10-doses | ok | — (dose maximale cumulable 22,85 mSv : le message « > 20 mSv » reste atteignable) | — |
| p6-c10-effet-serre | ok | — (flux à une couche redémontrés : OLR = σT⁴(1 − ε/2), retour = εσT⁴/2) | — |

## Points signalés (non modifiés)
1. **g** : la 5e et la 6e utilisent 9,81 m/s² ; `p5-c07-satellite` calcule « g / g au sol » avec 9,82 (GM/R⊕² du modèle). Écart au 3e chiffre ; à harmoniser si l'équipe choisit une seule valeur (cf. n° 34 de la relecture prof).
2. **p6-c02-rail-laplace** : l'étiquette « 1 m » est posée à l'extrémité du rail alors que la tige parcourt (x₁ − x₀ − 60) px ; l'animation est annoncée comme accélérée ou ralentie (durée réelle dans le lecteur), seule l'étiquette est approximative.
3. **p6-c09-bohr** (absorption) : l'ondulation du photon entrant est schématique (position non à l'échelle).

## Remarques de méthode
- Sans objet ou intentionnel, laissés tels quels : les « — » des grandeurs sans objet (angle de R quand R = 0, « Part utile » quand F₁ + F₂ = 0, déviation du proton, etc.) et le « ∞ » de l'altitude maximale en cas d'évasion.
- Script de test : `/home/claude/audit/stress.py <index.html…> [--only id1,id2]`.
