# CodeTask

A task manager for developers who work through code review feedback. Each task can carry a code snippet, a PR link and tags, so review comments stay next to the code they refer to.

![Status: public beta](https://img.shields.io/badge/status-public%20beta-green)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

## Why

Review comments end up scattered across PR threads, chat and notes. CodeTask keeps them in one list, with the snippet and PR link attached to each item, so nothing gets lost between rounds of review.

## Features

- Tasks with attached code snippets, syntax highlighting and one-click copy
- PR links and tags on every task
- Keyboard shortcuts for fast task management
- Shared lists
- Storage in the browser or in Supabase
- Optional Stripe billing (checkout, customer portal, webhook handler)

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 14 (App Router), React, TypeScript |
| UI | Tailwind CSS, Radix UI / shadcn, Framer Motion |
| Data and auth | Supabase (`@supabase/ssr`), Prisma schema |
| State and forms | Zustand, TanStack Query, React Hook Form, Zod |
| Payments | Stripe |
| Quality | ESLint, Prettier, Jest, Husky, CodeQL, Dependabot |

## Getting started

Requirements: Node.js 18.17 or later and pnpm (npm also works).

```bash
git clone https://github.com/imBloxi/CodeTask.git
cd CodeTask
pnpm install
cp .env.example .env.local   # then fill in your own values
pnpm dev
```

The app runs at http://localhost:3000.

### Environment variables

Copy `.env.example` and set your own values. Real keys never go into version control: `.env*` files are git-ignored except `.env.example`.

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase storage and auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase access (keep secret) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Billing (optional) |
| `NEXT_PUBLIC_APP_URL` | Redirect and webhook URLs |

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` / `pnpm format` | Lint and format |
| `pnpm type-check` | TypeScript check |
| `pnpm test` | Run Jest |

## Project structure

```
src/app/          routes: dashboard, tasks, billing, pricing, docs, login, shared lists
src/app/api/      Stripe checkout, portal, prices and webhook route handlers
src/components/   UI components (task form, header, shortcuts dialog, billing form)
prisma/           database schema
.github/          CodeQL, dependency review, Dependabot, issue and PR templates
```

## Security

Report vulnerabilities as described in [SECURITY.md](.github/SECURITY.md). CodeQL and dependency review run on pull requests.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT, see [LICENSE](LICENSE).
