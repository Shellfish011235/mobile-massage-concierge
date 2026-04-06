-- Palm Concierge — reference schema (draft). Adjust types and RLS with your security model.
-- Run via Supabase CLI or SQL editor after review.

create extension if not exists "uuid-ossp";

create type public.user_role as enum ('client', 'therapist', 'admin');
create type public.booking_status as enum (
  'requested', 'accepted', 'therapist_preparing', 'en_route',
  'arriving_soon', 'arrived', 'in_session', 'completed', 'cancelled'
);
create type public.location_type as enum ('home', 'hotel', 'office', 'event');
create type public.valet_preference as enum ('yes', 'no', 'not_sure');
create type public.availability_status as enum ('on_duty', 'off_duty', 'busy');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  first_name text not null,
  last_name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.therapist_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  display_name text not null,
  photo_url text,
  bio text,
  years_experience smallint,
  license_number text,
  license_verified boolean not null default false,
  insurance_verified boolean not null default false,
  specialties text[] not null default '{}',
  certifications text[] not null default '{}',
  travel_radius_miles numeric(5,2) not null,
  accepts_home boolean not null default true,
  accepts_hotel boolean not null default true,
  accepts_office boolean not null default false,
  accepts_events boolean not null default false,
  accepts_valet_jobs boolean not null default false,
  availability_status public.availability_status not null default 'off_duty',
  rating_average numeric(3,2) not null default 0,
  rating_count int not null default 0,
  is_approved boolean not null default false,
  active boolean not null default true,
  city text,
  state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_offerings (
  id uuid primary key default uuid_generate_v4(),
  therapist_id uuid not null references public.therapist_profiles (id) on delete cascade,
  name text not null,
  description text,
  duration_options int[] not null,
  pricing_type text not null,
  base_price int not null,
  duration_price_map jsonb not null default '{}',
  add_ons jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles (id),
  therapist_id uuid not null references public.therapist_profiles (id),
  service_name text not null,
  duration_minutes int not null,
  appointment_at timestamptz not null,
  location_type public.location_type not null,
  address_line text not null,
  city text not null,
  state text not null,
  hotel_name text,
  parking_notes text,
  valet_required public.valet_preference not null,
  client_notes text,
  environment_confirmed boolean not null default false,
  status public.booking_status not null default 'requested',
  subtotal int not null,
  travel_fee int not null default 0,
  valet_fee int not null default 0,
  platform_fee int not null default 0,
  total int not null,
  therapist_payout int not null,
  estimated_arrival_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS and add policies per role before production.

alter table public.profiles enable row level security;
alter table public.therapist_profiles enable row level security;
alter table public.service_offerings enable row level security;
alter table public.bookings enable row level security;
