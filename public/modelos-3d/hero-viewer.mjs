import { loadBikeBuffer } from './hero-asset.mjs?v=1';

const canvas = document.querySelector('canvas');
const status = document.querySelector('#status');
const channel = 'flexmobi-hero-3d';
const notify = (type, value) => parent.postMessage({ channel, type, value }, location.origin);
let failed = false;
function fail() {
  if (failed) return;
  failed = true;
  canvas.dataset.state = 'error';
  status.textContent = '3D indisponível. Exibindo a foto do produto.';
  notify('error');
}

try {
  // Loaded only when the hero is visible; Three.js stays outside the home bundle.
  const [T, { OrbitControls }, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
    import('three'), import('./vendor/OrbitControls.js'),
    import('./vendor/GLTFLoader.js'), import('./vendor/RoomEnvironment.js'),
  ]);
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(32, 1, .02, 30);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false; // Keep page scroll free; interaction is direct drag.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  controls.enableDamping = !motion.matches;
  controls.dampingFactor = .09;
  controls.rotateSpeed = .48;
  controls.minPolarAngle = Math.PI * .28;
  controls.maxPolarAngle = Math.PI * .49;
  canvas.style.touchAction = 'pan-y';

  const room = new RoomEnvironment();
  const generator = new T.PMREMGenerator(renderer);
  const environment = generator.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .85;
  room.dispose(); generator.dispose();
  scene.add(new T.HemisphereLight(0xf2eee3, 0x8a7960, 1));
  const key = new T.DirectionalLight(0xfff2db, 2.3);
  key.position.set(-2, 5, 3);
  scene.add(key);
  const rim = new T.DirectionalLight(0xe5ecff, 3.2);
  rim.position.set(2, 2.2, -3); scene.add(rim);
  // A soft contact wash replaces the cut-out silhouette and expensive shadow passes.
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const context = shadowCanvas.getContext('2d');
  const wash = context.createRadialGradient(64, 64, 2, 64, 64, 64);
  wash.addColorStop(0, 'rgba(0,0,0,.7)'); wash.addColorStop(.45, 'rgba(0,0,0,.3)'); wash.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = wash; context.fillRect(0, 0, 128, 128);
  const shadowTexture = new T.CanvasTexture(shadowCanvas);
  const ground = new T.Mesh(new T.PlaneGeometry(2.3, .85), new T.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.003; scene.add(ground);

  let model, bounds, initialDistance = 4;
  const direction = new T.Vector3(-.65, .23, 3).normalize();
  let frame = 0, visible = true, disposed = false, updating = false;
  const orbitDirection = new T.Vector3(), screenRight = new T.Vector3(), screenUp = new T.Vector3(), corner = new T.Vector3();
  function containOrbit() {
    if (!bounds) return;
    const distance = camera.position.distanceTo(controls.target);
    orbitDirection.copy(camera.position).sub(controls.target).normalize();
    screenRight.crossVectors(camera.up, orbitDirection).normalize();
    screenUp.crossVectors(orbitDirection, screenRight);
    const vertical = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    let required = 0;
    // Fit all eight box corners in the current camera basis, including perspective depth.
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      corner.set(x, y, z).sub(controls.target);
      const depth = corner.dot(orbitDirection);
      required = Math.max(required, depth + Math.abs(corner.dot(screenRight)) / (vertical * camera.aspect) * 1.06, depth + Math.abs(corner.dot(screenUp)) / vertical * 1.06);
    }
    if (distance < required) {
      camera.position.copy(controls.target).addScaledVector(orbitDirection, required);
      camera.updateMatrixWorld();
    }
  }
  function wake() {
    if (!frame && !failed && !disposed && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function tick() {
    frame = 0;
    if (failed || disposed || !visible || document.hidden) return;
    updating = true;
    const changed = controls.update();
    containOrbit();
    updating = false;
    renderer.render(scene, camera);
    if (changed && controls.enableDamping) wake();
  }
  const draw = () => { if (!updating) wake(); };
  function fit(reset = false) {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (!bounds) return;
    const center = bounds.getCenter(new T.Vector3());
    const size = bounds.getSize(new T.Vector3());
    // Fit both projected width and height, with room for the bike's depth.
    const tangent = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(size.y / (2 * tangent), size.x / (2 * tangent * camera.aspect)) * 1.07 + size.z * .15;
    const orbit = reset ? direction.clone() : camera.position.clone().sub(controls.target).normalize();
    initialDistance = distance;
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(orbit, distance);
    controls.update(); draw();
  }
  function command(action) {
    if (!model || failed) return;
    if (action === 'reset') { fit(true); return; }
    const offset = camera.position.clone().sub(controls.target);
    if (action === 'left' || action === 'right') offset.applyAxisAngle(new T.Vector3(0, 1, 0), action === 'left' ? .23 : -.23);
    else if (action === 'closer' || action === 'farther') offset.multiplyScalar(action === 'closer' ? .9 : 1.1);
    else return;
    offset.setLength(T.MathUtils.clamp(offset.length(), initialDistance * .7, initialDistance * 1.5));
    camera.position.copy(controls.target).add(offset); controls.update(); draw();
  }
  controls.addEventListener('change', draw);
  const observer = new ResizeObserver(() => fit()); observer.observe(canvas);
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(frame); frame = 0; wake(); });
  motion.addEventListener('change', () => { controls.enableDamping = !motion.matches; wake(); });
  controls.addEventListener('start', () => { canvas.style.cursor = 'grabbing'; notify('interaction'); wake(); });
  controls.addEventListener('end', () => { canvas.style.cursor = 'grab'; wake(); });
  canvas.addEventListener('dblclick', () => { command('reset'); notify('interaction'); });
  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.channel !== channel) return;
    if (event.data.type === 'visibility') {
      visible = event.data.visible === true;
      controls.enabled = visible;
      cancelAnimationFrame(frame); frame = 0; wake();
    }
  });
  canvas.addEventListener('keydown', (event) => {
    const action = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'closer', '=': 'closer', '-': 'farther', Home: 'reset' }[event.key];
    if (action) { event.preventDefault(); command(action); notify('interaction'); }
  });
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); fail(); });
  fit();
  const download = new AbortController();
  loadBikeBuffer({ signal: download.signal }).then((buffer) => new GLTFLoader().parseAsync(buffer, new URL('./', location.href).href)).then((gltf) => {
    if (failed || disposed) return;
    model = gltf.scene;
    model.traverse((object) => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
    scene.add(model); bounds = new T.Box3().setFromObject(model); fit(true);
    containOrbit();
    // Reveal only after the fitted model has actually been drawn, not just parsed.
    renderer.render(scene, camera);
    status.textContent = ''; canvas.dataset.state = 'ready'; notify('ready');
  }).catch(() => { if (!disposed) fail(); });
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return; // Keep the scene valid when returning from the back/forward cache.
    disposed = true; download.abort(); cancelAnimationFrame(frame);
    observer.disconnect(); controls.dispose(); environment.dispose();
    const textures = new Set(), materials = new Set(), geometries = new Set();
    scene.traverse((object) => {
      if (!object.isMesh) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    for (const item of [...textures, ...materials, ...geometries]) item.dispose();
    renderer.dispose();
  });
} catch { fail(); }
