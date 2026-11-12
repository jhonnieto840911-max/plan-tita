import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.querySelector('#scene-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb9d7df);
scene.fog = new THREE.Fog(0xb9d7df, 35, 90);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
camera.position.set(17, 13, 22);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3.5, 0);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight(0xffffff, 0x668078, 2));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(12, 20, 10); sun.castShadow = true; scene.add(sun);

const materials = {
  concrete: new THREE.MeshStandardMaterial({ color: 0xbfc9cc, roughness: .85 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x647985, metalness: .65, roughness: .35 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x168fbd, metalness: .25, roughness: .3 }),
  water: new THREE.MeshStandardMaterial({ color: 0x21b8e6, transparent: true, opacity: .72 }),
  pipe: new THREE.MeshStandardMaterial({ color: 0xd99a3d, metalness: .45, roughness: .4 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xe4e9e8, roughness: .9 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x263b46, metalness: .4, roughness: .5 }),
  green: new THREE.MeshStandardMaterial({ color: 0x6d9875 })
};

function box(name, x,y,z, sx,sy,sz, mat, parent=scene) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz), mat);
  mesh.name=name; mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
function cylinder(name,x,y,z,rt,rb,h,mat,segments=48,parent=scene) {
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),mat);
  mesh.name=name; mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
function pipeBetween(name, a, b, radius=.11, material=materials.pipe) {
  const start=new THREE.Vector3(...a), end=new THREE.Vector3(...b);
  const dir=new THREE.Vector3().subVectors(end,start);
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,dir.length(),16),material);
  mesh.name=name; mesh.position.copy(start).add(end).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());
  mesh.castShadow=true; scene.add(mesh); return mesh;
}

// Terreno y plataforma
box('Terreno',0,-.35,0,34,.5,25,materials.green);
box('Losa de planta',0,-.04,0,25,.18,17,materials.concrete);

// Caseta de control
box('Caseta de control',-8,1.55,-4,5,3,4,materials.wall);
box('Techo caseta',-8,3.15,-4,5.3,.25,4.3,materials.dark);
box('Ventana frontal',-8,1.9,-1.96,1.5,1,.06,materials.blue);
box('Puerta',-6.2,1,-1.94,.85,2,.08,materials.dark);

// Torre de almacenamiento: tanque conceptual de 50 m3
const towerX=0, towerZ=-3;
for (const [x,z] of [[-2,-5],[2,-5],[-2,-1],[2,-1]]) {
  box('Columna torre',x,3.2,z,.35,6.4,.35,materials.steel);
}
for (const y of [.5,3.5,6.3]) {
  box('Viga torre',0,y,-5,4.3,.22,.22,materials.steel);
  box('Viga torre',0,y,-1,4.3,.22,.22,materials.steel);
  box('Viga torre',-2,y,-3,.22,.22,4.2,materials.steel);
  box('Viga torre',2,y,-3,.22,.22,4.2,materials.steel);
}
cylinder('Tanque 50000 litros',towerX,8.2,towerZ,2.25,2.25,3.2,materials.blue,64);
cylinder('Cubierta tanque',towerX,9.85,towerZ,2.27,2.27,.18,materials.steel,64);
cylinder('Agua tanque',towerX,7.25,towerZ,2.12,2.12,1.25,materials.water,64);
const waterMesh=scene.getObjectByName('Agua tanque');
waterMesh.userData.baseY=7.25;
cylinder('Base tanque',towerX,6.55,towerZ,2.3,2.3,.22,materials.steel,64);
pipeBetween('Tubería de entrada',[-5,2,-4],[0,7,-3],.12);
pipeBetween('Bajante tanque',[2.25,7,-3],[4,1,-3],.14);

// Estación de cuatro bombas
box('Base estación de bombeo',7,.18,-2,9,.35,6,materials.concrete);
const pumpGroups=[];
for(let i=0;i<4;i++){
  const x=4+i*2;
  const group=new THREE.Group(); group.position.set(x,.45,-2); scene.add(group);
  const body=cylinder('Cuerpo bomba',0,.65,0,.48,.48,1.15,materials.blue,32,group);
  body.rotation.z=Math.PI/2;
  const motor=box('Motor bomba',.85,.65,0,1.1,.65,.65,materials.dark,group);
  cylinder('Brida bomba',-.55,.65,0,.27,.27,.16,materials.steel,24,group).rotation.z=Math.PI/2;
  pumpGroups.push(group);
}
pipeBetween('Colector succión',[3.5,.9,-4],[11.5,.9,-4],.16);
pipeBetween('Colector descarga',[3.5,1.65,0],[11.5,1.65,0],.16);
for(let i=0;i<4;i++){
  const x=4+i*2;
  pipeBetween('Ramal succión',[x,.9,-4],[x,.9,-2],.09);
  pipeBetween('Ramal descarga',[x,1.65,-2],[x,1.65,0],.09);
}
pipeBetween('Impulsión hacia red',[11.5,1.65,0],[14,1.65,5],.17);
pipeBetween('Red principal',[14,1.65,5],[5,1.65,7],.13);
pipeBetween('Ramificación red',[5,1.65,7],[-5,1.65,7],.1);

// Elementos visuales del entorno
for(let i=0;i<7;i++){
  box('Bloque urbano',-11+i*3.6,.65,10,2.4,1.3,2.2,materials.wall);
}
const grid=new THREE.GridHelper(34,34,0x78969b,0x9bb2b1);
grid.position.y=-.08; scene.add(grid);

function resize(){
  const w=container.clientWidth, h=container.clientHeight;
  camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
}
window.addEventListener('resize',resize); resize();

const slider=document.querySelector('#level-slider');
const levelValue=document.querySelector('#level-value');
const levelBar=document.querySelector('#level-bar');
const volumeValue=document.querySelector('#volume-value');
function updateLevel(){
  const value=Number(slider.value);
  levelValue.textContent=value+'%'; levelBar.style.width=value+'%';
  volumeValue.textContent=Math.round(50000*value/100).toLocaleString('es-CO')+' L';
  waterMesh.scale.y=Math.max(.01,value/75);
  waterMesh.position.y=6.63 + (1.25*value/100)/2;
}
slider.addEventListener('input',updateLevel); updateLevel();

const states=[true,true,false,false];
const pumpControls=document.querySelector('#pump-controls');
function renderPumps(){
  pumpControls.innerHTML='';
  states.forEach((on,i)=>{
    const row=document.createElement('div'); row.className='pump';
    const label=document.createElement('span'); label.textContent=`Bomba ${i+1} · ${on?'Encendida':'Apagada'}`;
    const button=document.createElement('button'); button.textContent=on?'APAGAR':'ENCENDER'; button.className=on?'on':'';
    button.addEventListener('click',()=>{states[i]=!states[i];renderPumps();});
    row.append(label,button); pumpControls.append(row);
  });
  document.querySelector('#pump-count').textContent=states.filter(Boolean).length+' / 4';
}
renderPumps();

function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera); }
animate();
