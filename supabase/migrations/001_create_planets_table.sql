-- Create planets table for planet adoption requests
CREATE TABLE IF NOT EXISTS planets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_name TEXT NOT NULL,
  description TEXT NOT NULL,
  genre TEXT NOT NULL CHECK (genre IN ('Action', 'RPG', 'Puzzle', 'Platformer', 'Strategy', 'Simulation', 'Other')),
  tagline TEXT NOT NULL,
  download_url TEXT NOT NULL,
  homepage_url TEXT,
  planet_type TEXT NOT NULL CHECK (planet_type IN ('terran', 'gas_giant', 'ice_world', 'desert', 'ocean', 'volcanic')),
  thumbnail_url TEXT NOT NULL,
  screenshot_urls TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id),
  position JSONB, -- {x: number, y: number} - assigned on approval
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_planets_status ON planets(status);
CREATE INDEX IF NOT EXISTS idx_planets_genre ON planets(genre);
CREATE INDEX IF NOT EXISTS idx_planets_planet_type ON planets(planet_type);
CREATE INDEX IF NOT EXISTS idx_planets_created_at ON planets(created_at);
CREATE INDEX IF NOT EXISTS idx_planets_submitted_by ON planets(submitted_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_planets_updated_at 
  BEFORE UPDATE ON planets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE planets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public users can only read approved planets
CREATE POLICY "Public users can view approved planets" ON planets
  FOR SELECT USING (status = 'approved');

-- Authenticated users can create planets
CREATE POLICY "Authenticated users can create planets" ON planets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own planets (if they have submitted_by set)
CREATE POLICY "Users can update own planets" ON planets
  FOR UPDATE USING (
    auth.uid() = submitted_by OR 
    (auth.role() = 'service_role')
  );

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role full access" ON planets
  FOR ALL USING (auth.role() = 'service_role');

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for thumbnails
CREATE POLICY "Public access to thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'thumbnails' AND 
    auth.role() = 'authenticated'
  );

-- Storage policies for screenshots
CREATE POLICY "Public access to screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'screenshots');

CREATE POLICY "Authenticated users can upload screenshots" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'screenshots' AND 
    auth.role() = 'authenticated'
  );

-- Add comments
COMMENT ON TABLE planets IS 'Planet adoption requests for indie games';
COMMENT ON COLUMN planets.game_name IS 'Name of the game';
COMMENT ON COLUMN planets.description IS 'Detailed description of the game';
COMMENT ON COLUMN planets.genre IS 'Game genre (Action, RPG, Puzzle, etc.)';
COMMENT ON COLUMN planets.tagline IS 'One-line description of the game';
COMMENT ON COLUMN planets.download_url IS 'URL to download/purchase the game';
COMMENT ON COLUMN planets.homepage_url IS 'Optional homepage URL for the game';
COMMENT ON COLUMN planets.planet_type IS 'Type of planet (terran, gas_giant, etc.)';
COMMENT ON COLUMN planets.thumbnail_url IS 'URL to 64x64 thumbnail image';
COMMENT ON COLUMN planets.screenshot_urls IS 'Array of screenshot/GIF URLs';
COMMENT ON COLUMN planets.status IS 'Request status: pending, approved, rejected';
COMMENT ON COLUMN planets.submitted_by IS 'User ID who submitted the request';
COMMENT ON COLUMN planets.position IS 'Position on universe map (assigned on approval)';
COMMENT ON COLUMN planets.created_at IS 'When the request was submitted';
COMMENT ON COLUMN planets.updated_at IS 'When the request was last updated';
