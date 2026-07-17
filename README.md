# ML Roadmap

A simple machine learning learning roadmap. Browse topics, read details and resources, and track your own progress in the browser.

## Features

- Timeline roadmap with topics, sub-labels, and references
- Reference badges (Playlist, Book, Video, Article, Custom)
- Local progress tracking (`Todo`, `In Progress`, `Done`)
- Admin tools to add, edit, reorder, and delete content
- Social links in the navbar

## Tech Stack

- [Next.js](https://nextjs.org)
- [Convex](https://convex.dev)
- [Clerk](https://clerk.com)
- [Tailwind CSS](https://tailwindcss.com)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

3. Run Convex and the app:

```bash
npx convex dev
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin

- Sign in at `/sign-in`
- Admin users need `role: "admin"` in Clerk public metadata

## Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — run production build
- `npm run lint` — run ESLint
