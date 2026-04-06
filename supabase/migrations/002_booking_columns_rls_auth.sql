-- Booking fields, therapist public_id, auth profile trigger, RLS policies.

alter table public.therapist_profiles
  add column if not exists public_id text;

create unique index if not exists therapist_profiles_public_id_key
  on public.therapist_profiles (public_id)
  where public_id is not null;

alter table public.bookings
  add column if not exists space_confirmed boolean not null default false;

alter table public.bookings
  add column if not exists pets_secured_confirmed boolean not null default false;

alter table public.bookings
  add column if not exists quiet_setting_confirmed boolean not null default false;

alter table public.bookings
  add column if not exists clean_surface_confirmed boolean not null default false;

-- Auto-create client profile row (role client) on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, first_name, last_name)
  values (
    new.id,
    'client',
    coalesce(new.raw_user_meta_data->>'first_name', 'Guest'),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS policies (idempotent re-run: drop + create)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "therapist_public_read" on public.therapist_profiles;
create policy "therapist_public_read"
  on public.therapist_profiles for select
  using (is_approved = true and active = true);

drop policy if exists "therapist_owner_all" on public.therapist_profiles;
create policy "therapist_owner_select_self"
  on public.therapist_profiles for select
  using (auth.uid() = user_id);

create policy "therapist_owner_insert"
  on public.therapist_profiles for insert
  with check (auth.uid() = user_id);

create policy "therapist_owner_update"
  on public.therapist_profiles for update
  using (auth.uid() = user_id);

create policy "therapist_owner_delete"
  on public.therapist_profiles for delete
  using (auth.uid() = user_id);

drop policy if exists "offerings_public_read" on public.service_offerings;
create policy "offerings_public_read"
  on public.service_offerings for select
  using (
    exists (
      select 1 from public.therapist_profiles t
      where t.id = therapist_id and t.is_approved and t.active
    )
  );

drop policy if exists "offerings_owner_write" on public.service_offerings;
create policy "offerings_owner_insert"
  on public.service_offerings for insert
  with check (
    exists (
      select 1 from public.therapist_profiles t
      where t.id = therapist_id and t.user_id = auth.uid()
    )
  );

create policy "offerings_owner_update"
  on public.service_offerings for update
  using (
    exists (
      select 1 from public.therapist_profiles t
      where t.id = therapist_id and t.user_id = auth.uid()
    )
  );

create policy "offerings_owner_delete"
  on public.service_offerings for delete
  using (
    exists (
      select 1 from public.therapist_profiles t
      where t.id = therapist_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "bookings_client_select" on public.bookings;
create policy "bookings_client_select"
  on public.bookings for select
  using (client_id = auth.uid());

drop policy if exists "bookings_therapist_select" on public.bookings;
create policy "bookings_therapist_select"
  on public.bookings for select
  using (
    exists (
      select 1 from public.therapist_profiles t
      where t.id = therapist_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "bookings_client_insert" on public.bookings;
create policy "bookings_client_insert"
  on public.bookings for insert
  with check (client_id = auth.uid());

drop policy if exists "bookings_participant_update" on public.bookings;
create policy "bookings_participant_update"
  on public.bookings for update
  using (
    client_id = auth.uid()
    or exists (
      select 1 from public.therapist_profiles t
      where t.id = therapist_id and t.user_id = auth.uid()
    )
  );
