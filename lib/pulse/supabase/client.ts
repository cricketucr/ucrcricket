"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@pulse/lib/supabase/env";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
