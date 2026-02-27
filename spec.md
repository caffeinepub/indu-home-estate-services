# Indu Home & Estate Services

## Current State

- Full-stack ICP app with Motoko backend and React frontend
- Static in-memory service/sub-service catalog (`catalog.ts`) with string IDs
- Booking form with service/sub-service dropdowns, quantity, date, time, address, notes
- Backend `Booking` model has: totalAmount, advanceAmount, commission, paymentStatus, status, technicianId, etc.
- Dashboard cards: Total Bookings, Total Revenue, Advance Collected, Commission Earned, Pending Payments, Assigned, Completed, Cancelled, Today's
- Admin booking list with status change, assign technician, mark advance paid, view invoice
- Technician panel: filtered assigned bookings, mark in-progress / completed
- Customer panel: my bookings with status timeline
- Invoice modal (view + print)
- `markPayment()` backend function sets paymentStatus = "partial"
- No `balanceAmount` stored in booking; no `markFullyPaid` backend function
- No pricing preview when sub-service is selected
- No WhatsApp message preview/copy panel
- Dashboard "Total Revenue" sums ALL bookings, not just paid ones

## Requested Changes (Diff)

### Add

1. **Pricing preview panel** in BookingForm: when a sub-service is selected, show Base Price, Quantity input label with pricing type hint, live Total Amount, Advance (30%), Balance (70%)
2. **`price` and `pricingType` properties** on `CatalogSubService` in `catalog.ts` so frontend can compute price client-side
3. **`balanceAmount` field** on `Booking` in backend (stored = totalAmount - advanceAmount)
4. **`markFullyPaid(bookingId)`** backend function — sets paymentStatus = "paid"
5. **`cancelBooking(bookingId)`** backend function (alias to updateBookingStatus cancelled)
6. **WhatsApp message preview** panel shown after successful booking creation: formatted message with Customer Name, Service, Sub-Service, Date, Total, Advance — plus a copy-to-clipboard button
7. **"Mark Fully Paid"** and **"Cancel Booking"** admin action buttons in BookingRow (alongside existing "Mark Advance Paid")
8. **"Mark Completed"** button for admin (shortcut to set status = completed if in inProgress)
9. **Service-wise booking count** section on dashboard (already exists in DashboardCards but broken because subServiceId is always 0n — fix by storing sub-service string key in notes or fixing the ID mapping)

### Modify

1. **`catalog.ts`** — add `price: number` and `pricingType: "fixed" | "per_sqft" | "per_acre"` to each `CatalogSubService` entry with realistic INR prices
2. **`BookingForm`** — add live pricing preview panel below sub-service selection; pass correct subServiceId to backend by using the numeric backend ID (or keep 0n for now but display computed amounts from catalog)
3. **Dashboard** — fix "Total Revenue" to sum only bookings where paymentStatus === "paid"; "Advance Collected" already correct (partial or paid)
4. **BookingRow admin controls** — add "Mark Fully Paid", "Cancel Booking" buttons; add "Mark Completed" shortcut for admins
5. **Backend `Booking`** — add `balanceAmount: Nat` field
6. **Backend `createBooking()`** — compute and store `balanceAmount = totalAmount - advanceAmount`
7. **`backend.d.ts`** — add `balanceAmount` to `Booking`, add `markFullyPaid` and `cancelBooking` signatures
8. **`useQueries.ts`** — add `useMarkFullyPaid` and `useCancelBooking` hooks

### Remove

- Nothing removed

## Implementation Plan

1. Update `catalog.ts`: add `price` and `pricingType` to `CatalogSubService` interface and all entries with realistic INR prices
2. Update `src/backend/main.mo`: add `balanceAmount` to `Booking` type, compute in `createBooking()`, add `markFullyPaid()` and `cancelBooking()` functions
3. Regenerate / manually update `backend.d.ts` to include new fields and functions
4. Update `useQueries.ts`: add `useMarkFullyPaid` and `useCancelBooking` hooks
5. Update `BookingForm` in `App.tsx`: add pricing preview panel (base price, total, advance, balance) that reacts to sub-service + quantity changes
6. Update `BookingForm`: show WhatsApp message preview panel after booking success with copy-to-clipboard
7. Update `DashboardCards`: fix Total Revenue to filter paid-only bookings
8. Update `BookingRow`: add "Mark Fully Paid", "Cancel Booking", "Mark Completed" admin buttons
