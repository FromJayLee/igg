-- Add customization JSONB column to planets table
-- This migration adds support for detailed planet customization while maintaining backward compatibility

BEGIN;

-- Add customization column with default empty JSON
ALTER TABLE planets 
ADD COLUMN IF NOT EXISTS customization JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add comment for the new column
COMMENT ON COLUMN planets.customization IS 'Detailed planet customization settings including colors, textures, and visual elements';

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_planets_customization_gin 
ON planets USING GIN (customization);

-- Create functional indexes for commonly queried customization fields
CREATE INDEX IF NOT EXISTS idx_planets_customization_type 
ON planets USING BTREE ((customization->>'type'));

CREATE INDEX IF NOT EXISTS idx_planets_customization_colors 
ON planets USING GIN ((customization->'colors'));

-- Update RLS policies to handle customization column
-- The existing policies will automatically apply to the new column
-- No additional RLS policies needed as customization is part of the planet data

-- Verify the migration
DO $$
BEGIN
  -- Check if customization column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'planets' AND column_name = 'customization'
  ) THEN
    RAISE EXCEPTION 'Customization column was not added successfully';
  END IF;
  
  -- Check if indexes were created
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'planets' AND indexname = 'idx_planets_customization_gin'
  ) THEN
    RAISE EXCEPTION 'Customization GIN index was not created successfully';
  END IF;
  
  RAISE NOTICE 'Migration 003_add_planets_customization completed successfully';
END $$;

COMMIT;

