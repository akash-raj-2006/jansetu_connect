DROP POLICY IF EXISTS "reports_official_update" ON public.reports;

DROP POLICY IF EXISTS "report_images_staff_update" ON storage.objects;
DROP POLICY IF EXISTS "report_images_staff_delete" ON storage.objects;

CREATE POLICY "report_images_staff_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'report-images' AND public.is_official(auth.uid()))
WITH CHECK (bucket_id = 'report-images' AND public.is_official(auth.uid()));

CREATE POLICY "report_images_staff_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'report-images' AND public.is_official(auth.uid()));