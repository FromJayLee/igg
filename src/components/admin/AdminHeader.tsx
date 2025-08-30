'use client';

import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { LogOut, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminHeader() {
  const { user, signOut } = useAdminAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/admin/login');
    }
  };

  return (
    <header className="bg-universe-surface/90 border-b border-universe-surface/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측: 로고 및 제목 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-universe-primary/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-universe-primary" />
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-universe-text-primary">
                Indie Game Galaxy
              </h1>
              <p className="text-sm text-universe-text-secondary">
                관리자 대시보드
              </p>
            </div>
          </div>

          {/* 우측: 사용자 정보 및 로그아웃 */}
          <div className="flex items-center space-x-4">
            {/* 사용자 정보 */}
            <div className="flex items-center space-x-2 text-universe-text-secondary">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>

            {/* 로그아웃 버튼 */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-universe-secondary/30 text-universe-secondary hover:bg-universe-secondary/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
