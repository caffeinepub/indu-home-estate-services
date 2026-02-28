import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGenerateInvoice } from "@/hooks/useQueries";
import { FileText, XCircle } from "lucide-react";

interface InvoiceModalProps {
  bookingId: bigint | null;
  onClose: () => void;
}

export function InvoiceModal({ bookingId, onClose }: InvoiceModalProps) {
  const { data: invoice, isLoading } = useGenerateInvoice(bookingId);

  const paymentCfg: Record<string, { label: string; className: string }> = {
    unpaid: {
      label: "Unpaid",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    partial: {
      label: "Partial",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    paid: {
      label: "Paid",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  };

  return (
    <Dialog
      open={bookingId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md print:shadow-none print:border-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Invoice
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3 py-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        )}

        {!isLoading && !invoice && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Invoice not found. Booking may not exist.
          </div>
        )}

        {!isLoading && invoice && (
          <div className="space-y-0 print:text-black">
            {/* Header */}
            <div className="pb-3 border-b border-border">
              <p className="font-display font-semibold text-foreground text-base">
                Indu Home &amp; Estate Services
              </p>
              <p className="text-xs text-muted-foreground">
                Chikmagalur, Karnataka, India
              </p>
              <p className="text-xs text-muted-foreground">
                Proprietor: Mounith H C
              </p>
              <p className="text-xs text-muted-foreground">
                GSTIN: Applied For
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Invoice #{String(invoice.bookingId).padStart(4, "0")}
              </p>
            </div>

            {/* Service Details */}
            <div className="py-3 border-b border-border space-y-1.5">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="text-foreground font-medium text-right">
                  {invoice.serviceName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Sub-Service</span>
                <span className="text-foreground font-medium text-right">
                  {invoice.subServiceName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="text-foreground font-medium text-right">
                  {String(invoice.quantity)}
                </span>
              </div>
              {invoice.scheduledDate && (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="text-foreground font-medium text-right">
                    {invoice.scheduledDate}
                    {invoice.scheduledTime
                      ? ` at ${invoice.scheduledTime}`
                      : ""}
                  </span>
                </div>
              )}
              {invoice.address && (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-foreground font-medium text-right text-xs leading-snug">
                    {invoice.address}
                  </span>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="py-3 space-y-1.5">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-foreground font-semibold text-right">
                  ₹{invoice.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Advance Paid</span>
                <span className="text-emerald-700 font-medium text-right">
                  ₹{invoice.advanceAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm border-t border-border pt-1.5 mt-1">
                <span className="text-muted-foreground font-medium">
                  Balance Due
                </span>
                <span className="text-foreground font-semibold text-right">
                  ₹{invoice.balanceAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">
                  Technician Commission
                </span>
                <span className="text-amber-700 font-medium text-right">
                  ₹
                  {Math.round(Number(invoice.totalAmount) * 0.4).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm items-center">
                <span className="text-muted-foreground">Payment Status</span>
                <div className="flex justify-end">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      (paymentCfg[invoice.paymentStatus] ?? paymentCfg.unpaid)
                        .className
                    }`}
                  >
                    {
                      (
                        paymentCfg[invoice.paymentStatus] ?? {
                          label: invoice.paymentStatus,
                        }
                      ).label
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border print:hidden">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.print()}
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Download Invoice
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
