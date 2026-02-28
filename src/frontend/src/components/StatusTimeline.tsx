import { BookingStatus } from "@/lib/helpers";

export function StatusTimeline({ status }: { status: BookingStatus }) {
  const steps: { key: BookingStatus; label: string }[] = [
    { key: BookingStatus.pending, label: "Pending" },
    { key: BookingStatus.assigned, label: "Assigned" },
    { key: BookingStatus.inProgress, label: "In Progress" },
    { key: BookingStatus.completed, label: "Completed" },
  ];

  if (status === BookingStatus.cancelled) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
        <span className="text-xs text-red-600 font-medium">Cancelled</span>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);
  const effectiveIndex = status === BookingStatus.confirmed ? 0 : currentIndex;

  return (
    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
      {steps.map((step, i) => {
        const isPast = i <= effectiveIndex;
        const isCurrent = i === effectiveIndex;
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div
              className={`w-2.5 h-2.5 rounded-full border ${
                isCurrent
                  ? "bg-primary border-primary"
                  : isPast
                    ? "bg-emerald-500 border-emerald-500"
                    : "bg-background border-muted-foreground/30"
              }`}
            />
            <span
              className={`text-xs ${
                isCurrent
                  ? "text-primary font-medium"
                  : isPast
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
              }`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <span
                className={`text-xs mx-0.5 ${isPast && i < effectiveIndex ? "text-muted-foreground" : "text-muted-foreground/30"}`}
              >
                →
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
