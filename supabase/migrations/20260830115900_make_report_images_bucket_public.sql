-- Make the report-images bucket public so uploads work without a JWT.
-- The new sb_publishable_* API keys are not valid JWTs, so Storage rejects
-- them as Bearer tokens. Public buckets skip JWT auth entirely for uploads.
-- Files are still protected by RLS policies for update/delete.

-- Ensure the bucket exists and is marked public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'report-images',
  'report-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];
