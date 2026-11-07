# Audit du code des simulations · Biologie BA1 (universite/biologie)

Périmètre : 48 simulations (sims-01 à sims-10). Méthode : lecture du code de chaque simulation, recalcul à la main ou en Python/node de 2 à 3 valeurs (dont les bornes des curseurs), vérification du dessin (échelles, axes, sens), cohérence avec « À retenir » / « Piège » / notes, cas limites. Les points déjà notés « validés » dans RELECTURE-PROF-biologie.md n'ont pas été refaits (Hodgkin-Huxley : seuil ≈ 7 µA/cm², lu seulement pour les cas limites).
Après corrections : `node --check` OK sur les 10 fichiers ; `check.py` sur universite/biologie/index.html : 0 erreur (48 sims, 140 exos, bad = [], pageErrors = []).

| id | statut | problème | correction |
|---|---|---|---|
| ub-c01-condensation | ok | n−1 liaisons / eau, n pour cyclique, masses recalculées (n·M − (n−1)·18,02) : justes | — |
| ub-c01-gaz-sang | corrigé | Axe pH 6,6 à 7,8 : le point sort du graphique pour HCO₃⁻ = 45 / pCO₂ = 15 (pH 8,10) ou HCO₃⁻ = 5 / pCO₂ = 90 (pH 6,37) | Axe pH 6,2 à 8,2 (pas 0,2) ; HH recalculée : 20 → 7,40, pCO₂ ×2 → −0,30 |
| ub-c01-capacite-tampon | corrigé | Le point « pH final » sort de l'échelle 4 à 10 près de l'épuisement, sans avertissement ; modèle fermé non annoncé pour le bicarbonate alors que « À retenir » parle du rôle du poumon | Point ramené au bord + phrase d'avertissement + passage en « warn » ; note « système fermé, simplifié ». β recalculée : correcte |
| ub-c01-acides-gras-fluidite | corrigé | (1) L'élaïdique (trans) était étiqueté « coude(s) cis » ; (2) à T = Tm, la barre était grise (solide) alors que le texte disait « liquide » | (1) Étiquette « chaîne droite » pour trans ; (2) comparaison `>` cohérente avec l'état. Points de fusion des 11 acides gras vérifiés |
| ub-c02-microscopie | ok | d = 0,61·λ/NA (268 nm par défaut), taille réelle = mesure·10⁶/G : justes ; cas limites OK | — |
| ub-c02-surface-volume | corrigé | Volume et surface arrondis à l'unité : r = 0,5 µm affichait V = « 1 » µm³ (réel 0,52) ; point rouge collé en haut sans explication si S/V > 6 | Décimales adaptatives (2 / 1 / 0) ; phrase dans la note si S/V sort de l'échelle. Cube : +24,1 % constant, juste |
| ub-c02-centrifugation | corrigé | Stokes recalculé (noyau 1 000 g : 318 cm en 20 min ; mitochondrie 10 000 g : 33 cm, 1 000 g : 3,3 cm → surnageant ; microsome 100 000 g 1 h : 11,8 cm ; ribosome 150 000 g 4 h : 21 cm) : justes. Étiquettes en notation scientifique avec point décimal (« 1.2·10^-3 ») | Virgule belge dans les étiquettes |
| ub-c02-voie-secretion | ok | Itinéraires, perturbations et messages cohérents avec « Piège » | — |
| ub-c03-diffusion-fick | ok | P = D·K/ε, τ = r/(3P), J, flux total (fmol/s), unités vérifiés sur les bornes | — |
| ub-c03-osmose-gr | corrigé | (1) Barres : osmolarité jusqu'à 1 400 mOsm → barre de 270 px qui sort du canvas (texte à y < 0) ; (2) à largeur étroite, les barres et le « 300 » dépassaient à droite | (1) Échelle 0,3 px/mOsm (plafond 600 mOsm, valeur réelle toujours écrite) ; (2) largeur de barre et position calculées selon c.W. V = 300/tonicité, eau pure (∞) et urée seule : justes |
| ub-c03-transporteur-saturation | ok | Km' = Km(1 + I/Ki), Jmax inchangé ; axes (200 max) couvrent toutes les valeurs | — |
| ub-c03-nernst | ok | E(K⁺) −89, Na⁺ +66,5, Cl⁻ −64, Ca²⁺ +132 mV à 37 °C ; signe du flux net pour anion et cation vérifié | — |
| ub-c03-goldman | corrigé | Axe Vm −100 à +80 mV : le point sortait pour [K⁺]ₒ = 1 mmol/L, pNa/pK = 0,01 (Vm = −108 mV) et E(K⁺) = −132 mV ; « À retenir » : Vm de repos ≈ −68 mV alors que le calcul donne −68,6 | Axe −140 à +80 ; texte « ≈ −69 mV ». pNa/pK = 20 donne +54 mV (le texte dit « vire vers E(Na⁺) » : exact) |
| ub-c04-potentiel-action | ok | Modèle HH : conventions (ENa 50, EK −77, EL −54,387, repos −65) correctes ; TTX/TEA OK (déjà validé) | — |
| ub-c04-propagation-myeline | corrigé | « À retenir » : la démyélinisation « peut bloquer la conduction » ; la simulation ne bloque jamais (à 100 % la fibre garde la vitesse amyélinique) | Précision dans la note : blocage non modélisé. Vitesses : 1,1√d (3,48 m/s à 10 µm) et 6d (60 m/s) justes |
| ub-c04-cascade-amplification | ok | Amplification n₁·n₂·n₃, demi-vie ln 2/k (3,5 s ; 6,9 s avec caféine), barres en échelle log, plafond à 10¹⁰ : justes | — |
| ub-c04-synapse-sommation | corrigé | Avec beaucoup de synapses inhibitrices (ex. 15 × 100 Hz × 3 mV), Vm descendait à −200 mV, hors du graphique (−80) et non physiologique | Plancher −85 mV (équilibre K⁺/Cl⁻) annoncé dans la note ; axe −90 à +10. Dépolarisation moyenne (Σ n·f·a·τ) vérifiée : 14,4 mV par défaut |
| ub-c04-homeostasie-retroaction | corrigé | (1) Rétroaction positive à G = 1 : « D/(a(1−G)) » = Infinity affiché ; G = 1 décrit comme exponentiel alors que la croissance est linéaire ; (2) avec perturbation temporaire, « écart final » affichait l'équilibre atteint, jamais atteint ou déjà disparu | (1) « emballement (pas d'équilibre) », « croissance linéaire » à G = 1, texte « À retenir » corrigé (G > 1 exponentiel) ; (2) pic réel utilisé et note « valeur au pic… revient à la consigne » |
| ub-c05-michaelis-menten | corrigé | Double inverse : pour Km élevé (ex. 100 µmol/L) l'axe 1/[S] s'arrêtait à 4/Km = 0,04 alors que les mesures simulées sont à 1/5 = 0,2 : points et point rouge hors du cadre | Axe x1 = max(4/Km ; 0,22), axe y adapté, point rouge masqué s'il est hors axe. kcat·[E] (µmol/L/s), kcat/Km (L/mol/s) : justes |
| ub-c05-inhibition-enzymatique | corrigé | Même défaut en double inverse (Km élevé ou [S] petit : points hors axe, ordonnée plafonnée à 14) | Axe x = max(4/m0 ; 1,1/[S]) et plafond de y relevé pour contenir les deux points. Km' et Vmax' des 3 types : justes |
| ub-c05-ph-temperature | ok | Courbes gaussienne (pH) et Arrhenius × sigmoïde de dénaturation : cohérentes avec les textes | — |
| ub-c05-couplage-atp | ok | ΔG = −30,5 + RT ln Q : −50,1 kJ/mol par défaut ; log₁₀[P]/[R] = −ΔG/(RT ln 10) ; barres bornées à ±12 : toutes les valeurs des curseurs tiennent | — |
| ub-c05-allosterie | corrigé | Avec l'effecteur ×4 sur K₀,₅ = 50 (hémoglobine : 200 mmHg, enzyme : K₀,₅ = 200 > axe 150), la ligne de K₀,₅ sortait de l'axe | Axe x calculé d'après le K₀,₅ effectif. Y(40) = 76 %, Y(100) = 97 %, 81^(1/n) = 5,08 pour n = 2,7 : justes |
| ub-c06-bilan-glucose | ok | 4 + 25 + 3 = 32 ATP (malate-aspartate), 30 (glycérol-phosphate) ; barres tiennent (max 38 sur 40) | — |
| ub-c06-chimiosmose | corrigé | La flèche des protons (rentrée par l'ATP synthase) restait dessinée avec l'oligomycine, qui bloque ce passage | Flèche seulement en condition normale. Δp = 181 mV, n·F·Δp = 64,5 kJ/mol : juste |
| ub-c06-fermentation | ok | Facteur 1 + (Y/2 − 1)·f, lactate = f·ATP demandé : justes aux bornes | — |
| ub-c06-photosynthese | ok | 3 ATP + 2 NADPH par CO₂, ratio 1,29 + cyclique : justes | — |
| ub-c06-jeune | ok | Modèle simulé en Python (glycogène 50 / 90 / 120 g) : épuisement vers 18-30 h selon le départ, cohérent avec « 80 à 100 g » et les textes | — |
| ub-c07-traduction-mutations | corrigé | « Glu→Val en position 6 » : dans le fragment affiché, le GAG est le 7ᵉ codon (Met comptée), source de confusion | Précision dans « À retenir » (numérotation sans Met ; nucléotides 19 à 21). Tableau du code génétique, indels et cas stop vérifiés |
| ub-c07-replication | corrigé | « Origines pour S = 8 h » affichait « 0 » pour E. coli (0,08 arrondi à l'unité) | Toujours arrondi à l'entier supérieur, minimum 1. Durée E. coli 38 min, humain 27 min (temps minimal), fragments G/L : justes |
| ub-c07-maturation-arn | ok | Cadre de lecture : un seul exon (E3, 100 nt) n'est pas multiple de 3, donc le critère sur la longueur totale est exact ; 579 nt = 192 aa + stop | — |
| ub-c07-operon-lac | corrigé | Mutants lacI⁻ et lacOᶜ sans glucose et sans lactose : le message disait « Lactose présent ET glucose absent : induction maximale », faux | Message propre aux mutants constitutifs. Niveaux 1 / 5 / 100 vérifiés pour les 6 souches × 4 conditions |
| ub-c07-pcr-gel | corrigé | La bande apparaissait à 10⁸ copies sur le gel alors que l'indicateur « Bande visible ? » disait « non » sous 10¹⁰ | Bande dessinée seulement au-dessus de 10¹⁰, intensité croissante |
| ub-c08-mitose-meiose | corrigé | Avec 4 cellules (gamètes) sur écran étroit, la grille de chromosomes (26 px) dépassait de la cellule | Espacement adapté au rayon de la cellule. Chromosomes / chromatides / ADN à chaque étape vérifiés (2n = 4, 6, 8, 46) |
| ub-c08-cycle-controle | corrigé | Libellé « Cellules à ADN muté » alors que le calcul donne la fraction de cellules à ADN lésé non éliminé | Libellé aligné sur le calcul. Facteur 2(1 − δ·a), cycles = 240/T : justes |
| ub-c08-brassage | corrigé | c > n accepté sans avertissement (le calcul tronque en silence) | Message dans la note. 2²³ = 8 388 608 et (2²³)² ≈ 7·10¹³ : justes |
| ub-c08-caryotype | ok | 3 paires de cas (autosome, mère, père MI / MII avec X ou Y) : gamètes, caryotypes (47,XXY, 45,X, 47,XXX, 47,XYY, 45,Y) et proportions exacts | — |
| ub-c08-gametogenese-embryon | ok | Ploïdie, ADN, nombre de cellules et chronologie cohérents avec les textes | — |
| ub-c09-croisements-chi2 | corrigé | Aucun avertissement quand un effectif attendu est < 5 (N = 20 en dihybride : 1,25), alors que « Piège » l'exige ; p-valeurs vérifiées (df = 3 : p(7,815) = 0,05) | Avertissement dans la note |
| ub-c09-liaison-trois-points | corrigé | Libellé « Distance A–C estimée » trompeur : la valeur est le taux de recombinants A–C apparent (sans les doubles CO) et non la distance réelle d₁ + d₂ | Libellés « Distance A–C apparente (sans les DCO) » et « d₁ + d₂ (distance réelle A–C) ». Classes parentale / simples / double : justes |
| ub-c09-risque-heredite | ok | 9 situations vérifiées (1/4, 1/2, 3/4 ; X : garçons / filles) ; 2/3 × 1/f × 1/4 = 1/(6f) juste | — |
| ub-c09-groupes-sanguins | ok | Fréquences ABO, probabilité Rh−, règle de compatibilité des antigènes : justes | — |
| ub-c09-polygenique | ok | G binomial (2n, 1/2) : moyenne n, variance n/2 ; h², pénétrance via erfc : justes, pas de division par 0 (σ = 0 géré) | — |
| ub-c10-hardy-weinberg | corrigé | Pas d'avertissement quand un attendu est < 5 (échantillon petit ou allèle rare) | Avertissement dans la note. 1/2 500 donne q = 0,02, porteurs 3,92 % (1/25,5) : justes |
| ub-c10-derive | ok | Wright-Fisher, H théorique H₀(1 − 1/2N)ᵗ, goulot : justes | — |
| ub-c10-selection | ok | p′ et p̂ = (w_Aa − w_aa)/(2w_Aa − w_AA − w_aa) : division toujours > 0 ou < 0 selon le régime, jamais nulle | — |
| ub-c10-logistique | corrigé | (1) Ricker avec r ≥ 1,5 : pics (jusqu'à 2,5 K) coupés par l'axe ; (2) « Vitesse max rK/4 » et « N = K/2 atteint à » (modèle continu) affichés en mode discret | (1) Axe y adapté (K·e^(r−1)/r) ; (2) « — (modèle continu seulement) » en mode discret |
| ub-c10-lotka-volterra | corrigé | (1) Point d'équilibre hors cadre du portrait de phase (x* jusqu'à 200) ; (2) paramètres extrêmes : effectifs < 1 individu (1e-6) sans le dire ; (3) période 2π/√(αγ) donnée avec K sans réserve | (1) Axes du portrait de phase incluent l'équilibre ; (2) note d'extinction ; (3) « (sans K, indicatif) ». RK4 vérifié sur 5 jeux de paramètres, pas de NaN |

## Signalements (non corrigés, à décider)

- ub-c01-acides-gras-fluidite : le dessin de la chaîne est schématique (une double liaison cis est représentée par deux liaisons de même sens, pas par un vrai coude en U) ; les points de fusion, eux, sont exacts. Acceptable, mais à ne pas présenter comme une structure.
- ub-c02-microscopie : en mode « électronique », les curseurs λ et NA restent actifs mais sans effet (la note annonce 0,5 nm fixe). Cosmétique.
- ub-c07-replication : l'humain (6,4 Gb, 40 000 origines, 50 nt/s) donne 27 min en « durée minimale » alors que la phase S dure ≈ 8 h ; « Piège » l'explique déjà.

## Bilan

- Simulations auditées : 48 / 48 (code lu, valeurs recalculées).
- Corrigées : 26 (dessin hors axes, libellés, arrondis, messages faux, avertissements manquants).
- Signalées (non modifiées) : 3 remarques cosmétiques / de niveau.
- Non auditées : 0. Limite : le rendu visuel réel (téléphone) n'a pas été regardé, seulement le code et `check.py` (0 erreur).
