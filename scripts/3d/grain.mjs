import { deflateSync } from 'node:zlib';

// Self-contained GLB normal maps. Deterministic micrograin, not photographic textures.
function png(data,w,h){
 const table=Array.from({length:256},(_,i)=>{let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
 const crc=b=>{let c=0xffffffff;for(const v of b)c=table[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
 const chunk=(name,bytes)=>{const type=Buffer.from(name),len=Buffer.alloc(4),c=Buffer.alloc(4);len.writeUInt32BE(bytes.length);c.writeUInt32BE(crc(Buffer.concat([type,bytes])));return Buffer.concat([len,type,bytes,c]);};
 const header=Buffer.alloc(13);header.writeUInt32BE(w,0);header.writeUInt32BE(h,4);header[8]=8;header[9]=2;
 const rows=Buffer.alloc(h*(w*3+1));for(let y=0;y<h;y++)data.copy(rows,y*(w*3+1)+1,y*w*3,(y+1)*w*3);
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);
}
export function embedGrain(buffer){
 const jsonLength=buffer.readUInt32LE(12),json=JSON.parse(buffer.subarray(20,20+jsonLength).toString().trim()),binStart=20+jsonLength+8;
 let bin=buffer.subarray(binStart,binStart+buffer.readUInt32LE(20+jsonLength));
 json.images??=[];json.textures??=[];json.samplers??=[];json.samplers.push({magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497});
 let state=93481;const random=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
 for(const names of [['Vinil granulado'],['Borracha do pneu','Borracha das manoplas'],['Pintura acetinada']]){
  const n=256,heights=Float32Array.from({length:n*n},()=>random()),pixels=Buffer.alloc(n*n*3);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const k=y*n+x,dx=heights[y*n+(x+1)%n]-heights[k],dy=heights[((y+1)%n)*n+x]-heights[k];pixels[k*3]=128+Math.round(dx*30);pixels[k*3+1]=128+Math.round(dy*30);pixels[k*3+2]=252;}
  const bytes=png(pixels,n,n),pad=Buffer.alloc((4-bin.length%4)%4),offset=bin.length+pad.length;bin=Buffer.concat([bin,pad,bytes]);
  json.bufferViews.push({buffer:0,byteOffset:offset,byteLength:bytes.length});json.images.push({bufferView:json.bufferViews.length-1,mimeType:'image/png',name:names[0]});json.textures.push({source:json.images.length-1,sampler:json.samplers.length-1});
  for(const m of json.materials)if(names.includes(m.name))m.normalTexture={index:json.textures.length-1,scale:names[0].startsWith('Vinil')?.20:names[0].startsWith('Pintura')?.035:.1};
 }
 json.buffers[0].byteLength=bin.length;
 const encoded=Buffer.from(JSON.stringify(json)),jp=Buffer.alloc((4-encoded.length%4)%4,32),bp=Buffer.alloc((4-bin.length%4)%4);
 const head=Buffer.alloc(20);head.write('glTF');head.writeUInt32LE(2,4);head.writeUInt32LE(20+encoded.length+jp.length+8+bin.length+bp.length,8);head.writeUInt32LE(encoded.length+jp.length,12);head.writeUInt32LE(0x4e4f534a,16);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length+bp.length);bh.writeUInt32LE(0x004e4942,4);return Buffer.concat([head,encoded,jp,bh,bin,bp]);
}
