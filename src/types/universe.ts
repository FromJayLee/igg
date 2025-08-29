export interface Planet {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  type: 'terran' | 'gas_giant' | 'ice_world' | 'desert' | 'ocean' | 'volcanic';
  color: string;
  glowIntensity: number;
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
