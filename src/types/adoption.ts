import { z } from 'zod';



// 장르 enum
export const GENRES = {
  Action: 'Action',
  RPG: 'RPG',
  Puzzle: 'Puzzle',
  Strategy: 'Strategy',
  Adventure: 'Adventure',
  Simulation: 'Simulation',
  Sports: 'Sports',
  Horror: 'Horror',
  Platformer: 'Platformer',
  Shooter: 'Shooter',
  Racing: 'Racing',
  Fighting: 'Fighting',
  Music: 'Music',
  Educational: 'Educational',
  Casual: 'Casual',
  Other: 'Other',
} as const;

export type Genre = keyof typeof GENRES;

// 단순화된 폼 데이터 스키마 (커스터마이제이션 제거)
export const AdoptionFormSchema = z.object({
  gameName: z.string()
    .min(2, '게임명은 2자 이상 입력해주세요')
    .max(100, '게임명은 100자 이하로 입력해주세요'),
  description: z.string()
    .min(10, '게임 설명은 10자 이상 입력해주세요')
    .max(1000, '게임 설명은 1000자 이하로 입력해주세요'),
  genre: z.nativeEnum(GENRES, {
    errorMap: () => ({ message: '장르를 선택해주세요' })
  }),
  tagline: z.string()
    .min(5, '태그라인은 5자 이상 입력해주세요')
    .max(200, '태그라인은 200자 이하로 입력해주세요'),
  downloadUrl: z.string().url('올바른 다운로드 URL을 입력해주세요'),
  homepageUrl: z.string().url('올바른 홈페이지 URL을 입력해주세요').optional(),

});

export type AdoptionFormData = z.infer<typeof AdoptionFormSchema>;

// 행성 분양 데이터 타입 (커스터마이제이션 제거)
export interface PlanetAdoption {
  id: string;
  gameName: string;
  description: string;
  genre: Genre;
  tagline: string;
  downloadUrl: string;
  homepageUrl?: string;

  planetThumbnailUrl: string; // 절차적 생성된 썸네일 URL
  screenshotUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
