import { PaymentBadge, StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBookings, useGetTechnicians } from "@/hooks/useQueries";
import { useServiceMaps } from "@/hooks/useServiceMaps";
import { BarChart3, TrendingUp, Users, Wallet, Wrench } from "lucide-react";
import { useMemo, useState } from "react";

type DateFilter = "week" | "month" | "all";

export function ReportsPage() {
  const { data: bookings, isLoading: bookingsLoading } = useGetBookings();
  const { data: technicians, isLoading: techLoading } = useGetTechnicians();
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const { subServiceMap, serviceMap, subServiceToServiceMap } =
    useServiceMaps();

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (dateFilter === "all") return bookings;

    const now = Date.now();
    const cutoff =
      dateFilter === "week"
        ? now - 7 * 24 * 60 * 60 * 1000
        : now - 30 * 24 * 60 * 60 * 1000;

    return bookings.filter((b) => {
      const ms = Number(b.createdAt / 1_000_000n);
      return ms >= cutoff;
    });
  }, [bookings, dateFilter]);

  const summaryStats = useMemo(() => {
    const list = filteredBookings;
    const totalRevenue = list.reduce(
      (sum, b) => sum + (b.totalAmount ?? 0n),
      0n,
    );
    const totalPayout = list.reduce(
      (sum, b) => sum + BigInt(Math.round(Number(b.totalAmount ?? 0n) * 0.4)),
      0n,
    );
    const totalProfit = list.reduce(
      (sum, b) => sum + BigInt(Math.round(Number(b.totalAmount ?? 0n) * 0.6)),
      0n,
    );
    return { totalRevenue, totalPayout, totalProfit };
  }, [filteredBookings]);

  const techPayouts = useMemo(() => {
    if (!technicians || !filteredBookings) return [];
    const payoutMap = new Map<
      string,
      { name: string; total: bigint; count: number }
    >();

    for (const b of filteredBookings) {
      if (b.technicianId === undefined) continue;
      const tech = technicians.find((t) => t.id === b.technicianId);
      if (!tech) continue;
      const techKey = String(tech.id);
      const commission = BigInt(Math.round(Number(b.totalAmount ?? 0n) * 0.4));
      const existing = payoutMap.get(techKey);
      if (existing) {
        existing.total += commission;
        existing.count += 1;
      } else {
        payoutMap.set(techKey, {
          name: tech.name,
          total: commission,
          count: 1,
        });
      }
    }

    return Array.from(payoutMap.values()).sort((a, b) =>
      a.total > b.total ? -1 : 1,
    );
  }, [filteredBookings, technicians]);

  const isLoading = bookingsLoading || techLoading;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Financial overview, booking trends, and technician performance.
          </p>
        </div>
        <Select
          value={dateFilter}
          onValueChange={(v) => setDateFilter(v as DateFilter)}
        >
          <SelectTrigger className="w-40 h-8 text-xs bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Revenue",
            value: isLoading
              ? null
              : `₹${summaryStats.totalRevenue.toLocaleString("en-IN")}`,
            icon: TrendingUp,
            iconBg: "bg-blue-50 dark:bg-blue-950/30",
            iconColor: "text-blue-600",
          },
          {
            label: "Technician Payout (40%)",
            value: isLoading
              ? null
              : `₹${summaryStats.totalPayout.toLocaleString("en-IN")}`,
            icon: Users,
            iconBg: "bg-amber-50 dark:bg-amber-950/30",
            iconColor: "text-amber-600",
          },
          {
            label: "Net Company Profit (60%)",
            value: isLoading
              ? null
              : `₹${summaryStats.totalProfit.toLocaleString("en-IN")}`,
            icon: Wallet,
            iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
            iconColor: "text-emerald-600",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <div>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </>
                  ) : (
                    <>
                      <p className="font-display text-xl font-bold text-[#111827] leading-none">
                        {card.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {card.label}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Booking Revenue
          </h2>
          {!isLoading && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {filteredBookings.length} bookings
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No bookings found for the selected period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Booking ID
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
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
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
                    <tr
                      key={String(booking.id)}
                      className="border-t border-border/60 hover:bg-muted/20 transition-colors"
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
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                        {booking.scheduledDate || "—"}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Technician Payout Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Technician Payout Summary
          </h2>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : techPayouts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No technician assignments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Technician
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Jobs
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Commission (40%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {techPayouts.map((tp) => (
                  <tr
                    key={tp.name}
                    className="border-t border-border/60 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Wrench className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground text-xs">
                          {tp.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-muted-foreground text-xs">
                        {tp.count} {tp.count === 1 ? "job" : "jobs"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-emerald-700 text-xs">
                        ₹{tp.total.toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
