
const data=window.HUEVOKE_PRODUCTS||[];
const qs=new URLSearchParams(location.search);
const p=data.find(x=>x.slug===(qs.get("slug")||"contour-flow-01"))||data[0];
const $=s=>document.querySelector(s);
document.title=`${p.name} — HUEVOKE`;
$("#series").textContent=p.series;
$("#product-name").textContent=p.name;
$("#product-code").textContent=p.code;
$("#product-desc").textContent=p.desc;
$("#thickness").textContent=p.thickness;
$("#material").textContent="Premium MDF";
$("#finish").textContent="Silky Ultra Matte";

const main=$("#product-main-media");
if(p.imgs&&p.imgs.length) main.innerHTML=`<img src="${p.imgs[0]}" alt="${p.name}">`;
else main.innerHTML=`<div class="placeholder"><div><strong>${p.name}</strong><br><small>Visual coming soon</small></div></div>`;

let selected=p.sizes[0];
const picker=$("#size-picker");
p.sizes.forEach((s,i)=>{
 const b=document.createElement("button");b.className="size-btn"+(i===0?" active":"");b.textContent=s;
 b.onclick=()=>{picker.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");selected=s;updateWA()};
 picker.appendChild(b);
});
function updateWA(){
 const msg=`Hi HUEVOKE, I'm interested in ${p.name} — ${p.code}. I'd like to enquire/order the ${selected} size. Please share availability, customisation and ordering details.`;
  $("#wa-link").href=`https://wa.me/917288952705?text=${encodeURIComponent(msg)}`;
}
updateWA();

const gallery=$("#gallery");
if(p.imgs&&p.imgs.length>1){
 p.imgs.slice(1).forEach((src,i)=>{const f=document.createElement("figure");f.innerHTML=`<img loading="lazy" src="${src}" alt="${p.name} view ${i+2}">`;gallery.appendChild(f)});
}else gallery.style.display="none";

