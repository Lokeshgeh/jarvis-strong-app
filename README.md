# Jarvis Strong — Gamified Fitness Tracker

## Live App
- Web: https://jarvis-strong-app.vercel.app
- Android: [Play Store Link]

## Tech Stack
- React 18 + Vite + Tailwind CSS
- Chart.js via CDN
- Supabase (cloud PostgreSQL + Auth)
- Vercel (worldwide hosting)
- Capacitor (Android APK / AAB)

## Setup & Run Locally
1. Clone: `git clone https://github.com/YOUR_USERNAME/jarvis-strong-app`
2. Install: `npm install`
3. Create `.env` from `.env.example`
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Run: `npm run dev`
6. Open `http://localhost:5173`

## Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Create a new project named `jarvis-strong` in the region closest to India.
3. Copy the project URL and anon key into `.env`.
4. Run the schema from [docs/schema.sql](/docs/schema.sql) in the Supabase SQL editor.
5. Enable Google OAuth in Supabase Auth and add your site URL.

## Deploy Your Own
1. Push this project to GitHub as `jarvis-strong-app`.
2. Import the repo in Vercel.
3. Framework preset: `Vite`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add the Supabase env vars in Vercel.
7. Every push to `main` will auto-deploy.

## Build Android APK / AAB
```bash
npm run build
npx cap sync android
npx cap open android
```
Then in Android Studio:
1. Build `app-debug.apk` for direct installs.
2. Generate a signed `app-release.aab` for Google Play.

## Play Store Checklist
1. Register a Play Console account.
2. Create app: `Jarvis Strong`
3. Category: `Health & Fitness`
4. Upload screenshots, icon, splash, and feature graphic.
5. Submit the signed AAB to Internal Testing first.
6. Promote to Production after review.

## Included Product Areas
- Email/password and Google OAuth sign-in
- Workout tracking with live session logging and Supabase writes
- Nutrition diary with macro totals and editable meal plans
- Ranks, gallery, calculator, analysis views
- Friends directory and limited social feed
- Locked daily schedule with checkmark sync only
- Profile editing, export, reset, and achievements

## Notes
- User data is stored in Supabase only. No localStorage is used for workouts, nutrition, profile, or schedule completion.
- The daily schedule content is intentionally hardcoded and view-only.
- The project is mobile-first and ready for Vercel + Capacitor deployment.
