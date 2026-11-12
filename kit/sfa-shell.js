/* SFA · habillage commun des pages de simulation — novembre 2026.
   - Pages de physique autonomes : chargé avec ../phys-meta.js (window.SFA_PHYS) ; s'installe tout seul.
   - Pages du moteur commun : kit/sim-page.js appelle SFASHELL.engine({...}) après avoir construit la page.
   Ajoute (sans rien retirer) : bandeau du chapitre (n / N, progression, onglets Simulations · Théorie · Exercices),
   barre d'outils (plein écran, recommencer), panneau de réglages, simulation suivante / précédente, flèches du clavier,
   coches « déjà ouverte ». La progression est gardée dans ce navigateur (clé sfa_progress_v1, aucune donnée envoyée). */
(function () {
"use strict";
var LS = "sfa_progress_v1";
function load() { try { var p = JSON.parse(localStorage.getItem(LS) || "null"); if (p && p.v === 1) return p; } catch (e) {} return { v: 1, visits: {}, attempts: [] }; }
function save(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} }
function keyOf(href) { try { return new URL(href, location.href).pathname.replace(/index\.html$/, "").replace(/\/?$/, "/"); } catch (e) { return String(href); } }
function visit(href) { var p = load(), k = keyOf(href), o = p.visits[k] || { n: 0 }; o.n++; o.last = Date.now(); if (!o.first) o.first = o.last; p.visits[k] = o; save(p); }
function seen(href) { return !!load().visits[keyOf(href)]; }
function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function $(s, r) { return (r || document).querySelector(s); }

/* bandeau du chapitre : o = {cours, ci, n, titre, sims:[{href,t}], cur, theo, exos} */
function strip(o) {
  var main = $(".sfa-grid main") || $("main"); if (!main || $(".sh-strip")) return;
  var nSeen = 0, dots = o.sims.map(function (s, i) {
    var sn = i === o.cur || seen(s.href); if (sn) nSeen++;
    return '<a href="' + esc(s.href) + '" title="' + esc(s.t) + '" class="' + (i === o.cur ? "cur" : sn ? "seen" : "") + '" aria-label="' + esc(s.t) + '"></a>';
  }).join("");
  var d = document.createElement("div"); d.className = "sh-strip";
  d.innerHTML = '<div class="sh-l"><small>' + esc(o.cours) + " · Chapitre " + (o.ci + 1) + " / " + o.n + "</small><b>" + esc(o.titre) + "</b>" +
    '<div class="sh-prog"><div class="sh-dots">' + dots + '</div><span class="sh-cnt">' + nSeen + " sur " + o.sims.length + " ouverte" + (nSeen > 1 ? "s" : "") + "</span></div></div>" +
    '<nav class="sh-tabs" aria-label="Parties du chapitre"><a class="on" aria-current="page">Simulations</a>' +
    '<a href="' + esc(o.theo || "#") + '"' + (o.theo ? "" : ' class="dis"') + ">Théorie</a>" +
    '<a href="' + esc(o.exos || "#") + '"' + (o.exos ? "" : ' class="dis"') + ">Exercices</a></nav>";
  main.insertBefore(d, main.firstChild);
}

/* barre d'outils de la simulation */
function tools(host) {
  if (!host || host.querySelector(".sh-tools")) return;
  host.classList.add("sh-fs");
  var t = document.createElement("div"); t.className = "sh-tools";
  t.innerHTML = '<span class="lab">Simulation interactive</span><span class="bt">' +
    '<button type="button" data-a="re" title="Remettre la simulation à zéro">↺<span class="tx"> Recommencer</span></button>' +
    (document.fullscreenEnabled ? '<button type="button" data-a="fs" title="Afficher la simulation en plein écran">⛶<span class="tx"> Plein écran</span></button>' : "") + "</span>";
  t.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.a === "re") location.reload();
    else if (document.fullscreenElement) document.exitFullscreen();
    else host.requestFullscreen().catch(function () {});
  });
  document.addEventListener("fullscreenchange", function () {
    var b = t.querySelector('[data-a="fs"]'); if (b) b.innerHTML = document.fullscreenElement ? '✕<span class="tx"> Quitter le plein écran</span>' : '⛶<span class="tx"> Plein écran</span>';
    setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 60);
  });
  host.insertBefore(t, host.firstChild);
}

/* coches dans la liste latérale */
function marks() {
  Array.prototype.forEach.call(document.querySelectorAll(".sfa-list ol a"), function (a) { if (!a.classList.contains("on") && seen(a.href)) a.classList.add("sh-seen"); });
}

function keys(prev, next) {
  document.addEventListener("keydown", function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || document.fullscreenElement) return;
    var t = ev.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON" || (t && t.isContentEditable)) return;
    if (ev.key === "ArrowRight" && next) location.href = next;
    else if (ev.key === "ArrowLeft" && prev) location.href = prev;
  });
}

/* ---------- pages de physique autonomes ---------- */
function phys() {
  var P = window.SFA_PHYS; if (!P) return;
  var id = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "").split("/").pop();
  var ci = -1, k = -1;
  P.chapitres.forEach(function (c, i) { c.sims.forEach(function (s, j) { if (s.id === id && ci < 0) { ci = i; k = j; } }); });
  if (ci < 0) return;                                   /* page hors carte (ex. exercices) : on ne touche à rien */
  var c = P.chapitres[ci], prev = c.sims[k - 1], next = c.sims[k + 1], nc = P.chapitres[ci + 1];
  var exo = c.exo != null ? "../exercices/#c=" + c.exo : null;
  document.body.classList.add("sh-phys", "simpage");
  document.body.style.setProperty("--acc", "#b42318"); document.body.style.setProperty("--acc-t", "#fdeceb");
  visit(location.href);
  strip({ cours: P.cours, ci: ci, n: P.chapitres.length, titre: c.t, cur: k,
          sims: c.sims.map(function (s) { return { href: "../" + s.id + "/", t: s.t }; }),
          theo: exo ? exo + "&v=theo" : null, exos: exo ? exo + "&v=list" : null });
  var host = $(".sfa-sim");
  tools(host);
  /* panneau de réglages : les rangées de commandes consécutives sont regroupées dans une carte */
  if (host) {
    var kids = Array.prototype.slice.call(host.children), run = [];
    var flush = function () {
      if (run.length) { var box = document.createElement("div"); box.className = "sh-ctrl"; box.innerHTML = "<h3>Réglages</h3>";
        run[0].parentNode.insertBefore(box, run[0]); run.forEach(function (r) { box.appendChild(r); }); }
      run = [];
    };
    kids.forEach(function (el) { if (el.classList && el.classList.contains("row")) run.push(el); else if (el.tagName !== "SCRIPT" || !run.length) flush(); });
    flush();
  }
  /* suite du parcours */
  if (host && !$(".sp-next")) {
    var nx = document.createElement("div"); nx.className = "sp-next";
    nx.innerHTML = (exo ? '<a class="sp-go" href="' + exo + '&v=theo"><small>Rappel</small><b>Théorie du chapitre</b></a>' +
                          '<a class="sp-go ex" href="' + exo + '&v=list"><small>S\'entraîner</small><b>Exercices du chapitre ★ → ★★★★★</b></a>' : "") +
      (next ? '<a class="sp-go nx" href="../' + next.id + '/" rel="next"><small>Simulation suivante →</small><b>' + esc(next.t) + "</b></a>"
            : nc ? '<a class="sp-go nx" href="../' + nc.sims[0].id + '/"><small>Chapitre suivant →</small><b>' + esc(nc.t) + "</b></a>" : "");
    host.parentNode.insertBefore(nx, host.nextSibling);
    if (prev) { var pv = document.createElement("a"); pv.className = "sp-prev"; pv.rel = "prev"; pv.href = "../" + prev.id + "/"; pv.textContent = "← " + prev.t; nx.parentNode.insertBefore(pv, nx.nextSibling); }
  }
  var list = $(".sfa-list");
  if (list && !list.querySelector(".sp-chap")) { var ch = document.createElement("div"); ch.className = "sp-chap"; ch.innerHTML = '<a href="../#' + c.id + '">Tout le chapitre ' + (ci + 1) + " →</a>"; list.appendChild(ch); }
  marks();
  keys(prev ? "../" + prev.id + "/" : null, next ? "../" + next.id + "/" : null);
}

/* ---------- pages du moteur commun (appelé par sim-page.js ; il gère déjà flèches et suite du parcours) ---------- */
function engine(o) {
  visit(location.href);
  strip({ cours: o.cours, ci: o.ci, n: o.n, titre: o.titre, cur: o.cur, sims: o.sims, theo: o.theo, exos: o.exos });
  tools(o.host || $(".simhost"));
  marks();
}

window.SFASHELL = { engine: engine, visit: visit, seen: seen, load: load, save: save, key: keyOf };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", phys); else phys();
})();
