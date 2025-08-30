'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { CanvasLayer } from './CanvasLayer';
import { PreviewCardPortal } from './PreviewCard';
import { Planet, CameraState, InteractionState } from '@/types/universe';
import { UNIVERSE_CONFIG, CAMERA_CONFIG } from '@/constants/universe';
import { generateRandomPlanets } from '@/lib/universe-utils';
import * as PIXI from 'pixi.js';
import { useRouter } from 'next/navigation';

// PlanetDetailModal을 동적으로 로드 (클라이언트 전용)
const PlanetDetailModal = dynamic(() => import('./PlanetDetailModal').then(mod => ({ default: mod.PlanetDetailModal })), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-universe-surface/95 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-universe-text-primary">로딩 중...</div>
      </div>
    </div>
  )
});

interface UniverseMapProps {
  className?: string;
}

export function UniverseMap({ className = '' }: UniverseMapProps) {
  const router = useRouter();
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [camera, setCamera] = useState<CameraState>({
    x: 0,
    y: 0,
    scale: 1,
    targetX: 0,
    targetY: 0,
    targetScale: 1,
  });
  const [interaction, setInteraction] = useState<InteractionState>({
    isDragging: false,
    isZooming: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragStartX: 0,
    dragStartY: 0,
  });
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const appRef = useRef<PIXI.Application | null>(null);

  // 초기 행성 생성
  useEffect(() => {
    const initialPlanets = generateRandomPlanets(UNIVERSE_CONFIG.planetCount);
    setPlanets(initialPlanets);
  }, []);

  // 클라이언트 사이드에서만 윈도우 크기 설정
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 카메라 상태 업데이트
  const handleCameraChange = useCallback((newCamera: CameraState) => {
    setCamera(newCamera);
  }, []);

  // 인터랙션 상태 업데이트
  const handleInteractionChange = useCallback((newInteraction: InteractionState) => {
    setInteraction(newInteraction);
  }, []);

  // PixiJS 앱 참조 저장
  const handleAppReady = useCallback((app: PIXI.Application) => {
    appRef.current = app;
  }, []);

  // 행성 클릭 핸들러
  const handlePlanetClick = useCallback((planetId: string) => {
    setSelectedPlanetId(planetId);
    router.push(`/planet/${planetId}`, { scroll: false });
  }, [router]);

  // 모달 닫기 핸들러
  const handleModalClose = useCallback(() => {
    setSelectedPlanetId(null);
    router.push('/', { scroll: false });
  }, [router]);

  // 성능 모니터링 (개발 모드에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          console.log(`Universe Map FPS: ${fps}`);
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
      };
      
      requestAnimationFrame(measureFPS);
    }
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-universe-background ${className}`}>
      {/* 우주 맵 캔버스 */}
      <CanvasLayer
        width={dimensions.width}
        height={dimensions.height}
        planets={planets}
        camera={camera}
        interaction={interaction}
        onCameraChange={handleCameraChange}
        onInteractionChange={handleInteractionChange}
        onAppReady={handleAppReady}
        onPlanetClick={handlePlanetClick}
      />
      
      {/* Hover 미리보기 카드 */}
      {appRef.current && <PreviewCardPortal app={appRef.current} />}
      
      {/* 행성 상세 정보 모달 */}
      {selectedPlanetId && (
        <PlanetDetailModal
          planetId={selectedPlanetId}
          onClose={handleModalClose}
        />
      )}
      
      {/* 컨트롤 가이드 */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-universe-surface/80 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
          <div className="text-universe-text-secondary font-pixel text-xs mb-3">컨트롤:</div>
          <div className="space-y-2 text-xs text-universe-text-primary">
            <div className="flex items-center gap-2">
              <span className="text-universe-primary">🖱️</span>
              <span>드래그: 우주 탐험</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-universe-secondary">🔍</span>
              <span>휠: 줌 인/아웃</span>
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {planets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-universe-surface/90 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-universe-primary/30 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-universe-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-xl font-orbitron text-universe-text-primary mt-6 mb-2">우주를 생성하는 중...</div>
            <div className="text-sm text-universe-text-secondary font-pixel">별들과 행성들을 준비하고 있습니다</div>
          </div>
        </div>
      )}


    </div>
  );
}
