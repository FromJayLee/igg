/**
 * 절차적 픽셀아트 행성 생성기
 * 게임명, 장르, 설명을 기반으로 결정적 시드를 생성하여 일관된 행성 이미지를 생성합니다.
 */

// 시드 생성 함수들
export function normalizeString(str: string): string {
  return str.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9 ]/g, '');
}

export function fnv1a32(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash >>> 0) * 0x01000193;
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function generateSeed(name: string, genre: string, description: string): number {
  const key = normalizeString(name) + '|' + normalizeString(genre) + '|' + normalizeString(description);
  return fnv1a32(key);
}

// 장르별 팔레트 정의
export const GENRE_PALETTES = {
  action: ['#3b82f6', '#1d4ed8', '#0f172a', '#93c5fd'],
  rpg: ['#a855f7', '#6b21a8', '#1e1b4b', '#d8b4fe'],
  puzzle: ['#22c55e', '#15803d', '#052e16', '#86efac'],
  strategy: ['#f59e0b', '#b45309', '#3f2d0c', '#fed7aa'],
  adventure: ['#06b6d4', '#0891b2', '#0e7490', '#67e8f9'],
  simulation: ['#84cc16', '#65a30d', '#3f6212', '#a3e635'],
  sports: ['#ef4444', '#dc2626', '#991b1b', '#fca5a5'],
  default: ['#f59e0b', '#b45309', '#3f2d0c', '#fed7aa']
} as const;

export type GenreKey = keyof typeof GENRE_PALETTES;

export function pickPalette(genre: string): string[] {
  const normalizedGenre = normalizeString(genre).split(' ')[0];
  const genreKey = Object.keys(GENRE_PALETTES).find(key => 
    normalizedGenre.includes(key)
  ) as GenreKey;
  
  return GENRE_PALETTES[genreKey] || GENRE_PALETTES.default;
}

// 행성 렌더링 인터페이스
export interface PlanetRenderOptions {
  name: string;
  genre: string;
  description: string;
  size?: number;
}

// 행성 렌더링 함수
export function renderPlanetCanvas(options: PlanetRenderOptions): HTMLCanvasElement {
  const { name, genre, description, size = 128 } = options;
  
  // 시드 생성
  const seed = generateSeed(name, genre, description);
  const rnd = mulberry32(seed);
  const palette = pickPalette(genre);
  
  // 캔버스 생성
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  // 배경 (우주)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  
  // 행성 크기 및 위치
  const planetRadius = Math.floor(size * 0.4 + rnd() * size * 0.05);
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 행성 마스크 생성
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  // 행성 본체 렌더링
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= planetRadius) {
        // 행성 내부
        const noise = rnd();
        const shade = noise < 0.33 ? 0 : noise < 0.66 ? 1 : 2;
        const colorIndex = Math.min(shade + 1, palette.length - 1);
        const color = palette[colorIndex];
        
        // 색상 파싱
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        const index = (y * size + x) * 4;
        data[index] = r;     // Red
        data[index + 1] = g; // Green
        data[index + 2] = b; // Blue
        data[index + 3] = 255; // Alpha
      } else {
        // 우주 배경 (투명)
        const index = (y * size + x) * 4;
        data[index] = 0;     // Red
        data[index + 1] = 0; // Green
        data[index + 2] = 0; // Blue
        data[index + 3] = 255; // Alpha
      }
    }
  }
  
  // 이미지 데이터 적용
  ctx.putImageData(imageData, 0, 0);
  
  // 행성 외곽선 (글로우 효과)
  ctx.strokeStyle = palette[1];
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, planetRadius + 2, 0, Math.PI * 2);
  ctx.stroke();
  
  // 행성 표면 질감 추가
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = planetRadius * 0.7;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (rnd() > 0.5) {
      ctx.fillStyle = palette[2];
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 글로우 효과 복원
  ctx.globalAlpha = 1.0;
  
  return canvas;
}

// PNG Blob으로 변환
export async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob 변환 실패'));
        }
      },
      'image/png',
      0.9
    );
  });
}

// 행성 생성 및 PNG 변환
export async function generatePlanetThumbnail(options: PlanetRenderOptions): Promise<Blob> {
  const canvas = renderPlanetCanvas(options);
  return await canvasToPngBlob(canvas);
}

// 기본 프리셋 행성 이미지 URL (실패 시 대체용)
export const FALLBACK_PLANET_URL = 'https://picsum.photos/128/128?random=planet';
