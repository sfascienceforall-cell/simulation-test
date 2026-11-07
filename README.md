# SFA · simulations (secondaire + université hors physique et chimie)

Site statique (GitHub Pages) : simulations interactives, théorie animée et exercices ★ → ★★★★★.

- `secondaire/` : maths, physique, chimie, biologie, de la 3e à la 6e (FWB), 10 chapitres par année.
- `universite/` : mathématiques, biologie, biostatistique (BA1).
- La physique et la chimie universitaires restent sur le site principal :
  https://sfascienceforall-cell.github.io/simulations/ (liens absolus dans `kit/sfa-nav.js` : `PHYS`, `CHIMIE`, `PREPA`).

## Navigation commune
`kit/sfa-nav.js` + `kit/sfa-nav.css` : barre identique sur toutes les pages (menu « Cours », recherche globale ⌘K ou `/`,
« Reprendre », bouton Prépa), barre du bas sur téléphone, couleur de la matière. Les pages de cours ont des onglets de
chapitre (Aperçu · Simulations · Théorie · Exercices, chapitre précédent / suivant).

## Reconstruire
```sh
# un cours (chemin relatif vers la racine du site en 2e argument)
python3 kit/build_course.py secondaire/maths/4e ../../../
python3 kit/build_course.py universite/biologie ../../
# index de recherche (après tout ajout de simulation)
node kit/build_search_index.js
# contrôle d'un cours
python3 kit/check-course.py secondaire/maths/4e
```
Voir `kit/GUIDE-COURS.md` pour écrire un cours.
