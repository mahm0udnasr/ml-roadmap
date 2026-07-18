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
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-frontend-api-url.clerk.accounts.dev
```

3. Set Convex environment variables:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-clerk-frontend-api-url.clerk.accounts.dev
npx convex env set ADMIN_EMAILS you@example.com
```

`ADMIN_EMAILS` is a comma-separated allowlist of Clerk-verified emails that can act as admins. This is controlled in Convex, not in Clerk user metadata.

4. Run Convex and the app:

```bash
npx convex dev
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin

- Sign in at `/sign-in` (signed-in users are redirected to `/`)
- Add your Clerk account email to `ADMIN_EMAILS` in Convex
- Optional: persist an admin permanently after first sign-in:

```bash
npx convex run admins:grantAdmin --args '{"tokenIdentifier":"YOUR_TOKEN_IDENTIFIER","email":"you@example.com"}'
```

Find `tokenIdentifier` in Convex function logs after signing in, or use the email allowlist alone.

## Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — run production build
- `npm run lint` — run ESLint
