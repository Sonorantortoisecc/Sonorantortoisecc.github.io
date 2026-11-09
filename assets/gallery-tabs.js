/* Gallery tabs enhance ordinary anchors; without JS both panels stay visible. */
(()=>{
 const tabs=[...document.querySelectorAll('[data-gallery-tab]')];
 if(!tabs.length)return;
 const panels=[...document.querySelectorAll('.gallery-panel')];
 const byRoom={exterior:'outside','the-fore':'outside',pool:'outside','hot-tub':'outside','outdoor-mini-golf':'outside','outdoor-games':'outside','fire-pit':'outside','patio-bar':'outside',grill:'outside','sport-court':'outside','patio-dining':'outside','patio-sound':'outside','living-room':'inside',dining:'inside',kitchen:'inside',bedrooms:'inside','primary-retreat':'inside','rose-room':'inside','desert-blues':'inside','bunk-room':'inside',futon:'inside',bathrooms:'inside','game-room':'inside','indoor-mini-golf':'inside',laundry:'inside'};
 let activeRoom=null;
 function itemMatches(f,roomFilter){
  if(!roomFilter)return true;
  if(f.dataset.room===roomFilter)return true;
  const tags=(f.dataset.tags||'').split(/\s+/).filter(Boolean);
  return tags.includes(roomFilter);
 }
 function select(value,updateHash=false){
  const active=value==='inside'?'inside':'outside';
  tabs.forEach(t=>{const on=t.dataset.galleryTab===active;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;});
  panels.forEach(p=>{
   p.hidden=p.id!==active;
   p.querySelectorAll('.gallery-item').forEach(f=>{
    if(p.hidden){f.hidden=true;return;}
    f.hidden=!itemMatches(f,activeRoom);
   });
   // Hide empty photo groups within the active panel
   p.querySelectorAll('.gallery-photo-group').forEach(g=>{
    const any=[...g.querySelectorAll('.gallery-item')].some(i=>!i.hidden);
    g.hidden=!any;
   });
  });
  const count=document.querySelectorAll('.gallery-panel:not([hidden]) .gallery-item:not([hidden])').length;
  const total=document.querySelectorAll('.gallery-item').length;
  const label=activeRoom?`${count} ${activeRoom.replace(/-/g,' ')} photographs`:`${count} ${active} photographs · ${total} total`;
  const el=document.getElementById('gallery-count');
  if(el)el.textContent=label;
  if(updateHash){
   const url=new URL(location.href);
   url.hash=active;
   history.replaceState(null,'',url.pathname+url.search+url.hash);
  }
 }
 tabs.forEach((t,index)=>{
  t.addEventListener('click',e=>{e.preventDefault();activeRoom=null;select(t.dataset.galleryTab,true);});
  t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowLeft')next=1-index;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();tabs[next].focus();activeRoom=null;select(tabs[next].dataset.galleryTab,true);});
 });
 const room=new URLSearchParams(location.search).get('room');
 const hash=location.hash.slice(1);
 activeRoom=(room&&byRoom[room])?room:null;
 select(hash==='inside'||hash==='outside'?hash:(byRoom[room]||'outside'));
 addEventListener('hashchange',()=>{const value=location.hash.slice(1);if(value==='inside'||value==='outside'){activeRoom=null;select(value);}});
 if(room&&byRoom[room]){
  const target=document.querySelector(`.gallery-panel:not([hidden]) .gallery-item[data-room="${CSS.escape(room)}"]:not([hidden])`)
   ||(room==='the-fore'?document.querySelector('[data-tags~="the-fore"]'):null)
   ||document.getElementById(room);
  if(target)target.scrollIntoView({block:'start'});
 }
})();
