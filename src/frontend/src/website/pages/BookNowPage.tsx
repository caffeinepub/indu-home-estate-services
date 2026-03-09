import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetServices, useGetSubServicesByService } from "@/hooks/useQueries";
import { addContactMessage } from "@/store/websiteStore";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarCheck2,
  Check,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PHONE = "+91 99015 63799";
const WA_NUMBER = "919901563799";

const TIME_SLOTS = [
  "9:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 1:00 PM",
  "1:00 PM – 2:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
  "4:00 PM – 5:00 PM",
  "5:00 PM – 6:00 PM",
];

function generateBookingId(): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `IHE-${dateStr}-${rand}`;
}

interface BookingConfirmation {
  bookingId: string;
  name: string;
  phone: string;
  email: string;
  serviceName: string;
  subServiceName: string;
  date: string;
  time: string;
  address: string;
  notes: string;
}

function buildAdminMessage(c: BookingConfirmation): string {
  return `🔔 *New Booking Alert!*

📋 *Booking ID:* ${c.bookingId}
👤 *Customer:* ${c.name}
📱 *Mobile:* ${c.phone}
🛠️ *Service:* ${c.serviceName}
🔧 *Sub-Service:* ${c.subServiceName || "Not specified"}
📅 *Date:* ${c.date}
⏰ *Time:* ${c.time || "Flexible"}
📍 *Address:* ${c.address}
📝 *Notes:* ${c.notes || "None"}

Please confirm and assign a technician.`;
}

function buildCustomerMessage(c: BookingConfirmation): string {
  return `Hi ${c.name}! 👋

✅ Your booking with *Indu Homes & Estates Services* has been received!

📋 *Booking ID:* ${c.bookingId}
🛠️ *Service:* ${c.serviceName}
🔧 *Sub-Service:* ${c.subServiceName || "Not specified"}
📅 *Date:* ${c.date}
⏰ *Time:* ${c.time || "Flexible"}
📍 *Address:* ${c.address}

Our team will contact you on *${c.phone}* within 2 hours to confirm.

Thank you for choosing us! 🙏
*Indu Homes & Estates Services*
📞 +91 99015 63799`;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`${label} copied to clipboard!`))
    .catch(() => toast.error("Failed to copy. Please copy manually."));
}

// ── Confirmation Screen ────────────────────────────────────────────────────────
function ConfirmationScreen({ booking }: { booking: BookingConfirmation }) {
  const adminMsg = buildAdminMessage(booking);
  const customerMsg = buildCustomerMessage(booking);

  return (
    <div className="pt-16 min-h-screen" style={{ background: "#f3f4f6" }}>
      {/* Success Banner */}
      <div
        className="py-12"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #14532d 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(74,222,128,0.15)",
              border: "2px solid #4ade80",
            }}
          >
            <CalendarCheck2 className="w-8 h-8" style={{ color: "#4ade80" }} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Booking Request Confirmed!
          </h1>
          <p className="text-green-200 text-base mb-4">
            We've received your request. Our team will contact you within 2
            hours.
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#a7f3d0",
            }}
          >
            <span>Booking ID:</span>
            <span style={{ color: "#fff" }}>{booking.bookingId}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Booking Summary Card */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            className="font-display text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: "#111827" }}
          >
            <CalendarCheck2 className="w-4 h-4" style={{ color: "#16a34a" }} />
            Booking Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryRow
              icon={<span className="text-base">👤</span>}
              label="Customer"
              value={booking.name}
            />
            <SummaryRow
              icon={<span className="text-base">📱</span>}
              label="Phone"
              value={booking.phone}
            />
            <SummaryRow
              icon={<Wrench className="w-4 h-4" style={{ color: "#2563eb" }} />}
              label="Service"
              value={booking.serviceName}
            />
            {booking.subServiceName && (
              <SummaryRow
                icon={<span className="text-base">🔧</span>}
                label="Sub-Service"
                value={booking.subServiceName}
              />
            )}
            <SummaryRow
              icon={
                <Calendar className="w-4 h-4" style={{ color: "#9333ea" }} />
              }
              label="Date"
              value={booking.date}
            />
            {booking.time && (
              <SummaryRow
                icon={
                  <Clock className="w-4 h-4" style={{ color: "#ea580c" }} />
                }
                label="Time"
                value={booking.time}
              />
            )}
            <div className="sm:col-span-2">
              <SummaryRow
                icon={
                  <MapPin className="w-4 h-4" style={{ color: "#dc2626" }} />
                }
                label="Address"
                value={booking.address}
              />
            </div>
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #f3f4f6" }}>
            <Badge
              data-ocid="booknow.status.card"
              className="text-xs font-semibold px-3 py-1"
              style={{
                background: "#fef9c3",
                color: "#854d0e",
                border: "1px solid #fde047",
              }}
            >
              ⏳ Pending Confirmation
            </Badge>
            <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
              A 30% advance payment will be required to confirm the booking. Our
              team will call you to arrange this.
            </p>
          </div>
        </div>

        {/* WhatsApp Messages */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            className="font-display text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: "#111827" }}
          >
            <Share2 className="w-4 h-4" style={{ color: "#25d366" }} />
            Share on WhatsApp
          </h2>
          <p className="text-sm mb-4" style={{ color: "#6b7280" }}>
            Use these ready-made messages to notify the team and confirm your
            booking.
          </p>

          <Tabs defaultValue="admin" data-ocid="booknow.whatsapp.tab">
            <TabsList className="w-full mb-4">
              <TabsTrigger
                value="admin"
                data-ocid="booknow.admin_msg.tab"
                className="flex-1 text-xs font-semibold"
              >
                📣 Notify Admin
              </TabsTrigger>
              <TabsTrigger
                value="customer"
                data-ocid="booknow.customer_msg.tab"
                className="flex-1 text-xs font-semibold"
              >
                👋 Customer Copy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <WhatsAppMessageBlock
                message={adminMsg}
                sendLabel="Send to Admin on WhatsApp"
                waTarget={WA_NUMBER}
                ocidPrefix="admin"
              />
            </TabsContent>

            <TabsContent value="customer">
              <WhatsAppMessageBlock
                message={customerMsg}
                sendLabel="Send to My WhatsApp"
                waTarget={booking.phone.replace(/\D/g, "").replace(/^0/, "91")}
                ocidPrefix="customer"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            data-ocid="booknow.home.link"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              color: "#374151",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/services"
            data-ocid="booknow.services.link"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#2563eb" }}
          >
            Browse More Services
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/track-booking"
            data-ocid="booknow.track.link"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#0f172a", color: "#e2e8f0" }}
          >
            Track this Booking
          </Link>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-medium" style={{ color: "#9ca3af" }}>
          {label}
        </p>
        <p className="text-sm font-semibold" style={{ color: "#111827" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function WhatsAppMessageBlock({
  message,
  sendLabel,
  waTarget,
  ocidPrefix,
}: {
  message: string;
  sendLabel: string;
  waTarget: string;
  ocidPrefix: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(message, "Message");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(message)}`;

  return (
    <div className="space-y-3">
      {/* Message Preview */}
      <div
        className="rounded-xl p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-auto max-h-52"
        style={{
          background: "#111827",
          color: "#d1fae5",
          border: "1px solid #1f2937",
        }}
        data-ocid={`booknow.${ocidPrefix}_msg.panel`}
      >
        {message}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid={`booknow.${ocidPrefix}_copy.button`}
          onClick={handleCopy}
          className="flex-1 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Message
            </>
          )}
        </Button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`booknow.${ocidPrefix}_wa.button`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "#25d366" }}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {sendLabel}
        </a>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function BookNowPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSubServiceName, setSelectedSubServiceName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null,
  );

  const { data: services = [] } = useGetServices();
  const { data: subServices = [] } = useGetSubServicesByService(
    selectedServiceId ? BigInt(selectedServiceId) : null,
  );

  const selectedService = services.find(
    (s) => String(s.id) === selectedServiceId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!selectedServiceId) {
      toast.error("Please select a service category.");
      return;
    }
    if (!date) {
      toast.error("Please select a preferred date.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your service address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const bookingId = generateBookingId();
      const serviceName = selectedService?.name ?? "Service";

      const confirm: BookingConfirmation = {
        bookingId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || "",
        serviceName,
        subServiceName: selectedSubServiceName,
        date,
        time,
        address: address.trim(),
        notes: notes.trim(),
      };

      // Store in websiteStore (syncs to dashboard)
      addContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || "Not provided",
        message: `📋 BOOKING REQUEST | ID: ${bookingId}\nService: ${serviceName}\nSub-Service: ${selectedSubServiceName || "Not specified"}\nDate: ${date}${time ? ` at ${time}` : ""}\nAddress: ${address.trim()}\nNotes: ${notes.trim() || "None"}`,
      });

      setLoading(false);
      setConfirmation(confirm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  };

  // Show confirmation screen after successful submit
  if (confirmation) {
    return <ConfirmationScreen booking={confirmation} />;
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="py-16"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 mb-4">
            <Wrench className="w-3 h-3" />
            Book a Service
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Book Your Service
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-6">
            Fill in the form below and our team will confirm your booking within
            2 hours.
          </p>
          {/* Contact strip */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
            <a
              href="tel:+919901563799"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              {PHONE}
            </a>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Mon – Sat, 9AM – 6PM
            </span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Chikmagalur, Karnataka
            </span>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl bg-white p-8 sm:p-10"
            style={{
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            }}
          >
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Service Booking Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bn-name">Full Name *</Label>
                  <Input
                    id="bn-name"
                    data-ocid="booknow.name.input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bn-phone">Phone Number *</Label>
                  <Input
                    id="bn-phone"
                    data-ocid="booknow.phone.input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bn-email">Email (Optional)</Label>
                <Input
                  id="bn-email"
                  data-ocid="booknow.email.input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {/* Service Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bn-service">Service Category *</Label>
                  <select
                    id="bn-service"
                    data-ocid="booknow.service.select"
                    value={selectedServiceId}
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value);
                      setSelectedSubServiceName("");
                    }}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={String(s.id)} value={String(s.id)}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="bn-subservice">Sub-Service (Optional)</Label>
                  <select
                    id="bn-subservice"
                    data-ocid="booknow.subservice.select"
                    value={selectedSubServiceName}
                    onChange={(e) => setSelectedSubServiceName(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={!selectedServiceId}
                  >
                    <option value="">
                      {!selectedServiceId
                        ? "Select service first"
                        : subServices.length === 0
                          ? "Loading..."
                          : "Select sub-service"}
                    </option>
                    {subServices.map((sub) => (
                      <option key={String(sub.id)} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bn-date">Preferred Date *</Label>
                  <Input
                    id="bn-date"
                    data-ocid="booknow.date.input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bn-time">Preferred Time Slot</Label>
                  <select
                    id="bn-time"
                    data-ocid="booknow.time.select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Any time</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="bn-address">Service Address *</Label>
                <Textarea
                  id="bn-address"
                  data-ocid="booknow.address.textarea"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address where service is required"
                  rows={3}
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="bn-notes">Additional Notes</Label>
                <Textarea
                  id="bn-notes"
                  data-ocid="booknow.notes.textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requirements or details..."
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                data-ocid="booknow.submit_button"
                disabled={loading}
                className="w-full py-3 text-white font-bold text-base flex items-center justify-center gap-2"
                style={{ background: "#2563eb" }}
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    Confirm Booking Request
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-400">
                By submitting, you agree to be contacted by our team to confirm
                availability. A 30% advance is required to finalize the booking.
              </p>
            </form>
          </div>

          {/* Quick contact bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+919901563799"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
              style={{
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            >
              <Phone className="w-4 h-4 text-blue-600" />
              Call: {PHONE}
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20want%20to%20book%20a%20service.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#25D366" }}
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
