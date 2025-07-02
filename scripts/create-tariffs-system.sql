/*=====================================================================
|  MÓDULO DE TARIFAS — SCRIPT ÚNICO, COMPLETO E IDEMPOTENTE
|  Probado en Supabase (PostgreSQL 14)
|  Sistema de Tarifas para Laboratorio López
=====================================================================*/

---------------- 0. Extensiones ---------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "plpgsql";

---------------- 1. Tablas --------------------------------------------
create table if not exists public.tariffs (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null unique,
  type       text        not null check (type in ('cost','sale')),
  is_taxable boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tariff_prices (
  id         uuid primary key default gen_random_uuid(),
  tariff_id  uuid not null references public.tariffs(id) on delete cascade,
  exam_id    uuid not null references public.analyses(id) on delete cascade,
  price      numeric(12,2) not null check (price >= 0),
  updated_at timestamptz   not null default now(),
  unique (tariff_id, exam_id)
);

create table if not exists public.references (
  id                uuid primary key default gen_random_uuid(),
  code              text,
  name              text not null,
  business_name     text,
  default_tariff_id uuid references public.tariffs(id),
  active            boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Tabla para asociar usuarios con referencias (médicos/empresas con tarifas específicas)
create table if not exists public.user_references (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  reference_id uuid not null references public.references(id) on delete cascade,
  created_at   timestamptz default now(),
  unique (user_id, reference_id)
);

---------------- 2. Índices -------------------------------------------
create index if not exists idx_tariff_prices_exam     on public.tariff_prices (exam_id);
create index if not exists idx_tariff_prices_tariff   on public.tariff_prices (tariff_id);
create index if not exists idx_references_tariff      on public.references   (default_tariff_id);
create index if not exists idx_user_references_user   on public.user_references (user_id);
create index if not exists idx_user_references_ref    on public.user_references (reference_id);

---------------- 3. Trigger updated_at --------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_timestamp_tariffs       on public.tariffs;
drop trigger if exists set_timestamp_tariff_prices on public.tariff_prices;
drop trigger if exists set_timestamp_references    on public.references;

create trigger set_timestamp_tariffs
  before update on public.tariffs
  for each row execute function public.set_updated_at();

create trigger set_timestamp_tariff_prices
  before update on public.tariff_prices
  for each row execute function public.set_updated_at();

create trigger set_timestamp_references
  before update on public.references
  for each row execute function public.set_updated_at();

---------------- 4. Activar RLS ---------------------------------------
alter table public.tariffs        enable row level security;
alter table public.tariff_prices  enable row level security;
alter table public.references     enable row level security;
alter table public.user_references enable row level security;

---------------- 5. Políticas RLS -------------------------------------
-- Función helper para verificar si es admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users 
    where id = auth.uid() 
    and user_type = 'admin'
  );
end;
$$ language plpgsql security definer;

-- TABLA tariffs
drop policy if exists tariffs_read_auth  on public.tariffs;
drop policy if exists tariffs_admin_all  on public.tariffs;

create policy tariffs_read_auth
  on public.tariffs
  for select using (auth.uid() is not null);

create policy tariffs_admin_all
  on public.tariffs
  for all
  using (is_admin())
  with check (is_admin());

-- TABLA tariff_prices
drop policy if exists tariff_prices_read_auth  on public.tariff_prices;
drop policy if exists tariff_prices_admin_all  on public.tariff_prices;

create policy tariff_prices_read_auth
  on public.tariff_prices
  for select using (auth.uid() is not null);

create policy tariff_prices_admin_all
  on public.tariff_prices
  for all
  using (is_admin())
  with check (is_admin());

-- TABLA references
drop policy if exists references_read_auth  on public.references;
drop policy if exists references_admin_all  on public.references;

create policy references_read_auth
  on public.references
  for select using (auth.uid() is not null);

create policy references_admin_all
  on public.references
  for all
  using (is_admin())
  with check (is_admin());

-- TABLA user_references
drop policy if exists user_references_read_auth  on public.user_references;
drop policy if exists user_references_admin_all  on public.user_references;

create policy user_references_read_auth
  on public.user_references
  for select using (auth.uid() = user_id or is_admin());

create policy user_references_admin_all
  on public.user_references
  for all
  using (is_admin())
  with check (is_admin());

---------------- 6. Grants -------------------------------------------
grant select on public.tariffs, public.tariff_prices, public.references, public.user_references to authenticated;
grant execute on function public.is_admin() to authenticated;

---------------- 7. Datos iniciales ----------------------------------
-- Crear tarifas base para Laboratorio López
insert into public.tariffs (name, type, is_taxable) values
  ('Base', 'sale', true),
  ('Exonerado', 'sale', false),
  ('Particular San Juan', 'sale', true),
  ('Particular Santa Anita', 'sale', true),
  ('Referencial con IGV', 'sale', true),
  ('Referencial sin IGV', 'sale', false),
  ('Costo', 'cost', false)
on conflict (name) do nothing;

-- Crear referencias base
insert into public.references (name, business_name) values
  ('Público General', 'Público General'),
  ('Médicos', 'Médicos'),
  ('Empresas', 'Empresas'),
  ('Centro de Salud Calcuta', 'Centro de Salud Calcuta'),
  ('Clínica Solidaria La Campiña', 'Clínica Solidaria La Campiña E.I.R.L'),
  ('Clínica Vista Alegre', 'Clínica Vista Alegre'),
  ('Laboratorio Clínico López', 'Laboratorio Clínico López')
on conflict do nothing;

---------------- 8. Verificación --------------------------------------
select 
  schemaname, 
  tablename, 
  policyname, 
  cmd
from pg_policies
where tablename in ('tariffs','tariff_prices','references','user_references')
order by tablename, policyname;

-- Verificar que las tarifas se crearon
select id, name, type, is_taxable from public.tariffs;

-- Verificar que las referencias se crearon
select id, name, business_name from public.references; 