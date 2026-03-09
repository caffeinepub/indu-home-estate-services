import { BookingStatus } from "@/backend.d";
import type { Booking, Technician } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetBookings, useGetTechnicians } from "@/hooks/useQueries";
import { useServiceMaps } from "@/hooks/useServiceMaps";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  MapPin,
  Package,
  PhoneCall,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";

const STATUS_STEPS = [
  { key: BookingStatus.pending, label: "Pending", icon: Circle },
  { key: BookingStatus.assigned, label: "Assigned", icon: User },
  { key: BookingStatus.inProgress, label: "In Progress", icon: Package },
  { key: BookingStatus.completed, label: "Completed", icon: CheckCircle2 },
];

const STATUS_ORDER = [
  BookingStatus.pending,
  BookingStatus.assigned,
  BookingStatus.inProgress,
  BookingStatus.completed,
];

function getStepIndex(status: BookingStatus): number {
  if (status === BookingStatus.cancelled) return -1;
  return STATUS_ORDER.indexOf(status);
}

function StatusTimeline({ status }: { status: BookingStatus }) {
  const currentIdx = getStepIndex(status);
  const cancelled = status === BookingStatus.cancelled;

  if (cancelled) {
    return (
      <div
        className="flex items-center justify-center gap-2 py-4 px-5 rounded-xl"
        style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
        data-ocid="track.status.card"
      >
        <AlertCircle className="w-5 h-5" style={{ color: "#dc2626" }} />
        <span className="font-semibold text-sm" style={{ color: "#dc2626" }}>
          This booking has been cancelled.
        </span>
      </div>
    );
  }

  return (
    <div className="py-2" data-ocid="track.status.card">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div
          className="absolute top-5 left-0 right-0 h-0.5"
          style={{ background: "#e5e7eb" }}
        />
        {/* Progress bar fill */}
        <div
          className="absolute top-5 left-0 h-0.5 transition-all duration-700"
          style={{
            background: "linear-gradient(90deg, #2563eb, #3b82f6)",
            width: `${currentIdx >= 0 ? (currentIdx / (STATUS_STEPS.length - 1)) * 100 : 0}%`,
          }}
        />

        {STATUS_STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-1.5 relative z-10"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: done ? "#2563eb" : active ? "#eff6ff" : "#f3f4f6",
                  border: active
                    ? "2px solid #2563eb"
                    : done
                      ? "2px solid #2563eb"
                      : "2px solid #e5e7eb",
                  boxShadow: active ? "0 0 0 4px rgba(37,99,235,0.12)" : "none",
                }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: done || active ? "#2563eb" : "#9ca3af" }}
                />
              </div>
              <span
                className="text-xs font-semibold text-center leading-tight"
                style={
                  active
                    ? { color: "#1d4ed8" }
                    : done
                      ? { color: "#2563eb" }
                      : { color: "#9ca3af" }
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getPaymentBadge(paymentStatus: string) {
  switch (paymentStatus) {
    case "paid":
      return (
        <Badge
          style={{
            background: "#dcfce7",
            color: "#16a34a",
            border: "1px solid #bbf7d0",
          }}
        >
          ✓ Paid
        </Badge>
      );
    case "partial":
      return (
        <Badge
          style={{
            background: "#fef9c3",
            color: "#854d0e",
            border: "1px solid #fde047",
          }}
        >
          ⚡ Advance Paid
        </Badge>
      );
    default:
      return (
        <Badge
          style={{
            background: "#fff7ed",
            color: "#c2410c",
            border: "1px solid #fed7aa",
          }}
        >
          ⏳ Payment Pending
        </Badge>
      );
  }
}

function getStatusBadge(status: BookingStatus) {
  const map: Record<
    BookingStatus,
    { bg: string; color: string; border: string; label: string }
  > = {
    [BookingStatus.pending]: {
      bg: "#fef9c3",
      color: "#854d0e",
      border: "#fde047",
      label: "Pending",
    },
    [BookingStatus.assigned]: {
      bg: "#dbeafe",
      color: "#1d4ed8",
      border: "#93c5fd",
      label: "Assigned",
    },
    [BookingStatus.inProgress]: {
      bg: "#ede9fe",
      color: "#6d28d9",
      border: "#c4b5fd",
      label: "In Progress",
    },
    [BookingStatus.completed]: {
      bg: "#dcfce7",
      color: "#16a34a",
      border: "#bbf7d0",
      label: "Completed",
    },
    [BookingStatus.cancelled]: {
      bg: "#fee2e2",
      color: "#dc2626",
      border: "#fca5a5",
      label: "Cancelled",
    },
    [BookingStatus.confirmed]: {
      bg: "#d1fae5",
      color: "#065f46",
      border: "#6ee7b7",
      label: "Confirmed",
    },
  };
  const s = map[status] ?? {
    bg: "#f3f4f6",
    color: "#374151",
    border: "#e5e7eb",
    label: status,
  };
  return (
    <Badge
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </Badge>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="flex items-start gap-3 py-3"
      style={{ borderBottom: "1px solid #f3f4f6" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "#eff6ff" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: "#9ca3af" }}>
          {label}
        </p>
        <p className="text-sm font-semibold" style={{ color: "#111827" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  technicians,
  subServiceMap,
}: {
  booking: Booking;
  technicians: Technician[];
  subServiceMap: Map<string, string>;
}) {
  const techName = booking.technicianId
    ? (technicians.find((t) => t.id === booking.technicianId)?.name ??
      "Not assigned")
    : "Not assigned";

  const subServiceName =
    subServiceMap.get(booking.subServiceId.toString()) ??
    `Sub-service #${booking.subServiceId}`;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}
      data-ocid="track.booking.card"
    >
      {/* Card Header */}
      <div
        className="px-6 py-5"
        style={
          booking.status === BookingStatus.cancelled
            ? {
                background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
              }
            : {
                background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
              }
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-blue-200 text-xs font-medium mb-1">Booking ID</p>
            <p className="font-mono font-bold text-white text-lg">
              #{booking.id.toString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(booking.status)}
            {getPaymentBadge(booking.paymentStatus)}
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-4"
          style={{ color: "#6b7280" }}
        >
          Booking Progress
        </p>
        <StatusTimeline status={booking.status} />
      </div>

      {/* Details */}
      <div className="px-6 py-2">
        <InfoRow
          icon={<Package className="w-4 h-4" style={{ color: "#2563eb" }} />}
          label="Service"
          value={subServiceName}
        />
        <InfoRow
          icon={<Calendar className="w-4 h-4" style={{ color: "#2563eb" }} />}
          label="Scheduled Date"
          value={booking.scheduledDate || "Not specified"}
        />
        {booking.scheduledTime && (
          <InfoRow
            icon={<Clock className="w-4 h-4" style={{ color: "#2563eb" }} />}
            label="Time Slot"
            value={booking.scheduledTime}
          />
        )}
        <InfoRow
          icon={<MapPin className="w-4 h-4" style={{ color: "#2563eb" }} />}
          label="Service Address"
          value={booking.address || "Not specified"}
        />
        <InfoRow
          icon={<User className="w-4 h-4" style={{ color: "#2563eb" }} />}
          label="Assigned Technician"
          value={techName}
        />
        {booking.notes && (
          <InfoRow
            icon={<span className="text-sm">📝</span>}
            label="Notes"
            value={booking.notes}
          />
        )}
      </div>

      {/* Financials */}
      <div
        className="mx-6 mb-5 mt-2 rounded-xl p-4"
        style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{ color: "#64748b" }}
        >
          Payment Summary
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: `₹${booking.totalAmount.toString()}`,
              color: "#111827",
            },
            {
              label: "Advance",
              value: `₹${booking.advanceAmount.toString()}`,
              color: "#2563eb",
            },
            {
              label: "Balance",
              value: `₹${booking.balanceAmount.toString()}`,
              color: booking.balanceAmount > 0n ? "#dc2626" : "#16a34a",
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                {item.label}
              </p>
              <p className="text-sm font-bold" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="px-6 pb-5">
        <a
          href="https://wa.me/919901563799"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="track.whatsapp.button"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "#25d366", color: "#fff" }}
        >
          <PhoneCall className="w-4 h-4" />
          Need help? Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}

export function TrackBookingPage() {
  const [inputId, setInputId] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useGetBookings();
  const { data: technicians = [] } = useGetTechnicians();
  const { subServiceMap } = useServiceMaps();

  const handleSearch = () => {
    const trimmed = inputId.trim();
    if (!trimmed) return;
    setSearchId(trimmed);
  };

  // The booking ID stored internally is a bigint. We also accept the IHE-YYYYMMDD-XXXX format
  // which is stored in the messages system (not the backend Booking id).
  // We match by backend numeric id OR by partial string match for display IDs.
  const foundBooking = searchId
    ? bookings.find((b) => {
        const bIdStr = b.id.toString();
        // numeric ID match
        if (bIdStr === searchId) return true;
        // IHE-YYYYMMDD-XXXX contains numeric suffix
        const iheMatch = searchId.match(/IHE-\d{8}-(\d+)/i);
        if (iheMatch) return bIdStr === iheMatch[1];
        return false;
      })
    : null;

  const searched = searchId !== null;
  const notFound = searched && !foundBooking && !isLoading;

  return (
    <div className="pt-16 min-h-screen" style={{ background: "#f3f4f6" }}>
      {/* Page Header */}
      <div
        className="py-14"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Search className="w-7 h-7 text-blue-200" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Track Your Booking
          </h1>
          <p className="text-blue-200 text-sm sm:text-base mb-8">
            Enter your Booking ID to see real-time status updates
          </p>

          {/* Search Box */}
          <div className="flex gap-2 max-w-lg mx-auto">
            <Input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter Booking ID (e.g. 12345)"
              data-ocid="track.search_input"
              className="flex-1 bg-white text-gray-900 border-0 h-12 text-sm font-medium"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isLoading || !inputId.trim()}
              data-ocid="track.search.button"
              className="h-12 px-5 font-semibold"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                borderRadius: "12px",
                backdropFilter: "blur(8px)",
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Loading */}
        {isLoading && (
          <div
            className="flex items-center justify-center gap-3 py-10"
            data-ocid="track.loading_state"
          >
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "#2563eb" }}
            />
            <span className="text-sm font-medium" style={{ color: "#6b7280" }}>
              Loading booking data...
            </span>
          </div>
        )}

        {/* Not found */}
        {notFound && (
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{
              border: "1px solid #fee2e2",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
            data-ocid="track.error_state"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#fef2f2" }}
            >
              <AlertCircle className="w-7 h-7" style={{ color: "#dc2626" }} />
            </div>
            <h3
              className="font-display font-bold text-lg mb-1"
              style={{ color: "#111827" }}
            >
              Booking Not Found
            </h3>
            <p className="text-sm mb-5" style={{ color: "#6b7280" }}>
              No booking found with ID &ldquo;<strong>{searchId}</strong>
              &rdquo;. Please check the ID and try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                data-ocid="track.retry.button"
                onClick={() => {
                  setSearchId(null);
                  setInputId("");
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Try Again
              </Button>
              <a
                href="https://wa.me/919901563799"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="track.contact.button"
              >
                <Button
                  data-ocid="track.whatsapp.secondary.button"
                  style={{
                    background: "#25d366",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  <PhoneCall className="w-4 h-4 mr-1" />
                  Contact Support
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Booking found */}
        {foundBooking && (
          <div className="space-y-5" data-ocid="track.result.card">
            <BookingCard
              booking={foundBooking}
              technicians={technicians}
              subServiceMap={subServiceMap}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                data-ocid="track.new_search.button"
                className="flex-1"
                onClick={() => {
                  setSearchId(null);
                  setInputId("");
                }}
              >
                <Search className="w-4 h-4 mr-1.5" />
                Track Another Booking
              </Button>
              <Link
                to="/book-now"
                data-ocid="track.book_more.link"
                className="flex-1"
              >
                <Button
                  className="w-full"
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Book a Service
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Idle state — no search yet */}
        {!searched && !isLoading && (
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
            data-ocid="track.empty_state"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#eff6ff" }}
            >
              <Package className="w-7 h-7" style={{ color: "#2563eb" }} />
            </div>
            <h3
              className="font-display font-bold text-lg mb-1"
              style={{ color: "#111827" }}
            >
              Enter your Booking ID
            </h3>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Your Booking ID was provided in your confirmation message or
              WhatsApp notification.
            </p>
            <div
              className="mt-6 p-4 rounded-xl text-left"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#64748b" }}
              >
                Where to find your Booking ID:
              </p>
              <ul className="text-xs space-y-1" style={{ color: "#6b7280" }}>
                <li>• WhatsApp confirmation message from our team</li>
                <li>• Booking confirmation screen after submitting the form</li>
                <li>• SMS or email notification (if applicable)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            data-ocid="track.home.link"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
            style={{ color: "#2563eb" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
