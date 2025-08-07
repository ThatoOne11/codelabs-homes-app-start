-- Enable RLS on the locations table
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to SELECT
CREATE POLICY "Authenticated can SELECT"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);