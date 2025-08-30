'use client';

import React, { useState, useCallback } from 'react';
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
import { Rocket, Loader2 } from 'lucide-react';
import { generatePlanetThumbnail, renderPlanetCanvas } from '@/lib/planet-generator';

interface AdoptionFormProps {
  className?: string;
}

export function AdoptionForm({ className = '' }: AdoptionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

  const [planetPreviewCanvas, setPlanetPreviewCanvas] = useState<HTMLCanvasElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
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



  // 행성 미리보기 생성
  const generatePreview = useCallback(() => {
    if (!gameName || !genre || !description) return;

    try {
      const canvas = renderPlanetCanvas({
        name: gameName,
        genre: genre,
        description: description,
        size: 200
      });
      setPlanetPreviewCanvas(canvas);
    } catch (error) {
      console.error('행성 미리보기 생성 실패:', error);
    }
  }, [gameName, genre, description]);

  // 폼 값 변경 시 미리보기 자동 생성
  React.useEffect(() => {
    if (gameName && genre && description) {
      generatePreview();
    }
  }, [gameName, genre, description, generatePreview]);

  // 폼 제출 핸들러
  const onSubmit = async (data: AdoptionFormData) => {
    if (screenshotFiles.length === 0) {
      alert('스크린샷을 최소 1개 이상 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // 절차적 행성 썸네일 생성
      const thumbnailBlob = await generatePlanetThumbnail({
        name: data.gameName,
        genre: data.genre,
        description: data.description,
        size: 128
      });

      // FormData 생성
      const formData = new FormData();
      formData.append('gameName', data.gameName);
      formData.append('description', data.description);
      formData.append('genre', data.genre);
      formData.append('tagline', data.tagline);
      formData.append('downloadUrl', data.downloadUrl);
      if (data.homepageUrl) {
        formData.append('homepageUrl', data.homepageUrl);
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

      if (!response.ok) {
        throw new Error('제출에 실패했습니다.');
      }

      const result = await response.json();
      
      if (result.success) {
        // 성공 시 성공 페이지로 이동
        router.push('/submission-success');
      } else {
        throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('제출 오류:', error);
      alert(`제출에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-8 ${className}`}>
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
              {...register('gameName')}
              placeholder="게임 이름을 입력하세요"
              className="bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50"
            />
            {errors.gameName && (
              <p className="text-red-400 text-sm">{errors.gameName.message}</p>
            )}
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
              <SelectTrigger className="bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary">
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
            {errors.genre && (
              <p className="text-red-400 text-sm">{errors.genre.message}</p>
            )}
          </div>

          {/* 태그라인 */}
          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-universe-text-primary">
              태그라인 *
            </Label>
            <Input
              id="tagline"
              {...register('tagline')}
              placeholder="게임을 한 줄로 설명하세요"
              className="bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50"
            />
            {errors.tagline && (
              <p className="text-red-400 text-sm">{errors.tagline.message}</p>
            )}
          </div>
        </div>

        {/* 게임 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-universe-text-primary">
            게임 설명 *
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="게임에 대해 자세히 설명해주세요"
            rows={4}
            className="bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50"
          />
          {errors.description && (
            <p className="text-red-400 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* 외부 링크 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="downloadUrl" className="text-universe-text-primary">
              다운로드/구매 링크 *
            </Label>
            <Input
              id="downloadUrl"
              {...register('downloadUrl')}
              placeholder="Steam, App Store 등 링크"
              className="bg-universe-surface/50 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50"
            />
            {errors.downloadUrl && (
              <p className="text-red-400 text-sm">{errors.downloadUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="homepageUrl" className="text-universe-text-primary">
              공식 웹사이트 (선택)
            </Label>
            <Input
              id="homepageUrl"
              {...register('homepageUrl')}
              placeholder="게임 공식 웹사이트"
              className="bg-universe-text-secondary/50"
            />
            {errors.homepageUrl && (
              <p className="text-red-400 text-sm">{errors.homepageUrl.message}</p>
            )}
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
            files={screenshotFiles}
            onFilesChange={setScreenshotFiles}
            maxFiles={5}
            maxSize={5}
            acceptedTypes={['image/png', 'image/jpeg', 'image/gif']}
            label="스크린샷 업로드"
            required={true}
          />
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
            {planetPreviewCanvas ? (
              <div 
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
          disabled={!isValid || isSubmitting || screenshotFiles.length === 0}
          className="w-full bg-universe-primary hover:bg-universe-primary/90 text-white font-medium py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </form>
  );
}

