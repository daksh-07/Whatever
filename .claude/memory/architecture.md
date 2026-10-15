# Architecture Notes

> How the system is built: components, data flow, integration points, gotchas. Newest at top.

## Project: Whatever (reference repo for the toolkit)
- Static site: `index.html` + `game.html`. No backend, no build step. Hosted on Vercel/Pages/Netlify.

## User's main projects (context for cross-repo reuse)
- **Everest Local** — Expo / React Native, Supabase, Stripe, Vercel.
- **Everest Marketing** — Next.js, marketing/SEO/automation.
- **Client websites** — premium UI/UX, FE performance, security, conversion.
