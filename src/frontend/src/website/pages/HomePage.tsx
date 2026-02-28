import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FAQPreview } from "@/website/components/FAQPreview";
import { HeroSection } from "@/website/components/HeroSection";
import { ServicesPreview } from "@/website/components/ServicesPreview";
import { TestimonialsSlider } from "@/website/components/TestimonialsSlider";
import { Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle,
  Clock,
  Search,
  Shield,
  Star,
  Zap,
} from "lucide-react";

function AboutSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#2563eb" }}
            >
              About Us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
              Chikmagalur's Premier Home Service Company
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded by <strong className="text-gray-800">Mounith H C</strong>,
              Indu Homes &amp; Estates Services is built on the philosophy that
              every home and estate deserves professional care. With over a
              decade of experience in the Malnad region, we understand the
              unique needs of homes and estates in Chikmagalur.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              From routine plumbing repairs to full estate management, we bring
              trained professionals who respect your property and deliver
              lasting results. Our service covers Chikmagalur, Mudigere, Hassan,
              and surrounding areas.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Licensed & Insured Technicians" },
                { label: "Transparent Pricing" },
                { label: "On-Time Service Guarantee" },
                { label: "Post-Service Warranty" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "#2563eb" }}
            >
              Learn More About Us
            </Link>
          </div>

          {/* Right: Image */}
          <div
            className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
          >
            <div className="relative">
              <div
                className="rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 25px 60px rgba(37,99,235,0.15)" }}
              >
                <img
                  src="/assets/generated/property-estate-1.dim_800x600.jpg"
                  alt="Chikmagalur Estate"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-6 -left-6 rounded-2xl p-4 bg-white"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "#dbeafe" }}
                  >
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg leading-none">
                      4.9/5
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Customer Rating
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="absolute -top-4 -right-4 rounded-2xl p-3 bg-white"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold text-gray-800">
                    10+ Years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const { ref, isVisible } = useScrollReveal();

  const reasons = [
    {
      icon: Shield,
      title: "Licensed Professionals",
      desc: "All technicians are background-verified, trained, and carry valid certifications.",
      color: "#dbeafe",
      iconColor: "#2563eb",
    },
    {
      icon: Clock,
      title: "On-Time Service",
      desc: "We respect your time. Our technicians arrive on schedule and complete work efficiently.",
      color: "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      icon: Zap,
      title: "Quick Response",
      desc: "Same-day service for most requests. Emergency service available for urgent needs.",
      color: "#fef9c3",
      iconColor: "#ca8a04",
    },
    {
      icon: Award,
      title: "Service Warranty",
      desc: "All services come with post-completion warranty. Not satisfied? We'll fix it free.",
      color: "#fce7f3",
      iconColor: "#db2777",
    },
  ];

  return (
    <section className="py-20" style={{ background: "#f8faff" }}>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#2563eb" }}
          >
            Why Us
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className={`rounded-2xl p-6 bg-white transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{
                  border: "1px solid #e5e7eb",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: r.color }}
                >
                  <Icon className="w-6 h-6" style={{ color: r.iconColor }} />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function InspectionBanner() {
  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6"
          style={{ background: "rgba(255,255,255,0.15)", color: "#bfdbfe" }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Limited Time Offer
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Get a Free Site Inspection
        </h2>
        <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
          Not sure what service you need? Our expert will visit your property,
          assess all requirements, and give you a free detailed report — no
          obligation required.
        </p>
        <Link
          to="/inspections"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-blue-800 font-bold text-base bg-white transition-all hover:scale-105"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
        >
          <Search className="w-5 h-5" />
          Request Free Inspection
        </Link>
      </div>
    </section>
  );
}

function QuickContactStrip() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-500 mb-8">
          Contact us today for a consultation or book a service instantly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="px-8 py-4 rounded-xl text-white font-bold transition-all hover:scale-105"
            style={{ background: "#2563eb" }}
          >
            Contact Us Now
          </Link>
          <a
            href="tel:+919876543210"
            className="px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 text-blue-700"
            style={{ border: "2px solid #2563eb" }}
          >
            Call: +91 98765 43210
          </a>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesPreview />
      <WhyChooseUs />
      <InspectionBanner />
      <TestimonialsSlider />
      <FAQPreview />
      <QuickContactStrip />
    </div>
  );
}
