import { BookingRow, BookingRowSkeleton } from "@/components/BookingRow";
import { InvoiceModal } from "@/components/InvoiceModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetBookings, useGetTechnicians } from "@/hooks/useQueries";
import { useServiceMaps } from "@/hooks/useServiceMaps";
import { exportToCsv } from "@/utils/exportToExcel";
import { BookOpen, Download, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface AllBookingsPageProps {
  isAdmin: boolean;
}

export function AllBookingsPage({ isAdmin }: AllBookingsPageProps) {
  const [invoiceBookingId, setInvoiceBookingId] = useState<bigint | null>(null);
  const {
    data: bookings,
    isLoading: bookingsLoading,
    isError,
  } = useGetBookings();
  const { data: technicians } = useGetTechnicians();
  const { subServiceMap, serviceMap, subServiceToServiceMap } =
    useServiceMaps();

  const handleExport = () => {
    if (!bookings || bookings.length === 0) return;
    const rows = bookings.map((b) => {
      const subServiceName =
        subServiceMap.get(b.subServiceId.toString()) ?? `#${b.subServiceId}`;
      const serviceId = subServiceToServiceMap.get(b.subServiceId.toString());
      const serviceName = serviceId
        ? (serviceMap.get(serviceId) ?? `Service #${serviceId}`)
        : "—";
      return {
        ID: String(b.id),
        Service: serviceName,
        "Sub-Service": subServiceName,
        "Property Type": b.propertyType,
        Quantity: String(b.quantity),
        "Total Amount": String(b.totalAmount),
        Advance: String(b.advanceAmount),
        Balance: String(b.balanceAmount),
        Commission: String(b.commission),
        Status: b.status,
        "Payment Status": b.paymentStatus,
        "Scheduled Date": b.scheduledDate,
        Address: b.address,
      };
    });
    exportToCsv("bookings.csv", rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            All Bookings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all service bookings across the platform.
          </p>
        </div>
        {!bookingsLoading && bookings && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </span>
            {isAdmin && (
              <Badge variant="outline" className="text-xs">
                <ShieldCheck className="w-3 h-3 mr-1 text-amber-600" />
                Admin Controls
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              onClick={handleExport}
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
          </div>
        )}
      </div>

      {bookingsLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <BookingRowSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Failed to load bookings. Please refresh the page.
        </div>
      )}

      {!bookingsLoading && !isError && bookings && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-2"
        >
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm">No bookings yet.</p>
          <p className="text-muted-foreground/60 text-xs">
            Create a booking from the Create Booking page.
          </p>
        </motion.div>
      )}

      {!bookingsLoading && !isError && bookings && bookings.length > 0 && (
        <div className="space-y-2">
          {bookings.map((booking, i) => (
            <BookingRow
              key={String(booking.id)}
              booking={booking}
              index={i}
              isAdmin={isAdmin}
              readOnly={false}
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
