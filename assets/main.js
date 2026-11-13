/* ROLETKA - zachowanie strony (pasek, menu, opinie, suwak, karuzela, FAQ) */
(function(){
  var d=document, w=window;
  var RM=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* pasek pływający: na stronie głównej pojawia się po przewinięciu hero */
  var fb=d.querySelector('.floatbar');
  if(fb&&!d.body.classList.contains('sub')){
    var onS=function(){fb.classList.toggle('show',w.scrollY>w.innerHeight*0.55)};
    w.addEventListener('scroll',onS,{passive:true});onS();
  }

  /* menu mobilne */
  var mn=d.querySelector('.mnav');
  d.querySelectorAll('.burger').forEach(function(b){b.addEventListener('click',function(){mn.classList.add('open');b.setAttribute('aria-expanded','true')})});
  var mc=d.querySelector('.mnav-close');
  if(mc)mc.addEventListener('click',function(){mn.classList.remove('open')});
  if(mn)mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open')})});

  /* opinie: pauza i "czytaj dalej" */
  var rw=d.querySelector('.rev-window'), rp=d.querySelector('.rev-pause');
  if(rw&&rp){rp.addEventListener('click',function(){var p=rw.classList.toggle('paused');rp.textContent=p?'Wznów':'Pauza'})}
  d.querySelectorAll('.rev-more').forEach(function(b){b.addEventListener('click',function(){var it=b.closest('.rev-item');var o=it.classList.toggle('open');b.textContent=o?'Zwiń':'Czytaj dalej'})});

  /* suwak odsłoń / zasłoń */
  var cmp=d.querySelector('.cmp');
  if(cmp){
    var set=function(x){var r=cmp.getBoundingClientRect();var p=Math.max(4,Math.min(96,(x-r.left)/r.width*100));cmp.style.setProperty('--pos',p+'%')};
    var drag=false;
    cmp.addEventListener('pointerdown',function(e){drag=true;set(e.clientX);cmp.setPointerCapture(e.pointerId)});
    cmp.addEventListener('pointermove',function(e){if(drag)set(e.clientX)});
    cmp.addEventListener('pointerup',function(){drag=false});
    cmp.addEventListener('keydown',function(e){var v=parseFloat(getComputedStyle(cmp).getPropertyValue('--pos'))||50;if(e.key==='ArrowLeft'){cmp.style.setProperty('--pos',Math.max(4,v-5)+'%');e.preventDefault()}if(e.key==='ArrowRight'){cmp.style.setProperty('--pos',Math.min(96,v+5)+'%');e.preventDefault()}});
    var shade=cmp.querySelector('.shade'), tabs=d.querySelectorAll('.cmp-tab'), panels=d.querySelectorAll('.cmp-info'), cap=d.querySelector('.cmp-cap'), cnt=d.querySelector('.cmp-cnt');
    tabs.forEach(function(t,i){t.addEventListener('click',function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected','false')});t.setAttribute('aria-selected','true');
      shade.className='shade '+t.dataset.k;
      panels.forEach(function(p){p.hidden=p.dataset.k!==t.dataset.k});
      if(cap)cap.textContent=t.dataset.cap; if(cnt)cnt.textContent='0'+(i+1)+' / 0'+tabs.length;
    })});
  }

  /* karuzela w łuku */
  var ring=d.querySelector('.ring');
  if(ring){
    var items=[].slice.call(ring.querySelectorAll('.ring-item')), N=items.length, STEP=20, rot=0, vel=RM?0:-0.045, dragging=false, lastX=0;
    var render=function(){
      var W=ring.clientWidth, R=Math.min(900,Math.max(300,W*0.55)), P=Math.round(R*1.2);
      ring.style.perspective=P+'px';
      for(var i=0;i<N;i++){
        var span=N*STEP, a=((i*STEP+rot)%span+span)%span; if(a>span/2)a-=span;
        var el=items[i];
        if(Math.abs(a)>66){el.style.visibility='hidden';continue}
        el.style.visibility='visible';
        var rad=a*Math.PI/180, x=R*Math.sin(rad), z=R*(1-Math.cos(rad))*1.1-120;
        el.style.transform='translate(-50%,-50%) translate3d('+x.toFixed(1)+'px,0,'+z.toFixed(1)+'px) rotateY('+(-a).toFixed(2)+'deg)';
        el.style.zIndex=String(100-Math.round(Math.abs(a)));
      }
    };
    var tick=function(){if(!dragging)rot+=vel;render();requestAnimationFrame(tick)};
    ring.addEventListener('pointerdown',function(e){dragging=true;lastX=e.clientX;ring.setPointerCapture(e.pointerId)});
    ring.addEventListener('pointermove',function(e){if(!dragging)return;rot+=(e.clientX-lastX)*0.09;lastX=e.clientX});
    ring.addEventListener('pointerup',function(){dragging=false});
    ring.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){rot+=STEP;e.preventDefault()}if(e.key==='ArrowRight'){rot-=STEP;e.preventDefault()}});
    w.addEventListener('resize',render);
    render(); requestAnimationFrame(tick);
  }

  /* FAQ */
  d.querySelectorAll('.faq-q').forEach(function(q){q.addEventListener('click',function(){var r=q.closest('.faq-row');var o=r.classList.toggle('open');q.setAttribute('aria-expanded',o?'true':'false')})});
})();
(function(){try{if(String(location.protocol).indexOf('http')!==0)return;try{if(/[?&#]team=1/.test(location.search+location.hash)){localStorage.setItem('nb_team','1');}}catch(e){}try{if(localStorage.getItem('nb_team')==='1')return;}catch(e){}if(/crm-newbeginning|crm\.impulseo\.pl/.test(document.referrer||''))return;try{if(navigator.webdriver)return;}catch(e){}try{if(/^https?:\/\/(kris20032|impulseo-pl)\.github\.io\/?$/i.test(document.referrer||''))return;}catch(e){}if(sessionStorage.getItem('_dv'))return;sessionStorage.setItem('_dv','1');var seg=(location.pathname.split('/').filter(Boolean)[0])||'';var base=location.origin+(seg?('/'+seg):'');var ua='';try{ua=(navigator.userAgent||'').slice(0,300);}catch(e){}var EP='https://zngfubfinbojfgaxdrbf.supabase.co/functions/v1/demo-view';try{fetch(EP,{method:'POST',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify({demo_url:base,page:location.pathname,referrer:(document.referrer||null),user_agent:(ua||null)})}).catch(function(){});}catch(e){}}catch(e){}})();
