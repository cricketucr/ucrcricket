# Design: Pulse Migration into ucrcricket

**Date:** 2026-04-15  
**Branch:** migration-test  
**Status:** Approved

---

## Overview

Migrate the Pulse polling app (Next.js 16 + Supabase) into the ucrcricket static website repo, converting ucrcricket from Vite to a unified Next.js 16 App Router application. Pulse is accessible at `ucrcricket.vercel.app/pulse`. All Pulse pages live under the `/pulse/*` URL prefix. The original `/cricket/Pulse/` directory is never modified.

---

## Constraints

- Do not modify the original Pulse directory at `/cricket/Pulse/`
- All changes happen on the `migration-test` branch of ucrcricket
- Do not merge into or modify `main`
- The migrated Pulse copy inside ucrcricket may be adapted (paths, aliases, theme, config)

---

## Architecture

**Single Next.js 16 App Router application, single Vercel deployment.**

ucrcricket is converted from Vite + React SPA to Next.js 16 App Router. Pulse's code is copied into the ucrcricket repo and placed under structured subdirectories. The Supabase session middleware from Pulse is wired into ucrcricket's root `middleware.ts`, scoped to `/pulse/*` routes only.

### Framework Stack (post-migration)

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Supabase SSR (Google OAuth) — Pulse only |
| Deployment | Vercel (single project) |

---

## File Structure

```
ucrcricket/
├── app/
│   ├── layout.tsx                      ← root HTML shell (dark slate bg, shared fonts)
│   ├── page.tsx                        ← ucrcricket home page
│   ├── roster/page.tsx
│   ├── coaching/page.tsx
│   ├── timeline/page.tsx
│   ├── sponsor/page.tsx
│   ├── contact/page.tsx
│   └── pulse/                          ← ALL Pulse pages, URL prefix = /pulse/*
│       ├── layout.tsx                  ← Pulse sub-layout (adapted from Pulse layout.tsx)
│       ├── page.tsx                    ← redirect logic (→ /pulse/login or /pulse/dashboard)
│       ├── login/page.tsx
│       ├── dashboard/page.tsx
│       ├── profile/page.tsx
│       ├── settings/page.tsx
│       ├── auth/
│       │   └── callback/route.ts
│       ├── groups/
│       │   └── [groupId]/
│       │       ├── page.tsx
│       │       └── settings/page.tsx
│       ├── invite/
│       │   └── [token]/page.tsx
│       └── actions/                    ← server actions (copied, paths updated)
│           ├── auth.ts
│           ├── events.ts
│           ├── groups.ts
│           ├── invites.ts
│           ├── members.ts
│           └── votes.ts
├── components/
│   ├── navigation.tsx                  ← ucrcricket nav (ported from Navigation.jsx)
│   └── pulse/                          ← Pulse UI components (copied, alias-updated)
│       ├── ui/
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── badge.tsx
│       │   ├── input.tsx
│       │   ├── modal.tsx
│       │   └── timed-toast.tsx
│       ├── group/
│       │   ├── event-card.tsx
│       │   ├── event-form.tsx
│       │   ├── events-list.tsx
│       │   ├── group-realtime-sync.tsx
│       │   ├── invite-panel.tsx
│       │   ├── member-list.tsx
│       │   ├── vote-panel.tsx
│       │   └── delete-group-form.tsx
│       ├── dashboard/
│       │   ├── group-link-card.tsx
│       │   └── new-group-modal.tsx
│       └── top-nav.tsx                 ← restyled to ucrcricket amber/slate palette
├── lib/
│   └── pulse/                          ← Pulse lib (copied, alias-updated)
│       ├── auth/
│       │   ├── session.ts
│       │   └── group-access.ts
│       ├── db/
│       │   └── queries.ts
│       ├── hooks/
│       │   └── use-optimistic-action.ts
│       ├── supabase/
│       │   ├── client.ts
│       │   └── server.ts
│       │   ├── env.ts
│       │   └── middleware.ts
│       ├── events.ts
│       ├── types.ts
│       └── utils.ts
├── public/                             ← ucrcricket static assets (SVG logo, etc.)
├── middleware.ts                        ← calls Pulse session updater for /pulse/* only
├── next.config.ts
├── tsconfig.json                        ← adds @pulse/* path alias
├── package.json                         ← merged deps from both projects
├── postcss.config.mjs
└── tailwind.config.ts
```

---

## Key Adaptations to the Pulse Copy

### 1. Internal Path Prefix (`/` → `/pulse/`)

All Pulse-internal navigation must be updated in the copy to include the `/pulse/` prefix:

| Original | Updated |
|---|---|
| `redirect("/login")` | `redirect("/pulse/login")` |
| `redirect("/dashboard")` | `redirect("/pulse/dashboard")` |
| `redirect("/profile")` | `redirect("/pulse/profile")` |
| `redirect("/settings")` | `redirect("/pulse/settings")` |
| `href="/dashboard"` | `href="/pulse/dashboard"` |
| `href="/settings"` | `href="/pulse/settings"` |
| `router.push("/dashboard")` | `router.push("/pulse/dashboard")` |
| `/auth/callback` (OAuth redirect) | `/pulse/auth/callback` |
| `new URL("/login", origin)` | `new URL("/pulse/login", origin)` |

Files requiring path updates: `app/pulse/page.tsx`, `app/pulse/actions/auth.ts`, `app/pulse/auth/callback/route.ts`, `components/pulse/top-nav.tsx`, `lib/pulse/auth/session.ts`.

### 2. TypeScript Path Alias (`@/` → `@pulse/`)

Pulse's internal imports use `@/` which in the original project resolves to Pulse's root. In ucrcricket, `@/` resolves to ucrcricket's root. To avoid collisions, all `@/` imports within the copied Pulse files are updated to `@pulse/`, which is configured in `tsconfig.json` to point to the pulse-specific directories.

```json
// tsconfig.json paths
{
  "@/*": ["./*"],
  "@pulse/components/*": ["./components/pulse/*"],
  "@pulse/lib/*": ["./lib/pulse/*"],
  "@pulse/app/*": ["./app/pulse/*"]
}
```

### 3. Middleware Scoping

ucrcricket's `middleware.ts` calls Pulse's `updateSession` only for requests under `/pulse/*`. All other routes are passed through without Supabase session handling.

```ts
// middleware.ts (ucrcricket)
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/pulse')) {
    return updateSession(request); // from lib/pulse/supabase/middleware.ts
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

### 4. UI Theme — Pulse Copy Restyled to Match ucrcricket

ucrcricket's palette: `bg-slate-950` body, `bg-slate-900` cards, `border-slate-800` borders, `amber-500` primary accent, `text-white` / `text-slate-300` / `text-slate-400` text hierarchy.

Changes in the Pulse copy:
- `app/pulse/layout.tsx` — set `bg-slate-950` body, use system font (no Geist)
- `components/pulse/top-nav.tsx` — replace zinc/white header with `bg-slate-900 border-slate-800`, amber logo text "Pulse", white nav links
- `components/pulse/ui/button.tsx` — primary variant becomes `bg-amber-500 text-slate-900 hover:bg-amber-400`
- `components/pulse/ui/card.tsx` — `bg-slate-900 border border-slate-800`
- `components/pulse/ui/input.tsx` — `bg-slate-800 border-slate-700 text-white`
- Zinc text colors replaced: `text-zinc-900` → `text-white`, `text-zinc-600` → `text-slate-400`, `text-zinc-700` → `text-slate-300`
- Page backgrounds: `bg-zinc-50` → `bg-slate-950`

### 5. Supabase Auth Callback URL

The Supabase project's "Redirect URLs" in the Supabase dashboard must include:
`https://ucrcricket.vercel.app/pulse/auth/callback`

The Vercel env var `NEXT_PUBLIC_APP_URL` = `https://ucrcricket.vercel.app`.

---

## ucrcricket Page Migration (Vite → Next.js)

The existing JSX pages are straightforward to port — they are pure React components with no Vite-specific APIs. Each `pages/XxxPage.jsx` becomes `app/xxx/page.tsx` (or `page.jsx` initially to defer TypeScript conversion). The custom `window.history.pushState` routing is replaced by Next.js `<Link>` and `useRouter`.

Key changes:
- `src/CricketWebsite.jsx` routing logic → App Router file-based routing (no router component needed)
- `Navigation.jsx` → `components/navigation.tsx`, uses Next.js `<Link>` instead of `onPageChange` callbacks
- `src/assets/ucrcricket.svg` → `public/ucrcricket.svg`
- Tailwind v3 config → Tailwind v4 (Pulse already uses v4)

---

## Deployment

**Single Vercel project** pointing to the `ucrcricket/` directory.

- Framework: Next.js (auto-detected)
- Root directory: `ucrcricket`
- Branch: `migration-test` (for preview), `main` for production (not touched)

Environment variables to add in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` = `https://ucrcricket.vercel.app`

The existing `vercel.json` SPA rewrite is removed — Next.js handles all routing natively.

---

## Out of Scope

- Converting Pulse's pages to TypeScript (can remain `.tsx` as copied)
- Database schema changes
- Adding new features to either app
- CI configuration
