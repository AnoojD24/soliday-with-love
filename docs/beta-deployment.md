# Phase 5 — Beta deployment guide

Private gift app for iPhone testing. No backend. Do **not** make the repo public or ship an unprotected production URL.

## Privacy note — gift photograph

The cinematic gift reveal embeds a personal photograph in the production JS/asset bundle.

- Keep the GitHub repository **private**
- Keep Vercel **Deployment Protection** / Shareable Link enabled
- Anyone who can open the protected app can also download the photo asset from the bundle
- Originals under `photos/` are gitignored; optimized copies live in `src/assets/`

## What is already verified in the codebase

- Vite production build + SPA rewrites (`vercel.json`)
- PWA manifest, icons, service worker, offline shell
- LocalStorage key `soliday-with-love-v1` survives app updates
- Love letter **bodies** live in config files; only **IDs** are stored for unlock/read history
- `robots.txt` + `X-Robots-Tag: noindex` (discourages crawlers; **not** access control)

## Future love letter updates (safe)

Edit only:

| File | What to change |
|------|----------------|
| [`src/data/loveNotes.ts`](../src/data/loveNotes.ts) | Milestone + final gift letter text/titles |
| [`src/data/openWhenLetters.ts`](../src/data/openWhenLetters.ts) | Open When bodies/titles |

**Keep IDs stable** (`first`, `three`, `six`, `nine`, `twelve`, `miss-me`, `tired`, …).

After you push to `main`, Vercel redeploys. Her phone keeps:

- Workouts, decisions, journals
- Milestone unlock IDs
- Open When opened IDs
- Onboarding completed

She may need to tap **Refresh** on the in-app update banner (“A little update is ready ♡”) to load new letter text. Previously unlocked letters show the **new** copy.

Do **not** change `STORAGE_KEY` / `STORAGE_VERSION` unless you intentionally migrate data.

## Recommended hosting path

### A) Best privacy on a budget (recommended for beta)

1. **Private** GitHub repo `soliday-with-love`
2. Vercel project linked to that repo (Hobby is fine for hosting)
3. Enable **Deployment Protection → Vercel Authentication** for **All Deployments** (or at least Production)
4. Share access with her via a **Shareable Link** (Hobby allows **one** shareable link per account)
5. Send her only that link — not a public unprotected URL

> Password Protection is **not** available on Hobby (Pro add-on). Vercel Authentication alone only lets *your* Vercel login through; the Shareable Link is how she opens it as a guest.

### B) Strongest simple gate (if you upgrade)

- Vercel **Pro** + **Password Protection** on the project (~$20/mo for that protection feature on Pro)
- Share the password with her out of band

### What does **not** count as protection

- Unlisted URL
- `robots.txt` / `noindex`
- Client-side password screens
- LocalStorage

## Exact Vercel project settings

| Setting | Value |
|---------|--------|
| Framework Preset | Vite |
| Root Directory | `.` (repo root) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js | 20.x (or Vercel default LTS) |
| Production Branch | `main` |
| Auto Deploy | Enabled for `main` |
| SPA | Handled by committed `vercel.json` rewrites |

Environment variables: **none required** for beta.

## GitHub setup (you run these)

In PowerShell from the project folder:

```powershell
cd C:\Users\anooj\Downloads\soliday
git init
git add .
git status
git commit -m "Initial Soliday With Love beta"
```

On GitHub.com:

1. New repository → name `soliday-with-love`
2. Visibility: **Private**
3. Do **not** initialize with README (local files already exist)
4. Then:

```powershell
git branch -M main
git remote add origin https://github.com/<your-username>/soliday-with-love.git
git push -u origin main
```

## Vercel setup (you run these)

1. [vercel.com](https://vercel.com) → Add New Project → Import `soliday-with-love`
2. Confirm private GitHub access
3. Use the settings table above → Deploy
4. Project → **Deployment Protection**
   - Enable **Vercel Authentication**
   - Prefer protecting **All Deployments** for beta
5. Open the production deployment → **Share** → **Anyone with the link** (Shareable Link)
6. Send her that link over a private channel

Optional: attach a custom domain later. HTTPS is automatic on `*.vercel.app`.

## iPhone install (for her)

1. Open the **Shareable / protected** link in **Safari**
2. Complete Vercel share/auth step if prompted
3. Share → **Add to Home Screen**
4. Open from the home screen (standalone)
5. Unwrap the gift once; later visits skip onboarding
6. Settings → export JSON backup after she has progress

After a letter update deploy: open the app online once, refresh if the update banner appears, then offline still works.

## Remaining blockers / decisions for you

1. **No git remote yet** — local folder is not a git repo until you run the commands above (or ask me to init/commit).
2. **Hobby password protection unavailable** — use Shareable Link + Vercel Auth, or upgrade to Pro for password.
3. **Schedule + letter text ship in the JS bundle** — anyone who can load the protected page can read them; keep the share link private.
4. **Physical iPhone QA** still required after host is up (`docs/iphone-qa-checklist.md`).
5. I will **not** create a public repo or deploy unprotected from this session.

## After beta is live

When you personalize letters later: edit the two data files → commit → push `main` → wait for Vercel → she refreshes. No reinstall.
