import { STATUS_CONFIG } from "@/lib/helpers";
import type { BookingStatus } from "@/lib/helpers";
import { CreditCard } from "lucide-react";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

export function PaymentBadge({ paymentStatus }: { paymentStatus: string }) {
  const cfg: Record<string, { label: string; className: string }> = {
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
  const entry = cfg[paymentStatus] ?? {
    label: paymentStatus,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${entry.className}`}
    >
      <CreditCard className="w-3 h-3" />
      {entry.label}
    </span>
  );
}
