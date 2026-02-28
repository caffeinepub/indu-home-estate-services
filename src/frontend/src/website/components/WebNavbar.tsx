import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Properties", to: "/properties" },
  { label: "Inspections", to: "/inspections" },
  { label: "Contact", to: "/contact" },
  { label: "Testimonials", to: "/testimonials" },
];

export function WebNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change - pathname is the trigger
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally watching pathname to close menu
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(15, 23, 42, 0.97)"
            : "rgba(15, 23, 42, 0.82)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                }}
              >
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight font-display">
                  Indu Homes
                </p>
                <p className="text-blue-300 text-[10px] leading-tight font-medium tracking-wide">
                  & ESTATES SERVICES
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-3 py-2 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive(link.to)
                      ? "#93c5fd"
                      : "rgba(255,255,255,0.8)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.to))
                      (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.to))
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.8)";
                  }}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: "#3b82f6" }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                  boxShadow: "0 2px 12px rgba(37,99,235,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "none";
                }}
              >
                Book Service
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              {/* Hamburger */}
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.1)" }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden"
            style={{
              background: "rgba(10, 15, 30, 0.98)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: isActive(link.to)
                      ? "#93c5fd"
                      : "rgba(255,255,255,0.8)",
                    background: isActive(link.to)
                      ? "rgba(37,99,235,0.15)"
                      : "transparent",
                  }}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 mx-0 mt-3 px-4 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#2563eb" }}
              >
                Book Service
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
