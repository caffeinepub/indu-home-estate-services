# Indu Homes & Estates Services

## Current State
- Public website with routes: /, /about, /services, /properties, /inspections, /contact, /testimonials, /track-booking, /book-now
- WebNavbar has NAV_LINKS array for navigation links
- App.tsx has websiteLayoutRoute with children routes
- Admin dashboard at /admin

## Requested Changes (Diff)

### Add
- New page: `/faq` — standalone FAQ page with 15+ questions grouped by topic (Bookings, Payments, Services, General)
- Each FAQ item has expand/collapse accordion behavior
- `/faq` added to WebNavbar NAV_LINKS
- `/faq` route added to websiteLayoutRoute in App.tsx

### Modify
- WebNavbar: add FAQ link to NAV_LINKS array
- App.tsx: import FAQPage, add websiteFaqRoute, add to routeTree

### Remove
- Nothing

## Implementation Plan
1. Create FAQPage component at src/frontend/src/website/pages/FAQPage.tsx
   - 15+ FAQs grouped into 4 categories: General, Bookings, Payments, Services
   - Accordion expand/collapse with smooth animation
   - Hero banner with page title
   - Search/filter bar
2. Add FAQ to WebNavbar NAV_LINKS
3. Add FAQPage route to App.tsx
