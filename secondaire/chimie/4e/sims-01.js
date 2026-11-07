/* Chimie 4e · bibliothèque commune C4 + chapitre 1 · Nomenclature */
window.C4 = (function(){
  var MM = {H:1,Li:7,C:12,N:14,O:16,F:19,Na:23,Mg:24,Al:27,P:31,S:32,Cl:35.5,K:39,Ca:40,Cr:52,Mn:55,Fe:56,Cu:63.5,Zn:65,Br:80,Ag:108,I:127,Ba:137,Au:197,Pb:207};
  function parseBody(s){
    var i = 0;
    function num(){ var j = i; while (i < s.length && /\d/.test(s[i])) i++; return i > j ? +s.slice(j, i) : 1; }
    function grp(){
      var o = {};
      while (i < s.length){
        var ch = s[i];
        if (ch === "("){ i++; var g = grp(); if (s[i] !== ")") throw 0; i++; var n = num(); for (var k in g) o[k] = (o[k] || 0) + g[k] * n; }
        else if (ch === ")") return o;
        else if (/[A-Z]/.test(ch)){ var el = ch; i++; while (i < s.length && /[a-z]/.test(s[i])){ el += s[i]; i++; } if (!(el in MM)) throw 0; var m = num(); o[el] = (o[el] || 0) + m; }
        else throw 0;
      }
      return o;
    }
    try { var r = grp(); if (i !== s.length || !Object.keys(r).length) return null; return r; } catch (e){ return null; }
  }
  function parse(str){
    str = String(str).replace(/\s+/g, "").replace(/[.•∙]/g, "·");
    var parts = str.split("·"), tot = {};
    for (var p = 0; p < parts.length; p++){
      var m = /^(\d*)(.*)$/.exec(parts[p]), mult = m[1] ? +m[1] : 1, r = parseBody(m[2]);
      if (!r) return null;
      for (var k in r) tot[k] = (tot[k] || 0) + r[k] * mult;
    }
    return tot;
  }
  function M(f){ var c = parse(f); if (!c) return NaN; var s = 0; for (var k in c) s += c[k] * MM[k]; return s; }
  function sub(f){ return String(f).replace(/(\d+)/g, function(m, d, off, s){ return off > 0 && /[A-Za-z)]/.test(s[off - 1]) ? "<sub>" + d + "</sub>" : d; }); }
  var SUBS = "₀₁₂₃₄₅₆₇₈₉";
  function uni(f){ return String(f).replace(/(\d+)/g, function(m, d, off, s){ return off > 0 && /[A-Za-z)]/.test(s[off - 1]) ? d.replace(/\d/g, function(x){ return SUBS[+x]; }) : d; }); }
  function sup(n, plus){ var t = (n > 1 ? String(n) : "") + (plus ? "+" : "−"); return "<sup>" + t.replace("−", "−") + "</sup>"; }
  function gcd(a, b){ return b ? gcd(b, a % b) : a; }
  function lcm(a, b){ return a * b / gcd(a, b); }
  var GAS = {H2:1,O2:1,N2:1,CO2:1,NH3:1,CH4:1,Cl2:1,C3H8:1,C4H10:1,He:1,CO:1};
  /* catalogue de réactions : r = réactifs, p = produits, [coefficient, formule] */
  var REAC = {
    eau:{nom:"synthèse de l'eau", r:[[2,"H2"],[1,"O2"]], p:[[2,"H2O"]]},
    mgo:{nom:"combustion du magnésium", r:[[2,"Mg"],[1,"O2"]], p:[[2,"MgO"]]},
    nh3:{nom:"synthèse de l'ammoniac", r:[[1,"N2"],[3,"H2"]], p:[[2,"NH3"]]},
    ch4:{nom:"combustion du méthane", r:[[1,"CH4"],[2,"O2"]], p:[[1,"CO2"],[2,"H2O"]]},
    c3h8:{nom:"combustion du propane", r:[[1,"C3H8"],[5,"O2"]], p:[[3,"CO2"],[4,"H2O"]]},
    fe:{nom:"rouille du fer", r:[[4,"Fe"],[3,"O2"]], p:[[2,"Fe2O3"]]},
    al:{nom:"oxydation de l'aluminium", r:[[4,"Al"],[3,"O2"]], p:[[2,"Al2O3"]]},
    caco3:{nom:"cuisson du calcaire", r:[[1,"CaCO3"]], p:[[1,"CaO"],[1,"CO2"]]},
    acid:{nom:"calcaire + acide chlorhydrique", r:[[1,"CaCO3"],[2,"HCl"]], p:[[1,"CaCl2"],[1,"H2O"],[1,"CO2"]]},
    zn:{nom:"zinc + acide chlorhydrique", r:[[1,"Zn"],[2,"HCl"]], p:[[1,"ZnCl2"],[1,"H2"]]},
    mghcl:{nom:"magnésium + acide chlorhydrique", r:[[1,"Mg"],[2,"HCl"]], p:[[1,"MgCl2"],[1,"H2"]]},
    fes:{nom:"fer + soufre", r:[[1,"Fe"],[1,"S"]], p:[[1,"FeS"]]},
    azide:{nom:"décomposition de l'azoture de sodium", r:[[2,"NaN3"]], p:[[2,"Na"],[3,"N2"]]},
    gluc:{nom:"combustion du glucose", r:[[1,"C6H12O6"],[6,"O2"]], p:[[6,"CO2"],[6,"H2O"]]}
  };
  function side(a){ return a.map(function(t){ return (t[0] > 1 ? t[0] + " " : "") + sub(t[1]); }).join(" + "); }
  function eq(key){ var e = REAC[key]; return side(e.r) + " → " + side(e.p); }
  function sideU(a){ return a.map(function(t){ return (t[0] > 1 ? t[0] + " " : "") + uni(t[1]); }).join(" + "); }
  function eqU(key){ var e = REAC[key]; return sideU(e.r) + " → " + sideU(e.p); }
  function balanced(key){
    var e = REAC[key], L = {}, R = {};
    function add(o, a){ a.forEach(function(t){ var c = parse(t[1]); for (var k in c) o[k] = (o[k] || 0) + c[k] * t[0]; }); }
    add(L, e.r); add(R, e.p);
    var ks = Object.keys(L).concat(Object.keys(R)), ok = true;
    ks.forEach(function(k){ if ((L[k] || 0) !== (R[k] || 0)) ok = false; });
    return ok;
  }
  var COL = {H:"#9aa5b4", C:"#3b4656", N:"#2f56b3", O:"#c23a2f", Na:"#7b3fb0", Cl:"#2e8b57", S:"#c8a600", Fe:"#8a4b2b", Cu:"#b86a2e", Mg:"#5f8f3a", Ca:"#6a8f8f", Zn:"#6c7d90"};
  /* cadres de dessin */
  function label(c, s, x, y, col, size, align, weight){ S_.draw.text(c, s, x, y, {size:Math.max(12, size || 12), color:col || "#2c3a4e", align:align || "center", weight:weight}); }
  var S_ = window.SFA;
  function rr(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  /* bécher : x,y = coin haut-gauche ; frac = niveau (0..1) ; col = couleur du liquide */
  function beaker(c, x, y, w, h, frac, col, alpha){
    var ctx = c.ctx; ctx.save();
    if (frac > 0){ ctx.globalAlpha = alpha === undefined ? 0.85 : alpha; ctx.fillStyle = col; ctx.fillRect(x + 1.5, y + h * (1 - frac), w - 3, h * frac - 1.5); ctx.globalAlpha = 1; }
    ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - 4, y - 2); ctx.lineTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y); ctx.lineTo(x + w + 4, y - 2); ctx.stroke();
    ctx.restore();
  }
  function bar(c, x, y, w, h, frac, col, bg){
    var ctx = c.ctx; ctx.save(); ctx.fillStyle = bg || "#edf0f4"; ctx.fillRect(x, y, w, h); ctx.fillStyle = col; ctx.fillRect(x, y, Math.max(0, Math.min(1, frac)) * w, h); ctx.restore();
  }
  function disc(c, x, y, r, col, txt, tcol){ C4.ion(c, x, y, r, col, txt, {tcolor:tcol, size:Math.max(11, r * 0.9)}); }
  function rnd(seed){ var s = seed || 1; return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function sci(x, d){ return window.SFA.sci(x, d); }
  var SUP = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"};
  function supU(n){ return String(n).replace(/[-0-9]/g, function(ch){ return SUP[ch]; }); }
  function sciU(x, d){
    if (!isFinite(x) || x === 0) return window.SFA.fmt(x, d);
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    if (Math.abs(window.SFA.fmt(m, d === undefined ? 2 : d).replace(",", ".")) >= 10){ m /= 10; e += 1; }
    return window.SFA.fmt(m, d === undefined ? 2 : d) + "·10" + supU(e);
  }
  /* étiquette qui reste dans le canvas : ancrée sur x, déplacée si elle déborde */
  function tag(c, s, x, y, col, size, align){
    var ctx = c.ctx; ctx.save(); ctx.font = "700 " + Math.max(12, size || 12) + "px Mulish, system-ui, sans-serif";
    var w = ctx.measureText(s).width; ctx.restore();
    var left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    left = Math.max(6, Math.min(c.W - 6 - w, left));
    S_.draw.text(c, s, left, y, {size:Math.max(12, size || 12), color:col || "#2c3a4e", align:"left"});
  }
  return {MM:MM, parse:parse, M:M, sub:sub, uni:uni, sup:sup, gcd:gcd, lcm:lcm, GAS:GAS, REAC:REAC, eq:eq, eqU:eqU, balanced:balanced, side:side, COL:COL, label:label, rr:rr, tag:tag, sciU:sciU, supU:supU, beaker:beaker, bar:bar, disc:disc, rnd:rnd, sci:sci};
})();

/* ---------- aides visuelles communes (verrerie, ions, animations) — refonte novembre 2026 ---------- */
(function(){
  var S_ = window.SFA, P = S_.draw.palette, T = S_.draw.tint;
  C4.ease = function(t){ t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
  /* sous-phase d'une animation : ph(p, a, b) vaut 0 avant a, 1 après b */
  C4.ph = function(p, a, b){ return C4.ease((p - a) / (b - a)); };
  C4.lerp = function(a, b, t){ return a + (b - a) * t; };
  /* animation 0 → 1 : {p, go(), stop(), loop} ; durée en secondes */
  C4.anim = function(k, dur, onEnd){
    var st = {p:1};
    var lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / dur); if (st.p >= 1){ lp.pause(); if (onEnd) onEnd(); } k.redraw(); });
    st.go = function(){ st.p = 0; lp.play(); };
    st.stop = function(){ st.p = 1; lp.pause(); };
    st.running = function(){ return lp.running; };
    st.loop = lp;
    return st;
  };
  /* fond de paillasse : dégradé doux + ligne de table */
  C4.bg = function(c, bench, col){
    var ctx = c.ctx, g = ctx.createLinearGradient(0, 0, 0, c.H);
    g.addColorStop(0, "#f9fbfd"); g.addColorStop(1, col || "#eef2f7");
    ctx.save(); ctx.fillStyle = g; S_.draw.rrect(c, 0, 0, c.W, c.H, 12); ctx.fill();
    if (bench){ ctx.fillStyle = "#e1e7ee"; ctx.fillRect(0, bench, c.W, c.H - bench); ctx.fillStyle = "#cfd7e1"; ctx.fillRect(0, bench, c.W, 2); }
    ctx.restore();
  };
  /* récipient en verre : path = function(ctx) qui trace le contour fermé ; b = {x,y,w,h} boîte englobante ;
     frac = niveau 0..1 (de la boîte) ; col = couleur du liquide ; o = {alpha, ticks, shine} */
  C4.vessel = function(c, path, b, frac, col, o){
    o = o || {}; var ctx = c.ctx; ctx.save();
    ctx.fillStyle = "rgba(235,243,250,.55)"; path(ctx); ctx.fill();
    if (frac > 0){
      ctx.save(); path(ctx); ctx.clip();
      var ly = b.y + b.h * (1 - frac), g = ctx.createLinearGradient(0, ly, 0, b.y + b.h);
      g.addColorStop(0, T(col, (o.alpha || .7) * .8)); g.addColorStop(1, T(col, Math.min(1, (o.alpha || .7) * 1.15)));
      ctx.fillStyle = g; ctx.fillRect(b.x - 2, ly, b.w + 4, b.y + b.h - ly + 2);
      ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fillRect(b.x - 2, ly, b.w + 4, 2);
      ctx.restore();
    }
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = "rgba(78,92,112,.95)"; ctx.lineWidth = 2.4; path(ctx); ctx.stroke();
    if (o.shine !== false){ ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 3; ctx.beginPath(); var sxx = b.x + Math.min(b.w * .13, 9); ctx.moveTo(sxx, b.y + b.h * .2); ctx.lineTo(sxx, b.y + b.h * .62); ctx.stroke(); }
    if (o.ticks){ ctx.strokeStyle = "rgba(78,92,112,.55)"; ctx.lineWidth = 1.2; for (var i = 1; i <= o.ticks; i++){ var yy = b.y + b.h * (1 - i / (o.ticks + 1)); ctx.beginPath(); ctx.moveTo(b.x + b.w, yy); ctx.lineTo(b.x + b.w - (i % 2 ? 7 : 12), yy); ctx.stroke(); } }
    ctx.restore();
  };
  /* bécher : x,y = coin haut-gauche */
  C4.beaker2 = function(c, x, y, w, h, frac, col, o){
    var r = Math.min(10, w / 5);
    C4.vessel(c, function(ctx){ ctx.beginPath(); ctx.moveTo(x - 5, y - 3); ctx.lineTo(x, y); ctx.lineTo(x, y + h - r); ctx.quadraticCurveTo(x, y + h, x + r, y + h); ctx.lineTo(x + w - r, y + h); ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - r); ctx.lineTo(x + w, y); ctx.lineTo(x + w + 5, y - 3); ctx.lineTo(x + w + 5, y - 3); ctx.lineTo(x + w, y); ctx.closePath(); },
      {x:x, y:y, w:w, h:h}, frac, col, o);
    return {surface:y + h * (1 - frac), x:x, y:y, w:w, h:h};
  };
  /* erlenmeyer : cx = axe, y = haut du goulot */
  C4.flask2 = function(c, cx, y, wn, wb, h, frac, col, o){
    var hn = h * .38;
    C4.vessel(c, function(ctx){ ctx.beginPath(); ctx.moveTo(cx - wn / 2 - 3, y); ctx.lineTo(cx - wn / 2, y + 2); ctx.lineTo(cx - wn / 2, y + hn); ctx.lineTo(cx - wb / 2 + 6, y + h - 8); ctx.quadraticCurveTo(cx - wb / 2, y + h, cx - wb / 2 + 10, y + h); ctx.lineTo(cx + wb / 2 - 10, y + h); ctx.quadraticCurveTo(cx + wb / 2, y + h, cx + wb / 2 - 6, y + h - 8); ctx.lineTo(cx + wn / 2, y + hn); ctx.lineTo(cx + wn / 2, y + 2); ctx.lineTo(cx + wn / 2 + 3, y); ctx.closePath(); },
      {x:cx - wb / 2, y:y, w:wb, h:h}, frac, col, o);
  };
  /* fiole jaugée : bulbe + long col avec trait de jauge ; frac = niveau du liquide (0..1 de la hauteur totale) ; renvoie y du trait */
  C4.volflask = function(c, cx, y, h, frac, col, o){
    o = o || {}; var wn = Math.max(14, h * .1), wb = h * .56, hn = h * .46, rb = wb / 2, yb = y + h - rb;
    var tr = y + hn * .32;
    C4.vessel(c, function(ctx){ ctx.beginPath(); ctx.moveTo(cx - wn / 2 - 3, y); ctx.lineTo(cx - wn / 2, y + 2); ctx.lineTo(cx - wn / 2, y + hn); ctx.bezierCurveTo(cx - wn / 2, y + hn + rb * .45, cx - rb, yb - rb * .55, cx - rb, yb); ctx.arc(cx, yb, rb, Math.PI, 0, true); ctx.bezierCurveTo(cx + rb, yb - rb * .55, cx + wn / 2, y + hn + rb * .45, cx + wn / 2, y + hn); ctx.lineTo(cx + wn / 2, y + 2); ctx.lineTo(cx + wn / 2 + 3, y); ctx.closePath(); },
      {x:cx - rb, y:y, w:wb, h:h}, frac, col, o);
    var ctx = c.ctx; ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - wn / 2 - 4, tr); ctx.lineTo(cx + wn / 2 + 4, tr); ctx.stroke(); ctx.restore();
    return {trait:tr, neck:wn, bulbR:rb, bulbY:yb};
  };
  /* éprouvette / tube : x,y coin haut gauche */
  C4.tube = function(c, x, y, w, h, frac, col, o){
    C4.vessel(c, function(ctx){ ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x, y + 1); ctx.lineTo(x, y + h - w / 2); ctx.arc(x + w / 2, y + h - w / 2, w / 2, Math.PI, 0, true); ctx.lineTo(x + w, y + 1); ctx.lineTo(x + w + 2, y); ctx.closePath(); }, {x:x, y:y, w:w, h:h}, frac, col, o);
  };
  /* ion : disque en relief, étiquette facultative */
  C4.ion = function(c, x, y, r, col, txt, o){
    o = o || {}; var ctx = c.ctx; ctx.save();
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = col; ctx.fill();
    var g = ctx.createRadialGradient(x - r * .38, y - r * .42, 0, x - r * .38, y - r * .42, r * .62);
    g.addColorStop(0, "rgba(255,255,255,.38)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = o.ring || "rgba(255,255,255,.9)"; ctx.stroke();
    ctx.restore();
    if (txt) S_.draw.text(c, txt, x, y + .5, {size:o.size || Math.max(10.5, r * .95), color:o.tcolor || "#fff", math:false});
  };
  /* étiquette de couleur de pH / indicateur */
  C4.mix = function(a, b, t){
    function p(h){ var m = /^#(..)(..)(..)$/.exec(h); return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]; }
    var x = p(a), y = p(b); return "rgb(" + x.map(function(v, i){ return Math.round(v + (y[i] - v) * t); }).join(",") + ")";
  };
  /* indice « 2+ » dessiné : texte d'ion en unicode */
  C4.u = function(s){ return C4.uni(s); };
  /* flèche courbe de transfert (pour animations) : point sur une courbe de Bézier quadratique */
  C4.bez = function(p0, p1, p2, t){ var a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, d = t * t; return [a * p0[0] + b * p1[0] + d * p2[0], a * p0[1] + b * p1[1] + d * p2[1]]; };
  /* texte lisible sur mobile : taille mini 12 px */
  C4.t = function(c, s, x, y, o){ o = o || {}; o.size = Math.max(12, o.size || 12.5); S_.draw.text(c, s, x, y, o); };
  /* texte sur plusieurs lignes, centré sur x ; renvoie la hauteur occupée */
  C4.wrap = function(c, txt, x, y, maxW, o){
    o = o || {}; var size = Math.max(12, o.size || 12.5), lh = o.lh || size * 1.35, ctx = c.ctx;
    ctx.save(); ctx.font = (o.weight || 700) + " " + size + "px Mulish, system-ui, sans-serif";
    var words = String(txt).split(" "), lines = [], cur = "";
    words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (cur && ctx.measureText(t).width > maxW){ lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur); ctx.restore();
    lines.forEach(function(l, i){ S_.draw.text(c, l, x, y + i * lh, {size:size, color:o.color, align:o.align || "center", weight:o.weight, math:o.math}); });
    return lines.length * lh;
  };
  /* pastille « Défi » : met à jour la note */
  C4.stars = function(n){ var s = ""; for (var i = 0; i < 3; i++) s += i < n ? "★" : "☆"; return s; };
})();

/* ---------- ions ---------- */
C4.CAT = [
  {s:"Na", q:1, nom:"sodium"}, {s:"K", q:1, nom:"potassium"}, {s:"Ag", q:1, nom:"argent"}, {s:"NH4", q:1, nom:"ammonium", poly:1},
  {s:"H", q:1, nom:"hydrogène"},
  {s:"Mg", q:2, nom:"magnésium"}, {s:"Ca", q:2, nom:"calcium"}, {s:"Zn", q:2, nom:"zinc"}, {s:"Ba", q:2, nom:"baryum"},
  {s:"Cu", q:2, nom:"cuivre (II)"}, {s:"Fe", q:2, nom:"fer (II)"}, {s:"Fe", q:3, nom:"fer (III)"}, {s:"Al", q:3, nom:"aluminium"}, {s:"Pb", q:2, nom:"plomb (II)"}
];
C4.AN = [
  {s:"Cl", q:1, nom:"chlorure"}, {s:"OH", q:1, nom:"hydroxyde", poly:1}, {s:"NO3", q:1, nom:"nitrate", poly:1}, {s:"HCO3", q:1, nom:"hydrogénocarbonate", poly:1},
  {s:"O", q:2, nom:"oxyde"}, {s:"S", q:2, nom:"sulfure"}, {s:"SO4", q:2, nom:"sulfate", poly:1}, {s:"SO3", q:2, nom:"sulfite", poly:1}, {s:"CO3", q:2, nom:"carbonate", poly:1},
  {s:"PO4", q:3, nom:"phosphate", poly:1}
];
C4.ionHtml = function(i, plus){ return C4.sub(i.s) + C4.sup(i.q, plus); };
C4.ionUni = function(i, plus){ var t = (i.q > 1 ? ["", "", "²", "³"][i.q] : "") + (plus ? "⁺" : "⁻"); return C4.uni(i.s) + t; };
C4.salt = function(ca, an){
  var g = C4.gcd(ca.q, an.q), x = an.q / g, y = ca.q / g;
  function part(i, n){ if (n === 1) return i.s; return (i.poly ? "(" + i.s + ")" : i.s) + n; }
  var f = part(ca, x) + part(an, y), nom, note = "";
  if (ca.s === "H"){
    var ac = {Cl:"acide chlorhydrique", NO3:"acide nitrique", SO4:"acide sulfurique", SO3:"acide sulfureux", CO3:"acide carbonique", PO4:"acide phosphorique", S:"sulfure d'hydrogène (acide sulfhydrique)", O:"eau (oxyde de dihydrogène)", OH:"eau (oxyde de dihydrogène)", HCO3:"acide carbonique"};
    nom = ac[an.s];
    if (an.s === "OH"){ f = "H2O"; } if (an.s === "HCO3"){ f = "H2CO3"; }
    if (an.s === "Cl") nom += " (chlorure d'hydrogène en solution)";
    note = "Avec H⁺, la formule est celle d'un acide (ou de l'eau).";
  } else {
    var elide = /^[aeiouyéè]/i.test(ca.nom) ? "d'" : "de ";
    nom = an.nom + " " + elide + ca.nom;
  }
  if (ca.s === "NH4" && an.s === "OH"){ note = "NH₄OH n'existe pas vraiment : c'est le gaz NH₃ dissous dans l'eau (ammoniaque)."; }
  if (ca.s === "NH4" && an.s === "O"){ note = "(NH₄)₂O n'existe pas à l'état stable : ce sel est purement théorique."; }
  if (ca.s === "Ag" && an.s === "OH"){ note = "AgOH est instable : il se transforme en oxyde d'argent Ag₂O."; }
  if (ca.s === "Fe" && ca.q === 3 && an.s === "CO3"){ note = "Le carbonate de fer (III) n'existe pas : en solution on obtient plutôt Fe(OH)₃ et du CO₂."; }
  return {f:f, x:x, y:y, nom:nom, note:note, unit:function(){ return f; }};
};

SFA.sim({
  id:"c4-c01-atelier", ch:"c01", tag:"Classique",
  titre:"L'atelier de formules",
  resume:"Associe un cation et un anion : la formule, le nom et la masse molaire apparaissent.",
  but:"Choisis un cation et un anion. Compte les charges + et − : la formule est celle qui rend l'ensemble neutre.",
  aRetenir:"La formule d'un composé ionique se trouve par neutralité : (nombre de cations × charge) = (nombre d'anions × charge). Le nom se lit « anion de cation » : sulfate de calcium.",
  piege:"Les indices de la formule dépendent des charges, pas de l'ordre alphabétique. Un ion polyatomique (SO₄²⁻, OH⁻…) reste un bloc : on met des parenthèses dès qu'il en faut plus d'un, comme dans Ca(OH)₂.",
  build:function(k, S){
    var c = k.canvas(250);
    var ca = k.select("Cation", C4.CAT.map(function(i, n){ return [n, C4.ionUni(i, 1) + " — " + i.nom]; }), 6);
    var an = k.select("Anion", C4.AN.map(function(i, n){ return [n, C4.ionUni(i, 0) + " — " + i.nom]; }), 6);
    var ro = k.readouts(["Formule", "Masse molaire"]);
    var nm = k.note("", "ok");
    k.draw(function(){
      var A = C4.CAT[+ca.value], B = C4.AN[+an.value], s = C4.salt(A, B);
      c.clear(); C4.bg(c);
      var n1 = s.x, n2 = s.y, W = c.W, gap = Math.min(54, (W - 40) / (n1 + n2 + 1)), r = Math.min(22, gap * 0.42);
      var tot = n1 + n2, x0 = W / 2 - (tot - 1) * gap / 2;
      var cc = A.s === "H" ? "#c23a2f" : "#1f4b9e";
      for (var i = 0; i < tot; i++){
        var isCat = i < n1, it = isCat ? A : B;
        C4.disc(c, x0 + i * gap, 70, r, isCat ? "#1f4b9e" : "#c0321d", it.q + (isCat ? "+" : "−"));
        C4.label(c, C4.uni(it.s), x0 + i * gap, 70 + r + 14, "#2c3a4e", 12);
      }
      C4.label(c, n1 + " × (" + (isNaN(A.q) ? "" : "+" + A.q) + ") = +" + (n1 * A.q), W * 0.27, 130, "#1f4b9e", 14);
      C4.label(c, n2 + " × (−" + B.q + ") = −" + (n2 * B.q), W * 0.73, 130, "#c0321d", 14);
      C4.label(c, "Total des charges : " + (n1 * A.q - n2 * B.q), W / 2, 165, "#24775a", 15);
      C4.label(c, C4.uni(s.f), W / 2, 205, "#0f1b2d", 26);
      var m = C4.M(s.f);
      ro.set(0, C4.sub(s.f)); ro.set(1, isNaN(m) ? "—" : S.fmt(m, 1) + " g/mol");
      nm.set("<b>" + s.nom + "</b>" + (s.note ? "<br>" + s.note : ""), s.note && /n'existe|instable/.test(s.note) ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id:"c4-c01-quiz", ch:"c01", tag:"Défi",
  titre:"Nom, formule : juste ou fausse ?",
  resume:"Un quiz sans fin à trois niveaux : retrouve le nom, ou chasse la formule fautive.",
  but:"Choisis un mode et un niveau, puis réponds. Les erreurs te montrent comment la bonne formule se construit.",
  aRetenir:"Pour contrôler une formule : 1) repère les ions, 2) lis leurs charges, 3) vérifie que la somme est nulle et que les indices sont les plus petits possibles.",
  piege:"Ca₂SO₄ ou Al₂SO₄ semblent « normaux » mais les charges ne s'annulent pas. Et Ca₂(SO₄)₂ est neutre, mais pas simplifié : la formule s'écrit CaSO₄.",
  build:function(k, S){
    var c = k.canvas(330), P = S.draw.palette, st = {score:0, n:0, q:null, done:false, streak:0, best:0, hist:[]};
    var mode = k.seg("Mode", [["nom","Formule → nom"],["jf","Juste ou fausse ?"]], "nom", function(){ next(); });
    var lev = k.seg("Niveau", [[1,"1"],[2,"2"],[3,"3"]], 1, function(){ next(); });
    var ro = k.readouts(["Score", "Série en cours (record)"]);
    var fb = k.note("Réponds à la question.", "");
    var btns = [];
    for (var i = 0; i < 4; i++) (function(i){ btns.push(k.button("…", function(){ answer(i); })); })(i);
    function pool(){
      var L = +lev.value;
      var cats = C4.CAT.filter(function(x){ return x.s !== "H" && (L === 1 ? ["Na","K","Mg","Ca","Zn"].indexOf(x.s) >= 0 : L === 2 ? x.s !== "Fe" && x.s !== "Ag" : true); });
      var ans = C4.AN.filter(function(x){ return L === 1 ? ["Cl","O","S","OH"].indexOf(x.s) >= 0 : L === 2 ? ["Cl","O","S","OH","NO3","SO4","CO3"].indexOf(x.s) >= 0 : true; });
      return {cats:cats, ans:ans};
    }
    function ok(a, b){ var s = C4.salt(a, b); return !s.note; }
    function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
    function next(){
      var p = pool(), a, b, tries = 0;
      do { a = pick(p.cats); b = pick(p.ans); tries++; } while (!ok(a, b) && tries < 60);
      var s = C4.salt(a, b);
      st.done = false; st.n0 = a; st.n1 = b; st.s = s;
      if (mode.value === "nom"){
        var opts = [s.nom], guard = 0;
        while (opts.length < 4 && guard++ < 80){
          var a2 = Math.random() < 0.5 ? a : pick(p.cats), b2 = a2 === a ? pick(p.ans) : b;
          if (!ok(a2, b2)) continue;
          var nn = C4.salt(a2, b2).nom; if (opts.indexOf(nn) < 0) opts.push(nn);
        }
        var order = [0,1,2,3].sort(function(){ return Math.random() - 0.5; });
        st.opts = order.map(function(j){ return opts[j]; }); st.good = st.opts.indexOf(s.nom);
        st.shown = s.f;
      } else {
        var wrong = [], x = s.x, y = s.y;
        function mk(xx, yy, par){
          function part(i, n, isc){ if (n === 1) return i.s; return (i.poly && par ? "(" + i.s + ")" : i.s) + n; }
          return part(a, xx) + part(b, yy);
        }
        var cand = [];
        if (x !== y) cand.push(mk(y, x, true));
        if (x !== 1 || y !== 1) cand.push(mk(1, 1, true));
        cand.push(mk(2 * x, 2 * y, true));
        if ((a.poly && x > 1) || (b.poly && y > 1)) cand.push(mk(x, y, false));
        if (a.q === b.q && x === 1) cand.push(mk(1, 2, true));
        cand = cand.filter(function(f){ return f !== s.f; });
        var isTrue = Math.random() < 0.45 || !cand.length;
        st.shown = isTrue ? s.f : pick(cand); st.isTrue = isTrue; st.opts = ["Juste", "Fausse", "", ""]; st.good = isTrue ? 0 : 1;
      }
      draw2(); k.redraw();
    }
    function answer(i){
      if (st.done || !st.opts[i]) return;
      st.done = true; st.n++;
      var good = i === st.good, s = st.s;
      if (good){ st.score++; st.streak++; st.best = Math.max(st.best, st.streak); } else st.streak = 0;
      st.hist.push(good ? 1 : 0); if (st.hist.length > 12) st.hist.shift();
      btns.forEach(function(b, j){ if (!st.opts[j]) return; var on = j === st.good || j === i; b.style.setProperty("background", on ? (j === st.good ? P.green : P.red) : "", "important"); b.style.setProperty("color", on ? "#fff" : "", "important"); b.style.setProperty("border-color", on ? (j === st.good ? P.green : P.red) : "", "important"); b.style.opacity = (j === st.good || j === i) ? 1 : .55; });
      if (mode.value === "nom") fb.set((good ? "✅ Juste. " : "❌ Non. ") + "<b>" + C4.sub(s.f) + " = " + s.nom + "</b> (" + s.x + " × " + C4.ionHtml(st.n0, 1) + " et " + s.y + " × " + C4.ionHtml(st.n1, 0) + " : charges +" + (s.x * st.n0.q) + " et −" + (s.y * st.n1.q) + ").", good ? "ok" : "warn");
      else fb.set((good ? "✅ " : "❌ ") + "Le composé « " + s.nom + " » a pour formule <b>" + C4.sub(s.f) + "</b> (" + s.x + " × " + C4.ionHtml(st.n0, 1) + " = +" + (s.x * st.n0.q) + ", " + s.y + " × " + C4.ionHtml(st.n1, 0) + " = −" + (s.y * st.n1.q) + ")." + (st.isTrue ? "" : " La formule proposée « " + C4.sub(st.shown) + " » est fausse."), good ? "ok" : "warn");
      k.redraw();
    }
    function draw2(){ btns.forEach(function(b, i){ b.innerHTML = st.opts[i] || "·"; b.style.display = st.opts[i] ? "" : "none"; b.style.removeProperty("background"); b.style.removeProperty("color"); b.style.removeProperty("border-color"); b.style.opacity = ""; }); }
    next();
    k.draw(function(){
      c.clear(); C4.bg(c);
      if (!st.s) return;
      var W = c.W, s = st.s, ctx = c.ctx;
      S.draw.label(c, mode.value === "nom" ? "QUEL EST LE NOM DE CETTE SUBSTANCE ?" : "CETTE FORMULE EST-ELLE JUSTE ?", W / 2, 24, {color:P.mat, size:12});
      if (mode.value === "nom"){
        S.draw.text(c, C4.uni(st.shown), W / 2, 84, {size:W < 420 ? 40 : 52, color:P.ink, math:true});
      } else {
        C4.t(c, s.nom, W / 2, 62, {size:W < 420 ? 17 : 20, color:P.ink});
        S.draw.text(c, C4.uni(st.shown), W / 2, 112, {size:W < 420 ? 36 : 46, color:P.ink, math:true});
      }
      if (st.done){
        var n1 = s.x, n2 = s.y, tot = n1 + n2, r = Math.min(15, (W - 40) / (tot * 2.3)), gap = r * 2.3, x0 = W / 2 - (tot - 1) * gap / 2, y = 212;
        for (var i = 0; i < tot; i++){ var cat = i < n1, it = cat ? st.n0 : st.n1; C4.ion(c, x0 + i * gap, y, r, cat ? P.acc : P.red, (it.q > 1 ? it.q : "") + (cat ? "+" : "−"), {size:Math.max(10, r * .8)}); }
        C4.t(c, n1 + " × " + C4.ionUni(st.n0, 1) + " (+" + (n1 * st.n0.q) + ")   ·   " + n2 + " × " + C4.ionUni(st.n1, 0) + " (−" + (n2 * st.n1.q) + ")", W / 2, 250, {size:13, color:P.ink});
        C4.t(c, "total = 0 : formule " + C4.uni(s.f), W / 2, 274, {size:13, color:P.green});
      } else C4.wrap(c, "Repère les ions, lis leurs charges, vérifie que la somme est nulle.", W / 2, 230, W - 40, {size:12.5, color:P.grey, weight:600});
      for (var h = 0; h < st.hist.length; h++) S.draw.dot(c, 16 + h * 15, 308, 4.5, st.hist[h] ? P.green : P.red);
      if (st.streak >= 3) S.draw.label(c, "🔥 série de " + st.streak, W - 12, 308, {align:"right", color:P.orange, size:12.5});
      ro.set(0, st.score + " / " + st.n); ro.set(1, st.streak + " (" + st.best + ")");
    });
    k.button("Nouvelle question", function(){ next(); }, true);
  }
});

SFA.sim({
  id:"c4-c01-charges", ch:"c01", tag:"Équilibre",
  titre:"Équilibrer les charges avec les indices",
  resume:"Une balance des charges : ajoute des ions de chaque côté jusqu'à ce qu'elle soit à l'équilibre avec les plus petits entiers.",
  but:"Choisis deux ions, puis règle x et y (curseurs, ou clique sur un plateau de la balance). La formule est correcte quand la balance est à l'équilibre avec les plus petits indices. Relève le défi !",
  aRetenir:"Neutralité : x · q(cation) = y · q(anion). On prend les plus petits entiers possibles : si x et y ont un diviseur commun, on simplifie.",
  piege:"Ne confonds pas indice et charge : dans Al₂O₃, le « 2 » compte les ions Al³⁺, il ne change pas leur charge.",
  build:function(k, S){
    var c = k.canvas(310), P = S.draw.palette;
    var cations = C4.CAT.filter(function(i){ return i.s !== "H"; });
    var ca = k.select("Cation", cations.map(function(i, n){ return [n, C4.ionUni(i, 1) + " — " + i.nom]; }), 5);
    var an = k.select("Anion", C4.AN.map(function(i, n){ return [n, C4.ionUni(i, 0) + " — " + i.nom]; }), 4);
    var X = k.slider("x (nombre de cations)", 1, 6, 1, 1, ""), Y = k.slider("y (nombre d'anions)", 1, 6, 1, 1, "");
    var ro = k.readouts(["Charges +", "Charges −", "Formule écrite", "Défis réussis"]);
    var nt = k.note("", "");
    var st = {ang:0, defi:false, won:false, score:0, n:0};
    function rnd(a){ return a[Math.floor(Math.random() * a.length)]; }
    k.button("🎯 Défi : un nouveau couple d'ions", function(){
      var a, b, t = 0;
      do { a = rnd(cations); b = rnd(C4.AN); t++; } while ((C4.salt(a, b).note || (a.q === b.q)) && t < 80);
      ca.set(cations.indexOf(a)); an.set(C4.AN.indexOf(b)); X.set(1); Y.set(1); st.defi = true; st.won = false; st.n++;
    }, true);
    k.button("Mode libre", function(){ st.defi = false; });
    c.pointer(function(type, p){
      if (type !== "down" || p.y < 70) return;
      if (p.x < c.W / 2) X.set(X.value % 6 + 1); else Y.set(Y.value % 6 + 1);
      k.redraw();
    });
    var lp = k.loop(function(dt){ var tg = st.tg || 0; if (Math.abs(tg - st.ang) > 0.002){ st.ang += (tg - st.ang) * Math.min(1, dt * 7); k.redraw(); } });
    lp.play();
    function pan(x, y, n, q, col, plus){
      var cols = Math.min(3, n), r = c.W < 420 ? 11 : 13, gap = r * 2.15, i;
      for (i = 0; i < n; i++){ var cx = x + ((i % 3) - (cols - 1) / 2) * gap, cy = y - 10 - r - Math.floor(i / 3) * gap; C4.ion(c, cx, cy, r, col, (q > 1 ? q : "") + (plus ? "+" : "−"), {size:10.5}); }
      S.draw.line(c, x - 44, y, x + 44, y, "#6b7889", 3.5);
      S.draw.line(c, x - 44, y, x, y - 60, "rgba(107,120,137,.5)", 1.3); S.draw.line(c, x + 44, y, x, y - 60, "rgba(107,120,137,.5)", 1.3);
    }
    k.draw(function(){
      var A = cations[+ca.value], B = C4.AN[+an.value], x = X.value, y = Y.value, W = c.W, ctx = c.ctx;
      var Pc = x * A.q, N = y * B.q, g = C4.gcd(x, y), neutral = Pc === N, simplest = g === 1;
      st.tg = Math.max(-0.3, Math.min(0.3, (N - Pc) * 0.07));
      C4.bg(c);
      var px = W / 2, py = 112, hl = W * 0.34, a = st.ang;
      /* pied */
      ctx.fillStyle = "#cfd7e1"; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 26, 286); ctx.lineTo(px + 26, 286); ctx.closePath(); ctx.fill();
      if (neutral && simplest) S.draw.glow(c, px, py, 90, P.green, .35);
      /* fléau */
      var lx = px - hl * Math.cos(a), ly = py - hl * Math.sin(a), rx = px + hl * Math.cos(a), ry = py + hl * Math.sin(a);
      S.draw.line(c, lx, ly, rx, ry, "#44546a", 6);
      S.draw.dot(c, px, py, 6, neutral ? P.green : "#44546a");
      pan(lx, ly + 66, x, A.q, P.acc, true); pan(rx, ry + 66, y, B.q, P.red, false);
      S.draw.label(c, "+" + Pc, lx, ly + 86, {color:P.acc, size:14}); S.draw.label(c, "−" + N, rx, ry + 86, {color:P.red, size:14});
      C4.t(c, x + " × " + C4.ionUni(A, 1), lx, 18, {color:P.acc, size:13.5}); C4.t(c, y + " × " + C4.ionUni(B, 0), rx, 18, {color:P.red, size:13.5});
      var f = (x === 1 ? A.s : (A.poly ? "(" + A.s + ")" : A.s) + x) + (y === 1 ? B.s : (B.poly ? "(" + B.s + ")" : B.s) + y);
      S.draw.text(c, neutral ? C4.uni(f) : "?", px, 52, {size:26, color:neutral ? (simplest ? P.green : P.amber) : P.grey, math:true});
      C4.t(c, neutral ? (simplest ? "à l'équilibre" : "équilibre, mais à simplifier") : (Pc > N ? "trop de + : ajoute des anions" : "trop de − : ajoute des cations"), px, 80, {size:12, color:P.grey, weight:700});
      if (st.defi) S.draw.label(c, "DÉFI " + C4.stars(st.won ? 3 : 0), 10, 292, {align:"left", color:P.violet, size:12});
      C4.t(c, "clique sur un plateau pour ajouter un ion", W - 10, 296, {align:"right", size:11.5, color:P.grey, weight:600});
      if (st.defi && neutral && simplest && !st.won){ st.won = true; st.score++; }
      ro.set(0, "+" + Pc); ro.set(1, "−" + N); ro.set(2, C4.sub(f)); ro.set(3, st.score + " / " + st.n);
      if (!neutral) nt.set(st.defi ? "Défi : trouve x et y pour " + C4.ionHtml(A, 1) + " et " + C4.ionHtml(B, 0) + ". La balance penche : " + (Pc > N ? "il y a trop de charges +." : "il y a trop de charges −.") : "Les charges ne s'annulent pas : cette formule n'existe pas. Ajuste x ou y.", "warn");
      else if (!simplest) nt.set("Neutre, mais pas simplifié : divise x et y par " + g + ". La formule est " + C4.sub(C4.salt(A, B).f) + ".", "warn");
      else nt.set("✅ Équilibre avec les plus petits indices : " + C4.sub(f) + " (" + C4.salt(A, B).nom + ")." + (st.defi ? " Défi réussi !" : ""), "ok");
    });
  }
});

SFA.sim({
  id:"c4-c01-neutralisation", ch:"c01", tag:"Sels",
  titre:"Acide + base → sel + eau",
  resume:"Mélange un acide et une base et regarde les ions H⁺ et OH⁻ s'associer en eau pendant que le sel se forme.",
  but:"Choisis un acide et une base, puis clique sur « Mélanger » : chaque H⁺ trouve un OH⁻ pour former H₂O ; les autres ions s'assemblent en sel. Compte-les !",
  aRetenir:"Acide + base → sel + eau. Le sel garde le cation de la base et l'anion de l'acide. Les coefficients se trouvent en égalant le nombre de H⁺ cédés et de OH⁻ captés.",
  piege:"Le sel n'est pas « neutre » parce qu'il s'appelle sel de table : NaCl n'est que l'un des sels possibles. Et H₂O n'est pas un sel.",
  build:function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var acids = [["HCl","Cl",1,"acide chlorhydrique"],["HNO3","NO3",1,"acide nitrique"],["H2SO4","SO4",2,"acide sulfurique"],["H3PO4","PO4",3,"acide phosphorique"]];
    var bases = [["NaOH","Na",1,"hydroxyde de sodium"],["KOH","K",1,"hydroxyde de potassium"],["Mg(OH)2","Mg",2,"hydroxyde de magnésium"],["Ca(OH)2","Ca",2,"hydroxyde de calcium"],["Al(OH)3","Al",3,"hydroxyde d'aluminium"]];
    var A = k.select("Acide", acids.map(function(a, i){ return [i, C4.uni(a[0]) + " — " + a[3]]; }), 2);
    var B = k.select("Base", bases.map(function(a, i){ return [i, C4.uni(a[0]) + " — " + a[3]]; }), 3);
    var ro = k.readouts(["Sel formé", "H₂O formées", "H⁺ et OH⁻ comptés"]);
    var nt = k.note("", "ok");
    var an = C4.anim(k, 4.2);
    k.button("▶ Mélanger", function(){ an.go(); }, true); k.button("↺ Séparer", function(){ an.stop(); an.p = 0; });
    [A.el, B.el].forEach(function(e){ e.addEventListener("change", function(){ an.stop(); an.p = 0; }); });
    an.p = 0;
    var rd = C4.rnd(21), U = []; for (var i = 0; i < 40; i++) U.push([rd(), rd()]);
    function get(){
      var a = acids[+A.value], b = bases[+B.value], n = a[2], m = b[2], g = C4.gcd(n, m), xa = m / g, yb = n / g;
      var catI = C4.CAT.filter(function(i){ return i.s === b[1] && i.q === m; })[0], anI = C4.AN.filter(function(i){ return i.s === a[1]; })[0];
      return {a:a, b:b, n:n, m:m, xa:xa, yb:yb, catI:catI, anI:anI, sel:C4.salt(catI, anI), H:xa * n, water:xa * n};
    }
    k.draw(function(){
      var d = get(), W = c.W, ctx = c.ctx, p = an.p, ph = C4.ph;
      C4.bg(c, 296);
      function t(co, f){ return (co > 1 ? co + " " : "") + C4.uni(f); }
      var s = t(d.xa, d.a[0]) + "  +  " + t(d.yb, d.b[0]) + "  →  " + t(1, d.sel.f) + "  +  " + t(d.water, "H2O");
      S.draw.text(c, s, W / 2, 26, {size:W < 480 ? 15 : 20, color:P.ink, math:true});
      /* bécher */
      var bx = 12, by = 52, bw = W - 24, bh = 220, mid = bx + bw / 2;
      C4.beaker2(c, bx, by, bw, bh, .74, p < .5 ? "#cfe3f5" : "#d3ece3", {alpha:.55, ticks:0});
      var hx = ctx; ctx.save(); ctx.fillStyle = "rgba(192,50,29,.07)"; ctx.fillRect(bx + 2, by + bh * .26, bw / 2 - 2, bh * .74 - 4); ctx.fillStyle = "rgba(31,75,158,.07)"; ctx.fillRect(mid, by + bh * .26, bw / 2 - 2, bh * .74 - 4); ctx.restore();
      var vis = 1 - ph(p, 0, .12);
      if (vis > 0.02){ ctx.save(); ctx.globalAlpha = vis; S.draw.line(c, mid, by + bh * .28, mid, by + bh - 4, P.grey, 2, [5, 4]); ctx.restore(); }
      C4.t(c, "acide", bx + bw * .25, by + bh * .17, {color:P.red, size:13}); C4.t(c, "base", bx + bw * .75, by + bh * .17, {color:P.acc, size:13});
      var top = by + bh * .32, hgt = bh * .56, rH = 9, rI = 12.5, mv = ph(p, .1, .5), mg = ph(p, .5, .72), ar = ph(p, .5, 1);
      var seq = [], ci = 0, ai = 0; while (ci < d.yb || ai < d.xa){ if (ci < d.yb) seq.push(["c", ci++]); if (ai < d.xa) seq.push(["a", ai++]); }
      var rowY = by + bh - 24, gap = Math.min(34, (bw - 40) / Math.max(1, seq.length));
      /* paires H+ / OH- */
      for (var i = 0; i < d.H; i++){
        var hx0 = bx + 14 + U[i][0] * (bw / 2 - 34), hy0 = top + U[i][1] * hgt, ox0 = mid + 12 + U[i + 10][0] * (bw / 2 - 34), oy0 = top + U[i + 10][1] * hgt;
        var mx = mid - (d.H - 1) * 16 + i * 32, my = top + hgt * .42;
        if (mg < .01){
          C4.ion(c, C4.lerp(hx0, mx - rH, mv), C4.lerp(hy0, my, mv), rH, P.red, "H⁺", {size:10});
          C4.ion(c, C4.lerp(ox0, mx + rH, mv), C4.lerp(oy0, my, mv), rH + 1, P.acc, "OH⁻", {size:9});
        } else {
          var wy = C4.lerp(my, top - 6 + (i % 2) * 14, ar);
          S.draw.glow(c, mx, wy, 22, P.teal, .35 * (1 - ar));
          ctx.save(); S.draw.rrect(c, mx - 19, wy - 10, 38, 20, 10); ctx.fillStyle = P.teal; ctx.fill(); ctx.restore();
          S.draw.text(c, "H₂O", mx, wy + .5, {size:12, color:"#fff"});
        }
      }
      /* ions spectateurs → rangée du sel */
      seq.forEach(function(q, j){
        var isC = q[0] === "c", idx = q[1];
        var sx = isC ? bx + bw / 2 + 20 + U[20 + idx][0] * (bw / 2 - 52) : bx + 20 + U[25 + idx][0] * (bw / 2 - 52), sy = top + 16 + U[(isC ? 30 : 35) + idx][1] * (hgt - 30);
        var ex = mid + (j - (seq.length - 1) / 2) * gap, x = C4.lerp(sx, ex, ar), y = C4.lerp(sy, rowY, ar);
        if (isC) C4.ion(c, x, y, rI, P.violet, C4.uni(d.catI.s) + (d.catI.q > 1 ? ["", "", "²", "³"][d.catI.q] : "") + "⁺", {size:d.catI.q > 1 ? 9.5 : 10.5});
        else C4.ion(c, x, y, rI + 4, P.amber, C4.uni(d.anI.s) + (d.anI.q > 1 ? ["", "", "²", "³"][d.anI.q] : "") + "⁻", {size:d.anI.s.length > 2 ? 9 : 11});
      });
      if (p >= 1){ S.draw.label(c, "sel formé : " + C4.uni(d.sel.f), mid, rowY - 30, {color:P.green, size:13}); }
      C4.t(c, p >= 1 ? d.H + " H⁺ + " + d.H + " OH⁻ → " + d.water + " H₂O" : d.H + " H⁺ (acide)   et   " + d.H + " OH⁻ (base)", mid, by + bh + 14, {color:P.ink, size:12.5, base:"middle"});
      ro.set(0, C4.sub(d.sel.f)); ro.set(1, d.water); ro.set(2, d.H + " H⁺ = " + d.H + " OH⁻");
      nt.set("<b>" + d.sel.nom.charAt(0).toUpperCase() + d.sel.nom.slice(1) + "</b> : " + d.H + " H⁺ + " + d.H + " OH⁻ → " + d.water + " H₂O. Les " + d.xa + " anion(s) " + C4.ionHtml(d.anI, 0) + " et les " + d.yb + " cation(s) " + C4.ionHtml(d.catI, 1) + " restent dans le sel.", "ok");
    });
  }
});
