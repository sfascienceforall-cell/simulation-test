/* Biologie BA1 · chapitre 1 : molécules du vivant et eau */

/* ---------- aides de dessin partagées par tous les chapitres de biologie (SFA.bio) ---------- */
(function(S){
  if (S.bio) return;
  var B = S.bio = {};
  function mix(h, f){ var n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function m(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); } return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")"; }
  B.mix = mix;
  /* notation scientifique en texte brut (exposants Unicode) pour le canevas */
  B.sci = function(x, d){ if (!isFinite(x) || x === 0) return S.fmt(x, d); var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    if (e >= -2 && e <= 4) return S.fmt(x, x < 10 ? 2 : 0); var sup = {"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
    return S.fmt(m, d == null ? 1 : d) + "·10" + String(e).split("").map(function(ch){ return sup[ch]; }).join(""); };
  /* fond doux dégradé (vertical) : bg(c, haut, bas) */
  B.bg = function(c, top, bot){ var g = c.ctx.createLinearGradient(0, 0, 0, c.H); g.addColorStop(0, top || "#f6f9fd"); g.addColorStop(1, bot || "#eaf1f9"); c.ctx.fillStyle = g; c.ctx.fillRect(0, 0, c.W, c.H); };
  /* bille ombrée (molécule, ion, atome) */
  B.ball = function(c, x, y, r, col, opt){ var ctx = c.ctx; opt = opt || {};
    var g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, mix(col, .6)); g.addColorStop(.55, col); g.addColorStop(1, mix(col, -.38));
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha = opt.alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore();
    if (opt.text) S.draw.text(c, opt.text, x, y + .5, {size: opt.size || Math.max(9, r * .95), color: opt.tcolor || "#fff", weight: 800}); };
  /* globule rouge biconcave vu de dessus/de profil : rbc(c, x, y, r, {mode:"disque"|"crenele"|"turgescent"|"lyse", col}) */
  B.rbc = function(c, x, y, r, opt){ var ctx = c.ctx; opt = opt || {}; var col = opt.col || "#d94a52", mode = opt.mode || "disque";
    ctx.save(); ctx.translate(x, y);
    if (mode === "crenele"){ var n = 16; ctx.beginPath(); for (var i = 0; i < n * 2; i++){ var a = i * Math.PI / n, rr = i % 2 ? r * .82 : r * 1.0; ctx.lineTo(rr * Math.cos(a), rr * Math.sin(a)); } ctx.closePath(); }
    else if (mode === "lyse"){ ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(217,74,82,.5)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.stroke(); ctx.restore(); return; }
    else { ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); }
    var g = ctx.createRadialGradient(0, 0, r * .05, 0, 0, r);
    if (mode === "disque"){ g.addColorStop(0, mix(col, .35)); g.addColorStop(.38, mix(col, .1)); g.addColorStop(.62, col); g.addColorStop(1, mix(col, -.3)); }
    else { g.addColorStop(0, mix(col, .45)); g.addColorStop(.7, col); g.addColorStop(1, mix(col, -.3)); }
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = mix(col, -.4); ctx.stroke();
    if (mode === "disque"){ ctx.beginPath(); ctx.arc(0, 0, r * .62, 0, 6.2832); ctx.strokeStyle = "rgba(120,20,30,.28)"; ctx.lineWidth = r * .1; ctx.stroke();
      var g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * .5); g2.addColorStop(0, "rgba(255,225,225,.75)"); g2.addColorStop(1, "rgba(255,225,225,0)"); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(0, 0, r * .5, 0, 6.2832); ctx.fill(); }
    ctx.restore(); };
  /* bicouche de phospholipides entre x0 et x1 centrée en y : membrane(c, x0, x1, y, {ep, gap}) */
  B.membrane = function(c, x0, x1, y, opt){ opt = opt || {}; var ctx = c.ctx, ep = opt.ep || 22, step = opt.step || 13, skip = opt.skip || [];
    ctx.save(); for (var x = x0 + step / 2; x < x1; x += step){
      var out = skip.some(function(s){ return x > s[0] && x < s[1]; }); if (out) continue;
      [[-1, y - ep / 2], [1, y + ep / 2]].forEach(function(p){ var hy = p[1], ty = hy + (p[0] < 0 ? 1 : -1) * ep * .55;
        ctx.strokeStyle = "#c7a96b"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 2, hy); ctx.lineTo(x - 2.5, ty); ctx.moveTo(x + 2, hy); ctx.lineTo(x + 2.5, ty); ctx.stroke();
        B.ball(c, x, hy, 4.2, "#e8b94a"); }); }
    ctx.restore(); };
  /* chromosome à 1 ou 2 chromatides : chrom(c, x, y, L, col, {dbl, angle, w}) ; dbl = 2 chromatides jointes au centromère (X) */
  B.chrom = function(c, x, y, L, col, opt){ opt = opt || {}; var ctx = c.ctx, w = opt.w || Math.max(3, L * .16); ctx.save(); ctx.translate(x, y); ctx.rotate(opt.angle || 0); ctx.lineCap = "round";
    function arm(sg){ ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-sg * L * .17, -L / 2); ctx.quadraticCurveTo(0, 0, sg * L * .17, L / 2); ctx.stroke(); }
    if (opt.dbl){ arm(1); arm(-1); } else { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, -L / 2); ctx.lineTo(0, L / 2); ctx.stroke(); }
    ctx.fillStyle = mix(col, -.35); ctx.beginPath(); ctx.arc(0, 0, w * .62, 0, 6.2832); ctx.fill(); ctx.restore(); };
  /* flèche courbe fine (flux) */
  B.flow = function(c, x1, y1, x2, y2, col, w){ S.draw.arrow(c, x1, y1, x2, y2, col || "#7b8694", w || 2); };
  /* bandeau de défi : état "ok" ou en cours, dessiné en haut du canevas */
  /* AIDES-REFONTE-BEGIN */
  /* découpe du canevas : dessin (d) + graphique (g) ; côte à côte si le canevas est large, sinon l'un sous l'autre */
  B.split = function(c, frac, wideMin){ var W = c.W, H = c.H, f = frac || .56;
    if (W >= (wideMin || 700)){ var dw = Math.round(W * f); return {wide:true, d:{x:0, y:0, w:dw, h:H}, g:{x:dw, y:0, w:W - dw, h:H}}; }
    var dh = Math.round(H * f); return {wide:false, d:{x:0, y:0, w:W, h:dh}, g:{x:0, y:dh, w:W, h:H - dh}}; };
  /* repère dans un rectangle R = {x,y,w,h} du canevas (même API que S.draw.axes, coordonnées absolues) */
  B.axes = function(c, R, opt){ var ctx = c.ctx; opt = opt || {};
    if (opt.panel !== false) S.draw.panel(c, R.x + 3, R.y + 3, R.w - 6, R.h - 6, {shadow:false});
    ctx.save(); ctx.translate(R.x, R.y); var a = opt.frame ? B.frameAxes({ctx:ctx, W:R.w, H:R.h}, opt) : S.draw.axes({ctx:ctx, W:R.w, H:R.h}, opt); ctx.restore();
    var ax = {x0:a.x0, x1:a.x1, y0:a.y0, y1:a.y1, L:a.L + R.x, R:a.R + R.x, T:a.T + R.y, B:a.B + R.y};
    ax.X = function(x){ return R.x + a.X(x); }; ax.Y = function(y){ return R.y + a.Y(y); };
    ax.ix = function(px){ return a.ix(px - R.x); }; ax.iy = function(py){ return a.iy(py - R.y); };
    ax.has = function(p, m){ m = m == null ? 14 : m; return p.x >= ax.L - m && p.x <= ax.R + m && p.y >= ax.T - m && p.y <= ax.B + m; };
    ax.cx = function(x){ return Math.max(ax.L, Math.min(ax.R, ax.X(x))); }; ax.cy = function(y){ return Math.max(ax.T, Math.min(ax.B, ax.Y(y))); };
    return ax; };
  /* courbe donnée par une liste de points [[x,y],…] dans un repère ax (découpée au cadre) */
  B.poly = function(c, ax, pts, col, w, dash){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); ctx.clip();
    ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.lineJoin = "round"; ctx.setLineDash(dash || []); ctx.beginPath();
    pts.forEach(function(p, i){ var x = ax.X(p[0]), y = Math.max(-2 * c.H, Math.min(3 * c.H, ax.Y(p[1]))); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore(); };
  /* défi chiffré : make(n) → objet défi {txt}, test(défi) → {ok, info} ; bouton « Nouveau défi » ; premier défi lancé d'office */
  B.defi = function(k, make, test, label){ var st = {cur:null, ok:false, won:0, n:0};
    st.next = function(){ st.cur = make(st.n++); st.ok = false; };
    st.check = function(){ if (!st.cur) return null; var r = test(st.cur) || {}; if (r.ok && !st.ok){ st.ok = true; st.won++; } r.ok = st.ok || r.ok; return r; };
    st.banner = function(c, y){ if (!st.cur) return; var r = st.check(); B.wrapGoal(c, (r.ok ? "✓ Réussi : " : "◎ Défi : ") + st.cur.txt, r.ok, y); return r; };
    st.btn = k.button(label || "Nouveau défi", function(){ st.next(); });
    st.next(); return st; };
  /* petit générateur pseudo-aléatoire reproductible */
  B.rng = function(seed){ var s = seed || 7; return function(){ s = (s * 16807) % 2147483647; return s / 2147483647; }; };
  /* ion / molécule étiquetée */
  B.ion = function(c, x, y, r, col, txt, a){ B.ball(c, x, y, r, col, {text:txt, size:Math.max(6.5, r * .95), alpha:a}); };
  /* afficheur à aiguille (voltmètre) : dial(c, x, y, r, v, vmin, vmax, {unit, ticks, label, zones:[[a,b,col]]}) */
  B.dial = function(c, x, y, r, v, v0, v1, o){ var ctx = c.ctx; o = o || {}; var a0 = Math.PI * 1.1, a1 = Math.PI * 1.9;
    function A(u){ return a0 + (Math.max(v0, Math.min(v1, u)) - v0) / (v1 - v0) * (a1 - a0); }
    ctx.save(); S.draw.panel(c, x - r - 10, y - r - 12, 2 * r + 20, r + 40, {radius:10});
    (o.zones || []).forEach(function(z){ ctx.strokeStyle = z[2]; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, r - 4, A(z[0]), A(z[1])); ctx.stroke(); });
    ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke();
    (o.ticks || []).forEach(function(t){ var a = A(t); ctx.beginPath(); ctx.moveTo(x + (r - 2) * Math.cos(a), y + (r - 2) * Math.sin(a)); ctx.lineTo(x + (r + 3) * Math.cos(a), y + (r + 3) * Math.sin(a)); ctx.stroke();
      S.draw.text(c, S.fmt(t, 0), x + (r + 10) * Math.cos(a), y + (r + 10) * Math.sin(a), {size:8.5, color:"#7b8694", weight:600}); });
    var a = A(v); ctx.strokeStyle = "#c0321d"; ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r - 6) * Math.cos(a), y + (r - 6) * Math.sin(a)); ctx.stroke();
    ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 6.2832); ctx.fill(); ctx.restore();
    S.draw.text(c, (o.fmt ? o.fmt(v) : S.fmt(v, 0)) + (o.unit ? " " + o.unit : ""), x, y + 14, {size:12, color:"#0f1b2d", mono:true, weight:600});
    if (o.label) S.draw.text(c, o.label, x, y - r - 3, {size:9.5, color:"#5f6b7a"}); };
  /* couleur d'un indicateur universel selon le pH */
  B.phColor = function(ph){ var st = [[3,"#d62f2f"],[4.5,"#ee7a2a"],[5.5,"#f2b632"],[6.5,"#d7d23c"],[7.2,"#5cae4a"],[8,"#2f9e86"],[9,"#2f6fbf"],[10.5,"#5a3fa8"]];
    if (ph <= st[0][0]) return st[0][1]; for (var i = 1; i < st.length; i++) if (ph <= st[i][0]){ var u = (ph - st[i - 1][0]) / (st[i][0] - st[i - 1][0]);
      var p = parseInt(st[i - 1][1].slice(1), 16), q = parseInt(st[i][1].slice(1), 16); function ch(n, s){ return (n >> s) & 255; }
      return "rgb(" + [16, 8, 0].map(function(s){ return Math.round(ch(p, s) + (ch(q, s) - ch(p, s)) * u); }).join(",") + ")"; } return st[st.length - 1][1]; };
  /* bandeau de défi sur une ou deux lignes (coupé aux mots) */
  B.wrapGoal = function(c, txt, ok, y){ var ctx = c.ctx, col = ok ? S.draw.palette.green : S.draw.palette.amber, maxW = c.W - 26, words = txt.split(" "), lines = [""];
    ctx.save(); ctx.font = "800 11px Mulish, system-ui, sans-serif";
    words.forEach(function(w){ var tr = lines[lines.length - 1] ? lines[lines.length - 1] + " " + w : w; if (ctx.measureText(tr).width > maxW && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = tr; });
    ctx.restore(); y = y == null ? 13 : y;
    lines.slice(0, 3).forEach(function(l, i){ S.draw.label(c, l, c.W / 2, y + i * 17, {color:col, size:11}); }); return y + lines.length * 17; };
  /* nombre à décimales fixes (virgule belge, signe −) : 7,40 */
  B.f = function(x, d){ if (!isFinite(x)) return "—"; var s = Math.abs(x).toFixed(d).replace(".", ","); return (x < 0 && +Math.abs(x).toFixed(d) !== 0 ? "−" : "") + s; };
  /* repère « cadre » : axes toujours à gauche et en bas (utile quand 0 est au milieu de l'échelle) */
  B.frameAxes = function(c, o){ var ctx = c.ctx, L = o.l || 46, Rr = o.r || 16, T = o.t || 16, Bm = o.b || 34, W = c.W, H = c.H;
    var a = {x0:o.x0, x1:o.x1, y0:o.y0, y1:o.y1, L:L, R:W - Rr, T:T, B:H - Bm};
    a.X = function(x){ return L + (x - o.x0) / (o.x1 - o.x0) * (W - L - Rr); }; a.Y = function(y){ return H - Bm - (y - o.y0) / (o.y1 - o.y0) * (H - T - Bm); };
    a.ix = function(px){ return o.x0 + (px - L) / (W - L - Rr) * (o.x1 - o.x0); }; a.iy = function(py){ return o.y0 + (H - Bm - py) / (H - T - Bm) * (o.y1 - o.y0); };
    var sx = o.stepX || (o.x1 - o.x0) / 5, sy = o.stepY || (o.y1 - o.y0) / 5, v;
    ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = "#eef1f5"; ctx.beginPath();
    for (v = Math.ceil(o.x0 / sx - 1e-9) * sx; v <= o.x1 + 1e-9; v += sx){ ctx.moveTo(Math.round(a.X(v)) + .5, T); ctx.lineTo(Math.round(a.X(v)) + .5, H - Bm); }
    for (v = Math.ceil(o.y0 / sy - 1e-9) * sy; v <= o.y1 + 1e-9; v += sy){ ctx.moveTo(L, Math.round(a.Y(v)) + .5); ctx.lineTo(W - Rr, Math.round(a.Y(v)) + .5); }
    ctx.stroke(); ctx.strokeStyle = "#a3adba"; ctx.lineWidth = 1.25; ctx.beginPath(); ctx.moveTo(L + .5, T); ctx.lineTo(L + .5, H - Bm + .5); ctx.lineTo(W - Rr, H - Bm + .5); ctx.stroke();
    ctx.font = "600 10.5px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#7b8694"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var lastX = -1e9; for (v = Math.ceil(o.x0 / sx - 1e-9) * sx; v <= o.x1 + 1e-9; v += sx){ var lx = o.fx ? o.fx(v) : S.fmt(Math.abs(v) < 1e-9 ? 0 : v, 3), px = a.X(v), w = ctx.measureText(lx).width; if (px - w / 2 < lastX + 6) continue; ctx.fillText(lx, px, H - Bm + 5); lastX = px + w / 2; }
    ctx.textAlign = "right"; ctx.textBaseline = "middle"; for (v = Math.ceil(o.y0 / sy - 1e-9) * sy; v <= o.y1 + 1e-9; v += sy) ctx.fillText(o.fy ? o.fy(v) : S.fmt(Math.abs(v) < 1e-9 ? 0 : v, 3), L - 5, a.Y(v));
    ctx.font = "700 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#2c3a4e";
    if (o.xl){ ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.xl, W - Rr, H - Bm + 19); }
    if (o.yl){ ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(o.yl, Math.max(4, L - 30), T - 3); }
    ctx.restore(); return a; };
  /* AIDES-REFONTE-END */
  B.goal = function(c, txt, ok, y){ var col = ok ? S.draw.palette.green : S.draw.palette.amber; S.draw.label(c, (ok ? "✓ " : "◎ ") + txt, c.W / 2, y == null ? 16 : y, {color: col, size: 12}); };
})(window.SFA);

SFA.sim({
  id:"ub-c01-condensation", ch:"c01", tag:"Macromolécules",
  titre:"Condensation et hydrolyse : compter les liaisons et l'eau",
  resume:"Assemble n monomères : combien de liaisons, combien d'eau libérée, quelle masse ?",
  but:"Choisis un type de monomère, ajoute ou retire des monomères avec les boutons (ou le curseur) et regarde l'eau partir ou revenir. Relève le défi : retrouver n à partir de la masse du polymère.",
  aRetenir:"Une chaîne linéaire de n monomères contient n − 1 liaisons ; sa formation libère n − 1 molécules d'eau (condensation) et son hydrolyse complète en consomme n − 1. Masse du polymère = n·M − (n − 1)·18,02. Une chaîne cyclique a n liaisons.",
  piege:"« n monomères, n liaisons » est faux pour une chaîne linéaire (n − 1), mais juste pour une chaîne circulaire (plasmide, peptide cyclique).",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(0,{ratio:.62}); if(c.H<250){}
    var tp=k.seg("Monomère",[["aa","Acide aminé"],["glc","Glucose"],["nuc","Nucléotide"]],"aa");
    var n=k.slider("Nombre de monomères n",2,300,1,8,"");
    var cy=k.toggle("Chaîne cyclique (circulaire)",false);
    var ro=k.readouts(["Liaisons formées","H₂O libérées","Masse du polymère (g/mol)","Somme des monomères libres (g/mol)"]);
    var M={aa:128,glc:180.16,nuc:327}, W2=18.02;
    var NM={aa:["Acide aminé","liaison peptidique",P.acc,128],glc:["Glucose","liaison glycosidique",P.amber,180.16],nuc:["Nucléotide","liaison phosphodiester",P.green,327]};
    var drops=[], lastN=n.value, lastT=tp.value, lastC=cy.value, goal=null, nt=k.note("",""), pts=[];
    function layout(m,cyc){
      var W=c.W,H=c.H,out=[],i;
      if(cyc){ var cx=W/2, cyy=H/2+4, R=Math.min(W*.42,H/2-36); for(i=0;i<m;i++){var a=2*Math.PI*i/m-Math.PI/2; out.push([cx+R*Math.cos(a),cyy+R*Math.sin(a)]);} }
      else { var per=Math.max(4,Math.min(12,Math.floor((W-40)/38))), rows=Math.ceil(m/per), gx=(W-60)/(Math.max(per,2)-1), gy=Math.min(64,(H-110)/Math.max(1,rows-1||1));
        for(i=0;i<m;i++){var r=Math.floor(i/per), q=i%per; if(r%2) q=per-1-q; out.push([30+q*gx,56+r*gy+(rows===1?(H-110)/2-10:0)]);} }
      return out;
    }
    function bead(x,y,r,t,col,i){
      var ctx=c.ctx;
      if(t==="aa"){ B.ball(c,x,y,r,col); S.draw.text(c,"R"+(i%5===0?"":""),x,y,{size:r*.9,color:"#fff"}); }
      else if(t==="glc"){ ctx.save(); ctx.beginPath(); for(var j=0;j<6;j++){var a=j*Math.PI/3+Math.PI/6; ctx.lineTo(x+r*1.08*Math.cos(a),y+r*1.08*Math.sin(a));} ctx.closePath();
        var g=ctx.createLinearGradient(x,y-r,x,y+r); g.addColorStop(0,B.mix(col,.5)); g.addColorStop(1,B.mix(col,-.25)); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle=B.mix(col,-.4); ctx.lineWidth=1.5; ctx.stroke(); ctx.restore(); S.draw.text(c,"O",x,y,{size:r*.8,color:"#fff"}); }
      else { ctx.save(); ctx.fillStyle=B.mix(col,.1); ctx.strokeStyle=B.mix(col,-.4); ctx.lineWidth=1.5; B.ball(c,x,y,r*.55,P.violet); S.draw.rrect(c,x-r*.85,y-r*1.05,r*.9,r*.9,3); ctx.fill(); ctx.stroke(); ctx.restore(); B.ball(c,x+r*.7,y+r*.6,r*.42,P.amber); }
    }
    function spawn(kind,x,y){ for(var q=0;q<3;q++) drops.push({x:x,y:y,t:0,kind:kind,dx:(Math.random()-.5)*34,dy:-26-Math.random()*20}); }
    function sync(){
      var m=Math.min(n.value,24), p=layout(m,cy.value), N=n.value;
      if(N!==lastN && tp.value===lastT && cy.value===lastC){
        var step=Math.min(Math.abs(N-lastN),4), kind=N>lastN?"out":"in", i;
        for(i=0;i<step;i++){ var b=Math.min(m-1, m-1-i); if(b>0&&p[b]&&p[b-1]) spawn(kind,(p[b][0]+p[b-1][0])/2,(p[b][1]+p[b-1][1])/2); }
      }
      lastN=N; lastT=tp.value; lastC=cy.value;
      if(goal){ var done=(N===goal.n&&cy.value===goal.cyc&&tp.value===goal.t); goal.done=done; }
    }
    function R(){
      var ctx=c.ctx; c.clear(); B.bg(c,"#f7fafc","#eaf2f8");
      var N=n.value, cyc=cy.value, t=tp.value, col=NM[t][2], m=Math.min(N,24);
      var bonds=cyc?N:N-1, mass=N*M[t]-bonds*W2;
      pts=layout(m,cyc); var r=Math.max(9,Math.min(15,c.W/34));
      var nb=cyc?m:m-1;
      for(var b=0;b<nb;b++){ var p1=pts[b], p2=pts[(b+1)%m]; ctx.strokeStyle="#8a95a3"; ctx.lineWidth=4; ctx.lineCap="round"; ctx.beginPath(); ctx.moveTo(p1[0],p1[1]); ctx.lineTo(p2[0],p2[1]); ctx.stroke();
        var mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2; ctx.fillStyle=P.teal; ctx.beginPath(); ctx.arc(mx,my,3.2,0,7); ctx.fill(); }
      pts.forEach(function(p,i){ bead(p[0],p[1],r,t,col,i); });
      if(!cyc&&pts.length){ S.draw.label(c,t==="aa"?"NH₂":t==="glc"?"extrémité réductrice":"5′",pts[0][0],pts[0][1]-r-10,{color:P.grey,size:10});
        var l=pts[m-1]; S.draw.label(c,t==="aa"?"COOH":t==="glc"?"extrémité non réd.":"3′",l[0],l[1]+r+11,{color:P.grey,size:10}); }
      /* gouttes d'eau */
      drops.forEach(function(d){ var u=d.t, x,y,a;
        if(d.kind==="out"){ x=d.x+d.dx*u; y=d.y+d.dy*u+34*u*u; a=1-u; } else { x=d.x+d.dx*(1-u); y=d.y+(d.dy)*(1-u)+34*(1-u)*(1-u); a=u<.2?u*5:1; }
        ctx.save(); ctx.globalAlpha=Math.max(0,a); ctx.fillStyle="#4aa8e0"; ctx.beginPath(); ctx.arc(x,y,4.2,0,7); ctx.fill(); ctx.restore(); S.draw.text(c,"H₂O",x+13,y,{size:9,color:P.teal}); });
      S.draw.text(c,NM[t][0]+" · "+NM[t][1]+(cyc?" · chaîne cyclique":""),c.W/2,16,{size:12,color:P.ink});
      var foot=N>24?m+" monomères dessinés sur "+N:"● vert = liaison formée, une H₂O libérée par liaison";
      S.draw.text(c,foot,c.W/2,c.H-12,{size:11,color:P.teal});
      if(goal){ B.goal(c,goal.done?"Défi réussi : "+goal.n+" monomères !":"Défi : masse cible "+S.fmt(goal.mass,1)+" g/mol → quel n ?",goal.done,c.H-34); }
      ro.set(0,S.fmt(bonds,0)); ro.set(1,S.fmt(bonds,0)); ro.set(2,S.fmt(mass,1)); ro.set(3,S.fmt(N*M[t],1));
      nt.set(goal&&!goal.done?"Défi en cours : la masse cible est "+S.fmt(goal.mass,1)+" g/mol (type : "+NM[goal.t][0].toLowerCase()+", "+(goal.cyc?"chaîne cyclique":"chaîne linéaire")+"). Ajuste n : ta masse actuelle est "+S.fmt(mass,1)+" g/mol.":
        "Hydrolyse complète : "+S.fmt(bonds,0)+" H₂O consommées, "+S.fmt(N,0)+" monomères retrouvés ; la masse remonte de "+S.fmt(mass,1)+" à "+S.fmt(N*M[t],1)+" g/mol (+ "+S.fmt(bonds*W2,1)+").",goal&&goal.done?"ok":"ok");
    }
    k.button("＋ Condensation (+1)",function(){ n.set(n.value+1); },true);
    k.button("− Hydrolyse (−1)",function(){ n.set(n.value-1); });
    k.button("Défi : retrouver n",function(){
      var N=3+Math.floor(Math.random()*40), t=tp.value, cyc=cy.value; goal={n:N,t:t,cyc:cyc,mass:N*M[t]-(cyc?N:N-1)*W2,done:false}; n.set(2);
    });
    k.draw(function(){ sync(); R(); });
    var lp=k.loop(function(dt){ var any=false; drops.forEach(function(d){ d.t+=dt*1.1; }); drops=drops.filter(function(d){ return d.t<1; }); if(drops.length||true){ R(); } }); lp.play();
  }
});

SFA.sim({
  id:"ub-c01-gaz-sang", ch:"c01", tag:"pH · tampon bicarbonate",
  titre:"Gaz du sang : pH = 6,1 + log([HCO₃⁻] / 0,03·pCO₂)",
  resume:"Poumon, rein et balance acide-base : déplace le patient sur le diagramme pCO₂–HCO₃⁻ et diagnostique le trouble.",
  but:"Glisse le point rouge sur le diagramme (ou utilise les curseurs) : le poumon règle la pCO₂, le rein règle le bicarbonate, la balance penche selon leur rapport. Relève les défis de compensation.",
  aRetenir:"Henderson-Hasselbalch pour CO₂/HCO₃⁻ : pH = 6,1 + log([HCO₃⁻] / (0,03·pCO₂)). Normal : HCO₃⁻ ≈ 24 mmol/L, pCO₂ ≈ 40 mmHg → rapport 20 → pH ≈ 7,40. Le pH dépend du RAPPORT, pas d'une seule valeur : sur le diagramme, chaque droite issue de l'origine est une droite d'iso-pH. Pont avec la chimie : tampons et équilibres acide-base.",
  piege:"Une pCO₂ élevée acidifie (CO₂ + H₂O ⇌ H⁺ + HCO₃⁻) : c'est la cause d'une acidose respiratoire, pas une conséquence de l'alcalose. Rappel : le rein corrige HCO₃⁻ (heures-jours), le poumon corrige pCO₂ (minutes) ; une compensation ramène le pH vers 7,40 sans le corriger complètement.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(590);
    var hc=k.slider("[HCO₃⁻] (réglé par le rein)",5,45,0.5,24,"mmol/L");
    var pc=k.slider("pCO₂ (réglée par le poumon)",15,90,0.5,40,"mmHg");
    var ro=k.readouts(["Rapport HCO₃⁻ / (0,03·pCO₂)","pH","Interprétation"]);
    var nt=k.note("","");
    var t=0, ax=null, drag=false, rnd=B.rng(11), parts=[];
    for(var q=0;q<70;q++) parts.push({x:rnd(),y:rnd(),k:q,ph:rnd()*6.28});
    function ph(h,p){ return 6.1+Math.log10(h/(0.03*p)); }
    function diag(H,p,v){
      if(v<7.35) return (H<22&&p>45)?"Acidose mixte (métabolique + respiratoire)":p>45?(H>26?"Acidose respiratoire partiellement compensée":"Acidose respiratoire"):H<22?(p<35?"Acidose métabolique partiellement compensée":"Acidose métabolique"):"Acidémie (valeurs limites)";
      if(v>7.45) return (H>26&&p<35)?"Alcalose mixte":H>26?(p>45?"Alcalose métabolique partiellement compensée":"Alcalose métabolique"):p<35?(H<22?"Alcalose respiratoire partiellement compensée":"Alcalose respiratoire"):"Alcalémie (valeurs limites)";
      return (H>=22&&H<=26&&p>=35&&p<=45)?"Équilibre normal":"pH normal : trouble compensé (ou deux troubles opposés)";
    }
    var CASES=[
      function(){ return {txt:"pCO₂ = 60 mmHg : quel HCO₃⁻ (compensation rénale) ramène le pH à 7,40 ± 0,02 ?",t:function(H,p,v){ return Math.abs(p-60)<=2&&Math.abs(v-7.4)<=0.02; }}; },
      function(){ var H=[10,12,14][Math.floor(rnd()*3)]; return {txt:"HCO₃⁻ = "+H+" mmol/L : quelle pCO₂ (compensation respiratoire) donne pH 7,35 ± 0,02 ?",t:function(h,p,v){ return Math.abs(h-H)<=0.5&&Math.abs(v-7.35)<=0.02; }}; },
      function(){ return {txt:"crise d'angoisse (hyperventilation) : place pCO₂ = 25 mmHg, HCO₃⁻ = 24. Quel pH ?",t:function(H,p){ return Math.abs(p-25)<=1&&Math.abs(H-24)<=1; }}; },
      function(){ return {txt:"pCO₂ = 40 mmHg : quel HCO₃⁻ donne une acidose à pH 7,20 ± 0,02 ?",t:function(H,p,v){ return Math.abs(p-40)<=1&&Math.abs(v-7.2)<=0.02; }}; },
      function(){ return {txt:"BPCO, pCO₂ = 70 mmHg : HCO₃⁻ minimal pour pH ≥ 7,35 ?",t:function(H,p,v){ return Math.abs(p-70)<=1&&v>=7.35&&v<=7.37; }}; }
    ];
    var off=Math.floor(rnd()*CASES.length);
    var df=B.defi(k,function(n){ return CASES[(n+off)%CASES.length](); },function(d){ var H=hc.value,p=pc.value; return {ok:d.t(H,p,ph(H,p))}; });
    k.button("Retour à la normale",function(){ hc.set(24); pc.set(40); });
    c.pointer(function(tp,p){ if(!ax) return;
      if(tp==="down") drag=ax.has(p,10);
      if((tp==="down"||tp==="drag")&&drag){ pc.set(Math.round(Math.max(15,Math.min(90,ax.ix(p.x)))*2)/2); hc.set(Math.round(Math.max(5,Math.min(45,ax.iy(p.y)))*2)/2); k.redraw(); }
      if(tp==="up") drag=false; });
    function lungs(x,y,s,vent,co2){
      var ctx=c.ctx; ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
      ctx.strokeStyle="#b9c3cf"; ctx.lineWidth=5; ctx.lineCap="round"; ctx.beginPath(); ctx.moveTo(0,-46); ctx.lineTo(0,-14); ctx.moveTo(0,-14); ctx.lineTo(-12,-2); ctx.moveTo(0,-14); ctx.lineTo(12,-2); ctx.stroke();
      [-1,1].forEach(function(sg){ var g=ctx.createRadialGradient(sg*20,4,4,sg*20,8,34); g.addColorStop(0,"#f6b3bb"); g.addColorStop(1,"#d9707e");
        ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(sg*6,-16); ctx.bezierCurveTo(sg*40,-30,sg*44,30,sg*30,38); ctx.bezierCurveTo(sg*18,42,sg*6,34,sg*6,20); ctx.closePath(); ctx.fill();
        ctx.strokeStyle="#b85462"; ctx.lineWidth=1.4; ctx.stroke(); });
      ctx.restore();
    }
    function kidney(x,y,r){
      var ctx=c.ctx; ctx.save(); ctx.translate(x,y); var g=ctx.createRadialGradient(-r*.3,-r*.3,2,0,0,r*1.2); g.addColorStop(0,"#c77a62"); g.addColorStop(1,"#8e3f2e");
      ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(r*.25,-r*.35); ctx.bezierCurveTo(r*.2,-r*1.15,-r*.95,-r*1.1,-r*.95,0); ctx.bezierCurveTo(-r*.95,r*1.1,r*.2,r*1.15,r*.25,r*.35); ctx.bezierCurveTo(r*.05,r*.15,r*.05,-r*.15,r*.25,-r*.35); ctx.fill();
      ctx.strokeStyle="#6e2c20"; ctx.lineWidth=1.3; ctx.stroke(); ctx.restore();
    }
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.52), D=L.d, H=hc.value, p=pc.value, v=ph(H,p), r=H/(0.03*p);
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+48, wdr=L.wide?D.w:W;
      /* poumons : fréquence ventilatoire d'autant plus grande que la pCO₂ est basse (hyperventilation) */
      var vent=40/p, lx=D.x+wdr*.14, ly=top+62, ls=Math.min(1,wdr/430)*(1+.07*Math.sin(t*2.2*vent));
      lungs(lx,ly,ls,vent);
      for(var b=0;b<5;b++){ var u=((t*.45*vent+b/5)%1); ctx.save(); ctx.globalAlpha=1-u; B.ion(c,lx+(b%2?6:-6),ly-48*ls-u*30,5.5,"#8a95a3","",1-u); ctx.restore(); }
      S.draw.text(c,"poumon",lx,ly+50*ls,{size:10.5,color:"#b85462"}); S.draw.text(c,"CO₂ expiré",lx+26,ly-58*ls,{size:9.5,color:P.grey,align:"left"});
      /* rein */
      var kx=D.x+wdr*.86, ky=ly; kidney(kx,ky,Math.min(26,wdr*.06));
      S.draw.text(c,"rein",kx,ky+40,{size:10.5,color:"#8e3f2e"});
      var nk=Math.round(Math.min(4,Math.max(1,H/10)));
      for(var j=0;j<nk;j++){ var u2=((t*.35+j/nk)%1); B.ion(c,kx-30-u2*14,ky+8+u2*44,4.5,P.blue,"",Math.min(1,(1-u2)*2)); }
      /* balance acide-base */
      var bx=D.x+wdr*.5, by=top+38, arm=Math.min(78,wdr*.19), tilt=Math.max(-.42,Math.min(.42,(v-7.4)*1.1));
      ctx.save(); ctx.fillStyle="#7b8694"; ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx-12,by+64); ctx.lineTo(bx+12,by+64); ctx.closePath(); ctx.fill(); ctx.restore();
      var c0=Math.cos(tilt), s0=Math.sin(tilt), pl=[bx-arm*c0,by+arm*s0], pr=[bx+arm*c0,by-arm*s0];
      S.draw.line(c,pl[0],pl[1],pr[0],pr[1],"#4b5563",4);
      [[pl,"HCO₃⁻",P.blue,H/24],[pr,"CO₂",P.grey,0.03*p/1.2]].forEach(function(o){ var x=o[0][0], y=o[0][1];
        S.draw.line(c,x,y,x-18,y+26,"#9aa6b6",1); S.draw.line(c,x,y,x+18,y+26,"#9aa6b6",1);
        ctx.fillStyle="#dfe5ec"; ctx.beginPath(); ctx.ellipse(x,y+27,22,5,0,0,6.2832); ctx.fill(); ctx.strokeStyle="#9aa6b6"; ctx.stroke();
        var n=Math.max(1,Math.min(6,Math.round(o[3]*3))); for(var i=0;i<n;i++) B.ball(c,x-12+(i%3)*12,y+18-Math.floor(i/3)*9,4.6,o[2]);
        S.draw.text(c,o[1],x,y+42,{size:10,color:o[2]}); });
      B.ball(c,bx,by,5,"#4b5563");
      S.draw.display(c,B.f(v,2),bx,by+90,{w:84,h:40,caption:"pH sanguin",color:v<7.35?P.red:v>7.45?P.blue:P.green});
      /* vaisseau : flux de sang avec CO₂, HCO₃⁻ et H⁺ */
      var vy=D.y+D.h-68, vh=46; ctx.save(); S.draw.rrect(c,6,vy,W-12,vh,vh/2); var g=ctx.createLinearGradient(0,vy,0,vy+vh); g.addColorStop(0,"#f9d5d5"); g.addColorStop(1,"#efb0b0"); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle="#c46b6b"; ctx.lineWidth=2; ctx.stroke(); ctx.clip();
      var nB=Math.round(H/45*22), nC=Math.round(p/90*14), nH=Math.min(22,Math.round(4*Math.pow(10,7.4-v)));
      parts.forEach(function(q,i){ var kind=i<nB?0:i<nB+nC?1:i<nB+nC+nH?2:-1; if(kind<0) return;
        var x=6+(((q.x-t*.05*(1+q.k%3*.2))%1+1)%1)*(W-12), y=vy+8+q.y*(vh-16)+2*Math.sin(t*2+q.ph);
        if(kind===0) B.ball(c,x,y,4.2,P.blue); else if(kind===1) B.ball(c,x,y,4.6,"#8a95a3"); else B.ball(c,x,y,2.8,P.red); });
      ctx.restore();
      S.draw.text(c,"CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻",W/2,vy-10,{size:11,color:P.ink});
      var lg=[["#8a95a3","CO₂"],[P.blue,"HCO₃⁻"],[P.red,"H⁺"]], lx2=W/2-80; lg.forEach(function(o,i){ B.ball(c,lx2+i*62,vy+vh+12,4,o[0]); S.draw.text(c,o[1],lx2+i*62+8,vy+vh+12,{size:9.5,color:P.ink,align:"left"}); });
      /* diagramme pCO₂ – HCO₃⁻ avec droites d'iso-pH */
      var G=L.g; ax=B.axes(c,G,{x0:10,x1:95,y0:0,y1:48,stepX:10,stepY:10,l:42,t:22,b:34,xl:"pCO₂ (mmHg)",yl:"HCO₃⁻ (mmol/L)"});
      function ray(pH){ return function(x){ return 0.03*x*Math.pow(10,pH-6.1); }; }
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip();
      [[7.35,0,"rgba(192,50,29,.08)"],[7.45,48*9,"rgba(47,127,209,.08)"]].forEach(function(z){ var f=ray(z[0]); ctx.fillStyle=z[2]; ctx.beginPath(); ctx.moveTo(ax.X(10),ax.Y(f(10))); ctx.lineTo(ax.X(95),ax.Y(f(95))); ctx.lineTo(ax.X(95),ax.Y(z[1]?60:0)); ctx.lineTo(ax.X(10),ax.Y(z[1]?60:0)); ctx.closePath(); ctx.fill(); });
      ctx.fillStyle="rgba(36,119,90,.18)"; ctx.fillRect(ax.X(35),ax.Y(26),ax.X(45)-ax.X(35),ax.Y(22)-ax.Y(26)); ctx.restore();
      [7.0,7.2,7.4,7.6].forEach(function(q){ var f=ray(q); S.draw.fn(c,ax,f,q===7.4?P.green:"#9aa6b6",q===7.4?2:1.2,q===7.4?null:[4,4]);
        var xe=Math.min(93,48/(0.03*Math.pow(10,q-6.1))*0.97); S.draw.text(c,"pH "+S.fmt(q,1),ax.X(xe)-2,ax.Y(f(xe))-8,{size:9.5,color:q===7.4?P.green:P.grey,align:"right",halo:true}); });
            S.draw.text(c,"acidémie",ax.R-6,ax.B-12,{size:10,color:P.red,align:"right"}); S.draw.text(c,"alcalémie",ax.L+6,ax.T+30,{size:10,color:P.blue,align:"left"});
      S.draw.line(c,ax.X(40),ax.Y(24),ax.X(p),ax.Y(H),"rgba(15,27,45,.35)",1.2,[3,3]);
      S.draw.dot(c,ax.X(p),ax.Y(H),8,P.red); S.draw.label(c,"pH "+B.f(v,2),Math.min(ax.X(p)+12,ax.R-30),Math.max(ax.T+10,ax.Y(H)-14),{color:P.red,align:"left",size:10.5});
      if(!drag) S.draw.text(c,"glisse le point",ax.X(p),ax.Y(H)+18,{size:9,color:P.grey,halo:true});
      var dg=diag(H,p,v), d=df.banner(c,13);
      ro.set(0,S.fmt(r,1)); ro.set(1,B.f(v,2)); ro.set(2,dg);
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+"Droites : iso-pH (HCO₃⁻ = 0,03·pCO₂·10<sup>pH − 6,1</sup>). Zone verte : HCO₃⁻ 22-26 mmol/L et pCO₂ 35-45 mmHg. Le poumon déplace le point horizontalement (minutes), le rein verticalement (heures-jours). Densités de particules dans le vaisseau : relatives, pas à l'échelle (en réalité HCO₃⁻ ≈ 20 × CO₂ dissous).",d&&d.ok?"ok":Math.abs(v-7.4)<=0.05?"ok":"warn");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c01-capacite-tampon", ch:"c01", tag:"Tampon · classique",
  titre:"Capacité d'un tampon : où et jusqu'où il protège",
  resume:"Verse de l'acide fort goutte à goutte dans un tampon : A⁻ se change en HA, le pH bouge à peine… jusqu'à l'épuisement.",
  but:"Choisis le couple, sa concentration et le pH de départ. Verse de l'acide (ou de la base) avec les boutons ou en glissant le point sur la courbe : regarde les A⁻ (bleus) devenir HA (orange) et la couleur de l'indicateur virer.",
  aRetenir:"Un tampon est efficace pour pH = pKa ± 1, et surtout quand [A⁻] ≈ [HA]. Chaque H⁺ ajouté est capté par un A⁻ (A⁻ + H⁺ → HA) : le pH ne change que par le rapport [A⁻]/[HA]. Sa capacité croît avec la concentration totale. Le phosphate (pKa ≈ 6,8) tamponne le cytosol (pH ≈ 7,2) ; le bicarbonate (pKa 6,1) tamponne le plasma grâce au poumon qui évacue le CO₂. Pont : chimie, tampons et Henderson-Hasselbalch.",
  piege:"Un tampon n'est pas infini : quand tout A⁻ (ou tout HA) est consommé, le pH s'effondre. Henderson-Hasselbalch ne s'applique plus ; la courbe est ici calculée par l'électroneutralité complète, valable partout.",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(570);
    var sel=k.select("Couple tampon",[["6.1","Bicarbonate CO₂/HCO₃⁻ (pKa 6,1)"],["6.8","Phosphate H₂PO₄⁻/HPO₄²⁻ (pKa 6,8)"],["9.25","Ammonium NH₄⁺/NH₃ (pKa 9,25)"]],"6.8");
    var C=k.slider("Concentration totale du tampon",5,100,1,20,"mmol/L");
    var p0=k.slider("pH de départ",5,9,0.05,7.2,"");
    var h=k.slider("Acide fort ajouté (négatif = base forte)",-40,40,0.5,0,"mmol/L");
    var ro=k.readouts(["pH final","Variation de pH","[A⁻] / [HA] restants (mmol/L)","Capacité β au départ (mmol/L par unité pH)"]);
    var nt=k.note("","");
    var t=0, ax=null, drag=false, drops=[], lastH=h.value, rnd=B.rng(5), parts=[];
    for(var q=0;q<60;q++) parts.push({x:rnd(),y:rnd(),ph:rnd()*6.28});
    function model(x){ var pKa=parseFloat(sel.value), Ka=Math.pow(10,-pKa), Ct=C.value/1000, r=Math.pow(10,p0.value-pKa), A0=Ct*r/(1+r), X=x/1000;
      function f(H){ return A0-X+H-Ct*Ka/(Ka+H)-1e-14/H; }
      var lo=-14, hi=0.5; for(var i=0;i<60;i++){ var m=(lo+hi)/2; if(f(Math.pow(10,m))>0) hi=m; else lo=m; }
      var H=Math.pow(10,(lo+hi)/2), A=Ct*Ka/(Ka+H); return {pH:-Math.log10(H),A:A*1000,HA:(Ct-A)*1000,pKa:pKa}; }
    var df=B.defi(k,function(n){ return [
        {id:1,txt:"trouve l'ajout d'acide qui fait baisser le pH d'une unité (± 0,05)"},
        {id:2,txt:"10 mmol/L d'acide ajoutés : règle le tampon pour que le pH baisse de 0,20 au plus"},
        {id:3,txt:"trouve le pH de départ où le tampon résiste le mieux (β maximal, ± 0,1)"}][n%3]; },
      function(d){ var m0=model(0), m=model(h.value), dl=m.pH-m0.pH;
        if(d.id===1) return {ok:h.value>0&&Math.abs(dl+1)<=0.05};
        if(d.id===2) return {ok:Math.abs(h.value-10)<=0.5&&dl>=-0.2};
        return {ok:Math.abs(p0.value-m0.pKa)<=0.1}; });
    k.button("+ 1 mmol/L d'acide",function(){ h.set(h.value+1); },true);
    k.button("+ 1 mmol/L de base",function(){ h.set(h.value-1); });
    k.button("Vider",function(){ h.set(0); });
    c.pointer(function(tp,p){ if(!ax) return; if(tp==="down") drag=ax.has(p,10);
      if((tp==="down"||tp==="drag")&&drag){ h.set(Math.round(Math.max(-40,Math.min(40,ax.ix(p.x)))*2)/2); k.redraw(); }
      if(tp==="up") drag=false; });
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, m0=model(0), m=model(h.value), dl=m.pH-m0.pH;
      if(h.value!==lastH){ var dd=h.value-lastH, n=Math.min(6,Math.ceil(Math.abs(dd)/1.5)); for(var i=0;i<n;i++) drops.push({t:-i*.12,acid:dd>0}); lastH=h.value; }
      drops.forEach(function(d){ d.t+=dt*1.4; }); drops=drops.filter(function(d){ return d.t<1; });
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+40, bw=Math.min(220,D.w*.5), bxc=D.x+(L.wide?D.w*.42:W*.4), bx=bxc-bw/2, byT=top+70, byB=D.y+D.h-16, acidCol=h.value>=0;
      /* burette */
      ctx.save(); var bu=bxc-9; S.draw.rrect(c,bu,top-4,18,58,4); ctx.fillStyle="rgba(230,238,246,.9)"; ctx.fill(); ctx.strokeStyle="#9aa6b6"; ctx.lineWidth=1.4; ctx.stroke();
      ctx.fillStyle=acidCol?"rgba(214,47,47,.35)":"rgba(90,63,168,.35)"; ctx.fillRect(bu+2,top+14,14,38);
      ctx.fillStyle="#7b8694"; ctx.fillRect(bxc-2,top+54,4,12); ctx.restore();
      S.draw.text(c,acidCol?"HCl (acide fort)":"NaOH (base forte)",bxc+16,top+8,{size:9.5,color:acidCol?P.red:P.violet,align:"left"});
      /* bécher + solution colorée par l'indicateur universel */
      var lvl=byT+22, col=B.phColor(m.pH);
      ctx.save(); ctx.beginPath(); ctx.moveTo(bx,byT); ctx.lineTo(bx,byB-10); ctx.quadraticCurveTo(bx,byB,bx+10,byB); ctx.lineTo(bx+bw-10,byB); ctx.quadraticCurveTo(bx+bw,byB,bx+bw,byB-10); ctx.lineTo(bx+bw,byT);
      ctx.save(); ctx.clip(); ctx.globalAlpha=.42; ctx.fillStyle=col; ctx.fillRect(bx,lvl,bw,byB-lvl); ctx.globalAlpha=1; ctx.restore();
      ctx.strokeStyle="#7b8694"; ctx.lineWidth=2.2; ctx.stroke(); ctx.restore();
      drops.forEach(function(d){ if(d.t<0) return; var y=top+66+d.t*(lvl-top-66); B.ball(c,bxc,y,3.6,d.acid?"#d62f2f":"#5a3fa8"); });
      /* particules : A⁻ et HA proportionnels aux concentrations */
      var tot=m.A+m.HA, N=Math.min(44,Math.round(6+tot/100*38)), nA=Math.round(N*m.A/Math.max(tot,1e-9));
      var nH=m.pH<4.2?Math.min(16,Math.round((4.2-m.pH)*10)):0, nO=m.pH>9.8?Math.min(16,Math.round((m.pH-9.8)*10)):0;
      for(var j=0;j<N+nH+nO&&j<parts.length;j++){ var q=parts[j], x=bx+12+((q.x+.03*Math.sin(t*.9+q.ph))%1+1)%1*(bw-24), y=lvl+10+((q.y+.03*Math.cos(t*.8+q.ph))%1+1)%1*(byB-lvl-22);
        if(j<nA) B.ion(c,x,y,6.5,P.blue,"A⁻"); else if(j<N) B.ion(c,x,y,7,P.amber,"HA"); else if(j<N+nH) B.ion(c,x,y,4,P.red,"H⁺"); else B.ion(c,x,y,4.5,P.violet,"OH⁻"); }
      /* pH-mètre et bilan */
      var dx=D.x+(L.wide?D.w*.8:W*.8), dy=byT+30;
      S.draw.display(c,B.f(m.pH,2),dx,dy,{w:88,h:42,caption:"pH-mètre",color:"#13233a"});
      S.draw.text(c,"A⁻ + H⁺ → HA",dx,dy+44,{size:11,color:P.ink});
      S.draw.text(c,"[A⁻] "+S.fmt(m.A,1),dx,dy+64,{size:10.5,color:P.blue}); S.draw.text(c,"[HA] "+S.fmt(m.HA,1),dx,dy+80,{size:10.5,color:P.amber});
      if(m.A<0.03*tot||m.HA<0.03*tot) S.draw.label(c,"tampon épuisé",dx,dy+102,{color:P.red,size:10.5});
      /* courbe pH = f(acide ajouté) */
      ax=B.axes(c,L.g,{t:20,b:34,l:40,x0:-40,x1:40,y0:2,y1:12,stepX:10,stepY:2,xl:"acide fort ajouté (mmol/L)",yl:"pH"});
      ctx.save(); ctx.fillStyle="rgba(194,106,12,.10)"; var y1=ax.cy(m0.pKa+1), y2=ax.cy(m0.pKa-1); ctx.fillRect(ax.L,y1,ax.R-ax.L,y2-y1); ctx.restore();
      S.draw.line(c,ax.L,ax.Y(m0.pKa),ax.R,ax.Y(m0.pKa),P.amber,1.3,[5,4]); S.draw.text(c,"pKa "+S.fmt(m0.pKa,2)+" ± 1 : zone tampon",ax.R-4,ax.Y(m0.pKa+1)+10,{size:9.5,color:P.amber,align:"right",halo:true});
      var pts=[]; for(var x=-40;x<=40;x+=0.4) pts.push([x,model(x).pH]); B.poly(c,ax,pts,P.acc,2.6);
      S.draw.dot(c,ax.X(0),ax.Y(m0.pH),5,P.green);
      S.draw.dot(c,ax.X(h.value),ax.cy(m.pH),8,P.red); if(!drag) S.draw.text(c,"glisse le point",ax.X(h.value),ax.cy(m.pH)-16,{size:9,color:P.grey,halo:true});
      var Ka=Math.pow(10,-m0.pKa), Hh=Math.pow(10,-p0.value), beta=2.303*C.value*Ka*Hh/Math.pow(Ka+Hh,2);
      var d=df.banner(c,13);
      ro.set(0,B.f(m.pH,2)); ro.set(1,(dl>0?"+":"")+B.f(dl,2)); ro.set(2,S.fmt(m.A,1)+" / "+S.fmt(m.HA,1)); ro.set(3,S.fmt(beta,2));
      var exh=m.A<0.03*tot||m.HA<0.03*tot;
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+(exh?"Le tampon est épuisé : il ne reste presque plus de "+(m.A<m.HA?"base A⁻ pour capter H⁺":"acide HA pour neutraliser OH⁻")+" ; le pH varie brutalement.":"Chaque H⁺ versé transforme un A⁻ en HA : le pH dépend du rapport [A⁻]/[HA] = "+S.fmt(m.A/Math.max(m.HA,1e-9),2)+".")+" Modèle : système fermé, volume constant (le CO₂ n'est pas évacué : pour le bicarbonate réel, le poumon rend le tampon bien plus efficace).",d&&d.ok?"ok":exh?"warn":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

SFA.sim({
  id:"ub-c01-acides-gras-fluidite", ch:"c01", tag:"Lipides · niche",
  titre:"Acides gras : longueur, insaturations et fluidité membranaire",
  resume:"Construis une bicouche avec 11 acides gras réels et chauffe-la : chaînes droites qui s'empilent (gel) ou coudées qui s'agitent (fluide).",
  but:"Choisis un acide gras (liste ou clic sur un point du graphique) et glisse le thermomètre : la bicouche passe de l'état gel ordonné à l'état fluide quand T dépasse le point de fusion. Le lipide vert fluorescent montre la diffusion latérale.",
  aRetenir:"Chaîne plus longue → plus d'interactions de van der Waals → point de fusion plus haut. Une double liaison cis coude la chaîne, empêche l'empilement et abaisse fortement le point de fusion (18:0 : 70 °C ; 18:1 cis : 13 °C). Une liaison trans garde une chaîne droite : 44 °C. Dans les membranes, les chaînes insaturées maintiennent la fluidité.",
  piege:"Les acides gras insaturés naturels sont cis. Les « graisses trans » (élaïdique) ressemblent aux saturés par leur forme et leur point de fusion. Le cholestérol, lui, rigidifie les membranes chaudes mais empêche la solidification des froides (effet tampon de fluidité).",
  build:function(k,S){
    var P=S.draw.palette, B=S.bio, c=k.canvas(580);
    var F=[["Laurique","12:0",12,[],43.2],["Myristique","14:0",14,[],54.4],["Palmitique","16:0",16,[],62.9],["Stéarique","18:0",18,[],69.6],["Arachidique","20:0",20,[],75.4],
      ["Oléique (cis)","18:1 cis Δ9",18,[9],13.4],["Élaïdique (trans)","18:1 trans Δ9",18,["t9"],44],["Linoléique","18:2 cis Δ9,12",18,[9,12],-5],["α-Linolénique","18:3 cis Δ9,12,15",18,[9,12,15],-11],["Arachidonique","20:4 cis Δ5,8,11,14",20,[5,8,11,14],-49.5],["Palmitoléique","16:1 cis Δ9",16,[9],0.5]];
    var sel=k.select("Acide gras",F.map(function(f,i){return [i,f[0]+" ("+f[1]+")"];}),3);
    var tt=k.slider("Température",-60,90,1,37,"°C");
    var ro=k.readouts(["Point de fusion","État à cette température","Écart T − Tf"]);
    var nt=k.note("","");
    var t=0, fl=0, ax=null, mode=null, th={}, rnd=B.rng(3), jit=[]; for(var q=0;q<80;q++) jit.push(rnd()*6.28);
    var tr={x:.5,v:0};
    function kind(f){ return !f[3].length?"sat":typeof f[3][0]==="string"?"trans":"cis"; }
    var DEF=[
      {txt:"rends la bicouche fluide à 10 °C avec un acide gras à 18 carbones",T:10,ok:function(f,fluid){ return f[2]===18&&fluid; }},
      {txt:"trouve l'acide gras saturé le plus long qui reste fluide à 50 °C",T:50,ok:function(f,fluid){ return f[1]==="12:0"&&fluid; }},
      {txt:"à 20 °C, trouve les deux acides gras à 18 C dont la bicouche est en gel",T:20,two:true},
      {txt:"règle la température juste au point de fusion de l'acide oléique (± 1 °C)",T:null,ok:function(f){ return f[1]==="18:1 cis Δ9"&&Math.abs(tt.value-13.4)<=1; }}];
    var found={};
    var df=B.defi(k,function(n){ found={}; return DEF[n%DEF.length]; },function(d){ var f=F[sel.value], fluid=tt.value>f[4];
      if(d.T!=null&&Math.abs(tt.value-d.T)>1) return {ok:false};
      if(d.two){ if(f[2]===18&&!fluid) found[f[1]]=1; return {ok:Object.keys(found).length>=2}; }
      return {ok:d.ok(f,fluid)}; });
    function tail(x,y,dir,f,amp,ph){
      var ctx=c.ctx, n=f[2], seg=3.05, ang=0, px=x, py=y, pts=[[x,y]];
      var dbl=f[3].map(function(d){ return typeof d==="string"?{p:parseInt(d.slice(1)),cis:false}:{p:d,cis:true}; });
      for(var i=1;i<n;i++){ var d=dbl.filter(function(q){ return q.p===i; })[0]; if(d&&d.cis) ang+=(i%2?.52:-.52);
        var a=ang+amp*Math.sin(t*5+ph+i*.7)*.35, zz=(i%2?1:-1)*1.3; px+=Math.sin(a)*seg+zz*Math.cos(a)*.5; py+=dir*Math.cos(a)*seg; pts.push([px,py]); }
      ctx.save(); ctx.lineCap="round"; ctx.lineJoin="round";
      for(var j=1;j<pts.length;j++){ var dd=dbl.filter(function(q){ return q.p===j; })[0]; ctx.strokeStyle=dd?(dd.cis?P.teal:P.red):"#b99a55"; ctx.lineWidth=dd?2.2:1.6;
        ctx.beginPath(); ctx.moveTo(pts[j-1][0],pts[j-1][1]); ctx.lineTo(pts[j][0],pts[j][1]); ctx.stroke(); }
      ctx.restore();
    }
    c.pointer(function(tp,p){
      if(tp==="down"){ mode=(Math.abs(p.x-th.x)<26&&p.y>th.y0-12&&p.y<th.y1+12)?"th":(ax&&ax.has(p,6))?"g":null;
        if(mode==="g"){ var best=-1,bd=22; F.forEach(function(f,i){ var d=Math.hypot(ax.X(f[2])-p.x,ax.Y(f[4])-p.y); if(d<bd){bd=d;best=i;} }); if(best>=0){ sel.set(best); mode=null; } else mode="gl"; } }
      if((tp==="down"||tp==="drag")&&(mode==="th"||mode==="gl")){ var T=mode==="th"?th.T(p.y):ax.iy(p.y); tt.set(Math.round(Math.max(-60,Math.min(90,T)))); }
      if(tp==="up") mode=null; k.redraw(); });
    function frame(dt){
      t+=dt; var ctx=c.ctx, W=c.W, L=B.split(c,.5), D=L.d, f=F[sel.value], T=tt.value, Tm=f[4], fluid=T>Tm;
      var target=fluid?Math.min(1,.35+(T-Tm)/45):0; fl+=(target-fl)*Math.min(1,dt*3+(dt===0?1:0));
      c.clear(); B.bg(c,"#fbfdff","#eef3f9");
      var top=D.y+42, mw=D.w-74, mx0=D.x+12, cy=top+(D.h-42)/2-6;
      /* eau de part et d'autre */
      ctx.fillStyle="rgba(168,210,240,.22)"; ctx.fillRect(mx0,top,mw,D.y+D.h-top-14);
      var sp=fluid?15:12, nL=Math.floor(mw/sp), half=f[2]*3.05*.92+4;
      for(var s=-1;s<=1;s+=2){ for(var i=0;i<nL;i++){ var jx=fl*3.2*Math.sin(t*1.7+jit[i%80]*3+s), x=mx0+sp/2+i*sp+jx, hy=cy+s*(half+6)+fl*1.5*Math.sin(t*2.3+jit[(i+7)%80]);
          tail(x-2.6,hy-s*5,-s,f,fl,jit[i%80]); tail(x+2.6,hy-s*5,-s,f,fl,jit[(i+3)%80]); B.ball(c,x,hy,5.2,"#e8b94a"); } }
      /* lipide fluorescent : diffusion latérale (marche aléatoire) seulement en phase fluide */
      tr.v+=(rnd()-.5)*dt*fl*3; tr.v*=.96; tr.x+=tr.v*dt*fl; if(tr.x<.05||tr.x>.95){ tr.v*=-1; tr.x=Math.max(.05,Math.min(.95,tr.x)); }
      var fx=mx0+tr.x*mw; S.draw.glow(c,fx,cy-half-6,16,P.green,.55); B.ball(c,fx,cy-half-6,5.6,P.green);
      S.draw.text(c,f[0]+" · "+f[1],mx0+mw/2,top+10,{size:11.5,color:P.ink,halo:true});
      S.draw.label(c,fluid?"phase fluide : chaînes agitées, lipides mobiles":"phase gel : chaînes droites, empilées",mx0+mw/2,D.y+D.h-24,{color:fluid?P.teal:P.acc,size:10.5});
      /* thermomètre (glissable) */
      th.x=D.x+D.w-34; th.y0=top+6; th.y1=D.y+D.h-40; th.T=function(y){ return 90-(y-th.y0)/(th.y1-th.y0)*150; }; var Ty=function(v){ return th.y0+(90-v)/150*(th.y1-th.y0); };
      ctx.save(); S.draw.rrect(c,th.x-6,th.y0-4,12,th.y1-th.y0+8,6); ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle="#9aa6b6"; ctx.lineWidth=1.3; ctx.stroke();
      ctx.fillStyle=P.red; ctx.fillRect(th.x-3,Ty(T),6,th.y1-Ty(T)+4); ctx.beginPath(); ctx.arc(th.x,th.y1+8,8,0,6.2832); ctx.fill(); ctx.restore();
      S.draw.line(c,th.x-12,Ty(Tm),th.x+12,Ty(Tm),P.amber,2); S.draw.text(c,"Tf",th.x+14,Ty(Tm),{size:9.5,color:P.amber,align:"left"});
      S.draw.label(c,S.fmt(T,0)+" °C",th.x,Math.max(top-2,Ty(T)-12),{color:P.red,size:10});
      /* graphique : point de fusion selon le nombre de carbones */
      ax=B.axes(c,L.g,{frame:true,t:24,b:36,l:42,x0:11,x1:21,y0:-60,y1:90,stepX:1,stepY:30,xl:"nombre de carbones",yl:"point de fusion (°C)"});
      ctx.save(); ctx.fillStyle="rgba(14,127,150,.07)"; ctx.fillRect(ax.L,ax.cy(T),ax.R-ax.L,ax.B-ax.cy(T)); ctx.restore();
      S.draw.line(c,ax.L,ax.Y(T),ax.R,ax.Y(T),P.red,1.6,[6,4]); S.draw.text(c,"T = "+S.fmt(T,0)+" °C : sous la ligne = fluide",ax.R-4,ax.Y(T)+(T>60?14:-9),{size:9.5,color:P.red,align:"right",halo:true});
      B.poly(c,ax,F.filter(function(g){ return kind(g)==="sat"; }).map(function(g){ return [g[2],g[4]]; }),"#9aa6b6",1.4,[4,3]);
      F.forEach(function(g,i){ var kc=kind(g), col=kc==="sat"?P.ink:kc==="cis"?P.teal:P.red, on=i==sel.value;
        S.draw.dot(c,ax.X(g[2]),ax.Y(g[4]),on?8:5,col); if(on||ax.R-ax.L>360) S.draw.text(c,g[1].split(" ")[0]+(kc==="trans"?" t":kc==="cis"?" c":""),ax.X(g[2])+(g[2]>=20?-9:9),ax.Y(g[4]),{size:9.5,color:col,align:g[2]>=20?"right":"left",halo:true}); });
      S.draw.legend(c,[[P.ink,"saturés"],[P.teal,"cis"],[P.red,"trans"]],ax.L+6,ax.T+4);
      var d=df.banner(c,13);
      ro.set(0,S.fmt(Tm,1)+" °C"); ro.set(1,fluid?"fluide (liquide)":"gel (solide, ordonné)"); ro.set(2,(T-Tm>0?"+":"")+S.fmt(T-Tm,1)+" °C");
      nt.set((d&&d.ok?"<b>Défi réussi.</b> ":"")+"Touche un point du graphique pour choisir l'acide gras, glisse le thermomètre ou la ligne rouge. Points de fusion expérimentaux des acides gras libres (quelques degrés d'écart selon les sources) ; la bicouche dessinée n'en contient qu'une sorte, ce qui exagère la netteté de la transition.",d&&d.ok?"ok":"ok");
    }
    k.draw(function(){ frame(0); });
    var lp=k.loop(function(dt){ frame(dt); }); lp.play();
  }
});

/* BIO3D-BEGIN:s_c01_helice.js */
(function(){
var P = function(S){ return S.draw.palette; };
/* --- moteur 3D maison (projection perspective, tri en profondeur, rotation à la souris) --- */
function hx(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function sh(h, f, a){ var q = hx(h); return "rgba(" + q.map(function(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }).join(",") + "," + (a === undefined ? 1 : a) + ")"; }
function V3(c, S, o){
  o = o || {};
  var v = {yaw:o.yaw === undefined ? 0.5 : o.yaw, pit:o.pit === undefined ? 0.3 : o.pit, D:o.D || 8, sc:o.sc || 60, ox:0, oy:0, auto:o.auto !== false, q:[], moved:false}, last = null, d0 = null;
  c.pointer(function(t, p){
    if (t === "down"){ last = p; d0 = p; v.auto = false; v.moved = false; }
    else if (t === "drag" && last){ if (Math.abs(p.x - d0.x) + Math.abs(p.y - d0.y) > 5) v.moved = true; v.yaw += (p.x - last.x) * 0.01; v.pit = Math.max(-1.45, Math.min(1.45, v.pit + (p.y - last.y) * 0.01)); last = p; }
    else if (t === "up"){ last = null; if (!v.moved && v.onclick) v.onclick(p); }
  });
  v.P = function(x, y, z){
    var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pit), sp = Math.sin(v.pit);
    var X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var f = v.D / (v.D - Z);
    return {x:c.W / 2 + v.ox + X * f * v.sc, y:c.H / 2 + v.oy - Y * f * v.sc, z:Z, f:f};
  };
  v.add = function(z, fn){ v.q.push([z, fn]); };
  v.flush = function(){ v.q.sort(function(a, b){ return a[0] - b[0]; }); for (var i = 0; i < v.q.length; i++) v.q[i][1](); v.q = []; };
  v.ball = function(x, y, z, r, col, al){
    var p = v.P(x, y, z), R = Math.max(1, r * p.f * v.sc);
    v.add(p.z, function(){
      var g = c.ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      g.addColorStop(0, sh(col, 0.55, al)); g.addColorStop(0.55, sh(col, 0, al)); g.addColorStop(1, sh(col, -0.4, al));
      c.ctx.fillStyle = g; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R, 0, 6.2832); c.ctx.fill();
    });
    p.R = R; return p;
  };
  v.seg = function(a, b, w, col, al, dash){
    var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]);
    v.add((p.z + q.z) / 2 - 0.001, function(){
      var x = c.ctx; x.lineCap = "round"; x.strokeStyle = sh(col, 0, al); x.lineWidth = Math.max(1, w * (p.f + q.f) / 2 * v.sc);
      if (dash) x.setLineDash(dash);
      x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
      if (!dash && w * v.sc > 6){ x.strokeStyle = sh(col, 0.5, al); x.lineWidth = x.lineWidth * 0.35; x.beginPath(); x.moveTo(p.x - 1, p.y - 1); x.lineTo(q.x - 1, q.y - 1); x.stroke(); }
      if (dash) x.setLineDash([]);
    });
  };
  v.label = function(txt, x, y, z, col, size, bg){
    var p = v.P(x, y, z);
    v.add(p.z + 50, function(){ S.draw.text(c, txt, p.x, p.y, {size:size || 11, color:col || "#0f1b2d", weight:700, bg:bg}); });
  };
  v.spin = function(dt){ if (v.auto) v.yaw += dt * 0.35; };
  return v;
}

SFA.sim({
  id:"ub-c01-3d-helice-alpha", ch:"c01", tag:"Protéines · 3D",
  titre:"L'hélice α en 3D : un ressort tenu par des liaisons H",
  resume:"Fais tourner l'hélice, étire-la, casse ses liaisons hydrogène : 3,6 acides aminés par tour, liaison i → i+4.",
  but:"Glisse pour faire pivoter la molécule. Ajoute des acides aminés, puis augmente la dénaturation (chaleur, urée) : les liaisons H se rompent et la chaîne s'étire.",
  aRetenir:"Dans l'hélice α, chaque C=O forme une liaison hydrogène avec le N–H situé 4 acides aminés plus loin (i → i+4). Il y a 3,6 résidus par tour, un pas de 0,54 nm (0,15 nm par résidu) et les chaînes latérales pointent vers l'extérieur. Ce sont des liaisons faibles mais nombreuses : leur somme stabilise la structure secondaire.",
  piege:"Ce ne sont pas les chaînes latérales qui tiennent l'hélice, mais les liaisons H du squelette peptidique (donc possibles pour presque tous les acides aminés). Dénaturer ne casse pas les liaisons peptidiques : la séquence (structure primaire) reste intacte. Les distances sont à l'échelle, mais les atomes sont simplifiés (seuls les Cα et les groupes C=O sont figurés).",
  build:function(k,S){
    var c = k.canvas(380), pal = P(S), v = V3(c, S, {yaw:0.6, pit:0.25, D:9});
    var n = k.slider("Acides aminés dans la chaîne", 8, 30, 1, 18, "");
    var den = k.slider("Dénaturation (chaleur, urée)", 0, 100, 1, 0, "%");
    var hb = k.toggle("Montrer les liaisons hydrogène", true);
    var sc = k.toggle("Montrer les chaînes latérales", true);
    var ro = k.readouts(["Longueur", "Tours", "Liaisons H", "Structure"]);
    var cols = [pal.acc, pal.teal, pal.violet, pal.amber, pal.green];
    k.note("Modèle simplifié : la transition hélice → chaîne étirée est représentée de façon continue ; en réalité elle est coopérative (« tout ou presque rien »).", "warn");
    function pos(i, d, N){
      var th = i * 100 * Math.PI / 180, hel = [0.23 * Math.cos(th), i * 0.15, 0.23 * Math.sin(th)];
      var ext = [(i % 2 ? 0.1 : -0.1) * Math.cos(0.5), i * 0.33, (i % 2 ? 0.07 : -0.07)];
      var cy = ((N - 1) * (0.15 * (1 - d) + 0.33 * d)) / 2;
      return [hel[0] * (1 - d) + ext[0] * d, hel[1] * (1 - d) + ext[1] * d - cy, hel[2] * (1 - d) + ext[2] * d];
    }
    function R(){
      c.clear(); var N = n.value, d = den.value / 100;
      var len = (N - 1) * (0.15 * (1 - d) + 0.33 * d);
      v.sc = Math.min(c.H * 0.8 / Math.max(len + 0.8, 2.5), 150);
      var pts = []; for (var i = 0; i < N; i++) pts.push(pos(i, d, N));
      var nH = 0;
      for (i = 0; i < N - 1; i++) v.seg(pts[i], pts[i + 1], 0.07, "#8a95a3", 1);
      for (i = 0; i < N; i++){
        var th = i * 100 * Math.PI / 180, p = pts[i];
        v.ball(p[0], p[1], p[2], 0.09, "#4b5563");
        var oc = [p[0], p[1] + 0.1 * (1 - d), p[2]];
        v.ball(oc[0] + 0.08 * Math.cos(th) * (1 - d), oc[1] + 0.05, oc[2] + 0.08 * Math.sin(th) * (1 - d), 0.075, pal.red);
        if (sc.value){
          var r = 0.26 + 0.12 * (1 - d) * 0 , out = [p[0] + Math.cos(th) * 0.3, p[1], p[2] + Math.sin(th) * 0.3];
          if (d > 0.5) out = [p[0] + (i % 2 ? 0.28 : -0.28), p[1], p[2] + (i % 2 ? 0.2 : -0.2)];
          v.seg(p, out, 0.04, "#8a95a3", 0.9);
          v.ball(out[0], out[1], out[2], 0.11, cols[i % 5]);
        }
      }
      var formed = d < 0.5;
      if (hb.value) for (i = 0; i + 4 < N; i++){
        var a = pts[i], b = pts[i + 4], dist = Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
        if (formed){ nH++; v.seg([a[0], a[1] + 0.1, a[2]], [b[0], b[1] - 0.02, b[2]], 0.03, pal.amber, 0.9, [3, 3]); }
        else if (d < 0.8) v.seg([a[0], a[1] + 0.1, a[2]], [b[0], b[1], b[2]], 0.02, pal.amber, 0.25, [2, 6]);
      }
      if (!hb.value && formed) nH = N - 4;
      v.flush();
      S.draw.text(c, "Cα gris · C=O rouge", c.W / 2, c.H - 28, {size:11, color:pal.grey});
      S.draw.text(c, "liaison H i → i+4 : pointillés orange", c.W / 2, c.H - 12, {size:11, color:pal.grey});
      ro.set(0, S.fmt(len, 2) + " nm"); ro.set(1, formed ? S.fmt(N / 3.6, 1) : "—"); ro.set(2, nH + " / " + Math.max(0, N - 4)); 
      ro.set(3, d < 0.05 ? "hélice α" : d < 0.5 ? "hélice qui s'étire" : "chaîne dénaturée");
    }
    k.draw(R);
    var lp = k.loop(function(dt){ v.spin(dt); R(); }); lp.play();
  }
});

})();
/* BIO3D-END:s_c01_helice.js */
