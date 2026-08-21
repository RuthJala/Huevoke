(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (v,a=0,b=1) => Math.max(a, Math.min(b,v));
  const lerp = (a,b,t) => a + (b-a)*t;
  const smooth = t => t*t*(3-2*t);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------------------------------
  // menu + common UI
  // ---------------------------------------------------
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

  // Generic reveal for non-home and CTA
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries => {
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.animate(
            [{opacity:0,transform:"translateY(24px)"},{opacity:1,transform:"translateY(0)"}],
            {duration:700,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"}
          );
          io.unobserve(entry.target);
        }
      }
    }, {threshold:.12});
    $$(".reveal").forEach(el => { el.style.opacity = "0"; io.observe(el); });
  }

  if(!document.body.classList.contains("home-v5")) return;

  // ---------------------------------------------------
  // robust section progress
  // ---------------------------------------------------
  function progressFor(section){
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - innerHeight);
    return clamp((-rect.top) / travel);
  }

  const formStory = $("#formStory");
  const lotusStory = $("#lotusStory");

  // FORM data: exactly requested mappings
  const formData = [
    {series:"CONTOUR FLOW", name:"Contour Flow I",       code:"HV-F01 CF", slug:"contour-flow-01",  detail:"assets/images/cf1.3.webp", side:"assets/images/cf1.5.webp"},
    {series:"CONTOUR FLOW", name:"Contour Flow II",      code:"HV-F02 CF", slug:"contour-flow-02",  detail:"assets/images/cf2.3.webp", side:"assets/images/cf2.5.webp"},
    {series:"EROSION",      name:"Erosion I",            code:"HV-F04 ER", slug:"erosion-01",       detail:"assets/images/e1.3.webp",  side:"assets/images/e1.4.webp"},
    {series:"EROSION",      name:"Erosion II",           code:"HV-F05 ER", slug:"erosion-02",       detail:"assets/images/e2.4.webp",  side:"assets/images/e2.3.webp"},
    {series:"FLUID MOTION", name:"Fluid Motion I",       code:"HV-F06 FM", slug:"fluid-motion-01",  detail:"assets/images/fm1.4.webp", side:"assets/images/fm1.5.webp"},
    {series:"FLUID MOTION", name:"Fluid Motion II",      code:"HV-F07 FM", slug:"fluid-motion-02",  detail:"assets/images/fm2.3.webp", side:"assets/images/fm2.4.webp"},
    {series:"BALANCE",      name:"Balance I",            code:"HV-F08 BL", slug:"balance-01",       detail:"assets/images/b1.3.webp",  side:"assets/images/b1.4.webp"},
    {series:"TIDAL LANDSCAPE",name:"Tidal Landscape I",  code:"HV-F11 TL", slug:"tidal-landscape-01",detail:"assets/images/tl1.3.webp",side:"assets/images/tl1.5.webp"}
  ];

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
  const detailSurface = $("#formDetailSurface");
  const fullSurface = $("#formFullSurface");

  let formTarget = 0;
  let formRendered = 0;
  let formIndex = -1;
  let pointerTiltX = 0;
  let pointerTiltY = 0;
  let pointerZoom = 0;

  function setFormItem(index){
    index = Math.max(0, Math.min(formData.length-1, index));
    if(index === formIndex) return;
    formIndex = index;
    const item = formData[index];

    // immediate visibility first; then soft fade prevents blank frames
    [detailImg, fullImg].forEach(img => { if(img) img.style.opacity = ".35"; });

    if(detailImg){
      detailImg.src = item.detail;
      detailImg.alt = item.name + " detail";
      detailImg.onload = () => { detailImg.style.opacity = "1"; };
    }
    if(fullImg){
      fullImg.src = item.side;
      fullImg.alt = item.name + " full object";
      fullImg.onload = () => { fullImg.style.opacity = "1"; };
    }

    if(formSeries) formSeries.textContent = item.series;
    if(formName) formName.textContent = item.name;
    if(formFullName) formFullName.textContent = item.name;
    if(formCode) formCode.textContent = item.code;
    if(formView) formView.href = "product.html?slug=" + item.slug;
    if(formCurrent) formCurrent.textContent = String(index+1).padStart(2,"0");
  }

  function renderForm(){
    if(!formStory) return;

    const p = clamp(formRendered);
    const scaled = p * formData.length;
    const index = Math.min(formData.length-1, Math.floor(scaled));
    const local = index === formData.length-1 ? clamp((p - (formData.length-1)/formData.length) * formData.length) : scaled - index;
    setFormItem(index);

    if(formBar) formBar.style.width = (p*100).toFixed(2) + "%";

    // Tunnel / forward-backward depth during each object step
    const pulse = Math.sin(local * Math.PI);
    const direction = local - .5;

    if(detailCard){
      detailCard.style.transform =
        `translate3d(${pointerTiltX*4}px,${pointerTiltY*3}px,${24 + pulse*86 + pointerZoom*28}px)
         rotateY(${direction*15 + pointerTiltX*7}deg)
         rotateX(${-pointerTiltY*5}deg)
         scale(${1 + pulse*.045 + pointerZoom*.025})`;
    }
    if(detailImg){
      detailImg.style.transform = `scale(${1.035 + pulse*.075}) translate3d(${pointerTiltX*-3}%,${pointerTiltY*-2}%,0)`;
    }

    if(fullCard){
      fullCard.style.transform =
        `translate3d(${pointerTiltX*-6}px,${pointerTiltY*3}px,${12 + pulse*105 + pointerZoom*35}px)
         rotateY(${-direction*11 + pointerTiltX*8}deg)
         rotateX(${-pointerTiltY*4}deg)
         scale(${1 + pulse*.035 + pointerZoom*.02})`;
    }
    if(fullImg){
      fullImg.style.transform = `scale(${1.025 + pulse*.055}) translate3d(${pointerTiltX*2}%,${pointerTiltY*-1.5}%,0)`;
    }

    rings.forEach((ring,i) => {
      const spin = (p*360*(i%2?-.65:.48)) + pointerTiltX*18;
      const scale = 1 + pulse*(.08+i*.025);
      ring.style.transform = `rotate(${spin}deg) scale(${scale}) translateZ(${(-80+i*34)+pulse*48}px)`;
    });
    orbits.forEach((orbit,i) => {
      const spin = p*360*(i%2?-0.42:0.31) + pointerTiltY*16;
      orbit.style.transform = `rotate(${spin}deg) scale(${1 + pulse*(.035+i*.012)})`;
    });
  }

  // ---------------------------------------------------
  // Lotus
  // ---------------------------------------------------
  const lotusFrames = $$(".lotus-frame");
  const lotusCurrent = $("#lotusCurrent");
  const lotusBar = $("#lotusProgressBar");
  const lotusSurface = $("#lotusSurface");

  let lotusTarget = 0;
  let lotusRendered = 0;
  let lotusTiltX = 0;
  let lotusTiltY = 0;
  let lotusZoom = 0;

  function renderLotus(){
    if(!lotusStory) return;
    const p = clamp(lotusRendered);
    const n = lotusFrames.length;
    const scaled = p * n;
    const active = Math.min(n-1, Math.floor(scaled));
    const local = active === n-1 ? clamp((p - (n-1)/n) * n) : scaled - active;

    lotusFrames.forEach((frame,i) => {
      const distance = i - scaled;
      const opacity = clamp(1 - Math.abs(distance)*1.5);
      // last frame must remain visible at p=1
      const forced = (p >= .999 && i === n-1) ? 1 : opacity;
      frame.style.opacity = String(forced);

      const zoomBase = 1.02 + i*.10;
      const z = (i-active)*-180 + local*180;
      const scale = zoomBase + (active===i ? local*.20 : 0) + lotusZoom*.035;
      frame.style.transform =
        `translate3d(${lotusTiltX*(i+1)*2}px,${lotusTiltY*(i+1)*1.5}px,${z}px)
         rotateY(${lotusTiltX*6}deg)
         rotateX(${-lotusTiltY*4}deg)
         scale(${scale})`;
      const img = $("img", frame);
      if(img) img.style.transform = `scale(${1.02 + (active===i ? local*.12 : 0)})`;
    });

    if(lotusCurrent) lotusCurrent.textContent = String(active+1).padStart(2,"0");
    if(lotusBar) lotusBar.style.width = (p*100).toFixed(2) + "%";
  }

  // ---------------------------------------------------
  // Pointer interactions.
  // Mouse move = 3D tilt/zoom.
  // Drag/swipe = physically moves scroll position through pinned sequence.
  // ---------------------------------------------------
  function attachInteractive(surface, section, type){
    if(!surface || !section) return;

    let dragging = false;
    let startX = 0, startY = 0, startScroll = 0;

    surface.addEventListener("pointerenter", () => surface.classList.add("is-hovering"));
    surface.addEventListener("pointerleave", () => {
      if(!dragging){
        surface.classList.remove("is-hovering");
        if(type==="form"){ pointerTiltX=0; pointerTiltY=0; pointerZoom=0; }
        else { lotusTiltX=0; lotusTiltY=0; lotusZoom=0; }
      }
    });

    surface.addEventListener("pointermove", e => {
      const r = surface.getBoundingClientRect();
      const nx = clamp((e.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
      const ny = clamp((e.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;

      if(type==="form"){
        pointerTiltX = nx;
        pointerTiltY = ny;
        pointerZoom = 1-Math.min(1,Math.hypot(nx,ny));
      } else {
        lotusTiltX = nx;
        lotusTiltY = ny;
        lotusZoom = 1-Math.min(1,Math.hypot(nx,ny));
      }

      if(dragging){
        // both horizontal and vertical gestures move timeline
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const dominant = Math.abs(dy) > Math.abs(dx) ? -dy : -dx;
        const multiplier = type==="form" ? 4.4 : 3.5;
        scrollTo({top:startScroll + dominant*multiplier, behavior:"auto"});
      }
    }, {passive:true});

    surface.addEventListener("pointerdown", e => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startScroll = scrollY;
      surface.classList.add("is-dragging");
      try{ surface.setPointerCapture(e.pointerId); }catch(_){}
    });

    const end = e => {
      dragging = false;
      surface.classList.remove("is-dragging");
      try{ surface.releasePointerCapture(e.pointerId); }catch(_){}
    };
    surface.addEventListener("pointerup", end);
    surface.addEventListener("pointercancel", end);

    // Wheel over the interactive surface is naturally used by sticky story;
    // stop horizontal browser navigation / overscroll gestures from hijacking it.
    surface.addEventListener("wheel", e => {
      if(Math.abs(e.deltaX) > Math.abs(e.deltaY)){
        e.preventDefault();
        scrollBy({top:e.deltaX*1.35, behavior:"auto"});
      }
    }, {passive:false});
  }

  attachInteractive(detailSurface, formStory, "form");
  attachInteractive(fullSurface, formStory, "form");
  attachInteractive(lotusSurface, lotusStory, "lotus");

  // ---------------------------------------------------
  // Rendering loop. Sticky stages are driven by actual page scroll.
  // This means the page visually remains inside each section until its
  // entire sequence is complete, then releases to the next section.
  // ---------------------------------------------------
  function updateTargets(){
    if(formStory) formTarget = progressFor(formStory);
    if(lotusStory) lotusTarget = progressFor(lotusStory);
  }

  function animate(){
    updateTargets();

    // slight smoothing without delaying section release too much
    formRendered = reduced ? formTarget : lerp(formRendered, formTarget, .20);
    lotusRendered = reduced ? lotusTarget : lerp(lotusRendered, lotusTarget, .20);

    renderForm();
    renderLotus();

    requestAnimationFrame(animate);
  }

  // Hero parallax
  const hero = $(".v5-hero");
  const heroImage = $(".v5-hero-image");
  const heroCopy = $(".v5-hero .hero-copy");
  function renderHero(){
    if(!hero || !heroImage) return;
    const r = hero.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1,hero.offsetHeight));
    heroImage.style.transform = `scale(${1+p*.08}) translate3d(0,${p*2.5}%,0)`;
    if(heroCopy){
      heroCopy.style.transform = `translate3d(0,${-p*10}%,0)`;
      heroCopy.style.opacity = String(1-p*.75);
    }
  }
  addEventListener("scroll", renderHero, {passive:true});
  renderHero();

  setFormItem(0);
  renderForm();
  renderLotus();
  animate();
})();
