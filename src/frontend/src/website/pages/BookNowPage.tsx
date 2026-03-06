import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetServices, useGetSubServicesByService } from "@/hooks/useQueries";
import { addContactMessage } from "@/store/websiteStore";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
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

export function BookNowPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSubService, setSelectedSubService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: services = [] } = useGetServices();
  const { data: subServices = [] } = useGetSubServicesByService(
    selectedServiceId ? BigInt(selectedServiceId) : null,
  );

  const selectedService = services.find(
    (s) => String(s.id) === selectedServiceId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !selectedServiceId ||
      !date ||
      !address.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || "Not provided",
        message: `BOOKING REQUEST\nService: ${selectedService?.name ?? selectedServiceId}\nSub-Service: ${selectedSubService || "Not specified"}\nDate: ${date}${time ? ` at ${time}` : ""}\nAddress: ${address.trim()}\nNotes: ${notes.trim() || "None"}`,
      });
      setLoading(false);
      setSuccess(true);
      toast.success("Booking request sent! We will contact you shortly.");
    }, 600);
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#dcfce7" }}
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
            Booking Request Received!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you, <strong>{name}</strong>. Our team will review your
            request and confirm your booking within 2 hours.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            We will contact you on <strong>{phone}</strong> to confirm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20just%20submitted%20a%20booking%20request%20for%20${encodeURIComponent(selectedService?.name ?? "service")}%20on%20${encodeURIComponent(date)}.%20Please%20confirm.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: "#25D366" }}
            >
              Confirm on WhatsApp
            </a>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl font-bold text-sm border-2 text-blue-700 flex items-center justify-center gap-2"
              style={{ borderColor: "#2563eb" }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
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
                      setSelectedSubService("");
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
                    value={selectedSubService}
                    onChange={(e) => setSelectedSubService(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={!selectedServiceId || subServices.length === 0}
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
