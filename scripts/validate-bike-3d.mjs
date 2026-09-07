import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import * as T from 'three';

// Local structural checks for our generated GLB; not a full glTF conformance validator.
const sharp = createRequire(import.meta.resolve('next/package.json'))('sharp');
const base = new URL('../public/modelos-3d/', import.meta.url);
const file = await readFile(new URL('v20-brake-pro-estudo.glb', base));
const report = JSON.parse(await readFile(new URL('model-report.json', base), 'utf8'));
assert.equal(file.toString('ascii', 0, 4), 'glTF');
assert.equal(file.readUInt32LE(4), 2);
assert.equal(file.readUInt32LE(8), file.length);
assert.equal(file.length, report.bytes);
assert.ok(file.length < 10 * 1024 * 1024, 'Study asset exceeds 10 MiB budget');

const chunks = [];
for (let offset = 12; offset < file.length;) {
  const length = file.readUInt32LE(offset);
  assert.equal(length % 4, 0, 'GLB chunk alignment');
  assert.ok(offset + 8 + length <= file.length);
  chunks.push({ type: file.readUInt32LE(offset + 4), data: file.subarray(offset + 8, offset + 8 + length) });
  offset += 8 + length;
}
assert.equal(chunks.length, 2);
assert.equal(chunks[0].type, 0x4e4f534a);
assert.equal(chunks[1].type, 0x004e4942);
const gltf = JSON.parse(chunks[0].data.toString().trim()), binary = chunks[1].data;
assert.equal(gltf.asset.version, '2.0');
assert.equal(gltf.buffers.length, 1);
assert.ok(!gltf.buffers[0].uri, 'External buffer is not allowed');
assert.ok(binary.length - gltf.buffers[0].byteLength <= 3);
assert.ok(binary.length >= gltf.buffers[0].byteLength);
for (const view of gltf.bufferViews) {
  assert.equal(view.buffer, 0);
  assert.ok((view.byteOffset ?? 0) + view.byteLength <= gltf.buffers[0].byteLength);
}

const readers = { 5120: ['readInt8', 1], 5121: ['readUInt8', 1], 5122: ['readInt16LE', 2], 5123: ['readUInt16LE', 2], 5125: ['readUInt32LE', 4], 5126: ['readFloatLE', 4] };
const widths = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
const values = gltf.accessors.map((accessor, id) => {
  assert.ok(!accessor.sparse, `Unexpected sparse accessor ${id}`);
  const view = gltf.bufferViews[accessor.bufferView];
  const [method, bytes] = readers[accessor.componentType], size = widths[accessor.type];
  assert.ok(size && view && accessor.count > 0, `Invalid accessor ${id}`);
  const stride = view.byteStride ?? size * bytes, offset = accessor.byteOffset ?? 0;
  assert.ok(offset + (accessor.count - 1) * stride + size * bytes <= view.byteLength);
  const out = [];
  for (let i = 0; i < accessor.count; i++) for (let j = 0; j < size; j++) {
    const value = binary[method]((view.byteOffset ?? 0) + offset + i * stride + j * bytes);
    assert.ok(Number.isFinite(value), `Non-finite geometry value in accessor ${id}`);
    out.push(value);
  }
  return out;
});

let triangles = 0, draws = 0;
for (const mesh of gltf.meshes) for (const primitive of mesh.primitives) {
  assert.equal(primitive.mode ?? 4, 4, 'Only triangle meshes expected');
  const positions = gltf.accessors[primitive.attributes.POSITION];
  const indices = values[primitive.indices];
  assert.equal(indices.length % 3, 0);
  for (const index of indices) assert.ok(index < positions.count && index >= 0, 'Mesh index out of bounds');
  for (const value of values[primitive.attributes.POSITION]) assert.ok(Math.abs(value) < 10, 'Unexpected model scale');
  for (const id of Object.values(primitive.attributes)) assert.equal(gltf.accessors[id].count, positions.count);
  const normals=values[primitive.attributes.NORMAL];
  for(let i=0;i<normals.length;i+=3)assert.ok(Math.abs(Math.hypot(normals[i],normals[i+1],normals[i+2])-1)<.001,'Invalid surface normal');
  triangles += indices.length / 3; draws++;
}
assert.equal(triangles, report.triangles);
assert.equal(draws, report.drawCalls);
assert.ok(report.assemblies.every(name => gltf.nodes.some(node => node.name === name)));
assert.equal(gltf.nodes.find(node => node.extras?.revision)?.extras.revision, report.revision);
assert.ok(gltf.nodes.some(node => node.extras?.parts?.includes('Logotipo INOW original')));

// Independently measure exported vertex positions with their node transforms.
// Report values must describe the file, not merely repeat intended parameters.
const dimensionNode=gltf.nodes.find(node=>node.extras?.dimensions);
assert.ok(dimensionNode, 'Missing measurement provenance');
assert.deepEqual(dimensionNode.extras.dimensions, report.dimensions);
assert.equal(report.dimensions.comparisonOnly.applied,false);
assert.equal(report.dimensions.nominal.beadSeatDiameter.value,.406);
assert.equal(report.dimensions.nominal.tireSectionWidth.value,.098);
const bounds=new T.Box3(),point=new T.Vector3(),exportedTyres=[];
function measureNode(id,parent=new T.Matrix4()){
  const node=gltf.nodes[id],local=new T.Matrix4();
  if(node.matrix)local.fromArray(node.matrix);
  else local.compose(new T.Vector3(...(node.translation??[0,0,0])),new T.Quaternion(...(node.rotation??[0,0,0,1])),new T.Vector3(...(node.scale??[1,1,1])));
  const world=parent.clone().multiply(local);
  if(node.mesh!==undefined)for(const primitive of gltf.meshes[node.mesh].primitives){
    const positions=values[primitive.attributes.POSITION],partBounds=new T.Box3();
    for(let i=0;i<positions.length;i+=3){point.fromArray(positions,i).applyMatrix4(world);bounds.expandByPoint(point);partBounds.expandByPoint(point);}
    if(node.extras?.parts?.includes('Carcaça de seção nominal 98 mm'))exportedTyres.push(partBounds.getSize(new T.Vector3()));
  }
  for(const child of node.children??[])measureNode(child,world);
}
for(const id of gltf.scenes[gltf.scene??0].nodes)measureNode(id);
const size=bounds.getSize(new T.Vector3()),expected=report.dimensions.reconstructed;
for(const [actual,reported] of [[size.x,expected.length],[size.y,expected.height],[size.z,expected.width]])assert.ok(Math.abs(actual-reported)<.0001,'Exported dimensions disagree with report');
assert.ok(Math.abs(bounds.min.y)<.0001,'Tread must meet the ground');
assert.equal(exportedTyres.length,2);
for(const tire of exportedTyres){
  assert.ok(Math.abs(tire.z-.098)<.00001,'Exported tire section must be nominal 98 mm');
  assert.ok(Math.abs(tire.x-tire.y)<.00001,'Exported tread must stay circular');
}
assert.equal(report.dimensions.measuredTyreBodies.length,2);
for(const tire of report.dimensions.measuredTyreBodies){
  assert.ok(Math.abs(tire.sectionWidth-.098)<.00001);
  assert.ok(Math.abs(tire.diameterX-tire.diameterY)<.00001,'Wheels must stay circular');
}

for (const img of gltf.images) {
  assert.ok(!img.uri, 'All textures must be embedded');
  const view = gltf.bufferViews[img.bufferView];
  const bytes = binary.subarray(view.byteOffset, view.byteOffset + view.byteLength);
  const { info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 256); assert.equal(info.height, 256);
}
assert.equal(gltf.images.length, 3);
assert.ok((await readFile(new URL('vendor/FONT-LICENSE.txt', base), 'utf8')).includes('MAGENTA'));
console.log(JSON.stringify({ result: 'PASS', triangles, modelDrawCalls: draws, embeddedTextures: gltf.images.length, megabytes: +(file.length / 1e6).toFixed(2), reconstructedDimensionsMm:{length:Math.round(size.x*1000),width:Math.round(size.z*1000),height:Math.round(size.y*1000)}, checks: ['GLB chunks', 'buffer bounds', 'finite geometry', 'mesh indices', 'normalized normals', 'assembly names', 'original logo', 'decoded textures', 'font license', 'asset budget', 'measurement provenance', 'exported dimensions', 'ground contact', 'nominal tire section', 'circular wheels'] }, null, 2));
