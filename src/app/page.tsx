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
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-2xl font-orbitron font-bold text-universe-text-primary">
              Indie Game Galaxy
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
