-- 행성 유형 선택 기능 제거
-- planet_type 컬럼 삭제

ALTER TABLE planets DROP COLUMN IF EXISTS planet_type;
