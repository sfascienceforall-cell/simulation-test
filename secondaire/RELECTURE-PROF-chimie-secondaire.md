# Relecture du professeur de chimie : secondaire 3e à 6e (nuit du 3 au 4 novembre 2026)

Périmètre : `secondaire/chimie/3e`, `4e`, `5e` et `6e`, soit 161 simulations et 410 exercices, dont 150 QCM.
Méthode :
- extraction de tous les exercices avec node (contexte `vm`), puis relecture complète, sans échantillonnage ;
- recalcul en Python des résultats numériques douteux ou délicats : Haber, NO₂, HI, Nernst, Mohr, bicarbonate, BBT, extrapolation calorimétrique ;
- extraction des textes « À retenir » et « Piège » des 161 simulations ;
- lecture du code des simulations signalées par les constructeurs et des tables de données.

Après les corrections : `node --check` sur tous les fichiers .js (0 échec) et `check.py` sur les 4 `index.html` (0 erreur : 40, 40, 40 et 41 simulations ; 110, 100, 100 et 100 exercices).

## 1. Tableau des éléments vérifiés et modifiés

| n° | Page · id ou exercice | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 1 | 5e · `c5-c01-flamme` (test de flamme, potassium) | corrigé | La raie « principale » du potassium était donnée à 404 nm. La raie la plus intense est le doublet 766/769 nm (rouge extrême) ; 404 nm n'est qu'une faible raie violette. | λ = 766 nm. Une note propre au potassium explique la teinte lilas (766 nm à peine visible + 404 nm) et l'usage du verre de cobalt. |
| 2 | 5e · `c5-c01-flamme` (piège) | corrigé | Le modèle n'était pas annoncé comme simplifié. Pour Ca, Ba et Cu, la couleur vient de bandes moléculaires (CaOH, BaOH, CuCl), pas d'une raie de l'atome. | Piège réécrit (« Modèle simplifié… ») et mention dans la note pour Ca, Ba et Cu. |
| 3 | 5e · `c5-c01-lewis` (piège) | corrigé | Le piège disait « on écrit [Na]⁺ sans points », alors que la simulation dessine 8 points. | Les deux conventions sont expliquées. |
| 4 | 4e · `c4-c10-melange` (table de précipitation) | corrigé | PbCl₂ était classé « précipité », alors qu'il est seulement peu soluble (Ks ≈ 1,7·10⁻⁵). Le « À retenir » oubliait CaSO₄ et Ag₂SO₄, peu solubles. La table n'était pas annoncée comme simplifiée. | PbCl₂ classé « peu soluble » (léger trouble, seulement avec des solutions assez concentrées). « À retenir » réécrit en table simplifiée (≈ 0,1 mol/L), qui cite CaSO₄ et Ag₂SO₄. Notes : Pb(OH)₂ et Zn(OH)₂ se redissolvent dans un excès de soude. |
| 5 | 6e · `c6-c06-ion-commun` (piège) | corrigé | « Les complexes n'interviennent qu'au-delà de 0,3 mol/L » est faux. Les complexes de l'argent pèsent dès quelques mmol/L de Cl⁻ : à 0,1 mol/L, la vraie solubilité de AgCl (≈ 3·10⁻⁶ mol/L) dépasse de loin Ks/c. | Piège réécrit : modèle simplifié sans complexes, qui donne la tendance et pas la valeur exacte. |
| 6 | 6e · `c6-c06-*` (valeurs de Ks) | validé | AgCl 1,8·10⁻¹⁰ ; BaSO₄ 1,1·10⁻¹⁰ ; PbI₂ 9,8·10⁻⁹ ; CaF₂ 3,9·10⁻¹¹ (3,5·10⁻¹¹ selon d'autres tables) ; Mg(OH)₂ 5,6·10⁻¹² ; Ag₂CrO₄ 1,1·10⁻¹². Valeurs conformes ; le piège signale déjà les écarts entre tables. | — |
| 7 | 6e · `c6-c06-selective` (Mohr) | validé | Bilan de matière en argent et seuils ([Ag⁺] ≈ 2·10⁻⁸ puis 1,5·10⁻⁵ mol/L) vérifiés. | — |
| 8 | 5e · `c5-c09-haber` / `c5-c09-temperature-pression` (Kp) | validé | Kp(773 K) = 1,45·10⁻⁵ bar⁻² et ΔH = −105 kJ/mol (valeur à haute température, cohérente). Le modèle donne 62 / 35 / 25 / 8 % de NH₃ à 200 bar, contre 63 / 36 / ≈ 27 / 8 % pour les données réelles. Écart de quelques % à 300–400 bar, dû au modèle des gaz parfaits, déjà annoncé. NO₂ (Kp = 0,148) et HI (K = 50 à 721 K) sont corrects. | — |
| 9 | 4e · `c4-c02-oleique` (film d'acide oléique et N_A) | validé | Formules justes. Modèle « cube » ≈ 3 % de N_A, modèle « bâtonnet » de 0,25 nm² ≈ 82 % : le piège (« 20 à 30 fois trop petit ») est exact. Remarque : avec le bâtonnet, l'aire de section fixe le résultat ; elle est donnée comme hypothèse, ce qui reste acceptable. | — |
| 10 | 6e · `c6-c08-nernst` | validé et signalé | Formules justes (pile de concentration à volumes égaux, Daniell, K ≈ 10³⁷). La simulation annonce déjà « hors programme strict ». | Rien à changer dans la simulation. Niveau signalé au §3. |
| 11 | 3e · `c3-c03-carte` et `c3-c02-atome` | corrigé | Il manquait le calcium 46 (stable) dans la liste des isotopes stables. | Ca : 40, 42, 43, 44, 46. |
| 12 | 3e · `c3-c09-eaux` (« À retenir ») | corrigé | « Diluer 100 fois divise σ par 100 » était présenté comme exact pour l'eau de mer, trop concentrée pour une proportionnalité stricte. | Précisé : « environ 100 (modèle proportionnel ; la vraie baisse est un peu moindre) ». |
| 13 | 5e · `c5-c03-glace` (piège) | corrigé | Faute : « un glaçon couleraient ». | « coulerait ». |
| 14 | 6e · `c6-c07-nombre-oxydation` (« À retenir ») | corrigé | « éthanol → éthanal → acide : trois oxydations successives » : il n'y en a que deux. | « deux oxydations successives (2 électrons par étape) ». |
| 15 | 6e · `c6-c10-vinaigre` (piège) | corrigé | Phrase fautive : « l'on néglige ici ». | « et on le néglige ici ». |
| 16 | 4e · exos c05 #2 (QCM, distracteur 2) | corrigé | Le `pourquoi` disait « O₂ est 16 fois plus lourd que H₂ (32 g contre 4 g) » : le rapport est 8. | « 8 fois plus lourde ». |
| 17 | 4e · exos c09 #3 (QCM, distracteur 2) | corrigé | Le `pourquoi` était confus (« tu as soustrait 2 à 12… pas 4 »). | Explication réécrite : pH 10 ↔ pOH 4 ↔ [OH⁻] = 10⁻⁴ mol/L. |
| 18 | 5e · exos c04 #7 (glaçon qui fond, distracteur 0) | corrigé | Le `pourquoi` parlait d'un « glaçon enfoncé au fond », hors sujet, sans réfuter la prémisse fausse (« l'eau liquide occupe plus de volume que la glace »). | `pourquoi` réécrit : prémisse fausse + raisonnement d'Archimède. |
| 19 | 6e · exos c05 #9 (bicarbonate, distracteur 3) | corrigé | Formulation ambiguë : « tend vers 7, pas vers 0 (pH de l'eau pure) ». | « Une dilution rapproche le pH de 7 (pH de l'eau pure), jamais de 0. » |
| 20 | 6e · exos c08 #6 (pile de concentration) | corrigé | Calcul affiché incohérent : « 0,030 × 2 = 0,059 V ». | « 0,030 × 2 = 0,060 V (0,059 V avec 0,0296) ». |
| 21 | 6e · exos c08 #7 (citrons et LED) | corrigé | La conclusion disait « en parallèle, on gagne en intensité », alors que le calcul donne 1,9 mA en parallèle contre 2,0 mA en série. | Conclusion réécrite d'après les chiffres (f.é.m. et résistance interne). |
| 22 | 6e · exos c08 #8 (Nernst, Daniell) | corrigé | Saut logique : « 99,99 % de Cu²⁺ a réagi (Q ≈ 2·10⁴) » sans conditions initiales. | Ajout de [Zn²⁺]₀ = [Cu²⁺]₀ = 1,0 mol/L, des concentrations finales et du calcul 1,10 − 0,030 × 4,3 ≈ 0,97 V. |
| 23 | 3e · exos c09 #9 (dessaler l'eau de mer) | corrigé | Hypothèse cachée : σ proportionnelle à la concentration, ce qui n'est qu'approché pour l'eau de mer. | L'hypothèse est énoncée dans le corrigé (a). |
| 24 | 3e · exos c04 #10 (argon et potassium, QCM) | corrigé (★) | ★★★★★ pour un QCM de connaissance. | ★★★. |
| 25 | 4e · exos c02 #9, c05 #9, c08 #9, c10 #9 (QCM) | corrigé (★) | ★★★★★ pour des calculs en 2 ou 3 étapes ou une équation ionique nette. | ★★★. |
| 26 | 4e · exos c01 #9, c03 #9, c04 #9, c06 #9, c07 #9, c09 #9 (QCM) | corrigé (★) | ★★★★★ pour des problèmes à piège classique, sans synthèse de plusieurs chapitres. | ★★★★. Chaque chapitre de 4e garde son ★★★★★ ouvert : la répartition exigée reste respectée. |
| 27 | 6e · exos c01 #9 (alcool tertiaire, QCM) | corrigé (★) | ★★★★★ pour un doublon de c01 #5, coté ★★★. | ★★★. |
| 28 | 6e · exos c07 #9 (dismutation), c08 #9 (Al/Ag) | corrigé (★) | ★★★★★ pour un calcul de n.o. ou une stœchiométrie en deux étapes. | ★★★. |
| 29 | 6e · exos c10 #9 (engrais NPK) | corrigé (★) | ★★★★★ pour 180 / 0,20 × 0,10. | ★★. |
| 30 | 6e · exos c02 #9, c05 #9, c06 #9, c09 #9 (QCM) | corrigé (★) | ★★★★★ un peu généreux pour un QCM. | ★★★★. |
| 31 | 3e, 4e, 5e, 6e · les 150 QCM | validé (sauf n° 16 à 19) | Pour chaque QCM : l'index `bonne` désigne la bonne réponse, aucun distracteur n'est juste lui aussi, et les `pourquoi` correspondent aux choix, y compris les valeurs numériques des distracteurs (recalculées). | — |
| 32 | 3e à 6e · les exercices ★★★ à ★★★★★ et tous les ★ et ★★ | validé (sauf n° 16 à 23) | Tous recalculés. Exemples : film d'oléique, Haber, N₂O₄ par van't Hoff, horloge à iode, Arrhenius, calorimétrie extrapolée, butane en défaut d'O₂, Mohr, AgI/AgCl, antiacide, tampon phosphate, Faraday, anodes sacrificielles, PET, saponification, vinaigre, facteur E. Les réponses publiées sont justes ; unités et chiffres significatifs sont cohérents. | — |
| 33 | 3e à 6e · « À retenir » et « Piège » des 161 simulations | validé (sauf n° 1 à 5 et 11 à 15) | Lus en entier. Valeurs contrôlées : constantes (N_A, R, F, Vm, 13,6 eV, 1240 eV·nm), E° (11 couples), énergies de liaison, Teb des hydrures, données des combustibles, Hess (−76 kJ/mol), courbe de conductivité de NaCl (≈ 2,0 mS/cm par g/L), solubilités. | — |
| 34 | 3e · `c3-c07-ballon`, `c3-c10-metal`, `c3-c10-titrage` ; exos c07 #10, c09 #10, c10 #5, c10 #8, c10 #9, c10 #10 | signalé (niveau) | Usage de la mole et de mol/L en 3e. En FWB, la mole relève de l'UAA 3 de 4e : en 3e (UAA 1 et 2), l'approche de la réaction est qualitative. | Rien supprimé (les calculs sont justes et guidés). À marquer « pour aller plus loin » ou à déplacer vers la 4e. |
| 35 | 3e · exos c10 #7 et simulation `c3-c10-titrage` (pH à l'équivalence ≈ 8,7 pour un acide faible) | signalé (niveau) | Notion de 6e (couples acide/base faibles). | À garder comme ouverture, sans évaluation. |
| 36 | 4e · exos c09 #6 (HCl 10⁻⁸ mol/L, équation du second degré) | signalé (niveau) | Dépasse la 4e (Kw et bilan de charges). Calcul juste (pH 6,98). | Garder en ★★★★, « défi ». |
| 37 | 5e · exos c09 #8 (van't Hoff, α de N₂O₄), c07 #6 et c07 #9 (Arrhenius) | signalé (niveau) | Lois exponentielles plutôt de niveau BA1 que de 5e. Calculs justes. | Garder comme ★★★★★ « défi ». |
| 38 | 5e · exos c03 #8 (XeF₄, SF₄ : 5 et 6 doublets) et c02 #4 (« orbitales 3d vides » pour justifier l'octet étendu) | signalé | XeF₄ dépasse le programme de 5e. L'explication par les orbitales 3d est l'explication scolaire classique, mais elle est dépassée en chimie quantique. | À formuler « on admet que… » si on veut rester rigoureux. |
| 39 | 6e · exos c08 #6, c08 #8 (Nernst) | signalé (niveau) | Hors programme strict en 6e (la simulation le dit). Calculs justes après les corrections n° 20 et 22. | — |
| 40 | 4e · exos c05 #8 (tableau d'avancement, ★★★★★) | signalé (★) | Problème standard de réactif limitant, plutôt ★★★★. Laissé en ★★★★★ pour que le chapitre garde un ★★★★★. | Remplacer à terme par un vrai problème de synthèse. |

## 2. Bilan chiffré

- **Exercices vérifiés : 410 sur 410.** Les 150 QCM (index `bonne`, distracteurs, `pourquoi`) et les 260 exercices ouverts ont tous été recalculés.
- **Exercices corrigés : 27.**
  - Fond (calcul, explication ou hypothèse) : 8 (n° 16 à 23).
  - Étoiles : 19 (1 en 3e, 10 en 4e, 8 en 6e).
  - Aucune réponse finale ni aucun index `bonne` n'était faux.
- **Simulations : textes vérifiés pour les 161. Code relu en détail pour environ 25** : test de flamme, spectre H, Lewis, remplissage, ΔEN et énergies de liaison, Teb, Haber, T–P, perturbation, NO₂, combustibles, Hess, oléique, précipitation 4e, Ks, ion commun, Mohr, potentiels, demi-équations, n.o., Nernst, citron, titrage 6e, carte des isotopes, tableau périodique, conductimètre.
- **Simulations corrigées : 10 éléments, dans 9 fichiers** (n° 1 à 5 et 11 à 15).
- **Simulations validées sur les points incertains des constructeurs :** Kp de Haber, Ks, Nernst, oléique et N_A, NO₂.
- **Signalements de niveau, sans suppression : 7** (n° 34 à 40).
- **Contrôles :** `node --check` OK sur tous les .js ; `check.py` = 0 erreur sur les 4 pages.

## 3. Ce que je n'ai pas eu le temps de vérifier

- Le code d'environ 135 simulations n'a pas été relu ligne à ligne : formules internes des fonctions de dessin, valeurs affichées aux bornes de chaque curseur. Pour elles, je m'appuie sur leurs textes (relus), sur `check.py` (aucune erreur JS, aucune note « bad ») et sur la cohérence avec les exercices correspondants. Les pages prioritaires pour une seconde passe sont :
  - 3e : `c3-c10-chou` (couleurs du chou rouge), `c3-c04-alcalins`, `c3-c06-solubilite` (tables de solubilité en fonction de T) ;
  - 5e : `c5-c06-calorimetre` (modèle de pertes), `c5-c07-collisions`, `c5-c10-combustion` ;
  - 6e : `c6-c05-sels`, `c6-c05-indicateur`, `c6-c04-calcul-ph` (vérification numérique sur toute la plage des curseurs), `c6-c03-*` (masses molaires des polymères), `c6-c10-engrais`.
- L'originalité des énoncés (aucun énoncé recopié d'un manuel) n'a pas été contrôlée.
- Les attendus du référentiel FWB restent en partie déduits (`_plans/RECHERCHE-sciences.md` les marque « DÉD » pour les UAA 4 et 6 à 8) : les signalements de niveau n° 34 à 40 reposent sur ce découpage.
- Le rendu visuel (couleurs, lisibilité sur mobile) n'a pas été vérifié.
