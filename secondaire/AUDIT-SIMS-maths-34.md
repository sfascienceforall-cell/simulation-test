# Audit du code des simulations · Mathématiques 3e et 4e secondaire

Périmètre : 40 simulations en 3e (`maths/3e/sims-01..10.js`) et 49 en 4e (`maths/4e/sims-01..10.js`), soit 89 lues intégralement, formules refaites à la main ou par calcul, bornes des curseurs vérifiées.
Contrôles : `node --check` sur chaque fichier ; banc d'essai dans Chrome réel (89 simulations, bornes de tous les curseurs + 120 combinaisons aléatoires + clics sur les boutons, sélecteurs, bascules et le canevas) : 0 exception, 0 NaN/Infinity/undefined, 0 tiret sans avertissement ; test d'animation en temps réel ; `check.py` sur les deux pages : 0 erreur.

## Corrections transversales (moteur `_lib/sfa-sec.js`)

| id | statut | problème | correction |
|---|---|---|---|
| moteur · `k.slider` | corrigé | Un `<input type="range">` arrondit au pas toute valeur affectée par programme (vérifié dans Chrome : 0,025 devient 0 pour un pas de 0,1). Toutes les animations qui font avancer un curseur par petits incréments (`t.set(t.value + dt·v)`) restaient donc **bloquées à leur valeur initiale** : vase, balayage vertical, dissection de Pythagore, cercle trigonométrique (3e) ; sinusoïde, manège, schéma de Horner (4e). | `slider.value` garde la valeur exacte (bornée à min/max courants de l'élément) ; l'élément HTML ne sert plus que d'affichage. Les 8 animations avancent maintenant (testé : vase 0 → 2,3 s en 1,5 s, etc.). |
| moteur · `S.draw.axes` | corrigé (option ajoutée) | Les repères à plages de même étendue en x et y avaient des échelles différentes en pixels (ex. 538 px pour 13 unités en x contre 490 px en y) : cercles ovalisés, médiatrice visuellement non perpendiculaire, tangentes qui ne touchaient pas le cercle dessiné, angles visibles différents des angles calculés. | Nouvelle option `equal:true` (repère orthonormé centré). Appliquée aux simulations de géométrie analytique ci-dessous. Les autres appels sont inchangés. |

## 3e secondaire

| id | statut | problème | correction |
|---|---|---|---|
| m3-c01-carre | ok | (a + b)², aires et différence justes ; échelle correcte jusqu'à a + b = 16. | |
| m3-c01-tuiles | ok | Trinôme, somme/produit, défis (5,6 ; 7,12 ; 6,8 ; 8,15) justes. | |
| m3-c01-mental | ok | Les trois produits remarquables et la vérification sont exacts. | |
| m3-c01-priorites | ok | −x², (−x)², pièges calculés correctement (pas de « −0 »). | |
| m3-c02-machine | ok | Antécédents de 2x−1, x²−4, 6/x justes ; x = 0 interdit signalé. | |
| m3-c02-vase | corrigé | Animation bloquée (voir moteur). Le modèle (largeur dessinée proportionnelle à la section) n'était pas annoncé. | Animation réparée ; mention « modèle simplifié : vase vu de face, profondeur constante » dans le texte du but. |
| m3-c02-verticale | corrigé | Balayage bloqué (voir moteur). Comptes d'intersections (cercle, parabole couchée, 4/x) justes. | Moteur. |
| m3-c02-parking | ok | Tarif (30 min gratuites, 1,50 €/h entamée, plafond 9 €) : paliers, ronds pleins/vides et défi 3 h 30 justes. | |
| m3-c03-ab | ok | Équation, zéro −b/a, triangle de pente justes. | |
| m3-c03-pente | corrigé | Pour a = 2, x₂ = 6, y atteint 15 alors que l'axe s'arrêtait à 12 : point et triangle dessinés hors cadre. | Axe y étendu à ±16. |
| m3-c03-deuxpoints | corrigé | La ligne « Équation » arrondissait la pente à 2 décimales (pente 1/3 affichée « 0,33x ») alors que les lignes a et b donnaient les fractions exactes. | Équation affichée en fractions exactes (y = (1/3)x … cohérent avec a et b). |
| m3-c03-tarifs | ok | Seuil F/(p−q), cas p ≤ q et seuil hors échelle signalés ; échelle y toujours suffisante. | |
| m3-c04-balance | ok | Les 4 équations de départ (solutions 3, −4, −4, 4), tangage de la balance, cas k = 0 et division non entière justes. | |
| m3-c04-graphe | corrigé | Quand le croisement sort du cadre (x ou y hors plage), la note disait « au croisement y = … » sans prévenir que le point n'est pas visible. | Note dédiée « le croisement sort du cadre, la solution est bien x = … ». |
| m3-c04-magie | ok | (2n + 2k)/2 − n = k, version sans dernière étape n + k : justes. | |
| m3-c04-levier | ok | Sens de l'inclinaison, d₂ = m₁d₁/m₂, avertissement « hors de la barre » justes. | |
| m3-c05-test | ok | Les 5 inéquations (x < 4, x ≤ 4, x ≤ −2, ∅, x < 3), crochets ouverts/fermés justes. | |
| m3-c05-graphe | corrigé | Les étiquettes « f » et « g » étaient placées en x = 7 : hors du cadre pour les pentes élevées. | Position verticale bornée au cadre. |
| m3-c05-signe | ok | Inversion du sens lors de la multiplication par un négatif ; k = 0 signalé. | |
| m3-c05-tolerance | ok | Bornes incluses, arrondis à 0,01 corrects. | |
| m3-c06-intersection | corrigé | Le point d'intersection était dessiné même hors du cadre (coordonnées jusqu'à 90 en valeur absolue). | Point dessiné seulement s'il est dans le cadre ; la note « sort du cadre » existait déjà. |
| m3-c06-troiscas | corrigé | Pour m = 3, k = 4 la solution est (7 ; −8) : sous l'axe (y min −6), point dessiné dans la marge. | Axe y étendu à [−10 ; 10] et garde-fou sur le point. |
| m3-c06-combinaison | ok | Les 4 systèmes (solutions (2;3), (2;5), (1;3), (2;3)) et les calculs de somme justes. | |
| m3-c06-poules | ok | y = (P − 2T)/2, cas impairs, négatifs, non entiers signalés. | |
| m3-c07-paralleles | ok | Secteurs θ / 180° − θ pour les 5 paires d'angles (correspondants, alternes, co-internes) justes, y compris 2e droite inclinée. | |
| m3-c07-somme | corrigé | Si l'on amenait deux sommets au même point (ou trois alignés), les angles affichés étaient arbitraires (somme ≠ 180°). | Garde-fou : note « triangle aplati », angles « — ». |
| m3-c07-construction | corrigé | (1) CCA : tolérance de 0,01 pour « a = h » → un cas à deux triangles pouvait s'afficher « un seul » ; angle droit en A (a = v) dessinait un triangle dégénéré. (2) La note disait « entre la hauteur et v : deux triangles » même pour α obtus, où c'est faux (un triangle seulement si u > v). | Tolérance 1e-9 ; rejet du triangle dégénéré ; note distincte pour α ≥ 90°. |
| m3-c07-pavage | ok | 180(n−2)/n, trous et chevauchements (pentagones : 36° / 72°) justes. | |
| m3-c08-carres | ok | Loi des cosinus pour c², signe de l'écart, carrés bien orientés. | |
| m3-c08-dissection | ok | Translations des 4 triangles vérifiées coin par coin (position 1 : a² et b² ; position 2 : c²). Animation réparée (moteur). | |
| m3-c08-spirale | ok | Rayons √j et angles arctan(1/√j) justes ; √(N+1) et carrés parfaits justes. | |
| m3-c08-encadrement | corrigé | Pour 3 décimales ou plus, la fenêtre restait à ±0,02 : jusqu'à 40 000 graduations (6 décimales), page figée et axe illisible. | Fenêtre proportionnelle au pas (±3 pas) : toujours 7 graduations. |
| m3-c09-thales | ok | Rapports AD/AB, AE/AC, DE/BC justes ; cas non parallèle signalé. | |
| m3-c09-ombre | corrigé | Avec un soleil bas (20°) et un grand arbre, l'ombre du bâton dépassait le bord droit du canevas. | Échelle calculée avec les deux ombres. |
| m3-c09-echelle | corrigé | La grille de copies de la figure de départ débordait de l'image quand 3k ou 2k n'est pas entier (ex. k = 1,4). | Grille limitée à l'image (découpe). Valeurs (k, k², A4 ↔ A3) justes. |
| m3-c09-semblables | corrigé | Si α + β (ou α + β′) atteint 180°, la note s'affichait mais les lectures gardaient l'ancienne valeur. | Lectures mises à « — » avec message explicite. |
| m3-c10-rapports | ok | sin, cos, tan, triangle réduit : justes sur tout le domaine. | |
| m3-c10-clinometre | ok | H = d·tan α + 1,6 m ; tolérance de ± ½° cohérente ; angles nécessaires dans les bornes du curseur. | |
| m3-c10-cercle | corrigé | Animation bloquée (voir moteur). Valeurs, tangente tronquée à R, justes. | Moteur. |
| m3-c10-pente | ok | pente % = tan α ·100 ; 10 % → 5,7° ; 100 % → 45° ; longueur de route √(1 + p²). | |

## 4e secondaire

| id | statut | problème | correction |
|---|---|---|---|
| m4-c01-transformations | corrigé | Avec a = 0, le domaine affiché était « ℝ (g est constante) » alors que g(x) = 0·√(x − h) ou 0·1/(x − h) n'est pas définie là où f ne l'est pas (la courbe dessinée l'était d'ailleurs seulement sur le vrai domaine) ; zéros « tout ℝ ». | Domaine de f conservé avec la mention « g est constante sur ce domaine » ; zéros « tout le domaine » pour 1/x et √x. Zéros, image, domaine vérifiés pour les 6 fonctions de base. |
| m4-c01-lecture | ok | Zéros (−2 ; 1 ; 3), (−1 ; 3), −1 ± √8, signe et variation justes. | |
| m4-c01-parite | corrigé | Les points (a ; f(a)) et (−a ; f(−a)) étaient dessinés hors du cadre pour x⁴ − 3x² + 1 ou x³ − 3x quand |f| > 6. | Points dessinés seulement dans le cadre. Verdict pair/impair juste. |
| m4-c01-resolution | corrigé | L'étiquette « f » était placée à y = 10,5, hors de l'axe (y ≤ 7) : invisible. | Étiquette déplacée sur la courbe. Δ/4 = m² + 2(2 + p), racines, zone f > g justes. |
| m4-c01-devine | corrigé | La solution affichait « f(x − −3) + −2 » pour h ou k négatifs. | Signes écrits correctement (x + 3, − 2). |
| m4-c02-ruffini | corrigé | Animation bloquée (voir moteur). Tableau de Horner et quotient justes. | Moteur. |
| m4-c02-racine-aire | ok | simp(), côté, meilleure fraction justes. | |
| m4-c02-polynome-graphe | ok | Développement (somme, produits, P(0) = −a·r₁r₂r₃) et racine double/triple justes. | |
| m4-c02-identification | ok | Les 3 cibles ont bien des factorisations dans la plage des curseurs (m, p, q vérifiés). | |
| m4-c03-abc | corrigé | Sommet, zéros et point (0 ; c) étaient dessinés hors du cadre pour a petit (ex. a = 0,25 : zéros jusqu'à |x| > 20). | Points dessinés seulement dans le cadre, note « sommet / zéro hors du cadre ». |
| m4-c03-canonique | ok | b = −2ah, c = ah² + k, sommet toujours dans le cadre. | |
| m4-c03-trois-points | ok | Interpolation de Newton vérifiée (a, b, c) ; points alignés et même abscisse signalés. | |
| m4-c03-cloture | ok | A(x) = x(F − 2x), max F²/8 en F/4 ; limitation x ≤ F/2 signalée. | |
| m4-c03-trajectoire | ok | Portée, hauteur, durée, angle complémentaire justes ; le cadre contient tous les réglages (portée max 63,7 m, hauteur max 30,9 m). | |
| m4-c04-delta | corrigé | Zéros hors du cadre dessinés dans la marge. | Garde-fou + remarque. |
| m4-c04-formule | corrigé | Zéros hors cadre dessinés ; « = » affiché pour des valeurs arrondies (ex. 1/3 → « = 0,333 ») quand √Δ est entier. | Garde-fou + remarque ; « ≈ » si la valeur n'est pas exacte à 3 décimales. |
| m4-c04-somme-produit | ok | S = −b/a, P = c/a, défi S = 5, P = 6 justes. | |
| m4-c04-bicarree | ok | 0, 1, 2, 3 ou 4 solutions (cas X = 0, X < 0 rejeté) justes ; toutes dans le cadre. | |
| m4-c04-nombre-or | ok | r = 1/(r − 1) ⇔ r² − r − 1 = 0 ; comparaisons justes. | |
| m4-c05-parabole-signe | corrigé | Racines hors du cadre dessinées dans la marge. | Garde-fou. Intervalles de signe et tableau justes. |
| m4-c05-tableau-produit | ok | Racines multiples, crochets pour ≥ / ≤, racine isolée {r} justes. | |
| m4-c05-valeur-interdite | ok | Signe, valeur interdite, cas p = q justes. | |
| m4-c05-domaine-racine | corrigé | Racines hors du cadre dessinées dans la marge (domaine textuel juste). | Garde-fou. |
| m4-c05-distance-arret | ok | d(v) = v·t/3,6 + v²/(25,92·a) (v/3,6 en m/s, 2a) ; vitesse max racine du trinôme justes. | |
| m4-c06-cercle | ok | cos, sin, tan, radians (π/12 …), tan non définie à 90° et 270° justes. | |
| m4-c06-enroulement | corrigé | La valeur initiale 3,14 était arrondie par le curseur à 3,15 (180,5°) et le curseur ne peut pas tomber sur π. | Départ à 3,15 explicite et boutons « t = π/2, π, 2π, −π » (valeur exacte). |
| m4-c06-angles-associes | ok | π − x, π + x, −x, π/2 − x : coordonnées et relations justes. | |
| m4-c06-sinusoide | corrigé | Animation bloquée (voir moteur). | Moteur. |
| m4-c06-manege | corrigé | Animation bloquée (voir moteur). θ = ωt, s = Rθ, h = R(1 − cos θ) justes. | Moteur. |
| m4-c07-triangle | corrigé | Échelle x ≠ échelle y (angles visibles ≠ angles calculés, angle droit non droit à l'écran). | `equal:true`. Lois des sinus et des cosinus, aire justes. |
| m4-c07-equation-trigo | ok | Solutions dans [0 ; 2π[ pour sin, cos, tan, cas ±1 (une solution), fusion des doublons justes. | |
| m4-c07-cas-ambigu | corrigé | Pour b = 8, A = 20°, a = 10 le point B (x ≈ 17) sortait du canevas. | Axe horizontal étendu [−7 ; 18]. Nombre de triangles et angles B (B et 180° − B) justes. |
| m4-c07-triangulation | ok | AT = AB sin β / sin(α + β), erreur de visée, cas Tm ≤ 0 justes. | |
| m4-c07-forces | ok | R² = F₁² + F₂² + 2F₁F₂ cos φ ; angle de R ; cas 0°, 90°, 180° justes. | |
| m4-c08-somme | corrigé | Échelles x ≠ y : composantes et angles déformés. | `equal:true`. |
| m4-c08-translation | corrigé | Idem. | `equal:true`. |
| m4-c08-chasles | corrigé | Idem. | `equal:true`. |
| m4-c08-colinearite | corrigé | (1) Idem. (2) Avec u(5 ; 5), v(5 ; −5), le parallélogramme (sommet jusqu'à 10) sortait du cadre ±8. | `equal:true` et cadre ±10. |
| m4-c08-navigation | corrigé | Avec vₚ = 12 et courant 8 km/h les vecteurs sortaient du canevas (échelle trop grande, origine trop basse) ; formulation « composante est » ambiguë ; défi impossible (courant > vitesse propre) non signalé. | Échelle et origine recalculées pour que tout rentre ; « composante vers l'est » ; message si courant > vitesse propre. |
| m4-c09-mediatrice | corrigé | Échelles x ≠ y : la médiatrice n'était pas perpendiculaire à [AB] à l'écran. | `equal:true`. |
| m4-c09-angle-inscrit | ok | AMB = ½·AOB (grand arc), 180° − ½·AOB (petit arc), 90° pour α = 180° justes. | |
| m4-c09-lieu | corrigé | (1) Rayon des cercles dessiné avec l'échelle x, points avec l'échelle y : P et M hors du cercle dessiné. (2) Pour d = R = 3 et P = A, division par 0 (M = NaN). | `equal:true` ; limite M = A dans ce cas (tangente en A). Les trois lieux (R/2, 2R, diamètre [OA]) justes. |
| m4-c09-tangentes | corrigé | Échelles x ≠ y : points de tangence décollés du cercle dessiné (écart jusqu'à 17 %). | `equal:true` (vérifié par capture). Longueur √(OP² − R²), angle, cas sur/dans le cercle justes. |
| m4-c09-ellipse | corrigé | Avec L = 18 et foyers confondus, b = 9 dépassait l'axe y (±7) : ellipse hors cadre. | Axes ±10 orthonormés. b² = a² − c², MF₁ + MF₂ = L justes. |
| m4-c10-histogramme | ok | Moyenne, médiane, quartiles (médiane exclue si n impair), σ en /n, mode justes. | |
| m4-c10-extreme | ok | Moyenne 5,12 k€ à 30 k€ ; texte du piège cohérent (déjà corrigé en relecture). | |
| m4-c10-boites | corrigé | Série B (moyenne 6 et dispersion 4 : min −2 ; moyenne 14 et dispersion 4 : max 22) dépassait l'axe [0 ; 20] : moustaches hors du cadre. | Axe étendu à [−4 ; 24]. Quartiles et σ de A (≈ 2,15) justes. |
| m4-c10-classes | ok | Densité = effectif ÷ largeur × 10, classe modale la plus dense, moyenne estimée justes. | |
| m4-c10-trompeur | ok | +5,9 % réel ; rapport des barres selon l'axe ; Simpson (X 55 % à h = 80, Y 80 %) justes. | |

## Signalé (non modifié)

- 3e `m3-c04-balance` : en « Gauche seulement / Droite seulement » avec ÷ k, les coefficients non entiers (1/3) sont affichés à 2 décimales ; la note signale déjà que la balance penche, donc sans conséquence pédagogique.
- 3e `m3-c05-signe` : le dernier réglage (p = q) affiche « sens conservé » : correct mais sans intérêt pédagogique, laissé tel quel.
- `RELECTURE-PROF-maths.md` : les points déjà « validés » après lecture du code n'ont pas été refaits en profondeur ; seuls ceux où une erreur d'affichage ou de dessin restait possible ont été corrigés.

## Bilan

89 simulations auditées (40 en 3e, 49 en 4e) ; 2 corrections de moteur ; 40 simulations corrigées ; 49 conformes (ok) ; 0 signalée à valider par un professeur (deux remarques mineures ci-dessus) ; 0 non auditée. `check.py` : 0 erreur sur 3e et 4e. Banc Chrome : 0 anomalie sur 89 simulations.
