// Lossless transport compression. No geometry, material or texture is changed.
// .bin avoids depending on host-specific Content-Encoding rules for .gz files.
export async function loadBikeBuffer({ signal, fetcher = fetch, Decompressor = globalThis.DecompressionStream } = {}) {
  const compressed = typeof Decompressor === 'function';
  const path = compressed ? './v20-brake-pro-web.bin?v=6' : './v20-brake-pro-estudo.glb?v=6';
  const response = await fetcher(new URL(path, import.meta.url), { signal });
  if (!response.ok) throw new Error(`Bike asset unavailable (${response.status})`);
  if (!compressed) return response.arrayBuffer();
  if (!response.body) throw new Error('Bike asset response has no body');
  return new Response(response.body.pipeThrough(new Decompressor('gzip'))).arrayBuffer();
}
