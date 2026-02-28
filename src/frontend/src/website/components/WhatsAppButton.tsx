import { MessageCircle } from "lucide-react";

const WA_URL =
  "https://wa.me/919876543210?text=Hello%20Indu%20Homes%20%26%20Estates%20Services%2C%20I%20need%20your%20assistance.";

export function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      style={{
        background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
        boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
      }}
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline">Chat with Us</span>
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{ background: "#25D366" }}
      />
    </a>
  );
}
