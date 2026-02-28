import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { WebsiteLayout } from "@/layouts/WebsiteLayout";
import type { AppRole } from "@/lib/helpers";
import { AddServicePage } from "@/pages/AddServicePage";
import { AddTechnicianPage } from "@/pages/AddTechnicianPage";
import { AddUserPage } from "@/pages/AddUserPage";
import { AllBookingsPage } from "@/pages/AllBookingsPage";
import { AllUsersPage } from "@/pages/AllUsersPage";
import { ContactMessagesDashboard } from "@/pages/ContactMessagesDashboard";
import { CreateBookingPage } from "@/pages/CreateBookingPage";
import { CustomerBookingsPage } from "@/pages/CustomerBookingsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { InspectionsDashboard } from "@/pages/InspectionsDashboard";
import { InvoicesPage } from "@/pages/InvoicesPage";
import { PropertiesAdminPage } from "@/pages/PropertiesAdminPage";
import { QuotationsDashboard } from "@/pages/QuotationsDashboard";
import { ReportsPage } from "@/pages/ReportsPage";
import { ServiceListPage } from "@/pages/ServiceListPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { TechnicianJobsPage } from "@/pages/TechnicianJobsPage";
import { TechnicianListPage } from "@/pages/TechnicianListPage";
import { TestimonialsAdminPage } from "@/pages/TestimonialsAdminPage";
import { AboutPage } from "@/website/pages/AboutPage";
import { ContactPage } from "@/website/pages/ContactPage";
import { HomePage } from "@/website/pages/HomePage";
import { InspectionsPage } from "@/website/pages/InspectionsPage";
import { PropertiesPage } from "@/website/pages/PropertiesPage";
import { ServicesPage } from "@/website/pages/ServicesPage";
import { TestimonialsPage } from "@/website/pages/TestimonialsPage";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

/* ─── App State Context ───────────────────────────────────────── */

interface AppState {
  role: AppRole;
  setRole: (r: AppRole) => void;
  activeTechnicianId: bigint | null;
  setActiveTechnicianId: (id: bigint | null) => void;
}

// Module-level state for route component access
let appState: AppState = {
  role: "admin",
  setRole: () => {},
  activeTechnicianId: null,
  setActiveTechnicianId: () => {},
};

/* ─── Dashboard Layout Component ───────────────────────────────── */

function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Toaster position="top-right" richColors />
      <div className="flex min-h-screen bg-background">
        {/* Fixed Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} role={appState.role} />

        {/* Right column: Header + Content */}
        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            marginLeft: sidebarCollapsed ? "64px" : "240px",
            transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Fixed header */}
          <Header
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((p) => !p)}
            role={appState.role}
            setRole={appState.setRole}
            activeTechnicianId={appState.activeTechnicianId}
            setActiveTechnicianId={appState.setActiveTechnicianId}
          />

          {/* Main content */}
          <main
            className="flex-1 p-6 overflow-auto bg-[#F3F4F6]"
            style={{ marginTop: "60px" }}
          >
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="border-t border-border px-6 py-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Indu Homes &amp; Estates Services.
              All rights reserved.{" "}
              <span className="opacity-60">Chikmagalur, Karnataka, India.</span>
            </p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

/* ─── Website Wrapper (with Toaster) ──────────────────────────── */

function WebsiteLayoutWrapper() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Toaster position="top-right" richColors />
      <WebsiteLayout />
    </ThemeProvider>
  );
}

/* ─── Route Tree ───────────────────────────────────────────────── */

const rootRoute = createRootRoute();

// ── Website layout (no sidebar/header) — mounted at "/"
const websiteLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: WebsiteLayoutWrapper,
});

const websiteHomeRoute = createRoute({
  getParentRoute: () => websiteLayoutRoute,
  path: "/",
  component: HomePage,
});

const websiteAboutRoute = createRoute({
  getParentRoute: () => websiteLayoutRoute,
  path: "/about",
  component: AboutPage,
});

const websiteServicesRoute = createRoute({
  getParentRoute: () => websiteLayoutRoute,
  path: "/services",
  component: ServicesPage,
});

const websitePropertiesRoute = createRoute({
  getParentRoute: () => websiteLayoutRoute,
  path: "/properties",
  component: PropertiesPage,
});

const websiteInspectionsRoute = createRoute({
  getParentRoute: () => websiteLayoutRoute,
  path: "/inspections",
  component: InspectionsPage,
});

const websiteContactRoute = createRoute({
  getParentRoute: () => websiteLayoutRoute,
  path: "/contact",
  component: ContactPage,
});

const websiteTestimonialsRoute = createRoute({
  getParentRoute: () => websiteLayoutRoute,
  path: "/testimonials",
  component: TestimonialsPage,
});

// ── Dashboard root (with sidebar/header layout) — mounted at "/admin"
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: DashboardPage,
});

const createBookingRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/bookings/create",
  component: CreateBookingPage,
});

const allBookingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/bookings/all",
  component: function AllBookingsWrapper() {
    return <AllBookingsPage isAdmin={appState.role === "admin"} />;
  },
});

const invoicesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/bookings/invoices",
  component: InvoicesPage,
});

const addUserRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/users/add",
  component: AddUserPage,
});

const allUsersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/users/all",
  component: AllUsersPage,
});

const addTechnicianRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/technicians/add",
  component: AddTechnicianPage,
});

const technicianListRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/technicians/list",
  component: function TechnicianListWrapper() {
    return <TechnicianListPage isAdmin={appState.role === "admin"} />;
  },
});

const addServiceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/services/add",
  component: AddServicePage,
});

const serviceListRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/services/list",
  component: ServiceListPage,
});

const technicianJobsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/technician/jobs",
  component: function TechnicianJobsWrapper() {
    return (
      <TechnicianJobsPage activeTechnicianId={appState.activeTechnicianId} />
    );
  },
});

const customerBookingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/customer/bookings",
  component: CustomerBookingsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/reports",
  component: ReportsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});

// ── New website dashboard routes
const inspectionsDashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/inspections",
  component: InspectionsDashboard,
});

const quotationsDashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/quotations",
  component: QuotationsDashboard,
});

const propertiesAdminRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/properties-admin",
  component: PropertiesAdminPage,
});

const testimonialsAdminRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/testimonials-admin",
  component: TestimonialsAdminPage,
});

const contactMessagesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/contact-messages",
  component: ContactMessagesDashboard,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: function NotFound() {
    return <Navigate to="/" />;
  },
});

const routeTree = rootRoute.addChildren([
  websiteLayoutRoute.addChildren([
    websiteHomeRoute,
    websiteAboutRoute,
    websiteServicesRoute,
    websitePropertiesRoute,
    websiteInspectionsRoute,
    websiteContactRoute,
    websiteTestimonialsRoute,
  ]),
  dashboardLayoutRoute.addChildren([
    indexRoute,
    createBookingRoute,
    allBookingsRoute,
    invoicesRoute,
    addUserRoute,
    allUsersRoute,
    addTechnicianRoute,
    technicianListRoute,
    addServiceRoute,
    serviceListRoute,
    technicianJobsRoute,
    customerBookingsRoute,
    reportsRoute,
    settingsRoute,
    inspectionsDashboardRoute,
    quotationsDashboardRoute,
    propertiesAdminRoute,
    testimonialsAdminRoute,
    contactMessagesRoute,
  ]),
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/* ─── App Root ─────────────────────────────────────────────────── */

export default function App() {
  const [role, setRole] = useState<AppRole>("admin");
  const [activeTechnicianId, setActiveTechnicianId] = useState<bigint | null>(
    null,
  );

  // Update module-level state so route components can access it
  appState.role = role;
  appState.setRole = setRole;
  appState.activeTechnicianId = activeTechnicianId;
  appState.setActiveTechnicianId = setActiveTechnicianId;

  return <RouterProvider router={router} />;
}
