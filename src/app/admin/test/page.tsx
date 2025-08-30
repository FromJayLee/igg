'use client';

import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Calendar } from 'lucide-react';

export default function AdminTestPage() {
  const { user, session, isAdmin } = useAdminAuth();

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-universe-background">
        <AdminHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-orbitron font-bold text-universe-text-primary mb-2">
              관리자 인증 테스트
            </h1>
            <p className="text-universe-text-secondary">
              현재 인증 상태 및 사용자 정보 확인
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 인증 상태 카드 */}
            <Card className="bg-universe-surface/60 border-universe-surface/30">
              <CardHeader>
                <CardTitle className="text-universe-text-primary flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  인증 상태
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-universe-text-secondary">로그인 상태:</span>
                  <Badge variant={user ? "default" : "secondary"}>
                    {user ? '로그인됨' : '로그인 안됨'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-universe-text-secondary">관리자 권한:</span>
                  <Badge variant={isAdmin ? "default" : "destructive"}>
                    {isAdmin ? '관리자' : '일반 사용자'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-universe-text-secondary">세션 상태:</span>
                  <Badge variant={session ? "default" : "secondary"}>
                    {session ? '활성' : '비활성'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 사용자 정보 카드 */}
            <Card className="bg-universe-surface/60 border-universe-surface/30">
              <CardHeader>
                <CardTitle className="text-universe-text-primary flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  사용자 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-universe-text-secondary text-sm">이메일:</span>
                  <p className="text-universe-text-primary font-medium">
                    {user?.email || '정보 없음'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-universe-text-secondary text-sm">사용자 ID:</span>
                  <p className="text-universe-text-primary font-mono text-sm">
                    {user?.id || '정보 없음'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-universe-text-secondary text-sm">가입일:</span>
                  <p className="text-universe-text-primary text-sm">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '정보 없음'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 세션 정보 */}
          {session && (
            <Card className="bg-universe-surface/60 border-universe-surface/30 mt-6">
              <CardHeader>
                <CardTitle className="text-universe-text-primary flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  세션 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <span className="text-universe-text-secondary text-sm">액세스 토큰 만료:</span>
                    <p className="text-universe-text-primary text-sm">
                      {new Date(session.access_token_expires_at * 1000).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-universe-text-secondary text-sm">리프레시 토큰 만료:</span>
                    <p className="text-universe-text-primary text-sm">
                      {new Date(session.refresh_token_expires_at * 1000).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-universe-text-secondary text-sm">토큰 타입:</span>
                    <p className="text-universe-text-primary text-sm">
                      {session.token_type}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminRouteGuard>
  );
}
