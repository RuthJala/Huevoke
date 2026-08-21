(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (v,a=0,b=1) => Math.max(a, Math.min(b,v));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Common UI ---------------- */
  const menuButton = $(".menu-button");
  const mobileMenu = $(".mobile-menu");
  if(menuButton && mobileMenu){
    menuButton.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      menuButton.textContent = open ? "Close" : "Menu";
    });
    $$("a", mobileMenu).forEach(a => a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.textContent = "Menu";
    }));
  }

  const year = $("[data-year]");
  if(year) year.textContent = new Date().getFullYear();

  if("IntersectionObserver" in window){
    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.animate(
            [{opacity:0,transform:"translateY(22px)"},{opacity:1,transform:"translateY(0)"}],
            {duration:650,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"}
          );
          revealIO.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    $$(".reveal").forEach(el => { el.style.opacity="0"; revealIO.observe(el); });
  }

  if(!document.body.classList.contains("home-v5")) return;

  /* ---------------- DOM ---------------- */
  const formStory = $("#formStory");
  const lotusStory = $("#lotusStory");
  const formStage = $(".form-pin-stage");
  const lotusStage = $(".lotus-pin-stage");

  const detailImg = $("#formDetailImage");
  const fullImg = $("#formFullImage");
  const formSeries = $("#formSeries");
  const formName = $("#formObjectName");
  const formFullName = $("#formFullName");
  const formCode = $("#formCode");
  const formView = $("#formViewLink");
  const formCurrent = $("#formCurrent");
  const formBar = $("#formProgressBar");
  const detailCard = $(".detail-card");
  const fullCard = $(".full-card");
  const rings = $$(".depth-ring");
  const orbits = $$(".orbit");

  const lotusFrames = $$(".lotus-frame");
  const lotusCurrent = $("#lotusCurrent");
  const lotusBar = $("#lotusProgressBar");

  /* ---------------- Exact FORM mapping ---------------- */
  const formData = [
    {series:"CONTOUR FLOW", name:"Contour Flow I", code:"HV-F01 CF", slug:"contour-flow-01", detail:"assets/images/cf1.3.webp", side:"assets/images/cf1.5.webp"},
    {series:"CONTOUR FLOW", name:"Contour Flow II", code:"HV-F02 CF", slug:"contour-flow-02", detail:"assets/images/cf2.3.webp", side:"assets/images/cf2.5.webp"},
    {series:"EROSION", name:"Erosion I", code:"HV-F04 ER", slug:"erosion-01", detail:"assets/images/e1.3.webp", side:"assets/images/e1.4.webp"},
    {series:"EROSION", name:"Erosion II", code:"HV-F05 ER", slug:"erosion-02", detail:"assets/images/e2.4.webp", side:"assets/images/e2.3.webp"},
    {series:"FLUID MOTION", name:"Fluid Motion I", code:"HV-F06 FM", slug:"fluid-motion-01", detail:"assets/images/fm1.4.webp", side:"assets/images/fm1.5.webp"},
    {series:"FLUID MOTION", name:"Fluid Motion II", code:"HV-F07 FM", slug:"fluid-motion-02", detail:"assets/images/fm2.3.webp", side:"assets/images/fm2.4.webp"},
    {series:"BALANCE", name:"Balance I", code:"HV-F08 BL", slug:"balance-01", detail:"assets/images/b1.3.webp", side:"assets/images/b1.4.webp"},
    {series:"TIDAL LANDSCAPE", name:"Tidal Landscape I", code:"HV-F11 TL", slug:"tidal-landscape-01", detail:"assets/images/tl1.3.webp", side:"assets/images/tl1.5.webp"}
  ];

  const lotusData = [
    "assets/images/lb1.3.webp",
    "assets/images/lb1.4.webp",
    "assets/images/lb1.2.webp",
    "assets/images/lb1.5.webp"
  ];

  /* ---------------- Preload ---------------- */
  [...formData.flatMap(x => [x.detail,x.side]), ...lotusData].forEach(src => {
    const im = new Image();
    im.decoding = "async";
    im.src = src;
  });

  /* ---------------- Visual renderers ---------------- */
  let formIndex = 0;
  let lotusIndex = 0;
  let formTiltX = 0, formTiltY = 0;
  let lotusTiltX = 0, lotusTiltY = 0;
  let transitionTimer = null;

  function animateFormChange(){
    if(reduced) return;
    detailCard?.classList.add("story-changing");
    fullCard?.classList.add("story-changing");
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      detailCard?.classList.remove("story-changing");
      fullCard?.classList.remove("story-changing");
    }, 280);
  }

  function setFormIndex(index, animate=true){
    index = Math.max(0, Math.min(formData.length-1, index));
    const changed = index !== formIndex;
    formIndex = index;
    const item = formData[index];

    if(changed && animate) animateFormChange();

    if(detailImg){
      detailImg.style.opacity = ".22";
      detailImg.src = item.detail;
      detailImg.onload = () => detailImg.style.opacity = "1";
    }
    if(fullImg){
      fullImg.style.opacity = ".22";
      fullImg.src = item.side;
      fullImg.onload = () => fullImg.style.opacity = "1";
    }

    if(formSeries) formSeries.textContent = item.series;
    if(formName) formName.textContent = item.name;
    if(formFullName) formFullName.textContent = item.name;
    if(formCode) formCode.textContent = item.code;
    if(formView) formView.href = "product.html?slug=" + item.slug;
    if(formCurrent) formCurrent.textContent = String(index+1).padStart(2,"0");
    if(formBar) formBar.style.width = (((index+1)/formData.length)*100) + "%";

    renderForm3D();
  }

  function renderForm3D(){
    const p = formData.length <= 1 ? 0 : formIndex/(formData.length-1);
    const pulse = .5 + .5*Math.sin((formIndex+1)*1.35);

    if(detailCard){
      detailCard.style.transform =
        `translate3d(${formTiltX*5}px,${formTiltY*4}px,${34 + pulse*42}px)
         rotateY(${(p-.5)*12 + formTiltX*8}deg)
         rotateX(${-formTiltY*5}deg)
         scale(${1.008 + pulse*.018})`;
    }
    if(fullCard){
      fullCard.style.transform =
        `translate3d(${formTiltX*-6}px,${formTiltY*4}px,${55 + pulse*58}px)
         rotateY(${-(p-.5)*10 + formTiltX*9}deg)
         rotateX(${-formTiltY*4}deg)
         scale(${1.012 + pulse*.022})`;
    }
    rings.forEach((ring,i) => {
      const sign = i%2 ? -1 : 1;
      ring.style.transform = `rotate(${sign*(formIndex*31+i*17)+formTiltX*10}deg) translateZ(${i*26-40}px)`;
    });
    orbits.forEach((orbit,i) => {
      const sign = i%2 ? -1 : 1;
      orbit.style.transform = `rotate(${sign*(formIndex*24+i*21)+formTiltY*9}deg)`;
    });
  }

  function setLotusIndex(index, animate=true){
    index = Math.max(0, Math.min(lotusData.length-1, index));
    lotusIndex = index;

    lotusFrames.forEach((frame,i) => {
      const active = i === lotusIndex;
      const before = i < lotusIndex;
      frame.style.opacity = active ? "1" : "0";
      const depth = active ? 0 : (before ? 160 : -160);
      const scale = active ? 1.08 + lotusIndex*.075 : (before ? 1.26 : .94);
      frame.style.transform =
        `translate3d(${lotusTiltX*(i+1)*2}px,${lotusTiltY*(i+1)*1.5}px,${depth}px)
         rotateY(${lotusTiltX*6}deg)
         rotateX(${-lotusTiltY*4}deg)
         scale(${scale})`;
    });

    if(lotusCurrent) lotusCurrent.textContent = String(index+1).padStart(2,"0");
    if(lotusBar) lotusBar.style.width = (((index+1)/lotusData.length)*100) + "%";
  }

  /* ---------------- True story lock engine ---------------- */
  let activeStory = null;       // "form" | "lotus" | null
  let wheelBank = 0;
  let releaseBank = 0;
  let lastStepAt = 0;
  let snapInProgress = false;

  const WHEEL_STEP = 78;
  const RELEASE_STEP = 135;
  const STEP_COOLDOWN = 260;

  function sectionFor(type){ return type === "form" ? formStory : lotusStory; }
  function stageFor(type){ return type === "form" ? formStage : lotusStage; }
  function maxIndex(type){ return type === "form" ? formData.length-1 : lotusData.length-1; }
  function currentIndex(type){ return type === "form" ? formIndex : lotusIndex; }

  function setIndex(type, n){
    if(type === "form") setFormIndex(n, true);
    else setLotusIndex(n, true);
  }

  function exactTop(el){
    return Math.round(el.getBoundingClientRect().top + scrollY);
  }

  function lockStory(type, direction="down"){
    const section = sectionFor(type);
    if(!section) return;
    activeStory = type;
    wheelBank = 0;
    releaseBank = 0;
    document.documentElement.classList.add("story-input-locked");
    formStory?.classList.toggle("is-story-active", type==="form");
    lotusStory?.classList.toggle("is-story-active", type==="lotus");

    // Exact viewport alignment: no partial top/bottom blank area.
    snapInProgress = true;
    window.scrollTo({top:exactTop(section), behavior:"auto"});
    requestAnimationFrame(() => { snapInProgress = false; });

    // Entering from below should start at last item; from above at first/current.
    if(type==="form" && direction==="up" && formIndex===0) setFormIndex(formData.length-1, false);
    if(type==="lotus" && direction==="up" && lotusIndex===0) setLotusIndex(lotusData.length-1, false);
  }

  function unlockStory(){
    activeStory = null;
    wheelBank = 0;
    releaseBank = 0;
    document.documentElement.classList.remove("story-input-locked");
    formStory?.classList.remove("is-story-active","is-story-dragging");
    lotusStory?.classList.remove("is-story-active","is-story-dragging");
  }

  function releaseToNext(type){
    const section = sectionFor(type);
    unlockStory();
    if(!section) return;
    const next = section.nextElementSibling;
    if(next){
      window.scrollTo({top:exactTop(next), behavior:"smooth"});
    }
  }

  function releaseToPrevious(type){
    const section = sectionFor(type);
    unlockStory();
    if(!section) return;
    const prev = section.previousElementSibling;
    if(prev){
      // place previous section's bottom at viewport bottom
      const target = exactTop(prev) + prev.offsetHeight - innerHeight;
      window.scrollTo({top:Math.max(0,target), behavior:"smooth"});
    }
  }

  function stepStory(direction){
    if(!activeStory) return;
    const now = performance.now();
    if(now-lastStepAt < STEP_COOLDOWN) return;

    const idx = currentIndex(activeStory);
    const max = maxIndex(activeStory);

    if(direction > 0){
      if(idx < max){
        setIndex(activeStory, idx+1);
        lastStepAt = now;
        releaseBank = 0;
      }else{
        releaseBank += WHEEL_STEP;
        if(releaseBank >= RELEASE_STEP){
          const type = activeStory;
          lastStepAt = now;
          releaseToNext(type);
        }
      }
    }else{
      if(idx > 0){
        setIndex(activeStory, idx-1);
        lastStepAt = now;
        releaseBank = 0;
      }else{
        releaseBank += WHEEL_STEP;
        if(releaseBank >= RELEASE_STEP){
          const type = activeStory;
          lastStepAt = now;
          releaseToPrevious(type);
        }
      }
    }
  }

  function consumeDelta(delta){
    if(!activeStory) return;
    const sign = Math.sign(delta);
    if(!sign) return;

    if(Math.sign(wheelBank) !== sign) wheelBank = 0;
    wheelBank += delta;

    if(Math.abs(wheelBank) >= WHEEL_STEP){
      stepStory(sign);
      wheelBank = 0;
    }
  }

  /* Wheel:
     - when story active: page DOES NOT scroll.
     - wheel only changes internal objects.
     - after final object + another gesture: release to next section.
  */
  window.addEventListener("wheel", e => {
    if(activeStory){
      e.preventDefault();
      e.stopPropagation();
      // keep section exactly aligned even if browser has tiny momentum
      const section = sectionFor(activeStory);
      if(section && Math.abs(section.getBoundingClientRect().top) > 1){
        window.scrollTo({top:exactTop(section), behavior:"auto"});
      }
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      consumeDelta(delta);
      return;
    }

    // Pre-capture a story as it comes into the viewport.
    const dir = Math.sign(e.deltaY);
    if(!dir) return;

    const candidates = [
      ["form", formStory],
      ["lotus", lotusStory]
    ];

    for(const [type, section] of candidates){
      if(!section) continue;
      const r = section.getBoundingClientRect();

      if(dir > 0 && r.top >= -4 && r.top <= innerHeight*.30){
        e.preventDefault();
        lockStory(type, "down");
        return;
      }
      if(dir < 0 && r.bottom <= innerHeight+4 && r.bottom >= innerHeight*.70){
        e.preventDefault();
        lockStory(type, "up");
        return;
      }
    }
  }, {passive:false, capture:true});

  /* Scroll fallback:
     Touch momentum / keyboard scrolling can bring a story almost exactly
     into place. Once it fills most of the viewport, snap and lock it.
  */
  let scrollCheckTimer = null;
  window.addEventListener("scroll", () => {
    if(activeStory || snapInProgress) return;
    clearTimeout(scrollCheckTimer);
    scrollCheckTimer = setTimeout(() => {
      const candidates = [["form",formStory],["lotus",lotusStory]];
      for(const [type,section] of candidates){
        if(!section) continue;
        const r = section.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom,innerHeight)-Math.max(r.top,0));
        const ratio = visible/Math.max(1,innerHeight);
        if(ratio > .90 && Math.abs(r.top) < innerHeight*.12){
          lockStory(type, "down");
          break;
        }
      }
    }, 80);
  }, {passive:true});

  /* Touch: while active, prevent native page movement and convert
     vertical OR horizontal swipe to story step. */
  let touchStartX=0, touchStartY=0, touchLastX=0, touchLastY=0, touching=false;

  document.addEventListener("touchstart", e => {
    if(!activeStory || !e.touches[0]) return;
    touching = true;
    touchStartX = touchLastX = e.touches[0].clientX;
    touchStartY = touchLastY = e.touches[0].clientY;
    sectionFor(activeStory)?.classList.add("is-story-dragging");
  }, {passive:true});

  document.addEventListener("touchmove", e => {
    if(!activeStory || !touching || !e.touches[0]) return;
    e.preventDefault();
    e.stopPropagation();

    const t = e.touches[0];
    const dx = t.clientX-touchLastX;
    const dy = t.clientY-touchLastY;
    touchLastX=t.clientX; touchLastY=t.clientY;

    // visual parallax during touch
    const stage = stageFor(activeStory);
    if(stage){
      const r = stage.getBoundingClientRect();
      const nx = clamp((t.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
      const ny = clamp((t.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;
      if(activeStory==="form"){ formTiltX=nx; formTiltY=ny; renderForm3D(); }
      else { lotusTiltX=nx; lotusTiltY=ny; setLotusIndex(lotusIndex,false); }
    }

    // don't step repeatedly during move; release gesture determines one clean step.
  }, {passive:false, capture:true});

  document.addEventListener("touchend", e => {
    if(!activeStory || !touching) return;
    touching=false;
    sectionFor(activeStory)?.classList.remove("is-story-dragging");

    const dx = touchLastX-touchStartX;
    const dy = touchLastY-touchStartY;
    const dominant = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
    if(Math.abs(dominant) > 38){
      // swipe up/left => next, down/right => previous
      stepStory(dominant < 0 ? 1 : -1);
    }
  }, {passive:true});

  /* Mouse / pen drag anywhere on stage. */
  function attachDrag(stage, type){
    if(!stage) return;
    let down=false, sx=0, sy=0, lx=0, ly=0;

    stage.addEventListener("pointerdown", e => {
      if(activeStory !== type) return;
      down=true; sx=lx=e.clientX; sy=ly=e.clientY;
      stage.setPointerCapture?.(e.pointerId);
      sectionFor(type)?.classList.add("is-story-dragging");
    });

    stage.addEventListener("pointermove", e => {
      const r = stage.getBoundingClientRect();
      const nx = clamp((e.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
      const ny = clamp((e.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;

      if(type==="form"){
        formTiltX=nx; formTiltY=ny; renderForm3D();
      }else{
        lotusTiltX=nx; lotusTiltY=ny; setLotusIndex(lotusIndex,false);
      }

      if(down){ lx=e.clientX; ly=e.clientY; }
    });

    stage.addEventListener("pointerup", e => {
      if(!down) return;
      down=false;
      sectionFor(type)?.classList.remove("is-story-dragging");

      const dx=lx-sx, dy=ly-sy;
      const dominant=Math.abs(dx)>=Math.abs(dy) ? dx : dy;
      if(Math.abs(dominant)>36){
        // right/down = previous; left/up = next
        stepStory(dominant < 0 ? 1 : -1);
      }
      try{stage.releasePointerCapture?.(e.pointerId)}catch(_){}
    });

    stage.addEventListener("pointercancel", () => {
      down=false;
      sectionFor(type)?.classList.remove("is-story-dragging");
    });

    stage.addEventListener("pointerleave", () => {
      if(!down){
        if(type==="form"){formTiltX=0;formTiltY=0;renderForm3D();}
        else {lotusTiltX=0;lotusTiltY=0;setLotusIndex(lotusIndex,false);}
      }
    });
  }

  attachDrag(formStage,"form");
  attachDrag(lotusStage,"lotus");

  /* Keyboard support while active. */
  window.addEventListener("keydown", e => {
    if(!activeStory) return;
    if(["ArrowDown","ArrowRight","PageDown"," "].includes(e.key)){
      e.preventDefault(); stepStory(1);
    }else if(["ArrowUp","ArrowLeft","PageUp"].includes(e.key)){
      e.preventDefault(); stepStory(-1);
    }else if(e.key==="Escape"){
      unlockStory();
    }
  });

  /* Hero parallax only. */
  const hero = $(".v5-hero");
  const heroImage = $(".v5-hero-image");
  const heroCopy = $(".v5-hero .hero-copy");
  function renderHero(){
    if(!hero || !heroImage) return;
    const r=hero.getBoundingClientRect();
    const p=clamp(-r.top/Math.max(1,hero.offsetHeight));
    heroImage.style.transform=`scale(${1+p*.07}) translate3d(0,${p*2.2}%,0)`;
    if(heroCopy){
      heroCopy.style.transform=`translate3d(0,${-p*8}%,0)`;
      heroCopy.style.opacity=String(1-p*.72);
    }
  }
  addEventListener("scroll",renderHero,{passive:true});

  setFormIndex(0,false);
  setLotusIndex(0,false);
  renderHero();
})();
