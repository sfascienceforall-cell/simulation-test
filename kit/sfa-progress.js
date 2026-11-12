/* SFA · progression de l'étudiant — novembre 2026.
   Tout est gardé dans ce navigateur (clé localStorage « sfa_progress_v1 », la même que kit/sfa-shell.js) : aucune donnée envoyée.
   Format : { v:1, visits:{chemin:{n,first,last}}, attempts:[{k,c,ch,ok,err,how,ts}] }
     k = identifiant stable de l'exercice, c = cours, ch = n° de chapitre, ok = 1/0, err = type d'erreur, how = "self" | "qcm" | "num".
   API : SFAPROG.record(a), SFAPROG.stats(cours), SFAPROG.status(k), SFAPROG.level(stat) ; puis l'adaptateur de la page
   d'exercices de physique (window.CH + #vExo) qui ajoute jauges, auto-évaluation, badges et bilan. */
(function () {
"use strict";
var LS = "sfa_progress_v1", DAY = 864e5;
function load() { try { var p = JSON.parse(localStorage.getItem(LS) || "null"); if (p && p.v === 1) { p.visits = p.visits || {}; p.attempts = p.attempts || []; return p; } } catch (e) {} return { v: 1, visits: {}, attempts: [] }; }
function save(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} }
function slug(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

var ERR = { unites: "Unités ou conversion", signe: "Signe ou sens", formule: "Mauvaise formule ou loi", calcul: "Erreur de calcul", trigo: "Trigo, angle, projection", concept: "Je ne savais pas comment commencer" };

function record(a) { var p = load(); a.ts = a.ts || Date.now(); p.attempts.push(a); if (p.attempts.length > 5000) p.attempts = p.attempts.slice(-5000); save(p); return a; }
/* dernier essai par exercice */
function latest(cours) { var m = {}; load().attempts.forEach(function (a) { if (!cours || a.c === cours) m[a.k] = a; }); return m; }
function status(k) { var r = null, first = null; load().attempts.forEach(function (a) { if (a.k === k) { r = a; if (a.ok && !first) first = a; } }); return r ? { last: r, firstOk: first } : null; }
/* niveau d'un ensemble d'exercices : Pas commencé, En cours, Acquis (≥ 80 % réussis), Maîtrisé (Acquis + une réussite confirmée ≥ 24 h après la première) */
function level(st) {
  if (!st.tried) return { id: 0, t: "Pas commencé" };
  var r = st.ok / st.n;
  if (r >= 0.8 && st.confirmed) return { id: 3, t: "Maîtrisé" };
  if (r >= 0.8) return { id: 2, t: "Acquis" };
  return { id: 1, t: "En cours" };
}
/* statistiques d'un ensemble : keys = liste des identifiants d'exercices */
function stats(keys, cours) {
  var all = load().attempts.filter(function (a) { return !cours || a.c === cours; }), set = {}, firstOk = {}, last = {}, confirmed = false;
  keys.forEach(function (k) { set[k] = 1; });
  all.forEach(function (a) { if (!set[a.k]) return; last[a.k] = a; if (a.ok) { if (!firstOk[a.k]) firstOk[a.k] = a.ts; else if (a.ts - firstOk[a.k] >= DAY) confirmed = true; } });
  var ok = 0, tried = 0; keys.forEach(function (k) { if (last[k]) { tried++; if (last[k].ok) ok++; } });
  return { n: keys.length, ok: ok, tried: tried, confirmed: confirmed };
}
/* bilan des 7 derniers jours + types d'erreurs */
function week(cours) {
  var since = Date.now() - 7 * DAY, a = load().attempts.filter(function (x) { return x.c === cours && x.ts >= since; });
  var ok = a.filter(function (x) { return x.ok; }).length, errs = {};
  load().attempts.forEach(function (x) { if (x.c === cours && !x.ok && x.err) errs[x.err] = (errs[x.err] || 0) + 1; });
  var days = {}; a.forEach(function (x) { days[new Date(x.ts).toDateString()] = 1; });
  return { n: a.length, ok: ok, rate: a.length ? ok / a.length : null, errs: errs, days: Object.keys(days).length };
}
function bar(r, cls) { return '<span class="pg-bar ' + (cls || "") + '"><i style="width:' + Math.round(100 * Math.max(0, Math.min(1, r))) + '%"></i></span>'; }

window.SFAPROG = { load: load, save: save, record: record, latest: latest, status: status, stats: stats, level: level, week: week, slug: slug, ERR: ERR, bar: bar };

/* ======================= adaptateur : page d'exercices de physique ======================= */
function physExos() {
  if (!window.CH || !document.getElementById("vExo") || typeof window.openEx !== "function") return;
  var CH = window.CH, COURS = "physique-ba1";
  var css = document.createElement("style");
  css.textContent =
    ".pg-bar{display:inline-block;vertical-align:middle;height:7px;border-radius:99px;background:#e3e7ed;overflow:hidden;width:100%}" +
    ".pg-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#b42318,#e0573f);transition:width .4s}" +
    ".pg-bar.ok i{background:linear-gradient(90deg,#1D9E75,#2fbf8f)}" +
    "div.pg-head.pg-head{padding:10px 14px 10px 18px!important}div.pg-self.pg-self{padding:12px 14px!important}div.pg-card.pg-card{padding:14px 16px!important}.pg-badge.pg-badge{padding:3px 8px!important}.pg-lv.pg-lv{padding:4px 9px!important}.pg-self button.pg-x,.pg-self .bts button{padding:8px 13px!important}.pg-self .errs .bts button{padding:6px 10px!important}#pgDash .box.box{padding:20px 22px!important}#pgDash .tile.tile{padding:10px 12px!important}#pgDash .x.x{padding:5px 10px!important}.pg-card button.pg-o{padding:6px 10px!important}.pg-badge.pg-badge{left:8px;right:auto}" +
    ".pg-qcm{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 2px}.pg-qcm span{font:800 12.5px Mulish,system-ui,sans-serif;color:#5f6b7a;margin-right:4px}" +
    ".pg-qcm button{all:unset;cursor:pointer;font:800 15px Mulish,system-ui,sans-serif;width:42px;height:38px;text-align:center;line-height:38px;border:1.5px solid #d3d9e2;border-radius:10px;background:#fff;color:#13233a;transition:transform .12s,background .15s}" +
    ".pg-qcm button:hover{background:#eef1f5;transform:translateY(-1px)}.pg-qcm button.good{background:#1D9E75;border-color:#1D9E75;color:#fff}.pg-qcm button.bad{background:#fdeceb;border-color:#e0a19f;color:#a32d2d}" +
    ".pg-qcm button[disabled]{cursor:default;transform:none}.pg-qcm .msg{font:800 13px Mulish,system-ui,sans-serif;margin-left:6px}" +
    ".pg-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;border:1px solid #e3e7ed;border-radius:12px;padding:10px 14px;margin:0 0 12px;background:#fff;position:relative;overflow:hidden}" +
    ".pg-head::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:#b42318}" +
    ".pg-head .t{flex:1 1 220px;min-width:0}.pg-head small{display:block;font:800 10.5px Mulish,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#b42318}" +
    ".pg-head b{display:block;font:800 14px/1.3 Mulish,system-ui,sans-serif;color:#0f1b2d;margin:1px 0 6px}" +
    ".pg-head .n{font:700 12px Mulish,system-ui,sans-serif;color:#5f6b7a;white-space:nowrap}" +
    ".pg-lv{font:800 11px Mulish,system-ui,sans-serif;padding:4px 9px;border-radius:99px;background:#eef1f5;color:#5f6b7a;white-space:nowrap}" +
    ".pg-lv.l1{background:#fdeceb;color:#b42318}.pg-lv.l2{background:#e3f5ee;color:#0F6E56}.pg-lv.l3{background:#0F6E56;color:#fff}" +
    ".pg-self{border:1px solid #e3e7ed;border-radius:12px;padding:12px 14px;margin:12px 0;background:linear-gradient(#fbfcfd,#fff)}" +
    ".pg-self h4{font:800 13px Mulish,system-ui,sans-serif;margin:0 0 8px;color:#0f1b2d}" +
    ".pg-self .bts{display:flex;flex-wrap:wrap;gap:8px}.pg-self button{all:unset;cursor:pointer;font:800 13px Mulish,system-ui,sans-serif;border:1px solid #d3d9e2;border-radius:9px;padding:8px 13px;background:#fff;color:#2c3a4e}" +
    ".pg-self button:hover{background:#eef1f5}.pg-self button.ok{border-color:#1D9E75;color:#0F6E56}.pg-self button.ko{border-color:#e0a19f;color:#a32d2d}" +
    ".pg-self button.on{background:#0F6E56;border-color:#0F6E56;color:#fff}.pg-self button.ko.on{background:#a32d2d;border-color:#a32d2d}" +
    ".pg-self .errs{margin-top:10px;display:none}.pg-self .errs.show{display:block}.pg-self .errs p{font:700 12px Mulish,system-ui,sans-serif;color:#5f6b7a;margin:0 0 6px}" +
    ".pg-self .errs button{font-size:12px;padding:6px 10px}.pg-self .done{font:700 12.5px Mulish,system-ui,sans-serif;color:#0F6E56;margin-top:8px}" +
    ".pg-badge{position:absolute;top:8px;right:8px;font:800 11px Mulish,system-ui,sans-serif;padding:3px 8px;border-radius:99px;background:#0F6E56;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.15)}" +
    ".pg-badge.ko{background:#a32d2d}.card{position:relative}" +
    ".sfa-list a[data-c] .pg-mini{display:block;width:100%;margin-top:4px}.sfa-list a[data-c] .pg-mini .pg-bar{height:4px}" +
    ".pg-card{background:#fff;border:1px solid #e3e7ed;border-radius:12px;padding:14px 16px}" +
    ".pg-card small{display:block;font:800 10px Mulish,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#b42318;margin-bottom:6px}" +
    ".pg-card .big{font:800 26px/1.1 Mulish,system-ui,sans-serif;color:#0f1b2d}.pg-card .sub{font:600 12.5px/1.45 Mulish,system-ui,sans-serif;color:#5f6b7a;margin:4px 0 10px}" +
    ".pg-card .kv{display:grid;grid-template-columns:1fr auto;gap:4px 10px;font:600 12.5px Mulish,system-ui,sans-serif;color:#2c3a4e;margin-top:10px}.pg-card .kv b{font-weight:800}" +
    ".pg-card a.go{display:block;margin-top:10px;font:800 12.5px Mulish,system-ui,sans-serif;color:#b42318;text-decoration:none}" +
    ".pg-card button{all:unset;cursor:pointer;margin-top:10px;font:800 12.5px Mulish,system-ui,sans-serif;color:#13233a;border:1px solid #d3d9e2;border-radius:8px;padding:6px 10px}" +
    "#pgDash{position:fixed;inset:0;background:rgba(15,27,45,.45);display:none;align-items:flex-start;justify-content:center;z-index:200;padding:40px 14px;overflow:auto}" +
    "#pgDash.show{display:flex}#pgDash .box{background:#fff;border-radius:14px;max-width:760px;width:100%;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,.25)}" +
    "#pgDash h2{font:800 20px Mulish,system-ui,sans-serif;margin:0 0 4px}#pgDash h3{font:800 13px Mulish,system-ui,sans-serif;margin:18px 0 8px;color:#2c3a4e}" +
    "#pgDash .row2{display:grid;grid-template-columns:minmax(0,1fr) 54px 110px;gap:6px 10px;align-items:center;font:600 12.5px Mulish,system-ui,sans-serif}" +
    "#pgDash .x{float:right;all:unset;cursor:pointer;font:800 13px Mulish,system-ui,sans-serif;border:1px solid #d3d9e2;border-radius:8px;padding:5px 10px}" +
    "#pgDash .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:12px}" +
    "#pgDash .tile{border:1px solid #e3e7ed;border-radius:10px;padding:10px 12px}#pgDash .tile small{display:block;font:800 10px Mulish,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a95a3}" +
    "#pgDash .tile b{font:800 22px Mulish,system-ui,sans-serif;color:#0f1b2d}#pgDash .ebar{height:9px;border-radius:99px;background:#a32d2d}" +
    "#pgDash .note{font:600 12px/1.5 Mulish,system-ui,sans-serif;color:#8a95a3;margin-top:16px}";
  document.head.appendChild(css);

  /* QCM écrits en texte (« A. … B. … ») : la bonne lettre est au début de la solution */
  function qcmOf(e) {
    if (!e || typeof e.st !== "string" || typeof e.sol !== "string" || !/<b>A\.<\/b>/.test(e.st) || !/<b>B\.<\/b>/.test(e.st)) return null;
    var m = /^\s*(?:<[^>]+>\s*)*([A-E])[.)]/.exec(e.sol); if (!m) return null;
    var L = (e.st.match(/<b>([A-E])\.<\/b>/g) || []).map(function (x) { return x.charAt(3); });
    return L.indexOf(m[1]) < 0 ? null : { letters: L, good: m[1] };
  }
  var qcmDone = null;   /* réponse donnée dans la vue courante */
  function qcmRow() {
    var stmt = document.getElementById("stmt"); if (!stmt) return;
    var r = document.getElementById("pgQcm"), e = window.CH[window.ci].ex[window.ei], q = qcmOf(e);
    if (!q) { if (r) r.remove(); return; }
    if (!r) { r = document.createElement("div"); r.id = "pgQcm"; r.className = "pg-qcm"; stmt.parentNode.insertBefore(r, stmt.nextSibling); }
    r.innerHTML = "<span>Ta réponse :</span>" + q.letters.map(function (l) {
      var c = qcmDone ? (l === q.good ? "good" : (l === qcmDone ? "bad" : "")) : "";
      return '<button type="button" data-l="' + l + '" class="' + c + '"' + (qcmDone ? " disabled" : "") + ">" + l + "</button>"; }).join("") +
      (qcmDone ? '<span class="msg" style="color:' + (qcmDone === q.good ? "#0F6E56" : "#a32d2d") + '">' + (qcmDone === q.good ? "Bonne réponse !" : "Pas cette fois : la bonne réponse est " + q.good + ".") + "</span>" : "");
  }
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest && ev.target.closest("#pgQcm button[data-l]"); if (!t || qcmDone) return;
    var e = window.CH[window.ci].ex[window.ei], q = qcmOf(e); if (!q) return;
    qcmDone = t.dataset.l;
    record({ k: key(window.ci, window.ei), c: COURS, ch: window.ci, how: "qcm", ok: qcmDone === q.good ? 1 : 0, rep: qcmDone });
    qcmRow(); if (!window.reveal) window.toggleSol(); else selfBox();
    head("vExo"); side();
  });
  function key(i, j) { return "phys/" + slug(CH[i].t) + "/" + j + "-" + slug(CH[i].ex[j].t); }
  function keys(i) { return CH[i].ex.map(function (e, j) { return key(i, j); }); }
  function allKeys() { var k = []; CH.forEach(function (c, i) { k = k.concat(keys(i)); }); return k; }
  function chStat(i) { return stats(keys(i), COURS); }
  function pct(s) { return s.n ? Math.round(100 * s.ok / s.n) : 0; }
  function pctTxt(s) { var v = s.n ? 100 * s.ok / s.n : 0; return (v > 0 && v < 1 ? "< 1" : Math.round(v)) + " %"; }

  /* jauge en tête des vues chapitre, liste et exercice */
  function head(viewId) {
    var v = document.getElementById(viewId); if (!v) return;
    var h = v.querySelector(".pg-head"); if (!h) { h = document.createElement("div"); h.className = "pg-head"; v.insertBefore(h, v.firstChild); }
    var i = window.ci, s = chStat(i), lv = level(s), all = stats(allKeys(), COURS);
    h.innerHTML = '<div class="t"><small>Chapitre ' + (i + 1) + " / " + CH.length + " · ta progression</small><b>" + esc(CH[i].t) + "</b>" + bar(s.ok / s.n, lv.id >= 2 ? "ok" : "") + "</div>" +
      '<span class="n">' + s.ok + " / " + s.n + " réussi" + (s.ok > 1 ? "s" : "") + " · " + s.tried + " tenté" + (s.tried > 1 ? "s" : "") + "</span>" +
      '<span class="pg-lv l' + lv.id + '">' + lv.t + "</span>" +
      '<span class="n" title="Tout le cours de physique">Cours : ' + pctTxt(all) + "</span>";
  }
  /* auto-évaluation sous la solution (exercices ouverts : l'étudiant dit s'il avait trouvé) */
  function selfBox() {
    var v = document.getElementById("vExo"), info = document.getElementById("info"); if (!v || !info) return;
    var b = document.getElementById("pgSelf");
    if (!b) { b = document.createElement("div"); b.id = "pgSelf"; b.className = "pg-self"; info.parentNode.insertBefore(b, info.nextSibling); }
    if (!window.reveal) { b.style.display = "none"; return; }
    b.style.display = "";
    var k = key(window.ci, window.ei), st = status(k), last = st && st.last;
    var isQ = !!qcmOf(window.CH[window.ci].ex[window.ei]);
    if (isQ && (!qcmDone || qcmDone && last && last.ok)) { b.style.display = qcmDone ? "" : "none";
      if (qcmDone) b.innerHTML = '<div class="done" style="margin:0">Réponse enregistrée dans ta progression.</div>'; return; }
    var errBtns = Object.keys(ERR).map(function (e) { return '<button type="button" data-e="' + e + '"' + (last && !last.ok && last.err === e ? ' class="on"' : "") + ">" + ERR[e] + "</button>"; }).join("");
    if (isQ) { b.innerHTML = "<h4>Où était l'erreur ? (pour ton bilan)</h4><div class=\"bts\">" + errBtns + "</div>"; return; }
    b.innerHTML = "<h4>Compare avec ta réponse : avais-tu trouvé ?</h4>" +
      '<div class="bts"><button type="button" class="ok' + (last && last.ok ? " on" : "") + '" data-r="1">✓ Oui, j\'avais trouvé</button>' +
      '<button type="button" class="ko' + (last && !last.ok ? " on" : "") + '" data-r="0">✗ Non, je me suis trompé</button></div>' +
      '<div class="errs' + (last && !last.ok ? " show" : "") + '"><p>Où était l\'erreur ? (pour ton bilan)</p><div class="bts">' + errBtns + "</div></div>" +
      (last ? '<div class="done">Enregistré le ' + new Date(last.ts).toLocaleDateString("fr-BE") + (last.ok ? " : réussi." : " : à revoir.") + "</div>" : "");
  }
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest && ev.target.closest("#pgSelf button"); if (!t) return;
    var k = key(window.ci, window.ei), base = { k: k, c: COURS, ch: window.ci, how: "self" };
    if (t.dataset.r === "1") record(Object.assign(base, { ok: 1 }));
    else if (t.dataset.r === "0") record(Object.assign(base, { ok: 0, err: null }));
    else if (t.dataset.e) { var p = load(), a = p.attempts; for (var x = a.length - 1; x >= 0; x--) if (a[x].k === k) { if (!a[x].ok) { a[x].err = t.dataset.e; save(p); } break; } }
    selfBox(); head("vExo"); side();
  });
  /* badges sur les cartes d'exercices et de chapitres */
  function badges() {
    var g = document.getElementById("exGrid");
    if (g && window.view === "list") Array.prototype.forEach.call(g.children, function (card, j) {
      var st = status(key(window.ci, j)); if (!st || card.querySelector(".pg-badge")) return;
      var s = document.createElement("span"); s.className = "pg-badge" + (st.last.ok ? "" : " ko"); s.textContent = st.last.ok ? "✓ Réussi" : "À revoir"; card.appendChild(s);
    });
    var hg = document.getElementById("homeGrid");
    if (hg) Array.prototype.forEach.call(hg.children, function (card, i) {
      var s = chStat(i), o = card.querySelector(".pg-badge"); if (!s.tried) { if (o) o.remove(); return; }
      if (!o) { o = document.createElement("span"); card.appendChild(o); }
      o.className = "pg-badge" + (pct(s) >= 80 ? "" : " ko"); o.textContent = pct(s) + " %";
    });
  }
  /* liste latérale : mini-jauge par chapitre + carte « Ma progression » */
  function side() {
    Array.prototype.forEach.call(document.querySelectorAll(".sfa-list a[data-c]"), function (a) {
      var i = +a.getAttribute("data-c"); if (isNaN(i) || !CH[i]) return;
      var s = chStat(i), m = a.querySelector(".pg-mini");
      if (!s.tried) { if (m) m.remove(); return; }
      if (!m) { m = document.createElement("span"); m.className = "pg-mini"; var em = a.querySelector("em"); (em && em.previousElementSibling || a).appendChild(m); }
      m.innerHTML = bar(s.ok / s.n, pct(s) >= 80 ? "ok" : "");
    });
    var aside = document.querySelector(".sfa-side"); if (!aside) return;
    var c = document.getElementById("pgCard");
    if (!c) { c = document.createElement("div"); c.id = "pgCard"; c.className = "pg-card"; var bl = aside.querySelector(".sfa-blocus-side"); aside.insertBefore(c, bl ? bl.nextSibling : aside.firstChild); }
    var all = stats(allKeys(), COURS), w = week(COURS), rec = recommend();
    c.innerHTML = "<small>Ma progression · physique</small><div class=\"big\">" + pctTxt(all) + '</div><div class="sub">' + all.ok + (all.ok > 1 ? " exercices réussis" : " exercice réussi") + " sur " + all.n + "</div>" + bar(all.ok / all.n, "ok") +
      '<div class="kv"><span>Cette semaine</span><b>' + w.n + " exercice" + (w.n > 1 ? "s" : "") + "</b><span>Taux de réussite (7 jours)</span><b>" + (w.rate == null ? "—" : Math.round(100 * w.rate) + " %") + "</b></div>" +
      (rec ? '<a class="go" href="#c=' + rec.i + '&v=list">À faire ensuite : ' + esc(CH[rec.i].t) + " →</a>" : "") +
      '<button type="button" id="pgOpen" class="pg-o">Voir mon bilan détaillé</button>';
  }
  /* chapitre recommandé : le plus faible parmi ceux commencés (< 80 %), sinon le premier pas commencé */
  function recommend() {
    var best = null;
    CH.forEach(function (c, i) { var s = chStat(i); if (s.tried && pct(s) < 80 && (!best || pct(s) < best.p)) best = { i: i, p: pct(s) }; });
    if (best) return best;
    for (var i = 0; i < CH.length; i++) if (!chStat(i).tried) return { i: i, p: 0 };
    return null;
  }
  /* bilan détaillé */
  function dash() {
    var d = document.getElementById("pgDash");
    if (!d) { d = document.createElement("div"); d.id = "pgDash"; d.addEventListener("click", function (e) { if (e.target === d || e.target.classList.contains("x")) d.classList.remove("show"); }); document.body.appendChild(d); }
    var all = stats(allKeys(), COURS), w = week(COURS), errs = w.errs, emax = Math.max.apply(null, [1].concat(Object.keys(errs).map(function (k) { return errs[k]; })));
    var rows = CH.map(function (c, i) { var s = chStat(i), lv = level(s);
      return '<span>' + (i + 1) + ". " + esc(c.t) + '</span><b style="text-align:right">' + pct(s) + ' %</b><span class="pg-lv l' + lv.id + '" style="text-align:center">' + lv.t + "</span>"; }).join("");
    var er = Object.keys(errs).sort(function (a, b) { return errs[b] - errs[a]; }).map(function (k) {
      return "<span>" + esc(ERR[k] || k) + '</span><b style="text-align:right">' + errs[k] + '</b><span><span class="ebar" style="display:block;width:' + Math.round(100 * errs[k] / emax) + '%"></span></span>'; }).join("");
    d.innerHTML = '<div class="box"><button type="button" class="x">✕ Fermer</button><h2>Mon bilan en physique</h2>' +
      '<div class="tiles"><div class="tile"><small>Cours</small><b>' + pctTxt(all) + "</b></div><div class=\"tile\"><small>Réussis</small><b>" + all.ok + " / " + all.n + "</b></div>" +
      '<div class="tile"><small>Cette semaine</small><b>' + w.n + '</b></div><div class="tile"><small>Réussite 7 jours</small><b>' + (w.rate == null ? "—" : Math.round(100 * w.rate) + " %") + "</b></div>" +
      '<div class="tile"><small>Jours actifs (7 j)</small><b>' + w.days + " / 7</b></div></div>" +
      "<h3>Par chapitre</h3><div class=\"row2\">" + rows + "</div>" +
      "<h3>Mes erreurs les plus fréquentes</h3>" + (er ? '<div class="row2">' + er + "</div>" : '<p class="note">Aucune erreur enregistrée pour l\'instant. Quand tu te trompes, indique où : ce graphique te montrera quoi retravailler.</p>') +
      '<p class="note">Ta progression est gardée dans ce navigateur seulement (rien n\'est envoyé). Elle sera perdue si tu effaces les données du site ou changes d\'appareil.</p></div>';
    d.classList.add("show");
  }
  document.addEventListener("click", function (e) { if (e.target && e.target.id === "pgOpen") dash(); });

  /* branchements sur les fonctions de la page (sans les modifier) */
  function wrap(name, after) { var f = window[name]; if (typeof f !== "function") return; window[name] = function () { var r = f.apply(this, arguments); try { after(); } catch (e) {} return r; }; }
  wrap("openEx", function () { qcmDone = null; qcmRow(); selfBox(); head("vExo"); });
  wrap("toggleSol", selfBox);
  wrap("openList", function () { head("vList"); setTimeout(badges, 0); });
  wrap("openChap", function () { head("vChap"); });
  wrap("openTheo", function () { head("vTheo"); });
  /* l'aiguillage interne appelle ces fonctions par leur nom global : on relance la vue courante pour appliquer l'habillage */
  var v = window.view;
  if (v === "exo") { qcmRow(); selfBox(); head("vExo"); } else if (v === "list") { head("vList"); badges(); } else if (v === "chap") head("vChap"); else if (v === "theo") head("vTheo");
  badges(); side();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", physExos); else physExos();
})();
