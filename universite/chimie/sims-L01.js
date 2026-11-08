/* Chimie BA1 · L01 · Mole, nomenclature inorganique et stœchiométrie — simulations SFA originales */
(function(){
/* masses molaires (g/mol), tableau IUPAC arrondi à 3 décimales */
var AM = {H:1.008, C:12.011, N:14.007, O:15.999, Na:22.990, Mg:24.305, Al:26.982, S:32.06, Cl:35.45, Fe:55.845};
var COL = {H:"#e4e9f0", C:"#3b4350", N:"#2f5fb3", O:"#c0392b", Cl:"#2e8b57", Al:"#8d9aab", Fe:"#9a5b32", Mg:"#c9a227", S:"#d4b200"};
var RAD = {H:0.30, C:0.45, N:0.45, O:0.45, Cl:0.55, Al:0.6, Fe:0.6, Mg:0.55, S:0.55};
var SUB = "₀₁₂₃₄₅₆₇₈₉";
function sub(f){ return f.replace(/(\d+)/g, function(m){ return m.split("").map(function(d){ return SUB[+d]; }).join(""); }); }
function parse(f){
  var o = {}, re = /([A-Z][a-z]?)(\d*)/g, m;
  while ((m = re.exec(f))) o[m[1]] = (o[m[1]] || 0) + (m[2] ? +m[2] : 1);
  return o;
}
function atomsOf(f){ var p = parse(f), l = []; Object.keys(p).forEach(function(e){ for (var i = 0; i < p[e]; i++) l.push(e); }); return l; }
function molarMass(f){ var p = parse(f), s = 0; Object.keys(p).forEach(function(e){ s += p[e] * AM[e]; }); return s; }
function gcd(a, b){ return b ? gcd(b, a % b) : a; }

/* géométries 2D schématiques : [élément, x, y] et liaisons [i, j, ordre] (longueur de liaison ≈ 1) */
var LAY = {
  H2:{a:[["H",-.5,0],["H",.5,0]], b:[[0,1,1]]},
  O2:{a:[["O",-.6,0],["O",.6,0]], b:[[0,1,2]]},
  N2:{a:[["N",-.55,0],["N",.55,0]], b:[[0,1,3]]},
  Cl2:{a:[["Cl",-.7,0],["Cl",.7,0]], b:[[0,1,1]]},
  HCl:{a:[["H",-.6,0],["Cl",.6,0]], b:[[0,1,1]]},
  H2O:{a:[["H",-.85,.45],["H",.85,.45],["O",0,-.3]], b:[[0,2,1],[1,2,1]]},
  NH3:{a:[["N",0,0],["H",0,-1.05],["H",-.92,.55],["H",.92,.55]], b:[[0,1,1],[0,2,1],[0,3,1]]},
  CH4:{a:[["C",0,0],["H",-.8,-.8],["H",.8,-.8],["H",-.8,.8],["H",.8,.8]], b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
  CO2:{a:[["O",-1.25,0],["C",0,0],["O",1.25,0]], b:[[0,1,2],[1,2,2]]},
  AlCl3:{a:[["Al",0,0],["Cl",0,-1.25],["Cl",-1.08,.62],["Cl",1.08,.62]], b:[[0,1,1],[0,2,1],[0,3,1]]},
  Fe:{a:[["Fe",0,0]], b:[]}, Al:{a:[["Al",0,0]], b:[]}, Mg:{a:[["Mg",0,0]], b:[]}, S:{a:[["S",0,0]], b:[]},
  MgO:{a:[["Mg",-.55,0],["O",.55,0]], b:[]},
  FeS:{a:[["Fe",-.6,0],["S",.6,0]], b:[]}
};
var HEX = [[0,0],[1,0],[.5,.87],[-.5,.87],[-1,0],[-.5,-.87],[.5,-.87],[2,0],[1.5,.87],[1,1.73],[0,1.73],[-1,1.73],[-1.5,.87],[-2,0],[-1.5,-.87],[-1,-1.73],[0,-1.73],[1,-1.73],[1.5,-.87],[3,0],[2.5,.87],[2,1.73],[1.5,2.6],[.5,2.6],[-.5,2.6],[-1.5,2.6],[-2,1.73],[-2.5,.87],[-3,0],[-2.5,-.87]];
var CACHE = {};
function mol(f){
  if (CACHE[f]) return CACHE[f];
  var m;
  if (LAY[f]) m = {a:LAY[f].a.map(function(q){ return {el:q[0], x:q[1], y:q[2]}; }), b:LAY[f].b};
  else {   /* amas schématique : atomes lourds au centre, hydrogène autour */
    var l = atomsOf(f).sort(function(p, q){ return (p === "H") - (q === "H"); });
    m = {a:l.map(function(e, i){ return {el:e, x:HEX[i][0] * 0.9, y:HEX[i][1] * 0.9}; }), b:[], cluster:true};
  }
  var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  m.a.forEach(function(q){ var r = RAD[q.el]; x0 = Math.min(x0, q.x - r); x1 = Math.max(x1, q.x + r); y0 = Math.min(y0, q.y - r); y1 = Math.max(y1, q.y + r); });
  m.w = x1 - x0; m.h = y1 - y0; m.cx = (x0 + x1) / 2; m.cy = (y0 + y1) / 2;
  CACHE[f] = m; return m;
}
function atom(ctx, el, x, y, r, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, "#ffffffcc"); g.addColorStop(0.25, COL[el]); g.addColorStop(1, COL[el]);
  ctx.fillStyle = COL[el]; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}
function bond(ctx, x1, y1, x2, y2, order, w, alpha){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = "#13233a"; ctx.lineWidth = w; ctx.lineCap = "round";
  var offs = order === 1 ? [0] : order === 2 ? [-w * 1.1, w * 1.1] : [-w * 1.8, 0, w * 1.8];
  offs.forEach(function(o){ ctx.beginPath(); ctx.moveTo(x1 + nx * o, y1 + ny * o); ctx.lineTo(x2 + nx * o, y2 + ny * o); ctx.stroke(); });
  ctx.restore();
}
/* dessine une molécule centrée en (cx, cy), 1 unité = u pixels */
function drawMol(ctx, f, cx, cy, u, alpha){
  var m = mol(f);
  m.b.forEach(function(q){
    var A = m.a[q[0]], B = m.a[q[1]];
    bond(ctx, cx + (A.x - m.cx) * u, cy + (A.y - m.cy) * u, cx + (B.x - m.cx) * u, cy + (B.y - m.cy) * u, q[2], Math.max(1.2, u * 0.06), alpha == null ? 1 : alpha);
  });
  m.a.forEach(function(q){ atom(ctx, q.el, cx + (q.x - m.cx) * u, cy + (q.y - m.cy) * u, RAD[q.el] * u, alpha); });
}
function ease(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

/* ---------- 1. Équilibrer une équation : les atomes se recombinent ---------- */
var RX = [
  {nom:"Synthèse de l'eau", R:["H2","O2"], P:["H2O"], sol:[2,1,2]},
  {nom:"Synthèse de l'ammoniac (Haber–Bosch)", R:["N2","H2"], P:["NH3"], sol:[1,3,2]},
  {nom:"Combustion du méthane", R:["CH4","O2"], P:["CO2","H2O"], sol:[1,2,1,2]},
  {nom:"Combustion du propane", R:["C3H8","O2"], P:["CO2","H2O"], sol:[1,5,3,4]},
  {nom:"Rouille : oxydation du fer", R:["Fe","O2"], P:["Fe2O3"], sol:[4,3,2]},
  {nom:"Aluminium + acide chlorhydrique", R:["Al","HCl"], P:["AlCl3","H2"], sol:[2,6,2,3]},
  {nom:"Respiration : oxydation du glucose", R:["C6H12O6","O2"], P:["CO2","H2O"], sol:[1,6,6,6]}
];
SFA.sim({
  id:"uc-L01-equilibrer", ch:"L01", tag:"Stœchiométrie",
  titre:"Équilibrer une équation : les atomes se recombinent",
  resume:"Choisis les coefficients : les molécules s'alignent, les atomes se comptent, puis se recombinent en produits.",
  but:"Choisis une réaction, règle le coefficient de chaque espèce et regarde le décompte des atomes à gauche et à droite. Quand l'équation est équilibrée, lance l'animation : chaque atome des réactifs se retrouve dans un produit.",
  aRetenir:"Une équation équilibrée conserve chaque élément : le nombre d'atomes de chaque espèce est le même à gauche et à droite (donc la masse aussi). On ne modifie que les <b>coefficients</b>, jamais les indices d'une formule. On cherche les plus petits entiers.",
  piege:"Changer un indice (écrire H₂O₂ au lieu de H₂O) change la substance : on n'équilibre qu'avec les coefficients. Et 4 H₂ + 2 O₂ → 4 H₂O est équilibrée mais pas simplifiée : divise par 2.",
  build:function(k, S){
    var c = k.canvas(430);
    var P = S.draw.palette;
    var st = {t:0, run:false, rx:RX[0], co:[1,1,1], pos:null};
    var sel = k.select("Réaction", RX.map(function(r, i){ return [i, r.nom]; }), 0, function(v){ st.rx = RX[+v]; st.co = st.rx.R.concat(st.rx.P).map(function(){ return 1; }); build(); stop(); });
    var sl = [];
    var box = document.createElement("div"); box.className = "ctl"; box.style.display = "contents";
    function build(){
      /* reconstruit les curseurs des coefficients */
      sl.forEach(function(s){ var d = s.el.closest(".ctl"); if (d) d.remove(); }); sl = [];
      var all = st.rx.R.concat(st.rx.P);
      all.forEach(function(f, i){
        var s = k.slider("Coefficient de " + sub(f), 0, 9, 1, st.co[i], "", function(v){ st.co[i] = v; stop(); });
        sl.push(s);
      });
      /* garde les contrôles dans l'ordre : sélecteur, curseurs, boutons, lectures */
      var btns = k.ctrl.querySelector(".btns"), ro = k.ctrl.querySelector(".read"), nn = k.ctrl.querySelector(".note");
      [btns, ro, nn].forEach(function(e){ if (e) k.ctrl.appendChild(e); });
    }
    function stop(){ st.t = 0; st.run = false; lp.pause(); k.redraw(); }
    var lp = k.loop(function(dt){
      st.t += dt / 3.2;
      if (st.t >= 1){ st.t = 1; lp.pause(); st.run = false; }
      k.redraw();
    });
    k.button("Recombiner les atomes ▶", function(){
      var e = eqState();
      if (!e.ok){ k.redraw(); return; }
      st.t = 0; st.run = true; lp.play();
    }, true);
    k.button("Équilibrer pour moi", function(){ st.co = st.rx.sol.slice(); sl.forEach(function(s, i){ s.set(st.co[i]); }); stop(); });
    k.button("Remettre à 1", function(){ st.co = st.co.map(function(){ return 1; }); sl.forEach(function(s){ s.set(1); }); stop(); });
    var ro = k.readouts(["Atomes à gauche", "Atomes à droite", "Masse à gauche", "Masse à droite"]);
    var nt = k.note("", "ok");
    build();
    function eqState(){
      var rx = st.rx, nR = rx.R.length, L = {}, Rr = {}, mL = 0, mR = 0, zero = false;
      rx.R.forEach(function(f, i){ var p = parse(f), c = st.co[i]; if (!c) zero = true; Object.keys(p).forEach(function(e){ L[e] = (L[e] || 0) + c * p[e]; }); mL += c * molarMass(f); });
      rx.P.forEach(function(f, i){ var p = parse(f), c = st.co[nR + i]; if (!c) zero = true; Object.keys(p).forEach(function(e){ Rr[e] = (Rr[e] || 0) + c * p[e]; }); mR += c * molarMass(f); });
      var els = Object.keys(L), ok = !zero;
      els.forEach(function(e){ if (L[e] !== (Rr[e] || 0)) ok = false; });
      var g = 0; st.co.forEach(function(v){ g = gcd(g, v); });
      return {L:L, R:Rr, els:els, ok:ok, mL:mL, mR:mR, zero:zero, simple:g <= 1};
    }
    /* disposition des copies de molécules d'un côté */
    function layout(list, coefs, x0, x1, y0, y1){
      var out = [], n = list.length, bh = (y1 - y0) / n;
      list.forEach(function(f, i){
        var cnt = coefs[i], by0 = y0 + i * bh, w = x1 - x0 - 34, m = mol(f), asp = m.w / m.h, s;
        for (s = 90; s >= 14; s -= 2){
          var cols = Math.max(1, Math.floor(w / s)), rows = Math.ceil(Math.max(cnt, 1) / cols);
          if (rows * s <= bh - 8) break;
        }
        var cols2 = Math.max(1, Math.floor(w / s));
        for (var j = 0; j < cnt; j++){
          var r = Math.floor(j / cols2), q = j % cols2, nrow = Math.min(cols2, cnt - r * cols2);
          var ox = x0 + 34 + (w - nrow * s) / 2;
          out.push({f:f, x:ox + q * s + s / 2, y:by0 + 4 + r * s + s / 2, u:s / Math.max(m.w, m.h) * 0.82, gi:i});
        }
        out.push({label:true, f:f, c:cnt, x:x0 + 14, y:by0 + bh / 2, gi:i});
      });
      return out;
    }
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, rx = st.rx, nR = rx.R.length, e = eqState();
      c.clear();
      var tabH = 74, areaH = H - tabH - 8, lx1 = W * 0.44, rx0 = W * 0.56;
      /* panneaux */
      ctx.fillStyle = "#f6f8fb"; ctx.fillRect(4, 4, lx1 - 4, areaH); ctx.fillRect(rx0, 4, W - rx0 - 4, areaH);
      S.draw.text(c, "Réactifs", 12, 14, {size:11, color:P.grey, align:"left"});
      S.draw.text(c, "Produits", rx0 + 8, 14, {size:11, color:P.grey, align:"left"});
      S.draw.arrow(c, lx1 + 8, areaH / 2, rx0 - 8, areaH / 2, P.ink, 3);
      var Ls = layout(rx.R, st.co.slice(0, nR), 4, lx1, 22, areaH), Rs = layout(rx.P, st.co.slice(nR), rx0, W - 4, 22, areaH);
      var t = st.t;
      if (t <= 0.001 || !e.ok){
        [Ls, Rs].forEach(function(arr){ arr.forEach(function(q){
          if (q.label){ S.draw.text(c, (q.c ? q.c + " " : "0 ") + sub(q.f), q.x, q.y, {size:13, color:q.c ? P.ink : P.red, align:"left"}); ctx.save(); ctx.restore(); return; }
          drawMol(ctx, q.f, q.x, q.y, q.u, 1);
        }); });
        /* l'étiquette doit rester dans le panneau : on la remonte au-dessus des copies si trop large */
      } else {
        /* animation : atomes réactifs → produits (même élément) */
        var ra = [], pa = [];
        Ls.forEach(function(q){ if (q.label) return; var m = mol(q.f); m.a.forEach(function(a, i){ ra.push({el:a.el, x:q.x + (a.x - m.cx) * q.u, y:q.y + (a.y - m.cy) * q.u, r:RAD[a.el] * q.u}); }); });
        Rs.forEach(function(q){ if (q.label) return; var m = mol(q.f); m.a.forEach(function(a){ pa.push({el:a.el, x:q.x + (a.x - m.cx) * q.u, y:q.y + (a.y - m.cy) * q.u, r:RAD[a.el] * q.u}); }); });
        var used = {}, pairs = [];
        ra.forEach(function(a, i){
          for (var j = 0; j < pa.length; j++) if (!used[j] && pa[j].el === a.el){ used[j] = 1; pairs.push([a, pa[j], i]); break; }
        });
        var midx = (lx1 + rx0) / 2, midy = areaH / 2;
        var a1 = 1 - ease(t / 0.2), a2 = ease((t - 0.8) / 0.2);
        /* liaisons des réactifs (qui s'effacent) puis des produits (qui apparaissent) */
        Ls.forEach(function(q){ if (q.label) return; var m = mol(q.f), u = q.u; m.b.forEach(function(b){ var A = m.a[b[0]], B = m.a[b[1]]; var ax = q.x + (A.x - m.cx) * u, ay = q.y + (A.y - m.cy) * u, bx = q.x + (B.x - m.cx) * u, by = q.y + (B.y - m.cy) * u; var P0 = pairs.filter(function(pr){ return pr[0].x === ax && pr[0].y === ay; })[0]; if (t < 0.2) bond(ctx, ax, ay, bx, by, b[2], Math.max(1.2, u * .06), a1); }); });
        Rs.forEach(function(q){ if (q.label) return; var m = mol(q.f), u = q.u; if (a2 > 0) m.b.forEach(function(b){ var A = m.a[b[0]], B = m.a[b[1]]; bond(ctx, q.x + (A.x - m.cx) * u, q.y + (A.y - m.cy) * u, q.x + (B.x - m.cx) * u, q.y + (B.y - m.cy) * u, b[2], Math.max(1.2, u * .06), a2); }); });
        pairs.forEach(function(pr, i){
          var a = pr[0], b = pr[1], h = Math.sin(i * 12.9898) * 43758.5453; h = h - Math.floor(h);
          var h2 = Math.sin(i * 78.233) * 12345.678; h2 = h2 - Math.floor(h2);
          var mx = midx + (h - 0.5) * (rx0 - lx1 + 70), my = midy + (h2 - 0.5) * (areaH * 0.7);
          var x, y;
          if (t < 0.45){ var q = ease(t / 0.45); x = a.x + (mx - a.x) * q; y = a.y + (my - a.y) * q; }
          else if (t < 0.6){ x = mx + Math.sin(t * 40 + i) * 4; y = my + Math.cos(t * 37 + i) * 4; }
          else { var q2 = ease((t - 0.6) / 0.4); x = mx + (b.x - mx) * q2; y = my + (b.y - my) * q2; }
          if (t >= 0.45 && t < 0.6){ x += 0; }
          atom(ctx, a.el, x, y, a.r, 1);
        });
        Ls.concat(Rs).forEach(function(q){ if (q.label) S.draw.text(c, q.c + " " + sub(q.f), q.x, q.y, {size:13, color:P.ink, align:"left"}); });
      }
      /* tableau de décompte */
      var ty = H - tabH + 2, n = e.els.length, cw = Math.min(110, (W - 20) / n);
      S.draw.text(c, "Décompte des atomes (gauche | droite)", 10, ty + 6, {size:11, color:P.grey, align:"left"});
      e.els.forEach(function(el, i){
        var x = 10 + i * cw, okc = e.L[el] === (e.R[el] || 0);
        ctx.fillStyle = okc ? "rgba(46,107,85,.12)" : "rgba(180,35,24,.12)"; ctx.fillRect(x, ty + 20, cw - 8, 44);
        atom(ctx, el, x + 16, ty + 42, 9, 1);
        S.draw.text(c, el, x + 16, ty + 42, {size: 9, color: el === "H" ? P.ink : "#fff"});
        S.draw.text(c, e.L[el] + " | " + (e.R[el] || 0), x + 34, ty + 36, {size:13, color:okc ? P.green : P.red, align:"left"});
        S.draw.text(c, okc ? "équilibré" : (e.L[el] > (e.R[el] || 0) ? "trop à gauche" : "trop à droite"), x + 34, ty + 53, {size:10, color:okc ? P.green : P.red, align:"left", weight:600});
      });
      var tl = 0, tr = 0; e.els.forEach(function(el){ tl += e.L[el]; tr += (e.R[el] || 0); });
      ro.set(0, tl); ro.set(1, tr);
      ro.set(2, S.fmt(e.mL, 2) + " g/mol"); ro.set(3, S.fmt(e.mR, 2) + " g/mol");
      var eq = rx.R.map(function(f, i){ return (st.co[i] > 1 ? st.co[i] + " " : "") + sub(f); }).filter(function(s, i){ return st.co[i] > 0; }).join(" + ") + " → " + rx.P.map(function(f, i){ return (st.co[nR + i] > 1 ? st.co[nR + i] + " " : "") + sub(f); }).filter(function(s, i){ return st.co[nR + i] > 0; }).join(" + ");
      if (e.zero) nt.set("Un coefficient vaut 0 : l'espèce disparaît de l'équation. Mets au moins 1 pour chaque espèce.", "warn");
      else if (!e.ok) nt.set("<b>" + eq + "</b><br>Pas équilibrée : les éléments en rouge n'ont pas le même nombre d'atomes des deux côtés. Les masses ne sont pas égales non plus (" + S.fmt(e.mL, 2) + " ≠ " + S.fmt(e.mR, 2) + " g/mol).", "bad");
      else if (!e.simple) nt.set("<b>" + eq + "</b><br>Équilibrée, mais pas avec les plus petits coefficients entiers : divise-les tous par leur PGCD.", "warn");
      else nt.set("<b>" + eq + "</b><br>Équilibrée avec les plus petits coefficients entiers : chaque élément et la masse (" + S.fmt(e.mL, 2) + " g/mol) sont conservés. Lance « Recombiner les atomes ».", "ok");
    });
  }
});

/* ---------- 2. Réactif limitant : la balance et les molécules ---------- */
var LIM = [
  {nom:"Synthèse de l'ammoniac : N₂ + 3 H₂ → 2 NH₃", R:[["N2",1],["H2",3]], P:[["NH3",2]]},
  {nom:"Synthèse de l'eau : 2 H₂ + O₂ → 2 H₂O", R:[["H2",2],["O2",1]], P:[["H2O",2]]},
  {nom:"Combustion du méthane : CH₄ + 2 O₂ → CO₂ + 2 H₂O", R:[["CH4",1],["O2",2]], P:[["CO2",1],["H2O",2]]},
  {nom:"Combustion du magnésium : 2 Mg + O₂ → 2 MgO", R:[["Mg",2],["O2",1]], P:[["MgO",2]]},
  {nom:"Sulfure de fer : Fe + S → FeS", R:[["Fe",1],["S",1]], P:[["FeS",1]]}
];
SFA.sim({
  id:"uc-L01-reactif-limitant", ch:"L01", tag:"Stœchiométrie",
  titre:"Réactif limitant : la balance des « recettes »",
  resume:"Pèse deux réactifs : la balance montre lequel s'épuise le premier, et les molécules réagissent une à une.",
  but:"Règle les masses des deux réactifs. Pour chacun, la balance compare n/ν, le nombre de « recettes » complètes qu'il permet. Le plus petit est le réactif limitant. Lance la réaction pour voir les molécules se consommer, puis lis les masses finales et le rendement.",
  aRetenir:"Pour a A + b B → produits : n(A)/a et n(B)/b donnent l'avancement maximal ξ<sub>max</sub> de chaque réactif ; le <b>plus petit</b> désigne le réactif limitant. Produits : n = ν·ξ<sub>max</sub> ; excès restant : n − ν·ξ<sub>max</sub>. Rendement = quantité obtenue / quantité théorique.",
  piege:"Le réactif limitant n'est pas celui dont on a la plus petite masse (ni la plus petite quantité de matière) : il faut diviser par le coefficient stœchiométrique. 10 g de H₂ (≈ 5 mol) est en gros excès devant 10 g de N₂ (≈ 0,36 mol).",
  build:function(k, S){
    var c = k.canvas(420);
    var P = S.draw.palette;
    var st = {rx:LIM[0], t:0, parts:null};
    var sel = k.select("Réaction", LIM.map(function(r, i){ return [i, r.nom]; }), 0, function(v){ st.rx = LIM[+v]; reset(); });
    var mA = k.slider("Masse du réactif 1", 0.5, 60, 0.5, 10, "g", function(){ reset(); });
    var mB = k.slider("Masse du réactif 2", 0.5, 60, 0.5, 10, "g", function(){ reset(); });
    var eta = k.slider("Rendement réel", 40, 100, 1, 100, "%");
    var ro = k.readouts(["n(réactif 1)", "n(réactif 2)", "Réactif limitant", "Avancement ξ<sub>max</sub>", "Excès restant", "Produit obtenu"]);
    var nt = k.note("", "ok");
    function reset(){ st.t = 0; st.parts = null; lp.pause(); k.redraw(); }
    var lp = k.loop(function(dt){ st.t += dt; step(dt); k.redraw(); });
    k.button("Lancer la réaction ▶", function(){ reset(); st.started = true; init(); lp.play(); }, true);
    k.button("Réinitialiser", function(){ reset(); });
    function calc(){
      var rx = st.rx, n = [mA.value / molarMass(rx.R[0][0]), mB.value / molarMass(rx.R[1][0])];
      var xi = [n[0] / rx.R[0][1], n[1] / rx.R[1][1]], lim = xi[0] <= xi[1] ? 0 : 1;
      return {n:n, xi:xi, lim:lim, x:Math.min(xi[0], xi[1]), eq:Math.abs(xi[0] - xi[1]) < 1e-9};
    }
    /* particules : 1 particule = u mol (arrondi), la disposition est indicative */
    function init(){
      var rx = st.rx, cc = calc(), u = Math.max(cc.n[0], cc.n[1]) / 22;
      var cnt = [Math.max(1, Math.round(cc.n[0] / u)), Math.max(1, Math.round(cc.n[1] / u))];
      var ps = [];
      for (var i = 0; i < 2; i++) for (var j = 0; j < cnt[i]; j++) ps.push({sp:i, f:rx.R[i][0], x:Math.random(), y:Math.random(), vx:(Math.random() - .5) * .18, vy:(Math.random() - .5) * .18, state:"free"});
      var nev = Math.floor(Math.min(cnt[0] / rx.R[0][1], cnt[1] / rx.R[1][1])), npr = nev * rx.P.reduce(function(a, p){ return a + p[1]; }, 0);
      var cols = Math.max(1, Math.min(6, Math.ceil(Math.sqrt(Math.max(1, npr) * 1.5)))), rows = Math.max(1, Math.ceil(npr / cols));
      st.parts = {list:ps, cnt:cnt, products:[], timer:0, done:0, u:u, cols:cols, rows:rows};
    }
    function step(dt){
      var pp = st.parts; if (!pp) return; var rx = st.rx;
      pp.list.forEach(function(p){
        if (p.state === "free"){ p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < .04 || p.x > .96) p.vx *= -1; if (p.y < .06 || p.y > .94) p.vy *= -1; p.x = Math.max(.02, Math.min(.98, p.x)); p.y = Math.max(.02, Math.min(.98, p.y)); }
        else if (p.state === "move"){ p.k += dt / 0.9; var q = ease(p.k); p.x = p.x0 + (p.tx - p.x0) * q; p.y = p.y0 + (p.ty - p.y0) * q; if (p.k >= 1){ p.state = "gone"; } }
      });
      pp.products.forEach(function(p){ if (p.k < 1){ p.k += dt / 0.8; var q = ease(p.k); p.x = p.x0 + (p.tx - p.x0) * q; p.y = p.y0 + (p.ty - p.y0) * q; } });
      pp.timer += dt;
      if (pp.timer > 0.55){
        pp.timer = 0;
        var fa = pp.list.filter(function(p){ return p.sp === 0 && p.state === "free"; }), fb = pp.list.filter(function(p){ return p.sp === 1 && p.state === "free"; });
        var na = rx.R[0][1], nb = rx.R[1][1];
        if (fa.length >= na && fb.length >= nb){
          var cx = .5, cy = .5, i;
          for (i = 0; i < na; i++){ var p = fa[i]; p.state = "move"; p.k = 0; p.x0 = p.x; p.y0 = p.y; p.tx = cx; p.ty = cy; }
          for (i = 0; i < nb; i++){ var q = fb[i]; q.state = "move"; q.k = 0; q.x0 = q.x; q.y0 = q.y; q.tx = cx; q.ty = cy; }
          rx.P.forEach(function(pr){
            for (var j = 0; j < pr[1]; j++){
              var idx = pp.products.length;
              pp.products.push({f:pr[0], k:0, x0:cx, y0:cy, x:cx, y:cy, tx:((idx % pp.cols) + .5) / pp.cols, ty:(Math.floor(idx / pp.cols) + .5) / pp.rows});
            }
          });
          pp.done++;
        } else if (!pp.finished){ pp.finished = true; }
      }
    }
    c.pointer(function(){});
    k.draw(function(){
      var ctx = c.ctx, W = c.W, H = c.H, rx = st.rx, cc = calc(), eta_ = eta.value / 100;
      c.clear();
      var names = [rx.R[0][0], rx.R[1][0]];
      /* --- balance en haut --- */
      var cx = W / 2, py = 34, d = Math.max(-1, Math.min(1, (cc.xi[1] - cc.xi[0]) / Math.max(cc.xi[0], cc.xi[1]))) ;
      /* le plateau le plus « plein » est celui du réactif en excès : il descend */
      var ang = d * 0.22;   /* d>0 : réactif 2 en excès → plateau droit descend */
      var arm = Math.min(W * 0.34, 210), ay = py + 20;
      var lxL = cx - Math.cos(ang) * arm, lxR = cx + Math.cos(ang) * arm;
      var lyL = ay - Math.sin(ang) * arm, lyR = ay + Math.sin(ang) * arm;
      /* pied */
      ctx.fillStyle = "#c9d1dc"; ctx.beginPath(); ctx.moveTo(cx - 14, py + 112); ctx.lineTo(cx + 14, py + 112); ctx.lineTo(cx, ay); ctx.closePath(); ctx.fill();
      S.draw.line(c, cx - 26, py + 112, cx + 26, py + 112, "#8a95a3", 4);
      S.draw.line(c, lxL, lyL, lxR, lyR, P.ink, 5);
      S.draw.dot(c, cx, ay, 6, P.acc);
      [[lxL, lyL, 0], [lxR, lyR, 1]].forEach(function(q){
        var i = q[2], col = i === 0 ? P.acc : P.amber, lim = cc.lim === i && !cc.eq;
        S.draw.line(c, q[0], q[1], q[0], q[1] + 30, "#8a95a3", 1.5);
        ctx.fillStyle = col; ctx.globalAlpha = .13; ctx.fillRect(q[0] - 62, q[1] + 30, 124, 8); ctx.globalAlpha = 1;
        S.draw.line(c, q[0] - 62, q[1] + 30, q[0] + 62, q[1] + 30, col, 4);
        /* blocs « recettes » : n/ν arrondi à l'entier le plus proche en blocs pleins + fraction */
        var xi = cc.xi[i], unit = Math.max(cc.x / 4, Math.max(cc.xi[0], cc.xi[1]) / 14);
        var nb = Math.round(xi / unit);
        for (var b = 0; b < nb && b < 16; b++){
          var bx = q[0] - 58 + (b % 8) * 14.5, by = q[1] + 28 - 12 - Math.floor(b / 8) * 13;
          ctx.fillStyle = col; ctx.globalAlpha = lim ? 1 : .7; ctx.fillRect(bx, by, 13, 11); ctx.globalAlpha = 1;
        }
        S.draw.text(c, sub(names[i]) + " : ξ = " + S.fmt(xi, xi < 1 ? 3 : 2) + " mol", q[0], q[1] + 55, {size:12, color:col});
        S.draw.text(c, "n/ν = " + S.fmt(cc.n[i], 3) + " / " + rx.R[i][1], q[0], q[1] + 71, {size:10.5, color:P.grey, weight:600});
        if (lim) S.draw.text(c, "LIMITANT", q[0], q[1] + 87, {size:11, color:P.red});
      });
      S.draw.text(c, cc.eq ? "Proportions stœchiométriques : aucun excès" : "Le plateau qui descend contient le réactif en excès", cx, 12, {size:11.5, color:P.grey, weight:600});
      /* --- boîtes de particules --- */
      var by0 = py + 142, bhh = H - by0 - 8, bw = (W - 40) / 2;
      var bx0 = 10, bx1 = 30 + bw;
      ctx.fillStyle = "#f6f8fb"; ctx.fillRect(bx0, by0, bw, bhh); ctx.fillRect(bx1, by0, bw, bhh);
      S.draw.text(c, "Avant → pendant", bx0 + 6, by0 + 9, {size:10.5, color:P.grey, align:"left"});
      S.draw.text(c, "Produits formés", bx1 + 6, by0 + 9, {size:10.5, color:P.grey, align:"left"});
      S.draw.arrow(c, bx0 + bw + 2, by0 + bhh / 2, bx1 - 2, by0 + bhh / 2, P.ink, 2);
      var pp = st.parts, us = 17;
      if (!pp){
        /* aperçu statique de l'état initial */
        var u0 = Math.max(cc.n[0], cc.n[1]) / 22, c0 = [Math.max(1, Math.round(cc.n[0] / u0)), Math.max(1, Math.round(cc.n[1] / u0))];
        for (var i = 0; i < 2; i++) for (var j = 0; j < c0[i]; j++){
          var hx = Math.sin((i * 50 + j) * 12.9898) * 43758.5453, hy = Math.sin((i * 50 + j) * 78.233) * 12345.678; hx -= Math.floor(hx); hy -= Math.floor(hy);
          drawMol(ctx, names[i], bx0 + 20 + hx * (bw - 40), by0 + 22 + hy * (bhh - 36), us, 1);
        }
      } else {
        pp.list.forEach(function(p){ if (p.state === "gone") return; drawMol(ctx, p.f, bx0 + 20 + p.x * (bw - 40), by0 + 22 + p.y * (bhh - 36), us, 1); });
        pp.products.forEach(function(p){ drawMol(ctx, p.f, bx0 + 20 + p.x * (bw - 40) + (p.k >= 1 ? bw + 20 : p.k * (bw + 20)) * 1, by0 + 22 + p.y * (bhh - 36), us, 1); });
        var left = pp.list.filter(function(p){ return p.state === "free"; });
        if (pp.finished && st.t > 0) S.draw.text(c, "Terminé : " + left.length + " molécule(s) en excès", bx0 + 6, by0 + bhh - 8, {size:10.5, color:P.red, align:"left"});
      }
      S.draw.text(c, "1 molécule dessinée ≈ " + S.sci(Math.max(cc.n[0], cc.n[1]) / 22, 2) + " mol (schéma arrondi)", W - 10, H - 4, {size:9.5, color:P.grey, align:"right", weight:600});
      /* --- lectures --- */
      var r = rx.R, M0 = molarMass(r[0][0]), M1 = molarMass(r[1][0]), xmax = cc.x, exIdx = cc.eq ? -1 : 1 - cc.lim;
      ro.set(0, S.fmt(cc.n[0], 3) + " mol"); ro.set(1, S.fmt(cc.n[1], 3) + " mol");
      ro.set(2, cc.eq ? "aucun (mélange stœchiométrique)" : sub(names[cc.lim]));
      ro.set(3, S.fmt(xmax, 3) + " mol");
      var restTxt = "—";
      if (exIdx >= 0){ var nr = cc.n[exIdx] - rx.R[exIdx][1] * xmax; restTxt = S.fmt(nr, 3) + " mol (" + S.fmt(nr * molarMass(names[exIdx]), 2) + " g de " + sub(names[exIdx]) + ")"; }
      ro.set(4, restTxt);
      var ptxt = rx.P.map(function(p){ var nn = p[1] * xmax * eta_; return S.fmt(nn * molarMass(p[0]), 2) + " g de " + sub(p[0]) + " (" + S.fmt(nn, 3) + " mol)"; }).join(" + ");
      ro.set(5, ptxt);
      var theo = rx.P.map(function(p){ return p[1] * xmax * molarMass(p[0]); }).reduce(function(a, b){ return a + b; }, 0);
      nt.set("ξ<sub>max</sub> = min(" + S.fmt(cc.xi[0], 3) + " ; " + S.fmt(cc.xi[1], 3) + ") = " + S.fmt(xmax, 3) + " mol. Masse totale des réactifs " + S.fmt(mA.value + mB.value, 2) + " g ; produits théoriques " + S.fmt(theo, 2) + " g + excès " + S.fmt(exIdx >= 0 ? (cc.n[exIdx] - rx.R[exIdx][1] * xmax) * molarMass(names[exIdx]) : 0, 2) + " g = " + S.fmt(theo + (exIdx >= 0 ? (cc.n[exIdx] - rx.R[exIdx][1] * xmax) * molarMass(names[exIdx]) : 0), 2) + " g : la masse est conservée." + (eta.value < 100 ? " Avec un rendement de " + eta.value + " %, la masse de produit réellement isolée est plus faible." : ""), "ok");
    });
  }
});
})();
