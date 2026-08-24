(() => {
  const data=window.HUEVOKE_PRODUCTS||[];
  const qs=new URLSearchParams(location.search);
  const p=data.find(x=>x.slug===(qs.get("slug")||"contour-flow-01"))||data[0];
  const $=s=>document.querySelector(s);
  const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
  document.title=`${p.name} — HUEVOKE`;
  $("#series").textContent=p.series;
  $("#product-name").textContent=p.name;
  $("#product-code").textContent=p.code;
  $("#product-desc").textContent=p.desc;

  let current=0;
  let selected=p.sizes[0];
  const mainImage=$(".product-main-image");
  const thumbs=$("#product-thumbs");
  const show=index=>{
    current=(index+p.imgs.length)%p.imgs.length;
    mainImage.innerHTML=`<img src="${p.imgs[current]}" alt="${p.name} view ${current+1}">`;
    thumbs.querySelectorAll("button").forEach((b,i)=>b.classList.toggle("active",i===current));
  };
  p.imgs.forEach((src,i)=>{
    const b=document.createElement("button");b.type="button";b.setAttribute("aria-label",`View image ${i+1}`);b.innerHTML=`<img src="${src}" alt="">`;b.onclick=()=>show(i);thumbs.appendChild(b);
  });
  $(".gallery-arrow.prev").onclick=()=>show(current-1);
  $(".gallery-arrow.next").onclick=()=>show(current+1);
  let touchX=0;
  $("#product-main-media").addEventListener("touchstart",e=>touchX=e.touches[0].clientX,{passive:true});
  $("#product-main-media").addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>45)show(current+(d<0?1:-1));},{passive:true});
  show(0);

  const picker=$("#size-picker");
  const updatePrice=()=>$("#product-price").textContent=money(selected.price);
  p.sizes.forEach((option,i)=>{
    const b=document.createElement("button");b.className="size-btn"+(i===0?" active":"");b.type="button";b.innerHTML=`<span>${option.size}</span><small>${money(option.price)}</small>`;
    b.onclick=()=>{picker.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");selected=option;updatePrice();};picker.appendChild(b);
  });
  updatePrice();

  const spec=p.specs;
  $("#specifications").innerHTML=`<dl><div><dt>Thickness</dt><dd>${spec.thickness}</dd></div><div><dt>Material</dt><dd>${spec.material}</dd></div><div><dt>Finish</dt><dd>${spec.finish}</dd></div><div><dt>Orientation</dt><dd>${spec.orientation}</dd></div><div><dt>Mounting</dt><dd>${spec.mounting}</dd></div><div><dt>Lead time</dt><dd>${spec.leadTime}</dd></div></dl>`;

  $("#add-cart").onclick=()=>{
    const cart=JSON.parse(localStorage.getItem("huevoke-cart")||"[]");
    const key=`${p.slug}|${selected.size}`;
    const existing=cart.find(x=>x.key===key);
    if(existing)existing.qty+=1;else cart.push({key,slug:p.slug,name:p.name,code:p.code,size:selected.size,price:selected.price,image:p.imgs[0],qty:1});
    localStorage.setItem("huevoke-cart",JSON.stringify(cart));
    window.dispatchEvent(new Event("huevoke-cart-updated"));
    const btn=$("#add-cart");btn.textContent="Added to cart ✓";setTimeout(()=>btn.textContent="Add to cart",1600);
  };
})();

