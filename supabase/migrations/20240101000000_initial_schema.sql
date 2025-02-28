-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('admin', 'member');
create type task_priority as enum ('low', 'medium', 'high');
create type task_status as enum ('todo', 'in_progress', 'completed', 'cancelled');

-- Create users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb,
  email text unique not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create workspaces table
create table public.workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create workspace_members table (junction table for users and workspaces)
create table public.workspace_members (
  workspace_id uuid references public.workspaces on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role user_role default 'member' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  primary key (workspace_id, user_id)
);

-- Create tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status task_status default 'todo' not null,
  priority task_priority default 'medium' not null,
  due_date timestamptz,
  workspace_id uuid references public.workspaces on delete cascade not null,
  assigned_to uuid references public.profiles on delete set null,
  created_by uuid references public.profiles on delete set null not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create task_comments table
create table public.task_comments (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  task_id uuid references public.tasks on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create task_attachments table
create table public.task_attachments (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  file_url text not null,
  file_type text not null,
  file_size integer not null,
  task_id uuid references public.tasks on delete cascade not null,
  uploaded_by uuid references public.profiles on delete cascade not null,
  created_at timestamptz default now() not null
);

-- Create task_labels table
create table public.task_labels (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  color text not null,
  workspace_id uuid references public.workspaces on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create task_label_assignments table (junction table for tasks and labels)
create table public.task_label_assignments (
  task_id uuid references public.tasks on delete cascade not null,
  label_id uuid references public.task_labels on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (task_id, label_id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.task_attachments enable row level security;
alter table public.task_labels enable row level security;
alter table public.task_label_assignments enable row level security;

-- Create policies
-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Workspaces policies
create policy "Workspace members can view workspaces"
  on public.workspaces for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Workspace admins can update workspaces"
  on public.workspaces for update
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role = 'admin'
    )
  );

-- Tasks policies
create policy "Workspace members can view tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Workspace members can create tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Task creators and assignees can update tasks"
  on public.tasks for update
  using (
    auth.uid() = created_by or
    auth.uid() = assigned_to
  );

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create indexes
create index idx_workspace_members_user_id on public.workspace_members(user_id);
create index idx_workspace_members_workspace_id on public.workspace_members(workspace_id);
create index idx_tasks_workspace_id on public.tasks(workspace_id);
create index idx_tasks_assigned_to on public.tasks(assigned_to);
create index idx_task_comments_task_id on public.task_comments(task_id);
create index idx_task_attachments_task_id on public.task_attachments(task_id); 