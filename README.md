# ClipForge AI — Phase 2 Foundation

This is the foundation build: Next.js app, Tailwind, Supabase Auth + schema,
landing page, dashboard shell with sidebar, and settings page. The video
processing pipeline (worker, FFmpeg, OpenAI) is **not** part of this phase —
that's Phase 4/5.

## What's real vs. placeholder in this phase

- **Real:** Auth (email/password + Google, via Supabase), route protection
  middleware, database schema + RLS policies, dashboard reading live data
  from `profiles`/`projects`, settings page reading live profile data.
- **Placeholder:** Upload, Projects, Shorts, Templates, Analytics, and
  Billing pages are stubs ("Coming in a later phase") — they exist so the
  sidebar doesn't 404, but have no functionality yet. The settings form
  fields aren't wired to a save action yet.

## 1. Set up Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`. This creates
   the schema, enables RLS, and adds a trigger that creates a `profiles` row
   automatically when someone signs up.
3. In Authentication → Providers, enable Google OAuth if you want that login
   option (needs a Google Cloud OAuth client ID/secret).
4. Copy your Project URL, anon key, and service role key from
   Project Settings → API.

## 2. Configure environment variables

```bash
cd apps/web
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` from step 1. Leave the OpenAI/Stripe values
blank for now — they aren't used until later phases.

## 3. Install and run

```bash
cd apps/web
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 4. Testing checklist

- [ ] Landing page loads at `/`
- [ ] Pricing page loads at `/pricing`
- [ ] Sign up with email/password creates a Supabase auth user AND a matching
      `profiles` row (check the trigger fired)
- [ ] Confirmation email arrives and activates the account
- [ ] Log in redirects to `/dashboard`
- [ ] Visiting `/dashboard` while logged out redirects to `/login`
- [ ] Dashboard shows your name and starting credit balance (5, on Free)
- [ ] Settings page shows your name/email/plan/credits
- [ ] Google login works (if configured)
- [ ] A second test user cannot see the first user's projects (create a
      project row manually in Supabase and confirm RLS blocks cross-user reads)

## Known limitations at this phase

- No file upload yet — the Upload page is a stub.
- No worker service yet — `apps/worker` will be built in Phase 4/5, deployed
  to Railway per your choice.
- Settings form doesn't persist edits yet (no update handler wired).
- No Stripe integration yet — plan/credits shown are whatever the database
  trigger set on signup (Free / 5 credits).
