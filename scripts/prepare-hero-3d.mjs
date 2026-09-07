import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import assert from 'node:assert/strict';

const source = new URL('../public/modelos-3d/v20-brake-pro-estudo.glb', import.meta.url);
const target = new URL('../public/modelos-3d/v20-brake-pro-web.bin', import.meta.url);
const original = await readFile(source);
const compressed = gzipSync(original, { level: 9 });
assert.deepEqual(gunzipSync(compressed), original, 'Compression must preserve every byte');
await writeFile(target, compressed);
console.log(JSON.stringify({ originalBytes: original.length, downloadBytes: compressed.length, savedPercent: Math.round((1 - compressed.length / original.length) * 100) }));
