'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, Image, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  label: string;
  error?: string;
  required?: boolean;
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 4,
  maxSize = 5,
  acceptedTypes = ['image/png', 'image/jpeg', 'image/gif'],
  label,
  error,
  required = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileImage className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-universe-text-primary">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer",
          isDragActive || dragActive
            ? "border-universe-secondary bg-universe-secondary/10"
            : "border-universe-surface/30 hover:border-universe-secondary/50 hover:bg-universe-surface/10",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-universe-surface/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-universe-text-secondary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-universe-text-primary">
              {isDragActive ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭하여 업로드'}
            </p>
            <p className="text-sm text-universe-text-secondary">
              {acceptedTypes.join(', ')} • 최대 {maxSize}MB • 최대 {maxFiles}개 파일
            </p>
            {files.length >= maxFiles && (
              <p className="text-sm text-universe-secondary">
                최대 파일 수에 도달했습니다
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 업로드된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-universe-text-primary">
            업로드된 파일 ({files.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative group bg-universe-surface/20 rounded-lg p-3 border border-universe-surface/30"
              >
                {/* 파일 정보 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-universe-surface/40 rounded-lg flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-universe-text-primary truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-universe-text-secondary">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-universe-text-secondary">
                      {file.type}
                    </p>
                  </div>
                  
                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 w-6 h-6 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="파일 삭제"
                  >
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                </div>
                
                {/* 파일 미리보기 (이미지인 경우) */}
                {file.type.startsWith('image/') && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg border border-universe-surface/20"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div 
          className="text-sm text-red-400 flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
