import * as T from 'three';
import { createRequire } from 'node:module';

// Reuse the supplied transparent INOW artwork as geometry. Raster runs become
// coplanar quads; no new logo design and no remote image service are involved.
const sharp=createRequire(import.meta.resolve('next/package.json'))('sharp');
const {data,info}=await sharp('public/imagens/079_logo_inow-CqfG1FmB.webp').resize({width:512}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
export function inowGeometry(width=.218){
 const positions=[],uv=[],indices=[],scale=width/info.width;
 for(let y=0;y<info.height;y++){
  let x=0;
  while(x<info.width){
   while(x<info.width&&data[(y*info.width+x)*4+3]<128)x++;
   const start=x;while(x<info.width&&data[(y*info.width+x)*4+3]>=128)x++;
   if(x===start)continue;
   const left=(start-info.width/2)*scale,right=(x-info.width/2)*scale,top=(info.height/2-y)*scale,bottom=top-scale,index=positions.length/3;
   positions.push(left,bottom,0,right,bottom,0,right,top,0,left,top,0);uv.push(0,0,1,0,1,1,0,1);indices.push(index,index+1,index+2,index,index+2,index+3);
  }
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
