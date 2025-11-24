# Supabase Setup Guide

To make your app work, you need to set up the database in Supabase.

## 1. Get Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project.
3. Go to **Project Settings** -> **API**.
4. Copy the **Project URL** and **anon public key**.
5. Paste them into `src/supabaseClient.js`.

## 2. Run SQL Scripts
Go to the **SQL Editor** in your Supabase dashboard and run the following script to create all tables and security policies.

```sql
-- 1. Create Profiles Table (extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user',
  full_name text,
  phone text,
  college text,
  degree text,
  grad_year text,
  skills text,
  github text,
  linkedin text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Programs Table
create table programs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  duration text,
  price text,
  category text,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Videos Table
create table program_videos (
  id uuid default uuid_generate_v4() primary key,
  program_id uuid references programs(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Internships Table
create table internships (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  location text,
  type text,
  stipend text,
  duration text,
  apply_link text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Tasks Table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  coins integer default 0,
  difficulty text,
  skills_required text,
  deadline date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table programs enable row level security;
alter table program_videos enable row level security;
alter table internships enable row level security;
alter table tasks enable row level security;

-- 7. Create Policies

-- Profiles: Users can read/write their own profile. Admins can read all.
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Programs: Public read, Admin write
create policy "Programs are viewable by everyone" on programs for select using (true);
create policy "Admins can insert programs" on programs for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete programs" on programs for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Videos: Public read, Admin write
create policy "Videos are viewable by everyone" on program_videos for select using (true);
create policy "Admins can insert videos" on program_videos for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete videos" on program_videos for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Internships: Public read, Admin write
create policy "Internships are viewable by everyone" on internships for select using (true);
create policy "Admins can insert internships" on internships for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete internships" on internships for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Tasks: Public read, Admin write
create policy "Tasks are viewable by everyone" on tasks for select using (true);
create policy "Admins can insert tasks" on tasks for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete tasks" on tasks for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 8. Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 3. Make Yourself Admin
After you sign up in the app, go to the **Table Editor** -> `profiles` table, find your user row, and change the `role` column from `user` to `admin`.
