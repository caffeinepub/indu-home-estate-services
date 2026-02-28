import type { AppRole } from "@/lib/helpers";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  List,
  PlusCircle,
  Receipt,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  collapsed: boolean;
  role: AppRole;
}

interface SidebarItem {
  label: string;
  to: string;
  icon: React.FC<{ className?: string }>;
}

interface SidebarGroup {
  label: string;
  icon: React.FC<{ className?: string }>;
  items: SidebarItem[];
  adminOnly?: boolean;
}

type NavEntry = SidebarItem | SidebarGroup;

const isGroup = (entry: NavEntry): entry is SidebarGroup => "items" in entry;

const NAV_ENTRIES: NavEntry[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Bookings",
    icon: BookOpen,
    items: [
      { label: "Create Booking", to: "/bookings/create", icon: PlusCircle },
      { label: "All Bookings", to: "/bookings/all", icon: List },
      { label: "Invoices", to: "/bookings/invoices", icon: Receipt },
    ],
  },
  {
    label: "Users",
    icon: Users,
    adminOnly: true,
    items: [
      { label: "Add User", to: "/users/add", icon: PlusCircle },
      { label: "All Users", to: "/users/all", icon: List },
    ],
  },
  {
    label: "Technicians",
    icon: Wrench,
    adminOnly: true,
    items: [
      { label: "Add Technician", to: "/technicians/add", icon: PlusCircle },
      { label: "Technician List", to: "/technicians/list", icon: List },
    ],
  },
  {
    label: "Services",
    icon: Settings,
    items: [
      { label: "Add Service", to: "/services/add", icon: PlusCircle },
      { label: "Service List", to: "/services/list", icon: List },
    ],
  },
  {
    label: "Reports",
    to: "/reports",
    icon: BarChart3,
    adminOnly: true,
  } as SidebarItem & { adminOnly?: boolean },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ collapsed, role }: SidebarProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const getDefaultOpen = () => {
    const groups: Record<string, boolean> = {};
    for (const entry of NAV_ENTRIES) {
      if (isGroup(entry)) {
        const anyActive = entry.items.some((item) => isActive(item.to));
        if (anyActive) groups[entry.label] = true;
      }
    }
    return groups;
  };

  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>(getDefaultOpen);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleEntries = NAV_ENTRIES.filter((entry) => {
    const adminOnly =
      "adminOnly" in entry && (entry as { adminOnly?: boolean }).adminOnly;
    if (adminOnly && role !== "admin") return false;
    return true;
  });

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-40 flex flex-col"
      style={{
        width: collapsed ? "64px" : "240px",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        background: "oklch(var(--sidebar))",
        borderRight: "1px solid oklch(var(--sidebar-border))",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 shrink-0 border-b"
        style={{
          height: "60px",
          borderColor: "oklch(var(--sidebar-border))",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "oklch(var(--sidebar-primary))" }}
        >
          <Building2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p
              className="font-display text-sm font-bold leading-tight whitespace-nowrap"
              style={{ color: "oklch(var(--sidebar-foreground))" }}
            >
              Indu Home
            </p>
            <p
              className="text-xs leading-tight whitespace-nowrap opacity-60"
              style={{ color: "oklch(var(--sidebar-foreground))" }}
            >
              & Estate Services
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {visibleEntries.map((entry) => {
          if (!isGroup(entry)) {
            const active = isActive(entry.to);
            const Icon = entry.icon;

            if (collapsed) {
              return (
                <Link
                  key={entry.to}
                  to={entry.to}
                  title={entry.label}
                  className="flex items-center justify-center w-full h-9 rounded-md transition-colors"
                  style={{
                    background: active
                      ? "oklch(var(--sidebar-accent))"
                      : "transparent",
                    color: active
                      ? "oklch(var(--sidebar-primary))"
                      : "oklch(var(--sidebar-foreground))",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "oklch(var(--sidebar-accent))";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            }

            return (
              <Link
                key={entry.to}
                to={entry.to}
                className={`flex items-center gap-3 w-full h-9 px-3 rounded-md text-sm font-medium transition-colors relative ${active ? "sidebar-active-indicator" : ""}`}
                style={{
                  background: active
                    ? "oklch(var(--sidebar-accent))"
                    : "transparent",
                  color: active
                    ? "oklch(var(--sidebar-primary))"
                    : "oklch(var(--sidebar-foreground))",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(var(--sidebar-accent))";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{entry.label}</span>
              </Link>
            );
          }

          // Group
          const group = entry as SidebarGroup;
          const GroupIcon = group.icon;
          const isOpen = openGroups[group.label] ?? false;
          const anyChildActive = group.items.some((item) => isActive(item.to));

          if (collapsed) {
            return (
              <div key={group.label} className="relative group/sidebar-group">
                <button
                  type="button"
                  title={group.label}
                  className="flex items-center justify-center w-full h-9 rounded-md transition-colors"
                  style={{
                    background: anyChildActive
                      ? "oklch(var(--sidebar-accent))"
                      : "transparent",
                    color: anyChildActive
                      ? "oklch(var(--sidebar-primary))"
                      : "oklch(var(--sidebar-foreground))",
                  }}
                  onMouseEnter={(e) => {
                    if (!anyChildActive)
                      (e.currentTarget as HTMLElement).style.background =
                        "oklch(var(--sidebar-accent))";
                  }}
                  onMouseLeave={(e) => {
                    if (!anyChildActive)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  <GroupIcon className="w-4 h-4" />
                </button>
              </div>
            );
          }

          return (
            <div key={group.label}>
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="flex items-center gap-3 w-full h-9 px-3 rounded-md text-sm font-medium transition-colors"
                style={{
                  background: anyChildActive
                    ? "oklch(var(--sidebar-accent))"
                    : "transparent",
                  color: anyChildActive
                    ? "oklch(var(--sidebar-primary))"
                    : "oklch(var(--sidebar-foreground))",
                }}
                onMouseEnter={(e) => {
                  if (!anyChildActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(var(--sidebar-accent))";
                }}
                onMouseLeave={(e) => {
                  if (!anyChildActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                }}
              >
                <GroupIcon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left truncate">{group.label}</span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div
                  className="mt-0.5 ml-4 pl-3 border-l space-y-0.5"
                  style={{ borderColor: "oklch(var(--sidebar-border))" }}
                >
                  {group.items.map((item) => {
                    const childActive = isActive(item.to);
                    const ChildIcon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-2.5 w-full h-8 px-2 rounded-md text-xs font-medium transition-colors relative ${childActive ? "sidebar-active-indicator" : ""}`}
                        style={{
                          background: childActive
                            ? "oklch(var(--sidebar-accent))"
                            : "transparent",
                          color: childActive
                            ? "oklch(var(--sidebar-primary))"
                            : "oklch(var(--sidebar-foreground) / 0.75)",
                        }}
                        onMouseEnter={(e) => {
                          if (!childActive)
                            (e.currentTarget as HTMLElement).style.background =
                              "oklch(var(--sidebar-accent))";
                        }}
                        onMouseLeave={(e) => {
                          if (!childActive)
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                        }}
                      >
                        <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom branding */}
      {!collapsed && (
        <div
          className="px-4 py-3 border-t text-center"
          style={{ borderColor: "oklch(var(--sidebar-border))" }}
        >
          <p
            className="text-xs opacity-40"
            style={{ color: "oklch(var(--sidebar-foreground))" }}
          >
            Chikmagalur, Karnataka
          </p>
        </div>
      )}
    </aside>
  );
}
