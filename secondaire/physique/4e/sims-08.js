/* Physique 4e · chapitre 8 · Réflexion de la lumière */
(function(){
var D2R = Math.PI / 180, R2D = 180 / Math.PI;

/* nombre d'images par deux miroirs plans (exploration par réflexions successives) ; sert aussi aux tests */
function mirrorImages(thetaDeg, ox, oy){
  var th = thetaDeg * D2R, n1 = [0, 1], n2 = [Math.sin(th), -Math.cos(th)];
  function refl(p, n){ var d = p[0] * n[0] + p[1] * n[1]; return [p[0] - 2 * d * n[0], p[1] - 2 * d * n[1]]; }   /* miroirs passant par l'origine */
  function front(p, n){ return p[0] * n[0] + p[1] * n[1] > 1e-9; }
  /* a = « mât » du fanion, b = côté du fanion : permettent de montrer qu'une réflexion inverse l'orientation */
  var O = [ox, oy], imgs = [], queue = [{p:O, last:-1, n:0, a:[0.2, 0.98], b:[-0.98, 0.2]}], guard = 0;
  function known(p){ if (Math.hypot(p[0] - O[0], p[1] - O[1]) < 1e-6) return true; return imgs.some(function(q){ return Math.hypot(p[0] - q.p[0], p[1] - q.p[1]) < 1e-6; }); }
  while (queue.length && guard++ < 400){
    var cur = queue.shift();
    [[n1, 0], [n2, 1]].forEach(function(m){
      if (m[1] === cur.last) return;
      if (!front(cur.p, m[0])) return;
      var q = refl(cur.p, m[0]);
      if (!known(q)){ var it = {p:q, last:m[1], n:cur.n + 1, a:refl(cur.a, m[0]), b:refl(cur.b, m[0])}; imgs.push(it); queue.push(it); }
    });
  }
  return imgs;
}
window.P4mir = {images:mirrorImages};

SFA.sim({
  id:"p4-c08-loi-reflexion", ch:"c08", tag:"Classique",
  titre:"La loi de la réflexion et le miroir qui tourne",
  resume:"L'angle de réflexion est égal à l'angle d'incidence, mesurés par rapport à la normale.",
  but:"Glisse l'extrémité du rayon incident pour l'incliner. Choisis la direction du rayon incident et incline le miroir. Compare un miroir lisse (réflexion spéculaire) et une surface rugueuse (réflexion diffuse).",
  aRetenir:"Les angles se mesurent par rapport à la NORMALE (perpendiculaire à la surface). Loi : r = i, et les trois (rayon incident, normale, rayon réfléchi) sont dans un même plan. Si on tourne le miroir de δ, le rayon réfléchi tourne de 2δ.",
  piege:"Ne mesure pas les angles par rapport à la surface : l'angle d'incidence est i = 90° − (angle avec la surface). Une surface rugueuse respecte la loi en chaque petit point, mais les normales diffèrent : la lumière part dans tous les sens (réflexion diffuse).",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.72, 1.0), Gm = {x:null}, st = {s:0, hint:true};
    var mode = k.seg("Affichage", [["1","Un rayon"],["l","Faisceau – miroir lisse"],["g","Faisceau – surface rugueuse"]], "1");
    var i0 = k.slider("Direction du rayon (écart à la verticale)", -75, 75, 5, 40, "°", function(){ st.hint = false; });
    var dl = k.slider("Rotation du miroir δ", -30, 30, 1, 0, "°");
    var ro = k.readouts(["Angle d'incidence i", "Angle de réflexion r", "Angle rayon–surface", "Rotation du rayon réfléchi"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.s = (st.s + dt * 0.8) % 1; k.redraw(); }); lp.play();
    PX.drag(k, c, function(){ return Gm.x == null ? [] : [{x:Gm.x, y:Gm.y, r:14, set:function(px, py){ st.hint = false; i0.set(Math.max(-75, Math.min(75, Math.round(Math.atan2(-(px - Gm.cx), -(py - Gm.cy)) * R2D / 5) * 5))); }}]; });
    var TILT = [-24, 11, -7, 27, -15, 6, 20];
    function pulses(x1, y1, x2, y2, col, n){ for (var j = 0; j < n; j++){ var f = (st.s + j / n) % 1; S.draw.glow(c, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 9, col, 0.9); } }
    function beam(x1, y1, x2, y2, col, w){ S.draw.line(c, x1, y1, x2, y2, col.replace("1)", ".28)"), w * 3); S.draw.line(c, x1, y1, x2, y2, col, w); }
    function arc(cx, cy, R, a1, a2, col, lab){
      var diff = a2 - a1; while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
      var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, cy, R, a1, a1 + diff, diff < 0); ctx.stroke(); ctx.restore();
      var am = a1 + diff / 2; S.draw.label(c, lab, cx + (R + 16) * Math.cos(am), cy + (R + 16) * Math.sin(am), {color:col, size:PX.fs(c, 11.5), fill:"rgba(255,255,255,.92)"});
    }
    k.draw(function(){
      var I0 = i0.value * D2R, dd = dl.value * D2R, cx = c.W / 2, cy = c.H * 0.64, L = Math.min(c.W * 0.46, c.H * 0.52), ph = PX.phone(c), ctx = c.ctx;
      var AMB = "rgba(255,170,40,1)", RED = "rgba(255,90,70,1)";
      c.clear(); PX.bg(c, "#10172a", "#1d2742"); Gm.x = null;
      var d = [Math.sin(I0), Math.cos(I0)], n = [-Math.sin(dd), -Math.cos(dd)], tt = [Math.cos(dd), -Math.sin(dd)];
      var dn = d[0] * n[0] + d[1] * n[1], cosI = -dn, ok = cosI > 0.0001, r = [d[0] - 2 * dn * n[0], d[1] - 2 * dn * n[1]];
      function reflect(dv, nv){ var q = dv[0] * nv[0] + dv[1] * nv[1]; return [dv[0] - 2 * q * nv[0], dv[1] - 2 * q * nv[1]]; }
      var hw = L * 1.3;
      function mirror(rough){
        var x1 = cx - tt[0] * hw, y1 = cy - tt[1] * hw, x2 = cx + tt[0] * hw, y2 = cy + tt[1] * hw;
        ctx.fillStyle = "#3a4560"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2 - n[0] * 14, y2 - n[1] * 14); ctx.lineTo(x1 - n[0] * 14, y1 - n[1] * 14); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1; ctx.beginPath(); for (var q = 0; q < 2 * hw; q += 9){ var px = x1 + tt[0] * q, py = y1 + tt[1] * q; ctx.moveTo(px, py); ctx.lineTo(px - n[0] * 12 - tt[0] * 6, py - n[1] * 12 - tt[1] * 6); } ctx.stroke();
        S.draw.line(c, x1, y1, x2, y2, rough ? "#9aa5b8" : "#e6f2ff", rough ? 3 : 4.5);
      }
      if (mode.value === "1"){
        mirror(false);
        S.draw.line(c, cx, cy, cx + n[0] * L, cy + n[1] * L, "rgba(200,210,235,.55)", 1.4, [5, 4]); S.draw.label(c, "normale", cx + n[0] * (L + 14), cy + n[1] * (L + 14), {color:"#c9d3df", fill:"rgba(255,255,255,.12)", size:PX.fs(c, 11)});
        Gm.x = cx - d[0] * L; Gm.y = cy - d[1] * L; Gm.cx = cx; Gm.cy = cy;
        var an = Math.atan2(n[1], n[0]);
        beam(Gm.x, Gm.y, cx, cy, AMB, 2.4); pulses(Gm.x, Gm.y, cx, cy, "#ffd24a", 3);
        if (ok){
          beam(cx, cy, cx + r[0] * L, cy + r[1] * L, RED, 2.4); pulses(cx, cy, cx + r[0] * L, cy + r[1] * L, "#ff9a85", 3);
          var Rr = Math.min(48, L * 0.4);
          arc(cx, cy, Rr, an, Math.atan2(-d[1], -d[0]), P.amber, "i"); arc(cx, cy, Rr + 14, an, Math.atan2(r[1], r[0]), P.red, "r");
        } else S.draw.label(c, "le rayon arrive par l'arrière du miroir", cx, 18, {color:P.red, fill:"rgba(255,255,255,.92)", size:12});
        ctx.save(); ctx.translate(Gm.x, Gm.y); ctx.rotate(-I0); ctx.fillStyle = "#8a95a3"; PX.rr(ctx, -10, -30, 20, 30, 4); ctx.fill(); ctx.fillStyle = "#c0321d"; ctx.fillRect(-3, -2, 6, 4); ctx.restore();
        PX.grip(c, Gm.x, Gm.y, P.amber, st.hint ? "glisse le laser" : null, 7);
        var I = ok ? Math.acos(cosI) * R2D : NaN;
        ro.set(0, ok ? S.fmt(I, 1) + " °" : "—"); ro.set(1, ok ? S.fmt(I, 1) + " °" : "—"); ro.set(2, ok ? S.fmt(90 - I, 1) + " °" : "—"); ro.set(3, ok ? S.fmt(2 * dl.value, 0) + " °" : "—");
        nt.set(ok ? "r = i = " + S.fmt(I, 1) + " °. L'angle avec la surface (" + S.fmt(90 - I, 1) + " °) n'est PAS l'angle d'incidence. Tourne le miroir de " + S.fmt(dl.value, 0) + " ° : le rayon réfléchi tourne de " + S.fmt(2 * dl.value, 0) + " °." : "Le miroir est vu de dos : aucune réflexion utile.", ok ? "" : "warn");
      } else {
        var rough = mode.value === "g", NS = 7, W = 2 * L, base = cy, j, xc, tl, hl, nj, tj, rv, okj;
        ctx.fillStyle = "#3a4560"; ctx.fillRect(cx - W / 2 - 10, base, W + 20, 14);
        for (j = 0; j < NS; j++){
          xc = cx - W / 2 + (j + 0.5) * W / NS; tl = rough ? TILT[j] * D2R : 0; hl = W / NS / 2 * 0.95;
          nj = [-Math.sin(tl), -Math.cos(tl)]; tj = [Math.cos(tl), -Math.sin(tl)];
          S.draw.line(c, xc - tj[0] * hl, base - tj[1] * hl, xc + tj[0] * hl, base + tj[1] * hl, rough ? "#b4bfd2" : "#e6f2ff", 4);
          rv = reflect(d, nj); okj = -(d[0] * nj[0] + d[1] * nj[1]) > 0.0001;
          beam(xc - d[0] * 120, base - d[1] * 120, xc, base, AMB, 1.6);
          if (okj){ beam(xc, base, xc + rv[0] * 120, base + rv[1] * 120, RED, 1.6); pulses(xc, base, xc + rv[0] * 120, base + rv[1] * 120, "#ff9a85", 2); }
          if (rough) S.draw.line(c, xc, base, xc + nj[0] * 26, base + nj[1] * 26, "rgba(200,210,235,.6)", 1, [3, 3]);
        }
        ro.set(0, "variable"); ro.set(1, "= i en chaque point"); ro.set(2, "—"); ro.set(3, "—");
        nt.set(rough ? "Surface rugueuse : chaque petit morceau est un petit miroir avec sa propre normale (pointillés). La loi r = i est vraie partout, mais les rayons repartent dans des directions variées : réflexion diffuse. C'est ce qui permet de voir une feuille de papier de n'importe où." : "Miroir lisse : toutes les normales sont parallèles, donc le faisceau parallèle reste parallèle : réflexion spéculaire. On ne voit l'image que depuis une direction.", "");
      }
    });
  }
});

SFA.sim({
  id:"p4-c08-image-miroir", ch:"c08", tag:"Construction",
  titre:"L'image d'un objet dans un miroir plan",
  resume:"Déplace l'objet et l'œil : où se forme l'image ? Le miroir est-il assez grand ?",
  but:"Glisse le point rouge (objet) et le point bleu (œil) avec la souris ou le doigt. Change la longueur du miroir. Vérifie la position de l'image et si l'œil la voit.",
  aRetenir:"L'image d'un objet dans un miroir plan est symétrique de l'objet par rapport au miroir : même distance derrière que l'objet devant, même taille. C'est une image VIRTUELLE : les rayons ne s'y croisent pas vraiment, seuls leurs prolongements (pointillés) s'y croisent.",
  piege:"L'image n'est pas « sur » le miroir ni dans le miroir : elle est symétrique, derrière. On ne pourrait pas la recueillir sur un écran placé là. Et pour la voir, il faut que le rayon réfléchi qui va vers l'œil touche réellement le miroir.",
  build:function(k,S){
    var c = PX.canvas(k, 0.5, 0.78), st = {ox:-2.2, oy:1.0, ex:-3.4, ey:1.6, drag:null, hint:true};
    var len = k.slider("Longueur du miroir", 0.4, 3.4, 0.1, 2, "m");
    var ro = k.readouts(["Distance objet – miroir", "Distance image – miroir", "L'œil voit l'image ?"]);
    var nt = k.note("", "");
    var sc, X, Y, ix, iy;
    function setup(){ sc = Math.min((c.W - 24) / 9, (c.H - 20) / 3.4); X = function(x){ return 12 + (x + 4.5) * sc; }; Y = function(y){ return c.H - 10 - y * sc; }; ix = function(px){ return (px - 12) / sc - 4.5; }; iy = function(py){ return (c.H - 10 - py) / sc; }; }
    c.pointer(function(type, p){
      setup();
      if (type === "down"){ var dO = Math.hypot(X(st.ox) - p.x, Y(st.oy) - p.y), dE = Math.hypot(X(st.ex) - p.x, Y(st.ey) - p.y); st.drag = dO < 36 && dO <= dE ? "o" : dE < 36 ? "e" : null; if (st.drag) st.hint = false; }
      if ((type === "down" || type === "drag") && st.drag){ var x = Math.max(st.drag === "o" ? -3.6 : -4.4, Math.min(-0.3, ix(p.x))), y = Math.max(0.1, Math.min(3.2, iy(p.y))); if (st.drag === "o"){ st.ox = x; st.oy = y; } else { st.ex = x; st.ey = y; } k.redraw(); }
      if (type === "up") st.drag = null;
    });
    k.draw(function(){
      setup(); var P = SFA.draw.palette, ctx = c.ctx, mc = 1.7, half = len.value / 2;
      c.clear(); PX.bg(c, "#f6f1ea", "#ebe4d9");
      ctx.fillStyle = PX.lin(c, 0, Y(0), 0, c.H, [[0, "#c9b9a2"], [1, "#b8a78e"]]); ctx.fillRect(0, Y(0), c.W, c.H - Y(0));
      ctx.fillStyle = "rgba(47,127,209,.10)"; ctx.fillRect(X(0), 0, c.W - X(0), Y(0));
      S.draw.label(c, "derrière le miroir : monde « virtuel »", X(0) + 8, c.H * 0.1, {color:"#2f7fd1", align:"left", size:PX.fs(c, 11), fill:"rgba(255,255,255,.7)"});
      ctx.fillStyle = PX.lin(c, X(0) - 7, 0, X(0) + 7, 0, [[0, "#cfe3f2"], [0.5, "#f4fbff"], [1, "#a9c4d8"]]); ctx.fillRect(X(0) - 5, Y(mc + half), 10, len.value * sc);
      ctx.strokeStyle = "#5a4a38"; ctx.lineWidth = 2.5; ctx.strokeRect(X(0) - 5, Y(mc + half), 10, len.value * sc);
      S.draw.line(c, X(0), Y(0), X(0), Y(3.4), "#b8a78e", 1, [4, 4]);
      var O = [st.ox, st.oy], E = [st.ex, st.ey], Im = [-st.ox, st.oy];
      /* image virtuelle : même objet, estompé, de l'autre côté */
      ctx.save(); ctx.globalAlpha = 0.4; PX.ball(c, X(Im[0]), Y(Im[1]), 9, P.red); ctx.restore();
      S.draw.line(c, X(O[0]), Y(O[1]), X(Im[0]), Y(Im[1]), "rgba(180,35,24,.4)", 1, [2, 4]);
      S.draw.label(c, "image", X(Im[0]), Y(Im[1]) - 20, {color:P.red, size:PX.fs(c, 11.5)});
      /* rayon vers l'œil */
      var t = (0 - E[0]) / (Im[0] - E[0]), yh = E[1] + t * (Im[1] - E[1]), sees = Math.abs(yh - mc) <= half;
      if (sees){
        S.draw.line(c, X(O[0]), Y(O[1]), X(0), Y(yh), P.amber, 2.5); S.draw.line(c, X(0), Y(yh), X(E[0]), Y(E[1]), P.amber, 2.5);
        S.draw.line(c, X(0), Y(yh), X(Im[0]), Y(Im[1]), P.amber, 1.5, [4, 4]);
      } else S.draw.line(c, X(E[0]), Y(E[1]), X(0.0), Y(yh), "#b8c0cc", 1.5, [4, 4]);
      /* second rayon : touche le miroir 0,6 m plus haut */
      var yb = O[1] + 0.6, okb = Math.abs(yb - mc) <= half;
      if (okb){ S.draw.line(c, X(O[0]), Y(O[1]), X(0), Y(yb), P.green, 2); S.draw.line(c, X(0), Y(yb), X(O[0]), Y(yb + 0.6), P.green, 2); S.draw.line(c, X(0), Y(yb), X(Im[0]), Y(Im[1]), P.green, 1.5, [4, 4]); }
      PX.ball(c, X(O[0]), Y(O[1]), 9, P.red); S.draw.label(c, "objet", X(O[0]), Y(O[1]) + 21, {color:P.red, size:PX.fs(c, 11.5)});
      /* œil : amande + iris */
      ctx.save(); ctx.translate(X(E[0]), Y(E[1])); ctx.fillStyle = "#fff"; ctx.strokeStyle = P.acc; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 13, 8, 0, 0, 6.2832); ctx.fill(); ctx.stroke();
      ctx.fillStyle = P.acc; ctx.beginPath(); ctx.arc(4, 0, 5, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(5.5, -1.5, 1.4, 0, 6.2832); ctx.fill(); ctx.restore();
      S.draw.label(c, "œil", X(E[0]), Y(E[1]) - 20, {color:P.acc, size:PX.fs(c, 11.5)});
      if (st.hint) S.draw.label(c, "glisse l'objet et l'œil", c.W / 2, c.H - 12, {color:P.grey, size:11.5});
      ro.set(0, S.fmt(-O[0], 2) + " m"); ro.set(1, S.fmt(-O[0], 2) + " m (derrière)"); ro.set(2, sees ? "oui" : "non (le rayon manque le miroir)");
      nt.set(sees ? "Le rayon réfléchi vers l'œil touche le miroir à " + S.fmt(yh, 2) + " m de hauteur : l'œil voit l'image. Les prolongements en pointillés se coupent exactement à l'image." : "Le rayon qui irait de l'image à l'œil traverse le plan du miroir hors du miroir : l'œil ne voit pas l'image. Rallonge le miroir ou déplace l'œil.", sees ? "" : "warn");
    });
  }
});

SFA.sim({
  id:"p4-c08-deux-miroirs", ch:"c08", tag:"Kaléidoscope",
  titre:"Deux miroirs à angle : combien d'images ?",
  resume:"Plus l'angle entre deux miroirs est petit, plus on voit d'images : N = 360°/θ − 1.",
  but:"Choisis l'angle entre les miroirs, puis glisse le drapeau rouge entre eux. Compte les images : le nombre ne dépend pas de la position de l'objet. Le fanion change de côté à chaque réflexion.",
  aRetenir:"Pour deux miroirs plans faisant un angle θ avec 360°/θ entier pair, il se forme N = 360°/θ − 1 images, quelle que soit la position de l'objet. θ = 90° : 3 images ; 60° : 5 ; 45° : 7. Parallèles (θ → 0) : une infinité d'images. À θ = 180° (un seul miroir plan) : 1 image.",
  piege:"Chaque image est l'image d'une image : elle est obtenue par réflexions successives. Si 360°/θ est impair (120°, 72°…), le nombre d'images dépend de la position de l'objet. Les images « de rang élevé » sont tournées ou retournées (une réflexion inverse l'orientation, deux la rétablissent). Toutes les images et l'objet sont sur un même cercle centré sur l'arête.",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.9, 1.0), st = {r:0.55, a:0.5, hint:true};
    var th = k.select("Angle θ entre les miroirs", [[180,"180° (un seul miroir)"],[90,"90°"],[60,"60°"],[45,"45°"],[36,"36°"],[30,"30°"]], 90);
    var ro = k.readouts(["Angle θ", "Images comptées", "360°/θ − 1"]);
    var nt = k.note("", "");
    var cx0, cy0, Rc;
    function geo(){ cx0 = c.W / 2; cy0 = c.H / 2; Rc = Math.min(c.W, c.H) / 2 - 16; }
    c.pointer(function(type, p){
      if (type === "up" || type === "move") return; geo(); st.hint = false; var T = +th.value, rot = -(T / 2) * D2R;
      var vx = p.x - cx0, vy = p.y - cy0;
      var ang = Math.atan2(-vy, vx) - rot, rr = Math.hypot(vx, vy) / Rc;
      ang = Math.max(0.12 * T * D2R, Math.min(0.88 * T * D2R, ang)); rr = Math.max(0.15, Math.min(0.85, rr));
      st.a = ang; st.r = rr; k.redraw();
    });
    function flag(x, y, a, b, col, al, s){   /* drapeau : mât a (direction), fanion b (côté) */
      var ctx = c.ctx; ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.2; ctx.lineCap = "round";
      var tx = x + a[0] * s, ty = y - a[1] * s, mx = x + a[0] * s * 0.5, my = y - a[1] * s * 0.5, bx = b[0] * s * 0.55, by = -b[1] * s * 0.55;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + bx, ty + by); ctx.lineTo(mx + bx * 0.2 + (tx - mx) * 0.1, my + by * 0.2 + (ty - my) * 0.1); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    function reflV(v, n){ var d = v[0] * n[0] + v[1] * n[1]; return [v[0] - 2 * d * n[0], v[1] - 2 * d * n[1]]; }
    k.draw(function(){
      geo(); var T = +th.value, rot = -(T / 2) * D2R, ctx = c.ctx, ph = PX.phone(c);
      st.a = Math.max(0.12 * T * D2R, Math.min(0.88 * T * D2R, st.a));
      var ox = st.r * Math.cos(st.a), oy = st.r * Math.sin(st.a), imgs = mirrorImages(T, ox, oy);
      function scr(p){ var x = p[0] * Math.cos(rot) - p[1] * Math.sin(rot), y = p[0] * Math.sin(rot) + p[1] * Math.cos(rot); return [cx0 + x * Rc, cy0 - y * Rc]; }
      function dirScr(v){ return [v[0] * Math.cos(rot) - v[1] * Math.sin(rot), v[0] * Math.sin(rot) + v[1] * Math.cos(rot)]; }
      c.clear();
      PX.bg(c, "#f2f5fa", "#e1e8f2");
      var n1 = [0, 1], n2 = [Math.sin(T * D2R), -Math.cos(T * D2R)];
      ctx.strokeStyle = "#c9d3e0"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx0, cy0, st.r * Rc, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
      if (T < 180){ ctx.fillStyle = "rgba(47,127,209,.07)"; var a1 = scr([1, 0]), a2 = scr([Math.cos(T * D2R), Math.sin(T * D2R)]); ctx.beginPath(); ctx.moveTo(cx0, cy0); ctx.lineTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.closePath(); ctx.fill(); }
      /* miroirs : verre + hachures à l'arrière */
      [0, T * D2R].forEach(function(a, j){
        var e = scr([Math.cos(a), Math.sin(a)]), vx = e[0] - cx0, vy = e[1] - cy0, L = Math.hypot(vx, vy), nx = -vy / L, ny = vx / L, sgn = j === 0 ? 1 : -1;
        var sd = (T === 180 ? 1 : 1);
        ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); for (var q = 8; q < L; q += 9){ ctx.moveTo(cx0 + vx * q / L, cy0 + vy * q / L); ctx.lineTo(cx0 + vx * q / L - nx * 7 * sgn * -1, cy0 + vy * q / L - ny * 7 * sgn * -1); } ctx.stroke();
        S.draw.line(c, cx0, cy0, e[0], e[1], "#13233a", 4); S.draw.line(c, cx0, cy0, e[0], e[1], "#cfe3f2", 1.6);
      });
      /* angle */
      if (T < 180){ ctx.strokeStyle = P.violet; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx0, cy0, 26, -(rot + T * D2R), -rot, false); ctx.stroke(); var am = scr([Math.cos(T / 2 * D2R) * 0.2, Math.sin(T / 2 * D2R) * 0.2]); S.draw.label(c, T + "°", am[0], am[1], {color:P.violet, size:11.5}); }
      /* images : fanion qui change de côté à chaque réflexion */
      var sz = ph ? 19 : 25;
      imgs.forEach(function(q, i){ var s = scr(q.p), a = dirScr(q.a), b = dirScr(q.b); flag(s[0], s[1], a, b, q.n % 2 ? P.acc : P.green, 0.8, sz); S.draw.label(c, String(i + 1), s[0] + 10, s[1] + 10, {color:"#fff", fill:q.n % 2 ? P.acc : P.green, size:10}); });
      var so = scr([ox, oy]); flag(so[0], so[1], dirScr([0.2, 0.98]), dirScr([-0.98, 0.2]), P.red, 1, sz + 2);
      S.draw.label(c, "objet", so[0] - 6, so[1] + 14, {color:P.red, size:11});
      if (st.hint) S.draw.label(c, "glisse le drapeau rouge", c.W / 2, 16, {color:P.red, size:11.5});
      S.draw.legend(c, [[P.red, "objet"], [P.acc, "1 réflexion (inversé)"], [P.green, "2 réflexions (rétabli)"]], 8, c.H - 70, {});
      var N = 360 / T - 1;
      ro.set(0, T + " °"); ro.set(1, imgs.length + " image" + (imgs.length > 1 ? "s" : "")); ro.set(2, S.fmt(N, 0));
      nt.set(imgs.length === N ? "Le nombre d'images (" + imgs.length + ") est bien 360°/" + T + "° − 1 = " + N + ". Déplace l'objet : il ne change pas." : "Compte : " + imgs.length + ".", imgs.length === N ? "" : "warn");
    });
  }
});

SFA.sim({
  id:"p4-c08-se-voir-entier", ch:"c08", tag:"Niche utile",
  titre:"Se voir en entier : quelle taille de miroir ?",
  resume:"Pour se voir de la tête aux pieds, il suffit d'un miroir de la moitié de sa taille, quelle que soit la distance.",
  but:"Règle la taille du miroir et la hauteur de son bord bas (glisse ses deux bords). Les parties de ton corps visibles sont en vert. Recule ou avance (glisse la personne) : rien ne change !",
  aRetenir:"Pour voir tout son corps, la hauteur du miroir doit être au moins la moitié de la taille de la personne, et son bord bas doit être à au plus la moitié de la hauteur des yeux. La distance au miroir n'intervient pas : l'image s'éloigne en même temps que toi.",
  piege:"Beaucoup pensent qu'en reculant, on voit plus de son corps. Faux : la partie visible ne dépend pas de la distance (la taille apparente de l'image diminue, mais la portion de corps vue est la même).",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.58, 0.8), st = {hint:true}, G0 = {};
    var hp = k.slider("Ta taille", 1.4, 2, 0.05, 1.7, "m");
    var hm = k.slider("Hauteur du miroir", 0.2, 1.8, 0.05, 0.6, "m");
    var bm = k.slider("Bord bas du miroir (au-dessus du sol)", 0, 1.2, 0.05, 0.6, "m");
    var dist = k.slider("Distance au miroir", 0.5, 4, 0.1, 1.5, "m");
    var ro = k.readouts(["Parties visibles (hauteurs)", "Miroir minimal", "Bord bas maximal"]);
    var nt = k.note("", "");
    var q5 = function(v){ return Math.round(v / 0.05) * 0.05; };
    PX.drag(k, c, function(){ return [
      {x:G0.mx, y:G0.yTop, r:9, set:function(px, py){ st.hint = false; var top = (G0.y0 - py) / G0.sc; hm.set(Math.max(0.2, Math.min(1.8, q5(top - bm.value)))); }},
      {x:G0.mx, y:G0.yBot, r:9, set:function(px, py){ st.hint = false; var top = bm.value + hm.value, b = Math.max(0, Math.min(1.2, q5((G0.y0 - py) / G0.sc))); var nb = Math.min(b, top - 0.2); bm.set(nb); hm.set(Math.max(0.2, Math.min(1.8, q5(top - nb)))); }},
      {x:G0.px, y:G0.y0 - hp.value * G0.sc * 0.5, r:22, set:function(px){ st.hint = false; dist.set(Math.max(0.5, Math.min(4, Math.round((G0.mx - px) / G0.sc * 10) / 10))); }}
    ]; });
    k.draw(function(){
      var Hp = hp.value, ye = Hp - 0.1, Hm = hm.value, b = bm.value, d = dist.value, top = b + Hm, ph = PX.phone(c);
      var sc = Math.min((c.W - 40) / 5.4, (c.H - 34) / 2.15), y0 = c.H - 18, mx = 24 + 4.6 * sc, X = function(x){ return mx + x * sc; }, Y = function(y){ return y0 - y * sc; };
      G0.sc = sc; G0.y0 = y0; G0.mx = mx; G0.yTop = Y(top); G0.yBot = Y(b); G0.px = X(-d);
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#f4efe8", "#e9e2d8"); ctx.fillStyle = "#c9b9a2"; ctx.fillRect(0, y0, c.W, c.H - y0);
      ctx.fillStyle = "rgba(15,27,45,.07)"; ctx.fillRect(mx, 0, c.W - mx, y0);
      /* miroir */
      ctx.fillStyle = PX.lin(c, mx - 7, 0, mx + 7, 0, [[0, "#cfe3f2"], [0.5, "#f4fbff"], [1, "#a9c4d8"]]); ctx.fillRect(mx - 5, Y(top), 10, Y(b) - Y(top));
      ctx.strokeStyle = "#5a4a38"; ctx.lineWidth = 2.5; ctx.strokeRect(mx - 5, Y(top), 10, Y(b) - Y(top));
      S.draw.label(c, "miroir " + S.fmt(Hm, 2) + " m", mx + 8, Y(top) - 12, {color:"#5a4a38", align:"left", size:11});
      var lo = Math.max(0, 2 * b - ye), hi = Math.min(Hp, 2 * top - ye), vis = hi > lo, xp = X(-d);
      /* rayons œil → miroir → pieds / tête */
      [[0, "pieds"], [Hp, "tête"]].forEach(function(q){
        var ym = (q[0] + ye) / 2, inM = ym >= b - 1e-9 && ym <= top + 1e-9, col = inM ? P.amber : "#a3adba";
        S.draw.line(c, xp + 4, Y(ye), mx, Y(ym), col, 1.8, inM ? null : [4, 4]);
        if (inM) S.draw.line(c, mx, Y(ym), xp, Y(q[0]), col, 1.8);
        else S.draw.line(c, mx, Y(ym), mx + Math.min(60, c.W - mx - 4), Y(ym) + (Y(q[0]) - Y(ye)) * 0.0 - (Y(ye) - Y(ym)) * 0.5, "rgba(163,173,186,.6)", 1.3, [3, 3]);
        if (inM) S.draw.line(c, mx, Y(ym), mx + Math.min(70, c.W - mx - 6), Y(ym) + (Y(ym) - Y(q[0])) * 0.25 * 0, "rgba(244,170,40,.0)", 1);
      });
      /* personne */
      var h = Hp * sc;
      PX.person(c, xp, y0, h, {col:P.acc, armX:5, armY:-50});
      S.draw.line(c, xp + 12 * (h / 100) + 6, Y(lo), xp + 12 * (h / 100) + 6, Y(Hp), "rgba(160,170,185,.7)", 5);
      if (vis) S.draw.line(c, xp + 12 * (h / 100) + 6, Y(lo), xp + 12 * (h / 100) + 6, Y(hi), P.green, 5);
      S.draw.dot(c, xp + 3, Y(ye), 3.4, "#fff");
      S.draw.label(c, "d = " + S.fmt(d, 1) + " m", (xp + mx) / 2, y0 - 6 - 0, {color:P.grey, size:11});
      S.draw.line(c, xp, y0 + 8, mx, y0 + 8, "#8a95a3", 1.2);
      if (vis) S.draw.label(c, "tu vois : " + S.fmt(lo, 2) + " à " + S.fmt(hi, 2) + " m", xp - 6, Y(Hp) - 14, {color:P.green, align:"left", size:ph ? 10.5 : 11.5});
      PX.grip(c, mx, Y(top), "#5a4a38", st.hint ? "tire" : null, 6); PX.grip(c, mx, Y(b), "#5a4a38", null, 6);
      var full = lo <= 1e-9 && hi >= Hp - 1e-9;
      if (full) S.draw.label(c, "tu te vois en entier", c.W / 2, 16, {color:P.green, size:12.5});
      ro.set(0, vis ? S.fmt(lo, 2) + " m à " + S.fmt(hi, 2) + " m (sur " + S.fmt(Hp, 2) + " m)" : "rien"); ro.set(1, S.fmt(Hp / 2, 2) + " m"); ro.set(2, S.fmt(ye / 2, 2) + " m");
      nt.set(full ? "Tu te vois en entier. La distance (" + S.fmt(d, 1) + " m) ne change pas ce résultat." : vis ? "Tu ne te vois pas en entier : il manque " + (lo > 1e-9 ? "le bas du corps (jusqu'à " + S.fmt(lo, 2) + " m) " : "") + (hi < Hp - 1e-9 ? "le haut du corps (au-dessus de " + S.fmt(hi, 2) + " m)" : "") + ". Agrandis le miroir ou baisse son bord." : "Le miroir est trop haut ou trop bas : tu ne vois rien de ton corps.", full ? "" : "warn");
    });
  }
});
})();
