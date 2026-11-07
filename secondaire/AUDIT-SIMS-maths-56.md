# Audit des simulations de mathématiques : 5e et 6e secondaire

Périmètre : `maths/5e` (40 simulations, `sims-01..10.js`) et `maths/6e` (40 simulations, `sims-01..10.js`), soit 80 simulations lues intégralement dans le code. Les rapports `RELECTURE-PROF-*.md` ont été pris en compte : ce qui y est « validé » n'a pas été refait, mais le code a quand même été relu pour les points 2 et 4 (dessin et cas limites), que les relecteurs n'avaient pas couverts.

Méthode :
- Formules refaites à la main ou en Python/scipy : annuité, intérêts, boîte, clôture, sauveteur (Snell), Φ (erf) et binomiale (comparées à scipy, écart < 1e-9), régressions et quartet d'Anscombe, sections de cube, point d'intersection de deux et trois plans (vérifié par substitution), Cramer, déterminant D(m), élimination de Gauss sur les 4 systèmes, dérivées secondes de l'étude guidée.
- Banc d'essai maison (`/home/claude/audit-tools/bench.js`) : chaque simulation est exécutée avec un faux DOM, curseurs aux deux bornes, un par un et tous ensemble, puis 400 combinaisons aléatoires ; détection de NaN, undefined, Infinity, null dans les lectures et notes. Résultat final : 0 exception, 0 valeur invalide, sur les 80 simulations.
- `node --check` sur tous les `sims-NN.js` modifiés et sur `_lib/sfa-sec.js`.
- `python3 _lib/check.py` sur `maths/5e/index.html` (40 sims, 100 exos) et `maths/6e/index.html` (40 sims, 101 exos) : **0 erreur**, `bad: []`, `pageErrors: []`.

Légende : ok = code relu, rien à corriger ; corrigé = modifié ; signalé = non modifié, à décider.

## 5e

| id | statut | problème | correction |
|---|---|---|---|
| m5-c01-composee | corrigé | Pour f = x², g = √x, l'écriture « √x² » est ambiguë (√(x²) ou (√x)² ?), alors que f∘g = (√x)² = x. | `wrap()` met aussi les parenthèses autour d'une racine : « (√x)² ». |
| m5-c01-symetrie-reciproque | corrigé | Pour f(x) = 2x − 3, a variait de −3 à 3 : P sortait du cadre (f(−3) = −9, cadre ±6). Pour 1/x, a = 0,05 donne b = 20, hors cadre, sans avertissement. | Bornes de a pour f(x) = 2x − 3 ramenées à [−1,5 ; 4,5] (f reste dans ±6). Note d'avertissement si P ou Q sort du cadre (valeurs affichées inchangées, justes). |
| m5-c01-restriction | ok | Solutions, injectivité, f⁻¹(c) vérifiés pour h, c aux bornes et branches x ≥ h, x ≤ h. | |
| m5-c01-homographique | ok | Asymptotes −d/c et a/c, signe de ad − bc, symétrie du centre : exacts ; cas c = 0, d = 0, ad − bc = 0 traités. | |
| m5-c02-escalier-boule | corrigé | Test « q < 1 » sans tolérance (flottants) : mauvais message possible à q = 1. | `q.value < 1 - 1e-9`. |
| m5-c02-interets | ok | Doublement 1/t (simple) et ln 2 / ln(1+t) (composé), 1,03⁵ = 1,1593 : exacts. | |
| m5-c02-gauss | ok | S = n(u₁ + uₙ)/2 toujours entier ou demi-entier affiché avec 1 décimale ; rectangle cohérent. | |
| m5-c02-credit | corrigé | Les barres étaient dessinées avec des marges (r 12, t 18, b 30) différentes de celles du repère (16, 16, 34) : barres décalées de 4 px par rapport aux graduations, hauteurs légèrement fausses. | Mêmes marges passées à `axes()`. Annuité vérifiée (20 000 € à 5 % sur 10 ans : 2 590,09 €). |
| m5-c03-approche | ok | Limites gauche/droite des 6 cas, fenêtre de zoom, trou en (a ; L) : justes. | |
| m5-c03-infini | ok | Limites en ±∞ des 5 fonctions, recherche du x à partir duquel |f − L| < ε : cohérent avec la bande dessinée. | |
| m5-c03-indetermination | ok | Les 6 limites (6 ; −1/4 ; 1/4 ; 3/5 ; 1/2 ; +∞) et leurs étapes vérifiées. | |
| m5-c03-saut | ok | Limites à gauche/droite de s/(x−2) et s/(x−2)² selon le signe de s, s = 0 traité. | |
| m5-c04-asymptotes | corrigé | (1) Division euclidienne affichée « + −3 » quand le reste est négatif, et « (x − 0) » pour p = 0. (2) L'asymptote horizontale y = 0 (a = b = 0) annoncée dans la lecture mais non dessinée. (3) L'oblique était tracée hors du cadre (sur les marges et les étiquettes). Point discuté par le professeur (non modifié) : « AH : aucune (f constante) » quand le numérateur s'annule en p avec a = 0. | Signes formatés (« − 3/(x − 1) »), p = 0 écrit « x », y = B tracée dès que a = 0 avec asymptote verticale, oblique clippée dans le repère. Le point discutable du professeur n'est pas modifié. |
| m5-c04-croise | ok | f(x) − 2 = (kx − 2)/(x² + 1), croisement en 2/k : exact, fenêtre suffisante pour |k| ≤ 6. | |
| m5-c04-continuite | ok | Les 5 cas et les trois voyants cohérents avec le dessin. | |
| m5-c04-prolongement | corrigé | Notes « f(x) = x + −1 » pour a < 0 ; la valeur c = ±8 (curseur) sortait du cadre y ∈ [−7 ; 7]. | Signe formaté (« x − 1 »), cadre y ∈ [−8 ; 8]. |
| m5-c05-secante | corrigé | Équation de la tangente affichée « … + −2,5 » quand f(a) < 0, et « (x − 0) » pour a = 0. | Signe et cas a = 0 formatés. |
| m5-c05-courbe-derivee | corrigé | Pour 2/x, le curseur x pouvait descendre à −2,5 alors que le point était bloqué à 0,4 (curseur et valeurs en désaccord) ; f′(0,4) = −12,5 sortait du cadre de f′ ([−6 ; 1]). | Borne basse du curseur synchronisée sur le domaine de la fonction ; domaine minimal 0,6 (f′ = −5,6 dans le cadre). |
| m5-c05-regles | ok | Règles du produit, du quotient, de la composée et « naïves » ; comparaison avec la dérivée numérique centrée : identiques. | |
| m5-c05-vitesse | corrigé | Le deuxième point de la sécante, en t₀ + Δt (jusqu'à 5 s), était dessiné hors du graphique (axe limité à 3,5 s), sur la colonne d'animation. | Point clippé dans le repère. Valeurs (vitesse moyenne 9,8·t₀ + 4,9·Δt) justes. |
| m5-c06-boite | ok | V′ = (a − 2x)(a − 6x), max en a/6, valeur 2a³/27 : exacts ; x limité à a/2 avec message. | |
| m5-c06-tangente-tourne | corrigé | Fenêtres trop petites : pour x³, f(2,2) = 10,6 > 9 et f′ = 14,5 > 14 ; pour x⁴ − 4x², f′(2,2) = 25 pour une fenêtre ±14 : le point rouge sortait du cadre. | Fenêtres agrandies ([−12 ; 12] / [−2 ; 16] et [−26 ; 26]). Tableau de signes revérifié. |
| m5-c06-cloture | corrigé | Le « Piège » écrivait deux fois le même domaine « 0 < x < L/2 (rivière) ou 0 < x < L/2 (fermé) », ce qui laissait croire à une différence. | Texte unifié : « dans les deux modes ». Formules (L²/8, L²/16, x = L/4) vérifiées. |
| m5-c06-sauveteur | ok | T(x), minimum par recherche ternaire, loi de Snell sin θ₁/v₁ = sin θ₂/v₂ : exacts. | |
| m5-c07-plan | corrigé | (1) Pour (x² + 1)/(x − 1), l'étape « points de repère » reliait les deux extrema par un trait traversant l'asymptote verticale (faux : deux branches). (2) Pour x√(4 − x²), le texte disait « f′ tend vers ∓∞ aux bornes » : f′ est paire et tend vers −∞ aux deux bornes. | Segment coupé à la traversée d'une asymptote ; texte corrigé (« −∞ aux deux bornes »). |
| m5-c07-f-fprime | corrigé | Si f′ est nulle sur tout un intervalle (palier), aucun extremum n'est détecté et le tableau annonce « strictement monotone » sans nuance. | Avertissement ajouté dans ce cas. Intégrale (trapèzes exacts pour une f′ affine par morceaux) et extrema vérifiés. |
| m5-c07-appariement | signalé | Les quatre candidates partagent la même échelle verticale (choix pédagogique) : quand f est candidate-piège de grande amplitude, les trois autres sont aplaties. Les six paires f/f′ sont justes. | Non modifié. |
| m5-c07-famille | corrigé | Pour m = 0, la lecture affichait « Asympt. oblique y = x », alors que f(x) = x est cette droite (pas d'asymptote). | Affichage « aucune (f = x) » ; « À retenir » précisé (« pour m ≠ 0 »). |
| m5-c08-sinusoide | corrigé | Pour a = ±3 et d = 2, la barre de la période (D + |a| + 0,4 = 5,4) sortait de la fenêtre y ∈ [−5 ; 5]. | Fenêtre [−6 ; 6]. Amplitude, période 2π/|b|, décalage −c/b et cible du défi vérifiés. |
| m5-c08-ondes | ok | Identité sin + sin = 2 cos·sin, enveloppe √(A₁² + A₂² + 2A₁A₂ cos 2πΔf t) exacte (majore la somme), fréquence de battement |f₁ − f₂|. | |
| m5-c08-addition-cercle | ok | B = cos b·u + sin b·v : coordonnées = (cos(a + b), sin(a + b)). | |
| m5-c08-equation | corrigé | Pour tan x = k, la droite y = kx était tracée sans clip : elle traversait les étiquettes et les marges du cercle pour |k| grand. | Tracé clippé dans le repère. Solutions générales et valeurs en π vérifiées. |
| m5-c09-cube-droites | ok | Relations (confondues, parallèles, sécantes, gauches) exactes pour les 20 droites ; rotation et visibilité des arêtes cohérentes. | |
| m5-c09-section | corrigé | Avec n = (2, 2, 2) et d = 1,5, la note affichait « plan perpendiculaire à la grande diagonale passant par le centre : hexagone régulier » alors que la section est un triangle (x + y + z = 0,75) ; le centre est en d = (nx + ny + nz)/2. | Condition `d = dmax/2`. Nature de la section (triangle, carré, losange, pentagone, hexagone) vérifiée. |
| m5-c09-cavaliere | corrigé | Pour k = 1 et α = 75°, le cube sortait du canvas par le haut (côté fixe `s`). | Côté `s` calculé pour que le cube tienne dans le canvas. Diagonale B–G′ (4√2 réel) et angle apparent exacts. |
| m5-c09-gauches | ok | Distance h (gauches) et √(1 + h²) (parallèles), abscisse d'intersection −cos φ / sin φ ; « −0 » pour φ = 90° neutralisé par `S.fmt` (voir moteur). | |
| m5-c10-angle | ok | cos θ, θ, signe du produit scalaire ; vecteur nul traité. | |
| m5-c10-projection | corrigé | La droite support de v (±20·v) sortait du repère sur les marges. | Clippée. Projection (u·v/|v|²)·v exacte. |
| m5-c10-distance | corrigé | Droite tracée hors repère ; pied H ou point Q pouvant sortir du cadre sans avertissement (c = ±10). | Droite clippée, avertissement « H ou Q hors du cadre » dans la note. Formule |ax₀ + by₀ + c|/√(a² + b²) vérifiée. |
| m5-c10-travail | corrigé | La flèche de la force (jusqu'à 104 px) sortait du canvas à gauche (θ = 180°, début de course) ou à droite (θ = 0°, fin de course). | Marges 75 px de chaque côté, longueur de flèche réduite. W = F·d·cos θ vérifié (θ = 90° : 0). |

## 6e

| id | statut | problème | correction |
|---|---|---|---|
| m6-c01-famille | ok | Pente ln a en 0, valeurs a², 1/a, base e : exactes. | |
| m6-c01-reciproque | corrigé | Pour a = 10 ou a = 2 avec t = 3, P et Q sortent du cadre sans avertissement ; étiquettes « a^x » et « y = x » placées hors du repère ou sur les graduations. | Légende fixe en haut du repère, note d'avertissement hors cadre (les valeurs restent justes), note explicative sinon. |
| m6-c01-echelle-log | ok | Axe log, doublement ln 2/ln b, pente log₁₀ b, rapport y(10)/y(5) (b⁵ ou 32) : justes ; zéro non tracé en échelle log. | |
| m6-c01-demi-vie | signalé | Âge t = T·ln(100/p)/ln 2 exact. La branche « plus de 9 demi-vies » est inatteignable : p ≥ 0,5 % limite n à 7,64 demi-vies, alors que le piège évoque 9 demi-vies (carbone 14). | Non modifié (abaisser le minimum du curseur à 0,1 % changerait la mise en page). À décider. |
| m6-c02-exp-derivee | corrigé | Pour a = 3 et x = 3, la hauteur 27 sortait du cadre (y ≤ 12) ; point et tangente invisibles. | Curseur limité à x ≤ 2,4, cadre y ≤ 16 (3^2,4 = 14). |
| m6-c02-croissance | corrigé | En logistique, la ligne pointillée de l'inflexion dépassait le repère à droite quand t_s > 20. | Ligne limitée à la fenêtre. Seuil « Bravo » (SCE < 2) vérifié : la SCE aux vrais paramètres vaut 1,0. |
| m6-c02-comparees | ok | Maximum de x^n/e^x en x = n (21,06 pour n = 5) et de ln x/x^n en e^(1/n). | |
| m6-c02-etude | ok | Les quatre études (dérivées, extremums, inflexions e^1,5 ≈ 4,48) recalculées. | |
| m6-c03-famille | ok | Primitives, tangentes parallèles. | |
| m6-c03-reconstruire | corrigé | L'échelle verticale de F était fixe ([−8 ; 8]) alors que F peut atteindre ±20 (f = 3 sur [0 ; 6], F(0) = 3) : la courbe sortait du cadre. | Échelle de F calculée sur les valeurs. L'intégrale est calculée une fois par dessin (cumul) au lieu d'une intégrale par point. |
| m6-c03-condition-initiale | corrigé | En changeant de fonction, le point A restait à ses anciennes coordonnées, parfois hors cadre. | A ramené dans la fenêtre de la fonction choisie. |
| m6-c03-vitesse-trajet | ok | Distances totales 180 m, 225 m, 240 m ; défi à 100 m atteignable au pas de 0,1 s. | |
| m6-c04-riemann | ok | Les quatre intégrales exactes et les trois méthodes. | |
| m6-c04-aire-entre-courbes | ok | Intersections 2x² + px + (q − 4) = 0 (discriminant toujours > 0), primitive de f − g ; aire 9 pour p = −2, q = 0. | |
| m6-c04-aire-algebrique | ok | A(4) = 0 et aire géométrique 8 pour x(x − 2)(x − 4). | |
| m6-c04-revolution | corrigé | Le « Contrôle » du texte utilisait le cône sur [0 ; 6] (V = 18π), impossible à reproduire : le curseur b s'arrête à 4. | Contrôle réécrit pour b = 4 : rayon 2, hauteur 4, V = 16π/3 ≈ 16,76 (valeur affichée par la simulation). Les quatre formules de V vérifiées. |
| m6-c05-plan-normal | ok | Distance |d|/‖n‖, pied H, sphère tangente, message « hors cube » (seul cas : normale sur un axe, d = ±6). | |
| m6-c05-droite-deux-points | ok | Équations paramétriques et cartésiennes, coordonnées nulles. | |
| m6-c05-droite-plan | corrigé | Le point d'intersection pouvait sortir du cube et du canvas (t jusqu'à 9) : point absent ou hors cadre, sans explication. | Point tracé seulement s'il est dans le cube, sinon note d'avertissement avec ses coordonnées exactes. |
| m6-c05-plans-secants | corrigé | Même problème pour le point de départ de la droite d'intersection. | Même correction. Formule du point commun vérifiée (n₁·X = d₁, n₂·X = d₂). |
| m6-c06-trois-plans | corrigé | Point solution ou point de la droite de solutions pouvant sortir du cube dessiné. | Même correction ; note d'avertissement. Rangs, Cramer et cas « prisme » vérifiés. |
| m6-c06-gauss | ok | Les 4 systèmes (solution (1 ; 2 ; 3), pivot nul avec échange, indéterminé (3 − 2t/3 ; 3 − t/3 ; t), impossible) recalculés pas à pas. | |
| m6-c06-parametre | ok | D(m) = (m − 1)²(m + 1), solution ((m − 2)/(m − 1) ; 1/(m − 1) ; 0), cas m = ±1 : exacts. | |
| m6-c06-melange | ok | Cramer sur les compositions, test de position dans le triangle, pointeur barycentrique. | |
| m6-c07-nuage-droite | ok | Régression, r (parabole : r = 0), cas sxx = 0 traité. | |
| m6-c07-residus | ok | Smin = 0,6615 ; le défi (< 105 %) est atteignable avec le pas des curseurs (m = 1, p = 1,1 donne 101,3 %). | |
| m6-c07-anscombe | signalé | Valeurs correctes (r = 0,816, y = 0,5x + 3). Données publiées d'Anscombe : déjà signalées par le professeur de statistique (règle « 100 % original »). | Non modifié. |
| m6-c07-variable-cachee | ok | r(glaces, noyades) = 0,988 ; corrélation partielle 2·10⁻⁶. | |
| m6-c08-arbre | ok | Arrangements, combinaisons, avec répétition ; k borné à n sans répétition. | |
| m6-c08-pascal | ok | Pascal, somme 2ⁿ, développement de (a + b)ⁿ. | |
| m6-c08-arrangement-combinaison | ok | A(n ; k) = k!·C(n ; k), correction du « Podium » déjà vue par le professeur. | |
| m6-c08-galton | ok | Probabilités C(8 ; j)pʲ(1 − p)^(8−j) et trajectoire des billes cohérentes. | |
| m6-c09-grands-nombres | ok | Les quatre probabilités (1/2, 1/6, 11/36, 1/36) et l'enveloppe. | |
| m6-c09-arbre | ok | Probabilités totales et Bayes. | |
| m6-c09-test-medical | ok | 16,1 % pour prévalence 1 %, sens. 95 %, spéc. 95 %. | |
| m6-c09-monty-hall | ok | Règles de l'animateur et simulation (1/3 / 2/3). | |
| m6-c10-binomiale | ok | pmf (log-factorielles), cumuls, Poisson ; P(X = 5) = 24,6 % pour B(10 ; 0,5). | |
| m6-c10-normale | signalé | Φ vérifiée (écart < 1e-9 avec scipy de −4 à 5). Le raccourci « μ ± 3σ » est tronqué par les curseurs [−12 ; 12] si μ + 3σ > 12 (μ = 5, σ = 4) : l'aire affichée est alors celle de l'intervalle tronqué, bornes affichées comprises. | Non modifié : cas extrême, les valeurs affichées restent cohérentes. |
| m6-c10-binom-normale | corrigé | Pour k loin de la moyenne (n = 200, k = 150), la ligne « k + 0,5 » sortait de la fenêtre sans explication. | Ligne tracée seulement dans la fenêtre, avec note « k hors de la fenêtre dessinée ». Exact vs approximations vérifié (P(X ≤ 12) pour B(30 ; 0,4) = 0,5785). |
| m6-c10-tcl | ok | Lois de départ (probabilités sommant à 1), σ/√m, histogramme discret pour m = 1. | |

## Modification du moteur

- `_lib/sfa-sec.js` : `S.fmt` ne doit pas écrire « −0 » (cas φ = 90° dans `m5-c09-gauches`, résultats de l'ordre de −10⁻¹⁷). La même protection avait été ajoutée entre-temps dans le fichier par une autre relecture ; mon doublon a été retiré, il n'y a qu'une seule garde.

## Bilan

- Simulations auditées : 80 sur 80 (5e : 40, 6e : 40).
- Corrigées : 31 (5e : 21, 6e : 10).
- Signalées, non modifiées : 4 (`m5-c07-appariement`, `m6-c01-demi-vie`, `m6-c07-anscombe`, `m6-c10-normale`).
- ok sans modification : 45.
- Non auditées : 0.
- check.py : 0 erreur sur `maths/5e/index.html` et `maths/6e/index.html`.
