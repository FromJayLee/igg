import { Planet, HoverState } from '@/types/universe';
import { PLANET_TYPES, UNIVERSE_CONFIG } from '@/constants/universe';
import * as PIXI from 'pixi.js';

// PreviewCardManager 싱글톤
export const PreviewCardManager = (() => {
  let el: HTMLDivElement | null = null;
  let raf = 0;
  let cardRect = { w: 280, h: 120 };
  const offset = 16;
  
  function tick(app: PIXI.Application) {
    cancelAnimationFrame(raf);
    const loop = () => {
      if (!el) { 
        raf = requestAnimationFrame(loop); 
        return; 
      }
      
      // hover 상태가 없거나 드래그 중이면 숨김
      if (!hoverState.visible || hoverState.dragging || !hoverState.target) { 
        el.style.opacity = '0'; 
        raf = requestAnimationFrame(loop); 
        return; 
      }
      
      // canvas를 페이지 좌표로 변환
      const rect = app.view.getBoundingClientRect();
      const x = rect.left + window.scrollX + hoverState.mouse.x;
      const y = rect.top + window.scrollY + hoverState.mouse.y;
      
      // 앵커 선택 (오버플로우 방지)
      let tx = x + offset;
      let ty = y + offset;
      const vw = window.innerWidth, vh = window.innerHeight;
      
      if (tx + cardRect.w > vw) tx = x - cardRect.w - offset;
      if (ty + cardRect.h > vh) ty = y - cardRect.h - offset;
      
      // 최소 위치 보장
      tx = Math.max(8, tx);
      ty = Math.max(8, ty);
      
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      el.style.opacity = '1';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  
  return {
    mount(node: HTMLDivElement, app: PIXI.Application) { 
      el = node; 
      tick(app); 
    },
    measure(w: number, h: number) { 
      cardRect = { w, h }; 
    },
    open(data: Planet) { 
      window.dispatchEvent(new CustomEvent('preview:open', { detail: data })); 
    },
    close() { 
      window.dispatchEvent(new Event('preview:close')); 
    },
    hide() { 
      if (el) el.style.opacity = '0'; 
    },
    show() { 
      // RAF 루프에서 자동으로 표시됨
    },
  };
})();

// 전역 hover 상태
export const hoverState: HoverState = {
  target: null,
  mouse: { x: 0, y: 0 },
  visible: false,
  dragging: false,
};

export function generateRandomPlanets(count: number): Planet[] {
  const planets: Planet[] = [];
  const planetTypeKeys = Object.keys(PLANET_TYPES) as Array<keyof typeof PLANET_TYPES>;
  
  // 게임 태그라인 풀
  const gameTaglines = [
    "우주를 탐험하는 새로운 모험",
    "픽셀 아트의 매력적인 세계",
    "독창적인 게임플레이 경험",
    "인디 개발자의 창의력이 빛나는 작품",
    "새로운 장르의 도전",
    "클래식한 재미의 현대적 재해석",
    "우주를 배경으로 한 서사시",
    "독립 게임의 혁신적 시도",
    "플레이어의 상상력을 자극하는 세계",
    "소규모 팀의 대담한 도전"
  ];
  
  for (let i = 0; i < count; i++) {
    const type = planetTypeKeys[Math.floor(Math.random() * planetTypeKeys.length)];
    const planetType = PLANET_TYPES[type];
    
    const planet: Planet = {
      id: `planet-${i + 1}`,
      name: `${planetType.name} ${i + 1}`,
      x: (Math.random() - 0.5) * UNIVERSE_CONFIG.width,
      y: (Math.random() - 0.5) * UNIVERSE_CONFIG.height,
      size: Math.random() * (UNIVERSE_CONFIG.maxPlanetSize - UNIVERSE_CONFIG.minPlanetSize) + UNIVERSE_CONFIG.minPlanetSize,
      type,
      color: planetType.color,
      glowIntensity: Math.random() * 0.5 + 0.5,
      // 게임 정보 추가
      genre: planetType.genre,
      tagline: gameTaglines[Math.floor(Math.random() * gameTaglines.length)],
      description: `${planetType.name} 세계에서 펼쳐지는 독창적인 게임 경험입니다. 픽셀 아트의 매력과 혁신적인 게임플레이를 통해 플레이어에게 잊을 수 없는 모험을 제공합니다.`,
      thumbnailUrl: `https://picsum.photos/64/64?random=${i + 1}`,
      // 상세 정보 모달용 추가 필드
      gallery: [
        `https://picsum.photos/400/225?random=${i * 3 + 1}`,
        `https://picsum.photos/400/225?random=${i * 3 + 2}`,
        `https://picsum.photos/400/225?random=${i * 3 + 3}`,
      ],
      externalUrl: 'https://store.steampowered.com',
      websiteUrl: `https://${planetType.name.toLowerCase()}.com`,
      developerName: `${planetType.name} Studios`,
      releaseDate: '2024-01-01',
      platforms: ['PC', 'Steam'],
    };
    
    planets.push(planet);
  }
  
  return planets;
}

export function generateStarField(width: number, height: number, density: number): { x: number; y: number; brightness: number }[] {
  const stars: { x: number; y: number; brightness: number }[] = [];
  const totalStars = Math.floor(width * height * density);
  
  for (let i = 0; i < totalStars; i++) {
    stars.push({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      brightness: Math.random() * 0.8 + 0.2,
    });
  }
  
  return stars;
}

export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function isInViewport(
  planetX: number,
  planetY: number,
  cameraX: number,
  cameraY: number,
  cameraScale: number,
  viewportWidth: number,
  viewportHeight: number,
  cullingDistance: number
): boolean {
  const scaledViewportWidth = viewportWidth / cameraScale;
  const scaledViewportHeight = viewportHeight / cameraScale;
  
  const left = cameraX - scaledViewportWidth / 2 - cullingDistance;
  const right = cameraX + scaledViewportWidth / 2 + cullingDistance;
  const top = cameraY - scaledViewportHeight / 2 - cullingDistance;
  const bottom = cameraY + scaledViewportHeight / 2 + cullingDistance;
  
  return planetX >= left && planetX <= right && planetY >= top && planetY <= bottom;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}
