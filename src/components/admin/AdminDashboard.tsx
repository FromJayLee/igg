'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, RefreshCw, Eye, CheckCircle, XCircle } from 'lucide-react';
import { PendingPlanetsTable } from './PendingPlanetsTable';
import { PlanetPreviewModal } from './PlanetPreviewModal';
import { usePendingPlanets, useUpdatePlanetStatus, usePlanetStats } from '@/hooks/admin/usePendingPlanets';
import { PlanetAdoption } from '@/types/adoption';

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetAdoption | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { 
    data: planets, 
    isLoading, 
    error, 
    refetch
  } = usePendingPlanets();
  
  const { mutateAsync: updatePlanetStatus, isPending: isUpdating } = useUpdatePlanetStatus();
  const { data: stats } = usePlanetStats();

  const handleStatusUpdate = async (planetId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updatePlanetStatus({ planetId, status: newStatus });
      // 성공 시 목록 새로고침
      refetch();
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const handlePreview = (planet: PlanetAdoption) => {
    setSelectedPlanet(planet);
    setIsPreviewModalOpen(true);
  };

  const filteredPlanets = planets?.filter(planet => {
    const matchesSearch = planet.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         planet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         planet.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || planet.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // 통계 데이터가 없으면 기본값 사용
  const displayStats = stats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    today: 0,
    thisWeek: 0,
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-center text-red-400">
              <p className="text-lg font-medium">오류가 발생했습니다</p>
              <p className="text-sm mt-2">{error.message}</p>
              <Button 
                onClick={() => refetch()} 
                className="mt-4"
                variant="outline"
              >
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-orbitron font-bold text-universe-text-primary mb-2">
          관리자 대시보드
        </h1>
        <p className="text-universe-text-secondary">
          행성 분양 신청 승인/거절 관리
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card className="bg-universe-surface/60 border-universe-surface/30">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-universe-text-primary">{displayStats.total}</p>
              <p className="text-sm text-universe-text-secondary">전체 신청</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{displayStats.pending}</p>
              <p className="text-sm text-yellow-400/70">승인 대기</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{displayStats.approved}</p>
              <p className="text-sm text-green-400/70">승인 완료</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{displayStats.rejected}</p>
              <p className="text-sm text-red-400/70">거절됨</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{displayStats.today}</p>
              <p className="text-sm text-blue-400/70">오늘 신청</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{displayStats.thisWeek}</p>
              <p className="text-sm text-purple-400/70">이번 주</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card className="bg-universe-surface/60 border-universe-surface/30 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-universe-text-secondary w-4 h-4" />
                <Input
                  placeholder="게임명, 설명, 장르로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary"
                />
              </div>
            </div>

            {/* 상태 필터 */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="상태별 필터" />
                </SelectTrigger>
                <SelectContent className="bg-universe-surface border-universe-surface/30">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">승인 대기</SelectItem>
                  <SelectItem value="approved">승인 완료</SelectItem>
                  <SelectItem value="rejected">거절됨</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 새로고침 */}
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-universe-secondary/30 text-universe-secondary hover:bg-universe-secondary/10"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '새로고침 중...' : '새로고침'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 행성 목록 테이블 */}
      <Card className="bg-universe-surface/60 border-universe-surface/30">
        <CardHeader>
          <CardTitle className="text-universe-text-primary">
            행성 분양 신청 목록
            {filteredPlanets.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredPlanets.length}개
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PendingPlanetsTable
            planets={filteredPlanets}
            isLoading={isLoading}
            isUpdating={isUpdating}
            onStatusUpdate={handleStatusUpdate}
            onPreview={handlePreview}
          />
        </CardContent>
      </Card>

      {/* 행성 미리보기 모달 */}
      {selectedPlanet && (
        <PlanetPreviewModal
          planet={selectedPlanet}
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedPlanet(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}
