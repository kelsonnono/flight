# Flight

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cb33ec78-7d88-4a27-8f8b-e5a5c78cf01e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Static SPA build & Vercel

This is a plain Vite + React single-page app with React Router (`/`, `/auth`, `/signup`, `/app`).

- `npm run build` → static files in `dist/`; `npm run preview` serves them with SPA fallback.
- `vercel.json` sets the Vite preset, `dist/` output, and rewrites every path to `/index.html` so deep links like `/app` resolve client-side (HTTP 200).
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel, then redeploy. Only the publishable key belongs in the browser.
