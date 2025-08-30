import { UniverseMapConfig } from '@/types/universe';

export const UNIVERSE_CONFIG: UniverseMapConfig = {
  width: 10000,
  height: 10000,
  backgroundColor: '#000000',
  starFieldDensity: 0.0001,
  planetCount: 15,
  minPlanetSize: 20,
  maxPlanetSize: 40,
};

export const PLANET_TYPES = {
  terran: {
    color: '#4ade80',
    glowColor: '#22c55e',
    name: 'Terran',
    genre: '액션 어드벤처',
  },
  gas_giant: {
    color: '#fbbf24',
    glowColor: '#f59e0b',
    name: 'Gas Giant',
    genre: '퍼즐',
  },
  ice_world: {
    color: '#93c5fd',
    glowColor: '#3b82f6',
    name: 'Ice World',
    genre: '전략',
  },
  desert: {
    color: '#f97316',
    glowColor: '#ea580c',
    name: 'Desert',
    genre: 'RPG',
  },
  ocean: {
    color: '#06b6d4',
    glowColor: '#0891b2',
    name: 'Ocean',
    genre: '시뮬레이션',
  },
  volcanic: {
    color: '#ef4444',
    glowColor: '#dc2626',
    name: 'Volcanic',
    genre: '슈팅',
  },
} as const;

export const CAMERA_CONFIG = {
  minScale: 0.1,
  maxScale: 3.0,
  zoomSpeed: 0.1,
  panSpeed: 1.0,
  inertiaDecay: 0.95,
  smoothness: 0.1,
};

export const PERFORMANCE_CONFIG = {
  targetFPS: 60,
  minFPS: 45,
  maxPlanets: 200,
  cullingDistance: 2000,
};
