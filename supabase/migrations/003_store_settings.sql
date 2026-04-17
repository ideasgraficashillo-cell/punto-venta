create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null unique references auth.users(id) on delete cascade default auth.uid(),
  store_name text not null,
  location text,
  phone text,
  contact_email text,
  currency text not null default 'MXN',
  timezone text not null default 'America/Mexico_City',
  tax_name text,
  tax_id text,
  logo_url text,
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;

drop policy if exists "store_settings_select_own" on public.store_settings;
drop policy if exists "store_settings_insert_own" on public.store_settings;
drop policy if exists "store_settings_update_own" on public.store_settings;

create policy "store_settings_select_own"
on public.store_settings
for select
to authenticated
using (auth.uid() = created_by);

create policy "store_settings_insert_own"
on public.store_settings
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "store_settings_update_own"
on public.store_settings
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

insert into storage.buckets (id, name, public)
values ('store-logos', 'store-logos', true)
on conflict (id) do nothing;

drop policy if exists "store_logos_public_read" on storage.objects;
drop policy if exists "store_logos_auth_upload" on storage.objects;
drop policy if exists "store_logos_auth_update" on storage.objects;
drop policy if exists "store_logos_auth_delete" on storage.objects;

create policy "store_logos_public_read"
on storage.objects
for select
to public
using (bucket_id = 'store-logos');

create policy "store_logos_auth_upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'store-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "store_logos_auth_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'store-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'store-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "store_logos_auth_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'store-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
