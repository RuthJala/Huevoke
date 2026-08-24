(() => {
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const section=$("#depthShowcase");
  const cf=$("#depthCF");
  const lotus=$("#depthLotus");
  const bar=$("#depthProgressBar");
  const cfModel=$("#cfModel");
  const lotusModel=$("#lotusModel");
  if(!section) return;

  let px=0,py=0,targetX=0,targetY=0;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;

  function update(){
    const r=section.getBoundingClientRect();
    const visible=clamp((innerHeight-r.top)/(innerHeight+r.height),0,1);
    if(bar) bar.style.width=(visible*100)+"%";

    px+=(targetX-px)*.065;
    py+=(targetY-py)*.065;

    if(!reduced){
      if(cf) cf.style.transform=`translate3d(${px*10}px,${(-4+visible*7)+py*5}vh,0) rotate(${(-1.2+visible*2.4)+px*.45}deg)`;
      if(lotus) lotus.style.transform=`translate3d(${px*-8}px,${(5-visible*8)+py*-4}vh,0) rotate(${(1.1-visible*2.1)-px*.35}deg)`;
      if(cfModel) cfModel.setAttribute("camera-orbit",`${-18+visible*34+px*5}deg ${78+py*2}deg 2.9m`);
      if(lotusModel) lotusModel.setAttribute("camera-orbit",`${20-visible*38-px*4}deg ${76-py*2}deg 3m`);
    }
    requestAnimationFrame(update);
  }

  section.addEventListener("pointermove",e=>{
    const r=section.getBoundingClientRect();
    targetX=clamp((e.clientX-r.left)/Math.max(1,r.width),0,1)*2-1;
    targetY=clamp((e.clientY-r.top)/Math.max(1,r.height),0,1)*2-1;
  });
  section.addEventListener("pointerleave",()=>{targetX=0;targetY=0});
  requestAnimationFrame(update);
})();