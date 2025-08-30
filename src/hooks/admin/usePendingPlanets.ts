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
        planetThumbnailUrl: row.planet_thumbnail_url, // 새로운 컬럼 사용
        screenshotUrls: row.screenshot_urls || [],
        status: row.status,
        submittedBy: row.submitted_by || 'unknown',
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
      status, 
      feedback 
    }: { 
      planetId: string; 
      status: 'approved' | 'rejected'; 
      feedback?: string; 
    }) => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('planets')
        .update({ 
          status, 
          feedback: feedback || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', planetId)
        .select()
        .single();

      if (error) {
        throw new Error(`상태 업데이트 실패: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['admin', 'planets'] });
    },
    onError: (error) => {
      console.error('상태 업데이트 오류:', error);
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
        planetThumbnailUrl: data.planet_thumbnail_url, // 새로운 컬럼 사용
        screenshotUrls: data.screenshot_urls || [],
        status: data.status,
        submittedBy: data.submitted_by || 'unknown',
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
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const supabase = createClient();
      
      // 전체 행성 수
      const { count: totalCount, error: totalError } = await supabase
        .from('planets')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw new Error(`전체 행성 수 조회 실패: ${totalError.message}`);
      }

      // 승인 대기 중인 행성 수
      const { count: pendingCount, error: pendingError } = await supabase
        .from('planets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingError) {
        throw new Error(`대기 행성 수 조회 실패: ${pendingError.message}`);
      }

      // 승인된 행성 수
      const { count: approvedCount, error: approvedError } = await supabase
        .from('planets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (approvedError) {
        throw new Error(`승인 행성 수 조회 실패: ${approvedError.message}`);
      }

      // 거절된 행성 수
      const { count: rejectedCount, error: rejectedError } = await supabase
        .from('planets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      if (rejectedError) {
        throw new Error(`거절 행성 수 조회 실패: ${rejectedError.message}`);
      }

      return {
        total: totalCount || 0,
        pending: pendingCount || 0,
        approved: approvedCount || 0,
        rejected: rejectedCount || 0,
      };
    },
    staleTime: 60 * 1000, // 1분
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 새로고침
  });
}
