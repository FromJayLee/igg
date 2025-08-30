'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlanetTypeSelector } from './PlanetTypeSelector';
import { FileUpload } from './FileUpload';
import { AdoptionFormSchema, AdoptionFormData, PlanetType, Genre, GENRES } from '@/types/adoption';
import { Rocket, Loader2 } from 'lucide-react';

interface AdoptionFormProps {
  className?: string;
}

export function AdoptionForm({ className = '' }: AdoptionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File[]>([]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [selectedPlanetType, setSelectedPlanetType] = useState<PlanetType | null>(null);

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
      planetType: 'terran' as PlanetType,
    },
  });

  // 폼 값 감시
  const watchedValues = watch();

  // 행성 유형 선택 핸들러
  const handlePlanetTypeSelect = (type: PlanetType) => {
    setSelectedPlanetType(type);
    setValue('planetType', type);
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: AdoptionFormData) => {
    if (thumbnailFile.length === 0) {
      alert('썸네일 이미지를 업로드해주세요.');
      return;
    }

    if (screenshotFiles.length === 0) {
      alert('스크린샷을 최소 1개 이상 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // 텍스트 필드 추가
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      // 파일 추가
      formData.append('thumbnail', thumbnailFile[0]);
      screenshotFiles.forEach((file, index) => {
        formData.append(`screenshot_${index}`, file);
      });

      // XHR을 사용한 진행률 표시 업로드
      const response = await submitWithProgress(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        // 성공 시 입력값 리셋
        setThumbnailFile([]);
        setScreenshotFiles([]);
        setSelectedPlanetType(null);
        
        // 성공 페이지로 이동
        router.push('/submission-success');
      } else {
        alert('제출에 실패했습니다: ' + response.error);
      }
    } catch (error) {
      console.error('폼 제출 오류:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // 진행률 표시와 함께 폼 제출
  const submitWithProgress = (formData: FormData, onProgress: (progress: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/adopt-planet');
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              resolve({ success: true });
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.error || 'Upload failed'));
            } catch (error) {
              reject(new Error('Upload failed'));
            }
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-8 ${className}`}>
      {/* 게임 기본 정보 */}
      <div className="space-y-6">
        <h3 className="text-xl font-orbitron font-medium text-universe-text-primary">
          게임 기본 정보
        </h3>
        
        {/* 게임명 */}
        <div className="space-y-2">
          <Label htmlFor="gameName" className="text-universe-text-primary">
            게임명 *
          </Label>
          <Input
            id="gameName"
            {...register('gameName')}
            placeholder="당신의 게임 이름을 입력하세요"
            className={cn(
              "bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50",
              errors.gameName && "border-red-400 focus:border-red-400"
            )}
            aria-invalid={!!errors.gameName}
            aria-describedby={errors.gameName ? "gameName-error" : undefined}
          />
          {errors.gameName && (
            <div 
              id="gameName-error"
              className="text-sm text-red-400"
              role="alert"
            >
              {errors.gameName.message}
            </div>
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
            <SelectTrigger className="bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary">
              <SelectValue placeholder="장르를 선택하세요" />
            </SelectTrigger>
            <SelectContent className="bg-universe-surface border-universe-surface/30">
              {Object.entries(GENRES).map(([key, value]) => (
                <SelectItem key={key} value={value} className="text-universe-text-primary">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.genre && (
            <div className="text-sm text-red-400">
              {errors.genre.message}
            </div>
          )}
        </div>

        {/* 한줄 소개 */}
        <div className="space-y-2">
          <Label htmlFor="tagline" className="text-universe-text-primary">
            한줄 소개 *
          </Label>
          <Input
            id="tagline"
            {...register('tagline')}
            placeholder="게임을 한 줄로 설명해주세요"
            className={cn(
              "bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50",
              errors.tagline && "border-red-400 focus:border-red-400"
            )}
            aria-invalid={!!errors.tagline}
            aria-describedby={errors.tagline ? "tagline-error" : undefined}
          />
          {errors.tagline && (
            <div 
              id="tagline-error"
              className="text-sm text-red-400"
              role="alert"
            >
              {errors.tagline.message}
            </div>
          )}
        </div>

        {/* 게임 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-universe-text-primary">
            게임 설명 *
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="게임에 대해 자세히 설명해주세요 (20자 이상)"
            rows={6}
            className={cn(
              "bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50 resize-none",
              errors.description && "border-red-400 focus:border-red-400"
            )}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          <div className="text-xs text-universe-text-secondary text-right">
            {watchedValues.description?.length || 0} / 2000
          </div>
          {errors.description && (
            <div 
              id="description-error"
              className="text-sm text-red-400"
              role="alert"
            >
              {errors.description.message}
            </div>
          )}
        </div>
      </div>

      {/* 외부 링크 */}
      <div className="space-y-6">
        <h3 className="text-xl font-orbitron font-medium text-universe-text-primary">
          외부 링크
        </h3>
        
        {/* 다운로드 링크 */}
        <div className="space-y-2">
          <Label htmlFor="downloadUrl" className="text-universe-text-primary">
            다운로드 링크 *
          </Label>
          <Input
            id="downloadUrl"
            {...register('downloadUrl')}
            placeholder="https://store.steampowered.com/..."
            className={cn(
              "bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50",
              errors.downloadUrl && "border-red-400 focus:border-red-400"
            )}
            aria-invalid={!!errors.downloadUrl}
            aria-describedby={errors.downloadUrl ? "downloadUrl-error" : undefined}
          />
          {errors.downloadUrl && (
            <div 
              id="downloadUrl-error"
              className="text-sm text-red-400"
              role="alert"
            >
              {errors.downloadUrl.message}
            </div>
          )}
        </div>

        {/* 홈페이지 링크 */}
        <div className="space-y-2">
          <Label htmlFor="homepageUrl" className="text-universe-text-primary">
            홈페이지 링크
          </Label>
          <Input
            id="homepageUrl"
            {...register('homepageUrl')}
            placeholder="https://yourgame.com (선택사항)"
            className={cn(
              "bg-universe-surface/20 border-universe-surface/30 text-universe-text-primary placeholder:text-universe-text-secondary/50",
              errors.homepageUrl && "border-red-400 focus:border-red-400"
            )}
            aria-invalid={!!errors.homepageUrl}
            aria-describedby={errors.homepageUrl ? "homepageUrl-error" : undefined}
          />
          {errors.homepageUrl && (
            <div 
              id="homepageUrl-error"
              className="text-sm text-red-400"
              role="alert"
            >
              {errors.homepageUrl.message}
            </div>
          )}
        </div>
      </div>

      {/* 파일 업로드 */}
      <div className="space-y-6">
        <h3 className="text-xl font-orbitron font-medium text-universe-text-primary">
          게임 이미지
        </h3>
        
        {/* 썸네일 업로드 */}
        <FileUpload
          files={thumbnailFile}
          onFilesChange={setThumbnailFile}
          maxFiles={1}
          maxSize={5}
          acceptedTypes={['image/png', 'image/jpeg']}
          label="썸네일 이미지 (64x64 픽셀아트 권장) *"
          required={true}
        />

        {/* 스크린샷 업로드 */}
        <FileUpload
          files={screenshotFiles}
          onFilesChange={setScreenshotFiles}
          maxFiles={4}
          maxSize={5}
          acceptedTypes={['image/png', 'image/jpeg', 'image/gif']}
          label="스크린샷 또는 GIF (최대 4장) *"
          required={true}
        />
      </div>

      {/* 행성 유형 선택 */}
      <div className="space-y-6">
        <h3 className="text-xl font-orbitron font-medium text-universe-text-primary">
          행성 유형
        </h3>
        
        <PlanetTypeSelector
          selectedType={selectedPlanetType}
          onSelect={handlePlanetTypeSelect}
          error={errors.planetType?.message}
        />
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
          disabled={!isValid || isSubmitting || thumbnailFile.length === 0 || screenshotFiles.length === 0}
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

// cn 유틸리티 함수 (utils.ts에 이미 있을 수 있음)
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
