# Indu Homes & Estates Services

## Current State
- Full enterprise SaaS admin dashboard at `/admin` with: Dashboard overview, Bookings (Create/All/Invoices), Users, Technicians, Services, Reports, Settings, Website sections (Inspections, Quotations, Properties, Testimonials, Messages)
- Public website at `/` with: Home, About, Services, Properties, Inspections, Contact, Testimonials, Book Now pages
- Backend: Motoko canister with Users, Services, SubServices, Bookings, Technicians models and full CRUD
- Commission (40%) and Company Profit (60%) calculations in place
- CSV export in Reports, Bookings, etc.

## Requested Changes (Diff)

### Add
1. **Inventory Management page** (`/admin/inventory`) -- track chemicals, tools, materials stock; add/deduct items; low stock alerts (threshold badge); each item: name, category, quantity, unit, min_threshold, last_updated
2. **AMC Management page** (`/admin/amc`) -- Annual Maintenance Contracts; list with customer name, service type, start date, end date, value, status (active/expired/pending); renew and mark as expired actions
3. **Customer Rating System page** (`/admin/ratings`) -- view, filter, and moderate customer ratings/reviews submitted; show star rating, comment, service name, date; admin can approve/reject/delete; average rating display
4. **PDF Report Download** -- in ReportsPage, add a "Download PDF" button that generates a print-friendly PDF summary of the current filtered report (using browser print/window.print with a styled print layout)
5. New sidebar entries: Inventory, AMC, Ratings (under a new "Operations" group)
6. New routes in App.tsx for the 3 new pages
7. Dashboard cards for: Inventory Low Stock alerts count, Active AMC contracts count, Avg Rating

### Modify
- `Sidebar.tsx` -- add "Operations" group with Inventory, AMC, Ratings items
- `DashboardPage.tsx` -- add 3 new operation cards (Low Stock, Active AMC, Avg Rating)
- `App.tsx` -- register 3 new routes
- `ReportsPage.tsx` -- add PDF download button using window.print

### Remove
Nothing removed

## Implementation Plan
1. Create `InventoryPage.tsx` -- in-memory state (no backend changes), CRUD for inventory items, low stock badge
2. Create `AMCPage.tsx` -- in-memory state, AMC contract management, status badges, renew action
3. Create `RatingsPage.tsx` -- in-memory state seeded with sample ratings, approve/reject/delete, avg rating
4. Update `ReportsPage.tsx` -- add PDF print button + print-specific CSS via inline style tag
5. Update `Sidebar.tsx` -- add Operations group
6. Update `App.tsx` -- add 3 routes
7. Update `DashboardPage.tsx` -- add 3 operation summary cards
