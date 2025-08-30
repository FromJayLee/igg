'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePlanetModal } from './PlanetModalContext';
import { PlanetDetailData } from '@/types/universe';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface PlanetDetailModalProps {
  planetId: string;
  onClose: () => void;
}

// Mock 데이터 (실제 API 연동 시 교체)
const mockPlanetData: Record<string, PlanetDetailData> = {
  'planet-1': {
    id: 'planet-1',
    name: 'Cosmic Runner 2024',
    genre: '액션 어드벤처',
    tagline: '우주를 가로지르는 끝없는 모험',
    description: '무한한 우주 공간에서 다양한 행성들을 탐험하며 모험을 즐기는 액션 어드벤처 게임입니다. 각 행성마다 고유한 환경과 도전 과제가 기다리고 있으며, 플레이어는 점진적으로 강화되는 능력으로 더 깊은 우주로 나아갈 수 있습니다.',
    thumbnailUrl: 'https://picsum.photos/200/200?random=1',
    gallery: [
      'https://picsum.photos/400/225?random=2',
      'https://picsum.photos/400/225?random=3',
      'https://picsum.photos/400/225?random=4',
      'https://picsum.photos/400/225?random=5',
    ],
    externalUrl: 'https://store.steampowered.com',
    websiteUrl: 'https://cosmicrunner.com',
    developerName: 'Stellar Games',
    releaseDate: '2024-03-15',
    platforms: ['PC', 'Steam'],
    type: 'terran',
  },
  'planet-2': {
    id: 'planet-2',
    name: 'Nebula Puzzle Quest',
    genre: '퍼즐',
    tagline: '우주의 신비를 푸는 지적 도전',
    description: '우주의 다양한 천체들을 활용하여 복잡한 퍼즐을 해결하는 게임입니다. 각 레벨마다 새로운 메커니즘과 도전이 기다리고 있으며, 창의적인 사고와 논리적 추론이 요구됩니다.',
    thumbnailUrl: 'https://picsum.photos/200/200?random=6',
    gallery: [
      'https://picsum.photos/400/225?random=7',
      'https://picsum.photos/400/225?random=8',
    ],
    externalUrl: 'https://store.steampowered.com',
    websiteUrl: 'https://nebulapuzzle.com',
    developerName: 'Quantum Studios',
    releaseDate: '2024-02-20',
    platforms: ['PC', 'Mobile'],
    type: 'gas_giant',
  },
  'planet-3': {
    id: 'planet-3',
    name: 'Frozen Strategy',
    genre: '전략',
    tagline: '얼음 세계에서 펼쳐지는 전략적 대결',
    description: '극한의 추위 속에서 자원을 관리하고 적과 전투를 벌이는 전략 게임입니다. 제한된 자원과 혹독한 환경을 극복하며 문명을 발전시켜야 합니다.',
    thumbnailUrl: 'https://picsum.photos/200/200?random=9',
    gallery: [
      'https://picsum.photos/400/225?random=10',
      'https://picsum.photos/400/225?random=11',
      'https://picsum.photos/400/225?random=12',
    ],
    externalUrl: 'https://store.steampowered.com',
    websiteUrl: 'https://frozenstrategy.com',
    developerName: 'Arctic Games',
    releaseDate: '2024-01-10',
    platforms: ['PC', 'Switch'],
    type: 'ice_world',
  },
};

export function PlanetDetailModal({ planetId, onClose }: PlanetDetailModalProps) {
  const router = useRouter();
  const { closeModal } = usePlanetModal();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [planetData, setPlanetData] = useState<PlanetDetailData | null>(null);

  // Mock 데이터 로드 (실제 API 호출로 교체 예정)
  useEffect(() => {
    const data = mockPlanetData[planetId];
    if (data) {
      setPlanetData(data);
    }
  }, [planetId]);

  // ESC 키 처리
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // 모달 닫기 핸들러
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
    if (closeModal) {
      closeModal();
    }
  }, [onClose, closeModal]);

  // 이미지 변경 핸들러
  const handleImageChange = useCallback((direction: 'next' | 'prev') => {
    if (!planetData) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentImageIndex((prev) => 
          prev === planetData.gallery.length - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentImageIndex((prev) => 
          prev === 0 ? planetData.gallery.length - 1 : prev - 1
        );
      }
      setIsAnimating(false);
    }, 200);
  }, [planetData]);

  // 외부 링크 열기
  const handleExternalLink = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  if (!planetData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-universe-surface/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-universe-surface/95 backdrop-blur-md border-b border-white/20 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-universe-primary/20 flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-universe-text-primary">
                  {planetData.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-universe-primary/20 text-universe-primary border-universe-primary/30">
                    {planetData.genre}
                  </Badge>
                  <Badge variant="outline" className="border-universe-secondary/30 text-universe-secondary">
                    {planetData.type}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-universe-text-secondary hover:text-universe-text-primary hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 태그라인 */}
          <div className="text-center">
            <p className="text-lg text-universe-text-secondary font-pixel italic">
              "{planetData.tagline}"
            </p>
          </div>

          {/* 썸네일과 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 썸네일 */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden border-universe-surface/30 bg-universe-surface/50">
                <img
                  src={planetData.thumbnailUrl}
                  alt={planetData.name}
                  className="w-full aspect-square object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
              </Card>
            </div>

            {/* 기본 정보 */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-orbitron font-medium text-universe-text-primary mb-2">
                  게임 설명
                </h3>
                <p className="text-universe-text-secondary leading-relaxed">
                  {planetData.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-universe-text-secondary mb-1">개발사</h4>
                  <p className="text-universe-text-primary">{planetData.developerName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-universe-text-secondary mb-1">출시일</h4>
                  <p className="text-universe-text-primary">{planetData.releaseDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-universe-text-secondary mb-1">플랫폼</h4>
                  <div className="flex flex-wrap gap-1">
                    {planetData.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs border-universe-secondary/30 text-universe-secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-universe-text-secondary mb-1">행성 유형</h4>
                  <Badge variant="outline" className="border-universe-primary/30 text-universe-primary">
                    {planetData.type}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* 갤러리 */}
          {planetData.gallery.length > 0 && (
            <div>
              <h3 className="text-lg font-orbitron font-medium text-universe-text-primary mb-4">
                스크린샷 갤러리
              </h3>
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl border border-universe-surface/30">
                  <img
                    src={planetData.gallery[currentImageIndex]}
                    alt={`${planetData.name} 스크린샷 ${currentImageIndex + 1}`}
                    className={`w-full h-64 object-cover transition-opacity duration-200 ${
                      isAnimating ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  
                  {/* 네비게이션 버튼 */}
                  {planetData.gallery.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleImageChange('prev')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-universe-surface/80 hover:bg-universe-surface/90 text-universe-text-primary"
                        disabled={isAnimating}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleImageChange('next')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-universe-surface/80 hover:bg-universe-surface/90 text-universe-text-primary"
                        disabled={isAnimating}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                {/* 썸네일 인디케이터 */}
                {planetData.gallery.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {planetData.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? 'bg-universe-primary'
                            : 'bg-universe-surface/30 hover:bg-universe-surface/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {planetData.externalUrl && (
              <Button
                onClick={() => handleExternalLink(planetData.externalUrl!)}
                className="flex-1 bg-universe-primary hover:bg-universe-primary/90 text-white font-medium"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                게임 플레이
              </Button>
            )}
            {planetData.websiteUrl && (
              <Button
                variant="outline"
                onClick={() => handleExternalLink(planetData.websiteUrl!)}
                className="flex-1 border-universe-secondary/30 text-universe-secondary hover:bg-universe-secondary/10"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                공식 웹사이트
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default 추가
export default PlanetDetailModal;
