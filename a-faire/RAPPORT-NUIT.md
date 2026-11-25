# Rapport de nuit : 25-26/11/2026

Le chef des simulations travaille seul pendant la nuit, sur la demande d'Enzo :
il vérifie chaque lot, publie ceux qui passent les contrôles, puis enchaîne P1 → P2 → P3 → physique quantique.
Pour le lycée, rien n'est supprimé : il n'y a que des propositions.

## Incident

- 26/11 : les 8 agents se sont arrêtés en cours de route (crédit API épuisé). Le travail fait est resté dans les worktrees (`git status` vérifié pour chaque lot). Après la recharge, chaque agent a repris là où il s'était arrêté, avec son contexte.

## Vague P1 (26 simulations) : en cours

| Lot | État | Publié | Remarques |
|---|---|---|---|
| p1-magn | repris après l'arrêt | – | |
| p1-rot | repris après l'arrêt | – | |
| p1-flu-opt | repris après l'arrêt | – | |
| p1-thermo | repris après l'arrêt | – | |
| p1-chimie | repris après l'arrêt | – | |
| p1-orga1 | repris après l'arrêt | – | |
| p1-orga2 | repris après l'arrêt | – | |
| lycee | accepté (21 cours à 0 erreur, captures relues) | 26/11, commit 05584fb | noms affichés seulement + audit ; contenu encore FWB |

## Décisions prises sans Enzo

- `a-faire/CONSIGNE-NUIT.md` et la liste `a-faire/canevas/` sont arrivés sur main pendant la nuit (autre session). Les `id` des nouvelles simulations suivent cette liste (`ph-…`, `ch-…`, `org-…`), même si les agents de P1 avaient d'abord pris d'autres noms : rien n'était encore publié.
- Les 7 lots de P1 tournaient déjà en parallèle avant la consigne « 4 lots au plus » ; pour P2, P3 et la quantique, 4 lots au plus.
- Lycée : en 3e, la carte affiche « Collège · 3e » ; dans le menu « Cours », les niveaux sont abrégés en 3e / 2de / 1re / Tle (faute de place).
- Lycée : l'alcootest (`chimie/6e`) garde la limite belge de 0,22 mg/L, présentée comme telle (« en Belgique »). La limite française de 0,25 mg/L changerait la valeur par défaut, donc les vidéos.

## Propositions pour le lycée (rien n'est supprimé)

L'audit complet est dans `audit/lycee-programme.md`. Sur les 160 chapitres : 88 à garder, 52 à déplacer d'un niveau, 20 hors programme français.
- Le site n'a **aucune géologie en SVT**, alors que les géosciences sont au programme à tous les niveaux.
- Physique de Terminale : 6 chapitres hors programme (magnétisme, induction, alternatif, oscillations…). Il manque la thermodynamique, le mouvement dans un champ, le circuit RC et l'effet photoélectrique.
- Maths : Seconde et Première suivent le nouveau programme (BO du 2/4/2026). Le second degré et la trigonométrie passent en Première ; les limites passent en Terminale.
- Un chapitre « à déplacer » ne peut pas changer de `ch` ni d'URL (règle 4). Deux possibilités : le garder comme « pour aller plus loin », ou faire une nouvelle simulation au bon niveau. **C'est à Enzo de choisir.**
- Tant que l'audit n'est pas traité, les introductions des cours disent « programme de l'Éducation nationale » alors que le contenu reste en grande partie celui de la FWB.

## Valeurs par défaut changées et reels à refilmer

(rien pour l'instant)

## Doutes à trancher par Enzo

(rien pour l'instant)
