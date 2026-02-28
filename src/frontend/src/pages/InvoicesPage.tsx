import { InvoiceModal } from "@/components/InvoiceModal";
import { PaymentBadge, StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBookings } from "@/hooks/useQueries";
import { useServiceMaps } from "@/hooks/useServiceMaps";
import { CalendarDays, FileText, Receipt } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function InvoicesPage() {
  const [invoiceBookingId, setInvoiceBookingId] = useState<bigint | null>(null);
  const { data: bookings, isLoading } = useGetBookings();
  const { subServiceMap, serviceMap, subServiceToServiceMap } =
    useServiceMaps();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Invoices
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and download invoices for all completed bookings.
          </p>
        </div>
        {!isLoading && bookings && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
            {bookings.length} {bookings.length === 1 ? "invoice" : "invoices"}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white shadow-xs"
            >
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && bookings && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-2"
        >
          <Receipt className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm">No invoices yet.</p>
          <p className="text-muted-foreground/60 text-xs">
            Invoices are generated automatically when bookings are created.
          </p>
        </motion.div>
      )}

      {!isLoading && bookings && bookings.length > 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Total
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    Advance
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    Balance
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Payment
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, i) => {
                  const subServiceName =
                    subServiceMap.get(booking.subServiceId.toString()) ??
                    `#${booking.subServiceId}`;
                  const serviceId = subServiceToServiceMap.get(
                    booking.subServiceId.toString(),
                  );
                  const serviceName = serviceId
                    ? (serviceMap.get(serviceId) ?? `Service #${serviceId}`)
                    : "—";

                  return (
                    <motion.tr
                      key={String(booking.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{String(booking.id).padStart(4, "0")}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-xs">
                          {serviceName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {subServiceName}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {booking.scheduledDate ? (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarDays className="w-3 h-3" />
                            {booking.scheduledDate}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-foreground text-xs">
                          ₹{booking.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className="text-emerald-700 text-xs font-medium">
                          ₹{booking.advanceAmount.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className="text-amber-700 text-xs font-medium">
                          ₹{booking.balanceAmount.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PaymentBadge paymentStatus={booking.paymentStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => setInvoiceBookingId(booking.id)}
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InvoiceModal
        bookingId={invoiceBookingId}
        onClose={() => setInvoiceBookingId(null)}
      />
    </div>
  );
}
