# Content CMS

The site's copy — course details, testimonials, FAQs, stats, nav links, contact
info, brand copy — no longer needs a code change to update. It lives in
[`content/*.json`](../content) and is editable from a browser at **`/admin`**,
without ever touching this repo's source code.

## How it works

There's no separate CMS server, database, or hosting bill. `/admin` is a page
in this same Next.js site that, once you sign in with a GitHub token, talks
directly to GitHub's REST API from your browser:

1. You open a collection (e.g. "Courses") — the admin fetches
   `content/courses.json` straight from the repo.
2. You edit it in a form.
3. You hit **Save & publish** — the admin commits the updated JSON straight
   to the branch you're publishing to, using GitHub's Contents API.
4. The existing GitHub Actions workflow
   ([`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml))
   is already configured to build and redeploy on every push to that branch —
   so the change goes live automatically, usually within a minute or two,
   with no extra step.

Every field is validated against a schema
([`src/lib/cms/schema.ts`](../src/lib/cms/schema.ts)) both before it's sent
and again when the site itself builds — a malformed edit is rejected with a
clear error instead of silently shipping a broken page.

## Signing in

`/admin` asks for a **GitHub personal access token**, not a separate account.
Create one scoped to *only this repository*, so it can't touch anything else
on your GitHub account:

1. Go to [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new).
2. **Resource owner**: your account. **Repository access**: "Only select
   repositories" → `st.school2`.
3. Under **Repository permissions**, set **Contents** to **Read and write**.
   Leave everything else as "No access."
4. Generate the token and paste it into the `/admin` login screen.

The token is never sent anywhere except `api.github.com`. By default it's
kept only for the current browser tab (cleared when you close it); check
"Remember me on this device" to keep it in this browser for next time. Either
way, treat it like a password — anyone who has it can edit this repo. If you
ever suspect it leaked, revoke it from the same GitHub settings page.

The login screen also has a **branch** field, defaulting to whichever branch
this admin build currently treats as "live." Point it at `main` once this
work merges there, or at any other branch you want to publish to — nothing
else about the CMS needs to change.

### "GitHub API request failed (403) — Resource not accessible by personal access token"

This means the sign-in step succeeded — GitHub confirmed your *account* has
push access to the repo — but the *token* itself wasn't actually granted
permission to write files. Those are two different checks: a fine-grained
token can belong to an account with full admin access to the repo and still
be issued read-only (or no access at all), because GitHub defaults every
permission on a new fine-grained token to "No access" until you explicitly
set it. A read-only token lets you sign in and load/edit content just fine —
it only fails once you actually try to publish.

Fix: open the token at
[github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens),
confirm **Repository permissions → Contents** is set to **Read and write**
(not "Read-only" or "No access"), save, then sign out of `/admin` and back in.
If you can't edit an existing token's permissions, generate a new one with
step 3 above followed exactly, and use that instead. Your unsaved edits stay
in the browser tab while you fix this — no need to redo them, just retry
**Save & publish** once you're signed in with a token that has write access.

## What's editable

| Collection | File | Controls |
| --- | --- | --- |
| Site settings | `content/site.json` | Brand name, tagline, meta description, city, canonical URL |
| Hero stats | `content/hero-stats.json` | The 3-number stat row in the homepage hero |
| Courses | `content/courses.json` | Any number of course programs — curriculum, outcomes, highlights, stack, seats, deadline |
| Course page template | `content/course-template.json` | Shared section headings and closing CTA copy on every course's detail page (outcomes/roadmap/highlights headings, closing CTA heading + body) |
| Stats | `content/stats.json` | The applications/selection/placement/scholarship stats section |
| Process steps | `content/process.json` | The 5-step "how it works" sequence |
| Why Us | `content/why-us.json` | The "why choose us" reasons |
| Testimonials | `content/testimonials.json` | Student quotes on the homepage |
| FAQs | `content/faqs.json` | The FAQ accordion |
| Trust Logos | `content/trust-logos.json` | Names in the trust marquee |
| Parent brand | `content/parent-brand.json` | Student Tribe founding info + About page stat row |
| Contact info | `content/contact.json` | Email, phone, address, socials |
| Navigation | `content/nav-links.json` | Header nav + footer links |
| About page copy | `content/about-page.json` | The `/about` hero pull-quote, story/why/process section eyebrows + headings, and closing CTA heading + button labels |
| Contact page copy | `content/contact-page.json` | The `/contact` meta description, hero eyebrow, H1, and subhead |
| Courses page copy | `content/courses-page.json` | The `/courses` masthead eyebrow, H1, intro paragraph, and track-matcher section heading |

## Adding a new course

The **Courses** collection (in the dashboard's "Programs" group) supports
any number of course programs — you can add, remove, and reorder them
entirely from `/admin`, with no code change required. To add one:

1. Sign in at `/admin` and open the **Courses** collection under the
   **Programs** group.
2. Click **Add course** at the bottom of the list. This creates a new,
   blank program entry with sensible defaults (e.g. seats total 33, seats
   claimed 0) that you fill in.
3. Fill in every field. One worth calling out specifically is **Template**,
   which controls which hero visual and bonus interactive section the
   program's detail page gets:
   - **Python/AI hero** and **Design hero** are bespoke, hand-built hero
     treatments made for those two specific existing programs.
   - **Generic** is a complete, real hero that works for any program — not
     a placeholder. Pick **Generic** for essentially every new course you
     add; only reach for one of the bespoke options if you're specifically
     replacing the program it was built for.
4. Pay attention to **Slug** — it becomes the live URL at
   `/courses/<slug>`. Once the page is live, avoid changing the slug:
   anything that already links to that URL (marketing, search results,
   bookmarks) will break.
5. `Stack`, `Outcomes`, `Curriculum`, and `Highlights` are all list fields
   that each need at least one real (non-blank) entry — the form won't let
   you save while any of those required text fields are empty.
6. When everything looks right, hit **Save & publish**. This follows the
   same auto-deploy flow as any other collection — the change is committed
   straight to the branch you're publishing to, and the site rebuilds and
   goes live automatically within a minute or two.

Removing a program works the same way, in reverse: open Courses, use the
remove control on the program you want to take down, and Save & publish.

## Adding a new collection

Content editors are built from a small set of reusable pieces, so adding one
more doesn't take long:

1. Add a shape to `src/lib/cms/schema.ts` (a Zod schema + inferred type).
2. Add the matching `content/<name>.json` file and load it in
   `src/data/content.ts` the same way the others are loaded.
3. Build a form in `src/components/cms/editors/` using the existing field
   primitives in `src/components/cms/fields/` (`TextField`, `TextAreaField`,
   `NumberField`, `SelectField`, `StringListField`, `ObjectListField`).
4. Register it with `defineCollection(...)` in a new file under
   `src/lib/cms/collections/`, then add it to the list in
   `src/lib/cms/collections/index.ts`.

`src/components/cms/collection-editor-page.tsx` handles the GitHub fetch,
validation, and publish flow for every collection — a new editor never needs
to touch that.
