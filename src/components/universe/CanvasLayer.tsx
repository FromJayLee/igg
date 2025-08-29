'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Planet, CameraState, InteractionState } from '@/types/universe';
import { CAMERA_CONFIG, PERFORMANCE_CONFIG } from '@/constants/universe';
import { isInViewport, clamp, lerp } from '@/lib/universe-utils';

interface CanvasLayerProps {
  width: number;
  height: number;
  planets: Planet[];
  camera: CameraState;
  interaction: InteractionState;
  onCameraChange: (camera: CameraState) => void;
  onInteractionChange: (interaction: InteractionState) => void;
}

export function CanvasLayer({
  width,
  height,
  planets,
  camera,
  interaction,
  onCameraChange,
  onInteractionChange,
}: CanvasLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const planetsContainerRef = useRef<PIXI.Container | null>(null);
  const starsContainerRef = useRef<PIXI.Container | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // PixiJS 애플리케이션 초기화 (PixiJS v8 방식)
  const initializePixiApp = useCallback(async () => {
    if (!canvasRef.current) return;

    let app: PIXI.Application | null = null;
    let mounted = true;

    try {
      // PixiJS v8에서는 Application 생성 후 init 호출
      app = new PIXI.Application();
      await app.init({
        canvas: canvasRef.current,
        width,
        height,
        backgroundColor: 0x000000,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        powerPreference: 'high-performance',
      });

      if (!mounted) {
        app.destroy(true);
        return;
      }

      appRef.current = app;

      // 별 필드 컨테이너 생성
      const starsContainer = new PIXI.Container();
      app.stage.addChild(starsContainer);
      starsContainerRef.current = starsContainer;

      // 행성 컨테이너 생성
      const planetsContainer = new PIXI.Container();
      app.stage.addChild(planetsContainer);
      planetsContainerRef.current = planetsContainer;

      // 별 필드 생성
      createStarField();
      
      setIsInitialized(true);
    } catch (error) {
      console.error('PixiJS 초기화 실패:', error);
      if (app && mounted) {
        app.destroy(true);
      }
    }

    return () => {
      mounted = false;
      if (app) {
        app.destroy(true);
      }
    };
  }, [width, height]);

  // 별 필드 생성
  const createStarField = useCallback(() => {
    if (!starsContainerRef.current) return;

    const starsContainer = starsContainerRef.current;
    starsContainer.removeChildren();

    // 1000개의 별 생성
    for (let i = 0; i < 1000; i++) {
      const star = new PIXI.Graphics();
      const x = (Math.random() - 0.5) * 10000;
      const y = (Math.random() - 0.5) * 10000;
      const brightness = Math.random() * 0.8 + 0.2;
      const size = Math.random() * 2 + 1;

      star.beginFill(0xffffff, brightness);
      star.drawCircle(0, 0, size);
      star.endFill();
      star.position.set(x, y);

      starsContainer.addChild(star);
    }
  }, []);

  // 행성 스프라이트 생성
  const createPlanetSprites = useCallback(() => {
    if (!planetsContainerRef.current) return;

    const planetsContainer = planetsContainerRef.current;
    planetsContainer.removeChildren();

    planets.forEach((planet) => {
      const planetSprite = new PIXI.Graphics();
      
      // 행성 본체
      planetSprite.beginFill(planet.color);
      planetSprite.drawCircle(0, 0, planet.size);
      planetSprite.endFill();

      // 글로우 효과
      const glow = new PIXI.Graphics();
      glow.beginFill(planet.color, planet.glowIntensity * 0.3);
      glow.drawCircle(0, 0, planet.size * 1.5);
      glow.endFill();
      glow.position.set(0, 0);

      // 행성과 글로우를 그룹으로 묶기
      const planetGroup = new PIXI.Container();
      planetGroup.addChild(glow);
      planetGroup.addChild(planetSprite);
      planetGroup.position.set(planet.x, planet.y);

      // 인터랙션 설정 (PixiJS v8에서는 eventMode 사용)
      planetGroup.eventMode = 'static';
      planetGroup.cursor = 'pointer';

      planetsContainer.addChild(planetGroup);
    });
  }, [planets]);

  // 카메라 업데이트
  const updateCamera = useCallback(() => {
    if (!appRef.current || !planetsContainerRef.current || !starsContainerRef.current) return;

    const app = appRef.current;
    const planetsContainer = planetsContainerRef.current;
    const starsContainer = starsContainerRef.current;

    // 부드러운 카메라 이동
    camera.x = lerp(camera.x, camera.targetX, CAMERA_CONFIG.smoothness);
    camera.y = lerp(camera.y, camera.targetY, CAMERA_CONFIG.smoothness);
    camera.scale = lerp(camera.scale, camera.targetScale, CAMERA_CONFIG.smoothness);

    // 스케일 제한
    camera.scale = clamp(camera.scale, CAMERA_CONFIG.minScale, CAMERA_CONFIG.maxScale);

    // 컨테이너 변환 적용 (PixiJS v8에서는 position과 scale 직접 설정)
    planetsContainer.position.set(-camera.x * camera.scale + width / 2, -camera.y * camera.scale + height / 2);
    planetsContainer.scale.set(camera.scale, camera.scale);

    starsContainer.position.set(-camera.x * camera.scale + width / 2, -camera.y * camera.scale + height / 2);
    starsContainer.scale.set(camera.scale, camera.scale);

    // 뷰포트 컬링 적용
    planets.forEach((planet, index) => {
      const child = planetsContainer.children[index];
      if (child) {
        const isVisible = isInViewport(
          planet.x,
          planet.y,
          camera.x,
          camera.y,
          camera.scale,
          width,
          height,
          PERFORMANCE_CONFIG.cullingDistance
        );
        child.visible = isVisible;
      }
    });

    onCameraChange(camera);
  }, [camera, width, height, planets, onCameraChange]);

  // 애니메이션 루프
  const animate = useCallback(() => {
    if (!isInitialized) return;
    updateCamera();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateCamera, isInitialized]);

  // 마우스 이벤트 핸들러 (PixiJS v8에서는 FederatedPointerEvent 사용)
  const handleMouseDown = useCallback((e: PIXI.FederatedPointerEvent) => {
    const newInteraction: InteractionState = {
      ...interaction,
      isDragging: true,
      dragStartX: e.global.x,
      dragStartY: e.global.y,
      lastMouseX: e.global.x,
      lastMouseY: e.global.y,
    };
    onInteractionChange(newInteraction);
  }, [interaction, onInteractionChange]);

  const handleMouseMove = useCallback((e: PIXI.FederatedPointerEvent) => {
    if (!interaction.isDragging) return;

    const deltaX = e.global.x - interaction.lastMouseX;
    const deltaY = e.global.y - interaction.lastMouseY;

    const newCamera: CameraState = {
      ...camera,
      targetX: camera.targetX - deltaX / camera.scale,
      targetY: camera.targetY - deltaY / camera.scale,
    };

    const newInteraction: InteractionState = {
      ...interaction,
      lastMouseX: e.global.x,
      lastMouseY: e.global.y,
    };

    onCameraChange(newCamera);
    onInteractionChange(newInteraction);
  }, [interaction, camera, onCameraChange, onInteractionChange]);

  const handleMouseUp = useCallback(() => {
    const newInteraction: InteractionState = {
      ...interaction,
      isDragging: false,
    };
    onInteractionChange(newInteraction);
  }, [interaction, onInteractionChange]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 1 - CAMERA_CONFIG.zoomSpeed : 1 + CAMERA_CONFIG.zoomSpeed;
    const newScale = clamp(camera.targetScale * zoomFactor, CAMERA_CONFIG.minScale, CAMERA_CONFIG.maxScale);
    
    // 마우스 위치를 기준으로 줌
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const worldX = (mouseX - width / 2) / camera.scale + camera.x;
      const worldY = (mouseY - height / 2) / camera.scale + camera.y;
      
      const newCamera: CameraState = {
        ...camera,
        targetScale: newScale,
        targetX: worldX - (mouseX - width / 2) / newScale,
        targetY: worldY - (mouseY - height / 2) / newScale,
      };
      
      onCameraChange(newCamera);
    }
  }, [camera, width, height, onCameraChange]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      cleanup = await initializePixiApp();
    };

    init();

    return () => {
      if (cleanup) cleanup();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, [initializePixiApp]);

  // 행성 변경 시 스프라이트 재생성
  useEffect(() => {
    if (isInitialized) {
      createPlanetSprites();
    }
  }, [createPlanetSprites, isInitialized]);

  // 애니메이션 루프 시작
  useEffect(() => {
    if (isInitialized) {
      animate();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, isInitialized]);

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (!appRef.current || !isInitialized) return;

    const app = appRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, isInitialized]);

  // PixiJS 이벤트 등록 (PixiJS v8에서는 on 메서드 사용)
  useEffect(() => {
    if (!appRef.current || !planetsContainerRef.current || !isInitialized) return;

    const app = appRef.current;
    const planetsContainer = planetsContainerRef.current;

    app.stage.eventMode = 'static';
    
    // PixiJS v8에서는 on 메서드 사용
    app.stage.on('pointerdown', handleMouseDown);
    app.stage.on('pointermove', handleMouseMove);
    app.stage.on('pointerup', handleMouseUp);
    app.stage.on('pointerupoutside', handleMouseUp);

    return () => {
      app.stage.off('pointerdown', handleMouseDown);
      app.stage.off('pointermove', handleMouseMove);
      app.stage.off('pointerup', handleMouseUp);
      app.stage.off('pointerupoutside', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, isInitialized]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
