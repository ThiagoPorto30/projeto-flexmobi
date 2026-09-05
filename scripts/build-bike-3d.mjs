import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';

// Photo-guided study, not a measured replica. Coordinates in approximate metres.
// References: public/imagens/{026,014,016,042,056,060}_v20-brake-pro-*.jpg.
const bike = new T.Group(); bike.name = 'V20 Brake Pro - estudo aproximado';
bike.userData = { status: 'Illustrative photo-guided reconstruction; dimensions and hidden surfaces inferred.' };
const mat = (color, roughness, metalness=0) => new T.MeshStandardMaterial({color,roughness,metalness});
const frame=mat('#191b1c',.29,.7), rubber=mat('#232426',.94), seat=mat('#252426',.82), silver=mat('#a5adb1',.25,.85), amber=mat('#d48d24',.3), lens=mat('#dbe2dd',.2,.35), red=mat('#a62a20',.3), battery=mat('#303134',.52,.25);
function mesh(name,g,m,p=[0,0,0]) { const o=new T.Mesh(g,m);o.name=name;o.position.set(...p);bike.add(o);return o; }
function tube(name,a,b,r=.018,m=frame) { const v=new T.Vector3(...b).sub(new T.Vector3(...a));const o=mesh(name,new T.CylinderGeometry(r,r,v.length(),12),m,new T.Vector3(...a).addScaledVector(v,.5).toArray());o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o; }
const boxes=new Map();
function box(name,p,size,m=frame,r=.01) {const key=[...size,r].join(',');if(!boxes.has(key))boxes.set(key,new RoundedBoxGeometry(...size,2,r));return mesh(name,boxes.get(key),m,p);}
function ring(name,p,r,w,m=frame,arc=Math.PI*2) { return mesh(name,new T.TorusGeometry(r,w,10,64,arc),m,p); }
function path(name,points,r,m=frame) {return mesh(name,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),Math.max(24,points.length*3),r,8,false),m);}
const front=-.61,rear=.61,cy=.305;
for(const x of [front,rear]) {
 const tire=ring('Pneu largo',[x,cy,0],.255,.051,rubber); tire.scale.z=1.12;
 ring('Aro',[x,cy,0],.208,.018,frame);
 for(const z of [-.049,.049]) ring('Borda do aro',[x,cy,z],.208,.008,frame);
 tube('Cubo',[x,cy,-.07],[x,cy,.07],x===rear?.057:.031);
 for(let k=0;k<7;k++) {const a=k*Math.PI*2/7;for(const z of [-.035,.035])tube('Raio fundido',[x+.035*Math.cos(a),cy+.035*Math.sin(a),z],[x+.205*Math.cos(a+.13),cy+.205*Math.sin(a+.13),z],.009);}
 for(let i=0;i<56;i++) { const a=i*Math.PI*2/56;for(const z of [-.034,0,.034]){const o=box('Cravo do pneu',[x+.303*Math.cos(a),cy+.303*Math.sin(a),z],[.016,.006,.025],rubber,.002);o.rotation.z=a-Math.PI/2;}}
 const z=.076;ring('Pista do freio',[x,cy,z],.094,.008,silver);
 for(let k=0;k<6;k++){const a=k*Math.PI/3;tube('Disco vazado',[x+.027*Math.cos(a),cy+.027*Math.sin(a),z],[x+.087*Math.cos(a+.35),cy+.087*Math.sin(a+.35),z],.006,silver);}
 box('Pinça de freio',[x-.04,cy+.087,.082],[.047,.055,.026]);
 tube('Eixo cromado',[x,cy,-.085],[x,cy,.089],.013,silver);
 const reflector=box('Refletor lateral',[x-.14,cy+.108,.06],[.07,.022,.014],amber,.004);reflector.rotation.z=.6;
 // Curved mudguard with a broad, flattened cross section.
 const f=ring('Paralama',[x,cy,0],.334,.022,frame,Math.PI*.88);f.rotation.z=Math.PI*.06;f.scale.z=2.6;
 for(const side of [-1,1]) tube('Haste do paralama',[x,cy,.065*side],[x+.24,cy+.21,.06*side],.003,silver);
}
const head=[-.43,.86,0], crank=[.02,.36,0];
for(const z of [-.055,.055]) {
 path('Quadro inferior',[[-.47,.76,z],[-.27,.58,z],[.02,.36,z],[.19,.30,z],[.61,.305,z]],.023);
 path('Longarina superior',[[-.43,.86,z],[-.28,.85,z],[.01,.68,z],[.15,.59,z]],.024);
 tube('Tubo do selim',[.02,.36,z],[.31,.83,z],.022);
 tube('Suporte do banco',[-.22,.85,z],[.36,.85,z],.02);
 tube('Balança traseira',[.02,.36,z],[.61,.305,z],.022);
 tube('Triângulo traseiro',[.23,.58,z],[.61,.305,z],.016);
 path('Bagageiro',[[.3,.79,z],[.51,.78,z],[.83,.87,z]],.016);
 tube('Suporte traseiro',[.43,.79,z],[.73,.94,z],.014);
 for(let i=0;i<3;i++)tube('Travessa sob banco',[-.18+i*.15,.845,z],[-.07+i*.15,.74,z],.011);
}
tube('Caixa de direção',[-.49,.73,0],[-.41,.93,0],.042);
for(const z of [-.08,.08]) {
 tube('Garfo inferior',[front,cy,z],[-.49,.69,z],.025);
 tube('Suspensão cromada',[-.49,.69,z],[-.43,.86,z],.016,silver);
 tube('Mesa superior',[-.43,.86,z],[-.415,.92,z],.025);
}
tube('Mesa transversal',[-.435,.86,-.11],[-.435,.86,.11],.025);
tube('Avanço',[-.41,.92,0],[-.46,1.12,0],.024);
path('Guidão',[[-.46,1.12,-.3],[-.43,1.13,-.17],[-.46,1.12,0],[-.43,1.13,.17],[-.46,1.12,.3]],.012);
for(const s of [-1,1]) {
 tube('Manopla',[-.46,1.12,.2*s],[-.46,1.12,.32*s],.023,rubber);
 tube('Manete',[-.46,1.11,.19*s],[-.52,1.10,.29*s],.006,silver);
 path('Cabo do freio',[[-.49,1.10,.19*s],[-.57,.99,.12*s],[-.5,.75,.1*s],[-.62,.39,.085*s]],.003,rubber);
}
box('Display',[-.455,1.15,0],[.065,.014,.083],frame,.008).rotation.z=.2;
box('Tela',[-.456,1.16,0],[.05,.003,.062],mat('#19383d',.15,.25),.004).rotation.z=.2;
tube('Suporte do farol',[-.45,.79,0],[-.57,.79,0],.015);
tube('Corpo do farol',[-.56,.79,0],[-.64,.79,0],.073);
tube('Lente do farol',[-.641,.79,0],[-.648,.79,0],.064,lens);
for(const z of [-.033,.033])tube('Grade do farol',[-.65,.743,z],[-.65,.837,z],.004);
const pack=box('Bateria removível',[-.15,.555,0],[.18,.43,.123],battery,.025);pack.rotation.z=.67;
const rail=box('Trilho da bateria',[-.12,.535,0],[.19,.43,.13],frame,.015);rail.rotation.z=.67;rail.position.z=-.008;
box('Banco principal',[.105,.91,0],[.57,.085,.225],seat,.038);
box('Base do banco',[.105,.867,0],[.55,.024,.20],frame,.01);
box('Banco traseiro',[.68,.975,0],[.255,.077,.22],seat,.032);
box('Base traseira',[.68,.93,0],[.26,.019,.21]);
box('Lanterna traseira',[.82,.9,0],[.025,.026,.11],red,.005);
const a=new T.Vector3(.12,.73,0),b=new T.Vector3(.30,.54,0),axis=b.clone().sub(a),u=new T.Vector3(0,0,1),v=new T.Vector3().crossVectors(axis.clone().normalize(),u);
tube('Amortecedor',a.toArray(),b.toArray(),.015,silver);
const helix=[];for(let i=0;i<=180;i++){const t=i/180,ang=t*Math.PI*18;helix.push(a.clone().addScaledVector(axis,t).addScaledVector(u,.031*Math.cos(ang)).addScaledVector(v,.031*Math.sin(ang)).toArray());}path('Mola helicoidal',helix,.006);
ring('Coroa',[.02,.36,-.10],.10,.012);
for(let i=0;i<5;i++){const a=i*Math.PI*2/5;tube('Braço da coroa',[.02,.36,-.1],[.02+.09*Math.cos(a),.36+.09*Math.sin(a),-.1],.009);}
path('Corrente',[[.02,.46,-.115],[.6,.36,-.115],[.655,.30,-.115],[.6,.26,-.115],[.02,.26,-.115],[-.08,.35,-.115],[.02,.46,-.115]],.004,silver);
for(const s of [-1,1]) {tube('Pedivela',[.02,.36,.10*s],[.02+.09*s,.36-.09*s,.12*s],.013,silver);box('Pedal',[.02+.09*s,.36-.09*s,.18*s],[.10,.022,.075]);box('Refletor do pedal',[.02+.09*s,.36-.09*s,.219*s],[.063,.013,.003],amber,.002);}
tube('Descanso lateral',[.30,.34,.07],[.4,.025,.18],.012);box('Pé do descanso',[.40,.018,.18],[.055,.025,.045]);
for(const x of [-.43,.02,.31,.61])for(const s of [-1,1])tube('Parafuso',[x,x===.61?.305:.85,.065*s],[x,x===.61?.305:.85,.073*s],.009,silver);
bike.updateMatrixWorld(true);
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(r=>{this.result=r;this.onloadend?.();});} };
const output='public/modelos-3d';await mkdir(output,{recursive:true});
const glb=await new GLTFExporter().parseAsync(bike,{binary:true});await writeFile(`${output}/v20-brake-pro-estudo.glb`,Buffer.from(glb));
// Local viewer dependencies: no third-party requests when opening the preview.
await mkdir(`${output}/vendor`,{recursive:true});
for(const [src,dst] of [['build/three.module.js','three.module.js'],['build/three.core.js','three.core.js'],['examples/jsm/controls/OrbitControls.js','OrbitControls.js'],['examples/jsm/loaders/GLTFLoader.js','GLTFLoader.js'],['examples/jsm/utils/BufferGeometryUtils.js','BufferGeometryUtils.js']])await copyFile(`node_modules/three/${src}`,`${output}/vendor/${dst}`);
// GLTFLoader uses this relative import; preserve its directory structure.
await mkdir(`${output}/utils`,{recursive:true});await copyFile('node_modules/three/examples/jsm/utils/BufferGeometryUtils.js',`${output}/utils/BufferGeometryUtils.js`);
await copyFile('node_modules/three/examples/jsm/utils/SkeletonUtils.js',`${output}/utils/SkeletonUtils.js`);
await copyFile('node_modules/three/LICENSE',`${output}/vendor/LICENSE.txt`);
console.log(`GLB criado: ${(glb.byteLength/1024/1024).toFixed(2)} MB; ${bike.children.length} peças.`);
