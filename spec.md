# Indu Home & Estate Services — Enterprise Admin Dashboard

## Current State

The app uses TanStack Router with a multi-page structure and a top navbar. Files:
- `App.tsx` — router shell with top Navbar + main content area
- `components/Navbar.tsx` — horizontal top nav with dropdown menus
- `components/BookingForm.tsx`, `BookingRow.tsx`, `DashboardCards.tsx`, `InvoiceModal.tsx`, `StatusBadge.tsx`, `StatusTimeline.tsx`, `TechnicianCard.tsx`, `UserCard.tsx`
- `pages/` — 12 page components (DashboardPage, CreateBookingPage, AllBookingsPage, InvoicesPage, AddUserPage, AllUsersPage, AddTechnicianPage, TechnicianListPage, AddServicePage, ServiceListPage, TechnicianJobsPage, CustomerBookingsPage)
- `hooks/useQueries.ts` — all backend hooks (unchanged)
- `constants/catalog.ts` — static SERVICES + SUB_SERVICES arrays (unchanged)
- Router: TanStack Router (`@tanstack/react-router`)

All business logic works: booking creation, pricing, commission (40%), company profit (60%), status transitions, payment marking, invoice generation, WhatsApp message simulation.

## Requested Changes (Diff)

### Add

**Layout Shell:**
- Fixed left vertical sidebar (240px wide, collapsible to 64px icon-only mode)
- Sidebar toggle button (hamburger / chevron)
- Top header bar (fixed, full width minus sidebar width)
- Main content area that shifts with sidebar state
- Dark mode support via `next-themes` (already installed)

**Sidebar contents:**
- Company logo + name at top (collapses to icon only)
- Navigation groups with icons:
  - Dashboard (LayoutDashboard icon)
  - Bookings section (BookOpen icon, collapsible submenu):
    - Create Booking
    - All Bookings
    - Invoices
  - Users section (Users icon, collapsible submenu):
    - Add User
    - All Users
  - Technicians section (Wrench icon, collapsible submenu):
    - Add Technician
    - Technician List
  - Services section (Package icon, collapsible submenu):
    - Add Service
    - Service List
  - Reports (BarChart2 icon)
  - Settings (Settings icon)
- Bottom of sidebar: current user avatar + role badge + logout placeholder
- Active route highlight with accent color
- Smooth hover/active states

**Top Header Bar:**
- Left: Sidebar toggle button + page title (breadcrumb style)
- Center: Search bar (UI only, no live search needed)
- Right: Notification bell (badge count), Dark Mode toggle, Profile avatar with role badge dropdown

**New pages:**
- `ReportsPage.tsx` — Revenue summary cards + Technician payout table + date filter UI (static/computed from bookings data)
- `SettingsPage.tsx` — Company name display, commission % display (40%), advance % display (30%), dark mode toggle, logo placeholder

**Dashboard page upgrade:**
- 9 cards in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each card: icon, label, value, subtle color accent
- Cards auto-update from live `getBookings()` data

**Dark mode:**
- Use `next-themes` ThemeProvider (wrap in main.tsx or App.tsx)
- CSS variables already support dark mode via Tailwind `dark:` classes
- Dark mode toggle in header bar

### Modify

- `App.tsx` — Replace top navbar layout with sidebar + header layout. Keep TanStack Router. Add ThemeProvider wrapper.
- `components/Navbar.tsx` — Replace entirely with `components/Sidebar.tsx` (vertical left sidebar) + `components/Header.tsx` (top bar)
- All page components — Keep all logic identical, only update page wrapper styles to match enterprise dashboard feel (proper page headers, wider content, better card layouts)
- `DashboardPage.tsx` — Update card grid layout to 3-col enterprise style
- `main.tsx` — Add `ThemeProvider` from `next-themes`

### Remove

- `components/Navbar.tsx` (horizontal top nav replaced by vertical sidebar)
- Mobile hamburger nav from old Navbar (replaced by proper sidebar collapse)

## Implementation Plan

1. Install nothing new — `next-themes`, `recharts`, `zustand`, `motion`, all shadcn components are already installed
2. Create `components/Sidebar.tsx` — full vertical sidebar with collapsible submenu groups, active state, collapse toggle
3. Create `components/Header.tsx` — top bar with search, notification, dark mode toggle, profile/role switcher
4. Update `App.tsx` — sidebar + header shell layout, ThemeProvider, role state management
5. Update `main.tsx` — add ThemeProvider wrapper
6. Update `DashboardPage.tsx` — 3-column grid, KPI cards with trend indicators
7. Create `pages/ReportsPage.tsx` — revenue/profit/payout summary from bookings data
8. Create `pages/SettingsPage.tsx` — company settings display + dark mode toggle
9. Add Reports + Settings routes to router in App.tsx
10. Ensure all existing page logic is untouched (BookingForm, BookingRow, InvoiceModal all stay the same)
11. Run typecheck and build to confirm zero errors
