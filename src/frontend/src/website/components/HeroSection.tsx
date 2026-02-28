import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, FileText, Search } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0f1e 0%, #0f172a 100%)",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-home.dim_1920x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,15,30,0.9) 0%, rgba(15,23,55,0.75) 50%, rgba(10,15,30,0.88) 100%)",
        }}
      />

      {/* Decorative gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 z-0 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1d4ed8, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15 z-0 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Tagline badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 hero-fade-in"
          style={{
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.3)",
            color: "#93c5fd",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#3b82f6" }}
          />
          Chikmagalur's #1 Trusted Service Provider
        </div>

        <h1
          className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 hero-fade-in-delay-1"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        >
          Trusted Home &
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Estate Services
          </span>
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed hero-fade-in-delay-2">
          From Homes to Estates – We Handle It All. Professional, reliable, and
          affordable services across Chikmagalur and the Malnad region.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 hero-fade-in-delay-3">
          <Link
            to="/contact"
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
              boxShadow: "0 4px 20px rgba(37,99,235,0.5)",
            }}
          >
            <Calendar className="w-4 h-4" />
            Book a Service
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/inspections"
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Search className="w-4 h-4" />
            Free Inspection
          </Link>
          <Link
            to="/contact"
            search={{ type: "quotation" } as never}
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <FileText className="w-4 h-4" />
            Get Quotation
          </Link>
        </div>

        {/* Stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto hero-fade-in-delay-4">
          {[
            { target: 500, suffix: "+", label: "Happy Customers" },
            { target: 7, suffix: "", label: "Service Categories" },
            { target: 10, suffix: "+", label: "Years Experience" },
            { target: 100, suffix: "%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl py-5 px-4 text-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                className="font-display text-3xl font-extrabold text-white mb-1"
                style={{
                  background: "linear-gradient(135deg, #ffffff, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{ border: "2px solid rgba(255,255,255,0.2)" }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-white opacity-70"
            style={{ animation: "scrollDown 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
