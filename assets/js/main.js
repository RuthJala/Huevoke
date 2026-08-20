
gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = gsap.utils.clamp;

// menu
const mb=document.querySelector(".menu-button"), mm=document.querySelector(".mobile-menu");
if(mb&&mm){
  mb.onclick=()=>{
    const o=mm.classList.toggle("open");
    document.body.classList.toggle("menu-open",o);
    mb.textContent=o?"Close":"Menu";
  };
  mm.querySelectorAll("a").forEach(a=>a.onclick=()=>{
    mm.classList.remove("open");
    document.body.classList.remove("menu-open");
    mb.textContent="Menu";
  });
}

// pointer light
const glow=document.querySelector(".pointer-glow");
if(glow && matchMedia("(pointer:fine)").matches){
  document.addEventListener("pointermove",e=>{
    gsap.to(glow,{
      x:e.clientX-210,
      y:e.clientY-210,
      opacity:1,
      duration:.65,
      ease:"power3.out",
      overwrite:true
    });
  });
}

// Inject a subtle "drag / swipe" affordance without changing HTML files.
function addInteractionHint(stage){
  if(!stage || stage.querySelector(".interaction-hint")) return;
  const hint=document.createElement("div");
  hint.className="interaction-hint";
  hint.innerHTML="<i></i><span>Scroll · drag · swipe to explore</span>";
  stage.appendChild(hint);
}

if(!reduced){
  // HERO
  gsap.to(".hero img",{
    scale:1.105,
    yPercent:4,
    ease:"none",
    scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}
  });
  gsap.to(".hero-copy",{
    yPercent:-14,
    opacity:.2,
    ease:"none",
    scrollTrigger:{trigger:".hero",start:"top top",end:"bottom 35%",scrub:true}
  });

  /* =========================================================
     FORM — TRUE ORBIT
     All three cards complete one full orbit before the section
     releases. Scroll controls the orbit; mouse/touch dragging
     can explore the same orbit independently.
     ========================================================= */
  const formStory=document.querySelector(".form-story");
  const formStage=document.querySelector(".form-stage");
  const cards=gsap.utils.toArray(".form-card");
  const labels=gsap.utils.toArray(".form-label-item");
  const count=document.querySelector(".form-count");
  const progressLine=document.querySelector(".form-progress span");

  if(formStory && formStage && cards.length){
    addInteractionHint(formStage);

    const state={
      scrollP:0,
      dragOffset:0,
      dragging:false,
      startX:0,
      startOffset:0,
      active:-1
    };

    function renderForm(){
      // dragOffset can add/subtract turns. Wrap keeps orbit continuous.
      const p=state.scrollP + state.dragOffset;
      let maxDepth=-Infinity, active=0;

      cards.forEach((card,i)=>{
        const a=(p*Math.PI*2) + (i*Math.PI*2/cards.length);
        const depth=(Math.cos(a)+1)/2; // 1 = front
        const side=Math.sin(a);

        if(depth>maxDepth){maxDepth=depth;active=i}

        // Elliptical orbit + perspective. Cards never leave the viewport.
        const xPct=-50 + side*67;
        const yPct=-50 + (1-depth)*8;
        const scale=.66 + depth*.36;
        const rotY=-side*28;
        const rotZ=side*2.3;
        const opacity=.35 + depth*.65;
        const bright=.70 + depth*.30;

        gsap.set(card,{
          xPercent:xPct,
          yPercent:yPct,
          scale,
          rotationY:rotY,
          rotationZ:rotZ,
          z:(depth*250)-120,
          opacity,
          filter:`brightness(${bright})`,
          zIndex:Math.round(depth*100)+2,
          force3D:true
        });

        const img=card.querySelector("img");
        if(img){
          gsap.set(img,{
            xPercent:-side*2.4,
            scale:1.025 + depth*.012,
            force3D:true
          });
        }
      });

      // show current object copy only when the front card changes
      if(active!==state.active){
        state.active=active;
        labels.forEach((l,j)=>{
          gsap.to(l,{
            autoAlpha:j===active?1:0,
            y:j===active?0:12,
            duration:.32,
            ease:"power2.out",
            overwrite:true
          });
        });
        if(count) count.textContent=String(active+1).padStart(2,"0");
      }

      if(progressLine){
        // Progress follows page scroll only, so user still understands section completion.
        gsap.set(progressLine,{height:`${Math.round(state.scrollP*100)}%`});
      }
    }

    // Initial positioning before scroll
    gsap.set(labels,{autoAlpha:0,y:12});
    gsap.set(labels[0],{autoAlpha:1,y:0});
    renderForm();

    ScrollTrigger.create({
      trigger:formStory,
      start:"top top",
      end:"bottom bottom",
      scrub:.55,
      invalidateOnRefresh:true,
      onUpdate:self=>{
        state.scrollP=self.progress; // exactly 0 -> 1 = one complete orbit
        renderForm();
      },
      onRefresh:self=>{
        state.scrollP=self.progress;
        renderForm();
      }
    });

    // Mouse / touch drag.
    formStage.addEventListener("pointerdown",e=>{
      if(e.button!==undefined && e.button!==0) return;
      state.dragging=true;
      state.startX=e.clientX;
      state.startOffset=state.dragOffset;
      formStage.classList.add("is-dragging");
      try{formStage.setPointerCapture(e.pointerId)}catch(_){}
    });

    formStage.addEventListener("pointermove",e=>{
      if(!state.dragging) return;
      const dx=e.clientX-state.startX;
      // About one viewport-width drag = ~2/3 orbit.
      state.dragOffset=state.startOffset + (dx/Math.max(innerWidth,600))*.68;
      renderForm();
    });

    function endFormDrag(e){
      if(!state.dragging) return;
      state.dragging=false;
      formStage.classList.remove("is-dragging");
      try{formStage.releasePointerCapture(e.pointerId)}catch(_){}

      // Snap whichever card is nearest the front.
      const effective=state.scrollP+state.dragOffset;
      const snapped=Math.round(effective*cards.length)/cards.length;
      const targetOffset=snapped-state.scrollP;
      gsap.to(state,{
        dragOffset:targetOffset,
        duration:.62,
        ease:"power3.out",
        onUpdate:renderForm,
        overwrite:true
      });
    }
    formStage.addEventListener("pointerup",endFormDrag);
    formStage.addEventListener("pointercancel",endFormDrag);
  }

  /* =========================================================
     FORM SERIES RAIL
     Full horizontal journey completes across the entire pinned
     section. It can also be dragged/swiped.
     ========================================================= */
  const rail=document.querySelector(".collection-rail");
  const railStage=document.querySelector(".rail-stage");
  const track=document.querySelector(".rail-track");

  if(rail && railStage && track){
    addInteractionHint(railStage);

    const cardsRail=gsap.utils.toArray(".rail-card");
    const rstate={
      scrollP:0,
      dragOffset:0,
      dragging:false,
      startX:0,
      startOffset:0
    };

    let travel=0;

    function measureRail(){
      travel=Math.max(0,track.scrollWidth-innerWidth);
    }

    function effectiveRailP(){
      return clamp(0,1,rstate.scrollP+rstate.dragOffset);
    }

    function renderRail(){
      const p=effectiveRailP();
      gsap.set(track,{x:-travel*p,force3D:true});

      // small independent image parallax for depth, tied to track position
      cardsRail.forEach((card,i)=>{
        const img=card.querySelector("img");
        if(!img) return;
        const rect=card.getBoundingClientRect();
        const center=(rect.left+rect.width/2)/innerWidth;
        const local=clamp(-1,1,(center-.5)*1.2);
        gsap.set(img,{xPercent:-local*3.5,force3D:true});
      });
    }

    measureRail();
    renderRail();

    ScrollTrigger.create({
      trigger:rail,
      start:"top top",
      end:"bottom bottom",
      scrub:.55,
      invalidateOnRefresh:true,
      onRefresh:self=>{
        measureRail();
        rstate.scrollP=self.progress;
        renderRail();
      },
      onUpdate:self=>{
        rstate.scrollP=self.progress; // 0 -> 1 = first card to last card
        renderRail();
      }
    });

    window.addEventListener("resize",()=>{
      measureRail();
      renderRail();
    },{passive:true});

    railStage.addEventListener("pointerdown",e=>{
      if(e.button!==undefined && e.button!==0) return;
      rstate.dragging=true;
      rstate.startX=e.clientX;
      rstate.startOffset=rstate.dragOffset;
      railStage.classList.add("is-dragging");
      try{railStage.setPointerCapture(e.pointerId)}catch(_){}
    });

    railStage.addEventListener("pointermove",e=>{
      if(!rstate.dragging || !travel) return;
      const dx=e.clientX-rstate.startX;
      // Swipe left -> advance; swipe right -> go back.
      rstate.dragOffset=rstate.startOffset-(dx/travel);
      renderRail();
    });

    function endRailDrag(e){
      if(!rstate.dragging) return;
      rstate.dragging=false;
      railStage.classList.remove("is-dragging");
      try{railStage.releasePointerCapture(e.pointerId)}catch(_){}

      const current=effectiveRailP();
      // Snap to one of the visible series cards.
      const steps=Math.max(cardsRail.length-1,1);
      const snapped=Math.round(current*steps)/steps;
      const targetOffset=snapped-rstate.scrollP;

      gsap.to(rstate,{
        dragOffset:targetOffset,
        duration:.65,
        ease:"power3.out",
        onUpdate:renderRail,
        overwrite:true
      });
    }

    railStage.addEventListener("pointerup",endRailDrag);
    railStage.addEventListener("pointercancel",endRailDrag);
  }

  // reveals
  gsap.utils.toArray(".reveal").forEach(el=>{
    gsap.from(el,{
      y:34,
      opacity:0,
      duration:1,
      ease:"power3.out",
      scrollTrigger:{trigger:el,start:"top 88%"}
    });
  });

  gsap.utils.toArray(".product-tile").forEach((el,i)=>{
    gsap.from(el,{
      y:28,
      opacity:0,
      duration:.85,
      delay:(i%2)*.06,
      ease:"power3.out",
      scrollTrigger:{trigger:el,start:"top 90%"}
    });
  });
}

const y=document.querySelector("[data-year]");
if(y)y.textContent=new Date().getFullYear();
