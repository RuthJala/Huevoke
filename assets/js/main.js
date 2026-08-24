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

  document.body.insertAdjacentHTML("beforeend",`<a class="global-cart" href="cart.html" aria-label="View cart">Cart <span data-cart-count>0</span></a>`);
  const cartCount=()=>{
    const cart=JSON.parse(localStorage.getItem("huevoke-cart")||"[]");
    const count=cart.reduce((sum,item)=>sum+(item.qty||1),0);
    $$('[data-cart-count]').forEach(el=>el.textContent=count);
  };
  cartCount();
  addEventListener("huevoke-cart-updated",cartCount);

  document.body.insertAdjacentHTML("beforeend",`<div class="enquiry-modal" aria-hidden="true"><button class="enquiry-backdrop" type="button" aria-label="Close enquiry"></button><section class="enquiry-panel" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button class="enquiry-close" type="button" aria-label="Close">×</button><div class="eyebrow">HUEVOKE / PRIVATE ENQUIRY</div><h2 id="enquiry-title">Let’s discuss<br>your space.</h2><p>Share a few details and the HUEVOKE studio will respond personally.</p><form action="https://formsubmit.co/huevoke.decor@gmail.com" method="POST"><input type="hidden" name="_subject" value="New HUEVOKE website enquiry"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input type="email" name="email" autocomplete="email" required></label><label>Phone<input type="tel" name="phone" autocomplete="tel" required></label><label>Interested in<input name="interest" placeholder="Object, collection or bespoke piece"></label><label>Message<textarea name="message" rows="4" required></textarea></label><label class="enquiry-consent"><input type="checkbox" required><span>I agree to be contacted about this enquiry.</span></label><button class="btn fill" type="submit">Send enquiry</button></form><small>We use these details only to respond to your request.</small></section></div>`);
  const modal=$(".enquiry-modal");
  const openEnquiry=()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");setTimeout(()=>$("input",modal)?.focus(),80)};
  const closeEnquiry=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")};
  $$('.nav-enquire, [data-enquire], a[href*="wa.me"]:not(.footer-contact-link)').forEach(link=>link.addEventListener("click",e=>{e.preventDefault();openEnquiry()}));
  $(".enquiry-close")?.addEventListener("click",closeEnquiry);
  $(".enquiry-backdrop")?.addEventListener("click",closeEnquiry);
  addEventListener("keydown",e=>{if(e.key==="Escape")closeEnquiry()});
})();

