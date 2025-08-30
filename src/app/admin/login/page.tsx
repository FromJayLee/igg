'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn(email, password);
    
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error || '로그인에 실패했습니다.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-universe-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-universe-surface/80 border-universe-surface/30 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-universe-primary/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-universe-primary" />
            </div>
            <CardTitle className="text-2xl font-orbitron font-bold text-universe-text-primary">
              관리자 로그인
            </CardTitle>
            <p className="text-universe-text-secondary text-sm mt-2">
              Indie Game Galaxy 관리자 전용
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-universe-text-primary">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50"
                  disabled={isLoading}
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-universe-text-primary">
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-universe-text-secondary hover:text-universe-text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-md p-3">
                  {error}
                </div>
              )}

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full bg-universe-primary hover:bg-universe-primary/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>

            {/* 보안 안내 */}
            <div className="mt-6 text-center">
              <p className="text-xs text-universe-text-secondary/70">
                이 페이지는 관리자 전용입니다.
                <br />
                승인된 관리자만 접근할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
