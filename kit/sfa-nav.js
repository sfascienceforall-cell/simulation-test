/* SFA · barre de navigation commune (novembre 2026).
   Une seule barre, identique partout : logo · menu « Cours » (panneau Secondaire / Université) · recherche globale (⌘K ou /) ·
   bouton Prépa. Sur téléphone : barre en bas (Cours, Recherche, Reprendre, Prépa).
   Utilisation : <script src="…/kit/sfa-nav.js"></script> ; la barre remplace le <header class="sfa-top"> (pages de cours et de
   simulation) ou le <header class="top"> (pages d'accueil). La configuration du site est dans SITE (en tête du fichier). */
(function () {
  "use strict";
  var me = document.currentScript && document.currentScript.src || "";
  var ROOT = me.replace(/kit\/sfa-nav\.js.*$/, "");               /* racine de ce site (avec / final) */
  var SITE = {"home": "", "acc": "#13233a", "ph": "Rechercher une notion, une simulation…", "mats": {"maths": "#1e3f8f", "physique": "#b42318", "chimie": "#2e6b55", "biologie": "#5B21B6", "statistique": "#0e7490"}, "links": [["SFA", "https://sciencesforall.be"], ["Prépa médecine", "https://sciencesforall.be/concours"]], "bottom": ["Prépa", "https://sciencesforall.be/concours"], "cols": [{"t": "Secondaire", "s": "FWB · 3e → 6e", "w": 1.5, "grid": [{"t": "Mathématiques", "a": "#1e3f8f", "l": [["3e", "secondaire/maths/3e/"], ["4e", "secondaire/maths/4e/"], ["5e", "secondaire/maths/5e/"], ["6e", "secondaire/maths/6e/"]]}, {"t": "Physique", "a": "#b42318", "l": [["3e", "secondaire/physique/3e/"], ["4e", "secondaire/physique/4e/"], ["5e", "secondaire/physique/5e/"], ["6e", "secondaire/physique/6e/"]]}, {"t": "Chimie", "a": "#2e6b55", "l": [["3e", "secondaire/chimie/3e/"], ["4e", "secondaire/chimie/4e/"], ["5e", "secondaire/chimie/5e/"], ["6e", "secondaire/chimie/6e/"]]}, {"t": "Biologie", "a": "#5B21B6", "l": [["3e", "secondaire/biologie/3e/"], ["4e", "secondaire/biologie/4e/"], ["5e", "secondaire/biologie/5e/"], ["6e", "secondaire/biologie/6e/"]]}], "all": ["Tout le secondaire", "secondaire/"]}, {"t": "Université", "s": "BA1 médecine, pharma, biomed, sciences", "w": 1, "list": [["Mathématiques", "universite/maths/", "#1e3f8f"], ["Biologie", "universite/biologie/", "#5B21B6"], ["Biostatistique", "universite/statistique/", "#0e7490"]], "all": ["Toute l'université", "universite/"]}]};
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function here() { return location.href.split("#")[0].replace(/index\.html$/, ""); }
  function matiere() {
    var m = (window.SFA && window.SFA.meta && window.SFA.meta.matiere) || "";
    if (!m) { var b = document.body.className.match(/\bm-(\w+)/); if (b) m = b[1]; }
    if (!m) { var p = here().replace(ROOT, ""); var x = /(?:secondaire|universite)\/(maths|physique|chimie|biologie|statistique)/.exec(p); if (x) m = x[1]; }
    if (!m && SITE.matOf) m = SITE.matOf(here().replace(ROOT, ""));
    return m;
  }

  /* ---------- reprise : dernière page visitée (propre à ce site : pas de pont entre dépôts) ---------- */
  var LKEY = "sfa_last:" + ROOT.replace(/^https?:\/\/[^/]+/, "");
  function remember() {
    try {
      var t = document.title.replace(/ · SFA$/, "");
      if (location.href.split("#")[0].replace(/index\.html$/, "") !== ROOT || location.hash) localStorage.setItem(LKEY, JSON.stringify({ u: location.href, t: t }));
    } catch (e) {}
  }
  function last() { try { return JSON.parse(localStorage.getItem(LKEY) || "null"); } catch (e) { return null; } }

  /* ---------- panneau « Cours » ---------- */
  function panel() {
    var cur = here(), L = last();
    var h = '<div class="nv-panel" id="nvPanel" role="dialog" aria-label="Tous les cours"><div class="nv-pin" style="grid-template-columns:' + SITE.cols.map(function (c) { return (c.w || 1) + "fr"; }).join(" ") + '">';
    SITE.cols.forEach(function (c, ci) {
      h += '<div class="nv-col"><h3>' + c.t + (c.s ? " <small>" + c.s + "</small>" : "") + "</h3>";
      if (c.grid) {
        h += '<div class="nv-sgrid">';
        c.grid.forEach(function (m) { h += '<div class="nv-mat" style="--a:' + m.a + '"><b>' + m.t + "</b><div>";
          m.l.forEach(function (y) { var u = url(y[1]); h += '<a href="' + u + '"' + (cur === u ? ' class="on"' : "") + ">" + y[0] + "</a>"; }); h += "</div></div>"; });
        h += "</div>";
      }
      if (c.chips) { h += '<div class="nv-chips">'; c.chips.forEach(function (u) { h += '<a href="' + url(u[1]) + '">' + u[0] + "</a>"; }); h += "</div>"; }
      if (c.list) {
        h += '<div class="nv-ugrid">';
        c.list.forEach(function (u) { var href = url(u[1]); h += '<a class="nv-u' + (cur === href ? " on" : "") + '" style="--a:' + (u[2] || SITE.acc) + '" href="' + href + '"><i></i>' + u[0] + (u[3] ? "<small>" + u[3] + "</small>" : "") + "</a>"; });
        h += "</div>";
      }
      if (c.all) h += '<a class="nv-all" href="' + url(c.all[1]) + '">' + c.all[0] + " →</a>";
      if (ci === SITE.cols.length - 1 && L) h += '<a class="nv-resume" href="' + esc(L.u) + '"><small>Reprendre</small><b>' + esc(L.t) + "</b></a>";
      h += "</div>";
    });
    h += '<div class="nv-mlinks">' + SITE.links.map(function (l) { return '<a href="' + url(l[1]) + '">' + l[0] + "</a>"; }).join("") + "</div>";
    return h + "</div></div>";
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
      return '<a href="' + esc(url(r.u)) + '" class="nv-r' + (i === sel ? " on" : "") + '" style="--a:' + ((SITE.mats[r.m] || SITE.acc)) + '"><span class="nv-k">' + r.k + "</span><b>" + esc(r.t) + "</b><small>" + esc(r.s || "") + "</small></a>";
    }).join("");
  }
  function move(d) { if (!res.length) return; sel = (sel + d + res.length) % res.length; show(res); var on = document.querySelector(".nv-r.on"); if (on) on.scrollIntoView({ block: "nearest" }); }

  /* ---------- montage ---------- */
  function html() {
    var m = matiere(), L = last();
    if (L && L.u.split("#")[0].replace(/index\.html$/, "") === here()) L = null;   /* déjà sur cette page */
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || "");
    return '<div class="nv-in"><a class="nv-logo" href="' + url(SITE.home) + '"><i>SFA</i><span>Science For All</span></a>' +
      '<button class="nv-btn nv-cours" type="button" aria-expanded="false" aria-controls="nvPanel">Cours <span class="nv-car">▾</span></button>' +
      SITE.links.map(function (l) { return '<a class="nv-btn nv-lk" href="' + url(l[1]) + '">' + l[0] + "</a>"; }).join("") +
      '<button class="nv-search" type="button"><span class="nv-ico">⌕</span><span class="nv-ph">' + SITE.ph + '</span><kbd>' + (isMac ? "⌘" : "Ctrl") + " K</kbd></button>" +
      '<span class="nv-sp"></span>' +
      (L ? '<a class="nv-btn nv-res" href="' + esc(L.u) + '" title="' + esc(L.t) + '">↻ Reprendre</a>' : "") + "</div>" + panel();
  }
  var mounted = false;
  function mount() {
    if (mounted) return;
    var hd = document.querySelector("header.sfa-top, header.top");
    if (!hd) return;
    mounted = true;
    var m = matiere();
    hd.className = "nv-top"; hd.id = "nvTop"; document.body.style.setProperty("--acc", SITE.mats[m] || SITE.acc); hd.innerHTML = html();
    /* recherche (superposée) */
    var o = document.createElement("div"); o.id = "nvSearch"; o.className = "nv-search-o";
    o.innerHTML = '<div class="nv-sbox" role="dialog" aria-label="Recherche"><div class="nv-sin"><span class="nv-ico">⌕</span><input id="nvQ" type="search" placeholder="Rechercher dans tous les cours…" autocomplete="off"><button type="button" class="nv-x" aria-label="Fermer">Échap</button></div><div id="nvRes" class="nv-resl"></div></div>';
    document.body.appendChild(o);
    /* barre du bas (téléphone) */
    var L = last();
    var bb = document.createElement("nav"); bb.className = "nv-bottom"; bb.setAttribute("aria-label", "Navigation");
    bb.innerHTML = '<button type="button" data-a="cours"><i>☰</i>Cours</button><button type="button" data-a="search"><i>⌕</i>Recherche</button>' +
      '<a href="' + (L ? esc(L.u) : ROOT) + '"><i>↻</i>Reprendre</a><a href="' + url(SITE.bottom[1]) + '"><i>★</i>' + SITE.bottom[0] + '</a>';
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
  function tryMount(n) { mount(); if (!mounted && n > 0) setTimeout(function () { tryMount(n - 1); }, 100); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { tryMount(30); }); else tryMount(30);
})();
