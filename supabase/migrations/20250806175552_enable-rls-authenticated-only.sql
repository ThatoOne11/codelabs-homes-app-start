-- Enable RLS on the locations table
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to SELECT
CREATE POLICY "Authenticated can SELECT"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to INSERT
CREATE POLICY "Authenticated can INSERT"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to UPDATE
CREATE POLICY "Authenticated can UPDATE"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to DELETE
CREATE POLICY "Authenticated can DELETE"
  ON locations
  FOR DELETE
  TO authenticated
  USING (true);