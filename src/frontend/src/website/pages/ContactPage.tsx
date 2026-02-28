import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addContactMessage, addQuotation } from "@/store/websiteStore";
import { useSearch } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SERVICE_OPTIONS = [
  "Plumbing",
  "Electrical",
  "Deep Cleaning",
  "Painting",
  "AC Service",
  "Pest Control",
  "Estate Maintenance",
  "Property Inspection",
  "Multiple Services",
  "Other",
];

function ContactForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addContactMessage({ name, phone, email, message });
      setLoading(false);
      onSuccess(name);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="c-name">Full Name *</Label>
          <Input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label htmlFor="c-phone">Phone *</Label>
          <Input
            id="c-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="c-email">Email *</Label>
        <Input
          id="c-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <Label htmlFor="c-message">Message *</Label>
        <Textarea
          id="c-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
          rows={4}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full py-3 text-white font-bold"
        style={{ background: "#2563eb" }}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function QuotationForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceRequired, setServiceRequired] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !serviceRequired.trim() ||
      !description.trim() ||
      !address.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addQuotation({ name, phone, serviceRequired, description, address });
      setLoading(false);
      onSuccess(name);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="q-name">Full Name *</Label>
          <Input
            id="q-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label htmlFor="q-phone">Phone *</Label>
          <Input
            id="q-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="q-service">Service Required *</Label>
        <select
          id="q-service"
          value={serviceRequired}
          onChange={(e) => setServiceRequired(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="q-desc">Service Description *</Label>
        <Textarea
          id="q-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your requirements in detail..."
          rows={3}
          required
        />
      </div>
      <div>
        <Label htmlFor="q-address">Property Address *</Label>
        <Textarea
          id="q-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full address"
          rows={2}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full py-3 text-white font-bold"
        style={{ background: "#2563eb" }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Request Quotation"}
      </Button>
    </form>
  );
}

export function ContactPage() {
  // Use any type to avoid missing route search params type
  const search = useSearch({ strict: false }) as Record<string, string>;
  const isQuotation = search?.type === "quotation";
  const [activeTab, setActiveTab] = useState<"contact" | "quotation">(
    isQuotation ? "quotation" : "contact",
  );
  const [successName, setSuccessName] = useState<string | null>(null);

  const handleSuccess = (name: string) => {
    setSuccessName(name);
    toast.success(
      activeTab === "contact"
        ? "Message sent! We'll get back to you soon."
        : "Quotation request submitted! We'll prepare your quote within 24 hours.",
    );
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
            Get In Touch
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have a question, need a service, or want a quotation? We're here to
            help.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form card */}
            <div
              className="rounded-3xl p-8 bg-white"
              style={{
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {/* Tabs */}
              <div
                className="flex rounded-xl p-1 mb-6"
                style={{ background: "#f3f4f6" }}
              >
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background:
                      activeTab === "contact" ? "#2563eb" : "transparent",
                    color: activeTab === "contact" ? "#ffffff" : "#374151",
                  }}
                  onClick={() => {
                    setActiveTab("contact");
                    setSuccessName(null);
                  }}
                >
                  Send Message
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background:
                      activeTab === "quotation" ? "#2563eb" : "transparent",
                    color: activeTab === "quotation" ? "#ffffff" : "#374151",
                  }}
                  onClick={() => {
                    setActiveTab("quotation");
                    setSuccessName(null);
                  }}
                >
                  Get Quotation
                </button>
              </div>

              {successName ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "#dcfce7" }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                    {activeTab === "contact"
                      ? "Message Sent!"
                      : "Quotation Requested!"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you, <strong>{successName}</strong>. We'll get back to
                    you shortly.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSuccessName(null)}
                  >
                    Send Another
                  </Button>
                </div>
              ) : activeTab === "contact" ? (
                <ContactForm onSuccess={handleSuccess} />
              ) : (
                <QuotationForm onSuccess={handleSuccess} />
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              {/* Contact details */}
              <div
                className="rounded-3xl p-6 bg-white"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <h3 className="font-display text-lg font-bold text-gray-900 mb-5">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      label: "Office Address",
                      value: "Main Road, Chikmagalur - 577101, Karnataka",
                      href: undefined,
                    },
                    {
                      icon: Phone,
                      label: "Phone / WhatsApp",
                      value: "+91 98765 43210",
                      href: "tel:+919876543210",
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      value: "induhomeservices@gmail.com",
                      href: "mailto:induhomeservices@gmail.com",
                    },
                    {
                      icon: Clock,
                      label: "Business Hours",
                      value: "Monday – Saturday, 9:00 AM – 6:00 PM",
                      href: undefined,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "#dbeafe" }}
                        >
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-gray-700">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Social links */}
                <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                  {[
                    {
                      icon: Facebook,
                      href: "#",
                      label: "Facebook",
                      color: "#3b5998",
                    },
                    {
                      icon: Instagram,
                      href: "#",
                      label: "Instagram",
                      color: "#e1306c",
                    },
                    {
                      icon: MessageCircle,
                      href: "https://wa.me/919876543210",
                      label: "WhatsApp",
                      color: "#25d366",
                    },
                  ].map(({ icon: Icon, href, label, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          `${color}22`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "#f3f4f6";
                      }}
                    >
                      <Icon className="w-4 h-4 text-gray-600" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919876543210?text=Hello%20Indu%20Homes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-3xl p-5 transition-transform hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
                }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-bold text-base">Chat on WhatsApp</p>
                  <p className="text-green-100 text-sm">
                    Instant reply — usually within minutes
                  </p>
                </div>
              </a>

              {/* Map */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <img
                  src="/assets/generated/chikmagalur-map.dim_800x400.jpg"
                  alt="Chikmagalur Location Map"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-white">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Main Road, Chikmagalur - 577101, Karnataka, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
