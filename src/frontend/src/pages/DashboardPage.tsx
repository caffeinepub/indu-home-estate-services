import { DashboardCards } from "@/components/DashboardCards";
import { useWebsiteStore } from "@/hooks/useWebsiteStore";
import { Link } from "@tanstack/react-router";
import { Globe, Mail, MessageSquare, Search } from "lucide-react";

function WebsiteSummaryCards() {
  const store = useWebsiteStore();

  const pendingInspections = store.inspections.filter(
    (i) => i.status === "pending",
  ).length;
  const pendingQuotations = store.quotations.filter(
    (q) => q.status === "pending",
  ).length;
  const unreadMessages = store.contactMessages.filter(
    (m) => m.status === "new",
  ).length;

  const cards = [
    {
      label: "Pending Inspections",
      value: pendingInspections,
      to: "/admin/inspections",
      icon: Search,
      bg: "#fef3c7",
      color: "#d97706",
    },
    {
      label: "Pending Quotations",
      value: pendingQuotations,
      to: "/admin/quotations",
      icon: MessageSquare,
      bg: "#dbeafe",
      color: "#2563eb",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      to: "/admin/contact-messages",
      icon: Mail,
      bg: "#fce7f3",
      color: "#db2777",
    },
  ];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-medium text-foreground text-sm">
          Website Activity
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: card.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div>
                <p
                  className="font-display text-2xl font-semibold"
                  style={{ color: card.color }}
                >
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

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
      <WebsiteSummaryCards />
    </div>
  );
}
