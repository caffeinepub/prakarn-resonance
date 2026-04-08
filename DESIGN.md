# Prakarn Resonance — Design Brief

## Purpose & Context
Educational content management platform for instructor-led learning. Instructors upload and manage video lectures and notes; students browse, search, and access curated content through role-based views.

## Tone & Aesthetic
Editorial + Academic. Structured, intentional, approachable. Clean grids prioritize content clarity over decoration. Geometric precision meets human warmth through warm accents.

## Color Palette

| Token | Light | Dark |
|-------|-------|------|
| Primary (Indigo) | 0.48 0.18 264 | 0.65 0.20 264 |
| Accent (Warm) | 0.62 0.22 58 | 0.70 0.24 58 |
| Foreground | 0.23 0.02 265 | 0.93 0.02 250 |
| Background | 0.985 0 0 | 0.12 0.01 256 |
| Muted | 0.92 0 0 | 0.25 0.01 256 |
| Border | 0.88 0.02 248 | 0.22 0.01 256 |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 |

## Typography

| Layer | Font | Usage |
|-------|------|-------|
| Display | Space Grotesk | Headers, section titles, CTAs — geometric clarity |
| Body | Nunito | Content, metadata, descriptions — optimal readability |
| Mono | JetBrains Mono | Code blocks, technical metadata (if needed) |

Type scale: 12px, 14px, 16px, 18px, 20px, 24px, 32px. Weight hierarchy: 400 (body), 600 (semibold labels), 700 (display). Line height: 1.5 (body), 1.2 (display).

## Shape Language
Border radius: 8px (cards, buttons, inputs). Spacing: 4px base unit. Density: generous (16px gaps between cards). Shadows: minimal, semantic — only on hover or elevation states.

## Structural Zones

| Zone | Treatment | Depth |
|------|-----------|-------|
| Header | Sticky, border-bottom, elevated | Primary + foreground |
| Sidebar | Fixed left nav, elevated bg | Sidebar theme |
| Main Content | Card grid with 16px gaps | Background + cards |
| Footer | Light border-top, minimal contrast | Muted |
| Card Surface | Subtle border, shadow-sm on hover | Secondary layer |

## Component Patterns
- **Cards**: `.card-interactive` — rounded, bordered, shadow on hover, clickable surface
- **Buttons**: `.btn-primary` (indigo fill), `.btn-secondary` (bordered secondary)
- **Grid**: `.content-grid` — responsive 1–3 columns (mobile-first)
- **Inputs**: Bordered, muted bg, focus ring on primary

## Motion & Interaction
Transition: smooth (0.3s cubic-bezier(0.4, 0, 0.2, 1)) on all interactive elements. No decorative animations. Hover states: border accent shift, shadow elevation. Focus: primary ring on keyboard navigation.

## Differentiation
Clean grid-based content library separates instructor (upload/manage view) from student (view-only library). Intentional card spacing creates breathing room. No decoration — every pixel serves information clarity.

## Constraints
- No full-page gradients or decorative overlays
- Primary color reserves for trust (headers, primary CTAs only)
- Warm accent (orange) used sparingly for secondary actions, highlights, metadata
- All shadows token-based and semantic
- No arbitrary color application — every color decision mapped to semantic token
