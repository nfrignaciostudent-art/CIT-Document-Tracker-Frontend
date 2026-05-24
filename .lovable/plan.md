# Logo → Text-only + Status Badge Redesign

## 1. Kill the logo, keep a standout wordmark

Goal: no SVG/icon logos anywhere. Just a clean, premium text mark — "CIT DocTracker" — that still feels like a brand, not plain text.

**`src/components/brand/logo.tsx`**
- Delete the three SVG concepts (`ShieldMark`, `MonogramMark`, `EmblemMark`) and the `Logo` export.
- Replace `Wordmark` with a pure text version:
  - "CIT DocTracker" with tight tracking, semibold/bold weight.
  - Subtle gradient on the text (navy → royal blue → faint gold accent on "Tracker") using `bg-clip-text text-transparent`.
  - Optional small caps subtitle "Document & QR Generator" in muted foreground, wide letter-spacing.
  - Size variants: `sm` (sidebar/header) and `lg` (landing hero / dashboard greeting).
- Keep the `Wordmark` named export so existing imports keep working; remove the `LogoVariant` type.

**Call sites to clean up** (remove any standalone `<Logo />` usage, switch to the new text `Wordmark`):
- `src/routes/__root.tsx`
- `src/routes/index.tsx` (landing nav + hero badge)
- `src/routes/dashboard.tsx` (page header / greeting block)
- `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/logout.tsx`
- `src/routes/track.tsx`, `src/routes/settings.tsx`, `src/routes/documents.tsx`
- `src/components/app-sidebar.tsx`

Also remove the favicon-style icon block if it sits next to the wordmark on the landing hero and dashboard header, so the wordmark stands alone.

## 2. Redesign status badges (modern SaaS chips)

File: **`src/components/status-badge.tsx`**

Rebuild the chip so it reads like Linear / Vercel / Stripe:

- **Shape**: full pill, slightly tighter horizontal padding (`px-2.5 py-0.5`), height ~22px.
- **Border**: hairline 1px ring at very low opacity (`ring-1 ring-inset` with `~/15`).
- **Surface**: glassy tinted background — layered `bg-gradient-to-b from-{color}/12 to-{color}/6` over `backdrop-blur-md`.
- **Shadow**: soft, low-spread (`shadow-[0_1px_2px_-1px_oklch(0_0_0/0.08),inset_0_1px_0_oklch(1_0_0/0.06)]`).
- **Typography**: `text-[11px] font-medium tracking-tight`, sentence case, no uppercase.
- **Dot**: 6px solid dot with a faint outer glow ring (`shadow-[0_0_0_3px_{color}/15]`), no `animate-ping` (too cartoonish). Reserve a gentle `animate-pulse` only for `Processing`.
- **Hover**: smooth 200ms transition — ring opacity bumps slightly, background brightens a hair, subtle `translate-y-[-0.5px]`. No scale jumps.
- **Dark mode**: same tokens, brighter text, dimmer surface.

Color register (refined, less candy):
- Released → warm amber
- Approved → emerald
- For Approval → soft orange
- Processing → sky (with the gentle pulse on the dot)
- Received → neutral slate
- Rejected → muted red

No changes to the `DocStatus` type or any consumer — drop-in replacement.

## Out of scope

- No data model, route, or auth changes.
- No restyle of other badges, buttons, or cards beyond the status chip.

## Technical notes

- All colors stay in the existing Tailwind + token system (`oklch` via `src/styles.css` where applicable). No new dependencies.
- Wordmark gradient uses the existing navy/royal/gold tokens already defined for the old logo so brand color continuity is preserved.
- Keeping the `Wordmark` export name + `className` prop avoids touching every call site's layout.
