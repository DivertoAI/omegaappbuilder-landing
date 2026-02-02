# Omega Theme

## Overview
- Style direction: clean, outcome-focused, and modern with light surfaces.
- Visual tone: confident, technical, and premium without being cold.

## Typography
- Primary: Geist Sans (loaded in `src/app/layout.tsx` via `next/font/google`).
- Monospace: Geist Mono for code and technical accents.
- Hierarchy: strong headline contrast (text-4xl/5xl) and breathable body copy.

## Color System
- Base background: white.
- Primary text: slate-900.
- Secondary text: slate-600/500.
- Accent: fuchsia to indigo gradients for CTAs and highlights.
- Subtle surfaces: slate-50/100 panels with soft borders (slate-200).

## Layout & Spacing
- Primary container: `max-w-7xl` with 4/6/8 responsive gutters.
- Rounded geometry: 2xl/3xl corners on cards and panels.
- Vertical rhythm: generous section padding (py-16/24).

## Components
- Primary CTA: gradient button (fuchsia-500 to indigo-500) with hover lift.
- Secondary CTA: white surface with slate border.
- Cards: light background, thin border, soft shadow for depth.
- Navigation: minimal, sticky header with translucent backdrop.

## Motion
- Soft transitions on hover states (150-200ms).
- Dropdowns and panels use fade + translate for polish.

## Imagery & Media
- Subtle gradient glows behind hero content.
- Video embeds sit in bordered, rounded frames for clarity.
