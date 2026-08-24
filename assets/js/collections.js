(() => {
  "use strict";
  const collections = [
    {id:"contour-flow",number:"01",title:"Contour Flow",image:"cf2.5.webp",note:"Rhythm drawn through layered contours.",products:[["contour-flow-01","Contour Flow I","HV-F01 CF","cf1.2.webp"],["contour-flow-02","Contour Flow II","HV-F02 CF","cf2.2.webp"],["contour-flow-03","Contour Flow III","HV-F03 CF","cf3.2.webp"]]},
    {id:"erosion",number:"02",title:"Erosion",image:"e2.4.webp",note:"Forms softened by time and elemental wear.",products:[["erosion-01","Erosion I","HV-F04 ER","e1.2.webp"],["erosion-02","Erosion II","HV-F05 ER","e2.2.webp"]]},
    {id:"fluid-motion",number:"03",title:"Fluid Motion",image:"fm1.5.webp",note:"Layered movement held in a quiet surface.",products:[["fluid-motion-01","Fluid Motion I","HV-F06 FM","fm1.2.webp"],["fluid-motion-02","Fluid Motion II","HV-F07 FM","fm2.2.webp"]]},
    {id:"balance",number:"04",title:"Balance",image:"b3.5.webp",note:"Weight, void and asymmetry in equilibrium.",products:[["balance-01","Balance I","HV-F08 BL","b1.2.webp"],["balance-02","Balance II","HV-F09 BL","b2.2.webp"],["balance-03","Balance III","HV-F10 BL","b3.2.webp"]]},
    {id:"tidal-landscape",number:"05",title:"Tidal Landscape",image:"tl1.5.webp",note:"Topographies shaped by imagined tides.",products:[["tidal-landscape-01","Tidal Landscape I","HV-F11 TL","tl1.2.webp"],["tidal-landscape-02","Tidal Landscape II","HV-F12 TL","tl2.2.webp"]]},
    {id:"lotus-bloom",number:"06",title:"Lotus Bloom",image:"lb1.4.webp",note:"A flower translated into sculptural depth.",products:[["lotus-bloom","Lotus Bloom","HV-E01 LB","lb1.4.webp"]]},
    {id:"eclipse",number:"07",title:"Eclipse",image:"ec1.4.png",note:"Celestial alignment distilled into form.",products:[["eclipse","Eclipse","HV-E02 EC","ec1.4.png"]]}
  ];
  const app=document.querySelector("#collectionsApp");
  const selected=new URLSearchParams(location.search).get("series");
  const collection=collections.find(item=>item.id===selected);
  const imagePath=file=>`assets/images/${file}`;

  function renderGallery(){
    document.title="Collections — HUEVOKE";
    app.innerHTML=`<section class="gallery-intro"><div class="eyebrow">HUEVOKE / COLLECTIONS</div><h1>An exhibition<br><em>of form.</em></h1><p>Move through seven sculptural studies. Each work opens into its complete collection.</p><div class="gallery-scroll-cue"><i></i><span>Scroll to enter</span></div></section><section class="gallery-walk" aria-label="HUEVOKE collections"><div class="gallery-architecture" aria-hidden="true"><span class="gallery-ceiling"></span><span class="gallery-floor"></span><span class="gallery-horizon"></span></div>${collections.map((item,index)=>`<article class="gallery-stop" data-index="${index}"><div class="gallery-stop-stage"><div class="gallery-wall-number">${item.number}</div><div class="gallery-wall-copy"><span>Collection ${item.number} / 07</span><h2>${item.title}</h2><p>${item.note}</p></div><a class="gallery-frame" href="collections.html?series=${item.id}" aria-label="View ${item.title}"><span class="gallery-frame-mount"><img src="${imagePath(item.image)}" alt="${item.title}" ${index>1?'loading="lazy"':''}></span><span class="gallery-plaque"><b>${item.title}</b><small>View collection &nbsp;↗</small></span></a><div class="gallery-position"><b>${String(index+1).padStart(2,"0")}</b><span></span><small>07</small></div></div></article>`).join("")}</section>`;
    bindGalleryMotion();
  }

  function renderDetail(item){
    document.title=`${item.title} — HUEVOKE`;
    const next=collections[(collections.indexOf(item)+1)%collections.length];
    app.innerHTML=`<section class="collection-detail-hero"><a class="collection-back" href="collections.html">← &nbsp;All collections</a><div class="collection-detail-copy"><div class="eyebrow">Collection ${item.number} / 07</div><h1>${item.title}</h1><p>${item.note}</p></div><figure class="collection-detail-cover"><img src="${imagePath(item.image)}" alt="${item.title}"></figure></section><section class="collection-products"><div class="collection-products-head"><div><div class="eyebrow">The collection</div><h2>Sculptural objects</h2></div><p>${String(item.products.length).padStart(2,"0")} ${item.products.length===1?"object":"objects"}</p></div><div class="collection-product-grid">${item.products.map((product,index)=>`<a class="collection-product" href="product.html?slug=${product[0]}"><div class="collection-product-image"><img src="${imagePath(product[3])}" alt="${product[1]}" ${index?'loading="lazy"':''}></div><div class="collection-product-meta"><span>${product[2]}</span><h3>${product[1]}</h3><small>View object &nbsp;↗</small></div></a>`).join("")}</div></section><nav class="collection-next"><span>Continue the exhibition</span><a href="collections.html?series=${next.id}">${next.title}<i>→</i></a></nav>`;
  }

  function bindGalleryMotion(){
    const stops=[...document.querySelectorAll(".gallery-stop")];
    if(!stops.length)return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf=0;
    const draw=()=>{raf=0;const center=innerHeight*.52;stops.forEach(stop=>{const rect=stop.getBoundingClientRect();const distance=(rect.top+rect.height*.5-center)/innerHeight;const closeness=Math.max(0,1-Math.abs(distance));stop.style.setProperty("--distance",distance.toFixed(4));stop.style.setProperty("--close",closeness.toFixed(4));stop.classList.toggle("is-current",Math.abs(distance)<.5);});};
    const update=()=>{if(!raf)raf=requestAnimationFrame(draw);};
    if(!reduced)addEventListener("scroll",update,{passive:true});
    addEventListener("resize",update,{passive:true});draw();
  }
  if(collection)renderDetail(collection);else renderGallery();
})();

