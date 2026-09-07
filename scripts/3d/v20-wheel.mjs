import * as T from 'three';
import { modelScale, wheelDimensions as d } from './v20-measurements.mjs';

const v = (r, z) => new T.Vector2(r, z);
const beadRadius = d.beadSeatDiameter / 2, halfWidth = d.nominalSectionWidth / 2;
const innerSide = new T.CubicBezierCurve(
  v(beadRadius, d.beadHalfSpacing), v(.208, .042),
  v(.222, halfWidth), v(d.shoulderRadius, halfWidth),
);
const outerSide = new T.CubicBezierCurve(
  v(d.shoulderRadius, halfWidth), v(.274, halfWidth),
  v(d.carcassRadius, .027), v(d.carcassRadius, 0),
);

function solve(curve, axis, value, increasing = true) {
  let low = 0, high = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2, point = curve.getPoint(mid);
    if ((point[axis] < value) === increasing) low = mid; else high = mid;
  }
  return curve.getPoint((low + high) / 2);
}

// Returns the positive sidewall in physical metres. The maximum width is the
// nominal Kenda section; the rounded profile/height is inferred from photographs.
export function sidewallOffset(radius) {
  const curve = radius < d.shoulderRadius ? innerSide : outerSide;
  return solve(curve, 'x', T.MathUtils.clamp(radius, beadRadius, d.carcassRadius)).y;
}

export function treadRadius(lateralOffset) {
  return solve(outerSide, 'y', T.MathUtils.clamp(Math.abs(lateralOffset), 0, halfWidth), false).x;
}

export function tyreProfileMetres() {
  const side = [...innerSide.getPoints(16), ...outerSide.getPoints(24).slice(1)];
  return [
    ...side,
    ...side.slice(0, -1).reverse().map(p => v(p.x, -p.y)),
    v(beadRadius - .004, -d.beadHalfSpacing),
    v(beadRadius - .004, d.beadHalfSpacing),
    side[0].clone(),
  ];
}

export function rimProfileMetres() {
  const b = beadRadius, f = d.flangeRadius, s = d.beadHalfSpacing;
  return [
    [b - .006, -s], [b, -s], [b, -.036], [f, -.036],
    [f, -.040], [b - .008, -.040], [b - .010, -.030],
    [b - .010, .030], [b - .008, .040], [f, .040],
    [f, .036], [b, .036], [b, s], [b - .006, s], [b - .006, -s],
  ].map(([r, z]) => v(r, z));
}

function revolve(profile) {
  const geometry = new T.LatheGeometry(profile.map(p => p.clone().divideScalar(modelScale)), 112);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

export const tyreGeometry = () => revolve(tyreProfileMetres());
export const rimGeometry = () => revolve(rimProfileMetres());
