import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Orbitron, Press_Start_2P } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
});

const pressStart2P = Press_Start_2P({
  variable: '--font-pixel',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Indie Game Galaxy - 우주를 탐험하며 게임을 발견하세요',
  description: '픽셀 아트 우주 맵에서 행성을 분양받아 인디게임을 시각적으로 홍보하고, 게이머가 로그인 없이 탐험하며 신작 게임을 발견할 수 있는 웹 기반 플랫폼입니다.',
  keywords: '인디게임, 게임 홍보, 우주 맵, 픽셀 아트, 게임 발견',
  authors: [{ name: 'Indie Game Galaxy Team' }],
  openGraph: {
    title: 'Indie Game Galaxy',
    description: '우주를 탐험하며 게임을 발견하세요',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${pressStart2P.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
