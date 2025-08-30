import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 대시보드 - Indie Game Galaxy',
  description: '행성 분양 신청 승인/거절 관리',
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-universe-background">
      <AdminDashboard />
    </div>
  );
}
