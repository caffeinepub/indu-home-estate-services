import { useGetServices } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Grid3X3,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

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

const CATEGORIES = [
  "All",
  "Home Repair",
  "Cleaning",
  "Renovation",
  "Appliances",
  "Protection",
  "Estate",
];

const STATS = [
  { icon: Grid3X3, value: "7", label: "Service Categories" },
  { icon: Star, value: "50+", label: "Sub-services" },
  { icon: Users, value: "500+", label: "Happy Customers" },
  { icon: MapPin, value: "Chikmagalur", label: "Based & Operating" },
];

export function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: backendServices } = useGetServices();

  const filteredServices = useMemo(() => {
    let list = STATIC_SERVICES;
    if (activeCategory !== "All") {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.subServices.some((sub) => sub.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

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

      {/* Stats Bar */}
      <section
        style={{
          background:
            "linear-gradient(90deg, #1d4ed8 0%, #2563eb 50%, #1d4ed8 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-blue-500">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-5 px-4"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-white font-extrabold text-lg leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-blue-200 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Backend service count banner */}
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

      {/* Search + Filter */}
      <section
        className="py-8 bg-white"
        style={{ borderBottom: "1px solid #e5e7eb" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              data-ocid="services.search_input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, e.g. AC repair, deep cleaning…"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1.5px solid #e5e7eb",
                background: "#f9fafb",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "#f9fafb";
              }}
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid={`services.${cat.toLowerCase().replace(/\s+/g, "-")}.tab`}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedService(null);
                }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: activeCategory === cat ? "#2563eb" : "#f1f5f9",
                  color: activeCategory === cat ? "#ffffff" : "#374151",
                  border:
                    activeCategory === cat
                      ? "1.5px solid #2563eb"
                      : "1.5px solid transparent",
                  boxShadow:
                    activeCategory === cat
                      ? "0 2px 8px rgba(37,99,235,0.25)"
                      : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 && (
            <div data-ocid="services.empty_state" className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                No services found
              </h3>
              <p className="text-gray-500 text-sm">
                Try a different search term or category.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {filteredServices.map((service, idx) => {
              const isOpen = expandedService === service.name;
              return (
                <div
                  key={service.name}
                  data-ocid={`services.item.${idx + 1}`}
                  className="rounded-2xl overflow-hidden transition-all duration-300 bg-white"
                  style={{
                    border: isOpen
                      ? "1.5px solid #bfdbfe"
                      : "1.5px solid #e5e7eb",
                    boxShadow: isOpen
                      ? "0 8px 32px rgba(37,99,235,0.12)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Service header — banner image with gradient overlay */}
                  <button
                    type="button"
                    className="relative cursor-pointer overflow-hidden w-full"
                    style={{ height: "180px" }}
                    onClick={() =>
                      setExpandedService(isOpen ? null : service.name)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setExpandedService(isOpen ? null : service.name)
                    }
                  >
                    {/* Banner image */}
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{ transform: isOpen ? "scale(1.03)" : "scale(1)" }}
                    />

                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.55) 60%, rgba(15,23,42,0.25) 100%)",
                      }}
                    />

                    {/* Content on top of overlay */}
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      {/* Left: icon, name, category */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl drop-shadow">
                            {service.icon}
                          </span>
                          <div>
                            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow">
                              {service.name}
                            </h3>
                            <span
                              className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                              style={{
                                background: "rgba(255,255,255,0.18)",
                                color: "#e0f2fe",
                                backdropFilter: "blur(6px)",
                                border: "1px solid rgba(255,255,255,0.2)",
                              }}
                            >
                              {service.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs max-w-xs line-clamp-2 hidden sm:block">
                          {service.description}
                        </p>
                      </div>

                      {/* Right: starting price + chevron */}
                      <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                        {/* Starting from badge */}
                        <div
                          className="px-3 py-1.5 rounded-xl text-center"
                          style={{
                            background: "rgba(37,99,235,0.85)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(96,165,250,0.4)",
                          }}
                        >
                          <p className="text-blue-200 text-xs leading-none mb-0.5">
                            Starting from
                          </p>
                          <p className="text-white font-extrabold text-base leading-none">
                            {service.startingFrom}
                          </p>
                        </div>

                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
                          style={{
                            background: "rgba(255,255,255,0.15)",
                            transform: isOpen ? "rotate(180deg)" : "none",
                          }}
                        >
                          <ChevronDown className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Sub-services as image cards */}
                  {isOpen && (
                    <div
                      className="px-5 pb-6"
                      style={{ borderTop: "1px solid #f1f5f9" }}
                    >
                      {/* Description on mobile (not shown in banner) */}
                      <p className="text-gray-500 text-sm mt-4 mb-1 sm:hidden">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                        {service.subServices.map((sub, subIdx) => (
                          <div
                            key={sub.name}
                            data-ocid={`services.sub.item.${subIdx + 1}`}
                            className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md bg-white"
                            style={{ border: "1px solid #e5e7eb" }}
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
                            {/* Sub-service image 16:9 */}
                            <div className="relative aspect-video overflow-hidden">
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                              {/* Price badge overlay top-right */}
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
                                to="/book-now"
                                data-ocid={`services.sub.book_button.${subIdx + 1}`}
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
                          to="/book-now"
                          data-ocid="services.book.primary_button"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                          style={{ background: "#2563eb" }}
                        >
                          Book Now
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to="/contact"
                          search={{ type: "quotation" } as never}
                          data-ocid="services.quote.secondary_button"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-700"
                          style={{ border: "2px solid #2563eb" }}
                        >
                          Get Quote
                        </Link>
                        <Link
                          to="/inspections"
                          data-ocid="services.inspection.secondary_button"
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
              data-ocid="services.contact.primary_button"
              className="px-8 py-4 rounded-xl text-blue-800 font-bold bg-white hover:scale-105 transition-transform"
            >
              Contact Us
            </Link>
            <Link
              to="/inspections"
              data-ocid="services.inspection_cta.secondary_button"
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
