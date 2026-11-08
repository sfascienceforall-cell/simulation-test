/* SFA · page dédiée à une simulation (même gabarit que les pages de chimie) — novembre 2026.
   Chargée après sfa-sec.js, page.js du cours et le fichier sims-NN.js du chapitre. window.SFA_SIMPAGE = id de la simulation. */
(function () {
"use strict";
/* Charge les fichiers sims-NN.js du cours qui manquent (dans l'ordre) ; again = recharger aussi ceux déjà présents. */
function loadCourse(again, cb) {
  var M = window.SFA.meta, have = {}, todo = [], redo = [];
  Array.prototype.forEach.call(document.scripts, function (s) { var m = /sims-(\d+)\.js/.exec(s.src || ""); if (m) have[m[1]] = 1; });
  for (var i = 1; i <= Math.max(M && M.chapitres ? M.chapitres.length : 1, 1); i++) { var nn = String(i).padStart(2, "0"); if (!have[nn]) todo.push(nn); else if (again) redo.push(nn); }
  todo = todo.concat(redo);
  var left = todo.length; if (!left) { cb(); return; }
  todo.forEach(function (nn) { var s = document.createElement("script"); s.async = false; s.src = "../sims-" + nn + ".js"; s.onload = s.onerror = function () { if (--left === 0) cb(); }; document.head.appendChild(s); });
}
var retried = false;
function start() {
  var S = window.SFA, M = S.meta, id = window.SFA_SIMPAGE;
  var d = S.sims.filter(function (s) { return s.id === id; })[0];
  if (!d && !retried) { retried = true; loadCourse(true, start); return; }
  if (!d) { document.body.innerHTML = "<p style='padding:30px'>Simulation introuvable.</p>"; return; }
  var ci = 0; M.chapitres.forEach(function (c, i) { if (c.id === d.ch) ci = i; });
  var c = M.chapitres[ci];
  var mates = S.sims.filter(function (s) { return s.ch === d.ch; });
  var k = mates.indexOf(d), prev = mates[k - 1], next = mates[k + 1];
  function rel(u) { return /^(https?:|\/|#)/.test(u) ? u : "../" + u; }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function strip(t) { return String(t || "").replace(/<[^>]+>/g, ""); }
  document.body.classList.add("m-" + (M.matiere || "maths"));
  document.title = strip(d.titre) + " · " + (M.court || M.titre) + " · SFA";
  var nav = (M.nav || []).map(function (n) { return '<a href="' + rel(n[0]) + '"' + (n[2] ? ' class="on"' : "") + ">" + n[1] + "</a>"; }).join("");
  var prepa = M.prepa || "https://sciencesforall.be/concours";
  document.getElementById("app").innerHTML =
    '<header class="sfa-top"><div class="in"><a class="sfa-logo" href="https://sciencesforall.be"><i>SFA</i>Science For All</a><nav class="sfa-nav">' + nav + '</nav><a class="sfa-cta" href="' + prepa + '">Prépa concours médecine</a></div></header>' +
    '<div class="sfa-page"><nav class="sfa-crumbs" aria-label="Fil d\'Ariane"><a href="../">' + esc(M.court || M.titre) + '</a>›<a href="../#c=' + ci + '">' + esc(c.titre) + "</a>›<b>" + esc(strip(d.titre)) + "</b></nav>" +
    '<div class="sfa-grid"><main style="min-width:0">' +
    '<div class="sfa-titlecard"><div class="sfa-chips"><span class="sfa-chip">' + esc(M.court || M.titre) + " · Ch. " + (ci + 1) + '</span><span class="sfa-chip free">Gratuit</span>' + (d.tag ? '<span class="sfa-chip">' + esc(d.tag) + "</span>" : "") + "</div><h1>" + d.titre + "</h1><p>" + (d.but || d.resume || "") + "</p></div>" +
    '<section class="sfa-sim simhost" id="host"></section>' +
    '<div class="sp-next"><a class="sp-go" href="../#c=' + ci + '&v=theo"><small>Rappel</small><b>Théorie du chapitre</b></a><a class="sp-go ex" href="../#c=' + ci + '&v=list"><small>S\'entraîner</small><b>Exercices du chapitre ★ → ★★★★★</b></a>' +
    (next ? '<a class="sp-go nx" href="../' + next.id + '/" rel="next"><small>Simulation suivante →</small><b>' + strip(next.titre) + "</b></a>"
          : (M.chapitres[ci + 1] ? '<a class="sp-go nx" href="../#c=' + (ci + 1) + '"><small>Chapitre suivant →</small><b>' + esc(M.chapitres[ci + 1].titre) + "</b></a>" : "")) + "</div>" +
    (prev ? '<a class="sp-prev" href="../' + prev.id + '/" rel="prev">← ' + strip(prev.titre) + "</a>" : "") +
    "</main>" +
    '<aside class="sfa-side"><div class="sfa-list"><h2>' + esc(c.titre) + "<span>" + mates.length + " simulation" + (mates.length > 1 ? "s" : "") + "</span></h2><ol>" +
    mates.map(function (s, j) { return '<li><a href="../' + s.id + '/"' + (s === d ? ' class="on" aria-current="page"' : "") + "><i>" + String(j + 1).padStart(2, "0") + "</i>" + strip(s.titre) + "</a></li>"; }).join("") + "</ol>" +
    '<div class="sp-chap"><a href="../#c=' + ci + '">Tout le chapitre ' + (ci + 1) + " →</a></div></div>" +
    '<div class="sfa-promo"><small>Envie d\'aller plus loin ?</small><b>La prépa concours médecine SFA : le cours complet, les exercices type examen corrigés et le suivi.</b><a href="' + prepa + '">Voir la prépa concours médecine</a></div></aside></div></div>' +
    '<footer class="sfa-foot">Science For All · ' + esc(M.court || M.titre) + "</footer>";
  if (window.SFANAV) window.SFANAV.mount();
  /* flèches du clavier : simulation précédente / suivante (sauf pendant la saisie ou sur un curseur) */
  document.addEventListener("keydown", function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    var t = ev.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
    if (ev.key === "ArrowRight" && next) location.href = "../" + next.id + "/";
    else if (ev.key === "ArrowLeft" && prev) location.href = "../" + prev.id + "/";
  });
  var host = document.getElementById("host");
  var kit = S.mount(d, host);
  /* Certaines simulations utilisent des aides communes définies dans le fichier d'un autre chapitre
     (ex. B4, C4 dans sims-01.js). Si la construction échoue faute d'une telle aide, on charge les autres
     fichiers sims-NN.js du cours puis on reconstruit la simulation. */
  var bad = host.querySelector(".note.bad");
  if (bad && !retried && /is not (defined|a function)|Cannot read prop|undefined/.test(bad.textContent)) {
    retried = true;
    if (kit) kit._alive = false;
    loadCourse(false, function () {
      host.innerHTML = "";
      S.sims = S.sims.filter(function (s) { return s === d || s.id !== d.id; });   /* pas de doublon de la simulation */
      S.mount(d, host);
    });
  }
}
/* Les aides communes d'un cours (ex. B4 en biologie 4e, C4 en chimie 4e) sont définies dans sims-01.js :
   on le charge d'abord s'il manque, pour éviter un premier essai en échec. */
function boot() {
  var has01 = Array.prototype.some.call(document.scripts, function (s) { return /sims-01\.js/.test(s.src || ""); });
  if (has01 || !window.SFA || !window.SFA.meta) { start(); return; }
  var s = document.createElement("script"); s.src = "../sims-01.js";
  s.onload = s.onerror = function () { start(); };
  document.head.appendChild(s);
}
document.addEventListener("DOMContentLoaded", boot);
})();
