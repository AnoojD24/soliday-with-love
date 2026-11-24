# Soliday With Love

A personalized December 2026 solidcore companion for Trisha — romantic Christmas gift + practical workout tracker.

Mobile-first React + TypeScript PWA. LocalStorage only. No backend.

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

```bash
npm test
npm run icons
```

## Production build & PWA

`vite-plugin-pwa` generates:

- Web app manifest (`Soliday With Love` / short name `Soliday ♡`)
- Service worker with precache + navigation fallback
- Update prompt: “A little update is ready ♡”

Icons live in [`public/icons/`](public/icons/). Regenerate from the SVG master with `npm run icons`.

## iPhone installation

Best in **Safari**:

1. Open Soliday With Love
2. Tap Share
3. Add to Home Screen
4. Confirm and tap Add

In-app guide: **Progress → Settings → Take me with you ♡**

When already installed (standalone mode), the guide shows a gentle “You’re home” message instead.

## Offline

After the first successful online load + service worker install, these work offline:

- Home, Calendar, Progress, With Love
- Flexible decisions, cancellation confirms
- Add/edit/remove workouts, completion, journals
- Hearts, milestones, Open When letters, gift replay
- Settings, JSON backup/restore, `.ics` generation

A soft banner appears when you are offline. Changes stay in LocalStorage.

## Apple Calendar (`.ics`)

From a workout card (planned/completed): **Add to my calendar**

From a flexible decision card: **Add reminders to my calendar**

From Settings:

- Export planned workouts
- Export decision reminders

Notes:

- Exports do **not** create/cancel solidcore reservations
- Events do **not** auto-sync when Soliday changes later
- Import UX varies by iOS / Calendar
- The 10-hour deadline is a personal preference, not studio policy
- Unresolved bookings are exported as **reminders**, not confirmed attendance

## Customize content

| File | Purpose |
|------|---------|
| [`src/data/seedWorkouts.ts`](src/data/seedWorkouts.ts) | Initial schedule |
| [`src/data/loveNotes.ts`](src/data/loveNotes.ts) | Milestone letters, daily notes, pre-challenge |
| [`src/data/openWhenLetters.ts`](src/data/openWhenLetters.ts) | Always-available Open When letters |
| [`public/icons/icon.svg`](public/icons/icon.svg) | App icon master |
| [`src/assets/muscle-map/`](src/assets/muscle-map/) | Anatomical muscle map asset |

### Muscle map attribution

Class-focus anatomy art is adapted from **[Open Muscle Map](https://github.com/PerspicaciousGuy/Open-Muscle-Map)** (MIT) by PerspicaciousGuy — local copy under [`src/assets/muscle-map/`](src/assets/muscle-map/) with Soliday color restyling. See [`ATTRIBUTION.md`](src/assets/muscle-map/ATTRIBUTION.md).

## Data & backups

Stored under `soliday-with-love-v1` in LocalStorage.

- Progress is **device-local** (no cross-device sync)
- Clearing site data / removing the home-screen app may erase progress
- Safari browser vs installed web app storage can differ
- Export JSON backups regularly from Settings

Invalid imports are rejected and will not overwrite valid data.

## Privacy

This app holds personal data (name, schedule, studios, love letters).

**Not provided by an unlisted URL alone:** server-enforced access control.

### Recommendation (no backend)

1. Keep the repo **private**
2. Prefer **Vercel Deployment Protection** (password / SSO) if available on your plan
3. Optional stronger approach for a later phase: ship a generic public shell and import personalized JSON locally (keep seed/love notes out of the public bundle)
4. Avoid putting studio door codes or private access info in the repo (none are included)

Do **not** rely on:

- robots.txt
- client-side password screens
- LocalStorage “privacy”
- “nobody knows the URL”

See also [`docs/privacy-deployment.md`](docs/privacy-deployment.md) and [`docs/iphone-qa-checklist.md`](docs/iphone-qa-checklist.md).

## Vercel / beta deploy

[`vercel.json`](vercel.json) includes SPA rewrites, `noindex`, and cache headers for the service worker.

Full beta guide: [`docs/beta-deployment.md`](docs/beta-deployment.md)

```bash
npm run build
# Deploy only after you connect a PRIVATE GitHub repo + Vercel protection
```

**Do not ship an unprotected public URL.** Hobby needs Shareable Link + Vercel Auth (or Pro password protection).

## Known limitations

- No push / background notifications
- No cross-device sync
- Calendar events are one-way exports
- Physical iPhone QA still required after host deploy
- WebKit automated offline coverage depends on local Playwright browsers

## Screenshots

```bash
npm run build && npm run preview
node scripts/capture-phase4-screenshots.mjs
node scripts/qa-phase4.mjs
```

Outputs: `screenshots/phase4/`
