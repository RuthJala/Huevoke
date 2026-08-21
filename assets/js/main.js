(() => {
  "use strict";

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const lerp = (a,b,t)=>a+(b-a)*t;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Basic UI */
  const menuButton=$(".menu-button");
  const mobileMenu=$(".mobile-menu");
  if(menuButton&&mobileMenu){
    menuButton.addEventListener("click",()=>{
      const open=mobileMenu.classList.toggle("open");
      document.body.classList.toggle("menu-open",open);
      menuButton.textContent=open?"Close":"Menu";
    });
    $$("a",mobileMenu).forEach(a=>a.addEventListener("click",()=>{
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.textContent="Menu";
    }));
  }

  const year=$("[data-year]");
  if(year) year.textContent=new Date().getFullYear();

  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.animate(
            [{opacity:0,transform:"translateY(18px)"},{opacity:1,transform:"translateY(0)"}],
            {duration:620,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"}
          );
          io.unobserve(e.target);
        }
      });
    },{threshold:.1});
    $$(".reveal").forEach(el=>{el.style.opacity="0";io.observe(el)});
  }

  if(!document.body.classList.contains("home-v5")) return;

  /* ==========================================================
     FORM — scoped lock ONLY when pointer/touch is inside the
     macro gallery zone.
     ========================================================== */

  const formStory=$("#formStory");
  const formStage=$("#formStage");
  const formGalleryZone=$(".form-gallery-zone");
  const galleryWheel=$("#formGalleryWheel");
  const galleryPanels=$$(".gallery-panel");
  const formFullCard=$("#formFullCard");
  const formFullImage=$("#formFullImage");
  const formSeries=$("#formSeries");
  const formName=$("#formObjectName");
  const formFullName=$("#formFullName");
  const formCode=$("#formCode");
  const formView=$("#formViewLink");
  const formCurrent=$("#formCurrent");
  const formBar=$("#formProgressBar");
  const fullAuras=$$(".full-aura");

  const formData=[
    {series:"CONTOUR FLOW",name:"Contour Flow I",code:"HV-F01 CF",slug:"contour-flow-01",side:"assets/images/cf1.5.webp"},
    {series:"CONTOUR FLOW",name:"Contour Flow II",code:"HV-F02 CF",slug:"contour-flow-02",side:"assets/images/cf2.5.webp"},
    {series:"EROSION",name:"Erosion I",code:"HV-F04 ER",slug:"erosion-01",side:"assets/images/e1.4.webp"},
    {series:"EROSION",name:"Erosion II",code:"HV-F05 ER",slug:"erosion-02",side:"assets/images/e2.3.webp"},
    {series:"FLUID MOTION",name:"Fluid Motion I",code:"HV-F06 FM",slug:"fluid-motion-01",side:"assets/images/fm1.5.webp"},
    {series:"FLUID MOTION",name:"Fluid Motion II",code:"HV-F07 FM",slug:"fluid-motion-02",side:"assets/images/fm2.4.webp"},
    {series:"BALANCE",name:"Balance I",code:"HV-F08 BL",slug:"balance-01",side:"assets/images/b1.4.webp"},
    {series:"TIDAL LANDSCAPE",name:"Tidal Landscape I",code:"HV-F11 TL",slug:"tidal-landscape-01",side:"assets/images/tl1.5.webp"}
  ];

  formData.forEach(x=>{const im=new Image();im.decoding="async";im.src=x.side});

  let formCurrentProgress=0;
  let formTargetProgress=0;
  let formLastIndex=-1;
  let pointerX=0,pointerY=0;
  let formPointerInside=false;
  let formDragging=false;
  let dragStartX=0,dragStartY=0,dragStartProgress=0;

  function setFormMeta(index){
    const item=formData[index];
    if(!item) return;

    if(formSeries) formSeries.textContent=item.series;
    if(formName) formName.textContent=item.name;
    if(formFullName) formFullName.textContent=item.name;
    if(formCode) formCode.textContent=item.code;
    if(formView) formView.href="product.html?slug="+item.slug;
    if(formCurrent) formCurrent.textContent=String(index+1).padStart(2,"0");
    if(formBar) formBar.style.width=(((index+1)/formData.length)*100)+"%";

    if(formFullImage && formFullImage.getAttribute("src")!==item.side){
      formFullCard?.animate(
        [
          {opacity:1,transform:"translate3d(0,0,85px) rotateY(-2deg) scale(1.02)"},
          {opacity:.2,transform:"translate3d(18px,0,28px) rotateY(6deg) scale(.98)"},
          {opacity:1,transform:"translate3d(0,0,85px) rotateY(-2deg) scale(1.02)"}
        ],
        {duration:620,easing:"cubic-bezier(.16,1,.3,1)"}
      );
      formFullImage.src=item.side;
      formFullImage.alt=item.name+" full object";
    }
  }

  function renderForm(){
    const stepAngle=360/formData.length;
    const radius=Math.min(innerWidth*.25,470);

    if(galleryWheel){
      galleryWheel.style.transform=
        `translate(-50%,-50%) rotateX(${pointerY*-3.1}deg) rotateY(${pointerX*4.5}deg)`;
    }

    galleryPanels.forEach((panel,i)=>{
      let rel=i-formCurrentProgress;
      while(rel>formData.length/2) rel-=formData.length;
      while(rel<-formData.length/2) rel+=formData.length;

      const angle=rel*stepAngle;
      const rad=angle*Math.PI/180;
      const x=Math.sin(rad)*radius*.72;
      const z=Math.cos(rad)*radius-radius;
      const y=Math.abs(rel)*12;
      const scale=1-Math.min(Math.abs(rel)*.07,.33);
      const opacity=Math.max(.12,1-Math.abs(rel)*.22);
      const blur=Math.max(0,Math.abs(rel)-1)*.8;

      panel.style.transform=
        `translate3d(${x}px,${y}px,${z}px)
         rotateY(${angle*-.86}deg)
         scale(${scale})`;
      panel.style.opacity=opacity;
      panel.style.filter=`blur(${blur}px) saturate(${1-Math.min(Math.abs(rel)*.075,.28)})`;
      panel.style.zIndex=String(100-Math.round(Math.abs(rel)*10));
    });

    const idx=Math.round(formCurrentProgress);
    galleryPanels.forEach((p,i)=>p.classList.toggle("is-active",i===idx));

    if(idx!==formLastIndex){
      formLastIndex=idx;
      setFormMeta(idx);
    }

    if(formFullCard){
      const float=Math.sin(formCurrentProgress*Math.PI)*4;
      formFullCard.style.transform=
        `translate3d(${pointerX*-6}px,${pointerY*-6+float}px,85px)
         rotateX(${pointerY*-3.2}deg)
         rotateY(${pointerX*5-2}deg)
         scale(1.02)`;
    }

    fullAuras.forEach((a,i)=>{
      a.style.transform=`rotate(${formCurrentProgress*(i?22:-16)+pointerX*5}deg) scale(${1+i*.06})`;
    });
  }

  function formSectionFullyUsable(){
    if(!formStory) return false;
    const r=formStory.getBoundingClientRect();
    return r.top<=2 && r.bottom>=innerHeight-2;
  }

  function consumeFormScroll(delta){
    if(!formSectionFullyUsable()) return false;

    const normalized=delta/230;
    const next=formTargetProgress+normalized;

    // At the first / last object, allow the page to continue if the user keeps scrolling outward.
    if(next<0 && delta<0){
      formTargetProgress=0;
      return false;
    }
    if(next>formData.length-1 && delta>0){
      formTargetProgress=formData.length-1;
      return false;
    }

    formTargetProgress=clamp(next,0,formData.length-1);
    return true;
  }

  /* Critical V8 behavior:
     We only prevent default when the wheel originated over .form-gallery-zone.
     Wheel on the left FORM word or right full image = normal page scroll. */
  window.addEventListener("wheel",e=>{
    if(!formPointerInside || !formGalleryZone) return;
    if(!formSectionFullyUsable()) return;

    const delta=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;
    if(consumeFormScroll(delta)){
      e.preventDefault();
      e.stopPropagation();
    }
  },{passive:false,capture:true});

  if(formGalleryZone){
    formGalleryZone.addEventListener("pointerenter",()=>{formPointerInside=true});
    formGalleryZone.addEventListener("pointerleave",()=>{
      if(!formDragging) formPointerInside=false;
    });

    formGalleryZone.addEventListener("pointermove",e=>{
      const r=formGalleryZone.getBoundingClientRect();
      pointerX=clamp((e.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
      pointerY=clamp((e.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;

      if(formDragging){
        const dx=e.clientX-dragStartX;
        const dy=e.clientY-dragStartY;
        const dominant=Math.abs(dx)>Math.abs(dy)?-dx:-dy;
        formTargetProgress=clamp(
          dragStartProgress+dominant/250,
          0,
          formData.length-1
        );
      }
    });

    formGalleryZone.addEventListener("pointerdown",e=>{
      formPointerInside=true;
      formDragging=true;
      dragStartX=e.clientX;
      dragStartY=e.clientY;
      dragStartProgress=formTargetProgress;
      formStory?.classList.add("is-story-dragging");
      try{formGalleryZone.setPointerCapture(e.pointerId)}catch(_){}
    });

    const endFormDrag=e=>{
      if(!formDragging) return;
      formDragging=false;
      formTargetProgress=Math.round(formTargetProgress);
      formStory?.classList.remove("is-story-dragging");
      try{formGalleryZone.releasePointerCapture(e.pointerId)}catch(_){}
    };

    formGalleryZone.addEventListener("pointerup",endFormDrag);
    formGalleryZone.addEventListener("pointercancel",endFormDrag);
  }

  /* ==========================================================
     LOTUS — no scroll lock.
     Hover/touch magnifies card and reveals lb1.5 or lb2.5.
     ========================================================== */

  const lotusStage=$("#lotusStage");
  const magneticGallery=$("#magneticGallery");
  const lotusCards=$$(".lotus-hover-card");
  const lotusPreview=$("#lotusPreview");
  const lotusPreviewImage=$("#lotusPreviewImage");

  const previewMap={
    lb1:"assets/images/lb1.5.webp",
    lb2:"assets/images/lb2.5.webp"
  };

  Object.values(previewMap).forEach(src=>{
    const im=new Image();
    im.decoding="async";
    im.src=src;
  });

  let lotusPointerX=0,lotusPointerY=0;
  let touchActiveCard=null;

  function showLotusPreview(card){
    if(!card || !lotusPreview || !lotusPreviewImage || !magneticGallery) return;
    const group=card.dataset.preview;
    const src=previewMap[group];
    if(!src) return;

    lotusCards.forEach(c=>c.classList.toggle("is-hovered",c===card));
    magneticGallery.classList.add("has-focus");

    if(lotusPreviewImage.getAttribute("src")!==src){
      lotusPreviewImage.src=src;
    }
    lotusPreviewImage.alt=group==="lb1" ? "Lotus Bloom full detail preview" : "Lotus Bloom II full detail preview";
    lotusPreview.classList.add("is-visible");
    lotusPreview.setAttribute("aria-hidden","false");
  }

  function hideLotusPreview(){
    lotusCards.forEach(c=>c.classList.remove("is-hovered"));
    magneticGallery?.classList.remove("has-focus");
    lotusPreview?.classList.remove("is-visible");
    lotusPreview?.setAttribute("aria-hidden","true");
  }

  lotusCards.forEach(card=>{
    card.addEventListener("mouseenter",()=>showLotusPreview(card));
    card.addEventListener("mouseleave",()=>hideLotusPreview());

    card.addEventListener("pointerdown",e=>{
      // touch / pen: one tap activates. Another tap elsewhere clears.
      if(e.pointerType==="touch" || e.pointerType==="pen"){
        e.preventDefault();
        lotusCards.forEach(c=>{
          if(c!==card) c.classList.remove("is-touch-active");
        });
        const turningOn=!card.classList.contains("is-touch-active");
        card.classList.toggle("is-touch-active",turningOn);
        touchActiveCard=turningOn?card:null;
        if(turningOn) showLotusPreview(card);
        else hideLotusPreview();
      }
    });
  });

  document.addEventListener("pointerdown",e=>{
    if(!touchActiveCard) return;
    if(e.target.closest(".lotus-hover-card")) return;
    touchActiveCard.classList.remove("is-touch-active");
    touchActiveCard=null;
    hideLotusPreview();
  });

  if(magneticGallery){
    magneticGallery.addEventListener("pointermove",e=>{
      const r=magneticGallery.getBoundingClientRect();
      lotusPointerX=clamp((e.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
      lotusPointerY=clamp((e.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;

      // very subtle ambient magnetic response when not actively focused
      if(!magneticGallery.classList.contains("has-focus")){
        lotusCards.forEach((card,i)=>{
          const sx=(i%2?-.6:1)*lotusPointerX*(3+i*.5);
          const sy=(i%2?1:-.5)*lotusPointerY*(2.2+i*.35);
          card.style.marginLeft=`${sx}px`;
          card.style.marginTop=`${sy}px`;
        });
      }
    });

    magneticGallery.addEventListener("pointerleave",()=>{
      lotusCards.forEach(card=>{
        card.style.marginLeft="0px";
        card.style.marginTop="0px";
      });
    });
  }

  /* ==========================================================
     Smooth render loop + hero motion
     ========================================================== */

  function animate(){
    const ease=reduced?1:.105;
    if(Math.abs(formTargetProgress-formCurrentProgress)>.0005){
      formCurrentProgress=lerp(formCurrentProgress,formTargetProgress,ease);
    }else{
      formCurrentProgress=formTargetProgress;
    }
    renderForm();
    requestAnimationFrame(animate);
  }

  const hero=$(".v5-hero");
  const heroImage=$(".v5-hero-image");
  const heroCopy=$(".v5-hero .hero-copy");

  function heroMotion(){
    if(!hero||!heroImage) return;
    const r=hero.getBoundingClientRect();
    const p=clamp(-r.top/Math.max(1,hero.offsetHeight));
    heroImage.style.transform=`scale(${1+p*.06}) translate3d(0,${p*1.7}%,0)`;
    if(heroCopy){
      heroCopy.style.transform=`translate3d(0,${-p*6}%,0)`;
      heroCopy.style.opacity=String(1-p*.66);
    }
  }

  addEventListener("scroll",heroMotion,{passive:true});

  setFormMeta(0);
  renderForm();
  heroMotion();
  requestAnimationFrame(animate);
})();
