# Privacy & deployment guidance

Soliday With Love stores personal information on-device:

- Personalized name and love letters
- Workout schedule, times, studios
- Attendance decisions and journals

## What does **not** protect the data

- Unlisted / obscure URLs
- `robots.txt`
- Client-side password screens (bypassable)
- LocalStorage alone (device-local, not access control)

## Recommended approach (current architecture)

Keep the no-backend model and add hosting-level protection:

1. **Private repository** — do not publish source with personal letters/schedule if the repo may become public.
2. **Vercel Deployment Protection**
   - **Hobby:** enable **Vercel Authentication**, then give her a **Shareable Link** (Hobby allows one shareable link per account). Password Protection is not on Hobby.
   - **Pro:** Password Protection (~$20/project/mo) is the simplest guest password gate.
3. **Share only with intended recipients** (never post the production URL publicly).
4. **Encourage JSON backups** so data can be restored if the device is cleared.

See [`docs/beta-deployment.md`](beta-deployment.md) for the full Phase 5 checklist.

## Stronger option (future, needs approval)

Split public shell from private personalization:

- Public deploy contains generic UI only
- Personalized schedule + letters arrive via a private JSON import on first setup
- Keep `seedWorkouts` / love-note sources out of the public bundle and public git history

This was **not** auto-implemented in Phase 4 to avoid rewriting existing personalized content without approval.

## Audit notes

Phase 4 audit found no studio door codes, scraped instructor photos, analytics SDKs, or AI APIs in the production bundle configuration.
