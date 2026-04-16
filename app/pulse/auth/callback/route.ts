import { NextResponse } from "next/server";

import { ensurePulsePath } from "@pulse/lib/routing";
import { createClient } from "@pulse/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = ensurePulsePath(searchParams.get("next"));

  if (!code) return NextResponse.redirect(new URL("/pulse/login", origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return NextResponse.redirect(new URL("/pulse/login", origin));

  return NextResponse.redirect(new URL(nextPath, origin));
}
