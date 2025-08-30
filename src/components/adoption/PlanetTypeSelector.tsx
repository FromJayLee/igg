'use client';

import React from 'react';
import { PLANET_TYPES, PlanetType } from '@/types/adoption';
import { PlanetPixelArt } from '@/components/ui/PlanetPixelArt';
import { cn } from '@/lib/utils';

interface PlanetTypeSelectorProps {
  selectedType: PlanetType | null;
  onSelect: (type: PlanetType) => void;
  error?: string;
}

// 행성 유형별 픽셀 아트 이미지 (실제 이미지로 교체 예정)
const PLANET_IMAGES: Record<PlanetType, string> = {
  terran: 'https://picsum.photos/64/64?random=1',
  gas_giant: 'https://picsum.photos/64/64?random=2',
  ice_world: 'https://picsum.photos/64/64?random=3',
  desert: 'https://picsum.photos/64/64?random=4',
  ocean: 'https://picsum.photos/64/64?random=5',
  volcanic: 'https://picsum.photos/64/64?random=6',
};

// 행성 유형별 이름
const PLANET_NAMES: Record<PlanetType, string> = {
  terran: 'Terran',
  gas_giant: 'Gas Giant',
  ice_world: 'Ice World',
  desert: 'Desert',
  ocean: 'Ocean',
  volcanic: 'Volcanic',
};

export function PlanetTypeSelector({ selectedType, onSelect, error }: PlanetTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-universe-text-primary mb-3">
          행성 유형 선택 *
        </label>
        <div 
          className="grid grid-cols-3 gap-4"
          role="radiogroup"
          aria-labelledby="planet-type-label"
          aria-describedby={error ? "planet-type-error" : undefined}
        >
          {Object.entries(PLANET_TYPES).map(([key, value]) => {
            const type = key as PlanetType;
            const isSelected = selectedType === type;
            
            return (
              <button
                key={type}
                type="button"
                onClick={() => onSelect(type)}
                className={cn(
                  "relative group p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-universe-primary focus:ring-offset-2 focus:ring-offset-universe-background",
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
                    onSelect(type);
                  }
                }}
              >
                {/* 선택 상태 글로우 효과 */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-universe-primary/20 to-universe-secondary/20 animate-pulse" />
                )}
                
                <div className="relative z-10 text-center">
                                  {/* 행성 이미지 */}
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <PlanetPixelArt
                    planetType={type}
                    size={64}
                    className={cn(
                      "w-full h-full rounded-full border-2 transition-all duration-300",
                      isSelected
                        ? "border-universe-primary shadow-lg shadow-universe-primary/50"
                        : "border-universe-surface/50 group-hover:border-universe-secondary"
                    )}
                  />
                    
                    {/* 선택 상태 체크마크 */}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-universe-primary rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 행성 이름 */}
                  <div className="text-sm font-medium text-universe-text-primary">
                    {PLANET_NAMES[type]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 에러 메시지 */}
      {error && (
        <div 
          id="planet-type-error"
          className="text-sm text-red-400 flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
