export type GroupRole = "admin" | "member";
export type VoteValue = "yes" | "no" | "maybe";

export type Profile = {
  id: string;
  name: string;
};

export type Group = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
};

export type GroupMember = {
  user_id: string;
  group_id: string;
  role: GroupRole;
  joined_at: string;
  profiles?: Profile | null;
};

export type Event = {
  id: string;
  group_id: string;
  title: string;
  event_at: string;
  location: string | null;
  description: string | null;
  notes: string | null;
  recurrence_series_id: string | null;
  recurrence_frequency: "none" | "daily" | "weekly" | "weekly_custom" | "monthly";
  recurrence_interval: number;
  recurrence_weekdays: number[] | null;
  recurrence_end_type: "never" | "on_date";
  recurrence_until_date: string | null;
  created_by: string;
  created_at: string;
};

export type Invite = {
  id: string;
  group_id: string;
  token: string;
  expires_at: string | null;
  created_by: string;
  created_at: string;
};

export type Vote = {
  user_id: string;
  event_id: string;
  vote: VoteValue;
  updated_at: string;
  profiles?: Profile | null;
};
