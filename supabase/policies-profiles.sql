-- Ejecuta en el SQL Editor de Supabase si aún no tienes políticas en `profiles`.
-- Sin una política SELECT, el cliente no podrá leer el propio perfil tras el login.

create policy "Los usuarios pueden leer su perfil"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
