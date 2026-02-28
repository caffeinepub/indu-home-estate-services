import { BookingForm } from "@/components/BookingForm";

export function CreateBookingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Create Booking
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a service and fill in the details to create a new booking.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6">
        <BookingForm />
      </div>
    </div>
  );
}
