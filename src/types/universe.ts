export interface Planet {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  type: 'terran' | 'gas_giant' | 'ice_world' | 'desert' | 'ocean' | 'volcanic';
  color: string;
  glowIntensity: number;
  // 게임 정보 추가
  genre: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  // 상세 정보 모달용 추가 필드
  gallery: string[];
  externalUrl: string;
  websiteUrl?: string;
  developerName?: string;
  releaseDate?: string;
  platforms?: string[];
}

export interface CameraState {
  x: number;
  y: number;
  scale: number;
  targetX: number;
  targetY: number;
  targetScale: number;
}

export interface UniverseMapConfig {
  width: number;
  height: number;
  backgroundColor: string;
  starFieldDensity: number;
  planetCount: number;
  minPlanetSize: number;
  maxPlanetSize: number;
}

export interface InteractionState {
  isDragging: boolean;
  isZooming: boolean;
  lastMouseX: number;
  lastMouseY: number;
  dragStartX: number;
  dragStartY: number;
}

export interface HoverState {
  target: Planet | null;
  mouse: { x: number; y: number };
  visible: boolean;
  dragging: boolean;
}

// 행성 상세 정보 모달 상태
export interface PlanetModalState {
  isOpen: boolean;
  selectedPlanetId: string | null;
  isAnimating: boolean;
  lastViewport: {
    x: number;
    y: number;
    scale: number;
  } | null;
}

// 행성 상세 정보 데이터
export interface PlanetDetailData {
  id: string;
  name: string;
  genre: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  gallery: string[];
  externalUrl: string;
  websiteUrl?: string;
  developerName?: string;
  releaseDate?: string;
  platforms?: string[];
  type: 'terran' | 'gas_giant' | 'ice_world' | 'desert' | 'ocean' | 'volcanic';
}
