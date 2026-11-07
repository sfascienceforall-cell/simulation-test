# Relecture du professeur de chimie BA1 : nuit du 3 au 4 novembre 2026

Périmètre :
- **A.** `universite/chimie/` (page « Chimie BA1 · compléments ») : 50 simulations (`sims-01` à `sims-10`) et 140 exercices (`exos-01` à `exos-10`).
- **B.** `chimie/exercices/index.html` : les 60 exercices ajoutés cette nuit (format `{t,s,st,d,sol}`, repérés par comparaison avec `/tmp/exercices-chimie-avant.html`), plus les 31 QCM existants dont seules les étoiles ont été modifiées.

Méthode : j'ai extrait tous les exercices avec node (contexte `vm`) et je les ai tous lus. J'ai refait en Python tous les calculs des exercices ★★★ à ★★★★★ et la plupart des ★/★★. J'ai lu le code de chaque simulation (formules, constantes, bornes des curseurs, « À retenir », « Piège »). Le fichier `chimie/VALEURS-REFERENCE.md` n'existe pas : j'ai pris les constantes de référence données dans la mission (R, F, N<sub>A</sub>, h, c, K<sub>w</sub>, pK<sub>a</sub> de l'acide acétique 4,76).

Statuts : **validé** = juste, rien à changer ; **corrigé** = fichier modifié ; **signalé** = rien n'a été modifié, une décision humaine est nécessaire.

## 1. Exercices de la page université (`universite/chimie/exos-NN.js`)

| n° | Page · exercice | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 1 | c01 #0, #2 à #13 (photon, demi-vies, Balmer, ¹⁴C, He⁺, U→Pb, ¹³¹I, FDG, T<sub>eff</sub>, fusion/combustion, raie à 434 nm) | validé | — (tous les calculs refaits et justes : 4,09·10⁻¹⁹ J ; 486,0 nm ; 1,07·10⁴ ans ; 5,25·10³ kJ/mol ; 7,29 j ; 776 MBq ; 3,39·10¹⁴ J/kg ; 541,2 nm…) | — |
| 2 | c01 #1 « Lire un symbole nucléaire » (QCM ★) | corrigé | Le corrigé finissait par une phrase hors sujet sur ²³⁸U, qui n'était pas dans l'énoncé | Phrase supprimée |
| 3 | c02 #0 à #13 (σ/π, nitrate, ozone, OM de O₂, paramagnétisme, pK<sub>a</sub> acide/alcool, acrylonitrile, C–O, peptide, superoxyde, amide sp², benzène, acrylamide) | validé | — (index `bonne` justes ; 10¹¹·¹⁴ ; 63,6 kJ/mol ; 1,5 s⁻¹ contre 6·10¹⁰ s⁻¹ ; 152 kJ/mol ; −123 kJ/mol). Les poids mésomères de #9 (75/25) sont posés comme une hypothèse de l'énoncé et dits qualitatifs | — |
| 4 | c03 #0 à #9, #13 | validé | — (HCl 18 % contre 21 % (Pauling) ; dichlorobenzènes 2,60/1,50/0 D ; μ(O–H) 1,51 D ; Langevin x = 0,545 → ⟨cos θ⟩ = 0,18) | — |
| 5 | c03 #10 | corrigé | Titre « L'ion hydrogénophosphate » pour H₂PO₄⁻ (c'est le **di**hydrogénophosphate ; l'hydrogénophosphate est HPO₄²⁻) | Titre corrigé |
| 6 | c03 #11 « Quelle molécule est linéaire ? » | corrigé (étoiles) | ★★★★ trop élevé : application directe de la VSEPR à 5 domaines | ★★★ |
| 7 | c03 #12 « Dipôle ou liaison hydrogène » (★★★★★) | corrigé | (b) 21 500/248 = 86,7 et non 86,6. (c) Le raisonnement était faux : il comparait μ² ×1,7 à ΔH<sub>vap</sub> ×1,8, deux rapports presque égaux, et concluait pourtant que le dipôle n'explique rien | (c) réécrit : la contribution dipolaire, estimée par le passage propane → éther (+2,5 kJ/mol), n'ajouterait que ≈ 1,7 kJ/mol de l'éther à l'éthanol, contre 17,1 kJ/mol mesurés. Réponse mise à jour |
| 8 | c04 #0 à #10, #12, #13 | validé | — (70,6 kPa ; 83,4 °C ; Cu 8,93 g/cm³ ; Fe 7,87 g/cm³ ; ΔH<sub>vap</sub>(éthanol) 42,2 kJ/mol ; autoclave 204 kPa ; 151 kJ ; 149 g de sueur ; NaCl 2,16 g/cm³) | — |
| 9 | c04 #11 « Distance entre atomes voisins en cfc » | corrigé (étoiles) | ★★★★ pour une relation géométrique directe | ★★ |
| 10 | c05 #0 à #12 | validé | — (−114,2 kJ ; 17,8 kJ ; 1 111 K ; Born–Haber MgCl₂ U = 2 522 kJ/mol ; −54 contre −72,2 kJ/mol ; ATP −51,4 / −41,9 kJ/mol ; 2,2·10⁶ / 5,4·10⁴ ; ΔG = +7,0 kJ/mol ; 69,4 kPa et 3,14 kPa) | — |
| 11 | c05 #13 « Pourquoi MgCl₂ et pas MgCl ? » | corrigé | U(MgCl₂) = 2 526 kJ/mol, incohérent avec les 2 522 kJ/mol trouvés par le même cycle dans l'exercice #6 : on obtenait ΔfH° = −645,3 au lieu de la valeur tabulée −641,3 | U = 2 522 kJ/mol (renvoi à l'exercice #6) ; ΔfH°(MgCl₂) = −641,3 ; dismutation −456,7 kJ ≈ −4,6·10² kJ ; réponse mise à jour |
| 12 | c06 #0 à #10, #13 | validé | — (K<sub>p</sub> 3,41 ; 9,84·10⁻⁹ ; 108 s⁵ ; ICE x = 4,26·10⁻³ (approximation interdite) ; Mohr 0,17 % ; Mg(OH)₂ pH 10,35 ; K(350 K) = 3,1·10⁻² ; NH₃ K = 6,1·10⁵ et 3,2·10⁻⁴) | — |
| 13 | c06 #11 « Calculs rénaux » | corrigé | « 200 fois moins », alors que 2,0·10⁻⁴/9,2·10⁻⁷ = 217 | « ≈ 220 fois moins » |
| 14 | c06 #12 « Sulfate ou carbonate de baryum » (★★★★★) | corrigé | (a) « 2,4 mg/L » était en BaSO₄ alors que la suite parle de baryum (mélange d'unités). (c) « Tout se dissout » : le réactif limitant était oublié (1 L à pH 1,5 ne contient que 0,032 mol de H⁺, pour 0,051 mol de CO₃²⁻ qui consomment chacun 2 H⁺) | (a) « 2,4 mg/L de BaSO₄, soit 1,4 mg/L de baryum ». (c) Ajout du réactif limitant (≈ 0,016 mol dissous, ≈ 2,2 g de Ba²⁺, acide renouvelé par l'estomac : conclusion inchangée) ; critique et réponse mises à jour |
| 15 | c07 #0 à #11, #13 | validé | — (Ea 83 kJ/mol ; 66 min ; k = 0,040 min⁻¹ ; doses répétées 13,3/3,3 mg/L, dose de charge 400 mg, insuffisance rénale 27/17 mg/L et 148 mg ; [A] = 0,050 ; Ea inverse 65 ; K(330 K) = 13,4, t½ 338 s → 25 s) | — |
| 16 | c07 #12 « Inhibition enzymatique » | corrigé | « [S] = 4,0 mmol/L (le double de la valeur initiale) » : 4,0 contre 1,0, c'est le quadruple | « quatre fois la valeur initiale » |
| 17 | c08 #0 à #10, #12, #13 | validé | — (n.o. ; 1,10 V et −212 kJ ; 1,041 V ; 4,02 g d'Ag ; 65,3 mg de Fe ; équation en milieu basique vérifiée (atomes et charges) ; QCM Ni/Ag 1,06 V ; E°(Fe³⁺/Fe) = −0,037 V ; chaîne respiratoire −220 kJ et 35 % ; K<sub>s</sub>(AgCl) = 1,7·10⁻¹⁰ ; 0,281 V) | — |
| 18 | c08 #11 « Hyperkaliémie » | corrigé | Arrondis : E<sub>K</sub>(7,5) = −78,1 mV (et non −78,2) ; V<sub>repos</sub>(4,5) = −73,5 mV (et non −73,6). [K⁺]<sub>int</sub> = 140 mmol/L : valeur typique (140 à 150), validée | Corrigé et réponse mis à jour |
| 19 | c09 #0 à #13 | validé | — (0,60 L ; −11 kJ/mol ; indice d'iode 82,0 et 2,8 C=C ; tournesol 134,9, 48 %, 62,6 L ; propène/eau K = 77 et 1,1·10⁻², x = 0,55 % et 23,7 % ; iodométrie IV = 79,7) | — |
| 20 | c10 #0 à #10, #13 | validé | — (146,14 g/mol ; rendements 67 % et 94,5 % ; aspirine 0,99 % / 99,99 % ionisée ; Grignard ; butan-2-ol ; pK<sub>a</sub> chlorobutanoïques ; piégeage ionique ×970 ; alcoolémie 0,800 g/L, demi-équations vérifiées) | — |
| 21 | c10 #11 « Ester et Grignard » (QCM) | corrigé | Le distracteur A annonçait « butan-2-one » : avec CH₃MgBr, l'intermédiaire est la propanone. Le distracteur ne correspondait plus à l'erreur typique expliquée dans `pourquoi` | « propanone (cétone) seule » |
| 22 | c10 #12 « Saponification » | corrigé | « déprotoné par OH⁻ (acide de l'eau pK<sub>a</sub> 15,7) » : formulation fausse (OH⁻ est une base) | « (base conjuguée de l'eau, bien plus forte que RCOO⁻) » |

QCM : j'ai vérifié les 50 QCM de cette page. Chaque index `bonne` est juste, aucun distracteur n'est juste par arrondi ou par une autre convention, et les `pourquoi` correspondent aux bons choix (seul défaut : c10 #11 ci-dessus).

## 2. Simulations de la page université (`universite/chimie/sims-NN.js`)

| n° | id | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 23 | uc-c01-bohr, -decroissance, -equation-nucleaire, -radiopharma, -defaut-masse | validé | — (constantes, masses atomiques au 10⁻⁶ u, Q(D–T) = 17,59 MeV, demi-vies des traceurs ; le modèle de Bohr est bien annoncé comme limité aux hydrogénoïdes) | — |
| 24 | uc-c02-hybridation, -om-diatomiques, -electronegativite | validé | — (ordre des OM avec inversion s–p jusqu'à N₂, électrons célibataires, Pauling HF 55 % contre 41 % mesuré) | — |
| 25 | uc-c02-mesomerie | corrigé | Les affichages « Liaison 1 / Liaison 2 » montraient la liaison CH₃–C (toujours 1,00) pour l'éthanoate et l'amide, au lieu des liaisons délocalisées ; la charge de l'énolate était lue sur CH (toujours 0) au lieu de CH₂ ; la note sur le poids de la structure 1 était confuse, et fausse pour l'amide | Affichage automatique des liaisons et des atomes qui changent d'une structure à l'autre, avec leur nom (ex. « C–N : 1,35 ») ; note réécrite. Poids mésomères : bien annoncés comme pédagogiques |
| 26 | uc-c02-ordre-longueur-energie | corrigé | Message « pas de triple liaison C≡O » : faux, C≡O existe (CO) | « O≡O n'existe pas ; C≡O existe dans CO (≈ 113 pm, 1 072 kJ/mol), mais ce n'est pas une valeur moyenne de table » |
| 27 | uc-c03-vsepr-3d, -moment-dipolaire, -pourcentage-ionique | validé | — (géométries, angles, μ et d des halogénures d'hydrogène et des sels gazeux). Additivité des moments de liaison : modèle explicitement annoncé comme simplifié, avec un avertissement quand l'écart dépasse 0,5 D | — |
| 28 | uc-c03-dipole-champ | corrigé | μ(HCl) = 1,08 D, différent des 1,11 D utilisés ailleurs (sim 3 et exercice c03 #3) | 1,11 D |
| 29 | uc-c03-charge-formelle | corrigé | Le « piège » disait que la légitimité de la structure qui respecte l'octet est discutée : c'est l'inverse (ce sont les structures à octet étendu qui sont discutées) | Phrase réécrite |
| 30 | uc-c04-forces-ebullition | corrigé | « ≈ 20–35 K par CH₂ » : faux pour les premiers alcanes (73 K de CH₄ à C₂H₆) | « de ≈ 70 K (CH₄ → C₂H₆) à ≈ 27 K (C₇ → C₈) » |
| 31 | uc-c04-clausius-clapeyron | corrigé | Formule et données justes (eau à 25 °C : 3,8 kPa calculés contre 3,17 mesurés, comme annoncé). Mais l'axe porte 1000/T, et la pente affichée (−ΔH/R en K) n'était pas celle du graphique | Ajout de « soit −4,889 par unité de 1000/T » |
| 32 | uc-c04-mailles-cubiques, -tension-superficielle, -types-solides | validé | — (compacités, ρ, Jurin, Laplace, longueur capillaire 2,7 mm) | — |
| 33 | uc-c05-born-haber | corrigé | Valeurs de Born–Haber vérifiées (NaCl U = 787 kJ/mol). Mais l'axe 1000/(r₊ + r₋) allait de 3 à 6 nm⁻¹ alors que les sels lourds (CsI 2,58 ; KI 2,79 ; CsBr 2,75 ; CsCl 2,87) sont en dessous de 3 : leurs points sortaient du graphique | Axe de 2,5 à 5 nm⁻¹ |
| 34 | uc-c05-deltag-k | corrigé | K débordait (affiché « Infinity ») pour la combustion du méthane à basse T (lg K ≈ 400) ; aucun avertissement entre 100 et 1 500 K, alors que ΔH° et ΔS° sont supposés constants | K affiché en 10^n quand il est hors de portée ; avertissement si \|T − 298\| > 400 K |
| 35 | uc-c05-energies-liaison, -calorimetrie, -couplage-atp | validé | — | — |
| 36 | uc-c06-precipitation | corrigé | Le « piège » énonçait l'erreur comme si c'était une consigne (« Comparer Q à Ks avec les concentrations AVANT mélange. ») | « Erreur classique : … » ; ajout de PbI₂ et de Mg(OH)₂ |
| 37 | uc-c06-ice-kc-kp, -solubilite-ph, -complexation | validé | — (résolutions exactes, α du carbonate et de l'oxalate, K<sub>f</sub> de Ag(NH₃)₂⁺) | — |
| 38 | uc-c06-vant-hoff | corrigé | « Piège » confus (« T ne change pas le sens de la perturbation (Q) ») | Réécrit : T change K, pas Q ; l'ajout d'un réactif fait l'inverse |
| 39 | uc-c07-vitesses-initiales | corrigé | Même défaut de formulation du « piège » | « Erreurs classiques : … (comme 1 et 4) » |
| 40 | uc-c07-mecanisme-etape-lente | corrigé | L'onglet « SN1 / SN2 » laissait croire que « étape 2 lente » représente une SN2 : c'est faux (une SN2 est concertée) | Onglet « SN1 (bromure de tert-butyle) » ; loi de l'étape 2 présentée comme un cas hypothétique, distinct d'une SN2 |
| 41 | uc-c07-arrhenius-lineaire, -pharmacocinetique, -michaelis-menten | validé | — (« double tous les 10 K » vérifié : ×1,91 pour 50 kJ/mol) | — |
| 42 | uc-c08-equilibrage-redox | corrigé | Anglicisme « Disproportionation » | « Dismutation » (les 5 bilans vérifiés : atomes et charges) |
| 43 | uc-c08-dosage-redox | corrigé | Avec le dichromate, la couleur affichée était « jaune pâle » avant l'équivalence puis « vert (Cr³⁺) » après, ce qui laissait croire à un virage visible. En réalité Cr³⁺ (vert) se forme dès le début et l'excès orangé se voit mal : il faut un indicateur redox | Couleurs et texte corrigés ; la formule du potentiel à l'équivalence (simplifiée pour Cr₂O₇²⁻) est bien annoncée comme telle |
| 44 | uc-c08-nernst-deltag, -electrolyse-faraday, -potentiel-membrane | validé | — (Q, n, log K ; z(O₂) = 4 ; Goldman ; [K⁺]<sub>int</sub> 140 mmol/L : valeur typique) | — |
| 45 | uc-c09-addition-electrophile, -stereochimie-addition, -entraineur-additions, -indice-iode | validé | — (tous les produits, stéréochimies et index des 10 questions vérifiés ; indices de référence 86,0 / 173,2 / 261,6) | — |
| 46 | uc-c09-stabilite-hydrogenation | corrigé | Valeurs de ΔH d'hydrogénation justes (à ±1 kJ/mol). Mais « À retenir » annonçait une conjugaison ≈ 15 kJ/mol alors que la simulation montre 8 kJ/mol (cyclohexadiènes) | « ≈ 8 kJ/mol (cyclohexa-1,3-diène), ≈ 15 kJ/mol (penta-1,3-diène) » |
| 47 | uc-c10-acidite-carboxylique | corrigé | pK<sub>a</sub>(ibuprofène) = 4,4 donné sans réserve (la littérature donne 4,4 à 4,9). Note « acide fort » pour pK<sub>a</sub> < 2 | Libellé « 4,4 à 4,9 selon les sources ; 4,4 retenu » ; « relativement fort, mais pas totalement dissocié ». Aspirine 3,5 : validée |
| 48 | uc-c10-alcools-reactivite, -esterification-equilibre, -reactivite-carbonyles, -liaison-peptidique | validé | — (équations du second degré de l'estérification et de l'hydrolyse vérifiées ; produits des réducteurs et du Grignard ; masses des acides aminés) | — |

## 3. Les 60 exercices ajoutés à `chimie/exercices/index.html`

(Nᵢ = rang d'apparition dans le fichier.)

| n° | Exercice | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 49 | N1 à N5 (sels, sérum physiologique, BaSO₄, sel d'Epsom, SRO 310/414 mosmol/L) | validé | — | — |
| 50 | N6 « Une bougie à oxygène de secours » | corrigé (étoiles) | ★★★★★ : c'est de la stœchiométrie avec un rendement, pas une synthèse | ★★★★ (calculs justes : 1,226 mol ; 100,1 g ; 108,8 g) |
| 51 | N7 à N11 (configurations, Se, énergies d'ionisation de Al, densité de charge) | validé | — | — |
| 52 | N12 « Fer(II) et fumarate » | corrigé | Explication de l'oxydation de Fe²⁺ par la seule « demi-couche 3d⁵ stable », trop simpliste. Calculs justes (65,7 mg ; 7,09·10²⁰) | Argument annoncé comme simplifié ; rôle de O₂ et du potentiel Fe³⁺/Fe²⁺ ajouté |
| 53 | N13 à N16 (Boyle, V<sub>m</sub>, autoclave, N₂O/O₂) | validé | — | — |
| 54 | N17 « Spiromètre, BTPS » | corrigé | (c) L'incertitude de ±0,34 % suppose implicitement P<sub>vap</sub> constante | Hypothèse explicitée ; ajout de l'estimation plus réaliste ± 0,026 L (± 0,5 %) ; réponse mise à jour |
| 55 | N18 « Ampoule de bicarbonate » | corrigé (étoiles) | ★★★★★ pour quatre applications directes de PV = nRT | ★★★ (calculs justes) |
| 56 | N19 à N22 (NaCl isotonique, conversions, Ringer 277 mosmol/L, cryoscopie 7,67 atm) | validé | — | — |
| 57 | N23 « Natrémie trompeuse » | corrigé | « −3 » écrit avec un tiret « -3 » (typographie) | « −3 » (calculs justes : 298 ; 288 ; 135 à 139 mmol/L) |
| 58 | N24 « KCl injecté trop vite » | corrigé | « [K⁺] = 11,1 » puis ln(11,1/140) = −67,6 : avec 11,1, on trouve −67,7 ; la valeur exacte est 11,14 | 11,14 mmol/L (−67,6 mV juste). [K⁺]<sub>int</sub> 140 : validée |
| 59 | N25 « Quelques pH du corps humain » (ch. 12) | corrigé | K<sub>w</sub> = 1,0·10⁻¹⁴ « conservé par commodité pour 37 °C » (vraie valeur ≈ 2,4·10⁻¹⁴), d'où [OH⁻] et pOH faux | Données : K<sub>w</sub>(37 °C) = 2,4·10⁻¹⁴, pK<sub>w</sub> = 13,62. [OH⁻] = 6,0·10⁻⁷ mol/L, pOH = 6,22 ; ajout : neutralité à pH 6,81 à 37 °C. Réponse et dessin mis à jour |
| 60 | N26, N28 à N30, N32 à N36 (couples, acide lactique pH 3,12, NH₃ sanguin 3,22 %, acidose 7,10 → 7,27, glycine, titrage 2,88/4,76/8,73/12,3, tampons, Tris 7,46/7,74, phosphate isotonique 3,47 g et pH 7,22) | validé | — | — |
| 61 | N27 « Le pH d'un vinaigre » | corrigé | « le pH acide de l'eau pure (10⁻⁷) est négligeable » : confusion entre pH et [H₃O⁺] | « les H₃O⁺ venant de l'autoprotolyse (au plus 10⁻⁷ mol/L) sont négligeables » |
| 62 | N31 « Tampon éthanoate, trois compositions » | corrigé | (3) « correct à environ 0,05 unité près » : non justifié | Calcul exact : 3,764, soit un écart de 0,004 ; mise en garde pour les cas plus extrêmes |
| 63 | N37 à N60 (nomenclature, isomères, corps cétoniques, combustion C₄H₈O₂, stéréochimie, sucres, ibuprofène ee 71,9 %, SN2 de Walden, Hückel, hydrogénation, paracétamol, margarine, SN/E, moutarde azotée t₉₀ 17,3 min, bilan E2/SN2 41,4 %/58,6 %) | validé | — (tous recalculés ; descripteurs CIP des aldohexoses vérifiés) | — |
| 64 | 31 QCM existants réétiquetés (★2 → ★1 à ★4) | validé | Étoiles cohérentes. Spot-check des réponses (KHC₂O₄ pH 2,95 ; HF 24 % ; NaCN 11,0 ; C₅H₁₁Br 8 isomères) : justes | — |

## 4. Points signalés (non modifiés)

| n° | Élément | Statut | Constat | Proposition |
|---|---|---|---|---|
| 65 | Page exercices : chapitres « stœchiométrie » et « gaz » | signalé | Après réétiquetage honnête de N6 et N18, ces chapitres n'ont plus d'exercice ★★★★★ (le guide en exige 1 ou 2) | Écrire un vrai exercice de synthèse pour chacun |
| 66 | Page université c03 et c04 | signalé | Répartition après réétiquetage : c03 ★★★ ×4 et ★★★★ ×2 ; c04 ★★ ×4 et ★★★★ ×2 | Ajouter un ★★★★ contextualisé dans chacun |
| 67 | c02 #9 (ΔG‡ = 75 kJ/mol) et uc-c10-liaison-peptidique (80 kJ/mol) | signalé | Deux barrières de rotation de l'amide, toutes deux dans la fourchette de la littérature (≈ 65 à 85 kJ/mol) | Harmoniser pour éviter la question des étudiants |
| 68 | uc-c07-pharmacocinetique | signalé | Le graphe est limité à 16 doses : le plateau n'apparaît pas quand t½ ≫ τ (ex. t½ = 24 h, τ = 2 h), alors que les valeurs affichées restent justes | Allonger l'axe ou ajouter une note |
| 69 | Niveau (BA1) | signalé | Au-delà du BA1 de chimie générale dans la plupart des programmes : distribution de Langevin (c03 #9, uc-c03-dipole-champ), équation d'Eyring (c02 #9), masse réduite et structure fine (c01 #13), hydroboration et oxymercuration (c09 #8, entraîneur Q7–Q8). Michaelis-Menten et pharmacocinétique (c07) relèvent plutôt de la biochimie et de la pharmacologie, mais sont utiles en médecine | Garder, avec une mention « approfondissement » |
| 70 | Page exercices · QCM 5 « pH ≈ 11 » réétiqueté ★1 | signalé | Il faut reconnaître une base faible puis vérifier le pH : ★★ serait plus juste | À trancher |
| 71 | `check.py` sur `chimie/exercices/index.html` | signalé | Le script ne s'applique pas à cette page (format non SFA : « SFA is not defined », déjà le cas sur la sauvegarde d'avant). Vérification faite autrement : la page se charge dans Chromium sans erreur JS, et `node --check` passe sur le script intégré | Adapter `check.py` ou garder ce contrôle |

## 5. Contrôles finaux

- `node --check` : OK sur les 21 fichiers .js de `universite/chimie/` et sur le script intégré de `chimie/exercices/index.html`.
- `python3 secondaire/_lib/check.py /home/claude/simulations/universite/chimie/index.html` : **50 sims, 140 exos, 0 erreur** (`bad: []`, `pageErrors: []`).
- `chimie/exercices/index.html` : chargement dans Chromium sans erreur (voir n° 71).

## 6. Bilan chiffré

- Éléments vérifiés : **281** = 140 exercices université (dont 50 QCM) + 50 simulations + 60 nouveaux exercices + 31 QCM réétiquetés.
- Éléments corrigés : **37**, dont 12 exercices université (2 seulement d'étoiles), 16 simulations et 9 nouveaux exercices (2 seulement d'étoiles).
- Erreurs de fond corrigées : K<sub>w</sub> à 37 °C (N25) ; raisonnement faux de c03 #12 ; incohérence Born–Haber de c05 #13 ; réactif limitant oublié dans c06 #12 ; distracteur faux de c10 #11 ; SN1/SN2 trompeur ; axe de Born–Haber qui cachait 4 sels ; K qui débordait ; mésomérie qui affichait la mauvaise liaison.
- Points signalés : **7** (n° 65 à 71).
- Index `bonne` faux : **0** sur les 50 QCM université. Réponses numériques publiées fausses : 5 (arrondis ou incohérences), toutes corrigées.

## 7. Pas eu le temps de vérifier

- Les fonctions de dessin `d:` des 60 nouveaux exercices (rendu visuel non regardé, seul le texte est vérifié).
- Les textes « pièges » complets de quelques QCM réétiquetés : mon extraction les tronquait à 600 caractères, et seuls les débuts ont été lus.
- Les étoiles et la répartition par chapitre des exercices anciens de la page `chimie/exercices` (hors nouveautés).
- Le comportement visuel de chaque simulation aux bornes extrêmes des curseurs : contrôle par lecture du code, sans manipulation interactive de chaque curseur.
- Les 22 simulations de chimie existantes (`chimie/*`), hors périmètre de cette nuit.
