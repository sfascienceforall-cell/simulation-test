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
  var CH = window.CH, META = window.SFA && window.SFA.meta, ENGINE = !!(META && META.chapitres);
  /* identifiant du cours : physique (page autonome) ou dossier du cours du moteur (ex. universite-chimie, secondaire-maths-4e) */
  var COURS = ENGINE ? location.pathname.replace(/index\.html$/, "").replace(/\/$/, "").split("/").slice(-3).filter(function (x) { return x && x !== "simulation-test"; }).join("-") : "physique-ba1";
  var NOM = ENGINE ? (META.court || META.titre || "ce cours") : "physique";
  /* état de la page : variables globales (page de physique) ou adresse et DOM (moteur, état privé) */
  function hq() { var q = {}; location.hash.replace(/^#/, "").split("&").forEach(function (kv) { var m = kv.split("="); if (m[0]) q[m[0]] = m[1]; }); return q; }
  function gci() { if (typeof window.ci === "number") return window.ci; var c = parseInt(hq().c, 10); return isNaN(c) ? 0 : c; }
  function gei() { if (typeof window.ei === "number") return window.ei; var e = parseInt(hq().e, 10); return isNaN(e) ? 0 : e; }
  function grev() { if (typeof window.reveal === "boolean") return window.reveal; var b = document.getElementById("bSol"); return !!(b && b.classList.contains("on")); }
  function gview() { if (typeof window.view === "string") return window.view; var m = { vExo: "exo", vList: "list", vChap: "chap", vTheo: "theo", vHome: "home" }; for (var id in m) { var el = document.getElementById(id); if (el && el.style.display !== "none") return m[id]; } return ""; }
  var css = document.createElement("style");
  css.textContent =
    ".pg-bar{display:inline-block;vertical-align:middle;height:7px;border-radius:99px;background:#e3e7ed;overflow:hidden;width:100%}" +
    ".pg-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--acc,#b42318),var(--acc,#e0573f));transition:width .4s}" +
    ".pg-bar.ok i{background:linear-gradient(90deg,#1D9E75,#2fbf8f)}" +
    "div.pg-head.pg-head{padding:10px 14px 10px 18px!important}div.pg-self.pg-self{padding:12px 14px!important}div.pg-card.pg-card{padding:14px 16px!important}.pg-badge.pg-badge{padding:3px 8px!important}.pg-lv.pg-lv{padding:4px 9px!important}.pg-self button.pg-x,.pg-self .bts button{padding:8px 13px!important}.pg-self .errs .bts button{padding:6px 10px!important}#pgDash .box.box{padding:20px 22px!important}#pgDash .tile.tile{padding:10px 12px!important}#pgDash .x.x{padding:5px 10px!important}.pg-card button.pg-o{padding:6px 10px!important}.pg-badge.pg-badge{left:8px;right:auto}" +
    ".pg-qcm{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 2px}.pg-qcm span{font:800 12.5px Mulish,system-ui,sans-serif;color:#5f6b7a;margin-right:4px}" +
    ".pg-qcm button{all:unset;cursor:pointer;font:800 15px Mulish,system-ui,sans-serif;width:42px;height:38px;text-align:center;line-height:38px;border:1.5px solid #d3d9e2;border-radius:10px;background:#fff;color:#13233a;transition:transform .12s,background .15s}" +
    ".pg-qcm button:hover{background:#eef1f5;transform:translateY(-1px)}.pg-qcm button.good{background:#1D9E75;border-color:#1D9E75;color:#fff}.pg-qcm button.bad{background:#fdeceb;border-color:#e0a19f;color:#a32d2d}" +
    ".pg-qcm button[disabled]{cursor:default;transform:none}.pg-qcm .msg{font:800 13px Mulish,system-ui,sans-serif;margin-left:6px}" +
    ".pg-num{border:1px solid #e3e7ed;border-radius:12px;padding:12px 14px!important;margin:12px 0;background:#fff}" +
    ".pg-num h4{font:800 13px Mulish,system-ui,sans-serif;margin:0 0 8px;color:#0f1b2d}.pg-num .ln{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:6px 0}" +
    ".pg-num label{font:700 13px Mulish,system-ui,sans-serif;color:#2c3a4e;min-width:170px}.pg-num input{font:700 15px Mulish,system-ui,sans-serif;width:8.5em;padding:7px 9px!important;border:1.5px solid #d3d9e2;border-radius:9px;color:#0f1b2d;background:#fff}" +
    ".pg-num input.good{border-color:#1D9E75;background:#e9f7f1}.pg-num input.bad{border-color:#e0a19f;background:#fdeceb}.pg-num .u{font:800 13px Mulish,system-ui,sans-serif;color:#5f6b7a;min-width:3em}" +
    ".pg-num .mk{font:800 13px Mulish,system-ui,sans-serif}.pg-num .go{all:unset;cursor:pointer;font:800 13px Mulish,system-ui,sans-serif;background:#13233a;color:#fff;border-radius:9px;padding:8px 14px!important;margin-top:6px}" +
    ".pg-num .msg{font:700 13px Mulish,system-ui,sans-serif;margin-top:8px}.pg-num .hint{font:600 12px Mulish,system-ui,sans-serif;color:#8a95a3;margin-top:4px}" +
    ".pg-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;border:1px solid #e3e7ed;border-radius:12px;padding:10px 14px;margin:0 0 12px;background:#fff;position:relative;overflow:hidden}" +
    ".pg-head::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--acc,#b42318)}" +
    ".pg-head .t{flex:1 1 220px;min-width:0}.pg-head small{display:block;font:800 10.5px Mulish,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--acc,#b42318)}" +
    ".pg-head b{display:block;font:800 14px/1.3 Mulish,system-ui,sans-serif;color:#0f1b2d;margin:1px 0 6px}" +
    ".pg-head .n{font:700 12px Mulish,system-ui,sans-serif;color:#5f6b7a;white-space:nowrap}" +
    ".pg-lv{font:800 11px Mulish,system-ui,sans-serif;padding:4px 9px;border-radius:99px;background:#eef1f5;color:#5f6b7a;white-space:nowrap}" +
    ".pg-lv.l1{background:#fdeceb;color:var(--acc,#b42318)}.pg-lv.l2{background:#e3f5ee;color:#0F6E56}.pg-lv.l3{background:#0F6E56;color:#fff}" +
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
    ".pg-card small{display:block;font:800 10px Mulish,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--acc,#b42318);margin-bottom:6px}" +
    ".pg-card .big{font:800 26px/1.1 Mulish,system-ui,sans-serif;color:#0f1b2d}.pg-card .sub{font:600 12.5px/1.45 Mulish,system-ui,sans-serif;color:#5f6b7a;margin:4px 0 10px}" +
    ".pg-card .kv{display:grid;grid-template-columns:1fr auto;gap:4px 10px;font:600 12.5px Mulish,system-ui,sans-serif;color:#2c3a4e;margin-top:10px}.pg-card .kv b{font-weight:800}" +
    ".pg-card a.go{display:block;margin-top:10px;font:800 12.5px Mulish,system-ui,sans-serif;color:var(--acc,#b42318);text-decoration:none}" +
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
    if (!e || (e._x && e._x.choix) || typeof e.st !== "string" || typeof e.sol !== "string" || !/<b>A\.<\/b>/.test(e.st) || !/<b>B\.<\/b>/.test(e.st)) return null;
    var m = /^\s*(?:<[^>]+>\s*)*([A-E])[.)]/.exec(e.sol); if (!m) return null;
    var L = (e.st.match(/<b>([A-E])\.<\/b>/g) || []).map(function (x) { return x.charAt(3); });
    return L.indexOf(m[1]) < 0 ? null : { letters: L, good: m[1] };
  }
  var qcmDone = null;   /* réponse donnée dans la vue courante */
  function qcmRow() {
    var stmt = document.getElementById("stmt"); if (!stmt) return;
    var r = document.getElementById("pgQcm"), e = CH[gci()].ex[gei()], q = qcmOf(e);
    if (!q) { if (r) r.remove(); return; }
    if (!r) { r = document.createElement("div"); r.id = "pgQcm"; r.className = "pg-qcm"; stmt.parentNode.insertBefore(r, stmt.nextSibling); }
    r.innerHTML = "<span>Ta réponse :</span>" + q.letters.map(function (l) {
      var c = qcmDone ? (l === q.good ? "good" : (l === qcmDone ? "bad" : "")) : "";
      return '<button type="button" data-l="' + l + '" class="' + c + '"' + (qcmDone ? " disabled" : "") + ">" + l + "</button>"; }).join("") +
      (qcmDone ? '<span class="msg" style="color:' + (qcmDone === q.good ? "#0F6E56" : "#a32d2d") + '">' + (qcmDone === q.good ? "Bonne réponse !" : "Pas cette fois : la bonne réponse est " + q.good + ".") + "</span>" : "");
  }
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest && ev.target.closest("#pgQcm button[data-l]"); if (!t || qcmDone) return;
    var e = CH[gci()].ex[gei()], q = qcmOf(e); if (!q) return;
    qcmDone = t.dataset.l;
    record({ k: key(gci(), gei()), c: COURS, ch: gci(), how: "qcm", ok: qcmDone === q.good ? 1 : 0, rep: qcmDone });
    qcmRow(); if (!grev()) window.toggleSol(); else selfBox();
    head("vExo"); side();
  });
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".qc"); if (!b || gview() !== "exo") return;
    var e = CH[gci()].ex[gei()], x = e && e._x; if (!x || !x.choix || b.parentNode.dataset.done) return;
    qcmDone = String(+b.dataset.j);
    record({ k: key(gci(), gei()), c: COURS, ch: gci(), how: "qcm", ok: +b.dataset.j === x.bonne ? 1 : 0, rep: qcmDone });
    setTimeout(function () { selfBox(); head("vExo"); side(); }, 0);
  }, true);
  /* ---------- réponse chiffrée : e.num, e._x.num (moteur) ou window.SFA_NUM[titre] ---------- */
  function numOf(e) { if (!e) return null; var n = e.num || (e._x && e._x.num) || (window.SFA_NUM && window.SFA_NUM[String(e.t).replace(/<[^>]+>/g, "")]); return n ? (Array.isArray(n) ? n : [n]) : null; }
  var SUPD = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };
  function readNum(t) {
    t = String(t || "").trim().replace(/\s+/g, "").replace(/−/g, "-").replace(/,/g, ".");
    t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, function (m) { return "^" + m.split("").map(function (c) { return SUPD[c]; }).join(""); });
    var m = /^([-+]?(?:\d+\.?\d*|\.\d+))?(?:(?:[·×x*]|\.)?10\^\(?([-+]?\d+)\)?|e([-+]?\d+))?$/i.exec(t);
    if (!m || (!m[1] && m[2] == null)) return NaN;
    var a = m[1] != null ? parseFloat(m[1]) : 1, e = m[2] != null ? +m[2] : (m[3] != null ? +m[3] : 0);
    return a * Math.pow(10, e);
  }
  function close(x, v, tol) { if (v === 0) return Math.abs(x) <= (tol || 0.02); return Math.abs(x - v) <= Math.abs(v) * (tol || 0.02); }
  var numTries = 0, numDone = false;
  function numBox() {
    var stmt = document.getElementById("stmt"); if (!stmt) return;
    var box = document.getElementById("pgNum"), N = numOf(CH[gci()].ex[gei()]);
    if (!N) { if (box) box.remove(); return; }
    if (!box) { box = document.createElement("div"); box.id = "pgNum"; box.className = "pg-num"; var after = document.getElementById("pgQcm") || stmt; after.parentNode.insertBefore(box, after.nextSibling); }
    box.innerHTML = "<h4>" + (N.length > 1 ? "Tes réponses" : "Ta réponse") + " (calcule sur papier, puis écris le nombre)</h4>" + N.map(function (n, i) {
      return '<div class="ln"><label for="pgN' + i + '">' + esc(n.q || "Réponse") + '</label><input id="pgN' + i + '" inputmode="decimal" autocomplete="off" placeholder="ex. 12,5"><span class="u">' + esc(n.u || "") + '</span><span class="mk" id="pgM' + i + '"></span></div>'; }).join("") +
      '<button type="button" class="go" id="pgCheck">Vérifier</button><div class="hint">Virgule ou point, et puissances de dix acceptées : 1,2e-3 ou 1,2·10^-3. Marge de 2 %.</div><div class="msg" id="pgNumMsg" role="status"></div>';
  }
  function checkNum() {
    if (numDone) return;
    var e = CH[gci()].ex[gei()], N = numOf(e); if (!N) return;
    var all = true, err = null, empty = false;
    N.forEach(function (n, i) {
      var inp = document.getElementById("pgN" + i), x = readNum(inp.value), mk = document.getElementById("pgM" + i);
      if (isNaN(x)) { empty = true; inp.className = ""; mk.textContent = ""; return; }
      var ok = close(x, n.v, n.tol); inp.className = ok ? "good" : "bad"; mk.textContent = ok ? "✓" : "✗"; mk.style.color = ok ? "#0F6E56" : "#a32d2d";
      if (!ok) { all = false; if (!err && n.p) Object.keys(n.p).forEach(function (pv) { if (!err && close(x, parseFloat(pv), 0.02)) err = n.p[pv]; }); }
    });
    var msg = document.getElementById("pgNumMsg");
    if (empty) { msg.style.color = "#a32d2d"; msg.textContent = "Écris un nombre dans chaque case (par exemple 22,7)."; return; }
    numTries++;
    record({ k: key(gci(), gei()), c: COURS, ch: gci(), how: "num", ok: all ? 1 : 0, err: err, essai: numTries });
    if (all) { numDone = true; msg.style.color = "#0F6E56"; msg.textContent = numTries === 1 ? "Tout est juste du premier coup !" : "Tout est juste."; if (!grev()) window.toggleSol(); }
    else if (numTries >= 2) { numDone = true; msg.style.color = "#a32d2d"; msg.innerHTML = "Pas encore juste après deux essais : regarde la solution pas à pas." + (err ? " Erreur probable : <b>" + esc(ERR[err] || err) + "</b>." : "");
      if (!grev()) window.toggleSol(); }
    else { msg.style.color = "#a32d2d"; msg.innerHTML = "Pas encore : corrige les cases en rouge et vérifie à nouveau." + (err ? " Indice : on dirait une erreur de type <b>" + esc((ERR[err] || err).toLowerCase()) + "</b>." : "") + " Il te reste un essai avant la solution."; }
    if (numDone) { Array.prototype.forEach.call(document.querySelectorAll("#pgNum input"), function (i) { i.disabled = true; }); var b = document.getElementById("pgCheck"); if (b) b.style.display = "none";
      N.forEach(function (n, i) { var mk = document.getElementById("pgM" + i); if (mk && mk.textContent === "✗") mk.textContent = "✗ attendu : " + String(n.v).replace(".", ",") + " " + (n.u || ""); }); }
    selfBox(); head("vExo"); side();
  }
  document.addEventListener("click", function (ev) { if (ev.target && ev.target.id === "pgCheck") checkNum(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Enter" && ev.target && /^pgN\d+$/.test(ev.target.id)) { ev.preventDefault(); checkNum(); } }, true);
  function isQcm(e) { return !!(e && ((e._x && e._x.choix) || qcmOf(e))); }
  function qcmOk() { var e = CH[gci()].ex[gei()]; if (e && e._x && e._x.choix) return qcmDone != null && +qcmDone === e._x.bonne; var q = qcmOf(e); return q && qcmDone === q.good; }
  function key(i, j) { return (ENGINE ? COURS : "phys") + "/" + slug(CH[i].t) + "/" + j + "-" + slug(CH[i].ex[j].t); }
  function keys(i) { return CH[i].ex.map(function (e, j) { return key(i, j); }); }
  function allKeys() { var k = []; CH.forEach(function (c, i) { k = k.concat(keys(i)); }); return k; }
  function chStat(i) { return stats(keys(i), COURS); }
  /* le cours est inscrit dans la progression pour le tableau de bord des pages d'accueil */
  (function () { var p = load(); p.courses = p.courses || {}; var acc = getComputedStyle(document.body).getPropertyValue("--acc").trim();
    p.courses[COURS] = { nom: ENGINE ? (META.titre || NOM) : "Physique BA1", n: allKeys().length, chN: CH.map(function (c) { return c.ex.length; }), href: location.pathname, acc: acc || "#b42318", seen: Date.now() }; save(p); })();
  function pct(s) { return s.n ? Math.round(100 * s.ok / s.n) : 0; }
  function pctTxt(s) { var v = s.n ? 100 * s.ok / s.n : 0; return (v > 0 && v < 1 ? "< 1" : Math.round(v)) + " %"; }

  /* jauge en tête des vues chapitre, liste et exercice */
  function head(viewId) {
    var v = document.getElementById(viewId); if (!v) return;
    var h = v.querySelector(".pg-head"); if (!h) { h = document.createElement("div"); h.className = "pg-head"; v.insertBefore(h, v.firstChild); }
    var i = gci(), s = chStat(i), lv = level(s), all = stats(allKeys(), COURS);
    h.innerHTML = '<div class="t"><small>Chapitre ' + (i + 1) + " / " + CH.length + " · ta progression</small><b>" + esc(CH[i].t) + "</b>" + bar(s.ok / s.n, lv.id >= 2 ? "ok" : "") + "</div>" +
      '<span class="n">' + s.ok + " / " + s.n + " réussi" + (s.ok > 1 ? "s" : "") + " · " + s.tried + " tenté" + (s.tried > 1 ? "s" : "") + "</span>" +
      '<span class="pg-lv l' + lv.id + '">' + lv.t + "</span>" +
      '<span class="n" title="Tout le cours">Cours : ' + pctTxt(all) + "</span>";
  }
  /* auto-évaluation sous la solution (exercices ouverts : l'étudiant dit s'il avait trouvé) */
  function selfBox() {
    var v = document.getElementById("vExo"), info = document.getElementById("info"); if (!v || !info) return;
    var b = document.getElementById("pgSelf");
    if (!b) { b = document.createElement("div"); b.id = "pgSelf"; b.className = "pg-self"; info.parentNode.insertBefore(b, info.nextSibling); }
    if (!grev() && !(numOf(CH[gci()].ex[gei()]) && numTries)) { b.style.display = "none"; return; }
    b.style.display = "";
    var k = key(gci(), gei()), st = status(k), last = st && st.last;
    var isN = !!numOf(CH[gci()].ex[gei()]);
    if (isN) { if (!numDone && !(last && !last.ok && numTries)) { b.style.display = "none"; return; }
      if (last && last.ok) { b.style.display = numTries ? "" : "none"; b.innerHTML = '<div class="done" style="margin:0">Réponse enregistrée dans ta progression.</div>'; return; }
      var eb = Object.keys(ERR).map(function (e) { return '<button type="button" data-e="' + e + '"' + (last && last.err === e ? ' class="on"' : "") + ">" + ERR[e] + "</button>"; }).join("");
      b.style.display = ""; b.innerHTML = "<h4>Où était l'erreur ? (pour ton bilan)</h4><div class=\"bts\">" + eb + "</div>"; return; }
    var isQ = isQcm(CH[gci()].ex[gei()]);
    if (isQ && (!qcmDone || qcmOk())) { b.style.display = qcmDone ? "" : "none";
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
    var k = key(gci(), gei()), base = { k: k, c: COURS, ch: gci(), how: "self" };
    if (t.dataset.r === "1") record(Object.assign(base, { ok: 1 }));
    else if (t.dataset.r === "0") record(Object.assign(base, { ok: 0, err: null }));
    else if (t.dataset.e) { var p = load(), a = p.attempts; for (var x = a.length - 1; x >= 0; x--) if (a[x].k === k) { if (!a[x].ok) { a[x].err = t.dataset.e; save(p); } break; } }
    selfBox(); head("vExo"); side();
  });
  /* badges sur les cartes d'exercices et de chapitres */
  function badges() {
    var g = document.getElementById("exGrid");
    if (g && gview() === "list") Array.prototype.forEach.call(g.children, function (card, j) {
      var st = status(key(gci(), j)); if (!st || card.querySelector(".pg-badge")) return;
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
    c.innerHTML = "<small>Ma progression · " + esc(NOM) + "</small><div class=\"big\">" + pctTxt(all) + '</div><div class="sub">' + all.ok + (all.ok > 1 ? " exercices réussis" : " exercice réussi") + " sur " + all.n + "</div>" + bar(all.ok / all.n, "ok") +
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
    d.innerHTML = '<div class="box"><button type="button" class="x">✕ Fermer</button><h2>Mon bilan · ' + esc(NOM) + '</h2>' +
      '<div class="tiles"><div class="tile"><small>Cours</small><b>' + pctTxt(all) + "</b></div><div class=\"tile\"><small>Réussis</small><b>" + all.ok + " / " + all.n + "</b></div>" +
      '<div class="tile"><small>Cette semaine</small><b>' + w.n + '</b></div><div class="tile"><small>Réussite 7 jours</small><b>' + (w.rate == null ? "—" : Math.round(100 * w.rate) + " %") + "</b></div>" +
      '<div class="tile"><small>Jours actifs (7 j)</small><b>' + w.days + " / 7</b></div></div>" +
      "<h3>Par chapitre</h3><div class=\"row2\">" + rows + "</div>" +
      "<h3>Mes erreurs les plus fréquentes</h3>" + (er ? '<div class="row2">' + er + "</div>" : '<p class="note">Aucune erreur enregistrée pour l\'instant. Quand tu te trompes, indique où : ce graphique te montrera quoi retravailler.</p>') +
      '<p class="note">Ta progression est gardée dans ce navigateur seulement (rien n\'est envoyé). Pour la retrouver sur un autre appareil, exporte-la ici puis importe le fichier là-bas.</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button type="button" class="x" id="pgExp" style="float:none">⬇ Exporter ma progression</button><button type="button" class="x" id="pgImp" style="float:none">⬆ Importer un fichier</button><input type="file" id="pgFile" accept="application/json,.json" hidden></div></div>';
    d.classList.add("show");
  }
  document.addEventListener("click", function (e) { if (e.target && e.target.id === "pgOpen") dash(); });
  /* export / import de la progression (fichier JSON) ; l'import fusionne sans doublon */
  document.addEventListener("click", function (e) {
    if (!e.target) return;
    if (e.target.id === "pgExp") { var blob = new Blob([JSON.stringify(load())], { type: "application/json" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); var dt = new Date(); a.download = "progression-sfa-" + dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0") + ".json"; document.body.appendChild(a); a.click(); a.remove(); }
    if (e.target.id === "pgImp") document.getElementById("pgFile").click();
  });
  document.addEventListener("change", function (e) {
    if (!e.target || e.target.id !== "pgFile" || !e.target.files[0]) return;
    var r = new FileReader(); r.onload = function () {
      try { var q = JSON.parse(r.result); if (!q || q.v !== 1 || !Array.isArray(q.attempts)) throw 0;
        var p = load(), seen = {}; p.attempts.forEach(function (a) { seen[a.k + "|" + a.ts] = 1; });
        q.attempts.forEach(function (a) { if (a && a.k && !seen[a.k + "|" + a.ts]) p.attempts.push(a); });
        p.attempts.sort(function (a, b) { return a.ts - b.ts; });
        Object.keys(q.visits || {}).forEach(function (k) { if (!p.visits[k]) p.visits[k] = q.visits[k]; });
        p.courses = Object.assign({}, q.courses || {}, p.courses || {}); save(p);
        side(); dash(); alert0("Progression importée : " + q.attempts.length + " essais lus.");
      } catch (er) { alert0("Ce fichier n'est pas une progression SFA."); }
    }; r.readAsText(e.target.files[0]);
  });
  function alert0(t) { var n = document.querySelectorAll("#pgDash .note"), d = n[n.length - 1]; if (d) { d.textContent = t; d.style.color = "#0F6E56"; } }

  /* branchements sur les fonctions de la page (sans les modifier) */
  function wrap(name, after) { var f = window[name]; if (typeof f !== "function") return; window[name] = function () { var r = f.apply(this, arguments); try { after(); } catch (e) {} return r; }; }
  wrap("openEx", function () { qcmDone = null; numTries = 0; numDone = false; qcmRow(); numBox(); selfBox(); head("vExo"); });
  wrap("toggleSol", selfBox);
  wrap("openList", function () { head("vList"); setTimeout(badges, 0); });
  wrap("openChap", function () { head("vChap"); });
  wrap("openTheo", function () { head("vTheo"); });
  /* l'aiguillage interne appelle ces fonctions par leur nom global : on relance la vue courante pour appliquer l'habillage */
  var v = gview();
  if (v === "exo") { qcmRow(); numBox(); selfBox(); head("vExo"); } else if (v === "list") { head("vList"); badges(); } else if (v === "chap") head("vChap"); else if (v === "theo") head("vTheo");
  badges(); side();
}
/* ======================= tableau de bord des pages d'accueil ======================= */
function hub() {
  var hero = document.querySelector("main.wrap > .hero"); if (!hero || window.CH) return;
  var p = load(), C = p.courses || {}, ids = Object.keys(C).filter(function (c) { return p.attempts.some(function (a) { return a.c === c; }); });
  if (!ids.length) return;
  var since = Date.now() - 7 * DAY, wk = p.attempts.filter(function (a) { return a.ts >= since; }), wok = wk.filter(function (a) { return a.ok; }).length;
  function last(c) { var t = 0; p.attempts.forEach(function (a) { if (a.c === c && a.ts > t) t = a.ts; }); return t; }
  ids.sort(function (a, b) { return last(b) - last(a); });
  var cards = ids.map(function (c) {
    var L = latest(c), ok = 0, tried = 0; Object.keys(L).forEach(function (k) { tried++; if (L[k].ok) ok++; });
    var n = C[c].n || tried, r = n ? ok / n : 0, pc = r > 0 && r < .01 ? "< 1" : Math.round(100 * r);
    return '<a class="hp-c" href="' + esc(C[c].href) + '" style="--a:' + esc(C[c].acc || "#13233a") + '"><small>' + esc(C[c].nom) + "</small><b>" + pc + ' %</b><span class="hp-b"><i style="width:' + Math.round(100 * r) + '%"></i></span><em>' + ok + " réussi" + (ok > 1 ? "s" : "") + " sur " + n + " · " + tried + " tenté" + (tried > 1 ? "s" : "") + "</em><u>Reprendre →</u></a>";
  }).join("");
  var note = wk.length ? Math.round(20 * wok / wk.length * 2) / 2 : null;
  var box = document.createElement("section"); box.id = "hubProg";
  box.innerHTML = "<style>#hubProg{margin:6px 0 26px}#hubProg h2{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}#hubProg h2 em{font-style:normal;font-size:13px;color:#5f6b7a;font-weight:700}" +
    ".hp-w{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 12px}.hp-w div{background:#fff;border:1px solid #e3e7ed;border-radius:12px;padding:10px 14px;min-width:130px}.hp-w small{display:block;font:800 10px Mulish,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a95a3}.hp-w b{font:800 22px Mulish,system-ui,sans-serif;color:#0f1b2d}" +
    ".hp-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}.hp-c{display:block;background:#fff;border:1px solid #e3e7ed;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0f1b2d;position:relative;overflow:hidden;transition:transform .15s,box-shadow .15s}" +
    ".hp-c::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--a)}.hp-c:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(15,27,45,.08)}" +
    ".hp-c small{display:block;font:800 11px Mulish,system-ui,sans-serif;color:var(--a);text-transform:uppercase;letter-spacing:.06em}.hp-c b{display:block;font:800 26px/1.2 Mulish,system-ui,sans-serif;margin:2px 0 6px}" +
    ".hp-b{display:block;height:7px;border-radius:99px;background:#e3e7ed;overflow:hidden}.hp-b i{display:block;height:100%;background:var(--a);border-radius:99px}" +
    ".hp-c em{display:block;font:600 12px Mulish,system-ui,sans-serif;font-style:normal;color:#5f6b7a;margin-top:6px}.hp-c u{display:block;text-decoration:none;font:800 12.5px Mulish,system-ui,sans-serif;color:var(--a);margin-top:8px}</style>" +
    "<h2>Ma progression<em>gardée dans ce navigateur</em></h2>" +
    '<div class="hp-w"><div><small>Cette semaine</small><b>' + wk.length + ' exercice' + (wk.length > 1 ? "s" : "") + '</b></div><div><small>Réussite (7 jours)</small><b>' + (wk.length ? Math.round(100 * wok / wk.length) + " %" : "—") + '</b></div><div><small>Note de la semaine</small><b>' + (note == null ? "—" : String(note).replace(".", ",") + " / 20") + "</b></div></div>" +
    '<div class="hp-g">' + cards + "</div>";
  hero.parentNode.insertBefore(box, hero.nextSibling);
}
function boot() { physExos(); hub(); }
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
