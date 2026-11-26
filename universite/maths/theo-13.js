/* Mathématiques BA1 · chapitre 13 : suites et séries · théorie animée et devantures (préfixe m13_, tout reste dans la fonction) */
(function(){
var PI = Math.PI;
function ax(x0, x1, y0, y1, o){ o = o || {}; var L = o.l === undefined ? 34 : o.l, R = o.r === undefined ? 14 : o.r, T = o.t === undefined ? 14 : o.t, B = o.b === undefined ? 26 : o.b;
  var a = {x0: x0, x1: x1, y0: y0, y1: y1, L: L, R: W - R, T: T, B: H - B};
  a.X = function(x){ return L + (x - x0) / (x1 - x0) * (W - L - R); }; a.Y = function(y){ return H - B - (y - y0) / (y1 - y0) * (H - T - B); };
  var sx = o.sx || 1, sy = o.sy || 1; ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = "#eceef1"; ctx.font = (W < 420 ? 10 : 11) + "px system-ui"; ctx.fillStyle = GREY;
  for (var gx = Math.ceil(x0 / sx) * sx; gx <= x1 + 1e-9; gx += sx){ ctx.beginPath(); ctx.moveTo(a.X(gx), T); ctx.lineTo(a.X(gx), H - B); ctx.stroke(); if (!o.nolab && Math.abs(gx) > 1e-9){ ctx.textAlign = "center"; ctx.fillText(fm(gx), a.X(gx), H - B + 14); } }
  for (var gy = Math.ceil(y0 / sy) * sy; gy <= y1 + 1e-9; gy += sy){ ctx.beginPath(); ctx.moveTo(L, a.Y(gy)); ctx.lineTo(W - R, a.Y(gy)); ctx.stroke(); if (!o.nolab && !o.noy){ ctx.textAlign = "right"; ctx.fillText(fm(gy), L - 4, a.Y(gy) + 4); } }
  ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.4; var yy = (y0 <= 0 && y1 >= 0) ? a.Y(0) : H - B;
  ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(W - R, yy); ctx.moveTo(L, T); ctx.lineTo(L, H - B); ctx.stroke();
  if (o.xn !== false){ ctx.fillStyle = GREY; ctx.font = "italic " + (W < 420 ? 11 : 12) + "px system-ui"; ctx.textAlign = "right"; ctx.fillText(o.xn || "n", W - R, yy - 5); }
  ctx.restore(); return a; }
function fm(v){ return (Math.round(v * 100) / 100).toString().replace(".", ",").replace("-", "−"); }
function fx(v, d){ return v.toFixed(d).replace(".", ",").replace("-", "−"); }
function es(x){ x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
function ease(p, a, b){ return Math.max(0, Math.min(1, (p - a) / (b - a))); }
function fs(s){ return W < 420 ? Math.max(11, s - 2) : s; }
function sb(n){ return String(n).replace(/[0-9]/g, function(d){ return "₀₁₂₃₄₅₆₇₈₉"[+d]; }); }
function inA(a, y){ return y >= a.y0 - 1e-9 && y <= a.y1 + 1e-9; }
/* bille en volume : dégradé radial et petite ombre */
function gd(x, y, r, c){ ctx.save(); ctx.shadowColor = "rgba(15,27,45,.22)"; ctx.shadowBlur = r * .9; ctx.shadowOffsetY = r * .35;
  var g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .12, x, y, r); g.addColorStop(0, "#ffffff"); g.addColorStop(.38, c); g.addColorStop(1, c);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); }
function sd(a, n, y, c, r){ if (!inA(a, y)) return; gd(a.X(n), a.Y(y), r || 4.5, c); }
function band(a, L, e, col, alpha){ var y1 = a.Y(Math.min(a.y1, L + e)), y2 = a.Y(Math.max(a.y0, L - e));
  ctx.save(); var g = ctx.createLinearGradient(0, y1, 0, y2); g.addColorStop(0, "rgba(29,158,117," + (alpha || .10) + ")"); g.addColorStop(.5, "rgba(29,158,117," + ((alpha || .10) * 2.1) + ")"); g.addColorStop(1, "rgba(29,158,117," + (alpha || .10) + ")");
  ctx.fillStyle = g; ctx.fillRect(a.L, y1, a.R - a.L, y2 - y1); ctx.restore();
  LN(a.L, a.Y(L + e), a.R, a.Y(L + e), col || GREEN, 1.4, [5, 4]); LN(a.L, a.Y(L - e), a.R, a.Y(L - e), col || GREEN, 1.4, [5, 4]); LN(a.L, a.Y(L), a.R, a.Y(L), DGREEN, 1.6); }
function flag(a, N, col, lab){ var x = a.X(N); LN(x, a.T + 4, x, a.B, col || RED, 1.6, [4, 3]);
  ctx.save(); ctx.fillStyle = col || RED; ctx.beginPath(); ctx.moveTo(x, a.T + 4); ctx.lineTo(x + 16, a.T + 10); ctx.lineTo(x, a.T + 16); ctx.closePath(); ctx.fill(); ctx.restore();
  if (lab) tag(lab, x + (x > W * .78 ? -30 : 30), a.T + 28, col || RED, fs(13)); }
function hl(a, y, col, d, w){ LN(a.L, a.Y(y), a.R, a.Y(y), col || GREY, w || 1.4, d || [5, 4]); }
function vl(a, x, col, d){ LN(a.X(x), a.T, a.X(x), a.B, col || GREY, 1.4, d || [5, 4]); }
function fn(a, f, col, w, dash, lo, hi){ ctx.save(); ctx.beginPath(); ctx.rect(a.L, a.T, a.R - a.L, a.B - a.T); ctx.clip(); ctx.strokeStyle = col || BLUE; ctx.lineWidth = w || 2.6; if (dash) ctx.setLineDash(dash); ctx.beginPath();
  var n = 300, a0 = lo === undefined ? a.x0 : lo, a1 = hi === undefined ? a.x1 : hi; for (var i = 0; i <= n; i++){ var x = a0 + (a1 - a0) * i / n, Y = a.Y(f(x)); i ? ctx.lineTo(a.X(x), Y) : ctx.moveTo(a.X(x), Y); } ctx.stroke(); ctx.restore(); }
/* barre (brique) en volume, pour les termes d'une série */
function brick(x, y, w, h, c1, c2){ if (w < .5) return; ctx.save(); ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 3; ctx.shadowOffsetY = 1.5; var g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); ctx.restore(); ctx.strokeStyle = "rgba(15,27,45,.28)"; ctx.lineWidth = .7; ctx.strokeRect(x, y, w, h); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(x + 1, y + 1, Math.max(0, w - 2), h * .22); }
function bars(a, f, n0, n1, c1, c2, wf){ var w = (a.X(1) - a.X(0)) * (wf || .62); for (var n = n0; n <= n1; n++){ var v = f(n), y0 = a.Y(Math.max(a.y0, 0)), y = a.Y(Math.min(a.y1, v)); brick(a.X(n) - w / 2, Math.min(y, y0), w, Math.abs(y0 - y), c1, c2); } }
function H_(n){ var s = 0; for (var i = 1; i <= n; i++) s += 1 / i; return s; }
function bg(){ var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#fbfcfe"); g.addColorStop(1, "#f1f4f9"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }

SFA.theo("c13", {
  icon: function(){
    bg(); var a = ax(0, 22, -1.2, 3.4, {nolab: true, l: 18, r: W * .44, t: 18, b: 22, xn: false}); band(a, 1, .35, GREEN, .09);
    for (var n = 1; n <= 21; n++){ var u = 1 + 2.2 * Math.pow(-1, n) / n; sd(a, n, u, Math.abs(u - 1) <= .35 ? GREEN : ORA2, 4.6); }
    TB("uₙ → ℓ", W * .78, H * .36, BLUE_D, 30); TB("Σ aₙ = lim sₙ", W * .78, H * .58, ORANGE, 19); TB("ε, N · étau · séries", W * .78, H * .78, GREY, 14);
  },
  sub: [
    {t: "Suites et convergence (ε, N)",
     anim: function(t){
       bg(); var per = 720, u = (t % per) / per, k = es(u / .7), eps = Math.round((.9 - .8 * k) * 100) / 100, N = Math.ceil(3 / eps - 1e-9), nmax = 40;
       var a = ax(0, nmax + 1, -1.3, 3.9, {l: 30, b: 24, t: W < 420 ? 52 : 40, r: 12, sx: 5, sy: 1});
       band(a, 2, eps, GREEN, .09); flag(a, N, RED, "N = " + N);
       for (var n = 1; n <= nmax; n++){ var v = 2 + 3 * Math.pow(-1, n) / n, inB = Math.abs(v - 2) <= eps + 1e-12; sd(a, n, v, n >= N ? GREEN : (inB ? "#8fb8a8" : ORA2), W < 420 ? 3.6 : 4.6); }
       TB("uₙ = 2 + 3(−1)ⁿ/n", 10, 18, BLUE_D, fs(15), "left"); TB("ε = " + fx(eps, 2) + "   ⇒   N = ⌈3/ε⌉ = " + N, W - 10, 18, INK, fs(14), "right");
       TB("|uₙ − 2| = 3/n ≤ ε dès que n ≥ 3/ε", W < 420 ? 10 : W * .5, W < 420 ? 38 : 34, GREY, fs(12), W < 420 ? "left" : "center");
       },
     th: '<div class="tcard"><b class="h">Une suite est une fonction de ℕ</b><p>Une suite (uₙ) associe à chaque rang n (entier, à partir de 0 ou de 1 : précise-le toujours) un réel uₙ. Son graphe est un <b>nuage de points isolés</b> : on ne relie jamais les points. On la définit par une <b>formule explicite</b> (uₙ = 1/n), par une <b>récurrence</b> (u₁ donné et uₙ₊₁ = f(uₙ)) ou par une description (un capital année après année).</p><p><b>Arithmétique</b> (on ajoute r) : uₙ = u₁ + (n − 1)r ; u₁ + … + uₙ = n(u₁ + uₙ)/2 ; en particulier 1 + 2 + … + n = n(n + 1)/2. <b>Géométrique</b> (on multiplie par q) : uₙ = u₁·qⁿ⁻¹ ; u₁ + … + uₙ = u₁(1 − qⁿ)/(1 − q) si q ≠ 1. Comportement de qⁿ : → 0 si |q| &lt; 1 ; vaut 1 si q = 1 ; → +∞ si q &gt; 1 ; pas de limite si q ≤ −1.</p></div>' +
       '<div class="tcard"><b class="h">Converger : la définition (ε, N)</b><p>uₙ → u signifie : <b>∀ε &gt; 0, ∃N, ∀n ≥ N : |uₙ − u| ≤ ε</b>. Lis-la dans l\'ordre : la tolérance ε est <b>imposée</b> (aussi petite qu\'on veut) ; tu <b>choisis</b> ensuite le rang N, qui a le droit de dépendre de ε ; à partir de N, <b>aucun</b> terme ne sort de la bande [u − ε ; u + ε]. Les premiers termes ne comptent pas. Remplacer ≤ par &lt;, ou ε par 2ε, donne un énoncé équivalent.</p><p><b>Exemple chiffré</b> (le schéma) : uₙ = 2 + 3(−1)ⁿ/n. |uₙ − 2| = 3/n ≤ ε ⇔ n ≥ 3/ε. On prend N = ⌈3/ε⌉ : ε = 0,3 donne N = 10 ; ε = 0,1 donne N = 30. Plus la bande est fine, plus N recule. Fais-le toi-même dans la simulation <a href="ma-suite-bande-epsilon/">la bande ε et le rang N</a>.</p></div>' +
       '<div class="tcard"><b class="h">Rédiger une preuve de convergence</b><p>1. Devine la limite candidate u (brouillon). 2. Écris l\'écart |uₙ − u| et simplifie. 3. <b>Majore-le</b> par une expression simple qui tend vers 0 : remplace ce qui oscille par sa borne (|sin n| ≤ 1, |(−1)ⁿ| = 1) et minore les dénominateurs (n + 3 ≥ n donne 1/(n + 3) ≤ 1/n). 4. Résous « majorant ≤ ε » en n : cela fournit N. 5. Conclus : « Soit ε &gt; 0. Posons N = … Pour tout n ≥ N, |uₙ − u| ≤ … ≤ ε. Donc uₙ → u. »</p><p>Exemple : uₙ = (2n + 1)/n. |uₙ − 2| = 1/n ≤ ε dès que n ≥ 1/ε : N = ⌈1/ε⌉ convient. La majoration n\'a pas besoin d\'être optimale : il suffit qu\'elle soit vraie pour tous les n ≥ N.</p></div>' +
       '<div class="tcard"><b class="h">Unicité, bornitude, divergence</b><p><b>La limite est unique</b> : si uₙ → u et uₙ → v avec u ≠ v, prends ε = |u − v|/3 ; au-delà du plus grand des deux rangs, uₙ serait dans deux bandes disjointes. <b>Toute suite convergente est bornée</b> (ε = 1 contrôle la queue, il reste un nombre fini de termes). La réciproque est fausse : (−1)ⁿ est bornée et diverge. La contraposée est un outil : <b>non bornée ⇒ divergente</b>.</p><p><b>Prouver une divergence</b> : nie la définition, ∃ε &gt; 0, ∀N, ∃n ≥ N : |uₙ − u| &gt; ε, et cela pour <b>chaque</b> réel u candidat. <b>Diverger vers +∞</b> : ∀M, ∃N, ∀n ≥ N : uₙ ≥ M (le seuil M est donné d\'abord). Ex. : √n ≥ 4 dès n = 16. Ne pas converger, c\'est donc soit tendre vers ±∞, soit n\'avoir aucune limite, comme (−1)ⁿ ou (−1)ⁿn.</p></div>'},
    {t: "Bornées, monotones, étau, sous-suites",
     anim: function(t){
       bg(); var per = 420, ph = Math.floor(t / per) % 3, u = (t % per) / per, nmax = 30, nv = Math.max(1, Math.round(nmax * es(u / .75))), r = W < 420 ? 3.4 : 4.4, a, n;
       var sm = W < 420, top = sm ? 64 : 40;
       function head(ti, fo, foc, su, sus){ TB(ti, 10, 18, BLUE_D, fs(15), "left"); if (sm){ TB(fo, 10, 37, foc, 12, "left"); TB(sus || su, 10, 54, GREY, 11, "left"); } else { TB(fo, W - 10, 18, foc, 13, "right"); TB(su, W * .5, 34, GREY, 12); } }
       if (ph === 0){
         a = ax(0, nmax + 1, 0, 2, {l: 30, b: 24, t: top, r: 12, sx: 5, sy: .5});
         ctx.save(); ctx.fillStyle = "rgba(55,138,221,.10)"; ctx.beginPath(); for (n = 1; n <= nv; n++) ctx.lineTo(a.X(n), a.Y(Math.min(2, 1 + 1 / n))); for (n = nv; n >= 1; n--) ctx.lineTo(a.X(n), a.Y(Math.max(0, 1 - 1 / n))); ctx.closePath(); ctx.fill(); ctx.restore();
         hl(a, 1, DGREEN, [6, 4], 1.6);
         for (n = 1; n <= nv; n++){ sd(a, n, 1 + 1 / n, BLUE, r * .85); sd(a, n, 1 - 1 / n, BLUE, r * .85); sd(a, n, 1 + Math.cos(1.7 * n) / n, ORA2, r); }
         head("Étau : 1 − 1/n ≤ uₙ ≤ 1 + 1/n", "uₙ = 1 + cos(1,7n)/n → 1", ORA2, "les deux gendarmes tendent vers 1 : le suspect aussi", "les gendarmes → 1 : le suspect aussi");
       } else if (ph === 1){
         a = ax(0, nmax + 1, 1.8, 3.2, {l: 34, b: 24, t: top, r: 12, sx: 5, sy: .2});
         hl(a, 3, RED, [6, 4], 1.6); hl(a, Math.E, DGREEN, [3, 3], 1.6);
         for (n = 1; n <= nv; n++) sd(a, n, Math.pow(1 + 1 / n, n), VIOLET, r);
         TB("majorant 3", a.R - 4, a.Y(3) - 6, DRED, fs(13), "right"); TB("sup = e ≈ 2,718", a.R - 4, a.Y(Math.E) + 15, DGREEN, fs(13), "right");
         head("Croissante et majorée ⇒ convergente", "uₙ = (1 + 1/n)ⁿ", VIOLET, "u" + sb(nv) + " = " + fx(Math.pow(1 + 1 / nv, nv), 4) + " : la limite est le plus petit majorant", "u" + sb(nv) + " = " + fx(Math.pow(1 + 1 / nv, nv), 4) + " : limite = plus petit majorant");
       } else {
         a = ax(0, nmax + 1, -2.2, 2.2, {l: 30, b: 24, t: top, r: 12, sx: 5, sy: 1});
         band(a, 1, .15, GREEN, .07); ctx.save(); ctx.fillStyle = "rgba(226,75,74,.08)"; ctx.fillRect(a.L, a.Y(-.85), a.R - a.L, a.Y(-1.15) - a.Y(-.85)); ctx.restore(); hl(a, -1, DRED, [6, 4], 1.6);
         for (n = 1; n <= nv; n++) sd(a, n, Math.pow(-1, n) * (1 + 1 / n), n % 2 ? RED : GREEN, r);
         TB("rangs pairs → 1", a.R - 4, a.Y(.55), DGREEN, fs(13), "right"); TB("rangs impairs → −1", a.R - 4, a.Y(-.45), DRED, fs(13), "right");
         head(sm ? "Deux sous-suites, deux limites" : "Deux sous-suites, deux limites ⇒ divergence", "uₙ = (−1)ⁿ(1 + 1/n) diverge", INK, "bornée : Bolzano-Weierstrass garantit une sous-suite convergente (ici deux)", "bornée ⇒ une sous-suite converge (B-W)");
       } },
     th: '<div class="tcard"><b class="h">Bornée, monotone</b><p>(uₙ) est <b>majorée</b> s\'il existe M avec uₙ ≤ M pour tout n, <b>minorée</b> s\'il existe m avec uₙ ≥ m, <b>bornée</b> si les deux : ∃M, ∀n, |uₙ| ≤ M. Une borne n\'est pas forcément un terme : 1/n est minorée par 0 sans jamais valoir 0. (uₙ) est <b>croissante</b> si uₙ₊₁ ≥ uₙ pour tout n : étudie le signe de uₙ₊₁ − uₙ, ou compare uₙ₊₁/uₙ à 1 si les termes sont positifs. Converger n\'oblige pas à être monotone : 1 + (−1)ⁿ/n converge en zigzaguant.</p></div>' +
       '<div class="tcard"><b class="h">Théorème de convergence monotone</b><p><b>Croissante et majorée ⇒ convergente</b>, et la limite est le supremum des termes. Idée : s = sup{uₙ} existe (borne supérieure de ℝ) ; pour ε &gt; 0, un terme u<sub>N</sub> dépasse s − ε ; par croissance, s − ε &lt; u<sub>N</sub> ≤ uₙ ≤ s pour tout n ≥ N. De même, décroissante et minorée ⇒ converge vers l\'infimum ; croissante et <b>non</b> majorée ⇒ tend vers +∞.</p><p>C\'est un théorème d\'existence : il ne donne pas la valeur. Exemple : (1 + 1/n)ⁿ croît et reste sous 3 ; sa limite est e ≈ 2,718. Pour une récurrence uₙ₊₁ = f(uₙ) : monotonie et borne par récurrence, puis la limite ℓ vérifie ℓ = f(ℓ) si f est continue. <b>Piège</b> : croissante seule ne suffit pas (la suite n).</p></div>' +
       '<div class="tcard"><b class="h">Calculer une limite, passer les inégalités</b><p>Si uₙ → u et vₙ → v (finies) : uₙ + vₙ → u + v, uₙvₙ → uv, uₙ/vₙ → u/v si v ≠ 0. Les quatre <b>formes indéterminées</b> ∞ − ∞, 0·∞, ∞/∞ et 0/0 demandent une transformation : mets le terme dominant en évidence (quotient de polynômes de même degré → rapport des coefficients dominants ; degré du bas plus grand → 0), ou multiplie par le conjugué (√(n² + 6n) − n = 6n/(√(n² + 6n) + n) → 3). Croissances comparées : ln n ≪ nᵃ ≪ qⁿ (a &gt; 0, q &gt; 1).</p><p><b>Inégalités</b> : uₙ ≤ vₙ dès un certain rang ⇒ lim uₙ ≤ lim vₙ. Une inégalité <b>stricte devient large</b> : 1/n &lt; 2/n pour tout n, et les deux limites valent 0.</p></div>' +
       '<div class="tcard"><b class="h">Théorème de l\'étau (des gendarmes)</b><p>Si vₙ ≤ uₙ ≤ wₙ à partir d\'un rang N₀, et si vₙ → ℓ et wₙ → ℓ (<b>même limite</b>), alors uₙ converge et uₙ → ℓ. Preuve : pour ε &gt; 0, vₙ est dans la bande ℓ ± ε dès N₁, wₙ dès N₂ ; pour n ≥ max(N₀ ; N₁ ; N₂), ℓ − ε ≤ vₙ ≤ uₙ ≤ wₙ ≤ ℓ + ε.</p><p>Usage type : encadrer ce qui oscille. (3n + cos n)/n est entre (3n − 1)/n et (3n + 1)/n, qui tendent vers 3 : limite 3. Corollaire : (bornée) × (tend vers 0) → 0, par ex. sin(n)/n → 0. À voir dans la simulation <a href="ma-etau-gendarmes/">le théorème de l\'étau</a>.</p></div>' +
       '<div class="tcard"><b class="h">Sous-suites et Bolzano-Weierstrass</b><p>Une <b>sous-suite</b> (u<sub>nₖ</sub>) garde une infinité de rangs n₁ &lt; n₂ &lt; … (donc nₖ ≥ k). Toute sous-suite d\'une suite convergente converge vers la même limite. D\'où le test de divergence le plus rapide : <b>deux sous-suites de limites différentes ⇒ la suite diverge</b> (ex. (−1)ⁿ(1 + 1/n) : pairs → 1, impairs → −1). À l\'inverse, si les rangs pairs et impairs tendent vers la même limite, la suite y converge.</p><p>Une <b>valeur d\'adhérence</b> est la limite d\'une sous-suite. <b>Bolzano-Weierstrass</b> : toute suite bornée possède une sous-suite convergente (on coupe le segment en deux en gardant une moitié qui contient des termes d\'une infinité de rangs). Une suite bornée converge si et seulement si elle a une seule valeur d\'adhérence.</p></div>'},
    {t: "Séries : sommes partielles et critères",
     anim: function(t){
       bg(); var per = 600, u = (t % per) / per, nmax = 40, nv = Math.max(1, Math.round(nmax * es(u / .8))), small = W < 420;
       var sTop = small ? 40 : 34, sH = small ? 16 : 20, x0 = 14, x1 = W - 14, sc = (x1 - x0) / 1.08;
       TB("Σ (1/2)ⁱ : chaque brique couvre la moitié du reste", x0, 18, BLUE_D, fs(14), "left");
       var x = x0, ng = Math.min(nv, 12); for (var i = 1; i <= ng; i++){ var w = sc * Math.pow(.5, i); brick(x, sTop, w, sH, i % 2 ? "#9cc6f0" : "#6aa7e4", i % 2 ? "#3d7fc4" : "#245f9e"); x += w; }
       LN(x0 + sc, sTop - 6, x0 + sc, sTop + sH + 6, RED, 2.4); TB("plafond S = 1", x0 + sc - 2, sTop + sH + 15, DRED, fs(12), "right");
       var gT = sTop + sH + (small ? 30 : 30), a = ax(0, nmax + 1, 0, 4.6, {l: 30, b: 24, t: gT, r: 12, sx: 5, sy: 1});
       hl(a, 1, BLUE_D, [6, 4], 1.4);
       var s = 0, hs = 0; for (var n = 1; n <= nv; n++){ s += Math.pow(.5, n); hs += 1 / n; sd(a, n, hs, ORANGE, small ? 3.2 : 4); sd(a, n, s, BLUE, small ? 3.2 : 4); }
       for (var k = 1; k <= 5; k++){ var m = Math.pow(2, k); if (m <= nv){ LN(a.X(m), a.Y(1 + k / 2), a.X(Math.min(nmax + 1, 2 * m)), a.Y(1 + k / 2), DRED, 1.2, [3, 3]); DOT(a.X(m), a.Y(1 + k / 2), 2.5, DRED); } }
       TB("géométrique : sₙ = 1 − 1/2ⁿ → 1", a.X(nmax + 1) - 2, a.Y(1) + 22, BLUE_D, fs(13), "right");
       TB("harmonique : H" + sb(nv) + " = " + fx(H_(nv), 3) + (small ? "" : " (s₂ᵏ ≥ 1 + k/2)"), a.X(nmax + 1) - 2, a.Y(4.45), ORANGE, fs(13), "right");
       TB("n = " + nv, a.L + 6, a.Y(4.45), INK, fs(13), "left"); },
     th: '<div class="tcard"><b class="h">Une série est une suite de sommes partielles</b><p>Pour des termes a₁, a₂, …, la <b>somme partielle</b> est sₙ = a₁ + a₂ + … + aₙ. La série Σ aᵢ <b>converge</b> si la suite (sₙ) a une limite finie S, et l\'on écrit Σ aᵢ = S ; sinon elle <b>diverge</b> (même si sₙ → +∞). Ne confonds jamais la suite des termes (aₙ) et celle des sommes (sₙ) : elles ont des comportements sans rapport. On retrouve un terme par aₙ = sₙ − sₙ₋₁. Simulation : <a href="ma-series-sommes-partielles/">une série, c\'est une suite de sommes partielles</a>.</p></div>' +
       '<div class="tcard"><b class="h">Condition nécessaire et série harmonique</b><p><b>Si Σ aᵢ converge, alors aₙ → 0</b> (car aₙ = sₙ − sₙ₋₁ → S − S). Lue à l\'envers, c\'est un <b>test de divergence</b> : si aₙ ne tend pas vers 0, la série diverge, sans autre calcul. Mais la réciproque est <b>fausse</b> : la <b>série harmonique</b> Σ 1/i diverge alors que 1/i → 0. Preuve par paquets : 1/3 + 1/4 ≥ 2·(1/4) = 1/2, 1/5 + … + 1/8 ≥ 4·(1/8) = 1/2, etc., donc s<sub>2ᵏ</sub> ≥ 1 + k/2 → +∞. Elle diverge très lentement : H₄₀ ≈ 4,28, il faut 83 termes pour dépasser 5, et H₁₀₀₀ ≈ 7,49.</p></div>' +
       '<div class="tcard"><b class="h">Série géométrique</b><p>sₙ = 1 + q + … + qⁿ⁻¹ ; en soustrayant q·sₙ, tout le bloc central disparaît : (1 − q)sₙ = 1 − qⁿ, donc sₙ = (1 − qⁿ)/(1 − q) si q ≠ 1. Si <b>|q| &lt; 1</b>, qⁿ → 0 et <b>Σ<sub>i≥0</sub> qⁱ = 1/(1 − q)</b> ; si |q| ≥ 1, la série diverge (son terme ne tend pas vers 0). Retiens : <b>somme = premier terme / (1 − raison)</b>, ce qui donne Σ<sub>i≥1</sub> qⁱ = q/(1 − q).</p><p>Applications : une rente perpétuelle de C par an au taux r vaut Σ C/(1 + r)ⁱ = C/r (100 € à 5 % → 2 000 €) ; le multiplicateur de dépense vaut 1/(1 − c) (c = 0,75 → 4) ; des doses répétées d\'un médicament s\'accumulent vers un plateau fini.</p></div>' +
       '<div class="tcard"><b class="h">Séries à termes positifs : les critères</b><p>Si aᵢ ≥ 0, (sₙ) est croissante : la série converge <b>si et seulement si</b> (sₙ) est majorée ; sinon sₙ → +∞. <b>Comparaison</b> : si 0 ≤ aᵢ ≤ bᵢ, alors Σ bᵢ converge ⇒ Σ aᵢ converge, et Σ aᵢ diverge ⇒ Σ bᵢ diverge. <b>Télescopage</b> : si aᵢ = bᵢ − bᵢ₊₁, alors sₙ = b₁ − bₙ₊₁ : Σ 1/(i(i + 1)) = Σ (1/i − 1/(i + 1)) = 1 ; Σ ln((i + 1)/i) a pour somme partielle ln(n + 1) → +∞ (elle diverge).</p><p><b>Références</b> : Σ 1/i² converge (1/i² ≤ 1/((i − 1)i) pour i ≥ 2 ; sa somme vaut π²/6 ≈ 1,645) ; plus généralement Σ 1/iᵖ converge si et seulement si p &gt; 1 (se démontre avec les intégrales). <b>Pour aller plus loin</b>, le critère du quotient : si aᵢ &gt; 0 et aᵢ₊₁/aᵢ → λ, la série converge si λ &lt; 1, diverge si λ &gt; 1, et on ne peut rien dire si λ = 1. Ces critères exigent des termes positifs.</p></div>' +
       '<div class="tcard"><b class="h">Méthode : la nature d\'une série</b><p>Pose les questions dans cet ordre. 1. aₙ → 0 ? Si non, la série diverge : fini. 2. Géométrique ? La raison décide et la somme s\'écrit. 3. Termes positifs ? Cherche un majorant des sₙ. 4. Le terme est une différence bᵢ − bᵢ₊₁ ? Télescope. 5. Sinon, compare à une série connue (géométrique, 1/i, 1/i²).</p><p><b>Pièges</b> : « aₙ → 0 donc la série converge » (faux : harmonique) ; 1/(1 − q) quand la somme commence à i = 1 (c\'est q/(1 − q)) ; la formule géométrique avec |q| ≥ 1 ; la comparaison avec des termes de signe quelconque.</p></div>'}
  ]
});

/* devantures des 18 exercices, dans l'ordre de exos-13.js */
SFA.figs("c13", [
  /* 1. lire la définition */
  function(p){ bg(); var a = ax(0, 26, -.4, 2.6, {l: 28, b: 24, t: 40, r: 12, sx: 5, sy: .5}), e = .3, N = 4; /* 1,2/n ≤ 0,3 ⇔ n ≥ 4 */
    band(a, 1, e, GREEN, .09); for (var n = 1; n <= 25; n++){ var v = 1 + 1.2 * Math.pow(-1, n + 1) / n; sd(a, n, v, (p > 0 && n >= N) ? GREEN : BLUE, 4.6); }
    TB("∀ε  ∃N  ∀n ≥ N :  |uₙ − u| ≤ ε", W * .5, 24, BLUE_D, fs(16)); TB("u ± ε", a.R - 4, a.Y(1 + e) - 6, DGREEN, 13, "right");
    if (p > 0) flag(a, N, RED, "N dépend de ε"); },
  /* 2. diverger vers +∞ */
  function(p){ bg(); var a = ax(0, 31, -10, 55, {l: 32, b: 24, t: 34, r: 12, sx: 5, sy: 10});
    hl(a, 40, RED, [6, 4], 1.8); TB("seuil M", a.L + 6, a.Y(40) - 7, DRED, 14, "left");
    for (var n = 1; n <= 30; n++){ var v = 2 * n - 7; sd(a, n, v, (p > 0 && v >= 40) ? GREEN : ORA2, 4.2); }
    TB("uₙ = 2n − 7", W * .5, 22, BLUE_D, fs(16));
    if (p > 0){ flag(a, 24, DGREEN); tag("n ≥ (M + 7)/2", a.X(16), a.Y(50), DGREEN, 13); tag("M = 1000 → N = 504", a.X(22), a.Y(-3), DGREEN, 13); } },
  /* 3. rang N pour ε = 0,02 */
  function(p){ bg(); var a = ax(0, 220, 4.96, 5.2, {l: 38, b: 24, t: 34, r: 12, sx: 50, sy: .05});
    band(a, 5, .02, GREEN, .12); for (var n = 4; n <= 220; n += 2){ var v = 5 + 3 / n; sd(a, n, v, (p > 0 && n >= 150) ? GREEN : BLUE, 2.8); }
    TB("uₙ = (5n + 3)/n", W * .5, 22, BLUE_D, fs(16)); TB("5 ± 0,02", a.R - 4, a.Y(5.02) - 6, DGREEN, 13, "right");
    if (p > 0) flag(a, 150, RED, "N = 150"); },
  /* 4. bornée et convergente */
  function(p){ bg(); var a = ax(0, 21, -1.8, 1.8, {l: 30, b: 24, t: 36, r: 12, sx: 5, sy: 1});
    ctx.save(); ctx.fillStyle = "rgba(127,119,221,.09)"; ctx.fillRect(a.L, a.Y(1.2), a.R - a.L, a.Y(-1.2) - a.Y(1.2)); ctx.restore(); hl(a, 1.2, VIOLET, [5, 4]); hl(a, -1.2, VIOLET, [5, 4]);
    for (var n = 1; n <= 20; n++) sd(a, n, Math.pow(-1, n), n % 2 ? RED : BLUE, 4.6);
    TB("(−1)ⁿ : bornée par M = 1", W * .5, 22, VIOLET, fs(16));
    if (p > 0) tag("bornée ⇏ convergente", a.X(10.5), a.Y(0), DRED, 14); },
  /* 5. quotient de polynômes */
  function(p){ bg(); var a = ax(0, 41, 0, 2.5, {l: 30, b: 24, t: 34, r: 12, sx: 5, sy: .5});
    for (var n = 1; n <= 40; n++) sd(a, n, (4 * n * n - 3 * n + 1) / (2 * n * n + 5), BLUE, 4);
    TB("uₙ = (4n² − 3n + 1)/(2n² + 5)", W * .5, 22, BLUE_D, fs(15));
    if (p > 0){ hl(a, 2, RED, [6, 4], 2); TB("→ 4/2 = 2", a.R - 4, a.Y(2) - 8, DRED, 15, "right"); } },
  /* 6. majorer avec |sin n| ≤ 1 */
  function(p){ bg(); var a = ax(0, 31, 1.7, 2.3, {l: 34, b: 24, t: 34, r: 12, sx: 5, sy: .1});
    fn(a, function(x){ return 2 + 1 / (2 * x); }, ORANGE, 1.8, [5, 4], .8, 31); fn(a, function(x){ return 2 - 1 / (2 * x); }, ORANGE, 1.8, [5, 4], .8, 31); hl(a, 2, DGREEN, [2, 0], 1.4);
    for (var n = 1; n <= 30; n++) sd(a, n, (4 * n + Math.sin(n)) / (2 * n), BLUE, 4.2);
    TB("uₙ = (4n + sin n)/(2n)", W * .5, 22, BLUE_D, fs(16)); TB("2 ± 1/(2n)", a.R - 4, a.Y(2.06) - 4, ORANGE, 13, "right");
    if (p > 0) tag("1/(2n) ≤ 0,001 ⇔ n ≥ 500", a.X(16), a.Y(1.8), DRED, 14); },
  /* 7. conjugué */
  function(p){ bg(); var a = ax(0, 61, 2, 3.2, {l: 34, b: 24, t: 34, r: 12, sx: 10, sy: .2});
    for (var n = 1; n <= 60; n++) sd(a, n, Math.sqrt(4 * n * n + 12 * n) - 2 * n, BLUE, 3.6);
    TB("√(4n² + 12n) − 2n", W * .5, 22, BLUE_D, fs(16)); TB("forme ∞ − ∞", a.L + 8, a.Y(2.15), GREY, 13, "left");
    if (p > 0){ hl(a, 3, RED, [6, 4], 2); TB("→ 12/4 = 3", a.R - 4, a.Y(3) - 8, DRED, 15, "right"); } },
  /* 8. inégalité stricte */
  function(p){ bg(); var a = ax(0, 21, 0, 2.2, {l: 30, b: 24, t: 34, r: 12, sx: 5, sy: .5});
    for (var n = 1; n <= 20; n++){ sd(a, n, 2 / n, ORANGE, 4.2); sd(a, n, 1 / n, BLUE, 4.2); }
    TB("uₙ = 1/n", W * .5 - 22, 22, BLUE_D, fs(16), "right"); TB("<", W * .5, 22, INK, fs(16)); TB("vₙ = 2/n", W * .5 + 22, 22, ORANGE, fs(16), "left");
    if (p > 0){ hl(a, 0, RED, [6, 4], 2.4); tag("mêmes limites : 0 = 0", a.X(13), a.Y(.75), DRED, 14); } },
  /* 9. étau avec cos(n²) */
  function(p){ bg(); var a = ax(0, 81, 1.4, 2.6, {l: 34, b: 24, t: 34, r: 12, sx: 10, sy: .2});
    if (p > 0) band(a, 2, .1, GREEN, .10);
    fn(a, function(x){ return (2 * x + 3) / (x + 1); }, ORANGE, 1.8, [5, 4], 1, 81); fn(a, function(x){ return (2 * x - 3) / (x + 1); }, ORANGE, 1.8, [5, 4], 1, 81);
    for (var n = 1; n <= 80; n++) sd(a, n, (2 * n + 3 * Math.cos(n * n)) / (n + 1), BLUE, 3.2);
    TB("uₙ = (2n + 3 cos(n²))/(n + 1)", W * .5, 22, BLUE_D, fs(15));
    if (p > 0) flag(a, 49, RED, "N = 49"); },
  /* 10. récurrence u(n+1) = √(u(n) + 6) : toile d'araignée */
  function(p){ bg(); var a = ax(0, 4, 0, 4, {l: 30, b: 24, t: 30, r: 14, sx: 1, sy: 1, xn: "x"});
    fn(a, function(x){ return x; }, GREY, 1.6, [6, 4]); fn(a, function(x){ return Math.sqrt(x + 6); }, BLUE_D, 3);
    var k = 1 + Math.floor(p * 6), x = 1; ctx.strokeStyle = ORA2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.X(x), a.Y(0));
    for (var i = 0; i < k; i++){ var y = Math.sqrt(x + 6); ctx.lineTo(a.X(x), a.Y(y)); ctx.lineTo(a.X(y), a.Y(y)); x = y; } ctx.stroke();
    gd(a.X(1), a.Y(0), 5, ORA2); TB("u₁ = 1", a.X(1) - 9, a.Y(0) - 8, ORA2, 13, "right");
    TB("y = √(x + 6)", a.X(.15), a.Y(3.35), BLUE_D, 14, "left"); TB("y = x", a.X(3.6), a.Y(3.25), GREY, 13);
    if (p > 0){ gd(a.X(3), a.Y(3), 6.5, GREEN); TB("ℓ = 3", a.X(3) + 10, a.Y(3) + 20, DGREEN, 15, "left"); } },
  /* 11. valeurs d'adhérence de 2 + cos(2nπ/3) */
  function(p){ bg(); var a = ax(0, 19, 0, 3.6, {l: 30, b: 24, t: 34, r: 12, sx: 3, sy: 1});
    for (var n = 1; n <= 18; n++){ var v = 2 + Math.cos(2 * n * PI / 3), c = p > 0 ? (n % 3 === 0 ? GREEN : RED) : BLUE; sd(a, n, v, c, 4.8); }
    TB("wₙ = 2 + cos(2nπ/3)", W * .5, 22, BLUE_D, fs(16));
    if (p > 0){ hl(a, 3, DGREEN, [6, 4]); hl(a, 1.5, DRED, [6, 4]); TB("n = 3k → 3", a.R - 4, a.Y(3) - 9, DGREEN, 14, "right"); TB("autres rangs → 1,5", a.R - 4, a.Y(1.5) + 20, DRED, 14, "right"); } },
  /* 12. balle qui rebondit : scène */
  function(p){ var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#eaf3fc"); g.addColorStop(1, "#fdfaf3"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var fy = H - 36, x0 = Math.max(W * .1, 52), sc = (fy - 44) / 2.05, xs = x0, h = 2, k;
    ctx.fillStyle = "#d9c7a5"; ctx.fillRect(0, fy, W, H - fy); floor(0, W, fy);
    LN(x0 - 18, fy, x0 - 18, fy - 2 * sc, GREY, 1.4); LN(x0 - 24, fy - 2 * sc, x0 - 12, fy - 2 * sc, GREY, 1.4); TB("2 m", x0 - 22, fy - sc, INK, 13, "right");
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(xs, fy - 2 * sc); ctx.lineTo(xs, fy); var step = (W * .86 - x0) / 9;
    for (k = 1; k <= 9; k++){ h = 2 * Math.pow(.75, k); var x1 = xs + step; for (var i = 0; i <= 20; i++){ var s = i / 20; ctx.lineTo(xs + s * step, fy - 4 * h * s * (1 - s) * sc); } xs = x1; } ctx.stroke(); ctx.setLineDash([]);
    TB("1,5 m", x0 + step * .5 + 8, fy - 1.5 * sc - 4, BLUE_D, 13, "left");
    gd(x0, fy - 2 * sc - 9, 9, ORA2);
    TB("chaque rebond : 3/4 de la hauteur", W * .58, 24, INK, fs(15));
    if (p > 0) tag("distance totale = 14 m", W * .6, fy - sc * 1.05, DRED, 15); },
  /* 13. terme général qui tend vers 0 */
  function(p){ bg(); var a = ax(0, 21, 0, p > 0 ? 3.6 : 1.1, {l: 32, b: 24, t: 34, r: 12, sx: 5, sy: p > 0 ? 1 : .25, xn: "i"});
    if (!(p > 0)){ bars(a, function(i){ return 1 / i; }, 1, 20, "#f6c88a", "#c98420", .4); ctx.save(); ctx.translate(a.X(.28), 0); bars(a, function(i){ return 1 / (i * i); }, 1, 20, "#9cc6f0", "#2a6fb5", .4); ctx.restore();
      TB("termes 1/i (orange) et 1/i² (bleu) → 0", W * .5, 22, INK, fs(15)); }
    else { var s1 = 0, s2 = 0; for (var i = 1; i <= 20; i++){ s1 += 1 / i; s2 += 1 / (i * i); sd(a, i, s1, ORANGE, 4); sd(a, i, s2, BLUE, 4); }
      hl(a, PI * PI / 6, BLUE_D, [5, 4]); TB("Σ 1/i² converge", a.R - 4, a.Y(1.0), BLUE_D, 14, "right"); TB("Σ 1/i diverge", a.R - 4, a.Y(2.7), ORANGE, 14, "right"); TB("sommes partielles", W * .5, 22, INK, fs(15)); } },
  /* 14. test de divergence */
  function(p){ bg(); var a = ax(0, 21, 0, 1.6, {l: 32, b: 24, t: 34, r: 12, sx: 5, sy: .4, xn: "i"});
    bars(a, function(i){ return (2 * i + 1) / (5 * i - 3); }, 1, 20, "#c7c2f2", "#6b62c9", .6); hl(a, .4, RED, [6, 4], 2);
    TB("aᵢ = (2i + 1)/(5i − 3)", W * .5, 22, VIOLET, fs(16)); TB("2/5", a.R - 4, a.Y(.4) - 7, DRED, 14, "right");
    if (p > 0) tag("aᵢ → 2/5 ≠ 0 : la série diverge", a.X(11), a.Y(1.1), DRED, 14); },
  /* 15. 1/√i contre 1/i */
  function(p){ bg(); var a = ax(0, 16, 0, 1.1, {l: 32, b: 24, t: 34, r: 12, sx: 5, sy: .25, xn: "i"});
    bars(a, function(i){ return 1 / Math.sqrt(i); }, 1, 15, "#9fe0c8", "#1d8a66", .62); bars(a, function(i){ return 1 / i; }, 1, 15, "#f6c88a", "#c98420", .34);
    TB("1/√i (vert)  ≥  1/i (orange)", W * .5, 22, INK, fs(16));
    if (p > 0) tag("Σ 1/i diverge ⇒ Σ 1/√i diverge", a.X(9), a.Y(.8), DRED, 14); },
  /* 16. doses répétées : dents de scie */
  function(p){ bg(); var a = ax(0, 48, 0, 230, {l: 36, b: 24, t: 34, r: 12, sx: 6, sy: 50, xn: "t (h)"}), q = 0;
    ctx.save(); ctx.beginPath(); ctx.rect(a.L, a.T, a.R - a.L, a.B - a.T); ctx.clip(); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(a.X(0), a.Y(0));
    for (var d = 0; d < 8; d++){ q += 100; ctx.lineTo(a.X(6 * d), a.Y(q)); for (var i = 1; i <= 30; i++){ var tt = 6 * i / 30; ctx.lineTo(a.X(6 * d + tt), a.Y(q * Math.pow(.5, tt / 6))); } q *= .5; } ctx.stroke(); ctx.restore();
    TB("100 mg toutes les 6 h, demi-vie 6 h", W * .5, 22, INK, fs(15));
    if (p > 0){ hl(a, 200, RED, [6, 4], 2); TB("plateau 200 mg", a.R - 4, a.Y(200) - 7, DRED, 14, "right"); LN(a.X(24), a.Y(193.75), a.X(24), a.Y(45), DGREEN, 1.4, [3, 3]); gd(a.X(24), a.Y(193.75), 6, GREEN); tag("5e dose : 193,75 mg", a.X(24), a.Y(35), DGREEN, 13); } },
  /* 17. télescopage */
  function(p){ bg(); var sz = W < 420 ? 13 : 15, y0 = 50, dy = (H - 90) / 5, cols = [DGREEN, DGREEN, DGREEN, RED, RED, RED];
    TB("Σ 1/(i(i + 3)) = (1/3) Σ (1/i − 1/(i + 3))", W * .5, 24, BLUE_D, fs(15));
    var rows = [[1, 4], [2, 5], [3, 6], [4, 7], [5, 8]];
    rows.forEach(function(r, j){ var y = y0 + j * dy + 8, xa = W * .3, xb = W * .62;
      TB("i = " + r[0] + " :", W * .1, y, GREY, sz, "left"); TB("1/" + r[0], xa, y, (p > 0 && r[0] <= 3) ? DGREEN : INK, sz + 1); TB("−", (xa + xb) / 2, y, INK, sz + 1); TB("1/" + r[1], xb, y, INK, sz + 1);
      if (p > 0){ LN(xb - 18, y - 5, xb + 18, y - 5, RED, 2); if (r[0] >= 4) LN(xa - 18, y - 5, xa + 18, y - 5, RED, 2); } });
    if (p > 0) tag("restent 1 + 1/2 + 1/3 : S = (1/3)(11/6) = 11/18", W * .5, H - 18, DGREEN, 14); },
  /* 18. Σ 1/i² ≤ 2 */
  function(p){ bg(); var a = ax(0, 26, 0, 2.2, {l: 32, b: 24, t: 34, r: 12, sx: 5, sy: .5}), s = 0;
    hl(a, 2, RED, [6, 4], 1.8); fn(a, function(x){ return 2 - 1 / x; }, ORANGE, 1.8, [4, 4], 1, 26);
    for (var n = 1; n <= 25; n++){ s += 1 / (n * n); sd(a, n, s, BLUE, 4.2); }
    TB("sₙ = Σ 1/i²  ≤  2 − 1/n  <  2", W * .5, 22, INK, fs(16)); TB("2 − 1/n", a.X(25), a.Y(2 - 1 / 25) + 16, ORANGE, 13, "right");
    if (p > 0){ hl(a, PI * PI / 6, DGREEN, [3, 3], 2); TB("π²/6 ≈ 1,645", a.X(13), a.Y(PI * PI / 6) - 8, DGREEN, 14); } }
]);
})();
