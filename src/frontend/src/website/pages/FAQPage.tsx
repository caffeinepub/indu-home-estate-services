import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const FAQ_DATA = [
  {
    category: "General",
    icon: "🏠",
    color: "#3b82f6",
    items: [
      {
        q: "What is Indu Homes & Estates Services?",
        a: "We are a professional home and estate services company based in Chikmagalur, Karnataka. We provide a wide range of home maintenance, repair, and estate management services for residential and commercial clients.",
      },
      {
        q: "Which areas do you serve?",
        a: "We primarily serve Chikmagalur and surrounding areas in Karnataka. Contact us to confirm availability in your specific location.",
      },
      {
        q: "Are your technicians certified and experienced?",
        a: "Yes, all our technicians are trained, certified, and have hands-on experience in their respective fields. We conduct background checks and regular skill assessments.",
      },
      {
        q: "How do I contact customer support?",
        a: "You can reach us via WhatsApp or phone at 9901563799, or email us at induhomeservices@gmail.com. Our team is available Monday–Saturday, 9am–6pm.",
      },
      {
        q: "Do you offer service guarantees?",
        a: "Yes, all our services come with a satisfaction guarantee. If you are not happy with the work, we will re-do it at no extra charge within the warranty period.",
      },
    ],
  },
  {
    category: "Bookings",
    icon: "📅",
    color: "#8b5cf6",
    items: [
      {
        q: "How do I book a service?",
        a: "You can book online via our Book Now page, call us on 9901563799, or WhatsApp us. Select your service, provide your address and preferred date, and we'll confirm your booking.",
      },
      {
        q: "Can I cancel or reschedule a booking?",
        a: "Yes, you can cancel or reschedule up to 24 hours before the scheduled time by contacting us via phone or WhatsApp. Cancellations within 24 hours may incur a small fee.",
      },
      {
        q: "How do I track my booking status?",
        a: "Use our Track Booking page and enter your Booking ID to see real-time status updates, technician assignment, and payment summary.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 24–48 hours in advance for best availability. For urgent or emergency services, call us directly at 9901563799.",
      },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    color: "#10b981",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept cash, UPI (Google Pay, PhonePe, Paytm), and bank transfers. Online card payments are coming soon.",
      },
      {
        q: "Do I need to pay an advance?",
        a: "For most services, a 30–50% advance is required at the time of booking confirmation. The balance is collected after the job is completed to your satisfaction.",
      },
      {
        q: "Will I receive an invoice?",
        a: "Yes, a detailed invoice is generated for every booking, which includes service details, technician info, materials used, and payment breakdown. You can download or print it from your booking confirmation.",
      },
    ],
  },
  {
    category: "Services",
    icon: "🔧",
    color: "#f59e0b",
    items: [
      {
        q: "What types of AC services do you offer?",
        a: "We offer AC installation, regular servicing, gas refilling, deep cleaning, and repair for all major brands and models (split, window, cassette type).",
      },
      {
        q: "Do you handle plumbing emergencies?",
        a: "Yes, we handle emergency plumbing issues like leaks, burst pipes, and blocked drains. Call us on 9901563799 for urgent assistance.",
      },
      {
        q: "Can you handle full home deep cleaning?",
        a: "Absolutely. Our deep cleaning service covers kitchen, bathrooms, living areas, windows, and more. We use professional-grade equipment and eco-friendly products.",
      },
      {
        q: "Do you provide electrical wiring and installation services?",
        a: "Yes, we handle all electrical work including wiring, switchboard installation, fan/light fitting, inverter setup, and safety inspections by licensed electricians.",
      },
    ],
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="border border-slate-200 rounded-xl overflow-hidden bg-white"
      style={{
        boxShadow: open
          ? "0 4px 20px rgba(37,99,235,0.08)"
          : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        data-ocid="faq.toggle"
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
        style={{ background: open ? "rgba(37,99,235,0.03)" : "white" }}
        aria-expanded={open}
      >
        <span className="text-slate-800 font-semibold text-[15px] leading-snug pr-4">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: open ? "#2563eb" : "#f1f5f9" }}
        >
          <ChevronDown
            className="w-4 h-4"
            style={{ color: open ? "white" : "#64748b" }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-6 pb-5 text-slate-600 text-sm leading-relaxed"
              style={{ borderTop: "1px solid #f1f5f9" }}
            >
              <p className="pt-4">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = FAQ_DATA.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter(
    (cat) =>
      (!activeCategory || cat.category === activeCategory) &&
      cat.items.length > 0,
  );

  const totalFAQs = FAQ_DATA.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a6e 50%, #1d4ed8 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-blue-200 mb-6"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <HelpCircle className="w-4 h-4" />
            Help Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display"
          >
            Frequently Asked
            <span
              className="block"
              style={{
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
                backgroundImage: "linear-gradient(90deg, #93c5fd, #c4b5fd)",
              }}
            >
              Questions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-200 text-lg mb-10 max-w-xl mx-auto"
          >
            Find answers to {totalFAQs}+ common questions about our services,
            bookings, and payments.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="faq.search_input"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 text-sm font-medium outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.98)",
                border: "2px solid transparent",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "transparent";
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Category filter pills */}
      <section
        className="sticky top-16 z-30 bg-white border-b border-slate-200"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            data-ocid="faq.tab"
            className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: !activeCategory ? "#1d4ed8" : "#f1f5f9",
              color: !activeCategory ? "white" : "#475569",
            }}
          >
            All ({FAQ_DATA.reduce((a, c) => a + c.items.length, 0)})
          </button>
          {FAQ_DATA.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.category ? null : cat.category,
                )
              }
              data-ocid="faq.tab"
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5"
              style={{
                background:
                  activeCategory === cat.category ? cat.color : "#f1f5f9",
                color: activeCategory === cat.category ? "white" : "#475569",
              }}
            >
              <span>{cat.icon}</span>
              {cat.category} ({cat.items.length})
            </button>
          ))}
        </div>
      </section>

      {/* FAQ content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {filtered.length === 0 ? (
          <div data-ocid="faq.empty_state" className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No results found
            </h3>
            <p className="text-slate-500">
              Try a different keyword or browse all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory(null);
              }}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          filtered.map((cat) => (
            <motion.section
              key={cat.category}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${cat.color}18` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 font-display">
                    {cat.category}
                  </h2>
                  <p className="text-slate-500 text-xs">
                    {cat.items.length} question
                    {cat.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex-1 h-px bg-slate-200 ml-2" />
              </div>

              <div className="space-y-3">
                {cat.items.map((item, i) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            </motion.section>
          ))
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
          }}
        >
          <div className="px-8 py-12 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(59,130,246,0.2)" }}
            >
              <HelpCircle className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-display">
              Still have questions?
            </h3>
            <p className="text-blue-200 mb-8 max-w-md mx-auto">
              Our friendly support team is ready to help. Reach out via contact
              form or WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                data-ocid="faq.contact.button"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Contact Us
              </Link>
              <a
                href="https://wa.me/919901563799"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="faq.whatsapp.button"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Phone className="w-4 h-4" />
                WhatsApp: 9901563799
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer attribution */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
