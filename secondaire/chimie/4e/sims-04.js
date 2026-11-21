/* Chimie 4e · chapitre 4 · Gaz */
/* refonte 21/11/2026 : piston en 3D qu'on fait tourner, ballon plongé dans un vase Dewar d'azote liquide */
(function(){
function shadeG(hex,f){ var m=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); if(!m) return hex; var v=[1,2,3].map(function(i){ var x=parseInt(m[i],16); x=f<0?x*(1+f):x+(255-x)*f; return Math.max(0,Math.min(255,Math.round(x))); }); return "rgb("+v.join(",")+")"; }
function ballG(g,x,y,r,hex,al){ if(!(r>0)||!isFinite(x)||!isFinite(y)) return; g.save(); if(al!=null) g.globalAlpha=al; var gr=g.createRadialGradient(x-r*.38,y-r*.42,r*.05,x,y,r*1.05); gr.addColorStop(0,shadeG(hex,.75)); gr.addColorStop(.45,hex); gr.addColorStop(1,shadeG(hex,-.45)); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,6.2832); g.fill(); g.restore(); }
function rot3G(p,a,b){ var x=p[0]*Math.cos(a)+p[2]*Math.sin(a), z=-p[0]*Math.sin(a)+p[2]*Math.cos(a), y=p[1]; return [x,y*Math.cos(b)-z*Math.sin(b),y*Math.sin(b)+z*Math.cos(b)]; }
function proj3G(p,st,sc,cx,cy){ var r=rot3G(p,st.a,st.b), s=1/(1-r[2]*0.1); return {x:cx+r[0]*sc*s, y:cy-r[1]*sc*s, z:r[2], s:s}; }
function ratioCanvas(k, desk, phone){ var c = k.canvas(0,{ratio:desk}); Object.defineProperty(c,"ratio",{get:function(){ var w=c.cv.parentNode?c.cv.parentNode.clientWidth:600; return w<460?phone:desk; }, configurable:true}); c.resize(); return c; }
function wallBench(c, benchY){ var g=c.ctx, W=c.W, H=c.H, gr=g.createLinearGradient(0,0,0,benchY); gr.addColorStop(0,"#f1f4f8"); gr.addColorStop(1,"#dfe6ee"); g.save(); g.fillStyle=gr; g.fillRect(0,0,W,benchY);
  g.strokeStyle="rgba(255,255,255,.6)"; g.lineWidth=1; for(var y=20;y<benchY;y+=28){ g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); } for(var x=14;x<W;x+=36){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,benchY); g.stroke(); }
  var gb=g.createLinearGradient(0,benchY,0,H); gb.addColorStop(0,"#cdb48e"); gb.addColorStop(1,"#a88a62"); g.fillStyle=gb; g.fillRect(0,benchY,W,H-benchY); g.fillStyle="rgba(255,255,255,.45)"; g.fillRect(0,benchY,W,2); g.restore(); }
/* thermomètre à liquide : x centre, y0 haut, y1 bas du tube, f remplissage 0..1 */
function thermo(c, x, y0, y1, f, col, S){ var g=c.ctx; g.save(); S.draw.rrect(c,x-7,y0,14,y1-y0,7); g.fillStyle="rgba(255,255,255,.92)"; g.fill(); g.strokeStyle="#8a95a3"; g.lineWidth=1.5; g.stroke();
  for(var i=0;i<=10;i++){ var yy=y1-(y1-y0-8)*i/10; g.beginPath(); g.moveTo(x+7,yy); g.lineTo(x+(i%5?11:14),yy); g.stroke(); }
  g.fillStyle=col; S.draw.rrect(c,x-3,y1-(y1-y0-6)*f,6,(y1-y0-6)*f+4,3); g.fill(); ballG(g,x,y1+8,10,col); g.restore(); }

SFA.sim({
  id:"c4-c04-piston", ch:"c04", tag:"Animation",
  titre:"Le piston : p, V, T et n",
  resume:"Un gaz dans un cylindre à piston, en 3D : fais varier V, T et n et regarde le manomètre et l'agitation des molécules.",
  but:"Modifie le volume (ou pousse le piston), la température et la quantité de gaz. La pression se calcule avec p·V = n·R·T ; le manomètre l'affiche et la courbe en bas est l'isotherme. Glisse sur le cylindre pour le faire tourner.",
  aRetenir:"p·V = n·R·T avec T en kelvins (T = θ + 273). À T et n constants, p·V est constant (Boyle) : diviser V par 2 double p.",
  piege:"Dans p·V = n·R·T, la température doit être en kelvins. À 0 °C la température n'est pas nulle : T = 273 K. (Chaque bille représente un très grand nombre de molécules.)",
  build:function(k, S){
    var c = ratioCanvas(k, 0.9, 1.2), g = k.canvas(220), R = 8.31, Pl = S.draw.palette;
    var V = k.slider("Volume V", 0.3, 3, 0.1, 1.5, "L");
    var T = k.slider("Température θ", -20, 200, 5, 20, "°C");
    var n = k.slider("Quantité de gaz n", 0.01, 0.10, 0.01, 0.05, "mol");
    var ro = k.readouts(["T absolue", "Pression p", "p·V"]);
    var nt = k.note("", "");
    var view = {a:0.5, b:0.36, drag:false}, tt = 0, push = null, hits = [];
    k.button("▶ Pousser le piston (3 L → 0,5 L)", function(){ V.set(3); push = {t:0}; }, true);
    var rnd = C4.rnd(11), M = [];
    for (var i = 0; i < 100; i++){ var an = rnd()*6.2832, rr0 = Math.sqrt(rnd())*0.62, th = rnd()*6.2832, ph = Math.acos(2*rnd()-1); M.push({x:Math.cos(an)*rr0, z:Math.sin(an)*rr0, y:rnd(), vx:Math.sin(ph)*Math.cos(th), vy:Math.cos(ph), vz:Math.sin(ph)*Math.sin(th)}); }
    var RC = 0.72, HMAX = 2.4;
    function hOf(v){ return v/3*HMAX; }
    var lp = k.loop(function(dt){
      tt += dt;
      if (push){ push.t += dt; var v = 3-2.5*Math.min(1, push.t/4); V.set(Math.round(v*100)/100); if (push.t >= 4){ V.set(0.5); push = null; } }
      var sp = 0.9*Math.sqrt((T.value+273)/293), cnt = Math.round(n.value*1000), h = hOf(V.value);
      for (var i = 0; i < cnt; i++){ var q = M[i]; if (q.y > h-0.06) q.y = Math.max(0.05, h-0.06-Math.random()*0.1*h);
        q.x += q.vx*sp*dt; q.y += q.vy*sp*dt; q.z += q.vz*sp*dt;
        var r2 = q.x*q.x+q.z*q.z, rm = RC-0.07; if (r2 > rm*rm){ var r = Math.sqrt(r2), nx = q.x/r, nz = q.z/r, dd = q.vx*nx+q.vz*nz; q.vx -= 2*dd*nx; q.vz -= 2*dd*nz; q.x = nx*rm; q.z = nz*rm; }
        if (q.y < 0.05){ q.y = 0.05; q.vy = Math.abs(q.vy); }
        if (q.y > h-0.05){ q.y = h-0.05; q.vy = -Math.abs(q.vy); if (hits.length < 40) hits.push({x:q.x, z:q.z, a:1}); } }
      hits.forEach(function(hh){ hh.a -= dt*5; }); hits = hits.filter(function(hh){ return hh.a > 0; });
      if (!view.drag) view.a += dt*0.15;
      k.redraw();
    });
    lp.play();
    c.pointer(function(type, p){ if (type === "down"){ view.drag = true; view.lx = p.x; view.ly = p.y; } else if (type === "drag" && view.drag){ view.a += (p.x-view.lx)*0.012; view.b = Math.max(0.05, Math.min(0.95, view.b+(p.y-view.ly)*0.008)); view.lx = p.x; view.ly = p.y; } else if (type === "up") view.drag = false; });
    function pres(v, Tc, nn){ return nn*R*(Tc+273)/(v/1000); }
    k.draw(function(){
      var v = V.value, Tk = T.value+273, p = pres(v, T.value, n.value), W = c.W, H = c.H, ctx = c.ctx, ph1 = W < 460, h = hOf(v), i;
      c.clear(); var benchY = H*0.88; wallBench(c, benchY);
      var sc = Math.min(W*(ph1 ? 0.27 : 0.25), (benchY-16)/3.9), cx = W*(ph1 ? 0.42 : 0.38), cy = benchY-sc*0.42;
      var P3 = function(x, y, z){ return proj3G([x, y, z], view, sc, cx, cy); };
      function ring(y, r){ var out = []; for (var j = 0; j <= 48; j++){ var an = j/48*6.2832; out.push(P3(Math.cos(an)*r, y, Math.sin(an)*r)); } return out; }
      function path(pts, close){ ctx.beginPath(); pts.forEach(function(q, j){ j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); if (close) ctx.closePath(); }
      function band(y0, y1, r, col, dark){ var a0 = ring(y0, r), a1 = ring(y1, r); var lx = 1e9, rx = -1e9, li = 0, ri = 0; a0.forEach(function(q, j){ if (q.x < lx){ lx = q.x; li = j; } if (q.x > rx){ rx = q.x; ri = j; } });
        ctx.beginPath(); ctx.moveTo(a0[li].x, a0[li].y); ctx.lineTo(a1[li].x, a1[li].y); ctx.lineTo(a1[ri].x, a1[ri].y); ctx.lineTo(a0[ri].x, a0[ri].y); ctx.closePath();
        var gr = ctx.createLinearGradient(a0[li].x, 0, a0[ri].x, 0); gr.addColorStop(0, shadeG(col, -0.35)); gr.addColorStop(0.35, shadeG(col, 0.35)); gr.addColorStop(1, shadeG(col, -0.5)); ctx.fillStyle = gr; ctx.fill();
        path(a0.filter(function(q){ return q.z > -0.02 || true; }), true); ctx.fill(); path(a1, true); ctx.fillStyle = shadeG(col, dark ? -0.1 : 0.2); ctx.fill(); return {l:a0[li], r:a0[ri], tl:a1[li], tr:a1[ri]}; }
      /* socle chauffant : rougit quand c'est chaud, se couvre de givre quand c'est froid */
      var hot = Math.max(0, Math.min(1, (T.value-25)/175)), cold = Math.max(0, Math.min(1, (10-T.value)/30));
      if (hot > 0.02){ var hp = P3(0, -0.12, 0); S.draw.glow(c, hp.x, hp.y, sc*1.3, "#ff6a2a", 0.35*hot); }
      band(-0.3, -0.06, RC+0.22, "#6b7686", false);
      var top0 = ring(-0.06, RC+0.22); path(top0, true); ctx.fillStyle = hot > 0.02 ? "rgba(255,"+Math.round(140-90*hot)+",60,"+(0.25+0.6*hot).toFixed(2)+")" : cold > 0 ? "rgba(220,240,255,"+(0.3+0.6*cold).toFixed(2)+")" : "#8d97a6"; ctx.fill();
      /* verre : arrière */
      var gTop = HMAX+0.25, bot = ring(0, RC), topR = ring(gTop, RC);
      ctx.save(); ctx.strokeStyle = "rgba(78,92,112,.35)"; ctx.lineWidth = 1.5; path(topR.filter(function(q){ return q.z < 0; })); ctx.stroke(); ctx.restore();
      var gl = bot.concat(topR.slice().reverse()), lx = 1e9, rx = -1e9; bot.forEach(function(q){ lx = Math.min(lx, q.x); rx = Math.max(rx, q.x); });
      ctx.save(); ctx.fillStyle = "rgba(215,232,248,.35)"; ctx.fillRect(lx, topR[36].y < topR[12].y ? Math.min(topR[12].y, topR[36].y) : topR[36].y, rx-lx, Math.max(bot[12].y, bot[36].y)-Math.min(topR[12].y, topR[36].y)); ctx.restore();
      /* gaz : léger voile coloré selon la température */
      var gasCol = hot > 0.02 ? "rgba(255,140,80,"+(0.06+0.12*hot).toFixed(2)+")" : cold > 0 ? "rgba(120,180,255,"+(0.06+0.1*cold).toFixed(2)+")" : "rgba(120,170,230,.06)";
      var pt = ring(h, RC-0.01); ctx.save(); ctx.beginPath(); ctx.moveTo(bot[0].x, bot[0].y); ctx.rect(lx, Math.min(pt[12].y, pt[36].y), rx-lx, Math.max(bot[12].y, bot[36].y)-Math.min(pt[12].y, pt[36].y)); ctx.fillStyle = gasCol; ctx.fill(); ctx.restore();
      /* molécules (billes en 3D, triées par profondeur) */
      var cnt = Math.round(n.value*1000), arr = [];
      for (i = 0; i < cnt; i++){ var q = M[i], pp = P3(q.x, Math.min(q.y, h-0.05), q.z); arr.push(pp); }
      arr.sort(function(a, b){ return a.z-b.z; }).forEach(function(pp){ ballG(ctx, pp.x, pp.y, sc*0.045*pp.s, "#2f6fd6"); });
      /* piston : disque avec joints + tige + poignée */
      var pr = band(h, h+0.16, RC-0.01, "#9aa5b3", true);
      var j1 = ring(h+0.05, RC-0.005), j2 = ring(h+0.11, RC-0.005); ctx.save(); ctx.strokeStyle = "#2b2f36"; ctx.lineWidth = 2.2; path(j1.filter(function(q){ return q.z >= 0; })); ctx.stroke(); path(j2.filter(function(q){ return q.z >= 0; })); ctx.stroke(); ctx.restore();
      hits.forEach(function(hh){ var hp2 = P3(hh.x, h, hh.z); ctx.save(); ctx.strokeStyle = "rgba(255,210,80,"+hh.a.toFixed(2)+")"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(hp2.x, hp2.y, 5*(1.6-hh.a), 2.2*(1.6-hh.a), 0, 0, 6.2832); ctx.stroke(); ctx.restore(); });
      var r0 = P3(0, h+0.16, 0), r1 = P3(0, HMAX+0.75, 0); ctx.save(); var rg = ctx.createLinearGradient(r0.x-4, 0, r0.x+4, 0); rg.addColorStop(0, "#6b7686"); rg.addColorStop(0.5, "#e3e8ef"); rg.addColorStop(1, "#59636f"); ctx.strokeStyle = rg; ctx.lineWidth = Math.max(5, sc*0.07); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(r0.x, r0.y); ctx.lineTo(r1.x, r1.y); ctx.stroke(); ctx.restore();
      var h1 = P3(-0.42, HMAX+0.78, 0), h2 = P3(0.42, HMAX+0.78, 0); ctx.save(); ctx.strokeStyle = "#1f2733"; ctx.lineWidth = Math.max(9, sc*0.13); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(h1.x, h1.y); ctx.lineTo(h2.x, h2.y); ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      /* verre : avant (contour, reflets, graduations en litres) */
      ctx.save(); ctx.strokeStyle = "rgba(78,92,112,.85)"; ctx.lineWidth = 2; path(topR.filter(function(q){ return q.z >= 0; })); ctx.stroke(); path(bot.filter(function(q){ return q.z >= 0; })); ctx.stroke();
      var bl = bot.reduce(function(a, q){ return q.x < a.x ? q : a; }), br = bot.reduce(function(a, q){ return q.x > a.x ? q : a; }), tl = topR.reduce(function(a, q){ return q.x < a.x ? q : a; }), tr = topR.reduce(function(a, q){ return q.x > a.x ? q : a; });
      ctx.beginPath(); ctx.moveTo(bl.x, bl.y); ctx.lineTo(tl.x, tl.y); ctx.moveTo(br.x, br.y); ctx.lineTo(tr.x, tr.y); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bl.x+8, bl.y-10); ctx.lineTo(tl.x+8, tl.y+16); ctx.stroke(); ctx.restore();
      for (var L = 0.5; L <= 3; L += 0.5){ var gy = P3(0, hOf(L), 0).y, gxl = tr.x; ctx.save(); ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gxl-1, gy); ctx.lineTo(gxl+7, gy); ctx.stroke(); ctx.restore(); C4.t(c, S.fmt(L, 1)+" L", gxl+10, gy, {size:11, color:"#4b586a", align:"left", weight:700}); }
      /* tuyau vers le manomètre */
      var mx = W-(ph1 ? 58 : 82), my = H*(ph1 ? 0.3 : 0.32), mr = ph1 ? 44 : 60, bp = P3(RC+0.22, -0.18, 0);
      ctx.save(); ctx.strokeStyle = "#59636f"; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(bp.x, bp.y); ctx.lineTo(mx, bp.y); ctx.lineTo(mx, my+mr); ctx.stroke(); ctx.restore();
      /* manomètre à aiguille, calibre automatique */
      var kPa = p/1000, rngs = [200, 500, 1000, 1500], top = rngs.filter(function(r){ return r >= kPa; })[0] || 1500;
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2; ballG(ctx, mx, my, mr+6, "#8d97a6"); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.fillStyle = "#fbfcfd"; ctx.fill(); ctx.strokeStyle = "#3c4656"; ctx.lineWidth = 2; ctx.stroke();
      var a0 = Math.PI*0.75, a1 = Math.PI*2.25, A = function(v2){ return a0+(a1-a0)*Math.min(1.03, v2/top); };
      ctx.strokeStyle = "rgba(192,50,29,.5)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(mx, my, mr-6, A(top*0.8), A(top)); ctx.stroke();
      for (i = 0; i <= 10; i++){ var an2 = A(top*i/10); ctx.strokeStyle = "#3c4656"; ctx.lineWidth = i%5 ? 1 : 2; ctx.beginPath(); ctx.moveTo(mx+Math.cos(an2)*(mr-3), my+Math.sin(an2)*(mr-3)); ctx.lineTo(mx+Math.cos(an2)*(mr-(i%5 ? 8 : 12)), my+Math.sin(an2)*(mr-(i%5 ? 8 : 12))); ctx.stroke();
        if (i%5 === 0 && !(ph1 && i === 5)) S.draw.text(c, String(top*i/10), mx+Math.cos(an2)*(mr-(ph1 ? 17 : 22)), my+Math.sin(an2)*(mr-(ph1 ? 17 : 22)), {size:ph1 ? 9 : 10, color:"#3c4656", weight:700}); }
      var an3 = A(kPa); ctx.strokeStyle = Pl.red; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(mx-Math.cos(an3)*8, my-Math.sin(an3)*8); ctx.lineTo(mx+Math.cos(an3)*(mr-10), my+Math.sin(an3)*(mr-10)); ctx.stroke();
      ballG(ctx, mx, my, 5, "#3c4656"); ctx.restore();
      if (!ph1) C4.t(c, "kPa", mx, my+mr*0.42, {size:10, color:"#5f6b7a", weight:700});
      S.draw.display(c, S.fmt(kPa, 1), mx, my+mr+30, {w:ph1 ? 78 : 96, h:ph1 ? 34 : 40, caption:"PRESSION (kPa)", size:ph1 ? 14 : 16});
      /* thermomètre du bain */
      var tx = ph1 ? 22 : 30; thermo(c, tx, H*0.12, benchY-30, Math.max(0, Math.min(1, (T.value+20)/220)), hot > 0.02 ? Pl.red : cold > 0 ? Pl.blue : "#e0475b", S);
      C4.t(c, S.fmt(T.value, 0)+" °C", tx, H*0.12-12, {size:12, color:Pl.ink}); C4.t(c, Tk+" K", tx+2, benchY-8+18 > H-4 ? H-8 : benchY+14, {size:11.5, color:Pl.acc});
      C4.label(c, "V = "+S.fmt(v, 1)+" L", P3(0, h/2, -RC).x, P3(0, h/2, 0).y, "#13233a", 13);
      C4.t(c, "↻ glisse pour tourner", cx, H-10, {size:11, color:"#5f3d1c", weight:600});
      /* graphe */
      var y1 = Math.max(1, pres(0.3, T.value, n.value)*1.1/1000);
      g.clear(); var gx = S.draw.axes(g, {x0:0, x1:3, y0:0, y1:y1, xl:"V (L)", yl:"p (kPa)", l:48});
      S.draw.fn(g, gx, function(x){ return x < 0.3 ? NaN : pres(x, T.value, n.value)/1000; }, "#1f4b9e", 3);
      S.draw.fn(g, gx, function(x){ return x < 0.3 ? NaN : pres(x, 20, n.value)/1000; }, "#b8c0cc", 1.5, [5, 4]);
      S.draw.dot(g, gx.X(v), gx.Y(p/1000), 7, "#c0321d");
      C4.label(g, "trait gris : isotherme à 20 °C", g.W-12, gx.T+24, "#5f6b7a", 11, "right");
      ro.set(0, Tk+" K"); ro.set(1, S.fmt(p/1000, 1)+" kPa"); ro.set(2, S.fmt(p*v/1000, 1)+" J");
      nt.set(p > 1000000 ? "Au-delà de 1 000 kPa le modèle du gaz parfait devient peu fiable." : "1 atm = 101,3 kPa. Ici p = "+S.fmt(p/101300, 2)+" atm.", p > 1000000 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c04-azote", ch:"c04", tag:"Original",
  titre:"Un ballon dans l'azote liquide",
  resume:"On plonge un ballon dans l'azote liquide : il se ratatine. À pression constante, le volume d'un gaz est proportionnel à sa température absolue (Charles).",
  but:"Plonge le ballon dans le vase Dewar d'azote liquide (bouton), ou règle la température au curseur, ou glisse le point rouge sur la courbe. Compare la formule correcte (en kelvins) avec l'erreur classique (en °C).",
  aRetenir:"À p et n constants : V / T = constante, avec T en kelvins. La droite V(θ) coupe l'axe V = 0 en θ = −273 °C : le zéro absolu.",
  piege:"Utiliser des °C dans V₂ = V₁·T₂/T₁ donne n'importe quoi : à 0 °C on trouverait un volume nul, à −50 °C un volume négatif. (L'azote liquide, à −196 °C, brûle la peau par le froid : manipulation réservée au laboratoire, avec gants et lunettes.)",
  build:function(k, S){
    var c = ratioCanvas(k, 0.86, 1.15), g = k.canvas(250), V0 = 2.0, P = S.draw.palette;
    var th = k.slider("Température θ", -190, 100, 5, 20, "°C");
    var md = k.seg("Formule utilisée", [["K","Kelvins (correct)"],["C","°C (erreur)"]], "K");
    var st = {ax:null, anim:null, tt:0};
    var bt = k.button("▶ Plonger dans l'azote", function(){ var into = th.value > -100; st.anim = {to:into ? -190 : 20}; bt.textContent = into ? "▶ Ressortir le ballon" : "▶ Plonger dans l'azote"; }, true);
    var ro = k.readouts(["T", "Volume V", "V / V₀"]);
    var nt = k.note("", "");
    var rd = C4.rnd(8), Q = [];
    for (var i = 0; i < 26; i++){ var u = rd()*6.2832, w = Math.acos(2*rd()-1), rr0 = Math.cbrt(rd())*0.8; Q.push({p:[Math.sin(w)*Math.cos(u)*rr0, Math.cos(w)*rr0, Math.sin(w)*Math.sin(u)*rr0], v:[rd()-0.5, rd()-0.5, rd()-0.5], ax:[rd()-0.5, rd()-0.5, rd()-0.5], o2:i%5 === 0, sp:rd()*6}); }
    var lp = k.loop(function(dt, t){
      st.tt = t;
      if (st.anim){ if (st.anim.v == null) st.anim.v = th.value; var d = st.anim.to-st.anim.v, stp = (st.anim.to < 0 ? 55 : 40)*dt; if (Math.abs(d) <= stp){ th.set(st.anim.to); st.anim = null; } else { st.anim.v += Math.sign(d)*stp; th.set(Math.round(st.anim.v)); } }
      var sp = 0.7*Math.sqrt(Math.max(0.2, (th.value+273)/293));
      Q.forEach(function(q){ for (var j = 0; j < 3; j++){ q.v[j] += (Math.random()-0.5)*dt*3; } var L = Math.hypot(q.v[0], q.v[1], q.v[2]) || 1; for (j = 0; j < 3; j++){ q.v[j] = q.v[j]/L; q.p[j] += q.v[j]*sp*dt; } var r = Math.hypot(q.p[0], q.p[1], q.p[2]); if (r > 0.82){ for (j = 0; j < 3; j++){ q.p[j] *= 0.82/r; q.v[j] = -q.v[j]; } } q.sp += dt*sp*4; });
      k.redraw();
    });
    lp.play();
    g.pointer(function(type, p){ if ((type === "down" || type === "drag") && st.ax){ st.anim = null; th.set(Math.max(-190, Math.min(100, Math.round(st.ax.ix(p.x)/5)*5))); k.redraw(); } });
    function balloonPath(ctx, x, y, r){ ctx.beginPath(); ctx.moveTo(x, y-r*1.12); ctx.bezierCurveTo(x+r*0.55, y-r*1.12, x+r*1.02, y-r*0.6, x+r*1.0, y+r*0.05); ctx.bezierCurveTo(x+r*0.98, y+r*0.75, x+r*0.5, y+r*1.05, x, y+r*1.05); ctx.bezierCurveTo(x-r*0.5, y+r*1.05, x-r*0.98, y+r*0.75, x-r*1.0, y+r*0.05); ctx.bezierCurveTo(x-r*1.02, y-r*0.6, x-r*0.55, y-r*1.12, x, y-r*1.12); ctx.closePath(); }
    k.draw(function(){
      var tc = th.value, Tk = tc+273, V = V0*Tk/293, Vw = V0*tc/20, use = md.value === "K" ? V : Vw, W = c.W, H = c.H, ctx = c.ctx, ph1 = W < 460, t = st.tt, j;
      c.clear(); var benchY = H*0.9; wallBench(c, benchY);
      var cold = Math.max(0, Math.min(1, (20-tc)/210)), hot = Math.max(0, Math.min(1, (tc-20)/80));
      /* vase Dewar (vue en coupe) */
      var dw = Math.min(W*0.42, 230), dh = H*0.4, dx = W*(ph1 ? 0.42 : 0.4)-dw/2, dy = benchY-dh, wall = 11, lvl = dy+dh*0.3, cxB = dx+dw/2;
      ctx.save(); ctx.fillStyle = "rgba(15,27,45,.18)"; ctx.beginPath(); ctx.ellipse(cxB, benchY+2, dw*0.55, 6, 0, 0, 6.2832); ctx.fill(); ctx.restore();
      var gi = ctx.createLinearGradient(dx, 0, dx+dw, 0); gi.addColorStop(0, "#5d6a7b"); gi.addColorStop(0.5, "#c9d2dd"); gi.addColorStop(1, "#4f5b6b"); ctx.fillStyle = gi; S.draw.rrect(c, dx+wall, dy, dw-2*wall, dh-wall, 6); ctx.fill();
      /* balle de vapeur froide au-dessus du liquide */
      var r0 = Math.min(W, H)*0.13, f = Math.cbrt(Math.max(V, 0.001)/V0), r = r0*Math.min(1.8, f), depth = cold;
      var yHigh = dy-r0*1.25-18, ySub = lvl+r*0.55, by = yHigh+(ySub-yHigh)*Math.pow(depth, 1.3), bx = cxB;
      /* ballon (réel : volume en kelvins) */
      var clip = function(){ balloonPath(ctx, bx, by, r); };
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
      var gb = ctx.createRadialGradient(bx-r*0.35, by-r*0.45, r*0.1, bx, by, r*1.2); gb.addColorStop(0, "#ff9aa6"); gb.addColorStop(0.45, "#e0475b"); gb.addColorStop(1, "#8e1f2e"); ctx.fillStyle = gb; clip(); ctx.fill(); ctx.restore();
      ctx.save(); clip(); ctx.clip();
      /* molécules d'air : N₂ (bleu) et O₂ (rouge) en 3D */
      var vw = {a:t*0.3, b:0.3}, arr = Q.map(function(q){ var a = q.ax, L = Math.hypot(a[0], a[1], a[2]) || 1, d = 0.07, ca = Math.cos(q.sp), sa = Math.sin(q.sp), e = [ca*a[0]/L, sa, -ca*a[2]/L], p1 = proj3G([q.p[0]+e[0]*d, q.p[1]+e[1]*d, q.p[2]+e[2]*d], vw, r*0.95, bx, by), p2 = proj3G([q.p[0]-e[0]*d, q.p[1]-e[1]*d, q.p[2]-e[2]*d], vw, r*0.95, bx, by); return {p1:p1, p2:p2, z:(p1.z+p2.z)/2, o2:q.o2}; });
      arr.sort(function(a, b){ return a.z-b.z; }).forEach(function(m){ var col = m.o2 ? "#e8594a" : "#4f7be0", rr2 = Math.max(1.6, r*0.055); ballG(ctx, m.p1.x, m.p1.y, rr2*m.p1.s, col, 0.9); ballG(ctx, m.p2.x, m.p2.y, rr2*m.p2.s, col, 0.9); });
      /* rides quand il se ratatine, givre quand il est froid */
      var shrink = Math.max(0, 1-V/V0);
      if (shrink > 0.25){ ctx.strokeStyle = "rgba(90,15,25,"+Math.min(0.6, shrink).toFixed(2)+")"; ctx.lineWidth = 1.3; for (j = 0; j < 7; j++){ var ang = -1.2+j*0.42; ctx.beginPath(); ctx.moveTo(bx+Math.sin(ang)*r*0.25, by-r*0.95); ctx.quadraticCurveTo(bx+Math.sin(ang)*r*1.1+Math.sin(j*3)*r*0.15, by, bx+Math.sin(ang)*r*0.7, by+r*0.85); ctx.stroke(); } }
      if (cold > 0.3){ ctx.fillStyle = "rgba(235,245,255,"+(0.45*(cold-0.3)).toFixed(2)+")"; clip(); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(bx-r*0.15, by-r*0.15, r*0.62, 3.6, 4.3); ctx.stroke(); ctx.restore();
      /* nœud, ficelle et potence */
      ctx.save(); ctx.fillStyle = "#b8303f"; ctx.beginPath(); ctx.moveTo(bx-5, by-r*1.12-7); ctx.lineTo(bx+5, by-r*1.12-7); ctx.lineTo(bx, by-r*1.12+1); ctx.closePath(); ctx.fill(); ctx.restore();
      var sx = Math.min(W-30, dx+dw+44), armY = Math.min(yHigh-r0*1.2-24, H*0.06+10);
      ctx.save(); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx, benchY-4); ctx.lineTo(sx, armY); ctx.lineTo(bx-14, armY); ctx.stroke(); ctx.fillStyle = "#3c4656"; S.draw.rrect(c, sx-26, benchY-10, 52, 10, 3); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = "#4b586a"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(bx, armY); ctx.lineTo(bx, by-r*1.12-7); ctx.stroke(); ballG(ctx, bx, armY, 5, "#7b8798"); ctx.restore();
      /* azote liquide (translucide, devant le ballon), bulles d'ébullition */
      ctx.save(); S.draw.rrect(c, dx+wall, dy, dw-2*wall, dh-wall, 6); ctx.clip();
      var gl = ctx.createLinearGradient(0, lvl, 0, dy+dh); gl.addColorStop(0, "rgba(200,230,255,.55)"); gl.addColorStop(1, "rgba(150,200,245,.7)"); ctx.fillStyle = gl; ctx.fillRect(dx, lvl, dw, dh);
      var boil = 0.25+0.75*Math.max(0, (depth-0.5)*2);
      for (j = 0; j < 22; j++){ var ph = (t*(0.6+0.4*boil)+j*0.137)%1, bxx = dx+wall+6+((j*37)%97)/97*(dw-2*wall-12), byy = dy+dh-wall-ph*(dy+dh-wall-lvl); if (j > 8+14*boil) continue; ctx.strokeStyle = "rgba(255,255,255,"+(0.5*(1-ph*0.6)).toFixed(2)+")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bxx, byy, 1.5+boil*2, 0, 6.2832); ctx.stroke(); }
      ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(dx, lvl, dw, 1.5);
      ctx.restore();
      /* parois doubles du Dewar (coupe : vide entre deux parois argentées) */
      [[dx, 0], [dx+dw-wall, 1]].forEach(function(s){ var gw = ctx.createLinearGradient(s[0], 0, s[0]+wall, 0); gw.addColorStop(0, "#e8edf3"); gw.addColorStop(0.5, "#9aa6b5"); gw.addColorStop(1, "#dfe5ec"); ctx.fillStyle = gw; ctx.fillRect(s[0], dy, wall, dh); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(s[0]+wall*0.42, dy+4, wall*0.16, dh-8); });
      ctx.fillStyle = "#c3ccd7"; S.draw.rrect(c, dx, dy+dh-wall, dw, wall, 4); ctx.fill(); ctx.fillStyle = "#e8edf3"; S.draw.rrect(c, dx-3, dy-4, dw+6, 7, 3); ctx.fill();
      /* brume qui déborde */
      for (j = 0; j < 16; j++){ var q = (t*0.22+j/16)%1, side = j%2 ? 1 : -1, fx = side > 0 ? dx+dw+q*30*(1+(j%3)*0.3) : dx-q*30*(1+(j%3)*0.3), fy = dy+q*q*dh*0.7+(j%4)*4, fr = 8+q*18; ctx.fillStyle = "rgba(236,244,252,"+(0.38*(1-q)).toFixed(3)+")"; ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 6.2832); ctx.fill(); }
      for (j = 0; j < 6; j++){ var q2 = (t*0.3+j/6)%1; ctx.fillStyle = "rgba(240,246,252,"+(0.3*(1-q2)).toFixed(3)+")"; ctx.beginPath(); ctx.arc(dx+dw*(0.2+0.12*j)+Math.sin(t+j)*6, dy-q2*30, 10+q2*14, 0, 6.2832); ctx.fill(); }
      C4.t(c, "vase Dewar (coupe) · N₂ liquide −196 °C", cxB, benchY+14 > H-6 ? H-6 : Math.min(H-6, benchY+14), {size:ph1 ? 10.5 : 11.5, color:"#4a3418"});
      /* sèche-cheveux quand on chauffe */
      if (hot > 0.02){ for (j = 0; j < 4; j++){ var hy = by-r*0.6+j*r*0.4, ph2 = (t*1.5+j*0.25)%1; ctx.save(); ctx.strokeStyle = "rgba(255,120,40,"+(0.25+0.5*hot*(1-ph2)).toFixed(2)+")"; ctx.lineWidth = 2; ctx.beginPath(); for (var s2 = 0; s2 <= 20; s2++){ var xx = bx-r*1.2-80+s2*4+ph2*20, yy = hy+Math.sin(s2*0.8+t*8)*3; s2 ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
        C4.t(c, "air chaud", Math.max(36, bx-r*1.2-50), by-r*0.95, {size:11, color:P.amber}); }
      /* erreur en °C : volume « calculé » en pointillés */
      if (md.value === "C"){
        if (Vw > 0.001){ var rw = r0*Math.min(2.2, Math.cbrt(Vw/V0)); ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = P.red; ctx.lineWidth = 2.2; balloonPath(ctx, bx, by, rw); ctx.stroke(); ctx.restore(); S.draw.label(c, "calcul en °C : "+S.fmt(Vw, 2)+" L (faux)", bx, by-Math.max(r, rw)*1.12-22, {color:P.red, size:11.5}); }
        else S.draw.label(c, "calcul en °C : volume nul ou négatif, absurde", bx, by-r*1.12-22, {color:P.red, size:11.5});
      }
      S.draw.label(c, S.fmt(V, 2)+" L", bx+r+8, by, {size:13, color:"#8e1f2e", align:"left"});
      /* thermomètre */
      var tx = ph1 ? W-22 : W-34, ty0 = H*0.1, ty1 = benchY-36, ff = (tc+200)/300;
      thermo(c, tx, ty0, ty1, ff, cold > hot ? P.blue : P.red, S);
      C4.t(c, S.fmt(tc, 0)+" °C", tx-2, ty0-12, {size:12.5, color:P.ink}); C4.t(c, S.fmt(Tk, 0)+" K", tx-2, ty1+30, {size:12.5, color:P.acc});
      if (tc < -183 && md.value === "K") S.draw.label(c, "O₂ liquide sous −183 °C : modèle limite", W/2, 16, {size:11, color:P.amber});
      /* graphique */
      g.clear();
      var ax = S.draw.axes(g, {x0:-300, x1:120, y0:0, y1:3, xl:"θ (°C)", yl:"V (L)", stepX:50, l:40}); st.ax = ax;
      S.draw.area(g, ax, function(x){ return V0*(x+273)/293; }, -273, 120, P.acc, .07);
      S.draw.fn(g, ax, function(x){ return V0*(x+273)/293; }, P.acc, 3);
      if (md.value === "C") S.draw.fn(g, ax, function(x){ return V0*x/20; }, P.red, 2, [6, 4]);
      S.draw.dot(g, ax.X(-273), ax.Y(0), 5, P.green); S.draw.label(g, "zéro absolu −273 °C", ax.X(-273)+8, ax.Y(0)-16, {color:P.green, align:"left", size:12});
      S.draw.dot(g, ax.X(-196), ax.Y(V0*77/293), 4, P.blue); C4.t(g, "N₂ liquide", ax.X(-196)+6, ax.Y(V0*77/293)-12, {size:11, color:P.blue, align:"left"});
      S.draw.dot(g, ax.X(tc), ax.Y(Math.max(0, Math.min(3, use))), 8, md.value === "K" ? P.acc : P.red);
      C4.t(g, "↔ glisse le point", ax.X(55), ax.Y(0.45), {size:11.5, color:P.grey, weight:600});
      ro.set(0, Tk+" K"); ro.set(1, use > 0 ? S.fmt(use, 2)+" L" : "impossible"); ro.set(2, S.fmt(use/V0, 2));
      if (md.value === "C") nt.set("Avec les °C, la formule ne vaut rien : seul le résultat en kelvins correspond à l'expérience (V = "+S.fmt(V, 2)+" L).", "warn");
      else nt.set(tc < -183 ? "Sous −183 °C le dioxygène de l'air se liquéfie : le modèle du gaz parfait ne s'applique plus (le vrai ballon rétrécit encore davantage)." : "Ballon de "+V0+" L à 20 °C, pression constante : V = V₀·T/293.", tc < -183 ? "warn" : "");
    });
  }
});
})();


SFA.sim({
  id:"c4-c04-hydrogene", ch:"c04", tag:"Expérience",
  titre:"Mesurer le volume d'hydrogène dégagé",
  resume:"Du magnésium dans de l'acide chlorhydrique libère du dihydrogène : prédis le volume avant de le mesurer.",
  but:"Choisis la masse de magnésium, le volume d'acide (1,0 mol/L) et la température. Lance la réaction et lis le volume sur l'éprouvette.",
  aRetenir:"Mg + 2 HCl → MgCl₂ + H₂. n(H₂) = n(Mg) si l'acide est en excès, puis V = n · V_m. Si l'acide manque, c'est lui qui limite : n(H₂) = n(HCl)/2.",
  piege:"Plus de magnésium ne donne pas plus de gaz si l'acide est épuisé : le volume plafonne.",
  build:function(k, S){
    var c = k.canvas(320);
    var m = k.slider("Masse de Mg", 0.05, 0.40, 0.01, 0.20, "g");
    var Va = k.slider("Acide HCl (1,0 mol/L)", 5, 50, 1, 30, "mL");
    var T = k.slider("Température", 10, 30, 1, 20, "°C");
    var ro = k.readouts(["n(Mg)", "n(HCl)", "n(H₂)", "V(H₂)"]);
    var nt = k.note("", "");
    var st = {p:1}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 3); if (st.p >= 1) lp.pause(); k.redraw(); });
    [m, Va, T].forEach(function(s){ s.el.addEventListener("input", function(){ st.p = 1; }); });
    k.button("▶ Lancer la réaction", function(){ st.p = 0; lp.play(); }, true);
    k.draw(function(){
      var nMg = m.value / 24, nH = Va.value / 1000 * 1.0, xi = Math.min(nMg, nH / 2), Vm = 24 * (T.value + 273) / 293;
      var Vfin = xi * Vm * 1000, Vnow = Vfin * st.p;
      c.clear(); C4.bg(c); var W = c.W, ctx = c.ctx, tx = W * 0.62, tw = 60, top = 20, hh = 270, scale = hh / 500;
      /* éprouvette renversée dans la cuve */
      ctx.fillStyle = "rgba(60,150,200,.25)"; ctx.fillRect(10, 200, W - 20, 100);
      ctx.fillStyle = "rgba(60,150,200,.35)"; ctx.fillRect(tx - tw / 2 + 2, top + 4 + Vnow * scale, tw - 4, hh - Vnow * scale - 4);
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx - tw / 2, top + hh); ctx.lineTo(tx - tw / 2, top); ctx.lineTo(tx + tw / 2, top); ctx.lineTo(tx + tw / 2, top + hh); ctx.stroke();
      for (var v = 0; v <= 500; v += 100){ var yy = top + 4 + v * scale; S.draw.line(c, tx + tw / 2, yy, tx + tw / 2 + 8, yy, "#5f6b7a", 1.5); C4.label(c, v + " mL", tx + tw / 2 + 12, yy, "#5f6b7a", 11, "left"); }
      S.draw.line(c, tx - tw / 2 - 8, top + 4 + Vnow * scale, tx + tw / 2, top + 4 + Vnow * scale, "#c0321d", 2);
      C4.label(c, "gaz H₂ recueilli", tx - tw / 2 - 12, top + 4 + Vnow * scale / 2, "#2c3a4e", 12, "right");
      /* erlenmeyer */
      var fx = W * 0.17; ctx.fillStyle = "rgba(244,197,66,.25)"; ctx.beginPath(); ctx.moveTo(fx - 12, 215); ctx.lineTo(fx + 12, 215); ctx.lineTo(fx + 34, 290); ctx.lineTo(fx - 34, 290); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#5f6b7a"; ctx.stroke();
      ctx.fillStyle = "#6c7d90"; var ml = 8 + m.value * 60; ctx.fillRect(fx - ml / 2, 272, ml, 6);
      if (st.p < 1) for (var b = 0; b < 6; b++) S.draw.dot(c, fx - 18 + b * 7, 265 - ((st.p * 200 + b * 17) % 50), 2.5, "rgba(255,255,255,.9)");
      S.draw.line(c, fx + 8, 215, fx + 8, 190, "#5f6b7a", 2); S.draw.line(c, fx + 8, 190, tx - 8, 190, "#5f6b7a", 2); S.draw.line(c, tx - 8, 190, tx - 8, top + hh + 16, "#5f6b7a", 2);
      C4.label(c, "Mg + HCl", fx, 305, "#2c3a4e", 12);
      ro.set(0, S.fmt(nMg * 1000, 2) + " mmol"); ro.set(1, S.fmt(nH * 1000, 1) + " mmol"); ro.set(2, S.fmt(xi * 1000, 2) + " mmol"); ro.set(3, S.fmt(Vfin, 0) + " mL");
      nt.set(nMg <= nH / 2 ? "Le magnésium est limitant : tout le Mg disparaît, l'acide est en excès." : "L'acide est limitant : il reste du magnésium. Le volume de H₂ ne dépend plus de la masse de Mg.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c04-airbag", ch:"c04", tag:"Défi",
  titre:"Airbag : combien d'azoture de sodium ?",
  resume:"2 NaN₃ → 2 Na + 3 N₂ : choisis la masse d'azoture pour que le sac gonfle exactement au volume visé, ni trop, ni trop peu.",
  but:"Règle la masse de NaN₃ et la température du gaz, puis déclenche l'airbag. Le sac doit remplir l'espace entre le volant et le mannequin (cible ± 3 L). Relève des défis à cible aléatoire.",
  aRetenir:"n(N₂) = 1,5 × n(NaN₃) ; puis V = n(N₂) · V_m. Le coefficient 3/2 vient de l'équation 2 NaN₃ → 2 Na + 3 N₂.",
  piege:"Le rapport 3/2 s'applique aux quantités de matière, pas aux masses : 1 g de NaN₃ ne donne pas 1,5 g de N₂. Modèle simplifié : un airbag réel contient d'autres réactifs pour neutraliser le sodium formé.",
  build:function(k, S){
    var c = k.canvas(350), P = S.draw.palette;
    var m = k.slider("Masse de NaN₃", 20, 150, 1, 70, "g");
    var T = k.slider("Température du gaz", 20, 100, 5, 20, "°C");
    var ro = k.readouts(["n(NaN₃)", "n(N₂)", "V(N₂)", "Masse de Na formé"]);
    var nt = k.note("", "");
    var st = {goal:60, defi:false, score:0, tries:0, scored:false}, an = C4.anim(k, 1.1);
    var rd = C4.rnd(3), J = []; for (var i = 0; i < 70; i++) J.push({x:rd(), y:rd(), a:rd() * 6.28});
    var jig = k.loop(function(dt){ J.forEach(function(q){ q.a += (Math.random() - .5) * 2.4; q.x += Math.cos(q.a) * dt * .35; q.y += Math.sin(q.a) * dt * .35; q.x = Math.max(.05, Math.min(.95, q.x)); q.y = Math.max(.05, Math.min(.95, q.y)); }); k.redraw(); });
    jig.play();
    [m.el, T.el].forEach(function(e){ e.addEventListener("input", function(){ an.stop(); st.scored = false; }); });
    k.button("▶ Déclencher l'airbag", function(){ an.go(); st.scored = false; }, true);
    k.button("🎯 Nouveau défi (cible aléatoire)", function(){ st.goal = 40 + 5 * Math.floor(Math.random() * 9); st.defi = true; st.tries++; an.stop(); st.scored = false; });
    k.button("Cible libre : 60 L", function(){ st.goal = 60; st.defi = false; });
    k.draw(function(){
      var nA = m.value / 65, nN = 1.5 * nA, Vm = 24 * (T.value + 273) / 293, V = nN * Vm, W = c.W, ctx = c.ctx, p = C4.ease(an.p);
      var Vn = V * (an.p < 1 ? Math.min(1.08, p * 1.08 - Math.sin(an.p * 3.14) * .02) : 1);
      C4.bg(c, 318);
      var hx = 34, hy = 196, rt = Math.min(92, (W - 120) / 2.15), sc = rt / Math.cbrt(3 * st.goal / (4 * Math.PI)), r = Math.cbrt(3 * Vn / (4 * Math.PI)) * sc;
      var headX = hx + 2 * rt + 22, d = V - st.goal, ok = Math.abs(d) <= 3;
      /* tableau de bord et volant */
      ctx.fillStyle = "#d6dde6"; ctx.fillRect(0, 232, 22, 90); S.draw.line(c, 8, 232, 8, 318, "#aab4c1", 3);
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#44546a"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(18, hy - 52); ctx.lineTo(24, hy - 52 + 4); ctx.lineTo(24, hy + 52); ctx.lineTo(18, hy + 56); ctx.stroke(); ctx.restore();
      /* mannequin */
      ctx.fillStyle = "#c7cfda"; S.draw.rrect(c, headX - 26, hy + 34, 52, 90, 12); ctx.fill();
      ctx.fillStyle = "#e6c9a8"; ctx.beginPath(); ctx.arc(headX, hy - 6, 24, 0, 7); ctx.fill(); ctx.strokeStyle = "#a88c6a"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#44546a"; ctx.beginPath(); ctx.arc(headX - 8, hy - 11, 2.6, 0, 7); ctx.fill();
      ctx.fillRect(headX - 10, hy + 28, 20, 14);
      /* cible */
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = P.green; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx + rt, hy, rt, 0, 7); ctx.stroke(); ctx.restore();
      S.draw.label(c, "cible : " + st.goal + " L", hx + rt, hy - rt - 14, {color:P.green, size:12.5});
      /* sac */
      if (r > 2){
        var col = Vn > st.goal + 3.5 ? P.red : (Math.abs(Vn - st.goal) <= 3 ? P.green : P.acc);
        ctx.save(); ctx.beginPath(); ctx.arc(hx + r, hy, r, 0, 7); var g = ctx.createRadialGradient(hx + r * .75, hy - r * .3, r * .1, hx + r, hy, r); g.addColorStop(0, S.draw.tint(col, .22)); g.addColorStop(1, S.draw.tint(col, .42)); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
        ctx.clip(); var nd = Math.round(Math.min(1, nN / 3.5) * 60);
        for (var i = 0; i < nd; i++) S.draw.dot(c, hx + (J[i].x * 2 * r), hy - r + J[i].y * 2 * r, 2.8, "rgba(31,75,158,.8)");
        ctx.restore();
        S.draw.text(c, S.fmt(Vn, 0) + " L", hx + r, hy + 3, {size:Math.min(22, Math.max(14, r * .4)), color:col});
      }
      S.draw.display(c, S.fmt(V, 1) + " L", W - 66, 46, {w:112, h:50, caption:"V(N₂) FORMÉ"});
      /* thermomètre simple */
      C4.t(c, "gaz à " + T.value + " °C", W - 66, 88, {size:12, color:P.grey, weight:700});
      if (an.p >= 1 && !st.scored && st.defi && ok){ st.scored = true; st.score++; }
      ro.set(0, S.fmt(nA, 2) + " mol"); ro.set(1, S.fmt(nN, 2) + " mol"); ro.set(2, S.fmt(V, 1) + " L"); ro.set(3, S.fmt(nA * 23, 1) + " g");
      nt.set(ok ? "✅ Objectif atteint : " + S.fmt(V, 1) + " L pour une cible de " + st.goal + " L." + (st.defi ? " Défis réussis : " + st.score + "." : "") : d < 0 ? "Sac insuffisamment gonflé : il manque " + S.fmt(-d, 1) + " L, la tête du mannequin touchera le volant. Augmente la masse." : "Trop de gaz : " + S.fmt(d, 1) + " L en trop, le sac claque contre le mannequin. Réduis la masse.", ok ? "ok" : "warn");
    });
  }
});
