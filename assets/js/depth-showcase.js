(() => {
  "use strict";
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeStory(options){
    const section=document.querySelector(options.section);
    const stage=document.querySelector(options.stage);
    const model=document.querySelector(options.model);
    if(!section||!stage||!model)return null;
    let current=0,target=0,pointerX=0,pointerY=0,targetX=0,targetY=0,raf=0,modelReady=false;

    if(options.animation){
      model.addEventListener("load",()=>{
        model.animationName=options.animation;
        model.pause?.();
        model.currentTime=0;
        modelReady=true;
        schedule();
      },{once:true});
    }else{
      model.addEventListener("load",()=>{modelReady=true;schedule()},{once:true});
    }

    function readScroll(){
      const rect=section.getBoundingClientRect();
      target=clamp(-rect.top/Math.max(1,rect.height-innerHeight));
      schedule();
    }
    function schedule(){if(!raf)raf=requestAnimationFrame(render)}
    function render(){
      raf=0;
      current+=(target-current)*.075;
      pointerX+=(targetX-pointerX)*.06;
      pointerY+=(targetY-pointerY)*.06;
      const p=reduced ? .56 : current;
      const reveal=clamp((p-.62)/.16);
      const orbit=options.orbitStart+(p*options.orbitRange)+(pointerX*7);
      const polar=options.polar-(Math.sin(p*Math.PI)*options.polarLift)+(pointerY*4);
      const radius=options.radius-(Math.sin(p*Math.PI)*options.radiusLift);
      stage.style.setProperty(options.progressVar,p.toFixed(4));
      stage.style.setProperty(options.scaleVar,(options.scale+Math.sin(p*Math.PI)*.1+p*.03).toFixed(4));
      stage.style.setProperty(options.liftVar,`${(-2+Math.sin(p*Math.PI*2)*1.8).toFixed(2)}vh`);
      stage.style.setProperty(options.rollVar,`${(-1.5+p*3+pointerX).toFixed(2)}deg`);
      stage.style.setProperty(options.xVar,`${(pointerX*10).toFixed(2)}px`);
      stage.style.setProperty(options.yVar,`${(pointerY*7).toFixed(2)}px`);
      stage.style.setProperty(options.copyVar,reveal.toFixed(3));
      model.setAttribute("camera-orbit",`${orbit.toFixed(2)}deg ${polar.toFixed(2)}deg ${radius.toFixed(2)}%`);
      if(options.animation&&modelReady){
        model.currentTime=(p*2);
      }
      if(Math.abs(target-current)>.0005||Math.abs(targetX-pointerX)>.002||Math.abs(targetY-pointerY)>.002)schedule();
    }

    stage.addEventListener("pointermove",event=>{
      const rect=stage.getBoundingClientRect();
      targetX=((event.clientX-rect.left)/rect.width-.5)*2;
      targetY=((event.clientY-rect.top)/rect.height-.5)*2;
      schedule();
    });
    stage.addEventListener("pointerleave",()=>{targetX=0;targetY=0;schedule()});
    addEventListener("scroll",readScroll,{passive:true});
    addEventListener("resize",readScroll,{passive:true});
    readScroll();
    return {readScroll};
  }

  makeStory({
    section:"#depthShowcase",stage:"#depthStage",model:"#lotusModel",animation:"Lotus Explode",
    orbitStart:-18,orbitRange:128,polar:72,polarLift:9,radius:108,radiusLift:8,scale:.78,
    progressVar:"--lotus-progress",scaleVar:"--lotus-scale",liftVar:"--lotus-lift",
    rollVar:"--lotus-roll",xVar:"--lotus-x",yVar:"--lotus-y",copyVar:"--lotus-copy"
  });
  makeStory({
    section:"#eclipseShowcase",stage:"#eclipseStage",model:"#eclipseModel",
    orbitStart:-20,orbitRange:150,polar:72,polarLift:10,radius:112,radiusLift:11,scale:.8,
    progressVar:"--eclipse-progress",scaleVar:"--eclipse-scale",liftVar:"--eclipse-lift",
    rollVar:"--eclipse-roll",xVar:"--eclipse-x",yVar:"--eclipse-y",copyVar:"--eclipse-copy"
  });
})();

