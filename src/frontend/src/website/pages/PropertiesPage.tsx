import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWebsiteStore } from "@/hooks/useWebsiteStore";
import { addContactMessage } from "@/store/websiteStore";
import type { Property } from "@/types/website";
import { PropertyCard } from "@/website/components/PropertyCard";
import { BedDouble, MapPin, Maximize2, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function PropertyDetailModal({
  property,
  onClose,
  onInquire,
}: {
  property: Property;
  onClose: () => void;
  onInquire: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-64">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-bold text-2xl">{property.price}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                {property.title}
              </h2>
              <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {property.location}
              </p>
            </div>
            <span
              className="px-3 py-1.5 rounded-full text-sm font-semibold shrink-0"
              style={{ background: "#dcfce7", color: "#15803d" }}
            >
              {property.status.charAt(0).toUpperCase() +
                property.status.slice(1)}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 py-4 mb-4 border-y border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="font-semibold text-sm text-gray-800">
                {property.propertyType}
              </p>
            </div>
            {property.bedrooms > 0 && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Bedrooms</p>
                <p className="font-semibold text-sm text-gray-800 flex items-center justify-center gap-1">
                  <BedDouble className="w-4 h-4 text-blue-500" />
                  {property.bedrooms}
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Area</p>
              <p className="font-semibold text-sm text-gray-800 flex items-center justify-center gap-1">
                <Maximize2 className="w-4 h-4 text-blue-500" />
                {property.area}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {property.description}
          </p>

          <Button
            className="w-full py-3 text-white font-bold"
            style={{ background: "#2563eb" }}
            onClick={onInquire}
          >
            Inquire About This Property
          </Button>
        </div>
      </div>
    </div>
  );
}

function InquiryModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `I am interested in the property: ${property.title} (${property.price}). Please provide more details.`,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addContactMessage({ name, phone, email, message });
      toast.success("Inquiry sent! We will contact you shortly.");
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inquire About Property</DialogTitle>
          <DialogDescription>
            {property.title} — {property.price}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="inq-name">Full Name *</Label>
            <Input
              id="inq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="inq-phone">Phone *</Label>
            <Input
              id="inq-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>
          <div>
            <Label htmlFor="inq-email">Email *</Label>
            <Input
              id="inq-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="inq-msg">Message</Label>
            <Textarea
              id="inq-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white"
            style={{ background: "#2563eb" }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PropertiesPage() {
  const store = useWebsiteStore();
  const [filter, setFilter] = useState<"all" | "available" | "sold" | "rented">(
    "all",
  );
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [inquireProperty, setInquireProperty] = useState<Property | null>(null);

  const filtered =
    filter === "all"
      ? store.properties
      : store.properties.filter((p) => p.status === filter);

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
            Properties
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Properties in Chikmagalur
          </h1>
          <p className="text-gray-300 text-lg">
            Browse premium residential and commercial properties managed by Indu
            Homes &amp; Estates Services.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {(
              [
                { key: "all", label: "All Properties" },
                { key: "available", label: "Available" },
                { key: "sold", label: "Sold" },
                { key: "rented", label: "Rented" },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                type="button"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: filter === f.key ? "#2563eb" : "#f3f4f6",
                  color: filter === f.key ? "#ffffff" : "#374151",
                }}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Properties grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No properties found for this filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onInquire={(p) => setInquireProperty(p)}
                  onClick={(p) => setDetailProperty(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Admin Note */}
      <div
        className="py-4"
        style={{ background: "#eff6ff", borderTop: "1px solid #bfdbfe" }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-blue-700">
            🏠 Showing {store.properties.length} properties. New properties can
            be added from the{" "}
            <a href="/admin/properties-admin" className="font-bold underline">
              Admin Dashboard
            </a>
            .
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onInquire={() => {
            setInquireProperty(detailProperty);
            setDetailProperty(null);
          }}
        />
      )}

      {/* Inquiry Modal */}
      {inquireProperty && (
        <InquiryModal
          property={inquireProperty}
          onClose={() => setInquireProperty(null)}
        />
      )}
    </div>
  );
}
