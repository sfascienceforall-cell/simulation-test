(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI = Math.PI;
/* --- petit moteur 3D : z vers le haut, observateur du côté y négatif, perspective maison, glisser pour tourner (avec élan) --- */
var V = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]], NM = "ABCDEFGH";
var FACES = [[[0,3,2,1],[0,0,-1]], [[4,5,6,7],[0,0,1]], [[0,1,5,4],[0,-1,0]], [[3,7,6,2],[0,1,0]], [[0,4,7,3],[-1,0,0]], [[1,2,6,5],[1,0,0]]];
var EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
function rot(p, yaw, pitch, o){ o = o || [0.5, 0.5, 0.5]; var x = p[0] - o[0], y = p[1] - o[1], z = p[2] - o[2], cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  var x1 = x * cy - y * sy, y1 = x * sy + y * cy; return [x1, y1 * sp + z * cp, y1 * cp - z * sp]; }   /* [écran x, écran y (haut), profondeur] */
function view(c, yaw, pitch, sc, o){ o = o || {}; sc = sc || Math.min(c.W, c.H) * 0.4; var cx = o.cx == null ? c.W / 2 : o.cx, cy = o.cy == null ? c.H / 2 : o.cy, D = o.D || 5;
  var v = {pt:function(p){ var r = rot(p, yaw, pitch, o.ctr), f = 1 / (1 + r[2] / D); return [cx + r[0] * sc * f, cy - r[1] * sc * f, r[2]]; }, sc:sc, cx:cx, cy:cy};
  v.faceVisible = function(n){ var r = rot([n[0] + 0.5, n[1] + 0.5, n[2] + 0.5], yaw, pitch), q = rot([0.5, 0.5, 0.5], yaw, pitch); return (r[2] - q[2]) < 0; };
  return v; }
function poly(c, pts, fill, stroke, w){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath();
  if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.lineJoin = "round"; ctx.lineWidth = w || 1.4; ctx.strokeStyle = stroke; ctx.stroke(); } ctx.restore(); }
function drawCube(c, vw, hi, labels){
  var ctx = c.ctx, vis = FACES.map(function(f){ return vw.faceVisible(f[1]); });
  var pts = V.map(vw.pt), ctr = vw.pt([0.5, 0.5, 0.5]);
  FACES.forEach(function(f, fi){ if (vis[fi]) poly(c, f[0].map(function(i){ return pts[i]; }), SFA.draw.tint(P.acc, 0.045 + 0.05 * (1 + f[1][2] * 0.6 - f[1][0] * 0.3) / 2)); });
  EDGES.forEach(function(e){ var fa = [], i; FACES.forEach(function(f, fi){ var q = f[0]; for (i = 0; i < 4; i++){ var a = q[i], b = q[(i + 1) % 4]; if ((a === e[0] && b === e[1]) || (a === e[1] && b === e[0])) fa.push(fi); } });
    var visible = fa.some(function(fi){ return vis[fi]; });
    ctx.save(); ctx.strokeStyle = visible ? "#24334a" : "#a9b3c0"; ctx.lineWidth = visible ? 2.4 : 1.5; ctx.lineCap = "round"; if (!visible) ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(pts[e[0]][0], pts[e[0]][1]); ctx.lineTo(pts[e[1]][0], pts[e[1]][1]); ctx.stroke(); ctx.restore(); });
  if (labels !== false) V.forEach(function(p, i){ var q = pts[i], dx = q[0] - ctr[0], dy = q[1] - ctr[1], l = Math.hypot(dx, dy) || 1; SFA.draw.dot(c, q[0], q[1], 3, "#24334a");
    SFA.draw.text(c, NM[i], q[0] + dx / l * 14, q[1] + dy / l * 14, {size:14, color:"#0f1b2d", math:true, weight:700, bg:"rgba(255,255,255,.8)"}); });
  return pts;
}
function seg3(c, vw, a, b, col, w, dash){ var p = vw.pt(a), q = vw.pt(b); SFA.draw.line(c, p[0], p[1], q[0], q[1], col, w, dash); }
function hint(c, txt){ SFA.draw.label(c, txt || "↻ glisse pour tourner", 10, c.H - 14, {color:P.grey, align:"left", size:11.5}); }
function rotCtl(k, c, state){ /* glisser pour tourner ; élan à la relâche */
  var yaw = k.slider("Rotation", -180, 180, 5, state.yaw, "°"), pit = k.slider("Inclinaison", -80, 80, 5, state.pitch, "°");
  var last = null, vy = 0, vp = 0, spin = k.loop(function(dt){ var y = yaw.value + vy * dt, q = pit.value + vp * dt; vy *= Math.pow(0.04, dt); vp *= Math.pow(0.04, dt);
    yaw.set(((y + 180) % 360 + 360) % 360 - 180); pit.set(Math.max(-80, Math.min(80, q))); k.redraw(); if (Math.abs(vy) + Math.abs(vp) < 4) spin.pause(); });
  c.cv.style.cursor = "grab";
  c.pointer(function(type, p){ if (type === "down"){ last = p; vy = vp = 0; spin.pause(); c.cv.style.cursor = "grabbing"; }
    else if (type === "drag" && last){ var dy = (p.x - last.x) * 0.8, dp = (p.y - last.y) * 0.5; var y = yaw.value + dy, q = pit.value + dp; y = ((y + 180) % 360 + 360) % 360 - 180; yaw.set(y); pit.set(Math.max(-80, Math.min(80, q))); vy = vy * 0.5 + dy * 30 * 0.5; vp = vp * 0.5 + dp * 30 * 0.5; last = p; k.redraw(); }
    else if (type === "up"){ last = null; c.cv.style.cursor = "grab"; if (Math.abs(vy) + Math.abs(vp) > 40) spin.play(); } });
  return {yaw:function(){ return yaw.value * PI / 180; }, pitch:function(){ return pit.value * PI / 180; }, ys:yaw, ps:pit, stop:function(){ spin.pause(); }};
}
var sub = function(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }, cross = function(a, b){ return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]]; }, dot = function(a, b){ return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }, norm = function(a){ return Math.sqrt(dot(a, a)); };

/* 1. Cube : relations de deux droites */
var LN = {AB:[0,1], BC:[1,2], CD:[2,3], DA:[3,0], EF:[4,5], FG:[5,6], GH:[6,7], HE:[7,4], AE:[0,4], BF:[1,5], CG:[2,6], DH:[3,7], AC:[0,2], BD:[1,3], EG:[4,6], FH:[5,7], AF:[0,5], AG:[0,6], BH:[1,7], CE:[2,4]};
function relation(l1, l2){
  var p1 = V[LN[l1][0]], d1 = sub(V[LN[l1][1]], p1), p2 = V[LN[l2][0]], d2 = sub(V[LN[l2][1]], p2), cr = cross(d1, d2), w = sub(p2, p1);
  if (norm(cr) < 1e-9){ var same = norm(cross(w, d1)) < 1e-9; return same ? "conf" : "para"; }
  return Math.abs(dot(w, cr)) < 1e-9 ? "sec" : "gauches";
}
SFA.sim({
  id:"m5-c09-cube-droites", ch:"c09", tag:"Classique",
  titre:"Cube tournant : parallèles, sécantes ou gauches ?",
  resume:"Choisis deux droites du cube et fais-le tourner : leur position relative est exacte.",
  but:"Choisis les droites d₁ (rouge) et d₂ (bleue), puis fais tourner le cube (glisse à la souris ou au doigt). Sur le dessin, elles peuvent paraître sécantes sans l'être. Ou lance le défi : devine la relation avant de tourner le cube.",
  aRetenir:"Deux droites de l'espace sont soit coplanaires (parallèles ou sécantes), soit <b>gauches</b> (aucun plan ne les contient). Deux droites sans point commun ne sont pas forcément parallèles. Les droites sont prolongées à l'infini.",
  piege:"Sur un dessin, deux droites peuvent se croiser sans se couper : seul le raisonnement (ou une rotation) lève le doute. « Pas de point commun » ne veut pas dire « parallèles ».",
  build:function(k, S){
    var c = k.canvas(440), keys = Object.keys(LN), opts = keys.map(function(q){ return [q, "(" + q + ")"]; });
    var pending = false, score = [0, 0], answered = null;
    var s1 = k.select("Droite d₁ (rouge)", opts, "AB", function(){ pending = false; }), s2 = k.select("Droite d₂ (bleue)", opts, "CG", function(){ pending = false; });
    var rt = rotCtl(k, c, {yaw:-30, pitch:25});
    var auto = k.loop(function(dt){ rt.ys.set(((rt.ys.value + dt * 40 + 180) % 360) - 180); k.redraw(); });
    k.button("▶ Faire tourner", function(){ auto.play(); }, true); k.button("Arrêter", function(){ auto.pause(); rt.stop(); });
    k.button("🎯 Défi : question !", function(){
      var want = ["para", "sec", "gauches"][Math.floor(Math.random() * 3)], a, b, t = 0;
      do { a = keys[Math.floor(Math.random() * keys.length)]; b = keys[Math.floor(Math.random() * keys.length)]; t++; } while (relation(a, b) !== want && t < 500);
      s1.set(a); s2.set(b); pending = true; answered = null;
    });
    ["para:Parallèles", "sec:Sécantes", "gauches:Gauches"].forEach(function(q){ var v = q.split(":")[0];
      k.button(q.split(":")[1], function(){ if (!pending) return; var r = relation(s1.value, s2.value); score[1]++; if (r === v) score[0]++; answered = {ok:r === v, r:r}; pending = false; }); });
    var ro = k.readouts(["Relation", "Score du défi"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var vw = view(c, rt.yaw(), rt.pitch());
      drawCube(c, vw);
      [[s1.value, P.red], [s2.value, P.acc]].forEach(function(q, qi){ var a = V[LN[q[0]][0]], b = V[LN[q[0]][1]], d = sub(b, a), e0 = [a[0] - 0.6*d[0], a[1] - 0.6*d[1], a[2] - 0.6*d[2]], e1 = [b[0] + 0.6*d[0], b[1] + 0.6*d[1], b[2] + 0.6*d[2]]; seg3(c, vw, e0, e1, S.draw.tint(q[1], 0.55), 2.6, [7, 4]); seg3(c, vw, a, b, q[1], 4.5);
        var m = vw.pt(e1); S.draw.label(c, "d" + (qi ? "₂" : "₁"), m[0], m[1] - 12, {color:q[1], size:13}); });
      hint(c, pending ? "Observe, tourne le cube, puis réponds avec les boutons" : "↻ glisse pour tourner le cube");
      var r = relation(s1.value, s2.value);
      var txt = {conf:"confondues (même droite)", para:"parallèles (distinctes)", sec:"sécantes (un seul point commun)", gauches:"gauches (non coplanaires)"}[r];
      ro.set(0, pending ? "à deviner…" : txt); ro.set(1, score[0] + " / " + score[1]);
      var msg = {conf:"Ce sont deux noms pour la même droite.", para:"Même direction, aucun point commun : elles sont dans un même plan et ne se coupent pas.", sec:"Elles sont dans un même plan et se coupent en un point.", gauches:"Directions différentes, aucun point commun : aucun plan ne contient les deux droites. Fais tourner le cube : sur le dessin elles peuvent sembler se couper, mais ce n'est qu'un effet de perspective."}[r];
      if (pending) nt.set("<b>Défi :</b> les droites (" + s1.value + ") et (" + s2.value + ") sont-elles parallèles, sécantes ou gauches ? Tourne le cube avant de répondre.", "warn");
      else if (answered) nt.set((answered.ok ? "<b>Bravo !</b> " : "<b>Pas tout à fait.</b> ") + "(" + s1.value + ") et (" + s2.value + ") : <b>" + txt + "</b>. " + msg, answered.ok ? "ok" : "warn");
      else nt.set("(" + s1.value + ") et (" + s2.value + ") : <b>" + txt + "</b>. " + msg, r === "gauches" ? "warn" : "ok");
    });
  }
});

/* 2. Section plane d'un cube */
function sectionPoly(n, d){
  var pts = [];
  EDGES.forEach(function(e){ var p0 = V[e[0]], p1 = V[e[1]], dv = sub(p1, p0), den = dot(n, dv), num = d - dot(n, p0);
    if (Math.abs(den) < 1e-12){ if (Math.abs(num) < 1e-9){ pts.push(p0, p1); } return; }
    var t = num / den; if (t >= -1e-9 && t <= 1 + 1e-9) pts.push([p0[0] + t*dv[0], p0[1] + t*dv[1], p0[2] + t*dv[2]]); });
  var u = []; pts.forEach(function(p){ if (!u.some(function(q){ return norm(sub(p, q)) < 1e-6; })) u.push(p); });
  if (u.length < 3) return u;
  var cen = [0, 0, 0]; u.forEach(function(p){ cen = [cen[0] + p[0]/u.length, cen[1] + p[1]/u.length, cen[2] + p[2]/u.length]; });
  var nn = norm(n), nu = [n[0]/nn, n[1]/nn, n[2]/nn], ax = Math.abs(nu[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = cross(nu, ax), l1 = norm(e1); e1 = [e1[0]/l1, e1[1]/l1, e1[2]/l1]; var e2 = cross(nu, e1);
  u.sort(function(a, b){ var da = sub(a, cen), db = sub(b, cen); return Math.atan2(dot(da, e2), dot(da, e1)) - Math.atan2(dot(db, e2), dot(db, e1)); });
  return u;
}
SFA.sim({
  id:"m5-c09-section", ch:"c09", tag:"Classique",
  titre:"Section d'un cube par un plan",
  resume:"Fais glisser un plan à travers un cube : triangle, carré, pentagone ou hexagone ?",
  but:"Choisis une section prédéfinie, ou règle toi-même l'orientation du plan (nx, ny, nz) puis fais-le glisser avec d. Combien de côtés a la section ? Quand est-elle régulière ? Tourne le cube pour la voir sous tous les angles.",
  aRetenir:"La section d'un cube (arête 1) par le plan nx·x + ny·y + nz·z = d est un polygone dont chaque côté est dans une face. Il a au plus 6 côtés (un par face). Les côtés situés dans des faces parallèles sont parallèles. Un plan perpendiculaire à la grande diagonale AG passant par le centre donne un hexagone régulier.",
  piege:"Un plan ne coupe pas forcément toutes les faces : le nombre de côtés dépend de l'orientation et de la position. Et une section peut être réduite à un point, un segment ou une face entière.",
  build:function(k, S){
    var c = k.canvas(440);
    var PRESET = {tri:[1,1,1,0.5], car:[1,0,0,0.5], rec:[1,1,0,1], pen:[1,1,2,1.5], hex:[1,1,1,1.5]};
    var pre = k.seg("Sections à essayer", [["tri", "Triangle"], ["car", "Carré"], ["rec", "Rectangle"], ["pen", "Pentagone"], ["hex", "Hexagone"]], "hex", function(v){ var q = PRESET[v]; nx.set(q[0]); ny.set(q[1]); nz.set(q[2]); dd.set(q[3]); });
    var nx = k.slider("nx", 0, 3, 1, 1, "", function(){ pre.set(""); }), ny = k.slider("ny", 0, 3, 1, 1, "", function(){ pre.set(""); }), nz = k.slider("nz", 0, 3, 1, 1, "", function(){ pre.set(""); });
    var dd = k.slider("d (position du plan)", 0, 9, 0.05, 1.5, "", function(){ pre.set(""); });
    var rt = rotCtl(k, c, {yaw:45, pitch:30});
    var ro = k.readouts(["Sommets de la section", "Nature", "Côtés égaux ?", "d autorisé"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var n = [nx.value, ny.value, nz.value], vw = view(c, rt.yaw(), rt.pitch());
      if (n[0] === 0 && n[1] === 0 && n[2] === 0){ drawCube(c, vw); hint(c); nt.set("Choisis au moins une composante non nulle : un plan a besoin d'une direction normale.", "warn"); return; }
      var dmax = n[0] + n[1] + n[2], d = Math.min(dd.value, dmax), poly_ = sectionPoly(n, d);
      drawCube(c, vw, null, false);
      var ctx = c.ctx;
      if (poly_.length >= 3){ var q = poly_.map(vw.pt); poly(c, q, S.draw.tint(P.red, 0.32), P.red, 2.8); q.forEach(function(p){ S.draw.dot(c, p[0], p[1], 4.5, P.red); }); }
      else if (poly_.length) poly_.map(vw.pt).forEach(function(p){ S.draw.dot(c, p[0], p[1], 5, P.red); });
      var pts = V.map(vw.pt), ctr = vw.pt([0.5, 0.5, 0.5]);
      V.forEach(function(p, i){ var qq = pts[i], dx = qq[0] - ctr[0], dy = qq[1] - ctr[1], l = Math.hypot(dx, dy) || 1; S.draw.text(c, NM[i], qq[0] + dx / l * 14, qq[1] + dy / l * 14, {size:13, math:true, weight:700, color:P.ink}); });
      hint(c);
      var m = poly_.length, nat = "—", eq = "—";
      if (m < 3) nat = m === 0 ? "le plan ne coupe pas le cube" : m === 1 ? "un point (sommet)" : "un segment (arête)";
      else {
        var sd = poly_.map(function(p, i){ return norm(sub(poly_[(i + 1) % m], p)); }), alleq = sd.every(function(x){ return Math.abs(x - sd[0]) < 1e-6; });
        eq = alleq ? "oui" : "non";
        if (m === 3) nat = alleq ? "triangle équilatéral" : "triangle";
        else if (m === 4){ var rect = Math.abs(dot(sub(poly_[1], poly_[0]), sub(poly_[2], poly_[1]))) < 1e-6, par = Math.abs(sd[0] - sd[2]) < 1e-6 && Math.abs(sd[1] - sd[3]) < 1e-6; nat = rect ? (alleq ? "carré" : "rectangle") : par ? (alleq ? "losange" : "parallélogramme") : "trapèze"; }
        else if (m === 5) nat = "pentagone";
        else nat = alleq && (n[0] === n[1] && n[1] === n[2]) ? "hexagone régulier" : "hexagone" + (alleq ? " (côtés égaux)" : "");
      }
      S.draw.label(c, m >= 3 ? nat + " · " + m + " côtés" : nat, c.W / 2, 22, {color:P.red, size:14});
      ro.set(0, String(m)); ro.set(1, nat); ro.set(2, eq); ro.set(3, "0 à " + F(dmax, 0));
      nt.set("Plan " + n[0] + "x + " + n[1] + "y + " + n[2] + "z = " + F(d, 2) + ". " + (m >= 3 ? "La section a " + m + " côtés : " + nat + ". Les côtés appartenant à deux faces opposées sont parallèles." : "Section dégénérée : " + nat + ".") + (n[0] === n[1] && n[1] === n[2] && Math.abs(d - dmax / 2) < 1e-6 ? " Plan perpendiculaire à la grande diagonale, passant par le centre : c'est l'hexagone régulier." : ""), "ok");
    });
  }
});

/* 3. Perspective cavalière */
SFA.sim({
  id:"m5-c09-cavaliere", ch:"c09", tag:"Représentation",
  titre:"La perspective cavalière déforme (et conserve)",
  resume:"Règle l'angle de fuite et le coefficient de réduction : qu'est-ce qui est conservé ?",
  but:"Glisse l'extrémité rouge de la fuyante (ou règle α et k). Compare l'angle apparent et la longueur apparente aux vraies mesures du cube d'arête 4 cm, dessiné en vraie 3D en haut à droite.",
  aRetenir:"En perspective cavalière : la face de devant est en vraie grandeur ; les arêtes de profondeur sont dessinées à l'angle α avec la horizontale et réduites du coefficient k ; les droites parallèles restent parallèles, les milieux restent des milieux, les rapports de longueurs sur une même direction sont conservés.",
  piege:"Les angles droits et les longueurs des fuyantes ne sont pas conservés : l'angle B̂AA′ est droit dans la réalité mais mesure α sur le dessin. On ne mesure pas au rapporteur sur une perspective.",
  build:function(k, S){
    var c = k.canvas(440);
    var pre = k.seg("Réglages classiques", [["a", "45° · ½"], ["b", "30° · ⅔"], ["c", "60° · ⅓"]], "a", function(v){ var q = {a:[45, 0.5], b:[30, 2/3], c:[60, 1/3]}[v]; al.set(q[0]); kc.set(Math.round(q[1] * 10) / 10 === 0.7 ? 0.7 : q[1]); });
    var al = k.slider("Angle de fuite α", 15, 75, 5, 45, "°", function(){ pre.set(""); }), kc = k.slider("Coefficient k", 0.3, 1, 0.05, 0.5, "", function(){ pre.set(""); });
    var ro = k.readouts(["Angle apparent (AB, AA′)", "Angle réel", "Arête de profondeur : dessin", "Diagonale BG′ : dessin / réelle"]);
    var nt = k.note("", "ok");
    var geo = null, drag = false;
    c.pointer(function(type, p){
      if (!geo) return;
      if (type === "down") drag = Math.hypot(p.x - geo.hx, p.y - geo.hy) < 34;
      if ((type === "down" || type === "drag") && drag){
        var dx = p.x - geo.ox, dy = geo.oy - p.y, a = Math.atan2(dy, Math.max(dx, 1)) * 180 / PI, len = Math.hypot(dx, dy) / geo.s;
        al.set(Math.round(Math.max(15, Math.min(75, a)) / 5) * 5); kc.set(Math.round(Math.max(0.3, Math.min(1, len)) * 20) / 20); pre.set(""); k.redraw();
      }
      if (type === "up") drag = false;
    });
    k.draw(function(){
      c.clear(); var a = al.value * PI / 180, K = kc.value, s = Math.min(c.W * 0.4, (c.H - 120) / (1 + K * Math.sin(a)), (c.W - 90) / (1 + K * Math.cos(a))), ox = 36, oy = c.H - 52, dx = K * s * Math.cos(a), dy = K * s * Math.sin(a);
      var pt = function(x, y, z){ return [ox + x * s + z * dx, oy - y * s - z * dy]; };
      var edge = function(p, q, hid){ S.draw.line(c, p[0], p[1], q[0], q[1], hid ? "#a9b3c0" : "#24334a", hid ? 1.5 : 2.4, hid ? [4, 4] : null); };
      var Fv = [pt(0,0,0), pt(1,0,0), pt(1,1,0), pt(0,1,0)], Bk = [pt(0,0,1), pt(1,0,1), pt(1,1,1), pt(0,1,1)];
      /* faces : devant (vraie grandeur), dessus, côté */
      poly(c, Fv, S.draw.tint(P.acc, 0.14)); poly(c, [Fv[3], Fv[2], Bk[2], Bk[3]], S.draw.tint(P.acc, 0.07)); poly(c, [Fv[1], Bk[1], Bk[2], Fv[2]], S.draw.tint(P.acc, 0.1));
      edge(Bk[0], Bk[1], true); edge(Bk[0], Bk[3], true); edge(Fv[0], Bk[0], true);
      edge(Bk[1], Bk[2], false); edge(Bk[3], Bk[2], false);
      for (var i = 0; i < 4; i++){ edge(Fv[i], Fv[(i + 1) % 4], false); edge(Fv[i], Bk[i], i !== 0); }
      /* angle α et angle droit de la face avant */
      var ctx = c.ctx; ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(Fv[0][0], Fv[0][1], 30, -a, 0); ctx.stroke(); ctx.restore();
      S.draw.label(c, "α = " + F(al.value, 0) + "°", Fv[0][0] + 38, Fv[0][1] - 10, {color:P.red, align:"left", size:12});
      ctx.save(); ctx.strokeStyle = P.grey; ctx.lineWidth = 1.5; ctx.strokeRect(Fv[0][0] + 1, Fv[0][1] - 11, 10, 10); ctx.restore();
      var M = pt(0, 0, 0.5); S.draw.dot(c, M[0], M[1], 5, P.red);
      S.draw.text(c, "A", Fv[0][0] - 13, Fv[0][1] + 12, {size:14, math:true}); S.draw.text(c, "B", Fv[1][0] + 12, Fv[1][1] + 12, {size:14, math:true}); S.draw.text(c, "D", Fv[3][0] - 12, Fv[3][1] - 8, {size:14, math:true});
      S.draw.text(c, "A′", Bk[0][0] - 20, Bk[0][1] - 14, {size:14, math:true}); S.draw.text(c, "M", M[0] - 13, M[1] + 8, {size:14, color:P.red, math:true}); S.draw.text(c, "G′", Bk[2][0] + 14, Bk[2][1] - 6, {size:14, math:true});
      S.draw.line(c, Fv[0][0], Fv[0][1], Bk[0][0], Bk[0][1], P.red, 3.5);
      geo = {ox:Fv[0][0], oy:Fv[0][1], s:s, hx:Bk[0][0], hy:Bk[0][1]};
      S.draw.glow(c, Bk[0][0], Bk[0][1], 18, P.red, 0.45); S.draw.dot(c, Bk[0][0], Bk[0][1], 7, P.red);
      S.draw.label(c, "↔ glisse A′", Bk[0][0] + 12, Bk[0][1] - 20, {color:P.red, align:"left", size:11.5});
      /* le vrai cube, en haut à droite */
      var iw = Math.min(124, c.W * 0.36); S.draw.panel(c, c.W - iw - 8, 8, iw, iw, {fill:"#fafbfd", stroke:"#e3e7ed", radius:10, shadow:false});
      var vw = view(c, -0.55, 0.42, iw * 0.3, {cx:c.W - iw / 2 - 8, cy:8 + iw / 2 + 4}); var ip = V.map(vw.pt), ctr = vw.pt([0.5, 0.5, 0.5]);
      EDGES.forEach(function(e){ S.draw.line(c, ip[e[0]][0], ip[e[0]][1], ip[e[1]][0], ip[e[1]][1], "#24334a", 1.6); });
      S.draw.line(c, ip[0][0], ip[0][1], ip[4][0], ip[4][1], P.red, 3);
      S.draw.text(c, "en vrai : 90°", c.W - iw / 2 - 8, 8 + iw - 9, {size:10.5, color:P.grey});
      var diagApp = Math.sqrt(Math.pow(Bk[2][0] - Fv[1][0], 2) + Math.pow(Bk[2][1] - Fv[1][1], 2)) / s * 4;
      ro.set(0, F(al.value, 0) + "°"); ro.set(1, "90°"); ro.set(2, F(4 * K, 1) + " cm (vraie : 4 cm)");
      var diagReal = 4 * Math.SQRT2; ro.set(3, F(diagApp, 2) + " cm / " + F(diagReal, 2) + " cm");
      nt.set("Le point M, milieu de [AA′], est dessiné au milieu de [AA′] : le milieu est conservé. Mais AA′ (arête vraie : 4 cm) est dessinée " + F(4 * K, 1) + " cm, et l'angle B̂AA′ (90° en réalité) est dessiné " + F(al.value, 0) + "°.", "ok");
    });
  }
});

/* 4. Droites gauches */
SFA.sim({
  id:"m5-c09-gauches", ch:"c09", tag:"Niche utile",
  titre:"De sécantes à gauches à parallèles",
  resume:"d₁ est fixe, d₂ glisse : à quel moment passe-t-on de sécantes à gauches ?",
  but:"d₁ (rouge) est l'axe horizontal du sol. d₂ (bleue) est à la hauteur h et tourne d'un angle φ. Trouve les valeurs de h et φ qui rendent les droites sécantes, gauches, puis parallèles (essaie les boutons, puis tourne la scène).",
  aRetenir:"Si h = 0, d₂ est dans le plan du sol, comme d₁ : sécantes (φ ≠ 0) ou parallèles (φ = 0). Si h ≠ 0 et φ ≠ 0, aucun plan ne contient les deux droites : gauches, à distance h l'une de l'autre. Si h ≠ 0 et φ = 0, elles sont parallèles dans deux plans horizontaux.",
  piege:"Gauches ne veut pas dire « loin » : pour h très petit mais non nul, les droites restent gauches. Et il suffit que h = 0 pour les rendre coplanaires.",
  build:function(k, S){
    var c = k.canvas(440);
    var h = k.slider("Hauteur h de d₂", 0, 2, 0.25, 1, "", function(){ pre.set(""); }), ph = k.slider("Angle φ de d₂", 0, 90, 15, 45, "°", function(){ pre.set(""); });
    var pre = k.seg("Cas types", [["s", "Sécantes"], ["g", "Gauches"], ["p", "Parallèles"]], "g", function(v){ var q = {s:[0, 45], g:[1, 45], p:[1, 0]}[v]; h.set(q[0]); ph.set(q[1]); });
    var rt = rotCtl(k, c, {yaw:-35, pitch:30});
    var ro = k.readouts(["Relation", "Distance entre les droites"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var H = h.value, f = ph.value * PI / 180, ctx = c.ctx, R = 3;
      var vw = view(c, rt.yaw(), rt.pitch(), Math.min(c.W * 0.105, c.H * 0.15), {ctr:[0, 0, 0.8], D:14});
      var sq = function(z, col, edge){ var pp = [[-R, -R, z], [R, -R, z], [R, R, z], [-R, R, z]].map(vw.pt); poly(c, pp, col, edge, 1.4); };
      var gridG = function(z){ ctx.save(); ctx.strokeStyle = "rgba(138,149,163,.35)"; ctx.lineWidth = 1; for (var t = -R + 1; t < R; t += 1){ var a = vw.pt([t, -R, z]), b = vw.pt([t, R, z]), a2 = vw.pt([-R, t, z]), b2 = vw.pt([R, t, z]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke(); } ctx.restore(); };
      var para = Math.abs(Math.sin(f)) < 1e-9, rel = para ? "parallèles" : H === 0 ? "sécantes" : "gauches";
      var dv = [Math.cos(f), Math.sin(f), 0], p0 = [0, 1, H];
      var up = function(){ if (H > 0){ sq(H, S.draw.tint(P.acc, 0.1), S.draw.tint(P.acc, 0.5)); S.draw.label(c, "plan z = h", vw.pt([R, R, H])[0] - 4, vw.pt([R, R, H])[1] + 16, {color:P.acc, align:"right", size:11}); } seg3(c, vw, [p0[0] - 3.6 * dv[0], p0[1] - 3.6 * dv[1], H], [p0[0] + 3.6 * dv[0], p0[1] + 3.6 * dv[1], H], P.acc, 4.5); var e = vw.pt([p0[0] + 3.6 * dv[0], p0[1] + 3.6 * dv[1], H]); S.draw.label(c, "d₂", e[0], e[1] - 12, {color:P.acc, size:13}); };
      var low = function(){ sq(0, "rgba(138,149,163,.16)", "rgba(138,149,163,.6)"); gridG(0); seg3(c, vw, [-R, 0, 0], [R, 0, 0], P.red, 4.5); var e = vw.pt([R, 0, 0]); S.draw.label(c, "d₁", e[0] + 14, e[1], {color:P.red, size:13}); };
      var perp = function(){ if (rel === "gauches"){ var x0 = -Math.cos(f) / Math.sin(f); if (Math.abs(x0) <= R){ seg3(c, vw, [x0, 0, 0], [x0, 0, H], P.green, 3.5, [5, 3]); var m = vw.pt([x0, 0, H / 2]); S.draw.label(c, "h = " + F(H, 2), m[0] + 14, m[1], {color:P.green, align:"left", size:12}); } } };
      if (rt.pitch() >= 0){ low(); perp(); up(); } else { up(); perp(); low(); }
      hint(c);
      var dist = para ? Math.sqrt(1 + H * H) : H;
      ro.set(0, rel); ro.set(1, rel === "sécantes" ? "0 (point commun)" : F(dist, 2));
      nt.set(rel === "sécantes" ? "h = 0 : d₂ est dans le plan du sol avec d₁ ; sa direction diffère (φ ≠ 0) : elles se coupent au point d'abscisse " + F(-Math.cos(f) / Math.sin(f), 2) + "." : rel === "gauches" ? "h > 0 et φ ≠ 0 : pas de point commun, pas parallèles, aucun plan commun. La distance entre les droites est h (segment vert, mesuré verticalement)." : "Même direction : parallèles. Elles sont dans un même plan, à distance " + F(dist, 2) + ".", rel === "gauches" ? "warn" : "ok");
    });
  }
});
})();
