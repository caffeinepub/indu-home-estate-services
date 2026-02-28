import { DashboardCards } from "@/components/DashboardCards";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your service operations — revenue, bookings, payouts and
          profit.
        </p>
      </div>
      <DashboardCards />
    </div>
  );
}
