/* Gallery tabs enhance ordinary anchors; without JS both panels stay visible. */
(()=>{
 const tabs=[...document.querySelectorAll('[data-gallery-tab]')];
 if(!tabs.length)return;
 const panels=[...document.querySelectorAll('.gallery-panel')];
 const byRoom={exterior:'outside','the-fore':'outside',pool:'outside','hot-tub':'outside','outdoor-mini-golf':'outside','outdoor-games':'outside','fire-pit':'outside','patio-bar':'outside',grill:'outside','living-room':'inside',dining:'inside',kitchen:'inside',bedrooms:'inside','bunk-room':'inside',bathrooms:'inside','game-room':'inside','indoor-mini-golf':'inside',laundry:'inside'};
 function select(value,updateHash=false){
  const active=value==='inside'?'inside':'outside';
  tabs.forEach(t=>{const on=t.dataset.galleryTab===active;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;});
  panels.forEach(p=>{p.hidden=p.id!==active;p.querySelectorAll('.gallery-item').forEach(f=>f.hidden=p.hidden);});
  const count=document.querySelectorAll('.gallery-panel:not([hidden]) .gallery-item').length;
  document.getElementById('gallery-count').textContent=`${count} ${active} photographs · 84 total`;
  if(updateHash)history.replaceState(null,'','#'+active);
 }
 tabs.forEach((t,index)=>{
  t.addEventListener('click',e=>{e.preventDefault();select(t.dataset.galleryTab,true);});
  t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowLeft')next=1-index;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();tabs[next].focus();select(tabs[next].dataset.galleryTab,true);});
 });
 const room=new URLSearchParams(location.search).get('room');
 const hash=location.hash.slice(1);
 select(hash==='inside'||hash==='outside'?hash:(byRoom[room]||'outside'));
 addEventListener('hashchange',()=>{const value=location.hash.slice(1);if(value==='inside'||value==='outside')select(value);});
 if(room&&byRoom[room]){const target=document.querySelector(`.gallery-panel:not([hidden]) .gallery-item[data-room="${CSS.escape(room)}"]`)||(room==='the-fore'?document.querySelector('[data-tags~="the-fore"]'):null);if(target)target.closest('.gallery-photo-group').scrollIntoView();}
})();
