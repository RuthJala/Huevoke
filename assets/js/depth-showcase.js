(() => {
  "use strict";
  const section=document.querySelector("#depthShowcase");
  const stage=document.querySelector("#depthStage");
  const model=document.querySelector("#lotusModel");
  if(!section||!stage||!model) return;
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current=0,target=0,pointerX=0,pointerY=0,targetX=0,targetY=0,raf=0;
  function readScroll(){
    const rect=section.getBoundingClientRect();
    target=clamp(-rect.top/Math.max(1,rect.height-innerHeight));
    if(!raf) raf=requestAnimationFrame(render);
  }
  function render(){
    raf=0;
    current+=(target-current)*.075;
    pointerX+=(targetX-pointerX)*.06;
    pointerY+=(targetY-pointerY)*.06;
    const p=reduced?0.56:current;
    const reveal=clamp((p-.58)/.18);
    const orbit=-24+(p*205)+(pointerX*8);
    const polar=78-(Math.sin(p*Math.PI)*12)+(pointerY*5);
    const radius=2.95-(Math.sin(p*Math.PI)*.48);
    stage.style.setProperty("--lotus-progress",p.toFixed(4));
    stage.style.setProperty("--lotus-scale",(0.8+Math.sin(p*Math.PI)*.22+p*.1).toFixed(4));
    stage.style.setProperty("--lotus-lift",`${(-4+Math.sin(p*Math.PI*2)*3).toFixed(2)}vh`);
    stage.style.setProperty("--lotus-roll",`${(-3+p*6+pointerX*1.5).toFixed(2)}deg`);
    stage.style.setProperty("--lotus-x",`${(pointerX*12).toFixed(2)}px`);
    stage.style.setProperty("--lotus-y",`${(pointerY*9).toFixed(2)}px`);
    stage.style.setProperty("--lotus-copy",reveal.toFixed(3));
    model.setAttribute("camera-orbit",`${orbit.toFixed(2)}deg ${polar.toFixed(2)}deg ${radius.toFixed(3)}m`);
    if(Math.abs(target-current)>.0005||Math.abs(targetX-pointerX)>.002||Math.abs(targetY-pointerY)>.002) raf=requestAnimationFrame(render);
  }
  stage.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2;if(!raf)raf=requestAnimationFrame(render)});
  stage.addEventListener("pointerleave",()=>{targetX=0;targetY=0;if(!raf)raf=requestAnimationFrame(render)});
  addEventListener("scroll",readScroll,{passive:true});
  addEventListener("resize",readScroll,{passive:true});
  model.addEventListener("load",()=>model.classList.add("is-loaded"),{once:true});
  readScroll();
})();

