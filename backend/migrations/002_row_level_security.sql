-- ============================================================================
-- 002_row_level_security.sql
-- Defense-in-depth RLS + private Storage bucket policies.
--
-- The Express API always uses the Supabase *service role* key, which
-- bypasses RLS entirely — so these policies are NOT what protects normal
-- CRUD traffic (the Express middleware in src/middleware/auth.ts does that).
--
-- They matter for exactly one thing that talks to Supabase directly with
-- the user's own (anon/authenticated) JWT: the admin dashboard's Realtime
-- subscription on `orders`. Supabase Realtime enforces RLS on every
-- postgres_changes event, so without a SELECT policy here moderators would
-- never actually receive the "new pending order" event.
-- ============================================================================

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.wallets enable row level security;
alter table public.audit_logs enable row level security;

-- security definer helpers avoid the classic "RLS policy on `users`
-- queries `users`" infinite recursion problem.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('moderator', 'super_admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'super_admin'
  );
$$;

-- users -----------------------------------------------------------------
drop policy if exists "users_select_own_or_staff" on public.users;
create policy "users_select_own_or_staff" on public.users
  for select using (auth.uid() = id or public.is_staff());

-- products ----------------------------------------------------------------
drop policy if exists "products_select_available" on public.products;
create policy "products_select_available" on public.products
  for select using (is_available = true or public.is_staff());

-- orders (required for the Realtime queue to work) ------------------------
drop policy if exists "orders_select_own_or_staff" on public.orders;
create policy "orders_select_own_or_staff" on public.orders
  for select using (auth.uid() = user_id or public.is_staff());

-- wallets -------------------------------------------------------------------
drop policy if exists "wallets_select_own_or_staff" on public.wallets;
create policy "wallets_select_own_or_staff" on public.wallets
  for select using (auth.uid() = user_id or public.is_staff());

-- audit_logs — Super Admin exclusive, per the spec ---------------------------
drop policy if exists "audit_logs_select_super_admin" on public.audit_logs;
create policy "audit_logs_select_super_admin" on public.audit_logs
  for select using (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- Storage: private "receipts" bucket
-- Uploads are written by the backend using the service key (path convention:
-- "{user_id}/{uuid}.{ext}"), but these policies are the actual bucket ACL
-- that Supabase enforces, matching the spec's "Private Bucket + signed URL"
-- requirement.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

drop policy if exists "receipts_owner_read" on storage.objects;
create policy "receipts_owner_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "receipts_staff_read" on storage.objects;
create policy "receipts_staff_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'receipts' and public.is_staff());

-- No public/anon INSERT or UPDATE policy on purpose: all uploads must go
-- through POST /api/uploads/receipt on the backend, which validates the
-- file's real bytes before it ever reaches Storage.
