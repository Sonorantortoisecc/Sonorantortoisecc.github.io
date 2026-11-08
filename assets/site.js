'use strict';
const menuButton=document.querySelector('.menu-toggle');
const nav=document.getElementById('main-nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('is-open')){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.focus()}});
// Live availability and checkout are intentionally not connected in this preview.
const filters=[...document.querySelectorAll('[data-filter]')],items=[...document.querySelectorAll('.gallery-item')];
let activeFilter='all';
function filterGallery(value){if(value!=='all'&&!filters.some(b=>b.dataset.filter===value))value='all';activeFilter=value;filters.forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});items.forEach(item=>item.hidden=value!=='all'&&item.dataset.room!==value&&!(item.dataset.tags||'').split(' ').includes(value));const count=items.filter(i=>!i.hidden).length;const status=document.getElementById('gallery-count');if(status)status.textContent=`Showing ${count} photographs`;}
filters.forEach(b=>b.addEventListener('click',()=>filterGallery(b.dataset.filter)));
if(filters.length)filterGallery(new URLSearchParams(location.search).get('room')||'all');
const dialog=document.getElementById('lightbox'),image=document.getElementById('lightbox-image'),caption=document.getElementById('lightbox-caption');
let activePhoto=0,lastTrigger=null;
const visibleLinks=()=>items.filter(i=>!i.hidden).map(i=>i.querySelector('.lightbox-trigger'));
function showPhoto(index){const links=visibleLinks();if(!links.length)return;activePhoto=(index+links.length)%links.length;const link=links[activePhoto];image.src=link.dataset.full;image.alt=link.querySelector('img').alt;caption.textContent=`${link.dataset.caption} · ${activePhoto+1} / ${links.length}`;}
document.querySelectorAll('.lightbox-trigger').forEach(link=>link.addEventListener('click',e=>{if(!dialog?.showModal)return;e.preventDefault();lastTrigger=link;showPhoto(visibleLinks().indexOf(link));dialog.showModal();document.body.style.overflow='hidden';document.getElementById('close-lightbox').focus()}));
document.getElementById('close-lightbox')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus()});
dialog?.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}});
document.getElementById('previous-photo')?.addEventListener('click',()=>showPhoto(activePhoto-1));
document.getElementById('next-photo')?.addEventListener('click',()=>showPhoto(activePhoto+1));
dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(activePhoto-1)}if(e.key==='ArrowRight'){e.preventDefault();showPhoto(activePhoto+1)}});
// Deliberately no network handlers, form submission, analytics, cookies, localStorage,
// payment integration or notification collection. Email field and notify button are disabled.
document.getElementById('notify-form')?.addEventListener('submit',e=>e.preventDefault());
