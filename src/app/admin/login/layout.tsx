import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 로그인 - Indie Game Galaxy',
  description: 'Indie Game Galaxy 관리자 전용 로그인 페이지',
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
