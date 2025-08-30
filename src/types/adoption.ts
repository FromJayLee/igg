import { z } from 'zod';

// 행성 유형 enum
export const PLANET_TYPES = {
  terran: 'terran',
  gas_giant: 'gas_giant',
  ice_world: 'ice_world',
  desert: 'desert',
  ocean: 'ocean',
  volcanic: 'volcanic',
} as const;

export type PlanetType = keyof typeof PLANET_TYPES;

// 장르 enum
export const GENRES = {
  Action: 'Action',
  RPG: 'RPG',
  Puzzle: 'Puzzle',
  Platformer: 'Platformer',
  Strategy: 'Strategy',
  Simulation: 'Simulation',
  Other: 'Other',
} as const;

export type Genre = keyof typeof GENRES;

// 폼 데이터 스키마
export const AdoptionFormSchema = z.object({
  gameName: z.string()
    .min(2, '게임명은 2자 이상 입력해주세요')
    .max(60, '게임명은 60자 이하로 입력해주세요'),
  description: z.string()
    .min(20, '게임 설명은 20자 이상 입력해주세요')
    .max(2000, '게임 설명은 2000자 이하로 입력해주세요'),
  genre: z.nativeEnum(GENRES, {
    errorMap: () => ({ message: '장르를 선택해주세요' })
  }),
  tagline: z.string()
    .min(5, '한줄 소개는 5자 이상 입력해주세요')
    .max(120, '한줄 소개는 120자 이하로 입력해주세요'),
  downloadUrl: z.string()
    .url('올바른 URL 형식을 입력해주세요')
    .regex(/^https?:\/\//, 'http 또는 https로 시작하는 URL을 입력해주세요'),
  homepageUrl: z.string()
    .url('올바른 URL 형식을 입력해주세요')
    .regex(/^https?:\/\//, 'http 또는 https로 시작하는 URL을 입력해주세요')
    .optional()
    .or(z.literal('')),
  planetType: z.nativeEnum(PLANET_TYPES, {
    errorMap: () => ({ message: '행성 유형을 선택해주세요' })
  }),
});

export type AdoptionFormData = z.infer<typeof AdoptionFormSchema>;

// 파일 업로드 관련 타입
export interface FileUpload {
  file: File;
  preview: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadProgress {
  thumbnail: number;
  screenshots: number[];
  total: number;
}

// API 응답 타입
export interface AdoptionResponse {
  success: boolean;
  planetId?: string;
  error?: string;
}

// 행성 분양 신청 데이터 (DB 저장용)
export interface PlanetAdoption {
  id: string;
  gameName: string;
  description: string;
  genre: Genre;
  tagline: string;
  downloadUrl: string;
  homepageUrl?: string;
  planetType: PlanetType;
  thumbnailUrl: string;
  screenshotUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
