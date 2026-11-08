/* SFA · moteur des pages de cours (novembre 2026).
   Un cours = des chapitres. Chaque chapitre : simulations (vignettes → page dédiée), théorie animée, exercices avec devanture.
   Données : page.js (SFA.page), sims-NN.js (SFA.sim), exos-NN.js (SFA.exos), theo-NN.js (SFA.theo + SFA.figs),
   + éventuellement LEGACY_CH (anciennes pages d'exercices) et meta.ext (simulations hébergées ailleurs).
   Navigation : #c=3 chapitre · #c=3&v=sims · #c=3&v=theo · #c=3&v=list · #c=3&e=2 exercice · #q=… recherche. */
(function () {
  "use strict";
  var S = window.SFA = window.SFA || {};
  S.meta = S.meta || null; S.sims = S.sims || []; S._ex = S._ex || {}; S._th = S._th || {}; S._fg = S._fg || {};
  S.page = function (m) { S.meta = m; };
  S.sim = function (d) { S.sims.push(d); };
  S.exos = function (ch, l) { (S._ex[ch] = S._ex[ch] || []).push.apply(S._ex[ch], l); };
  S.theo = function (ch, t) { S._th[ch] = t; };
  S.figs = function (ch, l) { S._fg[ch] = l; };
  S.fmt = S.fmt || function (x, d) { if (x == null || isNaN(x)) return "—"; if (d === undefined) d = 2; var s = Number(x).toFixed(d); if (d > 0) s = s.replace(/\.?0+$/, ""); return s.replace("-", "−").replace(".", ","); };
  S.draw = S.draw || { palette: {} };
})();

window.SFA_COURSE = function () {
  "use strict";
  var S = window.SFA, M = S.meta;
  var L = "ABCDEF";
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function strip(t) { return String(t || "").replace(/<[^>]+>/g, ""); }

  /* ---------- construction des chapitres ---------- */
  var legacyMap = {};
  (M.legacy || []).forEach(function (p) { legacyMap[p[0]] = (legacyMap[p[0]] || []).concat([p[1]]); });

  function defaultIcon(c, i) {
    return function () {
      ctx.fillStyle = "#f6f7f9"; ctx.fillRect(0, 0, W, H);
      TB(String(i + 1).padStart(2, "0"), W * .5, H * .44, M.accent || BLUE_D, 54);
      TB(c.titre.length > 34 ? c.titre.slice(0, 32) + "…" : c.titre, W * .5, H * .7, INK, 17);
    };
  }
  function defaultFig(x, c) {
    return function () {
      try { c.ic(); } catch (e) {}
      ctx.fillStyle = "rgba(255,255,255,.78)"; ctx.fillRect(0, 0, W, H);
      TB(x.choix ? "QCM" : "Exercice", W * .5, H * .38, M.accent || BLUE_D, 22);
      var t = strip(x.t || ""); TB(t.length > 30 ? t.slice(0, 28) + "…" : t, W * .5, H * .58, INK, 17);
    };
  }
  function conv(x, fig, c) {
    var st = x.enonce || "";
    if (x.choix) {
      st += '<div class="qcm">' + x.choix.map(function (ch, j) { return '<button type="button" class="btn qc" data-j="' + j + '"><b>' + L[j] + ".</b> " + ch + "</button>"; }).join("") + '</div><div class="qfb"></div>';
    }
    var sol = function () {
      var h = "";
      if (x.choix) h += "<p><b>Bonne réponse : " + L[x.bonne] + ".</b></p>";
      h += x.corrige || "";
      if (x.reponse) h += "<p><b>Réponse : " + x.reponse + "</b></p>";
      if (x.choix && x.pourquoi) {
        var ks = Object.keys(x.pourquoi).filter(function (k) { return +k !== x.bonne; });
        if (ks.length) h += "<p><b>Les pièges</b></p><ul>" + ks.map(function (k) { return "<li><b>" + L[k] + ".</b> " + x.pourquoi[k] + "</li>"; }).join("") + "</ul>";
      }
      return h;
    };
    var o = { t: strip(x.t || (x.choix ? "QCM" : "Exercice")), s: x.s || 1, st: st, sol: sol, _x: x };
    o.d = fig || defaultFig(x, c);
    if (x.indice) o.indice = x.indice;
    return o;
  }

  var CH = M.chapitres.map(function (c, i) {
    var th = S._th[c.id] || {};
    var o = { id: c.id, t: c.titre, resume: c.resume || "", attendus: c.attendus || "", ex: [], sims: [] };
    o.ic = th.icon || defaultIcon(c, i);
    if (th.anim) o.anim = th.anim;
    if (th.th || th.cartes) o.th = th.th || th.cartes.map(function (k) { return '<div class="tcard"><b class="h">' + k.titre + "</b>" + k.html + "</div>"; }).join("");
    if (th.sub) o.sub = th.sub;
    if (th.ctl) o.ctl = th.ctl;
    /* anciens exercices (format {t,s,st,d,sol}) */
    (legacyMap[c.id] || []).forEach(function (k) {
      var lc = window.LEGACY_CH && window.LEGACY_CH[k]; if (!lc) return;
      lc.ex.forEach(function (e) { o.ex.push(e); });
      if (!o.th && (lc.th || lc.sub)) { o.th = lc.th; o.sub = lc.sub; o.ctl = lc.ctl; o.anim = lc.anim; }
      if (!th.icon && lc.ic) o.ic = lc.ic;
    });
    var raw = S._ex[c.id] || [], figs = S._fg[c.id] || [];
    raw.forEach(function (x, j) { o.ex.push(conv(x, figs[j], o)); });
    o.ex.sort(function (a, b) { return (a.s || 1) - (b.s || 1); });
    return o;
  });
  var byId = {}; CH.forEach(function (c, i) { byId[c.id] = i; });
  var ALL = [];
  S.sims.forEach(function (d) { if (byId[d.ch] == null) return; var s = { id: d.id, ch: d.ch, titre: d.titre, resume: d.resume || d.but || "", tag: d.tag, href: d.id + "/", img: "thumbs/" + d.id + ".jpg" }; CH[byId[d.ch]].sims.push(s); ALL.push(s); });
  (M.ext || []).forEach(function (d) { if (byId[d.ch] == null) return; var s = { id: d.id, ch: d.ch, titre: d.titre, resume: d.resume || "", href: d.href, img: d.img, ext: true }; CH[byId[d.ch]].sims.push(s); ALL.push(s); });
  window.CH = CH;

  /* ---------- squelette ---------- */
  var nEx = 0, nQ = 0; CH.forEach(function (c) { c.ex.forEach(function (e) { nEx++; if (e._x && e._x.choix) nQ++; }); });
  document.title = M.titre + " · SFA";
  var nav = (M.nav || []).map(function (n) { return '<a href="' + n[0] + '"' + (n[2] ? ' class="on"' : "") + ">" + n[1] + "</a>"; }).join("");
  var crumbs = (M.crumbs || []).map(function (n) { return '<a href="' + n[0] + '">' + n[1] + "</a>"; }).join("");
  var feat = M.featured && ALL.filter(function (s) { return s.id === M.featured; })[0];
  document.getElementById("app").innerHTML =
    '<header class="sfa-top"><div class="in"><a class="sfa-logo" href="https://sciencesforall.be"><i>SFA</i>Science For All</a><nav class="sfa-nav">' + nav + '</nav><a class="sfa-cta" href="' + (M.prepa || "https://sciencesforall.be/concours") + '">Prépa concours médecine</a></div></header>' +
    '<div class="sfa-page"><nav class="sfa-crumbs" aria-label="Fil d\'Ariane">' + crumbs + "›<b>" + esc(M.court || M.titre) + "</b></nav>" +
    '<div class="sfa-grid"><main style="min-width:0">' +
    '<div class="sfa-titlecard crs-hero"><div class="crs-hero-l"><div class="sfa-chips"><span class="sfa-chip">' + esc(M.kicker || "") + '</span><span class="sfa-chip free">Gratuit</span></div><h1>' + esc(M.titre) + "</h1><p>" + (M.intro || "") + '</p>' +
    '<div class="crs-stats"><div><b>' + CH.length + "</b>chapitres</div><div><b>" + ALL.length + "</b>simulations</div><div><b>" + nEx + '</b>exercices et QCM</div></div>' +
    '<div class="crs-search"><input id="q" type="search" placeholder="Rechercher une notion, une simulation…" aria-label="Rechercher"></div></div>' +
    (feat ? '<a class="crs-feat" href="' + feat.href + '"><small>À essayer en premier</small><img src="' + feat.img + '" alt=""><b>' + esc(feat.titre) + "</b></a>" : "") + "</div>" +
    '<section class="sfa-sim"><div class="sfa-ex">' +
    '<nav class="ch-tabs" id="chTabs" aria-label="Chapitre" hidden></nav>' +
    '<div id="vHome"><p class="sub">Choisis un chapitre. Chaque chapitre contient ses <b>simulations</b>, un <b>rappel théorique</b> avec schéma animé et ses <b>exercices</b> de difficulté croissante (★ → ★★★★★).</p><div class="grid" id="homeGrid"></div></div>' +
    '<div id="vSearch" style="display:none"><div class="row"><button class="btn" onclick="goHome()">☰ Tous les chapitres</button></div><h1 id="sTitle"></h1><div class="sgrid" id="sGrid"></div></div>' +
    '<div id="vChap" style="display:none"><span id="chNum" hidden></span><h1 id="chTitle"></h1><p class="sub" id="chRes"></p>' +
    '<div class="bigrow three"><div class="bigbtn sim" onclick="openSims()"><span class="bi">▶</span>Simulations<small id="chSimN"></small></div><div class="bigbtn" onclick="openTheo()"><span class="bi">∑</span>Théorie<small>rappel de notions + schéma animé</small></div><div class="bigbtn" onclick="openList()"><span class="bi">★</span>Exercices<small id="chExN"></small></div></div>' +
    '<div id="chPeek"></div></div>' +
    '<div id="vSims" style="display:none"><h1 id="smTitle"></h1><div class="sgrid" id="smGrid"></div></div>' +
    '<div id="vTheo" style="display:none"><h1 id="thTitle"></h1><canvas id="cvT"></canvas><div id="thCtl"></div><div id="thBody"></div></div>' +
    '<div id="vList" style="display:none"><span id="bTh" hidden></span><h1 id="liTitle"></h1><div class="row lvf" id="lvF"></div><div class="grid" id="exGrid"></div></div>' +
    '<div id="vExo" style="display:none"><div class="row"><button class="btn" onclick="openList()">☰ Liste</button><button class="btn" onclick="navEx(-1)">◀</button><span class="pill" id="exCnt" style="color:#185fa5;border-color:#b5d4f4;"></span><button class="btn" onclick="navEx(1)">▶</button></div>' +
    '<canvas id="cv"></canvas><div class="fml" id="stmt"></div><div class="row"><button class="btn" id="bInd" onclick="toggleInd()" style="display:none">Indice</button><button class="btn" id="bSol" onclick="toggleSol()">Voir la solution</button><button class="btn" id="bAxes" style="display:none;border-color:#79c6a6;color:#0F6E56;" onclick="axesChoice=1-axesChoice;refreshInfo();">Changer d\'axes</button></div>' +
    '<div class="row" id="rowSl" style="display:none;"><span class="pill" id="slLab" style="color:#BA7517;border-color:#f5c88f;"></span><input type="range" id="sl" style="accent-color:#BA7517;max-width:280px;"><span class="val" id="slV" style="color:#BA7517;border-color:#f5c88f;"></span></div>' +
    '<div class="info" id="info"></div></div>' +
    "</div></section></main>" +
    '<aside class="sfa-side"><div class="sfa-list"><h2>Chapitres<span>' + nEx + ' exercices</span></h2><ol id="sideList"></ol></div>' +
    '<div class="sfa-promo"><small>Envie d\'aller plus loin ?</small><b>La prépa concours médecine SFA : le cours complet, les exercices type examen corrigés et le suivi.</b><a href="' + (M.prepa || "https://sciencesforall.be/concours") + '">Voir la prépa concours médecine</a></div></aside></div></div>' +
    '<footer class="sfa-foot">Science For All · ' + esc(M.pied || "simulations, théorie et exercices") + "</footer>";

  document.body.classList.add("m-" + (M.matiere || "maths"));
  if (window.SFANAV) window.SFANAV.mount();
  var side = document.getElementById("sideList");
  CH.forEach(function (c, i) { var li = document.createElement("li"); li.innerHTML = '<a href="#c=' + i + '" data-c="' + i + '"><i>' + String(i + 1).padStart(2, "0") + "</i>" + esc(c.t) + "<em>" + c.sims.length + " · " + c.ex.length + "</em></a>"; side.appendChild(li); });
  function hl() { var m = /c=(\d+)/.exec(location.hash), c = m ? m[1] : null; document.querySelectorAll(".sfa-list a[data-c]").forEach(function (a) { a.classList.toggle("on", a.dataset.c === c); }); }
  addEventListener("hashchange", hl);

  /* ---------- vues ---------- */
  var views = ["vHome", "vSearch", "vChap", "vSims", "vTheo", "vList", "vExo"];
  function tabs(id) {
    var t = document.getElementById("chTabs"); if (!t) return;
    if (id === "vHome" || id === "vSearch") { t.hidden = true; return; }
    var c = CH[ci], th = !!(c.sub || c.th), cur = { vChap: "o", vSims: "s", vTheo: "t", vList: "e", vExo: "e" }[id];
    function b(k, lab, fn, n) { return '<button type="button" class="ct' + (cur === k ? " on" : "") + '" onclick="' + fn + '">' + lab + (n != null ? "<em>" + n + "</em>" : "") + "</button>"; }
    t.innerHTML = '<button type="button" class="ct-nav" onclick="openChap(' + (ci - 1) + ')"' + (ci ? "" : " disabled") + ' title="Chapitre précédent" aria-label="Chapitre précédent">‹</button>' +
      '<button type="button" class="ct-ch" onclick="goHome()" title="Tous les chapitres"><small>Chapitre ' + (ci + 1) + " / " + CH.length + "</small><b>" + esc(c.t) + "</b></button>" +
      '<div class="ct-seg">' + b("o", "Aperçu", "openChap(ci)") + b("s", "Simulations", "openSims()", c.sims.length) + (th ? b("t", "Théorie", "openTheo()") : "") + b("e", "Exercices", "openList()", c.ex.length) + "</div>" +
      '<button type="button" class="ct-nav" onclick="openChap(' + (ci + 1) + ')"' + (ci < CH.length - 1 ? "" : " disabled") + ' title="Chapitre suivant" aria-label="Chapitre suivant">›</button>';
    t.hidden = false;
  }
  function show(id) { tabs(id); var host = document.querySelector(".sfa-ex"); if (host) { host.classList.remove("vfade"); void host.offsetWidth; host.classList.add("vfade"); } views.forEach(function (v) { document.getElementById(v).style.display = v === id ? "block" : "none"; }); document.querySelector(".crs-hero").style.display = (id === "vHome" || id === "vSearch") ? "" : "none"; window.scrollTo(0, 0); hl(); }
  function simCard(s, showCh) {
    var c = CH[byId[s.ch]];
    return '<a class="scard" href="' + s.href + '"><img loading="lazy" src="' + s.img + '" alt="" onerror="this.style.visibility=\'hidden\'"><div><small>' + (showCh ? "Ch. " + (byId[s.ch] + 1) + " · " : "") + esc(s.tag || c.t) + "</small><b>" + esc(s.titre) + "</b><span>" + esc(strip(s.resume)) + "</span></div></a>";
  }
  window.goHome = function () { view = "home"; show("vHome"); setHash(""); };
  window.openChap = function (i) {
    ci = i; var c = CH[i]; view = "chap";
    document.getElementById("chNum").textContent = "Chapitre " + (i + 1) + " / " + CH.length;
    document.getElementById("chTitle").textContent = c.t;
    document.getElementById("chRes").innerHTML = c.resume + (c.attendus ? '<br><span class="att"><b>Au programme :</b> ' + c.attendus + "</span>" : "");
    document.getElementById("chSimN").textContent = c.sims.length ? c.sims.length + " simulation" + (c.sims.length > 1 ? "s" : "") + " à manipuler" : "bientôt";
    document.getElementById("chExN").textContent = c.ex.length + " exercices, du plus simple à l'examen";
    document.getElementById("chPeek").innerHTML = c.sims.length ? '<h3 class="peek">Les simulations du chapitre</h3><div class="sgrid">' + c.sims.slice(0, 6).map(function (s) { return simCard(s); }).join("") + "</div>" : "";
    show("vChap"); setHash("c=" + i);
  };
  window.openSims = function () { var c = CH[ci]; view = "sims"; document.getElementById("smTitle").textContent = c.t + " — simulations"; document.getElementById("smGrid").innerHTML = c.sims.map(function (s) { return simCard(s); }).join("") || '<p class="sub">Pas encore de simulation pour ce chapitre.</p>'; show("vSims"); setHash("c=" + ci + "&v=sims"); };
  window.openTheo = function (k) { var c = CH[ci]; if (!c.sub && !c.th) { openList(); return; } view = "theo"; ti = (c.sub && k > 0 && k < c.sub.length) ? k : 0; renderTheo(); show("vTheo"); setHash("c=" + ci + "&v=theo" + (ti ? "&t=" + ti : "")); };
  window.setTi = function (k) { ti = k; renderTheo(); setHash("c=" + ci + "&v=theo" + (ti ? "&t=" + ti : "")); };
  function renderTheo() {
    var c = CH[ci];
    if (c.sub) { var tb = '<div class="row">'; c.sub.forEach(function (s, k) { tb += '<button class="btn' + (k === ti ? " on" : "") + '" onclick="setTi(' + k + ')">' + (k + 1) + ". " + s.t + "</button>"; }); tb += "</div>";
      document.getElementById("thCtl").innerHTML = tb + (c.sub[ti].ctl || ""); document.getElementById("thTitle").textContent = c.t + " — " + c.sub[ti].t; document.getElementById("thBody").innerHTML = c.sub[ti].th; }
    else { document.getElementById("thCtl").innerHTML = c.ctl || ""; document.getElementById("thTitle").textContent = c.t + " — théorie"; document.getElementById("thBody").innerHTML = c.th; }
  }
  var lvf = 0;
  window.openList = function () {
    view = "list"; var c = CH[ci], th = !!(c.sub || c.th);
    document.getElementById("liTitle").textContent = c.t + " — exercices";
    document.getElementById("bTh").style.display = th ? "" : "none";
    var f = document.getElementById("lvF"); f.innerHTML = "";
    [[0, "Tous"], [1, "★"], [2, "★★"], [3, "★★★"], [4, "★★★★"], [5, "★★★★★"]].forEach(function (p) {
      var n = p[0] ? c.ex.filter(function (e) { return e.s === p[0]; }).length : c.ex.length; if (p[0] && !n) return;
      var b = document.createElement("button"); b.className = "btn" + (lvf === p[0] ? " on" : ""); b.textContent = p[1] + " (" + n + ")";
      b.onclick = function () { lvf = p[0]; openList(); }; f.appendChild(b);
    });
    buildExGrid(); show("vList"); setHash("c=" + ci + "&v=list");
  };
  var showInd = false;
  window.openEx = function (j) {
    ei = j; view = "exo"; reveal = false; p = 0; axesChoice = 0; showInd = false;
    var b = document.getElementById("bSol"); b.className = "btn"; b.textContent = "Voir la solution";
    var e = CH[ci].ex[j];
    document.getElementById("bAxes").style.display = e.axesBtn ? "" : "none";
    document.getElementById("bInd").style.display = e.indice ? "" : "none";
    var rs = document.getElementById("rowSl");
    if (e.sl) { rs.style.display = "flex"; var s = document.getElementById("sl"); s.min = e.sl.min; s.max = e.sl.max; s.step = e.sl.step; s.value = e.sl.val; document.getElementById("slLab").textContent = e.sl.lab; document.getElementById("slV").textContent = e.sl.val + e.sl.unit; }
    else rs.style.display = "none";
    cvE.style.cursor = e.d3 ? "grab" : "";
    refreshExo(); show("vExo"); setHash("c=" + ci + "&e=" + j);
  };
  window.navEx = function (d) { var n = CH[ci].ex.length; openEx((ei + n + d) % n); };
  window.toggleSol = function () { reveal = !reveal; p = 0; var b = document.getElementById("bSol"); b.className = reveal ? "btn on" : "btn"; b.textContent = reveal ? "Cacher la solution" : "Voir la solution"; refreshInfo(); };
  window.toggleInd = function () { showInd = !showInd; refreshInfo(); };
  function refreshExo() {
    var e = CH[ci].ex[ei];
    document.getElementById("exCnt").innerHTML = "Exercice " + (ei + 1) + "/" + CH[ci].ex.length + " — " + "★".repeat(e.s) + "☆".repeat(5 - e.s);
    document.getElementById("stmt").innerHTML = "<b>" + e.t + (/[?!.]$/.test(e.t) ? "" : ".") + "</b> " + e.st; refreshInfo();
  }
  window.refreshExo = refreshExo;
  function refreshInfo() {
    var e = CH[ci].ex[ei];
    document.getElementById("info").innerHTML = reveal ? (typeof e.sol === "function" ? e.sol.call(e) : e.sol) : (showInd && e.indice ? "<b>Indice.</b> " + e.indice : "Cherche d’abord sur papier, puis clique « Voir la solution ».");
  }
  window.refreshInfo = refreshInfo;
  /* QCM interactif */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".qc"); if (!b || view !== "exo") return;
    var e = CH[ci].ex[ei], x = e._x; if (!x || !x.choix) return;
    var box = b.parentNode; if (box.dataset.done) return; box.dataset.done = 1;
    var j = +b.dataset.j, ok = j === x.bonne;
    b.classList.add(ok ? "good" : "bad"); if (!ok) box.children[x.bonne].classList.add("good");
    var why = x.pourquoi && x.pourquoi[j];
    box.nextElementSibling.innerHTML = ok ? "✅ <b>Bonne réponse.</b>" : "❌ <b>Pas tout à fait.</b> " + (why || "");
    if (!reveal) toggleSol();
  });
  document.getElementById("sl").addEventListener("input", function (ev) { var e = CH[ci].ex[ei]; if (!e || !e.sl) return; e.sl.val = parseFloat(ev.target.value); document.getElementById("slV").textContent = e.sl.val + e.sl.unit; if (reveal) refreshInfo(); });
  window.addEventListener("keydown", function (e) { if (view !== "exo") return; if (e.key === "ArrowRight") navEx(1); if (e.key === "ArrowLeft") navEx(-1); if (e.key === "Escape") openList(); });

  function lvClass(s) { return s <= 2 ? "lv1" : (s === 3 ? "lv2" : (s === 4 ? "lv3" : "lv4")); }
  function paint(fn, w, h) { var mc = ctx, mW = W, mH = H; var pc = document.createElement("canvas"); var d = Math.min(2, window.devicePixelRatio || 1); pc.width = w * d; pc.height = h * d; ctx = pc.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0); W = w; H = h; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); try { fn(); } catch (er) {} ctx = mc; W = mW; H = mH; return pc; }
  function buildHome() {
    var g = document.getElementById("homeGrid");
    CH.forEach(function (c, i) {
      var card = document.createElement("div"); card.className = "card";
      card.appendChild(paint(function () { c.ic(); }, 460, 260));
      var cap = document.createElement("div"); cap.className = "cap";
      cap.innerHTML = '<span class="num">ch. ' + (i + 1) + '</span><div class="tt">' + esc(c.t) + '</div><span class="lv lv2">' + c.sims.length + " simulation" + (c.sims.length > 1 ? "s" : "") + '</span> <span class="lv lv3">' + ((c.sub || c.th) ? "théorie + " : "") + c.ex.length + " exercices</span>";
      card.appendChild(cap); card.onclick = function () { openChap(i); }; g.appendChild(card);
    });
  }
  function buildExGrid() {
    var g = document.getElementById("exGrid"); g.innerHTML = "";
    CH[ci].ex.forEach(function (e, j) {
      if (lvf && e.s !== lvf) return;
      var card = document.createElement("div"); card.className = "card";
      card.appendChild(paint(function () { if (e.draw) e.draw.call(e, 1); else if (e.d) e.d(1); else CH[ci].ic(); }, 460, 280));
      var cap = document.createElement("div"); cap.className = "cap";
      cap.innerHTML = '<span class="num">n°' + (j + 1) + (e._x && e._x.choix ? " · QCM" : "") + '</span><div class="tt">' + e.t + '</div><span class="lv ' + lvClass(e.s) + '">' + "★".repeat(e.s) + "</span>";
      card.appendChild(cap); card.onclick = function () { openEx(j); }; g.appendChild(card);
    });
  }
  /* recherche */
  var q = document.getElementById("q");
  q.addEventListener("input", function () { var v = q.value.trim(); if (!v) { goHome(); return; } doSearch(v); setHash("q=" + encodeURIComponent(v)); });
  function norm(t) { return strip(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function doSearch(v) {
    view = "search"; var n = norm(v);
    var sims = ALL.filter(function (s) { return norm(s.titre + " " + s.resume + " " + CH[byId[s.ch]].t).indexOf(n) >= 0; });
    var chs = CH.map(function (c, i) { return [c, i]; }).filter(function (p) { return norm(p[0].t + " " + p[0].resume + " " + p[0].attendus).indexOf(n) >= 0; });
    document.getElementById("sTitle").textContent = sims.length + " simulation" + (sims.length > 1 ? "s" : "") + " et " + chs.length + " chapitre" + (chs.length > 1 ? "s" : "") + " pour « " + v + " »";
    document.getElementById("sGrid").innerHTML = chs.map(function (p) { return '<a class="scard chlink" href="#c=' + p[1] + '"><div><small>Chapitre ' + (p[1] + 1) + "</small><b>" + esc(p[0].t) + "</b><span>Simulations, théorie et exercices →</span></div></a>"; }).join("") + sims.map(function (s) { return simCard(s, true); }).join("");
    show("vSearch");
  }

  /* canvases principaux */
  var cvE = document.getElementById("cv"), cxE = cvE.getContext("2d");
  var cvT = document.getElementById("cvT"), cxT = cvT.getContext("2d");
  window.cxE = cxE;
  var pX = 0, pY = 0;
  cvT.addEventListener("pointerdown", function (e) { dragT = true; pX = e.clientX; pY = e.clientY; try { cvT.setPointerCapture(e.pointerId); } catch (er) {} });
  cvT.addEventListener("pointermove", function (e) { if (!dragT) return; ORB.a += (e.clientX - pX) * .008; ORB.b += (e.clientY - pY) * .006; if (ORB.b < .05) ORB.b = .05; if (ORB.b > 1.35) ORB.b = 1.35; pX = e.clientX; pY = e.clientY; });
  window.addEventListener("pointerup", function () { dragT = false; });
  function syncE() { var r = cvE.getBoundingClientRect(), d = window.devicePixelRatio || 1, nW = Math.round(r.width) || 700, nH = Math.round(r.height) || 300; if (cvE.width !== Math.round(nW * d)) { cvE.width = nW * d; cvE.height = nH * d; } cxE.setTransform(d, 0, 0, d, 0, 0); W = nW; H = nH; ctx = cxE; }
  function syncT() { var r = cvT.getBoundingClientRect(), d = window.devicePixelRatio || 1, nW = Math.round(r.width) || 700, nH = Math.round(r.height) || 250; if (cvT.width !== Math.round(nW * d)) { cvT.width = nW * d; cvT.height = nH * d; } cxT.setTransform(d, 0, 0, d, 0, 0); W = nW; H = nH; ctx = cxT; }
  function loop() {
    tG++;
    if (view === "exo") { syncE(); tGlob++; ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); if (reveal && p < 1) p = Math.min(1, p + .03); var e = CH[ci].ex[ei]; try { if (e.draw) e.draw.call(e, p); else if (e.d) e.d(p); else CH[ci].ic(); } catch (er) {} }
    else if (view === "theo") { syncT(); ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); var c = CH[ci], AN = c.sub ? c.sub[ti].anim : c.anim; try { if (AN) AN(tG); else c.ic(); } catch (er) {} }
    requestAnimationFrame(loop);
  }
  var dragV = false, lXv = 0, lYv = 0;
  cvE.addEventListener("pointerdown", function (e) { var x = CH[ci] && CH[ci].ex[ei]; if (view !== "exo" || !x || !x.d3) return; dragV = true; lXv = e.clientX; lYv = e.clientY; cvE.style.cursor = "grabbing"; try { cvE.setPointerCapture(e.pointerId); } catch (er) {} });
  cvE.addEventListener("pointermove", function (e) { if (!dragV) return; az3 += (e.clientX - lXv) * 0.01; el3 = Math.max(0.15, Math.min(1.35, el3 + (e.clientY - lYv) * 0.01)); lXv = e.clientX; lYv = e.clientY; });
  window.addEventListener("pointerup", function () { if (!dragV) return; dragV = false; });

  /* adresse */
  var curHash = null, routing = false;
  function setHash(h) { var full = h ? "#" + h : ""; curHash = full; if (location.hash === full) return; var url = h ? "#" + h : location.pathname + location.search; try { if (routing) history.replaceState(null, "", url); else history.pushState(null, "", url); } catch (er) { if (h) location.hash = h; } }
  function route() {
    var h = location.hash; if (h === "#") h = ""; if (h === curHash) return;
    var qq = {}; h.replace(/^#/, "").split("&").forEach(function (kv) { var m = kv.split("="); if (m[0]) qq[m[0]] = decodeURIComponent(m[1] || ""); });
    var c = parseInt(qq.c, 10), e = parseInt(qq.e, 10), t = parseInt(qq.t, 10);
    routing = true;
    try {
      if (qq.q) { q.value = qq.q; doSearch(qq.q); }
      else if (isNaN(c) || c < 0 || c >= CH.length) goHome();
      else { ci = c; if (!isNaN(e) && e >= 0 && e < CH[c].ex.length) openEx(e); else if (qq.v === "theo") openTheo(isNaN(t) ? 0 : t); else if (qq.v === "list") openList(); else if (qq.v === "sims") openSims(); else openChap(c); }
    } finally { routing = false; }
    curHash = location.hash;
  }
  window.addEventListener("hashchange", route); window.addEventListener("popstate", route);
  buildHome(); route(); loop();
};
document.addEventListener("DOMContentLoaded", function () { window.SFA_COURSE(); });
