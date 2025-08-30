import { AdoptionForm } from '@/components/adoption/AdoptionForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '행성 분양 신청 - Indie Game Galaxy',
  description: '당신의 게임을 우주 맵에 전시할 행성을 분양받으세요. 무료로 시작하는 인디게임 홍보 플랫폼입니다.',
  keywords: '인디게임, 게임 홍보, 행성 분양, 우주 맵, 게임 전시',
};

export default function AdoptPlanetPage() {
  return (
    <div className="min-h-screen bg-universe-background">
      {/* 헤더 */}
      <div className="bg-universe-surface/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-orbitron font-bold text-universe-text-primary mb-2">
              Adopt Your Planet
            </h1>
            <p className="text-lg text-universe-text-secondary font-pixel">
              당신의 게임을 우주 맵에 전시할 행성을 분양받으세요
            </p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 안내 카드 */}
          <div className="bg-universe-surface/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl mb-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-universe-primary/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-universe-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-universe-text-primary mb-3">
                  행성 분양 신청 가이드
                </h2>
                <div className="text-universe-text-secondary space-y-2">
                  <p>• 게임 정보를 정확하게 입력해주세요</p>
                  <p>• 썸네일은 64x64 픽셀아트 스타일로 제작하는 것을 권장합니다</p>
                  <p>• 스크린샷은 게임의 핵심 특징을 잘 보여주는 이미지를 선택해주세요</p>
                  <p>• 제출 후 48시간 이내에 승인 결과를 이메일로 안내드립니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* 폼 */}
          <div className="bg-universe-surface/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <AdoptionForm />
          </div>

          {/* 추가 정보 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-universe-text-secondary">
              문의사항이 있으시면{' '}
              <a href="mailto:support@indiegamegalaxy.com" className="text-universe-primary hover:text-universe-secondary transition-colors">
                support@indiegamegalaxy.com
              </a>
              으로 연락해주세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
