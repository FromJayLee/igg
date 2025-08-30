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

// 행성 커스터마이제이션 관련 타입
export const TEXTURE_IDS = {
  cracks: 'cracks',
  dots: 'dots',
  clouds: 'clouds',
  none: 'none',
} as const;

export type TextureId = keyof typeof TEXTURE_IDS;

export const COLOR_PRESETS = {
  neon_magenta: '#ff2d9d',
  neon_cyan: '#05d9e8',
  cosmic_purple: '#4b1d79',
  midnight_navy: '#0a093d',
  deep_space_black: '#000000',
  white: '#ffffff',
} as const;

export type ColorPreset = keyof typeof COLOR_PRESETS;

// 행성 커스터마이제이션 인터페이스
export interface PlanetCustomization {
  version: 1;
  type: PlanetType;
  colors: {
    primary: string;
    secondary?: string;
    preset?: ColorPreset;
  };
  texture: {
    id: TextureId;
    intensity: number;
  };
  exterior: {
    rings?: boolean;
    satellites?: number;
  };
  interior: {
    water?: boolean;
    volcano?: boolean;
    land?: boolean;
    storm?: boolean;
  };
  seed: number;
}

// 행성 커스터마이제이션 Zod 스키마
export const PlanetCustomizationSchema = z.object({
  version: z.literal(1),
  type: z.nativeEnum(PLANET_TYPES, {
    errorMap: () => ({ message: '행성 유형을 선택해주세요' })
  }),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 색상 코드를 입력해주세요'),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 색상 코드를 입력해주세요').optional(),
    preset: z.nativeEnum(COLOR_PRESETS).optional(),
  }),
  texture: z.object({
    id: z.nativeEnum(TEXTURE_IDS, {
      errorMap: () => ({ message: '질감을 선택해주세요' })
    }),
    intensity: z.number().min(0).max(1),
  }),
  exterior: z.object({
    rings: z.boolean().optional(),
    satellites: z.number().int().min(0).max(3).optional(),
  }),
  interior: z.object({
    water: z.boolean().optional(),
    volcano: z.boolean().optional(),
    land: z.boolean().optional(),
    storm: z.boolean().optional(),
  }),
  seed: z.number().int(),
});

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

// 확장된 폼 데이터 스키마
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
  customization: z.object({
    version: z.literal(1),
    type: z.nativeEnum(PLANET_TYPES, {
      errorMap: () => ({ message: '행성 유형을 선택해주세요' })
    }),
    colors: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 색상 코드를 입력해주세요'),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 색상 코드를 입력해주세요').optional(),
      preset: z.enum(['neon_magenta', 'neon_cyan', 'cosmic_purple', 'midnight_navy', 'deep_space_black', 'white']).optional(),
    }).refine((data) => data.primary, {
      message: '주요 색상을 선택해주세요',
      path: ['primary']
    }),
    texture: z.object({
      id: z.nativeEnum(TEXTURE_IDS, {
        errorMap: () => ({ message: '질감을 선택해주세요' })
      }),
      intensity: z.number().min(0).max(1),
    }),
    exterior: z.object({
      rings: z.boolean().optional(),
      satellites: z.number().int().min(0).max(3).optional(),
    }),
    interior: z.object({
      water: z.boolean().optional(),
      volcano: z.boolean().optional(),
      land: z.boolean().optional(),
      storm: z.boolean().optional(),
    }),
    seed: z.number().int(),
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

// 행성 분양 신청 데이터 (DB 저장용) - 확장됨
export interface PlanetAdoption {
  id: string;
  gameName: string;
  description: string;
  genre: Genre;
  tagline: string;
  downloadUrl: string;
  homepageUrl?: string;
  planetType: PlanetType;
  customization: PlanetCustomization; // 새로 추가
  thumbnailUrl: string;
  screenshotUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 렌더링을 위한 변환 함수
export function toRenderDescriptor(customization: PlanetCustomization) {
  return {
    type: customization.type,
    primaryColor: customization.colors.primary,
    secondaryColor: customization.colors.secondary || customization.colors.primary,
    texture: customization.texture,
    exterior: customization.exterior,
    interior: customization.interior,
    seed: customization.seed,
  };
}
