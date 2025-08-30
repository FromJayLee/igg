'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2, Shield } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
        router.push('/admin/login');
      } else if (!isAdmin) {
        // 관리자 권한이 없는 사용자는 홈페이지로 리다이렉트
        router.push('/');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-universe-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-universe-primary/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-universe-primary" />
          </div>
          <Loader2 className="w-8 h-8 text-universe-primary animate-spin mx-auto mb-4" />
          <p className="text-universe-text-secondary">관리자 권한 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않았거나 관리자 권한이 없는 경우 빈 화면 (리다이렉트 중)
  if (!user || !isAdmin) {
    return null;
  }

  // 인증된 관리자인 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
