import { Link } from "@tanstack/react-router";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export const ALL_FAQS = [
  {
    q: "Do you provide free inspection?",
    a: "Yes! We offer a completely free site inspection for all types of services. Our expert will visit your property, assess the requirements, and provide a detailed report with recommendations at no cost.",
  },
  {
    q: "How can I book a service?",
    a: "You can book a service through our website using the 'Book a Service' button, call us directly at +91 98765 43210, or send a message on WhatsApp. We typically confirm your booking within 2 hours.",
  },
  {
    q: "How will I receive the quotation?",
    a: "After submitting your quotation request or free inspection, our team will prepare a detailed quotation and send it to your phone/email within 24 hours. The quotation includes breakdown of all charges.",
  },
  {
    q: "Is advance payment required?",
    a: "Yes, a 30% advance payment is required to confirm the booking. The remaining 70% is collected after the service is completed to your satisfaction.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations made 24+ hours before the scheduled service are fully refundable. Cancellations within 24 hours may incur a small cancellation fee. Please contact us to reschedule instead of cancelling.",
  },
  {
    q: "How long does a service typically take?",
    a: "Service duration varies by type and scope. Basic repairs take 1-3 hours. Deep cleaning takes 3-8 hours based on property size. Painting projects can take 1-5 days. Estate services are planned by scope. We always provide estimated timelines at booking.",
  },
  {
    q: "Do you provide service warranty?",
    a: "Yes, we provide a service warranty on workmanship. Plumbing and electrical work carries a 30-day warranty. Painting has a 6-month warranty on finish. Pest control treatments include a follow-up visit if needed within 30 days.",
  },
  {
    q: "Are technicians verified and trained?",
    a: "All our technicians are thoroughly background-verified, trained, and experienced professionals. They carry ID cards during service visits. We conduct regular training to keep them updated with latest techniques.",
  },
  {
    q: "Do you serve areas outside Chikmagalur?",
    a: "Yes! We serve Chikmagalur city and surrounding areas including Mudigere, Birur, and parts of Hassan district. For remote estate properties, please contact us to discuss logistics and additional travel charges if applicable.",
  },
  {
    q: "How can I contact support?",
    a: "You can reach us via phone at +91 98765 43210, email at induhomeservices@gmail.com, or WhatsApp. Our support team is available Monday to Saturday, 9AM to 6PM. Emergency services are available on request.",
  },
  {
    q: "Is pricing fixed or negotiable?",
    a: "Our pricing is transparent and competitive with standard market rates. The base prices are fixed. However, for bulk services, AMC contracts, or estate maintenance packages, we offer special discounted rates.",
  },
  {
    q: "What if my service is delayed?",
    a: "If a technician is delayed, we will inform you at least 1 hour in advance and reschedule at your convenience. We prioritize punctuality and aim to deliver on-time service always.",
  },
  {
    q: "Do you provide emergency services?",
    a: "Yes, we handle emergency plumbing and electrical calls. Emergency service charges may apply outside business hours. Call us at +91 98765 43210 for immediate assistance.",
  },
  {
    q: "How do I reschedule a booking?",
    a: "To reschedule, contact us 12+ hours before the scheduled time via phone or WhatsApp. We will accommodate your preferred new time slot at no extra charge. You can reschedule up to 2 times per booking.",
  },
  {
    q: "Is GST included in the quoted price?",
    a: "Quoted prices are exclusive of GST unless stated otherwise. GST will be clearly mentioned in your final invoice as per applicable government rates. For residential services, GST is typically 18%.",
  },
];

export function FAQPreview() {
  const preview = ALL_FAQS.slice(0, 5);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Quick answers to common questions about our services.
          </p>
        </div>

        <div className="space-y-3">
          {preview.map((faq, i) => (
            <div
              key={faq.q}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border:
                  openIndex === i ? "1px solid #bfdbfe" : "1px solid #e5e7eb",
                background: openIndex === i ? "#eff6ff" : "#ffffff",
              }}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="flex items-center gap-3">
                  <HelpCircle
                    className="w-4 h-4 shrink-0"
                    style={{ color: openIndex === i ? "#2563eb" : "#9ca3af" }}
                  />
                  <span
                    className="font-semibold text-sm"
                    style={{ color: openIndex === i ? "#1e40af" : "#111827" }}
                  >
                    {faq.q}
                  </span>
                </span>
                <ChevronDown
                  className="w-4 h-4 shrink-0 transition-transform duration-200"
                  style={{
                    transform: openIndex === i ? "rotate(180deg)" : "none",
                    color: openIndex === i ? "#2563eb" : "#9ca3af",
                  }}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed pl-[52px]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-blue-700 transition-all hover:bg-blue-50"
            style={{ border: "2px solid #2563eb" }}
          >
            Have more questions? Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
