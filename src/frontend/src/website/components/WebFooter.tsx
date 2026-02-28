import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

export function WebFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <title>Home</title>
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-base font-display">
                  Indu Homes
                </p>
                <p className="text-blue-400 text-[10px] font-medium tracking-widest">
                  & ESTATES SERVICES
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Chikmagalur's most trusted home and estate services provider.
              Professional, reliable, and affordable.
            </p>
            <p className="text-blue-400 text-xs font-medium italic">
              "From Homes to Estates – We Handle It All."
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-5">
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      `${color}33`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Services", to: "/services" },
                { label: "Properties", to: "/properties" },
                { label: "Free Inspection", to: "/inspections" },
                { label: "Testimonials", to: "/testimonials" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 text-sm hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 inline-block shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                "Plumbing",
                "Electrical Work",
                "Deep Cleaning",
                "Painting",
                "AC Service",
                "Pest Control",
                "Estate Maintenance",
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-gray-400 text-sm hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 inline-block shrink-0" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(37,99,235,0.2)" }}
                >
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Main Road, Chikmagalur
                  </p>
                  <p className="text-gray-500 text-xs">Karnataka - 577101</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(37,99,235,0.2)" }}
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <a
                    href="tel:+919876543210"
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                  >
                    +91 98765 43210
                  </a>
                  <p className="text-gray-500 text-xs">Mon–Sat, 9AM–6PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(37,99,235,0.2)" }}
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <a
                  href="mailto:induhomeservices@gmail.com"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  induhomeservices@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p>
            © {year} Indu Homes &amp; Estates Services. All rights reserved.
          </p>
          <p className="text-gray-600">Chikmagalur, Karnataka, India</p>
        </div>
      </div>
    </footer>
  );
}
