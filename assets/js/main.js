gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = gsap.utils.clamp;

const mb=document.querySelector(".menu-button"), mm=document.querySelector(".mobile-menu");
if(mb&&mm){
  mb.onclick=()=>{
    const o=mm.classList.toggle("open");
    document.body.classList.toggle("menu-open",o);
    mb.textContent=o?"Close":"Menu";
  };
  mm.querySelectorAll("a").forEach(a=>a.onclick=()=>{
    mm.classList.remove("open"); document.body.classList.remove("menu-open"); mb.textContent="Menu";
  });
}

const glow=document.querySelector(".pointer-glow");
if(glow && matchMedia("(pointer:fine)").matches){
  document.addEventListener("pointermove",e=>{
    gsap.to(glow,{x:e.clientX-210,y:e.clientY-210,opacity:1,duration:.65,ease:"power3.out",overwrite:true});
  });
}

function makeDrag(surface,state,render,sensitivity=.75){
  if(!surface) return;
  surface.addEventListener("pointerdown",e=>{
    if(e.button!==undefined && e.button!==0) return;
    state.dragging=true; state.startX=e.clientX; state.startOffset=state.dragOffset||0;
    surface.classList.add("is-dragging");
    try{surface.setPointerCapture(e.pointerId)}catch(_){}
  });
  surface.addEventListener("pointermove",e=>{
    if(!state.dragging) return;
    const dx=e.clientX-state.startX;
    state.dragOffset=state.startOffset + dx/Math.max(innerWidth,600)*sensitivity;
    render();
  });
  const end=e=>{
    if(!state.dragging) return;
    state.dragging=false; surface.classList.remove("is-dragging");
    try{surface.releasePointerCapture(e.pointerId)}catch(_){}
    gsap.to(state,{dragOffset:0,duration:.85,ease:"power3.out",onUpdate:render,overwrite:true});
  };
  surface.addEventListener("pointerup",end); surface.addEventListener("pointercancel",end);
}

if(!reduced){
  // Hero camera drift
  gsap.to(".v3-hero img",{scale:1.12,yPercent:3,ease:"none",scrollTrigger:{trigger:".v3-hero",start:"top top",end:"bottom top",scrub:true}});
  gsap.to(".v3-hero .hero-copy",{yPercent:-16,opacity:.15,ease:"none",scrollTrigger:{trigger:".v3-hero",start:"top top",end:"bottom 28%",scrub:true}});

  // FORM — layered unfold + full rotation
  const form=document.querySelector(".v3-form");
  const scene=document.querySelector(".unfold-scene");
  const cards=gsap.utils.toArray(".unfold-card");
  if(form&&scene&&cards.length){
    const s={p:0,dragOffset:0,dragging:false,startX:0,startOffset:0};
    function renderForm(){
      const p=clamp(0,1,s.p-s.dragOffset);
      const orbit=p*Math.PI*2;
      cards.forEach((card,i)=>{
        const phase=orbit+i*(Math.PI*2/cards.length);
        const front=(Math.cos(phase)+1)/2;
        const side=Math.sin(phase);
        const spread=Math.sin(Math.min(p,.42)/.42*Math.PI/2);
        const x=side*(29+spread*19);
        const y=(1-front)*7 + Math.sin(phase*2)*1.2;
        const scale=.70+front*.34;
        const ry=-side*(26+spread*9);
        const rz=side*2;
        gsap.set(card,{
          xPercent:-50+x,yPercent:-50+y,
          rotationY:ry,rotationZ:rz,
          z:(front*280)-125,
          scale,opacity:.35+front*.65,
          filter:`brightness(${.70+front*.31})`,
          zIndex:Math.round(front*100),force3D:true
        });
      });
    }
    renderForm();
    ScrollTrigger.create({
      trigger:form,start:"top top",end:"bottom bottom",scrub:.55,
      onUpdate:self=>{s.p=self.progress;renderForm()},onRefresh:self=>{s.p=self.progress;renderForm()}
    });
    makeDrag(scene,s,renderForm,.85);
  }

  // Erosion split: surfaces open, cross and close into next state.
  gsap.timeline({
    scrollTrigger:{trigger:".v3-erosion",start:"top top",end:"bottom bottom",scrub:.55}
  })
  .fromTo(".split-half.left",{xPercent:0},{xPercent:-42,ease:"none"},0)
  .fromTo(".split-half.right",{xPercent:0},{xPercent:42,ease:"none"},0)
  .fromTo(".split-half.left img",{scale:1.08,xPercent:0},{scale:1.22,xPercent:8,ease:"none"},0)
  .fromTo(".split-half.right img",{scale:1.08,xPercent:0},{scale:1.22,xPercent:-8,ease:"none"},0)
  .fromTo(".split-center-copy",{opacity:0,y:22},{opacity:1,y:0,ease:"power2.out"},.16)
  .to(".split-center-copy",{opacity:0,y:-20,ease:"power2.in"},.78)
  .to(".split-half.left",{xPercent:-7,ease:"none"},.76)
  .to(".split-half.right",{xPercent:7,ease:"none"},.76);

  // Fluid depth stack: front card peels aside, back card moves forward.
  const fluid=document.querySelector(".v3-fluid");
  const depth=document.querySelector(".depth-stack");
  if(fluid&&depth){
    const s={p:0,dragOffset:0,dragging:false,startX:0,startOffset:0};
    const d1=document.querySelector(".depth-card.d1"), d2=document.querySelector(".depth-card.d2");
    function renderFluid(){
      const p=clamp(0,1,s.p-s.dragOffset);
      const t=gsap.parseEase("power2.inOut")(p);
      gsap.set(d1,{
        xPercent:-50-(t*72),yPercent:-50+(t*2),rotationY:-(t*34),rotationZ:-(t*4),
        scale:1-(t*.17),opacity:1-(t*.55),z:220-(t*330),force3D:true
      });
      gsap.set(d2,{
        xPercent:-50+((1-t)*34),yPercent:-50+((1-t)*5),rotationY:((1-t)*21),
        scale:.72+(t*.31),opacity:.48+(t*.52),z:-100+(t*330),force3D:true
      });
    }
    renderFluid();
    ScrollTrigger.create({
      trigger:fluid,start:"top top",end:"bottom bottom",scrub:.55,
      onUpdate:self=>{s.p=self.progress;renderFluid()},onRefresh:self=>{s.p=self.progress;renderFluid()}
    });
    makeDrag(depth,s,renderFluid,.9);
  }

  // Balance — rotate a gallery wall prism through all three objects.
  gsap.fromTo(".gallery-cube",
    {rotationY:0,rotationX:-3},
    {rotationY:-360,rotationX:3,ease:"none",
     scrollTrigger:{trigger:".v3-balance",start:"top top",end:"bottom bottom",scrub:.6}}
  );

  // Tidal — wall -> object -> macro.
  const tidal=gsap.timeline({
    scrollTrigger:{trigger:".v3-tidal",start:"top top",end:"bottom bottom",scrub:.6}
  });
  tidal
    .to(".tidal-room",{scale:1.42,filter:"brightness(.72)",ease:"none"},0)
    .to(".tidal-room",{opacity:0,ease:"power2.inOut"},.34)
    .fromTo(".tidal-object",{opacity:0,scale:.72},{opacity:1,scale:1.08,ease:"none"},.22)
    .to(".tidal-object",{opacity:0,scale:1.72,ease:"none"},.66)
    .fromTo(".tidal-macro",{opacity:0,scale:.82},{opacity:1,scale:1.13,ease:"none"},.57)
    .fromTo(".tidal-copy",{opacity:1},{opacity:.15,ease:"none"},.58);

  // Magnetic element tiles
  document.querySelectorAll(".magnetic").forEach(el=>{
    if(!matchMedia("(pointer:fine)").matches) return;
    el.addEventListener("pointermove",e=>{
      const r=el.getBoundingClientRect();
      const nx=(e.clientX-r.left)/r.width-.5;
      const ny=(e.clientY-r.top)/r.height-.5;
      gsap.to(el,{rotationY:nx*7,rotationX:-ny*7,x:nx*7,y:ny*7,duration:.45,ease:"power3.out",transformPerspective:900});
    });
    el.addEventListener("pointerleave",()=>gsap.to(el,{rotationY:0,rotationX:0,x:0,y:0,duration:.7,ease:"power3.out"}));
  });

  gsap.utils.toArray(".reveal").forEach(el=>{
    gsap.from(el,{y:32,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%"}});
  });
}

const y=document.querySelector("[data-year]");
if(y)y.textContent=new Date().getFullYear();
