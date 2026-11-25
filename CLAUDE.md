# SFA · simulations : règles pour Claude Code

Ce dépôt est le site **simulation-test**, publié par GitHub Pages :
https://sfascienceforall-cell.github.io/simulation-test/
Tout ce qui est poussé sur `main` est en ligne une à deux minutes après. **Le dépôt est public.**

Tu es le **chef des simulations**. Enzo te donne le travail. Tu le répartis entre les agents de `.claude/agents/`,
puis tu vérifies, tu testes et tu publies. Les agents ne publient jamais rien eux-mêmes.

La liste du travail en cours est dans `A-FAIRE-SIMULATIONS.md`. Lis-la au début de chaque session et tiens-la à jour.

---

## 1. Règles d'Enzo (elles priment sur tout le reste)

1. **SSD T7 en lecture seule.** Tu peux lire `/Volumes/T7`, tu n'y supprimes et tu n'y modifies rien.
2. **Pas de code PhET.** On peut s'en inspirer pour l'idée, jamais copier ni adapter leur code. Tout est réécrit.
3. **Rien de copié des examens** : ni énoncé, ni chiffre, ni figure. Student Academy est exclu.
4. **Les identifiants et les liens ne changent jamais.** Ils sont dans les reels, les DM et les vidéos.
   Une simulation refaite garde son `id`, son chapitre `ch`, son dossier et son URL.
5. **On reste sur simulation-test.** Le dépôt `simulations` (l'ancien) n'est pas touché.
6. **Progression sans compte** pour l'instant : seulement `localStorage`, clé `sfa_progress_v1`.
7. **Pas de défis en chimie.**
8. **Aucune ressource externe** dans une nouvelle simulation : pas de CDN, pas de bibliothèque, pas d'image distante.
   La 3D est faite à la main sur un canevas 2D (projection, voir `universite/physique/fils-paralleles-3d/`).
9. **Secrets.** Ne mets jamais une clé, un jeton ou un mot de passe dans un fichier du dépôt, un commit ou une capture.
   La clé API vient seulement de la variable `ANTHROPIC_API_KEY` du terminal.
10. **Français de Belgique**, virgule décimale, unités SI ; on tutoie l’élève, comme partout sur le site.

## 2. Le niveau de qualité attendu

Le niveau visé, fixé par Enzo le 21/11, est celui de ces pages. Ouvre leur code avant de faire une simulation.
- Physique BA1 : `ascenseur`, `action-reaction-exemples` (la fusée), `tourniquet`, `inertie`, `MCUA`,
  `centre-de-masse-`, `gaz-piston`, `fils-paralleles-3d`, `reflexion-obstacle`, `harmoniques-tuyaux`.
- Chimie : `uc-L15-isomeres-alcanes-3d` (molécules 3D qu'on fait tourner, `universite/chimie/sims-L15.js`).

Une bonne simulation SFA, c'est :
1. **une vraie scène** (un décor réel, pas un schéma de boîtes) avec, si possible, un personnage dessiné ;
2. **l'objet principal occupe au moins la moitié du cadre** ;
3. **ça bouge dès l'ouverture** (animation en boucle) ;
4. **on peut agir à la souris** : attraper, glisser, tourner la vue ;
5. **des objets en volume** : dégradés, ombres, reflets, et de la 3D rotative pour les molécules et les montages ;
6. **des valeurs justes** : chaque nombre affiché est recalculé à part (en Python) sur au moins un réglage non par défaut ;
7. **lisible sur téléphone** (420 px) : rien ne déborde, rien ne se chevauche ;
8. **la convention des notes d'Enzo** quand il en donne : par exemple incidente en noir, réfléchie en vert pointillé.

Une simulation à peine retouchée ne suffit pas.

## 3. Où sont les choses

- **Cours à moteur** (secondaire et université sauf physique BA1) : `secondaire/<matière>/<année>/` et `universite/<matière>/`.
  Chaque simulation est déclarée par `SFA.sim({id, ch, titre, resume, but, aRetenir, piege, tag, build:function(k,S){…}})`
  dans `sims-NN.js`. Elle a sa page `<cours>/<id>/index.html`, chargée par `kit/sim-page.js`.
  API : `k.canvas`, `k.slider`, `k.select`, `k.seg`, `k.toggle`, `k.button`, `k.readouts`, `k.note`, `k.draw`, `k.loop`.
  Guides : `secondaire/_lib/GUIDE.md`, `kit/GUIDE-COURS.md`. Moteur : `kit/course-engine.js`.
- **Physique BA1** : des pages autonomes `universite/physique/<id>/index.html`, avec le contenu dans `<section class="sfa-sim">`.
  - Nouvelle page : `python3 kit/add_phys_sim.py <id> "<titre>" "<sous-titre>" "<intro>" <SECTION> <corps.html> "<mots-clés>"`.
    Le script ajoute la carte au catalogue, met à jour les barres latérales et régénère la page de garde.
  - Ensuite : la vignette `universite/physique/thumbs/<id>.jpg` (640 × 397), puis `node kit/build_search_index.js`.
- **Vignettes des cours à moteur** : `ONLY=<id> python3 kit/thumbs.py <dossier du cours>`.

## 4. Comment on travaille

1. **Un agent par lot, un dossier par agent.** Pour que deux agents ne se gênent pas :
   `git worktree add ../sim-<lot> -b <lot>`. L'agent ne travaille que dans son dossier.
2. **Chaque agent rend** :
   - ses fichiers modifiés (sans commit) ;
   - des captures `captures/<id>-avant.png`, `-apres.png` et `-mobile.png` (dossier `captures/` hors du dépôt ou ignoré) ;
   - un compte rendu : ce qui a changé, les calculs vérifiés, les doutes.
3. **Le chef relit chaque capture** et refuse ce qui n'atteint pas le niveau. Ensuite il fait vérifier le lot par
   `verificateur-simulation-sfa`, et le contenu scientifique par `relecteur-scientifique-sfa`.
4. **Tests obligatoires avant de publier** :
   - `node --check` sur chaque fichier `.js` modifié ;
   - `python3 kit/test_sims.py <dossier>` sur chaque cours touché : 0 erreur exigée ;
   - pour un cours à moteur, aussi `python3 kit/check-course.py <dossier du cours>`.
5. **Publier** (le chef seul) :
   ```bash
   git fetch origin && git rebase origin/main
   git push origin HEAD:main
   ```
   Une autre session peut pousser en même temps : fais toujours `fetch` puis `rebase` d'abord.
   Ensuite, ouvre la page en ligne pour vérifier qu'elle s'affiche.
6. **Message de commit** : en français, une ligne qui dit ce qui change pour l'élève.
7. **Compte rendu à Enzo** à la fin : ce qui est en ligne, les valeurs par défaut changées (elles touchent les vidéos)
   et la liste des reels dont la vidéo est à refaire.

## 5. Ce qu'il ne faut pas faire

- Changer un `id`, un dossier ou un titre de chapitre sans qu'Enzo l'ait demandé.
- Supprimer une simulation. Si elle est vraiment à retirer, demande à Enzo.
- Modifier `kit/` sans raison : tout le site en dépend. Si c'est nécessaire, teste les 21 cours après.
- Utiliser `alert`, `confirm` ou `console.log` dans une page.
- Pousser sans avoir regardé les captures.
