# Omega Theme Guide

This document describes the current visual theme used across the site so new pages stay consistent with the homepage and /ai styling.

## Brand feel

- Clean, modern, professional, and conversion-focused.
- Light theme with crisp whites, slate grays, and fuchsia/indigo accents.
- Soft gradients for warmth and depth, never heavy neon.

## Typography

- Primary type: Geist Sans (loaded in `src/app/layout.tsx`).
- Monospace: Geist Mono.
- Headings: bold or semibold, tight tracking.
- Body: clear, readable text with slate tones.
- Small labels: uppercase, wide tracking for section tags.

Common sizing patterns:

- H1: `text-4xl sm:text-5xl lg:text-6xl font-bold`
- H2: `text-3xl sm:text-4xl font-bold`
- H3: `text-2xl font-semibold`
- Body: `text-sm` or `text-lg` with `text-slate-600/700`
- Microcopy: `text-xs uppercase tracking-[0.2em]`

## Color palette

Core:

- Background: white (`bg-white`)
- Primary text: slate-900 (`text-slate-900`)
- Secondary text: slate-600/700 (`text-slate-600`, `text-slate-700`)
- Borders: slate-200/300 (`border-slate-200`, `border-slate-300`)

Accent:

- Fuchsia: `from-fuchsia-500` + `to-indigo-500` for CTAs
- Light accent surfaces: `bg-fuchsia-50`, `bg-indigo-50`
- Accent text: `text-fuchsia-700`, `text-indigo-600`

Gradients used:

- CTA: `bg-gradient-to-r from-fuchsia-500 to-indigo-500`
- Background glows: `from-fuchsia-100 to-indigo-100` or `from-indigo-100 to-sky-100`

## Layout & spacing

- Page container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Section spacing: `py-16` or `py-20` with consistent vertical rhythm.
- Grids: `grid gap-6/10`, typically `lg:grid-cols-2` or `lg:grid-cols-[1.05fr_0.95fr]`.

## Components

Buttons:

- Primary: rounded-xl gradient, bold text, shadow
  - `rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white`
  - Hover: `hover:from-fuchsia-400 hover:to-indigo-400`
  - Focus: `focus-visible:ring-2 focus-visible:ring-fuchsia-500`
- Secondary: bordered, white background
  - `rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700`
- Tertiary: subtle pill or soft background

Cards:

- `rounded-2xl` or `rounded-3xl`
- `border border-slate-200 bg-white`
- `shadow-sm` for light cards, `shadow-xl` for hero cards.

Badges / Eyebrows:

- Uppercase tag: `text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600`
- Use for section labels like "Benefits", "Pricing", "Contact".

Forms:

- Inputs: `rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700`
- Focus ring: `focus:ring-2 focus:ring-fuchsia-500`
- Form container: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`

Navigation:

- Desktop nav uses a pill container:
  - `rounded-full border border-slate-200/70 bg-white/70 px-1.5 py-1 text-xs shadow-sm`
- Dropdown menus are compact cards with icon blocks and short descriptions.

## Motion

- Subtle transitions only: `transition`, `hover:-translate-y-0.5`, soft color shifts.
- No heavy animations or bouncing effects.

## Copy tone

- Direct, outcome-focused, confident.
- Avoid overly casual language; emphasize clarity and trust.

## Consistency checklist for new pages

- Use `max-w-7xl` containers and standard padding.
- Keep the fuchsia/indigo gradient for primary CTAs.
- Use slate text for body copy with consistent hierarchy.
- Match form styles to the homepage form.
- Prefer light backgrounds; avoid dark or neon sections unless absolutely required.
