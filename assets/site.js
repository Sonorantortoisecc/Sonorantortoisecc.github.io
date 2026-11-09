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

/* SCC Pro Shop cart loader */
(function(){
  if (window.__sccCartLoader) return;
  window.__sccCartLoader = true;
  function injectCartCss(){
    if (document.querySelector('link[data-scc-cart-css]')) return;
    /* style.css already has rules on most pages; guide uses guide-site-shell — add minimal inline if needed */
    if (!document.querySelector('link[href*="style.css"]')) {
      var s=document.createElement('style');
      s.setAttribute('data-scc-cart-css','1');
      s.textContent='.scc-cart-button{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;width:44px;height:44px;margin-left:8px;border:1px solid #d8ccb7;background:#fffdf8;color:#1b2a44;cursor:pointer;flex-shrink:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent;z-index:60;pointer-events:auto}.scc-cart-button svg{pointer-events:none}.scc-cart-button:hover{background:#d9a596}.scc-cart-count{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#1b2a44;color:#fffdf8;font-size:10px;font-weight:700;line-height:18px;text-align:center;pointer-events:none}.scc-cart-toggle-host,.shopify-buy-frame--toggle{position:fixed!important;right:0;bottom:0;width:2px!important;height:2px!important;opacity:0.01!important;overflow:hidden!important;z-index:2147483646!important;pointer-events:auto!important;display:block!important;visibility:visible!important}';
      document.head.appendChild(s);
    }
  }
  function loadCart(){
    injectCartCss();
    if (document.querySelector('script[data-scc-proshop-cart], script[src*="/assets/shop/buybuttons.js"]')) return;
    if (window.__sccProShopInit || window.__sccProShopMounted) return;
    var s=document.createElement('script');
    s.src='/assets/shop/buybuttons.js';
    s.defer=true;
    s.setAttribute('data-scc-proshop-cart','1');
    document.head.appendChild(s);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', loadCart);
  else loadCart();
})();
