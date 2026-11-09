(() => {
 const script=document.currentScript;
 const endpoint=script.dataset.endpoint||'http://127.0.0.1:8787/chat';
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('scc-assistant.css',script.src);document.head.append(css);
 const root=document.createElement('div');root.id='scc-chat';
 root.innerHTML=`<button class="scc-launch" aria-expanded="false" aria-controls="scc-panel">Ask SCC <span aria-hidden="true">↗</span></button><section id="scc-panel" aria-label="SCC guide assistant" hidden><header><div><strong>Sonoran Country Club</strong><small>Easy pace. Elevated taste.</small></div><button class="scc-close" aria-label="Close assistant">×</button></header><div class="scc-notice">GUIDE ASSISTANT · Public stay tips only</div><div class="scc-messages" role="log" aria-live="polite"><p class="scc-bot">Welcome to SCC. Ask about the clubhouse, grounds, or nearby. For door codes, contacts, or anything about your booking, please message your host through your booking platform.</p></div><form><label for="scc-input">Your question</label><div class="scc-compose"><input id="scc-input" maxlength="1000" placeholder="Ask about your stay…" autocomplete="off" required><button type="submit">Send</button></div></form><footer>Answers from published guide info · Please don’t enter private details.</footer></section>`;
 document.body.append(root);
 const panel=root.querySelector('section'), launch=root.querySelector('.scc-launch'), input=root.querySelector('input'), log=root.querySelector('.scc-messages'), send=root.querySelector('[type=submit]');
 const toggle=open=>{panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open)input.focus();else launch.focus();};
 launch.onclick=()=>toggle(panel.hidden);root.querySelector('.scc-close').onclick=()=>toggle(false);root.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false);});
 function add(text,who){const p=document.createElement('p');p.className='scc-'+who;p.textContent=text;log.append(p);log.scrollTop=log.scrollHeight;}
 root.querySelector('form').onsubmit=async e=>{e.preventDefault();const message=input.value.trim();if(!message)return;add(message,'user');input.value='';send.disabled=true;
 try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history:[]}),signal:AbortSignal.timeout(20000)});const data=await r.json();add(data.reply||data.error||'Please try again.','bot');}
 catch{add('The assistant is unavailable. Please message your host through your booking platform.','bot');}
 finally{send.disabled=false;input.focus();}};
 // Deliberately stateless: no cookies, localStorage, booking links, transcript persistence or analytics.
})();
