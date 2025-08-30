'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { FileUpload } from './FileUpload';
import { AdoptionFormSchema, AdoptionFormData, Genre, GENRES } from '@/types/adoption';
import { Rocket, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { generatePlanetThumbnail, renderPlanetCanvas } from '@/lib/planet-generator';

interface AdoptionFormProps {
  className?: string;
}

export function AdoptionForm({ className = '' }: AdoptionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [planetPreviewCanvas, setPlanetPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<AdoptionFormData>({
    resolver: zodResolver(AdoptionFormSchema),
    mode: 'onChange',
    defaultValues: {
      gameName: '',
      description: '',
      genre: 'Action' as Genre,
      tagline: '',
      downloadUrl: '',
      homepageUrl: '',
    },
  });

  // 폼 값 감시
  const watchedValues = watch();
  const { gameName, genre, description } = watchedValues;

  // 행성 미리보기 생성 (디바운스 적용)
  const generatePreview = useCallback(async () => {
    if (!gameName?.trim() || !genre || !description?.trim()) {
      setPlanetPreviewCanvas(null);
      return;
    }

    setPreviewLoading(true);
    
    try {
      const canvas = await renderPlanetCanvas({
        name: gameName.trim(),
        genre: genre,
        description: description.trim(),
        size: 200
      });
      setPlanetPreviewCanvas(canvas);
    } catch (error) {
      console.error('행성 미리보기 생성 실패:', error);
      setPlanetPreviewCanvas(null);
    } finally {
      setPreviewLoading(false);
    }
  }, [gameName, genre, description]);

  // 폼 값 변경 시 미리보기 자동 생성 (디바운스)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generatePreview();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [gameName, genre, description, generatePreview]);

  // 에러 메시지 초기화
  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => setSubmitError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  // 폼 제출 핸들러
  const onSubmit = async (data: AdoptionFormData) => {
    // 폼 검증 재실행
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    if (screenshotFiles.length === 0) {
      setSubmitError('스크린샷을 최소 1개 이상 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // 진행률 시뮬레이션 (실제 업로드 진행률과 연동 필요)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 절차적 행성 썸네일 생성
      const thumbnailBlob = await generatePlanetThumbnail({
        name: data.gameName.trim(),
        genre: data.genre,
        description: data.description.trim(),
        size: 128
      });

      // FormData 생성
      const formData = new FormData();
      formData.append('gameName', data.gameName.trim());
      formData.append('description', data.description.trim());
      formData.append('genre', data.genre);
      formData.append('tagline', data.tagline.trim());
      formData.append('downloadUrl', data.downloadUrl.trim());
      if (data.homepageUrl?.trim()) {
        formData.append('homepageUrl', data.homepageUrl.trim());
      }

      // 썸네일 추가
      formData.append('thumbnail', thumbnailBlob, 'planet.png');
      
      // 스크린샷 추가
      screenshotFiles.forEach((file, index) => {
        formData.append('screenshots', file);
      });

      // API 호출
      const response = await fetch('/api/adopt-planet', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `제출에 실패했습니다. (${response.status})`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        // 성공 시 2초 후 성공 페이지로 이동
        setTimeout(() => {
          router.push('/submission-success');
        }, 2000);
      } else {
        throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('제출 오류:', error);
      setSubmitError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // 에러 메시지 렌더링 헬퍼
  const renderFieldError = (error: any) => {
    if (!error) return null;
    
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{error.message}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-8 ${className}`}>
      {/* 성공/에러 메시지 */}
      {submitSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">
            행성 분양 신청이 성공적으로 제출되었습니다! 잠시 후 성공 페이지로 이동합니다.
          </span>
        </div>
      )}

      {submitError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-medium">{submitError}</span>
        </div>
      )}

      {/* 기본 게임 정보 */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-universe-primary" />
          <h3 className="text-xl font-orbitron font-medium text-universe-text-primary">
            게임 정보
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 게임명 */}
          <div className="space-y-2">
            <Label htmlFor="gameName" className="text-universe-text-primary">
              게임명 *
            </Label>
            <Input
              id="gameName"
              data-testid="apply-form-name"
              {...register('gameName')}
              placeholder="게임 이름을 입력하세요"
              className={`bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50 ${
                errors.gameName ? 'border-red-400 focus:border-red-400' : ''
              }`}
            />
            {renderFieldError(errors.gameName)}
          </div>

          {/* 장르 */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-universe-text-primary">
              장르 *
            </Label>
            <Select
              value={watchedValues.genre}
              onValueChange={(value) => setValue('genre', value as Genre)}
            >
              <SelectTrigger 
                data-testid="apply-form-genre" 
                className={`bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary ${
                  errors.genre ? 'border-red-400 focus:border-red-400' : ''
                }`}
              >
                <SelectValue placeholder="장르를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-universe-surface border-universe-surface/30">
                {Object.entries(GENRES).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-universe-text-primary">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderFieldError(errors.genre)}
          </div>

          {/* 태그라인 */}
          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-universe-text-primary">
              태그라인 *
            </Label>
            <Input
              id="tagline"
              data-testid="apply-form-tagline"
              {...register('tagline')}
              placeholder="게임을 한 줄로 설명하세요"
              className={`bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50 ${
                errors.tagline ? 'border-red-400 focus:border-red-400' : ''
              }`}
            />
            {renderFieldError(errors.tagline)}
          </div>
        </div>

        {/* 게임 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-universe-text-primary">
            게임 설명 *
          </Label>
          <Textarea
            id="description"
            data-testid="apply-form-desc"
            {...register('description')}
            placeholder="게임에 대해 자세히 설명해주세요"
            rows={4}
            className={`bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50 ${
              errors.description ? 'border-red-400 focus:border-red-400' : ''
            }`}
          />
          {renderFieldError(errors.description)}
        </div>

        {/* 외부 링크 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="downloadUrl" className="text-universe-text-primary">
              다운로드/구매 링크 *
            </Label>
            <Input
              id="downloadUrl"
              data-testid="apply-form-download-url"
              {...register('downloadUrl')}
              placeholder="Steam, App Store 등 링크"
              className={`bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50 ${
                errors.downloadUrl ? 'border-red-400 focus:border-red-400' : ''
              }`}
            />
            {renderFieldError(errors.downloadUrl)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="homepageUrl" className="text-universe-text-primary">
              공식 웹사이트 (선택)
            </Label>
            <Input
              id="homepageUrl"
              data-testid="apply-form-homepage-url"
              {...register('homepageUrl')}
              placeholder="게임 공식 웹사이트"
              className="bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50"
            />
            {renderFieldError(errors.homepageUrl)}
          </div>
        </div>
      </div>

      {/* 스크린샷 업로드 */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-universe-primary" />
          <h3 className="text-xl font-orbitron font-medium text-universe-text-primary">
            스크린샷 업로드
          </h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-universe-text-secondary">
            게임의 핵심 특징을 보여주는 스크린샷을 업로드해주세요 (최소 1개, 최대 5개)
          </p>
          
          <FileUpload
            data-testid="apply-form-screenshots"
            files={screenshotFiles}
            onFilesChange={setScreenshotFiles}
            maxFiles={5}
            maxSize={5}
            acceptedTypes={['image/png', 'image/jpeg', 'image/gif']}
            label="스크린샷 업로드"
            required={true}
          />
          
          {screenshotFiles.length === 0 && (
            <p className="text-sm text-red-400">
              스크린샷을 최소 1개 이상 업로드해주세요.
            </p>
          )}
        </div>
      </div>

      {/* 절차적 행성 미리보기 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-universe-primary" />
          <h3 className="text-xl font-orbitron font-medium text-universe-text-primary">
            자동 생성된 행성 미리보기
          </h3>
        </div>
        
        <div className="flex justify-center">
          <div className="relative">
            {previewLoading ? (
              <div 
                className="border-2 border-universe-surface/30 rounded-lg bg-universe-surface/20 flex items-center justify-center"
                style={{ width: 200, height: 200 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-universe-primary" />
                  <div className="text-universe-text-secondary text-sm text-center">
                    행성 생성 중...
                  </div>
                </div>
              </div>
            ) : planetPreviewCanvas ? (
              <div 
                data-testid="thumbnail-preview"
                className="border-2 border-universe-surface/30 rounded-lg overflow-hidden"
                style={{ width: 200, height: 200 }}
              >
                <canvas
                  ref={(el) => {
                    if (el && planetPreviewCanvas) {
                      const ctx = el.getContext('2d');
                      if (ctx) {
                        el.width = 200;
                        el.height = 200;
                        ctx.drawImage(planetPreviewCanvas, 0, 0);
                      }
                    }
                  }}
                  width={200}
                  height={200}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div 
                className="border-2 border-universe-surface/30 rounded-lg bg-universe-surface/20 flex items-center justify-center"
                style={{ width: 200, height: 200 }}
              >
                <div className="text-universe-text-secondary text-sm text-center">
                  게임 정보를 입력하면<br />자동으로 생성됩니다
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-universe-text-secondary text-center">
          게임명, 장르, 설명을 기반으로 절차적으로 생성되는 고유한 행성입니다
        </p>
      </div>

      {/* 진행률 표시 */}
      {isSubmitting && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-universe-text-secondary">
            <span>업로드 중...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-universe-surface/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-universe-primary to-universe-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="pt-6">
        <Button
          type="submit"
          data-testid="apply-submit"
          disabled={!isValid || isSubmitting || screenshotFiles.length === 0}
          className="w-full bg-universe-primary hover:bg-universe-primary/90 text-white font-medium py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              제출 중...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-2" />
              행성 분양 신청하기
            </>
          )}
        </Button>
        
        {!isValid && (
          <p className="text-sm text-universe-text-secondary text-center mt-3">
            모든 필수 항목을 올바르게 입력해주세요.
          </p>
        )}
      </div>
    </form>
  );
}

