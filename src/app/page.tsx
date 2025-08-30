'use client';

import { UniverseMap } from '@/components/universe/UniverseMap';
import { PlanetModalProvider } from '@/components/universe/PlanetModalContext';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <PlanetModalProvider>
      <div className="w-screen h-screen bg-black relative">
        {/* 네비게이션 바 */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-orbitron font-bold text-universe-text-primary">
                Indie Game Galaxy
              </div>
              <div className="hidden md:block">
                <div className="bg-universe-surface/80 backdrop-blur-md rounded-xl p-3 border border-universe-surface/30 shadow-lg">
                  <p className="text-sm text-universe-text-secondary font-medium">
                    우주를 탐험하여 게임을 발견하세요
                  </p>
                  <p className="text-xs text-universe-text-secondary/70 mt-1">
                    독특한 인디게임들을 우주 맵에서 찾아보세요
                  </p>
                </div>
              </div>
            </div>
            <Link href="/adopt-planet">
              <Button className="bg-universe-primary hover:bg-universe-primary/90 text-white font-medium">
                <Rocket className="w-4 h-4 mr-2" />
                Adopt Your Planet
              </Button>
            </Link>
          </div>
        </div>
        
        <UniverseMap />
      </div>
    </PlanetModalProvider>
  );
}
