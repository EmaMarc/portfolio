# Emanuel Marcello - Portfolio

Professional portfolio for Emanuel Marcello, a Frontend / Full Stack Developer.

It presents selected projects, frontend and full-stack skills, professional experience, and technical background through a production-oriented Next.js application.

Live: https://ema-marc.vercel.app

## Overview

This portfolio is built as a restrained editorial and technical web experience. It focuses on clear project storytelling, responsive layouts, localized Spanish and English content, and controlled interaction/motion.

The V1 production scope prioritizes performance, accessibility, SEO readiness, and a maintainable content structure over template-style effects or unnecessary dependencies.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Lenis
- App Router
- React Server Components where appropriate
- `next/image`
- `next/font`

## Key Features

- Responsive desktop and mobile experience
- Spanish and English localized routes (`/es`, `/en`)
- Root language resolver at `/`
- Custom Lycoris visual identity
- Interactive Hero and global atmospheric visuals
- Projects showcase for frontend, backend, and other work
- Backend/API visual showcases
- Experience, About, and Contact sections
- Smooth scrolling
- IntersectionObserver-based entrance reveals
- Reduced Motion support
- Keyboard-accessible mobile navigation
- SEO metadata
- Open Graph and Twitter social preview
- Canonical URLs with `hreflang` and `x-default`
- `robots.txt`
- `sitemap.xml`
- Branded favicon

## Performance & Accessibility

The portfolio uses responsive image delivery through Next Image, including prioritized above-the-fold Hero imagery and lazy loading for non-critical media where appropriate.

Motion and atmospheric effects are implemented as progressive enhancement, with Reduced Motion support and cleanup for browser observers/listeners. Navigation and page structure are built with keyboard access, visible focus states, semantic sections, and accessible labels in mind.

The app does not rely on unnecessary third-party scripts for the core experience.

## SEO & Production

V1 includes localized metadata, canonical URLs, Spanish/English language alternates, `x-default`, Open Graph metadata, Twitter card metadata, a social preview image, `robots.txt`, and `sitemap.xml`.

Production hosting: Vercel

Live: https://ema-marc.vercel.app

## Project Structure

```text
src/
  app/         App Router routes, layouts, metadata, robots, sitemap, and global styles.
  components/  UI sections, layout components, and visual effects.
  content/     Typed portfolio content for profile, projects, experience, skills, and SEO.
  lib/         Shared locale and site URL helpers.
  types/       Project-level TypeScript declarations.

public/
  brand/       Branded Lycoris assets.
  media/       Portfolio media for Hero, profile, projects, and credentials.
```

## Running Locally

```bash
git clone https://github.com/EmaMarc/portfolio.git
cd portfolio
npm install
npm run dev
```

Open http://localhost:3000.

Production checks:

```bash
npm run lint
npm run build
```

No environment variables are required for the portfolio to run locally.

## Languages

Spanish: https://ema-marc.vercel.app/es

English: https://ema-marc.vercel.app/en

The root route (`/`) resolves to a supported language route.

## Author

Emanuel Marcello

Portfolio: https://ema-marc.vercel.app

GitHub: https://github.com/EmaMarc

LinkedIn: https://www.linkedin.com/in/emamarcello

GitHub repository: https://github.com/EmaMarc/portfolio
