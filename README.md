## Notes App (Next.js + Supabase)

A simple, modern notes app with authentication, a dashboard, and client-side note management. Great for a quick demo or internship showcase and easy to extend to a full backend.

### Features

- Authentication with Supabase (register, login, resend confirmation)
- Notes CRUD in the browser (localStorage)
- Pin/unpin notes and quick counts
- Clean UI with reusable components
- Loading states on auth for good UX
- Search/filter by title, content, tags on the Notes page
- Optional floating mascot (GIF/Lottie) bottom-left

### Tech Stack

- Next.js App Router, React, TypeScript
- Supabase auth via `@supabase/ssr`
- Tailwind-based UI components

### Getting Started

1. Install dependencies

```bash
npm install
```

2. Environment variables (create `.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the app

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: start production server
- `npm run lint`: lint the project

### Project Structure

```
app/
  login/, register/        # Auth pages
  dashboard/               # Authenticated area
    notes/                 # Notes page (create, edit, pin, delete)
components/
  note-card.tsx            # Single note UI
  note-modal.tsx           # Create/Edit dialog
  floating-mascot.tsx      # Optional animated character
lib/
  supabaseClient.ts        # Supabase browser client
public/
  ... assets
```

### How Notes Work

- Notes are stored in `localStorage` for quick demos (no server DB).
- On load, notes are read and mapped to a typed model; on change they are serialized back.
- Easy to migrate to a real database later (e.g., Supabase/Postgres).

### Customization Tips

- Mascot: drop a GIF/PNG in `public` and set `imageSrc` on `FloatingMascot`.
- Lottie animations: pass a `jsonUrl` (uses `lottie-react`).
- Search: built into Notes page (filters title, content, tags).

### Deployment

Deploy to Vercel; configure the same env vars in project settings.

### License

For personal/educational use. Check third-party assets (icons, GIFs, Lottie) for their licenses before commercial use.
