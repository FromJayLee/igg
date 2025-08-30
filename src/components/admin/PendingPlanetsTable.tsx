'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { PlanetAdoption } from '@/types/adoption';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PendingPlanetsTableProps {
  planets: PlanetAdoption[];
  isLoading: boolean;
  isUpdating: boolean;
  onStatusUpdate: (planetId: string, status: 'approved' | 'rejected') => void;
  onPreview: (planet: PlanetAdoption) => void;
}

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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-400" />;
    case 'approved':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-400" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

export function PendingPlanetsTable({ 
  planets, 
  isLoading, 
  onStatusUpdate, 
  onPreview 
}: PendingPlanetsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-universe-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-universe-text-secondary">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (planets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-universe-surface/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-universe-text-secondary" />
        </div>
        <p className="text-universe-text-secondary text-lg">승인 대기 중인 신청이 없습니다</p>
        <p className="text-universe-text-secondary/70 text-sm mt-2">
          새로운 행성 분양 신청을 기다리고 있습니다
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-universe-surface/30 hover:bg-universe-surface/20">
            <TableHead className="text-universe-text-primary font-medium">게임 정보</TableHead>
            <TableHead className="text-universe-text-primary font-medium">장르</TableHead>
            <TableHead className="text-universe-text-primary font-medium">행성 유형</TableHead>
            <TableHead className="text-universe-text-primary font-medium">상태</TableHead>
            <TableHead className="text-universe-text-primary font-medium">신청일</TableHead>
            <TableHead className="text-universe-text-primary font-medium">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planets.map((planet) => (
            <TableRow 
              key={planet.id} 
              className="border-universe-surface/20 hover:bg-universe-surface/10 transition-colors"
            >
              {/* 게임 정보 */}
              <TableCell className="py-4">
                <div className="flex items-start gap-3">
                  {/* 썸네일 */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-universe-surface/30">
                    <img
                      src={planet.thumbnailUrl}
                      alt={planet.gameName}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  
                  {/* 게임 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-universe-text-primary truncate">
                      {planet.gameName}
                    </h3>
                    <p className="text-sm text-universe-text-secondary line-clamp-2 mt-1">
                      {planet.tagline}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(planet)}
                        className="h-6 px-2 text-xs text-universe-secondary hover:text-universe-secondary/80 hover:bg-universe-secondary/10"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        미리보기
                      </Button>
                      {planet.downloadUrl && (
                        <a
                          href={planet.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-universe-primary hover:text-universe-primary/80 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          다운로드
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* 장르 */}
              <TableCell>
                <Badge variant="outline" className="border-universe-surface/30 text-universe-text-secondary">
                  {planet.genre}
                </Badge>
              </TableCell>

              {/* 행성 유형 */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-universe-primary/20 to-universe-secondary/20 border border-universe-surface/30"></div>
                  <span className="text-sm text-universe-text-secondary capitalize">
                    {planet.planetType.replace('_', ' ')}
                  </span>
                </div>
              </TableCell>

              {/* 상태 */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(planet.status)}
                  {getStatusBadge(planet.status)}
                </div>
              </TableCell>

              {/* 신청일 */}
              <TableCell>
                <div className="text-sm text-universe-text-secondary">
                  <div>{formatDistanceToNow(new Date(planet.createdAt), { addSuffix: true, locale: ko })}</div>
                  <div className="text-xs text-universe-text-secondary/70 mt-1">
                    {new Date(planet.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </TableCell>

              {/* 액션 */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {planet.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onStatusUpdate(planet.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white h-8 px-3"
                        disabled={isUpdating}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {isUpdating ? '처리 중...' : '승인'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusUpdate(planet.id, 'rejected')}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 px-3"
                        disabled={isUpdating}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        {isUpdating ? '처리 중...' : '거절'}
                      </Button>
                    </>
                  )}
                  
                  {planet.status === 'approved' && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      승인 완료
                    </Badge>
                  )}
                  
                  {planet.status === 'rejected' && (
                    <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                      거절됨
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
