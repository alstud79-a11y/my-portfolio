# 송서현 포트폴리오 — 히어로 3D 인터랙티브 '크리에이터 코어' 제작 일지

> **문서 버전:** 1.0.0  
> **최종 수정일:** 2026년 9월 14일  
> **프로젝트명:** 송서현 웹 포트폴리오 (my-portfolio)  
> **작업 영역:** 히어로 섹션 우측 3D 인터랙티브 WebGL 컨텐츠 개발 및 시각 디자인 고도화  

---

## 1. 프로젝트 배경 및 기획 의도

### 1.1 배경
웹디자이너·웹퍼블리셔·AI 콘텐츠 제작자로 활동하는 송서현 님의 포트폴리오 메인 화면(히어로 섹션)은 좌측에 웅장한 에디토리얼 타이포그래피(`SONG SEOHYUN`)가 배치되어 있었습니다. 하지만 우측 약 50%의 공간이 비어 있어, 방문자의 시선을 단번에 사로잡을 수 있는 역동적인 시각적 포인트가 필요했습니다.

### 1.2 핵심 목표
1. **'크리에이터(Creator)' 주제 형상화**: 단순한 디자이너를 넘어 디자인, 퍼블리싱, AI 기술을 융합하는 창작자적 정체성을 시각적으로 표현.
2. **단순한 도형 탈피**: 큐브나 구 같은 뻔하고 지루한 기본 형태를 거부하고, 독창적이고 유기적인 움직임을 가진 3D 조형물 제작.
3. **직접 교감하는 인터랙션**: 마우스 이동에 반응하는 부드러운 기울임(Parallax Tilt)과 360도 자유 드래그 탐색 지원.
4. **포트폴리오와의 완벽한 조화**: 기존 웹사이트의 크림 페이퍼톤 배경과 이질감 없이 녹아들면서도 세련된 쿨 블루 테크 감성을 전달.

---

## 2. 기술 스택 및 구조 설계

| 분류 | 기술 / 라이브러리 | 적용 목적 |
| :--- | :--- | :--- |
| **3D 그래픽 엔진** | **Three.js (r128)** | 브라우저 표준 WebGL 기반의 고성능 실시간 3D 렌더링 |
| **코어 로직** | **Vanilla JavaScript (ES6+)** | 외부 프레임워크 의존 없이 가볍고 빠른 커스텀 3D 씬 및 인터랙션 제어 |
| **스타일링** | **CSS3 Grid & Backdrop-filter** | 데스크톱/모바일 정밀 반응형 배치 및 글래스모피즘(Glassmorphism) 뱃지 구현 |
| **성능 최적화** | **IntersectionObserver & DPR 제한** | 스크롤 이탈 시 렌더링 루프 일시 중지, 모바일 GPU/배터리 소모 최소화 |

---

## 3. 단계별 고도화 및 피드백 개선 과정

본 작업은 사용자의 정밀한 디자인 피드백을 반영하며 총 4단계의 고도화 과정을 거쳐 완성되었습니다.

```
[1단계: 초기 3D 씬 구축]
  └─ 뫼비우스 토러스 키네틱 조각 + 파티클 + 초기 와인/세이지 톤
       │
       ▼
[2단계: 컬러 팔레트 전환]
  └─ 피드백: "색상을 차가운 블루 계열로 변경하자"
  └─ 차가운 딥 사파이어, 일렉트릭 시안, 코발트 림라이트 적용
       │
       ▼
[3단계: 와이어프레임 형태 개선]
  └─ 피드백: "와이어 프레임 문양이 뱀(파충류) 표면 같다"
  └─ 원인 분석: TorusKnot의 기본 사각/삼각 와이어프레임 격자가 비늘처럼 보임
  └─ 조치: 촘촘한 그물망 완전 삭제 → 유선형 네온 스트림라인으로 1차 개선
       │
       ▼
[4단계: 미적 균형 완성 (현재 상태)]
  └─ 피드백: "외부 형태는 직전 상태로 되돌리고, 내부 곡선을 다각형 형태로 변경하자"
  └─ 외부: 유려하고 매끄러운 곡선 자이로 링 & 부유 파티클 복원
  └─ 내부: 둥근 튜브 곡선을 각진 '정육각형 단면 마디의 다각형 각주(Hexagonal Faceted Prism)'로 전환
```

---

## 4. 세부 기술 구현 내용

### 4.1 내부 다각형 코어 조형물 (Inner Polygonal Core)
- **지오메트리 (Geometry)**:
  - `THREE.TorusKnotGeometry(1.18, 0.38, 54, 6, 2, 3)` 사용
  - **단면을 정육각형(`radialSegments: 6`)**으로 깎아 단순한 4각형 큐브가 아닌 날카로운 다각형 각주 형태 구축
  - 튜브의 긴 방향도 54개의 마디(`tubularSegments: 54`)로 각지게 꺾이도록 설정
- **재질 (Material)**:
  - `THREE.MeshPhysicalMaterial` 적용
  - **`flatShading: true`**: 각 다각형 면(Facet)이 둥글게 뭉개지지 않고 크리스탈 보석처럼 빛을 샤프하게 반사
  - 딥 스틸 네이비/옵시디언 블루(`0x142033`) 베이스에 높은 금속성(`metalness: 0.9`), 고광택 클리어코트(`clearcoat: 0.98`) 부여
- **다각형 모서리 능선 & 정점 노드**:
  - `THREE.EdgesGeometry(baseGeometry, 14)`로 14도 이상의 뚜렷한 다각형 모서리선만 추출하여 시안 블루 광선으로 표현
  - 각 다각형 꼭짓점에 발광하는 작은 정점 노드(`THREE.Points`)를 배치하여 3D 정밀 계측미 부여

### 4.2 외부 궤도 링 & 영감의 파티클 (Outer Curved System)
- **3축 자이로스코프 곡선 링**:
  - `THREE.TorusGeometry(radius, tube, 16, 100)` 기반의 매끄러운 원환체 3개 배치
  - **1번 링**: 쿨 아이스 블루 (`0xbae6fd`) — X축 60° 기울임
  - **2번 링**: 코발트 일렉트릭 블루 (`0x3b82f6`) — Y축 30° 반대 회전
  - **3번 링**: 샤프 시안 아쿠아 (`0x67e8f9`) — 복합 축 회전
- **영감의 빛 파티클 시스템**:
  - 260여 개의 미세한 빛 입자가 코어 주변을 구형 쉘 형태로 유영
  - 캔버스로 동적 생성한 부드러운 원형 방사형 그라데이션 텍스처(중심 화이트 → 외곽 쿨 블루) 적용

### 4.3 동적 조명 시스템 (Dynamic Lighting)
- **키 라이트**: 맑고 차가운 실버 화이트 지향성 조명 (`0xe0eeff`, 세기 1.5)
- **듀얼 쿨 블루 림라이트**:
  - 조각 좌우에서 시간에 따라 서로 다른 궤적(Sine/Cosine 함수)으로 회전
  - 조명 1: 깊고 선명한 코발트 블루 (`0x2563eb`)
  - 조명 2: 투명하고 차가운 일렉트릭 시안 (`0x06b6d4`)
- 조각이 회전할 때마다 각진 다각형 면에 드라마틱한 블루 반사광 형성

### 4.4 부드러운 인터랙션 (Interaction System)
- **마우스 호버 패럴랙스 (Parallax Lerp)**:
  - 마우스 좌표를 실시간 추적하되, 선형 보간(`current += (target - current) * 0.045`)을 적용하여 묵직하고 고급스러운 시점 기울임 연출
- **360도 자유 드래그 회전**:
  - 마우스 클릭 드래그 또는 모바일 원핑거 터치 드래그로 조각을 자유롭게 회전 가능
  - 손을 떼면 관성 댐핑(`dragVelocity *= 0.94`)에 의해 부드럽게 감속되며 기본 자전 운동으로 복귀
- **인터랙티브 가이드 뱃지**:
  - 3D 캔버스 하단에 `CREATIVE KINETIC FLOW | DRAG TO EXPLORE 3D` 라벨 배치
  - 쿨 블루 펄스 애니메이션(`@keyframes creatorPulse`)으로 사용자의 인터랙션 유도

---

## 5. 수정 및 생성된 파일 목록

```
my-portfolio/
│
├── index.html                   # [수정] 3D 캔버스 컨테이너 마크업 및 Three.js 스크립트 로드
├── css/
│   └── style.css                # [수정] 히어로 2컬럼 그리드 배치, 뱃지 스타일, 반응형 미디어 쿼리
├── js/
│   ├── main.js                  # [유지] 기존 메뉴/스크롤/필름 인터랙션
│   └── hero-creator-3d.js       # [신규] Three.js 기반 3D 크리에이터 씬 전체 로직
└── 프로젝트.md                   # [신규] 본 개발 일지 및 정밀 명세서
```

### 5.1 `index.html` 주요 추가 내용
```html
<!-- 히어로 섹션 우측 3D 스테이지 -->
<div class="hero-creative-stage" id="heroCreativeStage" title="드래그하여 3D 조형물을 회전해보세요">
  <canvas id="creatorCanvas"></canvas>
  <div class="creator-badge" aria-hidden="true">
    <span class="pulse-indicator"></span>
    <span class="badge-title">CREATIVE KINETIC FLOW</span>
    <span class="badge-hint">DRAG TO EXPLORE 3D</span>
  </div>
</div>

<!-- Three.js CDN 라이브러리 및 3D 스크립트 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="js/hero-creator-3d.js"></script>
```

### 5.2 `css/style.css` 주요 추가 내용
```css
/* 데스크톱: 히어로 우측 2열 배치 */
.reference-real .hero-creative-stage {
  grid-column: 2 !important;
  grid-row: 1 / 4 !important;
  align-self: center !important;
  justify-self: center !important;
  width: 100% !important;
  max-width: 580px !important;
  height: min(580px, 72vh) !important;
  aspect-ratio: 1 / 1 !important;
  cursor: grab;
}

/* 모바일 (900px 이하) 반응형 */
@media (max-width: 900px) {
  .reference-real .hero { grid-template-columns: 1fr !important; }
  .reference-real .hero-creative-stage {
    grid-column: 1 !important;
    grid-row: 3 !important;
    max-width: 380px !important;
    height: 380px !important;
    margin: 20px auto 0 !important;
  }
}
```

---

## 6. 유지보수 및 커스텀 가이드 (Customization Tips)

차후 시각적 튜닝이 필요할 때 `js/hero-creator-3d.js`에서 아래 변수들을 손쉽게 수정할 수 있습니다:

1. **다각형 단면 각도 조절**:
   - `radialSegments = 6` (현재: 정육각형)
   - 8로 변경 시 정팔각형, 5로 변경 시 정오각형 각주로 변경 가능
2. **조각의 회전 속도 조절**:
   - `animate()` 함수 내 `coreMesh.rotation.y = elapsedTime * 0.22` 에서 계수(`0.22`)를 조절
3. **파티클 개수 조절**:
   - `const particleCount = 260;`의 숫자를 늘리거나 줄여 반짝이는 입자 밀도 변경 가능
4. **모바일 크기 조정**:
   - `css/style.css`의 `@media (max-width: 900px)` 내 `.reference-real .hero-creative-stage`의 `max-width` 및 `height` 값 변경

---

## 7. 기대 효과 및 결론

- **첫인상의 압도적 차별화**: 방문자가 사이트에 접속하자마자 살아 숨쉬듯 유기적으로 맥동하는 3D 다각형 조각과 유려한 궤도 링을 통해 '감각적인 크리에이터'라는 인상을 확실히 각인시킵니다.
- **포트폴리오 완성도 극대화**: 웹디자인(심미적 형태감), 웹퍼블리싱(샤프한 다각형 모서리 및 그리드 계측미), AI/영상 콘텐츠(우주적 파티클과 빛의 림라이트)의 조화를 완벽하게 담아냈습니다.
