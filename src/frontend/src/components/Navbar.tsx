import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { AppRole } from "@/lib/helpers";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface NavbarProps {
  role: AppRole;
  setRole: (r: AppRole) => void;
  activeTechnicianId: bigint | null;
  setActiveTechnicianId: (id: bigint | null) => void;
}

interface NavLinkItem {
  label: string;
  to: string;
}

interface NavDropdownItem {
  label: string;
  icon: React.FC<{ className?: string }>;
  items: NavLinkItem[];
  adminOnly?: boolean;
}

export function Navbar({
  role,
  setRole,
  activeTechnicianId: _activeTechnicianId,
  setActiveTechnicianId,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [techInput, setTechInput] = useState("");
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const navItems: (NavLinkItem | NavDropdownItem)[] = [
    {
      label: "Dashboard",
      to: "/",
    },
    {
      label: "Bookings",
      icon: BookOpen,
      items: [
        { label: "Create Booking", to: "/bookings/create" },
        { label: "All Bookings", to: "/bookings/all" },
        { label: "Invoices", to: "/bookings/invoices" },
      ],
    },
    {
      label: "Users",
      icon: Users,
      adminOnly: true,
      items: [
        { label: "Add User", to: "/users/add" },
        { label: "All Users", to: "/users/all" },
      ],
    },
    {
      label: "Technicians",
      icon: Wrench,
      adminOnly: true,
      items: [
        { label: "Add Technician", to: "/technicians/add" },
        { label: "Technician List", to: "/technicians/list" },
      ],
    },
    {
      label: "Services",
      icon: Settings,
      items: [
        { label: "Add Service", to: "/services/add" },
        { label: "Service List", to: "/services/list" },
      ],
    },
  ];

  const visibleItems = navItems.filter((item) => {
    if ("adminOnly" in item && item.adminOnly && role !== "admin") return false;
    return true;
  });

  const isDropdown = (
    item: NavLinkItem | NavDropdownItem,
  ): item is NavDropdownItem => "items" in item;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-sm font-semibold text-foreground leading-tight">
                Indu Home & Estate
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Admin Dashboard
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {visibleItems.map((item) => {
              if (!isDropdown(item)) {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.to)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      {item.label}
                    </span>
                  </Link>
                );
              }

              const anyActive = item.items.some((sub) => isActive(sub.to));

              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        anyActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-44">
                    {item.items.map((sub) => (
                      <DropdownMenuItem key={sub.to} asChild>
                        <Link
                          to={sub.to}
                          className={`w-full ${isActive(sub.to) ? "text-primary font-medium" : ""}`}
                        >
                          {sub.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </nav>

          {/* Right: Role switcher + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Role switcher (desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {(["admin", "technician", "customer"] as AppRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    role === r
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "admin" && <ShieldCheck className="w-3 h-3" />}
                  {r === "technician" && <Wrench className="w-3 h-3" />}
                  {r === "customer" && <User className="w-3 h-3" />}
                  <span className="capitalize">{r}</span>
                </button>
              ))}
            </div>

            {/* Technician ID input (when technician role) */}
            <AnimatePresence>
              {role === "technician" && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden md:flex items-center gap-1.5 overflow-hidden"
                >
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    ID:
                  </span>
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
                    className="h-7 text-xs bg-background w-16"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-8 h-8 p-0"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-3 space-y-1">
                {/* Role switcher (mobile) */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 mx-2 mb-3">
                  {(["admin", "technician", "customer"] as AppRole[]).map(
                    (r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                          role === r
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground"
                        }`}
                      >
                        {r === "admin" && <ShieldCheck className="w-3 h-3" />}
                        {r === "technician" && <Wrench className="w-3 h-3" />}
                        {r === "customer" && <User className="w-3 h-3" />}
                        <span className="capitalize">{r}</span>
                      </button>
                    ),
                  )}
                </div>

                {role === "technician" && (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="text-xs text-muted-foreground">
                      Technician ID:
                    </span>
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
                      className="h-7 text-xs bg-background w-24"
                    />
                  </div>
                )}

                {/* Nav items (mobile) */}
                {visibleItems.map((item) => {
                  if (!isDropdown(item)) {
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md mx-2 ${
                          isActive(item.to)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <div key={item.label}>
                      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {item.label}
                      </p>
                      {item.items.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2 px-6 py-2 text-sm transition-colors rounded-md mx-2 ${
                            isActive(sub.to)
                              ? "text-primary font-medium bg-primary/5"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
