import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { AppRole } from "@/lib/helpers";
import { useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  User,
  Wrench,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  role: AppRole;
  setRole: (r: AppRole) => void;
  activeTechnicianId: bigint | null;
  setActiveTechnicianId: (id: bigint | null) => void;
}

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/bookings/create": "Create Booking",
  "/bookings/all": "All Bookings",
  "/bookings/invoices": "Invoices",
  "/users/add": "Add User",
  "/users/all": "All Users",
  "/technicians/add": "Add Technician",
  "/technicians/list": "Technician List",
  "/services/add": "Add Service",
  "/services/list": "Service List",
  "/technician/jobs": "My Jobs",
  "/customer/bookings": "My Bookings",
  "/reports": "Reports & Analytics",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  return ROUTE_TITLES[pathname] ?? "Dashboard";
}

const ROLE_ICONS = {
  admin: ShieldCheck,
  technician: Wrench,
  customer: User,
};

const ROLE_COLORS: Record<AppRole, string> = {
  admin: "text-blue-600",
  technician: "text-emerald-600",
  customer: "text-amber-600",
};

export function Header({
  collapsed,
  onToggle,
  role,
  setRole,
  activeTechnicianId,
  setActiveTechnicianId,
}: HeaderProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const title = getPageTitle(pathname);
  const { theme, setTheme } = useTheme();
  const [techInput, setTechInput] = useState(
    activeTechnicianId !== null ? String(activeTechnicianId) : "",
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const RoleIcon = ROLE_ICONS[role];
  const roleColor = ROLE_COLORS[role];

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center gap-4 bg-card border-b border-border px-4"
      style={{
        left: collapsed ? "64px" : "240px",
        height: "60px",
        transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 shrink-0"
        onClick={onToggle}
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Page Title */}
      <div className="hidden sm:block shrink-0">
        <h1 className="font-display text-base font-semibold text-foreground leading-none">
          {title}
        </h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs hidden md:flex items-center relative">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8 h-8 text-xs bg-background rounded-full border-border"
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Notification bell */}
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* Dark mode toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        )}

        {/* Role / Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <RoleIcon className={`w-3.5 h-3.5 ${roleColor}`} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-foreground capitalize leading-none">
                  {role}
                </p>
                <p className="text-xs text-muted-foreground leading-none mt-0.5">
                  Active
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Switch Role
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setRole("admin")}
              className={`gap-2 text-sm ${role === "admin" ? "bg-primary/5 text-primary font-medium" : ""}`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Admin
              {role === "admin" && (
                <span className="ml-auto text-xs text-primary">Active</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setRole("technician")}
              className={`gap-2 text-sm ${role === "technician" ? "bg-primary/5 text-primary font-medium" : ""}`}
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              Technician
              {role === "technician" && (
                <span className="ml-auto text-xs text-primary">Active</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setRole("customer")}
              className={`gap-2 text-sm ${role === "customer" ? "bg-primary/5 text-primary font-medium" : ""}`}
            >
              <User className="w-4 h-4 text-amber-600" />
              Customer
              {role === "customer" && (
                <span className="ml-auto text-xs text-primary">Active</span>
              )}
            </DropdownMenuItem>

            {role === "technician" && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Technician ID
                  </p>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 0"
                    value={techInput}
                    onChange={(e) => {
                      setTechInput(e.target.value);
                      const val = e.target.value.trim();
                      setActiveTechnicianId(val !== "" ? BigInt(val) : null);
                    }}
                    className="h-7 text-xs bg-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
