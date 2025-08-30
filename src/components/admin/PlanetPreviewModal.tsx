'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlanetAdoption } from '@/types/adoption';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PlanetPreviewModalProps {
  planet: PlanetAdoption;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (planetId: string, status: 'approved' | 'rejected') => void;
  isUpdating?: boolean;
}

export function PlanetPreviewModal({ 
  planet, 
  isOpen, 
  onClose, 
  onStatusUpdate,
  isUpdating = false
}: PlanetPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    try {
      await onStatusUpdate(planet.id, status);
      onClose();
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === planet.screenshotUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? planet.screenshotUrls.length - 1 : prev - 1
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">승인 대기</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">승인 완료</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">거절됨</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-universe-surface/95 border-universe-surface/30">
        <DialogHeader>
          <DialogTitle className="text-universe-text-primary text-xl">
            행성 미리보기: {planet.gameName}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* 게임 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 썸네일 */}
            <div className="md:col-span-1">
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-universe-surface/30">
                <img
                  src={planet.thumbnailUrl}
                  alt={planet.gameName}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            {/* 게임 정보 */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-universe-text-primary mb-2">
                  {planet.gameName}
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  {getStatusBadge(planet.status)}
                  <Badge variant="outline" className="border-universe-surface/30 text-universe-text-secondary">
                    {planet.genre}
                  </Badge>
                  <Badge variant="outline" className="border-universe-surface/30 text-universe-text-secondary capitalize">
                    {planet.planetType.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-lg text-universe-text-secondary italic">
                  "{planet.tagline}"
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-universe-text-primary mb-2">게임 설명</h3>
                <p className="text-universe-text-secondary leading-relaxed">
                  {planet.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-universe-text-secondary mb-1">신청일</h4>
                  <p className="text-universe-text-primary">
                    {formatDistanceToNow(new Date(planet.createdAt), { addSuffix: true, locale: ko })}
                  </p>
                  <p className="text-sm text-universe-text-secondary/70">
                    {new Date(planet.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-universe-text-secondary mb-1">외부 링크</h4>
                  <div className="space-y-2">
                    {planet.downloadUrl && (
                      <a
                        href={planet.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-universe-primary hover:text-universe-primary/80 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        다운로드 링크
                      </a>
                    )}
                    {planet.homepageUrl && (
                      <a
                        href={planet.homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-universe-primary hover:text-universe-primary/80 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        홈페이지
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 스크린샷 갤러리 */}
          {planet.screenshotUrls.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-universe-text-primary mb-4">스크린샷 갤러리</h3>
              <div className="relative">
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-universe-surface/30">
                  <img
                    src={planet.screenshotUrls[currentImageIndex]}
                    alt={`${planet.gameName} 스크린샷 ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 네비게이션 버튼 */}
                {planet.screenshotUrls.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-universe-surface/80 hover:bg-universe-surface/90 text-universe-text-primary"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-universe-surface/80 hover:bg-universe-surface/90 text-universe-text-primary"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {/* 썸네일 인디케이터 */}
                {planet.screenshotUrls.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {planet.screenshotUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? 'bg-universe-primary'
                            : 'bg-universe-surface/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          {planet.status === 'pending' && (
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-universe-surface/30">
              <Button
                onClick={() => handleStatusUpdate('approved')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                size="lg"
                disabled={isUpdating}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {isUpdating ? '처리 중...' : '승인하기'}
              </Button>
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-8 py-3"
                size="lg"
                disabled={isUpdating}
              >
                <XCircle className="w-5 h-5 mr-2" />
                {isUpdating ? '처리 중...' : '거절하기'}
              </Button>
            </div>
          )}

          {planet.status === 'approved' && (
            <div className="text-center pt-6 border-t border-universe-surface/30">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-6 py-2">
                승인 완료
              </Badge>
              <p className="text-universe-text-secondary mt-2">
                이 행성은 우주 맵에 전시되었습니다
              </p>
            </div>
          )}

          {planet.status === 'rejected' && (
            <div className="text-center pt-6 border-t border-universe-surface/30">
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 text-lg px-6 py-2">
                거절됨
              </Badge>
              <p className="text-universe-text-secondary mt-2">
                이 신청은 거절되었습니다
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
