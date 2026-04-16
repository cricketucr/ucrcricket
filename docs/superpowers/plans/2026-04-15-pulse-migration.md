# Pulse Migration Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` to implement task-by-task.

**Goal:** Convert ucrcricket from Vite to Next.js 16 and embed Pulse at `/pulse/*` as a unified single-deployment application styled to match ucrcricket's dark amber theme.

**Architecture:** Single Next.js 16 App Router deployment. Cricket pages live under `app/(cricket)/`. Pulse pages live under `app/pulse/`. A `@pulse/` TypeScript alias scopes all Pulse imports. `middleware.ts` calls Pulse's `updateSession` only for `/pulse/*` requests.

**Tech Stack:** Next.js 16.2.3, React 19.2.4, TypeScript 5, Tailwind CSS v4, Supabase SSR, lucide-react

**Constraints:**
- All work on branch `migration-test` — never touch `main`
- Never modify `/cricket/Pulse/` — only the copy inside ucrcricket may be adapted
- Source code for ucrcricket pages is only in git commit `0685f17` (a spec commit accidentally deleted the working tree)

---

## Task 1 — Create migration-test branch

- [ ] Run from inside `ucrcricket/`:
  ```bash
  git checkout -b migration-test
  ```

---

## Task 2 — Bootstrap Next.js project

Replace all Vite config files. Run from `ucrcricket/`.

- [ ] Delete Vite artifacts: `rm -f vite.config.js vite.config.ts index.html vercel.json`
- [ ] Write `package.json`:

```json
{
  "name": "ucr-cricket",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.10.2",
    "@supabase/supabase-js": "^2.103.0",
    "lucide-react": "^0.545.0",
    "next": "16.2.3",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.3",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

- [ ] Write `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@pulse/components/*": ["./components/pulse/*"],
      "@pulse/lib/*": ["./lib/pulse/*"],
      "@pulse/app/*": ["./app/pulse/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] Write `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] Write `postcss.config.mjs`:

```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] Write `app/globals.css`:

```css
@import "tailwindcss";

body {
  background-color: #020617;
  color: white;
}
```

- [ ] Run `npm install`

---

## Task 3 — Extract SVG + create layout files

- [ ] Extract SVG from git:
  ```bash
  git show 0685f17:src/assets/ucrcricket.svg > public/ucrcricket.svg
  ```

- [ ] Write `components/navigation.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const pages = ["home", "roster", "coaching", "timeline", "sponsor", "contact"] as const;

function getHref(page: string) {
  return page === "home" ? "/" : `/${page}`;
}

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(page: string) {
    if (page === "home") return pathname === "/";
    return pathname === `/${page}`;
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/ucrcricket.svg"
              alt="UCR Cricket"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">UCR Cricket</h1>
              <p className="text-xs text-amber-500">Excellence in Sport</p>
            </div>
          </Link>

          <div className="hidden md:flex space-x-1">
            {pages.map((page) => (
              <Link
                key={page}
                href={getHref(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(page)
                    ? "bg-amber-500 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {pages.map((page) => (
              <Link
                key={page}
                href={getHref(page)}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(page)
                    ? "bg-amber-500 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
```

- [ ] Write `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UCR Cricket",
  description: "UCR Cricket Club",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] Write `app/(cricket)/layout.tsx`:

```tsx
import { Instagram } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function CricketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      {children}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <a
                href="https://www.instagram.com/ucrcricket/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full hover:bg-amber-500 text-slate-400 hover:text-slate-900 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="mb-2 text-slate-400">© 2025 UCR Cricket. All rights reserved.</p>
            <p className="text-sm text-slate-500">Building champions on and off the field</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

## Task 4 — Port ucrcricket pages

- [ ] Write `app/(cricket)/page.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { Users, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
          <div className="text-center">
            <div className="inline-block mb-6">
              <Image
                src="/ucrcricket.svg"
                alt="UCR Cricket"
                width={160}
                height={160}
                className="rounded-full mx-auto w-24 h-24 md:w-40 md:h-40"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-amber-500">UCR</span> Cricket
            </h1>
            <p className="text-base md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto px-4">
              Building champions on and off the pitch through dedication, teamwork, and excellence
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Link
                href="/roster"
                className="bg-amber-500 text-slate-900 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-all"
              >
                Meet The Team
              </Link>
              <Link
                href="/sponsor"
                className="bg-slate-800 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all border border-slate-700"
              >
                Support Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            { label: "Active Players", value: "15", icon: Users },
            { label: "Year(s) Active", value: "1", icon: Clock },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
              <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Leadership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Khrish Patel", role: "Captain" },
            { name: "Tarun Vadapalli", role: "Vice Captain" },
            { name: "Siddharth Thatavarthy", role: "Secretary" },
            { name: "Jia Panchal", role: "Team Manager" },
            { name: "Advaith Tontalapur", role: "Developer/Photographer" },
            { name: "Hiya Patel", role: "Social Media Manager" },
            { name: "YogaShikhar Marella", role: "Editor" },
          ].map((leader, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-amber-500 transition-all">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                👤
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">{leader.name}</h3>
              <p className="text-amber-500 font-medium text-sm md:text-base">{leader.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] Write `app/(cricket)/roster/page.tsx`:

```tsx
export default function RosterPage() {
  const allPlayers = [
    { name: "Khrish Patel", role: "Captain- Batsman / Wicket Keeper" },
    { name: "Tarun Vadapalli", role: "Vice Captain- All-Rounder" },
    { name: "Abhi Tatavarty", role: "Batsman" },
    { name: "Siddharth Thatavarthy", role: "All-Rounder" },
    { name: "Ilhaan Abdullah", role: "All-Rounder Batsman" },
    { name: "Himanshu Rao", role: "All Rounder Batsman" },
    { name: "Muhammad Hassan", role: "All Rounder Bowler" },
    { name: "Shriyansh Annam", role: "Bowler" },
    { name: "Dev Bhakta", role: "Bowler" },
    { name: "Yash Samineni", role: "All Rounder" },
    { name: "Khush Patel", role: "Bowler" },
    { name: "Kush Prajapati", role: "Bowler" },
    { name: "Sathvik Kumar", role: "All-Rounder" },
    { name: "Vishv Mepani", role: "Batsman" },
    { name: "Arslan Sheik", role: "Bowler" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Team Roster</h1>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {allPlayers.map((player, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-8 md:p-10 text-center hover:border-amber-500 transition-all">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl md:text-5xl mb-6 mx-auto">
                  👤
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{player.name}</h3>
                <p className="text-amber-500 font-semibold text-sm md:text-base leading-relaxed">{player.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] Write `app/(cricket)/coaching/page.tsx`:

```tsx
export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Coaching Staff</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Yash Patel", role: "Fast Bowler", spec: "Bowling & Strategy" },
            { name: "Arjun M", role: "Gymnast", spec: "Fitness & Agility" },
          ].map((coach, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{coach.name}</h3>
                  <p className="text-amber-500 font-semibold mb-3 text-sm md:text-base">{coach.role}</p>
                  <div className="text-sm text-slate-400">
                    <span className="font-medium">Specialty:</span> {coach.spec}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] Write `app/(cricket)/timeline/page.tsx`:

```tsx
export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Our Journey</h1>
        <div className="relative">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-slate-800" />
          <div className="space-y-8 md:space-y-12">
            {[
              { year: "2025", title: "Foundation", desc: "Cricket club established with 12 founding members" },
              { year: "2025", title: "Squad Formed", desc: "Assembled first official team roster with 15 players" },
            ].map((event, idx) => (
              <div key={idx} className="relative pl-16 md:pl-20">
                <div className="absolute left-0 w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-900 font-bold text-xs md:text-base">{event.year}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] Write `app/(cricket)/sponsor/page.tsx`:

```tsx
export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Support Our Team</h1>
        <p className="text-sm md:text-base text-slate-400 text-center mb-12 max-w-2xl mx-auto px-4">
          Your contribution helps us maintain facilities, purchase equipment, and provide opportunities for our athletes to excel
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-8 flex justify-center">
          <iframe
            src="https://www.gofundme.com/f/support-college-cricket-at-ucr/widget/large"
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] Write `app/(cricket)/contact/page.tsx`:

```tsx
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Contact Us</h1>
        <p className="text-sm md:text-base text-slate-400 text-center mb-12 max-w-2xl mx-auto px-4">
          Have questions or want to get in touch with the UCR Cricket team? We&apos;d love to hear from you
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-amber-500 mb-6">Contact Form</h2>
          <div className="flex justify-center overflow-x-auto">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScI3QGPJUwG7ErDh9FS39pt1reJcRtawk4s3HLU7fT0Zd3vwg/viewform?embedded=true"
              width="100%"
              height="824"
              frameBorder="0"
              className="border-none rounded-lg max-w-full"
              style={{ minWidth: "320px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Task 5 — Copy Pulse pure utility libs (verbatim)

Run from `ucrcricket/`:

```bash
mkdir -p lib/pulse/hooks
cp ../Pulse/lib/types.ts lib/pulse/types.ts
cp ../Pulse/lib/events.ts lib/pulse/events.ts
cp ../Pulse/lib/utils.ts lib/pulse/utils.ts
cp ../Pulse/lib/hooks/use-optimistic-action.ts lib/pulse/hooks/use-optimistic-action.ts
```

No changes needed — these files have zero internal imports.

---

## Task 6 — Copy Pulse Supabase libs (alias update)

```bash
mkdir -p lib/pulse/supabase
cp ../Pulse/lib/supabase/env.ts lib/pulse/supabase/env.ts
```

- [ ] Write `lib/pulse/supabase/client.ts` (`@/lib/supabase/env` → `@pulse/lib/supabase/env`):

```ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@pulse/lib/supabase/env";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
```

- [ ] Write `lib/pulse/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "@pulse/lib/supabase/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });
}
```

- [ ] Write `lib/pulse/supabase/middleware.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@pulse/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
```

---

## Task 7 — Copy Pulse auth libs (alias + /pulse/ paths)

```bash
mkdir -p lib/pulse/auth
```

- [ ] Write `lib/pulse/auth/session.ts`:

```ts
import { redirect } from "next/navigation";

import { createClient } from "@pulse/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(redirectTo = "/pulse/login") {
  const user = await getSessionUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

export async function requireProfile(userId: string) {
  const profile = await getProfile(userId);
  if (!profile?.name) {
    redirect("/pulse/profile");
  }
  return profile;
}
```

- [ ] Write `lib/pulse/auth/group-access.ts`:

```ts
import { redirect } from "next/navigation";

import { createClient } from "@pulse/lib/supabase/server";

export async function requireGroupMembership(groupId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle<{ role: "admin" | "member" }>();

  if (!data) {
    redirect("/pulse/dashboard?reason=not-group-member");
  }
  return data;
}

export async function requireGroupAdmin(groupId: string, userId: string) {
  const membership = await requireGroupMembership(groupId, userId);
  if (membership.role !== "admin") {
    redirect(`/pulse/groups/${groupId}`);
  }
  return membership;
}
```

---

## Task 8 — Copy Pulse db queries (alias update)

```bash
mkdir -p lib/pulse/db
```

- [ ] Write `lib/pulse/db/queries.ts` — copy `../Pulse/lib/db/queries.ts` and replace every `@/` with the `@pulse/` equivalent:
  - `@/lib/supabase/server` → `@pulse/lib/supabase/server`
  - `@/lib/types` → `@pulse/lib/types`
  - `@/lib/events` → `@pulse/lib/events`

```ts
import { createClient } from "@pulse/lib/supabase/server";
import type { GroupMember, VoteValue } from "@pulse/lib/types";
import { isEventLockedAt } from "@pulse/lib/events";
```

*(remainder of file is identical to `../Pulse/lib/db/queries.ts`)*

---

## Task 9 — Copy + restyle Pulse UI components

```bash
mkdir -p components/pulse/ui
cp ../Pulse/components/ui/timed-toast.tsx components/pulse/ui/timed-toast.tsx
```

`timed-toast.tsx` — verbatim copy, no changes (already uses amber).

- [ ] Write `components/pulse/ui/button.tsx` (alias + amber primary theme):

```tsx
import { cn } from "@pulse/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-amber-500 text-slate-900 hover:bg-amber-400 active:bg-amber-600 focus-visible:ring-amber-400",
  secondary:
    "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 active:bg-slate-600 focus-visible:ring-slate-500",
  ghost: "text-slate-300 hover:bg-slate-800 active:bg-slate-700 focus-visible:ring-slate-500",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-400",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] Write `components/pulse/ui/card.tsx`:

```tsx
import { cn } from "@pulse/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] Write `components/pulse/ui/input.tsx`:

```tsx
import { cn } from "@pulse/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-700",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] Write `components/pulse/ui/badge.tsx`:

```tsx
import { cn } from "@pulse/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger";
};

const VARIANT_STYLES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-slate-800 text-slate-300",
  success: "bg-emerald-900/60 text-emerald-400",
  warning: "bg-amber-900/60 text-amber-400",
  danger: "bg-red-900/60 text-red-400",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] Write `components/pulse/ui/modal.tsx`:

```tsx
"use client";

import { createContext, useContext, useState } from "react";

import { Button } from "@pulse/components/ui/button";
import { cn } from "@pulse/lib/utils";

type ModalProps = {
  title: string;
  triggerLabel: string;
  children: React.ReactNode;
  triggerClassName?: string;
};

type ModalControls = { closeModal: () => void };

const ModalContext = createContext<ModalControls | null>(null);

export function useModalControls() {
  return useContext(ModalContext);
}

export function Modal({ title, triggerLabel, children, triggerClassName }: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <button
                className={cn(
                  "cursor-pointer rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95 active:bg-slate-700",
                )}
                onClick={() => setOpen(false)}
                type="button"
                aria-label="Close modal"
              >
                X
              </button>
            </div>
            <ModalContext.Provider value={{ closeModal: () => setOpen(false) }}>
              <div>{children}</div>
            </ModalContext.Provider>
          </div>
        </div>
      ) : null}
    </>
  );
}
```

---

## Task 10 — Top-nav + dashboard components

```bash
mkdir -p components/pulse/dashboard
```

- [ ] Write `components/pulse/top-nav.tsx` (alias + `/pulse/` paths + dark theme):

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { signOut } from "@pulse/app/actions/auth";
import { Button } from "@pulse/components/ui/button";

type TopNavProps = {
  name: string;
  showDashboardButton?: boolean;
};

export function TopNav({ name, showDashboardButton = false }: TopNavProps) {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/pulse/dashboard");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (profileMenuRef.current.contains(event.target as Node)) return;
      setIsProfileMenuOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-3 items-center px-4 py-3">
        <div className="justify-self-start">
          {showDashboardButton ? (
            <Button
              variant="secondary"
              type="button"
              className="max-w-28 gap-1 sm:max-w-none"
              onClick={handleBack}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
                <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="block truncate whitespace-nowrap">Back</span>
            </Button>
          ) : null}
        </div>

        <Link
          href="/pulse/dashboard"
          className="justify-self-center rounded-md px-2 py-1 text-sm font-semibold text-amber-500 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Go to dashboard"
        >
          Pulse
        </Link>

        <div className="relative justify-self-end" ref={profileMenuRef}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((current) => !current)}
          >
            <span className="max-w-32 truncate">{name}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
            >
              <path d="M5 7.5L10 12.5l5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isProfileMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-40 rounded-md border border-slate-800 bg-slate-900 p-1 shadow-lg"
            >
              <Link
                href="/pulse/settings"
                role="menuitem"
                className="block rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Settings
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  role="menuitem"
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
```

- [ ] Write `components/pulse/dashboard/group-link-card.tsx`:

```tsx
"use client";

import Link from "next/link";

import { Badge } from "@pulse/components/ui/badge";
import { Card } from "@pulse/components/ui/card";

type GroupLinkCardProps = {
  groupId: string;
  groupName: string;
  role: string;
};

export function GroupLinkCard({ groupId, groupName, role }: GroupLinkCardProps) {
  return (
    <Link
      href={`/pulse/groups/${groupId}`}
      className="block rounded-md text-left transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <Card className="h-full space-y-2 transition hover:border-slate-700">
        <p className="text-base font-semibold text-white">{groupName}</p>
        <Badge variant={role === "admin" ? "success" : "default"}>{role}</Badge>
      </Card>
    </Link>
  );
}
```

- [ ] Write `components/pulse/dashboard/new-group-modal.tsx`:

```tsx
"use client";

import { useFormStatus } from "react-dom";

import { createGroup } from "@pulse/app/actions/groups";
import { Button } from "@pulse/components/ui/button";
import { Input } from "@pulse/components/ui/input";
import { Modal } from "@pulse/components/ui/modal";

function CreateGroupSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Creating..." : "Create"}
    </Button>
  );
}

export function NewGroupModal() {
  return (
    <Modal title="New group" triggerLabel="New Group">
      <form action={createGroup} className="space-y-3">
        <div>
          <label htmlFor="new-group-name" className="mb-1 block text-sm font-medium text-slate-300">
            Group name
          </label>
          <Input
            id="new-group-name"
            name="name"
            placeholder="e.g. Weekend team"
            maxLength={120}
            required
          />
        </div>
        <CreateGroupSubmitButton />
      </form>
    </Modal>
  );
}
```

---

## Task 11 — Group components

```bash
mkdir -p components/pulse/group
```

- [ ] Write `components/pulse/group/group-realtime-sync.tsx` (alias only):

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@pulse/lib/supabase/client";
```

*(remainder identical to `../Pulse/components/group/group-realtime-sync.tsx`)*

- [ ] Write `components/pulse/group/delete-group-form.tsx` (alias + path):

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteGroup } from "@pulse/app/actions/groups";
import { Button } from "@pulse/components/ui/button";
import { Input } from "@pulse/components/ui/input";

type DeleteGroupFormProps = { groupId: string };

export function DeleteGroupForm({ groupId }: DeleteGroupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deleteGroup(formData);
        router.push("/pulse/dashboard");
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not delete group.";
        setErrorMessage(message);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <input type="hidden" name="groupId" value={groupId} />
      <label className="block text-sm font-medium text-slate-300" htmlFor="delete-confirm">
        Type <span className="font-mono text-white">DELETE</span> to confirm
      </label>
      <Input id="delete-confirm" name="confirm" autoComplete="off" placeholder="DELETE" disabled={isPending} />
      {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
      <Button type="submit" variant="danger" className="w-full sm:w-auto" disabled={isPending}>
        {isPending ? "Deleting…" : "Delete group"}
      </Button>
    </form>
  );
}
```

- [ ] Write `components/pulse/group/member-list.tsx` (alias + theme):

```tsx
"use client";

import { useEffect, useState } from "react";

import { removeMember, updateMemberRole } from "@pulse/app/actions/members";
import { Badge } from "@pulse/components/ui/badge";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";

type MemberListProps = {
  groupId: string;
  currentUserId: string;
  isAdmin: boolean;
  showKickControls?: boolean;
  members: Array<{
    user_id: string;
    role: "admin" | "member";
    profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
  }>;
};

export function MemberList({ groupId, currentUserId, isAdmin, showKickControls = true, members }: MemberListProps) {
  const [optimisticMembers, setOptimisticMembers] = useState(members);
  const optimisticAction = useOptimisticAction();

  useEffect(() => { setOptimisticMembers(members); }, [members]);

  const onRoleChange = (memberId: string, role: "admin" | "member") => {
    const previousMembers = optimisticMembers;
    optimisticAction.runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticMembers((current) =>
          current.map((member) => (member.user_id === memberId ? { ...member, role } : member)),
        );
        return previousMembers;
      },
      rollback: (state) => setOptimisticMembers(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("memberId", memberId);
        formData.set("role", role);
        await updateMemberRole(formData);
      },
      onErrorMessage: "Could not update member role. Reverted.",
    });
  };

  const onKick = (memberId: string) => {
    const previousMembers = optimisticMembers;
    optimisticAction.runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticMembers((current) => current.filter((member) => member.user_id !== memberId));
        return previousMembers;
      },
      rollback: (state) => setOptimisticMembers(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("memberId", memberId);
        await removeMember(formData);
      },
      onErrorMessage: "Could not remove member. Reverted.",
    });
  };

  return (
    <Card className="space-y-3">
      <h2 className="text-base font-semibold text-white">Members</h2>
      {optimisticAction.errorMessage ? (
        <p className="text-sm text-red-400">{optimisticAction.errorMessage}</p>
      ) : null}
      <div className="space-y-2">
        {optimisticMembers.map((member) => {
          const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
          return (
            <div
              key={member.user_id}
              className="flex flex-col gap-2 rounded-md border border-slate-800 p-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <p className="text-sm text-white">{profile?.name ?? "Unnamed user"}</p>
                <Badge variant={member.role === "admin" ? "success" : "default"}>{member.role}</Badge>
              </div>
              {isAdmin && showKickControls && member.user_id !== currentUserId ? (
                <div className="flex flex-wrap items-center gap-2">
                  {member.role === "member" ? (
                    <form onSubmit={(e) => { e.preventDefault(); onRoleChange(member.user_id, "admin"); }}>
                      <Button type="submit" variant="secondary">Make admin</Button>
                    </form>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); onRoleChange(member.user_id, "member"); }}>
                      <Button type="submit" variant="secondary">Make member</Button>
                    </form>
                  )}
                  <form onSubmit={(e) => { e.preventDefault(); onKick(member.user_id); }}>
                    <Button type="submit" variant="ghost">Kick</Button>
                  </form>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

- [ ] Write `components/pulse/group/invite-panel.tsx` (alias + `/pulse/invite/` path + dark theme):

Copy `../Pulse/components/group/invite-panel.tsx` with these changes:
1. All `@/` imports → `@pulse/`
2. `${appUrl}/invite/${invite.token}` → `${appUrl}/pulse/invite/${invite.token}`
3. `/invite/${invite.token}` → `/pulse/invite/${invite.token}`
4. Theme: zinc text/border/bg → slate equivalents (same pattern as other components)

```tsx
"use client";

import { useEffect, useState } from "react";

import { createInvite, deleteInvite } from "@pulse/app/actions/invites";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";

type InvitePanelProps = {
  groupId: string;
  isAdmin: boolean;
  invites: Array<{ id: string; token: string; expires_at: string | null }>;
};

export function InvitePanel({ groupId, isAdmin, invites }: InvitePanelProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);
  const [optimisticInvites, setOptimisticInvites] = useState(invites);
  const { isPending, errorMessage, setErrorMessage, runOptimisticAction } = useOptimisticAction();

  useEffect(() => { setOptimisticInvites(invites); }, [invites]);

  const copyInviteLink = async (inviteId: string, inviteUrl: string) => {
    if (!navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedInviteId(inviteId);
      window.setTimeout(() => {
        setCopiedInviteId((current) => (current === inviteId ? null : current));
      }, 1500);
    } catch {
      setCopiedInviteId(null);
    }
  };

  const onCreateInvite = (formData: FormData) => {
    setErrorMessage(null);
    runOptimisticAction({
      applyOptimistic: () => null,
      rollback: () => {},
      action: async () => { await createInvite(formData); },
      onErrorMessage: "Could not create invite. Please try again.",
    });
  };

  const onInvalidateInvite = (inviteId: string) => {
    const previousInvites = optimisticInvites;
    runOptimisticAction({
      applyOptimistic: () => {
        setOptimisticInvites((current) => current.filter((invite) => invite.id !== inviteId));
        return previousInvites;
      },
      rollback: (state) => setOptimisticInvites(state),
      action: async () => {
        const formData = new FormData();
        formData.set("groupId", groupId);
        formData.set("inviteId", inviteId);
        await deleteInvite(formData);
      },
      onErrorMessage: "Could not invalidate invite. Reverted.",
    });
  };

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-white">Invite links</h2>
        <p className="text-sm text-slate-400">Share links so teammates can join this group.</p>
      </div>

      {isAdmin ? (
        <form action={onCreateInvite} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <input type="hidden" name="groupId" value={groupId} />
          <div className="w-full sm:max-w-32">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400" htmlFor="expiresInOption">
              Expires in
            </label>
            <select
              id="expiresInOption"
              name="expiresInOption"
              defaultValue="7d"
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-700"
            >
              <option value="1d">1 day</option>
              <option value="3d">3 days</option>
              <option value="7d">7 days</option>
              <option value="14d">14 days</option>
              <option value="30d">30 days</option>
              <option value="never">Never</option>
            </select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create invite"}
          </Button>
        </form>
      ) : null}
      {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

      <div className="space-y-2">
        {optimisticInvites.length === 0 ? (
          <p className="text-sm text-slate-500">No active invites.</p>
        ) : null}
        {optimisticInvites.map((invite) => {
          const inviteUrl = appUrl
            ? `${appUrl}/pulse/invite/${invite.token}`
            : `/pulse/invite/${invite.token}`;

          return (
            <div key={invite.id} className="space-y-2 rounded-md border border-slate-800 p-3 text-sm">
              <div className="flex items-stretch rounded-md border border-slate-700 bg-slate-800 text-slate-300">
                <p className="min-w-0 flex-1 break-all px-3 py-2">{inviteUrl}</p>
                <div className="border-l border-slate-700" />
                <button
                  type="button"
                  onClick={() => copyInviteLink(invite.id, inviteUrl)}
                  className="cursor-pointer px-3 transition hover:bg-slate-700"
                  title="Copy invite link"
                  aria-label="Copy invite link"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
              {copiedInviteId === invite.id ? <p className="text-xs text-emerald-400">Copied to clipboard</p> : null}
              <div className="flex items-center justify-between gap-3">
                <p className="text-slate-500">
                  {invite.expires_at ? `Expires ${new Date(invite.expires_at).toLocaleString()}` : "Never expires"}
                </p>
                {isAdmin ? (
                  <form onSubmit={(e) => { e.preventDefault(); onInvalidateInvite(invite.id); }}>
                    <Button type="submit" variant="secondary" disabled={isPending}>Invalidate</Button>
                  </form>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

- [ ] Write `components/pulse/group/vote-panel.tsx` (alias + theme):

```tsx
"use client";

import { useEffect, useState } from "react";

import { castVoteOptimistic } from "@pulse/app/actions/votes";
import { Button } from "@pulse/components/ui/button";
import { useOptimisticAction } from "@pulse/lib/hooks/use-optimistic-action";
import type { VoteValue } from "@pulse/lib/types";

type VoteRow = {
  user_id: string;
  vote: VoteValue;
  profiles?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
};

type VotePanelProps = {
  groupId: string;
  eventId: string;
  isLocked: boolean;
  currentUserId: string;
  currentUserName: string;
  initialVotes: VoteRow[];
};

function getProfileFromVote(vote: VoteRow) {
  if (!vote.profiles) return null;
  return Array.isArray(vote.profiles) ? vote.profiles[0] ?? null : vote.profiles;
}

function getVoteSummary(votes: VoteRow[]) {
  const summary = { yes: [] as Array<{ id: string; name: string }>, no: [] as Array<{ id: string; name: string }>, maybe: [] as Array<{ id: string; name: string }> };
  for (const vote of votes) {
    const profile = getProfileFromVote(vote);
    if (profile) summary[vote.vote].push(profile);
  }
  return summary;
}

export function VotePanel({ groupId, eventId, isLocked, currentUserId, currentUserName, initialVotes }: VotePanelProps) {
  const [votes, setVotes] = useState<VoteRow[]>(initialVotes);
  const optimisticAction = useOptimisticAction();

  useEffect(() => { setVotes(initialVotes); }, [initialVotes]);

  const currentVote = votes.find((vote) => vote.user_id === currentUserId)?.vote;
  const voteSummary = getVoteSummary(votes);
  const voteButtons: Array<{ label: string; value: VoteValue }> = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Maybe", value: "maybe" },
  ];

  const onVoteClick = (selectedVote: VoteValue) => {
    if (isLocked || optimisticAction.isPending) return;

    const previousVotes = votes;
    const withoutCurrentUserVote = previousVotes.filter((vote) => vote.user_id !== currentUserId);
    const nextVote = currentVote === selectedVote ? null : selectedVote;
    const nextVotes = nextVote
      ? [...withoutCurrentUserVote, { user_id: currentUserId, vote: nextVote, profiles: { id: currentUserId, name: currentUserName } }]
      : withoutCurrentUserVote;

    optimisticAction.setErrorMessage(null);
    setVotes(nextVotes);

    optimisticAction.runOptimisticAction({
      applyOptimistic: () => previousVotes,
      rollback: (state) => { setVotes(state); },
      action: async () => { await castVoteOptimistic({ groupId, eventId, vote: selectedVote }); },
      onErrorMessage: "Could not save your vote. Reverted.",
    });
  };

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3">
        {voteButtons.map((button) => (
          <Button
            key={button.value}
            type="button"
            variant={currentVote === button.value ? "primary" : "secondary"}
            className="w-full"
            disabled={isLocked || optimisticAction.isPending}
            onClick={() => onVoteClick(button.value)}
          >
            {button.label}
          </Button>
        ))}
      </div>
      {optimisticAction.errorMessage ? <p className="text-sm text-red-400">{optimisticAction.errorMessage}</p> : null}
      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="font-medium text-slate-300">Yes ({voteSummary.yes.length})</p>
          <p className="text-slate-400">{voteSummary.yes.map((p) => p.name).join(", ") || "No votes"}</p>
        </div>
        <div>
          <p className="font-medium text-slate-300">No ({voteSummary.no.length})</p>
          <p className="text-slate-400">{voteSummary.no.map((p) => p.name).join(", ") || "No votes"}</p>
        </div>
        <div>
          <p className="font-medium text-slate-300">Maybe ({voteSummary.maybe.length})</p>
          <p className="text-slate-400">{voteSummary.maybe.map((p) => p.name).join(", ") || "No votes"}</p>
        </div>
      </div>
    </>
  );
}
```

- [ ] Write `components/pulse/group/event-form.tsx` (alias + dark selects/textareas):

Copy `../Pulse/components/group/event-form.tsx` with:
1. All `@/` → `@pulse/`
2. Select styles: `border-zinc-300 ... focus:ring-zinc-200` → `border-slate-700 bg-slate-800 text-white focus:border-slate-600 focus:ring-slate-700`
3. Textarea styles: same zinc→slate swap
4. Label colors: `text-zinc-700` → `text-slate-300`
5. Recurrence section border: `border-zinc-200` → `border-slate-700`
6. Weekday checkbox labels: `border-zinc-200 text-zinc-700` → `border-slate-700 text-slate-300`

Key style changes (apply globally in the file):
- `border-zinc-300` → `border-slate-700`
- `focus:border-zinc-400` → `focus:border-slate-600`
- `focus:ring-zinc-200` → `focus:ring-slate-700`
- `text-zinc-700` → `text-slate-300`
- `border-zinc-200` → `border-slate-700`
- Add `bg-slate-800 text-white` to all `<select>` and `<textarea>` elements

- [ ] Write `components/pulse/group/event-card.tsx` (alias + dark theme):

Copy `../Pulse/components/group/event-card.tsx` with:
1. All `@/` → `@pulse/`
2. `text-zinc-900` → `text-white`
3. `text-zinc-600` → `text-slate-400`
4. `text-zinc-500` → `text-slate-500`
5. `bg-zinc-100` → `bg-slate-800`
6. `bg-zinc-50 border-zinc-200` (details block) → `bg-slate-800 border-slate-700`
7. `text-zinc-700` (summary) → `text-slate-300`
8. `border-zinc-200 pt-3` (admin controls border) → `border-slate-800`
9. Delete scope select: add `bg-slate-800 text-white`, same zinc→slate border/ring swap
10. `isPrimary` card class: keep `border-emerald-500` (visible on dark bg)

- [ ] Write `components/pulse/group/events-list.tsx` (alias + fade gradient fix):

Copy `../Pulse/components/group/events-list.tsx` with:
1. All `@/` → `@pulse/`
2. Fade gradients: `from-zinc-200/90` → `from-slate-950/90`

---

## Task 12 — Server actions (alias + /pulse/ paths)

```bash
mkdir -p app/pulse/actions
```

- [ ] Write `app/pulse/actions/auth.ts`:

```ts
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@pulse/lib/supabase/server";
import { requireUser } from "@pulse/lib/auth/session";

function sanitizeNextPath(next: string | null) {
  if (!next || !next.startsWith("/")) return "/pulse/dashboard";
  return next;
}

export async function startGoogleSignIn(formData: FormData) {
  const nextPath = sanitizeNextPath((formData.get("next") as string | null) ?? null);
  const origin = (await headers()).get("origin");

  if (!origin) throw new Error("Could not determine request origin.");

  const supabase = await createClient();
  const callback = new URL("/pulse/auth/callback", origin);
  callback.searchParams.set("next", nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback.toString() },
  });

  if (error || !data.url) throw new Error(error?.message ?? "Unable to start Google sign-in.");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/pulse/login");
}

export async function saveProfile(formData: FormData) {
  const user = await requireUser("/pulse/login");
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) throw new Error("Name is required.");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, name }, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePath("/pulse/dashboard");
  redirect("/pulse/dashboard");
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser("/pulse/login");
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) throw new Error("Name is required.");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, name }, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/pulse/settings");
  redirect("/pulse/settings?saved=1");
}
```

- [ ] Write `app/pulse/actions/groups.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireGroupAdmin } from "@pulse/lib/auth/group-access";
import { requireUser } from "@pulse/lib/auth/session";
import { createClient } from "@pulse/lib/supabase/server";

export async function createGroup(formData: FormData) {
  await requireUser();
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) throw new Error("Group name is required.");

  const supabase = await createClient();
  const { data: groupId, error: groupError } = await supabase.rpc("create_group_with_admin", { group_name: name });
  if (groupError || !groupId) throw new Error(groupError?.message ?? "Could not create group.");

  revalidatePath("/pulse/dashboard");
  redirect(`/pulse/groups/${groupId}`);
}

export async function deleteGroup(formData: FormData) {
  const user = await requireUser();
  const groupId = (formData.get("groupId") as string | null) ?? "";
  const confirm = ((formData.get("confirm") as string | null) ?? "").trim();

  if (!groupId) throw new Error("Missing group.");
  await requireGroupAdmin(groupId, user.id);
  if (confirm !== "DELETE") throw new Error("Type DELETE to confirm.");

  const supabase = await createClient();
  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  if (error) throw new Error(error.message);

  revalidatePath("/pulse/dashboard");
  revalidatePath(`/pulse/groups/${groupId}`);
}
```

- [ ] Write `app/pulse/actions/events.ts`:

Copy `../Pulse/app/actions/events.ts` with:
1. All `@/` → `@pulse/`
2. `revalidatePath(\`/groups/${groupId}\`)` → `revalidatePath(\`/pulse/groups/${groupId}\`)`

- [ ] Write `app/pulse/actions/invites.ts`:

Copy `../Pulse/app/actions/invites.ts` with:
1. All `@/` → `@pulse/`
2. `revalidatePath(\`/groups/${groupId}\`)` → `revalidatePath(\`/pulse/groups/${groupId}\`)`
3. `redirect(\`/groups/${groupId}\`)` → `redirect(\`/pulse/groups/${groupId}\`)`

- [ ] Write `app/pulse/actions/members.ts`:

Copy `../Pulse/app/actions/members.ts` with:
1. All `@/` → `@pulse/`
2. `revalidatePath(\`/groups/${groupId}\`)` → `revalidatePath(\`/pulse/groups/${groupId}\`)`
3. `revalidatePath(\`/groups/${groupId}/settings\`)` → `revalidatePath(\`/pulse/groups/${groupId}/settings\`)`

- [ ] Write `app/pulse/actions/votes.ts`:

Copy `../Pulse/app/actions/votes.ts` with:
1. All `@/` → `@pulse/`
2. `revalidatePath(\`/groups/${groupId}\`)` → `revalidatePath(\`/pulse/groups/${groupId}\`)`

---

## Task 13 — Pulse layout + auth pages

- [ ] Write `app/pulse/layout.tsx`:

```tsx
export default function PulseLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-col">{children}</div>;
}
```

- [ ] Write `app/pulse/page.tsx`:

```tsx
import { redirect } from "next/navigation";

import { getProfile, getSessionUser } from "@pulse/lib/auth/session";

export default async function PulseIndexPage() {
  const user = await getSessionUser();

  if (!user) redirect("/pulse/login");

  const profile = await getProfile(user.id);
  if (!profile?.name) redirect("/pulse/profile");

  redirect("/pulse/dashboard");
}
```

- [ ] Write `app/pulse/login/page.tsx`:

```tsx
import { redirect } from "next/navigation";

import { startGoogleSignIn } from "@pulse/app/actions/auth";
import { getProfile, getSessionUser } from "@pulse/lib/auth/session";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getSessionUser();
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/pulse/dashboard";

  if (user) {
    const profile = await getProfile(user.id);
    redirect(profile?.name ? next : "/pulse/profile");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full space-y-4 p-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-white">Pulse</h1>
          <p className="text-sm text-slate-400">Sign in with Google to manage groups, events, and votes.</p>
        </div>
        <form action={startGoogleSignIn}>
          <input type="hidden" name="next" value={next} />
          <Button type="submit" className="w-full">Continue with Google</Button>
        </form>
      </Card>
    </main>
  );
}
```

- [ ] Write `app/pulse/profile/page.tsx`:

```tsx
import { redirect } from "next/navigation";

import { saveProfile } from "@pulse/app/actions/auth";
import { getProfile, requireUser } from "@pulse/lib/auth/session";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Input } from "@pulse/components/ui/input";

export default async function ProfilePage() {
  const user = await requireUser("/pulse/login");
  const profile = await getProfile(user.id);

  if (profile?.name) redirect("/pulse/dashboard");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full space-y-4 p-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-white">Complete your profile</h1>
          <p className="text-sm text-slate-400">Add your name so teammates can identify your votes.</p>
        </div>
        <form action={saveProfile} className="space-y-3">
          <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
          <Input id="name" name="name" type="text" placeholder="Your name" required maxLength={80} />
          <Button type="submit" className="w-full">Save and continue</Button>
        </form>
      </Card>
    </main>
  );
}
```

- [ ] Write `app/pulse/auth/callback/route.ts`:

```ts
import { NextResponse } from "next/server";

import { createClient } from "@pulse/lib/supabase/server";

function sanitizeNextPath(next: string | null) {
  if (!next || !next.startsWith("/")) return "/pulse/dashboard";
  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = sanitizeNextPath(searchParams.get("next"));

  if (!code) return NextResponse.redirect(new URL("/pulse/login", origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return NextResponse.redirect(new URL("/pulse/login", origin));

  return NextResponse.redirect(new URL(nextPath, origin));
}
```

---

## Task 14 — Pulse dashboard + settings pages

- [ ] Write `app/pulse/dashboard/page.tsx`:

```tsx
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { getUserGroups } from "@pulse/lib/db/queries";
import { GroupLinkCard } from "@pulse/components/dashboard/group-link-card";
import { NewGroupModal } from "@pulse/components/dashboard/new-group-modal";
import { Card } from "@pulse/components/ui/card";
import { TimedToast } from "@pulse/components/ui/timed-toast";
import { TopNav } from "@pulse/components/top-nav";

type DashboardPageProps = {
  searchParams?: Promise<{ reason?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const memberships = await getUserGroups(user.id);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const showNotMemberMessage = resolvedSearchParams?.reason === "not-group-member";

  return (
    <>
      <TopNav name={profile.name} />
      {showNotMemberMessage ? (
        <TimedToast
          message="Access denied, you are not a member of that group. If you think this is a mistake, please contact a group admin."
          clearQueryParamOnHide="reason"
        />
      ) : null}
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <section className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-white">Your groups</h1>
            <p className="text-sm text-slate-400">Create a group, invite people, and run polls on upcoming events.</p>
          </div>
          <NewGroupModal />
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {memberships.length === 0 ? (
            <Card className="sm:col-span-2">
              <p className="text-sm text-slate-400">No groups yet. Create one or ask an admin to share an invite link.</p>
            </Card>
          ) : null}
          {memberships.map((membership) => {
            const group = membership.group as { id: string; name: string } | null;
            if (!group) return null;
            return (
              <GroupLinkCard key={group.id} groupId={group.id} groupName={group.name} role={membership.role} />
            );
          })}
        </section>
      </main>
    </>
  );
}
```

- [ ] Write `app/pulse/settings/page.tsx`:

```tsx
import type { Metadata } from "next";

import { updateProfile } from "@pulse/app/actions/auth";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Input } from "@pulse/components/ui/input";
import { TimedToast } from "@pulse/components/ui/timed-toast";
import { TopNav } from "@pulse/components/top-nav";

export const metadata: Metadata = { title: "Settings · Pulse" };

type SettingsPageProps = {
  searchParams?: Promise<{ saved?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const resolved = searchParams ? await searchParams : undefined;
  const showSavedToast = resolved?.saved === "1";

  return (
    <>
      <TopNav name={profile.name} showDashboardButton />
      {showSavedToast ? (
        <TimedToast message="Your profile was updated." clearQueryParamOnHide="saved" />
      ) : null}
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <section className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-sm text-slate-400">Manage how you appear to others in Pulse.</p>
        </section>

        <Card className="space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Profile</h2>
          <form action={updateProfile} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Email</p>
              <p className="mt-1 text-sm text-slate-200">{user.email ?? "Not available"}</p>
              <p className="mt-1 text-xs text-slate-500">Your email comes from your sign-in provider and cannot be changed here.</p>
            </div>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-300">Display name</label>
              <Input id="name" name="name" type="text" defaultValue={profile.name} required maxLength={80} className="mt-1" />
              <p className="mt-1 text-xs text-slate-500">Shown on member lists, votes, and event activity.</p>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </Card>
      </main>
    </>
  );
}
```

---

## Task 15 — Pulse group + invite pages

- [ ] Write `app/pulse/groups/[groupId]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createEvent } from "@pulse/app/actions/events";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { getGroupMembership, getGroupWithMembers } from "@pulse/lib/db/queries";
import { getNextUpcomingEventId } from "@pulse/lib/events";
import { EventsList } from "@pulse/components/group/events-list";
import { EventForm } from "@pulse/components/group/event-form";
import { GroupRealtimeSync } from "@pulse/components/group/group-realtime-sync";
import { MemberList } from "@pulse/components/group/member-list";
import { TopNav } from "@pulse/components/top-nav";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";
import { Modal } from "@pulse/components/ui/modal";

type GroupPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupPage({ params }: GroupPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const { groupId } = await params;

  const membership = await getGroupMembership(groupId, user.id);
  if (!membership) redirect("/pulse/dashboard?reason=not-group-member");

  const groupData = await getGroupWithMembers(groupId);
  if (!groupData) notFound();

  const isAdmin = membership.role === "admin";
  const referenceTimeMs = groupData.referenceTimeMs;
  const nextUpcomingEventId = getNextUpcomingEventId(groupData.events, referenceTimeMs);

  return (
    <>
      <TopNav name={profile.name} showDashboardButton />
      <GroupRealtimeSync groupId={groupId} eventIds={groupData.events.map((event) => event.id)} includeVotes />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">{groupData.group.name}</h1>
          </div>
          {isAdmin ? (
            <Link
              href={`/pulse/groups/${groupId}/settings`}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Manage Group
            </Link>
          ) : (
            <Button variant="secondary" disabled>Member view</Button>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Events</h2>
            {isAdmin ? (
              <Modal title="Create event" triggerLabel="Create event">
                <EventForm groupId={groupId} action={createEvent} submitLabel="Create event" />
              </Modal>
            ) : null}
          </div>
          {groupData.events.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">
                No events yet. {isAdmin ? "Create one to start collecting votes." : ""}
              </p>
            </Card>
          ) : null}
          {groupData.events.length > 0 ? (
            <EventsList
              groupId={groupId}
              events={groupData.events}
              isAdmin={isAdmin}
              currentUserId={user.id}
              currentUserName={profile.name}
              nextUpcomingEventId={nextUpcomingEventId}
              referenceTimeMs={referenceTimeMs}
            />
          ) : null}
        </section>

        <section>
          <MemberList groupId={groupId} currentUserId={user.id} isAdmin={isAdmin} showKickControls={false} members={groupData.members} />
        </section>
      </main>
    </>
  );
}
```

- [ ] Write `app/pulse/groups/[groupId]/settings/page.tsx`:

```tsx
import { notFound, redirect } from "next/navigation";

import { getGroupMembership, getGroupWithMembers } from "@pulse/lib/db/queries";
import { GroupRealtimeSync } from "@pulse/components/group/group-realtime-sync";
import { requireProfile, requireUser } from "@pulse/lib/auth/session";
import { DeleteGroupForm } from "@pulse/components/group/delete-group-form";
import { InvitePanel } from "@pulse/components/group/invite-panel";
import { MemberList } from "@pulse/components/group/member-list";
import { TopNav } from "@pulse/components/top-nav";
import { Card } from "@pulse/components/ui/card";

type GroupSettingsPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupSettingsPage({ params }: GroupSettingsPageProps) {
  const user = await requireUser("/pulse/login");
  const profile = await requireProfile(user.id);
  const { groupId } = await params;

  const membership = await getGroupMembership(groupId, user.id);
  if (!membership) redirect("/pulse/dashboard?reason=not-group-member");
  if (membership.role !== "admin") redirect(`/pulse/groups/${groupId}`);

  const groupData = await getGroupWithMembers(groupId);
  if (!groupData) notFound();

  return (
    <>
      <TopNav name={profile.name} showDashboardButton />
      <GroupRealtimeSync groupId={groupId} includeInvites />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Manage Group</h1>
            <p className="text-sm text-slate-400">{groupData.group.name}</p>
          </div>
        </section>

        <Card>
          <p className="text-sm text-slate-400">Group settings let admins manage invite links and member access.</p>
        </Card>

        <section className="grid gap-3 lg:grid-cols-2">
          <InvitePanel groupId={groupId} isAdmin invites={groupData.invites} />
          <MemberList groupId={groupId} currentUserId={user.id} isAdmin members={groupData.members} />
        </section>

        <Card className="border-red-900/50 bg-red-950/30">
          <h2 className="text-base font-semibold text-red-400">Delete group</h2>
          <p className="mt-1 text-sm text-red-400/80">
            Permanently remove this group, all events, votes, invites, and member records. This cannot be undone.
          </p>
          <div className="mt-4">
            <DeleteGroupForm groupId={groupId} />
          </div>
        </Card>
      </main>
    </>
  );
}
```

- [ ] Write `app/pulse/invite/[token]/page.tsx`:

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";

import { joinGroupFromInvite } from "@pulse/app/actions/invites";
import { getProfile, getSessionUser } from "@pulse/lib/auth/session";
import { createClient } from "@pulse/lib/supabase/server";
import { Button } from "@pulse/components/ui/button";
import { Card } from "@pulse/components/ui/card";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const user = await getSessionUser();

  if (!user) redirect(`/pulse/login?next=/pulse/invite/${token}`);

  const profile = await getProfile(user.id);
  if (!profile?.name) redirect("/pulse/profile");

  const supabase = await createClient();
  const { data: previewRows } = await supabase.rpc("get_invite_preview", { invite_token: token });
  const invite = (previewRows ?? [])[0] as
    | { invite_id: string; group_id: string; group_name: string; expires_at: string | null }
    | undefined;

  if (invite) {
    const { data: membership } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("group_id", invite.group_id)
      .eq("user_id", user.id)
      .maybeSingle<{ group_id: string }>();

    if (membership) redirect(`/pulse/groups/${invite.group_id}`);
  }

  const nowMs = Date.parse(new Date().toISOString());
  const isExpired =
    !invite || (invite.expires_at ? new Date(invite.expires_at).getTime() < nowMs : false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full space-y-4 p-6">
        {isExpired ? (
          <>
            <h1 className="text-xl font-semibold text-white">Invite not available</h1>
            <p className="text-sm text-slate-400">This invite link is invalid or has expired.</p>
            <Link
              href="/pulse/dashboard"
              className="block rounded-md transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Button type="button" className="w-full" variant="secondary">Go to dashboard</Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-white">Join group</h1>
            <p className="text-sm text-slate-400">
              You are invited to join <strong className="text-white">{invite.group_name}</strong>.
            </p>
            <form action={joinGroupFromInvite}>
              <input type="hidden" name="token" value={token} />
              <Button type="submit" className="w-full">Join Group</Button>
            </form>
          </>
        )}
      </Card>
    </main>
  );
}
```

---

## Task 16 — Middleware

- [ ] Write `middleware.ts` at project root:

```ts
import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/pulse/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/pulse")) {
    return updateSession(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## Task 17 — Verify build

- [ ] Run `npm run build` from `ucrcricket/`
- [ ] Fix any TypeScript errors (likely missing type annotations on copied files)
- [ ] Confirm no Vite references remain: `grep -r "vite" . --include="*.ts" --include="*.tsx" --include="*.json" --exclude-dir=node_modules`

---

## Task 18 — Commit

```bash
git add -A
git commit -m "Migrate Pulse into ucrcricket as Next.js 16 App Router app at /pulse/*"
```

---

## Environment Variables (Vercel)

Add to the `migration-test` preview environment in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` = `https://ucrcricket.vercel.app`

Add to Supabase Auth → URL Configuration → Redirect URLs:
- `https://ucrcricket.vercel.app/pulse/auth/callback`
