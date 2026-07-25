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

## What's editable

| Collection | File | Controls |
| --- | --- | --- |
| Site settings | `content/site.json` | Brand name, tagline, meta description, city, canonical URL |
| Hero stats | `content/hero-stats.json` | The 3-number stat row in the homepage hero |
| Courses | `content/courses.json` | Both program pages — curriculum, outcomes, highlights, stack, seats, deadline |
| Stats | `content/stats.json` | The applications/selection/placement/scholarship stats section |
| Process steps | `content/process.json` | The 5-step "how it works" sequence |
| Why Us | `content/why-us.json` | The "why choose us" reasons |
| Testimonials | `content/testimonials.json` | Student quotes on the homepage |
| FAQs | `content/faqs.json` | The FAQ accordion |
| Trust Logos | `content/trust-logos.json` | Names in the trust marquee |
| Parent brand | `content/parent-brand.json` | Student Tribe founding info + About page stat row |
| Contact info | `content/contact.json` | Email, phone, address, socials |
| Navigation | `content/nav-links.json` | Header nav + footer links |

One deliberate limit: the **Courses** editor lets you fully edit both
existing programs but won't add or remove a program. A few components
(`track-fork.tsx`, `track-matcher.tsx`) hardcode a two-program layout, so
adding a third needs a small code change first, not just a content edit.

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
