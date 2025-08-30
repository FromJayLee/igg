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

  // 포커스 트랩
  useEffect(() => {
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (firstElement) {
        firstElement.focus();
      }

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, []);

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    // 애니메이션 완료 후 모달 닫기
    setTimeout(() => {
      closeModal();
      onClose();
      router.back();
    }, 300);
  }, [closeModal, onClose, router]);

  const handleExternalClick = useCallback((url: string) => {
    // 분석 이벤트 훅 (후속 구현 예정)
    console.log('External link clicked:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const nextImage = useCallback(() => {
    if (!planetData) return;
    setCurrentImageIndex((prev) => 
      prev === planetData.gallery.length - 1 ? 0 : prev + 1
    );
  }, [planetData]);

  const prevImage = useCallback(() => {
    if (!planetData) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? planetData.gallery.length - 1 : prev - 1
    );
  }, [planetData]);

  if (!planetData) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`planet-title-${planetId}`}
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* 모달 컨테이너 */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-4xl max-h-[90vh] bg-universe-surface/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-universe-surface/80 hover:bg-universe-surface rounded-full flex items-center justify-center text-white hover:text-universe-primary transition-all duration-200 hover:scale-110"
          aria-label="모달 닫기"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* 좌측 비주얼 영역 */}
          <div className="lg:w-1/2 p-6 flex flex-col items-center">
            {/* 회전하는 행성 썸네일 */}
            <div className="relative w-48 h-48 mb-6">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-universe-primary/30 animate-spin-slow">
                <img
                  src={planetData.thumbnailUrl}
                  alt={`${planetData.name} 썸네일`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-universe-secondary animate-spin-slow-reverse"></div>
            </div>

            {/* 갤러리 */}
            {planetData.gallery.length > 0 && (
              <div className="w-full max-w-sm">
                <div className="relative">
                  <img
                    src={planetData.gallery[currentImageIndex]}
                    alt={`${planetData.name} 스크린샷 ${currentImageIndex + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-white/20"
                  />
                  
                  {/* 갤러리 네비게이션 */}
                  {planetData.gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-universe-surface/80 hover:bg-universe-surface rounded-full flex items-center justify-center text-white hover:text-universe-primary transition-all duration-200"
                        aria-label="이전 이미지"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-universe-surface/80 hover:bg-universe-surface rounded-full flex items-center justify-center text-white hover:text-universe-primary transition-all duration-200"
                        aria-label="다음 이미지"
                      >
                        <ChevronRight size={16} />
                      </button>
                      
                      {/* 이미지 인디케이터 */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                        {planetData.gallery.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentImageIndex
                                ? 'bg-universe-primary w-4'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`이미지 ${index + 1}로 이동`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 우측 정보 패널 */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* 게임 제목 및 장르 */}
              <div>
                <h2
                  id={`planet-title-${planetId}`}
                  className="text-3xl font-orbitron font-bold text-universe-text-primary mb-2"
                >
                  {planetData.name}
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="bg-universe-primary/20 text-universe-primary border-universe-primary/30">
                    {planetData.genre}
                  </Badge>
                  <Badge variant="outline" className="border-universe-secondary/30 text-universe-secondary">
                    {planetData.type}
                  </Badge>
                </div>
                <p className="text-lg text-universe-text-secondary font-medium">
                  {planetData.tagline}
                </p>
              </div>

              {/* 상세 설명 */}
              <div>
                <h3 className="text-lg font-orbitron font-medium text-universe-text-primary mb-2">
                  게임 소개
                </h3>
                <p className="text-universe-text-secondary leading-relaxed">
                  {planetData.description}
                </p>
              </div>

              {/* 개발자 정보 */}
              {planetData.developerName && (
                <div>
                  <h3 className="text-lg font-orbitron font-medium text-universe-text-primary mb-2">
                    개발 정보
                  </h3>
                  <div className="space-y-2 text-universe-text-secondary">
                    <p><span className="font-medium">개발사:</span> {planetData.developerName}</p>
                    {planetData.releaseDate && (
                      <p><span className="font-medium">출시일:</span> {planetData.releaseDate}</p>
                    )}
                    {planetData.platforms && (
                      <p><span className="font-medium">플랫폼:</span> {planetData.platforms.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <Button
                onClick={() => handleExternalClick(planetData.externalUrl)}
                className="w-full bg-universe-primary hover:bg-universe-primary/90 text-white font-medium py-3 text-lg"
                size="lg"
              >
                <Play size={20} className="mr-2" />
                Steam에서 구매하기
              </Button>
              
              {planetData.websiteUrl && (
                <Button
                  onClick={() => handleExternalClick(planetData.websiteUrl!)}
                  variant="outline"
                  className="w-full border-universe-secondary/30 text-universe-secondary hover:bg-universe-secondary/10 font-medium py-3"
                  size="lg"
                >
                  <ExternalLink size={20} className="mr-2" />
                  공식 웹사이트
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
