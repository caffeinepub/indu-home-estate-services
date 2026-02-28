import { useGetServices } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SubService {
  name: string;
  price: string;
  description: string;
  image: string;
}

interface Service {
  name: string;
  icon: string;
  category: string;
  colorBg: string;
  image: string;
  subServices: SubService[];
  startingFrom: string;
  description: string;
}

const STATIC_SERVICES: Service[] = [
  {
    name: "Plumbing",
    icon: "🔧",
    category: "Home Repair",
    colorBg: "#dbeafe",
    image: "/assets/generated/service-plumbing.dim_600x400.jpg",
    subServices: [
      {
        name: "Leak Fix",
        price: "₹499",
        description:
          "Quick detection and repair of leaking pipes, taps, and joints to prevent water damage.",
        image: "/assets/generated/sub-plumbing-leak.dim_400x280.jpg",
      },
      {
        name: "Pipe Installation",
        price: "₹999",
        description:
          "Professional installation of new water supply or drainage pipes using quality fittings.",
        image: "/assets/generated/service-plumbing.dim_600x400.jpg",
      },
      {
        name: "Bathroom Fitting",
        price: "₹1,499",
        description:
          "Complete installation of bathroom fixtures including shower, basin, and toilet fittings.",
        image: "/assets/generated/sub-plumbing-bathroom.dim_400x280.jpg",
      },
      {
        name: "Tap Replacement",
        price: "₹499",
        description:
          "Replacement of worn or damaged taps with new ISI-marked fixtures for smooth water flow.",
        image: "/assets/generated/sub-plumbing-leak.dim_400x280.jpg",
      },
      {
        name: "Drain Block Removal",
        price: "₹1,200",
        description:
          "Clearing of blocked drains using high-pressure jetting and professional tools.",
        image: "/assets/generated/service-plumbing.dim_600x400.jpg",
      },
      {
        name: "Water Tank Cleaning",
        price: "₹999",
        description:
          "Thorough cleaning and disinfection of overhead and underground water tanks.",
        image: "/assets/generated/sub-plumbing-bathroom.dim_400x280.jpg",
      },
      {
        name: "Motor Installation",
        price: "₹1,500",
        description:
          "Installation and wiring of water pumps and borewell motors with pressure testing.",
        image: "/assets/generated/service-plumbing.dim_600x400.jpg",
      },
    ],
    startingFrom: "₹499",
    description:
      "Expert plumbing solutions from quick leak fixes to complete bathroom fittings. Our certified plumbers handle all types of plumbing work with quality materials and guaranteed results.",
  },
  {
    name: "Electrical",
    icon: "⚡",
    category: "Home Repair",
    colorBg: "#fef9c3",
    image: "/assets/generated/service-electrical.dim_600x400.jpg",
    subServices: [
      {
        name: "Switch Board Repair",
        price: "₹299",
        description:
          "Diagnosis and repair of faulty switch boards, loose connections, and tripped circuits.",
        image: "/assets/generated/sub-electrical-fan.dim_400x280.jpg",
      },
      {
        name: "Fan Installation",
        price: "₹399",
        description:
          "Professional ceiling or wall fan installation with safe wiring and canopy fitting.",
        image: "/assets/generated/sub-electrical-fan.dim_400x280.jpg",
      },
      {
        name: "Light Installation",
        price: "₹299",
        description:
          "Installation of LED lights, downlights, and fixtures with proper earthing.",
        image: "/assets/generated/sub-electrical-fan.dim_400x280.jpg",
      },
      {
        name: "Wiring Work",
        price: "₹2,000+",
        description:
          "Full or partial house rewiring using ISI-approved copper wires and conduit pipes.",
        image: "/assets/generated/service-electrical.dim_600x400.jpg",
      },
      {
        name: "Inverter Setup",
        price: "₹1,500",
        description:
          "Installation and configuration of home inverter and battery system for power backup.",
        image: "/assets/generated/service-electrical.dim_600x400.jpg",
      },
      {
        name: "MCB Replacement",
        price: "₹599",
        description:
          "Replacement of faulty MCBs and RCCB units to ensure safe circuit protection.",
        image: "/assets/generated/sub-electrical-fan.dim_400x280.jpg",
      },
      {
        name: "Power Failure Fix",
        price: "₹799",
        description:
          "Diagnosis and repair of power outages, short circuits, and earthing faults.",
        image: "/assets/generated/service-electrical.dim_600x400.jpg",
      },
    ],
    startingFrom: "₹299",
    description:
      "Certified electricians for all electrical needs — from simple switch repairs to complete wiring. We ensure safety compliance and use ISI-marked materials in all installations.",
  },
  {
    name: "Deep Cleaning",
    icon: "🧹",
    category: "Cleaning",
    colorBg: "#dcfce7",
    image: "/assets/generated/service-cleaning.dim_600x400.jpg",
    subServices: [
      {
        name: "Full Home Deep Cleaning",
        price: "₹3,500+",
        description:
          "Comprehensive top-to-bottom cleaning of every room with professional-grade equipment.",
        image: "/assets/generated/sub-cleaning-kitchen.dim_400x280.jpg",
      },
      {
        name: "Kitchen Deep Cleaning",
        price: "₹1,500",
        description:
          "Intense degreasing and sanitisation of kitchen surfaces, appliances, and exhaust.",
        image: "/assets/generated/sub-cleaning-kitchen.dim_400x280.jpg",
      },
      {
        name: "Bathroom Deep Cleaning",
        price: "₹999",
        description:
          "Thorough scrubbing of tiles, fixtures, and drain cleaning with anti-bacterial agents.",
        image: "/assets/generated/service-cleaning.dim_600x400.jpg",
      },
      {
        name: "Sofa Cleaning",
        price: "₹1,200",
        description:
          "Steam and dry cleaning of sofas and upholstery to remove stains, dust, and allergens.",
        image: "/assets/generated/service-cleaning.dim_600x400.jpg",
      },
      {
        name: "Mattress Cleaning",
        price: "₹999",
        description:
          "Deep vacuum and steam treatment of mattresses to eliminate dust mites and bacteria.",
        image: "/assets/generated/sub-cleaning-kitchen.dim_400x280.jpg",
      },
      {
        name: "Move-in Cleaning",
        price: "₹4,000+",
        description:
          "Complete sanitisation and cleaning of a new home before moving in, including storage areas.",
        image: "/assets/generated/service-cleaning.dim_600x400.jpg",
      },
      {
        name: "Office Cleaning",
        price: "₹6/sqft",
        description:
          "Regular or one-time office cleaning including workstations, washrooms, and common areas.",
        image: "/assets/generated/sub-cleaning-kitchen.dim_400x280.jpg",
      },
    ],
    startingFrom: "₹999",
    description:
      "Professional deep cleaning for homes, apartments, villas and commercial spaces. We use hospital-grade cleaning agents and professional equipment for spotless results.",
  },
  {
    name: "Painting",
    icon: "🎨",
    category: "Renovation",
    colorBg: "#fce7f3",
    image: "/assets/generated/service-painting.dim_600x400.jpg",
    subServices: [
      {
        name: "Interior Painting",
        price: "₹18/sqft",
        description:
          "Premium interior wall painting with smooth finish, 2 coats of primer and top coat.",
        image: "/assets/generated/sub-painting-interior.dim_400x280.jpg",
      },
      {
        name: "Exterior Painting",
        price: "₹15/sqft",
        description:
          "Weather-resistant exterior painting protecting walls from rain, sun, and humidity.",
        image: "/assets/generated/service-painting.dim_600x400.jpg",
      },
      {
        name: "Texture Painting",
        price: "₹45/sqft",
        description:
          "Decorative texture finishes including sand, sponge, and metallic effects for accent walls.",
        image: "/assets/generated/sub-painting-interior.dim_400x280.jpg",
      },
      {
        name: "Wall Putty Work",
        price: "₹12/sqft",
        description:
          "Smooth wall putty application to fill cracks and create a perfectly even surface.",
        image: "/assets/generated/service-painting.dim_600x400.jpg",
      },
      {
        name: "Waterproof Paint",
        price: "₹20/sqft",
        description:
          "Application of waterproof coating for bathrooms, basements, and damp-prone areas.",
        image: "/assets/generated/sub-painting-interior.dim_400x280.jpg",
      },
      {
        name: "Touch-up Painting",
        price: "₹999+",
        description:
          "Spot repair and colour matching for small damaged or faded areas on existing painted walls.",
        image: "/assets/generated/service-painting.dim_600x400.jpg",
      },
    ],
    startingFrom: "₹12/sqft",
    description:
      "Transform your space with quality painting services. We use premium paints from leading brands, and our painters are skilled in interior, exterior, and decorative finishes.",
  },
  {
    name: "AC Service",
    icon: "❄️",
    category: "Appliances",
    colorBg: "#e0f2fe",
    image: "/assets/generated/service-ac.dim_600x400.jpg",
    subServices: [
      {
        name: "AC General Service",
        price: "₹999",
        description:
          "Complete AC servicing including coil cleaning, filter wash, and performance check.",
        image: "/assets/generated/sub-ac-service.dim_400x280.jpg",
      },
      {
        name: "AC Installation",
        price: "₹1,800",
        description:
          "Professional split or window AC installation with bracket fitting and copper piping.",
        image: "/assets/generated/service-ac.dim_600x400.jpg",
      },
      {
        name: "AC Gas Filling",
        price: "₹2,500",
        description:
          "Recharging of refrigerant gas (R22 or R32) to restore cooling efficiency.",
        image: "/assets/generated/sub-ac-service.dim_400x280.jpg",
      },
      {
        name: "AC Deep Cleaning",
        price: "₹1,500",
        description:
          "Jet cleaning of internal coils, blower, and drain tray to remove mould and dust buildup.",
        image: "/assets/generated/sub-ac-service.dim_400x280.jpg",
      },
      {
        name: "AC Repair",
        price: "₹1,200+",
        description:
          "Diagnosis and repair of all AC issues including PCB faults, compressor, and motor failures.",
        image: "/assets/generated/service-ac.dim_600x400.jpg",
      },
      {
        name: "Annual AMC Contract",
        price: "₹2,999/yr",
        description:
          "Annual maintenance contract covering 2 services, priority support, and discounted repairs.",
        image: "/assets/generated/sub-ac-service.dim_400x280.jpg",
      },
    ],
    startingFrom: "₹999",
    description:
      "Complete AC solutions — installation, servicing, repairs, and maintenance. We work with all major brands including Daikin, Voltas, Blue Star, Samsung, and LG.",
  },
  {
    name: "Pest Control",
    icon: "🐛",
    category: "Protection",
    colorBg: "#fee2e2",
    image: "/assets/generated/service-pest-control.dim_600x400.jpg",
    subServices: [
      {
        name: "Termite Control",
        price: "₹8,000+",
        description:
          "Government-approved anti-termite treatment using drilling and chemical injection method.",
        image: "/assets/generated/sub-pest-termite.dim_400x280.jpg",
      },
      {
        name: "Cockroach Control",
        price: "₹999",
        description:
          "Gel bait treatment targeting cockroach colonies in kitchen, drains, and electrical points.",
        image: "/assets/generated/service-pest-control.dim_600x400.jpg",
      },
      {
        name: "Bed Bug Treatment",
        price: "₹1,500",
        description:
          "Heat and chemical treatment for complete elimination of bed bugs and their eggs.",
        image: "/assets/generated/sub-pest-termite.dim_400x280.jpg",
      },
      {
        name: "Mosquito Fogging",
        price: "₹1,200",
        description:
          "Thermal fogging of outdoor areas and water bodies to eliminate mosquito breeding zones.",
        image: "/assets/generated/service-pest-control.dim_600x400.jpg",
      },
      {
        name: "Rodent Control",
        price: "₹2,500",
        description:
          "Placement of rodent bait stations and traps to control rats and mice infestations.",
        image: "/assets/generated/sub-pest-termite.dim_400x280.jpg",
      },
      {
        name: "General Pest Treatment",
        price: "₹1,200",
        description:
          "Comprehensive spray treatment covering ants, spiders, silverfish, and common crawling pests.",
        image: "/assets/generated/service-pest-control.dim_600x400.jpg",
      },
    ],
    startingFrom: "₹999",
    description:
      "Safe, effective pest management for homes, offices, and commercial spaces. We use government-approved chemicals and eco-friendly treatments for lasting protection.",
  },
  {
    name: "Estate Maintenance",
    icon: "🌿",
    category: "Estate",
    colorBg: "#d1fae5",
    image: "/assets/generated/service-estate.dim_600x400.jpg",
    subServices: [
      {
        name: "Garden Maintenance",
        price: "₹2,000+",
        description:
          "Regular pruning, weeding, watering, and upkeep of garden and landscape areas.",
        image: "/assets/generated/sub-estate-garden.dim_400x280.jpg",
      },
      {
        name: "Grass Cutting",
        price: "₹3,000/acre",
        description:
          "Mechanical grass cutting and clearing of overgrown vegetation on farms and estates.",
        image: "/assets/generated/sub-estate-garden.dim_400x280.jpg",
      },
      {
        name: "Borewell Service",
        price: "₹2,500",
        description:
          "Maintenance, cleaning, and motor servicing of borewells for reliable water supply.",
        image: "/assets/generated/service-estate.dim_600x400.jpg",
      },
      {
        name: "Farm Maintenance",
        price: "Site estimate",
        description:
          "Comprehensive farm upkeep including coffee plantation care, irrigation, and drainage.",
        image: "/assets/generated/sub-estate-garden.dim_400x280.jpg",
      },
      {
        name: "Estate AMC",
        price: "₹15,000/yr",
        description:
          "Annual estate management contract covering routine maintenance, supervision, and reporting.",
        image: "/assets/generated/service-estate.dim_600x400.jpg",
      },
      {
        name: "Full Estate Management",
        price: "Site estimate",
        description:
          "End-to-end management of properties including security, staff, maintenance, and utilities.",
        image: "/assets/generated/sub-estate-garden.dim_400x280.jpg",
      },
    ],
    startingFrom: "₹2,000",
    description:
      "Comprehensive estate and property management services. Whether you own a small garden or a large coffee estate in the Malnad region, we handle it all professionally.",
  },
];

export function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const { data: backendServices } = useGetServices();

  const services = STATIC_SERVICES;

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
            Our Services
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Professional Services for Every Need
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            From routine repairs to complete estate management — trusted by 500+
            customers across Chikmagalur.
          </p>
        </div>
      </section>

      {/* Backend service count */}
      {backendServices && backendServices.length > 0 && (
        <div
          className="py-3"
          style={{ background: "#eff6ff", borderBottom: "1px solid #bfdbfe" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-blue-700 text-center font-medium">
              {backendServices.length} service categories available in our
              booking system
            </p>
          </div>
        </div>
      )}

      {/* Services list */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {services.map((service, idx) => {
              const isOpen = expandedService === service.name;
              return (
                <div
                  key={service.name}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    border: isOpen ? "1px solid #bfdbfe" : "1px solid #e5e7eb",
                    boxShadow: isOpen
                      ? "0 8px 30px rgba(37,99,235,0.1)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Service header */}
                  <div
                    className="flex items-center gap-4 p-6 cursor-pointer"
                    style={{ animationDelay: `${idx * 60}ms` }}
                    onClick={() =>
                      setExpandedService(isOpen ? null : service.name)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setExpandedService(isOpen ? null : service.name)
                    }
                  >
                    {/* Category image thumbnail */}
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden shrink-0"
                      style={{ border: "2px solid #e5e7eb" }}
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl">{service.icon}</span>
                        <h3 className="font-display text-lg font-bold text-gray-900">
                          {service.name}
                        </h3>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: service.colorBg,
                            color: "#374151",
                          }}
                        >
                          {service.category}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Price & toggle */}
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-500 mb-1">From</p>
                      <p className="font-display font-bold text-blue-600 text-lg">
                        {service.startingFrom}
                      </p>
                    </div>

                    <ChevronDown
                      className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ml-2"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}
                    />
                  </div>

                  {/* Sub-services as image cards */}
                  {isOpen && (
                    <div
                      className="px-6 pb-6"
                      style={{ borderTop: "1px solid #f1f5f9" }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                        {service.subServices.map((sub) => (
                          <div
                            key={sub.name}
                            className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
                            style={{
                              border: "1px solid #e5e7eb",
                              background: "#ffffff",
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "#bfdbfe";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "#e5e7eb";
                            }}
                          >
                            {/* Sub-service image */}
                            <div className="relative aspect-video overflow-hidden">
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                              {/* Price badge overlay */}
                              <div
                                className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold text-white"
                                style={{
                                  background: "rgba(37,99,235,0.9)",
                                  backdropFilter: "blur(4px)",
                                }}
                              >
                                {sub.price}
                              </div>
                            </div>

                            {/* Sub-service info */}
                            <div className="p-3">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                {sub.name}
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                {sub.description}
                              </p>
                              <Link
                                to="/contact"
                                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                                style={{ background: "#2563eb" }}
                              >
                                Book Now
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTAs */}
                      <div
                        className="flex flex-wrap gap-3 mt-5 pt-4"
                        style={{ borderTop: "1px solid #f1f5f9" }}
                      >
                        <Link
                          to="/contact"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                          style={{ background: "#2563eb" }}
                        >
                          Book Now
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to="/contact"
                          search={{ type: "quotation" } as never}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-700"
                          style={{ border: "2px solid #2563eb" }}
                        >
                          Get Quote
                        </Link>
                        <Link
                          to="/inspections"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600"
                          style={{ border: "2px solid #e5e7eb" }}
                        >
                          Free Inspection
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16"
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white mb-4">
            Don't See What You Need?
          </h2>
          <p className="text-blue-200 mb-8">
            Contact us for custom requirements. We handle all types of home and
            estate services across Chikmagalur.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl text-blue-800 font-bold bg-white hover:scale-105 transition-transform"
            >
              Contact Us
            </Link>
            <Link
              to="/inspections"
              className="px-8 py-4 rounded-xl text-white font-bold hover:scale-105 transition-transform"
              style={{ border: "2px solid rgba(255,255,255,0.4)" }}
            >
              Free Inspection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
