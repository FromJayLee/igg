'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { PlanetCustomization } from '@/types/adoption';
import { cn } from '@/lib/utils';

interface PlanetPreviewProps {
  customization: PlanetCustomization;
  size?: number;
  className?: string;
}

export function PlanetPreview({ 
  customization, 
  size = 200, 
  className = '' 
}: PlanetPreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const planetContainerRef = useRef<PIXI.Container | null>(null);

  // PixiJS 앱 초기화
  const initializePixi = useCallback(() => {
    if (!canvasRef.current || appRef.current) return;

    // PixiJS 앱 생성
    const app = new PIXI.Application({
      width: size,
      height: size,
      backgroundColor: 0x000000,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    // 픽셀 아트 스타일을 위한 설정
    app.stage.scale.set(1, 1);

    // 캔버스를 DOM에 추가
    canvasRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // 행성 컨테이너 생성
    const planetContainer = new PIXI.Container();
    planetContainer.position.set(size / 2, size / 2);
    app.stage.addChild(planetContainer);
    planetContainerRef.current = planetContainer;

    // 초기 렌더링
    renderPlanet(customization, planetContainer);
  }, [size, customization]);

  // 행성 렌더링 함수
  const renderPlanet = useCallback((config: PlanetCustomization, container: PIXI.Container) => {
    if (!container) return;

    // 기존 내용 제거
    container.removeChildren();

    // 기본 행성 구체
    const planet = new PIXI.Graphics();
    
    // 행성 크기 (전체 크기의 60%)
    const planetRadius = size * 0.3;
    
    // 기본 색상으로 원 그리기
    planet.beginFill(parseInt(config.colors.primary.replace('#', '0x')));
    planet.drawCircle(0, 0, planetRadius);
    planet.endFill();
    
    // 네온 글로우 효과
    planet.lineStyle(4, parseInt(config.colors.secondary || config.colors.primary.replace('#', '0x')), 0.8);
    planet.drawCircle(0, 0, planetRadius + 2);
    
    container.addChild(planet);

    // 질감 레이어 추가
    if (config.texture.id !== 'none') {
      const textureLayer = createTextureLayer(config.texture, planetRadius);
      if (textureLayer) {
        container.addChild(textureLayer);
      }
    }

    // 내부 요소 레이어 추가
    if (config.interior.water || config.interior.volcano || config.interior.land || config.interior.storm) {
      const interiorLayer = createInteriorLayer(config.interior, planetRadius);
      if (interiorLayer) {
        container.addChild(interiorLayer);
      }
    }

    // 외부 요소 추가
    if (config.exterior.rings) {
      const ringsLayer = createRingsLayer(config, planetRadius);
      if (ringsLayer) {
        container.addChild(ringsLayer);
      }
    }

    if (config.exterior.satellites && config.exterior.satellites > 0) {
      const satellitesLayer = createSatellitesLayer(config.exterior.satellites, planetRadius);
      if (satellitesLayer) {
        container.addChild(satellitesLayer);
      }
    }

    // 회전 애니메이션
    const animate = () => {
      container.rotation += 0.005;
      requestAnimationFrame(animate);
    };
    animate();
  }, [size]);

  // 질감 레이어 생성
  const createTextureLayer = useCallback((texture: { id: string; intensity: number }, radius: number) => {
    const layer = new PIXI.Graphics();
    
    switch (texture.id) {
      case 'cracks':
        // 균열 패턴
        layer.lineStyle(2, 0x4a1d79, texture.intensity);
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const startX = Math.cos(angle) * radius * 0.3;
          const startY = Math.sin(angle) * radius * 0.3;
          const endX = Math.cos(angle) * radius * 0.8;
          const endY = Math.sin(angle) * radius * 0.8;
          layer.moveTo(startX, startY);
          layer.lineTo(endX, endY);
        }
        break;
        
      case 'dots':
        // 점무늬 패턴
        layer.beginFill(0x4a1d79, texture.intensity);
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * radius * 0.7;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const dotSize = Math.random() * 3 + 1;
          layer.drawCircle(x, y, dotSize);
        }
        layer.endFill();
        break;
        
      case 'clouds':
        // 구름 패턴
        layer.beginFill(0xffffff, texture.intensity * 0.6);
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const distance = radius * 0.6;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const cloudSize = Math.random() * 15 + 10;
          layer.drawEllipse(x, y, cloudSize, cloudSize * 0.6);
        }
        layer.endFill();
        break;
    }
    
    return layer;
  }, []);

  // 내부 요소 레이어 생성
  const createInteriorLayer = useCallback((interior: any, radius: number) => {
    const layer = new PIXI.Graphics();
    
    if (interior.water) {
      // 물 영역
      layer.beginFill(0x05d9e8, 0.7);
      layer.drawCircle(0, 0, radius * 0.8);
      layer.endFill();
    }
    
    if (interior.land) {
      // 대지 영역
      layer.beginFill(0x8b4513, 0.8);
      layer.drawCircle(0, 0, radius * 0.6);
      layer.endFill();
    }
    
    if (interior.volcano) {
      // 화산
      layer.beginFill(0xff4500, 0.9);
      layer.drawEllipse(0, -radius * 0.3, radius * 0.2, radius * 0.4);
      layer.endFill();
    }
    
    if (interior.storm) {
      // 폭풍 효과
      layer.lineStyle(3, 0x4a1d79, 0.6);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * radius * 0.9;
        const y = Math.sin(angle) * radius * 0.9;
        layer.moveTo(x, y);
        layer.lineTo(x + Math.cos(angle + 0.5) * 10, y + Math.sin(angle + 0.5) * 10);
      }
    }
    
    return layer;
  }, []);

  // 고리 레이어 생성
  const createRingsLayer = useCallback((config: PlanetCustomization, radius: number) => {
    const layer = new PIXI.Graphics();
    
    // 고리 그리기
    layer.lineStyle(8, parseInt(config.colors.secondary || config.colors.primary.replace('#', '0x')), 0.6);
    layer.drawEllipse(0, 0, radius * 1.5, radius * 0.8);
    
    return layer;
  }, []);

  // 위성 레이어 생성
  const createSatellitesLayer = useCallback((satelliteCount: number, radius: number) => {
    const layer = new PIXI.Graphics();
    
    for (let i = 0; i < satelliteCount; i++) {
      const angle = (i / satelliteCount) * Math.PI * 2;
      const distance = radius * 1.8;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      // 위성 그리기
      layer.beginFill(0xcccccc);
      layer.drawCircle(x, y, 8);
      layer.endFill();
      
      // 위성 글로우
      layer.lineStyle(2, 0x05d9e8, 0.8);
      layer.drawCircle(x, y, 10);
    }
    
    return layer;
  }, []);

  // 커스터마이제이션 변경 시 재렌더링
  useEffect(() => {
    if (planetContainerRef.current) {
      renderPlanet(customization, planetContainerRef.current);
    }
  }, [customization, renderPlanet]);

  // 컴포넌트 마운트 시 PixiJS 초기화
  useEffect(() => {
    initializePixi();
    
    // 클린업
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [initializePixi]);

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={canvasRef} 
        className="rounded-lg overflow-hidden border-2 border-universe-surface/30"
        style={{ width: size, height: size }}
      />
      
      {/* 로딩 상태 */}
      {!appRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-universe-surface/20">
          <div className="text-universe-text-secondary text-sm">로딩 중...</div>
        </div>
      )}
    </div>
  );
}
