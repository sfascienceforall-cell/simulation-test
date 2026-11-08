/* Génère kit/search-index.js : cours, chapitres et simulations de ce site + pages du site de physique et chimie.
   Usage : node kit/build_search_index.js   (depuis la racine du dépôt) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = process.cwd(), out = [];
const strip = t => String(t || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
function walk(d, acc) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p, acc); else if (f === "course-meta.js") acc.push(d); } return acc; }
const deep = () => new Proxy(function () {}, { get: (t, k) => k === Symbol.toPrimitive ? () => "" : deep(), apply: () => deep() });
for (const dir of walk(ROOT, []).sort().filter(d => !/universite[\\/]chimie$/.test(d))) {
  const rel = path.relative(ROOT, dir).split(path.sep).join("/") + "/";
  const sims = [];
  const SFA = new Proxy({ meta: {}, page(o) { Object.assign(SFA.meta, o); }, sim(o) { sims.push(o); } }, { get: (t, k) => k in t ? t[k] : deep() });
  const ctx = vm.createContext({ SFA, window: {}, document: deep(), console, Math, setTimeout() {}, requestAnimationFrame() {} });
  ctx.window.SFA = SFA;
  const files = ["page.js", "course-meta.js"].concat(fs.readdirSync(dir).filter(f => /^sims-\d+\.js$/.test(f)).sort());
  for (const f of files) { try { vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { timeout: 2000 }); } catch (e) { /* fichier ignoré */ } }
  /* complément par lecture du texte (un fichier qui plante à mi-chemin ne perd pas ses simulations) */
  const seen = new Set(sims.map(x => x.id));
  for (const f of files.slice(2)) {
    const t = fs.readFileSync(path.join(dir, f), "utf8"), re = /SFA\.sim\(\{/g; let mm;
    while ((mm = re.exec(t))) {
      const b = t.slice(mm.index, mm.index + 3000), g = k => { const r = new RegExp("\\b" + k + "\\s*:\\s*(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')").exec(b); try { return r ? eval(r[1]) : null; } catch (e) { return null; } };
      const id = g("id"); if (!id || seen.has(id)) continue; seen.add(id); sims.push({ id, ch: g("ch"), titre: g("titre") || id });
    }
  }
  const M = SFA.meta, m = M.matiere || "", court = strip(M.court || M.titre);
  out.push({ k: "cours", t: strip(M.titre), s: strip(M.kicker), u: rel, m });
  const chs = M.chapitres || [], idx = {};
  chs.forEach((c, i) => { idx[c.id] = i; out.push({ k: "chapitre", t: strip(c.titre), s: court + " · ch. " + (i + 1), u: rel + "#c=" + i, m }); });
  sims.forEach(s => { if (!s.id || idx[s.ch] == null) return; out.push({ k: "simulation", t: strip(s.titre), s: court + " · ch. " + (idx[s.ch] + 1) + " · " + strip(chs[idx[s.ch]].titre), u: rel + s.id + "/", m }); });
  console.error(rel, chs.length, "chapitres", sims.length, "sims");
}
try { JSON.parse(fs.readFileSync(path.join(__dirname, "extra-index.json"), "utf8")).forEach(e => out.push(e)); } catch (e) {}
fs.writeFileSync(path.join(__dirname, "search-index.js"), "/* généré par kit/build_search_index.js */\nwindow.SFA_INDEX=" + JSON.stringify(out) + ";\n");
console.error("total", out.length);
