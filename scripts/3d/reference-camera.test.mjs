import assert from 'node:assert/strict';
import test from 'node:test';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {fitReferenceCamera} from '../../public/modelos-3d/reference-camera.mjs';

test('axle framing remains aligned on both bike sides and portrait/landscape panels',()=>{
  for(const [width,height] of [[580,435],[360,360],[288,360]])for(const side of [1,-1]){
    const camera=new T.PerspectiveCamera(34,1,.015,80),photoAxles=side===1?[[350,1240],[1470,1215]]:[[1560,1310],[390,1350]];
    const result=fitReferenceCamera(camera,{width,height,photoSize:[1920,1713],photoAxles,modelAxles:[new T.Vector3(-.58,.293,.085*side),new T.Vector3(.58,.293,.085*side)],direction:[-.95,.3,3*side],fov:18});
    assert.ok(result.maxAnchorErrorPx<.01,`Axle projection drift: ${result.maxAnchorErrorPx}`);
    assert.ok(camera.position.toArray().every(Number.isFinite));
    assert.ok(camera.position.distanceTo(result.target)>.8);
  }
});

test('alignment rejects unusable viewport and coincident reference points',()=>{
  const camera=new T.PerspectiveCamera(),args={width:580,height:435,photoSize:[1920,1713],photoAxles:[[0,0],[0,0]],modelAxles:[new T.Vector3(),new T.Vector3(1,0,0)],direction:[-1,.3,3],fov:18};
  assert.throws(()=>fitReferenceCamera(camera,args),/distinct/);
  assert.throws(()=>fitReferenceCamera(camera,{...args,width:0}),/positive/);
});

test('interactive orbit controls preserve the fitted axle framing',()=>{
  const camera=new T.PerspectiveCamera(34,1,.015,80),controls=new OrbitControls(camera);
  controls.maxPolarAngle=Math.PI*.49;controls.maxDistance=35;
  const modelAxles=[new T.Vector3(-.58,.293,.087),new T.Vector3(.58,.293,.087)];
  const fit=fitReferenceCamera(camera,{width:520,height:437,photoSize:[1920,1713],photoAxles:[[565,1260],[1483,1198]],modelAxles,direction:[-2.8,.42,3],fov:14});
  controls.target.copy(fit.target);controls.update();camera.updateMatrixWorld(true);
  for(const [i,p] of modelAxles.entries()){
    const v=p.clone().project(camera),screen=new T.Vector2((v.x+1)*260,(1-v.y)*218.5);
    assert.ok(screen.distanceTo(fit.expected[i])<.01,'Orbit update must not change the fitted projection');
  }
});
