create extension if not exists pgcrypto;

create table if not exists public.monitoring_services (
  id text primary key,
  name text not null,
  category text not null check (category in ('platform', 'route', 'automation', 'integration')),
  status text not null default 'unknown' check (status in ('healthy', 'warning', 'failed', 'unknown')),
  target text,
  message text,
  response_time_ms integer,
  consecutive_failures integer not null default 0,
  expected_interval_minutes integer,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.monitoring_alerts (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.monitoring_services(id) on delete cascade,
  severity text not null check (severity in ('warning', 'critical')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  title text not null,
  message text,
  trigger text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  last_notified_at timestamptz
);

create unique index if not exists monitoring_alerts_active_idx
  on public.monitoring_alerts (service_id, trigger)
  where status in ('open', 'acknowledged');

create index if not exists monitoring_alerts_status_created_idx
  on public.monitoring_alerts (status, created_at desc);

create table if not exists public.automation_heartbeats (
  id bigint generated always as identity primary key,
  automation_id text not null,
  source text not null default 'external',
  health text not null default 'healthy' check (health in ('healthy', 'warning', 'paused', 'failed')),
  throughput text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default timezone('utc', now())
);

create index if not exists automation_heartbeats_automation_received_idx
  on public.automation_heartbeats (automation_id, received_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists monitoring_services_set_updated_at on public.monitoring_services;
create trigger monitoring_services_set_updated_at
before update on public.monitoring_services
for each row
execute function public.set_updated_at();

drop trigger if exists monitoring_alerts_set_updated_at on public.monitoring_alerts;
create trigger monitoring_alerts_set_updated_at
before update on public.monitoring_alerts
for each row
execute function public.set_updated_at();
