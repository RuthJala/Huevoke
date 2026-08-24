(() => {
  const img=(prefix,n,ext="webp",hero=1)=>[hero,...Array.from({length:n},(_,i)=>i+1).filter(i=>i!==hero)].map(i=>`assets/images/${prefix}.${i}.${ext}`);
  const rect=[{size:'24" × 36"',price:18500},{size:'30" × 48"',price:27500}];
  const wide=[{size:'36" × 24"',price:18500},{size:'48" × 30"',price:27500}];
  const square=[{size:'18" × 18"',price:9500},{size:'24" × 24"',price:14500},{size:'36" × 36"',price:24500}];
  const specs=(thickness,orientation="Vertical")=>({
    thickness,material:"Premium high-density MDF",finish:"Hand-finished silky ultra-matte",mounting:"Pre-installed French cleat",orientation,care:"Dust gently with a clean, dry microfibre cloth",leadTime:"8–12 days"
  });
  const make=(slug,series,name,code,prefix,count,hero,sizes,thickness,desc,ext="webp",orientation="Vertical")=>({slug,series,name,code,imgs:img(prefix,count,ext,hero),sizes,desc,specs:specs(thickness,orientation)});

  window.HUEVOKE_PRODUCTS=[
    make("contour-flow-01","Contour Flow","Contour Flow I","HV-F01 CF","cf1",5,1,rect,"40 mm","Broad organic planes create movement through measured relief and shadow."),
    make("contour-flow-02","Contour Flow","Contour Flow II","HV-F02 CF","cf2",5,1,rect,"50 mm","Deep curved recesses move across the surface with a calm architectural rhythm."),
    make("contour-flow-03","Contour Flow","Contour Flow III","HV-F03 CF","cf3",5,1,rect,"50 mm","Linear contours open into a quiet central field with generous negative space."),
    make("erosion-01","Erosion","Erosion I","HV-F04 ER","e1",4,2,rect,"50 mm","An irregular silhouette softened by time, grounded in warm mineral tones."),
    make("erosion-02","Erosion","Erosion II","HV-F05 ER","e2",4,2,rect,"40 mm","Nested organic cavities form a composed study of erosion and depth."),
    make("fluid-motion-01","Fluid Motion","Fluid Motion I","HV-F06 FM","fm1",5,2,rect,"50 mm","Sage, sand and slate layers flow through one continuous sculptural gesture."),
    make("fluid-motion-02","Fluid Motion","Fluid Motion II","HV-F07 FM","fm2",4,2,rect,"50 mm","A freer internal rhythm with deeper blue-grey relief and a soft perimeter."),
    make("balance-01","Balance","Balance I","HV-F08 BL","b1",4,2,square,"50 mm","Contrasting masses held in a circular boundary explore balance without literal symmetry.","webp","Square"),
    make("balance-02","Balance","Balance II","HV-F09 BL","b2",5,2,square,"50 mm","Soft curves and tonal contrast create tension between visual weight and openness.","webp","Square"),
    make("balance-03","Balance","Balance III","HV-F10 BL","b3",5,2,square,"50 mm","Three flowing fields form a quiet graphic composition for contemporary interiors.","webp","Square"),
    make("tidal-landscape-01","Tidal Landscape","Tidal Landscape I","HV-F11 TL","tl1",5,2,wide,"40 mm","Layered contours in mineral blue, sage and warm sand become a wide sculptural terrain.","webp","Landscape"),
    make("tidal-landscape-02","Tidal Landscape","Tidal Landscape II","HV-F12 TL","tl2",5,2,wide,"40 mm","A panoramic field of landforms and water-like channels for long architectural walls.","webp","Landscape"),
    make("tidal-landscape-03","Tidal Landscape","Tidal Landscape III","HV-F13 TL","tl3",4,1,wide,"45 mm","Macro topographies sweep across a broad horizontal composition with softened relief.","png","Landscape"),
    {...make("lotus-bloom-01","Lotus Bloom","Lotus Bloom I","HV-E01 LB","lb1",1,1,square,"30 mm","The lotus reduced to warm layered geometry and sculptural depth.","png","Square"),imgs:["assets/images/lb1.1.png","assets/images/lb1.2.webp","assets/images/lb1.3.webp","assets/images/lb1.4.webp","assets/images/lb1.5.webp"]},
    make("lotus-bloom-02","Lotus Bloom","Lotus Bloom II","HV-E02 LB","lb2",5,1,square,"35 mm","An expanded floral rhythm with deeper petals and gentle tonal contrast.","png","Square"),
    make("lotus-bloom-03","Lotus Bloom","Lotus Bloom III","HV-E03 LB","lb3",4,1,square,"35 mm","A quieter lotus study shaped through overlapping petals and balanced voids.","png","Square"),
    make("eclipse-01","Eclipse","Eclipse I","HV-E04 EC","ec1",4,1,square,"30 mm","Overlapping circular planes hold contrast, shadow and a measured sense of orbit.","png","Square"),
    make("eclipse-02","Eclipse","Eclipse II","HV-E05 EC","ec2",4,1,square,"35 mm","A deeper celestial study with layered arcs and a warm illuminated centre.","png","Square"),
    make("eclipse-03","Eclipse","Eclipse III","HV-E06 EC","ec3",4,1,square,"35 mm","Concentric movement and asymmetrical overlap create a calm graphic focal point.","png","Square")
  ];
})();

