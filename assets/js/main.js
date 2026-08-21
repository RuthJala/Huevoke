
(() => {
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const ease=t=>t*t*(3-2*t);
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer=matchMedia("(pointer:fine)").matches;

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
  if(glow && finePointer){
    let tx=-999,ty=-999,cx=-999,cy=-999;
    addEventListener("pointermove",e=>{tx=e.clientX-210;ty=e.clientY-210;glow.style.opacity="1"});
    const tick=()=>{cx=lerp(cx,tx,.14);cy=lerp(cy,ty,.14);glow.style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(tick)};
    tick();
  }

  // Reveal simple
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.animate(
          [{opacity:0,transform:"translateY(26px)"},{opacity:1,transform:"translateY(0)"}],
          {duration:750,easing:"cubic-bezier(.2,.7,.2,1)",fill:"forwards"}
        );
        io.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  qa(".reveal").forEach(el=>{el.style.opacity="0";io.observe(el)});

  if(reduced){
    const y=q("[data-year]"); if(y)y.textContent=new Date().getFullYear(); return;
  }

  const scenes=[];

  function sceneProgress(el){
    const r=el.getBoundingClientRect();
    const total=Math.max(1,el.offsetHeight - innerHeight);
    return clamp((-r.top)/total);
  }

  function addScene(el, render){
    if(!el) return;
    scenes.push({el, render, p:0});
  }

  function bindDrag(surface, state, render, factor=.8){
    if(!surface) return;
    surface.addEventListener("pointerdown",e=>{
      if(e.button!==undefined && e.button!==0) return;
      state.dragging=true;
      state.startX=e.clientX;
      state.startY=e.clientY;
      state.startOffset=state.dragOffset||0;
      surface.classList.add("is-dragging");
      try{surface.setPointerCapture(e.pointerId)}catch(_){}
    });
    surface.addEventListener("pointermove",e=>{
      if(!state.dragging) return;
      const dx=e.clientX-state.startX;
      state.dragOffset=state.startOffset + dx/Math.max(innerWidth,600)*factor;
      render();
    });
    const end=e=>{
      if(!state.dragging) return;
      state.dragging=false;
      surface.classList.remove("is-dragging");
      try{surface.releasePointerCapture(e.pointerId)}catch(_){}
      const from=state.dragOffset||0;
      const start=performance.now();
      const dur=540;
      const animate=now=>{
        const t=clamp((now-start)/dur);
        state.dragOffset=lerp(from,0,ease(t));
        render();
        if(t<1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };
    surface.addEventListener("pointerup",end);
    surface.addEventListener("pointercancel",end);
  }

  // Hero subtle drift
  const hero=q(".v4-hero"), heroImg=q(".v4-hero img"), heroCopy=q(".v4-hero .hero-copy");
  addScene(hero,p=>{
    if(heroImg) heroImg.style.transform=`scale(${lerp(1,1.09,p)}) translate3d(0,${p*2.5}%,0)`;
    if(heroCopy){heroCopy.style.transform=`translate3d(0,${-p*14}%,0)`;heroCopy.style.opacity=String(1-p*.82);}
  });

  // Form contour tunnel
  const tunnelSection=q(".form-tunnel-section");
  const tunnelScene=q("#tunnelScene");
  const sideDisplay=q("#sideDisplay");
  const mainImg=q("#tunnelMainImage");
  const sideImg=q("#tunnelSideImage");
  const tSeries=q("#tunnelSeries");
  const tName=q("#tunnelName");
  const tCode=q("#tunnelCode");
  const tSideName=q("#tunnelSideName");
  const tLink=q("#tunnelLink");
  const back=q(".layer-back"), mid=q(".layer-mid"), front=q(".layer-front");
  const ringA=q(".ring-a"), ringB=q(".ring-b"), ringC=q(".ring-c");
  const focus=q(".tunnel-focus-card");
  const orbit1=q(".orbit-1"), orbit2=q(".orbit-2"), sideWrap=q(".side-image-wrap");

  const tunnelData = [
    {series:"CONTOUR FLOW", name:"Contour Flow I", code:"HV-F01 CF", slug:"contour-flow-01", main:"assets/images/cf1.3.webp", side:"assets/images/cf1.5.webp"},
    {series:"CONTOUR FLOW", name:"Contour Flow II", code:"HV-F02 CF", slug:"contour-flow-02", main:"assets/images/cf2.3.webp", side:"assets/images/cf2.5.webp"},
    {series:"EROSION", name:"Erosion I", code:"HV-F04 ER", slug:"erosion-01", main:"assets/images/e1.3.webp", side:"assets/images/e1.4.webp"},
    {series:"EROSION", name:"Erosion II", code:"HV-F05 ER", slug:"erosion-02", main:"assets/images/e2.4.webp", side:"assets/images/e2.3.webp"},
    {series:"FLUID MOTION", name:"Fluid Motion I", code:"HV-F06 FM", slug:"fluid-motion-01", main:"assets/images/fm1.4.webp", side:"assets/images/fm1.5.webp"},
    {series:"FLUID MOTION", name:"Fluid Motion II", code:"HV-F07 FM", slug:"fluid-motion-02", main:"assets/images/fm2.3.webp", side:"assets/images/fm2.4.webp"},
    {series:"BALANCE", name:"Balance I", code:"HV-F08 BL", slug:"balance-01", main:"assets/images/b1.3.webp", side:"assets/images/b1.4.webp"},
    {series:"TIDAL LANDSCAPE", name:"Tidal Landscape I", code:"HV-F11 TL", slug:"tidal-landscape-01", main:"assets/images/tl1.3.webp", side:"assets/images/tl1.5.webp"}
  ];

  if(tunnelSection && tunnelScene){
    const state={p:0,dragOffset:0,dragging:false,startX:0,startOffset:0,index:-1};

    function setTunnelContent(idx){
      if(idx===state.index) return;
      state.index=idx;
      const item=tunnelData[idx];
      if(!item) return;
      if(mainImg) mainImg.src=item.main;
      if(sideImg) sideImg.src=item.side;
      if(tSeries) tSeries.textContent=item.series;
      if(tName) tName.textContent=item.name;
      if(tCode) tCode.textContent=item.code;
      if(tSideName) tSideName.textContent=item.name;
      if(tLink) tLink.href=`product.html?slug=${item.slug}`;
      if(mainImg) mainImg.alt=item.name;
      if(sideImg) sideImg.alt=item.name;
    }

    function renderTunnel(){
      const p=clamp(state.p - state.dragOffset,0,1);
      const segCount=tunnelData.length;
      const raw=p*(segCount-0.00001);
      const idx=Math.floor(raw);
      const local=raw-idx;
      setTunnelContent(idx);

      // Tunnel progression
      const zTravel=local;
      if(back) back.style.transform=`translate3d(0,0,${lerp(-520,40,zTravel)}px) scale(${lerp(1.36,.74,zTravel)}) rotate(${lerp(0,14,zTravel)}deg)`;
      if(mid) mid.style.transform=`translate3d(0,0,${lerp(-250,90,zTravel)}px) scale(${lerp(1.18,.84,zTravel)}) rotate(${lerp(0,-10,zTravel)}deg)`;
      if(front) front.style.transform=`translate3d(0,0,${lerp(-40,120,zTravel)}px) scale(${lerp(1.00,.90,zTravel)}) rotate(${lerp(0,8,zTravel)}deg)`;

      if(ringA) ringA.style.transform=`translate3d(0,0,0) rotate(${lerp(0,150,zTravel)}deg) scale(${lerp(1,.82,zTravel)})`;
      if(ringB) ringB.style.transform=`translate3d(0,0,0) rotate(${lerp(0,-120,zTravel)}deg) scale(${lerp(1,.88,zTravel)})`;
      if(ringC) ringC.style.transform=`translate3d(0,0,0) rotate(${lerp(0,95,zTravel)}deg) scale(${lerp(1,.94,zTravel)})`;

      // Focus card 3D tunnel motion
      const tiltX=(state.dragOffset||0)*8;
      if(focus){
        focus.style.transform=`translate3d(${lerp(-2,2,zTravel)}%,${lerp(1,-1,zTravel)}%,${lerp(10,90,zTravel)}px) rotateY(${lerp(-10,12,zTravel)+tiltX}deg) rotateX(${lerp(0,-2,zTravel)}deg) scale(${lerp(.92,1.01,zTravel)})`;
        focus.style.opacity=String(lerp(.88,1,zTravel));
      }
      if(mainImg){
        mainImg.style.transform=`scale(${lerp(1.04,1.12,zTravel)}) translate3d(0,0,0)`;
        mainImg.style.filter=`brightness(${lerp(.94,1.02,zTravel)})`;
      }

      // side full image + orbits
      if(sideWrap){
        sideWrap.style.transform=`translate3d(0,0,${lerp(0,34,zTravel)}px) rotateY(${lerp(8,-8,zTravel) - (state.dragOffset||0)*18}deg) rotateX(${(state.dragOffset||0)*8}deg) scale(${lerp(.96,1.01,zTravel)})`;
      }
      if(sideImg){
        sideImg.style.transform=`scale(${lerp(1.03,1.09,zTravel)})`;
      }
      const orbitPhase = p * Math.PI * 2;
      if(orbit1) orbit1.style.transform=`rotate(${orbitPhase*28}deg) scale(${1 + Math.sin(orbitPhase)*.03})`;
      if(orbit2) orbit2.style.transform=`rotate(${-orbitPhase*19}deg) scale(${1 + Math.cos(orbitPhase)*.04})`;

      if(sideDisplay){
        sideDisplay.style.transform=`translate3d(0,${Math.sin(orbitPhase*1.25)*4}px,0)`;
      }
    }

    addScene(tunnelSection,p=>{state.p=p;renderTunnel()});
    bindDrag(tunnelScene,state,renderTunnel,.95);
    bindDrag(sideDisplay,state,renderTunnel,.95);
    renderTunnel();
  }

  // Lotus wall-to-macro dive
  const lotusSection=q(".lotus-dive-section");
  const lRoom=q(".lotus-room"), lObj=q(".lotus-object"), lDetail=q(".lotus-detail"), lMacro=q(".lotus-macro"), lCopy=q(".lotus-copy");
  if(lotusSection){
    const state={p:0,dragOffset:0,dragging:false,startX:0,startOffset:0};
    function renderLotus(){
      const p=clamp(state.p - state.dragOffset*0.2,0,1);

      // Stage 1 room
      const roomOut=clamp((p-.18)/.18);
      if(lRoom){
        lRoom.style.transform=`scale(${lerp(1,1.32,clamp(p/.36))})`;
        lRoom.style.opacity=String(1-roomOut);
        lRoom.style.filter=`brightness(${lerp(1,.72,clamp(p/.34))})`;
      }

      // Stage 2 full object
      const objIn=clamp((p-.14)/.16), objOut=clamp((p-.48)/.18);
      if(lObj){
        lObj.style.opacity=String(objIn*(1-objOut));
        lObj.style.transform=`scale(${lerp(.78,1.18,clamp((p-.14)/.36))})`;
      }

      // Stage 3 detail
      const detailIn=clamp((p-.42)/.16), detailOut=clamp((p-.72)/.14);
      if(lDetail){
        lDetail.style.opacity=String(detailIn*(1-detailOut));
        lDetail.style.transform=`scale(${lerp(.86,1.08,clamp((p-.42)/.32))})`;
      }

      // Stage 4 macro
      const macroIn=clamp((p-.70)/.18);
      if(lMacro){
        lMacro.style.opacity=String(macroIn);
        lMacro.style.transform=`scale(${lerp(.88,1.14,macroIn)})`;
      }

      if(lCopy){
        const move = clamp((p-.55)/.25);
        lCopy.style.opacity=String(1-move*.74);
        lCopy.style.transform=`translate3d(0,${-move*14}px,0)`;
      }
    }
    addScene(lotusSection,p=>{state.p=p;renderLotus()});
    bindDrag(q("#lotusStage"),state,renderLotus,.45);
    renderLotus();
  }

  // Smooth animation engine
  let ticking=false;
  function updateScenes(){
    scenes.forEach(scene=>{
      const target=sceneProgress(scene.el);
      scene.p=lerp(scene.p,target,.15);
      scene.render(scene.p);
    });
    ticking=false;
  }
  function requestTick(){
    if(!ticking){
      ticking=true;
      requestAnimationFrame(updateScenes);
    }
  }
  addEventListener("scroll",requestTick,{passive:true});
  addEventListener("resize",requestTick,{passive:true});
  requestTick();

  // Continue easing after scroll stops
  let lastY=scrollY;
  function settle(){
    const moving=Math.abs(scrollY-lastY)>.1;
    lastY=scrollY;
    if(moving || scenes.some(s=>Math.abs(s.p-sceneProgress(s.el))>.001)) requestTick();
    requestAnimationFrame(settle);
  }
  settle();

  const y=q("[data-year]");
  if(y) y.textContent=new Date().getFullYear();
})();
