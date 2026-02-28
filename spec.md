# Indu Homes & Estates Services

## Current State
- The app has two route trees: dashboard (at `/`) and website (at `/website/*`)
- The website navbar (`WebNavbar.tsx`) currently shows an "Admin Dashboard" button linking to `/` (the dashboard) — this is visible to public website visitors
- The website's root URL is `/website` — the public site is not at the root path `/`
- `ServicesPage.tsx` shows service cards that expand inline to show sub-services as simple price+name rows only — no images, no descriptions per sub-service
- The Services page already has the STATIC_SERVICES data with descriptions, but sub-services lack individual images and descriptions
- Existing generated images: hero, property photos, logo, Chikmagalur map — no service-category images

## Requested Changes (Diff)

### Add
- Route: make `/` (root) redirect to `/website` so the public website is the default landing URL
- Make `/admin` the new root for the admin dashboard (all dashboard routes move to `/admin/*`)
- Service card expansion: when a service card is clicked, open a modal or expanded panel showing sub-service cards with:
  - Real image per sub-service
  - Proper description per sub-service
  - Price and "Book Now" CTA
- Generate service category images (one per category: Plumbing, Electrical, Deep Cleaning, Painting, AC Service, Pest Control, Estate Maintenance) for the service cards
- Generate sub-service images for each subcategory item

### Modify
- `App.tsx`: Move all dashboard routes under `/admin` prefix. Change the root `/` to redirect to `/website`. Update the not-found route to also redirect to `/website`.
- `WebNavbar.tsx`: Remove the "Admin Dashboard" button/link entirely from the public navbar (both desktop and mobile menu). The admin dashboard should not be accessible from the public website.
- `WebFooter.tsx`: Remove any admin dashboard link if present
- `ServicesPage.tsx`: Enhance sub-service expansion panel to show image cards with descriptions, not just price rows
- `STATIC_SERVICES`: Add `image` and `description` fields per sub-service item
- All internal website links (to `/website/*`) remain unchanged
- All dashboard-internal links already using relative routes — update any that reference `/` as the dashboard root to `/admin`

### Remove
- "Admin Dashboard" button from `WebNavbar.tsx` (desktop and mobile)
- Any link from the public website to the admin dashboard

## Implementation Plan

1. Generate 7 service category hero images (one per main service)
2. Generate representative sub-service images (grouped by category — can reuse per category)
3. Update `App.tsx`:
   - Change dashboard routes parent path from `/` to `/admin`
   - Root `/` redirects to `/website`
   - Not-found redirects to `/website`
   - Update `websiteLayoutRoute` to stay at `/website`
4. Update `WebNavbar.tsx`: remove Admin Dashboard link from desktop nav actions and mobile menu
5. Update `Sidebar.tsx` or any component that links back to `/` to now link to `/admin`
6. Update `ServicesPage.tsx` STATIC_SERVICES: add `image` field per service and per sub-service, add `subDescription` per sub-service
7. Upgrade the ServicesPage sub-service expanded panel: replace simple price rows with image cards showing image, name, description, price, Book Now button
8. Verify all enquiry forms (contact, inspection, quotation) still point to correct dashboard backend routes
