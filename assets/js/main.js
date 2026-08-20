
gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// menu
const mb=document.querySelector(".menu-button"), mm=document.querySelector(".mobile-menu");
if(mb&&mm){
 mb.onclick=()=>{const o=mm.classList.toggle("open");document.body.classList.toggle("menu-open",o);mb.textContent=o?"Close":"Menu"};
 mm.querySelectorAll("a").forEach(a=>a.onclick=()=>{mm.classList.remove("open");document.body.classList.remove("menu-open");mb.textContent="Menu"});
}

// pointer light
const glow=document.querySelector(".pointer-glow");
if(glow && matchMedia("(pointer:fine)").matches){
 document.addEventListener("pointermove",e=>gsap.to(glow,{x:e.clientX-210,y:e.clientY-210,opacity:1,duration:.65,ease:"power3.out"}));
}

if(!reduced){
 // HERO
 gsap.to(".hero img",{scale:1.11,yPercent:4,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
 gsap.to(".hero-copy",{yPercent:-15,opacity:.18,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom 35%",scrub:true}});

 // FORM 3-CARD STORY — quicker, immediate scroll response
 const cards=gsap.utils.toArray(".form-card");
 const labels=gsap.utils.toArray(".form-label-item");
 const count=document.querySelector(".form-count");
 const progress=document.querySelector(".form-progress span");
 if(cards.length){
   gsap.set(cards[0],{xPercent:-50,yPercent:-50,rotationY:-3,rotationX:1,scale:.94,z:85});
   gsap.set(cards[1],{xPercent:-2,yPercent:-45,rotationY:-14,rotationZ:2,scale:.70,z:-150,opacity:.52,filter:"brightness(.74)"});
   gsap.set(cards[2],{xPercent:-98,yPercent:-45,rotationY:14,rotationZ:-2,scale:.70,z:-160,opacity:.38,filter:"brightness(.68)"});
   gsap.set(labels,{autoAlpha:0,y:14});
   gsap.set(labels[0],{autoAlpha:1,y:0});

   const formTL=gsap.timeline({
     scrollTrigger:{
       trigger:".form-story",
       start:"top 72%",
       end:"bottom 28%",
       scrub:.72,
       invalidateOnRefresh:true
     }
   });

   // Product 01 -> 02 begins almost immediately after FORM enters view.
   formTL
    .to(progress,{height:"34%",duration:.08},0)
    .to(cards[0],{xPercent:-103,yPercent:-51,rotationY:18,rotationZ:-2,scale:.72,z:-190,opacity:.30,filter:"brightness(.66)",duration:.25},.07)
    .to(cards[1],{xPercent:-50,yPercent:-50,rotationY:3,rotationZ:0,scale:.96,z:95,opacity:1,filter:"brightness(1)",duration:.25},.07)
    .to(cards[2],{xPercent:3,yPercent:-46,rotationY:-15,rotationZ:2,scale:.70,z:-155,opacity:.43,filter:"brightness(.72)",duration:.25},.07)
    .to(labels[0],{autoAlpha:0,y:-12,duration:.07},.11)
    .to(labels[1],{autoAlpha:1,y:0,duration:.08},.16)
    .set(count,{textContent:"02"},.16)

    // Product 02 -> 03 starts around the middle, not near the end.
    .to(progress,{height:"68%",duration:.08},.39)
    .to(cards[1],{xPercent:-102,yPercent:-52,rotationY:17,rotationZ:-2,scale:.72,z:-185,opacity:.30,filter:"brightness(.67)",duration:.25},.43)
    .to(cards[2],{xPercent:-50,yPercent:-50,rotationY:-3,rotationZ:0,scale:.97,z:100,opacity:1,filter:"brightness(1)",duration:.25},.43)
    .to(cards[0],{xPercent:0,yPercent:-46,rotationY:-14,rotationZ:2,scale:.69,z:-170,opacity:.25,duration:.25},.43)
    .to(labels[1],{autoAlpha:0,y:-12,duration:.07},.48)
    .to(labels[2],{autoAlpha:1,y:0,duration:.08},.53)
    .set(count,{textContent:"03"},.53)
    .to(progress,{height:"100%",duration:.10},.69)
    .to(cards[2],{scale:1.08,rotationY:3,yPercent:-49,duration:.20},.73);
 }

 // HORIZONTAL RAIL
 const rail=document.querySelector(".collection-rail");
 const track=document.querySelector(".rail-track");
 if(rail&&track){
   const travel=()=>Math.max(0,track.scrollWidth-innerWidth);
   gsap.to(track,{x:()=>-travel(),ease:"none",scrollTrigger:{trigger:rail,start:"top 78%",end:"bottom 22%",scrub:.78,invalidateOnRefresh:true}});
   gsap.utils.toArray(".rail-card img").forEach(img=>{
     gsap.fromTo(img,{xPercent:-4},{xPercent:4,ease:"none",scrollTrigger:{trigger:img.closest(".rail-card"),containerAnimation:null,start:"left right",end:"right left",scrub:true}});
   });
 }

 // image reveals
 gsap.utils.toArray(".reveal").forEach(el=>gsap.from(el,{y:38,opacity:0,duration:1.05,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 86%"}}));
 gsap.utils.toArray(".product-tile").forEach((el,i)=>gsap.from(el,{y:30,opacity:0,duration:.9,delay:(i%2)*.08,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%"}}));
}

const y=document.querySelector("[data-year]");if(y)y.textContent=new Date().getFullYear();
