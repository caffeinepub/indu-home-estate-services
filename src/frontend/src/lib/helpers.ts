import { BookingStatus, Role } from "../hooks/useQueries";

export { BookingStatus, Role };

export function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

export function getValidNextStatuses(current: BookingStatus): BookingStatus[] {
  switch (current) {
    case BookingStatus.pending:
      return [BookingStatus.assigned, BookingStatus.cancelled];
    case BookingStatus.confirmed:
      return [BookingStatus.assigned, BookingStatus.cancelled];
    case BookingStatus.assigned:
      return [BookingStatus.inProgress, BookingStatus.cancelled];
    case BookingStatus.inProgress:
      return [BookingStatus.completed, BookingStatus.cancelled];
    case BookingStatus.completed:
      return [];
    case BookingStatus.cancelled:
      return [];
    default:
      return [];
  }
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  [BookingStatus.pending]: "Pending",
  [BookingStatus.confirmed]: "Confirmed",
  [BookingStatus.assigned]: "Assigned",
  [BookingStatus.inProgress]: "In Progress",
  [BookingStatus.completed]: "Completed",
  [BookingStatus.cancelled]: "Cancelled",
};

export const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  [BookingStatus.pending]: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [BookingStatus.confirmed]: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [BookingStatus.assigned]: {
    label: "Assigned",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  [BookingStatus.inProgress]: {
    label: "In Progress",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  [BookingStatus.completed]: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export type AppRole = "admin" | "technician" | "customer";

export const ROLE_CONFIG: Record<Role, { label: string; className: string }> = {
  [Role.admin]: {
    label: "Admin",
    className: "role-admin",
  },
  [Role.technician]: {
    label: "Technician",
    className: "role-technician",
  },
  [Role.customer]: {
    label: "Customer",
    className: "role-customer",
  },
};

export function sendWhatsAppNotification(
  type: string,
  details: { to: string; bookingId: bigint; service: string; date: string },
) {
  console.log(
    `[WHATSAPP]\nTo: ${details.to}\nMessage: Booking #${details.bookingId} ${type} for ${details.service} on ${details.date}.`,
  );
}

export const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];
