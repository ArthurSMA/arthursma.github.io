const canvas = document.getElementById('three-hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
const lowMemoryDevice = 'deviceMemory' in navigator && navigator.deviceMemory <= 4;

if (canvas && !reducedMotion && !isSmallScreen) {
  const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !lowMemoryDevice,
    powerPreference: 'high-performance'
  });

  const maxDpr = lowMemoryDevice ? 1 : 1.6;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const baseCount = window.innerWidth < 900 ? 360 : 720;
  const particleCount = lowMemoryDevice ? Math.floor(baseCount * 0.62) : baseCount;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const c1 = new THREE.Color('#67e8f9');
  const c2 = new THREE.Color('#a78bfa');
  const c3 = new THREE.Color('#34d399');

  for (let i = 0; i < particleCount; i += 1) {
    const index = i * 3;
    const radius = 1.6 + Math.random() * 6.4;
    const angle = Math.random() * Math.PI * 2;
    const wave = Math.sin(angle * 2.5) * 0.9;

    positions[index] = Math.cos(angle) * radius;
    positions[index + 1] = Math.sin(angle) * radius * 0.58 + wave;
    positions[index + 2] = (Math.random() - 0.5) * 9;

    const mixed = c1.clone().lerp(Math.random() > 0.56 ? c2 : c3, Math.random());
    colors[index] = mixed.r;
    colors[index + 1] = mixed.g;
    colors[index + 2] = mixed.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: lowMemoryDevice ? 0.04 : 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const rings = new THREE.Group();
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: '#67e8f9',
    transparent: true,
    opacity: 0.13
  });

  const ringQuantity = lowMemoryDevice ? 1 : 3;
  for (let i = 0; i < ringQuantity; i += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.1 + i * 0.78, 0.006, 12, 160),
      ringMaterial.clone()
    );
    ring.rotation.x = Math.PI * (0.56 + i * 0.04);
    ring.rotation.y = Math.PI * (0.12 + i * 0.07);
    ring.material.opacity = 0.13 - i * 0.03;
    rings.add(ring);
  }
  scene.add(rings);

  const mouse = { x: 0, y: 0 };
  let frameId = null;
  let isVisible = true;

  window.addEventListener('pointermove', (event) => {
    mouse.x = (event.clientX / window.innerWidth - 0.5) * 0.45;
    mouse.y = (event.clientY / window.innerHeight - 0.5) * 0.45;
  }, { passive: true });

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  }, { passive: true });

  const animate = () => {
    if (!isVisible) return;

    const time = performance.now() * 0.001;
    particles.rotation.y = time * 0.036 + mouse.x;
    particles.rotation.x = time * 0.014 + mouse.y;
    rings.rotation.z = time * 0.1;
    rings.rotation.y = Math.sin(time * 0.3) * 0.1;

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && frameId === null) animate();
    if (!isVisible && frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  });

  animate();
}
