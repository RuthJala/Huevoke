(() => {
  "use strict";

  const catalog=window.HUEVOKE_PRODUCTS||[];
  const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
  const getProduct=slug=>catalog.find(p=>p.slug===slug);

  const collections = [
    {id:"contour-flow",number:"01",title:"Contour Flow",image:"cf2.5.webp",note:"Rhythm drawn through layered contours.",slugs:["contour-flow-01","contour-flow-02","contour-flow-03"]},
    {id:"erosion",number:"02",title:"Erosion",image:"e2.4.webp",note:"Forms softened by time and elemental wear.",slugs:["erosion-01","erosion-02"]},
    {id:"fluid-motion",number:"03",title:"Fluid Motion",image:"fm1.2.webp",note:"Layered movement held in a quiet surface.",slugs:["fluid-motion-01","fluid-motion-02"]},
    {id:"balance",number:"04",title:"Balance",image:"b3.5.webp",note:"Weight, void and asymmetry in equilibrium.",slugs:["balance-01","balance-02","balance-03"]},
    {id:"tidal-landscape",number:"05",title:"Tidal Landscape",image:"tl3.3.png",note:"Topographies shaped by imagined tides.",slugs:["tidal-landscape-01","tidal-landscape-02","tidal-landscape-03"]},
    {id:"lotus-bloom",number:"06",title:"Lotus Bloom",image:"lb1.4.webp",note:"A flower translated into sculptural depth.",slugs:["lotus-bloom-01","lotus-bloom-02","lotus-bloom-03"]},
    {id:"eclipse",number:"07",title:"Eclipse",image:"ec2.3.png",note:"Celestial alignment distilled into form.",slugs:["eclipse-01","eclipse-02","eclipse-03"]}
  ];

  const app=document.querySelector("#collectionsApp");
  const selected=new URLSearchParams(location.search).get("series");
  const collection=collections.find(item=>item.id===selected);
  const imagePath=file=>`assets/images/${file}`;

  function renderGallery(){
    document.title="Collections — HUEVOKE";
    app.innerHTML=`<section class="gallery-intro"><div class="gallery-intro-copy"><div class="eyebrow">HUEVOKE / COLLECTIONS</div><h1>An exhibition<br><em>of form.</em></h1><p>Move through seven sculptural studies. Each work opens into its complete collection.</p><div class="gallery-scroll-cue"><i></i><span>Scroll to enter</span></div></div><figure class="gallery-intro-image"><img src="assets/images/cf2.2-hero.png" alt="Contour Flow II in a quiet interior"></figure></section><section class="gallery-walk" aria-label="HUEVOKE collections"><div class="gallery-lock"><div class="gallery-architecture" aria-hidden="true"><span class="gallery-ceiling"></span><span class="gallery-floor"></span><span class="gallery-horizon"></span></div><div class="gallery-scenes">${collections.map((item,index)=>`<article class="gallery-stop" data-index="${index}"><div class="gallery-wall-number">${item.number}</div><div class="gallery-wall-copy"><span>Collection ${item.number} / 07</span><h2>${item.title}</h2><p>${item.note}</p></div><a class="gallery-frame" href="collections.html?series=${item.id}" aria-label="View ${item.title}"><span class="gallery-frame-mount"><img src="${imagePath(item.image)}" alt="${item.title}" ${index>1?'loading="lazy"':''}></span><span class="gallery-plaque"><b>${item.title}</b><small>View collection &nbsp;↗</small></span></a></article>`).join("")}</div><div class="gallery-position"><b>01</b><span><i></i></span><small>07</small></div><div class="gallery-lock-cue">Scroll to move through the exhibition</div></div></section>`;
    bindGalleryMotion();
  }

  function productCard(slug,index){
    const p=getProduct(slug);
    if(!p)return "";
    const lowest=p.sizes.reduce((best,o)=>!best||o.price<best.price?o:best,null);
    const sizeSummary=p.sizes.map(o=>o.size).join(" / ");
    return `<a class="collection-product" href="product.html?slug=${p.slug}">
      <div class="collection-product-image"><img src="${p.imgs[0]}" alt="${p.name}" ${index?'loading="lazy"':''}></div>
      <div class="collection-product-meta">
        <span>${p.code}</span>
        <h3>${p.name}</h3>
        <small>${p.specs.thickness} · ${sizeSummary}</small>
        <small><b>${money(lowest.price)}</b>${lowest.regularPrice>lowest.price?` <del style="opacity:.45">${money(lowest.regularPrice)}</del>`:""} · Custom sizes available &nbsp;↗</small>
      </div>
    </a>`;
  }

  function renderDetail(item){
    document.title=`${item.title} — HUEVOKE`;
    const next=collections[(collections.indexOf(item)+1)%collections.length];
    app.innerHTML=`<section class="collection-detail-hero"><a class="collection-back" href="collections.html">← &nbsp;All collections</a><div class="collection-detail-copy"><div class="eyebrow">Collection ${item.number} / 07</div><h1>${item.title}</h1><p>${item.note}</p></div><figure class="collection-detail-cover"><img src="${imagePath(item.image)}" alt="${item.title}"></figure></section><section class="collection-products"><div class="collection-products-head"><div><div class="eyebrow">The collection</div><h2>Sculptural objects</h2></div><p>${String(item.slugs.length).padStart(2,"0")} ${item.slugs.length===1?"object":"objects"}</p></div><div class="collection-product-grid">${item.slugs.map(productCard).join("")}</div></section><nav class="collection-next"><span>Continue the exhibition</span><a href="collections.html?series=${next.id}">${next.title}<i>→</i></a></nav>`;
  }

  function bindGalleryMotion(){
    const stops=[...document.querySelectorAll(".gallery-stop")];
    if(!stops.length)return;
    const walk=document.querySelector(".gallery-walk");
    const counter=document.querySelector(".gallery-position b");
    const progressLine=document.querySelector(".gallery-position i");
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf=0;
    const draw=()=>{
      raf=0;
      const rect=walk.getBoundingClientRect();
      const travel=Math.max(1,walk.offsetHeight-innerHeight);
      const progress=Math.max(0,Math.min(1,-rect.top/travel));
      const position=progress*(stops.length-1);
      const active=Math.max(0,Math.min(stops.length-1,Math.round(position)));
      stops.forEach((stop,index)=>{
        const distance=index-position;
        const closeness=Math.max(0,1-Math.abs(distance));
        stop.style.setProperty("--distance",distance.toFixed(4));
        stop.style.setProperty("--close",closeness.toFixed(4));
        stop.classList.toggle("is-current",index===active);
        stop.setAttribute("aria-hidden",Math.abs(distance)>.72?"true":"false");
      });
      if(counter)counter.textContent=String(active+1).padStart(2,"0");
      if(progressLine)progressLine.style.transform=`scaleX(${progress})`;
    };
    const update=()=>{if(!raf)raf=requestAnimationFrame(draw);};
    if(!reduced)addEventListener("scroll",update,{passive:true});
    addEventListener("resize",update,{passive:true});
    draw();
  }

  if(collection)renderDetail(collection);else renderGallery();
})();