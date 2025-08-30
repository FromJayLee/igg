'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  ExternalLink,
  Download,
  Globe
} from 'lucide-react';
import { PlanetAdoption } from '@/types/adoption';
import { useUpdatePlanetStatus } from '@/hooks/admin/useUpdatePlanetStatus';

interface PendingPlanetsTableProps {
  planets: PlanetAdoption[];
  isLoading: boolean;
  isUpdating: boolean;
  onStatusUpdate: (planetId: string, status: 'approved' | 'rejected') => void;
  onPreview: (planet: PlanetAdoption) => void;
}

// 상태별 아이콘 반환
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'pending':
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

// 행성 썸네일 표시 컴포넌트
const PlanetThumbnail = ({ thumbnailUrl, gameName }: { thumbnailUrl: string; gameName: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-universe-surface/30">
        <img
          src={thumbnailUrl}
          alt={`${gameName} 썸네일`}
          className="w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div className="text-sm text-universe-text-primary font-medium">
        {gameName}
      </div>
    </div>
  );
};

export function PendingPlanetsTable({ 
  planets, 
  isLoading, 
  isUpdating,
  onStatusUpdate, 
  onPreview 
}: PendingPlanetsTableProps) {
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const updateStatus = useUpdatePlanetStatus();

  const handleStatusUpdate = async (planetId: string, status: 'approved' | 'rejected') => {
    const feedbackText = feedback[planetId] || '';
    
    try {
      await updateStatus.mutateAsync({ planetId, status, feedback: feedbackText });
      onStatusUpdate(planetId, status);
      // 피드백 입력 초기화
      setFeedback(prev => ({ ...prev, [planetId]: '' }));
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-universe-text-secondary">로딩 중...</div>
      </div>
    );
  }

  if (planets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-universe-text-secondary text-lg mb-2">
          대기 중인 행성 분양 신청이 없습니다
        </div>
        <div className="text-universe-text-secondary/70 text-sm">
          새로운 신청이 들어오면 여기에 표시됩니다
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {planets.map((planet) => (
        <Card key={planet.id} className="p-6 border-universe-surface/30 bg-universe-surface/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 행성 정보 */}
            <div className="space-y-4">
              <PlanetThumbnail 
                thumbnailUrl={planet.planetThumbnailUrl} 
                gameName={planet.gameName} 
              />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-universe-primary/20 text-universe-primary border-universe-primary/30">
                    {planet.genre}
                  </Badge>
                  <Badge variant="outline" className="border-universe-secondary/30 text-universe-secondary">
                    {planet.planetType}
                  </Badge>
                </div>
                
                <p className="text-sm text-universe-text-secondary">
                  {planet.tagline}
                </p>
                
                <p className="text-xs text-universe-text-secondary/70 line-clamp-2">
                  {planet.description}
                </p>
              </div>
            </div>

            {/* 외부 링크 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-universe-primary" />
                <a
                  href={planet.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-universe-primary hover:text-universe-primary/80 underline"
                >
                  다운로드 링크
                </a>
              </div>
              
              {planet.homepageUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-universe-secondary" />
                  <a
                    href={planet.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-universe-secondary hover:text-universe-secondary/80 underline"
                  >
                    공식 웹사이트
                  </a>
                </div>
              )}
              
              <div className="text-xs text-universe-text-secondary/70">
                신청일: {planet.createdAt.toLocaleDateString('ko-KR')}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(planet)}
                  className="flex-1 border-universe-primary/30 text-universe-primary hover:bg-universe-primary/10"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  미리보기
                </Button>
              </div>

              {planet.status === 'pending' && (
                <>
                  <div className="space-y-2">
                    <textarea
                      placeholder="피드백 입력 (선택사항)"
                      value={feedback[planet.id] || ''}
                      onChange={(e) => setFeedback(prev => ({ ...prev, [planet.id]: e.target.value }))}
                      className="w-full p-2 text-xs border border-universe-surface/30 rounded bg-universe-surface/20 text-universe-text-primary resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      data-testid="admin-approve-button"
                      onClick={() => handleStatusUpdate(planet.id, 'approved')}
                      disabled={isUpdating || updateStatus.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      승인
                    </Button>
                    
                    <Button
                      onClick={() => handleStatusUpdate(planet.id, 'rejected')}
                      disabled={isUpdating || updateStatus.isPending}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      거절
                    </Button>
                  </div>
                </>
              )}

              {planet.status !== 'pending' && (
                <div className="flex items-center gap-2">
                  {getStatusIcon(planet.status)}
                  <span className="text-sm font-medium">
                    {planet.status === 'approved' ? '승인됨' : '거절됨'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
