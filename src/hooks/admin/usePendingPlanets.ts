import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { PlanetAdoption } from '@/types/adoption';

// 행성 목록 조회
export function usePendingPlanets() {
  return useQuery({
    queryKey: ['admin', 'planets'],
    queryFn: async (): Promise<PlanetAdoption[]> => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('planets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`행성 목록 조회 실패: ${error.message}`);
      }

      // 데이터 변환 (DB 스키마 → TypeScript 타입)
      return (data || []).map(row => ({
        id: row.id,
        gameName: row.game_name,
        description: row.description,
        genre: row.genre,
        tagline: row.tagline,
        downloadUrl: row.download_url,
        homepageUrl: row.homepage_url,
        planetType: row.planet_type,
        thumbnailUrl: row.thumbnail_url,
        screenshotUrls: row.screenshot_urls || [],
        status: row.status,
        submittedBy: row.submitted_by,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    },
    staleTime: 30 * 1000, // 30초
    refetchInterval: 60 * 1000, // 1분마다 자동 새로고침
  });
}

// 행성 상태 업데이트
export function useUpdatePlanetStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      planetId, 
      status 
    }: { 
      planetId: string; 
      status: 'approved' | 'rejected' 
    }) => {
      const supabase = createClient();
      
      // 승인 시 우주 맵 위치 할당
      let updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      if (status === 'approved') {
        // 승인된 행성에 랜덤 위치 할당 (실제로는 더 정교한 알고리즘 필요)
        updateData.position = {
          x: Math.random() * 2000 - 1000, // -1000 ~ 1000
          y: Math.random() * 2000 - 1000, // -1000 ~ 1000
        };
      }

      const { data, error } = await supabase
        .from('planets')
        .update(updateData)
        .eq('id', planetId)
        .select()
        .single();

      if (error) {
        throw new Error(`행성 상태 업데이트 실패: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      // 성공 시 행성 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['admin', 'planets'] });
      
      // 우주 맵 캐시도 무효화 (승인된 행성이 맵에 표시되어야 함)
      queryClient.invalidateQueries({ queryKey: ['universe', 'planets'] });
    },
    onError: (error) => {
      console.error('행성 상태 업데이트 오류:', error);
    },
  });
}

// 행성 상세 정보 조회
export function usePlanetDetail(planetId: string) {
  return useQuery({
    queryKey: ['admin', 'planets', planetId],
    queryFn: async (): Promise<PlanetAdoption> => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('planets')
        .select('*')
        .eq('id', planetId)
        .single();

      if (error) {
        throw new Error(`행성 상세 정보 조회 실패: ${error.message}`);
      }

      if (!data) {
        throw new Error('행성을 찾을 수 없습니다');
      }

      // 데이터 변환
      return {
        id: data.id,
        gameName: data.game_name,
        description: data.description,
        genre: data.genre,
        tagline: data.tagline,
        downloadUrl: data.download_url,
        homepageUrl: data.homepage_url,
        planetType: data.planet_type,
        thumbnailUrl: data.thumbnail_url,
        screenshotUrls: data.screenshot_urls || [],
        status: data.status,
        submittedBy: data.submitted_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    },
    enabled: !!planetId,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 통계 정보 조회
export function usePlanetStats() {
  return useQuery({
    queryKey: ['admin', 'planets', 'stats'],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('planets')
        .select('status, created_at');

      if (error) {
        throw new Error(`통계 정보 조회 실패: ${error.message}`);
      }

      const stats = {
        total: data?.length || 0,
        pending: data?.filter(p => p.status === 'pending').length || 0,
        approved: data?.filter(p => p.status === 'approved').length || 0,
        rejected: data?.filter(p => p.status === 'rejected').length || 0,
        today: data?.filter(p => {
          const today = new Date();
          const createdDate = new Date(p.created_at);
          return today.toDateString() === createdDate.toDateString();
        }).length || 0,
        thisWeek: data?.filter(p => {
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const createdDate = new Date(p.created_at);
          return createdDate >= weekAgo;
        }).length || 0,
      };

      return stats;
    },
    staleTime: 60 * 1000, // 1분
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 새로고침
  });
}
