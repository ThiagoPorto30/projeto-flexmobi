import assert from 'node:assert/strict';
import test from 'node:test';
import * as T from 'three';
import {buildV20} from './v20-detail.mjs';

// Inspect actual unmerged geometry, not just desired coordinates in a report.
// These checks cover selected visible connections, not every joint of the bike.
const {root}=buildV20({merge:false}),triangles=new WeakMap();
const named=name=>{const out=[];root.traverse(o=>{if(o.isMesh&&o.name===name)out.push(o);});assert.ok(out.length,`Missing part: ${name}`);return out;};
function distanceToSurface(point,mesh){
  if(!triangles.has(mesh)){
    const g=mesh.geometry,p=g.attributes.position,ix=g.index,out=[];
    for(let i=0;i<(ix?.count??p.count);i+=3){
      const v=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,ix?ix.getX(i+j):i+j).applyMatrix4(mesh.matrixWorld));
      out.push(new T.Triangle(...v));
    }
    triangles.set(mesh,out);
  }
  const nearest=new T.Vector3();let d=Infinity;
  for(const triangle of triangles.get(mesh))d=Math.min(d,triangle.closestPointToPoint(point,nearest).distanceTo(point));
  return d;
}
function endpointDistance(tube,t,host){
  const p=tube.geometry.parameters.path.getPoint(t).applyMatrix4(tube.matrixWorld);
  return gapToSolid(p,host);
}
function gapToSolid(point,mesh){
  const surface=distanceToSurface(point,mesh);
  if(surface<1e-8)return 0;
  // A mount endpoint embedded inside a closed host is connected, not separated
  // by its distance to the nearest outside face. Ray parity distinguishes this.
  const ray=new T.Ray(point,new T.Vector3(1,.337,.219).normalize()),hit=new T.Vector3(),hits=[];
  for(const tri of triangles.get(mesh))if(ray.intersectTriangle(tri.a,tri.b,tri.c,false,hit))hits.push(hit.distanceTo(point));
  const unique=hits.sort((a,b)=>a-b).filter((d,i,all)=>i===0||d-all[i-1]>1e-7);
  return unique.length%2===1?0:surface;
}

test('display support arms meet both handlebar clamps and the articulated base',()=>{
  const base=named('Base articulada do display')[0],screen=named('Display LCD')[0];
  for(const side of ['esquerdo','direito']){
    const arm=named(`Braço do display ${side}`)[0],clamp=named(`Abraçadeira do display ${side}`)[0];
    assert.ok(endpointDistance(arm,0,clamp)<.005,'Lower arm must meet its clamp');
    assert.ok(endpointDistance(arm,1,base)<.005,'Upper arm must meet the display base');
  }
  const top=new T.Vector3(0,.002,0).applyMatrix4(base.matrixWorld);
  assert.ok(distanceToSurface(top,screen)<.0006,'Display must sit on its mounting plate');
});

test('seat piping stays on the upholstery instead of floating above the shoulder',()=>{
  const seat=named('Banco principal esculpido')[0];
  for(const name of ['Vivo assentado no estofado','Acabamento inferior assentado'])for(const trim of named(name)){
    for(let i=1;i<24;i++){
      const p=trim.geometry.parameters.path.getPoint(i/24).applyMatrix4(trim.matrixWorld),d=distanceToSurface(p,seat);
      assert.ok(d<.0018,`${name}: ${(d*1000).toFixed(2)} mm separation`);
    }
  }
});

test('wheel reflector clips meet cast spokes and reflector faces',()=>{
  for(const clip of named('Presilha do refletor no raio')){
    const front=clip.position.z>0,side=front?1:-1;
    const spokes=clip.parent.children.filter(o=>o.name==='Raio duplo fundido');
    const inner=[-.012,.012].map(y=>new T.Vector3(0,y,-side*.0045).applyMatrix4(clip.matrixWorld));
    const gap=Math.min(...inner.flatMap(p=>spokes.map(o=>gapToSolid(p,o))));
    assert.ok(gap<.003,`Reflector clip must meet a spoke: ${gap*1000} mm`);
    const outer=new T.Vector3(0,0,side*.0045).applyMatrix4(clip.matrixWorld);
    const face=clip.parent.children.find(o=>o.name==='Refletor de roda'&&Math.sign(o.position.z)===side);
    assert.ok(gapToSolid(outer,face)<.0015,'Amber face must sit in its clip');
  }
});

test('tail lamp bracket occupies the rear base and lamp housing attachment regions',()=>{
  const mount=named('Suporte dobrado da lanterna')[0],base=named('Base traseira')[0],housing=named('Carcaça da lanterna')[0];
  const points=[[.783,.871,0],[.804,.850,0]];
  for(const [i,host] of [base,housing].entries()){
    const p=new T.Vector3(...points[i]).applyMatrix4(mount.parent.matrixWorld);
    assert.ok(gapToSolid(p,mount)<.004,'Attachment point must reach the bracket');
    assert.ok(gapToSolid(p,host)<.001,'Bracket must enter the host attachment region');
  }
});

test('battery markings and controls stay attached to the side cover',()=>{
  const panels=named('Painel lateral');
  for(const logo of named('Logotipo INOW original')){
    const panel=panels.find(o=>Math.sign(o.position.z)===Math.sign(logo.position.z));
    assert.ok(distanceToSurface(new T.Vector3().applyMatrix4(logo.matrixWorld),panel)<.0004,'Logo must remain close to the panel face');
  }
  const panel=panels.find(o=>o.position.z>0);
  for(const name of ['Porta de carga','Interruptor vermelho','Botão indicador','Janela do indicador'])for(const control of named(name)){
    control.geometry.computeBoundingBox();
    const point=new T.Vector3(0,0,control.geometry.boundingBox.min.z).applyMatrix4(control.matrixWorld);
    assert.ok(gapToSolid(point,panel)<.001,`${name} must meet the battery cover`);
  }
});
