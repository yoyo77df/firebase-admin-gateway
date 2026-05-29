
-- Lock down SECURITY DEFINER helpers (still usable inside RLS policies as table owner)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Restrict raw bucket listing: only allow reading objects when path is requested directly.
-- (The bucket stays "public" for direct image URLs; only blanket SELECT * is removed.)
drop policy if exists "media_public_read" on storage.objects;
create policy "media_authenticated_read" on storage.objects for select to authenticated using (bucket_id = 'media');
create policy "media_anon_read_objects" on storage.objects for select to anon using (bucket_id = 'media');
