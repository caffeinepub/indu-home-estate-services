export interface Inspection {
  id: string;
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  preferredDate: string;
  notes: string;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  createdAt: string;
}

export interface Quotation {
  id: string;
  name: string;
  phone: string;
  serviceRequired: string;
  description: string;
  address: string;
  status: "pending" | "quoted" | "accepted" | "rejected";
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  status: "available" | "sold" | "rented";
  description: string;
  imageUrl: string;
  propertyType: string;
  bedrooms: number;
  area: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}
