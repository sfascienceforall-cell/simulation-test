# Relecture du professeur de biostatistique — nuit du 4 novembre 2026

Pages relues :
- `universite/statistique/` : 10 chapitres, 48 simulations, 140 exercices.
- `secondaire/maths/4e/` : ch. 10, 5 simulations, 10 exercices.
- `secondaire/maths/6e/` : ch. 7 à 10, 16 simulations, 40 exercices.

Méthode :
- Tous les exercices ont été extraits avec node (vm + `SFA.exos`).
- Tous les calculs ont été refaits en Python (scipy) : les ★★★ à ★★★★★, et aussi presque tous les ★ et ★★.
- Le code de chaque simulation a été lu en entier.
- La bibliothèque numérique commune (`ST` : ncdf, tcdf, tppf, chi2cdf, fcdf, betai) a été comparée à scipy : erreur < 3·10⁻⁸ sur Φ et < 10⁻¹² sur t, χ² et F.
- Les fonctions Φ (série), quantiles t tabulés, binomiale et Poisson des fichiers sims-01 à 05 ont aussi été contrôlées.

## Tableau des éléments corrigés ou signalés

| n° | Page · id ou exercice | Statut | Ce qui était faux | Correction |
|---|---|---|---|---|
| 1 | BA1 · `us-c06-ic-100-echantillons` | corrigé | L'option « z, σ connu » utilisait le vrai σ : la couverture est alors exactement de 95 %. Pourtant la note (« avec z et un petit n, l'intervalle est trop étroit ») et le piège affirmaient le contraire. L'erreur annoncée (z avec s estimé) n'était pas simulable. | Ajout d'une 3e méthode « z avec s estimé (erreur) ». La note d'avertissement est rattachée à cette méthode. « z, σ connu » est désormais présenté comme exact. |
| 2 | BA1 · `us-c06-ic-largeur` | corrigé | La lecture « n pour diviser la marge par 2 » affichait toujours 4n. C'est faux avec Student pour un petit n : à n = 5, il suffit de n = 18 et non 20. | Calcul exact du plus petit n qui divise la marge par 2, affiché avec « (≈ 4n = …) ». |
| 3 | BA1 · `us-c09-risque-relatif-odds-ratio` | corrigé | La note « Maladie rare : l'OR est très proche du RR » ne testait que le risque des non-exposés. Avec p₀ = 0,10 et RR = 5, on obtient OR = 9 contre RR = 5, et la note restait « ok ». « À retenir » parlait seulement du risque de base. | La condition porte maintenant sur les deux risques (max ≤ 10 %). « À retenir » dit : « rare dans les deux groupes ». |
| 4 | BA1 · `us-c10-quatre-jeux-memes-statistiques` | corrigé | Le but annonçait que les statistiques « s'effondrent » quand on retire le point influent. Pour le jeu 3, r passe en réalité de 0,82 à 0,997. | Texte rectifié : jeu 3, r monte à presque 1 ; jeu 4, plus de droite calculable. |
| 5 | BA1 · `us-c03-tableau` | corrigé | Faute de langue : « le VPP … est inférieur ». | « la VPP … est inférieure ». |
| 6 | 4e · `m4-c10-extreme` | corrigé | Le piège disait que la moyenne « dépasse 8 des 10 salaires ». Faux à la valeur par défaut (3,5 k€ : 6 sur 10) comme à 30 k€ (9 sur 10). | « Avec un 10e salaire de 30 k€, la moyenne (5,12 k€) dépasse 9 des 10 salaires ». |
| 7 | 6e · `m6-c08-arrangement-combinaison` | corrigé | Bug d'affichage de la note « Podium » : « 10 × = 10 » pour k = 1, produit tronqué pour k ≥ 3. | Le produit est construit à partir des k facteurs (n × (n−1) × …). |
| 8 | 6e · `m6-c10-binom-normale` | corrigé | La note disait que la correction de continuité est « la plus proche » : ce n'est pas toujours vrai. | « en général la plus proche ». |
| 9 | BA1 · c08 ex. « Mann-Whitney à la main » (★★★) | corrigé | Corrigé faux : « avec 4 et 5 sujets, même une séparation presque parfaite des rangs ne suffit pas pour p < 5 % ». En réalité, U = 0 donne p = 0,016 et U = 1 donne p = 0,032 (loi exacte recalculée). | Phrase remplacée par les vraies valeurs ; U = 3 donne p = 0,111. |
| 10 | 6e · c10 QCM « Cloche plus étalée » (★★★★) | corrigé | Le distracteur D « Environ 0,683 × 2 = 0,683 » était absurde et ne correspondait à aucune erreur typique. | Nouveau distracteur : « Environ 0,954 : avec σ = 8, l'intervalle couvre ±2σ » (erreur d'inversion), avec son `pourquoi`. |
| 11 | BA1 · c06 ex. « IC d'une proportion » | corrigé (précision) | Seul exercice à exiger np ≥ 10, alors que les chapitres 4 et 5 et le secondaire utilisent ≥ 5, sans explication. | Ajout de la convention : ≥ 10 souvent exigé pour un IC (Wald), ≥ 5 courant pour approcher une probabilité binomiale. |
| 12 | BA1 · c10 QCM « IC d'un coefficient de corrélation » (★★★★★) | signalé + mention | Transformation de Fisher : hors du minimum de nombreux cours de BA1. Calculs justes ([0,31 ; 0,79]). | Mention « (Complément …) » ajoutée à l'énoncé. |
| 13 | BA1 · c08 « t pour deux groupes » | corrigé (étoiles) | ★ annoncé pour 4 étapes (ES combinée, t, ddl, décision). | ★ → ★★ |
| 14 | BA1 · c08 « IC d'une différence de moyennes » | corrigé (étoiles) | ★★ annoncé pour sp², ES, t, p et IC. | ★★ → ★★★ |
| 15 | BA1 · c08 QCM « Calcul de d » | corrigé (étoiles) | ★★★ annoncé pour une seule division (8/16). | ★★★ → ★ (répartition 3/3/3/3/2 du chapitre conservée) |
| 16 | 4e · c10 QCM « Écart-type » | corrigé (étoiles) | ★★★ pour un calcul direct d'écart-type. | ★★★ → ★★ |
| 17 | 4e · c10 « Données regroupées en classes » | corrigé (étoiles) | ★★★★ pour une application de méthode (centres, cumul, densité). | ★★★★ → ★★★ |
| 18 | 4e · c10 « Ajouter une donnée » | corrigé (étoiles) | ★★★★★ : c'est un défi intra-chapitre (formule de König donnée en indice), pas une synthèse. | ★★★★★ → ★★★★ (répartition du chapitre : 2/3/2/2/1) |
| 19 | BA1 · `us-c01-et-contre-es` | signalé | La simulation utilise σ (population) mais nomme l'ES « s/√n » et l'IC est calculé avec t. C'est une simplification de présentation (s ≈ σ), pas une erreur de valeur. | Aucune (mineur). |
| 20 | BA1 · `us-c04-log-qq` | signalé | Histogramme borné à 80 mg/L : avec une dispersion de 1, environ 1 % des 300 valeurs sont hors cadre sans avertissement. La droite de Henry, elle, les inclut. | À élargir plus tard (borne dynamique). |
| 21 | BA1 · `us-c08-taille-d-effet-cohen` | signalé | « t attendu / p attendue » = t et p si le d observé égale le vrai d. Ce n'est pas l'espérance de p. | Libellé à préciser (« si d observé = d réel »). |
| 22 | 6e · `m6-c07-anscombe` | signalé | Ce sont les données publiées du quartet d'Anscombe (1973), reprises telles quelles. Cela heurte la règle « 100 % original ». La page BA1 a, elle, construit des données originales. | À décider par la direction (classique du domaine public pédagogique). |
| 23 | Secondaire et BA1 · notation de la loi normale | signalé | Le 6e écrit N(μ ; σ), le BA1 écrit N(μ ; σ²). Chaque page est cohérente et explicite, mais l'élève qui passe de l'une à l'autre peut se tromper. | Ajouter un rappel de notation en BA1 c04 (à faire). |
| 24 | Niveau · 4e c10 | signalé | Le paradoxe de Simpson (simulation `m4-c10-trompeur` et exercice ★★★★★) dépasse le programme de 4e. Correctement placé en défi. L'écart-type est présent selon les réseaux. | Garder comme défi / approfondissement. |
| 25 | Niveau · BA1 | signalé | Selon les facultés, ceci dépasse le BA1 « minimum » : corrélation partielle (c10 « Variable cachée », ★★★★, formule donnée), régression logistique (c10), test de Welch avec ddl de Satterthwaite, χ² d'hétérogénéité (c09), loi gamma exacte citée en c05. | Aucune suppression ; à présenter comme compléments. |

## Points incertains signalés par les constructeurs : verdict

| Point | Verdict |
|---|---|
| Méthode des quartiles | **Validé.** Partout « médiane de chaque moitié, médiane exclue si n impair » : sims-01 BA1, sim et exercices du 4e, exercices BA1. Le 4e prévient que la méthode varie selon les écoles. |
| np ≥ 5 contre ≥ 10 | **Validé, avec harmonisation.** ≥ 5 pour approcher la binomiale (BA1 c04, 6e c10, avec « parfois ≥ 10 » en `us-c04-approx-normale`). ≥ 10 pour l'IC de Wald (c06). Explication ajoutée (ligne 11). |
| Puissance par approximation normale | **Validé.** Formules justes. `us-c07-taille-echantillon-puissance` annonce « formule approchée (loi normale) ». La 2e queue est incluse en bilatéral. |
| Transformation de Fisher en BA1 | **Signalé comme complément** (ligne 12). Calcul juste. |
| ROC à variances égales | **Validé.** Annoncé « Modèle simplifié : deux lois normales de même écart-type ». AUC = Φ(Δ/√2) et seuil de Youden = Δ/2 sont justes pour ce modèle. |

## Éléments validés sans modification (résumé)

- **QCM :** les 65 QCM ont été vérifiés (index `bonne`, distracteurs, `pourquoi`). Aucun index faux. Aucun distracteur ne devient juste par arrondi ou par une autre convention. Les références par lettre (« phrase B ») sont valides, car l'interface ne mélange pas les choix (A–D fixes).
- **Exercices ★★★ à ★★★★★ :** les 110 ont été recalculés. Toutes les réponses publiées concordent avec le recalcul, à l'arrondi affiché près. Seule exception : le corrigé Mann-Whitney (ligne 9).
  - Exemples contrôlés : Welch ddl 10,6 et p 0,19 ; Fisher hypergéométrique 0,049 / 0,103 ; χ² d'hétérogénéité 1,81 (p 0,77) ; gamma exacte 0,029 ; IC de Fisher [0,31 ; 0,79] ; logistique 0,332 / 0,741 ; surréservation exacte 0,0167 ; Poisson contre binomiale 0,3233 ; anniversaires 0,5073 ; une paire au poker 0,4226 ; régression exponentielle k = 0,408, N(6) ≈ 1 158.
- **Simulations :** les 69 ont été relues ; 61 sont validées sans changement. Formules, unités, bornes des curseurs (divisions par zéro, lignes ou colonnes vides de Fisher, b₁ = 0 en logistique, dispersion nulle du jeu 4…), « À retenir » et « Piège » sont justes. Les modèles simplifiés sont annoncés (Poisson, ROC, régression vers la moyenne, biais de sélection, anniversaires).
- **Contrôle `check.py` après corrections :** 0 erreur sur les trois pages (BA1 : 48 sims / 140 ex. ; 4e : 49 / 100 ; 6e : 40 / 101). `node --check` OK sur chaque fichier modifié.

## Bilan chiffré

- Éléments vérifiés : **259**.
  - 190 exercices, dont 65 QCM et 110 exercices ★★★ à ★★★★★.
  - 69 simulations.
  - La bibliothèque numérique.
- Éléments corrigés : **18**.
  - 8 simulations : 4 erreurs scientifiques, 2 erreurs de texte, 1 bug d'affichage, 1 faute de langue.
  - 4 exercices : 1 corrigé faux, 1 distracteur absurde, 2 précisions.
  - 6 réétiquetages d'étoiles.
- Éléments signalés sans modification : **7** (lignes 19 à 25).

## Non vérifié faute de temps

- Le rendu visuel réel dans un navigateur (chevauchement de textes, lisibilité sur mobile). Seuls la lecture du code et `check.py` ont été faits.
- Le comportement statistique « à long terme » des simulations aléatoires : je n'ai pas fait tourner des milliers de tirages, seulement vérifié la logique.
- La conformité fine des champs `attendus` de `page.js` au texte officiel des référentiels FWB et des programmes des réseaux : documents non disponibles hors ligne.
- Les autres chapitres de maths 4e et 6e : hors périmètre.
