'use client';

import React, { useEffect, useRef } from 'react';
import { PlanetType } from '@/types/adoption';

interface PlanetPixelArtProps {
  planetType: PlanetType;
  size?: number;
  className?: string;
}

export function PlanetPixelArt({ planetType, size = 64, className = '' }: PlanetPixelArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // 배경을 투명하게
    ctx.clearRect(0, 0, size, size);

    // 행성 유형별 색상과 패턴 정의
    const planetConfigs = {
      terran: {
        colors: ['#4a7c59', '#8fbc8f', '#90ee90', '#228b22'],
        pattern: () => {
          // 지구형 행성: 녹색 계열, 대륙 모양
          ctx.fillStyle = '#4a7c59';
          ctx.fillRect(0, 0, size, size);
          
          // 대륙 모양
          ctx.fillStyle = '#8fbc8f';
          ctx.fillRect(size * 0.2, size * 0.3, size * 0.3, size * 0.2);
          ctx.fillRect(size * 0.6, size * 0.5, size * 0.25, size * 0.15);
          ctx.fillRect(size * 0.1, size * 0.6, size * 0.2, size * 0.25);
          
          // 바다
          ctx.fillStyle = '#90ee90';
          ctx.fillRect(size * 0.4, size * 0.1, size * 0.2, size * 0.15);
          ctx.fillRect(size * 0.7, size * 0.7, size * 0.2, size * 0.2);
        }
      },
      gas_giant: {
        colors: ['#ff6b35', '#f7931e', '#ffd23f', '#ff6b6b'],
        pattern: () => {
          // 가스 거대 행성: 주황색 계열, 줄무늬 패턴
          ctx.fillStyle = '#ff6b35';
          ctx.fillRect(0, 0, size, size);
          
          // 줄무늬
          ctx.fillStyle = '#f7931e';
          for (let i = 0; i < 5; i++) {
            ctx.fillRect(0, size * (0.1 + i * 0.15), size, size * 0.08);
          }
          
          // 스팟
          ctx.fillStyle = '#ffd23f';
          ctx.fillRect(size * 0.3, size * 0.2, size * 0.15, size * 0.15);
          ctx.fillRect(size * 0.6, size * 0.6, size * 0.12, size * 0.12);
        }
      },
      ice_world: {
        colors: ['#87ceeb', '#b0e0e6', '#e0ffff', '#f0f8ff'],
        pattern: () => {
          // 얼음 세계: 파란색 계열, 극지 모양
          ctx.fillStyle = '#87ceeb';
          ctx.fillRect(0, 0, size, size);
          
          // 극지
          ctx.fillStyle = '#b0e0e6';
          ctx.fillRect(size * 0.1, size * 0.1, size * 0.8, size * 0.1);
          ctx.fillRect(size * 0.1, size * 0.8, size * 0.8, size * 0.1);
          
          // 얼음 크리스탈
          ctx.fillStyle = '#e0ffff';
          for (let i = 0; i < 8; i++) {
            const x = size * (0.1 + i * 0.1);
            const y = size * (0.3 + Math.sin(i) * 0.2);
            ctx.fillRect(x, y, size * 0.05, size * 0.1);
          }
        }
      },
      desert: {
        colors: ['#f4a460', '#deb887', '#d2b48c', '#cd853f'],
        pattern: () => {
          // 사막: 모래색 계열, 언덕 모양
          ctx.fillStyle = '#f4a460';
          ctx.fillRect(0, 0, size, size);
          
          // 모래 언덕
          ctx.fillStyle = '#deb887';
          for (let i = 0; i < 6; i++) {
            const x = size * (i * 0.15);
            const height = size * (0.1 + Math.sin(i) * 0.05);
            ctx.fillRect(x, size - height, size * 0.15, height);
          }
          
          // 바위
          ctx.fillStyle = '#cd853f';
          ctx.fillRect(size * 0.4, size * 0.3, size * 0.2, size * 0.15);
          ctx.fillRect(size * 0.7, size * 0.5, size * 0.15, size * 0.1);
        }
      },
      ocean: {
        colors: ['#1e90ff', '#4169e1', '#0000cd', '#000080'],
        pattern: () => {
          // 바다: 파란색 계열, 파도 패턴
          ctx.fillStyle = '#1e90ff';
          ctx.fillRect(0, 0, size, size);
          
          // 파도
          ctx.fillStyle = '#4169e1';
          for (let i = 0; i < 8; i++) {
            const x = size * (i * 0.12);
            const y = size * (0.2 + Math.sin(i * 0.5) * 0.1);
            ctx.fillRect(x, y, size * 0.1, size * 0.05);
          }
          
          // 깊은 바다
          ctx.fillStyle = '#0000cd';
          ctx.fillRect(size * 0.3, size * 0.6, size * 0.4, size * 0.3);
        }
      },
      volcanic: {
        colors: ['#8b0000', '#dc143c', '#ff0000', '#ff4500'],
        pattern: () => {
          // 화산: 빨간색 계열, 용암 패턴
          ctx.fillStyle = '#8b0000';
          ctx.fillRect(0, 0, size, size);
          
          // 용암 흐름
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(size * 0.2, size * 0.1, size * 0.6, size * 0.1);
          ctx.fillRect(size * 0.3, size * 0.3, size * 0.4, size * 0.1);
          ctx.fillRect(size * 0.4, size * 0.5, size * 0.2, size * 0.1);
          
          // 화산 분화구
          ctx.fillStyle = '#ff4500';
          ctx.fillRect(size * 0.4, size * 0.7, size * 0.2, size * 0.2);
        }
      }
    };

    const config = planetConfigs[planetType];
    if (config) {
      config.pattern();
    }

  }, [planetType, size]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{ 
        imageRendering: 'pixelated',
        width: size,
        height: size
      }}
    />
  );
}
