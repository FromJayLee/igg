-- Remove customization JSONB column and add planet_thumbnail_url column
-- This migration removes the complex customization system and simplifies to thumbnail-only approach

BEGIN;

-- Remove customization column and related indexes
ALTER TABLE planets DROP COLUMN IF EXISTS customization;

-- Drop related indexes
DROP INDEX IF EXISTS idx_planets_customization_gin;
DROP INDEX IF EXISTS idx_planets_customization_type;
DROP INDEX IF EXISTS idx_planets_customization_colors;

-- Add planet_thumbnail_url column
ALTER TABLE planets 
ADD COLUMN IF NOT EXISTS planet_thumbnail_url text;

-- Add comment for the new column
COMMENT ON COLUMN planets.planet_thumbnail_url IS 'URL of the procedurally generated planet thumbnail image';

-- Create index for efficient thumbnail URL queries
CREATE INDEX IF NOT EXISTS idx_planets_thumbnail_url 
ON planets USING BTREE (planet_thumbnail_url);

-- Update existing records to use thumbnail_url as planet_thumbnail_url if available
UPDATE planets 
SET planet_thumbnail_url = thumbnail_url 
WHERE planet_thumbnail_url IS NULL AND thumbnail_url IS NOT NULL;

-- Make planet_thumbnail_url NOT NULL after data migration
ALTER TABLE planets 
ALTER COLUMN planet_thumbnail_url SET NOT NULL;

-- Verify the migration
DO $$
BEGIN
  -- Check if customization column was removed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'planets' AND column_name = 'customization'
  ) THEN
    RAISE EXCEPTION 'Customization column was not removed successfully';
  END IF;
  
  -- Check if planet_thumbnail_url column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'planets' AND column_name = 'planet_thumbnail_url'
  ) THEN
    RAISE EXCEPTION 'Planet_thumbnail_url column was not added successfully';
  END IF;
  
  -- Check if thumbnail_url index was created
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'planets' AND indexname = 'idx_planets_thumbnail_url'
  ) THEN
    RAISE EXCEPTION 'Thumbnail URL index was not created successfully';
  END IF;
  
  RAISE NOTICE 'Migration 004_remove_customization_add_thumbnail completed successfully';
END $$;

COMMIT;
