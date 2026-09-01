(() => {
  const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
  const $=s=>document.querySelector(s);
  const catalog=window.HUEVOKE_PRODUCTS||[];
  const norm=s=>String(s||"").toLowerCase().replace(/[×x]/g,"x").replace(/\s|"/g,"");
  let cart=JSON.parse(localStorage.getItem("huevoke-cart")||"[]");

  cart=cart.map(item=>{
    const p=catalog.find(x=>x.slug===item.slug);
    if(!p)return item;
    const option=p.sizes.find(o=>norm(o.size)===norm(item.size));
    return {
      ...item,
      name:p.name,
      code:p.code,
      image:p.imgs[0],
      ...(option?{size:option.size,price:option.price,regularPrice:option.regularPrice}:{})
    };
  });
  localStorage.setItem("huevoke-cart",JSON.stringify(cart));

  if(!cart.length){location.replace("cart.html");return}

  $("#checkout-items").innerHTML=cart.map(x=>`<div class="checkout-item"><img src="${x.image}" alt=""><div><strong>${x.name}</strong><span>${x.code} · ${x.size} × ${x.qty}</span></div><b>${money(x.price*x.qty)}</b></div>`).join("");
  $("#checkout-total").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
  $("#order-field").value=cart.map(x=>`${x.name} | ${x.code} | ${x.size} | Qty ${x.qty} | ${money(x.price*x.qty)}`).join("\n");
})();