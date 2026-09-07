import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries, mergeVertices, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { readFile } from 'node:fs/promises';

const font = new FontLoader().parse(JSON.parse(await readFile(new URL('./vendor/helvetiker_regular.typeface.json', import.meta.url), 'utf8')));
export const material = (name, color, roughness, metalness = 0) => {
  const m = new T.MeshStandardMaterial({ color, roughness, metalness }); m.name = name; return m;
};
export function workshop() {
  const root = new T.Group(), groups = [], cache = new Map(); let current = root;
  const cached = (key, factory) => {if (!cache.has(key)) cache.set(key, factory()); return cache.get(key);};
  function section(name, build) {const group=new T.Group();current=group;group.name=name;root.add(group);groups.push(group);build();current=root;return group;}
  function mesh(name, geometry, mat, p = [0,0,0]) {const o = new T.Mesh(geometry,mat); o.name=name; o.position.set(...p);current.add(o);return o;}
  function tube(name,a,b,r,m,rt=r,segments=20) {
    const v=new T.Vector3(...b).sub(new T.Vector3(...a));
    const sides=segments===20&&Math.max(r,rt)<.008?12:segments;
    const g=cached(`tube:${r}:${rt}:${sides}`,()=>new T.CylinderGeometry(rt,r,1,sides));
    const o=mesh(name,g,m,new T.Vector3(...a).addScaledVector(v,.5).toArray());o.scale.y=v.length();o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;
  }
  function box(name,p,size,m,r=.004) {
    // Tiny tread blocks/chain plates don't need hundreds of bevel triangles each.
    const create=()=>Math.max(...size)<.03?new T.BoxGeometry(...size):new RoundedBoxGeometry(...size,Math.max(...size)<.1?1:2,r);
    return mesh(name,cached(`box:${size}:${r}`,create),m,p);
  }
  function ring(name,p,r,w,m,arc=Math.PI*2) {const segments=r<.015?24:r<.055?48:80;return mesh(name,cached(`ring:${r}:${w}:${arc}`,()=>new T.TorusGeometry(r,w,8,segments,arc)),m,p);}
  function path(name,points,r,m,closed=false) {const substantial=r>=.014;return mesh(name,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed,'centripetal'),Math.max(substantial?64:32,points.length*3),r,substantial?16:8,closed),m);}
  function plate(name,points,depth,z,m,holes=[],bevel=.002) {
    const shape=new T.Shape(points.map(p=>new T.Vector2(...p)));
    for(const h of holes) shape.holes.push(new T.Path(h.map(p=>new T.Vector2(...p))));
    return mesh(name,new T.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:2,steps:1,curveSegments:24}),m,[0,0,z-depth/2]);
  }
  function softPlate(name,points,depth,z,m,holes=[],corner=.16,bevel=.002) {
    // Round each contour corner in the face, including cut-outs; the bevel alone
    // only rounds the edge through the thickness and leaves a polygonal outline.
    const outline=(points,isHole)=>{
      const shape=isHole?new T.Path():new T.Shape(),n=points.length;
      for(let i=0;i<n;i++){
        const prev=new T.Vector2(...points[(i+n-1)%n]),p=new T.Vector2(...points[i]),next=new T.Vector2(...points[(i+1)%n]);
        const entry=p.clone().lerp(prev,corner),leave=p.clone().lerp(next,corner);
        i?shape.lineTo(entry.x,entry.y):shape.moveTo(entry.x,entry.y);
        shape.quadraticCurveTo(p.x,p.y,leave.x,leave.y);
      }
      shape.closePath();return shape;
    };
    const shape=outline(points,false);shape.holes=holes.map(h=>outline(h,true));
    const geometry=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:6});
    // Collinear contour samples can create zero-area bevel triangles. Remove
    // these faces rather than exporting their undefined (zero-length) normals.
    const p=geometry.attributes.position,indices=[],a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
    for(let i=0;i<p.count;i+=3){a.fromBufferAttribute(p,i);b.fromBufferAttribute(p,i+1).sub(a);c.fromBufferAttribute(p,i+2).sub(a);if(b.cross(c).lengthSq()>1e-20)indices.push(i,i+1,i+2);}
    geometry.setIndex(indices);
    const smooth=toCreasedNormals(geometry,.6),indexed=mergeVertices(smooth,1e-6);geometry.dispose();smooth.dispose();
    return mesh(name,indexed,m,[0,0,z-depth/2]);
  }
  function label(text,size,p,rotation,mat,back=false) {
    const g=new T.ShapeGeometry(font.generateShapes(text,size),4);g.computeBoundingBox();g.translate(-(g.boundingBox.max.x+g.boundingBox.min.x)/2,-size/2,0);
    const o=mesh(`Marcação ${text}`,g,mat,p);o.rotation.set(0,back?Math.PI:0,rotation);return o;
  }
  function bolt(p,r,m,dark,dir=[0,0,1]) {
    const a=new T.Vector3(...p),d=new T.Vector3(...dir),at=t=>a.clone().addScaledVector(d,t).toArray();
    tube('Arruela',at(0),at(.002),r*1.4,m);tube('Cabeça sextavada',at(.002),at(.005),r,m,r,6);tube('Encaixe Allen',at(.0051),at(.0054),r*.47,dark,r*.47,6);
  }
  function seatAt(slices,x) {
    if(x<=slices[0][0])return [...slices[0]];
    if(x>=slices.at(-1)[0])return [...slices.at(-1)];
    let i=slices.findIndex(s=>s[0]>=x)-1;i=Math.max(0,Math.min(slices.length-2,i));
    const a=slices[i],b=slices[i+1],h=b[0]-a[0],t=T.MathUtils.clamp((x-a[0])/h,0,1);
    const slope=(k,j)=>{
      const l=Math.max(0,k-1),r=Math.min(slices.length-1,k+1);
      const before=k===0?(slices[r][j]-slices[k][j])/(slices[r][0]-slices[k][0]):(slices[k][j]-slices[l][j])/(slices[k][0]-slices[l][0]);
      const after=k===slices.length-1?before:(slices[r][j]-slices[k][j])/(slices[r][0]-slices[k][0]);
      return before*after<=0?0:Math.sign(before)*Math.min(Math.abs((before+after)/2),3*Math.abs(before),3*Math.abs(after));
    };
    return [x,...[1,2,3].map(j=>(2*t**3-3*t*t+1)*a[j]+(t**3-2*t*t+t)*h*slope(i,j)+(-2*t**3+3*t*t)*b[j]+(t**3-t*t)*h*slope(i+1,j))];
  }
  function roundedPanel(name,p,size,m,r=.025) {
    // A shallow cover needs rounded corners in its face, independent of its thickness.
    // RoundedBoxGeometry clamps that radius to half the (often tiny) depth.
    const geometry=cached(`panel:${size}:${r}`,()=>{
      const [width,height,depth]=size,x=-width/2,y=-height/2;
      const radius=Math.min(r,width/2,height/2),bevel=Math.min(.0015,depth/4),s=new T.Shape();
      s.moveTo(x+radius,y);s.lineTo(x+width-radius,y);s.quadraticCurveTo(x+width,y,x+width,y+radius);
      s.lineTo(x+width,y+height-radius);s.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);
      s.lineTo(x+radius,y+height);s.quadraticCurveTo(x,y+height,x,y+height-radius);
      s.lineTo(x,y+radius);s.quadraticCurveTo(x,y,x+radius,y);s.closePath();
      const g=new T.ExtrudeGeometry(s,{depth:depth-2*bevel,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:2,curveSegments:8});
      g.translate(0,0,-depth/2+bevel);return g;
    });
    return mesh(name,geometry,m,p);
  }
  function seatSurfaceAt(controls,x,q,upper=true) {
    const [at,top,bottom,width]=seatAt(controls,x),lateral=T.MathUtils.clamp(q,-1,1);
    // Exactly the same superellipse as loftSeat, not an independent trim outline.
    return [at,(top+bottom)/2+(upper?1:-1)*(top-bottom)/2*Math.max(0,1-lateral**4)**.24,width/2*lateral];
  }
  function loftSeat(name,controls,m) {
    const slices=[];
    for(let i=0;i<controls.length-1;i++)for(let k=0;k<6;k++)slices.push(seatAt(controls,T.MathUtils.lerp(controls[i][0],controls[i+1][0],k/6)));
    slices.push(controls.at(-1));
    const pos=[],uv=[],ix=[],radial=48;
    for(let i=0;i<slices.length;i++)for(let j=0;j<=radial;j++){
      const [x,top,bottom,w]=slices[i],a=j/radial*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
      pos.push(x,(top+bottom)/2+(top-bottom)/2*Math.sign(c)*Math.abs(c)**.48,w/2*Math.sign(s)*Math.abs(s)**.5);uv.push(i/(slices.length-1),j/radial);
    }
    for(let i=0;i<slices.length-1;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;ix.push(a,a+1,b,a+1,b+1,b);}
    for(const [i,reverse] of [[0,true],[slices.length-1,false]]){
      const s=slices[i],center=pos.length/3;pos.push(s[0],(s[1]+s[2])/2,0);uv.push(.5,.5);
      for(let j=0;j<radial;j++){const a=i*(radial+1)+j;ix.push(...(reverse?[center,a+1,a]:[center,a,a+1]));}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return mesh(name,g,m);
  }
  function finish() {
    let parts=0,triangles=0;
    // Bake transforms and combine each assembly/material. No thousands of draw calls.
    for(const group of groups){
      group.updateMatrixWorld(true);const buckets=new Map();
      for(const o of [...group.children]){
        const clone=o.geometry.clone().applyMatrix4(o.matrix),g=clone.index?clone.toNonIndexed():clone;
        parts++;triangles+=g.attributes.position.count/3;
        const k=o.material.uuid;if(!buckets.has(k))buckets.set(k,{m:o.material,g:[],names:[]});
        const b=buckets.get(k);b.g.push(g);b.names.push(o.name);group.remove(o);
      }
      for(const b of buckets.values()){
        const geometry=mergeGeometries(b.g);if(!geometry)throw new Error(`Cannot merge ${group.name}`);
        const o=new T.Mesh(mergeVertices(geometry,1e-5),b.m);o.name=`${group.name} / ${b.m.name}`;o.userData.parts=[...new Set(b.names)];group.add(o);
      }
    }
    root.updateMatrixWorld(true);return {root,report:{parts,triangles:Math.round(triangles),drawCalls:groups.reduce((n,g)=>n+g.children.length,0),assemblies:groups.map(g=>g.name)}};
  }
  return {root,section,mesh,tube,box,ring,path,plate,softPlate,label,bolt,loftSeat,seatAt,seatSurfaceAt,roundedPanel,cached,finish};
}
