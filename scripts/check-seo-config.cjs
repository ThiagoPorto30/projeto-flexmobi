const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const modulePath = path.resolve(__dirname, '../src/app/lib/seo.ts');
const businessPath = path.resolve(__dirname, '../src/app/data/business.ts');

function run(overrides, source) {
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', env: { ...process.env, SITE_URL: '', SITE_INDEXABLE: 'false', NODE_ENV: 'production', VERCEL_ENV: '', NEXT_PUBLIC_WHATSAPP_NUMBER: '', ...overrides } });
}
function config(overrides) {
  const result = run(overrides, `const s=require(${JSON.stringify(modulePath)}); console.log(JSON.stringify({index:s.indexable,canonical:s.pageMetadata('Title','Description','/modelos/inow-v35').alternates?.canonical}));`);
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

assert.deepEqual(config({}), { index: false });
assert.equal(config({ SITE_INDEXABLE: 'true' }).index, false);
const production = { SITE_URL: 'https://flexmobi.example', SITE_INDEXABLE: 'true' };
assert.deepEqual(config(production), { index: true, canonical: 'https://flexmobi.example/modelos/inow-v35' });
assert.equal(config({ ...production, VERCEL_ENV: 'preview' }).index, false);
assert.equal(config({ ...production, NODE_ENV: 'development' }).index, false);
assert.equal(config({ SITE_URL: production.SITE_URL }).index, false);
for (const SITE_URL of ['http://flexmobi.example', 'https://flexmobi.example/path', 'https://user:pass@flexmobi.example', 'invalid']) {
  assert.notEqual(run({ SITE_URL }, `require(${JSON.stringify(modulePath)})`).status, 0);
}
const disabledContact = run({}, `console.log(require(${JSON.stringify(businessPath)}).whatsappUrl('teste'))`);
assert.equal(disabledContact.stdout.trim(), 'null');
// Fixture only: no network request or message is sent.
const enabledContact = run({ NEXT_PUBLIC_WHATSAPP_NUMBER: '5521999999999' }, `console.log(require(${JSON.stringify(businessPath)}).whatsappUrl(${JSON.stringify('Nome: A & B\nModelo: INOW')}))`);
assert.equal(enabledContact.status, 0, enabledContact.stderr);
const link = new URL(enabledContact.stdout.trim());
assert.equal(link.hostname, 'wa.me');
assert.equal(link.searchParams.get('text'), 'Nome: A & B\nModelo: INOW');
console.log('SEO: protótipo, produção, preview, URLs inválidas e links de contato verificados.');
