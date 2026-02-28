import { WebFooter } from "@/website/components/WebFooter";
import { WebNavbar } from "@/website/components/WebNavbar";
import { WhatsAppButton } from "@/website/components/WhatsAppButton";
import { Outlet } from "@tanstack/react-router";

export function WebsiteLayout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#ffffff" }}
    >
      <WebNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <WebFooter />
      <WhatsAppButton />
    </div>
  );
}
