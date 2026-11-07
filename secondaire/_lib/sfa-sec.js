/* SFA · moteur commun des pages de simulations et d'exercices (secondaire et université), novembre 2026.
   Une page = SFA.page({...}) + des SFA.sim({...}) + des SFA.exos(chapitre, [...]).  Voir _lib/GUIDE.md. */
(function(){
"use strict";
var S = window.SFA = {meta:null, sims:[], exos:{}, open:null};

S.page = function(m){ S.meta = m; preload01(); };
S.sim  = function(d){
  /* même id déjà déclaré (fichier chargé deux fois) : on remplace sur place, sans doublon */
  for (var i = 0; i < S.sims.length; i++) if (d && S.sims[i].id === d.id){ S.sims[i] = d; return; }
  S.sims.push(d);
};
/* Page dédiée à une simulation : les aides communes d'un cours (B4, C4…) vivent dans sims-01.js ;
   on l'insère avant les fichiers des autres chapitres pour qu'ils les trouvent.
   Appelé depuis S.page (page.js) : le script écrit s'exécute juste après page.js, donc après ses aides (C5…). */
var preloaded = false;
function preload01(){
  if (preloaded || !window.SFA_SIMPAGE || document.readyState !== "loading" || window.SFA_NO_PRELOAD) return;
  preloaded = true;
  try { document.write('<script src="../sims-01.js"><\/script>'); } catch (e){}
}
S.exos = function(ch, list){ (S.exos[ch] = S.exos[ch] || []).push.apply(S.exos[ch], list); };

function el(tag, attrs, html){
  var e = document.createElement(tag);
  if (attrs) for (var k in attrs){ if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
  if (html != null) e.innerHTML = html;
  return e;
}
S.el = el;

/* ---------- format des nombres (virgule décimale belge) ---------- */
S.fmt = function(x, d){
  if (x === null || x === undefined || isNaN(x)) return "—";
  if (!isFinite(x)) return x > 0 ? "+∞" : "−∞";
  if (d === undefined) d = 2;
  var s = Number(x).toFixed(d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);   /* évite « −0 » pour un tout petit négatif */
  return s.replace("-", "−").replace(".", ",");
};
S.sci = function(x, d){
  if (!isFinite(x) || x === 0) return S.fmt(x, d);
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (e >= -2 && e <= 3) return S.fmt(x, d === undefined ? 3 : d);
  return S.fmt(m, d === undefined ? 2 : d) + "·10<sup>" + String(e).replace("-", "−") + "</sup>";
};
S.stars = function(n){ var s = ""; for (var i = 1; i <= 5; i++) s += i <= n ? "★" : "<i>★</i>"; return '<span class="stars" title="Difficulté ' + n + '/5">' + s + "</span>"; };

/* ---------- kit donné à chaque simulation ---------- */
function Kit(stage, ctrl, panel){
  this.stage = stage; this.ctrl = ctrl; this.panel = panel; this._raf = null; this._alive = true; this._cv = [];
}
Kit.prototype.canvas = function(h, opts){
  /* renvoie {cv, ctx, W, H, clear()} en coordonnées CSS ; redimensionné automatiquement */
  var cv = el("canvas"); this.stage.appendChild(cv);
  var o = {cv:cv, ctx:cv.getContext("2d"), W:0, H:h || 360, ratio:(opts && opts.ratio) || 0};
  var self = this;
  o.resize = function(){
    var w = Math.max(260, cv.parentNode ? cv.parentNode.clientWidth : 600);
    var hh = o.ratio ? Math.round(w * o.ratio) : (h || 360);
    var dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(w * dpr); cv.height = Math.round(hh * dpr);
    cv.style.height = hh + "px";
    o.W = w; o.H = hh; o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (self._draw) self._draw();
  };
  o.clear = function(){ o.ctx.clearRect(0, 0, o.W, o.H); };
  o.resize(); this._cv.push(o);
  /* position du pointeur en coordonnées CSS */
  o.pointer = function(fn){
    var down = false;
    function pos(ev){ var r = cv.getBoundingClientRect(); var t = ev.touches ? ev.touches[0] : ev; return {x:t.clientX - r.left, y:t.clientY - r.top}; }
    cv.addEventListener("pointerdown", function(ev){ down = true; cv.setPointerCapture(ev.pointerId); fn("down", pos(ev)); });
    cv.addEventListener("pointermove", function(ev){ fn(down ? "drag" : "move", pos(ev)); });
    cv.addEventListener("pointerup", function(ev){ down = false; fn("up", pos(ev)); });
  };
  return o;
};
/* fonction de dessin appelée après chaque changement de contrôle et au redimensionnement */
Kit.prototype.draw = function(fn){ this._draw = fn; fn(); };
Kit.prototype.redraw = function(){ if (this._draw) this._draw(); fillAll(this.panel || document); };
Kit.prototype._ctl = function(){ var d = el("div", {"class":"ctl"}); this.ctrl.appendChild(d); return d; };
/* remplissage coloré des curseurs (comme les pages de chimie) : --p = position en %, --pc = couleur */
function fillRange(r){
  var mn = parseFloat(r.min), mx = parseFloat(r.max), v = parseFloat(r.value);
  if (!isFinite(mn)) mn = 0; if (!isFinite(mx)) mx = 100;
  var p = mx > mn ? Math.max(0, Math.min(100, (v - mn) / (mx - mn) * 100)) : 0;
  r.style.setProperty("--p", p.toFixed(2) + "%");
  var ac = r.style.accentColor; if (ac && ac !== "auto") r.style.setProperty("--pc", ac);
}
function fillAll(root){ if (root && root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll("input[type=range]"), fillRange); }
S.fillRange = fillRange;
Kit.prototype.slider = function(label, min, max, step, val, unit, fn){
  var d = this._ctl(), self = this;
  var lab = el("label"); lab.innerHTML = "<span>" + label + "</span>";
  var out = el("output"); lab.appendChild(out);
  var r = el("input", {type:"range", min:min, max:max, step:step, value:val});
  d.appendChild(lab); d.appendChild(r);
  var dec = (String(step).split(".")[1] || "").length;
  /* cur garde la valeur exacte : un <input type=range> arrondit au pas lors d'un r.value = v (animations en pas fins) */
  var cur = parseFloat(r.value);
  var o = {get value(){ return cur; }, set:function(v){ v = Math.max(parseFloat(r.min), Math.min(parseFloat(r.max), parseFloat(v))); cur = v; r.value = v; show(); }, el:r};
  r.classList.add("sfa-r");
  function show(){ out.innerHTML = S.fmt(cur, dec) + (unit ? " <i>" + unit + "</i>" : ""); fillRange(r); }
  r.addEventListener("input", function(){ cur = parseFloat(r.value); show(); if (fn) fn(o.value); self.redraw(); });
  show(); return o;
};
Kit.prototype.select = function(label, options, val, fn){
  /* options : ["a","b"] ou [[valeur, texte], ...] */
  var d = this._ctl(), self = this;
  d.appendChild(el("label", null, "<span>" + label + "</span>"));
  var s = el("select");
  options.forEach(function(op){ var v = Array.isArray(op) ? op[0] : op, t = Array.isArray(op) ? op[1] : op; var o = el("option", {value:v}, t); s.appendChild(o); });
  if (val !== undefined) s.value = val;
  d.appendChild(s);
  var o = {get value(){ return s.value; }, set:function(v){ s.value = v; }, el:s};
  s.addEventListener("change", function(){ if (fn) fn(s.value); self.redraw(); });
  return o;
};
Kit.prototype.seg = function(label, options, val, fn){
  var d = this._ctl(), self = this;
  if (label) d.appendChild(el("label", null, "<span>" + label + "</span>"));
  var box = el("div", {"class":"seg"}); d.appendChild(box);
  var cur = val !== undefined ? val : (Array.isArray(options[0]) ? options[0][0] : options[0]);
  var btns = [];
  options.forEach(function(op){
    var v = Array.isArray(op) ? op[0] : op, t = Array.isArray(op) ? op[1] : op;
    var b = el("button", {type:"button"}, t); box.appendChild(b); btns.push([v, b]);
    b.addEventListener("click", function(){ cur = v; paint(); if (fn) fn(v); self.redraw(); });
  });
  function paint(){ btns.forEach(function(p){ p[1].classList.toggle("on", String(p[0]) === String(cur)); }); }
  paint();
  return {get value(){ return cur; }, set:function(v){ cur = v; paint(); }};
};
Kit.prototype.toggle = function(label, val, fn){
  var d = this._ctl(), self = this;
  d.classList.add("tg");
  var lab = el("label", {style:"justify-content:flex-start;gap:8px;cursor:pointer"});
  var c = el("input", {type:"checkbox", role:"switch"}); c.checked = !!val; lab.appendChild(c); lab.appendChild(el("span", null, label));
  d.appendChild(lab);
  c.addEventListener("change", function(){ if (fn) fn(c.checked); self.redraw(); });
  return {get value(){ return c.checked; }, set:function(v){ c.checked = !!v; }};
};
Kit.prototype.input = function(label, val, fn, type){
  var d = this._ctl(), self = this;
  d.appendChild(el("label", null, "<span>" + label + "</span>"));
  var i = el("input", {type:type || "text", value:val}); d.appendChild(i);
  i.addEventListener("input", function(){ if (fn) fn(i.value); self.redraw(); });
  return {get value(){ return i.value; }, set:function(v){ i.value = v; }, el:i};
};
Kit.prototype.button = function(text, fn, primary){
  var last = this.ctrl.lastElementChild, box;
  if (last && last.classList.contains("btns")) box = last; else { box = el("div", {"class":"btns"}); this.ctrl.appendChild(box); }
  var b = el("button", {type:"button", "class":"btn" + (primary ? " pri" : "")}, text); box.appendChild(b);
  var self = this; b.addEventListener("click", function(){ fn(); self.redraw(); });
  return b;
};
Kit.prototype.readouts = function(labels){
  /* labels : ["pH", "Volume"] → objet {set(i, html)} */
  var box = el("div", {"class":"read"}); this.ctrl.appendChild(box);
  if (labels.length === 1) box.classList.add("one");
  var cells = labels.map(function(l){ var r = el("div", {"class":"ro"}, "<small>" + l + "</small><b>—</b>"); box.appendChild(r); return r.querySelector("b"); });
  /* chiffres : police d'instrument (monospace) ; texte sans chiffre : police du site, plus lisible */
  return {set:function(i, html){ var c = cells[i]; if (!c) return;
    html = html == null ? "" : String(html);
    var same = c._h === html, first = c._h === undefined; c._h = html;
    /* « 787 kJ/mol » : l'unité en plus discret (texte simple seulement) */
    var mu = html.indexOf("<") < 0 ? /^([^A-Za-zÀ-ÿ]*[0-9∞])\s+([A-Za-zµμΩÅ°%][A-Za-zµμΩÅ°%\/·⋅²³⁻¹⁰-⁹0-9\-]{0,9})$/.exec(html.trim()) : null;
    c.innerHTML = mu ? mu[1] + ' <span class="u">' + mu[2] + "</span>" : html;
    var t = html.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").trim();
    /* « valeur + unité courte » = nombre ; une phrase (« 1er quadrant », « retombe au sol ») = texte */
    var words = t.replace(/[^A-Za-zÀ-ÿ\s]/g, " ").split(/\s+/).filter(function(w){ return w.length >= 3; });
    var unitish = /^[\s−\-+±≈~<>≤≥=0-9,.·×^⁰-⁹()∞%°\/a-zA-Zµμ²³⁻¹\[\]]*$/.test(t) && words.join("").length <= 7;
    c.classList.toggle("txt", !/[0-9∞]/.test(t) || (!unitish && words.length >= 1));
    c.classList.toggle("long", t.length > 16);
    if (!first && !same){ var ro = c.parentNode; ro.classList.add("hot"); clearTimeout(ro._t); ro._t = setTimeout(function(){ ro.classList.remove("hot"); }, 450); }
  }, el:box};
};
Kit.prototype.note = function(html, kind, where){
  var n = el("div", {"class":"note" + (kind ? " " + kind : "")}, html);
  (where === "stage" ? this.stage : this.ctrl).appendChild(n);
  return {set:function(h, k){ n.innerHTML = h; n.className = "note" + (k ? " " + k : ""); }, el:n};
};
/* boucle d'animation : fn(dt en s, t en s) ; s'arrête quand le panneau est fermé. Renvoie {play(), pause(), running} */
Kit.prototype.loop = function(fn){
  var self = this, last = null, t = 0, st = {running:false};
  function frame(ts){
    if (!self._alive || !st.running) { last = null; return; }
    if (last === null) last = ts;
    var dt = Math.min(0.05, (ts - last) / 1000); last = ts; t += dt;
    fn(dt, t); self._raf = requestAnimationFrame(frame);
  }
  st.play = function(){ if (!st.running){ st.running = true; self._raf = requestAnimationFrame(frame); } };
  st.pause = function(){ st.running = false; };
  st.reset = function(){ t = 0; };
  return st;
};

/* ---------- aides de dessin (refonte visuelle novembre 2026 : mêmes signatures, rendu plus fin) ---------- */
var GRID = "#eef1f5", AXIS = "#a3adba", TICK = "#7b8694", LAB = "#2c3a4e";
var FONT = "Mulish, system-ui, -apple-system, 'Segoe UI', sans-serif";
function rrect(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r || 0, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}
/* couleur sous un point du canevas (pour le liseré des étiquettes) ; blanc si transparent */
function bgAt(ctx, x, y){
  try {
    var m = ctx.getTransform ? ctx.getTransform() : {a:1, d:1, e:0, f:0};
    var px = Math.round(x * m.a + m.e), py = Math.round(y * m.d + m.f);
    if (px < 0 || py < 0 || px >= ctx.canvas.width || py >= ctx.canvas.height) return "#ffffff";
    var d = ctx.getImageData(px, py, 1, 1).data;
    if (d[3] < 40) return "#ffffff";
    var a = d[3] / 255;   /* composé sur le blanc du canevas */
    return "rgb(" + Math.round(d[0] * a + 255 * (1 - a)) + "," + Math.round(d[1] * a + 255 * (1 - a)) + "," + Math.round(d[2] * a + 255 * (1 - a)) + ")";
  } catch (e){ return "#ffffff"; }
}
function lum(col){ var m = /rgb\((\d+),(\d+),(\d+)/.exec(col) || [0, 255, 255, 255]; return (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) / 255; }
/* texte avec liseré de la couleur du fond : reste lisible par-dessus une grille ou une courbe */
function haloText(ctx, s, x, y, halo){
  ctx.save(); ctx.lineJoin = "round"; ctx.lineWidth = 3.5; ctx.strokeStyle = halo; ctx.strokeText(s, x, y); ctx.restore();
  ctx.fillText(s, x, y);
}
/* couleur + transparence (hex #rgb/#rrggbb ; sinon renvoie la couleur telle quelle) */
function tint(col, a){
  var h = String(col || "").trim();
  if (/^#([0-9a-f]{3})$/i.test(h)) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h);
  if (!m) return col;
  return "rgba(" + parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) + "," + a + ")";
}
S.draw = {
  /* repère : {x0,x1,y0,y1, l,r,t,b, stepX, stepY, xl, yl, grid, equal, hideZero, arrows} → fonctions X(x), Y(y) */
  axes: function(c, opt, opt2){
    if (opt && opt.ctx){ c = opt; opt = opt2; }   /* compat : axes(c, c, opt) */
    opt = opt || {};
    var L = opt.l || 46, R = opt.r || 16, T = opt.t || 16, B = opt.b || 34;
    var W = c.W, H = c.H, ctx = c.ctx;
    if (opt.equal){   /* même échelle en x et en y : on centre la zone de tracé */
      var wpx = W - L - R, hpx = H - T - B, u0 = Math.min(wpx / (opt.x1 - opt.x0), hpx / (opt.y1 - opt.y0));
      var ddx = (wpx - u0 * (opt.x1 - opt.x0)) / 2, ddy = (hpx - u0 * (opt.y1 - opt.y0)) / 2;
      L += ddx; R += ddx; T += ddy; B += ddy;
    }
    var ax = {x0:opt.x0, x1:opt.x1, y0:opt.y0, y1:opt.y1};
    ax.X = function(x){ return L + (x - ax.x0) / (ax.x1 - ax.x0) * (W - L - R); };
    ax.Y = function(y){ return H - B - (y - ax.y0) / (ax.y1 - ax.y0) * (H - T - B); };
    ax.ix = function(px){ return ax.x0 + (px - L) / (W - L - R) * (ax.x1 - ax.x0); };
    ax.iy = function(py){ return ax.y0 + (H - B - py) / (H - T - B) * (ax.y1 - ax.y0); };
    ax.L = L; ax.R = W - R; ax.T = T; ax.B = H - B;
    /* pas « rond » ; moins de graduations sur un petit écran */
    function nice(span, px){ var target = Math.max(4, Math.min(8, px / 62)), raw = span / target, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
    var spanX = ax.x1 - ax.x0, spanY = ax.y1 - ax.y0;
    var sx = opt.stepX || nice(spanX, W - L - R), sy = opt.stepY || nice(spanY, H - T - B);
    if (opt.equal && !opt.stepX && !opt.stepY){ sx = sy = Math.max(sx, sy); }
    if (!(sx > 0) || !isFinite(sx) || spanX / sx > 400) sx = spanX / 8 || 1;
    if (!(sy > 0) || !isFinite(sy) || spanY / sy > 400) sy = spanY / 8 || 1;
    var cr = function(v){ return Math.round(v) + 0.5; };   /* traits nets d'un pixel */
    var xs = [], ys = [], gx, gy;
    for (gx = Math.ceil(ax.x0 / sx - 1e-9) * sx; gx <= ax.x1 + 1e-9 * Math.abs(sx); gx += sx) xs.push(Math.abs(gx) < sx * 1e-9 ? 0 : gx);
    for (gy = Math.ceil(ax.y0 / sy - 1e-9) * sy; gy <= ax.y1 + 1e-9 * Math.abs(sy); gy += sy) ys.push(Math.abs(gy) < sy * 1e-9 ? 0 : gy);
    ctx.save(); ctx.lineWidth = 1; ctx.lineCap = "butt"; ctx.setLineDash([]);
    if (opt.grid !== false){
      ctx.strokeStyle = GRID; ctx.beginPath();
      xs.forEach(function(v){ var p = cr(ax.X(v)); ctx.moveTo(p, T); ctx.lineTo(p, H - B); });
      ys.forEach(function(v){ var p = cr(ax.Y(v)); ctx.moveTo(L, p); ctx.lineTo(W - R, p); });
      ctx.stroke();
    }
    var yx = (ax.y0 <= 0 && ax.y1 >= 0) ? ax.Y(0) : H - B, xy = (ax.x0 <= 0 && ax.x1 >= 0) ? ax.X(0) : L;
    var yxc = cr(yx), xyc = cr(xy);
    /* axes + petites graduations */
    ctx.strokeStyle = AXIS; ctx.lineWidth = 1.25; ctx.beginPath();
    ctx.moveTo(L, yxc); ctx.lineTo(W - R, yxc); ctx.moveTo(xyc, T); ctx.lineTo(xyc, H - B);
    xs.forEach(function(v){ var p = cr(ax.X(v)); ctx.moveTo(p, yxc - 2.5); ctx.lineTo(p, yxc + 2.5); });
    ys.forEach(function(v){ var p = cr(ax.Y(v)); ctx.moveTo(xyc - 2.5, p); ctx.lineTo(xyc + 2.5, p); });
    ctx.stroke();
    if (opt.arrows){   /* flèches au bout des axes (facultatif) */
      ctx.fillStyle = AXIS; ctx.beginPath();
      ctx.moveTo(W - R + 6, yxc); ctx.lineTo(W - R - 2, yxc - 4); ctx.lineTo(W - R - 2, yxc + 4); ctx.closePath();
      ctx.moveTo(xyc, T - 6); ctx.lineTo(xyc - 4, T + 2); ctx.lineTo(xyc + 4, T + 2); ctx.closePath(); ctx.fill();
    }
    /* étiquettes des graduations : on en saute si elles se chevauchent */
    ctx.font = "600 10.5px " + FONT; ctx.fillStyle = TICK;
    var lx = xs.filter(function(v){ return !(v === 0 && opt.hideZero); }).map(function(v){ return [v, S.fmt(v, 3).replace(/<[^>]+>/g, "")]; });
    var wmax = 0; lx.forEach(function(p){ wmax = Math.max(wmax, ctx.measureText(p[1]).width); });
    var pxs = xs.length > 1 ? Math.abs(ax.X(xs[1]) - ax.X(xs[0])) : 1e9, kx = Math.max(1, Math.ceil((wmax + 8) / pxs));
    var pys = ys.length > 1 ? Math.abs(ax.Y(ys[0]) - ax.Y(ys[1])) : 1e9, ky = Math.max(1, Math.ceil(16 / pys));
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    lx.forEach(function(p){ var i = Math.round((p[0] - xs[0]) / sx); if (i % kx) return;
      /* « 0 » à l'origine : décalé à gauche de l'axe vertical, comme dans un manuel */
      if (p[0] === 0 && Math.abs(ax.X(0) - xy) < 1 && xy > L + 8){ ctx.save(); ctx.textAlign = "right"; ctx.fillText(p[1], xy - 5, Math.min(H - B, yx) + 5); ctx.restore(); return; }
      ctx.fillText(p[1], ax.X(p[0]), Math.min(H - B, yx) + 5); });
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    ys.forEach(function(v, i){ if (v === 0 || i % ky) return; ctx.fillText(S.fmt(v, 3), Math.max(L, xy) - 6, ax.Y(v)); });
    /* noms des axes, avec un liseré de la couleur du fond */
    ctx.font = "700 11.5px " + FONT; ctx.fillStyle = LAB;
    if (opt.xl){
      ctx.textAlign = "right";
      /* axe en bas du cadre et marge suffisante : nom sous les graduations, à l'abri des tracés */
      if (Math.abs(yx - (H - B)) < 1 && B >= 30 && H - yx >= 30){ ctx.textBaseline = "top"; ctx.fillText(opt.xl, W - R, yx + 18); }
      else { ctx.textBaseline = "bottom"; haloText(ctx, opt.xl, W - R, yx - 5, bgAt(ctx, W - R - 4, yx - 10)); }
    }
    if (opt.yl){ ctx.textAlign = "left"; ctx.textBaseline = "top"; haloText(ctx, opt.yl, xy + 7, T, bgAt(ctx, xy + 12, T + 6)); }
    ctx.restore();
    return ax;
  },
  /* trace y = f(x) dans le repère ax ; gère les discontinuités (sauts > H) */
  fn: function(c, ax, f, color, width, dash){
    var ctx = c.ctx, n = Math.max(240, Math.round((ax.R - ax.L) * 2)), started = false, prevY = null;
    ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 3, ax.R - ax.L, ax.B - ax.T + 6); ctx.clip();
    ctx.strokeStyle = color || "#1e3f8f"; ctx.lineWidth = width || 2.4; ctx.lineJoin = "round"; ctx.lineCap = dash ? "butt" : "round";
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    for (var i = 0; i <= n; i++){
      var x = ax.x0 + (ax.x1 - ax.x0) * i / n, y = f(x), py = ax.Y(y);
      if (!isFinite(y) || isNaN(y) || (prevY !== null && Math.abs(py - prevY) > c.H * 1.5)){ started = false; prevY = isFinite(y) ? py : null; continue; }
      if (py < -4 * c.H) py = -4 * c.H; else if (py > 5 * c.H) py = 5 * c.H;   /* évite les tracés géants hors cadre */
      if (!started){ ctx.moveTo(ax.X(x), py); started = true; } else ctx.lineTo(ax.X(x), py);
      prevY = py;
    }
    ctx.stroke(); ctx.restore();
  },
  /* point : les points « repères » (rayon ≥ 4,5) ont un halo et un liseré blanc */
  dot: function(c, x, y, r, color){
    var ctx = c.ctx; r = r || 5; color = color || "#13233a";
    if (!isFinite(x) || !isFinite(y)) return;
    ctx.save(); ctx.setLineDash([]);
    if (r >= 4.5 && r <= 14){ ctx.globalAlpha = 0.16; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill(); ctx.globalAlpha = 1; }
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill();
    if (r >= 4.5){ ctx.lineWidth = Math.min(2, r * 0.28); ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.stroke(); }
    ctx.restore();
  },
  line: function(c, x1, y1, x2, y2, color, w, dash){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = color || "#13233a"; ctx.lineWidth = w || 2; ctx.lineCap = dash ? "butt" : "round"; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); },
  /* flèche à pointe effilée ; la pointe se réduit pour les flèches courtes */
  arrow: function(c, x1, y1, x2, y2, color, w){
    var ctx = c.ctx, dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    if (!isFinite(len)) return;
    w = w || 2; color = color || "#13233a";
    var a = Math.atan2(dy, dx), h = Math.min(8 + w * 1.8, Math.max(len * 0.5, 4)), sp = 0.42;
    ctx.save(); ctx.setLineDash([]); ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (len > h * 0.8){ ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke(); }
    if (len < 0.5){ ctx.restore(); return; }
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.cos(a - sp), y2 - h * Math.sin(a - sp));
    ctx.lineTo(x2 - h * 0.72 * Math.cos(a), y2 - h * 0.72 * Math.sin(a));
    ctx.lineTo(x2 - h * Math.cos(a + sp), y2 - h * Math.sin(a + sp));
    ctx.closePath(); ctx.lineWidth = 1; ctx.fill(); ctx.stroke(); ctx.restore();
  },
  /* texte : {size, color, align, base, weight, math, bg, halo (true ou couleur), font} */
  text: function(c, s, x, y, opt){
    opt = opt || {}; var ctx = c.ctx; ctx.save(); s = String(s == null ? "" : s);
    var size = opt.size || 13;
    ctx.font = opt.font || ((opt.italic ? "italic " : "") + (opt.weight || 700) + " " + size + "px " + (opt.math ? "'STIX Two Text', 'Cambria Math', serif" : opt.mono ? "'JetBrains Mono', ui-monospace, monospace" : FONT));
    ctx.fillStyle = opt.color || "#0f1b2d"; ctx.textAlign = opt.align || "center"; ctx.textBaseline = opt.base || "middle";
    if (opt.bg){
      var w = ctx.measureText(s).width + 10, hh = size + 7;
      var bx = ctx.textAlign === "left" || ctx.textAlign === "start" ? x - 5 : ctx.textAlign === "right" || ctx.textAlign === "end" ? x - w + 5 : x - w / 2;
      var by = ctx.textBaseline === "top" ? y - 3 : ctx.textBaseline === "bottom" || ctx.textBaseline === "alphabetic" ? y - hh + 3 : y - hh / 2;
      ctx.fillStyle = opt.bg; rrect(ctx, bx, by, w, hh, Math.min(6, hh / 2)); ctx.fill();
      ctx.fillStyle = opt.color || "#0f1b2d";
    }
    if (opt.halo){ haloText(ctx, s, x, y, opt.halo === true ? bgAt(ctx, x, y) : opt.halo); }
    else ctx.fillText(s, x, y);
    ctx.restore();
  },
  /* ---- aides facultatives (nouvelles) ---- */
  /* étiquette en pastille teintée : label(c, "E₁ pH 8,73", x, y, {color, align, size, fill}) */
  label: function(c, s, x, y, opt){
    opt = opt || {}; var col = opt.color || S.draw.palette.ink;
    S.draw.text(c, s, x, y, {size:opt.size || 11.5, weight:opt.weight || 800, color:col, align:opt.align, base:opt.base, math:opt.math,
      bg:opt.fill || (tint(col, 0.12) === col ? "rgba(255,255,255,.92)" : tint(col, 0.12))});
  },
  /* halo lumineux (source, étoile, point chaud) */
  glow: function(c, x, y, r, color, a){
    var ctx = c.ctx; if (!isFinite(x) || !isFinite(y) || !(r > 0)) return;
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, tint(color || "#f4c542", a == null ? 0.55 : a)); g.addColorStop(1, tint(color || "#f4c542", 0));
    ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
  },
  /* cartouche arrondi (légende, encadré) : panel(c, x, y, w, h, {fill, stroke, radius, shadow, title}) */
  panel: function(c, x, y, w, h, opt){
    opt = opt || {}; var ctx = c.ctx; ctx.save();
    if (opt.shadow !== false){ ctx.shadowColor = "rgba(15,27,45,.10)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2; }
    rrect(ctx, x, y, w, h, opt.radius == null ? 9 : opt.radius); ctx.fillStyle = opt.fill || "rgba(255,255,255,.96)"; ctx.fill();
    ctx.shadowColor = "transparent"; ctx.lineWidth = 1; ctx.strokeStyle = opt.stroke || "#e3e7ed"; ctx.stroke();
    if (opt.title){ ctx.font = "800 10px " + FONT; ctx.fillStyle = opt.titleColor || "#5f6b7a"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(String(opt.title).toUpperCase(), x + 10, y + 8); }
    ctx.restore();
  },
  /* légende : legend(c, [[couleur, "texte", tirets?], …], x, y, {box:true}) → hauteur occupée */
  legend: function(c, items, x, y, opt){
    opt = opt || {}; var ctx = c.ctx, lh = 17, w = 0;
    ctx.save(); ctx.font = "600 11px " + FONT;
    items.forEach(function(it){ w = Math.max(w, ctx.measureText(it[1]).width); });
    var bw = w + 38, bh = items.length * lh + 10;
    if (opt.align === "right") x -= bw;
    if (opt.box !== false) S.draw.panel(c, x, y, bw, bh, {shadow:false});
    items.forEach(function(it, i){
      var yy = y + 5 + lh * i + lh / 2;
      ctx.strokeStyle = it[0]; ctx.lineWidth = 3; ctx.lineCap = it[2] ? "butt" : "round"; ctx.setLineDash(it[2] ? [5, 4] : []);
      ctx.beginPath(); ctx.moveTo(x + 9, yy); ctx.lineTo(x + 25, yy); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = "#2c3a4e"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(it[1], x + 31, yy);
    });
    ctx.restore(); return bh;
  },
  /* afficheur d'instrument (type pH-mètre) : display(c, "2,88", x, y, {w, h, caption, color}) ; x, y = centre */
  display: function(c, s, x, y, opt){
    opt = opt || {}; var ctx = c.ctx, w = opt.w || 104, h = opt.h || 50, x0 = x - w / 2, y0 = y - h / 2;
    ctx.save();
    rrect(ctx, x0, y0, w, h, 8); ctx.fillStyle = "#13233a"; ctx.fill();
    rrect(ctx, x0 + 5, y0 + 5, w - 10, h - (opt.caption ? 19 : 10), 5); ctx.fillStyle = opt.screen || "#e8f3ec"; ctx.fill();
    ctx.fillStyle = opt.color || "#13233a"; ctx.font = "600 " + (opt.size || Math.round(h * 0.42)) + "px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(s), x, y0 + 5 + (h - (opt.caption ? 19 : 10)) / 2 + 1);
    if (opt.caption){ ctx.font = "700 9px " + FONT; ctx.fillStyle = "#c9d3df"; ctx.fillText(opt.caption, x, y0 + h - 7); }
    ctx.restore();
  },
  /* aire sous la courbe entre a et b (ou entre f et g si g est une fonction) */
  area: function(c, ax, f, a, b, color, alpha, g){
    var ctx = c.ctx, n = Math.max(60, Math.round(Math.abs(ax.X(b) - ax.X(a)))), i, x;
    var base = typeof g === "function" ? g : function(){ return typeof g === "number" ? g : 0; };
    ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
    ctx.beginPath();
    for (i = 0; i <= n; i++){ x = a + (b - a) * i / n; var y = f(x); if (!isFinite(y)) y = 0; i ? ctx.lineTo(ax.X(x), ax.Y(y)) : ctx.moveTo(ax.X(x), ax.Y(y)); }
    for (i = n; i >= 0; i--){ x = a + (b - a) * i / n; var y2 = base(x); if (!isFinite(y2)) y2 = 0; ctx.lineTo(ax.X(x), ax.Y(y2)); }
    ctx.closePath(); color = color || "#1e3f8f"; alpha = alpha == null ? 0.16 : alpha;
    var tc = tint(color, alpha); if (tc === color){ ctx.fillStyle = color; ctx.globalAlpha = alpha; } else ctx.fillStyle = tc;
    ctx.fill(); ctx.restore();
  },
  rrect: function(c, x, y, w, h, r){ rrect(c.ctx, x, y, w, h, r); },
  tint: tint,
  /* palette : mêmes noms qu'avant (teintes légèrement harmonisées) ; « mat » = couleur de la matière de la page */
  palette: {acc:"#1f4b9e", red:"#c0321d", green:"#24775a", violet:"#6236c4", amber:"#c26a0c", teal:"#0e7f96", ink:"#0f1b2d", grey:"#8a95a3", light:"#e3e7ed", yellow:"#f4c542",
    blue:"#2f7fd1", pink:"#c43a7a", orange:"#e07a1f", mat:"#1e3f8f", grid:GRID, axis:AXIS, paper:"#ffffff"}
};
/* couleur de la matière, lue dans la feuille de style (--acc) */
function syncMat(){
  try { var v = getComputedStyle(document.body).getPropertyValue("--acc").trim(); if (v) S.draw.palette.mat = v; } catch (e){}
}
S.syncMat = syncMat;

/* ---------- rendu de la page ---------- */
function openSim(d, host){
  if (S.open){ S.open.close(); }
  var panel = el("div", {"class":"sim", id:"sim-" + d.id});
  panel.innerHTML = '<div class="sim-h"><div><h4>' + d.titre + "</h4><p>" + (d.but || "") + '</p></div><button class="x" type="button">Fermer ✕</button></div>';
  var body = el("div", {"class":"sim-body"}), stage = el("div", {"class":"stage"}), ctrl = el("div", {"class":"ctrl"});
  body.appendChild(stage); body.appendChild(ctrl); panel.appendChild(body);
  if (d.aRetenir){ panel.appendChild(el("div", {"class":"note ok", style:"margin-top:12px"}, "<b>À retenir.</b> " + d.aRetenir)); }
  if (d.piege){ panel.appendChild(el("div", {"class":"note warn", style:"margin-top:8px"}, "<b>Piège.</b> " + d.piege)); }
  host.parentNode.insertBefore(panel, host.nextSibling);
  syncMat();
  var kit = new Kit(stage, ctrl, panel);
  var onResize = function(){ kit._cv.forEach(function(o){ o.resize(); }); };
  window.addEventListener("resize", onResize);
  S.open = {id:d.id, close:function(){ kit._alive = false; if (kit._raf) cancelAnimationFrame(kit._raf); window.removeEventListener("resize", onResize); panel.remove(); S.open = null; try{history.replaceState(null, "", location.pathname + location.search);}catch(e){} }};
  panel.querySelector(".x").addEventListener("click", function(){ S.open && S.open.close(); });
  try { d.build(kit, S); } catch (e){ stage.appendChild(el("div", {"class":"note bad"}, "Erreur dans la simulation : " + e.message)); if (window.console) console.error(e); }
  fillAll(panel);
  panel.addEventListener("input", function(ev){ if (ev.target && ev.target.type === "range") fillRange(ev.target); });
  try{history.replaceState(null, "", "#" + d.id);}catch(e){}
  panel.scrollIntoView({behavior:"smooth", block:"start"});
}
S.openSim = function(id){ var d = S.sims.filter(function(s){ return s.id === id; })[0]; var c = document.querySelector('[data-sim="' + id + '"]'); if (d && c) openSim(d, c.closest(".grid")); };

function renderExo(x, i, ch){
  var box = el("div", {"class":"exo", "data-s":x.s || 1});
  var kind = x.choix ? "QCM" : "Exercice";
  box.innerHTML = '<div class="exo-h">' + S.stars(x.s || 1) + "<b>" + kind + " " + ch + "." + (i + 1) + (x.t ? " · " + x.t : "") + "</b></div>" + '<div class="st">' + x.enonce + "</div>";
  if (x.choix){
    var q = el("div", {"class":"qcm"}), fb = el("div", {"class":"fb"}); var done = false;
    x.choix.forEach(function(c, j){
      var b = el("button", {type:"button"}, "<b>" + "ABCDEF"[j] + ".</b> " + c); q.appendChild(b);
      b.addEventListener("click", function(){
        if (done) return; done = true;
        var ok = j === x.bonne;
        b.classList.add(ok ? "good" : "badc");
        if (!ok) q.children[x.bonne].classList.add("good");
        var why = x.pourquoi && x.pourquoi[j] ? x.pourquoi[j] : "";
        fb.innerHTML = (ok ? "✅ <b>Bonne réponse.</b> " : "❌ <b>Pas tout à fait.</b> " + (why ? why + " " : "")) + (x.corrige ? "<br>" + x.corrige : "");
      });
    });
    box.appendChild(q); box.appendChild(fb);
    var again = el("button", {type:"button", "class":"x", style:"margin-top:4px"}, "Recommencer");
    again.addEventListener("click", function(){ done = false; fb.innerHTML = ""; Array.prototype.forEach.call(q.children, function(b){ b.className = ""; }); });
    box.appendChild(again);
  } else {
    if (x.indice) box.appendChild(el("details", null, "<summary>Indice</summary><div>" + x.indice + "</div>"));
    box.appendChild(el("details", null, "<summary>Corrigé pas à pas</summary><div>" + (x.corrige || "") + (x.reponse ? '<p><b>Réponse : ' + x.reponse + "</b></p>" : "") + "</div>"));
  }
  return box;
}

S.render = function(){
  var m = S.meta; if (!m) return;
  document.body.classList.add("m-" + (m.matiere || "maths"));
  document.title = m.titre + " · SFA";
  var root = document.getElementById("app") || document.body;
  var base = m.base || "../../";
  var nav = (m.nav || [
    ["https://sciencesforall.be", "Site SFA"],
    [base + "../", "Simulations de physique"],
    [base + "../chimie/", "Chimie"],
    [base, "Secondaire", true],
    [base + "../universite/", "Université"],
    [base + "../prepa/", "Prépa concours médecine"]
  ]).map(function(n){ return '<a href="' + n[0] + '"' + (n[2] ? ' class="on"' : "") + ">" + n[1] + "</a>"; }).join("");
  var nS = S.sims.length, nE = 0, nQ = 0;
  Object.keys(S.exos).forEach(function(k){ if (typeof S.exos[k] === "object" && S.exos[k].forEach) S.exos[k].forEach(function(x){ if (x.choix) nQ++; else nE++; }); });
  var html = '<header class="top"><a class="logo" href="https://sciencesforall.be"><i>SFA</i>Science For All</a><nav>' + nav + "</nav></header>";
  html += '<main class="wrap"><div class="hero"><span class="kicker">' + (m.kicker || "") + "</span><h1>" + m.titre + "</h1><p>" + (m.intro || "") + "</p>";
  html += '<div class="counts"><span><b>' + m.chapitres.length + "</b> chapitres</span><span><b>" + nS + "</b> simulations</span><span><b>" + nE + "</b> exercices corrigés</span><span><b>" + nQ + "</b> QCM</span></div></div>";
  html += '<nav class="chips">' + m.chapitres.map(function(c){ var k = S.sims.filter(function(s){ return s.ch === c.id; }).length; return '<a href="#ch-' + c.id + '">' + c.num + ". " + c.titre + "<span>" + k + "</span></a>"; }).join("") + "</nav>";
  html += '<div class="filt">Filtrer les exercices : <span class="seg" id="fstar"></span></div><div id="chs"></div>';
  html += '<div class="foot">' + (m.pied || "Contenu SFA original. Chaque simulation et chaque exercice ont été relus par un professeur de la matière.") + "</div></main>";
  root.innerHTML = html;
  var chs = root.querySelector("#chs");
  m.chapitres.forEach(function(c){
    var sec = el("section", {"class":"ch", id:"ch-" + c.id});
    sec.innerHTML = '<div class="ch-h"><span class="n">' + c.num + "</span><h2>" + c.titre + "</h2></div>" + '<div class="ch-intro">' + (c.resume || "") + (c.attendus ? '<div class="attendus"><b>Au programme :</b> ' + c.attendus + "</div>" : "") + "</div>";
    var sims = S.sims.filter(function(s){ return s.ch === c.id; });
    if (sims.length){
      sec.appendChild(el("h3", {"class":"sub"}, "Simulations"));
      var g = el("div", {"class":"grid"});
      sims.forEach(function(d){
        var b = el("button", {"class":"card", type:"button", "data-sim":d.id}, (d.tag ? '<span class="tag">' + d.tag + "</span>" : "") + "<b>" + d.titre + "</b><small>" + (d.resume || d.but || "") + '</small><span class="go">Lancer la simulation →</span>');
        b.addEventListener("click", function(){ openSim(d, g); });
        g.appendChild(b);
      });
      sec.appendChild(g);
    }
    var ex = (S.exos[c.id] || []).slice().sort(function(a, b){ return (a.s || 1) - (b.s || 1); });
    if (ex.length){
      sec.appendChild(el("h3", {"class":"sub"}, "Exercices et QCM · du ★ au ★★★★★"));
      var list = el("div", {"class":"exos"});
      ex.forEach(function(x, i){ list.appendChild(renderExo(x, i, c.num)); });
      sec.appendChild(list);
    }
    chs.appendChild(sec);
  });
  /* filtre par étoiles */
  var fs = root.querySelector("#fstar"), cur = 0;
  [[0, "Tous"], [1, "★"], [2, "★★"], [3, "★★★"], [4, "★★★★"], [5, "★★★★★"]].forEach(function(p){
    var b = el("button", {type:"button"}, p[1]); if (p[0] === 0) b.className = "on"; fs.appendChild(b);
    b.addEventListener("click", function(){ cur = p[0]; Array.prototype.forEach.call(fs.children, function(x){ x.className = ""; }); b.className = "on";
      Array.prototype.forEach.call(document.querySelectorAll(".exo"), function(e){ e.style.display = (!cur || +e.getAttribute("data-s") === cur) ? "" : "none"; }); });
  });
  var h = location.hash.slice(1);
  if (h && !/^ch-/.test(h)) setTimeout(function(){ S.openSim(h); }, 50);
};
/* page dédiée à une seule simulation (kit/sim-page.js) */
S.mount = function(d, host){
  var body = el("div", {"class":"sim-body"}), stage = el("div", {"class":"stage"}), ctrl = el("div", {"class":"ctrl"});
  body.appendChild(stage); body.appendChild(ctrl); host.appendChild(body);
  syncMat();
  if (d.aRetenir || d.piege){
    var keys = el("div", {"class":"sp-keys" + (d.aRetenir && d.piege ? " two" : "")});
    if (d.aRetenir) keys.appendChild(el("div", {"class":"sp-key ok"}, "<h3>À retenir</h3><p>" + d.aRetenir + "</p>"));
    if (d.piege) keys.appendChild(el("div", {"class":"sp-key warn"}, "<h3>Piège classique</h3><p>" + d.piege + "</p>"));
    host.appendChild(keys);
  }
  var kit = new Kit(stage, ctrl, host);
  window.addEventListener("resize", function(){ kit._cv.forEach(function(o){ o.resize(); }); });
  try { d.build(kit, S); } catch (e){ stage.appendChild(el("div", {"class":"note bad"}, "Erreur dans la simulation : " + e.message)); if (window.console) console.error(e); }
  fillAll(host);
  /* curseurs créés par la simulation elle-même (hors k.slider) : remplissage suivi au fil des saisies */
  host.addEventListener("input", function(ev){ if (ev.target && ev.target.type === "range") fillRange(ev.target); });
  if (!ctrl.children.length) body.classList.add("solo");
  return kit;
};
document.addEventListener("DOMContentLoaded", function(){ if (!window.SFA_SIMPAGE) S.render(); });
})();
