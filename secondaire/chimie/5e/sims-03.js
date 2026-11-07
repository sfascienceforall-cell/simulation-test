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

SFA.sim({
  id: "c5-c03-polarite", ch: "c03", tag: "3D",
  titre: "Polarité globale : somme de vecteurs",
  resume: "Chaque liaison a un dipôle ; la molécule est polaire seulement si la somme n'est pas nulle.",
  but: "Choisis une molécule et fais-la tourner. Affiche les dipôles de liaison puis la résultante. Compare CO₂ et H₂O, CH₄ et CH₃Cl.",
  aRetenir: "Une molécule est polaire si la somme vectorielle de ses dipôles de liaison n'est pas nulle. Il faut donc ΔEN ≠ 0 ET une géométrie qui ne compense pas les dipôles. CO₂, BF₃, CCl₄ : liaisons polaires, molécule apolaire (CH₄ : liaisons à peine polaires, ΔEN = 0,4, et molécule apolaire).",
  piege: "« Liaison polaire » ne veut pas dire « molécule polaire ». Remplacer un seul atome dans une molécule symétrique casse la symétrie : CH₄ est apolaire, CH₃Cl est polaire. Ici le dipôle est représenté par ΔEN (unités arbitraires), pas par un vrai moment dipolaire en debye.",
  build: function(k, S){
    var pal = S.draw.palette, EN = C5.EN, st = {yaw: 0.5, pitch: 0.3};
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
    var c = k.canvas(340);
    var sel = k.select("Molécule", Object.keys(MOL).map(function(x){ return [x, MOL[x].name]; }), "H2O");
    var showB = k.toggle("Montrer les dipôles de liaison", true), showN = k.toggle("Montrer la résultante", true);
    var field = k.toggle("Placer la molécule entre deux plaques chargées", false);
    var ro = k.readouts(["Liaisons polaires ?", "Résultante", "Molécule"]);
    var nt = k.note("", "");
    var al = {f: 0}, T = 0;
    C5.drag3d(c, st);
    var lp = k.loop(function(dt, t){ T = t; al.f += ((field.value ? 1 : 0) - al.f) * Math.min(1, dt * 3); if (!st.dragging && !field.value) st.yaw += dt * 0.35; k.redraw(); }); lp.play();
    function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function rodr(v, ax, ang){ var cs = Math.cos(ang), sn = Math.sin(ang), cr = cross(ax, v), dt = ax[0] * v[0] + ax[1] * v[1] + ax[2] * v[2]; return [v[0] * cs + cr[0] * sn + ax[0] * dt * (1 - cs), v[1] * cs + cr[1] * sn + ax[1] * dt * (1 - cs), v[2] * cs + cr[2] * sn + ax[2] * dt * (1 - cs)]; }
    k.draw(function(){
      var m = MOL[sel.value]; c.clear();
      var cx = c.W / 2, cy = c.H / 2 - 6, R = Math.min(100, c.W / 3.6), net = [0, 0, 0], items = [], ctx = c.ctx, anyPolar = false, W = c.W, H = c.H;
      m.dirs.forEach(function(u, i){
        var d = EN[m.lig[i]] - EN[m.cen]; if (Math.abs(d) >= 0.5) anyPolar = true;
        net[0] += d * u[0]; net[1] += d * u[1]; net[2] += d * u[2];
        items.push({u: u, d: d, lab: m.lig[i]});
      });
      var mag = Math.hypot(net[0], net[1], net[2]); if (mag < 0.02) mag = 0;
      /* plaques : la molécule polaire s'oriente (δ⁻ vers la plaque +), l'apolaire reste indifférente */
      if (al.f > 0.01){
        ctx.save(); ctx.fillStyle = "rgba(192,50,29,.16)"; ctx.fillRect(W - 40, 56, 26, H - 100); ctx.fillStyle = "rgba(47,127,209,.16)"; ctx.fillRect(14, 56, 26, H - 100); ctx.restore();
        S.draw.text(c, "+", W - 27, H / 2, {size: 22, color: pal.red}); S.draw.text(c, "−", 27, H / 2, {size: 22, color: pal.acc});
        S.draw.text(c, "plaque −", 27, H - 36, {size: 11.5, color: pal.grey}); S.draw.text(c, "plaque +", W - 27, H - 36, {size: 11.5, color: pal.grey});
      }
      var axv = [0, 0, 0], angA = 0, nvn = null;
      if (mag > 0){ nvn = [net[0] / mag, net[1] / mag, net[2] / mag]; axv = cross(nvn, [1, 0, 0]); var sl = Math.hypot(axv[0], axv[1], axv[2]); angA = Math.acos(Math.max(-1, Math.min(1, nvn[0]))); if (sl < 1e-6){ axv = [0, 1, 0]; if (nvn[0] < 0) angA = Math.PI; } else axv = [axv[0] / sl, axv[1] / sl, axv[2] / sl]; }
      var rotM = function(u){
        var w = u;
        if (al.f > 0.001){
          if (mag > 0) w = rodr(u, axv, angA * al.f * (1 + 0.0) + Math.sin(T * 5) * 0.06 * (1 - al.f) * 0);
          else w = rodr(u, [1, 0, 0], T * 2.2 * al.f);
        }
        return C5.rot(w, al.f > 0.5 ? st.yaw * (1 - al.f) : st.yaw, al.f > 0.5 ? st.pitch * (1 - al.f) : st.pitch);
      };
      items.forEach(function(it){ it.v = rotM(it.u); });
      var P = function(v, f){ var s = 1 / (1 - 0.1 * v[2]); return [cx + R * f * v[0] * s, cy - R * f * v[1] * s, s]; };
      if (showN.value && mag > 0){
        var nv = rotM([nvn[0], nvn[1], nvn[2]]), L = 46 + mag * 36;
        S.draw.arrow(c, cx - nv[0] * L * 0.35, cy + nv[1] * L * 0.35, cx + nv[0] * L, cy - nv[1] * L, pal.red, 4.6);
        S.draw.label(c, "résultante", cx + nv[0] * L, cy - nv[1] * L - 18, {color: pal.red, size: 12});
      } else if (showN.value) S.draw.label(c, "résultante nulle", cx, c.H - 22, {color: pal.green, size: 13});
      var all = items.slice(); all.push({center: true, v: [0, 0, 0]}); all.sort(function(p, q){ return p.v[2] - q.v[2]; });
      all.forEach(function(it){
        if (it.center){ var cd = mag > 0 ? "#cfe4d8" : "#cfe4d8"; C5.atom(c, cx, cy, 17, C5.CPK[m.cen] || cd, m.cen, "#0f1b2d"); var sg = items.reduce(function(q, w){ return q + w.d; }, 0); if (Math.abs(sg) >= 0.5) S.draw.label(c, sg < 0 ? "δ⁻" : "δ⁺", cx - 24, cy - 22, {color: sg < 0 ? pal.acc : pal.red, size: 12}); return; }
        var p = P(it.v, 1), dEN = it.d;
        S.draw.line(c, cx, cy, p[0], p[1], "#2c3a4e", 4 * p[2]); S.draw.line(c, cx, cy, p[0], p[1], "#dfe7f1", 1.2);
        if (Math.abs(dEN) >= 0.5) S.draw.glow(c, p[0], p[1], 30 * p[2], dEN > 0 ? "#2f7fd1" : "#e8594a", 0.0);
        C5.atom(c, p[0], p[1], 14 * p[2], C5.CPK[it.lab] || "#f3c987", it.lab, "#0f1b2d");
        if (Math.abs(dEN) >= 0.5){ S.draw.label(c, dEN > 0 ? "δ⁻" : "δ⁺", p[0] + 16 * p[2], p[1] - 17 * p[2], {color: dEN > 0 ? pal.acc : pal.red, size: 12}); }
        if (showB.value && Math.abs(dEN) >= 0.3){
          var a = P(it.v, dEN > 0 ? 0.26 : 0.72), z = P(it.v, dEN > 0 ? 0.72 : 0.26), nx = -(z[1] - a[1]), ny = z[0] - a[0], nl2 = Math.hypot(nx, ny) || 1;
          S.draw.arrow(c, a[0] + nx / nl2 * 9, a[1] + ny / nl2 * 9, z[0] + nx / nl2 * 9, z[1] + ny / nl2 * 9, "#2f7fd1", 2.6);
        }
      });
      S.draw.legend(c, [["#2f7fd1", "dipôle de liaison (vers δ⁻)"], [pal.red, "résultante"]], 8, 8);
      S.draw.text(c, al.f < 0.5 ? "glisse pour tourner" : mag > 0 ? "la molécule s'oriente dans le champ" : "aucune orientation privilégiée", c.W - 10, c.H - 12, {size: 11.5, color: pal.grey, align: "right"});
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
  but: "Plonge un glaçon dans de l'eau douce, de l'eau de mer ou de l'éthanol, à la température de ton choix. Lis la part immergée, puis regarde la vue moléculaire.",
  aRetenir: "Un corps flotte si sa masse volumique est plus petite que celle du liquide. Part immergée = ρ(glaçon) / ρ(liquide). La glace (0,917 g/cm³) est moins dense que l'eau liquide (≈ 1,000 g/cm³) : ses liaisons hydrogène forment un réseau ouvert en hexagones. L'eau liquide est la plus dense à 4 °C.",
  piege: "Presque tous les solides coulent dans leur propre liquide : l'eau est une exception. Dans l'éthanol (0,79 g/cm³) un glaçon coulerait. Ce modèle suppose que le glaçon n'a pas le temps de fondre. Les valeurs sont celles de tables, arrondies.",
  build: function(k, S){
    var pal = S.draw.palette, RHO_ICE = 0.917;
    var TT = [0, 4, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], RR = [0.99984, 0.99997, 0.99970, 0.99821, 0.99565, 0.99222, 0.98803, 0.98320, 0.97778, 0.97182, 0.96535, 0.95835];
    function rhoW(t){ for (var i = 0; i < TT.length - 1; i++) if (t <= TT[i + 1]) return RR[i] + (RR[i + 1] - RR[i]) * (t - TT[i]) / (TT[i + 1] - TT[i]); return RR[RR.length - 1]; }
    var c = k.canvas(290), g = k.canvas(200), cube = {y: null, v: 0, drag: false, target: 0, wl: 0, sz: 66, cx: 0, by: 0, by2: 0, bh: 0, off: 0};
    var liq = k.seg("Liquide", [["eau", "Eau pure"], ["mer", "Eau de mer"], ["eth", "Éthanol"]], "eau");
    var T = k.slider("Température du liquide", 0, 100, 1, 4, "°C");
    var mol = k.toggle("Vue moléculaire à la place du graphe", false);
    var ro = k.readouts(["Masse volumique du liquide", "Masse volumique de la glace", "Part immergée", "Verdict"]);
    var nt = k.note("", "");
    /* eau de mer (35 g/kg) : 1,0247 g/cm³ à 20 °C, même dilatation que l'eau pure ; éthanol : 0,789 à 20 °C, −0,00085 g/cm³ par °C */
    c.pointer(function(type, p){
      if (type === "down" && Math.abs(p.x - cube.cx) < cube.sz && p.y > cube.y - 12 && p.y < cube.y + cube.sz + 12){ cube.drag = true; cube.off = p.y - cube.y; cube.v = 0; }
      else if (type === "drag" && cube.drag){ cube.y = Math.max(cube.by - 10, Math.min(cube.by + cube.bh - cube.sz - 3, p.y - cube.off)); cube.v = 0; }
      else if (type === "up") cube.drag = false;
    });
    k.loop(function(dt){ if (cube.y != null && !cube.drag){ var a = (cube.target - cube.y) * 45 - cube.v * 5.5; cube.v += a * dt; cube.y += cube.v * dt; if (cube.y > cube.by + cube.bh - cube.sz - 3){ cube.y = cube.by + cube.bh - cube.sz - 3; cube.v = 0; } } k.redraw(); }).play();
    function rho(){ return liq.value === "eau" ? rhoW(T.value) : liq.value === "mer" ? 1.0247 * rhoW(T.value) / rhoW(20) : 0.789 - 0.00085 * (T.value - 20); }
    k.draw(function(){
      var r = rho(), f = RHO_ICE / r, ctx = c.ctx; c.clear(); g.clear();
      var bw = Math.min(250, c.W - 60), bh = 190, bx = (c.W - bw) / 2, by = 28, sz = 66, cxm = c.W / 2;
      C5.bench(c, by + bh + 2);
      var gl = C5.beaker(c, bx, by, bw, bh, liq.value === "eth" ? "#d6e4f6" : liq.value === "mer" ? "#a6d1ec" : "#bde0f6", 0.72, {taper: 6}), wl = gl.top;
      cube.target = f < 1 ? wl - sz * (1 - f) : by + bh - sz - 3; cube.wl = wl; cube.sz = sz; cube.cx = cxm; cube.by = by; cube.bh = bh;
      if (cube.y == null) cube.y = cube.target - 40;
      var cyc = cube.y, amp = Math.min(1, Math.abs(cube.v) / 60);
      /* ondulations autour du glaçon */
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1.6;
      for (var rp = 0; rp < 2; rp++){ ctx.beginPath(); ctx.ellipse(cxm, wl + 1, sz / 2 + 8 + rp * 12 + amp * 10, 2.5 + rp, 0, 0, 2 * Math.PI); ctx.stroke(); }
      ctx.restore();
      /* glaçon : partie émergée claire, partie immergée teintée par le liquide */
      ctx.save(); S.draw.rrect(c, cxm - sz / 2, cyc, sz, sz, 9);
      var gi = ctx.createLinearGradient(0, cyc, 0, cyc + sz); gi.addColorStop(0, "#fbfeff"); gi.addColorStop(1, "#d3eafb"); ctx.fillStyle = gi; ctx.fill(); ctx.clip();
      if (cyc + sz > wl){ ctx.fillStyle = liq.value === "eth" ? "rgba(150,180,220,.35)" : "rgba(80,150,215,.38)"; ctx.fillRect(cxm - sz / 2, Math.max(cyc, wl), sz, cyc + sz - Math.max(cyc, wl)); }
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cxm - sz / 2 + 9, cyc + 8); ctx.lineTo(cxm - sz / 2 + 9, cyc + sz - 14); ctx.stroke(); ctx.restore();
      ctx.save(); S.draw.rrect(c, cxm - sz / 2, cyc, sz, sz, 9); ctx.strokeStyle = "#6fa6d6"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      S.draw.text(c, "glace", cxm, cyc + sz / 2 - 2, {size: 13, color: "#2c5d94"}); S.draw.text(c, "0,917", cxm, cyc + sz / 2 + 14, {size: 11, color: "#5f7ea3", weight: 600});
      S.draw.line(c, bx + 2, wl, bx + bw - 2, wl, "rgba(31,75,158,.6)", 1.4, [5, 4]);
      if (f < 1 && cyc < wl - 2){
        var rx = cxm + sz / 2 + 16; S.draw.line(c, rx, cyc, rx, wl, pal.red, 2); S.draw.line(c, rx - 4, cyc, rx + 4, cyc, pal.red, 2); S.draw.line(c, rx - 4, wl, rx + 4, wl, pal.red, 2);
        S.draw.label(c, S.fmt((1 - f) * 100, 1) + " % dépasse", Math.min(rx + 8, c.W - 96), (cyc + wl) / 2 - 14, {color: pal.red, align: "left", size: 12});
      }
      S.draw.text(c, "attrape le glaçon et enfonce-le : il remonte", c.W / 2, 12, {size: 12, color: pal.grey});
      if (f >= 1) S.draw.label(c, "il coule", cxm, by + bh + 18, {color: pal.red, size: 13});
      var ax = S.draw.axes(g, {x0: 0, x1: 100, y0: 0.95, y1: 1.002, xl: "T (°C)", stepX: 10, stepY: 0.01, l: 52, t: 26});
      if (mol.value){
        g.clear(); var ctx2 = g.ctx, gw = g.W / 2;
        S.draw.text(g, "Glace : réseau ouvert", gw / 2, 12, {size: 12}); S.draw.text(g, "Eau liquide : plus compact", gw + gw / 2, 12, {size: 12});
        /* même zone pour les deux : glace = réseau en nid d'abeilles (ouvert) ; liquide = ≈ 9 % de molécules en plus dans la même zone (comme ρ : 1,000 / 0,917) */
        var bx0 = gw / 2 - 70, by0 = 30, bwd = 140, bht = 100, ra = 21, ice = [], key = {}, ii, jj, kk;
        S.draw.line(g, bx0, by0, bx0 + bwd, by0, pal.light, 1); S.draw.line(g, bx0, by0 + bht, bx0 + bwd, by0 + bht, pal.light, 1);
        S.draw.line(g, gw + gw / 2 - 70, by0, gw + gw / 2 + 70, by0, pal.light, 1); S.draw.line(g, gw + gw / 2 - 70, by0 + bht, gw + gw / 2 + 70, by0 + bht, pal.light, 1);
        for (jj = 0; jj < 4; jj++) for (ii = 0; ii < 4; ii++){
          var hcx = bx0 + 4 + ii * Math.sqrt(3) * ra + (jj % 2) * Math.sqrt(3) * ra / 2, hcy = by0 + 8 + jj * 1.5 * ra;
          for (kk = 0; kk < 6; kk++){
            var ang = Math.PI / 6 + kk * Math.PI / 3, vx = hcx + ra * Math.cos(ang), vy = hcy + ra * Math.sin(ang), kx = Math.round(vx) + "," + Math.round(vy);
            if (vx >= bx0 + 2 && vx <= bx0 + bwd - 2 && vy >= by0 + 4 && vy <= by0 + bht - 4 && !key[kx]){ key[kx] = 1; ice.push([vx, vy]); }
          }
        }
        for (ii = 0; ii < ice.length; ii++) for (jj = ii + 1; jj < ice.length; jj++){
          if (Math.hypot(ice[ii][0] - ice[jj][0], ice[ii][1] - ice[jj][1]) < ra * 1.08) S.draw.line(g, ice[ii][0], ice[ii][1], ice[jj][0], ice[jj][1], pal.acc, 1.5, [3, 3]);
        }
        ice.forEach(function(q){ C5.atom(g, q[0], q[1], 5, "#c6d6f6", ""); });
        var nl = Math.round(ice.length * 1.09), lc = 6, lr = Math.ceil(nl / lc), lx0 = gw + gw / 2 - 70;
        for (var m2 = 0; m2 < nl; m2++){
          var gc = m2 % lc, gr = Math.floor(m2 / lc);
          C5.atom(g, lx0 + 12 + gc * (116 / (lc - 1)) + 5 * Math.sin(m2 * 2.7), by0 + 12 + gr * ((bht - 24) / Math.max(1, lr - 1)) + 5 * Math.cos(m2 * 1.9), 5, "#c6d6f6", "");
        }
        S.draw.text(g, ice.length + " molécules dans cette zone", gw / 2, by0 + bht + 14, {size: 11, color: pal.grey}); S.draw.text(g, nl + " molécules dans la même zone", gw + gw / 2, by0 + bht + 14, {size: 11, color: pal.grey});
        S.draw.text(g, "··· liaison H", gw / 2, g.H - 10, {size: 12, color: pal.acc});
      } else {
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
