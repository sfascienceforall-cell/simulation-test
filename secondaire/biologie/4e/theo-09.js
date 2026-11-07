/* Biologie 4e · chapitre 9 · Du gène à la protéine */
var b4_AA={AUG:'Met',UUU:'Phe',AAA:'Lys',GGC:'Gly',GCU:'Ala',GAU:'Asp',GAG:'Glu',GAA:'Glu',GUG:'Val',UAA:'Stop',UGA:'Stop',UAG:'Stop',CCU:'Pro',CCC:'Pro',CCA:'Pro',CCG:'Pro',CAA:'Gln',UUA:'Leu',AAG:'Lys',GCC:'Ala',UUC:'Phe'};
function b4rna(b){return {A:'U',T:'A',G:'C',C:'G'}[b];}
function b4aa(x,y,t,col,r){r=r||17;DOT(x,y,r,(col||BLUE)+'33');ctx.strokeStyle=col||BLUE;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(t,x,y+4,dk(col||BLUE),Math.max(10,Math.round(r*.7)));}
function b4codons(seq,x0,w,y,sz,cols){var n=seq.length;for(var i=0;i<n;i++){var cx=x0+(i+.5)*w/n,s=seq[i];ctx.strokeStyle=(cols&&cols[i])||GREEN;ctx.lineWidth=2;ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(cx-w/n*.44,y-sz*.9,w/n*.88,sz*1.8,7);ctx.fill();ctx.stroke();for(var j=0;j<3;j++){TB(s[j],cx+(j-1)*sz*.78,y+sz*.35,dk(b4bc(s[j])),Math.round(sz));}}}
function b4ribo2(x,y,s){b4ell(x,y-3*s,15*s,9*s,'#a8a2ea',VIOLET,1.8);b4ell(x,y+7*s,10*s,7*s,'#c9c4f3',VIOLET,1.8);}
SFA.theo("c09",{
 icon:function(){TB('ADN → ARNm → protéine',W*.5,H*.35,BLUE_D,Math.min(26,W/14));TB('transcription · traduction',W*.5,H*.62,ORANGE,Math.min(20,W/20));TB('AUG · GAU · UAA',W*.5,H*.85,GREEN,Math.min(18,W/22));},
 anim:function(t){var P=1100,k=(t%P)/P,tpl='TACAAATTTCCGACT',mr='AUGUUUAAAGGCUGA',n=15,x0=W*.06,w=W*.88,dx=w/n,sz=Math.min(24,dx*.8);
  var nT=Math.floor(n*b4r(k,.04,.4)+.0001),stage=k<.45?0:1;TB(stage===0?'1  Transcription (noyau) : l\'ADN est copié en ARNm':'2  Traduction (ribosome) : l\'ARNm est lu par codons',W*.5,H*.07,BLUE_D,Math.max(13,Math.min(16,W/44)));
  var y1=H*.25,y2=H*.43;TB("3'",x0-4,y1+5,GREY,12,'right');TB("5'",x0+w+14,y1+5,GREY,12);TB("5'",x0-4,y2+5,GREY,12,'right');TB("3'",x0+w+14,y2+5,GREY,12);
  for(var i=0;i<n;i++){var x=x0+(i+.5)*dx;b4base(x,y1,tpl[i],sz/26);if(i<nT||stage===1){b4base(x,y2,mr[i],sz/26);}}
  if(stage===0&&nT<n){var px=x0+(nT+.5)*dx;b4ell(px,y1+(y2-y1)/2,dx*.7,H*.09,'#f6c94655',YEL,2);TB('ARN pol.',px,y1+(y2-y1)/2+4,'#7a5a00',11);}
  TB('brin matrice',x0+w/2,y1-24,GREY,12);TB('ARNm',x0+w/2,y2+30,GREEN===0?INK:DGREEN,12);
  if(stage===1){var u=b4r(k,.5,.95)*5,ci=Math.min(4,Math.floor(u)),ph=u-ci,cx=x0+(ci*3+1.5)*dx;
   b4ribo2(cx,y2+H*.18,Math.min(1.5,dx/22));var aa=['Met','Phe','Lys','Gly','Stop'];
   for(var c=0;c<=Math.min(3,ci-(ph<.5?1:0));c++){var ax=x0+W*.12+c*42*Math.max(1,W/700);b4aa(ax,H*.86,aa[c],c%2?ORANGE:BLUE,16);if(c>0)LN(ax-26,H*.86,ax-16,H*.86,GREY,2);}
   if(ci<4)TB('codon '+(ci+1)+' → '+aa[ci],W*.78,H*.86,DGREEN,14);else TB('codon stop : fin',W*.78,H*.86,DRED,14);}
  else TB('(ARNm : 5\'-AUG UUU AAA GGC UGA-3\')',W*.5,H*.8,GREY,13);
 },
 th:'<div class="tcard"><b class="h">Deux étapes : ADN → ARNm → protéine</b><ul><li><b>Transcription</b> (noyau) : l\'ARN polymérase copie un brin d\'ADN (le <b>brin matrice</b>) en <b>ARN messager</b>, complémentaire, avec <b>U à la place de T</b> (A→U, T→A, G→C, C→G).</li><li><b>Traduction</b> (ribosomes, cytoplasme) : le ribosome lit l\'ARNm par groupes de 3 bases, les <b>codons</b> ; chaque ARNt, par son <b>anticodon</b> complémentaire, apporte l\'acide aminé correspondant ; les acides aminés sont liés en chaîne jusqu\'au codon <b>stop</b>.</li></ul><div class="tip"><b class="h">Exemple</b><br>Matrice 3\'-TACGGTCAA-5\' → ARNm <b>5\'-AUGCCAGUU-3\'</b>. Codon GAU → anticodon <b>CUA</b> (ARNt) → acide aspartique (Asp).</div></div>'+
 '<div class="tcard"><b class="h">Le code génétique</b><p>64 codons pour 20 acides aminés : le code est <b>universel</b> et <b>redondant</b> (plusieurs codons pour un même acide aminé, surtout différents par la 3<sup>e</sup> base). <b>AUG</b> = Met et signal de <b>départ</b> ; <b>UAA, UAG, UGA</b> = <b>stop</b> (pas d\'acide aminé).</p><table><tr><td>AUG</td><td>Met</td><td>UUU</td><td>Phe</td><td>AAA</td><td>Lys</td></tr><tr><td>GGC</td><td>Gly</td><td>GCU</td><td>Ala</td><td>GAU</td><td>Asp</td></tr><tr><td>GAG, GAA</td><td>Glu</td><td>GUG</td><td>Val</td><td>CCN</td><td>Pro</td></tr></table><p>Longueur : 1 acide aminé = 1 codon = 3 nucléotides. Protéine de 150 acides aminés : 450 nt codants, <b>453</b> avec le codon stop.</p></div>'+
 '<div class="tcard"><b class="h">Mutations ponctuelles</b><ul><li><b>Silencieuse</b> : le nouveau codon code le même acide aminé (GAG → GAA, tous deux Glu).</li><li><b>Faux-sens</b> : un autre acide aminé (GAG → GUG : Glu → Val).</li><li><b>Non-sens</b> : apparition d\'un codon stop, protéine raccourcie.</li><li><b>Décalage du cadre de lecture</b> : insertion ou délétion d\'une ou deux bases, tous les codons suivants sont changés (en général la plus grave).</li></ul><p>Une substitution en <b>3<sup>e</sup> base</b> du codon est souvent silencieuse (CCU, CCC, CCA, CCG = Pro) ; mutation du codon AUG initiateur : traduction mal démarrée.</p></div>'+
 '<div class="tcard"><b class="h">Mutation et phénotype : la drépanocytose</b><p>Gène de la β-globine : le 6<sup>e</sup> codon GAG (Glu) devient GTG sur l\'ADN (A→T), donc GUG (<b>Val</b>) dans l\'ARNm : une mutation <b>faux-sens</b>. Brin matrice : 3\'-CTC-5\' devient 3\'-CAC-5\'. La valine est hydrophobe : l\'hémoglobine S forme des fibres sans O<sub>2</sub> et déforme les globules rouges en faucille.</p></div>'+
 '<div class="warn"><b class="h">Polysome</b><br>Plusieurs ribosomes lisent le même ARNm. 300 acides aminés à 6 aa/s : 50 s par protéine. 12 ribosomes : débit = 12 × 6 ÷ 300 = <b>0,24 protéine/s</b> ; en 20 min (1 200 s) : (1 200 − 50) × 0,24 ≈ <b>276</b> protéines. Maximum : 300 ÷ 10 = 30 ribosomes (un ribosome occupe ≈ 10 codons).</div>'
});
SFA.figs("c09",[
 /* 0 transcrire */
 function(p){var s='TACGGTCAA',n=9,x0=W*.12,dx=W*.78/n,y1=H*.3,y2=H*.66;TB("3'",W*.07,y1+5,GREY,15);TB("5'",W*.93,y1+5,GREY,15);TB("5'",W*.07,y2+5,GREY,15);TB("3'",W*.93,y2+5,GREY,15);TB('brin matrice',W*.5,y1-30,GREY,13);
  for(var i=0;i<n;i++){var x=x0+(i+.5)*dx;b4base(x,y1,s[i],1.1);if(p<=0){ctx.setLineDash([3,3]);ctx.strokeStyle=GREY;ctx.strokeRect(x-14,y2-14,28,28);ctx.setLineDash([]);TB('?',x,y2+6,GREY,18);}else{b4al(b4r(p,i*.07,i*.07+.3));LN(x,y1+16,x,y2-16,GREY,1.6,[3,3]);b4base(x,y2,b4rna(s[i]),1.1);b4al(1);}}
  TB('ARNm',W*.5,y2+36,DGREEN,13);b4ans(p,"5'-AUGCCAGUU-3'",GREEN,H-20);},
 /* 1 codon anticodon */
 function(p){var cx=W*.4,y=H*.58;ctx.strokeStyle=BLUE_D;ctx.lineWidth=5;ctx.lineCap='round';LN(cx,H*.2,cx,y-26,BLUE_D,6);ctx.lineCap='butt';b4ell(cx,H*.4,W*.1,H*.12,'#e6f1fb',BLUE,2.4);TB('ARNt',cx,H*.4+4,BLUE_D,14);
  if(p<=0)b4aa(cx,H*.15,'?',GREY,19);else{b4al(b4r(p,0,.5));b4aa(cx,H*.15,'Asp',ORANGE,21);b4al(1);}
  var a=p<=0?['?','?','?']:['C','U','A'];for(var j=0;j<3;j++){var x=cx+(j-1)*32;if(p<=0){ctx.setLineDash([3,3]);ctx.strokeStyle=GREY;ctx.strokeRect(x-14,y-14,28,28);ctx.setLineDash([]);TB('?',x,y+6,GREY,18);}else{b4al(b4r(p,0,.6));b4base(x,y,a[j],1.1);b4al(1);}}
  ['G','A','U'].forEach(function(b,j){var x=cx+(j-1)*32;b4base(x,y+H*.2,b,1.1);if(p>0){LN(x,y+14,x,y+H*.2-14,GREY,1.6,[3,3]);}});TB('anticodon',cx-95,y+5,GREY,13,'right');TB('codon GAU',cx-95,y+H*.2+5,DGREEN,13,'right');TB('ARNm',cx+80,y+H*.2+5,GREY,13,'left');
  b4ans(p,'anticodon CUA · acide aspartique (Asp)',GREEN,H-20);},
 /* 2 lire un ARNm */
 function(p){var seq=['AUG','GCU','UAA'],aa=['Met','Ala','Stop'];b4codons(seq,W*.1,W*.8,H*.3,20);
  if(p<=0)TB('quelle protéine ?',W*.5,H*.65,GREY,20);
  else{seq.forEach(function(c,i){var x=W*.1+(i+.5)*W*.8/3;b4al(b4r(p,i*.15,i*.15+.3));LN(x,H*.3+20,x,H*.5-10,GREY,1.6);if(aa[i]==='Stop'){b4box(x,H*.55,60,34,RED,'#fcebeb',2);TB('Stop',x,H*.55+5,DRED,15);}else b4aa(x,H*.55,aa[i],i?ORANGE:BLUE,22);b4al(1);});b4al(b4r(p,.5,1));LN(W*.1+W*.8/6+22,H*.55,W*.1+W*.8/2-22,H*.55,GREY,3);b4al(1);b4ans(p,'Met–Ala (dipeptide)',GREEN,H-20);}},
 /* 3 traduire */
 function(p){var seq=['AUG','UUU','AAA','GGC','UGA'],aa=['Met','Phe','Lys','Gly','Stop'];b4codons(seq,W*.06,W*.88,H*.3,18);
  if(p<=0)TB('séquence peptidique ?',W*.5,H*.65,GREY,20);
  else{seq.forEach(function(c,i){var x=W*.06+(i+.5)*W*.88/5;b4al(b4r(p,i*.14,i*.14+.3));LN(x,H*.3+18,x,H*.5-10,GREY,1.6);if(i===4){b4box(x,H*.55,56,34,RED,'#fcebeb',2);TB('Stop',x,H*.55+5,DRED,15);}else{b4aa(x,H*.55,aa[i],i%2?ORANGE:BLUE,21);if(i>0)LN(x-W*.88/5+21,H*.55,x-21,H*.55,GREY,3);}b4al(1);});b4ans(p,'Met–Phe–Lys–Gly (4 acides aminés)',GREEN,H-20);}},
 /* 4 taille d'un gène */
 function(p){var x0=W*.08,w=W*.84,y=H*.28,h=H*.14;TB('protéine : 150 acides aminés',W*.5,H*.14,BLUE_D,16);for(var i=0;i<15;i++){b4aa(x0+(i+.5)*w/15,y,'',i%2?ORANGE:BLUE,Math.min(14,w/36));}
  if(p<=0){TB('× 3 ?',W*.5,H*.62,GREY,28);}
  if(p>0){b4al(b4r(p,0,.5));var f=.97,ww=w*f;ctx.fillStyle='#d8f1e6';ctx.fillRect(x0,H*.55,ww,h);ctx.strokeStyle=GREEN;ctx.lineWidth=2;ctx.strokeRect(x0,H*.55,ww,h);ctx.fillStyle='#fcebeb';ctx.fillRect(x0+ww,H*.55,w-ww,h);ctx.strokeStyle=RED;ctx.strokeRect(x0+ww,H*.55,w-ww,h);TB('150 × 3 = 450 nt',x0+ww/2,H*.55+h*.62,DGREEN,15);TB('+ stop',x0+w-2,H*.55-6,DRED,13,'right');TB('453 nt  =  453 paires de bases',W*.5,H*.55+h+26,DGREEN,16);b4al(1);b4ans(p,'450 · 453 · 453 pb',GREEN,H-20);}},
 /* 5 mutation silencieuse */
 function(p){var y=H*.35;b4codons(['GAG'],W*.12,W*.2,y,20,[BLUE]);b4codons(['GAA'],W*.68,W*.2,y,20,[RED]);A(W*.38,y,W*.2,0,GREY,'',3);TB('substitution',W*.5,y-30,GREY,13);
  b4aa(W*.22,H*.65,'Glu',BLUE,24);if(p<=0){b4aa(W*.78,H*.65,'?',GREY,24);TB('classer la mutation ?',W*.5,H*.9,GREY,17);}else{b4al(b4r(p,0,.5));b4aa(W*.78,H*.65,'Glu',BLUE,24);TB('=',W*.5,H*.65+8,DGREEN,34);b4al(1);b4ans(p,'silencieuse : même acide aminé',GREEN,H-20);}},
 /* 6 la plus grave */
 function(p){var rows=[['normale',['AUG','UUU','AAA','GGC','CCA'],['Met','Phe','Lys','Gly','Pro'],[0,0,0,0,0]],['substitution',['AUG','UUU','CAA','GGC','CCA'],['Met','Phe','Gln','Gly','Pro'],[0,0,1,0,0]],['délétion',['AUG','UUA','AAG','GCC','CA…'],['Met','Leu','Lys','Ala','…'],[0,1,1,1,1]]];
  rows.forEach(function(r,i){var y=H*.2+i*H*.27;TB(r[0],W*.02,y-26,GREY,13,'left');var cols=r[3].map(function(f){return f?RED:GREEN;});b4codons(r[1],W*.06,W*.9,y,Math.min(15,W/30),cols);
   if(p>0){r[2].forEach(function(a,j){var x=W*.06+(j+.5)*W*.9/5;b4al(b4r(p,i*.15+j*.04,i*.15+j*.04+.3));TB(a,x,y+H*.1,r[3][j]?DRED:DGREEN,14);b4al(1);});}});
  if(p<=0)TB('substitution ou délétion ?',W*.5,H*.97,GREY,16);if(p>0)b4ans(p,'la délétion décale tout le cadre de lecture',GREEN,H-14);},
 /* 7 drépanocytose */
 function(p){var cols=[W*.3,W*.72],hd=['normal','drépanocytaire'],cod=[['G','A','G'],['G','T','G']],mat=[['C','T','C'],['C','A','C']],rn=[['G','A','G'],['G','U','G']];
  TB('brin codant',W*.02,H*.19,GREY,12,'left');TB("matrice 3'→5'",W*.02,H*.34,GREY,12,'left');TB('ARNm',W*.02,H*.49,GREY,12,'left');TB('acide aminé',W*.02,H*.64,GREY,12,'left');
  cols.forEach(function(cx,k){TB(hd[k],cx,H*.07,k?DRED:DGREEN,15);for(var j=0;j<3;j++){var x=cx+(j-1)*30;b4base(x,H*.19,cod[k][j],.9);b4base(x,H*.34,mat[k][j],.9);if(p>0){b4al(b4r(p,0,.4));b4base(x,H*.49,rn[k][j],.9);b4al(1);}}
   if(p>0){b4al(b4r(p,.3,.8));b4aa(cx,H*.64,k?'Val':'Glu',k?RED:BLUE,22);var ry=H*.79;if(k){ctx.fillStyle='#fcebeb';ctx.strokeStyle=RED;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx-26,ry+10);ctx.quadraticCurveTo(cx,ry-22,cx+26,ry-8);ctx.quadraticCurveTo(cx,ry+2,cx-26,ry+10);ctx.fill();ctx.stroke();}else{b4ell(cx,ry,20,11,'#fcebeb',RED,2.4);}b4al(1);}});
  A(W*.5,H*.19,W*.1,0,GREY,'',2.5);if(p<=0)TB('?',W*.72,H*.64,GREY,30);
  if(p>0)b4ans(p,'Val · faux-sens · hémoglobine S en fibres',GREEN,H-20);},
 /* 8 polysome */
 function(p){var y=H*.32,x0=W*.06,x1=W*.94;LN(x0,y,x1,y,GREEN,3);TB("5'",x0-2,y+22,GREY,13,'left');TB("3'",x1,y+22,GREY,13,'right');TB('ARNm',W*.5,H*.1,DGREEN,14);
  for(var i=0;i<12;i++){var x=x0+W*.06+i*(x1-x0-W*.1)/12*1;b4ribo2(x,y,Math.min(.9,W/700+.4));var len=(i/12)*(H*.36)+8;ctx.strokeStyle=ORANGE;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x,y+12);for(var k=1;k<=10;k++){var yy=y+12+k/10*len;ctx.lineTo(x+Math.sin(k*1.4+i)*3,yy);}ctx.stroke();}
  TB('chaînes de plus en plus longues',W*.5,H*.9,GREY,13);
  if(p<=0){TB('? s · ? protéines',W*.5,H*.97,GREY,15);}
  if(p>0){b4al(b4r(p,0,.5));b4box(W*.5,H*.8,W*.84,H*.14,GREEN,'#f2fbf7',2);TB('50 s · 0,24 /s · ≈ 276 en 20 min · 30 ribosomes max',W*.5,H*.8+5,DGREEN,Math.max(12,Math.min(15,W/34)));b4al(1);}},
 /* 9 mutation inaperçue */
 function(p){var c=['CCU','CCC','CCA','CCG'],y=H*.32;c.forEach(function(s,i){var x=W*(.14+i*.19);b4box(x,y,W*.16,H*.2,GREEN,'#fff',2);for(var j=0;j<3;j++)TB(s[j],x+(j-1)*18,y+6,j===2?RED:INK,20);if(p>0){b4al(b4r(p,i*.1,i*.1+.3));A(x,y+H*.12,0,H*.08,GREY,'',2);b4aa(x,H*.68,'Pro',BLUE,19);b4al(1);}});
  TB('substitution de la base en rouge (3e base) ?',W*.45,H*.1,GREY,15);
  b4box(W*.88,y,W*.16,H*.2,RED,'#fcebeb',2);TB('AUG',W*.88,y+6,DRED,17);TB('départ',W*.88,y+H*.16,GREY,12);
  if(p>0){b4al(b4r(p,.4,.9));TB('4 codons → même acide aminé',W*.4,H*.85,DGREEN,15);b4al(1);b4ans(p,'substitution de la 3e base',GREEN,H-20);}}
]);
