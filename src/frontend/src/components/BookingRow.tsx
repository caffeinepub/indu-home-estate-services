import type { Booking, Technician } from "@/backend";
import { InvoiceModal } from "@/components/InvoiceModal";
import { PaymentBadge, StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAssignTechnician,
  useCancelBooking,
  useMarkFullyPaid,
  useMarkPayment,
  useUpdateBookingStatus,
} from "@/hooks/useQueries";
import {
  BookingStatus,
  STATUS_CONFIG,
  STATUS_LABEL,
  formatDate,
  getValidNextStatuses,
  sendWhatsAppNotification,
} from "@/lib/helpers";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  Wrench,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function BookingRowSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-40" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

interface BookingRowProps {
  booking: Booking;
  index: number;
  isAdmin: boolean;
  readOnly?: boolean;
  subServiceMap: Map<string, string>;
  serviceMap: Map<string, string>;
  subServiceToServiceMap: Map<string, string>;
  technicians: Technician[];
  onViewInvoice?: (bookingId: bigint) => void;
}

export function BookingRow({
  booking,
  index,
  isAdmin,
  readOnly,
  subServiceMap,
  serviceMap,
  subServiceToServiceMap,
  technicians,
  onViewInvoice,
}: BookingRowProps) {
  const [invoiceBookingId, setInvoiceBookingId] = useState<bigint | null>(null);

  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateBookingStatus();
  const { mutateAsync: assignTechnician, isPending: isAssigning } =
    useAssignTechnician();
  const { mutateAsync: markPayment, isPending: isMarkingPayment } =
    useMarkPayment();
  const { mutateAsync: markFullyPaid, isPending: isMarkingFull } =
    useMarkFullyPaid();
  const { mutateAsync: cancelBooking, isPending: isCancelling } =
    useCancelBooking();

  const subServiceName =
    subServiceMap.get(booking.subServiceId.toString()) ??
    `#${booking.subServiceId}`;
  const serviceId = subServiceToServiceMap.get(booking.subServiceId.toString());
  const serviceName = serviceId
    ? (serviceMap.get(serviceId) ?? `Service #${serviceId}`)
    : "—";

  const assignedTech = technicians.find((t) => t.id === booking.technicianId);
  const validNextStatuses = getValidNextStatuses(booking.status);
  const canTransition = validNextStatuses.length > 0;

  const handleViewInvoice = (id: bigint) => {
    if (onViewInvoice) {
      onViewInvoice(id);
    } else {
      setInvoiceBookingId(id);
    }
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      await updateStatus({ bookingId: booking.id, newStatus });
      toast.success(
        `Booking #${booking.id} → ${STATUS_CONFIG[newStatus]?.label ?? newStatus}`,
      );
      sendWhatsAppNotification(
        `status updated to ${STATUS_CONFIG[newStatus]?.label ?? newStatus}`,
        {
          to: "+91XXXXXXXXXX",
          bookingId: booking.id,
          service: subServiceName,
          date: new Date().toLocaleDateString("en-IN"),
        },
      );
    } catch {
      toast.error("Failed to update booking status.");
    }
  };

  const handleAssignTechnician = async (techIdStr: string) => {
    if (!techIdStr) return;
    const techId = BigInt(techIdStr);
    try {
      await assignTechnician({ bookingId: booking.id, technicianId: techId });
      const tech = technicians.find((t) => t.id === techId);
      toast.success(`Technician assigned to Booking #${booking.id}`);
      sendWhatsAppNotification("assigned to you", {
        to: tech?.phone ?? "+91XXXXXXXXXX",
        bookingId: booking.id,
        service: subServiceName,
        date: new Date().toLocaleDateString("en-IN"),
      });
    } catch {
      toast.error("Failed to assign technician.");
    }
  };

  const handleMarkPayment = async () => {
    try {
      await markPayment({
        bookingId: booking.id,
        referenceId: `REF-${Date.now()}`,
      });
      toast.success(`Advance payment recorded for Booking #${booking.id}`);
    } catch {
      toast.error("Failed to mark payment.");
    }
  };

  const handleMarkFullyPaid = async () => {
    try {
      await markFullyPaid({ bookingId: booking.id });
      toast.success(`Booking #${booking.id} marked as fully paid`);
    } catch {
      toast.error("Failed to mark fully paid.");
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking({ bookingId: booking.id });
      toast.success(`Booking #${booking.id} cancelled`);
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await updateStatus({
        bookingId: booking.id,
        newStatus: BookingStatus.completed,
      });
      toast.success(`Booking #${booking.id} marked as completed`);
    } catch {
      toast.error("Failed to mark completed.");
    }
  };

  return (
    <>
      <motion.div
        key={String(booking.id)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.04 }}
        className="rounded-lg border border-border bg-card px-4 py-3 space-y-2 hover:border-primary/25 transition-colors"
      >
        {/* Row 1: ID + status badges + admin status dropdown */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">
              #{String(booking.id).padStart(4, "0")}
            </span>
            <StatusBadge status={booking.status} />
            <PaymentBadge paymentStatus={booking.paymentStatus} />
          </div>
          {isAdmin &&
            !readOnly &&
            (canTransition ? (
              <Select
                value=""
                onValueChange={(v) => handleStatusChange(v as BookingStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger className="h-7 text-xs w-[140px] bg-background">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  {validNextStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                No further transitions
              </span>
            ))}
        </div>

        {/* Row 2: Service & sub-service name */}
        <div className="text-sm text-foreground font-medium">
          {serviceName}
          {subServiceName !== "—" && (
            <span className="text-muted-foreground font-normal">
              {" "}
              · {subServiceName}
            </span>
          )}
        </div>

        {/* Row 3: Amounts */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Qty:{" "}
            <span className="text-foreground font-medium">
              {String(booking.quantity)}
            </span>
          </span>
          <span>
            Total:{" "}
            <span className="text-foreground font-medium">
              ₹{booking.totalAmount.toLocaleString("en-IN")}
            </span>
          </span>
          <span>
            Advance:{" "}
            <span className="text-foreground font-medium">
              ₹{booking.advanceAmount.toLocaleString("en-IN")}
            </span>
          </span>
          <span>
            Commission (40%):{" "}
            <span className="text-amber-700 font-medium">
              ₹
              {Math.round(Number(booking.totalAmount) * 0.4).toLocaleString(
                "en-IN",
              )}
            </span>
          </span>
        </div>

        {/* Row 3b: Technician Earnings + Company Profit — Admin only */}
        {isAdmin && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs rounded-md bg-muted/40 border border-border px-3 py-2">
            <span>
              Technician Earnings (40%):{" "}
              <span className="text-emerald-700 font-semibold">
                ₹
                {Math.round(Number(booking.totalAmount) * 0.4).toLocaleString(
                  "en-IN",
                )}
              </span>
            </span>
            <span>
              Company Profit (60%):{" "}
              <span className="text-primary font-semibold">
                ₹
                {Math.round(Number(booking.totalAmount) * 0.6).toLocaleString(
                  "en-IN",
                )}
              </span>
            </span>
          </div>
        )}

        {/* Row 4: Schedule & address */}
        {(booking.scheduledDate || booking.address) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {booking.scheduledDate && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {booking.scheduledDate}
                {booking.scheduledTime && ` at ${booking.scheduledTime}`}
              </span>
            )}
            {booking.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[160px]">
                  {booking.address}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Row 5: Assigned technician info */}
        {assignedTech && (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-emerald-600" />
            <span>
              Assigned:{" "}
              <span className="text-foreground font-medium">
                {assignedTech.name}
              </span>
            </span>
          </div>
        )}

        {/* Row 6: Admin controls */}
        {isAdmin && !readOnly && (
          <div className="flex flex-wrap gap-2 pt-1">
            {technicians.length > 0 && (
              <Select
                value={
                  booking.technicianId !== undefined
                    ? String(booking.technicianId)
                    : ""
                }
                onValueChange={handleAssignTechnician}
                disabled={isAssigning}
              >
                <SelectTrigger className="h-7 text-xs w-[180px] bg-background">
                  <SelectValue placeholder="Assign Technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((t) => (
                    <SelectItem key={String(t.id)} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {booking.paymentStatus === "unpaid" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={handleMarkPayment}
                disabled={isMarkingPayment}
              >
                {isMarkingPayment ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <CreditCard className="mr-1 h-3 w-3" />
                )}
                Mark Advance Paid
              </Button>
            )}

            {booking.paymentStatus !== "paid" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50"
                onClick={handleMarkFullyPaid}
                disabled={isMarkingFull}
              >
                {isMarkingFull ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                Mark Fully Paid
              </Button>
            )}

            {booking.status === BookingStatus.inProgress && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                onClick={handleMarkCompleted}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                Mark Completed
              </Button>
            )}

            {booking.status !== BookingStatus.completed &&
              booking.status !== BookingStatus.cancelled && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  Cancel Booking
                </Button>
              )}

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => handleViewInvoice(booking.id)}
            >
              <FileText className="mr-1 h-3 w-3" />
              View Invoice
            </Button>
          </div>
        )}

        {/* Technician panel: smart status buttons */}
        {readOnly && (
          <div className="pt-1 flex gap-2">
            {booking.status === BookingStatus.assigned && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => handleStatusChange(BookingStatus.inProgress)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Wrench className="mr-1 h-3 w-3" />
                )}
                Mark In Progress
              </Button>
            )}
            {booking.status === BookingStatus.inProgress && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => handleStatusChange(BookingStatus.completed)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                Mark Completed
              </Button>
            )}
            {(booking.status === BookingStatus.completed ||
              booking.status === BookingStatus.cancelled) && (
              <span className="text-xs text-muted-foreground italic self-center">
                {booking.status === BookingStatus.completed
                  ? "Job completed"
                  : "Cancelled"}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => handleViewInvoice(booking.id)}
            >
              <FileText className="mr-1 h-3 w-3" />
              Invoice
            </Button>
          </div>
        )}

        {/* Customer view: Invoice button */}
        {!isAdmin && !readOnly && (
          <div className="pt-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => handleViewInvoice(booking.id)}
            >
              <FileText className="mr-1 h-3 w-3" />
              View Invoice
            </Button>
          </div>
        )}

        {/* Row: Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="w-3 h-3" />
          {formatDate(booking.createdAt)}
        </div>
      </motion.div>

      {/* Inline invoice modal when no parent handler */}
      {!onViewInvoice && (
        <InvoiceModal
          bookingId={invoiceBookingId}
          onClose={() => setInvoiceBookingId(null)}
        />
      )}
    </>
  );
}
