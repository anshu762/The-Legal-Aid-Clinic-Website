<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Legal Aid Clinic - Project Context & Built Features

This document provides context for any AI agent interacting with this codebase. 
**Project:** The Legal Aid Clinic Website (Next.js 15, App Router, Prisma, PostgreSQL, NextAuth.js, Tailwind, Shadcn UI).

## GLOBAL RULES (CRITICAL)
1. **Never add any payment/paid tier anywhere.**
2. **Privacy First:** Never collect a volunteer's phone number (only professional email). Never expose a requester's email/phone to a volunteer. Even after matching, only send the meeting link + case category.
3. **Role Enforcement:** Every role restriction must be enforced server-side (middleware/API route guard). "Admin" must never be a selectable role at signup (seed script only).
4. **No Hard Deletes:** Never hard-delete moderation data (reports, flags, profiles) or forum content. Use soft-delete/archive flags (`isHidden`, `isRemoved`, `isActive`).
5. **No Fake Anonymity:** "Anonymous" only hides a name from other public users — the real user ID must stay attached in the database so admins can always see it.
6. **Disclaimer:** Show the legal disclaimer ("this is legal information, not formal legal representation") on every page/component that gives legal guidance.

## Features Built (Phase 1 to Phase 6)

### Phase 1: Static Foundations & UI
- **Styling:** Tailwind CSS + Framer Motion + Shadcn-like reusable UI components (`/components/ui`). Deep blue/teal premium theme.
- **Pages:** `/know-your-rights`, `/faq`, `/contact`, `/privacy`, `/terms`, `/volunteer-with-us`, `/volunteers` (Volunteer Directory).

### Phase 2: Authentication & Role Dashboards
- **Auth:** NextAuth.js configured with Credentials provider. Custom `/login` and `/api/auth/register`.
- **Dashboards:** Segmented dashboards for three roles: `SEEKING_HELP` (`/dashboard/client`), `LEGAL_ADVISOR` (`/dashboard/advisor`), `ADMIN` (`/dashboard/admin`). Protected by `requireRole()` utility.

### Phase 3: Public Q&A Forum
- **Pages:** `/forum`, `/forum/ask`, `/forum/[id]`.
- **Features:** Seekers can post questions (with an anonymous toggle). Verified Advisors can post markdown-formatted answers. Seekers can upvote answers (backed by a Prisma `$transaction` on a compound key to prevent duplicates). Authors can mark questions as "Resolved".

### Phase 4: Volunteer Onboarding & Review
- **File Uploads:** Secure local filesystem storage for credential uploads (`/api/upload-credential/route.ts`). Files are strictly streamed through an Admin-only route (`/api/admin/credentials/[filename]`).
- **Admin Review:** `/dashboard/admin/volunteers` allows Admins to view pending applications, download credentials, and Approve/Reject/Deactivate advisors.
- **Advisor Self-Service:** Verified advisors can update their availability, preferred duration, and pause new requests via `/dashboard/advisor/availability`.

### Phase 5: Consultation Matching Engine
- **Request Flow:** Seekers use `/consultations/request` to submit case details, preferred slots, and secure attachments (served via `/api/attachments/[filename]`).
- **Admin Matching Engine:** `/dashboard/admin/consultations/[id]` automatically surfaces eligible Legal Advisors by filtering out unverified/paused advisors and intersecting Language + Specialization.
- **Confirmation:** Admin confirms match, auto-generating a Jitsi Meet URL.
- **Strict Data Privacy:** The Prisma payload feeding `/dashboard/advisor` mathematically omits Seeker PII (`contactEmail`, `contactPhone`). 
- **Cron Engine:** `scripts/cron-reminders.ts` queries upcoming CONFIRMED sessions to simulate 24h and 1h reminders, utilizing a `NotificationLog` table to prevent duplicates.

### Phase 6: Moderation System
- **Soft-Delete Architecture:** `isRemoved` and `isHidden` columns added to `ForumQuestion` and `ForumAnswer`.
- **Moderation Queue:** `/dashboard/admin/moderation` lists OPEN reports. Items flagged as `isEmergency: true` are visually red and permanently pinned to the top of the queue.
- **Actions:** Admins can Dismiss, Hide, or Remove content. "Remove" hides it from the public but preserves it in the DB with an audit trail note.
- **Proactive Admin Tools:** Admins viewing the public `/forum/[id]` page see inline "Admin Hide" and "Admin Remove" buttons to bypass the queue entirely.
- **General Contact:** The public `/contact` form submits urgent/general inquiries directly into the Moderation Queue.
