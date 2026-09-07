import * as T from 'three';

// Two manually identified axle centres stabilize framing across model revisions.
// This is a photographic comparison aid, not a calibrated photogrammetry solve.
export function fitReferenceCamera(camera, {width,height,photoSize,photoAxles,modelAxles,direction,fov}) {
  if(!(width>0&&height>0))throw new Error('Reference viewport must have positive dimensions');
  const [iw,ih]=photoSize,scale=Math.min(width/iw,height/ih);
  const expected=photoAxles.map(([x,y])=>new T.Vector2((width-iw*scale)/2+x*scale,(height-ih*scale)/2+y*scale));
  const span=expected[0].distanceTo(expected[1]);
  if(span<1||modelAxles[0].distanceTo(modelAxles[1])<.01)throw new Error('Reference axles must be distinct');
  const target=modelAxles[0].clone().add(modelAxles[1]).multiplyScalar(.5),dir=new T.Vector3(...direction).normalize();
  camera.clearViewOffset();camera.fov=fov;camera.aspect=width/height;camera.up.set(0,1,0);camera.updateProjectionMatrix();
  const project=()=>modelAxles.map(p=>{const v=p.clone().project(camera);return new T.Vector2((v.x+1)*width/2,(1-v.y)*height/2);});
  const pose=distance=>{camera.position.copy(target).addScaledVector(dir,distance);camera.lookAt(target);camera.updateMatrixWorld(true);return project();};
  const raw=pose(4),a=raw[1].clone().sub(raw[0]),b=expected[1].clone().sub(expected[0]);
  const roll=Math.atan2(b.y,b.x)-Math.atan2(a.y,a.x);
  camera.up.applyAxisAngle(dir,roll);
  let low=.8,high=40;
  for(let i=0;i<48;i++){
    const mid=(low+high)/2,p=pose(mid);
    if(p[0].distanceTo(p[1])>span)low=mid;else high=mid;
  }
  const actual=pose((low+high)/2),center=actual[0].clone().add(actual[1]).multiplyScalar(.5),wanted=expected[0].clone().add(expected[1]).multiplyScalar(.5);
  camera.setViewOffset(width,height,center.x-wanted.x,center.y-wanted.y,width,height);
  const projected=project();
  return {target,roll,expected,projected,maxAnchorErrorPx:Math.max(...projected.map((p,i)=>p.distanceTo(expected[i])))};
}
