# Code Review — update/ui-redesign
**Date:** 2026-04-20
**Reviewed commit:** `1ce6bb9` — redesign: bold brutalist UI with Framer Motion animations
**Files changed:** 32 files, ~1,062 insertions, ~339 deletions

## Summary

This commit replaces the UCR Cricket website's generic slate-gray Tailwind theme with a bold brutalist aesthetic (pitch-black background, neon yellow `#E8FF00` accent, Bebas Neue display font). It introduces four new animation utility components (`FadeUp`, `StaggerContainer/Item`, `PageTransition`, `AnimatedCounter`) built on Framer Motion, and applies them across all `app/(cricket)/` pages, the navigation, and Pulse sub-app components. The design system is well-executed and cohesive in the areas it touches, but the partial rollout leaves the Pulse sub-app in a split state, and two animation patterns have correctness issues in Next.js App Router.

## Issues Found (4 issues, 4 filtered as low-confidence)

---

### 1. Double Navigation Bar on All Pulse Authenticated Pages — History

**File:** `app/pulse/layout.tsx`
**Confidence:** 98/100

Every authenticated Pulse page (dashboard, groups, settings) now renders two stacked navigation bars. The prior commit `f803b55` ("integrate header <--> pulse") injected the site-wide `<Navigation />` into `PulseLayout`. Those pages already render the Pulse-specific `<TopNav>` independently. This redesign hardened the `<Navigation />` injection and restyled `<TopNav>` without resolving the double-nav conflict.

The login and profile pages (which have no `<TopNav>`) correctly show one nav bar; all other Pulse pages show two.

**Fix:** Either remove `<Navigation />` from `PulseLayout` and keep `<TopNav>` standalone, or consolidate both nav bars into a single component that adapts to context.

---

### 2. AnimatePresence Exit Animations Never Fire in Next.js App Router Layouts — Bug + History

**Files:** `components/ui/page-transition.tsx` · `app/(cricket)/layout.tsx` · `app/pulse/layout.tsx`
**Lines (page-transition.tsx):** 9–19
**Confidence:** 90/100

`PageTransition` wraps `{children}` with `<AnimatePresence mode="wait">` inside persistent layout components. In Next.js App Router, layouts survive route changes — they never unmount. `AnimatePresence` fires exit animations only when a child is removed from the React tree. Since the layout is persistent, the old `motion.div` (keyed by `pathname`) is never unmounted; the exit animation (`opacity: 0, y: -6`) silently never runs.

The `mode="wait"` flag compounds this: it is meant to hold back the enter animation until the exit completes, but since exit never fires, the actual enter timing is undefined. Users will only ever see the enter animation.

**Fix:** Move `<AnimatePresence>` to the root layout (`app/layout.tsx`) wrapping the entire `{children}` slot, or use a template file (`template.tsx`) instead of `layout.tsx` — templates re-mount on every navigation, which is exactly what `AnimatePresence` requires.

---

### 3. Incomplete Pulse Redesign — Old `slate-*` Tokens on Skipped Pages — History

**Files:** `app/pulse/profile/page.tsx`, `app/pulse/settings/page.tsx`, `app/pulse/groups/[groupId]/page.tsx`, and sub-components `member-list.tsx`, `invite-panel.tsx`, `events-list.tsx`, `delete-group-form.tsx`
**Confidence:** 93/100

The redesign updated Pulse primitives (`card`, `button`, `badge`, `input`, `modal`) and selected pages (`dashboard`, `login`, `top-nav`) but left several pages untouched. Those pages still hardcode `bg-slate-800`, `border-slate-800`, `text-slate-400`, `rounded-md`, and gradient overlays like `from-slate-950/90` — a color that no longer exists in the theme.

The global `body` background changed from the old `#020617` to `#080808`, and the design system now uses semantic tokens (`bg-crease`, `border-line`, etc.) with sharp corners instead of `rounded-*`. The skipped pages will appear noticeably inconsistent: different gray tones, rounded corners vs. sharp edges, and wrong font weight hierarchy.

**Fix:** Apply the new design tokens to the five skipped Pulse pages/components, or document that they are intentionally deferred.

---

### 4. `secondary` Button Variant Semantically Inverted — History

**File:** `components/pulse/ui/button.tsx`
**Lines:** 9–10
**Confidence:** 82/100

The original `secondary` variant had a filled background (`bg-slate-800 text-white border border-slate-700`) — a visible, prominent action. The new variant uses `bg-transparent` with only a border, making it visually identical to the `ghost` variant. This collapses the visual hierarchy between secondary and ghost actions.

The "Make admin", "Make member", and "Invalidate invite" buttons in `member-list.tsx` and `invite-panel.tsx` used `variant="secondary"` expecting a filled button for a destructive-adjacent action. They now render as borderless low-emphasis elements and are visually buried — especially since those pages were not redesigned and still use the old surrounding styles.

**Fix:** Restore a filled background (e.g., `bg-boundary`) for `secondary` to distinguish it from `ghost`, or rename the variant to `outline` and update all call sites.

---

## Filtered Out

4 issues were found but scored below the 80-confidence threshold and were excluded:

- **AnimatedCounter count not reset on target change** (72) — `count` state is not reset to 0 when `target` prop changes while `inView` is already true, causing a mid-value jump animation. Low-impact since targets are static on this site.
- **Mobile nav stale animation children** (65) — Inner `motion.div` items in the mobile menu have no `exit` prop; rapid open/close causes entrance animations to still be in flight when the container collapses.
- **Global grain overlay z-index above modals** (65) — `body::after` grain at `z-index: 9999` sits above Tailwind `z-50` modal/toast layers. `pointer-events: none` prevents click issues, but any component relying on standard Tailwind z-index can't escape the grain.
- **AnimatedCounter server renders "0" before hydration** (72) — Stat counters flash "0" on initial server render before the count-up animation starts client-side. Cosmetic on fast connections.
