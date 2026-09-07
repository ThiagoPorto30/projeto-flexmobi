import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadBikeBuffer } from '../public/modelos-3d/hero-asset.mjs';

const original = await readFile(new URL('../public/modelos-3d/v20-brake-pro-estudo.glb', import.meta.url));
const compressed = await readFile(new URL('../public/modelos-3d/v20-brake-pro-web.bin', import.meta.url));

test('compressed production asset restores exactly the reviewed GLB', async () => {
  const restored = await loadBikeBuffer({ fetcher: async (url) => {
    assert.match(url.pathname, /v20-brake-pro-web\.bin$/);
    return new Response(compressed);
  } });
  assert.deepEqual(Buffer.from(restored), original);
  assert.ok(compressed.length < original.length * .5);
});

test('browsers without decompression can load the original asset', async () => {
  const restored = await loadBikeBuffer({ Decompressor: null, fetcher: async (url) => {
    assert.match(url.pathname, /v20-brake-pro-estudo\.glb$/);
    return new Response(original);
  } });
  assert.deepEqual(Buffer.from(restored), original);
});

test('network and corrupt asset errors reach the viewer fallback', async () => {
  await assert.rejects(loadBikeBuffer({ fetcher: async () => new Response('', { status: 404 }) }), /404/);
  await assert.rejects(loadBikeBuffer({ fetcher: async () => new Response('invalid gzip') }));
});

test('unmount cancellation reaches the download', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(loadBikeBuffer({ signal: controller.signal, fetcher: async (_url, { signal }) => {
    assert.equal(signal, controller.signal);
    signal.throwIfAborted();
  } }), { name: 'AbortError' });
});
