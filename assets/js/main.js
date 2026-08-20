
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

 // FORM 3-CARD STORY
 const cards=gsap.utils.toArray(".form-card");
 const labels=gsap.utils.toArray(".form-label-item");
 const count=document.querySelector(".form-count");
 const progress=document.querySelector(".form-progress span");
 if(cards.length){
   // starting positions
   gsap.set(cards[0],{xPercent:-50,yPercent:-50,rotationY:-5,rotationX:2,scale:.92,z:80});
   gsap.set(cards[1],{xPercent:-2,yPercent:-43,rotationY:-22,rotationZ:4,scale:.67,z:-180,opacity:.5,filter:"brightness(.72)"});
   gsap.set(cards[2],{xPercent:-98,yPercent:-43,rotationY:22,rotationZ:-4,scale:.67,z:-200,opacity:.36,filter:"brightness(.65)"});
   gsap.set(labels,{autoAlpha:0,y:18});
   gsap.set(labels[0],{autoAlpha:1,y:0});

   const formTL=gsap.timeline({scrollTrigger:{trigger:".form-story",start:"top top",end:"bottom bottom",scrub:1.15}});
   formTL
    .to(progress,{height:"33%",duration:.2},0)
    .to(cards[0],{xPercent:-105,yPercent:-52,rotationY:28,rotationZ:-4,scale:.7,z:-240,opacity:.34,filter:"brightness(.65)",duration:1},.4)
    .to(cards[1],{xPercent:-50,yPercent:-50,rotationY:5,rotationZ:0,scale:.95,z:90,opacity:1,filter:"brightness(1)",duration:1},.4)
    .to(cards[2],{xPercent:5,yPercent:-45,rotationY:-24,rotationZ:4,scale:.68,z:-180,opacity:.45,filter:"brightness(.7)",duration:1},.4)
    .to(labels[0],{autoAlpha:0,y:-16,duration:.2},.65)
    .to(labels[1],{autoAlpha:1,y:0,duration:.25},.78)
    .call(()=>{if(count)count.textContent="02";cards[1].classList.add("active-sheen")},null,.83)
    .to(progress,{height:"66%",duration:.2},1.25)
    .to(cards[1],{xPercent:-102,yPercent:-54,rotationY:26,rotationZ:-3,scale:.69,z:-230,opacity:.34,filter:"brightness(.66)",duration:1},1.55)
    .to(cards[2],{xPercent:-50,yPercent:-50,rotationY:-4,rotationZ:0,scale:.96,z:100,opacity:1,filter:"brightness(1)",duration:1},1.55)
    .to(cards[0],{xPercent:0,yPercent:-45,rotationY:-24,rotationZ:4,scale:.66,z:-210,opacity:.28,duration:1},1.55)
    .to(labels[1],{autoAlpha:0,y:-16,duration:.2},1.76)
    .to(labels[2],{autoAlpha:1,y:0,duration:.25},1.88)
    .call(()=>{if(count)count.textContent="03";cards[2].classList.add("active-sheen")},null,1.95)
    .to(progress,{height:"100%",duration:.25},2.25)
    .to(cards[2],{scale:1.18,rotationY:8,yPercent:-47,duration:.8},2.42);
 }

 // HORIZONTAL RAIL
 const rail=document.querySelector(".collection-rail");
 const track=document.querySelector(".rail-track");
 if(rail&&track){
   const travel=()=>Math.max(0,track.scrollWidth-innerWidth);
   gsap.to(track,{x:()=>-travel(),ease:"none",scrollTrigger:{trigger:rail,start:"top top",end:"bottom bottom",scrub:1,invalidateOnRefresh:true}});
   gsap.utils.toArray(".rail-card img").forEach(img=>{
     gsap.fromTo(img,{xPercent:-4},{xPercent:4,ease:"none",scrollTrigger:{trigger:img.closest(".rail-card"),containerAnimation:null,start:"left right",end:"right left",scrub:true}});
   });
 }

 // image reveals
 gsap.utils.toArray(".reveal").forEach(el=>gsap.from(el,{y:38,opacity:0,duration:1.05,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 86%"}}));
 gsap.utils.toArray(".product-tile").forEach((el,i)=>gsap.from(el,{y:30,opacity:0,duration:.9,delay:(i%2)*.08,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%"}}));
}

const y=document.querySelector("[data-year]");if(y)y.textContent=new Date().getFullYear();
