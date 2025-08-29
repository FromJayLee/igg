'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CanvasLayer } from './CanvasLayer';
import { Planet, CameraState, InteractionState } from '@/types/universe';
import { UNIVERSE_CONFIG, CAMERA_CONFIG } from '@/constants/universe';
import { generateRandomPlanets } from '@/lib/universe-utils';

interface UniverseMapProps {
  className?: string;
}

export function UniverseMap({ className = '' }: UniverseMapProps) {
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

  // 초기 행성 생성
  useEffect(() => {
    const initialPlanets = generateRandomPlanets(UNIVERSE_CONFIG.planetCount);
    setPlanets(initialPlanets);
  }, []);

  // 카메라 상태 업데이트
  const handleCameraChange = useCallback((newCamera: CameraState) => {
    setCamera(newCamera);
  }, []);

  // 인터랙션 상태 업데이트
  const handleInteractionChange = useCallback((newInteraction: InteractionState) => {
    setInteraction(newInteraction);
  }, []);

  // 키보드 네비게이션 (선택사항)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const moveSpeed = 100 / camera.scale;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        setCamera(prev => ({
          ...prev,
          targetY: prev.targetY - moveSpeed,
        }));
        break;
      case 'ArrowDown':
      case 's':
        setCamera(prev => ({
          ...prev,
          targetY: prev.targetY + moveSpeed,
        }));
        break;
      case 'ArrowLeft':
      case 'a':
        setCamera(prev => ({
          ...prev,
          targetX: prev.targetX - moveSpeed,
        }));
        break;
      case 'ArrowRight':
      case 'd':
        setCamera(prev => ({
          ...prev,
          targetX: prev.targetX + moveSpeed,
        }));
        break;
      case '0':
        // 홈 포지션으로 리셋
        setCamera({
          x: 0,
          y: 0,
          scale: 1,
          targetX: 0,
          targetY: 0,
          targetScale: 1,
        });
        break;
    }
  }, [camera.scale]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
        width={window.innerWidth}
        height={window.innerHeight}
        planets={planets}
        camera={camera}
        interaction={interaction}
        onCameraChange={handleCameraChange}
        onInteractionChange={handleInteractionChange}
      />
      
      {/* UI 오버레이 */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-universe-surface/80 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-6 text-universe-text-primary">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-universe-primary rounded-full animate-cyber-pulse"></div>
              <span className="text-universe-text-secondary font-pixel text-xs">카메라:</span>
              <span className="ml-2 font-orbitron text-sm font-medium">
                X: {Math.round(camera.x)}, Y: {Math.round(camera.y)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-universe-secondary rounded-full animate-neon-glow"></div>
              <span className="text-universe-text-secondary font-pixel text-xs">줌:</span>
              <span className="ml-2 font-orbitron text-sm font-medium">
                {Math.round(camera.scale * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-universe-primary rounded-full animate-cyber-pulse"></div>
              <span className="text-universe-text-secondary font-pixel text-xs">행성:</span>
              <span className="ml-2 font-orbitron text-sm font-medium">
                {planets.length}개
              </span>
            </div>
          </div>
        </div>
      </div>

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
            <div className="flex items-center gap-2">
              <span className="text-universe-primary">⌨️</span>
              <span>WASD/화살표: 이동</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-universe-secondary">0</span>
              <span>홈으로</span>
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

      {/* 제목 오버레이 */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-universe-surface/80 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
          <h1 className="text-2xl font-orbitron font-bold text-universe-text-primary animate-neon-glow">
            Indie Game Galaxy
          </h1>
          <p className="text-sm text-universe-text-secondary font-pixel mt-1">
            우주를 탐험하며 게임을 발견하세요
          </p>
        </div>
      </div>
    </div>
  );
}
