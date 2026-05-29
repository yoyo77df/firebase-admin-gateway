
-- ===== Roles =====
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_select_all" on public.profiles for select to authenticated using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "roles_read_own" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "roles_admin_all" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- auto-create profile + default user role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ===== Site settings (single row keyed by 'main') =====
create table public.site_settings (
  key text primary key,
  site_title text not null default 'RED EYES OFFICIAL',
  tagline text not null default 'Dominate. Conquer. Reign.',
  hero_subtitle text not null default 'A premium esports organization built on passion, precision, and victory.',
  hero_cta_label text not null default 'Join the Squad',
  hero_cta_url text not null default '/auth/register',
  logo_url text,
  hero_bg_url text,
  next_match_team_a text default 'RED EYES',
  next_match_team_b text default 'TBD',
  next_match_tournament text default 'Pro League Finals',
  next_match_at timestamptz,
  theme_accent text not null default '#ff1a3d',
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings_public_read" on public.site_settings for select using (true);
create policy "settings_admin_write" on public.site_settings for all to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')) with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
insert into public.site_settings (key) values ('main') on conflict do nothing;

-- ===== Generic content tables =====
create table public.players (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  ign text not null,
  role text,
  bio text,
  avatar_url text,
  banner_url text,
  country text,
  game text,
  socials jsonb default '{}'::jsonb,
  stats jsonb default '{}'::jsonb,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.management (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  avatar_url text,
  socials jsonb default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  team_a text not null,
  team_b text not null,
  tournament text,
  game text,
  scheduled_at timestamptz not null,
  status text not null default 'upcoming',
  score_a int,
  score_b int,
  stream_url text,
  created_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  placement text,
  game text,
  image_url text,
  created_at timestamptz not null default now()
);

create table public.highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_id text not null,
  description text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_url text,
  author text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0
);

-- grants + RLS: public read, admin/mod write
do $$
declare t text;
begin
  foreach t in array array['players','management','matches','achievements','highlights','gallery_items','news_posts','social_links']
  loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant all on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%1$s_public_read" on public.%1$I for select using (true)', t);
    execute format('create policy "%1$s_admin_write" on public.%1$I for all to authenticated using (public.has_role(auth.uid(),''admin'') or public.has_role(auth.uid(),''moderator'')) with check (public.has_role(auth.uid(),''admin'') or public.has_role(auth.uid(),''moderator''))', t);
  end loop;
end $$;

-- ===== Storage bucket for media uploads (logos, banners, gallery) =====
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;

create policy "media_public_read" on storage.objects for select using (bucket_id = 'media');
create policy "media_admin_write" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator')));
create policy "media_admin_update" on storage.objects for update to authenticated using (bucket_id = 'media' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator')));
create policy "media_admin_delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator')));
