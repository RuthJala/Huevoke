(() => {
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

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

  const hero=$(".v5-hero");
  const heroImage=$(".v5-hero-image");
  const heroCopy=$(".v5-hero .hero-copy");
  if(hero&&heroImage){
    const heroMotion=()=>{
      const r=hero.getBoundingClientRect();
      const p=clamp(-r.top/Math.max(1,hero.offsetHeight));
      heroImage.style.transform=`scale(${1+p*.06}) translate3d(0,${p*1.8}%,0)`;
      if(heroCopy){
        heroCopy.style.transform=`translate3d(0,${-p*6}%,0)`;
        heroCopy.style.opacity=String(1-p*.66);
      }
    };
    addEventListener("scroll",heroMotion,{passive:true});
    heroMotion();
  }
})();