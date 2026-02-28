import { Skeleton } from "@/components/ui/skeleton";
import { SERVICES, SUB_SERVICES } from "@/constants/catalog";
import { useGetBookings } from "@/hooks/useQueries";
import { BookingStatus } from "@/lib/helpers";
import {
  AlertCircle,
  BadgePercent,
  BarChart2,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

export function DashboardCards() {
  const { data: bookings, isLoading } = useGetBookings();

  const subServiceToServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ss of SUB_SERVICES) map.set(ss.id, ss.serviceId);
    return map;
  }, []);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of SERVICES) map.set(s.id, s.name);
    return map;
  }, []);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const stats = useMemo(() => {
    const list = bookings ?? [];
    if (isLoading || list.length === 0) {
      return {
        totalBookings: 0,
        totalRevenue: 0n,
        totalAdvance: 0n,
        totalCommission: 0n,
        totalCompanyProfit: 0n,
        pendingPayments: 0,
        assignedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        todayBookings: 0,
      };
    }
    return {
      totalBookings: list.length,
      totalRevenue: list.reduce(
        (sum, b) =>
          b.paymentStatus === "paid" ? sum + (b.totalAmount ?? 0n) : sum,
        0n,
      ),
      totalAdvance: list.reduce((sum, b) => {
        const ps = b.paymentStatus ?? "unpaid";
        return ps === "partial" || ps === "paid"
          ? sum + (b.advanceAmount ?? 0n)
          : sum;
      }, 0n),
      totalCommission: list.reduce(
        (sum, b) => sum + BigInt(Math.round(Number(b.totalAmount ?? 0n) * 0.4)),
        0n,
      ),
      totalCompanyProfit: list.reduce(
        (sum, b) => sum + BigInt(Math.round(Number(b.totalAmount ?? 0n) * 0.6)),
        0n,
      ),
      pendingPayments: list.filter(
        (b) => (b.paymentStatus ?? "unpaid") === "unpaid",
      ).length,
      assignedBookings: list.filter((b) => b.status === BookingStatus.assigned)
        .length,
      completedBookings: list.filter(
        (b) => b.status === BookingStatus.completed,
      ).length,
      cancelledBookings: list.filter(
        (b) => b.status === BookingStatus.cancelled,
      ).length,
      todayBookings: list.filter((b) => {
        const ms = Number(b.createdAt / 1_000_000n);
        return ms >= todayStart;
      }).length,
    };
  }, [bookings, isLoading, todayStart]);

  const serviceBookingCounts = useMemo(() => {
    if (!bookings) return [];
    const countMap = new Map<string, number>();
    for (const b of bookings) {
      const serviceId = subServiceToServiceMap.get(b.subServiceId.toString());
      if (!serviceId) continue;
      const serviceName = serviceMap.get(serviceId) ?? `Service #${serviceId}`;
      countMap.set(serviceName, (countMap.get(serviceName) ?? 0) + 1);
    }
    const entries = Array.from(countMap.entries()).sort((a, b) => b[1] - a[1]);
    const maxCount = entries.length > 0 ? entries[0][1] : 1;
    return entries.map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / maxCount) * 100),
    }));
  }, [bookings, subServiceToServiceMap, serviceMap]);

  const cards = [
    {
      label: "Total Bookings",
      value: isLoading ? null : String(stats.totalBookings),
      icon: BookOpen,
      iconClass: "text-primary",
      bgClass: "bg-primary/8",
    },
    {
      label: "Total Revenue",
      value: isLoading
        ? null
        : `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      iconClass: "text-emerald-700",
      bgClass: "bg-emerald-50",
    },
    {
      label: "Advance Collected",
      value: isLoading
        ? null
        : `₹${stats.totalAdvance.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconClass: "text-blue-700",
      bgClass: "bg-blue-50",
    },
    {
      label: "Pending Balance",
      value: isLoading
        ? null
        : `₹${(stats.totalRevenue + stats.totalAdvance > 0n ? stats.totalRevenue - stats.totalAdvance : 0n).toLocaleString("en-IN")}`,
      icon: AlertCircle,
      iconClass: "text-amber-700",
      bgClass: "bg-amber-50",
    },
    {
      label: "Technician Payout (40%)",
      value: isLoading
        ? null
        : `₹${stats.totalCommission.toLocaleString("en-IN")}`,
      icon: BadgePercent,
      iconClass: "text-amber-700",
      bgClass: "bg-amber-50",
    },
    {
      label: "Net Company Profit (60%)",
      value: isLoading
        ? null
        : `₹${stats.totalCompanyProfit.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      iconClass: "text-primary",
      bgClass: "bg-primary/8",
    },
    {
      label: "Today's Bookings",
      value: isLoading ? null : String(stats.todayBookings),
      icon: CalendarDays,
      iconClass: "text-primary",
      bgClass: "bg-primary/8",
    },
    {
      label: "Completed Bookings",
      value: isLoading ? null : String(stats.completedBookings),
      icon: CheckCircle2,
      iconClass: "text-emerald-700",
      bgClass: "bg-emerald-50",
    },
    {
      label: "Cancelled Bookings",
      value: isLoading ? null : String(stats.cancelledBookings),
      icon: XCircle,
      iconClass: "text-red-500",
      bgClass: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-display text-xl font-semibold text-foreground">
          Overview
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-xs"
            >
              <div
                className={`w-9 h-9 rounded-lg ${card.bgClass} flex items-center justify-center`}
              >
                <Icon className={`w-4.5 h-4.5 ${card.iconClass}`} />
              </div>
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-20 mb-1.5" />
                    <Skeleton className="h-3 w-28" />
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl font-semibold text-foreground leading-none">
                      {card.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {card.label}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bookings by Service chart */}
      {serviceBookingCounts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground text-sm">
              Bookings by Service
            </h3>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            {serviceBookingCounts.map(({ name, count, pct }) => (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium truncate max-w-[70%]">
                    {name}
                  </span>
                  <span className="text-muted-foreground ml-2 shrink-0">
                    {count}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
