
gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuBtn = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
if (menuBtn && mobileMenu){
  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menuBtn.textContent = open ? "Close" : "Menu";
  });
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuBtn.textContent = "Menu";
  }));
}

const cursor = document.querySelector(".cursor-light");
if(cursor && window.matchMedia("(pointer:fine)").matches){
  window.addEventListener("pointermove", e => {
    gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.7,ease:"power3.out"});
  });
}

if(!prefersReduced){
  const hero = document.querySelector(".hero");
  if(hero){
    gsap.to(".hero-media", {
      scale:1.11, yPercent:4,
      ease:"none",
      scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}
    });
    gsap.to(".hero-copy", {
      yPercent:-18, opacity:.25,
      ease:"none",
      scrollTrigger:{trigger:hero,start:"top top",end:"bottom 30%",scrub:true}
    });
  }

  const formJourney = document.querySelector(".form-journey");
  if(formJourney){
    const tl = gsap.timeline({
      scrollTrigger:{
        trigger:formJourney,
        start:"top top",
        end:"bottom bottom",
        scrub:1
      }
    });
    tl.fromTo(".form-object",
      {xPercent:-50,yPercent:-50,scale:.78,rotationY:-10,rotationZ:-2},
      {xPercent:-16,yPercent:-50,scale:1.05,rotationY:11,rotationZ:2,duration:1}
    )
    .to(".form-object",{xPercent:-66,yPercent:-50,scale:1.72,rotationY:-16,rotationZ:-5,duration:1})
    .to(".form-object",{xPercent:-50,yPercent:-44,scale:2.45,rotationY:7,rotationZ:4,duration:1});
    gsap.fromTo(".form-copy",{opacity:0,y:40},{opacity:1,y:0,
      scrollTrigger:{trigger:formJourney,start:"top 65%",end:"top 20%",scrub:true}
    });
  }

  const depth = document.querySelector(".depth-section");
  if(depth){
    gsap.to(".depth-media",{scale:1.16,xPercent:5,ease:"none",scrollTrigger:{trigger:depth,start:"top bottom",end:"bottom top",scrub:true}});
    gsap.to(".depth-meter span",{width:"100%",ease:"none",scrollTrigger:{trigger:depth,start:"top 70%",end:"bottom 30%",scrub:true}});
  }

  const palette = document.querySelector(".palette");
  if(palette){
    gsap.fromTo(".palette-media img",{scale:1.12,yPercent:-4},{scale:1.02,yPercent:4,ease:"none",
      scrollTrigger:{trigger:palette,start:"top bottom",end:"bottom top",scrub:true}
    });
  }

  const tidal = document.querySelector(".tidal");
  if(tidal){
    gsap.to(".tidal-canvas",{xPercent:-36,ease:"none",
      scrollTrigger:{trigger:tidal,start:"top top",end:"bottom bottom",scrub:1}
    });
  }

  gsap.utils.toArray(".reveal").forEach(el=>{
    gsap.from(el,{y:42,opacity:0,duration:1.1,ease:"power3.out",
      scrollTrigger:{trigger:el,start:"top 84%"}
    });
  });

  gsap.utils.toArray(".product-row").forEach((row,i)=>{
    gsap.from(row,{y:22,opacity:0,duration:.7,delay:i*.035,ease:"power3.out",
      scrollTrigger:{trigger:row,start:"top 94%"}
    });
  });
}

const year = document.querySelector("[data-year]");
if(year) year.textContent = new Date().getFullYear();
