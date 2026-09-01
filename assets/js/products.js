(() => {
  const img=(prefix,n,ext="webp",hero=1)=>[hero,...Array.from({length:n},(_,i)=>i+1).filter(i=>i!==hero)].map(i=>`assets/images/${prefix}.${i}.${ext}`);
  const size=(label,regularPrice,price)=>({size:label,regularPrice,price});
  const specs=(thickness,orientation="Vertical")=>({
    thickness,
    material:"Premium high-density MDF",
    finish:"Hand-finished silky ultra-matte",
    mounting:"Pre-installed French cleat",
    orientation,
    care:"Dust gently with a clean, dry microfibre cloth",
    leadTime:"8–12 days",
    sizing:"Standard / Custom"
  });
  const make=(slug,series,name,code,prefix,count,hero,sizes,thickness,desc,ext="webp",orientation="Vertical",customRate=null)=>({
    slug,series,name,code,imgs:img(prefix,count,ext,hero),sizes,desc,
    availability:"Standard / Custom",
    customRate,
    specs:specs(thickness,orientation)
  });

  window.HUEVOKE_PRODUCTS=[
    make("contour-flow-01","Contour Flow","Contour Flow I","HVF-CF 01","cf1",5,1,[size('24" × 48"',14999,13499),size('36" × 60"',27999,25199)],"48 mm","Broad organic planes create movement through measured relief and shadow.","webp","Vertical",1875),
    make("contour-flow-02","Contour Flow","Contour Flow II","HVF-CF 02","cf2",5,1,[size('24" × 48"',16499,14849),size('36" × 60"',30750,27675)],"60 mm","Deep curved recesses move across the surface with a calm architectural rhythm.","webp","Vertical",2050),
    make("contour-flow-03","Contour Flow","Contour Flow III","HVF-CF 03","cf3",5,1,[size('24" × 36"',11250,10125),size('36" × 48"',22500,20250)],"42 mm","Linear contours open into a quiet central field with generous negative space.","webp","Vertical",1875),

    make("erosion-01","Erosion","Erosion I","HVF-E 01","e1",4,2,[size('24" × 48"',14999,13499)],"40 mm","An irregular silhouette softened by time, grounded in warm mineral tones.","webp","Vertical",1875),
    make("erosion-02","Erosion","Erosion II","HVF-E 02","e2",4,2,[size('48" × 30"',18999,16999)],"50 mm","Nested organic cavities form a composed study of erosion and depth.","webp","Landscape",1900),

    make("fluid-motion-01","Fluid Motion","Fluid Motion I","HVF-FM 01","fm1",5,2,[size('18" × 36"',9999,8999),size('30" × 48"',20500,18450)],"54 mm","Sage, sand and slate layers flow through one continuous sculptural gesture.","webp","Vertical",2050),
    make("fluid-motion-02","Fluid Motion","Fluid Motion II","HVF-FM 02","fm2",4,2,[size('18" × 36"',9999,8999),size('30" × 48"',20500,18450)],"42 mm","A freer internal rhythm with deeper blue-grey relief and a soft perimeter.","webp","Vertical",2050),

    make("balance-01","Balance","Balance Round I","HVF-BL 01","b1",4,2,[size('12" × 12"',5999,5199),size('18" × 18"',9999,8999),size('24" × 24"',14999,13499)],"40 mm","Contrasting masses held in a circular boundary explore balance without literal symmetry.","webp","Square"),
    make("balance-02","Balance","Balance Round II","HVF-BL 02","b2",5,2,[size('12" × 12"',5999,5199),size('18" × 18"',9999,8999),size('24" × 24"',14999,13499)],"50 mm","Soft curves and tonal contrast create tension between visual weight and openness.","webp","Square"),
    make("balance-03","Balance","Balance Square","HVF-BL 03","b3",5,2,[size('24" × 24"',12999,11599),size('30" × 30"',15999,14399),size('36" × 36"',21999,19499)],"40 mm","Three flowing fields form a quiet graphic composition for contemporary interiors.","webp","Square"),

    make("tidal-landscape-01","Tidal Landscape","Tidal Landscape I","HVF-TL 01","tl1",5,2,[size('24" × 48"',16199,15599),size('36" × 60"',22750,20499)],"50 mm","Layered contours in mineral blue, sage and warm sand become a wide sculptural terrain.","webp","Vertical"),
    make("tidal-landscape-02","Tidal Landscape","Tidal Landscape II","HVF-TL 02","tl2",5,2,[size('60" × 24"',26999,24299)],"60 mm","A panoramic field of landforms and water-like channels for long architectural walls.","webp","Landscape"),
    make("tidal-landscape-03","Tidal Landscape","Tidal Landscape III","HVF-TL 02","tl3",4,1,[size('60" × 24"',26999,24299)],"60 mm","Macro topographies sweep across a broad horizontal composition with softened relief.","png","Landscape"),

    {...make("lotus-bloom-01","Lotus Bloom","Lotus Bloom I","HVE-LB 01","lb1",1,1,[size('18" × 18"',9999,8999),size('24" × 24"',14999,13499)],"50 mm","The lotus reduced to warm layered geometry and sculptural depth.","png","Square"),imgs:["assets/images/lb1.1.png","assets/images/lb1.2.webp","assets/images/lb1.3.webp","assets/images/lb1.4.webp","assets/images/lb1.5.webp"]},
    make("lotus-bloom-02","Lotus Bloom","Lotus Bloom II","HVE-LB 02","lb2",5,1,[size('24" × 24"',17999,16199)],"60 mm","An expanded floral rhythm with deeper petals and gentle tonal contrast.","png","Square"),
    make("lotus-bloom-03","Lotus Bloom","Lotus Bloom III","HVE-LB 03","lb3",4,1,[size('18" × 18"',9999,8999),size('24" × 24"',14999,13499)],"36 mm","A quieter lotus study shaped through overlapping petals and balanced voids.","png","Square"),

    make("eclipse-01","Eclipse","Eclipse I","HVE-EC 01","ec1",4,1,[size('18" × 18"',9999,8999),size('24" × 24"',14999,13499)],"40 mm","Overlapping circular planes hold contrast, shadow and a measured sense of orbit.","png","Square"),
    make("eclipse-02","Eclipse","Eclipse II","HVE-EC 02","ec2",4,1,[size('18" × 18"',9999,8999),size('24" × 24"',14999,13499)],"40 mm","A deeper celestial study with layered arcs and a warm illuminated centre.","png","Square"),
    make("eclipse-03","Eclipse","Eclipse III","HVE-EC 03","ec3",4,1,[size('18" × 18"',9999,8999),size('24" × 24"',14999,13499)],"40 mm","Concentric movement and asymmetrical overlap create a calm graphic focal point.","png","Square")
  ];
})();