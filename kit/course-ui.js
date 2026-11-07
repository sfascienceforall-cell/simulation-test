
/* Curseurs : la couleur du curseur reprend celle de son accent-color d'origine ; remplissage gauche en couleur. */
addEventListener('DOMContentLoaded',()=>{
/* Curseurs : couleur reprise de accent-color, remplissage à gauche. Resynchronisé en continu pour suivre
   les curseurs créés ou déplacés par la simulation elle-même. */
const fill=r=>{if(!r.dataset.sfa){r.dataset.sfa=1;const c=r.style.accentColor||getComputedStyle(r).accentColor;
    if(c&&c!=='auto')r.style.setProperty('--pc',c);}
  const v=r.value+'|'+r.min+'|'+r.max;if(r._sv===v)return;r._sv=v;
  const p=(r.value-r.min)/(r.max-r.min)*100;
  r.style.background=`linear-gradient(to right,var(--pc) ${p}%,var(--rule2) ${p}%) center/100% 2px no-repeat`;};
const all=()=>document.querySelectorAll('input[type=range]').forEach(fill);
all();document.addEventListener('input',e=>{if(e.target.matches&&e.target.matches('input[type=range]'))fill(e.target);});
setInterval(all,150);
/* Contrôles écrits en style en ligne (sans classe) : on leur donne les classes du kit. */
const st=e=>(e.getAttribute('style')||'').replace(/\s/g,'').toLowerCase();
const isPill=e=>/border-radius:(1[6-9]|20|99)px/.test(st(e));
document.querySelectorAll('span').forEach(sp=>{if(sp.classList.length||!isPill(sp))return;
  const n=sp.nextElementSibling,pv=sp.previousElementSibling;
  if(n&&n.matches('input[type=range],select,button'))sp.classList.add('pill');
  else if(pv&&pv.matches('input[type=range],select'))sp.classList.add('val');
  else sp.classList.add('pill');});
document.querySelectorAll('div').forEach(d=>{if(d.classList.length)return;const s=st(d);
  if(/border-radius:(1[6-9]|20)px/.test(s)&&/monospace/.test(s))d.classList.add(d.id==='fml'?'fml':'info');
  else if(d.querySelector(':scope>canvas')&&/border-radius:1[0-4]px/.test(s))d.classList.add('sfa-stage');});
const tag=b=>{const s=st(b);b.classList.toggle('on',/#185fa5|rgb\(24,95,165\)/.test(s)&&!/#fff[;f]|#ffffff|rgb\(255,255,255\)/.test(s.match(/background:[^;]+/)?.[0]||''));};
document.querySelectorAll('button:not(.btn)').forEach(b=>{b.classList.add('btn','sfa-n');tag(b);});
new MutationObserver(ms=>ms.forEach(m=>{if(m.target.classList&&m.target.classList.contains('sfa-n'))tag(m.target);}))
  .observe(document.body,{subtree:true,attributes:true,attributeFilter:['style']});
});
