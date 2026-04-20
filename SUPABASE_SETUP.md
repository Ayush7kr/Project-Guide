# Supabase Database Setup

To enable persistence (saving projects and progress), you need to set up a Supabase table.

## 1. SQL Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create the projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  blueprint_data jsonb not null
);

-- Enable Row Level Security
alter table projects enable row level security;

-- Create Policies
-- 1. Users can view their own projects
create policy "Users can view their own projects"
on projects for select
using (auth.uid() = user_id);

-- 2. Users can insert their own projects
create policy "Users can insert their own projects"
on projects for insert
with check (auth.uid() = user_id);

-- 3. Users can update their own projects
create policy "Users can update their own projects"
on projects for update
using (auth.uid() = user_id);

-- 4. Users can delete their own projects
create policy "Users can delete their own projects"
on projects for delete
using (auth.uid() = user_id);
```

## 2. Row Level Security (RLS)
> [!IMPORTANT]
> Ensure that the **Delete** policy is correctly applied. If you are unable to delete projects, verify that the `projects_delete_policy` exists and targets `auth.uid() = user_id`.

## 3. Environment Variables
Add your Supabase credentials to `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
