-- Create subscription related tables
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create type subscription_status as enum (
  'trialing',
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused'
);

-- Create products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  active boolean default true,
  name text not null,
  description text,
  image text,
  metadata jsonb,
  stripe_product_id text unique,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create prices table
create table public.prices (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products on delete cascade not null,
  active boolean default true,
  description text,
  unit_amount bigint,
  currency text default 'usd',
  type pricing_type default 'recurring',
  interval pricing_plan_interval,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb,
  stripe_price_id text unique,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  status subscription_status,
  metadata jsonb,
  price_id uuid references public.prices,
  quantity integer,
  cancel_at_period_end boolean,
  created_at timestamptz default now() not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  ended_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  stripe_subscription_id text unique
);

-- Add subscription_id to workspaces
alter table public.workspaces
add column subscription_id uuid references public.subscriptions;

-- Add subscription-specific columns to workspace_members
alter table public.workspace_members
add column billing_status text,
add column billing_cycle_start timestamptz,
add column billing_cycle_end timestamptz;

-- Create workspace limits table
create table public.workspace_limits (
  workspace_id uuid references public.workspaces on delete cascade primary key,
  max_members integer default 5,
  max_storage_gb integer default 1,
  max_tasks integer default 100,
  features jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create billing history table
create table public.billing_history (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces on delete cascade,
  user_id uuid references auth.users on delete cascade,
  amount bigint,
  currency text,
  status text,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  metadata jsonb,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.products enable row level security;
alter table public.prices enable row level security;
alter table public.subscriptions enable row level security;
alter table public.workspace_limits enable row level security;
alter table public.billing_history enable row level security;

-- Create policies
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

create policy "Prices are viewable by everyone"
  on public.prices for select
  using (true);

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Workspace members can view workspace limits"
  on public.workspace_limits for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspace_limits.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Users can view their own billing history"
  on public.billing_history for select
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = billing_history.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role = 'admin'
    )
  );

-- Create functions
create or replace function public.handle_new_workspace()
returns trigger as $$
begin
  insert into public.workspace_limits (workspace_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_workspace_created
  after insert on public.workspaces
  for each row execute procedure public.handle_new_workspace();

-- Create indexes
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_prices_product_id on public.prices(product_id);
create index idx_billing_history_workspace_id on public.billing_history(workspace_id);
create index idx_billing_history_user_id on public.billing_history(user_id); 