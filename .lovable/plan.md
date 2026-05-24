
# CIT Document Tracker — UI Redesign (React + Tailwind)

Visual redesign of your CIT Document Tracker as a TanStack Start + Tailwind app. UI only — mock data, no backend wiring. Mirrors your repo's real screens, roles, and terminology so it can later be hooked back to your Express/MongoDB API.

## Scope clarification

- **Source repo stack** (Node/Express + Mongo + vanilla JS) cannot run here. We're rebuilding the *frontend look* in this Lovable project's React stack.
- Uses your repo's real statuses: **Received, Processing, For Approval, Approved, Released**, plus **Rejected** from your prompt brief (Pending = Received).
- No real encryption / auth / DB — mock data only. Hooks left obvious so you can wire to your API later.

## Design system (src/styles.css)

- Palette in `oklch`:
  - background: near-white `#F8FAFC`
  - foreground: deep navy `#0B1B3A`
  - primary: navy `#0B2545`, primary-glow `#13315C`
  - accent: light blue `#3B82F6`
  - gold: `#C9A24B` (Released badge, subtle highlights)
  - muted/soft gray surfaces, soft border
- Tokens: `--gradient-primary` (navy → royal), `--shadow-elegant`, radius 0.75rem
- Typography: Inter (Google Fonts), tight tracking on headings
- Status badge variants:
  - Received → slate
  - Processing → sky
  - For Approval → amber
  - Approved → emerald
  - Released → gold
  - Rejected → rose

## Routes (TanStack Start)

```
src/routes/
  __root.tsx                  # SidebarProvider + header shell
  index.tsx                   # Dashboard (admin view)
  documents.tsx               # All documents table
  documents.$docId.tsx        # Document detail (history, QR, files)
  register.tsx                # New document registration form
  qr-generator.tsx            # Generate/print QR for a doc
  qr-scanner.tsx              # Upload QR image to decode + look up
  track.tsx                   # Public tracking view (?track=<id>) styled
  scan-logs.tsx               # Auto scan_logs feed
  movements.tsx               # Manual movement log entry + list
  users.tsx                   # Admin user mgmt + online heartbeat
  profile.tsx                 # Current user profile
```

Each route has its own `head()` with unique title + description.

## Components

```
src/components/
  app-sidebar.tsx             # Navy gradient, CIT crest, collapsible icon mode
  top-header.tsx              # Search, notifications, profile, sidebar trigger
  stat-card.tsx               # Icon, label, value, delta — hover lift
  status-badge.tsx            # All 6 status variants
  document-table.tsx          # shadcn Table: displayId, name, status, owner, updated
  filter-bar.tsx              # Search + status select + date range
  document-detail/
    header.tsx                # fullDisplayId, status, owner, dates
    qr-panel.tsx              # Rendered QR + download/print
    files-panel.tsx           # Original (locked) vs Processed (release-gated)
    history-timeline.tsx      # Combined scan_logs + movements
    movement-form.tsx         # Admin-only entry
  register-form.tsx           # Document name + file dropzone (mock encrypt)
  qr-upload-dropzone.tsx      # jsqr decode of uploaded image
  online-users-strip.tsx      # Heartbeat-style green dots
  notifications-panel.tsx     # Sheet slide-over
```

QR rendering: `qrcode.react`. QR decode: `jsqr`. Charts (status overview): `recharts`. Dates: `date-fns`.

## Dashboard (index)

- Navy gradient hero band: greeting + quick actions (Register, Generate QR, Scan QR)
- 5 stat cards: Total, Processing, For Approval, Approved, Released (gold)
- 2-col: Status overview chart + Recent scan/movement timeline
- Online users strip (mock heartbeat)

## Documents page

- Filter bar (search by displayId/name, status, date range)
- Table with sortable columns + row hover
- Row actions: View detail, QR, Download (if Released)
- Pagination

## Document detail

- Header card with fullDisplayId, status, owner, timestamps
- Tabs: Overview · QR · Files · History · Movement (admin)
- Files panel: original (reference-only badge), processed (Release-gated)
- History timeline merges scan_logs (auto, public) and doc.history movements (admin), color-coded

## QR Generator

- Form: select existing document or paste ID
- Live QR preview card with Download PNG / Print / Copy track URL
- Receipt-style print layout (fullDisplayId, QR, instructions)

## QR Scanner

- Upload dropzone → decode via jsqr → show matched mock document + link to detail
- Empty/error states

## Public tracking view (`/track?track=<id>`)

- Minimal, no-auth layout
- Big status badge, fullDisplayId, timeline, download button if Released
- Auto-logs scan to mock scan_logs on mount

## Mock data

`src/lib/mock-data.ts` — documents (with internalId/displayId/verifyCode), users, scan_logs, movements, notifications. Helpers: `findByInternalId`, `addScanLog`, `addMovement`.

## Technical notes

- New packages: `qrcode.react`, `jsqr`, `recharts`, `date-fns`, `ulid`
- All colors via semantic tokens — no raw hex in components
- Sidebar uses shadcn Sidebar with `collapsible="icon"`; trigger lives in header
- Fully responsive: stat grid 1/2/3/5 cols, tables horizontal-scroll on mobile, sidebar offcanvas on mobile
- Wire points clearly marked with `// TODO: replace with API call` so you can later plug your Express endpoints

## Out of scope

- Real auth, JWT, MongoDB, IDEA-128, file encryption, real camera scanning
- Importing/migrating the vanilla-JS frontend code
- Backend changes to your CIT repo
