# Smart Bookmarks

A private, real-time bookmark manager built as part of a technical screening assignment.

🔗 **Live Demo:** https://smart-bookmarks-dsc-4nrd.vercel.app  
📦 **Repo:** https://github.com/YOUR-USERNAME/smart-bookmarks

---

## Overview

Users can sign in with Google, save private bookmarks, and see their list update in real-time across multiple tabs — all without a page refresh. Every user's data is completely isolated from other users.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | TailwindCSS |
| Backend & Auth | Supabase (Postgres + Auth + Realtime) |
| Language | TypeScript |
| Deployment | Vercel |

---

## Features

- ✅ Google OAuth login (no email/password)
- ✅ Add and delete bookmarks
- ✅ Private data per user — enforced at database level with RLS
- ✅ Real-time updates across multiple tabs
- ✅ Server-side rendering for initial data load
- ✅ Protected routes via Next.js middleware
- ✅ Fully deployed and production-ready

---

## Architecture Decisions

**Why Server Components for the dashboard?**  
The initial bookmark list is fetched server-side so there is no loading spinner on first visit. The page arrives with data already in it, which is faster and better for the user.

**Why Row Level Security instead of filtering in code?**  
Filtering data in application code is not safe — if there is ever a bug, data could leak. RLS enforces privacy at the Postgres level so it is impossible for User A to read User B's bookmarks, even with direct API access.

**Why manual fetch after insert instead of relying only on Realtime?**  
Supabase Realtime requires extra configuration to work with RLS filters. To keep things reliable, I fetch fresh data after every insert or delete so the UI is always correct regardless of Realtime status.

---

## Problems I Faced & How I Solved Them

### 1. Bookmarks saving to DB but not appearing on screen

**Problem:** Data was successfully reaching Supabase (confirmed in Table Editor) but the UI was not updating after clicking Add Bookmark.

**Root Cause:** The Realtime subscription had a `filter` parameter (`user_id=eq.${user.id}`) that requires special Supabase configuration to work with RLS policies. Without that configuration, the subscription silently receives no events.

**Fix:** Removed the filter from the Realtime subscription and added an explicit `fetchBookmarks()` call after every insert and delete. The UI now always reflects the latest data immediately.

---

### 2. Google OAuth failing after Vercel deployment

**Problem:** Login worked perfectly on localhost but failed on the live Vercel URL with an authentication error.

**Root Cause:** Google Cloud Console and Supabase both only had `localhost:3000` whitelisted. They had no knowledge of the new Vercel domain.

**Fix:** Added the Vercel URL to three places:
- Google Cloud → Authorized JavaScript Origins
- Google Cloud → Authorized Redirect URIs  
- Supabase → Authentication → URL Configuration & Redirect URLs

---

### 3. Wrong box in Google Cloud Console

**Problem:** Got error — *"Invalid origin: URIs must not contain a path or end with /"* — when setting up OAuth.

**Root Cause:** Pasted the full callback URL into the JavaScript Origins box instead of the Redirect URIs box. These two fields have different format requirements.

**Fix:**
- **JavaScript Origins** → domain only: `https://smart-bookmarks-dsc-4nrd.vercel.app`
- **Redirect URIs** → full path: `https://project.supabase.co/auth/v1/callback`

---

## If I Had More Time — Future Improvements

| Feature | Why |
|--------|-----|
| Bookmark folders / tags | Organise bookmarks into collections for easier browsing |
| Search bar | Quickly find bookmarks by title or URL |
| One-click browser extension | Save current tab without opening the app |
| Import from browser | Let users import existing bookmarks from Chrome/Firefox |
| Link preview thumbnails | Show a preview image of each bookmarked site |
| Drag to reorder | Let users manually sort their bookmark list |
| Share a collection | Allow users to optionally make a folder public |

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/smart-bookmarks.git
cd smart-bookmarks

# Install dependencies
npm install

# Add environment variables
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key

# Run the app
npm run dev
```

Open http://localhost:3000

> See `supabase-setup.sql` for the full database setup including RLS policies and Realtime configuration.

---

## Database Schema

```sql
create table public.bookmarks (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  url        text not null,
  created_at timestamptz not null default now()
);
```

RLS policies ensure each user can only SELECT, INSERT, and DELETE their own rows.
