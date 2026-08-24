(() => {
  "use strict";

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const lerp = (a,b,t)=>a+(b-a)*t;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Common UI */
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
            [{opacity:0,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],
            {duration:620,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"}
          );
          io.unobserve(e.target);
        }
      });
    },{threshold:.1});
    $$(".reveal").forEach(el=>{el.style.opacity="0";io.observe(el)});
  }

  const isHome=document.body.classList.contains("home-v5");
  const isCollections=document.body.classList.contains("collections-page");

  if(isCollections){
    const storySection=$("#collectionsStory");
    const storyStage=$("#collectionsStoryStage");
    if(storySection && storyStage){
      const heroProducts=[
        {series:"FORM / CONTOUR FLOW", name:"Contour Flow I", code:"HV-F01 CF", thickness:"40 mm", sizes:'24" × 36" / 30" × 48"', slug:"contour-flow-01", main:"assets/images/cf1.2.webp", installed:"assets/images/cf1.1.webp", details:["assets/images/cf1.3.webp","assets/images/cf1.4.webp","assets/images/cf1.5.webp"], desc:"A restrained composition of broad organic planes. Contour Flow I uses soft neutral relief to create movement through shadow rather than ornament."},
        {series:"FORM / EROSION", name:"Erosion I", code:"HV-F04 ER", thickness:"50 mm", sizes:'24" × 36" / 30" × 48"', slug:"erosion-01", main:"assets/images/e1.1.webp", installed:"assets/images/e1.2.webp", details:["assets/images/e1.3.webp","assets/images/e1.4.webp"], desc:"An irregular silhouette shaped as if softened by time. Warm terracotta appears within muted sand tones to create a grounded focal point."},
        {series:"FORM / FLUID MOTION", name:"Fluid Motion I", code:"HV-F06 FM", thickness:"50 mm", sizes:'24" × 36" / 30" × 48"', slug:"fluid-motion-01", main:"assets/images/fm1.1.webp", installed:"assets/images/fm1.2.webp", details:["assets/images/fm1.3.webp","assets/images/fm1.5.webp"], desc:"A vertical wave of layered colour and relief. Fluid Motion I combines sage, sand and slate tones in one continuous sculptural gesture."},
        {series:"FORM / BALANCE", name:"Balance I", code:"HV-F08 BL", thickness:"50 mm", sizes:'18" × 18" / 24" × 24" / 36" × 36"', slug:"balance-01", main:"assets/images/b1.1.webp", installed:"assets/images/b1.2.webp", details:["assets/images/b1.3.webp","assets/images/b1.4.webp"], desc:"Two contrasting masses held within a circular boundary. Balance I explores symmetry without becoming literal."},
        {series:"FORM / TIDAL LANDSCAPE", name:"Tidal Landscape I", code:"HV-F11 TL", thickness:"40 mm", sizes:'24" × 36" / 30" × 48"', slug:"tidal-landscape-01", main:"assets/images/tl1.1.webp", installed:"assets/images/tl1.2.webp", details:["assets/images/tl1.3.webp","assets/images/tl1.5.webp"], desc:"A framed vertical landscape built from layered contours in mineral blue, soft sage and warm sand."},
        {series:"ELEMENTS / LOTUS BLOOM", name:"Lotus Bloom", code:"HV-E01 LB", thickness:"30 mm", sizes:'18" × 18" / 24" × 24" / 36" × 36"', slug:"lotus-bloom", main:"assets/images/lb2.1.png", installed:"assets/images/lb2.2.png", details:["assets/images/lb2.3.png","assets/images/lb2.4.png","assets/images/lb2.5.png"], desc:"A familiar lotus reduced to layered geometry, warm muted colour and sculptural depth."}
      ];
      const previewAsset=src=>location.hostname==="127.0.0.1"?"https://raw.githubusercontent.com/RuthJala/Huevoke/main/"+src:src;
      heroProducts.forEach(item=>[item.main,item.installed,...item.details].forEach(src=>{const im=new Image(); im.decoding='async'; im.src=previewAsset(src);}));
      const spatialScene=$("#spatialScene");
      const storySeries=$("#storySeries");
      const storyTitle=$("#storyTitle");
      const storyDesc=$("#storyDesc");
      const storyCode=$("#storyCode");
      const storyThickness=$("#storyThickness");
      const storySizes=$("#storySizes");
      const storyViewButton=$("#storyViewButton");
      const collectionCurrent=$("#collectionCurrent");
      const collectionTotal=$("#collectionTotal");
      const detailImgs=[$("#detailImg0"),$("#detailImg1"),$("#detailImg2")];
      const detailLinks=[$("#detailLink0"),$("#detailLink1"),$("#detailLink2")];
      if(collectionTotal) collectionTotal.textContent=String(heroProducts.length).padStart(2,"0");
      const objects=heroProducts.map((item,index)=>{
        const link=document.createElement("a");
        link.className="spatial-object";
        link.href="product.html?slug="+item.slug;
        link.setAttribute("aria-label","View "+item.name);
        link.innerHTML='<span class="spatial-object-shadow"></span><span class="spatial-main-plane"><img src="'+previewAsset(item.main)+'" alt="'+item.name+' product view"></span><span class="spatial-secondary plane-installed"><img src="'+previewAsset(item.installed)+'" alt="'+item.name+' installed view"></span><span class="spatial-secondary plane-detail"><img src="'+previewAsset(item.details[0])+'" alt="'+item.name+' detail"></span>';
        link.dataset.index=String(index);
        spatialScene?.appendChild(link);
        return link;
      });
      let progress=0, target=0, lastIndex=-1, px=0, py=0;
      function setHero(index){
        const item=heroProducts[index]; if(!item) return;
        if(collectionCurrent) collectionCurrent.textContent=String(index+1).padStart(2,'0');
        if(storySeries) storySeries.textContent=item.series;
        if(storyTitle) storyTitle.textContent=item.name;
        if(storyDesc) storyDesc.textContent=item.desc;
        if(storyCode) storyCode.textContent=item.code;
        if(storyThickness) storyThickness.textContent=item.thickness;
        if(storySizes) storySizes.textContent=item.sizes;
        const href='product.html?slug='+item.slug;
        if(storyViewButton) storyViewButton.href=href;
        detailImgs.forEach((img,i)=>{if(img){img.src=item.details[i]||item.main;img.alt=item.name+' detail '+(i+1)}});
        detailLinks.forEach(link=>{if(link) link.href=href});
      }
      function updateTargetFromScroll(){
        const rect=storySection.getBoundingClientRect();
        const total=Math.max(1, storySection.offsetHeight-innerHeight);
        const traveled=clamp(-rect.top,0,total);
        target=(traveled/total)*(heroProducts.length-1);
      }
      function renderCollectionStory(){
        updateTargetFromScroll();
        progress=lerp(progress,target,reduced?1:.12);
        const idx=Math.round(progress);
        if(idx!==lastIndex){lastIndex=idx;setHero(idx)}
        objects.forEach((object,index)=>{
          const distance=index-progress;
          const passed=distance<0;
          const abs=Math.abs(distance);
          const x=passed ? distance*46-abs*105 : distance*32+Math.sin(index*1.8)*34;
          const y=(passed ? abs*42 : abs*18)+Math.sin((progress+index)*1.7)*8;
          const z=passed ? 115-abs*760 : 115-abs*920;
          const rotateY=passed ? -8+abs*24 : 8-distance*19;
          const rotateX=py*-3+(passed ? abs*4 : distance*-3);
          const rotateZ=(index%2 ? -1 : 1)*(passed ? abs*5 : distance*3);
          const opacity=clamp(1-abs*.58,0,1);
          object.style.transform=`translate3d(calc(-50% + ${x+px*9}px),calc(-50% + ${y+py*7}px),${z}px) rotateX(${rotateX}deg) rotateY(${rotateY+px*3}deg) rotateZ(${rotateZ}deg)`;
          object.style.opacity=String(opacity);
          object.style.filter=`blur(${Math.max(0,abs-0.65)*2.2}px) saturate(${1-Math.min(abs*.1,.28)})`;
          object.style.zIndex=String(1000-Math.round(abs*100));
          object.style.pointerEvents=abs<.42 ? "auto" : "none";
          object.classList.toggle("is-active",abs<.42);
        });
        requestAnimationFrame(renderCollectionStory);
      }
      storyStage.addEventListener('pointermove',e=>{
        const r=storyStage.getBoundingClientRect();
        px=clamp((e.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
        py=clamp((e.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;
      });
      storyStage.addEventListener('pointerleave',()=>{px=lerp(px,0,.4);py=lerp(py,0,.4)});
      setHero(0);
      requestAnimationFrame(renderCollectionStory);
    }
  }

  if(!isHome) return;

  const formStory=$("#formStory");
  const lotusStory=$("#lotusStory");
  const formStage=$("#formStage");
  const lotusStage=$("#lotusStage");

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

  const magneticGallery=$("#magneticGallery");
  const magneticCards=$$(".magnetic-card");
  const lotusCurrent=$("#lotusCurrent");
  const lotusBar=$("#lotusProgressBar");

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

  formData.forEach(x=>{const im=new Image(); im.decoding="async"; im.src=x.side});

  /* --------------------------------------------------------
     Smooth progress engine.
     progress is fractional, not discrete. Wheel/drag changes
     target continuously; RAF eases current toward target.
     -------------------------------------------------------- */
  const stories={
    form:{section:formStory,stage:formStage,max:formData.length-1,current:0,target:0,lastIndex:-1},
    lotus:{section:lotusStory,stage:lotusStage,max:3,current:0,target:0,lastIndex:-1}
  };

  let active=null;
  let pointerX=0,pointerY=0;
  let dragging=false,dragStartX=0,dragStartY=0,dragStartTarget=0;
  let releaseEnergy=0;
  let snapBusy=false;

  function exactTop(el){return Math.round(el.getBoundingClientRect().top+scrollY)}

  function activeIndex(s){return Math.max(0,Math.min(s.max,Math.round(s.current)))}

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
          {opacity:.15,transform:"translate3d(22px,0,20px) rotateY(7deg) scale(.975)"},
          {opacity:1,transform:"translate3d(0,0,85px) rotateY(-2deg) scale(1.02)"}
        ],
        {duration:660,easing:"cubic-bezier(.2,.8,.2,1)"}
      );
      formFullImage.src=item.side;
      formFullImage.alt=item.name+" full object";
    }
  }

  function renderForm(){
    const s=stories.form;
    const stepAngle=360/formData.length;
    const baseAngle=-s.current*stepAngle;
    const radius=Math.min(innerWidth*.25,470);
    const tiltX=pointerY*-3.5;
    const tiltY=pointerX*5.5;

    if(galleryWheel){
      galleryWheel.style.transform=
        `translate(-50%,-50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    galleryPanels.forEach((panel,i)=>{
      let rel=i-s.current;
      while(rel>formData.length/2) rel-=formData.length;
      while(rel<-formData.length/2) rel+=formData.length;

      const angle=rel*stepAngle;
      const rad=angle*Math.PI/180;
      const x=Math.sin(rad)*radius*.72;
      const z=Math.cos(rad)*radius-radius;
      const y=Math.abs(rel)*13;
      const scale=1-Math.min(Math.abs(rel)*.075,.34);
      const opacity=Math.max(.12,1-Math.abs(rel)*.23);
      const blur=Math.max(0,Math.abs(rel)-1)*.85;

      panel.style.transform=
        `translate3d(${x}px,${y}px,${z}px)
         rotateY(${angle*-0.86}deg)
         scale(${scale})`;
      panel.style.opacity=opacity;
      panel.style.filter=`blur(${blur}px) saturate(${1-Math.min(Math.abs(rel)*.08,.3)})`;
      panel.style.zIndex=String(100-Math.round(Math.abs(rel)*10));
    });

    const idx=activeIndex(s);
    galleryPanels.forEach((p,i)=>p.classList.toggle("is-active",i===idx));

    if(idx!==s.lastIndex){
      s.lastIndex=idx;
      setFormMeta(idx);
    }

    const fullFloat=Math.sin(s.current*Math.PI)*6;
    if(formFullCard){
      formFullCard.style.transform=
        `translate3d(${pointerX*-8}px,${pointerY*-7+fullFloat}px,85px)
         rotateX(${pointerY*-4}deg)
         rotateY(${pointerX*6-2}deg)
         scale(1.025)`;
    }
    fullAuras.forEach((a,i)=>{
      a.style.transform=`rotate(${s.current*(i?26:-19)+pointerX*6}deg) scale(${1+i*.06})`;
    });
  }

  function renderLotus(){
    const s=stories.lotus;
    const phase=s.current;
    const idx=activeIndex(s);

    const layouts=[
      [
        [-5,-1,115,-4,1.06], [18,-12,-50,7,.86], [20,21,-115,-8,.80], [-12,25,-35,5,.88]
      ],
      [
        [-17,-6,-30,-7,.88], [3,-4,130,4,1.06], [23,19,-55,-6,.84], [-4,26,-100,7,.82]
      ],
      [
        [-17,-9,-95,-7,.82], [18,-9,-35,5,.87], [5,7,140,-3,1.07], [-13,24,-55,7,.86]
      ],
      [
        [-19,-10,-105,-8,.80], [20,-10,-75,6,.82], [18,20,-35,-5,.86], [-2,5,150,2,1.09]
      ]
    ];

    magneticCards.forEach((card,i)=>{
      const from=Math.floor(phase);
      const to=Math.min(3,Math.ceil(phase));
      const t=phase-from;
      const A=layouts[from][i];
      const B=layouts[to][i];

      const x=lerp(A[0],B[0],t);
      const y=lerp(A[1],B[1],t);
      const z=lerp(A[2],B[2],t);
      const rot=lerp(A[3],B[3],t);
      const sc=lerp(A[4],B[4],t);

      const magneticStrength=i===idx ? 13 : 6;
      const mx=pointerX*magneticStrength*(i%2?-.55:1);
      const my=pointerY*magneticStrength*(i%2?1:-.6);

      card.style.transform=
        `translate3d(calc(${x}% + ${mx}px),calc(${y}% + ${my}px),${z}px)
         rotateX(${pointerY*(i===idx?-4:-1.6)}deg)
         rotateY(${pointerX*(i===idx?6:2.2)}deg)
         rotateZ(${rot}deg)
         scale(${sc})`;

      const distance=Math.abs(i-phase);
      card.style.opacity=String(Math.max(.34,1-distance*.16));
      card.style.filter=`brightness(${1-Math.min(distance*.035,.1)})`;
      card.style.zIndex=String(100+Math.round(z));
      card.classList.toggle("is-active",i===idx);
    });

    if(idx!==s.lastIndex){
      s.lastIndex=idx;
      if(lotusCurrent) lotusCurrent.textContent=String(idx+1).padStart(2,"0");
      if(lotusBar) lotusBar.style.width=(((idx+1)/4)*100)+"%";
    }
  }

  function render(){
    const ease=active ? .115 : .14;
    for(const key of ["form","lotus"]){
      const s=stories[key];
      if(Math.abs(s.target-s.current)>.0005){
        s.current=lerp(s.current,s.target,reduced?1:ease);
      }else s.current=s.target;
    }

    renderForm();
    renderLotus();
    requestAnimationFrame(render);
  }

  function lock(type,direction="down"){
    if(!stories[type]?.section) return;
    active=type;
    releaseEnergy=0;
    const s=stories[type];

    if(direction==="down" && s.target>=s.max-.05){
      s.current=s.target=0;
    }
    if(direction==="up" && s.target<=.05){
      s.current=s.target=s.max;
    }

    document.documentElement.classList.add("story-input-locked");
    formStory?.classList.toggle("is-story-active",type==="form");
    lotusStory?.classList.toggle("is-story-active",type==="lotus");

    snapBusy=true;
    scrollTo({top:exactTop(s.section),behavior:"auto"});
    requestAnimationFrame(()=>snapBusy=false);
  }

  function unlock(){
    active=null;
    dragging=false;
    releaseEnergy=0;
    document.documentElement.classList.remove("story-input-locked");
    formStory?.classList.remove("is-story-active","is-story-dragging");
    lotusStory?.classList.remove("is-story-active","is-story-dragging");
  }

  function releaseForward(type){
    const sec=stories[type].section;
    unlock();
    const next=sec?.nextElementSibling;
    if(next) scrollTo({top:exactTop(next),behavior:"smooth"});
  }

  function releaseBackward(type){
    const sec=stories[type].section;
    unlock();
    const prev=sec?.previousElementSibling;
    if(prev){
      const target=exactTop(prev)+prev.offsetHeight-innerHeight;
      scrollTo({top:Math.max(0,target),behavior:"smooth"});
    }
  }

  function inputDelta(delta){
    if(!active) return;
    const s=stories[active];
    const normalized=delta/250; // smoother and slower than one-card-per-wheel-tick
    const next=s.target+normalized;

    if(next<0){
      s.target=0;
      releaseEnergy+=Math.abs(normalized);
      if(releaseEnergy>.72) releaseBackward(active);
      return;
    }
    if(next>s.max){
      s.target=s.max;
      releaseEnergy+=Math.abs(normalized);
      if(releaseEnergy>.72) releaseForward(active);
      return;
    }

    releaseEnergy=0;
    s.target=clamp(next,0,s.max);
  }

  window.addEventListener("wheel",e=>{
    if(active){
      e.preventDefault();
      e.stopPropagation();
      const s=stories[active];
      if(Math.abs(s.section.getBoundingClientRect().top)>1){
        scrollTo({top:exactTop(s.section),behavior:"auto"});
      }
      const delta=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;
      inputDelta(delta);
      return;
    }

    const dir=Math.sign(e.deltaY);
    if(!dir) return;

    for(const type of ["form","lotus"]){
      const sec=stories[type].section;
      if(!sec) continue;
      const r=sec.getBoundingClientRect();

      if(dir>0 && r.top>=-3 && r.top<=innerHeight*.28){
        e.preventDefault();
        lock(type,"down");
        return;
      }
      if(dir<0 && r.bottom<=innerHeight+3 && r.bottom>=innerHeight*.72){
        e.preventDefault();
        lock(type,"up");
        return;
      }
    }
  },{passive:false,capture:true});

  /* Mouse / pen drag */
  function pointerDown(e,type){
    if(active!==type) return;
    dragging=true;
    dragStartX=e.clientX;
    dragStartY=e.clientY;
    dragStartTarget=stories[type].target;
    stories[type].section.classList.add("is-story-dragging");
    try{stories[type].stage.setPointerCapture(e.pointerId)}catch(_){}
  }

  function pointerMove(e,type){
    const stage=stories[type].stage;
    if(!stage) return;
    const r=stage.getBoundingClientRect();
    pointerX=clamp((e.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
    pointerY=clamp((e.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;

    if(dragging && active===type){
      const dx=e.clientX-dragStartX;
      const dy=e.clientY-dragStartY;
      const dominant=Math.abs(dx)>Math.abs(dy)?-dx:-dy;
      const sensitivity=type==="form" ? 260 : 300;
      stories[type].target=clamp(dragStartTarget+dominant/sensitivity,0,stories[type].max);
    }
  }

  function pointerUp(e,type){
    if(active!==type || !dragging) return;
    dragging=false;
    stories[type].section.classList.remove("is-story-dragging");
    // settle elegantly to nearest artwork
    stories[type].target=Math.round(stories[type].target);
    try{stories[type].stage.releasePointerCapture(e.pointerId)}catch(_){}
  }

  for(const type of ["form","lotus"]){
    const stage=stories[type].stage;
    if(!stage) continue;
    stage.addEventListener("pointerdown",e=>pointerDown(e,type));
    stage.addEventListener("pointermove",e=>pointerMove(e,type));
    stage.addEventListener("pointerup",e=>pointerUp(e,type));
    stage.addEventListener("pointercancel",e=>pointerUp(e,type));
    stage.addEventListener("pointerleave",()=>{
      if(!dragging){
        pointerX=lerp(pointerX,0,.35);
        pointerY=lerp(pointerY,0,.35);
      }
    });
  }

  /* Touch is handled through Pointer Events on modern mobile browsers.
     touch-action:none is enabled only while a story is active by CSS. */

  window.addEventListener("keydown",e=>{
    if(!active) return;
    if(["ArrowDown","ArrowRight","PageDown"," "].includes(e.key)){
      e.preventDefault();
      const s=stories[active];
      if(s.target>=s.max-.01) releaseForward(active);
      else s.target=Math.min(s.max,Math.round(s.target)+1);
    }else if(["ArrowUp","ArrowLeft","PageUp"].includes(e.key)){
      e.preventDefault();
      const s=stories[active];
      if(s.target<=.01) releaseBackward(active);
      else s.target=Math.max(0,Math.round(s.target)-1);
    }else if(e.key==="Escape"){
      unlock();
    }
  });

  /* Snap-to-story fallback for touch/native scroll */
  let checkTimer;
  addEventListener("scroll",()=>{
    if(active||snapBusy) return;
    clearTimeout(checkTimer);
    checkTimer=setTimeout(()=>{
      for(const type of ["form","lotus"]){
        const sec=stories[type].section;
        if(!sec) continue;
        const r=sec.getBoundingClientRect();
        const visible=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0));
        if(visible/innerHeight>.92 && Math.abs(r.top)<innerHeight*.1){
          lock(type,"down");
          break;
        }
      }
    },70);
  },{passive:true});

  /* hero parallax */
  const hero=$(".v5-hero");
  const heroImage=$(".v5-hero-image");
  const heroCopy=$(".v5-hero .hero-copy");
  function heroMotion(){
    if(!hero||!heroImage) return;
    const r=hero.getBoundingClientRect();
    const p=clamp(-r.top/Math.max(1,hero.offsetHeight));
    heroImage.style.transform=`scale(${1+p*.065}) translate3d(0,${p*2}%,0)`;
    if(heroCopy){
      heroCopy.style.transform=`translate3d(0,${-p*7}%,0)`;
      heroCopy.style.opacity=String(1-p*.7);
    }
  }
  addEventListener("scroll",heroMotion,{passive:true});

  setFormMeta(0);
  renderForm();
  renderLotus();
  heroMotion();
  requestAnimationFrame(render);
})();

