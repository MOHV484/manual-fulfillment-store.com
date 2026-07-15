-- ============================================================================
-- 001_init_schema.sql
-- Core relational schema for the manual fulfillment platform.
-- Run this in the Supabase SQL editor (or via `supabase db push`) once,
-- against a fresh project. Matches the blueprint in the engineering spec
-- exactly, plus the indexes it calls for on orders.status /
-- orders.assigned_admin_id.
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    email varchar(150) unique not null,
    phone varchar(20) unique not null,
    password_hash varchar(255) not null,
    role varchar(20) not null default 'client', -- 'client' | 'moderator' | 'super_admin'
    status varchar(20) not null default 'active', -- 'active' | 'suspended'
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp,
    constraint users_role_check check (role in ('client', 'moderator', 'super_admin')),
    constraint users_status_check check (status in ('active', 'suspended'))
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    title varchar(150) not null,
    description text,
    category varchar(50) not null, -- 'gaming_charge' | 'account_security' | 'digital_cards'
    price numeric(10, 2) not null,
    is_available boolean default true,
    created_at timestamptz default current_timestamp,
    constraint products_category_check check (
        category in ('gaming_charge', 'account_security', 'digital_cards')
    )
);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete restrict,
    product_id uuid references public.products(id) on delete restrict,
    player_id varchar(100),
    account_details text,
    receipt_url text not null, -- private Storage *path* (e.g. "{user_id}/{uuid}.jpg"), never a public URL
    status varchar(25) not null default 'pending', -- 'pending' | 'processing' | 'completed' | 'rejected'
    assigned_admin_id uuid references public.users(id) on delete set null,
    rejection_reason text,
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp,
    constraint orders_status_check check (
        status in ('pending', 'processing', 'completed', 'rejected')
    )
);

-- ---------------------------------------------------------------------------
-- wallets
-- ---------------------------------------------------------------------------
create table if not exists public.wallets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid unique references public.users(id) on delete cascade,
    balance numeric(10, 2) not null default 0.00,
    updated_at timestamptz default current_timestamp
);

-- ---------------------------------------------------------------------------
-- audit_logs (append-only — nothing here is ever updated or deleted)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid references public.users(id) on delete restrict,
    action_type varchar(50) not null, -- 'order_approve' | 'order_reject' | 'order_claim' | 'balance_modify'
    order_id uuid references public.orders(id) on delete set null,
    previous_value text,
    new_value text,
    ip_address varchar(45),
    created_at timestamptz default current_timestamp
);

-- ---------------------------------------------------------------------------
-- Indexes — the spec calls these out explicitly for the claim/queue queries
-- ---------------------------------------------------------------------------
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_assigned_admin_id on public.orders(assigned_admin_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_audit_logs_order_id on public.audit_logs(order_id);
create index if not exists idx_audit_logs_admin_id on public.audit_logs(admin_id);

-- ---------------------------------------------------------------------------
-- updated_at auto-touch trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_wallets_updated_at on public.wallets;
create trigger trg_wallets_updated_at
before update on public.wallets
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-provision a public.users row (+ empty wallet) whenever Supabase Auth
-- creates a new auth.users row — covers email/password signup AND Google /
-- Facebook OAuth signup, so every login method ends up with a role/status.
--
-- NOTE on password_hash / phone: Supabase Auth owns the real password hash
-- in auth.users — this table only tracks role/status, so password_hash is
-- filled with a fixed placeholder. phone is NOT NULL UNIQUE in the spec but
-- OAuth signups don't collect one, so we fall back to a unique placeholder;
-- a future "complete your profile" screen should let the user set a real
-- phone number (not built yet — flagged as a known gap).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, phone, password_hash, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', 'unset-' || substr(new.id::text, 1, 8)),
    'managed-by-supabase-auth',
    'client',
    'active'
  )
  on conflict (id) do nothing;

  insert into public.wallets (user_id, balance)
  values (new.id, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- Enable Realtime on orders — the admin dashboard subscribes to INSERTs
-- here to alert moderators the instant a new order lands.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.orders;

-- ---------------------------------------------------------------------------
-- Seed your first Super Admin manually after creating their auth account
-- (Supabase Dashboard -> Authentication -> Add user, or the signup form),
-- then run:
--   update public.users set role = 'super_admin' where email = 'you@example.com';
-- ---------------------------------------------------------------------------
