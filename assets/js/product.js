(() => {
  const data=window.HUEVOKE_PRODUCTS||[];
  const qs=new URLSearchParams(location.search);
  const requestedSlug=qs.get("slug")||"contour-flow-01";
  const resolvedSlug=requestedSlug==="lotus-bloom"?"lotus-bloom-01":requestedSlug;
  const p=data.find(x=>x.slug===resolvedSlug)||data[0];
  const $=s=>document.querySelector(s);
  const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
  const discountPct=o=>o.regularPrice>o.price?Math.round((1-o.price/o.regularPrice)*100):0;

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
    const b=document.createElement("button");
    b.type="button";
    b.setAttribute("aria-label",`View image ${i+1}`);
    b.innerHTML=`<img src="${src}" alt="">`;
    b.onclick=()=>show(i);
    thumbs.appendChild(b);
  });
  $(".gallery-arrow.prev").onclick=()=>show(current-1);
  $(".gallery-arrow.next").onclick=()=>show(current+1);
  let touchX=0;
  $("#product-main-media").addEventListener("touchstart",e=>touchX=e.touches[0].clientX,{passive:true});
  $("#product-main-media").addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>45)show(current+(d<0?1:-1));},{passive:true});
  show(0);

  const picker=$("#size-picker");
  const updatePrice=()=>{
    const pct=discountPct(selected);
    $("#product-price").innerHTML=`
      <span class="discounted-price">${money(selected.price)}</span>
      ${selected.regularPrice>selected.price?`<del style="margin-left:12px;opacity:.45;font-size:.58em">${money(selected.regularPrice)}</del><small class="discount-badge" style="margin-left:10px;font-size:10px;letter-spacing:.12em;vertical-align:middle">${pct}% OFF</small>`:""}
    `;
  };

  p.sizes.forEach((option,i)=>{
    const pct=discountPct(option);
    const b=document.createElement("button");
    b.className="size-btn"+(i===0?" active":"");
    b.type="button";
    b.innerHTML=`
      <span>${option.size}</span>
      <small class="size-price"><b>${money(option.price)}</b>${option.regularPrice>option.price?` <del style="opacity:.45">${money(option.regularPrice)}</del>`:""}</small>
      ${pct?`<em style="font-style:normal;opacity:.58;font-size:9px">${pct}% off</em>`:""}
    `;
    b.onclick=()=>{
      picker.querySelectorAll("button").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      selected=option;
      updatePrice();
    };
    picker.appendChild(b);
  });
  updatePrice();

  const customMessage=p.customRate
    ? `Custom sizes available · Custom-size rate ${money(p.customRate)}/sq ft`
    : `Custom sizes available · Pricing confirmed on enquiry`;
  picker.insertAdjacentHTML("afterend",`<div class="custom-size-note" style="display:flex;justify-content:space-between;gap:18px;padding:13px 0 18px;border-bottom:1px solid rgba(36,35,31,.12);font-size:11px;line-height:1.55"><strong style="font-weight:500;text-transform:uppercase;letter-spacing:.12em">Custom sizing</strong><span style="text-align:right;opacity:.68">${customMessage}</span></div>`);

  const spec=p.specs;
  $("#specifications").innerHTML=`<dl>
    <div><dt>Thickness</dt><dd>${spec.thickness}</dd></div>
    <div><dt>Sizing</dt><dd>${p.availability||spec.sizing||"Standard / Custom"}</dd></div>
    <div><dt>Material</dt><dd>${spec.material}</dd></div>
    <div><dt>Finish</dt><dd>${spec.finish}</dd></div>
    <div><dt>Orientation</dt><dd>${spec.orientation}</dd></div>
    <div><dt>Mounting</dt><dd>${spec.mounting}</dd></div>
    <div><dt>Lead time</dt><dd>${spec.leadTime}</dd></div>
  </dl>`;

  $("#add-cart").onclick=()=>{
    const cart=JSON.parse(localStorage.getItem("huevoke-cart")||"[]");
    const key=`${p.slug}|${selected.size}`;
    const existing=cart.find(x=>x.key===key);
    if(existing){
      existing.qty+=1;
      existing.price=selected.price;
      existing.regularPrice=selected.regularPrice;
      existing.name=p.name;
      existing.code=p.code;
    }else{
      cart.push({
        key,slug:p.slug,name:p.name,code:p.code,size:selected.size,
        price:selected.price,regularPrice:selected.regularPrice,
        image:p.imgs[0],qty:1
      });
    }
    localStorage.setItem("huevoke-cart",JSON.stringify(cart));
    window.dispatchEvent(new Event("huevoke-cart-updated"));
    const btn=$("#add-cart");
    btn.textContent="Added to cart ✓";
    setTimeout(()=>btn.textContent="Add to cart",1600);
  };
})();