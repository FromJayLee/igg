# Indie Game Galaxy

우주를 탐험하며 게임을 발견하는 **웹 기반 인디게임 홍보·발견 플랫폼**입니다.

## 🌟 프로젝트 개요

Indie Game Galaxy는 픽셀 아트 우주 맵에서 행성을 분양받아 게임을 전시하는 서비스입니다. 개발자는 저비용으로 개성 있는 행성을 꾸며 게임을 노출하고, 게이머는 로그인 없이 드래그·줌으로 우주를 탐험하며 새로운 인디게임을 발견합니다.

## 🚀 주요 기능

### 현재 구현된 기능 (MVP)
- **우주 맵 드래그·줌 인터랙션**: WebGL/Canvas 기반 무한 패닝, 마우스 휠 줌
- **픽셀아트 스타일**: 사이버펑크 + 레트로 퓨처리즘 분위기
- **성능 최적화**: 45fps 이상 유지, 뷰포트 컬링으로 200개 행성 확장성
- **직관적 조작**: 마우스 드래그, 휠 줌, 키보드 네비게이션(WASD/화살표)

### 향후 구현 예정 기능
- 행성 Hover 미리보기 (게임명, 썸네일, 장르, 한줄 소개)
- 행성 클릭 상세 패널 (회전 행성, 게임 정보, 스크린샷/GIF)
- 행성 분양 신청 폼 (개발자용)
- 관리자 승인 대시보드

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 + TypeScript + React 19
- **Graphics**: PixiJS v8 (WebGL/Canvas 렌더링)
- **Styling**: Tailwind CSS + 커스텀 색상 팔레트
- **State Management**: React Hooks + Zustand
- **UI Components**: shadcn/ui + Radix UI
- **Fonts**: Orbitron (미래적 느낌), Press Start 2P (픽셀 아트)

## 🎨 디자인 가이드

### 색상 팔레트
- **Primary**: #ff2d9d (네온 마젠타)
- **Secondary**: #05d9e8 (네온 시안)
- **Background**: #000000 (딥 스페이스 블랙)
- **Surface**: #4b1d79 (코스믹 퍼플)

### 폰트
- **Heading**: Orbitron (미래적 느낌 강화)
- **Pixel Labels**: Press Start 2P (픽셀 아트 감성)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 9+

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 우주 맵을 확인하세요.

## 🎮 사용법

### 우주 탐험
- **마우스 드래그**: 우주 공간을 자유롭게 탐험
- **마우스 휠**: 줌 인/아웃 (마우스 위치 기준)
- **키보드**: WASD 또는 화살표 키로 이동
- **0 키**: 홈 포지션으로 리셋

### 인터페이스
- **좌상단**: 카메라 위치, 줌 레벨, 행성 수 표시
- **좌하단**: 컨트롤 가이드
- **우상단**: 프로젝트 제목 및 설명

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지 (우주 맵)
│   └── globals.css        # 전역 스타일
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   └── universe/          # 우주 맵 관련 컴포넌트
│       ├── CanvasLayer.tsx    # PixiJS 캔버스 렌더링
│       └── UniverseMap.tsx    # 우주 맵 컨테이너
├── types/
│   └── universe.ts        # 우주 맵 타입 정의
├── constants/
│   └── universe.ts        # 우주 맵 설정 및 상수
└── lib/
    └── universe-utils.ts  # 우주 맵 유틸리티 함수
```

## 🔧 개발 가이드

### 컴포넌트 추가
새로운 우주 맵 기능을 추가할 때는 `src/components/universe/` 디렉토리에 배치하세요.

### 성능 최적화
- 뷰포트 컬링으로 불필요한 렌더링 방지
- PixiJS 스프라이트 풀링 고려
- 메모리 누수 방지를 위한 적절한 cleanup

### 디자인 시스템
- `tailwind.config.ts`의 `universe` 색상 팔레트 사용
- `font-orbitron`과 `font-pixel` 클래스 활용
- 네온 글로우 애니메이션 (`animate-neon-glow`, `animate-cyber-pulse`)

## 📊 성능 목표

- **FPS**: 최소 45fps, 목표 60fps
- **확장성**: 최소 200개 행성 지원
- **반응성**: 마우스 이벤트 200ms 이내 응답
- **메모리**: 효율적인 스프라이트 관리

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성 (`feature/기능명`)
3. 코드 작성 및 테스트
4. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🌟 감사의 말

- [PixiJS](https://pixijs.com/) - 고성능 2D WebGL 렌더링
- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 퍼스트 CSS
- [shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 UI 컴포넌트

---

**우주를 탐험하며 게임을 발견하세요! 🚀✨**
