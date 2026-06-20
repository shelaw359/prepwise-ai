-- Study plans table for PrepWise AI
create table if not exists study_plans (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  topics text not null,
  exam_date date not null,
  schedule jsonb not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table study_plans enable row level security;

-- Public CRUD policies (public study planner, no auth required)
create policy "select_study_plans"
  on study_plans for select
  to anon, authenticated
  using (true);

create policy "insert_study_plans"
  on study_plans for insert
  to anon, authenticated
  with check (true);

create policy "update_study_plans"
  on study_plans for update
  to anon, authenticated
  using (true) with check (true);

create policy "delete_study_plans"
  on study_plans for delete
  to anon, authenticated
  using (true);

-- Index for ordering by created_at desc
create index if not exists study_plans_created_at_idx
  on study_plans (created_at desc);
