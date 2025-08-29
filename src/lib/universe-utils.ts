import { Planet } from '@/types/universe';
import { PLANET_TYPES, UNIVERSE_CONFIG } from '@/constants/universe';

export function generateRandomPlanets(count: number): Planet[] {
  const planets: Planet[] = [];
  const planetTypeKeys = Object.keys(PLANET_TYPES) as Array<keyof typeof PLANET_TYPES>;
  
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
