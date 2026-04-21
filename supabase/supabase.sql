create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  user_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  role text not null check (role in ('admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (user_id, group_id)
);

create table if not exists public.group_membership_history (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null check (action in ('joined', 'kicked')),
  acted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.invites
  alter column expires_at drop not null;

create table if not exists public.group_join_requests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  event_at timestamptz not null,
  location text,
  description text,
  notes text,
  recurrence_series_id uuid,
  recurrence_frequency text not null default 'none' check (recurrence_frequency in ('none', 'daily', 'weekly', 'weekly_custom', 'monthly')),
  recurrence_interval integer not null default 1 check (recurrence_interval > 0),
  recurrence_weekdays smallint[],
  recurrence_end_type text not null default 'never' check (recurrence_end_type in ('never', 'on_date')),
  recurrence_until_date date,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.events
  add column if not exists recurrence_series_id uuid,
  add column if not exists recurrence_frequency text not null default 'none',
  add column if not exists recurrence_interval integer not null default 1,
  add column if not exists recurrence_weekdays smallint[],
  add column if not exists recurrence_end_type text not null default 'never',
  add column if not exists recurrence_until_date date;

alter table public.events
  drop constraint if exists events_recurrence_frequency_check,
  add constraint events_recurrence_frequency_check check (recurrence_frequency in ('none', 'daily', 'weekly', 'weekly_custom', 'monthly'));

alter table public.events
  drop constraint if exists events_recurrence_interval_check,
  add constraint events_recurrence_interval_check check (recurrence_interval > 0);

alter table public.events
  drop constraint if exists events_recurrence_end_type_check,
  add constraint events_recurrence_end_type_check check (recurrence_end_type in ('never', 'on_date'));

create index if not exists idx_events_group_series_event_at
  on public.events(group_id, recurrence_series_id, event_at);

create table if not exists public.votes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  vote text not null check (vote in ('yes', 'no', 'maybe')),
  updated_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

create index if not exists idx_group_members_group on public.group_members(group_id);
create index if not exists idx_membership_history_group_user_time
  on public.group_membership_history(group_id, user_id, created_at);
create index if not exists idx_events_group_event_at on public.events(group_id, event_at);
create index if not exists idx_votes_event on public.votes(event_id);
create index if not exists idx_invites_token on public.invites(token);
create index if not exists idx_invites_group on public.invites(group_id);
create index if not exists idx_group_join_requests_group_status_created
  on public.group_join_requests(group_id, status, created_at);
create index if not exists idx_group_join_requests_user_group_status
  on public.group_join_requests(user_id, group_id, status);
create unique index if not exists idx_group_join_requests_unique_pending
  on public.group_join_requests(group_id, user_id)
  where status = 'pending';

create or replace function public.set_vote_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists remove_votes_for_removed_member on public.group_members;
drop function if exists public.remove_votes_for_removed_member();

drop trigger if exists set_vote_updated_at on public.votes;
create trigger set_vote_updated_at
before update on public.votes
for each row execute function public.set_vote_updated_at();

create or replace function public.is_group_member(
  target_group_id uuid,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group_id
      and gm.user_id = target_user_id
  );
$$;

create or replace function public.is_group_admin(
  target_group_id uuid,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group_id
      and gm.user_id = target_user_id
      and gm.role = 'admin'
  );
$$;

create or replace function public.is_group_creator(
  target_group_id uuid,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.groups g
    where g.id = target_group_id
      and g.created_by = target_user_id
  );
$$;

create or replace function public.can_vote_on_event(
  target_event_id uuid,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.events e
    join public.group_members gm on gm.group_id = e.group_id
    where e.id = target_event_id
      and gm.user_id = target_user_id
      and e.event_at > now()
  );
$$;

create or replace function public.create_group_with_admin(group_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_group_id uuid;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if group_name is null or char_length(trim(group_name)) = 0 then
    raise exception 'Group name is required';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = current_user_id
  ) then
    raise exception 'Profile must exist before creating a group';
  end if;

  insert into public.groups (name, created_by)
  values (trim(group_name), current_user_id)
  returning id into new_group_id;

  insert into public.group_members (user_id, group_id, role)
  values (current_user_id, new_group_id, 'admin')
  on conflict (user_id, group_id) do nothing;

  insert into public.group_membership_history (group_id, user_id, action, acted_by)
  values (new_group_id, current_user_id, 'joined', current_user_id);

  return new_group_id;
end;
$$;

revoke all on function public.create_group_with_admin(text) from public;
grant execute on function public.create_group_with_admin(text) to authenticated;

create or replace function public.get_invite_preview(invite_token text)
returns table (
  invite_id uuid,
  group_id uuid,
  group_name text,
  expires_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    i.id as invite_id,
    i.group_id,
    g.name as group_name,
    i.expires_at
  from public.invites i
  join public.groups g on g.id = i.group_id
  where i.token = invite_token
  limit 1;
$$;

revoke all on function public.get_invite_preview(text) from public;
grant execute on function public.get_invite_preview(text) to authenticated;

create or replace function public.join_group_from_invite(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group_id uuid;
  invite_expiry timestamptz;
  current_user_id uuid := auth.uid();
  was_member boolean := false;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select i.group_id, i.expires_at
  into target_group_id, invite_expiry
  from public.invites i
  where i.token = invite_token
  limit 1;

  if target_group_id is null then
    raise exception 'Invite is invalid';
  end if;

  if invite_expiry is not null and invite_expiry <= now() then
    raise exception 'Invite has expired';
  end if;

  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group_id
      and gm.user_id = current_user_id
  ) into was_member;

  insert into public.group_members (user_id, group_id, role)
  values (current_user_id, target_group_id, 'member')
  on conflict (user_id, group_id) do update
    set role = case
      when public.group_members.role = 'admin' then 'admin'
      else 'member'
    end;

  if not was_member then
    insert into public.group_membership_history (group_id, user_id, action, acted_by)
    values (target_group_id, current_user_id, 'joined', current_user_id);
  end if;

  return target_group_id;
end;
$$;

revoke all on function public.join_group_from_invite(text) from public;
grant execute on function public.join_group_from_invite(text) to authenticated;

create or replace function public.remove_member_from_group(
  target_group_id uuid,
  target_member_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  deleted_count integer := 0;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_group_admin(target_group_id, current_user_id) then
    raise exception 'Admin access required';
  end if;

  if target_member_id = current_user_id then
    raise exception 'Admins cannot remove themselves';
  end if;

  delete from public.group_members gm
  where gm.group_id = target_group_id
    and gm.user_id = target_member_id;

  get diagnostics deleted_count = row_count;

  if deleted_count > 0 then
    insert into public.group_membership_history (group_id, user_id, action, acted_by)
    values (target_group_id, target_member_id, 'kicked', current_user_id);
  end if;
end;
$$;

revoke all on function public.remove_member_from_group(uuid, uuid) from public;
grant execute on function public.remove_member_from_group(uuid, uuid) to authenticated;

create or replace function public.set_group_member_role(
  target_group_id uuid,
  target_member_id uuid,
  new_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_target_role text;
  admin_count integer;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if new_role is null or new_role not in ('admin', 'member') then
    raise exception 'Invalid role';
  end if;

  if not public.is_group_admin(target_group_id, current_user_id) then
    raise exception 'Admin access required';
  end if;

  if target_member_id = current_user_id then
    raise exception 'You cannot change your own role';
  end if;

  select gm.role into current_target_role
  from public.group_members gm
  where gm.group_id = target_group_id
    and gm.user_id = target_member_id;

  if current_target_role is null then
    raise exception 'User is not a member of this group';
  end if;

  if current_target_role = new_role then
    return;
  end if;

  if new_role = 'member' and current_target_role = 'admin' then
    select count(*)::integer into admin_count
    from public.group_members
    where group_id = target_group_id
      and role = 'admin';

    if admin_count <= 1 then
      raise exception 'Cannot remove the last admin';
    end if;
  end if;

  update public.group_members
  set role = new_role
  where group_id = target_group_id
    and user_id = target_member_id;
end;
$$;

revoke all on function public.set_group_member_role(uuid, uuid, text) from public;
grant execute on function public.set_group_member_role(uuid, uuid, text) to authenticated;

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_membership_history enable row level security;
alter table public.invites enable row level security;
alter table public.group_join_requests enable row level security;
alter table public.events enable row level security;
alter table public.votes enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "groups_select_member" on public.groups;
create policy "groups_select_member"
on public.groups
for select
to authenticated
using (public.is_group_member(id));

drop policy if exists "groups_select_authenticated" on public.groups;
create policy "groups_select_authenticated"
on public.groups
for select
to authenticated
using (true);

drop policy if exists "groups_insert_creator" on public.groups;
create policy "groups_insert_creator"
on public.groups
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "groups_update_admin" on public.groups;
create policy "groups_update_admin"
on public.groups
for update
to authenticated
using (public.is_group_admin(id));

drop policy if exists "groups_delete_admin" on public.groups;
create policy "groups_delete_admin"
on public.groups
for delete
to authenticated
using (public.is_group_admin(id));

drop policy if exists "group_members_select_same_group" on public.group_members;
create policy "group_members_select_same_group"
on public.group_members
for select
to authenticated
using (public.is_group_member(group_id));

drop policy if exists "group_members_insert_self" on public.group_members;
create policy "group_members_insert_self"
on public.group_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    role = 'member'
    or (
      role = 'admin'
      and public.is_group_creator(group_id)
    )
  )
);

drop policy if exists "group_members_delete_admin" on public.group_members;
create policy "group_members_delete_admin"
on public.group_members
for delete
to authenticated
using (public.is_group_admin(group_id));

drop policy if exists "membership_history_select_same_group" on public.group_membership_history;
create policy "membership_history_select_same_group"
on public.group_membership_history
for select
to authenticated
using (public.is_group_member(group_id));

drop policy if exists "invites_select_member" on public.invites;
create policy "invites_select_member"
on public.invites
for select
to authenticated
using (public.is_group_member(group_id));

drop policy if exists "invites_insert_admin" on public.invites;
create policy "invites_insert_admin"
on public.invites
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.is_group_admin(group_id)
);

drop policy if exists "invites_delete_admin" on public.invites;
create policy "invites_delete_admin"
on public.invites
for delete
to authenticated
using (public.is_group_admin(group_id));

drop policy if exists "group_join_requests_select_admin_or_self" on public.group_join_requests;
create policy "group_join_requests_select_admin_or_self"
on public.group_join_requests
for select
to authenticated
using (
  public.is_group_admin(group_id)
  or user_id = auth.uid()
);

drop policy if exists "group_join_requests_insert_self_pending" on public.group_join_requests;
create policy "group_join_requests_insert_self_pending"
on public.group_join_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and not public.is_group_member(group_id)
);

drop policy if exists "group_join_requests_update_admin" on public.group_join_requests;
create policy "group_join_requests_update_admin"
on public.group_join_requests
for update
to authenticated
using (public.is_group_admin(group_id))
with check (public.is_group_admin(group_id));

drop policy if exists "events_select_member" on public.events;
create policy "events_select_member"
on public.events
for select
to authenticated
using (public.is_group_member(group_id));

drop policy if exists "events_insert_admin" on public.events;
create policy "events_insert_admin"
on public.events
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.is_group_admin(group_id)
);

drop policy if exists "events_update_admin" on public.events;
create policy "events_update_admin"
on public.events
for update
to authenticated
using (public.is_group_admin(group_id))
with check (public.is_group_admin(group_id));

drop policy if exists "events_delete_admin" on public.events;
create policy "events_delete_admin"
on public.events
for delete
to authenticated
using (public.is_group_admin(group_id));

drop policy if exists "votes_select_member" on public.votes;
create policy "votes_select_member"
on public.votes
for select
to authenticated
using (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and public.is_group_member(e.group_id)
  )
);

drop policy if exists "votes_insert_own_open_event" on public.votes;
create policy "votes_insert_own_open_event"
on public.votes
for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.can_vote_on_event(event_id)
);

drop policy if exists "votes_update_own_open_event" on public.votes;
create policy "votes_update_own_open_event"
on public.votes
for update
to authenticated
using (
  user_id = auth.uid()
  and public.can_vote_on_event(event_id)
)
with check (
  user_id = auth.uid()
  and public.can_vote_on_event(event_id)
);

drop policy if exists "votes_delete_own_open_event" on public.votes;
create policy "votes_delete_own_open_event"
on public.votes
for delete
to authenticated
using (
  user_id = auth.uid()
  and public.can_vote_on_event(event_id)
);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'events'
  ) then
    alter publication supabase_realtime add table public.events;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'votes'
  ) then
    alter publication supabase_realtime add table public.votes;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'group_members'
  ) then
    alter publication supabase_realtime add table public.group_members;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'group_membership_history'
  ) then
    alter publication supabase_realtime add table public.group_membership_history;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'invites'
  ) then
    alter publication supabase_realtime add table public.invites;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'group_join_requests'
  ) then
    alter publication supabase_realtime add table public.group_join_requests;
  end if;
end;
$$;
