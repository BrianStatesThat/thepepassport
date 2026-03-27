-- Create listing_submissions table for admin verification workflow
create table public.listing_submissions (
  id uuid not null default gen_random_uuid (),
  listing_data jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_by jsonb not null,
  reviewed_by text null,
  reviewed_at timestamp with time zone null,
  rejection_reason text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint listing_submissions_pkey primary key (id)
) tablespace pg_default;

-- Add RLS policies
alter table public.listing_submissions enable row level security;

-- Policy for authenticated users to insert their own submissions
create policy "Users can insert their own submissions" on public.listing_submissions
  for insert with check (auth.role() = 'authenticated');

-- Policy for authenticated users to view their own submissions
create policy "Users can view their own submissions" on public.listing_submissions
  for select using (auth.role() = 'authenticated' and submitted_by->>'email' = auth.jwt()->>'email');

-- Policy for admins to view all submissions (assuming admin role)
create policy "Admins can view all submissions" on public.listing_submissions
  for select using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

-- Policy for admins to update submissions
create policy "Admins can update submissions" on public.listing_submissions
  for update using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

-- Create index for status filtering
create index if not exists idx_listing_submissions_status on public.listing_submissions using btree (status) tablespace pg_default;

-- Create index for created_at ordering
create index if not exists idx_listing_submissions_created_at on public.listing_submissions using btree (created_at desc) tablespace pg_default;