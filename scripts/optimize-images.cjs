// Preserve source images; update runtime references only when the WebP is smaller.
const fs = require('node:fs/promises');
const path = require('node:path');
const { createRequire } = require('node:module');
const sharp = createRequire(require.resolve('next/package.json'))('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const source = path.join(root, 'public/imagens');
  const output = path.join(source, 'otimizadas');
  await fs.mkdir(output, { recursive: true });
  const replacements = [];
  let before = 0, after = 0;
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(png|jpe?g|webp)$/i.test(entry.name)) continue;
    const original = await fs.readFile(path.join(source, entry.name));
    const buffer = await sharp(original).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer();
    before += original.length;
    if (buffer.length < original.length * 0.95) {
      const name = `${entry.name}.webp`;
      await fs.writeFile(path.join(output, name), buffer);
      replacements.push([`/imagens/${entry.name}`, `/imagens/otimizadas/${name}`]);
      after += buffer.length;
    } else after += original.length;
  }
  for (const file of ['src/app/data/catalog.ts', 'src/app/data/product-details.ts', 'src/app/home-view.tsx', 'src/app/lib/seo.ts']) {
    const filename = path.join(root, file);
    let content = await fs.readFile(filename, 'utf8');
    for (const [original, optimized] of replacements) content = content.replaceAll(`"${original}"`, `"${optimized}"`);
    await fs.writeFile(filename, content);
  }
  console.log(JSON.stringify({ optimized: replacements.length, originalBytes: before, runtimeBytes: after, reductionPercent: Math.round((1 - after / before) * 100) }));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
