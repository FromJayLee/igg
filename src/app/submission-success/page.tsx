import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '신청 완료 - Indie Game Galaxy',
  description: '행성 분양 신청이 성공적으로 제출되었습니다. 승인 결과를 기다려주세요.',
};

export default function SubmissionSuccessPage() {
  return (
    <div className="min-h-screen bg-universe-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 성공 카드 */}
        <div className="bg-universe-surface/90 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
          {/* 성공 아이콘 */}
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-orbitron font-bold text-universe-text-primary mb-4">
            신청이 완료되었습니다! 🎉
          </h1>

          {/* 설명 */}
          <div className="space-y-4 mb-8">
            <p className="text-lg text-universe-text-secondary">
              행성 분양 신청이 성공적으로 제출되었습니다.
            </p>
            <p className="text-universe-text-secondary">
              이제 당신의 게임이 우주 맵에 전시될 준비가 되었습니다.
            </p>
          </div>

          {/* 다음 단계 안내 */}
          <div className="bg-universe-surface/40 rounded-xl p-6 mb-8 border border-white/10">
            <h2 className="text-xl font-orbitron font-medium text-universe-text-primary mb-4">
              다음 단계
            </h2>
            <div className="space-y-3 text-left text-universe-text-secondary">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-universe-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-universe-primary">1</span>
                </div>
                <span>관리자 검토 및 승인 (최대 48시간)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-universe-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-universe-primary">2</span>
                </div>
                <span>승인 완료 시 이메일 알림 발송</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-universe-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-universe-primary">3</span>
                </div>
                <span>우주 맵에 행성 전시 및 게이머 탐험 시작</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-universe-primary hover:bg-universe-primary/90 text-white font-medium py-3 text-lg">
                <Home className="w-5 h-5 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>
            
            <Link href="/adopt-planet">
              <Button variant="outline" className="w-full border-universe-secondary/30 text-universe-secondary hover:bg-universe-secondary/10 font-medium py-3">
                <Rocket className="w-5 h-5 mr-2" />
                다른 게임도 신청하기
              </Button>
            </Link>
          </div>

          {/* 추가 정보 */}
          <div className="mt-8 pt-6 border-t border-white/10">
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
