'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ElementSelectorProps {
  title: string;
  elements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }>;
  className?: string;
}

export function ElementSelector({ title, elements, className = '' }: ElementSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-medium text-universe-text-primary">
        {title}
      </Label>
      
      <div className="grid grid-cols-2 gap-3">
        {elements.map((element) => (
          <button
            key={element.id}
            type="button"
            onClick={() => !element.disabled && element.onChange(!element.value)}
            disabled={element.disabled}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-universe-primary focus:ring-offset-2 focus:ring-offset-universe-background",
              element.value
                ? "border-universe-primary bg-universe-primary/10 shadow-lg shadow-universe-primary/20"
                : "border-universe-surface/30 hover:border-universe-secondary/50 hover:bg-universe-surface/20",
              element.disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-checked={element.value}
            role="checkbox"
            tabIndex={element.disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (!element.disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                element.onChange(!element.value);
              }
            }}
          >
            {/* 선택 상태 글로우 효과 */}
            {element.value && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-universe-primary/20 to-universe-secondary/20 animate-pulse" />
            )}
            
            <div className="relative z-10 text-center">
              {/* 요소 아이콘 */}
              <div className="text-2xl mb-2">
                {element.icon}
              </div>
              
              {/* 요소 이름 */}
              <div className="text-sm font-medium text-universe-text-primary mb-1">
                {element.name}
              </div>
              
              {/* 요소 설명 */}
              <div className="text-xs text-universe-text-secondary">
                {element.description}
              </div>
              
              {/* 선택 상태 체크마크 */}
              {element.value && (
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
        ))}
      </div>
    </div>
  );
}

// 외부 요소 선택기 (고리, 위성)
interface ExteriorSelectorProps {
  rings: boolean;
  satellites: number;
  onRingsChange: (value: boolean) => void;
  onSatellitesChange: (value: number) => void;
  className?: string;
}

export function ExteriorSelector({
  rings,
  satellites,
  onRingsChange,
  onSatellitesChange,
  className = ''
}: ExteriorSelectorProps) {
  const exteriorElements = [
    {
      id: 'rings',
      name: '고리',
      description: '행성 주변의 고리 시스템',
      icon: '💍',
      value: rings,
      onChange: onRingsChange,
    },
    {
      id: 'satellites',
      name: '위성',
      description: `주변 위성 ${satellites}개`,
      icon: '🌙',
      value: satellites > 0,
      onChange: () => onSatellitesChange(satellites > 0 ? 0 : 1),
    }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-medium text-universe-text-primary">
        외부 요소
      </Label>
      
      <div className="grid grid-cols-2 gap-3">
        {exteriorElements.map((element) => (
          <button
            key={element.id}
            type="button"
            onClick={() => element.onChange(!element.value)}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-universe-primary focus:ring-offset-2 focus:ring-offset-universe-background",
              element.value
                ? "border-universe-primary bg-universe-primary/10 shadow-lg shadow-universe-primary/20"
                : "border-universe-surface/30 hover:border-universe-secondary/50 hover:bg-universe-surface/20"
            )}
            aria-checked={element.value}
            role="checkbox"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.onChange(!element.value);
              }
            }}
          >
            {/* 선택 상태 글로우 효과 */}
            {element.value && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-universe-primary/20 to-universe-secondary/20 animate-pulse" />
            )}
            
            <div className="relative z-10 text-center">
              {/* 요소 아이콘 */}
              <div className="text-2xl mb-2">
                {element.icon}
              </div>
              
              {/* 요소 이름 */}
              <div className="text-sm font-medium text-universe-text-primary mb-1">
                {element.name}
              </div>
              
              {/* 요소 설명 */}
              <div className="text-xs text-universe-text-secondary">
                {element.description}
              </div>
              
              {/* 선택 상태 체크마크 */}
              {element.value && (
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
        ))}
      </div>
      
      {/* 위성 개수 조절 (위성이 활성화되었을 때만) */}
      {satellites > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-universe-text-primary">
              위성 개수
            </Label>
            <span className="text-sm text-universe-text-secondary">
              {satellites}개
            </span>
          </div>
          
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={satellites}
            onChange={(e) => onSatellitesChange(parseInt(e.target.value))}
            className="w-full h-2 bg-universe-surface/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ff2d9d 0%, #05d9e8 ${(satellites - 1) / 2 * 100}%, rgba(255, 255, 255, 0.1) ${(satellites - 1) / 2 * 100}%)`
            }}
            aria-label="위성 개수 조절"
          />
          
          <div className="flex justify-between text-xs text-universe-text-secondary">
            <span>1개</span>
            <span>2개</span>
            <span>3개</span>
          </div>
        </div>
      )}
    </div>
  );
}

// 내부 요소 선택기 (물, 화산, 대지, 폭풍)
interface InteriorSelectorProps {
  water: boolean;
  volcano: boolean;
  land: boolean;
  storm: boolean;
  onWaterChange: (value: boolean) => void;
  onVolcanoChange: (value: boolean) => void;
  onLandChange: (value: boolean) => void;
  onStormChange: (value: boolean) => void;
  className?: string;
}

export function InteriorSelector({
  water,
  volcano,
  land,
  storm,
  onWaterChange,
  onVolcanoChange,
  onLandChange,
  onStormChange,
  className = ''
}: InteriorSelectorProps) {
  const interiorElements = [
    {
      id: 'water',
      name: '물',
      description: '바다와 호수',
      icon: '💧',
      value: water,
      onChange: onWaterChange,
    },
    {
      id: 'volcano',
      name: '화산',
      description: '활화산과 지열',
      icon: '🌋',
      value: volcano,
      onChange: onVolcanoChange,
    },
    {
      id: 'land',
      name: '대지',
      description: '육지와 산맥',
      icon: '🏔️',
      value: land,
      onChange: onLandChange,
    },
    {
      id: 'storm',
      name: '폭풍',
      description: '기상 현상',
      icon: '⛈️',
      value: storm,
      onChange: onStormChange,
    }
  ];

  return (
    <ElementSelector
      title="내부 요소"
      elements={interiorElements}
      className={className}
    />
  );
}
