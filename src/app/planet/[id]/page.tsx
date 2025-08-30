import { PlanetDetailModal } from '@/components/universe/PlanetDetailModal';
import { PlanetModalProvider } from '@/components/universe/PlanetModalContext';

interface PlanetPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanetPage({ params }: PlanetPageProps) {
  const { id } = await params;

  return (
    <PlanetModalProvider>
      <div className="min-h-screen bg-universe-background">
        <PlanetDetailModal
          planetId={id}
          onClose={() => {
            // 이 페이지는 모달만 표시하므로 실제로는 사용되지 않음
            // UniverseMap에서 모달 상태를 관리함
          }}
        />
      </div>
    </PlanetModalProvider>
  );
}
