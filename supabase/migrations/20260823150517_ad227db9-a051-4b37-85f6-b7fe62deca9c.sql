INSERT INTO public.user_roles (user_id, role)
VALUES ('0efaa8c9-0c6f-4cea-ba9c-11bceec3d0d3', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;