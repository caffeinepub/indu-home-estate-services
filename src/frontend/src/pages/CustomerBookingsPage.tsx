import { BookingRow, BookingRowSkeleton } from "@/components/BookingRow";
import { InvoiceModal } from "@/components/InvoiceModal";
import { StatusTimeline } from "@/components/StatusTimeline";
import { SERVICES, SUB_SERVICES } from "@/constants/catalog";
import { useGetBookings, useGetTechnicians } from "@/hooks/useQueries";
import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export function CustomerBookingsPage() {
  const [invoiceBookingId, setInvoiceBookingId] = useState<bigint | null>(null);
  const { data: bookings, isLoading: bookingsLoading } = useGetBookings();
  const { data: technicians } = useGetTechnicians();

  const subServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ss of SUB_SERVICES) map.set(ss.id, ss.name);
    return map;
  }, []);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of SERVICES) map.set(s.id, s.name);
    return map;
  }, []);

  const subServiceToServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ss of SUB_SERVICES) map.set(ss.id, ss.serviceId);
    return map;
  }, []);

  const myBookings = useMemo(
    () => (bookings ?? []).filter((b) => b.customerId === 0n),
    [bookings],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            My Bookings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track the status and history of your service bookings.
          </p>
        </div>
        {!bookingsLoading && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
            {myBookings.length}{" "}
            {myBookings.length === 1 ? "booking" : "bookings"}
          </span>
        )}
      </div>

      {bookingsLoading && (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <BookingRowSkeleton key={i} />
          ))}
        </div>
      )}

      {!bookingsLoading && myBookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-2"
        >
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm">No bookings found.</p>
          <p className="text-muted-foreground/60 text-xs">
            Create a booking to get started.
          </p>
        </motion.div>
      )}

      {!bookingsLoading && myBookings.length > 0 && (
        <div className="space-y-3">
          {myBookings.map((booking, i) => (
            <div key={String(booking.id)} className="space-y-1">
              <BookingRow
                booking={booking}
                index={i}
                isAdmin={false}
                readOnly={false}
                subServiceMap={subServiceMap}
                serviceMap={serviceMap}
                subServiceToServiceMap={subServiceToServiceMap}
                technicians={technicians ?? []}
                onViewInvoice={setInvoiceBookingId}
              />
              <StatusTimeline status={booking.status} />
            </div>
          ))}
        </div>
      )}

      <InvoiceModal
        bookingId={invoiceBookingId}
        onClose={() => setInvoiceBookingId(null)}
      />
    </div>
  );
}
