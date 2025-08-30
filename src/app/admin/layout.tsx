import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 - Indie Game Galaxy',
  description: 'Indie Game Galaxy 관리자 전용 페이지',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-universe-background">
      {children}
    </div>
  );
}
