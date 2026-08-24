import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const section=document.querySelector("#depthShowcase");
const stage=document.querySelector("#depthStage");
const mount=document.querySelector("#lotusModel");
if(!section||!stage||!mount) throw new Error("Lotus 3D stage is missing");

const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(30,1,.01,100);
camera.position.set(0,.12,5.6);

const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setClearColor(0x000000,0);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
mount.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xfff8ee,0x8f7968,2.35));
const key=new THREE.DirectionalLight(0xfff5e8,4.2);
key.position.set(3.8,5.5,5.5); key.castShadow=true; scene.add(key);
const fill=new THREE.DirectionalLight(0xf3d3c6,2.1);
fill.position.set(-4,1.2,3); scene.add(fill);
const rim=new THREE.DirectionalLight(0xffead5,2.4);
rim.position.set(2,-2,-4); scene.add(rim);

const root=new THREE.Group();
scene.add(root);
let product=null;
let current=0,target=0,pointerX=0,pointerY=0,targetX=0,targetY=0,dragging=false,lastX=0,dragOffset=0;
let needsRender=true;

new GLTFLoader().load(
  "assets/images/lotus_bloom_web.glb",
  gltf=>{
    product=gltf.scene;
    const backingMeshes=[];
    product.traverse(object=>{
      if(object.name==="Lotus_Circular_Base"){backingMeshes.push(object);return}
      if(!object.isMesh)return;
      object.castShadow=true;
      object.receiveShadow=true;
      const materials=Array.isArray(object.material)?object.material:[object.material];
      for(const material of materials){
        if(!material)continue;
        material.metalness=0;
        material.roughness=Math.min(.68,Math.max(.46,material.roughness??.56));
        if("clearcoat" in material){material.clearcoat=.14;material.clearcoatRoughness=.48}
        material.needsUpdate=true;
      }
    });
    backingMeshes.forEach(object=>object.parent?.remove(object));
    const box=new THREE.Box3().setFromObject(product);
    const center=box.getCenter(new THREE.Vector3());
    const sphere=box.getBoundingSphere(new THREE.Sphere());
    product.position.sub(center);
    const fitted=1.78/Math.max(sphere.radius,.001);
    product.scale.setScalar(fitted);
    root.add(product);
    mount.classList.add("is-loaded");
    needsRender=true;
  },
  undefined,
  error=>{mount.classList.add("has-error");console.error("Lotus GLB failed to load",error)}
);

function resize(){
  const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();needsRender=true;
}
new ResizeObserver(resize).observe(mount);resize();

function readScroll(){
  const rect=section.getBoundingClientRect();
  target=clamp(-rect.top/Math.max(1,rect.height-innerHeight));
  needsRender=true;
}
function frame(){
  current+=(target-current)*.075;
  pointerX+=(targetX-pointerX)*.065;pointerY+=(targetY-pointerY)*.065;
  const p=reduced ? .56 : current;
  const reveal=clamp((p-.58)/.18);
  stage.style.setProperty("--lotus-progress",p.toFixed(4));
  stage.style.setProperty("--lotus-scale",(0.82+Math.sin(p*Math.PI)*.09+p*.03).toFixed(4));
  stage.style.setProperty("--lotus-lift",`${(-2+Math.sin(p*Math.PI*2)*1.8).toFixed(2)}vh`);
  stage.style.setProperty("--lotus-roll",`${(-1.5+p*3+pointerX).toFixed(2)}deg`);
  stage.style.setProperty("--lotus-x",`${(pointerX*10).toFixed(2)}px`);
  stage.style.setProperty("--lotus-y",`${(pointerY*7).toFixed(2)}px`);
  stage.style.setProperty("--lotus-copy",reveal.toFixed(3));
  if(product){
    root.rotation.y=(-.32+p*.64)+(pointerX*.1)+(dragOffset*.28);
    root.rotation.x=(Math.PI/2-.2+Math.sin(p*Math.PI)*.18)+(pointerY*.06);
    root.rotation.z=(-.14+p*.72)+dragOffset;
  }
  renderer.render(scene,camera);
  if(Math.abs(target-current)>.0005||Math.abs(targetX-pointerX)>.002||Math.abs(targetY-pointerY)>.002||needsRender){
    needsRender=false;requestAnimationFrame(frame);
  }
}
mount.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;mount.setPointerCapture?.(e.pointerId)});
mount.addEventListener("pointermove",e=>{
  const r=mount.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2;
  if(dragging){dragOffset+=(e.clientX-lastX)*.008;lastX=e.clientX}needsRender=true;requestAnimationFrame(frame);
});
mount.addEventListener("pointerup",()=>{dragging=false});
mount.addEventListener("pointercancel",()=>{dragging=false});
mount.addEventListener("pointerleave",()=>{targetX=0;targetY=0;dragging=false;needsRender=true;requestAnimationFrame(frame)});
addEventListener("scroll",readScroll,{passive:true});addEventListener("resize",()=>{resize();readScroll()},{passive:true});
readScroll();requestAnimationFrame(frame);

