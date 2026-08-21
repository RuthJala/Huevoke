
/* HUEVOKE V3.1 — dependency-free animation engine
   No GSAP/CDN required. Designed for GitHub Pages + mobile Safari. */

(() => {
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const ease=t=>t*t*(3-2*t);
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Menu
  const mb=q(".menu-button"), mm=q(".mobile-menu");
  if(mb&&mm){
    mb.addEventListener("click",()=>{
      const open=mm.classList.toggle("open");
      document.body.classList.toggle("menu-open",open);
      mb.textContent=open?"Close":"Menu";
    });
    qa("a",mm).forEach(a=>a.addEventListener("click",()=>{
      mm.classList.remove("open");
      document.body.classList.remove("menu-open");
      mb.textContent="Menu";
    }));
  }

  // Pointer glow
  const glow=q(".pointer-glow");
  if(glow && matchMedia("(pointer:fine)").matches){
    let gx=-999,gy=-999,cx=-999,cy=-999;
    addEventListener("pointermove",e=>{gx=e.clientX-210;gy=e.clientY-210;glow.style.opacity="1"});
    const tickGlow=()=>{cx=lerp(cx,gx,.16);cy=lerp(cy,gy,.16);glow.style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(tickGlow)};
    tickGlow();
  }

  if(reduced){
    qa(".reveal").forEach(el=>{el.style.opacity=1;el.style.transform="none"});
    const y=q("[data-year]"); if(y)y.textContent=new Date().getFullYear();
    return;
  }

  const tracked=[];

  function addScrollScene(el, render){
    if(!el)return;
    tracked.push({el,render,p:0});
  }

  function progressFor(el){
    const r=el.getBoundingClientRect();
    const scrollable=Math.max(1,el.offsetHeight-innerHeight);
    return clamp((-r.top)/scrollable);
  }

  // HERO
  const hero=q(".v3-hero"), heroImg=q(".v3-hero img"), heroCopy=q(".v3-hero .hero-copy");
  if(hero){
    addScrollScene(hero,p=>{
      if(heroImg) heroImg.style.transform=`scale(${lerp(1,1.12,p)}) translate3d(0,${p*3}%,0)`;
      if(heroCopy){heroCopy.style.transform=`translate3d(0,${-p*16}%,0)`;heroCopy.style.opacity=String(1-p*.85)}
    });
  }

  // Generic drag state helper.
  function enableHorizontalDrag(surface,state,render,sensitivity=.85){
    if(!surface)return;
    const start=e=>{
      if(e.button!==undefined && e.button!==0)return;
      state.dragging=true;state.startX=e.clientX;state.startOffset=state.dragOffset||0;
      surface.classList.add("is-dragging");
      try{surface.setPointerCapture(e.pointerId)}catch(_){}
    };
    const move=e=>{
      if(!state.dragging)return;
      const dx=e.clientX-state.startX;
      state.dragOffset=state.startOffset+dx/Math.max(innerWidth,600)*sensitivity;
      render();
    };
    const end=e=>{
      if(!state.dragging)return;
      state.dragging=false;surface.classList.remove("is-dragging");
      try{surface.releasePointerCapture(e.pointerId)}catch(_){}
      const from=state.dragOffset||0,startTime=performance.now(),dur=650;
      const anim=now=>{
        const t=clamp((now-startTime)/dur);
        state.dragOffset=lerp(from,0,ease(t));
        render();
        if(t<1)requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    };
    surface.addEventListener("pointerdown",start);
    surface.addEventListener("pointermove",move);
    surface.addEventListener("pointerup",end);
    surface.addEventListener("pointercancel",end);
  }

  // FORM — orbit/unfold
  const form=q(".v3-form"), unfoldScene=q(".unfold-scene"), formCards=qa(".unfold-card");
  if(form && unfoldScene && formCards.length){
    const s={p:0,dragOffset:0,dragging:false,startX:0,startOffset:0};
    const render=()=>{
      const p=clamp(s.p-s.dragOffset);
      const orbit=p*Math.PI*2;
      formCards.forEach((card,i)=>{
        const phase=orbit+i*(Math.PI*2/formCards.length);
        const front=(Math.cos(phase)+1)/2;
        const side=Math.sin(phase);
        const spread=Math.sin(Math.min(p,.42)/.42*Math.PI/2);
        const x=side*(29+spread*19), y=(1-front)*7+Math.sin(phase*2)*1.2;
        const scale=.70+front*.34, ry=-side*(26+spread*9), rz=side*2;
        card.style.transform=`translate(-50%,-50%) translate3d(${x}%,${y}%,${(front*280)-125}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
        card.style.opacity=String(.35+front*.65);
        card.style.filter=`brightness(${.70+front*.31})`;
        card.style.zIndex=String(Math.round(front*100)+2);
      });
    };
    s.render=render;
    addScrollScene(form,p=>{s.p=p;render()});
    enableHorizontalDrag(unfoldScene,s,render,.9);
    render();
  }

  // EROSION — split surface
  const erosion=q(".v3-erosion");
  if(erosion){
    const left=q(".split-half.left"), right=q(".split-half.right");
    const li=q(".split-half.left img"), ri=q(".split-half.right img"), copy=q(".split-center-copy");
    addScrollScene(erosion,p=>{
      let split;
      if(p<.76) split=p/.76;
      else split=lerp(1,.16,(p-.76)/.24);
      split=ease(clamp(split));
      if(left) left.style.transform=`translate3d(${-42*split}%,0,0)`;
      if(right) right.style.transform=`translate3d(${42*split}%,0,0)`;
      if(li) li.style.transform=`scale(${1.08+.14*split}) translate3d(${8*split}%,0,0)`;
      if(ri) ri.style.transform=`scale(${1.08+.14*split}) translate3d(${-8*split}%,0,0)`;
      if(copy){
        let a=0;
        if(p>.12&&p<.82) a=Math.min((p-.12)/.16,(.82-p)/.12,1);
        copy.style.opacity=String(clamp(a));
        copy.style.transform=`translate(-50%,${lerp(18,-10,p)}px)`;
      }
    });
  }

  // FLUID — depth stack
  const fluid=q(".v3-fluid"), depth=q(".depth-stack"), d1=q(".depth-card.d1"), d2=q(".depth-card.d2");
  if(fluid&&depth&&d1&&d2){
    const s={p:0,dragOffset:0,dragging:false,startX:0,startOffset:0};
    const render=()=>{
      const t=ease(clamp(s.p-s.dragOffset));
      d1.style.transform=`translate(-50%,-50%) translate3d(${-72*t}%,${2*t}%,${220-330*t}px) rotateY(${-34*t}deg) rotateZ(${-4*t}deg) scale(${1-.17*t})`;
      d1.style.opacity=String(1-.55*t);
      d2.style.transform=`translate(-50%,-50%) translate3d(${34*(1-t)}%,${5*(1-t)}%,${-100+330*t}px) rotateY(${21*(1-t)}deg) scale(${.72+.31*t})`;
      d2.style.opacity=String(.48+.52*t);
    };
    addScrollScene(fluid,p=>{s.p=p;render()});
    enableHorizontalDrag(depth,s,render,.9);
    render();
  }

  // BALANCE — rotating gallery prism
  const balance=q(".v3-balance"), cube=q(".gallery-cube");
  if(balance&&cube){
    addScrollScene(balance,p=>{
      cube.style.transform=`translate(-50%,-50%) rotateX(${lerp(-3,3,p)}deg) rotateY(${-360*p}deg)`;
    });
  }

  // TIDAL — room > product > macro
  const tidal=q(".v3-tidal"), room=q(".tidal-room"), obj=q(".tidal-object"), macro=q(".tidal-macro"), tidalCopy=q(".tidal-copy");
  if(tidal){
    addScrollScene(tidal,p=>{
      const roomFade=clamp((p-.20)/.22);
      if(room){
        room.style.transform=`scale(${lerp(1,1.42,clamp(p/.58))})`;
        room.style.opacity=String(1-roomFade);
        room.style.filter=`brightness(${lerp(1,.72,clamp(p/.55))})`;
      }

      const objIn=clamp((p-.15)/.24), objOut=clamp((p-.56)/.20);
      if(obj){
        obj.style.opacity=String(objIn*(1-objOut));
        obj.style.transform=`scale(${lerp(.72,1.70,clamp((p-.15)/.62))})`;
      }

      const macroIn=clamp((p-.53)/.22);
      if(macro){
        macro.style.opacity=String(macroIn);
        macro.style.transform=`scale(${lerp(.82,1.13,macroIn)})`;
      }
      if(tidalCopy) tidalCopy.style.opacity=String(1-clamp((p-.52)/.28)*.85);
    });
  }

  // Magnetic tiles
  if(matchMedia("(pointer:fine)").matches){
    qa(".magnetic").forEach(el=>{
      let tx=0,ty=0,rx=0,ry=0,cx=0,cy=0,crx=0,cry=0,active=false;
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect(), nx=(e.clientX-r.left)/r.width-.5, ny=(e.clientY-r.top)/r.height-.5;
        tx=nx*7;ty=ny*7;ry=nx*7;rx=-ny*7;active=true;
      });
      el.addEventListener("pointerleave",()=>{tx=ty=rx=ry=0;active=false});
      const tick=()=>{
        cx=lerp(cx,tx,.12);cy=lerp(cy,ty,.12);crx=lerp(crx,rx,.12);cry=lerp(cry,ry,.12);
        el.style.transform=`perspective(900px) translate3d(${cx}px,${cy}px,0) rotateX(${crx}deg) rotateY(${cry}deg)`;
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  // Reveal observer
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.animate(
          [{opacity:0,transform:"translateY(30px)"},{opacity:1,transform:"translateY(0)"}],
          {duration:800,easing:"cubic-bezier(.2,.7,.2,1)",fill:"forwards"}
        );
        io.unobserve(e.target);
      }
    })
  },{threshold:.12});
  qa(".reveal").forEach(el=>{el.style.opacity="0";io.observe(el)});

  // Smooth animation loop for scroll scenes.
  let ticking=false;
  function update(){
    tracked.forEach(o=>{
      const target=progressFor(o.el);
      o.p=lerp(o.p,target,.16);
      o.render(o.p);
    });
    ticking=false;
  }
  function requestUpdate(){
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  }
  addEventListener("scroll",requestUpdate,{passive:true});
  addEventListener("resize",requestUpdate,{passive:true});
  requestUpdate();

  // Continue easing briefly after scroll events to prevent stepping.
  let lastScrollY=scrollY;
  const settle=()=>{
    const moving=Math.abs(scrollY-lastScrollY)>.1;
    lastScrollY=scrollY;
    if(moving||tracked.some(o=>Math.abs(o.p-progressFor(o.el))>.001)) requestUpdate();
    requestAnimationFrame(settle);
  };
  settle();

  const y=q("[data-year]");
  if(y)y.textContent=new Date().getFullYear();
})();
