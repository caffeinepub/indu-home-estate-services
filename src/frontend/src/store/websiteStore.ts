import type {
  ContactMessage,
  Inspection,
  Property,
  Quotation,
  Testimonial,
} from "@/types/website";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedProperties: Property[] = [
  {
    id: "prop-1",
    title: "Green Valley Villa",
    location: "Chikmagalur Main Road",
    price: "₹85 Lakhs",
    status: "available",
    description:
      "Stunning 4-bedroom villa nestled in the heart of Chikmagalur with panoramic mountain views, landscaped garden, and modern amenities. Perfect for a premium family residence.",
    imageUrl: "/assets/generated/property-villa-1.dim_800x600.jpg",
    propertyType: "Villa",
    bedrooms: 4,
    area: "2400 sqft",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "prop-2",
    title: "Hilltop Apartment",
    location: "Near Bus Stand, Chikmagalur",
    price: "₹42 Lakhs",
    status: "available",
    description:
      "Modern 2-bedroom apartment in prime location, close to all amenities. Features contemporary interiors, covered parking, and a community club house.",
    imageUrl: "/assets/generated/property-apartment-1.dim_800x600.jpg",
    propertyType: "Apartment",
    bedrooms: 2,
    area: "1100 sqft",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "prop-3",
    title: "Coffee Estate Land",
    location: "Mudigere Road, Chikmagalur",
    price: "₹1.2 Cr",
    status: "available",
    description:
      "Premium coffee plantation estate with rich fertile soil, existing coffee plants, water source, and a small farmhouse. Ideal investment in the Malnad region.",
    imageUrl: "/assets/generated/property-estate-1.dim_800x600.jpg",
    propertyType: "Estate",
    bedrooms: 0,
    area: "5 acres",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "prop-4",
    title: "Urban Studio",
    location: "Chikmagalur Town Center",
    price: "₹28 Lakhs",
    status: "available",
    description:
      "Compact studio apartment in the heart of Chikmagalur town. Ideal for working professionals or as a rental investment. Modern finishes and all utilities ready.",
    imageUrl: "/assets/generated/property-apartment-1.dim_800x600.jpg",
    propertyType: "Apartment",
    bedrooms: 1,
    area: "650 sqft",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const seedTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Rajesh Kumar",
    role: "Homeowner, Chikmagalur",
    message:
      "Excellent service! The deep cleaning team was professional and thorough. My house looks brand new. Highly recommend Indu Homes & Estates Services.",
    rating: 5,
    approved: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-2",
    name: "Priya Sharma",
    role: "Property Owner",
    message:
      "Got my electrical work done perfectly. Fair pricing and on-time delivery. The technicians were skilled and left the place clean after the job.",
    rating: 5,
    approved: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-3",
    name: "Mohan Gowda",
    role: "Coffee Estate Owner",
    message:
      "They handle my entire estate maintenance. Best estate services in the Malnad region. Reliable, professional, and very reasonable pricing.",
    rating: 5,
    approved: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-4",
    name: "Anitha Rao",
    role: "Villa Owner, Chikmagalur",
    message:
      "Booked AC service and painting together. Both teams were skilled. Great experience overall. Will definitely use their services again.",
    rating: 4,
    approved: true,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-5",
    name: "Suresh Patil",
    role: "Apartment Resident",
    message:
      "Pest control treatment was very effective. No more issues after their treatment. Good team, professional approach and affordable rates.",
    rating: 5,
    approved: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface WebsiteStore {
  inspections: Inspection[];
  quotations: Quotation[];
  properties: Property[];
  testimonials: Testimonial[];
  contactMessages: ContactMessage[];
}

type Listener = () => void;

// ─── Module-level reactive store ─────────────────────────────────────────────

const store: WebsiteStore = {
  inspections: [],
  quotations: [],
  properties: [...seedProperties],
  testimonials: [...seedTestimonials],
  contactMessages: [],
};

const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): WebsiteStore {
  return store;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export function addInspection(
  data: Omit<Inspection, "id" | "status" | "createdAt">,
): Inspection {
  const inspection: Inspection = {
    ...data,
    id: `insp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.inspections = [inspection, ...store.inspections];
  notify();
  return inspection;
}

export function updateInspectionStatus(
  id: string,
  status: Inspection["status"],
) {
  store.inspections = store.inspections.map((i) =>
    i.id === id ? { ...i, status } : i,
  );
  notify();
}

export function addQuotation(
  data: Omit<Quotation, "id" | "status" | "createdAt">,
): Quotation {
  const quotation: Quotation = {
    ...data,
    id: `quot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.quotations = [quotation, ...store.quotations];
  notify();
  return quotation;
}

export function updateQuotationStatus(id: string, status: Quotation["status"]) {
  store.quotations = store.quotations.map((q) =>
    q.id === id ? { ...q, status } : q,
  );
  notify();
}

export function addProperty(
  data: Omit<Property, "id" | "createdAt">,
): Property {
  const property: Property = {
    ...data,
    id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  store.properties = [property, ...store.properties];
  notify();
  return property;
}

export function updatePropertyStatus(id: string, status: Property["status"]) {
  store.properties = store.properties.map((p) =>
    p.id === id ? { ...p, status } : p,
  );
  notify();
}

export function deleteProperty(id: string) {
  store.properties = store.properties.filter((p) => p.id !== id);
  notify();
}

export function addTestimonial(
  data: Omit<Testimonial, "id" | "approved" | "createdAt">,
): Testimonial {
  const testimonial: Testimonial = {
    ...data,
    id: `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    approved: false,
    createdAt: new Date().toISOString(),
  };
  store.testimonials = [testimonial, ...store.testimonials];
  notify();
  return testimonial;
}

export function approveTestimonial(id: string) {
  store.testimonials = store.testimonials.map((t) =>
    t.id === id ? { ...t, approved: true } : t,
  );
  notify();
}

export function rejectTestimonial(id: string) {
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  notify();
}

export function addContactMessage(
  data: Omit<ContactMessage, "id" | "status" | "createdAt">,
): ContactMessage {
  const message: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  store.contactMessages = [message, ...store.contactMessages];
  notify();
  return message;
}

export function updateMessageStatus(
  id: string,
  status: ContactMessage["status"],
) {
  store.contactMessages = store.contactMessages.map((m) =>
    m.id === id ? { ...m, status } : m,
  );
  notify();
}
