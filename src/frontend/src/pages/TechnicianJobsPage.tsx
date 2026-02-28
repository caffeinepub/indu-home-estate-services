import { BookingRow, BookingRowSkeleton } from "@/components/BookingRow";
import { InvoiceModal } from "@/components/InvoiceModal";
import { SERVICES, SUB_SERVICES } from "@/constants/catalog";
import { useGetBookings, useGetTechnicians } from "@/hooks/useQueries";
import { Wrench } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

interface TechnicianJobsPageProps {
  activeTechnicianId: bigint | null;
}

export function TechnicianJobsPage({
  activeTechnicianId,
}: TechnicianJobsPageProps) {
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

  const assignedBookings = useMemo(() => {
    if (activeTechnicianId === null) return [];
    return (bookings ?? []).filter(
      (b) =>
        b.technicianId !== undefined && b.technicianId === activeTechnicianId,
    );
  }, [bookings, activeTechnicianId]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            My Jobs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTechnicianId !== null
              ? `Showing bookings assigned to Technician #${String(activeTechnicianId)}.`
              : "Enter your Technician ID in the navbar to view your assigned jobs."}
          </p>
        </div>
        {activeTechnicianId !== null && !bookingsLoading && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
            {assignedBookings.length} assigned
          </span>
        )}
      </div>

      {activeTechnicianId === null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-2"
        >
          <Wrench className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm">
            Enter your Technician ID in the navigation bar to view your assigned
            bookings.
          </p>
        </motion.div>
      )}

      {activeTechnicianId !== null && bookingsLoading && (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <BookingRowSkeleton key={i} />
          ))}
        </div>
      )}

      {activeTechnicianId !== null &&
        !bookingsLoading &&
        assignedBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-1"
          >
            <p className="text-muted-foreground text-sm">
              No bookings assigned to Technician #{String(activeTechnicianId)}.
            </p>
          </motion.div>
        )}

      {activeTechnicianId !== null &&
        !bookingsLoading &&
        assignedBookings.length > 0 && (
          <div className="space-y-2">
            {assignedBookings.map((booking, i) => (
              <BookingRow
                key={String(booking.id)}
                booking={booking}
                index={i}
                isAdmin={false}
                readOnly={true}
                subServiceMap={subServiceMap}
                serviceMap={serviceMap}
                subServiceToServiceMap={subServiceToServiceMap}
                technicians={technicians ?? []}
                onViewInvoice={setInvoiceBookingId}
              />
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
