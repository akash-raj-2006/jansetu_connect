ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS image_paths text[] NOT NULL DEFAULT '{}'::text[];

CREATE POLICY "report_images_public_insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'report-images');
CREATE POLICY "report_images_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'report-images');
CREATE POLICY "report_images_staff_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'report-images');
CREATE POLICY "report_images_staff_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'report-images');