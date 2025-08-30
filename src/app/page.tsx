'use client';

import { UniverseMap } from '@/components/universe/UniverseMap';
import { PlanetModalProvider } from '@/components/universe/PlanetModalContext';

export default function Home() {
  return (
    <PlanetModalProvider>
      <div className="w-screen h-screen bg-black">
        <UniverseMap />
      </div>
    </PlanetModalProvider>
  );
}
