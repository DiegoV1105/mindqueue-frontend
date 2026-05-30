# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test suite is configured yet.

## Environment

Copy `.env.example` to `.env` and fill in:
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase project credentials
- `VITE_API_URL` — Backend REST API base URL

## Architecture

**Stack:** React 18 + Vite, React Router 7, TanStack Query 5, Zustand 5, Supabase, Axios, Tailwind CSS, Framer Motion.

### Routing & Roles

The app has two distinct user roles — `patient` and `therapist` — each with its own page subtree (`/patient/*`, `/therapist/*`). `PrivateRoute` in `App.jsx` guards authenticated routes and enforces role-based access. `RoleRedirect` at `/` sends authenticated users to their dashboard.

### State Management

| Layer | Tool | What it holds |
|---|---|---|
| Server state | TanStack Query | All API data, cached with 5-min stale time, 1 retry |
| Global/persistent | Zustand (persisted to localStorage) | Auth tokens, user info (`authStore`), in-app notifications (`notificationStore`) |
| Form state | React Hook Form + Zod | Form values and validation schemas |

### Data Fetching

`src/lib/axios.js` exports a configured Axios instance that injects the Bearer token from `authStore` on every request and handles token refresh on 401. All API calls go through this instance.

Custom hooks in `src/hooks/` wrap TanStack Query:
- `useAuth.js` — login/register/logout mutations
- `useJournal.js` — journal entries, streak, analytics
- `useSessions.js` — appointments, therapist insights, available slots
- `useAnalytics.js` / `useNotifications.js` — analytics data, notification queries

Query keys follow the pattern `['domain', 'resource', 'id?']`.

Real-time notifications are handled via Supabase subscriptions in `src/lib/supabase.js`.

### Component Structure

```
src/
  pages/
    auth/          # LoginPage, RegisterPage (public)
    patient/       # PatientDashboard, JournalPage, HistoryPage, SessionsPage
    therapist/     # TherapistDashboard, PatientDetailPage, SchedulePage, ProfilePage
  components/
    layout/        # AppShell, Sidebar, TopBar, MobileNav (shared authenticated shell)
    patient/       # JournalForm, MoodSlider, EmotionTags, StreakCard, MoodChart, ...
    therapist/     # PatientCard, SessionCard, PatternChips, AlertBadge, ...
    ui/            # Shared primitives: Button, Card, Badge, Modal, Avatar, Spinner, ...
  hooks/           # All TanStack Query hooks
  store/           # Zustand stores
  lib/             # axios, supabase, queryClient, utils
```

`@/` path alias resolves to `src/`.

### Styling

Tailwind with a custom theme — use these semantic tokens instead of raw colors:
- `primary` (green) — main brand/actions
- `accent` (orange) — secondary highlights
- `urgent` (orange-red) — alert states

Custom fonts: `DM Sans` (body), `Playfair Display` (headings). Custom animations: `fade-in`, `slide-up`, `pulse-soft`. Card radii: `rounded-card` (16px), `rounded-input` (12px).

Use `cn()` from `src/lib/utils.js` for conditional class merging (wraps `clsx` + `tailwind-merge`).

### UI Language

The UI is in **Spanish**. All user-facing strings, labels, and copy should be in Spanish.
