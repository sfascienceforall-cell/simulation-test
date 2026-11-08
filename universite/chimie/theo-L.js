/* Chimie BA1 · icônes des chapitres repris de l'ancienne page (L01…L18) : on réutilise la devanture d'origine. */
(function(){
 var M=[["L01",0],["L03",1],["L06",2],["L08",3],["L12",4],["L13",5],["L15",6],["L16",7],["c09",8],["L18",9]];
 M.forEach(function(p){
  var c=window.LEGACY_CH&&window.LEGACY_CH[p[1]];
  if(c&&c.ic&&p[0])SFA.theo(p[0],{icon:c.ic});
 });
})();
