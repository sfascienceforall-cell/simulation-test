/* SFA · barre de navigation commune (novembre 2026).
   Une seule barre, identique partout : logo · menu « Cours » (panneau Secondaire / Université) · recherche globale (⌘K ou /) ·
   bouton Prépa. Sur téléphone : barre en bas (Cours, Recherche, Reprendre, Prépa).
   Utilisation : <script src="…/kit/sfa-nav.js"></script> ; la barre remplace le <header class="sfa-top"> (pages de cours et de
   simulation) ou le <header class="top"> (pages d'accueil). Les adresses du site de physique et de chimie sont dans PHYS / CHIMIE. */
(function () {
  "use strict";
  var me = document.currentScript && document.currentScript.src || "";
  var ROOT = me.replace(/kit\/sfa-nav\.js.*$/, "");               /* racine de ce site (avec / final) */
  var PHYS = "https://sfascienceforall-cell.github.io/simulations/";  /* site de physique et chimie (unif) */
  var CHIMIE = PHYS + "chimie/";
  var PREPA = PHYS + "prepa/";
  var MATS = [["maths", "Mathématiques", "#1e3f8f"], ["physique", "Physique", "#b42318"], ["chimie", "Chimie", "#2e6b55"], ["biologie", "Biologie", "#5B21B6"]];
  var YEARS = ["3e", "4e", "5e", "6e"];
  var UNIF = [["Physique", PHYS, "#b42318", "physique"], ["Chimie", CHIMIE, "#2e6b55", "chimie"], ["Mathématiques", ROOT + "universite/maths/", "#1e3f8f", "maths"],
              ["Biologie", ROOT + "universite/biologie/", "#5B21B6", "biologie"], ["Biostatistique", ROOT + "universite/statistique/", "#0e7490", "statistique"]];
  var ACC = { maths: "#1e3f8f", physique: "#b42318", chimie: "#2e6b55", biologie: "#5B21B6", statistique: "#0e7490" };
  window.SFANAV_CFG = { ROOT: ROOT, PHYS: PHYS, CHIMIE: CHIMIE, PREPA: PREPA };

  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function here() { return location.href.split("#")[0].replace(/index\.html$/, ""); }
  function matiere() {
    var m = (window.SFA && window.SFA.meta && window.SFA.meta.matiere) || "";
    if (!m) { var b = document.body.className.match(/\bm-(\w+)/); if (b) m = b[1]; }
    if (!m) { var p = here().replace(ROOT, ""); var x = /(?:secondaire|universite)\/(maths|physique|chimie|biologie|statistique)/.exec(p); if (x) m = x[1]; }
    return m;
  }

  /* ---------- reprise : dernière page visitée ---------- */
  function remember() {
    try {
      var t = document.title.replace(/ · SFA$/, "");
      if (/\/(secondaire|universite)\/[^/]+\//.test(location.pathname) || location.hash) localStorage.setItem("sfa_last", JSON.stringify({ u: location.href, t: t }));
    } catch (e) {}
  }
  function last() { try { return JSON.parse(localStorage.getItem("sfa_last") || "null"); } catch (e) { return null; } }

  /* ---------- panneau « Cours » ---------- */
  function panel() {
    var cur = here();
    var h = '<div class="nv-panel" id="nvPanel" role="dialog" aria-label="Tous les cours"><div class="nv-pin">';
    h += '<div class="nv-col"><h3>Secondaire <small>FWB · 3e → 6e</small></h3><div class="nv-sgrid">';
    MATS.forEach(function (m) {
      h += '<div class="nv-mat" style="--a:' + m[2] + '"><b>' + m[1] + "</b><div>";
      YEARS.forEach(function (y) { var u = ROOT + "secondaire/" + m[0] + "/" + y + "/"; h += '<a href="' + u + '"' + (cur === u ? ' class="on"' : "") + ">" + y + "</a>"; });
      h += "</div></div>";
    });
    h += '</div><a class="nv-all" href="' + ROOT + 'secondaire/">Tout le secondaire →</a></div>';
    h += '<div class="nv-col"><h3>Université <small>BA1 médecine, pharma, biomed, sciences</small></h3><div class="nv-ugrid">';
    UNIF.forEach(function (u) { h += '<a class="nv-u' + (cur === u[1] ? " on" : "") + '" style="--a:' + u[2] + '" href="' + u[1] + '"><i></i>' + u[0] + "</a>"; });
    h += '</div><a class="nv-all" href="' + ROOT + 'universite/">Toute l\'université →</a>';
    var L = last(); if (L) h += '<a class="nv-resume" href="' + esc(L.u) + '"><small>Reprendre</small><b>' + esc(L.t) + "</b></a>";
    h += "</div></div></div>";
    return h;
  }

  /* ---------- recherche globale ---------- */
  var IDX = null, loading = false;
  function loadIndex(cb) {
    if (IDX) { cb(); return; } if (loading) return; loading = true;
    var s = document.createElement("script"); s.src = ROOT + "kit/search-index.js";
    s.onload = function () { IDX = (window.SFA_INDEX || []).map(function (r) { r.n = norm(r.t + " " + (r.s || "") + " " + (r.k || "")); return r; }); cb(); };
    s.onerror = function () { IDX = []; cb(); };
    document.head.appendChild(s);
  }
  function norm(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/<[^>]+>/g, ""); }
  function url(u) { return /^https?:/.test(u) ? u : ROOT + u; }
  var sel = 0, res = [];
  function openSearch() {
    var o = document.getElementById("nvSearch"); o.classList.add("open"); document.body.classList.add("nv-lock");
    var i = document.getElementById("nvQ"); i.value = ""; i.focus(); show([]);
    loadIndex(function () { run(i.value); });
  }
  function closeSearch() { var o = document.getElementById("nvSearch"); if (o) o.classList.remove("open"); document.body.classList.remove("nv-lock"); }
  function run(v) {
    var n = norm(v).trim(); if (!IDX) return;
    if (!n) { show([]); return; }
    var words = n.split(/\s+/);
    res = IDX.filter(function (r) { return words.every(function (w) { return r.n.indexOf(w) >= 0; }); });
    var rank = { cours: 0, chapitre: 1, simulation: 2 };
    res.sort(function (a, b) { var sa = norm(a.t).indexOf(words[0]) === 0 ? 0 : 1, sb = norm(b.t).indexOf(words[0]) === 0 ? 0 : 1; return (rank[a.k] - rank[b.k]) || (sa - sb); });
    res = res.slice(0, 40); sel = 0; show(res);
  }
  function show(list) {
    var box = document.getElementById("nvRes");
    if (!list.length) { box.innerHTML = '<p class="nv-hint">' + (document.getElementById("nvQ").value ? "Aucun résultat." : "Tape une notion : <i>dérivée</i>, <i>titrage</i>, <i>mitose</i>, <i>lentille</i>, <i>Monty Hall</i>…") + "</p>"; return; }
    box.innerHTML = list.map(function (r, i) {
      return '<a href="' + esc(url(r.u)) + '" class="nv-r' + (i === sel ? " on" : "") + '" style="--a:' + (ACC[r.m] || "#13233a") + '"><span class="nv-k">' + r.k + "</span><b>" + esc(r.t) + "</b><small>" + esc(r.s || "") + "</small></a>";
    }).join("");
  }
  function move(d) { if (!res.length) return; sel = (sel + d + res.length) % res.length; show(res); var on = document.querySelector(".nv-r.on"); if (on) on.scrollIntoView({ block: "nearest" }); }

  /* ---------- montage ---------- */
  function html() {
    var m = matiere(), L = last();
    if (L && L.u.split("#")[0].replace(/index\.html$/, "") === here()) L = null;   /* déjà sur cette page */
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || "");
    return '<div class="nv-in"><a class="nv-logo" href="' + ROOT + '"><i>SFA</i><span>Science For All</span></a>' +
      '<button class="nv-btn nv-cours" type="button" aria-expanded="false" aria-controls="nvPanel">Cours <span class="nv-car">▾</span></button>' +
      '<button class="nv-search" type="button"><span class="nv-ico">⌕</span><span class="nv-ph">Rechercher une notion, une simulation…</span><kbd>' + (isMac ? "⌘" : "Ctrl") + " K</kbd></button>" +
      '<span class="nv-sp"></span>' +
      (L ? '<a class="nv-btn nv-res" href="' + esc(L.u) + '" title="' + esc(L.t) + '">↻ Reprendre</a>' : "") +
      '<a class="nv-cta" href="' + PREPA + '">Prépa médecine</a></div>' + panel();
  }
  var mounted = false;
  function mount() {
    if (mounted) return;
    var hd = document.querySelector("header.sfa-top, header.top");
    if (!hd) return;
    mounted = true;
    var m = matiere();
    hd.className = "nv-top"; hd.id = "nvTop"; document.body.style.setProperty("--acc", ACC[m] || "#13233a"); hd.innerHTML = html();
    /* recherche (superposée) */
    var o = document.createElement("div"); o.id = "nvSearch"; o.className = "nv-search-o";
    o.innerHTML = '<div class="nv-sbox" role="dialog" aria-label="Recherche"><div class="nv-sin"><span class="nv-ico">⌕</span><input id="nvQ" type="search" placeholder="Rechercher dans tous les cours…" autocomplete="off"><button type="button" class="nv-x" aria-label="Fermer">Échap</button></div><div id="nvRes" class="nv-resl"></div></div>';
    document.body.appendChild(o);
    /* barre du bas (téléphone) */
    var L = last();
    var bb = document.createElement("nav"); bb.className = "nv-bottom"; bb.setAttribute("aria-label", "Navigation");
    bb.innerHTML = '<button type="button" data-a="cours"><i>☰</i>Cours</button><button type="button" data-a="search"><i>⌕</i>Recherche</button>' +
      '<a href="' + (L ? esc(L.u) : ROOT) + '"><i>↻</i>Reprendre</a><a href="' + PREPA + '"><i>★</i>Prépa</a>';
    document.body.appendChild(bb); document.body.classList.add("nv-has-bottom");
    var pnl = document.getElementById("nvPanel"), btn = hd.querySelector(".nv-cours");
    function toggle(open) { var on = open == null ? !pnl.classList.contains("open") : open; pnl.classList.toggle("open", on); btn.setAttribute("aria-expanded", on ? "true" : "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    document.addEventListener("click", function (e) { if (pnl.classList.contains("open") && !pnl.contains(e.target) && e.target !== btn) toggle(false); });
    hd.querySelector(".nv-search").addEventListener("click", openSearch);
    bb.querySelector('[data-a="search"]').addEventListener("click", openSearch);
    bb.querySelector('[data-a="cours"]').addEventListener("click", function (e) { e.stopPropagation(); toggle(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    o.addEventListener("click", function (e) { if (e.target === o || e.target.classList.contains("nv-x")) closeSearch(); });
    document.getElementById("nvQ").addEventListener("input", function (e) { run(e.target.value); });
    document.getElementById("nvQ").addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); } else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter" && res[sel]) { location.href = url(res[sel].u); } else if (e.key === "Escape") closeSearch();
    });
    document.addEventListener("keydown", function (e) {
      var t = e.target && e.target.tagName;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
      else if (e.key === "/" && t !== "INPUT" && t !== "TEXTAREA" && t !== "SELECT") { e.preventDefault(); openSearch(); }
      else if (e.key === "Escape") { closeSearch(); toggle(false); }
    });
    remember(); addEventListener("hashchange", remember);
  }
  window.SFANAV = { mount: mount, open: openSearch };
  document.addEventListener("DOMContentLoaded", function () { setTimeout(mount, 0); });
})();
