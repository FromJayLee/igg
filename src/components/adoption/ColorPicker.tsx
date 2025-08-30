'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { COLOR_PRESETS, ColorPreset } from '@/types/adoption';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: ColorPreset[];
  className?: string;
  error?: string;
}

export function ColorPicker({ 
  label, 
  value, 
  onChange, 
  presets = Object.keys(COLOR_PRESETS) as ColorPreset[],
  className = '',
  error 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: ColorPreset) => {
    onChange(COLOR_PRESETS[preset]);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-universe-text-primary">
        {label}
      </Label>
      
      <div className="flex items-center gap-3">
        {/* 현재 선택된 색상 표시 */}
        <div className="relative">
          <div
            className="w-12 h-12 rounded-lg border-2 border-universe-surface/30 cursor-pointer transition-all duration-200 hover:border-universe-secondary/50"
            style={{ backgroundColor: value }}
            onClick={() => setIsOpen(!isOpen)}
            role="button"
            tabIndex={0}
            aria-label={`${label} 색상 선택: ${value}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(!isOpen);
              }
            }}
          />
          
          {/* 색상 피커 드롭다운 */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 p-4 bg-universe-surface border border-universe-surface/30 rounded-lg shadow-lg z-50 min-w-64">
              <div className="space-y-4">
                {/* 프리셋 색상 */}
                <div>
                  <h4 className="text-sm font-medium text-universe-text-primary mb-2">
                    프리셋 색상
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={cn(
                          "w-8 h-8 rounded border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-universe-primary focus:ring-offset-2",
                          value === COLOR_PRESETS[preset]
                            ? "border-universe-primary ring-2 ring-universe-primary ring-offset-1"
                            : "border-universe-surface/30 hover:border-universe-secondary"
                        )}
                        style={{ backgroundColor: COLOR_PRESETS[preset] }}
                        onClick={() => handlePresetSelect(preset)}
                        aria-label={`${preset} 색상 선택`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* 커스텀 색상 입력 */}
                <div>
                  <h4 className="text-sm font-medium text-universe-text-primary mb-2">
                    커스텀 색상
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={handleCustomColorChange}
                      className="w-10 h-10 rounded border border-universe-surface/30 cursor-pointer bg-transparent"
                      aria-label="커스텀 색상 선택"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={handleCustomColorChange}
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 bg-universe-surface/20 border border-universe-surface/30 rounded text-universe-text-primary placeholder:text-universe-text-secondary/50 focus:border-universe-secondary focus:outline-none"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      aria-label="색상 코드 입력"
                    />
                  </div>
                </div>
              </div>
              
              {/* 닫기 버튼 */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-universe-surface/20 hover:bg-universe-surface/40 flex items-center justify-center transition-colors duration-200"
                aria-label="색상 선택기 닫기"
              >
                <svg className="w-4 h-4 text-universe-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* 색상 코드 표시 */}
        <span className="text-sm font-mono text-universe-text-secondary">
          {value}
        </span>
      </div>
      
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
