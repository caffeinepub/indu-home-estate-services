import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    icon: "🔧",
    title: "Plumbing",
    desc: "Expert plumbing solutions from leak repairs to complete bathroom fittings. Quick response, lasting results.",
    from: "₹499",
    color: "#dbeafe",
    textColor: "#1e40af",
  },
  {
    icon: "⚡",
    title: "Electrical",
    desc: "Certified electricians for wiring, installation, repairs and complete electrical setup.",
    from: "₹299",
    color: "#fef9c3",
    textColor: "#854d0e",
  },
  {
    icon: "🧹",
    title: "Deep Cleaning",
    desc: "Professional deep cleaning for homes, apartments, villas and commercial spaces. Move-in/out specialists.",
    from: "₹3,500",
    color: "#dcfce7",
    textColor: "#166534",
  },
  {
    icon: "🎨",
    title: "Painting",
    desc: "Interior, exterior, texture and waterproof painting by skilled professionals with premium quality finishes.",
    from: "₹12/sqft",
    color: "#fce7f3",
    textColor: "#9d174d",
  },
  {
    icon: "❄️",
    title: "AC Service",
    desc: "AC installation, servicing, gas filling, repairs and annual maintenance contracts for all brands.",
    from: "₹999",
    color: "#e0f2fe",
    textColor: "#0c4a6e",
  },
  {
    icon: "🐛",
    title: "Pest Control",
    desc: "Comprehensive pest management including termite, cockroach, mosquito control and eco-friendly treatments.",
    from: "₹1,200",
    color: "#fee2e2",
    textColor: "#991b1b",
  },
];

export function ServicesPreview() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-20 bg-white">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#2563eb" }}
          >
            What We Offer
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Professional home and estate services delivered by trained
            technicians across Chikmagalur.
          </p>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className={`group rounded-2xl p-6 cursor-pointer transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{
                border: "1px solid #e5e7eb",
                transitionDelay: `${i * 80}ms`,
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px) rotateX(2deg)";
                el.style.boxShadow = "0 20px 40px rgba(37,99,235,0.12)";
                el.style.borderColor = "#bfdbfe";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.boxShadow = "none";
                el.style.borderColor = "#e5e7eb";
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 duration-300"
                style={{ background: service.color }}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {service.desc}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold"
                  style={{ color: service.textColor }}
                >
                  Starting from {service.from}
                </span>
                <span
                  className="flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: "#2563eb" }}
                >
                  Book Now
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
              boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
            }}
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
