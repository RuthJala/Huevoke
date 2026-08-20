
const data = window.HUEVOKE_PRODUCTS || [];
const params = new URLSearchParams(location.search);
const slug = params.get("slug") || "contour-flow";
const p = data.find(x => x.slug === slug) || data[0];

const $ = s => document.querySelector(s);
$("#collection").textContent = p.collection;
$("#product-name").textContent = p.name;
$("#product-code").textContent = p.code;
$("#product-desc").textContent = p.description;
$("#thickness").textContent = p.thickness;
$("#material").textContent = p.material;
$("#finish").textContent = p.finish;
document.title = `${p.name} — HUEVOKE`;

const imageWrap = $("#product-image-wrap");
if (p.hero){
  imageWrap.innerHTML = `<img src="${p.hero}" alt="${p.name} by HUEVOKE">`;
} else {
  imageWrap.innerHTML = `<div class="product-placeholder"><span>${p.name}<br><small style="font:11px Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.5">Add product PNG in products.js</small></span></div>`;
}

let selected = p.sizes[0];
const picker = $("#size-picker");
p.sizes.forEach((size,idx)=>{
  const b = document.createElement("button");
  b.className = "size-btn" + (idx === 0 ? " active" : "");
  b.textContent = size;
  b.addEventListener("click",()=>{
    picker.querySelectorAll(".size-btn").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    selected = size;
    updateWhatsApp();
  });
  picker.appendChild(b);
});

function updateWhatsApp(){
  const message = `Hi HUEVOKE, I'm interested in ${p.name} — ${p.code}. I'd like to enquire/order the ${selected} size. Please share availability and ordering details.`;
  $("#wa-link").href = `https://wa.me/919353417406?text=${encodeURIComponent(message)}`;
}
updateWhatsApp();

const gallery = $("#gallery");
if (p.gallery && p.gallery.length){
  p.gallery.forEach((src,idx)=>{
    const fig = document.createElement("figure");
    fig.innerHTML = `<img src="${src}" alt="${p.name} detail ${idx+1}">`;
    gallery.appendChild(fig);
  });
} else {
  gallery.style.display = "none";
}
