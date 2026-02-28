import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addInspection } from "@/store/websiteStore";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SERVICE_TYPES = [
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

export function InspectionsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !serviceType ||
      !preferredDate
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addInspection({
        name,
        phone,
        address,
        serviceType,
        preferredDate,
        notes,
      });
      setLoading(false);
      setSubmitted(true);
      toast.success("Inspection request submitted successfully!");
    }, 600);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#bfdbfe",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            100% Free — No Obligation
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Request Free Site Inspection
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Our expert will visit your property, assess all requirements, and
            provide a detailed report with recommendations — completely free of
            charge.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              {submitted ? (
                <div
                  className="rounded-3xl p-8 bg-white text-center"
                  style={{
                    border: "1px solid #bbf7d0",
                    boxShadow: "0 4px 20px rgba(34,197,94,0.15)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "#dcfce7" }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
                    Request Submitted!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you, <strong>{name}</strong>. Your free inspection
                    request has been received. Our team will contact you shortly
                    to confirm the schedule.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Preferred date: <strong>{preferredDate}</strong>
                  </p>
                  <Button
                    type="button"
                    className="text-white"
                    style={{ background: "#2563eb" }}
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setAddress("");
                      setServiceType("");
                      setPreferredDate("");
                      setNotes("");
                    }}
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <div
                  className="rounded-3xl p-8 bg-white"
                  style={{
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "#dbeafe" }}
                    >
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-gray-900">
                        Inspection Request
                      </h2>
                      <p className="text-xs text-gray-500">
                        Fill the form to schedule your free inspection
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="insp-name">Full Name *</Label>
                        <Input
                          id="insp-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="insp-phone">Phone Number *</Label>
                        <Input
                          id="insp-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="insp-address">Property Address *</Label>
                      <Textarea
                        id="insp-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full address including area and landmark"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="insp-service">Type of Service *</Label>
                        <Select
                          value={serviceType}
                          onValueChange={setServiceType}
                          required
                        >
                          <SelectTrigger id="insp-service">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_TYPES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="insp-date">Preferred Date *</Label>
                        <Input
                          id="insp-date"
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="insp-notes">Additional Notes</Label>
                      <Textarea
                        id="insp-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any specific concerns or requirements..."
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-3 text-white font-bold"
                      style={{ background: "#2563eb" }}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Request Free Inspection"}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="space-y-6">
              {/* What to expect */}
              <div
                className="rounded-3xl p-6 bg-white"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <h3 className="font-display text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  What to Expect
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Submit Request",
                      desc: "Fill the form with your property details and preferred date.",
                    },
                    {
                      step: "2",
                      title: "Confirmation Call",
                      desc: "Our team calls within 2 hours to confirm the inspection time.",
                    },
                    {
                      step: "3",
                      title: "Expert Visit",
                      desc: "A certified inspector visits your property on the scheduled date.",
                    },
                    {
                      step: "4",
                      title: "Detailed Report",
                      desc: "You receive a complete report with findings, recommendations and quotation.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                        style={{ background: "#2563eb" }}
                      >
                        {item.step}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                }}
              >
                <h3 className="text-white font-bold text-base mb-4">
                  Prefer to Call?
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-medium">+91 98765 43210</span>
                  </a>
                  <div className="flex items-center gap-3 text-blue-200">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm">
                      Serving Chikmagalur, Mudigere &amp; Hassan
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Mon–Sat, 9AM–6PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
