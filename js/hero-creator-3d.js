/**
 * hero-creator-3d.js
 * 포트폴리오 히어로 섹션용 인터랙티브 3D '크리에이터 코어 (Creative Kinetic Core)'
 * - 주제: '크리에이터 (Web Designer · Web Publisher · AI Content Creator)'
 * - 유기적으로 호흡하고 파동치는 3D 뫼비우스 키네틱 조각
 * - 기하학적 정밀성을 상징하는 듀얼 자이로 궤도 링
 * - 아이디어와 영감을 상징하는 부유 파티클 스트림
 * - 부드러운 마우스 패럴랙스 및 360도 인터랙티브 드래그 지원
 */

(function () {
  'use strict';

  function initWhenReady() {
    if (typeof THREE === 'undefined') {
      setTimeout(initWhenReady, 50);
      return;
    }
    setupScene();
  }

  function setupScene() {
    const container = document.getElementById('heroCreativeStage');
    const canvas = document.getElementById('creatorCanvas');
    if (!container || !canvas) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    
    // 시점 설정
    const fov = 45;
    const initialWidth = container.clientWidth || 400;
    const initialHeight = container.clientHeight || 400;
    const aspect = initialWidth / initialHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 전체 조각을 담는 최상위 마스터 그룹
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- 2. Lighting System (차가운 블루 & 아이스 시안 계열) ---
    const ambientLight = new THREE.AmbientLight(0xf0f7ff, 1.15);
    scene.add(ambientLight);

    // 키 라이트 (맑고 차가운 실버-화이트 빛)
    const keyLight = new THREE.DirectionalLight(0xe0eeff, 1.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // 림 라이트 1: 선명하고 깊은 코발트 블루 (#2563eb)
    const blueRim1 = new THREE.PointLight(0x2563eb, 3.6, 12);
    blueRim1.position.set(-3.5, 2.5, 2);
    scene.add(blueRim1);

    // 림 라이트 2: 투명하고 차가운 일렉트릭 시안 / 아이스 아쿠아 (#06b6d4)
    const blueRim2 = new THREE.PointLight(0x06b6d4, 3.0, 12);
    blueRim2.position.set(3, -3, 2.5);
    scene.add(blueRim2);

    // 내부 발광 코어 라이트 (아이스 블루)
    const corePointLight = new THREE.PointLight(0xdbeafe, 1.3, 6);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);

    // --- 3. The Creator Core: 내부 각진 다각형(Hexagonal Faceted Polygon) 키네틱 조각 ---
    // 내부 곡선을 다각형 형태로 변환 (단순 4각형이 아닌, 정육각형 단면과 다각형 각주 마디)
    const knotRadius = 1.18;
    const tubeRadius = 0.38;
    const tubularSegments = 54;  // 각 마디가 샤프하게 꺾이는 다각형 세그먼트
    const radialSegments = 6;    // 단면이 완벽한 정육각형 (Hexagon)
    const p = 2;
    const q = 3;

    const baseGeometry = new THREE.TorusKnotGeometry(knotRadius, tubeRadius, tubularSegments, radialSegments, p, q);
    const originalPositions = baseGeometry.attributes.position.clone();
    const posCount = baseGeometry.attributes.position.count;

    // 조각 재질: 다각형 면(Facet)들의 크리스탈 빛 반사를 극대화한 플랫 셰이딩 사파이어 크롬
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x142033,
      emissive: 0x091424,
      roughness: 0.16,
      metalness: 0.9,
      clearcoat: 0.98,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      transmission: 0.12,
      ior: 1.55,
      flatShading: true // 각진 다각형 면이 샤프하게 빛을 반사
    });

    const coreMesh = new THREE.Mesh(baseGeometry, coreMaterial);
    masterGroup.add(coreMesh);

    // 내부 다각형 모서리 능선 라인 (Sharp Polygon Edges)
    const facetedEdges = new THREE.EdgesGeometry(baseGeometry, 14);
    const facetedWireMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const facetedWireMesh = new THREE.LineSegments(facetedEdges, facetedWireMaterial);
    masterGroup.add(facetedWireMesh);

    // 다각형 꼭짓점 노드 포인트 (Crystalline Polygon Nodes)
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', baseGeometry.attributes.position);
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const nodePoints = new THREE.Points(nodeGeom, nodeMaterial);
    masterGroup.add(nodePoints);

    // --- 4. Gyroscopic Kinetic Orbit Rings (외부 형태: 직전 상태의 유려한 곡선 링으로 복원) ---
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    function createKineticRing(radius, tube, color, rotX, rotY) {
      const ringGeom = new THREE.TorusGeometry(radius, tube, 16, 100); // 부드러운 곡선 링
      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.88,
        roughness: 0.2,
        emissive: color,
        emissiveIntensity: 0.15
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    }

    const ring1 = createKineticRing(1.95, 0.015, 0xbae6fd, Math.PI / 3, 0);       // 아이스 블루
    const ring2 = createKineticRing(2.25, 0.012, 0x3b82f6, -Math.PI / 4, Math.PI / 6); // 코발트 일렉트릭 블루
    const ring3 = createKineticRing(2.5, 0.01, 0x67e8f9, Math.PI / 6, -Math.PI / 3);  // 쿨 시안
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);

    // --- 5. Orbiting Inspiration Particles (영감의 쿨 블루 파티클) ---
    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.5 + Math.random() * 1.5;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      particleSpeeds[i] = 0.3 + Math.random() * 0.7;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    function createParticleTexture() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(125, 211, 252, 0.9)');
      grad.addColorStop(0.7, 'rgba(37, 99, 235, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    }

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      opacity: 0.88
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    masterGroup.add(particles);

    // --- 6. Interaction & Mouse Parallax System ---
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    // 마우스 호버 패럴랙스
    window.addEventListener('mousemove', function (e) {
      if (isDragging) return;
      const rect = container.getBoundingClientRect();
      const inHeroX = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const inHeroY = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
      
      targetRotY = inHeroX * 0.45;
      targetRotX = inHeroY * 0.35;
    });

    // 드래그로 360도 자유 회전 제어
    container.addEventListener('pointerdown', function (e) {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      dragVelocityX = deltaX * 0.005;
      dragVelocityY = deltaY * 0.005;

      masterGroup.rotation.y += dragVelocityX;
      masterGroup.rotation.x += dragVelocityY;
    });

    window.addEventListener('pointerup', function () {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    // 모바일 터치 대응
    container.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      masterGroup.rotation.y += deltaX * 0.006;
      masterGroup.rotation.x += deltaY * 0.006;
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDragging = false;
    });

    // --- 7. Animation Loop ---
    let clock = new THREE.Clock();
    let isVisible = true;

    // 스크롤 이탈 시 GPU 절약
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // (1) 메인 조각 정점 유기적 파동(Vertex Morphing)
      const posAttr = baseGeometry.attributes.position;
      const origPositions = originalPositions.array;
      const posArray = posAttr.array;

      for (let i = 0; i < posCount; i++) {
        const idx = i * 3;
        const ox = origPositions[idx];
        const oy = origPositions[idx + 1];
        const oz = origPositions[idx + 2];

        // 3D 삼각파동 및 노이즈 결합: 유기적인 맥동과 굽이침
        const wave = Math.sin(elapsedTime * 1.35 + ox * 1.8 + oy * 1.4) 
                   * Math.cos(elapsedTime * 0.95 + oz * 1.6);
        const displacement = 1 + wave * 0.09;

        posArray[idx] = ox * displacement;
        posArray[idx + 1] = oy * displacement;
        posArray[idx + 2] = oz * displacement;
      }
      posAttr.needsUpdate = true;
      baseGeometry.computeVertexNormals();

      // 다각형 와이어프레임 & 노드 포인트 회전 동기화
      facetedWireMesh.rotation.copy(coreMesh.rotation);
      nodePoints.rotation.copy(coreMesh.rotation);

      // (2) 조각의 자체 자전 및 관성/패럴랙스
      if (!isDragging) {
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
        masterGroup.rotation.y += dragVelocityX;
        masterGroup.rotation.x += dragVelocityY;

        currentRotX += (targetRotX - currentRotX) * 0.045;
        currentRotY += (targetRotY - currentRotY) * 0.045;

        coreMesh.rotation.y = elapsedTime * 0.22 + currentRotY;
        coreMesh.rotation.x = Math.sin(elapsedTime * 0.35) * 0.18 + currentRotX;
        coreMesh.rotation.z = Math.cos(elapsedTime * 0.28) * 0.12;

        facetedWireMesh.rotation.copy(coreMesh.rotation);
        nodePoints.rotation.copy(coreMesh.rotation);
      }

      // (3) 자이로 링 독립 회전
      ring1.rotation.z = elapsedTime * 0.32;
      ring1.rotation.y = Math.sin(elapsedTime * 0.4) * 0.3;
      ring2.rotation.x = elapsedTime * -0.26;
      ring2.rotation.z = Math.cos(elapsedTime * 0.35) * 0.25;
      ring3.rotation.y = elapsedTime * 0.18;

      // (4) 파티클 시스템 유영
      const pPositions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const speed = particleSpeeds[i];
        const phase = particlePhases[i];
        pPositions[idx + 1] += Math.sin(elapsedTime * speed + phase) * 0.0016;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * -0.07;

      // (5) 라이트 움직임 (동적 쿨 블루 림라이트)
      blueRim1.position.x = Math.sin(elapsedTime * 0.8) * 3.5;
      blueRim1.position.y = Math.cos(elapsedTime * 0.6) * 3;
      blueRim2.position.x = Math.cos(elapsedTime * 0.7) * 3.5;
      blueRim2.position.y = Math.sin(elapsedTime * 0.5) * -3;

      renderer.render(scene, camera);
    }

    animate();

    // --- 8. Responsive Resize Handler ---
    function onWindowResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      
      if (width < 600) {
        camera.position.z = 6.2;
      } else if (width < 992) {
        camera.position.z = 5.5;
      } else {
        camera.position.z = 5.1;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener('resize', onWindowResize);
    setTimeout(onWindowResize, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();
