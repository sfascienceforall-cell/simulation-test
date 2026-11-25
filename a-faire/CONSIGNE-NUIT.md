# Consigne de nuit : ajouter les simulations manquantes (sans Enzo)

Enzo dort. **Tu ne lui poses aucune question.** Tu prends la décision la plus raisonnable, tu l'écris dans
`a-faire/RAPPORT-NUIT.md`, et tu continues. Les règles de `CLAUDE.md` restent obligatoires (pas de PhET, rien copié
d'examens, ids existants intouchables, pas de défis en chimie, rien d'externe, aucune clé écrite nulle part).

## La liste du travail
`a-faire/canevas/<domaine>.json` (+ `.md`) : les 204 simulations qui manquent par rapport aux canevas SFA et au cours
de physique quantique. Chaque proposition a un `id`, un `titre`, `ou` (où la ranger), `voit` (ce qu'on voit à l'écran),
une `priorite`. Tu peux améliorer une fiche, pas l'appauvrir.

Ordre obligatoire :
1. **P1** : physique (12), chimie (5), organique (9). En chimie, retire aussi les défis et scores de `uc-c01-bohr`,
   `uc-c04-types-solides` et `uc-c09-entraineur-additions` (règle « pas de défis en chimie »).
2. **P2** : physique et électricité (44), chimie (21), organique (23).
3. **P3** : physique (15), chimie (10), organique (10).
4. **Physique quantique** (`quantique.json`, 45 visuels) en tout dernier : nouveau cours `universite/quantique/`,
   uniquement des visuels par chapitre, ni exercices ni théorie. Les orbitales 3D sont celles de la chimie (lien, pas doublon).

## Comment avancer
- Par lots de 3 à 5 simulations, un agent `dev-simulation-sfa` par lot, plusieurs lots en parallèle (4 au plus).
  Chaque agent travaille dans ses propres fichiers (voir ci-dessous) et ne publie rien.
- **Physique BA1 (`ph-…`, `el-…`)** : l'agent écrit le corps `a-faire/travail/<id>.html` (un seul
  `<section class="sfa-sim">…</section>` autonome, modèles : `universite/physique/fils-paralleles-3d`,
  `reflexion-obstacle`, `harmoniques-tuyaux`) et `a-faire/travail/<id>.json` : `{"titre","sous_titre","intro","section","mots"}`.
  Test : `python3 kit/tmp_phys_page.py a-faire/travail/<id>.html`, puis `python3 kit/test_sims.py universite/physique --only _tmp-<id>`
  (ou Playwright à la main), puis supprimer `universite/physique/_tmp-<id>`.
  Intégration (le chef, une page à la fois, jamais deux en même temps) :
  `python3 kit/add_phys_sim.py <id> "<titre>" "<sous_titre>" "<intro>" <section> a-faire/travail/<id>.html "<mots>"`,
  vignette `universite/physique/thumbs/<id>.jpg` (640 × 397, capture du canevas), puis `node kit/build_search_index.js`.
- **Chimie BA1 (`ch-…`, `org-…`)** : chaque lot a SON fichier `universite/chimie/sims-<LOT>.js` (ex. `sims-V1A.js`),
  autonome (pas de dépendance à un autre fichier sims), `ch` = un chapitre existant de `universite/chimie/page.js`.
  Brancher le fichier : `python3 kit/add_course_sims.py universite/chimie sims-<LOT>.js`.
  **Ne lance jamais `kit/build_course.py` sur `universite/chimie`** : il réécrit toutes les pages du cours.
  Modèles : `sims-L15.js` (isomères 3D), `sims-L18.js` (SN2 3D).
- **Contrôles avant chaque publication** : `node --check` ; `python3 kit/test_sims.py <dossier>` à 0 erreur ;
  captures 1280 et 420 px regardées par toi ; valeurs recalculées en Python ; `verificateur-simulation-sfa` et
  `relecteur-scientifique-sfa` sur le lot. Ce qui est refusé est corrigé ou laissé de côté (et noté), jamais publié.
- **Publier** après chaque lot accepté : `git fetch origin && git rebase origin/main && git push origin HEAD:main`.
  Puis ouvre une page en ligne pour vérifier.

## Le rapport du matin
Tiens à jour `a-faire/RAPPORT-NUIT.md` (et pousse-le avec chaque lot) :
- ce qui est en ligne (id, titre, lien) ;
- ce qui a été refusé ou mis de côté, et pourquoi ;
- les décisions prises sans Enzo ;
- les doutes scientifiques à faire valider ;
- où tu t'es arrêté.
Si la limite de dépense de la clé est atteinte ou si une erreur bloque tout, écris-le en tête du rapport et arrête-toi proprement.
