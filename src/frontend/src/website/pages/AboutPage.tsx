import { Link } from "@tanstack/react-router";
import { Award, CheckCircle, MapPin, Target, Users } from "lucide-react";

export function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
            Our Story
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-6">
            About Indu Homes &amp; Estates Services
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Chikmagalur's most trusted home and estate service provider, built
            on integrity, quality, and community.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Founder bio */}
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#2563eb" }}
              >
                Leadership
              </p>
              <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-2">
                Mounith H C
              </h2>
              <p className="text-blue-600 font-semibold mb-6">
                Founder &amp; Proprietor
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                With over a decade of hands-on experience in property services
                across Chikmagalur and the Malnad belt, Mounith H C established
                Indu Homes &amp; Estates Services with a clear vision: to
                professionalize the home service industry in Tier-2 Karnataka.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Growing up in Chikmagalur, he understood the gap between
                high-demand services and reliable, organized delivery. He
                assembled a team of vetted professionals and created a system
                that prioritizes transparency, quality, and accountability in
                every service delivered.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, Indu Homes &amp; Estates Services is the region's
                preferred choice for home services, estate management, and
                property maintenance — with plans to expand to Hassan and
                Mudigere.
              </p>
              <div
                className="px-4 py-3 rounded-xl text-sm italic text-blue-800 font-medium"
                style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
              >
                "From Homes to Estates – We Handle It All."
              </div>
            </div>

            {/* Stats panel */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Happy Customers", icon: Users },
                { value: "10+", label: "Years Experience", icon: Award },
                { value: "7", label: "Service Categories", icon: CheckCircle },
                { value: "3", label: "Service Regions", icon: MapPin },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-6 bg-white"
                    style={{
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: "#dbeafe" }}
                    >
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-display text-3xl font-extrabold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="rounded-3xl p-8"
              style={{
                background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Our Mission
              </h3>
              <p className="text-blue-200 leading-relaxed">
                To deliver reliable, professional, and affordable home and
                estate services that improve the quality of life in Chikmagalur
                and the Malnad region — one property at a time.
              </p>
            </div>
            <div
              className="rounded-3xl p-8"
              style={{
                background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Our Vision
              </h3>
              <p className="text-gray-400 leading-relaxed">
                To become the most trusted and comprehensive property services
                platform in Karnataka's Malnad region — expanding to Hassan,
                Mudigere and beyond while maintaining the personal service
                standard we started with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#2563eb" }}
          >
            Coverage
          </p>
          <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-6">
            Where We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "Chikmagalur City",
              "Mudigere",
              "Birur",
              "Hassan District",
              "Sringeri",
              "Koppa",
              "Aldur",
              "Tarikere",
            ].map((area) => (
              <span
                key={area}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                }}
              >
                <MapPin className="w-3.5 h-3.5" />
                {area}
              </span>
            ))}
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-all hover:scale-105"
            style={{ background: "#2563eb" }}
          >
            Contact Us for Your Area
          </Link>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-4">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Integrity",
                desc: "Honest pricing, transparent work, no hidden charges. What we quote is what you pay.",
                emoji: "🤝",
              },
              {
                title: "Quality",
                desc: "We use the best materials and techniques to ensure lasting results in every project.",
                emoji: "⭐",
              },
              {
                title: "Reliability",
                desc: "Show up on time, every time. We keep our promises and deliver on commitments.",
                emoji: "⏰",
              },
              {
                title: "Care",
                desc: "We treat every property as if it were our own, with attention to detail.",
                emoji: "💙",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-2xl p-6 bg-white"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <span className="text-3xl mb-4 block">{value.emoji}</span>
                <h3 className="font-display font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
