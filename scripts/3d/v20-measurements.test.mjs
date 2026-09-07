import assert from 'node:assert/strict';
import test from 'node:test';
import * as T from 'three';
import { modelScale, wheelDimensions as d, measurementEvidence } from './v20-measurements.mjs';
import { tyreGeometry, rimGeometry, tyreProfileMetres, rimProfileMetres, sidewallOffset, treadRadius } from './v20-wheel.mjs';

test('98-406 denotes section and bead seat, never inflated outside diameter', () => {
  assert.equal(d.nominalSectionWidth, .098);
  assert.equal(d.beadSeatDiameter, .406);
  assert.equal(measurementEvidence.comparisonOnly.applied, false);
  assert.equal(measurementEvidence.nominal.beadSeatDiameter.fitment, 'conditional');
  assert.ok(2 * d.carcassRadius > d.beadSeatDiameter);
  assert.ok(Math.abs(2 * d.carcassRadius - .508) > .01, '20 inches is not an exact inflated diameter');
});

test('revolved tire has nominal 98 mm section and circular side profile in metres', () => {
  const geometry = tyreGeometry();
  geometry.scale(modelScale, modelScale, modelScale);geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new T.Vector3());
  assert.ok(Math.abs(size.z - .098) < 1e-7);
  assert.ok(Math.abs(size.x - size.y) < 1e-7, 'Uniform scale must keep wheels circular');
  assert.ok(Math.abs(size.x - 2 * d.carcassRadius) < 1e-7);
  geometry.dispose();
});

test('bead seats are present at 406 mm diameter, flanges remain a separate estimated dimension', () => {
  for (const profile of [tyreProfileMetres(), rimProfileMetres()]) for (const side of [-1, 1]) {
    assert.ok(profile.some(p => Math.abs(p.x * 2 - .406) < 1e-10 && Math.abs(p.y - side * d.beadHalfSpacing) < 1e-10));
  }
  const geometry = rimGeometry();geometry.scale(modelScale, modelScale, modelScale);geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new T.Vector3());
  assert.ok(Math.abs(size.x - .418) < 1e-7);
  assert.ok(Math.abs(size.x - size.y) < 1e-7);
  geometry.dispose();
});

test('profile, sidewall lettering and tread stay finite and inside their dimensional envelope', () => {
  for (const p of tyreProfileMetres()) {
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
    assert.ok(Math.abs(p.y) <= .049 + 1e-10);
    assert.ok(p.x <= d.carcassRadius + 1e-10);
  }
  for (let i = 0; i <= 100; i++) {
    const r = d.beadSeatDiameter / 2 + (d.carcassRadius - d.beadSeatDiameter / 2) * i / 100;
    const z = sidewallOffset(r), crown = treadRadius(.049 * i / 100);
    assert.ok(Number.isFinite(z) && z >= 0 && z <= .049 + 1e-10);
    assert.ok(Number.isFinite(crown) && crown >= d.shoulderRadius - 1e-10 && crown <= d.carcassRadius + 1e-10);
  }
});
