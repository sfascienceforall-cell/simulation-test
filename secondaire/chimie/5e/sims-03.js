/* Chapitre 3 · Géométrie des molécules et solides cristallins */
C5.rot = function(v, yaw, pitch){
  var x1 = v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw), z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw);
  var y2 = v[1] * Math.cos(pitch) - z1 * Math.sin(pitch), z2 = v[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  return [x1, y2, z2];
};
C5.drag3d = function(c, st){   /* le pointeur fait tourner la molécule ; st = {yaw, pitch} */
  var last = null;
  c.pointer(function(type, p){
    if (type === "down"){ last = p; }
    else if (type === "drag" && last){ st.yaw += (p.x - last.x) * 0.012; st.pitch = Math.max(-1.4, Math.min(1.4, st.pitch + (p.y - last.y) * 0.012)); last = p; st.dirty = true; }
    else if (type === "up"){ last = null; }
  });
};

SFA.sim({
  id: "c5-c03-vsepr", ch: "c03", tag: "Classique",
  titre: "VSEPR : la forme vient des doublets qui se repoussent",
  resume: "Doublets liants et non liants autour de l'atome central → forme 3D et angles.",
  but: "Choisis le nombre de doublets liants et non liants. Fais tourner la molécule en glissant le doigt ou la souris. Retrouve H₂O (2 liants, 2 non liants), NH₃, CH₄, CO₂…",
  aRetenir: "On compte les doublets autour de l'atome central (liants + non liants) : 2 → linéaire (180°), 3 → triangle (120°), 4 → tétraèdre (109,5°), 5 → bipyramide trigonale, 6 → octaèdre (90°). Les doublets non liants occupent de la place mais ne sont pas « vus » dans le nom de la forme.",
  piege: "Le schéma de Lewis est plat : la molécule, elle, est en 3D. Et la forme de H₂O (coudée) n'est PAS celle des doublets (tétraèdre) : on nomme la forme d'après les atomes seulement. Les doublets non liants repoussent un peu plus fort : les vrais angles (107° pour NH₃, 104,5° pour H₂O) sont un peu plus petits que 109,5°.",
  build: function(k, S){
    var pal = S.draw.palette, st = {yaw: 0.6, pitch: 0.35};
    var TET = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(function(v){ return v.map(function(x){ return x / Math.sqrt(3); }); });
    var DIR = {2: [[1,0,0],[-1,0,0]], 3: [[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]], 4: TET,
      5: [[0,0,1],[0,0,-1],[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]], 6: [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]};
    var TAB = {
      "2,0": ["linéaire", "180°", "CO₂, BeCl₂"], "3,0": ["triangulaire plane", "120°", "BF₃"], "2,1": ["coudée", "≈ 120° (SO₂ : 119°)", "SO₂"],
      "4,0": ["tétraédrique", "109,5°", "CH₄"], "3,1": ["pyramidale à base triangulaire", "≈ 107° (NH₃)", "NH₃"], "2,2": ["coudée", "≈ 104,5° (H₂O)", "H₂O"],
      "5,0": ["bipyramide trigonale", "90° et 120°", "PCl₅"], "4,1": ["en bascule", "< 90° et < 120°", "SF₄"], "3,2": ["en T", "≈ 90°", "ClF₃"], "2,3": ["linéaire", "180°", "XeF₂"],
      "6,0": ["octaédrique", "90°", "SF₆"], "5,1": ["pyramide à base carrée", "≈ 90°", "BrF₅"], "4,2": ["plane carrée", "90°", "XeF₄"]
    };
    var MOLS = [["2,0", "CO₂ (2 liants, 0 non liant)"], ["3,0", "BF₃"], ["4,0", "CH₄"], ["3,1", "NH₃"], ["2,2", "H₂O"], ["2,1", "SO₂"], ["5,0", "PCl₅"], ["4,1", "SF₄"], ["6,0", "SF₆"], ["4,2", "XeF₄"]];
    var NOMS = {"2,0": "CO₂", "3,0": "BF₃", "4,0": "CH₄", "3,1": "NH₃", "2,2": "H₂O", "2,1": "SO₂", "5,0": "PCl₅", "4,1": "SF₄", "6,0": "SF₆", "4,2": "XeF₄"};
    var c = k.canvas(340);
    var b = k.slider("Doublets liants (atomes liés)", 2, 6, 1, 2, "");
    var l = k.slider("Doublets non liants", 0, 3, 1, 2, "");
    var pick = k.select("Ou choisis une molécule connue", MOLS, "2,2", function(v){ var q = v.split(","); b.set(+q[0]); l.set(+q[1]); });
    var poly = k.toggle("Montrer le polyèdre des doublets", true);
    var auto = k.toggle("Rotation automatique", true);
    var ro = k.readouts(["Doublets autour de A", "Forme de la molécule", "Angles idéaux", "Exemple"]);
    var nt = k.note("", "");
    var dnn = k.note("Appuie sur « Défi suivant » : construis la molécule demandée avec les curseurs.", ""), keys = Object.keys(NOMS), di = -1;
    k.button("Défi suivant", function(){ di = (di + 1) % keys.length; }, true);
    C5.drag3d(c, st);
    var lp = k.loop(function(dt){ if (auto.value && !st.dragging) st.yaw += dt * 0.5; k.redraw(); }); lp.play();
    k.draw(function(){
      var nb = b.value, nl = l.value, tot = nb + nl, key = nb + "," + nl; c.clear();
      var info = TAB[key], ctx = c.ctx, cx = c.W / 2, cy = c.H / 2 - 4;
      if (di >= 0){ var tg = keys[di].split(","); var good = (+tg[0] === nb && +tg[1] === nl); dnn.set("<b>Défi.</b> Construis " + NOMS[keys[di]] + " : " + tg[0] + " doublets liants et " + tg[1] + " non liant(s)." + (good ? " ✔ Réussi : " + info[0] + "." : ""), good ? "ok" : ""); }
      if (!info){
        S.draw.text(c, "Combinaison non traitée", cx, cy - 10, {size: 16, color: pal.red});
        S.draw.text(c, tot > 6 ? "plus de 6 doublets autour de A" : "elle ne figure pas au programme", cx, cy + 14, {size: 13, color: pal.grey});
        ro.set(0, tot); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—");
        nt.set(tot > 6 ? "Plus de 6 doublets autour de l'atome central : non traité à ce niveau." : "Cette combinaison n'est pas courante : elle ne figure pas dans le programme.", "warn"); return;
      }
      var dirs = DIR[tot], R = Math.min(118, c.H / 2 - 40), items = [], i, j;
      /* en bipyramide, les doublets non liants vont à l'équateur ; sinon les premiers de la liste */
      var order = [], idx = tot === 5 ? [2, 3, 4, 0, 1] : dirs.map(function(_, q){ return q; });
      for (i = 0; i < tot; i++) order.push(idx[i]);
      for (i = 0; i < tot; i++){ var v = C5.rot(dirs[order[i]], st.yaw, st.pitch); items.push({v: v, lone: i < nl}); }
      var P = function(v, f){ var s = 1 / (1 - 0.1 * v[2]); return [cx + R * f * v[0] * s, cy - R * f * v[1] * s, s]; };
      /* polyèdre des doublets */
      if (poly.value && tot >= 3){
        var md = 9; for (i = 0; i < tot; i++) for (j = i + 1; j < tot; j++){ var q1 = items[i].v, q2 = items[j].v; md = Math.min(md, Math.hypot(q1[0] - q2[0], q1[1] - q2[1], q1[2] - q2[2])); }
        ctx.save(); ctx.strokeStyle = "rgba(95,107,122,.45)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
        for (i = 0; i < tot; i++) for (j = i + 1; j < tot; j++){ var u1 = items[i].v, u2 = items[j].v; if (Math.hypot(u1[0] - u2[0], u1[1] - u2[1], u1[2] - u2[2]) < md * 1.2){ var p1 = P(u1, 1), p2 = P(u2, 1); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); } }
        ctx.restore();
      }
      var all = items.map(function(it){ return it; }); all.push({v: [0, 0, 0], center: true});
      all.sort(function(p, q){ return p.v[2] - q.v[2]; });
      all.forEach(function(it){
        if (it.center){ S.draw.glow(c, cx, cy, 34, "#8fd3b8", 0.35); C5.atom(c, cx, cy, 20, C5.CPK.A, "A"); return; }
        var p = P(it.v, 1), ang = Math.atan2(p[1] - cy, p[0] - cx);
        if (it.lone){
          var q = P(it.v, 0.58), g = ctx.createRadialGradient(q[0], q[1], 2, q[0], q[1], 30 * q[2]);
          ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(ang);
          g.addColorStop(0, "rgba(255,176,170,.95)"); g.addColorStop(1, "rgba(232,89,74,.28)");
          ctx.translate(-q[0], -q[1]); ctx.translate(q[0], q[1]);
          var gg = ctx.createRadialGradient(0, 0, 1, 0, 0, 30 * q[2]); gg.addColorStop(0, "rgba(255,190,184,.95)"); gg.addColorStop(1, "rgba(232,89,74,.3)");
          ctx.fillStyle = gg; ctx.strokeStyle = "rgba(192,50,29,.7)"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.ellipse(0, 0, 30 * q[2], 16 * q[2], 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
          S.draw.dot(c, q[0] - 6 * Math.cos(ang), q[1] - 6 * Math.sin(ang), 2.8, pal.red); S.draw.dot(c, q[0] + 6 * Math.cos(ang), q[1] + 6 * Math.sin(ang), 2.8, pal.red);
        } else {
          S.draw.line(c, cx, cy, p[0], p[1], "#2c3a4e", 4.2 * p[2]); S.draw.line(c, cx, cy, p[0], p[1], "#dfe7f1", 1.3);
          C5.atom(c, p[0], p[1], 14 * p[2], C5.CPK.X, "X");
        }
      });
      S.draw.legend(c, [[pal.ink, "liaison A–X"], [pal.red, "doublet non liant"]], 8, c.H - 48);
      S.draw.text(c, "glisse pour tourner", c.W - 10, c.H - 12, {size: 11.5, color: pal.grey, align: "right"});
      S.draw.label(c, info[0], cx, 20, {color: pal.acc, size: 14});
      ro.set(0, tot + " (" + nb + " liants + " + nl + " non liants)"); ro.set(1, info[0]); ro.set(2, info[1]); ro.set(3, info[2]);
      nt.set(nl > 0 ? "Les " + nl + " doublet(s) non liant(s) occupent de l'espace (lobes roses) mais on ne les compte pas dans le nom : la forme est celle des atomes X autour de A." : "Aucun doublet non liant : la forme est celle des doublets.", "");
    });
  }
});

/* rendu 3D « en volume » (sphères ombrées, liaisons en cylindre) pour la polarité et la glace */
C5.hexRGB = function(h){ h = String(h); if (/^#[0-9a-f]{3}$/i.test(h)) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]; var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h); return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [150, 150, 150]; };
C5.mix = function(h, f){ var r = C5.hexRGB(h); return "rgb(" + r.map(function(v){ return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); }).join(",") + ")"; };
C5.ball3 = function(ctx, x, y, r, hex, a){
  if (!(r > 0)) return; ctx.save(); if (a != null) ctx.globalAlpha = a;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.06, x, y, r * 1.04);
  g.addColorStop(0, C5.mix(hex, 0.8)); g.addColorStop(0.45, hex); g.addColorStop(1, C5.mix(hex, -0.48));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore();
};
C5.stick3 = function(ctx, x1, y1, x2, y2, w, c1, c2){   /* liaison : deux demi-cylindres aux couleurs des atomes */
  var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, nx = -dy / l * w / 2, ny = dx / l * w / 2;
  [[x1, y1, mx, my, c1], [mx, my, x2, y2, c2]].forEach(function(q){
    var g = ctx.createLinearGradient(q[0] + nx, q[1] + ny, q[0] - nx, q[1] - ny); g.addColorStop(0, C5.mix(q[4], -0.35)); g.addColorStop(0.35, C5.mix(q[4], 0.45)); g.addColorStop(1, C5.mix(q[4], -0.45));
    ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[2], q[3]); ctx.stroke(); ctx.restore();
  });
};
C5.sym3 = function(ctx, t, x, y, size){ ctx.save(); ctx.font = "800 " + Math.round(size) + "px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.strokeText(t, x, y); ctx.fillStyle = "#fff"; ctx.fillText(t, x, y); ctx.restore(); };
C5.cvF = C5.cvF || function(k, fn){
  var c = k.canvas(0, {ratio: 0.6});
  Object.defineProperty(c, "ratio", {get: function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); return fn(w) / w; }, configurable: true});
  c.resize(); return c;
};

SFA.sim({
  id: "c5-c03-polarite", ch: "c03", tag: "3D",
  titre: "Polarité globale : somme de vecteurs",
  resume: "Chaque liaison a un dipôle ; la molécule est polaire seulement si la somme n'est pas nulle.",
  but: "Choisis une molécule et fais-la tourner en la glissant à la souris ou au doigt. Le nuage coloré montre où sont les électrons (bleu = δ⁻, rouge = δ⁺). Affiche les dipôles de liaison puis la résultante, puis charge les plaques : la molécule polaire s'oriente, l'apolaire non. Compare CO₂ et H₂O, CH₄ et CH₃Cl.",
  aRetenir: "Une molécule est polaire si la somme vectorielle de ses dipôles de liaison n'est pas nulle. Il faut donc ΔEN ≠ 0 ET une géométrie qui ne compense pas les dipôles. CO₂, BF₃, CCl₄ : liaisons polaires, molécule apolaire (CH₄ : liaisons à peine polaires, ΔEN = 0,4, et molécule apolaire).",
  piege: "« Liaison polaire » ne veut pas dire « molécule polaire ». Remplacer un seul atome dans une molécule symétrique casse la symétrie : CH₄ est apolaire, CH₃Cl est polaire. Ici le dipôle est représenté par ΔEN (unités arbitraires), pas par un vrai moment dipolaire en debye.",
  build: function(k, S){
    var pal = S.draw.palette, EN = C5.EN, st = {yaw: 0.5, pitch: 0.3, drag: false, lx: 0, ly: 0};
    var TET = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(function(v){ return v.map(function(x){ return x / Math.sqrt(3); }); });
    function bent(th){ var h = th * Math.PI / 360; return [[Math.cos(h), Math.sin(h), 0], [Math.cos(h), -Math.sin(h), 0]]; }
    function pyr(th){ var s = 2 / Math.sqrt(3) * Math.sin(th * Math.PI / 360), ca = Math.sqrt(1 - s * s), o = []; for (var i = 0; i < 3; i++){ var a = i * 2 * Math.PI / 3; o.push([s * Math.cos(a), s * Math.sin(a), -ca]); } return o; }
    var TRI = [[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]];
    function M(name, cen, lig, dirs){ return {name: name, cen: cen, lig: lig, dirs: dirs}; }
    var MOL = {
      CO2: M("CO₂", "C", ["O", "O"], [[1,0,0],[-1,0,0]]),
      H2O: M("H₂O", "O", ["H", "H"], bent(104.5)),
      NH3: M("NH₃", "N", ["H", "H", "H"], pyr(107)),
      BF3: M("BF₃", "B", ["F", "F", "F"], TRI),
      SO2: M("SO₂", "S", ["O", "O"], bent(119)),
      CH4: M("CH₄", "C", ["H", "H", "H", "H"], TET),
      CCl4: M("CCl₄", "C", ["Cl", "Cl", "Cl", "Cl"], TET),
      CH3Cl: M("CH₃Cl", "C", ["H", "H", "H", "Cl"], TET),
      CHCl3: M("CHCl₃", "C", ["H", "Cl", "Cl", "Cl"], TET)
    };
    var COL = {H: "#eef1f6", C: "#59636f", N: "#4f7be0", O: "#e8594a", F: "#86d06f", Cl: "#3fb878", S: "#e8c63a", B: "#eba98a"};
    var RAD = {H: 0.55, C: 0.78, N: 0.76, O: 0.76, F: 0.72, Cl: 0.92, S: 0.95, B: 0.8};
    var c = C5.cvF(k, function(w){ return Math.round(w * (w < 460 ? 1.06 : 0.74)); });
    var sel = k.select("Molécule", Object.keys(MOL).map(function(x){ return [x, MOL[x].name]; }), "H2O");
    var showC = k.toggle("Montrer le nuage de charge", true);
    var showB = k.toggle("Montrer les dipôles de liaison", true), showN = k.toggle("Montrer la résultante", true);
    var field = k.toggle("Placer la molécule entre deux plaques chargées", false);
    k.button("⚡ Charger / décharger les plaques", function(){ field.set(!field.value); }, true);
    var ro = k.readouts(["Liaisons polaires ?", "Résultante", "Molécule"]);
    var nt = k.note("", "");
    var al = {f: 0}, T = 0;
    c.pointer(function(type, p){
      if (type === "down"){ st.drag = true; st.lx = p.x; st.ly = p.y; }
      else if (type === "drag" && st.drag){ st.yaw += (p.x - st.lx) * 0.012; st.pitch = Math.max(-1.4, Math.min(1.4, st.pitch + (p.y - st.ly) * 0.012)); st.lx = p.x; st.ly = p.y; }
      else if (type === "up") st.drag = false;
    });
    var lp = k.loop(function(dt, t){ T = t; al.f += ((field.value ? 1 : 0) - al.f) * Math.min(1, dt * 2.2); if (!st.drag && al.f < 0.02) st.yaw += dt * 0.35; k.redraw(); }); lp.play();
    function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function rodr(v, ax, ang){ var cs = Math.cos(ang), sn = Math.sin(ang), cr = cross(ax, v), dt = ax[0] * v[0] + ax[1] * v[1] + ax[2] * v[2]; return [v[0] * cs + cr[0] * sn + ax[0] * dt * (1 - cs), v[1] * cs + cr[1] * sn + ax[1] * dt * (1 - cs), v[2] * cs + cr[2] * sn + ax[2] * dt * (1 - cs)]; }
    function plate(x, y, w, h, sgn, f){   /* plaque métallique en perspective ; sgn = +1 (plaque +) ou −1 */
      var ctx = c.ctx, d = w * 0.55, col = sgn > 0 ? [192, 50, 29] : [47, 127, 209];
      ctx.save();
      ctx.fillStyle = "rgba(40,55,80,.12)"; ctx.beginPath(); ctx.ellipse(x + w / 2, y + h + 4, w * 1.2, 4, 0, 0, 6.2832); ctx.fill();
      var g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, "#c3ccd8"); g.addColorStop(0.5, "#eef2f7"); g.addColorStop(1, "#aab5c3");
      ctx.fillStyle = g; S.draw.rrect(c, x, y, w, h, 3); ctx.fill(); ctx.strokeStyle = "#7d8ea3"; ctx.lineWidth = 1; ctx.stroke();
      if (f > 0.01){
        ctx.fillStyle = "rgba(" + col.join(",") + "," + (0.28 * f) + ")"; S.draw.rrect(c, x, y, w, h, 3); ctx.fill();
        ctx.font = "800 " + Math.round(w * 0.75) + "px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "rgba(" + col.join(",") + "," + f + ")";
        for (var i = 0; i < 6; i++) ctx.fillText(sgn > 0 ? "+" : "−", x + w / 2, y + h * (i + 0.5) / 6);
        S.draw.glow(c, x + w / 2, y + h / 2, h * 0.45, sgn > 0 ? "#c0321d" : "#2f7fd1", 0.18 * f);
      }
      ctx.restore();
    }
    k.draw(function(){
      var m = MOL[sel.value], W = c.W, H = c.H, ctx = c.ctx, net = [0, 0, 0], items = [], anyPolar = false, f = al.f;
      c.clear();
      /* décor : studio clair, sol en perspective */
      var bg = ctx.createRadialGradient(W / 2, H * 0.42, 10, W / 2, H * 0.5, Math.max(W, H) * 0.75); bg.addColorStop(0, "#fbfcfe"); bg.addColorStop(1, "#dfe6f0");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var yF = H * 0.8; ctx.fillStyle = "rgba(160,175,195,.18)"; ctx.fillRect(0, yF, W, H - yF);
      ctx.strokeStyle = "rgba(120,135,160,.18)"; ctx.lineWidth = 1; for (var gx = -6; gx <= 6; gx++){ ctx.beginPath(); ctx.moveTo(W / 2 + gx * W * 0.06, yF); ctx.lineTo(W / 2 + gx * W * 0.16, H); ctx.stroke(); }
      for (var gy = 0; gy < 4; gy++){ var yy = yF + (H - yF) * Math.pow(gy / 3, 1.6); ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      /* plaques, fils et générateur */
      var pw = Math.max(14, W * 0.035), ph = H * 0.66, py = H * 0.1, xl = 10, xr = W - 10 - pw;
      ctx.save(); ctx.strokeStyle = "#4a5568"; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(xl + pw / 2, py + ph); ctx.lineTo(xl + pw / 2, H - 16); ctx.lineTo(W / 2 - 34, H - 16); ctx.moveTo(xr + pw / 2, py + ph); ctx.lineTo(xr + pw / 2, H - 16); ctx.lineTo(W / 2 + 34, H - 16); ctx.stroke();
      var bgr = ctx.createLinearGradient(0, H - 30, 0, H - 2); bgr.addColorStop(0, "#5b6678"); bgr.addColorStop(0.5, "#2b3445"); bgr.addColorStop(1, "#1b2230");
      ctx.fillStyle = bgr; S.draw.rrect(c, W / 2 - 36, H - 29, 72, 26, 6); ctx.fill();
      ctx.fillStyle = field.value ? "#7be08f" : "#6b7787"; ctx.beginPath(); ctx.arc(W / 2 - 22, H - 16, 3.5, 0, 6.2832); ctx.fill();
      ctx.font = "800 10px Mulish, sans-serif"; ctx.fillStyle = "#e8eef6"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(field.value ? "ON  − | +" : "OFF − | +", W / 2 + 6, H - 16); ctx.restore();
      plate(xl, py, pw, ph, -1, f); plate(xr, py, pw, ph, 1, f);
      /* lignes de champ : de la plaque + vers la plaque − */
      if (f > 0.02){ ctx.save(); ctx.strokeStyle = "rgba(98,54,196," + (0.22 * f) + ")"; ctx.lineWidth = 1.5; ctx.setLineDash([10, 8]); ctx.lineDashOffset = T * 30;
        for (var fl = 0; fl < 6; fl++){ var yl = py + ph * (fl + 0.5) / 6; ctx.beginPath(); ctx.moveTo(xr - 4, yl); ctx.lineTo(xl + pw + 4, yl); ctx.stroke(); } ctx.restore(); }
      m.dirs.forEach(function(u, i){
        var d = EN[m.lig[i]] - EN[m.cen]; if (Math.abs(d) >= 0.5) anyPolar = true;
        net[0] += d * u[0]; net[1] += d * u[1]; net[2] += d * u[2];
        items.push({u: u, d: d, lab: m.lig[i]});
      });
      var mag = Math.hypot(net[0], net[1], net[2]); if (mag < 0.02) mag = 0;
      var axv = [0, 0, 0], angA = 0, nvn = null;
      if (mag > 0){ nvn = [net[0] / mag, net[1] / mag, net[2] / mag]; axv = cross(nvn, [1, 0, 0]); var sl = Math.hypot(axv[0], axv[1], axv[2]); angA = Math.acos(Math.max(-1, Math.min(1, nvn[0]))); if (sl < 1e-6){ axv = [0, 1, 0]; if (nvn[0] < 0) angA = Math.PI; } else axv = [axv[0] / sl, axv[1] / sl, axv[2] / sl]; }
      /* dans le champ : la molécule polaire tourne pour aligner sa résultante (vers δ⁻) sur la plaque + ; agitation thermique légère */
      var rotM = function(u){
        var w = u;
        if (f > 0.001){
          if (mag > 0){ w = rodr(u, axv, angA * f); w = rodr(w, [0, 0, 1], 0.12 * Math.sin(T * 2.1) * f); w = rodr(w, [1, 0, 0], T * 0.9 * f); }
          else w = rodr(u, [1, 0, 0], T * 2.2 * f);
        }
        return C5.rot(w, st.yaw * (1 - f), st.pitch * (1 - f));
      };
      var cx = W / 2, cy = H * 0.44, R = Math.min(W * 0.255, H * 0.3), rA = R * 0.36;
      var P3 = function(v, s){ var k3 = 1 / (1 - 0.13 * v[2]); return [cx + R * s * v[0] * k3, cy - R * s * v[1] * k3, k3]; };
      items.forEach(function(it){ it.v = rotM(it.u); it.p = P3(it.v, 1); it.r = rA * RAD[it.lab] * it.p[2]; it.q = -it.d; });
      var qc = items.reduce(function(q, w){ return q + w.d; }, 0), rc = rA * RAD[m.cen];
      /* ombre portée au sol */
      ctx.save(); ctx.fillStyle = "rgba(40,55,80,.13)"; ctx.beginPath(); ctx.ellipse(cx, yF + (H - yF) * 0.35, R * 1.15, R * 0.16, 0, 0, 6.2832); ctx.fill(); ctx.restore();
      /* nuage de charge : enveloppe des atomes, teintée selon la charge partielle (bleu δ⁻, rouge δ⁺) */
      if (showC.value){
        var blobs = items.map(function(it){ return [it.p[0], it.p[1], it.r * 1.9, it.q]; }); blobs.push([cx, cy, rc * 1.9, qc]);
        ctx.save(); ctx.beginPath(); blobs.forEach(function(b){ ctx.moveTo(b[0] + b[2], b[1]); ctx.arc(b[0], b[1], b[2], 0, 6.2832); });
        ctx.fillStyle = "rgba(235,240,250,.55)"; ctx.fill(); ctx.clip();
        blobs.forEach(function(b){ var a = Math.min(0.62, Math.abs(b[3]) * 0.55), col = b[3] < 0 ? "47,127,209" : "214,64,46"; if (a < 0.04) return;
          var g = ctx.createRadialGradient(b[0], b[1], 0, b[0], b[1], b[2] * 1.25); g.addColorStop(0, "rgba(" + col + "," + a + ")"); g.addColorStop(1, "rgba(" + col + ",0)"); ctx.fillStyle = g; ctx.fillRect(b[0] - b[2] * 1.3, b[1] - b[2] * 1.3, b[2] * 2.6, b[2] * 2.6); });
        ctx.restore();
        ctx.save(); ctx.beginPath(); blobs.forEach(function(b){ ctx.moveTo(b[0] + b[2], b[1]); ctx.arc(b[0], b[1], b[2], 0, 6.2832); }); ctx.strokeStyle = "rgba(255,255,255,.0)"; ctx.restore();
      }
      /* atomes et liaisons, du fond vers l'avant */
      var all = items.slice(); all.push({center: true, v: [0, 0, 0]}); all.sort(function(p, q){ return p.v[2] - q.v[2]; });
      all.forEach(function(it){
        if (it.center){ C5.ball3(ctx, cx, cy, rc, COL[m.cen]); C5.sym3(ctx, m.cen, cx, cy, Math.max(12, rc * 0.62));
          if (Math.abs(qc) >= 0.5) S.draw.label(c, qc < 0 ? "δ⁻" : "δ⁺", cx - rc * 0.9, cy - rc * 1.05, {color: qc < 0 ? pal.acc : pal.red, size: 13}); return; }
        var p = it.p, ux = p[0] - cx, uy = p[1] - cy, ul = Math.hypot(ux, uy) || 1;
        if (it.v[2] < 0){ C5.ball3(ctx, p[0], p[1], it.r, COL[it.lab]); C5.stick3(ctx, cx, cy, p[0] - ux / ul * it.r * 0.5, p[1] - uy / ul * it.r * 0.5, rA * 0.34 * p[2], COL[m.cen], COL[it.lab]); }
        else { C5.stick3(ctx, cx + ux / ul * rc * 0.6, cy + uy / ul * rc * 0.6, p[0], p[1], rA * 0.34 * p[2], COL[m.cen], COL[it.lab]); C5.ball3(ctx, p[0], p[1], it.r, COL[it.lab]); }
        C5.sym3(ctx, it.lab, p[0], p[1], Math.max(10, it.r * 0.7));
        if (Math.abs(it.d) >= 0.5) S.draw.label(c, it.d > 0 ? "δ⁻" : "δ⁺", p[0] + it.r * 0.95, p[1] - it.r * 1.05, {color: it.d > 0 ? pal.acc : pal.red, size: 12});
        if (showB.value && Math.abs(it.d) >= 0.3){
          var a = P3(it.v, it.d > 0 ? 0.28 : 0.74), z = P3(it.v, it.d > 0 ? 0.74 : 0.28), nx = -(z[1] - a[1]), ny = z[0] - a[0], nl2 = Math.hypot(nx, ny) || 1, off = rA * 0.55;
          S.draw.arrow(c, a[0] + nx / nl2 * off, a[1] + ny / nl2 * off, z[0] + nx / nl2 * off, z[1] + ny / nl2 * off, "#2f7fd1", 2.8);
        }
      });
      if (showN.value && mag > 0){
        var nv = rotM([nvn[0], nvn[1], nvn[2]]), L = R * (0.55 + mag * 0.35);
        S.draw.arrow(c, cx - nv[0] * L * 0.35, cy + nv[1] * L * 0.35, cx + nv[0] * L, cy - nv[1] * L, pal.red, 5);
        S.draw.label(c, "résultante", cx + nv[0] * L, cy - nv[1] * L - 18, {color: pal.red, size: 12});
      } else if (showN.value) S.draw.label(c, "résultante nulle", cx, cy + R * 1.45, {color: pal.green, size: 13});
      S.draw.text(c, m.name, xl + pw + 14, 18, {size: 18, align: "left", color: pal.ink, weight: 800});
      S.draw.text(c, mag ? "polaire" : "apolaire", xl + pw + 14, 38, {size: 12.5, align: "left", color: mag ? pal.red : pal.green});
      var lg = [["#2f7fd1", "dipôle de liaison (vers δ⁻)"], [pal.red, "résultante"]];
      S.draw.legend(c, lg, xr - 8, 8, {align: "right"});
      if (showC.value && W >= 400){ var lx = xr - 8 - 170, lyy = 50; ctx.save(); var gg = ctx.createLinearGradient(lx, 0, lx + 120, 0); gg.addColorStop(0, "rgba(47,127,209,.75)"); gg.addColorStop(0.5, "rgba(235,240,250,.9)"); gg.addColorStop(1, "rgba(214,64,46,.75)"); ctx.fillStyle = gg; S.draw.rrect(c, lx + 25, lyy, 120, 10, 5); ctx.fill(); ctx.restore();
        S.draw.text(c, "δ⁻", lx + 14, lyy + 5, {size: 11, color: pal.acc}); S.draw.text(c, "δ⁺", lx + 158, lyy + 5, {size: 11, color: pal.red}); S.draw.text(c, "nuage de charge", lx + 85, lyy + 20, {size: 10.5, color: pal.grey, weight: 700}); }
      S.draw.text(c, f < 0.5 ? "glisse pour tourner la molécule" : mag > 0 ? "le côté δ⁻ se tourne vers la plaque +" : "aucune orientation privilégiée", W / 2, py + ph + 14, {size: 11.5, color: pal.grey, halo: true});
      ro.set(0, anyPolar ? "oui" : "non (ΔEN < 0,5)"); ro.set(1, mag ? S.fmt(mag, 1) + " (unités ΔEN)" : "nulle"); ro.set(2, mag ? "polaire" : "apolaire");
      nt.set((mag ? "Les dipôles ne se compensent pas : un côté est δ⁻, l'autre δ⁺." : (anyPolar ? "Les liaisons sont polaires, mais la symétrie annule la somme : molécule apolaire." : "Presque aucune différence d'électronégativité : molécule apolaire.")) + (field.value ? (mag ? " Dans le champ, le côté δ⁻ se tourne vers la plaque +." : " Dans le champ, rien ne la fait s'orienter : elle tourne librement.") : ""), mag ? "" : "ok");
    });
  }
});

SFA.sim({
  id: "c5-c03-solides", ch: "c03", tag: "Comparaison",
  titre: "Cinq solides, cinq structures, cinq comportements",
  resume: "NaCl, cuivre, diiode, diamant, graphite : structure → propriétés. Chauffe, frappe, branche.",
  but: "Choisis un solide, regarde sa structure, puis chauffe-le (curseur), frappe-le au marteau et branche une pile. Compare les cinq.",
  aRetenir: "Ionique : dur et cassant, fusion élevée, conduit fondu/dissous. Métallique : malléable, conduit toujours. Moléculaire : mou, fusion basse (forces faibles entre molécules). Covalent réticulaire : très dur, fusion très élevée (diamant), mais le graphite, en couches, est mou et conducteur.",
  piege: "Diamant et graphite sont tous deux du carbone pur : c'est l'arrangement des atomes qui change tout. Ne confonds pas « liaison covalente forte » (dans la molécule I₂ ou le réseau) et « forces faibles » entre les molécules : quand I₂ fond, on ne casse pas les liaisons I–I.",
  build: function(k, S){
    var pal = S.draw.palette;
    var D = {
      NaCl: {n: "Chlorure de sodium NaCl", type: "ionique", mp: 801, bp: 1413, dur: "dur mais cassant", cs: "non", cf: "oui (fondu ou dissous)", sol: "soluble dans l'eau",
             mart: "Le cristal se casse net (clivage) : les ions de même signe se retrouvent face à face.", pile: "Pas de courant : les ions sont bloqués dans le réseau."},
      Cu: {n: "Cuivre Cu", type: "métallique", mp: 1085, bp: 2562, dur: "malléable, ductile", cs: "oui", cf: "oui", sol: "insoluble",
           mart: "Le métal se déforme sans se casser : les cations glissent dans la mer d'électrons.", pile: "Courant : les électrons délocalisés circulent librement."},
      I2: {n: "Diiode I₂", type: "moléculaire", mp: 114, bp: 184, dur: "mou, friable", cs: "non", cf: "non", sol: "très peu soluble dans l'eau",
           mart: "Il s'émiette facilement : seules de faibles forces tiennent les molécules entre elles.", pile: "Pas de courant : pas de charges mobiles."},
      C: {n: "Diamant C", type: "covalent (réseau 3D)", mp: 3500, bp: 99999, dur: "le plus dur des matériaux naturels", cs: "non", cf: "—", sol: "insoluble",
          mart: "Il ne se déforme pas : chaque atome est lié à 4 voisins par des liaisons covalentes fortes.", pile: "Pas de courant : tous les électrons sont engagés dans les liaisons."},
      G: {n: "Graphite C", type: "covalent (couches)", mp: 3500, bp: 99999, dur: "mou (il marque le papier)", cs: "oui, dans les couches", cf: "—", sol: "insoluble",
          mart: "Les couches glissent les unes sur les autres : c'est pourquoi le graphite écrit.", pile: "Un courant passe : un électron par atome est délocalisé dans la couche."}
    };
    var c = k.canvas(250);
    var sel = k.select("Solide", Object.keys(D).map(function(x){ return [x, D[x].n]; }), "NaCl");
    var T = k.slider("Température", 0, 2000, 10, 20, "°C");
    var act = k.seg("Action", [["rien", "Observer"], ["marteau", "Frapper"], ["pile", "Brancher une pile"]], "rien");
    var ro = k.readouts(["Type de solide", "État à cette température", "Dureté", "Fusion", "Conduit (solide)", "Conduit (fondu)"]);
    var nt = k.note("", "");
    var parts = [], i; for (i = 0; i < 40; i++) parts.push({x: Math.random(), y: Math.random(), a: Math.random() * 6.28, i: i});
    var lp = k.loop(function(dt){ parts.forEach(function(p){ p.a += (Math.random() - 0.5) * 2; }); k.redraw(); }); lp.play();
    function stateOf(d, t){ return t < d.mp ? "solide" : t < d.bp ? "liquide" : "gaz"; }
    k.draw(function(){
      var key = sel.value, d = D[key], t = T.value, state = stateOf(d, t), ctx = c.ctx; c.clear();
      var x0 = 24, y0 = 40, w = c.W - 48, h = 190, a = Math.min(44, w / 8);
      ctx.fillStyle = "#f6f8fb"; ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = pal.light; ctx.strokeRect(x0, y0, w, h);
      var amp = state === "solide" ? 1 + t / 700 : 0;
      var rows = 4, cols = Math.floor(w / a) - 1, jx = function(p){ return Math.cos(p.a) * amp; }, jy = function(p){ return Math.sin(p.a) * amp; };
      var offx = x0 + (w - (cols - 1) * a) / 2, offy = y0 + 30;
      if (state === "solide"){
        var n = 0;
        for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++, n++){
          var p = parts[n % parts.length], X = offx + q * a + jx(p), Y = offy + r * a * 0.95 + jy(p);
          if (key === "NaCl") C5.atom(c, X, Y, a * 0.32, (q + r) % 2 ? "#c6d6f6" : "#f6c6c6", (q + r) % 2 ? "−" : "+");
          else if (key === "Cu"){ C5.atom(c, X, Y, a * 0.3, "#f6c6c6", "+"); S.draw.dot(c, X + a * 0.5 + jx(p) * 2, Y + a * 0.35 + jy(p) * 2, 2.5, pal.acc); }
          else if (key === "I2"){ if (q % 2 === 0){ S.draw.line(c, X, Y, X + a * 0.5, Y, pal.ink, 2); C5.atom(c, X, Y, a * 0.2, "#d8c6f6", ""); C5.atom(c, X + a * 0.5, Y, a * 0.2, "#d8c6f6", ""); } }
          else if (key === "C"){ C5.atom(c, X, Y, a * 0.18, "#555", ""); if (q < cols - 1) S.draw.line(c, X, Y, X + a, Y, pal.ink, 2); if (r < rows - 1){ S.draw.line(c, X, Y, X, Y + a * 0.95, pal.ink, 2); S.draw.line(c, X, Y, X + a, Y + a * 0.95, pal.grey, 1.2); } }
          else if (key === "G"){ C5.atom(c, X, Y, a * 0.16, "#555", ""); if (q < cols - 1 && (q + r) % 2 === 0) S.draw.line(c, X, Y, X + a, Y, pal.ink, 2); if (r < rows - 1 && (q + r) % 2 === 1) S.draw.line(c, X, Y, X, Y + a * 0.95, pal.ink, 2); }
        }
        if (key === "I2") S.draw.text(c, "I–I : liaison covalente ; entre molécules : forces faibles", c.W / 2, y0 + h - 14, {size: 12, color: pal.grey});
        if (key === "G"){ S.draw.line(c, x0 + 6, offy + 1.45 * a, x0 + w - 6, offy + 1.45 * a, pal.red, 1.2, [5, 4]); S.draw.text(c, "plan de glissement (forces faibles entre couches)", c.W / 2, y0 + h - 14, {size: 12, color: pal.red}); }
      } else {
        var nn = 34, sp = state === "liquide" ? 0.45 : 1; var hh = state === "liquide" ? h * 0.55 : h;
        for (var j = 0; j < nn; j++){
          var p2 = parts[j], px = x0 + 10 + ((p2.x * 997 + j * 31 + Math.sin(p2.a * 0.3 + j) * 18 * sp) % 1 + 1) % 1 * (w - 20), py = y0 + h - 12 - (((p2.y * 777 + j * 17) % 1 + 1) % 1) * (hh - 20) + Math.cos(p2.a + j) * 8 * sp;
          C5.atom(c, px, py, 7, key === "NaCl" ? (j % 2 ? "#c6d6f6" : "#f6c6c6") : key === "Cu" ? "#f6c6c6" : "#d8c6f6", "");
        }
      }
      S.draw.text(c, d.n + " — " + state + " à " + t + " °C", c.W / 2, 18, {size: 13});
      var big = d.mp >= 3500;
      var res = act.value === "marteau" ? d.mart : act.value === "pile" ? d.pile : "";
      if (act.value === "pile" && state !== "solide" && key === "NaCl") res = "Fondu : les ions sont libres de se déplacer : le courant passe.";
      if (act.value === "marteau" && state !== "solide") res = "À cette température ce n'est plus un solide : rien à frapper.";
      ro.set(0, d.type); ro.set(1, big ? "solide (jusqu'à ≈ 3 500 °C)" : state); ro.set(2, d.dur); ro.set(3, big ? "≈ 3 500 °C et plus" : d.mp + " °C"); ro.set(4, d.cs); ro.set(5, d.cf);
      nt.set(res || (state === "solide" ? "Chauffe pour voir la fusion : cela dépend des forces qui retiennent les particules." : "Les particules ont quitté leurs positions fixes : on casse les forces qui tiennent le solide."), res ? "" : "");
    });
  }
});

SFA.sim({
  id: "c5-c03-glace", ch: "c03", tag: "Niche utile",
  titre: "Pourquoi la glace flotte-t-elle ?",
  resume: "Densité de l'eau liquide selon T, densité de la glace : combien dépasse du verre ?",
  but: "Plonge un glaçon dans de l'eau douce, de l'eau de mer ou de l'éthanol, à la température de ton choix. Attrape le glaçon et enfonce-le : il remonte. Lis la part immergée, puis passe à la vue moléculaire en 3D (glisse pour la tourner) : réseau ouvert de la glace contre eau liquide plus compacte.",
  aRetenir: "Un corps flotte si sa masse volumique est plus petite que celle du liquide. Part immergée = ρ(glaçon) / ρ(liquide). La glace (0,917 g/cm³) est moins dense que l'eau liquide (≈ 1,000 g/cm³) : ses liaisons hydrogène forment un réseau ouvert en hexagones. L'eau liquide est la plus dense à 4 °C.",
  piege: "Presque tous les solides coulent dans leur propre liquide : l'eau est une exception. Dans l'éthanol (0,79 g/cm³) un glaçon coulerait. Ce modèle suppose que le glaçon n'a pas le temps de fondre. Les valeurs sont celles de tables, arrondies.",
  build: function(k, S){
    var pal = S.draw.palette, RHO_ICE = 0.917;
    var TT = [0, 4, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], RR = [0.99984, 0.99997, 0.99970, 0.99821, 0.99565, 0.99222, 0.98803, 0.98320, 0.97778, 0.97182, 0.96535, 0.95835];
    function rhoW(t){ for (var i = 0; i < TT.length - 1; i++) if (t <= TT[i + 1]) return RR[i] + (RR[i + 1] - RR[i]) * (t - TT[i]) / (TT[i + 1] - TT[i]); return RR[RR.length - 1]; }
    var c = C5.cvF(k, function(w){ return Math.round(w * (w < 460 ? 0.98 : 0.64)); }), g = C5.cvF(k, function(w){ return w < 460 ? Math.round(w * 0.78) : 240; });
    var cube = {y: null, v: 0, drag: false, target: 0, wl: 0, sz: 66, cx: 0, by: 0, by2: 0, bh: 0, off: 0};
    var liq = k.seg("Liquide", [["eau", "Eau pure"], ["mer", "Eau de mer"], ["eth", "Éthanol"]], "eau");
    var T = k.slider("Température du liquide", 0, 100, 1, 4, "°C");
    var mol = k.toggle("Vue moléculaire 3D à la place du graphe", false);
    k.button("🧊 Lâcher un glaçon", function(){ cube.y = cube.by - cube.sz * 0.9; cube.v = 0; }, true);
    var ro = k.readouts(["Masse volumique du liquide", "Masse volumique de la glace", "Part immergée", "Verdict"]);
    var nt = k.note("", "");
    var tm = 0, vw = {yaw: 0.3, pitch: 1.12, drag: false, lx: 0, ly: 0};
    /* eau de mer (35 g/kg) : 1,0247 g/cm³ à 20 °C, même dilatation que l'eau pure ; éthanol : 0,789 à 20 °C, −0,00085 g/cm³ par °C */
    c.pointer(function(type, p){
      if (type === "down" && Math.abs(p.x - cube.cx) < cube.sz && p.y > cube.y - cube.sz * 0.4 && p.y < cube.y + cube.sz + 12){ cube.drag = true; cube.off = p.y - cube.y; cube.v = 0; }
      else if (type === "drag" && cube.drag){ cube.y = Math.max(cube.by - 10, Math.min(cube.by + cube.bh - cube.sz - 3, p.y - cube.off)); cube.v = 0; }
      else if (type === "up") cube.drag = false;
    });
    g.pointer(function(type, p){
      if (type === "down"){ vw.drag = true; vw.lx = p.x; vw.ly = p.y; }
      else if (type === "drag" && vw.drag){ vw.yaw += (p.x - vw.lx) * 0.012; vw.pitch = Math.max(-1.5, Math.min(1.5, vw.pitch + (p.y - vw.ly) * 0.012)); vw.lx = p.x; vw.ly = p.y; }
      else if (type === "up") vw.drag = false;
    });
    k.loop(function(dt, t){ tm = t; if (!vw.drag) vw.yaw += dt * 0.3;
      if (cube.y != null && !cube.drag){ var a = (cube.target - cube.y) * 45 - cube.v * 5.5; cube.v += a * dt; cube.y += cube.v * dt; if (cube.y > cube.by + cube.bh - cube.sz - 3){ cube.y = cube.by + cube.bh - cube.sz - 3; cube.v = 0; } } k.redraw(); }).play();
    function rho(){ return liq.value === "eau" ? rhoW(T.value) : liq.value === "mer" ? 1.0247 * rhoW(T.value) / rhoW(20) : 0.789 - 0.00085 * (T.value - 20); }
    /* ---------- structures 3D (Å) : glace hexagonale Ih et eau liquide dans le même volume ---------- */
    var rng = (function(s){ return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })(23);
    var BOX = 9, HY = 2.55, ICE = [], LIQ = [];
    (function(){
      var A = 4.52, Cc = 7.36, u = 3 / 8, basis = [[1/3, 2/3, 0], [2/3, 1/3, 0.5], [1/3, 2/3, u], [2/3, 1/3, 0.5 + u]], O = [], i, j, kk, b;
      for (i = -5; i <= 5; i++) for (j = -5; j <= 5; j++) for (kk = -1; kk <= 1; kk++) for (b = 0; b < 4; b++){
        var f = basis[b], x = (i + f[0]) * A - (j + f[1]) * A * 0.5, z = (j + f[1]) * A * Math.sqrt(3) / 2, y = (kk + f[2]) * Cc;
        O.push([x, y, z]);
      }
      /* deux couches plissées complètes (y de 3/8 c à c), centrées */
      O = O.filter(function(p){ return p[1] > 2.5 && p[1] < 7.6; });
      var cxm = 0, czm = 0; O.forEach(function(p){ cxm += p[0]; czm += p[2]; }); cxm /= O.length; czm /= O.length;
      O = O.map(function(p){ return [p[0] - cxm, p[1] - 5.06, p[2] - czm]; }).filter(function(p){ return Math.hypot(p[0], p[2]) < BOX; });
      var nh = O.map(function(){ return 0; }), E = [];
      for (i = 0; i < O.length; i++) for (j = i + 1; j < O.length; j++){ var d = Math.hypot(O[i][0] - O[j][0], O[i][1] - O[j][1], O[i][2] - O[j][2]); if (d < 3.0) E.push([i, j]); }
      E.sort(function(){ return rng() - 0.5; });
      var H = [];
      E.forEach(function(e){ var from = nh[e[0]] < nh[e[1]] ? e[0] : nh[e[1]] < nh[e[0]] ? e[1] : (rng() < 0.5 ? e[0] : e[1]), to = from === e[0] ? e[1] : e[0];
        if (nh[from] >= 2){ var sw = from; from = to; to = sw; } if (nh[from] >= 2) return; nh[from]++;
        var p = O[from], q = O[to], d = Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]); H.push([p[0] + (q[0] - p[0]) / d * 0.96, p[1] + (q[1] - p[1]) / d * 0.96, p[2] + (q[2] - p[2]) / d * 0.96, from, to]); });
      ICE = {O: O, H: H, E: E};
      /* liquide : 9 % de molécules en plus dans le même volume (ρ = 1,000 contre 0,917), placées au hasard sans recouvrement */
      var N = Math.round(O.length * 1.09), L = [], tries = 0;
      while (L.length < N && tries < 40000){ tries++; var q = [(rng() * 2 - 1) * BOX, (rng() * 2 - 1) * HY, (rng() * 2 - 1) * BOX]; if (Math.hypot(q[0], q[2]) > BOX) continue;
        var ok = true; for (var m = 0; m < L.length; m++){ if (Math.hypot(L[m][0] - q[0], L[m][1] - q[1], L[m][2] - q[2]) < 2.55){ ok = false; break; } } if (ok) L.push(q); }
      var LH = [], LE = [];
      L.forEach(function(p, ii){ var th = rng() * 6.2832, ph = Math.acos(rng() * 2 - 1), d1 = [Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)];
        var tmp = [d1[1], -d1[0], 0.3], tl = Math.hypot(tmp[0], tmp[1], tmp[2]); tmp = [tmp[0] / tl, tmp[1] / tl, tmp[2] / tl];
        var ca = Math.cos(1.824), sa = Math.sin(1.824), d2 = [d1[0] * ca + tmp[0] * sa, d1[1] * ca + tmp[1] * sa, d1[2] * ca + tmp[2] * sa];
        LH.push([p[0] + d1[0] * 0.96, p[1] + d1[1] * 0.96, p[2] + d1[2] * 0.96, ii]); LH.push([p[0] + d2[0] * 0.96, p[1] + d2[1] * 0.96, p[2] + d2[2] * 0.96, ii]); });
      for (i = 0; i < L.length; i++) for (j = i + 1; j < L.length; j++){ if (Math.hypot(L[i][0] - L[j][0], L[i][1] - L[j][1], L[i][2] - L[j][2]) < 2.95 && rng() < 0.7) LE.push([i, j]); }
      LIQ = {O: L, H: LH, E: LE};
    })();
    function drawLattice(S3, cx, cy, sc, jig){
      var ctx = g.ctx, it = [], pr = function(p, ji){ var q = p; if (ji) q = [p[0] + Math.sin(tm * 3 + ji * 1.7) * 0.18, p[1] + Math.cos(tm * 2.6 + ji * 2.3) * 0.18, p[2] + Math.sin(tm * 2.2 + ji) * 0.18]; var r = C5.rot(q, vw.yaw, vw.pitch), s = 1 / (1 - r[2] * 0.035); return [cx + r[0] * sc * s, cy - r[1] * sc * s, r[2], s]; };
      var PO = S3.O.map(function(p, i){ return pr(p, jig ? i + 1 : 0); });
      S3.E.forEach(function(e){ var a = PO[e[0]], b = PO[e[1]]; it.push({z: (a[2] + b[2]) / 2 - 0.5, f: function(){ ctx.save(); ctx.strokeStyle = "rgba(31,75,158,.7)"; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); }}); });
      S3.H.forEach(function(h){ var oi = h.length > 4 ? h[3] : h[3], o = PO[oi], dx = h[0] - S3.O[oi][0], dy = h[1] - S3.O[oi][1], dz = h[2] - S3.O[oi][2];
        var r = C5.rot([dx, dy, dz], vw.yaw, vw.pitch), hp = [o[0] + r[0] * sc * o[3], o[1] - r[1] * sc * o[3], o[2] + r[2]];
        it.push({z: hp[2], f: function(){ ctx.save(); ctx.strokeStyle = "#c9d1dc"; ctx.lineWidth = sc * 0.22 * o[3]; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(hp[0], hp[1]); ctx.stroke(); ctx.restore(); C5.ball3(ctx, hp[0], hp[1], sc * 0.27 * o[3], "#f1f4f8"); }}); });
      PO.forEach(function(p){ it.push({z: p[2], f: function(){ C5.ball3(ctx, p[0], p[1], sc * 0.42 * p[3], "#e8594a"); }}); });
      it.sort(function(a, b){ return a.z - b.z; }); it.forEach(function(q){ q.f(); });
    }
    k.draw(function(){
      var r = rho(), f = RHO_ICE / r, ctx = c.ctx, W = c.W, H = c.H; c.clear(); g.clear();
      /* ---------- décor : cuisine, table en bois ---------- */
      ctx.fillStyle = "#eef3f8"; ctx.fillRect(0, 0, W, H);
      var tile = Math.max(26, W / 14), yTab = H * 0.86;
      ctx.strokeStyle = "rgba(160,175,195,.35)"; ctx.lineWidth = 1; for (var tx = 0; tx < W; tx += tile){ ctx.beginPath(); ctx.moveTo(tx + 0.5, 0); ctx.lineTo(tx + 0.5, yTab); ctx.stroke(); } for (var ty = 0; ty < yTab; ty += tile){ ctx.beginPath(); ctx.moveTo(0, ty + 0.5); ctx.lineTo(W, ty + 0.5); ctx.stroke(); }
      var wg = ctx.createLinearGradient(0, yTab, 0, H); wg.addColorStop(0, "#c89a6a"); wg.addColorStop(1, "#a87a4c"); ctx.fillStyle = wg; ctx.fillRect(0, yTab, W, H - yTab);
      ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(0, yTab, W, 2); ctx.strokeStyle = "rgba(110,70,35,.25)"; for (var wl2 = 0; wl2 < 3; wl2++){ ctx.beginPath(); ctx.moveTo(0, yTab + 8 + wl2 * 9); ctx.bezierCurveTo(W * 0.3, yTab + 4 + wl2 * 9, W * 0.6, yTab + 13 + wl2 * 9, W, yTab + 7 + wl2 * 9); ctx.stroke(); }
      /* ---------- verre ---------- */
      var phn = W < 460, bw = phn ? W * 0.48 : Math.min(250, W * 0.5), bh = yTab - H * 0.1 - 10, bx = phn ? W * 0.08 : (W - bw) / 2, by = H * 0.1, sz = Math.round(bw * 0.4), cxm = bx + bw / 2, tap = bw * 0.06, er = 9;
      var liqCol = liq.value === "eth" ? [214, 228, 246] : liq.value === "mer" ? [120, 190, 225] : [150, 205, 240];
      var level = 0.62, wl = by + bh * (1 - level), bot = by + bh - 12;
      cube.target = f < 1 ? wl - sz * (1 - f) : bot - sz - 3; cube.wl = wl; cube.sz = sz; cube.cx = cxm; cube.by = by; cube.bh = bh - 12;
      if (cube.y == null) cube.y = by - sz * 0.9;
      var xAt = function(y){ return tap * (y - by) / bh; };
      ctx.save(); ctx.fillStyle = "rgba(40,30,20,.18)"; ctx.beginPath(); ctx.ellipse(cxm + 8, yTab + 6, bw * 0.55, 8, 0, 0, 6.2832); ctx.fill(); ctx.restore();
      function glassPath(){ ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + tap, by + bh); ctx.lineTo(bx + bw - tap, by + bh); ctx.lineTo(bx + bw, by); ctx.closePath(); }
      ctx.save(); glassPath(); ctx.fillStyle = "rgba(225,236,248,.45)"; ctx.fill(); ctx.clip();
      /* liquide (derrière le glaçon) */
      var lg = ctx.createLinearGradient(0, wl, 0, bot); lg.addColorStop(0, "rgba(" + liqCol.join(",") + ",.55)"); lg.addColorStop(1, "rgba(" + liqCol.map(function(v){ return Math.round(v * 0.82); }).join(",") + ",.75)");
      ctx.fillStyle = lg; ctx.fillRect(bx, wl, bw, bot - wl);
      /* bulles qui montent lentement */
      for (var bb = 0; bb < 9; bb++){ var ph = (tm * 0.12 + bb * 0.137) % 1, bxp = bx + 18 + ((bb * 0.618) % 1) * (bw - 36), byp = bot - 6 - ph * (bot - wl - 12); ctx.beginPath(); ctx.arc(bxp + Math.sin(ph * 12 + bb) * 2, byp, 1.4 + (bb % 3), 0, 6.2832); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore();
      /* glaçon en volume : face avant, dessus, côté ; cœur blanc laiteux, fissures, bulles d'air */
      var cyc = cube.y, amp = Math.min(1, Math.abs(cube.v) / 60), dx = sz * 0.26, dy = -sz * 0.2;
      function iceCube(ox){
        var x0 = cxm - sz / 2 + ox - dx / 2, y0 = cyc, x1 = x0 + sz, y1 = y0 + sz;
        ctx.save(); ctx.lineJoin = "round"; ctx.lineWidth = sz * 0.1;
        ctx.fillStyle = "rgba(205,228,246,.92)"; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1 + dx, y1 + dy); ctx.lineTo(x1, y1); ctx.closePath(); ctx.stroke(); ctx.fill();
        ctx.fillStyle = "rgba(246,252,255,.97)"; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + dx, y0 + dy); ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1, y0); ctx.closePath(); ctx.stroke(); ctx.fill();
        var fg = ctx.createLinearGradient(x0, y0, x1, y1); fg.addColorStop(0, "rgba(236,247,255,.96)"); fg.addColorStop(1, "rgba(190,220,244,.93)");
        ctx.fillStyle = fg; S.draw.rrect(c, x0, y0, sz, sz, sz * 0.12); ctx.fill();
        var cg = ctx.createRadialGradient(x0 + sz * 0.55, y0 + sz * 0.5, 2, x0 + sz * 0.55, y0 + sz * 0.5, sz * 0.42); cg.addColorStop(0, "rgba(255,255,255,.85)"); cg.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = cg; ctx.fillRect(x0, y0, sz, sz);
        ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0 + sz * 0.3, y0 + sz * 0.25); ctx.lineTo(x0 + sz * 0.48, y0 + sz * 0.45); ctx.lineTo(x0 + sz * 0.44, y0 + sz * 0.7); ctx.moveTo(x0 + sz * 0.48, y0 + sz * 0.45); ctx.lineTo(x0 + sz * 0.72, y0 + sz * 0.5); ctx.stroke();
        [[0.25, 0.7, 2.2], [0.7, 0.28, 1.6], [0.62, 0.78, 1.8], [0.82, 0.62, 1.2]].forEach(function(q){ ctx.beginPath(); ctx.arc(x0 + sz * q[0], y0 + sz * q[1], q[2], 0, 6.2832); ctx.strokeStyle = "rgba(120,170,215,.6)"; ctx.stroke(); });
        ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 + sz * 0.1, y0 + sz * 0.16); ctx.lineTo(x0 + sz * 0.1, y0 + sz * 0.72); ctx.moveTo(x0 + sz * 0.2, y0 + sz * 0.07); ctx.lineTo(x0 + sz * 0.75, y0 + sz * 0.07); ctx.stroke();
        ctx.strokeStyle = "rgba(70,125,185,.8)"; ctx.lineWidth = 1.4; S.draw.rrect(c, x0, y0, sz, sz, sz * 0.12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y0 + sz * 0.1); ctx.lineTo(x1 + dx, y0 + dy + sz * 0.06); ctx.lineTo(x1 + dx, y1 + dy - sz * 0.06); ctx.stroke();
        ctx.restore();
      }
      /* partie émergée telle quelle ; partie immergée vue à travers le liquide (légèrement décalée : réfraction) */
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, wl); ctx.clip(); iceCube(0); ctx.restore();
      ctx.save(); glassPath(); ctx.clip(); ctx.beginPath(); ctx.rect(0, wl, W, H); ctx.clip(); iceCube(2.5);
      ctx.fillStyle = "rgba(" + liqCol.join(",") + ",.2)"; ctx.fillRect(bx, wl, bw, bot - wl); ctx.restore();
      /* surface du liquide, ondulations autour du glaçon */
      ctx.save(); glassPath(); ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(cxm, wl, bw / 2 - xAt(wl), er, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.4; for (var rp = 0; rp < 2; rp++){ var ph2 = (tm * 0.5 + rp * 0.5) % 1; ctx.globalAlpha = (1 - ph2) * (0.4 + amp); ctx.beginPath(); ctx.ellipse(cxm, wl + 1, sz * 0.62 + ph2 * bw * 0.3, 3 + ph2 * 4, 0, 0, 6.2832); ctx.stroke(); }
      ctx.restore();
      /* verre : bords, fond épais, reflets, buée */
      ctx.save(); ctx.strokeStyle = "rgba(81,98,122,.75)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + tap, by + bh); ctx.moveTo(bx + bw, by); ctx.lineTo(bx + bw - tap, by + bh); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cxm, by, bw / 2, er, 0, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = "rgba(200,215,232,.7)"; ctx.beginPath(); ctx.ellipse(cxm, by + bh, bw / 2 - tap, er * 0.8, 0, 0, 3.1416); ctx.lineTo(bx + tap + 4, bot); ctx.lineTo(bx + bw - tap - 4, bot); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(bx + 12, by + 16); ctx.lineTo(bx + 12 + tap * 0.8, by + bh - 20); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + 22, by + 20); ctx.lineTo(bx + 22 + tap * 0.7, by + bh * 0.45); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.55)"; for (var dd = 0; dd < 22; dd++){ var qx = bx + 8 + ((dd * 0.7548 + 0.1) % 1) * (bw - 16), qy = wl + 6 + ((dd * 0.5698 + 0.3) % 1) * (bot - wl - 12); ctx.beginPath(); ctx.ellipse(qx, qy, 1.4, 2, 0, 0, 6.2832); ctx.fill(); }
      ctx.restore();
      S.draw.line(c, bx + xAt(wl) + 2, wl, bx + bw - xAt(wl) - 2, wl, "rgba(31,75,158,.5)", 1.2, [5, 4]);
      /* cotes : partie émergée / immergée */
      var rx = bx + bw + 14, cb = Math.min(cyc + sz, bot);
      if (f < 1 && cyc < wl - 2){
        S.draw.line(c, rx, cyc, rx, wl, pal.red, 2); S.draw.line(c, rx - 4, cyc, rx + 4, cyc, pal.red, 2); S.draw.line(c, rx - 4, wl, rx + 4, wl, pal.red, 2);
        S.draw.label(c, S.fmt((1 - f) * 100, 1) + " % dépasse", Math.min(rx + 8, W - 100), (cyc + wl) / 2, {color: pal.red, align: "left", size: 12});
      }
      if (cb > wl + 2){ var top2 = Math.max(cyc, wl);
        S.draw.line(c, rx, top2 + 2, rx, cb, pal.acc, 2); S.draw.line(c, rx - 4, cb, rx + 4, cb, pal.acc, 2);
        S.draw.label(c, (f < 1 ? S.fmt(f * 100, 1) : "100") + " % immergée", Math.min(rx + 8, W - 108), (top2 + cb) / 2 + 4, {color: pal.acc, align: "left", size: 12}); }
      var lnm = liq.value === "eth" ? "éthanol" : liq.value === "mer" ? "eau de mer" : "eau";
      if (phn){ S.draw.label(c, lnm, rx + 4, bot - 34, {color: pal.acc, align: "left", size: 11.5}); S.draw.label(c, "glace : 0,917 g/cm³", rx + 4, bot - 10, {color: "#2c5d94", align: "left", size: 11}); }
      else { S.draw.label(c, lnm, bx - 12, wl + 22, {color: pal.acc, align: "right", size: 12}); S.draw.label(c, "glace 0,917 g/cm³", bx - 12, Math.max(18, cyc + 8), {color: "#2c5d94", align: "right", size: 11.5}); }
      S.draw.text(c, phn ? "enfonce le glaçon : il remonte" : "attrape le glaçon et enfonce-le : il remonte", W / 2, H - 12, {size: 11.5, color: "#fff", halo: "rgba(110,70,35,.6)"});
      if (f >= 1) S.draw.label(c, "il coule", cxm, bot - sz - 16, {color: pal.red, size: 13});
      if (mol.value){
        var gw = g.W / 2, sc = Math.min(gw * 0.05, g.H * 0.058);
        var bgg = g.ctx.createLinearGradient(0, 0, 0, g.H); bgg.addColorStop(0, "#f5f8fc"); bgg.addColorStop(1, "#e3e9f2"); g.ctx.fillStyle = bgg; g.ctx.fillRect(0, 0, g.W, g.H);
        g.ctx.fillStyle = "#d0d9e5"; g.ctx.fillRect(gw - 0.5, 10, 1, g.H - 20);
        drawLattice(ICE, gw / 2, g.H / 2 + 6, sc, false); drawLattice(LIQ, gw + gw / 2, g.H / 2 + 6, sc, true);
        S.draw.text(g, "Glace : réseau ouvert (hexagones)", gw / 2, 13, {size: 12, halo: true}); S.draw.text(g, "Eau liquide : plus compacte", gw + gw / 2, 13, {size: 12, halo: true});
        S.draw.text(g, ICE.O.length + " molécules dans ce volume", gw / 2, g.H - 12, {size: 11, color: pal.grey, halo: true}); S.draw.text(g, LIQ.O.length + " molécules dans le même volume", gw + gw / 2, g.H - 12, {size: 11, color: pal.grey, halo: true});
        S.draw.text(g, "- - - liaison hydrogène · glisse pour tourner", g.W / 2, g.H - 30, {size: 10.5, color: pal.acc, halo: true});
      } else {
        var ax = S.draw.axes(g, {x0: 0, x1: 100, y0: 0.95, y1: 1.002, xl: "T (°C)", stepX: 10, stepY: 0.01, l: 52, t: 26});
        S.draw.fn(g, ax, rhoW, pal.acc, 2.6);
        S.draw.text(g, "ρ de l'eau liquide (g/cm³)", 8, 10, {size: 12, align: "left", color: pal.grey});
        S.draw.dot(g, ax.X(4), ax.Y(rhoW(4)), 5, pal.green); S.draw.text(g, "maximum à 4 °C", ax.X(4) + 8, ax.Y(rhoW(4)) + 16, {size: 12, color: pal.green, align: "left"});
        if (liq.value === "eau") S.draw.dot(g, ax.X(T.value), ax.Y(rhoW(T.value)), 7, pal.red);
        S.draw.text(g, "glace : 0,917", g.W - 8, 10, {size: 12, color: pal.grey, align: "right"});
      }
      ro.set(0, S.fmt(r, liq.value === "eau" ? 5 : 3) + " g/cm³"); ro.set(1, "0,917 g/cm³"); ro.set(2, f < 1 ? S.fmt(f * 100, 1) + " %" : "100 % (coule)"); ro.set(3, f < 1 ? "flotte" : "coule");
      if (liq.value === "eth" && T.value > 78) nt.set("L'éthanol bout à 78 °C : au-delà, ce n'est plus un liquide et le calcul n'a plus de sens.", "warn");
      else nt.set(f >= 1 ? "Dans l'éthanol, moins dense que la glace, le glaçon coule : un solide qui coule dans son liquide, comme presque tous les solides." : liq.value === "mer" ? "L'eau de mer est plus dense : le glaçon s'enfonce moins (les icebergs de glace d'eau douce flottent très bien)." : T.value === 4 ? "À 4 °C l'eau liquide est à sa masse volumique maximale." : "La part immergée dépend de ρ(glace) / ρ(eau).", "");
    });
  }
});
