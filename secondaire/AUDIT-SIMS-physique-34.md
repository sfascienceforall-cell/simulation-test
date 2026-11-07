# Audit du code des simulations · Physique 3e et 4e secondaire

Auditeur : revue du code des 80 simulations (`physique/3e/sims-01..10.js`, `physique/4e/sims-01..10.js`) le 4 novembre 2026.

Méthode : lecture complète de chaque `SFA.sim` (formules, constantes, conversions, échelles et orientations du dessin, textes « À retenir / Piège / notes ») ; recalcul à la main ou par script des valeurs clés ; test automatique de robustesse (Chrome sans interface) : chaque simulation est passée par chaque curseur à son minimum et à son maximum, tous les curseurs au min / au max, chaque option de chaque liste, puis 12 combinaisons aléatoires, en cherchant NaN, Infinity, undefined, null, `[object`, « −0 » et « ∞ à ∞ » dans les affichages et notes : **0 occurrence** après corrections (80 simulations). `node --check` sur tous les fichiers modifiés et `check.py` sur les 2 `index.html` : **0 erreur**.

## Tableau

| id | statut | problème | correction |
|---|---|---|---|
| p3-c01-frottement | ok | Série triboélectrique, charges A+B = 0, ordres de grandeur annoncés. | — |
| p3-c01-deux-boules | corrigé | Une boule neutre : l'angle (0,0 °) et la force (0) contredisaient le dessin (fils inclinés) et la note (« attirée »). | Readouts « ≈ 2° (dessin schématique) » et « très faible (non calculée) ». Équilibre Mg·tanθ = kq₁q₂/d² revérifié (dont ±100 nC). |
| p3-c01-electroscope | ok | Bilan de charges feuilles/chapeau/terre cohérent. | — |
| p3-c01-polarisation | ok | Qualitatif annoncé. | — |
| p3-c02-atelier | ok | Sens de la pile, I = E/(10·n), lampe grillée > 0,4 A, court-circuit : cohérents avec le dessin. | — |
| p3-c02-materiaux | ok | — | — |
| p3-c02-microscope | corrigé | Interrupteur ouvert : la vitesse de dérive et « signal 2·10⁸ m/s » restaient affichés alors qu'aucun courant ne circule. | v = 0 (« 0 mm/s », « aucun ») interrupteur ouvert. v = I/(nSe) vérifié : 0,07 mm/s pour 1 A / 1 mm². |
| p3-c02-court-circuit | ok | E = 4,5 V, r = 1,5 Ω, lampe 15 Ω : I, Pj, partage de courant refaits. | — |
| p3-c03-multimetre | ok | OL, fusible, voltmètre en série : cohérents. | — |
| p3-c03-hydraulique | ok | — | — |
| p3-c03-points | ok | A, B, C, D placés dans le bon ordre autour de la pile. | — |
| p3-c03-pile-citron | ok | Seuils déjà corrigés par le relecteur ; relu. | — |
| p3-c04-caracteristique | ok | Pente de U = f(I) = R, axes suffisants jusqu'à 0,6 A. | — |
| p3-c04-fil | ok | R = ρL/S, ρ en Ω·mm²/m, valeurs de la table justes. | — |
| p3-c04-code-couleur | ok | Chiffres, multiplicateurs et tolérances justes. | — |
| p3-c04-lampe-resistance | ok | — | — |
| p3-c05-serie-derivation | ok | Éclat (U/6)² = 25 % pour 2 lampes en série, 100 % en dérivation. | — |
| p3-c05-devisser | ok | — | — |
| p3-c05-equivalente | ok | — | — |
| p3-c05-panne | ok | Mesure entre points = 6 V si la coupure est dans l'intervalle ; 3 mesures suffisent bien (5 candidats). | — |
| p3-c06-facture | ok | E = P·t·30/1000, exemple de la note exact. | — |
| p3-c06-disjoncteur | corrigé | La lecture « x A » était écrite en blanc centrée à l'extrémité de la barre : à moitié invisible sur le fond clair. | Texte dans la barre si elle est assez longue, sinon à droite en couleur sombre. |
| p3-c06-joule | corrigé | Au-delà de la fusion (1 085 °C) la note affichait quand même « ΔT = 31 000 °C » (chaleur de fusion ignorée). | Note : « ΔT dépasserait 1 065 °C : le cuivre fond, le calcul n'est plus valable ». |
| p3-c06-terre | corrigé | Déclenchement par le disjoncteur ordinaire (> 16 A) affiché « coupé en < 0,3 s », valeur propre au différentiel. | « coupé (disjoncteur) » pour ce cas ; « coupé en < 0,3 s » réservé au différentiel. |
| p3-c07-dynamometre | ok | g Terre/Lune/Mars/Vénus/Jupiter justes, échelle 0–50 N respectée (2 kg sur Jupiter = 49,6 N). | — |
| p3-c07-dessiner-force | ok | Échelles, angles (y vers le bas) et tolérances vérifiés pour les 4 situations. | — |
| p3-c07-ressort | ok | Limite 4,5 N ; axes couvrent 0,30 m / 5,9 N. | — |
| p3-c07-balance-orbite | corrigé | Balance à plateaux « très loin de tout astre » : message « plateaux et masses tombent ensemble » faux (il n'y a aucune attraction). | Message distinct : « sans attraction, rien ne pèse ». |
| p3-c08-colineaires | ok | — | — |
| p3-c08-parallelogramme | corrigé | F₁ = F₂ à 180° : R = 0 mais « angle de R avec F₁ » = 90° (bruit numérique). | « — (R = 0) ». |
| p3-c08-deux-fils | ok | T = P/(2cos α/2), triangle des forces fermé, rupture selon le calibre. | — |
| p3-c08-equilibre-plan | corrigé | (1) Les flèches P, N (échelle 0,8·k₁) et F, f (échelle 1,6) n'avaient pas la même échelle ; F = 100 N ou f sortaient du canevas. (2) Caisse en mouvement avec F < f : note « la vitesse reste constante » alors qu'elle diminue. | Échelle unique 0,75 px/N pour les quatre flèches ; message « la vitesse diminue : la caisse va s'arrêter ». |
| p3-c09-brique | corrigé | 4 briques sur la petite face : pile de 256 px, hors du canevas (flèche F et haut de la pile coupés). | Échelle cm→px réduite automatiquement. Pressions 1 cm² = 10⁻⁴ m² vérifiées. |
| p3-c09-liquide | ok | Portées 2√(h(H−h)) = 26,5 / 38,7 / 34,6 cm correctes, indépendantes du liquide. | — |
| p3-c09-presse | ok | F₂ = F₁S₂/S₁, d₂ = d₁S₁/S₂, W₁ = W₂. | — |
| p3-c09-atmosphere | ok | Atmosphère standard, 760 mm Hg, 10,33 m d'eau, 1 013 N sur 1 dm². | — |
| p3-c10-plongee | corrigé | ρ objet = ρ liquide : verdict « coule » et note « ρ objet > ρ liquide », faux. | Cas « entre deux eaux » ajouté. |
| p3-c10-bateau | ok | Tirant d'eau M/(ρL²), épaisseur de paroi 62,5 cm³/(L²+4LH) vérifiés. | — |
| p3-c10-ludion | corrigé | (1) « À retenir » : « la poussée diminue légèrement » alors que la sim affiche Π constant (13,7 mN, poids = verre + eau entrée). (2) Cas Π = P classé « descend ». | Texte explicité (volume extérieur inchangé, Π constant) ; cas « équilibre » ajouté. Seuil 24 kPa de la note revérifié. |
| p3-c10-aile | ok | CL, portance ½ρSv²CL, Vs ≈ 90 km/h cohérentes ; hors programme déjà signalé. | — |
| p4-c01-voiture | ok | — | — |
| p4-c01-rattrapage | ok | — | — |
| p4-c01-moyenne | ok | 2·60·120/180 = 80 km/h ; mode « même durée » = moyenne arithmétique. | — |
| p4-c01-referentiel | ok | — | — |
| p4-c02-trois-graphes | ok | — | — |
| p4-c02-profil | ok | Distance par morceaux exacte ; cibles 60/100/150 m atteignables avec des vitesses entières. | — |
| p4-c02-freinage | ok | a = 7/4/2/1 m/s² (ordres de grandeur annoncés), vitesse de choc v² − 2a·d. | — |
| p4-c02-dragsters | ok | Inversion du classement vérifiée (100 m : A ; 1 000 m : B). | — |
| p4-c03-tube-vide | ok | x = (v²/g)ln cosh(gt/v) ; recherche du temps sans dépassement de borne. | — |
| p4-c03-lancer-vertical | ok | — | — |
| p4-c03-astres | ok | — | — |
| p4-c03-parachute | ok | Modèle simplifié déjà annoncé ; t(95 %) = 1,83·v_lim/g juste. | — |
| p4-c04-montagnes-russes | ok | Intégrateur conservatif, Ec = m·g(H − y). Seuil 20 m de la 2e bosse cohérent. | — |
| p4-c04-pendule | ok | Période exacte par la moyenne arithmético-géométrique vérifiée. | — |
| p4-c04-ec-vitesse | ok | — | — |
| p4-c04-lancer-energie | ok | — | — |
| p4-c05-valise | ok | — | — |
| p4-c05-plan-incline | corrigé | Pour α < 10° la valeur 1/sin α dépasse l'axe (0–6) : point bleu dessiné hors du graphique. | Point masqué et valeur écrite (« hors graphique »). Flèche P longue sur petite rampe : cosmétique, non modifiée. |
| p4-c05-puissance-escalier | ok | — | — |
| p4-c05-sankey | ok | — | — |
| p4-c06-rebonds | ok | — | — |
| p4-c06-pendule-frottement | ok | — | — |
| p4-c06-mix-electrique | ok | Facteurs d'émission 0,4 / 0,04 / 0,012 kt/GWh cohérents (gaz 400 g/kWh). | — |
| p4-c06-perpetuel | ok | — | — |
| p4-c07-ombre | corrigé | Piège « plus l'écran est loin, plus l'ombre est grande » faux si la source est plus grande que l'objet (ombre = (hD − s·d₂)/d₁ rétrécit). | Piège reformulé selon s > h ou s < h. Formules ombre/pénombre redémontrées. |
| p4-c07-eclairement | ok | — | — |
| p4-c07-eclipses | ok | Rayons ombre 0,72 R_T et pénombre 1,28 R_T, seuils 1,0 et 1,55 R_T, latitude 5,1° : justes. | — |
| p4-c07-phases | corrigé | Avec l'option « ombre de la Terre », la Lune pleine tombait exactement dans l'ombre dessinée alors que le piège dit qu'elle n'y est pas : contradiction. | Libellé de l'option et piège expliquent la vue d'en haut / inclinaison de 5° ; sens de croissant (lumière à droite avant la pleine lune) vérifié. |
| p4-c08-loi-reflexion | ok | — | — |
| p4-c08-image-miroir | ok | — | — |
| p4-c08-deux-miroirs | ok | Déjà validé ; 3 / 5 / 7 / 9 / 11 images. | — |
| p4-c08-se-voir-entier | ok | — | — |
| p4-c09-snell | ok | — | — |
| p4-c09-fenetre-snell | ok | 48,8° / 41,8° / 24,4° ; cône 97 °. | — |
| p4-c09-fibre | ok | — | — |
| p4-c09-prisme | ok | Déviation D = i₁ − e − A refaite ; réflexion totale détectée. | — |
| p4-c10-banc-optique | ok | Rayons principaux, q = fp/(p − f), cas p = f. | — |
| p4-c10-oeil-lunettes | corrigé | Plage de vision nette : « de ∞ à ∞ » quand le punctum proximum dépassait 5 m, et « aucune » exactement à la limite de l'infini (cas presbyte myope partiellement corrigé). | Seuils numériques corrigés : « de X cm à ∞ », « à l'infini seulement », « aucune » seulement si impossible. |
| p4-c10-couleurs | ok | — | — |
| p4-c10-sthenope-lentille | ok | — | — |
| (moteur) _lib/sfa-sec.js S.fmt | corrigé | Un très petit nombre négatif arrondi s'affichait « −0 » (ex. −0,001 avec 2 décimales). | « 0 » ; le fichier reste valide pour toutes les pages. |

## Signalé (non modifié)

| id | statut | problème | remarque |
|---|---|---|---|
| p3-c03-hydraulique, p3-c09-presse | signalé | Les largeurs de tuyau et de pistons sont dessinées de façon qualitative (non proportionnelles aux surfaces). | Cosmétique ; les valeurs affichées sont exactes. |
| p4-c05-plan-incline | signalé | La flèche du poids (échelle 0,12 px/N) dépasse du canevas pour une charge de 100 kg sur une rampe basse. | Cosmétique, non faux. |
| p4-c03-parachute | signalé | v_lim = 43 m/s (corps groupé) et 36 m/s (bras écartés) : plus bas que les ≈ 55–70 m/s réels. | Modèle simplifié déjà annoncé (C_d intégré à S efficace) ; ordre relatif correct. |
| p3-c10-aile, p4-c07-eclairement, p4-c09-fibre | signalé | Hors du cœur du référentiel (déjà signalé par le relecteur). | Aucune modification. |
| g = 9,81 (3e) / 9,8 (4e) | signalé | Convention différente d'une page à l'autre. | Cohérent dans chaque page (déjà noté). |

## Bilan

- Simulations auditées : 80 / 80 (40 en 3e, 40 en 4e) + 1 correction dans le moteur partagé.
- Corrigées : 15 simulations (+ moteur `S.fmt`).
- Sans problème (ok) : 65.
- Signalées sans modification : 5 points (cosmétique ou modèle simplifié annoncé).
- Non auditées : 0 (les fichiers `exos-*.js` et `page.js` sont hors périmètre).
