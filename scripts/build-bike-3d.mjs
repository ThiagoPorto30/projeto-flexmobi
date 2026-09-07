import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import { buildV20 } from './3d/v20-detail.mjs';
import { embedGrain } from './3d/grain.mjs';

const {root,report}=buildV20();
globalThis.FileReader=class {
  readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}
};
const raw=await new GLTFExporter().parseAsync(root,{binary:true});
const glb=embedGrain(Buffer.from(raw));
const output='public/modelos-3d';
await mkdir(output,{recursive:true});
await writeFile(`${output}/v20-brake-pro-estudo.glb`,glb);
const manifest={revision:root.userData.revision,...report,bytes:glb.length,references:['026','014','016','041','042','048','049','056','060'],logo:'079_logo_inow-CqfG1FmB.webp',limitations:['Nominal tire/rim component dimensions; exact bike fitment conditional','Other dimensions estimated; BK-V20 Pro manual envelope not applied','Photo-guided modelling, not manufacturer CAD']};
await writeFile(`${output}/model-report.json`,JSON.stringify(manifest,null,2)+'\n');
await mkdir(`${output}/vendor`,{recursive:true});
const font=JSON.parse(await readFile(new URL('./3d/vendor/helvetiker_regular.typeface.json',import.meta.url),'utf8'));
await writeFile(`${output}/vendor/FONT-LICENSE.txt`,font.original_font_information.license_description+'\n');
await mkdir(`${output}/utils`,{recursive:true});
for(const [src,dst] of [
 ['build/three.module.js','vendor/three.module.js'],
 ['build/three.core.js','vendor/three.core.js'],
 ['examples/jsm/controls/OrbitControls.js','vendor/OrbitControls.js'],
 ['examples/jsm/loaders/GLTFLoader.js','vendor/GLTFLoader.js'],
 ['examples/jsm/environments/RoomEnvironment.js','vendor/RoomEnvironment.js'],
 ['examples/jsm/utils/BufferGeometryUtils.js','utils/BufferGeometryUtils.js'],
 ['examples/jsm/utils/SkeletonUtils.js','utils/SkeletonUtils.js'],
 ['LICENSE','vendor/LICENSE.txt'],
])await copyFile(`node_modules/three/${src}`,`${output}/${dst}`);
console.log(JSON.stringify(manifest,null,2));
