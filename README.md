## Notes — Next.js App

A minimal notes dashboard built with Next.js 15, React 18, Tailwind CSS, and Supabase authentication. Includes a dashboard, notes CRUD UI, and a simple profile/settings area.

### Features

- Authentication (Supabase)
- Notes list and create/edit via modal
- Responsive dashboard layout with sidebar and navbar
- Dark mode via `next-themes`

### Tech Stack

- Next.js 15 (App Router)
- React 18
- Tailwind CSS 4
- Supabase (`@supabase/supabase-js`)

### Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the dev server:

```bash
npm run dev
```

4. Visit `http://localhost:3000`.

### Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: start production server
- `npm run lint`: lint the project

### Project Structure

- `app/` — routes and pages (App Router)
- `components/` — UI components (navbar, sidebar, note modal, etc.)
- `lib/` — utilities and Supabase client
- `public/` — static assets

### Deployment

Deploy easily to Vercel. Ensure environment variables are configured in the hosting platform.
