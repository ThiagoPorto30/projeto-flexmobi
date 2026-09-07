import assert from 'node:assert/strict';
import test from 'node:test';
import * as T from 'three';
import { workshop, material } from './geometry.mjs';

const controls = [
  [-.14, .88, .84, .16],
  [-.06, .93, .83, .19],
  [.12, .92, .81, .23],
  [.24, .94, .77, .24],
  [.50, .97, .87, .20],
];

test('seat interpolation preserves control points and clamps both ends', () => {
  const { seatAt } = workshop();
  for (const control of controls) {
    const result = seatAt(controls, control[0]);
    control.forEach((value, column) => assert.ok(Math.abs(result[column] - value) < 1e-10));
  }
  assert.deepEqual(seatAt(controls, -2), controls[0]);
  assert.deepEqual(seatAt(controls, 2), controls.at(-1));
});

test('seat curves stay finite, keep thickness and do not overshoot each interval', () => {
  const { seatAt } = workshop();
  for (let i = 0; i < controls.length - 1; i++) {
    const a = controls[i], b = controls[i + 1];
    for (let sample = 0; sample <= 100; sample++) {
      const values = seatAt(controls, a[0] + (b[0] - a[0]) * sample / 100);
      assert.ok(values.every(Number.isFinite));
      assert.ok(values[1] > values[2] && values[3] > 0);
      for (let column = 1; column <= 3; column++) {
        assert.ok(values[column] >= Math.min(a[column], b[column]) - 1e-10);
        assert.ok(values[column] <= Math.max(a[column], b[column]) + 1e-10);
      }
    }
  }
});

test('thin battery panels keep a rounded face without inflating their depth', () => {
  const { roundedPanel } = workshop();
  const panel = roundedPanel('Test cover', [0, 0, 0], [.15, .37, .004], material('Test', '#111111', .5), .025);
  const geometry = panel.geometry;
  geometry.computeBoundingBox();
  assert.ok(Math.abs(geometry.boundingBox.max.z - geometry.boundingBox.min.z - .004) < 1e-7);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    assert.ok([positions.getX(i), positions.getY(i), positions.getZ(i)].every(Number.isFinite));
    assert.ok(!(Math.abs(positions.getX(i)) > .072 && Math.abs(positions.getY(i)) > .182), 'Corners must be rounded, not square');
  }
});

test('soft plates preserve real cut-outs, bounded contours and non-degenerate faces',()=>{
  const {softPlate}=workshop();
  const mesh=softPlate('Rounded bridge',[[-.10,-.05],[.10,-.05],[.10,.05],[-.10,.05]],.02,0,material('Test','#111111',.5),[[[-.02,-.02],[.02,-.02],[.02,.02],[-.02,.02]]]);
  mesh.updateMatrixWorld(true);
  const throughHole=new T.Raycaster(new T.Vector3(0,0,1),new T.Vector3(0,0,-1));
  const throughPlate=new T.Raycaster(new T.Vector3(.06,0,1),new T.Vector3(0,0,-1));
  assert.equal(throughHole.intersectObject(mesh).length,0,'Cut-out must remain open');
  assert.ok(throughPlate.intersectObject(mesh).length>0,'Surrounding plate must remain solid');
  const g=mesh.geometry,p=g.attributes.position,ix=g.index,a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
  assert.ok(ix.count>0);
  for(let i=0;i<ix.count;i+=3){
    a.fromBufferAttribute(p,ix.getX(i));b.fromBufferAttribute(p,ix.getX(i+1)).sub(a);c.fromBufferAttribute(p,ix.getX(i+2)).sub(a);
    assert.ok(b.cross(c).lengthSq()>1e-20,'Zero-area triangles must be discarded');
  }
  g.computeBoundingBox();assert.ok(g.boundingBox.max.x<.103&&g.boundingBox.min.x>-.103);
});
