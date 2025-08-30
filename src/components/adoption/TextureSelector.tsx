'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { TEXTURE_IDS, TextureId } from '@/types/adoption';
import { cn } from '@/lib/utils';

interface TextureSelectorProps {
  selectedTexture: TextureId;
  intensity: number;
  onTextureChange: (texture: TextureId) => void;
  onIntensityChange: (intensity: number) => void;
  className?: string;
  error?: string;
}

// 질감별 아이콘 및 설명
const TEXTURE_INFO: Record<TextureId, { name: string; description: string; icon: string }> = {
  cracks: {
    name: '균열',
    description: '행성 표면의 균열과 갈라진 틈',
    icon: '🔶'
  },
  dots: {
    name: '점무늬',
    description: '작은 점들로 이루어진 패턴',
    icon: '🔴'
  },
  clouds: {
    name: '구름',
    description: '대기권의 구름과 안개',
    icon: '☁️'
  },
  none: {
    name: '없음',
    description: '질감 없음',
    icon: '⚪'
  }
};

export function TextureSelector({
  selectedTexture,
  intensity,
  onTextureChange,
  onIntensityChange,
  className = '',
  error
}: TextureSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-medium text-universe-text-primary">
        질감 선택
      </Label>
      
      {/* 질감 타입 선택 */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(TEXTURE_IDS).map(([key, value]) => {
          const texture = key as TextureId;
          const isSelected = selectedTexture === texture;
          const info = TEXTURE_INFO[texture];
          
          return (
            <button
              key={texture}
              type="button"
              onClick={() => onTextureChange(texture)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-universe-primary focus:ring-offset-2 focus:ring-offset-universe-background",
                isSelected
                  ? "border-universe-primary bg-universe-primary/10 shadow-lg shadow-universe-primary/20"
                  : "border-universe-surface/30 hover:border-universe-secondary/50 hover:bg-universe-surface/20"
              )}
              aria-checked={isSelected}
              role="radio"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTextureChange(texture);
                }
              }}
            >
              {/* 선택 상태 글로우 효과 */}
              {isSelected && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-universe-primary/20 to-universe-secondary/20 animate-pulse" />
              )}
              
              <div className="relative z-10 text-center">
                {/* 질감 아이콘 */}
                <div className="text-2xl mb-2">
                  {info.icon}
                </div>
                
                {/* 질감 이름 */}
                <div className="text-sm font-medium text-universe-text-primary mb-1">
                  {info.name}
                </div>
                
                {/* 질감 설명 */}
                <div className="text-xs text-universe-text-secondary">
                  {info.description}
                </div>
                
                {/* 선택 상태 체크마크 */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-universe-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 질감 강도 조절 (질감이 'none'이 아닐 때만 표시) */}
      {selectedTexture !== 'none' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-universe-text-primary">
              질감 강도
            </Label>
            <span className="text-sm text-universe-text-secondary">
              {Math.round(intensity * 100)}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-universe-surface/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ff2d9d 0%, #05d9e8 ${intensity * 100}%, rgba(255, 255, 255, 0.1) ${intensity * 100}%)`
            }}
            aria-label="질감 강도 조절"
          />
          
          <div className="flex justify-between text-xs text-universe-text-secondary">
            <span>약함</span>
            <span>강함</span>
          </div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="text-sm text-red-400 flex items-center gap-2" role="alert">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
